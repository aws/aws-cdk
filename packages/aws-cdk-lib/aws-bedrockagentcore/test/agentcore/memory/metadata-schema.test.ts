import { Template, Match } from '../../../../assertions';
import { FoundationModel, FoundationModelIdentifier } from '../../../../aws-bedrock';
import * as sns from '../../../../aws-sns';
import { Duration } from '../../../../core';
import * as cdk from '../../../../core';
import { Memory } from '../../../lib/memory/memory';
import { MemoryStrategy } from '../../../lib/memory/memory-strategy';
import { MetadataValueType } from '../../../lib/memory/strategies/metadata-schema';

const TEST_STACK = new cdk.Stack(new cdk.App(), 'ModelStack');
const TEST_MODEL = FoundationModel.fromFoundationModelId(
  TEST_STACK,
  'TestModel',
  FoundationModelIdentifier.ANTHROPIC_CLAUDE_SONNET_4_6,
);

function newStack(id = 'test-stack'): cdk.Stack {
  return new cdk.Stack(new cdk.App(), id, {
    env: { account: '123456789012', region: 'us-east-1' },
  });
}

describe('Memory metadata schema on built-in managed strategies', () => {
  test('renders MemoryRecordSchema directly under the strategy property', () => {
    const stack = newStack();

    new Memory(stack, 'test-memory', {
      memoryName: 'memory_with_metadata',
      expirationDuration: Duration.days(90),
      memoryStrategies: [
        MemoryStrategy.usingSemantic({
          strategyName: 'semantic_with_metadata',
          namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
          metadataSchema: [
            {
              key: 'topic',
              type: MetadataValueType.STRING,
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
            { key: 'priority', type: MetadataValueType.NUMBER },
          ],
        }),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      MemoryStrategies: Match.arrayWith([
        {
          SemanticMemoryStrategy: Match.objectLike({
            Name: 'semantic_with_metadata',
            MemoryRecordSchema: {
              MetadataSchema: [
                {
                  Key: 'topic',
                  Type: 'STRING',
                  ExtractionConfig: {
                    LlmExtractionConfig: {
                      Definition: 'The main subject of the conversation',
                      LlmExtractionInstruction: 'Identify the topic of the conversation',
                      Validation: {
                        StringValidation: { AllowedValues: ['billing', 'support', 'sales'] },
                      },
                    },
                  },
                },
                { Key: 'priority', Type: 'NUMBER' },
              ],
            },
          }),
        },
      ]),
    });
  });

  test('omits MemoryRecordSchema when no entries are provided (backward compatible)', () => {
    const stack = newStack();

    new Memory(stack, 'test-memory', {
      memoryName: 'memory_no_metadata',
      memoryStrategies: [MemoryStrategy.usingBuiltInSemantic()],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      MemoryStrategies: [
        {
          SemanticMemoryStrategy: {
            Name: 'semantic_builtin_cdkGen0001',
            Description: 'Extract general factual knowledge, concepts and meanings from raw conversations in a context-independent format.',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
            MemoryRecordSchema: Match.absent(),
          },
        },
      ],
    });
  });
});

describe('Memory metadata schema on custom (override) managed strategies', () => {
  test('renders MemoryRecordSchema directly under CustomMemoryStrategy', () => {
    const stack = newStack();

    new Memory(stack, 'test-memory', {
      memoryName: 'memory_override_metadata',
      memoryStrategies: [
        MemoryStrategy.usingSemantic({
          strategyName: 'override_with_metadata',
          namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
          customExtraction: { model: TEST_MODEL, appendToPrompt: 'extract' },
          metadataSchema: [{ key: 'sentiment', type: MetadataValueType.STRING }],
        }),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      MemoryStrategies: Match.arrayWith([
        {
          CustomMemoryStrategy: Match.objectLike({
            Name: 'override_with_metadata',
            MemoryRecordSchema: {
              MetadataSchema: [{ Key: 'sentiment', Type: 'STRING' }],
            },
          }),
        },
      ]),
    });
  });
});

describe('Memory metadata schema on episodic strategies', () => {
  test('renders independent schemas for strategy and reflection', () => {
    const stack = newStack();

    new Memory(stack, 'test-memory', {
      memoryName: 'memory_episodic_dual_metadata',
      memoryStrategies: [
        MemoryStrategy.usingEpisodic({
          strategyName: 'episodic_dual_schema',
          namespaces: ['/strategy/{memoryStrategyId}/actor/{actorId}/session/{sessionId}'],
          metadataSchema: [{ key: 'event_kind', type: MetadataValueType.STRING }],
          reflectionConfiguration: {
            namespaces: ['/strategy/{memoryStrategyId}/actor/{actorId}'],
            metadataSchema: [{ key: 'reflection_topic', type: MetadataValueType.STRING_LIST }],
          },
        }),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      MemoryStrategies: Match.arrayWith([
        {
          EpisodicMemoryStrategy: Match.objectLike({
            Name: 'episodic_dual_schema',
            MemoryRecordSchema: {
              MetadataSchema: [{ Key: 'event_kind', Type: 'STRING' }],
            },
            ReflectionConfiguration: {
              Namespaces: ['/strategy/{memoryStrategyId}/actor/{actorId}'],
              MemoryRecordSchema: {
                MetadataSchema: [{ Key: 'reflection_topic', Type: 'STRINGLIST' }],
              },
            },
          }),
        },
      ]),
    });
  });

  test('omits both schemas when not provided', () => {
    const stack = newStack();

    new Memory(stack, 'test-memory', {
      memoryName: 'memory_episodic_no_metadata',
      memoryStrategies: [MemoryStrategy.usingBuiltInEpisodic()],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      MemoryStrategies: [
        {
          EpisodicMemoryStrategy: {
            Name: 'episodic_builtin_cdkGen0001',
            Description: 'Captures meaningful slices of user and system interactions.',
            Namespaces: ['/strategy/{memoryStrategyId}/actor/{actorId}/session/{sessionId}'],
            MemoryRecordSchema: Match.absent(),
            ReflectionConfiguration: {
              Namespaces: ['/strategy/{memoryStrategyId}/actor/{actorId}'],
              MemoryRecordSchema: Match.absent(),
            },
          },
        },
      ],
    });
  });
});

describe('Memory metadata schema on self-managed strategy', () => {
  test('renders MemoryRecordSchema under CustomMemoryStrategy', () => {
    const stack = newStack();
    const topic = new sns.Topic(stack, 'TriggerTopic');

    new Memory(stack, 'test-memory', {
      memoryName: 'memory_self_managed_metadata',
      memoryStrategies: [
        MemoryStrategy.usingSelfManaged({
          strategyName: 'self_managed_with_metadata',
          invocationConfiguration: {
            topic,
            s3Location: { bucketName: 'my-bucket', objectKey: 'prefix/' },
          },
          metadataSchema: [
            {
              key: 'channel',
              type: MetadataValueType.STRING,
              extractionConfig: {
                llmExtractionConfig: { definition: 'The communication channel' },
              },
            },
          ],
        }),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      MemoryStrategies: Match.arrayWith([
        {
          CustomMemoryStrategy: Match.objectLike({
            Name: 'self_managed_with_metadata',
            Type: 'CUSTOM',
            MemoryRecordSchema: {
              MetadataSchema: [
                {
                  Key: 'channel',
                  Type: 'STRING',
                  ExtractionConfig: {
                    LlmExtractionConfig: { Definition: 'The communication channel' },
                  },
                },
              ],
            },
          }),
        },
      ]),
    });
  });
});

describe('Memory metadata schema validation', () => {
  test('rejects empty metadata schema arrays', () => {
    expect(() =>
      MemoryStrategy.usingSemantic({
        strategyName: 'invalid',
        namespaces: ['/n'],
        metadataSchema: [],
      }),
    ).toThrow(/between 1 and 20 entries/);
  });

  test('rejects more than 20 entries', () => {
    const tooMany = Array.from({ length: 21 }, (_, i) => ({ key: `k${i}` }));
    expect(() =>
      MemoryStrategy.usingSemantic({
        strategyName: 'invalid',
        namespaces: ['/n'],
        metadataSchema: tooMany,
      }),
    ).toThrow(/between 1 and 20 entries/);
  });

  test('rejects keys exceeding 128 characters', () => {
    expect(() =>
      MemoryStrategy.usingSemantic({
        strategyName: 'invalid',
        namespaces: ['/n'],
        metadataSchema: [{ key: 'a'.repeat(129) }],
      }),
    ).toThrow(/Metadata schema entry key.*128/);
  });

  test('rejects keys with characters outside the allowed pattern', () => {
    expect(() =>
      MemoryStrategy.usingSemantic({
        strategyName: 'invalid',
        namespaces: ['/n'],
        metadataSchema: [{ key: 'bad key!' }],
      }),
    ).toThrow(/does not match the required pattern/);
  });

  test('rejects empty LLM extraction definitions', () => {
    expect(() =>
      MemoryStrategy.usingSemantic({
        strategyName: 'invalid',
        namespaces: ['/n'],
        metadataSchema: [
          {
            key: 'k',
            extractionConfig: { llmExtractionConfig: { definition: '' } },
          },
        ],
      }),
    ).toThrow(/definition must not be empty/);
  });

  test('rejects number validation when minValue > maxValue', () => {
    expect(() =>
      MemoryStrategy.usingSemantic({
        strategyName: 'invalid',
        namespaces: ['/n'],
        metadataSchema: [
          {
            key: 'score',
            type: MetadataValueType.NUMBER,
            extractionConfig: {
              llmExtractionConfig: {
                definition: 'd',
                validation: { numberValidation: { minValue: 10, maxValue: 5 } },
              },
            },
          },
        ],
      }),
    ).toThrow(/minValue.*must be less than or equal to maxValue/);
  });

  test('rejects negative maxItems on string list validation', () => {
    expect(() =>
      MemoryStrategy.usingSemantic({
        strategyName: 'invalid',
        namespaces: ['/n'],
        metadataSchema: [
          {
            key: 'tags',
            type: MetadataValueType.STRING_LIST,
            extractionConfig: {
              llmExtractionConfig: {
                definition: 'd',
                validation: { stringListValidation: { maxItems: -1 } },
              },
            },
          },
        ],
      }),
    ).toThrow(/maxItems must be non-negative/);
  });

  test('also validates the reflection metadata schema on episodic', () => {
    expect(() =>
      MemoryStrategy.usingEpisodic({
        strategyName: 'invalid',
        namespaces: ['/strategy/{memoryStrategyId}/actor/{actorId}/session/{sessionId}'],
        reflectionConfiguration: {
          namespaces: ['/strategy/{memoryStrategyId}/actor/{actorId}'],
          metadataSchema: [{ key: 'bad key!' }],
        },
      }),
    ).toThrow(/does not match the required pattern/);
  });

  test('skips array length validation when the schema is an unresolved token', () => {
    const tokenSchema = cdk.Token.asAny([]) as any;
    expect(() =>
      MemoryStrategy.usingSemantic({
        strategyName: 'token_schema',
        namespaces: ['/n'],
        metadataSchema: tokenSchema,
      }),
    ).not.toThrow();
  });

  test('renders an unresolved token schema through to the template without crashing', () => {
    const stack = newStack();
    const tokenSchema = cdk.Token.asAny([{ key: 'from_token', type: 'STRING' }]) as any;

    new Memory(stack, 'test-memory', {
      memoryName: 'memory_token_schema',
      memoryStrategies: [
        MemoryStrategy.usingSemantic({
          strategyName: 'token_schema',
          namespaces: ['/n'],
          metadataSchema: tokenSchema,
        }),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      MemoryStrategies: Match.arrayWith([
        {
          SemanticMemoryStrategy: Match.objectLike({
            MemoryRecordSchema: {
              MetadataSchema: [{ Key: 'from_token', Type: 'STRING' }],
            },
          }),
        },
      ]),
    });
  });

  test('rejects duplicate metadata schema keys', () => {
    expect(() =>
      MemoryStrategy.usingSemantic({
        strategyName: 'invalid',
        namespaces: ['/n'],
        metadataSchema: [{ key: 'same' }, { key: 'same' }],
      }),
    ).toThrow(/duplicate key "same"/);
  });

  test('rejects an empty validation object', () => {
    expect(() =>
      MemoryStrategy.usingSemantic({
        strategyName: 'invalid',
        namespaces: ['/n'],
        metadataSchema: [
          {
            key: 'k',
            extractionConfig: { llmExtractionConfig: { definition: 'd', validation: {} } },
          },
        ],
      }),
    ).toThrow(/must set exactly one of stringValidation, stringListValidation or numberValidation, got none/);
  });

  test('rejects multiple validation types on one entry', () => {
    expect(() =>
      MemoryStrategy.usingSemantic({
        strategyName: 'invalid',
        namespaces: ['/n'],
        metadataSchema: [
          {
            key: 'k',
            extractionConfig: {
              llmExtractionConfig: {
                definition: 'd',
                validation: {
                  stringValidation: { allowedValues: ['x'] },
                  numberValidation: { minValue: 0, maxValue: 5 },
                },
              },
            },
          },
        ],
      }),
    ).toThrow(/got stringValidation, numberValidation/);
  });

  test('rejects a validation type that does not match the declared entry type', () => {
    expect(() =>
      MemoryStrategy.usingSemantic({
        strategyName: 'invalid',
        namespaces: ['/n'],
        metadataSchema: [
          {
            key: 'priority',
            type: MetadataValueType.NUMBER,
            extractionConfig: {
              llmExtractionConfig: {
                definition: 'd',
                validation: { stringValidation: { allowedValues: ['a'] } },
              },
            },
          },
        ],
      }),
    ).toThrow(/must use numberValidation to match the entry type NUMBER, got stringValidation/);
  });

  test('rejects an undefined LLM extraction definition with a clean error', () => {
    expect(() =>
      MemoryStrategy.usingSemantic({
        strategyName: 'invalid',
        namespaces: ['/n'],
        metadataSchema: [
          {
            key: 'k',
            extractionConfig: { llmExtractionConfig: { definition: undefined } as any },
          },
        ],
      }),
    ).toThrow(/definition must not be empty/);
  });
});
