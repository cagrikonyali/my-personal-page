export const site = {
  profileImage: '/profile.png',
  email: 'hey@cagri.design',
  viewWorkHref: 'https://cagri.design',
  social: [
    { label: 'LN', url: 'https://linkedin.com/in/cagrikonyali' },
    { label: 'IG', url: 'https://instagram.com/cagrikonyali' },
    { label: 'X', url: 'https://x.com/cagrikonyali' },
    { label: 'MD', url: 'https://medium.com/@cagrikonyali' },
    { label: 'DB', url: 'https://dribbble.com/cagrikonyali' },
  ],
} as const

export const externalLinkProps = {
  target: '_blank' as const,
  rel: 'noopener noreferrer' as const,
}

export const EASE = [0.16, 1, 0.3, 1] as const

export function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.72, ease: EASE, delay },
  }
}
