"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnsTopic = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const util_1 = require("./util");
/**
 * Use an SNS topic as a target for Amazon EventBridge rules.
 *
 * @example
 *   /// fixture=withRepoAndTopic
 *   // publish to an SNS topic every time code is committed
 *   // to a CodeCommit repository
 *   repository.onCommit('onCommit', { target: new targets.SnsTopic(topic) });
 *
 */
class SnsTopic {
    constructor(topic, props = {}) {
        this.topic = topic;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_targets_SnsTopicProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SnsTopic);
            }
            throw error;
        }
    }
    /**
     * Returns a RuleTarget that can be used to trigger this SNS topic as a
     * result from an EventBridge event.
     *
     * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/resource-based-policies-eventbridge.html#sns-permissions
     */
    bind(_rule, _id) {
        // deduplicated automatically
        this.topic.grantPublish(new iam.ServicePrincipal('events.amazonaws.com'));
        if (this.props.deadLetterQueue) {
            util_1.addToDeadLetterQueueResourcePolicy(_rule, this.props.deadLetterQueue);
        }
        return {
            ...util_1.bindBaseTargetConfig(this.props),
            arn: this.topic.topicArn,
            input: this.props.message,
            targetResource: this.topic,
        };
    }
}
exports.SnsTopic = SnsTopic;
_a = JSII_RTTI_SYMBOL_1;
SnsTopic[_a] = { fqn: "@aws-cdk/aws-events-targets.SnsTopic", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdDQUF3QztBQUV4QyxpQ0FBbUc7QUFjbkc7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBYSxRQUFRO0lBQ25CLFlBQTRCLEtBQWlCLEVBQW1CLFFBQXVCLEVBQUU7UUFBN0QsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUFtQixVQUFLLEdBQUwsS0FBSyxDQUFvQjs7Ozs7OytDQUQ5RSxRQUFROzs7O0tBRWxCO0lBRUQ7Ozs7O09BS0c7SUFDSSxJQUFJLENBQUMsS0FBbUIsRUFBRSxHQUFZO1FBQzNDLDZCQUE2QjtRQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7UUFFMUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRTtZQUM5Qix5Q0FBa0MsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUN2RTtRQUVELE9BQU87WUFDTCxHQUFHLDJCQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDbkMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtZQUN4QixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO1lBQ3pCLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSztTQUMzQixDQUFDO0tBQ0g7O0FBeEJILDRCQXlCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zJztcbmltcG9ydCB7IGFkZFRvRGVhZExldHRlclF1ZXVlUmVzb3VyY2VQb2xpY3ksIFRhcmdldEJhc2VQcm9wcywgYmluZEJhc2VUYXJnZXRDb25maWcgfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIEN1c3RvbWl6ZSB0aGUgU05TIFRvcGljIEV2ZW50IFRhcmdldFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNuc1RvcGljUHJvcHMgZXh0ZW5kcyBUYXJnZXRCYXNlUHJvcHMge1xuICAvKipcbiAgICogVGhlIG1lc3NhZ2UgdG8gc2VuZCB0byB0aGUgdG9waWNcbiAgICpcbiAgICogQGRlZmF1bHQgdGhlIGVudGlyZSBFdmVudEJyaWRnZSBldmVudFxuICAgKi9cbiAgcmVhZG9ubHkgbWVzc2FnZT86IGV2ZW50cy5SdWxlVGFyZ2V0SW5wdXQ7XG59XG5cbi8qKlxuICogVXNlIGFuIFNOUyB0b3BpYyBhcyBhIHRhcmdldCBmb3IgQW1hem9uIEV2ZW50QnJpZGdlIHJ1bGVzLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgIC8vLyBmaXh0dXJlPXdpdGhSZXBvQW5kVG9waWNcbiAqICAgLy8gcHVibGlzaCB0byBhbiBTTlMgdG9waWMgZXZlcnkgdGltZSBjb2RlIGlzIGNvbW1pdHRlZFxuICogICAvLyB0byBhIENvZGVDb21taXQgcmVwb3NpdG9yeVxuICogICByZXBvc2l0b3J5Lm9uQ29tbWl0KCdvbkNvbW1pdCcsIHsgdGFyZ2V0OiBuZXcgdGFyZ2V0cy5TbnNUb3BpYyh0b3BpYykgfSk7XG4gKlxuICovXG5leHBvcnQgY2xhc3MgU25zVG9waWMgaW1wbGVtZW50cyBldmVudHMuSVJ1bGVUYXJnZXQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdG9waWM6IHNucy5JVG9waWMsIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IFNuc1RvcGljUHJvcHMgPSB7fSkge1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBSdWxlVGFyZ2V0IHRoYXQgY2FuIGJlIHVzZWQgdG8gdHJpZ2dlciB0aGlzIFNOUyB0b3BpYyBhcyBhXG4gICAqIHJlc3VsdCBmcm9tIGFuIEV2ZW50QnJpZGdlIGV2ZW50LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9ldmVudGJyaWRnZS9sYXRlc3QvdXNlcmd1aWRlL3Jlc291cmNlLWJhc2VkLXBvbGljaWVzLWV2ZW50YnJpZGdlLmh0bWwjc25zLXBlcm1pc3Npb25zXG4gICAqL1xuICBwdWJsaWMgYmluZChfcnVsZTogZXZlbnRzLklSdWxlLCBfaWQ/OiBzdHJpbmcpOiBldmVudHMuUnVsZVRhcmdldENvbmZpZyB7XG4gICAgLy8gZGVkdXBsaWNhdGVkIGF1dG9tYXRpY2FsbHlcbiAgICB0aGlzLnRvcGljLmdyYW50UHVibGlzaChuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2V2ZW50cy5hbWF6b25hd3MuY29tJykpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuZGVhZExldHRlclF1ZXVlKSB7XG4gICAgICBhZGRUb0RlYWRMZXR0ZXJRdWV1ZVJlc291cmNlUG9saWN5KF9ydWxlLCB0aGlzLnByb3BzLmRlYWRMZXR0ZXJRdWV1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmJpbmRCYXNlVGFyZ2V0Q29uZmlnKHRoaXMucHJvcHMpLFxuICAgICAgYXJuOiB0aGlzLnRvcGljLnRvcGljQXJuLFxuICAgICAgaW5wdXQ6IHRoaXMucHJvcHMubWVzc2FnZSxcbiAgICAgIHRhcmdldFJlc291cmNlOiB0aGlzLnRvcGljLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==