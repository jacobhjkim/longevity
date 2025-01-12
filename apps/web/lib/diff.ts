import { eat, exercise, females, measurements, pregnancy } from '@repo/protocol-data'
import type { ProtocolUpdateQueryOutput, Update, queryProtocolUpdate } from '~/server/queries'

// Pre-split protocols for efficient access
const splits = {
  eat: eat.split('\n'),
  measurements: measurements.split('\n'),
  exercise: exercise.split('\n'),
  females: females.split('\n'),
  pregnancy: pregnancy.split('\n'),
}

/**
 * Get slice bounds for extracting lines around a specific index
 * @param lineNumber - Target line number
 * @param totalLines - Total number of lines in the protocol
 * @param n - Number of lines before and after
 */
function getSliceBounds(lineNumber: number, totalLines: number, n: number): [number, number] {
  const start = Math.max(0, lineNumber - n)
  const end = Math.min(totalLines, lineNumber + n + 1) // Include `n` lines after
  return [start, end]
}

/**
 * Find the line number of the given line in the protocol
 * @param p - Protocol split into lines
 * @param line - Line content to find
 */
function findLineNumber(p: string[], line: string): number {
  return p.findIndex((l) => l.includes(line))
}

/**
 * Get surrounding lines from a specific line number
 * @param lineNumber - Target line number
 * @param protocol - Protocol key
 * @param n - Number of lines before and after
 */
function getPlusMinusNLines(lineNumber: number, protocol: keyof typeof splits, n = 5): string {
  const [start, end] = getSliceBounds(lineNumber, splits[protocol].length, n)
  return splits[protocol].slice(start, end).join('\n')
}

/**
 * Insert new lines into the protocol at a specific position
 * @param lineNumber - Target line number
 * @param protocol - Protocol key
 * @param newLines - Lines to insert
 * @param n - Number of lines before and after
 */
function weaveNewLines(lineNumber: number, protocol: keyof typeof splits, newLines: string, n = 5): string {
  const [start] = getSliceBounds(lineNumber, splits[protocol].length, n)
  const lines = splits[protocol].slice(start, lineNumber + n + 1) // Include target line and surroundings
  return lines.toSpliced(lineNumber - start, 0, newLines).join('\n')
}

export type Diff = {
  doi: string
  title: string
  category: string
  server: string
  date: string
  diff: {
    protocol: keyof typeof splits
    oldValue: string
    newValue: string
    reason: string
  }[]
}

type Result = Record<keyof typeof splits, Diff[]>

const protocols = Object.keys(splits) as Array<keyof typeof splits>

/**
 * Calculate the diff between old and new protocols
 * @param protocol
 * @param r
 */
function calculateDiff(protocol: keyof typeof splits, r: Update) {
  const lineNumber = findLineNumber(splits[protocol], r.oldProtocol)
  if (lineNumber === -1) {
    return {
      protocol,
      oldValue: r.oldProtocol,
      newValue: r.newProtocol,
      reason: r.reason,
    }
  }

  const oldValue = getPlusMinusNLines(lineNumber, protocol, 2)

  if (r.changeType === 'add') {
    return {
      protocol,
      oldValue,
      newValue: weaveNewLines(lineNumber, protocol, r.newProtocol, 2),
      reason: r.reason,
    }
  }

  if (r.changeType === 'update') {
    return {
      protocol,
      oldValue,
      newValue: oldValue.replace(r.oldProtocol, r.newProtocol),
      reason: r.reason,
    }
  }

  return {
    protocol,
    oldValue: r.oldProtocol,
    newValue: r.newProtocol,
    reason: r.reason,
  }
}

export type DiffWithProtocol = {
  doi: string
  title: string
  category: string
  server: string
  date: string
  tokenIn: number
  tokenOut: number
  diff: {
    protocol: keyof typeof splits
    oldValue: string
    newValue: string
    reason: string
  }[]
}

/**
 * Generate a diff result based on protocol updates
 * @param data
 */
export function diffList(data: Awaited<ReturnType<typeof queryProtocolUpdate>>) {
  const result: DiffWithProtocol[] = []

  for (const research of data) {
    const buffer = []
    for (const protocol of protocols) {
      const protocolData = research[protocol]
      if (protocolData?.length) {
        const diff = protocolData.map((r) => calculateDiff(protocol, r))
        buffer.push(...diff)
      }
    }

    result.push({
      doi: research.doi,
      title: research.title,
      category: research.category,
      server: research.server,
      date: research.date,
      tokenIn: research.tokenIn,
      tokenOut: research.tokenOut,
      diff: buffer,
    })
  }

  return result.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function diff(research: ProtocolUpdateQueryOutput) {
  const buffer = []
  for (const protocol of protocols) {
    const protocolData = research[protocol]
    if (protocolData?.length) {
      const diff = protocolData.map((r) => calculateDiff(protocol, r))
      buffer.push(...diff)
    }
  }

  return {
    doi: research.doi,
    title: research.title,
    category: research.category,
    server: research.server,
    date: research.date,
    tokenIn: research.tokenIn,
    tokenOut: research.tokenOut,
    diff: buffer,
  }
}

export type DiffNullable = {
  doi: string
  title: string
  category: string
  server: string
  date: string
  diff:
    | {
        protocol: keyof typeof splits
        oldValue: string
        newValue: string
        reason: string
      }[]
    | null
}

export function insertDiffComponent(diff: DiffNullable) {
  const updateSplits = structuredClone(splits)

  if (diff.diff !== null) {
    for (let i = 0; i < diff.diff.length; i++) {
      const d = diff.diff[i]
      if (!d) {
        continue
      }
      const oldValueLastLine = d.oldValue.split('\n').slice(-1)[0]
      if (!oldValueLastLine) {
        continue
      }
      const lineNumber = findLineNumber(updateSplits[d.protocol], oldValueLastLine)
      if (lineNumber === -1) {
        continue
      }

      const diffObj = {
        num: i,
        doi: diff.doi,
        title: diff.title,
        category: diff.category,
        server: diff.server,
        date: diff.date,
        protocol: d.protocol,
        oldValue: d.oldValue,
        newValue: d.newValue,
        reason: d.reason,
      }

      updateSplits[d.protocol] = updateSplits[d.protocol].toSpliced(
        lineNumber,
        0,
        `~~~diff
${JSON.stringify(diffObj)}
~~~`,
      )
    }
  }

  return {
    eat: updateSplits.eat.join('\n'),
    measurements: updateSplits.measurements.join('\n'),
    exercise: updateSplits.exercise.join('\n'),
    females: updateSplits.females.join('\n'),
    pregnancy: updateSplits.pregnancy.join('\n'),
  }
}
