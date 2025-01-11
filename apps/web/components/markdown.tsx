'use client'

import React from 'react'
import ReactDiffViewer from 'react-diff-viewer-continued'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className='prose prose:m-0 mx-auto block h-full w-full resize-none whitespace-pre-wrap break-words rounded-md prose:p-0 px-3 py-2 text-left font-medium prose-strong:font-bold prose-h1:text-2xl prose-h2:text-xl text-base prose-p:leading-loose'
      components={{
        p({ children }) {
          return <p className='my-0 py-0'>{children}</p>
        },
        h1({ children }) {
          return <h1 className='my-0 py-0'>{children}</h1>
        },
        h2({ children }) {
          return <h2 className='my-0 py-0'>{children}</h2>
        },
        h3({ children }) {
          return <h3 className='my-0 py-0'>{children}</h3>
        },
        h4({ children }) {
          return <h4 className='my-0 py-0'>{children}</h4>
        },
        li({ children }) {
          return <li className='my-0 py-0'>{children}</li>
        },
        ul({ children }) {
          return <ul className='-mt-6 my-0 py-0'>{children}</ul>
        },
        ol({ children }) {
          return <ol className='my-0 py-0'>{children}</ol>
        },
        blockquote({ children }) {
          return <blockquote className='my-0 py-0'>{children}</blockquote>
        },
        // @ts-ignore
        code({ inline, className, children, ...props }) {
          if (inline) return <code {...props}>{children}</code>

          const value = String(children).replace(/\n$/, '')

          if (className === 'language-diff') return <DiffComponent jsonString={value} />

          return <code className='font-mono'>{value}</code>
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

function DiffComponent({ jsonString }: { jsonString: string }) {
  const data = JSON.parse(jsonString)

  return (
    <div
      id={`diff-${data.num}`}
      className='flex flex-col gap-4 overflow-hidden rounded-lg border-2 border-green-500 bg-gray-50'
    >
      <div className='flex items-center justify-center px-2 pt-2'>
        <a
          href={`https://doi.org/${data.doi}`}
          className='text-gray-400 text-xs hover:underline'
          target='_blank'
          rel='noreferrer'
        >
          {`https://doi.org/${data.doi}`}
        </a>
      </div>
      <h2 className='mt-2 px-4 font-sans font-semibold text-lg'>Changes:</h2>
      <ReactDiffViewer
        oldValue={data.oldValue}
        newValue={data.newValue}
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
        renderContent={(str) => <span className='prose w-full font-sans'>{str}</span>}
      />
      <div className='flex flex-col gap-2 border-green-500 border-t-2 px-4 font-sans'>
        <h3 className='font-semibold text-lg'>Reasoning: </h3>
        <p className='text-wrap text-gray-700'>{data.reason}</p>
      </div>
    </div>
  )
}
