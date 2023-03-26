function _aws_cdk_aws_sso_CfnAssignmentProps(p) {
}
function _aws_cdk_aws_sso_CfnAssignment(p) {
}
function _aws_cdk_aws_sso_CfnInstanceAccessControlAttributeConfigurationProps(p) {
}
function _aws_cdk_aws_sso_CfnInstanceAccessControlAttributeConfiguration(p) {
}
function _aws_cdk_aws_sso_CfnInstanceAccessControlAttributeConfiguration_AccessControlAttributeProperty(p) {
}
function _aws_cdk_aws_sso_CfnInstanceAccessControlAttributeConfiguration_AccessControlAttributeValueProperty(p) {
}
function _aws_cdk_aws_sso_CfnPermissionSetProps(p) {
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
function _aws_cdk_aws_sso_CfnPermissionSet(p) {
}
function _aws_cdk_aws_sso_CfnPermissionSet_CustomerManagedPolicyReferenceProperty(p) {
}
function _aws_cdk_aws_sso_CfnPermissionSet_PermissionsBoundaryProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_sso_CfnAssignmentProps, _aws_cdk_aws_sso_CfnAssignment, _aws_cdk_aws_sso_CfnInstanceAccessControlAttributeConfigurationProps, _aws_cdk_aws_sso_CfnInstanceAccessControlAttributeConfiguration, _aws_cdk_aws_sso_CfnInstanceAccessControlAttributeConfiguration_AccessControlAttributeProperty, _aws_cdk_aws_sso_CfnInstanceAccessControlAttributeConfiguration_AccessControlAttributeValueProperty, _aws_cdk_aws_sso_CfnPermissionSetProps, _aws_cdk_aws_sso_CfnPermissionSet, _aws_cdk_aws_sso_CfnPermissionSet_CustomerManagedPolicyReferenceProperty, _aws_cdk_aws_sso_CfnPermissionSet_PermissionsBoundaryProperty };
