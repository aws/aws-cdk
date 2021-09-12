import * as path from 'path';
import * as semver from 'semver';
import { writeFile } from '../private/files';
import { notify } from '../private/print';
import { LifecyclesSkip, ReleaseType, Versions } from '../types';

export interface BumpOptions {
  releaseAs: ReleaseType;
  skip?: LifecyclesSkip;
  versionFile: string;
  prerelease?: string;

  dryRun?: boolean;
  verbose?: boolean;
  silent?: boolean;
}

export async function bump(args: BumpOptions, currentVersion: Versions): Promise<Versions> {
  if (args.skip?.bump) {
    return currentVersion;
  }

  const releaseType = getReleaseType(args.prerelease, args.releaseAs, currentVersion.stableVersion);
  const newStableVersion = semver.inc(currentVersion.stableVersion, releaseType, args.prerelease);
  if (!newStableVersion) {
    throw new Error('Could not increment version: ' + currentVersion.stableVersion);
  }

  const newVersion: Versions = {
    stableVersion: newStableVersion,
    alphaVersion: bumpAlphaReleaseVersion(currentVersion, releaseType),
  };

  notify(args,
    'bumping version in ' + args.versionFile + ' from %s to %s',
    [currentVersion, newVersion],
  );
  const versionPath = path.resolve(process.cwd(), args.versionFile);
  const versionFileContents = JSON.stringify({
    version: newVersion.stableVersion,
    alphaVersion: newVersion.alphaVersion,
  }, undefined, 2);
  writeFile(args, versionPath, versionFileContents);

  return newVersion;
}

function getReleaseType(prerelease: string | undefined, expectedReleaseType: ReleaseType, currentVersion: string): semver.ReleaseType {
  if (typeof prerelease === 'string') {
    if (isInPrerelease(currentVersion)) {
      if (shouldContinuePrerelease(currentVersion, expectedReleaseType) ||
        getTypePriority(getCurrentActiveType(currentVersion)) > getTypePriority(expectedReleaseType)
      ) {
        return 'prerelease';
      }
    }

    return 'pre' + expectedReleaseType as semver.ReleaseType;
  } else {
    return expectedReleaseType;
  }
}

function isInPrerelease(version: string): boolean {
  return Array.isArray(semver.prerelease(version));
}

/**
 * if a version is currently in pre-release state,
 * and if it current in-pre-release type is same as expect type,
 * it should continue the pre-release with the same type
 *
 * @param version
 * @param expectType
 * @return {boolean}
 */
function shouldContinuePrerelease(version: string, expectType: ReleaseType): boolean {
  return getCurrentActiveType(version) === expectType;
}

const TypeList = ['major', 'minor', 'patch'].reverse();
/**
 * extract the in-pre-release type in target version
 *
 * @param version
 * @return {string}
 */
function getCurrentActiveType(version: string): string {
  for (const item of TypeList) {
    if ((semver as any)[item](version)) {
      return item;
    }
  }
  throw new Error('unreachable');
}

/**
 * calculate the priority of release type,
 * major - 2, minor - 1, patch - 0
 *
 * @param type
 * @return {number}
 */
function getTypePriority(type: string): number {
  return TypeList.indexOf(type);
}

/**
 * https://github.com/aws/aws-cdk/issues/15581
 * We version any alpha modules in one of two ways, depending on the main/stable release.
 * If the main release is itself a prerelease (e.g., 2.0.0-rc.17),
 * we will increment the current alpha release.
 * If the main release is not a prerelease, we use the main release version, but with an alpha tag.
 */
function bumpAlphaReleaseVersion(currentVersion: Versions, releaseType: semver.ReleaseType): string | undefined {
  if (!currentVersion.alphaVersion) { return undefined; }

  const newAlphaVersion = releaseType.startsWith('pre')
    ? semver.inc(currentVersion.alphaVersion, releaseType, 'alpha')
    : semver.inc(currentVersion.stableVersion, 'pre' + releaseType as semver.ReleaseType, 'alpha');

  if (!newAlphaVersion) {
    throw new Error('Could not increment alpha version: ' + currentVersion.alphaVersion);
  }
  return newAlphaVersion;
}
