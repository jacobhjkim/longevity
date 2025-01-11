import { siteConfig } from '~/config/site'

export function Footer() {
  return (
    <footer className='mt-12 flex w-full flex-col items-start justify-center border-gray-200 border-t px-4 py-4 md:px-8'>
      <p className='w-full text-left text-gray-700 text-sm'>
        Built by{' '}
        <a href={siteConfig.links.myTwitter} className='text-indigo-600' target='_blank' rel='noreferrer'>
          @jacobhjkim
        </a>
        .<br /> The source code is available on{' '}
        <a href={siteConfig.links.github} className='text-indigo-600' target='_blank' rel='noreferrer'>
          GitHub
        </a>
        .
      </p>
    </footer>
  )
}
