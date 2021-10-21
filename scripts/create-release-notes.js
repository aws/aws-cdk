#!/usr/bin/env node

const cdkRelease = require('@aws-cdk/cdk-release');
const ver = require('./resolve-version');

async function main() {
  await cdkRelease.createReleaseNotes({
    versionFile: ver.versionFile,
    changelogFile: ver.changelogFile,
    alphaChangelogFile: ver.alphaChangelogFile,
    releaseNotesFile: 'RELEASE_NOTES.md',
  });
}

main().catch(err => {
  console.error(err.stack);
  process.exit(1);
});
