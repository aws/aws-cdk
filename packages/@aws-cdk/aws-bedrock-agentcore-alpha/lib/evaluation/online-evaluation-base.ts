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

import type { IResource } from 'aws-cdk-lib';
import { Resource } from 'aws-cdk-lib';
import type { MetricOptions, MetricProps } from 'aws-cdk-lib/aws-cloudwatch';
import { Metric, Stats } from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import type { Construct } from 'constructs';
import { EvaluationPerms } from './perms';

/**
 * Interface for OnlineEvaluation resources.
 */
export interface IOnlineEvaluation extends IResource, iam.IGrantable {
  /**
   * The ARN of the online evaluation configuration.
   * @attribute
   */
  readonly configArn: string;

  /**
   * The unique identifier of the online evaluation configuration.
   * @attribute
   */
  readonly configId: string;

  /**
   * The name of the online evaluation configuration.
   * @attribute
   */
  readonly configName: string;

  /**
   * The IAM execution role for the evaluation.
   */
  readonly executionRole?: iam.IRole;

  /**
   * The lifecycle status of the configuration (CREATING, ACTIVE, FAILED, DELETING).
   * @attribute
   */
  readonly status?: string;

  /**
   * The execution status of the evaluation (ENABLED, DISABLED).
   * @attribute
   */
  readonly executionStatus?: string;

  /**
   * Grant the given principal identity permissions to perform actions on this configuration.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant the given principal identity permissions to manage this configuration.
   */
  grantAdmin(grantee: iam.IGrantable): iam.Grant;

  /**
   * Return the given named metric for this evaluation configuration.
   */
  metric(metricName: string, props?: MetricOptions): Metric;

  /**
   * Return a metric for the total number of evaluations performed.
   */
  metricEvaluationCount(props?: MetricOptions): Metric;

  /**
   * Return a metric for evaluation errors.
   */
  metricEvaluationErrors(props?: MetricOptions): Metric;

  /**
   * Return a metric for evaluation latency.
   */
  metricEvaluationLatency(props?: MetricOptions): Metric;
}

/**
 * Abstract base class for OnlineEvaluation.
 * Contains methods and attributes valid for configurations either created with CDK or imported.
 */
export abstract class OnlineEvaluationBase extends Resource implements IOnlineEvaluation {
  public abstract readonly configArn: string;
  public abstract readonly configId: string;
  public abstract readonly configName: string;
  public abstract readonly executionRole?: iam.IRole;
  public abstract readonly status?: string;
  public abstract readonly executionStatus?: string;

  /**
   * The principal to grant permissions to.
   */
  public abstract readonly grantPrincipal: iam.IPrincipal;

  constructor(scope: Construct, id: string) {
    super(scope, id);
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
      resourceArns: [this.configArn],
      scope: this,
    });
  }

  /**
   * Grant the given principal identity permissions to manage this configuration.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The IAM principal to grant admin permissions to
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantAdmin(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...EvaluationPerms.ADMIN_PERMS);
  }

  /**
   * Return the given named metric for this evaluation configuration.
   *
   * By default, the metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public metric(metricName: string, props?: MetricOptions): Metric {
    const metricProps: MetricProps = {
      namespace: 'AWS/Bedrock-AgentCore',
      metricName,
      dimensionsMap: { OnlineEvaluationId: this.configId },
      ...props,
    };
    return this.configureMetric(metricProps);
  }

  /**
   * Return a metric for the total number of evaluations performed.
   */
  public metricEvaluationCount(props?: MetricOptions): Metric {
    return this.metric('EvaluationCount', { statistic: Stats.SUM, ...props });
  }

  /**
   * Return a metric for evaluation errors.
   */
  public metricEvaluationErrors(props?: MetricOptions): Metric {
    return this.metric('EvaluationErrors', { statistic: Stats.SUM, ...props });
  }

  /**
   * Return a metric for evaluation latency.
   */
  public metricEvaluationLatency(props?: MetricOptions): Metric {
    return this.metric('EvaluationLatency', { statistic: Stats.AVERAGE, ...props });
  }

  /**
   * Internal method to create a metric.
   */
  private configureMetric(props: MetricProps): Metric {
    return new Metric({
      ...props,
      region: props?.region ?? this.stack.region,
      account: props?.account ?? this.stack.account,
    });
  }
}
