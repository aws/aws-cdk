"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionHook = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const sns = require("@aws-cdk/aws-sns");
const subs = require("@aws-cdk/aws-sns-subscriptions");
const common_1 = require("./common");
const topic_hook_1 = require("./topic-hook");
/**
 * Use a Lambda Function as a hook target
 *
 * Internally creates a Topic to make the connection.
 */
class FunctionHook {
    /**
     * @param fn Function to invoke in response to a lifecycle event
     * @param encryptionKey If provided, this key is used to encrypt the contents of the SNS topic.
     */
    constructor(fn, encryptionKey) {
        this.fn = fn;
        this.encryptionKey = encryptionKey;
    }
    /**
     * If the `IRole` does not exist in `options`, will create an `IRole` and an SNS Topic and attach both to the lifecycle hook.
     * If the `IRole` does exist in `options`, will only create an SNS Topic and attach it to the lifecycle hook.
     */
    bind(_scope, options) {
        const topic = new sns.Topic(_scope, 'Topic', {
            masterKey: this.encryptionKey,
        });
        const role = common_1.createRole(_scope, options.role);
        // Per: https://docs.aws.amazon.com/sns/latest/dg/sns-key-management.html#sns-what-permissions-for-sse
        // Topic's grantPublish() is in a base class that does not know there is a kms key, and so does not
        // grant appropriate permissions to the kms key. We do that here to ensure the correct permissions
        // are in place.
        this.encryptionKey?.grant(role, 'kms:Decrypt', 'kms:GenerateDataKey');
        topic.addSubscription(new subs.LambdaSubscription(this.fn));
        return new topic_hook_1.TopicHook(topic).bind(_scope, { lifecycleHook: options.lifecycleHook, role });
    }
}
exports.FunctionHook = FunctionHook;
_a = JSII_RTTI_SYMBOL_1;
FunctionHook[_a] = { fqn: "@aws-cdk/aws-autoscaling-hooktargets.FunctionHook", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLWhvb2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW1iZGEtaG9vay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUdBLHdDQUF3QztBQUN4Qyx1REFBdUQ7QUFFdkQscUNBQXNDO0FBQ3RDLDZDQUF5QztBQUV6Qzs7OztHQUlHO0FBQ0gsTUFBYSxZQUFZO0lBQ3ZCOzs7T0FHRztJQUNILFlBQTZCLEVBQW9CLEVBQW1CLGFBQXdCO1FBQS9ELE9BQUUsR0FBRixFQUFFLENBQWtCO1FBQW1CLGtCQUFhLEdBQWIsYUFBYSxDQUFXO0tBQzNGO0lBRUQ7OztPQUdHO0lBQ0ksSUFBSSxDQUFDLE1BQWlCLEVBQUUsT0FBMEM7UUFDdkUsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUU7WUFDM0MsU0FBUyxFQUFFLElBQUksQ0FBQyxhQUFhO1NBQzlCLENBQUMsQ0FBQztRQUVILE1BQU0sSUFBSSxHQUFHLG1CQUFVLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU5QyxzR0FBc0c7UUFDdEcsbUdBQW1HO1FBQ25HLGtHQUFrRztRQUNsRyxnQkFBZ0I7UUFDaEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQ3RFLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUQsT0FBTyxJQUFJLHNCQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLGFBQWEsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7S0FDMUY7O0FBMUJILG9DQTJCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGF1dG9zY2FsaW5nIGZyb20gJ0Bhd3MtY2RrL2F3cy1hdXRvc2NhbGluZyc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBzbnMgZnJvbSAnQGF3cy1jZGsvYXdzLXNucyc7XG5pbXBvcnQgKiBhcyBzdWJzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMtc3Vic2NyaXB0aW9ucyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IGNyZWF0ZVJvbGUgfSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQgeyBUb3BpY0hvb2sgfSBmcm9tICcuL3RvcGljLWhvb2snO1xuXG4vKipcbiAqIFVzZSBhIExhbWJkYSBGdW5jdGlvbiBhcyBhIGhvb2sgdGFyZ2V0XG4gKlxuICogSW50ZXJuYWxseSBjcmVhdGVzIGEgVG9waWMgdG8gbWFrZSB0aGUgY29ubmVjdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIEZ1bmN0aW9uSG9vayBpbXBsZW1lbnRzIGF1dG9zY2FsaW5nLklMaWZlY3ljbGVIb29rVGFyZ2V0IHtcbiAgLyoqXG4gICAqIEBwYXJhbSBmbiBGdW5jdGlvbiB0byBpbnZva2UgaW4gcmVzcG9uc2UgdG8gYSBsaWZlY3ljbGUgZXZlbnRcbiAgICogQHBhcmFtIGVuY3J5cHRpb25LZXkgSWYgcHJvdmlkZWQsIHRoaXMga2V5IGlzIHVzZWQgdG8gZW5jcnlwdCB0aGUgY29udGVudHMgb2YgdGhlIFNOUyB0b3BpYy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZm46IGxhbWJkYS5JRnVuY3Rpb24sIHByaXZhdGUgcmVhZG9ubHkgZW5jcnlwdGlvbktleT86IGttcy5JS2V5KSB7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIGBJUm9sZWAgZG9lcyBub3QgZXhpc3QgaW4gYG9wdGlvbnNgLCB3aWxsIGNyZWF0ZSBhbiBgSVJvbGVgIGFuZCBhbiBTTlMgVG9waWMgYW5kIGF0dGFjaCBib3RoIHRvIHRoZSBsaWZlY3ljbGUgaG9vay5cbiAgICogSWYgdGhlIGBJUm9sZWAgZG9lcyBleGlzdCBpbiBgb3B0aW9uc2AsIHdpbGwgb25seSBjcmVhdGUgYW4gU05TIFRvcGljIGFuZCBhdHRhY2ggaXQgdG8gdGhlIGxpZmVjeWNsZSBob29rLlxuICAgKi9cbiAgcHVibGljIGJpbmQoX3Njb3BlOiBDb25zdHJ1Y3QsIG9wdGlvbnM6IGF1dG9zY2FsaW5nLkJpbmRIb29rVGFyZ2V0T3B0aW9ucyk6IGF1dG9zY2FsaW5nLkxpZmVjeWNsZUhvb2tUYXJnZXRDb25maWcge1xuICAgIGNvbnN0IHRvcGljID0gbmV3IHNucy5Ub3BpYyhfc2NvcGUsICdUb3BpYycsIHtcbiAgICAgIG1hc3RlcktleTogdGhpcy5lbmNyeXB0aW9uS2V5LFxuICAgIH0pO1xuXG4gICAgY29uc3Qgcm9sZSA9IGNyZWF0ZVJvbGUoX3Njb3BlLCBvcHRpb25zLnJvbGUpO1xuXG4gICAgLy8gUGVyOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc25zL2xhdGVzdC9kZy9zbnMta2V5LW1hbmFnZW1lbnQuaHRtbCNzbnMtd2hhdC1wZXJtaXNzaW9ucy1mb3Itc3NlXG4gICAgLy8gVG9waWMncyBncmFudFB1Ymxpc2goKSBpcyBpbiBhIGJhc2UgY2xhc3MgdGhhdCBkb2VzIG5vdCBrbm93IHRoZXJlIGlzIGEga21zIGtleSwgYW5kIHNvIGRvZXMgbm90XG4gICAgLy8gZ3JhbnQgYXBwcm9wcmlhdGUgcGVybWlzc2lvbnMgdG8gdGhlIGttcyBrZXkuIFdlIGRvIHRoYXQgaGVyZSB0byBlbnN1cmUgdGhlIGNvcnJlY3QgcGVybWlzc2lvbnNcbiAgICAvLyBhcmUgaW4gcGxhY2UuXG4gICAgdGhpcy5lbmNyeXB0aW9uS2V5Py5ncmFudChyb2xlLCAna21zOkRlY3J5cHQnLCAna21zOkdlbmVyYXRlRGF0YUtleScpO1xuICAgIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5MYW1iZGFTdWJzY3JpcHRpb24odGhpcy5mbikpO1xuICAgIHJldHVybiBuZXcgVG9waWNIb29rKHRvcGljKS5iaW5kKF9zY29wZSwgeyBsaWZlY3ljbGVIb29rOiBvcHRpb25zLmxpZmVjeWNsZUhvb2ssIHJvbGUgfSk7XG4gIH1cbn1cbiJdfQ==