
import * as fs from 'fs';
import * as path from 'path';
import { Code, Runtime } from '@aws-cdk/aws-lambda';
import { AssetHashType, BundlingDockerImage } from '@aws-cdk/core';
import { version as delayVersion } from 'delay/package.json';
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
    cacheDir: '/cache-dir',
    projectRoot: '/project',
    parcelEnvironment: {
      KEY: 'value',
    },
  });

  // Correctly bundles with parcel
  expect(Code.fromAsset).toHaveBeenCalledWith('/project', {
    assetHashType: AssetHashType.BUNDLE,
    bundling: expect.objectContaining({
      environment: {
        KEY: 'value',
      },
      volumes: [{ containerPath: '/parcel-cache', hostPath: '/cache-dir' }],
      workingDirectory: '/asset-input/folder',
      command: [
        'bash', '-c',
        '$(node -p "require.resolve(\'parcel\')") build /asset-input/folder/entry.ts --target cdk-lambda --no-autoinstall --no-scope-hoist --cache-dir /parcel-cache',
      ],
    }),
  });

  // Correctly updates package.json
  const call = writeFileSyncMock.mock.calls[0];
  expect(call[0]).toMatch('package.json');
  expect(JSON.parse(call[1])).toEqual(expect.objectContaining({
    'cdk-lambda': '/asset-output/index.js',
    'targets': {
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

test('Parcel with Windows paths', () => {
  Bundling.parcel({
    entry: 'C:\\my-project\\lib\\entry.ts',
    runtime: Runtime.NODEJS_12_X,
    cacheDir: '/cache-dir',
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
        '$(node -p "require.resolve(\'parcel\')") build /asset-input/folder/entry.ts --target cdk-lambda --no-autoinstall --no-scope-hoist && mv /asset-input/.package.json /asset-output/package.json && cd /asset-output && npm install',
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

  // Correctly writes dummy package.json
  expect(writeFileSyncMock).toHaveBeenCalledWith('/project/.package.json', JSON.stringify({
    dependencies: {
      delay: delayVersion,
    },
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

test('with build args', () => {
  Bundling.parcel({
    entry: '/project/folder/entry.ts',
    runtime: Runtime.NODEJS_12_X,
    projectRoot: '/project',
    buildArgs: {
      HELLO: 'WORLD',
    },
  });

  expect(fromAssetMock).toHaveBeenCalledWith(expect.stringMatching(/parcel$/), expect.objectContaining({
    buildArgs: expect.objectContaining({
      HELLO: 'WORLD',
    }),
  }));
});
