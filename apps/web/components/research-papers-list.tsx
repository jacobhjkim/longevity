'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@repo/ui/pagination'
import React from 'react'
import { DebouncedInput } from '~/components/debounced-input'
import { ResearchPaper } from '~/components/research-paper'
import type { diffList } from '~/lib/diff'

export function ResearchPapersList({ papers }: { papers: ReturnType<typeof diffList> }) {
  const [search, setSearch] = React.useState('')

  return (
    <section className='flex w-full flex-col items-center justify-center gap-4 px-6 text-left lg:px-8'>
      <div className='flex w-full flex-col gap-4 md:flex-row'>
        <h2 className='w-full font-bold text-lg md:text-3xl'>Research Papers</h2>
        <DebouncedInput
          value={search ?? ''}
          onChange={(value) => setSearch(String(value))}
          className='w-full border border-block p-2 font-lg shadow md:w-96'
          placeholder='Search...'
        />
      </div>
      <ul className='flex flex-col gap-4'>
        {papers.map((p) => (
          <li key={p.doi}>
            <ResearchPaper data={p} />
          </li>
        ))}
      </ul>
      {/* TODO */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href='#' />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='#' isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='#'>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='#'>3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href='#' />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  )
}
