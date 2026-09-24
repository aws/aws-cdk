/*
 * Integration test for Bedrock Agent Core Memory metadata schema (MemoryRecordSchema).
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-memory-metadata-schema

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-memory-metadata-schema');

const memory = new agentcore.Memory(stack, 'MemoryWithMetadataSchema', {
  memoryName: 'memory_with_metadata_schema',
  description: 'Memory with metadata schema across managed and episodic strategies',
  expirationDuration: cdk.Duration.days(60),
  indexedKeys: [
    { key: 'department', type: agentcore.MetadataValueType.STRING },
    { key: 'topic', type: agentcore.MetadataValueType.STRING },
  ],
  memoryStrategies: [
    agentcore.MemoryStrategy.usingSemantic({
      strategyName: 'semanticWithMetadata',
      description: 'Semantic memory with metadata fields for filtering',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
      metadataSchema: [
        {
          key: 'department',
          type: agentcore.MetadataValueType.STRING,
          extractionType: agentcore.MetadataExtractionType.STRICTLY_CONSISTENT,
        },
        {
          key: 'topic',
          type: agentcore.MetadataValueType.STRING,
          extractionType: agentcore.MetadataExtractionType.LLM_INFERRED,
          extractionConfig: {
            llmExtractionConfig: {
              definition: 'The main subject of the conversation',
              llmExtractionInstruction: 'Identify the topic of the conversation',
              validation: {
                stringValidation: { allowedValues: ['billing', 'support', 'sales'] },
              },
            },
          },
        },
        {
          key: 'priority',
          type: agentcore.MetadataValueType.NUMBER,
          extractionConfig: {
            llmExtractionConfig: {
              definition: 'The priority of the request on a 0-10 scale',
              validation: { numberValidation: { minValue: 0, maxValue: 10 } },
            },
          },
        },
      ],
    }),
    agentcore.MemoryStrategy.usingEpisodic({
      strategyName: 'episodicWithDualMetadata',
      description: 'Episodic memory with separate schemas for raw and reflection records',
      namespaces: ['/strategy/{memoryStrategyId}/actor/{actorId}/session/{sessionId}'],
      metadataSchema: [
        { key: 'event_kind', type: agentcore.MetadataValueType.STRING },
      ],
      reflectionConfiguration: {
        namespaces: ['/strategy/{memoryStrategyId}/actor/{actorId}'],
        metadataSchema: [
          { key: 'reflection_topic', type: agentcore.MetadataValueType.STRING_LIST },
        ],
      },
    }),
  ],
});

const test = new integ.IntegTest(app, 'BedrockAgentCoreMemoryMetadataSchema', {
  testCases: [stack],
  // Bedrock Agent Core is only available in these regions
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2'],
});

const getMemory = test.assertions.awsApiCall('bedrock-agentcore-control', 'getMemory', {
  memoryId: memory.memoryId,
}).expect(integ.ExpectedResult.objectLike({
  memory: {
    indexedKeys: integ.Match.arrayWith([
      { key: 'department', type: 'STRING' },
    ]),
    strategies: integ.Match.arrayWith([
      integ.Match.objectLike({
        name: 'semanticWithMetadata',
        memoryRecordSchema: {
          metadataSchema: integ.Match.arrayWith([
            { key: 'department', type: 'STRING', extractionType: 'STRICTLY_CONSISTENT' },
          ]),
        },
      }),
    ]),
  },
}));

// The assertion framework derives an IAM action from the SDK client name.
// Replace that policy with the service's IAM prefix and the tested memory ARN.
const providerRole = getMemory.provider.handlerRoleArn.target;
if (cdk.CfnResource.isCfnResource(providerRole)) {
  providerRole.addPropertyOverride('Policies.0.PolicyDocument.Statement', [{
    Effect: 'Allow',
    Action: ['bedrock-agentcore:GetMemory'],
    Resource: [memory.memoryArn],
  }]);
}
