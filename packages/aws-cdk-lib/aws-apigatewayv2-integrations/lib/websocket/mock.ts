import {
  WebSocketIntegrationType,
  WebSocketRouteIntegrationConfig,
  WebSocketRouteIntegrationBindOptions,
  CustomResponseWebSocketRoute,
  InternalWebSocketIntegrationResponseProps,
} from '../../../aws-apigatewayv2';

/**
 * Props for Mock type integration for a WebSocket Api.
 */
export interface WebSocketMockIntegrationProps {
  /**
   * A map of Apache Velocity templates that are applied on the request
   * payload.
   *
   * ```
   *   { "application/json": "{ \"statusCode\": 200 }" }
   * ```
   *
   * @default - No request template provided to the integration.
   */
  readonly requestTemplates?: { [contentType: string]: string };

  /**
   * The template selection expression for the integration.
   *
   * @default - No template selection expression provided.
   */
  readonly templateSelectionExpression?: string;

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
export class WebSocketMockIntegration extends CustomResponseWebSocketRoute {

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
      requestTemplates: this.props.requestTemplates,
      templateSelectionExpression: this.props.templateSelectionExpression,
      responses: this.props.responses,
    };
  }
}
