"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnmanagedComputeEnvironment = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const core_1 = require("aws-cdk-lib/core");
const aws_batch_1 = require("aws-cdk-lib/aws-batch");
const compute_environment_base_1 = require("./compute-environment-base");
/**
 * Unmanaged ComputeEnvironments do not provision or manage EC2 instances on your behalf.
 *
 * @resource AWS::Batch::ComputeEnvironment
 */
class UnmanagedComputeEnvironment extends compute_environment_base_1.ComputeEnvironmentBase {
    /**
     * Import an UnmanagedComputeEnvironment by its arn
     */
    static fromUnmanagedComputeEnvironmentArn(scope, id, unmanagedComputeEnvironmentArn) {
        const stack = core_1.Stack.of(scope);
        const computeEnvironmentName = stack.splitArn(unmanagedComputeEnvironmentArn, core_1.ArnFormat.SLASH_RESOURCE_NAME).resourceName;
        class Import extends compute_environment_base_1.ComputeEnvironmentBase {
            constructor() {
                super(...arguments);
                this.computeEnvironmentArn = unmanagedComputeEnvironmentArn;
                this.computeEnvironmentName = computeEnvironmentName;
                this.enabled = true;
                this.containerDefinition = {};
            }
        }
        return new Import(scope, id);
    }
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_UnmanagedComputeEnvironmentProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, UnmanagedComputeEnvironment);
            }
            throw error;
        }
        this.unmanagedvCPUs = props?.unmanagedvCpus;
        const resource = new aws_batch_1.CfnComputeEnvironment(this, 'Resource', {
            type: 'unmanaged',
            state: this.enabled ? 'ENABLED' : 'DISABLED',
            computeEnvironmentName: props?.computeEnvironmentName,
            unmanagedvCpus: this.unmanagedvCPUs,
            serviceRole: props?.serviceRole?.roleArn
                ?? new aws_iam_1.Role(this, 'BatchServiceRole', {
                    managedPolicies: [
                        aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSBatchServiceRole'),
                    ],
                    assumedBy: new aws_iam_1.ServicePrincipal('batch.amazonaws.com'),
                }).roleArn,
        });
        this.computeEnvironmentName = this.getResourceNameAttribute(resource.ref);
        this.computeEnvironmentArn = this.getResourceArnAttribute(resource.attrComputeEnvironmentArn, {
            service: 'batch',
            resource: 'compute-environment',
            resourceName: this.physicalName,
        });
    }
}
exports.UnmanagedComputeEnvironment = UnmanagedComputeEnvironment;
_a = JSII_RTTI_SYMBOL_1;
UnmanagedComputeEnvironment[_a] = { fqn: "@aws-cdk/aws-batch-alpha.UnmanagedComputeEnvironment", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5tYW5hZ2VkLWNvbXB1dGUtZW52aXJvbm1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1bm1hbmFnZWQtY29tcHV0ZS1lbnZpcm9ubWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxpREFBNEU7QUFDNUUsMkNBQW9EO0FBRXBELHFEQUE4RDtBQUM5RCx5RUFBa0g7QUFrQ2xIOzs7O0dBSUc7QUFDSCxNQUFhLDJCQUE0QixTQUFRLGlEQUFzQjtJQUNyRTs7T0FFRztJQUNJLE1BQU0sQ0FBQyxrQ0FBa0MsQ0FDOUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsOEJBQXNDO1FBRXBFLE1BQU0sS0FBSyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsTUFBTSxzQkFBc0IsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLDhCQUE4QixFQUFFLGdCQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxZQUFhLENBQUM7UUFFM0gsTUFBTSxNQUFPLFNBQVEsaURBQXNCO1lBQTNDOztnQkFDa0IsMEJBQXFCLEdBQUcsOEJBQThCLENBQUM7Z0JBQ3ZELDJCQUFzQixHQUFHLHNCQUFzQixDQUFDO2dCQUNoRCxZQUFPLEdBQUcsSUFBSSxDQUFDO2dCQUNmLHdCQUFtQixHQUFHLEVBQVMsQ0FBQztZQUNsRCxDQUFDO1NBQUE7UUFFRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQU1ELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0M7UUFDaEYsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7Ozs7OzsrQ0F6QmYsMkJBQTJCOzs7O1FBMkJwQyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssRUFBRSxjQUFjLENBQUM7UUFDNUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxpQ0FBcUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzNELElBQUksRUFBRSxXQUFXO1lBQ2pCLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVU7WUFDNUMsc0JBQXNCLEVBQUUsS0FBSyxFQUFFLHNCQUFzQjtZQUNyRCxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDbkMsV0FBVyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsT0FBTzttQkFDckMsSUFBSSxjQUFJLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO29CQUNwQyxlQUFlLEVBQUU7d0JBQ2YsdUJBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxrQ0FBa0MsQ0FBQztxQkFDM0U7b0JBQ0QsU0FBUyxFQUFFLElBQUksMEJBQWdCLENBQUMscUJBQXFCLENBQUM7aUJBQ3ZELENBQUMsQ0FBQyxPQUFPO1NBQ1gsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUUsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMseUJBQXlCLEVBQUU7WUFDNUYsT0FBTyxFQUFFLE9BQU87WUFDaEIsUUFBUSxFQUFFLHFCQUFxQjtZQUMvQixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7U0FDaEMsQ0FBQyxDQUFDO0tBQ0o7O0FBL0NILGtFQWdEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hbmFnZWRQb2xpY3ksIFJvbGUsIFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IEFybkZvcm1hdCwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYi9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuQ29tcHV0ZUVudmlyb25tZW50IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWJhdGNoJztcbmltcG9ydCB7IElDb21wdXRlRW52aXJvbm1lbnQsIENvbXB1dGVFbnZpcm9ubWVudEJhc2UsIENvbXB1dGVFbnZpcm9ubWVudFByb3BzIH0gZnJvbSAnLi9jb21wdXRlLWVudmlyb25tZW50LWJhc2UnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gVW5tYW5hZ2VkQ29tcHV0ZUVudmlyb25tZW50LiBCYXRjaCB3aWxsIG5vdCBwcm92aXNpb24gaW5zdGFuY2VzIG9uIHlvdXIgYmVoYWxmXG4gKiBpbiB0aGlzIENvbXB1dGVFdmlyb25tZW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElVbm1hbmFnZWRDb21wdXRlRW52aXJvbm1lbnQgZXh0ZW5kcyBJQ29tcHV0ZUVudmlyb25tZW50IHtcbiAgLyoqXG4gICAqIFRoZSB2Q1BVcyB0aGlzIENvbXB1dGUgRW52aXJvbm1lbnQgcHJvdmlkZXMuIFVzZWQgb25seSBieSB0aGVcbiAgICogc2NoZWR1bGVyIHRvIHNjaGVkdWxlIGpvYnMgaW4gYFF1ZXVlYHMgdGhhdCB1c2UgYEZhaXJzaGFyZVNjaGVkdWxpbmdQb2xpY3lgcy5cbiAgICpcbiAgICogKipJZiB0aGlzIHBhcmFtZXRlciBpcyBub3QgcHJvdmlkZWQgb24gYSBmYWlyc2hhcmUgcXVldWUsIG5vIGNhcGFjaXR5IGlzIHJlc2VydmVkKio7XG4gICAqIHRoYXQgaXMsIHRoZSBgRmFpcnNoYXJlU2NoZWR1bGluZ1BvbGljeWAgaXMgaWdub3JlZC5cbiAgICovXG4gIHJlYWRvbmx5IHVubWFuYWdlZHZDUFVzPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gVW5tYW5hZ2VkQ29tcHV0ZUVudmlyb25tZW50LiBCYXRjaCB3aWxsIG5vdCBwcm92aXNpb24gaW5zdGFuY2VzIG9uIHlvdXIgYmVoYWxmXG4gKiBpbiB0aGlzIENvbXB1dGVFdmlyb25tZW50LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVubWFuYWdlZENvbXB1dGVFbnZpcm9ubWVudFByb3BzIGV4dGVuZHMgQ29tcHV0ZUVudmlyb25tZW50UHJvcHMge1xuICAvKipcbiAgICogVGhlIHZDUFVzIHRoaXMgQ29tcHV0ZSBFbnZpcm9ubWVudCBwcm92aWRlcy4gVXNlZCBvbmx5IGJ5IHRoZVxuICAgKiBzY2hlZHVsZXIgdG8gc2NoZWR1bGUgam9icyBpbiBgUXVldWVgcyB0aGF0IHVzZSBgRmFpcnNoYXJlU2NoZWR1bGluZ1BvbGljeWBzLlxuICAgKlxuICAgKiAqKklmIHRoaXMgcGFyYW1ldGVyIGlzIG5vdCBwcm92aWRlZCBvbiBhIGZhaXJzaGFyZSBxdWV1ZSwgbm8gY2FwYWNpdHkgaXMgcmVzZXJ2ZWQqKjtcbiAgICogdGhhdCBpcywgdGhlIGBGYWlyc2hhcmVTY2hlZHVsaW5nUG9saWN5YCBpcyBpZ25vcmVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAwXG4gICAqL1xuICByZWFkb25seSB1bm1hbmFnZWR2Q3B1cz86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBVbm1hbmFnZWQgQ29tcHV0ZUVudmlyb25tZW50cyBkbyBub3QgcHJvdmlzaW9uIG9yIG1hbmFnZSBFQzIgaW5zdGFuY2VzIG9uIHlvdXIgYmVoYWxmLlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkJhdGNoOjpDb21wdXRlRW52aXJvbm1lbnRcbiAqL1xuZXhwb3J0IGNsYXNzIFVubWFuYWdlZENvbXB1dGVFbnZpcm9ubWVudCBleHRlbmRzIENvbXB1dGVFbnZpcm9ubWVudEJhc2UgaW1wbGVtZW50cyBJVW5tYW5hZ2VkQ29tcHV0ZUVudmlyb25tZW50IHtcbiAgLyoqXG4gICAqIEltcG9ydCBhbiBVbm1hbmFnZWRDb21wdXRlRW52aXJvbm1lbnQgYnkgaXRzIGFyblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tVW5tYW5hZ2VkQ29tcHV0ZUVudmlyb25tZW50QXJuKFxuICAgIHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHVubWFuYWdlZENvbXB1dGVFbnZpcm9ubWVudEFybjogc3RyaW5nLFxuICApOiBJVW5tYW5hZ2VkQ29tcHV0ZUVudmlyb25tZW50IHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgICBjb25zdCBjb21wdXRlRW52aXJvbm1lbnROYW1lID0gc3RhY2suc3BsaXRBcm4odW5tYW5hZ2VkQ29tcHV0ZUVudmlyb25tZW50QXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSkucmVzb3VyY2VOYW1lITtcblxuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIENvbXB1dGVFbnZpcm9ubWVudEJhc2UgaW1wbGVtZW50cyBJVW5tYW5hZ2VkQ29tcHV0ZUVudmlyb25tZW50IHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBjb21wdXRlRW52aXJvbm1lbnRBcm4gPSB1bm1hbmFnZWRDb21wdXRlRW52aXJvbm1lbnRBcm47XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgY29tcHV0ZUVudmlyb25tZW50TmFtZSA9IGNvbXB1dGVFbnZpcm9ubWVudE5hbWU7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZW5hYmxlZCA9IHRydWU7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgY29udGFpbmVyRGVmaW5pdGlvbiA9IHt9IGFzIGFueTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IHVubWFuYWdlZHZDUFVzPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICBwdWJsaWMgcmVhZG9ubHkgY29tcHV0ZUVudmlyb25tZW50QXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBjb21wdXRlRW52aXJvbm1lbnROYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBVbm1hbmFnZWRDb21wdXRlRW52aXJvbm1lbnRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgdGhpcy51bm1hbmFnZWR2Q1BVcyA9IHByb3BzPy51bm1hbmFnZWR2Q3B1cztcbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5Db21wdXRlRW52aXJvbm1lbnQodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgdHlwZTogJ3VubWFuYWdlZCcsXG4gICAgICBzdGF0ZTogdGhpcy5lbmFibGVkID8gJ0VOQUJMRUQnIDogJ0RJU0FCTEVEJyxcbiAgICAgIGNvbXB1dGVFbnZpcm9ubWVudE5hbWU6IHByb3BzPy5jb21wdXRlRW52aXJvbm1lbnROYW1lLFxuICAgICAgdW5tYW5hZ2VkdkNwdXM6IHRoaXMudW5tYW5hZ2VkdkNQVXMsXG4gICAgICBzZXJ2aWNlUm9sZTogcHJvcHM/LnNlcnZpY2VSb2xlPy5yb2xlQXJuXG4gICAgICA/PyBuZXcgUm9sZSh0aGlzLCAnQmF0Y2hTZXJ2aWNlUm9sZScsIHtcbiAgICAgICAgbWFuYWdlZFBvbGljaWVzOiBbXG4gICAgICAgICAgTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ3NlcnZpY2Utcm9sZS9BV1NCYXRjaFNlcnZpY2VSb2xlJyksXG4gICAgICAgIF0sXG4gICAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2JhdGNoLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIH0pLnJvbGVBcm4sXG4gICAgfSk7XG4gICAgdGhpcy5jb21wdXRlRW52aXJvbm1lbnROYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UucmVmKTtcbiAgICB0aGlzLmNvbXB1dGVFbnZpcm9ubWVudEFybiA9IHRoaXMuZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUocmVzb3VyY2UuYXR0ckNvbXB1dGVFbnZpcm9ubWVudEFybiwge1xuICAgICAgc2VydmljZTogJ2JhdGNoJyxcbiAgICAgIHJlc291cmNlOiAnY29tcHV0ZS1lbnZpcm9ubWVudCcsXG4gICAgICByZXNvdXJjZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgIH0pO1xuICB9XG59XG4iXX0=