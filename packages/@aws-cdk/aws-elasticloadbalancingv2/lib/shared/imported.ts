import cdk = require('@aws-cdk/cdk');
import { ITargetGroup, TargetGroupImportProps } from './base-target-group';

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

  constructor(scope: cdk.Construct, scid: string, private readonly props: TargetGroupImportProps) {
    super(scope, scid);

    this.targetGroupArn = props.targetGroupArn;
    this.loadBalancerArns = props.loadBalancerArns || new cdk.AwsNoValue().toString();
  }

  /**
   * Return an object to depend on the listeners added to this target group
   */
  public abstract loadBalancerDependency(): cdk.IDependable;

  public export() {
    return this.props;
  }
}
