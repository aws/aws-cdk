import * as path from 'path';
import { bump } from '../lib/lifecycles/bump';

// Mock file and console output
import * as files from '../lib/private/files';
import * as print from '../lib/private/print';
const mockWriteFile = jest.spyOn(files, 'writeFile').mockImplementation(() => jest.fn());
jest.spyOn(print, 'notify').mockImplementation(() => jest.fn());

beforeEach(() => { jest.resetAllMocks(); });

test('skips bump if skip.bump is set', async () => {
  const currentVersion = { stableVersion: '1.1.1', alphaVersion: '1.1.1-alpha.0' };
  const bumpedVersion = await bump({ releaseAs: 'major', versionFile: 'version.json', skip: { bump: true } }, currentVersion);

  expect(bumpedVersion).toEqual(currentVersion);
});

describe('stable versions', () => {

  test('does a prerelease bump with provided tag if given', async () => {
    const currentVersion = { stableVersion: '1.2.3' };
    const bumpedVersion = await bump({ releaseAs: 'minor', versionFile: 'version.json', prerelease: 'rc' }, currentVersion);

    expect(bumpedVersion.stableVersion).toEqual('1.3.0-rc.0');
  });

  test('does a normal bump if no prerelease tag is given', async () => {
    const currentVersion = { stableVersion: '1.2.3' };
    const bumpedVersion = await bump({ releaseAs: 'minor', versionFile: 'version.json' }, currentVersion);

    expect(bumpedVersion.stableVersion).toEqual('1.3.0');
  });

  test('writes output to version file', async () => {
    const currentVersion = { stableVersion: '1.2.3' };
    await bump({ releaseAs: 'minor', versionFile: 'version.json' }, currentVersion);

    const versionPath = path.join(process.cwd(), 'version.json');
    const version = '{\n  "version": "1.3.0"\n}';
    expect(mockWriteFile).toBeCalledWith(expect.any(Object), versionPath, version);
  });

});

describe('alpha versions', () => {

  test('long-running prerelease: bumps existing alpha counter as a prerelease', async () => {
    const currentVersion = { stableVersion: '1.2.0-rc.4', alphaVersion: '1.2.0-alpha.0' };
    const bumpedVersion = await bump({ releaseAs: 'minor', versionFile: 'version.json', prerelease: 'rc' }, currentVersion);

    expect(bumpedVersion).toEqual({
      stableVersion: '1.2.0-rc.5',
      alphaVersion: '1.2.0-alpha.1',
    });
  });

  test('one-off prerelease: alpha is a prerelease of stable release with crazy alpha tag', async () => {
    const currentVersion = { stableVersion: '1.2.0', alphaVersion: '1.2.0-alpha.0' };
    const bumpedVersion = await bump({ releaseAs: 'minor', versionFile: 'version.json', prerelease: 'rc' }, currentVersion);

    expect(bumpedVersion).toEqual({
      stableVersion: '1.3.0-rc.0',
      alphaVersion: '1.3.0-alpha.999',
    });
  });

  test('normal release: alpha is a prerelease of stable release with realistic alpha tag', async () => {
    const currentVersion = { stableVersion: '1.2.0', alphaVersion: '1.2.0-alpha.0' };
    const bumpedVersion = await bump({ releaseAs: 'minor', versionFile: 'version.json' }, currentVersion);

    expect(bumpedVersion).toEqual({
      stableVersion: '1.3.0',
      alphaVersion: '1.3.0-alpha.0',
    });
  });

  test('writes output to version file', async () => {
    const currentVersion = { stableVersion: '1.2.0', alphaVersion: '1.1.0-alpha.0' };
    await bump({ releaseAs: 'minor', versionFile: 'version.json' }, currentVersion);

    const versionPath = path.join(process.cwd(), 'version.json');
    const version = '{\n  "version": "1.3.0",\n  "alphaVersion": "1.3.0-alpha.0"\n}';
    expect(mockWriteFile).toBeCalledWith(expect.any(Object), versionPath, version);
  });

});
