import Image from 'next/image'
import type React from 'react'
import FinalStep from '~/public/images/final-step.png'
import FirstStep from '~/public/images/first-step.png'
import Line1 from '~/public/images/line-1.webp'
import Line2 from '~/public/images/line-2.svg'
import SecondStep from '~/public/images/second-step.png'

export function Explanation() {
  return (
    <section id='about' className='mx-auto flex w-full items-center justify-center'>
      <div className='flex w-full max-w-screen-xl flex-col items-center justify-center gap-4 px-6 py-4 md:px-10 lg:px-12'>
        {/*<div className='flex w-full items-start py-8 lg:py-12'>*/}
        {/*  <h2 className='max-w-lg font-light text-3xl'>*/}
        {/*    Unlike human researchers, our AI agent is capable of reading EVERY SINGLE research paper about health,*/}
        {/*    aging, medicine, and more.*/}
        {/*  </h2>*/}
        {/*</div>*/}

        <div className='flex w-full flex-col items-center justify-center gap-4 py-8 lg:flex-row lg:justify-end lg:py-12'>
          <Image src={FirstStep} alt='First Step' className='w-full lg:max-w-xl' />
          <div className='flex flex-col items-start justify-center gap-2'>
            <h3 className='font-semibold text-xl'>Gather Research Papers</h3>
            <p className='lg:max-w-72'>
              First, we scrape EVERY SINGLE research papers from bioRxiv & medRxiv. The papers are then stored in a
              database for further processing.
            </p>
          </div>
        </div>

        <Image src={Line1} alt='line' className='hidden lg:block lg:w-[700px]' />

        <div className='flex w-full flex-col items-center justify-center gap-4 pb-8 lg:flex-row-reverse lg:justify-end lg:pb-12'>
          <Image src={SecondStep} alt='Second Step' className='w-full lg:max-w-xl' />
          <div className='flex flex-col items-start justify-center gap-2'>
            <h3 className='font-semibold text-xl'>Relevance Eval</h3>
            <p className='lg:max-w-72'>
              Second, we use a cheaper LLM model (GPT-4o mini) to check whether each research paper is relevant to our
              longevity research. There are more than 100,000 papers published to bioRxiv and medRxiv. To save costs, we
              use a cheaper model to filter out irrelevant papers.
            </p>
          </div>
        </div>

        <Image src={Line2} alt='line' className='-mt-32 mr-12 ml-auto hidden w-full lg:block lg:w-[100px]' />

        <div className='flex w-full flex-col items-start justify-center gap-6 pb-8 lg:flex-row lg:justify-end lg:pb-12'>
          <Image src={FinalStep} alt='Final Step' className='w-full lg:max-w-xl' />
          <div className='flex h-full flex-col items-start justify-center gap-2'>
            <h3 className='font-semibold text-xl'>Automated Longevity Protocol Improvement</h3>
            <p className='lg:max-w-72'>
              Among the relevant research papers, we then ask O1 to improve our longevity protocol, which is based on
              Bryan Johnson's 'Blueprint' protocol.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
