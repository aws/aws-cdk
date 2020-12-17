import * as cdk from '@aws-cdk/core';
import { CodeBuildBatchGetReports } from '../../lib/codebuild/batch-get-reports';

describe('Get Reports', () => {

  test('default settings', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const task = new CodeBuildBatchGetReports(stack, 'Get Report', {
      reportArns: ['reportArn'],
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
        ReportArns: ['reportArn'],
      },
    });
  });
});