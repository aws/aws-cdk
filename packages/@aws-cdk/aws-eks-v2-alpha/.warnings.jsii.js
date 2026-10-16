function _aws_cdk_aws_eks_v2_alpha_ICluster(p) {
}
function _aws_cdk_aws_eks_v2_alpha_ClusterAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.ipFamily))
            _aws_cdk_aws_eks_v2_alpha_IpFamily(p.ipFamily);
        if (!visitedObjects.has(p.kubectlProvider))
            _aws_cdk_aws_eks_v2_alpha_IKubectlProvider(p.kubectlProvider);
        if (!visitedObjects.has(p.kubectlProviderOptions))
            _aws_cdk_aws_eks_v2_alpha_KubectlProviderOptions(p.kubectlProviderOptions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_ClusterCommonOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.version))
            _aws_cdk_aws_eks_v2_alpha_KubernetesVersion(p.version);
        if (!visitedObjects.has(p.albController))
            _aws_cdk_aws_eks_v2_alpha_AlbControllerOptions(p.albController);
        if (p.clusterLogging != null)
            for (const o of p.clusterLogging)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eks_v2_alpha_ClusterLoggingTypes(o);
        if (!visitedObjects.has(p.coreDnsComputeType))
            _aws_cdk_aws_eks_v2_alpha_CoreDnsComputeType(p.coreDnsComputeType);
        if (!visitedObjects.has(p.endpointAccess))
            _aws_cdk_aws_eks_v2_alpha_EndpointAccess(p.endpointAccess);
        if (!visitedObjects.has(p.ipFamily))
            _aws_cdk_aws_eks_v2_alpha_IpFamily(p.ipFamily);
        if (!visitedObjects.has(p.kubectlProviderOptions))
            _aws_cdk_aws_eks_v2_alpha_KubectlProviderOptions(p.kubectlProviderOptions);
        if (p.vpcSubnets != null)
            for (const o of p.vpcSubnets)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_SubnetSelection(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_EndpointAccess(p) {
}
function _aws_cdk_aws_eks_v2_alpha_ComputeConfig(p) {
}
function _aws_cdk_aws_eks_v2_alpha_ClusterProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.compute))
            _aws_cdk_aws_eks_v2_alpha_ComputeConfig(p.compute);
        if (!visitedObjects.has(p.defaultCapacityType))
            _aws_cdk_aws_eks_v2_alpha_DefaultCapacityType(p.defaultCapacityType);
        if (!visitedObjects.has(p.version))
            _aws_cdk_aws_eks_v2_alpha_KubernetesVersion(p.version);
        if (!visitedObjects.has(p.albController))
            _aws_cdk_aws_eks_v2_alpha_AlbControllerOptions(p.albController);
        if (p.clusterLogging != null)
            for (const o of p.clusterLogging)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eks_v2_alpha_ClusterLoggingTypes(o);
        if (!visitedObjects.has(p.coreDnsComputeType))
            _aws_cdk_aws_eks_v2_alpha_CoreDnsComputeType(p.coreDnsComputeType);
        if (!visitedObjects.has(p.endpointAccess))
            _aws_cdk_aws_eks_v2_alpha_EndpointAccess(p.endpointAccess);
        if (!visitedObjects.has(p.ipFamily))
            _aws_cdk_aws_eks_v2_alpha_IpFamily(p.ipFamily);
        if (!visitedObjects.has(p.kubectlProviderOptions))
            _aws_cdk_aws_eks_v2_alpha_KubectlProviderOptions(p.kubectlProviderOptions);
        if (p.vpcSubnets != null)
            for (const o of p.vpcSubnets)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_SubnetSelection(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_KubernetesVersion(p) {
}
function _aws_cdk_aws_eks_v2_alpha_ClusterLoggingTypes(p) {
}
function _aws_cdk_aws_eks_v2_alpha_IpFamily(p) {
}
function _aws_cdk_aws_eks_v2_alpha_ServiceLoadBalancerAddressOptions(p) {
}
function _aws_cdk_aws_eks_v2_alpha_IngressLoadBalancerAddressOptions(p) {
}
function _aws_cdk_aws_eks_v2_alpha_Cluster(p) {
}
function _aws_cdk_aws_eks_v2_alpha_AutoScalingGroupCapacityOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.bootstrapOptions))
            _aws_cdk_aws_eks_v2_alpha_BootstrapOptions(p.bootstrapOptions);
        if (!visitedObjects.has(p.machineImageType))
            _aws_cdk_aws_eks_v2_alpha_MachineImageType(p.machineImageType);
        if (p.blockDevices != null)
            for (const o of p.blockDevices)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_autoscaling_BlockDevice(o);
        if (p.groupMetrics != null)
            for (const o of p.groupMetrics)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_autoscaling_GroupMetrics(o);
        if ("healthCheck" in p)
            print("aws-cdk-lib.aws_autoscaling.CommonAutoScalingGroupProps#healthCheck", "Use `healthChecks` instead");
        if ("keyName" in p)
            print("aws-cdk-lib.aws_autoscaling.CommonAutoScalingGroupProps#keyName", "- Use `keyPair` instead - https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2-readme.html#using-an-existing-ec2-key-pair");
        if (p.notifications != null)
            for (const o of p.notifications)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_autoscaling_NotificationConfiguration(o);
        if (p.terminationPolicies != null)
            for (const o of p.terminationPolicies)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_autoscaling_TerminationPolicy(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_BootstrapOptions(p) {
}
function _aws_cdk_aws_eks_v2_alpha_AutoScalingGroupOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.bootstrapOptions))
            _aws_cdk_aws_eks_v2_alpha_BootstrapOptions(p.bootstrapOptions);
        if (!visitedObjects.has(p.machineImageType))
            _aws_cdk_aws_eks_v2_alpha_MachineImageType(p.machineImageType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_EksOptimizedImageProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cpuArch))
            _aws_cdk_aws_eks_v2_alpha_CpuArch(p.cpuArch);
        if (!visitedObjects.has(p.nodeType))
            _aws_cdk_aws_eks_v2_alpha_NodeType(p.nodeType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_EksOptimizedImage(p) {
}
function _aws_cdk_aws_eks_v2_alpha_NodeType(p) {
}
function _aws_cdk_aws_eks_v2_alpha_CpuArch(p) {
}
function _aws_cdk_aws_eks_v2_alpha_CoreDnsComputeType(p) {
}
function _aws_cdk_aws_eks_v2_alpha_DefaultCapacityType(p) {
}
function _aws_cdk_aws_eks_v2_alpha_MachineImageType(p) {
}
function _aws_cdk_aws_eks_v2_alpha_FargateProfileOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.selectors != null)
            for (const o of p.selectors)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eks_v2_alpha_Selector(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_FargateProfileProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_v2_alpha_Cluster(p.cluster);
        if (p.selectors != null)
            for (const o of p.selectors)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eks_v2_alpha_Selector(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_Selector(p) {
}
function _aws_cdk_aws_eks_v2_alpha_FargateProfile(p) {
}
function _aws_cdk_aws_eks_v2_alpha_HelmChartOptions(p) {
}
function _aws_cdk_aws_eks_v2_alpha_HelmChartProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_v2_alpha_ICluster(p.cluster);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_HelmChart(p) {
}
function _aws_cdk_aws_eks_v2_alpha_KubernetesPatchProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_v2_alpha_ICluster(p.cluster);
        if (!visitedObjects.has(p.patchType))
            _aws_cdk_aws_eks_v2_alpha_PatchType(p.patchType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_PatchType(p) {
}
function _aws_cdk_aws_eks_v2_alpha_KubernetesPatch(p) {
}
function _aws_cdk_aws_eks_v2_alpha_KubernetesManifestOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.ingressAlbScheme))
            _aws_cdk_aws_eks_v2_alpha_AlbScheme(p.ingressAlbScheme);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_KubernetesManifestProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_v2_alpha_ICluster(p.cluster);
        if (!visitedObjects.has(p.ingressAlbScheme))
            _aws_cdk_aws_eks_v2_alpha_AlbScheme(p.ingressAlbScheme);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_KubernetesManifest(p) {
}
function _aws_cdk_aws_eks_v2_alpha_KubernetesObjectValueProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_v2_alpha_ICluster(p.cluster);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_KubernetesObjectValue(p) {
}
function _aws_cdk_aws_eks_v2_alpha_KubectlProviderOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.privateSubnets != null)
            for (const o of p.privateSubnets)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_ISubnet(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_KubectlProviderProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_v2_alpha_ICluster(p.cluster);
        if (p.privateSubnets != null)
            for (const o of p.privateSubnets)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_ISubnet(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_KubectlProviderAttributes(p) {
}
function _aws_cdk_aws_eks_v2_alpha_IKubectlProvider(p) {
}
function _aws_cdk_aws_eks_v2_alpha_KubectlProvider(p) {
}
function _aws_cdk_aws_eks_v2_alpha_FargateClusterProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.defaultProfile))
            _aws_cdk_aws_eks_v2_alpha_FargateProfileOptions(p.defaultProfile);
        if (!visitedObjects.has(p.version))
            _aws_cdk_aws_eks_v2_alpha_KubernetesVersion(p.version);
        if (!visitedObjects.has(p.albController))
            _aws_cdk_aws_eks_v2_alpha_AlbControllerOptions(p.albController);
        if (p.clusterLogging != null)
            for (const o of p.clusterLogging)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eks_v2_alpha_ClusterLoggingTypes(o);
        if (!visitedObjects.has(p.coreDnsComputeType))
            _aws_cdk_aws_eks_v2_alpha_CoreDnsComputeType(p.coreDnsComputeType);
        if (!visitedObjects.has(p.endpointAccess))
            _aws_cdk_aws_eks_v2_alpha_EndpointAccess(p.endpointAccess);
        if (!visitedObjects.has(p.ipFamily))
            _aws_cdk_aws_eks_v2_alpha_IpFamily(p.ipFamily);
        if (!visitedObjects.has(p.kubectlProviderOptions))
            _aws_cdk_aws_eks_v2_alpha_KubectlProviderOptions(p.kubectlProviderOptions);
        if (p.vpcSubnets != null)
            for (const o of p.vpcSubnets)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_SubnetSelection(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_FargateCluster(p) {
}
function _aws_cdk_aws_eks_v2_alpha_IdentityType(p) {
}
function _aws_cdk_aws_eks_v2_alpha_ServiceAccountOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.identityType))
            _aws_cdk_aws_eks_v2_alpha_IdentityType(p.identityType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_ServiceAccountProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_v2_alpha_ICluster(p.cluster);
        if (!visitedObjects.has(p.identityType))
            _aws_cdk_aws_eks_v2_alpha_IdentityType(p.identityType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_ServiceAccount(p) {
}
function _aws_cdk_aws_eks_v2_alpha_INodegroup(p) {
}
function _aws_cdk_aws_eks_v2_alpha_NodegroupAmiType(p) {
}
function _aws_cdk_aws_eks_v2_alpha_CapacityType(p) {
}
function _aws_cdk_aws_eks_v2_alpha_NodegroupRemoteAccess(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.sourceSecurityGroups != null)
            for (const o of p.sourceSecurityGroups)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_LaunchTemplateSpec(p) {
}
function _aws_cdk_aws_eks_v2_alpha_TaintEffect(p) {
}
function _aws_cdk_aws_eks_v2_alpha_TaintSpec(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.effect))
            _aws_cdk_aws_eks_v2_alpha_TaintEffect(p.effect);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_NodegroupOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.amiType))
            _aws_cdk_aws_eks_v2_alpha_NodegroupAmiType(p.amiType);
        if (!visitedObjects.has(p.capacityType))
            _aws_cdk_aws_eks_v2_alpha_CapacityType(p.capacityType);
        if ("instanceType" in p)
            print("@aws-cdk/aws-eks-v2-alpha.NodegroupOptions#instanceType", "Use `instanceTypes` instead.");
        if (p.instanceTypes != null)
            for (const o of p.instanceTypes)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_InstanceType(o);
        if (!visitedObjects.has(p.launchTemplateSpec))
            _aws_cdk_aws_eks_v2_alpha_LaunchTemplateSpec(p.launchTemplateSpec);
        if (!visitedObjects.has(p.remoteAccess))
            _aws_cdk_aws_eks_v2_alpha_NodegroupRemoteAccess(p.remoteAccess);
        if (p.taints != null)
            for (const o of p.taints)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eks_v2_alpha_TaintSpec(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_NodegroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_v2_alpha_ICluster(p.cluster);
        if (!visitedObjects.has(p.amiType))
            _aws_cdk_aws_eks_v2_alpha_NodegroupAmiType(p.amiType);
        if (!visitedObjects.has(p.capacityType))
            _aws_cdk_aws_eks_v2_alpha_CapacityType(p.capacityType);
        if ("instanceType" in p)
            print("@aws-cdk/aws-eks-v2-alpha.NodegroupOptions#instanceType", "Use `instanceTypes` instead.");
        if (p.instanceTypes != null)
            for (const o of p.instanceTypes)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_InstanceType(o);
        if (!visitedObjects.has(p.launchTemplateSpec))
            _aws_cdk_aws_eks_v2_alpha_LaunchTemplateSpec(p.launchTemplateSpec);
        if (!visitedObjects.has(p.remoteAccess))
            _aws_cdk_aws_eks_v2_alpha_NodegroupRemoteAccess(p.remoteAccess);
        if (p.taints != null)
            for (const o of p.taints)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eks_v2_alpha_TaintSpec(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_Nodegroup(p) {
}
function _aws_cdk_aws_eks_v2_alpha_OpenIdConnectProviderProps(p) {
}
function _aws_cdk_aws_eks_v2_alpha_OpenIdConnectProvider(p) {
}
function _aws_cdk_aws_eks_v2_alpha_AlbControllerVersion(p) {
}
function _aws_cdk_aws_eks_v2_alpha_AlbScheme(p) {
}
function _aws_cdk_aws_eks_v2_alpha_AlbControllerOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.version))
            _aws_cdk_aws_eks_v2_alpha_AlbControllerVersion(p.version);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_AlbControllerProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_v2_alpha_Cluster(p.cluster);
        if (!visitedObjects.has(p.version))
            _aws_cdk_aws_eks_v2_alpha_AlbControllerVersion(p.version);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_AlbController(p) {
}
function _aws_cdk_aws_eks_v2_alpha_IAccessEntry(p) {
}
function _aws_cdk_aws_eks_v2_alpha_AccessEntryAttributes(p) {
}
function _aws_cdk_aws_eks_v2_alpha_AccessScopeType(p) {
}
function _aws_cdk_aws_eks_v2_alpha_AccessScope(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_eks_v2_alpha_AccessScopeType(p.type);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_AccessPolicyArn(p) {
}
function _aws_cdk_aws_eks_v2_alpha_IAccessPolicy(p) {
}
function _aws_cdk_aws_eks_v2_alpha_AccessPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.accessScope))
            _aws_cdk_aws_eks_v2_alpha_AccessScope(p.accessScope);
        if (!visitedObjects.has(p.policy))
            _aws_cdk_aws_eks_v2_alpha_AccessPolicyArn(p.policy);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_AccessPolicyNameOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.accessScopeType))
            _aws_cdk_aws_eks_v2_alpha_AccessScopeType(p.accessScopeType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_AccessPolicy(p) {
}
function _aws_cdk_aws_eks_v2_alpha_AccessEntryType(p) {
}
function _aws_cdk_aws_eks_v2_alpha_AccessEntryProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.accessPolicies != null)
            for (const o of p.accessPolicies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_eks_v2_alpha_IAccessPolicy(o);
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_v2_alpha_ICluster(p.cluster);
        if (!visitedObjects.has(p.accessEntryType))
            _aws_cdk_aws_eks_v2_alpha_AccessEntryType(p.accessEntryType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_AccessEntry(p) {
}
function _aws_cdk_aws_eks_v2_alpha_IAddon(p) {
}
function _aws_cdk_aws_eks_v2_alpha_AddonProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_eks_v2_alpha_ICluster(p.cluster);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_eks_v2_alpha_AddonAttributes(p) {
}
function _aws_cdk_aws_eks_v2_alpha_Addon(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_eks_v2_alpha_ICluster, _aws_cdk_aws_eks_v2_alpha_ClusterAttributes, _aws_cdk_aws_eks_v2_alpha_ClusterCommonOptions, _aws_cdk_aws_eks_v2_alpha_EndpointAccess, _aws_cdk_aws_eks_v2_alpha_ComputeConfig, _aws_cdk_aws_eks_v2_alpha_ClusterProps, _aws_cdk_aws_eks_v2_alpha_KubernetesVersion, _aws_cdk_aws_eks_v2_alpha_ClusterLoggingTypes, _aws_cdk_aws_eks_v2_alpha_IpFamily, _aws_cdk_aws_eks_v2_alpha_ServiceLoadBalancerAddressOptions, _aws_cdk_aws_eks_v2_alpha_IngressLoadBalancerAddressOptions, _aws_cdk_aws_eks_v2_alpha_Cluster, _aws_cdk_aws_eks_v2_alpha_AutoScalingGroupCapacityOptions, _aws_cdk_aws_eks_v2_alpha_BootstrapOptions, _aws_cdk_aws_eks_v2_alpha_AutoScalingGroupOptions, _aws_cdk_aws_eks_v2_alpha_EksOptimizedImageProps, _aws_cdk_aws_eks_v2_alpha_EksOptimizedImage, _aws_cdk_aws_eks_v2_alpha_NodeType, _aws_cdk_aws_eks_v2_alpha_CpuArch, _aws_cdk_aws_eks_v2_alpha_CoreDnsComputeType, _aws_cdk_aws_eks_v2_alpha_DefaultCapacityType, _aws_cdk_aws_eks_v2_alpha_MachineImageType, _aws_cdk_aws_eks_v2_alpha_FargateProfileOptions, _aws_cdk_aws_eks_v2_alpha_FargateProfileProps, _aws_cdk_aws_eks_v2_alpha_Selector, _aws_cdk_aws_eks_v2_alpha_FargateProfile, _aws_cdk_aws_eks_v2_alpha_HelmChartOptions, _aws_cdk_aws_eks_v2_alpha_HelmChartProps, _aws_cdk_aws_eks_v2_alpha_HelmChart, _aws_cdk_aws_eks_v2_alpha_KubernetesPatchProps, _aws_cdk_aws_eks_v2_alpha_PatchType, _aws_cdk_aws_eks_v2_alpha_KubernetesPatch, _aws_cdk_aws_eks_v2_alpha_KubernetesManifestOptions, _aws_cdk_aws_eks_v2_alpha_KubernetesManifestProps, _aws_cdk_aws_eks_v2_alpha_KubernetesManifest, _aws_cdk_aws_eks_v2_alpha_KubernetesObjectValueProps, _aws_cdk_aws_eks_v2_alpha_KubernetesObjectValue, _aws_cdk_aws_eks_v2_alpha_KubectlProviderOptions, _aws_cdk_aws_eks_v2_alpha_KubectlProviderProps, _aws_cdk_aws_eks_v2_alpha_KubectlProviderAttributes, _aws_cdk_aws_eks_v2_alpha_IKubectlProvider, _aws_cdk_aws_eks_v2_alpha_KubectlProvider, _aws_cdk_aws_eks_v2_alpha_FargateClusterProps, _aws_cdk_aws_eks_v2_alpha_FargateCluster, _aws_cdk_aws_eks_v2_alpha_IdentityType, _aws_cdk_aws_eks_v2_alpha_ServiceAccountOptions, _aws_cdk_aws_eks_v2_alpha_ServiceAccountProps, _aws_cdk_aws_eks_v2_alpha_ServiceAccount, _aws_cdk_aws_eks_v2_alpha_INodegroup, _aws_cdk_aws_eks_v2_alpha_NodegroupAmiType, _aws_cdk_aws_eks_v2_alpha_CapacityType, _aws_cdk_aws_eks_v2_alpha_NodegroupRemoteAccess, _aws_cdk_aws_eks_v2_alpha_LaunchTemplateSpec, _aws_cdk_aws_eks_v2_alpha_TaintEffect, _aws_cdk_aws_eks_v2_alpha_TaintSpec, _aws_cdk_aws_eks_v2_alpha_NodegroupOptions, _aws_cdk_aws_eks_v2_alpha_NodegroupProps, _aws_cdk_aws_eks_v2_alpha_Nodegroup, _aws_cdk_aws_eks_v2_alpha_OpenIdConnectProviderProps, _aws_cdk_aws_eks_v2_alpha_OpenIdConnectProvider, _aws_cdk_aws_eks_v2_alpha_AlbControllerVersion, _aws_cdk_aws_eks_v2_alpha_AlbScheme, _aws_cdk_aws_eks_v2_alpha_AlbControllerOptions, _aws_cdk_aws_eks_v2_alpha_AlbControllerProps, _aws_cdk_aws_eks_v2_alpha_AlbController, _aws_cdk_aws_eks_v2_alpha_IAccessEntry, _aws_cdk_aws_eks_v2_alpha_AccessEntryAttributes, _aws_cdk_aws_eks_v2_alpha_AccessScopeType, _aws_cdk_aws_eks_v2_alpha_AccessScope, _aws_cdk_aws_eks_v2_alpha_AccessPolicyArn, _aws_cdk_aws_eks_v2_alpha_IAccessPolicy, _aws_cdk_aws_eks_v2_alpha_AccessPolicyProps, _aws_cdk_aws_eks_v2_alpha_AccessPolicyNameOptions, _aws_cdk_aws_eks_v2_alpha_AccessPolicy, _aws_cdk_aws_eks_v2_alpha_AccessEntryType, _aws_cdk_aws_eks_v2_alpha_AccessEntryProps, _aws_cdk_aws_eks_v2_alpha_AccessEntry, _aws_cdk_aws_eks_v2_alpha_IAddon, _aws_cdk_aws_eks_v2_alpha_AddonProps, _aws_cdk_aws_eks_v2_alpha_AddonAttributes, _aws_cdk_aws_eks_v2_alpha_Addon };
