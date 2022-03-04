import path from 'path'
import type { OutputType } from '../lib/index.js'
import { match } from 'ts-pattern'
import { existsSync, readFile } from 'fs'
import { promisify } from 'util'

const readFilePromise = promisify(readFile)

export function clearEnvironment () {
  for (const key in process.env) {
    if (key !== 'NODE_ENV') {
      delete process.env[key]
    }
  }
}

export function getAbsoluteDirectory (...directory: string[]) {
  const currentFile = import.meta.url
  const dataDirectory = path.join(new URL(currentFile).pathname, '..', 'data', ...directory)
  return dataDirectory
}

export function getExpectedFilename (outputType: OutputType, ...directory: string[]): string | undefined {
  const filename = match(outputType)
    .with('set', () => '.expected.set.sh')
    .with('export', () => '.expected.export.sh')
    .with('json', () => '.expected.json')
    .with('json-pretty', () => '.expected.pretty.json')
    .exhaustive()

  if (!existsSync(path.join(getAbsoluteDirectory(...directory), filename))) {
    return undefined
  }
  return filename
}

export async function loadExpected (outputType: OutputType, ...directory: string[]): Promise<string> {
  const filename = await getExpectedFilename(outputType, ...directory)
  if (filename === undefined) throw new Error('Expected file not found')
  const buffer = await readFilePromise(filename)
  return buffer.toString()
}
