import * as apigwv2 from '../../../aws-apigatewayv2';
import * as ec2 from '../../../aws-ec2';
import * as elbv2 from '../../../aws-elasticloadbalancingv2';
import { Names, Token } from '../../../core';
import { ValidationError } from '../../../core/lib/errors';
import { ConnectionType, Integration, IntegrationConfig, IntegrationOptions, IntegrationType } from '../integration';
import { Method } from '../method';

/**
 * Properties for `AlbIntegration`.
 */
export interface AlbIntegrationProps {
  /**
   * The VPC link V2 to use for the integration.
   *
   * If not specified, a new VPC link will be created for the ALB's VPC.
   *
   * @default - A new VPC link is created
   */
  readonly vpcLink?: apigwv2.IVpcLink;

  /**
   * Determines whether to use proxy integration or custom integration.
   *
   * In proxy integration, API Gateway passes the entire request and response
   * between the frontend and the backend without modification.
   *
   * @default true
   */
  readonly proxy?: boolean;

  /**
   * HTTP method to use when invoking the backend URL.
   *
   * @default - Uses the same HTTP method as the API method
   */
  readonly httpMethod?: string;

  /**
   * Integration options, such as request/response mapping, content handling, etc.
   *
   * Note: `vpcLinkV2` and `integrationTarget` options are automatically configured
   * and should not be specified here.
   *
   * @default - No additional options
   */
  readonly options?: IntegrationOptions;
}

/**
 * Integrates an Application Load Balancer to an API Gateway REST API method.
 *
 * This integration uses VPC Link V2 to connect API Gateway directly to an internal
 * Application Load Balancer without requiring a Network Load Balancer as an intermediary.
 *
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-private-integration.html
 *
 * @example
 * declare const api: apigateway.RestApi;
 * declare const alb: elbv2.ApplicationLoadBalancer;
 *
 * const integration = new apigateway.AlbIntegration(alb);
 * api.root.addMethod('GET', integration);
 *
 * @example
 * // With existing VPC Link
 * declare const api: apigateway.RestApi;
 * declare const alb: elbv2.ApplicationLoadBalancer;
 * declare const vpcLink: apigatewayv2.VpcLink;
 *
 * const integration = new apigateway.AlbIntegration(alb, {
 *   vpcLink,
 * });
 * api.root.addMethod('GET', integration);
 */
export class AlbIntegration extends Integration {
  private readonly alb: elbv2.IApplicationLoadBalancer;
  private readonly albProps: AlbIntegrationProps;
  private vpcLink?: apigwv2.IVpcLink;

  /**
   * @param alb The Application Load Balancer to integrate with
   * @param props Properties to configure the integration
   */
  constructor(alb: elbv2.IApplicationLoadBalancer, props: AlbIntegrationProps = {}) {
    const proxy = props.proxy ?? true;

    super({
      type: proxy ? IntegrationType.HTTP_PROXY : IntegrationType.HTTP,
      // integrationHttpMethod will be set in bind() if not provided
      integrationHttpMethod: props.httpMethod ?? 'ANY',
      // uri is required for HTTP integrations, will be set in bind()
      uri: 'http://placeholder.internal',
      options: props.options,
    });

    this.alb = alb;
    this.albProps = props;
  }

  public bind(method: Method): IntegrationConfig {
    // Determine VPC from ALB or vpcLink
    let vpc: ec2.IVpc | undefined = this.albProps.vpcLink?.vpc;
    if (!vpc && (this.alb instanceof elbv2.ApplicationLoadBalancer)) {
      vpc = this.alb.vpc;
    }
    if (!vpc) {
      throw new ValidationError(
        'The vpcLink property must be specified when using an imported Application Load Balancer.',
        method,
      );
    }

    // Create or reuse VPC Link
    this.vpcLink = this.albProps.vpcLink ?? this.createVpcLink(method, vpc);

    // Build integration options with VPC Link V2 settings
    const integrationOptions: IntegrationOptions = {
      ...this.albProps.options,
      connectionType: ConnectionType.VPC_LINK,
      vpcLinkV2: this.vpcLink,
      integrationTarget: this.alb.loadBalancerArn,
    };

    // Determine HTTP method
    const httpMethod = this.albProps.httpMethod ?? method.httpMethod;

    // Generate deployment token for proper redeployment on changes
    let deploymentToken: string | undefined;
    if (!Token.isUnresolved(this.alb.loadBalancerArn)) {
      deploymentToken = JSON.stringify({
        loadBalancerArn: this.alb.loadBalancerArn,
        vpcLinkId: this.vpcLink.vpcLinkId,
      });
    }

    const proxy = this.albProps.proxy ?? true;

    return {
      type: proxy ? IntegrationType.HTTP_PROXY : IntegrationType.HTTP,
      integrationHttpMethod: httpMethod,
      // URI is required for HTTP integrations with VPC Link V2
      // It sets the Host header for the backend request
      uri: `http://${this.alb.loadBalancerDnsName}`,
      options: integrationOptions,
      deploymentToken,
    };
  }

  /**
   * Creates a new VPC Link for the ALB's VPC.
   */
  private createVpcLink(method: Method, vpc: ec2.IVpc): apigwv2.VpcLink {
    const id = `VpcLink-${Names.nodeUniqueId(this.alb.node)}`;

    // Check if a VPC link already exists in the API's scope
    const existingVpcLink = method.api.node.tryFindChild(id) as apigwv2.VpcLink | undefined;
    if (existingVpcLink) {
      return existingVpcLink;
    }

    return new apigwv2.VpcLink(method.api, id, {
      vpc,
      vpcLinkName: `${Names.uniqueId(method.api)}-${Names.nodeUniqueId(this.alb.node)}`,
    });
  }
}
