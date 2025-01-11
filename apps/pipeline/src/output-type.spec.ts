import { describe, expect, test } from 'bun:test'
import { sanitize } from './output-type'

describe('test_sanitize', () => {
  test('should sanitize output with language specifier', () => {
    const s = `\`\`\`json
{
  "eat": [],
  "exercise": [],
  "measurements": [
    {
      "changeType": "update",
      "oldProtocol": "foo",
      "newProtocol": "bar",
      "reason": "baz"
    }
  ],
  "females": [],
  "pregnancy": []
}
\`\`\``
    const expected = {
      eat: [],
      exercise: [],
      measurements: [
        {
          changeType: 'update',
          oldProtocol: 'foo',
          newProtocol: 'bar',
          reason: 'baz',
        },
      ],
      females: [],
      pregnancy: [],
    }

    const actual = sanitize(s)
    // @ts-ignore
    expect(actual).toEqual(expected)
  })

  test('should add missing fields', () => {
    const s = `{
  "eat": [],
  "exercise": []
}`
    const expected = {
      eat: [],
      exercise: [],
      measurements: [],
      females: [],
      pregnancy: [],
    }

    const actual = sanitize(s)
    expect(actual).toEqual(expected)
  })

  test('should parse double closing braces', () => {
    const s = `{
  "eat": [],
  "exercise": [],
  "measurements": [],
  "females": [],
  "pregnancy": []
}
}`
    const expected = {
      eat: [],
      exercise: [],
      measurements: [],
      females: [],
      pregnancy: [],
    }

    const actual = sanitize(s)
    expect(actual).toEqual(expected)
  })
})
