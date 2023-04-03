function _aws_cdk_custom_resources_PhysicalResourceIdReference(p) {
}
function _aws_cdk_custom_resources_PhysicalResourceId(p) {
}
function _aws_cdk_custom_resources_AwsSdkCall(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("outputPath" in p)
            print("@aws-cdk/custom-resources.AwsSdkCall#outputPath", "use outputPaths instead");
        if (!visitedObjects.has(p.physicalResourceId))
            _aws_cdk_custom_resources_PhysicalResourceId(p.physicalResourceId);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_custom_resources_SdkCallsPolicyOptions(p) {
}
function _aws_cdk_custom_resources_AwsCustomResourcePolicy(p) {
}
function _aws_cdk_custom_resources_AwsCustomResourceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.onCreate))
            _aws_cdk_custom_resources_AwsSdkCall(p.onCreate);
        if (!visitedObjects.has(p.onDelete))
            _aws_cdk_custom_resources_AwsSdkCall(p.onDelete);
        if (!visitedObjects.has(p.onUpdate))
            _aws_cdk_custom_resources_AwsSdkCall(p.onUpdate);
        if (!visitedObjects.has(p.policy))
            _aws_cdk_custom_resources_AwsCustomResourcePolicy(p.policy);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_custom_resources_AwsCustomResource(p) {
}
function _aws_cdk_custom_resources_ProviderProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_custom_resources_Provider(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_custom_resources_PhysicalResourceIdReference, _aws_cdk_custom_resources_PhysicalResourceId, _aws_cdk_custom_resources_AwsSdkCall, _aws_cdk_custom_resources_SdkCallsPolicyOptions, _aws_cdk_custom_resources_AwsCustomResourcePolicy, _aws_cdk_custom_resources_AwsCustomResourceProps, _aws_cdk_custom_resources_AwsCustomResource, _aws_cdk_custom_resources_ProviderProps, _aws_cdk_custom_resources_Provider };
