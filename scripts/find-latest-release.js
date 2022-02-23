// Find the latest CDK release on GitHub matching a particular semver range
//
// The range can be something like '<1.2.3' to find the latest release before a given version,
// or '2' to find the latest v2 release.
//
// Only searches the most recent 100 GitHub releases, so only use this to query fairly recent versions.
const cp = require('child_process');
const semver = require('semver');

async function main(matchRange) {
  if (matchRange === undefined) {
    throw new Error('Usage: find-latest-release.js RANGE');
  }
  const range = semver.validRange(matchRange);
  if (!range) {
    throw new Error(`Not a valid range: ${matchRange}`);
  }

  const { stdout, error } = cp.spawnSync('curl', ['https://api.github.com/repos/aws/aws-cdk/releases?per_page=100'], { maxBuffer: 10_000_000 });
  if (error) { throw error; }
  const releases = JSON.parse(stdout);
  const versions = releases.map(r => r.name.replace(/^v/, '')); // v1.2.3 -> 1.2.3

  const sat = semver.maxSatisfying(versions, range);
  if (!sat) {
    throw new Error(`No range satisfied ${range} (on the first page of GitHub releases)`);
  }
  console.log(sat);
}

main(process.argv[2]).catch(e => {
  console.error(e);
  process.exitCode = 1;
});