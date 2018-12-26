import cdk = require('@aws-cdk/cdk');
import { ITargetGroup, TargetGroupAttributes } from './base-target-group';

/**
 * Base internal class for existing target groups
 */
export abstract class ImportedTargetGroupBase extends cdk.Construct implements ITargetGroup {
  /**
   * ARN of the target group
   */
  public readonly targetGroupArn: string;

  /**
   * A token representing a list of ARNs of the load balancers that route traffic to this target group
   */
  public readonly loadBalancerArns: string;

  constructor(parent: cdk.Construct, id: string, private readonly props: TargetGroupAttributes) {
    super(parent, id);

    this.targetGroupArn = props.targetGroupArn;
    this.loadBalancerArns = props.loadBalancerArns || cdk.Aws.noValue;
  }

  /**
   * Return an object to depend on the listeners added to this target group
   */
  public abstract loadBalancerDependency(): cdk.IDependable;

  public export() {
    return this.props;
  }
}
