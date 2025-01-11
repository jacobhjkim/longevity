import type { Metadata } from 'next'
import type React from 'react'
import { LandingBlueprint } from '~/components/landing-blueprint'
import { Explanation } from '~/components/landing-explanation'
import { LandingFaq } from '~/components/landing-faq'
import { Features } from '~/components/landing-features'
import { Hero } from '~/components/landing-hero'
import { LandingStats } from '~/components/landing-stats'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Longevity Research AI Agent',
  description:
    "Can an autonomous DeSci (Decentralized Science) AI agent improve Bryan Johnson's Blueprint Protocol by reading every single research paper published in bioRxiv & medRxiv?",
  twitter: {
    card: 'summary_large_image',
    site: '@longevities_ai',
    creator: '@longevities_ai',
  },
}

export default async function Home() {
  return (
    <div className='h-full w-full flex-grow'>
      <main className='mx-auto flex h-full min-h-72 w-full flex-col items-center justify-center gap-4'>
        <Hero />
        <Explanation />
        <LandingStats />
        <Features />
        <LandingBlueprint />
        <LandingFaq />
      </main>
    </div>
  )
}
