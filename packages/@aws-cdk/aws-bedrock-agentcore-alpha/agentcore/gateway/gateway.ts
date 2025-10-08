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

import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { DimensionsMap, Metric, MetricOptions, MetricProps, Stats } from 'aws-cdk-lib/aws-cloudwatch';
// Internal imports
import { GatewayAuthorizer, IGatewayAuthorizer } from './authorizer';
import { GatewayPerms } from './perms';
import { IGatewayProtocol, McpProtocolConfiguration } from './protocol';
import { CfnGateway, CfnGatewayProps } from 'aws-cdk-lib/aws-bedrockagentcore';

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
export interface IGateway extends cdk.IResource {
  /**
   * The ARN of the gateway resource
   * @example "arn:aws:bedrock-agentcore:eu-central-1:249522321342:gateway/gateway_6647g-vko61CBXCd"
   */
  readonly gatewayArn: string;

  /**
   * The id of the gateway
   * @example "gateway_6647g-vko61CBXCd"
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
  readonly protocolConfiguration: IGatewayProtocol;

  /**
   * The authorizer configuration for the gateway
   */
  readonly inboundAuthorizer: IGatewayAuthorizer;

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
   */
  readonly gatewayUrl?: string;

  /**
   * The status of the gateway
   */
  readonly status?: string;

  /**
   * Timestamp when the gateway was created
   */
  readonly createdAt?: string;

  /**
   * Timestamp when the gateway was last updated
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

  // ------------------------------------------------------
  // Metrics
  // ------------------------------------------------------
  /**
   * Return the given named metric for this gateway.
   */
  metric(metricName: string, dimensions: DimensionsMap, props?: MetricOptions): Metric;

  /**
   * Return a metric containing the total number of invocations for this gateway.
   */
  metricInvocations(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of throttled requests (429 status code) for this gateway.
   */
  metricThrottles(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of system errors (5xx status code) for this gateway.
   */
  metricSystemErrors(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of user errors (4xx status code, excluding 429) for this gateway.
   */
  metricUserErrors(props?: MetricOptions): Metric;

  /**
   * Return a metric measuring the latency of requests for this gateway.
   */
  metricLatency(props?: MetricOptions): Metric;

  /**
   * Return a metric measuring the duration of requests for this gateway.
   */
  metricDuration(props?: MetricOptions): Metric;

  /**
   * Return a metric measuring the target execution time for this gateway.
   */
  metricTargetExecutionTime(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of requests served by each target type for this gateway.
   */
  metricTargetType(targetType: string, props?: MetricOptions): Metric;
}

/******************************************************************************
 *                                Base Class
 *****************************************************************************/

export abstract class GatewayBase extends cdk.Resource implements IGateway {
  public abstract readonly gatewayArn: string;
  public abstract readonly gatewayId: string;
  public abstract readonly name: string;
  public abstract readonly description?: string;
  public abstract readonly protocolConfiguration: IGatewayProtocol;
  public abstract readonly inboundAuthorizer: IGatewayAuthorizer;
  public abstract readonly exceptionLevel?: GatewayExceptionLevel;
  public abstract readonly kmsKey?: kms.IKey;
  public abstract readonly role: iam.IRole;
  public abstract readonly gatewayUrl?: string;
  public abstract readonly status?: string;
  public abstract readonly createdAt?: string;
  public abstract readonly updatedAt?: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);
  }

  // ------------------------------------------------------
  // Permission Methods
  // ------------------------------------------------------
  /**
   * Grants IAM actions to the IAM Principal
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: grantee,
      resourceArns: [this.gatewayArn],
      actions: actions,
    });
  }

  /**
   * Grants `Get` and `List` actions on the Gateway
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    const resourceSpecificGrant = this.grant(grantee, ...GatewayPerms.GET_PERMS);

    const allResourceGrant = iam.Grant.addToPrincipal({
      grantee: grantee,
      resourceArns: ['*'],
      actions: [...GatewayPerms.LIST_PERMS],
    });
    // Return combined grant
    return resourceSpecificGrant.combine(allResourceGrant);
  }

  /**
   * Grants `Create`, `Update`, and `Delete` actions on the Gateway
   */
  public grantManage(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...GatewayPerms.MANAGE_PERMS);
  }

  // ------------------------------------------------------
  // Target Methods
  // ------------------------------------------------------
  /**
   * TODO: Add a new target to this gateway
   */
  // public addTarget(id: string, props: GatewayTargetCommonProps): any {
  //   return new Gateway(this, id, { ...props, gateway: this });
  // }

  // ------------------------------------------------------
  // Metric Methods
  // ------------------------------------------------------
  /**
   * Return the given named metric for this gateway.
   *
   * By default, the metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public metric(metricName: string, dimensions: DimensionsMap, props?: MetricOptions): Metric {
    const metricProps: MetricProps = {
      namespace: 'AWS/Bedrock-AgentCore',
      metricName,
      dimensionsMap: { ...dimensions, Resource: this.gatewayArn },
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
 *                                Props
 *****************************************************************************/

/**
 * Properties for creating a Gateway resource
 */
export interface GatewayProps {
  /**
   * The name of the gateway
   * Valid characters are a-z, A-Z, 0-9, _ (underscore) and - (hyphen)
   * The name must be unique within your account
   * Required: Yes
   */
  readonly name: string;

  /**
   * Optional description for the gateway
   * Valid characters are a-z, A-Z, 0-9, _ (underscore), - (hyphen) and spaces
   * The description can have up to 200 characters
   * Required: No
   * @default - No description
   */
  readonly description?: string;

  /**
   * The protocol configuration for the gateway
   * Required: No
   * @default - A default protocol configuration will be created using MCP
   */
  readonly protocol?: IGatewayProtocol;

  /**
   * The authorizer configuration for the gateway
   * Required: No
   * @default - A default authorizer will be created using Cognito
   */
  readonly inboundAuthorizer?: IGatewayAuthorizer;

  /**
   * The verbosity of exception messages
   * Use DEBUG mode to see granular exception messages from a Gateway
   * Required: No
   * @default - Exception messages are sanitized for presentation to end users
   */
  readonly exceptionLevel?: GatewayExceptionLevel;

  /**
   * The AWS KMS key used to encrypt data associated with the gateway
   * Required: No
   * @default - No encryption
   */
  readonly kmsKey?: kms.IKey;

  /**
   * The IAM role that provides permissions for the gateway to access AWS services
   * Required: No
   * @default - A new role will be created
   */
  readonly existingRole?: iam.IRole;

  /**
   * Tags for the gateway
   * A list of key:value pairs of tags to apply to this Gateway resource
   * @default {} - no tags
   */
  readonly tags?: { [key: string]: string };
}

/******************************************************************************
 *                                Class
 *****************************************************************************/
/**
 * Gateway resource for AWS Bedrock Agent Core.
 * Serves as an integration point between your agent and external services.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/API_CreateGateway.html
 */
export class Gateway extends GatewayBase {
  public readonly gatewayArn: string;
  public readonly gatewayId: string;
  public readonly name: string;
  public readonly description?: string;
  public readonly protocolConfiguration: IGatewayProtocol;
  public readonly inboundAuthorizer: IGatewayAuthorizer;
  public readonly exceptionLevel?: GatewayExceptionLevel;
  public readonly kmsKey?: kms.IKey;
  public readonly role: iam.IRole;
  public readonly gatewayUrl: string;
  public readonly status: string;
  public readonly createdAt: string;
  public readonly updatedAt: string;
  public readonly tags?: { [key: string]: string };

  constructor(scope: Construct, id: string, props: GatewayProps) {
    super(scope, id);
    // ------------------------------------------------------
    // Assignments
    // ------------------------------------------------------

    this.name = props.name;
    this.description = props.description;
    this.protocolConfiguration = props.protocol ?? new McpProtocolConfiguration({});
    this.inboundAuthorizer = props.inboundAuthorizer ?? this.createCognitoDefaultAuthorizer();
    this.exceptionLevel = props.exceptionLevel;
    this.kmsKey = props.kmsKey;
    this.role = props.existingRole ?? this.createGatewayRole();
    this.tags = props.tags ?? {};

    // ------------------------------------------------------
    // Validations
    // ------------------------------------------------------
    // this.node.addValidation(this);

    // ------------------------------------------------------
    // Permissions
    // ------------------------------------------------------
    this.kmsKey?.grantEncryptDecrypt(this.role);
    // TODO: add permissions for retrieving all targets of this gateway

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    const resourceProps: CfnGatewayProps = {
      authorizerConfiguration: this.inboundAuthorizer._render(),
      authorizerType: this.inboundAuthorizer.authorizerType,
      description: this.description,
      exceptionLevel: this.exceptionLevel,
      kmsKeyArn: this.kmsKey?.keyArn,
      name: this.name,
      protocolConfiguration: this.protocolConfiguration._render(),
      protocolType: this.protocolConfiguration.protocolType,
      roleArn: this.role?.roleArn,
      tags: this.tags,
    };

    const _resource = new CfnGateway(this, 'Resource', resourceProps);

    // ------------------------------------------------------
    // Post-creation dependent assignements
    // ------------------------------------------------------
    this.gatewayId = _resource.attrGatewayIdentifier;
    this.gatewayArn = _resource.attrGatewayArn;
    this.gatewayUrl = _resource.attrGatewayUrl;
    this.status = _resource.attrStatus;
    this.createdAt = _resource.attrCreatedAt;
    this.updatedAt = _resource.attrUpdatedAt;
  }

  /**
   * Creates execution role needed for the gateway to access AWS services
   * TODO: fine grain permissions based on the gateway configuration
   */
  createGatewayRole(): iam.IRole {
    const role = new iam.Role(this, 'AmazonBedrockAgentCoreGatewayDefaultServiceRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
      inlinePolicies: {
        GatewayAccessPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['iam:PassRole', 'bedrock-agentcore:*'],
              resources: ['*'],
            }),
          ],
        }),
      },
    });

    return role;
  }

  // /**
  //  * Validates the gateway name format
  //  * @param name The gateway name to validate
  //  * @throws Error if the name is invalid
  //  */
  // private validateGatewayName(name: string): void {
  //   validateStringField(name, {
  //     minLength: 1,
  //     maxLength: 50,
  //     pattern: /^[a-zA-Z0-9-]+$/,
  //     fieldName: 'Gateway name',
  //     extraErrorInfo: `contain letters (a-z, A-Z), numbers (0-9), and hyphens (-). Invalid name: "${name}"`,
  //   });
  // }

  // validate(props: CfnGatewayProps): string[] {
  //   // strat with empty array
  //   const errors: string[] = [];

  //   return errors;
  // }

  // // TODO: provision a cognito user pool and client and provide correct info
  createCognitoDefaultAuthorizer(): IGatewayAuthorizer {
    const userPool = new cognito.UserPool(this, 'myuserpool', {
      userPoolName: this.name + '-gw-userpool',
      signInCaseSensitive: false, // case insensitive is preferred in most situations
    });
    return GatewayAuthorizer.customJwt({
      discoveryUrl: userPool.userPoolProviderUrl,
    });
  }
}
