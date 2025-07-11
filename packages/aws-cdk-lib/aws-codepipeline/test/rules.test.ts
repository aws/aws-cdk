import { Template } from '../../assertions';
import { Stack } from '../../core';
import * as codepipeline from '../lib';
import { Result, Rule } from '../lib';
import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';

describe('Rule', () => {
  let stack: Stack;
  let pipeline: codepipeline.Pipeline;
  const testAlarmRule = new Rule({
    name: 'CloudWatchCheck',
    provider: 'LambdaInvoke',
    version: '1',
    configuration: {
      AlarmName: 'alarmName',
      WaitTime: '300', // 5 minutes
      FunctionName: 'alarmFunction',
    },
  });

  const testLambdaRule = new Rule({
    name: 'LambdaCheck',
    provider: 'LambdaInvoke',
    version: '1',
    configuration: {
      FunctionName: 'lambdaFunctionName',
    },
  },
  );
  beforeEach(() => {
    stack = new Stack();
    pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
  });
  test('rules can applied in stage level conditions to a stage', () => {
    const beforeEntry = {
      conditions: [{
        rules: [testLambdaRule],
        result: codepipeline.Result.FAIL,
      }],
    };
    const onSuccess = {
      conditions: [{
        result: Result.FAIL,
        rules: [testAlarmRule],
      }],
    };
    const firstStage = pipeline.addStage({ stageName: 'FirstStage' });
    const secondStage = pipeline.addStage({ stageName: 'SecondStage', onSuccess, beforeEntry });

    // -- dummy actions here are needed to satisfy validation rules
    const sourceArtifact = new codepipeline.Artifact();
    firstStage.addAction(new FakeSourceAction({
      actionName: 'dummyAction',
      output: sourceArtifact,
    }));
    secondStage.addAction(new FakeBuildAction({
      actionName: 'dummyAction',
      input: sourceArtifact,
    }));

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: [
        { Name: 'FirstStage' },
        {
          Name: 'SecondStage',
          BeforeEntry: {
            Conditions: [
              {
                Rules: [
                  {
                    Name: 'LambdaCheck',
                    RuleTypeId: {
                      Provider: 'LambdaInvoke',
                      Version: '1',
                      Category: 'Rule',
                      Owner: 'AWS',
                    },
                  },
                ],
                Result: 'FAIL',
              },
            ],
          },
          OnSuccess: {
            Conditions: [
              {
                Rules: [
                  {
                    Name: 'CloudWatchCheck',
                    RuleTypeId: {
                      Provider: 'LambdaInvoke',
                      Version: '1',
                      Category: 'Rule',
                      Owner: 'AWS',
                    },
                  },
                ],
                Result: 'FAIL',
              },
            ],
          },
        },
      ],
    });
  });
});
