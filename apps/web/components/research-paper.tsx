'use client'

import { Badge } from '@repo/ui/badge'
import { Button } from '@repo/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card'
import { CloudDownload, CloudUpload, Coins } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ReactDiffViewer from 'react-diff-viewer-continued'
import type { DiffWithProtocol } from '~/lib/diff'
import { calculateTokenCost } from '~/lib/utils'

function TokenCost({ tokenIn, tokenOut }: { tokenIn: number; tokenOut: number }) {
  return (
    <div className='flex items-center justify-between gap-2 rounded-md bg-slate-100 p-2'>
      <div className='flex items-center justify-center gap-6'>
        <p className='flex items-center justify-center gap-2 text-xs'>
          <CloudUpload className='h-4 w-4' />
          IN: <span className='font-medium font-mono text-sm'>{tokenIn.toLocaleString()}</span>
        </p>
        <p className='flex items-center justify-center gap-2 text-xs'>
          <CloudDownload className='h-4 w-4' />
          OUT: <span className='font-medium font-mono text-sm'>{tokenOut.toLocaleString()}</span>
        </p>
      </div>
      <div className='flex items-center justify-center gap-2'>
        <Coins className='h-4 w-4 text-yellow-500' />
        <p className='text-gray-400 text-xs'>
          Cost:
          <span className='text-green-400'>${calculateTokenCost({ tokenIn, tokenOut })}</span>
        </p>
      </div>
    </div>
  )
}

export function ResearchPaper({ data }: { data: DiffWithProtocol }) {
  return (
    <Card className='group w-full hover:border-green-500 hover:shadow'>
      <CardHeader>
        <CardTitle className='leading-relaxed tracking-normal'>{data.title}</CardTitle>
        <div className='flex items-center justify-start gap-2 py-2'>
          <Badge>{data.category}</Badge>
          {data.server === 'biorxiv' ? <Badge variant='rose'>biorxiv</Badge> : <Badge variant='blue'>medrxiv</Badge>}
        </div>
        <CardDescription className='flex items-center justify-between gap-2'>
          <a
            href={`https://doi.org/${data.doi}`}
            className='text-gray-400 text-xs hover:underline'
            target='_blank'
            rel='noreferrer'
          >
            {`https://doi.org/${data.doi}`}
          </a>
          <span className='text-gray-400 text-xs'>{data.date}</span>
        </CardDescription>
        <hr className='border-gray-200 py-2' />
        <TokenCost tokenIn={data.tokenIn} tokenOut={data.tokenOut} />
      </CardHeader>
      <CardContent className='w-full'>
        <div className='space-y-8'>
          {data.diff?.map((r, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: chill out
            <React.Fragment key={i}>
              <div className='flex flex-col gap-2'>
                <div className='overflow-hidden rounded-lg border border-gray-400 bg-gray-200'>
                  <ReactDiffViewer
                    oldValue={r.oldValue}
                    newValue={r.newValue}
                    splitView={false}
                    hideLineNumbers={true}
                    styles={{
                      contentText: {},
                      variables: {
                        light: {
                          diffViewerBackground: '#F9FAFB',
                          diffViewerTitleBackground: '#D1D5DB',
                        },
                      },
                    }}
                    renderContent={(str) => <span className='prose w-full font-sans'>{str}</span>}
                    leftTitle={`Protocol: ${r.protocol}`}
                  />
                </div>
                <h3 className='font-semibold text-lg'>Reasoning: </h3>
                <p className='text-gray-700'>{r.reason}</p>
              </div>
              {i !== data.diff.length - 1 && <hr className='border-gray-200' />}
            </React.Fragment>
          ))}
        </div>
        <hr className='border-gray-200 py-2' />
        <div className='flex items-center justify-end'>
          <Button asChild>
            <Link
              href={{
                pathname: `/protocol/${data.doi}`,
                query: {
                  tab: data.diff[0]?.protocol,
                },
              }}
            >
              View Protocol
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
