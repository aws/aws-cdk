import { CfnAgent } from 'aws-cdk-lib/aws-bedrock';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import * as validation from './validation-helpers';
import { IBedrockInvokable } from '../models';

/**
 * The step in the agent sequence that this prompt configuration applies to.
 */
export enum AgentStepType {
  /**
   * Pre-processing step that prepares the user input for orchestration.
   */
  PRE_PROCESSING = 'PRE_PROCESSING',

  /**
   * Main orchestration step that determines the agent's actions.
   */
  ORCHESTRATION = 'ORCHESTRATION',

  /**
   * Post-processing step that refines the agent's response.
   */
  POST_PROCESSING = 'POST_PROCESSING',

  /**
   * Step that classifies and routes requests to appropriate collaborators.
   */
  ROUTING_CLASSIFIER = 'ROUTING_CLASSIFIER',

  /**
   * Step that summarizes conversation history for memory retention.
   */
  MEMORY_SUMMARIZATION = 'MEMORY_SUMMARIZATION',

  /**
   * Step that generates responses using knowledge base content.
   */
  KNOWLEDGE_BASE_RESPONSE_GENERATION = 'KNOWLEDGE_BASE_RESPONSE_GENERATION',
}

/**
 * LLM inference configuration
 */
export interface InferenceConfiguration {
  /**
   * The likelihood of the model selecting higher-probability options while
   * generating a response. A lower value makes the model more likely to choose
   * higher-probability options, while a higher value makes the model more
   * likely to choose lower-probability options.
   *
   * Floating point
   *
   * min 0
   * max 1
   */
  readonly temperature: number;
  /**
   * While generating a response, the model determines the probability of the
   * following token at each point of generation. The value that you set for
   * Top P determines the number of most-likely candidates from which the model
   * chooses the next token in the sequence. For example, if you set topP to
   * 80, the model only selects the next token from the top 80% of the
   * probability distribution of next tokens.
   *
   * Floating point
   *
   * min 0
   * max 1
   */
  readonly topP: number;
  /**
   * While generating a response, the model determines the probability of the
   * following token at each point of generation. The value that you set for
   * topK is the number of most-likely candidates from which the model chooses
   * the next token in the sequence. For example, if you set topK to 50, the
   * model selects the next token from among the top 50 most likely choices.
   *
   * Integer
   *
   * min 0
   * max 500
   */
  readonly topK: number;
  /**
   * A list of stop sequences. A stop sequence is a sequence of characters that
   * causes the model to stop generating the response.
   *
   * length 0-4
   */
  readonly stopSequences: string[];
  /**
   * The maximum number of tokens to generate in the response.
   *
   * Integer
   *
   * min 0
   * max 4096
   */
  readonly maximumLength: number;
}

/**
 * Base configuration interface for all prompt step types
 */
export interface PromptStepConfigBase {
  /**
   * The type of step this configuration applies to.
   */
  readonly stepType: AgentStepType;

  /**
   * Whether to enable or skip this step in the agent sequence.
   * @default - The default state for each step type is as follows.
   *
   *     PRE_PROCESSING – ENABLED
   *     ORCHESTRATION – ENABLED
   *     KNOWLEDGE_BASE_RESPONSE_GENERATION – ENABLED
   *     POST_PROCESSING – DISABLED
   */
  readonly stepEnabled?: boolean;

  /**
   * The custom prompt template to be used.
   *
   * @default - The default prompt template will be used.
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-placeholders.html
   */
  readonly customPromptTemplate?: string;

  /**
   * The inference configuration parameters to use.
   * @default undefined - Default inference configuration will be used
   */
  readonly inferenceConfig?: InferenceConfiguration;

  /**
   * Whether to use the custom Lambda parser defined for the sequence.
   *
   * @default - false
   */
  readonly useCustomParser?: boolean;
}

/**
 * Configuration for the pre-processing step
 */
export interface PromptPreProcessingConfigCustomParser extends PromptStepConfigBase {}

/**
 * Configuration for the orchestration step
 */
export interface PromptOrchestrationConfigCustomParser extends PromptStepConfigBase {}

/**
 * Configuration for the post-processing step
 */
export interface PromptPostProcessingConfigCustomParser extends PromptStepConfigBase {}

/**
 * Configuration for the routing classifier step
 */
export interface PromptRoutingClassifierConfigCustomParser extends PromptStepConfigBase {
  /**
   * The foundation model to use for the routing classifier step.
   * This is required for the routing classifier step.
   */
  readonly foundationModel: IBedrockInvokable;
}

/**
 * Configuration for the memory summarization step
 */
export interface PromptMemorySummarizationConfigCustomParser extends PromptStepConfigBase {}

/**
 * Configuration for the knowledge base response generation step
 */
export interface PromptKnowledgeBaseResponseGenerationConfigCustomParser extends PromptStepConfigBase {}

/**
 * Properties for configuring a custom Lambda parser for prompt overrides.
 */
export interface CustomParserProps {
  /**
   * Lambda function to use as custom parser.
   * @default undefined - No custom parser is used
   */
  readonly parser?: IFunction;

  /**
   * Configuration for the pre-processing step.
   * @default undefined - No pre-processing configuration
   */
  readonly preProcessingStep?: PromptPreProcessingConfigCustomParser;

  /**
   * Configuration for the orchestration step.
   * @default undefined - No orchestration configuration
   */
  readonly orchestrationStep?: PromptOrchestrationConfigCustomParser;

  /**
   * Configuration for the post-processing step.
   * @default undefined - No post-processing configuration
   */
  readonly postProcessingStep?: PromptPostProcessingConfigCustomParser;

  /**
   * Configuration for the routing classifier step.
   * @default undefined - No routing classifier configuration
   */
  readonly routingClassifierStep?: PromptRoutingClassifierConfigCustomParser;

  /**
   * Configuration for the memory summarization step.
   * @default undefined - No memory summarization configuration
   */
  readonly memorySummarizationStep?: PromptMemorySummarizationConfigCustomParser;

  /**
   * Configuration for the knowledge base response generation step.
   * @default undefined - No knowledge base response generation configuration
   */
  readonly knowledgeBaseResponseGenerationStep?: PromptKnowledgeBaseResponseGenerationConfigCustomParser;
}

/**
 * Configuration for overriding prompt templates and behaviors in different parts
 * of an agent's sequence. This allows customizing how the agent processes inputs,
 * makes decisions, and generates responses.
 */
export class PromptOverrideConfiguration {
  /**
   * Creates a PromptOverrideConfiguration from individual step configurations.
   * Use this method when you want to override prompts without using a custom parser.
   * @param steps The step configurations to use
   * @returns A new PromptOverrideConfiguration instance
   */
  public static fromSteps(steps: PromptStepConfigBase[]): PromptOverrideConfiguration {
    if (!steps || steps.length === 0) {
      throw new validation.ValidationError('Steps array cannot be empty');
    }

    // Convert steps array to props format
    const stepMap = steps.reduce((acc, step) => {
      switch (step.stepType) {
        case AgentStepType.PRE_PROCESSING:
          return { ...acc, preProcessingStep: step };
        case AgentStepType.ORCHESTRATION:
          return { ...acc, orchestrationStep: step };
        case AgentStepType.POST_PROCESSING:
          return { ...acc, postProcessingStep: step };
        case AgentStepType.ROUTING_CLASSIFIER:
          return { ...acc, routingClassifierStep: step as PromptRoutingClassifierConfigCustomParser };
        case AgentStepType.MEMORY_SUMMARIZATION:
          return { ...acc, memorySummarizationStep: step };
        case AgentStepType.KNOWLEDGE_BASE_RESPONSE_GENERATION:
          return { ...acc, knowledgeBaseResponseGenerationStep: step };
        default:
          return acc;
      }
    }, {} as CustomParserProps);

    return new PromptOverrideConfiguration(stepMap);
  }

  /**
   * Creates a PromptOverrideConfiguration with a custom Lambda parser function.
   * @param props Configuration including:
   *   - `parser`: Lambda function to use as custom parser
   *   - Individual step configurations. At least one of the steps must make use of the custom parser.
   */
  public static withCustomParser(props: CustomParserProps): PromptOverrideConfiguration {
    return new PromptOverrideConfiguration(props);
  }

  /**
   * The custom Lambda parser function to use.
   * The Lambda parser processes and interprets the raw foundation model output.
   * It receives an input event with:
   * - messageVersion: Version of message format (1.0)
   * - agent: Info about the agent (name, id, alias, version)
   * - invokeModelRawResponse: Raw model output to parse
   * - promptType: Type of prompt being parsed
   * - overrideType: Type of override (OUTPUT_PARSER)
   *
   * The Lambda must return a response that the agent uses for next actions.
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/lambda-parser.html
   */
  readonly parser?: IFunction;

  /**
   * Configuration for the pre-processing step.
   */
  readonly preProcessingStep?: PromptPreProcessingConfigCustomParser;

  /**
   * Configuration for the orchestration step.
   */
  readonly orchestrationStep?: PromptOrchestrationConfigCustomParser;

  /**
   * Configuration for the post-processing step.
   */
  readonly postProcessingStep?: PromptPostProcessingConfigCustomParser;

  /**
   * Configuration for the routing classifier step.
   */
  readonly routingClassifierStep?: PromptRoutingClassifierConfigCustomParser;

  /**
   * Configuration for the memory summarization step.
   */
  readonly memorySummarizationStep?: PromptMemorySummarizationConfigCustomParser;

  /**
   * Configuration for the knowledge base response generation step.
   */
  readonly knowledgeBaseResponseGenerationStep?: PromptKnowledgeBaseResponseGenerationConfigCustomParser;

  /**
   * Create a new PromptOverrideConfiguration.
   *
   * @internal - This is marked as private so end users leverage it only through static methods
   */
  private constructor(props: CustomParserProps) {
    // Validate props
    validation.throwIfInvalid(this.validateSteps, props);
    if (props.parser) {
      validation.throwIfInvalid(this.validateCustomParser, props);
    }
    this.parser = props.parser;
    this.preProcessingStep = props.preProcessingStep;
    this.orchestrationStep = props.orchestrationStep;
    this.postProcessingStep = props.postProcessingStep;
    this.routingClassifierStep = props.routingClassifierStep;
    this.memorySummarizationStep = props.memorySummarizationStep;
    this.knowledgeBaseResponseGenerationStep = props.knowledgeBaseResponseGenerationStep;
  }

  /**
   * Format as CfnAgent.PromptOverrideConfigurationProperty
   *
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): CfnAgent.PromptOverrideConfigurationProperty {
    const configurations: CfnAgent.PromptConfigurationProperty[] = [];

    // Helper function to add configuration if step exists
    const addConfiguration = (step: PromptStepConfigBase | undefined, type: AgentStepType) => {
      if (step) {
        configurations.push({
          promptType: type,
          promptState: step.stepEnabled === undefined ? undefined : step.stepEnabled ? 'ENABLED' : 'DISABLED',
          parserMode: step.useCustomParser === undefined ? undefined : step.useCustomParser ? 'OVERRIDDEN' : 'DEFAULT',
          promptCreationMode: step.customPromptTemplate === undefined ? undefined : step.customPromptTemplate ? 'OVERRIDDEN' : 'DEFAULT',
          basePromptTemplate: step.customPromptTemplate,
          inferenceConfiguration: step.inferenceConfig,
          // Include foundation model if it's a routing classifier step
          foundationModel: type === AgentStepType.ROUTING_CLASSIFIER
            ? (step as PromptRoutingClassifierConfigCustomParser).foundationModel?.invokableArn
            : undefined,
        });
      }
    };

    // Add configurations for each step type if defined
    addConfiguration(this.preProcessingStep, AgentStepType.PRE_PROCESSING);
    addConfiguration(this.orchestrationStep, AgentStepType.ORCHESTRATION);
    addConfiguration(this.postProcessingStep, AgentStepType.POST_PROCESSING);
    addConfiguration(this.routingClassifierStep, AgentStepType.ROUTING_CLASSIFIER);
    addConfiguration(this.memorySummarizationStep, AgentStepType.MEMORY_SUMMARIZATION);
    addConfiguration(this.knowledgeBaseResponseGenerationStep, AgentStepType.KNOWLEDGE_BASE_RESPONSE_GENERATION);

    return {
      overrideLambda: this.parser?.functionArn,
      promptConfigurations: configurations,
    };
  }

  private validateInferenceConfig = (config?: InferenceConfiguration): string[] => {
    const errors: string[] = [];
    if (config) {
      if (config.temperature < 0 || config.temperature > 1) {
        errors.push('Temperature must be between 0 and 1');
      }
      if (config.topP < 0 || config.topP > 1) {
        errors.push('TopP must be between 0 and 1');
      }
      if (config.topK < 0 || config.topK > 500) {
        errors.push('TopK must be between 0 and 500');
      }
      if (config.stopSequences.length > 4) {
        errors.push('Maximum 4 stop sequences allowed');
      }
      if (config.maximumLength < 0 || config.maximumLength > 4096) {
        errors.push('MaximumLength must be between 0 and 4096');
      }
    }
    return errors;
  };

  private validateSteps = (props: CustomParserProps): string[] => {
    const errors: string[] = [];

    // Check if any steps are defined
    const hasSteps = [
      props.preProcessingStep,
      props.orchestrationStep,
      props.postProcessingStep,
      props.routingClassifierStep,
      props.memorySummarizationStep,
      props.knowledgeBaseResponseGenerationStep,
    ].some(step => step !== undefined);

    if (!hasSteps) {
      errors.push('Steps array cannot be empty');
    }

    // Helper function to validate a step's inference config
    const validateStep = (step: PromptStepConfigBase | undefined, stepName: string) => {
      if (step) {
        // Check for foundation model in non-ROUTING_CLASSIFIER steps
        if ('foundationModel' in step && step.stepType !== AgentStepType.ROUTING_CLASSIFIER) {
          errors.push('Foundation model can only be specified for ROUTING_CLASSIFIER step type');
        }

        const inferenceErrors = this.validateInferenceConfig(step.inferenceConfig);
        if (inferenceErrors.length > 0) {
          errors.push(`${stepName} step: ${inferenceErrors.join(', ')}`);
        }
      }
    };

    // Validate each step's inference config
    validateStep(props.preProcessingStep, 'Pre-processing');
    validateStep(props.orchestrationStep, 'Orchestration');
    validateStep(props.postProcessingStep, 'Post-processing');
    validateStep(props.routingClassifierStep, 'Routing classifier');
    validateStep(props.memorySummarizationStep, 'Memory summarization');
    validateStep(props.knowledgeBaseResponseGenerationStep, 'Knowledge base response generation');

    // Validate routing classifier's foundation model if provided
    if (props.routingClassifierStep?.foundationModel) {
      if (!props.routingClassifierStep.foundationModel.invokableArn) {
        errors.push('Foundation model must be a valid IBedrockInvokable with an invokableArn');
      }
    }

    return errors;
  };

  private validateCustomParser = (props: CustomParserProps): string[] => {
    const errors: string[] = [];

    // Check if at least one step uses custom parser
    const hasCustomParser = [
      props.preProcessingStep?.useCustomParser,
      props.orchestrationStep?.useCustomParser,
      props.postProcessingStep?.useCustomParser,
      props.routingClassifierStep?.useCustomParser,
      props.memorySummarizationStep?.useCustomParser,
      props.knowledgeBaseResponseGenerationStep?.useCustomParser,
    ].some(useCustomParser => useCustomParser === true);

    if (!hasCustomParser) {
      errors.push('At least one step must use custom parser');
    }

    return errors;
  };
}
