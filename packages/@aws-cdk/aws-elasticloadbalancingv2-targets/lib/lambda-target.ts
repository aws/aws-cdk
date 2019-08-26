import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');

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
  public attachToApplicationTargetGroup(targetGroup: elbv2.ApplicationTargetGroup): elbv2.LoadBalancerTargetProps {
    this.fn.grantInvoke(new iam.ServicePrincipal('elasticloadbalancing.amazonaws.com'));
    return this.attach(targetGroup);
  }

  /**
   * Register this instance target with a load balancer
   *
   * Don't call this, it is called automatically when you add the target to a
   * load balancer.
   */
  public attachToNetworkTargetGroup(targetGroup: elbv2.NetworkTargetGroup): elbv2.LoadBalancerTargetProps {
    this.fn.grantInvoke(new iam.ServicePrincipal('elasticloadbalancing.amazonaws.com'));
    return this.attach(targetGroup);
  }

  private attach(_targetGroup: elbv2.ITargetGroup): elbv2.LoadBalancerTargetProps {
    return {
      targetType: elbv2.TargetType.LAMBDA,
      targetJson: { id: this.fn.functionArn }
    };
  }
}
