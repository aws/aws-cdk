function _aws_cdk_aws_autoscaling_AutoScalingGroupRequireImdsv2Aspect(p) {
}
function _aws_cdk_aws_autoscaling_Monitoring(p) {
}
function _aws_cdk_aws_autoscaling_CommonAutoScalingGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.blockDevices != null)
            for (const o of p.blockDevices)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_autoscaling_BlockDevice(o);
        if (p.groupMetrics != null)
            for (const o of p.groupMetrics)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_autoscaling_GroupMetrics(o);
        if (!visitedObjects.has(p.healthCheck))
            _aws_cdk_aws_autoscaling_HealthCheck(p.healthCheck);
        if (!visitedObjects.has(p.instanceMonitoring))
            _aws_cdk_aws_autoscaling_Monitoring(p.instanceMonitoring);
        if (p.notifications != null)
            for (const o of p.notifications)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_autoscaling_NotificationConfiguration(o);
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
        if (!visitedObjects.has(p.rollingUpdateConfiguration))
            _aws_cdk_aws_autoscaling_RollingUpdateConfiguration(p.rollingUpdateConfiguration);
        if (!visitedObjects.has(p.signals))
            _aws_cdk_aws_autoscaling_Signals(p.signals);
        if (p.terminationPolicies != null)
            for (const o of p.terminationPolicies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_autoscaling_TerminationPolicy(o);
        if (!visitedObjects.has(p.updatePolicy))
            _aws_cdk_aws_autoscaling_UpdatePolicy(p.updatePolicy);
        if ("updateType" in p)
            print("@aws-cdk/aws-autoscaling.CommonAutoScalingGroupProps#updateType", "Use `updatePolicy` instead");
        if (!visitedObjects.has(p.updateType))
            _aws_cdk_aws_autoscaling_UpdateType(p.updateType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_MixedInstancesPolicy(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.instancesDistribution))
            _aws_cdk_aws_autoscaling_InstancesDistribution(p.instancesDistribution);
        if (p.launchTemplateOverrides != null)
            for (const o of p.launchTemplateOverrides)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_autoscaling_LaunchTemplateOverrides(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_OnDemandAllocationStrategy(p) {
}
function _aws_cdk_aws_autoscaling_SpotAllocationStrategy(p) {
}
function _aws_cdk_aws_autoscaling_InstancesDistribution(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.onDemandAllocationStrategy))
            _aws_cdk_aws_autoscaling_OnDemandAllocationStrategy(p.onDemandAllocationStrategy);
        if (!visitedObjects.has(p.spotAllocationStrategy))
            _aws_cdk_aws_autoscaling_SpotAllocationStrategy(p.spotAllocationStrategy);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_LaunchTemplateOverrides(p) {
}
function _aws_cdk_aws_autoscaling_AutoScalingGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.initOptions))
            _aws_cdk_aws_autoscaling_ApplyCloudFormationInitOptions(p.initOptions);
        if (!visitedObjects.has(p.mixedInstancesPolicy))
            _aws_cdk_aws_autoscaling_MixedInstancesPolicy(p.mixedInstancesPolicy);
        if (p.blockDevices != null)
            for (const o of p.blockDevices)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_autoscaling_BlockDevice(o);
        if (p.groupMetrics != null)
            for (const o of p.groupMetrics)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_autoscaling_GroupMetrics(o);
        if (!visitedObjects.has(p.healthCheck))
            _aws_cdk_aws_autoscaling_HealthCheck(p.healthCheck);
        if (!visitedObjects.has(p.instanceMonitoring))
            _aws_cdk_aws_autoscaling_Monitoring(p.instanceMonitoring);
        if (p.notifications != null)
            for (const o of p.notifications)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_autoscaling_NotificationConfiguration(o);
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
        if (!visitedObjects.has(p.rollingUpdateConfiguration))
            _aws_cdk_aws_autoscaling_RollingUpdateConfiguration(p.rollingUpdateConfiguration);
        if (!visitedObjects.has(p.signals))
            _aws_cdk_aws_autoscaling_Signals(p.signals);
        if (p.terminationPolicies != null)
            for (const o of p.terminationPolicies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_autoscaling_TerminationPolicy(o);
        if (!visitedObjects.has(p.updatePolicy))
            _aws_cdk_aws_autoscaling_UpdatePolicy(p.updatePolicy);
        if ("updateType" in p)
            print("@aws-cdk/aws-autoscaling.CommonAutoScalingGroupProps#updateType", "Use `updatePolicy` instead");
        if (!visitedObjects.has(p.updateType))
            _aws_cdk_aws_autoscaling_UpdateType(p.updateType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_Signals(p) {
}
function _aws_cdk_aws_autoscaling_RenderSignalsOptions(p) {
}
function _aws_cdk_aws_autoscaling_SignalsOptions(p) {
}
function _aws_cdk_aws_autoscaling_UpdatePolicy(p) {
}
function _aws_cdk_aws_autoscaling_RollingUpdateOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.suspendProcesses != null)
            for (const o of p.suspendProcesses)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_autoscaling_ScalingProcess(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_GroupMetrics(p) {
}
function _aws_cdk_aws_autoscaling_GroupMetric(p) {
}
function _aws_cdk_aws_autoscaling_AutoScalingGroup(p) {
}
function _aws_cdk_aws_autoscaling_UpdateType(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/aws-autoscaling.UpdateType", "Use UpdatePolicy instead");
        const ns = require("./lib/auto-scaling-group.js");
        if (Object.values(ns.UpdateType).filter(x => x === p).length > 1)
            return;
        if (p === ns.UpdateType.NONE)
            print("@aws-cdk/aws-autoscaling.UpdateType#NONE", "");
        if (p === ns.UpdateType.REPLACING_UPDATE)
            print("@aws-cdk/aws-autoscaling.UpdateType#REPLACING_UPDATE", "");
        if (p === ns.UpdateType.ROLLING_UPDATE)
            print("@aws-cdk/aws-autoscaling.UpdateType#ROLLING_UPDATE", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_NotificationConfiguration(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.scalingEvents))
            _aws_cdk_aws_autoscaling_ScalingEvents(p.scalingEvents);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_ScalingEvent(p) {
}
function _aws_cdk_aws_autoscaling_RollingUpdateConfiguration(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("maxBatchSize" in p)
            print("@aws-cdk/aws-autoscaling.RollingUpdateConfiguration#maxBatchSize", "use `UpdatePolicy.rollingUpdate()`");
        if ("minInstancesInService" in p)
            print("@aws-cdk/aws-autoscaling.RollingUpdateConfiguration#minInstancesInService", "use `UpdatePolicy.rollingUpdate()`");
        if ("minSuccessfulInstancesPercent" in p)
            print("@aws-cdk/aws-autoscaling.RollingUpdateConfiguration#minSuccessfulInstancesPercent", "use `UpdatePolicy.rollingUpdate()`");
        if ("pauseTime" in p)
            print("@aws-cdk/aws-autoscaling.RollingUpdateConfiguration#pauseTime", "use `UpdatePolicy.rollingUpdate()`");
        if ("suspendProcesses" in p)
            print("@aws-cdk/aws-autoscaling.RollingUpdateConfiguration#suspendProcesses", "use `UpdatePolicy.rollingUpdate()`");
        if (p.suspendProcesses != null)
            for (const o of p.suspendProcesses)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_autoscaling_ScalingProcess(o);
        if ("waitOnResourceSignals" in p)
            print("@aws-cdk/aws-autoscaling.RollingUpdateConfiguration#waitOnResourceSignals", "use `UpdatePolicy.rollingUpdate()`");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_ScalingEvents(p) {
}
function _aws_cdk_aws_autoscaling_ScalingProcess(p) {
}
function _aws_cdk_aws_autoscaling_Ec2HealthCheckOptions(p) {
}
function _aws_cdk_aws_autoscaling_ElbHealthCheckOptions(p) {
}
function _aws_cdk_aws_autoscaling_HealthCheck(p) {
}
function _aws_cdk_aws_autoscaling_IAutoScalingGroup(p) {
}
function _aws_cdk_aws_autoscaling_CpuUtilizationScalingProps(p) {
}
function _aws_cdk_aws_autoscaling_NetworkUtilizationScalingProps(p) {
}
function _aws_cdk_aws_autoscaling_RequestCountScalingProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("targetRequestsPerSecond" in p)
            print("@aws-cdk/aws-autoscaling.RequestCountScalingProps#targetRequestsPerSecond", "Use 'targetRequestsPerMinute' instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_MetricTargetTrackingProps(p) {
}
function _aws_cdk_aws_autoscaling_ApplyCloudFormationInitOptions(p) {
}
function _aws_cdk_aws_autoscaling_Schedule(p) {
}
function _aws_cdk_aws_autoscaling_CronOptions(p) {
}
function _aws_cdk_aws_autoscaling_BasicLifecycleHookProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.lifecycleTransition))
            _aws_cdk_aws_autoscaling_LifecycleTransition(p.lifecycleTransition);
        if (!visitedObjects.has(p.defaultResult))
            _aws_cdk_aws_autoscaling_DefaultResult(p.defaultResult);
        if (!visitedObjects.has(p.notificationTarget))
            _aws_cdk_aws_autoscaling_ILifecycleHookTarget(p.notificationTarget);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_LifecycleHookProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.autoScalingGroup))
            _aws_cdk_aws_autoscaling_IAutoScalingGroup(p.autoScalingGroup);
        if (!visitedObjects.has(p.lifecycleTransition))
            _aws_cdk_aws_autoscaling_LifecycleTransition(p.lifecycleTransition);
        if (!visitedObjects.has(p.defaultResult))
            _aws_cdk_aws_autoscaling_DefaultResult(p.defaultResult);
        if (!visitedObjects.has(p.notificationTarget))
            _aws_cdk_aws_autoscaling_ILifecycleHookTarget(p.notificationTarget);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_ILifecycleHook(p) {
}
function _aws_cdk_aws_autoscaling_LifecycleHook(p) {
}
function _aws_cdk_aws_autoscaling_DefaultResult(p) {
}
function _aws_cdk_aws_autoscaling_LifecycleTransition(p) {
}
function _aws_cdk_aws_autoscaling_BindHookTargetOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.lifecycleHook))
            _aws_cdk_aws_autoscaling_LifecycleHook(p.lifecycleHook);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_LifecycleHookTargetConfig(p) {
}
function _aws_cdk_aws_autoscaling_ILifecycleHookTarget(p) {
}
function _aws_cdk_aws_autoscaling_BasicScheduledActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.schedule))
            _aws_cdk_aws_autoscaling_Schedule(p.schedule);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_ScheduledActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.autoScalingGroup))
            _aws_cdk_aws_autoscaling_IAutoScalingGroup(p.autoScalingGroup);
        if (!visitedObjects.has(p.schedule))
            _aws_cdk_aws_autoscaling_Schedule(p.schedule);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_ScheduledAction(p) {
}
function _aws_cdk_aws_autoscaling_StepScalingActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.autoScalingGroup))
            _aws_cdk_aws_autoscaling_IAutoScalingGroup(p.autoScalingGroup);
        if (!visitedObjects.has(p.adjustmentType))
            _aws_cdk_aws_autoscaling_AdjustmentType(p.adjustmentType);
        if (!visitedObjects.has(p.metricAggregationType))
            _aws_cdk_aws_autoscaling_MetricAggregationType(p.metricAggregationType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_StepScalingAction(p) {
}
function _aws_cdk_aws_autoscaling_AdjustmentType(p) {
}
function _aws_cdk_aws_autoscaling_MetricAggregationType(p) {
}
function _aws_cdk_aws_autoscaling_AdjustmentTier(p) {
}
function _aws_cdk_aws_autoscaling_BasicStepScalingPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.scalingSteps != null)
            for (const o of p.scalingSteps)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_autoscaling_ScalingInterval(o);
        if (!visitedObjects.has(p.adjustmentType))
            _aws_cdk_aws_autoscaling_AdjustmentType(p.adjustmentType);
        if (!visitedObjects.has(p.metricAggregationType))
            _aws_cdk_aws_autoscaling_MetricAggregationType(p.metricAggregationType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_StepScalingPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.autoScalingGroup))
            _aws_cdk_aws_autoscaling_IAutoScalingGroup(p.autoScalingGroup);
        if (p.scalingSteps != null)
            for (const o of p.scalingSteps)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_autoscaling_ScalingInterval(o);
        if (!visitedObjects.has(p.adjustmentType))
            _aws_cdk_aws_autoscaling_AdjustmentType(p.adjustmentType);
        if (!visitedObjects.has(p.metricAggregationType))
            _aws_cdk_aws_autoscaling_MetricAggregationType(p.metricAggregationType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_StepScalingPolicy(p) {
}
function _aws_cdk_aws_autoscaling_ScalingInterval(p) {
}
function _aws_cdk_aws_autoscaling_BaseTargetTrackingProps(p) {
}
function _aws_cdk_aws_autoscaling_BasicTargetTrackingScalingPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.predefinedMetric))
            _aws_cdk_aws_autoscaling_PredefinedMetric(p.predefinedMetric);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_TargetTrackingScalingPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.autoScalingGroup))
            _aws_cdk_aws_autoscaling_IAutoScalingGroup(p.autoScalingGroup);
        if (!visitedObjects.has(p.predefinedMetric))
            _aws_cdk_aws_autoscaling_PredefinedMetric(p.predefinedMetric);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_TargetTrackingScalingPolicy(p) {
}
function _aws_cdk_aws_autoscaling_PredefinedMetric(p) {
}
function _aws_cdk_aws_autoscaling_TerminationPolicy(p) {
}
function _aws_cdk_aws_autoscaling_BlockDevice(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.volume))
            _aws_cdk_aws_autoscaling_BlockDeviceVolume(p.volume);
        if ("mappingEnabled" in p)
            print("@aws-cdk/aws-autoscaling.BlockDevice#mappingEnabled", "use `BlockDeviceVolume.noDevice()` as the volume to supress a mapping.");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_EbsDeviceOptionsBase(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.volumeType))
            _aws_cdk_aws_autoscaling_EbsDeviceVolumeType(p.volumeType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_EbsDeviceOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.volumeType))
            _aws_cdk_aws_autoscaling_EbsDeviceVolumeType(p.volumeType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_EbsDeviceSnapshotOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.volumeType))
            _aws_cdk_aws_autoscaling_EbsDeviceVolumeType(p.volumeType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_EbsDeviceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.volumeType))
            _aws_cdk_aws_autoscaling_EbsDeviceVolumeType(p.volumeType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_BlockDeviceVolume(p) {
}
function _aws_cdk_aws_autoscaling_EbsDeviceVolumeType(p) {
}
function _aws_cdk_aws_autoscaling_WarmPoolOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.poolState))
            _aws_cdk_aws_autoscaling_PoolState(p.poolState);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_WarmPoolProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.autoScalingGroup))
            _aws_cdk_aws_autoscaling_IAutoScalingGroup(p.autoScalingGroup);
        if (!visitedObjects.has(p.poolState))
            _aws_cdk_aws_autoscaling_PoolState(p.poolState);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_WarmPool(p) {
}
function _aws_cdk_aws_autoscaling_PoolState(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_TagPropertyProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_AcceleratorCountRequestProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_AcceleratorTotalMemoryMiBRequestProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_BaselineEbsBandwidthMbpsRequestProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_InstanceRequirementsProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_InstancesDistributionProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_LaunchTemplateProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_LaunchTemplateOverridesProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_LaunchTemplateSpecificationProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_LifecycleHookSpecificationProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_MemoryGiBPerVCpuRequestProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_MemoryMiBRequestProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_MetricsCollectionProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_MixedInstancesPolicyProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_NetworkBandwidthGbpsRequestProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_NetworkInterfaceCountRequestProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_NotificationConfigurationProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_TagPropertyProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_TotalLocalStorageGBRequestProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_VCpuCountRequestProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnLaunchConfigurationProps(p) {
}
function _aws_cdk_aws_autoscaling_CfnLaunchConfiguration(p) {
}
function _aws_cdk_aws_autoscaling_CfnLaunchConfiguration_BlockDeviceProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnLaunchConfiguration_BlockDeviceMappingProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnLaunchConfiguration_MetadataOptionsProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnLifecycleHookProps(p) {
}
function _aws_cdk_aws_autoscaling_CfnLifecycleHook(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicyProps(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy_CustomizedMetricSpecificationProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy_MetricProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy_MetricDataQueryProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy_MetricDimensionProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy_MetricStatProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredefinedMetricSpecificationProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredictiveScalingConfigurationProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredictiveScalingCustomizedCapacityMetricProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredictiveScalingCustomizedLoadMetricProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredictiveScalingCustomizedScalingMetricProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredictiveScalingMetricSpecificationProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredictiveScalingPredefinedLoadMetricProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredictiveScalingPredefinedMetricPairProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredictiveScalingPredefinedScalingMetricProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy_StepAdjustmentProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnScalingPolicy_TargetTrackingConfigurationProperty(p) {
}
function _aws_cdk_aws_autoscaling_CfnScheduledActionProps(p) {
}
function _aws_cdk_aws_autoscaling_CfnScheduledAction(p) {
}
function _aws_cdk_aws_autoscaling_CfnWarmPoolProps(p) {
}
function _aws_cdk_aws_autoscaling_CfnWarmPool(p) {
}
function _aws_cdk_aws_autoscaling_CfnWarmPool_InstanceReusePolicyProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_autoscaling_AutoScalingGroupRequireImdsv2Aspect, _aws_cdk_aws_autoscaling_Monitoring, _aws_cdk_aws_autoscaling_CommonAutoScalingGroupProps, _aws_cdk_aws_autoscaling_MixedInstancesPolicy, _aws_cdk_aws_autoscaling_OnDemandAllocationStrategy, _aws_cdk_aws_autoscaling_SpotAllocationStrategy, _aws_cdk_aws_autoscaling_InstancesDistribution, _aws_cdk_aws_autoscaling_LaunchTemplateOverrides, _aws_cdk_aws_autoscaling_AutoScalingGroupProps, _aws_cdk_aws_autoscaling_Signals, _aws_cdk_aws_autoscaling_RenderSignalsOptions, _aws_cdk_aws_autoscaling_SignalsOptions, _aws_cdk_aws_autoscaling_UpdatePolicy, _aws_cdk_aws_autoscaling_RollingUpdateOptions, _aws_cdk_aws_autoscaling_GroupMetrics, _aws_cdk_aws_autoscaling_GroupMetric, _aws_cdk_aws_autoscaling_AutoScalingGroup, _aws_cdk_aws_autoscaling_UpdateType, _aws_cdk_aws_autoscaling_NotificationConfiguration, _aws_cdk_aws_autoscaling_ScalingEvent, _aws_cdk_aws_autoscaling_RollingUpdateConfiguration, _aws_cdk_aws_autoscaling_ScalingEvents, _aws_cdk_aws_autoscaling_ScalingProcess, _aws_cdk_aws_autoscaling_Ec2HealthCheckOptions, _aws_cdk_aws_autoscaling_ElbHealthCheckOptions, _aws_cdk_aws_autoscaling_HealthCheck, _aws_cdk_aws_autoscaling_IAutoScalingGroup, _aws_cdk_aws_autoscaling_CpuUtilizationScalingProps, _aws_cdk_aws_autoscaling_NetworkUtilizationScalingProps, _aws_cdk_aws_autoscaling_RequestCountScalingProps, _aws_cdk_aws_autoscaling_MetricTargetTrackingProps, _aws_cdk_aws_autoscaling_ApplyCloudFormationInitOptions, _aws_cdk_aws_autoscaling_Schedule, _aws_cdk_aws_autoscaling_CronOptions, _aws_cdk_aws_autoscaling_BasicLifecycleHookProps, _aws_cdk_aws_autoscaling_LifecycleHookProps, _aws_cdk_aws_autoscaling_ILifecycleHook, _aws_cdk_aws_autoscaling_LifecycleHook, _aws_cdk_aws_autoscaling_DefaultResult, _aws_cdk_aws_autoscaling_LifecycleTransition, _aws_cdk_aws_autoscaling_BindHookTargetOptions, _aws_cdk_aws_autoscaling_LifecycleHookTargetConfig, _aws_cdk_aws_autoscaling_ILifecycleHookTarget, _aws_cdk_aws_autoscaling_BasicScheduledActionProps, _aws_cdk_aws_autoscaling_ScheduledActionProps, _aws_cdk_aws_autoscaling_ScheduledAction, _aws_cdk_aws_autoscaling_StepScalingActionProps, _aws_cdk_aws_autoscaling_StepScalingAction, _aws_cdk_aws_autoscaling_AdjustmentType, _aws_cdk_aws_autoscaling_MetricAggregationType, _aws_cdk_aws_autoscaling_AdjustmentTier, _aws_cdk_aws_autoscaling_BasicStepScalingPolicyProps, _aws_cdk_aws_autoscaling_StepScalingPolicyProps, _aws_cdk_aws_autoscaling_StepScalingPolicy, _aws_cdk_aws_autoscaling_ScalingInterval, _aws_cdk_aws_autoscaling_BaseTargetTrackingProps, _aws_cdk_aws_autoscaling_BasicTargetTrackingScalingPolicyProps, _aws_cdk_aws_autoscaling_TargetTrackingScalingPolicyProps, _aws_cdk_aws_autoscaling_TargetTrackingScalingPolicy, _aws_cdk_aws_autoscaling_PredefinedMetric, _aws_cdk_aws_autoscaling_TerminationPolicy, _aws_cdk_aws_autoscaling_BlockDevice, _aws_cdk_aws_autoscaling_EbsDeviceOptionsBase, _aws_cdk_aws_autoscaling_EbsDeviceOptions, _aws_cdk_aws_autoscaling_EbsDeviceSnapshotOptions, _aws_cdk_aws_autoscaling_EbsDeviceProps, _aws_cdk_aws_autoscaling_BlockDeviceVolume, _aws_cdk_aws_autoscaling_EbsDeviceVolumeType, _aws_cdk_aws_autoscaling_WarmPoolOptions, _aws_cdk_aws_autoscaling_WarmPoolProps, _aws_cdk_aws_autoscaling_WarmPool, _aws_cdk_aws_autoscaling_PoolState, _aws_cdk_aws_autoscaling_CfnAutoScalingGroupProps, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_AcceleratorCountRequestProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_AcceleratorTotalMemoryMiBRequestProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_BaselineEbsBandwidthMbpsRequestProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_InstanceRequirementsProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_InstancesDistributionProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_LaunchTemplateProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_LaunchTemplateOverridesProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_LaunchTemplateSpecificationProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_LifecycleHookSpecificationProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_MemoryGiBPerVCpuRequestProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_MemoryMiBRequestProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_MetricsCollectionProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_MixedInstancesPolicyProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_NetworkBandwidthGbpsRequestProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_NetworkInterfaceCountRequestProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_NotificationConfigurationProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_TagPropertyProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_TotalLocalStorageGBRequestProperty, _aws_cdk_aws_autoscaling_CfnAutoScalingGroup_VCpuCountRequestProperty, _aws_cdk_aws_autoscaling_CfnLaunchConfigurationProps, _aws_cdk_aws_autoscaling_CfnLaunchConfiguration, _aws_cdk_aws_autoscaling_CfnLaunchConfiguration_BlockDeviceProperty, _aws_cdk_aws_autoscaling_CfnLaunchConfiguration_BlockDeviceMappingProperty, _aws_cdk_aws_autoscaling_CfnLaunchConfiguration_MetadataOptionsProperty, _aws_cdk_aws_autoscaling_CfnLifecycleHookProps, _aws_cdk_aws_autoscaling_CfnLifecycleHook, _aws_cdk_aws_autoscaling_CfnScalingPolicyProps, _aws_cdk_aws_autoscaling_CfnScalingPolicy, _aws_cdk_aws_autoscaling_CfnScalingPolicy_CustomizedMetricSpecificationProperty, _aws_cdk_aws_autoscaling_CfnScalingPolicy_MetricProperty, _aws_cdk_aws_autoscaling_CfnScalingPolicy_MetricDataQueryProperty, _aws_cdk_aws_autoscaling_CfnScalingPolicy_MetricDimensionProperty, _aws_cdk_aws_autoscaling_CfnScalingPolicy_MetricStatProperty, _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredefinedMetricSpecificationProperty, _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredictiveScalingConfigurationProperty, _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredictiveScalingCustomizedCapacityMetricProperty, _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredictiveScalingCustomizedLoadMetricProperty, _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredictiveScalingCustomizedScalingMetricProperty, _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredictiveScalingMetricSpecificationProperty, _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredictiveScalingPredefinedLoadMetricProperty, _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredictiveScalingPredefinedMetricPairProperty, _aws_cdk_aws_autoscaling_CfnScalingPolicy_PredictiveScalingPredefinedScalingMetricProperty, _aws_cdk_aws_autoscaling_CfnScalingPolicy_StepAdjustmentProperty, _aws_cdk_aws_autoscaling_CfnScalingPolicy_TargetTrackingConfigurationProperty, _aws_cdk_aws_autoscaling_CfnScheduledActionProps, _aws_cdk_aws_autoscaling_CfnScheduledAction, _aws_cdk_aws_autoscaling_CfnWarmPoolProps, _aws_cdk_aws_autoscaling_CfnWarmPool, _aws_cdk_aws_autoscaling_CfnWarmPool_InstanceReusePolicyProperty };
