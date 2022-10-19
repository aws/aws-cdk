import { HttpRouteIntegrationBindOptions, HttpRouteIntegrationConfig } from '@aws-cdk/aws-apigatewayv2';
import * as servicediscovery from '@aws-cdk/aws-servicediscovery';
import { HttpPrivateIntegrationOptions } from './base-types';
import { HttpPrivateIntegration } from './private/integration';

/**
 * Properties to initialize `HttpServiceDiscoveryIntegration`.
 */
export interface HttpServiceDiscoveryIntegrationProps extends HttpPrivateIntegrationOptions {
}

/**
 * The Service Discovery integration resource for HTTP API
 */
export class HttpServiceDiscoveryIntegration extends HttpPrivateIntegration {
  /**
   * @param id id of the underlying integration construct
   * @param service the service discovery resource to integrate with
   * @param props properties to configure the integration
   */
  constructor(
    id: string,
    private readonly service: servicediscovery.IService,
    private readonly props: HttpServiceDiscoveryIntegrationProps = {}) {

    super(id);
  }

  public bind(_: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    if (!this.props.vpcLink) {
      throw new Error('The vpcLink property is mandatory');
    }

    return {
      method: this.props.method ?? this.httpMethod,
      payloadFormatVersion: this.payloadFormatVersion,
      type: this.integrationType,
      connectionType: this.connectionType,
      connectionId: this.props.vpcLink.vpcLinkId,
      uri: this.service.serviceArn,
      secureServerName: this.props.secureServerName,
      parameterMapping: this.props.parameterMapping,
    };
  }
}
