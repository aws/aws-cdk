import { createScalableTarget } from './util';
import { Template } from '../../assertions';
import * as cloudwatch from '../../aws-cloudwatch';
import * as cdk from '../../core';
import * as appscaling from '../lib';

describe('target tracking', () => {
  test('test setup target tracking on predefined metric', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      predefinedMetric: appscaling.PredefinedMetric.EC2_SPOT_FLEET_REQUEST_AVERAGE_CPU_UTILIZATION,
      targetValue: 30,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'EC2SpotFleetRequestAverageCPUUtilization' },
        TargetValue: 30,
      },

    });

  });

  test('test setup target tracking on predefined metric for lambda', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      predefinedMetric: appscaling.PredefinedMetric.LAMBDA_PROVISIONED_CONCURRENCY_UTILIZATION,
      targetValue: 0.9,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'LambdaProvisionedConcurrencyUtilization' },
        TargetValue: 0.9,
      },

    });

  });

  test('test setup target tracking on predefined metric for DYNAMODB_WRITE_CAPACITY_UTILIZATION', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      predefinedMetric: appscaling.PredefinedMetric.DYNAMODB_WRITE_CAPACITY_UTILIZATION,
      targetValue: 0.9,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBWriteCapacityUtilization' },
        TargetValue: 0.9,
      },
    });
  });

  test('test setup target tracking on predefined metric for SAGEMAKER_VARIANT_PROVISIONED_CONCURRENCY_UTILIZATION', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      predefinedMetric: appscaling.PredefinedMetric.SAGEMAKER_VARIANT_PROVISIONED_CONCURRENCY_UTILIZATION,
      targetValue: 0.5,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'SageMakerVariantProvisionedConcurrencyUtilization' },
        TargetValue: 0.5,
      },
    });
  });

  test('test setup target tracking on custom metric', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      customMetric: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Metric' }),
      targetValue: 30,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        CustomizedMetricSpecification: {
          MetricName: 'Metric',
          Namespace: 'Test',
          Statistic: 'Average',
        },
        TargetValue: 30,
      },

    });

  });
});
