function _aws_cdk_aws_iottwinmaker_CfnComponentTypeProps(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnComponentType(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnComponentType_DataConnectorProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnComponentType_DataTypeProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnComponentType_DataValueProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnComponentType_ErrorProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnComponentType_FunctionProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnComponentType_LambdaFunctionProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnComponentType_PropertyDefinitionProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnComponentType_PropertyGroupProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnComponentType_RelationshipProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnComponentType_RelationshipValueProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnComponentType_StatusProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnEntityProps(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnEntity(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnEntity_ComponentProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnEntity_DataTypeProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnEntity_DataValueProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnEntity_DefinitionProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnEntity_ErrorProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnEntity_PropertyProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnEntity_PropertyGroupProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnEntity_RelationshipProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnEntity_RelationshipValueProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnEntity_StatusProperty(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnSceneProps(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnScene(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnSyncJobProps(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnSyncJob(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnWorkspaceProps(p) {
}
function _aws_cdk_aws_iottwinmaker_CfnWorkspace(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_iottwinmaker_CfnComponentTypeProps, _aws_cdk_aws_iottwinmaker_CfnComponentType, _aws_cdk_aws_iottwinmaker_CfnComponentType_DataConnectorProperty, _aws_cdk_aws_iottwinmaker_CfnComponentType_DataTypeProperty, _aws_cdk_aws_iottwinmaker_CfnComponentType_DataValueProperty, _aws_cdk_aws_iottwinmaker_CfnComponentType_ErrorProperty, _aws_cdk_aws_iottwinmaker_CfnComponentType_FunctionProperty, _aws_cdk_aws_iottwinmaker_CfnComponentType_LambdaFunctionProperty, _aws_cdk_aws_iottwinmaker_CfnComponentType_PropertyDefinitionProperty, _aws_cdk_aws_iottwinmaker_CfnComponentType_PropertyGroupProperty, _aws_cdk_aws_iottwinmaker_CfnComponentType_RelationshipProperty, _aws_cdk_aws_iottwinmaker_CfnComponentType_RelationshipValueProperty, _aws_cdk_aws_iottwinmaker_CfnComponentType_StatusProperty, _aws_cdk_aws_iottwinmaker_CfnEntityProps, _aws_cdk_aws_iottwinmaker_CfnEntity, _aws_cdk_aws_iottwinmaker_CfnEntity_ComponentProperty, _aws_cdk_aws_iottwinmaker_CfnEntity_DataTypeProperty, _aws_cdk_aws_iottwinmaker_CfnEntity_DataValueProperty, _aws_cdk_aws_iottwinmaker_CfnEntity_DefinitionProperty, _aws_cdk_aws_iottwinmaker_CfnEntity_ErrorProperty, _aws_cdk_aws_iottwinmaker_CfnEntity_PropertyProperty, _aws_cdk_aws_iottwinmaker_CfnEntity_PropertyGroupProperty, _aws_cdk_aws_iottwinmaker_CfnEntity_RelationshipProperty, _aws_cdk_aws_iottwinmaker_CfnEntity_RelationshipValueProperty, _aws_cdk_aws_iottwinmaker_CfnEntity_StatusProperty, _aws_cdk_aws_iottwinmaker_CfnSceneProps, _aws_cdk_aws_iottwinmaker_CfnScene, _aws_cdk_aws_iottwinmaker_CfnSyncJobProps, _aws_cdk_aws_iottwinmaker_CfnSyncJob, _aws_cdk_aws_iottwinmaker_CfnWorkspaceProps, _aws_cdk_aws_iottwinmaker_CfnWorkspace };
