import * as child_process from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { callsites, exec, extractDependencies, findUp, getEsBuildVersion } from '../lib/util';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('callsites', () => {
  expect(callsites()[0].getFileName()).toMatch(/\/test\/util.test.js$/);
});

describe('findUp', () => {
  test('Starting at process.cwd()', () => {
    expect(findUp('README.md')).toMatch(/aws-lambda-nodejs\/README.md$/);
  });

  test('Non existing file', () => {
    expect(findUp('non-existing-file.unknown')).toBe(undefined);
  });

  test('Starting at a specific path', () => {
    expect(findUp('util.test.ts', path.join(__dirname, 'integ-handlers'))).toMatch(/aws-lambda-nodejs\/test\/util.test.ts$/);
  });

  test('Non existing file starting at a non existing relative path', () => {
    expect(findUp('not-to-be-found.txt', 'non-existing/relative/path')).toBe(undefined);
  });

  test('Starting at a relative path', () => {
    expect(findUp('util.test.ts', 'test/integ-handlers')).toMatch(/aws-lambda-nodejs\/test\/util.test.ts$/);
  });
});

describe('exec', () => {
  test('normal execution', () => {
    const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    const proc = exec(
      'cmd',
      ['arg1', 'arg2'],
      { env: { KEY: 'value' } },
    );

    expect(spawnSyncMock).toHaveBeenCalledWith(
      'cmd',
      ['arg1', 'arg2'],
      { env: { KEY: 'value' } },
    );
    expect(proc.stdout.toString()).toBe('stdout');

    spawnSyncMock.mockRestore();
  });

  test('non zero status', () => {
    const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
      status: 999,
      stderr: Buffer.from('error occured'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    expect(() => exec('cmd', ['arg1', 'arg2'])).toThrow('error occured');

    spawnSyncMock.mockRestore();
  });

  test('with error', () => {
    const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
      error: new Error('bad error'),
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    expect(() => exec('cmd', ['arg1', 'arg2'])).toThrow(new Error('bad error'));

    spawnSyncMock.mockRestore();
  });
});

describe('extractDependencies', () => {
  test('with dependencies referenced in package.json', () => {
    const deps = extractDependencies(
      path.join(__dirname, '../package.json'),
      ['@aws-cdk/aws-lambda', '@aws-cdk/core'],
    );
    expect(Object.keys(deps)).toEqual([
      '@aws-cdk/aws-lambda',
      '@aws-cdk/core',
    ]);
  });

  test('with transitive dependencies', () => {
    expect(extractDependencies(
      path.join(__dirname, '../package.json'),
      ['typescript'],
    )).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies
      typescript: require('typescript/package.json').version,
    });
  });

  test('with unknown dependency', () => {
    expect(() => extractDependencies(
      path.join(__dirname, '../package.json'),
      ['unknown'],
    )).toThrow(/Cannot extract version for module 'unknown'/);
  });
});

describe('getEsBuildVersion', () => {
  test('returns the version', () => {
    const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('version'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    expect(getEsBuildVersion()).toBe('version');
    expect(spawnSyncMock).toHaveBeenCalledWith('npx', ['--no-install', 'esbuild', '--version']);

    spawnSyncMock.mockRestore();
  });

  test('returns undefined on non zero status', () => {
    const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
      status: 127, // status error
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    expect(getEsBuildVersion()).toBeUndefined();

    spawnSyncMock.mockRestore();
  });

  test('returns undefined on error', () => {
    const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
      error: new Error('bad error'),
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    expect(getEsBuildVersion()).toBeUndefined();

    spawnSyncMock.mockRestore();
  });

  test('Windows', () => {
    const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('version'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });
    const osPlatformMock = jest.spyOn(os, 'platform').mockReturnValue('win32');

    expect(getEsBuildVersion()).toBe('version');
    expect(spawnSyncMock).toHaveBeenCalledWith('npx.cmd', expect.any(Array));

    spawnSyncMock.mockRestore();
    osPlatformMock.mockRestore();
  });
});
