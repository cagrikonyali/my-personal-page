import { useEffect, useRef, useState } from 'react'
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

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function App() {
  const [showIntro, setShowIntro] = useState(() => !prefersReducedMotion())
  const scrollerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  // Remove the loading ring once its exit animation has finished
  useEffect(() => {
    if (!showIntro) return
    const t = window.setTimeout(() => setShowIntro(false), INTRO_MS)
    return () => window.clearTimeout(t)
  }, [showIntro])

  // Scroll-driven, smoothed word highlight + outro reveal
  useEffect(() => {
    const scroller = scrollerRef.current
    const track = trackRef.current
    if (!scroller || !track) return

    // Always start at the top: stop the browser from restoring an old scroll position
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    scroller.scrollTop = 0

    const reduce = prefersReducedMotion()
    const words = Array.from(textRef.current?.querySelectorAll<HTMLElement>('.word') ?? [])
    const n = words.length
    const lead = Math.min(LEAD_WORDS, n)
    let target = 0
    let p = 0
    let drawn = false
    let raf = 0

    const read = () => {
      const max = track.offsetHeight - scroller.clientHeight
      target = max > 0 ? Math.min(1, Math.max(0, (scroller.scrollTop - track.offsetTop) / max)) : 1
    }

    const apply = (v: number) => {
      // words light up left to right over the first 85% of the scroll
      const prog = lead + Math.max(0, Math.min(1, (v - 0.04) / 0.81)) * (n - lead)
      for (let i = 0; i < n; i++) {
        const k = Math.max(0, Math.min(1, prog - i))
        const c = Math.round(230 - k * (230 - 68)) // #E6E6E6 → #444444
        words[i].style.color = `rgb(${c},${c},${c})`
      }
      if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - v * 20))
      stageRef.current?.classList.toggle('on', v >= 0.88)
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const d = target - p
      if (Math.abs(d) < 0.0005 && drawn) return
      p = Math.abs(d) < 0.0005 ? target : p + d * (reduce ? 1 : 0.09)
      drawn = true
      apply(p)
    }

    // Page restored from the back/forward cache: start over from the top
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return
      scroller.scrollTop = 0
      target = 0
      p = 0
      drawn = false
    }

    read()
    scroller.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read)
    window.addEventListener('pageshow', onPageShow)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      scroller.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [])

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-white text-[#111111]">
      {/* scrolling is locked while the loading ring plays */}
      <div
        ref={scrollerRef}
        className={`scroller absolute inset-0 overflow-x-hidden ${showIntro ? 'overflow-y-hidden' : 'overflow-y-auto'}`}
      >
        <div ref={trackRef} className="relative h-[260vh]">
          <div
            ref={stageRef}
            className="sticky top-0 flex h-dvh min-h-[640px] flex-col items-center justify-center px-6 pt-[72px] pb-[140px] text-center"
          >
            {/* photo */}
            <div className="relative mb-11 size-24">
              <div className="avatar-ghost absolute inset-0 rounded-[28px] bg-[#EDEDEA] shadow-[0_16px_36px_-18px_rgba(0,0,0,0.2)]" aria-hidden="true" />
              <div className="avatar-in absolute inset-0 overflow-hidden rounded-[28px] bg-[#111111] shadow-[0_26px_46px_-18px_rgba(0,0,0,0.42),0_2px_6px_rgba(0,0,0,0.08)]">
                <img src={site.profileImage} alt="Portrait of Çağrı Konyalı" className="block size-full object-cover" />
              </div>
            </div>

            <h1 className="rise d1 mb-10 text-[40px] leading-[1.15] font-bold tracking-[-0.04em] text-[#111111]">
              <span className="font-semibold text-[#DDDDDD]">Hey,</span> I’m Çağrı.
            </h1>

            {/* bio, highlighted word by word on scroll */}
            <div
              ref={textRef}
              className="flex w-full max-w-[460px] flex-col gap-[22px] text-[22px] leading-[1.45] font-medium tracking-[-0.025em]"
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

            {/* scroll hint */}
            <div className="rise d4 pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
              <div ref={hintRef} aria-hidden="true" className="transition-opacity duration-400">
                <div className="relative h-[34px] w-[22px] rounded-[12px] border-[1.5px] border-[#BDBDBD]">
                  <span className="mouse-wheel absolute top-[7px] left-1/2 -ml-[1.5px] h-[6px] w-[3px] rounded-[2px] bg-[#8A8A8A]" />
                </div>
              </div>
            </div>

            {/* footer */}
            <footer className="outro o2 absolute inset-x-0 bottom-10 flex flex-col items-center gap-1 text-[12px] leading-5 font-normal">
              <p className="m-0 text-[#5C5C5C]">© Çağrı Konyalı</p>
              <p className="m-0 text-[#D1CECE]">Clarity over noise.</p>
            </footer>
          </div>
        </div>
      </div>

      {showIntro && <Intro />}
    </div>
  )
}

export default App
