import { expect, haveResource } from '@aws-cdk/assert';
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import s3n = require('@aws-cdk/aws-s3-notifications');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');
import { resolve } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import sns = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'topic tests': {
    'all defaults'(test: Test) {
      const stack = new cdk.Stack();
      new sns.Topic(stack, 'MyTopic');

      expect(stack).toMatch({
        "Resources": {
          "MyTopic86869434": {
          "Type": "AWS::SNS::Topic"
          }
        }
      });

      test.done();
    },

    'specify topicName'(test: Test) {
      const stack = new cdk.Stack();

      new sns.Topic(stack, 'MyTopic', {
        topicName: 'topicName'
      });

      expect(stack).toMatch({
        "Resources": {
          "MyTopic86869434": {
          "Type": "AWS::SNS::Topic",
          "Properties": {
            "TopicName": "topicName"
          }
          }
        }
      });

      test.done();
    },

    'specify displayName'(test: Test) {
      const stack = new cdk.Stack();

      new sns.Topic(stack, 'MyTopic', {
        displayName: 'displayName'
      });

      expect(stack).toMatch({
        "Resources": {
          "MyTopic86869434": {
          "Type": "AWS::SNS::Topic",
          "Properties": {
            "DisplayName": "displayName"
          }
          }
        }
      });

      test.done();
    },

    'specify both'(test: Test) {
      const stack = new cdk.Stack();

      new sns.Topic(stack, 'MyTopic', {
        topicName: 'topicName',
        displayName: 'displayName'
      });

      expect(stack).toMatch({
        "Resources": {
          "MyTopic86869434": {
          "Type": "AWS::SNS::Topic",
          "Properties": {
            "DisplayName": "displayName",
            "TopicName": "topicName"
          }
          }
        }
      });

      test.done();
    },
  },
  'subscription tests': {
    'url subscription'(test: Test) {
      const stack = new cdk.Stack();

      const topic = new sns.Topic(stack, 'MyTopic', {
        topicName: 'topicName',
        displayName: 'displayName'
      });

      topic.subscribeUrl('appsubscription', 'https://foobar.com/');

      expect(stack).toMatch({
        "Resources": {
          "MyTopic86869434": {
          "Type": "AWS::SNS::Topic",
          "Properties": {
            "DisplayName": "displayName",
            "TopicName": "topicName"
          }
          },
          "MyTopicappsubscription00FA69EA": {
          "Type": "AWS::SNS::Subscription",
          "Properties": {
            "Endpoint": "https://foobar.com/",
            "Protocol": "https",
            "TopicArn": {
            "Ref": "MyTopic86869434"
            }
          }
          }
        }
      });

      test.done();
    },

    'queue subscription'(test: Test) {
      const stack = new cdk.Stack();

      const topic = new sns.Topic(stack, 'MyTopic', {
        topicName: 'topicName',
        displayName: 'displayName'
      });

      const queue = new sqs.Queue(stack, 'MyQueue');

      topic.subscribeQueue(queue);

      expect(stack).toMatch({
        "Resources": {
        "MyTopic86869434": {
          "Type": "AWS::SNS::Topic",
          "Properties": {
          "DisplayName": "displayName",
          "TopicName": "topicName"
          }
        },
        "MyTopicMyQueueSubscription3245B11E": {
          "Type": "AWS::SNS::Subscription",
          "Properties": {
          "Endpoint": {
            "Fn::GetAtt": [
            "MyQueueE6CA6235",
            "Arn"
            ]
          },
          "Protocol": "sqs",
          "TopicArn": {
            "Ref": "MyTopic86869434"
          }
          }
        },
        "MyQueueE6CA6235": {
          "Type": "AWS::SQS::Queue"
        },
        "MyQueuePolicy6BBEDDAC": {
          "Type": "AWS::SQS::QueuePolicy",
          "Properties": {
          "PolicyDocument": {
            "Statement": [
            {
              "Action": "sqs:SendMessage",
              "Condition": {
              "ArnEquals": {
                "aws:SourceArn": {
                "Ref": "MyTopic86869434"
                }
              }
              },
              "Effect": "Allow",
              "Principal": {
              "Service": "sns.amazonaws.com"
              },
              "Resource": {
              "Fn::GetAtt": [
                "MyQueueE6CA6235",
                "Arn"
              ]
              }
            }
            ],
            "Version": "2012-10-17"
          },
          "Queues": [
            {
            "Ref": "MyQueueE6CA6235"
            }
          ]
          }
        }
        }
      });

      test.done();
    },

    'lambda subscription'(test: Test) {
      const stack = new cdk.Stack();

      const topic = new sns.Topic(stack, 'MyTopic', {
        topicName: 'topicName',
        displayName: 'displayName'
      });

      const fction = new lambda.InlineJavaScriptFunction(stack, 'MyFunc', {
        handler: {
          fn: (_event, _context, callback) => callback()
        }
      });

      topic.subscribeLambda(fction);

      expect(stack).toMatch({
        "Resources": {
        "MyTopic86869434": {
          "Type": "AWS::SNS::Topic",
          "Properties": {
          "DisplayName": "displayName",
          "TopicName": "topicName"
          }
        },
        "MyTopicMyFuncSubscriptionEAF54A3F": {
          "Type": "AWS::SNS::Subscription",
          "Properties": {
          "Endpoint": {
            "Fn::GetAtt": [
            "MyFunc8A243A2C",
            "Arn"
            ]
          },
          "Protocol": "lambda",
          "TopicArn": {
            "Ref": "MyTopic86869434"
          }
          }
        },
        "MyFuncServiceRole54065130": {
          "Type": "AWS::IAM::Role",
          "Properties": {
          "AssumeRolePolicyDocument": {
            "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
              "Service": "lambda.amazonaws.com"
              }
            }
            ],
            "Version": "2012-10-17"
          },
          "ManagedPolicyArns": [
            { "Fn::Join": ["", ["arn", ":", {"Ref": "AWS::Partition"}, ":", "iam", ":", "", ":", "aws", ":", "policy", "/",
              "service-role/AWSLambdaBasicExecutionRole"]]}
          ]
          }
        },
        "MyFunc8A243A2C": {
          "Type": "AWS::Lambda::Function",
          "Properties": {
          "Code": {
            "ZipFile": "exports.handler = (_event, _context, callback) => callback()"
          },
          "Handler": "index.handler",
          "Role": {
            "Fn::GetAtt": [
            "MyFuncServiceRole54065130",
            "Arn"
            ]
          },
          "Runtime": "nodejs6.10",
          "Timeout": 30
          },
          "DependsOn": [
          "MyFuncServiceRole54065130"
          ]
        },
        "MyFuncMyTopicC77D8FAB": {
          "Type": "AWS::Lambda::Permission",
          "Properties": {
          "Action": "lambda:InvokeFunction",
          "FunctionName": {
            "Ref": "MyFunc8A243A2C"
          },
          "Principal": "sns.amazonaws.com",
          "SourceArn": {
            "Ref": "MyTopic86869434"
          }
          }
        }
        }
      });

      test.done();
    },

    'email subscription'(test: Test) {
      const stack = new cdk.Stack();

      const topic = new sns.Topic(stack, 'MyTopic', {
        topicName: 'topicName',
        displayName: 'displayName'
      });

      topic.subscribeEmail('emailsub', 'foo@bar.com');

      expect(stack).toMatch({
        "Resources": {
        "MyTopic86869434": {
          "Type": "AWS::SNS::Topic",
          "Properties": {
          "DisplayName": "displayName",
          "TopicName": "topicName"
          }
        },
        "MyTopicemailsub17B79A3E": {
          "Type": "AWS::SNS::Subscription",
          "Properties": {
          "Endpoint": "foo@bar.com",
          "Protocol": "email",
          "TopicArn": {
            "Ref": "MyTopic86869434"
          }
          }
        }
        }
      });

      test.done();
    },

    'multiple subscriptions'(test: Test) {
      const stack = new cdk.Stack();

      const topic = new sns.Topic(stack, 'MyTopic', {
        topicName: 'topicName',
        displayName: 'displayName'
      });

      const queue = new sqs.Queue(stack, 'MyQueue');
      const func = new lambda.InlineJavaScriptFunction(stack, 'MyLambda', {
        handler: {
          fn: (_event, _context, callback: any) => callback()
        }
      });

      topic.subscribeQueue(queue);
      topic.subscribeLambda(func);

      expect(stack).toMatch({
        "Resources": {
        "MyTopic86869434": {
          "Type": "AWS::SNS::Topic",
          "Properties": {
          "DisplayName": "displayName",
          "TopicName": "topicName"
          }
        },
        "MyTopicMyQueueSubscription3245B11E": {
          "Type": "AWS::SNS::Subscription",
          "Properties": {
          "Endpoint": {
            "Fn::GetAtt": [
            "MyQueueE6CA6235",
            "Arn"
            ]
          },
          "Protocol": "sqs",
          "TopicArn": {
            "Ref": "MyTopic86869434"
          }
          }
        },
        "MyTopicMyLambdaSubscription3591BC1E": {
          "Type": "AWS::SNS::Subscription",
          "Properties": {
          "Endpoint": {
            "Fn::GetAtt": [
            "MyLambdaCCE802FB",
            "Arn"
            ]
          },
          "Protocol": "lambda",
          "TopicArn": {
            "Ref": "MyTopic86869434"
          }
          }
        },
        "MyQueueE6CA6235": {
          "Type": "AWS::SQS::Queue"
        },
        "MyQueuePolicy6BBEDDAC": {
          "Type": "AWS::SQS::QueuePolicy",
          "Properties": {
          "PolicyDocument": {
            "Statement": [
            {
              "Action": "sqs:SendMessage",
              "Condition": {
              "ArnEquals": {
                "aws:SourceArn": {
                "Ref": "MyTopic86869434"
                }
              }
              },
              "Effect": "Allow",
              "Principal": {
              "Service": "sns.amazonaws.com"
              },
              "Resource": {
              "Fn::GetAtt": [
                "MyQueueE6CA6235",
                "Arn"
              ]
              }
            }
            ],
            "Version": "2012-10-17"
          },
          "Queues": [
            {
            "Ref": "MyQueueE6CA6235"
            }
          ]
          }
        },
        "MyLambdaServiceRole4539ECB6": {
          "Type": "AWS::IAM::Role",
          "Properties": {
          "AssumeRolePolicyDocument": {
            "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
              "Service": "lambda.amazonaws.com"
              }
            }
            ],
            "Version": "2012-10-17"
          },
          "ManagedPolicyArns": [
            { "Fn::Join": ["", ["arn", ":", {"Ref": "AWS::Partition"}, ":", "iam", ":", "", ":", "aws", ":", "policy", "/",
              "service-role/AWSLambdaBasicExecutionRole"]]}
          ]
          }
        },
        "MyLambdaCCE802FB": {
          "Type": "AWS::Lambda::Function",
          "Properties": {
          "Code": {
            "ZipFile": "exports.handler = (_event, _context, callback) => callback()"
          },
          "Handler": "index.handler",
          "Role": {
            "Fn::GetAtt": [
            "MyLambdaServiceRole4539ECB6",
            "Arn"
            ]
          },
          "Runtime": "nodejs6.10",
          "Timeout": 30
          },
          "DependsOn": [
          "MyLambdaServiceRole4539ECB6"
          ]
        },
        "MyLambdaMyTopic96470869": {
          "Type": "AWS::Lambda::Permission",
          "Properties": {
          "Action": "lambda:InvokeFunction",
          "FunctionName": {
            "Ref": "MyLambdaCCE802FB"
          },
          "Principal": "sns.amazonaws.com",
          "SourceArn": {
            "Ref": "MyTopic86869434"
          }
          }
        }
        }
      });

      test.done();
    },
  },

  'can add a policy to the topic'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');

    // WHEN
    topic.addToResourcePolicy(new cdk.PolicyStatement()
      .addAllResources()
      .addActions('sns:*')
      .addPrincipal(new cdk.ArnPrincipal('arn')));

    // THEN
    expect(stack).to(haveResource('AWS::SNS::TopicPolicy', {
    PolicyDocument: {
      Statement: [{
        "Action": "sns:*",
        "Effect": "Allow",
        "Principal": { "AWS": "arn" },
        "Resource": "*"
      }]
    }
    }));

    test.done();
  },

  'give publishing permissions'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');
    const user = new iam.User(stack, 'User');

    // WHEN
    topic.grantPublish(user);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
    "PolicyDocument": {
      "Statement": [
      {
        "Action": "sns:Publish",
        "Effect": "Allow",
        "Resource": cdk.resolve(topic.topicArn)
      }
      ],
    }
    }));

    test.done();
  },

  'topics can be used as event rule targets (and then the topic policy will allow that too)'(test: Test) {
    const stack = new cdk.Stack();

    const topic = new sns.Topic(stack, 'MyTopic');

    const rule = new events.EventRule(stack, 'MyRule', {
      scheduleExpression: 'rate(1 hour)',
    });

    rule.addTarget(topic);

    expect(stack).toMatch({
      "Resources": {
      "MyTopic86869434": {
        "Type": "AWS::SNS::Topic"
      },
      "MyTopicPolicy12A5EC17": {
        "Type": "AWS::SNS::TopicPolicy",
        "Properties": {
        "PolicyDocument": {
          "Statement": [
          {
            "Sid": "0",
            "Action": "sns:Publish",
            "Effect": "Allow",
            "Principal": {
            "Service": "events.amazonaws.com"
            },
            "Resource": {
            "Ref": "MyTopic86869434"
            }
          }
          ],
          "Version": "2012-10-17"
        },
        "Topics": [
          {
          "Ref": "MyTopic86869434"
          }
        ]
        }
      },
      "MyRuleA44AB831": {
        "Type": "AWS::Events::Rule",
        "Properties": {
        "ScheduleExpression": "rate(1 hour)",
        "State": "ENABLED",
        "Targets": [
          {
          "Arn": {
            "Ref": "MyTopic86869434"
          },
          "Id": "MyTopic"
          }
        ]
        }
      }
      }
    });

    test.done();
  },
  'topic resource policy includes unique SIDs'(test: Test) {
    const stack = new cdk.Stack();

    const topic = new sns.Topic(stack, 'MyTopic');

    topic.addToResourcePolicy(new cdk.PolicyStatement().addAction('statement0'));
    topic.addToResourcePolicy(new cdk.PolicyStatement().addAction('statement1'));

    expect(stack).toMatch({
      "Resources": {
      "MyTopic86869434": {
        "Type": "AWS::SNS::Topic"
      },
      "MyTopicPolicy12A5EC17": {
        "Type": "AWS::SNS::TopicPolicy",
        "Properties": {
        "PolicyDocument": {
          "Statement": [
          {
            "Action": "statement0",
            "Effect": "Allow",
            "Sid": "0"
          },
          {
            "Action": "statement1",
            "Effect": "Allow",
            "Sid": "1"
          }
          ],
          "Version": "2012-10-17"
        },
        "Topics": [
          {
          "Ref": "MyTopic86869434"
          }
        ]
        }
      }
      }
    });

    test.done();
  },

  'export/import'(test: Test) {
    // GIVEN
    const stack1 = new cdk.Stack();
    const topic = new sns.Topic(stack1, 'Topic');

    const stack2 = new cdk.Stack();
    const queue = new sqs.Queue(stack2, 'Queue');

    // WHEN
    const ref = topic.export();
    const imported = sns.TopicRef.import(stack2, 'Imported', ref);
    imported.subscribeQueue(queue);

    // THEN
    expect(stack2).to(haveResource('AWS::SNS::Subscription', {
    "TopicArn": { "Fn::ImportValue": "TopicTopicArnB66B79C2" },
    }));
    expect(stack2).to(haveResource('AWS::SQS::QueuePolicy', {
    "PolicyDocument": {
      "Statement": [
      {
        "Action": "sqs:SendMessage",
        "Condition": {
        "ArnEquals": {
          "aws:SourceArn": { "Fn::ImportValue": "TopicTopicArnB66B79C2" }
        }
        },
        "Principal": { "Service": "sns.amazonaws.com" },
        "Effect": "Allow",
      }
      ],
    },
    }));

    test.done();
  },

  'asBucketNotificationDestination adds bucket permissions only once for each bucket'(test: Test) {
    const stack = new cdk.Stack();

    const topic = new sns.Topic(stack, 'MyTopic');

    const bucketArn = 'arn:bucket';
    const bucketId = 'bucketId';

    const dest1 = topic.asBucketNotificationDestination(bucketArn, bucketId);
    test.deepEqual(resolve(dest1.arn), resolve(topic.topicArn));
    test.deepEqual(dest1.type, s3n.BucketNotificationDestinationType.Topic);

    const dep: cdk.Construct = dest1.dependencies![0] as any;
    test.deepEqual((dep.children[0] as any).logicalId, 'MyTopicPolicy12A5EC17', 'verify topic policy is added as dependency');

    // calling again on the same bucket yields is idempotent
    const dest2 = topic.asBucketNotificationDestination(bucketArn, bucketId);
    test.deepEqual(resolve(dest2.arn), resolve(topic.topicArn));
    test.deepEqual(dest2.type, s3n.BucketNotificationDestinationType.Topic);

    // another bucket will be added to the topic policy
    const dest3 = topic.asBucketNotificationDestination('bucket2', 'bucket2');
    test.deepEqual(resolve(dest3.arn), resolve(topic.topicArn));
    test.deepEqual(dest3.type, s3n.BucketNotificationDestinationType.Topic);

    expect(stack).toMatch({
      "Resources": {
      "MyTopic86869434": {
        "Type": "AWS::SNS::Topic"
      },
      "MyTopicPolicy12A5EC17": {
        "Type": "AWS::SNS::TopicPolicy",
        "Properties": {
        "PolicyDocument": {
          "Statement": [
          {
            "Action": "sns:Publish",
            "Condition": {
            "ArnLike": {
              "aws:SourceArn": "arn:bucket"
            }
            },
            "Effect": "Allow",
            "Principal": {
            "Service": "s3.amazonaws.com"
            },
            "Resource": {
            "Ref": "MyTopic86869434"
            },
            "Sid": "0"
          },
          {
            "Action": "sns:Publish",
            "Condition": {
            "ArnLike": {
              "aws:SourceArn": "bucket2"
            }
            },
            "Effect": "Allow",
            "Principal": {
            "Service": "s3.amazonaws.com"
            },
            "Resource": {
            "Ref": "MyTopic86869434"
            },
            "Sid": "1"
          }
          ],
          "Version": "2012-10-17"
        },
        "Topics": [
          {
          "Ref": "MyTopic86869434"
          }
        ]
        }
      }
      }
    });

    test.done();
  }
};
