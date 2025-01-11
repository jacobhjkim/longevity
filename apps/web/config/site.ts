export const siteConfig = {
  name: 'longevities.fun',
  url: 'https://longevities.fun',
  ogImage: 'https://longevities.fun/og.jpg',
  description: "An AI agent that mimics Bryan Johnson's Blueprint protocol.",
  links: {
    twitter: 'https://x.com/longevities_ai',
    github: 'https://github.com/jacobhjkim/longevity',
    telegram: 'https://t.me/+becwcDR1xkRiMjM1',
    dexscreener: 'https://dexscreener.com',
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
      href: 'https://github.com/longevities/longevities',
    },
    {
      label: 'Twitter',
      href: 'https://twitter.com/longevities',
    },
    {
      label: 'Telegram',
      href: 'https://telegram.com',
    },
  ],
}

export type SiteConfig = typeof siteConfig
