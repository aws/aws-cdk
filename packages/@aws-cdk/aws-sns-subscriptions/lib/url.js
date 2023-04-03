"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlSubscription = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const sns = require("@aws-cdk/aws-sns");
const core_1 = require("@aws-cdk/core");
/**
 * Use a URL as a subscription target
 *
 * The message will be POSTed to the given URL.
 *
 * @see https://docs.aws.amazon.com/sns/latest/dg/sns-http-https-endpoint-as-subscriber.html
 */
class UrlSubscription {
    constructor(url, props = {}) {
        this.url = url;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_sns_subscriptions_UrlSubscriptionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, UrlSubscription);
            }
            throw error;
        }
        this.unresolvedUrl = core_1.Token.isUnresolved(url);
        if (!this.unresolvedUrl && !url.startsWith('http://') && !url.startsWith('https://')) {
            throw new Error('URL must start with either http:// or https://');
        }
        if (this.unresolvedUrl && props.protocol === undefined) {
            throw new Error('Must provide protocol if url is unresolved');
        }
        if (this.unresolvedUrl) {
            this.protocol = props.protocol;
        }
        else {
            this.protocol = this.url.startsWith('https:') ? sns.SubscriptionProtocol.HTTPS : sns.SubscriptionProtocol.HTTP;
        }
    }
    /**
     * Returns a configuration for a URL to subscribe to an SNS topic
     */
    bind(_topic) {
        return {
            subscriberId: this.url,
            endpoint: this.url,
            protocol: this.protocol,
            rawMessageDelivery: this.props.rawMessageDelivery,
            filterPolicy: this.props.filterPolicy,
            filterPolicyWithMessageBody: this.props.filterPolicyWithMessageBody,
            deadLetterQueue: this.props.deadLetterQueue,
        };
    }
}
exports.UrlSubscription = UrlSubscription;
_a = JSII_RTTI_SYMBOL_1;
UrlSubscription[_a] = { fqn: "@aws-cdk/aws-sns-subscriptions.UrlSubscription", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4Qyx3Q0FBc0M7QUF3QnRDOzs7Ozs7R0FNRztBQUNILE1BQWEsZUFBZTtJQUkxQixZQUE2QixHQUFXLEVBQW1CLFFBQThCLEVBQUU7UUFBOUQsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUFtQixVQUFLLEdBQUwsS0FBSyxDQUEyQjs7Ozs7OytDQUpoRixlQUFlOzs7O1FBS3hCLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3BGLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQztTQUNuRTtRQUVELElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUN0RCxNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7U0FDL0Q7UUFFRCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUyxDQUFDO1NBQ2pDO2FBQU07WUFDTCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDO1NBQ2hIO0tBQ0Y7SUFFRDs7T0FFRztJQUNJLElBQUksQ0FBQyxNQUFrQjtRQUM1QixPQUFPO1lBQ0wsWUFBWSxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ3RCLFFBQVEsRUFBRSxJQUFJLENBQUMsR0FBRztZQUNsQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0I7WUFDakQsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWTtZQUNyQywyQkFBMkIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLDJCQUEyQjtZQUNuRSxlQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlO1NBQzVDLENBQUM7S0FDSDs7QUFsQ0gsMENBbUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMnO1xuaW1wb3J0IHsgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvblByb3BzIH0gZnJvbSAnLi9zdWJzY3JpcHRpb24nO1xuXG4vKipcbiAqIE9wdGlvbnMgZm9yIFVSTCBzdWJzY3JpcHRpb25zLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVybFN1YnNjcmlwdGlvblByb3BzIGV4dGVuZHMgU3Vic2NyaXB0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIG1lc3NhZ2UgdG8gdGhlIHF1ZXVlIGlzIHRoZSBzYW1lIGFzIGl0IHdhcyBzZW50IHRvIHRoZSB0b3BpY1xuICAgKlxuICAgKiBJZiBmYWxzZSwgdGhlIG1lc3NhZ2Ugd2lsbCBiZSB3cmFwcGVkIGluIGFuIFNOUyBlbnZlbG9wZS5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHJhd01lc3NhZ2VEZWxpdmVyeT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBzdWJzY3JpcHRpb24ncyBwcm90b2NvbC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBQcm90b2NvbCBpcyBkZXJpdmVkIGZyb20gdXJsXG4gICAqL1xuICByZWFkb25seSBwcm90b2NvbD86IHNucy5TdWJzY3JpcHRpb25Qcm90b2NvbDtcbn1cblxuLyoqXG4gKiBVc2UgYSBVUkwgYXMgYSBzdWJzY3JpcHRpb24gdGFyZ2V0XG4gKlxuICogVGhlIG1lc3NhZ2Ugd2lsbCBiZSBQT1NUZWQgdG8gdGhlIGdpdmVuIFVSTC5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zbnMvbGF0ZXN0L2RnL3Nucy1odHRwLWh0dHBzLWVuZHBvaW50LWFzLXN1YnNjcmliZXIuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgVXJsU3Vic2NyaXB0aW9uIGltcGxlbWVudHMgc25zLklUb3BpY1N1YnNjcmlwdGlvbiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvdG9jb2w6IHNucy5TdWJzY3JpcHRpb25Qcm90b2NvbDtcbiAgcHJpdmF0ZSByZWFkb25seSB1bnJlc29sdmVkVXJsOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdXJsOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IFVybFN1YnNjcmlwdGlvblByb3BzID0ge30pIHtcbiAgICB0aGlzLnVucmVzb2x2ZWRVcmwgPSBUb2tlbi5pc1VucmVzb2x2ZWQodXJsKTtcbiAgICBpZiAoIXRoaXMudW5yZXNvbHZlZFVybCAmJiAhdXJsLnN0YXJ0c1dpdGgoJ2h0dHA6Ly8nKSAmJiAhdXJsLnN0YXJ0c1dpdGgoJ2h0dHBzOi8vJykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVVJMIG11c3Qgc3RhcnQgd2l0aCBlaXRoZXIgaHR0cDovLyBvciBodHRwczovLycpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnVucmVzb2x2ZWRVcmwgJiYgcHJvcHMucHJvdG9jb2wgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IHByb3ZpZGUgcHJvdG9jb2wgaWYgdXJsIGlzIHVucmVzb2x2ZWQnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy51bnJlc29sdmVkVXJsKSB7XG4gICAgICB0aGlzLnByb3RvY29sID0gcHJvcHMucHJvdG9jb2whO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3RvY29sID0gdGhpcy51cmwuc3RhcnRzV2l0aCgnaHR0cHM6JykgPyBzbnMuU3Vic2NyaXB0aW9uUHJvdG9jb2wuSFRUUFMgOiBzbnMuU3Vic2NyaXB0aW9uUHJvdG9jb2wuSFRUUDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGNvbmZpZ3VyYXRpb24gZm9yIGEgVVJMIHRvIHN1YnNjcmliZSB0byBhbiBTTlMgdG9waWNcbiAgICovXG4gIHB1YmxpYyBiaW5kKF90b3BpYzogc25zLklUb3BpYyk6IHNucy5Ub3BpY1N1YnNjcmlwdGlvbkNvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHN1YnNjcmliZXJJZDogdGhpcy51cmwsXG4gICAgICBlbmRwb2ludDogdGhpcy51cmwsXG4gICAgICBwcm90b2NvbDogdGhpcy5wcm90b2NvbCxcbiAgICAgIHJhd01lc3NhZ2VEZWxpdmVyeTogdGhpcy5wcm9wcy5yYXdNZXNzYWdlRGVsaXZlcnksXG4gICAgICBmaWx0ZXJQb2xpY3k6IHRoaXMucHJvcHMuZmlsdGVyUG9saWN5LFxuICAgICAgZmlsdGVyUG9saWN5V2l0aE1lc3NhZ2VCb2R5OiB0aGlzLnByb3BzLmZpbHRlclBvbGljeVdpdGhNZXNzYWdlQm9keSxcbiAgICAgIGRlYWRMZXR0ZXJRdWV1ZTogdGhpcy5wcm9wcy5kZWFkTGV0dGVyUXVldWUsXG4gICAgfTtcbiAgfVxufVxuIl19