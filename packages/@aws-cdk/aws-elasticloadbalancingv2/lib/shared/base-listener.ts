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
    // I'd like to throw here but there might be existing programs that happen
    // to work even though they followed an illegal call pattern. Just add a warning.
    if (this.defaultAction) {
      this.node.addWarning('A default Action already existed on this Listener and was replaced. Configure exactly one default Action.');
    }

    this.defaultAction = action;
  }
}
