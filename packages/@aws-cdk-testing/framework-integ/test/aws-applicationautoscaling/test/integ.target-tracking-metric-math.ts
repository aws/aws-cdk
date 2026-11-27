import * as appscaling from 'aws-cdk-lib/aws-applicationautoscaling';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/**
 * Stack verification steps:
 * * The target tracking policy on the alias's provisioned concurrency is created with a
 *   customized metric made of a FILL math expression over the Maximum utilization.
 */
const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-appscaling-target-tracking-metric-math');

const fn = new lambda.Function(stack, 'Function', {
  code: new lambda.InlineCode('exports.handler = async () => {};'),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});
const alias = new lambda.Alias(stack, 'Alias', {
  aliasName: 'live',
  version: fn.currentVersion,
});

const target = new appscaling.ScalableTarget(stack, 'ScalableTarget', {
  serviceNamespace: appscaling.ServiceNamespace.LAMBDA,
  minCapacity: 1,
  maxCapacity: 2,
  resourceId: `function:${fn.functionName}:${alias.aliasName}`,
  scalableDimension: 'lambda:function:ProvisionedConcurrency',
});
target.node.addDependency(alias);

target.scaleToTrackMetric('UtilizationTracking', {
  policyName: 'utilization-or-zero',
  targetValue: 0.7,
  customMetric: new cloudwatch.MathExpression({
    expression: 'FILL(utilization, 0)',
    usingMetrics: {
      utilization: alias.metric('ProvisionedConcurrencyUtilization', {
        statistic: cloudwatch.Stats.MAXIMUM,
      }),
    },
    label: 'Utilization, idle as 0',
  }),
});

const integ = new IntegTest(app, 'TargetTrackingMetricMath', {
  testCases: [stack],
});

const describePolicy = integ.assertions.awsApiCall('ApplicationAutoScaling', 'describeScalingPolicies', {
  ServiceNamespace: 'lambda',
  ResourceId: `function:${fn.functionName}:${alias.aliasName}`,
  PolicyNames: ['utilization-or-zero'],
});
// DescribeScalingPolicies also reads the CloudWatch alarms that target tracking creates
describePolicy.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['cloudwatch:DescribeAlarms'],
  Resource: ['*'],
});
describePolicy.expect(ExpectedResult.objectLike({
  ScalingPolicies: [
    {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        TargetValue: 0.7,
        CustomizedMetricSpecification: {
          Metrics: [
            { Id: 'expr_1', Expression: 'FILL(utilization, 0)', ReturnData: true },
            {
              Id: 'utilization',
              MetricStat: {
                Metric: { Namespace: 'AWS/Lambda', MetricName: 'ProvisionedConcurrencyUtilization' },
                Stat: 'Maximum',
              },
              ReturnData: false,
            },
          ],
        },
      },
    },
  ],
}));
