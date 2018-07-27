import { expect, haveResource } from '@aws-cdk/assert';
import codepipeline = require('@aws-cdk/aws-codepipeline');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { InvokeAction } from '../lib/pipeline-action';

// tslint:disable:object-literal-key-quotes

export = {
    'Pipeline InvokeAction can be used to invoke a Lambda function from a CodePipeline'(test: Test) {
        const stack = new cdk.Stack();

        const lambdaFun = new lambda.Lambda(stack, 'Function', {
            code: new lambda.LambdaInlineCode('bla'),
            handler: 'index.handler',
            runtime: lambda.LambdaRuntime.NodeJS43,
        });

        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

        new InvokeAction(new codepipeline.Stage(pipeline, 'Stage'), 'InvokeAction', {
            lambda: lambdaFun,
            userParameters: 'foo-bar/42'
        });

        expect(stack).to(haveResource('AWS::CodePipeline::Pipeline', {
            "ArtifactStore": {
              "Location": {
                "Ref": "PipelineArtifactsBucket22248F97"
              },
              "Type": "S3"
            },
            "RoleArn": {
              "Fn::GetAtt": [
                "PipelineRoleD68726F7",
                "Arn"
              ]
            },
            "Stages": [
              {
                "Actions": [
                  {
                    "ActionTypeId": {
                      "Category": "Invoke",
                      "Owner": "AWS",
                      "Provider": "Lambda",
                      "Version": "1"
                    },
                    "Configuration": {
                      "FunctionName": {
                        "Ref": "Function76856677"
                      },
                      "UserParameters": "foo-bar/42"
                    },
                    "InputArtifacts": [],
                    "Name": "InvokeAction",
                    "OutputArtifacts": [],
                    "RunOrder": 1
                  }
                ],
                "Name": "Stage"
              }
            ]
        }));

        expect(stack).to(haveResource('AWS::IAM::Policy', {
            "PolicyDocument": {
              "Statement": [
                {
                  "Action": [
                    "codepipeline:PutJobSuccessResult",
                    "codepipeline:PutJobFailureResult"
                  ],
                  "Effect": "Allow",
                  "Resource": "*"
                }
              ],
              "Version": "2012-10-17"
            },
            "PolicyName": "FunctionServiceRoleDefaultPolicy2F49994A",
            "Roles": [
              {
                "Ref": "FunctionServiceRole675BB04A"
              }
            ]
        }));

        test.done();
    }
};
