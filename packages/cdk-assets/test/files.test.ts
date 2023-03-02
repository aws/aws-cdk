jest.mock('child_process');

import { Manifest } from '@aws-cdk/cloud-assembly-schema';
import * as mockfs from 'mock-fs';
import { FakeListener } from './fake-listener';
import { mockAws, mockedApiFailure, mockedApiResult, mockUpload } from './mock-aws';
import { mockSpawn } from './mock-child_process';
import { AssetPublishing, AssetManifest } from '../lib';

const ABS_PATH = '/simple/cdk.out/some_external_file';

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
    '/simple/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      files: {
        theAsset: {
          source: {
            path: 'some_file',
          },
          destinations: { theDestination: DEFAULT_DESTINATION },
        },
      },
    }),
    '/simple/cdk.out/some_file': 'FILE_CONTENTS',
    [ABS_PATH]: 'ZIP_FILE_THAT_IS_DEFINITELY_NOT_EMPTY',
    '/abs/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      files: {
        theAsset: {
          source: {
            path: '/simple/cdk.out/some_file',
          },
          destinations: { theDestination: { ...DEFAULT_DESTINATION, bucketName: 'some_other_bucket' } },
        },
      },
    }),
    '/external/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      files: {
        externalAsset: {
          source: {
            executable: ['sometool'],
          },
          destinations: { theDestination: { ...DEFAULT_DESTINATION, bucketName: 'some_external_bucket' } },
        },
      },
    }),
    '/types/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      files: {
        theTextAsset: {
          source: {
            path: 'plain_text.txt',
          },
          destinations: { theDestination: { ...DEFAULT_DESTINATION, objectKey: 'some_key.txt' } },
        },
        theImageAsset: {
          source: {
            path: 'image.png',
          },
          destinations: { theDestination: { ...DEFAULT_DESTINATION, objectKey: 'some_key.png' } },
        },
      },
    }),
    '/types/cdk.out/plain_text.txt': 'FILE_CONTENTS',
    '/types/cdk.out/image.png': 'FILE_CONTENTS',
    '/emptyzip/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      files: {
        theTextAsset: {
          source: {
            path: 'empty_dir',
            packaging: 'zip',
          },
          destinations: { theDestination: DEFAULT_DESTINATION },
        },
      },
    }),
    '/emptyzip/cdk.out/empty_dir': { }, // Empty directory
  });

  aws = mockAws();
});

afterEach(() => {
  mockfs.restore();
});

test('pass destination properties to AWS client', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws, throwOnError: false });
  aws.mockS3.listObjectsV2 = mockedApiResult({});

  await pub.publish();

  expect(aws.s3Client).toHaveBeenCalledWith(expect.objectContaining({
    region: 'us-north-50',
    assumeRoleArn: 'arn:aws:role',
  }));
});

test('Do nothing if file already exists', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws });

  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: [{ Key: 'some_key' }] });
  aws.mockS3.upload = mockUpload();
  await pub.publish();

  expect(aws.mockS3.listObjectsV2).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'some_bucket',
    Prefix: 'some_key',
    MaxKeys: 1,
  }));
  expect(aws.mockS3.upload).not.toHaveBeenCalled();
});

test('tiny file does not count as cache hit', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws });

  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: [{ Key: 'some_key', Size: 5 }] });
  aws.mockS3.upload = mockUpload();

  await pub.publish();

  expect(aws.mockS3.upload).toHaveBeenCalled();
});


test('upload file if new (list returns other key)', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws });

  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: [{ Key: 'some_key.but_not_the_one' }] });
  aws.mockS3.upload = mockUpload('FILE_CONTENTS');

  await pub.publish();

  expect(aws.mockS3.upload).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'some_bucket',
    Key: 'some_key',
    ContentType: 'application/octet-stream',
  }));

  // We'll just have to assume the contents are correct
});

test('upload with server side encryption AES256 header', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws });

  aws.mockS3.getBucketEncryption = mockedApiResult({
    ServerSideEncryptionConfiguration: {
      Rules: [
        {
          ApplyServerSideEncryptionByDefault: {
            SSEAlgorithm: 'AES256',
          },
          BucketKeyEnabled: false,
        },
      ],
    },
  });
  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: [{ Key: 'some_key.but_not_the_one' }] });
  aws.mockS3.upload = mockUpload('FILE_CONTENTS');

  await pub.publish();

  expect(aws.mockS3.upload).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'some_bucket',
    Key: 'some_key',
    ContentType: 'application/octet-stream',
    ServerSideEncryption: 'AES256',
  }));

  // We'll just have to assume the contents are correct
});

test('upload with server side encryption aws:kms header and key id', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws });

  aws.mockS3.getBucketEncryption = mockedApiResult({
    ServerSideEncryptionConfiguration: {
      Rules: [
        {
          ApplyServerSideEncryptionByDefault: {
            SSEAlgorithm: 'aws:kms',
            KMSMasterKeyID: 'the-key-id',
          },
          BucketKeyEnabled: false,
        },
      ],
    },
  });

  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: [{ Key: 'some_key.but_not_the_one' }] });
  aws.mockS3.upload = mockUpload('FILE_CONTENTS');

  await pub.publish();

  expect(aws.mockS3.upload).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'some_bucket',
    Key: 'some_key',
    ContentType: 'application/octet-stream',
    ServerSideEncryption: 'aws:kms',
    SSEKMSKeyId: 'the-key-id',
  }));

  // We'll just have to assume the contents are correct
});

test('will only read bucketEncryption once even for multiple assets', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/types/cdk.out'), { aws });

  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: [{ Key: 'some_key.but_not_the_one' }] });
  aws.mockS3.upload = mockUpload('FILE_CONTENTS');

  await pub.publish();

  expect(aws.mockS3.upload).toHaveBeenCalledTimes(2);
  expect(aws.mockS3.getBucketEncryption).toHaveBeenCalledTimes(1);
});

test('no server side encryption header if access denied for bucket encryption', async () => {
  const progressListener = new FakeListener();
  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws, progressListener });

  aws.mockS3.getBucketEncryption = mockedApiFailure('AccessDenied', 'Access Denied');

  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: [{ Key: 'some_key.but_not_the_one' }] });
  aws.mockS3.upload = mockUpload('FILE_CONTENTS');

  await pub.publish();

  expect(aws.mockS3.upload).toHaveBeenCalledWith(expect.not.objectContaining({
    ServerSideEncryption: 'aws:kms',
  }));

  expect(aws.mockS3.upload).toHaveBeenCalledWith(expect.not.objectContaining({
    ServerSideEncryption: 'AES256',
  }));
});

test('correctly looks up content type', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/types/cdk.out'), { aws });

  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: [{ Key: 'some_key.but_not_the_one' }] });
  aws.mockS3.upload = mockUpload('FILE_CONTENTS');

  await pub.publish();

  expect(aws.mockS3.upload).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'some_bucket',
    Key: 'some_key.txt',
    ContentType: 'text/plain',
  }));

  expect(aws.mockS3.upload).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'some_bucket',
    Key: 'some_key.png',
    ContentType: 'image/png',
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
  expect(aws.discoverTargetAccount).not.toHaveBeenCalled();
});

test('correctly identify asset path if path is absolute', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/abs/cdk.out'), { aws });

  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: undefined });
  aws.mockS3.upload = mockUpload('FILE_CONTENTS');

  await pub.publish();

  expect(true).toBeTruthy(); // No exception, satisfy linter
});

describe('external assets', () => {
  let pub: AssetPublishing;
  beforeEach(() => {
    pub = new AssetPublishing(AssetManifest.fromPath('/external/cdk.out'), { aws });
  });

  test('do nothing if file exists already', async () => {
    aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: [{ Key: 'some_key' }] });

    await pub.publish();

    expect(aws.mockS3.listObjectsV2).toHaveBeenCalledWith(expect.objectContaining({
      Bucket: 'some_external_bucket',
      Prefix: 'some_key',
      MaxKeys: 1,
    }));
  });

  test('upload external asset correctly', async () => {
    aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: undefined });
    aws.mockS3.upload = mockUpload('ZIP_FILE_THAT_IS_DEFINITELY_NOT_EMPTY');
    const expectAllSpawns = mockSpawn({ commandLine: ['sometool'], stdout: ABS_PATH });

    await pub.publish();

    expect(aws.s3Client).toHaveBeenCalledWith(expect.objectContaining({
      region: 'us-north-50',
      assumeRoleArn: 'arn:aws:role',
    }));

    expectAllSpawns();
  });
});
