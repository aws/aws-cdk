"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaunchTemplateRequireImdsv2Aspect = exports.InstanceRequireImdsv2Aspect = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const ec2_generated_1 = require("../ec2.generated");
const instance_1 = require("../instance");
const launch_template_1 = require("../launch-template");
/**
 * Base class for Aspect that makes IMDSv2 required.
 */
class RequireImdsv2Aspect {
    constructor(props) {
        this.suppressWarnings = props?.suppressWarnings ?? false;
    }
    /**
     * Adds a warning annotation to a node, unless `suppressWarnings` is true.
     *
     * @param node The scope to add the warning to.
     * @param message The warning message.
     */
    warn(node, message) {
        if (this.suppressWarnings !== true) {
            cdk.Annotations.of(node).addWarning(`${RequireImdsv2Aspect.name} failed on node ${node.node.id}: ${message}`);
        }
    }
}
/**
 * Aspect that applies IMDS configuration on EC2 Instance constructs.
 *
 * This aspect configures IMDS on an EC2 instance by creating a Launch Template with the
 * IMDS configuration and associating that Launch Template with the instance. If an Instance
 * is already associated with a Launch Template, a warning will (optionally) be added to the
 * construct node and it will be skipped.
 *
 * To cover Instances already associated with Launch Templates, use `LaunchTemplateImdsAspect`.
 */
class InstanceRequireImdsv2Aspect extends RequireImdsv2Aspect {
    constructor(props) {
        super(props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InstanceRequireImdsv2AspectProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, InstanceRequireImdsv2Aspect);
            }
            throw error;
        }
        this.suppressLaunchTemplateWarning = props?.suppressLaunchTemplateWarning ?? false;
    }
    visit(node) {
        if (!(node instanceof instance_1.Instance)) {
            return;
        }
        if (node.instance.launchTemplate !== undefined) {
            this.warn(node, 'Cannot toggle IMDSv1 because this Instance is associated with an existing Launch Template.');
            return;
        }
        const launchTemplate = new ec2_generated_1.CfnLaunchTemplate(node, 'LaunchTemplate', {
            launchTemplateData: {
                metadataOptions: {
                    httpTokens: 'required',
                },
            },
        });
        if (cdk.FeatureFlags.of(node).isEnabled(cxapi.EC2_UNIQUE_IMDSV2_LAUNCH_TEMPLATE_NAME)) {
            launchTemplate.launchTemplateName = cdk.Names.uniqueId(launchTemplate);
        }
        else {
            launchTemplate.launchTemplateName = `${node.node.id}LaunchTemplate`;
        }
        node.instance.launchTemplate = {
            launchTemplateName: launchTemplate.launchTemplateName,
            version: launchTemplate.getAtt('LatestVersionNumber').toString(),
        };
    }
    warn(node, message) {
        if (this.suppressLaunchTemplateWarning !== true) {
            super.warn(node, message);
        }
    }
}
exports.InstanceRequireImdsv2Aspect = InstanceRequireImdsv2Aspect;
_a = JSII_RTTI_SYMBOL_1;
InstanceRequireImdsv2Aspect[_a] = { fqn: "@aws-cdk/aws-ec2.InstanceRequireImdsv2Aspect", version: "0.0.0" };
/**
 * Aspect that applies IMDS configuration on EC2 Launch Template constructs.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-metadataoptions.html
 */
class LaunchTemplateRequireImdsv2Aspect extends RequireImdsv2Aspect {
    constructor(props) {
        super(props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_LaunchTemplateRequireImdsv2AspectProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LaunchTemplateRequireImdsv2Aspect);
            }
            throw error;
        }
    }
    visit(node) {
        if (!(node instanceof launch_template_1.LaunchTemplate)) {
            return;
        }
        const launchTemplate = node.node.tryFindChild('Resource');
        const data = launchTemplate.launchTemplateData;
        if (cdk.isResolvableObject(data)) {
            this.warn(node, 'LaunchTemplateData is a CDK token.');
            return;
        }
        const metadataOptions = data.metadataOptions;
        if (cdk.isResolvableObject(metadataOptions)) {
            this.warn(node, 'LaunchTemplateData.MetadataOptions is a CDK token.');
            return;
        }
        const newData = {
            ...data,
            metadataOptions: {
                ...metadataOptions,
                httpTokens: 'required',
            },
        };
        launchTemplate.launchTemplateData = newData;
    }
}
exports.LaunchTemplateRequireImdsv2Aspect = LaunchTemplateRequireImdsv2Aspect;
_b = JSII_RTTI_SYMBOL_1;
LaunchTemplateRequireImdsv2Aspect[_b] = { fqn: "@aws-cdk/aws-ec2.LaunchTemplateRequireImdsv2Aspect", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZS1pbWRzdjItYXNwZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVxdWlyZS1pbWRzdjItYXNwZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFDQUFxQztBQUNyQyx5Q0FBeUM7QUFFekMsb0RBQXFEO0FBQ3JELDBDQUF1QztBQUN2Qyx3REFBb0Q7QUFjcEQ7O0dBRUc7QUFDSCxNQUFlLG1CQUFtQjtJQUdoQyxZQUFZLEtBQWdDO1FBQzFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLEVBQUUsZ0JBQWdCLElBQUksS0FBSyxDQUFDO0tBQzFEO0lBSUQ7Ozs7O09BS0c7SUFDTyxJQUFJLENBQUMsSUFBZ0IsRUFBRSxPQUFlO1FBQzlDLElBQUksSUFBSSxDQUFDLGdCQUFnQixLQUFLLElBQUksRUFBRTtZQUNsQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLG1CQUFtQixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQy9HO0tBQ0Y7Q0FDRjtBQWtCRDs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFhLDJCQUE0QixTQUFRLG1CQUFtQjtJQUdsRSxZQUFZLEtBQXdDO1FBQ2xELEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzs7Ozs7OytDQUpKLDJCQUEyQjs7OztRQUtwQyxJQUFJLENBQUMsNkJBQTZCLEdBQUcsS0FBSyxFQUFFLDZCQUE2QixJQUFJLEtBQUssQ0FBQztLQUNwRjtJQUVELEtBQUssQ0FBQyxJQUFnQjtRQUNwQixJQUFJLENBQUMsQ0FBQyxJQUFJLFlBQVksbUJBQVEsQ0FBQyxFQUFFO1lBQy9CLE9BQU87U0FDUjtRQUNELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEtBQUssU0FBUyxFQUFFO1lBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLDRGQUE0RixDQUFDLENBQUM7WUFDOUcsT0FBTztTQUNSO1FBRUQsTUFBTSxjQUFjLEdBQUcsSUFBSSxpQ0FBaUIsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDbkUsa0JBQWtCLEVBQUU7Z0JBQ2xCLGVBQWUsRUFBRTtvQkFDZixVQUFVLEVBQUUsVUFBVTtpQkFDdkI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxFQUFFO1lBQ3JGLGNBQWMsQ0FBQyxrQkFBa0IsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUN4RTthQUFNO1lBQ0wsY0FBYyxDQUFDLGtCQUFrQixHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLGdCQUFnQixDQUFDO1NBQ3JFO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEdBQUc7WUFDN0Isa0JBQWtCLEVBQUUsY0FBYyxDQUFDLGtCQUFrQjtZQUNyRCxPQUFPLEVBQUUsY0FBYyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLFFBQVEsRUFBRTtTQUNqRSxDQUFDO0tBQ0g7SUFFUyxJQUFJLENBQUMsSUFBZ0IsRUFBRSxPQUFlO1FBQzlDLElBQUksSUFBSSxDQUFDLDZCQUE2QixLQUFLLElBQUksRUFBRTtZQUMvQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztTQUMzQjtLQUNGOztBQXZDSCxrRUF3Q0M7OztBQU9EOzs7O0dBSUc7QUFDSCxNQUFhLGlDQUFrQyxTQUFRLG1CQUFtQjtJQUN4RSxZQUFZLEtBQThDO1FBQ3hELEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzs7Ozs7OytDQUZKLGlDQUFpQzs7OztLQUczQztJQUVELEtBQUssQ0FBQyxJQUFnQjtRQUNwQixJQUFJLENBQUMsQ0FBQyxJQUFJLFlBQVksZ0NBQWMsQ0FBQyxFQUFFO1lBQ3JDLE9BQU87U0FDUjtRQUVELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBc0IsQ0FBQztRQUMvRSxNQUFNLElBQUksR0FBRyxjQUFjLENBQUMsa0JBQWtCLENBQUM7UUFDL0MsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsb0NBQW9DLENBQUMsQ0FBQztZQUN0RCxPQUFPO1NBQ1I7UUFFRCxNQUFNLGVBQWUsR0FBSSxJQUFxRCxDQUFDLGVBQWUsQ0FBQztRQUMvRixJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsRUFBRTtZQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxvREFBb0QsQ0FBQyxDQUFDO1lBQ3RFLE9BQU87U0FDUjtRQUVELE1BQU0sT0FBTyxHQUFpRDtZQUM1RCxHQUFHLElBQUk7WUFDUCxlQUFlLEVBQUU7Z0JBQ2YsR0FBRyxlQUFlO2dCQUNsQixVQUFVLEVBQUUsVUFBVTthQUN2QjtTQUNGLENBQUM7UUFDRixjQUFjLENBQUMsa0JBQWtCLEdBQUcsT0FBTyxDQUFDO0tBQzdDOztBQS9CSCw4RUFnQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuTGF1bmNoVGVtcGxhdGUgfSBmcm9tICcuLi9lYzIuZ2VuZXJhdGVkJztcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSAnLi4vaW5zdGFuY2UnO1xuaW1wb3J0IHsgTGF1bmNoVGVtcGxhdGUgfSBmcm9tICcuLi9sYXVuY2gtdGVtcGxhdGUnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGBSZXF1aXJlSW1kc3YyQXNwZWN0YC5cbiAqL1xuaW50ZXJmYWNlIFJlcXVpcmVJbWRzdjJBc3BlY3RQcm9wcyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHdhcm5pbmcgYW5ub3RhdGlvbnMgZnJvbSB0aGlzIEFzcGVjdCBzaG91bGQgYmUgc3VwcHJlc3NlZCBvciBub3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHN1cHByZXNzV2FybmluZ3M/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIEFzcGVjdCB0aGF0IG1ha2VzIElNRFN2MiByZXF1aXJlZC5cbiAqL1xuYWJzdHJhY3QgY2xhc3MgUmVxdWlyZUltZHN2MkFzcGVjdCBpbXBsZW1lbnRzIGNkay5JQXNwZWN0IHtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHN1cHByZXNzV2FybmluZ3M6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHJvcHM/OiBSZXF1aXJlSW1kc3YyQXNwZWN0UHJvcHMpIHtcbiAgICB0aGlzLnN1cHByZXNzV2FybmluZ3MgPSBwcm9wcz8uc3VwcHJlc3NXYXJuaW5ncyA/PyBmYWxzZTtcbiAgfVxuXG4gIGFic3RyYWN0IHZpc2l0KG5vZGU6IElDb25zdHJ1Y3QpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgd2FybmluZyBhbm5vdGF0aW9uIHRvIGEgbm9kZSwgdW5sZXNzIGBzdXBwcmVzc1dhcm5pbmdzYCBpcyB0cnVlLlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZSBUaGUgc2NvcGUgdG8gYWRkIHRoZSB3YXJuaW5nIHRvLlxuICAgKiBAcGFyYW0gbWVzc2FnZSBUaGUgd2FybmluZyBtZXNzYWdlLlxuICAgKi9cbiAgcHJvdGVjdGVkIHdhcm4obm9kZTogSUNvbnN0cnVjdCwgbWVzc2FnZTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuc3VwcHJlc3NXYXJuaW5ncyAhPT0gdHJ1ZSkge1xuICAgICAgY2RrLkFubm90YXRpb25zLm9mKG5vZGUpLmFkZFdhcm5pbmcoYCR7UmVxdWlyZUltZHN2MkFzcGVjdC5uYW1lfSBmYWlsZWQgb24gbm9kZSAke25vZGUubm9kZS5pZH06ICR7bWVzc2FnZX1gKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBgSW5zdGFuY2VSZXF1aXJlSW1kc3YyQXNwZWN0YC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbnN0YW5jZVJlcXVpcmVJbWRzdjJBc3BlY3RQcm9wcyBleHRlbmRzIFJlcXVpcmVJbWRzdjJBc3BlY3RQcm9wcyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHdhcm5pbmdzIHRoYXQgd291bGQgYmUgcmFpc2VkIHdoZW4gYW4gSW5zdGFuY2UgaXMgYXNzb2NpYXRlZCB3aXRoIGFuIGV4aXN0aW5nIExhdW5jaCBUZW1wbGF0ZVxuICAgKiBzaG91bGQgYmUgc3VwcHJlc3NlZCBvciBub3QuXG4gICAqXG4gICAqIFlvdSBjYW4gc2V0IHRoaXMgdG8gYHRydWVgIGlmIGBMYXVuY2hUZW1wbGF0ZUltZHNBc3BlY3RgIGlzIGJlaW5nIHVzZWQgYWxvbmdzaWRlIHRoaXMgQXNwZWN0IHRvXG4gICAqIHN1cHByZXNzIGZhbHNlLXBvc2l0aXZlIHdhcm5pbmdzIGJlY2F1c2UgYW55IExhdW5jaCBUZW1wbGF0ZXMgYXNzb2NpYXRlZCB3aXRoIEluc3RhbmNlcyB3aWxsIHN0aWxsIGJlIGNvdmVyZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHN1cHByZXNzTGF1bmNoVGVtcGxhdGVXYXJuaW5nPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBc3BlY3QgdGhhdCBhcHBsaWVzIElNRFMgY29uZmlndXJhdGlvbiBvbiBFQzIgSW5zdGFuY2UgY29uc3RydWN0cy5cbiAqXG4gKiBUaGlzIGFzcGVjdCBjb25maWd1cmVzIElNRFMgb24gYW4gRUMyIGluc3RhbmNlIGJ5IGNyZWF0aW5nIGEgTGF1bmNoIFRlbXBsYXRlIHdpdGggdGhlXG4gKiBJTURTIGNvbmZpZ3VyYXRpb24gYW5kIGFzc29jaWF0aW5nIHRoYXQgTGF1bmNoIFRlbXBsYXRlIHdpdGggdGhlIGluc3RhbmNlLiBJZiBhbiBJbnN0YW5jZVxuICogaXMgYWxyZWFkeSBhc3NvY2lhdGVkIHdpdGggYSBMYXVuY2ggVGVtcGxhdGUsIGEgd2FybmluZyB3aWxsIChvcHRpb25hbGx5KSBiZSBhZGRlZCB0byB0aGVcbiAqIGNvbnN0cnVjdCBub2RlIGFuZCBpdCB3aWxsIGJlIHNraXBwZWQuXG4gKlxuICogVG8gY292ZXIgSW5zdGFuY2VzIGFscmVhZHkgYXNzb2NpYXRlZCB3aXRoIExhdW5jaCBUZW1wbGF0ZXMsIHVzZSBgTGF1bmNoVGVtcGxhdGVJbWRzQXNwZWN0YC5cbiAqL1xuZXhwb3J0IGNsYXNzIEluc3RhbmNlUmVxdWlyZUltZHN2MkFzcGVjdCBleHRlbmRzIFJlcXVpcmVJbWRzdjJBc3BlY3Qge1xuICBwcml2YXRlIHJlYWRvbmx5IHN1cHByZXNzTGF1bmNoVGVtcGxhdGVXYXJuaW5nOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzPzogSW5zdGFuY2VSZXF1aXJlSW1kc3YyQXNwZWN0UHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdXBwcmVzc0xhdW5jaFRlbXBsYXRlV2FybmluZyA9IHByb3BzPy5zdXBwcmVzc0xhdW5jaFRlbXBsYXRlV2FybmluZyA/PyBmYWxzZTtcbiAgfVxuXG4gIHZpc2l0KG5vZGU6IElDb25zdHJ1Y3QpOiB2b2lkIHtcbiAgICBpZiAoIShub2RlIGluc3RhbmNlb2YgSW5zdGFuY2UpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChub2RlLmluc3RhbmNlLmxhdW5jaFRlbXBsYXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMud2Fybihub2RlLCAnQ2Fubm90IHRvZ2dsZSBJTURTdjEgYmVjYXVzZSB0aGlzIEluc3RhbmNlIGlzIGFzc29jaWF0ZWQgd2l0aCBhbiBleGlzdGluZyBMYXVuY2ggVGVtcGxhdGUuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGF1bmNoVGVtcGxhdGUgPSBuZXcgQ2ZuTGF1bmNoVGVtcGxhdGUobm9kZSwgJ0xhdW5jaFRlbXBsYXRlJywge1xuICAgICAgbGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIG1ldGFkYXRhT3B0aW9uczoge1xuICAgICAgICAgIGh0dHBUb2tlbnM6ICdyZXF1aXJlZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGlmIChjZGsuRmVhdHVyZUZsYWdzLm9mKG5vZGUpLmlzRW5hYmxlZChjeGFwaS5FQzJfVU5JUVVFX0lNRFNWMl9MQVVOQ0hfVEVNUExBVEVfTkFNRSkpIHtcbiAgICAgIGxhdW5jaFRlbXBsYXRlLmxhdW5jaFRlbXBsYXRlTmFtZSA9IGNkay5OYW1lcy51bmlxdWVJZChsYXVuY2hUZW1wbGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhdW5jaFRlbXBsYXRlLmxhdW5jaFRlbXBsYXRlTmFtZSA9IGAke25vZGUubm9kZS5pZH1MYXVuY2hUZW1wbGF0ZWA7XG4gICAgfVxuICAgIG5vZGUuaW5zdGFuY2UubGF1bmNoVGVtcGxhdGUgPSB7XG4gICAgICBsYXVuY2hUZW1wbGF0ZU5hbWU6IGxhdW5jaFRlbXBsYXRlLmxhdW5jaFRlbXBsYXRlTmFtZSxcbiAgICAgIHZlcnNpb246IGxhdW5jaFRlbXBsYXRlLmdldEF0dCgnTGF0ZXN0VmVyc2lvbk51bWJlcicpLnRvU3RyaW5nKCksXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCB3YXJuKG5vZGU6IElDb25zdHJ1Y3QsIG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGlmICh0aGlzLnN1cHByZXNzTGF1bmNoVGVtcGxhdGVXYXJuaW5nICE9PSB0cnVlKSB7XG4gICAgICBzdXBlci53YXJuKG5vZGUsIG1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGBMYXVuY2hUZW1wbGF0ZVJlcXVpcmVJbWRzdjJBc3BlY3RgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIExhdW5jaFRlbXBsYXRlUmVxdWlyZUltZHN2MkFzcGVjdFByb3BzIGV4dGVuZHMgUmVxdWlyZUltZHN2MkFzcGVjdFByb3BzIHt9XG5cbi8qKlxuICogQXNwZWN0IHRoYXQgYXBwbGllcyBJTURTIGNvbmZpZ3VyYXRpb24gb24gRUMyIExhdW5jaCBUZW1wbGF0ZSBjb25zdHJ1Y3RzLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWMyLWxhdW5jaHRlbXBsYXRlLWxhdW5jaHRlbXBsYXRlZGF0YS1tZXRhZGF0YW9wdGlvbnMuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgTGF1bmNoVGVtcGxhdGVSZXF1aXJlSW1kc3YyQXNwZWN0IGV4dGVuZHMgUmVxdWlyZUltZHN2MkFzcGVjdCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzPzogTGF1bmNoVGVtcGxhdGVSZXF1aXJlSW1kc3YyQXNwZWN0UHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICB2aXNpdChub2RlOiBJQ29uc3RydWN0KTogdm9pZCB7XG4gICAgaWYgKCEobm9kZSBpbnN0YW5jZW9mIExhdW5jaFRlbXBsYXRlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxhdW5jaFRlbXBsYXRlID0gbm9kZS5ub2RlLnRyeUZpbmRDaGlsZCgnUmVzb3VyY2UnKSBhcyBDZm5MYXVuY2hUZW1wbGF0ZTtcbiAgICBjb25zdCBkYXRhID0gbGF1bmNoVGVtcGxhdGUubGF1bmNoVGVtcGxhdGVEYXRhO1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KGRhdGEpKSB7XG4gICAgICB0aGlzLndhcm4obm9kZSwgJ0xhdW5jaFRlbXBsYXRlRGF0YSBpcyBhIENESyB0b2tlbi4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtZXRhZGF0YU9wdGlvbnMgPSAoZGF0YSBhcyBDZm5MYXVuY2hUZW1wbGF0ZS5MYXVuY2hUZW1wbGF0ZURhdGFQcm9wZXJ0eSkubWV0YWRhdGFPcHRpb25zO1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KG1ldGFkYXRhT3B0aW9ucykpIHtcbiAgICAgIHRoaXMud2Fybihub2RlLCAnTGF1bmNoVGVtcGxhdGVEYXRhLk1ldGFkYXRhT3B0aW9ucyBpcyBhIENESyB0b2tlbi4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdEYXRhOiBDZm5MYXVuY2hUZW1wbGF0ZS5MYXVuY2hUZW1wbGF0ZURhdGFQcm9wZXJ0eSA9IHtcbiAgICAgIC4uLmRhdGEsXG4gICAgICBtZXRhZGF0YU9wdGlvbnM6IHtcbiAgICAgICAgLi4ubWV0YWRhdGFPcHRpb25zLFxuICAgICAgICBodHRwVG9rZW5zOiAncmVxdWlyZWQnLFxuICAgICAgfSxcbiAgICB9O1xuICAgIGxhdW5jaFRlbXBsYXRlLmxhdW5jaFRlbXBsYXRlRGF0YSA9IG5ld0RhdGE7XG4gIH1cbn1cbiJdfQ==