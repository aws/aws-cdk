/*
 * Integration test for Bedrock Agent Core Memory with Stream Delivery
 */

/// !cdk-integ aws-cdk-agentcore-memory-stream-delivery

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-agentcore-memory-stream-delivery');

// Create a Kinesis Data Stream for memory event delivery
const memoryEventStream = new kinesis.Stream(stack, 'MemoryEventStream', {
  encryption: kinesis.StreamEncryption.MANAGED,
});

// Create a memory with stream delivery to Kinesis
new agentcore.Memory(stack, 'MemoryWithStreamDelivery', {
  memoryName: 'memory_with_stream_delivery',
  description: 'A test memory with Kinesis stream delivery',
  expirationDuration: cdk.Duration.days(90),
  streamDeliveryResources: [
    {
      stream: memoryEventStream,
      contentConfigurations: [
        {
          type: agentcore.StreamDeliveryContentType.MEMORY_RECORDS,
          level: agentcore.StreamDeliveryContentLevel.FULL_CONTENT,
        },
      ],
    },
  ],
});

new integ.IntegTest(app, 'MemoryStreamDelivery', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2'],
});
