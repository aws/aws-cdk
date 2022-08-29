function _aws_cdk_aws_eks_legacy_ICluster(p) {
}
function _aws_cdk_aws_eks_legacy_ClusterAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("clusterArn" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterAttributes#clusterArn", "");
        if ("clusterCertificateAuthorityData" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterAttributes#clusterCertificateAuthorityData", "");
        if ("clusterEndpoint" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterAttributes#clusterEndpoint", "");
        if ("clusterName" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterAttributes#clusterName", "");
        if ("securityGroups" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterAttributes#securityGroups", "");
        if (!visitedObjects.has(p.securityGroups))
            require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(p.securityGroups);
        if ("vpc" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterAttributes#vpc", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_legacy_ClusterProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("clusterName" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterProps#clusterName", "");
        if ("defaultCapacity" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterProps#defaultCapacity", "");
        if ("defaultCapacityInstance" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterProps#defaultCapacityInstance", "");
        if ("kubectlEnabled" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterProps#kubectlEnabled", "");
        if ("mastersRole" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterProps#mastersRole", "");
        if ("outputClusterName" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterProps#outputClusterName", "");
        if ("outputConfigCommand" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterProps#outputConfigCommand", "");
        if ("outputMastersRoleArn" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterProps#outputMastersRoleArn", "");
        if ("role" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterProps#role", "");
        if ("securityGroup" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterProps#securityGroup", "");
        if ("version" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterProps#version", "");
        if ("vpc" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterProps#vpc", "");
        if ("vpcSubnets" in p)
            print("@aws-cdk/aws-eks-legacy.ClusterProps#vpcSubnets", "");
        if (!visitedObjects.has(p.vpcSubnets))
            require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_SubnetSelection(p.vpcSubnets);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_legacy_Cluster(p) {
}
function _aws_cdk_aws_eks_legacy_CapacityOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("instanceType" in p)
            print("@aws-cdk/aws-eks-legacy.CapacityOptions#instanceType", "");
        if ("bootstrapEnabled" in p)
            print("@aws-cdk/aws-eks-legacy.CapacityOptions#bootstrapEnabled", "");
        if ("bootstrapOptions" in p)
            print("@aws-cdk/aws-eks-legacy.CapacityOptions#bootstrapOptions", "");
        if (!visitedObjects.has(p.bootstrapOptions))
            _aws_cdk_aws_eks_legacy_BootstrapOptions(p.bootstrapOptions);
        if ("mapRole" in p)
            print("@aws-cdk/aws-eks-legacy.CapacityOptions#mapRole", "");
        if (!visitedObjects.has(p.blockDevices))
            require("@aws-cdk/aws-autoscaling/.warnings.jsii.js")._aws_cdk_aws_autoscaling_BlockDevice(p.blockDevices);
        if (!visitedObjects.has(p.groupMetrics))
            require("@aws-cdk/aws-autoscaling/.warnings.jsii.js")._aws_cdk_aws_autoscaling_GroupMetrics(p.groupMetrics);
        if (!visitedObjects.has(p.notifications))
            require("@aws-cdk/aws-autoscaling/.warnings.jsii.js")._aws_cdk_aws_autoscaling_NotificationConfiguration(p.notifications);
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
        if (!visitedObjects.has(p.terminationPolicies))
            require("@aws-cdk/aws-autoscaling/.warnings.jsii.js")._aws_cdk_aws_autoscaling_TerminationPolicy(p.terminationPolicies);
        if ("updateType" in p)
            print("@aws-cdk/aws-autoscaling.CommonAutoScalingGroupProps#updateType", "Use `updatePolicy` instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_legacy_BootstrapOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("additionalArgs" in p)
            print("@aws-cdk/aws-eks-legacy.BootstrapOptions#additionalArgs", "");
        if ("awsApiRetryAttempts" in p)
            print("@aws-cdk/aws-eks-legacy.BootstrapOptions#awsApiRetryAttempts", "");
        if ("dockerConfigJson" in p)
            print("@aws-cdk/aws-eks-legacy.BootstrapOptions#dockerConfigJson", "");
        if ("enableDockerBridge" in p)
            print("@aws-cdk/aws-eks-legacy.BootstrapOptions#enableDockerBridge", "");
        if ("kubeletExtraArgs" in p)
            print("@aws-cdk/aws-eks-legacy.BootstrapOptions#kubeletExtraArgs", "");
        if ("useMaxPods" in p)
            print("@aws-cdk/aws-eks-legacy.BootstrapOptions#useMaxPods", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_legacy_AutoScalingGroupOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("bootstrapEnabled" in p)
            print("@aws-cdk/aws-eks-legacy.AutoScalingGroupOptions#bootstrapEnabled", "");
        if ("bootstrapOptions" in p)
            print("@aws-cdk/aws-eks-legacy.AutoScalingGroupOptions#bootstrapOptions", "");
        if (!visitedObjects.has(p.bootstrapOptions))
            _aws_cdk_aws_eks_legacy_BootstrapOptions(p.bootstrapOptions);
        if ("mapRole" in p)
            print("@aws-cdk/aws-eks-legacy.AutoScalingGroupOptions#mapRole", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_legacy_EksOptimizedImageProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("kubernetesVersion" in p)
            print("@aws-cdk/aws-eks-legacy.EksOptimizedImageProps#kubernetesVersion", "");
        if ("nodeType" in p)
            print("@aws-cdk/aws-eks-legacy.EksOptimizedImageProps#nodeType", "");
        if (!visitedObjects.has(p.nodeType))
            _aws_cdk_aws_eks_legacy_NodeType(p.nodeType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_legacy_EksOptimizedImage(p) {
}
function _aws_cdk_aws_eks_legacy_NodeType(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/aws-eks-legacy.NodeType", "");
        const ns = require("./lib/cluster.js");
        if (Object.values(ns.NodeType).filter(x => x === p).length > 1)
            return;
        if (p === ns.NodeType.STANDARD)
            print("@aws-cdk/aws-eks-legacy.NodeType#STANDARD", "");
        if (p === ns.NodeType.GPU)
            print("@aws-cdk/aws-eks-legacy.NodeType#GPU", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_legacy_Mapping(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("groups" in p)
            print("@aws-cdk/aws-eks-legacy.Mapping#groups", "");
        if ("username" in p)
            print("@aws-cdk/aws-eks-legacy.Mapping#username", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_legacy_KubernetesResourceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("cluster" in p)
            print("@aws-cdk/aws-eks-legacy.KubernetesResourceProps#cluster", "");
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_legacy_Cluster(p.cluster);
        if ("manifest" in p)
            print("@aws-cdk/aws-eks-legacy.KubernetesResourceProps#manifest", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_legacy_KubernetesResource(p) {
}
function _aws_cdk_aws_eks_legacy_HelmChartOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("chart" in p)
            print("@aws-cdk/aws-eks-legacy.HelmChartOptions#chart", "");
        if ("namespace" in p)
            print("@aws-cdk/aws-eks-legacy.HelmChartOptions#namespace", "");
        if ("release" in p)
            print("@aws-cdk/aws-eks-legacy.HelmChartOptions#release", "");
        if ("repository" in p)
            print("@aws-cdk/aws-eks-legacy.HelmChartOptions#repository", "");
        if ("values" in p)
            print("@aws-cdk/aws-eks-legacy.HelmChartOptions#values", "");
        if ("version" in p)
            print("@aws-cdk/aws-eks-legacy.HelmChartOptions#version", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_legacy_HelmChartProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("cluster" in p)
            print("@aws-cdk/aws-eks-legacy.HelmChartProps#cluster", "");
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_legacy_Cluster(p.cluster);
        if ("chart" in p)
            print("@aws-cdk/aws-eks-legacy.HelmChartOptions#chart", "");
        if ("namespace" in p)
            print("@aws-cdk/aws-eks-legacy.HelmChartOptions#namespace", "");
        if ("release" in p)
            print("@aws-cdk/aws-eks-legacy.HelmChartOptions#release", "");
        if ("repository" in p)
            print("@aws-cdk/aws-eks-legacy.HelmChartOptions#repository", "");
        if ("values" in p)
            print("@aws-cdk/aws-eks-legacy.HelmChartOptions#values", "");
        if ("version" in p)
            print("@aws-cdk/aws-eks-legacy.HelmChartOptions#version", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_legacy_HelmChart(p) {
}
function _aws_cdk_aws_eks_legacy_AwsAuthProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("cluster" in p)
            print("@aws-cdk/aws-eks-legacy.AwsAuthProps#cluster", "");
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_legacy_Cluster(p.cluster);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_legacy_AwsAuth(p) {
}
function _aws_cdk_aws_eks_legacy_CfnAddonProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.tags))
            require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(p.tags);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_legacy_CfnAddon(p) {
}
function _aws_cdk_aws_eks_legacy_CfnClusterProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.resourcesVpcConfig))
            _aws_cdk_aws_eks_legacy_CfnCluster_ResourcesVpcConfigProperty(p.resourcesVpcConfig);
        if (!visitedObjects.has(p.tags))
            require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(p.tags);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_legacy_CfnCluster(p) {
}
function _aws_cdk_aws_eks_legacy_CfnCluster_ClusterLoggingProperty(p) {
}
function _aws_cdk_aws_eks_legacy_CfnCluster_EncryptionConfigProperty(p) {
}
function _aws_cdk_aws_eks_legacy_CfnCluster_KubernetesNetworkConfigProperty(p) {
}
function _aws_cdk_aws_eks_legacy_CfnCluster_LoggingProperty(p) {
}
function _aws_cdk_aws_eks_legacy_CfnCluster_LoggingTypeConfigProperty(p) {
}
function _aws_cdk_aws_eks_legacy_CfnCluster_ProviderProperty(p) {
}
function _aws_cdk_aws_eks_legacy_CfnCluster_ResourcesVpcConfigProperty(p) {
}
function _aws_cdk_aws_eks_legacy_CfnFargateProfileProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.tags))
            require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(p.tags);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_legacy_CfnFargateProfile(p) {
}
function _aws_cdk_aws_eks_legacy_CfnFargateProfile_LabelProperty(p) {
}
function _aws_cdk_aws_eks_legacy_CfnFargateProfile_SelectorProperty(p) {
}
function _aws_cdk_aws_eks_legacy_CfnIdentityProviderConfigProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.tags))
            require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(p.tags);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_legacy_CfnIdentityProviderConfig(p) {
}
function _aws_cdk_aws_eks_legacy_CfnIdentityProviderConfig_OidcIdentityProviderConfigProperty(p) {
}
function _aws_cdk_aws_eks_legacy_CfnIdentityProviderConfig_RequiredClaimProperty(p) {
}
function _aws_cdk_aws_eks_legacy_CfnNodegroupProps(p) {
}
function _aws_cdk_aws_eks_legacy_CfnNodegroup(p) {
}
function _aws_cdk_aws_eks_legacy_CfnNodegroup_LaunchTemplateSpecificationProperty(p) {
}
function _aws_cdk_aws_eks_legacy_CfnNodegroup_RemoteAccessProperty(p) {
}
function _aws_cdk_aws_eks_legacy_CfnNodegroup_ScalingConfigProperty(p) {
}
function _aws_cdk_aws_eks_legacy_CfnNodegroup_TaintProperty(p) {
}
function _aws_cdk_aws_eks_legacy_CfnNodegroup_UpdateConfigProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_eks_legacy_ICluster, _aws_cdk_aws_eks_legacy_ClusterAttributes, _aws_cdk_aws_eks_legacy_ClusterProps, _aws_cdk_aws_eks_legacy_Cluster, _aws_cdk_aws_eks_legacy_CapacityOptions, _aws_cdk_aws_eks_legacy_BootstrapOptions, _aws_cdk_aws_eks_legacy_AutoScalingGroupOptions, _aws_cdk_aws_eks_legacy_EksOptimizedImageProps, _aws_cdk_aws_eks_legacy_EksOptimizedImage, _aws_cdk_aws_eks_legacy_NodeType, _aws_cdk_aws_eks_legacy_Mapping, _aws_cdk_aws_eks_legacy_KubernetesResourceProps, _aws_cdk_aws_eks_legacy_KubernetesResource, _aws_cdk_aws_eks_legacy_HelmChartOptions, _aws_cdk_aws_eks_legacy_HelmChartProps, _aws_cdk_aws_eks_legacy_HelmChart, _aws_cdk_aws_eks_legacy_AwsAuthProps, _aws_cdk_aws_eks_legacy_AwsAuth, _aws_cdk_aws_eks_legacy_CfnAddonProps, _aws_cdk_aws_eks_legacy_CfnAddon, _aws_cdk_aws_eks_legacy_CfnClusterProps, _aws_cdk_aws_eks_legacy_CfnCluster, _aws_cdk_aws_eks_legacy_CfnCluster_ClusterLoggingProperty, _aws_cdk_aws_eks_legacy_CfnCluster_EncryptionConfigProperty, _aws_cdk_aws_eks_legacy_CfnCluster_KubernetesNetworkConfigProperty, _aws_cdk_aws_eks_legacy_CfnCluster_LoggingProperty, _aws_cdk_aws_eks_legacy_CfnCluster_LoggingTypeConfigProperty, _aws_cdk_aws_eks_legacy_CfnCluster_ProviderProperty, _aws_cdk_aws_eks_legacy_CfnCluster_ResourcesVpcConfigProperty, _aws_cdk_aws_eks_legacy_CfnFargateProfileProps, _aws_cdk_aws_eks_legacy_CfnFargateProfile, _aws_cdk_aws_eks_legacy_CfnFargateProfile_LabelProperty, _aws_cdk_aws_eks_legacy_CfnFargateProfile_SelectorProperty, _aws_cdk_aws_eks_legacy_CfnIdentityProviderConfigProps, _aws_cdk_aws_eks_legacy_CfnIdentityProviderConfig, _aws_cdk_aws_eks_legacy_CfnIdentityProviderConfig_OidcIdentityProviderConfigProperty, _aws_cdk_aws_eks_legacy_CfnIdentityProviderConfig_RequiredClaimProperty, _aws_cdk_aws_eks_legacy_CfnNodegroupProps, _aws_cdk_aws_eks_legacy_CfnNodegroup, _aws_cdk_aws_eks_legacy_CfnNodegroup_LaunchTemplateSpecificationProperty, _aws_cdk_aws_eks_legacy_CfnNodegroup_RemoteAccessProperty, _aws_cdk_aws_eks_legacy_CfnNodegroup_ScalingConfigProperty, _aws_cdk_aws_eks_legacy_CfnNodegroup_TaintProperty, _aws_cdk_aws_eks_legacy_CfnNodegroup_UpdateConfigProperty };
