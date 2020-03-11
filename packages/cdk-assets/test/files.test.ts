import { AssetManifestSchema } from '@aws-cdk/cdk-assets-schema';
import * as mockfs from 'mock-fs';
import { AssetManifest, AssetPublishing } from '../lib';
import { mockAws, mockedApiFailure, mockedApiResult, mockUpload } from './mock-aws';

let aws: ReturnType<typeof mockAws>;
beforeEach(() => {
  mockfs({
    '/simple/cdk.out/assets.json': JSON.stringify({
      version: AssetManifestSchema.currentVersion(),
      files: {
        theAsset: {
          source: {
            path: 'some_file'
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
  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out') , { aws, });

  aws.mockS3.headObject = mockedApiResult({ /* No error == file exists */ });

  await pub.publish();

  expect(aws.mockS3.headObject).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'some_bucket',
    Key: 'some_key'
  }));
});

test('upload file if new', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws });

  aws.mockS3.headObject = mockedApiFailure('NotFound', 'File does not exist');
  aws.mockS3.upload = mockUpload();

  await pub.publish();

  expect(aws.mockS3.upload).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'some_bucket',
    Key: 'some_key'
  }));

  // We'll just have to assume the contents are correct
});
