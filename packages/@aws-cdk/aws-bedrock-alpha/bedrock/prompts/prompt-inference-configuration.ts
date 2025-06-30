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
 * Configuration for model inference parameters used in prompts.
 *
 * This class provides a high-level abstraction over the underlying CloudFormation
 * inference configuration properties, offering a more developer-friendly interface
 * while maintaining full compatibility with the underlying AWS Bedrock service.
 */
export class PromptInferenceConfiguration {
  /**
   * The maximum number of tokens to return in the response.
   */
  public readonly maxTokens?: number;

  /**
   * A list of strings that define sequences after which the model will stop generating.
   */
  public readonly stopSequences?: string[];

  /**
   * Controls the randomness of the response.
   */
  public readonly temperature?: number;

  /**
   * The percentage of most-likely candidates that the model considers for the next token.
   */
  public readonly topP?: number;

  constructor(props: PromptInferenceConfigurationProps) {
    this.maxTokens = props.maxTokens;
    this.stopSequences = props.stopSequences;
    this.temperature = props.temperature;
    this.topP = props.topP;
  }

  /**
   * Renders the inference configuration as a CloudFormation property.
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): bedrock.CfnPrompt.PromptModelInferenceConfigurationProperty {
    return {
      maxTokens: this.maxTokens,
      stopSequences: this.stopSequences,
      temperature: this.temperature,
      topP: this.topP,
    };
  }
}
