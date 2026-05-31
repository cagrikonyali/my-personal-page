import { Fragment } from 'react'
import { motion } from 'motion/react'
import { externalLinkProps, fadeUp, site } from '../data/site'

export function SocialLinks() {
  return (
    <motion.div
      className="flex items-center justify-between w-full"
      {...fadeUp(0.66)}
    >
      {site.social.map((link, index) => (
        <Fragment key={link.label}>
          <a
            href={link.url}
            {...externalLinkProps}
            className="flex items-center justify-center p-[10px] size-11 text-[13px] font-normal no-underline text-[#A2A2A2] hover:text-[#4A4A4A] transition-colors duration-200"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
          >
            {link.label}
          </a>
          {index < site.social.length - 1 ? (
            <svg
              className="size-[3px] shrink-0"
              fill="none"
              viewBox="0 0 3 3"
              aria-hidden
            >
              <circle cx="1.5" cy="1.5" fill="#E9E9E9" r="1.5" />
            </svg>
          ) : null}
        </Fragment>
      ))}
    </motion.div>
  )
}
