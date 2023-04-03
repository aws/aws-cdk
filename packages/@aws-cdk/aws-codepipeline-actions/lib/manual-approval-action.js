"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualApprovalAction = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const iam = require("@aws-cdk/aws-iam");
const sns = require("@aws-cdk/aws-sns");
const subs = require("@aws-cdk/aws-sns-subscriptions");
const action_1 = require("./action");
/**
 * Manual approval action.
 */
class ManualApprovalAction extends action_1.Action {
    constructor(props) {
        super({
            ...props,
            category: codepipeline.ActionCategory.APPROVAL,
            provider: 'Manual',
            artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 0, maxOutputs: 0 },
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_ManualApprovalActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ManualApprovalAction);
            }
            throw error;
        }
        this.props = props;
    }
    get notificationTopic() {
        return this._notificationTopic;
    }
    /**
     * grant the provided principal the permissions to approve or reject this manual approval action
     *
     * For more info see:
     * https://docs.aws.amazon.com/codepipeline/latest/userguide/approvals-iam-permissions.html
     *
     * @param grantable the grantable to attach the permissions to
     */
    grantManualApproval(grantable) {
        if (!this.stage) {
            throw new Error('Cannot grant permissions before binding action to a stage');
        }
        grantable.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['codepipeline:ListPipelines'],
            resources: ['*'],
        }));
        grantable.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['codepipeline:GetPipeline', 'codepipeline:GetPipelineState', 'codepipeline:GetPipelineExecution'],
            resources: [this.stage.pipeline.pipelineArn],
        }));
        grantable.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['codepipeline:PutApprovalResult'],
            resources: [`${this.stage.pipeline.pipelineArn}/${this.stage.stageName}/${this.props.actionName}`],
        }));
    }
    bound(scope, stage, options) {
        if (this.props.notificationTopic) {
            this._notificationTopic = this.props.notificationTopic;
        }
        else if ((this.props.notifyEmails || []).length > 0) {
            this._notificationTopic = new sns.Topic(scope, 'TopicResource');
        }
        if (this._notificationTopic) {
            this._notificationTopic.grantPublish(options.role);
            for (const notifyEmail of this.props.notifyEmails || []) {
                this._notificationTopic.addSubscription(new subs.EmailSubscription(notifyEmail));
            }
        }
        this.stage = stage;
        return {
            configuration: undefinedIfAllValuesAreEmpty({
                NotificationArn: this._notificationTopic?.topicArn,
                CustomData: this.props.additionalInformation,
                ExternalEntityLink: this.props.externalEntityLink,
            }),
        };
    }
}
exports.ManualApprovalAction = ManualApprovalAction;
_a = JSII_RTTI_SYMBOL_1;
ManualApprovalAction[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.ManualApprovalAction", version: "0.0.0" };
function undefinedIfAllValuesAreEmpty(object) {
    return Object.values(object).some(v => v !== undefined) ? object : undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFudWFsLWFwcHJvdmFsLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hbnVhbC1hcHByb3ZhbC1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMERBQTBEO0FBQzFELHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsdURBQXVEO0FBRXZELHFDQUFrQztBQStCbEM7O0dBRUc7QUFDSCxNQUFhLG9CQUFxQixTQUFRLGVBQU07SUFVOUMsWUFBWSxLQUFnQztRQUMxQyxLQUFLLENBQUM7WUFDSixHQUFHLEtBQUs7WUFDUixRQUFRLEVBQUUsWUFBWSxDQUFDLGNBQWMsQ0FBQyxRQUFRO1lBQzlDLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLGNBQWMsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUU7U0FDN0UsQ0FBQyxDQUFDOzs7Ozs7K0NBaEJNLG9CQUFvQjs7OztRQWtCN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDcEI7SUFFRCxJQUFXLGlCQUFpQjtRQUMxQixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztLQUNoQztJQUVEOzs7Ozs7O09BT0c7SUFDSSxtQkFBbUIsQ0FBQyxTQUF5QjtRQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztTQUM5RTtRQUNELFNBQVMsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3BFLE9BQU8sRUFBRSxDQUFDLDRCQUE0QixDQUFDO1lBQ3ZDLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNqQixDQUFDLENBQUMsQ0FBQztRQUNKLFNBQVMsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3BFLE9BQU8sRUFBRSxDQUFDLDBCQUEwQixFQUFFLCtCQUErQixFQUFFLG1DQUFtQyxDQUFDO1lBQzNHLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztTQUM3QyxDQUFDLENBQUMsQ0FBQztRQUNKLFNBQVMsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3BFLE9BQU8sRUFBRSxDQUFDLGdDQUFnQyxDQUFDO1lBQzNDLFNBQVMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDbkcsQ0FBQyxDQUFDLENBQUM7S0FDTDtJQUVTLEtBQUssQ0FBQyxLQUFnQixFQUFFLEtBQTBCLEVBQUUsT0FBdUM7UUFDbkcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFO1lBQ2hDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDO1NBQ3hEO2FBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDckQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLENBQUM7U0FDakU7UUFFRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUMzQixJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuRCxLQUFLLE1BQU0sV0FBVyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxJQUFJLEVBQUUsRUFBRTtnQkFDdkQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2FBQ2xGO1NBQ0Y7UUFFRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixPQUFPO1lBQ0wsYUFBYSxFQUFFLDRCQUE0QixDQUFDO2dCQUMxQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLFFBQVE7Z0JBQ2xELFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQjtnQkFDNUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0I7YUFDbEQsQ0FBQztTQUNILENBQUM7S0FDSDs7QUExRUgsb0RBNEVDOzs7QUFFRCxTQUFTLDRCQUE0QixDQUFDLE1BQWM7SUFDbEQsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDL0UsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zJztcbmltcG9ydCAqIGFzIHN1YnMgZnJvbSAnQGF3cy1jZGsvYXdzLXNucy1zdWJzY3JpcHRpb25zJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnLi9hY3Rpb24nO1xuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIG9mIHRoZSBgTWFudWFsQXBwcm92YWxBY3Rpb25gLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hbnVhbEFwcHJvdmFsQWN0aW9uUHJvcHMgZXh0ZW5kcyBjb2RlcGlwZWxpbmUuQ29tbW9uQXdzQWN0aW9uUHJvcHMge1xuICAvKipcbiAgICogT3B0aW9uYWwgU05TIHRvcGljIHRvIHNlbmQgbm90aWZpY2F0aW9ucyB0byB3aGVuIGFuIGFwcHJvdmFsIGlzIHBlbmRpbmcuXG4gICAqL1xuICByZWFkb25seSBub3RpZmljYXRpb25Ub3BpYz86IHNucy5JVG9waWM7XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBlbWFpbCBhZGRyZXNzZXMgdG8gc3Vic2NyaWJlIHRvIG5vdGlmaWNhdGlvbnMgd2hlbiB0aGlzIEFjdGlvbiBpcyBwZW5kaW5nIGFwcHJvdmFsLlxuICAgKiBJZiB0aGlzIGhhcyBiZWVuIHByb3ZpZGVkLCBidXQgbm90IGBub3RpZmljYXRpb25Ub3BpY2AsXG4gICAqIGEgbmV3IFRvcGljIHdpbGwgYmUgY3JlYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IG5vdGlmeUVtYWlscz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBbnkgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiB0aGF0IHlvdSB3YW50IHRvIGluY2x1ZGUgaW4gdGhlIG5vdGlmaWNhdGlvbiBlbWFpbCBtZXNzYWdlLlxuICAgKi9cbiAgcmVhZG9ubHkgYWRkaXRpb25hbEluZm9ybWF0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBVUkwgeW91IHdhbnQgdG8gcHJvdmlkZSB0byB0aGUgcmV2aWV3ZXIgYXMgcGFydCBvZiB0aGUgYXBwcm92YWwgcmVxdWVzdC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgYXBwcm92YWwgcmVxdWVzdCB3aWxsIG5vdCBoYXZlIGFuIGV4dGVybmFsIGxpbmtcbiAgICovXG4gIHJlYWRvbmx5IGV4dGVybmFsRW50aXR5TGluaz86IHN0cmluZztcbn1cblxuLyoqXG4gKiBNYW51YWwgYXBwcm92YWwgYWN0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgTWFudWFsQXBwcm92YWxBY3Rpb24gZXh0ZW5kcyBBY3Rpb24ge1xuICAvKipcbiAgICogVGhlIFNOUyBUb3BpYyBwYXNzZWQgd2hlbiBjb25zdHJ1Y3RpbmcgdGhlIEFjdGlvbi5cbiAgICogSWYgbm8gVG9waWMgd2FzIHBhc3NlZCwgYnV0IGBub3RpZnlFbWFpbHNgIHdlcmUgcHJvdmlkZWQsXG4gICAqIGEgbmV3IFRvcGljIHdpbGwgYmUgY3JlYXRlZC5cbiAgICovXG4gIHByaXZhdGUgX25vdGlmaWNhdGlvblRvcGljPzogc25zLklUb3BpYztcbiAgcHJpdmF0ZSByZWFkb25seSBwcm9wczogTWFudWFsQXBwcm92YWxBY3Rpb25Qcm9wcztcbiAgcHJpdmF0ZSBzdGFnZT86IGNvZGVwaXBlbGluZS5JU3RhZ2U7XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IE1hbnVhbEFwcHJvdmFsQWN0aW9uUHJvcHMpIHtcbiAgICBzdXBlcih7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGNhdGVnb3J5OiBjb2RlcGlwZWxpbmUuQWN0aW9uQ2F0ZWdvcnkuQVBQUk9WQUwsXG4gICAgICBwcm92aWRlcjogJ01hbnVhbCcsXG4gICAgICBhcnRpZmFjdEJvdW5kczogeyBtaW5JbnB1dHM6IDAsIG1heElucHV0czogMCwgbWluT3V0cHV0czogMCwgbWF4T3V0cHV0czogMCB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICB9XG5cbiAgcHVibGljIGdldCBub3RpZmljYXRpb25Ub3BpYygpOiBzbnMuSVRvcGljIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fbm90aWZpY2F0aW9uVG9waWM7XG4gIH1cblxuICAvKipcbiAgICogZ3JhbnQgdGhlIHByb3ZpZGVkIHByaW5jaXBhbCB0aGUgcGVybWlzc2lvbnMgdG8gYXBwcm92ZSBvciByZWplY3QgdGhpcyBtYW51YWwgYXBwcm92YWwgYWN0aW9uXG4gICAqXG4gICAqIEZvciBtb3JlIGluZm8gc2VlOlxuICAgKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZXBpcGVsaW5lL2xhdGVzdC91c2VyZ3VpZGUvYXBwcm92YWxzLWlhbS1wZXJtaXNzaW9ucy5odG1sXG4gICAqXG4gICAqIEBwYXJhbSBncmFudGFibGUgdGhlIGdyYW50YWJsZSB0byBhdHRhY2ggdGhlIHBlcm1pc3Npb25zIHRvXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRNYW51YWxBcHByb3ZhbChncmFudGFibGU6IGlhbS5JR3JhbnRhYmxlKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnN0YWdlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBncmFudCBwZXJtaXNzaW9ucyBiZWZvcmUgYmluZGluZyBhY3Rpb24gdG8gYSBzdGFnZScpO1xuICAgIH1cbiAgICBncmFudGFibGUuZ3JhbnRQcmluY2lwYWwuYWRkVG9QcmluY2lwYWxQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydjb2RlcGlwZWxpbmU6TGlzdFBpcGVsaW5lcyddLFxuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICB9KSk7XG4gICAgZ3JhbnRhYmxlLmdyYW50UHJpbmNpcGFsLmFkZFRvUHJpbmNpcGFsUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnY29kZXBpcGVsaW5lOkdldFBpcGVsaW5lJywgJ2NvZGVwaXBlbGluZTpHZXRQaXBlbGluZVN0YXRlJywgJ2NvZGVwaXBlbGluZTpHZXRQaXBlbGluZUV4ZWN1dGlvbiddLFxuICAgICAgcmVzb3VyY2VzOiBbdGhpcy5zdGFnZS5waXBlbGluZS5waXBlbGluZUFybl0sXG4gICAgfSkpO1xuICAgIGdyYW50YWJsZS5ncmFudFByaW5jaXBhbC5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2NvZGVwaXBlbGluZTpQdXRBcHByb3ZhbFJlc3VsdCddLFxuICAgICAgcmVzb3VyY2VzOiBbYCR7dGhpcy5zdGFnZS5waXBlbGluZS5waXBlbGluZUFybn0vJHt0aGlzLnN0YWdlLnN0YWdlTmFtZX0vJHt0aGlzLnByb3BzLmFjdGlvbk5hbWV9YF0sXG4gICAgfSkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGJvdW5kKHNjb3BlOiBDb25zdHJ1Y3QsIHN0YWdlOiBjb2RlcGlwZWxpbmUuSVN0YWdlLCBvcHRpb25zOiBjb2RlcGlwZWxpbmUuQWN0aW9uQmluZE9wdGlvbnMpOiBjb2RlcGlwZWxpbmUuQWN0aW9uQ29uZmlnIHtcbiAgICBpZiAodGhpcy5wcm9wcy5ub3RpZmljYXRpb25Ub3BpYykge1xuICAgICAgdGhpcy5fbm90aWZpY2F0aW9uVG9waWMgPSB0aGlzLnByb3BzLm5vdGlmaWNhdGlvblRvcGljO1xuICAgIH0gZWxzZSBpZiAoKHRoaXMucHJvcHMubm90aWZ5RW1haWxzIHx8IFtdKS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9ub3RpZmljYXRpb25Ub3BpYyA9IG5ldyBzbnMuVG9waWMoc2NvcGUsICdUb3BpY1Jlc291cmNlJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX25vdGlmaWNhdGlvblRvcGljKSB7XG4gICAgICB0aGlzLl9ub3RpZmljYXRpb25Ub3BpYy5ncmFudFB1Ymxpc2gob3B0aW9ucy5yb2xlKTtcbiAgICAgIGZvciAoY29uc3Qgbm90aWZ5RW1haWwgb2YgdGhpcy5wcm9wcy5ub3RpZnlFbWFpbHMgfHwgW10pIHtcbiAgICAgICAgdGhpcy5fbm90aWZpY2F0aW9uVG9waWMuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzLkVtYWlsU3Vic2NyaXB0aW9uKG5vdGlmeUVtYWlsKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zdGFnZSA9IHN0YWdlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ3VyYXRpb246IHVuZGVmaW5lZElmQWxsVmFsdWVzQXJlRW1wdHkoe1xuICAgICAgICBOb3RpZmljYXRpb25Bcm46IHRoaXMuX25vdGlmaWNhdGlvblRvcGljPy50b3BpY0FybixcbiAgICAgICAgQ3VzdG9tRGF0YTogdGhpcy5wcm9wcy5hZGRpdGlvbmFsSW5mb3JtYXRpb24sXG4gICAgICAgIEV4dGVybmFsRW50aXR5TGluazogdGhpcy5wcm9wcy5leHRlcm5hbEVudGl0eUxpbmssXG4gICAgICB9KSxcbiAgICB9O1xuICB9XG5cbn1cblxuZnVuY3Rpb24gdW5kZWZpbmVkSWZBbGxWYWx1ZXNBcmVFbXB0eShvYmplY3Q6IG9iamVjdCk6IG9iamVjdCB8IHVuZGVmaW5lZCB7XG4gIHJldHVybiBPYmplY3QudmFsdWVzKG9iamVjdCkuc29tZSh2ID0+IHYgIT09IHVuZGVmaW5lZCkgPyBvYmplY3QgOiB1bmRlZmluZWQ7XG59XG4iXX0=