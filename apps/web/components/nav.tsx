import Link from 'next/link'

import { Button } from '@repo/ui/button'
import { CACopyButton } from '~/components/ca-copy-button'
import { Icons } from '~/components/icons'
import { NavMain } from '~/components/nav-main'
import { NavMobile } from '~/components/nav-mobile'
import { siteConfig } from '~/config/site'

export function SiteHeader() {
  return (
    <header className='sticky top-0 z-50 w-full border-grid border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-8'>
      <div className='flex h-14 w-full items-center justify-between'>
        <NavMain />
        <NavMobile />
        <div className='flex flex-1 items-center justify-end gap-2 md:justify-end'>
          <nav className='flex items-center gap-0.5'>
            <CACopyButton />
            <Button variant='ghost' size='icon' className='h-8 w-8 px-0'>
              <a href={siteConfig.links.github} target='_blank' rel='noreferrer'>
                <Icons.gitHub className='h-4 w-4' />
                <span className='sr-only'>GitHub</span>
              </a>
            </Button>
            <Button variant='ghost' size='icon' className='h-8 w-8 px-0'>
              <a href={siteConfig.links.twitter} target='_blank' rel='noreferrer'>
                <Icons.twitter className='h-4 w-4' />
                <span className='sr-only'>Twitter</span>
              </a>
            </Button>
            <Button variant='ghost' size='icon' className='h-8 w-8 px-0'>
              <a href={siteConfig.links.telegram} target='_blank' rel='noreferrer'>
                <Icons.telegram className='' />
                <span className='sr-only'>Telegram</span>
              </a>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
