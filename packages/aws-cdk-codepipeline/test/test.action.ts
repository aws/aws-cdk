import { Stack } from 'aws-cdk';
import { expect, haveResource } from 'aws-cdk-assert';
import { Lambda, LambdaInlineCode, LambdaRuntime } from 'aws-cdk-lambda';
import { Test } from 'nodeunit';
import { Action, ActionArtifactBounds, ActionCategory, Artifact, InvokeLambdaAction, Pipeline, Stage } from '../lib';
import { validateArtifactBounds, validateSourceAction } from '../lib/validation';

// tslint:disable:object-literal-key-quotes

class TestAction extends Action {}

export = {
    'artifact bounds validation': {

        'artifacts count exceed maximum'(test: Test) {
            const result = boundsValidationResult(1, 0, 0);
            test.deepEqual(result.length, 1);
            test.ok(result[0].match(/cannot have more than 0/), 'the validation should have failed');
            test.done();
        },

        'artifacts count below minimum'(test: Test) {
            const result = boundsValidationResult(1, 2, 2);
            test.deepEqual(result.length, 1);
            test.ok(result[0].match(/must have at least 2/), 'the validation should have failed');
            test.done();
        },

        'artifacts count within bounds'(test: Test) {
            const result = boundsValidationResult(1, 0, 2);
            test.deepEqual(result.length, 0);
            test.done();
        },
    },

    'action type validation': {

        'must be source and is source'(test: Test) {
            const result = validateSourceAction(true, ActionCategory.Source, 'test action', 'test stage');
            test.deepEqual(result.length, 0);
            test.done();
        },

        'must be source and is not source'(test: Test) {
            const result = validateSourceAction(true, ActionCategory.Deploy, 'test action', 'test stage');
            test.deepEqual(result.length, 1);
            test.ok(result[0].match(/may only contain Source actions/), 'the validation should have failed');
            test.done();
        },

        'cannot be source and is source'(test: Test) {
            const result = validateSourceAction(false, ActionCategory.Source, 'test action', 'test stage');
            test.deepEqual(result.length, 1);
            test.ok(result[0].match(/may only occur in first stage/), 'the validation should have failed');
            test.done();
        },

        'cannot be source and is not source'(test: Test) {
            const result = validateSourceAction(false, ActionCategory.Deploy, 'test action', 'test stage');
            test.deepEqual(result.length, 0);
            test.done();
        },
    },

    'standard action with artifacts'(test: Test) {
        const stage = stageForTesting();
        const action = new TestAction(stage, 'TestAction', {
            artifactBounds: defaultBounds(),
            category: ActionCategory.Source,
            provider: 'test provider',
            configuration: { blah: 'bleep' }
        });
        new Artifact(action, 'TestOutput');

        test.deepEqual(action.render(), {
            name: 'TestAction',
            inputArtifacts: [],
            actionTypeId:
                {
                    category: 'Source',
                    version: '1',
                    owner: 'AWS',
                    provider: 'test provider'
                },
            configuration: { blah: 'bleep' },
            outputArtifacts: [{ name: 'TestOutput' }],
            runOrder: 1
        });
        test.done();
    },

    'InvokeLambdaAction can be used to invoke lambda functions from a pipeline'(test: Test) {
        const stack = new Stack();

        const lambda = new Lambda(stack, 'Function', {
            code: new LambdaInlineCode('bla'),
            handler: 'index.handler',
            runtime: LambdaRuntime.NodeJS43,
        });

        const pipeline = new Pipeline(stack, 'Pipeline');

        new InvokeLambdaAction(new Stage(pipeline, 'Stage'), 'InvokeAction', {
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

function boundsValidationResult(numberOfArtifacts: number, min: number, max: number): string[] {
    const stage = stageForTesting();
    const action = new TestAction(stage, 'TestAction', {
        artifactBounds: defaultBounds(),
        category: ActionCategory.Test,
        provider: 'test provider'
    });
    const artifacts: Artifact[] = [];
    for (let i = 0; i < numberOfArtifacts; i++) {
        artifacts.push(new Artifact(action, `TestArtifact${i}`));
    }
    return validateArtifactBounds('output', artifacts, min, max, 'testCategory', 'testProvider');
}

function stageForTesting(): Stage {
    const stack = new Stack();
    const pipeline = new Pipeline(stack, 'pipeline');
    return new Stage(pipeline, 'stage');
}

function defaultBounds(): ActionArtifactBounds {
    return {
        minInputs: 0,
        maxInputs: 5,
        minOutputs: 0,
        maxOutputs: 5
    };
}