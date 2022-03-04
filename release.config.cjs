module.exports = {
  branches: ['main', { name: 'beta', prerelease: true }, { name: 'alpha', prerelease: true }],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        'preset': 'conventionalcommits'
      }
    ],
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        'assets': [
          'CHANGELOG.md',
          'package.json',
          'yarn.lock'
        ],
        'message': 'chore(release): ${nextRelease.gitTag} [skip ci]'
      }
    ],
    '@semantic-release/github'
  ]
}

