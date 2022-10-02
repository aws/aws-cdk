jest.mock('child_process');

import * as child_process from 'child_process';
import { Manifest } from '@aws-cdk/cloud-assembly-schema';
import * as mockfs from 'mock-fs';
import { AssetPublishing, AssetManifest } from '../lib';
import { mockAws, mockedApiResult, mockUpload } from './mock-aws';

const DEFAULT_DESTINATION = {
  region: 'us-north-50',
  assumeRoleArn: 'arn:aws:role',
  bucketName: 'some_bucket',
  objectKey: 'some_key',
};

let aws: ReturnType<typeof mockAws>;
beforeEach(() => {
  jest.resetAllMocks();

  mockfs({
    '/bundlable/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      files: {
        theAsset: {
          source: {
            path: 'some_file',
            packaging: 'zip',
            bundling: {
              image: 'node:14',
            },
          },
          destinations: { theDestination: DEFAULT_DESTINATION },
        },
      },
    }),
  });

  aws = mockAws();
});

afterEach(() => {
  mockfs.restore();
});

function getSpawnSyncReturn(status: number, output=['mock output']): child_process.SpawnSyncReturns<string | Buffer> {
  return {
    status,
    stderr: Buffer.from('stderr'),
    stdout: Buffer.from('stdout'),
    pid: 123,
    output,
    signal: null,
  };
}

describe('bundlable assets', () => {
  test('bundle correctly within container', async () => {
    const pub = new AssetPublishing(AssetManifest.fromPath('/bundlable/cdk.out'), { aws });
    aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: undefined });
    aws.mockS3.upload = mockUpload();
    jest.spyOn(child_process, 'spawnSync').mockImplementation((command: string, args?: readonly string[], _options?: child_process.SpawnSyncOptions) => {
      if (command === 'selinuxenabled') {
        return getSpawnSyncReturn(0, ['selinuxenabled output', 'stderr']);
      } else if (command === 'docker' && args) {
        if (args[0] === 'run') {
          // Creation of asset by running the image
          return getSpawnSyncReturn(0, ['Bundling started', 'Bundling done']);
        }
      }
      return getSpawnSyncReturn(127, ['FAIL']);
    });

    await pub.publish();

    expect(aws.mockS3.upload).toHaveBeenCalledWith(expect.objectContaining({
      Bucket: 'some_bucket',
      Key: 'some_key',
    }));
  });

  test('fails if container run returns an error', async () => {
    const pub = new AssetPublishing(AssetManifest.fromPath('/bundlable/cdk.out'), { aws });
    jest.spyOn(child_process, 'spawnSync').mockImplementation((command: string, args?: readonly string[], _options?: child_process.SpawnSyncOptions) => {
      if (command === 'selinuxenabled') {
        return getSpawnSyncReturn(0, ['selinuxenabled output', 'stderr']);
      } else if (command === 'docker' && args) {
        if (args[0] === 'run') {
          // Creation of asset by running the image
          return getSpawnSyncReturn(127, ['Bundling started', 'Bundling failed in container']);
        }
      }
      return getSpawnSyncReturn(127, ['FAIL']);
    });

    await expect(pub.publish()).rejects.toThrow('Error building and publishing: [Status 127] stdout: stdout');
  });
});