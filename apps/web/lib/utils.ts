import { type ClassValue, clsx } from 'clsx'
import React from 'react'
import { twMerge } from 'tailwind-merge'

type CopiedValue = string | null

type CopyFn = (text: string) => Promise<boolean>

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = React.useState<CopiedValue>(null)

  const copy: CopyFn = React.useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      setCopiedText(null)
      return false
    }
  }, [])

  return [copiedText, copy]
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const o1_INPUT_PRICE = 15 / 1_000_000 // $15.00 / 1M input tokens
const o1_OUTPUT_PRICE = 60 / 1_000_000 // 60.00 / 1M output tokens

export function calculateTokenCost({ tokenIn, tokenOut }: { tokenIn: number; tokenOut: number }) {
  return Number(tokenIn * o1_INPUT_PRICE + tokenOut * o1_OUTPUT_PRICE).toFixed(2)
}
