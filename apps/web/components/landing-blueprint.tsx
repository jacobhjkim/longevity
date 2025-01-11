import Image from 'next/image'
import type React from 'react'
import DontDieNetflix from '~/public/images/dont-die-netflix.jpeg'

export function LandingBlueprint() {
  return (
    <section id='about' className='mx-auto flex w-full items-center justify-center bg-indigo-50'>
      <div className='flex w-full max-w-screen-xl flex-col items-start justify-start gap-4 px-6 py-4 md:px-10 lg:px-12'>
        <div className='grid grid-cols-1 items-start justify-start gap-6 py-8 text-left lg:grid-cols-4 lg:py-12'>
          <div className='flex flex-col gap-6 lg:col-span-3'>
            <h2 className='font-semibold text-3xl'>
              Who is Bryan Johnson, <br /> and what is the Blueprint Protocol?
            </h2>
            <div className='flex max-w-xl flex-col gap-2'>
              <p>
                Bryan Johnson is famously known for his longevity protocol called Blueprint. If you want to learn more
                about Bryan's journey, I recommend watching his{' '}
                <a href='https://www.netflix.com/title/81757532' className='text-indigo-600'>
                  DON'T DIE
                </a>{' '}
                documentary on Netflix.
              </p>
              <p>
                This experimental project has <strong className=''>NO AFFILIATION</strong> with Bryan or his company in
                any way.
              </p>
            </div>
          </div>

          <Image
            src={DontDieNetflix}
            alt='dont die netflix poster'
            className='w-full max-w-lg rounded-lg lg:col-span-1'
          />
        </div>
      </div>
    </section>
  )
}
