"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeBasedLinearTrafficRouting = exports.TimeBasedCanaryTrafficRouting = exports.AllAtOnceTrafficRouting = exports.TrafficRouting = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * Represents how traffic is shifted during a CodeDeploy deployment.
 */
class TrafficRouting {
    /**
     * Shifts 100% of traffic in a single shift.
     */
    static allAtOnce() {
        return new AllAtOnceTrafficRouting();
    }
    /**
     * Shifts a specified percentage of traffic, waits for a specified amount of time, then shifts the rest of traffic.
     */
    static timeBasedCanary(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codedeploy_TimeBasedCanaryTrafficRoutingProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.timeBasedCanary);
            }
            throw error;
        }
        return new TimeBasedCanaryTrafficRouting(props);
    }
    /**
     * Keeps shifting a specified percentage of traffic until reaching 100%, waiting for a specified amount of time in between each traffic shift.
     */
    static timeBasedLinear(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codedeploy_TimeBasedLinearTrafficRoutingProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.timeBasedLinear);
            }
            throw error;
        }
        return new TimeBasedLinearTrafficRouting(props);
    }
}
exports.TrafficRouting = TrafficRouting;
_a = JSII_RTTI_SYMBOL_1;
TrafficRouting[_a] = { fqn: "@aws-cdk/aws-codedeploy.TrafficRouting", version: "0.0.0" };
/**
 * Define a traffic routing config of type 'AllAtOnce'.
 */
class AllAtOnceTrafficRouting extends TrafficRouting {
    constructor() {
        super();
    }
    /**
     * Return a TrafficRoutingConfig of type `AllAtOnce`.
     */
    bind(_scope) {
        return {
            type: 'AllAtOnce',
        };
    }
}
exports.AllAtOnceTrafficRouting = AllAtOnceTrafficRouting;
_b = JSII_RTTI_SYMBOL_1;
AllAtOnceTrafficRouting[_b] = { fqn: "@aws-cdk/aws-codedeploy.AllAtOnceTrafficRouting", version: "0.0.0" };
/**
 * Define a traffic routing config of type 'TimeBasedCanary'.
 */
class TimeBasedCanaryTrafficRouting extends TrafficRouting {
    constructor(props) {
        super();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codedeploy_TimeBasedCanaryTrafficRoutingProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, TimeBasedCanaryTrafficRouting);
            }
            throw error;
        }
        this.interval = props.interval;
        this.percentage = props.percentage;
    }
    /**
     * Return a TrafficRoutingConfig of type `TimeBasedCanary`.
     */
    bind(_scope) {
        return {
            type: 'TimeBasedCanary',
            timeBasedCanary: {
                canaryInterval: this.interval.toMinutes(),
                canaryPercentage: this.percentage,
            },
        };
    }
}
exports.TimeBasedCanaryTrafficRouting = TimeBasedCanaryTrafficRouting;
_c = JSII_RTTI_SYMBOL_1;
TimeBasedCanaryTrafficRouting[_c] = { fqn: "@aws-cdk/aws-codedeploy.TimeBasedCanaryTrafficRouting", version: "0.0.0" };
/**
 * Define a traffic routing config of type 'TimeBasedLinear'.
 */
class TimeBasedLinearTrafficRouting extends TrafficRouting {
    constructor(props) {
        super();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codedeploy_TimeBasedLinearTrafficRoutingProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, TimeBasedLinearTrafficRouting);
            }
            throw error;
        }
        this.interval = props.interval;
        this.percentage = props.percentage;
    }
    /**
     * Return a TrafficRoutingConfig of type `TimeBasedLinear`.
     */
    bind(_scope) {
        return {
            type: 'TimeBasedLinear',
            timeBasedLinear: {
                linearInterval: this.interval.toMinutes(),
                linearPercentage: this.percentage,
            },
        };
    }
}
exports.TimeBasedLinearTrafficRouting = TimeBasedLinearTrafficRouting;
_d = JSII_RTTI_SYMBOL_1;
TimeBasedLinearTrafficRouting[_d] = { fqn: "@aws-cdk/aws-codedeploy.TimeBasedLinearTrafficRouting", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhZmZpYy1yb3V0aW5nLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyYWZmaWMtcm91dGluZy1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBdURBOztHQUVHO0FBQ0gsTUFBc0IsY0FBYztJQUNsQzs7T0FFRztJQUNJLE1BQU0sQ0FBQyxTQUFTO1FBQ3JCLE9BQU8sSUFBSSx1QkFBdUIsRUFBRSxDQUFDO0tBQ3RDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQXlDOzs7Ozs7Ozs7O1FBQ3JFLE9BQU8sSUFBSSw2QkFBNkIsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNqRDtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUF5Qzs7Ozs7Ozs7OztRQUNyRSxPQUFPLElBQUksNkJBQTZCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDakQ7O0FBcEJILHdDQTBCQzs7O0FBaUJEOztHQUVHO0FBQ0gsTUFBYSx1QkFBd0IsU0FBUSxjQUFjO0lBQ3pEO1FBQ0UsS0FBSyxFQUFFLENBQUM7S0FDVDtJQUVEOztPQUVHO0lBQ0gsSUFBSSxDQUFDLE1BQWlCO1FBQ3BCLE9BQU87WUFDTCxJQUFJLEVBQUUsV0FBVztTQUNsQixDQUFDO0tBQ0g7O0FBWkgsMERBYUM7OztBQU9EOztHQUVHO0FBQ0gsTUFBYSw2QkFBOEIsU0FBUSxjQUFjO0lBVS9ELFlBQVksS0FBeUM7UUFDbkQsS0FBSyxFQUFFLENBQUM7Ozs7OzsrQ0FYQyw2QkFBNkI7Ozs7UUFZdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztLQUNwQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxDQUFDLE1BQWlCO1FBQ3BCLE9BQU87WUFDTCxJQUFJLEVBQUUsaUJBQWlCO1lBQ3ZCLGVBQWUsRUFBRTtnQkFDZixjQUFjLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3pDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxVQUFVO2FBQ2xDO1NBQ0YsQ0FBQztLQUNIOztBQTNCSCxzRUE0QkM7OztBQU9EOztHQUVHO0FBQ0gsTUFBYSw2QkFBOEIsU0FBUSxjQUFjO0lBVS9ELFlBQVksS0FBeUM7UUFDbkQsS0FBSyxFQUFFLENBQUM7Ozs7OzsrQ0FYQyw2QkFBNkI7Ozs7UUFZdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztLQUNwQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxDQUFDLE1BQWlCO1FBQ3BCLE9BQU87WUFDTCxJQUFJLEVBQUUsaUJBQWlCO1lBQ3ZCLGVBQWUsRUFBRTtnQkFDZixjQUFjLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3pDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxVQUFVO2FBQ2xDO1NBQ0YsQ0FBQztLQUNIOztBQTNCSCxzRUE0QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEdXJhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgc3RydWN0dXJlIHRvIHBhc3MgaW50byB0aGUgdW5kZXJseWluZyBDZm5EZXBsb3ltZW50Q29uZmlnIGNsYXNzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYWZmaWNSb3V0aW5nQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHRyYWZmaWMgc2hpZnRpbmcgKCBgVGltZUJhc2VkQ2FuYXJ5YCBvciBgVGltZUJhc2VkTGluZWFyYCApIHVzZWQgYnkgYSBkZXBsb3ltZW50IGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgY29uZmlndXJhdGlvbiB0aGF0IHNoaWZ0cyB0cmFmZmljIGZyb20gb25lIHZlcnNpb24gb2YgYSBMYW1iZGEgZnVuY3Rpb24gb3IgRUNTIHRhc2sgc2V0IHRvIGFub3RoZXIgaW4gdHdvIGluY3JlbWVudHMuXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHRpbWVCYXNlZENhbmFyeT86IENhbmFyeVRyYWZmaWNSb3V0aW5nQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBBIGNvbmZpZ3VyYXRpb24gdGhhdCBzaGlmdHMgdHJhZmZpYyBmcm9tIG9uZSB2ZXJzaW9uIG9mIGEgTGFtYmRhIGZ1bmN0aW9uIG9yIEFtYXpvbiBFQ1MgdGFzayBzZXQgdG8gYW5vdGhlciBpbiBlcXVhbCBpbmNyZW1lbnRzLCB3aXRoIGFuIGVxdWFsIG51bWJlciBvZiBtaW51dGVzIGJldHdlZW4gZWFjaCBpbmNyZW1lbnQuXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHRpbWVCYXNlZExpbmVhcj86IExpbmVhclRyYWZmaWNSb3V0aW5nQ29uZmlnO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIGNvbmZpZ3VyYXRpb24gc3BlY2lmaWMgdG8gY2FuYXJ5IHRyYWZmaWMgc2hpZnRpbmcuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2FuYXJ5VHJhZmZpY1JvdXRpbmdDb25maWcge1xuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBtaW51dGVzIGJldHdlZW4gdGhlIGZpcnN0IGFuZCBzZWNvbmQgdHJhZmZpYyBzaGlmdHMgb2YgYSBgVGltZUJhc2VkQ2FuYXJ5YCBkZXBsb3ltZW50LlxuICAgKi9cbiAgcmVhZG9ubHkgY2FuYXJ5SW50ZXJ2YWw6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHBlcmNlbnRhZ2Ugb2YgdHJhZmZpYyB0byBzaGlmdCBpbiB0aGUgZmlyc3QgaW5jcmVtZW50IG9mIGEgYFRpbWVCYXNlZENhbmFyeWAgZGVwbG95bWVudC5cbiAgICovXG4gIHJlYWRvbmx5IGNhbmFyeVBlcmNlbnRhZ2U6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBjb25maWd1cmF0aW9uIHNwZWNpZmljIHRvIGxpbmVhciB0cmFmZmljIHNoaWZ0aW5nLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIExpbmVhclRyYWZmaWNSb3V0aW5nQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgbWludXRlcyBiZXR3ZWVuIGVhY2ggaW5jcmVtZW50YWwgdHJhZmZpYyBzaGlmdCBvZiBhIGBUaW1lQmFzZWRMaW5lYXJgIGRlcGxveW1lbnQuXG4gICAqL1xuICByZWFkb25seSBsaW5lYXJJbnRlcnZhbDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgcGVyY2VudGFnZSBvZiB0cmFmZmljIHRoYXQgaXMgc2hpZnRlZCBhdCB0aGUgc3RhcnQgb2YgZWFjaCBpbmNyZW1lbnQgb2YgYSBgVGltZUJhc2VkTGluZWFyYCBkZXBsb3ltZW50LlxuICAgKi9cbiAgcmVhZG9ubHkgbGluZWFyUGVyY2VudGFnZTogbnVtYmVyO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgaG93IHRyYWZmaWMgaXMgc2hpZnRlZCBkdXJpbmcgYSBDb2RlRGVwbG95IGRlcGxveW1lbnQuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUcmFmZmljUm91dGluZyB7XG4gIC8qKlxuICAgKiBTaGlmdHMgMTAwJSBvZiB0cmFmZmljIGluIGEgc2luZ2xlIHNoaWZ0LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbGxBdE9uY2UoKTogVHJhZmZpY1JvdXRpbmcge1xuICAgIHJldHVybiBuZXcgQWxsQXRPbmNlVHJhZmZpY1JvdXRpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaGlmdHMgYSBzcGVjaWZpZWQgcGVyY2VudGFnZSBvZiB0cmFmZmljLCB3YWl0cyBmb3IgYSBzcGVjaWZpZWQgYW1vdW50IG9mIHRpbWUsIHRoZW4gc2hpZnRzIHRoZSByZXN0IG9mIHRyYWZmaWMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRpbWVCYXNlZENhbmFyeShwcm9wczogVGltZUJhc2VkQ2FuYXJ5VHJhZmZpY1JvdXRpbmdQcm9wcyk6IFRyYWZmaWNSb3V0aW5nIHtcbiAgICByZXR1cm4gbmV3IFRpbWVCYXNlZENhbmFyeVRyYWZmaWNSb3V0aW5nKHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBLZWVwcyBzaGlmdGluZyBhIHNwZWNpZmllZCBwZXJjZW50YWdlIG9mIHRyYWZmaWMgdW50aWwgcmVhY2hpbmcgMTAwJSwgd2FpdGluZyBmb3IgYSBzcGVjaWZpZWQgYW1vdW50IG9mIHRpbWUgaW4gYmV0d2VlbiBlYWNoIHRyYWZmaWMgc2hpZnQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRpbWVCYXNlZExpbmVhcihwcm9wczogVGltZUJhc2VkTGluZWFyVHJhZmZpY1JvdXRpbmdQcm9wcyk6IFRyYWZmaWNSb3V0aW5nIHtcbiAgICByZXR1cm4gbmV3IFRpbWVCYXNlZExpbmVhclRyYWZmaWNSb3V0aW5nKHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0cmFmZmljIHJvdXRpbmcgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QpOiBUcmFmZmljUm91dGluZ0NvbmZpZztcbn1cblxuLyoqXG4gKiBDb21tb24gcHJvcGVydGllcyBvZiB0cmFmZmljIHNoaWZ0aW5nIHJvdXRpbmcgY29uZmlndXJhdGlvbnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCYXNlVHJhZmZpY1NoaWZ0aW5nQ29uZmlnUHJvcHMge1xuICAvKipcbiAgICogVGhlIGFtb3VudCBvZiB0aW1lIGJldHdlZW4gdHJhZmZpYyBzaGlmdHMuXG4gICAqL1xuICByZWFkb25seSBpbnRlcnZhbDogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBwZXJjZW50YWdlIHRvIGluY3JlYXNlIHRyYWZmaWMgb24gZWFjaCB0cmFmZmljIHNoaWZ0LlxuICAgKi9cbiAgcmVhZG9ubHkgcGVyY2VudGFnZTogbnVtYmVyO1xufVxuXG4vKipcbiAqIERlZmluZSBhIHRyYWZmaWMgcm91dGluZyBjb25maWcgb2YgdHlwZSAnQWxsQXRPbmNlJy5cbiAqL1xuZXhwb3J0IGNsYXNzIEFsbEF0T25jZVRyYWZmaWNSb3V0aW5nIGV4dGVuZHMgVHJhZmZpY1JvdXRpbmcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIFRyYWZmaWNSb3V0aW5nQ29uZmlnIG9mIHR5cGUgYEFsbEF0T25jZWAuXG4gICAqL1xuICBiaW5kKF9zY29wZTogQ29uc3RydWN0KTogVHJhZmZpY1JvdXRpbmdDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnQWxsQXRPbmNlJyxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGBUaW1lQmFzZWRDYW5hcnlUcmFmZmljUm91dGluZ2AuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGltZUJhc2VkQ2FuYXJ5VHJhZmZpY1JvdXRpbmdQcm9wcyBleHRlbmRzIEJhc2VUcmFmZmljU2hpZnRpbmdDb25maWdQcm9wcyB7fVxuXG4vKipcbiAqIERlZmluZSBhIHRyYWZmaWMgcm91dGluZyBjb25maWcgb2YgdHlwZSAnVGltZUJhc2VkQ2FuYXJ5Jy5cbiAqL1xuZXhwb3J0IGNsYXNzIFRpbWVCYXNlZENhbmFyeVRyYWZmaWNSb3V0aW5nIGV4dGVuZHMgVHJhZmZpY1JvdXRpbmcge1xuICAvKipcbiAgICogVGhlIGFtb3VudCBvZiB0aW1lIGJldHdlZW4gYWRkaXRpb25hbCB0cmFmZmljIHNoaWZ0cy5cbiAgICovXG4gIHJlYWRvbmx5IGludGVydmFsOiBEdXJhdGlvbjtcbiAgLyoqXG4gICAqIFRoZSBwZXJjZW50YWdlIHRvIGluY3JlYXNlIHRyYWZmaWMgb24gZWFjaCB0cmFmZmljIHNoaWZ0LlxuICAgKi9cbiAgcmVhZG9ubHkgcGVyY2VudGFnZTogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBUaW1lQmFzZWRDYW5hcnlUcmFmZmljUm91dGluZ1Byb3BzKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmludGVydmFsID0gcHJvcHMuaW50ZXJ2YWw7XG4gICAgdGhpcy5wZXJjZW50YWdlID0gcHJvcHMucGVyY2VudGFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBUcmFmZmljUm91dGluZ0NvbmZpZyBvZiB0eXBlIGBUaW1lQmFzZWRDYW5hcnlgLlxuICAgKi9cbiAgYmluZChfc2NvcGU6IENvbnN0cnVjdCk6IFRyYWZmaWNSb3V0aW5nQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ1RpbWVCYXNlZENhbmFyeScsXG4gICAgICB0aW1lQmFzZWRDYW5hcnk6IHtcbiAgICAgICAgY2FuYXJ5SW50ZXJ2YWw6IHRoaXMuaW50ZXJ2YWwudG9NaW51dGVzKCksXG4gICAgICAgIGNhbmFyeVBlcmNlbnRhZ2U6IHRoaXMucGVyY2VudGFnZSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGZvciBgVGltZUJhc2VkTGluZWFyVHJhZmZpY1JvdXRpbmdgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRpbWVCYXNlZExpbmVhclRyYWZmaWNSb3V0aW5nUHJvcHMgZXh0ZW5kcyBCYXNlVHJhZmZpY1NoaWZ0aW5nQ29uZmlnUHJvcHMge31cblxuLyoqXG4gKiBEZWZpbmUgYSB0cmFmZmljIHJvdXRpbmcgY29uZmlnIG9mIHR5cGUgJ1RpbWVCYXNlZExpbmVhcicuXG4gKi9cbmV4cG9ydCBjbGFzcyBUaW1lQmFzZWRMaW5lYXJUcmFmZmljUm91dGluZyBleHRlbmRzIFRyYWZmaWNSb3V0aW5nIHtcbiAgLyoqXG4gICAqIFRoZSBhbW91bnQgb2YgdGltZSBiZXR3ZWVuIGFkZGl0aW9uYWwgdHJhZmZpYyBzaGlmdHMuXG4gICAqL1xuICByZWFkb25seSBpbnRlcnZhbDogRHVyYXRpb247XG4gIC8qKlxuICAgKiBUaGUgcGVyY2VudGFnZSB0byBpbmNyZWFzZSB0cmFmZmljIG9uIGVhY2ggdHJhZmZpYyBzaGlmdC5cbiAgICovXG4gIHJlYWRvbmx5IHBlcmNlbnRhZ2U6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogVGltZUJhc2VkTGluZWFyVHJhZmZpY1JvdXRpbmdQcm9wcykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5pbnRlcnZhbCA9IHByb3BzLmludGVydmFsO1xuICAgIHRoaXMucGVyY2VudGFnZSA9IHByb3BzLnBlcmNlbnRhZ2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgVHJhZmZpY1JvdXRpbmdDb25maWcgb2YgdHlwZSBgVGltZUJhc2VkTGluZWFyYC5cbiAgICovXG4gIGJpbmQoX3Njb3BlOiBDb25zdHJ1Y3QpOiBUcmFmZmljUm91dGluZ0NvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdUaW1lQmFzZWRMaW5lYXInLFxuICAgICAgdGltZUJhc2VkTGluZWFyOiB7XG4gICAgICAgIGxpbmVhckludGVydmFsOiB0aGlzLmludGVydmFsLnRvTWludXRlcygpLFxuICAgICAgICBsaW5lYXJQZXJjZW50YWdlOiB0aGlzLnBlcmNlbnRhZ2UsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiJdfQ==