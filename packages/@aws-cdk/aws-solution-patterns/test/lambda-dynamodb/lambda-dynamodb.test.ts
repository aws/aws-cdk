import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require("@aws-cdk/core");
import path = require('path');
import { LambdaToDynamoDB, LambdaToDynamoDBProps } from "../../lib";

function deployNewFunc(stack: cdk.Stack) {
  const props: LambdaToDynamoDBProps = {
    deployLambda: true,
    lambdaFunctionProps: {
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/handler.zip')),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler'
    },
  };
  return new LambdaToDynamoDB(stack, 'test-lambda-dynamodb-stack', props);
}

function useExistingFunc(stack: cdk.Stack) {
  const lambdaFunctionProps: lambda.FunctionProps = {
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambda/handler.zip')),
    runtime: lambda.Runtime.NODEJS_10_X,
    handler: 'index.handler'
  };

  const props: LambdaToDynamoDBProps = {
    deployLambda: false,
    existingLambdaObj: new lambda.Function(stack, 'MyExistingFunction', lambdaFunctionProps),
    dynamoTableProps: {
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 3,
      writeCapacity: 3,
      partitionKey: {
          name: 'id',
          type: dynamodb.AttributeType.STRING
      }
    },
  };

  return new LambdaToDynamoDB(stack, 'test-lambda-dynamodb-stack', props);
}

test('snapshot test LambdaToDynamoDB default params', () => {
  const stack = new cdk.Stack();
  deployNewFunc(stack);
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test('check lambda function properties for deploy: true', () => {
  const stack = new cdk.Stack();

  deployNewFunc(stack);

  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Handler: "index.handler",
    Role: {
      "Fn::GetAtt": [
        "testlambdadynamodbstackLambdaFunctionServiceRole226532E1",
        "Arn"
      ]
    },
    Runtime: "nodejs10.x",
    Environment: {
      Variables: {
        LOGLEVEL: "INFO",
        DDB_TABLE_NAME: {
        Ref: "testlambdadynamodbstackDynamoTable8138E93B"
        }
      }
    }
  });
});
test('check dynamo table properties for deploy: true', () => {
  const stack = new cdk.Stack();

  deployNewFunc(stack);

  expect(stack).toHaveResource('AWS::DynamoDB::Table', {
    KeySchema: [
      {
        AttributeName: "id",
        KeyType: "HASH"
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S"
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  });
});
test('check iot lambda function role for deploy: true', () => {
  const stack = new cdk.Stack();

  deployNewFunc(stack);

  expect(stack).toHaveResource('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: "sts:AssumeRole",
          Effect: "Allow",
          Principal: {
            Service: "lambda.amazonaws.com"
          }
        }
      ],
      Version: "2012-10-17"
    },
    ManagedPolicyArns: [
      {
        "Fn::Join": [
          "",
          [
            "arn:",
            {
              Ref: "AWS::Partition"
            },
            ":iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
          ]
        ]
      }
    ]
  });
});
test('check lambda function policy for deploy: true', () => {
  const stack = new cdk.Stack();

  deployNewFunc(stack);

  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            "dynamodb:BatchGetItem",
            "dynamodb:GetRecords",
            "dynamodb:GetShardIterator",
            "dynamodb:Query",
            "dynamodb:GetItem",
            "dynamodb:Scan",
            "dynamodb:BatchWriteItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem"
          ],
          Effect: "Allow",
          Resource: [
            {
              "Fn::GetAtt": [
                "testlambdadynamodbstackDynamoTable8138E93B",
                "Arn"
              ]
            },
            {
              Ref: "AWS::NoValue"
            }
          ]
        }
      ],
      Version: "2012-10-17"
    }
  });
});
test('check lambda function properties for deploy: false', () => {
  const stack = new cdk.Stack();

  useExistingFunc(stack);

  expect(stack).toHaveResource('AWS::Lambda::Function', {
      Handler: "index.handler",
      Role: {
        "Fn::GetAtt": [
          "MyExistingFunctionServiceRoleF9E14BFD",
          "Arn"
        ]
      },
      Runtime: "nodejs10.x"
  });
});
test('check iot lambda function role for deploy: false', () => {
  const stack = new cdk.Stack();

  useExistingFunc(stack);

  expect(stack).toHaveResource('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: "sts:AssumeRole",
          Effect: "Allow",
          Principal: {
            Service: "lambda.amazonaws.com"
          }
        }
      ],
      Version: "2012-10-17"
    },
    ManagedPolicyArns: [
      {
        "Fn::Join": [
          "",
          [
            "arn:",
            {
              Ref: "AWS::Partition"
            },
            ":iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
          ]
        ]
      }
    ]
  });
});
test('check getter methods', () => {
  const stack = new cdk.Stack();

  const construct: LambdaToDynamoDB = deployNewFunc(stack);

  expect(construct.lambdaFunction()).toBeInstanceOf(lambda.Function);
  expect(construct.dynamoTable()).toBeInstanceOf(dynamodb.Table);
});
test('check exception for Missing existingObj from props for deploy = false', () => {
  const stack = new cdk.Stack();

  const props: LambdaToDynamoDBProps = {
    deployLambda: false
  };

  try {
    new LambdaToDynamoDB(stack, 'test-iot-lambda-integration', props);
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
  }
});
test('check exception for Missing lambdaFunctionProps from props for deploy = true', () => {
  const stack = new cdk.Stack();

  const props: LambdaToDynamoDBProps = {
    deployLambda: true
  };

  try {
    new LambdaToDynamoDB(stack, 'test-iot-lambda-integration', props);
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
  }
});
