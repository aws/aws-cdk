import * as apigwv2 from '../../../aws-apigatewayv2';
import * as ec2 from '../../../aws-ec2';
import * as elbv2 from '../../../aws-elasticloadbalancingv2';
import { Token } from '../../../core';
import { ValidationError } from '../../../core/lib/errors';
import { lit } from '../../../core/lib/private/literal-string';
import type { IntegrationConfig, IntegrationOptions } from '../integration';
import { ConnectionType, Integration, IntegrationType } from '../integration';
import type { Method } from '../method';

/**
 * The URI scheme used by `AlbIntegration` when calling the backend listener.
 */
export enum AlbIntegrationProtocol {
  /**
   * Plain HTTP. Use with HTTP listeners.
   */
  HTTP = 'http',

  /**
   * HTTPS. Use with HTTPS listeners.
   */
  HTTPS = 'https',
}

/**
 * Properties for `AlbIntegration`.
 */
export interface AlbIntegrationProps {
  /**
   * The VPC link V2 to use for the integration.
   *
   * When provided, security groups are not auto-configured. The caller is
   * responsible for authorizing traffic from the VPC Link to the ALB listener.
   *
   * @default - A new VPC link is created with an auto-generated security group
   * that is authorized to reach the listener.
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
   * The ARN of the Application Load Balancer that owns the listener.
   *
   * Only allowed when the listener was imported via
   * `ApplicationListener.fromApplicationListenerAttributes`; required in that
   * case. Must NOT be specified for listeners created in the same CDK app —
   * the ARN is read from the listener's load balancer.
   *
   * @default - Derived from the listener's load balancer.
   */
  readonly loadBalancerArn?: string;

  /**
   * The DNS name used in the integration URI to reach the load balancer.
   *
   * Becomes the `Host` header and TLS SNI value when API Gateway calls the
   * backend, so it must match a name the load balancer responds to (and, for
   * HTTPS, must match a name on the listener's certificate). Routing itself is
   * handled by the VPC Link / `loadBalancerArn`, so this hostname does not
   * have to be the ALB's default DNS name — for example, you may pass a
   * Route53 alias that points at the ALB and matches the certificate.
   *
   * Required when the listener was imported via
   * `ApplicationListener.fromApplicationListenerAttributes`.
   *
   * @default - The load balancer's default DNS name, derived from the listener.
   */
  readonly loadBalancerDnsName?: string;

  /**
   * The port that the listener is listening on.
   *
   * Only allowed when the listener was imported; required in that case. Must
   * NOT be specified for listeners created in the same CDK app — the port is
   * read from the listener.
   *
   * @default - Derived from the listener.
   */
  readonly port?: number;

  /**
   * The URI scheme used to talk to the listener.
   *
   * @default - `HTTPS` when the listener's protocol is HTTPS, otherwise `HTTP`.
   */
  readonly protocol?: AlbIntegrationProtocol;

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
 * Integrates an Application Load Balancer listener to an API Gateway REST API method.
 *
 * This integration uses VPC Link V2 to connect API Gateway directly to an internal
 * Application Load Balancer without requiring a Network Load Balancer as an intermediary.
 *
 * Unless a `vpcLink` is supplied, a VPC Link V2 and a security group are
 * created automatically and the listener is authorized to receive traffic from
 * that security group.
 *
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-private-integration.html
 */
export class AlbIntegration extends Integration {
  private readonly listener: elbv2.IApplicationListener;
  private readonly albProps: AlbIntegrationProps;

  /**
   * @param listener The ALB listener to integrate with
   * @param props Properties to configure the integration
   */
  constructor(listener: elbv2.IApplicationListener, props: AlbIntegrationProps = {}) {
    const proxy = props.proxy ?? true;

    super({
      type: proxy ? IntegrationType.HTTP_PROXY : IntegrationType.HTTP,
      // 'ANY' satisfies the parent validation; bind() falls back to the method's HTTP method when props.httpMethod is unset.
      integrationHttpMethod: props.httpMethod ?? 'ANY',
      options: props.options,
    });

    this.listener = listener;
    this.albProps = props;
  }

  public bind(method: Method): IntegrationConfig {
    const bindResult = super.bind(method);

    const concrete = this.listener instanceof elbv2.ApplicationListener ? this.listener : undefined;

    if (concrete) {
      if (this.albProps.loadBalancerArn !== undefined) {
        throw new ValidationError(
          lit`LoadBalancerArnNotAllowed`,
          'loadBalancerArn must not be specified when the Application Listener is created in the same CDK app; the value is derived from the listener',
          method,
        );
      }
      if (this.albProps.port !== undefined) {
        throw new ValidationError(
          lit`PortNotAllowed`,
          'port must not be specified when the Application Listener is created in the same CDK app; the value is derived from the listener',
          method,
        );
      }
    }

    const loadBalancerArn = this.albProps.loadBalancerArn ?? concrete?.loadBalancer.loadBalancerArn;
    if (loadBalancerArn === undefined) {
      throw new ValidationError(
        lit`LoadBalancerArnRequired`,
        'loadBalancerArn must be specified when using an imported Application Listener',
        method,
      );
    }

    const dnsName = this.albProps.loadBalancerDnsName ?? concrete?.loadBalancer.loadBalancerDnsName;
    if (dnsName === undefined) {
      throw new ValidationError(
        lit`LoadBalancerDnsNameRequired`,
        'loadBalancerDnsName must be specified when using an imported Application Listener',
        method,
      );
    }

    const port = this.albProps.port ?? concrete?.port;
    if (port === undefined) {
      throw new ValidationError(
        lit`PortRequired`,
        'port must be specified when using an imported Application Listener',
        method,
      );
    }

    const scheme = this.albProps.protocol
      ?? (concrete?.protocol === elbv2.ApplicationProtocol.HTTPS ? AlbIntegrationProtocol.HTTPS : AlbIntegrationProtocol.HTTP);

    let vpcLink: apigwv2.IVpcLink;
    if (this.albProps.vpcLink) {
      vpcLink = this.albProps.vpcLink;
    } else {
      const vpc = concrete?.loadBalancer.vpc;
      if (!vpc) {
        throw new ValidationError(
          lit`CannotDetermineVpc`,
          'Cannot determine VPC from the imported Application Listener. Provide vpcLink to AlbIntegration.',
          method,
        );
      }
      const created = this.getOrCreateVpcLink(method, vpc);
      vpcLink = created.vpcLink;
      this.listener.connections.allowFrom(
        created.securityGroup,
        ec2.Port.tcp(port),
        'Allow API Gateway VPC Link to reach ALB listener',
      );
    }

    // loadBalancerArn is included only when resolved; vpcLinkId is always included so a VPC link swap triggers redeployment even if the ARN is a token.
    const deploymentToken = JSON.stringify({
      ...(Token.isUnresolved(loadBalancerArn)
        ? {}
        : { loadBalancerArn }),
      vpcLinkId: vpcLink.vpcLinkId,
    });

    return {
      ...bindResult,
      uri: `${scheme}://${dnsName}:${port}`,
      integrationHttpMethod: this.albProps.httpMethod ?? method.httpMethod,
      options: {
        ...bindResult.options,
        connectionType: ConnectionType.VPC_LINK,
        vpcLinkV2: vpcLink,
        integrationTarget: loadBalancerArn,
      },
      deploymentToken,
    };
  }

  /**
   * Reuses or creates a VPC Link + security group pair for the given VPC.
   *
   * Both the VPC Link and its security group live under the RestApi so they are
   * shared across every `AlbIntegration` attached to the same API and VPC.
   */
  private getOrCreateVpcLink(method: Method, vpc: ec2.IVpc): { vpcLink: apigwv2.VpcLink; securityGroup: ec2.SecurityGroup } {
    const sgId = `VpcLinkSg-${vpc.node.id}`;
    const vpcLinkId = `VpcLink-${vpc.node.id}`;

    const securityGroup = (method.api.node.tryFindChild(sgId) as ec2.SecurityGroup | undefined)
      ?? new ec2.SecurityGroup(method.api, sgId, {
        vpc,
        description: 'Automatic security group for API Gateway VPC Link',
      });

    const vpcLink = (method.api.node.tryFindChild(vpcLinkId) as apigwv2.VpcLink | undefined)
      ?? new apigwv2.VpcLink(method.api, vpcLinkId, {
        vpc,
        securityGroups: [securityGroup],
      });

    return { vpcLink, securityGroup };
  }
}
