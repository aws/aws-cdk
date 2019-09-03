import semver = require('semver');

/**
 * Bump this to the library version if and only if the CX protocol changes.
 *
 * We could also have used 1, 2, 3, ... here to indicate protocol versions, but
 * those then still need to be mapped to software versions to be useful. So we
 * might as well use the software version as protocol version and immediately
 * generate a useful error message from this.
 *
 * Note the following:
 *
 * - The versions are not compared in a semver way, they are used as
 *    opaque ordered tokens.
 * - The version needs to be set to the NEXT releasable version when it's
 *   updated (as the current verison in package.json has already been released!)
 * - The request does not have versioning yet, only the response.
 */
export const CLOUD_ASSEMBLY_VERSION = '0.36.0';

/**
 * Look at the type of response we get and upgrade it to the latest expected version
 */
export function verifyManifestVersion(manifetVersion: string) {
  const frameworkVersion = parseSemver(manifetVersion);
  const toolkitVersion = parseSemver(CLOUD_ASSEMBLY_VERSION);

  // if framework > cli, we require a newer cli version
  if (semver.gt(frameworkVersion, toolkitVersion)) {
    throw new Error(`CDK CLI >= ${frameworkVersion} is required to interact with this app (got ${toolkitVersion})`);
  }

  // if framework < cli, we require a newer framework version
  if (semver.lt(frameworkVersion, toolkitVersion)) {
    throw new Error(
      `CDK CLI can only be used with apps created by CDK >= ${toolkitVersion} (got ${frameworkVersion})`);
  }
}

function parseSemver(version: string) {
  const ver = semver.coerce(version);
  if (!ver) {
    throw new Error(`Could not parse "${version}" as semver`);
  }

  return ver;
}
