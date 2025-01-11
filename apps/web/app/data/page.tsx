import type { Metadata } from 'next'
import { DataTable } from '~/components/data-table'
import { queryRelevantPapers } from '~/server/queries'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Raw Data',
  description: 'Raw data in a table format.',
}

export default async function DataPage() {
  const papers = await queryRelevantPapers()

  return (
    <div className='flex w-full flex-col items-center justify-center gap-4 py-4'>
      <DataTable papers={papers} />
    </div>
  )
}
