import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnVPCEndpointService, CfnVPCEndpointServicePermissions } from './ec2.generated';

/**
 * A VPC endpoint service.
 */
export interface IVpcEndpointService extends IResource {
}

/**
 * A VPC endpoint service
 * @resource AWS::EC2::VPCEndpointService
 */
export class VpcEndpointService extends Resource implements IVpcEndpointService {

  /**
   * One or more network load balancer ARNs to host the service.
   * @attribute
   */
  public readonly networkLoadBalancerArns: string[];

  /**
   * Whether to require manual acceptance of new connections to the service.
   * @attribute
   */
  public readonly acceptanceRequired: boolean;

  /**
   * One or more Principal ARNs to allow inbound connections to.
   * @attribute
   */
  public readonly whitelistedPrincipalIds: string[];

  private readonly endpointService: CfnVPCEndpointService;

  constructor(scope: Construct, id: string, props: VpcEndpointServiceProps) {
    super(scope, id);

    if (props.networkLoadBalancerArns === undefined || props.networkLoadBalancerArns.length === 0) {
      throw new Error("VPC Endpoint Service must have at least one `Network Load Balancer ARN` specified.");
    }
    this.networkLoadBalancerArns = props.networkLoadBalancerArns;
    this.acceptanceRequired = props.acceptanceRequired;
    this.whitelistedPrincipalIds = props.whitelistedPrincipalIds;

    this.endpointService = new CfnVPCEndpointService(this, id, {
      networkLoadBalancerArns: props.networkLoadBalancerArns,
      acceptanceRequired: props.acceptanceRequired !== undefined ? props.acceptanceRequired : true
    });

    new CfnVPCEndpointServicePermissions(this, id + "Permissions", {
      serviceId: this.endpointService.ref,
      allowedPrincipals: this.whitelistedPrincipalIds
    });
  }
}

/**
 * Construction properties for a VpcEndpointService.
 */
export interface VpcEndpointServiceProps {

    /**
     * Name of the Vpc Endpoint Service
     * @default - CDK generated name
     */
    readonly vpcEndpointServiceName?: string;

    /**
     * One or more network load balancer ARNs to host the service.
     */
    readonly networkLoadBalancerArns: string[];

    /**
     * Whether to require manual acceptance of new connections to the service.
     * @default true
     */
    readonly acceptanceRequired: boolean;

    /**
     * One or more Principal ARNs to allow inbound connections to.
     * @default - no principals
     */
    readonly whitelistedPrincipalIds: string[];
}
