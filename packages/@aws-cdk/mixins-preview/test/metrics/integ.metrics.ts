import * as cdk from 'aws-cdk-lib/core';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import { LambdaMetrics } from '../../lib/services/aws-lambda/metrics.generated';

class MetricsDashboard extends cdk.Stack {
  public constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // L1 Lambda
    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
    });
    const cfnFunction = new lambda.CfnFunction(this, 'L1Function', {
      runtime: 'nodejs22.x',
      handler: 'index.handler',
      code: { zipFile: 'exports.handler = async () => ({ statusCode: 200 })' },
      role: role.roleArn,
    });

    // L2 Lambda
    const fn = new lambda.Function(this, 'L2Function', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => ({ statusCode: 200 })'),
    });

    // Scoped metrics from L1
    const l1Metrics = LambdaMetrics.fromFunction(cfnFunction);

    // Scoped metrics from L2
    const l2Metrics = LambdaMetrics.fromFunction(fn);

    // Unscoped metrics with explicit dimensions
    const unscopedByName = new LambdaMetrics.FunctionNameMetrics({ functionName: 'my-function' });
    const unscopedByResource = new LambdaMetrics.FunctionNamePerResourceMetrics({
      functionName: 'my-function',
      resource: 'prod',
    });

    // Account-wide metrics
    const accountMetrics = new LambdaMetrics.AccountMetrics();

    // Dashboard
    const dashboard = new cloudwatch.Dashboard(this, 'MetricsDashboard', {
      dashboardName: 'MixinsPreview-MetricsIntegTest',
    });

    dashboard.addWidgets(
      new cloudwatch.TextWidget({ markdown: '# Scoped Metrics (from L1 CfnFunction)', width: 24, height: 1 }),
    );
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({ title: 'L1 Invocations', left: [l1Metrics.metricInvocations()], width: 8 }),
      new cloudwatch.GraphWidget({ title: 'L1 Duration', left: [l1Metrics.metricDuration()], width: 8 }),
      new cloudwatch.GraphWidget({ title: 'L1 Errors', left: [l1Metrics.metricErrors()], width: 8 }),
    );

    dashboard.addWidgets(
      new cloudwatch.TextWidget({ markdown: '# Scoped Metrics (from L2 Function)', width: 24, height: 1 }),
    );
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({ title: 'L2 Invocations', left: [l2Metrics.metricInvocations()], width: 8 }),
      new cloudwatch.GraphWidget({ title: 'L2 Throttles', left: [l2Metrics.metricThrottles()], width: 8 }),
      new cloudwatch.GraphWidget({ title: 'L2 ConcurrentExecutions', left: [l2Metrics.metricConcurrentExecutions()], width: 8 }),
    );

    dashboard.addWidgets(
      new cloudwatch.TextWidget({ markdown: '# Unscoped Metrics (explicit dimensions)', width: 24, height: 1 }),
    );
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({ title: 'ByFunctionName - Invocations', left: [unscopedByName.metricInvocations()], width: 8 }),
      new cloudwatch.GraphWidget({ title: 'ByResource - Errors', left: [unscopedByResource.metricErrors()], width: 8 }),
      new cloudwatch.GraphWidget({ title: 'Statistic Override (p99 Duration)', left: [l2Metrics.metricDuration({ statistic: 'p99' })], width: 8 }),
    );

    dashboard.addWidgets(
      new cloudwatch.TextWidget({ markdown: '# Account-wide Metrics (empty dimension set)', width: 24, height: 1 }),
    );
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({ title: 'Account ConcurrentExecutions', left: [accountMetrics.metricConcurrentExecutions()], width: 12 }),
      new cloudwatch.GraphWidget({ title: 'Account Invocations', left: [accountMetrics.metricInvocations()], width: 12 }),
    );
  }
}

const app = new cdk.App();
const stack = new MetricsDashboard(app, 'MetricsDashboard');

new integ.IntegTest(app, 'Metrics-Test', {
  testCases: [stack],
});
