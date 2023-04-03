"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodePipeline = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const util_1 = require("./util");
/**
 * Allows the pipeline to be used as an EventBridge rule target.
 */
class CodePipeline {
    constructor(pipeline, options = {}) {
        this.pipeline = pipeline;
        this.options = options;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_targets_CodePipelineTargetOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CodePipeline);
            }
            throw error;
        }
    }
    bind(_rule, _id) {
        const role = this.options.eventRole || util_1.singletonEventRole(this.pipeline);
        role.addToPrincipalPolicy(new iam.PolicyStatement({
            resources: [this.pipeline.pipelineArn],
            actions: ['codepipeline:StartPipelineExecution'],
        }));
        return {
            ...util_1.bindBaseTargetConfig(this.options),
            id: '',
            arn: this.pipeline.pipelineArn,
            role,
            targetResource: this.pipeline,
        };
    }
}
exports.CodePipeline = CodePipeline;
_a = JSII_RTTI_SYMBOL_1;
CodePipeline[_a] = { fqn: "@aws-cdk/aws-events-targets.CodePipeline", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZXBpcGVsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29kZXBpcGVsaW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLHdDQUF3QztBQUN4QyxpQ0FBbUY7QUFlbkY7O0dBRUc7QUFDSCxNQUFhLFlBQVk7SUFDdkIsWUFDbUIsUUFBZ0MsRUFDaEMsVUFBcUMsRUFBRTtRQUR2QyxhQUFRLEdBQVIsUUFBUSxDQUF3QjtRQUNoQyxZQUFPLEdBQVAsT0FBTyxDQUFnQzs7Ozs7OytDQUgvQyxZQUFZOzs7O0tBSXRCO0lBRU0sSUFBSSxDQUFDLEtBQW1CLEVBQUUsR0FBWTtRQUMzQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSx5QkFBa0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUNoRCxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztZQUN0QyxPQUFPLEVBQUUsQ0FBQyxxQ0FBcUMsQ0FBQztTQUNqRCxDQUFDLENBQUMsQ0FBQztRQUVKLE9BQU87WUFDTCxHQUFHLDJCQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDckMsRUFBRSxFQUFFLEVBQUU7WUFDTixHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXO1lBQzlCLElBQUk7WUFDSixjQUFjLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDOUIsQ0FBQztLQUNIOztBQXBCSCxvQ0FxQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSAnQGF3cy1jZGsvYXdzLWV2ZW50cyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBiaW5kQmFzZVRhcmdldENvbmZpZywgc2luZ2xldG9uRXZlbnRSb2xlLCBUYXJnZXRCYXNlUHJvcHMgfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIEN1c3RvbWl6YXRpb24gb3B0aW9ucyB3aGVuIGNyZWF0aW5nIGEgYENvZGVQaXBlbGluZWAgZXZlbnQgdGFyZ2V0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvZGVQaXBlbGluZVRhcmdldE9wdGlvbnMgZXh0ZW5kcyBUYXJnZXRCYXNlUHJvcHMge1xuICAvKipcbiAgICogVGhlIHJvbGUgdG8gYXNzdW1lIGJlZm9yZSBpbnZva2luZyB0aGUgdGFyZ2V0XG4gICAqIChpLmUuLCB0aGUgcGlwZWxpbmUpIHdoZW4gdGhlIGdpdmVuIHJ1bGUgaXMgdHJpZ2dlcmVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGEgbmV3IHJvbGUgd2lsbCBiZSBjcmVhdGVkXG4gICAqL1xuICByZWFkb25seSBldmVudFJvbGU/OiBpYW0uSVJvbGU7XG59XG5cbi8qKlxuICogQWxsb3dzIHRoZSBwaXBlbGluZSB0byBiZSB1c2VkIGFzIGFuIEV2ZW50QnJpZGdlIHJ1bGUgdGFyZ2V0LlxuICovXG5leHBvcnQgY2xhc3MgQ29kZVBpcGVsaW5lIGltcGxlbWVudHMgZXZlbnRzLklSdWxlVGFyZ2V0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBwaXBlbGluZTogY29kZXBpcGVsaW5lLklQaXBlbGluZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IG9wdGlvbnM6IENvZGVQaXBlbGluZVRhcmdldE9wdGlvbnMgPSB7fSkge1xuICB9XG5cbiAgcHVibGljIGJpbmQoX3J1bGU6IGV2ZW50cy5JUnVsZSwgX2lkPzogc3RyaW5nKTogZXZlbnRzLlJ1bGVUYXJnZXRDb25maWcge1xuICAgIGNvbnN0IHJvbGUgPSB0aGlzLm9wdGlvbnMuZXZlbnRSb2xlIHx8IHNpbmdsZXRvbkV2ZW50Um9sZSh0aGlzLnBpcGVsaW5lKTtcbiAgICByb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogW3RoaXMucGlwZWxpbmUucGlwZWxpbmVBcm5dLFxuICAgICAgYWN0aW9uczogWydjb2RlcGlwZWxpbmU6U3RhcnRQaXBlbGluZUV4ZWN1dGlvbiddLFxuICAgIH0pKTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5iaW5kQmFzZVRhcmdldENvbmZpZyh0aGlzLm9wdGlvbnMpLFxuICAgICAgaWQ6ICcnLFxuICAgICAgYXJuOiB0aGlzLnBpcGVsaW5lLnBpcGVsaW5lQXJuLFxuICAgICAgcm9sZSxcbiAgICAgIHRhcmdldFJlc291cmNlOiB0aGlzLnBpcGVsaW5lLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==