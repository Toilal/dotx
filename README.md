# dotx

Bridge the gap between shell commands and [dotenv](https://www.npmjs.com/package/dotenv) `.env` files.

## Install

```bash
npm install --global @toilal/dotx
```

## Docs

`dotx` can be used to run any command with environment variable loaded from `.env` file.

```bash
dotx <command>
```

A custom `.env` file can be given:

```bash
dotx -f .env.test <command>
```

You may also set many `.env` files.

```bash
dotx -f .env -f .env.local <command>
```

*later files have higher priority and will erase variables loaded from previous files*

`.env` files can be loaded into current shell using the following trick:

```bash
eval $(dotx -o export)
```

You can also grab a single value

```bash
MY_VAR=$(dotx -r MY_VAR)
```

## Usage

```bash
$ dotx --help
Options:
      --help        Show help                                          [boolean]
      --version     Show version number                                [boolean]
  -f, --files       .env files to load                                   [array]
  -o, --output      output environment variable
                      [string] [choices: "set", "export", "json", "json-pretty"]
  -r, --read-value  read value for one environment variable             [string]
  -s, --shell       execute the command in shell                       [boolean]
```
