function _aws_cdk_aws_amazonmq_CfnBrokerProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_amazonmq_CfnBroker_TagsEntryProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_amazonmq_CfnBroker(p) {
}
function _aws_cdk_aws_amazonmq_CfnBroker_ConfigurationIdProperty(p) {
}
function _aws_cdk_aws_amazonmq_CfnBroker_EncryptionOptionsProperty(p) {
}
function _aws_cdk_aws_amazonmq_CfnBroker_LdapServerMetadataProperty(p) {
}
function _aws_cdk_aws_amazonmq_CfnBroker_LogListProperty(p) {
}
function _aws_cdk_aws_amazonmq_CfnBroker_MaintenanceWindowProperty(p) {
}
function _aws_cdk_aws_amazonmq_CfnBroker_TagsEntryProperty(p) {
}
function _aws_cdk_aws_amazonmq_CfnBroker_UserProperty(p) {
}
function _aws_cdk_aws_amazonmq_CfnConfigurationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_amazonmq_CfnConfiguration_TagsEntryProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_amazonmq_CfnConfiguration(p) {
}
function _aws_cdk_aws_amazonmq_CfnConfiguration_TagsEntryProperty(p) {
}
function _aws_cdk_aws_amazonmq_CfnConfigurationAssociationProps(p) {
}
function _aws_cdk_aws_amazonmq_CfnConfigurationAssociation(p) {
}
function _aws_cdk_aws_amazonmq_CfnConfigurationAssociation_ConfigurationIdProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_amazonmq_CfnBrokerProps, _aws_cdk_aws_amazonmq_CfnBroker, _aws_cdk_aws_amazonmq_CfnBroker_ConfigurationIdProperty, _aws_cdk_aws_amazonmq_CfnBroker_EncryptionOptionsProperty, _aws_cdk_aws_amazonmq_CfnBroker_LdapServerMetadataProperty, _aws_cdk_aws_amazonmq_CfnBroker_LogListProperty, _aws_cdk_aws_amazonmq_CfnBroker_MaintenanceWindowProperty, _aws_cdk_aws_amazonmq_CfnBroker_TagsEntryProperty, _aws_cdk_aws_amazonmq_CfnBroker_UserProperty, _aws_cdk_aws_amazonmq_CfnConfigurationProps, _aws_cdk_aws_amazonmq_CfnConfiguration, _aws_cdk_aws_amazonmq_CfnConfiguration_TagsEntryProperty, _aws_cdk_aws_amazonmq_CfnConfigurationAssociationProps, _aws_cdk_aws_amazonmq_CfnConfigurationAssociation, _aws_cdk_aws_amazonmq_CfnConfigurationAssociation_ConfigurationIdProperty };
