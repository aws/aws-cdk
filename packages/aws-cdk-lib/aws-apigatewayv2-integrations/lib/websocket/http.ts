import {
  WebSocketRouteIntegration,
  WebSocketIntegrationType,
  WebSocketRouteIntegrationBindOptions,
  WebSocketRouteIntegrationConfig,
  ContentHandling,
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
   * Specifies the integration's HTTP method type.
   */
  readonly integrationMethod: string;

  /**
   * Specifies how to handle response payload content type conversions.
   *
   * @default - The response payload will be passed through from the integration response to
   * the route response or method response without modification.
   */
  readonly contentHandling?: ContentHandling;

  /**
   * The maximum amount of time an integration will run before it returns without a response.
   * Must be between 50 milliseconds and 29 seconds.
   *
   * @default Duration.seconds(29)
   */
  readonly timeout?: Duration;
}

class BaseWebSocketHttpIntegration extends WebSocketRouteIntegration {
  /**
     * @param id id of the underlying integration construct
     * @param type type of the integration
     * @param props properties of the integration
     */
  constructor(id: string,
    private readonly type: WebSocketIntegrationType.HTTP | WebSocketIntegrationType.HTTP_PROXY,
    private readonly props: WebSocketHttpIntegrationProps) {
    super(id);
  }

  bind(_options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig {
    return {
      type: this.type,
      uri: this.props.integrationUri,
      method: this.props.integrationMethod,
      contentHandling: this.props.contentHandling,
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
