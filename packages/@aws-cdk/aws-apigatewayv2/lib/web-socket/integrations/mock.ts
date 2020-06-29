import { Construct } from '@aws-cdk/core';

import { IWebSocketApi } from '../api';
import { WebSocketIntegration, WebSocketIntegrationOptions, WebSocketIntegrationType } from '../integration';

/**
 * Defines the properties required for defining an Api Gateway V2 Mock Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface WebSocketMockIntegrationOptions extends WebSocketIntegrationOptions {
}

/**
 * Defines the properties required for defining an Api Gateway V2 Mock Integration.
 */
export interface WebSocketMockIntegrationProps extends WebSocketMockIntegrationOptions {
  /**
   * Defines the api for this integration.
   */
  readonly api: IWebSocketApi;
}

/**
 * An AWS Lambda integration for an API in Amazon API Gateway v2.
 */
export class WebSocketMockIntegration extends WebSocketIntegration {
  constructor(scope: Construct, id: string, props: WebSocketMockIntegrationProps) {
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
      type: WebSocketIntegrationType.MOCK,
      uri: '',
    });
  }
}