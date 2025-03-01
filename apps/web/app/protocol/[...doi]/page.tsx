import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { ProtocolTabs } from '~/components/protocol-tabs'
import { diff, insertDiffComponent } from '~/lib/diff'
import { queryProtocolUpdateByDOI, queryProtocolUpdateDOI } from '~/server/queries'

export const dynamic = 'force-static'

export async function generateMetadata({ params }: { params: { doi: string[] } }): Promise<Metadata> {
  const doi = params.doi.slice(0, 2).join('/')
  const paper = await queryProtocolUpdateByDOI(doi)

  if (!paper) {
    return {}
  }

  return {
    title: 'Protocol',
    description: `Longevity insights AI agent generated from ${paper.title}.`,
    twitter: {
      card: 'summary',
      site: '@longevities_ai',
      creator: '@longevities_ai',
      title: paper.title,
      description: `Longevity insights AI agent generated from ${paper.title}.`,
    },
  }
}

export async function generateStaticParams() {
  return (await queryProtocolUpdateDOI()).map((x) => x.doi)
}

async function getUpdate(doi: string) {
  const data = await queryProtocolUpdateByDOI(doi)
  if (!data) {
    return null
  }
  return diff(data)
}

export default async function IndividualResearchPage({ params }: { params: { doi: string[] } }) {
  if (params.doi.length < 2) {
    return notFound()
  }
  const doi = params.doi.slice(0, 2).join('/')
  const data = await getUpdate(doi)
  if (!data) {
    return notFound()
  }

  const protocols = insertDiffComponent(data)

  return (
    <div className='h-full flex-grow'>
      <main className='mx-auto flex h-full min-h-72 w-full flex-col items-center justify-center gap-8 py-6'>
        <React.Suspense fallback={<div>Loading...</div>}>
          <ProtocolTabs protocols={protocols} />
        </React.Suspense>
      </main>
    </div>
  )
}
