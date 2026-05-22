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

import type { IResource, ResourceProps } from 'aws-cdk-lib';
import { Arn, ArnFormat, Duration, Lazy, Resource, Token, Names } from 'aws-cdk-lib';
import type { CfnMemoryProps, IMemoryRef, MemoryReference } from 'aws-cdk-lib/aws-bedrockagentcore';
import { CfnMemory } from 'aws-cdk-lib/aws-bedrockagentcore';
import type {
  DimensionsMap,
  MetricOptions,
  MetricProps,
} from 'aws-cdk-lib/aws-cloudwatch';
import {
  Metric,
  Stats,
} from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { IConstruct, Construct } from 'constructs';
// Internal Libs
import type { IMemoryStrategy } from './memory-strategy';
import { MemoryPerms } from './perms';
import { validateFieldPattern, validateStringFieldLength, throwIfInvalid } from './validation-helpers';

/******************************************************************************
 *                              CONSTANTS
 *****************************************************************************/
/**
 * Minimum length for browser name
 * @internal
 */
const MEMORY_NAME_MIN_LENGTH = 1;

/**
 * Maximum length for browser name
 * @internal
 */
const MEMORY_NAME_MAX_LENGTH = 48;

/**
 * Minimum length for browser tags
 * @internal
 */
const MEMORY_TAG_MIN_LENGTH = 1;

/**
 * Maximum length for browser tags
 * @internal
 */
const MEMORY_TAG_MAX_LENGTH = 256;

/**
 * Minimum length for memory expiration days
 * @internal
 */
const MEMORY_EXPIRATION_DAYS_MIN = 7;
/**
 * Maximum length for memory expiration days
 * @internal
 */
const MEMORY_EXPIRATION_DAYS_MAX = 365;

/******************************************************************************
 *                                Interface
 *****************************************************************************/
/**
 * Interface for Memory resources
 */
export interface IMemory extends IResource, iam.IGrantable, IMemoryRef {
  /**
   * The ARN of the memory resource
   * @attribute
   */
  readonly memoryArn: string;
  /**
   * The id of the memory
   * @attribute
   */
  readonly memoryId: string;
  /**
   * The IAM role that provides permissions for the memory to access AWS services.
   */
  readonly executionRole?: iam.IRole;
  /**
   * Custom KMS key for encryption (if provided)
   */
  readonly kmsKey?: kms.IKey;
  /**
   * The status of the memory
   * @attribute
   */
  readonly status?: string;
  /**
   * Timestamp when the memory was last updated
   * @attribute
   */
  readonly updatedAt?: string;
  /**
   * Timestamp when the memory was created
   * @attribute
   */
  readonly createdAt?: string;
  /**
   * Grant the given principal identity permissions to perform actions on this memory.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
  /**
   * Grant the given principal identity permissions to write content to this memory.
   */
  grantWrite(grantee: iam.IGrantable): iam.Grant;
  /**
   * Grant the given principal identity permissions to read the contents of this memory.
   * Both Short-Term Memory (STM) and Long-Term Memory (LTM).
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;
  /**
   * Grant the given principal identity permissions to read the Short-Term Memory (STM) contents of this memory.
   */
  grantReadShortTermMemory(grantee: iam.IGrantable): iam.Grant;
  /**
   * Grant the given principal identity permissions to read the Long-Term Memory (LTM) contents of this memory.
   */
  grantReadLongTermMemory(grantee: iam.IGrantable): iam.Grant;
  /**
   * Grant the given principal identity permissions to delete content on this memory.
   */
  grantDelete(grantee: iam.IGrantable): iam.Grant;
  /**
   * Grant the given principal identity permissions to delete Short-Term Memory (STM) content on this memory.
   */
  grantDeleteShortTermMemory(grantee: iam.IGrantable): iam.Grant;
  /**
   * Grant the given principal identity permissions to delete Long-Term Memory (LTM) content on this memory.
   */
  grantDeleteLongTermMemory(grantee: iam.IGrantable): iam.Grant;
  /**
   * Grant the given principal identity permissions to manage the control plane of this memory.
   */
  grantAdmin(grantee: iam.IGrantable): iam.Grant;
  /**
   * Grant the given principal identity permissions to do every action on this memory.
   */
  grantFullAccess(grantee: iam.IGrantable): iam.Grant;

  // ------------------------------------------------------
  // Metrics
  // ------------------------------------------------------
  /**
   * Return the given named metric for this memory.
   */
  metric(metricName: string, dimensions: DimensionsMap, props?: MetricOptions): Metric;
  /**
   * Return the given named metric related to the API operation performed on this memory.
   */
  metricForApiOperation(metricName: string, operation: string, props?: MetricOptions): Metric;
  /**
   * Return a metric measuring the latency of a specific API operation performed on this memory.
   */
  metricLatencyForApiOperation(operation: string, props?: MetricOptions): Metric;
  /**
   * Return a metric containing the total number of API requests made for a specific memory operation.
   */
  metricInvocationsForApiOperation(operation: string, props?: MetricOptions): Metric;
  /**
   * Return a metric containing the number of errors for a specific API operation performed on this memory.
   */
  metricErrorsForApiOperation(operation: string, props?: MetricOptions): Metric;
  /**
   * Returns the metric containing the number of created memory events and memory records.
   */
  metricEventCreationCount(props?: MetricOptions): Metric;
}

/******************************************************************************
 *                        ABSTRACT BASE CLASS
 *****************************************************************************/
/**
 * Abstract base class for a Memory.
 * Contains methods and attributes valid for Memories either created with CDK or imported.
 */
export abstract class MemoryBase extends Resource implements IMemory {
  public abstract readonly memoryArn: string;
  public abstract readonly memoryId: string;
  public abstract readonly status?: string;
  public abstract readonly updatedAt?: string;
  public abstract readonly createdAt?: string;
  public abstract readonly executionRole?: iam.IRole;
  public abstract readonly kmsKey?: kms.IKey;
  /**
   * The principal to grant permissions to
   */
  public abstract readonly grantPrincipal: iam.IPrincipal;

  /**
   * A reference to a Memory resource.
   */
  public get memoryRef(): MemoryReference {
    return {
      memoryArn: this.memoryArn,
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
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.memoryRef.memoryArn],
      scope: this,
    });
  }
  /**
   * Grant the given principal identity permissions to write content to short-term memory.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant read permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:CreateEvent'] on this.memoryArn
   * @returns An IAM Grant object representing the granted permissions
   */
  grantWrite(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...MemoryPerms.STM.WRITE_PERMS);
  }
  /**
   * Grant the given principal identity permissions to read the contents of this memory.
   * Both Short-Term Memory (STM) and Long-Term Memory (LTM).
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant read permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:GetMemoryRecord',
      'bedrock-agentcore:RetrieveMemoryRecords',
      'bedrock-agentcore:ListMemoryRecords',
      'bedrock-agentcore:ListActors',
      'bedrock-agentcore:ListSessions] on this.memoryArn
   * @returns An IAM Grant object representing the granted permissions
   */
  grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...MemoryPerms.READ_PERMS);
  }
  /**
   * Grant the given principal identity permissions to read the Short-Term Memory (STM) contents of this memory.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant read permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:GetEvent',
      'bedrock-agentcore:ListEvents',
      'bedrock-agentcore:ListActors',
      'bedrock-agentcore:ListSessions',] on this.memoryArn
   * @returns An IAM Grant object representing the granted permissions
   */
  grantReadShortTermMemory(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...MemoryPerms.STM.READ_PERMS);
  }
  /**
   * Grant the given principal identity permissions to read the Long-Term Memory (LTM) contents of this memory.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant read permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:GetMemoryRecord',
      'bedrock-agentcore:RetrieveMemoryRecords',
      'bedrock-agentcore:ListMemoryRecords',
      'bedrock-agentcore:ListActors',
      'bedrock-agentcore:ListSessions',] on this.memoryArn
   * @returns An IAM Grant object representing the granted permissions
   */
  grantReadLongTermMemory(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...MemoryPerms.LTM.READ_PERMS);
  }
  /**
   * Grant the given principal identity permissions to delete content on this memory.
   *
   * Both Short-Term Memory (STM) and Long-Term Memory (LTM).
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant delete permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:DeleteEvent',
      'bedrock-agentcore:DeleteMemoryRecord'] on this.memoryArn
   * @returns An IAM Grant object representing the granted permissions
   */
  grantDelete(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...MemoryPerms.DELETE_PERMS);
  }
  /**
   * Grant the given principal identity permissions to delete Short-Term Memory (STM) content on this memory.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant delete permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:DeleteEvent'] on this.memoryArn
   * @returns An IAM Grant object representing the granted permissions
   */
  grantDeleteShortTermMemory(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...MemoryPerms.STM.DELETE_PERMS);
  }
  /**
   * Grant the given principal identity permissions to delete Long-Term Memory (LTM) content on this memory.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant delete permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:DeleteMemoryRecord'] on this.memoryArn
   * @returns An IAM Grant object representing the granted permissions
   */
  grantDeleteLongTermMemory(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...MemoryPerms.LTM.DELETE_PERMS);
  }
  /**
   * Grant the given principal identity permissions to manage the control plane of this memory.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant admin permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:CreateMemory',
      'bedrock-agentcore:GetMemory',
      'bedrock-agentcore:DeleteMemory',
      'bedrock-agentcore:UpdateMemory'] on this.memoryArn
   * @returns An IAM Grant object representing the granted permissions
   */
  grantAdmin(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...MemoryPerms.ADMIN_PERMS);
  }
  /**
   * Grant the given principal identity permissions to do every action on this memory.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant full access permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:CreateEvent',
      'bedrock-agentcore:GetEvent',
      'bedrock-agentcore:DeleteEvent',
      'bedrock-agentcore:GetMemoryRecord',
      'bedrock-agentcore:RetrieveMemoryRecords',
      'bedrock-agentcore:ListMemoryRecords',
      'bedrock-agentcore:ListActors',
      'bedrock-agentcore:ListSessions',
      'bedrock-agentcore:CreateMemory',
      'bedrock-agentcore:GetMemory',
      'bedrock-agentcore:DeleteMemory',
      'bedrock-agentcore:UpdateMemory'] on this.memoryArn
   * @returns An IAM Grant object representing the granted permissions
   */
  grantFullAccess(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...MemoryPerms.FULL_ACCESS_PERMS);
  }

  // ------------------------------------------------------
  // Metrics
  // ------------------------------------------------------
  /**
   * Return the given named metric for this memory.
   *
   * By default, the metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public metric(metricName: string, dimensions: DimensionsMap, props?: MetricOptions): Metric {
    const metricProps: MetricProps = {
      namespace: 'AWS/Bedrock-AgentCore',
      metricName,
      dimensionsMap: { ...dimensions, Resource: this.memoryRef.memoryArn },
      ...props,
    };
    return this.configureMetric(metricProps);
  }
  /**
   * Return the given named metric related to the API operation performed on this memory.
   */
  public metricForApiOperation(
    metricName: string,
    operation: string,
    props?: MetricOptions,
  ): Metric {
    return this.metric(metricName, { Operation: operation }, props);
  }
  /**
   * Return a metric measuring the latency of a specific API operation performed on this memory.
   *
   * The latency metric represents the total time elapsed between receiving the request and sending
   * the final response token, measuring complete end-to-end processing time.
   *
   * For memory creation events specifically, this measures the time from the last CreateEvent
   * that met strategy criteria until memory storage is completed.
   *
   */
  public metricLatencyForApiOperation(operation: string, props?: MetricOptions): Metric {
    return this.metricForApiOperation('Latency', operation, { statistic: Stats.AVERAGE, ...props });
  }
  /**
   * Return a metric containing the total number of API requests made for a specific memory operation like
   * `CreateEvent`, `ListEvents`, `RetrieveMemoryRecords` ...
   */
  public metricInvocationsForApiOperation(operation: string, props?: MetricOptions): Metric {
    return this.metricForApiOperation('Invocations', operation, {
      statistic: Stats.SUM,
      ...props,
    });
  }
  /**
   * Return a metric containing the number of errors for a specific API operation performed on this memory.
   */
  public metricErrorsForApiOperation(operation: string, props?: MetricOptions): Metric {
    return this.metricForApiOperation('Errors', operation, { statistic: Stats.SUM, ...props });
  }
  /**
   * Returns the metric containing the number of short-term memory events.
   */
  public metricEventCreationCount(props?: MetricOptions): Metric {
    return this.metric('CreationCount', { ItemType: 'Event' }, { statistic: Stats.SUM, ...props });
  }
  /**
   * Returns the metric containing the number of long-term memory records
   * created by the long-term extraction strategies.
   */
  public metricMemoryRecordCreationCount(props?: MetricOptions): Metric {
    return this.metric(
      'CreationCount',
      { ItemType: 'MemoryRecordsExtracted' },
      { statistic: Stats.SUM, ...props },
    );
  }
  /**
   * Internal method to create a metric.
   */
  private configureMetric(props: MetricProps) {
    return new Metric({
      ...props,
      region: props?.region ?? this.stack.region,
      account: props?.account ?? this.stack.account,
    });
  }
}

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating a Memory resource
 */
export interface MemoryProps {
  /**
   * The name of the memory
   * Valid characters are a-z, A-Z, 0-9, _ (underscore)
   * The name must start with a letter and can be up to 48 characters long
   * Pattern: [a-zA-Z][a-zA-Z0-9_]{0,47}
   * @default - auto generate
   */
  readonly memoryName?: string;
  /**
   * Short-term memory expiration in days (between 7 and 365).
   * Sets the short-term (raw event) memory retention.
   * Events older than the specified duration will expire and no longer be stored.
   * @default - 90 days
   */
  readonly expirationDuration?: Duration;
  /**
   * Optional description for the memory
   * Valid characters are a-z, A-Z, 0-9, _ (underscore), - (hyphen) and spaces
   * The description can have up to 200 characters
   * @default - No description
   */
  readonly description?: string;
  /**
   * Custom KMS key to use for encryption.
   * @default - Your data is encrypted with a key that AWS owns and manages for you
   */
  readonly kmsKey?: kms.IKey;
  /**
   * If you need long-term memory for context recall across sessions,
   * you can setup memory extraction strategies to extract the relevant memory from the raw events.
   * @default - No extraction strategies (short term memory only)
   */
  readonly memoryStrategies?: IMemoryStrategy[];
  /**
   * The IAM role that provides permissions for the memory to access AWS services
   * when using custom strategies.
   *
   * @default - A new role will be created.
   */
  readonly executionRole?: iam.IRole;
  /**
   * Tags (optional)
   * A list of key:value pairs of tags to apply to this memory resource
   *
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
/**
 * Attributes for specifying an imported Memory.
 */
export interface MemoryAttributes {
  /**
   * The ARN of the memory.
   * @attribute
   */
  readonly memoryArn: string;
  /**
   * The ARN of the IAM role associated to the memory.
   * @attribute
   */
  readonly roleArn: string;
  /**
   * When this memory was last updated.
   * @default undefined - No last updated timestamp is provided
   */
  readonly updatedAt?: string;
  /**
   * Optional KMS encryption key associated with this memory
   * @default undefined - An AWS managed key is used
   */
  readonly kmsKeyArn?: string;
  /**
   * The status of the memory.
   * @default undefined - No status is provided
   */
  readonly status?: string;
  /**
   * The created timestamp of the memory.
   * @default undefined - No created timestamp is provided
   */
  readonly createdAt?: string;
}

/******************************************************************************
 *                                Class
 *****************************************************************************/
/**
 * Long-term memory store for extracted insights like user preferences, semantic facts and summaries.
 * Enables knowledge retention across sessions by storing user preferences (e.g. coding style),
 * semantic facts (e.g. learned info) and interaction summaries for context optimization.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html
 * @resource AWS::BedrockAgentCore::Memory
 */
@propertyInjectable
export class Memory extends MemoryBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-agentcore-alpha.Memory';

  /**
   * Static Method for importing an existing Bedrock AgentCore Memory.
   */
  /**
   * Creates an Memory reference from an existing memory's attributes.
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   * @param attrs - Attributes of the existing browser custom
   * @returns An IBrowserCustom reference to the existing browser
   */
  public static fromMemoryAttributes(scope: Construct, id: string, attrs: MemoryAttributes): IMemory {
    class Import extends MemoryBase {
      public readonly memoryArn = attrs.memoryArn;
      public readonly memoryId = Arn.split(attrs.memoryArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
      public readonly executionRole = iam.Role.fromRoleArn(scope, `${id}Role`, attrs.roleArn);
      public readonly kmsKey = attrs.kmsKeyArn ? kms.Key.fromKeyArn(scope, `${id}Key`, attrs.kmsKeyArn) : undefined;
      public readonly updatedAt = attrs.updatedAt;
      public readonly grantPrincipal = this.executionRole;
      public readonly status = attrs.status;
      public readonly createdAt = attrs.createdAt;

      constructor(s: Construct, i: string) {
        super(s, i);

        this.grantPrincipal = this.executionRole || new iam.UnknownPrincipal({ resource: this });
      }
    }

    // Return new Memory
    return new Import(scope, id);
  }

  // ------------------------------------------------------
  // Attributes
  // ------------------------------------------------------
  /**
   * The ARN of the memory resource.
   * @attribute
   */
  public readonly memoryArn: string;
  /**
   * The name of the memory.
   * @attribute
   */
  public readonly memoryName: string;
  /**
   * The id of the memory.
   * @attribute
   */
  public readonly memoryId: string;
  /**
   * The expiration days of the memory.
   */
  public readonly expirationDuration?: Duration;
  /**
   * The failure reason of the browser
   * @attribute
   */
  public readonly failureReason?: string;
  /**
   * The description of the memory.
   */
  public readonly description?: string;
  /**
   * The execution role of the memory.
   */
  public readonly executionRole?: iam.IRole;
  /**
   * The status of the memory.
   */
  public readonly status?: string;
  /**
   * The created timestamp of the memory.
   */
  public readonly createdAt?: string;
  /**
   * The updated at timestamp of the memory.
   */
  public readonly updatedAt?: string;
  /**
   * Tags applied to this browser resource
   * A map of key-value pairs for resource tagging
   * @default - No tags applied
   */
  public readonly tags?: { [key: string]: string };
  /**
   * The principal to grant permissions to
   */
  public readonly grantPrincipal: iam.IPrincipal;
  /**
   * The KMS key used to encrypt the memory.
   */
  public readonly kmsKey?: kms.IKey;
  /**
   * The memory strategies used by the memory.
   * @attribute
   */
  public readonly memoryStrategies: IMemoryStrategy[] = [];
  // ------------------------------------------------------
  // Internal Only
  // ------------------------------------------------------
  private readonly __resource: CfnMemory;

  // ------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------
  constructor(scope: Construct, id: string, props: MemoryProps = {}) {
    super(scope, id, {
      // Maximum name length of 48 characters
      // @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-bedrockagentcore-memory.html#cfn-bedrockagentcore-memory-name
      physicalName: props?.memoryName ??
        Lazy.string({
          produce: () => Names.uniqueResourceName(this, { maxLength: 48 }),
        }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // ------------------------------------------------------
    // Set properties and defaults
    // ------------------------------------------------------
    this.memoryName = this.physicalName;
    this.expirationDuration = props.expirationDuration ?? Duration.days(90);
    this.description = props.description;
    this.kmsKey = props.kmsKey;
    this.executionRole = props.executionRole ?? this._createMemoryRole();
    this.grantPrincipal = this.executionRole;
    this.tags = props.tags;

    // ------------------------------------------------------
    // Permissions
    // ------------------------------------------------------
    // For KMS permissions see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/storage-encryption.html
    if (this.kmsKey) {
      this.kmsKey.grant(this.executionRole,
        'kms:CreateGrant',
        'kms:Decrypt',
        'kms:DescribeKey',
        'kms:GenerateDataKey',
        'kms:GenerateDataKeyWithoutPlaintext',
        'kms:ReEncrypt*',
      );
    }

    // ------------------------------------------------------
    // Validations
    // ------------------------------------------------------

    // Validate memory name
    throwIfInvalid(this._validateMemoryName, this.memoryName, this);

    // Validate expiration duration
    throwIfInvalid(this._validateMemoryExpirationDays, this.expirationDuration.toDays());

    // Validate memory tags
    throwIfInvalid(this._validateMemoryTags, this.tags, this);

    // Memory strategies are already validated when building them, so no need to validate them here

    // ------------------------------------------------------
    // CFN Props - With Lazy support
    // ------------------------------------------------------
    const cfnProps: CfnMemoryProps = {
      name: this.memoryName,
      description: this.description,
      eventExpiryDuration: this.expirationDuration.toDays(),
      encryptionKeyArn: this.kmsKey?.keyArn,
      memoryExecutionRoleArn: this.executionRole?.roleArn,
      memoryStrategies: Lazy.any({ produce: () => this._renderMemoryStrategies() }, { omitEmptyArray: true }),
      tags: this.tags,
    };

    // ------------------------------------------------------
    // CFN Resource
    // ------------------------------------------------------
    this.__resource = new CfnMemory(this, 'Memory', cfnProps);

    this.memoryId = this.__resource.attrMemoryId;
    this.memoryArn = this.__resource.attrMemoryArn;
    this.status = this.__resource.attrStatus;
    this.updatedAt = this.__resource.attrUpdatedAt;
    this.createdAt = this.__resource.attrCreatedAt;
    this.failureReason = this.__resource.attrFailureReason;

    // Add memory strategies to the memory
    for (const strategy of props?.memoryStrategies ?? []) {this.addMemoryStrategy(strategy);}
  }

  // ------------------------------------------------------
  // HELPER METHODS - addX()
  // ------------------------------------------------------
  /**
   * Add memory strategy to the memory.
   * @default - No memory strategies.
   */
  @MethodMetadata()
  public addMemoryStrategy(memoryStrategy: IMemoryStrategy) {
    // Add the memory strategy to the memory
    this.memoryStrategies.push(memoryStrategy);

    // Grant necessary permissions to the execution role
    const grant = memoryStrategy.grant(this.executionRole as iam.IRole);
    grant?.applyBefore(this.__resource);
  }

  /**
   * Creates execution role needed for the memory to access AWS services
   * @returns The created role
   * @internal This is an internal core function and should not be called directly.
   */
  private _createMemoryRole(): iam.IRole {
    const role = new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
    });

    return role;
  }

  // ------------------------------------------------------
  // VALIDATORS
  // ------------------------------------------------------
  /**
   * Validates the memory tags format
   * @param tags The tags object to validate
   * @returns Array of validation error messages, empty if valid
   */
  private _validateMemoryTags = (tags?: { [key: string]: string }, scope?: IConstruct): string[] => {
    let errors: string[] = [];
    if (!tags) {
      return errors; // Tags are optional
    }

    // Validate each tag key and value
    for (const [key, value] of Object.entries(tags)) {
      errors.push(...validateStringFieldLength({
        value: key,
        fieldName: 'Tag key',
        minLength: MEMORY_TAG_MIN_LENGTH,
        maxLength: MEMORY_TAG_MAX_LENGTH,
      }, scope));

      // Validate tag key pattern: ^[a-zA-Z0-9\s._:/=+@-]*$
      const validKeyPattern = /^[a-zA-Z0-9\s._:/=+@-]*$/;
      errors.push(...validateFieldPattern(key, 'Tag key', validKeyPattern, undefined, scope));

      // Validate tag value
      errors.push(...validateStringFieldLength({
        value: value,
        fieldName: 'Tag value',
        minLength: MEMORY_TAG_MIN_LENGTH,
        maxLength: MEMORY_TAG_MAX_LENGTH,
      }, scope));

      // Validate tag value pattern: ^[a-zA-Z0-9\s._:/=+@-]*$
      const validValuePattern = /^[a-zA-Z0-9\s._:/=+@-]*$/;
      errors.push(...validateFieldPattern(value, 'Tag value', validValuePattern, undefined, scope));
    }

    return errors;
  };

  /**
   * Validates the memory name format
   * @param name The memory name to validate
   * @returns Array of validation error messages, empty if valid
   */
  private _validateMemoryName = (name: string, scope?: IConstruct): string[] => {
    let errors: string[] = [];

    errors.push(...validateStringFieldLength({
      value: name,
      fieldName: 'Memory name',
      minLength: MEMORY_NAME_MIN_LENGTH,
      maxLength: MEMORY_NAME_MAX_LENGTH,
    }, scope));

    // Check if name matches the AWS API pattern: [a-zA-Z][a-zA-Z0-9_]{0,47}
    // Must start with a letter, followed by up to 47 letters, numbers, or underscores
    const validNamePattern = /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/;
    errors.push(...validateFieldPattern(name, 'Memory name', validNamePattern, undefined, scope));

    return errors;
  };

  /**
   * Validates the memory expiration days
   * @param expirationDays The memory expiration days to validate
   * @returns Array of validation error messages, empty if valid
   */
  private _validateMemoryExpirationDays = (expirationDays: number): string[] => {
    let errors: string[] = [];

    if (Token.isUnresolved(expirationDays)) {
      return errors;
    }

    if (expirationDays < MEMORY_EXPIRATION_DAYS_MIN || expirationDays > MEMORY_EXPIRATION_DAYS_MAX) {
      errors.push(`Memory expiration days must be between ${MEMORY_EXPIRATION_DAYS_MIN} and ${MEMORY_EXPIRATION_DAYS_MAX}`);
    }

    return errors;
  };

  // ------------------------------------------------------
  // RENDERERS
  // ------------------------------------------------------
  /**
   * Render the memory strategies.
   *
   * @returns Array of MemoryStrategyProperty objects in CloudFormation format, or undefined if no strategies are defined
   * @default - undefined if no strategies are defined or array is empty
   * @internal This is an internal core function and should not be called directly.
   */
  private _renderMemoryStrategies(): CfnMemory.MemoryStrategyProperty[] | undefined {
    if (!this.memoryStrategies || this.memoryStrategies.length === 0) {
      return undefined;
    }

    return this.memoryStrategies.map(ms => ms.render());
  }
}
