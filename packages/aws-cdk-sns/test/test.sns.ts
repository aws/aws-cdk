import { ArnPrincipal, PolicyStatement, resolve, Stack } from 'aws-cdk';
import { expect, haveResource } from 'aws-cdk-assert';
import { EventRule } from 'aws-cdk-events';
import { User } from 'aws-cdk-iam';
import { InlineJavaScriptLambda } from 'aws-cdk-lambda';
import { Queue } from 'aws-cdk-sqs';
import { Test } from 'nodeunit';
import { Topic } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
    'topic tests': {
        'all defaults'(test: Test) {
            const stack = new Stack();
            new Topic(stack, 'MyTopic');

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
            const stack = new Stack();

            new Topic(stack, 'MyTopic', {
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
            const stack = new Stack();

            new Topic(stack, 'MyTopic', {
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
            const stack = new Stack();

            new Topic(stack, 'MyTopic', {
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
            const stack = new Stack();

            const topic = new Topic(stack, 'MyTopic', {
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
            const stack = new Stack();

            const topic = new Topic(stack, 'MyTopic', {
                topicName: 'topicName',
                displayName: 'displayName'
            });

            const queue = new Queue(stack, 'MyQueue');

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
            const stack = new Stack();

            const topic = new Topic(stack, 'MyTopic', {
                topicName: 'topicName',
                displayName: 'displayName'
            });

            const lambda = new InlineJavaScriptLambda(stack, 'MyFunc', {
                handler: {
                    fn: (_event, _context, callback) => callback()
                }
            });

            topic.subscribeLambda(lambda);

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
            const stack = new Stack();

            const topic = new Topic(stack, 'MyTopic', {
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
            const stack = new Stack();

            const topic = new Topic(stack, 'MyTopic', {
                topicName: 'topicName',
                displayName: 'displayName'
            });

            const queue = new Queue(stack, 'MyQueue');
            const func = new InlineJavaScriptLambda(stack, 'MyLambda', {
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
      const stack = new Stack();
      const topic = new Topic(stack, 'Topic');

      // WHEN
      topic.addToResourcePolicy(new PolicyStatement().addResource('*').addActions('sns:*').addPrincipal(new ArnPrincipal('arn')));

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
      const stack = new Stack();
      const topic = new Topic(stack, 'Topic');
      const user = new User(stack, 'User');

      // WHEN
      topic.grantPublish(user);

      // THEN
      expect(stack).to(haveResource('AWS::SNS::TopicPolicy', {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": "sns:Publish",
              "Effect": "Allow",
              "Principal": resolve(user.principal.policyFragment().principalJson),
              "Resource": "*"
            }
          ],
        }
      }));

      expect(stack).to(haveResource('AWS::IAM::Policy', {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": "sns:Publish",
              "Effect": "Allow",
              "Resource": resolve(topic.topicArn)
            }
          ],
        }
      }));

      test.done();
    },

    'topics can be used as event rule targets (and then the topic policy will allow that too)'(test: Test) {
        const stack = new Stack();

        const topic = new Topic(stack, 'MyTopic');

        const rule = new EventRule(stack, 'MyRule', {
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
        const stack = new Stack();

        const topic = new Topic(stack, 'MyTopic');

        topic.addToResourcePolicy(new PolicyStatement().addAction('statement0'));
        topic.addToResourcePolicy(new PolicyStatement().addAction('statement1'));

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
    }
};
