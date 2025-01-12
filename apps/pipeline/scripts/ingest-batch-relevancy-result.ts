import { db, papersTable } from '@repo/db'
import Bun from 'bun'
import { inArray } from 'drizzle-orm'
import { OpenAI } from 'openai'

const openai = new OpenAI()

const batches = ['batch_6783356b53248190b7fef168d2d368a0']

/**
 * Get the results of the batch from OpenAI and save it to a file
 * @param batchId
 */
async function getBatchResults(batchId: string) {
  const batch = await openai.batches.retrieve(batchId)
  const outputFileId = batch?.output_file_id
  if (!outputFileId) {
    throw new Error('No output file id')
  }
  const fileResponse = await openai.files.content(outputFileId)
  const fileContent = await fileResponse.text()
  await Bun.write(`./batch-results/${batchId}.jsonl`, fileContent)
}

/**
 * Update the papers table with the results from the batch
 * @param batchId
 */
async function updateBatchResultsToDB(batchId: string) {
  const f = Bun.file(`./batch-results/${batchId}.jsonl`)
  const content = await f.text()
  const lines = content.trim().split('\n')

  const relevantPapers = []
  const irrelevantPapers = []

  for (const line of lines) {
    const result = JSON.parse(line)
    const paperId = result.custom_id.split('-')[1]
    const choiceContent = result.response.body.choices[0]?.message?.content

    if (choiceContent === 'relevant') {
      relevantPapers.push(paperId)
    } else if (choiceContent === 'irrelevant') {
      irrelevantPapers.push(paperId)
    }
  }

  const updatePromises = []

  if (relevantPapers.length > 0) {
    updatePromises.push(db.update(papersTable).set({ isRelevant: 1 }).where(inArray(papersTable.doi, relevantPapers)))
  }

  if (irrelevantPapers.length > 0) {
    updatePromises.push(db.update(papersTable).set({ isRelevant: 2 }).where(inArray(papersTable.doi, irrelevantPapers)))
  }

  await Promise.all(updatePromises)

  console.log(`Relevant papers: ${relevantPapers.length}
Irrelevant papers: ${irrelevantPapers.length}\n`)
}

async function main() {
  for (const batchId of batches) {
    console.log(`Getting results for batch ${batchId}...`)
    await getBatchResults(batchId)
  }

  for (const batchId of batches) {
    console.log(`Updating results for batch ${batchId}...`)
    await updateBatchResultsToDB(batchId)
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))
