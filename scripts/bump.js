#!/usr/bin/env node
const standardVersion = require('standard-version');
const fs = require('fs');
const path = require('path');
const ver = require('./resolve-version');
const repoRoot = path.join(__dirname, '..');

const releaseAs = process.argv[2] || 'minor';
const forTesting = process.env.BUMP_CANDIDATE || false;

async function main() {
  if (releaseAs !== 'minor' && releaseAs !== 'patch') {
    throw new error(`invalid bump type "${releaseAs}". only "minor" (the default) and "patch" are allowed. major version bumps require *slightly* more intention`);
  }

  console.error(`Starting ${releaseAs} version bump`);
  console.error('Current version information:', JSON.stringify(ver, undefined, 2));

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
    opts.skip.commit = true;
    opts.skip.changelog = true;

    // if we are on a "stable" branch, add a pre-release tag ("rc") to the
    // version number as a safety in case this version will accidentally be
    // published.
    opts.prerelease = ver.prerelease || 'rc'
    console.error(`BUMP_CANDIDATE is set, so bumping version for testing (with the "${opts.prerelease}" prerelease tag)`);
  }

  return standardVersion(opts);
}

main().catch(err => {
  console.error(err.stack);
  process.exit(1);
});
