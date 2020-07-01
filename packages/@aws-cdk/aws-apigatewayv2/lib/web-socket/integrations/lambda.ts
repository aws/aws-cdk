import { ServicePrincipal } from '@aws-cdk/aws-iam';
import { IFunction } from '@aws-cdk/aws-lambda';
import { Construct, Stack } from '@aws-cdk/core';

import { IRoute } from '../../common/route';

import { IWebSocketApi, WebSocketApi } from '../api';
import { WebSocketIntegration, WebSocketIntegrationOptions, WebSocketIntegrationType } from '../integration';
import { WebSocketRoute } from '../route';

/**
 * Defines the properties required for defining an Api Gateway V2 Lambda Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface WebSocketLambdaIntegrationOptions extends WebSocketIntegrationOptions {
  /**
   * Defines if this integration is a proxy integration or not.
   *
   * @default false
   */
  readonly proxy?: boolean;

  /**
   * The Lambda function handler for this integration
   */
  readonly handler: IFunction;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Lambda Integration.
 */
export interface WebSocketLambdaIntegrationProps extends WebSocketLambdaIntegrationOptions {
  /**
   * Defines the api for this integration.
   */
  readonly api: IWebSocketApi;
}

/**
 * An AWS Lambda integration for an API in Amazon API Gateway v2.
 */
export class WebSocketLambdaIntegration extends WebSocketIntegration {
  protected handler: IFunction;

  constructor(scope: Construct, id: string, props: WebSocketLambdaIntegrationProps) {
    const stack = Stack.of(scope);

    // This is not a standard ARN as it does not have the account-id part in it
    const uri = `arn:${stack.partition}:apigateway:${stack.region}:lambda:path/2015-03-31/functions/${props.handler.functionArn}/invocations`;
    super(scope, id, {
      api: props.api,
      connectionType: props.connectionType,
      contentHandlingStrategy: props.contentHandlingStrategy,
      credentialsArn: props.credentialsArn,
      description: props.description,
      passthroughBehavior: props.passthroughBehavior,
      payloadFormatVersion: props.payloadFormatVersion,
      requestParameters: props.requestParameters,
      requestTemplates: props.requestTemplates,
      templateSelectionExpression: props.templateSelectionExpression,
      timeout: props.timeout,
      tlsConfig: props.tlsConfig,
      type: props.proxy ? WebSocketIntegrationType.AWS_PROXY : WebSocketIntegrationType.AWS,
      uri,
    });

    this.handler = props.handler;
  }

  /**
   * Bind this integration to the route.
   */
  public bind(route: IRoute) {
    if ((this.api instanceof WebSocketApi) && (route instanceof WebSocketRoute)) {
      const sourceArn = this.api.executeApiArn(route.key);
      this.handler.addPermission(`ApiPermission.${this.node.uniqueId}`, {
        principal: new ServicePrincipal('apigateway.amazonaws.com'),
        sourceArn,
      });
    }
  }
}