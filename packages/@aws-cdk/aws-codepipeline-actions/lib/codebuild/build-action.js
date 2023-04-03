"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeBuildAction = exports.CodeBuildActionType = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codebuild = require("@aws-cdk/aws-codebuild");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const __1 = require("..");
const action_1 = require("../action");
const source_action_1 = require("../codecommit/source-action");
/**
 * The type of the CodeBuild action that determines its CodePipeline Category -
 * Build, or Test.
 * The default is Build.
 */
var CodeBuildActionType;
(function (CodeBuildActionType) {
    /**
     * The action will have the Build Category.
     * This is the default.
     */
    CodeBuildActionType[CodeBuildActionType["BUILD"] = 0] = "BUILD";
    /**
     * The action will have the Test Category.
     */
    CodeBuildActionType[CodeBuildActionType["TEST"] = 1] = "TEST";
})(CodeBuildActionType = exports.CodeBuildActionType || (exports.CodeBuildActionType = {}));
/**
 * CodePipeline build action that uses AWS CodeBuild.
 */
class CodeBuildAction extends action_1.Action {
    constructor(props) {
        super({
            ...props,
            category: props.type === CodeBuildActionType.TEST
                ? codepipeline.ActionCategory.TEST
                : codepipeline.ActionCategory.BUILD,
            provider: 'CodeBuild',
            artifactBounds: { minInputs: 1, maxInputs: 5, minOutputs: 0, maxOutputs: 5 },
            inputs: [props.input, ...props.extraInputs || []],
            resource: props.project,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_CodeBuildActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CodeBuildAction);
            }
            throw error;
        }
        this.props = props;
    }
    /**
     * Reference a CodePipeline variable defined by the CodeBuild project this action points to.
     * Variables in CodeBuild actions are defined using the 'exported-variables' subsection of the 'env'
     * section of the buildspec.
     *
     * @param variableName the name of the variable to reference.
     *   A variable by this name must be present in the 'exported-variables' section of the buildspec
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#build-spec-ref-syntax
     */
    variable(variableName) {
        return this.variableExpression(variableName);
    }
    bound(scope, _stage, options) {
        // check for a cross-account action if there are any outputs
        if ((this.actionProperties.outputs || []).length > 0) {
            const pipelineStack = cdk.Stack.of(scope);
            const projectStack = cdk.Stack.of(this.props.project);
            if (pipelineStack.account !== projectStack.account) {
                throw new Error('A cross-account CodeBuild action cannot have outputs. ' +
                    'This is a known CodeBuild limitation. ' +
                    'See https://github.com/aws/aws-cdk/issues/4169 for details');
            }
        }
        // grant the Pipeline role the required permissions to this Project
        options.role.addToPolicy(new iam.PolicyStatement({
            resources: [this.props.project.projectArn],
            actions: [
                `codebuild:${this.props.executeBatchBuild ? 'BatchGetBuildBatches' : 'BatchGetBuilds'}`,
                `codebuild:${this.props.executeBatchBuild ? 'StartBuildBatch' : 'StartBuild'}`,
                `codebuild:${this.props.executeBatchBuild ? 'StopBuildBatch' : 'StopBuild'}`,
            ],
        }));
        // allow the Project access to the Pipeline's artifact Bucket
        // but only if the project is not imported
        // (ie., has a role) - otherwise, the IAM library throws an error
        if (this.props.project.role) {
            if ((this.actionProperties.outputs || []).length > 0) {
                options.bucket.grantReadWrite(this.props.project);
            }
            else {
                options.bucket.grantRead(this.props.project);
            }
        }
        if (this.props.project instanceof codebuild.Project) {
            this.props.project.bindToCodePipeline(scope, {
                artifactBucket: options.bucket,
            });
        }
        for (const inputArtifact of this.actionProperties.inputs || []) {
            // if any of the inputs come from the CodeStarConnectionsSourceAction
            // with codeBuildCloneOutput=true,
            // grant the Project's Role to use the connection
            const connectionArn = inputArtifact.getMetadata(__1.CodeStarConnectionsSourceAction._CONNECTION_ARN_PROPERTY);
            if (connectionArn) {
                this.props.project.addToRolePolicy(new iam.PolicyStatement({
                    actions: ['codestar-connections:UseConnection'],
                    resources: [connectionArn],
                }));
            }
            // if any of the inputs come from the CodeCommitSourceAction
            // with codeBuildCloneOutput=true,
            // grant the Project's Role git pull access to the repository
            const codecommitRepositoryArn = inputArtifact.getMetadata(source_action_1.CodeCommitSourceAction._FULL_CLONE_ARN_PROPERTY);
            if (codecommitRepositoryArn) {
                this.props.project.addToRolePolicy(new iam.PolicyStatement({
                    actions: ['codecommit:GitPull'],
                    resources: [codecommitRepositoryArn],
                }));
            }
        }
        const configuration = {
            ProjectName: this.props.project.projectName,
            EnvironmentVariables: this.props.environmentVariables &&
                cdk.Stack.of(scope).toJsonString(codebuild.Project.serializeEnvVariables(this.props.environmentVariables, this.props.checkSecretsInPlainTextEnvVariables ?? true, this.props.project)),
        };
        if ((this.actionProperties.inputs || []).length > 1) {
            // lazy, because the Artifact name might be generated lazily
            configuration.PrimarySource = cdk.Lazy.string({ produce: () => this.props.input.artifactName });
        }
        if (this.props.executeBatchBuild) {
            configuration.BatchEnabled = 'true';
            this.props.project.enableBatchBuilds();
            if (this.props.combineBatchBuildArtifacts) {
                configuration.CombineArtifacts = 'true';
            }
        }
        return {
            configuration,
        };
    }
}
exports.CodeBuildAction = CodeBuildAction;
_a = JSII_RTTI_SYMBOL_1;
CodeBuildAction[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.CodeBuildAction", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYnVpbGQtYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQUFvRDtBQUNwRCwwREFBMEQ7QUFDMUQsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUVyQywwQkFBcUQ7QUFDckQsc0NBQW1DO0FBQ25DLCtEQUFxRTtBQUVyRTs7OztHQUlHO0FBQ0gsSUFBWSxtQkFXWDtBQVhELFdBQVksbUJBQW1CO0lBQzdCOzs7T0FHRztJQUNILCtEQUFLLENBQUE7SUFFTDs7T0FFRztJQUNILDZEQUFJLENBQUE7QUFDTixDQUFDLEVBWFcsbUJBQW1CLEdBQW5CLDJCQUFtQixLQUFuQiwyQkFBbUIsUUFXOUI7QUF3RkQ7O0dBRUc7QUFDSCxNQUFhLGVBQWdCLFNBQVEsZUFBTTtJQUd6QyxZQUFZLEtBQTJCO1FBQ3JDLEtBQUssQ0FBQztZQUNKLEdBQUcsS0FBSztZQUNSLFFBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxLQUFLLG1CQUFtQixDQUFDLElBQUk7Z0JBQy9DLENBQUMsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUk7Z0JBQ2xDLENBQUMsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLEtBQUs7WUFDckMsUUFBUSxFQUFFLFdBQVc7WUFDckIsY0FBYyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRTtZQUM1RSxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7WUFDakQsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPO1NBQ3hCLENBQUMsQ0FBQzs7Ozs7OytDQWJNLGVBQWU7Ozs7UUFleEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDcEI7SUFFRDs7Ozs7Ozs7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Q0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUU7WUFDaEMsYUFBYSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUM7WUFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUV2QyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEVBQUU7Z0JBQ3pDLGFBQWEsQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7YUFDekM7U0FDRjtRQUNELE9BQU87WUFDTCxhQUFhO1NBQ2QsQ0FBQztLQUNIOztBQXJISCwwQ0FzSEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVidWlsZCc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENvZGVTdGFyQ29ubmVjdGlvbnNTb3VyY2VBY3Rpb24gfSBmcm9tICcuLic7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb24nO1xuaW1wb3J0IHsgQ29kZUNvbW1pdFNvdXJjZUFjdGlvbiB9IGZyb20gJy4uL2NvZGVjb21taXQvc291cmNlLWFjdGlvbic7XG5cbi8qKlxuICogVGhlIHR5cGUgb2YgdGhlIENvZGVCdWlsZCBhY3Rpb24gdGhhdCBkZXRlcm1pbmVzIGl0cyBDb2RlUGlwZWxpbmUgQ2F0ZWdvcnkgLVxuICogQnVpbGQsIG9yIFRlc3QuXG4gKiBUaGUgZGVmYXVsdCBpcyBCdWlsZC5cbiAqL1xuZXhwb3J0IGVudW0gQ29kZUJ1aWxkQWN0aW9uVHlwZSB7XG4gIC8qKlxuICAgKiBUaGUgYWN0aW9uIHdpbGwgaGF2ZSB0aGUgQnVpbGQgQ2F0ZWdvcnkuXG4gICAqIFRoaXMgaXMgdGhlIGRlZmF1bHQuXG4gICAqL1xuICBCVUlMRCxcblxuICAvKipcbiAgICogVGhlIGFjdGlvbiB3aWxsIGhhdmUgdGhlIFRlc3QgQ2F0ZWdvcnkuXG4gICAqL1xuICBURVNUXG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgb2YgdGhlIGBDb2RlQnVpbGRBY3Rpb24gQ29kZUJ1aWxkIGJ1aWxkIENvZGVQaXBlbGluZSBhY3Rpb25gLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvZGVCdWlsZEFjdGlvblByb3BzIGV4dGVuZHMgY29kZXBpcGVsaW5lLkNvbW1vbkF3c0FjdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBzb3VyY2UgdG8gdXNlIGFzIGlucHV0IGZvciB0aGlzIGFjdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGlucHV0OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3Q7XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIGFkZGl0aW9uYWwgaW5wdXQgQXJ0aWZhY3RzIGZvciB0aGlzIGFjdGlvbi5cbiAgICpcbiAgICogVGhlIGRpcmVjdG9yaWVzIHRoZSBhZGRpdGlvbmFsIGlucHV0cyB3aWxsIGJlIGF2YWlsYWJsZSBhdCBhcmUgYXZhaWxhYmxlXG4gICAqIGR1cmluZyB0aGUgcHJvamVjdCdzIGJ1aWxkIGluIHRoZSBDT0RFQlVJTERfU1JDX0RJUl88YXJ0aWZhY3QtbmFtZT4gZW52aXJvbm1lbnQgdmFyaWFibGVzLlxuICAgKiBUaGUgcHJvamVjdCdzIGJ1aWxkIGFsd2F5cyBzdGFydHMgaW4gdGhlIGRpcmVjdG9yeSB3aXRoIHRoZSBwcmltYXJ5IGlucHV0IGFydGlmYWN0IGNoZWNrZWQgb3V0LFxuICAgKiB0aGUgb25lIHBvaW50ZWQgdG8gYnkgdGhlIGBpbnB1dGAgcHJvcGVydHkuXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uLFxuICAgKiBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL3NhbXBsZS1tdWx0aS1pbi1vdXQuaHRtbCAuXG4gICAqL1xuICByZWFkb25seSBleHRyYUlucHV0cz86IGNvZGVwaXBlbGluZS5BcnRpZmFjdFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgbGlzdCBvZiBvdXRwdXQgQXJ0aWZhY3RzIGZvciB0aGlzIGFjdGlvbi5cbiAgICogKipOb3RlKio6IGlmIHlvdSBzcGVjaWZ5IG1vcmUgdGhhbiBvbmUgb3V0cHV0IEFydGlmYWN0IGhlcmUsXG4gICAqIHlvdSBjYW5ub3QgdXNlIHRoZSBwcmltYXJ5ICdhcnRpZmFjdHMnIHNlY3Rpb24gb2YgdGhlIGJ1aWxkc3BlYztcbiAgICogeW91IGhhdmUgdG8gdXNlIHRoZSAnc2Vjb25kYXJ5LWFydGlmYWN0cycgc2VjdGlvbiBpbnN0ZWFkLlxuICAgKiBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL3NhbXBsZS1tdWx0aS1pbi1vdXQuaHRtbFxuICAgKiBmb3IgZGV0YWlscy5cbiAgICpcbiAgICogQGRlZmF1bHQgdGhlIGFjdGlvbiB3aWxsIG5vdCBoYXZlIGFueSBvdXRwdXRzXG4gICAqL1xuICByZWFkb25seSBvdXRwdXRzPzogY29kZXBpcGVsaW5lLkFydGlmYWN0W107XG5cbiAgLyoqXG4gICAqIFRoZSBhY3Rpb24ncyBQcm9qZWN0LlxuICAgKi9cbiAgcmVhZG9ubHkgcHJvamVjdDogY29kZWJ1aWxkLklQcm9qZWN0O1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB0aGUgYWN0aW9uIHRoYXQgZGV0ZXJtaW5lcyBpdHMgQ29kZVBpcGVsaW5lIENhdGVnb3J5IC1cbiAgICogQnVpbGQsIG9yIFRlc3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IENvZGVCdWlsZEFjdGlvblR5cGUuQlVJTERcbiAgICovXG4gIHJlYWRvbmx5IHR5cGU/OiBDb2RlQnVpbGRBY3Rpb25UeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgZW52aXJvbm1lbnQgdmFyaWFibGVzIHRvIHBhc3MgdG8gdGhlIENvZGVCdWlsZCBwcm9qZWN0IHdoZW4gdGhpcyBhY3Rpb24gZXhlY3V0ZXMuXG4gICAqIElmIGEgdmFyaWFibGUgd2l0aCB0aGUgc2FtZSBuYW1lIHdhcyBzZXQgYm90aCBvbiB0aGUgcHJvamVjdCBsZXZlbCwgYW5kIGhlcmUsXG4gICAqIHRoaXMgdmFsdWUgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gYWRkaXRpb25hbCBlbnZpcm9ubWVudCB2YXJpYWJsZXMgYXJlIHNwZWNpZmllZC5cbiAgICovXG4gIHJlYWRvbmx5IGVudmlyb25tZW50VmFyaWFibGVzPzogeyBbbmFtZTogc3RyaW5nXTogY29kZWJ1aWxkLkJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZSB9O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGNoZWNrIGZvciB0aGUgcHJlc2VuY2Ugb2YgYW55IHNlY3JldHMgaW4gdGhlIGVudmlyb25tZW50IHZhcmlhYmxlcyBvZiB0aGUgZGVmYXVsdCB0eXBlLCBCdWlsZEVudmlyb25tZW50VmFyaWFibGVUeXBlLlBMQUlOVEVYVC5cbiAgICogU2luY2UgdXNpbmcgYSBzZWNyZXQgZm9yIHRoZSB2YWx1ZSBvZiB0aGF0IGtpbmQgb2YgdmFyaWFibGUgd291bGQgcmVzdWx0IGluIGl0IGJlaW5nIGRpc3BsYXllZCBpbiBwbGFpbiB0ZXh0IGluIHRoZSBBV1MgQ29uc29sZSxcbiAgICogdGhlIGNvbnN0cnVjdCB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBpdCBkZXRlY3RzIGEgc2VjcmV0IHdhcyBwYXNzZWQgdGhlcmUuXG4gICAqIFBhc3MgdGhpcyBwcm9wZXJ0eSBhcyBmYWxzZSBpZiB5b3Ugd2FudCB0byBza2lwIHRoaXMgdmFsaWRhdGlvbixcbiAgICogYW5kIGtlZXAgdXNpbmcgYSBzZWNyZXQgaW4gYSBwbGFpbiB0ZXh0IGVudmlyb25tZW50IHZhcmlhYmxlLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBjaGVja1NlY3JldHNJblBsYWluVGV4dEVudlZhcmlhYmxlcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgYSBiYXRjaCBidWlsZC5cbiAgICpcbiAgICogRW5hYmxpbmcgdGhpcyB3aWxsIGVuYWJsZSBiYXRjaCBidWlsZHMgb24gdGhlIENvZGVCdWlsZCBwcm9qZWN0LlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZXhlY3V0ZUJhdGNoQnVpbGQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBDb21iaW5lIHRoZSBidWlsZCBhcnRpZmFjdHMgZm9yIGEgYmF0Y2ggYnVpbGRzLlxuICAgKlxuICAgKiBFbmFibGluZyB0aGlzIHdpbGwgY29tYmluZSB0aGUgYnVpbGQgYXJ0aWZhY3RzIGludG8gdGhlIHNhbWUgbG9jYXRpb24gZm9yIGJhdGNoIGJ1aWxkcy5cbiAgICogSWYgYGV4ZWN1dGVCYXRjaEJ1aWxkYCBpcyBub3Qgc2V0IHRvIGB0cnVlYCwgdGhpcyBwcm9wZXJ0eSBpcyBpZ25vcmVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgY29tYmluZUJhdGNoQnVpbGRBcnRpZmFjdHM/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIENvZGVQaXBlbGluZSBidWlsZCBhY3Rpb24gdGhhdCB1c2VzIEFXUyBDb2RlQnVpbGQuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb2RlQnVpbGRBY3Rpb24gZXh0ZW5kcyBBY3Rpb24ge1xuICBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBDb2RlQnVpbGRBY3Rpb25Qcm9wcztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogQ29kZUJ1aWxkQWN0aW9uUHJvcHMpIHtcbiAgICBzdXBlcih7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGNhdGVnb3J5OiBwcm9wcy50eXBlID09PSBDb2RlQnVpbGRBY3Rpb25UeXBlLlRFU1RcbiAgICAgICAgPyBjb2RlcGlwZWxpbmUuQWN0aW9uQ2F0ZWdvcnkuVEVTVFxuICAgICAgICA6IGNvZGVwaXBlbGluZS5BY3Rpb25DYXRlZ29yeS5CVUlMRCxcbiAgICAgIHByb3ZpZGVyOiAnQ29kZUJ1aWxkJyxcbiAgICAgIGFydGlmYWN0Qm91bmRzOiB7IG1pbklucHV0czogMSwgbWF4SW5wdXRzOiA1LCBtaW5PdXRwdXRzOiAwLCBtYXhPdXRwdXRzOiA1IH0sXG4gICAgICBpbnB1dHM6IFtwcm9wcy5pbnB1dCwgLi4ucHJvcHMuZXh0cmFJbnB1dHMgfHwgW11dLFxuICAgICAgcmVzb3VyY2U6IHByb3BzLnByb2plY3QsXG4gICAgfSk7XG5cbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIH1cblxuICAvKipcbiAgICogUmVmZXJlbmNlIGEgQ29kZVBpcGVsaW5lIHZhcmlhYmxlIGRlZmluZWQgYnkgdGhlIENvZGVCdWlsZCBwcm9qZWN0IHRoaXMgYWN0aW9uIHBvaW50cyB0by5cbiAgICogVmFyaWFibGVzIGluIENvZGVCdWlsZCBhY3Rpb25zIGFyZSBkZWZpbmVkIHVzaW5nIHRoZSAnZXhwb3J0ZWQtdmFyaWFibGVzJyBzdWJzZWN0aW9uIG9mIHRoZSAnZW52J1xuICAgKiBzZWN0aW9uIG9mIHRoZSBidWlsZHNwZWMuXG4gICAqXG4gICAqIEBwYXJhbSB2YXJpYWJsZU5hbWUgdGhlIG5hbWUgb2YgdGhlIHZhcmlhYmxlIHRvIHJlZmVyZW5jZS5cbiAgICogICBBIHZhcmlhYmxlIGJ5IHRoaXMgbmFtZSBtdXN0IGJlIHByZXNlbnQgaW4gdGhlICdleHBvcnRlZC12YXJpYWJsZXMnIHNlY3Rpb24gb2YgdGhlIGJ1aWxkc3BlY1xuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9idWlsZC1zcGVjLXJlZi5odG1sI2J1aWxkLXNwZWMtcmVmLXN5bnRheFxuICAgKi9cbiAgcHVibGljIHZhcmlhYmxlKHZhcmlhYmxlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy52YXJpYWJsZUV4cHJlc3Npb24odmFyaWFibGVOYW1lKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBib3VuZChzY29wZTogQ29uc3RydWN0LCBfc3RhZ2U6IGNvZGVwaXBlbGluZS5JU3RhZ2UsIG9wdGlvbnM6IGNvZGVwaXBlbGluZS5BY3Rpb25CaW5kT3B0aW9ucyk6XG4gIGNvZGVwaXBlbGluZS5BY3Rpb25Db25maWcge1xuICAgIC8vIGNoZWNrIGZvciBhIGNyb3NzLWFjY291bnQgYWN0aW9uIGlmIHRoZXJlIGFyZSBhbnkgb3V0cHV0c1xuICAgIGlmICgodGhpcy5hY3Rpb25Qcm9wZXJ0aWVzLm91dHB1dHMgfHwgW10pLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHBpcGVsaW5lU3RhY2sgPSBjZGsuU3RhY2sub2Yoc2NvcGUpO1xuICAgICAgY29uc3QgcHJvamVjdFN0YWNrID0gY2RrLlN0YWNrLm9mKHRoaXMucHJvcHMucHJvamVjdCk7XG4gICAgICBpZiAocGlwZWxpbmVTdGFjay5hY2NvdW50ICE9PSBwcm9qZWN0U3RhY2suYWNjb3VudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgY3Jvc3MtYWNjb3VudCBDb2RlQnVpbGQgYWN0aW9uIGNhbm5vdCBoYXZlIG91dHB1dHMuICcgK1xuICAgICAgICAgICdUaGlzIGlzIGEga25vd24gQ29kZUJ1aWxkIGxpbWl0YXRpb24uICcgK1xuICAgICAgICAgICdTZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2lzc3Vlcy80MTY5IGZvciBkZXRhaWxzJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZ3JhbnQgdGhlIFBpcGVsaW5lIHJvbGUgdGhlIHJlcXVpcmVkIHBlcm1pc3Npb25zIHRvIHRoaXMgUHJvamVjdFxuICAgIG9wdGlvbnMucm9sZS5hZGRUb1BvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFt0aGlzLnByb3BzLnByb2plY3QucHJvamVjdEFybl0sXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIGBjb2RlYnVpbGQ6JHt0aGlzLnByb3BzLmV4ZWN1dGVCYXRjaEJ1aWxkID8gJ0JhdGNoR2V0QnVpbGRCYXRjaGVzJyA6ICdCYXRjaEdldEJ1aWxkcyd9YCxcbiAgICAgICAgYGNvZGVidWlsZDoke3RoaXMucHJvcHMuZXhlY3V0ZUJhdGNoQnVpbGQgPyAnU3RhcnRCdWlsZEJhdGNoJyA6ICdTdGFydEJ1aWxkJ31gLFxuICAgICAgICBgY29kZWJ1aWxkOiR7dGhpcy5wcm9wcy5leGVjdXRlQmF0Y2hCdWlsZCA/ICdTdG9wQnVpbGRCYXRjaCcgOiAnU3RvcEJ1aWxkJ31gLFxuICAgICAgXSxcbiAgICB9KSk7XG5cbiAgICAvLyBhbGxvdyB0aGUgUHJvamVjdCBhY2Nlc3MgdG8gdGhlIFBpcGVsaW5lJ3MgYXJ0aWZhY3QgQnVja2V0XG4gICAgLy8gYnV0IG9ubHkgaWYgdGhlIHByb2plY3QgaXMgbm90IGltcG9ydGVkXG4gICAgLy8gKGllLiwgaGFzIGEgcm9sZSkgLSBvdGhlcndpc2UsIHRoZSBJQU0gbGlicmFyeSB0aHJvd3MgYW4gZXJyb3JcbiAgICBpZiAodGhpcy5wcm9wcy5wcm9qZWN0LnJvbGUpIHtcbiAgICAgIGlmICgodGhpcy5hY3Rpb25Qcm9wZXJ0aWVzLm91dHB1dHMgfHwgW10pLmxlbmd0aCA+IDApIHtcbiAgICAgICAgb3B0aW9ucy5idWNrZXQuZ3JhbnRSZWFkV3JpdGUodGhpcy5wcm9wcy5wcm9qZWN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMuYnVja2V0LmdyYW50UmVhZCh0aGlzLnByb3BzLnByb2plY3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnByb2plY3QgaW5zdGFuY2VvZiBjb2RlYnVpbGQuUHJvamVjdCkge1xuICAgICAgdGhpcy5wcm9wcy5wcm9qZWN0LmJpbmRUb0NvZGVQaXBlbGluZShzY29wZSwge1xuICAgICAgICBhcnRpZmFjdEJ1Y2tldDogb3B0aW9ucy5idWNrZXQsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGlucHV0QXJ0aWZhY3Qgb2YgdGhpcy5hY3Rpb25Qcm9wZXJ0aWVzLmlucHV0cyB8fCBbXSkge1xuICAgICAgLy8gaWYgYW55IG9mIHRoZSBpbnB1dHMgY29tZSBmcm9tIHRoZSBDb2RlU3RhckNvbm5lY3Rpb25zU291cmNlQWN0aW9uXG4gICAgICAvLyB3aXRoIGNvZGVCdWlsZENsb25lT3V0cHV0PXRydWUsXG4gICAgICAvLyBncmFudCB0aGUgUHJvamVjdCdzIFJvbGUgdG8gdXNlIHRoZSBjb25uZWN0aW9uXG4gICAgICBjb25zdCBjb25uZWN0aW9uQXJuID0gaW5wdXRBcnRpZmFjdC5nZXRNZXRhZGF0YShDb2RlU3RhckNvbm5lY3Rpb25zU291cmNlQWN0aW9uLl9DT05ORUNUSU9OX0FSTl9QUk9QRVJUWSk7XG4gICAgICBpZiAoY29ubmVjdGlvbkFybikge1xuICAgICAgICB0aGlzLnByb3BzLnByb2plY3QuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICBhY3Rpb25zOiBbJ2NvZGVzdGFyLWNvbm5lY3Rpb25zOlVzZUNvbm5lY3Rpb24nXSxcbiAgICAgICAgICByZXNvdXJjZXM6IFtjb25uZWN0aW9uQXJuXSxcbiAgICAgICAgfSkpO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiBhbnkgb2YgdGhlIGlucHV0cyBjb21lIGZyb20gdGhlIENvZGVDb21taXRTb3VyY2VBY3Rpb25cbiAgICAgIC8vIHdpdGggY29kZUJ1aWxkQ2xvbmVPdXRwdXQ9dHJ1ZSxcbiAgICAgIC8vIGdyYW50IHRoZSBQcm9qZWN0J3MgUm9sZSBnaXQgcHVsbCBhY2Nlc3MgdG8gdGhlIHJlcG9zaXRvcnlcbiAgICAgIGNvbnN0IGNvZGVjb21taXRSZXBvc2l0b3J5QXJuID0gaW5wdXRBcnRpZmFjdC5nZXRNZXRhZGF0YShDb2RlQ29tbWl0U291cmNlQWN0aW9uLl9GVUxMX0NMT05FX0FSTl9QUk9QRVJUWSk7XG4gICAgICBpZiAoY29kZWNvbW1pdFJlcG9zaXRvcnlBcm4pIHtcbiAgICAgICAgdGhpcy5wcm9wcy5wcm9qZWN0LmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgYWN0aW9uczogWydjb2RlY29tbWl0OkdpdFB1bGwnXSxcbiAgICAgICAgICByZXNvdXJjZXM6IFtjb2RlY29tbWl0UmVwb3NpdG9yeUFybl0sXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjb25maWd1cmF0aW9uOiBhbnkgPSB7XG4gICAgICBQcm9qZWN0TmFtZTogdGhpcy5wcm9wcy5wcm9qZWN0LnByb2plY3ROYW1lLFxuICAgICAgRW52aXJvbm1lbnRWYXJpYWJsZXM6IHRoaXMucHJvcHMuZW52aXJvbm1lbnRWYXJpYWJsZXMgJiZcbiAgICAgICAgY2RrLlN0YWNrLm9mKHNjb3BlKS50b0pzb25TdHJpbmcoY29kZWJ1aWxkLlByb2plY3Quc2VyaWFsaXplRW52VmFyaWFibGVzKHRoaXMucHJvcHMuZW52aXJvbm1lbnRWYXJpYWJsZXMsXG4gICAgICAgICAgdGhpcy5wcm9wcy5jaGVja1NlY3JldHNJblBsYWluVGV4dEVudlZhcmlhYmxlcyA/PyB0cnVlLCB0aGlzLnByb3BzLnByb2plY3QpKSxcbiAgICB9O1xuICAgIGlmICgodGhpcy5hY3Rpb25Qcm9wZXJ0aWVzLmlucHV0cyB8fCBbXSkubGVuZ3RoID4gMSkge1xuICAgICAgLy8gbGF6eSwgYmVjYXVzZSB0aGUgQXJ0aWZhY3QgbmFtZSBtaWdodCBiZSBnZW5lcmF0ZWQgbGF6aWx5XG4gICAgICBjb25maWd1cmF0aW9uLlByaW1hcnlTb3VyY2UgPSBjZGsuTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLnByb3BzLmlucHV0LmFydGlmYWN0TmFtZSB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMucHJvcHMuZXhlY3V0ZUJhdGNoQnVpbGQpIHtcbiAgICAgIGNvbmZpZ3VyYXRpb24uQmF0Y2hFbmFibGVkID0gJ3RydWUnO1xuICAgICAgdGhpcy5wcm9wcy5wcm9qZWN0LmVuYWJsZUJhdGNoQnVpbGRzKCk7XG5cbiAgICAgIGlmICh0aGlzLnByb3BzLmNvbWJpbmVCYXRjaEJ1aWxkQXJ0aWZhY3RzKSB7XG4gICAgICAgIGNvbmZpZ3VyYXRpb24uQ29tYmluZUFydGlmYWN0cyA9ICd0cnVlJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgfTtcbiAgfVxufVxuIl19