function _aws_cdk_aws_opensearchserverless_CfnAccessPolicyProps(p) {
}
function _aws_cdk_aws_opensearchserverless_CfnAccessPolicy(p) {
}
function _aws_cdk_aws_opensearchserverless_CfnCollectionProps(p) {
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
function _aws_cdk_aws_opensearchserverless_CfnCollection(p) {
}
function _aws_cdk_aws_opensearchserverless_CfnSecurityConfigProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.samlOptions))
            _aws_cdk_aws_opensearchserverless_CfnSecurityConfig_SamlConfigOptionsProperty(p.samlOptions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_opensearchserverless_CfnSecurityConfig(p) {
}
function _aws_cdk_aws_opensearchserverless_CfnSecurityConfig_SamlConfigOptionsProperty(p) {
}
function _aws_cdk_aws_opensearchserverless_CfnSecurityPolicyProps(p) {
}
function _aws_cdk_aws_opensearchserverless_CfnSecurityPolicy(p) {
}
function _aws_cdk_aws_opensearchserverless_CfnVpcEndpointProps(p) {
}
function _aws_cdk_aws_opensearchserverless_CfnVpcEndpoint(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_opensearchserverless_CfnAccessPolicyProps, _aws_cdk_aws_opensearchserverless_CfnAccessPolicy, _aws_cdk_aws_opensearchserverless_CfnCollectionProps, _aws_cdk_aws_opensearchserverless_CfnCollection, _aws_cdk_aws_opensearchserverless_CfnSecurityConfigProps, _aws_cdk_aws_opensearchserverless_CfnSecurityConfig, _aws_cdk_aws_opensearchserverless_CfnSecurityConfig_SamlConfigOptionsProperty, _aws_cdk_aws_opensearchserverless_CfnSecurityPolicyProps, _aws_cdk_aws_opensearchserverless_CfnSecurityPolicy, _aws_cdk_aws_opensearchserverless_CfnVpcEndpointProps, _aws_cdk_aws_opensearchserverless_CfnVpcEndpoint };
