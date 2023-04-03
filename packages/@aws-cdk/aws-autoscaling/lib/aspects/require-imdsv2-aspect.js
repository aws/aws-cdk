"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoScalingGroupRequireImdsv2Aspect = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const auto_scaling_group_1 = require("../auto-scaling-group");
/**
 * Aspect that makes IMDSv2 required on instances deployed by AutoScalingGroups.
 */
class AutoScalingGroupRequireImdsv2Aspect {
    constructor() {
    }
    visit(node) {
        if (!(node instanceof auto_scaling_group_1.AutoScalingGroup)) {
            return;
        }
        const launchConfig = node.node.tryFindChild('LaunchConfig');
        if (cdk.isResolvableObject(launchConfig.metadataOptions)) {
            this.warn(node, 'CfnLaunchConfiguration.MetadataOptions field is a CDK token.');
            return;
        }
        launchConfig.metadataOptions = {
            ...launchConfig.metadataOptions,
            httpTokens: 'required',
        };
    }
    /**
     * Adds a warning annotation to a node.
     *
     * @param node The scope to add the warning to.
     * @param message The warning message.
     */
    warn(node, message) {
        cdk.Annotations.of(node).addWarning(`${AutoScalingGroupRequireImdsv2Aspect.name} failed on node ${node.node.id}: ${message}`);
    }
}
exports.AutoScalingGroupRequireImdsv2Aspect = AutoScalingGroupRequireImdsv2Aspect;
_a = JSII_RTTI_SYMBOL_1;
AutoScalingGroupRequireImdsv2Aspect[_a] = { fqn: "@aws-cdk/aws-autoscaling.AutoScalingGroupRequireImdsv2Aspect", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZS1pbWRzdjItYXNwZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVxdWlyZS1pbWRzdjItYXNwZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscUNBQXFDO0FBRXJDLDhEQUF5RDtBQUd6RDs7R0FFRztBQUNILE1BQWEsbUNBQW1DO0lBQzlDO0tBQ0M7SUFFTSxLQUFLLENBQUMsSUFBZ0I7UUFDM0IsSUFBSSxDQUFDLENBQUMsSUFBSSxZQUFZLHFDQUFnQixDQUFDLEVBQUU7WUFDdkMsT0FBTztTQUNSO1FBRUQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUEyQixDQUFDO1FBQ3RGLElBQUksR0FBRyxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsRUFBRTtZQUN4RCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSw4REFBOEQsQ0FBQyxDQUFDO1lBQ2hGLE9BQU87U0FDUjtRQUVELFlBQVksQ0FBQyxlQUFlLEdBQUc7WUFDN0IsR0FBRyxZQUFZLENBQUMsZUFBZTtZQUMvQixVQUFVLEVBQUUsVUFBVTtTQUN2QixDQUFDO0tBQ0g7SUFFRDs7Ozs7T0FLRztJQUNPLElBQUksQ0FBQyxJQUFnQixFQUFFLE9BQWU7UUFDOUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsbUNBQW1DLENBQUMsSUFBSSxtQkFBbUIsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssT0FBTyxFQUFFLENBQUMsQ0FBQztLQUMvSDs7QUE3Qkgsa0ZBOEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQXV0b1NjYWxpbmdHcm91cCB9IGZyb20gJy4uL2F1dG8tc2NhbGluZy1ncm91cCc7XG5pbXBvcnQgeyBDZm5MYXVuY2hDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vYXV0b3NjYWxpbmcuZ2VuZXJhdGVkJztcblxuLyoqXG4gKiBBc3BlY3QgdGhhdCBtYWtlcyBJTURTdjIgcmVxdWlyZWQgb24gaW5zdGFuY2VzIGRlcGxveWVkIGJ5IEF1dG9TY2FsaW5nR3JvdXBzLlxuICovXG5leHBvcnQgY2xhc3MgQXV0b1NjYWxpbmdHcm91cFJlcXVpcmVJbWRzdjJBc3BlY3QgaW1wbGVtZW50cyBjZGsuSUFzcGVjdCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgcHVibGljIHZpc2l0KG5vZGU6IElDb25zdHJ1Y3QpOiB2b2lkIHtcbiAgICBpZiAoIShub2RlIGluc3RhbmNlb2YgQXV0b1NjYWxpbmdHcm91cCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsYXVuY2hDb25maWcgPSBub2RlLm5vZGUudHJ5RmluZENoaWxkKCdMYXVuY2hDb25maWcnKSBhcyBDZm5MYXVuY2hDb25maWd1cmF0aW9uO1xuICAgIGlmIChjZGsuaXNSZXNvbHZhYmxlT2JqZWN0KGxhdW5jaENvbmZpZy5tZXRhZGF0YU9wdGlvbnMpKSB7XG4gICAgICB0aGlzLndhcm4obm9kZSwgJ0NmbkxhdW5jaENvbmZpZ3VyYXRpb24uTWV0YWRhdGFPcHRpb25zIGZpZWxkIGlzIGEgQ0RLIHRva2VuLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxhdW5jaENvbmZpZy5tZXRhZGF0YU9wdGlvbnMgPSB7XG4gICAgICAuLi5sYXVuY2hDb25maWcubWV0YWRhdGFPcHRpb25zLFxuICAgICAgaHR0cFRva2VuczogJ3JlcXVpcmVkJyxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB3YXJuaW5nIGFubm90YXRpb24gdG8gYSBub2RlLlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZSBUaGUgc2NvcGUgdG8gYWRkIHRoZSB3YXJuaW5nIHRvLlxuICAgKiBAcGFyYW0gbWVzc2FnZSBUaGUgd2FybmluZyBtZXNzYWdlLlxuICAgKi9cbiAgcHJvdGVjdGVkIHdhcm4obm9kZTogSUNvbnN0cnVjdCwgbWVzc2FnZTogc3RyaW5nKSB7XG4gICAgY2RrLkFubm90YXRpb25zLm9mKG5vZGUpLmFkZFdhcm5pbmcoYCR7QXV0b1NjYWxpbmdHcm91cFJlcXVpcmVJbWRzdjJBc3BlY3QubmFtZX0gZmFpbGVkIG9uIG5vZGUgJHtub2RlLm5vZGUuaWR9OiAke21lc3NhZ2V9YCk7XG4gIH1cbn1cbiJdfQ==