import child_process from 'child_process';
import { PackageInstallation } from '../lib/package-installation';
import * as util from '../lib/util';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const version = require('esbuild/package.json').version;

test('detects local version', () => {
  expect(PackageInstallation.detect('esbuild')).toEqual({
    isWorkspacePackage: true,
    version,
    binPath: expect.stringMatching(/esbuild/),
  });
});

test('checks global version if local detection fails', () => {
  const getModuleDetailsMock = jest.spyOn(util, 'tryGetModuleDetailsFromRequire').mockReturnValue(undefined);
  const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('global-version'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  });

  expect(PackageInstallation.detect('esbuild')).toEqual({
    isWorkspacePackage: false,
    version: 'global-version',
  });

  spawnSyncMock.mockRestore();
  getModuleDetailsMock.mockRestore();
});

test('returns undefined on error', () => {
  const getModuleDetailsMock = jest.spyOn(util, 'tryGetModuleDetailsFromRequire').mockReturnValue(undefined);
  const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
    error: new Error('bad error'),
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('stdout'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  });

  expect(PackageInstallation.detect('esbuild')).toBeUndefined();

  spawnSyncMock.mockRestore();
  getModuleDetailsMock.mockRestore();
});

