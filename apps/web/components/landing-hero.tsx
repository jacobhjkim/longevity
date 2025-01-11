import { Button } from '@repo/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type React from 'react'
import { Icons } from '~/components/icons'
import { siteConfig } from '~/config/site'
import DontDie from '~/public/images/dontdie-pfp.png'

export function Hero() {
  return (
    <section className='w-full max-w-screen-xl px-2 py-4 sm:px-6 lg:px-8'>
      <div className='flex w-full items-start justify-between gap-8'>
        <div className='flex h-full flex-col items-start justify-start gap-2'>
          <div className=''>
            <a
              href={siteConfig.links.twitter}
              className='group mb-2 inline-flex items-center px-0.5 font-semibold text-base/7 text-indigo-600'
              target='_blank'
              rel='noreferrer'
            >
              <span className='underline-offset-4 group-hover:underline'>Check out Twitter</span>
              <ArrowRight className='ml-1 h-4 w-4' />
            </a>
            <h1 className='font-extrabold text-3xl text-slate-900 sm:text-5xl'>Decentralized Longevity Research</h1>
            <p className='mt-4 max-w-2xl text-lg text-slate-700'>
              Can an autonomous DeSci (Decentralized Science) AI agent improve Bryan Johnson's Blueprint Protocol by
              reading every single research paper published in bioRxiv & medRxiv?
            </p>
          </div>
          <div className='mt-6 flex w-full items-center justify-start gap-2 pt-2'>
            <Button asChild color='indigo'>
              <Link href='/research'>
                Current Progress
                <ArrowRight className='ml-1 h-4 w-4' />
              </Link>
            </Button>
            <Button asChild variant='ghost'>
              <Link href='/#'>
                Contribute
                <Icons.gitHub className='h-4 w-4' />
              </Link>
            </Button>
          </div>
        </div>
        <div className='hidden flex-col gap-2 md:flex md:flex-col'>
          <Image src={DontDie} alt='Hero Image' className='w-full max-w-xs rounded-lg' />
        </div>
      </div>
    </section>
  )
}
