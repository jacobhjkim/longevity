import { eat, exercise, females, measurements, pregnancy } from '@repo/protocol-data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs'
import type { Metadata } from 'next'
import type React from 'react'
import { Markdown } from '~/components/markdown'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Protocol',
  description: "Baseline longevity protocol from Bryan Johnson's Blueprint",
}

function Content({
  protocol,
}: {
  protocol: string
}) {
  return (
    <section id={protocol} className='py-6 sm:py-4 lg:overflow-visible lg:px-0'>
      <div className='w-full'>
        <Markdown
          content={
            protocol === 'eat'
              ? eat
              : protocol === 'measurements'
                ? measurements
                : protocol === 'exercise'
                  ? exercise
                  : protocol === 'females'
                    ? females
                    : pregnancy
          }
        />
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

export default function ProtocolPage() {
  return (
    <div className='h-full flex-grow'>
      <main className='mx-auto flex h-full min-h-72 w-full flex-col items-center justify-center gap-8 py-6'>
        <Tabs defaultValue='measurements' className='flex w-full flex-col items-center justify-center'>
          <TabsList className='z-50 mx-auto w-full max-w-2xl'>
            {protocol.map(({ title, value }) => (
              <TabsTrigger key={value} value={value} className='w-1/5 truncate text-xs md:text-sm'>
                {title}
              </TabsTrigger>
            ))}
          </TabsList>

          {protocol.map(({ value }) => (
            <TabsContent key={value} value={value}>
              <Content protocol={value} />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
