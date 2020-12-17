import * as cdk from '@aws-cdk/core';
import { CodeBuildBatchDeleteBuilds } from '../../lib/codebuild/batch-delete-builds';

describe('Delete Builds', () => {

  test('default settings', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const task = new CodeBuildBatchDeleteBuilds(stack, 'Delete Build', {
      ids: ['CodeBuildId'],
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
        Ids: ['CodeBuildId'],
      },
    });
  });
});