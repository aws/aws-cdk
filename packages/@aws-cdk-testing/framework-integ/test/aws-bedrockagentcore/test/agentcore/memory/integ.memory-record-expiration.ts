/*
 * Integration test for record expiration on Bedrock AgentCore Memory managed strategies
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-memory-record-expiration

import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-memory-record-expiration');

// Built-in strategy format
new agentcore.Memory(stack, 'MemoryWithBuiltInFormat', {
  memoryName: 'memory_record_expiry_builtin',
  memoryStrategies: [
    agentcore.MemoryStrategy.usingSemantic({
      strategyName: 'semanticStrategy',
      namespaces: ['/semantic/{actorId}'],
      recordExpirationDuration: cdk.Duration.days(90),
    }),
    agentcore.MemoryStrategy.usingUserPreference({
      strategyName: 'preferenceStrategy',
      namespaces: ['/preferences/{actorId}'],
      recordExpirationDuration: cdk.Duration.days(90),
    }),
    agentcore.MemoryStrategy.usingSummarization({
      strategyName: 'summaryStrategy',
      namespaces: ['/summaries/{actorId}/{sessionId}'],
      recordExpirationDuration: cdk.Duration.days(180),
    }),
  ],
});

// Episodic strategy with reflection
new agentcore.Memory(stack, 'MemoryWithEpisodicReflection', {
  memoryName: 'memory_record_expiry_episodic',
  memoryStrategies: [
    agentcore.MemoryStrategy.usingEpisodic({
      strategyName: 'episodicStrategy',
      namespaces: ['/episodes/{actorId}/{sessionId}'],
      reflectionConfiguration: {
        namespaces: ['/episodes/{actorId}'],
      },
      recordExpirationDuration: cdk.Duration.days(31),
    }),
  ],
});

// Built-in strategy with overrides
new agentcore.Memory(stack, 'MemoryWithOverrides', {
  memoryName: 'memory_record_expiry_override',
  memoryStrategies: [
    agentcore.MemoryStrategy.usingSemantic({
      strategyName: 'customSemanticStrategy',
      namespaces: ['/custom/{actorId}'],
      customExtraction: {
        model: bedrock.FoundationModel.fromFoundationModelId(stack, 'ExtractionModel', bedrock.FoundationModelIdentifier.ANTHROPIC_CLAUDE_3_SONNET_20240229_V1_0),
        appendToPrompt: 'Custom extraction prompt for semantic memory',
      },
      recordExpirationDuration: cdk.Duration.days(365),
    }),
  ],
});

new integ.IntegTest(app, 'BedrockAgentCoreMemoryRecordExpiration', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2'], // Bedrock Agent Core is only available in these regions
});
