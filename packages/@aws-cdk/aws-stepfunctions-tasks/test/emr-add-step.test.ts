import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/core');
import tasks = require('../lib');

let stack: cdk.Stack;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
});

test('Add Step with static ClusterId and StepConfiguration', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrAddStep({
        clusterId: 'ClusterId',
        stepConfiguration: sfn.TaskInput.fromObject({
          Name: 'StepName'
        })
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
          ':states:::elasticmapreduce:addStep',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      Step: {
        Name: 'StepName'
      }
    },
  });
});

test('Terminate cluster with ClusterId from payload and static StepConfiguration', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrAddStep({
        clusterId: sfn.TaskInput.fromDataAt('$.ClusterId').value,
        stepConfiguration: sfn.TaskInput.fromObject({
          Name: 'StepName'
        })
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
          ':states:::elasticmapreduce:addStep',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId.$': '$.ClusterId',
      'Step': {
        Name: 'StepName'
      }
    },
  });
});

test('Add Step with static ClusterId and StepConfiguration from payload', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrAddStep({
        clusterId: 'ClusterId',
        stepConfiguration: sfn.TaskInput.fromDataAt('$.StepConfiguration')
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
          ':states:::elasticmapreduce:addStep',
        ],
      ],
    },
    End: true,
    Parameters: {
      'ClusterId': 'ClusterId',
      'Step.$': '$.StepConfiguration'
    },
  });
});

test('Add Step with static ClusterId and StepConfiguration and SYNC integrationPattern', () => {
  // WHEN
  const task = new sfn.Task(stack, 'Task', {
      task: new tasks.EmrAddStep({
        clusterId: 'ClusterId',
        stepConfiguration: sfn.TaskInput.fromObject({
          Name: 'StepName'
        }),
        integrationPattern: sfn.ServiceIntegrationPattern.SYNC
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
          ':states:::elasticmapreduce:addStep.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ClusterId: 'ClusterId',
      Step: {
        Name: 'StepName'
      }
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.EmrAddStep({
        clusterId: 'ClusterId',
        stepConfiguration: sfn.TaskInput.fromObject({
          Name: 'StepName'
        }),
        integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN
      })
    });
  }).toThrow(/Invalid Service Integration Pattern: WAIT_FOR_TASK_TOKEN is not supported to call AddStep./i);
});
