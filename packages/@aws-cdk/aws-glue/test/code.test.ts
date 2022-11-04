import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as glue from '../lib';

describe('Code', () => {
  let stack: cdk.Stack;
  let script: glue.Code;

  beforeEach(() => {
    const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    stack = new cdk.Stack(app, 'Stack');
  });

  describe('.fromBucket()', () => {
    const key = 'script';
    let bucket: s3.IBucket;

    test('with valid bucket name and key and bound by job sets the right path and grants the job permissions to read from it', () => {
      bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'bucketname');
      script = glue.Code.fromBucket(bucket, key);
      new glue.Job(stack, 'Job1', {
        executable: glue.JobExecutable.pythonShell({
          glueVersion: glue.GlueVersion.V1_0,
          pythonVersion: glue.PythonVersion.THREE,
          script,
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Command: {
          ScriptLocation: 's3://bucketname/script',
        },
      });

      // Role policy should grant reading from the assets bucket
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
              ],
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':s3:::bucketname',
                    ],
                  ],
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':s3:::bucketname/script',
                    ],
                  ],
                },
              ],
            },
          ],
        },
        Roles: [
          {
            Ref: 'Job1ServiceRole7AF34CCA',
          },
        ],
      });
    });
  });

  describe('.fromAsset()', () => {
    const filePath = path.join(__dirname, 'job-script/hello_world.py');
    const directoryPath = path.join(__dirname, 'job-script');

    beforeEach(() => {
      script = glue.Code.fromAsset(filePath);
    });

    test("with valid and existing file path and bound to job sets job's script location and permissions stack metadata", () => {
      new glue.Job(stack, 'Job1', {
        executable: glue.JobExecutable.pythonShell({
          glueVersion: glue.GlueVersion.V1_0,
          pythonVersion: glue.PythonVersion.THREE,
          script,
        }),
      });

      expect(stack.node.metadata.find(m => m.type === 'aws:cdk:asset')).toBeDefined();
      Template.fromStack(stack).hasResourceProperties('AWS::Glue::Job', {
        Command: {
          ScriptLocation: {
            'Fn::Join': [
              '',
              [
                's3://',
                {
                  Ref: 'AssetParameters432033e3218068a915d2532fa9be7858a12b228a2ae6e5c10faccd9097b1e855S3Bucket4E517469',
                },
                '/',
                {
                  'Fn::Select': [
                    0,
                    {
                      'Fn::Split': [
                        '||',
                        {
                          Ref: 'AssetParameters432033e3218068a915d2532fa9be7858a12b228a2ae6e5c10faccd9097b1e855S3VersionKeyF7753763',
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
                          Ref: 'AssetParameters432033e3218068a915d2532fa9be7858a12b228a2ae6e5c10faccd9097b1e855S3VersionKeyF7753763',
                        },
                      ],
                    },
                  ],
                },
              ],
            ],
          },
        },
      });
      // Role policy should grant reading from the assets bucket
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
              ],
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':s3:::',
                      {
                        Ref: 'AssetParameters432033e3218068a915d2532fa9be7858a12b228a2ae6e5c10faccd9097b1e855S3Bucket4E517469',
                      },
                    ],
                  ],
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':s3:::',
                      {
                        Ref: 'AssetParameters432033e3218068a915d2532fa9be7858a12b228a2ae6e5c10faccd9097b1e855S3Bucket4E517469',
                      },
                      '/*',
                    ],
                  ],
                },
              ],
            },
          ],
        },
        Roles: [
          {
            Ref: 'Job1ServiceRole7AF34CCA',
          },
        ],
      });
    });

    test('with an unsupported directory path throws', () => {
      expect(() => glue.Code.fromAsset(directoryPath))
        .toThrow(/Only files are supported/);
    });

    test('used in more than 1 job in the same stack should be reused', () => {
      new glue.Job(stack, 'Job1', {
        executable: glue.JobExecutable.pythonShell({
          glueVersion: glue.GlueVersion.V1_0,
          pythonVersion: glue.PythonVersion.THREE,
          script,
        }),
      });
      new glue.Job(stack, 'Job2', {
        executable: glue.JobExecutable.pythonShell({
          glueVersion: glue.GlueVersion.V1_0,
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
              Ref: 'AssetParameters432033e3218068a915d2532fa9be7858a12b228a2ae6e5c10faccd9097b1e855S3Bucket4E517469',
            },
            '/',
            {
              'Fn::Select': [
                0,
                {
                  'Fn::Split': [
                    '||',
                    {
                      Ref: 'AssetParameters432033e3218068a915d2532fa9be7858a12b228a2ae6e5c10faccd9097b1e855S3VersionKeyF7753763',
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
                      Ref: 'AssetParameters432033e3218068a915d2532fa9be7858a12b228a2ae6e5c10faccd9097b1e855S3VersionKeyF7753763',
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

    test('throws if trying to rebind in another stack', () => {
      new glue.Job(stack, 'Job1', {
        executable: glue.JobExecutable.pythonShell({
          glueVersion: glue.GlueVersion.V1_0,
          pythonVersion: glue.PythonVersion.THREE,
          script,
        }),
      });
      const differentStack = new cdk.Stack();

      expect(() => new glue.Job(differentStack, 'Job2', {
        executable: glue.JobExecutable.pythonShell({
          glueVersion: glue.GlueVersion.V1_0,
          pythonVersion: glue.PythonVersion.THREE,
          script: script,
        }),
      })).toThrow(/associated with another stack/);
    });
  });
});
