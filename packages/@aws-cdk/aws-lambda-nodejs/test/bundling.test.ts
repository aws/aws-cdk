import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Code, Runtime } from '@aws-cdk/aws-lambda';
import { AssetHashType, BundlingDockerImage } from '@aws-cdk/core';
import { version as delayVersion } from 'delay/package.json';
import { LocalBundler, Installer, LockFile } from '../lib/bundlers';
import { Bundling } from '../lib/bundling';
import * as util from '../lib/util';

jest.mock('@aws-cdk/aws-lambda');
const writeFileSyncMock = jest.spyOn(fs, 'writeFileSync').mockReturnValue();
const existsSyncOriginal = fs.existsSync;
const existsSyncMock = jest.spyOn(fs, 'existsSync');
const originalFindUp = util.findUp;
const findUpMock = jest.spyOn(util, 'findUp').mockImplementation((name: string, directory) => {
  if (name === 'package.json') {
    return path.join(__dirname, '..');
  }
  return originalFindUp(name, directory);
});
const fromAssetMock = jest.spyOn(BundlingDockerImage, 'fromAsset');

beforeEach(() => {
  jest.clearAllMocks();
});

test('Parcel bundling', () => {
  Bundling.parcel({
    entry: '/project/folder/entry.ts',
    runtime: Runtime.NODEJS_12_X,
    cacheDir: 'cache-dir',
    projectRoot: '/project',
    parcelEnvironment: {
      KEY: 'value',
    },
  });

  // Correctly bundles with parcel
  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.BUNDLE,
    bundling: expect.objectContaining({
      local: {
        props: expect.objectContaining({
          projectRoot: '/project',
        }),
      },
      environment: {
        KEY: 'value',
      },
      workingDirectory: '/asset-input/folder',
      command: [
        'bash', '-c',
        [
          '$(node -p "require.resolve(\'parcel\')") build /asset-input/folder/entry.ts --target cdk-lambda --dist-dir /asset-output --no-autoinstall --no-scope-hoist --cache-dir /asset-input/cache-dir',
          'mv /asset-output/entry.js /asset-output/index.js',
        ].join(' && '),
      ],
    }),
  });

  // Correctly updates package.json
  const call = writeFileSyncMock.mock.calls[0];
  expect(call[0]).toMatch('package.json');
  expect(JSON.parse(call[1])).toEqual(expect.objectContaining({
    targets: {
      'cdk-lambda': {
        context: 'node',
        includeNodeModules: {
          'aws-sdk': false,
        },
        sourceMap: false,
        minify: false,
        engines: {
          node: '>= 12',
        },
      },
    },
  }));

  // Searches for the package.json starting in the directory of the entry file
  expect(findUpMock).toHaveBeenCalledWith('package.json', '/project/folder');
});

test('Parcel bundling with handler named index.ts', () => {
  Bundling.parcel({
    entry: '/project/folder/index.ts',
    runtime: Runtime.NODEJS_12_X,
    projectRoot: '/project',
  });

  // Correctly bundles with parcel
  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.BUNDLE,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        '$(node -p "require.resolve(\'parcel\')") build /asset-input/folder/index.ts --target cdk-lambda --dist-dir /asset-output --no-autoinstall --no-scope-hoist',
      ],
    }),
  });
});

test('Parcel with Windows paths', () => {
  Bundling.parcel({
    entry: 'C:\\my-project\\lib\\entry.ts',
    runtime: Runtime.NODEJS_12_X,
    projectRoot: 'C:\\my-project',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('C:\\my-project', expect.objectContaining({
    bundling: expect.objectContaining({
      command: expect.arrayContaining([
        expect.stringContaining('/lib/entry.ts'),
      ]),
    }),
  }));
});

test('Parcel bundling with externals and dependencies', () => {
  Bundling.parcel({
    entry: '/project/folder/entry.ts',
    runtime: Runtime.NODEJS_12_X,
    projectRoot: '/project',
    externalModules: ['abc'],
    nodeModules: ['delay'],
  });

  // Correctly bundles with parcel
  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.BUNDLE,
    bundling: expect.objectContaining({
      command: [
        'bash', '-c',
        [
          '$(node -p "require.resolve(\'parcel\')") build /asset-input/folder/entry.ts --target cdk-lambda --dist-dir /asset-output --no-autoinstall --no-scope-hoist',
          'mv /asset-output/entry.js /asset-output/index.js',
          `echo \'{\"dependencies\":{\"delay\":\"${delayVersion}\"}}\' > /asset-output/package.json`,
          'cd /asset-output',
          'npm install',
        ].join(' && '),
      ],
    }),
  });

  // Correctly updates package.json
  const call = writeFileSyncMock.mock.calls[0];
  expect(call[0]).toMatch('package.json');
  expect(JSON.parse(call[1])).toEqual(expect.objectContaining({
    targets: expect.objectContaining({
      'cdk-lambda': expect.objectContaining({
        includeNodeModules: {
          delay: false,
          abc: false,
        },
      }),
    }),
  }));
});

test('Detects yarn.lock', () => {
  existsSyncMock.mockImplementation((p: fs.PathLike) => {
    if (/yarn.lock/.test(p.toString())) {
      return true;
    }
    return existsSyncOriginal(p);
  });

  Bundling.parcel({
    entry: '/project/folder/entry.ts',
    runtime: Runtime.NODEJS_12_X,
    projectRoot: '/project',
    nodeModules: ['delay'],
  });

  // Correctly bundles with parcel
  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.BUNDLE,
    bundling: expect.objectContaining({
      command: expect.arrayContaining([
        expect.stringMatching(/yarn\.lock.+yarn install/),
      ]),
    }),
  });
});

test('with Docker build args', () => {
  Bundling.parcel({
    entry: '/project/folder/entry.ts',
    runtime: Runtime.NODEJS_12_X,
    projectRoot: '/project',
    buildArgs: {
      HELLO: 'WORLD',
    },
    forceDockerBundling: true,
  });

  expect(fromAssetMock).toHaveBeenCalledWith(expect.stringMatching(/parcel$/), expect.objectContaining({
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

  const bundler = new LocalBundler({
    installer: Installer.NPM,
    projectRoot: '/project',
    relativeEntryPath: 'folder/entry.ts',
    dependencies: {
      dep: 'version',
    },
    environment: {
      KEY: 'value',
    },
    lockFile: LockFile.NPM,
  });

  bundler.tryBundle('/outdir');

  expect(spawnSyncMock).toHaveBeenCalledWith(
    'bash', [
      '-c',
      [
        '$(node -p \"require.resolve(\'parcel\')\") build /project/folder/entry.ts --target cdk-lambda --dist-dir /outdir --no-autoinstall --no-scope-hoist',
        'mv /outdir/entry.js /outdir/index.js',
        'echo \'{\"dependencies\":{\"dep\":\"version\"}}\' > /outdir/package.json',
        'cp /project/package-lock.json /outdir/package-lock.json',
        'cd /outdir',
        'npm install',
      ].join(' && '),
    ],
    expect.objectContaining({
      env: expect.objectContaining({ KEY: 'value' }),
    }),
  );

  // Docker image is not built
  expect(fromAssetMock).not.toHaveBeenCalled();
});
