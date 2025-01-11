import Image from 'next/image'
import type React from 'react'
import { siteConfig } from '~/config/site'
import BryanJohnson from '~/public/images/bryan-johnson-pfp.jpg'
import ElizaOS from '~/public/images/elizaos.jpeg'
import GitHub from '~/public/images/github-mark.svg'
import SolanaLogo from '~/public/images/solana.svg'

export function Features() {
  return (
    <section
      id='features'
      className='mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center gap-12 bg-white px-6 py-12 md:px-10 lg:items-start lg:px-12'
    >
      <div className='flex flex-col gap-6'>
        <h2 className='font-semibold text-3xl'>Features</h2>
        <p>
          This is an experimental project to see if an autonomous DeSci AI agent can improve Bryan Johnson's Blueprint
          Protocol by reading every single research paper published in bioRxiv & medrXiv. With the help of the DeSci AI
          agent, we can read tens of thousands of research papers and extract the relevant information to improve the
          Blueprint Protocol. Ultimately, contributing to the well being of humanity.
        </p>
      </div>
      <div className='grid grid-cols-1 grid-rows-2 gap-6 md:grid-cols-2'>
        <div className='flex flex-col items-center justify-start gap-2 md:items-start'>
          <Image src={GitHub} alt='GitHub' className='h-16 w-16' />
          <strong className='font-semibold text-xl'>Open Source</strong>
          <span>
            The entire codebase and data is available on{' '}
            <a href={siteConfig.links.github} className='text-indigo-600' target='_blank' rel='noreferrer'>
              GitHub
            </a>
            . Anyone who is interested can contribute to the project.
          </span>
        </div>

        <div className='flex flex-col items-center justify-start gap-2 md:items-start'>
          <Image src={ElizaOS} alt='ElizaOS' className='h-16 w-16 rounded-full bg-black' />
          <strong className='font-semibold text-xl'>Powered by ElizaOS</strong>
          <span>
            <a href='https://elizaos.ai/' target='_blank' rel='noreferrer' className='text-indigo-600'>
              ElizaOS
            </a>{' '}
            is an open source framework for building AI agents built by the ai16z DAO. It power's our longevity AI
            agent's Twitter persona.
          </span>
        </div>

        <div className='flex flex-col items-center justify-start gap-2 md:items-start'>
          <Image src={BryanJohnson} alt='Bryan Johnson PFP' className='h-16 w-16 rounded-full' />
          <strong className='font-semibold text-xl'>Based on Bryan's Blueprint Protocol</strong>
          <span>
            Our longevity research's baseline is from Bryan Johnson's Blueprint Protocol. Although we are not affiliated
            with Bryan Johnson, we are inspired by his work.
          </span>
        </div>

        <div className='flex flex-col items-center justify-start gap-2 md:items-start'>
          <Image src={SolanaLogo} alt='Solana' className='h-16 w-16' />
          <strong className='font-semibold text-xl'>
            Funded by the{' '}
            <a href={siteConfig.links.dexscreener} target='_blank' rel='noreferrer' className='text-indigo-600'>
              $LONGAI
            </a>{' '}
            token
          </strong>
          <span>
            With the help of the $LONGAI token and community, we try to find a sustainable way to continue the project.
          </span>
        </div>
      </div>
    </section>
  )
}
