"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDestination = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const util_1 = require("./util");
/**
 * Use an API Destination rule target.
 */
class ApiDestination {
    constructor(apiDestination, props = {}) {
        this.apiDestination = apiDestination;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_targets_ApiDestinationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ApiDestination);
            }
            throw error;
        }
    }
    /**
     * Returns a RuleTarget that can be used to trigger API destinations
     * from an EventBridge event.
     */
    bind(_rule, _id) {
        const httpParameters = this.props.headerParameters ??
            this.props.pathParameterValues ??
            this.props.queryStringParameters
            ? {
                headerParameters: this.props.headerParameters,
                pathParameterValues: this.props.pathParameterValues,
                queryStringParameters: this.props.queryStringParameters,
            } : undefined;
        if (this.props?.deadLetterQueue) {
            util_1.addToDeadLetterQueueResourcePolicy(_rule, this.props.deadLetterQueue);
        }
        const role = this.props?.eventRole ?? util_1.singletonEventRole(this.apiDestination);
        role.addToPrincipalPolicy(new iam.PolicyStatement({
            resources: [this.apiDestination.apiDestinationArn],
            actions: ['events:InvokeApiDestination'],
        }));
        return {
            ...(this.props ? util_1.bindBaseTargetConfig(this.props) : {}),
            arn: this.apiDestination.apiDestinationArn,
            role,
            input: this.props.event,
            targetResource: this.apiDestination,
            httpParameters,
        };
    }
}
exports.ApiDestination = ApiDestination;
_a = JSII_RTTI_SYMBOL_1;
ApiDestination[_a] = { fqn: "@aws-cdk/aws-events-targets.ApiDestination", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWRlc3RpbmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBpLWRlc3RpbmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdDQUF3QztBQUN4QyxpQ0FBdUg7QUF1RHZIOztHQUVHO0FBQ0gsTUFBYSxjQUFjO0lBQ3pCLFlBQ21CLGNBQXNDLEVBQ3RDLFFBQTZCLEVBQUU7UUFEL0IsbUJBQWMsR0FBZCxjQUFjLENBQXdCO1FBQ3RDLFVBQUssR0FBTCxLQUFLLENBQTBCOzs7Ozs7K0NBSHZDLGNBQWM7Ozs7S0FJcEI7SUFFTDs7O09BR0c7SUFDSSxJQUFJLENBQUMsS0FBbUIsRUFBRSxHQUFZO1FBQzNDLE1BQU0sY0FBYyxHQUNsQixJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQjtZQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQjtZQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQjtZQUM5QixDQUFDLENBQUM7Z0JBQ0EsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0I7Z0JBQzdDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CO2dCQUNuRCxxQkFBcUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQjthQUN4RCxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFFbEIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRTtZQUMvQix5Q0FBa0MsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUN2RTtRQUVELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxJQUFJLHlCQUFrQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM5RSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ2hELFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUM7WUFDbEQsT0FBTyxFQUFFLENBQUMsNkJBQTZCLENBQUM7U0FDekMsQ0FBQyxDQUFDLENBQUM7UUFFSixPQUFPO1lBQ0wsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLDJCQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ3ZELEdBQUcsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQjtZQUMxQyxJQUFJO1lBQ0osS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztZQUN2QixjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDbkMsY0FBYztTQUNmLENBQUM7S0FDSDs7QUF2Q0gsd0NBd0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgYWRkVG9EZWFkTGV0dGVyUXVldWVSZXNvdXJjZVBvbGljeSwgYmluZEJhc2VUYXJnZXRDb25maWcsIHNpbmdsZXRvbkV2ZW50Um9sZSwgVGFyZ2V0QmFzZVByb3BzIH0gZnJvbSAnLi91dGlsJztcblxuLyoqXG4gKiBDdXN0b21pemUgdGhlIEV2ZW50QnJpZGdlIEFwaSBEZXN0aW5hdGlvbnMgVGFyZ2V0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXBpRGVzdGluYXRpb25Qcm9wcyBleHRlbmRzIFRhcmdldEJhc2VQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgZXZlbnQgdG8gc2VuZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBlbnRpcmUgRXZlbnRCcmlkZ2UgZXZlbnRcbiAgICovXG4gIHJlYWRvbmx5IGV2ZW50PzogZXZlbnRzLlJ1bGVUYXJnZXRJbnB1dDtcblxuICAvKipcbiAgICogVGhlIHJvbGUgdG8gYXNzdW1lIGJlZm9yZSBpbnZva2luZyB0aGUgdGFyZ2V0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYSBuZXcgcm9sZSB3aWxsIGJlIGNyZWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IGV2ZW50Um9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogQWRkaXRpb25hbCBoZWFkZXJzIHNlbnQgdG8gdGhlIEFQSSBEZXN0aW5hdGlvblxuICAgKlxuICAgKiBUaGVzZSBhcmUgbWVyZ2VkIHdpdGggaGVhZGVycyBzcGVjaWZpZWQgb24gdGhlIENvbm5lY3Rpb24sIHdpdGhcbiAgICogdGhlIGhlYWRlcnMgb24gdGhlIENvbm5lY3Rpb24gdGFraW5nIHByZWNlZGVuY2UuXG4gICAqXG4gICAqIFlvdSBjYW4gb25seSBzcGVjaWZ5IHNlY3JldCB2YWx1ZXMgb24gdGhlIENvbm5lY3Rpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgaGVhZGVyUGFyYW1ldGVycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG5cbiAgLyoqXG4gICAqIFBhdGggcGFyYW1ldGVycyB0byBpbnNlcnQgaW4gcGxhY2Ugb2YgcGF0aCB3aWxkY2FyZHMgKGAqYCkuXG4gICAqXG4gICAqIElmIHRoZSBBUEkgZGVzdGluYXRpb24gaGFzIGEgd2lsY2FyZCBpbiB0aGUgcGF0aCwgdGhlc2UgcGF0aCBwYXJ0c1xuICAgKiB3aWxsIGJlIGluc2VydGVkIGluIHRoYXQgcGxhY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgcGF0aFBhcmFtZXRlclZhbHVlcz86IHN0cmluZ1tdXG5cbiAgLyoqXG4gICAqIEFkZGl0aW9uYWwgcXVlcnkgc3RyaW5nIHBhcmFtZXRlcnMgc2VudCB0byB0aGUgQVBJIERlc3RpbmF0aW9uXG4gICAqXG4gICAqIFRoZXNlIGFyZSBtZXJnZWQgd2l0aCBoZWFkZXJzIHNwZWNpZmllZCBvbiB0aGUgQ29ubmVjdGlvbiwgd2l0aFxuICAgKiB0aGUgaGVhZGVycyBvbiB0aGUgQ29ubmVjdGlvbiB0YWtpbmcgcHJlY2VkZW5jZS5cbiAgICpcbiAgICogWW91IGNhbiBvbmx5IHNwZWNpZnkgc2VjcmV0IHZhbHVlcyBvbiB0aGUgQ29ubmVjdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBxdWVyeVN0cmluZ1BhcmFtZXRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xufVxuXG4vKipcbiAqIFVzZSBhbiBBUEkgRGVzdGluYXRpb24gcnVsZSB0YXJnZXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBBcGlEZXN0aW5hdGlvbiBpbXBsZW1lbnRzIGV2ZW50cy5JUnVsZVRhcmdldCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXBpRGVzdGluYXRpb246IGV2ZW50cy5JQXBpRGVzdGluYXRpb24sXG4gICAgcHJpdmF0ZSByZWFkb25seSBwcm9wczogQXBpRGVzdGluYXRpb25Qcm9wcyA9IHt9LFxuICApIHsgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgUnVsZVRhcmdldCB0aGF0IGNhbiBiZSB1c2VkIHRvIHRyaWdnZXIgQVBJIGRlc3RpbmF0aW9uc1xuICAgKiBmcm9tIGFuIEV2ZW50QnJpZGdlIGV2ZW50LlxuICAgKi9cbiAgcHVibGljIGJpbmQoX3J1bGU6IGV2ZW50cy5JUnVsZSwgX2lkPzogc3RyaW5nKTogZXZlbnRzLlJ1bGVUYXJnZXRDb25maWcge1xuICAgIGNvbnN0IGh0dHBQYXJhbWV0ZXJzOiBldmVudHMuQ2ZuUnVsZS5IdHRwUGFyYW1ldGVyc1Byb3BlcnR5IHwgdW5kZWZpbmVkID1cbiAgICAgIHRoaXMucHJvcHMuaGVhZGVyUGFyYW1ldGVycyA/P1xuICAgICAgdGhpcy5wcm9wcy5wYXRoUGFyYW1ldGVyVmFsdWVzID8/XG4gICAgICB0aGlzLnByb3BzLnF1ZXJ5U3RyaW5nUGFyYW1ldGVyc1xuICAgICAgICA/IHtcbiAgICAgICAgICBoZWFkZXJQYXJhbWV0ZXJzOiB0aGlzLnByb3BzLmhlYWRlclBhcmFtZXRlcnMsXG4gICAgICAgICAgcGF0aFBhcmFtZXRlclZhbHVlczogdGhpcy5wcm9wcy5wYXRoUGFyYW1ldGVyVmFsdWVzLFxuICAgICAgICAgIHF1ZXJ5U3RyaW5nUGFyYW1ldGVyczogdGhpcy5wcm9wcy5xdWVyeVN0cmluZ1BhcmFtZXRlcnMsXG4gICAgICAgIH0gOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAodGhpcy5wcm9wcz8uZGVhZExldHRlclF1ZXVlKSB7XG4gICAgICBhZGRUb0RlYWRMZXR0ZXJRdWV1ZVJlc291cmNlUG9saWN5KF9ydWxlLCB0aGlzLnByb3BzLmRlYWRMZXR0ZXJRdWV1ZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgcm9sZSA9IHRoaXMucHJvcHM/LmV2ZW50Um9sZSA/PyBzaW5nbGV0b25FdmVudFJvbGUodGhpcy5hcGlEZXN0aW5hdGlvbik7XG4gICAgcm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFt0aGlzLmFwaURlc3RpbmF0aW9uLmFwaURlc3RpbmF0aW9uQXJuXSxcbiAgICAgIGFjdGlvbnM6IFsnZXZlbnRzOkludm9rZUFwaURlc3RpbmF0aW9uJ10sXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLih0aGlzLnByb3BzID8gYmluZEJhc2VUYXJnZXRDb25maWcodGhpcy5wcm9wcykgOiB7fSksXG4gICAgICBhcm46IHRoaXMuYXBpRGVzdGluYXRpb24uYXBpRGVzdGluYXRpb25Bcm4sXG4gICAgICByb2xlLFxuICAgICAgaW5wdXQ6IHRoaXMucHJvcHMuZXZlbnQsXG4gICAgICB0YXJnZXRSZXNvdXJjZTogdGhpcy5hcGlEZXN0aW5hdGlvbixcbiAgICAgIGh0dHBQYXJhbWV0ZXJzLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==