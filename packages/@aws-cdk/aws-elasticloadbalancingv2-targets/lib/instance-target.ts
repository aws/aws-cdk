import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

/**
 * An EC2 instance that is the target for load balancing
 *
 * If you register a target of this type, you are responsible for making
 * sure the load balancer's security group can connect to the instance.
 */
export class InstanceIdTarget implements elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget {
  /**
   * Create a new Instance target
   *
   * @param instanceId Instance ID of the instance to register to
   * @param port Override the default port for the target group
   */
  constructor(private readonly instanceId: string, private readonly port?: number) {
  }

  /**
   * Register this instance target with a load balancer
   *
   * Don't call this, it is called automatically when you add the target to a
   * load balancer.
   */
  public attachToApplicationTargetGroup(targetGroup: elbv2.IApplicationTargetGroup): elbv2.LoadBalancerTargetProps {
    return this.attach(targetGroup);
  }

  /**
   * Register this instance target with a load balancer
   *
   * Don't call this, it is called automatically when you add the target to a
   * load balancer.
   */
  public attachToNetworkTargetGroup(targetGroup: elbv2.INetworkTargetGroup): elbv2.LoadBalancerTargetProps {
    return this.attach(targetGroup);
  }

  private attach(_targetGroup: elbv2.ITargetGroup): elbv2.LoadBalancerTargetProps {
    return {
      targetType: elbv2.TargetType.INSTANCE,
      targetJson: { id: this.instanceId, port: this.port },
    };
  }
}

export class InstanceTarget extends InstanceIdTarget {
  /**
   * Create a new Instance target
   *
   * @param instance Instance to register to
   * @param port Override the default port for the target group
   */
  constructor(instance: ec2.Instance, port?: number) {
    super(instance.instanceId, port);
  }
}
