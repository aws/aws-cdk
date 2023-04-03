"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KinesisFirehoseStream = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const util_1 = require("./util");
/**
 * Customize the Firehose Stream Event Target
 */
class KinesisFirehoseStream {
    constructor(stream, props = {}) {
        this.stream = stream;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_targets_KinesisFirehoseStreamProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, KinesisFirehoseStream);
            }
            throw error;
        }
    }
    /**
     * Returns a RuleTarget that can be used to trigger this Firehose Stream as a
     * result from a Event Bridge event.
     */
    bind(_rule, _id) {
        const role = util_1.singletonEventRole(this.stream);
        role.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['firehose:PutRecord', 'firehose:PutRecordBatch'],
            resources: [this.stream.attrArn],
        }));
        return {
            arn: this.stream.attrArn,
            role,
            input: this.props.message,
            targetResource: this.stream,
        };
    }
}
exports.KinesisFirehoseStream = KinesisFirehoseStream;
_a = JSII_RTTI_SYMBOL_1;
KinesisFirehoseStream[_a] = { fqn: "@aws-cdk/aws-events-targets.KinesisFirehoseStream", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2luZXNpcy1maXJlaG9zZS1zdHJlYW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJraW5lc2lzLWZpcmVob3NlLXN0cmVhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx3Q0FBd0M7QUFFeEMsaUNBQTRDO0FBaUI1Qzs7R0FFRztBQUNILE1BQWEscUJBQXFCO0lBRWhDLFlBQTZCLE1BQWtDLEVBQW1CLFFBQW9DLEVBQUU7UUFBM0YsV0FBTSxHQUFOLE1BQU0sQ0FBNEI7UUFBbUIsVUFBSyxHQUFMLEtBQUssQ0FBaUM7Ozs7OzsrQ0FGN0cscUJBQXFCOzs7O0tBRy9CO0lBRUQ7OztPQUdHO0lBQ0ksSUFBSSxDQUFDLEtBQW1CLEVBQUUsR0FBWTtRQUMzQyxNQUFNLElBQUksR0FBRyx5QkFBa0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUNoRCxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSx5QkFBeUIsQ0FBQztZQUMxRCxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztTQUNqQyxDQUFDLENBQUMsQ0FBQztRQUdKLE9BQU87WUFDTCxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO1lBQ3hCLElBQUk7WUFDSixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO1lBQ3pCLGNBQWMsRUFBRSxJQUFJLENBQUMsTUFBTTtTQUM1QixDQUFDO0tBQ0g7O0FBdkJILHNEQXdCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGZpcmVob3NlIGZyb20gJ0Bhd3MtY2RrL2F3cy1raW5lc2lzZmlyZWhvc2UnO1xuaW1wb3J0IHsgc2luZ2xldG9uRXZlbnRSb2xlIH0gZnJvbSAnLi91dGlsJztcblxuLyoqXG4gKiBDdXN0b21pemUgdGhlIEZpcmVob3NlIFN0cmVhbSBFdmVudCBUYXJnZXRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBLaW5lc2lzRmlyZWhvc2VTdHJlYW1Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbWVzc2FnZSB0byBzZW5kIHRvIHRoZSBzdHJlYW0uXG4gICAqXG4gICAqIE11c3QgYmUgYSB2YWxpZCBKU09OIHRleHQgcGFzc2VkIHRvIHRoZSB0YXJnZXQgc3RyZWFtLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBlbnRpcmUgRXZlbnQgQnJpZGdlIGV2ZW50XG4gICAqL1xuICByZWFkb25seSBtZXNzYWdlPzogZXZlbnRzLlJ1bGVUYXJnZXRJbnB1dDtcbn1cblxuXG4vKipcbiAqIEN1c3RvbWl6ZSB0aGUgRmlyZWhvc2UgU3RyZWFtIEV2ZW50IFRhcmdldFxuICovXG5leHBvcnQgY2xhc3MgS2luZXNpc0ZpcmVob3NlU3RyZWFtIGltcGxlbWVudHMgZXZlbnRzLklSdWxlVGFyZ2V0IHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHN0cmVhbTogZmlyZWhvc2UuQ2ZuRGVsaXZlcnlTdHJlYW0sIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IEtpbmVzaXNGaXJlaG9zZVN0cmVhbVByb3BzID0ge30pIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgUnVsZVRhcmdldCB0aGF0IGNhbiBiZSB1c2VkIHRvIHRyaWdnZXIgdGhpcyBGaXJlaG9zZSBTdHJlYW0gYXMgYVxuICAgKiByZXN1bHQgZnJvbSBhIEV2ZW50IEJyaWRnZSBldmVudC5cbiAgICovXG4gIHB1YmxpYyBiaW5kKF9ydWxlOiBldmVudHMuSVJ1bGUsIF9pZD86IHN0cmluZyk6IGV2ZW50cy5SdWxlVGFyZ2V0Q29uZmlnIHtcbiAgICBjb25zdCByb2xlID0gc2luZ2xldG9uRXZlbnRSb2xlKHRoaXMuc3RyZWFtKTtcbiAgICByb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnZmlyZWhvc2U6UHV0UmVjb3JkJywgJ2ZpcmVob3NlOlB1dFJlY29yZEJhdGNoJ10sXG4gICAgICByZXNvdXJjZXM6IFt0aGlzLnN0cmVhbS5hdHRyQXJuXSxcbiAgICB9KSk7XG5cblxuICAgIHJldHVybiB7XG4gICAgICBhcm46IHRoaXMuc3RyZWFtLmF0dHJBcm4sXG4gICAgICByb2xlLFxuICAgICAgaW5wdXQ6IHRoaXMucHJvcHMubWVzc2FnZSxcbiAgICAgIHRhcmdldFJlc291cmNlOiB0aGlzLnN0cmVhbSxcbiAgICB9O1xuICB9XG59Il19