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

import { Arn, ArnFormat, Aws, Stack } from 'aws-cdk-lib';
import * as bedrockagentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import * as iam from 'aws-cdk-lib/aws-iam';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { DataSourceConfig } from './data-source';
import type { EvaluatorReference } from './evaluator';
import { type IOnlineEvaluationConfig, OnlineEvaluationBase } from './online-evaluation-base';
import { EvaluationPerms } from './perms';
import {
  type OnlineEvaluationBaseProps,
  type OnlineEvaluationConfigAttributes,
} from './types';
import {
  validateConfigName,
  validateDescription,
  validateEvaluators,
  validateSamplingPercentage,
  validateFilters,
  validateSessionTimeout,
  throwIfInvalid,
} from './validation-helpers';

/**
 * Properties for creating an OnlineEvaluationConfig.
 */
export interface OnlineEvaluationConfigProps extends OnlineEvaluationBaseProps {
  /**
   * The list of evaluators to apply during online evaluation.
   *
   * Can include both built-in evaluators and custom evaluators.
   *
   * @minimum 1
   * @maximum 10
   */
  readonly evaluators: EvaluatorReference[];

  /**
   * The data source configuration that specifies where to read agent traces from.
   */
  readonly dataSource: DataSourceConfig;
}

/**
 * Online evaluation configuration for Amazon Bedrock AgentCore.
 *
 * Enables continuous evaluation of agent performance using built-in or custom evaluators.
 * Supports CloudWatch Logs and Agent Endpoint data sources.
 *
 * @resource AWS::BedrockAgentCore::OnlineEvaluationConfig
 *
 * @example
 * // Basic usage with built-in evaluators
 * const evaluation = new agentcore.OnlineEvaluationConfig(this, 'MyEvaluation', {
 *   configName: 'my_evaluation',
 *   evaluators: [
 *     agentcore.EvaluatorReference.builtin(agentcore.BuiltinEvaluator.HELPFULNESS),
 *     agentcore.EvaluatorReference.builtin(agentcore.BuiltinEvaluator.CORRECTNESS),
 *   ],
 *   dataSource: agentcore.DataSourceConfig.fromCloudWatchLogs({
 *     logGroupNames: ['/aws/bedrock-agentcore/my-agent'],
 *     serviceNames: ['my-agent.default'],
 *   }),
 * });
 */
@propertyInjectable
export class OnlineEvaluationConfig extends OnlineEvaluationBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string =
    '@aws-cdk.aws-bedrock-agentcore-alpha.OnlineEvaluationConfig';

  /**
   * Import an existing OnlineEvaluationConfig by its ID.
   *
   * @param scope - The construct scope
   * @param id - Construct identifier
   * @param onlineEvaluationConfigId - The configuration ID to import
   * @returns An IOnlineEvaluationConfig reference
   */
  public static fromOnlineEvaluationConfigId(
    scope: Construct,
    id: string,
    onlineEvaluationConfigId: string,
  ): IOnlineEvaluationConfig {
    const stack = Stack.of(scope);
    const configArn = Arn.format(
      {
        service: 'bedrock-agentcore',
        resource: 'online-evaluation-config',
        resourceName: onlineEvaluationConfigId,
      },
      stack,
    );

    return OnlineEvaluationConfig.fromOnlineEvaluationConfigAttributes(scope, id, {
      configArn,
      configId: onlineEvaluationConfigId,
      configName: onlineEvaluationConfigId, // Use ID as name when importing by ID
    });
  }

  /**
   * Import an existing OnlineEvaluationConfig by its ARN.
   *
   * @param scope - The construct scope
   * @param id - Construct identifier
   * @param onlineEvaluationConfigArn - The configuration ARN to import
   * @returns An IOnlineEvaluationConfig reference
   */
  public static fromOnlineEvaluationConfigArn(
    scope: Construct,
    id: string,
    onlineEvaluationConfigArn: string,
  ): IOnlineEvaluationConfig {
    const arnParts = Arn.split(onlineEvaluationConfigArn, ArnFormat.SLASH_RESOURCE_NAME);
    const configId = arnParts.resourceName!;

    return OnlineEvaluationConfig.fromOnlineEvaluationConfigAttributes(scope, id, {
      configArn: onlineEvaluationConfigArn,
      configId,
      configName: configId, // Use ID as name when importing by ARN
    });
  }

  /**
   * Import an existing OnlineEvaluationConfig from its attributes.
   *
   * @param scope - The construct scope
   * @param id - Construct identifier
   * @param attrs - The configuration attributes
   * @returns An IOnlineEvaluationConfig reference
   */
  public static fromOnlineEvaluationConfigAttributes(
    scope: Construct,
    id: string,
    attrs: OnlineEvaluationConfigAttributes,
  ): IOnlineEvaluationConfig {
    class Import extends OnlineEvaluationBase {
      public readonly configArn = attrs.configArn;
      public readonly configId = attrs.configId;
      public readonly configName = attrs.configName;
      public readonly executionRole = attrs.executionRoleArn
        ? iam.Role.fromRoleArn(scope, `${id}Role`, attrs.executionRoleArn)
        : undefined;
      public readonly status = undefined;
      public readonly executionStatus = undefined;
      public readonly grantPrincipal: iam.IPrincipal;

      constructor(s: Construct, i: string) {
        super(s, i);
        this.grantPrincipal = this.executionRole ?? new iam.UnknownPrincipal({ resource: this });
      }
    }

    return new Import(scope, id);
  }

  /**
   * The ARN of the online evaluation configuration.
   * @attribute
   */
  public readonly configArn: string;

  /**
   * The unique identifier of the online evaluation configuration.
   * @attribute
   */
  public readonly configId: string;

  /**
   * The name of the online evaluation configuration.
   * @attribute
   */
  public readonly configName: string;

  /**
   * The IAM execution role for the evaluation.
   */
  public readonly executionRole?: iam.IRole;

  /**
   * The lifecycle status of the configuration.
   * @attribute
   */
  public readonly status?: string;

  /**
   * The execution status of the evaluation.
   * @attribute
   */
  public readonly executionStatus?: string;

  /**
   * The principal to grant permissions to.
   */
  public readonly grantPrincipal: iam.IPrincipal;

  constructor(scope: Construct, id: string, props: OnlineEvaluationConfigProps) {
    super(scope, id);

    addConstructMetadata(this, props);

    throwIfInvalid(validateConfigName, props.configName, this);
    throwIfInvalid(validateDescription, props.description, this);
    throwIfInvalid(validateEvaluators, props.evaluators, this);
    throwIfInvalid(validateSamplingPercentage, props.samplingPercentage, this);
    throwIfInvalid(validateFilters, props.filters, this);
    throwIfInvalid(validateSessionTimeout, props.sessionTimeoutMinutes, this);

    this.configName = props.configName;
    this.executionRole = props.executionRole ?? this.createExecutionRole();
    this.grantPrincipal = this.executionRole;

    // Convert tags from Record<string,string> to Array<CfnTag>
    const cfnTags = props.tags
      ? Object.entries(props.tags).map(([key, value]) => ({ key, value }))
      : undefined;

    const resource = new bedrockagentcore.CfnOnlineEvaluationConfig(this, 'Resource', {
      onlineEvaluationConfigName: props.configName,
      evaluators: props.evaluators.map((e) => e._render()),
      dataSourceConfig: props.dataSource._render(),
      evaluationExecutionRoleArn: this.executionRole!.roleArn,
      rule: this.buildRuleConfig(props),
      description: props.description,
      tags: cfnTags,
    });

    // Ensure the execution role's policies are created before the L1 resource,
    // because BedrockAgentCore validates role permissions at create time.
    if (this.executionRole instanceof iam.Role && this.executionRole.node.defaultChild) {
      resource.node.addDependency(this.executionRole);
    }

    this.configArn = resource.attrOnlineEvaluationConfigArn;
    this.configId = resource.attrOnlineEvaluationConfigId;
    this.status = resource.attrStatus;
    this.executionStatus = resource.attrExecutionStatus;
  }

  private createExecutionRole(): iam.IRole {
    const stack = Stack.of(this);

    const role = new iam.Role(this, 'ExecutionRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com', {
        conditions: {
          StringEquals: {
            'aws:SourceAccount': stack.account,
            'aws:ResourceAccount': stack.account,
          },
          ArnLike: {
            'aws:SourceArn': [
              Arn.format(
                {
                  service: 'bedrock-agentcore',
                  resource: 'evaluator',
                  resourceName: '*',
                },
                stack,
              ),
              Arn.format(
                {
                  service: 'bedrock-agentcore',
                  resource: 'online-evaluation-config',
                  resourceName: '*',
                },
                stack,
              ),
            ],
          },
        },
      }),
      description: 'Execution role for Bedrock AgentCore Online Evaluation',
    });

    role.addToPolicy(
      new iam.PolicyStatement({
        sid: 'CloudWatchLogReadStatement',
        actions: EvaluationPerms.CLOUDWATCH_LOGS_READ_PERMS,
        resources: ['*'],
      }),
    );

    role.addToPolicy(
      new iam.PolicyStatement({
        sid: 'CloudWatchLogWriteStatement',
        actions: EvaluationPerms.CLOUDWATCH_LOGS_WRITE_PERMS,
        resources: [
          Arn.format(
            {
              service: 'logs',
              resource: 'log-group',
              resourceName: '/aws/bedrock-agentcore/evaluations/*',
              arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            },
            stack,
          ),
        ],
      }),
    );

    role.addToPolicy(
      new iam.PolicyStatement({
        sid: 'CloudWatchIndexPolicyStatement',
        actions: EvaluationPerms.CLOUDWATCH_INDEX_POLICY_PERMS,
        resources: [
          Arn.format(
            {
              service: 'logs',
              resource: 'log-group',
              resourceName: 'aws/spans',
              arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            },
            stack,
          ),
          Arn.format(
            {
              service: 'logs',
              resource: 'log-group',
              resourceName: 'aws/spans:*',
              arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            },
            stack,
          ),
        ],
      }),
    );

    role.addToPolicy(
      new iam.PolicyStatement({
        sid: 'BedrockInvokeStatement',
        actions: EvaluationPerms.BEDROCK_MODEL_PERMS,
        resources: [
          `arn:${Aws.PARTITION}:bedrock:*::foundation-model/*`,
          Arn.format(
            {
              service: 'bedrock',
              resource: 'inference-profile',
              resourceName: '*',
              region: '*',
            },
            stack,
          ),
        ],
      }),
    );

    return role;
  }

  private buildRuleConfig(props: OnlineEvaluationConfigProps): any {
    const rule: any = {
      samplingConfig: {
        samplingPercentage: props.samplingPercentage ?? 10,
      },
      sessionConfig: {
        sessionTimeoutMinutes: props.sessionTimeoutMinutes ?? 15,
      },
    };

    if (props.filters && props.filters.length > 0) {
      rule.filters = props.filters.map((f) => ({
        key: f.key,
        operator: f.operator,
        value: this.formatFilterValue(f.value),
      }));
    }

    return rule;
  }

  private formatFilterValue(value: string | number | boolean): any {
    if (typeof value === 'string') {
      return { stringValue: value };
    } else if (typeof value === 'number') {
      return { doubleValue: value };
    } else if (typeof value === 'boolean') {
      return { booleanValue: value };
    }
    return { stringValue: String(value) };
  }
}
