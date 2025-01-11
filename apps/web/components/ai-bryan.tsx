'use client'

import * as motion from 'motion/react-client'
import Image from 'next/image'
import Logo from '~/public/images/blueprint.png'

export default function AIBryan() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 },
      }}
      className='flex w-[36rem] max-w-none shrink-0 flex-col items-center justify-center gap-1 rounded-xl ring-1 ring-gray-100 sm:w-[32rem] sm:pt-32'
    >
      <Image src={Logo} alt='Blueprint' width={1468 / 2} height={1709 / 2} />
      <div className='flex flex-col items-center justify-center gap-4 pb-4 text-center'>
        <div className='flex items-center justify-center gap-4'>
          <a
            href='https://x.com'
            target='_blank'
            rel='noreferrer'
            className='flex shrink-0 items-center justify-center gap-1 text-gray-500 underline-offset-4 hover:underline'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              fill='currentColor'
              className='h-4 w-4 shrink-0'
              viewBox='0 0 16 16'
            >
              <title>x.com</title>
              <path d='M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z' />
            </svg>
            @longevityai
          </a>
          <a
            href='tg.com'
            target='_blank'
            rel='noreferrer'
            className='flex shrink-0 items-center justify-center gap-1 text-gray-500 underline-offset-4 hover:underline'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              fill='currentColor'
              className='h-4 w-4 shrink-0'
              viewBox='0 0 16 16'
            >
              <title>telegram</title>
              <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09' />
            </svg>
            <span>telegram</span>
          </a>
        </div>
        <p className='text-gray-400 text-xs'>
          developed by{' '}
          <a href='https://bryan.com' className='text-gray-700 underline underline-offset-2'>
            @jacobhjkim
          </a>
        </p>
      </div>
    </motion.div>
  )
}
