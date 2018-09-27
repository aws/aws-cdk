import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { FilterPattern, LogGroup, MetricFilter } from '../lib';

export = {
  'trivial instantiation'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    new MetricFilter(stack, 'Subscription', {
      logGroup,
      metricNamespace: 'AWS/Test',
      metricName: 'Latency',
      metricValue: '$.latency',
      filterPattern: FilterPattern.exists('$.latency')
    });

    // THEN
    expect(stack).to(haveResource('AWS::Logs::MetricFilter', {
      MetricTransformations: [{
        MetricNamespace: 'AWS/Test',
        MetricName: 'Latency',
        MetricValue: '$.latency',
      }],
      FilterPattern: '{ $.latency = "*" }',
      LogGroupName: { Ref: "LogGroupF5B46931" }
    }));

    test.done();
  },
};
