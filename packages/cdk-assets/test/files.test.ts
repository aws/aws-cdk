import { Manifest } from '@aws-cdk/cloud-assembly-schema';
import * as mockfs from 'mock-fs';
import { AssetManifest, AssetPublishing } from '../lib';
import { mockAws, mockedApiResult, mockUpload } from './mock-aws';

let aws: ReturnType<typeof mockAws>;
beforeEach(() => {
  mockfs({
    '/simple/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      files: {
        theAsset: {
          source: {
            path: 'some_file',
          },
          destinations: {
            theDestination: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              bucketName: 'some_bucket',
              objectKey: 'some_key',
            },
          },
        },
      },
    }),
    '/simple/cdk.out/some_file': 'FILE_CONTENTS',
    '/abs/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      files: {
        theAsset: {
          source: {
            path: '/simple/cdk.out/some_file',
          },
          destinations: {
            theDestination: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              bucketName: 'some_bucket',
              objectKey: 'some_key',
            },
          },
        },
      },
    }),
  });

  aws = mockAws();
});

afterEach(() => {
  mockfs.restore();
});

test('pass destination properties to AWS client', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws, throwOnError: false });

  await pub.publish();

  expect(aws.s3Client).toHaveBeenCalledWith(expect.objectContaining({
    region: 'us-north-50',
    assumeRoleArn: 'arn:aws:role',
  }));
});

test('Do nothing if file already exists', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out') , { aws });

  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: [{ Key: 'some_key' }] });

  await pub.publish();

  expect(aws.mockS3.listObjectsV2).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'some_bucket',
    Prefix: 'some_key',
    MaxKeys: 1,
  }));
});

test('upload file if new (list returns other key)', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws });

  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: [{ Key: 'some_key.but_not_the_one' }] });
  aws.mockS3.upload = mockUpload('FILE_CONTENTS');

  await pub.publish();

  expect(aws.mockS3.upload).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'some_bucket',
    Key: 'some_key',
  }));

  // We'll just have to assume the contents are correct
});

test('upload file if new (list returns no key)', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws });

  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: undefined });
  aws.mockS3.upload = mockUpload('FILE_CONTENTS');

  await pub.publish();

  expect(aws.mockS3.upload).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'some_bucket',
    Key: 'some_key',
  }));

  // We'll just have to assume the contents are correct
});

test('successful run does not need to query account ID', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws });

  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: undefined });
  aws.mockS3.upload = mockUpload('FILE_CONTENTS');

  await pub.publish();

  expect(aws.discoverCurrentAccount).not.toHaveBeenCalled();
});

test('correctly identify asset path if path is absolute', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/abs/cdk.out'), { aws });

  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: undefined });
  aws.mockS3.upload = mockUpload('FILE_CONTENTS');

  await pub.publish();
});
