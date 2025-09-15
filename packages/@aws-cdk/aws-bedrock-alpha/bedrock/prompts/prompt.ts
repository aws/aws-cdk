import { Arn, ArnFormat, IResource, Lazy, Resource, ValidationError } from 'aws-cdk-lib/core';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';
import { md5hash } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';

// Internal Libs
import { IPromptVariant } from './prompt-variant';
import { PromptVersion } from './prompt-version';
import * as validation from '../agents/validation-helpers';

/******************************************************************************
 *                              COMMON
 *****************************************************************************/
/**
 * Represents a Prompt, either created with CDK or imported.
 */
export interface IPrompt extends IResource {
  /**
   * The ARN of the prompt.
   * @attribute
   * @example "arn:aws:bedrock:us-east-1:123456789012:prompt/PROMPT12345"
   */
  readonly promptArn: string;

  /**
   * The ID of the prompt.
   * @attribute
   * @example "PROMPT12345"
   */
  readonly promptId: string;

  /**
   * The version of the prompt.
   * @attribute
   * @default "DRAFT"
   */
  readonly promptVersion: string;

  /**
   * Optional KMS encryption key associated with this prompt.
   */
  readonly kmsKey?: kms.IKey;

  /**
   * Grant the given identity permissions to get the prompt.
   */
  grantGet(grantee: iam.IGrantable): iam.Grant;
}

/******************************************************************************
 *                        ABSTRACT BASE CLASS
 *****************************************************************************/
/**
 * Abstract base class for a Prompt.
 * Contains methods and attributes valid for Prompts either created with CDK or imported.
 */
export abstract class PromptBase extends Resource implements IPrompt {
  public abstract readonly promptArn: string;
  public abstract readonly promptId: string;
  public abstract readonly kmsKey?: kms.IKey;
  public abstract readonly promptVersion: string;

  /**
   * Grant the given identity permissions to get the prompt.
   *
   * @param grantee - The IAM principal to grant permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock:GetPrompt']
   * - resourceArns: [this.promptArn]
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantGet(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      resourceArns: [this.promptArn],
      actions: ['bedrock:GetPrompt'],
      scope: this,
    });
  }
}

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating a CDK managed Bedrock Prompt.
 */
export interface PromptProps {
  /**
   * The name of the prompt.
   * This will be used as the physical name of the prompt.
   * Allowed Pattern: ^([0-9a-zA-Z][_-]?){1,100}$
   */
  readonly promptName: string;

  /**
   * A description of what the prompt does.
   *
   * @default - No description provided.
   * Maximum Length: 200
   */
  readonly description?: string;

  /**
   * The KMS key that the prompt is encrypted with.
   *
   * @default - AWS owned and managed key.
   */
  readonly kmsKey?: kms.IKey;

  /**
   * The Prompt Variant that will be used by default.
   *
   * @default - No default variant provided.
   */
  readonly defaultVariant?: IPromptVariant;

  /**
   * The variants of your prompt. Variants can use different messages, models,
   * or configurations so that you can compare their outputs to decide the best
   * variant for your use case. Maximum of 1 variants.
   *
   * @default - No additional variants provided.
   */
  readonly variants?: IPromptVariant[];

  /**
   * Tags to apply to the prompt.
   *
   * @default - No tags applied.
   */
  readonly tags?: Record<string, string>;
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
/**
 * Attributes for specifying an imported Bedrock Prompt.
 */
export interface PromptAttributes {
  /**
   * The ARN of the prompt.
   * @attribute
   * @example "arn:aws:bedrock:us-east-1:123456789012:prompt/PROMPT12345"
   */
  readonly promptArn: string;

  /**
   * Optional KMS encryption key associated with this prompt.
   * @default undefined - An AWS managed key is used
   */
  readonly kmsKey?: kms.IKey;

  /**
   * The version of the prompt.
   * @default "DRAFT"
   */
  readonly promptVersion?: string;
}

/******************************************************************************
 *                        NEW CONSTRUCT DEFINITION
 *****************************************************************************/
/**
 * Class to create (or import) a Prompt with CDK.
 *
 * Prompts are a specific set of inputs that guide Foundation Models (FMs) on Amazon Bedrock to
 * generate an appropriate response or output for a given task or instruction.
 * You can optimize the prompt for specific use cases and models.
 *
 * @cloudformationResource AWS::Bedrock::Prompt
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-management.html
 */
@propertyInjectable
export class Prompt extends PromptBase implements IPrompt {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-alpha.Prompt';

  /******************************************************************************
   *                            IMPORT METHODS
   *****************************************************************************/
  /**
   * Creates a Prompt reference from an existing prompt's attributes.
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   * @param attrs - Attributes of the existing prompt
   * @default - For attrs.promptVersion: 'DRAFT' if no explicit version is provided
   * @returns An IPrompt reference to the existing prompt
   */
  public static fromPromptAttributes(scope: Construct, id: string, attrs: PromptAttributes): IPrompt {
    const formattedArn = Arn.split(attrs.promptArn, ArnFormat.SLASH_RESOURCE_NAME);

    class Import extends PromptBase {
      public readonly promptArn = attrs.promptArn;
      public readonly promptId = formattedArn.resourceName!;
      public readonly promptVersion = attrs.promptVersion ?? 'DRAFT';
      public readonly kmsKey = attrs.kmsKey;
    }

    return new Import(scope, id);
  }

  /**
   * The maximum number of variants allowed for a prompt.
   * @internal
   */
  private static readonly MAX_VARIANTS = 1;

  /**
   * The name of the prompt.
   * @attribute
   */
  public readonly promptName: string;

  /**
   * The KMS key that the prompt is encrypted with.
   */
  public readonly kmsKey?: kms.IKey;

  /**
   * The ARN of the prompt.
   * @attribute
   * @example "arn:aws:bedrock:us-east-1:123456789012:prompt/PROMPT12345"
   */
  public readonly promptArn: string;

  /**
   * The ID of the prompt.
   * @attribute
   * @example "PROMPT12345"
   */
  public readonly promptId: string;

  /**
   * The version of the prompt.
   * @attribute
   */
  public readonly promptVersion: string;

  /**
   * The variants of the prompt.
   */
  public readonly variants: IPromptVariant[];

  /**
   * The description of the prompt.
   */
  public readonly description?: string;

  /******************************************************************************
   *                            INTERNAL ONLY
   *****************************************************************************/
  /**
   * The computed hash of the prompt properties.
   * @internal
   */
  protected readonly _hash: string;

  /**
   * L1 resource
   * @internal
   */
  private readonly __resource: bedrock.CfnPrompt;

  /******************************************************************************
   *                            CONSTRUCTOR
   *****************************************************************************/
  constructor(scope: Construct, id: string, props: PromptProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // ------------------------------------------------------
    // Set properties and defaults
    // ------------------------------------------------------
    this.promptName = props.promptName;
    this.description = props.description;
    this.kmsKey = props.kmsKey;
    this.variants = props.variants ?? [];

    // ------------------------------------------------------
    // Validation
    // ------------------------------------------------------
    this.validatePromptDefault(props);
    this.node.addValidation({ validate: () => this.validatePromptName() });
    this.node.addValidation({ validate: () => this.validatePromptVariants() });
    this.node.addValidation({ validate: () => this.validateDescription() });
    this.node.addValidation({ validate: () => this.validateVariantNames() });

    // ------------------------------------------------------
    // CFN Props - With Lazy support
    // ------------------------------------------------------
    const cfnProps: bedrock.CfnPromptProps = {
      customerEncryptionKeyArn: this.kmsKey?.keyArn,
      defaultVariant: props.defaultVariant?.name,
      description: props.description,
      name: props.promptName,
      variants: Lazy.any({
        produce: () => this.variants.map(variant => {
          const variantConfig: any = {
            name: variant.name,
            templateType: variant.templateType,
            templateConfiguration: variant.templateConfiguration._render(),
          };

          if (variant.modelId) {
            variantConfig.modelId = variant.modelId;
          }

          if (variant.inferenceConfiguration) {
            variantConfig.inferenceConfiguration = variant.inferenceConfiguration._render();
          }

          if (variant.genAiResource) {
            variantConfig.genAiResource = variant.genAiResource._render();
          }

          return variantConfig;
        }),
      }),
      tags: props.tags,
    };

    // Hash calculation useful for versioning
    this._hash = md5hash(JSON.stringify(cfnProps));

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    this.__resource = new bedrock.CfnPrompt(this, 'Resource', cfnProps);

    this.promptArn = this.__resource.attrArn;
    this.promptId = this.__resource.attrId;
    this.promptVersion = this.__resource.attrVersion;
  }

  /******************************************************************************
   *                            VALIDATION METHODS
   *****************************************************************************/
  /**
   * Validates whether the prompt name is valid according to the specification.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-bedrock-prompt.html#cfn-bedrock-prompt-name
   * @returns Array of validation error messages, empty if valid
   */
  private validatePromptName(): string[] {
    const errors: string[] = [];

    // Use existing validation helper for pattern validation
    const patternErrors = validation.validateFieldPattern(
      this.promptName,
      'promptName',
      /^([0-9a-zA-Z][_-]?){1,100}$/,
      'Valid characters are a-z, A-Z, 0-9, _ (underscore) and - (hyphen). Must not begin with a hyphen and must be 1-100 characters long.',
    );

    errors.push(...patternErrors);
    return errors;
  }

  /**
   * Validates whether the number of prompt variants is respected.
   * @returns Array of validation error messages, empty if valid
   */
  private validatePromptVariants(): string[] {
    const errors: string[] = [];

    if (this.variants.length > Prompt.MAX_VARIANTS) {
      errors.push(
        `Too many variants specified. The maximum allowed is ${Prompt.MAX_VARIANTS}, but you have provided ${this.variants.length} variants.`,
      );
    }

    return errors;
  }

  /**
   * Validates that if the prompt has a default, it was also added to the variants array
   * @param props - The properties set in the constructor
   */
  private validatePromptDefault(props: PromptProps) {
    if (props.defaultVariant && !props.variants?.includes(props.defaultVariant)) {
      throw new ValidationError('The \'defaultVariant\' needs to be included in the \'variants\' array.', this);
    }
  }

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

  /**
   * Validates whether all variant names are unique.
   * @returns Array of validation error messages, empty if valid
   */
  private validateVariantNames(): string[] {
    const errors: string[] = [];
    const names = this.variants.map(v => v.name);
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);

    if (duplicates.length > 0) {
      const uniqueDuplicates = [...new Set(duplicates)];
      errors.push(
        `Duplicate variant names found: ${uniqueDuplicates.join(', ')}. Each variant must have a unique name.`,
      );
    }

    return errors;
  }

  /******************************************************************************
   *                            HELPER METHODS
   *****************************************************************************/
  /**
   * Creates a prompt version, a static snapshot of your prompt that can be
   * deployed to production.
   *
   * @param description - Optional description for the version
   * @default - No description provided
   * @returns A PromptVersion object containing the version details including ARN and version string
   */
  @MethodMetadata()
  public createVersion(description?: string): PromptVersion {
    return new PromptVersion(this, `PromptVersion-${this._hash}`, {
      prompt: this,
      description,
    });
  }

  /**
   * Adds a prompt variant to the prompt.
   *
   * @param variant - The prompt variant to add
   * @throws ValidationError if adding the variant would exceed the maximum allowed variants
   */
  @MethodMetadata()
  public addVariant(variant: IPromptVariant): void {
    validation.throwIfInvalid(this.validateVariantAddition, variant);
    this.variants.push(variant);
  }

  /**
   * Validates whether a variant can be added without exceeding limits.
   * @param variant - The variant to validate
   * @returns Array of validation error messages, empty if valid
   */
  private validateVariantAddition = (variant: IPromptVariant): string[] => {
    const errors: string[] = [];

    // Check if adding this variant would exceed the maximum
    if (this.variants.length >= Prompt.MAX_VARIANTS) {
      errors.push(
        `Cannot add variant to prompt '${this.promptName}'. Maximum of ${Prompt.MAX_VARIANTS} variants allowed, currently have ${this.variants.length}.`,
      );
    }

    // Check for duplicate variant names
    if (this.variants.find(v => v.name === variant.name)) {
      errors.push(`Variant with name '${variant.name}' already exists.`);
    }

    return errors;
  };
}
