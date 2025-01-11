'use client'

import { Button } from '@repo/ui/button'
import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCopyToClipboard } from '~/lib/utils'

export function CACopyButton() {
  const [isCopied, setIsCopied] = useState(false)
  const [, copy] = useCopyToClipboard()

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    if (isCopied) {
      timer = setTimeout(() => {
        setIsCopied(false)
      }, 5000)
    }

    // Cleanup if component unmounts before 5s finishes
    return () => clearTimeout(timer)
  }, [isCopied])

  const handleClick = () => {
    void copy('TODO')
    setIsCopied(true)
  }

  return (
    <Button variant='ghost' className='font-mono' onClick={handleClick}>
      TODO
      {isCopied ? <Check className='h-4 w-4 text-green-500' /> : <Copy className='h-4 w-4' />}
    </Button>
  )
}
