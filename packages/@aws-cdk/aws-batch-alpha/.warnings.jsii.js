function _aws_cdk_aws_batch_alpha_IComputeEnvironment(p) {
}
function _aws_cdk_aws_batch_alpha_ComputeEnvironmentProps(p) {
}
function _aws_cdk_aws_batch_alpha_EcsJobDefinitionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.container))
            _aws_cdk_aws_batch_alpha_IEcsContainerDefinition(p.container);
        if (p.retryStrategies != null)
            for (const o of p.retryStrategies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_RetryStrategy(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_EcsJobDefinition(p) {
}
function _aws_cdk_aws_batch_alpha_IEksJobDefinition(p) {
}
function _aws_cdk_aws_batch_alpha_EksJobDefinitionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.container))
            _aws_cdk_aws_batch_alpha_EksContainerDefinition(p.container);
        if (!visitedObjects.has(p.dnsPolicy))
            _aws_cdk_aws_batch_alpha_DnsPolicy(p.dnsPolicy);
        if (p.retryStrategies != null)
            for (const o of p.retryStrategies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_RetryStrategy(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_DnsPolicy(p) {
}
function _aws_cdk_aws_batch_alpha_EksJobDefinition(p) {
}
function _aws_cdk_aws_batch_alpha_SecretVersionInfo(p) {
}
function _aws_cdk_aws_batch_alpha_Secret(p) {
}
function _aws_cdk_aws_batch_alpha_EcsVolumeOptions(p) {
}
function _aws_cdk_aws_batch_alpha_EcsVolume(p) {
}
function _aws_cdk_aws_batch_alpha_EfsVolumeOptions(p) {
}
function _aws_cdk_aws_batch_alpha_EfsVolume(p) {
}
function _aws_cdk_aws_batch_alpha_HostVolumeOptions(p) {
}
function _aws_cdk_aws_batch_alpha_HostVolume(p) {
}
function _aws_cdk_aws_batch_alpha_IEcsContainerDefinition(p) {
}
function _aws_cdk_aws_batch_alpha_EcsContainerDefinitionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.linuxParameters))
            _aws_cdk_aws_batch_alpha_LinuxParameters(p.linuxParameters);
        if (p.secrets != null)
            for (const o of Object.values(p.secrets))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_Secret(o);
        if (p.volumes != null)
            for (const o of p.volumes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_EcsVolume(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_Ulimit(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.name))
            _aws_cdk_aws_batch_alpha_UlimitName(p.name);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_UlimitName(p) {
}
function _aws_cdk_aws_batch_alpha_IEcsEc2ContainerDefinition(p) {
}
function _aws_cdk_aws_batch_alpha_EcsEc2ContainerDefinitionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.ulimits != null)
            for (const o of p.ulimits)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_Ulimit(o);
        if (!visitedObjects.has(p.linuxParameters))
            _aws_cdk_aws_batch_alpha_LinuxParameters(p.linuxParameters);
        if (p.secrets != null)
            for (const o of Object.values(p.secrets))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_Secret(o);
        if (p.volumes != null)
            for (const o of p.volumes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_EcsVolume(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_EcsEc2ContainerDefinition(p) {
}
function _aws_cdk_aws_batch_alpha_IEcsFargateContainerDefinition(p) {
}
function _aws_cdk_aws_batch_alpha_EcsFargateContainerDefinitionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.linuxParameters))
            _aws_cdk_aws_batch_alpha_LinuxParameters(p.linuxParameters);
        if (p.secrets != null)
            for (const o of Object.values(p.secrets))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_Secret(o);
        if (p.volumes != null)
            for (const o of p.volumes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_EcsVolume(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_EcsFargateContainerDefinition(p) {
}
function _aws_cdk_aws_batch_alpha_IEksContainerDefinition(p) {
}
function _aws_cdk_aws_batch_alpha_ImagePullPolicy(p) {
}
function _aws_cdk_aws_batch_alpha_EksContainerDefinitionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.imagePullPolicy))
            _aws_cdk_aws_batch_alpha_ImagePullPolicy(p.imagePullPolicy);
        if (p.volumes != null)
            for (const o of p.volumes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_EksVolume(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_EksContainerDefinition(p) {
}
function _aws_cdk_aws_batch_alpha_EksVolumeOptions(p) {
}
function _aws_cdk_aws_batch_alpha_EksVolume(p) {
}
function _aws_cdk_aws_batch_alpha_EmptyDirVolumeOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.medium))
            _aws_cdk_aws_batch_alpha_EmptyDirMediumType(p.medium);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_EmptyDirMediumType(p) {
}
function _aws_cdk_aws_batch_alpha_EmptyDirVolume(p) {
}
function _aws_cdk_aws_batch_alpha_HostPathVolumeOptions(p) {
}
function _aws_cdk_aws_batch_alpha_HostPathVolume(p) {
}
function _aws_cdk_aws_batch_alpha_SecretPathVolumeOptions(p) {
}
function _aws_cdk_aws_batch_alpha_SecretPathVolume(p) {
}
function _aws_cdk_aws_batch_alpha_IJobDefinition(p) {
}
function _aws_cdk_aws_batch_alpha_JobDefinitionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.retryStrategies != null)
            for (const o of p.retryStrategies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_RetryStrategy(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_RetryStrategy(p) {
}
function _aws_cdk_aws_batch_alpha_Action(p) {
}
function _aws_cdk_aws_batch_alpha_CustomReason(p) {
}
function _aws_cdk_aws_batch_alpha_Reason(p) {
}
function _aws_cdk_aws_batch_alpha_IJobQueue(p) {
}
function _aws_cdk_aws_batch_alpha_JobQueueProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.computeEnvironments != null)
            for (const o of p.computeEnvironments)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_OrderedComputeEnvironment(o);
        if (!visitedObjects.has(p.schedulingPolicy))
            _aws_cdk_aws_batch_alpha_ISchedulingPolicy(p.schedulingPolicy);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_OrderedComputeEnvironment(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.computeEnvironment))
            _aws_cdk_aws_batch_alpha_IComputeEnvironment(p.computeEnvironment);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_JobQueue(p) {
}
function _aws_cdk_aws_batch_alpha_LinuxParametersProps(p) {
}
function _aws_cdk_aws_batch_alpha_LinuxParameters(p) {
}
function _aws_cdk_aws_batch_alpha_Device(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.permissions != null)
            for (const o of p.permissions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_DevicePermission(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_Tmpfs(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.mountOptions != null)
            for (const o of p.mountOptions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_TmpfsMountOption(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_DevicePermission(p) {
}
function _aws_cdk_aws_batch_alpha_TmpfsMountOption(p) {
}
function _aws_cdk_aws_batch_alpha_IManagedComputeEnvironment(p) {
}
function _aws_cdk_aws_batch_alpha_ManagedComputeEnvironmentProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_IManagedEc2EcsComputeEnvironment(p) {
}
function _aws_cdk_aws_batch_alpha_EcsMachineImage(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.imageType))
            _aws_cdk_aws_batch_alpha_EcsMachineImageType(p.imageType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_EksMachineImage(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.imageType))
            _aws_cdk_aws_batch_alpha_EksMachineImageType(p.imageType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_EcsMachineImageType(p) {
}
function _aws_cdk_aws_batch_alpha_EksMachineImageType(p) {
}
function _aws_cdk_aws_batch_alpha_AllocationStrategy(p) {
}
function _aws_cdk_aws_batch_alpha_ManagedEc2EcsComputeEnvironmentProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.allocationStrategy))
            _aws_cdk_aws_batch_alpha_AllocationStrategy(p.allocationStrategy);
        if (p.images != null)
            for (const o of p.images)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_EcsMachineImage(o);
        if (p.instanceClasses != null)
            for (const o of p.instanceClasses)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_InstanceClass(o);
        if (p.instanceTypes != null)
            for (const o of p.instanceTypes)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_InstanceType(o);
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_ManagedEc2EcsComputeEnvironment(p) {
}
function _aws_cdk_aws_batch_alpha_ManagedEc2EksComputeEnvironmentProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.allocationStrategy))
            _aws_cdk_aws_batch_alpha_AllocationStrategy(p.allocationStrategy);
        if (p.images != null)
            for (const o of p.images)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_EksMachineImage(o);
        if (p.instanceClasses != null)
            for (const o of p.instanceClasses)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_InstanceClass(o);
        if (p.instanceTypes != null)
            for (const o of p.instanceTypes)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_InstanceType(o);
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_ManagedEc2EksComputeEnvironment(p) {
}
function _aws_cdk_aws_batch_alpha_IFargateComputeEnvironment(p) {
}
function _aws_cdk_aws_batch_alpha_FargateComputeEnvironmentProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_FargateComputeEnvironment(p) {
}
function _aws_cdk_aws_batch_alpha_MultiNodeContainer(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.container))
            _aws_cdk_aws_batch_alpha_IEcsContainerDefinition(p.container);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_MultiNodeJobDefinitionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.containers != null)
            for (const o of p.containers)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_MultiNodeContainer(o);
        if (p.retryStrategies != null)
            for (const o of p.retryStrategies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_RetryStrategy(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_MultiNodeJobDefinition(p) {
}
function _aws_cdk_aws_batch_alpha_ISchedulingPolicy(p) {
}
function _aws_cdk_aws_batch_alpha_Share(p) {
}
function _aws_cdk_aws_batch_alpha_IFairshareSchedulingPolicy(p) {
}
function _aws_cdk_aws_batch_alpha_FairshareSchedulingPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.shares != null)
            for (const o of p.shares)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_batch_alpha_Share(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_batch_alpha_FairshareSchedulingPolicy(p) {
}
function _aws_cdk_aws_batch_alpha_IUnmanagedComputeEnvironment(p) {
}
function _aws_cdk_aws_batch_alpha_UnmanagedComputeEnvironmentProps(p) {
}
function _aws_cdk_aws_batch_alpha_UnmanagedComputeEnvironment(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_batch_alpha_IComputeEnvironment, _aws_cdk_aws_batch_alpha_ComputeEnvironmentProps, _aws_cdk_aws_batch_alpha_EcsJobDefinitionProps, _aws_cdk_aws_batch_alpha_EcsJobDefinition, _aws_cdk_aws_batch_alpha_IEksJobDefinition, _aws_cdk_aws_batch_alpha_EksJobDefinitionProps, _aws_cdk_aws_batch_alpha_DnsPolicy, _aws_cdk_aws_batch_alpha_EksJobDefinition, _aws_cdk_aws_batch_alpha_SecretVersionInfo, _aws_cdk_aws_batch_alpha_Secret, _aws_cdk_aws_batch_alpha_EcsVolumeOptions, _aws_cdk_aws_batch_alpha_EcsVolume, _aws_cdk_aws_batch_alpha_EfsVolumeOptions, _aws_cdk_aws_batch_alpha_EfsVolume, _aws_cdk_aws_batch_alpha_HostVolumeOptions, _aws_cdk_aws_batch_alpha_HostVolume, _aws_cdk_aws_batch_alpha_IEcsContainerDefinition, _aws_cdk_aws_batch_alpha_EcsContainerDefinitionProps, _aws_cdk_aws_batch_alpha_Ulimit, _aws_cdk_aws_batch_alpha_UlimitName, _aws_cdk_aws_batch_alpha_IEcsEc2ContainerDefinition, _aws_cdk_aws_batch_alpha_EcsEc2ContainerDefinitionProps, _aws_cdk_aws_batch_alpha_EcsEc2ContainerDefinition, _aws_cdk_aws_batch_alpha_IEcsFargateContainerDefinition, _aws_cdk_aws_batch_alpha_EcsFargateContainerDefinitionProps, _aws_cdk_aws_batch_alpha_EcsFargateContainerDefinition, _aws_cdk_aws_batch_alpha_IEksContainerDefinition, _aws_cdk_aws_batch_alpha_ImagePullPolicy, _aws_cdk_aws_batch_alpha_EksContainerDefinitionProps, _aws_cdk_aws_batch_alpha_EksContainerDefinition, _aws_cdk_aws_batch_alpha_EksVolumeOptions, _aws_cdk_aws_batch_alpha_EksVolume, _aws_cdk_aws_batch_alpha_EmptyDirVolumeOptions, _aws_cdk_aws_batch_alpha_EmptyDirMediumType, _aws_cdk_aws_batch_alpha_EmptyDirVolume, _aws_cdk_aws_batch_alpha_HostPathVolumeOptions, _aws_cdk_aws_batch_alpha_HostPathVolume, _aws_cdk_aws_batch_alpha_SecretPathVolumeOptions, _aws_cdk_aws_batch_alpha_SecretPathVolume, _aws_cdk_aws_batch_alpha_IJobDefinition, _aws_cdk_aws_batch_alpha_JobDefinitionProps, _aws_cdk_aws_batch_alpha_RetryStrategy, _aws_cdk_aws_batch_alpha_Action, _aws_cdk_aws_batch_alpha_CustomReason, _aws_cdk_aws_batch_alpha_Reason, _aws_cdk_aws_batch_alpha_IJobQueue, _aws_cdk_aws_batch_alpha_JobQueueProps, _aws_cdk_aws_batch_alpha_OrderedComputeEnvironment, _aws_cdk_aws_batch_alpha_JobQueue, _aws_cdk_aws_batch_alpha_LinuxParametersProps, _aws_cdk_aws_batch_alpha_LinuxParameters, _aws_cdk_aws_batch_alpha_Device, _aws_cdk_aws_batch_alpha_Tmpfs, _aws_cdk_aws_batch_alpha_DevicePermission, _aws_cdk_aws_batch_alpha_TmpfsMountOption, _aws_cdk_aws_batch_alpha_IManagedComputeEnvironment, _aws_cdk_aws_batch_alpha_ManagedComputeEnvironmentProps, _aws_cdk_aws_batch_alpha_IManagedEc2EcsComputeEnvironment, _aws_cdk_aws_batch_alpha_EcsMachineImage, _aws_cdk_aws_batch_alpha_EksMachineImage, _aws_cdk_aws_batch_alpha_EcsMachineImageType, _aws_cdk_aws_batch_alpha_EksMachineImageType, _aws_cdk_aws_batch_alpha_AllocationStrategy, _aws_cdk_aws_batch_alpha_ManagedEc2EcsComputeEnvironmentProps, _aws_cdk_aws_batch_alpha_ManagedEc2EcsComputeEnvironment, _aws_cdk_aws_batch_alpha_ManagedEc2EksComputeEnvironmentProps, _aws_cdk_aws_batch_alpha_ManagedEc2EksComputeEnvironment, _aws_cdk_aws_batch_alpha_IFargateComputeEnvironment, _aws_cdk_aws_batch_alpha_FargateComputeEnvironmentProps, _aws_cdk_aws_batch_alpha_FargateComputeEnvironment, _aws_cdk_aws_batch_alpha_MultiNodeContainer, _aws_cdk_aws_batch_alpha_MultiNodeJobDefinitionProps, _aws_cdk_aws_batch_alpha_MultiNodeJobDefinition, _aws_cdk_aws_batch_alpha_ISchedulingPolicy, _aws_cdk_aws_batch_alpha_Share, _aws_cdk_aws_batch_alpha_IFairshareSchedulingPolicy, _aws_cdk_aws_batch_alpha_FairshareSchedulingPolicyProps, _aws_cdk_aws_batch_alpha_FairshareSchedulingPolicy, _aws_cdk_aws_batch_alpha_IUnmanagedComputeEnvironment, _aws_cdk_aws_batch_alpha_UnmanagedComputeEnvironmentProps, _aws_cdk_aws_batch_alpha_UnmanagedComputeEnvironment };
