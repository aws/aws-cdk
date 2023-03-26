function _aws_cdk_aws_signer_CfnProfilePermissionProps(p) {
}
function _aws_cdk_aws_signer_CfnProfilePermission(p) {
}
function _aws_cdk_aws_signer_CfnSigningProfileProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.signatureValidityPeriod))
            _aws_cdk_aws_signer_CfnSigningProfile_SignatureValidityPeriodProperty(p.signatureValidityPeriod);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_signer_CfnSigningProfile(p) {
}
function _aws_cdk_aws_signer_CfnSigningProfile_SignatureValidityPeriodProperty(p) {
}
function _aws_cdk_aws_signer_Platform(p) {
}
function _aws_cdk_aws_signer_ISigningProfile(p) {
}
function _aws_cdk_aws_signer_SigningProfileProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.platform))
            _aws_cdk_aws_signer_Platform(p.platform);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_signer_SigningProfileAttributes(p) {
}
function _aws_cdk_aws_signer_SigningProfile(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_signer_CfnProfilePermissionProps, _aws_cdk_aws_signer_CfnProfilePermission, _aws_cdk_aws_signer_CfnSigningProfileProps, _aws_cdk_aws_signer_CfnSigningProfile, _aws_cdk_aws_signer_CfnSigningProfile_SignatureValidityPeriodProperty, _aws_cdk_aws_signer_Platform, _aws_cdk_aws_signer_ISigningProfile, _aws_cdk_aws_signer_SigningProfileProps, _aws_cdk_aws_signer_SigningProfileAttributes, _aws_cdk_aws_signer_SigningProfile };
