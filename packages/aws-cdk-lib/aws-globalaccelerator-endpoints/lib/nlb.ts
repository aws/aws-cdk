import { validateWeight } from './_util';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import * as ga from '../../aws-globalaccelerator';

/**
 * Properties for a NetworkLoadBalancerEndpoint
 */
export interface NetworkLoadBalancerEndpointProps {
  /**
   * Endpoint weight across all endpoints in the group
   *
   * Must be a value between 0 and 255.
   *
   * @default 128
   */
  readonly weight?: number;

  /**
   * Forward the client IP address in an `X-Forwarded-For` header
   *
   * GlobalAccelerator will create Network Interfaces in your VPC in order
   * to preserve the client IP address.
   *
   * Client IP address preservation is supported only in specific AWS Regions.
   * See the GlobalAccelerator Developer Guide for a list.
   *
   * @default false
   */
  readonly preserveClientIp?: boolean;
}

/**
 * Use a Network Load Balancer as a Global Accelerator Endpoint
 */
export class NetworkLoadBalancerEndpoint implements ga.IEndpoint {
  public readonly region?: string;

  constructor(private readonly loadBalancer: elbv2.INetworkLoadBalancer, private readonly options: NetworkLoadBalancerEndpointProps = {}) {
    validateWeight(options.weight);
    this.region = loadBalancer.env.region;
  }

  public renderEndpointConfiguration(): any {
    return {
      endpointId: this.loadBalancer.loadBalancerArn,
      weight: this.options.weight,
      clientIpPreservationEnabled: this.options.preserveClientIp,
    } as ga.CfnEndpointGroup.EndpointConfigurationProperty;
  }
}
