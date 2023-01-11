import * as os from 'os';
import { LogLevel } from '../lib';
import { LockFile, PackageManager } from '../lib/package-manager';

test('from a package-lock.json', () => {
  const packageManager = PackageManager.fromLockFile('/path/to/package-lock.json');
  expect(packageManager.lockFile).toEqual(LockFile.NPM);
  expect(packageManager.argsSeparator).toBeUndefined();
  expect(packageManager.installCommand).toEqual(['npm', 'ci']);
  expect(packageManager.runCommand).toEqual(['npx', '--no-install']);

  expect(packageManager.runBinCommand('my-bin')).toBe('npx --no-install my-bin');
});

test('from a package-lock.json with LogLevel.ERROR', () => {
  const logLevel = LogLevel.ERROR;
  const packageManager = PackageManager.fromLockFile('/path/to/package-lock.json', logLevel);
  expect(packageManager.installCommand).toEqual(['npm', 'ci', '--loglevel', logLevel]);
});

test('from a yarn.lock', () => {
  const packageManager = PackageManager.fromLockFile('/path/to/yarn.lock');
  expect(packageManager.lockFile).toEqual(LockFile.YARN);
  expect(packageManager.argsSeparator).toBeUndefined();
  expect(packageManager.installCommand).toEqual(['yarn', 'install', '--no-immutable']);
  expect(packageManager.runCommand).toEqual(['yarn', 'run']);

  expect(packageManager.runBinCommand('my-bin')).toBe('yarn run my-bin');
});

test('from a yarn.lock with LogLevel.ERROR', () => {
  const packageManager = PackageManager.fromLockFile('/path/to/yarn.lock', LogLevel.ERROR);
  expect(packageManager.installCommand).toEqual(['yarn', 'install', '--no-immutable', '--silent']);
});

test('from a pnpm-lock.yaml', () => {
  const packageManager = PackageManager.fromLockFile('/path/to/pnpm-lock.yaml');
  expect(packageManager.lockFile).toEqual(LockFile.PNPM);
  expect(packageManager.argsSeparator).toEqual('--');
  expect(packageManager.installCommand).toEqual(['pnpm', 'install', '--config.node-linker=hoisted', '--config.package-import-method=clone-or-copy']);
  expect(packageManager.runCommand).toEqual(['pnpm', 'exec']);

  expect(packageManager.runBinCommand('my-bin')).toBe('pnpm exec -- my-bin');
});

test('from a pnpm-lock.yaml with LogLevel.ERROR', () => {
  const packageManager = PackageManager.fromLockFile('/path/to/pnpm-lock.yaml', LogLevel.ERROR);
  expect(packageManager.installCommand).toEqual(['pnpm', 'install', '--reporter', 'silent', '--config.node-linker=hoisted', '--config.package-import-method=clone-or-copy']);
});

test('defaults to NPM', () => {
  const packageManager = PackageManager.fromLockFile('/path/to/other.lock');
  expect(packageManager.lockFile).toEqual(LockFile.NPM);
});

test('Windows', () => {
  const osPlatformMock = jest.spyOn(os, 'platform').mockReturnValue('win32');

  const packageManager = PackageManager.fromLockFile('/path/to/whatever');
  expect(packageManager.runBinCommand('my-bin')).toEqual('npx.cmd --no-install my-bin');

  osPlatformMock.mockRestore();
});
