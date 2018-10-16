import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import stepfunctions = require('../lib');

export = {
    'Activity Task metrics and Activity metrics are the same'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const activity = new stepfunctions.Activity(stack, 'Activity');
        const task = new stepfunctions.Task(stack, 'Task', { resource: activity });

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
            activity.metricTimedOut()
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
            test.deepEqual(activityMetrics[i], taskMetrics[i]);
        }

        test.done();
    }
};