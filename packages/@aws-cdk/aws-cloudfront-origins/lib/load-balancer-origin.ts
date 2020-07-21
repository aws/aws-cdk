import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

/**
 * Properties for an Origin backed by a v2 load balancer.
 *
 * @experimental
 */
export interface LoadBalancerV2OriginProps extends cloudfront.HttpOriginOptions { }

/**
 * An Origin for a v2 load balancer.
 *
 * @experimental
 */
export class LoadBalancerV2Origin extends cloudfront.HttpOrigin {

  constructor(loadBalancer: elbv2.ILoadBalancerV2, props: LoadBalancerV2OriginProps = {}) {
    super({
      domainName: loadBalancer.loadBalancerDnsName,
      ...props,
    });
  }

}
