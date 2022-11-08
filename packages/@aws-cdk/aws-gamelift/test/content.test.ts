import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as gamelift from '../lib';

describe('Code', () => {
  let stack: cdk.Stack;
  let content: gamelift.Content;

  beforeEach(() => {
    const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    stack = new cdk.Stack(app, 'Stack');
  });

  describe('.fromBucket()', () => {
    const key = 'content';
    let bucket: s3.IBucket;

    test('with valid bucket name and key and bound by build sets the right path and grants the build permissions to read from it', () => {
      bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'bucketname');
      content = gamelift.Content.fromBucket(bucket, key);
      new gamelift.Build(stack, 'Build1', {
        content: content,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::GameLift::Build', {
        StorageLocation: {
          Bucket: 'bucketname',
          Key: 'content',
        },
      });

      // Role policy should grant reading from the assets bucket
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                's3:GetObject',
                's3:GetObjectVersion',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':s3:::bucketname/content',
                  ],
                ],
              },
            },
          ],
        },
        Roles: [
          {
            Ref: 'Build1ServiceRole24FABCB7',
          },
        ],
      });
    });
  });

  describe('.fromAsset()', () => {
    const directoryPath = path.join(__dirname, 'my-game-build');

    beforeEach(() => {
      content = gamelift.Content.fromAsset(directoryPath);
    });

    test('with valid and existing file path and bound to script location and permissions stack metadata', () => {
      new gamelift.Build(stack, 'Build1', {
        content: content,
      });

      expect(stack.node.metadata.find(m => m.type === 'aws:cdk:asset')).toBeDefined();
      Template.fromStack(stack).hasResourceProperties('AWS::GameLift::Build', {
        StorageLocation: {
          Bucket: {
            Ref: 'AssetParameters6019bfc8ab05a24b0ae9b5d8f4585cbfc7d1c30a23286d0b25ce7066a368a5d7S3Bucket72AA8348',
          },
          Key: {
            'Fn::Join': [
              '',
              [
                {
                  'Fn::Select': [
                    0,
                    {
                      'Fn::Split': [
                        '||',
                        {
                          Ref: 'AssetParameters6019bfc8ab05a24b0ae9b5d8f4585cbfc7d1c30a23286d0b25ce7066a368a5d7S3VersionKey720D3160',
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
                          Ref: 'AssetParameters6019bfc8ab05a24b0ae9b5d8f4585cbfc7d1c30a23286d0b25ce7066a368a5d7S3VersionKey720D3160',
                        },
                      ],
                    },
                  ],
                },
              ],
            ],
          },
          RoleArn: {
            'Fn::GetAtt': [
              'Build1ServiceRole24FABCB7',
              'Arn',
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
                's3:GetObject',
                's3:GetObjectVersion',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':s3:::',
                    {
                      Ref: 'AssetParameters6019bfc8ab05a24b0ae9b5d8f4585cbfc7d1c30a23286d0b25ce7066a368a5d7S3Bucket72AA8348',
                    },
                    '/',
                    {
                      'Fn::Select': [
                        0,
                        {
                          'Fn::Split': [
                            '||',
                            {
                              Ref: 'AssetParameters6019bfc8ab05a24b0ae9b5d8f4585cbfc7d1c30a23286d0b25ce7066a368a5d7S3VersionKey720D3160',
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
                              Ref: 'AssetParameters6019bfc8ab05a24b0ae9b5d8f4585cbfc7d1c30a23286d0b25ce7066a368a5d7S3VersionKey720D3160',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                ],
              },
            },
          ],
        },
        Roles: [
          {
            Ref: 'Build1ServiceRole24FABCB7',
          },
        ],
      });
    });

    test('with an unsupported file path throws', () => {
      // GIVEN
      const fileAsset = gamelift.Content.fromAsset(path.join(__dirname, 'my-game-build', 'index.js'));

      // THEN
      expect(() => new gamelift.Build(stack, 'Build1', { content: fileAsset }))
        .toThrow(/Asset must be a \.zip file or a directory/);
    });

    test('used in more than 1 build in the same stack should be reused', () => {
      new gamelift.Build(stack, 'Build1', {
        content: content,
      });
      new gamelift.Build(stack, 'Build2', {
        content: content,
      });
      const StorageLocation = {
        Bucket: {
          Ref: 'AssetParameters6019bfc8ab05a24b0ae9b5d8f4585cbfc7d1c30a23286d0b25ce7066a368a5d7S3Bucket72AA8348',
        },
        Key: {
          'Fn::Join': [
            '',
            [
              {
                'Fn::Select': [
                  0,
                  {
                    'Fn::Split': [
                      '||',
                      {
                        Ref: 'AssetParameters6019bfc8ab05a24b0ae9b5d8f4585cbfc7d1c30a23286d0b25ce7066a368a5d7S3VersionKey720D3160',
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
                        Ref: 'AssetParameters6019bfc8ab05a24b0ae9b5d8f4585cbfc7d1c30a23286d0b25ce7066a368a5d7S3VersionKey720D3160',
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        RoleArn: {
          'Fn::GetAtt': [
            'Build1ServiceRole24FABCB7',
            'Arn',
          ],
        },
      };

      expect(stack.node.metadata.find(m => m.type === 'aws:cdk:asset')).toBeDefined();
      Template.fromStack(stack).hasResourceProperties('AWS::GameLift::Build', {
        StorageLocation,
      });
      Template.fromStack(stack).hasResourceProperties('AWS::GameLift::Build', {
        StorageLocation,
      });
    });

    test('throws if trying to rebind in another stack', () => {
      new gamelift.Build(stack, 'Build1', {
        content,
      });
      const differentStack = new cdk.Stack();

      expect(() => new gamelift.Build(differentStack, 'Build2', {
        content,
      })).toThrow(/Asset is already associated with another stack/);
    });
  });
});
