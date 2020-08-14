import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Metric, Alarm, AlarmStatusWidget } from '../lib';
export = {
  'alarm status widget'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const metric = new Metric({ namespace: 'CDK', metricName: 'Test' });
    const alarm = new Alarm(stack, 'Alarm', {
      metric,
      threshold: 1,
      evaluationPeriods: 1,
    });

    // WHEN
    const widget = new AlarmStatusWidget({
      alarms: [alarm],
    });

    // THEN
    test.deepEqual(stack.resolve(widget.toJson()), [
      {
        type: 'alarm',
        width: 6,
        height: 3,
        properties: {
          title: 'Alarm Status',
          alarms: [{ 'Fn::GetAtt': ['Alarm7103F465', 'Arn'] }],
        },
      },
    ]);

    test.done();
  },
};
