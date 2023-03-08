import { ITargetGroup, LoadBalancerTargetProps } from './base-target-group';
import { TargetType } from './enums';
import { IApplicationLoadBalancerTarget, IApplicationTargetGroup } from '../alb/application-target-group';
import { INetworkLoadBalancerTarget, INetworkTargetGroup } from '../nlb/network-target-group';

/**
 * An EC2 instance that is the target for load balancing
 *
 * If you register a target of this type, you are responsible for making
 * sure the load balancer's security group can connect to the instance.
 *
 * @deprecated Use IpTarget from the @aws-cdk/aws-elasticloadbalancingv2-targets package instead.
 */
export class InstanceTarget implements IApplicationLoadBalancerTarget, INetworkLoadBalancerTarget {
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
  public attachToApplicationTargetGroup(targetGroup: IApplicationTargetGroup): LoadBalancerTargetProps {
    return this.attach(targetGroup);
  }

  /**
   * Register this instance target with a load balancer
   *
   * Don't call this, it is called automatically when you add the target to a
   * load balancer.
   */
  public attachToNetworkTargetGroup(targetGroup: INetworkTargetGroup): LoadBalancerTargetProps {
    return this.attach(targetGroup);
  }

  private attach(_targetGroup: ITargetGroup): LoadBalancerTargetProps {
    return {
      targetType: TargetType.INSTANCE,
      targetJson: { id: this.instanceId, port: this.port },
    };
  }
}

/**
 * An IP address that is a target for load balancing.
 *
 * Specify IP addresses from the subnets of the virtual private cloud (VPC) for
 * the target group, the RFC 1918 range (10.0.0.0/8, 172.16.0.0/12, and
 * 192.168.0.0/16), and the RFC 6598 range (100.64.0.0/10). You can't specify
 * publicly routable IP addresses.
 *
 * If you register a target of this type, you are responsible for making
 * sure the load balancer's security group can send packets to the IP address.
 *
 * @deprecated Use IpTarget from the @aws-cdk/aws-elasticloadbalancingv2-targets package instead.
 */
export class IpTarget implements IApplicationLoadBalancerTarget, INetworkLoadBalancerTarget {
  /**
   * Create a new IPAddress target
   *
   * The availabilityZone parameter determines whether the target receives
   * traffic from the load balancer nodes in the specified Availability Zone
   * or from all enabled Availability Zones for the load balancer.
   *
   * This parameter is not supported if the target type of the target group
   * is instance. If the IP address is in a subnet of the VPC for the target
   * group, the Availability Zone is automatically detected and this
   * parameter is optional. If the IP address is outside the VPC, this
   * parameter is required.
   *
   * With an Application Load Balancer, if the IP address is outside the VPC
   * for the target group, the only supported value is all.
   *
   * Default is automatic.
   *
   * @param ipAddress The IP Address to load balance to
   * @param port Override the group's default port
   * @param availabilityZone Availability zone to send traffic from
   */
  constructor(private readonly ipAddress: string, private readonly port?: number, private readonly availabilityZone?: string) {
  }

  /**
   * Register this instance target with a load balancer
   *
   * Don't call this, it is called automatically when you add the target to a
   * load balancer.
   */
  public attachToApplicationTargetGroup(targetGroup: IApplicationTargetGroup): LoadBalancerTargetProps {
    return this.attach(targetGroup);
  }

  /**
   * Register this instance target with a load balancer
   *
   * Don't call this, it is called automatically when you add the target to a
   * load balancer.
   */
  public attachToNetworkTargetGroup(targetGroup: INetworkTargetGroup): LoadBalancerTargetProps {
    return this.attach(targetGroup);
  }

  private attach(_targetGroup: ITargetGroup): LoadBalancerTargetProps {
    return {
      targetType: TargetType.IP,
      targetJson: { id: this.ipAddress, port: this.port, availabilityZone: this.availabilityZone },
    };
  }
}
