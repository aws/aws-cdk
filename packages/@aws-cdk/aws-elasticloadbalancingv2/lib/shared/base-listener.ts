import { Construct, Lazy, Resource } from '@aws-cdk/core';
import { CfnListener } from '../elasticloadbalancingv2.generated';
import { IListenerAction } from './listener-action';

/**
 * Base class for listeners
 */
export abstract class BaseListener extends Resource {
  /**
   * @attribute
   */
  public readonly listenerArn: string;

  private defaultAction?: IListenerAction;

  constructor(scope: Construct, id: string, additionalProps: any) {
    super(scope, id);

    const resource = new CfnListener(this, 'Resource', {
      ...additionalProps,
      defaultActions: Lazy.anyValue({ produce: () => this.defaultAction ? this.defaultAction.renderActions() : [] }),
    });

    this.listenerArn = resource.ref;
  }

  /**
   * Validate this listener
   */
  protected validate(): string[] {
    if (!this.defaultAction) {
      return ['Listener needs at least one default action or target group (call addTargetGroups or addAction)'];
    }
    return [];
  }

  /**
   * Configure the default action
   *
   * @internal
   */
  protected _setDefaultAction(action: IListenerAction) {
    // It might make sense to 'throw' here.
    //
    // However, programs may already exist out there which configured an action twice,
    // in which case the second action accidentally overwrite the initial action, and in some
    // way ended up with a program that did what the author intended. If we were to add throw now,
    // the previously working program would be broken.
    //
    // Instead, signal this through a warning.
    // @deprecate: upon the next major version bump, replace this with a `throw`
    if (this.defaultAction) {
      this.node.addWarning('A default Action already existed on this Listener and was replaced. Configure exactly one default Action.');
    }

    this.defaultAction = action;
  }
}
