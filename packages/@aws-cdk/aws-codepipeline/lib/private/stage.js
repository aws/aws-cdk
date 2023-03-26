"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stage = void 0;
const events = require("@aws-cdk/aws-events");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const validation = require("./validation");
/**
 * A Stage in a Pipeline.
 *
 * Stages are added to a Pipeline by calling `Pipeline#addStage`,
 * which returns an instance of `codepipeline.IStage`.
 *
 * This class is private to the CodePipeline module.
 */
class Stage {
    /**
     * Create a new Stage.
     */
    constructor(props, pipeline) {
        this._actions = new Array();
        validation.validateName('Stage', props.stageName);
        this.stageName = props.stageName;
        this.transitionToEnabled = props.transitionToEnabled ?? true;
        this.transitionDisabledReason = props.transitionDisabledReason ?? 'Transition disabled';
        this._pipeline = pipeline;
        this.scope = new constructs_1.Construct(pipeline, this.stageName);
        for (const action of props.actions || []) {
            this.addAction(action);
        }
    }
    /**
     * Get a duplicate of this stage's list of actions.
     */
    get actionDescriptors() {
        return this._actions.slice();
    }
    get actions() {
        return this._actions.map(actionDescriptor => actionDescriptor.action);
    }
    get pipeline() {
        return this._pipeline;
    }
    render() {
        // first, assign names to output Artifacts who don't have one
        for (const action of this._actions) {
            const outputArtifacts = action.outputs;
            const unnamedOutputs = outputArtifacts.filter(o => !o.artifactName);
            for (const outputArtifact of outputArtifacts) {
                if (!outputArtifact.artifactName) {
                    const unsanitizedArtifactName = `Artifact_${this.stageName}_${action.actionName}` + (unnamedOutputs.length === 1
                        ? ''
                        : '_' + (unnamedOutputs.indexOf(outputArtifact) + 1));
                    const artifactName = sanitizeArtifactName(unsanitizedArtifactName);
                    outputArtifact._setName(artifactName);
                }
            }
        }
        return {
            name: this.stageName,
            actions: this._actions.map(action => this.renderAction(action)),
        };
    }
    addAction(action) {
        const actionName = action.actionProperties.actionName;
        // validate the name
        validation.validateName('Action', actionName);
        // check for duplicate Actions and names
        if (this._actions.find(a => a.actionName === actionName)) {
            throw new Error(`Stage ${this.stageName} already contains an action with name '${actionName}'`);
        }
        this._actions.push(this.attachActionToPipeline(action));
    }
    onStateChange(name, target, options) {
        const rule = new events.Rule(this.scope, name, options);
        rule.addTarget(target);
        rule.addEventPattern({
            detailType: ['CodePipeline Stage Execution State Change'],
            source: ['aws.codepipeline'],
            resources: [this.pipeline.pipelineArn],
            detail: {
                stage: [this.stageName],
            },
        });
        return rule;
    }
    validate() {
        return [
            ...this.validateHasActions(),
            ...this.validateActions(),
        ];
    }
    validateHasActions() {
        if (this._actions.length === 0) {
            return [`Stage '${this.stageName}' must have at least one action`];
        }
        return [];
    }
    validateActions() {
        const ret = new Array();
        for (const action of this.actionDescriptors) {
            ret.push(...this.validateAction(action));
        }
        return ret;
    }
    validateAction(action) {
        return validation.validateArtifactBounds('input', action.inputs, action.artifactBounds.minInputs, action.artifactBounds.maxInputs, action.category, action.provider)
            .concat(validation.validateArtifactBounds('output', action.outputs, action.artifactBounds.minOutputs, action.artifactBounds.maxOutputs, action.category, action.provider));
    }
    attachActionToPipeline(action) {
        // notify the Pipeline of the new Action
        //
        // It may be that a construct already exists with the given action name (CDK Pipelines
        // may do this to maintain construct tree compatibility between versions).
        //
        // If so, we simply reuse it.
        let actionScope = constructs_1.Node.of(this.scope).tryFindChild(action.actionProperties.actionName);
        if (!actionScope) {
            let id = action.actionProperties.actionName;
            if (core_1.Token.isUnresolved(id)) {
                id = findUniqueConstructId(this.scope, action.actionProperties.provider);
            }
            actionScope = new constructs_1.Construct(this.scope, id);
        }
        return this._pipeline._attachActionToPipeline(this, action, actionScope);
    }
    renderAction(action) {
        const outputArtifacts = cdk.Lazy.any({ produce: () => this.renderArtifacts(action.outputs) }, { omitEmptyArray: true });
        const inputArtifacts = cdk.Lazy.any({ produce: () => this.renderArtifacts(action.inputs) }, { omitEmptyArray: true });
        return {
            name: action.actionName,
            inputArtifacts,
            outputArtifacts,
            actionTypeId: {
                category: action.category.toString(),
                version: action.version,
                owner: action.owner,
                provider: action.provider,
            },
            configuration: action.configuration,
            runOrder: action.runOrder,
            roleArn: action.role ? action.role.roleArn : undefined,
            region: action.region,
            namespace: action.namespace,
        };
    }
    renderArtifacts(artifacts) {
        return artifacts
            .filter(a => a.artifactName)
            .map(a => ({ name: a.artifactName }));
    }
}
exports.Stage = Stage;
function sanitizeArtifactName(artifactName) {
    // strip out some characters that are legal in Stage and Action names,
    // but not in Artifact names
    return artifactName.replace(/[@.]/g, '');
}
function findUniqueConstructId(scope, prefix) {
    let current = prefix;
    let ctr = 1;
    while (constructs_1.Node.of(scope).tryFindChild(current) !== undefined) {
        current = `${prefix}${++ctr}`;
    }
    return current;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4Q0FBOEM7QUFDOUMscUNBQXFDO0FBQ3JDLHdDQUFzQztBQUN0QywyQ0FBNkM7QUFNN0MsMkNBQTJDO0FBRTNDOzs7Ozs7O0dBT0c7QUFDSCxNQUFhLEtBQUs7SUFXaEI7O09BRUc7SUFDSCxZQUFZLEtBQWlCLEVBQUUsUUFBa0I7UUFMaEMsYUFBUSxHQUFHLElBQUksS0FBSyxFQUF3QixDQUFDO1FBTTVELFVBQVUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVsRCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDakMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUM7UUFDN0QsSUFBSSxDQUFDLHdCQUF3QixHQUFHLEtBQUssQ0FBQyx3QkFBd0IsSUFBSSxxQkFBcUIsQ0FBQztRQUN4RixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksc0JBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXJELEtBQUssTUFBTSxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUU7WUFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN4QjtLQUNGO0lBRUQ7O09BRUc7SUFDSCxJQUFXLGlCQUFpQjtRQUMxQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDOUI7SUFFRCxJQUFXLE9BQU87UUFDaEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENB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d3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElBY3Rpb24sIElQaXBlbGluZSwgSVN0YWdlIH0gZnJvbSAnLi4vYWN0aW9uJztcbmltcG9ydCB7IEFydGlmYWN0IH0gZnJvbSAnLi4vYXJ0aWZhY3QnO1xuaW1wb3J0IHsgQ2ZuUGlwZWxpbmUgfSBmcm9tICcuLi9jb2RlcGlwZWxpbmUuZ2VuZXJhdGVkJztcbmltcG9ydCB7IFBpcGVsaW5lLCBTdGFnZVByb3BzIH0gZnJvbSAnLi4vcGlwZWxpbmUnO1xuaW1wb3J0IHsgRnVsbEFjdGlvbkRlc2NyaXB0b3IgfSBmcm9tICcuL2Z1bGwtYWN0aW9uLWRlc2NyaXB0b3InO1xuaW1wb3J0ICogYXMgdmFsaWRhdGlvbiBmcm9tICcuL3ZhbGlkYXRpb24nO1xuXG4vKipcbiAqIEEgU3RhZ2UgaW4gYSBQaXBlbGluZS5cbiAqXG4gKiBTdGFnZXMgYXJlIGFkZGVkIHRvIGEgUGlwZWxpbmUgYnkgY2FsbGluZyBgUGlwZWxpbmUjYWRkU3RhZ2VgLFxuICogd2hpY2ggcmV0dXJucyBhbiBpbnN0YW5jZSBvZiBgY29kZXBpcGVsaW5lLklTdGFnZWAuXG4gKlxuICogVGhpcyBjbGFzcyBpcyBwcml2YXRlIHRvIHRoZSBDb2RlUGlwZWxpbmUgbW9kdWxlLlxuICovXG5leHBvcnQgY2xhc3MgU3RhZ2UgaW1wbGVtZW50cyBJU3RhZ2Uge1xuICAvKipcbiAgICogVGhlIFBpcGVsaW5lIHRoaXMgU3RhZ2UgaXMgYSBwYXJ0IG9mLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN0YWdlTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgdHJhbnNpdGlvblRvRW5hYmxlZDogYm9vbGVhbjtcbiAgcHVibGljIHJlYWRvbmx5IHRyYW5zaXRpb25EaXNhYmxlZFJlYXNvbjogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IHNjb3BlOiBDb25zdHJ1Y3Q7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3BpcGVsaW5lOiBQaXBlbGluZTtcbiAgcHJpdmF0ZSByZWFkb25seSBfYWN0aW9ucyA9IG5ldyBBcnJheTxGdWxsQWN0aW9uRGVzY3JpcHRvcj4oKTtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IFN0YWdlLlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJvcHM6IFN0YWdlUHJvcHMsIHBpcGVsaW5lOiBQaXBlbGluZSkge1xuICAgIHZhbGlkYXRpb24udmFsaWRhdGVOYW1lKCdTdGFnZScsIHByb3BzLnN0YWdlTmFtZSk7XG5cbiAgICB0aGlzLnN0YWdlTmFtZSA9IHByb3BzLnN0YWdlTmFtZTtcbiAgICB0aGlzLnRyYW5zaXRpb25Ub0VuYWJsZWQgPSBwcm9wcy50cmFuc2l0aW9uVG9FbmFibGVkID8/IHRydWU7XG4gICAgdGhpcy50cmFuc2l0aW9uRGlzYWJsZWRSZWFzb24gPSBwcm9wcy50cmFuc2l0aW9uRGlzYWJsZWRSZWFzb24gPz8gJ1RyYW5zaXRpb24gZGlzYWJsZWQnO1xuICAgIHRoaXMuX3BpcGVsaW5lID0gcGlwZWxpbmU7XG4gICAgdGhpcy5zY29wZSA9IG5ldyBDb25zdHJ1Y3QocGlwZWxpbmUsIHRoaXMuc3RhZ2VOYW1lKTtcblxuICAgIGZvciAoY29uc3QgYWN0aW9uIG9mIHByb3BzLmFjdGlvbnMgfHwgW10pIHtcbiAgICAgIHRoaXMuYWRkQWN0aW9uKGFjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGR1cGxpY2F0ZSBvZiB0aGlzIHN0YWdlJ3MgbGlzdCBvZiBhY3Rpb25zLlxuICAgKi9cbiAgcHVibGljIGdldCBhY3Rpb25EZXNjcmlwdG9ycygpOiBGdWxsQWN0aW9uRGVzY3JpcHRvcltdIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aW9ucy5zbGljZSgpO1xuICB9XG5cbiAgcHVibGljIGdldCBhY3Rpb25zKCk6IElBY3Rpb25bXSB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGlvbnMubWFwKGFjdGlvbkRlc2NyaXB0b3IgPT4gYWN0aW9uRGVzY3JpcHRvci5hY3Rpb24pO1xuICB9XG5cbiAgcHVibGljIGdldCBwaXBlbGluZSgpOiBJUGlwZWxpbmUge1xuICAgIHJldHVybiB0aGlzLl9waXBlbGluZTtcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIoKTogQ2ZuUGlwZWxpbmUuU3RhZ2VEZWNsYXJhdGlvblByb3BlcnR5IHtcbiAgICAvLyBmaXJzdCwgYXNzaWduIG5hbWVzIHRvIG91dHB1dCBBcnRpZmFjdHMgd2hvIGRvbid0IGhhdmUgb25lXG4gICAgZm9yIChjb25zdCBhY3Rpb24gb2YgdGhpcy5fYWN0aW9ucykge1xuICAgICAgY29uc3Qgb3V0cHV0QXJ0aWZhY3RzID0gYWN0aW9uLm91dHB1dHM7XG5cbiAgICAgIGNvbnN0IHVubmFtZWRPdXRwdXRzID0gb3V0cHV0QXJ0aWZhY3RzLmZpbHRlcihvID0+ICFvLmFydGlmYWN0TmFtZSk7XG5cbiAgICAgIGZvciAoY29uc3Qgb3V0cHV0QXJ0aWZhY3Qgb2Ygb3V0cHV0QXJ0aWZhY3RzKSB7XG4gICAgICAgIGlmICghb3V0cHV0QXJ0aWZhY3QuYXJ0aWZhY3ROYW1lKSB7XG4gICAgICAgICAgY29uc3QgdW5zYW5pdGl6ZWRBcnRpZmFjdE5hbWUgPSBgQXJ0aWZhY3RfJHt0aGlzLnN0YWdlTmFtZX1fJHthY3Rpb24uYWN0aW9uTmFtZX1gICsgKHVubmFtZWRPdXRwdXRzLmxlbmd0aCA9PT0gMVxuICAgICAgICAgICAgPyAnJ1xuICAgICAgICAgICAgOiAnXycgKyAodW5uYW1lZE91dHB1dHMuaW5kZXhPZihvdXRwdXRBcnRpZmFjdCkgKyAxKSk7XG4gICAgICAgICAgY29uc3QgYXJ0aWZhY3ROYW1lID0gc2FuaXRpemVBcnRpZmFjdE5hbWUodW5zYW5pdGl6ZWRBcnRpZmFjdE5hbWUpO1xuICAgICAgICAgIChvdXRwdXRBcnRpZmFjdCBhcyBhbnkpLl9zZXROYW1lKGFydGlmYWN0TmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogdGhpcy5zdGFnZU5hbWUsXG4gICAgICBhY3Rpb25zOiB0aGlzLl9hY3Rpb25zLm1hcChhY3Rpb24gPT4gdGhpcy5yZW5kZXJBY3Rpb24oYWN0aW9uKSksXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRBY3Rpb24oYWN0aW9uOiBJQWN0aW9uKTogdm9pZCB7XG4gICAgY29uc3QgYWN0aW9uTmFtZSA9IGFjdGlvbi5hY3Rpb25Qcm9wZXJ0aWVzLmFjdGlvbk5hbWU7XG4gICAgLy8gdmFsaWRhdGUgdGhlIG5hbWVcbiAgICB2YWxpZGF0aW9uLnZhbGlkYXRlTmFtZSgnQWN0aW9uJywgYWN0aW9uTmFtZSk7XG5cbiAgICAvLyBjaGVjayBmb3IgZHVwbGljYXRlIEFjdGlvbnMgYW5kIG5hbWVzXG4gICAgaWYgKHRoaXMuX2FjdGlvbnMuZmluZChhID0+IGEuYWN0aW9uTmFtZSA9PT0gYWN0aW9uTmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU3RhZ2UgJHt0aGlzLnN0YWdlTmFtZX0gYWxyZWFkeSBjb250YWlucyBhbiBhY3Rpb24gd2l0aCBuYW1lICcke2FjdGlvbk5hbWV9J2ApO1xuICAgIH1cblxuICAgIHRoaXMuX2FjdGlvbnMucHVzaCh0aGlzLmF0dGFjaEFjdGlvblRvUGlwZWxpbmUoYWN0aW9uKSk7XG4gIH1cblxuICBwdWJsaWMgb25TdGF0ZUNoYW5nZShuYW1lOiBzdHJpbmcsIHRhcmdldD86IGV2ZW50cy5JUnVsZVRhcmdldCwgb3B0aW9ucz86IGV2ZW50cy5SdWxlUHJvcHMpOiBldmVudHMuUnVsZSB7XG4gICAgY29uc3QgcnVsZSA9IG5ldyBldmVudHMuUnVsZSh0aGlzLnNjb3BlLCBuYW1lLCBvcHRpb25zKTtcbiAgICBydWxlLmFkZFRhcmdldCh0YXJnZXQpO1xuICAgIHJ1bGUuYWRkRXZlbnRQYXR0ZXJuKHtcbiAgICAgIGRldGFpbFR5cGU6IFsnQ29kZVBpcGVsaW5lIFN0YWdlIEV4ZWN1dGlvbiBTdGF0ZSBDaGFuZ2UnXSxcbiAgICAgIHNvdXJjZTogWydhd3MuY29kZXBpcGVsaW5lJ10sXG4gICAgICByZXNvdXJjZXM6IFt0aGlzLnBpcGVsaW5lLnBpcGVsaW5lQXJuXSxcbiAgICAgIGRldGFpbDoge1xuICAgICAgICBzdGFnZTogW3RoaXMuc3RhZ2VOYW1lXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICBwdWJsaWMgdmFsaWRhdGUoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBbXG4gICAgICAuLi50aGlzLnZhbGlkYXRlSGFzQWN0aW9ucygpLFxuICAgICAgLi4udGhpcy52YWxpZGF0ZUFjdGlvbnMoKSxcbiAgICBdO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZUhhc0FjdGlvbnMoKTogc3RyaW5nW10ge1xuICAgIGlmICh0aGlzLl9hY3Rpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFtgU3RhZ2UgJyR7dGhpcy5zdGFnZU5hbWV9JyBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIGFjdGlvbmBdO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlQWN0aW9ucygpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgcmV0ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IGFjdGlvbiBvZiB0aGlzLmFjdGlvbkRlc2NyaXB0b3JzKSB7XG4gICAgICByZXQucHVzaCguLi50aGlzLnZhbGlkYXRlQWN0aW9uKGFjdGlvbikpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZUFjdGlvbihhY3Rpb246IEZ1bGxBY3Rpb25EZXNjcmlwdG9yKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB2YWxpZGF0aW9uLnZhbGlkYXRlQXJ0aWZhY3RCb3VuZHMoJ2lucHV0JywgYWN0aW9uLmlucHV0cywgYWN0aW9uLmFydGlmYWN0Qm91bmRzLm1pbklucHV0cyxcbiAgICAgIGFjdGlvbi5hcnRpZmFjdEJvdW5kcy5tYXhJbnB1dHMsIGFjdGlvbi5jYXRlZ29yeSwgYWN0aW9uLnByb3ZpZGVyKVxuICAgICAgLmNvbmNhdCh2YWxpZGF0aW9uLnZhbGlkYXRlQXJ0aWZhY3RCb3VuZHMoJ291dHB1dCcsIGFjdGlvbi5vdXRwdXRzLCBhY3Rpb24uYXJ0aWZhY3RCb3VuZHMubWluT3V0cHV0cyxcbiAgICAgICAgYWN0aW9uLmFydGlmYWN0Qm91bmRzLm1heE91dHB1dHMsIGFjdGlvbi5jYXRlZ29yeSwgYWN0aW9uLnByb3ZpZGVyKSxcbiAgICAgICk7XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaEFjdGlvblRvUGlwZWxpbmUoYWN0aW9uOiBJQWN0aW9uKTogRnVsbEFjdGlvbkRlc2NyaXB0b3Ige1xuICAgIC8vIG5vdGlmeSB0aGUgUGlwZWxpbmUgb2YgdGhlIG5ldyBBY3Rpb25cbiAgICAvL1xuICAgIC8vIEl0IG1heSBiZSB0aGF0IGEgY29uc3RydWN0IGFscmVhZHkgZXhpc3RzIHdpdGggdGhlIGdpdmVuIGFjdGlvbiBuYW1lIChDREsgUGlwZWxpbmVzXG4gICAgLy8gbWF5IGRvIHRoaXMgdG8gbWFpbnRhaW4gY29uc3RydWN0IHRyZWUgY29tcGF0aWJpbGl0eSBiZXR3ZWVuIHZlcnNpb25zKS5cbiAgICAvL1xuICAgIC8vIElmIHNvLCB3ZSBzaW1wbHkgcmV1c2UgaXQuXG4gICAgbGV0IGFjdGlvblNjb3BlID0gTm9kZS5vZih0aGlzLnNjb3BlKS50cnlGaW5kQ2hpbGQoYWN0aW9uLmFjdGlvblByb3BlcnRpZXMuYWN0aW9uTmFtZSkgYXMgQ29uc3RydWN0IHwgdW5kZWZpbmVkO1xuICAgIGlmICghYWN0aW9uU2NvcGUpIHtcbiAgICAgIGxldCBpZCA9IGFjdGlvbi5hY3Rpb25Qcm9wZXJ0aWVzLmFjdGlvbk5hbWU7XG4gICAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKGlkKSkge1xuICAgICAgICBpZCA9IGZpbmRVbmlxdWVDb25zdHJ1Y3RJZCh0aGlzLnNjb3BlLCBhY3Rpb24uYWN0aW9uUHJvcGVydGllcy5wcm92aWRlcik7XG4gICAgICB9XG4gICAgICBhY3Rpb25TY29wZSA9IG5ldyBDb25zdHJ1Y3QodGhpcy5zY29wZSwgaWQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcGlwZWxpbmUuX2F0dGFjaEFjdGlvblRvUGlwZWxpbmUodGhpcywgYWN0aW9uLCBhY3Rpb25TY29wZSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckFjdGlvbihhY3Rpb246IEZ1bGxBY3Rpb25EZXNjcmlwdG9yKTogQ2ZuUGlwZWxpbmUuQWN0aW9uRGVjbGFyYXRpb25Qcm9wZXJ0eSB7XG4gICAgY29uc3Qgb3V0cHV0QXJ0aWZhY3RzID0gY2RrLkxhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5yZW5kZXJBcnRpZmFjdHMoYWN0aW9uLm91dHB1dHMpIH0sIHsgb21pdEVtcHR5QXJyYXk6IHRydWUgfSk7XG4gICAgY29uc3QgaW5wdXRBcnRpZmFjdHMgPSBjZGsuTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLnJlbmRlckFydGlmYWN0cyhhY3Rpb24uaW5wdXRzKSB9LCB7IG9taXRFbXB0eUFycmF5OiB0cnVlIH0pO1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBhY3Rpb24uYWN0aW9uTmFtZSxcbiAgICAgIGlucHV0QXJ0aWZhY3RzLFxuICAgICAgb3V0cHV0QXJ0aWZhY3RzLFxuICAgICAgYWN0aW9uVHlwZUlkOiB7XG4gICAgICAgIGNhdGVnb3J5OiBhY3Rpb24uY2F0ZWdvcnkudG9TdHJpbmcoKSxcbiAgICAgICAgdmVyc2lvbjogYWN0aW9uLnZlcnNpb24sXG4gICAgICAgIG93bmVyOiBhY3Rpb24ub3duZXIsXG4gICAgICAgIHByb3ZpZGVyOiBhY3Rpb24ucHJvdmlkZXIsXG4gICAgICB9LFxuICAgICAgY29uZmlndXJhdGlvbjogYWN0aW9uLmNvbmZpZ3VyYXRpb24sXG4gICAgICBydW5PcmRlcjogYWN0aW9uLnJ1bk9yZGVyLFxuICAgICAgcm9sZUFybjogYWN0aW9uLnJvbGUgPyBhY3Rpb24ucm9sZS5yb2xlQXJuIDogdW5kZWZpbmVkLFxuICAgICAgcmVnaW9uOiBhY3Rpb24ucmVnaW9uLFxuICAgICAgbmFtZXNwYWNlOiBhY3Rpb24ubmFtZXNwYWNlLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckFydGlmYWN0cyhhcnRpZmFjdHM6IEFydGlmYWN0W10pOiBDZm5QaXBlbGluZS5JbnB1dEFydGlmYWN0UHJvcGVydHlbXSB7XG4gICAgcmV0dXJuIGFydGlmYWN0c1xuICAgICAgLmZpbHRlcihhID0+IGEuYXJ0aWZhY3ROYW1lKVxuICAgICAgLm1hcChhID0+ICh7IG5hbWU6IGEuYXJ0aWZhY3ROYW1lISB9KSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2FuaXRpemVBcnRpZmFjdE5hbWUoYXJ0aWZhY3ROYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBzdHJpcCBvdXQgc29tZSBjaGFyYWN0ZXJzIHRoYXQgYXJlIGxlZ2FsIGluIFN0YWdlIGFuZCBBY3Rpb24gbmFtZXMsXG4gIC8vIGJ1dCBub3QgaW4gQXJ0aWZhY3QgbmFtZXNcbiAgcmV0dXJuIGFydGlmYWN0TmFtZS5yZXBsYWNlKC9bQC5dL2csICcnKTtcbn1cblxuZnVuY3Rpb24gZmluZFVuaXF1ZUNvbnN0cnVjdElkKHNjb3BlOiBDb25zdHJ1Y3QsIHByZWZpeDogc3RyaW5nKSB7XG4gIGxldCBjdXJyZW50ID0gcHJlZml4O1xuICBsZXQgY3RyID0gMTtcbiAgd2hpbGUgKE5vZGUub2Yoc2NvcGUpLnRyeUZpbmRDaGlsZChjdXJyZW50KSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY3VycmVudCA9IGAke3ByZWZpeH0keysrY3RyfWA7XG4gIH1cbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG4iXX0=