"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetGroup = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
/**
 * Supported Endpoints for targets
 */
var TargetType;
(function (TargetType) {
    /**
     * Lambda Target
     */
    TargetType["LAMBDA"] = "LAMBDA";
    /**
     * IP Address Target
     */
    TargetType["IP"] = "IP";
    /**
     * EC2 Instance Targets
     */
    TargetType["INSTANCE"] = "INSTANCE";
    /**
     * Application Load Balancer Target
     */
    TargetType["ALB"] = "ALB";
})(TargetType || (TargetType = {}));
/**
 * Create a vpc lattice TargetGroup
 *
 */
class TargetGroup extends core.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_vpclattice_alpha_TargetGroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, TargetGroup);
            }
            throw error;
        }
        let targetType;
        let targets = [];
        // Lambda Targets
        if (props.lambdaTargets && props.lambdaTargets.length > 0
            && props.instancetargets === undefined
            && props.albTargets === undefined
            && props.ipTargets === undefined) {
            targetType = TargetType.LAMBDA;
            props.lambdaTargets.forEach((target) => {
                targets.push({ id: target.functionArn });
            });
            // EC2 Instance Targets
        }
        else if (props.instancetargets && props.instancetargets.length > 0
            && props.lambdaTargets === undefined
            && props.albTargets === undefined
            && props.ipTargets === undefined) {
            targetType = TargetType.INSTANCE;
            props.instancetargets.forEach((target) => {
                targets.push({ id: target.instanceId });
            });
            // ALB Targets
        }
        else if (props.albTargets && props.albTargets.length > 0
            && props.instancetargets === undefined
            && props.lambdaTargets === undefined
            && props.ipTargets === undefined) {
            targetType = TargetType.INSTANCE;
            props.albTargets.forEach((target) => {
                targets.push({ id: target.listenerArn });
            });
            // IP Targets
        }
        else if (props.ipTargets && props.ipTargets.length > 0
            && props.instancetargets === undefined
            && props.lambdaTargets === undefined
            && props.albTargets === undefined) {
            targetType = TargetType.IP;
            props.ipTargets.forEach((target) => {
                targets.push({ id: target });
            });
        }
        else {
            throw new Error('Only one kind of target can be specifed, and at least one target must be provided');
        }
        ;
        // check that there is a config if the target type is lambda
        if (props.lambdaTargets && props.config) {
            throw new Error('No configuration should be supplied for a target group of lambdas');
        }
        const targetGroup = new aws_cdk_lib_1.aws_vpclattice.CfnTargetGroup(this, 'Resource', {
            type: targetType,
            name: props.name,
            config: props.config?.targetGroupCfg,
            targets: targets,
        });
        this.targetGroupId = targetGroup.attrId;
        this.targetGroupArn = targetGroup.attrArn;
    }
}
_a = JSII_RTTI_SYMBOL_1;
TargetGroup[_a] = { fqn: "@aws-cdk/aws-vpclattice-alpha.TargetGroup", version: "0.0.0" };
exports.TargetGroup = TargetGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0Z3JvdXBzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGFyZ2V0Z3JvdXBzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9DQUFvQztBQUVwQyw2Q0FNcUI7QUFLckI7O0dBRUc7QUFDSCxJQUFLLFVBaUJKO0FBakJELFdBQUssVUFBVTtJQUNiOztPQUVHO0lBQ0gsK0JBQWlCLENBQUE7SUFDakI7O09BRUc7SUFDSCx1QkFBUyxDQUFBO0lBQ1Q7O09BRUc7SUFDSCxtQ0FBcUIsQ0FBQTtJQUNyQjs7T0FFRztJQUNILHlCQUFXLENBQUE7QUFDYixDQUFDLEVBakJJLFVBQVUsS0FBVixVQUFVLFFBaUJkO0FBMkREOzs7R0FHRztBQUNILE1BQWEsV0FBWSxTQUFRLElBQUksQ0FBQyxRQUFRO0lBWTVDLFlBQVksS0FBMkIsRUFBRSxFQUFVLEVBQUUsS0FBdUI7UUFDMUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQWJSLFdBQVc7Ozs7UUFlcEIsSUFBSSxVQUFzQixDQUFDO1FBQzNCLElBQUksT0FBTyxHQUFtRCxFQUFFLENBQUM7UUFFakUsaUJBQWlCO1FBQ2pCLElBQUksS0FBSyxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDO2VBQ3BELEtBQUssQ0FBQyxlQUFlLEtBQUssU0FBUztlQUNuQyxLQUFLLENBQUMsVUFBVSxLQUFLLFNBQVM7ZUFDOUIsS0FBSyxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUc7WUFDbkMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7WUFDL0IsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDckMsT0FBTyxDQUFDLElBQUksQ0FDVixFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLENBQzNCLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztZQUNMLHVCQUF1QjtTQUN0QjthQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDO2VBQy9ELEtBQUssQ0FBQyxhQUFhLEtBQUssU0FBUztlQUNqQyxLQUFLLENBQUMsVUFBVSxLQUFLLFNBQVM7ZUFDOUIsS0FBSyxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUc7WUFDbkMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUM7WUFDakMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDdkMsT0FBTyxDQUFDLElBQUksQ0FDVixFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQzFCLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztZQUNMLGNBQWM7U0FDYjthQUFNLElBQUksS0FBSyxDQUFDLFVBQVUsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDO2VBQ3JELEtBQUssQ0FBQyxlQUFlLEtBQUssU0FBUztlQUNuQyxLQUFLLENBQUMsYUFBYSxLQUFLLFNBQVM7ZUFDakMsS0FBSyxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUc7WUFDbkMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUM7WUFDakMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDbEMsT0FBTyxDQUFDLElBQUksQ0FDVixFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLENBQzNCLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztZQUNMLGFBQWE7U0FDWjthQUFNLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDO2VBQ25ELEtBQUssQ0FBQyxlQUFlLEtBQUssU0FBUztlQUNuQyxLQUFLLENBQUMsYUFBYSxLQUFLLFNBQVM7ZUFDakMsS0FBSyxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUc7WUFDcEMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDM0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDakMsT0FBTyxDQUFDLElBQUksQ0FDVixFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FDZixDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7U0FDSjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxtRkFBbUYsQ0FBQyxDQUFDO1NBQ3RHO1FBQUEsQ0FBQztRQUVGLDREQUE0RDtRQUM1RCxJQUFLLEtBQUssQ0FBQyxhQUFhLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRztZQUN6QyxNQUFNLElBQUksS0FBSyxDQUFDLG1FQUFtRSxDQUFDLENBQUM7U0FDdEY7UUFFRCxNQUFNLFdBQVcsR0FBRyxJQUFJLDRCQUFjLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDdEUsSUFBSSxFQUFFLFVBQVU7WUFDaEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLGNBQWM7WUFDcEMsT0FBTyxFQUFFLE9BQU87U0FDakIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxjQUFjLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQztLQUMzQzs7OztBQWhGVSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvcmUgZnJvbSAnYXdzLWNkay1saWInO1xuXG5pbXBvcnQge1xuICBhd3NfdnBjbGF0dGljZSxcbiAgYXdzX2VjMiBhcyBlYzIsXG4gIGF3c19sYW1iZGEgYXMgYXdzX2xhbWJkYSxcbiAgYXdzX2VsYXN0aWNsb2FkYmFsYW5jaW5ndjIgYXMgZWxidjIsXG59XG4gIGZyb20gJ2F3cy1jZGstbGliJztcblxuaW1wb3J0ICogYXMgdnBjbGF0dGljZSBmcm9tICcuL2luZGV4JztcbmltcG9ydCAqIGFzIGNvbnN0cnVjdHMgZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qKlxuICogU3VwcG9ydGVkIEVuZHBvaW50cyBmb3IgdGFyZ2V0c1xuICovXG5lbnVtIFRhcmdldFR5cGUge1xuICAvKipcbiAgICogTGFtYmRhIFRhcmdldFxuICAgKi9cbiAgTEFNQkRBID0gJ0xBTUJEQScsXG4gIC8qKlxuICAgKiBJUCBBZGRyZXNzIFRhcmdldFxuICAgKi9cbiAgSVAgPSAnSVAnLFxuICAvKipcbiAgICogRUMyIEluc3RhbmNlIFRhcmdldHNcbiAgICovXG4gIElOU1RBTkNFID0gJ0lOU1RBTkNFJyxcbiAgLyoqXG4gICAqIEFwcGxpY2F0aW9uIExvYWQgQmFsYW5jZXIgVGFyZ2V0XG4gICAqL1xuICBBTEIgPSAnQUxCJ1xufVxuXG5cbi8qKlxuICogQ3JlYXRlIGEgdnBjIGxhdHRpY2UgVGFyZ2V0R3JvdXAuXG4gKiBJbXBsZW1lbnRlZCBieSBgVGFyZ2V0R3JvdXBgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElUYXJnZXRHcm91cCBleHRlbmRzIGNvcmUuSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBpZCBvZiB0aGUgdGFyZ2V0IGdyb3VwXG4gICAqL1xuICByZWFkb25seSB0YXJnZXRHcm91cElkOiBzdHJpbmdcbiAgLyoqXG4gICAqIFRoZSBBcm4gb2YgdGhlIHRhcmdldCBncm91cFxuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0R3JvdXBBcm46IHN0cmluZztcblxufVxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIFRhcmdldCBHcm91cCwgT25seSBzdXBwbHkgb25lIG9mIGluc3RhbmNldGFyZ2V0cywgbGFtYmRhVGFyZ2V0cywgYWxiVGFyZ2V0cywgaXBUYXJnZXRzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGFyZ2V0R3JvdXBQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgdGFyZ2V0IGdyb3VwXG4gICAqL1xuICByZWFkb25seSBuYW1lOiBzdHJpbmcsXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgZWMyIGluc3RhbmNlIHRhcmdldHMuXG4gICAqIEBkZWZhdWx0IC0gTm8gdGFyZ2V0c1xuICAgKi9cbiAgcmVhZG9ubHkgaW5zdGFuY2V0YXJnZXRzPzogZWMyLkluc3RhbmNlW10sXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgaXAgdGFyZ2V0c1xuICAgKiBAZGVmYXVsdCAtIE5vIHRhcmdldHNcbiAgICovXG4gIHJlYWRvbmx5IGlwVGFyZ2V0cz86IHN0cmluZ1tdLFxuICAvKipcbiAgICogQSBsaXN0IG9mIGxhbWJkYSB0YXJnZXRzXG4gICAqIEBkZWZhdWx0IC0gTm8gdGFyZ2V0c1xuICAgKi9cbiAgcmVhZG9ubHkgbGFtYmRhVGFyZ2V0cz86IGF3c19sYW1iZGEuRnVuY3Rpb25bXSxcbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBhbGIgdGFyZ2V0c1xuICAgKiBAZGVmYXVsdCAtIE5vIHRhcmdldHNcbiAgICovXG4gIHJlYWRvbmx5IGFsYlRhcmdldHM/OiBlbGJ2Mi5BcHBsaWNhdGlvbkxpc3RlbmVyW11cbiAgLyoqXG4gICAqIFRoZSBUYXJnZXQgR3JvdXAgY29uZmlndXJhdGlvbi4gTXVzdCBiZSBwcm92aWRlZCBmb3IgYWxiLCBpbnN0YW5jZSBhbmQgSXAgdGFyZ2V0cywgYnV0XG4gICAqIG11c3Qgbm90IGJlIHByb3ZpZGVkIGZvciBsYW1iZGEgdGFyZ2V0c1xuICAgKiBAZGVmYXVsdCAtIE5vIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIC8qKlxuICAgKiBUaGUgVGFyZ2V0IEdyb3VwIGNvbmZpZ3VyYXRpb24uIE11c3QgYmUgcHJvdmlkZWQgZm9yIGFsYiwgaW5zdGFuY2UgYW5kIElwIHRhcmdldHMsIGJ1dFxuICAgKiBtdXN0IG5vdCBiZSBwcm92aWRlZCBmb3IgbGFtYmRhIHRhcmdldHNcbiAgICogQGRlZmF1bHQgLSBObyBjb25maWd1cmF0aW9uXG4gICAqL1xuICByZWFkb25seSBjb25maWc/OiB2cGNsYXR0aWNlLlRhcmdldEdyb3VwQ29uZmlnIHwgdW5kZWZpbmVkLFxufVxuXG4vKipcbiAqIENyZWF0ZSBhIHZwYyBsYXR0aWNlIFRhcmdldEdyb3VwXG4gKlxuICovXG5leHBvcnQgY2xhc3MgVGFyZ2V0R3JvdXAgZXh0ZW5kcyBjb3JlLlJlc291cmNlIGltcGxlbWVudHMgSVRhcmdldEdyb3VwIHtcblxuICAvKlxuICAqIHRoZSBJZCBvZiB0aGUgdGFyZ2V0R3JvdXBcbiAgKiovXG4gIHJlYWRvbmx5IHRhcmdldEdyb3VwSWQ6IHN0cmluZ1xuICAvKipcbiAgICogVGhlIEFybiBvZiB0aGUgdGFyZ2V0R3JvdXBcbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldEdyb3VwQXJuOiBzdHJpbmdcblxuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFRhcmdldEdyb3VwUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgbGV0IHRhcmdldFR5cGU6IFRhcmdldFR5cGU7XG4gICAgbGV0IHRhcmdldHM6IGF3c192cGNsYXR0aWNlLkNmblRhcmdldEdyb3VwLlRhcmdldFByb3BlcnR5W10gPSBbXTtcblxuICAgIC8vIExhbWJkYSBUYXJnZXRzXG4gICAgaWYgKHByb3BzLmxhbWJkYVRhcmdldHMgJiYgcHJvcHMubGFtYmRhVGFyZ2V0cy5sZW5ndGggPiAwXG4gICAgICAmJiBwcm9wcy5pbnN0YW5jZXRhcmdldHMgPT09IHVuZGVmaW5lZFxuICAgICAgJiYgcHJvcHMuYWxiVGFyZ2V0cyA9PT0gdW5kZWZpbmVkXG4gICAgICAmJiBwcm9wcy5pcFRhcmdldHMgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgIHRhcmdldFR5cGUgPSBUYXJnZXRUeXBlLkxBTUJEQTtcbiAgICAgIHByb3BzLmxhbWJkYVRhcmdldHMuZm9yRWFjaCgodGFyZ2V0KSA9PiB7XG4gICAgICAgIHRhcmdldHMucHVzaChcbiAgICAgICAgICB7IGlkOiB0YXJnZXQuZnVuY3Rpb25Bcm4gfSxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIC8vIEVDMiBJbnN0YW5jZSBUYXJnZXRzXG4gICAgfSBlbHNlIGlmIChwcm9wcy5pbnN0YW5jZXRhcmdldHMgJiYgcHJvcHMuaW5zdGFuY2V0YXJnZXRzLmxlbmd0aCA+IDBcbiAgICAgICYmIHByb3BzLmxhbWJkYVRhcmdldHMgPT09IHVuZGVmaW5lZFxuICAgICAgJiYgcHJvcHMuYWxiVGFyZ2V0cyA9PT0gdW5kZWZpbmVkXG4gICAgICAmJiBwcm9wcy5pcFRhcmdldHMgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgIHRhcmdldFR5cGUgPSBUYXJnZXRUeXBlLklOU1RBTkNFO1xuICAgICAgcHJvcHMuaW5zdGFuY2V0YXJnZXRzLmZvckVhY2goKHRhcmdldCkgPT4ge1xuICAgICAgICB0YXJnZXRzLnB1c2goXG4gICAgICAgICAgeyBpZDogdGFyZ2V0Lmluc3RhbmNlSWQgfSxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIC8vIEFMQiBUYXJnZXRzXG4gICAgfSBlbHNlIGlmIChwcm9wcy5hbGJUYXJnZXRzICYmIHByb3BzLmFsYlRhcmdldHMubGVuZ3RoID4gMFxuICAgICAgJiYgcHJvcHMuaW5zdGFuY2V0YXJnZXRzID09PSB1bmRlZmluZWRcbiAgICAgICYmIHByb3BzLmxhbWJkYVRhcmdldHMgPT09IHVuZGVmaW5lZFxuICAgICAgJiYgcHJvcHMuaXBUYXJnZXRzID09PSB1bmRlZmluZWQgKSB7XG4gICAgICB0YXJnZXRUeXBlID0gVGFyZ2V0VHlwZS5JTlNUQU5DRTtcbiAgICAgIHByb3BzLmFsYlRhcmdldHMuZm9yRWFjaCgodGFyZ2V0KSA9PiB7XG4gICAgICAgIHRhcmdldHMucHVzaChcbiAgICAgICAgICB7IGlkOiB0YXJnZXQubGlzdGVuZXJBcm4gfSxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIC8vIElQIFRhcmdldHNcbiAgICB9IGVsc2UgaWYgKHByb3BzLmlwVGFyZ2V0cyAmJiBwcm9wcy5pcFRhcmdldHMubGVuZ3RoID4gMFxuICAgICAgJiYgcHJvcHMuaW5zdGFuY2V0YXJnZXRzID09PSB1bmRlZmluZWRcbiAgICAgICYmIHByb3BzLmxhbWJkYVRhcmdldHMgPT09IHVuZGVmaW5lZFxuICAgICAgJiYgcHJvcHMuYWxiVGFyZ2V0cyA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgdGFyZ2V0VHlwZSA9IFRhcmdldFR5cGUuSVA7XG4gICAgICBwcm9wcy5pcFRhcmdldHMuZm9yRWFjaCgodGFyZ2V0KSA9PiB7XG4gICAgICAgIHRhcmdldHMucHVzaChcbiAgICAgICAgICB7IGlkOiB0YXJnZXQgfSxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgb25lIGtpbmQgb2YgdGFyZ2V0IGNhbiBiZSBzcGVjaWZlZCwgYW5kIGF0IGxlYXN0IG9uZSB0YXJnZXQgbXVzdCBiZSBwcm92aWRlZCcpO1xuICAgIH07XG5cbiAgICAvLyBjaGVjayB0aGF0IHRoZXJlIGlzIGEgY29uZmlnIGlmIHRoZSB0YXJnZXQgdHlwZSBpcyBsYW1iZGFcbiAgICBpZiAoIHByb3BzLmxhbWJkYVRhcmdldHMgJiYgcHJvcHMuY29uZmlnICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBjb25maWd1cmF0aW9uIHNob3VsZCBiZSBzdXBwbGllZCBmb3IgYSB0YXJnZXQgZ3JvdXAgb2YgbGFtYmRhcycpO1xuICAgIH1cblxuICAgIGNvbnN0IHRhcmdldEdyb3VwID0gbmV3IGF3c192cGNsYXR0aWNlLkNmblRhcmdldEdyb3VwKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6IHRhcmdldFR5cGUsXG4gICAgICBuYW1lOiBwcm9wcy5uYW1lLFxuICAgICAgY29uZmlnOiBwcm9wcy5jb25maWc/LnRhcmdldEdyb3VwQ2ZnLFxuICAgICAgdGFyZ2V0czogdGFyZ2V0cyxcbiAgICB9KTtcblxuICAgIHRoaXMudGFyZ2V0R3JvdXBJZCA9IHRhcmdldEdyb3VwLmF0dHJJZDtcbiAgICB0aGlzLnRhcmdldEdyb3VwQXJuID0gdGFyZ2V0R3JvdXAuYXR0ckFybjtcbiAgfVxufSJdfQ==