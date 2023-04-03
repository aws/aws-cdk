"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheQueryStringBehavior = exports.CacheHeaderBehavior = exports.CacheCookieBehavior = exports.CachePolicy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const cloudfront_generated_1 = require("./cloudfront.generated");
/**
 * A Cache Policy configuration.
 *
 * @resource AWS::CloudFront::CachePolicy
 * @link https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html
 */
class CachePolicy extends core_1.Resource {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.cachePolicyName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_CachePolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CachePolicy);
            }
            throw error;
        }
        const cachePolicyName = props.cachePolicyName ?? `${core_1.Names.uniqueId(this).slice(0, 110)}-${core_1.Stack.of(this).region}`;
        if (!core_1.Token.isUnresolved(cachePolicyName) && !cachePolicyName.match(/^[\w-]+$/i)) {
            throw new Error(`'cachePolicyName' can only include '-', '_', and alphanumeric characters, got: '${cachePolicyName}'`);
        }
        if (cachePolicyName.length > 128) {
            throw new Error(`'cachePolicyName' cannot be longer than 128 characters, got: '${cachePolicyName.length}'`);
        }
        const minTtl = (props.minTtl ?? core_1.Duration.seconds(0)).toSeconds();
        const defaultTtl = Math.max((props.defaultTtl ?? core_1.Duration.days(1)).toSeconds(), minTtl);
        const maxTtl = Math.max((props.maxTtl ?? core_1.Duration.days(365)).toSeconds(), defaultTtl);
        const resource = new cloudfront_generated_1.CfnCachePolicy(this, 'Resource', {
            cachePolicyConfig: {
                name: cachePolicyName,
                comment: props.comment,
                minTtl,
                maxTtl,
                defaultTtl,
                parametersInCacheKeyAndForwardedToOrigin: this.renderCacheKey(props),
            },
        });
        this.cachePolicyId = resource.ref;
    }
    /** Imports a Cache Policy from its id. */
    static fromCachePolicyId(scope, id, cachePolicyId) {
        return new class extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.cachePolicyId = cachePolicyId;
            }
        }(scope, id);
    }
    /** Use an existing managed cache policy. */
    static fromManagedCachePolicy(managedCachePolicyId) {
        return new class {
            constructor() {
                this.cachePolicyId = managedCachePolicyId;
            }
        }();
    }
    renderCacheKey(props) {
        const cookies = props.cookieBehavior ?? CacheCookieBehavior.none();
        const headers = props.headerBehavior ?? CacheHeaderBehavior.none();
        const queryStrings = props.queryStringBehavior ?? CacheQueryStringBehavior.none();
        return {
            cookiesConfig: {
                cookieBehavior: cookies.behavior,
                cookies: cookies.cookies,
            },
            headersConfig: {
                headerBehavior: headers.behavior,
                headers: headers.headers,
            },
            enableAcceptEncodingGzip: props.enableAcceptEncodingGzip ?? false,
            enableAcceptEncodingBrotli: props.enableAcceptEncodingBrotli ?? false,
            queryStringsConfig: {
                queryStringBehavior: queryStrings.behavior,
                queryStrings: queryStrings.queryStrings,
            },
        };
    }
}
exports.CachePolicy = CachePolicy;
_a = JSII_RTTI_SYMBOL_1;
CachePolicy[_a] = { fqn: "@aws-cdk/aws-cloudfront.CachePolicy", version: "0.0.0" };
/**
 * This policy is designed for use with an origin that is an AWS Amplify web app.
 */
CachePolicy.AMPLIFY = CachePolicy.fromManagedCachePolicy('2e54312d-136d-493c-8eb9-b001f22f67d2');
/**
 * Optimize cache efficiency by minimizing the values that CloudFront includes in the cache key.
 * Query strings and cookies are not included in the cache key, and only the normalized 'Accept-Encoding' header is included.
 */
CachePolicy.CACHING_OPTIMIZED = CachePolicy.fromManagedCachePolicy('658327ea-f89d-4fab-a63d-7e88639e58f6');
/**
 * Optimize cache efficiency by minimizing the values that CloudFront includes in the cache key.
 * Query strings and cookies are not included in the cache key, and only the normalized 'Accept-Encoding' header is included.
 * Disables cache compression.
 */
CachePolicy.CACHING_OPTIMIZED_FOR_UNCOMPRESSED_OBJECTS = CachePolicy.fromManagedCachePolicy('b2884449-e4de-46a7-ac36-70bc7f1ddd6d');
/** Disables caching. This policy is useful for dynamic content and for requests that are not cacheable. */
CachePolicy.CACHING_DISABLED = CachePolicy.fromManagedCachePolicy('4135ea2d-6df8-44a3-9df3-4b5a84be39ad');
/** Designed for use with an origin that is an AWS Elemental MediaPackage endpoint. */
CachePolicy.ELEMENTAL_MEDIA_PACKAGE = CachePolicy.fromManagedCachePolicy('08627262-05a9-4f76-9ded-b50ca2e3a84f');
/**
 * Determines whether any cookies in viewer requests are included in the cache key and
 * automatically included in requests that CloudFront sends to the origin.
 */
class CacheCookieBehavior {
    constructor(behavior, cookies) {
        this.behavior = behavior;
        this.cookies = cookies;
    }
    /**
     * Cookies in viewer requests are not included in the cache key and
     * are not automatically included in requests that CloudFront sends to the origin.
     */
    static none() { return new CacheCookieBehavior('none'); }
    /**
     * All cookies in viewer requests are included in the cache key and are automatically included in requests that CloudFront sends to the origin.
     */
    static all() { return new CacheCookieBehavior('all'); }
    /**
     * Only the provided `cookies` are included in the cache key and automatically included in requests that CloudFront sends to the origin.
     */
    static allowList(...cookies) {
        if (cookies.length === 0) {
            throw new Error('At least one cookie to allow must be provided');
        }
        return new CacheCookieBehavior('whitelist', cookies);
    }
    /**
     * All cookies except the provided `cookies` are included in the cache key and
     * automatically included in requests that CloudFront sends to the origin.
     */
    static denyList(...cookies) {
        if (cookies.length === 0) {
            throw new Error('At least one cookie to deny must be provided');
        }
        return new CacheCookieBehavior('allExcept', cookies);
    }
}
exports.CacheCookieBehavior = CacheCookieBehavior;
_b = JSII_RTTI_SYMBOL_1;
CacheCookieBehavior[_b] = { fqn: "@aws-cdk/aws-cloudfront.CacheCookieBehavior", version: "0.0.0" };
/**
 * Determines whether any HTTP headers are included in the cache key and automatically included in requests that CloudFront sends to the origin.
 */
class CacheHeaderBehavior {
    constructor(behavior, headers) {
        this.behavior = behavior;
        this.headers = headers;
    }
    /** HTTP headers are not included in the cache key and are not automatically included in requests that CloudFront sends to the origin. */
    static none() { return new CacheHeaderBehavior('none'); }
    /** Listed headers are included in the cache key and are automatically included in requests that CloudFront sends to the origin. */
    static allowList(...headers) {
        if (headers.length === 0) {
            throw new Error('At least one header to allow must be provided');
        }
        return new CacheHeaderBehavior('whitelist', headers);
    }
}
exports.CacheHeaderBehavior = CacheHeaderBehavior;
_c = JSII_RTTI_SYMBOL_1;
CacheHeaderBehavior[_c] = { fqn: "@aws-cdk/aws-cloudfront.CacheHeaderBehavior", version: "0.0.0" };
/**
 * Determines whether any URL query strings in viewer requests are included in the cache key
 * and automatically included in requests that CloudFront sends to the origin.
 */
class CacheQueryStringBehavior {
    constructor(behavior, queryStrings) {
        this.behavior = behavior;
        this.queryStrings = queryStrings;
    }
    /**
     * Query strings in viewer requests are not included in the cache key and
     * are not automatically included in requests that CloudFront sends to the origin.
     */
    static none() { return new CacheQueryStringBehavior('none'); }
    /**
     * All query strings in viewer requests are included in the cache key and are automatically included in requests that CloudFront sends to the origin.
     */
    static all() { return new CacheQueryStringBehavior('all'); }
    /**
     * Only the provided `queryStrings` are included in the cache key and automatically included in requests that CloudFront sends to the origin.
     */
    static allowList(...queryStrings) {
        if (queryStrings.length === 0) {
            throw new Error('At least one query string to allow must be provided');
        }
        return new CacheQueryStringBehavior('whitelist', queryStrings);
    }
    /**
     * All query strings except the provided `queryStrings` are included in the cache key and
     * automatically included in requests that CloudFront sends to the origin.
     */
    static denyList(...queryStrings) {
        if (queryStrings.length === 0) {
            throw new Error('At least one query string to deny must be provided');
        }
        return new CacheQueryStringBehavior('allExcept', queryStrings);
    }
}
exports.CacheQueryStringBehavior = CacheQueryStringBehavior;
_d = JSII_RTTI_SYMBOL_1;
CacheQueryStringBehavior[_d] = { fqn: "@aws-cdk/aws-cloudfront.CacheQueryStringBehavior", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUtcG9saWN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2FjaGUtcG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3RTtBQUV4RSxpRUFBd0Q7QUFpRnhEOzs7OztHQUtHO0FBQ0gsTUFBYSxXQUFZLFNBQVEsZUFBUTtJQXFDdkMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUEwQixFQUFFO1FBQ3BFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxlQUFlO1NBQ3BDLENBQUMsQ0FBQzs7Ozs7OytDQXhDTSxXQUFXOzs7O1FBMENwQixNQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsZUFBZSxJQUFJLEdBQUcsWUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFbEgsSUFBSSxDQUFDLFlBQUssQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQy9FLE1BQU0sSUFBSSxLQUFLLENBQUMsbUZBQW1GLGVBQWUsR0FBRyxDQUFDLENBQUM7U0FDeEg7UUFFRCxJQUFJLGVBQWUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO1lBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQUMsaUVBQWlFLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQzdHO1FBRUQsTUFBTSxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLGVBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FB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QztLQUNoRTs7QUEvQkgsNERBMENDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHVyYXRpb24sIE5hbWVzLCBSZXNvdXJjZSwgU3RhY2ssIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkNhY2hlUG9saWN5IH0gZnJvbSAnLi9jbG91ZGZyb250LmdlbmVyYXRlZCc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIENhY2hlIFBvbGljeVxuICovXG5leHBvcnQgaW50ZXJmYWNlIElDYWNoZVBvbGljeSB7XG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhlIGNhY2hlIHBvbGljeVxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBjYWNoZVBvbGljeUlkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgY3JlYXRpbmcgYSBDYWNoZSBQb2xpY3lcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDYWNoZVBvbGljeVByb3BzIHtcbiAgLyoqXG4gICAqIEEgdW5pcXVlIG5hbWUgdG8gaWRlbnRpZnkgdGhlIGNhY2hlIHBvbGljeS5cbiAgICogVGhlIG5hbWUgbXVzdCBvbmx5IGluY2x1ZGUgJy0nLCAnXycsIG9yIGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzLlxuICAgKiBAZGVmYXVsdCAtIGdlbmVyYXRlZCBmcm9tIHRoZSBgaWRgXG4gICAqL1xuICByZWFkb25seSBjYWNoZVBvbGljeU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgY29tbWVudCB0byBkZXNjcmliZSB0aGUgY2FjaGUgcG9saWN5LlxuICAgKiBAZGVmYXVsdCAtIG5vIGNvbW1lbnRcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1lbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IGFtb3VudCBvZiB0aW1lIGZvciBvYmplY3RzIHRvIHN0YXkgaW4gdGhlIENsb3VkRnJvbnQgY2FjaGUuXG4gICAqIE9ubHkgdXNlZCB3aGVuIHRoZSBvcmlnaW4gZG9lcyBub3Qgc2VuZCBDYWNoZS1Db250cm9sIG9yIEV4cGlyZXMgaGVhZGVycyB3aXRoIHRoZSBvYmplY3QuXG4gICAqIEBkZWZhdWx0IC0gVGhlIGdyZWF0ZXIgb2YgMSBkYXkgYW5kIGBgbWluVHRsYGBcbiAgICovXG4gIHJlYWRvbmx5IGRlZmF1bHRUdGw/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIG1pbmltdW0gYW1vdW50IG9mIHRpbWUgZm9yIG9iamVjdHMgdG8gc3RheSBpbiB0aGUgQ2xvdWRGcm9udCBjYWNoZS5cbiAgICogQGRlZmF1bHQgRHVyYXRpb24uc2Vjb25kcygwKVxuICAgKi9cbiAgcmVhZG9ubHkgbWluVHRsPzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIGFtb3VudCBvZiB0aW1lIGZvciBvYmplY3RzIHRvIHN0YXkgaW4gdGhlIENsb3VkRnJvbnQgY2FjaGUuXG4gICAqIENsb3VkRnJvbnQgdXNlcyB0aGlzIHZhbHVlIG9ubHkgd2hlbiB0aGUgb3JpZ2luIHNlbmRzIENhY2hlLUNvbnRyb2wgb3IgRXhwaXJlcyBoZWFkZXJzIHdpdGggdGhlIG9iamVjdC5cbiAgICogQGRlZmF1bHQgLSBUaGUgZ3JlYXRlciBvZiAxIHllYXIgYW5kIGBgZGVmYXVsdFR0bGBgXG4gICAqL1xuICByZWFkb25seSBtYXhUdGw/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBjb29raWVzIGluIHZpZXdlciByZXF1ZXN0cyBhcmUgaW5jbHVkZWQgaW4gdGhlIGNhY2hlIGtleSBhbmQgYXV0b21hdGljYWxseSBpbmNsdWRlZCBpbiByZXF1ZXN0cyB0aGF0IENsb3VkRnJvbnQgc2VuZHMgdG8gdGhlIG9yaWdpbi5cbiAgICogQGRlZmF1bHQgQ2FjaGVDb29raWVCZWhhdmlvci5ub25lKClcbiAgICovXG4gIHJlYWRvbmx5IGNvb2tpZUJlaGF2aW9yPzogQ2FjaGVDb29raWVCZWhhdmlvcjtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBIVFRQIGhlYWRlcnMgYXJlIGluY2x1ZGVkIGluIHRoZSBjYWNoZSBrZXkgYW5kIGF1dG9tYXRpY2FsbHkgaW5jbHVkZWQgaW4gcmVxdWVzdHMgdGhhdCBDbG91ZEZyb250IHNlbmRzIHRvIHRoZSBvcmlnaW4uXG4gICAqIEBkZWZhdWx0IENhY2hlSGVhZGVyQmVoYXZpb3Iubm9uZSgpXG4gICAqL1xuICByZWFkb25seSBoZWFkZXJCZWhhdmlvcj86IENhY2hlSGVhZGVyQmVoYXZpb3I7XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hldGhlciBhbnkgcXVlcnkgc3RyaW5ncyBhcmUgaW5jbHVkZWQgaW4gdGhlIGNhY2hlIGtleSBhbmQgYXV0b21hdGljYWxseSBpbmNsdWRlZCBpbiByZXF1ZXN0cyB0aGF0IENsb3VkRnJvbnQgc2VuZHMgdG8gdGhlIG9yaWdpbi5cbiAgICogQGRlZmF1bHQgQ2FjaGVRdWVyeVN0cmluZ0JlaGF2aW9yLm5vbmUoKVxuICAgKi9cbiAgcmVhZG9ubHkgcXVlcnlTdHJpbmdCZWhhdmlvcj86IENhY2hlUXVlcnlTdHJpbmdCZWhhdmlvcjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBub3JtYWxpemUgYW5kIGluY2x1ZGUgdGhlIGBBY2NlcHQtRW5jb2RpbmdgIGhlYWRlciBpbiB0aGUgY2FjaGUga2V5IHdoZW4gdGhlIGBBY2NlcHQtRW5jb2RpbmdgIGhlYWRlciBpcyAnZ3ppcCcuXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBlbmFibGVBY2NlcHRFbmNvZGluZ0d6aXA/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIG5vcm1hbGl6ZSBhbmQgaW5jbHVkZSB0aGUgYEFjY2VwdC1FbmNvZGluZ2AgaGVhZGVyIGluIHRoZSBjYWNoZSBrZXkgd2hlbiB0aGUgYEFjY2VwdC1FbmNvZGluZ2AgaGVhZGVyIGlzICdicicuXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBlbmFibGVBY2NlcHRFbmNvZGluZ0Jyb3RsaT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBDYWNoZSBQb2xpY3kgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpDbG91ZEZyb250OjpDYWNoZVBvbGljeVxuICogQGxpbmsgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkRnJvbnQvbGF0ZXN0L0RldmVsb3Blckd1aWRlL3VzaW5nLW1hbmFnZWQtY2FjaGUtcG9saWNpZXMuaHRtbFxuICovXG5leHBvcnQgY2xhc3MgQ2FjaGVQb2xpY3kgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElDYWNoZVBvbGljeSB7XG4gIC8qKlxuICAgKiBUaGlzIHBvbGljeSBpcyBkZXNpZ25lZCBmb3IgdXNlIHdpdGggYW4gb3JpZ2luIHRoYXQgaXMgYW4gQVdTIEFtcGxpZnkgd2ViIGFwcC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQU1QTElGWSA9IENhY2hlUG9saWN5LmZyb21NYW5hZ2VkQ2FjaGVQb2xpY3koJzJlNTQzMTJkLTEzNmQtNDkzYy04ZWI5LWIwMDFmMjJmNjdkMicpO1xuICAvKipcbiAgICogT3B0aW1pemUgY2FjaGUgZWZmaWNpZW5jeSBieSBtaW5pbWl6aW5nIHRoZSB2YWx1ZXMgdGhhdCBDbG91ZEZyb250IGluY2x1ZGVzIGluIHRoZSBjYWNoZSBrZXkuXG4gICAqIFF1ZXJ5IHN0cmluZ3MgYW5kIGNvb2tpZXMgYXJlIG5vdCBpbmNsdWRlZCBpbiB0aGUgY2FjaGUga2V5LCBhbmQgb25seSB0aGUgbm9ybWFsaXplZCAnQWNjZXB0LUVuY29kaW5nJyBoZWFkZXIgaXMgaW5jbHVkZWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENBQ0hJTkdfT1BUSU1JWkVEID0gQ2FjaGVQb2xpY3kuZnJvbU1hbmFnZWRDYWNoZVBvbGljeSgnNjU4MzI3ZWEtZjg5ZC00ZmFiLWE2M2QtN2U4ODYzOWU1OGY2Jyk7XG4gIC8qKlxuICAgKiBPcHRpbWl6ZSBjYWNoZSBlZmZpY2llbmN5IGJ5IG1pbmltaXppbmcgdGhlIHZhbHVlcyB0aGF0IENsb3VkRnJvbnQgaW5jbHVkZXMgaW4gdGhlIGNhY2hlIGtleS5cbiAgICogUXVlcnkgc3RyaW5ncyBhbmQgY29va2llcyBhcmUgbm90IGluY2x1ZGVkIGluIHRoZSBjYWNoZSBrZXksIGFuZCBvbmx5IHRoZSBub3JtYWxpemVkICdBY2NlcHQtRW5jb2RpbmcnIGhlYWRlciBpcyBpbmNsdWRlZC5cbiAgICogRGlzYWJsZXMgY2FjaGUgY29tcHJlc3Npb24uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENBQ0hJTkdfT1BUSU1JWkVEX0ZPUl9VTkNPTVBSRVNTRURfT0JKRUNUUyA9IENhY2hlUG9saWN5LmZyb21NYW5hZ2VkQ2FjaGVQb2xpY3koJ2IyODg0NDQ5LWU0ZGUtNDZhNy1hYzM2LTcwYmM3ZjFkZGQ2ZCcpO1xuICAvKiogRGlzYWJsZXMgY2FjaGluZy4gVGhpcyBwb2xpY3kgaXMgdXNlZnVsIGZvciBkeW5hbWljIGNvbnRlbnQgYW5kIGZvciByZXF1ZXN0cyB0aGF0IGFyZSBub3QgY2FjaGVhYmxlLiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENBQ0hJTkdfRElTQUJMRUQgPSBDYWNoZVBvbGljeS5mcm9tTWFuYWdlZENhY2hlUG9saWN5KCc0MTM1ZWEyZC02ZGY4LTQ0YTMtOWRmMy00YjVhODRiZTM5YWQnKTtcbiAgLyoqIERlc2lnbmVkIGZvciB1c2Ugd2l0aCBhbiBvcmlnaW4gdGhhdCBpcyBhbiBBV1MgRWxlbWVudGFsIE1lZGlhUGFja2FnZSBlbmRwb2ludC4gKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBFTEVNRU5UQUxfTUVESUFfUEFDS0FHRSA9IENhY2hlUG9saWN5LmZyb21NYW5hZ2VkQ2FjaGVQb2xpY3koJzA4NjI3MjYyLTA1YTktNGY3Ni05ZGVkLWI1MGNhMmUzYTg0ZicpO1xuXG4gIC8qKiBJbXBvcnRzIGEgQ2FjaGUgUG9saWN5IGZyb20gaXRzIGlkLiAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21DYWNoZVBvbGljeUlkKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGNhY2hlUG9saWN5SWQ6IHN0cmluZyk6IElDYWNoZVBvbGljeSB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUNhY2hlUG9saWN5IHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBjYWNoZVBvbGljeUlkID0gY2FjaGVQb2xpY3lJZDtcbiAgICB9KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKiogVXNlIGFuIGV4aXN0aW5nIG1hbmFnZWQgY2FjaGUgcG9saWN5LiAqL1xuICBwcml2YXRlIHN0YXRpYyBmcm9tTWFuYWdlZENhY2hlUG9saWN5KG1hbmFnZWRDYWNoZVBvbGljeUlkOiBzdHJpbmcpOiBJQ2FjaGVQb2xpY3kge1xuICAgIHJldHVybiBuZXcgY2xhc3MgaW1wbGVtZW50cyBJQ2FjaGVQb2xpY3kge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGNhY2hlUG9saWN5SWQgPSBtYW5hZ2VkQ2FjaGVQb2xpY3lJZDtcbiAgICB9KCk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgY2FjaGVQb2xpY3lJZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDYWNoZVBvbGljeVByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuY2FjaGVQb2xpY3lOYW1lLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2FjaGVQb2xpY3lOYW1lID0gcHJvcHMuY2FjaGVQb2xpY3lOYW1lID8/IGAke05hbWVzLnVuaXF1ZUlkKHRoaXMpLnNsaWNlKDAsIDExMCl9LSR7U3RhY2sub2YodGhpcykucmVnaW9ufWA7XG5cbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChjYWNoZVBvbGljeU5hbWUpICYmICFjYWNoZVBvbGljeU5hbWUubWF0Y2goL15bXFx3LV0rJC9pKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAnY2FjaGVQb2xpY3lOYW1lJyBjYW4gb25seSBpbmNsdWRlICctJywgJ18nLCBhbmQgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMsIGdvdDogJyR7Y2FjaGVQb2xpY3lOYW1lfSdgKTtcbiAgICB9XG5cbiAgICBpZiAoY2FjaGVQb2xpY3lOYW1lLmxlbmd0aCA+IDEyOCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAnY2FjaGVQb2xpY3lOYW1lJyBjYW5ub3QgYmUgbG9uZ2VyIHRoYW4gMTI4IGNoYXJhY3RlcnMsIGdvdDogJyR7Y2FjaGVQb2xpY3lOYW1lLmxlbmd0aH0nYCk7XG4gICAgfVxuXG4gICAgY29uc3QgbWluVHRsID0gKHByb3BzLm1pblR0bCA/PyBEdXJhdGlvbi5zZWNvbmRzKDApKS50b1NlY29uZHMoKTtcbiAgICBjb25zdCBkZWZhdWx0VHRsID0gTWF0aC5tYXgoKHByb3BzLmRlZmF1bHRUdGwgPz8gRHVyYXRpb24uZGF5cygxKSkudG9TZWNvbmRzKCksIG1pblR0bCk7XG4gICAgY29uc3QgbWF4VHRsID0gTWF0aC5tYXgoKHByb3BzLm1heFR0bCA/PyBEdXJhdGlvbi5kYXlzKDM2NSkpLnRvU2Vjb25kcygpLCBkZWZhdWx0VHRsKTtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbkNhY2hlUG9saWN5KHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGNhY2hlUG9saWN5Q29uZmlnOiB7XG4gICAgICAgIG5hbWU6IGNhY2hlUG9saWN5TmFtZSxcbiAgICAgICAgY29tbWVudDogcHJvcHMuY29tbWVudCxcbiAgICAgICAgbWluVHRsLFxuICAgICAgICBtYXhUdGwsXG4gICAgICAgIGRlZmF1bHRUdGwsXG4gICAgICAgIHBhcmFtZXRlcnNJbkNhY2hlS2V5QW5kRm9yd2FyZGVkVG9PcmlnaW46IHRoaXMucmVuZGVyQ2FjaGVLZXkocHJvcHMpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuY2FjaGVQb2xpY3lJZCA9IHJlc291cmNlLnJlZjtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQ2FjaGVLZXkocHJvcHM6IENhY2hlUG9saWN5UHJvcHMpOiBDZm5DYWNoZVBvbGljeS5QYXJhbWV0ZXJzSW5DYWNoZUtleUFuZEZvcndhcmRlZFRvT3JpZ2luUHJvcGVydHkge1xuICAgIGNvbnN0IGNvb2tpZXMgPSBwcm9wcy5jb29raWVCZWhhdmlvciA/PyBDYWNoZUNvb2tpZUJlaGF2aW9yLm5vbmUoKTtcbiAgICBjb25zdCBoZWFkZXJzID0gcHJvcHMuaGVhZGVyQmVoYXZpb3IgPz8gQ2FjaGVIZWFkZXJCZWhhdmlvci5ub25lKCk7XG4gICAgY29uc3QgcXVlcnlTdHJpbmdzID0gcHJvcHMucXVlcnlTdHJpbmdCZWhhdmlvciA/PyBDYWNoZVF1ZXJ5U3RyaW5nQmVoYXZpb3Iubm9uZSgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvb2tpZXNDb25maWc6IHtcbiAgICAgICAgY29va2llQmVoYXZpb3I6IGNvb2tpZXMuYmVoYXZpb3IsXG4gICAgICAgIGNvb2tpZXM6IGNvb2tpZXMuY29va2llcyxcbiAgICAgIH0sXG4gICAgICBoZWFkZXJzQ29uZmlnOiB7XG4gICAgICAgIGhlYWRlckJlaGF2aW9yOiBoZWFkZXJzLmJlaGF2aW9yLFxuICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLmhlYWRlcnMsXG4gICAgICB9LFxuICAgICAgZW5hYmxlQWNjZXB0RW5jb2RpbmdHemlwOiBwcm9wcy5lbmFibGVBY2NlcHRFbmNvZGluZ0d6aXAgPz8gZmFsc2UsXG4gICAgICBlbmFibGVBY2NlcHRFbmNvZGluZ0Jyb3RsaTogcHJvcHMuZW5hYmxlQWNjZXB0RW5jb2RpbmdCcm90bGkgPz8gZmFsc2UsXG4gICAgICBxdWVyeVN0cmluZ3NDb25maWc6IHtcbiAgICAgICAgcXVlcnlTdHJpbmdCZWhhdmlvcjogcXVlcnlTdHJpbmdzLmJlaGF2aW9yLFxuICAgICAgICBxdWVyeVN0cmluZ3M6IHF1ZXJ5U3RyaW5ncy5xdWVyeVN0cmluZ3MsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW55IGNvb2tpZXMgaW4gdmlld2VyIHJlcXVlc3RzIGFyZSBpbmNsdWRlZCBpbiB0aGUgY2FjaGUga2V5IGFuZFxuICogYXV0b21hdGljYWxseSBpbmNsdWRlZCBpbiByZXF1ZXN0cyB0aGF0IENsb3VkRnJvbnQgc2VuZHMgdG8gdGhlIG9yaWdpbi5cbiAqL1xuZXhwb3J0IGNsYXNzIENhY2hlQ29va2llQmVoYXZpb3Ige1xuICAvKipcbiAgICogQ29va2llcyBpbiB2aWV3ZXIgcmVxdWVzdHMgYXJlIG5vdCBpbmNsdWRlZCBpbiB0aGUgY2FjaGUga2V5IGFuZFxuICAgKiBhcmUgbm90IGF1dG9tYXRpY2FsbHkgaW5jbHVkZWQgaW4gcmVxdWVzdHMgdGhhdCBDbG91ZEZyb250IHNlbmRzIHRvIHRoZSBvcmlnaW4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG5vbmUoKSB7IHJldHVybiBuZXcgQ2FjaGVDb29raWVCZWhhdmlvcignbm9uZScpOyB9XG5cbiAgLyoqXG4gICAqIEFsbCBjb29raWVzIGluIHZpZXdlciByZXF1ZXN0cyBhcmUgaW5jbHVkZWQgaW4gdGhlIGNhY2hlIGtleSBhbmQgYXJlIGF1dG9tYXRpY2FsbHkgaW5jbHVkZWQgaW4gcmVxdWVzdHMgdGhhdCBDbG91ZEZyb250IHNlbmRzIHRvIHRoZSBvcmlnaW4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFsbCgpIHsgcmV0dXJuIG5ldyBDYWNoZUNvb2tpZUJlaGF2aW9yKCdhbGwnKTsgfVxuXG4gIC8qKlxuICAgKiBPbmx5IHRoZSBwcm92aWRlZCBgY29va2llc2AgYXJlIGluY2x1ZGVkIGluIHRoZSBjYWNoZSBrZXkgYW5kIGF1dG9tYXRpY2FsbHkgaW5jbHVkZWQgaW4gcmVxdWVzdHMgdGhhdCBDbG91ZEZyb250IHNlbmRzIHRvIHRoZSBvcmlnaW4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFsbG93TGlzdCguLi5jb29raWVzOiBzdHJpbmdbXSkge1xuICAgIGlmIChjb29raWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdCBsZWFzdCBvbmUgY29va2llIHRvIGFsbG93IG11c3QgYmUgcHJvdmlkZWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDYWNoZUNvb2tpZUJlaGF2aW9yKCd3aGl0ZWxpc3QnLCBjb29raWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGwgY29va2llcyBleGNlcHQgdGhlIHByb3ZpZGVkIGBjb29raWVzYCBhcmUgaW5jbHVkZWQgaW4gdGhlIGNhY2hlIGtleSBhbmRcbiAgICogYXV0b21hdGljYWxseSBpbmNsdWRlZCBpbiByZXF1ZXN0cyB0aGF0IENsb3VkRnJvbnQgc2VuZHMgdG8gdGhlIG9yaWdpbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZGVueUxpc3QoLi4uY29va2llczogc3RyaW5nW10pIHtcbiAgICBpZiAoY29va2llcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3Qgb25lIGNvb2tpZSB0byBkZW55IG11c3QgYmUgcHJvdmlkZWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDYWNoZUNvb2tpZUJlaGF2aW9yKCdhbGxFeGNlcHQnLCBjb29raWVzKTtcbiAgfVxuXG4gIC8qKiBUaGUgYmVoYXZpb3Igb2YgY29va2llczogYWxsb3cgYWxsLCBub25lLCBhbiBhbGxvdyBsaXN0LCBvciBhIGRlbnkgbGlzdC4gKi9cbiAgcHVibGljIHJlYWRvbmx5IGJlaGF2aW9yOiBzdHJpbmc7XG4gIC8qKiBUaGUgY29va2llcyB0byBhbGxvdyBvciBkZW55LCBpZiB0aGUgYmVoYXZpb3IgaXMgYW4gYWxsb3cgb3IgZGVueSBsaXN0LiAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29va2llcz86IHN0cmluZ1tdO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoYmVoYXZpb3I6IHN0cmluZywgY29va2llcz86IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5iZWhhdmlvciA9IGJlaGF2aW9yO1xuICAgIHRoaXMuY29va2llcyA9IGNvb2tpZXM7XG4gIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYW55IEhUVFAgaGVhZGVycyBhcmUgaW5jbHVkZWQgaW4gdGhlIGNhY2hlIGtleSBhbmQgYXV0b21hdGljYWxseSBpbmNsdWRlZCBpbiByZXF1ZXN0cyB0aGF0IENsb3VkRnJvbnQgc2VuZHMgdG8gdGhlIG9yaWdpbi5cbiAqL1xuZXhwb3J0IGNsYXNzIENhY2hlSGVhZGVyQmVoYXZpb3Ige1xuICAvKiogSFRUUCBoZWFkZXJzIGFyZSBub3QgaW5jbHVkZWQgaW4gdGhlIGNhY2hlIGtleSBhbmQgYXJlIG5vdCBhdXRvbWF0aWNhbGx5IGluY2x1ZGVkIGluIHJlcXVlc3RzIHRoYXQgQ2xvdWRGcm9udCBzZW5kcyB0byB0aGUgb3JpZ2luLiAqL1xuICBwdWJsaWMgc3RhdGljIG5vbmUoKSB7IHJldHVybiBuZXcgQ2FjaGVIZWFkZXJCZWhhdmlvcignbm9uZScpOyB9XG4gIC8qKiBMaXN0ZWQgaGVhZGVycyBhcmUgaW5jbHVkZWQgaW4gdGhlIGNhY2hlIGtleSBhbmQgYXJlIGF1dG9tYXRpY2FsbHkgaW5jbHVkZWQgaW4gcmVxdWVzdHMgdGhhdCBDbG91ZEZyb250IHNlbmRzIHRvIHRoZSBvcmlnaW4uICovXG4gIHB1YmxpYyBzdGF0aWMgYWxsb3dMaXN0KC4uLmhlYWRlcnM6IHN0cmluZ1tdKSB7XG4gICAgaWYgKGhlYWRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0IGxlYXN0IG9uZSBoZWFkZXIgdG8gYWxsb3cgbXVzdCBiZSBwcm92aWRlZCcpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IENhY2hlSGVhZGVyQmVoYXZpb3IoJ3doaXRlbGlzdCcsIGhlYWRlcnMpO1xuICB9XG5cbiAgLyoqIElmIG5vIGhlYWRlcnMgd2lsbCBiZSBwYXNzZWQsIG9yIGFuIGFsbG93IGxpc3Qgb2YgaGVhZGVycy4gKi9cbiAgcHVibGljIHJlYWRvbmx5IGJlaGF2aW9yOiBzdHJpbmc7XG4gIC8qKiBUaGUgaGVhZGVycyBmb3IgdGhlIGFsbG93L2RlbnkgbGlzdCwgaWYgYXBwbGljYWJsZS4gKi9cbiAgcHVibGljIHJlYWRvbmx5IGhlYWRlcnM/OiBzdHJpbmdbXTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKGJlaGF2aW9yOiBzdHJpbmcsIGhlYWRlcnM/OiBzdHJpbmdbXSkge1xuICAgIHRoaXMuYmVoYXZpb3IgPSBiZWhhdmlvcjtcbiAgICB0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xuICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGFueSBVUkwgcXVlcnkgc3RyaW5ncyBpbiB2aWV3ZXIgcmVxdWVzdHMgYXJlIGluY2x1ZGVkIGluIHRoZSBjYWNoZSBrZXlcbiAqIGFuZCBhdXRvbWF0aWNhbGx5IGluY2x1ZGVkIGluIHJlcXVlc3RzIHRoYXQgQ2xvdWRGcm9udCBzZW5kcyB0byB0aGUgb3JpZ2luLlxuICovXG5leHBvcnQgY2xhc3MgQ2FjaGVRdWVyeVN0cmluZ0JlaGF2aW9yIHtcbiAgLyoqXG4gICAqIFF1ZXJ5IHN0cmluZ3MgaW4gdmlld2VyIHJlcXVlc3RzIGFyZSBub3QgaW5jbHVkZWQgaW4gdGhlIGNhY2hlIGtleSBhbmRcbiAgICogYXJlIG5vdCBhdXRvbWF0aWNhbGx5IGluY2x1ZGVkIGluIHJlcXVlc3RzIHRoYXQgQ2xvdWRGcm9udCBzZW5kcyB0byB0aGUgb3JpZ2luLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBub25lKCkgeyByZXR1cm4gbmV3IENhY2hlUXVlcnlTdHJpbmdCZWhhdmlvcignbm9uZScpOyB9XG5cbiAgLyoqXG4gICAqIEFsbCBxdWVyeSBzdHJpbmdzIGluIHZpZXdlciByZXF1ZXN0cyBhcmUgaW5jbHVkZWQgaW4gdGhlIGNhY2hlIGtleSBhbmQgYXJlIGF1dG9tYXRpY2FsbHkgaW5jbHVkZWQgaW4gcmVxdWVzdHMgdGhhdCBDbG91ZEZyb250IHNlbmRzIHRvIHRoZSBvcmlnaW4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFsbCgpIHsgcmV0dXJuIG5ldyBDYWNoZVF1ZXJ5U3RyaW5nQmVoYXZpb3IoJ2FsbCcpOyB9XG5cbiAgLyoqXG4gICAqIE9ubHkgdGhlIHByb3ZpZGVkIGBxdWVyeVN0cmluZ3NgIGFyZSBpbmNsdWRlZCBpbiB0aGUgY2FjaGUga2V5IGFuZCBhdXRvbWF0aWNhbGx5IGluY2x1ZGVkIGluIHJlcXVlc3RzIHRoYXQgQ2xvdWRGcm9udCBzZW5kcyB0byB0aGUgb3JpZ2luLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbGxvd0xpc3QoLi4ucXVlcnlTdHJpbmdzOiBzdHJpbmdbXSkge1xuICAgIGlmIChxdWVyeVN0cmluZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0IGxlYXN0IG9uZSBxdWVyeSBzdHJpbmcgdG8gYWxsb3cgbXVzdCBiZSBwcm92aWRlZCcpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IENhY2hlUXVlcnlTdHJpbmdCZWhhdmlvcignd2hpdGVsaXN0JywgcXVlcnlTdHJpbmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGwgcXVlcnkgc3RyaW5ncyBleGNlcHQgdGhlIHByb3ZpZGVkIGBxdWVyeVN0cmluZ3NgIGFyZSBpbmNsdWRlZCBpbiB0aGUgY2FjaGUga2V5IGFuZFxuICAgKiBhdXRvbWF0aWNhbGx5IGluY2x1ZGVkIGluIHJlcXVlc3RzIHRoYXQgQ2xvdWRGcm9udCBzZW5kcyB0byB0aGUgb3JpZ2luLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBkZW55TGlzdCguLi5xdWVyeVN0cmluZ3M6IHN0cmluZ1tdKSB7XG4gICAgaWYgKHF1ZXJ5U3RyaW5ncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3Qgb25lIHF1ZXJ5IHN0cmluZyB0byBkZW55IG11c3QgYmUgcHJvdmlkZWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDYWNoZVF1ZXJ5U3RyaW5nQmVoYXZpb3IoJ2FsbEV4Y2VwdCcsIHF1ZXJ5U3RyaW5ncyk7XG4gIH1cblxuICAvKiogVGhlIGJlaGF2aW9yIG9mIHF1ZXJ5IHN0cmluZ3MgLS0gYWxsb3cgYWxsLCBub25lLCBvbmx5IGFuIGFsbG93IGxpc3QsIG9yIGEgZGVueSBsaXN0LiAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYmVoYXZpb3I6IHN0cmluZztcbiAgLyoqIFRoZSBxdWVyeSBzdHJpbmdzIHRvIGFsbG93IG9yIGRlbnksIGlmIHRoZSBiZWhhdmlvciBpcyBhbiBhbGxvdyBvciBkZW55IGxpc3QuICovXG4gIHB1YmxpYyByZWFkb25seSBxdWVyeVN0cmluZ3M/OiBzdHJpbmdbXTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKGJlaGF2aW9yOiBzdHJpbmcsIHF1ZXJ5U3RyaW5ncz86IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5iZWhhdmlvciA9IGJlaGF2aW9yO1xuICAgIHRoaXMucXVlcnlTdHJpbmdzID0gcXVlcnlTdHJpbmdzO1xuICB9XG59XG4iXX0=