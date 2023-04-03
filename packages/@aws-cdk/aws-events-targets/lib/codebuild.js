"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeBuildProject = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const util_1 = require("./util");
/**
 * Start a CodeBuild build when an Amazon EventBridge rule is triggered.
 */
class CodeBuildProject {
    constructor(project, props = {}) {
        this.project = project;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_targets_CodeBuildProjectProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CodeBuildProject);
            }
            throw error;
        }
    }
    /**
     * Allows using build projects as event rule targets.
     */
    bind(_rule, _id) {
        if (this.props.deadLetterQueue) {
            util_1.addToDeadLetterQueueResourcePolicy(_rule, this.props.deadLetterQueue);
        }
        const role = this.props.eventRole || util_1.singletonEventRole(this.project);
        role.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['codebuild:StartBuild'],
            resources: [this.project.projectArn],
        }));
        return {
            ...util_1.bindBaseTargetConfig(this.props),
            arn: this.project.projectArn,
            role,
            input: this.props.event,
            targetResource: this.project,
        };
    }
}
exports.CodeBuildProject = CodeBuildProject;
_a = JSII_RTTI_SYMBOL_1;
CodeBuildProject[_a] = { fqn: "@aws-cdk/aws-events-targets.CodeBuildProject", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWJ1aWxkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29kZWJ1aWxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLHdDQUF3QztBQUN4QyxpQ0FBdUg7QUF5QnZIOztHQUVHO0FBQ0gsTUFBYSxnQkFBZ0I7SUFDM0IsWUFDbUIsT0FBMkIsRUFDM0IsUUFBK0IsRUFBRTtRQURqQyxZQUFPLEdBQVAsT0FBTyxDQUFvQjtRQUMzQixVQUFLLEdBQUwsS0FBSyxDQUE0Qjs7Ozs7OytDQUh6QyxnQkFBZ0I7Ozs7S0FJdkI7SUFFSjs7T0FFRztJQUNJLElBQUksQ0FBQyxLQUFtQixFQUFFLEdBQVk7UUFFM0MsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRTtZQUM5Qix5Q0FBa0MsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUN2RTtRQUVELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLHlCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ2hELE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO1lBQ2pDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1NBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBRUosT0FBTztZQUNMLEdBQUcsMkJBQW9CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNuQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQzVCLElBQUk7WUFDSixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLO1lBQ3ZCLGNBQWMsRUFBRSxJQUFJLENBQUMsT0FBTztTQUM3QixDQUFDO0tBQ0g7O0FBNUJILDRDQTZCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdAYXdzLWNkay9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IGFkZFRvRGVhZExldHRlclF1ZXVlUmVzb3VyY2VQb2xpY3ksIGJpbmRCYXNlVGFyZ2V0Q29uZmlnLCBzaW5nbGV0b25FdmVudFJvbGUsIFRhcmdldEJhc2VQcm9wcyB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogQ3VzdG9taXplIHRoZSBDb2RlQnVpbGQgRXZlbnQgVGFyZ2V0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29kZUJ1aWxkUHJvamVjdFByb3BzIGV4dGVuZHMgVGFyZ2V0QmFzZVByb3BzIHtcblxuICAvKipcbiAgICogVGhlIHJvbGUgdG8gYXNzdW1lIGJlZm9yZSBpbnZva2luZyB0aGUgdGFyZ2V0XG4gICAqIChpLmUuLCB0aGUgY29kZWJ1aWxkKSB3aGVuIHRoZSBnaXZlbiBydWxlIGlzIHRyaWdnZXJlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBhIG5ldyByb2xlIHdpbGwgYmUgY3JlYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgZXZlbnRSb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgZXZlbnQgdG8gc2VuZCB0byBDb2RlQnVpbGRcbiAgICpcbiAgICogVGhpcyB3aWxsIGJlIHRoZSBwYXlsb2FkIGZvciB0aGUgU3RhcnRCdWlsZCBBUEkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIGVudGlyZSBFdmVudEJyaWRnZSBldmVudFxuICAgKi9cbiAgcmVhZG9ubHkgZXZlbnQ/OiBldmVudHMuUnVsZVRhcmdldElucHV0O1xufVxuXG4vKipcbiAqIFN0YXJ0IGEgQ29kZUJ1aWxkIGJ1aWxkIHdoZW4gYW4gQW1hem9uIEV2ZW50QnJpZGdlIHJ1bGUgaXMgdHJpZ2dlcmVkLlxuICovXG5leHBvcnQgY2xhc3MgQ29kZUJ1aWxkUHJvamVjdCBpbXBsZW1lbnRzIGV2ZW50cy5JUnVsZVRhcmdldCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcHJvamVjdDogY29kZWJ1aWxkLklQcm9qZWN0LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IENvZGVCdWlsZFByb2plY3RQcm9wcyA9IHt9LFxuICApIHt9XG5cbiAgLyoqXG4gICAqIEFsbG93cyB1c2luZyBidWlsZCBwcm9qZWN0cyBhcyBldmVudCBydWxlIHRhcmdldHMuXG4gICAqL1xuICBwdWJsaWMgYmluZChfcnVsZTogZXZlbnRzLklSdWxlLCBfaWQ/OiBzdHJpbmcpOiBldmVudHMuUnVsZVRhcmdldENvbmZpZyB7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5kZWFkTGV0dGVyUXVldWUpIHtcbiAgICAgIGFkZFRvRGVhZExldHRlclF1ZXVlUmVzb3VyY2VQb2xpY3koX3J1bGUsIHRoaXMucHJvcHMuZGVhZExldHRlclF1ZXVlKTtcbiAgICB9XG5cbiAgICBjb25zdCByb2xlID0gdGhpcy5wcm9wcy5ldmVudFJvbGUgfHwgc2luZ2xldG9uRXZlbnRSb2xlKHRoaXMucHJvamVjdCk7XG4gICAgcm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2NvZGVidWlsZDpTdGFydEJ1aWxkJ10sXG4gICAgICByZXNvdXJjZXM6IFt0aGlzLnByb2plY3QucHJvamVjdEFybl0sXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmJpbmRCYXNlVGFyZ2V0Q29uZmlnKHRoaXMucHJvcHMpLFxuICAgICAgYXJuOiB0aGlzLnByb2plY3QucHJvamVjdEFybixcbiAgICAgIHJvbGUsXG4gICAgICBpbnB1dDogdGhpcy5wcm9wcy5ldmVudCxcbiAgICAgIHRhcmdldFJlc291cmNlOiB0aGlzLnByb2plY3QsXG4gICAgfTtcbiAgfVxufVxuIl19