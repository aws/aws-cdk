"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeCommitSourceAction = exports.CodeCommitTrigger = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const targets = require("@aws-cdk/aws-events-targets");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const action_1 = require("../action");
const common_1 = require("../common");
/**
 * How should the CodeCommit Action detect changes.
 * This is the type of the `CodeCommitSourceAction.trigger` property.
 */
var CodeCommitTrigger;
(function (CodeCommitTrigger) {
    /**
     * The Action will never detect changes -
     * the Pipeline it's part of will only begin a run when explicitly started.
     */
    CodeCommitTrigger["NONE"] = "None";
    /**
     * CodePipeline will poll the repository to detect changes.
     */
    CodeCommitTrigger["POLL"] = "Poll";
    /**
     * CodePipeline will use CloudWatch Events to be notified of changes.
     * This is the default method of detecting changes.
     */
    CodeCommitTrigger["EVENTS"] = "Events";
})(CodeCommitTrigger = exports.CodeCommitTrigger || (exports.CodeCommitTrigger = {}));
/**
 * CodePipeline Source that is provided by an AWS CodeCommit repository.
 *
 * If the CodeCommit repository is in a different account, you must use
 * `CodeCommitTrigger.EVENTS` to trigger the pipeline.
 *
 * (That is because the Pipeline structure normally only has a `RepositoryName`
 * field, and that is not enough for the pipeline to locate the repository's
 * source account. However, if the pipeline is triggered via an EventBridge
 * event, the event itself has the full repository ARN in there, allowing the
 * pipeline to locate the repository).
 */
class CodeCommitSourceAction extends action_1.Action {
    constructor(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_CodeCommitSourceActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CodeCommitSourceAction);
            }
            throw error;
        }
        const branch = props.branch ?? 'master';
        if (!branch) {
            throw new Error("'branch' parameter cannot be an empty string");
        }
        if (props.codeBuildCloneOutput === true) {
            props.output.setMetadata(CodeCommitSourceAction._FULL_CLONE_ARN_PROPERTY, props.repository.repositoryArn);
        }
        super({
            ...props,
            resource: props.repository,
            category: codepipeline.ActionCategory.SOURCE,
            provider: 'CodeCommit',
            artifactBounds: common_1.sourceArtifactBounds(),
            outputs: [props.output],
        });
        this.branch = branch;
        this.props = props;
    }
    /** The variables emitted by this action. */
    get variables() {
        return {
            repositoryName: this.variableExpression('RepositoryName'),
            branchName: this.variableExpression('BranchName'),
            authorDate: this.variableExpression('AuthorDate'),
            committerDate: this.variableExpression('CommitterDate'),
            commitId: this.variableExpression('CommitId'),
            commitMessage: this.variableExpression('CommitMessage'),
        };
    }
    bound(_scope, stage, options) {
        const createEvent = this.props.trigger === undefined ||
            this.props.trigger === CodeCommitTrigger.EVENTS;
        if (createEvent) {
            const eventId = this.generateEventId(stage);
            this.props.repository.onCommit(eventId, {
                target: new targets.CodePipeline(stage.pipeline, {
                    eventRole: this.props.eventRole,
                }),
                branches: [this.branch],
                crossStackScope: stage.pipeline,
            });
        }
        // the Action will write the contents of the Git repository to the Bucket,
        // so its Role needs write permissions to the Pipeline Bucket
        options.bucket.grantReadWrite(options.role);
        // when this action is cross-account,
        // the Role needs the s3:PutObjectAcl permission for some not yet fully understood reason
        if (core_1.Token.compareStrings(this.props.repository.env.account, core_1.Stack.of(stage.pipeline).account) === core_1.TokenComparison.DIFFERENT) {
            options.bucket.grantPutAcl(options.role);
        }
        // https://docs.aws.amazon.com/codecommit/latest/userguide/auth-and-access-control-permissions-reference.html#aa-acp
        options.role.addToPrincipalPolicy(new iam.PolicyStatement({
            resources: [this.props.repository.repositoryArn],
            actions: [
                'codecommit:GetBranch',
                'codecommit:GetCommit',
                'codecommit:UploadArchive',
                'codecommit:GetUploadArchiveStatus',
                'codecommit:CancelUploadArchive',
                ...(this.props.codeBuildCloneOutput === true ? ['codecommit:GetRepository'] : []),
            ],
        }));
        return {
            configuration: {
                RepositoryName: this.props.repository.repositoryName,
                BranchName: this.branch,
                PollForSourceChanges: this.props.trigger === CodeCommitTrigger.POLL,
                OutputArtifactFormat: this.props.codeBuildCloneOutput === true
                    ? 'CODEBUILD_CLONE_REF'
                    : undefined,
            },
        };
    }
    generateEventId(stage) {
        const baseId = core_1.Names.nodeUniqueId(stage.pipeline.node);
        if (core_1.Token.isUnresolved(this.branch)) {
            let candidate = '';
            let counter = 0;
            do {
                candidate = this.eventIdFromPrefix(`${baseId}${counter}`);
                counter += 1;
            } while (this.props.repository.node.tryFindChild(candidate) !== undefined);
            return candidate;
        }
        else {
            const branchIdDisambiguator = this.branch === 'master' ? '' : `-${this.branch}-`;
            return this.eventIdFromPrefix(`${baseId}${branchIdDisambiguator}`);
        }
    }
    eventIdFromPrefix(eventIdPrefix) {
        return `${eventIdPrefix}EventRule`;
    }
}
exports.CodeCommitSourceAction = CodeCommitSourceAction;
_a = JSII_RTTI_SYMBOL_1;
CodeCommitSourceAction[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.CodeCommitSourceAction", version: "0.0.0" };
/**
 * The name of the property that holds the ARN of the CodeCommit Repository
 * inside of the CodePipeline Artifact's metadata.
 *
 * @internal
 */
CodeCommitSourceAction._FULL_CLONE_ARN_PROPERTY = 'CodeCommitCloneRepositoryArn';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNvdXJjZS1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsMERBQTBEO0FBQzFELHVEQUF1RDtBQUN2RCx3Q0FBd0M7QUFDeEMsd0NBQXFFO0FBRXJFLHNDQUFtQztBQUNuQyxzQ0FBaUQ7QUFFakQ7OztHQUdHO0FBQ0gsSUFBWSxpQkFpQlg7QUFqQkQsV0FBWSxpQkFBaUI7SUFDM0I7OztPQUdHO0lBQ0gsa0NBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gsa0NBQWEsQ0FBQTtJQUViOzs7T0FHRztJQUNILHNDQUFpQixDQUFBO0FBQ25CLENBQUMsRUFqQlcsaUJBQWlCLEdBQWpCLHlCQUFpQixLQUFqQix5QkFBaUIsUUFpQjVCO0FBeUVEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBYSxzQkFBdUIsU0FBUSxlQUFNO0lBWWhELFlBQVksS0FBa0M7Ozs7OzsrQ0FabkMsc0JBQXNCOzs7O1FBYS9CLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7U0FDakU7UUFFRCxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsS0FBSyxJQUFJLEVBQUU7WUFDdkMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsc0JBQXNCLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUMzRztRQUVELEtBQUssQ0FBQztZQUNKLEdBQUcsS0FBSztZQUNSLFFBQVEsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUMxQixRQUFRLEVBQUUsWUFBWSxDQUFDLGNBQWMsQ0FBQyxNQUFNO1lBQzVDLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLGNBQWMsRUFBRSw2QkFBb0IsRUFBRTtZQUN0QyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1NBQ3hCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQ3BCO0lBRUQsNENBQTRDO0lBQzVDLElBQVcsU0FBUztRQUNsQixPQUFPO1lBQ0wsY0FBYyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQztZQUN6RCxVQUFVLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQztZQUNqRCxVQUFVLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQztZQUNqRCxhQUFhLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQztZQUN2RCxRQUFRLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQztZQUM3QyxhQUFhLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQztTQUN4RCxDQUFDO0tBQ0g7SUFFUyxLQUFLLENBQUMsTUFBaUIsRUFBRSxLQUEwQixFQUFFLE9BQXVDO1FBRXBHLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLFNBQVM7WUFDbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssaUJBQWlCLENBQUMsTUFBTSxDQUFDO1FBQ2xELElBQUksV0FBVyxFQUFFO1lBQ2YsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO2dCQUN0QyxNQUFNLEVBQUUsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7b0JBQy9DLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVM7aUJBQ2hDLENBQUM7Z0JBQ0YsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDdkIsZUFBZSxFQUFFLEtBQUssQ0FBQyxRQUFnQzthQUN4RCxDQUFDLENBQUM7U0FDSjtRQUVELDBFQUEwRTtRQUMxRSw2REFBNkQ7UUFDN0QsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLHFDQUFxQztRQUNyQyx5RkFBeUY7UUFDekYsSUFBSSxZQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssc0JBQWUsQ0FBQyxTQUFTLEVBQUU7WUFDM0gsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFDO1FBRUQsb0hBQW9IO1FBQ3BILE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3hELFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztZQUNoRCxPQUFPLEVBQUU7Z0JBQ1Asc0JBQXNCO2dCQUN0QixzQkFBc0I7Z0JBQ3RCLDBCQUEwQjtnQkFDMUIsbUNBQW1DO2dCQUNuQyxnQ0FBZ0M7Z0JBQ2hDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFDbEY7U0FDRixDQUFDLENBQUMsQ0FBQztRQUVKLE9BQU87WUFDTCxhQUFhLEVBQUU7Z0JBQ2IsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWM7Z0JBQ3BELFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDdkIsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssaUJBQWlCLENBQUMsSUFBSTtnQkFDbkUsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsS0FBSyxJQUFJO29CQUM1RCxDQUFDLENBQUMscUJBQXFCO29CQUN2QixDQUFDLENBQUMsU0FBUzthQUNkO1NBQ0YsQ0FBQztLQUNIO0lBRU8sZUFBZSxDQUFDLEtBQTBCO1FBQ2hELE1BQU0sTUFBTSxHQUFHLFlBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RCxJQUFJLFlBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ25DLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUNuQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFDaEIsR0FBRztnQkFDRCxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsTUFBTSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7Z0JBQzFELE9BQU8sSUFBSSxDQUFDLENBQUM7YUFDZCxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQzNFLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO2FBQU07WUFDTCxNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQ2pGLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsTUFBTSxHQUFHLHFCQUFxQixFQUFFLENBQUMsQ0FBQztTQUNwRTtLQUNGO0lBRU8saUJBQWlCLENBQUMsYUFBcUI7UUFDN0MsT0FBTyxHQUFHLGFBQWEsV0FBVyxDQUFDO0tBQ3BDOztBQWxISCx3REFtSEM7OztBQWxIQzs7Ozs7R0FLRztBQUNvQiwrQ0FBd0IsR0FBRyw4QkFBOEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVjb21taXQgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVjb21taXQnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgdGFyZ2V0cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzLXRhcmdldHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgTmFtZXMsIFN0YWNrLCBUb2tlbiwgVG9rZW5Db21wYXJpc29uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbic7XG5pbXBvcnQgeyBzb3VyY2VBcnRpZmFjdEJvdW5kcyB9IGZyb20gJy4uL2NvbW1vbic7XG5cbi8qKlxuICogSG93IHNob3VsZCB0aGUgQ29kZUNvbW1pdCBBY3Rpb24gZGV0ZWN0IGNoYW5nZXMuXG4gKiBUaGlzIGlzIHRoZSB0eXBlIG9mIHRoZSBgQ29kZUNvbW1pdFNvdXJjZUFjdGlvbi50cmlnZ2VyYCBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGVudW0gQ29kZUNvbW1pdFRyaWdnZXIge1xuICAvKipcbiAgICogVGhlIEFjdGlvbiB3aWxsIG5ldmVyIGRldGVjdCBjaGFuZ2VzIC1cbiAgICogdGhlIFBpcGVsaW5lIGl0J3MgcGFydCBvZiB3aWxsIG9ubHkgYmVnaW4gYSBydW4gd2hlbiBleHBsaWNpdGx5IHN0YXJ0ZWQuXG4gICAqL1xuICBOT05FID0gJ05vbmUnLFxuXG4gIC8qKlxuICAgKiBDb2RlUGlwZWxpbmUgd2lsbCBwb2xsIHRoZSByZXBvc2l0b3J5IHRvIGRldGVjdCBjaGFuZ2VzLlxuICAgKi9cbiAgUE9MTCA9ICdQb2xsJyxcblxuICAvKipcbiAgICogQ29kZVBpcGVsaW5lIHdpbGwgdXNlIENsb3VkV2F0Y2ggRXZlbnRzIHRvIGJlIG5vdGlmaWVkIG9mIGNoYW5nZXMuXG4gICAqIFRoaXMgaXMgdGhlIGRlZmF1bHQgbWV0aG9kIG9mIGRldGVjdGluZyBjaGFuZ2VzLlxuICAgKi9cbiAgRVZFTlRTID0gJ0V2ZW50cycsXG59XG5cbi8qKlxuICogVGhlIENvZGVQaXBlbGluZSB2YXJpYWJsZXMgZW1pdHRlZCBieSB0aGUgQ29kZUNvbW1pdCBzb3VyY2UgQWN0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvZGVDb21taXRTb3VyY2VWYXJpYWJsZXMge1xuICAvKiogVGhlIG5hbWUgb2YgdGhlIHJlcG9zaXRvcnkgdGhpcyBhY3Rpb24gcG9pbnRzIHRvLiAqL1xuICByZWFkb25seSByZXBvc2l0b3J5TmFtZTogc3RyaW5nO1xuXG4gIC8qKiBUaGUgbmFtZSBvZiB0aGUgYnJhbmNoIHRoaXMgYWN0aW9uIHRyYWNrcy4gKi9cbiAgcmVhZG9ubHkgYnJhbmNoTmFtZTogc3RyaW5nO1xuXG4gIC8qKiBUaGUgZGF0ZSB0aGUgY3VycmVudGx5IGxhc3QgY29tbWl0IG9uIHRoZSB0cmFja2VkIGJyYW5jaCB3YXMgYXV0aG9yZWQsIGluIElTTy04NjAxIGZvcm1hdC4gKi9cbiAgcmVhZG9ubHkgYXV0aG9yRGF0ZTogc3RyaW5nO1xuXG4gIC8qKiBUaGUgZGF0ZSB0aGUgY3VycmVudGx5IGxhc3QgY29tbWl0IG9uIHRoZSB0cmFja2VkIGJyYW5jaCB3YXMgY29tbWl0dGVkLCBpbiBJU08tODYwMSBmb3JtYXQuICovXG4gIHJlYWRvbmx5IGNvbW1pdHRlckRhdGU6IHN0cmluZztcblxuICAvKiogVGhlIFNIQTEgaGFzaCBvZiB0aGUgY3VycmVudGx5IGxhc3QgY29tbWl0IG9uIHRoZSB0cmFja2VkIGJyYW5jaC4gKi9cbiAgcmVhZG9ubHkgY29tbWl0SWQ6IHN0cmluZztcblxuICAvKiogVGhlIG1lc3NhZ2Ugb2YgdGhlIGN1cnJlbnRseSBsYXN0IGNvbW1pdCBvbiB0aGUgdHJhY2tlZCBicmFuY2guICovXG4gIHJlYWRvbmx5IGNvbW1pdE1lc3NhZ2U6IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBvZiB0aGUgYENvZGVDb21taXRTb3VyY2VBY3Rpb24gQ29kZUNvbW1pdCBzb3VyY2UgQ29kZVBpcGVsaW5lIEFjdGlvbmAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29kZUNvbW1pdFNvdXJjZUFjdGlvblByb3BzIGV4dGVuZHMgY29kZXBpcGVsaW5lLkNvbW1vbkF3c0FjdGlvblByb3BzIHtcbiAgLyoqXG4gICAqXG4gICAqL1xuICByZWFkb25seSBvdXRwdXQ6IGNvZGVwaXBlbGluZS5BcnRpZmFjdDtcblxuICAvKipcbiAgICogQGRlZmF1bHQgJ21hc3RlcidcbiAgICovXG4gIHJlYWRvbmx5IGJyYW5jaD86IHN0cmluZztcblxuICAvKipcbiAgICogSG93IHNob3VsZCBDb2RlUGlwZWxpbmUgZGV0ZWN0IHNvdXJjZSBjaGFuZ2VzIGZvciB0aGlzIEFjdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgQ29kZUNvbW1pdFRyaWdnZXIuRVZFTlRTXG4gICAqL1xuICByZWFkb25seSB0cmlnZ2VyPzogQ29kZUNvbW1pdFRyaWdnZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBDb2RlQ29tbWl0IHJlcG9zaXRvcnkuXG4gICAqL1xuICByZWFkb25seSByZXBvc2l0b3J5OiBjb2RlY29tbWl0LklSZXBvc2l0b3J5O1xuXG4gIC8qKlxuICAgKiBSb2xlIHRvIGJlIHVzZWQgYnkgb24gY29tbWl0IGV2ZW50IHJ1bGUuXG4gICAqIFVzZWQgb25seSB3aGVuIHRyaWdnZXIgdmFsdWUgaXMgQ29kZUNvbW1pdFRyaWdnZXIuRVZFTlRTLlxuICAgKlxuICAgKiBAZGVmYXVsdCBhIG5ldyByb2xlIHdpbGwgYmUgY3JlYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IGV2ZW50Um9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgb3V0cHV0IHNob3VsZCBiZSB0aGUgY29udGVudHMgb2YgdGhlIHJlcG9zaXRvcnlcbiAgICogKHdoaWNoIGlzIHRoZSBkZWZhdWx0KSxcbiAgICogb3IgYSBsaW5rIHRoYXQgYWxsb3dzIENvZGVCdWlsZCB0byBjbG9uZSB0aGUgcmVwb3NpdG9yeSBiZWZvcmUgYnVpbGRpbmcuXG4gICAqXG4gICAqICoqTm90ZSoqOiBpZiB0aGlzIG9wdGlvbiBpcyB0cnVlLFxuICAgKiB0aGVuIG9ubHkgQ29kZUJ1aWxkIGFjdGlvbnMgY2FuIHVzZSB0aGUgcmVzdWx0aW5nIGBvdXRwdXRgLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlcGlwZWxpbmUvbGF0ZXN0L3VzZXJndWlkZS9hY3Rpb24tcmVmZXJlbmNlLUNvZGVDb21taXQuaHRtbFxuICAgKi9cbiAgcmVhZG9ubHkgY29kZUJ1aWxkQ2xvbmVPdXRwdXQ/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIENvZGVQaXBlbGluZSBTb3VyY2UgdGhhdCBpcyBwcm92aWRlZCBieSBhbiBBV1MgQ29kZUNvbW1pdCByZXBvc2l0b3J5LlxuICpcbiAqIElmIHRoZSBDb2RlQ29tbWl0IHJlcG9zaXRvcnkgaXMgaW4gYSBkaWZmZXJlbnQgYWNjb3VudCwgeW91IG11c3QgdXNlXG4gKiBgQ29kZUNvbW1pdFRyaWdnZXIuRVZFTlRTYCB0byB0cmlnZ2VyIHRoZSBwaXBlbGluZS5cbiAqXG4gKiAoVGhhdCBpcyBiZWNhdXNlIHRoZSBQaXBlbGluZSBzdHJ1Y3R1cmUgbm9ybWFsbHkgb25seSBoYXMgYSBgUmVwb3NpdG9yeU5hbWVgXG4gKiBmaWVsZCwgYW5kIHRoYXQgaXMgbm90IGVub3VnaCBmb3IgdGhlIHBpcGVsaW5lIHRvIGxvY2F0ZSB0aGUgcmVwb3NpdG9yeSdzXG4gKiBzb3VyY2UgYWNjb3VudC4gSG93ZXZlciwgaWYgdGhlIHBpcGVsaW5lIGlzIHRyaWdnZXJlZCB2aWEgYW4gRXZlbnRCcmlkZ2VcbiAqIGV2ZW50LCB0aGUgZXZlbnQgaXRzZWxmIGhhcyB0aGUgZnVsbCByZXBvc2l0b3J5IEFSTiBpbiB0aGVyZSwgYWxsb3dpbmcgdGhlXG4gKiBwaXBlbGluZSB0byBsb2NhdGUgdGhlIHJlcG9zaXRvcnkpLlxuICovXG5leHBvcnQgY2xhc3MgQ29kZUNvbW1pdFNvdXJjZUFjdGlvbiBleHRlbmRzIEFjdGlvbiB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdGhhdCBob2xkcyB0aGUgQVJOIG9mIHRoZSBDb2RlQ29tbWl0IFJlcG9zaXRvcnlcbiAgICogaW5zaWRlIG9mIHRoZSBDb2RlUGlwZWxpbmUgQXJ0aWZhY3QncyBtZXRhZGF0YS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IF9GVUxMX0NMT05FX0FSTl9QUk9QRVJUWSA9ICdDb2RlQ29tbWl0Q2xvbmVSZXBvc2l0b3J5QXJuJztcblxuICBwcml2YXRlIHJlYWRvbmx5IGJyYW5jaDogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBDb2RlQ29tbWl0U291cmNlQWN0aW9uUHJvcHM7XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IENvZGVDb21taXRTb3VyY2VBY3Rpb25Qcm9wcykge1xuICAgIGNvbnN0IGJyYW5jaCA9IHByb3BzLmJyYW5jaCA/PyAnbWFzdGVyJztcbiAgICBpZiAoIWJyYW5jaCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ2JyYW5jaCcgcGFyYW1ldGVyIGNhbm5vdCBiZSBhbiBlbXB0eSBzdHJpbmdcIik7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmNvZGVCdWlsZENsb25lT3V0cHV0ID09PSB0cnVlKSB7XG4gICAgICBwcm9wcy5vdXRwdXQuc2V0TWV0YWRhdGEoQ29kZUNvbW1pdFNvdXJjZUFjdGlvbi5fRlVMTF9DTE9ORV9BUk5fUFJPUEVSVFksIHByb3BzLnJlcG9zaXRvcnkucmVwb3NpdG9yeUFybik7XG4gICAgfVxuXG4gICAgc3VwZXIoe1xuICAgICAgLi4ucHJvcHMsXG4gICAgICByZXNvdXJjZTogcHJvcHMucmVwb3NpdG9yeSxcbiAgICAgIGNhdGVnb3J5OiBjb2RlcGlwZWxpbmUuQWN0aW9uQ2F0ZWdvcnkuU09VUkNFLFxuICAgICAgcHJvdmlkZXI6ICdDb2RlQ29tbWl0JyxcbiAgICAgIGFydGlmYWN0Qm91bmRzOiBzb3VyY2VBcnRpZmFjdEJvdW5kcygpLFxuICAgICAgb3V0cHV0czogW3Byb3BzLm91dHB1dF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmJyYW5jaCA9IGJyYW5jaDtcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIH1cblxuICAvKiogVGhlIHZhcmlhYmxlcyBlbWl0dGVkIGJ5IHRoaXMgYWN0aW9uLiAqL1xuICBwdWJsaWMgZ2V0IHZhcmlhYmxlcygpOiBDb2RlQ29tbWl0U291cmNlVmFyaWFibGVzIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVwb3NpdG9yeU5hbWU6IHRoaXMudmFyaWFibGVFeHByZXNzaW9uKCdSZXBvc2l0b3J5TmFtZScpLFxuICAgICAgYnJhbmNoTmFtZTogdGhpcy52YXJpYWJsZUV4cHJlc3Npb24oJ0JyYW5jaE5hbWUnKSxcbiAgICAgIGF1dGhvckRhdGU6IHRoaXMudmFyaWFibGVFeHByZXNzaW9uKCdBdXRob3JEYXRlJyksXG4gICAgICBjb21taXR0ZXJEYXRlOiB0aGlzLnZhcmlhYmxlRXhwcmVzc2lvbignQ29tbWl0dGVyRGF0ZScpLFxuICAgICAgY29tbWl0SWQ6IHRoaXMudmFyaWFibGVFeHByZXNzaW9uKCdDb21taXRJZCcpLFxuICAgICAgY29tbWl0TWVzc2FnZTogdGhpcy52YXJpYWJsZUV4cHJlc3Npb24oJ0NvbW1pdE1lc3NhZ2UnKSxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGJvdW5kKF9zY29wZTogQ29uc3RydWN0LCBzdGFnZTogY29kZXBpcGVsaW5lLklTdGFnZSwgb3B0aW9uczogY29kZXBpcGVsaW5lLkFjdGlvbkJpbmRPcHRpb25zKTpcbiAgY29kZXBpcGVsaW5lLkFjdGlvbkNvbmZpZyB7XG4gICAgY29uc3QgY3JlYXRlRXZlbnQgPSB0aGlzLnByb3BzLnRyaWdnZXIgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgdGhpcy5wcm9wcy50cmlnZ2VyID09PSBDb2RlQ29tbWl0VHJpZ2dlci5FVkVOVFM7XG4gICAgaWYgKGNyZWF0ZUV2ZW50KSB7XG4gICAgICBjb25zdCBldmVudElkID0gdGhpcy5nZW5lcmF0ZUV2ZW50SWQoc3RhZ2UpO1xuICAgICAgdGhpcy5wcm9wcy5yZXBvc2l0b3J5Lm9uQ29tbWl0KGV2ZW50SWQsIHtcbiAgICAgICAgdGFyZ2V0OiBuZXcgdGFyZ2V0cy5Db2RlUGlwZWxpbmUoc3RhZ2UucGlwZWxpbmUsIHtcbiAgICAgICAgICBldmVudFJvbGU6IHRoaXMucHJvcHMuZXZlbnRSb2xlLFxuICAgICAgICB9KSxcbiAgICAgICAgYnJhbmNoZXM6IFt0aGlzLmJyYW5jaF0sXG4gICAgICAgIGNyb3NzU3RhY2tTY29wZTogc3RhZ2UucGlwZWxpbmUgYXMgdW5rbm93biBhcyBDb25zdHJ1Y3QsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyB0aGUgQWN0aW9uIHdpbGwgd3JpdGUgdGhlIGNvbnRlbnRzIG9mIHRoZSBHaXQgcmVwb3NpdG9yeSB0byB0aGUgQnVja2V0LFxuICAgIC8vIHNvIGl0cyBSb2xlIG5lZWRzIHdyaXRlIHBlcm1pc3Npb25zIHRvIHRoZSBQaXBlbGluZSBCdWNrZXRcbiAgICBvcHRpb25zLmJ1Y2tldC5ncmFudFJlYWRXcml0ZShvcHRpb25zLnJvbGUpO1xuICAgIC8vIHdoZW4gdGhpcyBhY3Rpb24gaXMgY3Jvc3MtYWNjb3VudCxcbiAgICAvLyB0aGUgUm9sZSBuZWVkcyB0aGUgczM6UHV0T2JqZWN0QWNsIHBlcm1pc3Npb24gZm9yIHNvbWUgbm90IHlldCBmdWxseSB1bmRlcnN0b29kIHJlYXNvblxuICAgIGlmIChUb2tlbi5jb21wYXJlU3RyaW5ncyh0aGlzLnByb3BzLnJlcG9zaXRvcnkuZW52LmFjY291bnQsIFN0YWNrLm9mKHN0YWdlLnBpcGVsaW5lKS5hY2NvdW50KSA9PT0gVG9rZW5Db21wYXJpc29uLkRJRkZFUkVOVCkge1xuICAgICAgb3B0aW9ucy5idWNrZXQuZ3JhbnRQdXRBY2wob3B0aW9ucy5yb2xlKTtcbiAgICB9XG5cbiAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWNvbW1pdC9sYXRlc3QvdXNlcmd1aWRlL2F1dGgtYW5kLWFjY2Vzcy1jb250cm9sLXBlcm1pc3Npb25zLXJlZmVyZW5jZS5odG1sI2FhLWFjcFxuICAgIG9wdGlvbnMucm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFt0aGlzLnByb3BzLnJlcG9zaXRvcnkucmVwb3NpdG9yeUFybl0sXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgICdjb2RlY29tbWl0OkdldEJyYW5jaCcsXG4gICAgICAgICdjb2RlY29tbWl0OkdldENvbW1pdCcsXG4gICAgICAgICdjb2RlY29tbWl0OlVwbG9hZEFyY2hpdmUnLFxuICAgICAgICAnY29kZWNvbW1pdDpHZXRVcGxvYWRBcmNoaXZlU3RhdHVzJyxcbiAgICAgICAgJ2NvZGVjb21taXQ6Q2FuY2VsVXBsb2FkQXJjaGl2ZScsXG4gICAgICAgIC4uLih0aGlzLnByb3BzLmNvZGVCdWlsZENsb25lT3V0cHV0ID09PSB0cnVlID8gWydjb2RlY29tbWl0OkdldFJlcG9zaXRvcnknXSA6IFtdKSxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgUmVwb3NpdG9yeU5hbWU6IHRoaXMucHJvcHMucmVwb3NpdG9yeS5yZXBvc2l0b3J5TmFtZSxcbiAgICAgICAgQnJhbmNoTmFtZTogdGhpcy5icmFuY2gsXG4gICAgICAgIFBvbGxGb3JTb3VyY2VDaGFuZ2VzOiB0aGlzLnByb3BzLnRyaWdnZXIgPT09IENvZGVDb21taXRUcmlnZ2VyLlBPTEwsXG4gICAgICAgIE91dHB1dEFydGlmYWN0Rm9ybWF0OiB0aGlzLnByb3BzLmNvZGVCdWlsZENsb25lT3V0cHV0ID09PSB0cnVlXG4gICAgICAgICAgPyAnQ09ERUJVSUxEX0NMT05FX1JFRidcbiAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVFdmVudElkKHN0YWdlOiBjb2RlcGlwZWxpbmUuSVN0YWdlKTogc3RyaW5nIHtcbiAgICBjb25zdCBiYXNlSWQgPSBOYW1lcy5ub2RlVW5pcXVlSWQoc3RhZ2UucGlwZWxpbmUubm9kZSk7XG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZCh0aGlzLmJyYW5jaCkpIHtcbiAgICAgIGxldCBjYW5kaWRhdGUgPSAnJztcbiAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgIGRvIHtcbiAgICAgICAgY2FuZGlkYXRlID0gdGhpcy5ldmVudElkRnJvbVByZWZpeChgJHtiYXNlSWR9JHtjb3VudGVyfWApO1xuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICB9IHdoaWxlICh0aGlzLnByb3BzLnJlcG9zaXRvcnkubm9kZS50cnlGaW5kQ2hpbGQoY2FuZGlkYXRlKSAhPT0gdW5kZWZpbmVkKTtcbiAgICAgIHJldHVybiBjYW5kaWRhdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGJyYW5jaElkRGlzYW1iaWd1YXRvciA9IHRoaXMuYnJhbmNoID09PSAnbWFzdGVyJyA/ICcnIDogYC0ke3RoaXMuYnJhbmNofS1gO1xuICAgICAgcmV0dXJuIHRoaXMuZXZlbnRJZEZyb21QcmVmaXgoYCR7YmFzZUlkfSR7YnJhbmNoSWREaXNhbWJpZ3VhdG9yfWApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXZlbnRJZEZyb21QcmVmaXgoZXZlbnRJZFByZWZpeDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke2V2ZW50SWRQcmVmaXh9RXZlbnRSdWxlYDtcbiAgfVxufVxuIl19