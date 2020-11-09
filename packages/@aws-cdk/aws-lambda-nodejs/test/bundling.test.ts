import * as child_process from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Code, Runtime } from '@aws-cdk/aws-lambda';
import { AssetHashType, BundlingDockerImage } from '@aws-cdk/core';
import { version as delayVersion } from 'delay/package.json';
import { Bundling } from '../lib/bundling';
import { EsBuildBundler, LockFile } from '../lib/esbuild-bundler';
import * as util from '../lib/util';

jest.mock('@aws-cdk/aws-lambda');

// Mock BundlingDockerImage.fromAsset() to avoid building the image
const fromAssetMock = jest.spyOn(BundlingDockerImage, 'fromAsset').mockReturnValue({
  image: 'built-image',
  cp: () => {},
  run: () => {},
  toJSON: () => 'built-image',
});

const originalFindUp = util.findUp;

let spawnSyncMock = jest.spyOn(child_process, 'spawnSync');
let findUpMock: jest.SpyInstance;
beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  spawnSyncMock.mockRestore();
  findUpMock = jest.spyOn(util, 'findUp').mockImplementation((name: string, directory) => {
    if (name === 'package.json') {
      return path.join(__dirname, '..');
    }
    return originalFindUp(name, directory);
  });
  EsBuildBundler.clearRunsLocallyCache();
  Bundling.clearProjectRootCache();
});

test('esbuild bundling in Docker', () => {
  Bundling.esbuild({
    entry: '/project/folder/entry.ts',
    runtime: Runtime.NODEJS_12_X,
    projectRoot: '/project',
    bundlingEnvironment: {
      KEY: 'value',
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
        'npx esbuild --bundle /asset-input/folder/entry.ts --target=es2017 --platform=node --outfile=/asset-output/index.js --external:aws-sdk',
      ],
    }),
  });
});

test('esbuild bundling with handler named index.ts', () => {
  Bundling.esbuild({
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
        'npx esbuild --bundle /asset-input/folder/index.ts --target=es2017 --platform=node --outfile=/asset-output/index.js --external:aws-sdk',
      ],
    }),
  });
});

test('esbuild bundling with tsx handler', () => {
  Bundling.esbuild({
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
        'npx esbuild --bundle /asset-input/folder/handler.tsx --target=es2017 --platform=node --outfile=/asset-output/index.js --external:aws-sdk',
      ],
    }),
  });
});

test('esbuild with Windows paths', () => {
  const osPlatformMock = jest.spyOn(os, 'platform').mockReturnValue('win32');

  Bundling.esbuild({
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
  Bundling.esbuild({
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
          'npx esbuild --bundle /asset-input/test/bundling.test.js --target=es2017 --platform=node --outfile=/asset-output/index.js --external:abc --external:delay',
          `echo \'{\"dependencies\":{\"delay\":\"${delayVersion}\"}}\' > /asset-output/package.json`,
          'cd /asset-output',
          'npm install',
        ].join(' && '),
      ],
    }),
  });

  // Searches for the package.json starting in the directory of the entry file
  expect(findUpMock).toHaveBeenCalledWith('package.json', path.dirname(entry));
});

test('Detects yarn.lock', () => {
  const existsSyncOriginal = fs.existsSync;
  const existsSyncMock = jest.spyOn(fs, 'existsSync');

  existsSyncMock.mockImplementationOnce((p: fs.PathLike) => {
    if (/yarn.lock/.test(p.toString())) {
      return true;
    }
    return existsSyncOriginal(p);
  });

  Bundling.esbuild({
    entry: '/project/folder/entry.ts',
    runtime: Runtime.NODEJS_12_X,
    projectRoot: '/project',
    nodeModules: ['delay'],
    forceDockerBundling: true,
  });

  // Correctly bundles with esbuild
  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
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
  Bundling.esbuild({
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
  spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('0.8.3'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  });

  const bundler = new EsBuildBundler({
    runtime: Runtime.NODEJS_12_X,
    projectRoot: __dirname,
    entry: `${__dirname}/folder/entry.ts`,
    environment: {
      KEY: 'value',
    },
  });

  expect(bundler.local).toBeDefined();

  bundler.local?.tryBundle('/outdir', { image: Runtime.NODEJS_12_X.bundlingDockerImage });

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
});

test('LocalBundler.runsLocally checks esbuild version and caches results', () => {
  spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('0.8.3'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  });

  expect(EsBuildBundler.runsLocally).toBe(true);
  expect(EsBuildBundler.runsLocally).toBe(true);
  expect(spawnSyncMock).toHaveBeenCalledTimes(1);
  expect(spawnSyncMock).toHaveBeenCalledWith(expect.stringContaining('npx'), ['--no-install', 'esbuild', '--version']);
});

test('LocalBundler.runsLocally with incorrect esbuild version', () => {
  spawnSyncMock = jest.spyOn(child_process, 'spawnSync').mockReturnValue({
    status: 0,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('3.5.1'),
    pid: 123,
    output: ['stdout', 'stderr'],
    signal: null,
  });

  expect(EsBuildBundler.runsLocally).toBe(false);
});

test('Project root detection', () => {
  findUpMock.mockImplementation(() => undefined);

  expect(() => Bundling.esbuild({
    entry: '/project/folder/entry.ts',
    runtime: Runtime.NODEJS_12_X,
  })).toThrow(/Cannot find project root/);

  expect(findUpMock).toHaveBeenNthCalledWith(1, `.git${path.sep}`);
  expect(findUpMock).toHaveBeenNthCalledWith(2, LockFile.YARN);
  expect(findUpMock).toHaveBeenNthCalledWith(3, LockFile.NPM);
  expect(findUpMock).toHaveBeenNthCalledWith(4, 'package.json');
});

test('Custom bundling docker image', () => {
  Bundling.esbuild({
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
