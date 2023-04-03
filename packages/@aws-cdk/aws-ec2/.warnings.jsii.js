function _aws_cdk_aws_ec2_InstanceRequireImdsv2AspectProps(p) {
}
function _aws_cdk_aws_ec2_InstanceRequireImdsv2Aspect(p) {
}
function _aws_cdk_aws_ec2_LaunchTemplateRequireImdsv2AspectProps(p) {
}
function _aws_cdk_aws_ec2_LaunchTemplateRequireImdsv2Aspect(p) {
}
function _aws_cdk_aws_ec2_BastionHostLinuxProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.vpc))
            _aws_cdk_aws_ec2_IVpc(p.vpc);
        if (p.blockDevices != null)
            for (const o of p.blockDevices)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_BlockDevice(o);
        if (!visitedObjects.has(p.init))
            _aws_cdk_aws_ec2_CloudFormationInit(p.init);
        if (!visitedObjects.has(p.initOptions))
            _aws_cdk_aws_ec2_ApplyCloudFormationInitOptions(p.initOptions);
        if (!visitedObjects.has(p.instanceType))
            _aws_cdk_aws_ec2_InstanceType(p.instanceType);
        if (!visitedObjects.has(p.machineImage))
            _aws_cdk_aws_ec2_IMachineImage(p.machineImage);
        if (!visitedObjects.has(p.securityGroup))
            _aws_cdk_aws_ec2_ISecurityGroup(p.securityGroup);
        if (!visitedObjects.has(p.subnetSelection))
            _aws_cdk_aws_ec2_SubnetSelection(p.subnetSelection);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_BastionHostLinux(p) {
}
function _aws_cdk_aws_ec2_IConnectable(p) {
}
function _aws_cdk_aws_ec2_ConnectionsProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.defaultPort))
            _aws_cdk_aws_ec2_Port(p.defaultPort);
        if (!visitedObjects.has(p.peer))
            _aws_cdk_aws_ec2_IPeer(p.peer);
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_Connections(p) {
}
function _aws_cdk_aws_ec2_CloudFormationInit(p) {
}
function _aws_cdk_aws_ec2_InitConfig(p) {
}
function _aws_cdk_aws_ec2_ConfigSetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.configs != null)
            for (const o of Object.values(p.configs))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_InitConfig(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_AttachInitOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.platform))
            _aws_cdk_aws_ec2_OperatingSystemType(p.platform);
        if (!visitedObjects.has(p.userData))
            _aws_cdk_aws_ec2_UserData(p.userData);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_InitServiceRestartHandle(p) {
}
function _aws_cdk_aws_ec2_InitElement(p) {
}
function _aws_cdk_aws_ec2_InitCommandOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.serviceRestartHandles != null)
            for (const o of p.serviceRestartHandles)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_InitServiceRestartHandle(o);
        if (!visitedObjects.has(p.waitAfterCompletion))
            _aws_cdk_aws_ec2_InitCommandWaitDuration(p.waitAfterCompletion);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_InitCommandWaitDuration(p) {
}
function _aws_cdk_aws_ec2_InitCommand(p) {
}
function _aws_cdk_aws_ec2_InitFileOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.serviceRestartHandles != null)
            for (const o of p.serviceRestartHandles)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_InitServiceRestartHandle(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_InitFileAssetOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.serviceRestartHandles != null)
            for (const o of p.serviceRestartHandles)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_InitServiceRestartHandle(o);
        if (p.readers != null)
            for (const o of p.readers)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-iam/.warnings.jsii.js")._aws_cdk_aws_iam_IGrantable(o);
        if ("sourceHash" in p)
            print("@aws-cdk/aws-s3-assets.AssetOptions#sourceHash", "see `assetHash` and `assetHashType`");
        if ("follow" in p)
            print("@aws-cdk/assets.CopyOptions#follow", "use `followSymlinks` instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_InitFile(p) {
}
function _aws_cdk_aws_ec2_InitGroup(p) {
}
function _aws_cdk_aws_ec2_InitUserOptions(p) {
}
function _aws_cdk_aws_ec2_InitUser(p) {
}
function _aws_cdk_aws_ec2_LocationPackageOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.serviceRestartHandles != null)
            for (const o of p.serviceRestartHandles)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_InitServiceRestartHandle(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_NamedPackageOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.serviceRestartHandles != null)
            for (const o of p.serviceRestartHandles)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_InitServiceRestartHandle(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_InitPackage(p) {
}
function _aws_cdk_aws_ec2_InitServiceOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.serviceManager))
            _aws_cdk_aws_ec2_ServiceManager(p.serviceManager);
        if (!visitedObjects.has(p.serviceRestartHandle))
            _aws_cdk_aws_ec2_InitServiceRestartHandle(p.serviceRestartHandle);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_InitService(p) {
}
function _aws_cdk_aws_ec2_InitSourceOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.serviceRestartHandles != null)
            for (const o of p.serviceRestartHandles)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_InitServiceRestartHandle(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_InitSourceAssetOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.serviceRestartHandles != null)
            for (const o of p.serviceRestartHandles)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_InitServiceRestartHandle(o);
        if (p.readers != null)
            for (const o of p.readers)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-iam/.warnings.jsii.js")._aws_cdk_aws_iam_IGrantable(o);
        if ("sourceHash" in p)
            print("@aws-cdk/aws-s3-assets.AssetOptions#sourceHash", "see `assetHash` and `assetHashType`");
        if ("follow" in p)
            print("@aws-cdk/assets.CopyOptions#follow", "use `followSymlinks` instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_InitSource(p) {
}
function _aws_cdk_aws_ec2_ServiceManager(p) {
}
function _aws_cdk_aws_ec2_SystemdConfigFileOptions(p) {
}
function _aws_cdk_aws_ec2_InstanceClass(p) {
}
function _aws_cdk_aws_ec2_InstanceArchitecture(p) {
}
function _aws_cdk_aws_ec2_InstanceSize(p) {
}
function _aws_cdk_aws_ec2_InstanceType(p) {
}
function _aws_cdk_aws_ec2_IInstance(p) {
}
function _aws_cdk_aws_ec2_InstanceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.instanceType))
            _aws_cdk_aws_ec2_InstanceType(p.instanceType);
        if (!visitedObjects.has(p.machineImage))
            _aws_cdk_aws_ec2_IMachineImage(p.machineImage);
        if (!visitedObjects.has(p.vpc))
            _aws_cdk_aws_ec2_IVpc(p.vpc);
        if (p.blockDevices != null)
            for (const o of p.blockDevices)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_BlockDevice(o);
        if (!visitedObjects.has(p.init))
            _aws_cdk_aws_ec2_CloudFormationInit(p.init);
        if (!visitedObjects.has(p.initOptions))
            _aws_cdk_aws_ec2_ApplyCloudFormationInitOptions(p.initOptions);
        if (!visitedObjects.has(p.securityGroup))
            _aws_cdk_aws_ec2_ISecurityGroup(p.securityGroup);
        if (!visitedObjects.has(p.userData))
            _aws_cdk_aws_ec2_UserData(p.userData);
        if (!visitedObjects.has(p.vpcSubnets))
            _aws_cdk_aws_ec2_SubnetSelection(p.vpcSubnets);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_Instance(p) {
}
function _aws_cdk_aws_ec2_ApplyCloudFormationInitOptions(p) {
}
function _aws_cdk_aws_ec2_CpuCredits(p) {
}
function _aws_cdk_aws_ec2_InstanceInitiatedShutdownBehavior(p) {
}
function _aws_cdk_aws_ec2_ILaunchTemplate(p) {
}
function _aws_cdk_aws_ec2_SpotInstanceInterruption(p) {
}
function _aws_cdk_aws_ec2_SpotRequestType(p) {
}
function _aws_cdk_aws_ec2_LaunchTemplateSpotOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.interruptionBehavior))
            _aws_cdk_aws_ec2_SpotInstanceInterruption(p.interruptionBehavior);
        if (!visitedObjects.has(p.requestType))
            _aws_cdk_aws_ec2_SpotRequestType(p.requestType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_LaunchTemplateHttpTokens(p) {
}
function _aws_cdk_aws_ec2_LaunchTemplateProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.blockDevices != null)
            for (const o of p.blockDevices)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_BlockDevice(o);
        if (!visitedObjects.has(p.cpuCredits))
            _aws_cdk_aws_ec2_CpuCredits(p.cpuCredits);
        if (!visitedObjects.has(p.httpTokens))
            _aws_cdk_aws_ec2_LaunchTemplateHttpTokens(p.httpTokens);
        if (!visitedObjects.has(p.instanceInitiatedShutdownBehavior))
            _aws_cdk_aws_ec2_InstanceInitiatedShutdownBehavior(p.instanceInitiatedShutdownBehavior);
        if (!visitedObjects.has(p.instanceType))
            _aws_cdk_aws_ec2_InstanceType(p.instanceType);
        if (!visitedObjects.has(p.machineImage))
            _aws_cdk_aws_ec2_IMachineImage(p.machineImage);
        if (!visitedObjects.has(p.securityGroup))
            _aws_cdk_aws_ec2_ISecurityGroup(p.securityGroup);
        if (!visitedObjects.has(p.spotOptions))
            _aws_cdk_aws_ec2_LaunchTemplateSpotOptions(p.spotOptions);
        if (!visitedObjects.has(p.userData))
            _aws_cdk_aws_ec2_UserData(p.userData);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_LaunchTemplateSpecialVersions(p) {
}
function _aws_cdk_aws_ec2_LaunchTemplateAttributes(p) {
}
function _aws_cdk_aws_ec2_LaunchTemplate(p) {
}
function _aws_cdk_aws_ec2_IMachineImage(p) {
}
function _aws_cdk_aws_ec2_MachineImage(p) {
}
function _aws_cdk_aws_ec2_MachineImageConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.osType))
            _aws_cdk_aws_ec2_OperatingSystemType(p.osType);
        if (!visitedObjects.has(p.userData))
            _aws_cdk_aws_ec2_UserData(p.userData);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_GenericSSMParameterImage(p) {
}
function _aws_cdk_aws_ec2_SsmParameterImageOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.os))
            _aws_cdk_aws_ec2_OperatingSystemType(p.os);
        if (!visitedObjects.has(p.userData))
            _aws_cdk_aws_ec2_UserData(p.userData);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_WindowsImageProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.userData))
            _aws_cdk_aws_ec2_UserData(p.userData);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_WindowsImage(p) {
}
function _aws_cdk_aws_ec2_AmazonLinuxCpuType(p) {
}
function _aws_cdk_aws_ec2_AmazonLinuxImageProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cpuType))
            _aws_cdk_aws_ec2_AmazonLinuxCpuType(p.cpuType);
        if (!visitedObjects.has(p.edition))
            _aws_cdk_aws_ec2_AmazonLinuxEdition(p.edition);
        if (!visitedObjects.has(p.generation))
            _aws_cdk_aws_ec2_AmazonLinuxGeneration(p.generation);
        if (!visitedObjects.has(p.kernel))
            _aws_cdk_aws_ec2_AmazonLinuxKernel(p.kernel);
        if (!visitedObjects.has(p.storage))
            _aws_cdk_aws_ec2_AmazonLinuxStorage(p.storage);
        if (!visitedObjects.has(p.userData))
            _aws_cdk_aws_ec2_UserData(p.userData);
        if (!visitedObjects.has(p.virtualization))
            _aws_cdk_aws_ec2_AmazonLinuxVirt(p.virtualization);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_AmazonLinuxImage(p) {
}
function _aws_cdk_aws_ec2_AmazonLinuxGeneration(p) {
}
function _aws_cdk_aws_ec2_AmazonLinuxKernel(p) {
}
function _aws_cdk_aws_ec2_AmazonLinuxEdition(p) {
}
function _aws_cdk_aws_ec2_AmazonLinuxVirt(p) {
}
function _aws_cdk_aws_ec2_AmazonLinuxStorage(p) {
}
function _aws_cdk_aws_ec2_GenericLinuxImageProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.userData))
            _aws_cdk_aws_ec2_UserData(p.userData);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_GenericWindowsImageProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.userData))
            _aws_cdk_aws_ec2_UserData(p.userData);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_GenericLinuxImage(p) {
}
function _aws_cdk_aws_ec2_GenericWindowsImage(p) {
}
function _aws_cdk_aws_ec2_OperatingSystemType(p) {
}
function _aws_cdk_aws_ec2_LookupMachineImage(p) {
}
function _aws_cdk_aws_ec2_LookupMachineImageProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.userData))
            _aws_cdk_aws_ec2_UserData(p.userData);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_NatTrafficDirection(p) {
}
function _aws_cdk_aws_ec2_GatewayConfig(p) {
}
function _aws_cdk_aws_ec2_NatProvider(p) {
}
function _aws_cdk_aws_ec2_ConfigureNatOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.natSubnets != null)
            for (const o of p.natSubnets)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_PublicSubnet(o);
        if (p.privateSubnets != null)
            for (const o of p.privateSubnets)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_PrivateSubnet(o);
        if (!visitedObjects.has(p.vpc))
            _aws_cdk_aws_ec2_Vpc(p.vpc);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_NatGatewayProps(p) {
}
function _aws_cdk_aws_ec2_NatInstanceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.instanceType))
            _aws_cdk_aws_ec2_InstanceType(p.instanceType);
        if ("allowAllTraffic" in p)
            print("@aws-cdk/aws-ec2.NatInstanceProps#allowAllTraffic", "- Use `defaultAllowedTraffic`.");
        if (!visitedObjects.has(p.defaultAllowedTraffic))
            _aws_cdk_aws_ec2_NatTrafficDirection(p.defaultAllowedTraffic);
        if (!visitedObjects.has(p.machineImage))
            _aws_cdk_aws_ec2_IMachineImage(p.machineImage);
        if (!visitedObjects.has(p.securityGroup))
            _aws_cdk_aws_ec2_ISecurityGroup(p.securityGroup);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_NatInstanceProvider(p) {
}
function _aws_cdk_aws_ec2_NatInstanceImage(p) {
}
function _aws_cdk_aws_ec2_INetworkAcl(p) {
}
function _aws_cdk_aws_ec2_NetworkAclProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.vpc))
            _aws_cdk_aws_ec2_IVpc(p.vpc);
        if (!visitedObjects.has(p.subnetSelection))
            _aws_cdk_aws_ec2_SubnetSelection(p.subnetSelection);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_NetworkAcl(p) {
}
function _aws_cdk_aws_ec2_Action(p) {
}
function _aws_cdk_aws_ec2_INetworkAclEntry(p) {
}
function _aws_cdk_aws_ec2_TrafficDirection(p) {
}
function _aws_cdk_aws_ec2_CommonNetworkAclEntryOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cidr))
            _aws_cdk_aws_ec2_AclCidr(p.cidr);
        if (!visitedObjects.has(p.traffic))
            _aws_cdk_aws_ec2_AclTraffic(p.traffic);
        if (!visitedObjects.has(p.direction))
            _aws_cdk_aws_ec2_TrafficDirection(p.direction);
        if (!visitedObjects.has(p.ruleAction))
            _aws_cdk_aws_ec2_Action(p.ruleAction);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_NetworkAclEntryProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.networkAcl))
            _aws_cdk_aws_ec2_INetworkAcl(p.networkAcl);
        if (!visitedObjects.has(p.cidr))
            _aws_cdk_aws_ec2_AclCidr(p.cidr);
        if (!visitedObjects.has(p.traffic))
            _aws_cdk_aws_ec2_AclTraffic(p.traffic);
        if (!visitedObjects.has(p.direction))
            _aws_cdk_aws_ec2_TrafficDirection(p.direction);
        if (!visitedObjects.has(p.ruleAction))
            _aws_cdk_aws_ec2_Action(p.ruleAction);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_NetworkAclEntry(p) {
}
function _aws_cdk_aws_ec2_ISubnetNetworkAclAssociation(p) {
}
function _aws_cdk_aws_ec2_SubnetNetworkAclAssociationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.networkAcl))
            _aws_cdk_aws_ec2_INetworkAcl(p.networkAcl);
        if (!visitedObjects.has(p.subnet))
            _aws_cdk_aws_ec2_ISubnet(p.subnet);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_SubnetNetworkAclAssociation(p) {
}
function _aws_cdk_aws_ec2_AclCidr(p) {
}
function _aws_cdk_aws_ec2_AclCidrConfig(p) {
}
function _aws_cdk_aws_ec2_AclTraffic(p) {
}
function _aws_cdk_aws_ec2_AclTrafficConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.icmp))
            _aws_cdk_aws_ec2_AclIcmp(p.icmp);
        if (!visitedObjects.has(p.portRange))
            _aws_cdk_aws_ec2_AclPortRange(p.portRange);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_AclIcmp(p) {
}
function _aws_cdk_aws_ec2_AclPortRange(p) {
}
function _aws_cdk_aws_ec2_Protocol(p) {
}
function _aws_cdk_aws_ec2_PortProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.protocol))
            _aws_cdk_aws_ec2_Protocol(p.protocol);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_Port(p) {
}
function _aws_cdk_aws_ec2_ISecurityGroup(p) {
}
function _aws_cdk_aws_ec2_RuleScope(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.scope))
            _aws_cdk_aws_ec2_ISecurityGroup(p.scope);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_SecurityGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.vpc))
            _aws_cdk_aws_ec2_IVpc(p.vpc);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_SecurityGroupImportOptions(p) {
}
function _aws_cdk_aws_ec2_SecurityGroup(p) {
}
function _aws_cdk_aws_ec2_ConnectionRule(p) {
}
function _aws_cdk_aws_ec2_SubnetFilter(p) {
}
function _aws_cdk_aws_ec2_IPeer(p) {
}
function _aws_cdk_aws_ec2_Peer(p) {
}
function _aws_cdk_aws_ec2_IPrefixList(p) {
}
function _aws_cdk_aws_ec2_AddressFamily(p) {
}
function _aws_cdk_aws_ec2_PrefixListOptions(p) {
}
function _aws_cdk_aws_ec2_PrefixListProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.addressFamily))
            _aws_cdk_aws_ec2_AddressFamily(p.addressFamily);
        if (p.entries != null)
            for (const o of p.entries)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_CfnPrefixList_EntryProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_PrefixList(p) {
}
function _aws_cdk_aws_ec2_BlockDevice(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.volume))
            _aws_cdk_aws_ec2_BlockDeviceVolume(p.volume);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_EbsDeviceOptionsBase(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.volumeType))
            _aws_cdk_aws_ec2_EbsDeviceVolumeType(p.volumeType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_EbsDeviceOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.volumeType))
            _aws_cdk_aws_ec2_EbsDeviceVolumeType(p.volumeType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_EbsDeviceSnapshotOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.volumeType))
            _aws_cdk_aws_ec2_EbsDeviceVolumeType(p.volumeType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_EbsDeviceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.volumeType))
            _aws_cdk_aws_ec2_EbsDeviceVolumeType(p.volumeType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_BlockDeviceVolume(p) {
}
function _aws_cdk_aws_ec2_EbsDeviceVolumeType(p) {
}
function _aws_cdk_aws_ec2_IVolume(p) {
}
function _aws_cdk_aws_ec2_VolumeProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.volumeType))
            _aws_cdk_aws_ec2_EbsDeviceVolumeType(p.volumeType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_VolumeAttributes(p) {
}
function _aws_cdk_aws_ec2_Volume(p) {
}
function _aws_cdk_aws_ec2_ISubnet(p) {
}
function _aws_cdk_aws_ec2_IRouteTable(p) {
}
function _aws_cdk_aws_ec2_IVpc(p) {
}
function _aws_cdk_aws_ec2_SubnetType(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        const ns = require("./lib/vpc.js");
        if (Object.values(ns.SubnetType).filter(x => x === p).length > 1)
            return;
        if (p === ns.SubnetType.ISOLATED)
            print("@aws-cdk/aws-ec2.SubnetType#ISOLATED", "use `SubnetType.PRIVATE_ISOLATED`");
        if (p === ns.SubnetType.PRIVATE_WITH_NAT)
            print("@aws-cdk/aws-ec2.SubnetType#PRIVATE_WITH_NAT", "use `PRIVATE_WITH_EGRESS`");
        if (p === ns.SubnetType.PRIVATE)
            print("@aws-cdk/aws-ec2.SubnetType#PRIVATE", "use `PRIVATE_WITH_EGRESS`");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_SubnetSelection(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.subnetFilters != null)
            for (const o of p.subnetFilters)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_SubnetFilter(o);
        if ("subnetName" in p)
            print("@aws-cdk/aws-ec2.SubnetSelection#subnetName", "Use `subnetGroupName` instead");
        if (p.subnets != null)
            for (const o of p.subnets)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_ISubnet(o);
        if (!visitedObjects.has(p.subnetType))
            _aws_cdk_aws_ec2_SubnetType(p.subnetType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_SelectedSubnets(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.subnets != null)
            for (const o of p.subnets)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_ISubnet(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_VpcAttributes(p) {
}
function _aws_cdk_aws_ec2_SubnetAttributes(p) {
}
function _aws_cdk_aws_ec2_VpcProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("cidr" in p)
            print("@aws-cdk/aws-ec2.VpcProps#cidr", "Use ipAddresses instead");
        if (!visitedObjects.has(p.defaultInstanceTenancy))
            _aws_cdk_aws_ec2_DefaultInstanceTenancy(p.defaultInstanceTenancy);
        if (p.flowLogs != null)
            for (const o of Object.values(p.flowLogs))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_FlowLogOptions(o);
        if (p.gatewayEndpoints != null)
            for (const o of Object.values(p.gatewayEndpoints))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_GatewayVpcEndpointOptions(o);
        if (!visitedObjects.has(p.ipAddresses))
            _aws_cdk_aws_ec2_IIpAddresses(p.ipAddresses);
        if (!visitedObjects.has(p.natGatewayProvider))
            _aws_cdk_aws_ec2_NatProvider(p.natGatewayProvider);
        if (!visitedObjects.has(p.natGatewaySubnets))
            _aws_cdk_aws_ec2_SubnetSelection(p.natGatewaySubnets);
        if (p.subnetConfiguration != null)
            for (const o of p.subnetConfiguration)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_SubnetConfiguration(o);
        if (p.vpnConnections != null)
            for (const o of Object.values(p.vpnConnections))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_VpnConnectionOptions(o);
        if (p.vpnRoutePropagation != null)
            for (const o of p.vpnRoutePropagation)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_SubnetSelection(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_DefaultInstanceTenancy(p) {
}
function _aws_cdk_aws_ec2_SubnetConfiguration(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.subnetType))
            _aws_cdk_aws_ec2_SubnetType(p.subnetType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_Vpc(p) {
}
function _aws_cdk_aws_ec2_SubnetProps(p) {
}
function _aws_cdk_aws_ec2_Subnet(p) {
}
function _aws_cdk_aws_ec2_AddRouteOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.routerType))
            _aws_cdk_aws_ec2_RouterType(p.routerType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_RouterType(p) {
}
function _aws_cdk_aws_ec2_PublicSubnetProps(p) {
}
function _aws_cdk_aws_ec2_IPublicSubnet(p) {
}
function _aws_cdk_aws_ec2_PublicSubnetAttributes(p) {
}
function _aws_cdk_aws_ec2_PublicSubnet(p) {
}
function _aws_cdk_aws_ec2_PrivateSubnetProps(p) {
}
function _aws_cdk_aws_ec2_IPrivateSubnet(p) {
}
function _aws_cdk_aws_ec2_PrivateSubnetAttributes(p) {
}
function _aws_cdk_aws_ec2_PrivateSubnet(p) {
}
function _aws_cdk_aws_ec2_VpcLookupOptions(p) {
}
function _aws_cdk_aws_ec2_IVpnConnection(p) {
}
function _aws_cdk_aws_ec2_IVpnGateway(p) {
}
function _aws_cdk_aws_ec2_VpnTunnelOption(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("preSharedKey" in p)
            print("@aws-cdk/aws-ec2.VpnTunnelOption#preSharedKey", "Use `preSharedKeySecret` instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_VpnConnectionOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tunnelOptions != null)
            for (const o of p.tunnelOptions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_VpnTunnelOption(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_VpnGatewayProps(p) {
}
function _aws_cdk_aws_ec2_EnableVpnGatewayOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.vpnRoutePropagation != null)
            for (const o of p.vpnRoutePropagation)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_SubnetSelection(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_VpnConnectionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.vpc))
            _aws_cdk_aws_ec2_IVpc(p.vpc);
        if (p.tunnelOptions != null)
            for (const o of p.tunnelOptions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_VpnTunnelOption(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_VpnConnectionType(p) {
}
function _aws_cdk_aws_ec2_VpnGateway(p) {
}
function _aws_cdk_aws_ec2_VpnConnectionAttributes(p) {
}
function _aws_cdk_aws_ec2_VpnConnectionBase(p) {
}
function _aws_cdk_aws_ec2_VpnConnection(p) {
}
function _aws_cdk_aws_ec2_IVpcEndpoint(p) {
}
function _aws_cdk_aws_ec2_VpcEndpoint(p) {
}
function _aws_cdk_aws_ec2_IGatewayVpcEndpoint(p) {
}
function _aws_cdk_aws_ec2_VpcEndpointType(p) {
}
function _aws_cdk_aws_ec2_IGatewayVpcEndpointService(p) {
}
function _aws_cdk_aws_ec2_GatewayVpcEndpointAwsService(p) {
}
function _aws_cdk_aws_ec2_GatewayVpcEndpointOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.service))
            _aws_cdk_aws_ec2_IGatewayVpcEndpointService(p.service);
        if (p.subnets != null)
            for (const o of p.subnets)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_SubnetSelection(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_GatewayVpcEndpointProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.vpc))
            _aws_cdk_aws_ec2_IVpc(p.vpc);
        if (!visitedObjects.has(p.service))
            _aws_cdk_aws_ec2_IGatewayVpcEndpointService(p.service);
        if (p.subnets != null)
            for (const o of p.subnets)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_SubnetSelection(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_GatewayVpcEndpoint(p) {
}
function _aws_cdk_aws_ec2_IInterfaceVpcEndpointService(p) {
}
function _aws_cdk_aws_ec2_InterfaceVpcEndpointService(p) {
}
function _aws_cdk_aws_ec2_InterfaceVpcEndpointAwsService(p) {
}
function _aws_cdk_aws_ec2_InterfaceVpcEndpointOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.service))
            _aws_cdk_aws_ec2_IInterfaceVpcEndpointService(p.service);
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_ISecurityGroup(o);
        if (!visitedObjects.has(p.subnets))
            _aws_cdk_aws_ec2_SubnetSelection(p.subnets);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_InterfaceVpcEndpointProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.vpc))
            _aws_cdk_aws_ec2_IVpc(p.vpc);
        if (!visitedObjects.has(p.service))
            _aws_cdk_aws_ec2_IInterfaceVpcEndpointService(p.service);
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_ISecurityGroup(o);
        if (!visitedObjects.has(p.subnets))
            _aws_cdk_aws_ec2_SubnetSelection(p.subnets);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_IInterfaceVpcEndpoint(p) {
}
function _aws_cdk_aws_ec2_InterfaceVpcEndpoint(p) {
}
function _aws_cdk_aws_ec2_InterfaceVpcEndpointAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("securityGroupId" in p)
            print("@aws-cdk/aws-ec2.InterfaceVpcEndpointAttributes#securityGroupId", "use `securityGroups` instead");
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_IVpcEndpointServiceLoadBalancer(p) {
}
function _aws_cdk_aws_ec2_IVpcEndpointService(p) {
}
function _aws_cdk_aws_ec2_VpcEndpointService(p) {
}
function _aws_cdk_aws_ec2_VpcEndpointServiceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.vpcEndpointServiceLoadBalancers != null)
            for (const o of p.vpcEndpointServiceLoadBalancers)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_IVpcEndpointServiceLoadBalancer(o);
        if (p.allowedPrincipals != null)
            for (const o of p.allowedPrincipals)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-iam/.warnings.jsii.js")._aws_cdk_aws_iam_ArnPrincipal(o);
        if ("vpcEndpointServiceName" in p)
            print("@aws-cdk/aws-ec2.VpcEndpointServiceProps#vpcEndpointServiceName", "This property is not used");
        if ("whitelistedPrincipals" in p)
            print("@aws-cdk/aws-ec2.VpcEndpointServiceProps#whitelistedPrincipals", "use `allowedPrincipals`");
        if (p.whitelistedPrincipals != null)
            for (const o of p.whitelistedPrincipals)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-iam/.warnings.jsii.js")._aws_cdk_aws_iam_ArnPrincipal(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_LinuxUserDataOptions(p) {
}
function _aws_cdk_aws_ec2_WindowsUserDataOptions(p) {
}
function _aws_cdk_aws_ec2_S3DownloadOptions(p) {
}
function _aws_cdk_aws_ec2_ExecuteFileOptions(p) {
}
function _aws_cdk_aws_ec2_UserData(p) {
}
function _aws_cdk_aws_ec2_MultipartBodyOptions(p) {
}
function _aws_cdk_aws_ec2_MultipartBody(p) {
}
function _aws_cdk_aws_ec2_MultipartUserDataOptions(p) {
}
function _aws_cdk_aws_ec2_MultipartUserData(p) {
}
function _aws_cdk_aws_ec2_WindowsVersion(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        const ns = require("./lib/windows-versions.js");
        if (Object.values(ns.WindowsVersion).filter(x => x === p).length > 1)
            return;
        if (p === ns.WindowsVersion.WINDOWS_SERVER_2016_GERMAL_FULL_BASE)
            print("@aws-cdk/aws-ec2.WindowsVersion#WINDOWS_SERVER_2016_GERMAL_FULL_BASE", "- use WINDOWS_SERVER_2016_GERMAN_FULL_BASE");
        if (p === ns.WindowsVersion.WINDOWS_SERVER_2012_R2_SP1_PORTUGESE_BRAZIL_64BIT_CORE)
            print("@aws-cdk/aws-ec2.WindowsVersion#WINDOWS_SERVER_2012_R2_SP1_PORTUGESE_BRAZIL_64BIT_CORE", "- use WINDOWS_SERVER_2012_R2_SP1_PORTUGUESE_BRAZIL_64BIT_CORE");
        if (p === ns.WindowsVersion.WINDOWS_SERVER_2016_PORTUGESE_PORTUGAL_FULL_BASE)
            print("@aws-cdk/aws-ec2.WindowsVersion#WINDOWS_SERVER_2016_PORTUGESE_PORTUGAL_FULL_BASE", "- use WINDOWS_SERVER_2016_PORTUGUESE_PORTUGAL_FULL_BASE");
        if (p === ns.WindowsVersion.WINDOWS_SERVER_2012_R2_RTM_PORTUGESE_BRAZIL_64BIT_BASE)
            print("@aws-cdk/aws-ec2.WindowsVersion#WINDOWS_SERVER_2012_R2_RTM_PORTUGESE_BRAZIL_64BIT_BASE", "- use WINDOWS_SERVER_2012_R2_RTM_PORTUGUESE_BRAZIL_64BIT_BASE");
        if (p === ns.WindowsVersion.WINDOWS_SERVER_2012_R2_RTM_PORTUGESE_PORTUGAL_64BIT_BASE)
            print("@aws-cdk/aws-ec2.WindowsVersion#WINDOWS_SERVER_2012_R2_RTM_PORTUGESE_PORTUGAL_64BIT_BASE", "- use WINDOWS_SERVER_2012_R2_RTM_PORTUGUESE_PORTUGAL_64BIT_BASE");
        if (p === ns.WindowsVersion.WINDOWS_SERVER_2016_PORTUGESE_BRAZIL_FULL_BASE)
            print("@aws-cdk/aws-ec2.WindowsVersion#WINDOWS_SERVER_2016_PORTUGESE_BRAZIL_FULL_BASE", "- use WINDOWS_SERVER_2016_PORTUGUESE_BRAZIL_FULL_BASE");
        if (p === ns.WindowsVersion.WINDOWS_SERVER_2012_SP2_PORTUGESE_BRAZIL_64BIT_BASE)
            print("@aws-cdk/aws-ec2.WindowsVersion#WINDOWS_SERVER_2012_SP2_PORTUGESE_BRAZIL_64BIT_BASE", "- use WINDOWS_SERVER_2012_SP2_PORTUGUESE_BRAZIL_64BIT_BASE");
        if (p === ns.WindowsVersion.WINDOWS_SERVER_2012_RTM_PORTUGESE_BRAZIL_64BIT_BASE)
            print("@aws-cdk/aws-ec2.WindowsVersion#WINDOWS_SERVER_2012_RTM_PORTUGESE_BRAZIL_64BIT_BASE", "- use WINDOWS_SERVER_2012_RTM_PORTUGUESE_BRAZIL_64BIT_BASE");
        if (p === ns.WindowsVersion.WINDOWS_SERVER_2008_R2_SP1_PORTUGESE_BRAZIL_64BIT_BASE)
            print("@aws-cdk/aws-ec2.WindowsVersion#WINDOWS_SERVER_2008_R2_SP1_PORTUGESE_BRAZIL_64BIT_BASE", "- use WINDOWS_SERVER_2008_R2_SP1_PORTUGUESE_BRAZIL_64BIT_BASE");
        if (p === ns.WindowsVersion.WINDOWS_SERVER_2008_SP2_PORTUGESE_BRAZIL_32BIT_BASE)
            print("@aws-cdk/aws-ec2.WindowsVersion#WINDOWS_SERVER_2008_SP2_PORTUGESE_BRAZIL_32BIT_BASE", "- use WINDOWS_SERVER_2008_SP2_PORTUGUESE_BRAZIL_32BIT_BASE");
        if (p === ns.WindowsVersion.WINDOWS_SERVER_2012_RTM_PORTUGESE_PORTUGAL_64BIT_BASE)
            print("@aws-cdk/aws-ec2.WindowsVersion#WINDOWS_SERVER_2012_RTM_PORTUGESE_PORTUGAL_64BIT_BASE", "- use WINDOWS_SERVER_2012_RTM_PORTUGUESE_PORTUGAL_64BIT_BASE");
        if (p === ns.WindowsVersion.WINDOWS_SERVER_2019_PORTUGESE_BRAZIL_FULL_BASE)
            print("@aws-cdk/aws-ec2.WindowsVersion#WINDOWS_SERVER_2019_PORTUGESE_BRAZIL_FULL_BASE", "- use WINDOWS_SERVER_2019_PORTUGUESE_BRAZIL_FULL_BASE");
        if (p === ns.WindowsVersion.WINDOWS_SERVER_2019_PORTUGESE_PORTUGAL_FULL_BASE)
            print("@aws-cdk/aws-ec2.WindowsVersion#WINDOWS_SERVER_2019_PORTUGESE_PORTUGAL_FULL_BASE", "- use WINDOWS_SERVER_2019_PORTUGUESE_PORTUGAL_FULL_BASE");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_IFlowLog(p) {
}
function _aws_cdk_aws_ec2_FlowLogTrafficType(p) {
}
function _aws_cdk_aws_ec2_FlowLogDestinationType(p) {
}
function _aws_cdk_aws_ec2_FlowLogResourceType(p) {
}
function _aws_cdk_aws_ec2_FlowLogFileFormat(p) {
}
function _aws_cdk_aws_ec2_S3DestinationOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.fileFormat))
            _aws_cdk_aws_ec2_FlowLogFileFormat(p.fileFormat);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_DestinationOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.fileFormat))
            _aws_cdk_aws_ec2_FlowLogFileFormat(p.fileFormat);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_FlowLogDestination(p) {
}
function _aws_cdk_aws_ec2_FlowLogDestinationConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.logDestinationType))
            _aws_cdk_aws_ec2_FlowLogDestinationType(p.logDestinationType);
        if (!visitedObjects.has(p.destinationOptions))
            _aws_cdk_aws_ec2_DestinationOptions(p.destinationOptions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_FlowLogMaxAggregationInterval(p) {
}
function _aws_cdk_aws_ec2_LogFormat(p) {
}
function _aws_cdk_aws_ec2_FlowLogOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.destination))
            _aws_cdk_aws_ec2_FlowLogDestination(p.destination);
        if (p.logFormat != null)
            for (const o of p.logFormat)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_LogFormat(o);
        if (!visitedObjects.has(p.maxAggregationInterval))
            _aws_cdk_aws_ec2_FlowLogMaxAggregationInterval(p.maxAggregationInterval);
        if (!visitedObjects.has(p.trafficType))
            _aws_cdk_aws_ec2_FlowLogTrafficType(p.trafficType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_FlowLogProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.resourceType))
            _aws_cdk_aws_ec2_FlowLogResourceType(p.resourceType);
        if (!visitedObjects.has(p.destination))
            _aws_cdk_aws_ec2_FlowLogDestination(p.destination);
        if (p.logFormat != null)
            for (const o of p.logFormat)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_LogFormat(o);
        if (!visitedObjects.has(p.maxAggregationInterval))
            _aws_cdk_aws_ec2_FlowLogMaxAggregationInterval(p.maxAggregationInterval);
        if (!visitedObjects.has(p.trafficType))
            _aws_cdk_aws_ec2_FlowLogTrafficType(p.trafficType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_FlowLog(p) {
}
function _aws_cdk_aws_ec2_IClientVpnEndpoint(p) {
}
function _aws_cdk_aws_ec2_IClientVpnConnectionHandler(p) {
}
function _aws_cdk_aws_ec2_TransportProtocol(p) {
}
function _aws_cdk_aws_ec2_VpnPort(p) {
}
function _aws_cdk_aws_ec2_ClientVpnEndpointOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.clientConnectionHandler))
            _aws_cdk_aws_ec2_IClientVpnConnectionHandler(p.clientConnectionHandler);
        if (!visitedObjects.has(p.port))
            _aws_cdk_aws_ec2_VpnPort(p.port);
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_ISecurityGroup(o);
        if (!visitedObjects.has(p.sessionTimeout))
            _aws_cdk_aws_ec2_ClientVpnSessionTimeout(p.sessionTimeout);
        if (!visitedObjects.has(p.transportProtocol))
            _aws_cdk_aws_ec2_TransportProtocol(p.transportProtocol);
        if (!visitedObjects.has(p.userBasedAuthentication))
            _aws_cdk_aws_ec2_ClientVpnUserBasedAuthentication(p.userBasedAuthentication);
        if (!visitedObjects.has(p.vpcSubnets))
            _aws_cdk_aws_ec2_SubnetSelection(p.vpcSubnets);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_ClientVpnSessionTimeout(p) {
}
function _aws_cdk_aws_ec2_ClientVpnUserBasedAuthentication(p) {
}
function _aws_cdk_aws_ec2_ClientVpnEndpointProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.vpc))
            _aws_cdk_aws_ec2_IVpc(p.vpc);
        if (!visitedObjects.has(p.clientConnectionHandler))
            _aws_cdk_aws_ec2_IClientVpnConnectionHandler(p.clientConnectionHandler);
        if (!visitedObjects.has(p.port))
            _aws_cdk_aws_ec2_VpnPort(p.port);
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_ISecurityGroup(o);
        if (!visitedObjects.has(p.sessionTimeout))
            _aws_cdk_aws_ec2_ClientVpnSessionTimeout(p.sessionTimeout);
        if (!visitedObjects.has(p.transportProtocol))
            _aws_cdk_aws_ec2_TransportProtocol(p.transportProtocol);
        if (!visitedObjects.has(p.userBasedAuthentication))
            _aws_cdk_aws_ec2_ClientVpnUserBasedAuthentication(p.userBasedAuthentication);
        if (!visitedObjects.has(p.vpcSubnets))
            _aws_cdk_aws_ec2_SubnetSelection(p.vpcSubnets);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_ClientVpnEndpointAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_ClientVpnEndpoint(p) {
}
function _aws_cdk_aws_ec2_ClientVpnAuthorizationRuleOptions(p) {
}
function _aws_cdk_aws_ec2_ClientVpnAuthorizationRuleProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("clientVpnEndoint" in p)
            print("@aws-cdk/aws-ec2.ClientVpnAuthorizationRuleProps#clientVpnEndoint", "Use `clientVpnEndpoint` instead");
        if (!visitedObjects.has(p.clientVpnEndoint))
            _aws_cdk_aws_ec2_IClientVpnEndpoint(p.clientVpnEndoint);
        if (!visitedObjects.has(p.clientVpnEndpoint))
            _aws_cdk_aws_ec2_IClientVpnEndpoint(p.clientVpnEndpoint);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_ClientVpnAuthorizationRule(p) {
}
function _aws_cdk_aws_ec2_ClientVpnRouteOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.target))
            _aws_cdk_aws_ec2_ClientVpnRouteTarget(p.target);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_ClientVpnRouteTarget(p) {
}
function _aws_cdk_aws_ec2_ClientVpnRouteProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("clientVpnEndoint" in p)
            print("@aws-cdk/aws-ec2.ClientVpnRouteProps#clientVpnEndoint", "Use `clientVpnEndpoint` instead");
        if (!visitedObjects.has(p.clientVpnEndoint))
            _aws_cdk_aws_ec2_IClientVpnEndpoint(p.clientVpnEndoint);
        if (!visitedObjects.has(p.clientVpnEndpoint))
            _aws_cdk_aws_ec2_IClientVpnEndpoint(p.clientVpnEndpoint);
        if (!visitedObjects.has(p.target))
            _aws_cdk_aws_ec2_ClientVpnRouteTarget(p.target);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_ClientVpnRoute(p) {
}
function _aws_cdk_aws_ec2_IpAddresses(p) {
}
function _aws_cdk_aws_ec2_IIpAddresses(p) {
}
function _aws_cdk_aws_ec2_VpcIpamOptions(p) {
}
function _aws_cdk_aws_ec2_RequestedSubnet(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.configuration))
            _aws_cdk_aws_ec2_SubnetConfiguration(p.configuration);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_AllocateCidrRequest(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.requestedSubnets != null)
            for (const o of p.requestedSubnets)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_RequestedSubnet(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_SubnetIpamOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.allocatedSubnets != null)
            for (const o of p.allocatedSubnets)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ec2_AllocatedSubnet(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ec2_AllocatedSubnet(p) {
}
function _aws_cdk_aws_ec2_AwsIpamProps(p) {
}
function _aws_cdk_aws_ec2_CfnCapacityReservationProps(p) {
}
function _aws_cdk_aws_ec2_CfnCapacityReservation(p) {
}
function _aws_cdk_aws_ec2_CfnCapacityReservation_TagSpecificationProperty(p) {
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
function _aws_cdk_aws_ec2_CfnCapacityReservationFleetProps(p) {
}
function _aws_cdk_aws_ec2_CfnCapacityReservationFleet(p) {
}
function _aws_cdk_aws_ec2_CfnCapacityReservationFleet_InstanceTypeSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnCapacityReservationFleet_TagSpecificationProperty(p) {
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
function _aws_cdk_aws_ec2_CfnCarrierGatewayProps(p) {
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
function _aws_cdk_aws_ec2_CfnCarrierGateway(p) {
}
function _aws_cdk_aws_ec2_CfnClientVpnAuthorizationRuleProps(p) {
}
function _aws_cdk_aws_ec2_CfnClientVpnAuthorizationRule(p) {
}
function _aws_cdk_aws_ec2_CfnClientVpnEndpointProps(p) {
}
function _aws_cdk_aws_ec2_CfnClientVpnEndpoint(p) {
}
function _aws_cdk_aws_ec2_CfnClientVpnEndpoint_CertificateAuthenticationRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnClientVpnEndpoint_ClientAuthenticationRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnClientVpnEndpoint_ClientConnectOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnClientVpnEndpoint_ClientLoginBannerOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnClientVpnEndpoint_ConnectionLogOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnClientVpnEndpoint_DirectoryServiceAuthenticationRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnClientVpnEndpoint_FederatedAuthenticationRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnClientVpnEndpoint_TagSpecificationProperty(p) {
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
function _aws_cdk_aws_ec2_CfnClientVpnRouteProps(p) {
}
function _aws_cdk_aws_ec2_CfnClientVpnRoute(p) {
}
function _aws_cdk_aws_ec2_CfnClientVpnTargetNetworkAssociationProps(p) {
}
function _aws_cdk_aws_ec2_CfnClientVpnTargetNetworkAssociation(p) {
}
function _aws_cdk_aws_ec2_CfnCustomerGatewayProps(p) {
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
function _aws_cdk_aws_ec2_CfnCustomerGateway(p) {
}
function _aws_cdk_aws_ec2_CfnDHCPOptionsProps(p) {
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
function _aws_cdk_aws_ec2_CfnDHCPOptions(p) {
}
function _aws_cdk_aws_ec2_CfnEC2FleetProps(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_AcceleratorCountRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_AcceleratorTotalMemoryMiBRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_BaselineEbsBandwidthMbpsRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_CapacityRebalanceProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_CapacityReservationOptionsRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_FleetLaunchTemplateConfigRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_FleetLaunchTemplateOverridesRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_FleetLaunchTemplateSpecificationRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_InstanceRequirementsRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_MaintenanceStrategiesProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_MemoryGiBPerVCpuRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_MemoryMiBRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_NetworkBandwidthGbpsRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_NetworkInterfaceCountRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_OnDemandOptionsRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_PlacementProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_SpotOptionsRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_TagSpecificationProperty(p) {
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
function _aws_cdk_aws_ec2_CfnEC2Fleet_TargetCapacitySpecificationRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_TotalLocalStorageGBRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEC2Fleet_VCpuCountRangeRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnEIPProps(p) {
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
function _aws_cdk_aws_ec2_CfnEIP(p) {
}
function _aws_cdk_aws_ec2_CfnEIPAssociationProps(p) {
}
function _aws_cdk_aws_ec2_CfnEIPAssociation(p) {
}
function _aws_cdk_aws_ec2_CfnEgressOnlyInternetGatewayProps(p) {
}
function _aws_cdk_aws_ec2_CfnEgressOnlyInternetGateway(p) {
}
function _aws_cdk_aws_ec2_CfnEnclaveCertificateIamRoleAssociationProps(p) {
}
function _aws_cdk_aws_ec2_CfnEnclaveCertificateIamRoleAssociation(p) {
}
function _aws_cdk_aws_ec2_CfnFlowLogProps(p) {
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
function _aws_cdk_aws_ec2_CfnFlowLog(p) {
}
function _aws_cdk_aws_ec2_CfnFlowLog_DestinationOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnGatewayRouteTableAssociationProps(p) {
}
function _aws_cdk_aws_ec2_CfnGatewayRouteTableAssociation(p) {
}
function _aws_cdk_aws_ec2_CfnHostProps(p) {
}
function _aws_cdk_aws_ec2_CfnHost(p) {
}
function _aws_cdk_aws_ec2_CfnIPAMProps(p) {
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
function _aws_cdk_aws_ec2_CfnIPAM(p) {
}
function _aws_cdk_aws_ec2_CfnIPAM_IpamOperatingRegionProperty(p) {
}
function _aws_cdk_aws_ec2_CfnIPAMAllocationProps(p) {
}
function _aws_cdk_aws_ec2_CfnIPAMAllocation(p) {
}
function _aws_cdk_aws_ec2_CfnIPAMPoolProps(p) {
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
function _aws_cdk_aws_ec2_CfnIPAMPool(p) {
}
function _aws_cdk_aws_ec2_CfnIPAMPool_ProvisionedCidrProperty(p) {
}
function _aws_cdk_aws_ec2_CfnIPAMPoolCidrProps(p) {
}
function _aws_cdk_aws_ec2_CfnIPAMPoolCidr(p) {
}
function _aws_cdk_aws_ec2_CfnIPAMResourceDiscoveryProps(p) {
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
function _aws_cdk_aws_ec2_CfnIPAMResourceDiscovery(p) {
}
function _aws_cdk_aws_ec2_CfnIPAMResourceDiscovery_IpamOperatingRegionProperty(p) {
}
function _aws_cdk_aws_ec2_CfnIPAMResourceDiscoveryAssociationProps(p) {
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
function _aws_cdk_aws_ec2_CfnIPAMResourceDiscoveryAssociation(p) {
}
function _aws_cdk_aws_ec2_CfnIPAMScopeProps(p) {
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
function _aws_cdk_aws_ec2_CfnIPAMScope(p) {
}
function _aws_cdk_aws_ec2_CfnInstanceProps(p) {
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
function _aws_cdk_aws_ec2_CfnInstance(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_AssociationParameterProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_BlockDeviceMappingProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_CpuOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_CreditSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_EbsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_ElasticGpuSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_ElasticInferenceAcceleratorProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_EnclaveOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_HibernationOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_InstanceIpv6AddressProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_LaunchTemplateSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_LicenseSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_NetworkInterfaceProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_NoDeviceProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_PrivateDnsNameOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_PrivateIpAddressSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_SsmAssociationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInstance_VolumeProperty(p) {
}
function _aws_cdk_aws_ec2_CfnInternetGatewayProps(p) {
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
function _aws_cdk_aws_ec2_CfnInternetGateway(p) {
}
function _aws_cdk_aws_ec2_CfnKeyPairProps(p) {
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
function _aws_cdk_aws_ec2_CfnKeyPair(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplateProps(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_AcceleratorCountProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_AcceleratorTotalMemoryMiBProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_BaselineEbsBandwidthMbpsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_BlockDeviceMappingProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_CapacityReservationSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_CapacityReservationTargetProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_CpuOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_CreditSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_EbsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_ElasticGpuSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_EnclaveOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_HibernationOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_IamInstanceProfileProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_InstanceMarketOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_InstanceRequirementsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_Ipv4PrefixSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_Ipv6AddProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_Ipv6PrefixSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_LaunchTemplateDataProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_LaunchTemplateElasticInferenceAcceleratorProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_LaunchTemplateTagSpecificationProperty(p) {
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
function _aws_cdk_aws_ec2_CfnLaunchTemplate_LicenseSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_MaintenanceOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_MemoryGiBPerVCpuProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_MemoryMiBProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_MetadataOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_MonitoringProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_NetworkBandwidthGbpsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_NetworkInterfaceProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_NetworkInterfaceCountProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_PlacementProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_PrivateDnsNameOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_PrivateIpAddProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_SpotOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_TagSpecificationProperty(p) {
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
function _aws_cdk_aws_ec2_CfnLaunchTemplate_TotalLocalStorageGBProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLaunchTemplate_VCpuCountProperty(p) {
}
function _aws_cdk_aws_ec2_CfnLocalGatewayRouteProps(p) {
}
function _aws_cdk_aws_ec2_CfnLocalGatewayRoute(p) {
}
function _aws_cdk_aws_ec2_CfnLocalGatewayRouteTableProps(p) {
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
function _aws_cdk_aws_ec2_CfnLocalGatewayRouteTable(p) {
}
function _aws_cdk_aws_ec2_CfnLocalGatewayRouteTableVPCAssociationProps(p) {
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
function _aws_cdk_aws_ec2_CfnLocalGatewayRouteTableVPCAssociation(p) {
}
function _aws_cdk_aws_ec2_CfnLocalGatewayRouteTableVirtualInterfaceGroupAssociationProps(p) {
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
function _aws_cdk_aws_ec2_CfnLocalGatewayRouteTableVirtualInterfaceGroupAssociation(p) {
}
function _aws_cdk_aws_ec2_CfnNatGatewayProps(p) {
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
function _aws_cdk_aws_ec2_CfnNatGateway(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkAclProps(p) {
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
function _aws_cdk_aws_ec2_CfnNetworkAcl(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkAclEntryProps(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkAclEntry(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkAclEntry_IcmpProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkAclEntry_PortRangeProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScopeProps(p) {
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
function _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScope(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScope_AccessScopePathRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScope_PacketHeaderStatementRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScope_PathStatementRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScope_ResourceStatementRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScope_ThroughResourcesStatementRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScopeAnalysisProps(p) {
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
function _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScopeAnalysis(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysisProps(p) {
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
function _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AdditionalDetailProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AlternatePathHintProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AnalysisAclRuleProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AnalysisComponentProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AnalysisLoadBalancerListenerProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AnalysisLoadBalancerTargetProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AnalysisPacketHeaderProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AnalysisRouteTableRouteProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AnalysisSecurityGroupRuleProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_ExplanationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_PathComponentProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_PortRangeProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_TransitGatewayRouteTableRouteProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInsightsPathProps(p) {
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
function _aws_cdk_aws_ec2_CfnNetworkInsightsPath(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInterfaceProps(p) {
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
function _aws_cdk_aws_ec2_CfnNetworkInterface(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInterface_InstanceIpv6AddressProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInterface_PrivateIpAddressSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInterfaceAttachmentProps(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInterfaceAttachment(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInterfacePermissionProps(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkInterfacePermission(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkPerformanceMetricSubscriptionProps(p) {
}
function _aws_cdk_aws_ec2_CfnNetworkPerformanceMetricSubscription(p) {
}
function _aws_cdk_aws_ec2_CfnPlacementGroupProps(p) {
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
function _aws_cdk_aws_ec2_CfnPlacementGroup(p) {
}
function _aws_cdk_aws_ec2_CfnPrefixListProps(p) {
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
function _aws_cdk_aws_ec2_CfnPrefixList(p) {
}
function _aws_cdk_aws_ec2_CfnPrefixList_EntryProperty(p) {
}
function _aws_cdk_aws_ec2_CfnRouteProps(p) {
}
function _aws_cdk_aws_ec2_CfnRoute(p) {
}
function _aws_cdk_aws_ec2_CfnRouteTableProps(p) {
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
function _aws_cdk_aws_ec2_CfnRouteTable(p) {
}
function _aws_cdk_aws_ec2_CfnSecurityGroupProps(p) {
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
function _aws_cdk_aws_ec2_CfnSecurityGroup(p) {
}
function _aws_cdk_aws_ec2_CfnSecurityGroup_EgressProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSecurityGroup_IngressProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSecurityGroupEgressProps(p) {
}
function _aws_cdk_aws_ec2_CfnSecurityGroupEgress(p) {
}
function _aws_cdk_aws_ec2_CfnSecurityGroupIngressProps(p) {
}
function _aws_cdk_aws_ec2_CfnSecurityGroupIngress(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleetProps(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_AcceleratorCountRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_AcceleratorTotalMemoryMiBRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_BaselineEbsBandwidthMbpsRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_BlockDeviceMappingProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_ClassicLoadBalancerProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_ClassicLoadBalancersConfigProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_EbsBlockDeviceProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_FleetLaunchTemplateSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_GroupIdentifierProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_IamInstanceProfileSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_InstanceIpv6AddressProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_InstanceNetworkInterfaceSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_InstanceRequirementsRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_LaunchTemplateConfigProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_LaunchTemplateOverridesProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_LoadBalancersConfigProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_MemoryGiBPerVCpuRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_MemoryMiBRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_NetworkBandwidthGbpsRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_NetworkInterfaceCountRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_PrivateIpAddressSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_SpotCapacityRebalanceProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_SpotFleetLaunchSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_SpotFleetMonitoringProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_SpotFleetRequestConfigDataProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_SpotFleetTagSpecificationProperty(p) {
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
function _aws_cdk_aws_ec2_CfnSpotFleet_SpotMaintenanceStrategiesProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_SpotPlacementProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_TargetGroupProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_TargetGroupsConfigProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_TotalLocalStorageGBRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSpotFleet_VCpuCountRangeRequestProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSubnetProps(p) {
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
function _aws_cdk_aws_ec2_CfnSubnet(p) {
}
function _aws_cdk_aws_ec2_CfnSubnet_PrivateDnsNameOptionsOnLaunchProperty(p) {
}
function _aws_cdk_aws_ec2_CfnSubnetCidrBlockProps(p) {
}
function _aws_cdk_aws_ec2_CfnSubnetCidrBlock(p) {
}
function _aws_cdk_aws_ec2_CfnSubnetNetworkAclAssociationProps(p) {
}
function _aws_cdk_aws_ec2_CfnSubnetNetworkAclAssociation(p) {
}
function _aws_cdk_aws_ec2_CfnSubnetRouteTableAssociationProps(p) {
}
function _aws_cdk_aws_ec2_CfnSubnetRouteTableAssociation(p) {
}
function _aws_cdk_aws_ec2_CfnTrafficMirrorFilterProps(p) {
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
function _aws_cdk_aws_ec2_CfnTrafficMirrorFilter(p) {
}
function _aws_cdk_aws_ec2_CfnTrafficMirrorFilterRuleProps(p) {
}
function _aws_cdk_aws_ec2_CfnTrafficMirrorFilterRule(p) {
}
function _aws_cdk_aws_ec2_CfnTrafficMirrorFilterRule_TrafficMirrorPortRangeProperty(p) {
}
function _aws_cdk_aws_ec2_CfnTrafficMirrorSessionProps(p) {
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
function _aws_cdk_aws_ec2_CfnTrafficMirrorSession(p) {
}
function _aws_cdk_aws_ec2_CfnTrafficMirrorTargetProps(p) {
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
function _aws_cdk_aws_ec2_CfnTrafficMirrorTarget(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayProps(p) {
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
function _aws_cdk_aws_ec2_CfnTransitGateway(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayAttachmentProps(p) {
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
function _aws_cdk_aws_ec2_CfnTransitGatewayAttachment(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayAttachment_OptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayConnectProps(p) {
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
function _aws_cdk_aws_ec2_CfnTransitGatewayConnect(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayConnect_TransitGatewayConnectOptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayMulticastDomainProps(p) {
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
function _aws_cdk_aws_ec2_CfnTransitGatewayMulticastDomain(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayMulticastDomain_OptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayMulticastDomainAssociationProps(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayMulticastDomainAssociation(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayMulticastGroupMemberProps(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayMulticastGroupMember(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayMulticastGroupSourceProps(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayMulticastGroupSource(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayPeeringAttachmentProps(p) {
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
function _aws_cdk_aws_ec2_CfnTransitGatewayPeeringAttachment(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayPeeringAttachment_PeeringAttachmentStatusProperty(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayRouteProps(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayRoute(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayRouteTableProps(p) {
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
function _aws_cdk_aws_ec2_CfnTransitGatewayRouteTable(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayRouteTableAssociationProps(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayRouteTableAssociation(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayRouteTablePropagationProps(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayRouteTablePropagation(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayVpcAttachmentProps(p) {
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
function _aws_cdk_aws_ec2_CfnTransitGatewayVpcAttachment(p) {
}
function _aws_cdk_aws_ec2_CfnTransitGatewayVpcAttachment_OptionsProperty(p) {
}
function _aws_cdk_aws_ec2_CfnVPCProps(p) {
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
function _aws_cdk_aws_ec2_CfnVPC(p) {
}
function _aws_cdk_aws_ec2_CfnVPCCidrBlockProps(p) {
}
function _aws_cdk_aws_ec2_CfnVPCCidrBlock(p) {
}
function _aws_cdk_aws_ec2_CfnVPCDHCPOptionsAssociationProps(p) {
}
function _aws_cdk_aws_ec2_CfnVPCDHCPOptionsAssociation(p) {
}
function _aws_cdk_aws_ec2_CfnVPCEndpointProps(p) {
}
function _aws_cdk_aws_ec2_CfnVPCEndpoint(p) {
}
function _aws_cdk_aws_ec2_CfnVPCEndpointConnectionNotificationProps(p) {
}
function _aws_cdk_aws_ec2_CfnVPCEndpointConnectionNotification(p) {
}
function _aws_cdk_aws_ec2_CfnVPCEndpointServiceProps(p) {
}
function _aws_cdk_aws_ec2_CfnVPCEndpointService(p) {
}
function _aws_cdk_aws_ec2_CfnVPCEndpointServicePermissionsProps(p) {
}
function _aws_cdk_aws_ec2_CfnVPCEndpointServicePermissions(p) {
}
function _aws_cdk_aws_ec2_CfnVPCGatewayAttachmentProps(p) {
}
function _aws_cdk_aws_ec2_CfnVPCGatewayAttachment(p) {
}
function _aws_cdk_aws_ec2_CfnVPCPeeringConnectionProps(p) {
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
function _aws_cdk_aws_ec2_CfnVPCPeeringConnection(p) {
}
function _aws_cdk_aws_ec2_CfnVPNConnectionProps(p) {
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
function _aws_cdk_aws_ec2_CfnVPNConnection(p) {
}
function _aws_cdk_aws_ec2_CfnVPNConnection_VpnTunnelOptionsSpecificationProperty(p) {
}
function _aws_cdk_aws_ec2_CfnVPNConnectionRouteProps(p) {
}
function _aws_cdk_aws_ec2_CfnVPNConnectionRoute(p) {
}
function _aws_cdk_aws_ec2_CfnVPNGatewayProps(p) {
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
function _aws_cdk_aws_ec2_CfnVPNGateway(p) {
}
function _aws_cdk_aws_ec2_CfnVPNGatewayRoutePropagationProps(p) {
}
function _aws_cdk_aws_ec2_CfnVPNGatewayRoutePropagation(p) {
}
function _aws_cdk_aws_ec2_CfnVolumeProps(p) {
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
function _aws_cdk_aws_ec2_CfnVolume(p) {
}
function _aws_cdk_aws_ec2_CfnVolumeAttachmentProps(p) {
}
function _aws_cdk_aws_ec2_CfnVolumeAttachment(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_ec2_InstanceRequireImdsv2AspectProps, _aws_cdk_aws_ec2_InstanceRequireImdsv2Aspect, _aws_cdk_aws_ec2_LaunchTemplateRequireImdsv2AspectProps, _aws_cdk_aws_ec2_LaunchTemplateRequireImdsv2Aspect, _aws_cdk_aws_ec2_BastionHostLinuxProps, _aws_cdk_aws_ec2_BastionHostLinux, _aws_cdk_aws_ec2_IConnectable, _aws_cdk_aws_ec2_ConnectionsProps, _aws_cdk_aws_ec2_Connections, _aws_cdk_aws_ec2_CloudFormationInit, _aws_cdk_aws_ec2_InitConfig, _aws_cdk_aws_ec2_ConfigSetProps, _aws_cdk_aws_ec2_AttachInitOptions, _aws_cdk_aws_ec2_InitServiceRestartHandle, _aws_cdk_aws_ec2_InitElement, _aws_cdk_aws_ec2_InitCommandOptions, _aws_cdk_aws_ec2_InitCommandWaitDuration, _aws_cdk_aws_ec2_InitCommand, _aws_cdk_aws_ec2_InitFileOptions, _aws_cdk_aws_ec2_InitFileAssetOptions, _aws_cdk_aws_ec2_InitFile, _aws_cdk_aws_ec2_InitGroup, _aws_cdk_aws_ec2_InitUserOptions, _aws_cdk_aws_ec2_InitUser, _aws_cdk_aws_ec2_LocationPackageOptions, _aws_cdk_aws_ec2_NamedPackageOptions, _aws_cdk_aws_ec2_InitPackage, _aws_cdk_aws_ec2_InitServiceOptions, _aws_cdk_aws_ec2_InitService, _aws_cdk_aws_ec2_InitSourceOptions, _aws_cdk_aws_ec2_InitSourceAssetOptions, _aws_cdk_aws_ec2_InitSource, _aws_cdk_aws_ec2_ServiceManager, _aws_cdk_aws_ec2_SystemdConfigFileOptions, _aws_cdk_aws_ec2_InstanceClass, _aws_cdk_aws_ec2_InstanceArchitecture, _aws_cdk_aws_ec2_InstanceSize, _aws_cdk_aws_ec2_InstanceType, _aws_cdk_aws_ec2_IInstance, _aws_cdk_aws_ec2_InstanceProps, _aws_cdk_aws_ec2_Instance, _aws_cdk_aws_ec2_ApplyCloudFormationInitOptions, _aws_cdk_aws_ec2_CpuCredits, _aws_cdk_aws_ec2_InstanceInitiatedShutdownBehavior, _aws_cdk_aws_ec2_ILaunchTemplate, _aws_cdk_aws_ec2_SpotInstanceInterruption, _aws_cdk_aws_ec2_SpotRequestType, _aws_cdk_aws_ec2_LaunchTemplateSpotOptions, _aws_cdk_aws_ec2_LaunchTemplateHttpTokens, _aws_cdk_aws_ec2_LaunchTemplateProps, _aws_cdk_aws_ec2_LaunchTemplateSpecialVersions, _aws_cdk_aws_ec2_LaunchTemplateAttributes, _aws_cdk_aws_ec2_LaunchTemplate, _aws_cdk_aws_ec2_IMachineImage, _aws_cdk_aws_ec2_MachineImage, _aws_cdk_aws_ec2_MachineImageConfig, _aws_cdk_aws_ec2_GenericSSMParameterImage, _aws_cdk_aws_ec2_SsmParameterImageOptions, _aws_cdk_aws_ec2_WindowsImageProps, _aws_cdk_aws_ec2_WindowsImage, _aws_cdk_aws_ec2_AmazonLinuxCpuType, _aws_cdk_aws_ec2_AmazonLinuxImageProps, _aws_cdk_aws_ec2_AmazonLinuxImage, _aws_cdk_aws_ec2_AmazonLinuxGeneration, _aws_cdk_aws_ec2_AmazonLinuxKernel, _aws_cdk_aws_ec2_AmazonLinuxEdition, _aws_cdk_aws_ec2_AmazonLinuxVirt, _aws_cdk_aws_ec2_AmazonLinuxStorage, _aws_cdk_aws_ec2_GenericLinuxImageProps, _aws_cdk_aws_ec2_GenericWindowsImageProps, _aws_cdk_aws_ec2_GenericLinuxImage, _aws_cdk_aws_ec2_GenericWindowsImage, _aws_cdk_aws_ec2_OperatingSystemType, _aws_cdk_aws_ec2_LookupMachineImage, _aws_cdk_aws_ec2_LookupMachineImageProps, _aws_cdk_aws_ec2_NatTrafficDirection, _aws_cdk_aws_ec2_GatewayConfig, _aws_cdk_aws_ec2_NatProvider, _aws_cdk_aws_ec2_ConfigureNatOptions, _aws_cdk_aws_ec2_NatGatewayProps, _aws_cdk_aws_ec2_NatInstanceProps, _aws_cdk_aws_ec2_NatInstanceProvider, _aws_cdk_aws_ec2_NatInstanceImage, _aws_cdk_aws_ec2_INetworkAcl, _aws_cdk_aws_ec2_NetworkAclProps, _aws_cdk_aws_ec2_NetworkAcl, _aws_cdk_aws_ec2_Action, _aws_cdk_aws_ec2_INetworkAclEntry, _aws_cdk_aws_ec2_TrafficDirection, _aws_cdk_aws_ec2_CommonNetworkAclEntryOptions, _aws_cdk_aws_ec2_NetworkAclEntryProps, _aws_cdk_aws_ec2_NetworkAclEntry, _aws_cdk_aws_ec2_ISubnetNetworkAclAssociation, _aws_cdk_aws_ec2_SubnetNetworkAclAssociationProps, _aws_cdk_aws_ec2_SubnetNetworkAclAssociation, _aws_cdk_aws_ec2_AclCidr, _aws_cdk_aws_ec2_AclCidrConfig, _aws_cdk_aws_ec2_AclTraffic, _aws_cdk_aws_ec2_AclTrafficConfig, _aws_cdk_aws_ec2_AclIcmp, _aws_cdk_aws_ec2_AclPortRange, _aws_cdk_aws_ec2_Protocol, _aws_cdk_aws_ec2_PortProps, _aws_cdk_aws_ec2_Port, _aws_cdk_aws_ec2_ISecurityGroup, _aws_cdk_aws_ec2_RuleScope, _aws_cdk_aws_ec2_SecurityGroupProps, _aws_cdk_aws_ec2_SecurityGroupImportOptions, _aws_cdk_aws_ec2_SecurityGroup, _aws_cdk_aws_ec2_ConnectionRule, _aws_cdk_aws_ec2_SubnetFilter, _aws_cdk_aws_ec2_IPeer, _aws_cdk_aws_ec2_Peer, _aws_cdk_aws_ec2_IPrefixList, _aws_cdk_aws_ec2_AddressFamily, _aws_cdk_aws_ec2_PrefixListOptions, _aws_cdk_aws_ec2_PrefixListProps, _aws_cdk_aws_ec2_PrefixList, _aws_cdk_aws_ec2_BlockDevice, _aws_cdk_aws_ec2_EbsDeviceOptionsBase, _aws_cdk_aws_ec2_EbsDeviceOptions, _aws_cdk_aws_ec2_EbsDeviceSnapshotOptions, _aws_cdk_aws_ec2_EbsDeviceProps, _aws_cdk_aws_ec2_BlockDeviceVolume, _aws_cdk_aws_ec2_EbsDeviceVolumeType, _aws_cdk_aws_ec2_IVolume, _aws_cdk_aws_ec2_VolumeProps, _aws_cdk_aws_ec2_VolumeAttributes, _aws_cdk_aws_ec2_Volume, _aws_cdk_aws_ec2_ISubnet, _aws_cdk_aws_ec2_IRouteTable, _aws_cdk_aws_ec2_IVpc, _aws_cdk_aws_ec2_SubnetType, _aws_cdk_aws_ec2_SubnetSelection, _aws_cdk_aws_ec2_SelectedSubnets, _aws_cdk_aws_ec2_VpcAttributes, _aws_cdk_aws_ec2_SubnetAttributes, _aws_cdk_aws_ec2_VpcProps, _aws_cdk_aws_ec2_DefaultInstanceTenancy, _aws_cdk_aws_ec2_SubnetConfiguration, _aws_cdk_aws_ec2_Vpc, _aws_cdk_aws_ec2_SubnetProps, _aws_cdk_aws_ec2_Subnet, _aws_cdk_aws_ec2_AddRouteOptions, _aws_cdk_aws_ec2_RouterType, _aws_cdk_aws_ec2_PublicSubnetProps, _aws_cdk_aws_ec2_IPublicSubnet, _aws_cdk_aws_ec2_PublicSubnetAttributes, _aws_cdk_aws_ec2_PublicSubnet, _aws_cdk_aws_ec2_PrivateSubnetProps, _aws_cdk_aws_ec2_IPrivateSubnet, _aws_cdk_aws_ec2_PrivateSubnetAttributes, _aws_cdk_aws_ec2_PrivateSubnet, _aws_cdk_aws_ec2_VpcLookupOptions, _aws_cdk_aws_ec2_IVpnConnection, _aws_cdk_aws_ec2_IVpnGateway, _aws_cdk_aws_ec2_VpnTunnelOption, _aws_cdk_aws_ec2_VpnConnectionOptions, _aws_cdk_aws_ec2_VpnGatewayProps, _aws_cdk_aws_ec2_EnableVpnGatewayOptions, _aws_cdk_aws_ec2_VpnConnectionProps, _aws_cdk_aws_ec2_VpnConnectionType, _aws_cdk_aws_ec2_VpnGateway, _aws_cdk_aws_ec2_VpnConnectionAttributes, _aws_cdk_aws_ec2_VpnConnectionBase, _aws_cdk_aws_ec2_VpnConnection, _aws_cdk_aws_ec2_IVpcEndpoint, _aws_cdk_aws_ec2_VpcEndpoint, _aws_cdk_aws_ec2_IGatewayVpcEndpoint, _aws_cdk_aws_ec2_VpcEndpointType, _aws_cdk_aws_ec2_IGatewayVpcEndpointService, _aws_cdk_aws_ec2_GatewayVpcEndpointAwsService, _aws_cdk_aws_ec2_GatewayVpcEndpointOptions, _aws_cdk_aws_ec2_GatewayVpcEndpointProps, _aws_cdk_aws_ec2_GatewayVpcEndpoint, _aws_cdk_aws_ec2_IInterfaceVpcEndpointService, _aws_cdk_aws_ec2_InterfaceVpcEndpointService, _aws_cdk_aws_ec2_InterfaceVpcEndpointAwsService, _aws_cdk_aws_ec2_InterfaceVpcEndpointOptions, _aws_cdk_aws_ec2_InterfaceVpcEndpointProps, _aws_cdk_aws_ec2_IInterfaceVpcEndpoint, _aws_cdk_aws_ec2_InterfaceVpcEndpoint, _aws_cdk_aws_ec2_InterfaceVpcEndpointAttributes, _aws_cdk_aws_ec2_IVpcEndpointServiceLoadBalancer, _aws_cdk_aws_ec2_IVpcEndpointService, _aws_cdk_aws_ec2_VpcEndpointService, _aws_cdk_aws_ec2_VpcEndpointServiceProps, _aws_cdk_aws_ec2_LinuxUserDataOptions, _aws_cdk_aws_ec2_WindowsUserDataOptions, _aws_cdk_aws_ec2_S3DownloadOptions, _aws_cdk_aws_ec2_ExecuteFileOptions, _aws_cdk_aws_ec2_UserData, _aws_cdk_aws_ec2_MultipartBodyOptions, _aws_cdk_aws_ec2_MultipartBody, _aws_cdk_aws_ec2_MultipartUserDataOptions, _aws_cdk_aws_ec2_MultipartUserData, _aws_cdk_aws_ec2_WindowsVersion, _aws_cdk_aws_ec2_IFlowLog, _aws_cdk_aws_ec2_FlowLogTrafficType, _aws_cdk_aws_ec2_FlowLogDestinationType, _aws_cdk_aws_ec2_FlowLogResourceType, _aws_cdk_aws_ec2_FlowLogFileFormat, _aws_cdk_aws_ec2_S3DestinationOptions, _aws_cdk_aws_ec2_DestinationOptions, _aws_cdk_aws_ec2_FlowLogDestination, _aws_cdk_aws_ec2_FlowLogDestinationConfig, _aws_cdk_aws_ec2_FlowLogMaxAggregationInterval, _aws_cdk_aws_ec2_LogFormat, _aws_cdk_aws_ec2_FlowLogOptions, _aws_cdk_aws_ec2_FlowLogProps, _aws_cdk_aws_ec2_FlowLog, _aws_cdk_aws_ec2_IClientVpnEndpoint, _aws_cdk_aws_ec2_IClientVpnConnectionHandler, _aws_cdk_aws_ec2_TransportProtocol, _aws_cdk_aws_ec2_VpnPort, _aws_cdk_aws_ec2_ClientVpnEndpointOptions, _aws_cdk_aws_ec2_ClientVpnSessionTimeout, _aws_cdk_aws_ec2_ClientVpnUserBasedAuthentication, _aws_cdk_aws_ec2_ClientVpnEndpointProps, _aws_cdk_aws_ec2_ClientVpnEndpointAttributes, _aws_cdk_aws_ec2_ClientVpnEndpoint, _aws_cdk_aws_ec2_ClientVpnAuthorizationRuleOptions, _aws_cdk_aws_ec2_ClientVpnAuthorizationRuleProps, _aws_cdk_aws_ec2_ClientVpnAuthorizationRule, _aws_cdk_aws_ec2_ClientVpnRouteOptions, _aws_cdk_aws_ec2_ClientVpnRouteTarget, _aws_cdk_aws_ec2_ClientVpnRouteProps, _aws_cdk_aws_ec2_ClientVpnRoute, _aws_cdk_aws_ec2_IpAddresses, _aws_cdk_aws_ec2_IIpAddresses, _aws_cdk_aws_ec2_VpcIpamOptions, _aws_cdk_aws_ec2_RequestedSubnet, _aws_cdk_aws_ec2_AllocateCidrRequest, _aws_cdk_aws_ec2_SubnetIpamOptions, _aws_cdk_aws_ec2_AllocatedSubnet, _aws_cdk_aws_ec2_AwsIpamProps, _aws_cdk_aws_ec2_CfnCapacityReservationProps, _aws_cdk_aws_ec2_CfnCapacityReservation, _aws_cdk_aws_ec2_CfnCapacityReservation_TagSpecificationProperty, _aws_cdk_aws_ec2_CfnCapacityReservationFleetProps, _aws_cdk_aws_ec2_CfnCapacityReservationFleet, _aws_cdk_aws_ec2_CfnCapacityReservationFleet_InstanceTypeSpecificationProperty, _aws_cdk_aws_ec2_CfnCapacityReservationFleet_TagSpecificationProperty, _aws_cdk_aws_ec2_CfnCarrierGatewayProps, _aws_cdk_aws_ec2_CfnCarrierGateway, _aws_cdk_aws_ec2_CfnClientVpnAuthorizationRuleProps, _aws_cdk_aws_ec2_CfnClientVpnAuthorizationRule, _aws_cdk_aws_ec2_CfnClientVpnEndpointProps, _aws_cdk_aws_ec2_CfnClientVpnEndpoint, _aws_cdk_aws_ec2_CfnClientVpnEndpoint_CertificateAuthenticationRequestProperty, _aws_cdk_aws_ec2_CfnClientVpnEndpoint_ClientAuthenticationRequestProperty, _aws_cdk_aws_ec2_CfnClientVpnEndpoint_ClientConnectOptionsProperty, _aws_cdk_aws_ec2_CfnClientVpnEndpoint_ClientLoginBannerOptionsProperty, _aws_cdk_aws_ec2_CfnClientVpnEndpoint_ConnectionLogOptionsProperty, _aws_cdk_aws_ec2_CfnClientVpnEndpoint_DirectoryServiceAuthenticationRequestProperty, _aws_cdk_aws_ec2_CfnClientVpnEndpoint_FederatedAuthenticationRequestProperty, _aws_cdk_aws_ec2_CfnClientVpnEndpoint_TagSpecificationProperty, _aws_cdk_aws_ec2_CfnClientVpnRouteProps, _aws_cdk_aws_ec2_CfnClientVpnRoute, _aws_cdk_aws_ec2_CfnClientVpnTargetNetworkAssociationProps, _aws_cdk_aws_ec2_CfnClientVpnTargetNetworkAssociation, _aws_cdk_aws_ec2_CfnCustomerGatewayProps, _aws_cdk_aws_ec2_CfnCustomerGateway, _aws_cdk_aws_ec2_CfnDHCPOptionsProps, _aws_cdk_aws_ec2_CfnDHCPOptions, _aws_cdk_aws_ec2_CfnEC2FleetProps, _aws_cdk_aws_ec2_CfnEC2Fleet, _aws_cdk_aws_ec2_CfnEC2Fleet_AcceleratorCountRequestProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_AcceleratorTotalMemoryMiBRequestProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_BaselineEbsBandwidthMbpsRequestProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_CapacityRebalanceProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_CapacityReservationOptionsRequestProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_FleetLaunchTemplateConfigRequestProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_FleetLaunchTemplateOverridesRequestProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_FleetLaunchTemplateSpecificationRequestProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_InstanceRequirementsRequestProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_MaintenanceStrategiesProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_MemoryGiBPerVCpuRequestProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_MemoryMiBRequestProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_NetworkBandwidthGbpsRequestProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_NetworkInterfaceCountRequestProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_OnDemandOptionsRequestProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_PlacementProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_SpotOptionsRequestProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_TagSpecificationProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_TargetCapacitySpecificationRequestProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_TotalLocalStorageGBRequestProperty, _aws_cdk_aws_ec2_CfnEC2Fleet_VCpuCountRangeRequestProperty, _aws_cdk_aws_ec2_CfnEIPProps, _aws_cdk_aws_ec2_CfnEIP, _aws_cdk_aws_ec2_CfnEIPAssociationProps, _aws_cdk_aws_ec2_CfnEIPAssociation, _aws_cdk_aws_ec2_CfnEgressOnlyInternetGatewayProps, _aws_cdk_aws_ec2_CfnEgressOnlyInternetGateway, _aws_cdk_aws_ec2_CfnEnclaveCertificateIamRoleAssociationProps, _aws_cdk_aws_ec2_CfnEnclaveCertificateIamRoleAssociation, _aws_cdk_aws_ec2_CfnFlowLogProps, _aws_cdk_aws_ec2_CfnFlowLog, _aws_cdk_aws_ec2_CfnFlowLog_DestinationOptionsProperty, _aws_cdk_aws_ec2_CfnGatewayRouteTableAssociationProps, _aws_cdk_aws_ec2_CfnGatewayRouteTableAssociation, _aws_cdk_aws_ec2_CfnHostProps, _aws_cdk_aws_ec2_CfnHost, _aws_cdk_aws_ec2_CfnIPAMProps, _aws_cdk_aws_ec2_CfnIPAM, _aws_cdk_aws_ec2_CfnIPAM_IpamOperatingRegionProperty, _aws_cdk_aws_ec2_CfnIPAMAllocationProps, _aws_cdk_aws_ec2_CfnIPAMAllocation, _aws_cdk_aws_ec2_CfnIPAMPoolProps, _aws_cdk_aws_ec2_CfnIPAMPool, _aws_cdk_aws_ec2_CfnIPAMPool_ProvisionedCidrProperty, _aws_cdk_aws_ec2_CfnIPAMPoolCidrProps, _aws_cdk_aws_ec2_CfnIPAMPoolCidr, _aws_cdk_aws_ec2_CfnIPAMResourceDiscoveryProps, _aws_cdk_aws_ec2_CfnIPAMResourceDiscovery, _aws_cdk_aws_ec2_CfnIPAMResourceDiscovery_IpamOperatingRegionProperty, _aws_cdk_aws_ec2_CfnIPAMResourceDiscoveryAssociationProps, _aws_cdk_aws_ec2_CfnIPAMResourceDiscoveryAssociation, _aws_cdk_aws_ec2_CfnIPAMScopeProps, _aws_cdk_aws_ec2_CfnIPAMScope, _aws_cdk_aws_ec2_CfnInstanceProps, _aws_cdk_aws_ec2_CfnInstance, _aws_cdk_aws_ec2_CfnInstance_AssociationParameterProperty, _aws_cdk_aws_ec2_CfnInstance_BlockDeviceMappingProperty, _aws_cdk_aws_ec2_CfnInstance_CpuOptionsProperty, _aws_cdk_aws_ec2_CfnInstance_CreditSpecificationProperty, _aws_cdk_aws_ec2_CfnInstance_EbsProperty, _aws_cdk_aws_ec2_CfnInstance_ElasticGpuSpecificationProperty, _aws_cdk_aws_ec2_CfnInstance_ElasticInferenceAcceleratorProperty, _aws_cdk_aws_ec2_CfnInstance_EnclaveOptionsProperty, _aws_cdk_aws_ec2_CfnInstance_HibernationOptionsProperty, _aws_cdk_aws_ec2_CfnInstance_InstanceIpv6AddressProperty, _aws_cdk_aws_ec2_CfnInstance_LaunchTemplateSpecificationProperty, _aws_cdk_aws_ec2_CfnInstance_LicenseSpecificationProperty, _aws_cdk_aws_ec2_CfnInstance_NetworkInterfaceProperty, _aws_cdk_aws_ec2_CfnInstance_NoDeviceProperty, _aws_cdk_aws_ec2_CfnInstance_PrivateDnsNameOptionsProperty, _aws_cdk_aws_ec2_CfnInstance_PrivateIpAddressSpecificationProperty, _aws_cdk_aws_ec2_CfnInstance_SsmAssociationProperty, _aws_cdk_aws_ec2_CfnInstance_VolumeProperty, _aws_cdk_aws_ec2_CfnInternetGatewayProps, _aws_cdk_aws_ec2_CfnInternetGateway, _aws_cdk_aws_ec2_CfnKeyPairProps, _aws_cdk_aws_ec2_CfnKeyPair, _aws_cdk_aws_ec2_CfnLaunchTemplateProps, _aws_cdk_aws_ec2_CfnLaunchTemplate, _aws_cdk_aws_ec2_CfnLaunchTemplate_AcceleratorCountProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_AcceleratorTotalMemoryMiBProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_BaselineEbsBandwidthMbpsProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_BlockDeviceMappingProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_CapacityReservationSpecificationProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_CapacityReservationTargetProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_CpuOptionsProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_CreditSpecificationProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_EbsProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_ElasticGpuSpecificationProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_EnclaveOptionsProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_HibernationOptionsProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_IamInstanceProfileProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_InstanceMarketOptionsProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_InstanceRequirementsProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_Ipv4PrefixSpecificationProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_Ipv6AddProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_Ipv6PrefixSpecificationProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_LaunchTemplateDataProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_LaunchTemplateElasticInferenceAcceleratorProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_LaunchTemplateTagSpecificationProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_LicenseSpecificationProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_MaintenanceOptionsProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_MemoryGiBPerVCpuProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_MemoryMiBProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_MetadataOptionsProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_MonitoringProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_NetworkBandwidthGbpsProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_NetworkInterfaceProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_NetworkInterfaceCountProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_PlacementProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_PrivateDnsNameOptionsProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_PrivateIpAddProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_SpotOptionsProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_TagSpecificationProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_TotalLocalStorageGBProperty, _aws_cdk_aws_ec2_CfnLaunchTemplate_VCpuCountProperty, _aws_cdk_aws_ec2_CfnLocalGatewayRouteProps, _aws_cdk_aws_ec2_CfnLocalGatewayRoute, _aws_cdk_aws_ec2_CfnLocalGatewayRouteTableProps, _aws_cdk_aws_ec2_CfnLocalGatewayRouteTable, _aws_cdk_aws_ec2_CfnLocalGatewayRouteTableVPCAssociationProps, _aws_cdk_aws_ec2_CfnLocalGatewayRouteTableVPCAssociation, _aws_cdk_aws_ec2_CfnLocalGatewayRouteTableVirtualInterfaceGroupAssociationProps, _aws_cdk_aws_ec2_CfnLocalGatewayRouteTableVirtualInterfaceGroupAssociation, _aws_cdk_aws_ec2_CfnNatGatewayProps, _aws_cdk_aws_ec2_CfnNatGateway, _aws_cdk_aws_ec2_CfnNetworkAclProps, _aws_cdk_aws_ec2_CfnNetworkAcl, _aws_cdk_aws_ec2_CfnNetworkAclEntryProps, _aws_cdk_aws_ec2_CfnNetworkAclEntry, _aws_cdk_aws_ec2_CfnNetworkAclEntry_IcmpProperty, _aws_cdk_aws_ec2_CfnNetworkAclEntry_PortRangeProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScopeProps, _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScope, _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScope_AccessScopePathRequestProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScope_PacketHeaderStatementRequestProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScope_PathStatementRequestProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScope_ResourceStatementRequestProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScope_ThroughResourcesStatementRequestProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScopeAnalysisProps, _aws_cdk_aws_ec2_CfnNetworkInsightsAccessScopeAnalysis, _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysisProps, _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis, _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AdditionalDetailProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AlternatePathHintProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AnalysisAclRuleProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AnalysisComponentProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AnalysisLoadBalancerListenerProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AnalysisLoadBalancerTargetProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AnalysisPacketHeaderProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AnalysisRouteTableRouteProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_AnalysisSecurityGroupRuleProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_ExplanationProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_PathComponentProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_PortRangeProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsAnalysis_TransitGatewayRouteTableRouteProperty, _aws_cdk_aws_ec2_CfnNetworkInsightsPathProps, _aws_cdk_aws_ec2_CfnNetworkInsightsPath, _aws_cdk_aws_ec2_CfnNetworkInterfaceProps, _aws_cdk_aws_ec2_CfnNetworkInterface, _aws_cdk_aws_ec2_CfnNetworkInterface_InstanceIpv6AddressProperty, _aws_cdk_aws_ec2_CfnNetworkInterface_PrivateIpAddressSpecificationProperty, _aws_cdk_aws_ec2_CfnNetworkInterfaceAttachmentProps, _aws_cdk_aws_ec2_CfnNetworkInterfaceAttachment, _aws_cdk_aws_ec2_CfnNetworkInterfacePermissionProps, _aws_cdk_aws_ec2_CfnNetworkInterfacePermission, _aws_cdk_aws_ec2_CfnNetworkPerformanceMetricSubscriptionProps, _aws_cdk_aws_ec2_CfnNetworkPerformanceMetricSubscription, _aws_cdk_aws_ec2_CfnPlacementGroupProps, _aws_cdk_aws_ec2_CfnPlacementGroup, _aws_cdk_aws_ec2_CfnPrefixListProps, _aws_cdk_aws_ec2_CfnPrefixList, _aws_cdk_aws_ec2_CfnPrefixList_EntryProperty, _aws_cdk_aws_ec2_CfnRouteProps, _aws_cdk_aws_ec2_CfnRoute, _aws_cdk_aws_ec2_CfnRouteTableProps, _aws_cdk_aws_ec2_CfnRouteTable, _aws_cdk_aws_ec2_CfnSecurityGroupProps, _aws_cdk_aws_ec2_CfnSecurityGroup, _aws_cdk_aws_ec2_CfnSecurityGroup_EgressProperty, _aws_cdk_aws_ec2_CfnSecurityGroup_IngressProperty, _aws_cdk_aws_ec2_CfnSecurityGroupEgressProps, _aws_cdk_aws_ec2_CfnSecurityGroupEgress, _aws_cdk_aws_ec2_CfnSecurityGroupIngressProps, _aws_cdk_aws_ec2_CfnSecurityGroupIngress, _aws_cdk_aws_ec2_CfnSpotFleetProps, _aws_cdk_aws_ec2_CfnSpotFleet, _aws_cdk_aws_ec2_CfnSpotFleet_AcceleratorCountRequestProperty, _aws_cdk_aws_ec2_CfnSpotFleet_AcceleratorTotalMemoryMiBRequestProperty, _aws_cdk_aws_ec2_CfnSpotFleet_BaselineEbsBandwidthMbpsRequestProperty, _aws_cdk_aws_ec2_CfnSpotFleet_BlockDeviceMappingProperty, _aws_cdk_aws_ec2_CfnSpotFleet_ClassicLoadBalancerProperty, _aws_cdk_aws_ec2_CfnSpotFleet_ClassicLoadBalancersConfigProperty, _aws_cdk_aws_ec2_CfnSpotFleet_EbsBlockDeviceProperty, _aws_cdk_aws_ec2_CfnSpotFleet_FleetLaunchTemplateSpecificationProperty, _aws_cdk_aws_ec2_CfnSpotFleet_GroupIdentifierProperty, _aws_cdk_aws_ec2_CfnSpotFleet_IamInstanceProfileSpecificationProperty, _aws_cdk_aws_ec2_CfnSpotFleet_InstanceIpv6AddressProperty, _aws_cdk_aws_ec2_CfnSpotFleet_InstanceNetworkInterfaceSpecificationProperty, _aws_cdk_aws_ec2_CfnSpotFleet_InstanceRequirementsRequestProperty, _aws_cdk_aws_ec2_CfnSpotFleet_LaunchTemplateConfigProperty, _aws_cdk_aws_ec2_CfnSpotFleet_LaunchTemplateOverridesProperty, _aws_cdk_aws_ec2_CfnSpotFleet_LoadBalancersConfigProperty, _aws_cdk_aws_ec2_CfnSpotFleet_MemoryGiBPerVCpuRequestProperty, _aws_cdk_aws_ec2_CfnSpotFleet_MemoryMiBRequestProperty, _aws_cdk_aws_ec2_CfnSpotFleet_NetworkBandwidthGbpsRequestProperty, _aws_cdk_aws_ec2_CfnSpotFleet_NetworkInterfaceCountRequestProperty, _aws_cdk_aws_ec2_CfnSpotFleet_PrivateIpAddressSpecificationProperty, _aws_cdk_aws_ec2_CfnSpotFleet_SpotCapacityRebalanceProperty, _aws_cdk_aws_ec2_CfnSpotFleet_SpotFleetLaunchSpecificationProperty, _aws_cdk_aws_ec2_CfnSpotFleet_SpotFleetMonitoringProperty, _aws_cdk_aws_ec2_CfnSpotFleet_SpotFleetRequestConfigDataProperty, _aws_cdk_aws_ec2_CfnSpotFleet_SpotFleetTagSpecificationProperty, _aws_cdk_aws_ec2_CfnSpotFleet_SpotMaintenanceStrategiesProperty, _aws_cdk_aws_ec2_CfnSpotFleet_SpotPlacementProperty, _aws_cdk_aws_ec2_CfnSpotFleet_TargetGroupProperty, _aws_cdk_aws_ec2_CfnSpotFleet_TargetGroupsConfigProperty, _aws_cdk_aws_ec2_CfnSpotFleet_TotalLocalStorageGBRequestProperty, _aws_cdk_aws_ec2_CfnSpotFleet_VCpuCountRangeRequestProperty, _aws_cdk_aws_ec2_CfnSubnetProps, _aws_cdk_aws_ec2_CfnSubnet, _aws_cdk_aws_ec2_CfnSubnet_PrivateDnsNameOptionsOnLaunchProperty, _aws_cdk_aws_ec2_CfnSubnetCidrBlockProps, _aws_cdk_aws_ec2_CfnSubnetCidrBlock, _aws_cdk_aws_ec2_CfnSubnetNetworkAclAssociationProps, _aws_cdk_aws_ec2_CfnSubnetNetworkAclAssociation, _aws_cdk_aws_ec2_CfnSubnetRouteTableAssociationProps, _aws_cdk_aws_ec2_CfnSubnetRouteTableAssociation, _aws_cdk_aws_ec2_CfnTrafficMirrorFilterProps, _aws_cdk_aws_ec2_CfnTrafficMirrorFilter, _aws_cdk_aws_ec2_CfnTrafficMirrorFilterRuleProps, _aws_cdk_aws_ec2_CfnTrafficMirrorFilterRule, _aws_cdk_aws_ec2_CfnTrafficMirrorFilterRule_TrafficMirrorPortRangeProperty, _aws_cdk_aws_ec2_CfnTrafficMirrorSessionProps, _aws_cdk_aws_ec2_CfnTrafficMirrorSession, _aws_cdk_aws_ec2_CfnTrafficMirrorTargetProps, _aws_cdk_aws_ec2_CfnTrafficMirrorTarget, _aws_cdk_aws_ec2_CfnTransitGatewayProps, _aws_cdk_aws_ec2_CfnTransitGateway, _aws_cdk_aws_ec2_CfnTransitGatewayAttachmentProps, _aws_cdk_aws_ec2_CfnTransitGatewayAttachment, _aws_cdk_aws_ec2_CfnTransitGatewayAttachment_OptionsProperty, _aws_cdk_aws_ec2_CfnTransitGatewayConnectProps, _aws_cdk_aws_ec2_CfnTransitGatewayConnect, _aws_cdk_aws_ec2_CfnTransitGatewayConnect_TransitGatewayConnectOptionsProperty, _aws_cdk_aws_ec2_CfnTransitGatewayMulticastDomainProps, _aws_cdk_aws_ec2_CfnTransitGatewayMulticastDomain, _aws_cdk_aws_ec2_CfnTransitGatewayMulticastDomain_OptionsProperty, _aws_cdk_aws_ec2_CfnTransitGatewayMulticastDomainAssociationProps, _aws_cdk_aws_ec2_CfnTransitGatewayMulticastDomainAssociation, _aws_cdk_aws_ec2_CfnTransitGatewayMulticastGroupMemberProps, _aws_cdk_aws_ec2_CfnTransitGatewayMulticastGroupMember, _aws_cdk_aws_ec2_CfnTransitGatewayMulticastGroupSourceProps, _aws_cdk_aws_ec2_CfnTransitGatewayMulticastGroupSource, _aws_cdk_aws_ec2_CfnTransitGatewayPeeringAttachmentProps, _aws_cdk_aws_ec2_CfnTransitGatewayPeeringAttachment, _aws_cdk_aws_ec2_CfnTransitGatewayPeeringAttachment_PeeringAttachmentStatusProperty, _aws_cdk_aws_ec2_CfnTransitGatewayRouteProps, _aws_cdk_aws_ec2_CfnTransitGatewayRoute, _aws_cdk_aws_ec2_CfnTransitGatewayRouteTableProps, _aws_cdk_aws_ec2_CfnTransitGatewayRouteTable, _aws_cdk_aws_ec2_CfnTransitGatewayRouteTableAssociationProps, _aws_cdk_aws_ec2_CfnTransitGatewayRouteTableAssociation, _aws_cdk_aws_ec2_CfnTransitGatewayRouteTablePropagationProps, _aws_cdk_aws_ec2_CfnTransitGatewayRouteTablePropagation, _aws_cdk_aws_ec2_CfnTransitGatewayVpcAttachmentProps, _aws_cdk_aws_ec2_CfnTransitGatewayVpcAttachment, _aws_cdk_aws_ec2_CfnTransitGatewayVpcAttachment_OptionsProperty, _aws_cdk_aws_ec2_CfnVPCProps, _aws_cdk_aws_ec2_CfnVPC, _aws_cdk_aws_ec2_CfnVPCCidrBlockProps, _aws_cdk_aws_ec2_CfnVPCCidrBlock, _aws_cdk_aws_ec2_CfnVPCDHCPOptionsAssociationProps, _aws_cdk_aws_ec2_CfnVPCDHCPOptionsAssociation, _aws_cdk_aws_ec2_CfnVPCEndpointProps, _aws_cdk_aws_ec2_CfnVPCEndpoint, _aws_cdk_aws_ec2_CfnVPCEndpointConnectionNotificationProps, _aws_cdk_aws_ec2_CfnVPCEndpointConnectionNotification, _aws_cdk_aws_ec2_CfnVPCEndpointServiceProps, _aws_cdk_aws_ec2_CfnVPCEndpointService, _aws_cdk_aws_ec2_CfnVPCEndpointServicePermissionsProps, _aws_cdk_aws_ec2_CfnVPCEndpointServicePermissions, _aws_cdk_aws_ec2_CfnVPCGatewayAttachmentProps, _aws_cdk_aws_ec2_CfnVPCGatewayAttachment, _aws_cdk_aws_ec2_CfnVPCPeeringConnectionProps, _aws_cdk_aws_ec2_CfnVPCPeeringConnection, _aws_cdk_aws_ec2_CfnVPNConnectionProps, _aws_cdk_aws_ec2_CfnVPNConnection, _aws_cdk_aws_ec2_CfnVPNConnection_VpnTunnelOptionsSpecificationProperty, _aws_cdk_aws_ec2_CfnVPNConnectionRouteProps, _aws_cdk_aws_ec2_CfnVPNConnectionRoute, _aws_cdk_aws_ec2_CfnVPNGatewayProps, _aws_cdk_aws_ec2_CfnVPNGateway, _aws_cdk_aws_ec2_CfnVPNGatewayRoutePropagationProps, _aws_cdk_aws_ec2_CfnVPNGatewayRoutePropagation, _aws_cdk_aws_ec2_CfnVolumeProps, _aws_cdk_aws_ec2_CfnVolume, _aws_cdk_aws_ec2_CfnVolumeAttachmentProps, _aws_cdk_aws_ec2_CfnVolumeAttachment };
