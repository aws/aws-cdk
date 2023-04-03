"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const stepfunctions_canned_metrics_generated_1 = require("./stepfunctions-canned-metrics.generated");
const stepfunctions_generated_1 = require("./stepfunctions.generated");
/**
 * Define a new Step Functions Activity
 */
class Activity extends core_1.Resource {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.activityName ||
                core_1.Lazy.string({ produce: () => this.generateName() }),
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_stepfunctions_ActivityProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Activity);
            }
            throw error;
        }
        const resource = new stepfunctions_generated_1.CfnActivity(this, 'Resource', {
            name: this.physicalName,
        });
        this.activityArn = this.getResourceArnAttribute(resource.ref, {
            service: 'states',
            resource: 'activity',
            resourceName: this.physicalName,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        });
        this.activityName = this.getResourceNameAttribute(resource.attrName);
    }
    /**
     * Construct an Activity from an existing Activity ARN
     */
    static fromActivityArn(scope, id, activityArn) {
        class Imported extends core_1.Resource {
            get activityArn() { return activityArn; }
            get activityName() {
                return core_1.Stack.of(this).splitArn(activityArn, core_1.ArnFormat.COLON_RESOURCE_NAME).resourceName || '';
            }
        }
        return new Imported(scope, id);
    }
    /**
     * Construct an Activity from an existing Activity Name
     */
    static fromActivityName(scope, id, activityName) {
        return Activity.fromActivityArn(scope, id, core_1.Stack.of(scope).formatArn({
            service: 'states',
            resource: 'activity',
            resourceName: activityName,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        }));
    }
    /**
     * Grant the given identity permissions on this Activity
     *
     * @param identity The principal
     * @param actions The list of desired actions
     */
    grant(identity, ...actions) {
        return iam.Grant.addToPrincipal({
            grantee: identity,
            actions,
            resourceArns: [this.activityArn],
        });
    }
    /**
     * Return the given named metric for this Activity
     *
     * @default sum over 5 minutes
     */
    metric(metricName, props) {
        return new cloudwatch.Metric({
            namespace: 'AWS/States',
            metricName,
            dimensions: { ActivityArn: this.activityArn },
            statistic: 'sum',
            ...props,
        }).attachTo(this);
    }
    /**
     * The interval, in milliseconds, between the time the activity starts and the time it closes.
     *
     * @default average over 5 minutes
     */
    metricRunTime(props) {
        return this.cannedMetric(stepfunctions_canned_metrics_generated_1.StatesMetrics.activityRunTimeAverage, props);
    }
    /**
     * The interval, in milliseconds, for which the activity stays in the schedule state.
     *
     * @default average over 5 minutes
     */
    metricScheduleTime(props) {
        return this.cannedMetric(stepfunctions_canned_metrics_generated_1.StatesMetrics.activityScheduleTimeAverage, props);
    }
    /**
     * The interval, in milliseconds, between the time the activity is scheduled and the time it closes.
     *
     * @default average over 5 minutes
     */
    metricTime(props) {
        return this.cannedMetric(stepfunctions_canned_metrics_generated_1.StatesMetrics.activityTimeAverage, props);
    }
    /**
     * Metric for the number of times this activity is scheduled
     *
     * @default sum over 5 minutes
     */
    metricScheduled(props) {
        return this.cannedMetric(stepfunctions_canned_metrics_generated_1.StatesMetrics.activitiesScheduledSum, props);
    }
    /**
     * Metric for the number of times this activity times out
     *
     * @default sum over 5 minutes
     */
    metricTimedOut(props) {
        return this.cannedMetric(stepfunctions_canned_metrics_generated_1.StatesMetrics.activitiesTimedOutSum, props);
    }
    /**
     * Metric for the number of times this activity is started
     *
     * @default sum over 5 minutes
     */
    metricStarted(props) {
        return this.cannedMetric(stepfunctions_canned_metrics_generated_1.StatesMetrics.activitiesStartedSum, props);
    }
    /**
     * Metric for the number of times this activity succeeds
     *
     * @default sum over 5 minutes
     */
    metricSucceeded(props) {
        return this.cannedMetric(stepfunctions_canned_metrics_generated_1.StatesMetrics.activitiesSucceededSum, props);
    }
    /**
     * Metric for the number of times this activity fails
     *
     * @default sum over 5 minutes
     */
    metricFailed(props) {
        return this.cannedMetric(stepfunctions_canned_metrics_generated_1.StatesMetrics.activitiesFailedSum, props);
    }
    /**
     * Metric for the number of times the heartbeat times out for this activity
     *
     * @default sum over 5 minutes
     */
    metricHeartbeatTimedOut(props) {
        return this.cannedMetric(stepfunctions_canned_metrics_generated_1.StatesMetrics.activitiesHeartbeatTimedOutSum, props);
    }
    generateName() {
        const name = core_1.Names.uniqueId(this);
        if (name.length > 80) {
            return name.substring(0, 40) + name.substring(name.length - 40);
        }
        return name;
    }
    cannedMetric(fn, props) {
        return new cloudwatch.Metric({
            ...fn({ ActivityArn: this.activityArn }),
            ...props,
        }).attachTo(this);
    }
}
exports.Activity = Activity;
_a = JSII_RTTI_SYMBOL_1;
Activity[_a] = { fqn: "@aws-cdk/aws-stepfunctions.Activity", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhY3Rpdml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzREFBc0Q7QUFDdEQsd0NBQXdDO0FBQ3hDLHdDQUFtRjtBQUVuRixxR0FBeUU7QUFDekUsdUVBQXdEO0FBY3hEOztHQUVHO0FBQ0gsTUFBYSxRQUFTLFNBQVEsZUFBUTtJQXFDcEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUF1QixFQUFFO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO2dCQUN0QixXQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDO1NBQzlELENBQUMsQ0FBQzs7Ozs7OytDQXpDTSxRQUFROzs7O1FBMkNqQixNQUFNLFFBQVEsR0FBRyxJQUFJLHFDQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNqRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQWE7U0FDekIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtZQUM1RCxPQUFPLEVBQUUsUUFBUTtZQUNqQixRQUFRLEVBQUUsVUFBVTtZQUNwQixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDL0IsU0FBUyxFQUFFLGdCQUFTLENBQUMsbUJBQW1CO1NBQ3pDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUN0RTtJQXJERDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsV0FBbUI7UUFDN0UsTUFBTSxRQUFTLFNBQVEsZUFB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QWEsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNwRTtJQUVEOzs7O09BSUc7SUFDSSx1QkFBdUIsQ0FBQyxLQUFnQztRQUM3RCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsc0RBQWEsQ0FBQyw4QkFBOEIsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUMvRTtJQUVPLFlBQVk7UUFDbEIsTUFBTSxJQUFJLEdBQUcsWUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFO1lBQ3BCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1NBQ2pFO1FBQ0QsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVPLFlBQVksQ0FDbEIsRUFBNkQsRUFDN0QsS0FBZ0M7UUFDaEMsT0FBTyxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUM7WUFDM0IsR0FBRyxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3hDLEdBQUcsS0FBSztTQUNULENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbkI7O0FBckxILDRCQXNMQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgQXJuRm9ybWF0LCBJUmVzb3VyY2UsIExhenksIE5hbWVzLCBSZXNvdXJjZSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgU3RhdGVzTWV0cmljcyB9IGZyb20gJy4vc3RlcGZ1bmN0aW9ucy1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQ2ZuQWN0aXZpdHkgfSBmcm9tICcuL3N0ZXBmdW5jdGlvbnMuZ2VuZXJhdGVkJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIG5ldyBTdGVwIEZ1bmN0aW9ucyBBY3Rpdml0eVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFjdGl2aXR5UHJvcHMge1xuICAvKipcbiAgICogVGhlIG5hbWUgZm9yIHRoaXMgYWN0aXZpdHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gSWYgbm90IHN1cHBsaWVkLCBhIG5hbWUgaXMgZ2VuZXJhdGVkXG4gICAqL1xuICByZWFkb25seSBhY3Rpdml0eU5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGVmaW5lIGEgbmV3IFN0ZXAgRnVuY3Rpb25zIEFjdGl2aXR5XG4gKi9cbmV4cG9ydCBjbGFzcyBBY3Rpdml0eSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUFjdGl2aXR5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhbiBBY3Rpdml0eSBmcm9tIGFuIGV4aXN0aW5nIEFjdGl2aXR5IEFSTlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQWN0aXZpdHlBcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYWN0aXZpdHlBcm46IHN0cmluZyk6IElBY3Rpdml0eSB7XG4gICAgY2xhc3MgSW1wb3J0ZWQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElBY3Rpdml0eSB7XG4gICAgICBwdWJsaWMgZ2V0IGFjdGl2aXR5QXJuKCkgeyByZXR1cm4gYWN0aXZpdHlBcm47IH1cbiAgICAgIHB1YmxpYyBnZXQgYWN0aXZpdHlOYW1lKCkge1xuICAgICAgICByZXR1cm4gU3RhY2sub2YodGhpcykuc3BsaXRBcm4oYWN0aXZpdHlBcm4sIEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FKS5yZXNvdXJjZU5hbWUgfHwgJyc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnRlZChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhbiBBY3Rpdml0eSBmcm9tIGFuIGV4aXN0aW5nIEFjdGl2aXR5IE5hbWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUFjdGl2aXR5TmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhY3Rpdml0eU5hbWU6IHN0cmluZyk6IElBY3Rpdml0eSB7XG4gICAgcmV0dXJuIEFjdGl2aXR5LmZyb21BY3Rpdml0eUFybihzY29wZSwgaWQsIFN0YWNrLm9mKHNjb3BlKS5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ3N0YXRlcycsXG4gICAgICByZXNvdXJjZTogJ2FjdGl2aXR5JyxcbiAgICAgIHJlc291cmNlTmFtZTogYWN0aXZpdHlOYW1lLFxuICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFjdGl2aXR5QXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhY3Rpdml0eU5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQWN0aXZpdHlQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLmFjdGl2aXR5TmFtZSB8fFxuICAgICAgICAgICAgICAgIExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gdGhpcy5nZW5lcmF0ZU5hbWUoKSB9KSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbkFjdGl2aXR5KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIG5hbWU6IHRoaXMucGh5c2ljYWxOYW1lISwgLy8gbm90IG51bGwgYmVjYXVzZSBvZiBhYm92ZSBjYWxsIHRvIGBzdXBlcmBcbiAgICB9KTtcblxuICAgIHRoaXMuYWN0aXZpdHlBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHJlc291cmNlLnJlZiwge1xuICAgICAgc2VydmljZTogJ3N0YXRlcycsXG4gICAgICByZXNvdXJjZTogJ2FjdGl2aXR5JyxcbiAgICAgIHJlc291cmNlTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FLFxuICAgIH0pO1xuICAgIHRoaXMuYWN0aXZpdHlOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UuYXR0ck5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBnaXZlbiBpZGVudGl0eSBwZXJtaXNzaW9ucyBvbiB0aGlzIEFjdGl2aXR5XG4gICAqXG4gICAqIEBwYXJhbSBpZGVudGl0eSBUaGUgcHJpbmNpcGFsXG4gICAqIEBwYXJhbSBhY3Rpb25zIFRoZSBsaXN0IG9mIGRlc2lyZWQgYWN0aW9uc1xuICAgKi9cbiAgcHVibGljIGdyYW50KGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSwgLi4uYWN0aW9uczogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIGdyYW50ZWU6IGlkZW50aXR5LFxuICAgICAgYWN0aW9ucyxcbiAgICAgIHJlc291cmNlQXJuczogW3RoaXMuYWN0aXZpdHlBcm5dLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgZ2l2ZW4gbmFtZWQgbWV0cmljIGZvciB0aGlzIEFjdGl2aXR5XG4gICAqXG4gICAqIEBkZWZhdWx0IHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpYyhtZXRyaWNOYW1lOiBzdHJpbmcsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL1N0YXRlcycsXG4gICAgICBtZXRyaWNOYW1lLFxuICAgICAgZGltZW5zaW9uczogeyBBY3Rpdml0eUFybjogdGhpcy5hY3Rpdml0eUFybiB9LFxuICAgICAgc3RhdGlzdGljOiAnc3VtJyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pLmF0dGFjaFRvKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRlcnZhbCwgaW4gbWlsbGlzZWNvbmRzLCBiZXR3ZWVuIHRoZSB0aW1lIHRoZSBhY3Rpdml0eSBzdGFydHMgYW5kIHRoZSB0aW1lIGl0IGNsb3Nlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgYXZlcmFnZSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1J1blRpbWUocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKFN0YXRlc01ldHJpY3MuYWN0aXZpdHlSdW5UaW1lQXZlcmFnZSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBpbnRlcnZhbCwgaW4gbWlsbGlzZWNvbmRzLCBmb3Igd2hpY2ggdGhlIGFjdGl2aXR5IHN0YXlzIGluIHRoZSBzY2hlZHVsZSBzdGF0ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgYXZlcmFnZSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1NjaGVkdWxlVGltZShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoU3RhdGVzTWV0cmljcy5hY3Rpdml0eVNjaGVkdWxlVGltZUF2ZXJhZ2UsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaW50ZXJ2YWwsIGluIG1pbGxpc2Vjb25kcywgYmV0d2VlbiB0aGUgdGltZSB0aGUgYWN0aXZpdHkgaXMgc2NoZWR1bGVkIGFuZCB0aGUgdGltZSBpdCBjbG9zZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNUaW1lKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhTdGF0ZXNNZXRyaWNzLmFjdGl2aXR5VGltZUF2ZXJhZ2UsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgdGltZXMgdGhpcyBhY3Rpdml0eSBpcyBzY2hlZHVsZWRcbiAgICpcbiAgICogQGRlZmF1bHQgc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljU2NoZWR1bGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhTdGF0ZXNNZXRyaWNzLmFjdGl2aXRpZXNTY2hlZHVsZWRTdW0sIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgdGltZXMgdGhpcyBhY3Rpdml0eSB0aW1lcyBvdXRcbiAgICpcbiAgICogQGRlZmF1bHQgc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljVGltZWRPdXQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKFN0YXRlc01ldHJpY3MuYWN0aXZpdGllc1RpbWVkT3V0U3VtLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoaXMgYWN0aXZpdHkgaXMgc3RhcnRlZFxuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNTdGFydGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhTdGF0ZXNNZXRyaWNzLmFjdGl2aXRpZXNTdGFydGVkU3VtLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoaXMgYWN0aXZpdHkgc3VjY2VlZHNcbiAgICpcbiAgICogQGRlZmF1bHQgc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljU3VjY2VlZGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhTdGF0ZXNNZXRyaWNzLmFjdGl2aXRpZXNTdWNjZWVkZWRTdW0sIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgdGltZXMgdGhpcyBhY3Rpdml0eSBmYWlsc1xuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNGYWlsZWQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKFN0YXRlc01ldHJpY3MuYWN0aXZpdGllc0ZhaWxlZFN1bSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiB0aW1lcyB0aGUgaGVhcnRiZWF0IHRpbWVzIG91dCBmb3IgdGhpcyBhY3Rpdml0eVxuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNIZWFydGJlYXRUaW1lZE91dChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoU3RhdGVzTWV0cmljcy5hY3Rpdml0aWVzSGVhcnRiZWF0VGltZWRPdXRTdW0sIHByb3BzKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVOYW1lKCk6IHN0cmluZyB7XG4gICAgY29uc3QgbmFtZSA9IE5hbWVzLnVuaXF1ZUlkKHRoaXMpO1xuICAgIGlmIChuYW1lLmxlbmd0aCA+IDgwKSB7XG4gICAgICByZXR1cm4gbmFtZS5zdWJzdHJpbmcoMCwgNDApICsgbmFtZS5zdWJzdHJpbmcobmFtZS5sZW5ndGggLSA0MCk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lO1xuICB9XG5cbiAgcHJpdmF0ZSBjYW5uZWRNZXRyaWMoXG4gICAgZm46IChkaW1zOiB7IEFjdGl2aXR5QXJuOiBzdHJpbmcgfSkgPT4gY2xvdWR3YXRjaC5NZXRyaWNQcm9wcyxcbiAgICBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgIC4uLmZuKHsgQWN0aXZpdHlBcm46IHRoaXMuYWN0aXZpdHlBcm4gfSksXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KS5hdHRhY2hUbyh0aGlzKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBTdGVwIEZ1bmN0aW9ucyBBY3Rpdml0eVxuICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3N0ZXAtZnVuY3Rpb25zL2xhdGVzdC9kZy9jb25jZXB0cy1hY3Rpdml0aWVzLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQWN0aXZpdHkgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgYWN0aXZpdHlcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWN0aXZpdHlBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGFjdGl2aXR5XG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGFjdGl2aXR5TmFtZTogc3RyaW5nO1xufVxuIl19