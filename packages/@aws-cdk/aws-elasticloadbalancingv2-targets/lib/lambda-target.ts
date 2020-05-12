import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';

export class LambdaTarget implements elbv2.IApplicationLoadBalancerTarget {
  /**
   * Create a new Lambda target
   *
   * @param functionArn The Lambda Function to load balance to
   */
  constructor(private readonly fn: lambda.IFunction) {
  }

  /**
   * Register this instance target with a load balancer
   *
   * Don't call this, it is called automatically when you add the target to a
   * load balancer.
   */
  public attachToApplicationTargetGroup(targetGroup: elbv2.IApplicationTargetGroup): elbv2.LoadBalancerTargetProps {
    const grant = this.fn.grantInvoke(new iam.ServicePrincipal('elasticloadbalancing.amazonaws.com'));
    grant.applyBefore(targetGroup);
    return this.attach(targetGroup);
  }

  /**
   * Register this instance target with a load balancer
   *
   * Don't call this, it is called automatically when you add the target to a
   * load balancer.
   */
  public attachToNetworkTargetGroup(targetGroup: elbv2.INetworkTargetGroup): elbv2.LoadBalancerTargetProps {
    const grant = this.fn.grantInvoke(new iam.ServicePrincipal('elasticloadbalancing.amazonaws.com'));
    grant.applyBefore(targetGroup);
    return this.attach(targetGroup);
  }

  private attach(_targetGroup: elbv2.ITargetGroup): elbv2.LoadBalancerTargetProps {
    return {
      targetType: elbv2.TargetType.LAMBDA,
      targetJson: { id: this.fn.functionArn },
    };
  }
}
