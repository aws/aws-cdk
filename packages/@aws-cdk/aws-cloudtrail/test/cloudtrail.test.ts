import { Match, Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import { LogGroup, RetentionDays } from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as sns from '@aws-cdk/aws-sns';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { Stack } from '@aws-cdk/core';
import { ManagementEventSources, ReadWriteType, Trail, InsightType } from '../lib';

const ExpectedBucketPolicyProperties = {
  PolicyDocument: {
    Statement: [
      {
        Action: 's3:*',
        Condition: {
          Bool: { 'aws:SecureTransport': 'false' },
        },
        Effect: 'Deny',
        Principal: {
          AWS: '*',
        },
        Resource: [
          {
            'Fn::GetAtt': [
              'MyAmazingCloudTrailS3A580FE27',
              'Arn',
            ],
          },
          {
            'Fn::Join': [
              '',
              [{
                'Fn::GetAtt': [
                  'MyAmazingCloudTrailS3A580FE27',
                  'Arn',
                ],
              },
              '/*'],
            ],
          },
        ],
      },
      {
        Action: 's3:GetBucketAcl',
        Effect: 'Allow',
        Principal: {
          Service: 'cloudtrail.amazonaws.com',
        },
        Resource: {
          'Fn::GetAtt': [
            'MyAmazingCloudTrailS3A580FE27',
            'Arn',
          ],
        },
      },
      {
        Action: 's3:PutObject',
        Condition: {
          StringEquals: {
            's3:x-amz-acl': 'bucket-owner-full-control',
          },
        },
        Effect: 'Allow',
        Principal: {
          Service: 'cloudtrail.amazonaws.com',
        },
        Resource: {
          'Fn::Join': [
            '',
            [
              {
                'Fn::GetAtt': [
                  'MyAmazingCloudTrailS3A580FE27',
                  'Arn',
                ],
              },
              '/AWSLogs/123456789012/*',
            ],
          ],
        },
      },
    ],
    Version: '2012-10-17',
  },
};

const logsRolePolicyName = 'MyAmazingCloudTrailLogsRoleDefaultPolicy61DC49E7';
const logsRoleName = 'MyAmazingCloudTrailLogsRoleF2CCF977';

function getTestStack(): Stack {
  return new Stack(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
}

describe('cloudtrail', () => {
  describe('constructs the expected resources', () => {
    test('with no properties', () => {
      const stack = getTestStack();
      new Trail(stack, 'MyAmazingCloudTrail');
      Template.fromStack(stack).resourceCountIs('AWS::CloudTrail::Trail', 1);
      Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
      Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', ExpectedBucketPolicyProperties);
      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
      const trail: any = Template.fromStack(stack).toJSON().Resources.MyAmazingCloudTrail54516E8D;
      expect(trail.DependsOn).toEqual(['MyAmazingCloudTrailS3Policy39C120B0']);
    });

    test('with s3bucket', () => {
      const stack = getTestStack();
      const Trailbucket = new s3.Bucket(stack, 'S3');
      const cloudTrailPrincipal = new iam.ServicePrincipal('cloudtrail.amazonaws.com');
      Trailbucket.addToResourcePolicy(new iam.PolicyStatement({
        resources: [Trailbucket.bucketArn],
        actions: ['s3:GetBucketAcl'],
        principals: [cloudTrailPrincipal],
      }));

      Trailbucket.addToResourcePolicy(new iam.PolicyStatement({
        resources: [Trailbucket.arnForObjects(`AWSLogs/${Stack.of(stack).account}/*`)],
        actions: ['s3:PutObject'],
        principals: [cloudTrailPrincipal],
        conditions: {
          StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' },
        },
      }));

      new Trail(stack, 'Trail', { bucket: Trailbucket });

      Template.fromStack(stack).resourceCountIs('AWS::CloudTrail::Trail', 1);
      Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
      Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 1);
      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
    });

    test('with sns topic', () => {
      const stack = getTestStack();
      const topic = new sns.Topic(stack, 'Topic');


      new Trail(stack, 'Trail', { snsTopic: topic });

      Template.fromStack(stack).resourceCountIs('AWS::CloudTrail::Trail', 1);
      Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
      Template.fromStack(stack).hasResourceProperties('AWS::SNS::TopicPolicy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'sns:Publish',
              Effect: 'Allow',
              Principal: { Service: 'cloudtrail.amazonaws.com' },
              Resource: { Ref: 'TopicBFC7AF6E' },
              Sid: '0',
            },
          ],
          Version: '2012-10-17',
        },
      });
    });

    test('with imported s3 bucket', () => {
      // GIVEN
      const stack = getTestStack();
      const bucket = s3.Bucket.fromBucketName(stack, 'S3', 'somebucket');

      // WHEN
      new Trail(stack, 'Trail', { bucket });

      Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
        S3BucketName: 'somebucket',
      });
    });

    test('with s3KeyPrefix', () => {
      // GIVEN
      const stack = getTestStack();

      // WHEN
      new Trail(stack, 'Trail', { s3KeyPrefix: 'someprefix' });

      Template.fromStack(stack).resourceCountIs('AWS::CloudTrail::Trail', 1);
      Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
      Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
        Bucket: { Ref: 'TrailS30071F172' },
        PolicyDocument: {
          Statement: [
            {
              Action: 's3:*',
              Condition: {
                Bool: {
                  'aws:SecureTransport': 'false',
                },
              },
              Effect: 'Deny',
              Principal: {
                AWS: '*',
              },
              Resource: [
                {
                  'Fn::GetAtt': [
                    'TrailS30071F172',
                    'Arn',
                  ],
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      {
                        'Fn::GetAtt': [
                          'TrailS30071F172',
                          'Arn',
                        ],
                      },
                      '/*',
                    ],
                  ],
                },
              ],
            },
            {
              Action: 's3:GetBucketAcl',
              Effect: 'Allow',
              Principal: { Service: 'cloudtrail.amazonaws.com' },
              Resource: { 'Fn::GetAtt': ['TrailS30071F172', 'Arn'] },
            },
            {
              Action: 's3:PutObject',
              Condition: {
                StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' },
              },
              Effect: 'Allow',
              Principal: { Service: 'cloudtrail.amazonaws.com' },
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    { 'Fn::GetAtt': ['TrailS30071F172', 'Arn'] },
                    '/someprefix/AWSLogs/123456789012/*',
                  ],
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
      });
    });

    test('encryption keys', () => {
      const stack = new Stack();
      const key = new kms.Key(stack, 'key');
      new Trail(stack, 'EncryptionKeyTrail', {
        trailName: 'EncryptionKeyTrail',
        encryptionKey: key,
      });
      new Trail(stack, 'KmsKeyTrail', {
        trailName: 'KmsKeyTrail',
        encryptionKey: key,
      });
      new Trail(stack, 'UnencryptedTrail', {
        trailName: 'UnencryptedTrail',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
        TrailName: 'EncryptionKeyTrail',
        KMSKeyId: {
          'Fn::GetAtt': ['keyFEDD6EC0', 'Arn'],
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
        TrailName: 'KmsKeyTrail',
        KMSKeyId: {
          'Fn::GetAtt': ['keyFEDD6EC0', 'Arn'],
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
        TrailName: 'UnencryptedTrail',
        KMSKeyId: Match.absent(),
      });
    });

    testDeprecated('Both kmsKey and encryptionKey must not be specified', () => {
      const stack = new Stack();
      const key = new kms.Key(stack, 'key');

      expect(() => new Trail(stack, 'ErrorTrail', {
        trailName: 'ErrorTrail',
        encryptionKey: key,
        kmsKey: key,
      })).toThrow(/Both kmsKey and encryptionKey must not be specified/);
    });

    describe('with cloud watch logs', () => {
      test('enabled', () => {
        const stack = getTestStack();
        new Trail(stack, 'MyAmazingCloudTrail', {
          sendToCloudWatchLogs: true,
        });

        Template.fromStack(stack).resourceCountIs('AWS::CloudTrail::Trail', 1);
        Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
        Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', ExpectedBucketPolicyProperties);
        Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
        Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
        Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', { RetentionInDays: 365 });
        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [{
              Effect: 'Allow',
              Action: ['logs:PutLogEvents', 'logs:CreateLogStream'],
              Resource: {
                'Fn::GetAtt': ['MyAmazingCloudTrailLogGroup2BE67F87', 'Arn'],
              },
            }],
          },
          PolicyName: logsRolePolicyName,
          Roles: [{ Ref: 'MyAmazingCloudTrailLogsRoleF2CCF977' }],
        });
        const trail: any = Template.fromStack(stack).toJSON().Resources.MyAmazingCloudTrail54516E8D;
        expect(trail.DependsOn).toEqual([logsRolePolicyName, logsRoleName, 'MyAmazingCloudTrailS3Policy39C120B0']);
      });

      test('enabled and custom retention', () => {
        const stack = getTestStack();
        new Trail(stack, 'MyAmazingCloudTrail', {
          sendToCloudWatchLogs: true,
          cloudWatchLogsRetention: RetentionDays.ONE_WEEK,
        });

        Template.fromStack(stack).resourceCountIs('AWS::CloudTrail::Trail', 1);
        Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
        Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', ExpectedBucketPolicyProperties);
        Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
        Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
        Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
          RetentionInDays: 7,
        });
        const trail: any = Template.fromStack(stack).toJSON().Resources.MyAmazingCloudTrail54516E8D;
        expect(trail.DependsOn).toEqual([logsRolePolicyName, logsRoleName, 'MyAmazingCloudTrailS3Policy39C120B0']);
      });

      test('enabled and with custom log group', () => {
        const stack = getTestStack();
        const cloudWatchLogGroup = new LogGroup(stack, 'MyLogGroup', {
          retention: RetentionDays.FIVE_DAYS,
        });
        new Trail(stack, 'MyAmazingCloudTrail', {
          sendToCloudWatchLogs: true,
          cloudWatchLogsRetention: RetentionDays.ONE_WEEK,
          cloudWatchLogGroup,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
          RetentionInDays: 5,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
          CloudWatchLogsLogGroupArn: stack.resolve(cloudWatchLogGroup.logGroupArn),
        });

        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [Match.objectLike({
              Resource: stack.resolve(cloudWatchLogGroup.logGroupArn),
            })],
          },
        });
      });

      test('disabled', () => {
        const stack = getTestStack();
        const t = new Trail(stack, 'MyAmazingCloudTrail', {
          sendToCloudWatchLogs: false,
          cloudWatchLogsRetention: RetentionDays.ONE_WEEK,
        });
        expect(t.logGroup).toBeUndefined();
        Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
      });
    });

    describe('with event selectors', () => {
      test('all s3 events', () => {
        const stack = getTestStack();

        const cloudTrail = new Trail(stack, 'MyAmazingCloudTrail');
        cloudTrail.logAllS3DataEvents();

        Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
          EventSelectors: [
            {
              DataResources: [{
                Type: 'AWS::S3::Object',
                Values: [
                  {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          Ref: 'AWS::Partition',
                        },
                        ':s3:::',
                      ],
                    ],
                  },
                ],
              }],
              IncludeManagementEvents: Match.absent(),
              ReadWriteType: Match.absent(),
            },
          ],
        });
      });

      test('specific s3 buckets and objects', () => {
        const stack = getTestStack();
        const bucket = new s3.Bucket(stack, 'testBucket', { bucketName: 'test-bucket' });

        const cloudTrail = new Trail(stack, 'MyAmazingCloudTrail');
        cloudTrail.addS3EventSelector([{ bucket }]);
        cloudTrail.addS3EventSelector([{
          bucket,
          objectPrefix: 'prefix-1/prefix-2',
        }]);

        Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
          EventSelectors: [
            {
              DataResources: [{
                Type: 'AWS::S3::Object',
                Values: [{
                  'Fn::Join': [
                    '',
                    [
                      { 'Fn::GetAtt': ['testBucketDF4D7D1A', 'Arn'] },
                      '/',
                    ],
                  ],
                }],
              }],
            },
            {
              DataResources: [{
                Type: 'AWS::S3::Object',
                Values: [{
                  'Fn::Join': [
                    '',
                    [
                      { 'Fn::GetAtt': ['testBucketDF4D7D1A', 'Arn'] },
                      '/prefix-1/prefix-2',
                    ],
                  ],
                }],
              }],
            },
          ],
        });
      });

      test('no s3 event selector when list is empty', () => {
        const stack = getTestStack();
        const cloudTrail = new Trail(stack, 'MyAmazingCloudTrail');
        cloudTrail.addS3EventSelector([]);
        Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
          EventSelectors: [],
        });
      });

      test('with hand-specified props', () => {
        const stack = getTestStack();

        const cloudTrail = new Trail(stack, 'MyAmazingCloudTrail');
        cloudTrail.logAllS3DataEvents({ includeManagementEvents: false, readWriteType: ReadWriteType.READ_ONLY });

        Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
          EventSelectors: [
            {
              DataResources: [{
                Type: 'AWS::S3::Object',
                Values: [
                  {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          Ref: 'AWS::Partition',
                        },
                        ':s3:::',
                      ],
                    ],
                  },
                ],
              }],
              IncludeManagementEvents: false,
              ReadWriteType: 'ReadOnly',
            },
          ],
        });
      });

      test('with management event', () => {
        const stack = getTestStack();

        new Trail(stack, 'MyAmazingCloudTrail', { managementEvents: ReadWriteType.WRITE_ONLY });

        Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
          EventSelectors: [
            {
              IncludeManagementEvents: true,
              ReadWriteType: 'WriteOnly',
            },
          ],
        });
      });

      test('exclude management events', () => {
        const stack = getTestStack();
        const bucket = new s3.Bucket(stack, 'testBucket', { bucketName: 'test-bucket' });
        const cloudTrail = new Trail(stack, 'MyAmazingCloudTrail');
        cloudTrail.addS3EventSelector([{ bucket }], {
          excludeManagementEventSources: [
            ManagementEventSources.KMS,
            ManagementEventSources.RDS_DATA_API,
          ],
        });
        cloudTrail.addS3EventSelector([{ bucket }], {
          excludeManagementEventSources: [],
        });

        Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
          EventSelectors: [
            {
              DataResources: [{
                Type: 'AWS::S3::Object',
                Values: [{
                  'Fn::Join': [
                    '',
                    [
                      { 'Fn::GetAtt': ['testBucketDF4D7D1A', 'Arn'] },
                      '/',
                    ],
                  ],
                }],
              }],
              ExcludeManagementEventSources: [
                'kms.amazonaws.com',
                'rdsdata.amazonaws.com',
              ],
            },
            {
              DataResources: [{
                Type: 'AWS::S3::Object',
                Values: [{
                  'Fn::Join': [
                    '',
                    [
                      { 'Fn::GetAtt': ['testBucketDF4D7D1A', 'Arn'] },
                      '/',
                    ],
                  ],
                }],
              }],
              ExcludeManagementEventSources: [],
            },
          ],
        });
      });

      test('for Lambda function data event', () => {
        const stack = getTestStack();
        const lambdaFunction = new lambda.Function(stack, 'LambdaFunction', {
          runtime: lambda.Runtime.NODEJS_14_X,
          handler: 'hello.handler',
          code: lambda.Code.fromInline('exports.handler = {}'),
        });

        const cloudTrail = new Trail(stack, 'MyAmazingCloudTrail');
        cloudTrail.addLambdaEventSelector([lambdaFunction]);

        Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
          EventSelectors: [
            {
              DataResources: [{
                Type: 'AWS::Lambda::Function',
                Values: [{
                  'Fn::GetAtt': ['LambdaFunctionBF21E41F', 'Arn'],
                }],
              }],
            },
          ],
        });
      });

      test('for all Lambda function data events', () => {
        const stack = getTestStack();

        const cloudTrail = new Trail(stack, 'MyAmazingCloudTrail');
        cloudTrail.logAllLambdaDataEvents();

        Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
          EventSelectors: [
            {
              DataResources: [{
                Type: 'AWS::Lambda::Function',
                Values: [
                  {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          Ref: 'AWS::Partition',
                        },
                        ':lambda',
                      ],
                    ],
                  },
                ],
              }],
            },
          ],
        });
      });

      test('not provided and managementEvents set to None throws missing event selectors error', () => {
        const stack = getTestStack();

        new Trail(stack, 'MyAmazingCloudTrail', {
          managementEvents: ReadWriteType.NONE,
        });

        expect(() => {
          Template.fromStack(stack);
        }).toThrowError(/At least one event selector must be added when management event recording is set to None/);
      });

      test('defaults to not include management events when managementEvents set to None', () => {
        const stack = getTestStack();

        const cloudTrail = new Trail(stack, 'MyAmazingCloudTrail', {
          managementEvents: ReadWriteType.NONE,
        });

        const bucket = new s3.Bucket(stack, 'testBucket', { bucketName: 'test-bucket' });
        cloudTrail.addS3EventSelector([{ bucket }]);

        Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
          EventSelectors: [{
            DataResources: [{
              Type: 'AWS::S3::Object',
              Values: [{
                'Fn::Join': [
                  '',
                  [
                    { 'Fn::GetAtt': ['testBucketDF4D7D1A', 'Arn'] },
                    '/',
                  ],
                ],
              }],
            }],
            IncludeManagementEvents: false,
          }],
        });
      });

      test('includeManagementEvents can be overridden when managementEvents set to None', () => {
        const stack = getTestStack();

        const cloudTrail = new Trail(stack, 'MyAmazingCloudTrail', {
          managementEvents: ReadWriteType.NONE,
        });

        const bucket = new s3.Bucket(stack, 'testBucket', { bucketName: 'test-bucket' });
        cloudTrail.addS3EventSelector([{ bucket }], {
          includeManagementEvents: true,
          readWriteType: ReadWriteType.WRITE_ONLY,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
          EventSelectors: [{
            DataResources: [{
              Type: 'AWS::S3::Object',
              Values: [{
                'Fn::Join': [
                  '',
                  [
                    { 'Fn::GetAtt': ['testBucketDF4D7D1A', 'Arn'] },
                    '/',
                  ],
                ],
              }],
            }],
            IncludeManagementEvents: true,
            ReadWriteType: 'WriteOnly',
          }],
        });
      });

      test('isOrganizationTrail is passed correctly', () => {
        const stack = getTestStack();

        new Trail(stack, 'OrganizationTrail', {
          isOrganizationTrail: true,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
          IsOrganizationTrail: true,
        });
      });

      test('isOrganizationTrail defaults to not defined', () => {
        const stack = getTestStack();

        new Trail(stack, 'OrganizationTrail');

        Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', Match.objectEquals({
          IsLogging: true,
          S3BucketName: Match.anyValue(),
          EnableLogFileValidation: true,
          EventSelectors: [],
          IncludeGlobalServiceEvents: true,
          IsMultiRegionTrail: true,
        }));
      });
    });
  });

  describe('onEvent', () => {
    test('add an event rule', () => {
      // GIVEN
      const stack = getTestStack();

      // WHEN
      Trail.onEvent(stack, 'DoEvents', {
        target: {
          bind: () => ({
            id: '',
            arn: 'arn',
          }),
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        EventPattern: {
          'detail-type': [
            'AWS API Call via CloudTrail',
          ],
        },
        State: 'ENABLED',
        Targets: [
          {
            Arn: 'arn',
            Id: 'Target0',
          },
        ],
      });
    });
  });
  describe('insights ', () => {
    test('no properties', () => {
      const stack = getTestStack();
      new Trail(stack, 'MyAmazingCloudTrail', {
        insightTypes: [],
      });
      Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
        InsightSelectors: [],
      });
    });
    test('API Call Rate properties', () => {
      const stack = getTestStack();
      new Trail(stack, 'MyAmazingCloudTrail', {
        insightTypes: [
          InsightType.API_CALL_RATE,
        ],
      });
      Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
        InsightSelectors: [{
          InsightType: 'ApiCallRateInsight',
        }],
      });
    });
    test('API Error Rate properties', () => {
      const stack = getTestStack();
      new Trail(stack, 'MyAmazingCloudTrail', {
        insightTypes: [
          InsightType.API_ERROR_RATE,
        ],
      });
      Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
        InsightSelectors: [{
          InsightType: 'ApiErrorRateInsight',
        }],
      });
    });
    test('duplicate properties', () => {
      const stack = getTestStack();
      new Trail(stack, 'MyAmazingCloudTrail', {
        insightTypes: [
          InsightType.API_CALL_RATE,
          InsightType.API_CALL_RATE,
        ],
      });
      Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
        InsightSelectors: [
          {
            InsightType: 'ApiCallRateInsight',
          },
          {
            InsightType: 'ApiCallRateInsight',
          },
        ],
      });
    });
    test('ALL properties', () => {
      const stack = getTestStack();
      new Trail(stack, 'MyAmazingCloudTrail', {
        insightTypes: [
          InsightType.API_CALL_RATE,
          InsightType.API_ERROR_RATE,
        ],
      });
      Template.fromStack(stack).hasResourceProperties('AWS::CloudTrail::Trail', {
        InsightSelectors: [
          {
            InsightType: 'ApiCallRateInsight',
          },
          {
            InsightType: 'ApiErrorRateInsight',
          },
        ],
      });
    });
  });
});