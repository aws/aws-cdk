function _aws_cdk_aws_imagebuilder_CfnComponentProps(p) {
}
function _aws_cdk_aws_imagebuilder_CfnComponent(p) {
}
function _aws_cdk_aws_imagebuilder_CfnContainerRecipeProps(p) {
}
function _aws_cdk_aws_imagebuilder_CfnContainerRecipe(p) {
}
function _aws_cdk_aws_imagebuilder_CfnContainerRecipe_ComponentConfigurationProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnContainerRecipe_ComponentParameterProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnContainerRecipe_EbsInstanceBlockDeviceSpecificationProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnContainerRecipe_InstanceBlockDeviceMappingProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnContainerRecipe_InstanceConfigurationProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnContainerRecipe_TargetContainerRepositoryProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnDistributionConfigurationProps(p) {
}
function _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration(p) {
}
function _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_AmiDistributionConfigurationProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_ContainerDistributionConfigurationProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_DistributionProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_FastLaunchConfigurationProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_FastLaunchLaunchTemplateSpecificationProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_FastLaunchSnapshotConfigurationProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_LaunchPermissionConfigurationProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_LaunchTemplateConfigurationProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_TargetContainerRepositoryProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnImageProps(p) {
}
function _aws_cdk_aws_imagebuilder_CfnImage(p) {
}
function _aws_cdk_aws_imagebuilder_CfnImage_ImageTestsConfigurationProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnImagePipelineProps(p) {
}
function _aws_cdk_aws_imagebuilder_CfnImagePipeline(p) {
}
function _aws_cdk_aws_imagebuilder_CfnImagePipeline_ImageTestsConfigurationProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnImagePipeline_ScheduleProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnImageRecipeProps(p) {
}
function _aws_cdk_aws_imagebuilder_CfnImageRecipe(p) {
}
function _aws_cdk_aws_imagebuilder_CfnImageRecipe_AdditionalInstanceConfigurationProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnImageRecipe_ComponentConfigurationProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnImageRecipe_ComponentParameterProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnImageRecipe_EbsInstanceBlockDeviceSpecificationProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnImageRecipe_InstanceBlockDeviceMappingProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnImageRecipe_SystemsManagerAgentProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnInfrastructureConfigurationProps(p) {
}
function _aws_cdk_aws_imagebuilder_CfnInfrastructureConfiguration(p) {
}
function _aws_cdk_aws_imagebuilder_CfnInfrastructureConfiguration_InstanceMetadataOptionsProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnInfrastructureConfiguration_LoggingProperty(p) {
}
function _aws_cdk_aws_imagebuilder_CfnInfrastructureConfiguration_S3LogsProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_imagebuilder_CfnComponentProps, _aws_cdk_aws_imagebuilder_CfnComponent, _aws_cdk_aws_imagebuilder_CfnContainerRecipeProps, _aws_cdk_aws_imagebuilder_CfnContainerRecipe, _aws_cdk_aws_imagebuilder_CfnContainerRecipe_ComponentConfigurationProperty, _aws_cdk_aws_imagebuilder_CfnContainerRecipe_ComponentParameterProperty, _aws_cdk_aws_imagebuilder_CfnContainerRecipe_EbsInstanceBlockDeviceSpecificationProperty, _aws_cdk_aws_imagebuilder_CfnContainerRecipe_InstanceBlockDeviceMappingProperty, _aws_cdk_aws_imagebuilder_CfnContainerRecipe_InstanceConfigurationProperty, _aws_cdk_aws_imagebuilder_CfnContainerRecipe_TargetContainerRepositoryProperty, _aws_cdk_aws_imagebuilder_CfnDistributionConfigurationProps, _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration, _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_AmiDistributionConfigurationProperty, _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_ContainerDistributionConfigurationProperty, _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_DistributionProperty, _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_FastLaunchConfigurationProperty, _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_FastLaunchLaunchTemplateSpecificationProperty, _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_FastLaunchSnapshotConfigurationProperty, _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_LaunchPermissionConfigurationProperty, _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_LaunchTemplateConfigurationProperty, _aws_cdk_aws_imagebuilder_CfnDistributionConfiguration_TargetContainerRepositoryProperty, _aws_cdk_aws_imagebuilder_CfnImageProps, _aws_cdk_aws_imagebuilder_CfnImage, _aws_cdk_aws_imagebuilder_CfnImage_ImageTestsConfigurationProperty, _aws_cdk_aws_imagebuilder_CfnImagePipelineProps, _aws_cdk_aws_imagebuilder_CfnImagePipeline, _aws_cdk_aws_imagebuilder_CfnImagePipeline_ImageTestsConfigurationProperty, _aws_cdk_aws_imagebuilder_CfnImagePipeline_ScheduleProperty, _aws_cdk_aws_imagebuilder_CfnImageRecipeProps, _aws_cdk_aws_imagebuilder_CfnImageRecipe, _aws_cdk_aws_imagebuilder_CfnImageRecipe_AdditionalInstanceConfigurationProperty, _aws_cdk_aws_imagebuilder_CfnImageRecipe_ComponentConfigurationProperty, _aws_cdk_aws_imagebuilder_CfnImageRecipe_ComponentParameterProperty, _aws_cdk_aws_imagebuilder_CfnImageRecipe_EbsInstanceBlockDeviceSpecificationProperty, _aws_cdk_aws_imagebuilder_CfnImageRecipe_InstanceBlockDeviceMappingProperty, _aws_cdk_aws_imagebuilder_CfnImageRecipe_SystemsManagerAgentProperty, _aws_cdk_aws_imagebuilder_CfnInfrastructureConfigurationProps, _aws_cdk_aws_imagebuilder_CfnInfrastructureConfiguration, _aws_cdk_aws_imagebuilder_CfnInfrastructureConfiguration_InstanceMetadataOptionsProperty, _aws_cdk_aws_imagebuilder_CfnInfrastructureConfiguration_LoggingProperty, _aws_cdk_aws_imagebuilder_CfnInfrastructureConfiguration_S3LogsProperty };
