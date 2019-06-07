import '@aws-cdk/assert/jest';
import lambda = require('@aws-cdk/aws-lambda');
import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import { Stack } from '@aws-cdk/cdk';
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
  topic.subscribe(new subs.UrlSubscriber('https://foobar.com/'));

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
  topic.subscribe(new subs.UrlSubscriber('https://foobar.com/', {
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

test('queue subscription', () => {
  const queue = new sqs.Queue(stack, 'MyQueue');

  topic.subscribe(new subs.SqsSubscriber(queue));

  expect(stack).toMatchTemplate({
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
});

test('queue subscription (with raw delivery)', () => {
  const queue = new sqs.Queue(stack, 'MyQueue');

  topic.subscribe(new subs.SqsSubscriber(queue, { rawMessageDelivery: true }));

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
    runtime: lambda.Runtime.NodeJS810,
    handler: 'index.handler',
    code: lambda.Code.inline('exports.handler = function(e, c, cb) { return cb() }')
  });

  topic.subscribe(new subs.LambdaSubscriber(fction));

  expect(stack).toMatchTemplate({
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
});

test('email subscription', () => {
  topic.subscribe(new subs.EmailSubscriber('foo@bar.com'));

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
    runtime: lambda.Runtime.NodeJS810,
    handler: 'index.handler',
    code: lambda.Code.inline('exports.handler = function(e, c, cb) { return cb() }')
  });

  topic.subscribe(new subs.SqsSubscriber(queue));
  topic.subscribe(new subs.LambdaSubscriber(func));

  expect(stack).toMatchTemplate({
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
});