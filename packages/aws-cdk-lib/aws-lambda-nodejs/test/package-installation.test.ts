import child_process from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { PackageInstallation } from '../lib/package-installation';
import * as util from '../lib/util';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const version = require('esbuild/package.json').version;

test('detects local version', () => {
  expect(PackageInstallation.detect('esbuild')).toEqual({
    isWorkspacePackage: true,
    version,
  });
});

test('checks global version if local detection fails', () => {
  const getModuleVersionMock = jest.spyOn(util, 'tryGetModuleVersionFromRequire').mockReturnValue(undefined);
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
  getModuleVersionMock.mockRestore();
});

test('returns undefined on error', () => {
  const getModuleVersionMock = jest.spyOn(util, 'tryGetModuleVersionFromRequire').mockReturnValue(undefined);
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
  getModuleVersionMock.mockRestore();
});

describe('with a project directory', () => {
  let projectDir: string;

  beforeEach(() => {
    // realpath because os.tmpdir() is a symlink on macOS
    projectDir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-package-installation-')));
    fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify({ name: 'my-app' }));
  });

  afterEach(() => {
    fs.rmSync(projectDir, { recursive: true, force: true });
  });

  function installInProject(module: string, moduleVersion: string) {
    const moduleDir = path.join(projectDir, 'node_modules', module);
    fs.mkdirSync(moduleDir, { recursive: true });
    fs.writeFileSync(path.join(moduleDir, 'package.json'), JSON.stringify({ name: module, version: moduleVersion }));
  }

  test('detects a version installed only for the project directory', () => {
    // npm workspace where the module is installed in the workspace and not hoisted next to aws-cdk-lib
    installInProject('cdk-fake-module-for-detection', '1.2.3');

    expect(PackageInstallation.detect('cdk-fake-module-for-detection', projectDir)).toEqual({
      isWorkspacePackage: true,
      version: '1.2.3',
      cwd: projectDir,
    });
  });

  test('prefers the version that can be required from aws-cdk-lib', () => {
    installInProject('esbuild', '0.0.1');

    expect(PackageInstallation.detect('esbuild', projectDir)).toEqual({
      isWorkspacePackage: true,
      version,
    });
  });
});
