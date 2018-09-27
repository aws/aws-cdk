import { countResources, expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import path = require('path');
import lambda = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'default function'(test: Test) {
    const stack = new cdk.Stack();

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS610,
    });

    expect(stack).toMatch({ Resources:
      { MyLambdaServiceRole4539ECB6:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'lambda.amazonaws.com' } } ],
             Version: '2012-10-17' },
          ManagedPolicyArns:
          // arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
           // tslint:disable-next-line:max-line-length
           [{'Fn::Join': ['', ['arn', ':', {Ref: 'AWS::Partition'}, ':', 'iam', ':', '', ':', 'aws', ':', 'policy', '/', 'service-role/AWSLambdaBasicExecutionRole']]}],
          }},
        MyLambdaCCE802FB:
         { Type: 'AWS::Lambda::Function',
         Properties:
          { Code: { ZipFile: 'foo' },
          Handler: 'index.handler',
          Role: { 'Fn::GetAtt': [ 'MyLambdaServiceRole4539ECB6', 'Arn' ] },
          Runtime: 'nodejs6.10' },
         DependsOn: [ 'MyLambdaServiceRole4539ECB6' ] } } });
    test.done();
  },

  'adds policy permissions'(test: Test) {
    const stack = new cdk.Stack();
    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS610,
      initialPolicy: [new cdk.PolicyStatement().addAction("*").addAllResources()]
    });
    expect(stack).toMatch({ Resources:
      { MyLambdaServiceRole4539ECB6:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'lambda.amazonaws.com' } } ],
             Version: '2012-10-17' },
          ManagedPolicyArns:
          // tslint:disable-next-line:max-line-length
          [{'Fn::Join': ['', ['arn', ':', {Ref: 'AWS::Partition'}, ':', 'iam', ':', '', ':', 'aws', ':', 'policy', '/', 'service-role/AWSLambdaBasicExecutionRole']]}],
        }},
        MyLambdaServiceRoleDefaultPolicy5BBC6F68: {
          Type: "AWS::IAM::Policy",
          Properties: {
            PolicyDocument: {
            Statement: [
              {
              Action: "*",
              Effect: "Allow",
              Resource: "*"
              }
            ],
            Version: "2012-10-17"
            },
            PolicyName: "MyLambdaServiceRoleDefaultPolicy5BBC6F68",
            Roles: [
            {
              Ref: "MyLambdaServiceRole4539ECB6"
            }
            ]
          }
        },
        MyLambdaCCE802FB:
         { Type: 'AWS::Lambda::Function',
         Properties:
          { Code: { ZipFile: 'foo' },
          Handler: 'index.handler',
          Role: { 'Fn::GetAtt': [ 'MyLambdaServiceRole4539ECB6', 'Arn' ] },
          Runtime: 'nodejs6.10' },
         DependsOn: [ 'MyLambdaServiceRole4539ECB6', 'MyLambdaServiceRoleDefaultPolicy5BBC6F68' ] } } } );
    test.done();

  },

  'fails if inline code is used for an invalid runtime'(test: Test) {
    const stack = new cdk.Stack();
    test.throws(() => new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'bar',
      runtime: lambda.Runtime.DotNetCore2
    }));
    test.done();
  },

  'addToResourcePolicy': {
    'can be used to add permissions to the Lambda function'(test: Test) {
      const stack = new cdk.Stack();
      const fn = newTestLambda(stack);

      fn.addPermission('S3Permission', {
        action: 'lambda:*',
        principal: new cdk.ServicePrincipal('s3.amazonaws.com'),
        sourceAccount: new cdk.AwsAccountId().toString(),
        sourceArn: 'arn:aws:s3:::my_bucket'
      });

      expect(stack).toMatch({
        "Resources": {
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
          "ManagedPolicyArns":
          // tslint:disable-next-line:max-line-length
          [{'Fn::Join': ['', ['arn', ':', {Ref: 'AWS::Partition'}, ':', 'iam', ':', '', ':', 'aws', ':', 'policy', '/', 'service-role/AWSLambdaBasicExecutionRole']]}],
          }
        },
        "MyLambdaCCE802FB": {
          "Type": "AWS::Lambda::Function",
          "Properties": {
          "Code": {
            "ZipFile": "foo"
          },
          "Handler": "bar",
          "Role": {
            "Fn::GetAtt": [
            "MyLambdaServiceRole4539ECB6",
            "Arn"
            ]
          },
          "Runtime": "python2.7"
          },
          "DependsOn": [
          "MyLambdaServiceRole4539ECB6"
          ]
        },
        "MyLambdaS3Permission99D0EA08": {
          "Type": "AWS::Lambda::Permission",
          "Properties": {
          "Action": "lambda:*",
          "FunctionName": {
            "Ref": "MyLambdaCCE802FB"
          },
          "Principal": "s3.amazonaws.com",
          "SourceAccount": {
            "Ref": "AWS::AccountId"
          },
          "SourceArn": "arn:aws:s3:::my_bucket"
          }
        }
        }
      });

      test.done();
    },

    'fails if the principal is not a service or account principals'(test: Test) {
      const stack = new cdk.Stack();
      const fn = newTestLambda(stack);

      test.throws(() => fn.addPermission('F1', { principal: new cdk.ArnPrincipal('just:arn') }),
        /Invalid principal type for Lambda permission statement/);

      fn.addPermission('S1', { principal: new cdk.ServicePrincipal('my-service') });
      fn.addPermission('S2', { principal: new cdk.AccountPrincipal('account') });

      test.done();
    },

    'BYORole'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const role = new iam.Role(stack, 'SomeRole', {
        assumedBy: new cdk.ServicePrincipal('lambda.amazonaws.com'),
      });
      role.addToPolicy(new cdk.PolicyStatement().addAction('confirm:itsthesame'));

      // WHEN
      const fn = new lambda.Function(stack, 'Function', {
        code: new lambda.InlineCode('test'),
        runtime: lambda.Runtime.Python36,
        handler: 'index.test',
        role,
        initialPolicy: [
          new cdk.PolicyStatement().addAction('inline:inline')
        ]
      });

      fn.addToRolePolicy(new cdk.PolicyStatement().addAction('explicit:explicit'));

      // THEN
      expect(stack).to(haveResource('AWS::IAM::Policy', {
        "PolicyDocument": {
        "Statement": [
          { "Action": "confirm:itsthesame", "Effect": "Allow" },
          { "Action": "inline:inline", "Effect": "Allow" },
          { "Action": "explicit:explicit", "Effect": "Allow" }
        ],
        },
      }));

      test.done();
    }
  },

  'import/export': {
    'lambda.export() can be used to add Outputs to the stack and returns a LambdaRef object'(test: Test) {
      // GIVEN
      const stack1 = new cdk.Stack();
      const stack2 = new cdk.Stack();
      const fn = newTestLambda(stack1);

      // WHEN
      const props = fn.export();
      const imported = lambda.FunctionRef.import(stack2, 'Imported', props);

      // Can call addPermission() but it won't do anything
      imported.addPermission('Hello', {
        principal: new cdk.ServicePrincipal('harry')
      });

      test.done();
    },
  },

  'Lambda can serve as EventRule target, permission gets added'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = newTestLambda(stack);
    const rule1 = new events.EventRule(stack, 'Rule', { scheduleExpression: 'rate(1 minute)' });
    const rule2 = new events.EventRule(stack, 'Rule2', { scheduleExpression: 'rate(5 minutes)' });

    // WHEN
    rule1.addTarget(fn);
    rule2.addTarget(fn);

    // THEN
    const lambdaId = "MyLambdaCCE802FB";

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      "Action": "lambda:InvokeFunction",
      "FunctionName": { "Ref": lambdaId },
      "Principal": "events.amazonaws.com",
      "SourceArn": { "Fn::GetAtt": [ "Rule4C995B7F", "Arn" ] }
    }));

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      "Action": "lambda:InvokeFunction",
      "FunctionName": { "Ref": "MyLambdaCCE802FB" },
      "Principal": "events.amazonaws.com",
      "SourceArn": { "Fn::GetAtt": [ "Rule270732244", "Arn" ] }
    }));

    expect(stack).to(countResources('AWS::Events::Rule', 2));
    expect(stack).to(haveResource('AWS::Events::Rule', {
      "Targets": [
        {
        "Arn": { "Fn::GetAtt": [ lambdaId, "Arn" ] },
        "Id": "MyLambda"
        }
      ]
    }));

    test.done();
  },

  'Lambda code can be read from a local directory via an asset'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    new lambda.Function(stack, 'MyLambda', {
      code: lambda.Code.directory(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      runtime: lambda.Runtime.Python36
    });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::Function', {
      "Code": {
        "S3Bucket": {
        "Ref": "MyLambdaCodeS3BucketC82A5870"
        },
        "S3Key": { "Fn::Join": [ "", [
        {"Fn::Select": [0, {"Fn::Split": ["||", {"Ref": "MyLambdaCodeS3VersionKey47762537"}]}]},
        {"Fn::Select": [1, {"Fn::Split": ["||", {"Ref": "MyLambdaCodeS3VersionKey47762537"}]}]},
        ]]}
      },
      "Handler": "index.handler",
      "Role": {
        "Fn::GetAtt": [
        "MyLambdaServiceRole4539ECB6",
        "Arn"
        ]
      },
      "Runtime": "python3.6"
    }));

    test.done();
  },

  'default function with SQS DLQ when client sets deadLetterQueueEnabled to true and functionName defined by client'(test: Test) {
    const stack = new cdk.Stack();

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS610,
      functionName: 'OneFunctionToRuleThemAll',
      deadLetterQueueEnabled: true
    });

    expect(stack).toMatch(
      {
        "Resources": {
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
            {
              "Fn::Join": [
              "",
              [
                "arn",
                ":",
                {
                "Ref": "AWS::Partition"
                },
                ":",
                "iam",
                ":",
                "",
                ":",
                "aws",
                ":",
                "policy",
                "/",
                "service-role/AWSLambdaBasicExecutionRole"
              ]
              ]
            }
            ]
          }
          },
          "MyLambdaServiceRoleDefaultPolicy5BBC6F68": {
          "Type": "AWS::IAM::Policy",
          "Properties": {
            "PolicyDocument": {
            "Statement": [
              {
              "Action": "sqs:SendMessage",
              "Effect": "Allow",
              "Resource": {
                "Fn::GetAtt": [
                "MyLambdaDeadLetterQueue399EEA2D",
                "Arn"
                ]
              }
              }
            ],
            "Version": "2012-10-17"
            },
            "PolicyName": "MyLambdaServiceRoleDefaultPolicy5BBC6F68",
            "Roles": [
            {
              "Ref": "MyLambdaServiceRole4539ECB6"
            }
            ]
          }
          },
          "MyLambdaDeadLetterQueue399EEA2D": {
          "Type": "AWS::SQS::Queue",
          "Properties": {
            "MessageRetentionPeriod": 1209600
          }
          },
          "MyLambdaCCE802FB": {
          "Type": "AWS::Lambda::Function",
          "Properties": {
            "Code": {
            "ZipFile": "foo"
            },
            "Handler": "index.handler",
            "Role": {
            "Fn::GetAtt": [
              "MyLambdaServiceRole4539ECB6",
              "Arn"
            ]
            },
            "Runtime": "nodejs6.10",
            "DeadLetterConfig": {
            "TargetArn": {
              "Fn::GetAtt": [
              "MyLambdaDeadLetterQueue399EEA2D",
              "Arn"
              ]
            }
            },
            "FunctionName": "OneFunctionToRuleThemAll"
          },
          "DependsOn": [
            "MyLambdaServiceRole4539ECB6",
            "MyLambdaServiceRoleDefaultPolicy5BBC6F68"
          ]
          }
        }
        }
    );
    test.done();
  },

  'default function with SQS DLQ when client sets deadLetterQueueEnabled to true and functionName not defined by client'(test: Test) {
    const stack = new cdk.Stack();

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS610,
      deadLetterQueueEnabled: true,
    });

    expect(stack).toMatch(
      {
        "Resources": {
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
            {
              "Fn::Join": [
              "",
              [
                "arn",
                ":",
                {
                "Ref": "AWS::Partition"
                },
                ":",
                "iam",
                ":",
                "",
                ":",
                "aws",
                ":",
                "policy",
                "/",
                "service-role/AWSLambdaBasicExecutionRole"
              ]
              ]
            }
            ]
          }
          },
          "MyLambdaServiceRoleDefaultPolicy5BBC6F68": {
          "Type": "AWS::IAM::Policy",
          "Properties": {
            "PolicyDocument": {
            "Statement": [
              {
              "Action": "sqs:SendMessage",
              "Effect": "Allow",
              "Resource": {
                "Fn::GetAtt": [
                "MyLambdaDeadLetterQueue399EEA2D",
                "Arn"
                ]
              }
              }
            ],
            "Version": "2012-10-17"
            },
            "PolicyName": "MyLambdaServiceRoleDefaultPolicy5BBC6F68",
            "Roles": [
            {
              "Ref": "MyLambdaServiceRole4539ECB6"
            }
            ]
          }
          },
          "MyLambdaDeadLetterQueue399EEA2D": {
          "Type": "AWS::SQS::Queue",
          "Properties": {
            "MessageRetentionPeriod": 1209600
          }
          },
          "MyLambdaCCE802FB": {
          "Type": "AWS::Lambda::Function",
          "Properties": {
            "Code": {
            "ZipFile": "foo"
            },
            "Handler": "index.handler",
            "Role": {
            "Fn::GetAtt": [
              "MyLambdaServiceRole4539ECB6",
              "Arn"
            ]
            },
            "Runtime": "nodejs6.10",
            "DeadLetterConfig": {
            "TargetArn": {
              "Fn::GetAtt": [
              "MyLambdaDeadLetterQueue399EEA2D",
              "Arn"
              ]
            }
            }
          },
          "DependsOn": [
            "MyLambdaServiceRole4539ECB6",
            "MyLambdaServiceRoleDefaultPolicy5BBC6F68"
          ]
          }
        }
        }
    );
    test.done();
  },

  'default function with SQS DLQ when client sets deadLetterQueueEnabled to false'(test: Test) {
    const stack = new cdk.Stack();

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS610,
      deadLetterQueueEnabled: false,
    });

    expect(stack).toMatch(
      {
        "Resources": {
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
            {
            "Fn::Join": [
              "",
              [
              "arn",
              ":",
              {
                "Ref": "AWS::Partition"
              },
              ":",
              "iam",
              ":",
              "",
              ":",
              "aws",
              ":",
              "policy",
              "/",
              "service-role/AWSLambdaBasicExecutionRole"
              ]
            ]
            }
          ]
          }
        },
        "MyLambdaCCE802FB": {
          "Type": "AWS::Lambda::Function",
          "Properties": {
          "Code": {
            "ZipFile": "foo"
          },
          "Handler": "index.handler",
          "Role": {
            "Fn::GetAtt": [
            "MyLambdaServiceRole4539ECB6",
            "Arn"
            ]
          },
          "Runtime": "nodejs6.10"
          },
          "DependsOn": [
          "MyLambdaServiceRole4539ECB6"
          ]
        }
        }
      }
    );
    test.done();
  },

  'default function with SQS DLQ when client provides Queue to be used as DLQ'(test: Test) {
    const stack = new cdk.Stack();

    const dlqStack = new cdk.Stack();

    const dlQueue = new sqs.Queue(dlqStack, 'DeadLetterQueue', {
      queueName: 'MyLambda_DLQ',
      retentionPeriodSec: 1209600
    });

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS610,
      deadLetterQueue: dlQueue,
    });

    expect(stack).toMatch(
      {
        "Resources": {
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
            {
              "Fn::Join": [
              "",
              [
                "arn",
                ":",
                {
                "Ref": "AWS::Partition"
                },
                ":",
                "iam",
                ":",
                "",
                ":",
                "aws",
                ":",
                "policy",
                "/",
                "service-role/AWSLambdaBasicExecutionRole"
              ]
              ]
            }
            ]
          }
          },
          "MyLambdaServiceRoleDefaultPolicy5BBC6F68": {
          "Type": "AWS::IAM::Policy",
          "Properties": {
            "PolicyDocument": {
            "Statement": [
              {
              "Action": "sqs:SendMessage",
              "Effect": "Allow",
              "Resource": {
                "Fn::GetAtt": [
                "DeadLetterQueue9F481546",
                "Arn"
                ]
              }
              }
            ],
            "Version": "2012-10-17"
            },
            "PolicyName": "MyLambdaServiceRoleDefaultPolicy5BBC6F68",
            "Roles": [
            {
              "Ref": "MyLambdaServiceRole4539ECB6"
            }
            ]
          }
          },
          "MyLambdaCCE802FB": {
          "Type": "AWS::Lambda::Function",
          "Properties": {
            "Code": {
            "ZipFile": "foo"
            },
            "Handler": "index.handler",
            "Role": {
            "Fn::GetAtt": [
              "MyLambdaServiceRole4539ECB6",
              "Arn"
            ]
            },
            "Runtime": "nodejs6.10",
            "DeadLetterConfig": {
            "TargetArn": {
              "Fn::GetAtt": [
              "DeadLetterQueue9F481546",
              "Arn"
              ]
            }
            }
          },
          "DependsOn": [
            "MyLambdaServiceRole4539ECB6",
            "MyLambdaServiceRoleDefaultPolicy5BBC6F68"
          ]
          }
        }
        }
    );
    test.done();
  },

  'default function with SQS DLQ when client provides Queue to be used as DLQ and deadLetterQueueEnabled set to true'(test: Test) {
    const stack = new cdk.Stack();

    const dlqStack = new cdk.Stack();

    const dlQueue = new sqs.Queue(dlqStack, 'DeadLetterQueue', {
      queueName: 'MyLambda_DLQ',
      retentionPeriodSec: 1209600
    });

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS610,
      deadLetterQueueEnabled: true,
      deadLetterQueue: dlQueue,
    });

    expect(stack).toMatch(
      {
        "Resources": {
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
            {
            "Fn::Join": [
              "",
              [
              "arn",
              ":",
              {
                "Ref": "AWS::Partition"
              },
              ":",
              "iam",
              ":",
              "",
              ":",
              "aws",
              ":",
              "policy",
              "/",
              "service-role/AWSLambdaBasicExecutionRole"
              ]
            ]
            }
          ]
          }
        },
        "MyLambdaServiceRoleDefaultPolicy5BBC6F68": {
          "Type": "AWS::IAM::Policy",
          "Properties": {
          "PolicyDocument": {
            "Statement": [
            {
              "Action": "sqs:SendMessage",
              "Effect": "Allow",
              "Resource": {
              "Fn::GetAtt": [
                "DeadLetterQueue9F481546",
                "Arn"
              ]
              }
            }
            ],
            "Version": "2012-10-17"
          },
          "PolicyName": "MyLambdaServiceRoleDefaultPolicy5BBC6F68",
          "Roles": [
            {
            "Ref": "MyLambdaServiceRole4539ECB6"
            }
          ]
          }
        },
        "MyLambdaCCE802FB": {
          "Type": "AWS::Lambda::Function",
          "Properties": {
          "Code": {
            "ZipFile": "foo"
          },
          "Handler": "index.handler",
          "Role": {
            "Fn::GetAtt": [
            "MyLambdaServiceRole4539ECB6",
            "Arn"
            ]
          },
          "Runtime": "nodejs6.10",
          "DeadLetterConfig": {
            "TargetArn": {
            "Fn::GetAtt": [
              "DeadLetterQueue9F481546",
              "Arn"
            ]
            }
          }
          },
          "DependsOn": [
          "MyLambdaServiceRole4539ECB6",
          "MyLambdaServiceRoleDefaultPolicy5BBC6F68"
          ]
        }
        }
      }
    );
    test.done();
  },

  'error when default function with SQS DLQ when client provides Queue to be used as DLQ and deadLetterQueueEnabled set to false'(test: Test) {
    const stack = new cdk.Stack();

    const dlqStack = new cdk.Stack();

    const dlQueue = new sqs.Queue(dlqStack, 'DeadLetterQueue', {
      queueName: 'MyLambda_DLQ',
      retentionPeriodSec: 1209600
    });

    test.throws(() => new lambda.Function(stack, 'MyLambda', {
    code: new lambda.InlineCode('foo'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NodeJS610,
    deadLetterQueueEnabled: false,
    deadLetterQueue: dlQueue,
    }), /deadLetterQueue defined but deadLetterQueueEnabled explicitly set to false/);

    test.done();
  },

  'default function with Active tracing'(test: Test) {
    const stack = new cdk.Stack();

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS610,
      tracing: lambda.Tracing.Active
    });

    expect(stack).to(haveResource('AWS::IAM::Policy', {
    "PolicyDocument": {
      "Statement": [
      {
        "Action": [
        "xray:PutTraceSegments",
        "xray:PutTelemetryRecords"
        ],
        "Effect": "Allow",
        "Resource": "*"
      }
      ],
      "Version": "2012-10-17"
    },
    "PolicyName": "MyLambdaServiceRoleDefaultPolicy5BBC6F68",
    "Roles": [
      {
      "Ref": "MyLambdaServiceRole4539ECB6"
      }
    ]
    }));

    expect(stack).to(haveResource('AWS::Lambda::Function', {
    "Properties": {
      "Code": {
      "ZipFile": "foo"
      },
      "Handler": "index.handler",
      "Role": {
      "Fn::GetAtt": [
        "MyLambdaServiceRole4539ECB6",
        "Arn"
      ]
      },
      "Runtime": "nodejs6.10",
      "TracingConfig": {
      "Mode": "Active"
      }
    },
    "DependsOn": [
      "MyLambdaServiceRole4539ECB6",
      "MyLambdaServiceRoleDefaultPolicy5BBC6F68"
    ]
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'default function with PassThrough tracing'(test: Test) {
    const stack = new cdk.Stack();

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS610,
      tracing: lambda.Tracing.PassThrough
    });

    expect(stack).to(haveResource('AWS::IAM::Policy', {
    "PolicyDocument": {
      "Statement": [
      {
        "Action": [
        "xray:PutTraceSegments",
        "xray:PutTelemetryRecords"
        ],
        "Effect": "Allow",
        "Resource": "*"
      }
      ],
      "Version": "2012-10-17"
    },
    "PolicyName": "MyLambdaServiceRoleDefaultPolicy5BBC6F68",
    "Roles": [
      {
      "Ref": "MyLambdaServiceRole4539ECB6"
      }
    ]
    }));

    expect(stack).to(haveResource('AWS::Lambda::Function', {
    "Properties": {
      "Code": {
      "ZipFile": "foo"
      },
      "Handler": "index.handler",
      "Role": {
      "Fn::GetAtt": [
        "MyLambdaServiceRole4539ECB6",
        "Arn"
      ]
      },
      "Runtime": "nodejs6.10",
      "TracingConfig": {
      "Mode": "PassThrough"
      }
    },
    "DependsOn": [
      "MyLambdaServiceRole4539ECB6",
      "MyLambdaServiceRoleDefaultPolicy5BBC6F68"
    ]
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'default function with Disabled tracing'(test: Test) {
    const stack = new cdk.Stack();

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS610,
      tracing: lambda.Tracing.Disabled
    });

    expect(stack).notTo(haveResource('AWS::IAM::Policy', {
    "PolicyDocument": {
      "Statement": [
      {
        "Action": [
        "xray:PutTraceSegments",
        "xray:PutTelemetryRecords"
        ],
        "Effect": "Allow",
        "Resource": "*"
      }
      ],
      "Version": "2012-10-17"
    },
    "PolicyName": "MyLambdaServiceRoleDefaultPolicy5BBC6F68",
    "Roles": [
      {
      "Ref": "MyLambdaServiceRole4539ECB6"
      }
    ]
    }));

    expect(stack).to(haveResource('AWS::Lambda::Function', {
    "Properties": {
      "Code": {
      "ZipFile": "foo"
      },
      "Handler": "index.handler",
      "Role": {
      "Fn::GetAtt": [
        "MyLambdaServiceRole4539ECB6",
        "Arn"
      ]
      },
      "Runtime": "nodejs6.10"
    },
    "DependsOn": [
      "MyLambdaServiceRole4539ECB6"
    ]
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

};

function newTestLambda(parent: cdk.Construct) {
  return new lambda.Function(parent, 'MyLambda', {
    code: new lambda.InlineCode('foo'),
    handler: 'bar',
    runtime: lambda.Runtime.Python27
  });
}
