function _aws_cdk_aws_customerprofiles_CfnDomainProps(p) {
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
function _aws_cdk_aws_customerprofiles_CfnDomain(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegrationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.flowDefinition))
            _aws_cdk_aws_customerprofiles_CfnIntegration_FlowDefinitionProperty(p.flowDefinition);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_customerprofiles_CfnIntegration(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegration_ConnectorOperatorProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegration_FlowDefinitionProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegration_IncrementalPullConfigProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegration_MarketoSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegration_ObjectTypeMappingProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegration_S3SourcePropertiesProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegration_SalesforceSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegration_ScheduledTriggerPropertiesProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegration_ServiceNowSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegration_SourceConnectorPropertiesProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegration_SourceFlowConfigProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegration_TaskProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegration_TaskPropertiesMapProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegration_TriggerConfigProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegration_TriggerPropertiesProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnIntegration_ZendeskSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnObjectTypeProps(p) {
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
function _aws_cdk_aws_customerprofiles_CfnObjectType(p) {
}
function _aws_cdk_aws_customerprofiles_CfnObjectType_FieldMapProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnObjectType_KeyMapProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnObjectType_ObjectTypeFieldProperty(p) {
}
function _aws_cdk_aws_customerprofiles_CfnObjectType_ObjectTypeKeyProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_customerprofiles_CfnDomainProps, _aws_cdk_aws_customerprofiles_CfnDomain, _aws_cdk_aws_customerprofiles_CfnIntegrationProps, _aws_cdk_aws_customerprofiles_CfnIntegration, _aws_cdk_aws_customerprofiles_CfnIntegration_ConnectorOperatorProperty, _aws_cdk_aws_customerprofiles_CfnIntegration_FlowDefinitionProperty, _aws_cdk_aws_customerprofiles_CfnIntegration_IncrementalPullConfigProperty, _aws_cdk_aws_customerprofiles_CfnIntegration_MarketoSourcePropertiesProperty, _aws_cdk_aws_customerprofiles_CfnIntegration_ObjectTypeMappingProperty, _aws_cdk_aws_customerprofiles_CfnIntegration_S3SourcePropertiesProperty, _aws_cdk_aws_customerprofiles_CfnIntegration_SalesforceSourcePropertiesProperty, _aws_cdk_aws_customerprofiles_CfnIntegration_ScheduledTriggerPropertiesProperty, _aws_cdk_aws_customerprofiles_CfnIntegration_ServiceNowSourcePropertiesProperty, _aws_cdk_aws_customerprofiles_CfnIntegration_SourceConnectorPropertiesProperty, _aws_cdk_aws_customerprofiles_CfnIntegration_SourceFlowConfigProperty, _aws_cdk_aws_customerprofiles_CfnIntegration_TaskProperty, _aws_cdk_aws_customerprofiles_CfnIntegration_TaskPropertiesMapProperty, _aws_cdk_aws_customerprofiles_CfnIntegration_TriggerConfigProperty, _aws_cdk_aws_customerprofiles_CfnIntegration_TriggerPropertiesProperty, _aws_cdk_aws_customerprofiles_CfnIntegration_ZendeskSourcePropertiesProperty, _aws_cdk_aws_customerprofiles_CfnObjectTypeProps, _aws_cdk_aws_customerprofiles_CfnObjectType, _aws_cdk_aws_customerprofiles_CfnObjectType_FieldMapProperty, _aws_cdk_aws_customerprofiles_CfnObjectType_KeyMapProperty, _aws_cdk_aws_customerprofiles_CfnObjectType_ObjectTypeFieldProperty, _aws_cdk_aws_customerprofiles_CfnObjectType_ObjectTypeKeyProperty };
