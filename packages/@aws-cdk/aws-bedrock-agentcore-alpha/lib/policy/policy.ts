import { Arn, ArnFormat, Lazy, Names } from 'aws-cdk-lib';
import type { CfnPolicyProps } from 'aws-cdk-lib/aws-bedrockagentcore';
import { CfnPolicy } from 'aws-cdk-lib/aws-bedrockagentcore';
import * as iam from 'aws-cdk-lib/aws-iam';
import { ValidationError } from 'aws-cdk-lib/core/lib/errors';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
// Internal imports
import type { IPolicy, PolicyAttributes } from './policy-base';
import { PolicyBase } from './policy-base';
import type { IPolicyEngine } from './policy-engine-base';
import type { PolicyStatement } from './policy-statement';
import { PolicyValidationMode } from './policy-types';
import { throwIfInvalidPolicyName, throwIfInvalidDescription, throwIfInvalidPolicyDefinition } from './validation-helpers';

/**
 * Properties for creating a Policy resource
 */
export interface PolicyProps {
  /**
   * The name of the policy.
   * Valid characters: a-z, A-Z, 0-9, _ (underscore)
   * Must start with a letter, 1-48 characters
   * Pattern: ^[A-Za-z][A-Za-z0-9_]*$
   *
   * @default - Auto-generated unique name
   */
  readonly policyName?: string;

  /**
   * The policy engine this policy belongs to.
   * [disable-awslint:prefer-ref-interface]
   */
  readonly policyEngine: IPolicyEngine;

  /**
   * Cedar policy statement.
   * The authorization policy written in Cedar policy language.
   *
   * Cedar supports permit and forbid rules with conditions.
   * The statement will be wrapped in a PolicyDefinition structure internally.
   *
   * Pass the raw Cedar statement as a string. For example:
   * - "permit(principal, action, resource);"
   * - "permit(principal in Group::\"Admins\", action == Action::\"InvokeModel\", resource) when { context.environment == \"production\" };"
   *
   * You must specify either `definition` or `statement`, but not both.
   *
   * @default - Must provide either definition or statement
   */
  readonly definition?: string;

  /**
   * Type-safe Cedar policy statement built using PolicyStatement builder.
   *
   * Use this for a type-safe, form-like API to build Cedar policies without
   * writing raw Cedar syntax. The builder validates at synthesis time.
   *
   * You must specify either `definition` or `statement`, but not both.
   *
   * @default - Must provide either definition or statement
   */
  readonly statement?: PolicyStatement;

  /**
   * Optional description for the policy.
   * Maximum length of 4096.
   * @default - No description
   */
  readonly description?: string;

  /**
   * Validation mode for the policy.
   * Controls how Cedar analyzer validation findings are handled.
   *
   * @default PolicyValidationMode.FAIL_ON_ANY_FINDINGS
   */
  readonly validationMode?: PolicyValidationMode;
}

/**
 * Individual Cedar policy defining what agents can access.
 * Policies use Cedar language to specify precise access control rules
 * that are evaluated deterministically by the PolicyEngine.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html
 * @resource AWS::BedrockAgentCore::Policy
 */
@propertyInjectable
export class Policy extends PolicyBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-agentcore-alpha.Policy';

  /**
   * Creates a Policy reference from an existing policy's attributes.
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   * @param attrs - Attributes of the existing policy
   * @returns An IPolicy reference to the existing policy
   */
  public static fromPolicyAttributes(scope: Construct, id: string, attrs: PolicyAttributes): IPolicy {
    class Import extends PolicyBase {
      public readonly policyArn = attrs.policyArn;
      public readonly policyId = Arn.split(attrs.policyArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
      public readonly policyName = this.policyId;
      public readonly description = undefined;
      public readonly validationMode = undefined;
      public readonly policyEngine = attrs.policyEngine;
      public readonly grantPrincipal = new iam.UnknownPrincipal({ resource: this });
    }

    return new Import(scope, id);
  }

  // ------------------------------------------------------
  // Attributes
  // ------------------------------------------------------

  /**
   * The ARN of the policy resource.
   * @attribute
   */
  public readonly policyArn: string;

  /**
   * The name of the policy.
   *
   * [disable-awslint:attribute-tag]
   */
  public readonly policyName: string;

  /**
   * The ID of the policy.
   * @attribute
   */
  public readonly policyId: string;

  /**
   * The policy engine this policy belongs to.
   *
   * [disable-awslint:attribute-tag]
   */
  public readonly policyEngine: IPolicyEngine;

  /**
   * The Cedar policy definition.
   */
  public readonly definition: string;

  /**
   * The description of the policy.
   */
  public readonly description?: string;

  /**
   * The validation mode for the policy.
   */
  public readonly validationMode?: PolicyValidationMode;

  /**
   * The principal to grant permissions to.
   */
  public readonly grantPrincipal: iam.IPrincipal;

  // ------------------------------------------------------
  // Internal Only
  // ------------------------------------------------------
  private readonly __resource: CfnPolicy;

  // ------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------
  constructor(scope: Construct, id: string, props: PolicyProps) {
    super(scope, id, {
      // Maximum name length of 48 characters
      physicalName:
        props?.policyName ??
        Lazy.string({
          produce: () => Names.uniqueResourceName(this, { maxLength: 48 }),
        }),
    });

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // ------------------------------------------------------
    // Validate definition vs statement
    // ------------------------------------------------------
    if (!props.definition && !props.statement) {
      throw new ValidationError(
        lit`PolicyDefinitionRequired`,
        `Policy '${this.physicalName}' must specify either 'definition' (raw Cedar string) or 'statement' (PolicyStatement builder), but neither was provided.`,
        this,
      );
    }

    if (props.definition && props.statement) {
      throw new ValidationError(
        lit`PolicyDefinitionConflict`,
        `Policy '${this.physicalName}' must specify either 'definition' OR 'statement', but not both. ` +
        'Use definition for raw Cedar strings, or statement for the type-safe builder.',
        this,
      );
    }

    // ------------------------------------------------------
    // Set properties and defaults
    // ------------------------------------------------------
    this.policyName = this.physicalName;
    this.policyEngine = props.policyEngine;

    this.definition = props.statement ? props.statement.toCedar() : props.definition!;

    this.description = props.description;
    this.validationMode = props.validationMode ?? PolicyValidationMode.FAIL_ON_ANY_FINDINGS;

    this.grantPrincipal = new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com');

    // ------------------------------------------------------
    // Validations
    // ------------------------------------------------------

    throwIfInvalidPolicyName(this.policyName, this);

    throwIfInvalidPolicyDefinition(this.definition, this);

    if (this.description) {
      throwIfInvalidDescription(this.description, this);
    }

    // ------------------------------------------------------
    // CFN Props
    // ------------------------------------------------------
    const cfnProps: CfnPolicyProps = {
      name: this.policyName,
      policyEngineId: this.policyEngine.policyEngineId,
      definition: {
        cedar: {
          statement: this.definition,
        },
      },
      description: this.description,
      validationMode: this.validationMode?.value,
    };

    this.__resource = new CfnPolicy(this, 'Resource', cfnProps);

    // Create dependency ONLY on the PolicyEngine's CFN resource to avoid circular dependencies with the PolicyEngine construct
    this.__resource.node.addDependency(this.policyEngine.node.defaultChild!);

    this.policyId = this.__resource.attrPolicyId;
    this.policyArn = this.__resource.attrPolicyArn;
  }
}

