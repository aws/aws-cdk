#!/usr/bin/env node
const standardVersion = require('standard-version');
const fs = require('fs');
const path = require('path');
const ver = require('./resolve-version');
const repoRoot = path.join(__dirname, '..');

const releaseAs = process.argv[2] ?? 'minor';
const forTesting = process.env.BUMP_CANDIDATE ?? false;

async function main() {
  if (releaseAs !== 'minor' && releaseAs !== 'patch') {
    throw new error(`invalid bump type "${releaseAs}". only "minor" (the default) and "patch" are allowed. major version bumps require *slightly* more intention`);
  }

  console.error(`Starting ${releaseAs} version bump`);
  console.error('Version information:', JSON.stringify(ver, undefined, 2));

  const changelogPath = path.join(repoRoot, ver.changelogFile);
  const opts = {
    releaseAs: releaseAs,
    skip: { tag: true },
    packageFiles: [ { filename: ver.versionFile, type: 'json' } ],
    bumpFiles: [ { filename: ver.versionFile, type: 'json' } ],
    infile: ver.changelogFile,
    prerelease: ver.prerelease,
    scripts: {
      postchangelog: `${path.join(__dirname, 'changelog-experimental-fix.sh')} ${changelogPath}`
    }
  };

  if (forTesting) {
    console.error(`BUMP_CANDIDATE is set, so bumping version for testing (with the "test" prerelease tag)`);
    opts.skip.commit = true;
    opts.changelog = true;
    opts.prerelease = 'test'
  }

  await standardVersion(opts);
}

main().catch(err => {
  console.error(err.stack);
  process.exit(1);
});