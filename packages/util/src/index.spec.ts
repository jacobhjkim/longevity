import { describe, expect, test } from 'bun:test'
import { incrementInterval } from './'

describe('incrementInterval', () => {
  test('base case', () => {
    const interval = '2021-01-01/2021-01-02'
    const result = incrementInterval({ interval })
    expect(result).toBe('2021-01-02/2021-01-03')
  })

  test('year change', () => {
    const interval = '2021-12-31/2022-01-01'
    const result = incrementInterval({ interval })
    expect(result).toBe('2022-01-01/2022-01-02')
  })
})
