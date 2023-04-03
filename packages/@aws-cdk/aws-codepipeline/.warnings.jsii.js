function _aws_cdk_aws_codepipeline_ActionCategory(p) {
}
function _aws_cdk_aws_codepipeline_ActionArtifactBounds(p) {
}
function _aws_cdk_aws_codepipeline_GlobalVariables(p) {
}
function _aws_cdk_aws_codepipeline_ActionProperties(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.artifactBounds))
            _aws_cdk_aws_codepipeline_ActionArtifactBounds(p.artifactBounds);
        if (!visitedObjects.has(p.category))
            _aws_cdk_aws_codepipeline_ActionCategory(p.category);
        if (p.inputs != null)
            for (const o of p.inputs)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codepipeline_Artifact(o);
        if (p.outputs != null)
            for (const o of p.outputs)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codepipeline_Artifact(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_ActionBindOptions(p) {
}
function _aws_cdk_aws_codepipeline_ActionConfig(p) {
}
function _aws_cdk_aws_codepipeline_PipelineNotifyOnOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.events != null)
            for (const o of p.events)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codepipeline_PipelineNotificationEvents(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_IAction(p) {
}
function _aws_cdk_aws_codepipeline_IPipeline(p) {
}
function _aws_cdk_aws_codepipeline_IStage(p) {
}
function _aws_cdk_aws_codepipeline_CommonActionProps(p) {
}
function _aws_cdk_aws_codepipeline_CommonAwsActionProps(p) {
}
function _aws_cdk_aws_codepipeline_Action(p) {
}
function _aws_cdk_aws_codepipeline_PipelineNotificationEvents(p) {
}
function _aws_cdk_aws_codepipeline_Artifact(p) {
}
function _aws_cdk_aws_codepipeline_ArtifactPath(p) {
}
function _aws_cdk_aws_codepipeline_StagePlacement(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.justAfter))
            _aws_cdk_aws_codepipeline_IStage(p.justAfter);
        if (!visitedObjects.has(p.rightBefore))
            _aws_cdk_aws_codepipeline_IStage(p.rightBefore);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_StageProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.actions != null)
            for (const o of p.actions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codepipeline_IAction(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_StageOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.placement))
            _aws_cdk_aws_codepipeline_StagePlacement(p.placement);
        if (p.actions != null)
            for (const o of p.actions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codepipeline_IAction(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_PipelineProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.crossRegionReplicationBuckets != null)
            for (const o of Object.values(p.crossRegionReplicationBuckets))
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-s3/.warnings.jsii.js")._aws_cdk_aws_s3_IBucket(o);
        if (p.stages != null)
            for (const o of p.stages)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codepipeline_StageProps(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_Pipeline(p) {
}
function _aws_cdk_aws_codepipeline_CrossRegionSupport(p) {
}
function _aws_cdk_aws_codepipeline_CustomActionProperty(p) {
}
function _aws_cdk_aws_codepipeline_CustomActionRegistrationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.artifactBounds))
            _aws_cdk_aws_codepipeline_ActionArtifactBounds(p.artifactBounds);
        if (!visitedObjects.has(p.category))
            _aws_cdk_aws_codepipeline_ActionCategory(p.category);
        if (p.actionProperties != null)
            for (const o of p.actionProperties)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_codepipeline_CustomActionProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_CustomActionRegistration(p) {
}
function _aws_cdk_aws_codepipeline_CfnCustomActionTypeProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.inputArtifactDetails))
            _aws_cdk_aws_codepipeline_CfnCustomActionType_ArtifactDetailsProperty(p.inputArtifactDetails);
        if (!visitedObjects.has(p.outputArtifactDetails))
            _aws_cdk_aws_codepipeline_CfnCustomActionType_ArtifactDetailsProperty(p.outputArtifactDetails);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codepipeline_CfnCustomActionType(p) {
}
function _aws_cdk_aws_codepipeline_CfnCustomActionType_ArtifactDetailsProperty(p) {
}
function _aws_cdk_aws_codepipeline_CfnCustomActionType_ConfigurationPropertiesProperty(p) {
}
function _aws_cdk_aws_codepipeline_CfnCustomActionType_SettingsProperty(p) {
}
function _aws_cdk_aws_codepipeline_CfnPipelineProps(p) {
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
function _aws_cdk_aws_codepipeline_CfnPipeline(p) {
}
function _aws_cdk_aws_codepipeline_CfnPipeline_ActionDeclarationProperty(p) {
}
function _aws_cdk_aws_codepipeline_CfnPipeline_ActionTypeIdProperty(p) {
}
function _aws_cdk_aws_codepipeline_CfnPipeline_ArtifactStoreProperty(p) {
}
function _aws_cdk_aws_codepipeline_CfnPipeline_ArtifactStoreMapProperty(p) {
}
function _aws_cdk_aws_codepipeline_CfnPipeline_BlockerDeclarationProperty(p) {
}
function _aws_cdk_aws_codepipeline_CfnPipeline_EncryptionKeyProperty(p) {
}
function _aws_cdk_aws_codepipeline_CfnPipeline_InputArtifactProperty(p) {
}
function _aws_cdk_aws_codepipeline_CfnPipeline_OutputArtifactProperty(p) {
}
function _aws_cdk_aws_codepipeline_CfnPipeline_StageDeclarationProperty(p) {
}
function _aws_cdk_aws_codepipeline_CfnPipeline_StageTransitionProperty(p) {
}
function _aws_cdk_aws_codepipeline_CfnWebhookProps(p) {
}
function _aws_cdk_aws_codepipeline_CfnWebhook(p) {
}
function _aws_cdk_aws_codepipeline_CfnWebhook_WebhookAuthConfigurationProperty(p) {
}
function _aws_cdk_aws_codepipeline_CfnWebhook_WebhookFilterRuleProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_codepipeline_ActionCategory, _aws_cdk_aws_codepipeline_ActionArtifactBounds, _aws_cdk_aws_codepipeline_GlobalVariables, _aws_cdk_aws_codepipeline_ActionProperties, _aws_cdk_aws_codepipeline_ActionBindOptions, _aws_cdk_aws_codepipeline_ActionConfig, _aws_cdk_aws_codepipeline_PipelineNotifyOnOptions, _aws_cdk_aws_codepipeline_IAction, _aws_cdk_aws_codepipeline_IPipeline, _aws_cdk_aws_codepipeline_IStage, _aws_cdk_aws_codepipeline_CommonActionProps, _aws_cdk_aws_codepipeline_CommonAwsActionProps, _aws_cdk_aws_codepipeline_Action, _aws_cdk_aws_codepipeline_PipelineNotificationEvents, _aws_cdk_aws_codepipeline_Artifact, _aws_cdk_aws_codepipeline_ArtifactPath, _aws_cdk_aws_codepipeline_StagePlacement, _aws_cdk_aws_codepipeline_StageProps, _aws_cdk_aws_codepipeline_StageOptions, _aws_cdk_aws_codepipeline_PipelineProps, _aws_cdk_aws_codepipeline_Pipeline, _aws_cdk_aws_codepipeline_CrossRegionSupport, _aws_cdk_aws_codepipeline_CustomActionProperty, _aws_cdk_aws_codepipeline_CustomActionRegistrationProps, _aws_cdk_aws_codepipeline_CustomActionRegistration, _aws_cdk_aws_codepipeline_CfnCustomActionTypeProps, _aws_cdk_aws_codepipeline_CfnCustomActionType, _aws_cdk_aws_codepipeline_CfnCustomActionType_ArtifactDetailsProperty, _aws_cdk_aws_codepipeline_CfnCustomActionType_ConfigurationPropertiesProperty, _aws_cdk_aws_codepipeline_CfnCustomActionType_SettingsProperty, _aws_cdk_aws_codepipeline_CfnPipelineProps, _aws_cdk_aws_codepipeline_CfnPipeline, _aws_cdk_aws_codepipeline_CfnPipeline_ActionDeclarationProperty, _aws_cdk_aws_codepipeline_CfnPipeline_ActionTypeIdProperty, _aws_cdk_aws_codepipeline_CfnPipeline_ArtifactStoreProperty, _aws_cdk_aws_codepipeline_CfnPipeline_ArtifactStoreMapProperty, _aws_cdk_aws_codepipeline_CfnPipeline_BlockerDeclarationProperty, _aws_cdk_aws_codepipeline_CfnPipeline_EncryptionKeyProperty, _aws_cdk_aws_codepipeline_CfnPipeline_InputArtifactProperty, _aws_cdk_aws_codepipeline_CfnPipeline_OutputArtifactProperty, _aws_cdk_aws_codepipeline_CfnPipeline_StageDeclarationProperty, _aws_cdk_aws_codepipeline_CfnPipeline_StageTransitionProperty, _aws_cdk_aws_codepipeline_CfnWebhookProps, _aws_cdk_aws_codepipeline_CfnWebhook, _aws_cdk_aws_codepipeline_CfnWebhook_WebhookAuthConfigurationProperty, _aws_cdk_aws_codepipeline_CfnWebhook_WebhookFilterRuleProperty };
