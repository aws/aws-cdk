"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSubscription = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const sns = require("@aws-cdk/aws-sns");
/**
 * Use an email address as a subscription target
 *
 * Email subscriptions require confirmation.
 */
class EmailSubscription {
    constructor(emailAddress, props = {}) {
        this.emailAddress = emailAddress;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_sns_subscriptions_EmailSubscriptionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EmailSubscription);
            }
            throw error;
        }
    }
    /**
     * Returns a configuration for an email address to subscribe to an SNS topic
     */
    bind(_topic) {
        return {
            subscriberId: this.emailAddress,
            endpoint: this.emailAddress,
            protocol: this.props.json ? sns.SubscriptionProtocol.EMAIL_JSON : sns.SubscriptionProtocol.EMAIL,
            filterPolicy: this.props.filterPolicy,
            filterPolicyWithMessageBody: this.props.filterPolicyWithMessageBody,
            deadLetterQueue: this.props.deadLetterQueue,
        };
    }
}
exports.EmailSubscription = EmailSubscription;
_a = JSII_RTTI_SYMBOL_1;
EmailSubscription[_a] = { fqn: "@aws-cdk/aws-sns-subscriptions.EmailSubscription", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1haWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbWFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBd0M7QUFnQnhDOzs7O0dBSUc7QUFDSCxNQUFhLGlCQUFpQjtJQUM1QixZQUE2QixZQUFvQixFQUFtQixRQUFnQyxFQUFFO1FBQXpFLGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQW1CLFVBQUssR0FBTCxLQUFLLENBQTZCOzs7Ozs7K0NBRDNGLGlCQUFpQjs7OztLQUUzQjtJQUVEOztPQUVHO0lBQ0ksSUFBSSxDQUFDLE1BQWtCO1FBQzVCLE9BQU87WUFDTCxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDL0IsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQzNCLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLEtBQUs7WUFDaEcsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWTtZQUNyQywyQkFBMkIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLDJCQUEyQjtZQUNuRSxlQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlO1NBQzVDLENBQUM7S0FDSDs7QUFoQkgsOENBaUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uUHJvcHMgfSBmcm9tICcuL3N1YnNjcmlwdGlvbic7XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgZW1haWwgc3Vic2NyaXB0aW9ucy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbWFpbFN1YnNjcmlwdGlvblByb3BzIGV4dGVuZHMgU3Vic2NyaXB0aW9uUHJvcHMge1xuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHRoZSBmdWxsIG5vdGlmaWNhdGlvbiBKU09OIHNob3VsZCBiZSBzZW50IHRvIHRoZSBlbWFpbFxuICAgKiBhZGRyZXNzIG9yIGp1c3QgdGhlIG1lc3NhZ2UgdGV4dC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2UgKE1lc3NhZ2UgdGV4dClcbiAgICovXG4gIHJlYWRvbmx5IGpzb24/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFVzZSBhbiBlbWFpbCBhZGRyZXNzIGFzIGEgc3Vic2NyaXB0aW9uIHRhcmdldFxuICpcbiAqIEVtYWlsIHN1YnNjcmlwdGlvbnMgcmVxdWlyZSBjb25maXJtYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBFbWFpbFN1YnNjcmlwdGlvbiBpbXBsZW1lbnRzIHNucy5JVG9waWNTdWJzY3JpcHRpb24ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGVtYWlsQWRkcmVzczogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBFbWFpbFN1YnNjcmlwdGlvblByb3BzID0ge30pIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgY29uZmlndXJhdGlvbiBmb3IgYW4gZW1haWwgYWRkcmVzcyB0byBzdWJzY3JpYmUgdG8gYW4gU05TIHRvcGljXG4gICAqL1xuICBwdWJsaWMgYmluZChfdG9waWM6IHNucy5JVG9waWMpOiBzbnMuVG9waWNTdWJzY3JpcHRpb25Db25maWcge1xuICAgIHJldHVybiB7XG4gICAgICBzdWJzY3JpYmVySWQ6IHRoaXMuZW1haWxBZGRyZXNzLFxuICAgICAgZW5kcG9pbnQ6IHRoaXMuZW1haWxBZGRyZXNzLFxuICAgICAgcHJvdG9jb2w6IHRoaXMucHJvcHMuanNvbiA/IHNucy5TdWJzY3JpcHRpb25Qcm90b2NvbC5FTUFJTF9KU09OIDogc25zLlN1YnNjcmlwdGlvblByb3RvY29sLkVNQUlMLFxuICAgICAgZmlsdGVyUG9saWN5OiB0aGlzLnByb3BzLmZpbHRlclBvbGljeSxcbiAgICAgIGZpbHRlclBvbGljeVdpdGhNZXNzYWdlQm9keTogdGhpcy5wcm9wcy5maWx0ZXJQb2xpY3lXaXRoTWVzc2FnZUJvZHksXG4gICAgICBkZWFkTGV0dGVyUXVldWU6IHRoaXMucHJvcHMuZGVhZExldHRlclF1ZXVlLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==