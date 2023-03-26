function _aws_cdk_aws_nimblestudio_CfnLaunchProfileProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.streamConfiguration))
            _aws_cdk_aws_nimblestudio_CfnLaunchProfile_StreamConfigurationProperty(p.streamConfiguration);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_nimblestudio_CfnLaunchProfile(p) {
}
function _aws_cdk_aws_nimblestudio_CfnLaunchProfile_StreamConfigurationProperty(p) {
}
function _aws_cdk_aws_nimblestudio_CfnLaunchProfile_StreamConfigurationSessionStorageProperty(p) {
}
function _aws_cdk_aws_nimblestudio_CfnLaunchProfile_StreamingSessionStorageRootProperty(p) {
}
function _aws_cdk_aws_nimblestudio_CfnLaunchProfile_VolumeConfigurationProperty(p) {
}
function _aws_cdk_aws_nimblestudio_CfnStreamingImageProps(p) {
}
function _aws_cdk_aws_nimblestudio_CfnStreamingImage(p) {
}
function _aws_cdk_aws_nimblestudio_CfnStreamingImage_StreamingImageEncryptionConfigurationProperty(p) {
}
function _aws_cdk_aws_nimblestudio_CfnStudioProps(p) {
}
function _aws_cdk_aws_nimblestudio_CfnStudio(p) {
}
function _aws_cdk_aws_nimblestudio_CfnStudio_StudioEncryptionConfigurationProperty(p) {
}
function _aws_cdk_aws_nimblestudio_CfnStudioComponentProps(p) {
}
function _aws_cdk_aws_nimblestudio_CfnStudioComponent(p) {
}
function _aws_cdk_aws_nimblestudio_CfnStudioComponent_ActiveDirectoryComputerAttributeProperty(p) {
}
function _aws_cdk_aws_nimblestudio_CfnStudioComponent_ActiveDirectoryConfigurationProperty(p) {
}
function _aws_cdk_aws_nimblestudio_CfnStudioComponent_ComputeFarmConfigurationProperty(p) {
}
function _aws_cdk_aws_nimblestudio_CfnStudioComponent_LicenseServiceConfigurationProperty(p) {
}
function _aws_cdk_aws_nimblestudio_CfnStudioComponent_ScriptParameterKeyValueProperty(p) {
}
function _aws_cdk_aws_nimblestudio_CfnStudioComponent_SharedFileSystemConfigurationProperty(p) {
}
function _aws_cdk_aws_nimblestudio_CfnStudioComponent_StudioComponentConfigurationProperty(p) {
}
function _aws_cdk_aws_nimblestudio_CfnStudioComponent_StudioComponentInitializationScriptProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_nimblestudio_CfnLaunchProfileProps, _aws_cdk_aws_nimblestudio_CfnLaunchProfile, _aws_cdk_aws_nimblestudio_CfnLaunchProfile_StreamConfigurationProperty, _aws_cdk_aws_nimblestudio_CfnLaunchProfile_StreamConfigurationSessionStorageProperty, _aws_cdk_aws_nimblestudio_CfnLaunchProfile_StreamingSessionStorageRootProperty, _aws_cdk_aws_nimblestudio_CfnLaunchProfile_VolumeConfigurationProperty, _aws_cdk_aws_nimblestudio_CfnStreamingImageProps, _aws_cdk_aws_nimblestudio_CfnStreamingImage, _aws_cdk_aws_nimblestudio_CfnStreamingImage_StreamingImageEncryptionConfigurationProperty, _aws_cdk_aws_nimblestudio_CfnStudioProps, _aws_cdk_aws_nimblestudio_CfnStudio, _aws_cdk_aws_nimblestudio_CfnStudio_StudioEncryptionConfigurationProperty, _aws_cdk_aws_nimblestudio_CfnStudioComponentProps, _aws_cdk_aws_nimblestudio_CfnStudioComponent, _aws_cdk_aws_nimblestudio_CfnStudioComponent_ActiveDirectoryComputerAttributeProperty, _aws_cdk_aws_nimblestudio_CfnStudioComponent_ActiveDirectoryConfigurationProperty, _aws_cdk_aws_nimblestudio_CfnStudioComponent_ComputeFarmConfigurationProperty, _aws_cdk_aws_nimblestudio_CfnStudioComponent_LicenseServiceConfigurationProperty, _aws_cdk_aws_nimblestudio_CfnStudioComponent_ScriptParameterKeyValueProperty, _aws_cdk_aws_nimblestudio_CfnStudioComponent_SharedFileSystemConfigurationProperty, _aws_cdk_aws_nimblestudio_CfnStudioComponent_StudioComponentConfigurationProperty, _aws_cdk_aws_nimblestudio_CfnStudioComponent_StudioComponentInitializationScriptProperty };
