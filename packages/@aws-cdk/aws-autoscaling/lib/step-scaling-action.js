"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricAggregationType = exports.AdjustmentType = exports.StepScalingAction = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const autoscaling_generated_1 = require("./autoscaling.generated");
/**
 * Define a step scaling action
 *
 * This kind of scaling policy adjusts the target capacity in configurable
 * steps. The size of the step is configurable based on the metric's distance
 * to its alarm threshold.
 *
 * This Action must be used as the target of a CloudWatch alarm to take effect.
 */
class StepScalingAction extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.adjustments = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_StepScalingActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, StepScalingAction);
            }
            throw error;
        }
        const resource = new autoscaling_generated_1.CfnScalingPolicy(this, 'Resource', {
            policyType: 'StepScaling',
            autoScalingGroupName: props.autoScalingGroup.autoScalingGroupName,
            cooldown: props.cooldown && props.cooldown.toSeconds().toString(),
            estimatedInstanceWarmup: props.estimatedInstanceWarmup && props.estimatedInstanceWarmup.toSeconds(),
            adjustmentType: props.adjustmentType,
            minAdjustmentMagnitude: props.minAdjustmentMagnitude,
            metricAggregationType: props.metricAggregationType,
            stepAdjustments: core_1.Lazy.any({ produce: () => this.adjustments }),
        });
        this.scalingPolicyArn = resource.ref;
    }
    /**
     * Add an adjusment interval to the ScalingAction
     */
    addAdjustment(adjustment) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_AdjustmentTier(adjustment);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addAdjustment);
            }
            throw error;
        }
        if (adjustment.lowerBound === undefined && adjustment.upperBound === undefined) {
            throw new Error('At least one of lowerBound or upperBound is required');
        }
        this.adjustments.push({
            metricIntervalLowerBound: adjustment.lowerBound,
            metricIntervalUpperBound: adjustment.upperBound,
            scalingAdjustment: adjustment.adjustment,
        });
    }
}
exports.StepScalingAction = StepScalingAction;
_a = JSII_RTTI_SYMBOL_1;
StepScalingAction[_a] = { fqn: "@aws-cdk/aws-autoscaling.StepScalingAction", version: "0.0.0" };
/**
 * How adjustment numbers are interpreted
 */
var AdjustmentType;
(function (AdjustmentType) {
    /**
     * Add the adjustment number to the current capacity.
     *
     * A positive number increases capacity, a negative number decreases capacity.
     */
    AdjustmentType["CHANGE_IN_CAPACITY"] = "ChangeInCapacity";
    /**
     * Add this percentage of the current capacity to itself.
     *
     * The number must be between -100 and 100; a positive number increases
     * capacity and a negative number decreases it.
     */
    AdjustmentType["PERCENT_CHANGE_IN_CAPACITY"] = "PercentChangeInCapacity";
    /**
     * Make the capacity equal to the exact number given.
     */
    AdjustmentType["EXACT_CAPACITY"] = "ExactCapacity";
})(AdjustmentType = exports.AdjustmentType || (exports.AdjustmentType = {}));
/**
 * How the scaling metric is going to be aggregated
 */
var MetricAggregationType;
(function (MetricAggregationType) {
    /**
     * Average
     */
    MetricAggregationType["AVERAGE"] = "Average";
    /**
     * Minimum
     */
    MetricAggregationType["MINIMUM"] = "Minimum";
    /**
     * Maximum
     */
    MetricAggregationType["MAXIMUM"] = "Maximum";
})(MetricAggregationType = exports.MetricAggregationType || (exports.MetricAggregationType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcC1zY2FsaW5nLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0ZXAtc2NhbGluZy1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQStDO0FBQy9DLDJDQUF1QztBQUV2QyxtRUFBMkQ7QUFrRDNEOzs7Ozs7OztHQVFHO0FBQ0gsTUFBYSxpQkFBa0IsU0FBUSxzQkFBUztJQVE5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTZCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFIRixnQkFBVyxHQUFHLElBQUksS0FBSyxFQUEyQyxDQUFDOzs7Ozs7K0NBTnpFLGlCQUFpQjs7OztRQVcxQixNQUFNLFFBQVEsR0FBRyxJQUFJLHdDQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDdEQsVUFBVSxFQUFFLGFBQWE7WUFDekIsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQjtZQUNqRSxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRTtZQUNqRSx1QkFBdUIsRUFBRSxLQUFLLENBQUMsdUJBQXVCLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLFNBQVMsRUFBRTtZQUNuRyxjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWM7WUFDcEMsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLHNCQUFzQjtZQUNwRCxxQkFBcUIsRUFBRSxLQUFLLENBQUMscUJBQXFCO1lBQ2xELGVBQWUsRUFBRSxXQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUMvRCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQztLQUN0QztJQUVEOztPQUVHO0lBQ0ksYUFBYSxDQUFDLFVBQTBCOzs7Ozs7Ozs7O1FBQzdDLElBQUksVUFBVSxDQUFDLFVBQVUsS0FBSyxTQUFTLElBQUksVUFBVSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7WUFDOUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO1NBQ3pFO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsd0JBQXdCLEVBQUUsVUFBVSxDQUFDLFVBQVU7WUFDL0Msd0JBQXdCLEVBQUUsVUFBVSxDQUFDLFVBQVU7WUFDL0MsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLFVBQVU7U0FDekMsQ0FBQyxDQUFDO0tBQ0o7O0FBckNILDhDQXNDQzs7O0FBRUQ7O0dBRUc7QUFDSCxJQUFZLGNBb0JYO0FBcEJELFdBQVksY0FBYztJQUN4Qjs7OztPQUlHO0lBQ0gseURBQXVDLENBQUE7SUFFdkM7Ozs7O09BS0c7SUFDSCx3RUFBc0QsQ0FBQTtJQUV0RDs7T0FFRztJQUNILGtEQUFnQyxDQUFBO0FBQ2xDLENBQUMsRUFwQlcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFvQnpCO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLHFCQWVYO0FBZkQsV0FBWSxxQkFBcUI7SUFDL0I7O09BRUc7SUFDSCw0Q0FBbUIsQ0FBQTtJQUVuQjs7T0FFRztJQUNILDRDQUFtQixDQUFBO0lBRW5COztPQUVHO0lBQ0gsNENBQW1CLENBQUE7QUFDckIsQ0FBQyxFQWZXLHFCQUFxQixHQUFyQiw2QkFBcUIsS0FBckIsNkJBQXFCLFFBZWhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHVyYXRpb24sIExhenkgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUF1dG9TY2FsaW5nR3JvdXAgfSBmcm9tICcuL2F1dG8tc2NhbGluZy1ncm91cCc7XG5pbXBvcnQgeyBDZm5TY2FsaW5nUG9saWN5IH0gZnJvbSAnLi9hdXRvc2NhbGluZy5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgc2NhbGluZyBwb2xpY3lcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdGVwU2NhbGluZ0FjdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBhdXRvIHNjYWxpbmcgZ3JvdXBcbiAgICovXG4gIHJlYWRvbmx5IGF1dG9TY2FsaW5nR3JvdXA6IElBdXRvU2NhbGluZ0dyb3VwO1xuXG4gIC8qKlxuICAgKiBQZXJpb2QgYWZ0ZXIgYSBzY2FsaW5nIGNvbXBsZXRlcyBiZWZvcmUgYW5vdGhlciBzY2FsaW5nIGFjdGl2aXR5IGNhbiBzdGFydC5cbiAgICpcbiAgICogQGRlZmF1bHQgVGhlIGRlZmF1bHQgY29vbGRvd24gY29uZmlndXJlZCBvbiB0aGUgQXV0b1NjYWxpbmdHcm91cFxuICAgKi9cbiAgcmVhZG9ubHkgY29vbGRvd24/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogRXN0aW1hdGVkIHRpbWUgdW50aWwgYSBuZXdseSBsYXVuY2hlZCBpbnN0YW5jZSBjYW4gc2VuZCBtZXRyaWNzIHRvIENsb3VkV2F0Y2guXG4gICAqXG4gICAqIEBkZWZhdWx0IFNhbWUgYXMgdGhlIGNvb2xkb3duXG4gICAqL1xuICByZWFkb25seSBlc3RpbWF0ZWRJbnN0YW5jZVdhcm11cD86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBIb3cgdGhlIGFkanVzdG1lbnQgbnVtYmVycyBhcmUgaW50ZXJwcmV0ZWRcbiAgICpcbiAgICogQGRlZmF1bHQgQ2hhbmdlSW5DYXBhY2l0eVxuICAgKi9cbiAgcmVhZG9ubHkgYWRqdXN0bWVudFR5cGU/OiBBZGp1c3RtZW50VHlwZTtcblxuICAvKipcbiAgICogTWluaW11bSBhYnNvbHV0ZSBudW1iZXIgdG8gYWRqdXN0IGNhcGFjaXR5IHdpdGggYXMgcmVzdWx0IG9mIHBlcmNlbnRhZ2Ugc2NhbGluZy5cbiAgICpcbiAgICogT25seSB3aGVuIHVzaW5nIEFkanVzdG1lbnRUeXBlID0gUGVyY2VudENoYW5nZUluQ2FwYWNpdHksIHRoaXMgbnVtYmVyIGNvbnRyb2xzXG4gICAqIHRoZSBtaW5pbXVtIGFic29sdXRlIGVmZmVjdCBzaXplLlxuICAgKlxuICAgKiBAZGVmYXVsdCBObyBtaW5pbXVtIHNjYWxpbmcgZWZmZWN0XG4gICAqL1xuICByZWFkb25seSBtaW5BZGp1c3RtZW50TWFnbml0dWRlPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgYWdncmVnYXRpb24gdHlwZSBmb3IgdGhlIENsb3VkV2F0Y2ggbWV0cmljcy5cbiAgICpcbiAgICogQGRlZmF1bHQgQXZlcmFnZVxuICAgKi9cbiAgcmVhZG9ubHkgbWV0cmljQWdncmVnYXRpb25UeXBlPzogTWV0cmljQWdncmVnYXRpb25UeXBlO1xufVxuXG4vKipcbiAqIERlZmluZSBhIHN0ZXAgc2NhbGluZyBhY3Rpb25cbiAqXG4gKiBUaGlzIGtpbmQgb2Ygc2NhbGluZyBwb2xpY3kgYWRqdXN0cyB0aGUgdGFyZ2V0IGNhcGFjaXR5IGluIGNvbmZpZ3VyYWJsZVxuICogc3RlcHMuIFRoZSBzaXplIG9mIHRoZSBzdGVwIGlzIGNvbmZpZ3VyYWJsZSBiYXNlZCBvbiB0aGUgbWV0cmljJ3MgZGlzdGFuY2VcbiAqIHRvIGl0cyBhbGFybSB0aHJlc2hvbGQuXG4gKlxuICogVGhpcyBBY3Rpb24gbXVzdCBiZSB1c2VkIGFzIHRoZSB0YXJnZXQgb2YgYSBDbG91ZFdhdGNoIGFsYXJtIHRvIHRha2UgZWZmZWN0LlxuICovXG5leHBvcnQgY2xhc3MgU3RlcFNjYWxpbmdBY3Rpb24gZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAvKipcbiAgICogQVJOIG9mIHRoZSBzY2FsaW5nIHBvbGljeVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHNjYWxpbmdQb2xpY3lBcm46IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IGFkanVzdG1lbnRzID0gbmV3IEFycmF5PENmblNjYWxpbmdQb2xpY3kuU3RlcEFkanVzdG1lbnRQcm9wZXJ0eT4oKTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU3RlcFNjYWxpbmdBY3Rpb25Qcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5TY2FsaW5nUG9saWN5KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHBvbGljeVR5cGU6ICdTdGVwU2NhbGluZycsXG4gICAgICBhdXRvU2NhbGluZ0dyb3VwTmFtZTogcHJvcHMuYXV0b1NjYWxpbmdHcm91cC5hdXRvU2NhbGluZ0dyb3VwTmFtZSxcbiAgICAgIGNvb2xkb3duOiBwcm9wcy5jb29sZG93biAmJiBwcm9wcy5jb29sZG93bi50b1NlY29uZHMoKS50b1N0cmluZygpLFxuICAgICAgZXN0aW1hdGVkSW5zdGFuY2VXYXJtdXA6IHByb3BzLmVzdGltYXRlZEluc3RhbmNlV2FybXVwICYmIHByb3BzLmVzdGltYXRlZEluc3RhbmNlV2FybXVwLnRvU2Vjb25kcygpLFxuICAgICAgYWRqdXN0bWVudFR5cGU6IHByb3BzLmFkanVzdG1lbnRUeXBlLFxuICAgICAgbWluQWRqdXN0bWVudE1hZ25pdHVkZTogcHJvcHMubWluQWRqdXN0bWVudE1hZ25pdHVkZSxcbiAgICAgIG1ldHJpY0FnZ3JlZ2F0aW9uVHlwZTogcHJvcHMubWV0cmljQWdncmVnYXRpb25UeXBlLFxuICAgICAgc3RlcEFkanVzdG1lbnRzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMuYWRqdXN0bWVudHMgfSksXG4gICAgfSk7XG5cbiAgICB0aGlzLnNjYWxpbmdQb2xpY3lBcm4gPSByZXNvdXJjZS5yZWY7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIGFkanVzbWVudCBpbnRlcnZhbCB0byB0aGUgU2NhbGluZ0FjdGlvblxuICAgKi9cbiAgcHVibGljIGFkZEFkanVzdG1lbnQoYWRqdXN0bWVudDogQWRqdXN0bWVudFRpZXIpIHtcbiAgICBpZiAoYWRqdXN0bWVudC5sb3dlckJvdW5kID09PSB1bmRlZmluZWQgJiYgYWRqdXN0bWVudC51cHBlckJvdW5kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3Qgb25lIG9mIGxvd2VyQm91bmQgb3IgdXBwZXJCb3VuZCBpcyByZXF1aXJlZCcpO1xuICAgIH1cbiAgICB0aGlzLmFkanVzdG1lbnRzLnB1c2goe1xuICAgICAgbWV0cmljSW50ZXJ2YWxMb3dlckJvdW5kOiBhZGp1c3RtZW50Lmxvd2VyQm91bmQsXG4gICAgICBtZXRyaWNJbnRlcnZhbFVwcGVyQm91bmQ6IGFkanVzdG1lbnQudXBwZXJCb3VuZCxcbiAgICAgIHNjYWxpbmdBZGp1c3RtZW50OiBhZGp1c3RtZW50LmFkanVzdG1lbnQsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBIb3cgYWRqdXN0bWVudCBudW1iZXJzIGFyZSBpbnRlcnByZXRlZFxuICovXG5leHBvcnQgZW51bSBBZGp1c3RtZW50VHlwZSB7XG4gIC8qKlxuICAgKiBBZGQgdGhlIGFkanVzdG1lbnQgbnVtYmVyIHRvIHRoZSBjdXJyZW50IGNhcGFjaXR5LlxuICAgKlxuICAgKiBBIHBvc2l0aXZlIG51bWJlciBpbmNyZWFzZXMgY2FwYWNpdHksIGEgbmVnYXRpdmUgbnVtYmVyIGRlY3JlYXNlcyBjYXBhY2l0eS5cbiAgICovXG4gIENIQU5HRV9JTl9DQVBBQ0lUWSA9ICdDaGFuZ2VJbkNhcGFjaXR5JyxcblxuICAvKipcbiAgICogQWRkIHRoaXMgcGVyY2VudGFnZSBvZiB0aGUgY3VycmVudCBjYXBhY2l0eSB0byBpdHNlbGYuXG4gICAqXG4gICAqIFRoZSBudW1iZXIgbXVzdCBiZSBiZXR3ZWVuIC0xMDAgYW5kIDEwMDsgYSBwb3NpdGl2ZSBudW1iZXIgaW5jcmVhc2VzXG4gICAqIGNhcGFjaXR5IGFuZCBhIG5lZ2F0aXZlIG51bWJlciBkZWNyZWFzZXMgaXQuXG4gICAqL1xuICBQRVJDRU5UX0NIQU5HRV9JTl9DQVBBQ0lUWSA9ICdQZXJjZW50Q2hhbmdlSW5DYXBhY2l0eScsXG5cbiAgLyoqXG4gICAqIE1ha2UgdGhlIGNhcGFjaXR5IGVxdWFsIHRvIHRoZSBleGFjdCBudW1iZXIgZ2l2ZW4uXG4gICAqL1xuICBFWEFDVF9DQVBBQ0lUWSA9ICdFeGFjdENhcGFjaXR5Jyxcbn1cblxuLyoqXG4gKiBIb3cgdGhlIHNjYWxpbmcgbWV0cmljIGlzIGdvaW5nIHRvIGJlIGFnZ3JlZ2F0ZWRcbiAqL1xuZXhwb3J0IGVudW0gTWV0cmljQWdncmVnYXRpb25UeXBlIHtcbiAgLyoqXG4gICAqIEF2ZXJhZ2VcbiAgICovXG4gIEFWRVJBR0UgPSAnQXZlcmFnZScsXG5cbiAgLyoqXG4gICAqIE1pbmltdW1cbiAgICovXG4gIE1JTklNVU0gPSAnTWluaW11bScsXG5cbiAgLyoqXG4gICAqIE1heGltdW1cbiAgICovXG4gIE1BWElNVU0gPSAnTWF4aW11bSdcbn1cblxuLyoqXG4gKiBBbiBhZGp1c3RtZW50XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWRqdXN0bWVudFRpZXIge1xuICAvKipcbiAgICogV2hhdCBudW1iZXIgdG8gYWRqdXN0IHRoZSBjYXBhY2l0eSB3aXRoXG4gICAqXG4gICAqIFRoZSBudW1iZXIgaXMgaW50ZXJwZXRlZCBhcyBhbiBhZGRlZCBjYXBhY2l0eSwgYSBuZXcgZml4ZWQgY2FwYWNpdHkgb3IgYW5cbiAgICogYWRkZWQgcGVyY2VudGFnZSBkZXBlbmRpbmcgb24gdGhlIEFkanVzdG1lbnRUeXBlIHZhbHVlIG9mIHRoZVxuICAgKiBTdGVwU2NhbGluZ1BvbGljeS5cbiAgICpcbiAgICogQ2FuIGJlIHBvc2l0aXZlIG9yIG5lZ2F0aXZlLlxuICAgKi9cbiAgcmVhZG9ubHkgYWRqdXN0bWVudDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBMb3dlciBib3VuZCB3aGVyZSB0aGlzIHNjYWxpbmcgdGllciBhcHBsaWVzLlxuICAgKlxuICAgKiBUaGUgc2NhbGluZyB0aWVyIGFwcGxpZXMgaWYgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgbWV0cmljXG4gICAqIHZhbHVlIGFuZCBpdHMgYWxhcm0gdGhyZXNob2xkIGlzIGhpZ2hlciB0aGFuIHRoaXMgdmFsdWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC1JbmZpbml0eSBpZiB0aGlzIGlzIHRoZSBmaXJzdCB0aWVyLCBvdGhlcndpc2UgdGhlIHVwcGVyQm91bmQgb2YgdGhlIHByZXZpb3VzIHRpZXJcbiAgICovXG4gIHJlYWRvbmx5IGxvd2VyQm91bmQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFVwcGVyIGJvdW5kIHdoZXJlIHRoaXMgc2NhbGluZyB0aWVyIGFwcGxpZXNcbiAgICpcbiAgICogVGhlIHNjYWxpbmcgdGllciBhcHBsaWVzIGlmIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIG1ldHJpY1xuICAgKiB2YWx1ZSBhbmQgaXRzIGFsYXJtIHRocmVzaG9sZCBpcyBsb3dlciB0aGFuIHRoaXMgdmFsdWUuXG4gICAqXG4gICAqIEBkZWZhdWx0ICtJbmZpbml0eVxuICAgKi9cbiAgcmVhZG9ubHkgdXBwZXJCb3VuZD86IG51bWJlcjtcbn1cbiJdfQ==