import { expect, haveResource } from '@aws-cdk/assert';
import { Pipeline, Stage } from '@aws-cdk/codepipeline';
import { Stack } from '@aws-cdk/core';
import { Lambda, LambdaInlineCode, LambdaRuntime } from '@aws-cdk/lambda';
import { Test } from 'nodeunit';
import { PipelineInvokeAction } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
    'PipelineInvokeAction can be used to invoke lambda functions from a CodePipeline'(test: Test) {
        const stack = new Stack();

        const lambda = new Lambda(stack, 'Function', {
            code: new LambdaInlineCode('bla'),
            handler: 'index.handler',
            runtime: LambdaRuntime.NodeJS43,
        });

        const pipeline = new Pipeline(stack, 'Pipeline');

        new PipelineInvokeAction(new Stage(pipeline, 'Stage'), 'InvokeAction', {
            lambda,
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
                      Provider: "Lambda",
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
                Name: "Stage"
              }
            ]
        }));

        expect(stack).to(haveResource('AWS::IAM::Policy', {
            PolicyDocument: {
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
            PolicyName: "FunctionServiceRoleDefaultPolicy2F49994A",
            Roles: [
              {
                Ref: "FunctionServiceRole675BB04A"
              }
            ]
        }));

        test.done();
    }
};
