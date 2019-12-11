import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/core');
import tasks = require('../lib');

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('Cancel a Step with static ClusterId and StepId', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrCancelStep({
        clusterId: 'ClusterId',
        stepId: 'StepId'
      })
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
          ':states:::elasticmapreduce:cancelStep',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      StepId: 'StepId'
    },
  });
});

test('Cancel a Step with static ClusterId and StepId from payload', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrCancelStep({
        clusterId: 'ClusterId',
        stepId: sfn.TaskInput.fromDataAt('$.StepId').value
      })
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
          ':states:::elasticmapreduce:cancelStep',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId': 'ClusterId',
      'StepId.$': '$.StepId'
    },
  });
});

test('Cancel a Step with ClusterId from payload and static StepId', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrCancelStep({
        clusterId: sfn.TaskInput.fromDataAt('$.ClusterId').value,
        stepId: 'StepId'
      })
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
          ':states:::elasticmapreduce:cancelStep',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId.$': '$.ClusterId',
      'StepId': 'StepId'
    },
  });
});
