"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KinesisStream = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const util_1 = require("./util");
/**
 * Use a Kinesis Stream as a target for AWS CloudWatch event rules.
 *
 * @example
 *   /// fixture=withRepoAndKinesisStream
 *   // put to a Kinesis stream every time code is committed
 *   // to a CodeCommit repository
 *   repository.onCommit('onCommit', { target: new targets.KinesisStream(stream) });
 *
 */
class KinesisStream {
    constructor(stream, props = {}) {
        this.stream = stream;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_targets_KinesisStreamProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, KinesisStream);
            }
            throw error;
        }
    }
    /**
     * Returns a RuleTarget that can be used to trigger this Kinesis Stream as a
     * result from a CloudWatch event.
     */
    bind(_rule, _id) {
        const role = util_1.singletonEventRole(this.stream);
        role.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['kinesis:PutRecord', 'kinesis:PutRecords'],
            resources: [this.stream.streamArn],
        }));
        return {
            arn: this.stream.streamArn,
            role,
            input: this.props.message,
            targetResource: this.stream,
            kinesisParameters: this.props.partitionKeyPath ? { partitionKeyPath: this.props.partitionKeyPath } : undefined,
        };
    }
}
exports.KinesisStream = KinesisStream;
_a = JSII_RTTI_SYMBOL_1;
KinesisStream[_a] = { fqn: "@aws-cdk/aws-events-targets.KinesisStream", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2luZXNpcy1zdHJlYW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJraW5lc2lzLXN0cmVhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx3Q0FBd0M7QUFFeEMsaUNBQTRDO0FBd0I1Qzs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFhLGFBQWE7SUFFeEIsWUFBNkIsTUFBdUIsRUFBbUIsUUFBNEIsRUFBRTtRQUF4RSxXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQUFtQixVQUFLLEdBQUwsS0FBSyxDQUF5Qjs7Ozs7OytDQUYxRixhQUFhOzs7O0tBR3ZCO0lBRUQ7OztPQUdHO0lBQ0ksSUFBSSxDQUFDLEtBQW1CLEVBQUUsR0FBWTtRQUMzQyxNQUFNLElBQUksR0FBRyx5QkFBa0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUNoRCxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxvQkFBb0IsQ0FBQztZQUNwRCxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztTQUNuQyxDQUFDLENBQUMsQ0FBQztRQUVKLE9BQU87WUFDTCxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO1lBQzFCLElBQUk7WUFDSixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO1lBQ3pCLGNBQWMsRUFBRSxJQUFJLENBQUMsTUFBTTtZQUMzQixpQkFBaUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztTQUMvRyxDQUFDO0tBQ0g7O0FBdkJILHNDQXlCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGtpbmVzaXMgZnJvbSAnQGF3cy1jZGsvYXdzLWtpbmVzaXMnO1xuaW1wb3J0IHsgc2luZ2xldG9uRXZlbnRSb2xlIH0gZnJvbSAnLi91dGlsJztcblxuLyoqXG4gKiBDdXN0b21pemUgdGhlIEtpbmVzaXMgU3RyZWFtIEV2ZW50IFRhcmdldFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEtpbmVzaXNTdHJlYW1Qcm9wcyB7XG4gIC8qKlxuICAgKiBQYXJ0aXRpb24gS2V5IFBhdGggZm9yIHJlY29yZHMgc2VudCB0byB0aGlzIHN0cmVhbVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGV2ZW50SWQgYXMgdGhlIHBhcnRpdGlvbiBrZXlcbiAgICovXG4gIHJlYWRvbmx5IHBhcnRpdGlvbktleVBhdGg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBtZXNzYWdlIHRvIHNlbmQgdG8gdGhlIHN0cmVhbS5cbiAgICpcbiAgICogTXVzdCBiZSBhIHZhbGlkIEpTT04gdGV4dCBwYXNzZWQgdG8gdGhlIHRhcmdldCBzdHJlYW0uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIGVudGlyZSBDbG91ZFdhdGNoIGV2ZW50XG4gICAqL1xuICByZWFkb25seSBtZXNzYWdlPzogZXZlbnRzLlJ1bGVUYXJnZXRJbnB1dDtcblxufVxuXG4vKipcbiAqIFVzZSBhIEtpbmVzaXMgU3RyZWFtIGFzIGEgdGFyZ2V0IGZvciBBV1MgQ2xvdWRXYXRjaCBldmVudCBydWxlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogICAvLy8gZml4dHVyZT13aXRoUmVwb0FuZEtpbmVzaXNTdHJlYW1cbiAqICAgLy8gcHV0IHRvIGEgS2luZXNpcyBzdHJlYW0gZXZlcnkgdGltZSBjb2RlIGlzIGNvbW1pdHRlZFxuICogICAvLyB0byBhIENvZGVDb21taXQgcmVwb3NpdG9yeVxuICogICByZXBvc2l0b3J5Lm9uQ29tbWl0KCdvbkNvbW1pdCcsIHsgdGFyZ2V0OiBuZXcgdGFyZ2V0cy5LaW5lc2lzU3RyZWFtKHN0cmVhbSkgfSk7XG4gKlxuICovXG5leHBvcnQgY2xhc3MgS2luZXNpc1N0cmVhbSBpbXBsZW1lbnRzIGV2ZW50cy5JUnVsZVRhcmdldCB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBzdHJlYW06IGtpbmVzaXMuSVN0cmVhbSwgcHJpdmF0ZSByZWFkb25seSBwcm9wczogS2luZXNpc1N0cmVhbVByb3BzID0ge30pIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgUnVsZVRhcmdldCB0aGF0IGNhbiBiZSB1c2VkIHRvIHRyaWdnZXIgdGhpcyBLaW5lc2lzIFN0cmVhbSBhcyBhXG4gICAqIHJlc3VsdCBmcm9tIGEgQ2xvdWRXYXRjaCBldmVudC5cbiAgICovXG4gIHB1YmxpYyBiaW5kKF9ydWxlOiBldmVudHMuSVJ1bGUsIF9pZD86IHN0cmluZyk6IGV2ZW50cy5SdWxlVGFyZ2V0Q29uZmlnIHtcbiAgICBjb25zdCByb2xlID0gc2luZ2xldG9uRXZlbnRSb2xlKHRoaXMuc3RyZWFtKTtcbiAgICByb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsna2luZXNpczpQdXRSZWNvcmQnLCAna2luZXNpczpQdXRSZWNvcmRzJ10sXG4gICAgICByZXNvdXJjZXM6IFt0aGlzLnN0cmVhbS5zdHJlYW1Bcm5dLFxuICAgIH0pKTtcblxuICAgIHJldHVybiB7XG4gICAgICBhcm46IHRoaXMuc3RyZWFtLnN0cmVhbUFybixcbiAgICAgIHJvbGUsXG4gICAgICBpbnB1dDogdGhpcy5wcm9wcy5tZXNzYWdlLFxuICAgICAgdGFyZ2V0UmVzb3VyY2U6IHRoaXMuc3RyZWFtLFxuICAgICAga2luZXNpc1BhcmFtZXRlcnM6IHRoaXMucHJvcHMucGFydGl0aW9uS2V5UGF0aCA/IHsgcGFydGl0aW9uS2V5UGF0aDogdGhpcy5wcm9wcy5wYXJ0aXRpb25LZXlQYXRoIH0gOiB1bmRlZmluZWQsXG4gICAgfTtcbiAgfVxuXG59XG4iXX0=