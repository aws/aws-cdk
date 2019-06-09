import { expect, haveResource } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');
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

    'url subscription (with raw delivery)'(test: Test) {
      const stack = new cdk.Stack();

      const topic = new sns.Topic(stack, 'MyTopic', {
        topicName: 'topicName',
        displayName: 'displayName'
      });

      topic.subscribeUrl('appsubscription', 'https://foobar.com/', true);

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
              "TopicArn": { "Ref": "MyTopic86869434" },
              "RawMessageDelivery": true
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
        "MyQueueMyTopicSubscriptionEB66AD1B": {
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

    'queue subscription (with raw delivery)'(test: Test) {
      const stack = new cdk.Stack();

      const topic = new sns.Topic(stack, 'MyTopic', {
        topicName: 'topicName',
        displayName: 'displayName'
      });

      const queue = new sqs.Queue(stack, 'MyQueue');

      topic.subscribeQueue(queue, true);

      expect(stack).to(haveResource('AWS::SNS::Subscription', {
        "Endpoint": {
          "Fn::GetAtt": [
            "MyQueueE6CA6235",
            "Arn"
          ]
        },
        "Protocol": "sqs",
        "TopicArn": {
          "Ref": "MyTopic86869434"
        },
        "RawMessageDelivery": true
      }));

      test.done();
    },

    'lambda subscription'(test: Test) {
      const stack = new cdk.Stack();

      const topic = new sns.Topic(stack, 'MyTopic', {
        topicName: 'topicName',
        displayName: 'displayName'
      });

      const fction = new lambda.Function(stack, 'MyFunc', {
        runtime: lambda.Runtime.Nodejs810,
        handler: 'index.handler',
        code: lambda.Code.inline('exports.handler = function(e, c, cb) { return cb() }')
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
        "MyFuncMyTopicSubscription708A6535": {
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
              "Service": { "Fn::Join": ["", ["lambda.", { Ref: "AWS::URLSuffix" }]] }
              }
            }
            ],
            "Version": "2012-10-17"
          },
          "ManagedPolicyArns": [
            { "Fn::Join": ["", ["arn:", {"Ref": "AWS::Partition"}, ":iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"]]}
          ]
          }
        },
        "MyFunc8A243A2C": {
          "Type": "AWS::Lambda::Function",
          "Properties": {
          "Code": {
            "ZipFile": "exports.handler = function(e, c, cb) { return cb() }"
          },
          "Handler": "index.handler",
          "Role": {
            "Fn::GetAtt": [
            "MyFuncServiceRole54065130",
            "Arn"
            ]
          },
          "Runtime": "nodejs8.10"
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
            "Fn::GetAtt": [
              "MyFunc8A243A2C",
              "Arn"
            ]
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
      const func = new lambda.Function(stack, 'MyFunc', {
        runtime: lambda.Runtime.Nodejs810,
        handler: 'index.handler',
        code: lambda.Code.inline('exports.handler = function(e, c, cb) { return cb() }')
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
          "MyQueueMyTopicSubscriptionEB66AD1B": {
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
          "MyFuncMyTopicSubscription708A6535": {
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
          "MyFuncServiceRole54065130": {
            "Type": "AWS::IAM::Role",
            "Properties": {
              "AssumeRolePolicyDocument": {
                "Statement": [
                  {
                    "Action": "sts:AssumeRole",
                    "Effect": "Allow",
                    "Principal": {
                      "Service": { "Fn::Join": ["", ["lambda.", { Ref: "AWS::URLSuffix" }]] }
                    }
                  }
                ],
                "Version": "2012-10-17"
              },
              "ManagedPolicyArns": [
                {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
                    ]
                  ]
                }
              ]
            }
          },
          "MyFunc8A243A2C": {
            "Type": "AWS::Lambda::Function",
            "Properties": {
              "Code": {
                "ZipFile": "exports.handler = function(e, c, cb) { return cb() }"
              },
              "Handler": "index.handler",
              "Role": {
                "Fn::GetAtt": [
                  "MyFuncServiceRole54065130",
                  "Arn"
                ]
              },
              "Runtime": "nodejs8.10"
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
                "Fn::GetAtt": [
                  "MyFunc8A243A2C",
                  "Arn"
                ]
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

    'invalid use of raw message delivery'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const topic = new sns.Topic(stack, 'Topic');

      // THEN
      test.throws(() => topic.subscribe('Nope', 'endpoint://location', sns.SubscriptionProtocol.Application, true),
                  /Raw message delivery can only be enabled for HTTP\/S and SQS subscriptions/);
      test.done();
    }
  },

  'can add a policy to the topic'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');

    // WHEN
    topic.addToResourcePolicy(new iam.PolicyStatement()
      .addAllResources()
      .addActions('sns:*')
      .addPrincipal(new iam.ArnPrincipal('arn')));

    // THEN
    expect(stack).to(haveResource('AWS::SNS::TopicPolicy', {
    PolicyDocument: {
      Version: '2012-10-17',
      Statement: [{
        "Sid": "0",
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
      Version: '2012-10-17',
      "Statement": [
      {
        "Action": "sns:Publish",
        "Effect": "Allow",
        "Resource": stack.resolve(topic.topicArn)
      }
      ],
    }
    }));

    test.done();
  },

  'topic resource policy includes unique SIDs'(test: Test) {
    const stack = new cdk.Stack();

    const topic = new sns.Topic(stack, 'MyTopic');

    topic.addToResourcePolicy(new iam.PolicyStatement().addAction('statement0'));
    topic.addToResourcePolicy(new iam.PolicyStatement().addAction('statement1'));

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

  'fromTopicArn'(test: Test) {
    // GIVEN
    const stack2 = new cdk.Stack();
    const queue = new sqs.Queue(stack2, 'Queue');

    // WHEN
    const imported = sns.Topic.fromTopicArn(stack2, 'Imported', 'arn:aws:sns:*:123456789012:my_corporate_topic');
    imported.subscribeQueue(queue);

    // THEN
    test.deepEqual(imported.topicName, 'my_corporate_topic');
    test.deepEqual(imported.topicArn, 'arn:aws:sns:*:123456789012:my_corporate_topic');
    test.done();
  },

  'test metrics'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');

    // THEN
    test.deepEqual(stack.resolve(topic.metricNumberOfMessagesPublished()), {
      dimensions: {TopicName: { 'Fn::GetAtt': [ 'TopicBFC7AF6E', 'TopicName' ] }},
      namespace: 'AWS/SNS',
      metricName: 'NumberOfMessagesPublished',
      periodSec: 300,
      statistic: 'Sum'
    });

    test.deepEqual(stack.resolve(topic.metricPublishSize()), {
      dimensions: {TopicName: { 'Fn::GetAtt': [ 'TopicBFC7AF6E', 'TopicName' ] }},
      namespace: 'AWS/SNS',
      metricName: 'PublishSize',
      periodSec: 300,
      statistic: 'Average'
    });

    test.done();
  }
};
