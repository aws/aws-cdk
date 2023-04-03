"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketPolicy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const cfn_reference_1 = require("@aws-cdk/core/lib/private/cfn-reference");
const bucket_1 = require("./bucket");
const s3_generated_1 = require("./s3.generated");
/**
 * The bucket policy for an Amazon S3 bucket
 *
 * Policies define the operations that are allowed on this resource.
 *
 * You almost never need to define this construct directly.
 *
 * All AWS resources that support resource policies have a method called
 * `addToResourcePolicy()`, which will automatically create a new resource
 * policy if one doesn't exist yet, otherwise it will add to the existing
 * policy.
 *
 * Prefer to use `addToResourcePolicy()` instead.
 */
class BucketPolicy extends core_1.Resource {
    /**
     * Create a mutable `BucketPolicy` from a `CfnBucketPolicy`.
     */
    static fromCfnBucketPolicy(cfnBucketPolicy) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_CfnBucketPolicy(cfnBucketPolicy);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromCfnBucketPolicy);
            }
            throw error;
        }
        // use a "weird" id that has a higher chance of being unique
        const id = '@FromCfnBucketPolicy';
        // if fromCfnBucketPolicy() was already called on this CfnBucketPolicy,
        // return the same L2
        // (as different L2s would conflict, because of the mutation of the document property of the L1 below)
        const existing = cfnBucketPolicy.node.tryFindChild(id);
        if (existing) {
            return existing;
        }
        // resolve the Bucket this Policy references
        let bucket;
        if (core_1.Token.isUnresolved(cfnBucketPolicy.bucket)) {
            const bucketIResolvable = core_1.Tokenization.reverse(cfnBucketPolicy.bucket);
            if (bucketIResolvable instanceof cfn_reference_1.CfnReference) {
                const cfnElement = bucketIResolvable.target;
                if (cfnElement instanceof s3_generated_1.CfnBucket) {
                    bucket = bucket_1.Bucket.fromCfnBucket(cfnElement);
                }
            }
        }
        if (!bucket) {
            bucket = bucket_1.Bucket.fromBucketName(cfnBucketPolicy, '@FromCfnBucket', cfnBucketPolicy.bucket);
        }
        const ret = new class extends BucketPolicy {
            constructor() {
                super(...arguments);
                this.document = aws_iam_1.PolicyDocument.fromJson(cfnBucketPolicy.policyDocument);
            }
        }(cfnBucketPolicy, id, {
            bucket,
        });
        // mark the Bucket as having this Policy
        bucket.policy = ret;
        return ret;
    }
    constructor(scope, id, props) {
        super(scope, id);
        /**
         * A policy document containing permissions to add to the specified bucket.
         * For more information, see Access Policy Language Overview in the Amazon
         * Simple Storage Service Developer Guide.
         */
        this.document = new aws_iam_1.PolicyDocument();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_s3_BucketPolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, BucketPolicy);
            }
            throw error;
        }
        this.bucket = props.bucket;
        this.resource = new s3_generated_1.CfnBucketPolicy(this, 'Resource', {
            bucket: this.bucket.bucketName,
            policyDocument: this.document,
        });
        if (props.removalPolicy) {
            this.resource.applyRemovalPolicy(props.removalPolicy);
        }
    }
    /**
     * Sets the removal policy for the BucketPolicy.
     * @param removalPolicy the RemovalPolicy to set.
     */
    applyRemovalPolicy(removalPolicy) {
        this.resource.applyRemovalPolicy(removalPolicy);
    }
}
_a = JSII_RTTI_SYMBOL_1;
BucketPolicy[_a] = { fqn: "@aws-cdk/aws-s3.BucketPolicy", version: "0.0.0" };
exports.BucketPolicy = BucketPolicy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LXBvbGljeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1Y2tldC1wb2xpY3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOENBQWtEO0FBQ2xELHdDQUE2RTtBQUM3RSwyRUFBdUU7QUFFdkUscUNBQTJDO0FBQzNDLGlEQUE0RDtBQWdCNUQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILE1BQWEsWUFBYSxTQUFRLGVBQVE7SUFDeEM7O09BRUc7SUFDSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsZUFBZ0M7Ozs7Ozs7Ozs7UUFDaEUsNERBQTREO1FBQzVELE1BQU0sRUFBRSxHQUFHLHNCQUFzQixDQUFDO1FBRWxDLHVFQUF1RTtRQUN2RSxxQkFBcUI7UUFDckIsc0dBQXNHO1FBQ3RHLE1BQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELElBQUksUUFBUSxFQUFFO1lBQ1osT0FBcUIsUUFBUSxDQUFDO1NBQy9CO1FBRUQsNENBQTRDO1FBQzVDLElBQUksTUFBMkIsQ0FBQztRQUNoQyxJQUFJLFlBQUssQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzlDLE1BQU0saUJBQWlCLEdBQUcsbUJBQVksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZFLElBQUksaUJBQWlCLFlBQVksNEJBQVksRUFBRTtnQkFDN0MsTUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxDQUFDO2dCQUM1QyxJQUFJLFVBQVUsWUFBWSx3QkFBUyxFQUFFO29CQUNuQyxNQUFNLEdBQUcsZUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDM0M7YUFDRjtTQUNGO1FBQ0QsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE1BQU0sR0FBRyxlQUFNLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDM0Y7UUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQU0sU0FBUSxZQUFZO1lBQTFCOztnQkFDRSxhQUFRLEdBQUcsd0JBQWMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3JGLENBQUM7U0FBQSxDQUFDLGVBQWUsRUFBRSxFQUFFLEVBQUU7WUFDckIsTUFBTTtTQUNQLENBQUMsQ0FBQztRQUNILHdDQUF3QztRQUN4QyxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNwQixPQUFPLEdBQUcsQ0FBQztLQUNaO0lBY0QsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF3QjtRQUNoRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBYm5COzs7O1dBSUc7UUFDYSxhQUFRLEdBQUcsSUFBSSx3QkFBYyxFQUFFLENBQUM7Ozs7OzsrQ0E5Q3JDLFlBQVk7Ozs7UUF3RHJCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUUzQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksOEJBQWUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BELE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVU7WUFDOUIsY0FBYyxFQUFFLElBQUksQ0FBQyxRQUFRO1NBQzlCLENBQUMsQ0FBQztRQUVILElBQUksS0FBSyxDQUFDLGFBQWEsRUFBRTtZQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUN2RDtLQUNGO0lBRUQ7OztPQUdHO0lBQ0ksa0JBQWtCLENBQUMsYUFBNEI7UUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUNqRDs7OztBQTFFVSxvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBvbGljeURvY3VtZW50IH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBSZW1vdmFsUG9saWN5LCBSZXNvdXJjZSwgVG9rZW4sIFRva2VuaXphdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ2ZuUmVmZXJlbmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZS9saWIvcHJpdmF0ZS9jZm4tcmVmZXJlbmNlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQnVja2V0LCBJQnVja2V0IH0gZnJvbSAnLi9idWNrZXQnO1xuaW1wb3J0IHsgQ2ZuQnVja2V0LCBDZm5CdWNrZXRQb2xpY3kgfSBmcm9tICcuL3MzLmdlbmVyYXRlZCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQnVja2V0UG9saWN5UHJvcHMge1xuICAvKipcbiAgICogVGhlIEFtYXpvbiBTMyBidWNrZXQgdGhhdCB0aGUgcG9saWN5IGFwcGxpZXMgdG8uXG4gICAqL1xuICByZWFkb25seSBidWNrZXQ6IElCdWNrZXQ7XG5cbiAgLyoqXG4gICAqIFBvbGljeSB0byBhcHBseSB3aGVuIHRoZSBwb2xpY3kgaXMgcmVtb3ZlZCBmcm9tIHRoaXMgc3RhY2suXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVtb3ZhbFBvbGljeT86IFJlbW92YWxQb2xpY3k7XG59XG5cbi8qKlxuICogVGhlIGJ1Y2tldCBwb2xpY3kgZm9yIGFuIEFtYXpvbiBTMyBidWNrZXRcbiAqXG4gKiBQb2xpY2llcyBkZWZpbmUgdGhlIG9wZXJhdGlvbnMgdGhhdCBhcmUgYWxsb3dlZCBvbiB0aGlzIHJlc291cmNlLlxuICpcbiAqIFlvdSBhbG1vc3QgbmV2ZXIgbmVlZCB0byBkZWZpbmUgdGhpcyBjb25zdHJ1Y3QgZGlyZWN0bHkuXG4gKlxuICogQWxsIEFXUyByZXNvdXJjZXMgdGhhdCBzdXBwb3J0IHJlc291cmNlIHBvbGljaWVzIGhhdmUgYSBtZXRob2QgY2FsbGVkXG4gKiBgYWRkVG9SZXNvdXJjZVBvbGljeSgpYCwgd2hpY2ggd2lsbCBhdXRvbWF0aWNhbGx5IGNyZWF0ZSBhIG5ldyByZXNvdXJjZVxuICogcG9saWN5IGlmIG9uZSBkb2Vzbid0IGV4aXN0IHlldCwgb3RoZXJ3aXNlIGl0IHdpbGwgYWRkIHRvIHRoZSBleGlzdGluZ1xuICogcG9saWN5LlxuICpcbiAqIFByZWZlciB0byB1c2UgYGFkZFRvUmVzb3VyY2VQb2xpY3koKWAgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGNsYXNzIEJ1Y2tldFBvbGljeSBleHRlbmRzIFJlc291cmNlIHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIG11dGFibGUgYEJ1Y2tldFBvbGljeWAgZnJvbSBhIGBDZm5CdWNrZXRQb2xpY3lgLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQ2ZuQnVja2V0UG9saWN5KGNmbkJ1Y2tldFBvbGljeTogQ2ZuQnVja2V0UG9saWN5KTogQnVja2V0UG9saWN5IHtcbiAgICAvLyB1c2UgYSBcIndlaXJkXCIgaWQgdGhhdCBoYXMgYSBoaWdoZXIgY2hhbmNlIG9mIGJlaW5nIHVuaXF1ZVxuICAgIGNvbnN0IGlkID0gJ0BGcm9tQ2ZuQnVja2V0UG9saWN5JztcblxuICAgIC8vIGlmIGZyb21DZm5CdWNrZXRQb2xpY3koKSB3YXMgYWxyZWFkeSBjYWxsZWQgb24gdGhpcyBDZm5CdWNrZXRQb2xpY3ksXG4gICAgLy8gcmV0dXJuIHRoZSBzYW1lIEwyXG4gICAgLy8gKGFzIGRpZmZlcmVudCBMMnMgd291bGQgY29uZmxpY3QsIGJlY2F1c2Ugb2YgdGhlIG11dGF0aW9uIG9mIHRoZSBkb2N1bWVudCBwcm9wZXJ0eSBvZiB0aGUgTDEgYmVsb3cpXG4gICAgY29uc3QgZXhpc3RpbmcgPSBjZm5CdWNrZXRQb2xpY3kubm9kZS50cnlGaW5kQ2hpbGQoaWQpO1xuICAgIGlmIChleGlzdGluZykge1xuICAgICAgcmV0dXJuIDxCdWNrZXRQb2xpY3k+ZXhpc3Rpbmc7XG4gICAgfVxuXG4gICAgLy8gcmVzb2x2ZSB0aGUgQnVja2V0IHRoaXMgUG9saWN5IHJlZmVyZW5jZXNcbiAgICBsZXQgYnVja2V0OiBJQnVja2V0IHwgdW5kZWZpbmVkO1xuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQoY2ZuQnVja2V0UG9saWN5LmJ1Y2tldCkpIHtcbiAgICAgIGNvbnN0IGJ1Y2tldElSZXNvbHZhYmxlID0gVG9rZW5pemF0aW9uLnJldmVyc2UoY2ZuQnVja2V0UG9saWN5LmJ1Y2tldCk7XG4gICAgICBpZiAoYnVja2V0SVJlc29sdmFibGUgaW5zdGFuY2VvZiBDZm5SZWZlcmVuY2UpIHtcbiAgICAgICAgY29uc3QgY2ZuRWxlbWVudCA9IGJ1Y2tldElSZXNvbHZhYmxlLnRhcmdldDtcbiAgICAgICAgaWYgKGNmbkVsZW1lbnQgaW5zdGFuY2VvZiBDZm5CdWNrZXQpIHtcbiAgICAgICAgICBidWNrZXQgPSBCdWNrZXQuZnJvbUNmbkJ1Y2tldChjZm5FbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWJ1Y2tldCkge1xuICAgICAgYnVja2V0ID0gQnVja2V0LmZyb21CdWNrZXROYW1lKGNmbkJ1Y2tldFBvbGljeSwgJ0BGcm9tQ2ZuQnVja2V0JywgY2ZuQnVja2V0UG9saWN5LmJ1Y2tldCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmV0ID0gbmV3IGNsYXNzIGV4dGVuZHMgQnVja2V0UG9saWN5IHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBkb2N1bWVudCA9IFBvbGljeURvY3VtZW50LmZyb21Kc29uKGNmbkJ1Y2tldFBvbGljeS5wb2xpY3lEb2N1bWVudCk7XG4gICAgfShjZm5CdWNrZXRQb2xpY3ksIGlkLCB7XG4gICAgICBidWNrZXQsXG4gICAgfSk7XG4gICAgLy8gbWFyayB0aGUgQnVja2V0IGFzIGhhdmluZyB0aGlzIFBvbGljeVxuICAgIGJ1Y2tldC5wb2xpY3kgPSByZXQ7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHBvbGljeSBkb2N1bWVudCBjb250YWluaW5nIHBlcm1pc3Npb25zIHRvIGFkZCB0byB0aGUgc3BlY2lmaWVkIGJ1Y2tldC5cbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBBY2Nlc3MgUG9saWN5IExhbmd1YWdlIE92ZXJ2aWV3IGluIHRoZSBBbWF6b25cbiAgICogU2ltcGxlIFN0b3JhZ2UgU2VydmljZSBEZXZlbG9wZXIgR3VpZGUuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZG9jdW1lbnQgPSBuZXcgUG9saWN5RG9jdW1lbnQoKTtcblxuICAvKiogVGhlIEJ1Y2tldCB0aGlzIFBvbGljeSBhcHBsaWVzIHRvLiAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0OiBJQnVja2V0O1xuXG4gIHByaXZhdGUgcmVzb3VyY2U6IENmbkJ1Y2tldFBvbGljeTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQnVja2V0UG9saWN5UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgdGhpcy5idWNrZXQgPSBwcm9wcy5idWNrZXQ7XG5cbiAgICB0aGlzLnJlc291cmNlID0gbmV3IENmbkJ1Y2tldFBvbGljeSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBidWNrZXQ6IHRoaXMuYnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICBwb2xpY3lEb2N1bWVudDogdGhpcy5kb2N1bWVudCxcbiAgICB9KTtcblxuICAgIGlmIChwcm9wcy5yZW1vdmFsUG9saWN5KSB7XG4gICAgICB0aGlzLnJlc291cmNlLmFwcGx5UmVtb3ZhbFBvbGljeShwcm9wcy5yZW1vdmFsUG9saWN5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcmVtb3ZhbCBwb2xpY3kgZm9yIHRoZSBCdWNrZXRQb2xpY3kuXG4gICAqIEBwYXJhbSByZW1vdmFsUG9saWN5IHRoZSBSZW1vdmFsUG9saWN5IHRvIHNldC5cbiAgICovXG4gIHB1YmxpYyBhcHBseVJlbW92YWxQb2xpY3kocmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeSkge1xuICAgIHRoaXMucmVzb3VyY2UuYXBwbHlSZW1vdmFsUG9saWN5KHJlbW92YWxQb2xpY3kpO1xuICB9XG59XG4iXX0=