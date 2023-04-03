"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaFunction = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const util_1 = require("./util");
/**
 * Use an AWS Lambda function as an event rule target.
 */
class LambdaFunction {
    constructor(handler, props = {}) {
        this.handler = handler;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_targets_LambdaFunctionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LambdaFunction);
            }
            throw error;
        }
    }
    /**
     * Returns a RuleTarget that can be used to trigger this Lambda as a
     * result from an EventBridge event.
     */
    bind(rule, _id) {
        // Allow handler to be called from rule
        util_1.addLambdaPermission(rule, this.handler);
        if (this.props.deadLetterQueue) {
            util_1.addToDeadLetterQueueResourcePolicy(rule, this.props.deadLetterQueue);
        }
        return {
            ...util_1.bindBaseTargetConfig(this.props),
            arn: this.handler.functionArn,
            input: this.props.event,
            targetResource: this.handler,
        };
    }
}
exports.LambdaFunction = LambdaFunction;
_a = JSII_RTTI_SYMBOL_1;
LambdaFunction[_a] = { fqn: "@aws-cdk/aws-events-targets.LambdaFunction", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGFtYmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLGlDQUF3SDtBQWdCeEg7O0dBRUc7QUFDSCxNQUFhLGNBQWM7SUFDekIsWUFBNkIsT0FBeUIsRUFBbUIsUUFBNkIsRUFBRTtRQUEzRSxZQUFPLEdBQVAsT0FBTyxDQUFrQjtRQUFtQixVQUFLLEdBQUwsS0FBSyxDQUEwQjs7Ozs7OytDQUQ3RixjQUFjOzs7O0tBR3hCO0lBRUQ7OztPQUdHO0lBQ0ksSUFBSSxDQUFDLElBQWtCLEVBQUUsR0FBWTtRQUMxQyx1Q0FBdUM7UUFDdkMsMEJBQW1CLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV4QyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFO1lBQzlCLHlDQUFrQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ3RFO1FBRUQsT0FBTztZQUNMLEdBQUcsMkJBQW9CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNuQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQzdCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUs7WUFDdkIsY0FBYyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQzdCLENBQUM7S0FDSDs7QUF2Qkgsd0NBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgYWRkTGFtYmRhUGVybWlzc2lvbiwgYWRkVG9EZWFkTGV0dGVyUXVldWVSZXNvdXJjZVBvbGljeSwgVGFyZ2V0QmFzZVByb3BzLCBiaW5kQmFzZVRhcmdldENvbmZpZyB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogQ3VzdG9taXplIHRoZSBMYW1iZGEgRXZlbnQgVGFyZ2V0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGFtYmRhRnVuY3Rpb25Qcm9wcyBleHRlbmRzIFRhcmdldEJhc2VQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgZXZlbnQgdG8gc2VuZCB0byB0aGUgTGFtYmRhXG4gICAqXG4gICAqIFRoaXMgd2lsbCBiZSB0aGUgcGF5bG9hZCBzZW50IHRvIHRoZSBMYW1iZGEgRnVuY3Rpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IHRoZSBlbnRpcmUgRXZlbnRCcmlkZ2UgZXZlbnRcbiAgICovXG4gIHJlYWRvbmx5IGV2ZW50PzogZXZlbnRzLlJ1bGVUYXJnZXRJbnB1dDtcbn1cblxuLyoqXG4gKiBVc2UgYW4gQVdTIExhbWJkYSBmdW5jdGlvbiBhcyBhbiBldmVudCBydWxlIHRhcmdldC5cbiAqL1xuZXhwb3J0IGNsYXNzIExhbWJkYUZ1bmN0aW9uIGltcGxlbWVudHMgZXZlbnRzLklSdWxlVGFyZ2V0IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBoYW5kbGVyOiBsYW1iZGEuSUZ1bmN0aW9uLCBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBMYW1iZGFGdW5jdGlvblByb3BzID0ge30pIHtcblxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBSdWxlVGFyZ2V0IHRoYXQgY2FuIGJlIHVzZWQgdG8gdHJpZ2dlciB0aGlzIExhbWJkYSBhcyBhXG4gICAqIHJlc3VsdCBmcm9tIGFuIEV2ZW50QnJpZGdlIGV2ZW50LlxuICAgKi9cbiAgcHVibGljIGJpbmQocnVsZTogZXZlbnRzLklSdWxlLCBfaWQ/OiBzdHJpbmcpOiBldmVudHMuUnVsZVRhcmdldENvbmZpZyB7XG4gICAgLy8gQWxsb3cgaGFuZGxlciB0byBiZSBjYWxsZWQgZnJvbSBydWxlXG4gICAgYWRkTGFtYmRhUGVybWlzc2lvbihydWxlLCB0aGlzLmhhbmRsZXIpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuZGVhZExldHRlclF1ZXVlKSB7XG4gICAgICBhZGRUb0RlYWRMZXR0ZXJRdWV1ZVJlc291cmNlUG9saWN5KHJ1bGUsIHRoaXMucHJvcHMuZGVhZExldHRlclF1ZXVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uYmluZEJhc2VUYXJnZXRDb25maWcodGhpcy5wcm9wcyksXG4gICAgICBhcm46IHRoaXMuaGFuZGxlci5mdW5jdGlvbkFybixcbiAgICAgIGlucHV0OiB0aGlzLnByb3BzLmV2ZW50LFxuICAgICAgdGFyZ2V0UmVzb3VyY2U6IHRoaXMuaGFuZGxlcixcbiAgICB9O1xuICB9XG59XG4iXX0=