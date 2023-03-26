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
    /**
     * Sets the removal policy for the BucketPolicy.
     * @param removalPolicy the RemovalPolicy to set.
     */
    applyRemovalPolicy(removalPolicy) {
        this.resource.applyRemovalPolicy(removalPolicy);
    }
}
exports.BucketPolicy = BucketPolicy;
_a = JSII_RTTI_SYMBOL_1;
BucketPolicy[_a] = { fqn: "@aws-cdk/aws-s3.BucketPolicy", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LXBvbGljeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1Y2tldC1wb2xpY3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOENBQWtEO0FBQ2xELHdDQUE2RTtBQUM3RSwyRUFBdUU7QUFFdkUscUNBQTJDO0FBQzNDLGlEQUE0RDtBQWdCNUQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILE1BQWEsWUFBYSxTQUFRLGVBQVE7SUFxRHhDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQWJuQjs7OztXQUlHO1FBQ2EsYUFBUSxHQUFHLElBQUksd0JBQWMsRUFBRSxDQUFDOzs7Ozs7K0NBOUNyQyxZQUFZOzs7O1FBd0RyQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFFM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLDhCQUFlLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNwRCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVO1lBQzlCLGNBQWMsRUFBRSxJQUFJLENBQUMsUUFBUTtTQUM5QixDQUFDLENBQUM7UUFFSCxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDdkQ7S0FDRjtJQWpFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxlQUFnQzs7Ozs7Ozs7OztRQUNoRSw0REFBNEQ7UUFDNUQsTUFBTSxFQUFFLEdBQUcsc0JBQXNCLENBQUM7UUFFbEMsdUVBQXVFO1FBQ3ZFLHFCQUFxQjtRQUNyQixzR0FBc0c7UUFDdEcsTUFBTSxRQUFRLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkQsSUFBSSxRQUFRLEVBQUU7WUFDWixPQUFxQixRQUFRLENBQUM7U0FDL0I7UUFFRCw0Q0FBNEM7UUFDNUMsSUFBSSxNQUEyQixDQUFDO1FBQ2hDLElBQUksWUFBSyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDOUMsTUFBTSxpQkFBaUIsR0FBRyxtQkFBWSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkUsSUFBSSxpQkFBaUIsWUFBWSw0QkFBWSxFQUFFO2dCQUM3QyxNQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7Z0JBQzVDLElBQUksVUFBVSxZQUFZLHdCQUFTLEVBQUU7b0JBQ25DLE1BQU0sR0FBRyxlQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUMzQzthQUNGO1NBQ0Y7UUFDRCxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsTUFBTSxHQUFHLGVBQU0sQ0FBQyxjQUFjLENBQUMsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMzRjtRQUVELE1BQU0sR0FBRyxHQUFHLElBQUksS0FBTSxTQUFRLFlBQVk7WUFBMUI7O2dCQUNFLGFBQVEsR0FBRyx3QkFBYyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDckYsQ0FBQztTQUFBLENBQUMsZUFBZSxFQUFFLEVBQUUsRUFBRTtZQUNyQixNQUFNO1NBQ1AsQ0FBQyxDQUFDO1FBQ0gsd0NBQXdDO1FBQ3hDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUE2QkQ7OztPQUdHO0lBQ0ksa0JBQWtCLENBQUMsYUFBNEI7UUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUNqRDs7QUExRUgsb0NBMkVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUG9saWN5RG9jdW1lbnQgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IFJlbW92YWxQb2xpY3ksIFJlc291cmNlLCBUb2tlbiwgVG9rZW5pemF0aW9uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDZm5SZWZlcmVuY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlL2xpYi9wcml2YXRlL2Nmbi1yZWZlcmVuY2UnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBCdWNrZXQsIElCdWNrZXQgfSBmcm9tICcuL2J1Y2tldCc7XG5pbXBvcnQgeyBDZm5CdWNrZXQsIENmbkJ1Y2tldFBvbGljeSB9IGZyb20gJy4vczMuZ2VuZXJhdGVkJztcblxuZXhwb3J0IGludGVyZmFjZSBCdWNrZXRQb2xpY3lQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgQW1hem9uIFMzIGJ1Y2tldCB0aGF0IHRoZSBwb2xpY3kgYXBwbGllcyB0by5cbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldDogSUJ1Y2tldDtcblxuICAvKipcbiAgICogUG9saWN5IHRvIGFwcGx5IHdoZW4gdGhlIHBvbGljeSBpcyByZW1vdmVkIGZyb20gdGhpcyBzdGFjay5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBSZW1vdmFsUG9saWN5LkRFU1RST1kuXG4gICAqL1xuICByZWFkb25seSByZW1vdmFsUG9saWN5PzogUmVtb3ZhbFBvbGljeTtcbn1cblxuLyoqXG4gKiBUaGUgYnVja2V0IHBvbGljeSBmb3IgYW4gQW1hem9uIFMzIGJ1Y2tldFxuICpcbiAqIFBvbGljaWVzIGRlZmluZSB0aGUgb3BlcmF0aW9ucyB0aGF0IGFyZSBhbGxvd2VkIG9uIHRoaXMgcmVzb3VyY2UuXG4gKlxuICogWW91IGFsbW9zdCBuZXZlciBuZWVkIHRvIGRlZmluZSB0aGlzIGNvbnN0cnVjdCBkaXJlY3RseS5cbiAqXG4gKiBBbGwgQVdTIHJlc291cmNlcyB0aGF0IHN1cHBvcnQgcmVzb3VyY2UgcG9saWNpZXMgaGF2ZSBhIG1ldGhvZCBjYWxsZWRcbiAqIGBhZGRUb1Jlc291cmNlUG9saWN5KClgLCB3aGljaCB3aWxsIGF1dG9tYXRpY2FsbHkgY3JlYXRlIGEgbmV3IHJlc291cmNlXG4gKiBwb2xpY3kgaWYgb25lIGRvZXNuJ3QgZXhpc3QgeWV0LCBvdGhlcndpc2UgaXQgd2lsbCBhZGQgdG8gdGhlIGV4aXN0aW5nXG4gKiBwb2xpY3kuXG4gKlxuICogUHJlZmVyIHRvIHVzZSBgYWRkVG9SZXNvdXJjZVBvbGljeSgpYCBpbnN0ZWFkLlxuICovXG5leHBvcnQgY2xhc3MgQnVja2V0UG9saWN5IGV4dGVuZHMgUmVzb3VyY2Uge1xuICAvKipcbiAgICogQ3JlYXRlIGEgbXV0YWJsZSBgQnVja2V0UG9saWN5YCBmcm9tIGEgYENmbkJ1Y2tldFBvbGljeWAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21DZm5CdWNrZXRQb2xpY3koY2ZuQnVja2V0UG9saWN5OiBDZm5CdWNrZXRQb2xpY3kpOiBCdWNrZXRQb2xpY3kge1xuICAgIC8vIHVzZSBhIFwid2VpcmRcIiBpZCB0aGF0IGhhcyBhIGhpZ2hlciBjaGFuY2Ugb2YgYmVpbmcgdW5pcXVlXG4gICAgY29uc3QgaWQgPSAnQEZyb21DZm5CdWNrZXRQb2xpY3knO1xuXG4gICAgLy8gaWYgZnJvbUNmbkJ1Y2tldFBvbGljeSgpIHdhcyBhbHJlYWR5IGNhbGxlZCBvbiB0aGlzIENmbkJ1Y2tldFBvbGljeSxcbiAgICAvLyByZXR1cm4gdGhlIHNhbWUgTDJcbiAgICAvLyAoYXMgZGlmZmVyZW50IEwycyB3b3VsZCBjb25mbGljdCwgYmVjYXVzZSBvZiB0aGUgbXV0YXRpb24gb2YgdGhlIGRvY3VtZW50IHByb3BlcnR5IG9mIHRoZSBMMSBiZWxvdylcbiAgICBjb25zdCBleGlzdGluZyA9IGNmbkJ1Y2tldFBvbGljeS5ub2RlLnRyeUZpbmRDaGlsZChpZCk7XG4gICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICByZXR1cm4gPEJ1Y2tldFBvbGljeT5leGlzdGluZztcbiAgICB9XG5cbiAgICAvLyByZXNvbHZlIHRoZSBCdWNrZXQgdGhpcyBQb2xpY3kgcmVmZXJlbmNlc1xuICAgIGxldCBidWNrZXQ6IElCdWNrZXQgfCB1bmRlZmluZWQ7XG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChjZm5CdWNrZXRQb2xpY3kuYnVja2V0KSkge1xuICAgICAgY29uc3QgYnVja2V0SVJlc29sdmFibGUgPSBUb2tlbml6YXRpb24ucmV2ZXJzZShjZm5CdWNrZXRQb2xpY3kuYnVja2V0KTtcbiAgICAgIGlmIChidWNrZXRJUmVzb2x2YWJsZSBpbnN0YW5jZW9mIENmblJlZmVyZW5jZSkge1xuICAgICAgICBjb25zdCBjZm5FbGVtZW50ID0gYnVja2V0SVJlc29sdmFibGUudGFyZ2V0O1xuICAgICAgICBpZiAoY2ZuRWxlbWVudCBpbnN0YW5jZW9mIENmbkJ1Y2tldCkge1xuICAgICAgICAgIGJ1Y2tldCA9IEJ1Y2tldC5mcm9tQ2ZuQnVja2V0KGNmbkVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghYnVja2V0KSB7XG4gICAgICBidWNrZXQgPSBCdWNrZXQuZnJvbUJ1Y2tldE5hbWUoY2ZuQnVja2V0UG9saWN5LCAnQEZyb21DZm5CdWNrZXQnLCBjZm5CdWNrZXRQb2xpY3kuYnVja2V0KTtcbiAgICB9XG5cbiAgICBjb25zdCByZXQgPSBuZXcgY2xhc3MgZXh0ZW5kcyBCdWNrZXRQb2xpY3kge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGRvY3VtZW50ID0gUG9saWN5RG9jdW1lbnQuZnJvbUpzb24oY2ZuQnVja2V0UG9saWN5LnBvbGljeURvY3VtZW50KTtcbiAgICB9KGNmbkJ1Y2tldFBvbGljeSwgaWQsIHtcbiAgICAgIGJ1Y2tldCxcbiAgICB9KTtcbiAgICAvLyBtYXJrIHRoZSBCdWNrZXQgYXMgaGF2aW5nIHRoaXMgUG9saWN5XG4gICAgYnVja2V0LnBvbGljeSA9IHJldDtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEEgcG9saWN5IGRvY3VtZW50IGNvbnRhaW5pbmcgcGVybWlzc2lvbnMgdG8gYWRkIHRvIHRoZSBzcGVjaWZpZWQgYnVja2V0LlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIEFjY2VzcyBQb2xpY3kgTGFuZ3VhZ2UgT3ZlcnZpZXcgaW4gdGhlIEFtYXpvblxuICAgKiBTaW1wbGUgU3RvcmFnZSBTZXJ2aWNlIERldmVsb3BlciBHdWlkZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkb2N1bWVudCA9IG5ldyBQb2xpY3lEb2N1bWVudCgpO1xuXG4gIC8qKiBUaGUgQnVja2V0IHRoaXMgUG9saWN5IGFwcGxpZXMgdG8uICovXG4gIHB1YmxpYyByZWFkb25seSBidWNrZXQ6IElCdWNrZXQ7XG5cbiAgcHJpdmF0ZSByZXNvdXJjZTogQ2ZuQnVja2V0UG9saWN5O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBCdWNrZXRQb2xpY3lQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLmJ1Y2tldCA9IHByb3BzLmJ1Y2tldDtcblxuICAgIHRoaXMucmVzb3VyY2UgPSBuZXcgQ2ZuQnVja2V0UG9saWN5KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGJ1Y2tldDogdGhpcy5idWNrZXQuYnVja2V0TmFtZSxcbiAgICAgIHBvbGljeURvY3VtZW50OiB0aGlzLmRvY3VtZW50LFxuICAgIH0pO1xuXG4gICAgaWYgKHByb3BzLnJlbW92YWxQb2xpY3kpIHtcbiAgICAgIHRoaXMucmVzb3VyY2UuYXBwbHlSZW1vdmFsUG9saWN5KHByb3BzLnJlbW92YWxQb2xpY3kpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSByZW1vdmFsIHBvbGljeSBmb3IgdGhlIEJ1Y2tldFBvbGljeS5cbiAgICogQHBhcmFtIHJlbW92YWxQb2xpY3kgdGhlIFJlbW92YWxQb2xpY3kgdG8gc2V0LlxuICAgKi9cbiAgcHVibGljIGFwcGx5UmVtb3ZhbFBvbGljeShyZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5KSB7XG4gICAgdGhpcy5yZXNvdXJjZS5hcHBseVJlbW92YWxQb2xpY3kocmVtb3ZhbFBvbGljeSk7XG4gIH1cbn1cbiJdfQ==