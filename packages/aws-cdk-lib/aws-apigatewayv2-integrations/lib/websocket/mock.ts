import {
  WebSocketIntegrationType,
  WebSocketRouteIntegrationConfig,
  WebSocketRouteIntegrationBindOptions,
  WebSocketTwoWayRouteIntegration,
  InternalWebSocketIntegrationResponseProps,
} from '../../../aws-apigatewayv2';

export interface WebSocketMockIntegrationProps {
  /**
   * Integration responses configuration
   *
   * @default - No response configuration provided.
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-integration-responses.html
   */
  readonly responses?: InternalWebSocketIntegrationResponseProps[];
}

/**
 * Mock WebSocket Integration
 */
export class WebSocketMockIntegration extends WebSocketTwoWayRouteIntegration {

  /**
   * @param id id of the underlying integration construct
   */
  constructor(id: string, private readonly props: WebSocketMockIntegrationProps = {}) {
    super(id);
  }

  bind(options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig {
    options;
    return {
      type: WebSocketIntegrationType.MOCK,
      uri: '',
      responses: this.props.responses,
    };
  }
}
