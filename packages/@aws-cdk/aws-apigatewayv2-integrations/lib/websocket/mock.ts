import {
  WebSocketRouteIntegration,
  WebSocketIntegrationType,
  WebSocketRouteIntegrationConfig,
  WebSocketRouteIntegrationBindOptions,
} from '@aws-cdk/aws-apigatewayv2';

/**
 * Mock WebSocket Integration
 */
export class MockWebSocketIntegration extends WebSocketRouteIntegration {

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
