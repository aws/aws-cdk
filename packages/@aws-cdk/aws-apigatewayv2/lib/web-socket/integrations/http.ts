import { Construct } from '@aws-cdk/core';

import { IWebSocketApi } from '../api';
import { WebSocketIntegration, WebSocketIntegrationOptions, WebSocketIntegrationType } from '../integration';

/**
 * Defines the properties required for defining an Api Gateway V2 HTTP Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface WebSocketHttpIntegrationOptions extends WebSocketIntegrationOptions {
  /**
   * The HTTP URL for this integration
   */
  readonly url: string;

  /**
   * Defines if this integration is a proxy integration or not.
   *
   * @default false
   */
  readonly proxy?: boolean;
}

/**
 * Defines the properties required for defining an Api Gateway V2 HTTP Integration.
 */
export interface WebSocketHttpIntegrationProps extends WebSocketHttpIntegrationOptions {
  /**
   * Defines the api for this integration.
   */
  readonly api: IWebSocketApi;
}

/**
 * An AWS Lambda integration for an API in Amazon API Gateway v2.
 */
export class WebSocketHttpIntegration extends WebSocketIntegration {
  constructor(scope: Construct, id: string, props: WebSocketHttpIntegrationProps) {
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
      type: props.proxy ? WebSocketIntegrationType.HTTP_PROXY : WebSocketIntegrationType.HTTP,
      uri: props.url,
    });
  }
}