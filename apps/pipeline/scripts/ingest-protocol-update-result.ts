import { db, papersTable } from '@repo/db'
import Bun from 'bun'
import { eq } from 'drizzle-orm'
import type { outputFormatType } from '../src/output-type'

async function main() {
  const f = Bun.file('./outputs/o1-result-1.md')
  const content = await f.text()
  const lines = content.trim().split('\n')

  let flag = false
  const results: { doi: string; content: outputFormatType }[] = []
  let buffer: string[] = []
  let currentDOI = ''

  for (const line of lines) {
    if (line.includes('```json')) {
      flag = true
    } else if (line.includes('```')) {
      flag = false
      results.push({
        doi: currentDOI,
        content: JSON.parse(buffer.join('\n')),
      })
      buffer = []
      currentDOI = ''
    } else if (line.includes('DOI: ')) {
      currentDOI = line.trim().replace('DOI: ', '')
    } else if (flag) {
      buffer.push(line)
    }
  }

  for (const result of results) {
    const { doi, content } = result
    await db
      .update(papersTable)
      .set({
        ...(content.eat.length > 0 && { eat: content.eat }),
        ...(content.exercise.length > 0 && { exercise: content.exercise }),
        ...(content.measurements.length > 0 && { measurements: content.measurements }),
        ...(content.females.length > 0 && { females: content.females }),
        ...(content.pregnancy.length > 0 && { pregnancy: content.pregnancy }),
        isProcessed: true,
      })
      .where(eq(papersTable.doi, doi))
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))
