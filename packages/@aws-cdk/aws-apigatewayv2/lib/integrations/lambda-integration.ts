import { ServicePrincipal } from '@aws-cdk/aws-iam';
import { IFunction } from '@aws-cdk/aws-lambda';
import { Construct, Stack } from '@aws-cdk/core';

import { Api, IApi } from '../api';
import { HttpApiIntegrationOptions, Integration, IntegrationOptions, IntegrationType, WebSocketApiIntegrationOptions } from '../integration';
import { IntegrationResponse, IntegrationResponseOptions, KnownIntegrationResponseKey } from '../integration-response';

/**
 * Defines the properties required for defining an Api Gateway V2 Lambda Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface BaseLambdaIntegrationOptions {
  /**
   * The Lambda function handler for this integration
   */
  readonly handler: IFunction;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Lambda Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface LambdaIntegrationOptions extends IntegrationOptions, BaseLambdaIntegrationOptions {
}

/**
 * Defines the properties required for defining an Api Gateway V2 Lambda Integration.
 */
export interface LambdaIntegrationProps extends LambdaIntegrationOptions {
  /**
   * Defines if this integration is a proxy integration or not.
   *
   * @default false
   */
  readonly proxy?: boolean;

  /**
   * Defines the api for this integration.
   */
  readonly api: IApi;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Http API Lambda Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface HttpApiLambdaIntegrationOptions extends HttpApiIntegrationOptions, BaseLambdaIntegrationOptions {
}

/**
 * Defines the properties required for defining an Api Gateway V2 WebSocket API Lambda Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface WebSocketApiLambdaIntegrationOptions extends WebSocketApiIntegrationOptions, BaseLambdaIntegrationOptions {
  /**
   * Defines if this integration is a proxy integration or not.
   *
   * @default false
   */
  readonly proxy?: boolean;
}

/**
 * An AWS Lambda integration for an API in Amazon API Gateway v2.
 */
export class LambdaIntegration extends Construct {
  /**
   * L1 Integration construct
   */
  public readonly resource: Integration;

  constructor(scope: Construct, id: string, props: LambdaIntegrationProps) {
    super(scope, id);

    const stack = Stack.of(scope);

    // This is not a standard ARN as it does not have the account-id part in it
    const uri = `arn:${stack.partition}:apigateway:${stack.region}:lambda:path/2015-03-31/functions/${props.handler.functionArn}/invocations`;
    this.resource = new Integration(this, 'Default', {
      ...props,
      type: props.proxy ? IntegrationType.AWS_PROXY : IntegrationType.AWS,
      integrationMethod: 'POST',
      uri,
    });

    if (props.api instanceof Api) {
      const sourceArn = props.api.executeApiArn();
      props.handler.addPermission(`ApiPermission.${this.node.uniqueId}`, {
        principal: new ServicePrincipal('apigateway.amazonaws.com'),
        sourceArn,
      });
    }
  }

  /**
   * Creates a new response for this integration.
   *
   * @param key the key (predefined or not) that will select this response
   * @param props the properties for this response
   */
  public addResponse(key: KnownIntegrationResponseKey | string, props?: IntegrationResponseOptions): IntegrationResponse {
    return this.resource.addResponse(key, props);
  }
}