import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { bockfs } from '@aws-cdk/cdk-build-tools';
import { callsites, exec, extractDependencies, findUp, findUpMultiple, getTsconfigCompilerOptions } from '../lib/util';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('callsites', () => {
  expect(callsites()[0].getFileName()).toMatch(/\/test\/util.test.ts$/);
});

describe('findUp helpers', () => {
  // insert contents in fake filesystem
  bockfs({
    '/home/project/file0': 'ARBITRARY',
    '/home/project/file1': 'ARBITRARY',
    '/home/project/file2': 'ARBITRARY',
    '/home/project/subdir/.keep': 'ARBITRARY',
    '/home/project/subdir/file3': 'ARBITRARY',
  });
  const bockPath = bockfs.workingDirectory('/home/project');

  afterAll(() => {
    bockfs.restore();
  });

  describe('findUp', () => {
    test('Starting at process.cwd()', () => {
      expect(findUp('file0')).toBe(bockPath`file0`);
    });

    test('Non existing file', () => {
      expect(findUp('non-existing-file.unknown')).toBe(undefined);
    });

    test('Starting at a specific path', () => {
      expect(findUp('file1', bockPath`/home/project/subdir`)).toBe(bockPath`/home/project/file1`);
    });

    test('Non existing file starting at a non existing relative path', () => {
      expect(findUp('not-to-be-found.txt', 'non-existing/relative/path')).toBe(undefined);
    });

    test('Starting at a relative path', () => {
      expect(findUp('file1', 'subdir')).toBe(bockPath`file1`);
    });
  });

  describe('findUpMultiple', () => {
    test('Starting at process.cwd()', () => {
      const files = findUpMultiple(['file0', 'file1']);
      expect(files).toHaveLength(2);
      expect(files[0]).toBe(bockPath`file0`);
      expect(files[1]).toBe(bockPath`file1`);
    });

    test('Non existing files', () => {
      expect(findUpMultiple(['non-existing-file.unknown', 'non-existing-file.unknown2'])).toEqual([]);
    });

    test('Existing and non existing files', () => {
      const files = findUpMultiple(['non-existing-file.unknown', 'file0']);
      expect(files).toHaveLength(1);
      expect(files[0]).toMatch(bockPath`file0`);
    });

    test('Starting at a specific path', () => {
      const files = findUpMultiple(['file1', 'file2'], bockPath`/home/project/subdir`);
      expect(files).toHaveLength(2);
      expect(files[0]).toBe(bockPath`file1`);
      expect(files[1]).toBe(bockPath`file2`);
    });

    test('Non existing files starting at a non existing relative path', () => {
      expect(findUpMultiple(['not-to-be-found.txt', 'not-to-be-found2.txt'], 'non-existing/relative/path')).toEqual([]);
    });

    test('Starting at a relative path', () => {
      const files = findUpMultiple(['file1', 'file2'], 'subdir');
      expect(files).toHaveLength(2);
      expect(files[0]).toBe(bockPath`file1`);
      expect(files[1]).toBe(bockPath`file2`);
    });

    test('Files on multiple levels', () => {
      const files = findUpMultiple(['file0', 'file3'], bockPath`/home/project/subdir`);
      expect(files).toHaveLength(1);
      expect(files[0]).toBe(bockPath`subdir/file3`);
    });
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
      path.join(__dirname, 'testpackage.json'),
      ['@aws-cdk/aws-lambda', '@aws-cdk/core'],
    );
    expect(Object.keys(deps)).toEqual([
      '@aws-cdk/aws-lambda',
      '@aws-cdk/core',
    ]);
  });

  test('with transitive dependencies', () => {
    expect(extractDependencies(
      path.join(__dirname, 'testpackage.json'),
      ['typescript'],
    )).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies
      typescript: require('typescript/package.json').version,
    });
  });

  test('with unknown dependency', () => {
    expect(() => extractDependencies(
      path.join(__dirname, 'testpackage.json'),
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
      'my-module': expect.stringMatching(/packages\/aws-cdk-lib\/core/),
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
      '--declaration',
      '--declarationMap false',
      '--experimentalDecorators',
      '--incremental false',
      '--inlineSourceMap',
      '--inlineSources',
      '--lib es2020,dom',
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
      '--declaration',
      '--declarationMap false',
      '--experimentalDecorators',
      '--incremental false',
      '--inlineSourceMap',
      '--inlineSources',
      '--lib es2020,dom',
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
