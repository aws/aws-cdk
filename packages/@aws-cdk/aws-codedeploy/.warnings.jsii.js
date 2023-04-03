function _aws_cdk_aws_codedeploy_IBaseDeploymentConfig(p) {
}
function _aws_cdk_aws_codedeploy_BaseDeploymentConfigOptions(p) {
}
function _aws_cdk_aws_codedeploy_ComputePlatform(p) {
}
function _aws_cdk_aws_codedeploy_BaseDeploymentConfigProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.computePlatform))
            _aws_cdk_aws_codedeploy_ComputePlatform(p.computePlatform);
        if (!visitedObjects.has(p.minimumHealthyHosts))
            _aws_cdk_aws_codedeploy_MinimumHealthyHosts(p.minimumHealthyHosts);
        if (!visitedObjects.has(p.trafficRouting))
            _aws_cdk_aws_codedeploy_TrafficRouting(p.trafficRouting);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codedeploy_BaseDeploymentConfig(p) {
}
function _aws_cdk_aws_codedeploy_MinimumHealthyHosts(p) {
}
function _aws_cdk_aws_codedeploy_AutoRollbackConfig(p) {
}
function _aws_cdk_aws_codedeploy_TrafficRoutingConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.timeBasedCanary))
            _aws_cdk_aws_codedeploy_CanaryTrafficRoutingConfig(p.timeBasedCanary);
        if (!visitedObjects.has(p.timeBasedLinear))
            _aws_cdk_aws_codedeploy_LinearTrafficRoutingConfig(p.timeBasedLinear);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codedeploy_CanaryTrafficRoutingConfig(p) {
}
function _aws_cdk_aws_codedeploy_LinearTrafficRoutingConfig(p) {
}
function _aws_cdk_aws_codedeploy_TrafficRouting(p) {
}
function _aws_cdk_aws_codedeploy_BaseTrafficShiftingConfigProps(p) {
}
function _aws_cdk_aws_codedeploy_AllAtOnceTrafficRouting(p) {
}
function _aws_cdk_aws_codedeploy_TimeBasedCanaryTrafficRoutingProps(p) {
}
function _aws_cdk_aws_codedeploy_TimeBasedCanaryTrafficRouting(p) {
}
function _aws_cdk_aws_codedeploy_TimeBasedLinearTrafficRoutingProps(p) {
}
function _aws_cdk_aws_codedeploy_TimeBasedLinearTrafficRouting(p) {
}
function _aws_cdk_aws_codedeploy_IEcsApplication(p) {
}
function _aws_cdk_aws_codedeploy_EcsApplicationProps(p) {
}
function _aws_cdk_aws_codedeploy_EcsApplication(p) {
}
function _aws_cdk_aws_codedeploy_IEcsDeploymentConfig(p) {
}
function _aws_cdk_aws_codedeploy_EcsDeploymentConfigProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.trafficRouting))
            _aws_cdk_aws_codedeploy_TrafficRouting(p.trafficRouting);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codedeploy_EcsDeploymentConfig(p) {
}
function _aws_cdk_aws_codedeploy_IEcsDeploymentGroup(p) {
}
function _aws_cdk_aws_codedeploy_EcsBlueGreenDeploymentConfig(p) {
}
function _aws_cdk_aws_codedeploy_EcsDeploymentGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.blueGreenDeploymentConfig))
            _aws_cdk_aws_codedeploy_EcsBlueGreenDeploymentConfig(p.blueGreenDeploymentConfig);
        if (p.alarms != null)
            for (const o of p.alarms)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-cloudwatch/.warnings.jsii.js")._aws_cdk_aws_cloudwatch_IAlarm(o);
        if (!visitedObjects.has(p.application))
            _aws_cdk_aws_codedeploy_IEcsApplication(p.application);
        if (!visitedObjects.has(p.autoRollback))
            _aws_cdk_aws_codedeploy_AutoRollbackConfig(p.autoRollback);
        if (!visitedObjects.has(p.deploymentConfig))
            _aws_cdk_aws_codedeploy_IEcsDeploymentConfig(p.deploymentConfig);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codedeploy_EcsDeploymentGroup(p) {
}
function _aws_cdk_aws_codedeploy_EcsDeploymentGroupAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.application))
            _aws_cdk_aws_codedeploy_IEcsApplication(p.application);
        if (!visitedObjects.has(p.deploymentConfig))
            _aws_cdk_aws_codedeploy_IEcsDeploymentConfig(p.deploymentConfig);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codedeploy_ILambdaApplication(p) {
}
function _aws_cdk_aws_codedeploy_LambdaApplicationProps(p) {
}
function _aws_cdk_aws_codedeploy_LambdaApplication(p) {
}
function _aws_cdk_aws_codedeploy_CustomLambdaDeploymentConfigType(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/aws-codedeploy.CustomLambdaDeploymentConfigType", "Use `LambdaDeploymentConfig`");
        const ns = require("./lib/lambda/custom-deployment-config.js");
        if (Object.values(ns.CustomLambdaDeploymentConfigType).filter(x => x === p).length > 1)
            return;
        if (p === ns.CustomLambdaDeploymentConfigType.CANARY)
            print("@aws-cdk/aws-codedeploy.CustomLambdaDeploymentConfigType#CANARY", "Use `LambdaDeploymentConfig`");
        if (p === ns.CustomLambdaDeploymentConfigType.LINEAR)
            print("@aws-cdk/aws-codedeploy.CustomLambdaDeploymentConfigType#LINEAR", "Use `LambdaDeploymentConfig`");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codedeploy_CustomLambdaDeploymentConfigProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("interval" in p)
            print("@aws-cdk/aws-codedeploy.CustomLambdaDeploymentConfigProps#interval", "Use `LambdaDeploymentConfig`");
        if ("percentage" in p)
            print("@aws-cdk/aws-codedeploy.CustomLambdaDeploymentConfigProps#percentage", "Use `LambdaDeploymentConfig`");
        if ("type" in p)
            print("@aws-cdk/aws-codedeploy.CustomLambdaDeploymentConfigProps#type", "Use `LambdaDeploymentConfig`");
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_codedeploy_CustomLambdaDeploymentConfigType(p.type);
        if ("deploymentConfigName" in p)
            print("@aws-cdk/aws-codedeploy.CustomLambdaDeploymentConfigProps#deploymentConfigName", "Use `LambdaDeploymentConfig`");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codedeploy_CustomLambdaDeploymentConfig(p) {
}
function _aws_cdk_aws_codedeploy_ILambdaDeploymentConfig(p) {
}
function _aws_cdk_aws_codedeploy_LambdaDeploymentConfigImportProps(p) {
}
function _aws_cdk_aws_codedeploy_LambdaDeploymentConfigProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.trafficRouting))
            _aws_cdk_aws_codedeploy_TrafficRouting(p.trafficRouting);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codedeploy_LambdaDeploymentConfig(p) {
}
function _aws_cdk_aws_codedeploy_ILambdaDeploymentGroup(p) {
}
function _aws_cdk_aws_codedeploy_LambdaDeploymentGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.alarms != null)
            for (const o of p.alarms)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-cloudwatch/.warnings.jsii.js")._aws_cdk_aws_cloudwatch_IAlarm(o);
        if (!visitedObjects.has(p.application))
            _aws_cdk_aws_codedeploy_ILambdaApplication(p.application);
        if (!visitedObjects.has(p.autoRollback))
            _aws_cdk_aws_codedeploy_AutoRollbackConfig(p.autoRollback);
        if (!visitedObjects.has(p.deploymentConfig))
            _aws_cdk_aws_codedeploy_ILambdaDeploymentConfig(p.deploymentConfig);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codedeploy_LambdaDeploymentGroup(p) {
}
function _aws_cdk_aws_codedeploy_LambdaDeploymentGroupAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.application))
            _aws_cdk_aws_codedeploy_ILambdaApplication(p.application);
        if (!visitedObjects.has(p.deploymentConfig))
            _aws_cdk_aws_codedeploy_ILambdaDeploymentConfig(p.deploymentConfig);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codedeploy_IServerApplication(p) {
}
function _aws_cdk_aws_codedeploy_ServerApplicationProps(p) {
}
function _aws_cdk_aws_codedeploy_ServerApplication(p) {
}
function _aws_cdk_aws_codedeploy_IServerDeploymentConfig(p) {
}
function _aws_cdk_aws_codedeploy_ServerDeploymentConfigProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.minimumHealthyHosts))
            _aws_cdk_aws_codedeploy_MinimumHealthyHosts(p.minimumHealthyHosts);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codedeploy_ServerDeploymentConfig(p) {
}
function _aws_cdk_aws_codedeploy_IServerDeploymentGroup(p) {
}
function _aws_cdk_aws_codedeploy_ServerDeploymentGroupAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.application))
            _aws_cdk_aws_codedeploy_IServerApplication(p.application);
        if (!visitedObjects.has(p.deploymentConfig))
            _aws_cdk_aws_codedeploy_IServerDeploymentConfig(p.deploymentConfig);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codedeploy_InstanceTagSet(p) {
}
function _aws_cdk_aws_codedeploy_ServerDeploymentGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.alarms != null)
            for (const o of p.alarms)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-cloudwatch/.warnings.jsii.js")._aws_cdk_aws_cloudwatch_IAlarm(o);
        if (!visitedObjects.has(p.application))
            _aws_cdk_aws_codedeploy_IServerApplication(p.application);
        if (!visitedObjects.has(p.autoRollback))
            _aws_cdk_aws_codedeploy_AutoRollbackConfig(p.autoRollback);
        if (p.autoScalingGroups != null)
            for (const o of p.autoScalingGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-autoscaling/.warnings.jsii.js")._aws_cdk_aws_autoscaling_IAutoScalingGroup(o);
        if (!visitedObjects.has(p.deploymentConfig))
            _aws_cdk_aws_codedeploy_IServerDeploymentConfig(p.deploymentConfig);
        if (!visitedObjects.has(p.ec2InstanceTags))
            _aws_cdk_aws_codedeploy_InstanceTagSet(p.ec2InstanceTags);
        if (!visitedObjects.has(p.loadBalancer))
            _aws_cdk_aws_codedeploy_LoadBalancer(p.loadBalancer);
        if (!visitedObjects.has(p.onPremiseInstanceTags))
            _aws_cdk_aws_codedeploy_InstanceTagSet(p.onPremiseInstanceTags);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codedeploy_ServerDeploymentGroup(p) {
}
function _aws_cdk_aws_codedeploy_LoadBalancerGeneration(p) {
}
function _aws_cdk_aws_codedeploy_LoadBalancer(p) {
}
function _aws_cdk_aws_codedeploy_CfnApplicationProps(p) {
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
function _aws_cdk_aws_codedeploy_CfnApplication(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentConfigProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.minimumHealthyHosts))
            _aws_cdk_aws_codedeploy_CfnDeploymentConfig_MinimumHealthyHostsProperty(p.minimumHealthyHosts);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_codedeploy_CfnDeploymentConfig(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentConfig_MinimumHealthyHostsProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentConfig_TimeBasedCanaryProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentConfig_TimeBasedLinearProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentConfig_TrafficRoutingConfigProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroupProps(p) {
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
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_AlarmProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_AlarmConfigurationProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_AutoRollbackConfigurationProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_BlueGreenDeploymentConfigurationProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_BlueInstanceTerminationOptionProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_DeploymentProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_DeploymentReadyOptionProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_DeploymentStyleProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_EC2TagFilterProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_EC2TagSetProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_EC2TagSetListObjectProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_ECSServiceProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_ELBInfoProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_GitHubLocationProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_GreenFleetProvisioningOptionProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_LoadBalancerInfoProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_OnPremisesTagSetProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_OnPremisesTagSetListObjectProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_RevisionLocationProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_S3LocationProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_TagFilterProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_TargetGroupInfoProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_TargetGroupPairInfoProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_TrafficRouteProperty(p) {
}
function _aws_cdk_aws_codedeploy_CfnDeploymentGroup_TriggerConfigProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_codedeploy_IBaseDeploymentConfig, _aws_cdk_aws_codedeploy_BaseDeploymentConfigOptions, _aws_cdk_aws_codedeploy_ComputePlatform, _aws_cdk_aws_codedeploy_BaseDeploymentConfigProps, _aws_cdk_aws_codedeploy_BaseDeploymentConfig, _aws_cdk_aws_codedeploy_MinimumHealthyHosts, _aws_cdk_aws_codedeploy_AutoRollbackConfig, _aws_cdk_aws_codedeploy_TrafficRoutingConfig, _aws_cdk_aws_codedeploy_CanaryTrafficRoutingConfig, _aws_cdk_aws_codedeploy_LinearTrafficRoutingConfig, _aws_cdk_aws_codedeploy_TrafficRouting, _aws_cdk_aws_codedeploy_BaseTrafficShiftingConfigProps, _aws_cdk_aws_codedeploy_AllAtOnceTrafficRouting, _aws_cdk_aws_codedeploy_TimeBasedCanaryTrafficRoutingProps, _aws_cdk_aws_codedeploy_TimeBasedCanaryTrafficRouting, _aws_cdk_aws_codedeploy_TimeBasedLinearTrafficRoutingProps, _aws_cdk_aws_codedeploy_TimeBasedLinearTrafficRouting, _aws_cdk_aws_codedeploy_IEcsApplication, _aws_cdk_aws_codedeploy_EcsApplicationProps, _aws_cdk_aws_codedeploy_EcsApplication, _aws_cdk_aws_codedeploy_IEcsDeploymentConfig, _aws_cdk_aws_codedeploy_EcsDeploymentConfigProps, _aws_cdk_aws_codedeploy_EcsDeploymentConfig, _aws_cdk_aws_codedeploy_IEcsDeploymentGroup, _aws_cdk_aws_codedeploy_EcsBlueGreenDeploymentConfig, _aws_cdk_aws_codedeploy_EcsDeploymentGroupProps, _aws_cdk_aws_codedeploy_EcsDeploymentGroup, _aws_cdk_aws_codedeploy_EcsDeploymentGroupAttributes, _aws_cdk_aws_codedeploy_ILambdaApplication, _aws_cdk_aws_codedeploy_LambdaApplicationProps, _aws_cdk_aws_codedeploy_LambdaApplication, _aws_cdk_aws_codedeploy_CustomLambdaDeploymentConfigType, _aws_cdk_aws_codedeploy_CustomLambdaDeploymentConfigProps, _aws_cdk_aws_codedeploy_CustomLambdaDeploymentConfig, _aws_cdk_aws_codedeploy_ILambdaDeploymentConfig, _aws_cdk_aws_codedeploy_LambdaDeploymentConfigImportProps, _aws_cdk_aws_codedeploy_LambdaDeploymentConfigProps, _aws_cdk_aws_codedeploy_LambdaDeploymentConfig, _aws_cdk_aws_codedeploy_ILambdaDeploymentGroup, _aws_cdk_aws_codedeploy_LambdaDeploymentGroupProps, _aws_cdk_aws_codedeploy_LambdaDeploymentGroup, _aws_cdk_aws_codedeploy_LambdaDeploymentGroupAttributes, _aws_cdk_aws_codedeploy_IServerApplication, _aws_cdk_aws_codedeploy_ServerApplicationProps, _aws_cdk_aws_codedeploy_ServerApplication, _aws_cdk_aws_codedeploy_IServerDeploymentConfig, _aws_cdk_aws_codedeploy_ServerDeploymentConfigProps, _aws_cdk_aws_codedeploy_ServerDeploymentConfig, _aws_cdk_aws_codedeploy_IServerDeploymentGroup, _aws_cdk_aws_codedeploy_ServerDeploymentGroupAttributes, _aws_cdk_aws_codedeploy_InstanceTagSet, _aws_cdk_aws_codedeploy_ServerDeploymentGroupProps, _aws_cdk_aws_codedeploy_ServerDeploymentGroup, _aws_cdk_aws_codedeploy_LoadBalancerGeneration, _aws_cdk_aws_codedeploy_LoadBalancer, _aws_cdk_aws_codedeploy_CfnApplicationProps, _aws_cdk_aws_codedeploy_CfnApplication, _aws_cdk_aws_codedeploy_CfnDeploymentConfigProps, _aws_cdk_aws_codedeploy_CfnDeploymentConfig, _aws_cdk_aws_codedeploy_CfnDeploymentConfig_MinimumHealthyHostsProperty, _aws_cdk_aws_codedeploy_CfnDeploymentConfig_TimeBasedCanaryProperty, _aws_cdk_aws_codedeploy_CfnDeploymentConfig_TimeBasedLinearProperty, _aws_cdk_aws_codedeploy_CfnDeploymentConfig_TrafficRoutingConfigProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroupProps, _aws_cdk_aws_codedeploy_CfnDeploymentGroup, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_AlarmProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_AlarmConfigurationProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_AutoRollbackConfigurationProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_BlueGreenDeploymentConfigurationProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_BlueInstanceTerminationOptionProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_DeploymentProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_DeploymentReadyOptionProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_DeploymentStyleProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_EC2TagFilterProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_EC2TagSetProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_EC2TagSetListObjectProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_ECSServiceProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_ELBInfoProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_GitHubLocationProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_GreenFleetProvisioningOptionProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_LoadBalancerInfoProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_OnPremisesTagSetProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_OnPremisesTagSetListObjectProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_RevisionLocationProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_S3LocationProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_TagFilterProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_TargetGroupInfoProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_TargetGroupPairInfoProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_TrafficRouteProperty, _aws_cdk_aws_codedeploy_CfnDeploymentGroup_TriggerConfigProperty };
