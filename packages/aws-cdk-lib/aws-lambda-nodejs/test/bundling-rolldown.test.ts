/* eslint-disable @typescript-eslint/unbound-method */
import * as child_process from 'child_process';
import * as path from 'path';
import { Architecture, Code, Runtime } from '../../aws-lambda';
import { App, AssetHashType, DockerImage, Stack } from '../../core';
import { Bundling } from '../lib/bundling';
import { PackageInstallation } from '../lib/package-installation';
import { Bundler, OutputFormat } from '../lib/types';

const STANDARD_RUNTIME = Runtime.NODEJS_18_X;
const STANDARD_EXTERNAL = '@aws-sdk/*';

let detectPackageInstallationMock: jest.SpyInstance<PackageInstallation | undefined>;
const app = new App();
const stack = new Stack(app, 'MyTestStack');

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
  Bundling.clearEsbuildInstallationCache();
  Bundling.clearRolldownInstallationCache();
  Bundling.clearTscInstallationCache();

  jest.spyOn(Code, 'fromAsset');

  detectPackageInstallationMock = jest.spyOn(PackageInstallation, 'detect').mockReturnValue({
    isLocal: true,
    version: '0.15.0',
  });

  jest.spyOn(DockerImage, 'fromBuild').mockReturnValue({
    image: 'built-image',
    cp: () => 'dest-path',
    run: () => {},
    toJSON: () => 'built-image',
  });
});

const projectRoot = '/project';
const depsLockFilePath = '/project/yarn.lock';
const entry = '/project/lib/handler.ts';

describe('rolldown bundler', () => {
  test('rolldown bundling in Docker', () => {
    Bundling.bundle(stack, {
      entry,
      projectRoot,
      depsLockFilePath,
      runtime: STANDARD_RUNTIME,
      architecture: Architecture.X86_64,
      bundler: Bundler.ROLLDOWN,
      environment: {
        KEY: 'value',
      },
      loader: {
        '.png': 'dataurl',
      },
      forceDockerBundling: true,
      network: 'host',
    });

    // Correctly bundles with rolldown
    expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
      assetHashType: AssetHashType.OUTPUT,
      bundling: expect.objectContaining({
        environment: {
          KEY: 'value',
        },
        command: [
          'bash', '-c',
          expect.stringContaining('rolldown "/asset-input/lib/handler.ts" -o "/asset-output/index.js" -p node'),
        ],
        workingDirectory: '/',
      }),
    });

    expect(DockerImage.fromBuild).toHaveBeenCalledWith(expect.stringMatching(/aws-lambda-nodejs\/lib$/), expect.objectContaining({
      buildArgs: expect.objectContaining({
        IMAGE: expect.stringMatching(/build-nodejs/),
        ROLLDOWN_VERSION: expect.any(String),
      }),
      platform: 'linux/amd64',
      network: 'host',
    }));
  });

  test('rolldown bundling with minify', () => {
    Bundling.bundle(stack, {
      entry,
      projectRoot,
      depsLockFilePath,
      runtime: STANDARD_RUNTIME,
      architecture: Architecture.X86_64,
      bundler: Bundler.ROLLDOWN,
      minify: true,
      forceDockerBundling: true,
    });

    expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
      assetHashType: AssetHashType.OUTPUT,
      bundling: expect.objectContaining({
        command: [
          'bash', '-c',
          expect.stringContaining('-m'),
        ],
      }),
    });
  });

  test('rolldown bundling with sourcemap', () => {
    Bundling.bundle(stack, {
      entry,
      projectRoot,
      depsLockFilePath,
      runtime: STANDARD_RUNTIME,
      architecture: Architecture.X86_64,
      bundler: Bundler.ROLLDOWN,
      sourceMap: true,
      forceDockerBundling: true,
    });

    expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
      assetHashType: AssetHashType.OUTPUT,
      bundling: expect.objectContaining({
        command: [
          'bash', '-c',
          expect.stringContaining('--sourcemap'),
        ],
      }),
    });
  });

  test('rolldown bundling with externals', () => {
    Bundling.bundle(stack, {
      entry,
      projectRoot,
      depsLockFilePath,
      runtime: STANDARD_RUNTIME,
      architecture: Architecture.X86_64,
      bundler: Bundler.ROLLDOWN,
      externalModules: ['aws-sdk'],
      forceDockerBundling: true,
    });

    expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
      assetHashType: AssetHashType.OUTPUT,
      bundling: expect.objectContaining({
        command: [
          'bash', '-c',
          expect.stringContaining('-e aws-sdk'),
        ],
      }),
    });
  });

  test('rolldown bundling with custom rolldownArgs', () => {
    Bundling.bundle(stack, {
      entry,
      projectRoot,
      depsLockFilePath,
      runtime: STANDARD_RUNTIME,
      architecture: Architecture.X86_64,
      bundler: Bundler.ROLLDOWN,
      rolldownArgs: {
        '--log-level': 'debug',
      },
      forceDockerBundling: true,
    });

    expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
      assetHashType: AssetHashType.OUTPUT,
      bundling: expect.objectContaining({
        command: [
          'bash', '-c',
          expect.stringContaining('--log-level="debug"'),
        ],
      }),
    });
  });

  test('rolldown bundling with ESM format', () => {
    Bundling.bundle(stack, {
      entry,
      projectRoot,
      depsLockFilePath,
      runtime: STANDARD_RUNTIME,
      architecture: Architecture.X86_64,
      bundler: Bundler.ROLLDOWN,
      format: OutputFormat.ESM,
      forceDockerBundling: true,
    });

    expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
      assetHashType: AssetHashType.OUTPUT,
      bundling: expect.objectContaining({
        command: [
          'bash', '-c',
          expect.stringContaining('-f esm') && expect.stringContaining('index.mjs'),
        ],
      }),
    });
  });

  test('rolldown local bundling', () => {
    const spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
      status: 0,
      stderr: Buffer.from('stderr'),
      stdout: Buffer.from('stdout'),
      pid: 123,
      output: ['stdout', 'stderr'],
      signal: null,
    });

    const bundler = Bundling.bundle(stack, {
      entry: __filename,
      projectRoot: path.dirname(depsLockFilePath),
      depsLockFilePath,
      runtime: STANDARD_RUNTIME,
      architecture: Architecture.X86_64,
      bundler: Bundler.ROLLDOWN,
    });

    expect(bundler).toBeDefined();
    expect(spawnSyncMock).toHaveBeenCalledWith(
      expect.stringMatching(/bash|cmd/),
      expect.arrayContaining([expect.stringMatching(/-c|\/c/), expect.stringContaining('rolldown')]),
      expect.objectContaining({
        env: expect.anything(),
        cwd: expect.any(String),
      }),
    );

    spawnSyncMock.mockRestore();
  });

  test('rolldown bundling with define', () => {
    Bundling.bundle(stack, {
      entry,
      projectRoot,
      depsLockFilePath,
      runtime: STANDARD_RUNTIME,
      architecture: Architecture.X86_64,
      bundler: Bundler.ROLLDOWN,
      define: {
        'process.env.DEBUG': 'true',
      },
      forceDockerBundling: true,
    });

    expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
      assetHashType: AssetHashType.OUTPUT,
      bundling: expect.objectContaining({
        command: [
          'bash', '-c',
          expect.stringContaining('--define process.env.DEBUG='),
        ],
      }),
    });
  });

  test('rolldown bundling with banner and footer', () => {
    Bundling.bundle(stack, {
      entry,
      projectRoot,
      depsLockFilePath,
      runtime: STANDARD_RUNTIME,
      architecture: Architecture.X86_64,
      bundler: Bundler.ROLLDOWN,
      banner: '/* banner */',
      footer: '/* footer */',
      forceDockerBundling: true,
    });

    expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
      assetHashType: AssetHashType.OUTPUT,
      bundling: expect.objectContaining({
        command: [
          'bash', '-c',
          expect.stringContaining('--banner') && expect.stringContaining('--footer'),
        ],
      }),
    });
  });

  test('esbuild is default when bundler not specified', () => {
    Bundling.bundle(stack, {
      entry,
      projectRoot,
      depsLockFilePath,
      runtime: STANDARD_RUNTIME,
      architecture: Architecture.X86_64,
      forceDockerBundling: true,
    });

    expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
      assetHashType: AssetHashType.OUTPUT,
      bundling: expect.objectContaining({
        command: [
          'bash', '-c',
          expect.stringContaining('esbuild'),
        ],
      }),
    });

    expect(Code.fromAsset).not.toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
      assetHashType: AssetHashType.OUTPUT,
      bundling: expect.objectContaining({
        command: [
          'bash', '-c',
          expect.stringContaining('rolldown'),
        ],
      }),
    });
  });

  test('rolldown bundling with loaders', () => {
    Bundling.bundle(stack, {
      entry,
      projectRoot,
      depsLockFilePath,
      runtime: STANDARD_RUNTIME,
      architecture: Architecture.X86_64,
      bundler: Bundler.ROLLDOWN,
      loader: {
        '.png': 'dataurl',
        '.svg': 'file',
      },
      forceDockerBundling: true,
    });

    expect(Code.fromAsset).toHaveBeenCalledWith(path.dirname(depsLockFilePath), {
      assetHashType: AssetHashType.OUTPUT,
      bundling: expect.objectContaining({
        command: [
          'bash', '-c',
          expect.stringContaining('--module-types .png=dataurl') && expect.stringContaining('--module-types .svg=file'),
        ],
      }),
    });
  });
});

