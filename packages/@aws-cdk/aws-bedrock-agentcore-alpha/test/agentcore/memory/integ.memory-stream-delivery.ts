/*
 * Integration test for Bedrock Agent Core Memory with Stream Delivery
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-memory-stream-delivery

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as agentcore from '../../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-memory-stream-delivery');

// Create a Kinesis Data Stream for memory record streaming
const stream = new kinesis.Stream(stack, 'MemoryEventStream', {
  encryption: kinesis.StreamEncryption.MANAGED,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Create a memory with Kinesis stream delivery (defaults to MEMORY_RECORDS + FULL_CONTENT)
new agentcore.Memory(stack, 'MemoryWithStreamDelivery', {
  memoryName: 'memory_with_stream_delivery',
  description: 'A memory with Kinesis stream delivery',
  expirationDuration: cdk.Duration.days(60),
  streamDeliveryResources: [{ stream }],
});

new integ.IntegTest(app, 'BedrockAgentCoreMemoryStreamDelivery', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2'],
});
