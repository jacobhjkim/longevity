'use client'

import * as motion from 'motion/react-client'
import Image from 'next/image'
import Logo from '~/public/images/blueprint.png'

export default function ProtocolRelatedResearch({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 },
      }}
      className='w-[36rem] max-w-none shrink-0 items-center justify-center gap-1 rounded-xl ring-1 ring-gray-100 sm:w-[32rem] '
    >
      {children}
    </motion.div>
  )
}
