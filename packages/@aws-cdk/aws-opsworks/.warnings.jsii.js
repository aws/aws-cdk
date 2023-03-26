function _aws_cdk_aws_opsworks_CfnAppProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.appSource))
            _aws_cdk_aws_opsworks_CfnApp_SourceProperty(p.appSource);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_opsworks_CfnApp(p) {
}
function _aws_cdk_aws_opsworks_CfnApp_DataSourceProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnApp_EnvironmentVariableProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnApp_SourceProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnApp_SslConfigurationProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnElasticLoadBalancerAttachmentProps(p) {
}
function _aws_cdk_aws_opsworks_CfnElasticLoadBalancerAttachment(p) {
}
function _aws_cdk_aws_opsworks_CfnInstanceProps(p) {
}
function _aws_cdk_aws_opsworks_CfnInstance(p) {
}
function _aws_cdk_aws_opsworks_CfnInstance_BlockDeviceMappingProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnInstance_EbsBlockDeviceProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnInstance_TimeBasedAutoScalingProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnLayerProps(p) {
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
function _aws_cdk_aws_opsworks_CfnLayer(p) {
}
function _aws_cdk_aws_opsworks_CfnLayer_AutoScalingThresholdsProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnLayer_LifecycleEventConfigurationProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnLayer_LoadBasedAutoScalingProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnLayer_RecipesProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnLayer_ShutdownEventConfigurationProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnLayer_VolumeConfigurationProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnStackProps(p) {
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
function _aws_cdk_aws_opsworks_CfnStack(p) {
}
function _aws_cdk_aws_opsworks_CfnStack_ChefConfigurationProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnStack_ElasticIpProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnStack_RdsDbInstanceProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnStack_SourceProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnStack_StackConfigurationManagerProperty(p) {
}
function _aws_cdk_aws_opsworks_CfnUserProfileProps(p) {
}
function _aws_cdk_aws_opsworks_CfnUserProfile(p) {
}
function _aws_cdk_aws_opsworks_CfnVolumeProps(p) {
}
function _aws_cdk_aws_opsworks_CfnVolume(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_opsworks_CfnAppProps, _aws_cdk_aws_opsworks_CfnApp, _aws_cdk_aws_opsworks_CfnApp_DataSourceProperty, _aws_cdk_aws_opsworks_CfnApp_EnvironmentVariableProperty, _aws_cdk_aws_opsworks_CfnApp_SourceProperty, _aws_cdk_aws_opsworks_CfnApp_SslConfigurationProperty, _aws_cdk_aws_opsworks_CfnElasticLoadBalancerAttachmentProps, _aws_cdk_aws_opsworks_CfnElasticLoadBalancerAttachment, _aws_cdk_aws_opsworks_CfnInstanceProps, _aws_cdk_aws_opsworks_CfnInstance, _aws_cdk_aws_opsworks_CfnInstance_BlockDeviceMappingProperty, _aws_cdk_aws_opsworks_CfnInstance_EbsBlockDeviceProperty, _aws_cdk_aws_opsworks_CfnInstance_TimeBasedAutoScalingProperty, _aws_cdk_aws_opsworks_CfnLayerProps, _aws_cdk_aws_opsworks_CfnLayer, _aws_cdk_aws_opsworks_CfnLayer_AutoScalingThresholdsProperty, _aws_cdk_aws_opsworks_CfnLayer_LifecycleEventConfigurationProperty, _aws_cdk_aws_opsworks_CfnLayer_LoadBasedAutoScalingProperty, _aws_cdk_aws_opsworks_CfnLayer_RecipesProperty, _aws_cdk_aws_opsworks_CfnLayer_ShutdownEventConfigurationProperty, _aws_cdk_aws_opsworks_CfnLayer_VolumeConfigurationProperty, _aws_cdk_aws_opsworks_CfnStackProps, _aws_cdk_aws_opsworks_CfnStack, _aws_cdk_aws_opsworks_CfnStack_ChefConfigurationProperty, _aws_cdk_aws_opsworks_CfnStack_ElasticIpProperty, _aws_cdk_aws_opsworks_CfnStack_RdsDbInstanceProperty, _aws_cdk_aws_opsworks_CfnStack_SourceProperty, _aws_cdk_aws_opsworks_CfnStack_StackConfigurationManagerProperty, _aws_cdk_aws_opsworks_CfnUserProfileProps, _aws_cdk_aws_opsworks_CfnUserProfile, _aws_cdk_aws_opsworks_CfnVolumeProps, _aws_cdk_aws_opsworks_CfnVolume };
