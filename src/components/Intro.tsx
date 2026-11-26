import { useMemo } from 'react'

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

export function Intro() {
  const { faces, radius, offset } = useMemo(() => buildRing(PHRASE), [])

  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-scene">
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
