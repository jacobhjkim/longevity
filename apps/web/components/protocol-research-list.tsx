'use client'

import Link from 'next/link'
import ReactDiffViewer from 'react-diff-viewer-continued'
import type { Diff } from '~/lib/diff'

export function ProtocolResearchList({
  researchList,
}: {
  researchList: Diff[]
}) {
  return (
    <div className='flex w-full flex-col items-start justify-center gap-4 text-left'>
      <h2 className='font-semibold text-2xl'>Related Researches</h2>
      <ul className='h-full w-full divide-y divide-gray-100'>
        {researchList.map((research) => (
          <li
            key={research.doi}
            className='flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded p-2 py-5 ring-1 ring-gray-200 sm:flex-nowrap'
          >
            <div>
              <p className='font-semibold text-gray-900 text-sm/6'>
                <Link href={'/#'} className='hover:underline'>
                  {research.title}
                </Link>
              </p>
              <div className='mt-1 flex items-center gap-x-2 text-gray-500 text-xs/5'>
                <p>
                  <a href={`https://doi.org/${research.doi}`} className='hover:underline'>
                    {research.doi}
                  </a>
                </p>
                <svg viewBox='0 0 2 2' className='size-0.5 fill-current'>
                  <title>circle</title>
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <p>
                  <time dateTime={research.date}>{research.date}</time>
                </p>
              </div>
              <div className='flex flex-col gap-4 p-1'>
                {research.diff?.map((r, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: chill out
                  <div key={i} className='flex flex-col gap-2 border-2 border-blue-500 p-2'>
                    <div className='rounded border-2 border-gray-700 bg-gray-200'>
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
                            },
                          },
                        }}
                        renderContent={(str) => <p className='prose font-sans'>{str}</p>}
                      />
                    </div>
                    <h3 className='pt-6 font-semibold text-lg'>Reason for the change: </h3>
                    <p className='text-gray-700'>{r.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
