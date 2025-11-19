import { Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Bucket, BucketPolicy, CfnBucketPolicy } from 'aws-cdk-lib/aws-s3';
import { getOrCreateBucketPolicy, XRayPolicyGenerator } from '../../../lib/services/aws-logs/vended-logs-helpers';
import { AccountRootPrincipal, Effect, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

describe('getOrCreateBucketPolicy', () => {
  test('creates policy with V1 permissions if specified', () => {
    const stack = new Stack();
    const bucket = new Bucket(stack, 'Destination');

    getOrCreateBucketPolicy(stack, {
      s3Bucket: bucket,
      permissionsVersion: 'V1',
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

    getOrCreateBucketPolicy(stack, {
      s3Bucket: bucket,
      permissionsVersion: 'V2',
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

    getOrCreateBucketPolicy(stack, {
      s3Bucket: bucket,
      permissionsVersion: 'V2',
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

    getOrCreateBucketPolicy(stack, {
      s3Bucket: bucket,
      permissionsVersion: 'V2',
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

describe('XRayPolicyGenerator', () => {
  test('creates an XRay delivery policy', () => {
    const stack = new Stack();

    new XRayPolicyGenerator(stack, 'CDKXRayPolicyGenerator');

    Template.fromStack(stack).resourceCountIs('AWS::XRay::ResourcePolicy', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::XRay::ResourcePolicy', {
      PolicyDocument: {
        'Fn::Join': [
          '',
          [
            '{"Version":"2012-10-17","Statement":[{"Sid":"CDKLogsDeliveryWrite","Effect":"Allow","Principal":{"Service":"delivery.logs.amazonaws.com"},"Action":"xray:PutTraceSegments","Resource":"*","Condition":{"StringEquals":{"aws:SourceAccount":"',
            {
              Ref: 'AWS::AccountId',
            },
            '"},"ForAllValues:ArnLike":{"logs:LogGeneratingResourceArns":[]},"ArnLike":{"aws:SourceArn":"arn:',
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
            ':delivery-source:*"}}}]}',
          ],
        ],
      },
    });
  });

  test('XRay Delivery resource policy gets updated with log delivery sources', () => {
    const stack = new Stack();

    const xray = new XRayPolicyGenerator(stack, 'CDKXRayPolicyGenerator');

    const bucket = new Bucket(stack, 'XRayTestBucket');
    const secret = new Secret(stack, 'XRayTestSecret', {
      description: 'Sample secret with arn to use for XRay',
    });

    xray.addSourceToPolicy(bucket.bucketArn);
    xray.addSourceToPolicy(secret.secretArn);

    Template.fromStack(stack).hasResourceProperties('AWS::XRay::ResourcePolicy', {
      PolicyDocument: {
        'Fn::Join': [
          '',
          Match.arrayWith([
            Match.stringLikeRegexp('.*logs:LogGeneratingResourceArns.*'),
            { 'Fn::GetAtt': ['XRayTestBucketEE28F545', 'Arn'] },
            { Ref: 'XRayTestSecret0AF068A2' },
          ]),
        ],
      },
    });
  });
});
