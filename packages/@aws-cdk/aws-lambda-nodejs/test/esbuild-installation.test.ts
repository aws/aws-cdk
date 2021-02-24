import * as child_process from 'child_process';
import { EsbuildInstallation } from '../lib/esbuild-installation';
import { PackageManager } from '../lib/package-manager';
import * as util from '../lib/util';

// eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies
const version = require('esbuild/package.json').version;

test('NPM: returns the runner and version', () => {
  const packageManager = PackageManager.NPM;
  expect(EsbuildInstallation.detect(packageManager)).toEqual({
    runner: 'npx --no-install esbuild',
    version,
  });
});

test('YARN: returns the runner and version', () => {
  const packageManager = PackageManager.YARN;
  expect(EsbuildInstallation.detect(packageManager)).toEqual({
    runner: 'yarn run esbuild',
    version,
  });
});

test('checks global version if local detection fails', () => {
  const getModuleVersionMock = jest.spyOn(util, 'getModuleVersion').mockImplementation(() => { throw new Error('error'); });
  const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('global-version'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  });

  const packageManager = PackageManager.NPM;
  expect(EsbuildInstallation.detect(packageManager)).toEqual({
    runner: 'esbuild',
    version: 'global-version',
  });

  spawnSyncMock.mockRestore();
  getModuleVersionMock.mockRestore();
});

test('returns undefined on error', () => {
  const getModuleVersionMock = jest.spyOn(util, 'getModuleVersion').mockImplementation(() => { throw new Error('error'); });
  const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
    error: new Error('bad error'),
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('stdout'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  });

  const packageManager = PackageManager.NPM;
  expect(EsbuildInstallation.detect(packageManager)).toBeUndefined();

  spawnSyncMock.mockRestore();
  getModuleVersionMock.mockRestore();
});

