import { expect, haveResource, MatchStyle, ResourcePart } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import logs = require('@aws-cdk/aws-logs');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/core');
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
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    expect(stack).toMatch({
      Resources:
      {
        MyLambdaServiceRole4539ECB6:
        {
          Type: 'AWS::IAM::Role',
          Properties:
          {
            AssumeRolePolicyDocument:
            {
              Statement:
                [{
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: "lambda.amazonaws.com" }
                }],
              Version: '2012-10-17'
            },
            ManagedPolicyArns:
              // arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
              // tslint:disable-next-line:max-line-length
              [{ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] }],
          }
        },
        MyLambdaCCE802FB:
        {
          Type: 'AWS::Lambda::Function',
          Properties:
          {
            Code: { ZipFile: 'foo' },
            Handler: 'index.handler',
            Role: { 'Fn::GetAtt': ['MyLambdaServiceRole4539ECB6', 'Arn'] },
            Runtime: 'nodejs8.10'
          },
          DependsOn: ['MyLambdaServiceRole4539ECB6']
        }
      }
    });
    test.done();
  },

  'adds policy permissions'(test: Test) {
    const stack = new cdk.Stack();
    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      initialPolicy: [new iam.PolicyStatement({ actions: ["*"], resources: ["*"] })]
    });
    expect(stack).toMatch({
      Resources:
      {
        MyLambdaServiceRole4539ECB6:
        {
          Type: 'AWS::IAM::Role',
          Properties:
          {
            AssumeRolePolicyDocument:
            {
              Statement:
                [{
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: "lambda.amazonaws.com" }
                }],
              Version: '2012-10-17'
            },
            ManagedPolicyArns:
              // tslint:disable-next-line:max-line-length
              [{ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] }],
          }
        },
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
        {
          Type: 'AWS::Lambda::Function',
          Properties:
          {
            Code: { ZipFile: 'foo' },
            Handler: 'index.handler',
            Role: { 'Fn::GetAtt': ['MyLambdaServiceRole4539ECB6', 'Arn'] },
            Runtime: 'nodejs8.10'
          },
          DependsOn: ['MyLambdaServiceRoleDefaultPolicy5BBC6F68', 'MyLambdaServiceRole4539ECB6']
        }
      }
    });
    test.done();

  },

  'fails if inline code is used for an invalid runtime'(test: Test) {
    const stack = new cdk.Stack();
    test.throws(() => new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'bar',
      runtime: lambda.Runtime.DOTNET_CORE_2
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
                      "Service": "lambda.amazonaws.com"
                    }
                  }
                ],
                "Version": "2012-10-17"
              },
              "ManagedPolicyArns":
                // tslint:disable-next-line:max-line-length
                [{ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] }],
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

    'fails if the principal is not a service, account or arn principal'(test: Test) {
      const stack = new cdk.Stack();
      const fn = newTestLambda(stack);

      test.throws(() => fn.addPermission('F1', { principal: new iam.OrganizationPrincipal('org') }),
        /Invalid principal type for Lambda permission statement/);

      fn.addPermission('S1', { principal: new iam.ServicePrincipal('my-service') });
      fn.addPermission('S2', { principal: new iam.AccountPrincipal('account') });
      fn.addPermission('S3', { principal: new iam.ArnPrincipal('my:arn') });

      test.done();
    },

    'BYORole'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const role = new iam.Role(stack, 'SomeRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      });
      role.addToPolicy(new iam.PolicyStatement({ actions: ['confirm:itsthesame'] }));

      // WHEN
      const fn = new lambda.Function(stack, 'Function', {
        code: new lambda.InlineCode('test'),
        runtime: lambda.Runtime.PYTHON_3_6,
        handler: 'index.test',
        role,
        initialPolicy: [
          new iam.PolicyStatement({ actions: ['inline:inline'] })
        ]
      });

      fn.addToRolePolicy(new iam.PolicyStatement({ actions: ['explicit:explicit'] }));

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
      code: lambda.Code.fromAsset(path.join(__dirname, 'my-lambda-handler')),
      handler: 'index.handler',
      runtime: lambda.Runtime.PYTHON_3_6
    });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::Function', {
      "Code": {
        "S3Bucket": {
          "Ref": "AssetParameters9678c34eca93259d11f2d714177347afd66c50116e1e08996eff893d3ca81232S3Bucket1354C645"
        },
        "S3Key": {
          "Fn::Join": ["", [
            { "Fn::Select": [0, { "Fn::Split": ["||", { "Ref": "AssetParameters9678c34eca93259d11f2d714177347afd66c50116e1e08996eff893d3ca81232S3VersionKey5D873FAC" }] }] },
            { "Fn::Select": [1, { "Fn::Split": ["||", { "Ref": "AssetParameters9678c34eca93259d11f2d714177347afd66c50116e1e08996eff893d3ca81232S3VersionKey5D873FAC" }] }] },
          ]]
        }
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
      runtime: lambda.Runtime.NODEJS_10_X,
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
      runtime: lambda.Runtime.NODEJS_10_X,
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
      runtime: lambda.Runtime.NODEJS_10_X,
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
      retentionPeriod: cdk.Duration.days(14)
    });

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
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
      retentionPeriod: cdk.Duration.days(14)
    });

    new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
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
      retentionPeriod: cdk.Duration.days(14),
    });

    test.throws(() => new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
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
      runtime: lambda.Runtime.NODEJS_10_X,
      tracing: lambda.Tracing.ACTIVE
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
      runtime: lambda.Runtime.NODEJS_10_X,
      tracing: lambda.Tracing.PASS_THROUGH
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
      runtime: lambda.Runtime.NODEJS_10_X,
      tracing: lambda.Tracing.DISABLED
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
      code: lambda.Code.fromInline('xxx'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
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
            Resource: { "Fn::GetAtt": ["Function76856677", "Arn"] }
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
      code: lambda.Code.fromInline('xxx'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
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
      code: lambda.Code.fromInline('xxx'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
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

  'grantInvoke with an arn principal'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.Code.fromInline('xxx'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });
    const account = new iam.ArnPrincipal('arn:aws:iam::123456789012:role/someRole');

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
      Principal: 'arn:aws:iam::123456789012:role/someRole'
    }));

    test.done();
  },

  'Can use metricErrors on a lambda Function'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.Code.fromInline('xxx'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // THEN
    test.deepEqual(stack.resolve(fn.metricErrors()), {
      dimensions: { FunctionName: { Ref: 'Function76856677' } },
      namespace: 'AWS/Lambda',
      metricName: 'Errors',
      period: cdk.Duration.minutes(5),
      statistic: 'Sum',
    });

    test.done();
  },

  'addEventSource calls bind'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.Code.fromInline('xxx'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
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
      runtime: lambda.Runtime.RUBY_2_5,
    });

    expect(stack).toMatch({
      Resources:
      {
        MyLambdaServiceRole4539ECB6:
        {
          Type: 'AWS::IAM::Role',
          Properties:
          {
            AssumeRolePolicyDocument:
            {
              Statement:
                [{
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: "lambda.amazonaws.com" }
                }],
              Version: '2012-10-17'
            },
            ManagedPolicyArns:
              // arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
              // tslint:disable-next-line:max-line-length
              [{ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] }],
          }
        },
        MyLambdaCCE802FB:
        {
          Type: 'AWS::Lambda::Function',
          Properties:
          {
            Code: { ZipFile: 'foo' },
            Handler: 'index.handler',
            Role: { 'Fn::GetAtt': ['MyLambdaServiceRole4539ECB6', 'Arn'] },
            Runtime: 'ruby2.5'
          },
          DependsOn: ['MyLambdaServiceRole4539ECB6']
        }
      }
    });
    test.done();
  },

  'using an incompatible layer'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack');
    const layer = lambda.LayerVersion.fromLayerVersionAttributes(stack, 'TestLayer', {
      layerVersionArn: 'arn:aws:...',
      compatibleRuntimes: [lambda.Runtime.NODEJS_10_X],
    });

    // THEN
    test.throws(() => new lambda.Function(stack, 'Function', {
      layers: [layer],
      runtime: lambda.Runtime.NODEJS_6_10,
      code: lambda.Code.fromInline('exports.main = function() { console.log("DONE"); }'),
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
      compatibleRuntimes: [lambda.Runtime.NODEJS_10_X],
    }));

    // THEN
    test.throws(() => new lambda.Function(stack, 'Function', {
      layers,
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('exports.main = function() { console.log("DONE"); }'),
      handler: 'index.main'
    }),
      /Unable to add layer:/);

    test.done();
  },

  'environment variables are prohibited in China'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, undefined, { env: { region: 'cn-north-1' } });

    // WHEN
    test.throws(() => {
      new lambda.Function(stack, 'MyLambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS,
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
      runtime: lambda.Runtime.NODEJS,
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
      runtime: lambda.Runtime.NODEJS,
      reservedConcurrentExecutions: 10
    });

    expect(stack).toMatch({
      Resources:
      {
        MyLambdaServiceRole4539ECB6:
        {
          Type: 'AWS::IAM::Role',
          Properties:
          {
            AssumeRolePolicyDocument:
            {
              Statement:
                [{
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: "lambda.amazonaws.com" }
                }],
              Version: '2012-10-17'
            },
            ManagedPolicyArns:
              // arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
              // tslint:disable-next-line:max-line-length
              [{ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] }],
          }
        },
        MyLambdaCCE802FB:
        {
          Type: 'AWS::Lambda::Function',
          Properties:
          {
            Code: { ZipFile: 'foo' },
            Handler: 'index.handler',
            ReservedConcurrentExecutions: 10,
            Role: { 'Fn::GetAtt': ['MyLambdaServiceRole4539ECB6', 'Arn'] },
            Runtime: 'nodejs'
          },
          DependsOn: ['MyLambdaServiceRole4539ECB6']
        }
      }
    });
    test.done();
  },

  'its possible to specify event sources upon creation'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    let bindCount = 0;

    class EventSource implements lambda.IEventSource {
      public bind(_: lambda.IFunction): void {
        bindCount++;
      }
    }

    // WHEN
    new lambda.Function(stack, 'fn', {
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_10_X,
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
    const rt = lambda.Runtime.PROVIDED;

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
      runtime: lambda.Runtime.NODEJS,
      logRetention: logs.RetentionDays.ONE_MONTH
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
  },

  'imported lambda with imported security group and allowAllOutbound set to false'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const fn = lambda.Function.fromFunctionAttributes(stack, 'fn', {
      functionArn: 'arn:aws:lambda:us-east-1:123456789012:function:my-function',
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
        allowAllOutbound: false,
      }),
    });

    // WHEN
    fn.connections.allowToAnyIpv4(ec2.Port.tcp(443));

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroupEgress', {
      GroupId: 'sg-123456789',
    }));

    test.done();
  }
};

function newTestLambda(scope: cdk.Construct) {
  return new lambda.Function(scope, 'MyLambda', {
    code: new lambda.InlineCode('foo'),
    handler: 'bar',
    runtime: lambda.Runtime.PYTHON_2_7
  });
}
