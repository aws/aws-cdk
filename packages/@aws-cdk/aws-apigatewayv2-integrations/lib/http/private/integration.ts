import {
  HttpConnectionType,
  HttpIntegrationType,
  HttpRouteIntegrationBindOptions,
  HttpRouteIntegrationConfig,
  HttpRouteIntegration,
  PayloadFormatVersion,
  HttpMethod,
  IVpcLink,
} from '@aws-cdk/aws-apigatewayv2';
import * as ec2 from '@aws-cdk/aws-ec2';


/**
 * Options required to use an existing vpcLink or configure a new one
 *
 * @internal
 */
export interface VpcLinkConfigurationOptions {
  /**
   * The vpc link to be used for the private integration
   *
   * @default - a new VpcLink is created
   */
  readonly vpcLink?: IVpcLink;

  /**
   * The vpc for which the VpcLink needs to be created
   *
   * @default undefined
   */
  readonly vpc?: ec2.IVpc;
}

/**
 * The HTTP Private integration resource for HTTP API
 *
 * @internal
 */
export abstract class HttpPrivateIntegration extends HttpRouteIntegration {
  protected httpMethod = HttpMethod.ANY;
  protected payloadFormatVersion = PayloadFormatVersion.VERSION_1_0; // 1.0 is required and is the only supported format
  protected integrationType = HttpIntegrationType.HTTP_PROXY;
  protected connectionType = HttpConnectionType.VPC_LINK

  /**
   * Adds a vpcLink to the API if not passed in the options
   *
   * @internal
   */
  protected _configureVpcLink(bindOptions: HttpRouteIntegrationBindOptions, configOptions: VpcLinkConfigurationOptions): IVpcLink {
    let vpcLink = configOptions.vpcLink;
    if (!vpcLink) {
      if (!configOptions.vpc) {
        throw new Error('One of vpcLink or vpc should be provided for private integration');
      }

      vpcLink = bindOptions.route.httpApi.addVpcLink({ vpc: configOptions.vpc });
    }

    return vpcLink;
  }

  public abstract override bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig;
}
