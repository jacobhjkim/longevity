import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const changeFormat = z.object({
  changeType: z.enum(['add', 'update', 'remove']),
  oldProtocol: z.string(),
  newProtocol: z.string(),
  reason: z.string(),
})

export const outputFormat = z.object({
  eat: z.array(changeFormat),
  exercise: z.array(changeFormat),
  measurements: z.array(changeFormat),
  females: z.array(changeFormat),
  pregnancy: z.array(changeFormat),
})

const lenientOutputFormat = z.object({
  eat: z.array(changeFormat).optional(),
  exercise: z.array(changeFormat).optional(),
  measurements: z.array(changeFormat).optional(),
  females: z.array(changeFormat).optional(),
  pregnancy: z.array(changeFormat).optional(),
})

type lenientOutputFormatType = z.infer<typeof lenientOutputFormat>
export type outputFormatType = z.infer<typeof outputFormat>

export const outputFormatString = JSON.stringify(zodResponseFormat(outputFormat, 'protocol_update'), null, 2)

export function sanitize(output: string) {
  // remove all code blocks
  let sanitizedOutput = output
    .replace(/```(?:\w+)?\n?/g, '')
    .replace(/```/g, '')
    .trim()

  /* some output looks like this:
  {
    "eat": [],
    "exercise": [],
    "measurements": [],
    "females": [],
    "pregnancy": []
  }
  } <- this
  */
  if (sanitizedOutput.endsWith('}\n}')) {
    sanitizedOutput = sanitizedOutput.slice(0, -1)
  }

  let parsedOutput: lenientOutputFormatType
  try {
    parsedOutput = JSON.parse(sanitizedOutput)
  } catch (e) {
    console.error(`cannot parse output:\n${output}`)
    throw new Error('Invalid output format')
  }

  if (!parsedOutput) {
    throw new Error('parsedOutput is null')
  }

  const result = lenientOutputFormat.safeParse(parsedOutput)
  if (!result.success) {
    console.error(`invalid output format:\n${output}`)
    throw new Error('Invalid output format')
  }

  const data = result.data

  // sometimes the LLM returns an object without all the fields
  return {
    eat: data.eat || [],
    exercise: data.exercise || [],
    measurements: data.measurements || [],
    females: data.females || [],
    pregnancy: data.pregnancy || [],
  }
}
