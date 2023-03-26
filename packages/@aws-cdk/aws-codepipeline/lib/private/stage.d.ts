import * as events from '@aws-cdk/aws-events';
import { IAction, IPipeline, IStage } from '../action';
import { CfnPipeline } from '../codepipeline.generated';
import { Pipeline, StageProps } from '../pipeline';
import { FullActionDescriptor } from './full-action-descriptor';
/**
 * A Stage in a Pipeline.
 *
 * Stages are added to a Pipeline by calling `Pipeline#addStage`,
 * which returns an instance of `codepipeline.IStage`.
 *
 * This class is private to the CodePipeline module.
 */
export declare class Stage implements IStage {
    /**
     * The Pipeline this Stage is a part of.
     */
    readonly stageName: string;
    readonly transitionToEnabled: boolean;
    readonly transitionDisabledReason: string;
    private readonly scope;
    private readonly _pipeline;
    private readonly _actions;
    /**
     * Create a new Stage.
     */
    constructor(props: StageProps, pipeline: Pipeline);
    /**
     * Get a duplicate of this stage's list of actions.
     */
    get actionDescriptors(): FullActionDescriptor[];
    get actions(): IAction[];
    get pipeline(): IPipeline;
    render(): CfnPipeline.StageDeclarationProperty;
    addAction(action: IAction): void;
    onStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule;
    validate(): string[];
    private validateHasActions;
    private validateActions;
    private validateAction;
    private attachActionToPipeline;
    private renderAction;
    private renderArtifacts;
}
