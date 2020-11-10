import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { exec, extractDependencies, findProjectRoot, findUp } from '../lib/util';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('findUp', () => {
  test('Starting at process.cwd()', () => {
    expect(findUp('README.md')).toMatch(/aws-lambda-nodejs$/);
  });

  test('Non existing file', () => {
    expect(findUp('non-existing-file.unknown')).toBe(undefined);
  });

  test('Starting at a specific path', () => {
    expect(findUp('util.test.ts', path.join(__dirname, 'integ-handlers'))).toMatch(/aws-lambda-nodejs\/test$/);
  });

  test('Non existing file starting at a non existing relative path', () => {
    expect(findUp('not-to-be-found.txt', 'non-existing/relative/path')).toBe(undefined);
  });

  test('Starting at a relative path', () => {
    expect(findUp('util.test.ts', 'test/integ-handlers')).toMatch(/aws-lambda-nodejs\/test$/);
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
  test('with depencies referenced in package.json', () => {
    expect(extractDependencies(
      path.join(__dirname, '../package.json'),
      ['@aws-cdk/aws-lambda', '@aws-cdk/core'],
    )).toEqual({
      '@aws-cdk/aws-lambda': '0.0.0',
      '@aws-cdk/core': '0.0.0',
    });
  });

  test('with unknown dependency', () => {
    expect(() => extractDependencies(
      path.join(__dirname, '../package.json'),
      ['unknown'],
    )).toThrow(/Cannot extract version for module 'unknown' in package.json/);
  });

});

describe('findProjectRoot', () => {
  test('Returns user project root', () => {
    const fsExistsSyncSpy = jest.spyOn(fs, 'existsSync');

    const projectRoot = findProjectRoot('test');
    expect(projectRoot).toBe('test');
    expect(fsExistsSyncSpy).not.toHaveBeenCalled();

    fsExistsSyncSpy.mockRestore();
  });

  test('Project root search logic', () => {
    const fsExistsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    const projectRoot = findProjectRoot();
    expect(projectRoot).toBeUndefined();
    expect(fsExistsSyncSpy).toHaveBeenCalledWith(expect.stringContaining('.git/'));
    expect(fsExistsSyncSpy).toHaveBeenCalledWith(expect.stringContaining('yarn.lock'));
    expect(fsExistsSyncSpy).toHaveBeenCalledWith(expect.stringContaining('package-lock.json'));
    expect(fsExistsSyncSpy).toHaveBeenCalledWith(expect.stringContaining('package.json'));

    fsExistsSyncSpy.mockRestore();
  });
});
