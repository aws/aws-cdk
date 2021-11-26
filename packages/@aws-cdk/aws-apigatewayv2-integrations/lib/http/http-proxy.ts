import {
  HttpIntegrationType,
  HttpRouteIntegrationBindOptions,
  HttpRouteIntegrationConfig,
  HttpMethod,
  HttpRouteIntegration,
  ParameterMapping,
  PayloadFormatVersion,
} from '@aws-cdk/aws-apigatewayv2';

/**
 * Properties to initialize a new `HttpProxyIntegration`.
 */
export interface HttpProxyIntegrationProps {
  /**
   * The full-qualified HTTP URL for the HTTP integration
   */
  readonly url: string

  /**
   * The HTTP method that must be used to invoke the underlying HTTP proxy.
   * @default HttpMethod.ANY
   */
  readonly method?: HttpMethod;

  /**
   * Specifies how to transform HTTP requests before sending them to the backend
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-parameter-mapping.html
   * @default undefined requests are sent to the backend unmodified
   */
  readonly parameterMapping?: ParameterMapping;
}

/**
 * The HTTP Proxy integration resource for HTTP API
 */
export class HttpProxyIntegration extends HttpRouteIntegration {
  constructor(private readonly props: HttpProxyIntegrationProps) {
    super();
  }

  public bind(_: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    return {
      method: this.props.method ?? HttpMethod.ANY,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0, // 1.0 is required and is the only supported format
      type: HttpIntegrationType.HTTP_PROXY,
      uri: this.props.url,
      parameterMapping: this.props.parameterMapping,
    };
  }
}