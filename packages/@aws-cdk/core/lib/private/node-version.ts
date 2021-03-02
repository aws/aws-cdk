import * as process from 'process';

// process.versions.node is like "12.3.1"
const [strMajor, strMinor, strPatch] = process.versions.node.split('.');

/**
 * The major version of the node runtime.
 */
export const major = Number(strMajor);

/**
 * The minor version of the node runtime.
 */
export const minor = Number(strMinor);

/**
 * The revision of the node runtime.
 */
export const patch = Number(strPatch);
