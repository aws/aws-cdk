import { HttpOrigin, HttpOriginProps } from './http-origin';
import * as elbv2 from '../../aws-elasticloadbalancingv2';

/**
 * Properties for an Origin backed by a v2 load balancer.
 */
export interface LoadBalancerV2OriginProps extends HttpOriginProps { }

/**
 * An Origin for a v2 load balancer.
 */
export class LoadBalancerV2Origin extends HttpOrigin {

  constructor(loadBalancer: elbv2.ILoadBalancerV2, props: LoadBalancerV2OriginProps = {}) {
    super(loadBalancer.loadBalancerDnsName, { ...props });
  }

}
