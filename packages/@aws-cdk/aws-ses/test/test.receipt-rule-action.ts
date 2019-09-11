import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import kms = require('@aws-cdk/aws-kms');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
// tslint:disable:max-line-length
import { EmailEncoding, LambdaInvocationType, ReceiptRuleAddHeaderAction, ReceiptRuleBounceAction, ReceiptRuleBounceActionTemplate, ReceiptRuleLambdaAction, ReceiptRuleS3Action, ReceiptRuleSet, ReceiptRuleSnsAction, ReceiptRuleStopAction } from '../lib';
// tslint:enable:max-line-length

export = {
  'can add an add header action'(test: Test) {
    // GIVEN
    const stack = new Stack();

    new ReceiptRuleSet(stack, 'RuleSet', {
      rules: [
        {
          actions: [
            new ReceiptRuleAddHeaderAction({
              name: 'X-My-Header',
              value: 'value'
            })
          ]
        }
      ]
    });

    // THEN
    expect(stack).to(haveResource('AWS::SES::ReceiptRule', {
      Rule: {
        Actions: [
          {
            AddHeaderAction: {
              HeaderName: 'X-My-Header',
              HeaderValue: 'value'
            }
          }
        ],
        Enabled: true
      }
    }));

    test.done();
  },

  'fails when header name is invalid'(test: Test) {
    const stack = new Stack();

    test.throws(() => new ReceiptRuleSet(stack, 'RuleSet', {
      rules: [
        {
          actions: [
            new ReceiptRuleAddHeaderAction({
              name: 'He@der',
              value: 'value'
            })
          ]
        }
      ]
    }), /`name`/);

    test.done();
  },

  'fails when header value is invalid'(test: Test) {
    const stack = new Stack();

    const ruleSet = new ReceiptRuleSet(stack, 'RuleSet');

    test.throws(() => ruleSet.addRule('Rule', {
      actions: [
        new ReceiptRuleAddHeaderAction({
          name: 'Header',
          value: `va
          lu`
        })
      ]
    }), /`value`/);

    test.done();
  },

  'can add a bounce action'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const topic = new sns.Topic(stack, 'Topic');

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      rules: [
        {
          actions: [
            new ReceiptRuleBounceAction({
              sender: 'noreply@aws.com',
              template: ReceiptRuleBounceActionTemplate.MESSAGE_CONTENT_REJECTED,
              topic
            })
          ]
        }
      ]
    });

   // THEN
    expect(stack).to(haveResource('AWS::SES::ReceiptRule', {
      Rule: {
        Actions: [
          {
            BounceAction: {
              Message: 'Message content rejected',
              Sender: 'noreply@aws.com',
              SmtpReplyCode: '500',
              TopicArn: {
                Ref: 'TopicBFC7AF6E'
              },
              StatusCode: '5.6.1',
            }
          }
        ],
        Enabled: true
      }
    }));

    test.done();
   },

  'can add a lambda action'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const topic = new sns.Topic(stack, 'Topic');

    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.Code.fromInline('boom'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_8_10
    });

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      rules: [
        {
          actions: [
            new ReceiptRuleLambdaAction({
              function: fn,
              invocationType: LambdaInvocationType.REQUEST_RESPONSE,
              topic
            })
          ]
        }
      ]
    });

    // THEN
    expect(stack).to(haveResource('AWS::SES::ReceiptRule', {
      Rule: {
        Actions: [
          {
            LambdaAction: {
              FunctionArn: {
                'Fn::GetAtt': [
                  'Function76856677',
                  'Arn'
                ]
              },
              InvocationType: 'RequestResponse',
              TopicArn: {
                Ref: 'TopicBFC7AF6E'
              }
            }
          },
        ],
        Enabled: true
      }
    }));

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': [
          'Function76856677',
          'Arn'
        ]
      },
      Principal: 'ses.amazonaws.com',
      SourceAccount: {
        Ref: 'AWS::AccountId'
      }
    }));

    test.done();
  },

  'can add a s3 action'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const topic = new sns.Topic(stack, 'Topic');

    const bucket = new s3.Bucket(stack, 'Bucket');

    const kmsKey = new kms.Key(stack, 'Key');

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      rules: [
        {
          actions: [
            new ReceiptRuleS3Action({
              bucket,
              kmsKey,
              objectKeyPrefix: 'emails/',
              topic
            })
          ]
        }
      ]
    });

    // THEN
    expect(stack).to(haveResource('AWS::SES::ReceiptRule', {
      Rule: {
        Actions: [
          {
            S3Action: {
              BucketName: {
                Ref: 'Bucket83908E77'
              },
              KmsKeyArn: {
                'Fn::GetAtt': [
                  'Key961B73FD',
                  'Arn'
                ]
              },
              TopicArn: {
                Ref: 'TopicBFC7AF6E'
              },
              ObjectKeyPrefix: 'emails/'
            }
          }
        ],
        Enabled: true
      }
    }));

    expect(stack).to(haveResource('AWS::S3::BucketPolicy', {
      Bucket: {
        Ref: 'Bucket83908E77'
      },
      PolicyDocument: {
        Statement: [
          {
            Action: 's3:PutObject',
            Condition: {
              StringEquals: {
                'aws:Referer': {
                  Ref: 'AWS::AccountId'
                }
              }
            },
            Effect: 'Allow',
            Principal: {
              Service: "ses.amazonaws.com"
            },
            Resource: {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      'Bucket83908E77',
                      'Arn'
                    ]
                  },
                  '/emails/*'
                ]
              ]
            }
          }
        ],
        Version: '2012-10-17'
      }
    }));

    expect(stack).to(haveResourceLike('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          {
            Action: [
              'kms:Create*',
              'kms:Describe*',
              'kms:Enable*',
              'kms:List*',
              'kms:Put*',
              'kms:Update*',
              'kms:Revoke*',
              'kms:Disable*',
              'kms:Get*',
              'kms:Delete*',
              'kms:ScheduleKeyDeletion',
              'kms:CancelKeyDeletion',
              "kms:GenerateDataKey"
            ],
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition'
                    },
                    ':iam::',
                    {
                      Ref: 'AWS::AccountId'
                    },
                    ':root'
                  ]
                ]
              }
            },
            Resource: '*'
          },
          {
            Action: [
              'km:Encrypt',
              'kms:GenerateDataKey'
            ],
            Condition: {
              Null: {
                'kms:EncryptionContext:aws:ses:rule-name': 'false',
                'kms:EncryptionContext:aws:ses:message-id': 'false'
              },
              StringEquals: {
                'kms:EncryptionContext:aws:ses:source-account': {
                  Ref: 'AWS::AccountId'
                }
              }
            },
            Effect: 'Allow',
            Principal: {
              Service: "ses.amazonaws.com"
            },
            Resource: '*'
          }
        ],
        Version: '2012-10-17'
      }
    }));

    test.done();
  },

  'can add a sns action'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const topic = new sns.Topic(stack, 'Topic');

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      rules: [
        {
          actions: [
            new ReceiptRuleSnsAction({
              encoding: EmailEncoding.BASE64,
              topic
            })
          ]
        }
      ]
    });

    // THEN
    expect(stack).to(haveResource('AWS::SES::ReceiptRule', {
      Rule: {
        Actions: [
          {
            SNSAction: {
              Encoding: 'Base64',
              TopicArn: {
                Ref: 'TopicBFC7AF6E'
              }
            }
          }
        ],
        Enabled: true
      }
    }));

    test.done();
  },

  'can add a stop action'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const topic = new sns.Topic(stack, 'Topic');

    // WHEN
    new ReceiptRuleSet(stack, 'RuleSet', {
      rules: [
        {
          actions: [
            new ReceiptRuleStopAction({
              topic
            })
          ]
        }
      ]
    });

    // THEN
    expect(stack).to(haveResource('AWS::SES::ReceiptRule', {
      Rule: {
        Actions: [
          {
            StopAction: {
              Scope: 'RuleSet',
              TopicArn: {
                Ref: 'TopicBFC7AF6E'
              }
            }
          }
        ],
        Enabled: true
      }
    }));

    test.done();
  }
};
