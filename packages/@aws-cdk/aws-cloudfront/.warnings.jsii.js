function _aws_cdk_aws_cloudfront_experimental_EdgeFunctionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("architectures" in p)
            print("@aws-cdk/aws-lambda.FunctionOptions#architectures", "use `architecture`");
        if (p.architectures != null)
            for (const o of p.architectures)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-lambda/.warnings.jsii.js")._aws_cdk_aws_lambda_Architecture(o);
        if (p.events != null)
            for (const o of p.events)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-lambda/.warnings.jsii.js")._aws_cdk_aws_lambda_IEventSource(o);
        if (p.initialPolicy != null)
            for (const o of p.initialPolicy)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-iam/.warnings.jsii.js")._aws_cdk_aws_iam_PolicyStatement(o);
        if (p.layers != null)
            for (const o of p.layers)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-lambda/.warnings.jsii.js")._aws_cdk_aws_lambda_ILayerVersion(o);
        if ("securityGroup" in p)
            print("@aws-cdk/aws-lambda.FunctionOptions#securityGroup", "- This property is deprecated, use securityGroups instead");
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_experimental_EdgeFunction(p) {
}
function _aws_cdk_aws_cloudfront_ICachePolicy(p) {
}
function _aws_cdk_aws_cloudfront_CachePolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cookieBehavior))
            _aws_cdk_aws_cloudfront_CacheCookieBehavior(p.cookieBehavior);
        if (!visitedObjects.has(p.headerBehavior))
            _aws_cdk_aws_cloudfront_CacheHeaderBehavior(p.headerBehavior);
        if (!visitedObjects.has(p.queryStringBehavior))
            _aws_cdk_aws_cloudfront_CacheQueryStringBehavior(p.queryStringBehavior);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_CachePolicy(p) {
}
function _aws_cdk_aws_cloudfront_CacheCookieBehavior(p) {
}
function _aws_cdk_aws_cloudfront_CacheHeaderBehavior(p) {
}
function _aws_cdk_aws_cloudfront_CacheQueryStringBehavior(p) {
}
function _aws_cdk_aws_cloudfront_IDistribution(p) {
}
function _aws_cdk_aws_cloudfront_DistributionAttributes(p) {
}
function _aws_cdk_aws_cloudfront_DistributionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.defaultBehavior))
            _aws_cdk_aws_cloudfront_BehaviorOptions(p.defaultBehavior);
        if (p.additionalBehaviors != null)
            for (const o of Object.values(p.additionalBehaviors))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_BehaviorOptions(o);
        if (p.errorResponses != null)
            for (const o of p.errorResponses)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_ErrorResponse(o);
        if (!visitedObjects.has(p.geoRestriction))
            _aws_cdk_aws_cloudfront_GeoRestriction(p.geoRestriction);
        if (!visitedObjects.has(p.httpVersion))
            _aws_cdk_aws_cloudfront_HttpVersion(p.httpVersion);
        if (!visitedObjects.has(p.minimumProtocolVersion))
            _aws_cdk_aws_cloudfront_SecurityPolicyProtocol(p.minimumProtocolVersion);
        if (!visitedObjects.has(p.priceClass))
            _aws_cdk_aws_cloudfront_PriceClass(p.priceClass);
        if (!visitedObjects.has(p.sslSupportMethod))
            _aws_cdk_aws_cloudfront_SSLMethod(p.sslSupportMethod);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_Distribution(p) {
}
function _aws_cdk_aws_cloudfront_HttpVersion(p) {
}
function _aws_cdk_aws_cloudfront_PriceClass(p) {
}
function _aws_cdk_aws_cloudfront_ViewerProtocolPolicy(p) {
}
function _aws_cdk_aws_cloudfront_OriginProtocolPolicy(p) {
}
function _aws_cdk_aws_cloudfront_SSLMethod(p) {
}
function _aws_cdk_aws_cloudfront_SecurityPolicyProtocol(p) {
}
function _aws_cdk_aws_cloudfront_AllowedMethods(p) {
}
function _aws_cdk_aws_cloudfront_CachedMethods(p) {
}
function _aws_cdk_aws_cloudfront_ErrorResponse(p) {
}
function _aws_cdk_aws_cloudfront_LambdaEdgeEventType(p) {
}
function _aws_cdk_aws_cloudfront_EdgeLambda(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.eventType))
            _aws_cdk_aws_cloudfront_LambdaEdgeEventType(p.eventType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_AddBehaviorOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.allowedMethods))
            _aws_cdk_aws_cloudfront_AllowedMethods(p.allowedMethods);
        if (!visitedObjects.has(p.cachedMethods))
            _aws_cdk_aws_cloudfront_CachedMethods(p.cachedMethods);
        if (!visitedObjects.has(p.cachePolicy))
            _aws_cdk_aws_cloudfront_ICachePolicy(p.cachePolicy);
        if (p.edgeLambdas != null)
            for (const o of p.edgeLambdas)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_EdgeLambda(o);
        if (p.functionAssociations != null)
            for (const o of p.functionAssociations)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_FunctionAssociation(o);
        if (!visitedObjects.has(p.originRequestPolicy))
            _aws_cdk_aws_cloudfront_IOriginRequestPolicy(p.originRequestPolicy);
        if (!visitedObjects.has(p.responseHeadersPolicy))
            _aws_cdk_aws_cloudfront_IResponseHeadersPolicy(p.responseHeadersPolicy);
        if (p.trustedKeyGroups != null)
            for (const o of p.trustedKeyGroups)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_IKeyGroup(o);
        if (!visitedObjects.has(p.viewerProtocolPolicy))
            _aws_cdk_aws_cloudfront_ViewerProtocolPolicy(p.viewerProtocolPolicy);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_BehaviorOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.origin))
            _aws_cdk_aws_cloudfront_IOrigin(p.origin);
        if (!visitedObjects.has(p.allowedMethods))
            _aws_cdk_aws_cloudfront_AllowedMethods(p.allowedMethods);
        if (!visitedObjects.has(p.cachedMethods))
            _aws_cdk_aws_cloudfront_CachedMethods(p.cachedMethods);
        if (!visitedObjects.has(p.cachePolicy))
            _aws_cdk_aws_cloudfront_ICachePolicy(p.cachePolicy);
        if (p.edgeLambdas != null)
            for (const o of p.edgeLambdas)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_EdgeLambda(o);
        if (p.functionAssociations != null)
            for (const o of p.functionAssociations)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_FunctionAssociation(o);
        if (!visitedObjects.has(p.originRequestPolicy))
            _aws_cdk_aws_cloudfront_IOriginRequestPolicy(p.originRequestPolicy);
        if (!visitedObjects.has(p.responseHeadersPolicy))
            _aws_cdk_aws_cloudfront_IResponseHeadersPolicy(p.responseHeadersPolicy);
        if (p.trustedKeyGroups != null)
            for (const o of p.trustedKeyGroups)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_IKeyGroup(o);
        if (!visitedObjects.has(p.viewerProtocolPolicy))
            _aws_cdk_aws_cloudfront_ViewerProtocolPolicy(p.viewerProtocolPolicy);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_FunctionCode(p) {
}
function _aws_cdk_aws_cloudfront_FileCodeOptions(p) {
}
function _aws_cdk_aws_cloudfront_IFunction(p) {
}
function _aws_cdk_aws_cloudfront_FunctionAttributes(p) {
}
function _aws_cdk_aws_cloudfront_FunctionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.code))
            _aws_cdk_aws_cloudfront_FunctionCode(p.code);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_Function(p) {
}
function _aws_cdk_aws_cloudfront_FunctionEventType(p) {
}
function _aws_cdk_aws_cloudfront_FunctionAssociation(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.eventType))
            _aws_cdk_aws_cloudfront_FunctionEventType(p.eventType);
        if (!visitedObjects.has(p.function))
            _aws_cdk_aws_cloudfront_IFunction(p.function);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_GeoRestriction(p) {
}
function _aws_cdk_aws_cloudfront_IKeyGroup(p) {
}
function _aws_cdk_aws_cloudfront_KeyGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.items != null)
            for (const o of p.items)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_IPublicKey(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_KeyGroup(p) {
}
function _aws_cdk_aws_cloudfront_OriginFailoverConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.failoverOrigin))
            _aws_cdk_aws_cloudfront_IOrigin(p.failoverOrigin);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_OriginBindConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.failoverConfig))
            _aws_cdk_aws_cloudfront_OriginFailoverConfig(p.failoverConfig);
        if (!visitedObjects.has(p.originProperty))
            _aws_cdk_aws_cloudfront_CfnDistribution_OriginProperty(p.originProperty);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_IOrigin(p) {
}
function _aws_cdk_aws_cloudfront_OriginOptions(p) {
}
function _aws_cdk_aws_cloudfront_OriginProps(p) {
}
function _aws_cdk_aws_cloudfront_OriginBindOptions(p) {
}
function _aws_cdk_aws_cloudfront_OriginBase(p) {
}
function _aws_cdk_aws_cloudfront_OriginAccessIdentityProps(p) {
}
function _aws_cdk_aws_cloudfront_IOriginAccessIdentity(p) {
}
function _aws_cdk_aws_cloudfront_OriginAccessIdentity(p) {
}
function _aws_cdk_aws_cloudfront_IOriginRequestPolicy(p) {
}
function _aws_cdk_aws_cloudfront_OriginRequestPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cookieBehavior))
            _aws_cdk_aws_cloudfront_OriginRequestCookieBehavior(p.cookieBehavior);
        if (!visitedObjects.has(p.headerBehavior))
            _aws_cdk_aws_cloudfront_OriginRequestHeaderBehavior(p.headerBehavior);
        if (!visitedObjects.has(p.queryStringBehavior))
            _aws_cdk_aws_cloudfront_OriginRequestQueryStringBehavior(p.queryStringBehavior);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_OriginRequestPolicy(p) {
}
function _aws_cdk_aws_cloudfront_OriginRequestCookieBehavior(p) {
}
function _aws_cdk_aws_cloudfront_OriginRequestHeaderBehavior(p) {
}
function _aws_cdk_aws_cloudfront_OriginRequestQueryStringBehavior(p) {
}
function _aws_cdk_aws_cloudfront_IPublicKey(p) {
}
function _aws_cdk_aws_cloudfront_PublicKeyProps(p) {
}
function _aws_cdk_aws_cloudfront_PublicKey(p) {
}
function _aws_cdk_aws_cloudfront_IResponseHeadersPolicy(p) {
}
function _aws_cdk_aws_cloudfront_ResponseHeadersPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.corsBehavior))
            _aws_cdk_aws_cloudfront_ResponseHeadersCorsBehavior(p.corsBehavior);
        if (!visitedObjects.has(p.customHeadersBehavior))
            _aws_cdk_aws_cloudfront_ResponseCustomHeadersBehavior(p.customHeadersBehavior);
        if (!visitedObjects.has(p.securityHeadersBehavior))
            _aws_cdk_aws_cloudfront_ResponseSecurityHeadersBehavior(p.securityHeadersBehavior);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_ResponseHeadersPolicy(p) {
}
function _aws_cdk_aws_cloudfront_ResponseHeadersCorsBehavior(p) {
}
function _aws_cdk_aws_cloudfront_ResponseCustomHeadersBehavior(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.customHeaders != null)
            for (const o of p.customHeaders)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_ResponseCustomHeader(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_ResponseCustomHeader(p) {
}
function _aws_cdk_aws_cloudfront_ResponseSecurityHeadersBehavior(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.contentSecurityPolicy))
            _aws_cdk_aws_cloudfront_ResponseHeadersContentSecurityPolicy(p.contentSecurityPolicy);
        if (!visitedObjects.has(p.contentTypeOptions))
            _aws_cdk_aws_cloudfront_ResponseHeadersContentTypeOptions(p.contentTypeOptions);
        if (!visitedObjects.has(p.frameOptions))
            _aws_cdk_aws_cloudfront_ResponseHeadersFrameOptions(p.frameOptions);
        if (!visitedObjects.has(p.referrerPolicy))
            _aws_cdk_aws_cloudfront_ResponseHeadersReferrerPolicy(p.referrerPolicy);
        if (!visitedObjects.has(p.strictTransportSecurity))
            _aws_cdk_aws_cloudfront_ResponseHeadersStrictTransportSecurity(p.strictTransportSecurity);
        if (!visitedObjects.has(p.xssProtection))
            _aws_cdk_aws_cloudfront_ResponseHeadersXSSProtection(p.xssProtection);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_ResponseHeadersContentSecurityPolicy(p) {
}
function _aws_cdk_aws_cloudfront_ResponseHeadersContentTypeOptions(p) {
}
function _aws_cdk_aws_cloudfront_ResponseHeadersFrameOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.frameOption))
            _aws_cdk_aws_cloudfront_HeadersFrameOption(p.frameOption);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_ResponseHeadersReferrerPolicy(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.referrerPolicy))
            _aws_cdk_aws_cloudfront_HeadersReferrerPolicy(p.referrerPolicy);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_ResponseHeadersStrictTransportSecurity(p) {
}
function _aws_cdk_aws_cloudfront_ResponseHeadersXSSProtection(p) {
}
function _aws_cdk_aws_cloudfront_HeadersFrameOption(p) {
}
function _aws_cdk_aws_cloudfront_HeadersReferrerPolicy(p) {
}
function _aws_cdk_aws_cloudfront_FailoverStatusCode(p) {
}
function _aws_cdk_aws_cloudfront_AliasConfiguration(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("acmCertRef" in p)
            print("@aws-cdk/aws-cloudfront.AliasConfiguration#acmCertRef", "see `CloudFrontWebDistributionProps#viewerCertificate` with `ViewerCertificate#acmCertificate`");
        if ("names" in p)
            print("@aws-cdk/aws-cloudfront.AliasConfiguration#names", "see `CloudFrontWebDistributionProps#viewerCertificate` with `ViewerCertificate#acmCertificate`");
        if ("securityPolicy" in p)
            print("@aws-cdk/aws-cloudfront.AliasConfiguration#securityPolicy", "see `CloudFrontWebDistributionProps#viewerCertificate` with `ViewerCertificate#acmCertificate`");
        if (!visitedObjects.has(p.securityPolicy))
            _aws_cdk_aws_cloudfront_SecurityPolicyProtocol(p.securityPolicy);
        if ("sslMethod" in p)
            print("@aws-cdk/aws-cloudfront.AliasConfiguration#sslMethod", "see `CloudFrontWebDistributionProps#viewerCertificate` with `ViewerCertificate#acmCertificate`");
        if (!visitedObjects.has(p.sslMethod))
            _aws_cdk_aws_cloudfront_SSLMethod(p.sslMethod);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_LoggingConfiguration(p) {
}
function _aws_cdk_aws_cloudfront_SourceConfiguration(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.behaviors != null)
            for (const o of p.behaviors)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_Behavior(o);
        if (!visitedObjects.has(p.customOriginSource))
            _aws_cdk_aws_cloudfront_CustomOriginConfig(p.customOriginSource);
        if (p.failoverCriteriaStatusCodes != null)
            for (const o of p.failoverCriteriaStatusCodes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_FailoverStatusCode(o);
        if (!visitedObjects.has(p.failoverCustomOriginSource))
            _aws_cdk_aws_cloudfront_CustomOriginConfig(p.failoverCustomOriginSource);
        if (!visitedObjects.has(p.failoverS3OriginSource))
            _aws_cdk_aws_cloudfront_S3OriginConfig(p.failoverS3OriginSource);
        if ("originHeaders" in p)
            print("@aws-cdk/aws-cloudfront.SourceConfiguration#originHeaders", "Use originHeaders on s3OriginSource or customOriginSource");
        if ("originPath" in p)
            print("@aws-cdk/aws-cloudfront.SourceConfiguration#originPath", "Use originPath on s3OriginSource or customOriginSource");
        if (!visitedObjects.has(p.s3OriginSource))
            _aws_cdk_aws_cloudfront_S3OriginConfig(p.s3OriginSource);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_CustomOriginConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.allowedOriginSSLVersions != null)
            for (const o of p.allowedOriginSSLVersions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_OriginSslPolicy(o);
        if (!visitedObjects.has(p.originProtocolPolicy))
            _aws_cdk_aws_cloudfront_OriginProtocolPolicy(p.originProtocolPolicy);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_OriginSslPolicy(p) {
}
function _aws_cdk_aws_cloudfront_S3OriginConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.originAccessIdentity))
            _aws_cdk_aws_cloudfront_IOriginAccessIdentity(p.originAccessIdentity);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_CloudFrontAllowedMethods(p) {
}
function _aws_cdk_aws_cloudfront_CloudFrontAllowedCachedMethods(p) {
}
function _aws_cdk_aws_cloudfront_Behavior(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.allowedMethods))
            _aws_cdk_aws_cloudfront_CloudFrontAllowedMethods(p.allowedMethods);
        if (!visitedObjects.has(p.cachedMethods))
            _aws_cdk_aws_cloudfront_CloudFrontAllowedCachedMethods(p.cachedMethods);
        if (!visitedObjects.has(p.forwardedValues))
            _aws_cdk_aws_cloudfront_CfnDistribution_ForwardedValuesProperty(p.forwardedValues);
        if (p.functionAssociations != null)
            for (const o of p.functionAssociations)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_FunctionAssociation(o);
        if (p.lambdaFunctionAssociations != null)
            for (const o of p.lambdaFunctionAssociations)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_LambdaFunctionAssociation(o);
        if (p.trustedKeyGroups != null)
            for (const o of p.trustedKeyGroups)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_IKeyGroup(o);
        if ("trustedSigners" in p)
            print("@aws-cdk/aws-cloudfront.Behavior#trustedSigners", "- We recommend using trustedKeyGroups instead of trustedSigners.");
        if (!visitedObjects.has(p.viewerProtocolPolicy))
            _aws_cdk_aws_cloudfront_ViewerProtocolPolicy(p.viewerProtocolPolicy);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_LambdaFunctionAssociation(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.eventType))
            _aws_cdk_aws_cloudfront_LambdaEdgeEventType(p.eventType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_ViewerCertificateOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.securityPolicy))
            _aws_cdk_aws_cloudfront_SecurityPolicyProtocol(p.securityPolicy);
        if (!visitedObjects.has(p.sslMethod))
            _aws_cdk_aws_cloudfront_SSLMethod(p.sslMethod);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_ViewerCertificate(p) {
}
function _aws_cdk_aws_cloudfront_CloudFrontWebDistributionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.originConfigs != null)
            for (const o of p.originConfigs)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_SourceConfiguration(o);
        if ("aliasConfiguration" in p)
            print("@aws-cdk/aws-cloudfront.CloudFrontWebDistributionProps#aliasConfiguration", "see `CloudFrontWebDistributionProps#viewerCertificate` with `ViewerCertificate#acmCertificate`");
        if (!visitedObjects.has(p.aliasConfiguration))
            _aws_cdk_aws_cloudfront_AliasConfiguration(p.aliasConfiguration);
        if (p.errorConfigurations != null)
            for (const o of p.errorConfigurations)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_cloudfront_CfnDistribution_CustomErrorResponseProperty(o);
        if (!visitedObjects.has(p.geoRestriction))
            _aws_cdk_aws_cloudfront_GeoRestriction(p.geoRestriction);
        if (!visitedObjects.has(p.httpVersion))
            _aws_cdk_aws_cloudfront_HttpVersion(p.httpVersion);
        if (!visitedObjects.has(p.loggingConfig))
            _aws_cdk_aws_cloudfront_LoggingConfiguration(p.loggingConfig);
        if (!visitedObjects.has(p.priceClass))
            _aws_cdk_aws_cloudfront_PriceClass(p.priceClass);
        if (!visitedObjects.has(p.viewerCertificate))
            _aws_cdk_aws_cloudfront_ViewerCertificate(p.viewerCertificate);
        if (!visitedObjects.has(p.viewerProtocolPolicy))
            _aws_cdk_aws_cloudfront_ViewerProtocolPolicy(p.viewerProtocolPolicy);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_CloudFrontWebDistributionAttributes(p) {
}
function _aws_cdk_aws_cloudfront_CloudFrontWebDistribution(p) {
}
function _aws_cdk_aws_cloudfront_CfnCachePolicyProps(p) {
}
function _aws_cdk_aws_cloudfront_CfnCachePolicy(p) {
}
function _aws_cdk_aws_cloudfront_CfnCachePolicy_CachePolicyConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnCachePolicy_CookiesConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnCachePolicy_HeadersConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnCachePolicy_ParametersInCacheKeyAndForwardedToOriginProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnCachePolicy_QueryStringsConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnCloudFrontOriginAccessIdentityProps(p) {
}
function _aws_cdk_aws_cloudfront_CfnCloudFrontOriginAccessIdentity(p) {
}
function _aws_cdk_aws_cloudfront_CfnCloudFrontOriginAccessIdentity_CloudFrontOriginAccessIdentityConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnContinuousDeploymentPolicyProps(p) {
}
function _aws_cdk_aws_cloudfront_CfnContinuousDeploymentPolicy(p) {
}
function _aws_cdk_aws_cloudfront_CfnContinuousDeploymentPolicy_ContinuousDeploymentPolicyConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnContinuousDeploymentPolicy_SessionStickinessConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnContinuousDeploymentPolicy_SingleHeaderConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnContinuousDeploymentPolicy_SingleWeightConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnContinuousDeploymentPolicy_TrafficConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistributionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_CfnDistribution(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_CacheBehaviorProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.forwardedValues))
            _aws_cdk_aws_cloudfront_CfnDistribution_ForwardedValuesProperty(p.forwardedValues);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_CfnDistribution_CookiesProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_CustomErrorResponseProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_CustomOriginConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_DefaultCacheBehaviorProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.forwardedValues))
            _aws_cdk_aws_cloudfront_CfnDistribution_ForwardedValuesProperty(p.forwardedValues);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_CfnDistribution_DistributionConfigProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.viewerCertificate))
            _aws_cdk_aws_cloudfront_CfnDistribution_ViewerCertificateProperty(p.viewerCertificate);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_CfnDistribution_ForwardedValuesProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_FunctionAssociationProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_GeoRestrictionProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_LambdaFunctionAssociationProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_LegacyCustomOriginProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_LegacyS3OriginProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_LoggingProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_OriginProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.customOriginConfig))
            _aws_cdk_aws_cloudfront_CfnDistribution_CustomOriginConfigProperty(p.customOriginConfig);
        if (!visitedObjects.has(p.s3OriginConfig))
            _aws_cdk_aws_cloudfront_CfnDistribution_S3OriginConfigProperty(p.s3OriginConfig);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_CfnDistribution_OriginCustomHeaderProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_OriginGroupProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_OriginGroupFailoverCriteriaProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_OriginGroupMemberProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_OriginGroupMembersProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_OriginGroupsProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_OriginShieldProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_RestrictionsProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_S3OriginConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_StatusCodesProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnDistribution_ViewerCertificateProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnFunctionProps(p) {
}
function _aws_cdk_aws_cloudfront_CfnFunction(p) {
}
function _aws_cdk_aws_cloudfront_CfnFunction_FunctionConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnFunction_FunctionMetadataProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnKeyGroupProps(p) {
}
function _aws_cdk_aws_cloudfront_CfnKeyGroup(p) {
}
function _aws_cdk_aws_cloudfront_CfnKeyGroup_KeyGroupConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnMonitoringSubscriptionProps(p) {
}
function _aws_cdk_aws_cloudfront_CfnMonitoringSubscription(p) {
}
function _aws_cdk_aws_cloudfront_CfnMonitoringSubscription_MonitoringSubscriptionProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnMonitoringSubscription_RealtimeMetricsSubscriptionConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnOriginAccessControlProps(p) {
}
function _aws_cdk_aws_cloudfront_CfnOriginAccessControl(p) {
}
function _aws_cdk_aws_cloudfront_CfnOriginAccessControl_OriginAccessControlConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnOriginRequestPolicyProps(p) {
}
function _aws_cdk_aws_cloudfront_CfnOriginRequestPolicy(p) {
}
function _aws_cdk_aws_cloudfront_CfnOriginRequestPolicy_CookiesConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnOriginRequestPolicy_HeadersConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnOriginRequestPolicy_OriginRequestPolicyConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnOriginRequestPolicy_QueryStringsConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnPublicKeyProps(p) {
}
function _aws_cdk_aws_cloudfront_CfnPublicKey(p) {
}
function _aws_cdk_aws_cloudfront_CfnPublicKey_PublicKeyConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnRealtimeLogConfigProps(p) {
}
function _aws_cdk_aws_cloudfront_CfnRealtimeLogConfig(p) {
}
function _aws_cdk_aws_cloudfront_CfnRealtimeLogConfig_EndPointProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnRealtimeLogConfig_KinesisStreamConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicyProps(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_AccessControlAllowHeadersProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_AccessControlAllowMethodsProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_AccessControlAllowOriginsProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_AccessControlExposeHeadersProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_ContentSecurityPolicyProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_ContentTypeOptionsProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_CorsConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_CustomHeaderProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_CustomHeadersConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_FrameOptionsProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_ReferrerPolicyProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_RemoveHeaderProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_RemoveHeadersConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_ResponseHeadersPolicyConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_SecurityHeadersConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_ServerTimingHeadersConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_StrictTransportSecurityProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_XSSProtectionProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnStreamingDistributionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudfront_CfnStreamingDistribution(p) {
}
function _aws_cdk_aws_cloudfront_CfnStreamingDistribution_LoggingProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnStreamingDistribution_S3OriginProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnStreamingDistribution_StreamingDistributionConfigProperty(p) {
}
function _aws_cdk_aws_cloudfront_CfnStreamingDistribution_TrustedSignersProperty(p) {
}
function print(name, deprecationMessage) {
    const deprecated = process.env.JSII_DEPRECATED;
    const deprecationMode = ["warn", "fail", "quiet"].includes(deprecated) ? deprecated : "warn";
    const message = `${name} is deprecated.\n  ${deprecationMessage.trim()}\n  This API will be removed in the next major release.`;
    switch (deprecationMode) {
        case "fail":
            throw new DeprecationError(message);
        case "warn":
            console.warn("[WARNING]", message);
            break;
    }
}
function getPropertyDescriptor(obj, prop) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (descriptor) {
        return descriptor;
    }
    const proto = Object.getPrototypeOf(obj);
    const prototypeDescriptor = proto && getPropertyDescriptor(proto, prop);
    if (prototypeDescriptor) {
        return prototypeDescriptor;
    }
    return {};
}
const visitedObjects = new Set();
class DeprecationError extends Error {
    constructor(...args) {
        super(...args);
        Object.defineProperty(this, "name", {
            configurable: false,
            enumerable: true,
            value: "DeprecationError",
            writable: false,
        });
    }
}
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_cloudfront_experimental_EdgeFunctionProps, _aws_cdk_aws_cloudfront_experimental_EdgeFunction, _aws_cdk_aws_cloudfront_ICachePolicy, _aws_cdk_aws_cloudfront_CachePolicyProps, _aws_cdk_aws_cloudfront_CachePolicy, _aws_cdk_aws_cloudfront_CacheCookieBehavior, _aws_cdk_aws_cloudfront_CacheHeaderBehavior, _aws_cdk_aws_cloudfront_CacheQueryStringBehavior, _aws_cdk_aws_cloudfront_IDistribution, _aws_cdk_aws_cloudfront_DistributionAttributes, _aws_cdk_aws_cloudfront_DistributionProps, _aws_cdk_aws_cloudfront_Distribution, _aws_cdk_aws_cloudfront_HttpVersion, _aws_cdk_aws_cloudfront_PriceClass, _aws_cdk_aws_cloudfront_ViewerProtocolPolicy, _aws_cdk_aws_cloudfront_OriginProtocolPolicy, _aws_cdk_aws_cloudfront_SSLMethod, _aws_cdk_aws_cloudfront_SecurityPolicyProtocol, _aws_cdk_aws_cloudfront_AllowedMethods, _aws_cdk_aws_cloudfront_CachedMethods, _aws_cdk_aws_cloudfront_ErrorResponse, _aws_cdk_aws_cloudfront_LambdaEdgeEventType, _aws_cdk_aws_cloudfront_EdgeLambda, _aws_cdk_aws_cloudfront_AddBehaviorOptions, _aws_cdk_aws_cloudfront_BehaviorOptions, _aws_cdk_aws_cloudfront_FunctionCode, _aws_cdk_aws_cloudfront_FileCodeOptions, _aws_cdk_aws_cloudfront_IFunction, _aws_cdk_aws_cloudfront_FunctionAttributes, _aws_cdk_aws_cloudfront_FunctionProps, _aws_cdk_aws_cloudfront_Function, _aws_cdk_aws_cloudfront_FunctionEventType, _aws_cdk_aws_cloudfront_FunctionAssociation, _aws_cdk_aws_cloudfront_GeoRestriction, _aws_cdk_aws_cloudfront_IKeyGroup, _aws_cdk_aws_cloudfront_KeyGroupProps, _aws_cdk_aws_cloudfront_KeyGroup, _aws_cdk_aws_cloudfront_OriginFailoverConfig, _aws_cdk_aws_cloudfront_OriginBindConfig, _aws_cdk_aws_cloudfront_IOrigin, _aws_cdk_aws_cloudfront_OriginOptions, _aws_cdk_aws_cloudfront_OriginProps, _aws_cdk_aws_cloudfront_OriginBindOptions, _aws_cdk_aws_cloudfront_OriginBase, _aws_cdk_aws_cloudfront_OriginAccessIdentityProps, _aws_cdk_aws_cloudfront_IOriginAccessIdentity, _aws_cdk_aws_cloudfront_OriginAccessIdentity, _aws_cdk_aws_cloudfront_IOriginRequestPolicy, _aws_cdk_aws_cloudfront_OriginRequestPolicyProps, _aws_cdk_aws_cloudfront_OriginRequestPolicy, _aws_cdk_aws_cloudfront_OriginRequestCookieBehavior, _aws_cdk_aws_cloudfront_OriginRequestHeaderBehavior, _aws_cdk_aws_cloudfront_OriginRequestQueryStringBehavior, _aws_cdk_aws_cloudfront_IPublicKey, _aws_cdk_aws_cloudfront_PublicKeyProps, _aws_cdk_aws_cloudfront_PublicKey, _aws_cdk_aws_cloudfront_IResponseHeadersPolicy, _aws_cdk_aws_cloudfront_ResponseHeadersPolicyProps, _aws_cdk_aws_cloudfront_ResponseHeadersPolicy, _aws_cdk_aws_cloudfront_ResponseHeadersCorsBehavior, _aws_cdk_aws_cloudfront_ResponseCustomHeadersBehavior, _aws_cdk_aws_cloudfront_ResponseCustomHeader, _aws_cdk_aws_cloudfront_ResponseSecurityHeadersBehavior, _aws_cdk_aws_cloudfront_ResponseHeadersContentSecurityPolicy, _aws_cdk_aws_cloudfront_ResponseHeadersContentTypeOptions, _aws_cdk_aws_cloudfront_ResponseHeadersFrameOptions, _aws_cdk_aws_cloudfront_ResponseHeadersReferrerPolicy, _aws_cdk_aws_cloudfront_ResponseHeadersStrictTransportSecurity, _aws_cdk_aws_cloudfront_ResponseHeadersXSSProtection, _aws_cdk_aws_cloudfront_HeadersFrameOption, _aws_cdk_aws_cloudfront_HeadersReferrerPolicy, _aws_cdk_aws_cloudfront_FailoverStatusCode, _aws_cdk_aws_cloudfront_AliasConfiguration, _aws_cdk_aws_cloudfront_LoggingConfiguration, _aws_cdk_aws_cloudfront_SourceConfiguration, _aws_cdk_aws_cloudfront_CustomOriginConfig, _aws_cdk_aws_cloudfront_OriginSslPolicy, _aws_cdk_aws_cloudfront_S3OriginConfig, _aws_cdk_aws_cloudfront_CloudFrontAllowedMethods, _aws_cdk_aws_cloudfront_CloudFrontAllowedCachedMethods, _aws_cdk_aws_cloudfront_Behavior, _aws_cdk_aws_cloudfront_LambdaFunctionAssociation, _aws_cdk_aws_cloudfront_ViewerCertificateOptions, _aws_cdk_aws_cloudfront_ViewerCertificate, _aws_cdk_aws_cloudfront_CloudFrontWebDistributionProps, _aws_cdk_aws_cloudfront_CloudFrontWebDistributionAttributes, _aws_cdk_aws_cloudfront_CloudFrontWebDistribution, _aws_cdk_aws_cloudfront_CfnCachePolicyProps, _aws_cdk_aws_cloudfront_CfnCachePolicy, _aws_cdk_aws_cloudfront_CfnCachePolicy_CachePolicyConfigProperty, _aws_cdk_aws_cloudfront_CfnCachePolicy_CookiesConfigProperty, _aws_cdk_aws_cloudfront_CfnCachePolicy_HeadersConfigProperty, _aws_cdk_aws_cloudfront_CfnCachePolicy_ParametersInCacheKeyAndForwardedToOriginProperty, _aws_cdk_aws_cloudfront_CfnCachePolicy_QueryStringsConfigProperty, _aws_cdk_aws_cloudfront_CfnCloudFrontOriginAccessIdentityProps, _aws_cdk_aws_cloudfront_CfnCloudFrontOriginAccessIdentity, _aws_cdk_aws_cloudfront_CfnCloudFrontOriginAccessIdentity_CloudFrontOriginAccessIdentityConfigProperty, _aws_cdk_aws_cloudfront_CfnContinuousDeploymentPolicyProps, _aws_cdk_aws_cloudfront_CfnContinuousDeploymentPolicy, _aws_cdk_aws_cloudfront_CfnContinuousDeploymentPolicy_ContinuousDeploymentPolicyConfigProperty, _aws_cdk_aws_cloudfront_CfnContinuousDeploymentPolicy_SessionStickinessConfigProperty, _aws_cdk_aws_cloudfront_CfnContinuousDeploymentPolicy_SingleHeaderConfigProperty, _aws_cdk_aws_cloudfront_CfnContinuousDeploymentPolicy_SingleWeightConfigProperty, _aws_cdk_aws_cloudfront_CfnContinuousDeploymentPolicy_TrafficConfigProperty, _aws_cdk_aws_cloudfront_CfnDistributionProps, _aws_cdk_aws_cloudfront_CfnDistribution, _aws_cdk_aws_cloudfront_CfnDistribution_CacheBehaviorProperty, _aws_cdk_aws_cloudfront_CfnDistribution_CookiesProperty, _aws_cdk_aws_cloudfront_CfnDistribution_CustomErrorResponseProperty, _aws_cdk_aws_cloudfront_CfnDistribution_CustomOriginConfigProperty, _aws_cdk_aws_cloudfront_CfnDistribution_DefaultCacheBehaviorProperty, _aws_cdk_aws_cloudfront_CfnDistribution_DistributionConfigProperty, _aws_cdk_aws_cloudfront_CfnDistribution_ForwardedValuesProperty, _aws_cdk_aws_cloudfront_CfnDistribution_FunctionAssociationProperty, _aws_cdk_aws_cloudfront_CfnDistribution_GeoRestrictionProperty, _aws_cdk_aws_cloudfront_CfnDistribution_LambdaFunctionAssociationProperty, _aws_cdk_aws_cloudfront_CfnDistribution_LegacyCustomOriginProperty, _aws_cdk_aws_cloudfront_CfnDistribution_LegacyS3OriginProperty, _aws_cdk_aws_cloudfront_CfnDistribution_LoggingProperty, _aws_cdk_aws_cloudfront_CfnDistribution_OriginProperty, _aws_cdk_aws_cloudfront_CfnDistribution_OriginCustomHeaderProperty, _aws_cdk_aws_cloudfront_CfnDistribution_OriginGroupProperty, _aws_cdk_aws_cloudfront_CfnDistribution_OriginGroupFailoverCriteriaProperty, _aws_cdk_aws_cloudfront_CfnDistribution_OriginGroupMemberProperty, _aws_cdk_aws_cloudfront_CfnDistribution_OriginGroupMembersProperty, _aws_cdk_aws_cloudfront_CfnDistribution_OriginGroupsProperty, _aws_cdk_aws_cloudfront_CfnDistribution_OriginShieldProperty, _aws_cdk_aws_cloudfront_CfnDistribution_RestrictionsProperty, _aws_cdk_aws_cloudfront_CfnDistribution_S3OriginConfigProperty, _aws_cdk_aws_cloudfront_CfnDistribution_StatusCodesProperty, _aws_cdk_aws_cloudfront_CfnDistribution_ViewerCertificateProperty, _aws_cdk_aws_cloudfront_CfnFunctionProps, _aws_cdk_aws_cloudfront_CfnFunction, _aws_cdk_aws_cloudfront_CfnFunction_FunctionConfigProperty, _aws_cdk_aws_cloudfront_CfnFunction_FunctionMetadataProperty, _aws_cdk_aws_cloudfront_CfnKeyGroupProps, _aws_cdk_aws_cloudfront_CfnKeyGroup, _aws_cdk_aws_cloudfront_CfnKeyGroup_KeyGroupConfigProperty, _aws_cdk_aws_cloudfront_CfnMonitoringSubscriptionProps, _aws_cdk_aws_cloudfront_CfnMonitoringSubscription, _aws_cdk_aws_cloudfront_CfnMonitoringSubscription_MonitoringSubscriptionProperty, _aws_cdk_aws_cloudfront_CfnMonitoringSubscription_RealtimeMetricsSubscriptionConfigProperty, _aws_cdk_aws_cloudfront_CfnOriginAccessControlProps, _aws_cdk_aws_cloudfront_CfnOriginAccessControl, _aws_cdk_aws_cloudfront_CfnOriginAccessControl_OriginAccessControlConfigProperty, _aws_cdk_aws_cloudfront_CfnOriginRequestPolicyProps, _aws_cdk_aws_cloudfront_CfnOriginRequestPolicy, _aws_cdk_aws_cloudfront_CfnOriginRequestPolicy_CookiesConfigProperty, _aws_cdk_aws_cloudfront_CfnOriginRequestPolicy_HeadersConfigProperty, _aws_cdk_aws_cloudfront_CfnOriginRequestPolicy_OriginRequestPolicyConfigProperty, _aws_cdk_aws_cloudfront_CfnOriginRequestPolicy_QueryStringsConfigProperty, _aws_cdk_aws_cloudfront_CfnPublicKeyProps, _aws_cdk_aws_cloudfront_CfnPublicKey, _aws_cdk_aws_cloudfront_CfnPublicKey_PublicKeyConfigProperty, _aws_cdk_aws_cloudfront_CfnRealtimeLogConfigProps, _aws_cdk_aws_cloudfront_CfnRealtimeLogConfig, _aws_cdk_aws_cloudfront_CfnRealtimeLogConfig_EndPointProperty, _aws_cdk_aws_cloudfront_CfnRealtimeLogConfig_KinesisStreamConfigProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicyProps, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_AccessControlAllowHeadersProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_AccessControlAllowMethodsProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_AccessControlAllowOriginsProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_AccessControlExposeHeadersProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_ContentSecurityPolicyProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_ContentTypeOptionsProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_CorsConfigProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_CustomHeaderProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_CustomHeadersConfigProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_FrameOptionsProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_ReferrerPolicyProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_RemoveHeaderProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_RemoveHeadersConfigProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_ResponseHeadersPolicyConfigProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_SecurityHeadersConfigProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_ServerTimingHeadersConfigProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_StrictTransportSecurityProperty, _aws_cdk_aws_cloudfront_CfnResponseHeadersPolicy_XSSProtectionProperty, _aws_cdk_aws_cloudfront_CfnStreamingDistributionProps, _aws_cdk_aws_cloudfront_CfnStreamingDistribution, _aws_cdk_aws_cloudfront_CfnStreamingDistribution_LoggingProperty, _aws_cdk_aws_cloudfront_CfnStreamingDistribution_S3OriginProperty, _aws_cdk_aws_cloudfront_CfnStreamingDistribution_StreamingDistributionConfigProperty, _aws_cdk_aws_cloudfront_CfnStreamingDistribution_TrustedSignersProperty };
