function _aws_cdk_aws_wisdom_CfnAssistantProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.serverSideEncryptionConfiguration))
            _aws_cdk_aws_wisdom_CfnAssistant_ServerSideEncryptionConfigurationProperty(p.serverSideEncryptionConfiguration);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_wisdom_CfnAssistant(p) {
}
function _aws_cdk_aws_wisdom_CfnAssistant_ServerSideEncryptionConfigurationProperty(p) {
}
function _aws_cdk_aws_wisdom_CfnAssistantAssociationProps(p) {
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
function _aws_cdk_aws_wisdom_CfnAssistantAssociation(p) {
}
function _aws_cdk_aws_wisdom_CfnAssistantAssociation_AssociationDataProperty(p) {
}
function _aws_cdk_aws_wisdom_CfnKnowledgeBaseProps(p) {
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
function _aws_cdk_aws_wisdom_CfnKnowledgeBase(p) {
}
function _aws_cdk_aws_wisdom_CfnKnowledgeBase_AppIntegrationsConfigurationProperty(p) {
}
function _aws_cdk_aws_wisdom_CfnKnowledgeBase_RenderingConfigurationProperty(p) {
}
function _aws_cdk_aws_wisdom_CfnKnowledgeBase_ServerSideEncryptionConfigurationProperty(p) {
}
function _aws_cdk_aws_wisdom_CfnKnowledgeBase_SourceConfigurationProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_wisdom_CfnAssistantProps, _aws_cdk_aws_wisdom_CfnAssistant, _aws_cdk_aws_wisdom_CfnAssistant_ServerSideEncryptionConfigurationProperty, _aws_cdk_aws_wisdom_CfnAssistantAssociationProps, _aws_cdk_aws_wisdom_CfnAssistantAssociation, _aws_cdk_aws_wisdom_CfnAssistantAssociation_AssociationDataProperty, _aws_cdk_aws_wisdom_CfnKnowledgeBaseProps, _aws_cdk_aws_wisdom_CfnKnowledgeBase, _aws_cdk_aws_wisdom_CfnKnowledgeBase_AppIntegrationsConfigurationProperty, _aws_cdk_aws_wisdom_CfnKnowledgeBase_RenderingConfigurationProperty, _aws_cdk_aws_wisdom_CfnKnowledgeBase_ServerSideEncryptionConfigurationProperty, _aws_cdk_aws_wisdom_CfnKnowledgeBase_SourceConfigurationProperty };
