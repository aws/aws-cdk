import { Token, Lazy, Names } from 'aws-cdk-lib';
import * as bedrockagentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { IRuntimeEndpoint, RuntimeEndpointAttributes } from './runtime-endpoint-base';
import { RuntimeEndpointBase } from './runtime-endpoint-base';
import { validateStringField, validateFieldPattern, ValidationError } from './validation-helpers';

/******************************************************************************
 *                                Props
 *****************************************************************************/

/**
 * Properties for creating a Bedrock Agent Core Runtime Endpoint resource
 */
export interface RuntimeEndpointProps {
  /**
   * The name of the agent runtime endpoint
   * Valid characters are a-z, A-Z, 0-9, _ (underscore)
   * Must start with a letter and can be up to 48 characters long
   * Pattern: ^[a-zA-Z][a-zA-Z0-9_]{0,47}$
   * @default - auto generate
   */
  readonly endpointName?: string;

  /**
   * The ID of the agent runtime to associate with this endpoint
   * This is the unique identifier of the runtime resource
   * Pattern: ^[a-zA-Z][a-zA-Z0-9_]{0,99}-[a-zA-Z0-9]{10}$
   */
  readonly agentRuntimeId: string;

  /**
   * The version of the agent runtime to use for this endpoint
   * If not specified, the endpoint will point to version "1" of the runtime.
   * Pattern: ^([1-9][0-9]{0,4})$
   * @default "1"
   */
  readonly agentRuntimeVersion?: string;

  /**
   * Optional description for the agent runtime endpoint
   * Length Minimum: 1 ,  Maximum: 256
   * @default - No description
   */
  readonly description?: string;

  /**
   * Tags for the agent runtime endpoint
   * A list of key:value pairs of tags to apply to this RuntimeEndpoint resource
   * Pattern: ^[a-zA-Z0-9\s._:/=+@-]*$
   * @default {} - no tags
   */
  readonly tags?: { [key: string]: string };
}

/******************************************************************************
 *                                Class
 *****************************************************************************/

/**
 * Bedrock Agent Core Runtime Endpoint
 * Provides a stable endpoint for invoking agent runtimes with versioning support
 *
 * @resource AWS::BedrockAgentCore::RuntimeEndpoint
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-endpoint.html
 */
@propertyInjectable
export class RuntimeEndpoint extends RuntimeEndpointBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-agentcore-alpha.RuntimeEndpoint';

  /**
   * Import an existing Agent Runtime Endpoint using attributes
   * This allows you to reference an Agent Runtime Endpoint that was created outside of CDK
   *
   * @param scope The construct scope
   * @param id The construct id
   * @param attrs The attributes of the existing Agent Runtime Endpoint
   * @returns An IRuntimeEndpoint instance representing the imported endpoint
   */
  public static fromRuntimeEndpointAttributes(
    scope: Construct,
    id: string,
    attrs: RuntimeEndpointAttributes,
  ): IRuntimeEndpoint {
    class ImportedBedrockAgentRuntimeEndpoint extends RuntimeEndpointBase {
      public readonly agentRuntimeEndpointArn = attrs.agentRuntimeEndpointArn;
      public readonly endpointName = attrs.endpointName;
      public readonly agentRuntimeArn = attrs.agentRuntimeArn;
      public readonly description = attrs.description;
      public readonly status = attrs.status;
      public readonly liveVersion = attrs.liveVersion;
      public readonly targetVersion = attrs.targetVersion;
      public readonly createdAt = attrs.createdAt;
      public readonly endpointId = attrs.endpointId;
      public readonly lastUpdatedAt = attrs.lastUpdatedAt;
    }

    return new ImportedBedrockAgentRuntimeEndpoint(scope, id);
  }

  // Properties from base interface
  /**
   * The ARN of the agent runtime endpoint
   * @attribute
   * @returns a token representing the ARN of this agent runtime endpoint
   */
  public readonly agentRuntimeEndpointArn: string;
  /**
   * The name of the endpoint
   * @attribute
   * @returns a token representing the name of this endpoint
   */
  public readonly endpointName: string;
  /**
   * The ARN of the agent runtime associated with this endpoint
   * @attribute
   * @returns a token representing the ARN of the agent runtime
   */
  public readonly agentRuntimeArn: string;
  /**
   * The status of the endpoint
   * @attribute
   * @returns a token representing the status of this endpoint
   */
  public readonly status?: string;
  /**
   * The live version of the endpoint
   * @attribute
   * @returns a token representing the live version of this endpoint
   */
  public readonly liveVersion?: string;
  /**
   * The target version of the endpoint
   * @attribute
   * @returns a token representing the target version of this endpoint
   */
  public readonly targetVersion?: string;
  /**
   * The timestamp when the endpoint was created
   * @attribute
   * @returns a token representing the creation timestamp of this endpoint
   */
  public readonly createdAt?: string;
  /**
   * Optional description for the endpoint
   */
  public readonly description?: string;
  /**
   * The unique identifier of the runtime endpoint
   * @attribute
   * @returns a token representing the ID of this endpoint
   */
  public readonly endpointId: string;
  /**
   * The ID of the agent runtime associated with this endpoint
   */
  public readonly agentRuntimeId: string;
  /**
   * The version of the agent runtime used by this endpoint
   */
  public readonly agentRuntimeVersion: string;
  /**
   * When this endpoint was last updated
   * @attribute
   * @returns a token representing the last update timestamp of this endpoint
   */
  public readonly lastUpdatedAt?: string;

  private readonly endpointResource: bedrockagentcore.CfnRuntimeEndpoint;

  constructor(scope: Construct, id: string, props: RuntimeEndpointProps) {
    super(scope, id, {
      // Maximum name length of 48 characters
      // @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-bedrockagentcore-runtimeendpoint.html#cfn-bedrockagentcore-runtimeendpoint-name
      physicalName: props.endpointName ??
        Lazy.string({
          produce: () => Names.uniqueResourceName(this, { maxLength: 48 }),
        }),
    });

    // CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // Set and validate properties immediately
    this.endpointName = this.physicalName;
    this.validateEndpointName();

    this.agentRuntimeId = props.agentRuntimeId;
    this.validateAgentRuntimeId();

    this.agentRuntimeVersion = props.agentRuntimeVersion ?? '1';
    this.validateAgentRuntimeVersion();

    this.description = props.description;
    if (this.description) {
      this.validateDescription();
    }

    if (props.tags) {
      this.validateTags(props.tags);
    }

    const cfnProps: bedrockagentcore.CfnRuntimeEndpointProps = {
      name: this.endpointName,
      agentRuntimeId: Lazy.string({
        produce: () => this.renderAgentRuntimeId(),
      }),
      agentRuntimeVersion: Lazy.string({
        produce: () => this.renderAgentRuntimeVersion(),
      }),
      description: Lazy.string({
        produce: () => this.renderDescription(),
      }),
      tags: props.tags ?? {},
    };

    this.endpointResource = new bedrockagentcore.CfnRuntimeEndpoint(this, 'Resource', cfnProps);

    this.endpointId = this.endpointResource.attrId;
    this.agentRuntimeEndpointArn = this.endpointResource.attrAgentRuntimeEndpointArn;
    this.agentRuntimeArn = this.endpointResource.attrAgentRuntimeArn;
    this.status = this.endpointResource.attrStatus;
    this.liveVersion = this.endpointResource.attrLiveVersion;
    this.targetVersion = this.endpointResource.attrTargetVersion;
    this.createdAt = this.endpointResource.attrCreatedAt;
    this.lastUpdatedAt = this.endpointResource.attrLastUpdatedAt;
  }

  /**
   * Renders the agent runtime ID for CloudFormation
   * @internal
   */
  private renderAgentRuntimeId(): string {
    return this.agentRuntimeId;
  }

  /**
   * Renders the agent runtime version for CloudFormation
   * @internal
   */
  private renderAgentRuntimeVersion(): string {
    return this.agentRuntimeVersion;
  }

  /**
   * Renders the description for CloudFormation
   * @internal
   */
  private renderDescription(): string | undefined {
    return this.description;
  }

  /**
   * Validates the endpoint name format
   * Pattern: ^[a-zA-Z][a-zA-Z0-9_]{0,47}$
   * @throws Error if validation fails
   */
  private validateEndpointName(): void {
    // Skip validation if the name contains CDK tokens (unresolved values)
    if (Token.isUnresolved(this.endpointName)) {
      return;
    }

    // Validate length
    const lengthErrors = validateStringField({
      value: this.endpointName,
      fieldName: 'Endpoint name',
      minLength: 1,
      maxLength: 48,
    });

    // Validate pattern
    const patternErrors = validateFieldPattern(
      this.endpointName,
      'Endpoint name',
      /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/,
      'Endpoint name must start with a letter and contain only letters, numbers, and underscores',
    );

    // Combine and throw if any errors
    const allErrors = [...lengthErrors, ...patternErrors];
    if (allErrors.length > 0) {
      throw new ValidationError(allErrors.join('\n'));
    }
  }

  /**
   * Validates the description format
   * Must be between 1 and 256 characters (per CloudFormation specification)
   * @throws Error if validation fails
   */
  private validateDescription(): void {
    if (Token.isUnresolved(this.description)) {
      return;
    }

    if (this.description) {
      const errors = validateStringField({
        value: this.description,
        fieldName: 'Description',
        minLength: 1,
        maxLength: 256,
      });

      if (errors.length > 0) {
        throw new ValidationError(errors.join('\n'));
      }
    }
  }

  /**
   * Validates the agent runtime ID format
   * Pattern: ^[a-zA-Z][a-zA-Z0-9_]{0,99}-[a-zA-Z0-9]{10}$
   * @throws Error if validation fails
   */
  private validateAgentRuntimeId(): void {
    // Skip validation if the ID contains CDK tokens (unresolved values)
    if (Token.isUnresolved(this.agentRuntimeId)) {
      return;
    }

    // Validate pattern only (no length validation per AWS specs)
    const patternErrors = validateFieldPattern(
      this.agentRuntimeId,
      'Agent runtime ID',
      /^[a-zA-Z][a-zA-Z0-9_]{0,99}-[a-zA-Z0-9]{10}$/,
      'Agent runtime ID must start with a letter, followed by up to 99 alphanumeric or underscore characters, then a hyphen, and exactly 10 alphanumeric characters',
    );

    if (patternErrors.length > 0) {
      throw new ValidationError(patternErrors.join('\n'));
    }
  }

  /**
   * Validates the agent runtime version format
   * Pattern: ^([1-9][0-9]{0,4})$
   * @throws Error if validation fails
   */
  private validateAgentRuntimeVersion(): void {
    if (Token.isUnresolved(this.agentRuntimeVersion)) {
      return;
    }

    // Validate pattern only (no length validation per AWS specs)
    const patternErrors = validateFieldPattern(
      this.agentRuntimeVersion,
      'Agent runtime version',
      /^[1-9]\d{0,4}$/,
      'Agent runtime version must be a number between 1 and 99999',
    );

    if (patternErrors.length > 0) {
      throw new ValidationError(patternErrors.join('\n'));
    }
  }

  /**
   * Validates the tags format
   * @param tags The tags object to validate
   * @throws Error if validation fails
   */
  private validateTags(tags: { [key: string]: string }): void {
    for (const [key, value] of Object.entries(tags)) {
      if (Token.isUnresolved(key) || Token.isUnresolved(value)) {
        continue;
      }

      // Validate tag key length
      const keyLengthErrors = validateStringField({
        value: key,
        fieldName: `Tag key "${key}"`,
        minLength: 1,
        maxLength: 256,
      });

      // Validate tag key pattern
      const keyPatternErrors = validateFieldPattern(
        key,
        `Tag key "${key}"`,
        /^[a-zA-Z0-9\s._:/=+@-]*$/,
        `Tag key "${key}" can only contain letters (a-z, A-Z), numbers (0-9), spaces, and special characters (._:/=+@-)`,
      );

      // Combine key errors and throw if any
      const keyErrors = [...keyLengthErrors, ...keyPatternErrors];
      if (keyErrors.length > 0) {
        throw new ValidationError(keyErrors.join('\n'));
      }

      if (value === undefined || value === null) {
        throw new ValidationError(`Tag value for key "${key}" cannot be null or undefined`);
      }

      // Validate tag value length
      const valueLengthErrors = validateStringField({
        value: value,
        fieldName: `Tag value for key "${key}"`,
        minLength: 0,
        maxLength: 256,
      });

      // Validate tag value pattern
      const valuePatternErrors = validateFieldPattern(
        value,
        `Tag value for key "${key}"`,
        /^[a-zA-Z0-9\s._:/=+@-]*$/,
        `Tag value for key "${key}" can only contain letters (a-z, A-Z), numbers (0-9), spaces, and special characters (._:/=+@-)`,
      );

      // Combine value errors and throw if any
      const valueErrors = [...valueLengthErrors, ...valuePatternErrors];
      if (valueErrors.length > 0) {
        throw new ValidationError(valueErrors.join('\n'));
      }
    }
  }
}
