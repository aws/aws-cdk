import * as child_process from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Code, Runtime } from '@aws-cdk/aws-lambda';
import { AssetHashType, BundlingDockerImage } from '@aws-cdk/core';
import { version as delayVersion } from 'delay/package.json';
import { Bundling } from '../lib/bundling';
import * as util from '../lib/util';

jest.mock('@aws-cdk/aws-lambda');

// Mock BundlingDockerImage.fromAsset() to avoid building the image
let fromAssetMock = jest.spyOn(BundlingDockerImage, 'fromAsset');
let getEsBuildVersionMock = jest.spyOn(util, 'getEsBuildVersion');
beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  Bundling.clearRunsLocallyCache();
  Bundling.clearLockFileCache();
  getEsBuildVersionMock.mockReturnValue('0.8.8');
  fromAssetMock.mockReturnValue({
    image: 'built-image',
    cp: () => {},
    run: () => {},
    toJSON: () => 'built-image',
  });
});

test('esbuild bundling in Docker', () => {
  Bundling.bundle({
    entry: '/project/folder/entry.ts',
    runtime: Runtime.NODEJS_12_X,
    projectRoot: '/project',
    bundlingEnvironment: {
      KEY: 'value',
    },
    loader: {
      '.png': 'dataurl',
    },
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      environment: {
        KEY: 'value',
      },
      command: [
        'bash', '-c',
        'npx esbuild --bundle /asset-input/folder/entry.ts --target=node12 --platform=node --outfile=/asset-output/index.js --external:aws-sdk --loader:.png=dataurl',
      ],
    }),
  });
});

test('esbuild bundling with handler named index.ts', () => {
  Bundling.bundle({
    entry: '/project/folder/index.ts',
    runtime: Runtime.NODEJS_12_X,
    projectRoot: '/project',
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'npx esbuild --bundle /asset-input/folder/index.ts --target=node12 --platform=node --outfile=/asset-output/index.js --external:aws-sdk',
      ],
    }),
  });
});

test('esbuild bundling with tsx handler', () => {
  Bundling.bundle({
    entry: '/project/folder/handler.tsx',
    runtime: Runtime.NODEJS_12_X,
    projectRoot: '/project',
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        'npx esbuild --bundle /asset-input/folder/handler.tsx --target=node12 --platform=node --outfile=/asset-output/index.js --external:aws-sdk',
      ],
    }),
  });
});

test('esbuild with Windows paths', () => {
  const osPlatformMock = jest.spyOn(os, 'platform').mockReturnValue('win32');

  Bundling.bundle({
    entry: 'C:\\my-project\\lib\\entry.ts',
    runtime: Runtime.NODEJS_12_X,
    projectRoot: 'C:\\my-project',
    forceDockerBundling: true,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('C:\\my-project', expect.objectContaining({
    bundling: expect.objectContaining({
      command: expect.arrayContaining([
        expect.stringContaining('/lib/entry.ts'),
      ]),
    }),
  }));

  osPlatformMock.mockRestore();
});

test('esbuild bundling with externals and dependencies', () => {
  const projectRoot = path.join(__dirname, '..');
  const entry = __filename;
  Bundling.bundle({
    entry,
    runtime: Runtime.NODEJS_12_X,
    projectRoot,
    externalModules: ['abc'],
    nodeModules: ['delay'],
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(projectRoot, {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          'npx esbuild --bundle /asset-input/test/bundling.test.js --target=node12 --platform=node --outfile=/asset-output/index.js --external:abc --external:delay',
          `echo \'{\"dependencies\":{\"delay\":\"${delayVersion}\"}}\' > /asset-output/package.json`,
          'cd /asset-output',
          'npm install',
        ].join(' && '),
      ],
    }),
  });
});

test('Detects yarn.lock', () => {
  const projectRoot = path.join(__dirname, '..');
  const entry = __filename;

  const existsSyncOriginal = fs.existsSync;
  const existsSyncMock = jest.spyOn(fs, 'existsSync');

  existsSyncMock.mockImplementation((p: fs.PathLike) => {
    if (/yarn.lock/.test(p.toString())) {
      return true;
    }
    return existsSyncOriginal(p);
  });

  Bundling.bundle({
    entry,
    runtime: Runtime.NODEJS_12_X,
    projectRoot,
    nodeModules: ['delay'],
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith(projectRoot, {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      command: expect.arrayContaining([
        expect.stringMatching(/yarn\.lock.+yarn install/),
      ]),
    }),
  });

  existsSyncMock.mockRestore();
});

test('with Docker build args', () => {
  Bundling.bundle({
    entry: '/project/folder/entry.ts',
    runtime: Runtime.NODEJS_12_X,
    projectRoot: '/project',
    buildArgs: {
      HELLO: 'WORLD',
    },
    forceDockerBundling: true,
  });

  expect(fromAssetMock).toHaveBeenCalledWith(expect.stringMatching(/lib$/), expect.objectContaining({
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

  const bundler = new Bundling({
    runtime: Runtime.NODEJS_12_X,
    projectRoot: __dirname,
    entry: `${__dirname}/folder/entry.ts`,
    bundlingEnvironment: {
      KEY: 'value',
    },
  });

  expect(bundler.local).toBeDefined();

  const tryBundle = bundler.local?.tryBundle('/outdir', { image: Runtime.NODEJS_12_X.bundlingDockerImage });
  expect(tryBundle).toBe(true);

  expect(spawnSyncMock).toHaveBeenCalledWith(
    'bash',
    expect.arrayContaining(['-c', expect.stringContaining(__dirname)]),
    expect.objectContaining({
      env: expect.objectContaining({ KEY: 'value' }),
      cwd: expect.stringContaining(path.join(__dirname, 'folder')),
    }),
  );

  // Docker image is not built
  expect(fromAssetMock).not.toHaveBeenCalled();

  spawnSyncMock.mockRestore();
});


test('Incorrect esbuild version', () => {
  getEsBuildVersionMock.mockReturnValueOnce('3.4.5');

  const bundler = new Bundling({
    runtime: Runtime.NODEJS_12_X,
    projectRoot: __dirname,
    entry: `${__dirname}/folder/entry.ts`,
  });

  const tryBundle = bundler.local?.tryBundle('/outdir', { image: Runtime.NODEJS_12_X.bundlingDockerImage });
  expect(tryBundle).toBe(false);
});

test('Custom bundling docker image', () => {
  Bundling.bundle({
    entry: '/project/folder/entry.ts',
    projectRoot: '/project',
    runtime: Runtime.NODEJS_12_X,
    bundlingDockerImage: BundlingDockerImage.fromRegistry('my-custom-image'),
    forceDockerBundling: true,
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.OUTPUT,
    bundling: expect.objectContaining({
      image: { image: 'my-custom-image' },
    }),
  });
});
