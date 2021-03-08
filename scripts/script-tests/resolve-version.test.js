const fs = require('fs');
const os = require('os');
const path = require('path');
const resolveVersion = require('../resolve-version-lib');

beforeAll(() => spyOn(console, 'error'));

happy({
  name: 'stable release',
  inputs: {
    'release.json': { majorVersion: 2, releaseType: 'stable' },
    'version.v2.json': { version: '2.1.0' },
  },
  expected: {
    changelogFile: 'CHANGELOG.v2.md',
    marker: '0.0.0',
    prerelease: undefined,
    version: '2.1.0',
    versionFile: 'version.v2.json'
  }
});

happy({
  name: 'alpha releases',
  inputs: {
    'release.json': { majorVersion: 2, releaseType: 'alpha' },
    'version.v2.json': { version: '2.1.0-alpha.0' },
  },
  expected: {
    changelogFile: 'CHANGELOG.v2.md',
    marker: '0.0.0',
    prerelease: 'alpha',
    version: '2.1.0-alpha.0',
    versionFile: 'version.v2.json'
  }
});

happy({
  name: 'rc releases',
  inputs: {
    'release.json': { majorVersion: 2, releaseType: 'rc' },
    'version.v2.json': { version: '2.1.0-rc.0' },
  },
  expected: {
    changelogFile: 'CHANGELOG.v2.md',
    marker: '0.0.0',
    prerelease: 'rc',
    version: '2.1.0-rc.0',
    versionFile: 'version.v2.json'
  }
});

happy({
  name: 'v1 changelog is still called CHANGELOG.md for backwards compatibility',
  inputs: {
    'release.json': { majorVersion: 1, releaseType: 'stable' },
    'version.v1.json': { version: '1.72.0' }
  },
  expected: {
    changelogFile: 'CHANGELOG.md',
    marker: '0.0.0',
    prerelease: undefined,
    version: '1.72.0',
    versionFile: 'version.v1.json'
  }
});

happy({
  name: 'to support BUMP_CANDIDATE stable branches can be bumped towards a pre-release',
  inputs: {
    'release.json': { majorVersion: 2, releaseType: 'stable' },
    'version.v2.json': { version: '2.0.0-rc.0' }
  },
  expected: {
    changelogFile: 'CHANGELOG.v2.md',
    marker: '0.0.0',
    prerelease: undefined,
    version: '2.0.0-rc.0',
    versionFile: 'version.v2.json'
  }
});

failure({
  name: 'invalid release type',
  inputs: { 'release.json': { majorVersion: 2, releaseType: 'build' } },
  expected: 'releaseType=build is not allowed. Allowed values: alpha,rc,stable'
});

failure({
  name: 'invalid major version (less then min)',
  inputs: { 'release.json': { majorVersion: -1, releaseType: 'rc' } },
  expected: 'majorVersion=-1 is an unsupported major version (should be between 1 and 2)'
});

failure({
  name: 'invalid major version (over max)',
  inputs: { 'release.json': { majorVersion: 3, releaseType: 'rc' } },
  expected: 'majorVersion=3 is an unsupported major version (should be between 1 and 2)'
});

failure({
  name: 'invalid major version (non-number)',
  inputs: { 'release.json': { majorVersion: '2', releaseType: 'rc' } },
  expected: 'majorVersion=2 must be a number'
});

failure({
  name: 'no version file',
  inputs: { 'release.json': { majorVersion: 2, releaseType: 'alpha' } },
  expected: 'unable to find version file version.v2.json for major version 2'
});

failure({
  name: 'actual version not the right major',
  inputs: {
    'release.json': { majorVersion: 1, releaseType: 'stable' },
    'version.v1.json': { version: '2.0.0' }
  },
  expected: 'current version "2.0.0" does not use the expected major version 1'
});

failure({
  name: 'actual version not the right pre-release',
  inputs: {
    'release.json': { majorVersion: 2, releaseType: 'alpha' },
    'version.v2.json': { version: '2.0.0-rc.0' }
  },
  expected: 'could not find pre-release tag "alpha" in current version "2.0.0-rc.0" defined in version.v2.json'
});

function happy({ name, inputs, expected } = opts) {
  test(name, () => {
    const tmpdir = stage(inputs);
    const actual = resolveVersion(tmpdir);
    expect(actual).toStrictEqual(expected);
  });
}

function failure({ name, inputs, expected } = opts) {
  test(name, () => {
    const tmpdir = stage(inputs);
    expect(() => resolveVersion(tmpdir)).toThrow(expected);
  });
}

function stage(inputs) {
  const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'resolve-version-'));
  for (const [ name, contents ] of Object.entries(inputs)) {
    const data = typeof(contents) === 'string' ? contents : JSON.stringify(contents);
    fs.writeFileSync(path.join(tmpdir, name), data);
  }
  return tmpdir;
}
