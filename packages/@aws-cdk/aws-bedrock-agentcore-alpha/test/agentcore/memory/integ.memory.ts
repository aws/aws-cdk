/*
 * Integration test for Bedrock Agent Core Memory construct
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-memory-1

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as agentcore from '../../../agentcore';
import * as bedrock from '@aws-cdk/aws-bedrock-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-memory-1');

// Create a browser with basic configuration
new agentcore.Memory(stack, 'Memory', {
  memoryName: 'memory',
});

// Create a memory with LTM strategies (builtin)
new agentcore.Memory(stack, 'MemoryWithBuiltinStrategies', {
  memoryName: 'memory_with_builtin_strategies',
  description: 'A test memory with built-in strategies',
  expirationDuration: cdk.Duration.days(60),
  memoryStrategies: [
    agentcore.MemoryStrategy.usingBuiltInSummarization(),
    agentcore.MemoryStrategy.usingBuiltInSemantic(),
    agentcore.MemoryStrategy.usingBuiltInUserPreference(),
  ],
});

// Create a memory with LTM strategies (custom)
new agentcore.Memory(stack, 'MemoryWithCustomStrategies', {
  memoryName: 'memory_with_custom_strategies',
  description: 'A long term memory with consolidation',
  expirationDuration: cdk.Duration.days(60),
  memoryStrategies: [
    agentcore.MemoryStrategy.usingSemanticOverride({
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

new integ.IntegTest(app, 'BedrockAgentCoreMemory', {
  testCases: [stack],
});

app.synth();
