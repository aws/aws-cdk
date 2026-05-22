/*
 * Integration test for Bedrock Agent Core Memory construct
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-memory-1

import * as bedrock from '@aws-cdk/aws-bedrock-alpha';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as agentcore from '../../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-memory-1');

// Create a browser with basic configuration
new agentcore.Memory(stack, 'Memory', {
  memoryName: 'memory',
});

// Create a memory with LTM strategies (builtin) and kms key
const myEncryptionKey = new kms.Key(stack, 'MyEncryptionKey');

new agentcore.Memory(stack, 'MemoryWithBuiltinStrategies', {
  memoryName: 'memory_with_builtin_strategies',
  description: 'A test memory with built-in strategies',
  expirationDuration: cdk.Duration.days(60),
  memoryStrategies: [
    agentcore.MemoryStrategy.usingBuiltInSummarization(),
    agentcore.MemoryStrategy.usingBuiltInSemantic(),
    agentcore.MemoryStrategy.usingBuiltInUserPreference(),
  ],
  kmsKey: myEncryptionKey,
});

// Create a memory with LTM strategies (custom)
new agentcore.Memory(stack, 'MemoryWithCustomStrategies', {
  memoryName: 'memory_with_custom_strategies',
  description: 'A long term memory with consolidation',
  expirationDuration: cdk.Duration.days(60),
  memoryStrategies: [
    agentcore.MemoryStrategy.usingSemantic({
      name: 'customSemanticStrategy',
      description: 'Custom semantic memory strategy',
      namespaces: ['/custom/strategies/{memoryStrategyId}/actors/{actorId}'],
      customConsolidation: {
        model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
        appendToPrompt: 'Custom consolidation prompt for semantic memory',
      },
      customExtraction: {
        model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
        appendToPrompt: 'Custom extraction prompt for semantic memory',
      },
    }),
  ],
});

const bucket = new s3.Bucket(stack, 'MemoryBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const topic = new sns.Topic(stack, 'MemoryTopic');

// create a memory with a self managed strategy
new agentcore.Memory(stack, 'MemoryWithSelfManagedStrategy', {
  memoryName: 'memory_with_self_managed_strategy',
  description: 'A test memory with a self managed strategy',
  expirationDuration: cdk.Duration.days(60),
  memoryStrategies: [
    agentcore.MemoryStrategy.usingBuiltInSummarization(),
    agentcore.MemoryStrategy.usingSelfManaged({
      name: 'selfManagedStrategy',
      description: 'Self managed memory strategy',
      invocationConfiguration: {
        topic: topic,
        s3Location: {
          bucketName: bucket.bucketName,
          objectKey: 'memory/',
        },
      },
    }),
  ],
});

// Create a memory with built-in episodic strategy
new agentcore.Memory(stack, 'MemoryWithBuiltinEpisodicEx', {
  memoryName: 'memory_with_builtin_episodic_example',
  description: 'A test memory with built-in episodic strategy',
  expirationDuration: cdk.Duration.days(90),
  memoryStrategies: [
    agentcore.MemoryStrategy.usingBuiltInEpisodic(),
  ],
});

new integ.IntegTest(app, 'BedrockAgentCoreMemory', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2'], // Bedrock Agent Core is only available in these regions
});

app.synth();
