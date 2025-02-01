import {
  WebSocketRouteIntegration,
  WebSocketIntegrationType,
  WebSocketRouteIntegrationConfig,
  WebSocketRouteIntegrationBindOptions,
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
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-mapping-template-reference.html
   */
  readonly requestTemplates?: { [contentType: string]: string };

  /**
   * The template selection expression for the integration.
   *
   * @default - No template selection expression provided.
   */
  readonly templateSelectionExpression?: string;
}

/**
 * Mock WebSocket Integration
 */
export class WebSocketMockIntegration extends WebSocketRouteIntegration {
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
    };
  }
}
