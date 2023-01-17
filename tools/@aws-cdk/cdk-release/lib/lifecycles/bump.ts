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
    alphaVersion: bumpAlphaReleaseVersion(currentVersion, newStableVersion, releaseType),
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
 *
 * If the main release is itself a prerelease (e.g., 2.0.0-rc.17):
 *  - if the current alpha version has the same major.minor.patch version as the current stable,
 *    we probably have a long-running RC candidate that we are actually releasing. Increment the
 *    current alpha release.
 *  - if not, then we are probably coming up with a testing RC version for the pipeline. We must
 *    come up with an alpha version that can never be released publicly, because our version numbers
 *    must never be the same as any publicly released package. Use '2.0.0-alpha.999' for those.
 *
 * If the main release is not a prerelease, we use the main release version, but with an alpha tag.
 *
 * This logic is mirrored in the integ tests.
 */
function bumpAlphaReleaseVersion(previousVersions: Versions, currentStable: string, releaseType: semver.ReleaseType): string | undefined {
  if (!previousVersions.alphaVersion) { return undefined; }

  let newAlphaVersion;
  if (releaseType.startsWith('pre')) {
    // Prerelease, either long-running or just a unique one to test
    const stableV = semver.parse(currentStable);
    const alphaV = semver.parse(previousVersions.alphaVersion);
    if (!stableV || !alphaV) {
      throw new Error(`Could not parse either ${currentStable} or ${previousVersions.alphaVersion} as a version`);
    }

    if (stableV?.compareMain(alphaV) === 0) {
      newAlphaVersion = semver.inc(previousVersions.alphaVersion, releaseType, 'alpha');
    } else {
      newAlphaVersion = semver.inc(previousVersions.stableVersion, releaseType as semver.ReleaseType, 'alpha')?.replace(/0$/, '999');
    }
  } else {
    // Stable release, add `-alpha.0` to the end of the stable release version
    newAlphaVersion = semver.inc(previousVersions.stableVersion, 'pre' + releaseType as semver.ReleaseType, 'alpha');
  }

  if (!newAlphaVersion) {
    throw new Error('Could not increment alpha version: ' + previousVersions.alphaVersion);
  }
  return newAlphaVersion;
}
