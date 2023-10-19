function _aws_cdk_aws_synthetics_alpha_Test(p) {
}
function _aws_cdk_aws_synthetics_alpha_CustomTestOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("code" in p)
            print("@aws-cdk/aws-synthetics-alpha.CustomTestOptions#code", "");
        if (!visitedObjects.has(p.code))
            _aws_cdk_aws_synthetics_alpha_Code(p.code);
        if ("handler" in p)
            print("@aws-cdk/aws-synthetics-alpha.CustomTestOptions#handler", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_synthetics_alpha_Cleanup(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/aws-synthetics-alpha.Cleanup", "");
        const ns = require("./lib/canary.js");
        if (Object.values(ns.Cleanup).filter(x => x === p).length > 1)
            return;
        if (p === ns.Cleanup.NOTHING)
            print("@aws-cdk/aws-synthetics-alpha.Cleanup#NOTHING", "");
        if (p === ns.Cleanup.LAMBDA)
            print("@aws-cdk/aws-synthetics-alpha.Cleanup#LAMBDA", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_synthetics_alpha_ArtifactsBucketLocation(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("bucket" in p)
            print("@aws-cdk/aws-synthetics-alpha.ArtifactsBucketLocation#bucket", "");
        if ("prefix" in p)
            print("@aws-cdk/aws-synthetics-alpha.ArtifactsBucketLocation#prefix", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_synthetics_alpha_CanaryProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("runtime" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#runtime", "");
        if (!visitedObjects.has(p.runtime))
            _aws_cdk_aws_synthetics_alpha_Runtime(p.runtime);
        if ("test" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#test", "");
        if (!visitedObjects.has(p.test))
            _aws_cdk_aws_synthetics_alpha_Test(p.test);
        if ("artifactsBucketLifecycleRules" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#artifactsBucketLifecycleRules", "");
        if (p.artifactsBucketLifecycleRules != null)
            for (const o of p.artifactsBucketLifecycleRules)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_s3_LifecycleRule(o);
        if ("artifactsBucketLocation" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#artifactsBucketLocation", "");
        if (!visitedObjects.has(p.artifactsBucketLocation))
            _aws_cdk_aws_synthetics_alpha_ArtifactsBucketLocation(p.artifactsBucketLocation);
        if ("canaryName" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#canaryName", "");
        if ("cleanup" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#cleanup", "");
        if (!visitedObjects.has(p.cleanup))
            _aws_cdk_aws_synthetics_alpha_Cleanup(p.cleanup);
        if ("enableAutoDeleteLambdas" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#enableAutoDeleteLambdas", "this feature has been deprecated by the service team, use `cleanup: Cleanup.LAMBDA` instead which will use a Custom Resource to achieve the same effect.");
        if ("environmentVariables" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#environmentVariables", "");
        if ("failureRetentionPeriod" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#failureRetentionPeriod", "");
        if ("role" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#role", "");
        if ("schedule" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#schedule", "");
        if (!visitedObjects.has(p.schedule))
            _aws_cdk_aws_synthetics_alpha_Schedule(p.schedule);
        if ("securityGroups" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#securityGroups", "");
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_ISecurityGroup(o);
        if ("startAfterCreation" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#startAfterCreation", "");
        if ("successRetentionPeriod" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#successRetentionPeriod", "");
        if ("timeToLive" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#timeToLive", "");
        if ("vpc" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#vpc", "");
        if ("vpcSubnets" in p)
            print("@aws-cdk/aws-synthetics-alpha.CanaryProps#vpcSubnets", "");
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
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("inlineCode" in p)
            print("@aws-cdk/aws-synthetics-alpha.CodeConfig#inlineCode", "");
        if ("s3Location" in p)
            print("@aws-cdk/aws-synthetics-alpha.CodeConfig#s3Location", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_synthetics_alpha_AssetCode(p) {
}
function _aws_cdk_aws_synthetics_alpha_InlineCode(p) {
}
function _aws_cdk_aws_synthetics_alpha_S3Code(p) {
}
function _aws_cdk_aws_synthetics_alpha_RuntimeFamily(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/aws-synthetics-alpha.RuntimeFamily", "");
        const ns = require("./lib/runtime.js");
        if (Object.values(ns.RuntimeFamily).filter(x => x === p).length > 1)
            return;
        if (p === ns.RuntimeFamily.NODEJS)
            print("@aws-cdk/aws-synthetics-alpha.RuntimeFamily#NODEJS", "");
        if (p === ns.RuntimeFamily.PYTHON)
            print("@aws-cdk/aws-synthetics-alpha.RuntimeFamily#PYTHON", "");
        if (p === ns.RuntimeFamily.OTHER)
            print("@aws-cdk/aws-synthetics-alpha.RuntimeFamily#OTHER", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_synthetics_alpha_Runtime(p) {
}
function _aws_cdk_aws_synthetics_alpha_Schedule(p) {
}
function _aws_cdk_aws_synthetics_alpha_CronOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("day" in p)
            print("@aws-cdk/aws-synthetics-alpha.CronOptions#day", "");
        if ("hour" in p)
            print("@aws-cdk/aws-synthetics-alpha.CronOptions#hour", "");
        if ("minute" in p)
            print("@aws-cdk/aws-synthetics-alpha.CronOptions#minute", "");
        if ("month" in p)
            print("@aws-cdk/aws-synthetics-alpha.CronOptions#month", "");
        if ("weekDay" in p)
            print("@aws-cdk/aws-synthetics-alpha.CronOptions#weekDay", "");
    }
    finally {
        visitedObjects.delete(p);
    }
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
