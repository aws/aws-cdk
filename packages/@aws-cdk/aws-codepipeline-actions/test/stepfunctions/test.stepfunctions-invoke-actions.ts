import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as s3 from '@aws-cdk/aws-s3';
import * as stepfunction from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as cpactions from '../../lib';

export = {
  'StepFunctions Invoke Action': {
    'Verify stepfunction configuration properties are set to specific values'(test: Test) {
      const stack = new Stack();

      // when
      minimalPipeline(stack);

      // then
      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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

      test.done();
    },

    'Allows the pipeline to invoke this stepfunction'(test: Test) {
      const stack = new Stack();

      minimalPipeline(stack);

      expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: ['states:StartExecution', 'states:DescribeStateMachine'],
              Resource: {
                Ref: 'SimpleStateMachineE8E2CF40',
              },
              Effect: 'Allow',
            },
          ],
        },
      }));

      expect(stack).to(haveResourceLike('AWS::IAM::Role'));

      test.done();
    },

    'Allows the pipeline to describe this stepfunction execution'(test: Test) {
      const stack = new Stack();

      minimalPipeline(stack);

      expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
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
      }));

      expect(stack).to(haveResourceLike('AWS::IAM::Role'));

      test.done();
    },

  },
};

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
