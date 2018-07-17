import { Construct } from '@aws-cdk/cdk';
import { EventRule, EventRuleProps, IEventRuleTarget } from '@aws-cdk/events';
import { Action } from './actions';
import { cloudformation } from './codepipeline.generated';
import { Pipeline } from './pipeline';
import * as validation from './validation';

/**
 * A stage in a pipeline. Stages are added to a pipeline by constructing a Stage with
 * the pipeline as the first argument to the constructor.
 *
 * @example
 * // add a stage to a pipeline
 * new Stage(pipeline, 'MyStage');
 */
export class Stage extends Construct {
    /**
     * The Pipeline this stage is a member of
     */
    public readonly pipeline: Pipeline;
    private readonly _actions = new Array<Action>();

    /**
     * Append a new stage to the pipeline
     *
     * Only a Pipeline can be passed in as a parent because stages should
     * always be attached to a pipeline. It's illogical to construct a Stage
     * with any other parent.
     */
    constructor(parent: Pipeline, name: string) {
        super(parent, name);
        this.pipeline = parent;
        validation.validateName('Stage', name);
    }

    /**
     * Get a duplicate of this stage's list of actions.
     */
    public get actions(): Action[] {
        return this._actions.slice();
    }

    public validate(): string[] {
        return this.validateHasActions();
    }

    public render(): cloudformation.PipelineResource.StageDeclarationProperty {
        return {
            name: this.name,
            actions: this._actions.map(action => action.render())
        };
    }

    public onStateChange(name: string, target?: IEventRuleTarget, options?: EventRuleProps) {
        const rule = new EventRule(this.pipeline, name, options);
        rule.addTarget(target);
        rule.addEventPattern({
            detailType: [ 'CodePipeline Stage Execution State Change' ],
            source: [ 'aws.codepipeline' ],
            resources: [ this.pipeline.pipelineArn ],
            detail: {
                stage: [ this.name ],
            },
        });
        return rule;
    }

    /**
     * If an action is added as a child, add it to the list of actions.
     * TODO: This is a hack that should be removed once the CDK has an
     *       onChildAdded type hook.
     * @override
     * @param child
     * @param name
     */
    protected addChild(child: Construct, name: string) {
        super.addChild(child, name);
        if (child instanceof Action) {
            this._actions.push(child);
        } else {
            throw new Error('Only Actions can be added as children to a Stage');
        }
    }

    private validateHasActions(): string[] {
        if (this._actions.length === 0) {
            return [`Stage '${this.name}' must have at least one action`];
        }
        return [];
    }
}
