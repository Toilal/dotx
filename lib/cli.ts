#!/usr/bin/env node
/* eslint-disable unicorn/no-process-exit,node/shebang */
/* eslint-disable no-process-exit */
import { main, Options, OutputType } from './index.js'
import yargs from 'yargs'
// eslint-disable-next-line node/file-extension-in-import
import { hideBin } from 'yargs/helpers'

const builder = yargs(hideBin(process.argv))
  .locale('en')
  .positional('command', {
    type: 'string',
    description: 'command to run'
  })
  .option('files', {
    alias: 'f',
    type: 'string',
    array: true,
    description: '.env files to load'
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    choices: ['set', 'export', 'json', 'json-pretty'] as OutputType[],
    description: 'output all environment variables'
  })
  .option('read-value', {
    alias: 'r',
    type: 'string',
    description: 'read value for one environment variable'
  })
  .option('shell', {
    alias: 's',
    type: 'boolean',
    description: 'execute the command in shell'
  })
  .showHelpOnFail(true)

const parsed = builder.parse()

const options: Options = {
  command: parsed._.join(' '),
  files: parsed.files,
  output: parsed.output as OutputType,
  readValue: parsed['read-value'],
  execaOptions: {
    shell: parsed.shell === true ? true : undefined
  }
}

if (options.command === undefined && options.output === undefined) {
  builder.showHelp()
} else {
  const returnValue = await main(options)
  if (typeof returnValue === 'string') {
    console.log(returnValue)
  } else if (returnValue !== undefined) {
    if (returnValue.signal !== undefined) {
      process.kill(process.pid, returnValue.signal)
    } else if (returnValue.exitCode !== undefined) {
      process.exit(returnValue.exitCode)
    }
  }
}
