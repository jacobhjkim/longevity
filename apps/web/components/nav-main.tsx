'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { siteConfig } from '~/config/site'
import { cn } from '~/lib/utils'

export function NavMain() {
  const pathname = usePathname()

  return (
    <div className='mr-4 hidden md:flex'>
      <Link href='/' className='mr-4 flex items-center gap-2 lg:mr-6'>
        <span className='hidden font-bold lg:inline-block'>{siteConfig.name}</span>
      </Link>
      <nav className='flex items-center gap-4 text-sm xl:gap-6'>
        {siteConfig.navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'transition-colors hover:text-foreground/80',
              pathname.startsWith(link.href) ? 'text-foreground underline underline-offset-2' : 'text-foreground/80',
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
