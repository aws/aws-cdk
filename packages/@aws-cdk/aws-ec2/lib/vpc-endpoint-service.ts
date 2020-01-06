import { ArnPrincipal } from '@aws-cdk/aws-iam';
import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnVPCEndpointService, CfnVPCEndpointServicePermissions } from './ec2.generated';

/**
 * A load balancer that can host a VPC Endpoint Service
 * @experimental
 */
export interface IVpcEndpointServiceLoadBalancer {
  /**
   * The ARN of the load balancer that hosts the VPC Endpoint Service
   */
  readonly loadBalancerArn: string;
}

/**
 * A VPC endpoint service.
 * @experimental
 */
export interface IVpcEndpointService extends IResource {
  /**
   * Name of the Vpc Endpoint Service
   * @experimental
   */
  readonly vpcEndpointServiceName?: string;
}

/**
 * A VPC endpoint service
 * @resource AWS::EC2::VPCEndpointService
 * @experimental
 */
export class VpcEndpointService extends Resource implements IVpcEndpointService {

  /**
   * One or more network load balancer ARNs to host the service.
   * @attribute
   */
  public readonly vpcEndpointServiceLoadBalancers: IVpcEndpointServiceLoadBalancer[];

  /**
   * Whether to require manual acceptance of new connections to the service.
   * @experimental
   */
  public readonly acceptanceRequired: boolean;

  /**
   * One or more Principal ARNs to allow inbound connections to.
   * @experimental
   */
  public readonly whitelistedPrincipals: ArnPrincipal[];

  private readonly endpointService: CfnVPCEndpointService;

  constructor(scope: Construct, id: string, props: VpcEndpointServiceProps) {
    super(scope, id);

    if (props.vpcEndpointServiceLoadBalancers === undefined || props.vpcEndpointServiceLoadBalancers.length === 0) {
      throw new Error("VPC Endpoint Service must have at least one load balancer specified.");
    }

    this.vpcEndpointServiceLoadBalancers = props.vpcEndpointServiceLoadBalancers;
    this.acceptanceRequired = props.acceptanceRequired !== undefined ? props.acceptanceRequired : true;
    this.whitelistedPrincipals = props.whitelistedPrincipals !== undefined ? props.whitelistedPrincipals : [];

    this.endpointService = new CfnVPCEndpointService(this, id, {
      networkLoadBalancerArns: this.vpcEndpointServiceLoadBalancers.map(lb => lb.loadBalancerArn),
      acceptanceRequired: this.acceptanceRequired
    });

    if (this.whitelistedPrincipals.length > 0) {
      new CfnVPCEndpointServicePermissions(this, "Permissions", {
        serviceId: this.endpointService.ref,
        allowedPrincipals: this.whitelistedPrincipals.map(x => x.arn)
      });
    }
  }
}

/**
 * Construction properties for a VpcEndpointService.
 * @experimental
 */
export interface VpcEndpointServiceProps {

  /**
   * Name of the Vpc Endpoint Service
   * @default - CDK generated name
   * @experimental
   */
  readonly vpcEndpointServiceName?: string;

  /**
   * One or more load balancers to host the VPC Endpoint Service.
   * @experimental
   */
  readonly vpcEndpointServiceLoadBalancers: IVpcEndpointServiceLoadBalancer[];

  /**
   * Whether requests from service consumers to connect to the service through
   * an endpoint must be accepted.
   * @default true
   * @experimental
   */
  readonly acceptanceRequired?: boolean;

  /**
   * IAM users, IAM roles, or AWS accounts to allow inbound connections from.
   * These principals can connect to your service using VPC endpoints. Takes a
   * list of one or more ArnPrincipal.
   * @default - no principals
   * @experimental
   */
  readonly whitelistedPrincipals?: ArnPrincipal[];
}
