/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { Arn, ArnFormat, Lazy, Names } from 'aws-cdk-lib';
import type { CfnPolicyEngineProps } from 'aws-cdk-lib/aws-bedrockagentcore';
import { CfnPolicyEngine } from 'aws-cdk-lib/aws-bedrockagentcore';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
// Internal imports
import type { IPolicyEngine, PolicyEngineAttributes } from './policy-engine-base';
import { PolicyEngineBase } from './policy-engine-base';
import type { PolicyStatement } from './policy-statement';
import { throwIfInvalidPolicyEngineName, throwIfInvalidDescription, throwIfInvalidTags } from './validation-helpers';

/**
 * Properties for creating a PolicyEngine resource
 */
export interface PolicyEngineProps {
  /**
   * The name of the policy engine.
   * Valid characters: a-z, A-Z, 0-9, _ (underscore)
   * Must start with a letter, 1-48 characters
   * Pattern: ^[A-Za-z][A-Za-z0-9_]*$
   *
   * @default - Auto-generated unique name
   */
  readonly policyEngineName?: string;

  /**
   * Optional description for the policy engine.
   * Maximum 4,096 characters.
   *
   * @default - No description
   */
  readonly description?: string;

  /**
   * Custom KMS key for encryption.
   * [disable-awslint:prefer-ref-interface]
   *
   * @default - AWS owned key
   */
  readonly kmsKey?: kms.IKey;

  /**
   * Tags for the policy engine.
   * Maximum 50 tags.
   *
   * @default - No tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Options for adding a policy via PolicyEngine.addPolicy()
 */
export interface AddPolicyOptions {
  /**
   * Cedar policy statement (35-153,600 characters).
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
   * The name of the policy.
   * Valid characters: a-z, A-Z, 0-9, _ (underscore)
   * Must start with a letter, 1-48 characters
   *
   * @default - Auto-generated unique name
   */
  readonly policyName?: string;

  /**
   * Optional description for the policy (max 4,096 characters).
   *
   * @default - No description
   */
  readonly description?: string;

  /**
   * Validation mode for the policy.
   *
   * @default PolicyValidationMode.FAIL_ON_ANY_FINDINGS
   */
  readonly validationMode?: PolicyValidationMode;
}

/**
 * Validation mode for Cedar policy definitions.
 */
export enum PolicyValidationMode {
  /**
   * Fail policy creation if any validation findings are detected.
   * This is the safer default - catches policy errors early.
   */
  FAIL_ON_ANY_FINDINGS = 'FAIL_ON_ANY_FINDINGS',

  /**
   * Ignore all validation findings and create the policy anyway.
   * Use with caution - may result in runtime authorization errors.
   */
  IGNORE_ALL_FINDINGS = 'IGNORE_ALL_FINDINGS',
}

/**
 * Container that manages Cedar authorization policies associated with gateways.
 * PolicyEngine enables deterministic authorization control for Bedrock agents,
 * allowing fine-grained access control to tools and actions via Cedar policy language.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-engine.html
 * @resource AWS::BedrockAgentCore::PolicyEngine
 */
@propertyInjectable
export class PolicyEngine extends PolicyEngineBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-agentcore-alpha.PolicyEngine';

  /**
   * Creates a PolicyEngine reference from an existing policy engine's attributes.
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   * @param attrs - Attributes of the existing policy engine
   * @returns An IPolicyEngine reference to the existing policy engine
   */
  public static fromPolicyEngineAttributes(
    scope: Construct,
    id: string,
    attrs: PolicyEngineAttributes,
  ): IPolicyEngine {
    class Import extends PolicyEngineBase {
      public readonly policyEngineArn = attrs.policyEngineArn;
      public readonly policyEngineId = Arn.split(attrs.policyEngineArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
      public readonly policyEngineName = this.policyEngineId;
      public readonly description = undefined;
      public readonly kmsKey = attrs.kmsKeyArn
        ? kms.Key.fromKeyArn(scope, `${id}Key`, attrs.kmsKeyArn)
        : undefined;
      public readonly grantPrincipal = new iam.UnknownPrincipal({ resource: this });

      constructor(s: Construct, i: string) {
        super(s, i);
      }
    }

    return new Import(scope, id);
  }

  // ------------------------------------------------------
  // Attributes
  // ------------------------------------------------------

  /**
   * The ARN of the policy engine resource.
   * @attribute
   */
  public readonly policyEngineArn: string;

  /**
   * The name of the policy engine.
   *
   * [disable-awslint:attribute-tag]
   */
  public readonly policyEngineName: string;

  /**
   * The ID of the policy engine.
   * @attribute
   */
  public readonly policyEngineId: string;

  /**
   * The description of the policy engine.
   */
  public readonly description?: string;

  /**
   * Tags applied to this policy engine resource.
   * @default - No tags applied
   */
  public readonly tags?: { [key: string]: string };

  /**
   * The principal to grant permissions to.
   */
  public readonly grantPrincipal: iam.IPrincipal;

  /**
   * The KMS key used to encrypt the policy engine.
   */
  public readonly kmsKey?: kms.IKey;

  /**
   * List of policies added to this policy engine via addPolicy().
   * @internal
   */
  private readonly _policies: any[] = [];

  /**
   * The last policy added to this engine, used for automatic sequential chaining.
   * @internal
   */
  private _lastPolicy?: any;

  /**
   * Get the list of policies added to this policy engine.
   *
   * Returns an array of Policy constructs that were added using addPolicy().
   * This allows you to iterate over all policies associated with this engine.
   *
   * @returns A copy of the policies array
   */
  public get policies(): any[] {
    return [...this._policies];
  }

  private readonly __resource: CfnPolicyEngine;

  // ------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------
  constructor(scope: Construct, id: string, props: PolicyEngineProps = {}) {
    super(scope, id, {
      // Maximum name length of 48 characters
      physicalName:
        props?.policyEngineName ??
        Lazy.string({
          produce: () => Names.uniqueResourceName(this, { maxLength: 48 }),
        }),
    });

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // ------------------------------------------------------
    // Set properties and defaults
    // ------------------------------------------------------
    this.policyEngineName = this.physicalName;
    this.description = props.description;
    this.kmsKey = props.kmsKey;
    this.tags = props.tags;

    this.grantPrincipal = new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com');

    // ------------------------------------------------------
    // Validations
    // ------------------------------------------------------

    throwIfInvalidPolicyEngineName(this.policyEngineName, this);

    if (this.description) {
      throwIfInvalidDescription(this.description, this);
    }

    if (this.tags) {
      throwIfInvalidTags(this.tags, this.policyEngineName, this);
    }

    // ------------------------------------------------------
    // CFN Props
    // ------------------------------------------------------
    const cfnProps: CfnPolicyEngineProps = {
      name: this.policyEngineName,
      description: this.description,
      encryptionKeyArn: this.kmsKey?.keyArn,
      tags: this.tags
        ? Object.entries(this.tags).map(([key, value]) => ({
          key,
          value,
        }))
        : undefined,
    };

    this.__resource = new CfnPolicyEngine(this, 'Resource', cfnProps);

    this.policyEngineId = this.__resource.attrPolicyEngineId;
    this.policyEngineArn = this.__resource.attrPolicyEngineArn;
  }

  /**
   * Add a policy to this policy engine.
   * Convenience method that creates a Policy construct with this engine as the parent.
   *
   * **Automatic Sequential Chaining**: By default, policies are automatically chained
   * sequentially to prevent concurrent creation issues with the AWS Bedrock AgentCore
   * service. Each new policy will depend on the previous policy added to this engine.
   *
   * This ensures policies are created one at a time, avoiding "Resource stabilization
   * failed" errors that occur with concurrent policy operations.
   *
   * @param id - Unique identifier for the policy construct
   * @param options - Options for creating the policy
   * @returns The created Policy construct
   *
   */
  @MethodMetadata()
  public addPolicy(id: string, options: AddPolicyOptions): any {
    // Import Policy here to avoid circular dependency
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Policy } = require('./policy');

    const policy = new Policy(this, id, {
      policyEngine: this,
      policyName: options.policyName,
      definition: options.definition,
      statement: options.statement,
      description: options.description,
      validationMode: options.validationMode,
    });

    // Automatically chain to previous policy if exists
    // This prevents concurrent policy creation which causes service-level failures
    if (this._lastPolicy) {
      policy.node.addDependency(this._lastPolicy);
    }

    this._policies.push(policy);
    this._lastPolicy = policy; // Track for next policy

    return policy;
  }
}
