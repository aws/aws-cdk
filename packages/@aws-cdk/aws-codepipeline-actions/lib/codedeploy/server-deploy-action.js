"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeDeployServerDeployAction = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const iam = require("@aws-cdk/aws-iam");
const action_1 = require("../action");
const common_1 = require("../common");
class CodeDeployServerDeployAction extends action_1.Action {
    constructor(props) {
        super({
            ...props,
            resource: props.deploymentGroup,
            category: codepipeline.ActionCategory.DEPLOY,
            provider: 'CodeDeploy',
            artifactBounds: common_1.deployArtifactBounds(),
            inputs: [props.input],
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_CodeDeployServerDeployActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CodeDeployServerDeployAction);
            }
            throw error;
        }
        this.deploymentGroup = props.deploymentGroup;
    }
    bound(_scope, _stage, options) {
        // permissions, based on:
        // https://docs.aws.amazon.com/codedeploy/latest/userguide/auth-and-access-control-permissions-reference.html
        options.role.addToPolicy(new iam.PolicyStatement({
            resources: [this.deploymentGroup.application.applicationArn],
            actions: ['codedeploy:GetApplicationRevision', 'codedeploy:RegisterApplicationRevision'],
        }));
        options.role.addToPolicy(new iam.PolicyStatement({
            resources: [this.deploymentGroup.deploymentGroupArn],
            actions: ['codedeploy:CreateDeployment', 'codedeploy:GetDeployment'],
        }));
        options.role.addToPolicy(new iam.PolicyStatement({
            resources: [this.deploymentGroup.deploymentConfig.deploymentConfigArn],
            actions: ['codedeploy:GetDeploymentConfig'],
        }));
        // grant the ASG Role permissions to read from the Pipeline Bucket
        for (const asg of this.deploymentGroup.autoScalingGroups || []) {
            options.bucket.grantRead(asg);
        }
        // the Action's Role needs to read from the Bucket to get artifacts
        options.bucket.grantRead(options.role);
        return {
            configuration: {
                ApplicationName: this.deploymentGroup.application.applicationName,
                DeploymentGroupName: this.deploymentGroup.deploymentGroupName,
            },
        };
    }
}
exports.CodeDeployServerDeployAction = CodeDeployServerDeployAction;
_a = JSII_RTTI_SYMBOL_1;
CodeDeployServerDeployAction[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.CodeDeployServerDeployAction", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLWRlcGxveS1hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXJ2ZXItZGVwbG95LWFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwwREFBMEQ7QUFDMUQsd0NBQXdDO0FBRXhDLHNDQUFtQztBQUNuQyxzQ0FBaUQ7QUFpQmpELE1BQWEsNEJBQTZCLFNBQVEsZUFBTTtJQUd0RCxZQUFZLEtBQXdDO1FBQ2xELEtBQUssQ0FBQztZQUNKLEdBQUcsS0FBSztZQUNSLFFBQVEsRUFBRSxLQUFLLENBQUMsZUFBZTtZQUMvQixRQUFRLEVBQUUsWUFBWSxDQUFDLGNBQWMsQ0FBQyxNQUFNO1lBQzVDLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLGNBQWMsRUFBRSw2QkFBb0IsRUFBRTtZQUN0QyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1NBQ3RCLENBQUMsQ0FBQzs7Ozs7OytDQVhNLDRCQUE0Qjs7OztRQWFyQyxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7S0FDOUM7SUFFUyxLQUFLLENBQUMsTUFBaUIsRUFBRSxNQUEyQixFQUFFLE9BQXVDO1FBRXJHLHlCQUF5QjtRQUN6Qiw2R0FBNkc7UUFFN0csT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQy9DLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQztZQUM1RCxPQUFPLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSx3Q0FBd0MsQ0FBQztTQUN6RixDQUFDLENBQUMsQ0FBQztRQUVKLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUMvQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDO1lBQ3BELE9BQU8sRUFBRSxDQUFDLDZCQUE2QixFQUFFLDBCQUEwQixDQUFDO1NBQ3JFLENBQUMsQ0FBQyxDQUFDO1FBRUosT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQy9DLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUM7WUFDdEUsT0FBTyxFQUFFLENBQUMsZ0NBQWdDLENBQUM7U0FDNUMsQ0FBQyxDQUFDLENBQUM7UUFFSixrRUFBa0U7UUFDbEUsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixJQUFJLEVBQUUsRUFBRTtZQUM5RCxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMvQjtRQUVELG1FQUFtRTtRQUNuRSxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkMsT0FBTztZQUNMLGFBQWEsRUFBRTtnQkFDYixlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsZUFBZTtnQkFDakUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUI7YUFDOUQ7U0FDRixDQUFDO0tBQ0g7O0FBbERILG9FQW1EQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVkZXBsb3kgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVkZXBsb3knO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb24nO1xuaW1wb3J0IHsgZGVwbG95QXJ0aWZhY3RCb3VuZHMgfSBmcm9tICcuLi9jb21tb24nO1xuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIG9mIHRoZSBgQ29kZURlcGxveVNlcnZlckRlcGxveUFjdGlvbiBDb2RlRGVwbG95IHNlcnZlciBkZXBsb3kgQ29kZVBpcGVsaW5lIEFjdGlvbmAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29kZURlcGxveVNlcnZlckRlcGxveUFjdGlvblByb3BzIGV4dGVuZHMgY29kZXBpcGVsaW5lLkNvbW1vbkF3c0FjdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBzb3VyY2UgdG8gdXNlIGFzIGlucHV0IGZvciBkZXBsb3ltZW50LlxuICAgKi9cbiAgcmVhZG9ubHkgaW5wdXQ6IGNvZGVwaXBlbGluZS5BcnRpZmFjdDtcblxuICAvKipcbiAgICogVGhlIENvZGVEZXBsb3kgc2VydmVyIERlcGxveW1lbnQgR3JvdXAgdG8gZGVwbG95IHRvLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVwbG95bWVudEdyb3VwOiBjb2RlZGVwbG95LklTZXJ2ZXJEZXBsb3ltZW50R3JvdXA7XG59XG5cbmV4cG9ydCBjbGFzcyBDb2RlRGVwbG95U2VydmVyRGVwbG95QWN0aW9uIGV4dGVuZHMgQWN0aW9uIHtcbiAgcHJpdmF0ZSByZWFkb25seSBkZXBsb3ltZW50R3JvdXA6IGNvZGVkZXBsb3kuSVNlcnZlckRlcGxveW1lbnRHcm91cDtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogQ29kZURlcGxveVNlcnZlckRlcGxveUFjdGlvblByb3BzKSB7XG4gICAgc3VwZXIoe1xuICAgICAgLi4ucHJvcHMsXG4gICAgICByZXNvdXJjZTogcHJvcHMuZGVwbG95bWVudEdyb3VwLFxuICAgICAgY2F0ZWdvcnk6IGNvZGVwaXBlbGluZS5BY3Rpb25DYXRlZ29yeS5ERVBMT1ksXG4gICAgICBwcm92aWRlcjogJ0NvZGVEZXBsb3knLFxuICAgICAgYXJ0aWZhY3RCb3VuZHM6IGRlcGxveUFydGlmYWN0Qm91bmRzKCksXG4gICAgICBpbnB1dHM6IFtwcm9wcy5pbnB1dF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmRlcGxveW1lbnRHcm91cCA9IHByb3BzLmRlcGxveW1lbnRHcm91cDtcbiAgfVxuXG4gIHByb3RlY3RlZCBib3VuZChfc2NvcGU6IENvbnN0cnVjdCwgX3N0YWdlOiBjb2RlcGlwZWxpbmUuSVN0YWdlLCBvcHRpb25zOiBjb2RlcGlwZWxpbmUuQWN0aW9uQmluZE9wdGlvbnMpOlxuICBjb2RlcGlwZWxpbmUuQWN0aW9uQ29uZmlnIHtcbiAgICAvLyBwZXJtaXNzaW9ucywgYmFzZWQgb246XG4gICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVkZXBsb3kvbGF0ZXN0L3VzZXJndWlkZS9hdXRoLWFuZC1hY2Nlc3MtY29udHJvbC1wZXJtaXNzaW9ucy1yZWZlcmVuY2UuaHRtbFxuXG4gICAgb3B0aW9ucy5yb2xlLmFkZFRvUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogW3RoaXMuZGVwbG95bWVudEdyb3VwLmFwcGxpY2F0aW9uLmFwcGxpY2F0aW9uQXJuXSxcbiAgICAgIGFjdGlvbnM6IFsnY29kZWRlcGxveTpHZXRBcHBsaWNhdGlvblJldmlzaW9uJywgJ2NvZGVkZXBsb3k6UmVnaXN0ZXJBcHBsaWNhdGlvblJldmlzaW9uJ10sXG4gICAgfSkpO1xuXG4gICAgb3B0aW9ucy5yb2xlLmFkZFRvUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogW3RoaXMuZGVwbG95bWVudEdyb3VwLmRlcGxveW1lbnRHcm91cEFybl0sXG4gICAgICBhY3Rpb25zOiBbJ2NvZGVkZXBsb3k6Q3JlYXRlRGVwbG95bWVudCcsICdjb2RlZGVwbG95OkdldERlcGxveW1lbnQnXSxcbiAgICB9KSk7XG5cbiAgICBvcHRpb25zLnJvbGUuYWRkVG9Qb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbdGhpcy5kZXBsb3ltZW50R3JvdXAuZGVwbG95bWVudENvbmZpZy5kZXBsb3ltZW50Q29uZmlnQXJuXSxcbiAgICAgIGFjdGlvbnM6IFsnY29kZWRlcGxveTpHZXREZXBsb3ltZW50Q29uZmlnJ10sXG4gICAgfSkpO1xuXG4gICAgLy8gZ3JhbnQgdGhlIEFTRyBSb2xlIHBlcm1pc3Npb25zIHRvIHJlYWQgZnJvbSB0aGUgUGlwZWxpbmUgQnVja2V0XG4gICAgZm9yIChjb25zdCBhc2cgb2YgdGhpcy5kZXBsb3ltZW50R3JvdXAuYXV0b1NjYWxpbmdHcm91cHMgfHwgW10pIHtcbiAgICAgIG9wdGlvbnMuYnVja2V0LmdyYW50UmVhZChhc2cpO1xuICAgIH1cblxuICAgIC8vIHRoZSBBY3Rpb24ncyBSb2xlIG5lZWRzIHRvIHJlYWQgZnJvbSB0aGUgQnVja2V0IHRvIGdldCBhcnRpZmFjdHNcbiAgICBvcHRpb25zLmJ1Y2tldC5ncmFudFJlYWQob3B0aW9ucy5yb2xlKTtcblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEFwcGxpY2F0aW9uTmFtZTogdGhpcy5kZXBsb3ltZW50R3JvdXAuYXBwbGljYXRpb24uYXBwbGljYXRpb25OYW1lLFxuICAgICAgICBEZXBsb3ltZW50R3JvdXBOYW1lOiB0aGlzLmRlcGxveW1lbnRHcm91cC5kZXBsb3ltZW50R3JvdXBOYW1lLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iXX0=