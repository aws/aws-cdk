"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OriginRequestQueryStringBehavior = exports.OriginRequestHeaderBehavior = exports.OriginRequestCookieBehavior = exports.OriginRequestPolicy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const cloudfront_generated_1 = require("./cloudfront.generated");
/**
 * A Origin Request Policy configuration.
 *
 * @resource AWS::CloudFront::OriginRequestPolicy
 */
class OriginRequestPolicy extends core_1.Resource {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.originRequestPolicyName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_OriginRequestPolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, OriginRequestPolicy);
            }
            throw error;
        }
        const originRequestPolicyName = props.originRequestPolicyName ?? core_1.Names.uniqueId(this);
        if (!core_1.Token.isUnresolved(originRequestPolicyName) && !originRequestPolicyName.match(/^[\w-]+$/i)) {
            throw new Error(`'originRequestPolicyName' can only include '-', '_', and alphanumeric characters, got: '${props.originRequestPolicyName}'`);
        }
        const cookies = props.cookieBehavior ?? OriginRequestCookieBehavior.none();
        const headers = props.headerBehavior ?? OriginRequestHeaderBehavior.none();
        const queryStrings = props.queryStringBehavior ?? OriginRequestQueryStringBehavior.none();
        const resource = new cloudfront_generated_1.CfnOriginRequestPolicy(this, 'Resource', {
            originRequestPolicyConfig: {
                name: originRequestPolicyName,
                comment: props.comment,
                cookiesConfig: {
                    cookieBehavior: cookies.behavior,
                    cookies: cookies.cookies,
                },
                headersConfig: {
                    headerBehavior: headers.behavior,
                    headers: headers.headers,
                },
                queryStringsConfig: {
                    queryStringBehavior: queryStrings.behavior,
                    queryStrings: queryStrings.queryStrings,
                },
            },
        });
        this.originRequestPolicyId = resource.ref;
    }
    /** Imports a Origin Request Policy from its id. */
    static fromOriginRequestPolicyId(scope, id, originRequestPolicyId) {
        return new class extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.originRequestPolicyId = originRequestPolicyId;
            }
        }(scope, id);
    }
    /** Use an existing managed origin request policy. */
    static fromManagedOriginRequestPolicy(managedOriginRequestPolicyId) {
        return new class {
            constructor() {
                this.originRequestPolicyId = managedOriginRequestPolicyId;
            }
        }();
    }
}
exports.OriginRequestPolicy = OriginRequestPolicy;
_a = JSII_RTTI_SYMBOL_1;
OriginRequestPolicy[_a] = { fqn: "@aws-cdk/aws-cloudfront.OriginRequestPolicy", version: "0.0.0" };
/** This policy includes only the User-Agent and Referer headers. It doesn’t include any query strings or cookies. */
OriginRequestPolicy.USER_AGENT_REFERER_HEADERS = OriginRequestPolicy.fromManagedOriginRequestPolicy('acba4595-bd28-49b8-b9fe-13317c0390fa');
/** This policy includes the header that enables cross-origin resource sharing (CORS) requests when the origin is a custom origin. */
OriginRequestPolicy.CORS_CUSTOM_ORIGIN = OriginRequestPolicy.fromManagedOriginRequestPolicy('59781a5b-3903-41f3-afcb-af62929ccde1');
/** This policy includes the headers that enable cross-origin resource sharing (CORS) requests when the origin is an Amazon S3 bucket. */
OriginRequestPolicy.CORS_S3_ORIGIN = OriginRequestPolicy.fromManagedOriginRequestPolicy('88a5eaf4-2fd4-4709-b370-b4c650ea3fcf');
/** This policy includes all values (query strings, headers, and cookies) in the viewer request. */
OriginRequestPolicy.ALL_VIEWER = OriginRequestPolicy.fromManagedOriginRequestPolicy('216adef6-5c7f-47e4-b989-5492eafa07d3');
/** This policy is designed for use with an origin that is an AWS Elemental MediaTailor endpoint. */
OriginRequestPolicy.ELEMENTAL_MEDIA_TAILOR = OriginRequestPolicy.fromManagedOriginRequestPolicy('775133bc-15f2-49f9-abea-afb2e0bf67d2');
/** This policy includes all values (headers, cookies, and query strings) in the viewer request, and all CloudFront headers that were released through June 2022 (CloudFront headers released after June 2022 are not included). */
OriginRequestPolicy.ALL_VIEWER_AND_CLOUDFRONT_2022 = OriginRequestPolicy.fromManagedOriginRequestPolicy('33f36d7e-f396-46d9-90e0-52428a34d9dc');
/**
 * Determines whether any cookies in viewer requests (and if so, which cookies)
 * are included in requests that CloudFront sends to the origin.
 */
class OriginRequestCookieBehavior {
    constructor(behavior, cookies) {
        this.behavior = behavior;
        this.cookies = cookies;
    }
    /**
     * Cookies in viewer requests are not included in requests that CloudFront sends to the origin.
     * Any cookies that are listed in a CachePolicy are still included in origin requests.
     */
    static none() { return new OriginRequestCookieBehavior('none'); }
    /** All cookies in viewer requests are included in requests that CloudFront sends to the origin. */
    static all() { return new OriginRequestCookieBehavior('all'); }
    /** Only the provided `cookies` are included in requests that CloudFront sends to the origin. */
    static allowList(...cookies) {
        if (cookies.length === 0) {
            throw new Error('At least one cookie to allow must be provided');
        }
        return new OriginRequestCookieBehavior('whitelist', cookies);
    }
}
exports.OriginRequestCookieBehavior = OriginRequestCookieBehavior;
_b = JSII_RTTI_SYMBOL_1;
OriginRequestCookieBehavior[_b] = { fqn: "@aws-cdk/aws-cloudfront.OriginRequestCookieBehavior", version: "0.0.0" };
/**
 * Determines whether any HTTP headers (and if so, which headers) are included in requests that CloudFront sends to the origin.
 */
class OriginRequestHeaderBehavior {
    constructor(behavior, headers) {
        this.behavior = behavior;
        this.headers = headers;
    }
    /**
     * HTTP headers are not included in requests that CloudFront sends to the origin.
     * Any headers that are listed in a CachePolicy are still included in origin requests.
     */
    static none() { return new OriginRequestHeaderBehavior('none'); }
    /**
     * All HTTP headers in viewer requests are included in requests that CloudFront sends to the origin.
     * Additionally, any additional CloudFront headers provided are included; the additional headers are added by CloudFront.
     * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-cloudfront-headers.html
     */
    static all(...cloudfrontHeaders) {
        if (cloudfrontHeaders.length > 0) {
            if (!cloudfrontHeaders.every(header => header.startsWith('CloudFront-'))) {
                throw new Error('additional CloudFront headers passed to `OriginRequestHeaderBehavior.all()` must begin with \'CloudFront-\'');
            }
            return new OriginRequestHeaderBehavior('allViewerAndWhitelistCloudFront', cloudfrontHeaders);
        }
        else {
            return new OriginRequestHeaderBehavior('allViewer');
        }
    }
    /** Listed headers are included in requests that CloudFront sends to the origin. */
    static allowList(...headers) {
        if (headers.length === 0) {
            throw new Error('At least one header to allow must be provided');
        }
        if (headers.map(header => header.toLowerCase()).some(header => ['authorization', 'accept-encoding'].includes(header))) {
            throw new Error('you cannot pass `Authorization` or `Accept-Encoding` as header values; use a CachePolicy to forward these headers instead');
        }
        return new OriginRequestHeaderBehavior('whitelist', headers);
    }
}
exports.OriginRequestHeaderBehavior = OriginRequestHeaderBehavior;
_c = JSII_RTTI_SYMBOL_1;
OriginRequestHeaderBehavior[_c] = { fqn: "@aws-cdk/aws-cloudfront.OriginRequestHeaderBehavior", version: "0.0.0" };
/**
 * Determines whether any URL query strings in viewer requests (and if so, which query strings)
 * are included in requests that CloudFront sends to the origin.
 */
class OriginRequestQueryStringBehavior {
    constructor(behavior, queryStrings) {
        this.behavior = behavior;
        this.queryStrings = queryStrings;
    }
    /**
     * Query strings in viewer requests are not included in requests that CloudFront sends to the origin.
     * Any query strings that are listed in a CachePolicy are still included in origin requests.
     */
    static none() { return new OriginRequestQueryStringBehavior('none'); }
    /** All query strings in viewer requests are included in requests that CloudFront sends to the origin. */
    static all() { return new OriginRequestQueryStringBehavior('all'); }
    /** Only the provided `queryStrings` are included in requests that CloudFront sends to the origin. */
    static allowList(...queryStrings) {
        if (queryStrings.length === 0) {
            throw new Error('At least one query string to allow must be provided');
        }
        return new OriginRequestQueryStringBehavior('whitelist', queryStrings);
    }
}
exports.OriginRequestQueryStringBehavior = OriginRequestQueryStringBehavior;
_d = JSII_RTTI_SYMBOL_1;
OriginRequestQueryStringBehavior[_d] = { fqn: "@aws-cdk/aws-cloudfront.OriginRequestQueryStringBehavior", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JpZ2luLXJlcXVlc3QtcG9saWN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib3JpZ2luLXJlcXVlc3QtcG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF1RDtBQUV2RCxpRUFBZ0U7QUFpRGhFOzs7O0dBSUc7QUFDSCxNQUFhLG1CQUFvQixTQUFRLGVBQVE7SUErQi9DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBa0MsRUFBRTtRQUM1RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFlBQVksRUFBRSxLQUFLLENBQUMsdUJBQXVCO1NBQzVDLENBQUMsQ0FBQzs7Ozs7OytDQWxDTSxtQkFBbUI7Ozs7UUFvQzVCLE1BQU0sdUJBQXVCLEdBQUcsS0FBSyxDQUFDLHVCQUF1QixJQUFJLFlBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEYsSUFBSSxDQUFDLFlBQUssQ0FBQyxZQUFZLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUMvRixNQUFNLElBQUksS0FBSyxDQUFDLDJGQUEyRixLQUFLLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDO1NBQzlJO1FBRUQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGNBQWMsSUFBSSwyQkFBMkIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMzRSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsY0FBYyxJQUFJLDJCQUEyQixDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNFLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxtQkFBbUIsSUFBSSxnQ0FBZ0MsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUUxRixNQUFNLFFBQVEsR0FBRyxJQUFJLDZDQUFzQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDNUQseUJBQXlCLEVBQUU7Z0JBQ3pCLElBQUksRUFBRSx1QkFBdUI7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UUFBZ0IsRUFBRSxZQUF1QjtRQUMzRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztLQUNsQztJQXpCRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsSUFBSSxLQUFLLE9BQU8sSUFBSSxnQ0FBZ0MsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFO0lBRTdFLHlHQUF5RztJQUNsRyxNQUFNLENBQUMsR0FBRyxLQUFLLE9BQU8sSUFBSSxnQ0FBZ0MsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0lBRTNFLHFHQUFxRztJQUM5RixNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsWUFBc0I7UUFDL0MsSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLHFEQUFxRCxDQUFDLENBQUM7U0FDeEU7UUFDRCxPQUFPLElBQUksZ0NBQWdDLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0tBQ3hFOztBQWhCSCw0RUEyQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOYW1lcywgUmVzb3VyY2UsIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbk9yaWdpblJlcXVlc3RQb2xpY3kgfSBmcm9tICcuL2Nsb3VkZnJvbnQuZ2VuZXJhdGVkJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgT3JpZ2luIFJlcXVlc3QgUG9saWN5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSU9yaWdpblJlcXVlc3RQb2xpY3kge1xuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBvcmlnaW4gcmVxdWVzdCBwb2xpY3lcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgb3JpZ2luUmVxdWVzdFBvbGljeUlkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgY3JlYXRpbmcgYSBPcmlnaW4gUmVxdWVzdCBQb2xpY3lcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBPcmlnaW5SZXF1ZXN0UG9saWN5UHJvcHMge1xuICAvKipcbiAgICogQSB1bmlxdWUgbmFtZSB0byBpZGVudGlmeSB0aGUgb3JpZ2luIHJlcXVlc3QgcG9saWN5LlxuICAgKiBUaGUgbmFtZSBtdXN0IG9ubHkgaW5jbHVkZSAnLScsICdfJywgb3IgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMuXG4gICAqIEBkZWZhdWx0IC0gZ2VuZXJhdGVkIGZyb20gdGhlIGBpZGBcbiAgICovXG4gIHJlYWRvbmx5IG9yaWdpblJlcXVlc3RQb2xpY3lOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGNvbW1lbnQgdG8gZGVzY3JpYmUgdGhlIG9yaWdpbiByZXF1ZXN0IHBvbGljeS5cbiAgICogQGRlZmF1bHQgLSBubyBjb21tZW50XG4gICAqL1xuICByZWFkb25seSBjb21tZW50Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY29va2llcyBmcm9tIHZpZXdlciByZXF1ZXN0cyB0byBpbmNsdWRlIGluIG9yaWdpbiByZXF1ZXN0cy5cbiAgICogQGRlZmF1bHQgT3JpZ2luUmVxdWVzdENvb2tpZUJlaGF2aW9yLm5vbmUoKVxuICAgKi9cbiAgcmVhZG9ubHkgY29va2llQmVoYXZpb3I/OiBPcmlnaW5SZXF1ZXN0Q29va2llQmVoYXZpb3I7XG5cbiAgLyoqXG4gICAqIFRoZSBIVFRQIGhlYWRlcnMgdG8gaW5jbHVkZSBpbiBvcmlnaW4gcmVxdWVzdHMuIFRoZXNlIGNhbiBpbmNsdWRlIGhlYWRlcnMgZnJvbSB2aWV3ZXIgcmVxdWVzdHMgYW5kIGFkZGl0aW9uYWwgaGVhZGVycyBhZGRlZCBieSBDbG91ZEZyb250LlxuICAgKiBAZGVmYXVsdCBPcmlnaW5SZXF1ZXN0SGVhZGVyQmVoYXZpb3Iubm9uZSgpXG4gICAqL1xuICByZWFkb25seSBoZWFkZXJCZWhhdmlvcj86IE9yaWdpblJlcXVlc3RIZWFkZXJCZWhhdmlvcjtcblxuICAvKipcbiAgICogVGhlIFVSTCBxdWVyeSBzdHJpbmdzIGZyb20gdmlld2VyIHJlcXVlc3RzIHRvIGluY2x1ZGUgaW4gb3JpZ2luIHJlcXVlc3RzLlxuICAgKiBAZGVmYXVsdCBPcmlnaW5SZXF1ZXN0UXVlcnlTdHJpbmdCZWhhdmlvci5ub25lKClcbiAgICovXG4gIHJlYWRvbmx5IHF1ZXJ5U3RyaW5nQmVoYXZpb3I/OiBPcmlnaW5SZXF1ZXN0UXVlcnlTdHJpbmdCZWhhdmlvcjtcbn1cblxuLyoqXG4gKiBBIE9yaWdpbiBSZXF1ZXN0IFBvbGljeSBjb25maWd1cmF0aW9uLlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkNsb3VkRnJvbnQ6Ok9yaWdpblJlcXVlc3RQb2xpY3lcbiAqL1xuZXhwb3J0IGNsYXNzIE9yaWdpblJlcXVlc3RQb2xpY3kgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElPcmlnaW5SZXF1ZXN0UG9saWN5IHtcblxuICAvKiogVGhpcyBwb2xpY3kgaW5jbHVkZXMgb25seSB0aGUgVXNlci1BZ2VudCBhbmQgUmVmZXJlciBoZWFkZXJzLiBJdCBkb2VzbuKAmXQgaW5jbHVkZSBhbnkgcXVlcnkgc3RyaW5ncyBvciBjb29raWVzLiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFVTRVJfQUdFTlRfUkVGRVJFUl9IRUFERVJTID0gT3JpZ2luUmVxdWVzdFBvbGljeS5mcm9tTWFuYWdlZE9yaWdpblJlcXVlc3RQb2xpY3koJ2FjYmE0NTk1LWJkMjgtNDliOC1iOWZlLTEzMzE3YzAzOTBmYScpO1xuICAvKiogVGhpcyBwb2xpY3kgaW5jbHVkZXMgdGhlIGhlYWRlciB0aGF0IGVuYWJsZXMgY3Jvc3Mtb3JpZ2luIHJlc291cmNlIHNoYXJpbmcgKENPUlMpIHJlcXVlc3RzIHdoZW4gdGhlIG9yaWdpbiBpcyBhIGN1c3RvbSBvcmlnaW4uICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ09SU19DVVNUT01fT1JJR0lOID0gT3JpZ2luUmVxdWVzdFBvbGljeS5mcm9tTWFuYWdlZE9yaWdpblJlcXVlc3RQb2xpY3koJzU5NzgxYTViLTM5MDMtNDFmMy1hZmNiLWFmNjI5MjljY2RlMScpO1xuICAvKiogVGhpcyBwb2xpY3kgaW5jbHVkZXMgdGhlIGhlYWRlcnMgdGhhdCBlbmFibGUgY3Jvc3Mtb3JpZ2luIHJlc291cmNlIHNoYXJpbmcgKENPUlMpIHJlcXVlc3RzIHdoZW4gdGhlIG9yaWdpbiBpcyBhbiBBbWF6b24gUzMgYnVja2V0LiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENPUlNfUzNfT1JJR0lOID0gT3JpZ2luUmVxdWVzdFBvbGljeS5mcm9tTWFuYWdlZE9yaWdpblJlcXVlc3RQb2xpY3koJzg4YTVlYWY0LTJmZDQtNDcwOS1iMzcwLWI0YzY1MGVhM2ZjZicpO1xuICAvKiogVGhpcyBwb2xpY3kgaW5jbHVkZXMgYWxsIHZhbHVlcyAocXVlcnkgc3RyaW5ncywgaGVhZGVycywgYW5kIGNvb2tpZXMpIGluIHRoZSB2aWV3ZXIgcmVxdWVzdC4gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBTExfVklFV0VSID0gT3JpZ2luUmVxdWVzdFBvbGljeS5mcm9tTWFuYWdlZE9yaWdpblJlcXVlc3RQb2xpY3koJzIxNmFkZWY2LTVjN2YtNDdlNC1iOTg5LTU0OTJlYWZhMDdkMycpO1xuICAvKiogVGhpcyBwb2xpY3kgaXMgZGVzaWduZWQgZm9yIHVzZSB3aXRoIGFuIG9yaWdpbiB0aGF0IGlzIGFuIEFXUyBFbGVtZW50YWwgTWVkaWFUYWlsb3IgZW5kcG9pbnQuICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgRUxFTUVOVEFMX01FRElBX1RBSUxPUiA9IE9yaWdpblJlcXVlc3RQb2xpY3kuZnJvbU1hbmFnZWRPcmlnaW5SZXF1ZXN0UG9saWN5KCc3NzUxMzNiYy0xNWYyLTQ5ZjktYWJlYS1hZmIyZTBiZjY3ZDInKTtcbiAgLyoqIFRoaXMgcG9saWN5IGluY2x1ZGVzIGFsbCB2YWx1ZXMgKGhlYWRlcnMsIGNvb2tpZXMsIGFuZCBxdWVyeSBzdHJpbmdzKSBpbiB0aGUgdmlld2VyIHJlcXVlc3QsIGFuZCBhbGwgQ2xvdWRGcm9udCBoZWFkZXJzIHRoYXQgd2VyZSByZWxlYXNlZCB0aHJvdWdoIEp1bmUgMjAyMiAoQ2xvdWRGcm9udCBoZWFkZXJzIHJlbGVhc2VkIGFmdGVyIEp1bmUgMjAyMiBhcmUgbm90IGluY2x1ZGVkKS4gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBTExfVklFV0VSX0FORF9DTE9VREZST05UXzIwMjIgPSBPcmlnaW5SZXF1ZXN0UG9saWN5LmZyb21NYW5hZ2VkT3JpZ2luUmVxdWVzdFBvbGljeSgnMzNmMzZkN2UtZjM5Ni00NmQ5LTkwZTAtNTI0MjhhMzRkOWRjJyk7XG5cbiAgLyoqIEltcG9ydHMgYSBPcmlnaW4gUmVxdWVzdCBQb2xpY3kgZnJvbSBpdHMgaWQuICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbU9yaWdpblJlcXVlc3RQb2xpY3lJZChzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBvcmlnaW5SZXF1ZXN0UG9saWN5SWQ6IHN0cmluZyk6IElPcmlnaW5SZXF1ZXN0UG9saWN5IHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJT3JpZ2luUmVxdWVzdFBvbGljeSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgb3JpZ2luUmVxdWVzdFBvbGljeUlkID0gb3JpZ2luUmVxdWVzdFBvbGljeUlkO1xuICAgIH0oc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKiBVc2UgYW4gZXhpc3RpbmcgbWFuYWdlZCBvcmlnaW4gcmVxdWVzdCBwb2xpY3kuICovXG4gIHByaXZhdGUgc3RhdGljIGZyb21NYW5hZ2VkT3JpZ2luUmVxdWVzdFBvbGljeShtYW5hZ2VkT3JpZ2luUmVxdWVzdFBvbGljeUlkOiBzdHJpbmcpOiBJT3JpZ2luUmVxdWVzdFBvbGljeSB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBpbXBsZW1lbnRzIElPcmlnaW5SZXF1ZXN0UG9saWN5IHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBvcmlnaW5SZXF1ZXN0UG9saWN5SWQgPSBtYW5hZ2VkT3JpZ2luUmVxdWVzdFBvbGljeUlkO1xuICAgIH0oKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBvcmlnaW5SZXF1ZXN0UG9saWN5SWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogT3JpZ2luUmVxdWVzdFBvbGljeVByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMub3JpZ2luUmVxdWVzdFBvbGljeU5hbWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBvcmlnaW5SZXF1ZXN0UG9saWN5TmFtZSA9IHByb3BzLm9yaWdpblJlcXVlc3RQb2xpY3lOYW1lID8/IE5hbWVzLnVuaXF1ZUlkKHRoaXMpO1xuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKG9yaWdpblJlcXVlc3RQb2xpY3lOYW1lKSAmJiAhb3JpZ2luUmVxdWVzdFBvbGljeU5hbWUubWF0Y2goL15bXFx3LV0rJC9pKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAnb3JpZ2luUmVxdWVzdFBvbGljeU5hbWUnIGNhbiBvbmx5IGluY2x1ZGUgJy0nLCAnXycsIGFuZCBhbHBoYW51bWVyaWMgY2hhcmFjdGVycywgZ290OiAnJHtwcm9wcy5vcmlnaW5SZXF1ZXN0UG9saWN5TmFtZX0nYCk7XG4gICAgfVxuXG4gICAgY29uc3QgY29va2llcyA9IHByb3BzLmNvb2tpZUJlaGF2aW9yID8/IE9yaWdpblJlcXVlc3RDb29raWVCZWhhdmlvci5ub25lKCk7XG4gICAgY29uc3QgaGVhZGVycyA9IHByb3BzLmhlYWRlckJlaGF2aW9yID8/IE9yaWdpblJlcXVlc3RIZWFkZXJCZWhhdmlvci5ub25lKCk7XG4gICAgY29uc3QgcXVlcnlTdHJpbmdzID0gcHJvcHMucXVlcnlTdHJpbmdCZWhhdmlvciA/PyBPcmlnaW5SZXF1ZXN0UXVlcnlTdHJpbmdCZWhhdmlvci5ub25lKCk7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5PcmlnaW5SZXF1ZXN0UG9saWN5KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIG9yaWdpblJlcXVlc3RQb2xpY3lDb25maWc6IHtcbiAgICAgICAgbmFtZTogb3JpZ2luUmVxdWVzdFBvbGljeU5hbWUsXG4gICAgICAgIGNvbW1lbnQ6IHByb3BzLmNvbW1lbnQsXG4gICAgICAgIGNvb2tpZXNDb25maWc6IHtcbiAgICAgICAgICBjb29raWVCZWhhdmlvcjogY29va2llcy5iZWhhdmlvcixcbiAgICAgICAgICBjb29raWVzOiBjb29raWVzLmNvb2tpZXMsXG4gICAgICAgIH0sXG4gICAgICAgIGhlYWRlcnNDb25maWc6IHtcbiAgICAgICAgICBoZWFkZXJCZWhhdmlvcjogaGVhZGVycy5iZWhhdmlvcixcbiAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLmhlYWRlcnMsXG4gICAgICAgIH0sXG4gICAgICAgIHF1ZXJ5U3RyaW5nc0NvbmZpZzoge1xuICAgICAgICAgIHF1ZXJ5U3RyaW5nQmVoYXZpb3I6IHF1ZXJ5U3RyaW5ncy5iZWhhdmlvcixcbiAgICAgICAgICBxdWVyeVN0cmluZ3M6IHF1ZXJ5U3RyaW5ncy5xdWVyeVN0cmluZ3MsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5vcmlnaW5SZXF1ZXN0UG9saWN5SWQgPSByZXNvdXJjZS5yZWY7XG4gIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW55IGNvb2tpZXMgaW4gdmlld2VyIHJlcXVlc3RzIChhbmQgaWYgc28sIHdoaWNoIGNvb2tpZXMpXG4gKiBhcmUgaW5jbHVkZWQgaW4gcmVxdWVzdHMgdGhhdCBDbG91ZEZyb250IHNlbmRzIHRvIHRoZSBvcmlnaW4uXG4gKi9cbmV4cG9ydCBjbGFzcyBPcmlnaW5SZXF1ZXN0Q29va2llQmVoYXZpb3Ige1xuICAvKipcbiAgICogQ29va2llcyBpbiB2aWV3ZXIgcmVxdWVzdHMgYXJlIG5vdCBpbmNsdWRlZCBpbiByZXF1ZXN0cyB0aGF0IENsb3VkRnJvbnQgc2VuZHMgdG8gdGhlIG9yaWdpbi5cbiAgICogQW55IGNvb2tpZXMgdGhhdCBhcmUgbGlzdGVkIGluIGEgQ2FjaGVQb2xpY3kgYXJlIHN0aWxsIGluY2x1ZGVkIGluIG9yaWdpbiByZXF1ZXN0cy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbm9uZSgpIHsgcmV0dXJuIG5ldyBPcmlnaW5SZXF1ZXN0Q29va2llQmVoYXZpb3IoJ25vbmUnKTsgfVxuXG4gIC8qKiBBbGwgY29va2llcyBpbiB2aWV3ZXIgcmVxdWVzdHMgYXJlIGluY2x1ZGVkIGluIHJlcXVlc3RzIHRoYXQgQ2xvdWRGcm9udCBzZW5kcyB0byB0aGUgb3JpZ2luLiAqL1xuICBwdWJsaWMgc3RhdGljIGFsbCgpIHsgcmV0dXJuIG5ldyBPcmlnaW5SZXF1ZXN0Q29va2llQmVoYXZpb3IoJ2FsbCcpOyB9XG5cbiAgLyoqIE9ubHkgdGhlIHByb3ZpZGVkIGBjb29raWVzYCBhcmUgaW5jbHVkZWQgaW4gcmVxdWVzdHMgdGhhdCBDbG91ZEZyb250IHNlbmRzIHRvIHRoZSBvcmlnaW4uICovXG4gIHB1YmxpYyBzdGF0aWMgYWxsb3dMaXN0KC4uLmNvb2tpZXM6IHN0cmluZ1tdKSB7XG4gICAgaWYgKGNvb2tpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0IGxlYXN0IG9uZSBjb29raWUgdG8gYWxsb3cgbXVzdCBiZSBwcm92aWRlZCcpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE9yaWdpblJlcXVlc3RDb29raWVCZWhhdmlvcignd2hpdGVsaXN0JywgY29va2llcyk7XG4gIH1cblxuICAvKiogVGhlIGJlaGF2aW9yIG9mIGNvb2tpZXM6IGFsbG93IGFsbCwgbm9uZSBvciBhbiBhbGxvdyBsaXN0LiAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYmVoYXZpb3I6IHN0cmluZztcbiAgLyoqIFRoZSBjb29raWVzIHRvIGFsbG93LCBpZiB0aGUgYmVoYXZpb3IgaXMgYW4gYWxsb3cgbGlzdC4gKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvb2tpZXM/OiBzdHJpbmdbXTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKGJlaGF2aW9yOiBzdHJpbmcsIGNvb2tpZXM/OiBzdHJpbmdbXSkge1xuICAgIHRoaXMuYmVoYXZpb3IgPSBiZWhhdmlvcjtcbiAgICB0aGlzLmNvb2tpZXMgPSBjb29raWVzO1xuICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBIVFRQIGhlYWRlcnMgKGFuZCBpZiBzbywgd2hpY2ggaGVhZGVycykgYXJlIGluY2x1ZGVkIGluIHJlcXVlc3RzIHRoYXQgQ2xvdWRGcm9udCBzZW5kcyB0byB0aGUgb3JpZ2luLlxuICovXG5leHBvcnQgY2xhc3MgT3JpZ2luUmVxdWVzdEhlYWRlckJlaGF2aW9yIHtcbiAgLyoqXG4gICAqIEhUVFAgaGVhZGVycyBhcmUgbm90IGluY2x1ZGVkIGluIHJlcXVlc3RzIHRoYXQgQ2xvdWRGcm9udCBzZW5kcyB0byB0aGUgb3JpZ2luLlxuICAgKiBBbnkgaGVhZGVycyB0aGF0IGFyZSBsaXN0ZWQgaW4gYSBDYWNoZVBvbGljeSBhcmUgc3RpbGwgaW5jbHVkZWQgaW4gb3JpZ2luIHJlcXVlc3RzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBub25lKCkgeyByZXR1cm4gbmV3IE9yaWdpblJlcXVlc3RIZWFkZXJCZWhhdmlvcignbm9uZScpOyB9XG5cbiAgLyoqXG4gICAqIEFsbCBIVFRQIGhlYWRlcnMgaW4gdmlld2VyIHJlcXVlc3RzIGFyZSBpbmNsdWRlZCBpbiByZXF1ZXN0cyB0aGF0IENsb3VkRnJvbnQgc2VuZHMgdG8gdGhlIG9yaWdpbi5cbiAgICogQWRkaXRpb25hbGx5LCBhbnkgYWRkaXRpb25hbCBDbG91ZEZyb250IGhlYWRlcnMgcHJvdmlkZWQgYXJlIGluY2x1ZGVkOyB0aGUgYWRkaXRpb25hbCBoZWFkZXJzIGFyZSBhZGRlZCBieSBDbG91ZEZyb250LlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZEZyb250L2xhdGVzdC9EZXZlbG9wZXJHdWlkZS91c2luZy1jbG91ZGZyb250LWhlYWRlcnMuaHRtbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbGwoLi4uY2xvdWRmcm9udEhlYWRlcnM6IHN0cmluZ1tdKSB7XG4gICAgaWYgKGNsb3VkZnJvbnRIZWFkZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICghY2xvdWRmcm9udEhlYWRlcnMuZXZlcnkoaGVhZGVyID0+IGhlYWRlci5zdGFydHNXaXRoKCdDbG91ZEZyb250LScpKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FkZGl0aW9uYWwgQ2xvdWRGcm9udCBoZWFkZXJzIHBhc3NlZCB0byBgT3JpZ2luUmVxdWVzdEhlYWRlckJlaGF2aW9yLmFsbCgpYCBtdXN0IGJlZ2luIHdpdGggXFwnQ2xvdWRGcm9udC1cXCcnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgT3JpZ2luUmVxdWVzdEhlYWRlckJlaGF2aW9yKCdhbGxWaWV3ZXJBbmRXaGl0ZWxpc3RDbG91ZEZyb250JywgY2xvdWRmcm9udEhlYWRlcnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IE9yaWdpblJlcXVlc3RIZWFkZXJCZWhhdmlvcignYWxsVmlld2VyJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIExpc3RlZCBoZWFkZXJzIGFyZSBpbmNsdWRlZCBpbiByZXF1ZXN0cyB0aGF0IENsb3VkRnJvbnQgc2VuZHMgdG8gdGhlIG9yaWdpbi4gKi9cbiAgcHVibGljIHN0YXRpYyBhbGxvd0xpc3QoLi4uaGVhZGVyczogc3RyaW5nW10pIHtcbiAgICBpZiAoaGVhZGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3Qgb25lIGhlYWRlciB0byBhbGxvdyBtdXN0IGJlIHByb3ZpZGVkJyk7XG4gICAgfVxuICAgIGlmIChoZWFkZXJzLm1hcChoZWFkZXIgPT4gaGVhZGVyLnRvTG93ZXJDYXNlKCkpLnNvbWUoaGVhZGVyID0+IFsnYXV0aG9yaXphdGlvbicsICdhY2NlcHQtZW5jb2RpbmcnXS5pbmNsdWRlcyhoZWFkZXIpKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd5b3UgY2Fubm90IHBhc3MgYEF1dGhvcml6YXRpb25gIG9yIGBBY2NlcHQtRW5jb2RpbmdgIGFzIGhlYWRlciB2YWx1ZXM7IHVzZSBhIENhY2hlUG9saWN5IHRvIGZvcndhcmQgdGhlc2UgaGVhZGVycyBpbnN0ZWFkJyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgT3JpZ2luUmVxdWVzdEhlYWRlckJlaGF2aW9yKCd3aGl0ZWxpc3QnLCBoZWFkZXJzKTtcbiAgfVxuXG4gIC8qKiBUaGUgYmVoYXZpb3Igb2YgaGVhZGVyczogYWxsb3cgYWxsLCBub25lIG9yIGFuIGFsbG93IGxpc3QuICovXG4gIHB1YmxpYyByZWFkb25seSBiZWhhdmlvcjogc3RyaW5nO1xuICAvKiogVGhlIGhlYWRlcnMgZm9yIHRoZSBhbGxvdyBsaXN0IG9yIHRoZSBpbmNsdWRlZCBDbG91ZEZyb250IGhlYWRlcnMsIGlmIGFwcGxpY2FibGUuICovXG4gIHB1YmxpYyByZWFkb25seSBoZWFkZXJzPzogc3RyaW5nW107XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihiZWhhdmlvcjogc3RyaW5nLCBoZWFkZXJzPzogc3RyaW5nW10pIHtcbiAgICB0aGlzLmJlaGF2aW9yID0gYmVoYXZpb3I7XG4gICAgdGhpcy5oZWFkZXJzID0gaGVhZGVycztcbiAgfVxufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhbnkgVVJMIHF1ZXJ5IHN0cmluZ3MgaW4gdmlld2VyIHJlcXVlc3RzIChhbmQgaWYgc28sIHdoaWNoIHF1ZXJ5IHN0cmluZ3MpXG4gKiBhcmUgaW5jbHVkZWQgaW4gcmVxdWVzdHMgdGhhdCBDbG91ZEZyb250IHNlbmRzIHRvIHRoZSBvcmlnaW4uXG4gKi9cbmV4cG9ydCBjbGFzcyBPcmlnaW5SZXF1ZXN0UXVlcnlTdHJpbmdCZWhhdmlvciB7XG4gIC8qKlxuICAgKiBRdWVyeSBzdHJpbmdzIGluIHZpZXdlciByZXF1ZXN0cyBhcmUgbm90IGluY2x1ZGVkIGluIHJlcXVlc3RzIHRoYXQgQ2xvdWRGcm9udCBzZW5kcyB0byB0aGUgb3JpZ2luLlxuICAgKiBBbnkgcXVlcnkgc3RyaW5ncyB0aGF0IGFyZSBsaXN0ZWQgaW4gYSBDYWNoZVBvbGljeSBhcmUgc3RpbGwgaW5jbHVkZWQgaW4gb3JpZ2luIHJlcXVlc3RzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBub25lKCkgeyByZXR1cm4gbmV3IE9yaWdpblJlcXVlc3RRdWVyeVN0cmluZ0JlaGF2aW9yKCdub25lJyk7IH1cblxuICAvKiogQWxsIHF1ZXJ5IHN0cmluZ3MgaW4gdmlld2VyIHJlcXVlc3RzIGFyZSBpbmNsdWRlZCBpbiByZXF1ZXN0cyB0aGF0IENsb3VkRnJvbnQgc2VuZHMgdG8gdGhlIG9yaWdpbi4gKi9cbiAgcHVibGljIHN0YXRpYyBhbGwoKSB7IHJldHVybiBuZXcgT3JpZ2luUmVxdWVzdFF1ZXJ5U3RyaW5nQmVoYXZpb3IoJ2FsbCcpOyB9XG5cbiAgLyoqIE9ubHkgdGhlIHByb3ZpZGVkIGBxdWVyeVN0cmluZ3NgIGFyZSBpbmNsdWRlZCBpbiByZXF1ZXN0cyB0aGF0IENsb3VkRnJvbnQgc2VuZHMgdG8gdGhlIG9yaWdpbi4gKi9cbiAgcHVibGljIHN0YXRpYyBhbGxvd0xpc3QoLi4ucXVlcnlTdHJpbmdzOiBzdHJpbmdbXSkge1xuICAgIGlmIChxdWVyeVN0cmluZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0IGxlYXN0IG9uZSBxdWVyeSBzdHJpbmcgdG8gYWxsb3cgbXVzdCBiZSBwcm92aWRlZCcpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE9yaWdpblJlcXVlc3RRdWVyeVN0cmluZ0JlaGF2aW9yKCd3aGl0ZWxpc3QnLCBxdWVyeVN0cmluZ3MpO1xuICB9XG5cbiAgLyoqIFRoZSBiZWhhdmlvciBvZiBxdWVyeSBzdHJpbmdzIC0tIGFsbG93IGFsbCwgbm9uZSwgb3Igb25seSBhbiBhbGxvdyBsaXN0LiAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYmVoYXZpb3I6IHN0cmluZztcbiAgLyoqIFRoZSBxdWVyeSBzdHJpbmdzIHRvIGFsbG93LCBpZiB0aGUgYmVoYXZpb3IgaXMgYW4gYWxsb3cgbGlzdC4gKi9cbiAgcHVibGljIHJlYWRvbmx5IHF1ZXJ5U3RyaW5ncz86IHN0cmluZ1tdO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoYmVoYXZpb3I6IHN0cmluZywgcXVlcnlTdHJpbmdzPzogc3RyaW5nW10pIHtcbiAgICB0aGlzLmJlaGF2aW9yID0gYmVoYXZpb3I7XG4gICAgdGhpcy5xdWVyeVN0cmluZ3MgPSBxdWVyeVN0cmluZ3M7XG4gIH1cbn1cbiJdfQ==