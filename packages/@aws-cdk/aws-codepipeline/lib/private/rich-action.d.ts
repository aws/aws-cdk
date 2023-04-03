import * as events from '@aws-cdk/aws-events';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ActionBindOptions, ActionConfig, ActionProperties, IAction, IPipeline, IStage } from '../action';
/**
 * Helper routines to work with Actions
 *
 * Can't put these on Action themselves since we only have an interface
 * and every library would need to reimplement everything (there is no
 * `ActionBase`).
 *
 * So here go the members that should have gone onto the Action class
 * but can't.
 *
 * It was probably my own idea but I don't want it anymore:
 * https://github.com/aws/aws-cdk/issues/10393
 */
export declare class RichAction implements IAction {
    private readonly action;
    private readonly pipeline;
    readonly actionProperties: ActionProperties;
    constructor(action: IAction, pipeline: IPipeline);
    bind(scope: Construct, stage: IStage, options: ActionBindOptions): ActionConfig;
    onStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule;
    get isCrossRegion(): boolean;
    get isCrossAccount(): boolean;
    /**
     * Returns the Stack of the resource backing this action
     * if they belong to the same environment.
     * Returns `undefined` if either this action is not backed by a resource,
     * or if the resource does not belong to the same env as its Stack
     * (which can happen for imported resources).
     */
    get resourceStack(): Stack | undefined;
    /**
     * The region this action wants to execute in.
     * `undefined` means it wants to execute in the same region as the pipeline.
     */
    get effectiveRegion(): string | undefined;
    /**
     * The account this action wants to execute in.
     * `undefined` means it wants to execute in the same account as the pipeline.
     */
    get effectiveAccount(): string | undefined;
}
