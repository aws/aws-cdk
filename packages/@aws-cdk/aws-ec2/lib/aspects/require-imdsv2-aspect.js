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
_a = JSII_RTTI_SYMBOL_1;
InstanceRequireImdsv2Aspect[_a] = { fqn: "@aws-cdk/aws-ec2.InstanceRequireImdsv2Aspect", version: "0.0.0" };
exports.InstanceRequireImdsv2Aspect = InstanceRequireImdsv2Aspect;
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
_b = JSII_RTTI_SYMBOL_1;
LaunchTemplateRequireImdsv2Aspect[_b] = { fqn: "@aws-cdk/aws-ec2.LaunchTemplateRequireImdsv2Aspect", version: "0.0.0" };
exports.LaunchTemplateRequireImdsv2Aspect = LaunchTemplateRequireImdsv2Aspect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZS1pbWRzdjItYXNwZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVxdWlyZS1pbWRzdjItYXNwZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFDQUFxQztBQUNyQyx5Q0FBeUM7QUFFekMsb0RBQXFEO0FBQ3JELDBDQUF1QztBQUN2Qyx3REFBb0Q7QUFjcEQ7O0dBRUc7QUFDSCxNQUFlLG1CQUFtQjtJQUdoQyxZQUFZLEtBQWdDO1FBQzFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLEVBQUUsZ0JBQWdCLElBQUksS0FBSyxDQUFDO0tBQzFEO0lBSUQ7Ozs7O09BS0c7SUFDTyxJQUFJLENBQUMsSUFBZ0IsRUFBRSxPQUFlO1FBQzlDLElBQUksSUFBSSxDQUFDLGdCQUFnQixLQUFLLElBQUksRUFBRTtZQUNsQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLG1CQUFtQixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQy9HO0tBQ0Y7Q0FDRjtBQWtCRDs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFhLDJCQUE0QixTQUFRLG1CQUFtQjtJQUdsRSxZQUFZLEtBQXdDO1FBQ2xELEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzs7Ozs7OytDQUpKLDJCQUEyQjs7OztRQUtwQyxJQUFJLENBQUMsNkJBQTZCLEdBQUcsS0FBSyxFQUFFLDZCQUE2QixJQUFJLEtBQUssQ0FBQztLQUNwRjtJQUVELEtBQUssQ0FBQyxJQUFnQjtRQUNwQixJQUFJLENBQUMsQ0FBQyxJQUFJLFlBQVksbUJBQVEsQ0FBQyxFQUFFO1lBQy9CLE9BQU87U0FDUjtRQUNELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEtBQUssU0FBUyxFQUFFO1lBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLDRGQUE0RixDQUFDLENBQUM7WUFDOUcsT0FBTztTQUNSO1FBRUQsTUFBTSxjQUFjLEdBQUcsSUFBSSxpQ0FBaUIsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDbkUsa0JBQWtCLEVBQUU7Z0JBQ2xCLGVBQWUsRUFBRTtvQkFDZixVQUFVLEVBQUUsVUFBVTtpQkFDdkI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUNILElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxFQUFFO1lBQ3JGLGNBQWMsQ0FBQyxrQkFBa0IsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUN4RTthQUFNO1lBQ0wsY0FBYyxDQUFDLGtCQUFrQixHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLGdCQUFnQixDQUFDO1NBQ3JFO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEdBQUc7WUFDN0Isa0JBQWtCLEVBQUUsY0FBYyxDQUFDLGtCQUFrQjtZQUNyRCxPQUFPLEVBQUUsY0FBYyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLFFBQVEsRUFBRTtTQUNqRSxDQUFDO0tBQ0g7SUFFUyxJQUFJLENBQUMsSUFBZ0IsRUFBRSxPQUFlO1FBQzlDLElBQUksSUFBSSxDQUFDLDZCQUE2QixLQUFLLElBQUksRUFBRTtZQUMvQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztTQUMzQjtLQUNGOzs7O0FBdkNVLGtFQUEyQjtBQStDeEM7Ozs7R0FJRztBQUNILE1BQWEsaUNBQWtDLFNBQVEsbUJBQW1CO0lBQ3hFLFlBQVksS0FBOEM7UUFDeEQsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7Ozs7K0NBRkosaUNBQWlDOzs7O0tBRzNDO0lBRUQsS0FBSyxDQUFDLElBQWdCO1FBQ3BCLElBQUksQ0FBQyxDQUFDLElBQUksWUFBWSxnQ0FBYyxDQUFDLEVBQUU7WUFDckMsT0FBTztTQUNSO1FBRUQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFzQixDQUFDO1FBQy9FLE1BQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQztRQUMvQyxJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO1lBQ3RELE9BQU87U0FDUjtRQUVELE1BQU0sZUFBZSxHQUFJLElBQXFELENBQUMsZUFBZSxDQUFDO1FBQy9GLElBQUksR0FBRyxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLG9EQUFvRCxDQUFDLENBQUM7WUFDdEUsT0FBTztTQUNSO1FBRUQsTUFBTSxPQUFPLEdBQWlEO1lBQzVELEdBQUcsSUFBSTtZQUNQLGVBQWUsRUFBRTtnQkFDZixHQUFHLGVBQWU7Z0JBQ2xCLFVBQVUsRUFBRSxVQUFVO2FBQ3ZCO1NBQ0YsQ0FBQztRQUNGLGNBQWMsQ0FBQyxrQkFBa0IsR0FBRyxPQUFPLENBQUM7S0FDN0M7Ozs7QUEvQlUsOEVBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkxhdW5jaFRlbXBsYXRlIH0gZnJvbSAnLi4vZWMyLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL2luc3RhbmNlJztcbmltcG9ydCB7IExhdW5jaFRlbXBsYXRlIH0gZnJvbSAnLi4vbGF1bmNoLXRlbXBsYXRlJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBgUmVxdWlyZUltZHN2MkFzcGVjdGAuXG4gKi9cbmludGVyZmFjZSBSZXF1aXJlSW1kc3YyQXNwZWN0UHJvcHMge1xuICAvKipcbiAgICogV2hldGhlciB3YXJuaW5nIGFubm90YXRpb25zIGZyb20gdGhpcyBBc3BlY3Qgc2hvdWxkIGJlIHN1cHByZXNzZWQgb3Igbm90LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGZhbHNlXG4gICAqL1xuICByZWFkb25seSBzdXBwcmVzc1dhcm5pbmdzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBBc3BlY3QgdGhhdCBtYWtlcyBJTURTdjIgcmVxdWlyZWQuXG4gKi9cbmFic3RyYWN0IGNsYXNzIFJlcXVpcmVJbWRzdjJBc3BlY3QgaW1wbGVtZW50cyBjZGsuSUFzcGVjdCB7XG4gIHByb3RlY3RlZCByZWFkb25seSBzdXBwcmVzc1dhcm5pbmdzOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzPzogUmVxdWlyZUltZHN2MkFzcGVjdFByb3BzKSB7XG4gICAgdGhpcy5zdXBwcmVzc1dhcm5pbmdzID0gcHJvcHM/LnN1cHByZXNzV2FybmluZ3MgPz8gZmFsc2U7XG4gIH1cblxuICBhYnN0cmFjdCB2aXNpdChub2RlOiBJQ29uc3RydWN0KTogdm9pZDtcblxuICAvKipcbiAgICogQWRkcyBhIHdhcm5pbmcgYW5ub3RhdGlvbiB0byBhIG5vZGUsIHVubGVzcyBgc3VwcHJlc3NXYXJuaW5nc2AgaXMgdHJ1ZS5cbiAgICpcbiAgICogQHBhcmFtIG5vZGUgVGhlIHNjb3BlIHRvIGFkZCB0aGUgd2FybmluZyB0by5cbiAgICogQHBhcmFtIG1lc3NhZ2UgVGhlIHdhcm5pbmcgbWVzc2FnZS5cbiAgICovXG4gIHByb3RlY3RlZCB3YXJuKG5vZGU6IElDb25zdHJ1Y3QsIG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGlmICh0aGlzLnN1cHByZXNzV2FybmluZ3MgIT09IHRydWUpIHtcbiAgICAgIGNkay5Bbm5vdGF0aW9ucy5vZihub2RlKS5hZGRXYXJuaW5nKGAke1JlcXVpcmVJbWRzdjJBc3BlY3QubmFtZX0gZmFpbGVkIG9uIG5vZGUgJHtub2RlLm5vZGUuaWR9OiAke21lc3NhZ2V9YCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYEluc3RhbmNlUmVxdWlyZUltZHN2MkFzcGVjdGAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSW5zdGFuY2VSZXF1aXJlSW1kc3YyQXNwZWN0UHJvcHMgZXh0ZW5kcyBSZXF1aXJlSW1kc3YyQXNwZWN0UHJvcHMge1xuICAvKipcbiAgICogV2hldGhlciB3YXJuaW5ncyB0aGF0IHdvdWxkIGJlIHJhaXNlZCB3aGVuIGFuIEluc3RhbmNlIGlzIGFzc29jaWF0ZWQgd2l0aCBhbiBleGlzdGluZyBMYXVuY2ggVGVtcGxhdGVcbiAgICogc2hvdWxkIGJlIHN1cHByZXNzZWQgb3Igbm90LlxuICAgKlxuICAgKiBZb3UgY2FuIHNldCB0aGlzIHRvIGB0cnVlYCBpZiBgTGF1bmNoVGVtcGxhdGVJbWRzQXNwZWN0YCBpcyBiZWluZyB1c2VkIGFsb25nc2lkZSB0aGlzIEFzcGVjdCB0b1xuICAgKiBzdXBwcmVzcyBmYWxzZS1wb3NpdGl2ZSB3YXJuaW5ncyBiZWNhdXNlIGFueSBMYXVuY2ggVGVtcGxhdGVzIGFzc29jaWF0ZWQgd2l0aCBJbnN0YW5jZXMgd2lsbCBzdGlsbCBiZSBjb3ZlcmVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGZhbHNlXG4gICAqL1xuICByZWFkb25seSBzdXBwcmVzc0xhdW5jaFRlbXBsYXRlV2FybmluZz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQXNwZWN0IHRoYXQgYXBwbGllcyBJTURTIGNvbmZpZ3VyYXRpb24gb24gRUMyIEluc3RhbmNlIGNvbnN0cnVjdHMuXG4gKlxuICogVGhpcyBhc3BlY3QgY29uZmlndXJlcyBJTURTIG9uIGFuIEVDMiBpbnN0YW5jZSBieSBjcmVhdGluZyBhIExhdW5jaCBUZW1wbGF0ZSB3aXRoIHRoZVxuICogSU1EUyBjb25maWd1cmF0aW9uIGFuZCBhc3NvY2lhdGluZyB0aGF0IExhdW5jaCBUZW1wbGF0ZSB3aXRoIHRoZSBpbnN0YW5jZS4gSWYgYW4gSW5zdGFuY2VcbiAqIGlzIGFscmVhZHkgYXNzb2NpYXRlZCB3aXRoIGEgTGF1bmNoIFRlbXBsYXRlLCBhIHdhcm5pbmcgd2lsbCAob3B0aW9uYWxseSkgYmUgYWRkZWQgdG8gdGhlXG4gKiBjb25zdHJ1Y3Qgbm9kZSBhbmQgaXQgd2lsbCBiZSBza2lwcGVkLlxuICpcbiAqIFRvIGNvdmVyIEluc3RhbmNlcyBhbHJlYWR5IGFzc29jaWF0ZWQgd2l0aCBMYXVuY2ggVGVtcGxhdGVzLCB1c2UgYExhdW5jaFRlbXBsYXRlSW1kc0FzcGVjdGAuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbnN0YW5jZVJlcXVpcmVJbWRzdjJBc3BlY3QgZXh0ZW5kcyBSZXF1aXJlSW1kc3YyQXNwZWN0IHtcbiAgcHJpdmF0ZSByZWFkb25seSBzdXBwcmVzc0xhdW5jaFRlbXBsYXRlV2FybmluZzogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcz86IEluc3RhbmNlUmVxdWlyZUltZHN2MkFzcGVjdFByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3VwcHJlc3NMYXVuY2hUZW1wbGF0ZVdhcm5pbmcgPSBwcm9wcz8uc3VwcHJlc3NMYXVuY2hUZW1wbGF0ZVdhcm5pbmcgPz8gZmFsc2U7XG4gIH1cblxuICB2aXNpdChub2RlOiBJQ29uc3RydWN0KTogdm9pZCB7XG4gICAgaWYgKCEobm9kZSBpbnN0YW5jZW9mIEluc3RhbmNlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobm9kZS5pbnN0YW5jZS5sYXVuY2hUZW1wbGF0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLndhcm4obm9kZSwgJ0Nhbm5vdCB0b2dnbGUgSU1EU3YxIGJlY2F1c2UgdGhpcyBJbnN0YW5jZSBpcyBhc3NvY2lhdGVkIHdpdGggYW4gZXhpc3RpbmcgTGF1bmNoIFRlbXBsYXRlLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxhdW5jaFRlbXBsYXRlID0gbmV3IENmbkxhdW5jaFRlbXBsYXRlKG5vZGUsICdMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIGxhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBtZXRhZGF0YU9wdGlvbnM6IHtcbiAgICAgICAgICBodHRwVG9rZW5zOiAncmVxdWlyZWQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBpZiAoY2RrLkZlYXR1cmVGbGFncy5vZihub2RlKS5pc0VuYWJsZWQoY3hhcGkuRUMyX1VOSVFVRV9JTURTVjJfTEFVTkNIX1RFTVBMQVRFX05BTUUpKSB7XG4gICAgICBsYXVuY2hUZW1wbGF0ZS5sYXVuY2hUZW1wbGF0ZU5hbWUgPSBjZGsuTmFtZXMudW5pcXVlSWQobGF1bmNoVGVtcGxhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXVuY2hUZW1wbGF0ZS5sYXVuY2hUZW1wbGF0ZU5hbWUgPSBgJHtub2RlLm5vZGUuaWR9TGF1bmNoVGVtcGxhdGVgO1xuICAgIH1cbiAgICBub2RlLmluc3RhbmNlLmxhdW5jaFRlbXBsYXRlID0ge1xuICAgICAgbGF1bmNoVGVtcGxhdGVOYW1lOiBsYXVuY2hUZW1wbGF0ZS5sYXVuY2hUZW1wbGF0ZU5hbWUsXG4gICAgICB2ZXJzaW9uOiBsYXVuY2hUZW1wbGF0ZS5nZXRBdHQoJ0xhdGVzdFZlcnNpb25OdW1iZXInKS50b1N0cmluZygpLFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgd2Fybihub2RlOiBJQ29uc3RydWN0LCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5zdXBwcmVzc0xhdW5jaFRlbXBsYXRlV2FybmluZyAhPT0gdHJ1ZSkge1xuICAgICAgc3VwZXIud2Fybihub2RlLCBtZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBgTGF1bmNoVGVtcGxhdGVSZXF1aXJlSW1kc3YyQXNwZWN0YC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMYXVuY2hUZW1wbGF0ZVJlcXVpcmVJbWRzdjJBc3BlY3RQcm9wcyBleHRlbmRzIFJlcXVpcmVJbWRzdjJBc3BlY3RQcm9wcyB7fVxuXG4vKipcbiAqIEFzcGVjdCB0aGF0IGFwcGxpZXMgSU1EUyBjb25maWd1cmF0aW9uIG9uIEVDMiBMYXVuY2ggVGVtcGxhdGUgY29uc3RydWN0cy5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjMi1sYXVuY2h0ZW1wbGF0ZS1sYXVuY2h0ZW1wbGF0ZWRhdGEtbWV0YWRhdGFvcHRpb25zLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIExhdW5jaFRlbXBsYXRlUmVxdWlyZUltZHN2MkFzcGVjdCBleHRlbmRzIFJlcXVpcmVJbWRzdjJBc3BlY3Qge1xuICBjb25zdHJ1Y3Rvcihwcm9wcz86IExhdW5jaFRlbXBsYXRlUmVxdWlyZUltZHN2MkFzcGVjdFByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgdmlzaXQobm9kZTogSUNvbnN0cnVjdCk6IHZvaWQge1xuICAgIGlmICghKG5vZGUgaW5zdGFuY2VvZiBMYXVuY2hUZW1wbGF0ZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsYXVuY2hUZW1wbGF0ZSA9IG5vZGUubm9kZS50cnlGaW5kQ2hpbGQoJ1Jlc291cmNlJykgYXMgQ2ZuTGF1bmNoVGVtcGxhdGU7XG4gICAgY29uc3QgZGF0YSA9IGxhdW5jaFRlbXBsYXRlLmxhdW5jaFRlbXBsYXRlRGF0YTtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChkYXRhKSkge1xuICAgICAgdGhpcy53YXJuKG5vZGUsICdMYXVuY2hUZW1wbGF0ZURhdGEgaXMgYSBDREsgdG9rZW4uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbWV0YWRhdGFPcHRpb25zID0gKGRhdGEgYXMgQ2ZuTGF1bmNoVGVtcGxhdGUuTGF1bmNoVGVtcGxhdGVEYXRhUHJvcGVydHkpLm1ldGFkYXRhT3B0aW9ucztcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChtZXRhZGF0YU9wdGlvbnMpKSB7XG4gICAgICB0aGlzLndhcm4obm9kZSwgJ0xhdW5jaFRlbXBsYXRlRGF0YS5NZXRhZGF0YU9wdGlvbnMgaXMgYSBDREsgdG9rZW4uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV3RGF0YTogQ2ZuTGF1bmNoVGVtcGxhdGUuTGF1bmNoVGVtcGxhdGVEYXRhUHJvcGVydHkgPSB7XG4gICAgICAuLi5kYXRhLFxuICAgICAgbWV0YWRhdGFPcHRpb25zOiB7XG4gICAgICAgIC4uLm1ldGFkYXRhT3B0aW9ucyxcbiAgICAgICAgaHR0cFRva2VuczogJ3JlcXVpcmVkJyxcbiAgICAgIH0sXG4gICAgfTtcbiAgICBsYXVuY2hUZW1wbGF0ZS5sYXVuY2hUZW1wbGF0ZURhdGEgPSBuZXdEYXRhO1xuICB9XG59XG4iXX0=