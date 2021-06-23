import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ITargetGroup, TargetGroupImportProps } from './base-target-group';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Base internal class for existing target groups
 */
export abstract class ImportedTargetGroupBase extends CoreConstruct implements ITargetGroup {
  /**
   * ARN of the target group
   */
  public readonly targetGroupArn: string;

  /**
   * A token representing a list of ARNs of the load balancers that route traffic to this target group
   */
  public readonly loadBalancerArns: string;

  /**
   * Return an object to depend on the listeners added to this target group
   */
  public readonly loadBalancerAttached: cdk.IDependable = new cdk.ConcreteDependable();

  constructor(scope: Construct, id: string, props: TargetGroupImportProps) {
    super(scope, id);

    this.targetGroupArn = props.targetGroupArn;
    this.loadBalancerArns = props.loadBalancerArns || cdk.Aws.NO_VALUE;
  }
}
