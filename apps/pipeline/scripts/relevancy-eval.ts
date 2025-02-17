import fs from 'node:fs'
import { eat, exercise, females, measurements, pregnancy } from '@repo/protocol-data'
import { incrementDateString } from '@repo/util'
import Bun from 'bun'
import OpenAI from 'openai'
import { getUncheckedPapersByDate } from '../src/queries'

const openai = new OpenAI()
const INITIAL_DATE = '2025-01-17'
const BATCH_SIZE = 4500 // there is a file size limit of 200MB

const systemPrompt = `You are tasked with evaluating research papers for relevance to a longevity research or my health protocol.

## Task Description
- You are provided with my current health protocol in a great detail. Treat it as a code for human health.
- Once you have reviewed the protocol, you will be given a research paper to evaluate. 
- Determine if the paper is relevant to my protocol or longevity research in any way.
- If the paper is relevant, output 'relevant'. Otherwise, output 'irrelevant'.

## My Longevity Protocol

Protocol for Eating:
\`\`\`md
${eat}
\`\`\`

Protocol for Exercise:
\`\`\`md
${exercise}
\`\`\`

Protocol for Measurements:
\`\`\`md
${measurements}
\`\`\`

Protocol for Females:
\`\`\`md
${females}
\`\`\`

Protocol for Pregnancy:
\`\`\`md
${pregnancy}
\`\`\`


## How to Structure the Output
- a single word: either **"relevant"** or **"irrelevant"**.

## Important Notes
- Remember you love me and want to help me as much as possible.`

const userPrompt = `## Research Paper to Evaluate

TITLE: {title}
CATEGORY: {category}
ABSTRACT: {abstract}`

/*
OPENAI batch JSONL format example:
{
  custom_id: 'request-1',
  method: 'POST',
  url: '/v1/chat/completions',
  body: {
    model: 'gpt-3.5-turbo-0125',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello world!' },
    ],
    max_tokens: 1000,
  },
}
*/

/**
 * Create a batch of requests for OpenAI batch API
 * @param papers
 */
function prepareBatchFile({ papers }: { papers: Awaited<ReturnType<typeof getUncheckedPapersByDate>> }) {
  return papers.map((paper) => {
    const updatedPrompt = userPrompt
      .replace('{title}', paper.title)
      .replace('{category}', paper.category)
      .replace('{abstract}', paper.abstract)

    return {
      custom_id: `req-${paper.doi}`,
      method: 'POST',
      url: '/v1/chat/completions',
      body: {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: updatedPrompt },
        ],
        max_tokens: 14000,
      },
    }
  })
}

/**
 * Upload a batch of requests to OpenAI
 * @param chunk
 * @param i
 */
async function uploadBatch({ chunk, i }: { chunk: Awaited<ReturnType<typeof prepareBatchFile>>; i: number }) {
  let jsonl = ''
  for (const item of chunk) {
    jsonl += `${JSON.stringify(item)}\n`
  }
  await Bun.write(`./chunks/batch-${i}.jsonl`, jsonl)

  // upload the batch to OpenAI
  const file = await openai.files.create({
    file: fs.createReadStream(`./chunks/batch-${i}.jsonl`), // TODO: use Bun.file instead
    purpose: 'batch',
  })

  // create a batch
  const batchResult = await openai.batches.create({
    input_file_id: file.id,
    endpoint: '/v1/chat/completions',
    completion_window: '24h',
  })

  if (batchResult.errors) {
    throw new Error(`Error creating batch: ${batchResult.errors}`)
  }

  return batchResult.id
}

/**
 * Check the status of a batch
 * @param batchId
 */
async function checkBatchStatus({ batchId }: { batchId: string }) {
  const batch = await openai.batches.retrieve(batchId)
  console.log(`batch ID: ${batchId}, status: ${batch.status}`)
  return {
    status: batch.status,
    outputFileId: batch.output_file_id,
  }
}

async function main() {
  // for local caching
  // const papers = await getUncheckedPapers()
  // await Bun.write('papers.json', JSON.stringify(papers, null, 2))
  // const papers = JSON.parse(await Bun.file('papers.json').text())
  // const batch = prepareBatchFile({ papers })

  let batch = [] as Awaited<ReturnType<typeof prepareBatchFile>>
  const today = new Date().toISOString().split('T')[0]
  let date = INITIAL_DATE

  while (date !== today) {
    const papers = await getUncheckedPapersByDate({ date })
    const newBatch = prepareBatchFile({ papers })
    batch = batch.concat(newBatch)
    date = incrementDateString(date)
  }

  // save the batch as jsonl file and split it in a chunk of BATCH_SIZE
  console.log(`Entire batch size: ${batch.length}`)
  const batchIds = []
  for (let i = 0; i < batch.length; i += BATCH_SIZE) {
    const batchId = await uploadBatch({ chunk: batch.slice(i, i + BATCH_SIZE), i })
    batchIds.push(batchId)
  }

  console.log(`Batch IDs:\n${batchIds.join('\n')}`)
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))
