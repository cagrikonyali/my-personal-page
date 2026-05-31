import { motion } from 'motion/react'
import { CopyEmail } from './components/CopyEmail'
import { SocialLinks } from './components/SocialLinks'
import { externalLinkProps, fadeUp, site } from './data/site'

function App() {
  return (
    <div
      className="flex h-dvh flex-col bg-white overflow-hidden"
      style={{ fontFamily: "'Instrument Sans', sans-serif" }}
    >
      <main className="flex flex-1 flex-col items-center justify-between overflow-hidden px-6 py-10">
        <div />

        <div className="flex flex-col items-center gap-8 w-full max-w-[313px]">
          <motion.div className="relative shrink-0 size-[72px]" {...fadeUp(0)}>
            <div className="absolute flex items-center justify-center left-[-16.5px] size-[85.396px] top-[-7.18px]">
              <div className="-rotate-12 flex-none">
                <div className="bg-gradient-to-b from-[#ebebeb] to-[rgba(235,235,235,0.1)] relative rounded-[16px] size-[72px]" />
              </div>
            </div>
            <div className="-translate-x-1/2 absolute left-1/2 rounded-[20px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.25)] size-[72px] top-0">
              <img
                alt="Çağrı Konyalı"
                className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full"
                src={site.profileImage}
              />
            </div>
          </motion.div>

          <motion.div
            className="flex gap-2 items-center justify-center text-[32px] tracking-[-0.64px] w-full whitespace-nowrap"
            {...fadeUp(0.11)}
          >
            <span className="font-semibold text-[#DDDDDD]">Hey,</span>
            <span className="font-bold text-[#111111]">I'm Çağrı.</span>
          </motion.div>

          <div className="flex flex-col items-center gap-4 text-[13px] text-center leading-[24px] w-full">
            <motion.p className="text-[#444444] font-normal" {...fadeUp(0.22)}>
              A product designer based in Istanbul,
              <br />
              currently designing AI products at AppNation.
            </motion.p>
            <motion.p className="text-[#A2A2A2] font-normal" {...fadeUp(0.33)}>
              I care about clarity, calm interfaces
              <br />
              and digital experiences that feel human.
            </motion.p>
          </div>

          <motion.div
            className="bg-[#F5F5F5] p-[5px] rounded-full"
            {...fadeUp(0.44)}
          >
            <a
              href={site.viewWorkHref}
              {...externalLinkProps}
              className="bg-white flex items-center gap-2 h-12 px-6 rounded-full shadow-[0px_4px_8px_rgba(0,0,0,0.06)] border border-transparent text-[12px] font-normal leading-5 text-black no-underline cursor-pointer transition-all duration-300 ease-out hover:shadow-[0px_8px_16px_rgba(0,0,0,0.10)] hover:-translate-y-[2px] hover:border-[rgba(0,0,0,0.08)] active:translate-y-0 active:shadow-[0px_4px_8px_rgba(0,0,0,0.06)]"
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}
            >
              <span>View Work</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.33334 2.19297V6.75404C8.33334 6.89362 8.2779 7.02748 8.17921 7.12618C8.08053 7.22487 7.94669 7.28032 7.80713 7.28032C7.66757 7.28032 7.53373 7.22487 7.43504 7.12618C7.33636 7.02748 7.28092 6.89362 7.28092 6.75404V3.4648L2.56652 8.17894C2.46767 8.27781 2.3336 8.33335 2.19379 8.33335C2.05399 8.33335 1.91992 8.27781 1.82106 8.17894C1.72221 8.08007 1.66667 7.94598 1.66667 7.80616C1.66667 7.66634 1.72221 7.53225 1.82106 7.43338L6.53546 2.71924H3.24665C3.10709 2.71924 2.97325 2.6638 2.87456 2.5651C2.77588 2.4664 2.72044 2.33254 2.72044 2.19297C2.72044 2.05339 2.77588 1.91953 2.87456 1.82083C2.97325 1.72213 3.10709 1.66669 3.24665 1.66669H7.80713C7.94669 1.66669 8.08053 1.72213 8.17921 1.82083C8.2779 1.91953 8.33334 2.05339 8.33334 2.19297Z" fill="#444444"/>
              </svg>
            </a>
          </motion.div>

          <div className="flex w-full flex-col items-center gap-4">
            <CopyEmail />
            <SocialLinks />
          </div>
        </div>

        <motion.div
          className="flex flex-col items-center gap-1 text-[12px] text-center leading-5"
          {...fadeUp(0.77)}
        >
          <p className="text-[#5C5C5C] font-normal">© Çağrı Konyalı</p>
          <p className="text-[#D1CECE] font-normal">Clarity over noise.</p>
        </motion.div>
      </main>
    </div>
  )
}

export default App
