import { Octokit } from '@octokit/rest';
import * as semver from 'semver';

export async function fetchPreviousVersion(token: string, options?: {
  priorTo?: string,
  majorVersion?: string,
}) {
  const github = new Octokit({ auth: token });
  const releases = await github.repos.listReleases({
    owner: 'aws',
    repo: 'aws-cdk',
  });

  // this returns a list in descending order, newest releases first
  // opts for same major version where possible, falling back otherwise
  // to previous major versions.
  let previousMVRelease = undefined;
  for (const release of releases.data) {
    const version = release.name?.replace('v', '');
    if (!version) { continue; }

    // Any old version is fine
    if (!options?.majorVersion && !options?.priorTo) {
      return version;
    }

    if (options?.majorVersion && `${semver.major(version)}` === options.majorVersion) {
      return version;
    }

    if (options?.priorTo && semver.lt(version, options?.priorTo) && semver.major(version) === semver.major(options.priorTo)) {
      return version;
    }

    // Otherwise return the most recent version that didn't match any
    if (!previousMVRelease) {
      previousMVRelease = version;
    }
  }
  if (previousMVRelease) { return previousMVRelease; }

  throw new Error(`Unable to find previous version given ${JSON.stringify(options)}`);
};