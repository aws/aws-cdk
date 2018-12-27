import cdk = require('@aws-cdk/cdk');
import { TargetGroupRefProps } from './base-target-group';

/**
 * Base class for existing target groups
 */
export class BaseImportedTargetGroup extends cdk.Construct {
  /**
   * ARN of the target group
   */
  public readonly targetGroupArn: string;

  /**
   * A token representing a list of ARNs of the load balancers that route traffic to this target group
   */
  public readonly loadBalancerArns: string;

  constructor(scope: cdk.Construct, scid: string, props: TargetGroupRefProps) {
    super(scope, scid);

    this.targetGroupArn = props.targetGroupArn;
    this.loadBalancerArns = props.loadBalancerArns || new cdk.AwsNoValue().toString();
  }
}
