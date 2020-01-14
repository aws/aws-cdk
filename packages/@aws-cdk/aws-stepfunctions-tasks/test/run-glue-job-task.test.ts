import '@aws-cdk/assert/jest';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Duration, Stack } from '@aws-cdk/core';
import * as tasks from '../lib';

const jobName = "GlueJob";
let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('Invoke glue job with just job ARN', () => {
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.RunGlueJobTask(jobName)
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: task
  });

  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      "Fn::Join": [
        "",
        [
          "arn:",
          {
            Ref: "AWS::Partition",
          },
          ":states:::glue:startJobRun",
        ],
      ],
    },
    End: true,
    Parameters: {
      JobName: jobName
    },
  });
});

test('Invoke glue job with full properties', () => {
  const jobRunId = "jobRunId";
  const jobArguments = {
    key: "value"
  };
  const allocatedCapacity = 100;
  const timeout = Duration.minutes(1440);
  const securityConfiguration = "securityConfiguration";
  const notificationProperty = { notifyDelayAfter: 10 };
  const task = new sfn.Task(stack, 'Task', {
    task: new tasks.RunGlueJobTask(jobName, {
      integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
      jobRunId,
      arguments: jobArguments,
      allocatedCapacity,
      timeout,
      securityConfiguration,
      notificationProperty
    })
  });
  new sfn.StateMachine(stack, 'SM', {
    definition: task
  });

  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      "Fn::Join": [
        "",
        [
          "arn:",
          {
            Ref: "AWS::Partition",
          },
          ":states:::glue:startJobRun.sync",
        ],
      ],
    },
    End: true,
    Parameters: {
      JobName: jobName,
      JobRunId: jobRunId,
      Arguments: jobArguments,
      AllocatedCapacity: allocatedCapacity,
      Timeout: timeout,
      SecurityConfiguration: securityConfiguration,
      NotificationProperty: notificationProperty
    },
  });
});

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new sfn.Task(stack, 'Task', {
      task: new tasks.RunGlueJobTask(jobName, {
        integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN
      })
    });
  }).toThrow(/Invalid Service Integration Pattern: WAIT_FOR_TASK_TOKEN is not supported to call Glue./i);
});
