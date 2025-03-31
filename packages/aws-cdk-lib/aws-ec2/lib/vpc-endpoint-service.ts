import { Construct } from 'constructs';
import { CfnVPCEndpointService, CfnVPCEndpointServicePermissions } from './ec2.generated';
import { ArnPrincipal } from '../../aws-iam';
import { Aws, Fn, IResource, Resource, Stack, Token } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { RegionInfo } from '../../region-info';

/**
 * IP address types supported for VPC endpoint service.
 */
export enum IpAddressType {
  /**
   * ipv4 address type.
   */
  IPV4 = 'ipv4',

  /**
   * ipv6 address type.
   */
  IPV6 = 'ipv6',
}

/**
 * A load balancer that can host a VPC Endpoint Service
 *
 */
export interface IVpcEndpointServiceLoadBalancer {
  /**
   * The ARN of the load balancer that hosts the VPC Endpoint Service
   *
   * @attribute
   */
  readonly loadBalancerArn: string;
}

/**
 * A VPC endpoint service.
 *
 */
export interface IVpcEndpointService extends IResource {
  /**
   * The service name of the VPC Endpoint Service that clients use to connect to,
   * like com.amazonaws.vpce.<region>.vpce-svc-xxxxxxxxxxxxxxxx
   *
   * @attribute
   */
  readonly vpcEndpointServiceName: string;

  /**
   * The id of the VPC Endpoint Service that clients use to connect to,
   * like vpce-svc-xxxxxxxxxxxxxxxx
   *
   * @attribute
   */
  readonly vpcEndpointServiceId: string;
}

/**
 * A VPC endpoint service
 * @resource AWS::EC2::VPCEndpointService
 *
 */
export class VpcEndpointService extends Resource implements IVpcEndpointService {
  /**
   * The default value for a VPC Endpoint Service name prefix, useful if you do
   * not have a synthesize-time region literal available (all you have is
   * `{ "Ref": "AWS::Region" }`)
   */
  public static readonly DEFAULT_PREFIX = 'com.amazonaws.vpce';

  /**
   * One or more network load balancers to host the service.
   * @attribute
   */
  public readonly vpcEndpointServiceLoadBalancers: IVpcEndpointServiceLoadBalancer[];

  /**
   * Whether to require manual acceptance of new connections to the service.
   *
   */
  public readonly acceptanceRequired: boolean;

  /**
   * Whether to enable the built-in Contributor Insights rules provided by AWS PrivateLink.
   *
   */
  public readonly contributorInsightsEnabled?: boolean;

  /**
   * One or more Principal ARNs to allow inbound connections to.
   * @deprecated use `allowedPrincipals`
   */
  public readonly whitelistedPrincipals: ArnPrincipal[];

  /**
   * One or more Principal ARNs to allow inbound connections to.
   *
   */
  public readonly allowedPrincipals: ArnPrincipal[];

  /**
   * IP address types supported for this VPC endpoint service.
   */
  private readonly supportedIpAddressTypes?: IpAddressType[];

  /**
   * The Regions from which service consumers can access the service.
   */
  private readonly allowedRegions?: string[];

  /**
   * The id of the VPC Endpoint Service, like vpce-svc-xxxxxxxxxxxxxxxx.
   * @attribute
   */
  public readonly vpcEndpointServiceId: string;

  /**
   * The service name of the VPC Endpoint Service that clients use to connect to,
   * like com.amazonaws.vpce.<region>.vpce-svc-xxxxxxxxxxxxxxxx
   *
   * @attribute
   */
  public readonly vpcEndpointServiceName: string;

  private readonly endpointService: CfnVPCEndpointService;

  constructor(scope: Construct, id: string, props: VpcEndpointServiceProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.vpcEndpointServiceLoadBalancers === undefined || props.vpcEndpointServiceLoadBalancers.length === 0) {
      throw new Error('VPC Endpoint Service must have at least one load balancer specified.');
    }

    this.vpcEndpointServiceLoadBalancers = props.vpcEndpointServiceLoadBalancers;
    this.acceptanceRequired = props.acceptanceRequired ?? true;
    this.contributorInsightsEnabled = props.contributorInsights;
    this.supportedIpAddressTypes = props.supportedIpAddressTypes;
    this.allowedRegions = props.allowedRegions;

    if (props.allowedPrincipals && props.whitelistedPrincipals) {
      throw new Error('`whitelistedPrincipals` is deprecated; please use `allowedPrincipals` instead');
    }
    this.allowedPrincipals = props.allowedPrincipals ?? props.whitelistedPrincipals ?? [];
    this.whitelistedPrincipals = this.allowedPrincipals;

    this.endpointService = new CfnVPCEndpointService(this, id, {
      networkLoadBalancerArns: this.vpcEndpointServiceLoadBalancers.map(lb => lb.loadBalancerArn),
      acceptanceRequired: this.acceptanceRequired,
      contributorInsightsEnabled: this.contributorInsightsEnabled,
      supportedIpAddressTypes: this.supportedIpAddressTypes?.map(type => type.toString()),
      supportedRegions: this.allowedRegions,
    });

    this.vpcEndpointServiceId = this.endpointService.ref;

    const { region } = Stack.of(this);
    const serviceNamePrefix = !Token.isUnresolved(region) ?
      (RegionInfo.get(region).vpcEndpointServiceNamePrefix ?? VpcEndpointService.DEFAULT_PREFIX) :
      VpcEndpointService.DEFAULT_PREFIX;

    this.vpcEndpointServiceName = Fn.join('.', [serviceNamePrefix, Aws.REGION, this.vpcEndpointServiceId]);
    if (this.allowedPrincipals.length > 0) {
      new CfnVPCEndpointServicePermissions(this, 'Permissions', {
        serviceId: this.endpointService.ref,
        allowedPrincipals: this.allowedPrincipals.map(x => x.arn),
      });
    }
  }
}

/**
 * Construction properties for a VpcEndpointService.
 *
 */
export interface VpcEndpointServiceProps {

  /**
   * Name of the Vpc Endpoint Service
   * @deprecated This property is not used
   * @default - CDK generated name
   */
  readonly vpcEndpointServiceName?: string;

  /**
   * One or more load balancers to host the VPC Endpoint Service.
   *
   */
  readonly vpcEndpointServiceLoadBalancers: IVpcEndpointServiceLoadBalancer[];

  /**
   * Whether requests from service consumers to connect to the service through
   * an endpoint must be accepted.
   * @default true
   *
   */
  readonly acceptanceRequired?: boolean;

  /**
   * Indicates whether to enable the built-in Contributor Insights rules provided by AWS PrivateLink.
   * @default false
   *
   */
  readonly contributorInsights?: boolean;

  /**
   * IAM users, IAM roles, or AWS accounts to allow inbound connections from.
   * These principals can connect to your service using VPC endpoints. Takes a
   * list of one or more ArnPrincipal.
   * @default - no principals
   * @deprecated use `allowedPrincipals`
   */
  readonly whitelistedPrincipals?: ArnPrincipal[];

  /**
   * IAM users, IAM roles, or AWS accounts to allow inbound connections from.
   * These principals can connect to your service using VPC endpoints. Takes a
   * list of one or more ArnPrincipal.
   * @default - no principals
   *
   */
  readonly allowedPrincipals?: ArnPrincipal[];

  /**
   * Specify which IP address types are supported for VPC endpoint service.
   * @default - No specific IP address types configured
   */
  readonly supportedIpAddressTypes?: IpAddressType[];

  /**
   * The Regions from which service consumers can access the service.
   * @default - No Region restrictions
   */
  readonly allowedRegions?: string[];
}
