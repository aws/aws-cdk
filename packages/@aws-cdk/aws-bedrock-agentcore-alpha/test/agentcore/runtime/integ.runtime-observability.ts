/**
 * Integration test for Bedrock AgentCore Runtime observability configuration
 * This test creates a runtime with tracing and logging enabled
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-runtime-observability

import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-runtime-observability');

// Use fromAsset to build and push Docker image to ECR automatically
const runtimeArtifact = agentcore.AgentRuntimeArtifact.fromAsset(
  path.join(__dirname, 'testArtifact'),
);

// Create log group for logging destination
const logGroup = new logs.LogGroup(stack, 'RuntimeLogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Create S3 bucket for logging destination
const logBucket = new s3.Bucket(stack, 'RuntimeLogBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

// Create Firehose delivery stream for logging destination
const firehoseStream = new firehose.DeliveryStream(stack, 'RuntimeLogStream', {
  destination: new firehose.S3Bucket(logBucket, {
    dataOutputPrefix: 'firehose-logs/',
  }),
});

// Runtime with full observability:
// - X-Ray tracing
// - APPLICATION_LOGS to CloudWatch Logs, S3, and Firehose
// - USAGE_LOGS to CloudWatch Logs, S3, and Firehose
const runtime = new agentcore.Runtime(stack, 'ObservabilityRuntime', {
  runtimeName: 'integ_observability_runtime',
  description: 'Runtime with full observability configuration',
  agentRuntimeArtifact: runtimeArtifact,
  protocolConfiguration: agentcore.ProtocolType.HTTP,
  tracingEnabled: true,
  loggingConfigs: [
    // APPLICATION_LOGS to all 3 destinations
    {
      logType: agentcore.LogType.APPLICATION_LOGS,
      destination: agentcore.LoggingDestination.cloudWatchLogs(logGroup),
    },
    {
      logType: agentcore.LogType.APPLICATION_LOGS,
      destination: agentcore.LoggingDestination.s3(logBucket),
    },
    {
      logType: agentcore.LogType.APPLICATION_LOGS,
      destination: agentcore.LoggingDestination.firehose(firehoseStream),
    },
    // USAGE_LOGS to all 3 destinations
    {
      logType: agentcore.LogType.USAGE_LOGS,
      destination: agentcore.LoggingDestination.cloudWatchLogs(logGroup),
    },
    {
      logType: agentcore.LogType.USAGE_LOGS,
      destination: agentcore.LoggingDestination.s3(logBucket),
    },
    {
      logType: agentcore.LogType.USAGE_LOGS,
      destination: agentcore.LoggingDestination.firehose(firehoseStream),
    },
  ],
  tags: {
    TestCase: 'FullObservability',
  },
});

// Output runtime information for verification
new cdk.CfnOutput(stack, 'RuntimeId', {
  value: runtime.agentRuntimeId,
  description: 'Runtime ID',
});

new cdk.CfnOutput(stack, 'RuntimeArn', {
  value: runtime.agentRuntimeArn,
  description: 'Runtime ARN',
});

new cdk.CfnOutput(stack, 'LogGroupArn', {
  value: logGroup.logGroupArn,
  description: 'Log group ARN',
});

new cdk.CfnOutput(stack, 'LogBucketArn', {
  value: logBucket.bucketArn,
  description: 'Log bucket ARN',
});

new cdk.CfnOutput(stack, 'FirehoseStreamArn', {
  value: firehoseStream.deliveryStreamArn,
  description: 'Firehose stream ARN',
});

new integ.IntegTest(app, 'BedrockAgentCoreRuntimeObservabilityTest', {
  testCases: [stack],
});
