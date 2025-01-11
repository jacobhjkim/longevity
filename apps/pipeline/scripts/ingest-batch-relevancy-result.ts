import { db, papersTable } from '@repo/db'
import Bun from 'bun'
import { inArray } from 'drizzle-orm'
import { OpenAI } from 'openai'

const openai = new OpenAI()

const batches = [
  'batch_677f5ef9dc808190ad3d4e0395f2bf56',
  'batch_677f5f10d8988190a3c8ce3802645a39',
  'batch_677f5f2643a48190bc4837ec7819ab8e',
  'batch_677f5f3b0b848190ad7c309f7a3e975e',
  'batch_677f5f4ef1cc8190a93f11be0377fa3e',
  'batch_677f5f6bc5e48190954ba756fe1a434c',
  'batch_677f5f8018e08190878b302bca1bc597',
  'batch_677f5f96441081908391b1eb5f6a84ad',
  'batch_677f5fad0e8881909161ededd0d7b03f',
  'batch_677f5fc1f67c819094567e838381de42',
  'batch_677f5fd87b448190a751882b48119d2a',
  'batch_677f5feddfcc8190b0452d1b5134cd6b',
  'batch_677f600220d48190adfffe6311af19bc',
  'batch_677f601624d081909f4696002821423c',
  'batch_677f6029d78c8190a5a673f62bdbe797',
  'batch_677f60400f708190b04f32bae02c2bce',
  'batch_677f6082fdac81908d7e16573f6ce39d',
  'batch_677f6097e00081908b3cd35ccf1eb90b',
  'batch_677f60ad12f0819086639777dcb057da',
  'batch_677f60c2370481908e0759e3ad465616',
  'batch_677f60d79f08819092d45dbd93b6f490',
  'batch_677f60eb13c88190b598fe4b6412d481',
  'batch_677f610083848190b75d5cda4513d177',
  'batch_677f6115ec088190a42f71a783c7abdc',
  'batch_677f6129fe4c8190a4fce34ab57c5ccd',
  'batch_677f613d9ac081909bbe59ab859ec573',
  'batch_677f61537818819094fc215dc83bc58a',
  'batch_677f616971d08190b91354f2b6ecdf86',
  'batch_677f617dde84819091c6596ac3afa76b',
  'batch_677f6192ed98819082f03947ef55356f',
  'batch_677f61a988f081908db98ffdab139e2e',
  'batch_677f61ac0edc81909d336ddea0452547',
]

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
