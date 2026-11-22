import type { SpawnSyncReturns } from 'child_process';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import os from 'os';
import * as path from 'path';
import { DockerImage, FileSystem, SymlinkFollowMode } from 'aws-cdk-lib';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import type { ICommandHooks } from '../lib';
import { Bundling } from '../lib/bundling';
import { LocalBundling, _resetPythonCache } from '../lib/local-bundling';
import { Packaging } from '../lib/packaging';

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
  readonly outputPathSuffix?: string;
  readonly platformTags?: string[];
  readonly assetExcludes?: string[];
  readonly commandHooks?: ICommandHooks;
}

function makeLocalBundling(opts: BundlingFixtureOverrides): LocalBundling {
  const packaging = Packaging.fromEntry(opts.entry);
  return new LocalBundling({
    entry: opts.entry,
    runtime: opts.runtime,
    architecture: opts.architecture,
    packaging,
    excludes: opts.assetExcludes ?? [],
    outputPathSuffix: opts.outputPathSuffix,
    platformTags: opts.platformTags,
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
  ])('%s passes --python-version=%s and --abi=%s (plus --only-binary=:all:)', (runtime, pyVersion, abi) => {
    const local = makeLocalBundling({ entry: ENTRY_PIP, runtime, architecture: Architecture.X86_64 });
    local.tryBundle(outputDir);
    const args = pipInstallCall()!;
    expect(args).toEqual(expect.arrayContaining(['--python-version', pyVersion]));
    expect(args).toEqual(expect.arrayContaining(['--abi', abi]));
    // Invariant: every cell must pass --only-binary=:all: so source-only
    // distributions are rejected (they'd be built against the host, not the
    // Lambda runtime).
    expect(args).toContain('--only-binary=:all:');
  });
});

test('local bundling receives the effective excludes, platform tags, and environment', () => {
  const environment = { PIP_INDEX_URL: 'https://example.test/simple' };
  const buildImage = jest.spyOn(DockerImage, 'fromBuildV2');
  const hostIndex = process.env.PIP_INDEX_URL;
  process.env.PIP_INDEX_URL = 'https://host.example/simple';
  const beforeBundling = jest.fn(() => ['echo before']);
  const afterBundling = jest.fn(() => ['echo after']);
  try {
    const bundling = new Bundling({
      entry: ENTRY_UV,
      runtime: Runtime.PYTHON_3_11,
      localBundling: {
        platformTags: ['manylinux2014_x86_64'],
        additionalPlatformTags: ['manylinux_2_26_x86_64'],
      },
      environment,
      assetExcludes: ['.ignorefile'],
      commandHooks: { beforeBundling, afterBundling },
    });

    expect(bundling.image.image).toBe(Runtime.PYTHON_3_11.bundlingImage.image);
    expect(buildImage).not.toHaveBeenCalled();
    expect(bundling.local!.tryBundle(outputDir, bundling)).toBe(true);
    expect(copyDirectorySpy).toHaveBeenCalledWith(ENTRY_UV, outputDir, expect.objectContaining({
      exclude: ['.ignorefile', '.python-version'],
    }));
    const pipArgs = pipInstallCall()!;
    expect(pipArgs.filter((_, index) => pipArgs[index - 1] === '--platform')).toEqual([
      'manylinux2014_x86_64', 'manylinux_2_26_x86_64',
    ]);
    for (const hook of [beforeBundling, afterBundling]) {
      expect(hook).toHaveBeenNthCalledWith(1, '/asset-input', '/asset-output');
      expect(hook).toHaveBeenNthCalledWith(2, ENTRY_UV, outputDir);
    }
    for (const [, , options] of mockedSpawnSync.mock.calls) {
      expect(options.env.PIP_INDEX_URL).toBe(environment.PIP_INDEX_URL);
    }
    expect(shellCall('echo before')).toBeDefined();
    expect(shellCall('echo after')).toBeDefined();
    expect(shellCall(Packaging.withUv().exportCommand!)).toBeDefined();
  } finally {
    if (hostIndex === undefined) {
      delete process.env.PIP_INDEX_URL;
    } else {
      process.env.PIP_INDEX_URL = hostIndex;
    }
    buildImage.mockRestore();
  }
});

describe('platformTags override', () => {
  test('user tags fully replace the defaults', () => {
    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_12,
      architecture: Architecture.X86_64,
      platformTags: ['musllinux_1_2_x86_64'],
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
  test.each([
    [ENTRY_PIPENV, 'pipenv requirements', ['PIPENV_VENV_IN_PROJECT=1', '> requirements.txt', 'rm -rf .venv']],
    [ENTRY_POETRY, 'poetry export', ['--without-hashes', '--format requirements.txt', '--output requirements.txt']],
    [ENTRY_UV, 'uv export', ['--frozen', '-o requirements.txt']],
  ])('%s runs its export before pip install', (entry, exportCommand, expectedArgs) => {
    const local = makeLocalBundling({
      entry,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
    });
    local.tryBundle(outputDir);

    const calls = mockedSpawnSync.mock.calls;
    const exportIdx = calls.findIndex(([, args]) => args[1]?.includes(exportCommand));
    const pipInstallIdx = calls.findIndex(([cmd, args]) => isPythonCmd(cmd) && args[2] === 'install');
    expect(exportIdx).toBeGreaterThanOrEqual(0);
    expect(pipInstallIdx).toBeGreaterThan(exportIdx);
    for (const arg of expectedArgs) {
      expect(calls[exportIdx][1][1]).toContain(arg);
    }
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

  test('hooks receive the source and staging paths and run from the staging directory', () => {
    const beforeBundling = jest.fn(() => ['echo before']);
    const afterBundling = jest.fn(() => ['echo after']);
    const targetDir = path.join(outputDir, 'python', 'lib');
    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
      outputPathSuffix: 'python/lib',
      commandHooks: { beforeBundling, afterBundling },
    });
    local.tryBundle(outputDir);

    expect(beforeBundling).toHaveBeenCalledWith(ENTRY_PIP, targetDir);
    expect(afterBundling).toHaveBeenCalledWith(ENTRY_PIP, targetDir);
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
    expect(beforeOpts.cwd).toBe(targetDir);
    expect(afterOpts.cwd).toBe(targetDir);
  });

  test('beforeBundling commands run after the source copy', () => {
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
    expect(cmdCall?.[2]).toEqual(expect.objectContaining({
      cwd: outputDir,
      windowsVerbatimArguments: true,
    }));
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

test.each([false, true])('removes the generated Poetry requirements after bundling (pip failure: %s)', pipFails => {
  const requirements = path.join(outputDir, 'requirements.txt');
  mockedSpawnSync.mockImplementation((_cmd: string, args: string[]) => {
    if (args[1] === Packaging.withPoetry().exportCommand) {
      fs.writeFileSync(requirements, '--index-url https://user:placeholder@example.test/simple');
    }
    if (args[2] === 'install') {
      expect(fs.existsSync(requirements)).toBe(true);
      if (pipFails) {
        return fail('pip install failed');
      }
    }
    return OK;
  });
  const local = makeLocalBundling({
    entry: ENTRY_POETRY,
    runtime: Runtime.PYTHON_3_12,
    architecture: Architecture.X86_64,
  });
  if (pipFails) {
    expect(() => local.tryBundle(outputDir)).toThrow(/pip install failed/);
  } else {
    expect(local.tryBundle(outputDir)).toBe(true);
  }
  expect(fs.existsSync(requirements)).toBe(false);
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

    expect(() => local.tryBundle(outputDir)).toThrow(/Windows does not support pipenv\/poetry\/uv/i);
  });

  test('plain requirements.txt projects still work on Windows', () => {
    osPlatformSpy.mockReturnValue('win32');

    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.X86_64,
    });

    expect(local.tryBundle(outputDir)).toBe(true);
    expect(copyDirectorySpy).toHaveBeenCalledWith(ENTRY_PIP, outputDir, expect.anything());
    expect(pipInstallCall()).toEqual(expect.arrayContaining(['install', '-r', 'requirements.txt', '--target', outputDir]));
  });
});

describe('validation', () => {
  test.each(['..', '../escape', path.resolve(os.tmpdir(), 'outside-bundling')])(
    'rejects output suffix %s before writing outside staging',
    outputPathSuffix => {
      const local = makeLocalBundling({
        entry: ENTRY_PIP,
        runtime: Runtime.PYTHON_3_11,
        architecture: Architecture.X86_64,
        outputPathSuffix,
      });
      expect(() => local.tryBundle(outputDir)).toThrow(/outputPathSuffix should not escape the local bundling output directory/);
      expect(copyDirectorySpy).not.toHaveBeenCalled();
      expect(mockedSpawnSync).not.toHaveBeenCalled();
    },
  );

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

  test.each([
    { tags: [], error: /at least one Linux platform tag/ },
    { tags: ['macosx_11_0_arm64'], error: /does not target Linux/ },
  ])('fails with platform tags $tags', ({ tags, error }) => {
    expect(() => makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.ARM_64,
      platformTags: tags,
    })).toThrow(error);
  });

  test.each([
    [Architecture.ARM_64, 'manylinux_2_28_aarch64', 'manylinux_2_28_x86_64'],
    [Architecture.X86_64, 'manylinux2014_x86_64', 'musllinux_1_2_aarch64'],
  ])('rejects a conflicting platform tag for %s', (architecture, validTag, invalidTag) => {
    expect(() => makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_12,
      architecture,
      platformTags: [validTag, invalidTag],
    })).toThrow(new RegExp(invalidTag + '.*' + architecture.name));
  });

  test.each([
    [Runtime.PYTHON_3_7, 'manylinux_2_18_x86_64', 'platformTags'],
    [Runtime.PYTHON_3_11, 'manylinux_2_28_x86_64', 'platformTags'],
    [Runtime.PYTHON_3_12, 'manylinux_2_35_x86_64', 'additionalPlatformTags'],
  ])('rejects %s tags that require a newer glibc (%s)', (runtime, tag, option) => {
    expect(() => new Bundling({
      entry: ENTRY_PIP,
      runtime,
      localBundling: { [option]: [tag] },
    })).toThrow(/requires a newer glibc/);
  });

  test('appends extra platform tags after the runtime defaults', () => {
    const bundling = new Bundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_12,
      architecture: Architecture.ARM_64,
      localBundling: { additionalPlatformTags: ['manylinux_2_34_aarch64'] },
    });
    expect(bundling.local!.tryBundle(outputDir, bundling)).toBe(true);
    const pipArgs = pipInstallCall()!;
    expect(pipArgs.filter((_, index) => pipArgs[index - 1] === '--platform')).toEqual([
      'manylinux_2_28_aarch64', 'manylinux2014_aarch64', 'manylinux_2_34_aarch64',
    ]);
  });

  test('explicit platform tags bypass validation for the default architecture mapping', () => {
    const local = makeLocalBundling({
      entry: ENTRY_PIP,
      runtime: Runtime.PYTHON_3_11,
      architecture: Architecture.custom('weird', 'linux/mips64'),
      platformTags: ['linux_mips64'],
    });
    expect(local.tryBundle(outputDir)).toBe(true);
    expect(pipInstallCall()).toEqual(expect.arrayContaining(['--platform', 'linux_mips64']));
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

    expect(() => local.tryBundle(outputDir)).toThrow(/bash -c .*pipenv requirements/);
  });
});

test('fails when a source symlink resolves outside the entry', () => {
  const entry = path.join(outputDir, 'entry');
  fs.mkdirSync(entry);
  const sibling = path.join(outputDir, 'entry-other');
  fs.mkdirSync(sibling);
  fs.symlinkSync(sibling, path.join(entry, 'outside'), 'junction');

  const options = {
    entry,
    runtime: Runtime.PYTHON_3_11,
    architecture: Architecture.X86_64,
  };
  expect(() => makeLocalBundling(options)).toThrow(/symbolic link .*outside the entry directory/);
  expect(() => makeLocalBundling({ ...options, assetExcludes: ['outside'] })).not.toThrow();
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
    expect(options.follow).toBe(SymlinkFollowMode.ALWAYS);
  });
});
