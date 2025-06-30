import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import { Construct } from 'constructs';
// Internal Libs
import { IPrompt } from './prompt';
import * as validation from '../agents/validation-helpers';

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating a CDK managed Bedrock Prompt Version.
 */
export interface PromptVersionProps {
  /**
   * The prompt to use for this version.
   */
  readonly prompt: IPrompt;

  /**
   * The description of the prompt version.
   *
   * @default - No description provided.
   * Maximum length: 200
   */
  readonly description?: string;
}

/******************************************************************************
 *                        NEW CONSTRUCT DEFINITION
 *****************************************************************************/
/**
 * Class to create a Prompt Version with CDK.
 *
 * Creates a version of the prompt. Use this to create a static snapshot of your
 * prompt that can be deployed to production. Versions allow you to easily switch
 * between different configurations for your prompt and update your application
 * with the most appropriate version for your use-case.
 *
 * @cloudformationResource AWS::Bedrock::PromptVersion
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-management-deploy.html
 */
export class PromptVersion extends Construct {
  /******************************************************************************
   *                              ATTRIBUTES
   *****************************************************************************/
  /**
   * The Amazon Resource Name (ARN) of the prompt version.
   * @attribute
   * @example "arn:aws:bedrock:us-east-1:123456789012:prompt/PROMPT12345:1"
   */
  public readonly versionArn: string;

  /**
   * The prompt used by this version.
   */
  public readonly prompt: IPrompt;

  /**
   * The version of the prompt that was created.
   * @attribute
   */
  public readonly version: string;

  /**
   * The description of the prompt version.
   */
  public readonly description?: string;

  /******************************************************************************
   *                            INTERNAL ONLY
   *****************************************************************************/
  /**
   * Instance of prompt version.
   * @internal
   */
  private readonly __resource: bedrock.CfnPromptVersion;

  /******************************************************************************
   *                            CONSTRUCTOR
   *****************************************************************************/
  constructor(scope: Construct, id: string, props: PromptVersionProps) {
    super(scope, id);

    this.prompt = props.prompt;

    // Store description for validation
    this.description = props.description;

    // ------------------------------------------------------
    // Immediate Validation (throws error at construction time)
    // ------------------------------------------------------
    if (props.description) {
      validation.throwIfInvalid(this.validateDescriptionImmediate, props.description);
    }

    // ------------------------------------------------------
    // Synthesis-time Validation
    // ------------------------------------------------------
    this.node.addValidation({ validate: () => this.validateDescription() });

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    this.__resource = new bedrock.CfnPromptVersion(this, 'Resource', {
      description: props.description,
      promptArn: props.prompt.promptArn,
    });

    this.versionArn = this.__resource.attrArn;
    this.version = this.__resource.attrVersion;
  }

  /******************************************************************************
   *                            VALIDATION METHODS
   *****************************************************************************/
  /**
   * Validates whether the description length is within the allowed limit (immediate validation).
   * @param description - The description to validate
   * @returns Array of validation error messages, empty if valid
   */
  private validateDescriptionImmediate = (description: string): string[] => {
    const errors: string[] = [];

    if (description && description.length > 200) {
      errors.push(
        `Description must be 200 characters or less, got ${description.length} characters.`,
      );
    }

    return errors;
  };

  /**
   * Validates whether the description length is within the allowed limit.
   * @returns Array of validation error messages, empty if valid
   */
  private validateDescription(): string[] {
    const errors: string[] = [];

    if (this.description && this.description.length > 200) {
      errors.push(
        `Description must be 200 characters or less, got ${this.description.length} characters.`,
      );
    }

    return errors;
  }
}
