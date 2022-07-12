import {
  WebSocketRouteIntegration,
  WebSocketIntegrationType,
  WebSocketRouteIntegrationConfig,
  WebSocketRouteIntegrationBindOptions,
} from '@aws-cdk/aws-apigatewayv2';

/**
 * Mock WebSocket Integration
 */
export class WebSocketMockIntegration extends WebSocketRouteIntegration {

  /**
   * @param id id of the underlying integration construct
   */
  constructor(id: string) {
    super(id);
  }

  bind(options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig {
    options;
    return {
      type: WebSocketIntegrationType.MOCK,
      uri: '',
    };
  }
}
