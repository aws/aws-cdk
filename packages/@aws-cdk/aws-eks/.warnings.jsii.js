function _aws_cdk_aws_eks_AwsAuthProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_Cluster(p.cluster);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_AwsAuth(p) {
}
function _aws_cdk_aws_eks_AwsAuthMapping(p) {
}
function _aws_cdk_aws_eks_ICluster(p) {
}
function _aws_cdk_aws_eks_ClusterAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.kubectlProvider))
            _aws_cdk_aws_eks_IKubectlProvider(p.kubectlProvider);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_CommonClusterOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.version))
            _aws_cdk_aws_eks_KubernetesVersion(p.version);
        if (p.vpcSubnets != null)
            for (const o of p.vpcSubnets)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_SubnetSelection(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_ClusterOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.albController))
            _aws_cdk_aws_eks_AlbControllerOptions(p.albController);
        if (p.clusterLogging != null)
            for (const o of p.clusterLogging)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eks_ClusterLoggingTypes(o);
        if (!visitedObjects.has(p.coreDnsComputeType))
            _aws_cdk_aws_eks_CoreDnsComputeType(p.coreDnsComputeType);
        if (!visitedObjects.has(p.endpointAccess))
            _aws_cdk_aws_eks_EndpointAccess(p.endpointAccess);
        if (!visitedObjects.has(p.version))
            _aws_cdk_aws_eks_KubernetesVersion(p.version);
        if (p.vpcSubnets != null)
            for (const o of p.vpcSubnets)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_SubnetSelection(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_EndpointAccess(p) {
}
function _aws_cdk_aws_eks_ClusterProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.defaultCapacityType))
            _aws_cdk_aws_eks_DefaultCapacityType(p.defaultCapacityType);
        if (!visitedObjects.has(p.albController))
            _aws_cdk_aws_eks_AlbControllerOptions(p.albController);
        if (p.clusterLogging != null)
            for (const o of p.clusterLogging)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eks_ClusterLoggingTypes(o);
        if (!visitedObjects.has(p.coreDnsComputeType))
            _aws_cdk_aws_eks_CoreDnsComputeType(p.coreDnsComputeType);
        if (!visitedObjects.has(p.endpointAccess))
            _aws_cdk_aws_eks_EndpointAccess(p.endpointAccess);
        if (!visitedObjects.has(p.version))
            _aws_cdk_aws_eks_KubernetesVersion(p.version);
        if (p.vpcSubnets != null)
            for (const o of p.vpcSubnets)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_SubnetSelection(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_KubernetesVersion(p) {
}
function _aws_cdk_aws_eks_ClusterLoggingTypes(p) {
}
function _aws_cdk_aws_eks_ServiceLoadBalancerAddressOptions(p) {
}
function _aws_cdk_aws_eks_IngressLoadBalancerAddressOptions(p) {
}
function _aws_cdk_aws_eks_Cluster(p) {
}
function _aws_cdk_aws_eks_AutoScalingGroupCapacityOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.bootstrapOptions))
            _aws_cdk_aws_eks_BootstrapOptions(p.bootstrapOptions);
        if (!visitedObjects.has(p.machineImageType))
            _aws_cdk_aws_eks_MachineImageType(p.machineImageType);
        if (p.blockDevices != null)
            for (const o of p.blockDevices)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-autoscaling/.warnings.jsii.js")._aws_cdk_aws_autoscaling_BlockDevice(o);
        if (p.groupMetrics != null)
            for (const o of p.groupMetrics)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-autoscaling/.warnings.jsii.js")._aws_cdk_aws_autoscaling_GroupMetrics(o);
        if (p.notifications != null)
            for (const o of p.notifications)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-autoscaling/.warnings.jsii.js")._aws_cdk_aws_autoscaling_NotificationConfiguration(o);
        if ("notificationsTopic" in p)
            print("@aws-cdk/aws-autoscaling.CommonAutoScalingGroupProps#notificationsTopic", "use `notifications`");
        if ("replacingUpdateMinSuccessfulInstancesPercent" in p)
            print("@aws-cdk/aws-autoscaling.CommonAutoScalingGroupProps#replacingUpdateMinSuccessfulInstancesPercent", "Use `signals` instead");
        if ("resourceSignalCount" in p)
            print("@aws-cdk/aws-autoscaling.CommonAutoScalingGroupProps#resourceSignalCount", "Use `signals` instead.");
        if ("resourceSignalTimeout" in p)
            print("@aws-cdk/aws-autoscaling.CommonAutoScalingGroupProps#resourceSignalTimeout", "Use `signals` instead.");
        if ("rollingUpdateConfiguration" in p)
            print("@aws-cdk/aws-autoscaling.CommonAutoScalingGroupProps#rollingUpdateConfiguration", "Use `updatePolicy` instead");
        if (p.terminationPolicies != null)
            for (const o of p.terminationPolicies)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-autoscaling/.warnings.jsii.js")._aws_cdk_aws_autoscaling_TerminationPolicy(o);
        if ("updateType" in p)
            print("@aws-cdk/aws-autoscaling.CommonAutoScalingGroupProps#updateType", "Use `updatePolicy` instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_BootstrapOptions(p) {
}
function _aws_cdk_aws_eks_AutoScalingGroupOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.bootstrapOptions))
            _aws_cdk_aws_eks_BootstrapOptions(p.bootstrapOptions);
        if (!visitedObjects.has(p.machineImageType))
            _aws_cdk_aws_eks_MachineImageType(p.machineImageType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_EksOptimizedImageProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cpuArch))
            _aws_cdk_aws_eks_CpuArch(p.cpuArch);
        if (!visitedObjects.has(p.nodeType))
            _aws_cdk_aws_eks_NodeType(p.nodeType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_EksOptimizedImage(p) {
}
function _aws_cdk_aws_eks_NodeType(p) {
}
function _aws_cdk_aws_eks_CpuArch(p) {
}
function _aws_cdk_aws_eks_CoreDnsComputeType(p) {
}
function _aws_cdk_aws_eks_DefaultCapacityType(p) {
}
function _aws_cdk_aws_eks_MachineImageType(p) {
}
function _aws_cdk_aws_eks_CfnAddonProps(p) {
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
function _aws_cdk_aws_eks_CfnAddon(p) {
}
function _aws_cdk_aws_eks_CfnClusterProps(p) {
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
function _aws_cdk_aws_eks_CfnCluster(p) {
}
function _aws_cdk_aws_eks_CfnCluster_ClusterLoggingProperty(p) {
}
function _aws_cdk_aws_eks_CfnCluster_ControlPlanePlacementProperty(p) {
}
function _aws_cdk_aws_eks_CfnCluster_EncryptionConfigProperty(p) {
}
function _aws_cdk_aws_eks_CfnCluster_KubernetesNetworkConfigProperty(p) {
}
function _aws_cdk_aws_eks_CfnCluster_LoggingProperty(p) {
}
function _aws_cdk_aws_eks_CfnCluster_LoggingTypeConfigProperty(p) {
}
function _aws_cdk_aws_eks_CfnCluster_OutpostConfigProperty(p) {
}
function _aws_cdk_aws_eks_CfnCluster_ProviderProperty(p) {
}
function _aws_cdk_aws_eks_CfnCluster_ResourcesVpcConfigProperty(p) {
}
function _aws_cdk_aws_eks_CfnFargateProfileProps(p) {
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
function _aws_cdk_aws_eks_CfnFargateProfile(p) {
}
function _aws_cdk_aws_eks_CfnFargateProfile_LabelProperty(p) {
}
function _aws_cdk_aws_eks_CfnFargateProfile_SelectorProperty(p) {
}
function _aws_cdk_aws_eks_CfnIdentityProviderConfigProps(p) {
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
function _aws_cdk_aws_eks_CfnIdentityProviderConfig(p) {
}
function _aws_cdk_aws_eks_CfnIdentityProviderConfig_OidcIdentityProviderConfigProperty(p) {
}
function _aws_cdk_aws_eks_CfnIdentityProviderConfig_RequiredClaimProperty(p) {
}
function _aws_cdk_aws_eks_CfnNodegroupProps(p) {
}
function _aws_cdk_aws_eks_CfnNodegroup(p) {
}
function _aws_cdk_aws_eks_CfnNodegroup_LaunchTemplateSpecificationProperty(p) {
}
function _aws_cdk_aws_eks_CfnNodegroup_RemoteAccessProperty(p) {
}
function _aws_cdk_aws_eks_CfnNodegroup_ScalingConfigProperty(p) {
}
function _aws_cdk_aws_eks_CfnNodegroup_TaintProperty(p) {
}
function _aws_cdk_aws_eks_CfnNodegroup_UpdateConfigProperty(p) {
}
function _aws_cdk_aws_eks_FargateProfileOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.selectors != null)
            for (const o of p.selectors)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eks_Selector(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_FargateProfileProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_Cluster(p.cluster);
        if (p.selectors != null)
            for (const o of p.selectors)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eks_Selector(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_Selector(p) {
}
function _aws_cdk_aws_eks_FargateProfile(p) {
}
function _aws_cdk_aws_eks_HelmChartOptions(p) {
}
function _aws_cdk_aws_eks_HelmChartProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_ICluster(p.cluster);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_HelmChart(p) {
}
function _aws_cdk_aws_eks_KubernetesPatchProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_ICluster(p.cluster);
        if (!visitedObjects.has(p.patchType))
            _aws_cdk_aws_eks_PatchType(p.patchType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_PatchType(p) {
}
function _aws_cdk_aws_eks_KubernetesPatch(p) {
}
function _aws_cdk_aws_eks_KubernetesManifestOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.ingressAlbScheme))
            _aws_cdk_aws_eks_AlbScheme(p.ingressAlbScheme);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_KubernetesManifestProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_ICluster(p.cluster);
        if (!visitedObjects.has(p.ingressAlbScheme))
            _aws_cdk_aws_eks_AlbScheme(p.ingressAlbScheme);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_KubernetesManifest(p) {
}
function _aws_cdk_aws_eks_KubernetesObjectValueProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_ICluster(p.cluster);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_KubernetesObjectValue(p) {
}
function _aws_cdk_aws_eks_KubectlProviderProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_ICluster(p.cluster);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_KubectlProviderAttributes(p) {
}
function _aws_cdk_aws_eks_IKubectlProvider(p) {
}
function _aws_cdk_aws_eks_KubectlProvider(p) {
}
function _aws_cdk_aws_eks_FargateClusterProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.defaultProfile))
            _aws_cdk_aws_eks_FargateProfileOptions(p.defaultProfile);
        if (!visitedObjects.has(p.albController))
            _aws_cdk_aws_eks_AlbControllerOptions(p.albController);
        if (p.clusterLogging != null)
            for (const o of p.clusterLogging)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eks_ClusterLoggingTypes(o);
        if (!visitedObjects.has(p.coreDnsComputeType))
            _aws_cdk_aws_eks_CoreDnsComputeType(p.coreDnsComputeType);
        if (!visitedObjects.has(p.endpointAccess))
            _aws_cdk_aws_eks_EndpointAccess(p.endpointAccess);
        if (!visitedObjects.has(p.version))
            _aws_cdk_aws_eks_KubernetesVersion(p.version);
        if (p.vpcSubnets != null)
            for (const o of p.vpcSubnets)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_SubnetSelection(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_FargateCluster(p) {
}
function _aws_cdk_aws_eks_ServiceAccountOptions(p) {
}
function _aws_cdk_aws_eks_ServiceAccountProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_ICluster(p.cluster);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_ServiceAccount(p) {
}
function _aws_cdk_aws_eks_INodegroup(p) {
}
function _aws_cdk_aws_eks_NodegroupAmiType(p) {
}
function _aws_cdk_aws_eks_CapacityType(p) {
}
function _aws_cdk_aws_eks_NodegroupRemoteAccess(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.sourceSecurityGroups != null)
            for (const o of p.sourceSecurityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_LaunchTemplateSpec(p) {
}
function _aws_cdk_aws_eks_TaintEffect(p) {
}
function _aws_cdk_aws_eks_TaintSpec(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.effect))
            _aws_cdk_aws_eks_TaintEffect(p.effect);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_NodegroupOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.amiType))
            _aws_cdk_aws_eks_NodegroupAmiType(p.amiType);
        if (!visitedObjects.has(p.capacityType))
            _aws_cdk_aws_eks_CapacityType(p.capacityType);
        if ("instanceType" in p)
            print("@aws-cdk/aws-eks.NodegroupOptions#instanceType", "Use `instanceTypes` instead.");
        if (p.instanceTypes != null)
            for (const o of p.instanceTypes)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_InstanceType(o);
        if (!visitedObjects.has(p.launchTemplateSpec))
            _aws_cdk_aws_eks_LaunchTemplateSpec(p.launchTemplateSpec);
        if (!visitedObjects.has(p.remoteAccess))
            _aws_cdk_aws_eks_NodegroupRemoteAccess(p.remoteAccess);
        if (p.taints != null)
            for (const o of p.taints)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eks_TaintSpec(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_NodegroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_ICluster(p.cluster);
        if (!visitedObjects.has(p.amiType))
            _aws_cdk_aws_eks_NodegroupAmiType(p.amiType);
        if (!visitedObjects.has(p.capacityType))
            _aws_cdk_aws_eks_CapacityType(p.capacityType);
        if ("instanceType" in p)
            print("@aws-cdk/aws-eks.NodegroupOptions#instanceType", "Use `instanceTypes` instead.");
        if (p.instanceTypes != null)
            for (const o of p.instanceTypes)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_InstanceType(o);
        if (!visitedObjects.has(p.launchTemplateSpec))
            _aws_cdk_aws_eks_LaunchTemplateSpec(p.launchTemplateSpec);
        if (!visitedObjects.has(p.remoteAccess))
            _aws_cdk_aws_eks_NodegroupRemoteAccess(p.remoteAccess);
        if (p.taints != null)
            for (const o of p.taints)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eks_TaintSpec(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_Nodegroup(p) {
}
function _aws_cdk_aws_eks_OpenIdConnectProviderProps(p) {
}
function _aws_cdk_aws_eks_OpenIdConnectProvider(p) {
}
function _aws_cdk_aws_eks_AlbControllerVersion(p) {
}
function _aws_cdk_aws_eks_AlbScheme(p) {
}
function _aws_cdk_aws_eks_AlbControllerOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.version))
            _aws_cdk_aws_eks_AlbControllerVersion(p.version);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_AlbControllerProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_Cluster(p.cluster);
        if (!visitedObjects.has(p.version))
            _aws_cdk_aws_eks_AlbControllerVersion(p.version);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_AlbController(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_eks_AwsAuthProps, _aws_cdk_aws_eks_AwsAuth, _aws_cdk_aws_eks_AwsAuthMapping, _aws_cdk_aws_eks_ICluster, _aws_cdk_aws_eks_ClusterAttributes, _aws_cdk_aws_eks_CommonClusterOptions, _aws_cdk_aws_eks_ClusterOptions, _aws_cdk_aws_eks_EndpointAccess, _aws_cdk_aws_eks_ClusterProps, _aws_cdk_aws_eks_KubernetesVersion, _aws_cdk_aws_eks_ClusterLoggingTypes, _aws_cdk_aws_eks_ServiceLoadBalancerAddressOptions, _aws_cdk_aws_eks_IngressLoadBalancerAddressOptions, _aws_cdk_aws_eks_Cluster, _aws_cdk_aws_eks_AutoScalingGroupCapacityOptions, _aws_cdk_aws_eks_BootstrapOptions, _aws_cdk_aws_eks_AutoScalingGroupOptions, _aws_cdk_aws_eks_EksOptimizedImageProps, _aws_cdk_aws_eks_EksOptimizedImage, _aws_cdk_aws_eks_NodeType, _aws_cdk_aws_eks_CpuArch, _aws_cdk_aws_eks_CoreDnsComputeType, _aws_cdk_aws_eks_DefaultCapacityType, _aws_cdk_aws_eks_MachineImageType, _aws_cdk_aws_eks_CfnAddonProps, _aws_cdk_aws_eks_CfnAddon, _aws_cdk_aws_eks_CfnClusterProps, _aws_cdk_aws_eks_CfnCluster, _aws_cdk_aws_eks_CfnCluster_ClusterLoggingProperty, _aws_cdk_aws_eks_CfnCluster_ControlPlanePlacementProperty, _aws_cdk_aws_eks_CfnCluster_EncryptionConfigProperty, _aws_cdk_aws_eks_CfnCluster_KubernetesNetworkConfigProperty, _aws_cdk_aws_eks_CfnCluster_LoggingProperty, _aws_cdk_aws_eks_CfnCluster_LoggingTypeConfigProperty, _aws_cdk_aws_eks_CfnCluster_OutpostConfigProperty, _aws_cdk_aws_eks_CfnCluster_ProviderProperty, _aws_cdk_aws_eks_CfnCluster_ResourcesVpcConfigProperty, _aws_cdk_aws_eks_CfnFargateProfileProps, _aws_cdk_aws_eks_CfnFargateProfile, _aws_cdk_aws_eks_CfnFargateProfile_LabelProperty, _aws_cdk_aws_eks_CfnFargateProfile_SelectorProperty, _aws_cdk_aws_eks_CfnIdentityProviderConfigProps, _aws_cdk_aws_eks_CfnIdentityProviderConfig, _aws_cdk_aws_eks_CfnIdentityProviderConfig_OidcIdentityProviderConfigProperty, _aws_cdk_aws_eks_CfnIdentityProviderConfig_RequiredClaimProperty, _aws_cdk_aws_eks_CfnNodegroupProps, _aws_cdk_aws_eks_CfnNodegroup, _aws_cdk_aws_eks_CfnNodegroup_LaunchTemplateSpecificationProperty, _aws_cdk_aws_eks_CfnNodegroup_RemoteAccessProperty, _aws_cdk_aws_eks_CfnNodegroup_ScalingConfigProperty, _aws_cdk_aws_eks_CfnNodegroup_TaintProperty, _aws_cdk_aws_eks_CfnNodegroup_UpdateConfigProperty, _aws_cdk_aws_eks_FargateProfileOptions, _aws_cdk_aws_eks_FargateProfileProps, _aws_cdk_aws_eks_Selector, _aws_cdk_aws_eks_FargateProfile, _aws_cdk_aws_eks_HelmChartOptions, _aws_cdk_aws_eks_HelmChartProps, _aws_cdk_aws_eks_HelmChart, _aws_cdk_aws_eks_KubernetesPatchProps, _aws_cdk_aws_eks_PatchType, _aws_cdk_aws_eks_KubernetesPatch, _aws_cdk_aws_eks_KubernetesManifestOptions, _aws_cdk_aws_eks_KubernetesManifestProps, _aws_cdk_aws_eks_KubernetesManifest, _aws_cdk_aws_eks_KubernetesObjectValueProps, _aws_cdk_aws_eks_KubernetesObjectValue, _aws_cdk_aws_eks_KubectlProviderProps, _aws_cdk_aws_eks_KubectlProviderAttributes, _aws_cdk_aws_eks_IKubectlProvider, _aws_cdk_aws_eks_KubectlProvider, _aws_cdk_aws_eks_FargateClusterProps, _aws_cdk_aws_eks_FargateCluster, _aws_cdk_aws_eks_ServiceAccountOptions, _aws_cdk_aws_eks_ServiceAccountProps, _aws_cdk_aws_eks_ServiceAccount, _aws_cdk_aws_eks_INodegroup, _aws_cdk_aws_eks_NodegroupAmiType, _aws_cdk_aws_eks_CapacityType, _aws_cdk_aws_eks_NodegroupRemoteAccess, _aws_cdk_aws_eks_LaunchTemplateSpec, _aws_cdk_aws_eks_TaintEffect, _aws_cdk_aws_eks_TaintSpec, _aws_cdk_aws_eks_NodegroupOptions, _aws_cdk_aws_eks_NodegroupProps, _aws_cdk_aws_eks_Nodegroup, _aws_cdk_aws_eks_OpenIdConnectProviderProps, _aws_cdk_aws_eks_OpenIdConnectProvider, _aws_cdk_aws_eks_AlbControllerVersion, _aws_cdk_aws_eks_AlbScheme, _aws_cdk_aws_eks_AlbControllerOptions, _aws_cdk_aws_eks_AlbControllerProps, _aws_cdk_aws_eks_AlbController };
