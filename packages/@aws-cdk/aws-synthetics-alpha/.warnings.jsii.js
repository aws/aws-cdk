function _aws_cdk_aws_synthetics_alpha_Test(p) {
}
function _aws_cdk_aws_synthetics_alpha_CustomTestOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.code))
            _aws_cdk_aws_synthetics_alpha_Code(p.code);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_synthetics_alpha_Cleanup(p) {
}
function _aws_cdk_aws_synthetics_alpha_ArtifactsBucketLocation(p) {
}
function _aws_cdk_aws_synthetics_alpha_CanaryProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.runtime))
            _aws_cdk_aws_synthetics_alpha_Runtime(p.runtime);
        if (!visitedObjects.has(p.test))
            _aws_cdk_aws_synthetics_alpha_Test(p.test);
        if (p.artifactsBucketLifecycleRules != null)
            for (const o of p.artifactsBucketLifecycleRules)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_s3_LifecycleRule(o);
        if (!visitedObjects.has(p.artifactsBucketLocation))
            _aws_cdk_aws_synthetics_alpha_ArtifactsBucketLocation(p.artifactsBucketLocation);
        if (!visitedObjects.has(p.cleanup))
            _aws_cdk_aws_synthetics_alpha_Cleanup(p.cleanup);
        if ("enableAutoDeleteLambdas" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#enableAutoDeleteLambdas", "this feature has been deprecated by the service team, use `cleanup: Cleanup.LAMBDA` instead which will use a Custom Resource to achieve the same effect.");
        if (!visitedObjects.has(p.schedule))
            _aws_cdk_aws_synthetics_alpha_Schedule(p.schedule);
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_synthetics_alpha_Canary(p) {
}
function _aws_cdk_aws_synthetics_alpha_Code(p) {
}
function _aws_cdk_aws_synthetics_alpha_CodeConfig(p) {
}
function _aws_cdk_aws_synthetics_alpha_AssetCode(p) {
}
function _aws_cdk_aws_synthetics_alpha_InlineCode(p) {
}
function _aws_cdk_aws_synthetics_alpha_S3Code(p) {
}
function _aws_cdk_aws_synthetics_alpha_RuntimeFamily(p) {
}
function _aws_cdk_aws_synthetics_alpha_Runtime(p) {
}
function _aws_cdk_aws_synthetics_alpha_Schedule(p) {
}
function _aws_cdk_aws_synthetics_alpha_CronOptions(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_synthetics_alpha_Test, _aws_cdk_aws_synthetics_alpha_CustomTestOptions, _aws_cdk_aws_synthetics_alpha_Cleanup, _aws_cdk_aws_synthetics_alpha_ArtifactsBucketLocation, _aws_cdk_aws_synthetics_alpha_CanaryProps, _aws_cdk_aws_synthetics_alpha_Canary, _aws_cdk_aws_synthetics_alpha_Code, _aws_cdk_aws_synthetics_alpha_CodeConfig, _aws_cdk_aws_synthetics_alpha_AssetCode, _aws_cdk_aws_synthetics_alpha_InlineCode, _aws_cdk_aws_synthetics_alpha_S3Code, _aws_cdk_aws_synthetics_alpha_RuntimeFamily, _aws_cdk_aws_synthetics_alpha_Runtime, _aws_cdk_aws_synthetics_alpha_Schedule, _aws_cdk_aws_synthetics_alpha_CronOptions };
