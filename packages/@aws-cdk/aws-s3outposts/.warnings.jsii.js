function _aws_cdk_aws_s3outposts_CfnAccessPointProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.vpcConfiguration))
            _aws_cdk_aws_s3outposts_CfnAccessPoint_VpcConfigurationProperty(p.vpcConfiguration);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3outposts_CfnAccessPoint(p) {
}
function _aws_cdk_aws_s3outposts_CfnAccessPoint_VpcConfigurationProperty(p) {
}
function _aws_cdk_aws_s3outposts_CfnBucketProps(p) {
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
function _aws_cdk_aws_s3outposts_CfnBucket(p) {
}
function _aws_cdk_aws_s3outposts_CfnBucket_AbortIncompleteMultipartUploadProperty(p) {
}
function _aws_cdk_aws_s3outposts_CfnBucket_FilterProperty(p) {
}
function _aws_cdk_aws_s3outposts_CfnBucket_FilterAndOperatorProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_s3outposts_CfnBucket_FilterTagProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3outposts_CfnBucket_FilterTagProperty(p) {
}
function _aws_cdk_aws_s3outposts_CfnBucket_LifecycleConfigurationProperty(p) {
}
function _aws_cdk_aws_s3outposts_CfnBucket_RuleProperty(p) {
}
function _aws_cdk_aws_s3outposts_CfnBucketPolicyProps(p) {
}
function _aws_cdk_aws_s3outposts_CfnBucketPolicy(p) {
}
function _aws_cdk_aws_s3outposts_CfnEndpointProps(p) {
}
function _aws_cdk_aws_s3outposts_CfnEndpoint(p) {
}
function _aws_cdk_aws_s3outposts_CfnEndpoint_NetworkInterfaceProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_s3outposts_CfnAccessPointProps, _aws_cdk_aws_s3outposts_CfnAccessPoint, _aws_cdk_aws_s3outposts_CfnAccessPoint_VpcConfigurationProperty, _aws_cdk_aws_s3outposts_CfnBucketProps, _aws_cdk_aws_s3outposts_CfnBucket, _aws_cdk_aws_s3outposts_CfnBucket_AbortIncompleteMultipartUploadProperty, _aws_cdk_aws_s3outposts_CfnBucket_FilterProperty, _aws_cdk_aws_s3outposts_CfnBucket_FilterAndOperatorProperty, _aws_cdk_aws_s3outposts_CfnBucket_FilterTagProperty, _aws_cdk_aws_s3outposts_CfnBucket_LifecycleConfigurationProperty, _aws_cdk_aws_s3outposts_CfnBucket_RuleProperty, _aws_cdk_aws_s3outposts_CfnBucketPolicyProps, _aws_cdk_aws_s3outposts_CfnBucketPolicy, _aws_cdk_aws_s3outposts_CfnEndpointProps, _aws_cdk_aws_s3outposts_CfnEndpoint, _aws_cdk_aws_s3outposts_CfnEndpoint_NetworkInterfaceProperty };
