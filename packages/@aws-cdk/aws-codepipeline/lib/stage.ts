import events = require('@aws-cdk/aws-events');
import cdk = require('@aws-cdk/cdk');
import { Action } from './actions';
import { cloudformation } from './codepipeline.generated';
import { Pipeline } from './pipeline';
import validation = require('./validation');

/**
 * The construction properties for {@link Stage}.
 */
export interface StageProps {
    /**
     * Allows specifying where should the newly created {@link Stage}
     * be placed in the Pipeline.
     *
     * @default the stage is added to the end of the Pipeline
     */
    readonly placed?: StagePlacement;
}

/**
 * Allows you to control where to place a new Stage when it's added to the Pipeline.
 * Note that you can provide only one of the below properties -
 * specifying more than one will result in a validation error.
 *
 * @see #rightBeforeStage
 * @see #justAfterStage
 * @see #atIndex
 */
export interface StagePlacement {
    /**
     * Inserts the new Stage as a parent of the given Stage
     * (changing its current parent Stage, if it had one).
     */
    readonly rightBeforeStage?: Stage;

    /**
     * Inserts the new Stage as a child of the given Stage
     * (changing its current child Stage, if it had one).
     */
    readonly justAfterStage?: Stage;

    /**
     * Inserts the new Stage at the given index in the Pipeline,
     * moving the Stage currently at that index,
     * and any subsequent ones, one index down.
     * Indexing starts at 0.
     * The maximum allowed value is {@link Pipeline#stagesLength},
     * which will insert the new Stage at the end of the Pipeline.
     */
    readonly atIndex?: number;
}

/**
 * A stage in a pipeline. Stages are added to a pipeline by constructing a Stage with
 * the pipeline as the first argument to the constructor.
 *
 * @example
 * // add a stage to a pipeline
 * new Stage(pipeline, 'MyStage');
 */
export class Stage extends cdk.Construct {
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
    constructor(parent: Pipeline, name: string, props?: StageProps) {
        super(parent, name, props);
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

    public onStateChange(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
        const rule = new events.EventRule(this.pipeline, name, options);
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
    protected addChild(child: cdk.Construct, name: string) {
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
