import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as stepfunctions from '../lib';

describe('Activity', () => {
  test('instantiate Activity', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new stepfunctions.Activity(stack, 'Activity');

    // THEN
    expect(stack).toHaveResource('AWS::StepFunctions::Activity', {
      Name: 'Activity'
    });
  });

  test('Activity exposes metrics', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const activity = new stepfunctions.Activity(stack, 'Activity');

    // THEN
    const sharedMetric = {
      period: cdk.Duration.minutes(5),
      namespace: 'AWS/States',
      dimensions: { ActivityArn: { Ref: 'Activity04690B0A' }},
    };
    expect((stack.resolve(activity.metricRunTime()))).toEqual({
      ...sharedMetric,
      metricName: 'ActivityRunTime',
      statistic: 'Average'
    });

    expect(stack.resolve(activity.metricFailed())).toEqual({
      ...sharedMetric,
      metricName: 'ActivitiesFailed',
      statistic: 'Sum'
    });
  });
});
