import process = require('process');
import semver = require('semver');

const nodeVersion = semver.parse(process.versions.node);
if (nodeVersion == null) {
  throw new Error(`Unable to determine node runtime version from ${process.versions.node}`);
}

/**
 * The major version of the node runtime.
 */
export const major = nodeVersion.major;

/**
 * The minor version of the node runtime.
 */
export const minor = nodeVersion.minor;

/**
 * The revision of the node runtime.
 */
export const patch = nodeVersion.patch;
