import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as glue from '../lib';

describe('Code', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  describe('.fromBucket()', () => {
    const key = 'script';
    let bucket: s3.IBucket;

    test('with valid bucket name and key and calling bind() returns correct s3 location', () => {
      bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'bucketName');
      expect(glue.Code.fromBucket(bucket, key).bind(stack)).toEqual({
        s3Location: {
          bucketName: 'bucketName',
          objectKey: 'script',
        },
      });
    });
  });

  describe('.fromAsset()', () => {
    const filePath = path.join(__dirname, 'job-script/hello_world.py');
    const directoryPath = path.join(__dirname, 'job-script');

    test('with valid and existing file path and calling bind() returns an s3 location and sets metadata', () => {
      const codeConfig = glue.Code.fromAsset(filePath).bind(stack);
      expect(codeConfig.s3Location.bucketName).toBeDefined();
      expect(codeConfig.s3Location.objectKey).toBeDefined();
      expect(stack.node.metadata.find(m => m.type === 'aws:cdk:asset')).toBeDefined();
    });

    test('with an unsupported directory path throws', () => {
      expect(() => glue.Code.fromAsset(directoryPath))
        .toThrow(/Only files are supported/);
    });

    test('used in more than 1 job in the same stack should be reused', () => {
      const script = glue.Code.fromAsset(filePath);
      new glue.Job(stack, 'Job1', {
        executable: glue.JobExecutable.pythonShell({
          glueVersion: glue.GlueVersion.V2_0,
          pythonVersion: glue.PythonVersion.THREE,
          script,
        }),
      });
      new glue.Job(stack, 'Job2', {
        executable: glue.JobExecutable.pythonShell({
          glueVersion: glue.GlueVersion.V2_0,
          pythonVersion: glue.PythonVersion.THREE,
          script,
        }),
      });
      const ScriptLocation = {
        'Fn::Join': [
          '',
          [
            's3://',
            {
              Ref: 'AssetParameters894df8f835015940e27548bfbf722885cb247378af70effdc8ecbe342419fc6bS3Bucket252142A8',
            },
            '/',
            {
              'Fn::Select': [
                0,
                {
                  'Fn::Split': [
                    '||',
                    {
                      Ref: 'AssetParameters894df8f835015940e27548bfbf722885cb247378af70effdc8ecbe342419fc6bS3VersionKey7D45B377',
                    },
                  ],
                },
              ],
            },
            {
              'Fn::Select': [
                1,
                {
                  'Fn::Split': [
                    '||',
                    {
                      Ref: 'AssetParameters894df8f835015940e27548bfbf722885cb247378af70effdc8ecbe342419fc6bS3VersionKey7D45B377',
                    },
                  ],
                },
              ],
            },
          ],
        ],
      };
      expect(stack.node.metadata.find(m => m.type === 'aws:cdk:asset')).toBeDefined();
      // Job1 and Job2 use reuse the asset
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Command: {
          ScriptLocation,
        },
        Role: {
          'Fn::GetAtt': [
            'Job1ServiceRole7AF34CCA',
            'Arn',
          ],
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Command: {
          ScriptLocation,
        },
        Role: {
          'Fn::GetAtt': [
            'Job2ServiceRole5D2B98FE',
            'Arn',
          ],
        },
      });
    });

    test('throws if used in more than 1 stack', () => {
      const stack2 = new cdk.Stack();
      const asset = glue.Code.fromAsset(filePath);
      asset.bind(stack);

      expect(() => asset.bind(stack2))
        .toThrow(/associated with another stack/);
    });
  });
});