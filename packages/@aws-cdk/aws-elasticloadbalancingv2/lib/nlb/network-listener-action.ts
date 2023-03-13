import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { INetworkListener } from './network-listener';
import { INetworkTargetGroup } from './network-target-group';
import { CfnListener } from '../elasticloadbalancingv2.generated';
import { IListenerAction } from '../shared/listener-action';

/**
 * What to do when a client makes a request to a listener
 *
 * Some actions can be combined with other ones (specifically,
 * you can perform authentication before serving the request).
 *
 * Multiple actions form a linked chain; the chain must always terminate in a
 * *(weighted)forward*, *fixedResponse* or *redirect* action.
 *
 * If an action supports chaining, the next action can be indicated
 * by passing it in the `next` property.
 */
export class NetworkListenerAction implements IListenerAction {
  /**
   * Forward to one or more Target Groups
   */
  public static forward(targetGroups: INetworkTargetGroup[], options: NetworkForwardOptions = {}): NetworkListenerAction {
    if (targetGroups.length === 0) {
      throw new Error('Need at least one targetGroup in a NetworkListenerAction.forward()');
    }
    if (targetGroups.length === 1 && options.stickinessDuration === undefined) {
      // Render a "simple" action for backwards compatibility with old templates
      return new TargetGroupListenerAction(targetGroups, {
        type: 'forward',
        targetGroupArn: targetGroups[0].targetGroupArn,
      });
    }

    return new TargetGroupListenerAction(targetGroups, {
      type: 'forward',
      forwardConfig: {
        targetGroups: targetGroups.map(g => ({ targetGroupArn: g.targetGroupArn })),
        targetGroupStickinessConfig: options.stickinessDuration ? {
          durationSeconds: options.stickinessDuration.toSeconds(),
          enabled: true,
        } : undefined,
      },
    });
  }

  /**
   * Forward to one or more Target Groups which are weighted differently
   */
  public static weightedForward(targetGroups: NetworkWeightedTargetGroup[], options: NetworkForwardOptions = {}): NetworkListenerAction {
    if (targetGroups.length === 0) {
      throw new Error('Need at least one targetGroup in a NetworkListenerAction.weightedForward()');
    }

    return new TargetGroupListenerAction(targetGroups.map(g => g.targetGroup), {
      type: 'forward',
      forwardConfig: {
        targetGroups: targetGroups.map(g => ({ targetGroupArn: g.targetGroup.targetGroupArn, weight: g.weight })),
        targetGroupStickinessConfig: options.stickinessDuration ? {
          durationSeconds: options.stickinessDuration.toSeconds(),
          enabled: true,
        } : undefined,
      },
    });
  }

  /**
   * Create an instance of NetworkListenerAction
   *
   * The default class should be good enough for most cases and
   * should be created by using one of the static factory functions,
   * but allow overriding to make sure we allow flexibility for the future.
   */
  protected constructor(private readonly actionJson: CfnListener.ActionProperty, protected readonly next?: NetworkListenerAction) {
  }

  /**
   * Render the actions in this chain
   */
  public renderActions(): CfnListener.ActionProperty[] {
    return this.renumber([this.actionJson, ...this.next?.renderActions() ?? []]);
  }

  /**
   * Called when the action is being used in a listener
   */
  public bind(scope: Construct, listener: INetworkListener) {
    // Empty on purpose
    Array.isArray(scope);
    Array.isArray(listener);
  }

  /**
   * Renumber the "order" fields in the actions array.
   *
   * We don't number for 0 or 1 elements, but otherwise number them 1...#actions
   * so ELB knows about the right order.
   *
   * Do this in `NetworkListenerAction` instead of in `Listener` so that we give
   * users the opportunity to override by subclassing and overriding `renderActions`.
   */
  protected renumber(actions: CfnListener.ActionProperty[]): CfnListener.ActionProperty[] {
    if (actions.length < 2) { return actions; }

    return actions.map((action, i) => ({ ...action, order: i + 1 }));
  }
}

/**
 * Options for `NetworkListenerAction.forward()`
 */
export interface NetworkForwardOptions {
  /**
   * For how long clients should be directed to the same target group
   *
   * Range between 1 second and 7 days.
   *
   * @default - No stickiness
   */
  readonly stickinessDuration?: Duration;
}

/**
 * A Target Group and weight combination
 */
export interface NetworkWeightedTargetGroup {
  /**
   * The target group
   */
  readonly targetGroup: INetworkTargetGroup;

  /**
   * The target group's weight
   *
   * Range is [0..1000).
   *
   * @default 1
   */
  readonly weight?: number;
}

/**
 * Listener Action that calls "registerListener" on TargetGroups
 */
class TargetGroupListenerAction extends NetworkListenerAction {
  constructor(private readonly targetGroups: INetworkTargetGroup[], actionJson: CfnListener.ActionProperty) {
    super(actionJson);
  }

  public bind(_scope: Construct, listener: INetworkListener) {
    for (const tg of this.targetGroups) {
      tg.registerListener(listener);
    }
  }
}
