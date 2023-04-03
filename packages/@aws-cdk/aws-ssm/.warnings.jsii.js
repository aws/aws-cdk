function _aws_cdk_aws_ssm_IParameter(p) {
}
function _aws_cdk_aws_ssm_IStringParameter(p) {
}
function _aws_cdk_aws_ssm_IStringListParameter(p) {
}
function _aws_cdk_aws_ssm_ParameterOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.tier))
            _aws_cdk_aws_ssm_ParameterTier(p.tier);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ssm_StringParameterProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.dataType))
            _aws_cdk_aws_ssm_ParameterDataType(p.dataType);
        if ("type" in p)
            print("@aws-cdk/aws-ssm.StringParameterProps#type", "- type will always be 'String'");
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_ssm_ParameterType(p.type);
        if (!visitedObjects.has(p.tier))
            _aws_cdk_aws_ssm_ParameterTier(p.tier);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ssm_StringListParameterProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.tier))
            _aws_cdk_aws_ssm_ParameterTier(p.tier);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ssm_ParameterValueType(p) {
}
function _aws_cdk_aws_ssm_ParameterType(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/aws-ssm.ParameterType", "these types are no longer used");
        const ns = require("./lib/parameter.js");
        if (Object.values(ns.ParameterType).filter(x => x === p).length > 1)
            return;
        if (p === ns.ParameterType.STRING)
            print("@aws-cdk/aws-ssm.ParameterType#STRING", "");
        if (p === ns.ParameterType.SECURE_STRING)
            print("@aws-cdk/aws-ssm.ParameterType#SECURE_STRING", "");
        if (p === ns.ParameterType.STRING_LIST)
            print("@aws-cdk/aws-ssm.ParameterType#STRING_LIST", "");
        if (p === ns.ParameterType.AWS_EC2_IMAGE_ID)
            print("@aws-cdk/aws-ssm.ParameterType#AWS_EC2_IMAGE_ID", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ssm_ParameterDataType(p) {
}
function _aws_cdk_aws_ssm_ParameterTier(p) {
}
function _aws_cdk_aws_ssm_CommonStringParameterAttributes(p) {
}
function _aws_cdk_aws_ssm_StringParameterAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("type" in p)
            print("@aws-cdk/aws-ssm.StringParameterAttributes#type", "- use valueType instead");
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_ssm_ParameterType(p.type);
        if (!visitedObjects.has(p.valueType))
            _aws_cdk_aws_ssm_ParameterValueType(p.valueType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ssm_ListParameterAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.elementType))
            _aws_cdk_aws_ssm_ParameterValueType(p.elementType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ssm_SecureStringParameterAttributes(p) {
}
function _aws_cdk_aws_ssm_StringParameter(p) {
}
function _aws_cdk_aws_ssm_StringListParameter(p) {
}
function _aws_cdk_aws_ssm_CfnAssociationProps(p) {
}
function _aws_cdk_aws_ssm_CfnAssociation(p) {
}
function _aws_cdk_aws_ssm_CfnAssociation_InstanceAssociationOutputLocationProperty(p) {
}
function _aws_cdk_aws_ssm_CfnAssociation_S3OutputLocationProperty(p) {
}
function _aws_cdk_aws_ssm_CfnAssociation_TargetProperty(p) {
}
function _aws_cdk_aws_ssm_CfnDocumentProps(p) {
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
function _aws_cdk_aws_ssm_CfnDocument(p) {
}
function _aws_cdk_aws_ssm_CfnDocument_AttachmentsSourceProperty(p) {
}
function _aws_cdk_aws_ssm_CfnDocument_DocumentRequiresProperty(p) {
}
function _aws_cdk_aws_ssm_CfnMaintenanceWindowProps(p) {
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
function _aws_cdk_aws_ssm_CfnMaintenanceWindow(p) {
}
function _aws_cdk_aws_ssm_CfnMaintenanceWindowTargetProps(p) {
}
function _aws_cdk_aws_ssm_CfnMaintenanceWindowTarget(p) {
}
function _aws_cdk_aws_ssm_CfnMaintenanceWindowTarget_TargetsProperty(p) {
}
function _aws_cdk_aws_ssm_CfnMaintenanceWindowTaskProps(p) {
}
function _aws_cdk_aws_ssm_CfnMaintenanceWindowTask(p) {
}
function _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_CloudWatchOutputConfigProperty(p) {
}
function _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_LoggingInfoProperty(p) {
}
function _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_MaintenanceWindowAutomationParametersProperty(p) {
}
function _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_MaintenanceWindowLambdaParametersProperty(p) {
}
function _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_MaintenanceWindowRunCommandParametersProperty(p) {
}
function _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_MaintenanceWindowStepFunctionsParametersProperty(p) {
}
function _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_NotificationConfigProperty(p) {
}
function _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_TargetProperty(p) {
}
function _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_TaskInvocationParametersProperty(p) {
}
function _aws_cdk_aws_ssm_CfnParameterProps(p) {
}
function _aws_cdk_aws_ssm_CfnParameter(p) {
}
function _aws_cdk_aws_ssm_CfnPatchBaselineProps(p) {
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
function _aws_cdk_aws_ssm_CfnPatchBaseline(p) {
}
function _aws_cdk_aws_ssm_CfnPatchBaseline_PatchFilterProperty(p) {
}
function _aws_cdk_aws_ssm_CfnPatchBaseline_PatchFilterGroupProperty(p) {
}
function _aws_cdk_aws_ssm_CfnPatchBaseline_PatchSourceProperty(p) {
}
function _aws_cdk_aws_ssm_CfnPatchBaseline_RuleProperty(p) {
}
function _aws_cdk_aws_ssm_CfnPatchBaseline_RuleGroupProperty(p) {
}
function _aws_cdk_aws_ssm_CfnResourceDataSyncProps(p) {
}
function _aws_cdk_aws_ssm_CfnResourceDataSync(p) {
}
function _aws_cdk_aws_ssm_CfnResourceDataSync_AwsOrganizationsSourceProperty(p) {
}
function _aws_cdk_aws_ssm_CfnResourceDataSync_S3DestinationProperty(p) {
}
function _aws_cdk_aws_ssm_CfnResourceDataSync_SyncSourceProperty(p) {
}
function _aws_cdk_aws_ssm_CfnResourcePolicyProps(p) {
}
function _aws_cdk_aws_ssm_CfnResourcePolicy(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_ssm_IParameter, _aws_cdk_aws_ssm_IStringParameter, _aws_cdk_aws_ssm_IStringListParameter, _aws_cdk_aws_ssm_ParameterOptions, _aws_cdk_aws_ssm_StringParameterProps, _aws_cdk_aws_ssm_StringListParameterProps, _aws_cdk_aws_ssm_ParameterValueType, _aws_cdk_aws_ssm_ParameterType, _aws_cdk_aws_ssm_ParameterDataType, _aws_cdk_aws_ssm_ParameterTier, _aws_cdk_aws_ssm_CommonStringParameterAttributes, _aws_cdk_aws_ssm_StringParameterAttributes, _aws_cdk_aws_ssm_ListParameterAttributes, _aws_cdk_aws_ssm_SecureStringParameterAttributes, _aws_cdk_aws_ssm_StringParameter, _aws_cdk_aws_ssm_StringListParameter, _aws_cdk_aws_ssm_CfnAssociationProps, _aws_cdk_aws_ssm_CfnAssociation, _aws_cdk_aws_ssm_CfnAssociation_InstanceAssociationOutputLocationProperty, _aws_cdk_aws_ssm_CfnAssociation_S3OutputLocationProperty, _aws_cdk_aws_ssm_CfnAssociation_TargetProperty, _aws_cdk_aws_ssm_CfnDocumentProps, _aws_cdk_aws_ssm_CfnDocument, _aws_cdk_aws_ssm_CfnDocument_AttachmentsSourceProperty, _aws_cdk_aws_ssm_CfnDocument_DocumentRequiresProperty, _aws_cdk_aws_ssm_CfnMaintenanceWindowProps, _aws_cdk_aws_ssm_CfnMaintenanceWindow, _aws_cdk_aws_ssm_CfnMaintenanceWindowTargetProps, _aws_cdk_aws_ssm_CfnMaintenanceWindowTarget, _aws_cdk_aws_ssm_CfnMaintenanceWindowTarget_TargetsProperty, _aws_cdk_aws_ssm_CfnMaintenanceWindowTaskProps, _aws_cdk_aws_ssm_CfnMaintenanceWindowTask, _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_CloudWatchOutputConfigProperty, _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_LoggingInfoProperty, _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_MaintenanceWindowAutomationParametersProperty, _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_MaintenanceWindowLambdaParametersProperty, _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_MaintenanceWindowRunCommandParametersProperty, _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_MaintenanceWindowStepFunctionsParametersProperty, _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_NotificationConfigProperty, _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_TargetProperty, _aws_cdk_aws_ssm_CfnMaintenanceWindowTask_TaskInvocationParametersProperty, _aws_cdk_aws_ssm_CfnParameterProps, _aws_cdk_aws_ssm_CfnParameter, _aws_cdk_aws_ssm_CfnPatchBaselineProps, _aws_cdk_aws_ssm_CfnPatchBaseline, _aws_cdk_aws_ssm_CfnPatchBaseline_PatchFilterProperty, _aws_cdk_aws_ssm_CfnPatchBaseline_PatchFilterGroupProperty, _aws_cdk_aws_ssm_CfnPatchBaseline_PatchSourceProperty, _aws_cdk_aws_ssm_CfnPatchBaseline_RuleProperty, _aws_cdk_aws_ssm_CfnPatchBaseline_RuleGroupProperty, _aws_cdk_aws_ssm_CfnResourceDataSyncProps, _aws_cdk_aws_ssm_CfnResourceDataSync, _aws_cdk_aws_ssm_CfnResourceDataSync_AwsOrganizationsSourceProperty, _aws_cdk_aws_ssm_CfnResourceDataSync_S3DestinationProperty, _aws_cdk_aws_ssm_CfnResourceDataSync_SyncSourceProperty, _aws_cdk_aws_ssm_CfnResourcePolicyProps, _aws_cdk_aws_ssm_CfnResourcePolicy };
