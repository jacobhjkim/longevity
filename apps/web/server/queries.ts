'use server'

import { db, papersTable } from '@repo/db'
import { and, count, eq, isNotNull, or, sql } from 'drizzle-orm'

export type Update = {
  changeType: 'add' | 'update' | 'remove'
  oldProtocol: string
  newProtocol: string
  reason: string
}

export async function queryStats() {
  const data = await Promise.all([
    db
      .select({
        is_relevant: papersTable.isRelevant,
        count: count(),
      })
      .from(papersTable)
      .groupBy(papersTable.isRelevant),
    db
      .select({
        count: count(),
      })
      .from(papersTable)
      .where(eq(papersTable.isProcessed, true)),
  ])

  const [relevancy, processed] = data

  if (relevancy.length === 0 && processed.length === 0) {
    return {
      total: 0,
      relevant: 0,
      irrelevant: 0,
      processed: 0,
    }
  }

  const total = relevancy.reduce((acc, row) => acc + row.count, 0)
  const relevant = relevancy.find((row) => row.is_relevant === 1)?.count || 0
  const irrelevant = relevancy.find((row) => row.is_relevant === 2)?.count || 0

  return { total, relevant, irrelevant, processed: processed[0]?.count || 0 }
}

export async function queryRelevantPapers() {
  const data = await db
    .select({
      doi: papersTable.doi,
      title: papersTable.title,
      category: papersTable.category,
      date: papersTable.date,
      server: papersTable.server,
      eat: sql<boolean>`CASE WHEN eat IS NOT NULL THEN true ELSE false END`,
      measurements: sql<boolean>`CASE WHEN measurements IS NOT NULL THEN true ELSE false END`,
      exercise: sql<boolean>`CASE WHEN exercise IS NOT NULL THEN true ELSE false END`,
      females: sql<boolean>`CASE WHEN females IS NOT NULL THEN true ELSE false END`,
      pregnancy: sql<boolean>`CASE WHEN pregnancy IS NOT NULL THEN true ELSE false END`,
    })
    .from(papersTable)
    .where(eq(papersTable.isProcessed, true))

  return data.map((row) => ({
    doi: row.doi,
    title: row.title,
    category: row.category,
    date: row.date,
    server: row.server,
    relevantProtocols: [
      ...(row.eat ? ['eat'] : []),
      ...(row.measurements ? ['measurements'] : []),
      ...(row.exercise ? ['exercise'] : []),
      ...(row.females ? ['females'] : []),
      ...(row.pregnancy ? ['pregnancy'] : []),
    ],
  }))
}

export type ProtocolUpdateQueryOutput = {
  doi: string
  title: string
  category: string
  server: string
  date: string
  tokenIn: number
  tokenOut: number
  eat: Update[] | null
  measurements: Update[] | null
  exercise: Update[] | null
  females: Update[] | null
  pregnancy: Update[] | null
}

export async function queryProtocolUpdateDOI() {
  return db
    .select({
      doi: papersTable.doi,
    })
    .from(papersTable)
    .where(
      and(
        eq(papersTable.isProcessed, true),
        or(
          isNotNull(papersTable.eat),
          isNotNull(papersTable.measurements),
          isNotNull(papersTable.exercise),
          isNotNull(papersTable.females),
          isNotNull(papersTable.pregnancy),
        ),
      ),
    )
}

export async function queryProtocolUpdateByDOI(doi: string) {
  const data = await db
    .select({
      doi: papersTable.doi,
      title: papersTable.title,
      category: papersTable.category,
      server: papersTable.server,
      date: papersTable.date,
      eat: papersTable.eat,
      measurements: papersTable.measurements,
      exercise: papersTable.exercise,
      females: papersTable.females,
      pregnancy: papersTable.pregnancy,
    })
    .from(papersTable)
    .where(and(eq(papersTable.isProcessed, true), eq(papersTable.doi, doi)))
  if (data.length === 0) {
    return null
  }

  if (data.length > 1) {
    throw new Error('Multiple rows returned')
  }

  return data[0] as ProtocolUpdateQueryOutput
}

export async function queryProtocolUpdate() {
  return db
    .select({
      doi: papersTable.doi,
      title: papersTable.title,
      category: papersTable.category,
      server: papersTable.server,
      date: papersTable.date,
      tokenIn: papersTable.tokenIn,
      tokenOut: papersTable.tokenOut,
      eat: papersTable.eat,
      measurements: papersTable.measurements,
      exercise: papersTable.exercise,
      females: papersTable.females,
      pregnancy: papersTable.pregnancy,
    })
    .from(papersTable)
    .where(
      and(
        eq(papersTable.isProcessed, true),
        eq(papersTable.isRelevant, 1),
        or(
          isNotNull(papersTable.eat),
          isNotNull(papersTable.measurements),
          isNotNull(papersTable.exercise),
          isNotNull(papersTable.females),
          isNotNull(papersTable.pregnancy),
        ),
      ),
    ) as Promise<ProtocolUpdateQueryOutput[]>
}
