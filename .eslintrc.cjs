module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:node/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:promise/recommended',
    'plugin:jest/recommended',
    'plugin:unicorn/recommended'
  ],
  env: {
    es2021: true,
    node: true,
    jest: true
  },
  ignorePatterns: [
    'dist/',
    'coverage/',
    '**/generated/',
    'release.config.cjs'
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true
      }
    }
  },
  rules: {
    'no-process-exit': 'off', // duplicates with unicorn/no-process-exit
    'node/no-missing-import': 'off',
    'node/file-extension-in-import': ['error', 'always', {
      tryExtensions: ['.ts', '.js', '.json', '.cjs']
    }],
    'jest/expect-expect': 'off',
    'unicorn/prefer-node-protocol': 'off' // Not available on NodeJS 12
  },
  overrides: [
    {
      files: ['__tests__/**'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        'unicorn/consistent-function-scoping': 'off',
        'node/no-unpublished-import': 'off'
      }
    },
    {
      files: ['**/*.cjs'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
}
