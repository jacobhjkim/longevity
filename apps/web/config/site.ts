const ca = '9yBr75m6TBZzQqHeh1ztfv454pmqAiAvHUHdpPQcpump'

export const siteConfig = {
  name: 'longevities.fun',
  url: 'https://longevities.fun',
  ogImage: 'https://longevities.fun/og.jpg',
  description: "An AI agent that mimics Bryan Johnson's Blueprint protocol.",
  ca,
  links: {
    twitter: 'https://x.com/longevities_ai',
    github: 'https://github.com/jacobhjkim/longevity',
    telegram: 'https://t.me/longevity_ai_portal',
    dexscreener: `https://dexscreener.com/solana/${ca}`,
    myTwitter: 'https://twitter.com/jacobhjkim',
  },
  navLinks: [
    {
      label: 'Research',
      href: '/research',
    },
    {
      label: 'Protocol',
      href: '/protocol',
    },
    {
      label: 'Raw Data',
      href: '/data',
    },
  ],
  sidebarLinks: [
    {
      label: 'GitHub',
      href: 'https://github.com/jacobhjkim/longevity',
    },
    {
      label: 'Twitter',
      href: 'https://x.com/longevities_ai',
    },
    {
      label: 'Telegram',
      href: 'https://t.me/longevity_ai_portal',
    },
  ],
}
