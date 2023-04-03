import { CfnListener } from '../elasticloadbalancingv2.generated';
/**
 * Interface for listener actions
 */
export interface IListenerAction {
    /**
     * Render the actions in this chain
     */
    renderActions(): CfnListener.ActionProperty[];
}
