'use server'

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card'
import { BadgeCheck, BookCheckIcon, BookmarkXIcon, LoaderCircle } from 'lucide-react'
import { queryStats } from '~/server/queries'

export async function ResearchStats() {
  const { total, relevant, irrelevant, processed } = await queryStats()

  return (
    <section className='flex w-full flex-col items-start justify-center gap-4 px-6 lg:px-8'>
      <div className='flex w-full items-center justify-between gap-4'>
        <h2 className='font-bold text-lg md:text-3xl'>Research Status</h2>
        <p className='text-muted-foreground text-sm'>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      <div className='grid w-full grid-cols-2 gap-2 lg:grid-cols-4'>
        <Card x-chunk='A card showing the total number of research papers'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Total Papers Scrapped</CardTitle>
            <BookCheckIcon className='h-6 w-6 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='font-bold text-2xl'>{total.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card x-chunk='A card showing the total number of relevant research papers'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Relevant Papers</CardTitle>
            <BadgeCheck className='h-6 w-6 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='font-bold text-2xl'>{relevant.toLocaleString()}</div>
            <p className='text-muted-foreground text-xs'>{Number((relevant / total) * 100).toFixed(2)}% of total</p>
          </CardContent>
        </Card>

        <Card x-chunk='A card showing the total number of irrelevant research papers'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Irrelevant Papers</CardTitle>
            <BookmarkXIcon className='h-6 w-6 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='font-bold text-2xl'>{irrelevant.toLocaleString()}</div>
            <p className='text-muted-foreground text-xs'>{Number((irrelevant / total) * 100).toFixed(2)}% of total</p>
          </CardContent>
        </Card>

        <Card x-chunk='A card showing the total number of papers in the pipeline'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Processed Papers...</CardTitle>
            <LoaderCircle className='h-6 w-6 animate-spin text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='font-bold text-2xl'>{processed.toLocaleString()}</div>
            <p className='text-muted-foreground text-xs'>{Number((processed / total) * 100).toFixed(2)}% of total</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
