import { Manifest } from '@aws-cdk/cloud-assembly-schema';
import * as mockfs from 'mock-fs';
import { mockAws, mockedApiResult } from './mock-aws';
import { AssetManifest, AssetPublishing } from '../lib';

let aws: ReturnType<typeof mockAws>;
beforeEach(() => {
  mockfs({
    '/simple/cdk.out/assets.json': JSON.stringify({
      version: Manifest.version(),
      files: {
        fileAsset: {
          type: 'file',
          source: {
            path: 'some_file',
          },
          destinations: {
            theDestination: {
              // Absence of region
              assumeRoleArn: 'arn:aws:role-${AWS::AccountId}',
              bucketName: 'some_bucket-${AWS::AccountId}-${AWS::Region}',
              objectKey: 'some_key-${AWS::AccountId}-${AWS::Region}',
            },
          },
        },
      },
      dockerImages: {
        dockerAsset: {
          type: 'docker-image',
          source: {
            directory: 'dockerdir',
          },
          destinations: {
            theDestination: {
              // Explicit region
              region: 'explicit_region',
              assumeRoleArn: 'arn:aws:role-${AWS::AccountId}',
              repositoryName: 'repo-${AWS::AccountId}-${AWS::Region}',
              imageTag: 'abcdef',
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

test('check that placeholders are replaced', async () => {
  const pub = new AssetPublishing(AssetManifest.fromPath('/simple/cdk.out'), { aws });
  aws.mockS3.getBucketLocation = mockedApiResult({});
  aws.mockS3.listObjectsV2 = mockedApiResult({ Contents: [{ Key: 'some_key-current_account-current_region' }] });
  aws.mockEcr.describeImages = mockedApiResult({ /* No error == image exists */ });

  await pub.publish();

  expect(aws.s3Client).toHaveBeenCalledWith(expect.objectContaining({
    assumeRoleArn: 'arn:aws:role-current_account',
  }));

  expect(aws.ecrClient).toHaveBeenCalledWith(expect.objectContaining({
    region: 'explicit_region',
    assumeRoleArn: 'arn:aws:role-current_account',
  }));

  expect(aws.mockS3.listObjectsV2).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'some_bucket-current_account-current_region',
    Prefix: 'some_key-current_account-current_region',
    MaxKeys: 1,
  }));

  expect(aws.mockEcr.describeImages).toHaveBeenCalledWith(expect.objectContaining({
    imageIds: [{ imageTag: 'abcdef' }],
    repositoryName: 'repo-current_account-explicit_region',
  }));
});
