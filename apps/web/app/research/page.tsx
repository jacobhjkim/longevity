import type { Metadata } from 'next'
import type React from 'react'
import { ResearchPapersList } from '~/components/research-papers-list'
import { ResearchStats } from '~/components/research-stats'
import { diffList } from '~/lib/diff'
import { queryProtocolUpdate } from '~/server/queries'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Research',
  description: 'Research results from the Longevity Research AI Agent',
}

export default async function ResearchPage() {
  const papers = diffList(await queryProtocolUpdate())

  return (
    <div className='h-full flex-grow'>
      <main className='mx-auto flex h-full min-h-72 w-full max-w-screen-xl flex-col items-center justify-center gap-8 py-6'>
        <ResearchStats />
        <ResearchPapersList papers={papers} />
      </main>
    </div>
  )
}
