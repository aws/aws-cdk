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
import { Arn, ArnFormat, Lazy, Resource, Stack, Names } from 'aws-cdk-lib';
import * as agent_core from 'aws-cdk-lib/aws-bedrockagentcore';
import * as iam from 'aws-cdk-lib/aws-iam';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { IEvaluator } from './evaluator';
import * as perms from './perms';
import { validateOnlineEvaluationConfigName, validateSamplingPercentage, validateEvaluatorCount, validateTags, throwIfInvalid } from './validation-helpers';

/******************************************************************************
 *                                Enums
 *****************************************************************************/

/**
 * The execution status of an online evaluation configuration.
 */
export enum ExecutionStatus {
  /** The online evaluation configuration is actively processing traces. */
  ENABLED = 'ENABLED',
  /** The online evaluation configuration is paused. */
  DISABLED = 'DISABLED',
}

/******************************************************************************
 *                          Data Source Config
 *****************************************************************************/

/**
 * Properties for creating a CloudWatch Logs data source configuration.
 */
export interface CloudWatchLogsDataSourceProps {
  /**
   * The CloudWatch log group names to monitor.
   */
  readonly logGroupNames: string[];

  /**
   * The service names associated with the log groups.
   */
  readonly serviceNames: string[];
}

/**
 * Configuration for the data source used by an online evaluation.
 *
 * Use the static factory methods to create a data source configuration.
 * Currently supports CloudWatch Logs as a data source.
 */
export class DataSourceConfig {
  /**
   * Creates a CloudWatch Logs data source configuration.
   *
   * @param props - The CloudWatch Logs data source properties
   * @returns A DataSourceConfig configured for CloudWatch Logs
   */
  public static fromCloudWatchLogs(props: CloudWatchLogsDataSourceProps): DataSourceConfig {
    return new DataSourceConfig(props);
  }

  /**
   * The CloudWatch log group names configured for this data source.
   */
  public readonly logGroupNames: string[];

  private readonly config: CloudWatchLogsDataSourceProps;

  private constructor(config: CloudWatchLogsDataSourceProps) {
    this.config = config;
    this.logGroupNames = config.logGroupNames;
  }

  /**
   * Renders the data source configuration to the L1 CloudFormation shape.
   * @internal
   */
  public _render(): any {
    return {
      cloudWatchLogs: {
        logGroupNames: this.config.logGroupNames,
        serviceNames: this.config.serviceNames,
      },
    };
  }
}

/******************************************************************************
 *                            Filter Value
 *****************************************************************************/

/**
 * Represents a filter value for online evaluation filter conditions.
 *
 * Use the static factory methods to create a filter value from a string,
 * number, or boolean. This avoids jsii-incompatible union types.
 */
export class FilterValue {
  /**
   * Creates a filter value from a string.
   *
   * @param value - The string value
   * @returns A FilterValue wrapping the string
   */
  public static fromString(value: string): FilterValue {
    return new FilterValue({ stringValue: value });
  }

  /**
   * Creates a filter value from a number.
   *
   * @param value - The numeric value
   * @returns A FilterValue wrapping the number
   */
  public static fromNumber(value: number): FilterValue {
    return new FilterValue({ doubleValue: value });
  }

  /**
   * Creates a filter value from a boolean.
   *
   * @param value - The boolean value
   * @returns A FilterValue wrapping the boolean
   */
  public static fromBoolean(value: boolean): FilterValue {
    return new FilterValue({ booleanValue: value });
  }

  private readonly config: {
    stringValue?: string;
    doubleValue?: number;
    booleanValue?: boolean;
  };

  private constructor(config: { stringValue?: string; doubleValue?: number; booleanValue?: boolean }) {
    this.config = config;
  }

  /**
   * Renders the filter value to the L1 CloudFormation shape.
   * @internal
   */
  public _render(): any {
    if (this.config.stringValue !== undefined) {
      return { stringValue: this.config.stringValue };
    }
    if (this.config.doubleValue !== undefined) {
      return { doubleValue: this.config.doubleValue };
    }
    return { booleanValue: this.config.booleanValue };
  }
}

/******************************************************************************
 *                          Filter Condition
 *****************************************************************************/

/**
 * A filter condition for selecting which sessions to evaluate.
 */
export interface FilterCondition {
  /**
   * The key to filter on.
   */
  readonly key: string;

  /**
   * The comparison operator (e.g., "EQUALS", "NOT_EQUALS").
   */
  readonly operator: string;

  /**
   * The value to compare against.
   */
  readonly value: FilterValue;
}

/******************************************************************************
 *                        Evaluator Reference
 *****************************************************************************/

/**
 * A reference to an evaluator for use in an online evaluation configuration.
 *
 * Supports both built-in evaluator IDs (e.g., "Builtin.Helpfulness") and
 * custom Evaluator construct instances. Use the static factory methods to
 * create a reference.
 */
export class EvaluatorReference {
  /**
   * Creates a reference to a built-in evaluator by its ID.
   *
   * @param evaluatorId - The built-in evaluator ID (e.g., "Builtin.Helpfulness")
   * @returns An EvaluatorReference for the built-in evaluator
   */
  public static fromBuiltIn(evaluatorId: string): EvaluatorReference {
    return new EvaluatorReference({ builtInId: evaluatorId });
  }

  /**
   * Creates a reference to a custom Evaluator construct.
   *
   * @param evaluator - The Evaluator construct instance
   * @returns An EvaluatorReference for the custom evaluator
   */
  public static fromEvaluator(evaluator: IEvaluator): EvaluatorReference {
    return new EvaluatorReference({ evaluator });
  }

  private readonly config: {
    builtInId?: string;
    evaluator?: IEvaluator;
  };

  private constructor(config: { builtInId?: string; evaluator?: IEvaluator }) {
    this.config = config;
  }

  /**
   * Renders the evaluator reference to the evaluator ID string.
   * @internal
   */
  public _render(): string {
    if (this.config.builtInId) {
      return this.config.builtInId;
    }
    return this.config.evaluator!.evaluatorId;
  }

  /**
   * Returns whether this reference points to a custom evaluator.
   * @internal
   */
  public _isCustom(): boolean {
    return this.config.evaluator !== undefined;
  }

  /**
   * Returns the ARN of the custom evaluator, or undefined for built-in evaluators.
   * @internal
   */
  public _getArn(): string | undefined {
    return this.config.evaluator?.evaluatorArn;
  }

  /**
   * Returns the model ID if the custom evaluator uses LLM-as-a-Judge, undefined otherwise.
   * @internal
   */
  public _getModelId(): string | undefined {
    if (!this.config.evaluator) return undefined;
    // Access the _evaluatorConfig if available (only on concrete Evaluator, not imported)
    const evaluator = this.config.evaluator as any;
    return evaluator._evaluatorConfig?._getModelId();
  }
}


/******************************************************************************
 *                                Interface
 *****************************************************************************/

/**
 * Interface for OnlineEvaluationConfig resources.
 */
export interface IOnlineEvaluationConfig extends IResource, iam.IGrantable {
  /**
   * The ARN of the online evaluation configuration.
   * @attribute
   */
  readonly onlineEvaluationConfigArn: string;

  /**
   * The ID of the online evaluation configuration.
   * @attribute
   */
  readonly onlineEvaluationConfigId: string;

  /**
   * Grants IAM actions to the IAM Principal.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grants `Get` and `List` actions on the OnlineEvaluationConfig.
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grants `Update`, `Delete`, and read actions on the OnlineEvaluationConfig.
   */
  grantManage(grantee: iam.IGrantable): iam.Grant;
}

/******************************************************************************
 *                        ABSTRACT BASE CLASS
 *****************************************************************************/

/**
 * Abstract base class for an OnlineEvaluationConfig.
 * Contains methods and attributes valid for OnlineEvaluationConfigs either created with CDK or imported.
 */
export abstract class OnlineEvaluationConfigBase extends Resource implements IOnlineEvaluationConfig {
  public abstract readonly onlineEvaluationConfigArn: string;
  public abstract readonly onlineEvaluationConfigId: string;

  /**
   * The principal to grant permissions to.
   */
  public abstract readonly grantPrincipal: iam.IPrincipal;

  constructor(scope: Construct, id: string, props: ResourceProps = {}) {
    super(scope, id, props);
  }

  /**
   * Grants IAM actions to the IAM Principal.
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
      resourceArns: [this.onlineEvaluationConfigArn],
    });
  }

  /**
   * Grant read permissions on this online evaluation config to an IAM principal.
   * This includes both read permissions on the specific config and list permissions on all configs.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant read permissions to
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    const resourceSpecificGrant = this.grant(
      grantee,
      ...perms.ONLINE_EVAL_CONFIG_READ_PERMS,
    );

    const allResourceGrant = iam.Grant.addToPrincipal({
      grantee,
      resourceArns: ['*'],
      actions: perms.ONLINE_EVAL_CONFIG_LIST_PERMS,
    });

    return resourceSpecificGrant.combine(allResourceGrant);
  }

  /**
   * Grant manage permissions on this online evaluation config to an IAM principal.
   * This includes update, delete, and read permissions.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant manage permissions to
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantManage(grantee: iam.IGrantable): iam.Grant {
    const manageGrant = this.grant(
      grantee,
      ...perms.ONLINE_EVAL_CONFIG_MANAGE_PERMS,
    );

    const readGrant = this.grantRead(grantee);

    return manageGrant.combine(readGrant);
  }
}


/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/

/**
 * Properties for creating an OnlineEvaluationConfig resource.
 */
export interface OnlineEvaluationConfigProps {
  /**
   * The name of the online evaluation configuration.
   * Valid characters are a-z, A-Z, 0-9, _ (underscore).
   * The name must start with a letter and can be up to 48 characters long.
   * Pattern: [a-zA-Z][a-zA-Z0-9_]{0,47}
   *
   * @default - auto-generated
   */
  readonly onlineEvaluationConfigName?: string;

  /**
   * The data source configuration for the online evaluation.
   */
  readonly dataSourceConfig: DataSourceConfig;

  /**
   * The list of evaluator references to use for evaluation.
   * Supports both built-in evaluator IDs and custom Evaluator construct instances.
   * Maximum of 10 evaluator references allowed.
   */
  readonly evaluators: EvaluatorReference[];

  /**
   * The percentage of agent sessions to evaluate (0.01 to 100).
   */
  readonly samplingPercentage: number;

  /**
   * Optional description for the online evaluation configuration.
   *
   * @default - No description
   */
  readonly description?: string;

  /**
   * Tags to apply to this online evaluation configuration resource.
   *
   * @default - No tags
   */
  readonly tags?: { [key: string]: string };

  /**
   * The IAM role that provides permissions for the evaluation service.
   * If not provided, a new role will be created with the necessary permissions.
   *
   * Note: The AgentCore Evaluations service validates IAM permissions synchronously
   * during resource creation. Due to IAM eventual consistency, the auto-created role's
   * policies may not have propagated in time. For production deployments, consider
   * creating the role separately (e.g., in a shared stack or earlier in the construct tree)
   * so that the role and its policies are fully propagated before the OnlineEvaluationConfig
   * resource is created.
   *
   * @default - A new role is created
   */
  readonly executionRole?: iam.IRole;

  /**
   * The execution status of the online evaluation configuration.
   *
   * @default ExecutionStatus.DISABLED
   */
  readonly executionStatus?: ExecutionStatus;

  /**
   * Optional filter conditions to select which sessions to evaluate.
   *
   * @default - No filters
   */
  readonly filters?: FilterCondition[];

  /**
   * Optional session timeout in minutes.
   *
   * @default - No session timeout
   */
  readonly sessionTimeoutMinutes?: number;
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/

/**
 * Attributes for specifying an imported OnlineEvaluationConfig.
 */
export interface OnlineEvaluationConfigAttributes {
  /**
   * The ARN of the online evaluation configuration.
   * @attribute
   */
  readonly onlineEvaluationConfigArn: string;
}


/******************************************************************************
 *                                Class
 *****************************************************************************/

/**
 * An OnlineEvaluationConfig resource for AWS Bedrock AgentCore.
 * Represents a continuous monitoring configuration that evaluates live agent
 * traffic from CloudWatch Logs using a set of evaluators.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html
 * @resource AWS::BedrockAgentCore::OnlineEvaluationConfig
 */
@propertyInjectable
export class OnlineEvaluationConfig extends OnlineEvaluationConfigBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-agentcore-alpha.OnlineEvaluationConfig';

  /**
   * Creates an OnlineEvaluationConfig reference from an existing config's attributes.
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   * @param attrs - Attributes of the existing online evaluation configuration
   * @returns An IOnlineEvaluationConfig reference to the existing config
   */
  public static fromOnlineEvaluationConfigAttributes(
    scope: Construct,
    id: string,
    attrs: OnlineEvaluationConfigAttributes,
  ): IOnlineEvaluationConfig {
    class Import extends OnlineEvaluationConfigBase {
      public readonly onlineEvaluationConfigArn = attrs.onlineEvaluationConfigArn;
      public readonly onlineEvaluationConfigId = Arn.split(attrs.onlineEvaluationConfigArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
      public readonly grantPrincipal: iam.IPrincipal;

      constructor(s: Construct, i: string) {
        super(s, i);
        this.grantPrincipal = new iam.UnknownPrincipal({ resource: this });
      }
    }

    return new Import(scope, id);
  }

  // ------------------------------------------------------
  // Attributes
  // ------------------------------------------------------

  /**
   * The ARN of the online evaluation configuration.
   * @attribute
   */
  public readonly onlineEvaluationConfigArn: string;

  /**
   * The ID of the online evaluation configuration.
   * @attribute
   */
  public readonly onlineEvaluationConfigId: string;

  /**
   * The status of the online evaluation configuration.
   * @attribute
   */
  public readonly status?: string;

  /**
   * The IAM role that provides permissions for the evaluation service.
   */
  public readonly executionRole: iam.IRole;

  /**
   * The principal to grant permissions to.
   */
  public readonly grantPrincipal: iam.IPrincipal;

  // ------------------------------------------------------
  // Internal Only
  // ------------------------------------------------------
  private readonly __resource: agent_core.CfnOnlineEvaluationConfig;

  // ------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------
  constructor(scope: Construct, id: string, props: OnlineEvaluationConfigProps) {
    super(scope, id, {
      physicalName: props.onlineEvaluationConfigName ??
        Lazy.string({
          produce: () => Names.uniqueResourceName(this, { maxLength: 48 }),
        }),
    });

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // ------------------------------------------------------
    // Validations
    // ------------------------------------------------------

    // Validate online evaluation config name
    throwIfInvalid(validateOnlineEvaluationConfigName, this.physicalName);

    // Validate sampling percentage
    throwIfInvalid(validateSamplingPercentage, props.samplingPercentage);

    // Validate evaluator count
    throwIfInvalid((evaluators: unknown[]) => validateEvaluatorCount(evaluators, 10), props.evaluators);

    // Validate tags
    throwIfInvalid(validateTags, props.tags);

    // ------------------------------------------------------
    // Execution Role
    // ------------------------------------------------------
    this.executionRole = props.executionRole ?? this._createExecutionRole(props);
    this.grantPrincipal = this.executionRole;

    // ------------------------------------------------------
    // CFN Props
    // ------------------------------------------------------

    // Build rule object
    const rule: any = {
      samplingConfig: {
        samplingPercentage: props.samplingPercentage,
      },
    };

    if (props.filters && props.filters.length > 0) {
      rule.filters = props.filters.map((f) => ({
        key: f.key,
        operator: f.operator,
        value: f.value._render(),
      }));
    }

    if (props.sessionTimeoutMinutes !== undefined) {
      rule.sessionConfig = {
        sessionTimeoutMinutes: props.sessionTimeoutMinutes,
      };
    }

    const cfnProps: agent_core.CfnOnlineEvaluationConfigProps = {
      onlineEvaluationConfigName: this.physicalName,
      dataSourceConfig: props.dataSourceConfig._render(),
      evaluators: props.evaluators.map((e) => ({ evaluatorId: e._render() })),
      evaluationExecutionRoleArn: this.executionRole.roleArn,
      rule,
      executionStatus: props.executionStatus ?? ExecutionStatus.DISABLED,
      description: props.description,
      tags: props.tags
        ? Object.entries(props.tags).map(([key, value]) => ({ key, value }))
        : undefined,
    };

    // ------------------------------------------------------
    // CFN Resource
    // ------------------------------------------------------
    this.__resource = new agent_core.CfnOnlineEvaluationConfig(this, 'Resource', cfnProps);

    // Ensure the role and its policies are created before the evaluation config,
    // to mitigate IAM eventual consistency issues during synchronous permission validation
    this.__resource.node.addDependency(this.executionRole);

    // Wire attributes from L1
    this.onlineEvaluationConfigArn = this.__resource.attrOnlineEvaluationConfigArn;
    this.onlineEvaluationConfigId = this.__resource.attrOnlineEvaluationConfigId;
    this.status = this.__resource.attrStatus;
  }

  /**
   * Creates the execution role needed for the evaluation service to access AWS resources.
   * @returns The created role
   * @internal This is an internal core function and should not be called directly.
   */
  private _createExecutionRole(props: OnlineEvaluationConfigProps): iam.IRole {
    const role = new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
    });

    // Grant CloudWatch Logs read permissions scoped to the configured log groups
    // CloudWatch Logs IAM requires :* suffix on log group ARNs to match log streams
    const logGroupArns = props.dataSourceConfig.logGroupNames.map((logGroupName) =>
      Stack.of(this).formatArn({
        service: 'logs',
        resource: 'log-group',
        resourceName: logGroupName + ':*',
        arnFormat: ArnFormat.COLON_RESOURCE_NAME,
      }),
    );

    // Also include the aws/spans log group that the service reads internally
    const spansLogGroupArn = Stack.of(this).formatArn({
      service: 'logs',
      resource: 'log-group',
      resourceName: 'aws/spans:*',
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['logs:GetLogEvents', 'logs:FilterLogEvents', 'logs:StartQuery', 'logs:GetQueryResults'],
      resources: [...logGroupArns, spansLogGroupArn],
    }));

    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['logs:DescribeLogGroups'],
      resources: ['*'],
    }));

    // Grant permissions to write evaluation results to the service-managed log group
    // The service creates log groups at /aws/bedrock-agentcore/evaluations/results/{config-name}
    const resultsLogGroupArn = Stack.of(this).formatArn({
      service: 'logs',
      resource: 'log-group',
      resourceName: '/aws/bedrock-agentcore/evaluations/results/' + this.physicalName + ':*',
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: [resultsLogGroupArn],
    }));

    // Grant InvokeEvaluator for custom evaluator ARNs
    const customEvaluatorArns = props.evaluators
      .filter((e) => e._isCustom())
      .map((e) => e._getArn()!)
      .filter((arn) => arn !== undefined);

    if (customEvaluatorArns.length > 0) {
      role.addToPrincipalPolicy(new iam.PolicyStatement({
        actions: ['bedrock-agentcore:InvokeEvaluator'],
        resources: customEvaluatorArns,
      }));
    }

    // Grant bedrock:InvokeModel for LLM-as-a-Judge evaluators, scoped to specific model ARNs
    const modelIds = props.evaluators
      .filter((e) => e._isCustom())
      .map((e) => e._getModelId())
      .filter((id): id is string => id !== undefined);

    if (modelIds.length > 0) {
      const modelArns = [...new Set(modelIds)].map((modelId) => {
        // Model IDs starting with a region prefix (us., eu., global., ap., etc.)
        // are inference profiles, not foundation models
        const isInferenceProfile = /^[a-z]{2,6}\./.test(modelId);
        return Stack.of(this).formatArn({
          service: 'bedrock',
          resource: isInferenceProfile ? 'inference-profile' : 'foundation-model',
          resourceName: modelId,
          arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
        });
      });

      role.addToPrincipalPolicy(new iam.PolicyStatement({
        actions: ['bedrock:InvokeModel'],
        resources: modelArns,
      }));
    }

    return role;
  }
}
