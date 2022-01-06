#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const semver = require('semver');
const ver = require('./resolve-version');
const { execSync } = require('child_process');

async function main() {
  const releaseAs = process.argv[2] || 'minor';
  if (releaseAs !== 'minor' && releaseAs !== 'patch') {
    throw new Error(`invalid bump type "${releaseAs}". only "minor" (the default) and "patch" are allowed. major version bumps require *slightly* more intention`);
  }

  console.error(`Starting ${releaseAs} version bump`);
  console.error('Current version information:', JSON.stringify(ver, undefined, 2));

  const repoRoot = path.join(__dirname, '..');
  const changelogPath = path.join(repoRoot, ver.changelogFile);
  const opts = {
    releaseAs: releaseAs,
    skip: { tag: true },
    packageFiles: [ { filename: ver.versionFile, type: 'json' } ],
    bumpFiles: [ { filename: ver.versionFile, type: 'json' } ],
    infile: ver.changelogFile,
    prerelease: ver.prerelease,
    scripts: {
      postchangelog: `node ${path.join(__dirname, 'changelog-experimental-fix.js')} ${changelogPath}`
    }
  };

  const forTesting = process.env.BUMP_CANDIDATE || false;
  if (forTesting) {
    opts.skip.commit = true;
    opts.skip.changelog = true;

    // if we are on a "stable" branch, add a pre-release tag ("rc") to the
    // version number as a safety in case this version will accidentally be
    // published.
    opts.prerelease = ver.prerelease || 'rc';
    console.error(`BUMP_CANDIDATE is set, so bumping version for testing (with the "${opts.prerelease}" prerelease tag)`);
  } else {
    // We're not running the bump in a regular pipeline, we're running it "for real" to do an actual release.
    //
    // In that case -- check if there have been changes since the last release. If not, there's no point in
    // doing the release at all. Our customers won't appreciate a new version with 0 changes.
    const prevVersion = ver.version;
    const topLevelFileChanges = execSync(`git diff-tree --name-only v${prevVersion} HEAD`, { encoding: 'utf-8' }).split('\n').filter(x => x);

    // We only release if there have been changes to files other than metadata files
    // (for an empty release, the difference since the previous release is updates to json files and the changelog, through
    // mergeback)
    const anyInteresting = topLevelFileChanges.some(name => !name.includes('CHANGELOG') && !name.startsWith('version.'));

    if (!anyInteresting) {
      console.error(`No changes detected since last release -- we're done here.`);
      return;
    }
  }

  const majorVersion = semver.major(ver.version);

  const useLegacyBump = process.env.LEGACY_BUMP || false;
  if (useLegacyBump) {
    console.error("ℹ️ Using the third-party 'standard-version' package to perform the bump");

    // `standard-release` will -- among other things -- create the changelog.
    // However, on the v2 branch, `conventional-changelog` (which `standard-release` uses) gets confused
    // and creates really muddled changelogs with both v1 and v2 releases intermingled, and lots of missing data.
    // A super HACK here is to locally remove all version tags that don't match this major version prior
    // to doing the bump, and then later fetching to restore those tags.
    execSync(`git tag -d $(git tag -l | grep -v '^v${majorVersion}.')`);

    // Delay loading standard-version until the git tags have been pruned.
    const standardVersion = require('standard-version');
    await standardVersion(opts);

    // fetch back the tags, and only the tags, removed locally above
    execSync('git fetch origin "refs/tags/*:refs/tags/*"');
  } else {
    // this is incredible, but passing this option to standard-version actually makes it crash!
    // good thing we're getting rid of it...
    opts.verbose = !!process.env.VERBOSE;
    if (majorVersion > 1) {
      opts.experimentalChangesTreatment = 'separate';
    }
    // Rename some options to match cdk-release inputs (replaces bumpFiles, packageFiles, and infile)
    opts.versionFile = ver.versionFile;
    opts.changelogFile = ver.changelogFile;
    opts.alphaChangelogFile = ver.alphaChangelogFile;
    console.error("🎉 Calling our 'cdk-release' package to make the bump");
    console.error("ℹ️ Set the LEGACY_BUMP env variable to use the old 'standard-version' bump instead");
    const cdkRelease = require('@aws-cdk/cdk-release');
    cdkRelease.createRelease(opts);
  }
}

main().catch(err => {
  console.error(err.stack);
  process.exit(1);
});
