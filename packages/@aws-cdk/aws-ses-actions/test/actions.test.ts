import { arrayWith, ResourcePart } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as ses from '@aws-cdk/aws-ses';
import * as sns from '@aws-cdk/aws-sns';
import { Stack } from '@aws-cdk/core';
import * as actions from '../lib';

let stack: Stack;
let rule: ses.ReceiptRule;
let topic: sns.Topic;

beforeEach(() => {
  stack = new Stack();
  const ruleSet = new ses.ReceiptRuleSet(stack, 'RuleSet');
  rule = ruleSet.addRule('Rule');
  topic = new sns.Topic(stack, 'Topic');
});

test('add header action', () => {
  rule.addAction(new actions.AddHeader({
    name: 'X-My-Header',
    value: 'value',
  }));

  expect(stack).toHaveResource('AWS::SES::ReceiptRule', {
    Rule: {
      Actions: [
        {
          AddHeaderAction: {
            HeaderName: 'X-My-Header',
            HeaderValue: 'value',
          },
        },
      ],
      Enabled: true,
    },
  });
});

test('add header action with invalid header name', () => {
  expect(() => rule.addAction(new actions.AddHeader({
    name: 'He@der',
    value: 'value',
  }))).toThrow(/`name`/);
});

test('add header action with invalid header value', () => {
  expect(() => rule.addAction(new actions.AddHeader({
    name: 'Header',
    value: `va
    lu`,
  }))).toThrow(/`value`/);
});

test('add bounce action', () => {
  rule.addAction(new actions.Bounce({
    sender: 'noreply@aws.com',
    template: actions.BounceTemplate.MESSAGE_CONTENT_REJECTED,
    topic,
  }));

  expect(stack).toHaveResource('AWS::SES::ReceiptRule', {
    Rule: {
      Actions: [
        {
          BounceAction: {
            Message: 'Message content rejected',
            Sender: 'noreply@aws.com',
            SmtpReplyCode: '500',
            TopicArn: {
              Ref: 'TopicBFC7AF6E',
            },
            StatusCode: '5.6.1',
          },
        },
      ],
      Enabled: true,
    },
  });
});

test('add lambda action', () => {
  const fn = new lambda.Function(stack, 'Function', {
    code: lambda.Code.fromInline('boom'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_10_X,
  });

  rule.addAction(new actions.Lambda({
    function: fn,
    invocationType: actions.LambdaInvocationType.REQUEST_RESPONSE,
    topic,
  }));

  expect(stack).toHaveResource('AWS::SES::ReceiptRule', {
    Properties: {
      Rule: {
        Actions: [
          {
            LambdaAction: {
              FunctionArn: {
                'Fn::GetAtt': [
                  'Function76856677',
                  'Arn',
                ],
              },
              InvocationType: 'RequestResponse',
              TopicArn: {
                Ref: 'TopicBFC7AF6E',
              },
            },
          },
        ],
        Enabled: true,
      },
      RuleSetName: {
        Ref: 'RuleSetE30C6C48',
      },
    },
    DependsOn: [
      'FunctionAllowSes1829904A',
    ],
  }, ResourcePart.CompleteDefinition);

  expect(stack).toHaveResource('AWS::Lambda::Permission', {
    Action: 'lambda:InvokeFunction',
    FunctionName: {
      'Fn::GetAtt': [
        'Function76856677',
        'Arn',
      ],
    },
    Principal: 'ses.amazonaws.com',
    SourceAccount: {
      Ref: 'AWS::AccountId',
    },
  });
});

test('add s3 action', () => {
  const bucket = new s3.Bucket(stack, 'Bucket');
  const kmsKey = new kms.Key(stack, 'Key');

  rule.addAction(new actions.S3({
    bucket,
    kmsKey,
    objectKeyPrefix: 'emails/',
    topic,
  }));

  expect(stack).toHaveResource('AWS::SES::ReceiptRule', {
    Properties: {
      Rule: {
        Actions: [
          {
            S3Action: {
              BucketName: {
                Ref: 'Bucket83908E77',
              },
              KmsKeyArn: {
                'Fn::GetAtt': [
                  'Key961B73FD',
                  'Arn',
                ],
              },
              ObjectKeyPrefix: 'emails/',
              TopicArn: {
                Ref: 'TopicBFC7AF6E',
              },
            },
          },
        ],
        Enabled: true,
      },
      RuleSetName: {
        Ref: 'RuleSetE30C6C48',
      },
    },
    DependsOn: [
      'BucketPolicyE9A3008A',
    ],
  }, ResourcePart.CompleteDefinition);

  expect(stack).toHaveResource('AWS::S3::BucketPolicy', {
    Bucket: {
      Ref: 'Bucket83908E77',
    },
    PolicyDocument: {
      Statement: [
        {
          Action: 's3:PutObject',
          Condition: {
            StringEquals: {
              'aws:Referer': {
                Ref: 'AWS::AccountId',
              },
            },
          },
          Effect: 'Allow',
          Principal: {
            Service: 'ses.amazonaws.com',
          },
          Resource: {
            'Fn::Join': [
              '',
              [
                {
                  'Fn::GetAtt': [
                    'Bucket83908E77',
                    'Arn',
                  ],
                },
                '/emails/*',
              ],
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
  });

  expect(stack).toHaveResourceLike('AWS::KMS::Key', {
    KeyPolicy: {
      Statement: arrayWith({
        Action: [
          'kms:Encrypt',
          'kms:GenerateDataKey',
        ],
        Condition: {
          Null: {
            'kms:EncryptionContext:aws:ses:rule-name': 'false',
            'kms:EncryptionContext:aws:ses:message-id': 'false',
          },
          StringEquals: {
            'kms:EncryptionContext:aws:ses:source-account': {
              Ref: 'AWS::AccountId',
            },
          },
        },
        Effect: 'Allow',
        Principal: {
          Service: 'ses.amazonaws.com',
        },
        Resource: '*',
      }),
    },
  });
});

test('add sns action', () => {
  rule.addAction(new actions.Sns({
    encoding: actions.EmailEncoding.BASE64,
    topic,
  }));

  expect(stack).toHaveResource('AWS::SES::ReceiptRule', {
    Rule: {
      Actions: [
        {
          SNSAction: {
            Encoding: 'Base64',
            TopicArn: {
              Ref: 'TopicBFC7AF6E',
            },
          },
        },
      ],
      Enabled: true,
    },
  });
});

test('add stop action', () => {
  rule.addAction(new actions.Stop({
    topic,
  }));

  expect(stack).toHaveResource('AWS::SES::ReceiptRule', {
    Rule: {
      Actions: [
        {
          StopAction: {
            Scope: 'RuleSet',
            TopicArn: {
              Ref: 'TopicBFC7AF6E',
            },
          },
        },
      ],
      Enabled: true,
    },
  });
});
