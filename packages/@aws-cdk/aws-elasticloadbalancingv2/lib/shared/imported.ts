import * as cdk from '@aws-cdk/core';
import { Construct, DependencyGroup, IDependable } from 'constructs';
import { ITargetGroup, TargetGroupImportProps } from './base-target-group';

/**
 * Base internal class for existing target groups
 */
export abstract class ImportedTargetGroupBase extends Construct implements ITargetGroup {
  /**
   * ARN of the target group
   */
  public readonly targetGroupArn: string;

  /**
   * The name of the target group
   */
  public readonly targetGroupName: string;

  /**
   * A token representing a list of ARNs of the load balancers that route traffic to this target group
   */
  public readonly loadBalancerArns: string;

  /**
   * Return an object to depend on the listeners added to this target group
   */
  public readonly loadBalancerAttached: IDependable = new DependencyGroup();

  constructor(scope: Construct, id: string, props: TargetGroupImportProps) {
    super(scope, id);

    this.targetGroupArn = props.targetGroupArn;
    this.targetGroupName = cdk.Stack.of(scope).splitArn(props.targetGroupArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName!.split('/')[0];
    this.loadBalancerArns = props.loadBalancerArns || cdk.Aws.NO_VALUE;
  }
}
