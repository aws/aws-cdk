import * as path from 'path';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as cxapi from 'aws-cdk-lib/cx-api';
import * as glue from '../lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

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

      new glue.PythonShellJob(stack, 'Job1', {
        script,
        role: new Role(stack, 'Role', {
          assumedBy: new ServicePrincipal('glue.amazonaws.com'),
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
            Ref: Match.stringLikeRegexp('Role'),
          },
        ],
      });
    });
  });

  describe('.fromAsset()', () => {
    const filePath = path.join(__dirname, 'job-script', 'hello_world.py');
    const directoryPath = path.join(__dirname, 'job-script');

    beforeEach(() => {
      script = glue.Code.fromAsset(filePath);
    });

    test("with valid and existing file path and bound to job sets job's script location and permissions stack metadata", () => {
      new glue.PythonShellJob(stack, 'Job1', {
        script,
        role: new Role(stack, 'Role', {
          assumedBy: new ServicePrincipal('glue.amazonaws.com'),
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
            Ref: Match.stringLikeRegexp('Role'),
          },
        ],
      });
    });

    test('with an unsupported directory path throws', () => {
      expect(() => glue.Code.fromAsset(directoryPath))
        .toThrow(/Only files are supported/);
    });

    test('used in more than 1 job in the same stack should be reused', () => {
      new glue.PythonShellJob(stack, 'Job1', {
        script,
        role: new Role(stack, 'Role1', {
          assumedBy: new ServicePrincipal('glue.amazonaws.com'),
        }),
      });
      new glue.PythonShellJob(stack, 'Job2', {
        script,
        role: new Role(stack, 'Role2', {
          assumedBy: new ServicePrincipal('glue.amazonaws.com'),
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
            Match.stringLikeRegexp('Role'),
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
            Match.stringLikeRegexp('Role'),
            'Arn',
          ],
        },
      });
    });

    test('throws if trying to rebind in another stack', () => {
      new glue.PythonShellJob(stack, 'Job1', {
        script,
        role: new Role(stack, 'Role1', {
          assumedBy: new ServicePrincipal('glue.amazonaws.com'),
        }),
      });
      const differentStack = new cdk.Stack();

      expect(() => new glue.PythonShellJob(differentStack, 'Job1', {
        script,
        role: new Role(stack, 'Role2', {
          assumedBy: new ServicePrincipal('glue.amazonaws.com'),
        }),
      })).toThrow(/associated with another stack/);
    });
  });
});
