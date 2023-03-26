function _aws_cdk_aws_fms_CfnNotificationChannelProps(p) {
}
function _aws_cdk_aws_fms_CfnNotificationChannel(p) {
}
function _aws_cdk_aws_fms_CfnPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_fms_CfnPolicy_PolicyTagProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_fms_CfnPolicy(p) {
}
function _aws_cdk_aws_fms_CfnPolicy_IEMapProperty(p) {
}
function _aws_cdk_aws_fms_CfnPolicy_NetworkFirewallPolicyProperty(p) {
}
function _aws_cdk_aws_fms_CfnPolicy_PolicyOptionProperty(p) {
}
function _aws_cdk_aws_fms_CfnPolicy_PolicyTagProperty(p) {
}
function _aws_cdk_aws_fms_CfnPolicy_ResourceTagProperty(p) {
}
function _aws_cdk_aws_fms_CfnPolicy_SecurityServicePolicyDataProperty(p) {
}
function _aws_cdk_aws_fms_CfnPolicy_ThirdPartyFirewallPolicyProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_fms_CfnNotificationChannelProps, _aws_cdk_aws_fms_CfnNotificationChannel, _aws_cdk_aws_fms_CfnPolicyProps, _aws_cdk_aws_fms_CfnPolicy, _aws_cdk_aws_fms_CfnPolicy_IEMapProperty, _aws_cdk_aws_fms_CfnPolicy_NetworkFirewallPolicyProperty, _aws_cdk_aws_fms_CfnPolicy_PolicyOptionProperty, _aws_cdk_aws_fms_CfnPolicy_PolicyTagProperty, _aws_cdk_aws_fms_CfnPolicy_ResourceTagProperty, _aws_cdk_aws_fms_CfnPolicy_SecurityServicePolicyDataProperty, _aws_cdk_aws_fms_CfnPolicy_ThirdPartyFirewallPolicyProperty };
