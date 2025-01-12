import type { Metadata } from 'next'
import '@repo/ui/globals.css'
import { Analytics } from '@vercel/analytics/next'
import { Inter, Roboto_Mono } from 'next/font/google'
import { Footer } from '~/components/footer'
import { SiteHeader } from '~/components/nav'
import { siteConfig } from '~/config/site'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export const metadata: Metadata = {
  title: 'Longevity AI',
  description: 'Decentralized Longevity Research',
  metadataBase: new URL(siteConfig.url),
  twitter: {
    card: 'summary_large_image',
    site: '@longevities_ai',
    creator: '@longevities_ai',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.variable} ${robotoMono.variable} min-h-svh bg-white font-sans antialiased`}>
        <div vaul-drawer-wrapper=''>
          <div className='flex w-full flex-1 flex-col items-center justify-start border-grid'>
            <SiteHeader />
            <div className='flex min-h-96 w-full flex-1'>{children}</div>
            <Footer />
            <Analytics />
          </div>
        </div>
      </body>
    </html>
  )
}
