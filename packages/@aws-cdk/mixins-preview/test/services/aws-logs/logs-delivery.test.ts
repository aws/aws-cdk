import { Stack } from 'aws-cdk-lib';
import { Bucket, BucketEncryption, BucketPolicy, CfnBucket, CfnBucketPolicy } from 'aws-cdk-lib/aws-s3';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { AccountRootPrincipal, Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnDeliveryStream, DeliveryStream, S3Bucket } from 'aws-cdk-lib/aws-kinesisfirehose';
import { CfnDeliveryDestination, CfnLogGroup, LogGroup, ResourcePolicy, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { CfnKey, Key } from 'aws-cdk-lib/aws-kms';
import { DestinationLogsDelivery, FirehoseLogsDelivery, LogGroupLogsDelivery, S3LogsDelivery, S3LogsDeliveryPermissionsVersion, XRayLogsDelivery } from '../../../lib/services/aws-logs';

// at the time of creating this test file S3 does not support Vended Logs on Buckets but this test pretends they do to make writing tests easier
describe('S3 Delivery', () => {
  let source: Bucket;
  let stack: Stack;
  const logType = 'ACCESS_LOGS';

  beforeEach(() => {
    stack = new Stack();
    source = new Bucket(stack, 'SourceBucket');
  });

  test('creates an S3 delivery destination and delivery connection', () => {
    const bucket = new Bucket(stack, 'Destination');

    const s3Logs = new S3LogsDelivery(bucket);
    s3Logs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliverySource', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      DeliveryDestinationArn: {
        'Fn::GetAtt': [
          'SourceBucketCdkS3AccessLogsDeliverySourceBucketDestinationDestBA63D329',
          'Arn',
        ],
      },
      DeliverySourceName: {
        Ref: 'SourceBucketCDKSourceACCESSLOGSSourceBucket3DC18173',
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationType: 'S3',
      DestinationResourceArn: {
        'Fn::GetAtt': [
          'Destination920A3C57',
          'Arn',
        ],
      },
      Name: Match.stringLikeRegexp('cdk-s3-access-logs-dest-.*'),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliverySource', {
      LogType: logType,
      ResourceArn: {
        'Fn::GetAtt': ['SourceBucketDDD2130A', 'Arn'],
      },
      Name: Match.stringLikeRegexp('cdk-accesslogs-source-.*'),
    });

    // Validate that DeliveryDestination depends on the S3 bucket policy
    const template = Template.fromStack(stack);
    const deliveryDestinations = template.findResources('AWS::Logs::DeliveryDestination');
    const bucketPolicies = template.findResources('AWS::S3::BucketPolicy');

    const deliveryDestinationLogicalId = Object.keys(deliveryDestinations)[0];
    const bucketPolicyLogicalId = Object.keys(bucketPolicies)[0];

    expect(deliveryDestinations[deliveryDestinationLogicalId].DependsOn).toContain(bucketPolicyLogicalId);
  });

  test('creates S3 delivery with outputFormat', () => {
    const bucket = new Bucket(stack, 'Destination');

    const s3Logs = new S3LogsDelivery(bucket, { outputFormat: 'json' });
    s3Logs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      OutputFormat: 'json',
    });
  });

  test('creates S3 delivery with providedFields', () => {
    const bucket = new Bucket(stack, 'Destination');

    const s3Logs = new S3LogsDelivery(bucket, { providedFields: ['field1', 'field2'] });
    s3Logs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2'],
    });
  });

  test('creates S3 delivery with both providedFields and mandatoryFields', () => {
    const bucket = new Bucket(stack, 'Destination');

    const s3Logs = new S3LogsDelivery(bucket, {
      providedFields: ['field1', 'field2'],
      mandatoryFields: ['field3', 'field4'],
    });
    s3Logs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2', 'field3', 'field4'],
    });
  });

  test('creates S3 delivery with only mandatoryFields if they are provided', () => {
    const bucket = new Bucket(stack, 'Destination');

    const s3Logs = new S3LogsDelivery(bucket, {
      providedFields: ['field1', 'field2'],
      mandatoryFields: ['field1', 'field2'],
    });
    s3Logs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2'],
    });
  });

  test('adds missing mandatoryFields if providedFields are missing some', () => {
    const bucket = new Bucket(stack, 'Destination');

    const s3Logs = new S3LogsDelivery(bucket, {
      providedFields: ['field1', 'field2'],
      mandatoryFields: ['field1', 'field2', 'field3', 'field4'],
    });
    s3Logs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2', 'field3', 'field4'],
    });
  });

  test('creates S3 Delivery when bucket is an L1', () => {
    const bucket = new CfnBucket(stack, 'Destination');

    const s3Logs = new S3LogsDelivery(bucket);
    s3Logs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliverySource', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliveryDestination', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
      Bucket: {
        Ref: 'Destination',
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
                      'Destination',
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

  test('creates delivery source as child of source resource', () => {
    const bucket = new Bucket(stack, 'Destination');
    const s3Logs = new S3LogsDelivery(bucket);
    s3Logs.bind(source, logType, source.bucketArn);

    const deliverySources = Template.fromStack(stack).findResources('AWS::Logs::DeliverySource');
    const sourceLogicalId = Object.keys(deliverySources)[0];
    expect(sourceLogicalId).toMatch(/^SourceBucket/);
  });

  test('reuses delivery source when binding same source multiple times', () => {
    const bucket1 = new Bucket(stack, 'Destination1');
    const bucket2 = new Bucket(stack, 'Destination2');

    const s3Logs1 = new S3LogsDelivery(bucket1);
    s3Logs1.bind(source, logType, source.bucketArn);

    const s3Logs2 = new S3LogsDelivery(bucket2);
    s3Logs2.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliverySource', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliveryDestination', 2);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 2);
  });

  test('able to make multiple delivery destinations and multiple deliveries that use the same bucket', () => {
    const bucket = new Bucket(stack, 'Destination');

    const s3Logs = new S3LogsDelivery(bucket);
    s3Logs.bind(source, logType, source.bucketArn);

    const source1 = new Bucket(stack, 'SourceBucket1');

    const s3Logs1 = new S3LogsDelivery(bucket, {
      permissionsVersion: S3LogsDeliveryPermissionsVersion.V2,
    });
    s3Logs1.bind(source1, logType, source1.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliverySource', 2);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliveryDestination', 2);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 2);
  });

  test('creates policy with V1 permissions if specified', () => {
    const bucket = new Bucket(stack, 'Destination');
    const s3Logs = new S3LogsDelivery(bucket, {
      permissionsVersion: S3LogsDeliveryPermissionsVersion.V1,
    });
    s3Logs.bind(source, logType, source.bucketArn);

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
    const bucket = new Bucket(stack, 'Destination');
    const s3Logs = new S3LogsDelivery(bucket, {
      permissionsVersion: S3LogsDeliveryPermissionsVersion.V2,
    });
    s3Logs.bind(source, logType, source.bucketArn);

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

    const s3Logs = new S3LogsDelivery(bucket);
    s3Logs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 1);
  });

  test('adds to existing policy if a CfnBucketPolicy already exists', () => {
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

    const s3Logs = new S3LogsDelivery(bucket);
    s3Logs.bind(source, logType, source.bucketArn);

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

  test('adds KMS key policy when bucket is encrypted with KMS key and KMS key is passed in to S3LogsDelivery', () => {
    const key = new Key(stack, 'EncryptionKey');
    const bucket = new Bucket(stack, 'Destination', {
      encryptionKey: key,
    });

    const s3Logs = new S3LogsDelivery(bucket, { kmsKey: key });
    s3Logs.bind(source, logType, source.bucketArn);

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

  test('adds KMS key policy when Key is an L1 Construct', () => {
    const key = new CfnKey(stack, 'EncryptionKey');
    const bucket = new CfnBucket(stack, 'Destination', {
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

    const s3Logs = new S3LogsDelivery(bucket, { kmsKey: key });
    s3Logs.bind(source, logType, source.bucketArn);

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

  test('adds KMS key policy when bucket is encrypted with KMS key and KMS key is not passed in to S3LogsDelivery', () => {
    const key = new Key(stack, 'EncryptionKey');
    const bucket = new Bucket(stack, 'Destination', {
      encryptionKey: key,
    });

    const s3Logs = new S3LogsDelivery(bucket);
    s3Logs.bind(source, logType, source.bucketArn);

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

  test('KMS key policy is not duplicated when multiple buckets use the same key for encryption', () => {
    const key = new Key(stack, 'EncryptionKey');
    const bucket1 = new Bucket(stack, 'Destination1', {
      encryptionKey: key,
    });

    const bucket2 = new Bucket(stack, 'Destination2', {
      encryptionKey: key,
    });

    const s3Logs1 = new S3LogsDelivery(bucket1, { kmsKey: key });
    const s3Logs2 = new S3LogsDelivery(bucket2);
    s3Logs1.bind(source, logType, source.bucketArn);
    s3Logs2.bind(source, logType, source.bucketArn);

    const template = Template.fromStack(stack);
    const keyResource = template.findResources('AWS::KMS::Key');
    const keyPolicy = Object.values(keyResource)[0].Properties.KeyPolicy;
    const logsDeliveryStatements = keyPolicy.Statement.filter((stmt: any) =>
      stmt.Sid === 'AWS CDK: Allow Logs Delivery to use the key',
    );

    expect(logsDeliveryStatements).toHaveLength(1);
  });

  test('does not add KMS key policy when bucket is encrypted using AWS managed keys', () => {
    const bucket = new Bucket(stack, 'Destination', {
      encryption: BucketEncryption.KMS_MANAGED,
    });

    const s3Logs = new S3LogsDelivery(bucket);
    s3Logs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::KMS::Key', 0);
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'aws:kms',
            },
          },
        ],
      },
    });
  });
});

describe('Cloudwatch Logs Delivery', () => {
  let stack: Stack;
  let source: Bucket;
  const logType = 'ACCESS_LOGS';

  beforeEach(() => {
    stack = new Stack();
    source = new Bucket(stack, 'SourceBucket');
  });

  test('creates a Cloudwatch Delivery Destination when given a log group', () => {
    const logGroup = new LogGroup(stack, 'LogGroupDelivery', {
      logGroupName: 'test-log-group',
      retention: RetentionDays.ONE_WEEK,
    });

    const cwlLogs = new LogGroupLogsDelivery(logGroup);
    cwlLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliverySource', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      DeliveryDestinationArn: {
        'Fn::GetAtt': [
          'SourceBucketCdkLogGroupAccessLogsDeliverySourceBucketLogGroupDeliveryDest89BD1E86',
          'Arn',
        ],
      },
      DeliverySourceName: {
        Ref: 'SourceBucketCDKSourceACCESSLOGSSourceBucket3DC18173',
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationType: 'CWL',
      DestinationResourceArn: {
        'Fn::GetAtt': [
          'LogGroupDelivery0EF9ECE4',
          'Arn',
        ],
      },
      Name: Match.stringLikeRegexp('cdk-cwl-access-logs-dest-.*'),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliverySource', {
      LogType: logType,
      ResourceArn: {
        'Fn::GetAtt': ['SourceBucketDDD2130A', 'Arn'],
      },
      Name: Match.stringLikeRegexp('cdk-accesslogs-source-.*'),
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
      PolicyName: 'SourceBucketCdkLogGroupAccessLogsDeliverySourceBucketLogGroupDelivery72DADCC3',
    });

    // Validate that DeliveryDestination depends on the Cloudwatch resource policy
    const template = Template.fromStack(stack);
    const deliveryDestinations = template.findResources('AWS::Logs::DeliveryDestination');
    const resourcePolicies = template.findResources('AWS::Logs::ResourcePolicy');

    const deliveryDestinationLogicalId = Object.keys(deliveryDestinations)[0];
    const cwlPolicyLogicalId = Object.keys(resourcePolicies)[0];

    expect(deliveryDestinations[deliveryDestinationLogicalId].DependsOn).toContain(cwlPolicyLogicalId);
  });

  test('creates LogGroup delivery with outputFormat', () => {
    const logGroup = new LogGroup(stack, 'LogGroupDelivery');

    const cwlLogs = new LogGroupLogsDelivery(logGroup, { outputFormat: 'json' });
    cwlLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      OutputFormat: 'json',
    });
  });

  test('creates LogGroup delivery with providedFields', () => {
    const logGroup = new LogGroup(stack, 'LogGroupDelivery');

    const cwlLogs = new LogGroupLogsDelivery(logGroup, { providedFields: ['field1', 'field2'] });
    cwlLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2'],
    });
  });

  test('creates LogGroup delivery with both providedFields and mandatoryFields', () => {
    const logGroup = new LogGroup(stack, 'LogGroupDelivery');

    const cwlLogs = new LogGroupLogsDelivery(logGroup, {
      providedFields: ['field1', 'field2'],
      mandatoryFields: ['field3', 'field4'],
    });
    cwlLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2', 'field3', 'field4'],
    });
  });

  test('creates LogGroup delivery with only mandatoryFields if they are provided', () => {
    const logGroup = new LogGroup(stack, 'LogGroupDelivery');

    const cwlLogs = new LogGroupLogsDelivery(logGroup, {
      providedFields: ['field1', 'field2'],
      mandatoryFields: ['field1', 'field2'],
    });
    cwlLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2'],
    });
  });

  test('adds missing mandatoryFields if providedFields are missing some', () => {
    const logGroup = new LogGroup(stack, 'LogGroupDelivery');

    const cwlLogs = new LogGroupLogsDelivery(logGroup, {
      providedFields: ['field1', 'field2'],
      mandatoryFields: ['field1', 'field2', 'field3', 'field4'],
    });
    cwlLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2', 'field3', 'field4'],
    });
  });

  test('creates Cloudwatch delivery destination when given an L1 Log Group', () => {
    const logGroup = new CfnLogGroup(stack, 'LogGroup', {
      retentionInDays: 7,
      logGroupName: 'myCoolLogGroup',
    });

    const cwlLogs = new LogGroupLogsDelivery(logGroup);
    cwlLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliverySource', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliveryDestination', 1);
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
      PolicyName: 'SourceBucketCdkLogGroupAccessLogsDeliverySourceBucketLogGroupB6CEE4EE',
    });
  });

  test('if there is an exsiting Cloudwatch resource policy but it is not attached to the root of the stack, make a new one', () => {
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

    const cwlLogs = new LogGroupLogsDelivery(logGroup);
    cwlLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::ResourcePolicy', 2);
  });

  test('if there is an existing Cloudwatch resource policy at the root of the stack, update it', () => {
    new ResourcePolicy(stack, 'CdkLogGroupLogsDeliveryPolicy', {
      resourcePolicyName: 'singletonPolicy',
      policyStatements: [],
    });
    const logGroup = new LogGroup(stack, 'LogGroupDelivery', {
      logGroupName: 'test-log-group',
      retention: RetentionDays.ONE_WEEK,
    });

    const cwlLogs = new LogGroupLogsDelivery(logGroup);
    cwlLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::ResourcePolicy', 1);
  });

  test('creates only one resource policy if multiple Log Delivery Destinations are created', () => {
    const logGroup1 = new LogGroup(stack, 'LogGroup1Delivery', {
      logGroupName: 'test-1-log-group',
      retention: RetentionDays.ONE_WEEK,
    });

    const logGroup2 = new LogGroup(stack, 'LogGroup2Delivery', {
      logGroupName: 'test-2-log-group',
      retention: RetentionDays.ONE_WEEK,
    });

    const cwlLogs1 = new LogGroupLogsDelivery(logGroup1);
    cwlLogs1.bind(source, logType, source.bucketArn);

    const cwlLogs2 = new LogGroupLogsDelivery(logGroup2);
    cwlLogs2.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::ResourcePolicy', 1);
  });

  test('creates a new resource policy if there is an existing resource policy unrelated to Cloudwatch logs', () => {
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

    const cwlLogs = new LogGroupLogsDelivery(logGroup);
    cwlLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::ResourcePolicy', 1);
    Template.fromStack(stack).resourceCountIs('AWS::SecretsManager::ResourcePolicy', 1);
  });

  test('able to make multiple delivery destinations with the same log group', () => {
    const logGroup = new LogGroup(stack, 'LogGroupDelivery', {
      logGroupName: 'test-log-group',
      retention: RetentionDays.ONE_WEEK,
    });

    const source2 = new Bucket(stack, 'SourceBucket2');

    const cwlLogs1 = new LogGroupLogsDelivery(logGroup);
    cwlLogs1.bind(source, logType, source.bucketArn);

    const cwlLogs2 = new LogGroupLogsDelivery(logGroup);
    cwlLogs2.bind(source2, logType, source2.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::ResourcePolicy', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliverySource', 2);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliveryDestination', 2);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 2);
  });
});

describe('Firehose Stream Delivery', () => {
  let stack: Stack;
  let source: Bucket;
  const logType = 'ACCESS_LOGS';

  beforeEach(() => {
    stack = new Stack();
    source = new Bucket(stack, 'SourceBucket');
  });

  test('creates a Firehose Delivery Destination and a Delivery connection when given a delivery stream', () => {
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

    const fhLogs = new FirehoseLogsDelivery(stream);
    fhLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliverySource', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      DeliveryDestinationArn: {
        'Fn::GetAtt': [
          'SourceBucketCdkFirehoseAccessLogsDeliverySourceBucketFirehoseDestACDAE1B5',
          'Arn',
        ],
      },
      DeliverySourceName: {
        Ref: 'SourceBucketCDKSourceACCESSLOGSSourceBucket3DC18173',
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationType: 'FH',
      DestinationResourceArn: {
        'Fn::GetAtt': [
          'FirehoseEF5AC2A2',
          'Arn',
        ],
      },
      Name: Match.stringLikeRegexp('cdk-fh-access-logs-dest-.*'),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliverySource', {
      LogType: logType,
      ResourceArn: {
        'Fn::GetAtt': ['SourceBucketDDD2130A', 'Arn'],
      },
      Name: Match.stringLikeRegexp('cdk-accesslogs-source-.*'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      Tags: Match.arrayWith([Match.objectLike({
        Key: 'LogDeliveryEnabled',
        Value: 'true',
      })]),
    });
  });

  test('creates Firehose delivery with outputFormat', () => {
    const streamBucket = new Bucket(stack, 'DeliveryBucket');
    const firehoseRole = new Role(stack, 'FirehoseRole', {
      assumedBy: new ServicePrincipal('firehose.amazonaws.com'),
    });
    const stream = new DeliveryStream(stack, 'Firehose', {
      destination: new S3Bucket(streamBucket),
      role: firehoseRole,
    });

    const fhLogs = new FirehoseLogsDelivery(stream, { outputFormat: 'json' });
    fhLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      OutputFormat: 'json',
    });
  });

  test('creates Firehose delivery with providedFields', () => {
    const streamBucket = new Bucket(stack, 'DeliveryBucket');
    const firehoseRole = new Role(stack, 'FirehoseRole', {
      assumedBy: new ServicePrincipal('firehose.amazonaws.com'),
    });
    const stream = new DeliveryStream(stack, 'Firehose', {
      destination: new S3Bucket(streamBucket),
      role: firehoseRole,
    });

    const fhLogs = new FirehoseLogsDelivery(stream, { providedFields: ['field1', 'field2'] });
    fhLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2'],
    });
  });

  test('creates Firehose delivery with both providedFields and mandatoryFields', () => {
    const streamBucket = new Bucket(stack, 'DeliveryBucket');
    const firehoseRole = new Role(stack, 'FirehoseRole', {
      assumedBy: new ServicePrincipal('firehose.amazonaws.com'),
    });
    const stream = new DeliveryStream(stack, 'Firehose', {
      destination: new S3Bucket(streamBucket),
      role: firehoseRole,
    });

    const fhLogs = new FirehoseLogsDelivery(stream, {
      providedFields: ['field1', 'field2'],
      mandatoryFields: ['field3', 'field4'],
    });
    fhLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2', 'field3', 'field4'],
    });
  });

  test('creates Firehose delivery with only mandatoryFields if they are provided', () => {
    const streamBucket = new Bucket(stack, 'DeliveryBucket');
    const firehoseRole = new Role(stack, 'FirehoseRole', {
      assumedBy: new ServicePrincipal('firehose.amazonaws.com'),
    });
    const stream = new DeliveryStream(stack, 'Firehose', {
      destination: new S3Bucket(streamBucket),
      role: firehoseRole,
    });

    const fhLogs = new FirehoseLogsDelivery(stream, {
      providedFields: ['field1', 'field2'],
      mandatoryFields: ['field1', 'field2'],
    });
    fhLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2'],
    });
  });

  test('adds missing mandatoryFields if providedFields are missing some', () => {
    const streamBucket = new Bucket(stack, 'DeliveryBucket');
    const firehoseRole = new Role(stack, 'FirehoseRole', {
      assumedBy: new ServicePrincipal('firehose.amazonaws.com'),
    });
    const stream = new DeliveryStream(stack, 'Firehose', {
      destination: new S3Bucket(streamBucket),
      role: firehoseRole,
    });

    const fhLogs = new FirehoseLogsDelivery(stream, {
      providedFields: ['field1', 'field2'],
      mandatoryFields: ['field1', 'field2', 'field3', 'field4'],
    });
    fhLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2', 'field3', 'field4'],
    });
  });

  test('creates Firehose Delivery with an L1 Delivery Stream', () => {
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

    const fhLogs = new FirehoseLogsDelivery(stream);
    fhLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliverySource', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliveryDestination', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::KinesisFirehose::DeliveryStream', {
      Tags: Match.arrayWith([Match.objectLike({
        Key: 'LogDeliveryEnabled',
        Value: 'true',
      })]),
    });
  });

  test('able to make multiple delivery destinations that use the same stream', () => {
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

    const source2 = new Bucket(stack, 'SourceBucket2');
    const fhLogs1 = new FirehoseLogsDelivery(stream);
    fhLogs1.bind(source, logType, source.bucketArn);

    const fhLogs2 = new FirehoseLogsDelivery(stream);
    fhLogs2.bind(source2, logType, source2.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliverySource', 2);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliveryDestination', 2);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 2);
  });
});

describe('XRay Delivery', () => {
  let stack: Stack;
  let source: Bucket;
  const logType = 'TRACES';
  beforeEach(() => {
    stack = new Stack();
    source = new Bucket(stack, 'SourceBucket');
  });

  test('creates an XRay Delivery Destination and Delivery', () => {
    const xrayLogs = new XRayLogsDelivery();
    xrayLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliverySource', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliveryDestination', {
      DeliveryDestinationType: 'XRAY',
      Name: Match.stringLikeRegexp('cdk-xray-traces-dest-.*'),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::DeliverySource', {
      LogType: logType,
      ResourceArn: {
        'Fn::GetAtt': ['SourceBucketDDD2130A', 'Arn'],
      },
      Name: Match.stringLikeRegexp('cdk-traces-source-.*'),
    });
  });

  test('creates XRay delivery with providedFields', () => {
    const xrayLogs = new XRayLogsDelivery({ providedFields: ['field1', 'field2'] });
    xrayLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2'],
    });
  });

  test('creates XRay delivery with both providedFields and mandatoryFields', () => {
    const xrayLogs = new XRayLogsDelivery({
      providedFields: ['field1', 'field2'],
      mandatoryFields: ['field3', 'field4'],
    });
    xrayLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2', 'field3', 'field4'],
    });
  });

  test('creates XRay delivery with only mandatoryFields if they are provided', () => {
    const xrayLogs = new XRayLogsDelivery({
      providedFields: ['field1', 'field2'],
      mandatoryFields: ['field1', 'field2'],
    });
    xrayLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2'],
    });
  });

  test('adds missing mandatoryFields if providedFields are missing some', () => {
    const xrayLogs = new XRayLogsDelivery({
      providedFields: ['field1', 'field2'],
      mandatoryFields: ['field1', 'field2', 'field3', 'field4'],
    });
    xrayLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2', 'field3', 'field4'],
    });
  });

  test('when multiple XRay Delivery destinations are created on one stack, only create one XRay resource policy', () => {
    const xrayLogs = new XRayLogsDelivery();
    xrayLogs.bind(source, logType, source.bucketArn);

    const source2 = new Bucket(stack, 'SourceBucket2');

    const xrayLogs2 = new XRayLogsDelivery();
    xrayLogs2.bind(source2, logType, source2.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::XRay::ResourcePolicy', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliverySource', 2);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliveryDestination', 2);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 2);
  });

  test('if XRay Delivery Destinations are in different stacks, make different policies', () => {
    const stack2 = new Stack();

    const xrayLogs = new XRayLogsDelivery();
    xrayLogs.bind(source, logType, source.bucketArn);

    const source2 = new Bucket(stack2, 'SourceBucket2');

    const xrayLogs2 = new XRayLogsDelivery();
    xrayLogs2.bind(source2, logType, source2.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::XRay::ResourcePolicy', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliveryDestination', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 1);
    Template.fromStack(stack2).resourceCountIs('AWS::XRay::ResourcePolicy', 1);
    Template.fromStack(stack2).resourceCountIs('AWS::Logs::DeliveryDestination', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 1);
  });

  test('creates an XRay delivery policy with correct permissions', () => {
    const xrayLogs = new XRayLogsDelivery();
    xrayLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::XRay::ResourcePolicy', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::XRay::ResourcePolicy', {
      PolicyName: 'CdkXRayLogsDeliveryPolicy',
      PolicyDocument: {
        'Fn::Join': [
          '',
          [
            '{"Statement":[{"Action":"xray:PutTraceSegments","Condition":{"ForAllValues:ArnLike":{"logs:LogGeneratingResourceArns":["',
            { 'Fn::GetAtt': ['SourceBucketDDD2130A', 'Arn'] }, // source
            '"]},"StringEquals":{"aws:SourceAccount":"',
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
  });

  test('XRay Delivery resource policy gets updated with multiple log delivery sources', () => {
    const xrayLogs = new XRayLogsDelivery();
    xrayLogs.bind(source, logType, source.bucketArn);

    const source1 = new Bucket(stack, 'SourceBucket1');
    const xrayLogs2 = new XRayLogsDelivery();
    xrayLogs2.bind(source1, logType, source1.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::XRay::ResourcePolicy', {
      PolicyDocument: {
        'Fn::Join': [
          '',
          Match.arrayWith([
            Match.stringLikeRegexp('.*logs:LogGeneratingResourceArns.*'),
            { 'Fn::GetAtt': ['SourceBucketDDD2130A', 'Arn'] }, // source
            { 'Fn::GetAtt': ['SourceBucket1CCDBD520', 'Arn'] }, // source1
          ]),
        ],
      },
    });
  });
});

describe('Destination Delivery', () => {
  let stack: Stack;
  let source: Bucket;
  const logType = 'ACCESS_LOGS';

  beforeEach(() => {
    stack = new Stack();
    source = new Bucket(stack, 'SourceBucket');
  });

  test('creates delivery connection with existing delivery destination resource', () => {
    const destination = new CfnDeliveryDestination(stack, 'Dest', {
      name: 'my-cool-xray-dest',
      deliveryDestinationType: 'XRAY',
    });

    const destLogs = new DestinationLogsDelivery(destination);
    destLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliverySource', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      DeliveryDestinationArn: {
        'Fn::GetAtt': ['Dest', 'Arn'],
      },
      DeliverySourceName: {
        Ref: 'SourceBucketCDKSourceACCESSLOGSSourceBucket3DC18173',
      },
    });
  });

  test('creates Destination delivery with providedFields', () => {
    const destination = new CfnDeliveryDestination(stack, 'Dest', {
      name: 'my-cool-xray-dest',
      deliveryDestinationType: 'XRAY',
    });

    const destLogs = new DestinationLogsDelivery(destination, { providedFields: ['field1', 'field2'] });
    destLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2'],
    });
  });

  test('creates Destination delivery with both providedFields and mandatoryFields', () => {
    const destination = new CfnDeliveryDestination(stack, 'Dest', {
      name: 'my-cool-xray-dest',
      deliveryDestinationType: 'XRAY',
    });

    const destLogs = new DestinationLogsDelivery(destination, {
      providedFields: ['field1', 'field2'],
      mandatoryFields: ['field3', 'field4'],
    });
    destLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2', 'field3', 'field4'],
    });
  });

  test('creates Destination delivery with only mandatoryFields if they are provided', () => {
    const destination = new CfnDeliveryDestination(stack, 'Dest', {
      name: 'my-cool-xray-dest',
      deliveryDestinationType: 'XRAY',
    });

    const destLogs = new DestinationLogsDelivery(destination, {
      providedFields: ['field1', 'field2'],
      mandatoryFields: ['field1', 'field2'],
    });
    destLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2'],
    });
  });

  test('adds missing mandatoryFields if providedFields are missing some', () => {
    const destination = new CfnDeliveryDestination(stack, 'Dest', {
      name: 'my-cool-xray-dest',
      deliveryDestinationType: 'XRAY',
    });

    const destLogs = new DestinationLogsDelivery(destination, {
      providedFields: ['field1', 'field2'],
      mandatoryFields: ['field1', 'field2', 'field3', 'field4'],
    });
    destLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).hasResourceProperties('AWS::Logs::Delivery', {
      RecordFields: ['field1', 'field2', 'field3', 'field4'],
    });
  });

  test('reuses delivery source when binding same source multiple times and destination arn is unresolved', () => {
    const destination1 = new CfnDeliveryDestination(stack, 'Dest1', {
      name: 'my-cool-xray-dest-1',
      deliveryDestinationType: 'XRAY',
    });

    const destination2 = new CfnDeliveryDestination(stack, 'Dest2', {
      name: 'my-cool-xray-dest-2',
      deliveryDestinationType: 'XRAY',
    });

    const destLogs1 = new DestinationLogsDelivery(destination1);
    destLogs1.bind(source, logType, source.bucketArn);

    const destLogs2 = new DestinationLogsDelivery(destination2);
    destLogs2.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliverySource', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 2);
  });

  test('able to make multiple deliveries to different destinations', () => {
    const destination1 = new CfnDeliveryDestination(stack, 'Dest1', {
      name: 'my-cool-xray-dest-1',
      deliveryDestinationType: 'XRAY',
    });

    const destination2 = new CfnDeliveryDestination(stack, 'Dest2', {
      name: 'my-cool-xray-dest-2',
      deliveryDestinationType: 'XRAY',
    });

    const source2 = new Bucket(stack, 'SourceBucket2');

    const destLogs1 = new DestinationLogsDelivery(destination1);
    destLogs1.bind(source, logType, source.bucketArn);

    const destLogs2 = new DestinationLogsDelivery(destination2);
    destLogs2.bind(source2, logType, source2.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliverySource', 2);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 2);
  });

  test('able to make delivery when destination is imported cross stack', () => {
    const destName = 'my-cool-xray-dest';
    const crossStack = new Stack();

    new CfnDeliveryDestination(crossStack, 'Dest', {
      name: destName,
      deliveryDestinationType: 'XRAY',
    });

    const destCrossStack = CfnDeliveryDestination.fromDeliveryDestinationName(stack, 'CrossStackDest', destName);

    const destLogs = new DestinationLogsDelivery(destCrossStack);
    destLogs.bind(source, logType, source.bucketArn);

    Template.fromStack(stack).resourceCountIs('AWS::Logs::Delivery', 1);
    Template.fromStack(stack).resourceCountIs('AWS::Logs::DeliverySource', 1);
  });
});
