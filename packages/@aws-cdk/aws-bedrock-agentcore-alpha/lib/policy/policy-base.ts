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
import type { DimensionsMap, MetricOptions, MetricProps } from 'aws-cdk-lib/aws-cloudwatch';
import { Metric, Stats } from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import type { Construct } from 'constructs';
// Internal imports
import { PolicyPerms } from './perms';
import type { PolicyValidationMode } from './policy-engine';
import type { IPolicyEngine } from './policy-engine-base';

/******************************************************************************
 *                                Interface
 *****************************************************************************/

/**
 * Minimal reference interface for Policy resources.
 * Used for resource identification and ARN construction.
 */
export interface IPolicyRef {
  /**
   * The ARN of the policy resource
   * @attribute
   */
  readonly policyArn: string;

  /**
   * The ID of the policy
   * @attribute
   */
  readonly policyId: string;
}

/**
 * Full interface for Policy resources.
 * Contains all properties and methods for both created and imported policies.
 */
export interface IPolicy extends IResource, IPolicyRef, iam.IGrantable {
  /**
   * The name of the policy
   * @attribute
   */
  readonly policyName: string;

  /**
   * The policy engine this policy belongs to
   * @attribute
   */
  readonly policyEngine: IPolicyEngine;

  /**
   * The description of the policy
   */
  readonly description?: string;

  /**
   * The validation mode for the policy
   */
  readonly validationMode?: PolicyValidationMode;

  /**
   * Grants IAM actions to the IAM Principal
   *
   * @param grantee - The IAM principal to grant permissions to
   * @param actions - The actions to grant
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grants read permissions on the Policy (data plane).
   *
   * This grants runtime read access to policy configuration. Use this for monitoring,
   * audit, or read-only administrative roles that need to inspect policy definitions.
   *
   * @param grantee - The IAM principal to grant read permissions to
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;

  // ------------------------------------------------------
  // Metrics
  // ------------------------------------------------------

  /**
   * Return the given named metric for this policy.
   *
   * @param metricName The name of the metric
   * @param dimensions Additional dimensions for the metric
   * @param props Optional metric configuration
   */
  metric(metricName: string, dimensions: DimensionsMap, props?: MetricOptions): Metric;

  /**
   * Return a metric containing the total number of evaluations for this policy.
   *
   * This metric tracks how many times this policy has been evaluated.
   *
   * @param props Optional metric configuration
   */
  metricEvaluations(props?: MetricOptions): Metric;

  /**
   * Return a metric measuring the evaluation latency for this policy.
   *
   * This metric represents the time taken to evaluate this specific policy.
   *
   * @param props Optional metric configuration
   */
  metricEvaluationLatency(props?: MetricOptions): Metric;
}

/**
 * Attributes for importing an existing Policy
 */
export interface PolicyAttributes {
  /**
   * The ARN of the policy
   */
  readonly policyArn: string;

  /**
   * The policy engine ID this policy belongs to
   */
  readonly policyEngineId: string;
}

/******************************************************************************
 *                        ABSTRACT BASE CLASS
 *****************************************************************************/

/**
 * Abstract base class for a Policy.
 * Contains methods and attributes valid for Policies either created with CDK or imported.
 */
export abstract class PolicyBase extends Resource implements IPolicy {
  public abstract readonly policyArn: string;
  public abstract readonly policyId: string;
  public abstract readonly policyName: string;
  public abstract readonly policyEngine: IPolicyEngine;
  public abstract readonly description?: string;
  public abstract readonly validationMode?: PolicyValidationMode;

  /**
   * The principal to grant permissions to
   */
  public abstract readonly grantPrincipal: iam.IPrincipal;

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
      resourceArns: [this.policyArn],
      scope: this,
    });
  }

  /**
   * Grants read permissions on the Policy (data plane).
   *
   * This grants runtime read access to policy configuration. Use this for monitoring,
   * audit, or read-only administrative roles that need to inspect policy definitions
   * and Cedar statements at runtime.
   *
   * IMPORTANT: This does NOT grant permissions to create/update/delete the Policy
   * resource itself. Those are control plane operations performed by CloudFormation
   * during `cdk deploy`, not by your application at runtime.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant read permissions to
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...PolicyPerms.READ_PERMS);
  }

  // ------------------------------------------------------
  // Metrics
  // ------------------------------------------------------

  /**
   * Return the given named metric for this policy.
   *
   * By default, the metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   *
   * @param metricName The name of the metric
   * @param dimensions Additional dimensions for the metric
   * @param props Optional metric configuration
   */
  public metric(metricName: string, dimensions: DimensionsMap, props?: MetricOptions): Metric {
    const metricProps: MetricProps = {
      namespace: 'AWS/Bedrock-AgentCore',
      metricName,
      dimensionsMap: { ...dimensions, Resource: this.policyArn },
      ...props,
    };
    return this.configureMetric(metricProps);
  }

  /**
   * Return a metric containing the total number of evaluations for this policy.
   *
   * This metric tracks how many times this policy has been evaluated.
   *
   * @param props Optional metric configuration
   */
  public metricEvaluations(props?: MetricOptions): Metric {
    return this.metric('PolicyEvaluations', {}, { statistic: Stats.SUM, ...props });
  }

  /**
   * Return a metric measuring the evaluation latency for this policy.
   *
   * This metric represents the time taken to evaluate this specific policy.
   *
   * @param props Optional metric configuration
   */
  public metricEvaluationLatency(props?: MetricOptions): Metric {
    return this.metric('PolicyEvaluationLatency', {}, { statistic: Stats.AVERAGE, ...props });
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
