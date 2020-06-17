
import { Code } from '@aws-cdk/aws-lambda';
import { AssetHashType } from '@aws-cdk/core';
import * as fs from 'fs';
import { Bundling } from '../lib/bundling';

jest.mock('@aws-cdk/aws-lambda');
const writeFileSyncMock = jest.spyOn(fs, 'writeFileSync');

beforeEach(() => {
  jest.clearAllMocks();
});

test('Parcel bundling', () => {
  Bundling.parcel({
    entry: '/project/folder/entry.ts',
    global: 'handler',
    cacheDir: '/cache-dir',
    nodeDockerTag: 'lts-alpine',
    nodeVersion: '12',
    projectRoot: '/project',
    environment: {
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
        'parcel', 'build', '/asset-input/folder/entry.ts',
        '--out-dir', '/asset-output',
        '--out-file', 'index.js',
        '--global', 'handler',
        '--target', 'node',
        '--bundle-node-modules',
        '--log-level', '2',
        '--no-minify',
        '--no-source-maps',
        '--cache-dir', '/parcel-cache',
      ],
    }),
  });

  // Correctly updates package.json
  expect(writeFileSyncMock).toHaveBeenCalledWith(
    expect.stringContaining('package.json'),
    expect.stringContaining('"node": ">= 12"'),
  );
});

test('Parcel with Windows paths', () => {
  Bundling.parcel({
    entry: 'C:\\my-project\\lib\\entry.ts',
    global: 'handler',
    cacheDir: '/cache-dir',
    nodeDockerTag: 'lts-alpine',
    nodeVersion: '12',
    projectRoot: 'C:\\my-project',
  });

  expect(Code.fromAsset).toHaveBeenCalledWith('C:\\my-project', expect.objectContaining({
    bundling: expect.objectContaining({
      command: expect.arrayContaining([
        'parcel', 'build', expect.stringContaining('/lib/entry.ts'),
      ]),
    }),
  }));
});
