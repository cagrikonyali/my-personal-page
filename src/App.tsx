import { useEffect, useRef, useState } from 'react'
import { Aura } from './components/Aura'
import { Intro } from './components/Intro'
import { SocialLinks } from './components/SocialLinks'
import { site } from './data/site'

const BIO = [
  'A product designer based in Istanbul, currently designing AI products at AppNation.',
  'I care about clarity, calm interfaces and digital experiences that feel human.',
]

// Words that are already dark when the bio appears ("A product")
const LEAD_WORDS = 2
const INTRO_MS = 5600
const AURA_START_MS = 4500 // colors start as the loading ring fades out

// Auto highlight timing (ms from page load)
const HIGHLIGHT_START_WITH_INTRO = 6500
const HIGHLIGHT_START_NO_INTRO = 900
const MS_PER_WORD = 110 // reading pace
const WORD_SOFTNESS = 3 // how many words the light-up gradient spans
const OUTRO_AFTER_MS = 250 // pause before the icons come in

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function App() {
  const [showIntro, setShowIntro] = useState(() => !prefersReducedMotion())
  // keep the loading ring smooth: the moving colors are only mounted once it is fading out
  const [showAura, setShowAura] = useState(() => prefersReducedMotion())
  const stageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showAura) return
    const t = window.setTimeout(() => setShowAura(true), AURA_START_MS)
    return () => window.clearTimeout(t)
  }, [showAura])

  // Remove the loading ring once its exit animation has finished
  useEffect(() => {
    if (!showIntro) return
    const t = window.setTimeout(() => setShowIntro(false), INTRO_MS)
    return () => window.clearTimeout(t)
  }, [showIntro])

  // Bio highlights itself word by word, then the social icons and footer come in
  useEffect(() => {
    const words = Array.from(textRef.current?.querySelectorAll<HTMLElement>('.word') ?? [])
    const n = words.length
    const lead = Math.min(LEAD_WORDS, n)
    const reduce = prefersReducedMotion()
    const startAt = reduce ? 0 : showIntro ? HIGHLIGHT_START_WITH_INTRO : HIGHLIGHT_START_NO_INTRO
    const duration = (n - lead + WORD_SOFTNESS) * MS_PER_WORD
    const t0 = performance.now()
    let raf = 0

    const paint = (prog: number) => {
      for (let i = 0; i < n; i++) {
        const k = i < lead ? 1 : Math.max(0, Math.min(1, (prog - (i - lead)) / WORD_SOFTNESS))
        const c = Math.round(217 - k * (217 - 68)) // #D9D9D9 → #444444
        words[i].style.color = `rgb(${c},${c},${c})`
      }
    }

    if (reduce) {
      paint(Infinity)
      stageRef.current?.classList.add('on')
      return
    }

    paint(0)
    const tick = (now: number) => {
      const elapsed = now - t0 - startAt
      paint(Math.max(0, elapsed) / MS_PER_WORD)
      if (elapsed >= duration + OUTRO_AFTER_MS) {
        stageRef.current?.classList.add('on')
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // runs once on load; showIntro only decides the initial delay
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-white text-[#111111]">
      {showAura && <Aura />}

      <div className="absolute inset-0 overflow-x-hidden overflow-y-auto">
        <div
          ref={stageRef}
          className="relative flex min-h-full flex-col items-center justify-center px-6 pt-[72px] pb-[140px] text-center"
        >
          {/* photo */}
          <div className="relative mb-11 size-24">
            <div
              className="avatar-ghost absolute inset-0 rounded-[28px] bg-[linear-gradient(180deg,#EBEBEB_0%,rgba(235,235,235,0.1)_100%)] backdrop-blur-[10px]"
              aria-hidden="true"
            />
            <div className="avatar-in absolute inset-0 overflow-hidden rounded-[28px] bg-[#111111] shadow-[0_18px_36px_-16px_rgba(0,0,0,0.32),0_2px_6px_rgba(0,0,0,0.06)]">
              <img src={site.profileImage} alt="Portrait of Çağrı Konyalı" className="block size-full object-cover" />
            </div>
          </div>

          <h1 className="rise d1 mb-10 text-[40px] leading-[1.15] font-bold tracking-[-0.04em] text-[#111111]">
            <span className="font-semibold text-[#C8C8C8]">Hey,</span> I’m Çağrı.
          </h1>

          {/* bio, highlighted word by word automatically */}
          <div
            ref={textRef}
            className="flex w-full max-w-[460px] flex-col gap-5 text-[20px] leading-[1.5] font-normal tracking-[-0.025em]"
          >
            {BIO.map((para, pi) => (
              <p key={pi} className={`rise ${pi === 0 ? 'd2' : 'd3'} m-0`}>
                {para.split(' ').map((w, wi) => (
                  <span key={wi}>
                    <span className="word">{w}</span>{' '}
                  </span>
                ))}
              </p>
            ))}
          </div>

          <SocialLinks />

          {/* footer */}
          <footer className="outro o2 absolute inset-x-0 bottom-10 flex flex-col items-center gap-1 text-[12px] leading-5 font-normal">
            <p className="m-0 text-[#4A4A4A]">© Çağrı Konyalı</p>
            <p className="m-0 text-[#6E6B6B]">Clarity over noise.</p>
          </footer>
        </div>
      </div>

      {showIntro && <Intro />}
    </div>
  )
}

export default App
