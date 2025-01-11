'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { Markdown } from '~/components/markdown'
import type { insertDiffComponent } from '~/lib/diff'

function ContentWithDiff({
  content,
}: {
  content: string
}) {
  return (
    <section className='py-6 sm:py-4 lg:overflow-visible lg:px-0'>
      <div className='w-full'>
        <Markdown content={content} />
      </div>
    </section>
  )
}

const protocol = [
  { title: 'Eat', value: 'eat' },
  { title: 'Measurements', value: 'measurements' },
  { title: 'Exercise', value: 'exercise' },
  { title: 'Females', value: 'females' },
  { title: 'Pregnancy', value: 'pregnancy' },
]

export function ProtocolTabs({ protocols }: { protocols: ReturnType<typeof insertDiffComponent> }) {
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')

  React.useEffect(() => {
    const element = document.getElementById('diff-0')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <Tabs defaultValue={tab ?? 'measurements'} className='flex w-full flex-col items-center justify-center'>
      <TabsList className='z-50 mx-auto w-full max-w-2xl'>
        {protocol.map(({ title, value }) => (
          <TabsTrigger key={value} value={value} className='w-1/5 truncate text-xs md:text-sm'>
            {title}
          </TabsTrigger>
        ))}
      </TabsList>

      {protocol.map(({ value }) => (
        <TabsContent key={value} value={value}>
          <ContentWithDiff content={protocols[value as keyof typeof protocols]} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
