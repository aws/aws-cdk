#!/usr/bin/env node
/**
 * Finds the latest CDK release on npm matching a particular semver range.
 * 
 * Usage:
 *   find-latest-release.js <range>
 * 
 * Examples:
 *   find-latest-release.js '<1.2.3'  # Latest release before 1.2.3
 *   find-latest-release.js '2'       # Latest v2 release
 *   find-latest-release.js '^2.0.0'  # Latest compatible with 2.0.0
 */
const cp = require('child_process');
const semver = require('semver');

/**
 * Main function to find the latest release matching a semver range.
 * @param {string} matchRange - The semver range to match
 */
async function main(matchRange) {
  if (!matchRange) {
    console.error('Usage: find-latest-release.js <range>');
    console.error('\nExamples:');
    console.error('  find-latest-release.js "<1.2.3"  # Latest before 1.2.3');
    console.error('  find-latest-release.js "2"       # Latest v2');
    process.exit(1);
  }
  
  const range = semver.validRange(matchRange);
  if (!range) {
    console.error(`Error: Not a valid semver range: ${matchRange}`);
    console.error('\nSee https://www.npmjs.com/package/semver for valid range syntax.');
    process.exit(1);
  }

  const { stdout, error } = cp.spawnSync(
    'npm',
    ['view', 'aws-cdk-lib', 'versions', '--json'],
    { maxBuffer: 10_000_000 }
  );
  
  if (error) {
    console.error(`Error querying npm: ${error.message}`);
    process.exit(1);
  }

  let versions;
  try {
    versions = JSON.parse(stdout.toString('utf-8'));
  } catch (parseError) {
    console.error(`Error parsing npm response: ${parseError.message}`);
    process.exit(1);
  }

  const maxSatisfyingVersion = semver.maxSatisfying(versions, range);
  if (!maxSatisfyingVersion) {
    console.error(`Error: No version found satisfying range: ${range}`);
    process.exit(1);
  }
  
  console.log(maxSatisfyingVersion);
}

main(process.argv[2]).catch(e => {
  console.error(e);
  process.exitCode = 1;
});
