import { createScalableTarget } from './util';
import { Annotations, Match, Template } from '../../assertions';
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

  test('test setup target tracking on predefined metric for SAGEMAKER_VARIANT_CONCURRENT_REQUESTS_PER_MODEL_HIGH_RESOLUTION', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      predefinedMetric: appscaling.PredefinedMetric.SAGEMAKER_VARIANT_CONCURRENT_REQUESTS_PER_MODEL_HIGH_RESOLUTION,
      targetValue: 0.5,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'SageMakerVariantConcurrentRequestsPerModelHighResolution' },
        TargetValue: 0.5,
      },
    });
  });

  test('test setup target tracking on predefined metric for SAGEMAKER_INFERENCE_COMPONENT_CONCURRENT_REQUESTS_PER_COPY_HIGH_RESOLUTION', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      predefinedMetric: appscaling.PredefinedMetric.SAGEMAKER_INFERENCE_COMPONENT_CONCURRENT_REQUESTS_PER_COPY_HIGH_RESOLUTION,
      targetValue: 0.5,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'SageMakerInferenceComponentConcurrentRequestsPerCopyHighResolution' },
        TargetValue: 0.5,
      },
    });
  });

  test('test setup target tracking on predefined metric for WORKSPACES_AVERAGE_USER_SESSIONS_CAPACITY_UTILIZATION', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      predefinedMetric: appscaling.PredefinedMetric.WORKSPACES_AVERAGE_USER_SESSIONS_CAPACITY_UTILIZATION,
      targetValue: 0.5,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'WorkSpacesAverageUserSessionsCapacityUtilization' },
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

  test('warns when a custom metric is from another account', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env: { account: '111111111111', region: 'us-east-1' } });

    // WHEN
    createScalableTarget(stack).scaleToTrackMetric('Tracking', {
      customMetric: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Metric', account: '222222222222' }),
      targetValue: 30,
    });

    // THEN
    Annotations.fromStack(stack).hasWarning('*', Match.stringLikeRegexp('crossAccountMetricIgnored'));
  });

  test('warns when a custom metric is from another region', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env: { account: '111111111111', region: 'us-east-1' } });

    // WHEN
    createScalableTarget(stack).scaleToTrackMetric('Tracking', {
      customMetric: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Metric', region: 'eu-west-1' }),
      targetValue: 30,
    });

    // THEN
    Annotations.fromStack(stack).hasWarning('*', Match.stringLikeRegexp('crossRegionMetricIgnored'));
  });

  test.each([
    ['env-agnostic stack, concrete metric account', {}, '222222222222'],
    ['concrete stack, token metric account', { account: '111111111111', region: 'us-east-1' }, cdk.Aws.ACCOUNT_ID],
  ])('does not warn when accounts cannot be compared at synth: %s', (_, env, account) => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env });

    // WHEN
    createScalableTarget(stack).scaleToTrackMetric('Tracking', {
      customMetric: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Metric', account }),
      targetValue: 30,
    });

    // THEN
    Annotations.fromStack(stack).hasNoWarning('*', Match.stringLikeRegexp('crossAccountMetricIgnored'));
  });

  test.each([
    ['env-agnostic stack, concrete metric region', {}, 'eu-west-1'],
    ['concrete stack, token metric region', { account: '111111111111', region: 'us-east-1' }, cdk.Aws.REGION],
  ])('does not warn when regions cannot be compared at synth: %s', (_, env, region) => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env });

    // WHEN
    createScalableTarget(stack).scaleToTrackMetric('Tracking', {
      customMetric: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Metric', region }),
      targetValue: 30,
    });

    // THEN
    Annotations.fromStack(stack).hasNoWarning('*', Match.stringLikeRegexp('crossRegionMetricIgnored'));
  });

  test('allows custom metric from same account', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env: { account: '111111111111', region: 'us-east-1' } });
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      customMetric: new cloudwatch.Metric({
        namespace: 'Test',
        metricName: 'Metric',
        account: '111111111111', // Same account
      }),
      targetValue: 30,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      TargetTrackingScalingPolicyConfiguration: {
        CustomizedMetricSpecification: {
          MetricName: 'Metric',
          Namespace: 'Test',
        },
        TargetValue: 30,
      },
    });
    Annotations.fromStack(stack).hasNoWarning('*', Match.stringLikeRegexp('crossAccountMetricIgnored'));
  });

  test('test setup target tracking on a math expression', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);
    const utilization = new cloudwatch.Metric({
      namespace: 'AWS/Lambda',
      metricName: 'ProvisionedConcurrencyUtilization',
      dimensionsMap: { FunctionName: 'my-function', Resource: 'my-function:live' },
      statistic: cloudwatch.Stats.MAXIMUM,
    });

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      customMetric: new cloudwatch.MathExpression({
        expression: 'FILL(utilization, 0)',
        usingMetrics: { utilization },
        label: 'Utilization, idle as 0',
      }),
      targetValue: 0.7,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        CustomizedMetricSpecification: {
          Metrics: [
            {
              Id: 'expr_1',
              Expression: 'FILL(utilization, 0)',
              Label: 'Utilization, idle as 0',
              ReturnData: true,
            },
            {
              Id: 'utilization',
              MetricStat: {
                Metric: {
                  Namespace: 'AWS/Lambda',
                  MetricName: 'ProvisionedConcurrencyUtilization',
                  Dimensions: [
                    { Name: 'FunctionName', Value: 'my-function' },
                    { Name: 'Resource', Value: 'my-function:live' },
                  ],
                },
                Stat: 'Maximum',
              },
              ReturnData: false,
            },
          ],
        },
        TargetValue: 0.7,
      },
    });
  });

  test('flattens nested math expressions and renders a shared metric once', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);
    const messages = new cloudwatch.Metric({ namespace: 'AWS/SQS', metricName: 'ApproximateNumberOfMessagesVisible', statistic: 'Sum' });
    const tasks = new cloudwatch.Metric({ namespace: 'ECS/ContainerInsights', metricName: 'RunningTaskCount' });

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      customMetric: new cloudwatch.MathExpression({
        expression: 'backlog / tasks',
        usingMetrics: {
          backlog: new cloudwatch.MathExpression({ expression: 'FILL(messages, 0)', usingMetrics: { messages } }),
          tasks,
        },
      }),
      targetValue: 100,
    });

    // THEN
    const policy = Template.fromStack(stack).findResources('AWS::ApplicationAutoScaling::ScalingPolicy');
    const metrics = Object.values(policy)[0].Properties.TargetTrackingScalingPolicyConfiguration.CustomizedMetricSpecification.Metrics;
    expect(metrics.map((m: any) => [m.Id, m.Expression ?? m.MetricStat.Metric.MetricName, m.ReturnData])).toEqual([
      ['expr_1', 'backlog / tasks', true],
      ['backlog', 'FILL(messages, 0)', false],
      ['messages', 'ApproximateNumberOfMessagesVisible', false],
      ['tasks', 'RunningTaskCount', false],
    ]);
  });

  test('allows a percentile statistic inside a math expression', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      customMetric: new cloudwatch.MathExpression({
        expression: 'latency / 1000',
        usingMetrics: { latency: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Latency', statistic: 'p99' }) },
      }),
      targetValue: 1,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      TargetTrackingScalingPolicyConfiguration: {
        CustomizedMetricSpecification: {
          Metrics: Match.arrayWith([Match.objectLike({ Id: 'latency', MetricStat: Match.objectLike({ Stat: 'p99' }) })]),
        },
      },
    });
  });

  test('gives the top-level expression an id that usingMetrics does not use', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // WHEN
    target.scaleToTrackMetric('Tracking', {
      customMetric: new cloudwatch.MathExpression({
        expression: 'expr_1 * 2',
        usingMetrics: { expr_1: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Metric' }) },
      }),
      targetValue: 1,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
      TargetTrackingScalingPolicyConfiguration: {
        CustomizedMetricSpecification: {
          Metrics: [
            Match.objectLike({ Id: 'expr_2', Expression: 'expr_1 * 2', ReturnData: true }),
            Match.objectLike({ Id: 'expr_1', ReturnData: false }),
          ],
        },
      },
    });
  });

  test('throws for a search expression', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // THEN
    expect(() => target.scaleToTrackMetric('Tracking', {
      customMetric: new cloudwatch.SearchExpression({ expression: "SEARCH('{AWS/Lambda,FunctionName} Invocations', 'Sum')" }),
      targetValue: 1,
    })).toThrow(/Only metrics and math expressions are supported for Target Tracking/);
  });

  test('throws for a search expression used inside a math expression', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const target = createScalableTarget(stack);

    // THEN
    expect(() => target.scaleToTrackMetric('Tracking', {
      customMetric: new cloudwatch.MathExpression({
        expression: 'SUM(invocations)',
        usingMetrics: { invocations: new cloudwatch.SearchExpression({ expression: "SEARCH('{AWS/Lambda,FunctionName} Invocations', 'Sum')" }) },
      }),
      targetValue: 1,
    })).toThrow(/Search expressions are not supported for Target Tracking/);
  });

  test('warns when a metric inside a math expression is from another account', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env: { account: '111111111111', region: 'us-east-1' } });

    // WHEN
    createScalableTarget(stack).scaleToTrackMetric('Tracking', {
      customMetric: new cloudwatch.MathExpression({
        expression: 'm * 2',
        usingMetrics: { m: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Metric', account: '222222222222' }) },
      }),
      targetValue: 30,
    });

    // THEN
    Annotations.fromStack(stack).hasWarning('*', Match.stringLikeRegexp('crossAccountMetricIgnored'));
  });

  test('warns about identifiers missing from usingMetrics', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    createScalableTarget(stack).scaleToTrackMetric('Tracking', {
      customMetric: new cloudwatch.MathExpression({
        expression: 'm + missing',
        usingMetrics: { m: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Metric' }) },
      }),
      targetValue: 30,
    });

    // THEN
    Annotations.fromStack(stack).hasWarning('*', Match.stringLikeRegexp('references unknown identifiers: missing'));
  });
});
