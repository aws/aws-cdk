import * as apigwv2 from '../../../aws-apigatewayv2';
import type * as ec2 from '../../../aws-ec2';
import type * as elbv2 from '../../../aws-elasticloadbalancingv2';
import { Token } from '../../../core';
import { ValidationError } from '../../../core/lib/errors';
import { lit } from '../../../core/lib/private/literal-string';
import type { IntegrationConfig, IntegrationOptions } from '../integration';
import { ConnectionType, Integration, IntegrationType } from '../integration';
import type { Method } from '../method';

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
   * `vpcLinkV2` and `integrationTarget` options are automatically configured and should not be specified here.
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
      // 'ANY' satisfies the parent validation; bind() falls back to the method's HTTP method when props.httpMethod is unset.
      integrationHttpMethod: props.httpMethod ?? 'ANY',
      // uri is set in bind() — accessing alb.loadBalancerDnsName eagerly would throw for imported ALBs without DnsName, before bind()'s VPC validation can surface a friendlier error.
      options: props.options,
    });

    this.alb = alb;
    this.albProps = props;
  }

  public bind(method: Method): IntegrationConfig {
    const bindResult = super.bind(method);

    const vpc = this.albProps.vpcLink?.vpc ?? this.alb.vpc;
    if (!vpc) {
      throw new ValidationError(
        lit`CannotDetermineVpc`,
        'Cannot determine VPC from the imported Application Load Balancer. Specify the vpc property when importing the ALB, or provide a vpcLink to AlbIntegration.',
        method,
      );
    }

    this.vpcLink = this.albProps.vpcLink ?? this.createVpcLink(method, vpc);

    // loadBalancerArn is included only when resolved; vpcLinkId is always included so a VPC link swap triggers redeployment even if the ARN is a token.
    const deploymentToken = JSON.stringify({
      ...(Token.isUnresolved(this.alb.loadBalancerArn)
        ? {}
        : { loadBalancerArn: this.alb.loadBalancerArn }),
      vpcLinkId: this.vpcLink.vpcLinkId,
    });

    return {
      ...bindResult,
      uri: `http://${this.alb.loadBalancerDnsName}`,
      integrationHttpMethod: this.albProps.httpMethod ?? method.httpMethod,
      options: {
        ...bindResult.options,
        connectionType: ConnectionType.VPC_LINK,
        vpcLinkV2: this.vpcLink,
        integrationTarget: this.alb.loadBalancerArn,
      },
      deploymentToken,
    };
  }

  /**
   * Creates a new VPC Link for the VPC, or returns an existing one if already created.
   *
   * VPC Links are shared per VPC, similar to the API Gateway V2 implementation.
   */
  private createVpcLink(method: Method, vpc: ec2.IVpc): apigwv2.VpcLink {
    const id = `VpcLink-${vpc.node.id}`;

    const existingVpcLink = method.api.node.tryFindChild(id) as apigwv2.VpcLink | undefined;
    if (existingVpcLink) {
      return existingVpcLink;
    }

    return new apigwv2.VpcLink(method.api, id, {
      vpc,
    });
  }
}
