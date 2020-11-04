#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const ALLOWED_RELEASE_TYPES = [ 'alpha', 'rc', 'stable' ];
const ROOTDIR = path.resolve(__dirname, '..');

//
// parse release.json
//

const releaseFile = 'release.json';
const releaseConfig = require(path.join(ROOTDIR, releaseFile));
const majorVersion = releaseConfig.majorVersion;
const releaseType = releaseConfig.releaseType;
if (!majorVersion) { throw new Error(`"majorVersion"" must be defined in ${releaseFile}`); }
if (!releaseType) { throw new Error(`"releaseType" must be defined in ${releaseFile}`); }
if (majorVersion !== '1' && majorVersion !== '2') { throw new Error(`majorVersion=${majorVersion} is an unsupported major version (should be a number)`); }
if (!ALLOWED_RELEASE_TYPES.includes(releaseType)) { throw new Error(`releaseType=${releaseType} is not allowed. Allowed values: ${ALLOWED_RELEASE_TYPES.join(',')}`); }

//
// resolve and check that we have a version file
//

const versionFile = `version.v${majorVersion}.json`;
const versionFilePath = path.join(ROOTDIR, versionFile);
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
if (releaseType === 'stable') {
  if (currentVersion.includes('-')) {
    throw new Error(`found pre-release tag in version specified in ${versionFile} is ${currentVersion} but CDK_RELEASE_TYPE is set to "stable"`);
  }
} else {
  if (!currentVersion.includes(`-${releaseType}.`)) {
    throw new Error(`could not find pre-release tag "${releaseType}" in current version "${currentVersion}" defined in ${versionFile}`);
  }
}

//
// determine changelog file name
//

const changelogFile = majorVersion === '1' 
  ? 'CHANGELOG.md' 
  : `CHANGELOG.v${majorVersion}.md`;

//
// export all of it
//

module.exports = {
  version: currentVersion,
  versionFile: versionFile,
  changelogFile: changelogFile,
  prerelease: releaseType !== 'stable' ? releaseType : undefined,
  marker: '0.0.0',
};
