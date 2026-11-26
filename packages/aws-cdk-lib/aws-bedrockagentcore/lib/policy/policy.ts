import type { Construct } from 'constructs';
// Internal imports
import type { IPolicy, PolicyAttributes } from './policy-base';
import { PolicyBase } from './policy-base';
import type { IPolicyEngine } from './policy-engine-base';
import type { PolicyStatement } from './policy-statement';
import { PolicyValidationMode } from './policy-types';
import { throwIfInvalidPolicyName, throwIfInvalidDescription, throwIfInvalidPolicyDefinition } from './validation-helpers';
import { CfnPolicy } from '../../../aws-bedrockagentcore';
import type { CfnPolicyProps } from '../../../aws-bedrockagentcore';
import * as iam from '../../../aws-iam';
import { Arn, ArnFormat, Lazy, Names, Stack } from '../../../core';
import { ValidationError } from '../../../core/lib/errors';
import { lit } from '../../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../../core/lib/metadata-resource';
import { propertyInjectable } from '../../../core/lib/prop-injectable';

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
   * The Cedar policy statement for this policy.
   *
   * Build a type-safe statement with the `PolicyStatement` factories, which validate
   * at synthesis time and reject values that cannot be represented safely in Cedar.
   *
   * For raw Cedar (features this API does not model, or migrating an existing policy),
   * use `PolicyStatement.fromCedar('...')`. That string is used exactly as given: the
   * module does not escape, quote, or validate it, so it is treated as trusted input
   * and you own its correctness and safety. Do not assemble it from values that come
   * from outside your application, such as a request body or a database record.
   */
  readonly statement: PolicyStatement;

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
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-bedrockagentcore.Policy';

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
      public readonly description = undefined;
      public readonly validationMode = undefined;
      public readonly policyEngine = attrs.policyEngine;
      public readonly grantPrincipal = new iam.UnknownPrincipal({ resource: this });

      get policyName(): string {
        throw new ValidationError(
          lit`PolicyNameNotAvailable`,
          'policyName is not available on imported Policy resources. ' +
          'The service appends a random suffix to the name at creation time, so the original name cannot be extracted from the ARN. ' +
          'Use policyArn or policyId instead.',
          this,
        );
      }
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
        Lazy.string({ produce: () => Names.uniqueResourceName(this, { maxLength: 48 }) }),
    });

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // ------------------------------------------------------
    // Set properties and defaults
    // ------------------------------------------------------
    this.policyName = this.physicalName;
    this.policyEngine = props.policyEngine;

    this.definition = props.statement.toCedar();

    this.description = props.description;
    this.validationMode = props.validationMode ?? PolicyValidationMode.FAIL_ON_ANY_FINDINGS;

    // Scope the service principal used as this resource's grantPrincipal with
    // aws:SourceAccount and aws:SourceArn so that any resource-based grant made to
    // this Policy only allows the AgentCore service to act on behalf of THIS policy,
    // not any other AgentCore resource in the account (cross-service confused deputy
    // protection AWS recommends for bedrock-agentcore). AWS prescribes the full
    // aws:SourceArn when it is known and a wildcard only for the unknown portion of
    // the ARN otherwise. A policy ARN is nested under its engine as
    // `policy-engine/<engineId>/policy/<name>-<random suffix>`: the name and its `-`
    // separator are known, and only the suffix the service appends at creation time
    // is unknown, so we wildcard just that suffix as `<name>-*`. Keeping the `-`
    // literal stops a same-prefixed sibling policy from satisfying it.
    // @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/cross-service-confused-deputy-prevention.html
    this.grantPrincipal = new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com', {
      conditions: {
        StringEquals: { 'aws:SourceAccount': Stack.of(this).account },
        ArnLike: {
          'aws:SourceArn': `${this.policyEngine.policyEngineArn}/policy/${this.policyName}-*`,
        },
      },
    });

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
        cedar: { statement: this.definition },
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

