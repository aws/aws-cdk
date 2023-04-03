"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsSubscription = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const sns = require("@aws-cdk/aws-sns");
/**
 * Use an sms address as a subscription target
 */
class SmsSubscription {
    constructor(phoneNumber, props = {}) {
        this.phoneNumber = phoneNumber;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_sns_subscriptions_SmsSubscriptionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SmsSubscription);
            }
            throw error;
        }
    }
    bind(_topic) {
        return {
            subscriberId: this.phoneNumber,
            endpoint: this.phoneNumber,
            protocol: sns.SubscriptionProtocol.SMS,
            filterPolicy: this.props.filterPolicy,
            filterPolicyWithMessageBody: this.props.filterPolicyWithMessageBody,
        };
    }
}
exports.SmsSubscription = SmsSubscription;
_a = JSII_RTTI_SYMBOL_1;
SmsSubscription[_a] = { fqn: "@aws-cdk/aws-sns-subscriptions.SmsSubscription", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic21zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQVN4Qzs7R0FFRztBQUNILE1BQWEsZUFBZTtJQUMxQixZQUE2QixXQUFtQixFQUFtQixRQUE4QixFQUFFO1FBQXRFLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQW1CLFVBQUssR0FBTCxLQUFLLENBQTJCOzs7Ozs7K0NBRHhGLGVBQWU7Ozs7S0FFekI7SUFFTSxJQUFJLENBQUMsTUFBa0I7UUFDNUIsT0FBTztZQUNMLFlBQVksRUFBRSxJQUFJLENBQUMsV0FBVztZQUM5QixRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDMUIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHO1lBQ3RDLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7WUFDckMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQywyQkFBMkI7U0FDcEUsQ0FBQztLQUNIOztBQVpILDBDQWFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uUHJvcHMgfSBmcm9tICcuL3N1YnNjcmlwdGlvbic7XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgU01TIHN1YnNjcmlwdGlvbnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU21zU3Vic2NyaXB0aW9uUHJvcHMgZXh0ZW5kcyBTdWJzY3JpcHRpb25Qcm9wcyB7XG59XG5cbi8qKlxuICogVXNlIGFuIHNtcyBhZGRyZXNzIGFzIGEgc3Vic2NyaXB0aW9uIHRhcmdldFxuICovXG5leHBvcnQgY2xhc3MgU21zU3Vic2NyaXB0aW9uIGltcGxlbWVudHMgc25zLklUb3BpY1N1YnNjcmlwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcGhvbmVOdW1iZXI6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBwcm9wczogU21zU3Vic2NyaXB0aW9uUHJvcHMgPSB7fSkge1xuICB9XG5cbiAgcHVibGljIGJpbmQoX3RvcGljOiBzbnMuSVRvcGljKTogc25zLlRvcGljU3Vic2NyaXB0aW9uQ29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3Vic2NyaWJlcklkOiB0aGlzLnBob25lTnVtYmVyLFxuICAgICAgZW5kcG9pbnQ6IHRoaXMucGhvbmVOdW1iZXIsXG4gICAgICBwcm90b2NvbDogc25zLlN1YnNjcmlwdGlvblByb3RvY29sLlNNUyxcbiAgICAgIGZpbHRlclBvbGljeTogdGhpcy5wcm9wcy5maWx0ZXJQb2xpY3ksXG4gICAgICBmaWx0ZXJQb2xpY3lXaXRoTWVzc2FnZUJvZHk6IHRoaXMucHJvcHMuZmlsdGVyUG9saWN5V2l0aE1lc3NhZ2VCb2R5LFxuICAgIH07XG4gIH1cbn1cbiJdfQ==