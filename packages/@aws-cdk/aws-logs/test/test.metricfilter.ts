import { expect, haveResource } from '@aws-cdk/assert-internal';
import { Metric } from '@aws-cdk/aws-cloudwatch';
import { Stack } from '@aws-cdk/core';
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
      filterPattern: FilterPattern.exists('$.latency'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Logs::MetricFilter', {
      MetricTransformations: [{
        MetricNamespace: 'AWS/Test',
        MetricName: 'Latency',
        MetricValue: '$.latency',
      }],
      FilterPattern: '{ $.latency = "*" }',
      LogGroupName: { Ref: 'LogGroupF5B46931' },
    }));

    test.done();
  },

  'metric filter exposes metric'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    const mf = new MetricFilter(stack, 'Subscription', {
      logGroup,
      metricNamespace: 'AWS/Test',
      metricName: 'Latency',
      metricValue: '$.latency',
      filterPattern: FilterPattern.exists('$.latency'),
    });

    const metric = mf.metric();

    // THEN
    test.deepEqual(metric, new Metric({
      metricName: 'Latency',
      namespace: 'AWS/Test',
      statistic: 'avg',
    }));

    test.done();
  },

  'metric filter exposes metric with custom statistic'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    const mf = new MetricFilter(stack, 'Subscription', {
      logGroup,
      metricNamespace: 'AWS/Test',
      metricName: 'Latency',
      metricValue: '$.latency',
      filterPattern: FilterPattern.exists('$.latency'),
    });

    const metric = mf.metric({ statistic: 'maximum' });

    // THEN
    test.deepEqual(metric, new Metric({
      metricName: 'Latency',
      namespace: 'AWS/Test',
      statistic: 'maximum',
    }));

    test.done();
  },
};
