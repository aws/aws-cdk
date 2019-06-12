import { expect, haveResource, MatchStyle, ResourcePart } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import logs = require('@aws-cdk/aws-logs');
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
      runtime: lambda.Runtime.NodeJS810,
    });

    expect(stack).toMatch({ Resources:
      { MyLambdaServiceRole4539ECB6:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: { "Fn::Join": ["", ['lambda.', { Ref: "AWS::URLSuffix" }]] } } } ],
             Version: '2012-10-17' },
          ManagedPolicyArns:
          // arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
           // tslint:disable-next-line:max-line-length
           [{'Fn::Join': ['', ['arn:', {Ref: 'AWS::Partition'}, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']]}],
          }},
        MyLambdaCCE802FB:
         { Type: 'AWS::Lambda::Function',
         Properties:
          { Code: { ZipFile: 'foo' },
          Handler: 'index.handler',
          Role: { 'Fn::GetAtt': [ 'MyLambdaServiceRole4539ECB6', 'Arn' ] },
          Runtime: 'nodejs8.10' },
         DependsOn: [ 'MyLambdaServiceRole4539ECB6' ] } } });
    test.done();
  },

  'adds policy permissions'(test: Test) {
    const stack = new cdk.Stack();
    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810,
      initialPolicy: [new iam.PolicyStatement().addAction("*").addAllResources()]
    });
    expect(stack).toMatch({ Resources:
      { MyLambdaServiceRole4539ECB6:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: { "Fn::Join": ["", ['lambda.', { Ref: "AWS::URLSuffix" }]] } } } ],
             Version: '2012-10-17' },
          ManagedPolicyArns:
          // tslint:disable-next-line:max-line-length
          [{'Fn::Join': ['', ['arn:', {Ref: 'AWS::Partition'}, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']]}],
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
          Runtime: 'nodejs8.10' },
         DependsOn: [ 'MyLambdaServiceRoleDefaultPolicy5BBC6F68', 'MyLambdaServiceRole4539ECB6' ] } } } );
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
        principal: new iam.ServicePrincipal('s3.amazonaws.com'),
        sourceAccount: stack.account,
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
              "Service": { "Fn::Join": ["", ["lambda.", { Ref: "AWS::URLSuffix" }]] }
              }
            }
            ],
            "Version": "2012-10-17"
          },
          "ManagedPolicyArns":
          // tslint:disable-next-line:max-line-length
          [{'Fn::Join': ['', ['arn:', {Ref: 'AWS::Partition'}, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']]}],
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
            "Fn::GetAtt": [
              "MyLambdaCCE802FB",
              "Arn"
            ]
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

      test.throws(() => fn.addPermission('F1', { principal: new iam.ArnPrincipal('just:arn') }),
        /Invalid principal type for Lambda permission statement/);

      fn.addPermission('S1', { principal: new iam.ServicePrincipal('my-service') });
      fn.addPermission('S2', { principal: new iam.AccountPrincipal('account') });

      test.done();
    },

    'BYORole'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const role = new iam.Role(stack, 'SomeRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });
      role.addToPolicy(new iam.PolicyStatement().addAction('confirm:itsthesame'));

      // WHEN
      const fn = new lambda.Function(stack, 'Function', {
        code: new lambda.InlineCode('test'),
        runtime: lambda.Runtime.Python36,
        handler: 'index.test',
        role,
        initialPolicy: [
          new iam.PolicyStatement().addAction('inline:inline')
        ]
      });

      fn.addToRolePolicy(new iam.PolicyStatement().addAction('explicit:explicit'));

      // THEN
      expect(stack).to(haveResource('AWS::IAM::Policy', {
        "PolicyDocument": {
          "Version": "2012-10-17",
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

  'fromFunctionArn'(test: Test) {
    // GIVEN
    const stack2 = new cdk.Stack();

    // WHEN
    const imported = lambda.Function.fromFunctionArn(stack2, 'Imported', 'arn:aws:lambda:us-east-1:123456789012:function:ProcessKinesisRecords');

    // Can call addPermission() but it won't do anything
    imported.addPermission('Hello', {
      principal: new iam.ServicePrincipal('harry')
    });

    // THEN
    test.deepEqual(imported.functionArn, 'arn:aws:lambda:us-east-1:123456789012:function:ProcessKinesisRecords');
    test.deepEqual(imported.functionName, 'ProcessKinesisRecords');
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
      runtime: lambda.Runtime.NodeJS810,
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
            "Runtime": "nodejs8.10",
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
            "MyLambdaServiceRoleDefaultPolicy5BBC6F68",
            "MyLambdaServiceRole4539ECB6"
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
      runtime: lambda.Runtime.NodeJS810,
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
            "Runtime": "nodejs8.10",
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
            "MyLambdaServiceRoleDefaultPolicy5BBC6F68",
            "MyLambdaServiceRole4539ECB6"
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
      runtime: lambda.Runtime.NodeJS810,
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
          "Runtime": "nodejs8.10"
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

    const dlQueue = new sqs.Queue(stack, 'DeadLetterQueue', {
      queueName: 'MyLambda_DLQ',
      retentionPeriodSec: 1209600
    });

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810,
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
            "Runtime": "nodejs8.10",
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
            "MyLambdaServiceRoleDefaultPolicy5BBC6F68",
            "MyLambdaServiceRole4539ECB6"
          ]
          }
        }
        }
    , MatchStyle.SUPERSET);
    test.done();
  },

  'default function with SQS DLQ when client provides Queue to be used as DLQ and deadLetterQueueEnabled set to true'(test: Test) {
    const stack = new cdk.Stack();

    const dlQueue = new sqs.Queue(stack, 'DeadLetterQueue', {
      queueName: 'MyLambda_DLQ',
      retentionPeriodSec: 1209600
    });

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810,
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
          "Runtime": "nodejs8.10",
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
            "MyLambdaServiceRoleDefaultPolicy5BBC6F68",
            "MyLambdaServiceRole4539ECB6",
          ]
        }
        }
      }
    , MatchStyle.SUPERSET);
    test.done();
  },

  'error when default function with SQS DLQ when client provides Queue to be used as DLQ and deadLetterQueueEnabled set to false'(test: Test) {
    const stack = new cdk.Stack();

    const dlQueue = new sqs.Queue(stack, 'DeadLetterQueue', {
      queueName: 'MyLambda_DLQ',
      retentionPeriodSec: 1209600
    });

    test.throws(() => new lambda.Function(stack, 'MyLambda', {
    code: new lambda.InlineCode('foo'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NodeJS810,
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
      runtime: lambda.Runtime.NodeJS810,
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
      "Runtime": "nodejs8.10",
      "TracingConfig": {
      "Mode": "Active"
      }
    },
    "DependsOn": [
      "MyLambdaServiceRoleDefaultPolicy5BBC6F68",
      "MyLambdaServiceRole4539ECB6",
    ]
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'default function with PassThrough tracing'(test: Test) {
    const stack = new cdk.Stack();

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810,
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
      "Runtime": "nodejs8.10",
      "TracingConfig": {
      "Mode": "PassThrough"
      }
    },
    "DependsOn": [
      "MyLambdaServiceRoleDefaultPolicy5BBC6F68",
      "MyLambdaServiceRole4539ECB6",
    ]
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'default function with Disabled tracing'(test: Test) {
    const stack = new cdk.Stack();

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810,
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
      "Runtime": "nodejs8.10"
    },
    "DependsOn": [
      "MyLambdaServiceRole4539ECB6"
    ]
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'grantInvoke adds iam:InvokeFunction'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.AccountPrincipal('1234'),
    });
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.Code.inline('xxx'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810,
    });

    // WHEN
    fn.grantInvoke(role);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: { "Fn::GetAtt": [ "Function76856677", "Arn" ] }
          }
        ]
      }
    }));

    test.done();
  },

  'grantInvoke with a service principal'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.Code.inline('xxx'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810,
    });
    const service = new iam.ServicePrincipal('apigateway.amazonaws.com');

    // WHEN
    fn.grantInvoke(service);

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': [
          'Function76856677',
          'Arn'
        ]
      },
      Principal: 'apigateway.amazonaws.com'
    }));

    test.done();
  },

  'grantInvoke with an account principal'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.Code.inline('xxx'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810,
    });
    const account = new iam.AccountPrincipal('123456789012');

    // WHEN
    fn.grantInvoke(account);

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': [
          'Function76856677',
          'Arn'
        ]
      },
      Principal: '123456789012'
    }));

    test.done();
  },

  'Can use metricErrors on a lambda Function'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.Code.inline('xxx'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810,
    });

    // THEN
    test.deepEqual(stack.resolve(fn.metricErrors()), {
      dimensions: { FunctionName: { Ref: 'Function76856677' }},
      namespace: 'AWS/Lambda',
      metricName: 'Errors',
      periodSec: 300,
      statistic: 'Sum',
    });

    test.done();
  },

  'addEventSource calls bind'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.Code.inline('xxx'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810,
    });

    let bindTarget;

    class EventSourceMock implements lambda.IEventSource {
      public bind(target: lambda.IFunction) {
        bindTarget = target;
      }
    }

    // WHEN
    fn.addEventSource(new EventSourceMock());

    // THEN
    test.same(bindTarget, fn);
    test.done();
  },
  'support inline code for Ruby runtime'(test: Test) {
    const stack = new cdk.Stack();

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.Ruby25,
    });

    expect(stack).toMatch({ Resources:
      { MyLambdaServiceRole4539ECB6:
          { Type: 'AWS::IAM::Role',
          Properties:
          { AssumeRolePolicyDocument:
            { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: { "Fn::Join": ["", ['lambda.', { Ref: "AWS::URLSuffix" }]] } } } ],
              Version: '2012-10-17' },
          ManagedPolicyArns:
          // arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
            // tslint:disable-next-line:max-line-length
            [{'Fn::Join': ['', ['arn:', {Ref: 'AWS::Partition'}, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']]}],
          }},
        MyLambdaCCE802FB:
          { Type: 'AWS::Lambda::Function',
          Properties:
          { Code: { ZipFile: 'foo' },
          Handler: 'index.handler',
          Role: { 'Fn::GetAtt': [ 'MyLambdaServiceRole4539ECB6', 'Arn' ] },
          Runtime: 'ruby2.5' },
          DependsOn: [ 'MyLambdaServiceRole4539ECB6' ] } } });
    test.done();
  },

  'using an incompatible layer'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack');
    const layer = lambda.LayerVersion.fromLayerVersionAttributes(stack, 'TestLayer', {
      layerVersionArn: 'arn:aws:...',
      compatibleRuntimes: [lambda.Runtime.NodeJS810],
    });

    // THEN
    test.throws(() => new lambda.Function(stack, 'Function', {
                  layers: [layer],
                  runtime: lambda.Runtime.NodeJS610,
                  code: lambda.Code.inline('exports.main = function() { console.log("DONE"); }'),
                  handler: 'index.main'
                }),
                /nodejs6.10 is not in \[nodejs8.10\]/);

    test.done();
  },

  'using more than 5 layers'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack');
    const layers = new Array(6).fill(lambda.LayerVersion.fromLayerVersionAttributes(stack, 'TestLayer', {
      layerVersionArn: 'arn:aws:...',
      compatibleRuntimes: [lambda.Runtime.NodeJS810],
    }));

    // THEN
    test.throws(() => new lambda.Function(stack, 'Function', {
                  layers,
                  runtime: lambda.Runtime.NodeJS810,
                  code: lambda.Code.inline('exports.main = function() { console.log("DONE"); }'),
                  handler: 'index.main'
                }),
                /Unable to add layer:/);

    test.done();
  },

  'environment variables are prohibited in China'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, undefined, { env: { region: 'cn-north-1' }});

    // WHEN
    test.throws(() => {
      new lambda.Function(stack, 'MyLambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NodeJS,
        environment: {
          SOME: 'Variable'
        }
      });
    }, /Environment variables are not supported/);

    test.done();
  },

  'environment variables work in an unspecified region'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS,
      environment: {
        SOME: 'Variable'
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          SOME: "Variable"
        }
      }
    }));

    test.done();

  },

  'support reserved concurrent executions'(test: Test) {
    const stack = new cdk.Stack();

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS,
      reservedConcurrentExecutions: 10
    });

    expect(stack).toMatch({ Resources:
      { MyLambdaServiceRole4539ECB6:
          { Type: 'AWS::IAM::Role',
          Properties:
          { AssumeRolePolicyDocument:
            { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: { "Fn::Join": ["", ['lambda.', { Ref: "AWS::URLSuffix" }]] } } } ],
              Version: '2012-10-17' },
          ManagedPolicyArns:
          // arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
            // tslint:disable-next-line:max-line-length
            [{'Fn::Join': ['', ['arn:', {Ref: 'AWS::Partition'}, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']]}],
          }},
        MyLambdaCCE802FB:
          { Type: 'AWS::Lambda::Function',
          Properties:
          { Code: { ZipFile: 'foo' },
          Handler: 'index.handler',
          ReservedConcurrentExecutions: 10,
          Role: { 'Fn::GetAtt': [ 'MyLambdaServiceRole4539ECB6', 'Arn' ] },
          Runtime: 'nodejs' },
          DependsOn: [ 'MyLambdaServiceRole4539ECB6' ] } } });
    test.done();
  },

  'its possible to specify event sources upon creation'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    let bindCount = 0;

    class EventSource implements lambda.IEventSource {
      public bind(_: lambda.FunctionBase): void {
        bindCount++;
      }
    }

    // WHEN
    new lambda.Function(stack, 'fn', {
      code: lambda.Code.inline('boom'),
      runtime: lambda.Runtime.NodeJS810,
      handler: 'index.bam',
      events: [
        new EventSource(),
        new EventSource(),
      ]
    });

    // THEN
    test.deepEqual(bindCount, 2);
    test.done();
  },

  'Provided Runtime returns the right values'(test: Test) {
    const rt = lambda.Runtime.Provided;

    test.equal(rt.name, 'provided');
    test.equal(rt.supportsInlineCode, false);

    test.done();
  },

  'specify log retention'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS,
      logRetentionDays: logs.RetentionDays.OneMonth
    });

    // THEN
    expect(stack).to(haveResource('Custom::LogRetention', {
      'LogGroupName': {
        'Fn::Join': [
          '',
          [
            '/aws/lambda/',
            {
              Ref: 'MyLambdaCCE802FB'
            }
          ]
        ]
      },
      'RetentionInDays': 30
    }));

    test.done();
   }
};

function newTestLambda(scope: cdk.Construct) {
  return new lambda.Function(scope, 'MyLambda', {
    code: new lambda.InlineCode('foo'),
    handler: 'bar',
    runtime: lambda.Runtime.Python27
  });
}
