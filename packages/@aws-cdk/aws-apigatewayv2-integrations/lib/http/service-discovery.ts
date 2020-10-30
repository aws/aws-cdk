import { HttpMethod, IVpcLink, HttpRouteIntegrationBindOptions, HttpRouteIntegrationConfig } from '@aws-cdk/aws-apigatewayv2';
import * as servicediscovery from '@aws-cdk/aws-servicediscovery';
import { HttpPrivateIntegration } from './private/integration';

/**
 * Properties to initialize `HttpServiceDiscoveryIntegration`.
 */
export interface HttpServiceDiscoveryIntegrationProps {
  /**
   * The discovery service used for the integration
   */
  readonly service: servicediscovery.Service;

  /**
   * The vpc link to be used for the private integration
   */
  readonly vpcLink: IVpcLink;

  /**
   * The HTTP method that must be used to invoke the underlying HTTP proxy.
   * @default HttpMethod.ANY
   */
  readonly method?: HttpMethod;
}

/**
 * The Service Discovery integration resource for HTTP API
 */
export class HttpServiceDiscoveryIntegration extends HttpPrivateIntegration {
  constructor(private readonly props: HttpServiceDiscoveryIntegrationProps) {
    super();
  }

  public bind(_: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    return {
      method: this.props.method ?? this.httpMethod,
      payloadFormatVersion: this.payloadFormatVersion,
      type: this.integrationType,
      connectionType: this.connectionType,
      connectionId: this.props.vpcLink.vpcLinkId,
      uri: this.props.service.serviceArn,
    };
  }
}
