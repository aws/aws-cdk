import * as child_process from 'child_process';
import { EsbuildInstallation } from '../lib/esbuild-installation';
import * as util from '../lib/util';

// eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies
const version = require('esbuild/package.json').version;

test('detects local version', () => {
  expect(EsbuildInstallation.detect()).toEqual({
    isLocal: true,
    version,
  });
});

test('checks global version if local detection fails', () => {
  const getModuleVersionMock = jest.spyOn(util, 'tryGetModuleVersion').mockReturnValue(undefined);
  const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('global-version'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  });

  expect(EsbuildInstallation.detect()).toEqual({
    isLocal: false,
    version: 'global-version',
  });

  spawnSyncMock.mockRestore();
  getModuleVersionMock.mockRestore();
});

test('returns undefined on error', () => {
  const getModuleVersionMock = jest.spyOn(util, 'tryGetModuleVersion').mockReturnValue(undefined);
  const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
    error: new Error('bad error'),
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('stdout'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  });

  expect(EsbuildInstallation.detect()).toBeUndefined();

  spawnSyncMock.mockRestore();
  getModuleVersionMock.mockRestore();
});

