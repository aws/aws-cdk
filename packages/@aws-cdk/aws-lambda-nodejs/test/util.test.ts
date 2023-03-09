import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { callsites, exec, extractDependencies, findUp, findUpMultiple, getTsconfigCompilerOptions } from '../lib/util';

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

describe('findUpMultiple', () => {
  test('Starting at process.cwd()', () => {
    const files = findUpMultiple(['README.md', 'package.json']);
    expect(files).toHaveLength(2);
    expect(files[0]).toMatch(/aws-lambda-nodejs\/README\.md$/);
    expect(files[1]).toMatch(/aws-lambda-nodejs\/package\.json$/);
  });

  test('Non existing files', () => {
    expect(findUpMultiple(['non-existing-file.unknown', 'non-existing-file.unknown2'])).toEqual([]);
  });

  test('Existing and non existing files', () => {
    const files = findUpMultiple(['non-existing-file.unknown', 'README.md']);
    expect(files).toHaveLength(1);
    expect(files[0]).toMatch(/aws-lambda-nodejs\/README\.md$/);
  });

  test('Starting at a specific path', () => {
    const files = findUpMultiple(['util.test.ts', 'function.test.ts'], path.join(__dirname, 'integ-handlers'));
    expect(files).toHaveLength(2);
    expect(files[0]).toMatch(/aws-lambda-nodejs\/test\/util\.test\.ts$/);
    expect(files[1]).toMatch(/aws-lambda-nodejs\/test\/function\.test\.ts$/);
  });

  test('Non existing files starting at a non existing relative path', () => {
    expect(findUpMultiple(['not-to-be-found.txt', 'not-to-be-found2.txt'], 'non-existing/relative/path')).toEqual([]);
  });

  test('Starting at a relative path', () => {
    const files = findUpMultiple(['util.test.ts', 'function.test.ts'], 'test/integ-handlers');
    expect(files).toHaveLength(2);
    expect(files[0]).toMatch(/aws-lambda-nodejs\/test\/util\.test\.ts$/);
    expect(files[1]).toMatch(/aws-lambda-nodejs\/test\/function\.test\.ts$/);
  });

  test('Files on multiple levels', () => {
    const files = findUpMultiple(['README.md', 'util.test.ts'], path.join(__dirname, 'integ-handlers'));
    expect(files).toHaveLength(1);
    expect(files[0]).toMatch(/aws-lambda-nodejs\/test\/util\.test\.ts$/);
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

  test('with file dependency', () => {
    const pkgPath = path.join(__dirname, 'package-file.json');
    fs.writeFileSync(pkgPath, JSON.stringify({
      dependencies: {
        'my-module': 'file:../../core',
      },
    }));

    expect(extractDependencies(pkgPath, ['my-module'])).toEqual({
      'my-module': expect.stringMatching(/packages\/@aws-cdk\/core/),
    });

    fs.unlinkSync(pkgPath);
  });
});

describe('getTsconfigCompilerOptions', () => {
  test('should extract compiler options and returns as string', () => {
    const tsconfig = path.join(__dirname, 'testtsconfig.json');
    const compilerOptions = getTsconfigCompilerOptions(tsconfig);
    expect(compilerOptions).toEqual([
      '--alwaysStrict',
      '--charset utf8',
      '--declaration',
      '--declarationMap false',
      '--experimentalDecorators',
      '--incremental false',
      '--inlineSourceMap',
      '--inlineSources',
      '--lib es2020',
      '--module CommonJS',
      '--newLine lf',
      '--noEmitOnError',
      '--noFallthroughCasesInSwitch',
      '--noImplicitAny',
      '--noImplicitReturns',
      '--noImplicitThis',
      '--noUnusedLocals',
      '--noUnusedParameters',
      '--outDir ./',
      '--resolveJsonModule',
      '--rootDir ./',
      '--strict',
      '--strictNullChecks',
      '--strictPropertyInitialization',
      '--stripInternal false',
      '--target ES2020',
    ].join(' '));
  });

  test('should extract compiler options with extended config overriding', () => {
    const tsconfig = path.join(__dirname, 'testtsconfig-extended.json');
    const compilerOptions = getTsconfigCompilerOptions(tsconfig);
    expect(compilerOptions).toEqual([
      '--alwaysStrict',
      '--charset utf8',
      '--declaration',
      '--declarationMap false',
      '--experimentalDecorators',
      '--incremental false',
      '--inlineSourceMap',
      '--inlineSources',
      '--lib es2020',
      '--module CommonJS',
      '--newLine lf',
      '--noEmitOnError',
      '--noFallthroughCasesInSwitch',
      '--noImplicitAny',
      '--noImplicitReturns',
      '--noImplicitThis',
      '--noUnusedLocals',
      '--noUnusedParameters',
      '--outDir ./',
      '--resolveJsonModule',
      '--rootDir ./',
      '--strict',
      '--strictNullChecks',
      '--strictPropertyInitialization',
      '--stripInternal false',
      '--target ES2022',
    ].join(' '));
  });
});
