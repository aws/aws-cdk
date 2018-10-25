import { expect, haveResource } from '@aws-cdk/assert';
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import appscaling = require('../lib');
import { createScalableTarget } from './util';

export = {
  'test setup target tracking on predefined metric'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      predefinedMetric: appscaling.PredefinedMetric.EC2SpotFleetRequestAverageCPUUtilization,
      targetValue: 30,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: "TargetTrackingScaling",
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: "EC2SpotFleetRequestAverageCPUUtilization" },
        TargetValue: 30
      }

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
      PolicyType: "TargetTrackingScaling",
      TargetTrackingScalingPolicyConfiguration: {
        CustomizedMetricSpecification: {
          Dimensions: [],
          MetricName: "Metric",
          Namespace: "Test",
          Statistic: "Average"
        },
        TargetValue: 30
      }

    }));

    test.done();
  }
};
