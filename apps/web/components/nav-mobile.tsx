'use client'

import Link, { type LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import { Button } from '@repo/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@repo/ui/drawer'
import { siteConfig } from '~/config/site'
import { cn } from '~/lib/utils'

export function NavMobile() {
  const [open, setOpen] = React.useState(false)
  const [metaColor, setMetaColor] = React.useState('#ffffff')

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      setOpen(open)
      setMetaColor(open ? '#09090b' : metaColor)
    },
    [metaColor],
  )

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant='ghost'
          className='mr-2 h-8 w-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='!size-6'
          >
            <title>Toggle Menu</title>
            <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 9h16.5m-16.5 6.75h16.5' />
          </svg>
          <span className='sr-only'>Toggle Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className='max-h-[60svh] p-0'>
        <div className='overflow-auto p-6'>
          <Link href='/' className='mr-4 flex items-center gap-2 lg:mr-6'>
            <span className='inline-block font-bold'>{siteConfig.name}</span>
          </Link>
          <hr className='my-4 border-gray-200 border-t' />
          <div className='flex flex-col space-y-3'>
            {siteConfig.navLinks?.map(
              (item) =>
                item.href && (
                  <MobileLink key={item.href} href={item.href} onOpenChange={setOpen}>
                    {item.label}
                  </MobileLink>
                ),
            )}
          </div>
          <hr className='my-4 border-gray-200 border-t' />
          <h4 className='font-bold'>Socials</h4>
          <ul className='flex flex-col space-y-2 py-4'>
            {siteConfig.sidebarLinks.map((item, index) => (
              <li key={item.href} className='flex flex-col space-y-3'>
                <MobileLink href={item.href} onOpenChange={setOpen} className='text-muted-foreground'>
                  {item.label}
                </MobileLink>
              </li>
            ))}
          </ul>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn('text-base', className)}
      {...props}
    >
      {children}
    </Link>
  )
}
