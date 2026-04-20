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

import type { IResource, ResourceProps, CfnTag } from 'aws-cdk-lib';
import { Arn, ArnFormat, Lazy, Names, Resource } from 'aws-cdk-lib';
import type { CfnWorkloadIdentityProps, IWorkloadIdentityRef, WorkloadIdentityReference } from 'aws-cdk-lib/aws-bedrockagentcore';
import { CfnWorkloadIdentity } from 'aws-cdk-lib/aws-bedrockagentcore';
import * as iam from 'aws-cdk-lib/aws-iam';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
// Internal Libs
import * as perms from './perms';
import { validateFieldPattern, validateStringFieldLength, throwIfInvalid } from './validation-helpers';

/******************************************************************************
 *                              CONSTANTS
 *****************************************************************************/
/**
 * Minimum length for workload identity name
 * @internal
 */
const WORKLOAD_IDENTITY_NAME_MIN_LENGTH = 1;

/**
 * Maximum length for workload identity name
 * @internal
 */
const WORKLOAD_IDENTITY_NAME_MAX_LENGTH = 48;

/**
 * Minimum length for workload identity tags
 * @internal
 */
const WORKLOAD_IDENTITY_TAG_MIN_LENGTH = 1;

/**
 * Maximum length for workload identity tags
 * @internal
 */
const WORKLOAD_IDENTITY_TAG_MAX_LENGTH = 256;

/******************************************************************************
 *                                Interface
 *****************************************************************************/
/**
 * Interface for WorkloadIdentity resources
 */
export interface IWorkloadIdentity extends IResource, IWorkloadIdentityRef {
  /**
   * The ARN of the workload identity resource
   * @attribute
   */
  readonly workloadIdentityArn: string;

  /**
   * The name of the workload identity
   * @attribute
   */
  readonly workloadIdentityName: string;

  /**
   * Timestamp when the workload identity was created
   * @attribute
   */
  readonly createdTime?: string;

  /**
   * Timestamp when the workload identity was last updated
   * @attribute
   */
  readonly lastUpdatedTime?: string;

  /**
   * Grant the given principal identity permissions to perform actions on this workload identity.
   *
   * [disable-awslint:no-grants]
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant the given principal identity permissions to obtain access tokens for this workload identity.
   *
   * [disable-awslint:no-grants]
   */
  grantGetAccessToken(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the given principal identity permissions to read this workload identity.
   *
   * [disable-awslint:no-grants]
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the given principal identity permissions to manage the control plane of this workload identity.
   *
   * [disable-awslint:no-grants]
   */
  grantAdmin(grantee: iam.IGrantable): iam.Grant;
}

/******************************************************************************
 *                        ABSTRACT BASE CLASS
 *****************************************************************************/
/**
 * Abstract base class for a WorkloadIdentity.
 * Contains methods and attributes valid for WorkloadIdentities either created with CDK or imported.
 */
export abstract class WorkloadIdentityBase extends Resource implements IWorkloadIdentity {
  public abstract readonly workloadIdentityArn: string;
  public abstract readonly workloadIdentityName: string;
  public abstract readonly createdTime?: string;
  public abstract readonly lastUpdatedTime?: string;

  /**
   * A reference to a WorkloadIdentity resource.
   */
  public get workloadIdentityRef(): WorkloadIdentityReference {
    return {
      workloadIdentityName: this.workloadIdentityName,
      workloadIdentityArn: this.workloadIdentityArn,
    };
  }

  constructor(scope: Construct, id: string, props: ResourceProps = {}) {
    super(scope, id, props);
  }

  /**
   * Grants IAM actions to the IAM Principal
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant permissions to
   * @param actions - The actions to grant
   * @returns An IAM Grant object representing the granted permissions
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.workloadIdentityRef.workloadIdentityArn],
      scope: this,
    });
  }

  /**
   * Grant the given principal identity permissions to obtain access tokens for this workload identity.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:GetWorkloadAccessToken',
   *    'bedrock-agentcore:GetWorkloadAccessTokenForJWT',
   *    'bedrock-agentcore:GetWorkloadAccessTokenForUserId'] on this.workloadIdentityArn
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantGetAccessToken(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...perms.WORKLOAD_IDENTITY_ACCESS_TOKEN_PERMS);
  }

  /**
   * Grant the given principal identity permissions to read this workload identity.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant read permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:GetWorkloadIdentity'] on this.workloadIdentityArn
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...perms.WORKLOAD_IDENTITY_READ_PERMS);
  }

  /**
   * Grant the given principal identity permissions to manage the control plane of this workload identity.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant admin permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:CreateWorkloadIdentity',
   *    'bedrock-agentcore:GetWorkloadIdentity',
   *    'bedrock-agentcore:UpdateWorkloadIdentity',
   *    'bedrock-agentcore:DeleteWorkloadIdentity',
   *    'bedrock-agentcore:ListWorkloadIdentities'] on this.workloadIdentityArn
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantAdmin(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...perms.WORKLOAD_IDENTITY_ADMIN_PERMS);
  }
}

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating a WorkloadIdentity resource
 */
export interface WorkloadIdentityProps {
  /**
   * The name of the workload identity
   * Valid characters are a-z, A-Z, 0-9, _ (underscore)
   * The name must start with a letter and can be up to 48 characters long
   * Pattern: [a-zA-Z][a-zA-Z0-9_]{0,47}
   * @default - auto generate
   */
  readonly workloadIdentityName?: string;

  /**
   * The list of allowed OAuth2 return URLs for resources associated with this workload identity.
   * @default - No allowed OAuth2 return URLs
   */
  readonly allowedResourceOauth2ReturnUrls?: string[];

  /**
   * Tags (optional)
   * A list of key:value pairs of tags to apply to this workload identity resource
   *
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
/**
 * Attributes for specifying an imported WorkloadIdentity.
 */
export interface WorkloadIdentityAttributes {
  /**
   * The ARN of the workload identity.
   * @attribute
   */
  readonly workloadIdentityArn: string;
  /**
   * Timestamp when the workload identity was created.
   * @default undefined - No created timestamp is provided
   */
  readonly createdTime?: string;
  /**
   * Timestamp when the workload identity was last updated.
   * @default undefined - No last updated timestamp is provided
   */
  readonly lastUpdatedTime?: string;
}

/******************************************************************************
 *                                Class
 *****************************************************************************/
/**
 * An identity type for AI agents in Amazon Bedrock AgentCore.
 * Enables secure credential management, OAuth2 flows, and token vault integration
 * for agents to access external services.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html
 * @resource AWS::BedrockAgentCore::WorkloadIdentity
 */
@propertyInjectable
export class WorkloadIdentity extends WorkloadIdentityBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-agentcore-alpha.WorkloadIdentity';

  /**
   * Creates a WorkloadIdentity reference from an existing workload identity's attributes.
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   * @param attrs - Attributes of the existing workload identity
   * @returns An IWorkloadIdentity reference to the existing workload identity
   */
  public static fromWorkloadIdentityAttributes(scope: Construct, id: string, attrs: WorkloadIdentityAttributes): IWorkloadIdentity {
    class Import extends WorkloadIdentityBase {
      public readonly workloadIdentityArn = attrs.workloadIdentityArn;
      public readonly workloadIdentityName = Arn.split(attrs.workloadIdentityArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
      public readonly createdTime = attrs.createdTime;
      public readonly lastUpdatedTime = attrs.lastUpdatedTime;
    }

    return new Import(scope, id);
  }

  // ------------------------------------------------------
  // Attributes
  // ------------------------------------------------------
  /**
   * The ARN of the workload identity resource
   * @attribute
   */
  public readonly workloadIdentityArn: string;
  /**
   * The name of the workload identity
   * @attribute
   */
  public readonly workloadIdentityName: string;
  /**
   * Timestamp when the workload identity was created
   * @attribute
   */
  public readonly createdTime?: string;
  /**
   * Timestamp when the workload identity was last updated
   * @attribute
   */
  public readonly lastUpdatedTime?: string;
  /**
   * The list of allowed OAuth2 return URLs for resources associated with this workload identity.
   */
  public readonly allowedResourceOauth2ReturnUrls?: string[];
  /**
   * Tags applied to this workload identity resource
   * A map of key-value pairs for resource tagging
   * @default - No tags applied
   */
  public readonly tags?: { [key: string]: string };

  // ------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------
  constructor(scope: Construct, id: string, props: WorkloadIdentityProps = {}) {
    super(scope, id, {
      // Maximum name length of 48 characters
      // @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-bedrockagentcore-workloadidentity.html
      physicalName: props.workloadIdentityName ??
        Lazy.string({
          produce: () => Names.uniqueResourceName(this, { maxLength: 48 }),
        }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // ------------------------------------------------------
    // Set properties and defaults
    // ------------------------------------------------------
    this.workloadIdentityName = this.physicalName;
    this.allowedResourceOauth2ReturnUrls = props.allowedResourceOauth2ReturnUrls;
    this.tags = props.tags;

    // ------------------------------------------------------
    // Validations
    // ------------------------------------------------------

    // Validate workload identity name
    throwIfInvalid(this._validateWorkloadIdentityName, this.workloadIdentityName, this);

    // Validate workload identity tags
    throwIfInvalid(this._validateWorkloadIdentityTags, this.tags, this);

    // ------------------------------------------------------
    // CFN Props
    // ------------------------------------------------------
    const cfnProps: CfnWorkloadIdentityProps = {
      name: this.workloadIdentityName,
      allowedResourceOauth2ReturnUrls: this.allowedResourceOauth2ReturnUrls,
      tags: this._renderTags(this.tags),
    };

    // ------------------------------------------------------
    // CFN Resource
    // ------------------------------------------------------
    const resource = new CfnWorkloadIdentity(this, 'Resource', cfnProps);

    this.workloadIdentityArn = resource.attrWorkloadIdentityArn;
    this.createdTime = resource.attrCreatedTime.toString();
    this.lastUpdatedTime = resource.attrLastUpdatedTime.toString();
  }

  // ------------------------------------------------------
  // VALIDATORS
  // ------------------------------------------------------
  /**
   * Validates the workload identity name format
   * @param name The workload identity name to validate
   * @returns Array of validation error messages, empty if valid
   * @internal This is an internal core function and should not be called directly.
   */
  private _validateWorkloadIdentityName = (name: string): string[] => {
    let errors: string[] = [];

    errors.push(...validateStringFieldLength({
      value: name,
      fieldName: 'Workload identity name',
      minLength: WORKLOAD_IDENTITY_NAME_MIN_LENGTH,
      maxLength: WORKLOAD_IDENTITY_NAME_MAX_LENGTH,
    }));

    // Check if name matches the AWS API pattern: [a-zA-Z][a-zA-Z0-9_]{0,47}
    // Must start with a letter, followed by up to 47 letters, numbers, or underscores
    const validNamePattern = /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/;
    errors.push(...validateFieldPattern(name, 'Workload identity name', validNamePattern));

    return errors;
  };

  /**
   * Validates the workload identity tags format
   * @param tags The tags object to validate
   * @returns Array of validation error messages, empty if valid
   * @internal This is an internal core function and should not be called directly.
   */
  private _validateWorkloadIdentityTags = (tags?: { [key: string]: string }): string[] => {
    let errors: string[] = [];
    if (!tags) {
      return errors; // Tags are optional
    }

    // Validate each tag key and value
    for (const [key, value] of Object.entries(tags)) {
      errors.push(...validateStringFieldLength({
        value: key,
        fieldName: 'Tag key',
        minLength: WORKLOAD_IDENTITY_TAG_MIN_LENGTH,
        maxLength: WORKLOAD_IDENTITY_TAG_MAX_LENGTH,
      }));

      // Validate tag key pattern: ^[a-zA-Z0-9\s._:/=+@-]*$
      const validKeyPattern = /^[a-zA-Z0-9\s._:/=+@-]*$/;
      errors.push(...validateFieldPattern(key, 'Tag key', validKeyPattern));

      // Validate tag value
      errors.push(...validateStringFieldLength({
        value: value,
        fieldName: 'Tag value',
        minLength: WORKLOAD_IDENTITY_TAG_MIN_LENGTH,
        maxLength: WORKLOAD_IDENTITY_TAG_MAX_LENGTH,
      }));

      // Validate tag value pattern: ^[a-zA-Z0-9\s._:/=+@-]*$
      const validValuePattern = /^[a-zA-Z0-9\s._:/=+@-]*$/;
      errors.push(...validateFieldPattern(value, 'Tag value', validValuePattern));
    }

    return errors;
  };

  // ------------------------------------------------------
  // RENDERERS
  // ------------------------------------------------------
  /**
   * Converts a map of tags to CfnTag array format.
   * @internal
   */
  private _renderTags(tags?: { [key: string]: string }): CfnTag[] | undefined {
    if (!tags || Object.keys(tags).length === 0) {
      return undefined;
    }
    return Object.entries(tags).map(([key, value]) => ({ key, value }));
  }
}
