import { HttpIntegrationType, HttpRouteIntegrationConfig, IHttpRouteIntegration } from '../integration';
import { IHttpRoute } from '../route';

/**
 * Properties to initialize a new `HttpProxyIntegration`.
 */
export interface HttpProxyIntegrationProps {
  /**
   * The full-qualified HTTP URL for the HTTP integration
   */
  readonly url: string
}

/**
 * The HTTP Proxy integration resource for HTTP API
 */
export class HttpProxyIntegration implements IHttpRouteIntegration {
  constructor(private readonly props: HttpProxyIntegrationProps) {
  }

  public bind(_: IHttpRoute): HttpRouteIntegrationConfig {
    return {
      type: HttpIntegrationType.HTTP_PROXY,
      uri: this.props.url,
    };
  }
}