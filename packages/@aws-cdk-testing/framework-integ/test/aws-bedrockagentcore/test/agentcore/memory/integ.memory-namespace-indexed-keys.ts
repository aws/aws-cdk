/*
 * Integration test for Bedrock Agent Core Memory with namespace keys and indexed keys
 *
 * Declares custom namespace variables (with and without validation rules) that a
 * strategy namespace uses, and indexed metadata keys of each type. One key of each
 * kind is added through the add methods to cover that path too.
 */

/// !cdk-integ aws-cdk-agentcore-memory-namespace-indexed-keys

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-agentcore-memory-namespace-indexed-keys');

const memory = new agentcore.Memory(stack, 'MemoryWithKeys', {
  memoryName: 'memory_with_namespace_indexed_keys',
  description: 'A test memory with namespace keys and indexed keys',
  expirationDuration: cdk.Duration.days(90),
  namespaceKeys: [
    { key: 'tenant', validation: { regexPattern: '^[a-z0-9-]+$' } },
    { key: 'env', validation: { allowedValues: ['dev', 'staging', 'prod'] } },
  ],
  indexedKeys: [
    { key: 'priority', type: agentcore.IndexedKeyType.NUMBER },
    { key: 'source', type: agentcore.IndexedKeyType.STRING },
  ],
  memoryStrategies: [
    agentcore.MemoryStrategy.usingSemantic({
      strategyName: 'tenant_facts',
      namespaces: ['/tenant/{tenant}/env/{env}/actor/{actorId}'],
    }),
  ],
});

memory.addNamespaceKey({ key: 'region' });
memory.addIndexedKey({ key: 'labels', type: agentcore.IndexedKeyType.STRINGLIST });

const test = new integ.IntegTest(app, 'MemoryNamespaceIndexedKeys', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ca-central-1', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2'],
});

// Verify the deployed memory reports the declared keys back
const getMemory = test.assertions.awsApiCall('bedrock-agentcore-control', 'getMemory', {
  memoryId: memory.memoryId,
}).expect(integ.ExpectedResult.objectLike({
  memory: {
    namespaceKeys: integ.Match.arrayWith([
      integ.Match.objectLike({ key: 'tenant', validation: { regexPattern: '^[a-z0-9-]+$' } }),
      integ.Match.objectLike({ key: 'env', validation: { allowedValues: ['dev', 'staging', 'prod'] } }),
      integ.Match.objectLike({ key: 'region' }),
    ]),
    indexedKeys: integ.Match.arrayWith([
      { key: 'priority', type: 'NUMBER' },
      { key: 'source', type: 'STRING' },
      { key: 'labels', type: 'STRINGLIST' },
    ]),
  },
}));

// The IAM action prefix (bedrock-agentcore) differs from the SDK client name
// (bedrock-agentcore-control), so grant the assertion provider explicitly
getMemory.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['bedrock-agentcore:GetMemory'],
  Resource: ['*'],
});
