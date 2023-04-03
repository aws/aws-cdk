"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaEdgeEventType = exports.CachedMethods = exports.AllowedMethods = exports.SecurityPolicyProtocol = exports.SSLMethod = exports.OriginProtocolPolicy = exports.ViewerProtocolPolicy = exports.PriceClass = exports.HttpVersion = exports.Distribution = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const cx_api_1 = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
const cloudfront_generated_1 = require("./cloudfront.generated");
const cache_behavior_1 = require("./private/cache-behavior");
const utils_1 = require("./private/utils");
/**
 * A CloudFront distribution with associated origin(s) and caching behavior(s).
 */
class Distribution extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        this.additionalBehaviors = [];
        this.boundOrigins = [];
        this.originGroups = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_DistributionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Distribution);
            }
            throw error;
        }
        if (props.certificate) {
            const certificateRegion = core_1.Stack.of(this).splitArn(props.certificate.certificateArn, core_1.ArnFormat.SLASH_RESOURCE_NAME).region;
            if (!core_1.Token.isUnresolved(certificateRegion) && certificateRegion !== 'us-east-1') {
                throw new Error(`Distribution certificates must be in the us-east-1 region and the certificate you provided is in ${certificateRegion}.`);
            }
            if ((props.domainNames ?? []).length === 0) {
                throw new Error('Must specify at least one domain name to use a certificate with a distribution');
            }
        }
        const originId = this.addOrigin(props.defaultBehavior.origin);
        this.defaultBehavior = new cache_behavior_1.CacheBehavior(originId, { pathPattern: '*', ...props.defaultBehavior });
        if (props.additionalBehaviors) {
            Object.entries(props.additionalBehaviors).forEach(([pathPattern, behaviorOptions]) => {
                this.addBehavior(pathPattern, behaviorOptions.origin, behaviorOptions);
            });
        }
        this.certificate = props.certificate;
        this.errorResponses = props.errorResponses ?? [];
        // Comments have an undocumented limit of 128 characters
        const trimmedComment = props.comment && props.comment.length > 128
            ? `${props.comment.slice(0, 128 - 3)}...`
            : props.comment;
        const distribution = new cloudfront_generated_1.CfnDistribution(this, 'Resource', {
            distributionConfig: {
                enabled: props.enabled ?? true,
                origins: core_1.Lazy.any({ produce: () => this.renderOrigins() }),
                originGroups: core_1.Lazy.any({ produce: () => this.renderOriginGroups() }),
                defaultCacheBehavior: this.defaultBehavior._renderBehavior(),
                aliases: props.domainNames,
                cacheBehaviors: core_1.Lazy.any({ produce: () => this.renderCacheBehaviors() }),
                comment: trimmedComment,
                customErrorResponses: this.renderErrorResponses(),
                defaultRootObject: props.defaultRootObject,
                httpVersion: props.httpVersion ?? HttpVersion.HTTP2,
                ipv6Enabled: props.enableIpv6 ?? true,
                logging: this.renderLogging(props),
                priceClass: props.priceClass ?? undefined,
                restrictions: this.renderRestrictions(props.geoRestriction),
                viewerCertificate: this.certificate ? this.renderViewerCertificate(this.certificate, props.minimumProtocolVersion, props.sslSupportMethod) : undefined,
                webAclId: props.webAclId,
            },
        });
        this.domainName = distribution.attrDomainName;
        this.distributionDomainName = distribution.attrDomainName;
        this.distributionId = distribution.ref;
    }
    /**
     * Creates a Distribution construct that represents an external (imported) distribution.
     */
    static fromDistributionAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_DistributionAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromDistributionAttributes);
            }
            throw error;
        }
        return new class extends core_1.Resource {
            constructor() {
                super(scope, id);
                this.domainName = attrs.domainName;
                this.distributionDomainName = attrs.domainName;
                this.distributionId = attrs.distributionId;
            }
            grant(grantee, ...actions) {
                return iam.Grant.addToPrincipal({ grantee, actions, resourceArns: [utils_1.formatDistributionArn(this)] });
            }
            grantCreateInvalidation(grantee) {
                return this.grant(grantee, 'cloudfront:CreateInvalidation');
            }
        }();
    }
    /**
     * Adds a new behavior to this distribution for the given pathPattern.
     *
     * @param pathPattern the path pattern (e.g., 'images/*') that specifies which requests to apply the behavior to.
     * @param origin the origin to use for this behavior
     * @param behaviorOptions the options for the behavior at this path.
     */
    addBehavior(pathPattern, origin, behaviorOptions = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_IOrigin(origin);
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_AddBehaviorOptions(behaviorOptions);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addBehavior);
            }
            throw error;
        }
        if (pathPattern === '*') {
            throw new Error('Only the default behavior can have a path pattern of \'*\'');
        }
        const originId = this.addOrigin(origin);
        this.additionalBehaviors.push(new cache_behavior_1.CacheBehavior(originId, { pathPattern, ...behaviorOptions }));
    }
    /**
     * Adds an IAM policy statement associated with this distribution to an IAM
     * principal's policy.
     *
     * @param identity The principal
     * @param actions The set of actions to allow (i.e. "cloudfront:ListInvalidations")
     */
    grant(identity, ...actions) {
        return iam.Grant.addToPrincipal({ grantee: identity, actions, resourceArns: [utils_1.formatDistributionArn(this)] });
    }
    /**
     * Grant to create invalidations for this bucket to an IAM principal (Role/Group/User).
     *
     * @param identity The principal
     */
    grantCreateInvalidation(identity) {
        return this.grant(identity, 'cloudfront:CreateInvalidation');
    }
    addOrigin(origin, isFailoverOrigin = false) {
        const ORIGIN_ID_MAX_LENGTH = 128;
        const existingOrigin = this.boundOrigins.find(boundOrigin => boundOrigin.origin === origin);
        if (existingOrigin) {
            return existingOrigin.originGroupId ?? existingOrigin.originId;
        }
        else {
            const originIndex = this.boundOrigins.length + 1;
            const scope = new constructs_1.Construct(this, `Origin${originIndex}`);
            const generatedId = core_1.Names.uniqueId(scope).slice(-ORIGIN_ID_MAX_LENGTH);
            const originBindConfig = origin.bind(scope, { originId: generatedId });
            const originId = originBindConfig.originProperty?.id ?? generatedId;
            const duplicateId = this.boundOrigins.find(boundOrigin => boundOrigin.originProperty?.id === originBindConfig.originProperty?.id);
            if (duplicateId) {
                throw new Error(`Origin with id ${duplicateId.originProperty?.id} already exists. OriginIds must be unique within a distribution`);
            }
            if (!originBindConfig.failoverConfig) {
                this.boundOrigins.push({ origin, originId, ...originBindConfig });
            }
            else {
                if (isFailoverOrigin) {
                    throw new Error('An Origin cannot use an Origin with its own failover configuration as its fallback origin!');
                }
                const groupIndex = this.originGroups.length + 1;
                const originGroupId = core_1.Names.uniqueId(new constructs_1.Construct(this, `OriginGroup${groupIndex}`)).slice(-ORIGIN_ID_MAX_LENGTH);
                this.boundOrigins.push({ origin, originId, originGroupId, ...originBindConfig });
                const failoverOriginId = this.addOrigin(originBindConfig.failoverConfig.failoverOrigin, true);
                this.addOriginGroup(originGroupId, originBindConfig.failoverConfig.statusCodes, originId, failoverOriginId);
                return originGroupId;
            }
            return originBindConfig.originProperty?.id ?? originId;
        }
    }
    addOriginGroup(originGroupId, statusCodes, originId, failoverOriginId) {
        statusCodes = statusCodes ?? [500, 502, 503, 504];
        if (statusCodes.length === 0) {
            throw new Error('fallbackStatusCodes cannot be empty');
        }
        this.originGroups.push({
            failoverCriteria: {
                statusCodes: {
                    items: statusCodes,
                    quantity: statusCodes.length,
                },
            },
            id: originGroupId,
            members: {
                items: [
                    { originId },
                    { originId: failoverOriginId },
                ],
                quantity: 2,
            },
        });
    }
    renderOrigins() {
        const renderedOrigins = [];
        this.boundOrigins.forEach(boundOrigin => {
            if (boundOrigin.originProperty) {
                renderedOrigins.push(boundOrigin.originProperty);
            }
        });
        return renderedOrigins;
    }
    renderOriginGroups() {
        return this.originGroups.length === 0
            ? undefined
            : {
                items: this.originGroups,
                quantity: this.originGroups.length,
            };
    }
    renderCacheBehaviors() {
        if (this.additionalBehaviors.length === 0) {
            return undefined;
        }
        return this.additionalBehaviors.map(behavior => behavior._renderBehavior());
    }
    renderErrorResponses() {
        if (this.errorResponses.length === 0) {
            return undefined;
        }
        return this.errorResponses.map(errorConfig => {
            if (!errorConfig.responseHttpStatus && !errorConfig.ttl && !errorConfig.responsePagePath) {
                throw new Error('A custom error response without either a \'responseHttpStatus\', \'ttl\' or \'responsePagePath\' is not valid.');
            }
            return {
                errorCachingMinTtl: errorConfig.ttl?.toSeconds(),
                errorCode: errorConfig.httpStatus,
                responseCode: errorConfig.responsePagePath
                    ? errorConfig.responseHttpStatus ?? errorConfig.httpStatus
                    : errorConfig.responseHttpStatus,
                responsePagePath: errorConfig.responsePagePath,
            };
        });
    }
    renderLogging(props) {
        if (!props.enableLogging && !props.logBucket) {
            return undefined;
        }
        if (props.enableLogging === false && props.logBucket) {
            throw new Error('Explicitly disabled logging but provided a logging bucket.');
        }
        const bucket = props.logBucket ?? new s3.Bucket(this, 'LoggingBucket', {
            encryption: s3.BucketEncryption.S3_MANAGED,
        });
        return {
            bucket: bucket.bucketRegionalDomainName,
            includeCookies: props.logIncludesCookies,
            prefix: props.logFilePrefix,
        };
    }
    renderRestrictions(geoRestriction) {
        return geoRestriction ? {
            geoRestriction: {
                restrictionType: geoRestriction.restrictionType,
                locations: geoRestriction.locations,
            },
        } : undefined;
    }
    renderViewerCertificate(certificate, minimumProtocolVersionProp, sslSupportMethodProp) {
        const defaultVersion = core_1.FeatureFlags.of(this).isEnabled(cx_api_1.CLOUDFRONT_DEFAULT_SECURITY_POLICY_TLS_V1_2_2021)
            ? SecurityPolicyProtocol.TLS_V1_2_2021 : SecurityPolicyProtocol.TLS_V1_2_2019;
        const minimumProtocolVersion = minimumProtocolVersionProp ?? defaultVersion;
        const sslSupportMethod = sslSupportMethodProp ?? SSLMethod.SNI;
        return {
            acmCertificateArn: certificate.certificateArn,
            minimumProtocolVersion: minimumProtocolVersion,
            sslSupportMethod: sslSupportMethod,
        };
    }
}
exports.Distribution = Distribution;
_a = JSII_RTTI_SYMBOL_1;
Distribution[_a] = { fqn: "@aws-cdk/aws-cloudfront.Distribution", version: "0.0.0" };
/** Maximum HTTP version to support */
var HttpVersion;
(function (HttpVersion) {
    /** HTTP 1.1 */
    HttpVersion["HTTP1_1"] = "http1.1";
    /** HTTP 2 */
    HttpVersion["HTTP2"] = "http2";
    /** HTTP 2 and HTTP 3 */
    HttpVersion["HTTP2_AND_3"] = "http2and3";
    /** HTTP 3 */
    HttpVersion["HTTP3"] = "http3";
})(HttpVersion = exports.HttpVersion || (exports.HttpVersion = {}));
/**
 * The price class determines how many edge locations CloudFront will use for your distribution.
 * See https://aws.amazon.com/cloudfront/pricing/ for full list of supported regions.
 */
var PriceClass;
(function (PriceClass) {
    /** USA, Canada, Europe, & Israel */
    PriceClass["PRICE_CLASS_100"] = "PriceClass_100";
    /** PRICE_CLASS_100 + South Africa, Kenya, Middle East, Japan, Singapore, South Korea, Taiwan, Hong Kong, & Philippines */
    PriceClass["PRICE_CLASS_200"] = "PriceClass_200";
    /** All locations */
    PriceClass["PRICE_CLASS_ALL"] = "PriceClass_All";
})(PriceClass = exports.PriceClass || (exports.PriceClass = {}));
/**
 * How HTTPs should be handled with your distribution.
 */
var ViewerProtocolPolicy;
(function (ViewerProtocolPolicy) {
    /** HTTPS only */
    ViewerProtocolPolicy["HTTPS_ONLY"] = "https-only";
    /** Will redirect HTTP requests to HTTPS */
    ViewerProtocolPolicy["REDIRECT_TO_HTTPS"] = "redirect-to-https";
    /** Both HTTP and HTTPS supported */
    ViewerProtocolPolicy["ALLOW_ALL"] = "allow-all";
})(ViewerProtocolPolicy = exports.ViewerProtocolPolicy || (exports.ViewerProtocolPolicy = {}));
/**
 * Defines what protocols CloudFront will use to connect to an origin.
 */
var OriginProtocolPolicy;
(function (OriginProtocolPolicy) {
    /** Connect on HTTP only */
    OriginProtocolPolicy["HTTP_ONLY"] = "http-only";
    /** Connect with the same protocol as the viewer */
    OriginProtocolPolicy["MATCH_VIEWER"] = "match-viewer";
    /** Connect on HTTPS only */
    OriginProtocolPolicy["HTTPS_ONLY"] = "https-only";
})(OriginProtocolPolicy = exports.OriginProtocolPolicy || (exports.OriginProtocolPolicy = {}));
/**
 * The SSL method CloudFront will use for your distribution.
 *
 * Server Name Indication (SNI) - is an extension to the TLS computer networking protocol by which a client indicates
 *  which hostname it is attempting to connect to at the start of the handshaking process. This allows a server to present
 *  multiple certificates on the same IP address and TCP port number and hence allows multiple secure (HTTPS) websites
 * (or any other service over TLS) to be served by the same IP address without requiring all those sites to use the same certificate.
 *
 * CloudFront can use SNI to host multiple distributions on the same IP - which a large majority of clients will support.
 *
 * If your clients cannot support SNI however - CloudFront can use dedicated IPs for your distribution - but there is a prorated monthly charge for
 * using this feature. By default, we use SNI - but you can optionally enable dedicated IPs (VIP).
 *
 * See the CloudFront SSL for more details about pricing : https://aws.amazon.com/cloudfront/custom-ssl-domains/
 *
 */
var SSLMethod;
(function (SSLMethod) {
    SSLMethod["SNI"] = "sni-only";
    SSLMethod["VIP"] = "vip";
})(SSLMethod = exports.SSLMethod || (exports.SSLMethod = {}));
/**
 * The minimum version of the SSL protocol that you want CloudFront to use for HTTPS connections.
 * CloudFront serves your objects only to browsers or devices that support at least the SSL version that you specify.
 */
var SecurityPolicyProtocol;
(function (SecurityPolicyProtocol) {
    SecurityPolicyProtocol["SSL_V3"] = "SSLv3";
    SecurityPolicyProtocol["TLS_V1"] = "TLSv1";
    SecurityPolicyProtocol["TLS_V1_2016"] = "TLSv1_2016";
    SecurityPolicyProtocol["TLS_V1_1_2016"] = "TLSv1.1_2016";
    SecurityPolicyProtocol["TLS_V1_2_2018"] = "TLSv1.2_2018";
    SecurityPolicyProtocol["TLS_V1_2_2019"] = "TLSv1.2_2019";
    SecurityPolicyProtocol["TLS_V1_2_2021"] = "TLSv1.2_2021";
})(SecurityPolicyProtocol = exports.SecurityPolicyProtocol || (exports.SecurityPolicyProtocol = {}));
/**
 * The HTTP methods that the Behavior will accept requests on.
 */
class AllowedMethods {
    constructor(methods) { this.methods = methods; }
}
exports.AllowedMethods = AllowedMethods;
_b = JSII_RTTI_SYMBOL_1;
AllowedMethods[_b] = { fqn: "@aws-cdk/aws-cloudfront.AllowedMethods", version: "0.0.0" };
/** HEAD and GET */
AllowedMethods.ALLOW_GET_HEAD = new AllowedMethods(['GET', 'HEAD']);
/** HEAD, GET, and OPTIONS */
AllowedMethods.ALLOW_GET_HEAD_OPTIONS = new AllowedMethods(['GET', 'HEAD', 'OPTIONS']);
/** All supported HTTP methods */
AllowedMethods.ALLOW_ALL = new AllowedMethods(['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE']);
/**
 * The HTTP methods that the Behavior will cache requests on.
 */
class CachedMethods {
    constructor(methods) { this.methods = methods; }
}
exports.CachedMethods = CachedMethods;
_c = JSII_RTTI_SYMBOL_1;
CachedMethods[_c] = { fqn: "@aws-cdk/aws-cloudfront.CachedMethods", version: "0.0.0" };
/** HEAD and GET */
CachedMethods.CACHE_GET_HEAD = new CachedMethods(['GET', 'HEAD']);
/** HEAD, GET, and OPTIONS */
CachedMethods.CACHE_GET_HEAD_OPTIONS = new CachedMethods(['GET', 'HEAD', 'OPTIONS']);
/**
 * The type of events that a Lambda@Edge function can be invoked in response to.
 */
var LambdaEdgeEventType;
(function (LambdaEdgeEventType) {
    /**
     * The origin-request specifies the request to the
     * origin location (e.g. S3)
     */
    LambdaEdgeEventType["ORIGIN_REQUEST"] = "origin-request";
    /**
     * The origin-response specifies the response from the
     * origin location (e.g. S3)
     */
    LambdaEdgeEventType["ORIGIN_RESPONSE"] = "origin-response";
    /**
     * The viewer-request specifies the incoming request
     */
    LambdaEdgeEventType["VIEWER_REQUEST"] = "viewer-request";
    /**
     * The viewer-response specifies the outgoing response
     */
    LambdaEdgeEventType["VIEWER_RESPONSE"] = "viewer-response";
})(LambdaEdgeEventType = exports.LambdaEdgeEventType || (exports.LambdaEdgeEventType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdHJpYnV0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlzdHJpYnV0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdDQUF3QztBQUV4QyxzQ0FBc0M7QUFDdEMsd0NBQWtIO0FBQ2xILDRDQUFtRjtBQUNuRiwyQ0FBdUM7QUFFdkMsaUVBQXlEO0FBTXpELDZEQUF5RDtBQUN6RCwyQ0FBd0Q7QUFrUHhEOztHQUVHO0FBQ0gsTUFBYSxZQUFhLFNBQVEsZUFBUTtJQXVDeEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF3QjtRQUNoRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBUkYsd0JBQW1CLEdBQW9CLEVBQUUsQ0FBQztRQUMxQyxpQkFBWSxHQUFrQixFQUFFLENBQUM7UUFDakMsaUJBQVksR0FBMEMsRUFBRSxDQUFDOzs7Ozs7K0NBbEMvRCxZQUFZOzs7O1FBMENyQixJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDckIsTUFBTSxpQkFBaUIsR0FBRyxZQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxnQkFBUyxDQUFDLG1CQUFtQixDQUFDLENBQUMsTUFBTSxDQUFDO1lBQzFILElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLElBQUksaUJBQWlCLEtBQUssV0FBVyxFQUFFO2dCQUMvRSxNQUFNLElBQUksS0FBSyxDQUFDLG9HQUFvRyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7YUFDM0k7WUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUMxQyxNQUFNLElBQUksS0FBSyxDQUFDLGdGQUFnRixDQUFDLENBQUM7YUFDbkc7U0FDRjtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxT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LE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztBQVF0SDs7R0FFRztBQUNILE1BQWEsYUFBYTtJQVN4QixZQUFvQixPQUFpQixJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLEVBQUU7O0FBVHBFLHNDQVVDOzs7QUFUQyxtQkFBbUI7QUFDSSw0QkFBYyxHQUFHLElBQUksYUFBYSxDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDM0UsNkJBQTZCO0FBQ04sb0NBQXNCLEdBQUcsSUFBSSxhQUFhLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUF1Q2hHOztHQUVHO0FBQ0gsSUFBWSxtQkFzQlg7QUF0QkQsV0FBWSxtQkFBbUI7SUFDN0I7OztPQUdHO0lBQ0gsd0RBQWlDLENBQUE7SUFFakM7OztPQUdHO0lBQ0gsMERBQW1DLENBQUE7SUFFbkM7O09BRUc7SUFDSCx3REFBaUMsQ0FBQTtJQUVqQzs7T0FFRztJQUNILDBEQUFtQyxDQUFBO0FBQ3JDLENBQUMsRUF0QlcsbUJBQW1CLEdBQW5CLDJCQUFtQixLQUFuQiwyQkFBbUIsUUFzQjlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYWNtIGZyb20gJ0Bhd3MtY2RrL2F3cy1jZXJ0aWZpY2F0ZW1hbmFnZXInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCB7IEFybkZvcm1hdCwgSVJlc291cmNlLCBMYXp5LCBSZXNvdXJjZSwgU3RhY2ssIFRva2VuLCBEdXJhdGlvbiwgTmFtZXMsIEZlYXR1cmVGbGFncyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ0xPVURGUk9OVF9ERUZBVUxUX1NFQ1VSSVRZX1BPTElDWV9UTFNfVjFfMl8yMDIxIH0gZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUNhY2hlUG9saWN5IH0gZnJvbSAnLi9jYWNoZS1wb2xpY3knO1xuaW1wb3J0IHsgQ2ZuRGlzdHJpYnV0aW9uIH0gZnJvbSAnLi9jbG91ZGZyb250LmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBGdW5jdGlvbkFzc29jaWF0aW9uIH0gZnJvbSAnLi9mdW5jdGlvbic7XG5pbXBvcnQgeyBHZW9SZXN0cmljdGlvbiB9IGZyb20gJy4vZ2VvLXJlc3RyaWN0aW9uJztcbmltcG9ydCB7IElLZXlHcm91cCB9IGZyb20gJy4va2V5LWdyb3VwJztcbmltcG9ydCB7IElPcmlnaW4sIE9yaWdpbkJpbmRDb25maWcsIE9yaWdpbkJpbmRPcHRpb25zIH0gZnJvbSAnLi9vcmlnaW4nO1xuaW1wb3J0IHsgSU9yaWdpblJlcXVlc3RQb2xpY3kgfSBmcm9tICcuL29yaWdpbi1yZXF1ZXN0LXBvbGljeSc7XG5pbXBvcnQgeyBDYWNoZUJlaGF2aW9yIH0gZnJvbSAnLi9wcml2YXRlL2NhY2hlLWJlaGF2aW9yJztcbmltcG9ydCB7IGZvcm1hdERpc3RyaWJ1dGlvbkFybiB9IGZyb20gJy4vcHJpdmF0ZS91dGlscyc7XG5pbXBvcnQgeyBJUmVzcG9uc2VIZWFkZXJzUG9saWN5IH0gZnJvbSAnLi9yZXNwb25zZS1oZWFkZXJzLXBvbGljeSc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBDbG91ZEZyb250IGRpc3RyaWJ1dGlvbnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJRGlzdHJpYnV0aW9uIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBkb21haW4gbmFtZSBvZiB0aGUgRGlzdHJpYnV0aW9uLCBzdWNoIGFzIGQxMTExMTFhYmNkZWY4LmNsb3VkZnJvbnQubmV0LlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqIEBkZXByZWNhdGVkIC0gVXNlIGBkaXN0cmlidXRpb25Eb21haW5OYW1lYCBpbnN0ZWFkLlxuICAgKi9cbiAgcmVhZG9ubHkgZG9tYWluTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZG9tYWluIG5hbWUgb2YgdGhlIERpc3RyaWJ1dGlvbiwgc3VjaCBhcyBkMTExMTExYWJjZGVmOC5jbG91ZGZyb250Lm5ldC5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgZGlzdHJpYnV0aW9uRG9tYWluTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGlzdHJpYnV0aW9uIElEIGZvciB0aGlzIGRpc3RyaWJ1dGlvbi5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgZGlzdHJpYnV0aW9uSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogQWRkcyBhbiBJQU0gcG9saWN5IHN0YXRlbWVudCBhc3NvY2lhdGVkIHdpdGggdGhpcyBkaXN0cmlidXRpb24gdG8gYW4gSUFNXG4gICAqIHByaW5jaXBhbCdzIHBvbGljeS5cbiAgICpcbiAgICogQHBhcmFtIGlkZW50aXR5IFRoZSBwcmluY2lwYWxcbiAgICogQHBhcmFtIGFjdGlvbnMgVGhlIHNldCBvZiBhY3Rpb25zIHRvIGFsbG93IChpLmUuIFwiY2xvdWRmcm9udDpMaXN0SW52YWxpZGF0aW9uc1wiKVxuICAgKi9cbiAgZ3JhbnQoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlLCAuLi5hY3Rpb25zOiBzdHJpbmdbXSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogR3JhbnQgdG8gY3JlYXRlIGludmFsaWRhdGlvbnMgZm9yIHRoaXMgYnVja2V0IHRvIGFuIElBTSBwcmluY2lwYWwgKFJvbGUvR3JvdXAvVXNlcikuXG4gICAqXG4gICAqIEBwYXJhbSBpZGVudGl0eSBUaGUgcHJpbmNpcGFsXG4gICAqL1xuICBncmFudENyZWF0ZUludmFsaWRhdGlvbihpZGVudGl0eTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQ7XG59XG5cbi8qKlxuICogQXR0cmlidXRlcyB1c2VkIHRvIGltcG9ydCBhIERpc3RyaWJ1dGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEaXN0cmlidXRpb25BdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBnZW5lcmF0ZWQgZG9tYWluIG5hbWUgb2YgdGhlIERpc3RyaWJ1dGlvbiwgc3VjaCBhcyBkMTExMTExYWJjZGVmOC5jbG91ZGZyb250Lm5ldC5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgZG9tYWluTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGlzdHJpYnV0aW9uIElEIGZvciB0aGlzIGRpc3RyaWJ1dGlvbi5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgZGlzdHJpYnV0aW9uSWQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIEJvdW5kT3JpZ2luIGV4dGVuZHMgT3JpZ2luQmluZE9wdGlvbnMsIE9yaWdpbkJpbmRDb25maWcge1xuICByZWFkb25seSBvcmlnaW46IElPcmlnaW47XG4gIHJlYWRvbmx5IG9yaWdpbkdyb3VwSWQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBEaXN0cmlidXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEaXN0cmlidXRpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdCBiZWhhdmlvciBmb3IgdGhlIGRpc3RyaWJ1dGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGRlZmF1bHRCZWhhdmlvcjogQmVoYXZpb3JPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIGJlaGF2aW9ycyBmb3IgdGhlIGRpc3RyaWJ1dGlvbiwgbWFwcGVkIGJ5IHRoZSBwYXRoUGF0dGVybiB0aGF0IHNwZWNpZmllcyB3aGljaCByZXF1ZXN0cyB0byBhcHBseSB0aGUgYmVoYXZpb3IgdG8uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYWRkaXRpb25hbCBiZWhhdmlvcnMgYXJlIGFkZGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgYWRkaXRpb25hbEJlaGF2aW9ycz86IFJlY29yZDxzdHJpbmcsIEJlaGF2aW9yT3B0aW9ucz47XG5cbiAgLyoqXG4gICAqIEEgY2VydGlmaWNhdGUgdG8gYXNzb2NpYXRlIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi4gVGhlIGNlcnRpZmljYXRlIG11c3QgYmUgbG9jYXRlZCBpbiBOLiBWaXJnaW5pYSAodXMtZWFzdC0xKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgQ2xvdWRGcm9udCB3aWxkY2FyZCBjZXJ0aWZpY2F0ZSAoKi5jbG91ZGZyb250Lm5ldCkgd2lsbCBiZSB1c2VkLlxuICAgKi9cbiAgcmVhZG9ubHkgY2VydGlmaWNhdGU/OiBhY20uSUNlcnRpZmljYXRlO1xuXG4gIC8qKlxuICAgKiBBbnkgY29tbWVudHMgeW91IHdhbnQgdG8gaW5jbHVkZSBhYm91dCB0aGUgZGlzdHJpYnV0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGNvbW1lbnRcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1lbnQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBvYmplY3QgdGhhdCB5b3Ugd2FudCBDbG91ZEZyb250IHRvIHJlcXVlc3QgZnJvbSB5b3VyIG9yaWdpbiAoZm9yIGV4YW1wbGUsIGluZGV4Lmh0bWwpXG4gICAqIHdoZW4gYSB2aWV3ZXIgcmVxdWVzdHMgdGhlIHJvb3QgVVJMIGZvciB5b3VyIGRpc3RyaWJ1dGlvbi4gSWYgbm8gZGVmYXVsdCBvYmplY3QgaXMgc2V0LCB0aGVcbiAgICogcmVxdWVzdCBnb2VzIHRvIHRoZSBvcmlnaW4ncyByb290IChlLmcuLCBleGFtcGxlLmNvbS8pLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGRlZmF1bHQgcm9vdCBvYmplY3RcbiAgICovXG4gIHJlYWRvbmx5IGRlZmF1bHRSb290T2JqZWN0Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBbHRlcm5hdGl2ZSBkb21haW4gbmFtZXMgZm9yIHRoaXMgZGlzdHJpYnV0aW9uLlxuICAgKlxuICAgKiBJZiB5b3Ugd2FudCB0byB1c2UgeW91ciBvd24gZG9tYWluIG5hbWUsIHN1Y2ggYXMgd3d3LmV4YW1wbGUuY29tLCBpbnN0ZWFkIG9mIHRoZSBjbG91ZGZyb250Lm5ldCBkb21haW4gbmFtZSxcbiAgICogeW91IGNhbiBhZGQgYW4gYWx0ZXJuYXRlIGRvbWFpbiBuYW1lIHRvIHlvdXIgZGlzdHJpYnV0aW9uLiBJZiB5b3UgYXR0YWNoIGEgY2VydGlmaWNhdGUgdG8gdGhlIGRpc3RyaWJ1dGlvbixcbiAgICogeW91IG11c3QgYWRkIChhdCBsZWFzdCBvbmUgb2YpIHRoZSBkb21haW4gbmFtZXMgb2YgdGhlIGNlcnRpZmljYXRlIHRvIHRoaXMgbGlzdC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgZGlzdHJpYnV0aW9uIHdpbGwgb25seSBzdXBwb3J0IHRoZSBkZWZhdWx0IGdlbmVyYXRlZCBuYW1lIChlLmcuLCBkMTExMTExYWJjZGVmOC5jbG91ZGZyb250Lm5ldClcbiAgICovXG4gIHJlYWRvbmx5IGRvbWFpbk5hbWVzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEVuYWJsZSBvciBkaXNhYmxlIHRoZSBkaXN0cmlidXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIENsb3VkRnJvbnQgd2lsbCByZXNwb25kIHRvIElQdjYgRE5TIHJlcXVlc3RzIHdpdGggYW4gSVB2NiBhZGRyZXNzLlxuICAgKlxuICAgKiBJZiB5b3Ugc3BlY2lmeSBmYWxzZSwgQ2xvdWRGcm9udCByZXNwb25kcyB0byBJUHY2IEROUyByZXF1ZXN0cyB3aXRoIHRoZSBETlMgcmVzcG9uc2UgY29kZSBOT0VSUk9SIGFuZCB3aXRoIG5vIElQIGFkZHJlc3Nlcy5cbiAgICogVGhpcyBhbGxvd3Mgdmlld2VycyB0byBzdWJtaXQgYSBzZWNvbmQgcmVxdWVzdCwgZm9yIGFuIElQdjQgYWRkcmVzcyBmb3IgeW91ciBkaXN0cmlidXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZUlwdjY/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBFbmFibGUgYWNjZXNzIGxvZ2dpbmcgZm9yIHRoZSBkaXN0cmlidXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2UsIHVubGVzcyBgbG9nQnVja2V0YCBpcyBzcGVjaWZpZWQuXG4gICAqL1xuICByZWFkb25seSBlbmFibGVMb2dnaW5nPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQ29udHJvbHMgdGhlIGNvdW50cmllcyBpbiB3aGljaCB5b3VyIGNvbnRlbnQgaXMgZGlzdHJpYnV0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZ2VvZ3JhcGhpYyByZXN0cmljdGlvbnNcbiAgICovXG4gIHJlYWRvbmx5IGdlb1Jlc3RyaWN0aW9uPzogR2VvUmVzdHJpY3Rpb247XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIG1heGltdW0gSFRUUCB2ZXJzaW9uIHRoYXQgeW91IHdhbnQgdmlld2VycyB0byB1c2UgdG8gY29tbXVuaWNhdGUgd2l0aCBDbG91ZEZyb250LlxuICAgKlxuICAgKiBGb3Igdmlld2VycyBhbmQgQ2xvdWRGcm9udCB0byB1c2UgSFRUUC8yLCB2aWV3ZXJzIG11c3Qgc3VwcG9ydCBUTFMgMS4yIG9yIGxhdGVyLCBhbmQgbXVzdCBzdXBwb3J0IHNlcnZlciBuYW1lIGlkZW50aWZpY2F0aW9uIChTTkkpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBIdHRwVmVyc2lvbi5IVFRQMlxuICAgKi9cbiAgcmVhZG9ubHkgaHR0cFZlcnNpb24/OiBIdHRwVmVyc2lvbjtcblxuICAvKipcbiAgICogVGhlIEFtYXpvbiBTMyBidWNrZXQgdG8gc3RvcmUgdGhlIGFjY2VzcyBsb2dzIGluLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgYnVja2V0IGlzIGNyZWF0ZWQgaWYgYGVuYWJsZUxvZ2dpbmdgIGlzIHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGxvZ0J1Y2tldD86IHMzLklCdWNrZXQ7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHlvdSB3YW50IENsb3VkRnJvbnQgdG8gaW5jbHVkZSBjb29raWVzIGluIGFjY2VzcyBsb2dzXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBsb2dJbmNsdWRlc0Nvb2tpZXM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBzdHJpbmcgdGhhdCB5b3Ugd2FudCBDbG91ZEZyb250IHRvIHByZWZpeCB0byB0aGUgYWNjZXNzIGxvZyBmaWxlbmFtZXMgZm9yIHRoaXMgZGlzdHJpYnV0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHByZWZpeFxuICAgKi9cbiAgcmVhZG9ubHkgbG9nRmlsZVByZWZpeD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHByaWNlIGNsYXNzIHRoYXQgY29ycmVzcG9uZHMgd2l0aCB0aGUgbWF4aW11bSBwcmljZSB0aGF0IHlvdSB3YW50IHRvIHBheSBmb3IgQ2xvdWRGcm9udCBzZXJ2aWNlLlxuICAgKiBJZiB5b3Ugc3BlY2lmeSBQcmljZUNsYXNzX0FsbCwgQ2xvdWRGcm9udCByZXNwb25kcyB0byByZXF1ZXN0cyBmb3IgeW91ciBvYmplY3RzIGZyb20gYWxsIENsb3VkRnJvbnQgZWRnZSBsb2NhdGlvbnMuXG4gICAqIElmIHlvdSBzcGVjaWZ5IGEgcHJpY2UgY2xhc3Mgb3RoZXIgdGhhbiBQcmljZUNsYXNzX0FsbCwgQ2xvdWRGcm9udCBzZXJ2ZXMgeW91ciBvYmplY3RzIGZyb20gdGhlIENsb3VkRnJvbnQgZWRnZSBsb2NhdGlvblxuICAgKiB0aGF0IGhhcyB0aGUgbG93ZXN0IGxhdGVuY3kgYW1vbmcgdGhlIGVkZ2UgbG9jYXRpb25zIGluIHlvdXIgcHJpY2UgY2xhc3MuXG4gICAqXG4gICAqIEBkZWZhdWx0IFByaWNlQ2xhc3MuUFJJQ0VfQ0xBU1NfQUxMXG4gICAqL1xuICByZWFkb25seSBwcmljZUNsYXNzPzogUHJpY2VDbGFzcztcblxuICAvKipcbiAgICogVW5pcXVlIGlkZW50aWZpZXIgdGhhdCBzcGVjaWZpZXMgdGhlIEFXUyBXQUYgd2ViIEFDTCB0byBhc3NvY2lhdGUgd2l0aCB0aGlzIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uLlxuICAgKlxuICAgKiBUbyBzcGVjaWZ5IGEgd2ViIEFDTCBjcmVhdGVkIHVzaW5nIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBBV1MgV0FGLCB1c2UgdGhlIEFDTCBBUk4sIGZvciBleGFtcGxlXG4gICAqIGBhcm46YXdzOndhZnYyOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6Z2xvYmFsL3dlYmFjbC9FeGFtcGxlV2ViQUNMLzQ3M2U2NGZkLWYzMGItNDc2NS04MWEwLTYyYWQ5NmRkMTY3YWAuXG4gICAqIFRvIHNwZWNpZnkgYSB3ZWIgQUNMIGNyZWF0ZWQgdXNpbmcgQVdTIFdBRiBDbGFzc2ljLCB1c2UgdGhlIEFDTCBJRCwgZm9yIGV4YW1wbGUgYDQ3M2U2NGZkLWYzMGItNDc2NS04MWEwLTYyYWQ5NmRkMTY3YWAuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3dhZi9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvd2hhdC1pcy1hd3Mtd2FmLmh0bWxcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2xvdWRmcm9udC9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9DcmVhdGVEaXN0cmlidXRpb24uaHRtbCNBUElfQ3JlYXRlRGlzdHJpYnV0aW9uX1JlcXVlc3RQYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIEFXUyBXZWIgQXBwbGljYXRpb24gRmlyZXdhbGwgd2ViIGFjY2VzcyBjb250cm9sIGxpc3QgKHdlYiBBQ0wpLlxuICAgKi9cbiAgcmVhZG9ubHkgd2ViQWNsSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEhvdyBDbG91ZEZyb250IHNob3VsZCBoYW5kbGUgcmVxdWVzdHMgdGhhdCBhcmUgbm90IHN1Y2Nlc3NmdWwgKGUuZy4sIFBhZ2VOb3RGb3VuZCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gY3VzdG9tIGVycm9yIHJlc3BvbnNlcy5cbiAgICovXG4gIHJlYWRvbmx5IGVycm9yUmVzcG9uc2VzPzogRXJyb3JSZXNwb25zZVtdO1xuXG4gIC8qKlxuICAgICogVGhlIG1pbmltdW0gdmVyc2lvbiBvZiB0aGUgU1NMIHByb3RvY29sIHRoYXQgeW91IHdhbnQgQ2xvdWRGcm9udCB0byB1c2UgZm9yIEhUVFBTIGNvbm5lY3Rpb25zLlxuICAgICpcbiAgICAqIENsb3VkRnJvbnQgc2VydmVzIHlvdXIgb2JqZWN0cyBvbmx5IHRvIGJyb3dzZXJzIG9yIGRldmljZXMgdGhhdCBzdXBwb3J0IGF0XG4gICAgKiBsZWFzdCB0aGUgU1NMIHZlcnNpb24gdGhhdCB5b3Ugc3BlY2lmeS5cbiAgICAqXG4gICAgKiBAZGVmYXVsdCAtIFNlY3VyaXR5UG9saWN5UHJvdG9jb2wuVExTX1YxXzJfMjAyMSBpZiB0aGUgJ0Bhd3MtY2RrL2F3cy1jbG91ZGZyb250OmRlZmF1bHRTZWN1cml0eVBvbGljeVRMU3YxLjJfMjAyMScgZmVhdHVyZSBmbGFnIGlzIHNldDsgb3RoZXJ3aXNlLCBTZWN1cml0eVBvbGljeVByb3RvY29sLlRMU19WMV8yXzIwMTkuXG4gICAgKi9cbiAgcmVhZG9ubHkgbWluaW11bVByb3RvY29sVmVyc2lvbj86IFNlY3VyaXR5UG9saWN5UHJvdG9jb2w7XG5cbiAgLyoqXG4gICAgKiBUaGUgU1NMIG1ldGhvZCBDbG91ZEZyb250IHdpbGwgdXNlIGZvciB5b3VyIGRpc3RyaWJ1dGlvbi5cbiAgICAqXG4gICAgKiBTZXJ2ZXIgTmFtZSBJbmRpY2F0aW9uIChTTkkpIC0gaXMgYW4gZXh0ZW5zaW9uIHRvIHRoZSBUTFMgY29tcHV0ZXIgbmV0d29ya2luZyBwcm90b2NvbCBieSB3aGljaCBhIGNsaWVudCBpbmRpY2F0ZXNcbiAgICAqIHdoaWNoIGhvc3RuYW1lIGl0IGlzIGF0dGVtcHRpbmcgdG8gY29ubmVjdCB0byBhdCB0aGUgc3RhcnQgb2YgdGhlIGhhbmRzaGFraW5nIHByb2Nlc3MuIFRoaXMgYWxsb3dzIGEgc2VydmVyIHRvIHByZXNlbnRcbiAgICAqIG11bHRpcGxlIGNlcnRpZmljYXRlcyBvbiB0aGUgc2FtZSBJUCBhZGRyZXNzIGFuZCBUQ1AgcG9ydCBudW1iZXIgYW5kIGhlbmNlIGFsbG93cyBtdWx0aXBsZSBzZWN1cmUgKEhUVFBTKSB3ZWJzaXRlc1xuICAgICogKG9yIGFueSBvdGhlciBzZXJ2aWNlIG92ZXIgVExTKSB0byBiZSBzZXJ2ZWQgYnkgdGhlIHNhbWUgSVAgYWRkcmVzcyB3aXRob3V0IHJlcXVpcmluZyBhbGwgdGhvc2Ugc2l0ZXMgdG8gdXNlIHRoZSBzYW1lIGNlcnRpZmljYXRlLlxuICAgICpcbiAgICAqIENsb3VkRnJvbnQgY2FuIHVzZSBTTkkgdG8gaG9zdCBtdWx0aXBsZSBkaXN0cmlidXRpb25zIG9uIHRoZSBzYW1lIElQIC0gd2hpY2ggYSBsYXJnZSBtYWpvcml0eSBvZiBjbGllbnRzIHdpbGwgc3VwcG9ydC5cbiAgICAqXG4gICAgKiBJZiB5b3VyIGNsaWVudHMgY2Fubm90IHN1cHBvcnQgU05JIGhvd2V2ZXIgLSBDbG91ZEZyb250IGNhbiB1c2UgZGVkaWNhdGVkIElQcyBmb3IgeW91ciBkaXN0cmlidXRpb24gLSBidXQgdGhlcmUgaXMgYSBwcm9yYXRlZCBtb250aGx5IGNoYXJnZSBmb3JcbiAgICAqIHVzaW5nIHRoaXMgZmVhdHVyZS4gQnkgZGVmYXVsdCwgd2UgdXNlIFNOSSAtIGJ1dCB5b3UgY2FuIG9wdGlvbmFsbHkgZW5hYmxlIGRlZGljYXRlZCBJUHMgKFZJUCkuXG4gICAgKlxuICAgICogU2VlIHRoZSBDbG91ZEZyb250IFNTTCBmb3IgbW9yZSBkZXRhaWxzIGFib3V0IHByaWNpbmcgOiBodHRwczovL2F3cy5hbWF6b24uY29tL2Nsb3VkZnJvbnQvY3VzdG9tLXNzbC1kb21haW5zL1xuICAgICpcbiAgICAqIEBkZWZhdWx0IFNTTE1ldGhvZC5TTklcbiAgICAqL1xuICByZWFkb25seSBzc2xTdXBwb3J0TWV0aG9kPzogU1NMTWV0aG9kO1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGcm9udCBkaXN0cmlidXRpb24gd2l0aCBhc3NvY2lhdGVkIG9yaWdpbihzKSBhbmQgY2FjaGluZyBiZWhhdmlvcihzKS5cbiAqL1xuZXhwb3J0IGNsYXNzIERpc3RyaWJ1dGlvbiBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSURpc3RyaWJ1dGlvbiB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBEaXN0cmlidXRpb24gY29uc3RydWN0IHRoYXQgcmVwcmVzZW50cyBhbiBleHRlcm5hbCAoaW1wb3J0ZWQpIGRpc3RyaWJ1dGlvbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbURpc3RyaWJ1dGlvbkF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IERpc3RyaWJ1dGlvbkF0dHJpYnV0ZXMpOiBJRGlzdHJpYnV0aW9uIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJRGlzdHJpYnV0aW9uIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBkb21haW5OYW1lOiBzdHJpbmc7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZGlzdHJpYnV0aW9uRG9tYWluTmFtZTogc3RyaW5nO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGRpc3RyaWJ1dGlvbklkOiBzdHJpbmc7XG5cbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgICAgICB0aGlzLmRvbWFpbk5hbWUgPSBhdHRycy5kb21haW5OYW1lO1xuICAgICAgICB0aGlzLmRpc3RyaWJ1dGlvbkRvbWFpbk5hbWUgPSBhdHRycy5kb21haW5OYW1lO1xuICAgICAgICB0aGlzLmRpc3RyaWJ1dGlvbklkID0gYXR0cnMuZGlzdHJpYnV0aW9uSWQ7XG4gICAgICB9XG5cbiAgICAgIHB1YmxpYyBncmFudChncmFudGVlOiBpYW0uSUdyYW50YWJsZSwgLi4uYWN0aW9uczogc3RyaW5nW10pOiBpYW0uR3JhbnQge1xuICAgICAgICByZXR1cm4gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHsgZ3JhbnRlZSwgYWN0aW9ucywgcmVzb3VyY2VBcm5zOiBbZm9ybWF0RGlzdHJpYnV0aW9uQXJuKHRoaXMpXSB9KTtcbiAgICAgIH1cbiAgICAgIHB1YmxpYyBncmFudENyZWF0ZUludmFsaWRhdGlvbihncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdyYW50KGdyYW50ZWUsICdjbG91ZGZyb250OkNyZWF0ZUludmFsaWRhdGlvbicpO1xuICAgICAgfVxuICAgIH0oKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBkb21haW5OYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBkaXN0cmlidXRpb25Eb21haW5OYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBkaXN0cmlidXRpb25JZDogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZGVmYXVsdEJlaGF2aW9yOiBDYWNoZUJlaGF2aW9yO1xuICBwcml2YXRlIHJlYWRvbmx5IGFkZGl0aW9uYWxCZWhhdmlvcnM6IENhY2hlQmVoYXZpb3JbXSA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IGJvdW5kT3JpZ2luczogQm91bmRPcmlnaW5bXSA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IG9yaWdpbkdyb3VwczogQ2ZuRGlzdHJpYnV0aW9uLk9yaWdpbkdyb3VwUHJvcGVydHlbXSA9IFtdO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZXJyb3JSZXNwb25zZXM6IEVycm9yUmVzcG9uc2VbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBjZXJ0aWZpY2F0ZT86IGFjbS5JQ2VydGlmaWNhdGU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IERpc3RyaWJ1dGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGlmIChwcm9wcy5jZXJ0aWZpY2F0ZSkge1xuICAgICAgY29uc3QgY2VydGlmaWNhdGVSZWdpb24gPSBTdGFjay5vZih0aGlzKS5zcGxpdEFybihwcm9wcy5jZXJ0aWZpY2F0ZS5jZXJ0aWZpY2F0ZUFybiwgQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUpLnJlZ2lvbjtcbiAgICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKGNlcnRpZmljYXRlUmVnaW9uKSAmJiBjZXJ0aWZpY2F0ZVJlZ2lvbiAhPT0gJ3VzLWVhc3QtMScpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEaXN0cmlidXRpb24gY2VydGlmaWNhdGVzIG11c3QgYmUgaW4gdGhlIHVzLWVhc3QtMSByZWdpb24gYW5kIHRoZSBjZXJ0aWZpY2F0ZSB5b3UgcHJvdmlkZWQgaXMgaW4gJHtjZXJ0aWZpY2F0ZVJlZ2lvbn0uYCk7XG4gICAgICB9XG5cbiAgICAgIGlmICgocHJvcHMuZG9tYWluTmFtZXMgPz8gW10pLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ011c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgZG9tYWluIG5hbWUgdG8gdXNlIGEgY2VydGlmaWNhdGUgd2l0aCBhIGRpc3RyaWJ1dGlvbicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG9yaWdpbklkID0gdGhpcy5hZGRPcmlnaW4ocHJvcHMuZGVmYXVsdEJlaGF2aW9yLm9yaWdpbik7XG4gICAgdGhpcy5kZWZhdWx0QmVoYXZpb3IgPSBuZXcgQ2FjaGVCZWhhdmlvcihvcmlnaW5JZCwgeyBwYXRoUGF0dGVybjogJyonLCAuLi5wcm9wcy5kZWZhdWx0QmVoYXZpb3IgfSk7XG4gICAgaWYgKHByb3BzLmFkZGl0aW9uYWxCZWhhdmlvcnMpIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKHByb3BzLmFkZGl0aW9uYWxCZWhhdmlvcnMpLmZvckVhY2goKFtwYXRoUGF0dGVybiwgYmVoYXZpb3JPcHRpb25zXSkgPT4ge1xuICAgICAgICB0aGlzLmFkZEJlaGF2aW9yKHBhdGhQYXR0ZXJuLCBiZWhhdmlvck9wdGlvbnMub3JpZ2luLCBiZWhhdmlvck9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5jZXJ0aWZpY2F0ZSA9IHByb3BzLmNlcnRpZmljYXRlO1xuICAgIHRoaXMuZXJyb3JSZXNwb25zZXMgPSBwcm9wcy5lcnJvclJlc3BvbnNlcyA/PyBbXTtcblxuICAgIC8vIENvbW1lbnRzIGhhdmUgYW4gdW5kb2N1bWVudGVkIGxpbWl0IG9mIDEyOCBjaGFyYWN0ZXJzXG4gICAgY29uc3QgdHJpbW1lZENvbW1lbnQgPVxuICAgICAgcHJvcHMuY29tbWVudCAmJiBwcm9wcy5jb21tZW50Lmxlbmd0aCA+IDEyOFxuICAgICAgICA/IGAke3Byb3BzLmNvbW1lbnQuc2xpY2UoMCwgMTI4IC0gMyl9Li4uYFxuICAgICAgICA6IHByb3BzLmNvbW1lbnQ7XG5cbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgQ2ZuRGlzdHJpYnV0aW9uKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGRpc3RyaWJ1dGlvbkNvbmZpZzoge1xuICAgICAgICBlbmFibGVkOiBwcm9wcy5lbmFibGVkID8/IHRydWUsXG4gICAgICAgIG9yaWdpbnM6IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5yZW5kZXJPcmlnaW5zKCkgfSksXG4gICAgICAgIG9yaWdpbkdyb3VwczogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLnJlbmRlck9yaWdpbkdyb3VwcygpIH0pLFxuICAgICAgICBkZWZhdWx0Q2FjaGVCZWhhdmlvcjogdGhpcy5kZWZhdWx0QmVoYXZpb3IuX3JlbmRlckJlaGF2aW9yKCksXG4gICAgICAgIGFsaWFzZXM6IHByb3BzLmRvbWFpbk5hbWVzLFxuICAgICAgICBjYWNoZUJlaGF2aW9yczogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLnJlbmRlckNhY2hlQmVoYXZpb3JzKCkgfSksXG4gICAgICAgIGNvbW1lbnQ6IHRyaW1tZWRDb21tZW50LFxuICAgICAgICBjdXN0b21FcnJvclJlc3BvbnNlczogdGhpcy5yZW5kZXJFcnJvclJlc3BvbnNlcygpLFxuICAgICAgICBkZWZhdWx0Um9vdE9iamVjdDogcHJvcHMuZGVmYXVsdFJvb3RPYmplY3QsXG4gICAgICAgIGh0dHBWZXJzaW9uOiBwcm9wcy5odHRwVmVyc2lvbiA/PyBIdHRwVmVyc2lvbi5IVFRQMixcbiAgICAgICAgaXB2NkVuYWJsZWQ6IHByb3BzLmVuYWJsZUlwdjYgPz8gdHJ1ZSxcbiAgICAgICAgbG9nZ2luZzogdGhpcy5yZW5kZXJMb2dnaW5nKHByb3BzKSxcbiAgICAgICAgcHJpY2VDbGFzczogcHJvcHMucHJpY2VDbGFzcyA/PyB1bmRlZmluZWQsXG4gICAgICAgIHJlc3RyaWN0aW9uczogdGhpcy5yZW5kZXJSZXN0cmljdGlvbnMocHJvcHMuZ2VvUmVzdHJpY3Rpb24pLFxuICAgICAgICB2aWV3ZXJDZXJ0aWZpY2F0ZTogdGhpcy5jZXJ0aWZpY2F0ZSA/IHRoaXMucmVuZGVyVmlld2VyQ2VydGlmaWNhdGUodGhpcy5jZXJ0aWZpY2F0ZSxcbiAgICAgICAgICBwcm9wcy5taW5pbXVtUHJvdG9jb2xWZXJzaW9uLCBwcm9wcy5zc2xTdXBwb3J0TWV0aG9kKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgd2ViQWNsSWQ6IHByb3BzLndlYkFjbElkLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuZG9tYWluTmFtZSA9IGRpc3RyaWJ1dGlvbi5hdHRyRG9tYWluTmFtZTtcbiAgICB0aGlzLmRpc3RyaWJ1dGlvbkRvbWFpbk5hbWUgPSBkaXN0cmlidXRpb24uYXR0ckRvbWFpbk5hbWU7XG4gICAgdGhpcy5kaXN0cmlidXRpb25JZCA9IGRpc3RyaWJ1dGlvbi5yZWY7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG5ldyBiZWhhdmlvciB0byB0aGlzIGRpc3RyaWJ1dGlvbiBmb3IgdGhlIGdpdmVuIHBhdGhQYXR0ZXJuLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0aFBhdHRlcm4gdGhlIHBhdGggcGF0dGVybiAoZS5nLiwgJ2ltYWdlcy8qJykgdGhhdCBzcGVjaWZpZXMgd2hpY2ggcmVxdWVzdHMgdG8gYXBwbHkgdGhlIGJlaGF2aW9yIHRvLlxuICAgKiBAcGFyYW0gb3JpZ2luIHRoZSBvcmlnaW4gdG8gdXNlIGZvciB0aGlzIGJlaGF2aW9yXG4gICAqIEBwYXJhbSBiZWhhdmlvck9wdGlvbnMgdGhlIG9wdGlvbnMgZm9yIHRoZSBiZWhhdmlvciBhdCB0aGlzIHBhdGguXG4gICAqL1xuICBwdWJsaWMgYWRkQmVoYXZpb3IocGF0aFBhdHRlcm46IHN0cmluZywgb3JpZ2luOiBJT3JpZ2luLCBiZWhhdmlvck9wdGlvbnM6IEFkZEJlaGF2aW9yT3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKHBhdGhQYXR0ZXJuID09PSAnKicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSB0aGUgZGVmYXVsdCBiZWhhdmlvciBjYW4gaGF2ZSBhIHBhdGggcGF0dGVybiBvZiBcXCcqXFwnJyk7XG4gICAgfVxuICAgIGNvbnN0IG9yaWdpbklkID0gdGhpcy5hZGRPcmlnaW4ob3JpZ2luKTtcbiAgICB0aGlzLmFkZGl0aW9uYWxCZWhhdmlvcnMucHVzaChuZXcgQ2FjaGVCZWhhdmlvcihvcmlnaW5JZCwgeyBwYXRoUGF0dGVybiwgLi4uYmVoYXZpb3JPcHRpb25zIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIElBTSBwb2xpY3kgc3RhdGVtZW50IGFzc29jaWF0ZWQgd2l0aCB0aGlzIGRpc3RyaWJ1dGlvbiB0byBhbiBJQU1cbiAgICogcHJpbmNpcGFsJ3MgcG9saWN5LlxuICAgKlxuICAgKiBAcGFyYW0gaWRlbnRpdHkgVGhlIHByaW5jaXBhbFxuICAgKiBAcGFyYW0gYWN0aW9ucyBUaGUgc2V0IG9mIGFjdGlvbnMgdG8gYWxsb3cgKGkuZS4gXCJjbG91ZGZyb250Okxpc3RJbnZhbGlkYXRpb25zXCIpXG4gICAqL1xuICBwdWJsaWMgZ3JhbnQoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlLCAuLi5hY3Rpb25zOiBzdHJpbmdbXSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7IGdyYW50ZWU6IGlkZW50aXR5LCBhY3Rpb25zLCByZXNvdXJjZUFybnM6IFtmb3JtYXREaXN0cmlidXRpb25Bcm4odGhpcyldIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHRvIGNyZWF0ZSBpbnZhbGlkYXRpb25zIGZvciB0aGlzIGJ1Y2tldCB0byBhbiBJQU0gcHJpbmNpcGFsIChSb2xlL0dyb3VwL1VzZXIpLlxuICAgKlxuICAgKiBAcGFyYW0gaWRlbnRpdHkgVGhlIHByaW5jaXBhbFxuICAgKi9cbiAgcHVibGljIGdyYW50Q3JlYXRlSW52YWxpZGF0aW9uKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbnQoaWRlbnRpdHksICdjbG91ZGZyb250OkNyZWF0ZUludmFsaWRhdGlvbicpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRPcmlnaW4ob3JpZ2luOiBJT3JpZ2luLCBpc0ZhaWxvdmVyT3JpZ2luOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xuICAgIGNvbnN0IE9SSUdJTl9JRF9NQVhfTEVOR1RIID0gMTI4O1xuXG4gICAgY29uc3QgZXhpc3RpbmdPcmlnaW4gPSB0aGlzLmJvdW5kT3JpZ2lucy5maW5kKGJvdW5kT3JpZ2luID0+IGJvdW5kT3JpZ2luLm9yaWdpbiA9PT0gb3JpZ2luKTtcbiAgICBpZiAoZXhpc3RpbmdPcmlnaW4pIHtcbiAgICAgIHJldHVybiBleGlzdGluZ09yaWdpbi5vcmlnaW5Hcm91cElkID8/IGV4aXN0aW5nT3JpZ2luLm9yaWdpbklkO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBvcmlnaW5JbmRleCA9IHRoaXMuYm91bmRPcmlnaW5zLmxlbmd0aCArIDE7XG4gICAgICBjb25zdCBzY29wZSA9IG5ldyBDb25zdHJ1Y3QodGhpcywgYE9yaWdpbiR7b3JpZ2luSW5kZXh9YCk7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRJZCA9IE5hbWVzLnVuaXF1ZUlkKHNjb3BlKS5zbGljZSgtT1JJR0lOX0lEX01BWF9MRU5HVEgpO1xuICAgICAgY29uc3Qgb3JpZ2luQmluZENvbmZpZyA9IG9yaWdpbi5iaW5kKHNjb3BlLCB7IG9yaWdpbklkOiBnZW5lcmF0ZWRJZCB9KTtcbiAgICAgIGNvbnN0IG9yaWdpbklkID0gb3JpZ2luQmluZENvbmZpZy5vcmlnaW5Qcm9wZXJ0eT8uaWQgPz8gZ2VuZXJhdGVkSWQ7XG4gICAgICBjb25zdCBkdXBsaWNhdGVJZCA9IHRoaXMuYm91bmRPcmlnaW5zLmZpbmQoYm91bmRPcmlnaW4gPT4gYm91bmRPcmlnaW4ub3JpZ2luUHJvcGVydHk/LmlkID09PSBvcmlnaW5CaW5kQ29uZmlnLm9yaWdpblByb3BlcnR5Py5pZCk7XG4gICAgICBpZiAoZHVwbGljYXRlSWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBPcmlnaW4gd2l0aCBpZCAke2R1cGxpY2F0ZUlkLm9yaWdpblByb3BlcnR5Py5pZH0gYWxyZWFkeSBleGlzdHMuIE9yaWdpbklkcyBtdXN0IGJlIHVuaXF1ZSB3aXRoaW4gYSBkaXN0cmlidXRpb25gKTtcbiAgICAgIH1cbiAgICAgIGlmICghb3JpZ2luQmluZENvbmZpZy5mYWlsb3ZlckNvbmZpZykge1xuICAgICAgICB0aGlzLmJvdW5kT3JpZ2lucy5wdXNoKHsgb3JpZ2luLCBvcmlnaW5JZCwgLi4ub3JpZ2luQmluZENvbmZpZyB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpc0ZhaWxvdmVyT3JpZ2luKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbiBPcmlnaW4gY2Fubm90IHVzZSBhbiBPcmlnaW4gd2l0aCBpdHMgb3duIGZhaWxvdmVyIGNvbmZpZ3VyYXRpb24gYXMgaXRzIGZhbGxiYWNrIG9yaWdpbiEnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBncm91cEluZGV4ID0gdGhpcy5vcmlnaW5Hcm91cHMubGVuZ3RoICsgMTtcbiAgICAgICAgY29uc3Qgb3JpZ2luR3JvdXBJZCA9IE5hbWVzLnVuaXF1ZUlkKG5ldyBDb25zdHJ1Y3QodGhpcywgYE9yaWdpbkdyb3VwJHtncm91cEluZGV4fWApKS5zbGljZSgtT1JJR0lOX0lEX01BWF9MRU5HVEgpO1xuICAgICAgICB0aGlzLmJvdW5kT3JpZ2lucy5wdXNoKHsgb3JpZ2luLCBvcmlnaW5JZCwgb3JpZ2luR3JvdXBJZCwgLi4ub3JpZ2luQmluZENvbmZpZyB9KTtcblxuICAgICAgICBjb25zdCBmYWlsb3Zlck9yaWdpbklkID0gdGhpcy5hZGRPcmlnaW4ob3JpZ2luQmluZENvbmZpZy5mYWlsb3ZlckNvbmZpZy5mYWlsb3Zlck9yaWdpbiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkT3JpZ2luR3JvdXAob3JpZ2luR3JvdXBJZCwgb3JpZ2luQmluZENvbmZpZy5mYWlsb3ZlckNvbmZpZy5zdGF0dXNDb2Rlcywgb3JpZ2luSWQsIGZhaWxvdmVyT3JpZ2luSWQpO1xuICAgICAgICByZXR1cm4gb3JpZ2luR3JvdXBJZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcmlnaW5CaW5kQ29uZmlnLm9yaWdpblByb3BlcnR5Py5pZCA/PyBvcmlnaW5JZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZE9yaWdpbkdyb3VwKG9yaWdpbkdyb3VwSWQ6IHN0cmluZywgc3RhdHVzQ29kZXM6IG51bWJlcltdIHwgdW5kZWZpbmVkLCBvcmlnaW5JZDogc3RyaW5nLCBmYWlsb3Zlck9yaWdpbklkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBzdGF0dXNDb2RlcyA9IHN0YXR1c0NvZGVzID8/IFs1MDAsIDUwMiwgNTAzLCA1MDRdO1xuICAgIGlmIChzdGF0dXNDb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZmFsbGJhY2tTdGF0dXNDb2RlcyBjYW5ub3QgYmUgZW1wdHknKTtcbiAgICB9XG4gICAgdGhpcy5vcmlnaW5Hcm91cHMucHVzaCh7XG4gICAgICBmYWlsb3ZlckNyaXRlcmlhOiB7XG4gICAgICAgIHN0YXR1c0NvZGVzOiB7XG4gICAgICAgICAgaXRlbXM6IHN0YXR1c0NvZGVzLFxuICAgICAgICAgIHF1YW50aXR5OiBzdGF0dXNDb2Rlcy5sZW5ndGgsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgaWQ6IG9yaWdpbkdyb3VwSWQsXG4gICAgICBtZW1iZXJzOiB7XG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgeyBvcmlnaW5JZCB9LFxuICAgICAgICAgIHsgb3JpZ2luSWQ6IGZhaWxvdmVyT3JpZ2luSWQgfSxcbiAgICAgICAgXSxcbiAgICAgICAgcXVhbnRpdHk6IDIsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJPcmlnaW5zKCk6IENmbkRpc3RyaWJ1dGlvbi5PcmlnaW5Qcm9wZXJ0eVtdIHtcbiAgICBjb25zdCByZW5kZXJlZE9yaWdpbnM6IENmbkRpc3RyaWJ1dGlvbi5PcmlnaW5Qcm9wZXJ0eVtdID0gW107XG4gICAgdGhpcy5ib3VuZE9yaWdpbnMuZm9yRWFjaChib3VuZE9yaWdpbiA9PiB7XG4gICAgICBpZiAoYm91bmRPcmlnaW4ub3JpZ2luUHJvcGVydHkpIHtcbiAgICAgICAgcmVuZGVyZWRPcmlnaW5zLnB1c2goYm91bmRPcmlnaW4ub3JpZ2luUHJvcGVydHkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZW5kZXJlZE9yaWdpbnM7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlck9yaWdpbkdyb3VwcygpOiBDZm5EaXN0cmlidXRpb24uT3JpZ2luR3JvdXBzUHJvcGVydHkgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLm9yaWdpbkdyb3Vwcy5sZW5ndGggPT09IDBcbiAgICAgID8gdW5kZWZpbmVkXG4gICAgICA6IHtcbiAgICAgICAgaXRlbXM6IHRoaXMub3JpZ2luR3JvdXBzLFxuICAgICAgICBxdWFudGl0eTogdGhpcy5vcmlnaW5Hcm91cHMubGVuZ3RoLFxuICAgICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQ2FjaGVCZWhhdmlvcnMoKTogQ2ZuRGlzdHJpYnV0aW9uLkNhY2hlQmVoYXZpb3JQcm9wZXJ0eVtdIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy5hZGRpdGlvbmFsQmVoYXZpb3JzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gICAgcmV0dXJuIHRoaXMuYWRkaXRpb25hbEJlaGF2aW9ycy5tYXAoYmVoYXZpb3IgPT4gYmVoYXZpb3IuX3JlbmRlckJlaGF2aW9yKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJFcnJvclJlc3BvbnNlcygpOiBDZm5EaXN0cmlidXRpb24uQ3VzdG9tRXJyb3JSZXNwb25zZVByb3BlcnR5W10gfCB1bmRlZmluZWQge1xuICAgIGlmICh0aGlzLmVycm9yUmVzcG9uc2VzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG5cbiAgICByZXR1cm4gdGhpcy5lcnJvclJlc3BvbnNlcy5tYXAoZXJyb3JDb25maWcgPT4ge1xuICAgICAgaWYgKCFlcnJvckNvbmZpZy5yZXNwb25zZUh0dHBTdGF0dXMgJiYgIWVycm9yQ29uZmlnLnR0bCAmJiAhZXJyb3JDb25maWcucmVzcG9uc2VQYWdlUGF0aCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgY3VzdG9tIGVycm9yIHJlc3BvbnNlIHdpdGhvdXQgZWl0aGVyIGEgXFwncmVzcG9uc2VIdHRwU3RhdHVzXFwnLCBcXCd0dGxcXCcgb3IgXFwncmVzcG9uc2VQYWdlUGF0aFxcJyBpcyBub3QgdmFsaWQuJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVycm9yQ2FjaGluZ01pblR0bDogZXJyb3JDb25maWcudHRsPy50b1NlY29uZHMoKSxcbiAgICAgICAgZXJyb3JDb2RlOiBlcnJvckNvbmZpZy5odHRwU3RhdHVzLFxuICAgICAgICByZXNwb25zZUNvZGU6IGVycm9yQ29uZmlnLnJlc3BvbnNlUGFnZVBhdGhcbiAgICAgICAgICA/IGVycm9yQ29uZmlnLnJlc3BvbnNlSHR0cFN0YXR1cyA/PyBlcnJvckNvbmZpZy5odHRwU3RhdHVzXG4gICAgICAgICAgOiBlcnJvckNvbmZpZy5yZXNwb25zZUh0dHBTdGF0dXMsXG4gICAgICAgIHJlc3BvbnNlUGFnZVBhdGg6IGVycm9yQ29uZmlnLnJlc3BvbnNlUGFnZVBhdGgsXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJMb2dnaW5nKHByb3BzOiBEaXN0cmlidXRpb25Qcm9wcyk6IENmbkRpc3RyaWJ1dGlvbi5Mb2dnaW5nUHJvcGVydHkgfCB1bmRlZmluZWQge1xuICAgIGlmICghcHJvcHMuZW5hYmxlTG9nZ2luZyAmJiAhcHJvcHMubG9nQnVja2V0KSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICBpZiAocHJvcHMuZW5hYmxlTG9nZ2luZyA9PT0gZmFsc2UgJiYgcHJvcHMubG9nQnVja2V0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGxpY2l0bHkgZGlzYWJsZWQgbG9nZ2luZyBidXQgcHJvdmlkZWQgYSBsb2dnaW5nIGJ1Y2tldC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBidWNrZXQgPSBwcm9wcy5sb2dCdWNrZXQgPz8gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnTG9nZ2luZ0J1Y2tldCcsIHtcbiAgICAgIGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uUzNfTUFOQUdFRCxcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgYnVja2V0OiBidWNrZXQuYnVja2V0UmVnaW9uYWxEb21haW5OYW1lLFxuICAgICAgaW5jbHVkZUNvb2tpZXM6IHByb3BzLmxvZ0luY2x1ZGVzQ29va2llcyxcbiAgICAgIHByZWZpeDogcHJvcHMubG9nRmlsZVByZWZpeCxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJSZXN0cmljdGlvbnMoZ2VvUmVzdHJpY3Rpb24/OiBHZW9SZXN0cmljdGlvbikge1xuICAgIHJldHVybiBnZW9SZXN0cmljdGlvbiA/IHtcbiAgICAgIGdlb1Jlc3RyaWN0aW9uOiB7XG4gICAgICAgIHJlc3RyaWN0aW9uVHlwZTogZ2VvUmVzdHJpY3Rpb24ucmVzdHJpY3Rpb25UeXBlLFxuICAgICAgICBsb2NhdGlvbnM6IGdlb1Jlc3RyaWN0aW9uLmxvY2F0aW9ucyxcbiAgICAgIH0sXG4gICAgfSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyVmlld2VyQ2VydGlmaWNhdGUoY2VydGlmaWNhdGU6IGFjbS5JQ2VydGlmaWNhdGUsXG4gICAgbWluaW11bVByb3RvY29sVmVyc2lvblByb3A/OiBTZWN1cml0eVBvbGljeVByb3RvY29sLCBzc2xTdXBwb3J0TWV0aG9kUHJvcD86IFNTTE1ldGhvZCk6IENmbkRpc3RyaWJ1dGlvbi5WaWV3ZXJDZXJ0aWZpY2F0ZVByb3BlcnR5IHtcblxuICAgIGNvbnN0IGRlZmF1bHRWZXJzaW9uID0gRmVhdHVyZUZsYWdzLm9mKHRoaXMpLmlzRW5hYmxlZChDTE9VREZST05UX0RFRkFVTFRfU0VDVVJJVFlfUE9MSUNZX1RMU19WMV8yXzIwMjEpXG4gICAgICA/IFNlY3VyaXR5UG9saWN5UHJvdG9jb2wuVExTX1YxXzJfMjAyMSA6IFNlY3VyaXR5UG9saWN5UHJvdG9jb2wuVExTX1YxXzJfMjAxOTtcbiAgICBjb25zdCBtaW5pbXVtUHJvdG9jb2xWZXJzaW9uID0gbWluaW11bVByb3RvY29sVmVyc2lvblByb3AgPz8gZGVmYXVsdFZlcnNpb247XG4gICAgY29uc3Qgc3NsU3VwcG9ydE1ldGhvZCA9IHNzbFN1cHBvcnRNZXRob2RQcm9wID8/IFNTTE1ldGhvZC5TTkk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWNtQ2VydGlmaWNhdGVBcm46IGNlcnRpZmljYXRlLmNlcnRpZmljYXRlQXJuLFxuICAgICAgbWluaW11bVByb3RvY29sVmVyc2lvbjogbWluaW11bVByb3RvY29sVmVyc2lvbixcbiAgICAgIHNzbFN1cHBvcnRNZXRob2Q6IHNzbFN1cHBvcnRNZXRob2QsXG4gICAgfTtcbiAgfVxufVxuXG4vKiogTWF4aW11bSBIVFRQIHZlcnNpb24gdG8gc3VwcG9ydCAqL1xuZXhwb3J0IGVudW0gSHR0cFZlcnNpb24ge1xuICAvKiogSFRUUCAxLjEgKi9cbiAgSFRUUDFfMSA9ICdodHRwMS4xJyxcbiAgLyoqIEhUVFAgMiAqL1xuICBIVFRQMiA9ICdodHRwMicsXG4gIC8qKiBIVFRQIDIgYW5kIEhUVFAgMyAqL1xuICBIVFRQMl9BTkRfMyA9ICdodHRwMmFuZDMnLFxuICAvKiogSFRUUCAzICovXG4gIEhUVFAzID0gJ2h0dHAzJ1xufVxuXG4vKipcbiAqIFRoZSBwcmljZSBjbGFzcyBkZXRlcm1pbmVzIGhvdyBtYW55IGVkZ2UgbG9jYXRpb25zIENsb3VkRnJvbnQgd2lsbCB1c2UgZm9yIHlvdXIgZGlzdHJpYnV0aW9uLlxuICogU2VlIGh0dHBzOi8vYXdzLmFtYXpvbi5jb20vY2xvdWRmcm9udC9wcmljaW5nLyBmb3IgZnVsbCBsaXN0IG9mIHN1cHBvcnRlZCByZWdpb25zLlxuICovXG5leHBvcnQgZW51bSBQcmljZUNsYXNzIHtcbiAgLyoqIFVTQSwgQ2FuYWRhLCBFdXJvcGUsICYgSXNyYWVsICovXG4gIFBSSUNFX0NMQVNTXzEwMCA9ICdQcmljZUNsYXNzXzEwMCcsXG4gIC8qKiBQUklDRV9DTEFTU18xMDAgKyBTb3V0aCBBZnJpY2EsIEtlbnlhLCBNaWRkbGUgRWFzdCwgSmFwYW4sIFNpbmdhcG9yZSwgU291dGggS29yZWEsIFRhaXdhbiwgSG9uZyBLb25nLCAmIFBoaWxpcHBpbmVzICovXG4gIFBSSUNFX0NMQVNTXzIwMCA9ICdQcmljZUNsYXNzXzIwMCcsXG4gIC8qKiBBbGwgbG9jYXRpb25zICovXG4gIFBSSUNFX0NMQVNTX0FMTCA9ICdQcmljZUNsYXNzX0FsbCdcbn1cblxuLyoqXG4gKiBIb3cgSFRUUHMgc2hvdWxkIGJlIGhhbmRsZWQgd2l0aCB5b3VyIGRpc3RyaWJ1dGlvbi5cbiAqL1xuZXhwb3J0IGVudW0gVmlld2VyUHJvdG9jb2xQb2xpY3kge1xuICAvKiogSFRUUFMgb25seSAqL1xuICBIVFRQU19PTkxZID0gJ2h0dHBzLW9ubHknLFxuICAvKiogV2lsbCByZWRpcmVjdCBIVFRQIHJlcXVlc3RzIHRvIEhUVFBTICovXG4gIFJFRElSRUNUX1RPX0hUVFBTID0gJ3JlZGlyZWN0LXRvLWh0dHBzJyxcbiAgLyoqIEJvdGggSFRUUCBhbmQgSFRUUFMgc3VwcG9ydGVkICovXG4gIEFMTE9XX0FMTCA9ICdhbGxvdy1hbGwnXG59XG5cbi8qKlxuICogRGVmaW5lcyB3aGF0IHByb3RvY29scyBDbG91ZEZyb250IHdpbGwgdXNlIHRvIGNvbm5lY3QgdG8gYW4gb3JpZ2luLlxuICovXG5leHBvcnQgZW51bSBPcmlnaW5Qcm90b2NvbFBvbGljeSB7XG4gIC8qKiBDb25uZWN0IG9uIEhUVFAgb25seSAqL1xuICBIVFRQX09OTFkgPSAnaHR0cC1vbmx5JyxcbiAgLyoqIENvbm5lY3Qgd2l0aCB0aGUgc2FtZSBwcm90b2NvbCBhcyB0aGUgdmlld2VyICovXG4gIE1BVENIX1ZJRVdFUiA9ICdtYXRjaC12aWV3ZXInLFxuICAvKiogQ29ubmVjdCBvbiBIVFRQUyBvbmx5ICovXG4gIEhUVFBTX09OTFkgPSAnaHR0cHMtb25seScsXG59XG5cbi8qKlxuICogVGhlIFNTTCBtZXRob2QgQ2xvdWRGcm9udCB3aWxsIHVzZSBmb3IgeW91ciBkaXN0cmlidXRpb24uXG4gKlxuICogU2VydmVyIE5hbWUgSW5kaWNhdGlvbiAoU05JKSAtIGlzIGFuIGV4dGVuc2lvbiB0byB0aGUgVExTIGNvbXB1dGVyIG5ldHdvcmtpbmcgcHJvdG9jb2wgYnkgd2hpY2ggYSBjbGllbnQgaW5kaWNhdGVzXG4gKiAgd2hpY2ggaG9zdG5hbWUgaXQgaXMgYXR0ZW1wdGluZyB0byBjb25uZWN0IHRvIGF0IHRoZSBzdGFydCBvZiB0aGUgaGFuZHNoYWtpbmcgcHJvY2Vzcy4gVGhpcyBhbGxvd3MgYSBzZXJ2ZXIgdG8gcHJlc2VudFxuICogIG11bHRpcGxlIGNlcnRpZmljYXRlcyBvbiB0aGUgc2FtZSBJUCBhZGRyZXNzIGFuZCBUQ1AgcG9ydCBudW1iZXIgYW5kIGhlbmNlIGFsbG93cyBtdWx0aXBsZSBzZWN1cmUgKEhUVFBTKSB3ZWJzaXRlc1xuICogKG9yIGFueSBvdGhlciBzZXJ2aWNlIG92ZXIgVExTKSB0byBiZSBzZXJ2ZWQgYnkgdGhlIHNhbWUgSVAgYWRkcmVzcyB3aXRob3V0IHJlcXVpcmluZyBhbGwgdGhvc2Ugc2l0ZXMgdG8gdXNlIHRoZSBzYW1lIGNlcnRpZmljYXRlLlxuICpcbiAqIENsb3VkRnJvbnQgY2FuIHVzZSBTTkkgdG8gaG9zdCBtdWx0aXBsZSBkaXN0cmlidXRpb25zIG9uIHRoZSBzYW1lIElQIC0gd2hpY2ggYSBsYXJnZSBtYWpvcml0eSBvZiBjbGllbnRzIHdpbGwgc3VwcG9ydC5cbiAqXG4gKiBJZiB5b3VyIGNsaWVudHMgY2Fubm90IHN1cHBvcnQgU05JIGhvd2V2ZXIgLSBDbG91ZEZyb250IGNhbiB1c2UgZGVkaWNhdGVkIElQcyBmb3IgeW91ciBkaXN0cmlidXRpb24gLSBidXQgdGhlcmUgaXMgYSBwcm9yYXRlZCBtb250aGx5IGNoYXJnZSBmb3JcbiAqIHVzaW5nIHRoaXMgZmVhdHVyZS4gQnkgZGVmYXVsdCwgd2UgdXNlIFNOSSAtIGJ1dCB5b3UgY2FuIG9wdGlvbmFsbHkgZW5hYmxlIGRlZGljYXRlZCBJUHMgKFZJUCkuXG4gKlxuICogU2VlIHRoZSBDbG91ZEZyb250IFNTTCBmb3IgbW9yZSBkZXRhaWxzIGFib3V0IHByaWNpbmcgOiBodHRwczovL2F3cy5hbWF6b24uY29tL2Nsb3VkZnJvbnQvY3VzdG9tLXNzbC1kb21haW5zL1xuICpcbiAqL1xuZXhwb3J0IGVudW0gU1NMTWV0aG9kIHtcbiAgU05JID0gJ3NuaS1vbmx5JyxcbiAgVklQID0gJ3ZpcCdcbn1cblxuLyoqXG4gKiBUaGUgbWluaW11bSB2ZXJzaW9uIG9mIHRoZSBTU0wgcHJvdG9jb2wgdGhhdCB5b3Ugd2FudCBDbG91ZEZyb250IHRvIHVzZSBmb3IgSFRUUFMgY29ubmVjdGlvbnMuXG4gKiBDbG91ZEZyb250IHNlcnZlcyB5b3VyIG9iamVjdHMgb25seSB0byBicm93c2VycyBvciBkZXZpY2VzIHRoYXQgc3VwcG9ydCBhdCBsZWFzdCB0aGUgU1NMIHZlcnNpb24gdGhhdCB5b3Ugc3BlY2lmeS5cbiAqL1xuZXhwb3J0IGVudW0gU2VjdXJpdHlQb2xpY3lQcm90b2NvbCB7XG4gIFNTTF9WMyA9ICdTU0x2MycsXG4gIFRMU19WMSA9ICdUTFN2MScsXG4gIFRMU19WMV8yMDE2ID0gJ1RMU3YxXzIwMTYnLFxuICBUTFNfVjFfMV8yMDE2ID0gJ1RMU3YxLjFfMjAxNicsXG4gIFRMU19WMV8yXzIwMTggPSAnVExTdjEuMl8yMDE4JyxcbiAgVExTX1YxXzJfMjAxOSA9ICdUTFN2MS4yXzIwMTknLFxuICBUTFNfVjFfMl8yMDIxID0gJ1RMU3YxLjJfMjAyMSdcbn1cblxuLyoqXG4gKiBUaGUgSFRUUCBtZXRob2RzIHRoYXQgdGhlIEJlaGF2aW9yIHdpbGwgYWNjZXB0IHJlcXVlc3RzIG9uLlxuICovXG5leHBvcnQgY2xhc3MgQWxsb3dlZE1ldGhvZHMge1xuICAvKiogSEVBRCBhbmQgR0VUICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQUxMT1dfR0VUX0hFQUQgPSBuZXcgQWxsb3dlZE1ldGhvZHMoWydHRVQnLCAnSEVBRCddKTtcbiAgLyoqIEhFQUQsIEdFVCwgYW5kIE9QVElPTlMgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBTExPV19HRVRfSEVBRF9PUFRJT05TID0gbmV3IEFsbG93ZWRNZXRob2RzKFsnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUyddKTtcbiAgLyoqIEFsbCBzdXBwb3J0ZWQgSFRUUCBtZXRob2RzICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQUxMT1dfQUxMID0gbmV3IEFsbG93ZWRNZXRob2RzKFsnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQVVQnLCAnUEFUQ0gnLCAnUE9TVCcsICdERUxFVEUnXSk7XG5cbiAgLyoqIEhUVFAgbWV0aG9kcyBzdXBwb3J0ZWQgKi9cbiAgcHVibGljIHJlYWRvbmx5IG1ldGhvZHM6IHN0cmluZ1tdO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IobWV0aG9kczogc3RyaW5nW10pIHsgdGhpcy5tZXRob2RzID0gbWV0aG9kczsgfVxufVxuXG4vKipcbiAqIFRoZSBIVFRQIG1ldGhvZHMgdGhhdCB0aGUgQmVoYXZpb3Igd2lsbCBjYWNoZSByZXF1ZXN0cyBvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIENhY2hlZE1ldGhvZHMge1xuICAvKiogSEVBRCBhbmQgR0VUICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0FDSEVfR0VUX0hFQUQgPSBuZXcgQ2FjaGVkTWV0aG9kcyhbJ0dFVCcsICdIRUFEJ10pO1xuICAvKiogSEVBRCwgR0VULCBhbmQgT1BUSU9OUyAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENBQ0hFX0dFVF9IRUFEX09QVElPTlMgPSBuZXcgQ2FjaGVkTWV0aG9kcyhbJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnXSk7XG5cbiAgLyoqIEhUVFAgbWV0aG9kcyBzdXBwb3J0ZWQgKi9cbiAgcHVibGljIHJlYWRvbmx5IG1ldGhvZHM6IHN0cmluZ1tdO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IobWV0aG9kczogc3RyaW5nW10pIHsgdGhpcy5tZXRob2RzID0gbWV0aG9kczsgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGNvbmZpZ3VyaW5nIGN1c3RvbSBlcnJvciByZXNwb25zZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXJyb3JSZXNwb25zZSB7XG4gIC8qKlxuICAgKiBUaGUgbWluaW11bSBhbW91bnQgb2YgdGltZSwgaW4gc2Vjb25kcywgdGhhdCB5b3Ugd2FudCBDbG91ZEZyb250IHRvIGNhY2hlIHRoZSBIVFRQIHN0YXR1cyBjb2RlIHNwZWNpZmllZCBpbiBFcnJvckNvZGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIGRlZmF1bHQgY2FjaGluZyBUVEwgYmVoYXZpb3IgYXBwbGllc1xuICAgKi9cbiAgcmVhZG9ubHkgdHRsPzogRHVyYXRpb247XG4gIC8qKlxuICAgKiBUaGUgSFRUUCBzdGF0dXMgY29kZSBmb3Igd2hpY2ggeW91IHdhbnQgdG8gc3BlY2lmeSBhIGN1c3RvbSBlcnJvciBwYWdlIGFuZC9vciBhIGNhY2hpbmcgZHVyYXRpb24uXG4gICAqL1xuICByZWFkb25seSBodHRwU3RhdHVzOiBudW1iZXI7XG4gIC8qKlxuICAgKiBUaGUgSFRUUCBzdGF0dXMgY29kZSB0aGF0IHlvdSB3YW50IENsb3VkRnJvbnQgdG8gcmV0dXJuIHRvIHRoZSB2aWV3ZXIgYWxvbmcgd2l0aCB0aGUgY3VzdG9tIGVycm9yIHBhZ2UuXG4gICAqXG4gICAqIElmIHlvdSBzcGVjaWZ5IGEgdmFsdWUgZm9yIGByZXNwb25zZUh0dHBTdGF0dXNgLCB5b3UgbXVzdCBhbHNvIHNwZWNpZnkgYSB2YWx1ZSBmb3IgYHJlc3BvbnNlUGFnZVBhdGhgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBlcnJvciBjb2RlIHdpbGwgYmUgcmV0dXJuZWQgYXMgdGhlIHJlc3BvbnNlIGNvZGUuXG4gICAqL1xuICByZWFkb25seSByZXNwb25zZUh0dHBTdGF0dXM/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgY3VzdG9tIGVycm9yIHBhZ2UgdGhhdCB5b3Ugd2FudCBDbG91ZEZyb250IHRvIHJldHVybiB0byBhIHZpZXdlciB3aGVuIHlvdXIgb3JpZ2luIHJldHVybnMgdGhlXG4gICAqIGBodHRwU3RhdHVzYCwgZm9yIGV4YW1wbGUsIC80eHgtZXJyb3JzLzQwMy1mb3JiaWRkZW4uaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBkZWZhdWx0IENsb3VkRnJvbnQgcmVzcG9uc2UgaXMgc2hvd24uXG4gICAqL1xuICByZWFkb25seSByZXNwb25zZVBhZ2VQYXRoPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSB0eXBlIG9mIGV2ZW50cyB0aGF0IGEgTGFtYmRhQEVkZ2UgZnVuY3Rpb24gY2FuIGJlIGludm9rZWQgaW4gcmVzcG9uc2UgdG8uXG4gKi9cbmV4cG9ydCBlbnVtIExhbWJkYUVkZ2VFdmVudFR5cGUge1xuICAvKipcbiAgICogVGhlIG9yaWdpbi1yZXF1ZXN0IHNwZWNpZmllcyB0aGUgcmVxdWVzdCB0byB0aGVcbiAgICogb3JpZ2luIGxvY2F0aW9uIChlLmcuIFMzKVxuICAgKi9cbiAgT1JJR0lOX1JFUVVFU1QgPSAnb3JpZ2luLXJlcXVlc3QnLFxuXG4gIC8qKlxuICAgKiBUaGUgb3JpZ2luLXJlc3BvbnNlIHNwZWNpZmllcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGVcbiAgICogb3JpZ2luIGxvY2F0aW9uIChlLmcuIFMzKVxuICAgKi9cbiAgT1JJR0lOX1JFU1BPTlNFID0gJ29yaWdpbi1yZXNwb25zZScsXG5cbiAgLyoqXG4gICAqIFRoZSB2aWV3ZXItcmVxdWVzdCBzcGVjaWZpZXMgdGhlIGluY29taW5nIHJlcXVlc3RcbiAgICovXG4gIFZJRVdFUl9SRVFVRVNUID0gJ3ZpZXdlci1yZXF1ZXN0JyxcblxuICAvKipcbiAgICogVGhlIHZpZXdlci1yZXNwb25zZSBzcGVjaWZpZXMgdGhlIG91dGdvaW5nIHJlc3BvbnNlXG4gICAqL1xuICBWSUVXRVJfUkVTUE9OU0UgPSAndmlld2VyLXJlc3BvbnNlJyxcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgTGFtYmRhIGZ1bmN0aW9uIHZlcnNpb24gYW5kIGV2ZW50IHR5cGUgd2hlbiB1c2luZyBMYW1iZGFARWRnZS5cbiAqIFRoZSB0eXBlIG9mIHRoZSBgQWRkQmVoYXZpb3JPcHRpb25zLmVkZ2VMYW1iZGFzYCBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFZGdlTGFtYmRhIHtcbiAgLyoqXG4gICAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBMYW1iZGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGludm9rZWQuXG4gICAqXG4gICAqICoqTm90ZSoqOiBpdCdzIG5vdCBwb3NzaWJsZSB0byB1c2UgdGhlICckTEFURVNUJyBmdW5jdGlvbiB2ZXJzaW9uIGZvciBMYW1iZGFARWRnZSFcbiAgICovXG4gIHJlYWRvbmx5IGZ1bmN0aW9uVmVyc2lvbjogbGFtYmRhLklWZXJzaW9uO1xuXG4gIC8qKiBUaGUgdHlwZSBvZiBldmVudCBpbiByZXNwb25zZSB0byB3aGljaCBzaG91bGQgdGhlIGZ1bmN0aW9uIGJlIGludm9rZWQuICovXG4gIHJlYWRvbmx5IGV2ZW50VHlwZTogTGFtYmRhRWRnZUV2ZW50VHlwZTtcblxuICAvKipcbiAgICogQWxsb3dzIGEgTGFtYmRhIGZ1bmN0aW9uIHRvIGhhdmUgcmVhZCBhY2Nlc3MgdG8gdGhlIGJvZHkgY29udGVudC5cbiAgICogT25seSB2YWxpZCBmb3IgXCJyZXF1ZXN0XCIgZXZlbnQgdHlwZXMgKGBPUklHSU5fUkVRVUVTVGAgb3IgYFZJRVdFUl9SRVFVRVNUYCkuXG4gICAqIFNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRGcm9udC9sYXRlc3QvRGV2ZWxvcGVyR3VpZGUvbGFtYmRhLWluY2x1ZGUtYm9keS1hY2Nlc3MuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5jbHVkZUJvZHk/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGFkZGluZyBhIG5ldyBiZWhhdmlvciB0byBhIERpc3RyaWJ1dGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBZGRCZWhhdmlvck9wdGlvbnMge1xuICAvKipcbiAgICogSFRUUCBtZXRob2RzIHRvIGFsbG93IGZvciB0aGlzIGJlaGF2aW9yLlxuICAgKlxuICAgKiBAZGVmYXVsdCBBbGxvd2VkTWV0aG9kcy5BTExPV19HRVRfSEVBRFxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dlZE1ldGhvZHM/OiBBbGxvd2VkTWV0aG9kcztcblxuICAvKipcbiAgICogSFRUUCBtZXRob2RzIHRvIGNhY2hlIGZvciB0aGlzIGJlaGF2aW9yLlxuICAgKlxuICAgKiBAZGVmYXVsdCBDYWNoZWRNZXRob2RzLkNBQ0hFX0dFVF9IRUFEXG4gICAqL1xuICByZWFkb25seSBjYWNoZWRNZXRob2RzPzogQ2FjaGVkTWV0aG9kcztcblxuICAvKipcbiAgICogVGhlIGNhY2hlIHBvbGljeSBmb3IgdGhpcyBiZWhhdmlvci4gVGhlIGNhY2hlIHBvbGljeSBkZXRlcm1pbmVzIHdoYXQgdmFsdWVzIGFyZSBpbmNsdWRlZCBpbiB0aGUgY2FjaGUga2V5LFxuICAgKiBhbmQgdGhlIHRpbWUtdG8tbGl2ZSAoVFRMKSB2YWx1ZXMgZm9yIHRoZSBjYWNoZS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRGcm9udC9sYXRlc3QvRGV2ZWxvcGVyR3VpZGUvY29udHJvbGxpbmctdGhlLWNhY2hlLWtleS5odG1sLlxuICAgKiBAZGVmYXVsdCBDYWNoZVBvbGljeS5DQUNISU5HX09QVElNSVpFRFxuICAgKi9cbiAgcmVhZG9ubHkgY2FjaGVQb2xpY3k/OiBJQ2FjaGVQb2xpY3k7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgeW91IHdhbnQgQ2xvdWRGcm9udCB0byBhdXRvbWF0aWNhbGx5IGNvbXByZXNzIGNlcnRhaW4gZmlsZXMgZm9yIHRoaXMgY2FjaGUgYmVoYXZpb3IuXG4gICAqIFNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRGcm9udC9sYXRlc3QvRGV2ZWxvcGVyR3VpZGUvU2VydmluZ0NvbXByZXNzZWRGaWxlcy5odG1sI2NvbXByZXNzZWQtY29udGVudC1jbG91ZGZyb250LWZpbGUtdHlwZXNcbiAgICogZm9yIGZpbGUgdHlwZXMgQ2xvdWRGcm9udCB3aWxsIGNvbXByZXNzLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBjb21wcmVzcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBvcmlnaW4gcmVxdWVzdCBwb2xpY3kgZm9yIHRoaXMgYmVoYXZpb3IuIFRoZSBvcmlnaW4gcmVxdWVzdCBwb2xpY3kgZGV0ZXJtaW5lcyB3aGljaCB2YWx1ZXMgKGUuZy4sIGhlYWRlcnMsIGNvb2tpZXMpXG4gICAqIGFyZSBpbmNsdWRlZCBpbiByZXF1ZXN0cyB0aGF0IENsb3VkRnJvbnQgc2VuZHMgdG8gdGhlIG9yaWdpbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBvcmlnaW5SZXF1ZXN0UG9saWN5PzogSU9yaWdpblJlcXVlc3RQb2xpY3k7XG5cbiAgLyoqXG4gICAqIFRoZSByZXNwb25zZSBoZWFkZXJzIHBvbGljeSBmb3IgdGhpcyBiZWhhdmlvci4gVGhlIHJlc3BvbnNlIGhlYWRlcnMgcG9saWN5IGRldGVybWluZXMgd2hpY2ggaGVhZGVycyBhcmUgaW5jbHVkZWQgaW4gcmVzcG9uc2VzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVzcG9uc2VIZWFkZXJzUG9saWN5PzogSVJlc3BvbnNlSGVhZGVyc1BvbGljeTtcblxuICAvKipcbiAgICogU2V0IHRoaXMgdG8gdHJ1ZSB0byBpbmRpY2F0ZSB5b3Ugd2FudCB0byBkaXN0cmlidXRlIG1lZGlhIGZpbGVzIGluIHRoZSBNaWNyb3NvZnQgU21vb3RoIFN0cmVhbWluZyBmb3JtYXQgdXNpbmcgdGhpcyBiZWhhdmlvci5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHNtb290aFN0cmVhbWluZz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBwcm90b2NvbCB0aGF0IHZpZXdlcnMgY2FuIHVzZSB0byBhY2Nlc3MgdGhlIGZpbGVzIGNvbnRyb2xsZWQgYnkgdGhpcyBiZWhhdmlvci5cbiAgICpcbiAgICogQGRlZmF1bHQgVmlld2VyUHJvdG9jb2xQb2xpY3kuQUxMT1dfQUxMXG4gICAqL1xuICByZWFkb25seSB2aWV3ZXJQcm90b2NvbFBvbGljeT86IFZpZXdlclByb3RvY29sUG9saWN5O1xuXG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRGcm9udCBmdW5jdGlvbnMgdG8gaW52b2tlIGJlZm9yZSBzZXJ2aW5nIHRoZSBjb250ZW50cy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBmdW5jdGlvbnMgd2lsbCBiZSBpbnZva2VkXG4gICAqL1xuICByZWFkb25seSBmdW5jdGlvbkFzc29jaWF0aW9ucz86IEZ1bmN0aW9uQXNzb2NpYXRpb25bXTtcblxuICAvKipcbiAgICogVGhlIExhbWJkYUBFZGdlIGZ1bmN0aW9ucyB0byBpbnZva2UgYmVmb3JlIHNlcnZpbmcgdGhlIGNvbnRlbnRzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIExhbWJkYSBmdW5jdGlvbnMgd2lsbCBiZSBpbnZva2VkXG4gICAqIEBzZWUgaHR0cHM6Ly9hd3MuYW1hem9uLmNvbS9sYW1iZGEvZWRnZVxuICAgKi9cbiAgcmVhZG9ubHkgZWRnZUxhbWJkYXM/OiBFZGdlTGFtYmRhW107XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBLZXkgR3JvdXBzIHRoYXQgQ2xvdWRGcm9udCBjYW4gdXNlIHRvIHZhbGlkYXRlIHNpZ25lZCBVUkxzIG9yIHNpZ25lZCBjb29raWVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIEtleUdyb3VwcyBhcmUgYXNzb2NpYXRlZCB3aXRoIGNhY2hlIGJlaGF2aW9yXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkNsb3VkRnJvbnQvbGF0ZXN0L0RldmVsb3Blckd1aWRlL1ByaXZhdGVDb250ZW50Lmh0bWxcbiAgICovXG4gIHJlYWRvbmx5IHRydXN0ZWRLZXlHcm91cHM/OiBJS2V5R3JvdXBbXTtcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBjcmVhdGluZyBhIG5ldyBiZWhhdmlvci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCZWhhdmlvck9wdGlvbnMgZXh0ZW5kcyBBZGRCZWhhdmlvck9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG9yaWdpbiB0aGF0IHlvdSB3YW50IENsb3VkRnJvbnQgdG8gcm91dGUgcmVxdWVzdHMgdG8gd2hlbiB0aGV5IG1hdGNoIHRoaXMgYmVoYXZpb3IuXG4gICAqL1xuICByZWFkb25seSBvcmlnaW46IElPcmlnaW47XG59XG4iXX0=