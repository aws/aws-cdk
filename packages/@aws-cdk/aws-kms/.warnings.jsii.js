function _aws_cdk_aws_kms_IKey(p) {
}
function _aws_cdk_aws_kms_KeySpec(p) {
}
function _aws_cdk_aws_kms_KeyUsage(p) {
}
function _aws_cdk_aws_kms_KeyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.admins != null)
            for (const o of p.admins)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-iam/.warnings.jsii.js")._aws_cdk_aws_iam_IPrincipal(o);
        if (!visitedObjects.has(p.keySpec))
            _aws_cdk_aws_kms_KeySpec(p.keySpec);
        if (!visitedObjects.has(p.keyUsage))
            _aws_cdk_aws_kms_KeyUsage(p.keyUsage);
        if ("trustAccountIdentities" in p)
            print("@aws-cdk/aws-kms.KeyProps#trustAccountIdentities", "redundant with the `@aws-cdk/aws-kms:defaultKeyPolicies` feature flag");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_kms_Key(p) {
}
function _aws_cdk_aws_kms_KeyLookupOptions(p) {
}
function _aws_cdk_aws_kms_IAlias(p) {
}
function _aws_cdk_aws_kms_AliasProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.targetKey))
            _aws_cdk_aws_kms_IKey(p.targetKey);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_kms_AliasAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.aliasTargetKey))
            _aws_cdk_aws_kms_IKey(p.aliasTargetKey);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_kms_Alias(p) {
}
function _aws_cdk_aws_kms_ViaServicePrincipal(p) {
}
function _aws_cdk_aws_kms_CfnAliasProps(p) {
}
function _aws_cdk_aws_kms_CfnAlias(p) {
}
function _aws_cdk_aws_kms_CfnKeyProps(p) {
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
function _aws_cdk_aws_kms_CfnKey(p) {
}
function _aws_cdk_aws_kms_CfnReplicaKeyProps(p) {
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
function _aws_cdk_aws_kms_CfnReplicaKey(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_kms_IKey, _aws_cdk_aws_kms_KeySpec, _aws_cdk_aws_kms_KeyUsage, _aws_cdk_aws_kms_KeyProps, _aws_cdk_aws_kms_Key, _aws_cdk_aws_kms_KeyLookupOptions, _aws_cdk_aws_kms_IAlias, _aws_cdk_aws_kms_AliasProps, _aws_cdk_aws_kms_AliasAttributes, _aws_cdk_aws_kms_Alias, _aws_cdk_aws_kms_ViaServicePrincipal, _aws_cdk_aws_kms_CfnAliasProps, _aws_cdk_aws_kms_CfnAlias, _aws_cdk_aws_kms_CfnKeyProps, _aws_cdk_aws_kms_CfnKey, _aws_cdk_aws_kms_CfnReplicaKeyProps, _aws_cdk_aws_kms_CfnReplicaKey };
