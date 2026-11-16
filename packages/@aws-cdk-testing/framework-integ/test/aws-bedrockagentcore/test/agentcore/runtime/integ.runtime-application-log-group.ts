/**
 * Integration test for the Runtime.applicationLogGroup accessor.
 *
 * Creates a Runtime and wires its application log group (the AgentCore-managed
 * default endpoint log group at `/aws/bedrock-agentcore/runtimes/{id}-DEFAULT`)
 * into a MetricFilter and a CloudWatch Alarm without hardcoding the log group
 * name.
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime-application-log-group

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import * as logs from 'aws-cdk-lib/aws-logs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime-application-log-group');

const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'testArtifact'),
  { platform: assets.Platform.LINUX_ARM64 },
);

const runtime = new agentcore.Runtime(stack, 'TestRuntime', {
  runtimeName: 'integ_test_app_log_group',
  description: 'Integration test runtime for applicationLogGroup accessor',
  agentRuntimeArtifact: runtimeArtifact,
});

// Attach a metric filter to the application log group without hardcoding its name.
const toolErrors = new logs.MetricFilter(stack, 'ToolErrors', {
  logGroup: runtime.applicationLogGroup,
  filterPattern: logs.FilterPattern.stringValue('$.tool_status', '=', 'error'),
  metricNamespace: 'IntegTestAgentCore',
  metricName: 'ToolExecutionErrors',
});

// And an alarm on the resulting metric.
new cloudwatch.Alarm(stack, 'ToolErrorsAlarm', {
  metric: toolErrors.metric(),
  threshold: 1,
  evaluationPeriods: 1,
  comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
});

new cdk.CfnOutput(stack, 'ApplicationLogGroupName', {
  value: runtime.applicationLogGroup.logGroupName,
  description: 'Application log group name for the default endpoint',
});

new cdk.CfnOutput(stack, 'ApplicationLogGroupArn', {
  value: runtime.applicationLogGroup.logGroupArn,
  description: 'Application log group ARN for the default endpoint',
});

new integ.IntegTest(app, 'BedrockAgentCoreRuntimeApplicationLogGroupTest', {
  testCases: [stack],
});
