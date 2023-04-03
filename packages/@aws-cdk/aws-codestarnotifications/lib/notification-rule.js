"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRule = exports.DetailType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const codestarnotifications_generated_1 = require("./codestarnotifications.generated");
/**
 * The level of detail to include in the notifications for this resource.
 */
var DetailType;
(function (DetailType) {
    /**
     * BASIC will include only the contents of the event as it would appear in AWS CloudWatch
     */
    DetailType["BASIC"] = "BASIC";
    /**
     * FULL will include any supplemental information provided by AWS CodeStar Notifications and/or the service for the resource for which the notification is created.
     */
    DetailType["FULL"] = "FULL";
})(DetailType = exports.DetailType || (exports.DetailType = {}));
/**
 * A new notification rule
 *
 * @resource AWS::CodeStarNotifications::NotificationRule
 */
class NotificationRule extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        this.targets = [];
        this.events = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codestarnotifications_NotificationRuleProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, NotificationRule);
            }
            throw error;
        }
        const source = props.source.bindAsNotificationRuleSource(this);
        this.addEvents(props.events);
        const resource = new codestarnotifications_generated_1.CfnNotificationRule(this, 'Resource', {
            // It has a 64 characters limit for the name
            name: props.notificationRuleName || core_1.Names.uniqueId(this).slice(-64),
            detailType: props.detailType || DetailType.FULL,
            targets: this.targets,
            eventTypeIds: this.events,
            resource: source.sourceArn,
            status: props.enabled !== undefined
                ? (props.enabled ? 'ENABLED' : 'DISABLED')
                : undefined,
        });
        this.notificationRuleArn = resource.ref;
        props.targets?.forEach((target) => {
            this.addTarget(target);
        });
    }
    /**
     * Import an existing notification rule provided an ARN
     * @param scope The parent creating construct
     * @param id The construct's name
     * @param notificationRuleArn Notification rule ARN (i.e. arn:aws:codestar-notifications:::notificationrule/01234abcde)
     */
    static fromNotificationRuleArn(scope, id, notificationRuleArn) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.notificationRuleArn = notificationRuleArn;
            }
            addTarget(_target) {
                return false;
            }
        }
        return new Import(scope, id, {
            environmentFromArn: notificationRuleArn,
        });
    }
    /**
     * Adds target to notification rule
     * @param target The SNS topic or AWS Chatbot Slack target
     */
    addTarget(target) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codestarnotifications_INotificationRuleTarget(target);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addTarget);
            }
            throw error;
        }
        this.targets.push(target.bindAsNotificationRuleTarget(this));
        return true;
    }
    /**
     * Adds events to notification rule
     *
     * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-pipeline
     * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-buildproject
     * @param events The list of event types for AWS Codebuild and AWS CodePipeline
     */
    addEvents(events) {
        events.forEach((event) => {
            if (this.events.includes(event)) {
                return;
            }
            this.events.push(event);
        });
    }
}
exports.NotificationRule = NotificationRule;
_a = JSII_RTTI_SYMBOL_1;
NotificationRule[_a] = { fqn: "@aws-cdk/aws-codestarnotifications.NotificationRule", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLXJ1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub3RpZmljYXRpb24tcnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBMkQ7QUFFM0QsdUZBQXdFO0FBSXhFOztHQUVHO0FBQ0gsSUFBWSxVQVVYO0FBVkQsV0FBWSxVQUFVO0lBQ3BCOztPQUVHO0lBQ0gsNkJBQWUsQ0FBQTtJQUVmOztPQUVHO0lBQ0gsMkJBQWEsQ0FBQTtBQUNmLENBQUMsRUFWVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQVVyQjtBQStFRDs7OztHQUlHO0FBQ0gsTUFBYSxnQkFBaUIsU0FBUSxlQUFRO0lBOEI1QyxZQUFZLEtBQTJCLEVBQUUsRUFBVSxFQUFFLEtBQTRCO1FBQy9FLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFMRixZQUFPLEdBQW1DLEVBQUUsQ0FBQztRQUU3QyxXQUFNLEdBQWEsRUFBRSxDQUFDOzs7Ozs7K0NBNUI1QixnQkFBZ0I7Ozs7UUFpQ3pCLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFL0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxxREFBbUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3pELDRDQUE0QztZQUM1QyxJQUFJLEVBQUUsS0FBSyxDQUFDLG9CQUFvQixJQUFJLFlBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ25FLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxJQUFJO1lBQy9DLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDekIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxTQUFTO1lBQzFCLE1BQU0sRUFBRSxLQUFLLENBQUMsT0FBTyxLQUFLLFNBQVM7Z0JBQ2pDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO2dCQUMxQyxDQUFDLENBQUMsU0FBUztTQUNkLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxtQkFBbUIsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBRXhDLEtBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztLQUNKO0lBckREOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLHVCQUF1QixDQUFDLEtBQTJCLEVBQUUsRUFBVSxFQUFFLG1CQUEyQjtRQUN4RyxNQUFNLE1BQU8sU0FBUSxlQUFRO1lBQTdCOztnQkFDVyx3QkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztZQUtyRCxDQUFDO1lBSFEsU0FBUyxDQUFDLE9BQWdDO2dCQUMvQyxPQUFPLEtBQUssQ0FBQztZQUNmLENBQUM7U0FDRjtRQUVELE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUMzQixrQkFBa0IsRUFBRSxtQkFBbUI7U0FDeEMsQ0FBQyxDQUFDO0tBQ0o7SUFxQ0Q7OztPQUdHO0lBQ0ksU0FBUyxDQUFDLE1BQStCOzs7Ozs7Ozs7O1FBQzlDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzdELE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRDs7Ozs7O09BTUc7SUFDSyxTQUFTLENBQUMsTUFBZ0I7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ3ZCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQy9CLE9BQU87YUFDUjtZQUVELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO0tBQ0o7O0FBaEZILDRDQWlGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElSZXNvdXJjZSwgUmVzb3VyY2UsIE5hbWVzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuTm90aWZpY2F0aW9uUnVsZSB9IGZyb20gJy4vY29kZXN0YXJub3RpZmljYXRpb25zLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBJTm90aWZpY2F0aW9uUnVsZVNvdXJjZSB9IGZyb20gJy4vbm90aWZpY2F0aW9uLXJ1bGUtc291cmNlJztcbmltcG9ydCB7IElOb3RpZmljYXRpb25SdWxlVGFyZ2V0LCBOb3RpZmljYXRpb25SdWxlVGFyZ2V0Q29uZmlnIH0gZnJvbSAnLi9ub3RpZmljYXRpb24tcnVsZS10YXJnZXQnO1xuXG4vKipcbiAqIFRoZSBsZXZlbCBvZiBkZXRhaWwgdG8gaW5jbHVkZSBpbiB0aGUgbm90aWZpY2F0aW9ucyBmb3IgdGhpcyByZXNvdXJjZS5cbiAqL1xuZXhwb3J0IGVudW0gRGV0YWlsVHlwZSB7XG4gIC8qKlxuICAgKiBCQVNJQyB3aWxsIGluY2x1ZGUgb25seSB0aGUgY29udGVudHMgb2YgdGhlIGV2ZW50IGFzIGl0IHdvdWxkIGFwcGVhciBpbiBBV1MgQ2xvdWRXYXRjaFxuICAgKi9cbiAgQkFTSUMgPSAnQkFTSUMnLFxuXG4gIC8qKlxuICAgKiBGVUxMIHdpbGwgaW5jbHVkZSBhbnkgc3VwcGxlbWVudGFsIGluZm9ybWF0aW9uIHByb3ZpZGVkIGJ5IEFXUyBDb2RlU3RhciBOb3RpZmljYXRpb25zIGFuZC9vciB0aGUgc2VydmljZSBmb3IgdGhlIHJlc291cmNlIGZvciB3aGljaCB0aGUgbm90aWZpY2F0aW9uIGlzIGNyZWF0ZWQuXG4gICAqL1xuICBGVUxMID0gJ0ZVTEwnLFxufVxuXG4vKipcbiAqIFN0YW5kYXJkIHNldCBvZiBvcHRpb25zIGZvciBgbm90aWZ5T25YeHhgIGNvZGVzdGFyIG5vdGlmaWNhdGlvbiBoYW5kbGVyIG9uIGNvbnN0cnVjdFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5vdGlmaWNhdGlvblJ1bGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIGZvciB0aGUgbm90aWZpY2F0aW9uIHJ1bGUuXG4gICAqIE5vdGlmaWNhdGlvbiBydWxlIG5hbWVzIG11c3QgYmUgdW5pcXVlIGluIHlvdXIgQVdTIGFjY291bnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZ2VuZXJhdGVkIGZyb20gdGhlIGBpZGBcbiAgICovXG4gIHJlYWRvbmx5IG5vdGlmaWNhdGlvblJ1bGVOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgc3RhdHVzIG9mIHRoZSBub3RpZmljYXRpb24gcnVsZS5cbiAgICogSWYgdGhlIGVuYWJsZWQgaXMgc2V0IHRvIERJU0FCTEVELCBub3RpZmljYXRpb25zIGFyZW4ndCBzZW50IGZvciB0aGUgbm90aWZpY2F0aW9uIHJ1bGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgbGV2ZWwgb2YgZGV0YWlsIHRvIGluY2x1ZGUgaW4gdGhlIG5vdGlmaWNhdGlvbnMgZm9yIHRoaXMgcmVzb3VyY2UuXG4gICAqIEJBU0lDIHdpbGwgaW5jbHVkZSBvbmx5IHRoZSBjb250ZW50cyBvZiB0aGUgZXZlbnQgYXMgaXQgd291bGQgYXBwZWFyIGluIEFXUyBDbG91ZFdhdGNoLlxuICAgKiBGVUxMIHdpbGwgaW5jbHVkZSBhbnkgc3VwcGxlbWVudGFsIGluZm9ybWF0aW9uIHByb3ZpZGVkIGJ5IEFXUyBDb2RlU3RhciBOb3RpZmljYXRpb25zIGFuZC9vciB0aGUgc2VydmljZSBmb3IgdGhlIHJlc291cmNlIGZvciB3aGljaCB0aGUgbm90aWZpY2F0aW9uIGlzIGNyZWF0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IERldGFpbFR5cGUuRlVMTFxuICAgKi9cbiAgcmVhZG9ubHkgZGV0YWlsVHlwZT86IERldGFpbFR5cGU7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBuZXcgbm90aWZpY2F0aW9uIHJ1bGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOb3RpZmljYXRpb25SdWxlUHJvcHMgZXh0ZW5kcyBOb3RpZmljYXRpb25SdWxlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgZXZlbnQgdHlwZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgbm90aWZpY2F0aW9uIHJ1bGUuXG4gICAqIEZvciBhIGNvbXBsZXRlIGxpc3Qgb2YgZXZlbnQgdHlwZXMgYW5kIElEcywgc2VlIE5vdGlmaWNhdGlvbiBjb25jZXB0cyBpbiB0aGUgRGV2ZWxvcGVyIFRvb2xzIENvbnNvbGUgVXNlciBHdWlkZS5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZHRjb25zb2xlL2xhdGVzdC91c2VyZ3VpZGUvY29uY2VwdHMuaHRtbCNjb25jZXB0cy1hcGlcbiAgICovXG4gIHJlYWRvbmx5IGV2ZW50czogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgcmVzb3VyY2UgdG8gYXNzb2NpYXRlIHdpdGggdGhlIG5vdGlmaWNhdGlvbiBydWxlLlxuICAgKiBDdXJyZW50bHksIFN1cHBvcnRlZCBzb3VyY2VzIGluY2x1ZGUgcGlwZWxpbmVzIGluIEFXUyBDb2RlUGlwZWxpbmUsIGJ1aWxkIHByb2plY3RzIGluIEFXUyBDb2RlQnVpbGQsIGFuZCByZXBvc2l0b3JpZXMgaW4gQVdTIENvZGVDb21taXQgaW4gdGhpcyBMMiBjb25zdHJ1Y3Rvci5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtY29kZXN0YXJub3RpZmljYXRpb25zLW5vdGlmaWNhdGlvbnJ1bGUuaHRtbCNjZm4tY29kZXN0YXJub3RpZmljYXRpb25zLW5vdGlmaWNhdGlvbnJ1bGUtcmVzb3VyY2VcbiAgICovXG4gIHJlYWRvbmx5IHNvdXJjZTogSU5vdGlmaWNhdGlvblJ1bGVTb3VyY2U7XG5cbiAgLyoqXG4gICAqIFRoZSB0YXJnZXRzIHRvIHJlZ2lzdGVyIGZvciB0aGUgbm90aWZpY2F0aW9uIGRlc3RpbmF0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHRhcmdldHMgYXJlIGFkZGVkIHRvIHRoZSBydWxlLiBVc2UgYGFkZFRhcmdldCgpYCB0byBhZGQgYSB0YXJnZXQuXG4gICAqL1xuICByZWFkb25seSB0YXJnZXRzPzogSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXRbXTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgbm90aWZpY2F0aW9uIHJ1bGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJTm90aWZpY2F0aW9uUnVsZSBleHRlbmRzIElSZXNvdXJjZSB7XG5cbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIG5vdGlmaWNhdGlvbiBydWxlIChpLmUuIGFybjphd3M6Y29kZXN0YXItbm90aWZpY2F0aW9uczo6Om5vdGlmaWNhdGlvbnJ1bGUvMDEyMzRhYmNkZSlcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgbm90aWZpY2F0aW9uUnVsZUFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGRzIHRhcmdldCB0byBub3RpZmljYXRpb24gcnVsZVxuICAgKlxuICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSBTTlMgdG9waWMgb3IgQVdTIENoYXRib3QgU2xhY2sgdGFyZ2V0XG4gICAqIEByZXR1cm5zIGJvb2xlYW4gLSByZXR1cm4gdHJ1ZSBpZiBpdCBoYWQgYW55IGVmZmVjdFxuICAgKi9cbiAgYWRkVGFyZ2V0KHRhcmdldDogSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQpOiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgbmV3IG5vdGlmaWNhdGlvbiBydWxlXG4gKlxuICogQHJlc291cmNlIEFXUzo6Q29kZVN0YXJOb3RpZmljYXRpb25zOjpOb3RpZmljYXRpb25SdWxlXG4gKi9cbmV4cG9ydCBjbGFzcyBOb3RpZmljYXRpb25SdWxlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJTm90aWZpY2F0aW9uUnVsZSB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3Rpbmcgbm90aWZpY2F0aW9uIHJ1bGUgcHJvdmlkZWQgYW4gQVJOXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgcGFyZW50IGNyZWF0aW5nIGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gaWQgVGhlIGNvbnN0cnVjdCdzIG5hbWVcbiAgICogQHBhcmFtIG5vdGlmaWNhdGlvblJ1bGVBcm4gTm90aWZpY2F0aW9uIHJ1bGUgQVJOIChpLmUuIGFybjphd3M6Y29kZXN0YXItbm90aWZpY2F0aW9uczo6Om5vdGlmaWNhdGlvbnJ1bGUvMDEyMzRhYmNkZSlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbU5vdGlmaWNhdGlvblJ1bGVBcm4oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBub3RpZmljYXRpb25SdWxlQXJuOiBzdHJpbmcpOiBJTm90aWZpY2F0aW9uUnVsZSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJTm90aWZpY2F0aW9uUnVsZSB7XG4gICAgICByZWFkb25seSBub3RpZmljYXRpb25SdWxlQXJuID0gbm90aWZpY2F0aW9uUnVsZUFybjtcblxuICAgICAgcHVibGljIGFkZFRhcmdldChfdGFyZ2V0OiBJTm90aWZpY2F0aW9uUnVsZVRhcmdldCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkLCB7XG4gICAgICBlbnZpcm9ubWVudEZyb21Bcm46IG5vdGlmaWNhdGlvblJ1bGVBcm4sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG5vdGlmaWNhdGlvblJ1bGVBcm46IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IHRhcmdldHM6IE5vdGlmaWNhdGlvblJ1bGVUYXJnZXRDb25maWdbXSA9IFtdO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZXZlbnRzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE5vdGlmaWNhdGlvblJ1bGVQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBzb3VyY2UgPSBwcm9wcy5zb3VyY2UuYmluZEFzTm90aWZpY2F0aW9uUnVsZVNvdXJjZSh0aGlzKTtcblxuICAgIHRoaXMuYWRkRXZlbnRzKHByb3BzLmV2ZW50cyk7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5Ob3RpZmljYXRpb25SdWxlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIC8vIEl0IGhhcyBhIDY0IGNoYXJhY3RlcnMgbGltaXQgZm9yIHRoZSBuYW1lXG4gICAgICBuYW1lOiBwcm9wcy5ub3RpZmljYXRpb25SdWxlTmFtZSB8fCBOYW1lcy51bmlxdWVJZCh0aGlzKS5zbGljZSgtNjQpLFxuICAgICAgZGV0YWlsVHlwZTogcHJvcHMuZGV0YWlsVHlwZSB8fCBEZXRhaWxUeXBlLkZVTEwsXG4gICAgICB0YXJnZXRzOiB0aGlzLnRhcmdldHMsXG4gICAgICBldmVudFR5cGVJZHM6IHRoaXMuZXZlbnRzLFxuICAgICAgcmVzb3VyY2U6IHNvdXJjZS5zb3VyY2VBcm4sXG4gICAgICBzdGF0dXM6IHByb3BzLmVuYWJsZWQgIT09IHVuZGVmaW5lZFxuICAgICAgICA/IChwcm9wcy5lbmFibGVkID8gJ0VOQUJMRUQnIDogJ0RJU0FCTEVEJylcbiAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgfSk7XG5cbiAgICB0aGlzLm5vdGlmaWNhdGlvblJ1bGVBcm4gPSByZXNvdXJjZS5yZWY7XG5cbiAgICBwcm9wcy50YXJnZXRzPy5mb3JFYWNoKCh0YXJnZXQpID0+IHtcbiAgICAgIHRoaXMuYWRkVGFyZ2V0KHRhcmdldCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0YXJnZXQgdG8gbm90aWZpY2F0aW9uIHJ1bGVcbiAgICogQHBhcmFtIHRhcmdldCBUaGUgU05TIHRvcGljIG9yIEFXUyBDaGF0Ym90IFNsYWNrIHRhcmdldFxuICAgKi9cbiAgcHVibGljIGFkZFRhcmdldCh0YXJnZXQ6IElOb3RpZmljYXRpb25SdWxlVGFyZ2V0KTogYm9vbGVhbiB7XG4gICAgdGhpcy50YXJnZXRzLnB1c2godGFyZ2V0LmJpbmRBc05vdGlmaWNhdGlvblJ1bGVUYXJnZXQodGhpcykpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgZXZlbnRzIHRvIG5vdGlmaWNhdGlvbiBydWxlXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2R0Y29uc29sZS9sYXRlc3QvdXNlcmd1aWRlL2NvbmNlcHRzLmh0bWwjZXZlbnRzLXJlZi1waXBlbGluZVxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9kdGNvbnNvbGUvbGF0ZXN0L3VzZXJndWlkZS9jb25jZXB0cy5odG1sI2V2ZW50cy1yZWYtYnVpbGRwcm9qZWN0XG4gICAqIEBwYXJhbSBldmVudHMgVGhlIGxpc3Qgb2YgZXZlbnQgdHlwZXMgZm9yIEFXUyBDb2RlYnVpbGQgYW5kIEFXUyBDb2RlUGlwZWxpbmVcbiAgICovXG4gIHByaXZhdGUgYWRkRXZlbnRzKGV2ZW50czogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBldmVudHMuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgIGlmICh0aGlzLmV2ZW50cy5pbmNsdWRlcyhldmVudCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmV2ZW50cy5wdXNoKGV2ZW50KTtcbiAgICB9KTtcbiAgfVxufVxuIl19