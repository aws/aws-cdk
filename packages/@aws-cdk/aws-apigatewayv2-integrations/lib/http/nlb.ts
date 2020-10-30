import { HttpRouteIntegrationBindOptions, HttpRouteIntegrationConfig } from '@aws-cdk/aws-apigatewayv2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { HttpPrivateIntegrationOptions } from './base-types';
import { HttpPrivateIntegration } from './private/integration';

/**
 * Properties to initialize `HttpNlbIntegration`.
 */
export interface HttpNlbIntegrationProps extends HttpPrivateIntegrationOptions {
  /**
   * The listener to the netwwork load balancer used for the integration
   */
  readonly listener: elbv2.NetworkListener;
}

/**
 * The Network Load Balancer integration resource for HTTP API
 */
export class HttpNlbIntegration extends HttpPrivateIntegration {
  constructor(private readonly props: HttpNlbIntegrationProps) {
    super();
  }

  public bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    const vpcLink = this._configureVpcLink(options, {
      vpcLink: this.props.vpcLink,
      vpc: this.props.listener.loadBalancer.vpc,
    });

    return {
      method: this.props.method ?? this.httpMethod,
      payloadFormatVersion: this.payloadFormatVersion,
      type: this.integrationType,
      connectionType: this.connectionType,
      connectionId: vpcLink.vpcLinkId,
      uri: this.props.listener.listenerArn,
    };
  }
}
