import { Construct } from '@aws-cdk/core';

import { IWebSocketApi } from '../api';
import { WebSocketIntegration, WebSocketIntegrationOptions, WebSocketIntegrationType } from '../integration';

/**
 * Defines the properties required for defining an Api Gateway V2 Lambda Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface WebSocketServiceIntegrationOptions extends WebSocketIntegrationOptions {
  /**
   * Defines if this integration is a proxy integration or not.
   *
   * @default false
   */
  readonly proxy?: boolean;

  /**
   * The ARN of the target service for this integration
   */
  readonly arn: string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Lambda Integration.
 */
export interface WebSocketServiceIntegrationProps extends WebSocketServiceIntegrationOptions {
  /**
   * Defines the api for this integration.
   */
  readonly api: IWebSocketApi;
}

/**
 * An AWS Lambda integration for an API in Amazon API Gateway v2.
 */
export class WebSocketServiceIntegration extends WebSocketIntegration {
  constructor(scope: Construct, id: string, props: WebSocketServiceIntegrationProps) {
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
      uri: props.arn,
    });
  }
}