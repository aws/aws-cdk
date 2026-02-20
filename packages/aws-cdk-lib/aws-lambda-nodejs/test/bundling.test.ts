
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { version as delayVersion } from 'delay/package.json';
import { Annotations } from '../../assertions';
import { Architecture, Code, Runtime, RuntimeFamily } from '../../aws-lambda';
import { App, AssetHashType, BundlingFileAccess, DockerImage, Stack } from '../../core';
import { Bundling } from '../lib/bundling';
import { PackageInstallation } from '../lib/package-installation';
import { Charset, LogLevel, OutputFormat, SourceMapMode } from '../lib/types';
import * as util from '../lib/util';

const STANDARD_RUNTIME = Runtime.NODEJS_20_X;
const STANDARD_TARGET = 'node20';
const STANDARD_EXTERNAL = '@aws-sdk/*';

let detectPackageInstallationMock: jest.SpyInstance<PackageInstallation | undefined>;
const app = new App();
const stack = new Stack(app, 'MyTestStack');
beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
  Bundling.clearEsbuildInstallationCache();
  Bundling.clearTscInstallationCache();

  jest.spyOn(Code, 'fromAsset');

  detectPackageInstallationMock = jest.spyOn(PackageInstallation, 'detect').mockReturnValue({
    isLocal: true,
    version: '0.8.8',
  });

  jest.spyOn(DockerImage, 'fromBuild').mockReturnValue({
    image: 'built-image',
    cp: () => 'dest-path',
    run: () => {},
    toJSON: () => 'built-image',
  });
});

let projectRoot = '/project';
let depsLockFilePath = '/project/yarn.lock';
let entry = '/project/lib/handler.ts';
let tsconfig = '/project/lib/custom-tsconfig.ts';

test('esbuild bundling in Docker', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    environment: {
      KEY: 'value',
    },
    loader: {
      '.png': 'dataurl',
    },
    forceDockerBundling: true,
    network: 'host',
  });

  // Correctly bundles with esbuild
  // Note: Arguments are shell-escaped (wrapped in single quotes) for proper quoting
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      environment: {
        KEY: 'value',
      },
      command: [
        'bash', '-c',
        expect.stringContaining("'esbuild'") &&
        expect.stringContaining("'--bundle'") &&
        expect.stringContaining('/asset-input/lib/handler.ts') &&
        expect.stringContaining(`--target=${STANDARD_TARGET}`) &&
        expect.stringContaining('--platform=node') &&
        expect.stringContaining(`--external:${STANDARD_EXTERNAL}`) &&
        expect.stringContaining('--loader:.png=dataurl'),
      ],
      workingDirectory: '/',
    }),
  });

  expect(DockerImage.fromBuild).toHaveBeenCalledWith(expect.stringMatching(/aws-lambda-nodejs\/lib$/), expect.objectContaining({
    buildArgs: expect.objectContaining({
      IMAGE: expect.stringMatching(/build-nodejs/),
    }),
    platform: 'linux/amd64',
    network: 'host',
  }));
});

test('esbuild bundling with handler named index.ts', () => {
  Bundling.bundle(stack, {
    entry: '/project/lib/index.ts',
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining('/asset-input/lib/index.ts') &&
        expect.stringContaining(`--target=${STANDARD_TARGET}`) &&
        expect.stringContaining(`--external:${STANDARD_EXTERNAL}`),
      ],
    }),
  });
});

test('esbuild bundling with verbose log level', () => {
  Bundling.bundle(stack, {
    entry: '/project/lib/index.ts',
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
    logLevel: LogLevel.VERBOSE,
  });

  // Correctly bundles with esbuild with log level VERBOSE
  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining('/asset-input/lib/index.ts') &&
        expect.stringContaining('--log-level=verbose'),
      ],
    }),
  });
});

test('esbuild bundling with tsx handler', () => {
  Bundling.bundle(stack, {
    entry: '/project/lib/handler.tsx',
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining('/asset-input/lib/handler.tsx') &&
        expect.stringContaining(`--target=${STANDARD_TARGET}`),
      ],
    }),
  });
});

test('esbuild with Windows paths', () => {
  const osPlatformMock = jest.spyOn(os, 'platform').mockReturnValue('win32');
  // Mock path.basename() because it cannot extract the basename of a Windows
  // path when running on Linux
  jest.spyOn(path, 'basename').mockReturnValueOnce('package-lock.json');
  jest.spyOn(path, 'relative').mockReturnValueOnce('lib\\entry.ts').mockReturnValueOnce('package-lock.json');

  Bundling.bundle(stack, {
    entry: 'C:\\my-project\\lib\\entry.ts',
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    projectRoot: 'C:\\my-project',
    depsLockFilePath: 'C:\\my-project\\package-lock.json',
    forceDockerBundling: true,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
    bundling: expect.objectContaining({
      command: expect.arrayContaining([
        expect.stringContaining('/lib/entry.ts'),
      ]),
    }),
  }));

  osPlatformMock.mockRestore();
});

test('esbuild bundling with externals and dependencies', () => {
  const packageLock = path.join(__dirname, '..', 'package-lock.json');
  Bundling.bundle(stack, {
    entry: __filename,
    projectRoot: path.dirname(packageLock),
    depsLockFilePath: packageLock,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    externalModules: ['abc'],
    nodeModules: ['delay'],
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  // Note: esbuild command is shell-escaped, deps commands are chained with &&
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(packageLock), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining('--external:abc') &&
        expect.stringContaining('--external:delay') &&
        expect.stringContaining('npm ci'),
      ],
    }),
  });
});

test('esbuild bundling with esbuild options', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    minify: true,
    sourceMap: true,
    sourcesContent: false,
    target: 'es2020',
    loader: {
      '.png': 'dataurl',
    },
    logLevel: LogLevel.SILENT,
    keepNames: true,
    tsconfig,
    metafile: true,
    banner: '/* comments */',
    footer: '/* comments */',
    charset: Charset.UTF8,
    forceDockerBundling: true,
    mainFields: ['module', 'main'],
    define: {
      'process.env.KEY': JSON.stringify('VALUE'),
      'process.env.BOOL': 'true',
      'process.env.NUMBER': '7777',
      'process.env.STRING': JSON.stringify('this is a "test"'),
    },
    format: OutputFormat.ESM,
    inject: ['./my-shim.js', './path with space/second-shim.js'],
    esbuildArgs: {
      '--log-limit': '0',
      '--resolve-extensions': '.ts,.js',
      '--splitting': true,
      '--keep-names': '',
      '--out-extension': '.js=.mjs',
    },
  });

  // Correctly bundles with esbuild - check for key options
  // Note: Arguments are shell-escaped for proper quoting
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash',
        '-c',
        expect.stringContaining('--target=es2020') &&
        expect.stringContaining('--format=esm') &&
        expect.stringContaining('--minify') &&
        expect.stringContaining('--sourcemap') &&
        expect.stringContaining('--loader:.png=dataurl') &&
        expect.stringContaining('--log-level=silent') &&
        expect.stringContaining('--keep-names') &&
        expect.stringContaining('--inject:') &&
        expect.stringContaining('--log-limit=0'),
      ],
    }),
  });

  // Make sure that the define instructions are working as expected with the esbuild CLI
  // Note: This test uses the old format directly with esbuild CLI (not through our bundling)
  const defineInstructions = '--define:process.env.KEY="\\"VALUE\\"" --define:process.env.BOOL="true" --define:process.env.NUMBER="7777" --define:process.env.STRING="\\"this is a \\\\\\"test\\\\\\"\\""';
  const bundleProcess = util.exec('bash', ['-c', `npx esbuild --bundle ${`${__dirname}/handlers/define.ts`} ${defineInstructions}`]);
  expect(bundleProcess.stdout.toString()).toMatchSnapshot();
});

test('throws with ESM and NODEJS_12_X', () => {
  expect(() => Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_12_X,
    architecture: Architecture.X86_64,
    format: OutputFormat.ESM,
  })).toThrow(/ECMAScript module output format is not supported by the nodejs12.x runtime/);
});

test('esbuild bundling source map default', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    sourceMap: true,
    sourceMapMode: SourceMapMode.DEFAULT,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining('--sourcemap') &&
        expect.stringContaining(`--external:${STANDARD_EXTERNAL}`),
      ],
    }),
  });
});

test.each([
  [Runtime.NODEJS_20_X, 'node20'],
]) ('esbuild bundling without aws-sdk v3 and smithy with feature flag enabled using Node 18+', (runtime, target) => {
  const cdkApp = new App({
    context: {
      '@aws-cdk/aws-lambda-nodejs:sdkV3ExcludeSmithyPackages': true,
    },
  });
  const cdkStack = new Stack(cdkApp, 'MyTestStack');
  Bundling.bundle(cdkStack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: runtime,
    architecture: Architecture.X86_64,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining(`--target=${target}`) &&
        expect.stringContaining('--external:@aws-sdk/*') &&
        expect.stringContaining('--external:@smithy/*'),
      ],
    }),
  });
});

test('esbuild bundling with bundleAwsSdk true with feature flag enabled using Node 18+', () => {
  const cdkApp = new App({
    context: {
      '@aws-cdk/aws-lambda-nodejs:sdkV3ExcludeSmithyPackages': true,
    },
  });
  const cdkStack = new Stack(cdkApp, 'MyTestStack');
  Bundling.bundle(cdkStack, {
    entry,
    projectRoot,
    depsLockFilePath,
    bundleAwsSDK: true,
    runtime: Runtime.NODEJS_20_X,
    architecture: Architecture.X86_64,
  });

  // Correctly bundles with esbuild - no externals when bundleAwsSDK is true
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining(`--target=${STANDARD_TARGET}`) &&
        expect.stringContaining('--platform=node'),
      ],
    }),
  });
});

test('esbuild bundling with feature flag enabled using Node Latest', () => {
  const cdkApp = new App({
    context: {
      '@aws-cdk/aws-lambda-nodejs:sdkV3ExcludeSmithyPackages': true,
    },
  });
  const cdkStack = new Stack(cdkApp, 'MyTestStack');
  Bundling.bundle(cdkStack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_LATEST,
    architecture: Architecture.X86_64,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining('--target=node22') &&
        expect.stringContaining('--platform=node'),
      ],
    }),
  });
});

test('esbuild bundling with feature flag enabled using Node 16', () => {
  const cdkApp = new App({
    context: {
      '@aws-cdk/aws-lambda-nodejs:sdkV3ExcludeSmithyPackages': true,
    },
  });
  const cdkStack = new Stack(cdkApp, 'MyTestStack');
  Bundling.bundle(cdkStack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_16_X,
    architecture: Architecture.X86_64,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining('--target=node16') &&
        expect.stringContaining('--external:aws-sdk'),
      ],
    }),
  });
});

test('esbuild bundling without aws-sdk v3 when use greater than or equal Runtime.NODEJS_20_X', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_20_X,
    architecture: Architecture.X86_64,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining(`--target=${STANDARD_TARGET}`) &&
        expect.stringContaining('--external:@aws-sdk/*'),
      ],
    }),
  });
});

test('esbuild bundling includes aws-sdk', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_20_X,
    architecture: Architecture.X86_64,
    bundleAwsSDK: true,
  });

  // Correctly bundles with esbuild - no externals when bundleAwsSDK is true
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining(`--target=${STANDARD_TARGET}`) &&
        expect.stringContaining('--platform=node'),
      ],
    }),
  });
});

test('esbuild bundling source map inline', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    sourceMap: true,
    sourceMapMode: SourceMapMode.INLINE,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining('--sourcemap=inline') &&
        expect.stringContaining(`--external:${STANDARD_EXTERNAL}`),
      ],
    }),
  });
});

test('esbuild bundling is correctly done with custom runtime matching predefined runtime', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: new Runtime(STANDARD_RUNTIME.name, RuntimeFamily.NODEJS, { supportsInlineCode: true }),
    architecture: Architecture.X86_64,
    sourceMapMode: SourceMapMode.INLINE,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining(`--target=${STANDARD_TARGET}`) &&
        expect.stringContaining('--sourcemap=inline'),
      ],
    }),
  });
});

test('esbuild bundling source map enabled when only source map mode exists', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    sourceMapMode: SourceMapMode.INLINE,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining('--sourcemap=inline'),
      ],
    }),
  });
});

test('esbuild bundling throws when sourceMapMode used with false sourceMap', () => {
  expect(() => {
    Bundling.bundle(stack, {
      entry,
      projectRoot,
      depsLockFilePath,
      runtime: STANDARD_RUNTIME,
      architecture: Architecture.X86_64,
      sourceMap: false,
      sourceMapMode: SourceMapMode.INLINE,
    });
  }).toThrow('sourceMapMode cannot be used when sourceMap is false');
});

test('Detects yarn.lock', () => {
  const yarnLock = path.join(__dirname, '..', 'yarn.lock');
  Bundling.bundle(stack, {
    entry: __filename,
    projectRoot: path.dirname(yarnLock),
    depsLockFilePath: yarnLock,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    nodeModules: ['delay'],
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(yarnLock), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: expect.arrayContaining([
        expect.stringMatching(/yarn\.lock.+yarn install --no-immutable/),
      ]),
    }),
  });
});

test('Detects pnpm-lock.yaml', () => {
  const pnpmLock = '/project/pnpm-lock.yaml';
  Bundling.bundle(stack, {
    entry: __filename,
    projectRoot,
    depsLockFilePath: pnpmLock,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    nodeModules: ['delay'],
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(pnpmLock), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: expect.arrayContaining([
        expect.stringMatching(/echo '' > "\/asset-output\/pnpm-workspace.yaml\".+pnpm-lock\.yaml.+pnpm install --config.node-linker=hoisted --config.package-import-method=clone-or-copy --no-prefer-frozen-lockfile && rm -f "\/asset-output\/node_modules\/.modules.yaml"/),
      ]),
    }),
  });
});

test('Detects bun.lockb', () => {
  const bunLock = path.join(__dirname, '..', 'bun.lockb');
  Bundling.bundle(stack, {
    entry: __filename,
    projectRoot: path.dirname(bunLock),
    depsLockFilePath: bunLock,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    nodeModules: ['delay'],
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(bunLock), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: expect.arrayContaining([
        expect.stringMatching(/bun\.lockb.+bun install/),
      ]),
    }),
  });
});

test('Detects bun.lock', () => {
  const bunLock = path.join(__dirname, '..', 'bun.lock');
  Bundling.bundle(stack, {
    entry: __filename,
    projectRoot: path.dirname(bunLock),
    depsLockFilePath: bunLock,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    nodeModules: ['delay'],
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(bunLock), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: expect.arrayContaining([
        expect.stringMatching(/bun\.lock.+bun install/),
      ]),
    }),
  });
});

test('with Docker build args', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    buildArgs: {
      HELLO: 'WORLD',
    },
    forceDockerBundling: true,
  });

  expect(DockerImage.fromBuild).toHaveBeenCalledWith(expect.stringMatching(/lib$/), expect.objectContaining({
    buildArgs: expect.objectContaining({
      HELLO: 'WORLD',
    }),
  }));
});

test('Local bundling', () => {
  const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('stdout'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  });

  const bundler = new Bundling(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    environment: {
      KEY: 'value',
    },
    logLevel: LogLevel.ERROR,
  });

  expect(bundler.local).toBeDefined();

  const tryBundle = bundler.local?.tryBundle('/outdir', { image: STANDARD_RUNTIME.bundlingDockerImage });
  expect(tryBundle).toBe(true);

  // esbuild is now invoked directly without shell interpretation.
  // The first call should be to the esbuild runner (yarn run esbuild) with args as an array.
  const esbuildCall = spawnSyncMock.mock.calls.find(
    (call: any[]) => call[1]?.some((arg: string) => arg?.includes('--bundle')),
  );
  expect(esbuildCall).toBeDefined();
  // Should be called with yarn (the package manager's run command), not bash
  expect(esbuildCall[0]).toBe('yarn');
  // Args should include esbuild arguments as separate array elements
  expect(esbuildCall[1]).toContain('esbuild');
  expect(esbuildCall[1]).toContain('--bundle');
  expect(esbuildCall[1]).toContain(entry);
  // Environment should be passed through
  expect(esbuildCall[2]).toMatchObject({
    env: expect.objectContaining({ KEY: 'value' }),
    cwd: '/project',
  });

  // Docker image is not built
  expect(DockerImage.fromBuild).not.toHaveBeenCalled();

  spawnSyncMock.mockRestore();
});

test('Incorrect esbuild version', () => {
  detectPackageInstallationMock.mockReturnValueOnce({
    isLocal: true,
    version: '3.4.5',
  });

  const bundler = new Bundling(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
  });

  expect(() => bundler.local?.tryBundle('/outdir', {
    image: STANDARD_RUNTIME.bundlingImage,
  })).toThrow(/Expected esbuild version 0.x but got 3.4.5/);
});

test('Custom bundling docker image', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    dockerImage: DockerImage.fromRegistry('my-custom-image'),
    forceDockerBundling: true,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      image: { image: 'my-custom-image' },
    }),
  });
});

test('with command hooks', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    commandHooks: {
      beforeBundling(inputDir: string, outputDir: string): string[] {
        return [
          `echo hello > ${inputDir}/a.txt`,
          `cp ${inputDir}/a.txt ${outputDir}`,
        ];
      },
      afterBundling(inputDir: string, outputDir: string): string[] {
        return [`cp ${inputDir}/b.txt ${outputDir}/txt`];
      },
      beforeInstall() {
        return [];
      },
    },
    forceDockerBundling: true,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringMatching(/^echo hello > \/asset-input\/a.txt && cp \/asset-input\/a.txt \/asset-output && .+ && cp \/asset-input\/b.txt \/asset-output\/txt$/),
      ],
    }),
  });
});

test('esbuild bundling with projectRoot', () => {
  Bundling.bundle(stack, {
    entry: '/project/lib/index.ts',
    projectRoot: '/project',
    depsLockFilePath,
    tsconfig,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining('/asset-input/lib/index.ts') &&
        expect.stringContaining(`--target=${STANDARD_TARGET}`) &&
        expect.stringContaining('--tsconfig='),
      ],
    }),
  });
});

test('esbuild bundling with projectRoot and externals and dependencies', () => {
  const repoRoot = path.join(__dirname, '..', '..', '..', '..');
  const packageLock = path.join(repoRoot, 'common', 'package-lock.json');
  Bundling.bundle(stack, {
    entry: __filename,
    projectRoot: repoRoot,
    depsLockFilePath: packageLock,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    externalModules: ['abc'],
    nodeModules: ['delay'],
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(repoRoot, {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining('--external:abc') &&
        expect.stringContaining('--external:delay') &&
        expect.stringContaining('npm ci'),
      ],
    }),
  });
});

test('esbuild bundling with pre compilations', () => {
  const packageLock = path.join(__dirname, '..', 'package-lock.json');

  Bundling.bundle(stack, {
    entry: __filename.replace('.js', '.ts'),
    projectRoot: path.dirname(packageLock),
    depsLockFilePath: packageLock,
    runtime: STANDARD_RUNTIME,
    preCompilation: true,
    forceDockerBundling: true,
    architecture: Architecture.X86_64,
  });

  // Correctly bundles with esbuild - tsc runs first, then esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(packageLock), {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining('tsc') &&
        expect.stringContaining('esbuild') &&
        expect.stringContaining(`--target=${STANDARD_TARGET}`),
      ],
    }),
  });

  expect(detectPackageInstallationMock).toHaveBeenCalledWith('typescript');
});

test('throws with pre compilation and not found tsconfig', () => {
  expect(() => {
    Bundling.bundle(stack, {
      entry,
      projectRoot,
      depsLockFilePath,
      runtime: STANDARD_RUNTIME,
      forceDockerBundling: true,
      preCompilation: true,
      architecture: Architecture.X86_64,
    });
  }).toThrow('Cannot find a `tsconfig.json` but `preCompilation` is set to `true`, please specify it via `tsconfig`');
});

test('with custom hash', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    forceDockerBundling: true,
    assetHash: 'custom',
    architecture: Architecture.X86_64,
  });

  // Correctly passes asset hash options
  expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), expect.objectContaining({
    assetHash: 'custom',
    assetHashType: AssetHashType.CUSTOM,
  }));
});

test('Custom bundling entrypoint', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
    entrypoint: ['/cool/entrypoint', '--cool-entrypoint-arg'],
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      entrypoint: ['/cool/entrypoint', '--cool-entrypoint-arg'],
    }),
  });
});

test('Custom bundling volumes', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
    volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
    }),
  });
});

test('Custom bundling volumesFrom', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
    volumesFrom: ['777f7dc92da7'],
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      volumesFrom: ['777f7dc92da7'],
    }),
  });
});

test('Custom bundling workingDirectory', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
    workingDirectory: '/working-directory',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      workingDirectory: '/working-directory',
    }),
  });
});

test('Custom bundling user', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
    user: 'user:group',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      user: 'user:group',
    }),
  });
});

test('Custom bundling securityOpt', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
    securityOpt: 'no-new-privileges',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      securityOpt: 'no-new-privileges',
    }),
  });
});

test('Custom bundling network', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
    network: 'host',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      network: 'host',
    }),
  });
});

test('Custom bundling file copy variant', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: STANDARD_RUNTIME,
    architecture: Architecture.X86_64,
    forceDockerBundling: true,
    bundlingFileAccess: BundlingFileAccess.VOLUME_COPY,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      bundlingFileAccess: BundlingFileAccess.VOLUME_COPY,
    }),
  });
});

test('bundling using NODEJS_LATEST doesn\'t externalize anything by default', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_LATEST,
    architecture: Architecture.X86_64,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        expect.stringContaining('--target=node22') &&
        expect.stringContaining('--platform=node'),
      ],
    }),
  });
});

test('bundling with <= Node16 warns when sdk v3 is external', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_16_X,
    architecture: Architecture.X86_64,
    externalModules: ['@aws-sdk/client-s3'],
  });

  Annotations.fromStack(stack).hasWarning('*',
    'If you are relying on AWS SDK v3 to be present in the Lambda environment already, please explicitly configure a NodeJS runtime of Node 18 or higher. [ack: @aws-cdk/aws-lambda-nodejs:sdkV3NotInRuntime]',
  );
});

test('bundling with <= Node16 does not warn with default externalModules', () => {
  const myStack = new Stack(app, 'MyTestStack2');
  Bundling.bundle(myStack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_16_X,
    architecture: Architecture.X86_64,
  });

  Annotations.fromStack(myStack).hasNoWarning('*',
    'If you are relying on AWS SDK v3 to be present in the Lambda environment already, please explicitly configure a NodeJS runtime of Node 18 or higher. [ack: @aws-cdk/aws-lambda-nodejs:sdkV3NotInRuntime]',
  );
  Annotations.fromStack(myStack).hasNoWarning('*',
    'If you are relying on AWS SDK v2 to be present in the Lambda environment already, please explicitly configure a NodeJS runtime of Node 16 or lower. [ack: @aws-cdk/aws-lambda-nodejs:sdkV2NotInRuntime]',
  );
});

test('bundling with >= Node18 warns when sdk v2 is external', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_20_X,
    architecture: Architecture.X86_64,
    externalModules: ['aws-sdk'],
  });

  Annotations.fromStack(stack).hasWarning('*',
    'If you are relying on AWS SDK v2 to be present in the Lambda environment already, please explicitly configure a NodeJS runtime of Node 16 or lower. [ack: @aws-cdk/aws-lambda-nodejs:sdkV2NotInRuntime]',
  );
});

test('bundling with >= Node18 does not warn with default externalModules', () => {
  const myStack = new Stack(app, 'MyTestStack3');
  Bundling.bundle(myStack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_20_X,
    architecture: Architecture.X86_64,
  });

  Annotations.fromStack(myStack).hasNoWarning('*',
    'If you are relying on AWS SDK v3 to be present in the Lambda environment already, please explicitly configure a NodeJS runtime of Node 18 or higher. [ack: @aws-cdk/aws-lambda-nodejs:sdkV3NotInRuntime]',
  );
  Annotations.fromStack(myStack).hasNoWarning('*',
    'If you are relying on AWS SDK v2 to be present in the Lambda environment already, please explicitly configure a NodeJS runtime of Node 16 or lower. [ack: @aws-cdk/aws-lambda-nodejs:sdkV2NotInRuntime]',
  );
});

test('bundling with NODEJS_LATEST warns when any dependencies are external', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_LATEST,
    architecture: Architecture.X86_64,
    externalModules: ['my-external-dep'],
  });

  Annotations.fromStack(stack).hasWarning('*',
    'When using NODEJS_LATEST the runtime version may change as new runtimes are released, this may affect the availability of packages shipped with the environment. Ensure that any external dependencies are available through layers or specify a specific runtime version. [ack: @aws-cdk/aws-lambda-nodejs:variableRuntimeExternals]',
  );
});

test('Node 16 runtimes warn about sdk v2 upgrades', () => {
  Bundling.bundle(stack, {
    entry,
    projectRoot,
    depsLockFilePath,
    runtime: Runtime.NODEJS_16_X,
    architecture: Architecture.X86_64,
  });

  Annotations.fromStack(stack).hasWarning('*',
    'Be aware that the NodeJS runtime of Node 16 will be deprecated by Lambda on June 12, 2024. Lambda runtimes Node 18 and higher include SDKv3 and not SDKv2. Updating your Lambda runtime will require bundling the SDK, or updating all SDK calls in your handler code to use SDKv3 (which is not a trivial update). Please account for this added complexity and update as soon as possible. [ack: aws-cdk-lib/aws-lambda-nodejs:runtimeUpdateSdkV2Breakage]',
  );
});

function findParentTsConfigPath(dir: string, depth: number = 1, limit: number = 5): string {
  const target = path.join(dir, 'tsconfig.json');
  if (fs.existsSync(target)) {
    return target;
  } else if (depth < limit) {
    return findParentTsConfigPath(path.join(dir, '..'), depth + 1, limit);
  }

  throw new Error(`No \`package.json\` file found within ${depth} parent directories`);
}

/**
 * =============================================================================
 * SHELL METACHARACTER HANDLING TESTS
 * =============================================================================
 *
 * These tests verify that shell metacharacters in user-provided bundling
 * properties are handled correctly and do not cause unexpected behavior.
 *
 * BACKGROUND:
 * The NodejsFunction construct builds an esbuild CLI command from user-provided
 * bundling options. These values must be properly handled to ensure they are
 * passed as literal arguments to esbuild.
 *
 * APPROACH:
 * - Local bundling: Execute esbuild via array-based spawnSync (no shell interpretation)
 * - Docker bundling: Shell-escape all user-provided values before interpolation
 *
 * Each test uses a payload containing `& echo PWNED` which, if not properly handled,
 * would be interpreted as a shell command separator.
 */
describe('shell metacharacter handling', () => {
  const PAYLOAD_WITH_METACHARACTERS = 'foo & echo PWNED';

  /**
   * Helper to create a bundler instance with specific bundling options.
   * Uses a fresh stack to avoid test pollution.
   */
  function createBundlerWithOptions(bundlingOptions: Partial<Parameters<typeof Bundling.bundle>[1]>) {
    const testApp = new App();
    const testStack = new Stack(testApp, 'TestStack');
    return new Bundling(testStack, {
      entry,
      projectRoot,
      depsLockFilePath,
      runtime: STANDARD_RUNTIME,
      architecture: Architecture.X86_64,
      ...bundlingOptions,
    });
  }

  describe('local bundling - esbuild executed without shell interpretation', () => {
    /**
     * For local bundling, esbuild is invoked directly via spawnSync
     * with an array of arguments, bypassing shell interpretation entirely.
     * Shell metacharacters are passed as literal strings to esbuild.
     */

    let spawnSyncMock: jest.SpyInstance;

    beforeEach(() => {
      spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
        status: 0,
        stderr: Buffer.from(''),
        stdout: Buffer.from(''),
        pid: 123,
        output: ['', ''],
        signal: null,
      });
    });

    afterEach(() => {
      spawnSyncMock.mockRestore();
    });

    test('externalModules with shell metacharacters are passed as literal arguments', () => {
      /**
       * externalModules array values are interpolated into --external: flags.
       * With direct execution, esbuild receives the full value as a single argument.
       */
      const bundler = createBundlerWithOptions({
        externalModules: [PAYLOAD_WITH_METACHARACTERS],
      });

      bundler.local?.tryBundle('/outdir', { image: STANDARD_RUNTIME.bundlingImage });

      // Verify esbuild is called directly (not through bash)
      // and the payload appears as a single, uninterpreted argument
      const esbuildCall = spawnSyncMock.mock.calls.find(
        (call: any[]) => call[1]?.some((arg: string) => arg?.includes('--external:')),
      );
      expect(esbuildCall).toBeDefined();

      // The first argument should NOT be 'bash' - esbuild should be invoked directly
      expect(esbuildCall[0]).not.toBe('bash');

      // The payload should appear as a single argument element, not split by shell
      const argsArray = esbuildCall[1] as string[];
      const externalArg = argsArray.find((arg: string) => arg.includes('--external:'));
      expect(externalArg).toBe(`--external:${PAYLOAD_WITH_METACHARACTERS}`);
    });

    test('define keys with shell metacharacters are passed as literal arguments', () => {
      /**
       * define object keys are interpolated into --define: flags.
       * With direct execution, esbuild receives the entire --define flag as a single argument.
       */
      const bundler = createBundlerWithOptions({
        define: {
          [PAYLOAD_WITH_METACHARACTERS]: 'bar',
        },
      });

      bundler.local?.tryBundle('/outdir', { image: STANDARD_RUNTIME.bundlingImage });

      const esbuildCall = spawnSyncMock.mock.calls.find(
        (call: any[]) => call[1]?.some((arg: string) => arg?.includes('--define:')),
      );
      expect(esbuildCall).toBeDefined();
      expect(esbuildCall[0]).not.toBe('bash');

      const argsArray = esbuildCall[1] as string[];
      const defineArg = argsArray.find((arg: string) => arg.includes('--define:'));
      // The key with shell metacharacters should be in a single argument
      expect(defineArg).toContain(PAYLOAD_WITH_METACHARACTERS);
    });

    test('loader keys with shell metacharacters are passed as literal arguments', () => {
      /**
       * loader object keys (file extensions) are interpolated into --loader: flags.
       * With direct execution, esbuild receives the entire --loader flag as a single argument.
       */
      const bundler = createBundlerWithOptions({
        loader: {
          [`.${PAYLOAD_WITH_METACHARACTERS}`]: 'dataurl',
        },
      });

      bundler.local?.tryBundle('/outdir', { image: STANDARD_RUNTIME.bundlingImage });

      const esbuildCall = spawnSyncMock.mock.calls.find(
        (call: any[]) => call[1]?.some((arg: string) => arg?.includes('--loader:')),
      );
      expect(esbuildCall).toBeDefined();
      expect(esbuildCall[0]).not.toBe('bash');

      const argsArray = esbuildCall[1] as string[];
      const loaderArg = argsArray.find((arg: string) => arg.includes('--loader:'));
      expect(loaderArg).toContain(PAYLOAD_WITH_METACHARACTERS);
    });

    test('inject paths with shell metacharacters are passed as literal arguments', () => {
      /**
       * inject array values are interpolated into --inject: flags.
       * With direct execution, esbuild receives the path as a single argument.
       */
      const bundler = createBundlerWithOptions({
        inject: [`./${PAYLOAD_WITH_METACHARACTERS}.js`],
      });

      bundler.local?.tryBundle('/outdir', { image: STANDARD_RUNTIME.bundlingImage });

      const esbuildCall = spawnSyncMock.mock.calls.find(
        (call: any[]) => call[1]?.some((arg: string) => arg?.includes('--inject:')),
      );
      expect(esbuildCall).toBeDefined();
      expect(esbuildCall[0]).not.toBe('bash');

      const argsArray = esbuildCall[1] as string[];
      const injectArg = argsArray.find((arg: string) => arg.includes('--inject:'));
      expect(injectArg).toContain(PAYLOAD_WITH_METACHARACTERS);
    });

    test('esbuildArgs keys with shell metacharacters are passed as literal arguments', () => {
      /**
       * esbuildArgs object keys are used as CLI flags.
       * With direct execution, esbuild receives the flag as a single argument.
       */
      const bundler = createBundlerWithOptions({
        esbuildArgs: {
          [`--log-limit & echo PWNED`]: '0',
        },
      });

      bundler.local?.tryBundle('/outdir', { image: STANDARD_RUNTIME.bundlingImage });

      const esbuildCall = spawnSyncMock.mock.calls.find(
        (call: any[]) => call[1]?.some((arg: string) => arg?.includes('PWNED')),
      );
      expect(esbuildCall).toBeDefined();
      expect(esbuildCall[0]).not.toBe('bash');

      // The key should appear as part of a single argument, not executed
      const argsArray = esbuildCall[1] as string[];
      const metacharArg = argsArray.find((arg: string) => arg.includes('PWNED'));
      expect(metacharArg).toBeDefined();
      // Should not be split - the & should be part of the argument string
      expect(metacharArg).toContain('&');
    });

    test('esbuildArgs values with shell metacharacters are passed as literal arguments', () => {
      /**
       * esbuildArgs object values are used as CLI flag values.
       * With direct execution, esbuild receives the value as part of a single argument.
       */
      const bundler = createBundlerWithOptions({
        esbuildArgs: {
          '--log-limit': `0 & echo PWNED`,
        },
      });

      bundler.local?.tryBundle('/outdir', { image: STANDARD_RUNTIME.bundlingImage });

      const esbuildCall = spawnSyncMock.mock.calls.find(
        (call: any[]) => call[1]?.some((arg: string) => arg?.includes('PWNED')),
      );
      expect(esbuildCall).toBeDefined();
      expect(esbuildCall[0]).not.toBe('bash');

      const argsArray = esbuildCall[1] as string[];
      const metacharArg = argsArray.find((arg: string) => arg.includes('PWNED'));
      expect(metacharArg).toBeDefined();
      expect(metacharArg).toContain('&');
    });
  });

  describe('docker bundling - shell metacharacters are escaped in command string', () => {
    /**
     * For Docker bundling, we must produce a shell command string (Docker runs it via bash -c).
     * All user-provided values are shell-escaped so metacharacters are treated literally.
     *
     * The escaping wraps EACH argument in quotes, so the entire --external:value becomes
     * a single quoted string like '--external:foo & echo PWNED'. The shell treats the
     * entire quoted string as a single argument to esbuild.
     */

    test('externalModules with shell metacharacters are escaped in docker command', () => {
      /**
       * Same as local, but for Docker we need shell escaping.
       * The command string should have the entire argument quoted so the shell
       * treats it as a single literal argument to esbuild.
       */
      Bundling.bundle(stack, {
        entry,
        projectRoot,
        depsLockFilePath,
        runtime: STANDARD_RUNTIME,
        architecture: Architecture.X86_64,
        externalModules: [PAYLOAD_WITH_METACHARACTERS],
        forceDockerBundling: true,
      });

      expect(Code.fromAsset).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          bundling: expect.objectContaining({
            command: expect.arrayContaining([
              'bash',
              '-c',
              // The entire argument is quoted to prevent shell interpretation
              expect.stringContaining(`'--external:${PAYLOAD_WITH_METACHARACTERS}'`),
            ]),
          }),
        }),
      );
    });

    test('define keys with shell metacharacters are escaped in docker command', () => {
      Bundling.bundle(stack, {
        entry,
        projectRoot,
        depsLockFilePath,
        runtime: STANDARD_RUNTIME,
        architecture: Architecture.X86_64,
        define: {
          [PAYLOAD_WITH_METACHARACTERS]: 'bar',
        },
        forceDockerBundling: true,
      });

      expect(Code.fromAsset).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          bundling: expect.objectContaining({
            command: expect.arrayContaining([
              'bash',
              '-c',
              // The entire --define argument is quoted
              expect.stringContaining(`'--define:${PAYLOAD_WITH_METACHARACTERS}="bar"'`),
            ]),
          }),
        }),
      );
    });

    test('loader keys with shell metacharacters are escaped in docker command', () => {
      Bundling.bundle(stack, {
        entry,
        projectRoot,
        depsLockFilePath,
        runtime: STANDARD_RUNTIME,
        architecture: Architecture.X86_64,
        loader: {
          [`.${PAYLOAD_WITH_METACHARACTERS}`]: 'dataurl',
        },
        forceDockerBundling: true,
      });

      expect(Code.fromAsset).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          bundling: expect.objectContaining({
            command: expect.arrayContaining([
              'bash',
              '-c',
              // The entire --loader argument is quoted
              expect.stringContaining(`'--loader:.${PAYLOAD_WITH_METACHARACTERS}=dataurl'`),
            ]),
          }),
        }),
      );
    });

    test('inject paths with shell metacharacters are escaped in docker command', () => {
      Bundling.bundle(stack, {
        entry,
        projectRoot,
        depsLockFilePath,
        runtime: STANDARD_RUNTIME,
        architecture: Architecture.X86_64,
        inject: [`./${PAYLOAD_WITH_METACHARACTERS}.js`],
        forceDockerBundling: true,
      });

      expect(Code.fromAsset).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          bundling: expect.objectContaining({
            command: expect.arrayContaining([
              'bash',
              '-c',
              // The entire --inject argument is quoted
              expect.stringContaining(`'--inject:./${PAYLOAD_WITH_METACHARACTERS}.js'`),
            ]),
          }),
        }),
      );
    });

    test('esbuildArgs with shell metacharacters are escaped in docker command', () => {
      Bundling.bundle(stack, {
        entry,
        projectRoot,
        depsLockFilePath,
        runtime: STANDARD_RUNTIME,
        architecture: Architecture.X86_64,
        esbuildArgs: {
          '--log-limit': `0 & echo PWNED`,
        },
        forceDockerBundling: true,
      });

      expect(Code.fromAsset).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          bundling: expect.objectContaining({
            command: expect.arrayContaining([
              'bash',
              '-c',
              // The entire argument is quoted
              expect.stringContaining("'--log-limit=0 & echo PWNED'"),
            ]),
          }),
        }),
      );
    });
  });
});
