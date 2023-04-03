function _aws_cdk_aws_ecs_IService(p) {
}
function _aws_cdk_aws_ecs_DeploymentController(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_ecs_DeploymentControllerType(p.type);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_DeploymentCircuitBreaker(p) {
}
function _aws_cdk_aws_ecs_EcsTarget(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.listener))
            _aws_cdk_aws_ecs_ListenerConfig(p.listener);
        if (!visitedObjects.has(p.protocol))
            _aws_cdk_aws_ecs_Protocol(p.protocol);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_IEcsLoadBalancerTarget(p) {
}
function _aws_cdk_aws_ecs_ServiceConnectProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.logDriver))
            _aws_cdk_aws_ecs_LogDriver(p.logDriver);
        if (p.services != null)
            for (const o of p.services)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_ServiceConnectService(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_ServiceConnectService(p) {
}
function _aws_cdk_aws_ecs_BaseServiceOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_ecs_ICluster(p.cluster);
        if (p.capacityProviderStrategies != null)
            for (const o of p.capacityProviderStrategies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_CapacityProviderStrategy(o);
        if (!visitedObjects.has(p.circuitBreaker))
            _aws_cdk_aws_ecs_DeploymentCircuitBreaker(p.circuitBreaker);
        if (!visitedObjects.has(p.cloudMapOptions))
            _aws_cdk_aws_ecs_CloudMapOptions(p.cloudMapOptions);
        if (!visitedObjects.has(p.deploymentController))
            _aws_cdk_aws_ecs_DeploymentController(p.deploymentController);
        if (!visitedObjects.has(p.propagateTags))
            _aws_cdk_aws_ecs_PropagatedTagSource(p.propagateTags);
        if ("propagateTaskTagsFrom" in p)
            print("@aws-cdk/aws-ecs.BaseServiceOptions#propagateTaskTagsFrom", "Use `propagateTags` instead.");
        if (!visitedObjects.has(p.propagateTaskTagsFrom))
            _aws_cdk_aws_ecs_PropagatedTagSource(p.propagateTaskTagsFrom);
        if (!visitedObjects.has(p.serviceConnectConfiguration))
            _aws_cdk_aws_ecs_ServiceConnectProps(p.serviceConnectConfiguration);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_BaseServiceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.launchType))
            _aws_cdk_aws_ecs_LaunchType(p.launchType);
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_ecs_ICluster(p.cluster);
        if (p.capacityProviderStrategies != null)
            for (const o of p.capacityProviderStrategies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_CapacityProviderStrategy(o);
        if (!visitedObjects.has(p.circuitBreaker))
            _aws_cdk_aws_ecs_DeploymentCircuitBreaker(p.circuitBreaker);
        if (!visitedObjects.has(p.cloudMapOptions))
            _aws_cdk_aws_ecs_CloudMapOptions(p.cloudMapOptions);
        if (!visitedObjects.has(p.deploymentController))
            _aws_cdk_aws_ecs_DeploymentController(p.deploymentController);
        if (!visitedObjects.has(p.propagateTags))
            _aws_cdk_aws_ecs_PropagatedTagSource(p.propagateTags);
        if ("propagateTaskTagsFrom" in p)
            print("@aws-cdk/aws-ecs.BaseServiceOptions#propagateTaskTagsFrom", "Use `propagateTags` instead.");
        if (!visitedObjects.has(p.propagateTaskTagsFrom))
            _aws_cdk_aws_ecs_PropagatedTagSource(p.propagateTaskTagsFrom);
        if (!visitedObjects.has(p.serviceConnectConfiguration))
            _aws_cdk_aws_ecs_ServiceConnectProps(p.serviceConnectConfiguration);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_ListenerConfig(p) {
}
function _aws_cdk_aws_ecs_IBaseService(p) {
}
function _aws_cdk_aws_ecs_BaseService(p) {
}
function _aws_cdk_aws_ecs_CloudMapOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.container))
            _aws_cdk_aws_ecs_ContainerDefinition(p.container);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_AssociateCloudMapServiceOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.container))
            _aws_cdk_aws_ecs_ContainerDefinition(p.container);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_LaunchType(p) {
}
function _aws_cdk_aws_ecs_DeploymentControllerType(p) {
}
function _aws_cdk_aws_ecs_PropagatedTagSource(p) {
}
function _aws_cdk_aws_ecs_ScalableTaskCountProps(p) {
}
function _aws_cdk_aws_ecs_ScalableTaskCount(p) {
}
function _aws_cdk_aws_ecs_CpuUtilizationScalingProps(p) {
}
function _aws_cdk_aws_ecs_MemoryUtilizationScalingProps(p) {
}
function _aws_cdk_aws_ecs_RequestCountScalingProps(p) {
}
function _aws_cdk_aws_ecs_TrackCustomMetricProps(p) {
}
function _aws_cdk_aws_ecs_ITaskDefinition(p) {
}
function _aws_cdk_aws_ecs_CommonTaskDefinitionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.proxyConfiguration))
            _aws_cdk_aws_ecs_ProxyConfiguration(p.proxyConfiguration);
        if (p.volumes != null)
            for (const o of p.volumes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_Volume(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_TaskDefinitionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.compatibility))
            _aws_cdk_aws_ecs_Compatibility(p.compatibility);
        if (p.inferenceAccelerators != null)
            for (const o of p.inferenceAccelerators)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_InferenceAccelerator(o);
        if (!visitedObjects.has(p.ipcMode))
            _aws_cdk_aws_ecs_IpcMode(p.ipcMode);
        if (!visitedObjects.has(p.networkMode))
            _aws_cdk_aws_ecs_NetworkMode(p.networkMode);
        if (!visitedObjects.has(p.pidMode))
            _aws_cdk_aws_ecs_PidMode(p.pidMode);
        if (p.placementConstraints != null)
            for (const o of p.placementConstraints)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_PlacementConstraint(o);
        if (!visitedObjects.has(p.runtimePlatform))
            _aws_cdk_aws_ecs_RuntimePlatform(p.runtimePlatform);
        if (!visitedObjects.has(p.proxyConfiguration))
            _aws_cdk_aws_ecs_ProxyConfiguration(p.proxyConfiguration);
        if (p.volumes != null)
            for (const o of p.volumes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_Volume(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_CommonTaskDefinitionAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.networkMode))
            _aws_cdk_aws_ecs_NetworkMode(p.networkMode);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_TaskDefinitionAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.compatibility))
            _aws_cdk_aws_ecs_Compatibility(p.compatibility);
        if (!visitedObjects.has(p.networkMode))
            _aws_cdk_aws_ecs_NetworkMode(p.networkMode);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_TaskDefinition(p) {
}
function _aws_cdk_aws_ecs_NetworkMode(p) {
}
function _aws_cdk_aws_ecs_IpcMode(p) {
}
function _aws_cdk_aws_ecs_PidMode(p) {
}
function _aws_cdk_aws_ecs_InferenceAccelerator(p) {
}
function _aws_cdk_aws_ecs_Volume(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.dockerVolumeConfiguration))
            _aws_cdk_aws_ecs_DockerVolumeConfiguration(p.dockerVolumeConfiguration);
        if (!visitedObjects.has(p.efsVolumeConfiguration))
            _aws_cdk_aws_ecs_EfsVolumeConfiguration(p.efsVolumeConfiguration);
        if (!visitedObjects.has(p.host))
            _aws_cdk_aws_ecs_Host(p.host);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_Host(p) {
}
function _aws_cdk_aws_ecs_LoadBalancerTargetOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.protocol))
            _aws_cdk_aws_ecs_Protocol(p.protocol);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_DockerVolumeConfiguration(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.scope))
            _aws_cdk_aws_ecs_Scope(p.scope);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_AuthorizationConfig(p) {
}
function _aws_cdk_aws_ecs_EfsVolumeConfiguration(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.authorizationConfig))
            _aws_cdk_aws_ecs_AuthorizationConfig(p.authorizationConfig);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_Scope(p) {
}
function _aws_cdk_aws_ecs_Compatibility(p) {
}
function _aws_cdk_aws_ecs_ITaskDefinitionExtension(p) {
}
function _aws_cdk_aws_ecs_SecretVersionInfo(p) {
}
function _aws_cdk_aws_ecs_Secret(p) {
}
function _aws_cdk_aws_ecs_ContainerDefinitionOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.image))
            _aws_cdk_aws_ecs_ContainerImage(p.image);
        if (p.environmentFiles != null)
            for (const o of p.environmentFiles)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_EnvironmentFile(o);
        if (!visitedObjects.has(p.healthCheck))
            _aws_cdk_aws_ecs_HealthCheck(p.healthCheck);
        if (!visitedObjects.has(p.linuxParameters))
            _aws_cdk_aws_ecs_LinuxParameters(p.linuxParameters);
        if (!visitedObjects.has(p.logging))
            _aws_cdk_aws_ecs_LogDriver(p.logging);
        if (p.portMappings != null)
            for (const o of p.portMappings)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_PortMapping(o);
        if (p.secrets != null)
            for (const o of Object.values(p.secrets))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_Secret(o);
        if (p.systemControls != null)
            for (const o of p.systemControls)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_SystemControl(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_ContainerDefinitionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.taskDefinition))
            _aws_cdk_aws_ecs_TaskDefinition(p.taskDefinition);
        if (!visitedObjects.has(p.image))
            _aws_cdk_aws_ecs_ContainerImage(p.image);
        if (p.environmentFiles != null)
            for (const o of p.environmentFiles)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_EnvironmentFile(o);
        if (!visitedObjects.has(p.healthCheck))
            _aws_cdk_aws_ecs_HealthCheck(p.healthCheck);
        if (!visitedObjects.has(p.linuxParameters))
            _aws_cdk_aws_ecs_LinuxParameters(p.linuxParameters);
        if (!visitedObjects.has(p.logging))
            _aws_cdk_aws_ecs_LogDriver(p.logging);
        if (p.portMappings != null)
            for (const o of p.portMappings)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_PortMapping(o);
        if (p.secrets != null)
            for (const o of Object.values(p.secrets))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_Secret(o);
        if (p.systemControls != null)
            for (const o of p.systemControls)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_SystemControl(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_ContainerDefinition(p) {
}
function _aws_cdk_aws_ecs_HealthCheck(p) {
}
function _aws_cdk_aws_ecs_Ulimit(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.name))
            _aws_cdk_aws_ecs_UlimitName(p.name);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_UlimitName(p) {
}
function _aws_cdk_aws_ecs_ContainerDependency(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.container))
            _aws_cdk_aws_ecs_ContainerDefinition(p.container);
        if (!visitedObjects.has(p.condition))
            _aws_cdk_aws_ecs_ContainerDependencyCondition(p.condition);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_ContainerDependencyCondition(p) {
}
function _aws_cdk_aws_ecs_PortMapping(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.appProtocol))
            _aws_cdk_aws_ecs_AppProtocol(p.appProtocol);
        if (!visitedObjects.has(p.protocol))
            _aws_cdk_aws_ecs_Protocol(p.protocol);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_PortMap(p) {
}
function _aws_cdk_aws_ecs_ServiceConnect(p) {
}
function _aws_cdk_aws_ecs_Protocol(p) {
}
function _aws_cdk_aws_ecs_AppProtocol(p) {
}
function _aws_cdk_aws_ecs_ScratchSpace(p) {
}
function _aws_cdk_aws_ecs_MountPoint(p) {
}
function _aws_cdk_aws_ecs_VolumeFrom(p) {
}
function _aws_cdk_aws_ecs_SystemControl(p) {
}
function _aws_cdk_aws_ecs_ContainerImage(p) {
}
function _aws_cdk_aws_ecs_ContainerImageConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.repositoryCredentials))
            _aws_cdk_aws_ecs_CfnTaskDefinition_RepositoryCredentialsProperty(p.repositoryCredentials);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_AmiHardwareType(p) {
}
function _aws_cdk_aws_ecs_WindowsOptimizedVersion(p) {
}
function _aws_cdk_aws_ecs_EcsOptimizedAmiProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("cachedInContext" in p)
            print("@aws-cdk/aws-ecs.EcsOptimizedAmiProps#cachedInContext", "see `EcsOptimizedImage`");
        if ("generation" in p)
            print("@aws-cdk/aws-ecs.EcsOptimizedAmiProps#generation", "see `EcsOptimizedImage`");
        if ("hardwareType" in p)
            print("@aws-cdk/aws-ecs.EcsOptimizedAmiProps#hardwareType", "see `EcsOptimizedImage`");
        if (!visitedObjects.has(p.hardwareType))
            _aws_cdk_aws_ecs_AmiHardwareType(p.hardwareType);
        if ("windowsVersion" in p)
            print("@aws-cdk/aws-ecs.EcsOptimizedAmiProps#windowsVersion", "see `EcsOptimizedImage`");
        if (!visitedObjects.has(p.windowsVersion))
            _aws_cdk_aws_ecs_WindowsOptimizedVersion(p.windowsVersion);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_EcsOptimizedAmi(p) {
}
function _aws_cdk_aws_ecs_EcsOptimizedImageOptions(p) {
}
function _aws_cdk_aws_ecs_EcsOptimizedImage(p) {
}
function _aws_cdk_aws_ecs_BottlerocketEcsVariant(p) {
}
function _aws_cdk_aws_ecs_BottleRocketImageProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.variant))
            _aws_cdk_aws_ecs_BottlerocketEcsVariant(p.variant);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_BottleRocketImage(p) {
}
function _aws_cdk_aws_ecs_ClusterProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.capacity))
            _aws_cdk_aws_ecs_AddCapacityOptions(p.capacity);
        if ("capacityProviders" in p)
            print("@aws-cdk/aws-ecs.ClusterProps#capacityProviders", "Use `ClusterProps.enableFargateCapacityProviders` instead.");
        if (!visitedObjects.has(p.defaultCloudMapNamespace))
            _aws_cdk_aws_ecs_CloudMapNamespaceOptions(p.defaultCloudMapNamespace);
        if (!visitedObjects.has(p.executeCommandConfiguration))
            _aws_cdk_aws_ecs_ExecuteCommandConfiguration(p.executeCommandConfiguration);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_MachineImageType(p) {
}
function _aws_cdk_aws_ecs_Cluster(p) {
}
function _aws_cdk_aws_ecs_ICluster(p) {
}
function _aws_cdk_aws_ecs_ClusterAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
        if (!visitedObjects.has(p.executeCommandConfiguration))
            _aws_cdk_aws_ecs_ExecuteCommandConfiguration(p.executeCommandConfiguration);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_AddAutoScalingGroupCapacityOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.machineImageType))
            _aws_cdk_aws_ecs_MachineImageType(p.machineImageType);
        if ("taskDrainTime" in p)
            print("@aws-cdk/aws-ecs.AddAutoScalingGroupCapacityOptions#taskDrainTime", "The lifecycle draining hook is not configured if using the EC2 Capacity Provider. Enable managed termination protection instead.");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_AddCapacityOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.machineImageType))
            _aws_cdk_aws_ecs_MachineImageType(p.machineImageType);
        if ("taskDrainTime" in p)
            print("@aws-cdk/aws-ecs.AddAutoScalingGroupCapacityOptions#taskDrainTime", "The lifecycle draining hook is not configured if using the EC2 Capacity Provider. Enable managed termination protection instead.");
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
function _aws_cdk_aws_ecs_CloudMapNamespaceOptions(p) {
}
function _aws_cdk_aws_ecs_CapacityProviderStrategy(p) {
}
function _aws_cdk_aws_ecs_ExecuteCommandConfiguration(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.logConfiguration))
            _aws_cdk_aws_ecs_ExecuteCommandLogConfiguration(p.logConfiguration);
        if (!visitedObjects.has(p.logging))
            _aws_cdk_aws_ecs_ExecuteCommandLogging(p.logging);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_ExecuteCommandLogging(p) {
}
function _aws_cdk_aws_ecs_ExecuteCommandLogConfiguration(p) {
}
function _aws_cdk_aws_ecs_AsgCapacityProviderProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.machineImageType))
            _aws_cdk_aws_ecs_MachineImageType(p.machineImageType);
        if ("taskDrainTime" in p)
            print("@aws-cdk/aws-ecs.AddAutoScalingGroupCapacityOptions#taskDrainTime", "The lifecycle draining hook is not configured if using the EC2 Capacity Provider. Enable managed termination protection instead.");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_AsgCapacityProvider(p) {
}
function _aws_cdk_aws_ecs_EnvironmentFile(p) {
}
function _aws_cdk_aws_ecs_AssetEnvironmentFile(p) {
}
function _aws_cdk_aws_ecs_S3EnvironmentFile(p) {
}
function _aws_cdk_aws_ecs_EnvironmentFileConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.fileType))
            _aws_cdk_aws_ecs_EnvironmentFileType(p.fileType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_EnvironmentFileType(p) {
}
function _aws_cdk_aws_ecs_FirelensLogRouterType(p) {
}
function _aws_cdk_aws_ecs_FirelensConfigFileType(p) {
}
function _aws_cdk_aws_ecs_FirelensOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.configFileType))
            _aws_cdk_aws_ecs_FirelensConfigFileType(p.configFileType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_FirelensConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_ecs_FirelensLogRouterType(p.type);
        if (!visitedObjects.has(p.options))
            _aws_cdk_aws_ecs_FirelensOptions(p.options);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_FirelensLogRouterProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.firelensConfig))
            _aws_cdk_aws_ecs_FirelensConfig(p.firelensConfig);
        if (!visitedObjects.has(p.taskDefinition))
            _aws_cdk_aws_ecs_TaskDefinition(p.taskDefinition);
        if (!visitedObjects.has(p.image))
            _aws_cdk_aws_ecs_ContainerImage(p.image);
        if (p.environmentFiles != null)
            for (const o of p.environmentFiles)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_EnvironmentFile(o);
        if (!visitedObjects.has(p.healthCheck))
            _aws_cdk_aws_ecs_HealthCheck(p.healthCheck);
        if (!visitedObjects.has(p.linuxParameters))
            _aws_cdk_aws_ecs_LinuxParameters(p.linuxParameters);
        if (!visitedObjects.has(p.logging))
            _aws_cdk_aws_ecs_LogDriver(p.logging);
        if (p.portMappings != null)
            for (const o of p.portMappings)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_PortMapping(o);
        if (p.secrets != null)
            for (const o of Object.values(p.secrets))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_Secret(o);
        if (p.systemControls != null)
            for (const o of p.systemControls)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_SystemControl(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_FirelensLogRouterDefinitionOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.firelensConfig))
            _aws_cdk_aws_ecs_FirelensConfig(p.firelensConfig);
        if (!visitedObjects.has(p.image))
            _aws_cdk_aws_ecs_ContainerImage(p.image);
        if (p.environmentFiles != null)
            for (const o of p.environmentFiles)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_EnvironmentFile(o);
        if (!visitedObjects.has(p.healthCheck))
            _aws_cdk_aws_ecs_HealthCheck(p.healthCheck);
        if (!visitedObjects.has(p.linuxParameters))
            _aws_cdk_aws_ecs_LinuxParameters(p.linuxParameters);
        if (!visitedObjects.has(p.logging))
            _aws_cdk_aws_ecs_LogDriver(p.logging);
        if (p.portMappings != null)
            for (const o of p.portMappings)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_PortMapping(o);
        if (p.secrets != null)
            for (const o of Object.values(p.secrets))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_Secret(o);
        if (p.systemControls != null)
            for (const o of p.systemControls)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_SystemControl(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_FirelensLogRouter(p) {
}
function _aws_cdk_aws_ecs_BinPackResource(p) {
}
function _aws_cdk_aws_ecs_PlacementStrategy(p) {
}
function _aws_cdk_aws_ecs_PlacementConstraint(p) {
}
function _aws_cdk_aws_ecs_Ec2ServiceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.taskDefinition))
            _aws_cdk_aws_ecs_TaskDefinition(p.taskDefinition);
        if (p.placementConstraints != null)
            for (const o of p.placementConstraints)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_PlacementConstraint(o);
        if (p.placementStrategies != null)
            for (const o of p.placementStrategies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_PlacementStrategy(o);
        if ("securityGroup" in p)
            print("@aws-cdk/aws-ecs.Ec2ServiceProps#securityGroup", "use securityGroups instead.");
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_ecs_ICluster(p.cluster);
        if (p.capacityProviderStrategies != null)
            for (const o of p.capacityProviderStrategies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_CapacityProviderStrategy(o);
        if (!visitedObjects.has(p.circuitBreaker))
            _aws_cdk_aws_ecs_DeploymentCircuitBreaker(p.circuitBreaker);
        if (!visitedObjects.has(p.cloudMapOptions))
            _aws_cdk_aws_ecs_CloudMapOptions(p.cloudMapOptions);
        if (!visitedObjects.has(p.deploymentController))
            _aws_cdk_aws_ecs_DeploymentController(p.deploymentController);
        if (!visitedObjects.has(p.propagateTags))
            _aws_cdk_aws_ecs_PropagatedTagSource(p.propagateTags);
        if ("propagateTaskTagsFrom" in p)
            print("@aws-cdk/aws-ecs.BaseServiceOptions#propagateTaskTagsFrom", "Use `propagateTags` instead.");
        if (!visitedObjects.has(p.propagateTaskTagsFrom))
            _aws_cdk_aws_ecs_PropagatedTagSource(p.propagateTaskTagsFrom);
        if (!visitedObjects.has(p.serviceConnectConfiguration))
            _aws_cdk_aws_ecs_ServiceConnectProps(p.serviceConnectConfiguration);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_IEc2Service(p) {
}
function _aws_cdk_aws_ecs_Ec2ServiceAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_ecs_ICluster(p.cluster);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_Ec2Service(p) {
}
function _aws_cdk_aws_ecs_BuiltInAttributes(p) {
}
function _aws_cdk_aws_ecs_Ec2TaskDefinitionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.inferenceAccelerators != null)
            for (const o of p.inferenceAccelerators)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_InferenceAccelerator(o);
        if (!visitedObjects.has(p.ipcMode))
            _aws_cdk_aws_ecs_IpcMode(p.ipcMode);
        if (!visitedObjects.has(p.networkMode))
            _aws_cdk_aws_ecs_NetworkMode(p.networkMode);
        if (!visitedObjects.has(p.pidMode))
            _aws_cdk_aws_ecs_PidMode(p.pidMode);
        if (p.placementConstraints != null)
            for (const o of p.placementConstraints)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_PlacementConstraint(o);
        if (!visitedObjects.has(p.proxyConfiguration))
            _aws_cdk_aws_ecs_ProxyConfiguration(p.proxyConfiguration);
        if (p.volumes != null)
            for (const o of p.volumes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_Volume(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_IEc2TaskDefinition(p) {
}
function _aws_cdk_aws_ecs_Ec2TaskDefinitionAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.networkMode))
            _aws_cdk_aws_ecs_NetworkMode(p.networkMode);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_Ec2TaskDefinition(p) {
}
function _aws_cdk_aws_ecs_FargateServiceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.taskDefinition))
            _aws_cdk_aws_ecs_TaskDefinition(p.taskDefinition);
        if (!visitedObjects.has(p.platformVersion))
            _aws_cdk_aws_ecs_FargatePlatformVersion(p.platformVersion);
        if ("securityGroup" in p)
            print("@aws-cdk/aws-ecs.FargateServiceProps#securityGroup", "use securityGroups instead.");
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_ecs_ICluster(p.cluster);
        if (p.capacityProviderStrategies != null)
            for (const o of p.capacityProviderStrategies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_CapacityProviderStrategy(o);
        if (!visitedObjects.has(p.circuitBreaker))
            _aws_cdk_aws_ecs_DeploymentCircuitBreaker(p.circuitBreaker);
        if (!visitedObjects.has(p.cloudMapOptions))
            _aws_cdk_aws_ecs_CloudMapOptions(p.cloudMapOptions);
        if (!visitedObjects.has(p.deploymentController))
            _aws_cdk_aws_ecs_DeploymentController(p.deploymentController);
        if (!visitedObjects.has(p.propagateTags))
            _aws_cdk_aws_ecs_PropagatedTagSource(p.propagateTags);
        if ("propagateTaskTagsFrom" in p)
            print("@aws-cdk/aws-ecs.BaseServiceOptions#propagateTaskTagsFrom", "Use `propagateTags` instead.");
        if (!visitedObjects.has(p.propagateTaskTagsFrom))
            _aws_cdk_aws_ecs_PropagatedTagSource(p.propagateTaskTagsFrom);
        if (!visitedObjects.has(p.serviceConnectConfiguration))
            _aws_cdk_aws_ecs_ServiceConnectProps(p.serviceConnectConfiguration);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_IFargateService(p) {
}
function _aws_cdk_aws_ecs_FargateServiceAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_ecs_ICluster(p.cluster);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_FargateService(p) {
}
function _aws_cdk_aws_ecs_FargatePlatformVersion(p) {
}
function _aws_cdk_aws_ecs_FargateTaskDefinitionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.runtimePlatform))
            _aws_cdk_aws_ecs_RuntimePlatform(p.runtimePlatform);
        if (!visitedObjects.has(p.proxyConfiguration))
            _aws_cdk_aws_ecs_ProxyConfiguration(p.proxyConfiguration);
        if (p.volumes != null)
            for (const o of p.volumes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_Volume(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_IFargateTaskDefinition(p) {
}
function _aws_cdk_aws_ecs_FargateTaskDefinitionAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.networkMode))
            _aws_cdk_aws_ecs_NetworkMode(p.networkMode);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_FargateTaskDefinition(p) {
}
function _aws_cdk_aws_ecs_ExternalServiceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.taskDefinition))
            _aws_cdk_aws_ecs_TaskDefinition(p.taskDefinition);
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_ecs_ICluster(p.cluster);
        if (p.capacityProviderStrategies != null)
            for (const o of p.capacityProviderStrategies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_CapacityProviderStrategy(o);
        if (!visitedObjects.has(p.circuitBreaker))
            _aws_cdk_aws_ecs_DeploymentCircuitBreaker(p.circuitBreaker);
        if (!visitedObjects.has(p.cloudMapOptions))
            _aws_cdk_aws_ecs_CloudMapOptions(p.cloudMapOptions);
        if (!visitedObjects.has(p.deploymentController))
            _aws_cdk_aws_ecs_DeploymentController(p.deploymentController);
        if (!visitedObjects.has(p.propagateTags))
            _aws_cdk_aws_ecs_PropagatedTagSource(p.propagateTags);
        if ("propagateTaskTagsFrom" in p)
            print("@aws-cdk/aws-ecs.BaseServiceOptions#propagateTaskTagsFrom", "Use `propagateTags` instead.");
        if (!visitedObjects.has(p.propagateTaskTagsFrom))
            _aws_cdk_aws_ecs_PropagatedTagSource(p.propagateTaskTagsFrom);
        if (!visitedObjects.has(p.serviceConnectConfiguration))
            _aws_cdk_aws_ecs_ServiceConnectProps(p.serviceConnectConfiguration);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_IExternalService(p) {
}
function _aws_cdk_aws_ecs_ExternalServiceAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cluster))
            _aws_cdk_aws_ecs_ICluster(p.cluster);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_ExternalService(p) {
}
function _aws_cdk_aws_ecs_ExternalTaskDefinitionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.networkMode))
            _aws_cdk_aws_ecs_NetworkMode(p.networkMode);
        if (!visitedObjects.has(p.proxyConfiguration))
            _aws_cdk_aws_ecs_ProxyConfiguration(p.proxyConfiguration);
        if (p.volumes != null)
            for (const o of p.volumes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_Volume(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_IExternalTaskDefinition(p) {
}
function _aws_cdk_aws_ecs_ExternalTaskDefinitionAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.networkMode))
            _aws_cdk_aws_ecs_NetworkMode(p.networkMode);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_ExternalTaskDefinition(p) {
}
function _aws_cdk_aws_ecs_LinuxParametersProps(p) {
}
function _aws_cdk_aws_ecs_LinuxParameters(p) {
}
function _aws_cdk_aws_ecs_Device(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.permissions != null)
            for (const o of p.permissions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_DevicePermission(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_Tmpfs(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.mountOptions != null)
            for (const o of p.mountOptions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_TmpfsMountOption(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_Capability(p) {
}
function _aws_cdk_aws_ecs_DevicePermission(p) {
}
function _aws_cdk_aws_ecs_TmpfsMountOption(p) {
}
function _aws_cdk_aws_ecs_AssetImageProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.cacheFrom != null)
            for (const o of p.cacheFrom)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ecr-assets/.warnings.jsii.js")._aws_cdk_aws_ecr_assets_DockerCacheOption(o);
        if ("repositoryName" in p)
            print("@aws-cdk/aws-ecr-assets.DockerImageAssetOptions#repositoryName", "to control the location of docker image assets, please override\n`Stack.addDockerImageAsset`. this feature will be removed in future\nreleases.");
        if ("follow" in p)
            print("@aws-cdk/assets.CopyOptions#follow", "use `followSymlinks` instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_AssetImage(p) {
}
function _aws_cdk_aws_ecs_RepositoryImageProps(p) {
}
function _aws_cdk_aws_ecs_RepositoryImage(p) {
}
function _aws_cdk_aws_ecs_EcrImage(p) {
}
function _aws_cdk_aws_ecs_TagParameterContainerImage(p) {
}
function _aws_cdk_aws_ecs_AwsLogDriverMode(p) {
}
function _aws_cdk_aws_ecs_AwsLogDriverProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.mode))
            _aws_cdk_aws_ecs_AwsLogDriverMode(p.mode);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_AwsLogDriver(p) {
}
function _aws_cdk_aws_ecs_BaseLogDriverProps(p) {
}
function _aws_cdk_aws_ecs_FireLensLogDriverProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.secretOptions != null)
            for (const o of Object.values(p.secretOptions))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_Secret(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_FireLensLogDriver(p) {
}
function _aws_cdk_aws_ecs_FluentdLogDriverProps(p) {
}
function _aws_cdk_aws_ecs_FluentdLogDriver(p) {
}
function _aws_cdk_aws_ecs_GelfCompressionType(p) {
}
function _aws_cdk_aws_ecs_GelfLogDriverProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.compressionType))
            _aws_cdk_aws_ecs_GelfCompressionType(p.compressionType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_GelfLogDriver(p) {
}
function _aws_cdk_aws_ecs_JournaldLogDriverProps(p) {
}
function _aws_cdk_aws_ecs_JournaldLogDriver(p) {
}
function _aws_cdk_aws_ecs_JsonFileLogDriverProps(p) {
}
function _aws_cdk_aws_ecs_JsonFileLogDriver(p) {
}
function _aws_cdk_aws_ecs_SplunkLogFormat(p) {
}
function _aws_cdk_aws_ecs_SplunkLogDriverProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.secretToken))
            _aws_cdk_aws_ecs_Secret(p.secretToken);
        if (!visitedObjects.has(p.format))
            _aws_cdk_aws_ecs_SplunkLogFormat(p.format);
        if ("token" in p)
            print("@aws-cdk/aws-ecs.SplunkLogDriverProps#token", "Use `SplunkLogDriverProps.secretToken` instead.");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_SplunkLogDriver(p) {
}
function _aws_cdk_aws_ecs_SyslogLogDriverProps(p) {
}
function _aws_cdk_aws_ecs_SyslogLogDriver(p) {
}
function _aws_cdk_aws_ecs_LogDriver(p) {
}
function _aws_cdk_aws_ecs_LogDriverConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.secretOptions != null)
            for (const o of p.secretOptions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_CfnTaskDefinition_SecretProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_GenericLogDriverProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.secretOptions != null)
            for (const o of Object.values(p.secretOptions))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecs_Secret(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_GenericLogDriver(p) {
}
function _aws_cdk_aws_ecs_LogDrivers(p) {
}
function _aws_cdk_aws_ecs_AppMeshProxyConfigurationProps(p) {
}
function _aws_cdk_aws_ecs_AppMeshProxyConfigurationConfigProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.properties))
            _aws_cdk_aws_ecs_AppMeshProxyConfigurationProps(p.properties);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_AppMeshProxyConfiguration(p) {
}
function _aws_cdk_aws_ecs_ProxyConfiguration(p) {
}
function _aws_cdk_aws_ecs_ProxyConfigurations(p) {
}
function _aws_cdk_aws_ecs_CpuArchitecture(p) {
}
function _aws_cdk_aws_ecs_OperatingSystemFamily(p) {
}
function _aws_cdk_aws_ecs_RuntimePlatform(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cpuArchitecture))
            _aws_cdk_aws_ecs_CpuArchitecture(p.cpuArchitecture);
        if (!visitedObjects.has(p.operatingSystemFamily))
            _aws_cdk_aws_ecs_OperatingSystemFamily(p.operatingSystemFamily);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_CfnCapacityProviderProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.autoScalingGroupProvider))
            _aws_cdk_aws_ecs_CfnCapacityProvider_AutoScalingGroupProviderProperty(p.autoScalingGroupProvider);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_CfnCapacityProvider(p) {
}
function _aws_cdk_aws_ecs_CfnCapacityProvider_AutoScalingGroupProviderProperty(p) {
}
function _aws_cdk_aws_ecs_CfnCapacityProvider_ManagedScalingProperty(p) {
}
function _aws_cdk_aws_ecs_CfnClusterProps(p) {
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
function _aws_cdk_aws_ecs_CfnCluster(p) {
}
function _aws_cdk_aws_ecs_CfnCluster_CapacityProviderStrategyItemProperty(p) {
}
function _aws_cdk_aws_ecs_CfnCluster_ClusterConfigurationProperty(p) {
}
function _aws_cdk_aws_ecs_CfnCluster_ClusterSettingsProperty(p) {
}
function _aws_cdk_aws_ecs_CfnCluster_ExecuteCommandConfigurationProperty(p) {
}
function _aws_cdk_aws_ecs_CfnCluster_ExecuteCommandLogConfigurationProperty(p) {
}
function _aws_cdk_aws_ecs_CfnCluster_ServiceConnectDefaultsProperty(p) {
}
function _aws_cdk_aws_ecs_CfnClusterCapacityProviderAssociationsProps(p) {
}
function _aws_cdk_aws_ecs_CfnClusterCapacityProviderAssociations(p) {
}
function _aws_cdk_aws_ecs_CfnClusterCapacityProviderAssociations_CapacityProviderStrategyProperty(p) {
}
function _aws_cdk_aws_ecs_CfnPrimaryTaskSetProps(p) {
}
function _aws_cdk_aws_ecs_CfnPrimaryTaskSet(p) {
}
function _aws_cdk_aws_ecs_CfnServiceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.networkConfiguration))
            _aws_cdk_aws_ecs_CfnService_NetworkConfigurationProperty(p.networkConfiguration);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_CfnService(p) {
}
function _aws_cdk_aws_ecs_CfnService_AwsVpcConfigurationProperty(p) {
}
function _aws_cdk_aws_ecs_CfnService_CapacityProviderStrategyItemProperty(p) {
}
function _aws_cdk_aws_ecs_CfnService_DeploymentAlarmsProperty(p) {
}
function _aws_cdk_aws_ecs_CfnService_DeploymentCircuitBreakerProperty(p) {
}
function _aws_cdk_aws_ecs_CfnService_DeploymentConfigurationProperty(p) {
}
function _aws_cdk_aws_ecs_CfnService_DeploymentControllerProperty(p) {
}
function _aws_cdk_aws_ecs_CfnService_LoadBalancerProperty(p) {
}
function _aws_cdk_aws_ecs_CfnService_LogConfigurationProperty(p) {
}
function _aws_cdk_aws_ecs_CfnService_NetworkConfigurationProperty(p) {
}
function _aws_cdk_aws_ecs_CfnService_PlacementConstraintProperty(p) {
}
function _aws_cdk_aws_ecs_CfnService_PlacementStrategyProperty(p) {
}
function _aws_cdk_aws_ecs_CfnService_SecretProperty(p) {
}
function _aws_cdk_aws_ecs_CfnService_ServiceConnectClientAliasProperty(p) {
}
function _aws_cdk_aws_ecs_CfnService_ServiceConnectConfigurationProperty(p) {
}
function _aws_cdk_aws_ecs_CfnService_ServiceConnectServiceProperty(p) {
}
function _aws_cdk_aws_ecs_CfnService_ServiceRegistryProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinitionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.proxyConfiguration))
            _aws_cdk_aws_ecs_CfnTaskDefinition_ProxyConfigurationProperty(p.proxyConfiguration);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_CfnTaskDefinition(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_AuthorizationConfigProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_ContainerDefinitionProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.linuxParameters))
            _aws_cdk_aws_ecs_CfnTaskDefinition_LinuxParametersProperty(p.linuxParameters);
        if (!visitedObjects.has(p.repositoryCredentials))
            _aws_cdk_aws_ecs_CfnTaskDefinition_RepositoryCredentialsProperty(p.repositoryCredentials);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_ContainerDependencyProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_DeviceProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_DockerVolumeConfigurationProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_EFSVolumeConfigurationProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_EnvironmentFileProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_EphemeralStorageProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_FirelensConfigurationProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_HealthCheckProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_HostEntryProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_HostVolumePropertiesProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_InferenceAcceleratorProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_KernelCapabilitiesProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_KeyValuePairProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_LinuxParametersProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_LogConfigurationProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_MountPointProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_PortMappingProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_ProxyConfigurationProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_RepositoryCredentialsProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_ResourceRequirementProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_RuntimePlatformProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_SecretProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_SystemControlProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_TaskDefinitionPlacementConstraintProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_TmpfsProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_UlimitProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_VolumeProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskDefinition_VolumeFromProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskSetProps(p) {
}
function _aws_cdk_aws_ecs_CfnTaskSet(p) {
}
function _aws_cdk_aws_ecs_CfnTaskSet_AwsVpcConfigurationProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskSet_LoadBalancerProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskSet_NetworkConfigurationProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskSet_ScaleProperty(p) {
}
function _aws_cdk_aws_ecs_CfnTaskSet_ServiceRegistryProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_ecs_IService, _aws_cdk_aws_ecs_DeploymentController, _aws_cdk_aws_ecs_DeploymentCircuitBreaker, _aws_cdk_aws_ecs_EcsTarget, _aws_cdk_aws_ecs_IEcsLoadBalancerTarget, _aws_cdk_aws_ecs_ServiceConnectProps, _aws_cdk_aws_ecs_ServiceConnectService, _aws_cdk_aws_ecs_BaseServiceOptions, _aws_cdk_aws_ecs_BaseServiceProps, _aws_cdk_aws_ecs_ListenerConfig, _aws_cdk_aws_ecs_IBaseService, _aws_cdk_aws_ecs_BaseService, _aws_cdk_aws_ecs_CloudMapOptions, _aws_cdk_aws_ecs_AssociateCloudMapServiceOptions, _aws_cdk_aws_ecs_LaunchType, _aws_cdk_aws_ecs_DeploymentControllerType, _aws_cdk_aws_ecs_PropagatedTagSource, _aws_cdk_aws_ecs_ScalableTaskCountProps, _aws_cdk_aws_ecs_ScalableTaskCount, _aws_cdk_aws_ecs_CpuUtilizationScalingProps, _aws_cdk_aws_ecs_MemoryUtilizationScalingProps, _aws_cdk_aws_ecs_RequestCountScalingProps, _aws_cdk_aws_ecs_TrackCustomMetricProps, _aws_cdk_aws_ecs_ITaskDefinition, _aws_cdk_aws_ecs_CommonTaskDefinitionProps, _aws_cdk_aws_ecs_TaskDefinitionProps, _aws_cdk_aws_ecs_CommonTaskDefinitionAttributes, _aws_cdk_aws_ecs_TaskDefinitionAttributes, _aws_cdk_aws_ecs_TaskDefinition, _aws_cdk_aws_ecs_NetworkMode, _aws_cdk_aws_ecs_IpcMode, _aws_cdk_aws_ecs_PidMode, _aws_cdk_aws_ecs_InferenceAccelerator, _aws_cdk_aws_ecs_Volume, _aws_cdk_aws_ecs_Host, _aws_cdk_aws_ecs_LoadBalancerTargetOptions, _aws_cdk_aws_ecs_DockerVolumeConfiguration, _aws_cdk_aws_ecs_AuthorizationConfig, _aws_cdk_aws_ecs_EfsVolumeConfiguration, _aws_cdk_aws_ecs_Scope, _aws_cdk_aws_ecs_Compatibility, _aws_cdk_aws_ecs_ITaskDefinitionExtension, _aws_cdk_aws_ecs_SecretVersionInfo, _aws_cdk_aws_ecs_Secret, _aws_cdk_aws_ecs_ContainerDefinitionOptions, _aws_cdk_aws_ecs_ContainerDefinitionProps, _aws_cdk_aws_ecs_ContainerDefinition, _aws_cdk_aws_ecs_HealthCheck, _aws_cdk_aws_ecs_Ulimit, _aws_cdk_aws_ecs_UlimitName, _aws_cdk_aws_ecs_ContainerDependency, _aws_cdk_aws_ecs_ContainerDependencyCondition, _aws_cdk_aws_ecs_PortMapping, _aws_cdk_aws_ecs_PortMap, _aws_cdk_aws_ecs_ServiceConnect, _aws_cdk_aws_ecs_Protocol, _aws_cdk_aws_ecs_AppProtocol, _aws_cdk_aws_ecs_ScratchSpace, _aws_cdk_aws_ecs_MountPoint, _aws_cdk_aws_ecs_VolumeFrom, _aws_cdk_aws_ecs_SystemControl, _aws_cdk_aws_ecs_ContainerImage, _aws_cdk_aws_ecs_ContainerImageConfig, _aws_cdk_aws_ecs_AmiHardwareType, _aws_cdk_aws_ecs_WindowsOptimizedVersion, _aws_cdk_aws_ecs_EcsOptimizedAmiProps, _aws_cdk_aws_ecs_EcsOptimizedAmi, _aws_cdk_aws_ecs_EcsOptimizedImageOptions, _aws_cdk_aws_ecs_EcsOptimizedImage, _aws_cdk_aws_ecs_BottlerocketEcsVariant, _aws_cdk_aws_ecs_BottleRocketImageProps, _aws_cdk_aws_ecs_BottleRocketImage, _aws_cdk_aws_ecs_ClusterProps, _aws_cdk_aws_ecs_MachineImageType, _aws_cdk_aws_ecs_Cluster, _aws_cdk_aws_ecs_ICluster, _aws_cdk_aws_ecs_ClusterAttributes, _aws_cdk_aws_ecs_AddAutoScalingGroupCapacityOptions, _aws_cdk_aws_ecs_AddCapacityOptions, _aws_cdk_aws_ecs_CloudMapNamespaceOptions, _aws_cdk_aws_ecs_CapacityProviderStrategy, _aws_cdk_aws_ecs_ExecuteCommandConfiguration, _aws_cdk_aws_ecs_ExecuteCommandLogging, _aws_cdk_aws_ecs_ExecuteCommandLogConfiguration, _aws_cdk_aws_ecs_AsgCapacityProviderProps, _aws_cdk_aws_ecs_AsgCapacityProvider, _aws_cdk_aws_ecs_EnvironmentFile, _aws_cdk_aws_ecs_AssetEnvironmentFile, _aws_cdk_aws_ecs_S3EnvironmentFile, _aws_cdk_aws_ecs_EnvironmentFileConfig, _aws_cdk_aws_ecs_EnvironmentFileType, _aws_cdk_aws_ecs_FirelensLogRouterType, _aws_cdk_aws_ecs_FirelensConfigFileType, _aws_cdk_aws_ecs_FirelensOptions, _aws_cdk_aws_ecs_FirelensConfig, _aws_cdk_aws_ecs_FirelensLogRouterProps, _aws_cdk_aws_ecs_FirelensLogRouterDefinitionOptions, _aws_cdk_aws_ecs_FirelensLogRouter, _aws_cdk_aws_ecs_BinPackResource, _aws_cdk_aws_ecs_PlacementStrategy, _aws_cdk_aws_ecs_PlacementConstraint, _aws_cdk_aws_ecs_Ec2ServiceProps, _aws_cdk_aws_ecs_IEc2Service, _aws_cdk_aws_ecs_Ec2ServiceAttributes, _aws_cdk_aws_ecs_Ec2Service, _aws_cdk_aws_ecs_BuiltInAttributes, _aws_cdk_aws_ecs_Ec2TaskDefinitionProps, _aws_cdk_aws_ecs_IEc2TaskDefinition, _aws_cdk_aws_ecs_Ec2TaskDefinitionAttributes, _aws_cdk_aws_ecs_Ec2TaskDefinition, _aws_cdk_aws_ecs_FargateServiceProps, _aws_cdk_aws_ecs_IFargateService, _aws_cdk_aws_ecs_FargateServiceAttributes, _aws_cdk_aws_ecs_FargateService, _aws_cdk_aws_ecs_FargatePlatformVersion, _aws_cdk_aws_ecs_FargateTaskDefinitionProps, _aws_cdk_aws_ecs_IFargateTaskDefinition, _aws_cdk_aws_ecs_FargateTaskDefinitionAttributes, _aws_cdk_aws_ecs_FargateTaskDefinition, _aws_cdk_aws_ecs_ExternalServiceProps, _aws_cdk_aws_ecs_IExternalService, _aws_cdk_aws_ecs_ExternalServiceAttributes, _aws_cdk_aws_ecs_ExternalService, _aws_cdk_aws_ecs_ExternalTaskDefinitionProps, _aws_cdk_aws_ecs_IExternalTaskDefinition, _aws_cdk_aws_ecs_ExternalTaskDefinitionAttributes, _aws_cdk_aws_ecs_ExternalTaskDefinition, _aws_cdk_aws_ecs_LinuxParametersProps, _aws_cdk_aws_ecs_LinuxParameters, _aws_cdk_aws_ecs_Device, _aws_cdk_aws_ecs_Tmpfs, _aws_cdk_aws_ecs_Capability, _aws_cdk_aws_ecs_DevicePermission, _aws_cdk_aws_ecs_TmpfsMountOption, _aws_cdk_aws_ecs_AssetImageProps, _aws_cdk_aws_ecs_AssetImage, _aws_cdk_aws_ecs_RepositoryImageProps, _aws_cdk_aws_ecs_RepositoryImage, _aws_cdk_aws_ecs_EcrImage, _aws_cdk_aws_ecs_TagParameterContainerImage, _aws_cdk_aws_ecs_AwsLogDriverMode, _aws_cdk_aws_ecs_AwsLogDriverProps, _aws_cdk_aws_ecs_AwsLogDriver, _aws_cdk_aws_ecs_BaseLogDriverProps, _aws_cdk_aws_ecs_FireLensLogDriverProps, _aws_cdk_aws_ecs_FireLensLogDriver, _aws_cdk_aws_ecs_FluentdLogDriverProps, _aws_cdk_aws_ecs_FluentdLogDriver, _aws_cdk_aws_ecs_GelfCompressionType, _aws_cdk_aws_ecs_GelfLogDriverProps, _aws_cdk_aws_ecs_GelfLogDriver, _aws_cdk_aws_ecs_JournaldLogDriverProps, _aws_cdk_aws_ecs_JournaldLogDriver, _aws_cdk_aws_ecs_JsonFileLogDriverProps, _aws_cdk_aws_ecs_JsonFileLogDriver, _aws_cdk_aws_ecs_SplunkLogFormat, _aws_cdk_aws_ecs_SplunkLogDriverProps, _aws_cdk_aws_ecs_SplunkLogDriver, _aws_cdk_aws_ecs_SyslogLogDriverProps, _aws_cdk_aws_ecs_SyslogLogDriver, _aws_cdk_aws_ecs_LogDriver, _aws_cdk_aws_ecs_LogDriverConfig, _aws_cdk_aws_ecs_GenericLogDriverProps, _aws_cdk_aws_ecs_GenericLogDriver, _aws_cdk_aws_ecs_LogDrivers, _aws_cdk_aws_ecs_AppMeshProxyConfigurationProps, _aws_cdk_aws_ecs_AppMeshProxyConfigurationConfigProps, _aws_cdk_aws_ecs_AppMeshProxyConfiguration, _aws_cdk_aws_ecs_ProxyConfiguration, _aws_cdk_aws_ecs_ProxyConfigurations, _aws_cdk_aws_ecs_CpuArchitecture, _aws_cdk_aws_ecs_OperatingSystemFamily, _aws_cdk_aws_ecs_RuntimePlatform, _aws_cdk_aws_ecs_CfnCapacityProviderProps, _aws_cdk_aws_ecs_CfnCapacityProvider, _aws_cdk_aws_ecs_CfnCapacityProvider_AutoScalingGroupProviderProperty, _aws_cdk_aws_ecs_CfnCapacityProvider_ManagedScalingProperty, _aws_cdk_aws_ecs_CfnClusterProps, _aws_cdk_aws_ecs_CfnCluster, _aws_cdk_aws_ecs_CfnCluster_CapacityProviderStrategyItemProperty, _aws_cdk_aws_ecs_CfnCluster_ClusterConfigurationProperty, _aws_cdk_aws_ecs_CfnCluster_ClusterSettingsProperty, _aws_cdk_aws_ecs_CfnCluster_ExecuteCommandConfigurationProperty, _aws_cdk_aws_ecs_CfnCluster_ExecuteCommandLogConfigurationProperty, _aws_cdk_aws_ecs_CfnCluster_ServiceConnectDefaultsProperty, _aws_cdk_aws_ecs_CfnClusterCapacityProviderAssociationsProps, _aws_cdk_aws_ecs_CfnClusterCapacityProviderAssociations, _aws_cdk_aws_ecs_CfnClusterCapacityProviderAssociations_CapacityProviderStrategyProperty, _aws_cdk_aws_ecs_CfnPrimaryTaskSetProps, _aws_cdk_aws_ecs_CfnPrimaryTaskSet, _aws_cdk_aws_ecs_CfnServiceProps, _aws_cdk_aws_ecs_CfnService, _aws_cdk_aws_ecs_CfnService_AwsVpcConfigurationProperty, _aws_cdk_aws_ecs_CfnService_CapacityProviderStrategyItemProperty, _aws_cdk_aws_ecs_CfnService_DeploymentAlarmsProperty, _aws_cdk_aws_ecs_CfnService_DeploymentCircuitBreakerProperty, _aws_cdk_aws_ecs_CfnService_DeploymentConfigurationProperty, _aws_cdk_aws_ecs_CfnService_DeploymentControllerProperty, _aws_cdk_aws_ecs_CfnService_LoadBalancerProperty, _aws_cdk_aws_ecs_CfnService_LogConfigurationProperty, _aws_cdk_aws_ecs_CfnService_NetworkConfigurationProperty, _aws_cdk_aws_ecs_CfnService_PlacementConstraintProperty, _aws_cdk_aws_ecs_CfnService_PlacementStrategyProperty, _aws_cdk_aws_ecs_CfnService_SecretProperty, _aws_cdk_aws_ecs_CfnService_ServiceConnectClientAliasProperty, _aws_cdk_aws_ecs_CfnService_ServiceConnectConfigurationProperty, _aws_cdk_aws_ecs_CfnService_ServiceConnectServiceProperty, _aws_cdk_aws_ecs_CfnService_ServiceRegistryProperty, _aws_cdk_aws_ecs_CfnTaskDefinitionProps, _aws_cdk_aws_ecs_CfnTaskDefinition, _aws_cdk_aws_ecs_CfnTaskDefinition_AuthorizationConfigProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_ContainerDefinitionProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_ContainerDependencyProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_DeviceProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_DockerVolumeConfigurationProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_EFSVolumeConfigurationProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_EnvironmentFileProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_EphemeralStorageProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_FirelensConfigurationProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_HealthCheckProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_HostEntryProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_HostVolumePropertiesProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_InferenceAcceleratorProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_KernelCapabilitiesProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_KeyValuePairProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_LinuxParametersProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_LogConfigurationProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_MountPointProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_PortMappingProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_ProxyConfigurationProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_RepositoryCredentialsProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_ResourceRequirementProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_RuntimePlatformProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_SecretProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_SystemControlProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_TaskDefinitionPlacementConstraintProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_TmpfsProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_UlimitProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_VolumeProperty, _aws_cdk_aws_ecs_CfnTaskDefinition_VolumeFromProperty, _aws_cdk_aws_ecs_CfnTaskSetProps, _aws_cdk_aws_ecs_CfnTaskSet, _aws_cdk_aws_ecs_CfnTaskSet_AwsVpcConfigurationProperty, _aws_cdk_aws_ecs_CfnTaskSet_LoadBalancerProperty, _aws_cdk_aws_ecs_CfnTaskSet_NetworkConfigurationProperty, _aws_cdk_aws_ecs_CfnTaskSet_ScaleProperty, _aws_cdk_aws_ecs_CfnTaskSet_ServiceRegistryProperty };
