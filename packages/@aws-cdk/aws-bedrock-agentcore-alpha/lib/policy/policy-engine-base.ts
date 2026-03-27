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
import type * as kms from 'aws-cdk-lib/aws-kms';
import type { Construct } from 'constructs';
// Internal imports
import type { IGateway } from '../gateway/gateway-base';
import { PolicyEnginePerms } from './perms';

/******************************************************************************
 *                                Interface
 *****************************************************************************/

/**
 * Used for resource identification and ARN construction.
 */
export interface IPolicyEngineRef {
  /**
   * The ARN of the policy engine resource
   * @attribute
   */
  readonly policyEngineArn: string;

  /**
   * The ID of the policy engine
   * @attribute
   */
  readonly policyEngineId: string;
}

/**
 * Contains all properties and methods for both created and imported policy engines.
 */
export interface IPolicyEngine extends IResource, IPolicyEngineRef, iam.IGrantable {
  /**
   * The name of the policy engine
   * @attribute
   */
  readonly policyEngineName: string;

  /**
   * The description of the policy engine
   */
  readonly description?: string;

  /**
   * The KMS key used for encryption
   */
  readonly kmsKey?: kms.IKey;

  /**
   * Grants IAM actions to the IAM Principal
   *
   * @param grantee - The IAM principal to grant permissions to
   * @param actions - The actions to grant
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grants read permissions on the PolicyEngine.
   *
   * This grants runtime read access to policy engine configuration. Use this for
   * monitoring, observability, or read-only administrative roles.
   *
   * @param grantee - The IAM principal to grant read permissions to
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grants permissions to evaluate policies at runtime .
   *
   * This is the primary permission needed by Gateway execution roles to evaluate
   * authorization decisions during agent requests. Grant this to roles that need
   * to call AuthorizeAction or PartiallyAuthorizeActions.
   *
   * @param grantee - The IAM principal to grant evaluation permissions to
   */
  grantEvaluate(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grants the full set of permissions required for a gateway execution role to use
   * this policy engine, correctly scoped to both the policy engine and gateway ARNs.
   *
   * Per the AWS docs, `AuthorizeAction` and `PartiallyAuthorizeActions` require
   * both the policy engine ARN and the gateway ARN as resources, while
   * `GetPolicyEngine` only needs the policy engine ARN.
   *
   * This follows the same pattern as Lambda's `grantInvokeVersion(grantee, version)`.
   *
   * @param grantee - The IAM principal (gateway execution role) to grant permissions to
   * @param gateway - The gateway that will use this policy engine
   */
  grantEvaluateForGateway(grantee: iam.IGrantable, gateway: IGateway): iam.Grant;

  /**
   * Return the given named metric for this policy engine.
   *
   * @param metricName The name of the metric
   * @param dimensions Additional dimensions for the metric
   * @param props Optional metric configuration
   */
  metric(metricName: string, dimensions: DimensionsMap, props?: MetricOptions): Metric;

  /**
   * Return a metric measuring the authorization latency for this policy engine.
   *
   * This metric represents the time taken to evaluate authorization policies.
   *
   * @param props Optional metric configuration
   */
  metricAuthorizationLatency(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of denied authorization requests for this policy engine.
   *
   * This metric tracks authorization requests that were explicitly denied by policies.
   *
   * @param props Optional metric configuration
   */
  metricDeniedRequests(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of errors during authorization for this policy engine.
   *
   * This metric tracks errors encountered during policy evaluation.
   *
   * @param props Optional metric configuration
   */
  metricErrors(props?: MetricOptions): Metric;
}

/**
 * Attributes for importing an existing PolicyEngine
 */
export interface PolicyEngineAttributes {
  /**
   * The ARN of the policy engine
   */
  readonly policyEngineArn: string;

  /**
   * The KMS key ARN used for encryption (optional)
   *
   * @default - No KMS key
   */
  readonly kmsKeyArn?: string;
}

/******************************************************************************
 *                        ABSTRACT BASE CLASS
 *****************************************************************************/

/**
 * Abstract base class for a PolicyEngine.
 * Contains methods and attributes valid for PolicyEngines either created with CDK or imported.
 */
export abstract class PolicyEngineBase extends Resource implements IPolicyEngine {
  public abstract readonly policyEngineArn: string;
  public abstract readonly policyEngineId: string;
  public abstract readonly policyEngineName: string;
  public abstract readonly description?: string;
  public abstract readonly kmsKey?: kms.IKey;

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
      resourceArns: [this.policyEngineArn],
      scope: this,
    });
  }

  /**
   * Grants read permissions on the PolicyEngine (data plane).
   *
   * This grants runtime read access to policy engine configuration. Use this for
   * monitoring, observability, or read-only administrative roles that need to inspect
   * policy engine settings at runtime.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant read permissions to
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...PolicyEnginePerms.READ_PERMS);
  }

  /**
   * Grants permissions to evaluate policies at runtime (data plane operations).
   *
   * This is the primary permission needed by Gateway execution roles to evaluate
   * authorization decisions during agent requests. Grant this to roles that need
   * to call AuthorizeAction or PartiallyAuthorizeActions at runtime.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant evaluation permissions to
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantEvaluate(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...PolicyEnginePerms.EVALUATE_PERMS);
  }

  /**
   * Grants the full set of permissions required for a gateway execution role to use
   * this policy engine, correctly scoped to both the policy engine and gateway ARNs.
   *
   * Per the AWS docs:
   * - `GetPolicyEngine` → policy engine ARN only
   * - `AuthorizeAction` + `PartiallyAuthorizeActions` → policy engine ARN **and** gateway ARN
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal (gateway execution role) to grant permissions to
   * @param gateway - The gateway that will use this policy engine
   * @returns A combined IAM Grant representing all granted permissions
   */
  public grantEvaluateForGateway(grantee: iam.IGrantable, gateway: IGateway): iam.Grant {
    // GetPolicyEngine only needs the policy engine ARN
    const getPolicyEngineGrant = this.grant(grantee, 'bedrock-agentcore:GetPolicyEngine');

    // AuthorizeAction + PartiallyAuthorizeActions require BOTH the policy engine ARN and gateway ARN
    const authorizationGrant = iam.Grant.addToPrincipal({
      grantee,
      actions: [
        'bedrock-agentcore:AuthorizeAction',
        'bedrock-agentcore:PartiallyAuthorizeActions',
      ],
      resourceArns: [this.policyEngineArn, gateway.gatewayArn],
      scope: this,
    });

    return getPolicyEngineGrant.combine(authorizationGrant);
  }

  /**
   * Return the given named metric for this policy engine.
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
      dimensionsMap: { ...dimensions, Resource: this.policyEngineArn },
      ...props,
    };
    return this.configureMetric(metricProps);
  }

  /**
   * Return a metric containing the total number of authorizations for this policy engine.
   *
   * This metric tracks all authorization requests processed by the policy engine.
   *
   * @param props Optional metric configuration
   */
  public metricAuthorizations(props?: MetricOptions): Metric {
    return this.metric('Authorizations', {}, { statistic: Stats.SUM, ...props });
  }

  /**
   * Return a metric measuring the authorization latency for this policy engine.
   *
   * This metric represents the time taken to evaluate authorization policies.
   *
   * @param props Optional metric configuration
   */
  public metricAuthorizationLatency(props?: MetricOptions): Metric {
    return this.metric('AuthorizationLatency', {}, { statistic: Stats.AVERAGE, ...props });
  }

  /**
   * Return a metric containing the number of denied authorization requests for this policy engine.
   *
   * This metric tracks authorization requests that were explicitly denied by policies.
   *
   * @param props Optional metric configuration
   */
  public metricDeniedRequests(props?: MetricOptions): Metric {
    return this.metric('DeniedRequests', {}, { statistic: Stats.SUM, ...props });
  }

  /**
   * Return a metric containing the number of errors during authorization for this policy engine.
   *
   * This metric tracks errors encountered during policy evaluation.
   *
   * @param props Optional metric configuration
   */
  public metricErrors(props?: MetricOptions): Metric {
    return this.metric('Errors', {}, { statistic: Stats.SUM, ...props });
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
