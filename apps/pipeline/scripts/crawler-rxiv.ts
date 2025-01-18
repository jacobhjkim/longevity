import { cursorTable, db, papersTable } from '@repo/db'
import { getTodayInterval, incrementInterval, sleep } from '@repo/util'
import { and, eq } from 'drizzle-orm'
import { BiorxivAPI } from '../src/biorxiv'
import { getLatestCursor } from '../src/queries'

const server = 'medrxiv'

/**
 * Fetch papers from the specified interval and cursor
 * @param server - the server to fetch papers from (biorxiv or medrxiv)
 * @param interval - the interval to fetch papers for
 * @param cursor - the cursor to fetch papers from
 * @param api - the BiorxivAPI instance to use
 */
async function fetchPapers({
  server,
  interval,
  cursor,
  api,
}: {
  server: 'biorxiv' | 'medrxiv'
  interval: string
  cursor: number
  api: BiorxivAPI
}) {
  const details = await api.getDetails(server, interval, cursor)
  const metadata = details.messages[0]
  const collection = details.collection

  if (!metadata || collection.length === 0) {
    // sometimes the total count is incorrect, so we should check if there are any results at all
    await db
      .update(cursorTable)
      .set({
        status: 'done',
      })
      .where(
        and(eq(cursorTable.server, server), eq(cursorTable.interval, interval), eq(cursorTable.status, 'processing')),
      )

    return {
      newInterval: incrementInterval({ interval }),
      newCursor: 0,
    }
  }

  const status = Number(metadata.total) > metadata.cursor + metadata.count ? 'processing' : 'done'

  const sanitizedCollection = [] as typeof collection
  const duplicateDois = new Set()
  for (const paper of collection) {
    // find duplicate doi in paper list
    if (duplicateDois.has(paper.doi)) continue
    duplicateDois.add(paper.doi)
    sanitizedCollection.push(paper)
  }

  console.log({
    total: metadata.total,
    cursor: metadata.cursor,
    count: metadata.count,
    sanitizedCollection: sanitizedCollection.length,
  })

  await db.transaction(async (tx) => {
    await tx
      .insert(papersTable)
      .values([
        ...sanitizedCollection.map((paper) => ({
          doi: paper.doi,
          title: paper.title,
          abstract: paper.abstract,
          category: paper.category,
          date: paper.date,
          server,
          relevant: 0,
        })),
      ])
      .onConflictDoNothing()

    if (metadata.cursor === 0) {
      // if this is the first page of results, insert a new cursor record
      await tx.insert(cursorTable).values({
        server,
        interval,
        status,
        total: Number(metadata.total),
        cursor: metadata.cursor,
      })
    } else if (status === 'done') {
      // if we have reached the end of the results, update the cursor record
      await tx
        .update(cursorTable)
        .set({
          status,
          cursor: metadata.cursor,
        })
        .where(
          and(eq(cursorTable.server, server), eq(cursorTable.interval, interval), eq(cursorTable.status, 'processing')),
        )
    } else if (status === 'processing') {
      // there are more results to fetch, so increase the cursor
      await tx
        .update(cursorTable)
        .set({
          cursor: metadata.cursor,
        })
        .where(
          and(eq(cursorTable.server, server), eq(cursorTable.interval, interval), eq(cursorTable.status, 'processing')),
        )
    }
  })

  return status === 'done'
    ? {
        newInterval: incrementInterval({ interval }),
        newCursor: 0,
      }
    : {
        newInterval: interval,
        newCursor: metadata.cursor + 100,
      }
}

async function main() {
  const api = new BiorxivAPI()
  let { interval: currentInterval, cursor: currentCursor } = await getLatestCursor({ server })
  const todayInterval = getTodayInterval()

  while (currentInterval < todayInterval) {
    console.log(`Fetching papers for interval: ${currentInterval}, cursor: ${currentCursor}`)
    const results = await fetchPapers({
      server,
      interval: currentInterval,
      cursor: currentCursor,
      api,
    })

    console.log({
      currentInterval,
      currentCursor,
      newInterval: results.newInterval,
      newCursor: results.newCursor,
    })
    currentInterval = results.newInterval
    currentCursor = results.newCursor

    await sleep(1000)
  }
}

main()
