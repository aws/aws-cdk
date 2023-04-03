"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricAggregationType = exports.AdjustmentType = exports.StepScalingAction = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const applicationautoscaling_generated_1 = require("./applicationautoscaling.generated");
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
            jsiiDeprecationWarnings._aws_cdk_aws_applicationautoscaling_StepScalingActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, StepScalingAction);
            }
            throw error;
        }
        // Cloudformation requires either the ResourceId, ScalableDimension, and ServiceNamespace
        // properties, or the ScalingTargetId property, but not both.
        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-applicationautoscaling-scalingpolicy.html
        const resource = new applicationautoscaling_generated_1.CfnScalingPolicy(this, 'Resource', {
            policyName: props.policyName || cdk.Names.uniqueId(this),
            policyType: 'StepScaling',
            scalingTargetId: props.scalingTarget.scalableTargetId,
            stepScalingPolicyConfiguration: {
                adjustmentType: props.adjustmentType,
                cooldown: props.cooldown && props.cooldown.toSeconds(),
                minAdjustmentMagnitude: props.minAdjustmentMagnitude,
                metricAggregationType: props.metricAggregationType,
                stepAdjustments: cdk.Lazy.any({ produce: () => this.adjustments }),
            },
        });
        this.scalingPolicyArn = resource.ref;
    }
    /**
     * Add an adjusment interval to the ScalingAction
     */
    addAdjustment(adjustment) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_applicationautoscaling_AdjustmentTier(adjustment);
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
StepScalingAction[_a] = { fqn: "@aws-cdk/aws-applicationautoscaling.StepScalingAction", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcC1zY2FsaW5nLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0ZXAtc2NhbGluZy1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscUNBQXFDO0FBQ3JDLDJDQUF1QztBQUN2Qyx5RkFBc0U7QUEwRHRFOzs7Ozs7OztHQVFHO0FBQ0gsTUFBYSxpQkFBa0IsU0FBUSxzQkFBUztJQVE5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTZCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFIRixnQkFBVyxHQUFHLElBQUksS0FBSyxFQUEyQyxDQUFDOzs7Ozs7K0NBTnpFLGlCQUFpQjs7OztRQVcxQix5RkFBeUY7UUFDekYsNkRBQTZEO1FBQzdELHdIQUF3SDtRQUN4SCxNQUFNLFFBQVEsR0FBRyxJQUFJLG1EQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDdEQsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ3hELFVBQVUsRUFBRSxhQUFhO1lBQ3pCLGVBQWUsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLGdCQUFnQjtZQUNyRCw4QkFBOEIsRUFBRTtnQkFDOUIsY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjO2dCQUNwQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRTtnQkFDdEQsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLHNCQUFzQjtnQkFDcEQscUJBQXFCLEVBQUUsS0FBSyxDQUFDLHFCQUFxQjtnQkFDbEQsZUFBZSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUNSO1NBQzdELENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO0tBQ3RDO0lBRUQ7O09BRUc7SUFDSSxhQUFhLENBQUMsVUFBMEI7Ozs7Ozs7Ozs7UUFDN0MsSUFBSSxVQUFVLENBQUMsVUFBVSxLQUFLLFNBQVMsSUFBSSxVQUFVLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtZQUM5RSxNQUFNLElBQUksS0FBSyxDQUFDLHNEQUFzRCxDQUFDLENBQUM7U0FDekU7UUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztZQUNwQix3QkFBd0IsRUFBRSxVQUFVLENBQUMsVUFBVTtZQUMvQyx3QkFBd0IsRUFBRSxVQUFVLENBQUMsVUFBVTtZQUMvQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsVUFBVTtTQUN6QyxDQUFDLENBQUM7S0FDSjs7QUExQ0gsOENBMkNDOzs7QUFFRDs7R0FFRztBQUNILElBQVksY0FvQlg7QUFwQkQsV0FBWSxjQUFjO0lBQ3hCOzs7O09BSUc7SUFDSCx5REFBdUMsQ0FBQTtJQUV2Qzs7Ozs7T0FLRztJQUNILHdFQUFzRCxDQUFBO0lBRXREOztPQUVHO0lBQ0gsa0RBQWdDLENBQUE7QUFDbEMsQ0FBQyxFQXBCVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQW9CekI7QUFFRDs7R0FFRztBQUNILElBQVkscUJBZVg7QUFmRCxXQUFZLHFCQUFxQjtJQUMvQjs7T0FFRztJQUNILDRDQUFtQixDQUFBO0lBRW5COztPQUVHO0lBQ0gsNENBQW1CLENBQUE7SUFFbkI7O09BRUc7SUFDSCw0Q0FBbUIsQ0FBQTtBQUNyQixDQUFDLEVBZlcscUJBQXFCLEdBQXJCLDZCQUFxQixLQUFyQiw2QkFBcUIsUUFlaEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmblNjYWxpbmdQb2xpY3kgfSBmcm9tICcuL2FwcGxpY2F0aW9uYXV0b3NjYWxpbmcuZ2VuZXJhdGVkJztcbmltcG9ydCB7IElTY2FsYWJsZVRhcmdldCB9IGZyb20gJy4vc2NhbGFibGUtdGFyZ2V0JztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIHNjYWxpbmcgcG9saWN5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RlcFNjYWxpbmdBY3Rpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgc2NhbGFibGUgdGFyZ2V0XG4gICAqL1xuICByZWFkb25seSBzY2FsaW5nVGFyZ2V0OiBJU2NhbGFibGVUYXJnZXQ7XG5cbiAgLyoqXG4gICAqIEEgbmFtZSBmb3IgdGhlIHNjYWxpbmcgcG9saWN5XG4gICAqXG4gICAqIEBkZWZhdWx0IEF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIG5hbWVcbiAgICovXG4gIHJlYWRvbmx5IHBvbGljeU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEhvdyB0aGUgYWRqdXN0bWVudCBudW1iZXJzIGFyZSBpbnRlcnByZXRlZFxuICAgKlxuICAgKiBAZGVmYXVsdCBDaGFuZ2VJbkNhcGFjaXR5XG4gICAqL1xuICByZWFkb25seSBhZGp1c3RtZW50VHlwZT86IEFkanVzdG1lbnRUeXBlO1xuXG4gIC8qKlxuICAgKiBHcmFjZSBwZXJpb2QgYWZ0ZXIgc2NhbGluZyBhY3Rpdml0eS5cbiAgICpcbiAgICogRm9yIHNjYWxlIG91dCBwb2xpY2llcywgbXVsdGlwbGUgc2NhbGUgb3V0cyBkdXJpbmcgdGhlIGNvb2xkb3duIHBlcmlvZCBhcmVcbiAgICogc3F1YXNoZWQgc28gdGhhdCBvbmx5IHRoZSBiaWdnZXN0IHNjYWxlIG91dCBoYXBwZW5zLlxuICAgKlxuICAgKiBGb3Igc2NhbGUgaW4gcG9saWNpZXMsIHN1YnNlcXVlbnQgc2NhbGUgaW5zIGR1cmluZyB0aGUgY29vbGRvd24gcGVyaW9kIGFyZVxuICAgKiBpZ25vcmVkLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hdXRvc2NhbGluZy9hcHBsaWNhdGlvbi9BUElSZWZlcmVuY2UvQVBJX1N0ZXBTY2FsaW5nUG9saWN5Q29uZmlndXJhdGlvbi5odG1sXG4gICAqIEBkZWZhdWx0IE5vIGNvb2xkb3duIHBlcmlvZFxuICAgKi9cbiAgcmVhZG9ubHkgY29vbGRvd24/OiBjZGsuRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIE1pbmltdW0gYWJzb2x1dGUgbnVtYmVyIHRvIGFkanVzdCBjYXBhY2l0eSB3aXRoIGFzIHJlc3VsdCBvZiBwZXJjZW50YWdlIHNjYWxpbmcuXG4gICAqXG4gICAqIE9ubHkgd2hlbiB1c2luZyBBZGp1c3RtZW50VHlwZSA9IFBlcmNlbnRDaGFuZ2VJbkNhcGFjaXR5LCB0aGlzIG51bWJlciBjb250cm9sc1xuICAgKiB0aGUgbWluaW11bSBhYnNvbHV0ZSBlZmZlY3Qgc2l6ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gbWluaW11bSBzY2FsaW5nIGVmZmVjdFxuICAgKi9cbiAgcmVhZG9ubHkgbWluQWRqdXN0bWVudE1hZ25pdHVkZT86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIGFnZ3JlZ2F0aW9uIHR5cGUgZm9yIHRoZSBDbG91ZFdhdGNoIG1ldHJpY3MuXG4gICAqXG4gICAqIEBkZWZhdWx0IEF2ZXJhZ2VcbiAgICovXG4gIHJlYWRvbmx5IG1ldHJpY0FnZ3JlZ2F0aW9uVHlwZT86IE1ldHJpY0FnZ3JlZ2F0aW9uVHlwZTtcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBzdGVwIHNjYWxpbmcgYWN0aW9uXG4gKlxuICogVGhpcyBraW5kIG9mIHNjYWxpbmcgcG9saWN5IGFkanVzdHMgdGhlIHRhcmdldCBjYXBhY2l0eSBpbiBjb25maWd1cmFibGVcbiAqIHN0ZXBzLiBUaGUgc2l6ZSBvZiB0aGUgc3RlcCBpcyBjb25maWd1cmFibGUgYmFzZWQgb24gdGhlIG1ldHJpYydzIGRpc3RhbmNlXG4gKiB0byBpdHMgYWxhcm0gdGhyZXNob2xkLlxuICpcbiAqIFRoaXMgQWN0aW9uIG11c3QgYmUgdXNlZCBhcyB0aGUgdGFyZ2V0IG9mIGEgQ2xvdWRXYXRjaCBhbGFybSB0byB0YWtlIGVmZmVjdC5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0ZXBTY2FsaW5nQWN0aW9uIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgLyoqXG4gICAqIEFSTiBvZiB0aGUgc2NhbGluZyBwb2xpY3lcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzY2FsaW5nUG9saWN5QXJuOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBhZGp1c3RtZW50cyA9IG5ldyBBcnJheTxDZm5TY2FsaW5nUG9saWN5LlN0ZXBBZGp1c3RtZW50UHJvcGVydHk+KCk7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN0ZXBTY2FsaW5nQWN0aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gQ2xvdWRmb3JtYXRpb24gcmVxdWlyZXMgZWl0aGVyIHRoZSBSZXNvdXJjZUlkLCBTY2FsYWJsZURpbWVuc2lvbiwgYW5kIFNlcnZpY2VOYW1lc3BhY2VcbiAgICAvLyBwcm9wZXJ0aWVzLCBvciB0aGUgU2NhbGluZ1RhcmdldElkIHByb3BlcnR5LCBidXQgbm90IGJvdGguXG4gICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWFwcGxpY2F0aW9uYXV0b3NjYWxpbmctc2NhbGluZ3BvbGljeS5odG1sXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuU2NhbGluZ1BvbGljeSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBwb2xpY3lOYW1lOiBwcm9wcy5wb2xpY3lOYW1lIHx8IGNkay5OYW1lcy51bmlxdWVJZCh0aGlzKSxcbiAgICAgIHBvbGljeVR5cGU6ICdTdGVwU2NhbGluZycsXG4gICAgICBzY2FsaW5nVGFyZ2V0SWQ6IHByb3BzLnNjYWxpbmdUYXJnZXQuc2NhbGFibGVUYXJnZXRJZCxcbiAgICAgIHN0ZXBTY2FsaW5nUG9saWN5Q29uZmlndXJhdGlvbjoge1xuICAgICAgICBhZGp1c3RtZW50VHlwZTogcHJvcHMuYWRqdXN0bWVudFR5cGUsXG4gICAgICAgIGNvb2xkb3duOiBwcm9wcy5jb29sZG93biAmJiBwcm9wcy5jb29sZG93bi50b1NlY29uZHMoKSxcbiAgICAgICAgbWluQWRqdXN0bWVudE1hZ25pdHVkZTogcHJvcHMubWluQWRqdXN0bWVudE1hZ25pdHVkZSxcbiAgICAgICAgbWV0cmljQWdncmVnYXRpb25UeXBlOiBwcm9wcy5tZXRyaWNBZ2dyZWdhdGlvblR5cGUsXG4gICAgICAgIHN0ZXBBZGp1c3RtZW50czogY2RrLkxhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5hZGp1c3RtZW50cyB9KSxcbiAgICAgIH0gYXMgQ2ZuU2NhbGluZ1BvbGljeS5TdGVwU2NhbGluZ1BvbGljeUNvbmZpZ3VyYXRpb25Qcm9wZXJ0eSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2NhbGluZ1BvbGljeUFybiA9IHJlc291cmNlLnJlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW4gYWRqdXNtZW50IGludGVydmFsIHRvIHRoZSBTY2FsaW5nQWN0aW9uXG4gICAqL1xuICBwdWJsaWMgYWRkQWRqdXN0bWVudChhZGp1c3RtZW50OiBBZGp1c3RtZW50VGllcikge1xuICAgIGlmIChhZGp1c3RtZW50Lmxvd2VyQm91bmQgPT09IHVuZGVmaW5lZCAmJiBhZGp1c3RtZW50LnVwcGVyQm91bmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdCBsZWFzdCBvbmUgb2YgbG93ZXJCb3VuZCBvciB1cHBlckJvdW5kIGlzIHJlcXVpcmVkJyk7XG4gICAgfVxuICAgIHRoaXMuYWRqdXN0bWVudHMucHVzaCh7XG4gICAgICBtZXRyaWNJbnRlcnZhbExvd2VyQm91bmQ6IGFkanVzdG1lbnQubG93ZXJCb3VuZCxcbiAgICAgIG1ldHJpY0ludGVydmFsVXBwZXJCb3VuZDogYWRqdXN0bWVudC51cHBlckJvdW5kLFxuICAgICAgc2NhbGluZ0FkanVzdG1lbnQ6IGFkanVzdG1lbnQuYWRqdXN0bWVudCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEhvdyBhZGp1c3RtZW50IG51bWJlcnMgYXJlIGludGVycHJldGVkXG4gKi9cbmV4cG9ydCBlbnVtIEFkanVzdG1lbnRUeXBlIHtcbiAgLyoqXG4gICAqIEFkZCB0aGUgYWRqdXN0bWVudCBudW1iZXIgdG8gdGhlIGN1cnJlbnQgY2FwYWNpdHkuXG4gICAqXG4gICAqIEEgcG9zaXRpdmUgbnVtYmVyIGluY3JlYXNlcyBjYXBhY2l0eSwgYSBuZWdhdGl2ZSBudW1iZXIgZGVjcmVhc2VzIGNhcGFjaXR5LlxuICAgKi9cbiAgQ0hBTkdFX0lOX0NBUEFDSVRZID0gJ0NoYW5nZUluQ2FwYWNpdHknLFxuXG4gIC8qKlxuICAgKiBBZGQgdGhpcyBwZXJjZW50YWdlIG9mIHRoZSBjdXJyZW50IGNhcGFjaXR5IHRvIGl0c2VsZi5cbiAgICpcbiAgICogVGhlIG51bWJlciBtdXN0IGJlIGJldHdlZW4gLTEwMCBhbmQgMTAwOyBhIHBvc2l0aXZlIG51bWJlciBpbmNyZWFzZXNcbiAgICogY2FwYWNpdHkgYW5kIGEgbmVnYXRpdmUgbnVtYmVyIGRlY3JlYXNlcyBpdC5cbiAgICovXG4gIFBFUkNFTlRfQ0hBTkdFX0lOX0NBUEFDSVRZID0gJ1BlcmNlbnRDaGFuZ2VJbkNhcGFjaXR5JyxcblxuICAvKipcbiAgICogTWFrZSB0aGUgY2FwYWNpdHkgZXF1YWwgdG8gdGhlIGV4YWN0IG51bWJlciBnaXZlbi5cbiAgICovXG4gIEVYQUNUX0NBUEFDSVRZID0gJ0V4YWN0Q2FwYWNpdHknLFxufVxuXG4vKipcbiAqIEhvdyB0aGUgc2NhbGluZyBtZXRyaWMgaXMgZ29pbmcgdG8gYmUgYWdncmVnYXRlZFxuICovXG5leHBvcnQgZW51bSBNZXRyaWNBZ2dyZWdhdGlvblR5cGUge1xuICAvKipcbiAgICogQXZlcmFnZVxuICAgKi9cbiAgQVZFUkFHRSA9ICdBdmVyYWdlJyxcblxuICAvKipcbiAgICogTWluaW11bVxuICAgKi9cbiAgTUlOSU1VTSA9ICdNaW5pbXVtJyxcblxuICAvKipcbiAgICogTWF4aW11bVxuICAgKi9cbiAgTUFYSU1VTSA9ICdNYXhpbXVtJ1xufVxuXG4vKipcbiAqIEFuIGFkanVzdG1lbnRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBZGp1c3RtZW50VGllciB7XG4gIC8qKlxuICAgKiBXaGF0IG51bWJlciB0byBhZGp1c3QgdGhlIGNhcGFjaXR5IHdpdGhcbiAgICpcbiAgICogVGhlIG51bWJlciBpcyBpbnRlcnBldGVkIGFzIGFuIGFkZGVkIGNhcGFjaXR5LCBhIG5ldyBmaXhlZCBjYXBhY2l0eSBvciBhblxuICAgKiBhZGRlZCBwZXJjZW50YWdlIGRlcGVuZGluZyBvbiB0aGUgQWRqdXN0bWVudFR5cGUgdmFsdWUgb2YgdGhlXG4gICAqIFN0ZXBTY2FsaW5nUG9saWN5LlxuICAgKlxuICAgKiBDYW4gYmUgcG9zaXRpdmUgb3IgbmVnYXRpdmUuXG4gICAqL1xuICByZWFkb25seSBhZGp1c3RtZW50OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIExvd2VyIGJvdW5kIHdoZXJlIHRoaXMgc2NhbGluZyB0aWVyIGFwcGxpZXMuXG4gICAqXG4gICAqIFRoZSBzY2FsaW5nIHRpZXIgYXBwbGllcyBpZiB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBtZXRyaWNcbiAgICogdmFsdWUgYW5kIGl0cyBhbGFybSB0aHJlc2hvbGQgaXMgaGlnaGVyIHRoYW4gdGhpcyB2YWx1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLUluZmluaXR5IGlmIHRoaXMgaXMgdGhlIGZpcnN0IHRpZXIsIG90aGVyd2lzZSB0aGUgdXBwZXJCb3VuZCBvZiB0aGUgcHJldmlvdXMgdGllclxuICAgKi9cbiAgcmVhZG9ubHkgbG93ZXJCb3VuZD86IG51bWJlcjtcblxuICAvKipcbiAgICogVXBwZXIgYm91bmQgd2hlcmUgdGhpcyBzY2FsaW5nIHRpZXIgYXBwbGllc1xuICAgKlxuICAgKiBUaGUgc2NhbGluZyB0aWVyIGFwcGxpZXMgaWYgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgbWV0cmljXG4gICAqIHZhbHVlIGFuZCBpdHMgYWxhcm0gdGhyZXNob2xkIGlzIGxvd2VyIHRoYW4gdGhpcyB2YWx1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgK0luZmluaXR5XG4gICAqL1xuICByZWFkb25seSB1cHBlckJvdW5kPzogbnVtYmVyO1xufVxuIl19