import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { CodeBuildStopBuild } from '../../lib/codebuild/stop-build';

let stack: Stack;
let buildId: string;

beforeEach(() => {
  //GIVEN
  stack = new Stack();
  buildId = 'CodeBuildId';
});

test('stopBuild with request response pattern', () => {
  // WHEN
  const task = new CodeBuildStopBuild(stack, 'Stop Build', {
    buildId: buildId,
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::codebuild:stopBuild',
        ],
      ],
    },
    End: true,
    Parameters: {
      Id: buildId,
    },
  });
});

test('Task throws if RUN_JOB is supplied as service integration pattern', () => {
  expect(() => {
    new CodeBuildStopBuild(stack, 'Stop Build', {
      buildId: buildId,
      integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    });
  }).toThrow(
    /Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: RUN_JOB/,
  );
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new CodeBuildStopBuild(stack, 'Stop Build', {
      buildId: buildId,
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    });
  }).toThrow(
    /Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: WAIT_FOR_TASK_TOKEN/,
  );
});