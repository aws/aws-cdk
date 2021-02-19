import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { CodeBuildBatchGetReports } from '../../lib/codebuild/batch-get-reports';

let stack: Stack;
let reportArns: string[];

beforeEach(() => {
  //GIVEN
  stack = new Stack();
  reportArns = ['reportArn1', 'reportArn2'];
});

test('batchGetReports with request response pattern', () => {
  // WHEN
  const task = new CodeBuildBatchGetReports(stack, 'Get Report', {
    reportArns: reportArns,
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
          ':states:::codebuild:batchGetReports',
        ],
      ],
    },
    End: true,
    Parameters: {
      ReportArns: ['reportArn1', 'reportArn2'],
    },
  });
});

test('Task throws if RUN_JOB is supplied as service integration pattern', () => {
  expect(() => {
    new CodeBuildBatchGetReports(stack, 'Get Report', {
      reportArns: reportArns,
      integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    });
  }).toThrow(
    /Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: RUN_JOB/,
  );
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new CodeBuildBatchGetReports(stack, 'Get Report', {
      reportArns: reportArns,
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    });
  }).toThrow(
    /Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE. Received: WAIT_FOR_TASK_TOKEN/,
  );
});