#!/usr/bin/env node
/**
 * Bumps the version of the AWS CDK monorepo.
 * 
 * Usage:
 *   bump.js [minor|patch]
 * 
 * Supports both standard-version (legacy) and cdk-release approaches.
 * Set BUMP_CANDIDATE=true for testing without committing.
 * Set LEGACY_BUMP=true to use standard-version instead of cdk-release.
 */
const fs = require('fs');
const path = require('path');
const semver = require('semver');
const ver = require('./resolve-version');
const { execSync } = require('child_process');

const VALID_BUMP_TYPES = ['minor', 'patch'];

async function main() {
  const releaseAs = process.argv[2] || 'minor';
  
  if (!VALID_BUMP_TYPES.includes(releaseAs)) {
    console.error(`Error: Invalid bump type "${releaseAs}".`);
    console.error(`Valid options: ${VALID_BUMP_TYPES.join(', ')}`);
    console.error('\nNote: Major version bumps require manual intervention.');
    process.exit(1);
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
    repoRoot,
    scripts: {
      postchangelog: `node ${path.join(__dirname, 'changelog-experimental-fix.js')} ${changelogPath}`
    }
  };

  const forTesting = Boolean(process.env.BUMP_CANDIDATE);
  if (forTesting) {
    opts.skip.commit = true;
    opts.skip.changelog = true;

    // If we are on a "stable" branch, add a pre-release tag ("rc") to the
    // version number as a safety in case this version will accidentally be published.
    opts.prerelease = ver.prerelease || 'rc';
    console.error(`✓ BUMP_CANDIDATE is set, so bumping version for testing (with the "${opts.prerelease}" prerelease tag)`);
  } else {
    // Check if there have been changes since the last release.
    // If not, skip the release - customers won't appreciate a version with 0 changes.
    const prevVersion = ver.version;
    const gitDiffCommand = `git diff-tree --name-only v${prevVersion} HEAD`;
    const topLevelFileChanges = execSync(gitDiffCommand, { encoding: 'utf-8' })
      .split('\n')
      .filter(file => file.trim());

    // Only release if there have been changes to files other than metadata files.
    // For an empty release, the diff would only show updates to CHANGELOG and version files
    // (through mergeback).
    const hasInterestingChanges = topLevelFileChanges.some(fileName => 
      !fileName.includes('CHANGELOG') && !fileName.startsWith('version.')
    );

    if (!hasInterestingChanges) {
      console.error('✓ No changes detected since last release -- we\'re done here.');
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
    await cdkRelease.createRelease(opts);
  }
}

main().catch(err => {
  console.error(err.stack);
  process.exitCode = 1;
});
