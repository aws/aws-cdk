function _aws_cdk_aws_appconfig_alpha_EnvironmentAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("application" in p)
            print("@aws-cdk/aws-appconfig-alpha.EnvironmentAttributes#application", "");
        if (!visitedObjects.has(p.application))
            _aws_cdk_aws_appconfig_alpha_IApplication(p.application);
        if ("environmentId" in p)
            print("@aws-cdk/aws-appconfig-alpha.EnvironmentAttributes#environmentId", "");
        if ("description" in p)
            print("@aws-cdk/aws-appconfig-alpha.EnvironmentAttributes#description", "");
        if ("monitors" in p)
            print("@aws-cdk/aws-appconfig-alpha.EnvironmentAttributes#monitors", "");
        if (p.monitors != null)
            for (const o of p.monitors)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_Monitor(o);
        if ("name" in p)
            print("@aws-cdk/aws-appconfig-alpha.EnvironmentAttributes#name", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_EnvironmentOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("description" in p)
            print("@aws-cdk/aws-appconfig-alpha.EnvironmentOptions#description", "");
        if ("environmentName" in p)
            print("@aws-cdk/aws-appconfig-alpha.EnvironmentOptions#environmentName", "");
        if ("monitors" in p)
            print("@aws-cdk/aws-appconfig-alpha.EnvironmentOptions#monitors", "");
        if (p.monitors != null)
            for (const o of p.monitors)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_Monitor(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_EnvironmentProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("application" in p)
            print("@aws-cdk/aws-appconfig-alpha.EnvironmentProps#application", "");
        if (!visitedObjects.has(p.application))
            _aws_cdk_aws_appconfig_alpha_IApplication(p.application);
        if ("description" in p)
            print("@aws-cdk/aws-appconfig-alpha.EnvironmentOptions#description", "");
        if ("environmentName" in p)
            print("@aws-cdk/aws-appconfig-alpha.EnvironmentOptions#environmentName", "");
        if ("monitors" in p)
            print("@aws-cdk/aws-appconfig-alpha.EnvironmentOptions#monitors", "");
        if (p.monitors != null)
            for (const o of p.monitors)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_Monitor(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_Environment(p) {
}
function _aws_cdk_aws_appconfig_alpha_MonitorType(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/aws-appconfig-alpha.MonitorType", "");
        const ns = require("./lib/environment.js");
        if (Object.values(ns.MonitorType).filter(x => x === p).length > 1)
            return;
        if (p === ns.MonitorType.CLOUDWATCH)
            print("@aws-cdk/aws-appconfig-alpha.MonitorType#CLOUDWATCH", "");
        if (p === ns.MonitorType.CFN_MONITORS_PROPERTY)
            print("@aws-cdk/aws-appconfig-alpha.MonitorType#CFN_MONITORS_PROPERTY", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_Monitor(p) {
}
function _aws_cdk_aws_appconfig_alpha_IEnvironment(p) {
}
function _aws_cdk_aws_appconfig_alpha_DeploymentStrategyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("rolloutStrategy" in p)
            print("@aws-cdk/aws-appconfig-alpha.DeploymentStrategyProps#rolloutStrategy", "");
        if (!visitedObjects.has(p.rolloutStrategy))
            _aws_cdk_aws_appconfig_alpha_RolloutStrategy(p.rolloutStrategy);
        if ("deploymentStrategyName" in p)
            print("@aws-cdk/aws-appconfig-alpha.DeploymentStrategyProps#deploymentStrategyName", "");
        if ("description" in p)
            print("@aws-cdk/aws-appconfig-alpha.DeploymentStrategyProps#description", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_DeploymentStrategy(p) {
}
function _aws_cdk_aws_appconfig_alpha_GrowthType(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/aws-appconfig-alpha.GrowthType", "");
        const ns = require("./lib/deployment-strategy.js");
        if (Object.values(ns.GrowthType).filter(x => x === p).length > 1)
            return;
        if (p === ns.GrowthType.LINEAR)
            print("@aws-cdk/aws-appconfig-alpha.GrowthType#LINEAR", "");
        if (p === ns.GrowthType.EXPONENTIAL)
            print("@aws-cdk/aws-appconfig-alpha.GrowthType#EXPONENTIAL", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_DeploymentStrategyId(p) {
}
function _aws_cdk_aws_appconfig_alpha_RolloutStrategyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("deploymentDuration" in p)
            print("@aws-cdk/aws-appconfig-alpha.RolloutStrategyProps#deploymentDuration", "");
        if ("growthFactor" in p)
            print("@aws-cdk/aws-appconfig-alpha.RolloutStrategyProps#growthFactor", "");
        if ("finalBakeTime" in p)
            print("@aws-cdk/aws-appconfig-alpha.RolloutStrategyProps#finalBakeTime", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_RolloutStrategy(p) {
}
function _aws_cdk_aws_appconfig_alpha_IDeploymentStrategy(p) {
}
function _aws_cdk_aws_appconfig_alpha_ActionPoint(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/aws-appconfig-alpha.ActionPoint", "");
        const ns = require("./lib/extension.js");
        if (Object.values(ns.ActionPoint).filter(x => x === p).length > 1)
            return;
        if (p === ns.ActionPoint.PRE_CREATE_HOSTED_CONFIGURATION_VERSION)
            print("@aws-cdk/aws-appconfig-alpha.ActionPoint#PRE_CREATE_HOSTED_CONFIGURATION_VERSION", "");
        if (p === ns.ActionPoint.PRE_START_DEPLOYMENT)
            print("@aws-cdk/aws-appconfig-alpha.ActionPoint#PRE_START_DEPLOYMENT", "");
        if (p === ns.ActionPoint.ON_DEPLOYMENT_START)
            print("@aws-cdk/aws-appconfig-alpha.ActionPoint#ON_DEPLOYMENT_START", "");
        if (p === ns.ActionPoint.ON_DEPLOYMENT_STEP)
            print("@aws-cdk/aws-appconfig-alpha.ActionPoint#ON_DEPLOYMENT_STEP", "");
        if (p === ns.ActionPoint.ON_DEPLOYMENT_BAKING)
            print("@aws-cdk/aws-appconfig-alpha.ActionPoint#ON_DEPLOYMENT_BAKING", "");
        if (p === ns.ActionPoint.ON_DEPLOYMENT_COMPLETE)
            print("@aws-cdk/aws-appconfig-alpha.ActionPoint#ON_DEPLOYMENT_COMPLETE", "");
        if (p === ns.ActionPoint.ON_DEPLOYMENT_ROLLED_BACK)
            print("@aws-cdk/aws-appconfig-alpha.ActionPoint#ON_DEPLOYMENT_ROLLED_BACK", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_SourceType(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/aws-appconfig-alpha.SourceType", "");
        const ns = require("./lib/extension.js");
        if (Object.values(ns.SourceType).filter(x => x === p).length > 1)
            return;
        if (p === ns.SourceType.LAMBDA)
            print("@aws-cdk/aws-appconfig-alpha.SourceType#LAMBDA", "");
        if (p === ns.SourceType.SQS)
            print("@aws-cdk/aws-appconfig-alpha.SourceType#SQS", "");
        if (p === ns.SourceType.SNS)
            print("@aws-cdk/aws-appconfig-alpha.SourceType#SNS", "");
        if (p === ns.SourceType.EVENTS)
            print("@aws-cdk/aws-appconfig-alpha.SourceType#EVENTS", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_IEventDestination(p) {
}
function _aws_cdk_aws_appconfig_alpha_LambdaDestination(p) {
}
function _aws_cdk_aws_appconfig_alpha_SqsDestination(p) {
}
function _aws_cdk_aws_appconfig_alpha_SnsDestination(p) {
}
function _aws_cdk_aws_appconfig_alpha_EventBridgeDestination(p) {
}
function _aws_cdk_aws_appconfig_alpha_ActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("actionPoints" in p)
            print("@aws-cdk/aws-appconfig-alpha.ActionProps#actionPoints", "");
        if (p.actionPoints != null)
            for (const o of p.actionPoints)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_ActionPoint(o);
        if ("eventDestination" in p)
            print("@aws-cdk/aws-appconfig-alpha.ActionProps#eventDestination", "");
        if (!visitedObjects.has(p.eventDestination))
            _aws_cdk_aws_appconfig_alpha_IEventDestination(p.eventDestination);
        if ("description" in p)
            print("@aws-cdk/aws-appconfig-alpha.ActionProps#description", "");
        if ("executionRole" in p)
            print("@aws-cdk/aws-appconfig-alpha.ActionProps#executionRole", "");
        if ("invokeWithoutExecutionRole" in p)
            print("@aws-cdk/aws-appconfig-alpha.ActionProps#invokeWithoutExecutionRole", "");
        if ("name" in p)
            print("@aws-cdk/aws-appconfig-alpha.ActionProps#name", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_Action(p) {
}
function _aws_cdk_aws_appconfig_alpha_Parameter(p) {
}
function _aws_cdk_aws_appconfig_alpha_ExtensionAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("extensionId" in p)
            print("@aws-cdk/aws-appconfig-alpha.ExtensionAttributes#extensionId", "");
        if ("extensionVersionNumber" in p)
            print("@aws-cdk/aws-appconfig-alpha.ExtensionAttributes#extensionVersionNumber", "");
        if ("actions" in p)
            print("@aws-cdk/aws-appconfig-alpha.ExtensionAttributes#actions", "");
        if (p.actions != null)
            for (const o of p.actions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_Action(o);
        if ("description" in p)
            print("@aws-cdk/aws-appconfig-alpha.ExtensionAttributes#description", "");
        if ("extensionArn" in p)
            print("@aws-cdk/aws-appconfig-alpha.ExtensionAttributes#extensionArn", "");
        if ("name" in p)
            print("@aws-cdk/aws-appconfig-alpha.ExtensionAttributes#name", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_ExtensionOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("description" in p)
            print("@aws-cdk/aws-appconfig-alpha.ExtensionOptions#description", "");
        if ("extensionName" in p)
            print("@aws-cdk/aws-appconfig-alpha.ExtensionOptions#extensionName", "");
        if ("latestVersionNumber" in p)
            print("@aws-cdk/aws-appconfig-alpha.ExtensionOptions#latestVersionNumber", "");
        if ("parameters" in p)
            print("@aws-cdk/aws-appconfig-alpha.ExtensionOptions#parameters", "");
        if (p.parameters != null)
            for (const o of p.parameters)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_Parameter(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_ExtensionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("actions" in p)
            print("@aws-cdk/aws-appconfig-alpha.ExtensionProps#actions", "");
        if (p.actions != null)
            for (const o of p.actions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_Action(o);
        if ("description" in p)
            print("@aws-cdk/aws-appconfig-alpha.ExtensionOptions#description", "");
        if ("extensionName" in p)
            print("@aws-cdk/aws-appconfig-alpha.ExtensionOptions#extensionName", "");
        if ("latestVersionNumber" in p)
            print("@aws-cdk/aws-appconfig-alpha.ExtensionOptions#latestVersionNumber", "");
        if ("parameters" in p)
            print("@aws-cdk/aws-appconfig-alpha.ExtensionOptions#parameters", "");
        if (p.parameters != null)
            for (const o of p.parameters)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_Parameter(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_Extension(p) {
}
function _aws_cdk_aws_appconfig_alpha_IExtension(p) {
}
function _aws_cdk_aws_appconfig_alpha_ExtensibleBase(p) {
}
function _aws_cdk_aws_appconfig_alpha_IExtensible(p) {
}
function _aws_cdk_aws_appconfig_alpha_Platform(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/aws-appconfig-alpha.Platform", "");
        const ns = require("./lib/application.js");
        if (Object.values(ns.Platform).filter(x => x === p).length > 1)
            return;
        if (p === ns.Platform.X86_64)
            print("@aws-cdk/aws-appconfig-alpha.Platform#X86_64", "");
        if (p === ns.Platform.ARM_64)
            print("@aws-cdk/aws-appconfig-alpha.Platform#ARM_64", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_IApplication(p) {
}
function _aws_cdk_aws_appconfig_alpha_ApplicationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("applicationName" in p)
            print("@aws-cdk/aws-appconfig-alpha.ApplicationProps#applicationName", "");
        if ("description" in p)
            print("@aws-cdk/aws-appconfig-alpha.ApplicationProps#description", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_Application(p) {
}
function _aws_cdk_aws_appconfig_alpha_ConfigurationOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("deploymentKey" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deploymentKey", "");
        if ("deploymentStrategy" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deploymentStrategy", "");
        if (!visitedObjects.has(p.deploymentStrategy))
            _aws_cdk_aws_appconfig_alpha_IDeploymentStrategy(p.deploymentStrategy);
        if ("deployTo" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deployTo", "");
        if (p.deployTo != null)
            for (const o of p.deployTo)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_IEnvironment(o);
        if ("description" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#description", "");
        if ("name" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#name", "");
        if ("type" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#type", "");
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_appconfig_alpha_ConfigurationType(p.type);
        if ("validators" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#validators", "");
        if (p.validators != null)
            for (const o of p.validators)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_IValidator(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_ConfigurationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("application" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationProps#application", "");
        if (!visitedObjects.has(p.application))
            _aws_cdk_aws_appconfig_alpha_IApplication(p.application);
        if ("deploymentKey" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deploymentKey", "");
        if ("deploymentStrategy" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deploymentStrategy", "");
        if (!visitedObjects.has(p.deploymentStrategy))
            _aws_cdk_aws_appconfig_alpha_IDeploymentStrategy(p.deploymentStrategy);
        if ("deployTo" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deployTo", "");
        if (p.deployTo != null)
            for (const o of p.deployTo)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_IEnvironment(o);
        if ("description" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#description", "");
        if ("name" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#name", "");
        if ("type" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#type", "");
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_appconfig_alpha_ConfigurationType(p.type);
        if ("validators" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#validators", "");
        if (p.validators != null)
            for (const o of p.validators)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_IValidator(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_IConfiguration(p) {
}
function _aws_cdk_aws_appconfig_alpha_HostedConfigurationOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("content" in p)
            print("@aws-cdk/aws-appconfig-alpha.HostedConfigurationOptions#content", "");
        if (!visitedObjects.has(p.content))
            _aws_cdk_aws_appconfig_alpha_ConfigurationContent(p.content);
        if ("latestVersionNumber" in p)
            print("@aws-cdk/aws-appconfig-alpha.HostedConfigurationOptions#latestVersionNumber", "");
        if ("versionLabel" in p)
            print("@aws-cdk/aws-appconfig-alpha.HostedConfigurationOptions#versionLabel", "");
        if ("deploymentKey" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deploymentKey", "");
        if ("deploymentStrategy" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deploymentStrategy", "");
        if (!visitedObjects.has(p.deploymentStrategy))
            _aws_cdk_aws_appconfig_alpha_IDeploymentStrategy(p.deploymentStrategy);
        if ("deployTo" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deployTo", "");
        if (p.deployTo != null)
            for (const o of p.deployTo)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_IEnvironment(o);
        if ("description" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#description", "");
        if ("name" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#name", "");
        if ("type" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#type", "");
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_appconfig_alpha_ConfigurationType(p.type);
        if ("validators" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#validators", "");
        if (p.validators != null)
            for (const o of p.validators)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_IValidator(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_HostedConfigurationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("content" in p)
            print("@aws-cdk/aws-appconfig-alpha.HostedConfigurationProps#content", "");
        if (!visitedObjects.has(p.content))
            _aws_cdk_aws_appconfig_alpha_ConfigurationContent(p.content);
        if ("latestVersionNumber" in p)
            print("@aws-cdk/aws-appconfig-alpha.HostedConfigurationProps#latestVersionNumber", "");
        if ("versionLabel" in p)
            print("@aws-cdk/aws-appconfig-alpha.HostedConfigurationProps#versionLabel", "");
        if ("application" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationProps#application", "");
        if (!visitedObjects.has(p.application))
            _aws_cdk_aws_appconfig_alpha_IApplication(p.application);
        if ("deploymentKey" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deploymentKey", "");
        if ("deploymentStrategy" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deploymentStrategy", "");
        if (!visitedObjects.has(p.deploymentStrategy))
            _aws_cdk_aws_appconfig_alpha_IDeploymentStrategy(p.deploymentStrategy);
        if ("deployTo" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deployTo", "");
        if (p.deployTo != null)
            for (const o of p.deployTo)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_IEnvironment(o);
        if ("description" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#description", "");
        if ("name" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#name", "");
        if ("type" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#type", "");
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_appconfig_alpha_ConfigurationType(p.type);
        if ("validators" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#validators", "");
        if (p.validators != null)
            for (const o of p.validators)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_IValidator(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_HostedConfiguration(p) {
}
function _aws_cdk_aws_appconfig_alpha_SourcedConfigurationOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("location" in p)
            print("@aws-cdk/aws-appconfig-alpha.SourcedConfigurationOptions#location", "");
        if (!visitedObjects.has(p.location))
            _aws_cdk_aws_appconfig_alpha_ConfigurationSource(p.location);
        if ("retrievalRole" in p)
            print("@aws-cdk/aws-appconfig-alpha.SourcedConfigurationOptions#retrievalRole", "");
        if ("versionNumber" in p)
            print("@aws-cdk/aws-appconfig-alpha.SourcedConfigurationOptions#versionNumber", "");
        if ("deploymentKey" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deploymentKey", "");
        if ("deploymentStrategy" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deploymentStrategy", "");
        if (!visitedObjects.has(p.deploymentStrategy))
            _aws_cdk_aws_appconfig_alpha_IDeploymentStrategy(p.deploymentStrategy);
        if ("deployTo" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deployTo", "");
        if (p.deployTo != null)
            for (const o of p.deployTo)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_IEnvironment(o);
        if ("description" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#description", "");
        if ("name" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#name", "");
        if ("type" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#type", "");
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_appconfig_alpha_ConfigurationType(p.type);
        if ("validators" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#validators", "");
        if (p.validators != null)
            for (const o of p.validators)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_IValidator(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_SourcedConfigurationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("location" in p)
            print("@aws-cdk/aws-appconfig-alpha.SourcedConfigurationProps#location", "");
        if (!visitedObjects.has(p.location))
            _aws_cdk_aws_appconfig_alpha_ConfigurationSource(p.location);
        if ("retrievalRole" in p)
            print("@aws-cdk/aws-appconfig-alpha.SourcedConfigurationProps#retrievalRole", "");
        if ("versionNumber" in p)
            print("@aws-cdk/aws-appconfig-alpha.SourcedConfigurationProps#versionNumber", "");
        if ("application" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationProps#application", "");
        if (!visitedObjects.has(p.application))
            _aws_cdk_aws_appconfig_alpha_IApplication(p.application);
        if ("deploymentKey" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deploymentKey", "");
        if ("deploymentStrategy" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deploymentStrategy", "");
        if (!visitedObjects.has(p.deploymentStrategy))
            _aws_cdk_aws_appconfig_alpha_IDeploymentStrategy(p.deploymentStrategy);
        if ("deployTo" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#deployTo", "");
        if (p.deployTo != null)
            for (const o of p.deployTo)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_IEnvironment(o);
        if ("description" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#description", "");
        if ("name" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#name", "");
        if ("type" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#type", "");
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_appconfig_alpha_ConfigurationType(p.type);
        if ("validators" in p)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationOptions#validators", "");
        if (p.validators != null)
            for (const o of p.validators)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_alpha_IValidator(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_SourcedConfiguration(p) {
}
function _aws_cdk_aws_appconfig_alpha_ConfigurationType(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/aws-appconfig-alpha.ConfigurationType", "");
        const ns = require("./lib/configuration.js");
        if (Object.values(ns.ConfigurationType).filter(x => x === p).length > 1)
            return;
        if (p === ns.ConfigurationType.FREEFORM)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationType#FREEFORM", "");
        if (p === ns.ConfigurationType.FEATURE_FLAGS)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationType#FEATURE_FLAGS", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_ValidatorType(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/aws-appconfig-alpha.ValidatorType", "");
        const ns = require("./lib/configuration.js");
        if (Object.values(ns.ValidatorType).filter(x => x === p).length > 1)
            return;
        if (p === ns.ValidatorType.JSON_SCHEMA)
            print("@aws-cdk/aws-appconfig-alpha.ValidatorType#JSON_SCHEMA", "");
        if (p === ns.ValidatorType.LAMBDA)
            print("@aws-cdk/aws-appconfig-alpha.ValidatorType#LAMBDA", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_ConfigurationSourceType(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/aws-appconfig-alpha.ConfigurationSourceType", "");
        const ns = require("./lib/configuration.js");
        if (Object.values(ns.ConfigurationSourceType).filter(x => x === p).length > 1)
            return;
        if (p === ns.ConfigurationSourceType.S3)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationSourceType#S3", "");
        if (p === ns.ConfigurationSourceType.SECRETS_MANAGER)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationSourceType#SECRETS_MANAGER", "");
        if (p === ns.ConfigurationSourceType.SSM_PARAMETER)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationSourceType#SSM_PARAMETER", "");
        if (p === ns.ConfigurationSourceType.SSM_DOCUMENT)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationSourceType#SSM_DOCUMENT", "");
        if (p === ns.ConfigurationSourceType.CODE_PIPELINE)
            print("@aws-cdk/aws-appconfig-alpha.ConfigurationSourceType#CODE_PIPELINE", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_alpha_IValidator(p) {
}
function _aws_cdk_aws_appconfig_alpha_JsonSchemaValidator(p) {
}
function _aws_cdk_aws_appconfig_alpha_LambdaValidator(p) {
}
function _aws_cdk_aws_appconfig_alpha_ConfigurationContent(p) {
}
function _aws_cdk_aws_appconfig_alpha_ConfigurationSource(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_appconfig_alpha_EnvironmentAttributes, _aws_cdk_aws_appconfig_alpha_EnvironmentOptions, _aws_cdk_aws_appconfig_alpha_EnvironmentProps, _aws_cdk_aws_appconfig_alpha_Environment, _aws_cdk_aws_appconfig_alpha_MonitorType, _aws_cdk_aws_appconfig_alpha_Monitor, _aws_cdk_aws_appconfig_alpha_IEnvironment, _aws_cdk_aws_appconfig_alpha_DeploymentStrategyProps, _aws_cdk_aws_appconfig_alpha_DeploymentStrategy, _aws_cdk_aws_appconfig_alpha_GrowthType, _aws_cdk_aws_appconfig_alpha_DeploymentStrategyId, _aws_cdk_aws_appconfig_alpha_RolloutStrategyProps, _aws_cdk_aws_appconfig_alpha_RolloutStrategy, _aws_cdk_aws_appconfig_alpha_IDeploymentStrategy, _aws_cdk_aws_appconfig_alpha_ActionPoint, _aws_cdk_aws_appconfig_alpha_SourceType, _aws_cdk_aws_appconfig_alpha_IEventDestination, _aws_cdk_aws_appconfig_alpha_LambdaDestination, _aws_cdk_aws_appconfig_alpha_SqsDestination, _aws_cdk_aws_appconfig_alpha_SnsDestination, _aws_cdk_aws_appconfig_alpha_EventBridgeDestination, _aws_cdk_aws_appconfig_alpha_ActionProps, _aws_cdk_aws_appconfig_alpha_Action, _aws_cdk_aws_appconfig_alpha_Parameter, _aws_cdk_aws_appconfig_alpha_ExtensionAttributes, _aws_cdk_aws_appconfig_alpha_ExtensionOptions, _aws_cdk_aws_appconfig_alpha_ExtensionProps, _aws_cdk_aws_appconfig_alpha_Extension, _aws_cdk_aws_appconfig_alpha_IExtension, _aws_cdk_aws_appconfig_alpha_ExtensibleBase, _aws_cdk_aws_appconfig_alpha_IExtensible, _aws_cdk_aws_appconfig_alpha_Platform, _aws_cdk_aws_appconfig_alpha_IApplication, _aws_cdk_aws_appconfig_alpha_ApplicationProps, _aws_cdk_aws_appconfig_alpha_Application, _aws_cdk_aws_appconfig_alpha_ConfigurationOptions, _aws_cdk_aws_appconfig_alpha_ConfigurationProps, _aws_cdk_aws_appconfig_alpha_IConfiguration, _aws_cdk_aws_appconfig_alpha_HostedConfigurationOptions, _aws_cdk_aws_appconfig_alpha_HostedConfigurationProps, _aws_cdk_aws_appconfig_alpha_HostedConfiguration, _aws_cdk_aws_appconfig_alpha_SourcedConfigurationOptions, _aws_cdk_aws_appconfig_alpha_SourcedConfigurationProps, _aws_cdk_aws_appconfig_alpha_SourcedConfiguration, _aws_cdk_aws_appconfig_alpha_ConfigurationType, _aws_cdk_aws_appconfig_alpha_ValidatorType, _aws_cdk_aws_appconfig_alpha_ConfigurationSourceType, _aws_cdk_aws_appconfig_alpha_IValidator, _aws_cdk_aws_appconfig_alpha_JsonSchemaValidator, _aws_cdk_aws_appconfig_alpha_LambdaValidator, _aws_cdk_aws_appconfig_alpha_ConfigurationContent, _aws_cdk_aws_appconfig_alpha_ConfigurationSource };
