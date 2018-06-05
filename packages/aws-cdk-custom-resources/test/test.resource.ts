import { Construct, Stack } from 'aws-cdk';
import { expect } from 'aws-cdk-assert';
import { LambdaInlineCode, LambdaRuntime } from 'aws-cdk-lambda';
import { Test } from 'nodeunit';
import { CustomResource, LambdaBackedCustomResource } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
    'custom resource is added twice, lambda is added once'(test: Test) {
        // GIVEN
        const stack = new Stack();

        // WHEN
        new TestCustomResource(stack, 'Custom1');
        new TestCustomResource(stack, 'Custom2');

        // THEN
        expect(stack).toMatch({
            "Resources": {
              "TestCustomResourceProviderServiceRole3D68371D": {
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
              "TestCustomResourceProvider10987C61": {
                "Type": "AWS::Lambda::Function",
                "Properties": {
                  "Code": {
                    "ZipFile": "def hello(): pass"
                  },
                  "Handler": "index.hello",
                  "Role": {
                    "Fn::GetAtt": [
                      "TestCustomResourceProviderServiceRole3D68371D",
                      "Arn"
                    ]
                  },
                  "Runtime": "python2.7",
                  "Timeout": 300
                },
                "DependsOn": [
                  "TestCustomResourceProviderServiceRole3D68371D"
                ]
              },
              "Custom1": {
                "Type": "AWS::CloudFormation::CustomResource",
                "Properties": {
                  "ServiceToken": {
                    "Fn::GetAtt": [
                      "TestCustomResourceProvider10987C61",
                      "Arn"
                    ]
                  }
                }
              },
              "Custom2": {
                "Type": "AWS::CloudFormation::CustomResource",
                "Properties": {
                  "ServiceToken": {
                    "Fn::GetAtt": [
                      "TestCustomResourceProvider10987C61",
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

class TestCustomResource extends CustomResource {
    constructor(parent: Construct, name: string) {
        super(parent, name, {
            provider: new LambdaBackedCustomResource({
                uuid: 'TestCustomResourceProvider',
                lambdaProperties: {
                    code: new LambdaInlineCode('def hello(): pass'),
                    runtime: LambdaRuntime.Python27,
                    handler: 'index.hello',
                    timeout: 300,
                }
            })
        });
    }
}
