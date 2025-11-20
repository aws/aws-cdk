import { Stack } from 'aws-cdk-lib';
import { Bucket, BucketPolicy, CfnBucketPolicy } from 'aws-cdk-lib/aws-s3';
import { FirehoseDeliveryDestination, LogsDeliveryDestination, S3DeliveryDestination, XRayDeliveryDestination } from '../../../lib/services/aws-logs/vended-logs';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { AccountRootPrincipal, Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { DeliveryStream, S3Bucket } from 'aws-cdk-lib/aws-kinesisfirehose';
import { LogGroup, ResourcePolicy, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

describe('S3 Delivery Destination', () => {
  test('creates an S3 delivery destination when given a bucket', () => {
    const stack = new Stack();
    const bucket = new Bucket(stack, 'Destination');

    new S3DeliveryDestination(stack, 'S3Destination', {
      permissionsVersion: 'V2',
      s3Bucket: bucket,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationType: 'S3',
      DestinationResourceArn: {
        'Fn::GetAtt': [
          'Destination920A3C57',
          'Arn',
        ],
      },
      Name: Match.stringLikeRegexp('cdk-s3-dest-.*'),
    });

    // Validate that DeliveryDestination depends on the S3 bucket policy
    const template = Template.fromStack(stack);
    const deliveryDestinations = template.findResources('AWS::Logs::DeliveryDestination');
    const bucketPolicies = template.findResources('AWS::S3::BucketPolicy');

    const deliveryDestinationLogicalId = Object.keys(deliveryDestinations)[0];
    const bucketPolicyLogicalId = Object.keys(bucketPolicies)[0];

    expect(deliveryDestinations[deliveryDestinationLogicalId].DependsOn).toContain(bucketPolicyLogicalId);
  });

  test('able to make multiple delivery destinations that use the same bucket', () => {
    const stack = new Stack();
    const bucket = new Bucket(stack, 'Destination');

    new S3DeliveryDestination(stack, 'S3Destination1', {
      permissionsVersion: 'V1',
      s3Bucket: bucket,
    });

    new S3DeliveryDestination(stack, 'S3Destination2', {
      permissionsVersion: 'V2',
      s3Bucket: bucket,
    });

    Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliveryDestination', 2);
  });

  test('creates policy with V1 permissions if specified', () => {
    const stack = new Stack();
    const bucket = new Bucket(stack, 'Destination');

    new S3DeliveryDestination(stack, 'S3Destination', {
      permissionsVersion: 'V1',
      s3Bucket: bucket,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
      Bucket: {
        Ref: 'Destination920A3C57',
      },
      PolicyDocument: {
        Statement: [
          {
            Action: 's3:PutObject',
            Condition: {
              StringEquals: {
                's3:x-amz-acl': 'bucket-owner-full-control',
                'aws:SourceAccount': {
                  Ref: 'AWS::AccountId',
                },
              },
              ArnLike: {
                'aws:SourceArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':logs:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':delivery-source:*',
                    ],
                  ],
                },
              },
            },
            Effect: 'Allow',
            Principal: {
              Service: 'delivery.logs.amazonaws.com',
            },
            Resource: {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      'Destination920A3C57',
                      'Arn',
                    ],
                  },
                  '/AWSLogs/',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  '/*',
                ],
              ],
            },
          },
          {
            Action: [
              's3:GetBucketAcl',
              's3:ListBucket',
            ],
            Condition: {
              StringEquals: {
                'aws:SourceAccount': {
                  Ref: 'AWS::AccountId',
                },
              },
              ArnLike: {
                'aws:SourceArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':logs:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':*',
                    ],
                  ],
                },
              },
            },
            Effect: 'Allow',
            Principal: {
              Service: 'delivery.logs.amazonaws.com',
            },
            Resource: {
              'Fn::GetAtt': [
                'Destination920A3C57',
                'Arn',
              ],
            },
          },
        ],
      },
    });
  });

  test('creates policy with V2 permissions if specified', () => {
    const stack = new Stack();
    const bucket = new Bucket(stack, 'Destination');

    new S3DeliveryDestination(stack, 'S3Destination', {
      permissionsVersion: 'V2',
      s3Bucket: bucket,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
      Bucket: {
        Ref: 'Destination920A3C57',
      },
      PolicyDocument: {
        Statement: [
          {
            Action: 's3:PutObject',
            Condition: {
              StringEquals: {
                's3:x-amz-acl': 'bucket-owner-full-control',
                'aws:SourceAccount': {
                  Ref: 'AWS::AccountId',
                },
              },
              ArnLike: {
                'aws:SourceArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':logs:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':delivery-source:*',
                    ],
                  ],
                },
              },
            },
            Effect: 'Allow',
            Principal: {
              Service: 'delivery.logs.amazonaws.com',
            },
            Resource: {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      'Destination920A3C57',
                      'Arn',
                    ],
                  },
                  '/AWSLogs/',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  '/*',
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('adds to existing policy if a BucketPolicy already exists', () => {
    const stack = new Stack();
    const bucket = new Bucket(stack, 'Destination');

    new BucketPolicy(stack, 'S3BucketPolicy', {
      bucket: bucket,
      document: new PolicyDocument({
        statements: [new PolicyStatement({
          effect: Effect.ALLOW,
          principals: [new AccountRootPrincipal()],
          actions: ['s3:GetObject'],
          resources: [bucket.arnForObjects('*')],
        })],
      }),
    });

    new S3DeliveryDestination(stack, 'S3Destination', {
      permissionsVersion: 'V2',
      s3Bucket: bucket,
    });

    Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 1);
  });
  
  test('adds to existing policy if a CfnBucketPolicy already exists', () => {
    const stack = new Stack();
    const bucket = new Bucket(stack, 'Destination');

    new CfnBucketPolicy(stack, 'S3BucketPolicy', {
      bucket: bucket.bucketName,
      policyDocument: new PolicyDocument({
        statements: [new PolicyStatement({
          effect: Effect.ALLOW,
          principals: [new AccountRootPrincipal()],
          actions: ['s3:GetObject'],
          resources: [bucket.arnForObjects('*')],
        })],
      }).toJSON(),
    });

    new S3DeliveryDestination(stack, 'S3Destination', {
      permissionsVersion: 'V2',
      s3Bucket: bucket,
    });

    Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
      Bucket: {
        Ref: 'Destination920A3C57',
      },
      PolicyDocument: {
        Statement: [
          {
            Action: 's3:GetObject',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':iam::',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':root',
                  ],
                ],
              },
            },
            Resource: {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      'Destination920A3C57',
                      'Arn',
                    ],
                  },
                  '/*',
                ],
              ],
            },
          },
          {
            Action: 's3:PutObject',
            Condition: {
              StringEquals: {
                's3:x-amz-acl': 'bucket-owner-full-control',
                'aws:SourceAccount': {
                  Ref: 'AWS::AccountId',
                },
              },
              ArnLike: {
                'aws:SourceArn': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':logs:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':delivery-source:*',
                    ],
                  ],
                },
              },
            },
            Effect: 'Allow',
            Principal: {
              Service: 'delivery.logs.amazonaws.com',
            },
            Resource: {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      'Destination920A3C57',
                      'Arn',
                    ],
                  },
                  '/AWSLogs/',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  '/*',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    },
    );
  });
});

describe('Cloudwatch Logs Delivery Destination', () => {
  test('creates a Cloudwatch Delivery Destination when given a log group', () => {
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroupDelivery', {
      logGroupName: 'test-log-group',
      retention: RetentionDays.ONE_WEEK,
    });

    new LogsDeliveryDestination(stack, 'CloudwatchDelivery', {
      logGroup,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationType: 'CWL',
      DestinationResourceArn: {
        'Fn::GetAtt': [
          'LogGroupDelivery0EF9ECE4',
          'Arn',
        ],
      },
      Name: Match.stringLikeRegexp('cdk-cwl-dest-.*'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::ResourcePolicy', {
      PolicyDocument: {
        'Fn::Join': [
          '',
          [
            '{"Statement":[{"Action":["logs:CreateLogStream","logs:PutLogEvents"],"Condition":{"StringEquals":{"aws:SourceAccount":"',
            {
              Ref: 'AWS::AccountId',
            },
            '"},"ArnLike":{"aws:SourceArn":"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':logs:',
            {
              Ref: 'AWS::Region',
            },
            ':',
            {
              Ref: 'AWS::AccountId',
            },
            ':*"}},"Effect":"Allow","Principal":{"Service":"delivery.logs.amazonaws.com"},"Resource":"',
            {
              'Fn::GetAtt': [
                'LogGroupDelivery0EF9ECE4',
                'Arn',
              ],
            },
            ':log-stream:*"}],"Version":"2012-10-17"}',
          ],
        ],
      },
      PolicyName: 'LogDestinationDeliveryPolicy',
    });

    // Validate that DeliveryDestination depends on the Cloudwatch resource policy
    const template = Template.fromStack(stack);
    const deliveryDestinations = template.findResources('AWS::Logs::DeliveryDestination');
    const resourcePolicies = template.findResources('AWS::Logs::ResourcePolicy');

    const deliveryDestinationLogicalId = Object.keys(deliveryDestinations)[0];
    const cwlPolicyLogicalId = Object.keys(resourcePolicies)[0];

    expect(deliveryDestinations[deliveryDestinationLogicalId].DependsOn).toContain(cwlPolicyLogicalId);
  });

  test('if there is an exsiting Cloudwatch resource policy but it is not attached to the root of the stack, make a new one', () => {
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroupDelivery', {
      logGroupName: 'test-log-group',
      retention: RetentionDays.ONE_WEEK,
    });

    logGroup.addToResourcePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal('vpc-flow-logs.amazonaws.com')],
      actions: ['logs:GetLogEvents', 'logs:FilterLogEvents'],
      resources: [logGroup.logGroupArn],
    }));

    new LogsDeliveryDestination(stack, 'CloudwatchDelivery', {
      logGroup,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Logs::ResourcePolicy', 2);
  });

  test('if there is an existing Cloudwatch resource policy at the root of the stack, update it', () => {
    const stack = new Stack();
    new ResourcePolicy(stack, 'CDKCWLLogDestDeliveryPolicy', {
      resourcePolicyName: 'singletonPolicy',
      policyStatements: [],
    });
    const logGroup = new LogGroup(stack, 'LogGroupDelivery', {
      logGroupName: 'test-log-group',
      retention: RetentionDays.ONE_WEEK,
    });

    new LogsDeliveryDestination(stack, 'CloudwatchDelivery', {
      logGroup,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Logs::ResourcePolicy', 1);
  });

  test('creates only one resource policy if multiple Log Delivery Destinations are created', () => {
    const stack = new Stack();
    const logGroup1 = new LogGroup(stack, 'LogGroup1Delivery', {
      logGroupName: 'test-1-log-group',
      retention: RetentionDays.ONE_WEEK,
    });

    const logGroup2 = new LogGroup(stack, 'LogGroup2Delivery', {
      logGroupName: 'test-2-log-group',
      retention: RetentionDays.ONE_WEEK,
    });

    new LogsDeliveryDestination(stack, 'CloudwatchDelivery1', {
      logGroup: logGroup1,
    });

    new LogsDeliveryDestination(stack, 'CloudwatchDelivery2', {
      logGroup: logGroup2,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Logs::ResourcePolicy', 1);
  });

  test('creates a new resource policy if there is an existing resource policy unrelated to Cloudwatch logs', () => {
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroupDelivery', {
      logGroupName: 'test-log-group',
      retention: RetentionDays.ONE_WEEK,
    });

    const secret = new Secret(stack, 'MySecret', {
      description: 'Sample secret with resource policy',
    });

    secret.addToResourcePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new AccountRootPrincipal()],
      actions: ['secretsmanager:GetSecretValue'],
      resources: ['*'],
      conditions: {
        StringEquals: {
          'secretsmanager:ResourceTag/Environment': 'Production',
        },
      },
    }));

    new LogsDeliveryDestination(stack, 'CloudwatchDelivery', {
      logGroup,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Logs::ResourcePolicy', 1);
    Template.fromStack(stack).resourceCountIs('AWS::SecretsManager::ResourcePolicy', 1);
  });

  test('able to make multiple delivery destinations with the same log group', () => {
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroupDelivery', {
      logGroupName: 'test-log-group',
      retention: RetentionDays.ONE_WEEK,
    });

    new LogsDeliveryDestination(stack, 'CloudwatchDelivery1', {
      logGroup,
    });

    new LogsDeliveryDestination(stack, 'CloudwatchDelivery2', {
      logGroup,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Logs::ResourcePolicy', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliveryDestination', 2);
  });
});

describe('Firehose Stream Delivery Destination', () => {
  test('creates a Firehose Delivery Destination when given a delivery stream', () => {
    const stack = new Stack();
    const streamBucket = new Bucket(stack, 'DeliveryBucket', {});
    const firehoseRole = new Role(stack, 'FirehoseRole', {
      assumedBy: new ServicePrincipal('firehose.amazonaws.com'),
      inlinePolicies: {
        S3Access: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['s3:PutObject', 's3:GetObject', 's3:ListBucket'],
              resources: [streamBucket.bucketArn, `${streamBucket.bucketArn}/*`],
            }),
          ],
        }),
      },
    });
    const stream = new DeliveryStream(stack, 'Firehose', {
      destination: new S3Bucket(streamBucket),
      role: firehoseRole,
    });

    new FirehoseDeliveryDestination(stack, 'FirehoseDelivery', {
      deliveryStream: stream,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationType: 'FH',
      DestinationResourceArn: {
        'Fn::GetAtt': [
          'FirehoseEF5AC2A2',
          'Arn',
        ],
      },
      Name: Match.stringLikeRegexp('cdk-fh-dest-.*'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      Tags: Match.arrayWith([Match.objectLike({
        Key: 'LogDeliveryEnabled',
        Value: 'true',
      })]),
    });
  });

  test('able to make multiple delivery destinations that use the same stream', () => {
    const stack = new Stack();
    const streamBucket = new Bucket(stack, 'DeliveryBucket', {});
    const firehoseRole = new Role(stack, 'FirehoseRole', {
      assumedBy: new ServicePrincipal('firehose.amazonaws.com'),
      inlinePolicies: {
        S3Access: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['s3:PutObject', 's3:GetObject', 's3:ListBucket'],
              resources: [streamBucket.bucketArn, `${streamBucket.bucketArn}/*`],
            }),
          ],
        }),
      },
    });
    const stream = new DeliveryStream(stack, 'Firehose', {
      destination: new S3Bucket(streamBucket),
      role: firehoseRole,
    });

    new FirehoseDeliveryDestination(stack, 'FirehoseDelivery1', {
      deliveryStream: stream,
    });

    new FirehoseDeliveryDestination(stack, 'FirehoseDelivery2', {
      deliveryStream: stream,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliveryDestination', 2);
  });
});

describe('XRay Delivery Destination', () => {
  test('creates an XRay Delivery destination', () => {
    const stack = new Stack();

    new XRayDeliveryDestination(stack, 'XRayDestination');

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationType: 'XRAY',
      Name: Match.stringLikeRegexp('cdk-xray-dest-.*'),
    });
  });

  test('when multiple XRay Delivery destinations are created on one stack, only create one XRay resource policy', () => {
    const stack = new Stack();

    new XRayDeliveryDestination(stack, 'XRayDestination1');

    new XRayDeliveryDestination(stack, 'XRayDestination2');

    Template.fromStack(stack).resourceCountIs('AWS::XRay::ResourcePolicy', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliveryDestination', 2);
  });

  test('if XRay Delivery Destinations are in different stacks, make different policies', () => {
    const stack1 = new Stack();
    const stack2 = new Stack();

    new XRayDeliveryDestination(stack1, 'XRayDestination1');

    new XRayDeliveryDestination(stack2, 'XRayDestination2');

    Template.fromStack(stack1).resourceCountIs('AWS::XRay::ResourcePolicy', 1);
    Template.fromStack(stack1).resourceCountIs('AWS::Logs::DeliveryDestination', 1);
    Template.fromStack(stack2).resourceCountIs('AWS::XRay::ResourcePolicy', 1);
    Template.fromStack(stack2).resourceCountIs('AWS::Logs::DeliveryDestination', 1);
  });
});
