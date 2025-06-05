import { Stack } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {
  AgentStepType,
  PromptOverrideConfiguration,
  PromptRoutingClassifierConfigCustomParser,
  PromptPreProcessingConfigCustomParser,
  PromptOrchestrationConfigCustomParser,
  PromptPostProcessingConfigCustomParser,
} from '../../../bedrock/agents/prompt-override';
import { IBedrockInvokable } from '../../../bedrock/models';

describe('PromptOverrideConfiguration', () => {
  let stack: Stack;
  let mockFoundationModel: IBedrockInvokable;

  beforeEach(() => {
    stack = new Stack();
    mockFoundationModel = {
      invokableArn: 'arn:aws:bedrock:us-east-1:123456789012:foundation-model/anthropic.claude-v2',
      grantInvoke: jest.fn(),
    };
  });

  describe('fromSteps', () => {
    test('creates with valid steps', () => {
      // WHEN
      const config = PromptOverrideConfiguration.fromSteps([
        {
          stepType: AgentStepType.PRE_PROCESSING,
          stepEnabled: true,
          customPromptTemplate: 'test template',
          inferenceConfig: {
            temperature: 0.5,
            topP: 0.5,
            topK: 250,
            stopSequences: ['stop'],
            maximumLength: 2048,
          },
        },
      ]);

      // THEN
      const rendered = config._render();
      expect(rendered.promptConfigurations).toHaveLength(1);
      const configs = rendered.promptConfigurations as any[];
      expect(configs[0]).toEqual({
        promptType: AgentStepType.PRE_PROCESSING,
        promptState: 'ENABLED',
        parserMode: undefined,
        promptCreationMode: 'OVERRIDDEN',
        basePromptTemplate: 'test template',
        inferenceConfiguration: {
          temperature: 0.5,
          topP: 0.5,
          topK: 250,
          stopSequences: ['stop'],
          maximumLength: 2048,
        },
        foundationModel: undefined,
      });
    });

    test('creates with multiple steps', () => {
      // WHEN
      const config = PromptOverrideConfiguration.fromSteps([
        {
          stepType: AgentStepType.PRE_PROCESSING,
          stepEnabled: true,
          customPromptTemplate: 'pre template',
        },
        {
          stepType: AgentStepType.ORCHESTRATION,
          stepEnabled: true,
          customPromptTemplate: 'orchestration template',
        },
        {
          stepType: AgentStepType.POST_PROCESSING,
          stepEnabled: false,
          customPromptTemplate: 'post template',
        },
      ]);

      // THEN
      const rendered = config._render();
      expect(rendered.promptConfigurations).toHaveLength(3);
      const configs = rendered.promptConfigurations as any[];
      expect(configs[0].promptType).toBe(AgentStepType.PRE_PROCESSING);
      expect(configs[1].promptType).toBe(AgentStepType.ORCHESTRATION);
      expect(configs[2].promptType).toBe(AgentStepType.POST_PROCESSING);
    });

    test('creates with all step types', () => {
      // WHEN
      const config = PromptOverrideConfiguration.fromSteps([
        {
          stepType: AgentStepType.PRE_PROCESSING,
          stepEnabled: true,
        },
        {
          stepType: AgentStepType.ORCHESTRATION,
          stepEnabled: true,
        },
        {
          stepType: AgentStepType.POST_PROCESSING,
          stepEnabled: true,
        },
        {
          stepType: AgentStepType.ROUTING_CLASSIFIER,
          stepEnabled: true,
          foundationModel: mockFoundationModel,
        } as PromptRoutingClassifierConfigCustomParser,
        {
          stepType: AgentStepType.MEMORY_SUMMARIZATION,
          stepEnabled: true,
        },
        {
          stepType: AgentStepType.KNOWLEDGE_BASE_RESPONSE_GENERATION,
          stepEnabled: true,
        },
      ]);

      // THEN
      const rendered = config._render();
      expect(rendered.promptConfigurations).toHaveLength(6);
      const configs = rendered.promptConfigurations as any[];
      expect(configs.map(c => c.promptType)).toEqual([
        AgentStepType.PRE_PROCESSING,
        AgentStepType.ORCHESTRATION,
        AgentStepType.POST_PROCESSING,
        AgentStepType.ROUTING_CLASSIFIER,
        AgentStepType.MEMORY_SUMMARIZATION,
        AgentStepType.KNOWLEDGE_BASE_RESPONSE_GENERATION,
      ]);
    });

    test('throws error for empty steps', () => {
      // THEN
      expect(() => {
        PromptOverrideConfiguration.fromSteps([]);
      }).toThrow('Steps array cannot be empty');
    });
  });

  describe('withCustomParser', () => {
    test('creates with valid parser and steps', () => {
      // GIVEN
      const parser = new lambda.Function(stack, 'TestParser', {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = () => {}'),
      });

      // WHEN
      const config = PromptOverrideConfiguration.withCustomParser({
        parser,
        preProcessingStep: {
          stepType: AgentStepType.PRE_PROCESSING,
          useCustomParser: true,
        } as PromptPreProcessingConfigCustomParser,
      });

      // THEN
      const rendered = config._render();
      expect(rendered.overrideLambda).toBeDefined();
      const configs = rendered.promptConfigurations as any[];
      expect(configs[0].parserMode).toBe('OVERRIDDEN');
    });

    test('throws error when no step uses custom parser', () => {
      // GIVEN
      const parser = new lambda.Function(stack, 'TestParser', {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = () => {}'),
      });

      // THEN
      expect(() => {
        PromptOverrideConfiguration.withCustomParser({
          parser,
          preProcessingStep: {
            stepType: AgentStepType.PRE_PROCESSING,
            useCustomParser: false,
          } as PromptPreProcessingConfigCustomParser,
        });
      }).toThrow('At least one step must use custom parser');
    });
  });

  describe('inference configuration validation', () => {
    test('validates temperature range', () => {
      // THEN
      expect(() => {
        PromptOverrideConfiguration.fromSteps([
          {
            stepType: AgentStepType.PRE_PROCESSING,
            inferenceConfig: {
              temperature: 1.5,
              topP: 0.5,
              topK: 250,
              stopSequences: ['stop'],
              maximumLength: 2048,
            },
          },
        ]);
      }).toThrow('Temperature must be between 0 and 1');
    });

    test('validates topP range', () => {
      // THEN
      expect(() => {
        PromptOverrideConfiguration.fromSteps([
          {
            stepType: AgentStepType.PRE_PROCESSING,
            inferenceConfig: {
              temperature: 0.5,
              topP: 1.5,
              topK: 250,
              stopSequences: ['stop'],
              maximumLength: 2048,
            },
          },
        ]);
      }).toThrow('TopP must be between 0 and 1');
    });

    test('validates topK range', () => {
      // THEN
      expect(() => {
        PromptOverrideConfiguration.fromSteps([
          {
            stepType: AgentStepType.PRE_PROCESSING,
            inferenceConfig: {
              temperature: 0.5,
              topP: 0.5,
              topK: 501,
              stopSequences: ['stop'],
              maximumLength: 2048,
            },
          },
        ]);
      }).toThrow('TopK must be between 0 and 500');
    });

    test('validates stopSequences length', () => {
      // THEN
      expect(() => {
        PromptOverrideConfiguration.fromSteps([
          {
            stepType: AgentStepType.PRE_PROCESSING,
            inferenceConfig: {
              temperature: 0.5,
              topP: 0.5,
              topK: 250,
              stopSequences: ['stop1', 'stop2', 'stop3', 'stop4', 'stop5'],
              maximumLength: 2048,
            },
          },
        ]);
      }).toThrow('Maximum 4 stop sequences allowed');
    });

    test('validates maximumLength range', () => {
      // THEN
      expect(() => {
        PromptOverrideConfiguration.fromSteps([
          {
            stepType: AgentStepType.PRE_PROCESSING,
            inferenceConfig: {
              temperature: 0.5,
              topP: 0.5,
              topK: 250,
              stopSequences: ['stop'],
              maximumLength: 5000,
            },
          },
        ]);
      }).toThrow('MaximumLength must be between 0 and 4096');
    });
  });

  describe('foundation model validation', () => {
    test('allows foundation model for ROUTING_CLASSIFIER', () => {
      // WHEN
      const config = PromptOverrideConfiguration.fromSteps([
        {
          stepType: AgentStepType.ROUTING_CLASSIFIER,
          foundationModel: mockFoundationModel,
        } as PromptRoutingClassifierConfigCustomParser,
      ]);

      // THEN
      const rendered = config._render();
      const configs = rendered.promptConfigurations as any[];
      expect(configs[0].foundationModel).toBe(mockFoundationModel.invokableArn);
    });

    test('throws error for foundation model in non-ROUTING_CLASSIFIER step', () => {
      // THEN
      expect(() => {
        PromptOverrideConfiguration.fromSteps([
          {
            stepType: AgentStepType.PRE_PROCESSING,
            foundationModel: mockFoundationModel,
          } as PromptPreProcessingConfigCustomParser,
        ]);
      }).toThrow('Foundation model can only be specified for ROUTING_CLASSIFIER step type');
    });

    test('throws error for invalid foundation model', () => {
      // THEN
      expect(() => {
        PromptOverrideConfiguration.fromSteps([
          {
            stepType: AgentStepType.ROUTING_CLASSIFIER,
            foundationModel: {} as IBedrockInvokable,
          } as PromptRoutingClassifierConfigCustomParser,
        ]);
      }).toThrow('Foundation model must be a valid IBedrockInvokable with an invokableArn');
    });
  });

  describe('rendering', () => {
    test('renders step states correctly', () => {
      // WHEN
      const config = PromptOverrideConfiguration.fromSteps([
        {
          stepType: AgentStepType.PRE_PROCESSING,
          stepEnabled: true,
        },
        {
          stepType: AgentStepType.ORCHESTRATION,
          stepEnabled: false,
        },
        {
          stepType: AgentStepType.POST_PROCESSING,
          stepEnabled: undefined,
        },
      ]);

      // THEN
      const rendered = config._render();
      const configs = rendered.promptConfigurations as any[];
      expect(configs[0].promptState).toBe('ENABLED');
      expect(configs[1].promptState).toBe('DISABLED');
      expect(configs[2].promptState).toBeUndefined();
    });

    test('renders prompt creation modes correctly', () => {
      // WHEN
      const config = PromptOverrideConfiguration.fromSteps([
        {
          stepType: AgentStepType.PRE_PROCESSING,
          customPromptTemplate: 'custom template',
        },
        {
          stepType: AgentStepType.ORCHESTRATION,
          customPromptTemplate: '',
        },
        {
          stepType: AgentStepType.POST_PROCESSING,
          customPromptTemplate: undefined,
        },
      ]);

      // THEN
      const rendered = config._render();
      const configs = rendered.promptConfigurations as any[];
      expect(configs[0].promptCreationMode).toBe('OVERRIDDEN');
      expect(configs[1].promptCreationMode).toBe('DEFAULT');
      expect(configs[2].promptCreationMode).toBeUndefined();
    });

    test('renders parser modes correctly', () => {
      // WHEN
      const config = PromptOverrideConfiguration.withCustomParser({
        parser: new lambda.Function(stack, 'TestParser', {
          runtime: lambda.Runtime.NODEJS_18_X,
          handler: 'index.handler',
          code: lambda.Code.fromInline('exports.handler = () => {}'),
        }),
        preProcessingStep: {
          stepType: AgentStepType.PRE_PROCESSING,
          useCustomParser: true,
        } as PromptPreProcessingConfigCustomParser,
        orchestrationStep: {
          stepType: AgentStepType.ORCHESTRATION,
          useCustomParser: false,
        } as PromptOrchestrationConfigCustomParser,
        postProcessingStep: {
          stepType: AgentStepType.POST_PROCESSING,
          useCustomParser: undefined,
        } as PromptPostProcessingConfigCustomParser,
      });

      // THEN
      const rendered = config._render();
      const configs = rendered.promptConfigurations as any[];
      expect(configs[0].parserMode).toBe('OVERRIDDEN');
      expect(configs[1].parserMode).toBe('DEFAULT');
      expect(configs[2].parserMode).toBeUndefined();
    });
  });
});
