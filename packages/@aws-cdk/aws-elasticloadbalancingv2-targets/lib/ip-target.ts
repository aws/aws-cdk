import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

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
 */
export class IpTarget implements elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget {
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
      targetType: elbv2.TargetType.IP,
      targetJson: { id: this.ipAddress, port: this.port, availabilityZone: this.availabilityZone },
    };
  }
}
