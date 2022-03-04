import { clearEnvironment, getAbsoluteDirectory, getExpectedFilename, loadExpected } from './test.utils.js'
import type { OutputType } from '../lib/index.js'
import { main } from '../lib/index.js'

const initialCwd = process.cwd()

describe('index.ts', () => {
  beforeAll(() => {
    clearEnvironment()
  })

  beforeEach(() => {
    process.chdir(initialCwd)
  })

  afterEach(() => {
    process.chdir(initialCwd)
  })

  for (const directoryName of ['single', 'quotes', 'expand']) {
    describe(`output (${directoryName})`, () => {
      beforeEach(() => {
        process.chdir(getAbsoluteDirectory(directoryName))
      })

      for (const output of ['set', 'export', 'json', 'json-pretty'].filter(s => getExpectedFilename(s as OutputType, directoryName) !== undefined) as OutputType[]) {
        it(`should output single variable (${output})`, async () => {
          const data = await main({
            output
          })

          const expected = await loadExpected(output, directoryName)
          expect(data).toEqual(expected)
        })
      }
    })
  }
})
