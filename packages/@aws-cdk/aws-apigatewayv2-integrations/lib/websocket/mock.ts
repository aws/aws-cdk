import {
  IWebSocketRouteIntegration,
  WebSocketIntegrationType,
  WebSocketRouteIntegrationBindOptions,
  WebSocketRouteIntegrationConfig,
} from '@aws-cdk/aws-apigatewayv2';

/**
 * Mock WebSocket Integration props
 */
export interface MockWebSocketIntegrationProps {
  // TODO: any props?
  /**
   * Prop description
   */
  //readonly prop: IFunction
}

/**
 * Mock WebSocket Integration
 */
export class MockWebSocketIntegration implements IWebSocketRouteIntegration {
  constructor(private props: MockWebSocketIntegrationProps) {}

  bind(options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig {
    options; this.props;
    return {
      type: WebSocketIntegrationType.MOCK,
      uri: '',
    };
  }
}
