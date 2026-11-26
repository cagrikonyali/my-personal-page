import { useEffect, useMemo, useRef } from 'react'

const PHRASE = 'Clarity over noise'
const FONT_SIZE = 32

// Approximate advance widths (em) for Instrument Sans, used to lay letters on the ring
function em(ch: string) {
  if (ch === ' ') return 0.27
  if ("iljıİ.,'|!:;".includes(ch)) return 0.25
  if ('tfr'.includes(ch)) return 0.36
  if ('mMW'.includes(ch)) return 0.84
  if ('wOQCGD'.includes(ch)) return 0.72
  if (ch === ch.toUpperCase() && ch !== ch.toLowerCase()) return 0.64
  return 0.54
}

type Face = { line: boolean; c: string; w: number; a: number }

function buildRing(phrase: string) {
  const GAP = 2.6 * FONT_SIZE
  const LINE = 0.9 * FONT_SIZE
  const segs: { k: 'c' | 'g' | 'l'; c?: string; w: number }[] = []
  // same weight (500) and letter-spacing (-0.025em) as the bio
  const pushText = () =>
    Array.from(phrase).forEach((c) => segs.push({ k: 'c', c, w: (em(c) + 0.015 - 0.025) * FONT_SIZE }))

  pushText()
  const phraseLen = segs.reduce((a, b) => a + b.w, 0)
  segs.push({ k: 'g', w: GAP }, { k: 'l', w: LINE }, { k: 'g', w: GAP })
  pushText()
  segs.push({ k: 'g', w: GAP }, { k: 'l', w: LINE }, { k: 'g', w: GAP })

  const total = segs.reduce((a, b) => a + b.w, 0)
  const radius = Math.round(total / (2 * Math.PI))
  const faces: Face[] = []
  let acc = 0
  for (const sg of segs) {
    const a = ((acc + sg.w / 2) / total) * 360
    acc += sg.w
    if (sg.k === 'g') continue
    faces.push({
      line: sg.k === 'l',
      c: sg.k === 'c' ? (sg.c === ' ' ? ' ' : sg.c!) : '',
      w: sg.w + 0.6,
      a,
    })
  }
  // begin and end the single turn with the phrase facing the viewer
  const offset = -((phraseLen / 2) / total) * 360
  return { faces, radius, offset }
}

type Drop = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; c: string }

// Tiny color droplets flung off the spinning ring, like a mixer: more when it spins faster
function startSplash(cv: HTMLCanvasElement, scene: HTMLElement, ringRadius: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const rect = cv.getBoundingClientRect()
  cv.width = Math.round(rect.width * dpr)
  cv.height = Math.round(rect.height * dpr)
  const ctx = cv.getContext('2d')
  if (!ctx) return () => {}
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const COLORS = ['#FF7A4D', '#FF5FA2', '#9B7BFF', '#4E9BFF', '#2FC79B']
  // mirrors the spin keyframe: 4.4s, delay .15s, cubic-bezier(.45,.05,.3,1), 0 → -360deg
  const bez = (p1: number, p2: number, t: number) =>
    3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t
  const ease = (x: number) => {
    let lo = 0
    let hi = 1
    let t = x
    for (let i = 0; i < 24; i++) {
      t = (lo + hi) / 2
      if (bez(0.45, 0.3, t) < x) lo = t
      else hi = t
    }
    return bez(0.05, 1, t)
  }
  const DUR = 4.4
  const DELAY = 0.15
  const STOP = 4.25
  const angleAt = (sec: number) => -2 * Math.PI * ease(Math.max(0, Math.min(1, (sec - DELAY) / DUR)))
  const zoom = window.innerWidth <= 700 ? 0.8 : 1
  const R = ringRadius * zoom
  const tx = (-8 * Math.PI) / 180
  const rz = (16 * Math.PI) / 180
  // rotateX(-8deg) then rotate(16deg), orthographic
  const project = (x: number, y: number, z: number): [number, number] => {
    const y1 = y * Math.cos(tx) - z * Math.sin(tx)
    return [x * Math.cos(rz) - y1 * Math.sin(rz), x * Math.sin(rz) + y1 * Math.cos(rz)]
  }

  const drops: Drop[] = []
  const t0 = performance.now()
  let last = t0
  let prevA = 0
  let raf = 0

  const loop = (now: number) => {
    const sec = (now - t0) / 1000
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    const a = angleAt(sec)
    const w = Math.abs(a - prevA) / Math.max(dt, 1e-3) // rad/s
    prevA = a
    const sr = scene.getBoundingClientRect()
    const cx = sr.left + sr.width / 2 - rect.left
    const cy = sr.top + sr.height / 2 - rect.top

    if (sec < STOP) {
      let n = (w * 1.6 * dt * 60) / 2.6 // ~1.6 drops per frame at full speed
      while (n > 0) {
        if (Math.random() < n) {
          const th = Math.random() * Math.PI * 2 + a
          const yOff = (Math.random() - 0.5) * 30 * zoom
          const [px, py] = project(R * Math.sin(th), yOff, R * Math.cos(th))
          const sp = w * R * (0.55 + Math.random() * 0.5)
          const [tvx, tvy] = project(-Math.cos(th), 0, Math.sin(th)) // spin direction
          const [ox, oy] = project(Math.sin(th), 0, Math.cos(th)) // outward
          const out = 40 + Math.random() * 90
          drops.push({
            x: cx + px,
            y: cy + py,
            vx: tvx * sp + ox * out,
            vy: tvy * sp + oy * out,
            life: 0,
            max: 0.55 + Math.random() * 0.6,
            r: 0.5 + Math.random() * 0.9,
            c: COLORS[(Math.random() * COLORS.length) | 0],
          })
        }
        n -= 1
      }
    }

    ctx.clearRect(0, 0, rect.width, rect.height)
    ctx.lineCap = 'round'
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i]
      d.life += dt
      if (d.life >= d.max) {
        drops.splice(i, 1)
        continue
      }
      d.vx *= Math.pow(0.3, dt)
      d.vy = d.vy * Math.pow(0.3, dt) + 260 * dt
      d.x += d.vx * dt
      d.y += d.vy * dt
      const k = 1 - d.life / d.max
      ctx.globalAlpha = Math.min(1, 1.25 * k)
      ctx.strokeStyle = d.c
      ctx.lineWidth = d.r * 2 * (0.6 + 0.4 * k)
      ctx.beginPath()
      ctx.moveTo(d.x, d.y)
      ctx.lineTo(d.x - d.vx * 0.02, d.y - d.vy * 0.02)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
    if (sec < 5.6) raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)
  return () => cancelAnimationFrame(raf)
}

export function Intro() {
  const { faces, radius, offset } = useMemo(() => buildRing(PHRASE), [])
  const splashRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!splashRef.current || !sceneRef.current) return
    return startSplash(splashRef.current, sceneRef.current, radius)
  }, [radius])

  return (
    <div className="intro" aria-hidden="true">
      <canvas ref={splashRef} className="intro-splash" />
      <div ref={sceneRef} className="intro-scene">
        <div className="intro-tilt">
          <div className="intro-spin">
            <div className="intro-ring" style={{ transform: `rotateY(${offset}deg)` }}>
              {faces.map((f, i) => (
                <div
                  key={i}
                  className="intro-face"
                  style={{
                    width: `${f.w}px`,
                    marginLeft: `${-f.w / 2}px`,
                    transform: `rotateY(${f.a}deg) translateZ(${radius}px)`,
                  }}
                >
                  {f.line ? (
                    <>
                      <span className="intro-line intro-front" />
                      <span className="intro-line intro-back" />
                    </>
                  ) : (
                    <>
                      <span className="intro-glyph intro-front">{f.c}</span>
                      <span className="intro-glyph intro-back">{f.c}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
