import type { ReactNode } from 'react'
import { externalLinkProps, site } from '../data/site'

const iconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

const icons: Record<string, { name: string; svg: ReactNode }> = {
  LN: {
    name: 'LinkedIn',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M8 10.5v6M8 7.5v.01M12 16.5v-6M12 13a2.5 2.5 0 0 1 5 0v3.5" />
      </svg>
    ),
  },
  IG: {
    name: 'Instagram',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5v.01" />
      </svg>
    ),
  },
  X: {
    name: 'X',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" {...iconProps}>
        <path d="M4 4l16 16M20 4L4 20" />
      </svg>
    ),
  },
  MD: {
    name: 'Medium',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" {...iconProps}>
        <circle cx="7.5" cy="12" r="4.5" />
        <ellipse cx="16" cy="12" rx="2.2" ry="4.3" />
        <path d="M20.5 8v8" />
      </svg>
    ),
  },
  DB: {
    name: 'Dribbble',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M4.5 8.5c5 .6 10-.8 13.6-4.2M3.3 13.3c5.4-2.2 11-2 16.3.8M8.8 3.6c3.2 4.2 5.6 10.2 6.6 16.8" />
      </svg>
    ),
  },
}

// Round liquid-glass icons; they come in one by one, left to right
export function SocialLinks() {
  return (
    <nav aria-label="Social links" className="mt-16 flex flex-wrap justify-center gap-[10px]">
      {site.social.map((link, i) => {
        const icon = icons[link.label]
        return (
          <span key={link.label} className={`outro s${i + 1} inline-flex`}>
            <a
              href={link.url}
              {...externalLinkProps}
              aria-label={icon?.name ?? link.label}
              className="glass flex size-[52px] items-center justify-center text-[#111111]"
            >
              {icon?.svg ?? link.label}
            </a>
          </span>
        )
      })}
    </nav>
  )
}
