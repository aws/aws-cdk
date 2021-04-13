import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as appscaling from '../lib';
import { createScalableTarget } from './util';

export = {
  'test setup target tracking on predefined metric'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      predefinedMetric: appscaling.PredefinedMetric.EC2_SPOT_FLEET_REQUEST_AVERAGE_CPU_UTILIZATION,
      targetValue: 30,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'EC2SpotFleetRequestAverageCPUUtilization' },
        TargetValue: 30,
      },

    }));

    test.done();
  },

  'test setup target tracking on predefined metric for lambda'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      predefinedMetric: appscaling.PredefinedMetric.LAMBDA_PROVISIONED_CONCURRENCY_UTILIZATION,
      targetValue: 0.9,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'LambdaProvisionedConcurrencyUtilization' },
        TargetValue: 0.9,
      },

    }));

    test.done();
  },

  'test setup target tracking on custom metric'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      customMetric: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Metric' }),
      targetValue: 30,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        CustomizedMetricSpecification: {
          MetricName: 'Metric',
          Namespace: 'Test',
          Statistic: 'Average',
        },
        TargetValue: 30,
      },

    }));

    test.done();
  },
};
