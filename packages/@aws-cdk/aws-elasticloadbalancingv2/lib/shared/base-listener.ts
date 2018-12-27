import cdk = require('@aws-cdk/cdk');
import { CfnListener } from '../elasticloadbalancingv2.generated';
import { ITargetGroup } from './base-target-group';

/**
 * Base class for listeners
 */
export abstract class BaseListener extends cdk.Construct implements cdk.IDependable {
  public readonly dependencyElements: cdk.IDependable[];
  public readonly listenerArn: string;
  private readonly defaultActions: any[] = [];

  constructor(scope: cdk.Construct, scid: string, additionalProps: any) {
    super(scope, scid);

    const resource = new CfnListener(this, 'Resource', {
      ...additionalProps,
      defaultActions: new cdk.Token(() => this.defaultActions),
    });

    this.dependencyElements = [resource];
    this.listenerArn = resource.ref;
  }

  /**
   * Validate this listener
   */
  public validate(): string[] {
    if (this.defaultActions.length === 0) {
      return ['Listener needs at least one default target group (call addTargetGroups)'];
    }
    return [];
  }

  /**
   * Add a TargetGroup to the list of default actions of this listener
   */
  protected _addDefaultTargetGroup(targetGroup: ITargetGroup) {
    this.defaultActions.push({
      targetGroupArn: targetGroup.targetGroupArn,
      type: 'forward'
    });
  }
}
