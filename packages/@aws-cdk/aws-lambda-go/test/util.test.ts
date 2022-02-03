import * as child_process from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { exec, findUp, getGoBuildVersion } from '../lib/util';

beforeEach(() => {
  jest.clearAllMocks();
});


describe('findUp', () => {
  test('Starting at process.cwd()', () => {
    expect(findUp('README.md')).toMatch(/aws-lambda-go\/README.md$/);
  });

  test('Non existing file', () => {
    expect(findUp('non-existing-file.unknown')).toBe(undefined);
  });

  test('Starting at a specific path', () => {
    expect(findUp('util.test.ts', path.join(__dirname, 'integ-handlers'))).toMatch(/aws-lambda-go\/test\/util.test.ts$/);
  });

  test('Non existing file starting at a non existing relative path', () => {
    expect(findUp('not-to-be-found.txt', 'non-existing/relative/path')).toBe(undefined);
  });

  test('Starting at a relative path', () => {
    expect(findUp('util.test.ts', 'test/integ-handlers')).toMatch(/aws-lambda-go\/test\/util.test.ts$/);
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

describe('getGoBuildVersion', () => {
  test('returns the version', () => {
    const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('go version go1.15 linux/amd64'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    expect(getGoBuildVersion()).toBe(true);
    expect(spawnSyncMock).toHaveBeenCalledWith('go', ['version']);

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

    expect(getGoBuildVersion()).toBeUndefined();

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

    expect(getGoBuildVersion()).toBeUndefined();

    spawnSyncMock.mockRestore();
  });

  test('Windows', () => {
    const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('go version go1.15 windows/amd64'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });
    const osPlatformMock = jest.spyOn(os, 'platform').mockReturnValue('win32');

    expect(getGoBuildVersion()).toBe(true);
    expect(spawnSyncMock).toHaveBeenCalledWith('go', expect.any(Array));

    spawnSyncMock.mockRestore();
    osPlatformMock.mockRestore();
  });
});
