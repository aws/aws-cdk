import { Match, Template } from '@aws-cdk/assertions';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { describeDeprecated } from '@aws-cdk/cdk-build-tools';
import { Duration, Stack } from '@aws-cdk/core';
import * as tasks from '../../lib';

const jobName = 'GlueJob';
let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describeDeprecated('RunGlueJobTask', () => {
  test('Invoke glue job with just job ARN', () => {
    const task = new sfn.Task(stack, 'Task', {
      task: new tasks.RunGlueJobTask(jobName),
    });
    new sfn.StateMachine(stack, 'SM', {
      definition: task,
    });

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
            ':states:::glue:startJobRun',
          ],
        ],
      },
      End: true,
      Parameters: {
        JobName: jobName,
      },
    });
  });

  test('Invoke glue job with full properties', () => {
    const jobArguments = {
      key: 'value',
    };
    const timeoutMinutes = 1440;
    const timeout = Duration.minutes(timeoutMinutes);
    const securityConfiguration = 'securityConfiguration';
    const notifyDelayAfterMinutes = 10;
    const notifyDelayAfter = Duration.minutes(notifyDelayAfterMinutes);
    const task = new sfn.Task(stack, 'Task', {
      task: new tasks.RunGlueJobTask(jobName, {
        integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
        arguments: jobArguments,
        timeout,
        securityConfiguration,
        notifyDelayAfter,
      }),
    });
    new sfn.StateMachine(stack, 'SM', {
      definition: task,
    });

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
            ':states:::glue:startJobRun.sync',
          ],
        ],
      },
      End: true,
      Parameters: {
        JobName: jobName,
        Arguments: jobArguments,
        Timeout: timeoutMinutes,
        SecurityConfiguration: securityConfiguration,
        NotificationProperty: {
          NotifyDelayAfter: notifyDelayAfterMinutes,
        },
      },
    });
  });

  test('permitted role actions limited to start job run if service integration pattern is FIRE_AND_FORGET', () => {
    const task = new sfn.Task(stack, 'Task', {
      task: new tasks.RunGlueJobTask(jobName, {
        integrationPattern: sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
      }),
    });
    new sfn.StateMachine(stack, 'SM', {
      definition: task,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [Match.objectLike({
          Action: 'glue:StartJobRun',
        })],
      },
    });
  });

  test('permitted role actions include start, get, and stop job run if service integration pattern is SYNC', () => {
    const task = new sfn.Task(stack, 'Task', {
      task: new tasks.RunGlueJobTask(jobName, {
        integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
      }),
    });
    new sfn.StateMachine(stack, 'SM', {
      definition: task,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [Match.objectLike({
          Action: [
            'glue:StartJobRun',
            'glue:GetJobRun',
            'glue:GetJobRuns',
            'glue:BatchStopJobRun',
          ],
        })],
      },
    });
  });

  test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
    expect(() => {
      new sfn.Task(stack, 'Task', {
        task: new tasks.RunGlueJobTask(jobName, {
          integrationPattern: sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
        }),
      });
    }).toThrow(/Invalid Service Integration Pattern: WAIT_FOR_TASK_TOKEN is not supported to call Glue./i);
  });
});
