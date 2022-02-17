import { Template, Match } from '@aws-cdk/assertions';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import * as stepfunction from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import * as cpactions from '../../lib';

describe('StepFunctions Invoke Action', () => {
  describe('StepFunctions Invoke Action', () => {
    test('Verify stepfunction configuration properties are set to specific values', () => {
      const stack = new Stack();

      // when
      minimalPipeline(stack);

      // then
      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', Match.objectLike({
        Stages: [
          //  Must have a source stage
          {
            Actions: [
              {
                ActionTypeId: {
                  Category: 'Source',
                  Owner: 'AWS',
                  Provider: 'S3',
                  Version: '1',
                },
                Configuration: {
                  S3Bucket: {
                    Ref: 'MyBucketF68F3FF0',
                  },
                  S3ObjectKey: 'some/path/to',
                },
              },
            ],
          },
          // Must have stepfunction invoke action configuration
          {
            Actions: [
              {
                ActionTypeId: {
                  Category: 'Invoke',
                  Owner: 'AWS',
                  Provider: 'StepFunctions',
                  Version: '1',
                },
                Configuration: {
                  StateMachineArn: {
                    Ref: 'SimpleStateMachineE8E2CF40',
                  },
                  InputType: 'Literal',
                  // JSON Stringified input when the input type is Literal
                  Input: '{\"IsHelloWorldExample\":true}',
                },
              },
            ],
          },
        ],
      }));


    });

    test('Allows the pipeline to invoke this stepfunction', () => {
      const stack = new Stack();

      minimalPipeline(stack);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'MyPipelineInvokeCodePipelineActionRoleDefaultPolicy07A602B1',
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: ['states:StartExecution', 'states:DescribeStateMachine'],
              Resource: {
                Ref: 'SimpleStateMachineE8E2CF40',
              },
              Effect: 'Allow',
            },
          ]),
        },
      });

      Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 4);


    });

    test('Allows the pipeline to describe this stepfunction execution', () => {
      const stack = new Stack();

      minimalPipeline(stack);

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {},
            {
              Action: 'states:DescribeExecution',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':states:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':execution:',
                    {
                      'Fn::Select': [
                        6,
                        {
                          'Fn::Split': [
                            ':',
                            {
                              Ref: 'SimpleStateMachineE8E2CF40',
                            },
                          ],
                        },
                      ],
                    },
                    ':*',
                  ],
                ],
              },
              Effect: 'Allow',
            },
          ],
        },
      });

      Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 4);


    });

  });
});

function minimalPipeline(stack: Stack): codepipeline.IStage {
  const sourceOutput = new codepipeline.Artifact();
  const startState = new stepfunction.Pass(stack, 'StartState');
  const simpleStateMachine = new stepfunction.StateMachine(stack, 'SimpleStateMachine', {
    definition: startState,
  });
  const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline');
  const sourceStage = pipeline.addStage({
    stageName: 'Source',
    actions: [
      new cpactions.S3SourceAction({
        actionName: 'Source',
        bucket: new s3.Bucket(stack, 'MyBucket'),
        bucketKey: 'some/path/to',
        output: sourceOutput,
        trigger: cpactions.S3Trigger.POLL,
      }),
    ],
  });
  pipeline.addStage({
    stageName: 'Invoke',
    actions: [
      new cpactions.StepFunctionInvokeAction({
        actionName: 'Invoke',
        stateMachine: simpleStateMachine,
        stateMachineInput: cpactions.StateMachineInput.literal({ IsHelloWorldExample: true }),
      }),
    ],
  });

  return sourceStage;
}
