import type { HttpPrivateIntegrationOptions } from './base-types';
import { HttpPrivateIntegration } from './private/integration';
import type { HttpRouteIntegrationBindOptions, HttpRouteIntegrationConfig } from '../../../aws-apigatewayv2';
import type * as ecs from '../../../aws-ecs';
import { ValidationError } from '../../../core/lib/errors';
import { lit } from '../../../core/lib/private/literal-string';

/**
 * Properties to initialize `HttpServiceConnectIntegration`.
 */
export interface HttpServiceConnectIntegrationProps extends HttpPrivateIntegrationOptions {
  /**
   * The discovery name of the Service Connect service to integrate with.
   *
   * @default - the service's only Service Connect service. Required when the
   * service has more than one Service Connect service.
   */
  readonly discoveryName?: string;
}

/**
 * The Service Connect integration resource for HTTP API
 */
export class HttpServiceConnectIntegration extends HttpPrivateIntegration {
  /**
   * @param id id of the underlying integration construct
   * @param service the ECS service with Service Connect enabled to integrate with
   * @param props properties to configure the integration
   */
  constructor(
    id: string,
    private readonly service: ecs.BaseService,
    private readonly props: HttpServiceConnectIntegrationProps = {}) {
    super(id);
  }

  public bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    if (!this.props.vpcLink) {
      throw new ValidationError(lit`VpcLinkPropertyMandatory`, 'The vpcLink property is mandatory', options.scope);
    }

    return {
      method: this.props.method ?? this.httpMethod,
      payloadFormatVersion: this.payloadFormatVersion,
      type: this.integrationType,
      connectionType: this.connectionType,
      connectionId: this.props.vpcLink.vpcLinkId,
      uri: this.service.serviceConnectDiscoveryArn(this.props.discoveryName),
      secureServerName: this.props.secureServerName,
      parameterMapping: this.props.parameterMapping,
    };
  }
}
