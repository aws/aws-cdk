import * as cdk from '@aws-cdk/core';
import { CodeBuildStopBuild } from '../../lib/codebuild/stop-build';

describe('Stop Build', () => {

  test('default settings', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const task = new CodeBuildStopBuild(stack, 'Stop Build', {
      projectId: 'CodeBuildProject',
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
        Id: 'CodeBuildProject',
      },
    });
  });
});