function _aws_cdk_aws_iotsitewise_CfnAccessPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.accessPolicyIdentity))
            _aws_cdk_aws_iotsitewise_CfnAccessPolicy_AccessPolicyIdentityProperty(p.accessPolicyIdentity);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iotsitewise_CfnAccessPolicy(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAccessPolicy_AccessPolicyIdentityProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAccessPolicy_AccessPolicyResourceProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAccessPolicy_IamRoleProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAccessPolicy_IamUserProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAccessPolicy_PortalProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAccessPolicy_ProjectProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAccessPolicy_UserProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAssetProps(p) {
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
function _aws_cdk_aws_iotsitewise_CfnAsset(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAsset_AssetHierarchyProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAsset_AssetPropertyProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAssetModelProps(p) {
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
function _aws_cdk_aws_iotsitewise_CfnAssetModel(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAssetModel_AssetModelCompositeModelProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAssetModel_AssetModelHierarchyProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAssetModel_AssetModelPropertyProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAssetModel_AttributeProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAssetModel_ExpressionVariableProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAssetModel_MetricProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAssetModel_MetricWindowProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAssetModel_PropertyTypeProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAssetModel_TransformProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAssetModel_TumblingWindowProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnAssetModel_VariableValueProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnDashboardProps(p) {
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
function _aws_cdk_aws_iotsitewise_CfnDashboard(p) {
}
function _aws_cdk_aws_iotsitewise_CfnGatewayProps(p) {
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
function _aws_cdk_aws_iotsitewise_CfnGateway(p) {
}
function _aws_cdk_aws_iotsitewise_CfnGateway_GatewayCapabilitySummaryProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnGateway_GatewayPlatformProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnGateway_GreengrassProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnGateway_GreengrassV2Property(p) {
}
function _aws_cdk_aws_iotsitewise_CfnPortalProps(p) {
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
function _aws_cdk_aws_iotsitewise_CfnPortal(p) {
}
function _aws_cdk_aws_iotsitewise_CfnPortal_AlarmsProperty(p) {
}
function _aws_cdk_aws_iotsitewise_CfnProjectProps(p) {
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
function _aws_cdk_aws_iotsitewise_CfnProject(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_iotsitewise_CfnAccessPolicyProps, _aws_cdk_aws_iotsitewise_CfnAccessPolicy, _aws_cdk_aws_iotsitewise_CfnAccessPolicy_AccessPolicyIdentityProperty, _aws_cdk_aws_iotsitewise_CfnAccessPolicy_AccessPolicyResourceProperty, _aws_cdk_aws_iotsitewise_CfnAccessPolicy_IamRoleProperty, _aws_cdk_aws_iotsitewise_CfnAccessPolicy_IamUserProperty, _aws_cdk_aws_iotsitewise_CfnAccessPolicy_PortalProperty, _aws_cdk_aws_iotsitewise_CfnAccessPolicy_ProjectProperty, _aws_cdk_aws_iotsitewise_CfnAccessPolicy_UserProperty, _aws_cdk_aws_iotsitewise_CfnAssetProps, _aws_cdk_aws_iotsitewise_CfnAsset, _aws_cdk_aws_iotsitewise_CfnAsset_AssetHierarchyProperty, _aws_cdk_aws_iotsitewise_CfnAsset_AssetPropertyProperty, _aws_cdk_aws_iotsitewise_CfnAssetModelProps, _aws_cdk_aws_iotsitewise_CfnAssetModel, _aws_cdk_aws_iotsitewise_CfnAssetModel_AssetModelCompositeModelProperty, _aws_cdk_aws_iotsitewise_CfnAssetModel_AssetModelHierarchyProperty, _aws_cdk_aws_iotsitewise_CfnAssetModel_AssetModelPropertyProperty, _aws_cdk_aws_iotsitewise_CfnAssetModel_AttributeProperty, _aws_cdk_aws_iotsitewise_CfnAssetModel_ExpressionVariableProperty, _aws_cdk_aws_iotsitewise_CfnAssetModel_MetricProperty, _aws_cdk_aws_iotsitewise_CfnAssetModel_MetricWindowProperty, _aws_cdk_aws_iotsitewise_CfnAssetModel_PropertyTypeProperty, _aws_cdk_aws_iotsitewise_CfnAssetModel_TransformProperty, _aws_cdk_aws_iotsitewise_CfnAssetModel_TumblingWindowProperty, _aws_cdk_aws_iotsitewise_CfnAssetModel_VariableValueProperty, _aws_cdk_aws_iotsitewise_CfnDashboardProps, _aws_cdk_aws_iotsitewise_CfnDashboard, _aws_cdk_aws_iotsitewise_CfnGatewayProps, _aws_cdk_aws_iotsitewise_CfnGateway, _aws_cdk_aws_iotsitewise_CfnGateway_GatewayCapabilitySummaryProperty, _aws_cdk_aws_iotsitewise_CfnGateway_GatewayPlatformProperty, _aws_cdk_aws_iotsitewise_CfnGateway_GreengrassProperty, _aws_cdk_aws_iotsitewise_CfnGateway_GreengrassV2Property, _aws_cdk_aws_iotsitewise_CfnPortalProps, _aws_cdk_aws_iotsitewise_CfnPortal, _aws_cdk_aws_iotsitewise_CfnPortal_AlarmsProperty, _aws_cdk_aws_iotsitewise_CfnProjectProps, _aws_cdk_aws_iotsitewise_CfnProject };
