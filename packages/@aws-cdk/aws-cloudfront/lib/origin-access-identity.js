"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OriginAccessIdentity = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const cloudfront_generated_1 = require("./cloudfront.generated");
class OriginAccessIdentityBase extends cdk.Resource {
    /**
     * The ARN to include in S3 bucket policy to allow CloudFront access
     */
    arn() {
        return cdk.Stack.of(this).formatArn({
            service: 'iam',
            region: '',
            account: 'cloudfront',
            resource: 'user',
            resourceName: `CloudFront Origin Access Identity ${this.originAccessIdentityId}`,
        });
    }
}
/**
 * An origin access identity is a special CloudFront user that you can
 * associate with Amazon S3 origins, so that you can secure all or just some of
 * your Amazon S3 content.
 *
 * @resource AWS::CloudFront::CloudFrontOriginAccessIdentity
 */
class OriginAccessIdentity extends OriginAccessIdentityBase {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_OriginAccessIdentityProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, OriginAccessIdentity);
            }
            throw error;
        }
        // Comment has a max length of 128.
        const comment = (props?.comment ?? 'Allows CloudFront to reach the bucket').slice(0, 128);
        this.resource = new cloudfront_generated_1.CfnCloudFrontOriginAccessIdentity(this, 'Resource', {
            cloudFrontOriginAccessIdentityConfig: { comment },
        });
        // physical id - OAI Id
        this.originAccessIdentityId = this.getResourceNameAttribute(this.resource.ref);
        // Canonical user to grant access to in the S3 Bucket Policy
        this.cloudFrontOriginAccessIdentityS3CanonicalUserId = this.resource.attrS3CanonicalUserId;
        // The principal for must be either the canonical user or a special ARN
        // with the CloudFront Origin Access Id (see `arn()` method). For
        // import/export the OAI is anyway required so the principal is constructed
        // with it. But for the normal case the S3 Canonical User as a nicer
        // interface and does not require constructing the ARN.
        this.grantPrincipal = new iam.CanonicalUserPrincipal(this.cloudFrontOriginAccessIdentityS3CanonicalUserId);
    }
    /**
     * Creates a OriginAccessIdentity by providing the OriginAccessIdentityId.
     * It is misnamed and superseded by the correctly named fromOriginAccessIdentityId.
     *
     * @deprecated use `fromOriginAccessIdentityId`
     */
    static fromOriginAccessIdentityName(scope, id, originAccessIdentityName) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-cloudfront.OriginAccessIdentity#fromOriginAccessIdentityName", "use `fromOriginAccessIdentityId`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromOriginAccessIdentityName);
            }
            throw error;
        }
        return OriginAccessIdentity.fromOriginAccessIdentityId(scope, id, originAccessIdentityName);
    }
    /**
     * Creates a OriginAccessIdentity by providing the OriginAccessIdentityId.
     */
    static fromOriginAccessIdentityId(scope, id, originAccessIdentityId) {
        class Import extends OriginAccessIdentityBase {
            constructor(s, i) {
                super(s, i, { physicalName: originAccessIdentityId });
                this.originAccessIdentityId = originAccessIdentityId;
                this.originAccessIdentityName = originAccessIdentityId;
                this.grantPrincipal = new iam.ArnPrincipal(this.arn());
            }
        }
        return new Import(scope, id);
    }
    /**
     * The Origin Access Identity Id (physical id)
     * It is misnamed and superseded by the correctly named originAccessIdentityId
     *
     * @attribute
     * @deprecated use originAccessIdentityId instead
     */
    get originAccessIdentityName() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-cloudfront.OriginAccessIdentity#originAccessIdentityName", "use originAccessIdentityId instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "originAccessIdentityName").get);
            }
            throw error;
        }
        return this.originAccessIdentityId;
    }
}
exports.OriginAccessIdentity = OriginAccessIdentity;
_a = JSII_RTTI_SYMBOL_1;
OriginAccessIdentity[_a] = { fqn: "@aws-cdk/aws-cloudfront.OriginAccessIdentity", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JpZ2luLWFjY2Vzcy1pZGVudGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9yaWdpbi1hY2Nlc3MtaWRlbnRpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUVyQyxpRUFBMkU7QUFpQzNFLE1BQWUsd0JBQXlCLFNBQVEsR0FBRyxDQUFDLFFBQVE7SUFvQjFEOztPQUVHO0lBQ08sR0FBRztRQUNYLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUNqQztZQUNFLE9BQU8sRUFBRSxLQUFLO1lBQ2QsTUFBTSxFQUFFLEVBQUU7WUFDVixPQUFPLEVBQUUsWUFBWTtZQUNyQixRQUFRLEVBQUUsTUFBTTtZQUNoQixZQUFZLEVBQUUscUNBQXFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtTQUNqRixDQUNGLENBQUM7S0FDSDtDQUNGO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBYSxvQkFBcUIsU0FBUSx3QkFBd0I7SUF3RWhFLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBaUM7UUFDekUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQXpFUixvQkFBb0I7Ozs7UUEyRTdCLG1DQUFtQztRQUNuQyxNQUFNLE9BQU8sR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLElBQUksdUNBQXVDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzFGLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSx3REFBaUMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3RFLG9DQUFvQyxFQUFFLEVBQUUsT0FBTyxFQUFFO1NBQ2xELENBQUMsQ0FBQztRQUNILHVCQUF1QjtRQUN2QixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFL0UsNERBQTREO1FBQzVELElBQUksQ0FBQywrQ0FBK0MsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDO1FBQzNGLHVFQUF1RTtRQUN2RSxpRUFBaUU7UUFDakUsMkVBQTJFO1FBQzNFLG9FQUFvRTtRQUNwRSx1REFBdUQ7UUFDdkQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsK0NBQStDLENBQUMsQ0FBQztLQUM1RztJQTFGRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyw0QkFBNEIsQ0FDeEMsS0FBZ0IsRUFDaEIsRUFBVSxFQUNWLHdCQUFnQzs7Ozs7Ozs7OztRQUNoQyxPQUFPLG9CQUFvQixDQUFDLDBCQUEwQixDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztLQUM3RjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLDBCQUEwQixDQUN0QyxLQUFnQixFQUNoQixFQUFVLEVBQ1Ysc0JBQThCO1FBRTlCLE1BQU0sTUFBTyxTQUFRLHdCQUF3QjtZQUkzQyxZQUFZLENBQVksRUFBRSxDQUFTO2dCQUNqQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLFlBQVksRUFBRSxzQkFBc0IsRUFBRSxDQUFDLENBQUM7Z0JBSnhDLDJCQUFzQixHQUFHLHNCQUFzQixDQUFDO2dCQUNoRCw2QkFBd0IsR0FBRyxzQkFBc0IsQ0FBQztnQkFDbEQsbUJBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFHbEUsQ0FBQztTQUNGO1FBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7SUFnQkQ7Ozs7OztPQU1HO0lBQ0gsSUFBVyx3QkFBd0I7Ozs7Ozs7Ozs7UUFDakMsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUM7S0FDcEM7O0FBekRILG9EQTRGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuQ2xvdWRGcm9udE9yaWdpbkFjY2Vzc0lkZW50aXR5IH0gZnJvbSAnLi9jbG91ZGZyb250LmdlbmVyYXRlZCc7XG5cbi8qKlxuICogUHJvcGVydGllcyBvZiBDbG91ZEZyb250IE9yaWdpbkFjY2Vzc0lkZW50aXR5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgT3JpZ2luQWNjZXNzSWRlbnRpdHlQcm9wcyB7XG4gIC8qKlxuICAgKiBBbnkgY29tbWVudHMgeW91IHdhbnQgdG8gaW5jbHVkZSBhYm91dCB0aGUgb3JpZ2luIGFjY2VzcyBpZGVudGl0eS5cbiAgICpcbiAgICogQGRlZmF1bHQgXCJBbGxvd3MgQ2xvdWRGcm9udCB0byByZWFjaCB0aGUgYnVja2V0XCJcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1lbnQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBDbG91ZEZyb250IE9yaWdpbkFjY2Vzc0lkZW50aXR5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSU9yaWdpbkFjY2Vzc0lkZW50aXR5IGV4dGVuZHMgY2RrLklSZXNvdXJjZSwgaWFtLklHcmFudGFibGUge1xuICAvKipcbiAgICogVGhlIE9yaWdpbiBBY2Nlc3MgSWRlbnRpdHkgSWQgKHBoeXNpY2FsIGlkKVxuICAgKiBJdCBpcyBtaXNuYW1lZCBhbmQgc3VwZXJzZWRlZCBieSB0aGUgY29ycmVjdGx5IG5hbWVkIG9yaWdpbkFjY2Vzc0lkZW50aXR5SWRcbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgdXNlIG9yaWdpbkFjY2Vzc0lkZW50aXR5SWQgaW5zdGVhZFxuICAgKi9cbiAgcmVhZG9ubHkgb3JpZ2luQWNjZXNzSWRlbnRpdHlOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBPcmlnaW4gQWNjZXNzIElkZW50aXR5IElkIChwaHlzaWNhbCBpZClcbiAgICogVGhpcyB3YXMgY2FsbGVkIG9yaWdpbkFjY2Vzc0lkZW50aXR5TmFtZSBiZWZvcmVcbiAgICovXG4gIHJlYWRvbmx5IG9yaWdpbkFjY2Vzc0lkZW50aXR5SWQ6IHN0cmluZztcbn1cblxuYWJzdHJhY3QgY2xhc3MgT3JpZ2luQWNjZXNzSWRlbnRpdHlCYXNlIGV4dGVuZHMgY2RrLlJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBPcmlnaW4gQWNjZXNzIElkZW50aXR5IElkIChwaHlzaWNhbCBpZClcbiAgICogSXQgaXMgbWlzbmFtZWQgYW5kIHN1cGVyc2VkZWQgYnkgdGhlIGNvcnJlY3RseSBuYW1lZCBvcmlnaW5BY2Nlc3NJZGVudGl0eUlkXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBvcmlnaW5BY2Nlc3NJZGVudGl0eUlkIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBvcmlnaW5BY2Nlc3NJZGVudGl0eU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIE9yaWdpbiBBY2Nlc3MgSWRlbnRpdHkgSWQgKHBoeXNpY2FsIGlkKVxuICAgKiBUaGlzIHdhcyBjYWxsZWQgb3JpZ2luQWNjZXNzSWRlbnRpdHlOYW1lIGJlZm9yZVxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IG9yaWdpbkFjY2Vzc0lkZW50aXR5SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogRGVyaXZlZCBwcmluY2lwYWwgdmFsdWUgZm9yIGJ1Y2tldCBhY2Nlc3NcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBncmFudFByaW5jaXBhbDogaWFtLklQcmluY2lwYWw7XG5cbiAgLyoqXG4gICAqIFRoZSBBUk4gdG8gaW5jbHVkZSBpbiBTMyBidWNrZXQgcG9saWN5IHRvIGFsbG93IENsb3VkRnJvbnQgYWNjZXNzXG4gICAqL1xuICBwcm90ZWN0ZWQgYXJuKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGNkay5TdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oXG4gICAgICB7XG4gICAgICAgIHNlcnZpY2U6ICdpYW0nLFxuICAgICAgICByZWdpb246ICcnLCAvLyBnbG9iYWxcbiAgICAgICAgYWNjb3VudDogJ2Nsb3VkZnJvbnQnLFxuICAgICAgICByZXNvdXJjZTogJ3VzZXInLFxuICAgICAgICByZXNvdXJjZU5hbWU6IGBDbG91ZEZyb250IE9yaWdpbiBBY2Nlc3MgSWRlbnRpdHkgJHt0aGlzLm9yaWdpbkFjY2Vzc0lkZW50aXR5SWR9YCxcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxufVxuXG4vKipcbiAqIEFuIG9yaWdpbiBhY2Nlc3MgaWRlbnRpdHkgaXMgYSBzcGVjaWFsIENsb3VkRnJvbnQgdXNlciB0aGF0IHlvdSBjYW5cbiAqIGFzc29jaWF0ZSB3aXRoIEFtYXpvbiBTMyBvcmlnaW5zLCBzbyB0aGF0IHlvdSBjYW4gc2VjdXJlIGFsbCBvciBqdXN0IHNvbWUgb2ZcbiAqIHlvdXIgQW1hem9uIFMzIGNvbnRlbnQuXG4gKlxuICogQHJlc291cmNlIEFXUzo6Q2xvdWRGcm9udDo6Q2xvdWRGcm9udE9yaWdpbkFjY2Vzc0lkZW50aXR5XG4gKi9cbmV4cG9ydCBjbGFzcyBPcmlnaW5BY2Nlc3NJZGVudGl0eSBleHRlbmRzIE9yaWdpbkFjY2Vzc0lkZW50aXR5QmFzZSBpbXBsZW1lbnRzIElPcmlnaW5BY2Nlc3NJZGVudGl0eSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgT3JpZ2luQWNjZXNzSWRlbnRpdHkgYnkgcHJvdmlkaW5nIHRoZSBPcmlnaW5BY2Nlc3NJZGVudGl0eUlkLlxuICAgKiBJdCBpcyBtaXNuYW1lZCBhbmQgc3VwZXJzZWRlZCBieSB0aGUgY29ycmVjdGx5IG5hbWVkIGZyb21PcmlnaW5BY2Nlc3NJZGVudGl0eUlkLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYGZyb21PcmlnaW5BY2Nlc3NJZGVudGl0eUlkYFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tT3JpZ2luQWNjZXNzSWRlbnRpdHlOYW1lKFxuICAgIHNjb3BlOiBDb25zdHJ1Y3QsXG4gICAgaWQ6IHN0cmluZyxcbiAgICBvcmlnaW5BY2Nlc3NJZGVudGl0eU5hbWU6IHN0cmluZyk6IElPcmlnaW5BY2Nlc3NJZGVudGl0eSB7XG4gICAgcmV0dXJuIE9yaWdpbkFjY2Vzc0lkZW50aXR5LmZyb21PcmlnaW5BY2Nlc3NJZGVudGl0eUlkKHNjb3BlLCBpZCwgb3JpZ2luQWNjZXNzSWRlbnRpdHlOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgT3JpZ2luQWNjZXNzSWRlbnRpdHkgYnkgcHJvdmlkaW5nIHRoZSBPcmlnaW5BY2Nlc3NJZGVudGl0eUlkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tT3JpZ2luQWNjZXNzSWRlbnRpdHlJZChcbiAgICBzY29wZTogQ29uc3RydWN0LFxuICAgIGlkOiBzdHJpbmcsXG4gICAgb3JpZ2luQWNjZXNzSWRlbnRpdHlJZDogc3RyaW5nKTogSU9yaWdpbkFjY2Vzc0lkZW50aXR5IHtcblxuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIE9yaWdpbkFjY2Vzc0lkZW50aXR5QmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgb3JpZ2luQWNjZXNzSWRlbnRpdHlJZCA9IG9yaWdpbkFjY2Vzc0lkZW50aXR5SWQ7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgb3JpZ2luQWNjZXNzSWRlbnRpdHlOYW1lID0gb3JpZ2luQWNjZXNzSWRlbnRpdHlJZDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBncmFudFByaW5jaXBhbCA9IG5ldyBpYW0uQXJuUHJpbmNpcGFsKHRoaXMuYXJuKCkpO1xuICAgICAgY29uc3RydWN0b3IoczogQ29uc3RydWN0LCBpOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIocywgaSwgeyBwaHlzaWNhbE5hbWU6IG9yaWdpbkFjY2Vzc0lkZW50aXR5SWQgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQW1hem9uIFMzIGNhbm9uaWNhbCB1c2VyIElEIGZvciB0aGUgb3JpZ2luIGFjY2VzcyBpZGVudGl0eSwgdXNlZCB3aGVuXG4gICAqIGdpdmluZyB0aGUgb3JpZ2luIGFjY2VzcyBpZGVudGl0eSByZWFkIHBlcm1pc3Npb24gdG8gYW4gb2JqZWN0IGluIEFtYXpvblxuICAgKiBTMy5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNsb3VkRnJvbnRPcmlnaW5BY2Nlc3NJZGVudGl0eVMzQ2Fub25pY2FsVXNlcklkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIERlcml2ZWQgcHJpbmNpcGFsIHZhbHVlIGZvciBidWNrZXQgYWNjZXNzXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IGlhbS5JUHJpbmNpcGFsO1xuXG4gIC8qKlxuICAgKiBUaGUgT3JpZ2luIEFjY2VzcyBJZGVudGl0eSBJZCAocGh5c2ljYWwgaWQpXG4gICAqIEl0IGlzIG1pc25hbWVkIGFuZCBzdXBlcnNlZGVkIGJ5IHRoZSBjb3JyZWN0bHkgbmFtZWQgb3JpZ2luQWNjZXNzSWRlbnRpdHlJZFxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqIEBkZXByZWNhdGVkIHVzZSBvcmlnaW5BY2Nlc3NJZGVudGl0eUlkIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBnZXQgb3JpZ2luQWNjZXNzSWRlbnRpdHlOYW1lKCkge1xuICAgIHJldHVybiB0aGlzLm9yaWdpbkFjY2Vzc0lkZW50aXR5SWQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIE9yaWdpbiBBY2Nlc3MgSWRlbnRpdHkgSWQgKHBoeXNpY2FsIGlkKVxuICAgKiBUaGlzIHdhcyBjYWxsZWQgb3JpZ2luQWNjZXNzSWRlbnRpdHlOYW1lIGJlZm9yZVxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgb3JpZ2luQWNjZXNzSWRlbnRpdHlJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDREsgTDEgcmVzb3VyY2VcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgcmVzb3VyY2U6IENmbkNsb3VkRnJvbnRPcmlnaW5BY2Nlc3NJZGVudGl0eTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IE9yaWdpbkFjY2Vzc0lkZW50aXR5UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gQ29tbWVudCBoYXMgYSBtYXggbGVuZ3RoIG9mIDEyOC5cbiAgICBjb25zdCBjb21tZW50ID0gKHByb3BzPy5jb21tZW50ID8/ICdBbGxvd3MgQ2xvdWRGcm9udCB0byByZWFjaCB0aGUgYnVja2V0Jykuc2xpY2UoMCwgMTI4KTtcbiAgICB0aGlzLnJlc291cmNlID0gbmV3IENmbkNsb3VkRnJvbnRPcmlnaW5BY2Nlc3NJZGVudGl0eSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBjbG91ZEZyb250T3JpZ2luQWNjZXNzSWRlbnRpdHlDb25maWc6IHsgY29tbWVudCB9LFxuICAgIH0pO1xuICAgIC8vIHBoeXNpY2FsIGlkIC0gT0FJIElkXG4gICAgdGhpcy5vcmlnaW5BY2Nlc3NJZGVudGl0eUlkID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUodGhpcy5yZXNvdXJjZS5yZWYpO1xuXG4gICAgLy8gQ2Fub25pY2FsIHVzZXIgdG8gZ3JhbnQgYWNjZXNzIHRvIGluIHRoZSBTMyBCdWNrZXQgUG9saWN5XG4gICAgdGhpcy5jbG91ZEZyb250T3JpZ2luQWNjZXNzSWRlbnRpdHlTM0Nhbm9uaWNhbFVzZXJJZCA9IHRoaXMucmVzb3VyY2UuYXR0clMzQ2Fub25pY2FsVXNlcklkO1xuICAgIC8vIFRoZSBwcmluY2lwYWwgZm9yIG11c3QgYmUgZWl0aGVyIHRoZSBjYW5vbmljYWwgdXNlciBvciBhIHNwZWNpYWwgQVJOXG4gICAgLy8gd2l0aCB0aGUgQ2xvdWRGcm9udCBPcmlnaW4gQWNjZXNzIElkIChzZWUgYGFybigpYCBtZXRob2QpLiBGb3JcbiAgICAvLyBpbXBvcnQvZXhwb3J0IHRoZSBPQUkgaXMgYW55d2F5IHJlcXVpcmVkIHNvIHRoZSBwcmluY2lwYWwgaXMgY29uc3RydWN0ZWRcbiAgICAvLyB3aXRoIGl0LiBCdXQgZm9yIHRoZSBub3JtYWwgY2FzZSB0aGUgUzMgQ2Fub25pY2FsIFVzZXIgYXMgYSBuaWNlclxuICAgIC8vIGludGVyZmFjZSBhbmQgZG9lcyBub3QgcmVxdWlyZSBjb25zdHJ1Y3RpbmcgdGhlIEFSTi5cbiAgICB0aGlzLmdyYW50UHJpbmNpcGFsID0gbmV3IGlhbS5DYW5vbmljYWxVc2VyUHJpbmNpcGFsKHRoaXMuY2xvdWRGcm9udE9yaWdpbkFjY2Vzc0lkZW50aXR5UzNDYW5vbmljYWxVc2VySWQpO1xuICB9XG59XG4iXX0=