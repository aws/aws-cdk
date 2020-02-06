import { AssetManifest } from '@aws-cdk/cx-api';
import * as mockfs from 'mock-fs';
import { AssetPublishing } from '../lib';
import { mockAws, mockedApiResult } from './mock-aws';

let aws: ReturnType<typeof mockAws>;
beforeEach(() => {
  mockfs({
    '/simple/cdk.out/assets.json': JSON.stringify({
      version: 'assets-1.0',
      assets: {
        fileAsset: {
          type: 'file',
          source: {
            path: 'some_file'
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
        dockerAsset: {
          type: 'docker-image',
          source: {
            directory: 'dockerdir'
          },
          destinations: {
            theDestination: {
              // Explicit region
              region: 'explicit_region',
              assumeRoleArn: 'arn:aws:role-${AWS::AccountId}',
              repositoryName: 'repo-${AWS::AccountId}-${AWS::Region}',
              imageTag: 'abcdef',
              imageUri: '12345.amazonaws.com/repo:abcdef',
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
  const pub = new AssetPublishing({ aws, manifest: AssetManifest.fromPath('/simple/cdk.out') });
  aws.mockS3.headObject = mockedApiResult({ /* No error == file exists */ });
  aws.mockEcr.describeImages = mockedApiResult({ /* No error == image exists */ });

  await pub.publish();

  expect(aws.s3Client).toHaveBeenCalledWith(expect.objectContaining({
    assumeRoleArn: 'arn:aws:role-current_account',
  }));

  expect(aws.ecrClient).toHaveBeenCalledWith(expect.objectContaining({
    region: 'explicit_region',
    assumeRoleArn: 'arn:aws:role-current_account',
  }));

  expect(aws.mockS3.headObject).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'some_bucket-current_account-current_region',
    Key: 'some_key-current_account-current_region'
  }));

  expect(aws.mockEcr.describeImages).toHaveBeenCalledWith(expect.objectContaining({
    imageIds: [{imageTag: 'abcdef'}],
    repositoryName: 'repo-current_account-explicit_region'
  }));
});