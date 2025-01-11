import { boolean, index, integer, json, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core'

type Update = {
  changeType: 'add' | 'update' | 'remove'
  oldProtocol: string
  newProtocol: string
  reason: string
}

export const papersTable = pgTable(
  'papers_table',
  {
    doi: text().primaryKey(),
    title: text().notNull(),
    abstract: text().notNull(),
    category: text().notNull(),
    date: text().notNull(),
    server: text().notNull(),
    isRelevant: integer('is_relevant').notNull().default(0), // 0 = unchecked, 1 = relevant, 2 = irrelevant
    isProcessed: boolean('is_processed').notNull().default(false), // whether the paper has been processed by the o1
    eat: json().$type<Update>().array(),
    measurements: json().$type<Update>().array(),
    exercise: json().$type<Update>().array(),
    females: json().$type<Update>().array(),
    pregnancy: json().$type<Update>().array(),
    tokenIn: integer('token_in').notNull().default(0),
    tokenOut: integer('token_out').notNull().default(0),
  },
  (t) => [
    uniqueIndex('doi_index').on(t.doi),
    index('date_index').on(t.date),
    index('relevant_index').on(t.isRelevant),
    index('processed_index').on(t.isProcessed),
  ],
)

export const resultTable = pgTable(
  'result_table',
  {
    id: text().primaryKey(),
    paperDoi: text('paper_doi').references(() => papersTable.doi),
    result: text().notNull(),
  },
  (t) => [index('paper_doi_index').on(t.paperDoi)],
)

export const cursorTable = pgTable(
  'cursor_table',
  {
    interval: text().notNull(),
    server: text().notNull(),
    status: text().notNull(),
    total: integer().notNull(),
    cursor: integer().notNull(),
  },
  (t) => [
    uniqueIndex('cursor_index').on(t.server, t.interval),
    index('server_index').on(t.server),
    index('status_index').on(t.status),
  ],
)
