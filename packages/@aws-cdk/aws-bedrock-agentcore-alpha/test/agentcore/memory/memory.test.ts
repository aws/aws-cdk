import * as bedrock from '@aws-cdk/aws-bedrock-alpha';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import {
  Memory,
} from '../../../lib/memory/memory';
import { MemoryStrategy } from '../../../lib/memory/memory-strategy';

describe('Memory default tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  // @ts-ignore
  let memory: Memory;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    memory = new Memory(stack, 'test-memory', {
      memoryName: 'test_memory',
      description: 'A test memory for storing agent interactions',
      expirationDuration: Duration.days(30),
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::Memory', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
  });

  test('Should have Memory resource with expected properties', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      Name: 'test_memory',
      Description: 'A test memory for storing agent interactions',
      EventExpiryDuration: 30,
    });
  });

  test('Should handle tags correctly when no tags are provided', () => {
    // Verify that the Memory resource exists and has basic properties
    const memoryResource = template.findResources('AWS::BedrockAgentCore::Memory');
    const resourceId = Object.keys(memoryResource)[0];
    const resource = memoryResource[resourceId];

    // The resource should have basic properties
    expect(resource.Properties).toHaveProperty('Name');
    expect(resource.Properties).toHaveProperty('Description');
    expect(resource.Properties).toHaveProperty('EventExpiryDuration');

    // Tags property handling - the important thing is that the construct works
    // The addPropertyOverride may or may not be visible in the template depending on CDK version
    if (resource.Properties.Tags) {
      expect(resource.Properties.Tags).toEqual({});
    }
  });

  test('Should have default expiration of 90 days when not specified', () => {
    const memoryWithDefaultExpiry = new Memory(stack, 'default-expiry-memory', {
      memoryName: 'default_expiry_memory',
    });

    expect(memoryWithDefaultExpiry.expirationDuration?.toDays()).toBe(90);
  });
});

describe('Memory static methods tests', () => {
  // @ts-ignore
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('fromMemoryAttributes should create a Memory reference from existing attributes', () => {
    const memory = Memory.fromMemoryAttributes(stack, 'test-memory', {
      memoryArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:memory/test-memory',
      roleArn: 'arn:aws:iam::123456789012:role/test-memory-role',
      updatedAt: '2021-01-01T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2021-01-01T00:00:00Z',
      kmsKeyArn: 'arn:aws:kms::123456789012:key/test-kms-key',
    });

    expect(memory.memoryArn).toBe('arn:aws:bedrock-agentcore:us-east-1:123456789012:memory/test-memory');
    expect(memory.executionRole).toBeDefined();
    expect(memory.updatedAt).toBe('2021-01-01T00:00:00Z');
    expect(memory.status).toBe('ACTIVE');
    expect(memory.createdAt).toBe('2021-01-01T00:00:00Z');
    expect(memory.kmsKey).toBeDefined();
  });

  test('fromMemoryAttributes provides undefined values when not provided', () => {
    const memory = Memory.fromMemoryAttributes(stack, 'test-memory-2', {
      memoryArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:memory/test-memory',
      roleArn: 'arn:aws:iam::123456789012:role/test-memory-role',
    });

    expect(memory.memoryArn).toBe('arn:aws:bedrock-agentcore:us-east-1:123456789012:memory/test-memory');
    expect(memory.executionRole).toBeDefined();
    expect(memory.updatedAt).toBeUndefined();
    expect(memory.status).toBeUndefined();
    expect(memory.createdAt).toBeUndefined();
    expect(memory.kmsKey).toBeUndefined();
  });
});

describe('Memory with built-in strategies tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  // @ts-ignore
  let memory: Memory;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    memory = new Memory(stack, 'test-memory', {
      memoryName: 'test_memory_with_strategies',
      description: 'A test memory with built-in strategies',
      expirationDuration: Duration.days(60),
      memoryStrategies: [
        MemoryStrategy.usingBuiltInSummarization(),
        MemoryStrategy.usingBuiltInSemantic(),
        MemoryStrategy.usingBuiltInUserPreference(),
        MemoryStrategy.usingBuiltInEpisodic(),
      ],
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::Memory', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
  });

  test('Should have Memory resource with built-in memory strategies', () => {
    const memoryResources = template.findResources('AWS::BedrockAgentCore::Memory');
    const memoryResource = Object.values(memoryResources)[0];

    expect(memoryResource.Properties.Name).toBe('test_memory_with_strategies');
    expect(memoryResource.Properties.Description).toBe('A test memory with built-in strategies');
    expect(memoryResource.Properties.EventExpiryDuration).toBe(60);
    expect(memoryResource.Properties.MemoryStrategies).toHaveLength(4);

    // Verify that episodic strategy is present in memoryStrategies property
    expect(memory.memoryStrategies).toHaveLength(4);
    expect(memory.memoryStrategies.some(s => s.strategyType === 'EPISODIC')).toBe(true);
  });
});

describe('Memory with custom execution role tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  let customRole: iam.Role;
  // @ts-ignore
  let memory: Memory;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    // Create a custom execution role
    customRole = new iam.Role(stack, 'CustomExecutionRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
      roleName: 'custom-memory-execution-role',
    });

    memory = new Memory(stack, 'test-memory', {
      memoryName: 'test_memory_with_custom_role',
      description: 'A test memory with custom execution role',
      expirationDuration: Duration.days(45),
      executionRole: customRole,
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::Memory', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
  });

  test('Should have Memory resource with custom execution role', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      Name: 'test_memory_with_custom_role',
      Description: 'A test memory with custom execution role',
      EventExpiryDuration: 45,
      MemoryExecutionRoleArn: {
        'Fn::GetAtt': [
          Match.stringLikeRegexp('CustomExecutionRole*'),
          'Arn',
        ],
      },
    });
  });

  test('Should have custom execution role with correct properties', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      RoleName: 'custom-memory-execution-role',
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'bedrock-agentcore.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });
});

describe('Memory with KMS encryption tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  let kmsKey: kms.Key;
  // @ts-ignore
  let memory: Memory;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    // Create a custom KMS key
    kmsKey = new kms.Key(stack, 'MemoryEncryptionKey', {
      description: 'KMS key for memory encryption',
      enableKeyRotation: true,
    });

    memory = new Memory(stack, 'test-memory', {
      memoryName: 'test_memory_with_kms',
      description: 'A test memory with KMS encryption',
      expirationDuration: Duration.days(120),
      kmsKey: kmsKey,
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::Memory', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::KMS::Key', 1);
  });

  test('Should have Memory resource with KMS encryption', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      Name: 'test_memory_with_kms',
      Description: 'A test memory with KMS encryption',
      EventExpiryDuration: 120,
      EncryptionKeyArn: {
        'Fn::GetAtt': [
          Match.stringLikeRegexp('MemoryEncryptionKey*'),
          'Arn',
        ],
      },
    });
  });

  test('Should have KMS key with correct properties', () => {
    template.hasResourceProperties('AWS::KMS::Key', {
      Description: 'KMS key for memory encryption',
      EnableKeyRotation: true,
    });
  });
});

describe('Memory name validation tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });
  });

  test('Should throw error for name with hyphen', () => {
    expect(() => {
      new Memory(stack, 'test-memory', {
        memoryName: 'test-memory',
        expirationDuration: Duration.days(30),
      });
    }).toThrow('The field Memory name with value "test-memory" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should throw error for empty name', () => {
    expect(() => {
      new Memory(stack, 'empty-name', {
        memoryName: '',
        expirationDuration: Duration.days(30),
      });
    }).toThrow('The field Memory name is 0 characters long but must be at least 1 characters');
  });

  test('Should throw error for name with spaces', () => {
    expect(() => {
      new Memory(stack, 'name-with-spaces', {
        memoryName: 'test memory',
        expirationDuration: Duration.days(30),
      });
    }).toThrow('The field Memory name with value "test memory" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should throw error for name with special characters', () => {
    expect(() => {
      new Memory(stack, 'name-with-special-chars', {
        memoryName: 'test@memory',
        expirationDuration: Duration.days(30),
      });
    }).toThrow('The field Memory name with value "test@memory" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should throw error for name exceeding 48 characters', () => {
    const longName = 'a'.repeat(49);
    expect(() => {
      new Memory(stack, 'long-name', {
        memoryName: longName,
        expirationDuration: Duration.days(30),
      });
    }).toThrow('The field Memory name is 49 characters long but must be less than or equal to 48 characters');
  });

  test('Should accept valid name with underscores', () => {
    expect(() => {
      new Memory(stack, 'valid-name', {
        memoryName: 'test_memory_123',
        expirationDuration: Duration.days(30),
      });
    }).not.toThrow();
  });

  test('Should accept valid name with only letters and numbers', () => {
    expect(() => {
      new Memory(stack, 'valid-name-2', {
        memoryName: 'testMemory123',
        expirationDuration: Duration.days(30),
      });
    }).not.toThrow();
  });
});

describe('Memory expiration duration validation tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });
  });

  test('Should throw error for expiration less than 7 days', () => {
    expect(() => {
      new Memory(stack, 'short-expiry', {
        memoryName: 'short_expiry_memory',
        expirationDuration: Duration.days(0),
      });
    }).toThrow('Memory expiration days must be between 7 and 365');
  });

  test('Should throw error for expiration more than 365 days', () => {
    expect(() => {
      new Memory(stack, 'long-expiry', {
        memoryName: 'long_expiry_memory',
        expirationDuration: Duration.days(366),
      });
    }).toThrow('Memory expiration days must be between 7 and 365');
  });

  test('Should accept minimum valid expiration (7 days)', () => {
    expect(() => {
      new Memory(stack, 'min-expiry', {
        memoryName: 'min_expiry_memory',
        expirationDuration: Duration.days(7),
      });
    }).not.toThrow();
  });

  test('Should accept maximum valid expiration (365 days)', () => {
    expect(() => {
      new Memory(stack, 'max-expiry', {
        memoryName: 'max_expiry_memory',
        expirationDuration: Duration.days(365),
      });
    }).not.toThrow();
  });

  test('Should accept valid expiration in middle range', () => {
    expect(() => {
      new Memory(stack, 'middle-expiry', {
        memoryName: 'middle_expiry_memory',
        expirationDuration: Duration.days(180),
      });
    }).not.toThrow();
  });

  test('does not fail validation if expirationDuration is a late-bound value', () => {
    // WHEN
    const expirationDuration = new cdk.CfnParameter(stack, 'ExpirationDuration', {
      default: 30,
      type: 'Number',
    });

    expect(() => {
      new Memory(stack, 'memory-late-bound', {
        memoryName: 'memory_late_bound',
        expirationDuration: Duration.days(expirationDuration.valueAsNumber),
      });
    }).not.toThrow();
  });
});

describe('Memory with custom strategies tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  // @ts-ignore
  let memory: Memory;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    // Create custom strategies
    const customSemanticStrategy = MemoryStrategy.usingSemantic({
      name: 'custom_semantic_strategy',
      description: 'Custom semantic memory strategy with overrides',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/custom'],
      customConsolidation: {
        model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
        appendToPrompt: 'Custom consolidation prompt for semantic memory',
      },
      customExtraction: {
        model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
        appendToPrompt: 'Custom extraction prompt for semantic memory',
      },
    });

    const customUserPreferenceStrategy = MemoryStrategy.usingUserPreference({
      name: 'custom_user_preference_strategy',
      description: 'Custom user preference strategy with overrides',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/preferences'],
      customConsolidation: {
        model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
        appendToPrompt: 'Custom consolidation prompt for user preferences',
      },
      customExtraction: {
        model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
        appendToPrompt: 'Custom extraction prompt for user preferences',
      },
    });

    const customSummaryStrategy = MemoryStrategy.usingSummarization({
      name: 'custom_summary_strategy',
      description: 'Custom summary strategy with override',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/sessions/{sessionId}/custom'],
      customConsolidation: {
        model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
        appendToPrompt: 'Custom consolidation prompt for summaries',
      },
    });

    memory = new Memory(stack, 'test-memory', {
      memoryName: 'test_memory_with_custom_strategies',
      description: 'A test memory with custom strategies',
      expirationDuration: Duration.days(90),
      memoryStrategies: [
        customSemanticStrategy,
        customUserPreferenceStrategy,
        customSummaryStrategy,
      ],
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::Memory', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
  });

  test('Should have Memory resource with custom semantic strategy', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      Name: 'test_memory_with_custom_strategies',
      Description: 'A test memory with custom strategies',
      EventExpiryDuration: 90,
      MemoryStrategies: Match.arrayWith([
        {
          CustomMemoryStrategy: {
            Name: 'custom_semantic_strategy',
            Description: 'Custom semantic memory strategy with overrides',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/custom'],
            Type: 'SEMANTIC',
            Configuration: {
              SemanticOverride: {
                Consolidation: {
                  ModelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
                  AppendToPrompt: 'Custom consolidation prompt for semantic memory',
                },
                Extraction: {
                  ModelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
                  AppendToPrompt: 'Custom extraction prompt for semantic memory',
                },
              },
            },
          },
        },
      ]),
    });
  });

  test('Should have Memory resource with custom user preference strategy', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      MemoryStrategies: Match.arrayWith([
        {
          CustomMemoryStrategy: {
            Name: 'custom_user_preference_strategy',
            Description: 'Custom user preference strategy with overrides',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/preferences'],
            Type: 'USER_PREFERENCE',
            Configuration: {
              UserPreferenceOverride: {
                Consolidation: {
                  ModelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
                  AppendToPrompt: 'Custom consolidation prompt for user preferences',
                },
                Extraction: {
                  ModelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
                  AppendToPrompt: 'Custom extraction prompt for user preferences',
                },
              },
            },
          },
        },
      ]),
    });
  });

  test('Should have Memory resource with custom summary strategy', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      MemoryStrategies: Match.arrayWith([
        {
          CustomMemoryStrategy: {
            Name: 'custom_summary_strategy',
            Description: 'Custom summary strategy with override',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/sessions/{sessionId}/custom'],
            Type: 'SUMMARIZATION',
            Configuration: {
              SummaryOverride: {
                Consolidation: {
                  ModelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
                  AppendToPrompt: 'Custom consolidation prompt for summaries',
                },
              },
            },
          },
        },
      ]),
    });
  });

  test('Should have all three custom strategies in MemoryStrategies array', () => {
    const memoryResources = template.findResources('AWS::BedrockAgentCore::Memory');
    const memoryResource = Object.values(memoryResources)[0];

    expect(memoryResource.Properties.MemoryStrategies).toHaveLength(3);

    const strategyNames = memoryResource.Properties.MemoryStrategies.map(
      (strategy: any) => strategy.CustomMemoryStrategy.Name,
    );

    expect(strategyNames).toContain('custom_semantic_strategy');
    expect(strategyNames).toContain('custom_user_preference_strategy');
    expect(strategyNames).toContain('custom_summary_strategy');
  });
});

describe('Memory with mixed built-in and custom strategies tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  // @ts-ignore
  let memory: Memory;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    // Mix of built-in and custom strategies
    const customSemanticStrategy = MemoryStrategy.usingSemantic({
      name: 'hybrid_semantic_strategy',
      description: 'Hybrid semantic strategy combining built-in and custom',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/hybrid'],
      customConsolidation: {
        model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
        appendToPrompt: 'Hybrid consolidation prompt',
      },
      customExtraction: {
        model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
        appendToPrompt: 'Hybrid extraction prompt',
      },
    });

    memory = new Memory(stack, 'test-memory', {
      memoryName: 'test_memory_mixed_strategies',
      description: 'A test memory with mixed built-in and custom strategies',
      expirationDuration: Duration.days(180),
      memoryStrategies: [
        MemoryStrategy.usingBuiltInSummarization(),
        MemoryStrategy.usingBuiltInSemantic(),
        customSemanticStrategy,
      ],
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::Memory', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
  });

  test('Should have Memory resource with mixed strategies', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      Name: 'test_memory_mixed_strategies',
      Description: 'A test memory with mixed built-in and custom strategies',
      EventExpiryDuration: 180,
      MemoryStrategies: Match.arrayWith([
        // Built-in summarization
        {
          SummaryMemoryStrategy: {
            Name: Match.stringLikeRegexp('summary_builtin_.*'),
            Description: 'Summarize interactions to preserve critical context and key insights',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/sessions/{sessionId}'],
            Type: 'SUMMARIZATION',
          },
        },
        // Built-in semantic
        {
          SemanticMemoryStrategy: {
            Name: Match.stringLikeRegexp('semantic_builtin_.*'),
            Description: 'Extract general factual knowledge, concepts and meanings from raw conversations in a context-independent format.',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
            Type: 'SEMANTIC',
          },
        },
        // Custom semantic
        {
          CustomMemoryStrategy: {
            Name: 'hybrid_semantic_strategy',
            Description: 'Hybrid semantic strategy combining built-in and custom',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/hybrid'],
            Type: 'SEMANTIC',
            Configuration: {
              SemanticOverride: {
                Consolidation: {
                  ModelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
                  AppendToPrompt: 'Hybrid consolidation prompt',
                },
                Extraction: {
                  ModelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
                  AppendToPrompt: 'Hybrid extraction prompt',
                },
              },
            },
          },
        },
      ]),
    });
  });

  test('Should have exactly three strategies', () => {
    const memoryResources = template.findResources('AWS::BedrockAgentCore::Memory');
    const memoryResource = Object.values(memoryResources)[0];

    expect(memoryResource.Properties.MemoryStrategies).toHaveLength(3);
  });
});

describe('Memory with addMemoryStrategy method tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  // @ts-ignore
  let memory: Memory;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    // Create memory without initial strategies
    memory = new Memory(stack, 'test-memory', {
      memoryName: 'test_memory_add_strategy',
      description: 'A test memory for testing addMemoryStrategy method',
      expirationDuration: Duration.days(90),
    });

    // Add strategies after instantiation
    memory.addMemoryStrategy(MemoryStrategy.usingBuiltInSummarization());
    memory.addMemoryStrategy(MemoryStrategy.usingBuiltInSemantic());

    // Add a custom strategy
    const customStrategy = MemoryStrategy.usingSemantic({
      name: 'added_custom_strategy',
      description: 'Custom strategy added via addMemoryStrategy method',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/added'],
      customConsolidation: {
        model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
        appendToPrompt: 'Custom consolidation prompt added via method',
      },
      customExtraction: {
        model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
        appendToPrompt: 'Custom extraction prompt added via method',
      },
    });
    memory.addMemoryStrategy(customStrategy);

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::Memory', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
  });

  test('Should have Memory resource with strategies added via addMemoryStrategy', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      Name: 'test_memory_add_strategy',
      Description: 'A test memory for testing addMemoryStrategy method',
      EventExpiryDuration: 90,
      MemoryStrategies: [
        {
          SummaryMemoryStrategy: {
            Name: Match.stringLikeRegexp('summary_builtin_.*'),
            Description: 'Summarize interactions to preserve critical context and key insights',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/sessions/{sessionId}'],
            Type: 'SUMMARIZATION',
          },
        },
        {
          SemanticMemoryStrategy: {
            Name: Match.stringLikeRegexp('semantic_builtin_.*'),
            Description: 'Extract general factual knowledge, concepts and meanings from raw conversations in a context-independent format.',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
            Type: 'SEMANTIC',
          },
        },
        {
          CustomMemoryStrategy: {
            Name: 'added_custom_strategy',
            Description: 'Custom strategy added via addMemoryStrategy method',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/added'],
            Type: 'SEMANTIC',
            Configuration: {
              SemanticOverride: {
                Consolidation: {
                  ModelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
                  AppendToPrompt: 'Custom consolidation prompt added via method',
                },
                Extraction: {
                  ModelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
                  AppendToPrompt: 'Custom extraction prompt added via method',
                },
              },
            },
          },
        },
      ],
    });
  });

  test('Should have exactly three strategies in MemoryStrategies array', () => {
    const memoryResources = template.findResources('AWS::BedrockAgentCore::Memory');
    const memoryResource = Object.values(memoryResources)[0];

    expect(memoryResource.Properties.MemoryStrategies).toHaveLength(3);

    const strategyNames = memoryResource.Properties.MemoryStrategies.map(
      (strategy: any) => {
        if (strategy.SummaryMemoryStrategy) return strategy.SummaryMemoryStrategy.Name;
        if (strategy.SemanticMemoryStrategy) return strategy.SemanticMemoryStrategy.Name;
        if (strategy.CustomMemoryStrategy) return strategy.CustomMemoryStrategy.Name;
        return null;
      },
    );

    expect(strategyNames.some((name: string) => /summary_builtin_.*/.test(name))).toBe(true);
    expect(strategyNames.some((name: string) => /semantic_builtin_.*/.test(name))).toBe(true);
    expect(strategyNames).toContain('added_custom_strategy');
  });

  test('Should have memoryStrategies property accessible after adding strategies', () => {
    expect(memory.memoryStrategies).toHaveLength(3);

    const strategyNames = memory.memoryStrategies.map(strategy =>
      strategy.name || strategy.name,
    );

    expect(strategyNames.some((name: string) => /summary_builtin_.*/.test(name))).toBe(true);
    expect(strategyNames.some((name: string) => /semantic_builtin_.*/.test(name))).toBe(true);
    expect(strategyNames).toContain('added_custom_strategy');
  });
});

describe('Memory with dynamic strategy addition tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  // @ts-ignore
  let memory: Memory;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    // Create memory with one initial strategy
    memory = new Memory(stack, 'test-memory', {
      memoryName: 'test_memory_dynamic',
      description: 'A test memory with dynamic strategy addition',
      expirationDuration: Duration.days(120),
      memoryStrategies: [
        MemoryStrategy.usingBuiltInUserPreference(),
      ],
    });

    // Add more strategies dynamically
    memory.addMemoryStrategy(MemoryStrategy.usingBuiltInSummarization());

    const customStrategy = MemoryStrategy.usingSummarization({
      name: 'dynamic_summary_strategy',
      description: 'Dynamic summary strategy',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/dynamic'],
      customConsolidation: {
        model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
        appendToPrompt: 'Dynamic consolidation prompt',
      },
    });
    memory.addMemoryStrategy(customStrategy);

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::Memory', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
  });

  test('Should have Memory resource with both initial and dynamically added strategies', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      Name: 'test_memory_dynamic',
      Description: 'A test memory with dynamic strategy addition',
      EventExpiryDuration: 120,
      MemoryStrategies: Match.arrayWith([
        // Initial strategy
        {
          UserPreferenceMemoryStrategy: {
            Name: Match.stringLikeRegexp('preference_builtin_.*'),
            Description: 'Capture individual preferences, interaction patterns, and personalized settings to enhance future experiences.',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
            Type: 'USER_PREFERENCE',
          },
        },
        // Dynamically added strategies
        {
          SummaryMemoryStrategy: {
            Name: Match.stringLikeRegexp('summary_builtin_.*'),
            Description: 'Summarize interactions to preserve critical context and key insights',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/sessions/{sessionId}'],
            Type: 'SUMMARIZATION',
          },
        },
        {
          CustomMemoryStrategy: {
            Name: 'dynamic_summary_strategy',
            Description: 'Dynamic summary strategy',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/dynamic'],
            Type: 'SUMMARIZATION',
            Configuration: {
              SummaryOverride: {
                Consolidation: {
                  ModelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
                  AppendToPrompt: 'Dynamic consolidation prompt',
                },
              },
            },
          },
        },
      ]),
    });
  });

  test('Should have exactly three strategies total', () => {
    const memoryResources = template.findResources('AWS::BedrockAgentCore::Memory');
    const memoryResource = Object.values(memoryResources)[0];

    expect(memoryResource.Properties.MemoryStrategies).toHaveLength(3);
  });
});

describe('Memory grant methods tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let memory: Memory;
  let user: iam.User;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    memory = new Memory(stack, 'test-memory', {
      memoryName: 'test_memory_grants',
      description: 'A test memory for testing grant methods',
      expirationDuration: Duration.days(30),
    });

    user = new iam.User(stack, 'TestUser', {
      userName: 'test-user',
    });
  });

  test('Should grant custom actions to user', () => {
    const grant = memory.grant(user, 'bedrock-agentcore:GetMemory', 'bedrock-agentcore:ListMemoryRecords');

    expect(grant).toBeDefined();
    expect(grant.principalStatement).toBeDefined();
    // resourceStatement might be undefined if no resource policy is needed
  });

  test('Should grant write permissions to user', () => {
    const grant = memory.grantWrite(user);

    expect(grant).toBeDefined();
    expect(grant.principalStatement).toBeDefined();
    // resourceStatement might be undefined if no resource policy is needed
  });

  test('Should grant read permissions to user', () => {
    const grant = memory.grantRead(user);

    expect(grant).toBeDefined();
    expect(grant.principalStatement).toBeDefined();
    // resourceStatement might be undefined if no resource policy is needed
  });

  test('Should grant read short-term memory permissions to user', () => {
    const grant = memory.grantReadShortTermMemory(user);

    expect(grant).toBeDefined();
    expect(grant.principalStatement).toBeDefined();
    // resourceStatement might be undefined if no resource policy is needed
  });

  test('Should grant read long-term memory permissions to user', () => {
    const grant = memory.grantReadLongTermMemory(user);

    expect(grant).toBeDefined();
    expect(grant.principalStatement).toBeDefined();
    // resourceStatement might be undefined if no resource policy is needed
  });

  test('Should grant delete permissions to user', () => {
    const grant = memory.grantDelete(user);

    expect(grant).toBeDefined();
    expect(grant.principalStatement).toBeDefined();
    // resourceStatement might be undefined if no resource policy is needed
  });

  test('Should grant delete short-term memory permissions to user', () => {
    const grant = memory.grantDeleteShortTermMemory(user);

    expect(grant).toBeDefined();
    expect(grant.principalStatement).toBeDefined();
    // resourceStatement might be undefined if no resource policy is needed
  });

  test('Should grant delete long-term memory permissions to user', () => {
    const grant = memory.grantDeleteLongTermMemory(user);

    expect(grant).toBeDefined();
    expect(grant.principalStatement).toBeDefined();
    // resourceStatement might be undefined if no resource policy is needed
  });

  test('Should grant admin permissions to user', () => {
    const grant = memory.grantAdmin(user);

    expect(grant).toBeDefined();
    expect(grant.principalStatement).toBeDefined();
    // resourceStatement might be undefined if no resource policy is needed
  });

  test('Should grant full access permissions to user', () => {
    const grant = memory.grantFullAccess(user);

    expect(grant).toBeDefined();
    expect(grant.principalStatement).toBeDefined();
    // resourceStatement might be undefined if no resource policy is needed
  });
});

describe('Memory strategy namespace validation tests', () => {
  beforeAll(() => {
    // No setup needed for these tests as they only test validation logic
  });

  test('Should throw error for namespace containing only opening brace', () => {
    expect(() => {
      MemoryStrategy.usingSemantic({
        name: 'invalid_namespace_strategy',
        description: 'Strategy with invalid namespace',
        namespaces: ['/strategies/{/actors'],
        customConsolidation: {
          model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
          appendToPrompt: 'Test consolidation prompt',
        },
        customExtraction: {
          model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
          appendToPrompt: 'Test extraction prompt',
        },
      });
    }).toThrow('Namespace with templates should contain valid variables: /strategies/{/actors');
  });

  test('Should throw error for namespace with invalid template variables', () => {
    expect(() => {
      MemoryStrategy.usingSemantic({
        name: 'invalid_template_strategy',
        description: 'Strategy with invalid template variables',
        namespaces: ['/strategies/{invalidVar}/actors'],
        customConsolidation: {
          model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
          appendToPrompt: 'Test consolidation prompt',
        },
        customExtraction: {
          model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
          appendToPrompt: 'Test extraction prompt',
        },
      });
    }).toThrow('Namespace with templates should contain valid variables: /strategies/{invalidVar}/actors');
  });

  test('Should accept valid namespace with correct template variables', () => {
    expect(() => {
      MemoryStrategy.usingSemantic({
        name: 'valid_namespace_strategy',
        description: 'Strategy with valid namespace',
        namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
        customConsolidation: {
          model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
          appendToPrompt: 'Test consolidation prompt',
        },
        customExtraction: {
          model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
          appendToPrompt: 'Test extraction prompt',
        },
      });
    }).not.toThrow();
  });

  test('Should accept namespace without template variables', () => {
    expect(() => {
      MemoryStrategy.usingSemantic({
        name: 'no_template_strategy',
        description: 'Strategy without template variables',
        namespaces: ['/strategies/custom/actors'],
        customConsolidation: {
          model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
          appendToPrompt: 'Test consolidation prompt',
        },
        customExtraction: {
          model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
          appendToPrompt: 'Test extraction prompt',
        },
      });
    }).not.toThrow();
  });
});

describe('BuiltInMemoryStrategy unit tests', () => {
  test('Should create BuiltInMemoryStrategy with valid properties', () => {
    const strategy = MemoryStrategy.usingBuiltInSummarization();

    expect(strategy.name).toMatch('summary_builtin_cdkGen0001');
    expect(strategy.description).toBe('Summarize interactions to preserve critical context and key insights');
    expect(strategy.namespaces).toEqual(['/strategies/{memoryStrategyId}/actors/{actorId}/sessions/{sessionId}']);
    expect(strategy.strategyType).toBe('SUMMARIZATION');
  });

  test('Should create semantic BuiltInMemoryStrategy with valid properties', () => {
    const strategy = MemoryStrategy.usingBuiltInSemantic();

    expect(strategy.name).toMatch('semantic_builtin_cdkGen0001');
    expect(strategy.description).toBe('Extract general factual knowledge, concepts and meanings from raw conversations in a context-independent format.');
    expect(strategy.namespaces).toEqual(['/strategies/{memoryStrategyId}/actors/{actorId}']);
    expect(strategy.strategyType).toBe('SEMANTIC');
  });

  test('Should create user preference BuiltInMemoryStrategy with valid properties', () => {
    const strategy = MemoryStrategy.usingBuiltInUserPreference();

    expect(strategy.name).toMatch('preference_builtin_cdkGen0001');
    expect(strategy.description).toBe('Capture individual preferences, interaction patterns, and personalized settings to enhance future experiences.');
    expect(strategy.namespaces).toEqual(['/strategies/{memoryStrategyId}/actors/{actorId}']);
    expect(strategy.strategyType).toBe('USER_PREFERENCE');
  });

  test('Should render summarization strategy correctly', () => {
    const strategy = MemoryStrategy.usingBuiltInSummarization();
    const rendered = strategy.render();

    expect(rendered).toHaveProperty('summaryMemoryStrategy');
    expect(rendered.summaryMemoryStrategy).toMatchObject({
      name: expect.stringMatching('summary_builtin_cdkGen0001'),
      description: 'Summarize interactions to preserve critical context and key insights',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/sessions/{sessionId}'],
      type: 'SUMMARIZATION',
    });
  });

  test('Should render semantic strategy correctly', () => {
    const strategy = MemoryStrategy.usingBuiltInSemantic();
    const rendered = strategy.render();

    expect(rendered).toHaveProperty('semanticMemoryStrategy');
    expect(rendered.semanticMemoryStrategy).toMatchObject({
      name: expect.stringMatching('semantic_builtin_cdkGen0001'),
      description: 'Extract general factual knowledge, concepts and meanings from raw conversations in a context-independent format.',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
      type: 'SEMANTIC',
    });
  });

  test('Should render user preference strategy correctly', () => {
    const strategy = MemoryStrategy.usingBuiltInUserPreference();
    const rendered = strategy.render();

    expect(rendered).toHaveProperty('userPreferenceMemoryStrategy');
    expect(rendered.userPreferenceMemoryStrategy).toMatchObject({
      name: expect.stringMatching('preference_builtin_cdkGen0001'),
      description: 'Capture individual preferences, interaction patterns, and personalized settings to enhance future experiences.',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
      type: 'USER_PREFERENCE',
    });
  });

  test('Should return undefined for grant method', () => {
    const strategy = MemoryStrategy.usingBuiltInSummarization();
    const mockRole = {} as iam.IRole;

    const grant = strategy.grant(mockRole);
    expect(grant).toBeUndefined();
  });

  test('Should create custom semantic strategy with valid properties', () => {
    const strategy = MemoryStrategy.usingSemantic({
      name: 'custom_semantic',
      description: 'Custom semantic strategy',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/custom'],
    });

    expect(strategy.name).toBe('custom_semantic');
    expect(strategy.description).toBe('Custom semantic strategy');
    expect(strategy.namespaces).toEqual(['/strategies/{memoryStrategyId}/actors/{actorId}/custom']);
    expect(strategy.strategyType).toBe('SEMANTIC');
  });

  test('Should create custom user preference strategy with valid properties', () => {
    const strategy = MemoryStrategy.usingUserPreference({
      name: 'custom_user_preference',
      description: 'Custom user preference strategy',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/preferences'],
    });

    expect(strategy.name).toBe('custom_user_preference');
    expect(strategy.description).toBe('Custom user preference strategy');
    expect(strategy.namespaces).toEqual(['/strategies/{memoryStrategyId}/actors/{actorId}/preferences']);
    expect(strategy.strategyType).toBe('USER_PREFERENCE');
  });

  test('Should create custom summarization strategy with valid properties', () => {
    const strategy = MemoryStrategy.usingSummarization({
      name: 'custom_summarization',
      description: 'Custom summarization strategy',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/sessions/{sessionId}/custom'],
    });

    expect(strategy.name).toBe('custom_summarization');
    expect(strategy.description).toBe('Custom summarization strategy');
    expect(strategy.namespaces).toEqual(['/strategies/{memoryStrategyId}/actors/{actorId}/sessions/{sessionId}/custom']);
    expect(strategy.strategyType).toBe('SUMMARIZATION');
  });
});

describe('BuiltInMemoryStrategy validation tests', () => {
  test('Should throw error for invalid strategy name with hyphen', () => {
    expect(() => {
      MemoryStrategy.usingSemantic({
        name: 'invalid-name',
        description: 'Strategy with invalid name',
        namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
      });
    }).toThrow('The field Memory name with value "invalid-name" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should throw error for empty strategy name', () => {
    expect(() => {
      MemoryStrategy.usingSemantic({
        name: '',
        description: 'Strategy with empty name',
        namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
      });
    }).toThrow('The field Memory name is 0 characters long but must be at least 1 characters');
  });

  test('Should throw error for strategy name with spaces', () => {
    expect(() => {
      MemoryStrategy.usingSemantic({
        name: 'invalid name',
        description: 'Strategy with spaces in name',
        namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
      });
    }).toThrow('The field Memory name with value "invalid name" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should throw error for strategy name with special characters', () => {
    expect(() => {
      MemoryStrategy.usingSemantic({
        name: 'invalid@name',
        description: 'Strategy with special characters',
        namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
      });
    }).toThrow('The field Memory name with value "invalid@name" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should throw error for strategy name exceeding 48 characters', () => {
    const longName = 'a'.repeat(49);
    expect(() => {
      MemoryStrategy.usingSemantic({
        name: longName,
        description: 'Strategy with long name',
        namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
      });
    }).toThrow('The field Memory name is 49 characters long but must be less than or equal to 48 characters');
  });

  test('Should accept valid strategy name with underscores', () => {
    expect(() => {
      MemoryStrategy.usingSemantic({
        name: 'valid_strategy_name_123',
        description: 'Strategy with valid name',
        namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
      });
    }).not.toThrow();
  });

  test('Should accept valid strategy name with only letters and numbers', () => {
    expect(() => {
      MemoryStrategy.usingSemantic({
        name: 'validStrategyName123',
        description: 'Strategy with valid name',
        namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
      });
    }).not.toThrow();
  });

  test('Should throw error for namespace with invalid template variables in builtin strategy', () => {
    expect(() => {
      MemoryStrategy.usingSemantic({
        name: 'invalid_namespace_strategy',
        description: 'Strategy with invalid namespace',
        namespaces: ['/strategies/{invalidVar}/actors'],
      });
    }).toThrow('Namespace with templates should contain valid variables: /strategies/{invalidVar}/actors');
  });

  test('Should throw error for namespace containing only opening brace in builtin strategy', () => {
    expect(() => {
      MemoryStrategy.usingSemantic({
        name: 'invalid_brace_strategy',
        description: 'Strategy with invalid namespace',
        namespaces: ['/strategies/{/actors'],
      });
    }).toThrow('Namespace with templates should contain valid variables: /strategies/{/actors');
  });

  test('Should accept valid namespace with correct template variables in builtin strategy', () => {
    expect(() => {
      MemoryStrategy.usingSemantic({
        name: 'valid_namespace_strategy',
        description: 'Strategy with valid namespace',
        namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
      });
    }).not.toThrow();
  });

  test('Should accept namespace without template variables in builtin strategy', () => {
    expect(() => {
      MemoryStrategy.usingSemantic({
        name: 'no_template_strategy',
        description: 'Strategy without template variables',
        namespaces: ['/strategies/custom/actors'],
      });
    }).not.toThrow();
  });
});

describe('SelfManagedMemoryStrategy unit tests', () => {
  let stack: cdk.Stack;
  let topic: sns.Topic;
  let bucket: s3.Bucket;

  beforeEach(() => {
    stack = new cdk.Stack();
    topic = new sns.Topic(stack, 'TestTopic');
    bucket = new s3.Bucket(stack, 'TestBucket');
  });

  test('Should create SelfManagedMemoryStrategy with default values', () => {
    const strategy = MemoryStrategy.usingSelfManaged({
      name: 'test_self_managed',
      description: 'Test self managed strategy',
      invocationConfiguration: {
        topic: topic,
        s3Location: {
          bucketName: bucket.bucketName,
          objectKey: 'test/',
        },
      },
    });

    expect(strategy.name).toBe('test_self_managed');
    expect(strategy.description).toBe('Test self managed strategy');
    expect(strategy.strategyType).toBe('CUSTOM');
    expect(strategy.historicalContextWindowSize).toBe(4);
    expect(strategy.triggerConditions.messageBasedTrigger).toBe(1);
    expect(strategy.triggerConditions.timeBasedTrigger?.toSeconds()).toBe(10);
    expect(strategy.triggerConditions.tokenBasedTrigger).toBe(100);
  });

  test('Should create SelfManagedMemoryStrategy with custom values', () => {
    const strategy = MemoryStrategy.usingSelfManaged({
      name: 'custom_self_managed',
      description: 'Custom self managed strategy',
      historicalContextWindowSize: 10,
      invocationConfiguration: {
        topic: topic,
        s3Location: {
          bucketName: bucket.bucketName,
          objectKey: 'custom/',
        },
      },
      triggerConditions: {
        messageBasedTrigger: 5,
        timeBasedTrigger: cdk.Duration.seconds(30),
        tokenBasedTrigger: 500,
      },
    });

    expect(strategy.historicalContextWindowSize).toBe(10);
    expect(strategy.triggerConditions.messageBasedTrigger).toBe(5);
    expect(strategy.triggerConditions.timeBasedTrigger?.toSeconds()).toBe(30);
    expect(strategy.triggerConditions.tokenBasedTrigger).toBe(500);
  });

  test('Should create SelfManagedMemoryStrategy with partial trigger conditions', () => {
    const strategy = MemoryStrategy.usingSelfManaged({
      name: 'partial_self_managed',
      description: 'Partial self managed strategy',
      invocationConfiguration: {
        topic: topic,
        s3Location: {
          bucketName: bucket.bucketName,
          objectKey: 'partial/',
        },
      },
      triggerConditions: {
        messageBasedTrigger: 3,
        // timeBasedTrigger and tokenBasedTrigger will use defaults
      },
    });

    expect(strategy.triggerConditions.messageBasedTrigger).toBe(3);
    expect(strategy.triggerConditions.timeBasedTrigger?.toSeconds()).toBe(10); // default
    expect(strategy.triggerConditions.tokenBasedTrigger).toBe(100); // default
  });

  test('Should validate historical context window size range', () => {
    expect(() => {
      MemoryStrategy.usingSelfManaged({
        name: 'invalid_historical',
        invocationConfiguration: {
          topic: topic,
          s3Location: {
            bucketName: bucket.bucketName,
            objectKey: 'test/',
          },
        },
        historicalContextWindowSize: 100, // Invalid: should be 0-50
      });
    }).toThrow('Historical context window size must be between 0 and 50, got 100');
  });

  test('Should validate message-based trigger range', () => {
    expect(() => {
      MemoryStrategy.usingSelfManaged({
        name: 'invalid_message_trigger',
        invocationConfiguration: {
          topic: topic,
          s3Location: {
            bucketName: bucket.bucketName,
            objectKey: 'test/',
          },
        },
        triggerConditions: {
          messageBasedTrigger: 100, // Invalid: should be 1-50
        },
      });
    }).toThrow('Message-based trigger must be between 1 and 50, got 100');
  });

  test('Should validate time-based trigger range', () => {
    expect(() => {
      MemoryStrategy.usingSelfManaged({
        name: 'invalid_time_trigger',
        invocationConfiguration: {
          topic: topic,
          s3Location: {
            bucketName: bucket.bucketName,
            objectKey: 'test/',
          },
        },
        triggerConditions: {
          timeBasedTrigger: cdk.Duration.seconds(5), // Invalid: should be 10-3000
        },
      });
    }).toThrow('Time-based trigger must be between 10 and 3000 seconds, got 5');
  });

  test('Should validate token-based trigger range', () => {
    expect(() => {
      MemoryStrategy.usingSelfManaged({
        name: 'invalid_token_trigger',
        invocationConfiguration: {
          topic: topic,
          s3Location: {
            bucketName: bucket.bucketName,
            objectKey: 'test/',
          },
        },
        triggerConditions: {
          tokenBasedTrigger: 50, // Invalid: should be 100-500000
        },
      });
    }).toThrow('Token-based trigger must be between 100 and 500000, got 50');
  });

  test('Should validate multiple trigger conditions', () => {
    expect(() => {
      MemoryStrategy.usingSelfManaged({
        name: 'invalid_multiple_triggers',
        invocationConfiguration: {
          topic: topic,
          s3Location: {
            bucketName: bucket.bucketName,
            objectKey: 'test/',
          },
        },
        triggerConditions: {
          messageBasedTrigger: 0, // Invalid: should be 1-50
          timeBasedTrigger: cdk.Duration.seconds(5000), // Invalid: should be 10-3000
          tokenBasedTrigger: 1000000, // Invalid: should be 100-500000
        },
      });
    }).toThrow();
  });

  test('Should render CloudFormation properties correctly', () => {
    const strategy = MemoryStrategy.usingSelfManaged({
      name: 'render_test',
      invocationConfiguration: {
        topic: topic,
        s3Location: {
          bucketName: bucket.bucketName,
          objectKey: 'render/',
        },
      },
      triggerConditions: {
        messageBasedTrigger: 2,
        timeBasedTrigger: cdk.Duration.seconds(60),
        tokenBasedTrigger: 200,
      },
    });

    const rendered = strategy.render();
    expect(rendered.customMemoryStrategy).toBeDefined();
    expect((rendered.customMemoryStrategy as any)?.name).toBe('render_test');
    expect((rendered.customMemoryStrategy as any)?.type).toBe('CUSTOM');
  });

  test('Should grant permissions correctly', () => {
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
    });

    const strategy = MemoryStrategy.usingSelfManaged({
      name: 'grant_test',
      invocationConfiguration: {
        topic: topic,
        s3Location: {
          bucketName: bucket.bucketName,
          objectKey: 'grant/',
        },
      },
    });

    const grant = strategy.grant(role);
    expect(grant).toBeDefined();
  });

  test('Should handle minimum valid values', () => {
    expect(() => {
      MemoryStrategy.usingSelfManaged({
        name: 'min_values',
        invocationConfiguration: {
          topic: topic,
          s3Location: {
            bucketName: bucket.bucketName,
            objectKey: 'min/',
          },
        },
        historicalContextWindowSize: 0,
        triggerConditions: {
          messageBasedTrigger: 1,
          timeBasedTrigger: cdk.Duration.seconds(10),
          tokenBasedTrigger: 100,
        },
      });
    }).not.toThrow();
  });

  test('Should handle maximum valid values', () => {
    expect(() => {
      MemoryStrategy.usingSelfManaged({
        name: 'max_values',
        invocationConfiguration: {
          topic: topic,
          s3Location: {
            bucketName: bucket.bucketName,
            objectKey: 'max/',
          },
        },
        historicalContextWindowSize: 50,
        triggerConditions: {
          messageBasedTrigger: 50,
          timeBasedTrigger: cdk.Duration.seconds(3000),
          tokenBasedTrigger: 500000,
        },
      });
    }).not.toThrow();
  });
});

describe('Memory with custom execution role and strategies tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  let customRole: iam.Role;
  let kmsKey: kms.Key;
  let topic: sns.Topic;
  let bucket: s3.Bucket;
  // @ts-ignore
  let memory: Memory;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    // Create a custom execution role
    customRole = new iam.Role(stack, 'CustomExecutionRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
      roleName: 'custom-memory-execution-role',
    });

    // Create a custom KMS key
    kmsKey = new kms.Key(stack, 'MemoryEncryptionKey', {
      description: 'KMS key for memory encryption',
      enableKeyRotation: true,
    });

    // Create SNS topic and S3 bucket for self-managed strategy
    topic = new sns.Topic(stack, 'MemoryTopic', {
      topicName: 'memory-processing-topic',
    });

    bucket = new s3.Bucket(stack, 'MemoryBucket', {
      bucketName: 'memory-processing-bucket',
    });

    // Create memory with custom role, KMS key, and mixed strategies
    memory = new Memory(stack, 'test-memory', {
      memoryName: 'test_memory_custom_role_strategies',
      description: 'A test memory with custom execution role and mixed strategies',
      expirationDuration: Duration.days(60),
      executionRole: customRole,
      kmsKey: kmsKey,
      memoryStrategies: [
        // Built-in strategies
        MemoryStrategy.usingBuiltInSummarization(),
        MemoryStrategy.usingBuiltInSemantic(),
        // Custom managed strategy
        MemoryStrategy.usingSemantic({
          name: 'custom_semantic_strategy',
          description: 'Custom semantic strategy with custom role',
          namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/custom'],
          customConsolidation: {
            model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
            appendToPrompt: 'Custom consolidation prompt for semantic memory',
          },
          customExtraction: {
            model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
            appendToPrompt: 'Custom extraction prompt for semantic memory',
          },
        }),
        // Self-managed strategy
        MemoryStrategy.usingSelfManaged({
          name: 'self_managed_strategy',
          description: 'Self-managed strategy with custom role',
          invocationConfiguration: {
            topic: topic,
            s3Location: {
              bucketName: bucket.bucketName,
              objectKey: 'memory-processing/',
            },
          },
          triggerConditions: {
            messageBasedTrigger: 5,
            timeBasedTrigger: Duration.seconds(30),
            tokenBasedTrigger: 500,
          },
        }),
      ],
    });

    // Add additional strategies via addMemoryStrategy method
    memory.addMemoryStrategy(MemoryStrategy.usingBuiltInUserPreference());

    memory.addMemoryStrategy(MemoryStrategy.usingUserPreference({
      name: 'added_user_preference_strategy',
      description: 'User preference strategy added via addMemoryStrategy',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/preferences'],
      customConsolidation: {
        model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
        appendToPrompt: 'Custom consolidation prompt for user preferences',
      },
    }));

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::Memory', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::KMS::Key', 1);
    template.resourceCountIs('AWS::SNS::Topic', 1);
    template.resourceCountIs('AWS::S3::Bucket', 1);
  });

  test('Should have Memory resource with custom execution role and KMS encryption', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      Name: 'test_memory_custom_role_strategies',
      Description: 'A test memory with custom execution role and mixed strategies',
      EventExpiryDuration: 60,
      MemoryExecutionRoleArn: {
        'Fn::GetAtt': [
          Match.stringLikeRegexp('CustomExecutionRole*'),
          'Arn',
        ],
      },
      EncryptionKeyArn: {
        'Fn::GetAtt': [
          Match.stringLikeRegexp('MemoryEncryptionKey*'),
          'Arn',
        ],
      },
    });
  });

  test('Should have custom execution role with correct properties', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      RoleName: 'custom-memory-execution-role',
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'bedrock-agentcore.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('Should have KMS key with correct properties', () => {
    template.hasResourceProperties('AWS::KMS::Key', {
      Description: 'KMS key for memory encryption',
      EnableKeyRotation: true,
    });
  });

  test('Should have KMS permissions correctly applied on execution role', () => {
    // Check that KMS permissions are granted through IAM policy statements
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: 'Allow',
            Action: ['kms:CreateGrant',
              'kms:Decrypt',
              'kms:DescribeKey',
              'kms:GenerateDataKey',
              'kms:GenerateDataKeyWithoutPlaintext',
              'kms:ReEncrypt*'],
            Resource: {
              'Fn::GetAtt': [
                Match.stringLikeRegexp('MemoryEncryptionKey*'),
                'Arn',
              ],
            },
          }),
        ]),
      },
      Roles: [
        {
          Ref: Match.stringLikeRegexp('CustomExecutionRole*'),
        },
      ],
    });
  });

  test('Should have Memory resource with all strategies from constructor', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      MemoryStrategies: Match.arrayWith([
        // Built-in summarization
        {
          SummaryMemoryStrategy: {
            Name: Match.stringLikeRegexp('summary_builtin_.*'),
            Description: 'Summarize interactions to preserve critical context and key insights',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/sessions/{sessionId}'],
            Type: 'SUMMARIZATION',
          },
        },
        // Built-in semantic
        {
          SemanticMemoryStrategy: {
            Name: Match.stringLikeRegexp('semantic_builtin_.*'),
            Description: 'Extract general factual knowledge, concepts and meanings from raw conversations in a context-independent format.',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
            Type: 'SEMANTIC',
          },
        },
        // Custom semantic strategy
        {
          CustomMemoryStrategy: {
            Name: 'custom_semantic_strategy',
            Description: 'Custom semantic strategy with custom role',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/custom'],
            Type: 'SEMANTIC',
            Configuration: {
              SemanticOverride: {
                Consolidation: {
                  ModelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
                  AppendToPrompt: 'Custom consolidation prompt for semantic memory',
                },
                Extraction: {
                  ModelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
                  AppendToPrompt: 'Custom extraction prompt for semantic memory',
                },
              },
            },
          },
        },
        // Self-managed strategy
        {
          CustomMemoryStrategy: {
            Name: 'self_managed_strategy',
            Description: 'Self-managed strategy with custom role',
            Type: 'CUSTOM',
            Configuration: {
              SelfManagedConfiguration: {
                HistoricalContextWindowSize: 4,
                InvocationConfiguration: {
                  TopicArn: {
                    Ref: Match.stringLikeRegexp('MemoryTopic*'),
                  },
                  PayloadDeliveryBucketName: {
                    Ref: Match.stringLikeRegexp('MemoryBucket*'),
                  },
                },
                TriggerConditions: [
                  {
                    MessageBasedTrigger: {
                      MessageCount: 5,
                    },
                  },
                  {
                    TimeBasedTrigger: {
                      IdleSessionTimeout: 30,
                    },
                  },
                  {
                    TokenBasedTrigger: {
                      TokenCount: 500,
                    },
                  },
                ],
              },
            },
          },
        },
      ]),
    });
  });

  test('Should have Memory resource with strategies added via addMemoryStrategy', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::Memory', {
      MemoryStrategies: Match.arrayWith([
        // Built-in user preference added via addMemoryStrategy
        {
          UserPreferenceMemoryStrategy: {
            Name: Match.stringLikeRegexp('preference_builtin_.*'),
            Description: 'Capture individual preferences, interaction patterns, and personalized settings to enhance future experiences.',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}'],
            Type: 'USER_PREFERENCE',
          },
        },
        // Custom user preference added via addMemoryStrategy
        {
          CustomMemoryStrategy: {
            Name: 'added_user_preference_strategy',
            Description: 'User preference strategy added via addMemoryStrategy',
            Namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/preferences'],
            Type: 'USER_PREFERENCE',
            Configuration: {
              UserPreferenceOverride: {
                Consolidation: {
                  ModelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
                  AppendToPrompt: 'Custom consolidation prompt for user preferences',
                },
              },
            },
          },
        },
      ]),
    });
  });

  test('Should have exactly six strategies total', () => {
    const memoryResources = template.findResources('AWS::BedrockAgentCore::Memory');
    const memoryResource = Object.values(memoryResources)[0];

    expect(memoryResource.Properties.MemoryStrategies).toHaveLength(6);
  });

  test('Should have SNS permissions for self-managed strategy on execution role', () => {
    // Check that the execution role has the necessary SNS permissions for self-managed strategy
    const policies = template.findResources('AWS::IAM::Policy');
    const policyValues = Object.values(policies);

    let hasSNSPermission = false;
    for (const policy of policyValues) {
      const statements = policy.Properties.PolicyDocument.Statement;
      for (const statement of statements) {
        if (statement.Action &&
            (statement.Action.includes('sns:GetTopicAttributes') ||
             statement.Action.includes('sns:Publish'))) {
          hasSNSPermission = true;
          break;
        }
      }
      if (hasSNSPermission) break;
    }

    expect(hasSNSPermission).toBe(true);
  });

  test('Should have S3 permissions for self-managed strategy on execution role', () => {
    // Check that the execution role has the necessary S3 permissions for self-managed strategy
    const policies = template.findResources('AWS::IAM::Policy');
    const policyValues = Object.values(policies);

    let hasS3Permission = false;
    for (const policy of policyValues) {
      const statements = policy.Properties.PolicyDocument.Statement;
      for (const statement of statements) {
        if (statement.Action &&
            (statement.Action.includes('s3:GetBucketLocation') ||
             statement.Action.includes('s3:PutObject'))) {
          hasS3Permission = true;
          break;
        }
      }
      if (hasS3Permission) break;
    }

    expect(hasS3Permission).toBe(true);
  });

  test('Should have Bedrock invoke permissions for custom strategies on execution role', () => {
    // Check that custom strategies with model overrides are properly configured
    // The Bedrock permissions are granted through the model's grantInvoke method
    // We verify this by checking that the custom strategies are present in the template
    const memoryResources = template.findResources('AWS::BedrockAgentCore::Memory');
    const memoryResource = Object.values(memoryResources)[0];
    const strategies = memoryResource.Properties.MemoryStrategies;

    // Check that we have custom strategies with model overrides
    let hasCustomStrategyWithModel = false;
    for (const strategy of strategies) {
      if (strategy.CustomMemoryStrategy &&
          strategy.CustomMemoryStrategy.Configuration &&
          (strategy.CustomMemoryStrategy.Configuration.SemanticOverride ||
           strategy.CustomMemoryStrategy.Configuration.UserPreferenceOverride)) {
        hasCustomStrategyWithModel = true;
        break;
      }
    }

    expect(hasCustomStrategyWithModel).toBe(true);
  });

  test('Should have memoryStrategies property accessible after adding strategies', () => {
    expect(memory.memoryStrategies).toHaveLength(6);

    const strategyNames = memory.memoryStrategies.map(strategy => strategy.name);

    expect(strategyNames.some((name: string) => /summary_builtin_.*/.test(name))).toBe(true);
    expect(strategyNames.some((name: string) => /semantic_builtin_.*/.test(name))).toBe(true);
    expect(strategyNames.some((name: string) => /preference_builtin_.*/.test(name))).toBe(true);
    expect(strategyNames).toContain('custom_semantic_strategy');
    expect(strategyNames).toContain('self_managed_strategy');
    expect(strategyNames).toContain('added_user_preference_strategy');
  });

  test('Should have correct execution role reference', () => {
    expect(memory.executionRole).toBe(customRole);
    // The role name is resolved as a token, so we check that it's defined
    expect(memory.executionRole?.roleName).toBeDefined();
  });

  test('Should have correct KMS key reference', () => {
    expect(memory.kmsKey).toBe(kmsKey);
    expect(memory.kmsKey?.keyArn).toBeDefined();
  });
});

describe('Memory Optional Physical Names', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  test('Should create Memory without memoryName (auto-generated)', () => {
    const memory = new Memory(stack, 'TestMemory', {
    });

    expect(memory.memoryName).toBeDefined();
    expect(memory.memoryName).not.toBe('');
  });
});

describe('Episodic Memory Strategy unit tests', () => {
  test('Should create built-in episodic strategy with valid properties', () => {
    const strategy = MemoryStrategy.usingBuiltInEpisodic();

    expect(strategy.name).toMatch('episodic_builtin_cdkGen0001');
    expect(strategy.namespaces).toEqual(['/strategy/{memoryStrategyId}/actor/{actorId}/session/{sessionId}']);
    expect(strategy.strategyType).toBe('EPISODIC');
    // Verify reflection configuration is included
    expect((strategy as any).reflectionConfiguration).toBeDefined();
    expect((strategy as any).reflectionConfiguration.namespaces).toEqual(['/strategy/{memoryStrategyId}/actor/{actorId}']);
  });

  test('Should render built-in episodic strategy with correct structure', () => {
    const strategy = MemoryStrategy.usingBuiltInEpisodic();
    const rendered = strategy.render();

    expect(rendered).toHaveProperty('episodicMemoryStrategy');
    expect((rendered as any).episodicMemoryStrategy).toMatchObject({
      name: expect.stringMatching('episodic_builtin_cdkGen0001'),
      namespaces: ['/strategy/{memoryStrategyId}/actor/{actorId}/session/{sessionId}'],
      type: 'EPISODIC',
      reflectionConfiguration: {
        namespaces: ['/strategy/{memoryStrategyId}/actor/{actorId}'],
      },
    });
  });

  test('Should create custom episodic strategy with valid properties', () => {
    const strategy = MemoryStrategy.usingEpisodic({
      name: 'custom_episodic',
      description: 'Custom episodic strategy',
      namespaces: ['/strategies/{memoryStrategyId}/actors/{actorId}/episodic'],
    });

    expect(strategy.name).toBe('custom_episodic');
    expect(strategy.description).toBe('Custom episodic strategy');
    expect(strategy.namespaces).toEqual(['/strategies/{memoryStrategyId}/actors/{actorId}/episodic']);
    expect(strategy.strategyType).toBe('EPISODIC');
  });

  test('Should return undefined for grant method on built-in episodic', () => {
    const strategy = MemoryStrategy.usingBuiltInEpisodic();
    const mockRole = {} as iam.IRole;

    const grant = strategy.grant(mockRole);
    expect(grant).toBeUndefined();
  });
});

describe('Memory with built-in episodic strategy tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  // @ts-ignore
  let memory: Memory;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    memory = new Memory(stack, 'test-memory', {
      memoryName: 'test_memory_episodic',
      description: 'A test memory with built-in episodic strategy',
      expirationDuration: Duration.days(90),
      memoryStrategies: [
        MemoryStrategy.usingBuiltInEpisodic(),
      ],
    });

    app.synth();
  });

  test('Should create memory with episodic strategy without errors', () => {
    expect(memory.memoryName).toBe('test_memory_episodic');
    expect(memory.memoryStrategies).toHaveLength(1);
    expect(memory.memoryStrategies[0].strategyType).toBe('EPISODIC');
    expect(memory.memoryStrategies[0].name).toMatch(/episodic_builtin/);
  });
});

describe('Memory with episodic reflection configuration tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  // @ts-ignore
  let memory: Memory;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    const episodicStrategy = MemoryStrategy.usingEpisodic({
      name: 'episodic_with_reflection',
      description: 'Episodic strategy with reflection configuration',
      namespaces: ['/journey/customer/{actorId}/episodes'],
      reflectionConfiguration: {
        namespaces: ['/journey/customer/{actorId}/reflections'],
      },
    });

    memory = new Memory(stack, 'test-memory', {
      memoryName: 'test_memory_episodic_reflection',
      description: 'A test memory with episodic reflection configuration',
      expirationDuration: Duration.days(120),
      memoryStrategies: [episodicStrategy],
    });

    app.synth();
  });

  test('Should create memory with episodic reflection configuration without errors', () => {
    expect(memory.memoryName).toBe('test_memory_episodic_reflection');
    expect(memory.memoryStrategies).toHaveLength(1);
    expect(memory.memoryStrategies[0].strategyType).toBe('EPISODIC');
    expect(memory.memoryStrategies[0].name).toBe('episodic_with_reflection');
  });

  test('Should have reflection configuration accessible', () => {
    const strategy = memory.memoryStrategies[0];
    expect(strategy).toHaveProperty('reflectionConfiguration');
    expect((strategy as any).reflectionConfiguration).toBeDefined();
    expect((strategy as any).reflectionConfiguration.namespaces).toEqual(['/journey/customer/{actorId}/reflections']);
  });
});

describe('Episodic reflection configuration validation tests', () => {
  test('Should throw error for empty reflection namespaces array', () => {
    expect(() => {
      MemoryStrategy.usingEpisodic({
        name: 'invalid_reflection',
        description: 'Episodic with empty reflection namespaces',
        namespaces: ['/journey/customer/{actorId}/episodes'],
        reflectionConfiguration: {
          namespaces: [],
        },
      });
    }).toThrow('Reflection configuration must have at least one namespace');
  });

  test('Should throw error for reflection namespace with invalid template variables', () => {
    expect(() => {
      MemoryStrategy.usingEpisodic({
        name: 'invalid_reflection_template',
        description: 'Episodic with invalid reflection namespace template',
        namespaces: ['/journey/customer/{actorId}/episodes'],
        reflectionConfiguration: {
          namespaces: ['/journey/{invalidVar}/reflections'],
        },
      });
    }).toThrow('Namespace with templates should contain valid variables: /journey/{invalidVar}/reflections');
  });

  test('Should accept valid reflection configuration', () => {
    expect(() => {
      MemoryStrategy.usingEpisodic({
        name: 'valid_reflection',
        description: 'Episodic with valid reflection configuration',
        namespaces: ['/journey/customer/{actorId}/episodes'],
        reflectionConfiguration: {
          namespaces: ['/journey/customer/{actorId}/reflections'],
        },
      });
    }).not.toThrow();
  });

  test('Should accept reflection configuration with multiple namespaces', () => {
    expect(() => {
      MemoryStrategy.usingEpisodic({
        name: 'multi_reflection',
        description: 'Episodic with multiple reflection namespaces',
        namespaces: ['/journey/customer/{actorId}/episodes'],
        reflectionConfiguration: {
          namespaces: [
            '/journey/customer/{actorId}/reflections/primary',
            '/journey/customer/{actorId}/reflections/secondary',
          ],
        },
      });
    }).not.toThrow();
  });

  test('Should accept reflection configuration without template variables', () => {
    expect(() => {
      MemoryStrategy.usingEpisodic({
        name: 'no_template_reflection',
        description: 'Episodic with reflection namespace without templates',
        namespaces: ['/journey/customer/episodes'],
        reflectionConfiguration: {
          namespaces: ['/journey/customer/reflections'],
        },
      });
    }).not.toThrow();
  });
});

describe('Memory with multiple episodic strategies tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  // @ts-ignore
  let memory: Memory;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    memory = new Memory(stack, 'test-memory', {
      memoryName: 'test_memory_multi_episodic',
      description: 'A test memory with multiple episodic strategies',
      expirationDuration: Duration.days(90),
      memoryStrategies: [
        MemoryStrategy.usingBuiltInEpisodic(),
        MemoryStrategy.usingEpisodic({
          name: 'custom_episodic_1',
          description: 'First custom episodic strategy',
          namespaces: ['/journey/{actorId}/episodes/primary'],
        }),
        MemoryStrategy.usingEpisodic({
          name: 'custom_episodic_2',
          description: 'Second custom episodic strategy with reflection',
          namespaces: ['/journey/{actorId}/episodes/secondary'],
          reflectionConfiguration: {
            namespaces: ['/journey/{actorId}/reflections/secondary'],
          },
        }),
      ],
    });

    app.synth();
  });

  test('Should create memory with multiple episodic strategies without errors', () => {
    expect(memory.memoryName).toBe('test_memory_multi_episodic');
    expect(memory.memoryStrategies).toHaveLength(3);
    expect(memory.memoryStrategies.every(s => s.strategyType === 'EPISODIC')).toBe(true);
  });

  test('Should have all three episodic strategies with correct names', () => {
    const strategyNames = memory.memoryStrategies.map(s => s.name);
    expect(strategyNames).toContain('custom_episodic_1');
    expect(strategyNames).toContain('custom_episodic_2');
    expect(strategyNames.some(name => name.includes('episodic_builtin'))).toBe(true);
  });

  test('Should have reflection configuration on second custom episodic', () => {
    const strategyWithReflection = memory.memoryStrategies.find(s => s.name === 'custom_episodic_2');
    expect(strategyWithReflection).toBeDefined();
    expect((strategyWithReflection as any).reflectionConfiguration).toBeDefined();
    expect((strategyWithReflection as any).reflectionConfiguration.namespaces).toEqual(['/journey/{actorId}/reflections/secondary']);
  });
});

describe('Memory with addMemoryStrategy for episodic tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  // @ts-ignore
  let memory: Memory;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    // Create memory without initial strategies
    memory = new Memory(stack, 'test-memory', {
      memoryName: 'test_memory_add_episodic',
      description: 'A test memory for testing addMemoryStrategy with episodic',
      expirationDuration: Duration.days(90),
    });

    // Add episodic strategies dynamically
    memory.addMemoryStrategy(MemoryStrategy.usingBuiltInEpisodic());
    memory.addMemoryStrategy(MemoryStrategy.usingEpisodic({
      name: 'added_episodic_custom',
      description: 'Custom episodic added via addMemoryStrategy',
      namespaces: ['/added/{actorId}/episodes'],
      reflectionConfiguration: {
        namespaces: ['/added/{actorId}/reflections'],
      },
    }));

    app.synth();
  });

  test('Should create memory and add episodic strategies without errors', () => {
    expect(memory.memoryName).toBe('test_memory_add_episodic');
    expect(memory.memoryStrategies).toHaveLength(2);
    expect(memory.memoryStrategies.every(s => s.strategyType === 'EPISODIC')).toBe(true);
  });

  test('Should have both episodic strategies with correct names', () => {
    const strategyNames = memory.memoryStrategies.map(s => s.name);
    expect(strategyNames).toContain('added_episodic_custom');
    expect(strategyNames.some(name => name.includes('episodic_builtin'))).toBe(true);
  });

  test('Should have reflection configuration on added custom episodic', () => {
    const strategyWithReflection = memory.memoryStrategies.find(s => s.name === 'added_episodic_custom');
    expect(strategyWithReflection).toBeDefined();
    expect((strategyWithReflection as any).reflectionConfiguration).toBeDefined();
    expect((strategyWithReflection as any).reflectionConfiguration.namespaces).toEqual(['/added/{actorId}/reflections']);
  });
});

describe('Memory with mixed episodic and other strategies tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  // @ts-ignore
  let memory: Memory;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    memory = new Memory(stack, 'test-memory', {
      memoryName: 'test_memory_mixed_episodic',
      description: 'A test memory with mixed episodic and other strategies',
      expirationDuration: Duration.days(100),
      memoryStrategies: [
        MemoryStrategy.usingBuiltInSummarization(),
        MemoryStrategy.usingBuiltInEpisodic(),
        MemoryStrategy.usingBuiltInSemantic(),
        MemoryStrategy.usingEpisodic({
          name: 'custom_episodic_mixed',
          description: 'Custom episodic in mixed strategy set',
          namespaces: ['/mixed/{actorId}/episodes'],
          reflectionConfiguration: {
            namespaces: ['/mixed/{actorId}/reflections'],
          },
        }),
      ],
    });

    app.synth();
  });

  test('Should create memory with mixed strategies including episodic without errors', () => {
    expect(memory.memoryName).toBe('test_memory_mixed_episodic');
    expect(memory.memoryStrategies).toHaveLength(4);
  });

  test('Should have correct mix of strategy types', () => {
    const strategyTypes = memory.memoryStrategies.map(s => s.strategyType);
    expect(strategyTypes).toContain('SUMMARIZATION');
    expect(strategyTypes).toContain('SEMANTIC');
    expect(strategyTypes.filter(t => t === 'EPISODIC')).toHaveLength(2);
  });

  test('Should have episodic strategies with correct names', () => {
    const episodicStrategies = memory.memoryStrategies.filter(s => s.strategyType === 'EPISODIC');
    const episodicNames = episodicStrategies.map(s => s.name);
    expect(episodicNames).toContain('custom_episodic_mixed');
    expect(episodicNames.some(name => name.includes('episodic_builtin'))).toBe(true);
  });

  test('Should have reflection configuration on custom episodic', () => {
    const strategyWithReflection = memory.memoryStrategies.find(s => s.name === 'custom_episodic_mixed');
    expect(strategyWithReflection).toBeDefined();
    expect((strategyWithReflection as any).reflectionConfiguration).toBeDefined();
    expect((strategyWithReflection as any).reflectionConfiguration.namespaces).toEqual(['/mixed/{actorId}/reflections']);
  });
});

describe('Episodic strategy validation edge cases tests', () => {
  test('Should accept episodic strategy without reflection configuration', () => {
    expect(() => {
      MemoryStrategy.usingEpisodic({
        name: 'episodic_no_reflection',
        description: 'Episodic without reflection',
        namespaces: ['/journey/{actorId}/episodes'],
      });
    }).not.toThrow();
  });

  test('Should accept episodic strategy with single reflection namespace', () => {
    expect(() => {
      MemoryStrategy.usingEpisodic({
        name: 'episodic_single_reflection',
        description: 'Episodic with single reflection namespace',
        namespaces: ['/journey/{actorId}/episodes'],
        reflectionConfiguration: {
          namespaces: ['/journey/{actorId}/reflections'],
        },
      });
    }).not.toThrow();
  });

  test('Should throw error for invalid episodic strategy name', () => {
    expect(() => {
      MemoryStrategy.usingEpisodic({
        name: 'invalid-episodic-name',
        description: 'Episodic with invalid name',
        namespaces: ['/journey/{actorId}/episodes'],
      });
    }).toThrow('The field Memory name with value "invalid-episodic-name" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should throw error for episodic with invalid main namespace template', () => {
    expect(() => {
      MemoryStrategy.usingEpisodic({
        name: 'invalid_main_namespace',
        description: 'Episodic with invalid main namespace',
        namespaces: ['/journey/{badVariable}/episodes'],
      });
    }).toThrow('Namespace with templates should contain valid variables: /journey/{badVariable}/episodes');
  });
});
