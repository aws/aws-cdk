import { CfnListener, CfnListenerRule } from '../elasticloadbalancingv2.generated';

/**
 * Interface for listener actions
 */
export interface IListenerAction {
  /**
   * Render the actions in this chain
   */
  renderActions(): CfnListenerRule.ActionProperty[];
  /**
   * Render the actions in this chain
   */
  renderDefaultActions(): CfnListener.ActionProperty[];
}

/**
 * Properties for listener actions
 */
export interface ListenerActionProps {
  /**
   * Property for actions
   */
  readonly action: CfnListenerRule.ActionProperty
  /**
   * Property for Default actions
   */
  readonly defaultAction: CfnListener.ActionProperty
}