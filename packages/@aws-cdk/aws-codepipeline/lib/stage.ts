import actions = require('@aws-cdk/aws-codepipeline-api');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './codepipeline.generated';
import { Pipeline } from './pipeline';

/**
 * The construction properties for {@link Stage}.
 */
export interface StageProps {
    /**
     * The Pipeline to add the newly created Stage to.
     */
    pipeline: Pipeline;
}

/**
 * A Stage in a Pipeline.
 * Stages are added to a Pipeline by constructing a new Stage,
 * and passing the Pipeline it belongs to through the {@link StageProps#pipeline} attribute.
 *
 * @example
 *   // add a Stage to a Pipeline
 *   new Stage(this, 'MyStage', {
 *       pipeline: myPipeline,
 *   });
 */
export class Stage extends cdk.Construct implements actions.IStage {
    /**
     * The Pipeline this Stage is a part of.
     */
    public readonly pipeline: Pipeline;
    public readonly name: string;

    private readonly _actions = new Array<actions.Action>();

    /**
     * Create a new Stage.
     */
    constructor(parent: cdk.Construct, name: string, props: StageProps) {
        super(parent, name);
        this.name = name;
        this.pipeline = props.pipeline;
        actions.validateName('Stage', name);

        this.pipeline._addStage(this);
    }

    /**
     * Get a duplicate of this stage's list of actions.
     */
    public get actions(): actions.Action[] {
        return this._actions.slice();
    }

    public validate(): string[] {
        return this.validateHasActions();
    }

    public grantPipelineBucketReadWrite(identity: iam.IPrincipal): void {
        this.pipeline.artifactBucket.grantReadWrite(identity);
    }

    public render(): cloudformation.PipelineResource.StageDeclarationProperty {
        return {
            name: this.id,
            actions: this._actions.map(action => this.renderAction(action)),
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
                stage: [ this.id ],
            },
        });
        return rule;
    }

    public get pipelineArn(): cdk.Arn {
        return this.pipeline.pipelineArn;
    }

    public get pipelineRole(): iam.Role {
        return this.pipeline.role;
    }

    public _addAction(action: actions.Action): void {
        // _addAction should be idempotent in case a customer ever calls it directly
        if (!this._actions.includes(action)) {
            this._actions.push(action);
        }
    }

    private renderAction(action: actions.Action): cloudformation.PipelineResource.ActionDeclarationProperty {
        return {
            name: action.id,
            inputArtifacts: action.inputArtifacts.map(a => ({ name: a.name })),
            actionTypeId: {
                category: action.category.toString(),
                version: action.version,
                owner: action.owner,
                provider: action.provider,
            },
            configuration: action.configuration,
            outputArtifacts: action.outputArtifacts.map(a => ({ name: a.name })),
            runOrder: action.runOrder,
        };
    }

    private validateHasActions(): string[] {
        if (this._actions.length === 0) {
            return [`Stage '${this.id}' must have at least one action`];
        }
        return [];
    }
}
