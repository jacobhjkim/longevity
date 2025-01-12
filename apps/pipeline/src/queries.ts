import { cursorTable, db, papersTable } from '@repo/db'
import { incrementInterval } from '@repo/util'
import { and, desc, eq, gte, inArray } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

const DEFAULT_INTERVAL = '2022-01-01/2022-01-02'

export async function getLatestCursor({ server }: { server: 'biorxiv' | 'medrxiv' }) {
  const result = await db
    .select({
      status: cursorTable.status,
      interval: cursorTable.interval,
      cursor: cursorTable.cursor,
    })
    .from(cursorTable)
    .where(eq(cursorTable.server, server))
    .orderBy(desc(cursorTable.interval))
    .limit(1)

  if (result.length === 0) {
    return {
      interval: DEFAULT_INTERVAL,
      cursor: 0,
    }
  }

  const cursor = result[0]

  if (!cursor) {
    return {
      interval: DEFAULT_INTERVAL,
      cursor: 0,
    }
  }

  if (cursor.status === 'processing') {
    return {
      interval: cursor.interval,
      cursor: cursor.cursor + 100,
    }
  }

  return {
    interval: incrementInterval({ interval: cursor.interval }),
    cursor: 0,
  }
}

export async function getUncheckedPapersByDate({ date }: { date: string }) {
  return db
    .select({
      doi: papersTable.doi,
      title: papersTable.title,
      abstract: papersTable.abstract,
      category: papersTable.category,
      date: papersTable.date,
      server: papersTable.server,
      isRelevant: papersTable.isRelevant,
    })
    .from(papersTable)
    .where(and(eq(papersTable.date, date), eq(papersTable.isRelevant, 0)))
    .orderBy(desc(papersTable.date))
}

export async function getUncheckedPapers() {
  return db
    .select({
      doi: papersTable.doi,
      title: papersTable.title,
      abstract: papersTable.abstract,
      category: papersTable.category,
      date: papersTable.date,
      server: papersTable.server,
      isRelevant: papersTable.isRelevant,
    })
    .from(papersTable)
    .where(eq(papersTable.isRelevant, 0))
    .orderBy(desc(papersTable.date))
}

export async function getPaperByDoi({ doi }: { doi: string }) {
  return db
    .select({
      doi: papersTable.doi,
      title: papersTable.title,
      abstract: papersTable.abstract,
      category: papersTable.category,
      date: papersTable.date,
      server: papersTable.server,
      isRelevant: papersTable.isRelevant,
    })
    .from(papersTable)
    .where(eq(papersTable.doi, doi))
}

export async function getPapersByDois({
  db,
  dois,
}: {
  db: NodePgDatabase
  dois: string[]
}) {
  return db
    .select({
      doi: papersTable.doi,
      title: papersTable.title,
      abstract: papersTable.abstract,
      category: papersTable.category,
      date: papersTable.date,
      server: papersTable.server,
      isRelevant: papersTable.isRelevant,
    })
    .from(papersTable)
    .where(inArray(papersTable.doi, dois))
}

export async function getUnprocessedRelevantPapers() {
  return db
    .select({
      doi: papersTable.doi,
      title: papersTable.title,
      abstract: papersTable.abstract,
      category: papersTable.category,
      date: papersTable.date,
      server: papersTable.server,
    })
    .from(papersTable)
    .where(and(eq(papersTable.isRelevant, 1), eq(papersTable.isProcessed, false)))
    .orderBy(desc(papersTable.date))
    .limit(40)
}
