'use client'

import { Badge } from '@repo/ui/badge'
import { Button } from '@repo/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/table'
import { type RankingInfo, compareItems, rankItem } from '@tanstack/match-sorter-utils'
import {
  type ColumnDef,
  type FilterFn,
  type SortingFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import type { queryRelevantPapers } from '~/server/queries'
import { DebouncedInput } from './debounced-input'

declare module '@tanstack/react-table' {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(rowA.columnFiltersMeta[columnId]?.itemRank, rowB.columnFiltersMeta[columnId]?.itemRank!)
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

export function DataTable({ papers }: { papers: Awaited<ReturnType<typeof queryRelevantPapers>> }) {
  const [globalFilter, setGlobalFilter] = React.useState('')

  const columns = React.useMemo<ColumnDef<Awaited<ReturnType<typeof queryRelevantPapers>>[0], any>[]>(
    () => [
      {
        accessorKey: 'doi',
        filterFn: 'includesString',
        header: () => <span>DOI</span>,
        cell: (info) => (
          <a
            href={`https://doi.org/${info.getValue()}`}
            target='_blank'
            rel='noreferrer'
            className='text-sky-500 hover:underline'
          >
            <code className='text-xs'>{info.getValue()}</code>
          </a>
        ),
      },
      {
        accessorKey: 'title',
        cell: (info) => (
          <div className='max-w-sm'>
            <span className='line-clamp-3'>{info.getValue()}</span>
          </div>
        ),
        header: () => <span className='max-w-sm truncate'>Title</span>,
        sortingFn: fuzzySort,
      },
      {
        id: 'date',
        accessorFn: (row) => row.date,
        cell: (info) => (
          <div className='flex'>
            <span className='shrink-0 text-xs'>{info.getValue()}</span>
          </div>
        ),
        header: () => <span className=''>Date</span>,
      },
      {
        accessorFn: (row) => row.server,
        id: 'server',
        cell: (info) => (
          <div className='flex items-center justify-center'>
            <Badge className='' variant={info.getValue() === 'medrxiv' ? 'blue' : 'rose'}>
              {info.getValue()}
            </Badge>
          </div>
        ),
        header: () => <span>Server</span>,
      },
      {
        id: 'category',
        accessorFn: (row) => row.category,
        cell: (info) => info.getValue(),
        header: () => <span>Category</span>,
      },
      {
        id: 'relevantProtocols',
        accessorFn: (row) => (
          <ul className='flex flex-wrap gap-2'>
            {row.relevantProtocols.length > 0 ? (
              row.relevantProtocols.map((protocol) => (
                <li key={protocol}>
                  {/* @ts-ignore */}
                  <Badge variant={protocol}>{protocol}</Badge>
                </li>
              ))
            ) : (
              <span className='text-gray-500'>No relevant protocols</span>
            )}
          </ul>
        ),
        cell: (info) => info.getValue(),
        header: () => <span className='flex-shrink-0'>Relevant Protocols</span>,
        sortingFn: fuzzySort,
      },
      {
        id: 'more',
        enableHiding: false,
        cell: ({ row }) => {
          if (row.original.relevantProtocols.length === 0) {
            return null
          }
          return (
            <Button variant='ghost' asChild>
              <Link
                href={{
                  pathname: `/protocol/${row.original.doi}`,
                  query: {
                    ...(row.original.relevantProtocols.length > 0 && { tab: row.original.relevantProtocols[0] }),
                  },
                }}
                className='pr-4 text-blue-500 underline'
                prefetch={false}
              >
                Read More
              </Link>
            </Button>
          )
        },
      },
    ],
    [],
  )

  const table = useReactTable({
    data: papers,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'fuzzy', //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
    manualPagination: true,
    rowCount: papers.length,
  })

  return (
    <div className='flex w-full flex-col items-start gap-6'>
      <div className='flex items-center justify-between gap-2 px-4'>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
          className='w-full border border-block p-2 font-lg shadow md:w-96'
          placeholder='Search all columns...'
        />
      </div>
      <Table className=''>
        <TableCaption>Processed Research Papers</TableCaption>
        <TableHeader className='bg-gray-100'>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'flex items-center justify-center gap-2 cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ChevronUp className='h-4 w-4' />,
                          desc: <ChevronDown className='h-4 w-4' />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className='text-gray-700'>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
