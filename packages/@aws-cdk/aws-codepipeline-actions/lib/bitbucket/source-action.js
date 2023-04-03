"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitBucketSourceAction = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const source_action_1 = require("../codestar-connections/source-action");
/**
 * A CodePipeline source action for BitBucket.
 *
 * @deprecated use CodeStarConnectionsSourceAction instead
 */
class BitBucketSourceAction {
    constructor(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-codepipeline-actions.BitBucketSourceAction", "use CodeStarConnectionsSourceAction instead");
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_BitBucketSourceActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, BitBucketSourceAction);
            }
            throw error;
        }
        this.codeStarConnectionsSourceAction = new source_action_1.CodeStarConnectionsSourceAction(props);
    }
    get actionProperties() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-codepipeline-actions.BitBucketSourceAction#actionProperties", "use CodeStarConnectionsSourceAction instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "actionProperties").get);
            }
            throw error;
        }
        return this.codeStarConnectionsSourceAction.actionProperties;
    }
    bind(scope, stage, options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-codepipeline-actions.BitBucketSourceAction#bind", "use CodeStarConnectionsSourceAction instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        return this.codeStarConnectionsSourceAction.bind(scope, stage, options);
    }
    onStateChange(name, target, options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-codepipeline-actions.BitBucketSourceAction#onStateChange", "use CodeStarConnectionsSourceAction instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.onStateChange);
            }
            throw error;
        }
        return this.codeStarConnectionsSourceAction.onStateChange(name, target, options);
    }
}
exports.BitBucketSourceAction = BitBucketSourceAction;
_a = JSII_RTTI_SYMBOL_1;
BitBucketSourceAction[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.BitBucketSourceAction", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNvdXJjZS1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR0EseUVBQThIO0FBVTlIOzs7O0dBSUc7QUFDSCxNQUFhLHFCQUFxQjtJQUdoQyxZQUFZLEtBQWlDOzs7Ozs7OytDQUhsQyxxQkFBcUI7Ozs7UUFJOUIsSUFBSSxDQUFDLCtCQUErQixHQUFHLElBQUksK0NBQStCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbkY7SUFFRCxJQUFXLGdCQUFnQjs7Ozs7Ozs7OztRQUN6QixPQUFPLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxnQkFBZ0IsQ0FBQztLQUM5RDtJQUVNLElBQUksQ0FBQyxLQUFnQixFQUFFLEtBQTBCLEVBQUUsT0FBdUM7Ozs7Ozs7Ozs7UUFDL0YsT0FBTyxJQUFJLENBQUMsK0JBQStCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDekU7SUFFTSxhQUFhLENBQUMsSUFBWSxFQUFFLE1BQTJCLEVBQUUsT0FBMEI7Ozs7Ozs7Ozs7UUFDeEYsT0FBTyxJQUFJLENBQUMsK0JBQStCLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDbEY7O0FBakJILHNEQWtCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ29kZVN0YXJDb25uZWN0aW9uc1NvdXJjZUFjdGlvbiwgQ29kZVN0YXJDb25uZWN0aW9uc1NvdXJjZUFjdGlvblByb3BzIH0gZnJvbSAnLi4vY29kZXN0YXItY29ubmVjdGlvbnMvc291cmNlLWFjdGlvbic7XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGBCaXRCdWNrZXRTb3VyY2VBY3Rpb25gLlxuICpcbiAqIEBkZXByZWNhdGVkIHVzZSBDb2RlU3RhckNvbm5lY3Rpb25zU291cmNlQWN0aW9uUHJvcHMgaW5zdGVhZFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJpdEJ1Y2tldFNvdXJjZUFjdGlvblByb3BzIGV4dGVuZHMgQ29kZVN0YXJDb25uZWN0aW9uc1NvdXJjZUFjdGlvblByb3BzIHtcbn1cblxuLyoqXG4gKiBBIENvZGVQaXBlbGluZSBzb3VyY2UgYWN0aW9uIGZvciBCaXRCdWNrZXQuXG4gKlxuICogQGRlcHJlY2F0ZWQgdXNlIENvZGVTdGFyQ29ubmVjdGlvbnNTb3VyY2VBY3Rpb24gaW5zdGVhZFxuICovXG5leHBvcnQgY2xhc3MgQml0QnVja2V0U291cmNlQWN0aW9uIGltcGxlbWVudHMgY29kZXBpcGVsaW5lLklBY3Rpb24ge1xuICBwcml2YXRlIHJlYWRvbmx5IGNvZGVTdGFyQ29ubmVjdGlvbnNTb3VyY2VBY3Rpb246IENvZGVTdGFyQ29ubmVjdGlvbnNTb3VyY2VBY3Rpb247XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IEJpdEJ1Y2tldFNvdXJjZUFjdGlvblByb3BzKSB7XG4gICAgdGhpcy5jb2RlU3RhckNvbm5lY3Rpb25zU291cmNlQWN0aW9uID0gbmV3IENvZGVTdGFyQ29ubmVjdGlvbnNTb3VyY2VBY3Rpb24ocHJvcHMpO1xuICB9XG5cbiAgcHVibGljIGdldCBhY3Rpb25Qcm9wZXJ0aWVzKCk6IGNvZGVwaXBlbGluZS5BY3Rpb25Qcm9wZXJ0aWVzIHtcbiAgICByZXR1cm4gdGhpcy5jb2RlU3RhckNvbm5lY3Rpb25zU291cmNlQWN0aW9uLmFjdGlvblByb3BlcnRpZXM7XG4gIH1cblxuICBwdWJsaWMgYmluZChzY29wZTogQ29uc3RydWN0LCBzdGFnZTogY29kZXBpcGVsaW5lLklTdGFnZSwgb3B0aW9uczogY29kZXBpcGVsaW5lLkFjdGlvbkJpbmRPcHRpb25zKTogY29kZXBpcGVsaW5lLkFjdGlvbkNvbmZpZyB7XG4gICAgcmV0dXJuIHRoaXMuY29kZVN0YXJDb25uZWN0aW9uc1NvdXJjZUFjdGlvbi5iaW5kKHNjb3BlLCBzdGFnZSwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgb25TdGF0ZUNoYW5nZShuYW1lOiBzdHJpbmcsIHRhcmdldD86IGV2ZW50cy5JUnVsZVRhcmdldCwgb3B0aW9ucz86IGV2ZW50cy5SdWxlUHJvcHMpOiBldmVudHMuUnVsZSB7XG4gICAgcmV0dXJuIHRoaXMuY29kZVN0YXJDb25uZWN0aW9uc1NvdXJjZUFjdGlvbi5vblN0YXRlQ2hhbmdlKG5hbWUsIHRhcmdldCwgb3B0aW9ucyk7XG4gIH1cbn1cbiJdfQ==