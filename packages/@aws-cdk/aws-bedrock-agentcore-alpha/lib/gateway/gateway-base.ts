import type { IResource, ResourceProps } from 'aws-cdk-lib';
import { Resource } from 'aws-cdk-lib';
import type { GatewayReference, IGatewayRef } from 'aws-cdk-lib/aws-bedrockagentcore';
import type { DimensionsMap, MetricOptions, MetricProps } from 'aws-cdk-lib/aws-cloudwatch';
import { Metric, Stats } from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import type * as kms from 'aws-cdk-lib/aws-kms';
import type { Construct } from 'constructs';
// Internal imports
import type { IGatewayAuthorizerConfig } from './inbound-auth/authorizer';
import { GATEWAY_GET_PERMS, GATEWAY_LIST_PERMS, GATEWAY_MANAGE_PERMS, GATEWAY_INVOKE_PERMS } from './perms';
import type { IGatewayProtocolConfig } from './protocol';

/******************************************************************************
 *                                 Enums
 *****************************************************************************/
/**
 * Exception levels for gateway
 */
export enum GatewayExceptionLevel {
  /**
   * Debug mode for granular exception messages. Allows the return of
   * specific error messages related to the gateway target configuration
   * to help you with debugging.
   */
  DEBUG = 'DEBUG',
}

/******************************************************************************
 *                                Interface
 *****************************************************************************/
/**
 * Interface for Gateway resources
 */
export interface IGateway extends IResource, IGatewayRef {
  /**
   * The ARN of the gateway resource
   * @attribute
   */
  readonly gatewayArn: string;

  /**
   * The id of the gateway
   * @attribute
   */
  readonly gatewayId: string;

  /**
   * The name of the gateway
   */
  readonly name: string;

  /**
   * The IAM role that provides permissions for the gateway to access AWS services
   */
  readonly role: iam.IRole;

  /**
   * The description of the gateway
   */
  readonly description?: string;

  /**
   * The protocol configuration for the gateway
   */
  readonly protocolConfiguration: IGatewayProtocolConfig;

  /**
   * The authorizer configuration for the gateway
   */
  readonly authorizerConfiguration: IGatewayAuthorizerConfig;

  /**
   * The exception level for the gateway
   */
  readonly exceptionLevel?: GatewayExceptionLevel;

  /**
   * The KMS key used for encryption
   */
  readonly kmsKey?: kms.IKey;

  /**
   * The URL endpoint for the gateway
   * @attribute
   */
  readonly gatewayUrl?: string;

  /**
   * The status of the gateway
   * @attribute
   */
  readonly status?: string;

  /**
   * The status reasons for the gateway.
   * @attribute
   */
  readonly statusReason?: string[];

  /**
   * Timestamp when the gateway was created
   * @attribute
   */
  readonly createdAt?: string;

  /**
   * Timestamp when the gateway was last updated
   * @attribute
   */
  readonly updatedAt?: string;

  /**
   * Grants IAM actions to the IAM Principal
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grants `Get` and `List` actions on the Gateway
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grants `Create`, `Update`, and `Delete` actions on the Gateway
   */
  grantManage(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grants permission to invoke this Gateway
   */
  grantInvoke(grantee: iam.IGrantable): iam.Grant;

  // ------------------------------------------------------
  // Metrics
  // ------------------------------------------------------
  /**
   * Return the given named metric for this gateway.
   *
   * @param metricName The name of the metric
   * @param dimensions Additional dimensions for the metric
   * @param props Optional metric configuration
   */
  metric(metricName: string, dimensions: DimensionsMap, props?: MetricOptions): Metric;

  /**
   * Return a metric containing the total number of invocations for this gateway.
   *
   * This metric tracks all successful invocations of the gateway.
   *
   * @param props Optional metric configuration
   * @default - Sum statistic over 5 minutes
   */
  metricInvocations(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of throttled requests (429 status code) for this gateway.
   *
   * This metric helps identify when the gateway is rate limiting requests.
   *
   * @param props Optional metric configuration
   * @default - Sum statistic over 5 minutes
   */
  metricThrottles(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of system errors (5xx status code) for this gateway.
   *
   * This metric tracks internal server errors and system failures.
   *
   * @param props Optional metric configuration
   * @default - Sum statistic over 5 minutes
   */
  metricSystemErrors(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of user errors (4xx status code, excluding 429) for this gateway.
   *
   * This metric tracks client errors like bad requests, unauthorized access, etc.
   *
   * @param props Optional metric configuration
   * @default - Sum statistic over 5 minutes
   */
  metricUserErrors(props?: MetricOptions): Metric;

  /**
   * Return a metric measuring the latency of requests for this gateway.
   *
   * The latency metric represents the time elapsed between when the service receives
   * the request and when it begins sending the first response token.
   *
   * @param props Optional metric configuration
   * @default - Average statistic over 5 minutes
   */
  metricLatency(props?: MetricOptions): Metric;

  /**
   * Return a metric measuring the duration of requests for this gateway.
   *
   * The duration metric represents the total time elapsed between receiving the request
   * and sending the final response token, representing complete end-to-end processing time.
   *
   * @param props Optional metric configuration
   * @default - Average statistic over 5 minutes
   */
  metricDuration(props?: MetricOptions): Metric;

  /**
   * Return a metric measuring the target execution time for this gateway.
   *
   * This metric helps determine the contribution of the target (Lambda, OpenAPI, etc.)
   * to the total latency.
   *
   * @param props Optional metric configuration
   * @default - Average statistic over 5 minutes
   */
  metricTargetExecutionTime(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of requests served by each target type for this gateway.
   *
   * @param targetType The type of target (e.g., 'Lambda', 'OpenAPI', 'Smithy')
   * @param props Optional metric configuration
   * @default - Sum statistic over 5 minutes
   */
  metricTargetType(targetType: string, props?: MetricOptions): Metric;
}

/******************************************************************************
 *                                Base Class
 *****************************************************************************/

export abstract class GatewayBase extends Resource implements IGateway {
  public abstract readonly gatewayArn: string;
  public abstract readonly gatewayId: string;
  public abstract readonly name: string;
  public abstract readonly description?: string;
  public abstract readonly protocolConfiguration: IGatewayProtocolConfig;
  public abstract readonly authorizerConfiguration: IGatewayAuthorizerConfig;
  public abstract readonly exceptionLevel?: GatewayExceptionLevel;
  public abstract readonly kmsKey?: kms.IKey;
  public abstract readonly role: iam.IRole;
  public abstract readonly gatewayUrl?: string;
  public abstract readonly status?: string;
  public abstract readonly statusReason?: string[];
  public abstract readonly createdAt?: string;
  public abstract readonly updatedAt?: string;

  /**
   * A reference to a Gateway resource.
   */
  public get gatewayRef(): GatewayReference {
    return {
      gatewayIdentifier: this.gatewayId,
      gatewayArn: this.gatewayArn,
    };
  }

  constructor(scope: Construct, id: string, props: ResourceProps = {}) {
    super(scope, id, props);
  }

  // ------------------------------------------------------
  // Permission Methods
  // ------------------------------------------------------
  /**
   * Grants IAM actions to the IAM Principal
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal to grant permissions to
   * @param actions The actions to grant
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: grantee,
      resourceArns: [this.gatewayRef.gatewayArn],
      actions: actions,
    });
  }

  /**
   * Grants `Get` and `List` actions on the Gateway
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal to grant read permissions to
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    const resourceSpecificGrant = this.grant(grantee, ...GATEWAY_GET_PERMS);

    const allResourceGrant = iam.Grant.addToPrincipal({
      grantee: grantee,
      resourceArns: ['*'],
      actions: [...GATEWAY_LIST_PERMS],
    });
    // Return combined grant
    return resourceSpecificGrant.combine(allResourceGrant);
  }

  /**
   * Grants `Create`, `Update`, and `Delete` actions on the Gateway
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal to grant manage permissions to
   */
  public grantManage(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...GATEWAY_MANAGE_PERMS);
  }

  /**
   * Grants permission to invoke this Gateway
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal to grant invoke permissions to
   */
  public grantInvoke(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...GATEWAY_INVOKE_PERMS);
  }

  // ------------------------------------------------------
  // Metric Methods
  // ------------------------------------------------------
  /**
   * Return the given named metric for this gateway.
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
      dimensionsMap: { ...dimensions, Resource: this.gatewayRef.gatewayArn },
      ...props,
    };
    return this.configureMetric(metricProps);
  }

  /**
   * Return a metric containing the total number of invocations for this gateway.
   */
  public metricInvocations(props?: MetricOptions): Metric {
    return this.metric('Invocations', {}, { statistic: Stats.SUM, ...props });
  }

  /**
   * Return a metric containing the number of throttled requests (429 status code) for this gateway.
   */
  public metricThrottles(props?: MetricOptions): Metric {
    return this.metric('Throttles', {}, { statistic: Stats.SUM, ...props });
  }

  /**
   * Return a metric containing the number of system errors (5xx status code) for this gateway.
   */
  public metricSystemErrors(props?: MetricOptions): Metric {
    return this.metric('SystemErrors', {}, { statistic: Stats.SUM, ...props });
  }

  /**
   * Return a metric containing the number of user errors (4xx status code, excluding 429) for this gateway.
   */
  public metricUserErrors(props?: MetricOptions): Metric {
    return this.metric('UserErrors', {}, { statistic: Stats.SUM, ...props });
  }

  /**
   * Return a metric measuring the latency of requests for this gateway.
   *
   * The latency metric represents the time elapsed between when the service receives
   * the request and when it begins sending the first response token.
   */
  public metricLatency(props?: MetricOptions): Metric {
    return this.metric('Latency', {}, { statistic: Stats.AVERAGE, ...props });
  }

  /**
   * Return a metric measuring the duration of requests for this gateway.
   *
   * The duration metric represents the total time elapsed between receiving the request
   * and sending the final response token, representing complete end-to-end processing time.
   */
  public metricDuration(props?: MetricOptions): Metric {
    return this.metric('Duration', {}, { statistic: Stats.AVERAGE, ...props });
  }

  /**
   * Return a metric measuring the target execution time for this gateway.
   *
   * This metric helps determine the contribution of the target (Lambda, OpenAPI, etc.)
   * to the total latency.
   */
  public metricTargetExecutionTime(props?: MetricOptions): Metric {
    return this.metric('TargetExecutionTime', {}, { statistic: Stats.AVERAGE, ...props });
  }

  /**
   * Return a metric containing the number of requests served by each target type for this gateway.
   */
  public metricTargetType(targetType: string, props?: MetricOptions): Metric {
    return this.metric('TargetType', { TargetType: targetType }, { statistic: Stats.SUM, ...props });
  }

  /**
   * Internal method to create a metric.
   * @internal
   */
  private configureMetric(props: MetricProps) {
    return new Metric({
      ...props,
      region: props?.region ?? this.stack.region,
      account: props?.account ?? this.stack.account,
    });
  }
}
