// Separate test file since the archiving module doesn't work well with 'mock-fs'
import { AssetManifestSchema } from '@aws-cdk/cdk-assets-schema';
import { AssetManifest, AssetPublishing } from '../lib';
import * as bockfs from './bockfs';
import { mockAws, mockedApiFailure, mockPutObject } from './mock-aws';

let aws: ReturnType<typeof mockAws>;
beforeEach(() => {
  bockfs({
    '/simple/cdk.out/assets.json': JSON.stringify({
      version: AssetManifestSchema.currentVersion(),
      files: {
        theAsset: {
          source: {
            path: 'some_dir',
            packaging: 'zip'
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
    '/simple/cdk.out/some_dir/some_file': 'FILE_CONTENTS',
  });

  aws = mockAws();

  // Accept all S3 uploads as new
  aws.mockS3.headObject = mockedApiFailure('NotFound', 'File does not exist');
  aws.mockS3.putObject = mockPutObject();
});

afterEach(() => {
  bockfs.restore();
});

test('Take a zipped upload', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath(bockfs.path('/simple/cdk.out')), { aws });

  await pub.publish();

  expect(aws.mockS3.putObject).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'some_bucket',
    Key: 'some_key',
    ContentType: 'application/zip',
  }));
});
