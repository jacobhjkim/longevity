import { db, papersTable } from '@repo/db'
import Bun from 'bun'
import { and, eq } from 'drizzle-orm'

const CHUNK_SIZE = 25

async function main() {
  const distinctCategories = await db
    .selectDistinct({
      category: papersTable.category,
    })
    .from(papersTable)
    .where(eq(papersTable.isRelevant, 1))

  const categories = distinctCategories.map((category) => category.category)
  console.log(`${categories.length} categories found`)

  for (const category of categories) {
    console.log(`Generating knowledge for ${category}`)
    const results = await db
      .select({
        doi: papersTable.doi,
        title: papersTable.title,
        date: papersTable.date,
        abstract: papersTable.abstract,
        category: papersTable.category,
      })
      .from(papersTable)
      .where(and(eq(papersTable.isRelevant, 1), eq(papersTable.category, category)))

    let markdown = ''
    let i = 0
    for (const result of results) {
      i++
      if (i % CHUNK_SIZE === 0) {
        await Bun.write(`../characters/knowledge/${category.replaceAll(' ', '_')}-${i}.md`, markdown)
        markdown = ''
        continue
      }
      markdown += `
title: ${result.title}
doi: ${result.doi}
date: ${result.date}
category: ${result.category}
abstract: ${result.abstract}
------
`
    }

    if (markdown) {
      await Bun.write(`../characters/knowledge/${category.replaceAll(' ', '_')}-${i}.md`, markdown)
    }
  }
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => process.exit(0))
