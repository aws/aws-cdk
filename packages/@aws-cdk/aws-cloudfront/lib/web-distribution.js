"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudFrontWebDistribution = exports.ViewerCertificate = exports.CloudFrontAllowedCachedMethods = exports.CloudFrontAllowedMethods = exports.OriginSslPolicy = exports.FailoverStatusCode = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const certificatemanager = require("@aws-cdk/aws-certificatemanager");
const iam = require("@aws-cdk/aws-iam");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const cloudfront_generated_1 = require("./cloudfront.generated");
const distribution_1 = require("./distribution");
const utils_1 = require("./private/utils");
/**
 * HTTP status code to failover to second origin
 */
var FailoverStatusCode;
(function (FailoverStatusCode) {
    /**
     * Forbidden (403)
     */
    FailoverStatusCode[FailoverStatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    /**
     * Not found (404)
     */
    FailoverStatusCode[FailoverStatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    /**
     * Internal Server Error (500)
     */
    FailoverStatusCode[FailoverStatusCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    /**
     * Bad Gateway (502)
     */
    FailoverStatusCode[FailoverStatusCode["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    /**
     * Service Unavailable (503)
     */
    FailoverStatusCode[FailoverStatusCode["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    /**
     * Gateway Timeout (504)
     */
    FailoverStatusCode[FailoverStatusCode["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
})(FailoverStatusCode = exports.FailoverStatusCode || (exports.FailoverStatusCode = {}));
var OriginSslPolicy;
(function (OriginSslPolicy) {
    OriginSslPolicy["SSL_V3"] = "SSLv3";
    OriginSslPolicy["TLS_V1"] = "TLSv1";
    OriginSslPolicy["TLS_V1_1"] = "TLSv1.1";
    OriginSslPolicy["TLS_V1_2"] = "TLSv1.2";
})(OriginSslPolicy = exports.OriginSslPolicy || (exports.OriginSslPolicy = {}));
/**
 * An enum for the supported methods to a CloudFront distribution.
 */
var CloudFrontAllowedMethods;
(function (CloudFrontAllowedMethods) {
    CloudFrontAllowedMethods["GET_HEAD"] = "GH";
    CloudFrontAllowedMethods["GET_HEAD_OPTIONS"] = "GHO";
    CloudFrontAllowedMethods["ALL"] = "ALL";
})(CloudFrontAllowedMethods = exports.CloudFrontAllowedMethods || (exports.CloudFrontAllowedMethods = {}));
/**
 * Enums for the methods CloudFront can cache.
 */
var CloudFrontAllowedCachedMethods;
(function (CloudFrontAllowedCachedMethods) {
    CloudFrontAllowedCachedMethods["GET_HEAD"] = "GH";
    CloudFrontAllowedCachedMethods["GET_HEAD_OPTIONS"] = "GHO";
})(CloudFrontAllowedCachedMethods = exports.CloudFrontAllowedCachedMethods || (exports.CloudFrontAllowedCachedMethods = {}));
/**
 * Viewer certificate configuration class
 */
class ViewerCertificate {
    constructor(props, aliases = []) {
        this.props = props;
        this.aliases = aliases;
    }
    /**
     * Generate an AWS Certificate Manager (ACM) viewer certificate configuration
     *
     * @param certificate AWS Certificate Manager (ACM) certificate.
     *                    Your certificate must be located in the us-east-1 (US East (N. Virginia)) region to be accessed by CloudFront
     * @param options certificate configuration options
     */
    static fromAcmCertificate(certificate, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_ViewerCertificateOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromAcmCertificate);
            }
            throw error;
        }
        const { sslMethod: sslSupportMethod = distribution_1.SSLMethod.SNI, securityPolicy: minimumProtocolVersion, aliases, } = options;
        return new ViewerCertificate({
            acmCertificateArn: certificate.certificateArn, sslSupportMethod, minimumProtocolVersion,
        }, aliases);
    }
    /**
     * Generate an IAM viewer certificate configuration
     *
     * @param iamCertificateId Identifier of the IAM certificate
     * @param options certificate configuration options
     */
    static fromIamCertificate(iamCertificateId, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_ViewerCertificateOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromIamCertificate);
            }
            throw error;
        }
        const { sslMethod: sslSupportMethod = distribution_1.SSLMethod.SNI, securityPolicy: minimumProtocolVersion, aliases, } = options;
        return new ViewerCertificate({
            iamCertificateId, sslSupportMethod, minimumProtocolVersion,
        }, aliases);
    }
    /**
     * Generate a viewer certifcate configuration using
     * the CloudFront default certificate (e.g. d111111abcdef8.cloudfront.net)
     * and a `SecurityPolicyProtocol.TLS_V1` security policy.
     *
     * @param aliases Alternative CNAME aliases
     *                You also must create a CNAME record with your DNS service to route queries
     */
    static fromCloudFrontDefaultCertificate(...aliases) {
        return new ViewerCertificate({ cloudFrontDefaultCertificate: true }, aliases);
    }
}
exports.ViewerCertificate = ViewerCertificate;
_a = JSII_RTTI_SYMBOL_1;
ViewerCertificate[_a] = { fqn: "@aws-cdk/aws-cloudfront.ViewerCertificate", version: "0.0.0" };
/**
 * Amazon CloudFront is a global content delivery network (CDN) service that securely delivers data, videos,
 * applications, and APIs to your viewers with low latency and high transfer speeds.
 * CloudFront fronts user provided content and caches it at edge locations across the world.
 *
 * Here's how you can use this construct:
 *
 * ```ts
 * const sourceBucket = new s3.Bucket(this, 'Bucket');
 *
 * const distribution = new cloudfront.CloudFrontWebDistribution(this, 'MyDistribution', {
 *   originConfigs: [
 *     {
 *       s3OriginSource: {
 *       s3BucketSource: sourceBucket,
 *       },
 *       behaviors : [ {isDefaultBehavior: true}],
 *     },
 *   ],
 * });
 * ```
 *
 * This will create a CloudFront distribution that uses your S3Bucket as it's origin.
 *
 * You can customize the distribution using additional properties from the CloudFrontWebDistributionProps interface.
 *
 * @resource AWS::CloudFront::Distribution
 */
class CloudFrontWebDistribution extends cdk.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        /**
         * Maps our methods to the string arrays they are
         */
        this.METHOD_LOOKUP_MAP = {
            GH: ['GET', 'HEAD'],
            GHO: ['GET', 'HEAD', 'OPTIONS'],
            ALL: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
        };
        /**
         * Maps for which SecurityPolicyProtocol are available to which SSLMethods
         */
        this.VALID_SSL_PROTOCOLS = {
            [distribution_1.SSLMethod.SNI]: [
                distribution_1.SecurityPolicyProtocol.TLS_V1, distribution_1.SecurityPolicyProtocol.TLS_V1_1_2016,
                distribution_1.SecurityPolicyProtocol.TLS_V1_2016, distribution_1.SecurityPolicyProtocol.TLS_V1_2_2018,
                distribution_1.SecurityPolicyProtocol.TLS_V1_2_2019, distribution_1.SecurityPolicyProtocol.TLS_V1_2_2021,
            ],
            [distribution_1.SSLMethod.VIP]: [distribution_1.SecurityPolicyProtocol.SSL_V3, distribution_1.SecurityPolicyProtocol.TLS_V1],
        };
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_CloudFrontWebDistributionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CloudFrontWebDistribution);
            }
            throw error;
        }
        // Comments have an undocumented limit of 128 characters
        const trimmedComment = props.comment && props.comment.length > 128
            ? `${props.comment.slice(0, 128 - 3)}...`
            : props.comment;
        const behaviors = [];
        const origins = [];
        const originGroups = [];
        let originIndex = 1;
        for (const originConfig of props.originConfigs) {
            let originId = `origin${originIndex}`;
            const originProperty = this.toOriginProperty(originConfig, originId);
            if (originConfig.failoverCustomOriginSource || originConfig.failoverS3OriginSource) {
                const originSecondaryId = `originSecondary${originIndex}`;
                const originSecondaryProperty = this.toOriginProperty({
                    s3OriginSource: originConfig.failoverS3OriginSource,
                    customOriginSource: originConfig.failoverCustomOriginSource,
                    originPath: originConfig.originPath,
                    originHeaders: originConfig.originHeaders,
                    originShieldRegion: originConfig.originShieldRegion,
                }, originSecondaryId);
                const originGroupsId = `OriginGroup${originIndex}`;
                const failoverCodes = originConfig.failoverCriteriaStatusCodes ?? [500, 502, 503, 504];
                originGroups.push({
                    id: originGroupsId,
                    members: {
                        items: [{ originId }, { originId: originSecondaryId }],
                        quantity: 2,
                    },
                    failoverCriteria: {
                        statusCodes: {
                            items: failoverCodes,
                            quantity: failoverCodes.length,
                        },
                    },
                });
                originId = originGroupsId;
                origins.push(originSecondaryProperty);
            }
            for (const behavior of originConfig.behaviors) {
                behaviors.push({ ...behavior, targetOriginId: originId });
            }
            origins.push(originProperty);
            originIndex++;
        }
        origins.forEach(origin => {
            if (!origin.s3OriginConfig && !origin.customOriginConfig) {
                throw new Error(`Origin ${origin.domainName} is missing either S3OriginConfig or CustomOriginConfig. At least 1 must be specified.`);
            }
        });
        const originGroupsDistConfig = originGroups.length > 0
            ? {
                items: originGroups,
                quantity: originGroups.length,
            }
            : undefined;
        const defaultBehaviors = behaviors.filter(behavior => behavior.isDefaultBehavior);
        if (defaultBehaviors.length !== 1) {
            throw new Error('There can only be one default behavior across all sources. [ One default behavior per distribution ].');
        }
        const otherBehaviors = [];
        for (const behavior of behaviors.filter(b => !b.isDefaultBehavior)) {
            if (!behavior.pathPattern) {
                throw new Error('pathPattern is required for all non-default behaviors');
            }
            otherBehaviors.push(this.toBehavior(behavior, props.viewerProtocolPolicy));
        }
        let distributionConfig = {
            comment: trimmedComment,
            enabled: props.enabled ?? true,
            defaultRootObject: props.defaultRootObject ?? 'index.html',
            httpVersion: props.httpVersion || distribution_1.HttpVersion.HTTP2,
            priceClass: props.priceClass || distribution_1.PriceClass.PRICE_CLASS_100,
            ipv6Enabled: props.enableIpV6 ?? true,
            // eslint-disable-next-line max-len
            customErrorResponses: props.errorConfigurations,
            webAclId: props.webACLId,
            origins,
            originGroups: originGroupsDistConfig,
            defaultCacheBehavior: this.toBehavior(defaultBehaviors[0], props.viewerProtocolPolicy),
            cacheBehaviors: otherBehaviors.length > 0 ? otherBehaviors : undefined,
        };
        if (props.aliasConfiguration && props.viewerCertificate) {
            throw new Error([
                'You cannot set both aliasConfiguration and viewerCertificate properties.',
                'Please only use viewerCertificate, as aliasConfiguration is deprecated.',
            ].join(' '));
        }
        let _viewerCertificate = props.viewerCertificate;
        if (props.aliasConfiguration) {
            const { acmCertRef, securityPolicy, sslMethod, names: aliases } = props.aliasConfiguration;
            _viewerCertificate = ViewerCertificate.fromAcmCertificate(certificatemanager.Certificate.fromCertificateArn(this, 'AliasConfigurationCert', acmCertRef), { securityPolicy, sslMethod, aliases });
        }
        if (_viewerCertificate) {
            const { props: viewerCertificate, aliases } = _viewerCertificate;
            Object.assign(distributionConfig, { aliases, viewerCertificate });
            const { minimumProtocolVersion, sslSupportMethod } = viewerCertificate;
            if (minimumProtocolVersion != null && sslSupportMethod != null) {
                const validProtocols = this.VALID_SSL_PROTOCOLS[sslSupportMethod];
                if (validProtocols.indexOf(minimumProtocolVersion.toString()) === -1) {
                    // eslint-disable-next-line max-len
                    throw new Error(`${minimumProtocolVersion} is not compabtible with sslMethod ${sslSupportMethod}.\n\tValid Protocols are: ${validProtocols.join(', ')}`);
                }
            }
        }
        else {
            distributionConfig = {
                ...distributionConfig,
                viewerCertificate: { cloudFrontDefaultCertificate: true },
            };
        }
        if (props.loggingConfig) {
            this.loggingBucket = props.loggingConfig.bucket || new s3.Bucket(this, 'LoggingBucket', {
                encryption: s3.BucketEncryption.S3_MANAGED,
            });
            distributionConfig = {
                ...distributionConfig,
                logging: {
                    bucket: this.loggingBucket.bucketRegionalDomainName,
                    includeCookies: props.loggingConfig.includeCookies || false,
                    prefix: props.loggingConfig.prefix,
                },
            };
        }
        if (props.geoRestriction) {
            distributionConfig = {
                ...distributionConfig,
                restrictions: {
                    geoRestriction: {
                        restrictionType: props.geoRestriction.restrictionType,
                        locations: props.geoRestriction.locations,
                    },
                },
            };
        }
        const distribution = new cloudfront_generated_1.CfnDistribution(this, 'CFDistribution', { distributionConfig });
        this.node.defaultChild = distribution;
        this.domainName = distribution.attrDomainName;
        this.distributionDomainName = distribution.attrDomainName;
        this.distributionId = distribution.ref;
    }
    /**
     * Creates a construct that represents an external (imported) distribution.
     */
    static fromDistributionAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_CloudFrontWebDistributionAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromDistributionAttributes);
            }
            throw error;
        }
        return new class extends cdk.Resource {
            constructor() {
                super(scope, id);
                this.domainName = attrs.domainName;
                this.distributionDomainName = attrs.domainName;
                this.distributionId = attrs.distributionId;
            }
            grant(grantee, ...actions) {
                return iam.Grant.addToPrincipal({ grantee, actions, resourceArns: [utils_1.formatDistributionArn(this)] });
            }
            grantCreateInvalidation(identity) {
                return this.grant(identity, 'cloudfront:CreateInvalidation');
            }
        }();
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
    toBehavior(input, protoPolicy) {
        let toReturn = {
            allowedMethods: this.METHOD_LOOKUP_MAP[input.allowedMethods || CloudFrontAllowedMethods.GET_HEAD],
            cachedMethods: this.METHOD_LOOKUP_MAP[input.cachedMethods || CloudFrontAllowedCachedMethods.GET_HEAD],
            compress: input.compress !== false,
            defaultTtl: input.defaultTtl && input.defaultTtl.toSeconds(),
            forwardedValues: input.forwardedValues || { queryString: false, cookies: { forward: 'none' } },
            maxTtl: input.maxTtl && input.maxTtl.toSeconds(),
            minTtl: input.minTtl && input.minTtl.toSeconds(),
            trustedKeyGroups: input.trustedKeyGroups?.map(key => key.keyGroupId),
            trustedSigners: input.trustedSigners,
            targetOriginId: input.targetOriginId,
            viewerProtocolPolicy: input.viewerProtocolPolicy || protoPolicy || distribution_1.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        };
        if (!input.isDefaultBehavior) {
            toReturn = Object.assign(toReturn, { pathPattern: input.pathPattern });
        }
        if (input.functionAssociations) {
            toReturn = Object.assign(toReturn, {
                functionAssociations: input.functionAssociations.map(association => ({
                    functionArn: association.function.functionArn,
                    eventType: association.eventType.toString(),
                })),
            });
        }
        if (input.lambdaFunctionAssociations) {
            const includeBodyEventTypes = [distribution_1.LambdaEdgeEventType.ORIGIN_REQUEST, distribution_1.LambdaEdgeEventType.VIEWER_REQUEST];
            if (input.lambdaFunctionAssociations.some(fna => fna.includeBody && !includeBodyEventTypes.includes(fna.eventType))) {
                throw new Error('\'includeBody\' can only be true for ORIGIN_REQUEST or VIEWER_REQUEST event types.');
            }
            toReturn = Object.assign(toReturn, {
                lambdaFunctionAssociations: input.lambdaFunctionAssociations
                    .map(fna => ({
                    eventType: fna.eventType,
                    lambdaFunctionArn: fna.lambdaFunction && fna.lambdaFunction.edgeArn,
                    includeBody: fna.includeBody,
                })),
            });
            // allow edgelambda.amazonaws.com to assume the functions' execution role.
            for (const a of input.lambdaFunctionAssociations) {
                if (a.lambdaFunction.role && iam.Role.isRole(a.lambdaFunction.role) && a.lambdaFunction.role.assumeRolePolicy) {
                    a.lambdaFunction.role.assumeRolePolicy.addStatements(new iam.PolicyStatement({
                        actions: ['sts:AssumeRole'],
                        principals: [new iam.ServicePrincipal('edgelambda.amazonaws.com')],
                    }));
                }
            }
        }
        return toReturn;
    }
    toOriginProperty(originConfig, originId) {
        if (!originConfig.s3OriginSource &&
            !originConfig.customOriginSource) {
            throw new Error('There must be at least one origin source - either an s3OriginSource, a customOriginSource');
        }
        if (originConfig.customOriginSource && originConfig.s3OriginSource) {
            throw new Error('There cannot be both an s3OriginSource and a customOriginSource in the same SourceConfiguration.');
        }
        if ([
            originConfig.originHeaders,
            originConfig.s3OriginSource?.originHeaders,
            originConfig.customOriginSource?.originHeaders,
        ].filter(x => x).length > 1) {
            throw new Error('Only one originHeaders field allowed across origin and failover origins');
        }
        if ([
            originConfig.originPath,
            originConfig.s3OriginSource?.originPath,
            originConfig.customOriginSource?.originPath,
        ].filter(x => x).length > 1) {
            throw new Error('Only one originPath field allowed across origin and failover origins');
        }
        if ([
            originConfig.originShieldRegion,
            originConfig.s3OriginSource?.originShieldRegion,
            originConfig.customOriginSource?.originShieldRegion,
        ].filter(x => x).length > 1) {
            throw new Error('Only one originShieldRegion field allowed across origin and failover origins');
        }
        const headers = originConfig.originHeaders ?? originConfig.s3OriginSource?.originHeaders ?? originConfig.customOriginSource?.originHeaders;
        const originHeaders = [];
        if (headers) {
            Object.keys(headers).forEach((key) => {
                const oHeader = {
                    headerName: key,
                    headerValue: headers[key],
                };
                originHeaders.push(oHeader);
            });
        }
        let s3OriginConfig;
        if (originConfig.s3OriginSource) {
            // first case for backwards compatibility
            if (originConfig.s3OriginSource.originAccessIdentity) {
                // grant CloudFront OriginAccessIdentity read access to S3 bucket
                // Used rather than `grantRead` because `grantRead` will grant overly-permissive policies.
                // Only GetObject is needed to retrieve objects for the distribution.
                // This also excludes KMS permissions; currently, OAI only supports SSE-S3 for buckets.
                // Source: https://aws.amazon.com/blogs/networking-and-content-delivery/serving-sse-kms-encrypted-content-from-s3-using-cloudfront/
                originConfig.s3OriginSource.s3BucketSource.addToResourcePolicy(new iam.PolicyStatement({
                    resources: [originConfig.s3OriginSource.s3BucketSource.arnForObjects('*')],
                    actions: ['s3:GetObject'],
                    principals: [originConfig.s3OriginSource.originAccessIdentity.grantPrincipal],
                }));
                s3OriginConfig = {
                    originAccessIdentity: `origin-access-identity/cloudfront/${originConfig.s3OriginSource.originAccessIdentity.originAccessIdentityId}`,
                };
            }
            else {
                s3OriginConfig = {};
            }
        }
        const connectionAttempts = originConfig.connectionAttempts ?? 3;
        if (connectionAttempts < 1 || 3 < connectionAttempts || !Number.isInteger(connectionAttempts)) {
            throw new Error('connectionAttempts: You can specify 1, 2, or 3 as the number of attempts.');
        }
        const connectionTimeout = (originConfig.connectionTimeout || cdk.Duration.seconds(10)).toSeconds();
        if (connectionTimeout < 1 || 10 < connectionTimeout || !Number.isInteger(connectionTimeout)) {
            throw new Error('connectionTimeout: You can specify a number of seconds between 1 and 10 (inclusive).');
        }
        const originProperty = {
            id: originId,
            domainName: originConfig.s3OriginSource
                ? originConfig.s3OriginSource.s3BucketSource.bucketRegionalDomainName
                : originConfig.customOriginSource.domainName,
            originPath: originConfig.originPath ?? originConfig.customOriginSource?.originPath ?? originConfig.s3OriginSource?.originPath,
            originCustomHeaders: originHeaders.length > 0 ? originHeaders : undefined,
            s3OriginConfig,
            originShield: this.toOriginShieldProperty(originConfig),
            customOriginConfig: originConfig.customOriginSource
                ? {
                    httpPort: originConfig.customOriginSource.httpPort || 80,
                    httpsPort: originConfig.customOriginSource.httpsPort || 443,
                    originKeepaliveTimeout: (originConfig.customOriginSource.originKeepaliveTimeout &&
                        originConfig.customOriginSource.originKeepaliveTimeout.toSeconds()) ||
                        5,
                    originReadTimeout: (originConfig.customOriginSource.originReadTimeout &&
                        originConfig.customOriginSource.originReadTimeout.toSeconds()) ||
                        30,
                    originProtocolPolicy: originConfig.customOriginSource.originProtocolPolicy ||
                        distribution_1.OriginProtocolPolicy.HTTPS_ONLY,
                    originSslProtocols: originConfig.customOriginSource
                        .allowedOriginSSLVersions || [OriginSslPolicy.TLS_V1_2],
                }
                : undefined,
            connectionAttempts,
            connectionTimeout,
        };
        return originProperty;
    }
    /**
     * Takes origin shield region from props and converts to CfnDistribution.OriginShieldProperty
     */
    toOriginShieldProperty(originConfig) {
        const originShieldRegion = originConfig.originShieldRegion ??
            originConfig.customOriginSource?.originShieldRegion ??
            originConfig.s3OriginSource?.originShieldRegion;
        return originShieldRegion
            ? { enabled: true, originShieldRegion }
            : undefined;
    }
}
exports.CloudFrontWebDistribution = CloudFrontWebDistribution;
_b = JSII_RTTI_SYMBOL_1;
CloudFrontWebDistribution[_b] = { fqn: "@aws-cdk/aws-cloudfront.CloudFrontWebDistribution", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLWRpc3RyaWJ1dGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndlYi1kaXN0cmlidXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0VBQXNFO0FBQ3RFLHdDQUF3QztBQUV4QyxzQ0FBc0M7QUFDdEMscUNBQXFDO0FBRXJDLGlFQUF5RDtBQUN6RCxpREFBNEs7QUFLNUssMkNBQXdEO0FBRXhEOztHQUVHO0FBQ0gsSUFBWSxrQkE4Qlg7QUE5QkQsV0FBWSxrQkFBa0I7SUFDNUI7O09BRUc7SUFDSCx1RUFBZSxDQUFBO0lBRWY7O09BRUc7SUFDSCx1RUFBZSxDQUFBO0lBRWY7O09BRUc7SUFDSCwrRkFBMkIsQ0FBQTtJQUUzQjs7T0FFRztJQUNILDJFQUFpQixDQUFBO0lBRWpCOztPQUVHO0lBQ0gsMkZBQXlCLENBQUE7SUFFekI7O09BRUc7SUFDSCxtRkFBcUIsQ0FBQTtBQUN2QixDQUFDLEVBOUJXLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBOEI3QjtBQW1QRCxJQUFZLGVBS1g7QUFMRCxXQUFZLGVBQWU7SUFDekIsbUNBQWdCLENBQUE7SUFDaEIsbUNBQWdCLENBQUE7SUFDaEIsdUNBQW9CLENBQUE7SUFDcEIsdUNBQW9CLENBQUE7QUFDdEIsQ0FBQyxFQUxXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBSzFCO0FBd0NEOztHQUVHO0FBQ0gsSUFBWSx3QkFJWDtBQUpELFdBQVksd0JBQXdCO0lBQ2xDLDJDQUFlLENBQUE7SUFDZixvREFBd0IsQ0FBQTtJQUN4Qix1Q0FBVyxDQUFBO0FBQ2IsQ0FBQyxFQUpXLHdCQUF3QixHQUF4QixnQ0FBd0IsS0FBeEIsZ0NBQXdCLFFBSW5DO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLDhCQUdYO0FBSEQsV0FBWSw4QkFBOEI7SUFDeEMsaURBQWUsQ0FBQTtJQUNmLDBEQUF3QixDQUFBO0FBQzFCLENBQUMsRUFIVyw4QkFBOEIsR0FBOUIsc0NBQThC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QUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLHNCQUFzQjt3QkFDckQsWUFBWSxDQUFDLGtCQUFrQixDQUFDLHNCQUFzQixDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNyRSxDQUFDO29CQUNILGlCQUFpQixFQUNmLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQjt3QkFDaEQsWUFBWSxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNoRSxFQUFFO29CQUNKLG9CQUFvQixFQUNsQixZQUFZLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CO3dCQUNwRCxtQ0FBb0IsQ0FBQyxVQUFVO29CQUNqQyxrQkFBa0IsRUFBRSxZQUFZLENBQUMsa0JBQWtCO3lCQUNoRCx3QkFBd0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7aUJBQzFEO2dCQUNELENBQUMsQ0FBQyxTQUFTO1lBQ2Isa0JBQWtCO1lBQ2xCLGlCQUFpQjtTQUNsQixDQUFDO1FBRUYsT0FBTyxjQUFjLENBQUM7S0FDdkI7SUFFRDs7T0FFRztJQUNLLHNCQUFzQixDQUFDLFlBQXNDO1FBQ25FLE1BQU0sa0JBQWtCLEdBQUcsWUFBWSxDQUFDLGtCQUFrQjtZQUMxRCxZQUFZLENBQUMsa0JBQWtCLEVBQUUsa0JBQWtCO1lBQ25ELFlBQVksQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUM7UUFDaEQsT0FBTyxrQkFBa0I7WUFDdkIsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUN2QyxDQUFDLENBQUMsU0FBUyxDQUFDO0tBQ2Y7O0FBcmNILDhEQXNjQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNlcnRpZmljYXRlbWFuYWdlciBmcm9tICdAYXdzLWNkay9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkRpc3RyaWJ1dGlvbiB9IGZyb20gJy4vY2xvdWRmcm9udC5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSHR0cFZlcnNpb24sIElEaXN0cmlidXRpb24sIExhbWJkYUVkZ2VFdmVudFR5cGUsIE9yaWdpblByb3RvY29sUG9saWN5LCBQcmljZUNsYXNzLCBWaWV3ZXJQcm90b2NvbFBvbGljeSwgU1NMTWV0aG9kLCBTZWN1cml0eVBvbGljeVByb3RvY29sIH0gZnJvbSAnLi9kaXN0cmlidXRpb24nO1xuaW1wb3J0IHsgRnVuY3Rpb25Bc3NvY2lhdGlvbiB9IGZyb20gJy4vZnVuY3Rpb24nO1xuaW1wb3J0IHsgR2VvUmVzdHJpY3Rpb24gfSBmcm9tICcuL2dlby1yZXN0cmljdGlvbic7XG5pbXBvcnQgeyBJS2V5R3JvdXAgfSBmcm9tICcuL2tleS1ncm91cCc7XG5pbXBvcnQgeyBJT3JpZ2luQWNjZXNzSWRlbnRpdHkgfSBmcm9tICcuL29yaWdpbi1hY2Nlc3MtaWRlbnRpdHknO1xuaW1wb3J0IHsgZm9ybWF0RGlzdHJpYnV0aW9uQXJuIH0gZnJvbSAnLi9wcml2YXRlL3V0aWxzJztcblxuLyoqXG4gKiBIVFRQIHN0YXR1cyBjb2RlIHRvIGZhaWxvdmVyIHRvIHNlY29uZCBvcmlnaW5cbiAqL1xuZXhwb3J0IGVudW0gRmFpbG92ZXJTdGF0dXNDb2RlIHtcbiAgLyoqXG4gICAqIEZvcmJpZGRlbiAoNDAzKVxuICAgKi9cbiAgRk9SQklEREVOID0gNDAzLFxuXG4gIC8qKlxuICAgKiBOb3QgZm91bmQgKDQwNClcbiAgICovXG4gIE5PVF9GT1VORCA9IDQwNCxcblxuICAvKipcbiAgICogSW50ZXJuYWwgU2VydmVyIEVycm9yICg1MDApXG4gICAqL1xuICBJTlRFUk5BTF9TRVJWRVJfRVJST1IgPSA1MDAsXG5cbiAgLyoqXG4gICAqIEJhZCBHYXRld2F5ICg1MDIpXG4gICAqL1xuICBCQURfR0FURVdBWSA9IDUwMixcblxuICAvKipcbiAgICogU2VydmljZSBVbmF2YWlsYWJsZSAoNTAzKVxuICAgKi9cbiAgU0VSVklDRV9VTkFWQUlMQUJMRSA9IDUwMyxcblxuICAvKipcbiAgICogR2F0ZXdheSBUaW1lb3V0ICg1MDQpXG4gICAqL1xuICBHQVRFV0FZX1RJTUVPVVQgPSA1MDQsXG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBmb3IgY3VzdG9tIGRvbWFpbiBuYW1lc1xuICpcbiAqIENsb3VkRnJvbnQgY2FuIHVzZSBhIGN1c3RvbSBkb21haW4gdGhhdCB5b3UgcHJvdmlkZSBpbnN0ZWFkIG9mIGFcbiAqIFwiY2xvdWRmcm9udC5uZXRcIiBkb21haW4uIFRvIHVzZSB0aGlzIGZlYXR1cmUgeW91IG11c3QgcHJvdmlkZSB0aGUgbGlzdCBvZlxuICogYWRkaXRpb25hbCBkb21haW5zLCBhbmQgdGhlIEFDTSBDZXJ0aWZpY2F0ZSB0aGF0IENsb3VkRnJvbnQgc2hvdWxkIHVzZSBmb3JcbiAqIHRoZXNlIGFkZGl0aW9uYWwgZG9tYWlucy5cbiAqIEBkZXByZWNhdGVkIHNlZSBgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvblByb3BzI3ZpZXdlckNlcnRpZmljYXRlYCB3aXRoIGBWaWV3ZXJDZXJ0aWZpY2F0ZSNhY21DZXJ0aWZpY2F0ZWBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbGlhc0NvbmZpZ3VyYXRpb24ge1xuICAvKipcbiAgICogQVJOIG9mIGFuIEFXUyBDZXJ0aWZpY2F0ZSBNYW5hZ2VyIChBQ00pIGNlcnRpZmljYXRlLlxuICAgKi9cbiAgcmVhZG9ubHkgYWNtQ2VydFJlZjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEb21haW4gbmFtZXMgb24gdGhlIGNlcnRpZmljYXRlXG4gICAqXG4gICAqIEJvdGggbWFpbiBkb21haW4gbmFtZSBhbmQgU3ViamVjdCBBbHRlcm5hdGl2ZSBOYW1lcy5cbiAgICovXG4gIHJlYWRvbmx5IG5hbWVzOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogSG93IENsb3VkRnJvbnQgc2hvdWxkIHNlcnZlIEhUVFBTIHJlcXVlc3RzLlxuICAgKlxuICAgKiBTZWUgdGhlIG5vdGVzIG9uIFNTTE1ldGhvZCBpZiB5b3Ugd2lzaCB0byB1c2Ugb3RoZXIgU1NMIHRlcm1pbmF0aW9uIHR5cGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTU0xNZXRob2QuU05JXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nsb3VkZnJvbnQvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfVmlld2VyQ2VydGlmaWNhdGUuaHRtbFxuICAgKi9cbiAgcmVhZG9ubHkgc3NsTWV0aG9kPzogU1NMTWV0aG9kO1xuXG4gIC8qKlxuICAgKiBUaGUgbWluaW11bSB2ZXJzaW9uIG9mIHRoZSBTU0wgcHJvdG9jb2wgdGhhdCB5b3Ugd2FudCBDbG91ZEZyb250IHRvIHVzZSBmb3IgSFRUUFMgY29ubmVjdGlvbnMuXG4gICAqXG4gICAqIENsb3VkRnJvbnQgc2VydmVzIHlvdXIgb2JqZWN0cyBvbmx5IHRvIGJyb3dzZXJzIG9yIGRldmljZXMgdGhhdCBzdXBwb3J0IGF0XG4gICAqIGxlYXN0IHRoZSBTU0wgdmVyc2lvbiB0aGF0IHlvdSBzcGVjaWZ5LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFNTTHYzIGlmIHNzbE1ldGhvZCBWSVAsIFRMU3YxIGlmIHNzbE1ldGhvZCBTTklcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5UG9saWN5PzogU2VjdXJpdHlQb2xpY3lQcm90b2NvbDtcbn1cblxuLyoqXG4gKiBMb2dnaW5nIGNvbmZpZ3VyYXRpb24gZm9yIGluY29taW5nIHJlcXVlc3RzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTG9nZ2luZ0NvbmZpZ3VyYXRpb24ge1xuICAvKipcbiAgICogQnVja2V0IHRvIGxvZyByZXF1ZXN0cyB0b1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgbG9nZ2luZyBidWNrZXQgaXMgYXV0b21hdGljYWxseSBjcmVhdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0PzogczMuSUJ1Y2tldCxcblxuICAvKipcbiAgICogV2hldGhlciB0byBpbmNsdWRlIHRoZSBjb29raWVzIGluIHRoZSBsb2dzXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBpbmNsdWRlQ29va2llcz86IGJvb2xlYW4sXG5cbiAgLyoqXG4gICAqIFdoZXJlIGluIHRoZSBidWNrZXQgdG8gc3RvcmUgbG9nc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHByZWZpeC5cbiAgICovXG4gIHJlYWRvbmx5IHByZWZpeD86IHN0cmluZ1xufVxuXG4vLyBTdWJzZXQgb2YgU291cmNlQ29uZmlndXJhdGlvbiBmb3IgcmVuZGVyaW5nIHByb3BlcnRpZXMgaW50ZXJuYWxseVxuaW50ZXJmYWNlIFNvdXJjZUNvbmZpZ3VyYXRpb25SZW5kZXIge1xuICByZWFkb25seSBjb25uZWN0aW9uQXR0ZW1wdHM/OiBudW1iZXI7XG4gIHJlYWRvbmx5IGNvbm5lY3Rpb25UaW1lb3V0PzogY2RrLkR1cmF0aW9uO1xuICByZWFkb25seSBzM09yaWdpblNvdXJjZT86IFMzT3JpZ2luQ29uZmlnO1xuICByZWFkb25seSBjdXN0b21PcmlnaW5Tb3VyY2U/OiBDdXN0b21PcmlnaW5Db25maWc7XG4gIHJlYWRvbmx5IG9yaWdpblBhdGg/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IG9yaWdpbkhlYWRlcnM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuICByZWFkb25seSBvcmlnaW5TaGllbGRSZWdpb24/OiBzdHJpbmdcbn1cblxuLyoqXG4gKiBBIHNvdXJjZSBjb25maWd1cmF0aW9uIGlzIGEgd3JhcHBlciBmb3IgQ2xvdWRGcm9udCBvcmlnaW5zIGFuZCBiZWhhdmlvcnMuXG4gKiBBbiBvcmlnaW4gaXMgd2hhdCBDbG91ZEZyb250IHdpbGwgXCJiZSBpbiBmcm9udCBvZlwiIC0gdGhhdCBpcywgQ2xvdWRGcm9udCB3aWxsIHB1bGwgaXQncyBhc3NldHMgZnJvbSBhbiBvcmlnaW4uXG4gKlxuICogSWYgeW91J3JlIHVzaW5nIHMzIGFzIGEgc291cmNlIC0gcGFzcyB0aGUgYHMzT3JpZ2luYCBwcm9wZXJ0eSwgb3RoZXJ3aXNlLCBwYXNzIHRoZSBgY3VzdG9tT3JpZ2luU291cmNlYCBwcm9wZXJ0eS5cbiAqXG4gKiBPbmUgb3IgdGhlIG90aGVyIG11c3QgYmUgcGFzc2VkLCBhbmQgaXQgaXMgaW52YWxpZCB0byBwYXNzIGJvdGggaW4gdGhlIHNhbWUgU291cmNlQ29uZmlndXJhdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTb3VyY2VDb25maWd1cmF0aW9uIHtcbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgdGltZXMgdGhhdCBDbG91ZEZyb250IGF0dGVtcHRzIHRvIGNvbm5lY3QgdG8gdGhlIG9yaWdpbi5cbiAgICogWW91IGNhbiBzcGVjaWZ5IDEsIDIsIG9yIDMgYXMgdGhlIG51bWJlciBvZiBhdHRlbXB0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgM1xuICAgKi9cbiAgcmVhZG9ubHkgY29ubmVjdGlvbkF0dGVtcHRzPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHNlY29uZHMgdGhhdCBDbG91ZEZyb250IHdhaXRzIHdoZW4gdHJ5aW5nIHRvIGVzdGFibGlzaCBhIGNvbm5lY3Rpb24gdG8gdGhlIG9yaWdpbi5cbiAgICogWW91IGNhbiBzcGVjaWZ5IGEgbnVtYmVyIG9mIHNlY29uZHMgYmV0d2VlbiAxIGFuZCAxMCAoaW5jbHVzaXZlKS5cbiAgICpcbiAgICogQGRlZmF1bHQgY2RrLkR1cmF0aW9uLnNlY29uZHMoMTApXG4gICAqL1xuICByZWFkb25seSBjb25uZWN0aW9uVGltZW91dD86IGNkay5EdXJhdGlvbjtcblxuICAvKipcbiAgICogQW4gczMgb3JpZ2luIHNvdXJjZSAtIGlmIHlvdSdyZSB1c2luZyBzMyBmb3IgeW91ciBhc3NldHNcbiAgICovXG4gIHJlYWRvbmx5IHMzT3JpZ2luU291cmNlPzogUzNPcmlnaW5Db25maWc7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIG9yaWdpbiBzb3VyY2UgLSBmb3IgYWxsIG5vbi1zMyBzb3VyY2VzLlxuICAgKi9cbiAgcmVhZG9ubHkgY3VzdG9tT3JpZ2luU291cmNlPzogQ3VzdG9tT3JpZ2luQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBBbiBzMyBvcmlnaW4gc291cmNlIGZvciBmYWlsb3ZlciBpbiBjYXNlIHRoZSBzM09yaWdpblNvdXJjZSByZXR1cm5zIGludmFsaWQgc3RhdHVzIGNvZGVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBmYWlsb3ZlciBjb25maWd1cmF0aW9uXG4gICAqL1xuICByZWFkb25seSBmYWlsb3ZlclMzT3JpZ2luU291cmNlPzogUzNPcmlnaW5Db25maWc7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIG9yaWdpbiBzb3VyY2UgZm9yIGZhaWxvdmVyIGluIGNhc2UgdGhlIHMzT3JpZ2luU291cmNlIHJldHVybnMgaW52YWxpZCBzdGF0dXMgY29kZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGZhaWxvdmVyIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIHJlYWRvbmx5IGZhaWxvdmVyQ3VzdG9tT3JpZ2luU291cmNlPzogQ3VzdG9tT3JpZ2luQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBIVFRQIHN0YXR1cyBjb2RlIHRvIGZhaWxvdmVyIHRvIHNlY29uZCBvcmlnaW5cbiAgICpcbiAgICogQGRlZmF1bHQgWzUwMCwgNTAyLCA1MDMsIDUwNF1cbiAgICovXG4gIHJlYWRvbmx5IGZhaWxvdmVyQ3JpdGVyaWFTdGF0dXNDb2Rlcz86IEZhaWxvdmVyU3RhdHVzQ29kZVtdO1xuXG4gIC8qKlxuICAgKiBUaGUgYmVoYXZpb3JzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHNvdXJjZS5cbiAgICogQXQgbGVhc3Qgb25lIChkZWZhdWx0KSBiZWhhdmlvciBtdXN0IGJlIGluY2x1ZGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgYmVoYXZpb3JzOiBCZWhhdmlvcltdO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVsYXRpdmUgcGF0aCB0byB0aGUgb3JpZ2luIHJvb3QgdG8gdXNlIGZvciBzb3VyY2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAvXG4gICAqIEBkZXByZWNhdGVkIFVzZSBvcmlnaW5QYXRoIG9uIHMzT3JpZ2luU291cmNlIG9yIGN1c3RvbU9yaWdpblNvdXJjZVxuICAgKi9cbiAgcmVhZG9ubHkgb3JpZ2luUGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogQW55IGFkZGl0aW9uYWwgaGVhZGVycyB0byBwYXNzIHRvIHRoZSBvcmlnaW5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBhZGRpdGlvbmFsIGhlYWRlcnMgYXJlIHBhc3NlZC5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIG9yaWdpbkhlYWRlcnMgb24gczNPcmlnaW5Tb3VyY2Ugb3IgY3VzdG9tT3JpZ2luU291cmNlXG4gICAqL1xuICByZWFkb25seSBvcmlnaW5IZWFkZXJzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogV2hlbiB5b3UgZW5hYmxlIE9yaWdpbiBTaGllbGQgaW4gdGhlIEFXUyBSZWdpb24gdGhhdCBoYXMgdGhlIGxvd2VzdCBsYXRlbmN5IHRvIHlvdXIgb3JpZ2luLCB5b3UgY2FuIGdldCBiZXR0ZXIgbmV0d29yayBwZXJmb3JtYW5jZVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZEZyb250L2xhdGVzdC9EZXZlbG9wZXJHdWlkZS9vcmlnaW4tc2hpZWxkLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBvcmlnaW4gc2hpZWxkIG5vdCBlbmFibGVkXG4gICAqL1xuICByZWFkb25seSBvcmlnaW5TaGllbGRSZWdpb24/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBjdXN0b20gb3JpZ2luIGNvbmZpZ3VyYXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDdXN0b21PcmlnaW5Db25maWcge1xuICAvKipcbiAgICogVGhlIGRvbWFpbiBuYW1lIG9mIHRoZSBjdXN0b20gb3JpZ2luLiBTaG91bGQgbm90IGluY2x1ZGUgdGhlIHBhdGggLSB0aGF0IHNob3VsZCBiZSBpbiB0aGUgcGFyZW50IFNvdXJjZUNvbmZpZ3VyYXRpb25cbiAgICovXG4gIHJlYWRvbmx5IGRvbWFpbk5hbWU6IHN0cmluZyxcblxuICAvKipcbiAgICogVGhlIG9yaWdpbiBIVFRQIHBvcnRcbiAgICpcbiAgICogQGRlZmF1bHQgODBcbiAgICovXG4gIHJlYWRvbmx5IGh0dHBQb3J0PzogbnVtYmVyLFxuXG4gIC8qKlxuICAgKiBUaGUgb3JpZ2luIEhUVFBTIHBvcnRcbiAgICpcbiAgICogQGRlZmF1bHQgNDQzXG4gICAqL1xuICByZWFkb25seSBodHRwc1BvcnQ/OiBudW1iZXIsXG5cbiAgLyoqXG4gICAqIFRoZSBrZWVwIGFsaXZlIHRpbWVvdXQgd2hlbiBtYWtpbmcgY2FsbHMgaW4gc2Vjb25kcy5cbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24uc2Vjb25kcyg1KVxuICAgKi9cbiAgcmVhZG9ubHkgb3JpZ2luS2VlcGFsaXZlVGltZW91dD86IGNkay5EdXJhdGlvbixcblxuICAvKipcbiAgICogVGhlIHByb3RvY29sIChodHRwIG9yIGh0dHBzKSBwb2xpY3kgdG8gdXNlIHdoZW4gaW50ZXJhY3Rpbmcgd2l0aCB0aGUgb3JpZ2luLlxuICAgKlxuICAgKiBAZGVmYXVsdCBPcmlnaW5Qcm90b2NvbFBvbGljeS5IdHRwc09ubHlcbiAgICovXG4gIHJlYWRvbmx5IG9yaWdpblByb3RvY29sUG9saWN5PzogT3JpZ2luUHJvdG9jb2xQb2xpY3ksXG5cbiAgLyoqXG4gICAqIFRoZSByZWFkIHRpbWVvdXQgd2hlbiBjYWxsaW5nIHRoZSBvcmlnaW4gaW4gc2Vjb25kc1xuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5zZWNvbmRzKDMwKVxuICAgKi9cbiAgcmVhZG9ubHkgb3JpZ2luUmVhZFRpbWVvdXQ/OiBjZGsuRHVyYXRpb25cblxuICAvKipcbiAgICogVGhlIFNTTCB2ZXJzaW9ucyB0byB1c2Ugd2hlbiBpbnRlcmFjdGluZyB3aXRoIHRoZSBvcmlnaW4uXG4gICAqXG4gICAqIEBkZWZhdWx0IE9yaWdpblNzbFBvbGljeS5UTFNfVjFfMlxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dlZE9yaWdpblNTTFZlcnNpb25zPzogT3JpZ2luU3NsUG9saWN5W107XG5cbiAgLyoqXG4gICAqIFRoZSByZWxhdGl2ZSBwYXRoIHRvIHRoZSBvcmlnaW4gcm9vdCB0byB1c2UgZm9yIHNvdXJjZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC9cbiAgICovXG4gIHJlYWRvbmx5IG9yaWdpblBhdGg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFueSBhZGRpdGlvbmFsIGhlYWRlcnMgdG8gcGFzcyB0byB0aGUgb3JpZ2luXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gYWRkaXRpb25hbCBoZWFkZXJzIGFyZSBwYXNzZWQuXG4gICAqL1xuICByZWFkb25seSBvcmlnaW5IZWFkZXJzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogV2hlbiB5b3UgZW5hYmxlIE9yaWdpbiBTaGllbGQgaW4gdGhlIEFXUyBSZWdpb24gdGhhdCBoYXMgdGhlIGxvd2VzdCBsYXRlbmN5IHRvIHlvdXIgb3JpZ2luLCB5b3UgY2FuIGdldCBiZXR0ZXIgbmV0d29yayBwZXJmb3JtYW5jZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG9yaWdpbiBzaGllbGQgbm90IGVuYWJsZWRcbiAgICovXG4gIHJlYWRvbmx5IG9yaWdpblNoaWVsZFJlZ2lvbj86IHN0cmluZztcbn1cblxuZXhwb3J0IGVudW0gT3JpZ2luU3NsUG9saWN5IHtcbiAgU1NMX1YzID0gJ1NTTHYzJyxcbiAgVExTX1YxID0gJ1RMU3YxJyxcbiAgVExTX1YxXzEgPSAnVExTdjEuMScsXG4gIFRMU19WMV8yID0gJ1RMU3YxLjInLFxufVxuXG4vKipcbiAqIFMzIG9yaWdpbiBjb25maWd1cmF0aW9uIGZvciBDbG91ZEZyb250XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUzNPcmlnaW5Db25maWcge1xuICAvKipcbiAgICogVGhlIHNvdXJjZSBidWNrZXQgdG8gc2VydmUgY29udGVudCBmcm9tXG4gICAqL1xuICByZWFkb25seSBzM0J1Y2tldFNvdXJjZTogczMuSUJ1Y2tldDtcblxuICAvKipcbiAgICogVGhlIG9wdGlvbmFsIE9yaWdpbiBBY2Nlc3MgSWRlbnRpdHkgb2YgdGhlIG9yaWdpbiBpZGVudGl0eSBjbG91ZGZyb250IHdpbGwgdXNlIHdoZW4gY2FsbGluZyB5b3VyIHMzIGJ1Y2tldC5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gT3JpZ2luIEFjY2VzcyBJZGVudGl0eSB3aGljaCByZXF1aXJlcyB0aGUgUzMgYnVja2V0IHRvIGJlIHB1YmxpYyBhY2Nlc3NpYmxlXG4gICAqL1xuICByZWFkb25seSBvcmlnaW5BY2Nlc3NJZGVudGl0eT86IElPcmlnaW5BY2Nlc3NJZGVudGl0eTtcblxuICAvKipcbiAgICogVGhlIHJlbGF0aXZlIHBhdGggdG8gdGhlIG9yaWdpbiByb290IHRvIHVzZSBmb3Igc291cmNlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgL1xuICAgKi9cbiAgcmVhZG9ubHkgb3JpZ2luUGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogQW55IGFkZGl0aW9uYWwgaGVhZGVycyB0byBwYXNzIHRvIHRoZSBvcmlnaW5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBhZGRpdGlvbmFsIGhlYWRlcnMgYXJlIHBhc3NlZC5cbiAgICovXG4gIHJlYWRvbmx5IG9yaWdpbkhlYWRlcnM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gIC8qKlxuICAgKiBXaGVuIHlvdSBlbmFibGUgT3JpZ2luIFNoaWVsZCBpbiB0aGUgQVdTIFJlZ2lvbiB0aGF0IGhhcyB0aGUgbG93ZXN0IGxhdGVuY3kgdG8geW91ciBvcmlnaW4sIHlvdSBjYW4gZ2V0IGJldHRlciBuZXR3b3JrIHBlcmZvcm1hbmNlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gb3JpZ2luIHNoaWVsZCBub3QgZW5hYmxlZFxuICAgKi9cbiAgcmVhZG9ubHkgb3JpZ2luU2hpZWxkUmVnaW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEFuIGVudW0gZm9yIHRoZSBzdXBwb3J0ZWQgbWV0aG9kcyB0byBhIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uLlxuICovXG5leHBvcnQgZW51bSBDbG91ZEZyb250QWxsb3dlZE1ldGhvZHMge1xuICBHRVRfSEVBRCA9ICdHSCcsXG4gIEdFVF9IRUFEX09QVElPTlMgPSAnR0hPJyxcbiAgQUxMID0gJ0FMTCdcbn1cblxuLyoqXG4gKiBFbnVtcyBmb3IgdGhlIG1ldGhvZHMgQ2xvdWRGcm9udCBjYW4gY2FjaGUuXG4gKi9cbmV4cG9ydCBlbnVtIENsb3VkRnJvbnRBbGxvd2VkQ2FjaGVkTWV0aG9kcyB7XG4gIEdFVF9IRUFEID0gJ0dIJyxcbiAgR0VUX0hFQURfT1BUSU9OUyA9ICdHSE8nLFxufVxuXG4vKipcbiAqIEEgQ2xvdWRGcm9udCBiZWhhdmlvciB3cmFwcGVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJlaGF2aW9yIHtcblxuICAvKipcbiAgICogSWYgQ2xvdWRGcm9udCBzaG91bGQgYXV0b21hdGljYWxseSBjb21wcmVzcyBzb21lIGNvbnRlbnQgdHlwZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGNvbXByZXNzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgdGhpcyBiZWhhdmlvciBpcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBmb3IgdGhlIGRpc3RyaWJ1dGlvbi5cbiAgICpcbiAgICogWW91IG11c3Qgc3BlY2lmeSBleGFjdGx5IG9uZSBkZWZhdWx0IGRpc3RyaWJ1dGlvbiBwZXIgQ2xvdWRGcm9udCBkaXN0cmlidXRpb24uXG4gICAqIFRoZSBkZWZhdWx0IGJlaGF2aW9yIGlzIGFsbG93ZWQgdG8gb21pdCB0aGUgXCJwYXRoXCIgcHJvcGVydHkuXG4gICAqL1xuICByZWFkb25seSBpc0RlZmF1bHRCZWhhdmlvcj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRydXN0ZWQgc2lnbmVycyBpcyBob3cgQ2xvdWRGcm9udCBhbGxvd3MgeW91IHRvIHNlcnZlIHByaXZhdGUgY29udGVudC5cbiAgICogVGhlIHNpZ25lcnMgYXJlIHRoZSBhY2NvdW50IElEcyB0aGF0IGFyZSBhbGxvd2VkIHRvIHNpZ24gY29va2llcy9wcmVzaWduZWQgVVJMcyBmb3IgdGhpcyBkaXN0cmlidXRpb24uXG4gICAqXG4gICAqIElmIHlvdSBwYXNzIGEgbm9uIGVtcHR5IHZhbHVlLCBhbGwgcmVxdWVzdHMgZm9yIHRoaXMgYmVoYXZpb3IgbXVzdCBiZSBzaWduZWQgKG5vIHB1YmxpYyBhY2Nlc3Mgd2lsbCBiZSBhbGxvd2VkKVxuICAgKiBAZGVwcmVjYXRlZCAtIFdlIHJlY29tbWVuZCB1c2luZyB0cnVzdGVkS2V5R3JvdXBzIGluc3RlYWQgb2YgdHJ1c3RlZFNpZ25lcnMuXG4gICAqL1xuICByZWFkb25seSB0cnVzdGVkU2lnbmVycz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgS2V5IEdyb3VwcyB0aGF0IENsb3VkRnJvbnQgY2FuIHVzZSB0byB2YWxpZGF0ZSBzaWduZWQgVVJMcyBvciBzaWduZWQgY29va2llcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBLZXlHcm91cHMgYXJlIGFzc29jaWF0ZWQgd2l0aCBjYWNoZSBiZWhhdmlvclxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZEZyb250L2xhdGVzdC9EZXZlbG9wZXJHdWlkZS9Qcml2YXRlQ29udGVudC5odG1sXG4gICAqL1xuICByZWFkb25seSB0cnVzdGVkS2V5R3JvdXBzPzogSUtleUdyb3VwW107XG5cbiAgLyoqXG4gICAqXG4gICAqIFRoZSBkZWZhdWx0IGFtb3VudCBvZiB0aW1lIENsb3VkRnJvbnQgd2lsbCBjYWNoZSBhbiBvYmplY3QuXG4gICAqXG4gICAqIFRoaXMgdmFsdWUgYXBwbGllcyBvbmx5IHdoZW4geW91ciBjdXN0b20gb3JpZ2luIGRvZXMgbm90IGFkZCBIVFRQIGhlYWRlcnMsXG4gICAqIHN1Y2ggYXMgQ2FjaGUtQ29udHJvbCBtYXgtYWdlLCBDYWNoZS1Db250cm9sIHMtbWF4YWdlLCBhbmQgRXhwaXJlcyB0byBvYmplY3RzLlxuICAgKiBAZGVmYXVsdCA4NjQwMCAoMSBkYXkpXG4gICAqXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0VHRsPzogY2RrLkR1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHRoaXMgQ2xvdWRGcm9udCBkaXN0cmlidXRpb24gcmVzcG9uZHMgZG8uXG4gICAqXG4gICAqIEBkZWZhdWx0IEdFVF9IRUFEXG4gICAqL1xuICByZWFkb25seSBhbGxvd2VkTWV0aG9kcz86IENsb3VkRnJvbnRBbGxvd2VkTWV0aG9kcztcblxuICAvKipcbiAgICogVGhlIHBhdGggdGhpcyBiZWhhdmlvciByZXNwb25kcyB0by5cbiAgICogUmVxdWlyZWQgZm9yIGFsbCBub24tZGVmYXVsdCBiZWhhdmlvcnMuIChUaGUgZGVmYXVsdCBiZWhhdmlvciBpbXBsaWNpdGx5IGhhcyBcIipcIiBhcyB0aGUgcGF0aCBwYXR0ZXJuLiApXG4gICAqXG4gICAqL1xuICByZWFkb25seSBwYXRoUGF0dGVybj86IHN0cmluZztcblxuICAvKipcbiAgICogV2hpY2ggbWV0aG9kcyBhcmUgY2FjaGVkIGJ5IENsb3VkRnJvbnQgYnkgZGVmYXVsdC5cbiAgICpcbiAgICogQGRlZmF1bHQgR0VUX0hFQURcbiAgICovXG4gIHJlYWRvbmx5IGNhY2hlZE1ldGhvZHM/OiBDbG91ZEZyb250QWxsb3dlZENhY2hlZE1ldGhvZHM7XG5cbiAgLyoqXG4gICAqIFRoZSB2YWx1ZXMgQ2xvdWRGcm9udCB3aWxsIGZvcndhcmQgdG8gdGhlIG9yaWdpbiB3aGVuIG1ha2luZyBhIHJlcXVlc3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IG5vbmUgKG5vIGNvb2tpZXMgLSBubyBoZWFkZXJzKVxuICAgKlxuICAgKi9cbiAgcmVhZG9ubHkgZm9yd2FyZGVkVmFsdWVzPzogQ2ZuRGlzdHJpYnV0aW9uLkZvcndhcmRlZFZhbHVlc1Byb3BlcnR5O1xuXG4gIC8qKlxuICAgKiBUaGUgbWluaW11bSBhbW91bnQgb2YgdGltZSB0aGF0IHlvdSB3YW50IG9iamVjdHMgdG8gc3RheSBpbiB0aGUgY2FjaGVcbiAgICogYmVmb3JlIENsb3VkRnJvbnQgcXVlcmllcyB5b3VyIG9yaWdpbi5cbiAgICovXG4gIHJlYWRvbmx5IG1pblR0bD86IGNkay5EdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIG1heCBhbW91bnQgb2YgdGltZSB5b3Ugd2FudCBvYmplY3RzIHRvIHN0YXkgaW4gdGhlIGNhY2hlXG4gICAqIGJlZm9yZSBDbG91ZEZyb250IHF1ZXJpZXMgeW91ciBvcmlnaW4uXG4gICAqXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLnNlY29uZHMoMzE1MzYwMDApIChvbmUgeWVhcilcbiAgICovXG4gIHJlYWRvbmx5IG1heFR0bD86IGNkay5EdXJhdGlvbjtcblxuICAvKipcbiAgICogRGVjbGFyZXMgYXNzb2NpYXRlZCBsYW1iZGFAZWRnZSBmdW5jdGlvbnMgZm9yIHRoaXMgZGlzdHJpYnV0aW9uIGJlaGF2aW91ci5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gbGFtYmRhIGZ1bmN0aW9uIGFzc29jaWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IGxhbWJkYUZ1bmN0aW9uQXNzb2NpYXRpb25zPzogTGFtYmRhRnVuY3Rpb25Bc3NvY2lhdGlvbltdO1xuXG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRGcm9udCBmdW5jdGlvbnMgdG8gaW52b2tlIGJlZm9yZSBzZXJ2aW5nIHRoZSBjb250ZW50cy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBmdW5jdGlvbnMgd2lsbCBiZSBpbnZva2VkXG4gICAqL1xuICByZWFkb25seSBmdW5jdGlvbkFzc29jaWF0aW9ucz86IEZ1bmN0aW9uQXNzb2NpYXRpb25bXTtcblxuICAvKipcbiAgICogVGhlIHZpZXdlciBwb2xpY3kgZm9yIHRoaXMgYmVoYXZpb3IuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIGRpc3RyaWJ1dGlvbiB3aWRlIHZpZXdlciBwcm90b2NvbCBwb2xpY3kgd2lsbCBiZSB1c2VkXG4gICAqL1xuICByZWFkb25seSB2aWV3ZXJQcm90b2NvbFBvbGljeT86IFZpZXdlclByb3RvY29sUG9saWN5O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIExhbWJkYUZ1bmN0aW9uQXNzb2NpYXRpb24ge1xuXG4gIC8qKlxuICAgKiBUaGUgbGFtYmRhIGV2ZW50IHR5cGUgZGVmaW5lcyBhdCB3aGljaCBldmVudCB0aGUgbGFtYmRhXG4gICAqIGlzIGNhbGxlZCBkdXJpbmcgdGhlIHJlcXVlc3QgbGlmZWN5Y2xlXG4gICAqL1xuICByZWFkb25seSBldmVudFR5cGU6IExhbWJkYUVkZ2VFdmVudFR5cGU7XG5cbiAgLyoqXG4gICAqIEEgdmVyc2lvbiBvZiB0aGUgbGFtYmRhIHRvIGFzc29jaWF0ZVxuICAgKi9cbiAgcmVhZG9ubHkgbGFtYmRhRnVuY3Rpb246IGxhbWJkYS5JVmVyc2lvbjtcblxuICAvKipcbiAgICogQWxsb3dzIGEgTGFtYmRhIGZ1bmN0aW9uIHRvIGhhdmUgcmVhZCBhY2Nlc3MgdG8gdGhlIGJvZHkgY29udGVudC5cbiAgICogT25seSB2YWxpZCBmb3IgXCJyZXF1ZXN0XCIgZXZlbnQgdHlwZXMgKGBPUklHSU5fUkVRVUVTVGAgb3IgYFZJRVdFUl9SRVFVRVNUYCkuXG4gICAqIFNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRGcm9udC9sYXRlc3QvRGV2ZWxvcGVyR3VpZGUvbGFtYmRhLWluY2x1ZGUtYm9keS1hY2Nlc3MuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5jbHVkZUJvZHk/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFZpZXdlckNlcnRpZmljYXRlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBIb3cgQ2xvdWRGcm9udCBzaG91bGQgc2VydmUgSFRUUFMgcmVxdWVzdHMuXG4gICAqXG4gICAqIFNlZSB0aGUgbm90ZXMgb24gU1NMTWV0aG9kIGlmIHlvdSB3aXNoIHRvIHVzZSBvdGhlciBTU0wgdGVybWluYXRpb24gdHlwZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IFNTTE1ldGhvZC5TTklcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2xvdWRmcm9udC9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9WaWV3ZXJDZXJ0aWZpY2F0ZS5odG1sXG4gICAqL1xuICByZWFkb25seSBzc2xNZXRob2Q/OiBTU0xNZXRob2Q7XG5cbiAgLyoqXG4gICAqIFRoZSBtaW5pbXVtIHZlcnNpb24gb2YgdGhlIFNTTCBwcm90b2NvbCB0aGF0IHlvdSB3YW50IENsb3VkRnJvbnQgdG8gdXNlIGZvciBIVFRQUyBjb25uZWN0aW9ucy5cbiAgICpcbiAgICogQ2xvdWRGcm9udCBzZXJ2ZXMgeW91ciBvYmplY3RzIG9ubHkgdG8gYnJvd3NlcnMgb3IgZGV2aWNlcyB0aGF0IHN1cHBvcnQgYXRcbiAgICogbGVhc3QgdGhlIFNTTCB2ZXJzaW9uIHRoYXQgeW91IHNwZWNpZnkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gU1NMdjMgaWYgc3NsTWV0aG9kIFZJUCwgVExTdjEgaWYgc3NsTWV0aG9kIFNOSVxuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlQb2xpY3k/OiBTZWN1cml0eVBvbGljeVByb3RvY29sO1xuXG4gIC8qKlxuICAgKiBEb21haW4gbmFtZXMgb24gdGhlIGNlcnRpZmljYXRlIChib3RoIG1haW4gZG9tYWluIG5hbWUgYW5kIFN1YmplY3QgQWx0ZXJuYXRpdmUgbmFtZXMpXG4gICAqL1xuICByZWFkb25seSBhbGlhc2VzPzogc3RyaW5nW107XG59XG5cbi8qKlxuICogVmlld2VyIGNlcnRpZmljYXRlIGNvbmZpZ3VyYXRpb24gY2xhc3NcbiAqL1xuZXhwb3J0IGNsYXNzIFZpZXdlckNlcnRpZmljYXRlIHtcbiAgLyoqXG4gICAqIEdlbmVyYXRlIGFuIEFXUyBDZXJ0aWZpY2F0ZSBNYW5hZ2VyIChBQ00pIHZpZXdlciBjZXJ0aWZpY2F0ZSBjb25maWd1cmF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSBjZXJ0aWZpY2F0ZSBBV1MgQ2VydGlmaWNhdGUgTWFuYWdlciAoQUNNKSBjZXJ0aWZpY2F0ZS5cbiAgICogICAgICAgICAgICAgICAgICAgIFlvdXIgY2VydGlmaWNhdGUgbXVzdCBiZSBsb2NhdGVkIGluIHRoZSB1cy1lYXN0LTEgKFVTIEVhc3QgKE4uIFZpcmdpbmlhKSkgcmVnaW9uIHRvIGJlIGFjY2Vzc2VkIGJ5IENsb3VkRnJvbnRcbiAgICogQHBhcmFtIG9wdGlvbnMgY2VydGlmaWNhdGUgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21BY21DZXJ0aWZpY2F0ZShjZXJ0aWZpY2F0ZTogY2VydGlmaWNhdGVtYW5hZ2VyLklDZXJ0aWZpY2F0ZSwgb3B0aW9uczogVmlld2VyQ2VydGlmaWNhdGVPcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7XG4gICAgICBzc2xNZXRob2Q6IHNzbFN1cHBvcnRNZXRob2QgPSBTU0xNZXRob2QuU05JLFxuICAgICAgc2VjdXJpdHlQb2xpY3k6IG1pbmltdW1Qcm90b2NvbFZlcnNpb24sXG4gICAgICBhbGlhc2VzLFxuICAgIH0gPSBvcHRpb25zO1xuXG4gICAgcmV0dXJuIG5ldyBWaWV3ZXJDZXJ0aWZpY2F0ZSh7XG4gICAgICBhY21DZXJ0aWZpY2F0ZUFybjogY2VydGlmaWNhdGUuY2VydGlmaWNhdGVBcm4sIHNzbFN1cHBvcnRNZXRob2QsIG1pbmltdW1Qcm90b2NvbFZlcnNpb24sXG4gICAgfSwgYWxpYXNlcyk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgYW4gSUFNIHZpZXdlciBjZXJ0aWZpY2F0ZSBjb25maWd1cmF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSBpYW1DZXJ0aWZpY2F0ZUlkIElkZW50aWZpZXIgb2YgdGhlIElBTSBjZXJ0aWZpY2F0ZVxuICAgKiBAcGFyYW0gb3B0aW9ucyBjZXJ0aWZpY2F0ZSBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUlhbUNlcnRpZmljYXRlKGlhbUNlcnRpZmljYXRlSWQ6IHN0cmluZywgb3B0aW9uczogVmlld2VyQ2VydGlmaWNhdGVPcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7XG4gICAgICBzc2xNZXRob2Q6IHNzbFN1cHBvcnRNZXRob2QgPSBTU0xNZXRob2QuU05JLFxuICAgICAgc2VjdXJpdHlQb2xpY3k6IG1pbmltdW1Qcm90b2NvbFZlcnNpb24sXG4gICAgICBhbGlhc2VzLFxuICAgIH0gPSBvcHRpb25zO1xuXG4gICAgcmV0dXJuIG5ldyBWaWV3ZXJDZXJ0aWZpY2F0ZSh7XG4gICAgICBpYW1DZXJ0aWZpY2F0ZUlkLCBzc2xTdXBwb3J0TWV0aG9kLCBtaW5pbXVtUHJvdG9jb2xWZXJzaW9uLFxuICAgIH0sIGFsaWFzZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIGEgdmlld2VyIGNlcnRpZmNhdGUgY29uZmlndXJhdGlvbiB1c2luZ1xuICAgKiB0aGUgQ2xvdWRGcm9udCBkZWZhdWx0IGNlcnRpZmljYXRlIChlLmcuIGQxMTExMTFhYmNkZWY4LmNsb3VkZnJvbnQubmV0KVxuICAgKiBhbmQgYSBgU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5UTFNfVjFgIHNlY3VyaXR5IHBvbGljeS5cbiAgICpcbiAgICogQHBhcmFtIGFsaWFzZXMgQWx0ZXJuYXRpdmUgQ05BTUUgYWxpYXNlc1xuICAgKiAgICAgICAgICAgICAgICBZb3UgYWxzbyBtdXN0IGNyZWF0ZSBhIENOQU1FIHJlY29yZCB3aXRoIHlvdXIgRE5TIHNlcnZpY2UgdG8gcm91dGUgcXVlcmllc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQ2xvdWRGcm9udERlZmF1bHRDZXJ0aWZpY2F0ZSguLi5hbGlhc2VzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBuZXcgVmlld2VyQ2VydGlmaWNhdGUoeyBjbG91ZEZyb250RGVmYXVsdENlcnRpZmljYXRlOiB0cnVlIH0sIGFsaWFzZXMpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgcmVhZG9ubHkgcHJvcHM6IENmbkRpc3RyaWJ1dGlvbi5WaWV3ZXJDZXJ0aWZpY2F0ZVByb3BlcnR5LFxuICAgIHB1YmxpYyByZWFkb25seSBhbGlhc2VzOiBzdHJpbmdbXSA9IFtdKSB7IH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uUHJvcHMge1xuXG4gIC8qKlxuICAgKiBBbGlhc0NvbmZpZ3VyYXRpb24gaXMgdXNlZCB0byBjb25maWd1cmVkIENsb3VkRnJvbnQgdG8gcmVzcG9uZCB0byByZXF1ZXN0cyBvbiBjdXN0b20gZG9tYWluIG5hbWVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqIEBkZXByZWNhdGVkIHNlZSBgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvblByb3BzI3ZpZXdlckNlcnRpZmljYXRlYCB3aXRoIGBWaWV3ZXJDZXJ0aWZpY2F0ZSNhY21DZXJ0aWZpY2F0ZWBcbiAgICovXG4gIHJlYWRvbmx5IGFsaWFzQ29uZmlndXJhdGlvbj86IEFsaWFzQ29uZmlndXJhdGlvbjtcblxuICAvKipcbiAgICogQSBjb21tZW50IGZvciB0aGlzIGRpc3RyaWJ1dGlvbiBpbiB0aGUgQ2xvdWRGcm9udCBjb25zb2xlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGNvbW1lbnQgaXMgYWRkZWQgdG8gZGlzdHJpYnV0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgY29tbWVudD86IHN0cmluZztcblxuICAvKipcbiAgICogRW5hYmxlIG9yIGRpc2FibGUgdGhlIGRpc3RyaWJ1dGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgZW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IG9iamVjdCB0byBzZXJ2ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBcImluZGV4Lmh0bWxcIiBpcyBzZXJ2ZWQuXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0Um9vdE9iamVjdD86IHN0cmluZztcblxuICAvKipcbiAgICogSWYgeW91ciBkaXN0cmlidXRpb24gc2hvdWxkIGhhdmUgSVB2NiBlbmFibGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBlbmFibGVJcFY2PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIG1heCBzdXBwb3J0ZWQgSFRUUCBWZXJzaW9ucy5cbiAgICpcbiAgICogQGRlZmF1bHQgSHR0cFZlcnNpb24uSFRUUDJcbiAgICovXG4gIHJlYWRvbmx5IGh0dHBWZXJzaW9uPzogSHR0cFZlcnNpb247XG5cbiAgLyoqXG4gICAqIFRoZSBwcmljZSBjbGFzcyBmb3IgdGhlIGRpc3RyaWJ1dGlvbiAodGhpcyBpbXBhY3RzIGhvdyBtYW55IGxvY2F0aW9ucyBDbG91ZEZyb250IHVzZXMgZm9yIHlvdXIgZGlzdHJpYnV0aW9uLCBhbmQgYmlsbGluZylcbiAgICpcbiAgICogQGRlZmF1bHQgUHJpY2VDbGFzcy5QUklDRV9DTEFTU18xMDAgdGhlIGNoZWFwZXN0IG9wdGlvbiBmb3IgQ2xvdWRGcm9udCBpcyBwaWNrZWQgYnkgZGVmYXVsdC5cbiAgICovXG4gIHJlYWRvbmx5IHByaWNlQ2xhc3M/OiBQcmljZUNsYXNzO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdCB2aWV3ZXIgcG9saWN5IGZvciBpbmNvbWluZyBjbGllbnRzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBSZWRpcmVjdFRvSFRUUHNcbiAgICovXG4gIHJlYWRvbmx5IHZpZXdlclByb3RvY29sUG9saWN5PzogVmlld2VyUHJvdG9jb2xQb2xpY3k7XG5cbiAgLyoqXG4gICAqIFRoZSBvcmlnaW4gY29uZmlndXJhdGlvbnMgZm9yIHRoaXMgZGlzdHJpYnV0aW9uLiBCZWhhdmlvcnMgYXJlIGEgcGFydCBvZiB0aGUgb3JpZ2luLlxuICAgKi9cbiAgcmVhZG9ubHkgb3JpZ2luQ29uZmlnczogU291cmNlQ29uZmlndXJhdGlvbltdO1xuXG4gIC8qKlxuICAgKiBPcHRpb25hbCAtIGlmIHdlIHNob3VsZCBlbmFibGUgbG9nZ2luZy5cbiAgICogWW91IGNhbiBwYXNzIGFuIGVtcHR5IG9iamVjdCAoe30pIHRvIGhhdmUgdXMgYXV0byBjcmVhdGUgYSBidWNrZXQgZm9yIGxvZ2dpbmcuXG4gICAqIE9taXNzaW9uIG9mIHRoaXMgcHJvcGVydHkgaW5kaWNhdGVzIG5vIGxvZ2dpbmcgaXMgdG8gYmUgZW5hYmxlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBsb2dnaW5nIGlzIGVuYWJsZWQgYnkgZGVmYXVsdC5cbiAgICovXG4gIHJlYWRvbmx5IGxvZ2dpbmdDb25maWc/OiBMb2dnaW5nQ29uZmlndXJhdGlvbjtcblxuICAvKipcbiAgICogSG93IENsb3VkRnJvbnQgc2hvdWxkIGhhbmRsZSByZXF1ZXN0cyB0aGF0IGFyZSBub3Qgc3VjY2Vzc2Z1bCAoZWcgUGFnZU5vdEZvdW5kKVxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCBDbG91ZEZyb250IGRvZXMgbm90IHJlcGxhY2UgSFRUUCBzdGF0dXMgY29kZXMgaW4gdGhlIDR4eCBhbmQgNXh4IHJhbmdlXG4gICAqIHdpdGggY3VzdG9tIGVycm9yIG1lc3NhZ2VzLiBDbG91ZEZyb250IGRvZXMgbm90IGNhY2hlIEhUVFAgc3RhdHVzIGNvZGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGN1c3RvbSBlcnJvciBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZXJyb3JDb25maWd1cmF0aW9ucz86IENmbkRpc3RyaWJ1dGlvbi5DdXN0b21FcnJvclJlc3BvbnNlUHJvcGVydHlbXTtcblxuICAvKipcbiAgICogVW5pcXVlIGlkZW50aWZpZXIgdGhhdCBzcGVjaWZpZXMgdGhlIEFXUyBXQUYgd2ViIEFDTCB0byBhc3NvY2lhdGUgd2l0aCB0aGlzIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uLlxuICAgKlxuICAgKiBUbyBzcGVjaWZ5IGEgd2ViIEFDTCBjcmVhdGVkIHVzaW5nIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBBV1MgV0FGLCB1c2UgdGhlIEFDTCBBUk4sIGZvciBleGFtcGxlXG4gICAqIGBhcm46YXdzOndhZnYyOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6Z2xvYmFsL3dlYmFjbC9FeGFtcGxlV2ViQUNMLzQ3M2U2NGZkLWYzMGItNDc2NS04MWEwLTYyYWQ5NmRkMTY3YWAuXG4gICAqXG4gICAqIFRvIHNwZWNpZnkgYSB3ZWIgQUNMIGNyZWF0ZWQgdXNpbmcgQVdTIFdBRiBDbGFzc2ljLCB1c2UgdGhlIEFDTCBJRCwgZm9yIGV4YW1wbGUgYDQ3M2U2NGZkLWYzMGItNDc2NS04MWEwLTYyYWQ5NmRkMTY3YWAuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3dhZi9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvd2hhdC1pcy1hd3Mtd2FmLmh0bWxcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2xvdWRmcm9udC9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9DcmVhdGVEaXN0cmlidXRpb24uaHRtbCNBUElfQ3JlYXRlRGlzdHJpYnV0aW9uX1JlcXVlc3RQYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIEFXUyBXZWIgQXBwbGljYXRpb24gRmlyZXdhbGwgd2ViIGFjY2VzcyBjb250cm9sIGxpc3QgKHdlYiBBQ0wpLlxuICAgKi9cbiAgcmVhZG9ubHkgd2ViQUNMSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHlvdSB3YW50IHZpZXdlcnMgdG8gdXNlIEhUVFAgb3IgSFRUUFMgdG8gcmVxdWVzdCB5b3VyIG9iamVjdHMsXG4gICAqIHdoZXRoZXIgeW91J3JlIHVzaW5nIGFuIGFsdGVybmF0ZSBkb21haW4gbmFtZSB3aXRoIEhUVFBTLCBhbmQgaWYgc28sXG4gICAqIGlmIHlvdSdyZSB1c2luZyBBV1MgQ2VydGlmaWNhdGUgTWFuYWdlciAoQUNNKSBvciBhIHRoaXJkLXBhcnR5IGNlcnRpZmljYXRlIGF1dGhvcml0eS5cbiAgICpcbiAgICogQGRlZmF1bHQgVmlld2VyQ2VydGlmaWNhdGUuZnJvbUNsb3VkRnJvbnREZWZhdWx0Q2VydGlmaWNhdGUoKVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vYXdzLmFtYXpvbi5jb20vcHJlbWl1bXN1cHBvcnQva25vd2xlZGdlLWNlbnRlci9jdXN0b20tc3NsLWNlcnRpZmljYXRlLWNsb3VkZnJvbnQvXG4gICAqL1xuICByZWFkb25seSB2aWV3ZXJDZXJ0aWZpY2F0ZT86IFZpZXdlckNlcnRpZmljYXRlO1xuXG4gIC8qKlxuICAgKiBDb250cm9scyB0aGUgY291bnRyaWVzIGluIHdoaWNoIHlvdXIgY29udGVudCBpcyBkaXN0cmlidXRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gZ2VvIHJlc3RyaWN0aW9uXG4gICAqL1xuICByZWFkb25seSBnZW9SZXN0cmljdGlvbj86IEdlb1Jlc3RyaWN0aW9uO1xufVxuXG4vKipcbiAqIEludGVybmFsIG9ubHkgLSBqdXN0IGFkZHMgdGhlIG9yaWdpbklkIHN0cmluZyB0byB0aGUgQmVoYXZpb3JcbiAqL1xuaW50ZXJmYWNlIEJlaGF2aW9yV2l0aE9yaWdpbiBleHRlbmRzIEJlaGF2aW9yIHtcbiAgcmVhZG9ubHkgdGFyZ2V0T3JpZ2luSWQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBdHRyaWJ1dGVzIHVzZWQgdG8gaW1wb3J0IGEgRGlzdHJpYnV0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb25BdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBnZW5lcmF0ZWQgZG9tYWluIG5hbWUgb2YgdGhlIERpc3RyaWJ1dGlvbiwgc3VjaCBhcyBkMTExMTExYWJjZGVmOC5jbG91ZGZyb250Lm5ldC5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgZG9tYWluTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGlzdHJpYnV0aW9uIElEIGZvciB0aGlzIGRpc3RyaWJ1dGlvbi5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgZGlzdHJpYnV0aW9uSWQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBbWF6b24gQ2xvdWRGcm9udCBpcyBhIGdsb2JhbCBjb250ZW50IGRlbGl2ZXJ5IG5ldHdvcmsgKENETikgc2VydmljZSB0aGF0IHNlY3VyZWx5IGRlbGl2ZXJzIGRhdGEsIHZpZGVvcyxcbiAqIGFwcGxpY2F0aW9ucywgYW5kIEFQSXMgdG8geW91ciB2aWV3ZXJzIHdpdGggbG93IGxhdGVuY3kgYW5kIGhpZ2ggdHJhbnNmZXIgc3BlZWRzLlxuICogQ2xvdWRGcm9udCBmcm9udHMgdXNlciBwcm92aWRlZCBjb250ZW50IGFuZCBjYWNoZXMgaXQgYXQgZWRnZSBsb2NhdGlvbnMgYWNyb3NzIHRoZSB3b3JsZC5cbiAqXG4gKiBIZXJlJ3MgaG93IHlvdSBjYW4gdXNlIHRoaXMgY29uc3RydWN0OlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBzb3VyY2VCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdCdWNrZXQnKTtcbiAqXG4gKiBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgY2xvdWRmcm9udC5DbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHRoaXMsICdNeURpc3RyaWJ1dGlvbicsIHtcbiAqICAgb3JpZ2luQ29uZmlnczogW1xuICogICAgIHtcbiAqICAgICAgIHMzT3JpZ2luU291cmNlOiB7XG4gKiAgICAgICBzM0J1Y2tldFNvdXJjZTogc291cmNlQnVja2V0LFxuICogICAgICAgfSxcbiAqICAgICAgIGJlaGF2aW9ycyA6IFsge2lzRGVmYXVsdEJlaGF2aW9yOiB0cnVlfV0sXG4gKiAgICAgfSxcbiAqICAgXSxcbiAqIH0pO1xuICogYGBgXG4gKlxuICogVGhpcyB3aWxsIGNyZWF0ZSBhIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uIHRoYXQgdXNlcyB5b3VyIFMzQnVja2V0IGFzIGl0J3Mgb3JpZ2luLlxuICpcbiAqIFlvdSBjYW4gY3VzdG9taXplIHRoZSBkaXN0cmlidXRpb24gdXNpbmcgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIGZyb20gdGhlIENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb25Qcm9wcyBpbnRlcmZhY2UuXG4gKlxuICogQHJlc291cmNlIEFXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uIGV4dGVuZHMgY2RrLlJlc291cmNlIGltcGxlbWVudHMgSURpc3RyaWJ1dGlvbiB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjb25zdHJ1Y3QgdGhhdCByZXByZXNlbnRzIGFuIGV4dGVybmFsIChpbXBvcnRlZCkgZGlzdHJpYnV0aW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRGlzdHJpYnV0aW9uQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbkF0dHJpYnV0ZXMpOiBJRGlzdHJpYnV0aW9uIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgY2RrLlJlc291cmNlIGltcGxlbWVudHMgSURpc3RyaWJ1dGlvbiB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZG9tYWluTmFtZTogc3RyaW5nO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGRpc3RyaWJ1dGlvbkRvbWFpbk5hbWU6IHN0cmluZztcbiAgICAgIHB1YmxpYyByZWFkb25seSBkaXN0cmlidXRpb25JZDogc3RyaW5nO1xuXG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICAgICAgdGhpcy5kb21haW5OYW1lID0gYXR0cnMuZG9tYWluTmFtZTtcbiAgICAgICAgdGhpcy5kaXN0cmlidXRpb25Eb21haW5OYW1lID0gYXR0cnMuZG9tYWluTmFtZTtcbiAgICAgICAgdGhpcy5kaXN0cmlidXRpb25JZCA9IGF0dHJzLmRpc3RyaWJ1dGlvbklkO1xuICAgICAgfVxuXG4gICAgICBwdWJsaWMgZ3JhbnQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUsIC4uLmFjdGlvbnM6IHN0cmluZ1tdKTogaWFtLkdyYW50IHtcbiAgICAgICAgcmV0dXJuIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7IGdyYW50ZWUsIGFjdGlvbnMsIHJlc291cmNlQXJuczogW2Zvcm1hdERpc3RyaWJ1dGlvbkFybih0aGlzKV0gfSk7XG4gICAgICB9XG4gICAgICBwdWJsaWMgZ3JhbnRDcmVhdGVJbnZhbGlkYXRpb24oaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JhbnQoaWRlbnRpdHksICdjbG91ZGZyb250OkNyZWF0ZUludmFsaWRhdGlvbicpO1xuICAgICAgfVxuICAgIH0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbG9nZ2luZyBidWNrZXQgZm9yIHRoaXMgQ2xvdWRGcm9udCBkaXN0cmlidXRpb24uXG4gICAqIElmIGxvZ2dpbmcgaXMgbm90IGVuYWJsZWQgZm9yIHRoaXMgZGlzdHJpYnV0aW9uIC0gdGhpcyBwcm9wZXJ0eSB3aWxsIGJlIHVuZGVmaW5lZC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBsb2dnaW5nQnVja2V0PzogczMuSUJ1Y2tldDtcblxuICAvKipcbiAgICogVGhlIGRvbWFpbiBuYW1lIGNyZWF0ZWQgYnkgQ2xvdWRGcm9udCBmb3IgdGhpcyBkaXN0cmlidXRpb24uXG4gICAqIElmIHlvdSBhcmUgdXNpbmcgYWxpYXNlcyBmb3IgeW91ciBkaXN0cmlidXRpb24sIHRoaXMgaXMgdGhlIGRvbWFpbk5hbWUgeW91ciBETlMgcmVjb3JkcyBzaG91bGQgcG9pbnQgdG8uXG4gICAqIChJbiBSb3V0ZTUzLCB5b3UgY291bGQgY3JlYXRlIGFuIEFMSUFTIHJlY29yZCB0byB0aGlzIHZhbHVlLCBmb3IgZXhhbXBsZS4pXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIC0gVXNlIGBkaXN0cmlidXRpb25Eb21haW5OYW1lYCBpbnN0ZWFkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRvbWFpbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRvbWFpbiBuYW1lIGNyZWF0ZWQgYnkgQ2xvdWRGcm9udCBmb3IgdGhpcyBkaXN0cmlidXRpb24uXG4gICAqIElmIHlvdSBhcmUgdXNpbmcgYWxpYXNlcyBmb3IgeW91ciBkaXN0cmlidXRpb24sIHRoaXMgaXMgdGhlIGRvbWFpbk5hbWUgeW91ciBETlMgcmVjb3JkcyBzaG91bGQgcG9pbnQgdG8uXG4gICAqIChJbiBSb3V0ZTUzLCB5b3UgY291bGQgY3JlYXRlIGFuIEFMSUFTIHJlY29yZCB0byB0aGlzIHZhbHVlLCBmb3IgZXhhbXBsZS4pXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGlzdHJpYnV0aW9uRG9tYWluTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGlzdHJpYnV0aW9uIElEIGZvciB0aGlzIGRpc3RyaWJ1dGlvbi5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkaXN0cmlidXRpb25JZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBNYXBzIG91ciBtZXRob2RzIHRvIHRoZSBzdHJpbmcgYXJyYXlzIHRoZXkgYXJlXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IE1FVEhPRF9MT09LVVBfTUFQID0ge1xuICAgIEdIOiBbJ0dFVCcsICdIRUFEJ10sXG4gICAgR0hPOiBbJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnXSxcbiAgICBBTEw6IFsnREVMRVRFJywgJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnLCAnUEFUQ0gnLCAnUE9TVCcsICdQVVQnXSxcbiAgfTtcblxuICAvKipcbiAgICogTWFwcyBmb3Igd2hpY2ggU2VjdXJpdHlQb2xpY3lQcm90b2NvbCBhcmUgYXZhaWxhYmxlIHRvIHdoaWNoIFNTTE1ldGhvZHNcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgVkFMSURfU1NMX1BST1RPQ09MUzogeyBbbWV0aG9kIGluIFNTTE1ldGhvZF06IHN0cmluZ1tdIH0gPSB7XG4gICAgW1NTTE1ldGhvZC5TTkldOiBbXG4gICAgICBTZWN1cml0eVBvbGljeVByb3RvY29sLlRMU19WMSwgU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5UTFNfVjFfMV8yMDE2LFxuICAgICAgU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5UTFNfVjFfMjAxNiwgU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5UTFNfVjFfMl8yMDE4LFxuICAgICAgU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5UTFNfVjFfMl8yMDE5LCBTZWN1cml0eVBvbGljeVByb3RvY29sLlRMU19WMV8yXzIwMjEsXG4gICAgXSxcbiAgICBbU1NMTWV0aG9kLlZJUF06IFtTZWN1cml0eVBvbGljeVByb3RvY29sLlNTTF9WMywgU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5UTFNfVjFdLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gQ29tbWVudHMgaGF2ZSBhbiB1bmRvY3VtZW50ZWQgbGltaXQgb2YgMTI4IGNoYXJhY3RlcnNcbiAgICBjb25zdCB0cmltbWVkQ29tbWVudCA9XG4gICAgICBwcm9wcy5jb21tZW50ICYmIHByb3BzLmNvbW1lbnQubGVuZ3RoID4gMTI4XG4gICAgICAgID8gYCR7cHJvcHMuY29tbWVudC5zbGljZSgwLCAxMjggLSAzKX0uLi5gXG4gICAgICAgIDogcHJvcHMuY29tbWVudDtcblxuICAgIGNvbnN0IGJlaGF2aW9yczogQmVoYXZpb3JXaXRoT3JpZ2luW10gPSBbXTtcblxuICAgIGNvbnN0IG9yaWdpbnM6IENmbkRpc3RyaWJ1dGlvbi5PcmlnaW5Qcm9wZXJ0eVtdID0gW107XG5cbiAgICBjb25zdCBvcmlnaW5Hcm91cHM6IENmbkRpc3RyaWJ1dGlvbi5PcmlnaW5Hcm91cFByb3BlcnR5W10gPSBbXTtcblxuICAgIGxldCBvcmlnaW5JbmRleCA9IDE7XG4gICAgZm9yIChjb25zdCBvcmlnaW5Db25maWcgb2YgcHJvcHMub3JpZ2luQ29uZmlncykge1xuICAgICAgbGV0IG9yaWdpbklkID0gYG9yaWdpbiR7b3JpZ2luSW5kZXh9YDtcbiAgICAgIGNvbnN0IG9yaWdpblByb3BlcnR5ID0gdGhpcy50b09yaWdpblByb3BlcnR5KG9yaWdpbkNvbmZpZywgb3JpZ2luSWQpO1xuXG4gICAgICBpZiAob3JpZ2luQ29uZmlnLmZhaWxvdmVyQ3VzdG9tT3JpZ2luU291cmNlIHx8IG9yaWdpbkNvbmZpZy5mYWlsb3ZlclMzT3JpZ2luU291cmNlKSB7XG4gICAgICAgIGNvbnN0IG9yaWdpblNlY29uZGFyeUlkID0gYG9yaWdpblNlY29uZGFyeSR7b3JpZ2luSW5kZXh9YDtcbiAgICAgICAgY29uc3Qgb3JpZ2luU2Vjb25kYXJ5UHJvcGVydHkgPSB0aGlzLnRvT3JpZ2luUHJvcGVydHkoXG4gICAgICAgICAge1xuICAgICAgICAgICAgczNPcmlnaW5Tb3VyY2U6IG9yaWdpbkNvbmZpZy5mYWlsb3ZlclMzT3JpZ2luU291cmNlLFxuICAgICAgICAgICAgY3VzdG9tT3JpZ2luU291cmNlOiBvcmlnaW5Db25maWcuZmFpbG92ZXJDdXN0b21PcmlnaW5Tb3VyY2UsXG4gICAgICAgICAgICBvcmlnaW5QYXRoOiBvcmlnaW5Db25maWcub3JpZ2luUGF0aCxcbiAgICAgICAgICAgIG9yaWdpbkhlYWRlcnM6IG9yaWdpbkNvbmZpZy5vcmlnaW5IZWFkZXJzLFxuICAgICAgICAgICAgb3JpZ2luU2hpZWxkUmVnaW9uOiBvcmlnaW5Db25maWcub3JpZ2luU2hpZWxkUmVnaW9uLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgb3JpZ2luU2Vjb25kYXJ5SWQsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IG9yaWdpbkdyb3Vwc0lkID0gYE9yaWdpbkdyb3VwJHtvcmlnaW5JbmRleH1gO1xuICAgICAgICBjb25zdCBmYWlsb3ZlckNvZGVzID0gb3JpZ2luQ29uZmlnLmZhaWxvdmVyQ3JpdGVyaWFTdGF0dXNDb2RlcyA/PyBbNTAwLCA1MDIsIDUwMywgNTA0XTtcbiAgICAgICAgb3JpZ2luR3JvdXBzLnB1c2goe1xuICAgICAgICAgIGlkOiBvcmlnaW5Hcm91cHNJZCxcbiAgICAgICAgICBtZW1iZXJzOiB7XG4gICAgICAgICAgICBpdGVtczogW3sgb3JpZ2luSWQgfSwgeyBvcmlnaW5JZDogb3JpZ2luU2Vjb25kYXJ5SWQgfV0sXG4gICAgICAgICAgICBxdWFudGl0eTogMixcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZhaWxvdmVyQ3JpdGVyaWE6IHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGVzOiB7XG4gICAgICAgICAgICAgIGl0ZW1zOiBmYWlsb3ZlckNvZGVzLFxuICAgICAgICAgICAgICBxdWFudGl0eTogZmFpbG92ZXJDb2Rlcy5sZW5ndGgsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBvcmlnaW5JZCA9IG9yaWdpbkdyb3Vwc0lkO1xuICAgICAgICBvcmlnaW5zLnB1c2gob3JpZ2luU2Vjb25kYXJ5UHJvcGVydHkpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGNvbnN0IGJlaGF2aW9yIG9mIG9yaWdpbkNvbmZpZy5iZWhhdmlvcnMpIHtcbiAgICAgICAgYmVoYXZpb3JzLnB1c2goeyAuLi5iZWhhdmlvciwgdGFyZ2V0T3JpZ2luSWQ6IG9yaWdpbklkIH0pO1xuICAgICAgfVxuXG4gICAgICBvcmlnaW5zLnB1c2gob3JpZ2luUHJvcGVydHkpO1xuICAgICAgb3JpZ2luSW5kZXgrKztcbiAgICB9XG5cbiAgICBvcmlnaW5zLmZvckVhY2gob3JpZ2luID0+IHtcbiAgICAgIGlmICghb3JpZ2luLnMzT3JpZ2luQ29uZmlnICYmICFvcmlnaW4uY3VzdG9tT3JpZ2luQ29uZmlnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgT3JpZ2luICR7b3JpZ2luLmRvbWFpbk5hbWV9IGlzIG1pc3NpbmcgZWl0aGVyIFMzT3JpZ2luQ29uZmlnIG9yIEN1c3RvbU9yaWdpbkNvbmZpZy4gQXQgbGVhc3QgMSBtdXN0IGJlIHNwZWNpZmllZC5gKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBvcmlnaW5Hcm91cHNEaXN0Q29uZmlnID1cbiAgICAgIG9yaWdpbkdyb3Vwcy5sZW5ndGggPiAwXG4gICAgICAgID8ge1xuICAgICAgICAgIGl0ZW1zOiBvcmlnaW5Hcm91cHMsXG4gICAgICAgICAgcXVhbnRpdHk6IG9yaWdpbkdyb3Vwcy5sZW5ndGgsXG4gICAgICAgIH1cbiAgICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBkZWZhdWx0QmVoYXZpb3JzID0gYmVoYXZpb3JzLmZpbHRlcihiZWhhdmlvciA9PiBiZWhhdmlvci5pc0RlZmF1bHRCZWhhdmlvcik7XG4gICAgaWYgKGRlZmF1bHRCZWhhdmlvcnMubGVuZ3RoICE9PSAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZXJlIGNhbiBvbmx5IGJlIG9uZSBkZWZhdWx0IGJlaGF2aW9yIGFjcm9zcyBhbGwgc291cmNlcy4gWyBPbmUgZGVmYXVsdCBiZWhhdmlvciBwZXIgZGlzdHJpYnV0aW9uIF0uJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3RoZXJCZWhhdmlvcnM6IENmbkRpc3RyaWJ1dGlvbi5DYWNoZUJlaGF2aW9yUHJvcGVydHlbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgYmVoYXZpb3Igb2YgYmVoYXZpb3JzLmZpbHRlcihiID0+ICFiLmlzRGVmYXVsdEJlaGF2aW9yKSkge1xuICAgICAgaWYgKCFiZWhhdmlvci5wYXRoUGF0dGVybikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BhdGhQYXR0ZXJuIGlzIHJlcXVpcmVkIGZvciBhbGwgbm9uLWRlZmF1bHQgYmVoYXZpb3JzJyk7XG4gICAgICB9XG4gICAgICBvdGhlckJlaGF2aW9ycy5wdXNoKHRoaXMudG9CZWhhdmlvcihiZWhhdmlvciwgcHJvcHMudmlld2VyUHJvdG9jb2xQb2xpY3kpIGFzIENmbkRpc3RyaWJ1dGlvbi5DYWNoZUJlaGF2aW9yUHJvcGVydHkpO1xuICAgIH1cblxuICAgIGxldCBkaXN0cmlidXRpb25Db25maWc6IENmbkRpc3RyaWJ1dGlvbi5EaXN0cmlidXRpb25Db25maWdQcm9wZXJ0eSA9IHtcbiAgICAgIGNvbW1lbnQ6IHRyaW1tZWRDb21tZW50LFxuICAgICAgZW5hYmxlZDogcHJvcHMuZW5hYmxlZCA/PyB0cnVlLFxuICAgICAgZGVmYXVsdFJvb3RPYmplY3Q6IHByb3BzLmRlZmF1bHRSb290T2JqZWN0ID8/ICdpbmRleC5odG1sJyxcbiAgICAgIGh0dHBWZXJzaW9uOiBwcm9wcy5odHRwVmVyc2lvbiB8fCBIdHRwVmVyc2lvbi5IVFRQMixcbiAgICAgIHByaWNlQ2xhc3M6IHByb3BzLnByaWNlQ2xhc3MgfHwgUHJpY2VDbGFzcy5QUklDRV9DTEFTU18xMDAsXG4gICAgICBpcHY2RW5hYmxlZDogcHJvcHMuZW5hYmxlSXBWNiA/PyB0cnVlLFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgIGN1c3RvbUVycm9yUmVzcG9uc2VzOiBwcm9wcy5lcnJvckNvbmZpZ3VyYXRpb25zLCAvLyBUT0RPOiB2YWxpZGF0aW9uIDogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtY2xvdWRmcm9udC1kaXN0cmlidXRpb24tY3VzdG9tZXJyb3JyZXNwb25zZS5odG1sI2Nmbi1jbG91ZGZyb250LWRpc3RyaWJ1dGlvbi1jdXN0b21lcnJvcnJlc3BvbnNlLWVycm9yY2FjaGluZ21pbnR0bFxuICAgICAgd2ViQWNsSWQ6IHByb3BzLndlYkFDTElkLFxuXG4gICAgICBvcmlnaW5zLFxuICAgICAgb3JpZ2luR3JvdXBzOiBvcmlnaW5Hcm91cHNEaXN0Q29uZmlnLFxuXG4gICAgICBkZWZhdWx0Q2FjaGVCZWhhdmlvcjogdGhpcy50b0JlaGF2aW9yKGRlZmF1bHRCZWhhdmlvcnNbMF0sIHByb3BzLnZpZXdlclByb3RvY29sUG9saWN5KSxcbiAgICAgIGNhY2hlQmVoYXZpb3JzOiBvdGhlckJlaGF2aW9ycy5sZW5ndGggPiAwID8gb3RoZXJCZWhhdmlvcnMgOiB1bmRlZmluZWQsXG4gICAgfTtcblxuICAgIGlmIChwcm9wcy5hbGlhc0NvbmZpZ3VyYXRpb24gJiYgcHJvcHMudmlld2VyQ2VydGlmaWNhdGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihbXG4gICAgICAgICdZb3UgY2Fubm90IHNldCBib3RoIGFsaWFzQ29uZmlndXJhdGlvbiBhbmQgdmlld2VyQ2VydGlmaWNhdGUgcHJvcGVydGllcy4nLFxuICAgICAgICAnUGxlYXNlIG9ubHkgdXNlIHZpZXdlckNlcnRpZmljYXRlLCBhcyBhbGlhc0NvbmZpZ3VyYXRpb24gaXMgZGVwcmVjYXRlZC4nLFxuICAgICAgXS5qb2luKCcgJykpO1xuICAgIH1cblxuICAgIGxldCBfdmlld2VyQ2VydGlmaWNhdGUgPSBwcm9wcy52aWV3ZXJDZXJ0aWZpY2F0ZTtcbiAgICBpZiAocHJvcHMuYWxpYXNDb25maWd1cmF0aW9uKSB7XG4gICAgICBjb25zdCB7IGFjbUNlcnRSZWYsIHNlY3VyaXR5UG9saWN5LCBzc2xNZXRob2QsIG5hbWVzOiBhbGlhc2VzIH0gPSBwcm9wcy5hbGlhc0NvbmZpZ3VyYXRpb247XG5cbiAgICAgIF92aWV3ZXJDZXJ0aWZpY2F0ZSA9IFZpZXdlckNlcnRpZmljYXRlLmZyb21BY21DZXJ0aWZpY2F0ZShcbiAgICAgICAgY2VydGlmaWNhdGVtYW5hZ2VyLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybih0aGlzLCAnQWxpYXNDb25maWd1cmF0aW9uQ2VydCcsIGFjbUNlcnRSZWYpLFxuICAgICAgICB7IHNlY3VyaXR5UG9saWN5LCBzc2xNZXRob2QsIGFsaWFzZXMgfSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKF92aWV3ZXJDZXJ0aWZpY2F0ZSkge1xuICAgICAgY29uc3QgeyBwcm9wczogdmlld2VyQ2VydGlmaWNhdGUsIGFsaWFzZXMgfSA9IF92aWV3ZXJDZXJ0aWZpY2F0ZTtcbiAgICAgIE9iamVjdC5hc3NpZ24oZGlzdHJpYnV0aW9uQ29uZmlnLCB7IGFsaWFzZXMsIHZpZXdlckNlcnRpZmljYXRlIH0pO1xuXG4gICAgICBjb25zdCB7IG1pbmltdW1Qcm90b2NvbFZlcnNpb24sIHNzbFN1cHBvcnRNZXRob2QgfSA9IHZpZXdlckNlcnRpZmljYXRlO1xuXG4gICAgICBpZiAobWluaW11bVByb3RvY29sVmVyc2lvbiAhPSBudWxsICYmIHNzbFN1cHBvcnRNZXRob2QgIT0gbnVsbCkge1xuICAgICAgICBjb25zdCB2YWxpZFByb3RvY29scyA9IHRoaXMuVkFMSURfU1NMX1BST1RPQ09MU1tzc2xTdXBwb3J0TWV0aG9kIGFzIFNTTE1ldGhvZF07XG5cbiAgICAgICAgaWYgKHZhbGlkUHJvdG9jb2xzLmluZGV4T2YobWluaW11bVByb3RvY29sVmVyc2lvbi50b1N0cmluZygpKSA9PT0gLTEpIHtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHttaW5pbXVtUHJvdG9jb2xWZXJzaW9ufSBpcyBub3QgY29tcGFidGlibGUgd2l0aCBzc2xNZXRob2QgJHtzc2xTdXBwb3J0TWV0aG9kfS5cXG5cXHRWYWxpZCBQcm90b2NvbHMgYXJlOiAke3ZhbGlkUHJvdG9jb2xzLmpvaW4oJywgJyl9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGlzdHJpYnV0aW9uQ29uZmlnID0ge1xuICAgICAgICAuLi5kaXN0cmlidXRpb25Db25maWcsXG4gICAgICAgIHZpZXdlckNlcnRpZmljYXRlOiB7IGNsb3VkRnJvbnREZWZhdWx0Q2VydGlmaWNhdGU6IHRydWUgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmxvZ2dpbmdDb25maWcpIHtcbiAgICAgIHRoaXMubG9nZ2luZ0J1Y2tldCA9IHByb3BzLmxvZ2dpbmdDb25maWcuYnVja2V0IHx8IG5ldyBzMy5CdWNrZXQodGhpcywgJ0xvZ2dpbmdCdWNrZXQnLCB7XG4gICAgICAgIGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uUzNfTUFOQUdFRCxcbiAgICAgIH0pO1xuICAgICAgZGlzdHJpYnV0aW9uQ29uZmlnID0ge1xuICAgICAgICAuLi5kaXN0cmlidXRpb25Db25maWcsXG4gICAgICAgIGxvZ2dpbmc6IHtcbiAgICAgICAgICBidWNrZXQ6IHRoaXMubG9nZ2luZ0J1Y2tldC5idWNrZXRSZWdpb25hbERvbWFpbk5hbWUsXG4gICAgICAgICAgaW5jbHVkZUNvb2tpZXM6IHByb3BzLmxvZ2dpbmdDb25maWcuaW5jbHVkZUNvb2tpZXMgfHwgZmFsc2UsXG4gICAgICAgICAgcHJlZml4OiBwcm9wcy5sb2dnaW5nQ29uZmlnLnByZWZpeCxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmdlb1Jlc3RyaWN0aW9uKSB7XG4gICAgICBkaXN0cmlidXRpb25Db25maWcgPSB7XG4gICAgICAgIC4uLmRpc3RyaWJ1dGlvbkNvbmZpZyxcbiAgICAgICAgcmVzdHJpY3Rpb25zOiB7XG4gICAgICAgICAgZ2VvUmVzdHJpY3Rpb246IHtcbiAgICAgICAgICAgIHJlc3RyaWN0aW9uVHlwZTogcHJvcHMuZ2VvUmVzdHJpY3Rpb24ucmVzdHJpY3Rpb25UeXBlLFxuICAgICAgICAgICAgbG9jYXRpb25zOiBwcm9wcy5nZW9SZXN0cmljdGlvbi5sb2NhdGlvbnMsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgZGlzdHJpYnV0aW9uID0gbmV3IENmbkRpc3RyaWJ1dGlvbih0aGlzLCAnQ0ZEaXN0cmlidXRpb24nLCB7IGRpc3RyaWJ1dGlvbkNvbmZpZyB9KTtcbiAgICB0aGlzLm5vZGUuZGVmYXVsdENoaWxkID0gZGlzdHJpYnV0aW9uO1xuICAgIHRoaXMuZG9tYWluTmFtZSA9IGRpc3RyaWJ1dGlvbi5hdHRyRG9tYWluTmFtZTtcbiAgICB0aGlzLmRpc3RyaWJ1dGlvbkRvbWFpbk5hbWUgPSBkaXN0cmlidXRpb24uYXR0ckRvbWFpbk5hbWU7XG4gICAgdGhpcy5kaXN0cmlidXRpb25JZCA9IGRpc3RyaWJ1dGlvbi5yZWY7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBJQU0gcG9saWN5IHN0YXRlbWVudCBhc3NvY2lhdGVkIHdpdGggdGhpcyBkaXN0cmlidXRpb24gdG8gYW4gSUFNXG4gICAqIHByaW5jaXBhbCdzIHBvbGljeS5cbiAgICpcbiAgICogQHBhcmFtIGlkZW50aXR5IFRoZSBwcmluY2lwYWxcbiAgICogQHBhcmFtIGFjdGlvbnMgVGhlIHNldCBvZiBhY3Rpb25zIHRvIGFsbG93IChpLmUuIFwiY2xvdWRmcm9udDpMaXN0SW52YWxpZGF0aW9uc1wiKVxuICAgKi9cbiAgcHVibGljIGdyYW50KGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSwgLi4uYWN0aW9uczogc3RyaW5nW10pOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiBpYW0uR3JhbnQuYWRkVG9QcmluY2lwYWwoeyBncmFudGVlOiBpZGVudGl0eSwgYWN0aW9ucywgcmVzb3VyY2VBcm5zOiBbZm9ybWF0RGlzdHJpYnV0aW9uQXJuKHRoaXMpXSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCB0byBjcmVhdGUgaW52YWxpZGF0aW9ucyBmb3IgdGhpcyBidWNrZXQgdG8gYW4gSUFNIHByaW5jaXBhbCAoUm9sZS9Hcm91cC9Vc2VyKS5cbiAgICpcbiAgICogQHBhcmFtIGlkZW50aXR5IFRoZSBwcmluY2lwYWxcbiAgICovXG4gIGdyYW50Q3JlYXRlSW52YWxpZGF0aW9uKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbnQoaWRlbnRpdHksICdjbG91ZGZyb250OkNyZWF0ZUludmFsaWRhdGlvbicpO1xuICB9XG5cbiAgcHJpdmF0ZSB0b0JlaGF2aW9yKGlucHV0OiBCZWhhdmlvcldpdGhPcmlnaW4sIHByb3RvUG9saWN5PzogVmlld2VyUHJvdG9jb2xQb2xpY3kpIHtcbiAgICBsZXQgdG9SZXR1cm4gPSB7XG4gICAgICBhbGxvd2VkTWV0aG9kczogdGhpcy5NRVRIT0RfTE9PS1VQX01BUFtpbnB1dC5hbGxvd2VkTWV0aG9kcyB8fCBDbG91ZEZyb250QWxsb3dlZE1ldGhvZHMuR0VUX0hFQURdLFxuICAgICAgY2FjaGVkTWV0aG9kczogdGhpcy5NRVRIT0RfTE9PS1VQX01BUFtpbnB1dC5jYWNoZWRNZXRob2RzIHx8IENsb3VkRnJvbnRBbGxvd2VkQ2FjaGVkTWV0aG9kcy5HRVRfSEVBRF0sXG4gICAgICBjb21wcmVzczogaW5wdXQuY29tcHJlc3MgIT09IGZhbHNlLFxuICAgICAgZGVmYXVsdFR0bDogaW5wdXQuZGVmYXVsdFR0bCAmJiBpbnB1dC5kZWZhdWx0VHRsLnRvU2Vjb25kcygpLFxuICAgICAgZm9yd2FyZGVkVmFsdWVzOiBpbnB1dC5mb3J3YXJkZWRWYWx1ZXMgfHwgeyBxdWVyeVN0cmluZzogZmFsc2UsIGNvb2tpZXM6IHsgZm9yd2FyZDogJ25vbmUnIH0gfSxcbiAgICAgIG1heFR0bDogaW5wdXQubWF4VHRsICYmIGlucHV0Lm1heFR0bC50b1NlY29uZHMoKSxcbiAgICAgIG1pblR0bDogaW5wdXQubWluVHRsICYmIGlucHV0Lm1pblR0bC50b1NlY29uZHMoKSxcbiAgICAgIHRydXN0ZWRLZXlHcm91cHM6IGlucHV0LnRydXN0ZWRLZXlHcm91cHM/Lm1hcChrZXkgPT4ga2V5LmtleUdyb3VwSWQpLFxuICAgICAgdHJ1c3RlZFNpZ25lcnM6IGlucHV0LnRydXN0ZWRTaWduZXJzLFxuICAgICAgdGFyZ2V0T3JpZ2luSWQ6IGlucHV0LnRhcmdldE9yaWdpbklkLFxuICAgICAgdmlld2VyUHJvdG9jb2xQb2xpY3k6IGlucHV0LnZpZXdlclByb3RvY29sUG9saWN5IHx8IHByb3RvUG9saWN5IHx8IFZpZXdlclByb3RvY29sUG9saWN5LlJFRElSRUNUX1RPX0hUVFBTLFxuICAgIH07XG4gICAgaWYgKCFpbnB1dC5pc0RlZmF1bHRCZWhhdmlvcikge1xuICAgICAgdG9SZXR1cm4gPSBPYmplY3QuYXNzaWduKHRvUmV0dXJuLCB7IHBhdGhQYXR0ZXJuOiBpbnB1dC5wYXRoUGF0dGVybiB9KTtcbiAgICB9XG4gICAgaWYgKGlucHV0LmZ1bmN0aW9uQXNzb2NpYXRpb25zKSB7XG4gICAgICB0b1JldHVybiA9IE9iamVjdC5hc3NpZ24odG9SZXR1cm4sIHtcbiAgICAgICAgZnVuY3Rpb25Bc3NvY2lhdGlvbnM6IGlucHV0LmZ1bmN0aW9uQXNzb2NpYXRpb25zLm1hcChhc3NvY2lhdGlvbiA9PiAoe1xuICAgICAgICAgIGZ1bmN0aW9uQXJuOiBhc3NvY2lhdGlvbi5mdW5jdGlvbi5mdW5jdGlvbkFybixcbiAgICAgICAgICBldmVudFR5cGU6IGFzc29jaWF0aW9uLmV2ZW50VHlwZS50b1N0cmluZygpLFxuICAgICAgICB9KSksXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGlucHV0LmxhbWJkYUZ1bmN0aW9uQXNzb2NpYXRpb25zKSB7XG4gICAgICBjb25zdCBpbmNsdWRlQm9keUV2ZW50VHlwZXMgPSBbTGFtYmRhRWRnZUV2ZW50VHlwZS5PUklHSU5fUkVRVUVTVCwgTGFtYmRhRWRnZUV2ZW50VHlwZS5WSUVXRVJfUkVRVUVTVF07XG4gICAgICBpZiAoaW5wdXQubGFtYmRhRnVuY3Rpb25Bc3NvY2lhdGlvbnMuc29tZShmbmEgPT4gZm5hLmluY2x1ZGVCb2R5ICYmICFpbmNsdWRlQm9keUV2ZW50VHlwZXMuaW5jbHVkZXMoZm5hLmV2ZW50VHlwZSkpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXFwnaW5jbHVkZUJvZHlcXCcgY2FuIG9ubHkgYmUgdHJ1ZSBmb3IgT1JJR0lOX1JFUVVFU1Qgb3IgVklFV0VSX1JFUVVFU1QgZXZlbnQgdHlwZXMuJyk7XG4gICAgICB9XG5cbiAgICAgIHRvUmV0dXJuID0gT2JqZWN0LmFzc2lnbih0b1JldHVybiwge1xuICAgICAgICBsYW1iZGFGdW5jdGlvbkFzc29jaWF0aW9uczogaW5wdXQubGFtYmRhRnVuY3Rpb25Bc3NvY2lhdGlvbnNcbiAgICAgICAgICAubWFwKGZuYSA9PiAoe1xuICAgICAgICAgICAgZXZlbnRUeXBlOiBmbmEuZXZlbnRUeXBlLFxuICAgICAgICAgICAgbGFtYmRhRnVuY3Rpb25Bcm46IGZuYS5sYW1iZGFGdW5jdGlvbiAmJiBmbmEubGFtYmRhRnVuY3Rpb24uZWRnZUFybixcbiAgICAgICAgICAgIGluY2x1ZGVCb2R5OiBmbmEuaW5jbHVkZUJvZHksXG4gICAgICAgICAgfSkpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIGFsbG93IGVkZ2VsYW1iZGEuYW1hem9uYXdzLmNvbSB0byBhc3N1bWUgdGhlIGZ1bmN0aW9ucycgZXhlY3V0aW9uIHJvbGUuXG4gICAgICBmb3IgKGNvbnN0IGEgb2YgaW5wdXQubGFtYmRhRnVuY3Rpb25Bc3NvY2lhdGlvbnMpIHtcbiAgICAgICAgaWYgKGEubGFtYmRhRnVuY3Rpb24ucm9sZSAmJiBpYW0uUm9sZS5pc1JvbGUoYS5sYW1iZGFGdW5jdGlvbi5yb2xlKSAmJiBhLmxhbWJkYUZ1bmN0aW9uLnJvbGUuYXNzdW1lUm9sZVBvbGljeSkge1xuICAgICAgICAgIGEubGFtYmRhRnVuY3Rpb24ucm9sZS5hc3N1bWVSb2xlUG9saWN5LmFkZFN0YXRlbWVudHMobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgYWN0aW9uczogWydzdHM6QXNzdW1lUm9sZSddLFxuICAgICAgICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWRnZWxhbWJkYS5hbWF6b25hd3MuY29tJyldLFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG9SZXR1cm47XG4gIH1cblxuICBwcml2YXRlIHRvT3JpZ2luUHJvcGVydHkob3JpZ2luQ29uZmlnOiBTb3VyY2VDb25maWd1cmF0aW9uUmVuZGVyLCBvcmlnaW5JZDogc3RyaW5nKTogQ2ZuRGlzdHJpYnV0aW9uLk9yaWdpblByb3BlcnR5IHtcbiAgICBpZiAoXG4gICAgICAhb3JpZ2luQ29uZmlnLnMzT3JpZ2luU291cmNlICYmXG4gICAgICAhb3JpZ2luQ29uZmlnLmN1c3RvbU9yaWdpblNvdXJjZVxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlcmUgbXVzdCBiZSBhdCBsZWFzdCBvbmUgb3JpZ2luIHNvdXJjZSAtIGVpdGhlciBhbiBzM09yaWdpblNvdXJjZSwgYSBjdXN0b21PcmlnaW5Tb3VyY2UnLFxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKG9yaWdpbkNvbmZpZy5jdXN0b21PcmlnaW5Tb3VyY2UgJiYgb3JpZ2luQ29uZmlnLnMzT3JpZ2luU291cmNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGVyZSBjYW5ub3QgYmUgYm90aCBhbiBzM09yaWdpblNvdXJjZSBhbmQgYSBjdXN0b21PcmlnaW5Tb3VyY2UgaW4gdGhlIHNhbWUgU291cmNlQ29uZmlndXJhdGlvbi4nLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoW1xuICAgICAgb3JpZ2luQ29uZmlnLm9yaWdpbkhlYWRlcnMsXG4gICAgICBvcmlnaW5Db25maWcuczNPcmlnaW5Tb3VyY2U/Lm9yaWdpbkhlYWRlcnMsXG4gICAgICBvcmlnaW5Db25maWcuY3VzdG9tT3JpZ2luU291cmNlPy5vcmlnaW5IZWFkZXJzLFxuICAgIF0uZmlsdGVyKHggPT4geCkubGVuZ3RoID4gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG9uZSBvcmlnaW5IZWFkZXJzIGZpZWxkIGFsbG93ZWQgYWNyb3NzIG9yaWdpbiBhbmQgZmFpbG92ZXIgb3JpZ2lucycpO1xuICAgIH1cblxuICAgIGlmIChbXG4gICAgICBvcmlnaW5Db25maWcub3JpZ2luUGF0aCxcbiAgICAgIG9yaWdpbkNvbmZpZy5zM09yaWdpblNvdXJjZT8ub3JpZ2luUGF0aCxcbiAgICAgIG9yaWdpbkNvbmZpZy5jdXN0b21PcmlnaW5Tb3VyY2U/Lm9yaWdpblBhdGgsXG4gICAgXS5maWx0ZXIoeCA9PiB4KS5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgb25lIG9yaWdpblBhdGggZmllbGQgYWxsb3dlZCBhY3Jvc3Mgb3JpZ2luIGFuZCBmYWlsb3ZlciBvcmlnaW5zJyk7XG4gICAgfVxuXG4gICAgaWYgKFtcbiAgICAgIG9yaWdpbkNvbmZpZy5vcmlnaW5TaGllbGRSZWdpb24sXG4gICAgICBvcmlnaW5Db25maWcuczNPcmlnaW5Tb3VyY2U/Lm9yaWdpblNoaWVsZFJlZ2lvbixcbiAgICAgIG9yaWdpbkNvbmZpZy5jdXN0b21PcmlnaW5Tb3VyY2U/Lm9yaWdpblNoaWVsZFJlZ2lvbixcbiAgICBdLmZpbHRlcih4ID0+IHgpLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBvbmUgb3JpZ2luU2hpZWxkUmVnaW9uIGZpZWxkIGFsbG93ZWQgYWNyb3NzIG9yaWdpbiBhbmQgZmFpbG92ZXIgb3JpZ2lucycpO1xuICAgIH1cblxuICAgIGNvbnN0IGhlYWRlcnMgPSBvcmlnaW5Db25maWcub3JpZ2luSGVhZGVycyA/PyBvcmlnaW5Db25maWcuczNPcmlnaW5Tb3VyY2U/Lm9yaWdpbkhlYWRlcnMgPz8gb3JpZ2luQ29uZmlnLmN1c3RvbU9yaWdpblNvdXJjZT8ub3JpZ2luSGVhZGVycztcblxuICAgIGNvbnN0IG9yaWdpbkhlYWRlcnM6IENmbkRpc3RyaWJ1dGlvbi5PcmlnaW5DdXN0b21IZWFkZXJQcm9wZXJ0eVtdID0gW107XG4gICAgaWYgKGhlYWRlcnMpIHtcbiAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBjb25zdCBvSGVhZGVyOiBDZm5EaXN0cmlidXRpb24uT3JpZ2luQ3VzdG9tSGVhZGVyUHJvcGVydHkgPSB7XG4gICAgICAgICAgaGVhZGVyTmFtZToga2V5LFxuICAgICAgICAgIGhlYWRlclZhbHVlOiBoZWFkZXJzW2tleV0sXG4gICAgICAgIH07XG4gICAgICAgIG9yaWdpbkhlYWRlcnMucHVzaChvSGVhZGVyKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGxldCBzM09yaWdpbkNvbmZpZzogQ2ZuRGlzdHJpYnV0aW9uLlMzT3JpZ2luQ29uZmlnUHJvcGVydHkgfCB1bmRlZmluZWQ7XG4gICAgaWYgKG9yaWdpbkNvbmZpZy5zM09yaWdpblNvdXJjZSkge1xuICAgICAgLy8gZmlyc3QgY2FzZSBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICAgIGlmIChvcmlnaW5Db25maWcuczNPcmlnaW5Tb3VyY2Uub3JpZ2luQWNjZXNzSWRlbnRpdHkpIHtcbiAgICAgICAgLy8gZ3JhbnQgQ2xvdWRGcm9udCBPcmlnaW5BY2Nlc3NJZGVudGl0eSByZWFkIGFjY2VzcyB0byBTMyBidWNrZXRcbiAgICAgICAgLy8gVXNlZCByYXRoZXIgdGhhbiBgZ3JhbnRSZWFkYCBiZWNhdXNlIGBncmFudFJlYWRgIHdpbGwgZ3JhbnQgb3Zlcmx5LXBlcm1pc3NpdmUgcG9saWNpZXMuXG4gICAgICAgIC8vIE9ubHkgR2V0T2JqZWN0IGlzIG5lZWRlZCB0byByZXRyaWV2ZSBvYmplY3RzIGZvciB0aGUgZGlzdHJpYnV0aW9uLlxuICAgICAgICAvLyBUaGlzIGFsc28gZXhjbHVkZXMgS01TIHBlcm1pc3Npb25zOyBjdXJyZW50bHksIE9BSSBvbmx5IHN1cHBvcnRzIFNTRS1TMyBmb3IgYnVja2V0cy5cbiAgICAgICAgLy8gU291cmNlOiBodHRwczovL2F3cy5hbWF6b24uY29tL2Jsb2dzL25ldHdvcmtpbmctYW5kLWNvbnRlbnQtZGVsaXZlcnkvc2VydmluZy1zc2Uta21zLWVuY3J5cHRlZC1jb250ZW50LWZyb20tczMtdXNpbmctY2xvdWRmcm9udC9cbiAgICAgICAgb3JpZ2luQ29uZmlnLnMzT3JpZ2luU291cmNlLnMzQnVja2V0U291cmNlLmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgIHJlc291cmNlczogW29yaWdpbkNvbmZpZy5zM09yaWdpblNvdXJjZS5zM0J1Y2tldFNvdXJjZS5hcm5Gb3JPYmplY3RzKCcqJyldLFxuICAgICAgICAgIGFjdGlvbnM6IFsnczM6R2V0T2JqZWN0J10sXG4gICAgICAgICAgcHJpbmNpcGFsczogW29yaWdpbkNvbmZpZy5zM09yaWdpblNvdXJjZS5vcmlnaW5BY2Nlc3NJZGVudGl0eS5ncmFudFByaW5jaXBhbF0sXG4gICAgICAgIH0pKTtcblxuICAgICAgICBzM09yaWdpbkNvbmZpZyA9IHtcbiAgICAgICAgICBvcmlnaW5BY2Nlc3NJZGVudGl0eTogYG9yaWdpbi1hY2Nlc3MtaWRlbnRpdHkvY2xvdWRmcm9udC8ke29yaWdpbkNvbmZpZy5zM09yaWdpblNvdXJjZS5vcmlnaW5BY2Nlc3NJZGVudGl0eS5vcmlnaW5BY2Nlc3NJZGVudGl0eUlkfWAsXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzM09yaWdpbkNvbmZpZyA9IHt9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNvbm5lY3Rpb25BdHRlbXB0cyA9IG9yaWdpbkNvbmZpZy5jb25uZWN0aW9uQXR0ZW1wdHMgPz8gMztcbiAgICBpZiAoY29ubmVjdGlvbkF0dGVtcHRzIDwgMSB8fCAzIDwgY29ubmVjdGlvbkF0dGVtcHRzIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKGNvbm5lY3Rpb25BdHRlbXB0cykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY29ubmVjdGlvbkF0dGVtcHRzOiBZb3UgY2FuIHNwZWNpZnkgMSwgMiwgb3IgMyBhcyB0aGUgbnVtYmVyIG9mIGF0dGVtcHRzLicpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbm5lY3Rpb25UaW1lb3V0ID0gKG9yaWdpbkNvbmZpZy5jb25uZWN0aW9uVGltZW91dCB8fCBjZGsuRHVyYXRpb24uc2Vjb25kcygxMCkpLnRvU2Vjb25kcygpO1xuICAgIGlmIChjb25uZWN0aW9uVGltZW91dCA8IDEgfHwgMTAgPCBjb25uZWN0aW9uVGltZW91dCB8fCAhTnVtYmVyLmlzSW50ZWdlcihjb25uZWN0aW9uVGltZW91dCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY29ubmVjdGlvblRpbWVvdXQ6IFlvdSBjYW4gc3BlY2lmeSBhIG51bWJlciBvZiBzZWNvbmRzIGJldHdlZW4gMSBhbmQgMTAgKGluY2x1c2l2ZSkuJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3JpZ2luUHJvcGVydHk6IENmbkRpc3RyaWJ1dGlvbi5PcmlnaW5Qcm9wZXJ0eSA9IHtcbiAgICAgIGlkOiBvcmlnaW5JZCxcbiAgICAgIGRvbWFpbk5hbWU6IG9yaWdpbkNvbmZpZy5zM09yaWdpblNvdXJjZVxuICAgICAgICA/IG9yaWdpbkNvbmZpZy5zM09yaWdpblNvdXJjZS5zM0J1Y2tldFNvdXJjZS5idWNrZXRSZWdpb25hbERvbWFpbk5hbWVcbiAgICAgICAgOiBvcmlnaW5Db25maWcuY3VzdG9tT3JpZ2luU291cmNlIS5kb21haW5OYW1lLFxuICAgICAgb3JpZ2luUGF0aDogb3JpZ2luQ29uZmlnLm9yaWdpblBhdGggPz8gb3JpZ2luQ29uZmlnLmN1c3RvbU9yaWdpblNvdXJjZT8ub3JpZ2luUGF0aCA/PyBvcmlnaW5Db25maWcuczNPcmlnaW5Tb3VyY2U/Lm9yaWdpblBhdGgsXG4gICAgICBvcmlnaW5DdXN0b21IZWFkZXJzOlxuICAgICAgICBvcmlnaW5IZWFkZXJzLmxlbmd0aCA+IDAgPyBvcmlnaW5IZWFkZXJzIDogdW5kZWZpbmVkLFxuICAgICAgczNPcmlnaW5Db25maWcsXG4gICAgICBvcmlnaW5TaGllbGQ6IHRoaXMudG9PcmlnaW5TaGllbGRQcm9wZXJ0eShvcmlnaW5Db25maWcpLFxuICAgICAgY3VzdG9tT3JpZ2luQ29uZmlnOiBvcmlnaW5Db25maWcuY3VzdG9tT3JpZ2luU291cmNlXG4gICAgICAgID8ge1xuICAgICAgICAgIGh0dHBQb3J0OiBvcmlnaW5Db25maWcuY3VzdG9tT3JpZ2luU291cmNlLmh0dHBQb3J0IHx8IDgwLFxuICAgICAgICAgIGh0dHBzUG9ydDogb3JpZ2luQ29uZmlnLmN1c3RvbU9yaWdpblNvdXJjZS5odHRwc1BvcnQgfHwgNDQzLFxuICAgICAgICAgIG9yaWdpbktlZXBhbGl2ZVRpbWVvdXQ6XG4gICAgICAgICAgICAob3JpZ2luQ29uZmlnLmN1c3RvbU9yaWdpblNvdXJjZS5vcmlnaW5LZWVwYWxpdmVUaW1lb3V0ICYmXG4gICAgICAgICAgICAgIG9yaWdpbkNvbmZpZy5jdXN0b21PcmlnaW5Tb3VyY2Uub3JpZ2luS2VlcGFsaXZlVGltZW91dC50b1NlY29uZHMoKSkgfHxcbiAgICAgICAgICAgIDUsXG4gICAgICAgICAgb3JpZ2luUmVhZFRpbWVvdXQ6XG4gICAgICAgICAgICAob3JpZ2luQ29uZmlnLmN1c3RvbU9yaWdpblNvdXJjZS5vcmlnaW5SZWFkVGltZW91dCAmJlxuICAgICAgICAgICAgICBvcmlnaW5Db25maWcuY3VzdG9tT3JpZ2luU291cmNlLm9yaWdpblJlYWRUaW1lb3V0LnRvU2Vjb25kcygpKSB8fFxuICAgICAgICAgICAgMzAsXG4gICAgICAgICAgb3JpZ2luUHJvdG9jb2xQb2xpY3k6XG4gICAgICAgICAgICBvcmlnaW5Db25maWcuY3VzdG9tT3JpZ2luU291cmNlLm9yaWdpblByb3RvY29sUG9saWN5IHx8XG4gICAgICAgICAgICBPcmlnaW5Qcm90b2NvbFBvbGljeS5IVFRQU19PTkxZLFxuICAgICAgICAgIG9yaWdpblNzbFByb3RvY29sczogb3JpZ2luQ29uZmlnLmN1c3RvbU9yaWdpblNvdXJjZVxuICAgICAgICAgICAgLmFsbG93ZWRPcmlnaW5TU0xWZXJzaW9ucyB8fCBbT3JpZ2luU3NsUG9saWN5LlRMU19WMV8yXSxcbiAgICAgICAgfVxuICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgIGNvbm5lY3Rpb25BdHRlbXB0cyxcbiAgICAgIGNvbm5lY3Rpb25UaW1lb3V0LFxuICAgIH07XG5cbiAgICByZXR1cm4gb3JpZ2luUHJvcGVydHk7XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgb3JpZ2luIHNoaWVsZCByZWdpb24gZnJvbSBwcm9wcyBhbmQgY29udmVydHMgdG8gQ2ZuRGlzdHJpYnV0aW9uLk9yaWdpblNoaWVsZFByb3BlcnR5XG4gICAqL1xuICBwcml2YXRlIHRvT3JpZ2luU2hpZWxkUHJvcGVydHkob3JpZ2luQ29uZmlnOlNvdXJjZUNvbmZpZ3VyYXRpb25SZW5kZXIpOiBDZm5EaXN0cmlidXRpb24uT3JpZ2luU2hpZWxkUHJvcGVydHkgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IG9yaWdpblNoaWVsZFJlZ2lvbiA9IG9yaWdpbkNvbmZpZy5vcmlnaW5TaGllbGRSZWdpb24gPz9cbiAgICBvcmlnaW5Db25maWcuY3VzdG9tT3JpZ2luU291cmNlPy5vcmlnaW5TaGllbGRSZWdpb24gPz9cbiAgICBvcmlnaW5Db25maWcuczNPcmlnaW5Tb3VyY2U/Lm9yaWdpblNoaWVsZFJlZ2lvbjtcbiAgICByZXR1cm4gb3JpZ2luU2hpZWxkUmVnaW9uXG4gICAgICA/IHsgZW5hYmxlZDogdHJ1ZSwgb3JpZ2luU2hpZWxkUmVnaW9uIH1cbiAgICAgIDogdW5kZWZpbmVkO1xuICB9XG59XG4iXX0=