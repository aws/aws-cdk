function _aws_cdk_aws_emr_CfnClusterProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.instances))
            _aws_cdk_aws_emr_CfnCluster_JobFlowInstancesConfigProperty(p.instances);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_emr_CfnCluster(p) {
}
function _aws_cdk_aws_emr_CfnCluster_ApplicationProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_AutoScalingPolicyProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_AutoTerminationPolicyProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_BootstrapActionConfigProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_CloudWatchAlarmDefinitionProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_ComputeLimitsProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_ConfigurationProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_EbsBlockDeviceConfigProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_EbsConfigurationProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_HadoopJarStepConfigProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_InstanceFleetConfigProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_InstanceFleetProvisioningSpecificationsProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_InstanceGroupConfigProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_InstanceTypeConfigProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_JobFlowInstancesConfigProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_KerberosAttributesProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_KeyValueProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_ManagedScalingPolicyProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_MetricDimensionProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_OnDemandProvisioningSpecificationProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_PlacementTypeProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_ScalingActionProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_ScalingConstraintsProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_ScalingRuleProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_ScalingTriggerProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_ScriptBootstrapActionConfigProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_SimpleScalingPolicyConfigurationProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_SpotProvisioningSpecificationProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_StepConfigProperty(p) {
}
function _aws_cdk_aws_emr_CfnCluster_VolumeSpecificationProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceFleetConfigProps(p) {
}
function _aws_cdk_aws_emr_CfnInstanceFleetConfig(p) {
}
function _aws_cdk_aws_emr_CfnInstanceFleetConfig_ConfigurationProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceFleetConfig_EbsBlockDeviceConfigProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceFleetConfig_EbsConfigurationProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceFleetConfig_InstanceFleetProvisioningSpecificationsProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceFleetConfig_InstanceTypeConfigProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceFleetConfig_OnDemandProvisioningSpecificationProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceFleetConfig_SpotProvisioningSpecificationProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceFleetConfig_VolumeSpecificationProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceGroupConfigProps(p) {
}
function _aws_cdk_aws_emr_CfnInstanceGroupConfig(p) {
}
function _aws_cdk_aws_emr_CfnInstanceGroupConfig_AutoScalingPolicyProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceGroupConfig_CloudWatchAlarmDefinitionProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceGroupConfig_ConfigurationProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceGroupConfig_EbsBlockDeviceConfigProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceGroupConfig_EbsConfigurationProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceGroupConfig_MetricDimensionProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceGroupConfig_ScalingActionProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceGroupConfig_ScalingConstraintsProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceGroupConfig_ScalingRuleProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceGroupConfig_ScalingTriggerProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceGroupConfig_SimpleScalingPolicyConfigurationProperty(p) {
}
function _aws_cdk_aws_emr_CfnInstanceGroupConfig_VolumeSpecificationProperty(p) {
}
function _aws_cdk_aws_emr_CfnSecurityConfigurationProps(p) {
}
function _aws_cdk_aws_emr_CfnSecurityConfiguration(p) {
}
function _aws_cdk_aws_emr_CfnStepProps(p) {
}
function _aws_cdk_aws_emr_CfnStep(p) {
}
function _aws_cdk_aws_emr_CfnStep_HadoopJarStepConfigProperty(p) {
}
function _aws_cdk_aws_emr_CfnStep_KeyValueProperty(p) {
}
function _aws_cdk_aws_emr_CfnStudioProps(p) {
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
function _aws_cdk_aws_emr_CfnStudio(p) {
}
function _aws_cdk_aws_emr_CfnStudioSessionMappingProps(p) {
}
function _aws_cdk_aws_emr_CfnStudioSessionMapping(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_emr_CfnClusterProps, _aws_cdk_aws_emr_CfnCluster, _aws_cdk_aws_emr_CfnCluster_ApplicationProperty, _aws_cdk_aws_emr_CfnCluster_AutoScalingPolicyProperty, _aws_cdk_aws_emr_CfnCluster_AutoTerminationPolicyProperty, _aws_cdk_aws_emr_CfnCluster_BootstrapActionConfigProperty, _aws_cdk_aws_emr_CfnCluster_CloudWatchAlarmDefinitionProperty, _aws_cdk_aws_emr_CfnCluster_ComputeLimitsProperty, _aws_cdk_aws_emr_CfnCluster_ConfigurationProperty, _aws_cdk_aws_emr_CfnCluster_EbsBlockDeviceConfigProperty, _aws_cdk_aws_emr_CfnCluster_EbsConfigurationProperty, _aws_cdk_aws_emr_CfnCluster_HadoopJarStepConfigProperty, _aws_cdk_aws_emr_CfnCluster_InstanceFleetConfigProperty, _aws_cdk_aws_emr_CfnCluster_InstanceFleetProvisioningSpecificationsProperty, _aws_cdk_aws_emr_CfnCluster_InstanceGroupConfigProperty, _aws_cdk_aws_emr_CfnCluster_InstanceTypeConfigProperty, _aws_cdk_aws_emr_CfnCluster_JobFlowInstancesConfigProperty, _aws_cdk_aws_emr_CfnCluster_KerberosAttributesProperty, _aws_cdk_aws_emr_CfnCluster_KeyValueProperty, _aws_cdk_aws_emr_CfnCluster_ManagedScalingPolicyProperty, _aws_cdk_aws_emr_CfnCluster_MetricDimensionProperty, _aws_cdk_aws_emr_CfnCluster_OnDemandProvisioningSpecificationProperty, _aws_cdk_aws_emr_CfnCluster_PlacementTypeProperty, _aws_cdk_aws_emr_CfnCluster_ScalingActionProperty, _aws_cdk_aws_emr_CfnCluster_ScalingConstraintsProperty, _aws_cdk_aws_emr_CfnCluster_ScalingRuleProperty, _aws_cdk_aws_emr_CfnCluster_ScalingTriggerProperty, _aws_cdk_aws_emr_CfnCluster_ScriptBootstrapActionConfigProperty, _aws_cdk_aws_emr_CfnCluster_SimpleScalingPolicyConfigurationProperty, _aws_cdk_aws_emr_CfnCluster_SpotProvisioningSpecificationProperty, _aws_cdk_aws_emr_CfnCluster_StepConfigProperty, _aws_cdk_aws_emr_CfnCluster_VolumeSpecificationProperty, _aws_cdk_aws_emr_CfnInstanceFleetConfigProps, _aws_cdk_aws_emr_CfnInstanceFleetConfig, _aws_cdk_aws_emr_CfnInstanceFleetConfig_ConfigurationProperty, _aws_cdk_aws_emr_CfnInstanceFleetConfig_EbsBlockDeviceConfigProperty, _aws_cdk_aws_emr_CfnInstanceFleetConfig_EbsConfigurationProperty, _aws_cdk_aws_emr_CfnInstanceFleetConfig_InstanceFleetProvisioningSpecificationsProperty, _aws_cdk_aws_emr_CfnInstanceFleetConfig_InstanceTypeConfigProperty, _aws_cdk_aws_emr_CfnInstanceFleetConfig_OnDemandProvisioningSpecificationProperty, _aws_cdk_aws_emr_CfnInstanceFleetConfig_SpotProvisioningSpecificationProperty, _aws_cdk_aws_emr_CfnInstanceFleetConfig_VolumeSpecificationProperty, _aws_cdk_aws_emr_CfnInstanceGroupConfigProps, _aws_cdk_aws_emr_CfnInstanceGroupConfig, _aws_cdk_aws_emr_CfnInstanceGroupConfig_AutoScalingPolicyProperty, _aws_cdk_aws_emr_CfnInstanceGroupConfig_CloudWatchAlarmDefinitionProperty, _aws_cdk_aws_emr_CfnInstanceGroupConfig_ConfigurationProperty, _aws_cdk_aws_emr_CfnInstanceGroupConfig_EbsBlockDeviceConfigProperty, _aws_cdk_aws_emr_CfnInstanceGroupConfig_EbsConfigurationProperty, _aws_cdk_aws_emr_CfnInstanceGroupConfig_MetricDimensionProperty, _aws_cdk_aws_emr_CfnInstanceGroupConfig_ScalingActionProperty, _aws_cdk_aws_emr_CfnInstanceGroupConfig_ScalingConstraintsProperty, _aws_cdk_aws_emr_CfnInstanceGroupConfig_ScalingRuleProperty, _aws_cdk_aws_emr_CfnInstanceGroupConfig_ScalingTriggerProperty, _aws_cdk_aws_emr_CfnInstanceGroupConfig_SimpleScalingPolicyConfigurationProperty, _aws_cdk_aws_emr_CfnInstanceGroupConfig_VolumeSpecificationProperty, _aws_cdk_aws_emr_CfnSecurityConfigurationProps, _aws_cdk_aws_emr_CfnSecurityConfiguration, _aws_cdk_aws_emr_CfnStepProps, _aws_cdk_aws_emr_CfnStep, _aws_cdk_aws_emr_CfnStep_HadoopJarStepConfigProperty, _aws_cdk_aws_emr_CfnStep_KeyValueProperty, _aws_cdk_aws_emr_CfnStudioProps, _aws_cdk_aws_emr_CfnStudio, _aws_cdk_aws_emr_CfnStudioSessionMappingProps, _aws_cdk_aws_emr_CfnStudioSessionMapping };
