import { expect } from '@aws-cdk/assert';
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { CustomResource } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
  'custom resource is added twice, lambda is added once'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new TestCustomResource(stack, 'Custom1');
    new TestCustomResource(stack, 'Custom2');

    // THEN
    expect(stack).toMatch({
      "Resources": {
        "SingletonLambdaTestCustomResourceProviderServiceRole81FEAB5C": {
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
            { "Fn::Join": [ "", [
              "arn", ":", { "Ref": "AWS::Partition" }, ":", "iam", ":", "", ":", "aws", ":", "policy", "/",
              "service-role/AWSLambdaBasicExecutionRole" ] ]}
          ]
        }
        },
        "SingletonLambdaTestCustomResourceProviderA9255269": {
        "Type": "AWS::Lambda::Function",
        "Properties": {
          "Code": {
          "ZipFile": "def hello(): pass"
          },
          "Handler": "index.hello",
          "Role": {
          "Fn::GetAtt": [
            "SingletonLambdaTestCustomResourceProviderServiceRole81FEAB5C",
            "Arn"
          ]
          },
          "Runtime": "python2.7",
          "Timeout": 300
        },
        "DependsOn": [
          "SingletonLambdaTestCustomResourceProviderServiceRole81FEAB5C"
        ]
        },
        "Custom1D319B237": {
        "Type": "AWS::CloudFormation::CustomResource",
        "Properties": {
          "ServiceToken": {
          "Fn::GetAtt": [
            "SingletonLambdaTestCustomResourceProviderA9255269",
            "Arn"
          ]
          }
        }
        },
        "Custom2DD5FB44D": {
        "Type": "AWS::CloudFormation::CustomResource",
        "Properties": {
          "ServiceToken": {
          "Fn::GetAtt": [
            "SingletonLambdaTestCustomResourceProviderA9255269",
            "Arn"
          ]
          }
        }
        }
      }
    });
    test.done();
  }
};

class TestCustomResource extends cdk.Construct {
  constructor(parent: cdk.Construct, name: string) {
  super(parent, name);

  const singletonLambda = new lambda.SingletonFunction(this, 'Lambda', {
    uuid: 'TestCustomResourceProvider',
    code: new lambda.InlineCode('def hello(): pass'),
    runtime: lambda.Runtime.Python27,
    handler: 'index.hello',
    timeout: 300,
  });

  new CustomResource(this, 'Resource', {
    lambdaProvider: singletonLambda
  });
  }
}
