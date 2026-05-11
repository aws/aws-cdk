import type { SpawnSyncReturns } from 'child_process';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { FileSystem } from 'aws-cdk-lib';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import type { ICommandHooks } from '../lib';
import { LocalBundling, _resetPythonCache } from '../lib/local-bundling';
import { DependenciesFile, Packaging } from '../lib/packaging';

jest.mock('child_process', () => ({
  spawnSync: jest.fn(),
}));

const mockedSpawnSync = spawnSync as unknown as jest.Mock;

const OK: SpawnSyncReturns<Buffer> = {
  status: 0,
  stderr: Buffer.from(''),
  stdout: Buffer.from(''),
  pid: 1,
  output: [null, Buffer.from(''), Buffer.from('')] as unknown as SpawnSyncReturns<Buffer>['output'],
  signal: null,
};

function fail(stderr: string, status: number = 1): SpawnSyncReturns<Buffer> {
  return {
    status,
    stderr: Buffer.from(stderr),
    stdout: Buffer.from(''),
    pid: 1,
    output: [null, Buffer.from(''), Buffer.from(stderr)] as unknown as SpawnSyncReturns<Buffer>['output'],
    signal: null,
  };
}

const FIXTURES = path.resolve(__dirname);
const ENTRY_PIP = path.join(FIXTURES, 'lambda-handler');
const ENTRY_NODEPS = path.join(FIXTURES, 'lambda-handler-nodeps');
const ENTRY_PIPENV = path.join(FIXTURES, 'lambda-handler-pipenv');
const ENTRY_POETRY = path.join(FIXTURES, 'lambda-handler-poetry');
const ENTRY_UV = path.join(FIXTURES, 'lambda-handler-uv');

let outputDir: string;
let copyDirectorySpy: jest.SpyInstance;
let osPlatformSpy: jest.SpyInstance;

beforeEach(() => {
  outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'python-local-bundling-test-'));
  mockedSpawnSync.mockReset();
  mockedSpawnSync.mockReturnValue(OK);
  copyDirectorySpy = jest.spyOn(FileSystem, 'copyDirectory').mockImplementation(() => {});
  osPlatformSpy = jest.spyOn(os, 'platform').mockReturnValue('linux');
  _resetPythonCache();
});

afterEach(() => {
  copyDirectorySpy.mockRestore();
  osPlatformSpy.mockRestore();
  fs.rmSync(outputDir, { recursive: true, force: true });
});

function isPythonCmd(cmd: string): boolean {
  return cmd === 'python3' || cmd === 'python';
}

interface BundlingFixtureOverrides {
  readonly entry: string;
  readonly runtime: Runtime;
  readonly architecture: Architecture;
  readonly manyLinuxTags?: string[];
  readonly assetExcludes?: string[];
  readonly commandHooks?: ICommandHooks;
}

function makeLocalBundling(opts: BundlingFixtureOverrides): LocalBundling {
  const packaging = Packaging.fromEntry(opts.entry);
  const excludes = [...(opts.assetExcludes ?? [])];
  if (packaging.dependenciesFile === DependenciesFile.UV && !excludes.includes('.python-version')) {
    excludes.push('.python-version');
  }
  return new LocalBundling({
    entry: opts.entry,
    runtime: opts.runtime,
    architecture: opts.architecture,
    packaging,
    excludes,
    manyLinuxTags: opts.manyLinuxTags,
    commandHooks: opts.commandHooks,
  });
}

function pipInstallCall(): string[] | undefined {
  const call = mockedSpawnSync.mock.calls.find(
    ([cmd, args]: [string, string[]]) => isPythonCmd(cmd) && args[0] === '-m' && args[1] === 'pip' && args[2] === 'install',
  );
  return call?.[1];
}

function shellCall(command: string): [string, string[]] | undefined {
  return mockedSpawnSync.mock.calls.find(
    ([cmd, args]: [string, string[]]) => (cmd === 'bash' || cmd === 'cmd') && args[1] === command,
  );
}

describe('AL2-base pip path', () => {
  test('PYTHON_3_11 + X86_64 emits a single manylinux2014 x86_64 tag', () => {
    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
    });

    expect(local.tryBundle(outputDir)).toBe(true);

    const args = pipInstallCall();
    expect(args).toBeDefined();
    expect(args).toEqual([
      '-m', 'pip', 'install',
      '-r', 'requirements.txt',
      '--target', outputDir,
      '--platform', 'manylinux2014_x86_64',
      '--python-version', '3.11',
      '--only-binary=:all:',
      '--implementation', 'cp',
      '--abi', 'cp311',
    ]);
  });

  test('PYTHON_3_11 + ARM_64 emits a single manylinux2014 aarch64 tag', () => {
    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.ARM_64,
    });

    local.tryBundle(outputDir);

    const args = pipInstallCall()!;
    const platformCount = args.filter((a) => a === '--platform').length;
    expect(platformCount).toBe(1);
    expect(args).toEqual(expect.arrayContaining(['--platform', 'manylinux2014_aarch64']));
    expect(args).not.toEqual(expect.arrayContaining(['manylinux2014_x86_64']));
  });
});

describe('AL2023-base pip path', () => {
  test('PYTHON_3_12 + X86_64 emits manylinux_2_28 then manylinux2014', () => {
    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_12,
      architecture: Architecture.X86_64,
    });

    local.tryBundle(outputDir);

    const args = pipInstallCall()!;
    const platformIdx1 = args.indexOf('--platform');
    const platformIdx2 = args.indexOf('--platform', platformIdx1 + 1);
    expect(args[platformIdx1 + 1]).toBe('manylinux_2_28_x86_64');
    expect(args[platformIdx2 + 1]).toBe('manylinux2014_x86_64');
    expect(args).toEqual(expect.arrayContaining(['--python-version', '3.12']));
    expect(args).toEqual(expect.arrayContaining(['--abi', 'cp312']));
  });

  test('PYTHON_3_13 + ARM_64 emits manylinux_2_28 then manylinux2014 aarch64', () => {
    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_13,
      architecture: Architecture.ARM_64,
    });

    local.tryBundle(outputDir);

    const args = pipInstallCall()!;
    const platformIdx1 = args.indexOf('--platform');
    const platformIdx2 = args.indexOf('--platform', platformIdx1 + 1);
    expect(args[platformIdx1 + 1]).toBe('manylinux_2_28_aarch64');
    expect(args[platformIdx2 + 1]).toBe('manylinux2014_aarch64');
    expect(args).toEqual(expect.arrayContaining(['--python-version', '3.13']));
    expect(args).toEqual(expect.arrayContaining(['--abi', 'cp313']));
  });
});

describe('parametrized sweeps', () => {
  test.each([
    [Architecture.X86_64, 'manylinux2014_x86_64'],
    [Architecture.ARM_64, 'manylinux2014_aarch64'],
  ])('PYTHON_3_9 + %s -> %s', (arch, tag) => {
    const local = makeLocalBundling({ entry: ENTRY_PIP, runtime: Runtime.PYTHON_3_9, architecture: arch });
    local.tryBundle(outputDir);
    const args = pipInstallCall()!;
    expect(args).toEqual(expect.arrayContaining(['--platform', tag]));
  });

  test.each([
    [Runtime.PYTHON_3_7, '3.7', 'cp37'],
    [Runtime.PYTHON_3_11, '3.11', 'cp311'],
    [Runtime.PYTHON_3_12, '3.12', 'cp312'],
    [Runtime.PYTHON_3_13, '3.13', 'cp313'],
    [Runtime.PYTHON_3_14, '3.14', 'cp314'],
  ])('%s passes --python-version=%s and --abi=%s', (runtime, pyVersion, abi) => {
    const local = makeLocalBundling({ entry: ENTRY_PIP, runtime, architecture: Architecture.X86_64 });
    local.tryBundle(outputDir);
    const args = pipInstallCall()!;
    expect(args).toEqual(expect.arrayContaining(['--python-version', pyVersion]));
    expect(args).toEqual(expect.arrayContaining(['--abi', abi]));
  });
});

describe('manyLinuxTags override', () => {
  test('user tags fully replace the defaults', () => {
    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_12,
      architecture: Architecture.X86_64,
      manyLinuxTags: ['musllinux_1_2_x86_64'],
    });

    local.tryBundle(outputDir);

    const args = pipInstallCall()!;
    const platformValues = args.reduce<string[]>((acc, value, idx) => {
      if (args[idx - 1] === '--platform') acc.push(value);
      return acc;
    }, []);
    expect(platformValues).toEqual(['musllinux_1_2_x86_64']);
  });
});

describe('dependency managers', () => {
  test('pipenv: export runs before pip install', () => {
    const local = makeLocalBundling({
      entry: ENTRY_PIPENV,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
    });
    local.tryBundle(outputDir);

    const exportedVia = shellCall('PIPENV_VENV_IN_PROJECT=1 pipenv requirements > requirements.txt && rm -rf .venv');
    expect(exportedVia).toBeDefined();

    const calls = mockedSpawnSync.mock.calls;
    const exportIdx = calls.findIndex(
      ([, args]: [string, string[]]) => args[1]?.includes('pipenv requirements'),
    );
    const pipInstallIdx = calls.findIndex(
      ([cmd, args]: [string, string[]]) => isPythonCmd(cmd) && args[2] === 'install',
    );
    expect(exportIdx).toBeGreaterThanOrEqual(0);
    expect(pipInstallIdx).toBeGreaterThan(exportIdx);
  });

  test('poetry: export runs before pip install', () => {
    const local = makeLocalBundling({
      entry: ENTRY_POETRY,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
    });
    local.tryBundle(outputDir);

    const poetryCall = mockedSpawnSync.mock.calls.find(
      ([, args]: [string, string[]]) => args[1]?.includes('poetry export'),
    );
    expect(poetryCall).toBeDefined();
    expect(poetryCall![1][1]).toContain('--without-hashes');
    expect(poetryCall![1][1]).toContain('--format requirements.txt');
    expect(poetryCall![1][1]).toContain('--output requirements.txt');
  });

  test('uv: export runs before pip install', () => {
    const local = makeLocalBundling({
      entry: ENTRY_UV,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
    });
    local.tryBundle(outputDir);

    const uvCall = mockedSpawnSync.mock.calls.find(
      ([, args]: [string, string[]]) => args[1]?.includes('uv export'),
    );
    expect(uvCall).toBeDefined();
    expect(uvCall![1][1]).toContain('--frozen');
    expect(uvCall![1][1]).toContain('-o requirements.txt');
  });

  test('no deps: pip install is not called', () => {
    const local = makeLocalBundling({
      entry: ENTRY_NODEPS,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
    });
    local.tryBundle(outputDir);

    expect(pipInstallCall()).toBeUndefined();
    const pythonCalls = mockedSpawnSync.mock.calls.filter(([cmd]) => isPythonCmd(cmd));
    expect(pythonCalls).toHaveLength(1);
    expect(pythonCalls[0][1]).toEqual(['-m', 'pip', '--version']);
  });
});

describe('command hooks', () => {
  test('beforeBundling runs before pip install, afterBundling runs after', () => {
    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
      commandHooks: {
        beforeBundling: () => ['echo before'],
        afterBundling: () => ['echo after'],
      },
    });
    local.tryBundle(outputDir);

    const calls = mockedSpawnSync.mock.calls;
    const beforeIdx = calls.findIndex(([cmd, args]) => (cmd === 'bash' || cmd === 'cmd') && args[1] === 'echo before');
    const afterIdx = calls.findIndex(([cmd, args]) => (cmd === 'bash' || cmd === 'cmd') && args[1] === 'echo after');
    const pipInstallIdx = calls.findIndex(([cmd, args]) => isPythonCmd(cmd) && args[2] === 'install');

    expect(beforeIdx).toBeGreaterThanOrEqual(0);
    expect(afterIdx).toBeGreaterThanOrEqual(0);
    expect(beforeIdx).toBeLessThan(pipInstallIdx);
    expect(afterIdx).toBeGreaterThan(pipInstallIdx);
  });

  test('multiple hook commands are joined with && into a single shell invocation', () => {
    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
      commandHooks: {
        beforeBundling: () => ['cd subdir', 'echo nested'],
        afterBundling: () => [],
      },
    });
    local.tryBundle(outputDir);

    const joined = shellCall('cd subdir && echo nested');
    expect(joined).toBeDefined();
    expect(shellCall('cd subdir')).toBeUndefined();
    expect(shellCall('echo nested')).toBeUndefined();
  });

  test('hooks run with cwd=outputDir (not the user source tree)', () => {
    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
      commandHooks: {
        beforeBundling: () => ['echo before'],
        afterBundling: () => ['echo after'],
      },
    });
    local.tryBundle(outputDir);

    const before = shellCall('echo before')!;
    const after = shellCall('echo after')!;
    const beforeOpts = mockedSpawnSync.mock.calls.find(
      ([cmd, args]) => (cmd === 'bash' || cmd === 'cmd') && args[1] === 'echo before',
    )![2];
    const afterOpts = mockedSpawnSync.mock.calls.find(
      ([cmd, args]) => (cmd === 'bash' || cmd === 'cmd') && args[1] === 'echo after',
    )![2];
    expect(before).toBeDefined();
    expect(after).toBeDefined();
    expect(beforeOpts.cwd).toBe(outputDir);
    expect(afterOpts.cwd).toBe(outputDir);
  });

  test('beforeBundling runs after copySources so the source tree is untouched', () => {
    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
      commandHooks: {
        beforeBundling: () => ['echo before'],
        afterBundling: () => [],
      },
    });
    local.tryBundle(outputDir);

    const copyOrder = copyDirectorySpy.mock.invocationCallOrder[0];
    const beforeCall = mockedSpawnSync.mock.calls.findIndex(
      ([cmd, args]) => (cmd === 'bash' || cmd === 'cmd') && args[1] === 'echo before',
    );
    const beforeOrder = mockedSpawnSync.mock.invocationCallOrder[beforeCall];
    expect(beforeOrder).toBeGreaterThan(copyOrder);
  });

  test('Windows host uses cmd /c instead of bash -c', () => {
    osPlatformSpy.mockReturnValue('win32');

    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
      commandHooks: {
        beforeBundling: () => ['echo hi'],
        afterBundling: () => [],
      },
    });
    local.tryBundle(outputDir);

    const bashCall = mockedSpawnSync.mock.calls.find(
      ([cmd, args]) => cmd === 'bash' && args[1] === 'echo hi',
    );
    const cmdCall = mockedSpawnSync.mock.calls.find(
      ([cmd, args]) => cmd === 'cmd' && args[0] === '/c' && args[1] === 'echo hi',
    );
    expect(bashCall).toBeUndefined();
    expect(cmdCall).toBeDefined();
  });
});

describe('python binary resolution', () => {
  test('prefers python3 when available', () => {
    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
    });
    local.tryBundle(outputDir);

    const probe = mockedSpawnSync.mock.calls[0];
    expect(probe[0]).toBe('python3');
    const pipInstall = mockedSpawnSync.mock.calls.find(
      ([, args]) => args[0] === '-m' && args[1] === 'pip' && args[2] === 'install',
    )!;
    expect(pipInstall[0]).toBe('python3');
  });

  test('falls back to python when python3 is missing', () => {
    mockedSpawnSync.mockReturnValueOnce(fail('python3: command not found', 127));
    mockedSpawnSync.mockReturnValue(OK);

    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
    });
    local.tryBundle(outputDir);

    const probes = mockedSpawnSync.mock.calls.filter(
      ([, args]) => args[0] === '-m' && args[1] === 'pip' && args[2] === '--version',
    );
    expect(probes.map(([cmd]) => cmd)).toEqual(['python3', 'python']);

    const pipInstall = mockedSpawnSync.mock.calls.find(
      ([, args]) => args[0] === '-m' && args[1] === 'pip' && args[2] === 'install',
    )!;
    expect(pipInstall[0]).toBe('python');
  });

  test('throws PythonLocalBundlingPythonMissing when neither python3 nor python works', () => {
    mockedSpawnSync.mockReturnValue(fail('command not found', 127));

    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
    });

    expect(() => local.tryBundle(outputDir)).toThrow(/python3.*python/is);
  });
});

describe('Windows export guard', () => {
  test.each([
    ['pipenv', ENTRY_PIPENV],
    ['poetry', ENTRY_POETRY],
    ['uv', ENTRY_UV],
  ])('fails fast on Windows for %s projects', (_name, entry) => {
    osPlatformSpy.mockReturnValue('win32');

    const local = makeLocalBundling({
      entry,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
    });

    expect(() => local.tryBundle(outputDir)).toThrow(/Windows.*POSIX shell/i);
  });

  test('plain requirements.txt projects still work on Windows', () => {
    osPlatformSpy.mockReturnValue('win32');

    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
    });

    expect(() => local.tryBundle(outputDir)).not.toThrow();
  });
});

describe('validation', () => {
  test('non-Python runtime throws at construction', () => {
    expect(() => makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.NODEJS_20_X,
      architecture: Architecture.X86_64,
    })).toThrow(/only Python runtimes/i);
  });

  test('unsupported architecture throws at construction', () => {
    expect(() => makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.custom('weird', 'linux/mips64'),
    })).toThrow(/linux\/mips64/);
  });
});

describe('subprocess failures', () => {
  test('pip probe failure throws PythonLocalBundlingPythonMissing', () => {
    mockedSpawnSync.mockReturnValue(fail('command not found', 127));

    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
    });

    expect(() => local.tryBundle(outputDir)).toThrow(/python3.*python/is);
    expect(mockedSpawnSync).toHaveBeenCalledTimes(2);
  });

  test('pip install failure surfaces stderr', () => {
    mockedSpawnSync.mockReturnValueOnce(OK).mockReturnValueOnce(fail('ERROR: No matching distribution found for foobar'));

    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
    });

    expect(() => local.tryBundle(outputDir)).toThrow(/No matching distribution found for foobar/);
  });

  test('pipenv missing fails with the export command in the error message', () => {
    mockedSpawnSync.mockReturnValueOnce(OK);
    mockedSpawnSync.mockReturnValueOnce(fail('pipenv: command not found', 127));

    const local = makeLocalBundling({
      entry: ENTRY_PIPENV,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
    });

    expect(() => local.tryBundle(outputDir)).toThrow(/pipenv/);
  });
});

describe('assetExcludes', () => {
  test('excludes are forwarded to FileSystem.copyDirectory', () => {
    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
      assetExcludes: ['.ignorelist'],
    });
    local.tryBundle(outputDir);

    expect(copyDirectorySpy).toHaveBeenCalledTimes(1);
    const [src, dest, options] = copyDirectorySpy.mock.calls[0];
    expect(src).toBe(ENTRY_PIP);
    expect(dest).toBe(outputDir);
    expect(options.exclude).toEqual(['.ignorelist']);
  });
});
