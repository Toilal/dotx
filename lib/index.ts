import { ExecaChildProcess, execaCommand, Options as ExecaOptions } from 'execa'
import { config, DotenvConfigOptions } from 'dotenv'
import { DotenvExpandOptions, expand } from 'dotenv-expand'
import { match } from 'ts-pattern'

export type OutputType = 'set' | 'export' | 'json' | 'json-pretty'

export interface ParseOptions {
  expand?: boolean
  files?: string[]
  dotenvOptions?: DotenvConfigOptions
}

export interface CommandOptions extends ParseOptions {
  command: string
  execaOptions?: Omit<ExecaOptions, 'reject' | 'stdio'>
}

export interface OutputOptions extends ParseOptions {
  output?: OutputType
}

export interface ReadValueOptions extends ParseOptions {
  readValue: string
}

export type Options =
  Partial<ParseOptions>
  & Partial<CommandOptions>
  & Partial<OutputOptions>
  & Partial<ReadValueOptions>

function escapeDoubleQuotes (value: string): string {
  return value.replace(/\\([\S\s])|(")/g, '\\$1$2')
}

function safeDoubleQuotes (value: string): string {
  return `"${escapeDoubleQuotes(value)}"`
}

export function parse (options?: ParseOptions): Record<string, string> {
  const effectiveExpand = options?.expand === false ? (options: DotenvExpandOptions) => options : expand

  let parsed: { [name: string]: string } = {}
  if (options?.files === undefined) {
    parsed = { ...parsed, ...effectiveExpand(config(options?.dotenvOptions)).parsed }
  } else {
    for (const file of options.files) {
      parsed = { ...parsed, ...effectiveExpand(config({ ...options?.dotenvOptions, path: file })).parsed }
    }
  }

  return parsed
}

export function output (options?: OutputOptions): string {
  const parsed = parse(options)
  const output = options?.output ?? 'json-pretty'
  return match(output)
    .with('set', () => Object.entries(parsed).map(([key, value]) => `${key}=${safeDoubleQuotes(value)}`).join('\n'))
    .with('export', () => Object.entries(parsed).map(([key, value]) => `export ${key}=${safeDoubleQuotes(value)}`).join('\n'))
    .with('json', () => JSON.stringify(parsed))
    .with('json-pretty', () => JSON.stringify(parsed, undefined, 2))
    .exhaustive()
}

export function readValue (options: ReadValueOptions): string {
  const parsed = parse(options)
  return parsed[options.readValue]
}

export async function command (options: CommandOptions): Promise<ExecaChildProcess> {
  parse(options)
  return await execaCommand(options.command, { ...options.execaOptions, reject: false, stdio: 'inherit' })
}

export async function main (options?: Options): Promise<ExecaChildProcess | string> {
  if (options?.readValue) {
    return readValue({ ...options, readValue: options.readValue })
  }
  if (options?.output) {
    return output({ ...options, output: options.output })
  }
  if (options?.command) {
    return command({ ...options, command: options.command })
  }
  return output(options)
}
