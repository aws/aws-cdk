import { CfnListener, CfnListenerRule } from '../elasticloadbalancingv2.generated';

/**
 * Interface for listener actions
 */
export interface IListenerAction {
  /**
   * Render the listener default actions in this chain
   */
  renderActions(): CfnListener.ActionProperty[];
  /**
   * Render the listener rule actions in this chain
   */
  renderRuleActions(): CfnListenerRule.ActionProperty[];
}
