import { Construct, Lazy, Resource } from '@aws-cdk/core';
import { CfnListener } from '../elasticloadbalancingv2.generated';
import { ITargetGroup } from './base-target-group';

/**
 * Base class for listeners
 */
export abstract class BaseListener extends Resource {
  /**
   * @attribute
   */
  public readonly listenerArn: string;

  private readonly defaultActions: CfnListener.ActionProperty[] = [];

  constructor(scope: Construct, id: string, additionalProps: any) {
    super(scope, id);

    const resource = new CfnListener(this, 'Resource', {
      ...additionalProps,
      defaultActions: Lazy.anyValue({ produce: () => this.defaultActions }),
    });

    this.listenerArn = resource.ref;
  }

  /**
   * Validate this listener
   */
  protected validate(): string[] {
    if (this.defaultActions.length === 0) {
      return ['Listener needs at least one default target group (call addTargetGroups)'];
    }
    return [];
  }

  /**
   * Add an action to the list of default actions of this listener
   * @internal
   */
  protected _addDefaultAction(action: CfnListener.ActionProperty) {
    this.defaultActions.push(action);
  }

  /**
   * Add a TargetGroup to the list of default actions of this listener
   * @internal
   */
  protected _addDefaultTargetGroup(targetGroup: ITargetGroup) {
    this._addDefaultAction({
      targetGroupArn: targetGroup.targetGroupArn,
      type: 'forward'
    });
  }
}
