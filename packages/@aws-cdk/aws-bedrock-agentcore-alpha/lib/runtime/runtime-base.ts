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
import { Resource } from 'aws-cdk-lib';
import type { IRuntimeRef, RuntimeReference } from 'aws-cdk-lib/aws-bedrockagentcore';
import type {
  DimensionsMap,
  MetricOptions,
  MetricProps,
} from 'aws-cdk-lib/aws-cloudwatch';
import {
  Metric,
  Stats,
} from 'aws-cdk-lib/aws-cloudwatch';
import type * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import type { Construct } from 'constructs';
import { RUNTIME_INVOKE_PERMS, RUNTIME_INVOKE_USER_PERMS } from './perms';
import { ValidationError } from './validation-helpers';

/******************************************************************************
 *                                Interface
 *****************************************************************************/

/**
 * Interface for Agent Runtime resources
 */
export interface IBedrockAgentRuntime extends IResource, iam.IGrantable, ec2.IConnectable, IRuntimeRef {
  /**
   * The ARN of the agent runtime resource
   * - Format `arn:${Partition}:bedrock-agentcore:${Region}:${Account}:runtime/${RuntimeId}`
   *
   * @attribute
   * @example "arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/runtime-abc123"
   */
  readonly agentRuntimeArn: string;

  /**
   * The ID of the agent runtime
   * @attribute
   * @example "runtime-abc123"
   */
  readonly agentRuntimeId: string;

  /**
   * The name of the agent runtime
   */
  readonly agentRuntimeName: string;

  /**
   * The IAM role that provides permissions for the agent runtime
   *
   */
  readonly role: iam.IRole;

  /**
   * The version of the agent runtime
   * @attribute
   */
  readonly agentRuntimeVersion?: string;

  /**
   * The current status of the agent runtime
   */
  readonly agentStatus?: string;

  /**
   * The time at which the runtime was created
   * @attribute
   * @example "2024-01-15T10:30:00Z"
   */
  readonly createdAt?: string;

  /**
   * The time at which the runtime was last updated
   * @attribute
   * @example "2024-01-15T14:45:00Z"
   */
  readonly lastUpdatedAt?: string;

  // ------------------------------------------------------
  // Metrics
  // ------------------------------------------------------
  /**
   * Return the given named metric for this agent runtime.
   */
  metric(metricName: string, dimensions: DimensionsMap, props?: MetricOptions): Metric;

  /**
   * Return a metric containing the total number of invocations for this agent runtime.
   */
  metricInvocations(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the total number of invocations across all resources.
   */
  metricInvocationsAggregated(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of throttled requests for this agent runtime.
   */
  metricThrottles(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of system errors for this agent runtime.
   */
  metricSystemErrors(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of user errors for this agent runtime.
   */
  metricUserErrors(props?: MetricOptions): Metric;

  /**
   * Return a metric measuring the latency of requests for this agent runtime.
   */
  metricLatency(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the total number of errors (system + user) for this agent runtime.
   */
  metricTotalErrors(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of agent sessions for this agent runtime.
   */
  metricSessionCount(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the total number of sessions across all resources.
   */
  metricSessionsAggregated(props?: MetricOptions): Metric;

  // ------------------------------------------------------
  // Grant Methods
  // ------------------------------------------------------

  /**
   * Grant the runtime specific actions on AWS resources
   *
   * @param actions The actions to grant
   * @param resources The resource ARNs to grant access to
   * @returns The Grant object for chaining
   */
  grant(actions: string[], resources: string[]): iam.Grant;

  /**
   * Adds a policy statement to the runtime's execution role
   *
   * @param statement The IAM policy statement to add
   * @returns The runtime instance for chaining
   */
  addToRolePolicy(statement: iam.PolicyStatement): IBedrockAgentRuntime;

  /**
   * Permits an IAM principal to invoke this runtime
   * Grants the bedrock-agentcore:InvokeAgentRuntime permission
   * @param grantee The principal to grant access to
   */
  grantInvokeRuntime(grantee: iam.IGrantable): iam.Grant;

  /**
   * Permits an IAM principal to invoke this runtime on behalf of a user
   * Grants the bedrock-agentcore:InvokeAgentRuntimeForUser permission
   * Required when using the X-Amzn-Bedrock-AgentCore-Runtime-User-Id header
   * @param grantee The principal to grant access to
   */
  grantInvokeRuntimeForUser(grantee: iam.IGrantable): iam.Grant;

  /**
   * Permits an IAM principal to invoke this runtime both directly and on behalf of users
   * Grants both bedrock-agentcore:InvokeAgentRuntime and bedrock-agentcore:InvokeAgentRuntimeForUser permissions
   * @param grantee The principal to grant access to
   */
  grantInvoke(grantee: iam.IGrantable): iam.Grant;
}

/******************************************************************************
 *                                Base Class
 *****************************************************************************/

/**
 * Base class for Agent Runtime
 */
export abstract class RuntimeBase extends Resource implements IBedrockAgentRuntime {
  // Abstract properties
  public abstract readonly agentRuntimeArn: string;
  public abstract readonly agentRuntimeId: string;
  public abstract readonly agentRuntimeName: string;
  public abstract readonly role: iam.IRole;
  public abstract readonly agentRuntimeVersion?: string;
  public abstract readonly agentStatus?: string;
  public abstract readonly createdAt?: string;
  public abstract readonly lastUpdatedAt?: string;
  public abstract readonly grantPrincipal: iam.IPrincipal;

  /**
   * A reference to a Runtime resource.
   */
  public get runtimeRef(): RuntimeReference {
    return {
      agentRuntimeId: this.agentRuntimeId,
      agentRuntimeArn: this.agentRuntimeArn,
    };
  }

  /**
   * An accessor for the Connections object that will fail if this Runtime does not have a VPC
   * configured.
   */
  public get connections(): ec2.Connections {
    if (!this._connections) {
      throw new ValidationError('Cannot manage network access without configuring a VPC');
    }
    return this._connections;
  }

  /**
   * The actual Connections object for this Runtime. This may be unset in the event that a VPC has not
   * been configured.
   * @internal
   */
  protected _connections: ec2.Connections | undefined;

  constructor(scope: Construct, id: string, props: ResourceProps = {}) {
    super(scope, id, props);
  }

  /**
   * Grant the runtime specific actions on AWS resources
   *
   * [disable-awslint:no-grants]
   *
   * @param actions The actions to grant
   * @param resources The resource ARNs to grant access to
   * @returns The Grant object for chaining
   */
  public grant(actions: string[], resources: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: this.role,
      actions,
      resourceArns: resources,
    });
  }

  /**
   * Adds a policy statement to the runtime's execution role
   *
   * @param statement The IAM policy statement to add
   * @returns The runtime instance for chaining
   */
  public addToRolePolicy(statement: iam.PolicyStatement): IBedrockAgentRuntime {
    this.role.addToPrincipalPolicy(statement);
    return this;
  }

  /**
   * Permits an IAM principal to invoke this runtime
   * Grants the bedrock-agentcore:InvokeAgentRuntime permission
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal to grant access to
   */
  public grantInvokeRuntime(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: RUNTIME_INVOKE_PERMS,
      resourceArns: [this.runtimeRef.agentRuntimeArn, `${this.runtimeRef.agentRuntimeArn}/*`], // * is needed because it invoke the endpoint as subresource
    });
  }

  /**
   * Permits an IAM principal to invoke this runtime on behalf of a user
   * Grants the bedrock-agentcore:InvokeAgentRuntimeForUser permission
   * Required when using the X-Amzn-Bedrock-AgentCore-Runtime-User-Id header
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal to grant access to
   */
  public grantInvokeRuntimeForUser(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: RUNTIME_INVOKE_USER_PERMS,
      resourceArns: [this.runtimeRef.agentRuntimeArn, `${this.runtimeRef.agentRuntimeArn}/*`],
    });
  }

  /**
   * Permits an IAM principal to invoke this runtime both directly and on behalf of users
   * Grants both bedrock-agentcore:InvokeAgentRuntime and bedrock-agentcore:InvokeAgentRuntimeForUser permissions
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal to grant access to
   */
  public grantInvoke(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: [...RUNTIME_INVOKE_PERMS, ...RUNTIME_INVOKE_USER_PERMS],
      resourceArns: [this.runtimeRef.agentRuntimeArn, `${this.runtimeRef.agentRuntimeArn}/*`],
    });
  }

  // ------------------------------------------------------
  // Metrics
  // ------------------------------------------------------
  /**
   * Return the given named metric for this agent runtime.
   *
   * By default, the metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public metric(metricName: string, dimensions: DimensionsMap, props?: MetricOptions): Metric {
    const metricProps: MetricProps = {
      namespace: 'AWS/Bedrock-AgentCore',
      metricName,
      dimensionsMap: { ...dimensions, Resource: this.runtimeRef.agentRuntimeArn },
      ...props,
    };
    return this.configureMetric(metricProps);
  }

  /**
   * Return a metric containing the total number of invocations for this agent runtime.
   */
  public metricInvocations(props?: MetricOptions): Metric {
    return this.metric('Invocations', {}, { statistic: Stats.SUM, ...props });
  }

  /**
   * Return a metric containing the total number of invocations across all resources.
   */
  public metricInvocationsAggregated(props?: MetricOptions): Metric {
    return this.metric('Invocations', { Resource: 'All' }, { statistic: Stats.SUM, ...props });
  }

  /**
   * Return a metric containing the number of throttled requests for this agent runtime.
   */
  public metricThrottles(props?: MetricOptions): Metric {
    return this.metric('Throttles', {}, { statistic: Stats.SUM, ...props });
  }

  /**
   * Return a metric containing the number of system errors for this agent runtime.
   */
  public metricSystemErrors(props?: MetricOptions): Metric {
    return this.metric('SystemErrors', {}, { statistic: Stats.SUM, ...props });
  }

  /**
   * Return a metric containing the number of user errors for this agent runtime.
   */
  public metricUserErrors(props?: MetricOptions): Metric {
    return this.metric('UserErrors', {}, { statistic: Stats.SUM, ...props });
  }

  /**
   * Return a metric measuring the latency of requests for this agent runtime.
   *
   * The latency metric represents the total time elapsed between receiving the request
   * and sending the final response token, representing complete end-to-end processing time.
   */
  public metricLatency(props?: MetricOptions): Metric {
    return this.metric('Latency', {}, { statistic: Stats.AVERAGE, ...props });
  }

  /**
   * Return a metric containing the total number of errors (system + user) for this agent runtime.
   */
  public metricTotalErrors(props?: MetricOptions): Metric {
    return this.metric('TotalErrors', {}, { statistic: Stats.SUM, ...props });
  }

  /**
   * Return a metric containing the number of agent sessions for this agent runtime.
   */
  public metricSessionCount(props?: MetricOptions): Metric {
    return this.metric('SessionCount', {}, { statistic: Stats.SUM, ...props });
  }

  /**
   * Return a metric containing the total number of sessions across all resources.
   */
  public metricSessionsAggregated(props?: MetricOptions): Metric {
    return this.metric('Sessions', { Resource: 'All' }, { statistic: Stats.SUM, ...props });
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

/**
 * Attributes for importing an existing Agent Runtime
 */
export interface AgentRuntimeAttributes {
  /**
   * The ARN of the agent runtime
   */
  readonly agentRuntimeArn: string;

  /**
   * The ID of the agent runtime
   */
  readonly agentRuntimeId: string;

  /**
   * The name of the agent runtime
   */
  readonly agentRuntimeName: string;

  /**
   * The IAM role ARN
   */
  readonly roleArn: string;

  /**
   * The version of the agent runtime
   * When importing a runtime and this is not specified or undefined, endpoints created on this runtime
   * will point to version "1" unless explicitly overridden.
   * @default - undefined
   */
  readonly agentRuntimeVersion?: string;

  /**
   * The description of the agent runtime
   * @default - No description
   */
  readonly description?: string;

  /**
   * The security groups for this runtime, if in a VPC.
   * @default - By default, the runtime is not in a VPC.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The current status of the agent runtime
   * @default - Status not available
   */
  readonly agentStatus?: string;

  /**
   * The time at which the runtime was created
   * @default - Creation time not available
   */
  readonly createdAt?: string;

  /**
   * The time at which the runtime was last updated
   * @default - Last update time not available
   */
  readonly lastUpdatedAt?: string;
}
