import { Stack } from 'aws-cdk-lib';
import { Bucket, BucketPolicy } from 'aws-cdk-lib/aws-s3';
import { FirehoseDeliveryDestination, LogsDeliveryDestination, S3DeliveryDestination } from '../../../lib/services/aws-logs/vended-logs';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { AccountRootPrincipal, Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { DeliveryStream, S3Bucket } from 'aws-cdk-lib/aws-kinesisfirehose';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';

describe('S3 Delivery Destination', () => {
  test('creates an S3 delivery destination when given a bucket', () => {
    const stack = new Stack();
    const bucket = new Bucket(stack, 'Destination');

    new S3DeliveryDestination(stack, 'S3Destination', {
      permissionsVersion: 'V2',
      destinationService: 'S3',
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

    // Validate that DeliveryDestination depends on the S3 bucket policy
    const template = Template.fromStack(stack);
    const deliveryDestinations = template.findResources('AWS::Logs::DeliveryDestination');
    const bucketPolicies = template.findResources('AWS::S3::BucketPolicy');

    const deliveryDestinationLogicalId = Object.keys(deliveryDestinations)[0];
    const bucketPolicyLogicalId = Object.keys(bucketPolicies)[0];

    expect(deliveryDestinations[deliveryDestinationLogicalId].DependsOn).toContain(bucketPolicyLogicalId);
  });

  test('creates policy with V1 permissions if specified', () => {
    const stack = new Stack();
    const bucket = new Bucket(stack, 'Destination');

    new S3DeliveryDestination(stack, 'S3Destination', {
      permissionsVersion: 'V1',
      destinationService: 'S3',
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

  test('adds to existing policy if a bucket policy already exists', () => {
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
      destinationService: 'S3',
      s3Bucket: bucket,
    });

    Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 1);
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
      permissionsVersion: 'V2',
      destinationService: 'CWL',
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
            '{\'Statement\':[{\'Action\':[\'logs:CreateLogStream\',\'logs:PutLogEvents\'],\'Condition\':{\'StringEquals\':{\'aws:SourceAccount\':\'',
            {
              Ref: 'AWS::AccountId',
            },
            '\'},\'ArnLike\':{\'aws:SourceArn\':\'arn:',
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
            ':*\'}},\'Effect\':\'Allow\',\'Principal\':{\'Service\':\'delivery.logs.amazonaws.com\'},\'Resource\':\'',
            {
              'Fn::GetAtt': [
                'LogGroupDelivery0EF9ECE4',
                'Arn',
              ],
            },
            ':log-stream:*\'}],\'Version\':\'2012-10-17\'}',
          ],
        ],
      },
      PolicyName: 'LogGroupDeliveryPolicy7F26860F',
    });

    // Validate that DeliveryDestination depends on the Cloudwatch resource policy
    const template = Template.fromStack(stack);
    const deliveryDestinations = template.findResources('AWS::Logs::DeliveryDestination');
    const resourcePolicies = template.findResources('AWS::Logs::ResourcePolicy');

    const deliveryDestinationLogicalId = Object.keys(deliveryDestinations)[0];
    const cwlPolicyLogicalId = Object.keys(resourcePolicies)[0];

    expect(deliveryDestinations[deliveryDestinationLogicalId].DependsOn).toContain(cwlPolicyLogicalId);
  });

  test('adds to existing policy if a resource policy already exists for Cloudwatch', () => {
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
      permissionsVersion: 'V2',
      destinationService: 'CWL',
      logGroup,
    });

    Template.fromStack(stack).resourceCountIs('AWS::Logs::ResourcePolicy', 1);
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
      permissionsVersion: 'V2',
      destinationService: 'FH',
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
});
