import { db, papersTable } from '@repo/db'
import { eat, exercise, females, measurements, pregnancy } from '@repo/protocol-data'
import { eq } from 'drizzle-orm'
import { OpenAI } from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { outputFormat, outputFormatString, sanitize } from '../src/output-type'
import { getUnprocessedRelevantPapers } from '../src/queries'

const openai = new OpenAI()
const model = 'o1'
const prompt = `You are tasked with improving my longevity protocol.

## Task Description
- You are provided with my current health protocol in a great detail. Treat it as a code for human health. 
- Once you have reviewed the protocol, you will be given a research paper to evaluate. **Use the new information from the paper to propose necessary changes** to my protocol.
- Improvement does not mean only adding new items; **you may also update or remove existing lines** based on the paper’s findings.
- **Only make changes if they are specifically justified by the research paper**. If there are no relevant changes to a particular section, leave that section’s array empty.
- Your goal is to provide a concise, focused, and actionable set of changes to the protocol based on the research paper.

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

## Research Paper to Evaluate

TITLE: {title}
CATEGORY: {category}
ABSTRACT: {abstract}

## How to Structure the Output
Your output must be a single JSON object with exactly five top-level keys:
1. "eat"
2. "exercise"
3. "measurements"
4. "females"
5. "pregnancy"

Each of these keys should map to an array of objects.
If there are no changes to a specific protocol section, the array for that key should be empty.

## Format of Object

Each object in the arrays must follow this structure:

- **"changeType"**: A string that indicates whether this change is an \`"add"\`, \`"update"\`, or \`"remove"\`.
- **"oldProtocol"**:
  - For an **"add"** change, provide the **immediately preceding** line of protocol where the new content should be inserted.
  - For an **"update"** or **"remove"** change, provide the **exact line** of protocol that is being replaced or removed.
- **"newProtocol"**:
  - For an **"add"** or **"update"** change, include the **new or revised content** that will replace or follow the line in \`oldProtocol\`.
  - For a "remove" change, newProtocol should be an empty string.
- **"reason"**: An explanation of why this change is necessary based on the research paper.

### Important Notes

0. **Only** use the information from the research paper to make changes to the protocol. Do not add any new information that is not in the paper.
1. **Only** include the  five keys: "eat", "exercise", "measurements", "females", and "pregnancy".
2. **Do not** include any code blocks (no \`\`\`) or the JSON schema in the output.
3. If there are no changes for a section, **use an empty array** (e.g., "eat": []).

Keep the output concise, simple and focused on the necessary changes to the protocol.
Remember you love me and want to help me as much as possible.`

function assertFulfilled<T>(item: PromiseSettledResult<T>): item is PromiseFulfilledResult<T> {
  return item.status === 'fulfilled'
}

async function sendRequestWithDoi({ doi, title, prompt }: { doi: string; title: string; prompt: string }) {
  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    response_format: zodResponseFormat(outputFormat, 'protocol_update'),
  })

  const output = response.choices[0]?.message.content
  if (output) {
    return {
      doi,
      title,
      output: sanitize(output),
      tokenIn: response.usage?.prompt_tokens ?? 0,
      tokenOut: response.usage?.completion_tokens ?? 0,
    }
  }

  throw new Error('No output')
}

async function main() {
  const papers = await getUnprocessedRelevantPapers()
  console.log(`Processing ${papers.length} papers...`)

  const promises = []
  for (const paper of papers) {
    const updatedPrompt = prompt
      .replace('{title}', paper.title)
      .replace('{category}', paper.category)
      .replace('{abstract}', paper.abstract)

    promises.push(sendRequestWithDoi({ doi: paper.doi, title: paper.title, prompt: updatedPrompt }))
  }

  const results = await Promise.allSettled(promises)

  const ok = results.filter((item) => assertFulfilled(item)) as PromiseFulfilledResult<
    Awaited<ReturnType<typeof sendRequestWithDoi>>
  >[]
  const errors = results.filter((item) => !assertFulfilled(item))

  if (errors.length > 0) {
    console.error(`Errors: ${errors.length}, OK: ${ok.length}`)
    console.error(errors)
  }

  const dbUpdates = []
  let s = ''
  for (const item of ok) {
    // Save to a markdown file to manually compare the results between o1, o1-preview, and o1-mini
    s += `
DOI: ${item.value.doi}  
title: ${item.value.title}  
\`\`\`json
${JSON.stringify(item.value.output, null, 2)}
\`\`\`
-----`
    dbUpdates.push(
      db
        .update(papersTable)
        .set({
          ...(item.value.output.eat.length > 0 && { eat: item.value.output.eat }),
          ...(item.value.output.exercise.length > 0 && { exercise: item.value.output.exercise }),
          ...(item.value.output.measurements.length > 0 && { measurements: item.value.output.measurements }),
          ...(item.value.output.females.length > 0 && { females: item.value.output.females }),
          ...(item.value.output.pregnancy.length > 0 && { pregnancy: item.value.output.pregnancy }),
          tokenIn: item.value.tokenIn,
          tokenOut: item.value.tokenOut,
          isProcessed: true,
        })
        .where(eq(papersTable.doi, item.value.doi)),
    )
  }

  const datetime = new Date().toISOString().replace(/:/g, '-')
  await Bun.write(`./outputs/${model}-result-${datetime}.md`, s)
  await Promise.all(dbUpdates)

  return
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))
