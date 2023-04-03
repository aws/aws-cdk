function _aws_cdk_aws_codeguruprofiler_CfnProfilingGroupProps(p) {
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
function _aws_cdk_aws_codeguruprofiler_CfnProfilingGroup(p) {
}
function _aws_cdk_aws_codeguruprofiler_CfnProfilingGroup_AgentPermissionsProperty(p) {
}
function _aws_cdk_aws_codeguruprofiler_CfnProfilingGroup_ChannelProperty(p) {
}
function _aws_cdk_aws_codeguruprofiler_ComputePlatform(p) {
}
function _aws_cdk_aws_codeguruprofiler_IProfilingGroup(p) {
}
function _aws_cdk_aws_codeguruprofiler_ProfilingGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.computePlatform))
            _aws_cdk_aws_codeguruprofiler_ComputePlatform(p.computePlatform);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codeguruprofiler_ProfilingGroup(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_codeguruprofiler_CfnProfilingGroupProps, _aws_cdk_aws_codeguruprofiler_CfnProfilingGroup, _aws_cdk_aws_codeguruprofiler_CfnProfilingGroup_AgentPermissionsProperty, _aws_cdk_aws_codeguruprofiler_CfnProfilingGroup_ChannelProperty, _aws_cdk_aws_codeguruprofiler_ComputePlatform, _aws_cdk_aws_codeguruprofiler_IProfilingGroup, _aws_cdk_aws_codeguruprofiler_ProfilingGroupProps, _aws_cdk_aws_codeguruprofiler_ProfilingGroup };
