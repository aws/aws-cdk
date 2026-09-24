import { Template, Match } from '../../../../assertions';
import { CfnMemory } from '../../../../aws-bedrockagentcore';
import * as cdk from '../../../../core';
import { Memory } from '../../../lib/memory/memory';
import { MemoryStrategy } from '../../../lib/memory/memory-strategy';
import type { IndexedKey } from '../../../lib/memory/strategies/metadata-schema';
import { MetadataExtractionType, MetadataValueType } from '../../../lib/memory/strategies/metadata-schema';

function deterministicStrategy() {
  return MemoryStrategy.usingSemantic({
    strategyName: 'deterministic',
    namespaces: ['/actors/{actorId}'],
    metadataSchema: [{
      key: 'department',
      type: MetadataValueType.STRING,
      extractionType: MetadataExtractionType.STRICTLY_CONSISTENT,
    }],
  });
}

test('renders indexed keys for all metadata value types', () => {
  const stack = new cdk.Stack();
  new Memory(stack, 'Memory', {
    indexedKeys: [
      { key: 'topic', type: MetadataValueType.STRING },
      { key: 'tags', type: MetadataValueType.STRING_LIST },
      { key: 'priority', type: MetadataValueType.NUMBER },
    ],
  });
  Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Memory', {
    IndexedKeys: [
      { Key: 'topic', Type: 'STRING' },
      { Key: 'tags', Type: 'STRINGLIST' },
      { Key: 'priority', Type: 'NUMBER' },
    ],
  });
});

test('omits indexed keys by default', () => {
  const stack = new cdk.Stack();
  new Memory(stack, 'Memory', {});
  Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Memory', {
    IndexedKeys: Match.absent(),
  });
});

test.each([1, 10])('accepts %i indexed keys', count => {
  const stack = new cdk.Stack();
  const keys = Array.from({ length: count }, (_, i) => ({ key: `key${i}`, type: MetadataValueType.STRING }));
  new Memory(stack, 'Memory', { indexedKeys: keys });
  Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Memory', {
    IndexedKeys: keys.map(entry => ({ Key: entry.key, Type: 'STRING' })),
  });
});

test.each([0, 11])('fails for %i indexed keys', count => {
  expect(() => new Memory(new cdk.Stack(), 'Memory', {
    indexedKeys: Array.from({ length: count }, (_, i) => ({ key: `key${i}`, type: MetadataValueType.STRING })),
  })).toThrow(`indexedKeys must contain between 1 and 10 keys, got ${count}`);
});

test.each(['', 'a'.repeat(129), 'invalid!'])('fails for invalid indexed key %s', key => {
  expect(() => new Memory(new cdk.Stack(), 'Memory', {
    indexedKeys: [{ key, type: MetadataValueType.STRING }],
  })).toThrow(/Indexed metadata key/);
});

test('fails for duplicate indexed keys', () => {
  expect(() => new Memory(new cdk.Stack(), 'Memory', {
    indexedKeys: [
      { key: 'topic', type: MetadataValueType.STRING },
      { key: 'topic', type: MetadataValueType.NUMBER },
    ],
  })).toThrow('indexedKeys contains duplicate key "topic"');
});

test('validates strategies added after memory construction', () => {
  const stack = new cdk.Stack();
  const memory = new Memory(stack, 'Memory', {
    indexedKeys: [{ key: 'department', type: MetadataValueType.STRING }],
  });
  memory.addMemoryStrategy(deterministicStrategy());
  Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Memory', {
    IndexedKeys: [{ Key: 'department', Type: 'STRING' }],
    MemoryStrategies: [{
      SemanticMemoryStrategy: Match.objectLike({
        MemoryRecordSchema: {
          MetadataSchema: [{ Key: 'department', Type: 'STRING', ExtractionType: 'STRICTLY_CONSISTENT' }],
        },
      }),
    }],
  });
});

test('fails when a deterministic key is not indexed', () => {
  const stack = new cdk.Stack();
  const memory = new Memory(stack, 'Memory', {});
  memory.addMemoryStrategy(deterministicStrategy());
  expect(() => Template.fromStack(stack)).toThrow('STRICTLY_CONSISTENT metadata key "department" must be included in indexedKeys');
});

test('fails when a deterministic key has the wrong indexed type', () => {
  const stack = new cdk.Stack();
  new Memory(stack, 'Memory', {
    indexedKeys: [{ key: 'department', type: MetadataValueType.NUMBER }],
    memoryStrategies: [deterministicStrategy()],
  });
  expect(() => Template.fromStack(stack)).toThrow('must be indexed with type STRING');
});

test('validates reflection schemas against indexed keys', () => {
  const stack = new cdk.Stack();
  new Memory(stack, 'Memory', {
    memoryStrategies: [MemoryStrategy.usingEpisodic({
      strategyName: 'episodic',
      namespaces: ['/actors/{actorId}'],
      reflectionConfiguration: {
        namespaces: ['/actors/{actorId}'],
        metadataSchema: [{ key: 'department', extractionType: MetadataExtractionType.STRICTLY_CONSISTENT }],
      },
    })],
  });
  expect(() => Template.fromStack(stack)).toThrow('STRICTLY_CONSISTENT metadata key "department" must be included in indexedKeys');
});

test('honors indexed keys configured on the underlying L1', () => {
  const stack = new cdk.Stack();
  const memory = new Memory(stack, 'Memory', { memoryStrategies: [deterministicStrategy()] });
  const resource = memory.node.findChild('Memory');
  if (CfnMemory.isCfnMemory(resource)) {
    resource.indexedKeys = [{ key: 'department', type: 'STRING' }];
  }
  Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Memory', {
    IndexedKeys: [{ Key: 'department', Type: 'STRING' }],
  });
});

test('passes unresolved indexed key lists through to CloudFormation', () => {
  const stack = new cdk.Stack();
  const indexedKeys = cdk.Token.asAny(cdk.Lazy.any({
    produce: () => [{ key: 'department', type: 'STRING' }],
  })) as unknown as IndexedKey[];
  new Memory(stack, 'Memory', {
    indexedKeys,
    memoryStrategies: [deterministicStrategy()],
  });
  Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Memory', {
    IndexedKeys: [{ Key: 'department', Type: 'STRING' }],
  });
});

test('defers index membership checks when an indexed key name is unresolved', () => {
  const stack = new cdk.Stack();
  const key = new cdk.CfnParameter(stack, 'IndexedKey');
  new Memory(stack, 'Memory', {
    indexedKeys: [{ key: key.valueAsString, type: MetadataValueType.STRING }],
    memoryStrategies: [deterministicStrategy()],
  });
  Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Memory', {
    IndexedKeys: [{ Key: { Ref: 'IndexedKey' }, Type: 'STRING' }],
  });
});

test('defers indexed key type checks when the type is unresolved', () => {
  const stack = new cdk.Stack();
  const type = new cdk.CfnParameter(stack, 'IndexedType');
  new Memory(stack, 'Memory', {
    indexedKeys: [{ key: 'department', type: type.valueAsString as MetadataValueType }],
    memoryStrategies: [deterministicStrategy()],
  });
  Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Memory', {
    IndexedKeys: [{ Key: 'department', Type: { Ref: 'IndexedType' } }],
  });
});
