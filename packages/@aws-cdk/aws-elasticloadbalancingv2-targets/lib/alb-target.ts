import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

/**
 * A single Application Load Balancer as the target for load balancing.
 */
export class AlbArnTarget implements elbv2.INetworkLoadBalancerTarget {
  /**
   * Create a new ALB target.
   * Note that the ALB must have a listener on the provided target port.
   *
   * @param albArn The ARN of the application load balancer to load balance to
   * @param port The port on which the target is listening
   */
  constructor(private readonly albArn: string, private readonly port: number) {
  }

  /**
   * Register this ALB target with a load balancer
   *
   * Don't call this, it is called automatically when you add the target to a
   * load balancer.
   */
  public attachToNetworkTargetGroup(targetGroup: elbv2.INetworkTargetGroup): elbv2.LoadBalancerTargetProps {
    return this.attach(targetGroup);
  }

  protected attach(_targetGroup: elbv2.ITargetGroup): elbv2.LoadBalancerTargetProps {
    return {
      targetType: elbv2.TargetType.ALB,
      targetJson: { id: this.albArn, port: this.port },
    };
  }
}

/**
 * A single Application Load Balancer as the target for load balancing.
 *
 * @deprecated Use AlbListenerTarget instead.
 */
export class AlbTarget extends AlbArnTarget {
  /**
   * Create a new ALB target.
   *
   * @param alb The application load balancer to load balance to
   * @param port The port on which the target is listening
   *
   * @deprecated Use AlbListenerTarget instead. This target does not automatically
   * add a dependency between the ALB listener and resulting NLB target group, without
   * which may cause stack deployments to fail if the NLB target group is provisioned
   * before the listener has been fully created.
   */
  constructor(alb: elbv2.ApplicationLoadBalancer, port: number) {
    super(alb.loadBalancerArn, port);
  }
}

/**
 * A single Application Load Balancer's listener as the target for load balancing.
 */
export class AlbListenerTarget extends AlbArnTarget {
  /**
   * Create a new ALB target.
   * The associated target group will automatically have a dependency added
   * against the ALB's listener.
   *
   * @param albListener The application load balancer listener to target.
   */
  constructor(private albListener: elbv2.ApplicationListener) {
    super(albListener.loadBalancer.loadBalancerArn, albListener.port);
  }

  protected attach(targetGroup: elbv2.ITargetGroup): elbv2.LoadBalancerTargetProps {
    targetGroup.node.addDependency(this.albListener);
    return super.attach(targetGroup);
  }
}
