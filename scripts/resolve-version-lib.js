#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

//=============================================================
// UNIT TESTS: tools/script-tests/test/resolve-version.test.js 
//=============================================================

function resolveVersion(rootdir) {
  const ALLOWED_RELEASE_TYPES = [ 'alpha', 'rc', 'stable' ];
  const MIN_MAJOR = 1, MAX_MAJOR = 2; // extra safety: update to allow new major versions
  
  //
  // parse release.json
  //
  const releaseFile = path.join(rootdir, 'release.json');
  const releaseConfig = require(releaseFile);
  const majorVersion = releaseConfig.majorVersion;
  const releaseType = releaseConfig.releaseType;
  if (!majorVersion) { throw new Error(`"majorVersion"" must be defined in ${releaseFile}`); }
  if (!releaseType) { throw new Error(`"releaseType" must be defined in ${releaseFile}`); }
  if (typeof(majorVersion) !== 'number') { throw new Error(`majorVersion=${majorVersion} must be a number`); }
  if (majorVersion < MIN_MAJOR || majorVersion > MAX_MAJOR) { throw new Error(`majorVersion=${majorVersion} is an unsupported major version (should be between ${MIN_MAJOR} and ${MAX_MAJOR})`); }
  if (!ALLOWED_RELEASE_TYPES.includes(releaseType)) { throw new Error(`releaseType=${releaseType} is not allowed. Allowed values: ${ALLOWED_RELEASE_TYPES.join(',')}`); }
  
  //
  // resolve and check that we have a version file
  //
  
  const versionFile = `version.v${majorVersion}.json`;
  const versionFilePath = path.join(rootdir, versionFile);
  if (!fs.existsSync(versionFilePath)) {
    throw new Error(`unable to find version file ${versionFile} for major version ${majorVersion}`);
  }
  
  //
  // validate that current version matches the requirements
  //
  
  const currentVersion = require(versionFilePath).version;
  console.error(`current version: ${currentVersion}`);
  if (!currentVersion.startsWith(`${majorVersion}.`)) { 
    throw new Error(`current version "${currentVersion}" does not use the expected major version ${majorVersion}`); 
  }
  // if this is a pre-release, make sure current version includes the
  // pre-release tag (e.g. "1.0.0-alpha.0"). we allow stable branches to bump to
  // a pre-release for testing purposes when BUMP_CANDIDATE=true (see bump.js)
  if (releaseType !== 'stable') {
    if (!currentVersion.includes(`-${releaseType}.`)) {
      throw new Error(`could not find pre-release tag "${releaseType}" in current version "${currentVersion}" defined in ${versionFile}`);
    }
  }
  
  //
  // determine changelog file name
  //
  
  const changelogFile = majorVersion === 1 
    ? 'CHANGELOG.md' 
    : `CHANGELOG.v${majorVersion}.md`;
  
  //
  // export all of it
  //
  
  return {
    version: currentVersion,
    versionFile: versionFile,
    changelogFile: changelogFile,
    prerelease: releaseType !== 'stable' ? releaseType : undefined,
    marker: '0.0.0',
  };
}

module.exports = resolveVersion;