'use server'

import { queryStats } from '~/server/queries'

export async function LandingStats() {
  const { total, relevant, processed } = await queryStats()

  return (
    <div className='w-full bg-indigo-50 py-8 sm:py-12'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <dl className='grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3'>
          <div className='mx-auto flex max-w-xs flex-col gap-y-4'>
            <dt className='text-base/7 text-gray-600'>Total Papers Scrapped</dt>
            <dd className='order-first font-semibold text-3xl text-gray-900 tracking-tight sm:text-5xl'>
              {total.toLocaleString()}
            </dd>
          </div>
          <div className='mx-auto flex max-w-xs flex-col gap-y-4'>
            <dt className='text-base/7 text-gray-600'>Relevant Papers Found</dt>
            <dd className='order-first font-semibold text-3xl text-gray-900 tracking-tight sm:text-5xl'>
              {relevant.toLocaleString()}
            </dd>
          </div>
          <div className='mx-auto flex max-w-xs flex-col gap-y-4'>
            <dt className='text-base/7 text-gray-600'>Processed Papers</dt>
            <dd className='order-first font-semibold text-3xl text-gray-900 tracking-tight sm:text-5xl'>
              {processed.toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
