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
export interface HttpUrlIntegrationProps {
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
export class HttpUrlIntegration extends HttpRouteIntegration {
  /**
   * @param id id of the underlying integration construct
   * @param url the URL to proxy to
   * @param props properties to configure the integration
   */
  constructor(id: string, private readonly url: string, private readonly props: HttpUrlIntegrationProps = {}) {
    super(id);
  }

  public bind(_: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    return {
      method: this.props.method ?? HttpMethod.ANY,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0, // 1.0 is required and is the only supported format
      type: HttpIntegrationType.HTTP_PROXY,
      uri: this.url,
      parameterMapping: this.props.parameterMapping,
    };
  }
}