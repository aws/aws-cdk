import * as bedrock from 'aws-cdk-lib/aws-bedrock';

/**
 * Properties for creating a prompt inference configuration.
 */
export interface PromptInferenceConfigurationProps {
  /**
   * The maximum number of tokens to return in the response.
   *
   * @default - No limit specified
   */
  readonly maxTokens?: number;

  /**
   * A list of strings that define sequences after which the model will stop generating.
   *
   * @default - No stop sequences
   */
  readonly stopSequences?: string[];

  /**
   * Controls the randomness of the response.
   * Higher values make output more random, lower values more deterministic.
   * Valid range is 0.0 to 1.0.
   *
   * @default - Model default temperature
   */
  readonly temperature?: number;

  /**
   * The percentage of most-likely candidates that the model considers for the next token.
   * Valid range is 0.0 to 1.0.
   *
   * @default - Model default topP
   */
  readonly topP?: number;
}

/**
 * Abstract base class for prompt inference configurations.
 *
 * This provides a high-level abstraction over the underlying CloudFormation
 * inference configuration properties, offering a more developer-friendly interface
 * while maintaining full compatibility with the underlying AWS Bedrock service.
 */
export abstract class PromptInferenceConfiguration {
  /**
   * Creates a text inference configuration.
   */
  public static text(props: PromptInferenceConfigurationProps): PromptInferenceConfiguration {
    return new TextInferenceConfiguration(props);
  }

  /**
   * Renders the inference configuration as a CloudFormation property.
   * @internal This is an internal core function and should not be called directly.
   */
  public abstract _render(): bedrock.CfnPrompt.PromptInferenceConfigurationProperty;
}

/**
 * Text inference configuration for prompts.
 */
class TextInferenceConfiguration extends PromptInferenceConfiguration {
  constructor(private readonly props: PromptInferenceConfigurationProps) {
    super();
  }

  public _render(): bedrock.CfnPrompt.PromptInferenceConfigurationProperty {
    return {
      text: {
        maxTokens: this.props.maxTokens,
        stopSequences: this.props.stopSequences,
        temperature: this.props.temperature,
        topP: this.props.topP,
      },
    };
  }
}
