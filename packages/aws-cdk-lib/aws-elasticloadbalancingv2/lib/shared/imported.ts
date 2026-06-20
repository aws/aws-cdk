import type { IDependable } from 'constructs';
import { Construct, DependencyGroup } from 'constructs';
import type { ITargetGroup, TargetGroupImportProps } from './base-target-group';
import * as cdk from '../../../core';
import type { aws_elasticloadbalancingv2 } from '../../../interfaces';

/**
 * Base internal class for existing target groups
 */
export abstract class ImportedTargetGroupBase extends Construct implements ITargetGroup {
  /**
   * ARN of the target group
   */
  public readonly targetGroupArn: string;

  /**
   * A reference to this target group
   */
  public get targetGroupRef(): aws_elasticloadbalancingv2.TargetGroupReference {
    return {
      targetGroupArn: this.targetGroupArn,
    };
  }

  /**
   * The environment this resource belongs to
   */
  public get env(): cdk.ResourceEnvironment {
    return cdk.Stack.of(this).env;
  }

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
