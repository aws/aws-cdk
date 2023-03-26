"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseScalableAttribute = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const constructs_1 = require("constructs");
const scalable_target_1 = require("./scalable-target");
/**
 * Represent an attribute for which autoscaling can be configured
 *
 * This class is basically a light wrapper around ScalableTarget, but with
 * all methods protected instead of public so they can be selectively
 * exposed and/or more specific versions of them can be exposed by derived
 * classes for individual services support autoscaling.
 *
 * Typical use cases:
 *
 * - Hide away the PredefinedMetric enum for target tracking policies.
 * - Don't expose all scaling methods (for example Dynamo tables don't support
 *   Step Scaling, so the Dynamo subclass won't expose this method).
 */
class BaseScalableAttribute extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_applicationautoscaling_BaseScalableAttributeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, BaseScalableAttribute);
            }
            throw error;
        }
        this.target = new scalable_target_1.ScalableTarget(this, 'Target', {
            serviceNamespace: this.props.serviceNamespace,
            scalableDimension: this.props.dimension,
            resourceId: this.props.resourceId,
            role: this.props.role,
            minCapacity: props.minCapacity ?? 1,
            maxCapacity: props.maxCapacity,
        });
    }
    /**
     * Scale out or in based on time
     */
    doScaleOnSchedule(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_applicationautoscaling_ScalingSchedule(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.doScaleOnSchedule);
            }
            throw error;
        }
        this.target.scaleOnSchedule(id, props);
    }
    /**
     * Scale out or in based on a metric value
     */
    doScaleOnMetric(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_applicationautoscaling_BasicStepScalingPolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.doScaleOnMetric);
            }
            throw error;
        }
        this.target.scaleOnMetric(id, props);
    }
    /**
     * Scale out or in in order to keep a metric around a target value
     */
    doScaleToTrackMetric(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_applicationautoscaling_BasicTargetTrackingScalingPolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.doScaleToTrackMetric);
            }
            throw error;
        }
        this.target.scaleToTrackMetric(id, props);
    }
}
exports.BaseScalableAttribute = BaseScalableAttribute;
_a = JSII_RTTI_SYMBOL_1;
BaseScalableAttribute[_a] = { fqn: "@aws-cdk/aws-applicationautoscaling.BaseScalableAttribute", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1zY2FsYWJsZS1hdHRyaWJ1dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNlLXNjYWxhYmxlLWF0dHJpYnV0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwyQ0FBdUM7QUFDdkMsdURBQXNGO0FBNkJ0Rjs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsTUFBc0IscUJBQXNCLFNBQVEsc0JBQVM7SUFHM0QsWUFBbUIsS0FBZ0IsRUFBRSxFQUFVLEVBQXFCLEtBQWlDO1FBQ25HLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFEaUQsVUFBSyxHQUFMLEtBQUssQ0FBNEI7Ozs7OzsrQ0FIakYscUJBQXFCOzs7O1FBTXZDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQ0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDL0MsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0I7WUFDN0MsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTO1lBQ3ZDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVU7WUFDakMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSTtZQUNyQixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsSUFBSSxDQUFDO1lBQ25DLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztTQUMvQixDQUFDLENBQUM7S0FDSjtJQUVEOztPQUVHO0lBQ08saUJBQWlCLENBQUMsRUFBVSxFQUFFLEtBQXNCOzs7Ozs7Ozs7O1FBQzVELElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN4QztJQUVEOztPQUVHO0lBQ08sZUFBZSxDQUFDLEVBQVUsRUFBRSxLQUFrQzs7Ozs7Ozs7OztRQUN0RSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDdEM7SUFFRDs7T0FFRztJQUNPLG9CQUFvQixDQUFDLEVBQVUsRUFBRSxLQUE0Qzs7Ozs7Ozs7OztRQUNyRixJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUMzQzs7QUFuQ0gsc0RBb0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBTY2FsYWJsZVRhcmdldCwgU2NhbGluZ1NjaGVkdWxlLCBTZXJ2aWNlTmFtZXNwYWNlIH0gZnJvbSAnLi9zY2FsYWJsZS10YXJnZXQnO1xuaW1wb3J0IHsgQmFzaWNTdGVwU2NhbGluZ1BvbGljeVByb3BzIH0gZnJvbSAnLi9zdGVwLXNjYWxpbmctcG9saWN5JztcbmltcG9ydCB7IEJhc2ljVGFyZ2V0VHJhY2tpbmdTY2FsaW5nUG9saWN5UHJvcHMgfSBmcm9tICcuL3RhcmdldC10cmFja2luZy1zY2FsaW5nLXBvbGljeSc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBTY2FsYWJsZVRhYmxlQXR0cmlidXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQmFzZVNjYWxhYmxlQXR0cmlidXRlUHJvcHMgZXh0ZW5kcyBFbmFibGVTY2FsaW5nUHJvcHMge1xuICAvKipcbiAgICogU2VydmljZSBuYW1lc3BhY2Ugb2YgdGhlIHNjYWxhYmxlIGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZU5hbWVzcGFjZTogU2VydmljZU5hbWVzcGFjZTtcblxuICAvKipcbiAgICogUmVzb3VyY2UgSUQgb2YgdGhlIGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTY2FsYWJsZSBkaW1lbnNpb24gb2YgdGhlIGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgZGltZW5zaW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJvbGUgdG8gdXNlIGZvciBzY2FsaW5nXG4gICAqL1xuICByZWFkb25seSByb2xlOiBpYW0uSVJvbGU7XG59XG5cbi8qKlxuICogUmVwcmVzZW50IGFuIGF0dHJpYnV0ZSBmb3Igd2hpY2ggYXV0b3NjYWxpbmcgY2FuIGJlIGNvbmZpZ3VyZWRcbiAqXG4gKiBUaGlzIGNsYXNzIGlzIGJhc2ljYWxseSBhIGxpZ2h0IHdyYXBwZXIgYXJvdW5kIFNjYWxhYmxlVGFyZ2V0LCBidXQgd2l0aFxuICogYWxsIG1ldGhvZHMgcHJvdGVjdGVkIGluc3RlYWQgb2YgcHVibGljIHNvIHRoZXkgY2FuIGJlIHNlbGVjdGl2ZWx5XG4gKiBleHBvc2VkIGFuZC9vciBtb3JlIHNwZWNpZmljIHZlcnNpb25zIG9mIHRoZW0gY2FuIGJlIGV4cG9zZWQgYnkgZGVyaXZlZFxuICogY2xhc3NlcyBmb3IgaW5kaXZpZHVhbCBzZXJ2aWNlcyBzdXBwb3J0IGF1dG9zY2FsaW5nLlxuICpcbiAqIFR5cGljYWwgdXNlIGNhc2VzOlxuICpcbiAqIC0gSGlkZSBhd2F5IHRoZSBQcmVkZWZpbmVkTWV0cmljIGVudW0gZm9yIHRhcmdldCB0cmFja2luZyBwb2xpY2llcy5cbiAqIC0gRG9uJ3QgZXhwb3NlIGFsbCBzY2FsaW5nIG1ldGhvZHMgKGZvciBleGFtcGxlIER5bmFtbyB0YWJsZXMgZG9uJ3Qgc3VwcG9ydFxuICogICBTdGVwIFNjYWxpbmcsIHNvIHRoZSBEeW5hbW8gc3ViY2xhc3Mgd29uJ3QgZXhwb3NlIHRoaXMgbWV0aG9kKS5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VTY2FsYWJsZUF0dHJpYnV0ZSBleHRlbmRzIENvbnN0cnVjdCB7XG4gIHByaXZhdGUgdGFyZ2V0OiBTY2FsYWJsZVRhcmdldDtcblxuICBwdWJsaWMgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvdGVjdGVkIHJlYWRvbmx5IHByb3BzOiBCYXNlU2NhbGFibGVBdHRyaWJ1dGVQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLnRhcmdldCA9IG5ldyBTY2FsYWJsZVRhcmdldCh0aGlzLCAnVGFyZ2V0Jywge1xuICAgICAgc2VydmljZU5hbWVzcGFjZTogdGhpcy5wcm9wcy5zZXJ2aWNlTmFtZXNwYWNlLFxuICAgICAgc2NhbGFibGVEaW1lbnNpb246IHRoaXMucHJvcHMuZGltZW5zaW9uLFxuICAgICAgcmVzb3VyY2VJZDogdGhpcy5wcm9wcy5yZXNvdXJjZUlkLFxuICAgICAgcm9sZTogdGhpcy5wcm9wcy5yb2xlLFxuICAgICAgbWluQ2FwYWNpdHk6IHByb3BzLm1pbkNhcGFjaXR5ID8/IDEsXG4gICAgICBtYXhDYXBhY2l0eTogcHJvcHMubWF4Q2FwYWNpdHksXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2NhbGUgb3V0IG9yIGluIGJhc2VkIG9uIHRpbWVcbiAgICovXG4gIHByb3RlY3RlZCBkb1NjYWxlT25TY2hlZHVsZShpZDogc3RyaW5nLCBwcm9wczogU2NhbGluZ1NjaGVkdWxlKSB7XG4gICAgdGhpcy50YXJnZXQuc2NhbGVPblNjaGVkdWxlKGlkLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogU2NhbGUgb3V0IG9yIGluIGJhc2VkIG9uIGEgbWV0cmljIHZhbHVlXG4gICAqL1xuICBwcm90ZWN0ZWQgZG9TY2FsZU9uTWV0cmljKGlkOiBzdHJpbmcsIHByb3BzOiBCYXNpY1N0ZXBTY2FsaW5nUG9saWN5UHJvcHMpIHtcbiAgICB0aGlzLnRhcmdldC5zY2FsZU9uTWV0cmljKGlkLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogU2NhbGUgb3V0IG9yIGluIGluIG9yZGVyIHRvIGtlZXAgYSBtZXRyaWMgYXJvdW5kIGEgdGFyZ2V0IHZhbHVlXG4gICAqL1xuICBwcm90ZWN0ZWQgZG9TY2FsZVRvVHJhY2tNZXRyaWMoaWQ6IHN0cmluZywgcHJvcHM6IEJhc2ljVGFyZ2V0VHJhY2tpbmdTY2FsaW5nUG9saWN5UHJvcHMpIHtcbiAgICB0aGlzLnRhcmdldC5zY2FsZVRvVHJhY2tNZXRyaWMoaWQsIHByb3BzKTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGVuYWJsaW5nIEFwcGxpY2F0aW9uIEF1dG8gU2NhbGluZ1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEVuYWJsZVNjYWxpbmdQcm9wcyB7XG4gIC8qKlxuICAgKiBNaW5pbXVtIGNhcGFjaXR5IHRvIHNjYWxlIHRvXG4gICAqXG4gICAqIEBkZWZhdWx0IDFcbiAgICovXG4gIHJlYWRvbmx5IG1pbkNhcGFjaXR5PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBNYXhpbXVtIGNhcGFjaXR5IHRvIHNjYWxlIHRvXG4gICAqL1xuICByZWFkb25seSBtYXhDYXBhY2l0eTogbnVtYmVyO1xufVxuIl19