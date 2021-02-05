import { ArnPrincipal } from '@aws-cdk/aws-iam';
import { Aws, Fn, IResource, Resource, Stack, Token } from '@aws-cdk/core';
import { Default, RegionInfo } from '@aws-cdk/region-info';
import { Construct } from 'constructs';
import { CfnVPCEndpointService, CfnVPCEndpointServicePermissions } from './ec2.generated';

/**
 * A load balancer that can host a VPC Endpoint Service
 *
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
 * @experimental
 */
export class VpcEndpointService extends Resource implements IVpcEndpointService {

  /**
   * One or more network load balancers to host the service.
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

    if (props.vpcEndpointServiceLoadBalancers === undefined || props.vpcEndpointServiceLoadBalancers.length === 0) {
      throw new Error('VPC Endpoint Service must have at least one load balancer specified.');
    }

    this.vpcEndpointServiceLoadBalancers = props.vpcEndpointServiceLoadBalancers;
    this.acceptanceRequired = props.acceptanceRequired ?? true;
    this.whitelistedPrincipals = props.whitelistedPrincipals ?? [];

    this.endpointService = new CfnVPCEndpointService(this, id, {
      networkLoadBalancerArns: this.vpcEndpointServiceLoadBalancers.map(lb => lb.loadBalancerArn),
      acceptanceRequired: this.acceptanceRequired,
    });

    this.vpcEndpointServiceId = this.endpointService.ref;

    const { region } = Stack.of(this);
    const serviceNamePrefix = !Token.isUnresolved(region) ?
      (RegionInfo.get(region).vpcEndpointServiceNamePrefix ?? Default.VPC_ENDPOINT_SERVICE_NAME_PREFIX) :
      Default.VPC_ENDPOINT_SERVICE_NAME_PREFIX;

    this.vpcEndpointServiceName = Fn.join('.', [serviceNamePrefix, Aws.REGION, this.vpcEndpointServiceId]);
    if (this.whitelistedPrincipals.length > 0) {
      new CfnVPCEndpointServicePermissions(this, 'Permissions', {
        serviceId: this.endpointService.ref,
        allowedPrincipals: this.whitelistedPrincipals.map(x => x.arn),
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
   * @deprecated This property is not used
   * @default - CDK generated name
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
