import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

/**
 * A single Application Load Balancer as the target for load balancing.
 */
export class AlbArnTarget implements elbv2.INetworkLoadBalancerTarget {
  /**
   * Create a new alb target
   *
   * @param albArn The ARN of the application load balancer to load balance to
   * @param port The port on which the target is listening
   */
  constructor(private readonly albArn: string, private readonly port: number) {
  }

  /**
   * Register this alb target with a load balancer
   *
   * Don't call this, it is called automatically when you add the target to a
   * load balancer.
   */
  public attachToNetworkTargetGroup(targetGroup: elbv2.INetworkTargetGroup): elbv2.LoadBalancerTargetProps {
    return this.attach(targetGroup);
  }

  private attach(_targetGroup: elbv2.ITargetGroup): elbv2.LoadBalancerTargetProps {
    return {
      targetType: elbv2.TargetType.ALB,
      targetJson: { id: this.albArn, port: this.port },
    };
  }
}

/**
 * A single Application Load Balancer as the target for load balancing.
 */
export class AlbTarget extends AlbArnTarget {
  /**
   * @param alb The application load balancer to load balance to
   * @param port The port on which the target is listening
   */
  constructor(alb: elbv2.ApplicationLoadBalancer, port: number) {
    super(alb.loadBalancerArn, port);
  }
}
