import child_process from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { bockfs } from '@aws-cdk/cdk-build-tools';
import { callsites, exec, extractDependencies, findUp, findUpMultiple, getTsconfigCompilerOptions, getTsconfigCompilerOptionsArray, tryGetModuleVersionFromRequire } from '../lib/util';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('callsites', () => {
  expect(callsites()[0].getFileName()).toMatch(/\/test\/util.test.ts$/);
});

describe('findUp helpers', () => {
  let bockPath: ReturnType<typeof bockfs.workingDirectory>;
  beforeEach(() => {
    // insert contents in fake filesystem
    bockfs({
      '/home/project/file0': 'ARBITRARY',
      '/home/project/file1': 'ARBITRARY',
      '/home/project/file2': 'ARBITRARY',
      '/home/project/subdir/.keep': 'ARBITRARY',
      '/home/project/subdir/file3': 'ARBITRARY',
    });
    bockPath = bockfs.workingDirectory('/home/project');
  });

  afterEach(() => {
    bockPath[Symbol.dispose]();
    bockfs.restore();
  });

  describe('findUp', () => {
    test('Starting at process.cwd()', () => {
      expect(findUp('file0')).toBe(bockPath.translate`file0`);
    });

    test('Non existing file', () => {
      expect(findUp('non-existing-file.unknown')).toBe(undefined);
    });

    test('Starting at a specific path', () => {
      expect(findUp('file1', bockPath.translate`/home/project/subdir`)).toBe(bockPath.translate`/home/project/file1`);
    });

    test('Non existing file starting at a non existing relative path', () => {
      expect(findUp('not-to-be-found.txt', 'non-existing/relative/path')).toBe(undefined);
    });

    test('Starting at a relative path', () => {
      expect(findUp('file1', 'subdir')).toBe(bockPath.translate`file1`);
    });
  });

  describe('findUpMultiple', () => {
    test('Starting at process.cwd()', () => {
      const files = findUpMultiple(['file0', 'file1']);
      expect(files).toHaveLength(2);
      expect(files[0]).toBe(bockPath.translate`file0`);
      expect(files[1]).toBe(bockPath.translate`file1`);
    });

    test('Non existing files', () => {
      expect(findUpMultiple(['non-existing-file.unknown', 'non-existing-file.unknown2'])).toEqual([]);
    });

    test('Existing and non existing files', () => {
      const files = findUpMultiple(['non-existing-file.unknown', 'file0']);
      expect(files).toHaveLength(1);
      expect(files[0]).toMatch(bockPath.translate`file0`);
    });

    test('Starting at a specific path', () => {
      const files = findUpMultiple(['file1', 'file2'], bockPath.translate`/home/project/subdir`);
      expect(files).toHaveLength(2);
      expect(files[0]).toBe(bockPath.translate`file1`);
      expect(files[1]).toBe(bockPath.translate`file2`);
    });

    test('Non existing files starting at a non existing relative path', () => {
      expect(findUpMultiple(['not-to-be-found.txt', 'not-to-be-found2.txt'], 'non-existing/relative/path')).toEqual([]);
    });

    test('Starting at a relative path', () => {
      const files = findUpMultiple(['file1', 'file2'], 'subdir');
      expect(files).toHaveLength(2);
      expect(files[0]).toBe(bockPath.translate`file1`);
      expect(files[1]).toBe(bockPath.translate`file2`);
    });

    test('Files on multiple levels', () => {
      const files = findUpMultiple(['file0', 'file3'], bockPath.translate`/home/project/subdir`);
      expect(files).toHaveLength(1);
      expect(files[0]).toBe(bockPath.translate`subdir/file3`);
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
      stderr: Buffer.from('error occurred'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    expect(() => exec('cmd', ['arg1', 'arg2'])).toThrow('error occurred');

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

describe('tryGetModuleVersionFromRequire', () => {
  // A module name that is not installed anywhere in this repository
  const fakeModule = 'cdk-fake-module-for-version-lookup';

  let tmpRoot: string;
  let previousCwd: string;

  beforeEach(() => {
    previousCwd = process.cwd();
    // realpath because os.tmpdir() is a symlink on macOS
    tmpRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-module-version-')));
  });

  afterEach(() => {
    process.chdir(previousCwd);
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  /**
   * Creates `<tmpRoot>/<dir>` with a package.json and returns the path of that package.json.
   * When `version` is given, also installs the fake module in the node_modules of that directory.
   */
  function createPackage(dir: string, version?: string): string {
    const packageDir = path.join(tmpRoot, dir);
    fs.mkdirSync(packageDir, { recursive: true });
    const pkgPath = path.join(packageDir, 'package.json');
    fs.writeFileSync(pkgPath, JSON.stringify({ name: path.basename(dir) }));

    if (version) {
      const moduleDir = path.join(packageDir, 'node_modules', fakeModule);
      fs.mkdirSync(moduleDir, { recursive: true });
      fs.writeFileSync(path.join(moduleDir, 'package.json'), JSON.stringify({ name: fakeModule, version }));
    }

    return pkgPath;
  }

  test('does not look in the current working directory without fromPath', () => {
    const workspacePkgPath = createPackage('packages/my-app', '1.2.3');
    process.chdir(path.dirname(workspacePkgPath));

    expect(tryGetModuleVersionFromRequire(fakeModule)).toBeUndefined();
  });

  test('finds a module from fromPath when the current working directory is unrelated', () => {
    const workspacePkgPath = createPackage('packages/my-app', '1.2.3');
    const unrelatedPkgPath = createPackage('unrelated');
    process.chdir(path.dirname(unrelatedPkgPath));

    expect(tryGetModuleVersionFromRequire(fakeModule, workspacePkgPath)).toEqual('1.2.3');
  });

  test('does not look in the current working directory when fromPath is given', () => {
    // The module is only installed in the current working directory
    const cwdPkgPath = createPackage('packages/my-app', '1.2.3');
    const otherPkgPath = createPackage('packages/other-app');
    process.chdir(path.dirname(cwdPkgPath));

    expect(tryGetModuleVersionFromRequire(fakeModule, otherPkgPath)).toBeUndefined();
  });

  test('prefers the version found from fromPath', () => {
    // Monorepo with a different version of the module in each workspace
    const cwdPkgPath = createPackage('packages/my-app', '1.0.0');
    const otherPkgPath = createPackage('packages/other-app', '2.0.0');
    process.chdir(path.dirname(cwdPkgPath));

    expect(tryGetModuleVersionFromRequire(fakeModule, otherPkgPath)).toEqual('2.0.0');
  });

  test('falls back to the location of this module', () => {
    // typescript is not installed in the temporary directory, but it can be
    // required from the location of aws-cdk-lib
    const emptyPkgPath = createPackage('empty');
    process.chdir(path.dirname(emptyPkgPath));

    const { version } = JSON.parse(fs.readFileSync(require.resolve('typescript/package.json'), 'utf-8'));
    expect(tryGetModuleVersionFromRequire('typescript')).toEqual(version);
    expect(tryGetModuleVersionFromRequire('typescript', emptyPkgPath)).toEqual(version);
  });

  test('returns undefined when the module is not installed', () => {
    const emptyPkgPath = createPackage('empty');
    process.chdir(path.dirname(emptyPkgPath));

    expect(tryGetModuleVersionFromRequire(fakeModule)).toBeUndefined();
    expect(tryGetModuleVersionFromRequire(fakeModule, emptyPkgPath)).toBeUndefined();
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
      // eslint-disable-next-line @typescript-eslint/no-require-imports
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
      '--lib es2022,dom',
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
      '--lib es2022,dom',
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

describe('getTsconfigCompilerOptionsArray', () => {
  test('should produce semantically equivalent output to getTsconfigCompilerOptions', () => {
    const tsconfig = path.join(__dirname, 'testtsconfig.json');
    const stringResult = getTsconfigCompilerOptions(tsconfig);
    const arrayResult = getTsconfigCompilerOptionsArray(tsconfig);

    // The array joined with spaces should equal the string result
    expect(arrayResult.join(' ')).toEqual(stringResult);
  });

  test('should produce semantically equivalent output with extended config', () => {
    const tsconfig = path.join(__dirname, 'testtsconfig-extended.json');
    const stringResult = getTsconfigCompilerOptions(tsconfig);
    const arrayResult = getTsconfigCompilerOptionsArray(tsconfig);

    expect(arrayResult.join(' ')).toEqual(stringResult);
  });

  test('should return array elements for each flag and value', () => {
    const tsconfig = path.join(__dirname, 'testtsconfig.json');
    const arrayResult = getTsconfigCompilerOptionsArray(tsconfig);

    // Boolean true flags are single elements
    expect(arrayResult).toContain('--alwaysStrict');
    expect(arrayResult).toContain('--declaration');

    // Boolean false flags have the flag and 'false' as separate elements
    const declMapIdx = arrayResult.indexOf('--declarationMap');
    expect(declMapIdx).toBeGreaterThanOrEqual(0);
    expect(arrayResult[declMapIdx + 1]).toBe('false');

    // String values are separate elements
    const targetIdx = arrayResult.indexOf('--target');
    expect(targetIdx).toBeGreaterThanOrEqual(0);
    expect(arrayResult[targetIdx + 1]).toBe('ES2022');

    // Array values are joined with commas as a single element
    const libIdx = arrayResult.indexOf('--lib');
    expect(libIdx).toBeGreaterThanOrEqual(0);
    expect(arrayResult[libIdx + 1]).toBe('es2022,dom');
  });
});
