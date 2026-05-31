import { useCallback, useState } from 'react'
import { motion } from 'motion/react'
import { EASE, fadeUp, site } from '../data/site'
import { CheckIcon, MailIcon } from './icons'

const transition = { duration: 0.38, ease: EASE }

export function CopyEmail() {
  const [copied, setCopied] = useState(false)

  const handleClick = useCallback(async () => {
    if (copied) return
    try {
      await navigator.clipboard.writeText(site.email)
    } catch {
      // ignore
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [copied])

  return (
    <motion.button
      onClick={() => void handleClick()}
      className="flex flex-col items-center gap-[4px] cursor-pointer outline-none bg-transparent border-none font-normal"
      style={{ fontFamily: "'Instrument Sans', sans-serif" }}
      aria-label="Copy email address"
      {...fadeUp(0.55)}
    >
      <div className="relative size-4 overflow-hidden">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={copied ? { y: '-100%', opacity: 0 } : { y: '0%', opacity: 1 }}
          transition={transition}
        >
          <MailIcon />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={copied ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
          transition={transition}
        >
          <CheckIcon />
        </motion.div>
      </div>

      <div className="relative h-6 w-[170px] overflow-hidden text-[13px] leading-[24px]">
        <motion.p
          className="absolute inset-x-0 text-center text-[#A2A2A2] whitespace-nowrap font-normal"
          initial={false}
          animate={copied ? { y: '-100%', opacity: 0 } : { y: '0%', opacity: 1 }}
          transition={transition}
        >
          {site.email}
        </motion.p>
        <motion.p
          className="absolute inset-x-0 text-center text-[#34C759] whitespace-nowrap font-normal"
          initial={false}
          animate={copied ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
          transition={transition}
        >
          Copied to clipboard
        </motion.p>
      </div>
    </motion.button>
  )
}
