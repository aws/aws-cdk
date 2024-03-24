import {
  WebSocketRouteIntegration,
  WebSocketIntegrationType,
  WebSocketRouteIntegrationBindOptions,
  WebSocketRouteIntegrationConfig,
  ContentHandling,
  HttpMethod,
} from '../../../aws-apigatewayv2';
import { Duration } from '../../../core';

/**
 * Props for HTTP type integrations
 */
export interface WebSocketHttpIntegrationProps {
  /**
   * Integration URI.
   */
  readonly integrationUri: string;

  /**
   * The HTTP method that must be used to invoke the underlying HTTP proxy.
   * @default HttpMethod.ANY
   */
  readonly integrationMethod?: HttpMethod;

  /**
   * Specifies how to handle response payload content type conversions.
   *
   * @default - The response payload will be passed through from the integration response to
   * the route response or method response without modification.
   */
  readonly contentHandling?: ContentHandling;

  /**
   * The request parameters that API Gateway sends with the backend request.
   * Specify request parameters as key-value pairs (string-to-string
   * mappings), with a destination as the key and a source as the value.
   *
   * @default - No request parameter provided to the integration.
   */
  readonly requestParameters?: { [dest: string]: string };

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
   * The maximum amount of time an integration will run before it returns without a response.
   * Must be between 50 milliseconds and 29 seconds.
   *
   * @default Duration.seconds(29)
   */
  readonly timeout?: Duration;
}

type WebSocketIntegrationHttpType = WebSocketIntegrationType.HTTP | WebSocketIntegrationType.HTTP_PROXY;

class BaseWebSocketHttpIntegration extends WebSocketRouteIntegration {
  /**
     * @param id id of the underlying integration construct
     * @param type type of the integration
     * @param props properties of the integration
     */
  constructor(id: string,
    private readonly type: WebSocketIntegrationHttpType,
    private readonly props: WebSocketHttpIntegrationProps) {
    super(id);
  }

  bind(_options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig {
    return {
      type: this.type,
      uri: this.props.integrationUri,
      method: this.props.integrationMethod ?? HttpMethod.ANY,
      contentHandling: this.props.contentHandling,
      requestParameters: this.props.requestParameters,
      requestTemplates: this.props.requestTemplates,
      templateSelectionExpression: this.props.templateSelectionExpression,
      timeout: this.props.timeout,
    };
  }
}

/**
 * HTTP WebSocket Integration
 */
export class WebSocketHttpIntegration extends BaseWebSocketHttpIntegration {
  /**
     * @param id id of the underlying integration construct
     * @param props properties of the integration
     */
  constructor(id: string, props: WebSocketHttpIntegrationProps) {
    super(id, WebSocketIntegrationType.HTTP, props);
  }
}

/**
 * HTTP Proxy WebSocket Integration
 */
export class WebSocketHttpProxyIntegration extends BaseWebSocketHttpIntegration {
  /**
     * @param id id of the underlying integration construct
     * @param props properties of the integration
     */
  constructor(id: string, props: WebSocketHttpIntegrationProps) {
    super(id, WebSocketIntegrationType.HTTP_PROXY, props);
  }
}
