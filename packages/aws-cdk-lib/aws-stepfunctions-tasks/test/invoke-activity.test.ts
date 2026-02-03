import { describeDeprecated } from '@aws-cdk/cdk-build-tools';
import { Template } from '../../assertions';
import * as sfn from '../../aws-stepfunctions';
import { Stack } from '../../core';
import * as tasks from '../lib';

describeDeprecated('InvokeActivity', () => {
  test('Activity can be used in a Task', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const activity = new sfn.Activity(stack, 'Activity');
    const task = new sfn.Task(stack, 'Task', { task: new tasks.InvokeActivity(activity) });
    new sfn.StateMachine(stack, 'SM', {
      definitionBody: sfn.DefinitionBody.fromChainable(task),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
      DefinitionString: {
        'Fn::Join': ['', [
          '{"StartAt":"Task","States":{"Task":{"End":true,"Type":"Task","Resource":"',
          { Ref: 'Activity04690B0A' },
          '"}}}',
        ]],
      },
    });
  });

  test('Activity Task metrics and Activity metrics are the same', () => {
    // GIVEN
    const stack = new Stack();
    const activity = new sfn.Activity(stack, 'Activity');
    const task = new sfn.Task(stack, 'Invoke', { task: new tasks.InvokeActivity(activity) });

    // WHEN
    const activityMetrics = [
      activity.metricFailed(),
      activity.metricHeartbeatTimedOut(),
      activity.metricRunTime(),
      activity.metricScheduled(),
      activity.metricScheduleTime(),
      activity.metricStarted(),
      activity.metricSucceeded(),
      activity.metricTime(),
      activity.metricTimedOut(),
    ];

    const taskMetrics = [
      task.metricFailed(),
      task.metricHeartbeatTimedOut(),
      task.metricRunTime(),
      task.metricScheduled(),
      task.metricScheduleTime(),
      task.metricStarted(),
      task.metricSucceeded(),
      task.metricTime(),
      task.metricTimedOut(),
    ];

    // THEN
    for (let i = 0; i < activityMetrics.length; i++) {
      expect(activityMetrics[i]).toEqual(taskMetrics[i]);
    }
  });
});
