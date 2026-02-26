import { App, Stack } from 'aws-cdk-lib';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { DeliveryStream, CfnDeliveryStream, S3Bucket } from 'aws-cdk-lib/aws-kinesisfirehose';
import { CfnLogGroup, LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { CfnKey, Key } from 'aws-cdk-lib/aws-kms';
import { CloudwatchDeliveryDestination, FirehoseDeliveryDestination, S3DeliveryDestination, S3LogsDeliveryPermissionsVersion, XRayDeliveryDestination } from '../../../lib/services/aws-logs';
import { Match, Template } from 'aws-cdk-lib/assertions';

// at the time of creating this test file S3 does not support Vended Logs on Buckets but this test pretends they do to make writing tests easier
describe('cross acount destination', () => {
  let stack: Stack;
  let sourceAccount = '111111111111';

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'DestStack', { env: { account: '222222222222' } });
  });

  test('when sourceAccountId is provided to S3 destination, destinationPolicy added', () => {
    const bucket = new Bucket(stack, 'Destination');

    new S3DeliveryDestination(stack, 'DeliveryDestination', {
      bucket,
      sourceAccountId: sourceAccount,
    });
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliveryDestination', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationPolicy: {
        DeliveryDestinationPolicy: {
          Statement: [
            {
              Action: 'logs:CreateDelivery',
              Effect: 'Allow',
              Principal: {
                AWS: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      { Ref: 'AWS::Partition' },
                      `:iam::${sourceAccount}:root`,
                    ],
                  ],
                },
              },
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':logs:',
                    { Ref: 'AWS::Region' },
                    ':222222222222:delivery-destination:*',
                  ],
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
      },
    });
  });

  test('when sourceAccountId is provided to S3 destination, bucket is granted cross account permissions for V2', () => {
    const bucket = new Bucket(stack, 'Destination');

    new S3DeliveryDestination(stack, 'DeliveryDestination', {
      bucket,
      permissionsVersion: S3LogsDeliveryPermissionsVersion.V2,
      sourceAccountId: sourceAccount,
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
                'aws:SourceAccount': '111111111111',
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
                      ':111111111111:delivery-source:*',
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
                  '/AWSLogs/111111111111/*',
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

  test('when sourceAccountId is provided to S3 destination, bucket is granted cross account permissions for V1', () => {
    const bucket = new Bucket(stack, 'Destination');

    new S3DeliveryDestination(stack, 'DeliveryDestination', {
      bucket,
      permissionsVersion: S3LogsDeliveryPermissionsVersion.V1,
      sourceAccountId: sourceAccount,
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
                'aws:SourceAccount': '111111111111',
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
                      ':111111111111:delivery-source:*',
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
                  '/AWSLogs/111111111111/*',
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
                'aws:SourceAccount': '111111111111',
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
                      ':111111111111:*',
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

  test('when sourceAccountId is provided to Firehose destination, destinationPolicy added', () => {
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
      sourceAccountId: sourceAccount,
    });
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliveryDestination', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationPolicy: {
        DeliveryDestinationPolicy: {
          Statement: [
            {
              Action: 'logs:CreateDelivery',
              Effect: 'Allow',
              Principal: {
                AWS: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      { Ref: 'AWS::Partition' },
                      `:iam::${sourceAccount}:root`,
                    ],
                  ],
                },
              },
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':logs:',
                    { Ref: 'AWS::Region' },
                    ':222222222222:delivery-destination:*',
                  ],
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
      },
    });
  });

  test('adds cross account KMS key policy when bucket with key participates in cross account delivery', () => {
    const key = new Key(stack, 'EncryptionKey');
    const bucket = new Bucket(stack, 'Destination', {
      encryptionKey: key,
    });

    new S3DeliveryDestination(stack, 'S3Dest', {
      bucket,
      encryptionKey: key,
      sourceAccountId: sourceAccount,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Sid: 'AWS CDK: Allow Logs Delivery to use the key',
            Effect: 'Allow',
            Principal: {
              Service: 'delivery.logs.amazonaws.com',
            },
            Action: 'kms:GenerateDataKey*',
            Resource: '*',
            Condition: {
              StringEquals: {
                'aws:SourceAccount': ['111111111111'],
              },
              ArnLike: {
                'aws:SourceArn': [{
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      { Ref: 'AWS::Partition' },
                      ':logs:',
                      { Ref: 'AWS::Region' },
                      ':111111111111:delivery-source:*',
                    ],
                  ],
                }],
              },
            },
          }),
        ]),
      },
    });
  });
});

describe('Firehose destination', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('creates firehose destination with L2', () => {
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

    new FirehoseDeliveryDestination(stream, 'FHDest', {
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
      Name: Match.stringLikeRegexp('cdk-fh-FHDest-dest-.*'),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      Tags: Match.arrayWith([Match.objectLike({
        Key: 'LogDeliveryEnabled',
        Value: 'true',
      })]),
    });
  });

  test('creates firehose destination with L1', () => {
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
    const stream = new CfnDeliveryStream(stack, 'Firehose', {
      s3DestinationConfiguration: {
        bucketArn: streamBucket.bucketArn,
        roleArn: firehoseRole.roleArn,
      },
    });

    new FirehoseDeliveryDestination(stream, 'FHDest', {
      deliveryStream: stream,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationType: 'FH',
      DestinationResourceArn: {
        'Fn::GetAtt': [
          'Firehose',
          'Arn',
        ],
      },
      Name: Match.stringLikeRegexp('cdk-fh-FHDest-dest-.*'),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      Tags: Match.arrayWith([Match.objectLike({
        Key: 'LogDeliveryEnabled',
        Value: 'true',
      })]),
    });
  });

  test('uses outputFormat when provided', () => {
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
    const stream = new CfnDeliveryStream(stack, 'Firehose', {
      s3DestinationConfiguration: {
        bucketArn: streamBucket.bucketArn,
        roleArn: firehoseRole.roleArn,
      },
    });

    new FirehoseDeliveryDestination(stream, 'FHDest', {
      deliveryStream: stream,
      outputFormat: 'raw',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationType: 'FH',
      DestinationResourceArn: {
        'Fn::GetAtt': [
          'Firehose',
          'Arn',
        ],
      },
      OutputFormat: 'raw',
      Name: Match.stringLikeRegexp('cdk-fh-FHDest-dest-.*'),
    });
  });
});

describe('Cloudwatch destination', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('creates log group destination with L2', () => {
    const logGroup = new LogGroup(stack, 'LogGroupDelivery', {
      logGroupName: 'test-log-group',
      retention: RetentionDays.ONE_WEEK,
    });

    new CloudwatchDeliveryDestination(logGroup, 'CWLDest', {
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
      Name: Match.stringLikeRegexp('cdk-cwl-CWLDest-dest-.*'),
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
      PolicyName: 'LogGroupDelivery',
    });

    // Validate that DeliveryDestination depends on the Cloudwatch resource policy
    const template = Template.fromStack(stack);
    const deliveryDestinations = template.findResources('AWS::Logs::DeliveryDestination');
    const resourcePolicies = template.findResources('AWS::Logs::ResourcePolicy');

    const deliveryDestinationLogicalId = Object.keys(deliveryDestinations)[0];
    const cwlPolicyLogicalId = Object.keys(resourcePolicies)[0];

    expect(deliveryDestinations[deliveryDestinationLogicalId].DependsOn).toContain(cwlPolicyLogicalId);
  });

  test('creates log group destination with L1', () => {
    const logGroup = new CfnLogGroup(stack, 'LogGroup', {
      retentionInDays: 7,
      logGroupName: 'myCoolLogGroup',
    });

    new CloudwatchDeliveryDestination(logGroup, 'CWLDest', {
      logGroup,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationType: 'CWL',
      DestinationResourceArn: {
        'Fn::GetAtt': [
          'LogGroup',
          'Arn',
        ],
      },
      Name: Match.stringLikeRegexp('cdk-cwl-CWLDest-dest-.*'),
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
                'LogGroup',
                'Arn',
              ],
            },
            ':log-stream:*"}],"Version":"2012-10-17"}',
          ],
        ],
      },
      PolicyName: 'LogGroup',
    });

    // Validate that DeliveryDestination depends on the Cloudwatch resource policy
    const template = Template.fromStack(stack);
    const deliveryDestinations = template.findResources('AWS::Logs::DeliveryDestination');
    const resourcePolicies = template.findResources('AWS::Logs::ResourcePolicy');

    const deliveryDestinationLogicalId = Object.keys(deliveryDestinations)[0];
    const cwlPolicyLogicalId = Object.keys(resourcePolicies)[0];

    expect(deliveryDestinations[deliveryDestinationLogicalId].DependsOn).toContain(cwlPolicyLogicalId);
  });

  test('uses outputFormat when provided', () => {
    const logGroup = new CfnLogGroup(stack, 'LogGroup', {
      retentionInDays: 7,
      logGroupName: 'myCoolLogGroup',
    });

    new CloudwatchDeliveryDestination(logGroup, 'CWLDest', {
      logGroup,
      outputFormat: 'json',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationType: 'CWL',
      DestinationResourceArn: {
        'Fn::GetAtt': [
          'LogGroup',
          'Arn',
        ],
      },
      OutputFormat: 'json',
      Name: Match.stringLikeRegexp('cdk-cwl-CWLDest-dest-.*'),
    });
  });
});

describe('S3 Destination', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('creates s3 destination with L2', () => {
    const bucket = new Bucket(stack, 'Destination');

    new S3DeliveryDestination(bucket, 'S3Dest', {
      bucket,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationType: 'S3',
      DestinationResourceArn: {
        'Fn::GetAtt': [
          Match.stringLikeRegexp('Destination.*'),
          'Arn',
        ],
      },
      Name: Match.stringLikeRegexp('cdk-s3-S3Dest-dest-.*'),
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
        Version: '2012-10-17',
      },
    },
    );

    // Validate that DeliveryDestination depends on the S3 bucket policy
    const template = Template.fromStack(stack);
    const deliveryDestinations = template.findResources('AWS::Logs::DeliveryDestination');
    const bucketPolicies = template.findResources('AWS::S3::BucketPolicy');

    const deliveryDestinationLogicalId = Object.keys(deliveryDestinations)[0];
    const bucketPolicyLogicalId = Object.keys(bucketPolicies)[0];

    expect(deliveryDestinations[deliveryDestinationLogicalId].DependsOn).toContain(bucketPolicyLogicalId);
  });

  test('creates S3 destination with L1', () => {
    const bucket = new Bucket(stack, 'Destination');

    new S3DeliveryDestination(bucket, 'S3Dest', {
      bucket,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationType: 'S3',
      DestinationResourceArn: {
        'Fn::GetAtt': [
          'Destination920A3C57',
          'Arn',
        ],
      },
      Name: Match.stringLikeRegexp('cdk-s3-S3Dest-dest-.*'),
    });

    // Validate that DeliveryDestination depends on the S3 bucket policy
    const template = Template.fromStack(stack);
    const deliveryDestinations = template.findResources('AWS::Logs::DeliveryDestination');
    const bucketPolicies = template.findResources('AWS::S3::BucketPolicy');

    const deliveryDestinationLogicalId = Object.keys(deliveryDestinations)[0];
    const bucketPolicyLogicalId = Object.keys(bucketPolicies)[0];

    expect(deliveryDestinations[deliveryDestinationLogicalId].DependsOn).toContain(bucketPolicyLogicalId);
  });

  test('adds proper key permissions for L1 bucket with L1 key', () => {
    const key = new CfnKey(stack, 'L1Key');
    const bucket = new CfnBucket(stack, 'L1Bucket', {
      bucketEncryption: {
        serverSideEncryptionConfiguration: [{
          bucketKeyEnabled: true,
          serverSideEncryptionByDefault: {
            kmsMasterKeyId: key.attrKeyId,
            sseAlgorithm: 'aws:kms',
          },
        }],
      },
    });

    new S3DeliveryDestination(bucket, 'L1Dest', {
      bucket,
      encryptionKey: key,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Sid: 'AWS CDK: Allow Logs Delivery to use the key',
            Effect: 'Allow',
            Principal: {
              Service: 'delivery.logs.amazonaws.com',
            },
            Action: ['kms:Encrypt', 'kms:Decrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*', 'kms:DescribeKey'],
            Resource: '*',
            Condition: {
              StringEquals: {
                'aws:SourceAccount': [{ Ref: 'AWS::AccountId' }],
              },
              ArnLike: {
                'aws:SourceArn': [{
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      { Ref: 'AWS::Partition' },
                      ':logs:',
                      { Ref: 'AWS::Region' },
                      ':',
                      { Ref: 'AWS::AccountId' },
                      ':delivery-source:*',
                    ],
                  ],
                }],
              },
            },
          }),
        ]),
      },
    });
  });

  test('adds proper key permissions for L2 bucket with L2 key', () => {
    const key = new Key(stack, 'L2Key');
    const bucket = new Bucket(stack, 'L2Bucket', {
      encryptionKey: key,
    });

    new S3DeliveryDestination(bucket, 'L2Dest', {
      bucket,
      encryptionKey: key,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Sid: 'AWS CDK: Allow Logs Delivery to use the key',
            Effect: 'Allow',
            Principal: {
              Service: 'delivery.logs.amazonaws.com',
            },
            Action: ['kms:Encrypt', 'kms:Decrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*', 'kms:DescribeKey'],
            Resource: '*',
            Condition: {
              StringEquals: {
                'aws:SourceAccount': [{ Ref: 'AWS::AccountId' }],
              },
              ArnLike: {
                'aws:SourceArn': [{
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      { Ref: 'AWS::Partition' },
                      ':logs:',
                      { Ref: 'AWS::Region' },
                      ':',
                      { Ref: 'AWS::AccountId' },
                      ':delivery-source:*',
                    ],
                  ],
                }],
              },
            },
          }),
        ]),
      },
    });
  });

  test('uses outputFormat when provided', () => {
    const bucket = new Bucket(stack, 'Bucket', {});

    new S3DeliveryDestination(bucket, 'Dest', {
      bucket,
      outputFormat: 'w3c',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationType: 'S3',
      DestinationResourceArn: {
        'Fn::GetAtt': [
          'Bucket83908E77',
          'Arn',
        ],
      },
      OutputFormat: 'w3c',
      Name: Match.stringLikeRegexp('cdk-s3-Dest-dest-.*'),
    });
  });
});

describe('XRay Destination', () => {
  let stack: Stack;

  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'Stack');
  });

  test('creates an XRay destination', () => {
    const sourceResourceArn = 'arn:aws:s3:::my-bucket';

    new XRayDeliveryDestination(stack, 'XRayDest', {
      sourceResource: sourceResourceArn,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationType: 'XRAY',
      Name: Match.stringLikeRegexp('cdk-xray-XRayDest-dest-.*'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::XRay::ResourcePolicy', {
      PolicyDocument: {
        'Fn::Join': [
          '',
          [
            `{"Statement":[{"Action":"xray:PutTraceSegments","Condition":{"ForAllValues:ArnLike":{"logs:LogGeneratingResourceArns":["${sourceResourceArn}"]},"StringEquals":{"aws:SourceAccount":"`,
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
            ':delivery-source:*"}},"Effect":"Allow","Principal":{"Service":"delivery.logs.amazonaws.com"},"Resource":"*","Sid":"CDKLogsDeliveryWrite"}],"Version":"2012-10-17"}',
          ],
        ],
      },
    });

    const template = Template.fromStack(stack);
    const deliveryDestinations = template.findResources('AWS::Logs::DeliveryDestination');
    const resourcePolicies = template.findResources('AWS::XRay::ResourcePolicy');

    const deliveryDestinationLogicalId = Object.keys(deliveryDestinations)[0];
    const xrayPolicyLogicalId = Object.keys(resourcePolicies)[0];

    expect(deliveryDestinations[deliveryDestinationLogicalId].DependsOn).toContain(xrayPolicyLogicalId);
  });
});
