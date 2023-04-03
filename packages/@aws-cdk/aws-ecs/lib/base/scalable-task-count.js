"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalableTaskCount = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const appscaling = require("@aws-cdk/aws-applicationautoscaling");
/**
 * The scalable attribute representing task count.
 */
class ScalableTaskCount extends appscaling.BaseScalableAttribute {
    /**
     * Constructs a new instance of the ScalableTaskCount class.
     */
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ScalableTaskCountProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ScalableTaskCount);
            }
            throw error;
        }
    }
    /**
     * Scales in or out based on a specified scheduled time.
     */
    scaleOnSchedule(id, props) {
        return super.doScaleOnSchedule(id, props);
    }
    /**
     * Scales in or out based on a specified metric value.
     */
    scaleOnMetric(id, props) {
        return super.doScaleOnMetric(id, props);
    }
    /**
     * Scales in or out to achieve a target CPU utilization.
     */
    scaleOnCpuUtilization(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_CpuUtilizationScalingProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.scaleOnCpuUtilization);
            }
            throw error;
        }
        return super.doScaleToTrackMetric(id, {
            predefinedMetric: appscaling.PredefinedMetric.ECS_SERVICE_AVERAGE_CPU_UTILIZATION,
            policyName: props.policyName,
            disableScaleIn: props.disableScaleIn,
            targetValue: props.targetUtilizationPercent,
            scaleInCooldown: props.scaleInCooldown,
            scaleOutCooldown: props.scaleOutCooldown,
        });
    }
    /**
     * Scales in or out to achieve a target memory utilization.
     */
    scaleOnMemoryUtilization(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_MemoryUtilizationScalingProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.scaleOnMemoryUtilization);
            }
            throw error;
        }
        return super.doScaleToTrackMetric(id, {
            predefinedMetric: appscaling.PredefinedMetric.ECS_SERVICE_AVERAGE_MEMORY_UTILIZATION,
            targetValue: props.targetUtilizationPercent,
            policyName: props.policyName,
            disableScaleIn: props.disableScaleIn,
            scaleInCooldown: props.scaleInCooldown,
            scaleOutCooldown: props.scaleOutCooldown,
        });
    }
    /**
     * Scales in or out to achieve a target Application Load Balancer request count per target.
     */
    scaleOnRequestCount(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_RequestCountScalingProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.scaleOnRequestCount);
            }
            throw error;
        }
        const resourceLabel = props.targetGroup.firstLoadBalancerFullName +
            '/' + props.targetGroup.targetGroupFullName;
        return super.doScaleToTrackMetric(id, {
            predefinedMetric: appscaling.PredefinedMetric.ALB_REQUEST_COUNT_PER_TARGET,
            resourceLabel,
            targetValue: props.requestsPerTarget,
            policyName: props.policyName,
            disableScaleIn: props.disableScaleIn,
            scaleInCooldown: props.scaleInCooldown,
            scaleOutCooldown: props.scaleOutCooldown,
        });
    }
    /**
     * Scales in or out to achieve a target on a custom metric.
     */
    scaleToTrackCustomMetric(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_TrackCustomMetricProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.scaleToTrackCustomMetric);
            }
            throw error;
        }
        return super.doScaleToTrackMetric(id, {
            customMetric: props.metric,
            targetValue: props.targetValue,
            policyName: props.policyName,
            disableScaleIn: props.disableScaleIn,
            scaleInCooldown: props.scaleInCooldown,
            scaleOutCooldown: props.scaleOutCooldown,
        });
    }
}
exports.ScalableTaskCount = ScalableTaskCount;
_a = JSII_RTTI_SYMBOL_1;
ScalableTaskCount[_a] = { fqn: "@aws-cdk/aws-ecs.ScalableTaskCount", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGFibGUtdGFzay1jb3VudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNjYWxhYmxlLXRhc2stY291bnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0VBQWtFO0FBWWxFOztHQUVHO0FBQ0gsTUFBYSxpQkFBa0IsU0FBUSxVQUFVLENBQUMscUJBQXFCO0lBRXJFOztPQUVHO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE2QjtRQUNyRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7Ozs7OytDQU5mLGlCQUFpQjs7OztLQU8zQjtJQUVEOztPQUVHO0lBQ0ksZUFBZSxDQUFDLEVBQVUsRUFBRSxLQUFpQztRQUNsRSxPQUFPLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDM0M7SUFFRDs7T0FFRztJQUNJLGFBQWEsQ0FBQyxFQUFVLEVBQUUsS0FBNkM7UUFDNUUsT0FBTyxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN6QztJQUVEOztPQUVHO0lBQ0kscUJBQXFCLENBQUMsRUFBVSxFQUFFLEtBQWlDOzs7Ozs7Ozs7O1FBQ3hFLE9BQU8sS0FBSyxDQUFDLG9CQUFvQixDQUFDLEVBQUUsRUFBRTtZQUNwQyxnQkFBZ0IsRUFBRSxVQUFVLENBQUMsZ0JBQWdCLENBQUMsbUNBQW1DO1lBQ2pGLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUM1QixjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWM7WUFDcEMsV0FBVyxFQUFFLEtBQUssQ0FBQyx3QkFBd0I7WUFDM0MsZUFBZSxFQUFFLEtBQUssQ0FBQyxlQUFlO1lBQ3RDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0I7U0FDekMsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7T0FFRztJQUNJLHdCQUF3QixDQUFDLEVBQVUsRUFBRSxLQUFvQzs7Ozs7Ozs7OztRQUM5RSxPQUFPLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLEVBQUU7WUFDcEMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLGdCQUFnQixDQUFDLHNDQUFzQztZQUNwRixXQUFXLEVBQUUsS0FBSyxDQUFDLHdCQUF3QjtZQUMzQyxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7WUFDNUIsY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjO1lBQ3BDLGVBQWUsRUFBRSxLQUFLLENBQUMsZUFBZTtZQUN0QyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsZ0JBQWdCO1NBQ3pDLENBQUMsQ0FBQztLQUNKO0lBRUQ7O09BRUc7SUFDSSxtQkFBbUIsQ0FBQyxFQUFVLEVBQUUsS0FBK0I7Ozs7Ozs7Ozs7UUFDcEUsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyx5QkFBeUI7WUFDOUQsR0FBRyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUM7UUFFL0MsT0FBTyxLQUFLLENBQUMsb0JBQW9CLENBQUMsRUFBRSxFQUFFO1lBQ3BDLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyw0QkFBNEI7WUFDMUUsYUFBYTtZQUNiLFdBQVcsRUFBRSxLQUFLLENBQUMsaUJBQWlCO1lBQ3BDLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUM1QixjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWM7WUFDcEMsZUFBZSxFQUFFLEtBQUssQ0FBQyxlQUFlO1lBQ3RDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0I7U0FDekMsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7T0FFRztJQUNJLHdCQUF3QixDQUFDLEVBQVUsRUFBRSxLQUE2Qjs7Ozs7Ozs7OztRQUN2RSxPQUFPLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLEVBQUU7WUFDcEMsWUFBWSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQzFCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7WUFDNUIsY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjO1lBQ3BDLGVBQWUsRUFBRSxLQUFLLENBQUMsZUFBZTtZQUN0QyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsZ0JBQWdCO1NBQ3pDLENBQUMsQ0FBQztLQUNKOztBQWpGSCw4Q0FrRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhcHBzY2FsaW5nIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBsaWNhdGlvbmF1dG9zY2FsaW5nJztcbmltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgZWxidjIgZnJvbSAnQGF3cy1jZGsvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qKlxuICogVGhlIHByb3BlcnRpZXMgb2YgYSBzY2FsYWJsZSBhdHRyaWJ1dGUgcmVwcmVzZW50aW5nIHRhc2sgY291bnQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2NhbGFibGVUYXNrQ291bnRQcm9wcyBleHRlbmRzIGFwcHNjYWxpbmcuQmFzZVNjYWxhYmxlQXR0cmlidXRlUHJvcHMge1xuXG59XG5cbi8qKlxuICogVGhlIHNjYWxhYmxlIGF0dHJpYnV0ZSByZXByZXNlbnRpbmcgdGFzayBjb3VudC5cbiAqL1xuZXhwb3J0IGNsYXNzIFNjYWxhYmxlVGFza0NvdW50IGV4dGVuZHMgYXBwc2NhbGluZy5CYXNlU2NhbGFibGVBdHRyaWJ1dGUge1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBTY2FsYWJsZVRhc2tDb3VudCBjbGFzcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTY2FsYWJsZVRhc2tDb3VudFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogU2NhbGVzIGluIG9yIG91dCBiYXNlZCBvbiBhIHNwZWNpZmllZCBzY2hlZHVsZWQgdGltZS5cbiAgICovXG4gIHB1YmxpYyBzY2FsZU9uU2NoZWR1bGUoaWQ6IHN0cmluZywgcHJvcHM6IGFwcHNjYWxpbmcuU2NhbGluZ1NjaGVkdWxlKSB7XG4gICAgcmV0dXJuIHN1cGVyLmRvU2NhbGVPblNjaGVkdWxlKGlkLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogU2NhbGVzIGluIG9yIG91dCBiYXNlZCBvbiBhIHNwZWNpZmllZCBtZXRyaWMgdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgc2NhbGVPbk1ldHJpYyhpZDogc3RyaW5nLCBwcm9wczogYXBwc2NhbGluZy5CYXNpY1N0ZXBTY2FsaW5nUG9saWN5UHJvcHMpIHtcbiAgICByZXR1cm4gc3VwZXIuZG9TY2FsZU9uTWV0cmljKGlkLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogU2NhbGVzIGluIG9yIG91dCB0byBhY2hpZXZlIGEgdGFyZ2V0IENQVSB1dGlsaXphdGlvbi5cbiAgICovXG4gIHB1YmxpYyBzY2FsZU9uQ3B1VXRpbGl6YXRpb24oaWQ6IHN0cmluZywgcHJvcHM6IENwdVV0aWxpemF0aW9uU2NhbGluZ1Byb3BzKSB7XG4gICAgcmV0dXJuIHN1cGVyLmRvU2NhbGVUb1RyYWNrTWV0cmljKGlkLCB7XG4gICAgICBwcmVkZWZpbmVkTWV0cmljOiBhcHBzY2FsaW5nLlByZWRlZmluZWRNZXRyaWMuRUNTX1NFUlZJQ0VfQVZFUkFHRV9DUFVfVVRJTElaQVRJT04sXG4gICAgICBwb2xpY3lOYW1lOiBwcm9wcy5wb2xpY3lOYW1lLFxuICAgICAgZGlzYWJsZVNjYWxlSW46IHByb3BzLmRpc2FibGVTY2FsZUluLFxuICAgICAgdGFyZ2V0VmFsdWU6IHByb3BzLnRhcmdldFV0aWxpemF0aW9uUGVyY2VudCxcbiAgICAgIHNjYWxlSW5Db29sZG93bjogcHJvcHMuc2NhbGVJbkNvb2xkb3duLFxuICAgICAgc2NhbGVPdXRDb29sZG93bjogcHJvcHMuc2NhbGVPdXRDb29sZG93bixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTY2FsZXMgaW4gb3Igb3V0IHRvIGFjaGlldmUgYSB0YXJnZXQgbWVtb3J5IHV0aWxpemF0aW9uLlxuICAgKi9cbiAgcHVibGljIHNjYWxlT25NZW1vcnlVdGlsaXphdGlvbihpZDogc3RyaW5nLCBwcm9wczogTWVtb3J5VXRpbGl6YXRpb25TY2FsaW5nUHJvcHMpIHtcbiAgICByZXR1cm4gc3VwZXIuZG9TY2FsZVRvVHJhY2tNZXRyaWMoaWQsIHtcbiAgICAgIHByZWRlZmluZWRNZXRyaWM6IGFwcHNjYWxpbmcuUHJlZGVmaW5lZE1ldHJpYy5FQ1NfU0VSVklDRV9BVkVSQUdFX01FTU9SWV9VVElMSVpBVElPTixcbiAgICAgIHRhcmdldFZhbHVlOiBwcm9wcy50YXJnZXRVdGlsaXphdGlvblBlcmNlbnQsXG4gICAgICBwb2xpY3lOYW1lOiBwcm9wcy5wb2xpY3lOYW1lLFxuICAgICAgZGlzYWJsZVNjYWxlSW46IHByb3BzLmRpc2FibGVTY2FsZUluLFxuICAgICAgc2NhbGVJbkNvb2xkb3duOiBwcm9wcy5zY2FsZUluQ29vbGRvd24sXG4gICAgICBzY2FsZU91dENvb2xkb3duOiBwcm9wcy5zY2FsZU91dENvb2xkb3duLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjYWxlcyBpbiBvciBvdXQgdG8gYWNoaWV2ZSBhIHRhcmdldCBBcHBsaWNhdGlvbiBMb2FkIEJhbGFuY2VyIHJlcXVlc3QgY291bnQgcGVyIHRhcmdldC5cbiAgICovXG4gIHB1YmxpYyBzY2FsZU9uUmVxdWVzdENvdW50KGlkOiBzdHJpbmcsIHByb3BzOiBSZXF1ZXN0Q291bnRTY2FsaW5nUHJvcHMpIHtcbiAgICBjb25zdCByZXNvdXJjZUxhYmVsID0gcHJvcHMudGFyZ2V0R3JvdXAuZmlyc3RMb2FkQmFsYW5jZXJGdWxsTmFtZSArXG4gICAgICAgJy8nICsgcHJvcHMudGFyZ2V0R3JvdXAudGFyZ2V0R3JvdXBGdWxsTmFtZTtcblxuICAgIHJldHVybiBzdXBlci5kb1NjYWxlVG9UcmFja01ldHJpYyhpZCwge1xuICAgICAgcHJlZGVmaW5lZE1ldHJpYzogYXBwc2NhbGluZy5QcmVkZWZpbmVkTWV0cmljLkFMQl9SRVFVRVNUX0NPVU5UX1BFUl9UQVJHRVQsXG4gICAgICByZXNvdXJjZUxhYmVsLFxuICAgICAgdGFyZ2V0VmFsdWU6IHByb3BzLnJlcXVlc3RzUGVyVGFyZ2V0LFxuICAgICAgcG9saWN5TmFtZTogcHJvcHMucG9saWN5TmFtZSxcbiAgICAgIGRpc2FibGVTY2FsZUluOiBwcm9wcy5kaXNhYmxlU2NhbGVJbixcbiAgICAgIHNjYWxlSW5Db29sZG93bjogcHJvcHMuc2NhbGVJbkNvb2xkb3duLFxuICAgICAgc2NhbGVPdXRDb29sZG93bjogcHJvcHMuc2NhbGVPdXRDb29sZG93bixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTY2FsZXMgaW4gb3Igb3V0IHRvIGFjaGlldmUgYSB0YXJnZXQgb24gYSBjdXN0b20gbWV0cmljLlxuICAgKi9cbiAgcHVibGljIHNjYWxlVG9UcmFja0N1c3RvbU1ldHJpYyhpZDogc3RyaW5nLCBwcm9wczogVHJhY2tDdXN0b21NZXRyaWNQcm9wcykge1xuICAgIHJldHVybiBzdXBlci5kb1NjYWxlVG9UcmFja01ldHJpYyhpZCwge1xuICAgICAgY3VzdG9tTWV0cmljOiBwcm9wcy5tZXRyaWMsXG4gICAgICB0YXJnZXRWYWx1ZTogcHJvcHMudGFyZ2V0VmFsdWUsXG4gICAgICBwb2xpY3lOYW1lOiBwcm9wcy5wb2xpY3lOYW1lLFxuICAgICAgZGlzYWJsZVNjYWxlSW46IHByb3BzLmRpc2FibGVTY2FsZUluLFxuICAgICAgc2NhbGVJbkNvb2xkb3duOiBwcm9wcy5zY2FsZUluQ29vbGRvd24sXG4gICAgICBzY2FsZU91dENvb2xkb3duOiBwcm9wcy5zY2FsZU91dENvb2xkb3duLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogVGhlIHByb3BlcnRpZXMgZm9yIGVuYWJsaW5nIHNjYWxpbmcgYmFzZWQgb24gQ1BVIHV0aWxpemF0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENwdVV0aWxpemF0aW9uU2NhbGluZ1Byb3BzIGV4dGVuZHMgYXBwc2NhbGluZy5CYXNlVGFyZ2V0VHJhY2tpbmdQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgdGFyZ2V0IHZhbHVlIGZvciBDUFUgdXRpbGl6YXRpb24gYWNyb3NzIGFsbCB0YXNrcyBpbiB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldFV0aWxpemF0aW9uUGVyY2VudDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFRoZSBwcm9wZXJ0aWVzIGZvciBlbmFibGluZyBzY2FsaW5nIGJhc2VkIG9uIG1lbW9yeSB1dGlsaXphdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNZW1vcnlVdGlsaXphdGlvblNjYWxpbmdQcm9wcyBleHRlbmRzIGFwcHNjYWxpbmcuQmFzZVRhcmdldFRyYWNraW5nUHJvcHMge1xuICAvKipcbiAgICogVGhlIHRhcmdldCB2YWx1ZSBmb3IgbWVtb3J5IHV0aWxpemF0aW9uIGFjcm9zcyBhbGwgdGFza3MgaW4gdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZWFkb25seSB0YXJnZXRVdGlsaXphdGlvblBlcmNlbnQ6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBUaGUgcHJvcGVydGllcyBmb3IgZW5hYmxpbmcgc2NhbGluZyBiYXNlZCBvbiBBcHBsaWNhdGlvbiBMb2FkIEJhbGFuY2VyIChBTEIpIHJlcXVlc3QgY291bnRzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlcXVlc3RDb3VudFNjYWxpbmdQcm9wcyBleHRlbmRzIGFwcHNjYWxpbmcuQmFzZVRhcmdldFRyYWNraW5nUHJvcHMge1xuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBBTEIgcmVxdWVzdHMgcGVyIHRhcmdldC5cbiAgICovXG4gIHJlYWRvbmx5IHJlcXVlc3RzUGVyVGFyZ2V0OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBBTEIgdGFyZ2V0IGdyb3VwIG5hbWUuXG4gICAqL1xuICByZWFkb25seSB0YXJnZXRHcm91cDogZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cDtcbn1cblxuLyoqXG4gKiBUaGUgcHJvcGVydGllcyBmb3IgZW5hYmxpbmcgdGFyZ2V0IHRyYWNraW5nIHNjYWxpbmcgYmFzZWQgb24gYSBjdXN0b20gQ2xvdWRXYXRjaCBtZXRyaWMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJhY2tDdXN0b21NZXRyaWNQcm9wcyBleHRlbmRzIGFwcHNjYWxpbmcuQmFzZVRhcmdldFRyYWNraW5nUHJvcHMge1xuICAvKipcbiAgICogVGhlIGN1c3RvbSBDbG91ZFdhdGNoIG1ldHJpYyB0byB0cmFjay5cbiAgICpcbiAgICogVGhlIG1ldHJpYyBtdXN0IHJlcHJlc2VudCB1dGlsaXphdGlvbjsgdGhhdCBpcywgeW91IHdpbGwgYWx3YXlzIGdldCB0aGUgZm9sbG93aW5nIGJlaGF2aW9yOlxuICAgKlxuICAgKiAtIG1ldHJpYyA+IHRhcmdldFZhbHVlID0+IHNjYWxlIG91dFxuICAgKiAtIG1ldHJpYyA8IHRhcmdldFZhbHVlID0+IHNjYWxlIGluXG4gICAqL1xuICByZWFkb25seSBtZXRyaWM6IGNsb3Vkd2F0Y2guSU1ldHJpYztcblxuICAvKipcbiAgICogVGhlIHRhcmdldCB2YWx1ZSBmb3IgdGhlIGN1c3RvbSBDbG91ZFdhdGNoIG1ldHJpYy5cbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldFZhbHVlOiBudW1iZXI7XG59XG4iXX0=