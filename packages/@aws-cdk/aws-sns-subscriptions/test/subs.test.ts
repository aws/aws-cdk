import '@aws-cdk/assert/jest';
import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import { CfnParameter, SecretValue, Stack } from '@aws-cdk/core';
import subs = require('../lib');

// tslint:disable:object-literal-key-quotes

let stack: Stack;
let topic: sns.Topic;

beforeEach(() => {
  stack = new Stack();
  topic = new sns.Topic(stack, 'MyTopic', {
    topicName: 'topicName',
    displayName: 'displayName'
  });
});

test('url subscription', () => {
  topic.addSubscription(new subs.UrlSubscription('https://foobar.com/'));

  expect(stack).toMatchTemplate({
    "Resources": {
      "MyTopic86869434": {
        "Type": "AWS::SNS::Topic",
        "Properties": {
          "DisplayName": "displayName",
          "TopicName": "topicName"
        }
      },
      "MyTopichttpsfoobarcomDEA92AB5": {
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
});

test('url subscription (with raw delivery)', () => {
  topic.addSubscription(new subs.UrlSubscription('https://foobar.com/', {
    rawMessageDelivery: true
  }));

  expect(stack).toMatchTemplate({
    "Resources": {
      "MyTopic86869434": {
        "Type": "AWS::SNS::Topic",
        "Properties": {
          "DisplayName": "displayName",
          "TopicName": "topicName"
        }
      },
      "MyTopichttpsfoobarcomDEA92AB5": {
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
});

test('url subscription (unresolved url with protocol)', () => {
  const secret = SecretValue.secretsManager('my-secret');
  const url = secret.toString();
  topic.addSubscription(new subs.UrlSubscription(url, {protocol: sns.SubscriptionProtocol.HTTPS}));

  expect(stack).toMatchTemplate({
    "Resources": {
      "MyTopic86869434": {
        "Type": "AWS::SNS::Topic",
        "Properties": {
          "DisplayName": "displayName",
          "TopicName": "topicName"
        }
      },
      "MyTopicUnresolvedUrlBA127FB3": {
        "Type": "AWS::SNS::Subscription",
        "Properties": {
          "Endpoint": "{{resolve:secretsmanager:my-secret:SecretString:::}}",
          "Protocol": "https",
          "TopicArn": { "Ref": "MyTopic86869434" },
        }
      }
    }
  });
});

test('url subscription (unknown protocol)', () => {
  expect(() => topic.addSubscription(new subs.UrlSubscription('some-protocol://foobar.com/')))
   .toThrowError(/URL must start with either http:\/\/ or https:\/\//);
});

test('url subscription (unresolved url without protocol)', () => {
  const secret = SecretValue.secretsManager('my-secret');
  const url = secret.toString();
  expect(() => topic.addSubscription(new subs.UrlSubscription(url)))
   .toThrowError(/Must provide protocol if url is unresolved/);
});

test('queue subscription', () => {
  const queue = new sqs.Queue(stack, 'MyQueue');

  topic.addSubscription(new subs.SqsSubscription(queue));

  expect(stack).toMatchTemplate({
    "Resources": {
      "MyTopic86869434": {
        "Type": "AWS::SNS::Topic",
        "Properties": {
          "DisplayName": "displayName",
          "TopicName": "topicName"
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
      "MyQueueMyTopic9B00631B": {
        "Type": "AWS::SNS::Subscription",
        "Properties": {
          "Protocol": "sqs",
          "TopicArn": {
            "Ref": "MyTopic86869434"
          },
          "Region": {
            "Fn::Select": [ 3, { "Fn::Split": [ ":", { "Ref": "MyTopic86869434" } ] } ]
          },
          "Endpoint": {
            "Fn::GetAtt": [
              "MyQueueE6CA6235",
              "Arn"
            ]
          }
        }
      }
    }
  });
});

test('queue subscription (with raw delivery)', () => {
  const queue = new sqs.Queue(stack, 'MyQueue');

  topic.addSubscription(new subs.SqsSubscription(queue, { rawMessageDelivery: true }));

  expect(stack).toHaveResource('AWS::SNS::Subscription', {
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
  });
});

test('lambda subscription', () => {
  const fction = new lambda.Function(stack, 'MyFunc', {
    runtime: lambda.Runtime.NODEJS_8_10,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = function(e, c, cb) { return cb() }')
  });

  topic.addSubscription(new subs.LambdaSubscription(fction));

  expect(stack).toMatchTemplate({
    "Resources": {
      "MyTopic86869434": {
        "Type": "AWS::SNS::Topic",
        "Properties": {
          "DisplayName": "displayName",
          "TopicName": "topicName"
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
      "MyFuncAllowInvokeMyTopicDD0A15B8": {
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
      },
      "MyFuncMyTopic93B6FB00": {
        "Type": "AWS::SNS::Subscription",
        "Properties": {
          "Protocol": "lambda",
          "TopicArn": {
            "Ref": "MyTopic86869434"
          },
          "Endpoint": {
            "Fn::GetAtt": [
              "MyFunc8A243A2C",
              "Arn"
            ]
          }
        }
      }
    }
  });
});

test('email subscription', () => {
  topic.addSubscription(new subs.EmailSubscription('foo@bar.com'));

  expect(stack).toMatchTemplate({
    "Resources": {
      "MyTopic86869434": {
        "Type": "AWS::SNS::Topic",
        "Properties": {
          "DisplayName": "displayName",
          "TopicName": "topicName"
        }
      },
      "MyTopicfoobarcomA344CADA": {
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
});

test('multiple subscriptions', () => {
  const queue = new sqs.Queue(stack, 'MyQueue');
  const func = new lambda.Function(stack, 'MyFunc', {
    runtime: lambda.Runtime.NODEJS_8_10,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = function(e, c, cb) { return cb() }')
  });

  topic.addSubscription(new subs.SqsSubscription(queue));
  topic.addSubscription(new subs.LambdaSubscription(func));

  expect(stack).toMatchTemplate({
    "Resources": {
      "MyTopic86869434": {
        "Type": "AWS::SNS::Topic",
        "Properties": {
          "DisplayName": "displayName",
          "TopicName": "topicName"
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
      "MyQueueMyTopic9B00631B": {
        "Type": "AWS::SNS::Subscription",
        "Properties": {
          "Protocol": "sqs",
          "TopicArn": {
            "Ref": "MyTopic86869434"
          },
          "Endpoint": {
            "Fn::GetAtt": [
              "MyQueueE6CA6235",
              "Arn"
            ]
          },
          "Region": {
            "Fn::Select": [ 3, { "Fn::Split": [ ":", { "Ref": "MyTopic86869434" } ] } ]
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
      "MyFuncAllowInvokeMyTopicDD0A15B8": {
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
      },
      "MyFuncMyTopic93B6FB00": {
        "Type": "AWS::SNS::Subscription",
        "Properties": {
          "Protocol": "lambda",
          "TopicArn": {
            "Ref": "MyTopic86869434"
          },
          "Endpoint": {
            "Fn::GetAtt": [
              "MyFunc8A243A2C",
              "Arn"
            ]
          }
        }
      }
    }
  });
});

test('throws with mutliple subscriptions of the same subscriber', () => {
  const queue = new sqs.Queue(stack, 'MyQueue');

  topic.addSubscription(new subs.SqsSubscription(queue));

  expect(() => topic.addSubscription(new subs.SqsSubscription(queue)))
    .toThrowError(/A subscription with id \"MyTopic\" already exists under the scope MyQueue/);
});

test('with filter policy', () => {
  const fction = new lambda.Function(stack, 'MyFunc', {
    runtime: lambda.Runtime.NODEJS_8_10,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = function(e, c, cb) { return cb() }')
  });

  topic.addSubscription(new subs.LambdaSubscription(fction, {
    filterPolicy: {
      color: sns.SubscriptionFilter.stringFilter({
        whitelist: ['red'],
        matchPrefixes: ['bl', 'ye'],
      }),
      size: sns.SubscriptionFilter.stringFilter({
        blacklist: ['small', 'medium'],
      }),
      price: sns.SubscriptionFilter.numericFilter({
        between: { start: 100, stop: 200 }
      })
    }
  }));

  expect(stack).toHaveResource('AWS::SNS::Subscription', {
    "FilterPolicy": {
      "color": [
        "red",
        {
          "prefix": "bl"
        },
        {
          "prefix": "ye"
        }
      ],
      "size": [
        {
          "anything-but": [
            "small",
            "medium"
          ]
        }
      ],
      "price": [
        {
          "numeric": [
            ">=",
            100,
            "<=",
            200
          ]
        }
      ]
    }
  });
});

test('region property is present on an imported topic', () => {
  const imported = sns.Topic.fromTopicArn(stack, 'mytopic', 'arn:aws:sns:us-east-1:1234567890:mytopic');
  const queue = new sqs.Queue(stack, 'myqueue');
  imported.addSubscription(new subs.SqsSubscription(queue));

  expect(stack).toHaveResource('AWS::SNS::Subscription', {
    Region: 'us-east-1'
  });
});

test('region property on an imported topic as a parameter', () => {
  const topicArn = new CfnParameter(stack, 'topicArn');
  const imported = sns.Topic.fromTopicArn(stack, 'mytopic', topicArn.valueAsString);
  const queue = new sqs.Queue(stack, 'myqueue');
  imported.addSubscription(new subs.SqsSubscription(queue));

  expect(stack).toHaveResource('AWS::SNS::Subscription', {
    Region: {
      "Fn::Select": [ 3, { "Fn::Split": [ ":", { "Ref": "topicArn" } ] } ]
    }
  });
});
