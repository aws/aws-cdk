import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { CodeBuildBatchDeleteBuilds } from '../../lib/codebuild/batch-delete-builds';

let stack: Stack;
let buildIds: string[];

beforeEach(() => {
  //GIVEN
  stack = new Stack();
  buildIds = ['buildId1', 'buildId2'];
});

test('BatchDeleteBuilds with request response pattern', () => {
  // WHEN
  const task = new CodeBuildBatchDeleteBuilds(stack, 'Delete Build', {
    ids: buildIds,
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
          ':states:::codebuild:batchDeleteBuilds',
        ],
      ],
    },
    End: true,
    Parameters: {
      Ids: ['buildId1', 'buildId2'],
    },
  });
});

test('Task throws if RUN_JOB is supplied as service integration pattern', () => {
  expect(() => {
    new CodeBuildBatchDeleteBuilds(stack, 'Delete Build', {
      ids: buildIds,
      integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    });
  }).toThrow(
    /Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: RUN_JOB/,
  );
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new CodeBuildBatchDeleteBuilds(stack, 'Delete Build', {
      ids: buildIds,
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    });
  }).toThrow(
    /Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: WAIT_FOR_TASK_TOKEN/,
  );
});