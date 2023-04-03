"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubSourceAction = exports.GitHubTrigger = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const action_1 = require("../action");
const common_1 = require("../common");
/**
 * If and how the GitHub source action should be triggered
 */
var GitHubTrigger;
(function (GitHubTrigger) {
    GitHubTrigger["NONE"] = "None";
    GitHubTrigger["POLL"] = "Poll";
    GitHubTrigger["WEBHOOK"] = "WebHook";
})(GitHubTrigger = exports.GitHubTrigger || (exports.GitHubTrigger = {}));
/**
 * Source that is provided by a GitHub repository.
 */
class GitHubSourceAction extends action_1.Action {
    constructor(props) {
        super({
            ...props,
            category: codepipeline.ActionCategory.SOURCE,
            owner: 'ThirdParty',
            provider: 'GitHub',
            artifactBounds: common_1.sourceArtifactBounds(),
            outputs: [props.output],
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_GitHubSourceActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, GitHubSourceAction);
            }
            throw error;
        }
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
            commitUrl: this.variableExpression('CommitUrl'),
        };
    }
    bound(scope, stage, _options) {
        if (!this.props.trigger || this.props.trigger === GitHubTrigger.WEBHOOK) {
            new codepipeline.CfnWebhook(scope, 'WebhookResource', {
                authentication: 'GITHUB_HMAC',
                authenticationConfiguration: {
                    secretToken: this.props.oauthToken.unsafeUnwrap(),
                },
                filters: [
                    {
                        jsonPath: '$.ref',
                        matchEquals: 'refs/heads/{Branch}',
                    },
                ],
                targetAction: this.actionProperties.actionName,
                targetPipeline: stage.pipeline.pipelineName,
                targetPipelineVersion: 1,
                registerWithThirdParty: true,
            });
        }
        return {
            configuration: {
                Owner: this.props.owner,
                Repo: this.props.repo,
                Branch: this.props.branch || 'master',
                OAuthToken: this.props.oauthToken.unsafeUnwrap(),
                PollForSourceChanges: this.props.trigger === GitHubTrigger.POLL,
            },
        };
    }
}
exports.GitHubSourceAction = GitHubSourceAction;
_a = JSII_RTTI_SYMBOL_1;
GitHubSourceAction[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.GitHubSourceAction", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNvdXJjZS1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMERBQTBEO0FBRzFELHNDQUFtQztBQUNuQyxzQ0FBaUQ7QUFFakQ7O0dBRUc7QUFDSCxJQUFZLGFBSVg7QUFKRCxXQUFZLGFBQWE7SUFDdkIsOEJBQWEsQ0FBQTtJQUNiLDhCQUFhLENBQUE7SUFDYixvQ0FBbUIsQ0FBQTtBQUNyQixDQUFDLEVBSlcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUFJeEI7QUFtRkQ7O0dBRUc7QUFDSCxNQUFhLGtCQUFtQixTQUFRLGVBQU07SUFHNUMsWUFBWSxLQUE4QjtRQUN4QyxLQUFLLENBQUM7WUFDSixHQUFHLEtBQUs7WUFDUixRQUFRLEVBQUUsWUFBWSxDQUFDLGNBQWMsQ0FBQyxNQUFNO1lBQzVDLEtBQUssRUFBRSxZQUFZO1lBQ25CLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLGNBQWMsRUFBRSw2QkFBb0IsRUFBRTtZQUN0QyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1NBQ3hCLENBQUMsQ0FBQzs7Ozs7OytDQVhNLGtCQUFrQjs7OztRQWEzQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjtJQUVELDRDQUE0QztJQUM1QyxJQUFXLFNBQVM7UUFDbEIsT0FBTztZQUNMLGNBQWMsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUM7WUFDekQsVUFBVSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUM7WUFDakQsVUFBVSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUM7WUFDakQsYUFBYSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUM7WUFDdkQsUUFBUSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7WUFDN0MsYUFBYSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUM7WUFDdkQsU0FBUyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUM7U0FDaEQsQ0FBQztLQUNIO0lBRVMsS0FBSyxDQUFDLEtBQWdCLEVBQUUsS0FBMEIsRUFBRSxRQUF3QztRQUVwRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssYUFBYSxDQUFDLE9BQU8sRUFBRTtZQUN2RSxJQUFJLFlBQVksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFO2dCQUNwRCxjQUFjLEVBQUUsYUFBYTtnQkFDN0IsMkJBQTJCLEVBQUU7b0JBQzNCLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUU7aUJBQ2xEO2dCQUNELE9BQU8sRUFBRTtvQkFDUDt3QkFDRSxRQUFRLEVBQUUsT0FBTzt3QkFDakIsV0FBVyxFQUFFLHFCQUFxQjtxQkFDbkM7aUJBQ0Y7Z0JBQ0QsWUFBWSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVO2dCQUM5QyxjQUFjLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZO2dCQUMzQyxxQkFBcUIsRUFBRSxDQUFDO2dCQUN4QixzQkFBc0IsRUFBRSxJQUFJO2FBQzdCLENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTztZQUNMLGFBQWEsRUFBRTtnQkFDYixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLO2dCQUN2QixJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJO2dCQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksUUFBUTtnQkFDckMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRTtnQkFDaEQsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssYUFBYSxDQUFDLElBQUk7YUFDaEU7U0FDRixDQUFDO0tBQ0g7O0FBM0RILGdEQTREQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCB7IFNlY3JldFZhbHVlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbic7XG5pbXBvcnQgeyBzb3VyY2VBcnRpZmFjdEJvdW5kcyB9IGZyb20gJy4uL2NvbW1vbic7XG5cbi8qKlxuICogSWYgYW5kIGhvdyB0aGUgR2l0SHViIHNvdXJjZSBhY3Rpb24gc2hvdWxkIGJlIHRyaWdnZXJlZFxuICovXG5leHBvcnQgZW51bSBHaXRIdWJUcmlnZ2VyIHtcbiAgTk9ORSA9ICdOb25lJyxcbiAgUE9MTCA9ICdQb2xsJyxcbiAgV0VCSE9PSyA9ICdXZWJIb29rJyxcbn1cblxuLyoqXG4gKiBUaGUgQ29kZVBpcGVsaW5lIHZhcmlhYmxlcyBlbWl0dGVkIGJ5IEdpdEh1YiBzb3VyY2UgQWN0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEdpdEh1YlNvdXJjZVZhcmlhYmxlcyB7XG4gIC8qKiBUaGUgbmFtZSBvZiB0aGUgcmVwb3NpdG9yeSB0aGlzIGFjdGlvbiBwb2ludHMgdG8uICovXG4gIHJlYWRvbmx5IHJlcG9zaXRvcnlOYW1lOiBzdHJpbmc7XG4gIC8qKiBUaGUgbmFtZSBvZiB0aGUgYnJhbmNoIHRoaXMgYWN0aW9uIHRyYWNrcy4gKi9cbiAgcmVhZG9ubHkgYnJhbmNoTmFtZTogc3RyaW5nO1xuICAvKiogVGhlIGRhdGUgdGhlIGN1cnJlbnRseSBsYXN0IGNvbW1pdCBvbiB0aGUgdHJhY2tlZCBicmFuY2ggd2FzIGF1dGhvcmVkLCBpbiBJU08tODYwMSBmb3JtYXQuICovXG4gIHJlYWRvbmx5IGF1dGhvckRhdGU6IHN0cmluZztcbiAgLyoqIFRoZSBkYXRlIHRoZSBjdXJyZW50bHkgbGFzdCBjb21taXQgb24gdGhlIHRyYWNrZWQgYnJhbmNoIHdhcyBjb21taXR0ZWQsIGluIElTTy04NjAxIGZvcm1hdC4gKi9cbiAgcmVhZG9ubHkgY29tbWl0dGVyRGF0ZTogc3RyaW5nO1xuICAvKiogVGhlIFNIQTEgaGFzaCBvZiB0aGUgY3VycmVudGx5IGxhc3QgY29tbWl0IG9uIHRoZSB0cmFja2VkIGJyYW5jaC4gKi9cbiAgcmVhZG9ubHkgY29tbWl0SWQ6IHN0cmluZztcbiAgLyoqIFRoZSBtZXNzYWdlIG9mIHRoZSBjdXJyZW50bHkgbGFzdCBjb21taXQgb24gdGhlIHRyYWNrZWQgYnJhbmNoLiAqL1xuICByZWFkb25seSBjb21taXRNZXNzYWdlOiBzdHJpbmc7XG4gIC8qKiBUaGUgR2l0SHViIEFQSSBVUkwgb2YgdGhlIGN1cnJlbnRseSBsYXN0IGNvbW1pdCBvbiB0aGUgdHJhY2tlZCBicmFuY2guICovXG4gIHJlYWRvbmx5IGNvbW1pdFVybDogc3RyaW5nO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIG9mIHRoZSBgR2l0SHViU291cmNlQWN0aW9uIEdpdEh1YiBzb3VyY2UgYWN0aW9uYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHaXRIdWJTb3VyY2VBY3Rpb25Qcm9wcyBleHRlbmRzIGNvZGVwaXBlbGluZS5Db21tb25BY3Rpb25Qcm9wcyB7XG4gIC8qKlxuICAgKlxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3Q7XG5cbiAgLyoqXG4gICAqIFRoZSBHaXRIdWIgYWNjb3VudC91c2VyIHRoYXQgb3ducyB0aGUgcmVwby5cbiAgICovXG4gIHJlYWRvbmx5IG93bmVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSByZXBvLCB3aXRob3V0IHRoZSB1c2VybmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IHJlcG86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGJyYW5jaCB0byB1c2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IFwibWFzdGVyXCJcbiAgICovXG4gIHJlYWRvbmx5IGJyYW5jaD86IHN0cmluZztcblxuICAvKipcbiAgICogQSBHaXRIdWIgT0F1dGggdG9rZW4gdG8gdXNlIGZvciBhdXRoZW50aWNhdGlvbi5cbiAgICpcbiAgICogSXQgaXMgcmVjb21tZW5kZWQgdG8gdXNlIGEgU2VjcmV0cyBNYW5hZ2VyIGBTZWNyZXRgIHRvIG9idGFpbiB0aGUgdG9rZW46XG4gICAqXG4gICAqICAgY29uc3Qgb2F1dGggPSBjZGsuU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ215LWdpdGh1Yi10b2tlbicpO1xuICAgKiAgIG5ldyBHaXRIdWJTb3VyY2VBY3Rpb24odGhpcywgJ0dpdEh1YkFjdGlvbicsIHsgb2F1dGhUb2tlbjogb2F1dGgsIC4uLiB9KTtcbiAgICpcbiAgICogSWYgeW91IHJvdGF0ZSB0aGUgdmFsdWUgaW4gdGhlIFNlY3JldCwgeW91IG11c3QgYWxzbyBjaGFuZ2UgYXQgbGVhc3Qgb25lIHByb3BlcnR5XG4gICAqIG9mIHRoZSBDb2RlUGlwZWxpbmUgdG8gZm9yY2UgQ2xvdWRGb3JtYXRpb24gdG8gcmUtcmVhZCB0aGUgc2VjcmV0LlxuICAgKlxuICAgKiBUaGUgR2l0SHViIFBlcnNvbmFsIEFjY2VzcyBUb2tlbiBzaG91bGQgaGF2ZSB0aGVzZSBzY29wZXM6XG4gICAqXG4gICAqICogKipyZXBvKiogLSB0byByZWFkIHRoZSByZXBvc2l0b3J5XG4gICAqICogKiphZG1pbjpyZXBvX2hvb2sqKiAtIGlmIHlvdSBwbGFuIHRvIHVzZSB3ZWJob29rcyAodHJ1ZSBieSBkZWZhdWx0KVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlcGlwZWxpbmUvbGF0ZXN0L3VzZXJndWlkZS9hcHBlbmRpeC1naXRodWItb2F1dGguaHRtbCNHaXRIdWItY3JlYXRlLXBlcnNvbmFsLXRva2VuLUNMSVxuICAgKi9cbiAgcmVhZG9ubHkgb2F1dGhUb2tlbjogU2VjcmV0VmFsdWU7XG5cbiAgLyoqXG4gICAqIEhvdyBBV1MgQ29kZVBpcGVsaW5lIHNob3VsZCBiZSB0cmlnZ2VyZWRcbiAgICpcbiAgICogV2l0aCB0aGUgZGVmYXVsdCB2YWx1ZSBcIldFQkhPT0tcIiwgYSB3ZWJob29rIGlzIGNyZWF0ZWQgaW4gR2l0SHViIHRoYXQgdHJpZ2dlcnMgdGhlIGFjdGlvblxuICAgKiBXaXRoIFwiUE9MTFwiLCBDb2RlUGlwZWxpbmUgcGVyaW9kaWNhbGx5IGNoZWNrcyB0aGUgc291cmNlIGZvciBjaGFuZ2VzXG4gICAqIFdpdGggXCJOb25lXCIsIHRoZSBhY3Rpb24gaXMgbm90IHRyaWdnZXJlZCB0aHJvdWdoIGNoYW5nZXMgaW4gdGhlIHNvdXJjZVxuICAgKlxuICAgKiBUbyB1c2UgYFdFQkhPT0tgLCB5b3VyIEdpdEh1YiBQZXJzb25hbCBBY2Nlc3MgVG9rZW4gc2hvdWxkIGhhdmVcbiAgICogKiphZG1pbjpyZXBvX2hvb2sqKiBzY29wZSAoaW4gYWRkaXRpb24gdG8gdGhlIHJlZ3VsYXIgKipyZXBvKiogc2NvcGUpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBHaXRIdWJUcmlnZ2VyLldFQkhPT0tcbiAgICovXG4gIHJlYWRvbmx5IHRyaWdnZXI/OiBHaXRIdWJUcmlnZ2VyO1xufVxuXG4vKipcbiAqIFNvdXJjZSB0aGF0IGlzIHByb3ZpZGVkIGJ5IGEgR2l0SHViIHJlcG9zaXRvcnkuXG4gKi9cbmV4cG9ydCBjbGFzcyBHaXRIdWJTb3VyY2VBY3Rpb24gZXh0ZW5kcyBBY3Rpb24ge1xuICBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBHaXRIdWJTb3VyY2VBY3Rpb25Qcm9wcztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogR2l0SHViU291cmNlQWN0aW9uUHJvcHMpIHtcbiAgICBzdXBlcih7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGNhdGVnb3J5OiBjb2RlcGlwZWxpbmUuQWN0aW9uQ2F0ZWdvcnkuU09VUkNFLFxuICAgICAgb3duZXI6ICdUaGlyZFBhcnR5JyxcbiAgICAgIHByb3ZpZGVyOiAnR2l0SHViJyxcbiAgICAgIGFydGlmYWN0Qm91bmRzOiBzb3VyY2VBcnRpZmFjdEJvdW5kcygpLFxuICAgICAgb3V0cHV0czogW3Byb3BzLm91dHB1dF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIH1cblxuICAvKiogVGhlIHZhcmlhYmxlcyBlbWl0dGVkIGJ5IHRoaXMgYWN0aW9uLiAqL1xuICBwdWJsaWMgZ2V0IHZhcmlhYmxlcygpOiBHaXRIdWJTb3VyY2VWYXJpYWJsZXMge1xuICAgIHJldHVybiB7XG4gICAgICByZXBvc2l0b3J5TmFtZTogdGhpcy52YXJpYWJsZUV4cHJlc3Npb24oJ1JlcG9zaXRvcnlOYW1lJyksXG4gICAgICBicmFuY2hOYW1lOiB0aGlzLnZhcmlhYmxlRXhwcmVzc2lvbignQnJhbmNoTmFtZScpLFxuICAgICAgYXV0aG9yRGF0ZTogdGhpcy52YXJpYWJsZUV4cHJlc3Npb24oJ0F1dGhvckRhdGUnKSxcbiAgICAgIGNvbW1pdHRlckRhdGU6IHRoaXMudmFyaWFibGVFeHByZXNzaW9uKCdDb21taXR0ZXJEYXRlJyksXG4gICAgICBjb21taXRJZDogdGhpcy52YXJpYWJsZUV4cHJlc3Npb24oJ0NvbW1pdElkJyksXG4gICAgICBjb21taXRNZXNzYWdlOiB0aGlzLnZhcmlhYmxlRXhwcmVzc2lvbignQ29tbWl0TWVzc2FnZScpLFxuICAgICAgY29tbWl0VXJsOiB0aGlzLnZhcmlhYmxlRXhwcmVzc2lvbignQ29tbWl0VXJsJyksXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBib3VuZChzY29wZTogQ29uc3RydWN0LCBzdGFnZTogY29kZXBpcGVsaW5lLklTdGFnZSwgX29wdGlvbnM6IGNvZGVwaXBlbGluZS5BY3Rpb25CaW5kT3B0aW9ucyk6XG4gIGNvZGVwaXBlbGluZS5BY3Rpb25Db25maWcge1xuICAgIGlmICghdGhpcy5wcm9wcy50cmlnZ2VyIHx8IHRoaXMucHJvcHMudHJpZ2dlciA9PT0gR2l0SHViVHJpZ2dlci5XRUJIT09LKSB7XG4gICAgICBuZXcgY29kZXBpcGVsaW5lLkNmbldlYmhvb2soc2NvcGUsICdXZWJob29rUmVzb3VyY2UnLCB7XG4gICAgICAgIGF1dGhlbnRpY2F0aW9uOiAnR0lUSFVCX0hNQUMnLFxuICAgICAgICBhdXRoZW50aWNhdGlvbkNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBzZWNyZXRUb2tlbjogdGhpcy5wcm9wcy5vYXV0aFRva2VuLnVuc2FmZVVud3JhcCgpLCAvLyBTYWZlIHVzYWdlXG4gICAgICAgIH0sXG4gICAgICAgIGZpbHRlcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBqc29uUGF0aDogJyQucmVmJyxcbiAgICAgICAgICAgIG1hdGNoRXF1YWxzOiAncmVmcy9oZWFkcy97QnJhbmNofScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdGFyZ2V0QWN0aW9uOiB0aGlzLmFjdGlvblByb3BlcnRpZXMuYWN0aW9uTmFtZSxcbiAgICAgICAgdGFyZ2V0UGlwZWxpbmU6IHN0YWdlLnBpcGVsaW5lLnBpcGVsaW5lTmFtZSxcbiAgICAgICAgdGFyZ2V0UGlwZWxpbmVWZXJzaW9uOiAxLFxuICAgICAgICByZWdpc3RlcldpdGhUaGlyZFBhcnR5OiB0cnVlLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgT3duZXI6IHRoaXMucHJvcHMub3duZXIsXG4gICAgICAgIFJlcG86IHRoaXMucHJvcHMucmVwbyxcbiAgICAgICAgQnJhbmNoOiB0aGlzLnByb3BzLmJyYW5jaCB8fCAnbWFzdGVyJyxcbiAgICAgICAgT0F1dGhUb2tlbjogdGhpcy5wcm9wcy5vYXV0aFRva2VuLnVuc2FmZVVud3JhcCgpLFxuICAgICAgICBQb2xsRm9yU291cmNlQ2hhbmdlczogdGhpcy5wcm9wcy50cmlnZ2VyID09PSBHaXRIdWJUcmlnZ2VyLlBPTEwsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiJdfQ==