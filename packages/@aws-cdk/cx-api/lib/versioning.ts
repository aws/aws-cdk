import semver = require('semver');
import { AssemblyManifest } from './cloud-assembly';

// ----------------------------------------------------------------------
//
//   READ THIS FIRST WHEN CHANGING THIS FILE
//
// ----------------------------------------------------------------------
//
// You need (and only need) to bump the CLOUD_ASSEMBLY_VERSION if the cloud
// assembly needs new features from the CDK CLI. Examples: new fields, new
// behavior, new artifact types.
//
// If that happens, you set the CLOUD_ASSEMBLY_VERSION to the *next* (not the
// current!) CDK version that will be released. This is done to produce
// useful error messages.
//
// When you do this, you will force users of a new library to upgrade the CLI
// (good), but UNLESS YOU ALSO IMPLEMENT 'upgradeAssemblyManifest' you will also
// force people who have installed a newer CLI to upgrade their libraries (bad!).
// Do that too, unless you have a very good reason not to.

/**
 * Bump this to the library version if and only if the CX protocol changes.
 *
 * We could also have used 1, 2, 3, ... here to indicate protocol versions, but
 * those then still need to be mapped to software versions to be useful. So we
 * might as well use the software version as protocol version and immediately
 * generate a useful error message from this.
 *
 * Note that the versions are not compared in a semver way, they are used as
 * opaque ordered tokens.
 */
export const CLOUD_ASSEMBLY_VERSION = '1.18.0';

/**
 * Look at the type of response we get and upgrade it to the latest expected version
 */
export function verifyManifestVersion(manifetVersion: string) {
  const frameworkVersion = parseSemver(manifetVersion);
  const toolkitVersion = parseSemver(CLOUD_ASSEMBLY_VERSION);

  // if framework > cli, we require a newer cli version
  if (semver.gt(frameworkVersion, toolkitVersion)) {
    throw new Error(`A newer version of the CDK CLI (>= ${frameworkVersion}) is necessary to interact with this app`);
  }

  // if framework < cli, we require a newer framework version
  if (semver.lt(frameworkVersion, toolkitVersion)) {
    throw new Error(`The CDK CLI you are using requires your app to use CDK modules with version >= ${CLOUD_ASSEMBLY_VERSION}`);
  }
}

/**
 * Upgrade old manifest versions to later manifest version here (if possible).
 *
 * Use this to make the toolkit recognize old assembly versions. This function should
 * add newly required fields with appropriate default values, etc.
 */
export function upgradeAssemblyManifest(manifest: AssemblyManifest): AssemblyManifest {

  if (manifest.version === '0.36.0') {
    // Adding a new artifact type, old version will not have it so painless upgrade.
    manifest = justUpgradeVersion(manifest, '1.10.0');
  }

  if (manifest.version === '1.10.0') {
    // backwards-compatible changes to the VPC provider
    manifest = justUpgradeVersion(manifest, '1.16.0');
  }

  if (manifest.version === '1.16.0') {
    // Added AMI context provider
    manifest = justUpgradeVersion(manifest, '1.18.0');
  }

  return manifest;
}

function parseSemver(version: string) {
  const ver = semver.coerce(version);
  if (!ver) {
    throw new Error(`Could not parse "${version}" as semver`);
  }

  return ver;
}

/**
 * Return a copy of the manifest with just the version field updated
 *
 * Useful if there are protocol changes that are automatically backwards
 * compatible.
 */
function justUpgradeVersion(manifest: AssemblyManifest, version: string): AssemblyManifest {
  return Object.assign({}, manifest, { version });
}
