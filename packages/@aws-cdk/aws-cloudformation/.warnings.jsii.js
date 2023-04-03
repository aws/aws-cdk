function _aws_cdk_aws_cloudformation_CloudFormationCapabilities(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/aws-cloudformation.CloudFormationCapabilities", "use `core.CfnCapabilities`");
        const ns = require("./lib/cloud-formation-capabilities.js");
        if (Object.values(ns.CloudFormationCapabilities).filter(x => x === p).length > 1)
            return;
        if (p === ns.CloudFormationCapabilities.NONE)
            print("@aws-cdk/aws-cloudformation.CloudFormationCapabilities#NONE", "");
        if (p === ns.CloudFormationCapabilities.ANONYMOUS_IAM)
            print("@aws-cdk/aws-cloudformation.CloudFormationCapabilities#ANONYMOUS_IAM", "");
        if (p === ns.CloudFormationCapabilities.NAMED_IAM)
            print("@aws-cdk/aws-cloudformation.CloudFormationCapabilities#NAMED_IAM", "");
        if (p === ns.CloudFormationCapabilities.AUTO_EXPAND)
            print("@aws-cdk/aws-cloudformation.CloudFormationCapabilities#AUTO_EXPAND", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudformation_CustomResourceProviderConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("serviceToken" in p)
            print("@aws-cdk/aws-cloudformation.CustomResourceProviderConfig#serviceToken", "used in `ICustomResourceProvider` which is now deprecated");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudformation_ICustomResourceProvider(p) {
}
function _aws_cdk_aws_cloudformation_CustomResourceProvider(p) {
}
function _aws_cdk_aws_cloudformation_CustomResourceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("provider" in p)
            print("@aws-cdk/aws-cloudformation.CustomResourceProps#provider", "use `core.CustomResourceProps`");
        if (!visitedObjects.has(p.provider))
            _aws_cdk_aws_cloudformation_ICustomResourceProvider(p.provider);
        if ("properties" in p)
            print("@aws-cdk/aws-cloudformation.CustomResourceProps#properties", "use `core.CustomResourceProps`");
        if ("removalPolicy" in p)
            print("@aws-cdk/aws-cloudformation.CustomResourceProps#removalPolicy", "use `core.CustomResourceProps`");
        if ("resourceType" in p)
            print("@aws-cdk/aws-cloudformation.CustomResourceProps#resourceType", "use `core.CustomResourceProps`");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudformation_CustomResource(p) {
}
function _aws_cdk_aws_cloudformation_NestedStackProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("notifications" in p)
            print("@aws-cdk/aws-cloudformation.NestedStackProps#notifications", "use core.NestedStackProps instead");
        if (p.notifications != null)
            for (const o of p.notifications)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-sns/.warnings.jsii.js")._aws_cdk_aws_sns_ITopic(o);
        if ("parameters" in p)
            print("@aws-cdk/aws-cloudformation.NestedStackProps#parameters", "use core.NestedStackProps instead");
        if ("timeout" in p)
            print("@aws-cdk/aws-cloudformation.NestedStackProps#timeout", "use core.NestedStackProps instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudformation_NestedStack(p) {
}
function _aws_cdk_aws_cloudformation_CfnCustomResourceProps(p) {
}
function _aws_cdk_aws_cloudformation_CfnCustomResource(p) {
}
function _aws_cdk_aws_cloudformation_CfnHookDefaultVersionProps(p) {
}
function _aws_cdk_aws_cloudformation_CfnHookDefaultVersion(p) {
}
function _aws_cdk_aws_cloudformation_CfnHookTypeConfigProps(p) {
}
function _aws_cdk_aws_cloudformation_CfnHookTypeConfig(p) {
}
function _aws_cdk_aws_cloudformation_CfnHookVersionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.loggingConfig))
            _aws_cdk_aws_cloudformation_CfnHookVersion_LoggingConfigProperty(p.loggingConfig);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cloudformation_CfnHookVersion(p) {
}
function _aws_cdk_aws_cloudformation_CfnHookVersion_LoggingConfigProperty(p) {
}
function _aws_cdk_aws_cloudformation_CfnMacroProps(p) {
}
function _aws_cdk_aws_cloudformation_CfnMacro(p) {
}
function _aws_cdk_aws_cloudformation_CfnModuleDefaultVersionProps(p) {
}
function _aws_cdk_aws_cloudformation_CfnModuleDefaultVersion(p) {
}
function _aws_cdk_aws_cloudformation_CfnModuleVersionProps(p) {
}
function _aws_cdk_aws_cloudformation_CfnModuleVersion(p) {
}
function _aws_cdk_aws_cloudformation_CfnPublicTypeVersionProps(p) {
}
function _aws_cdk_aws_cloudformation_CfnPublicTypeVersion(p) {
}
function _aws_cdk_aws_cloudformation_CfnPublisherProps(p) {
}
function _aws_cdk_aws_cloudformation_CfnPublisher(p) {
}
function _aws_cdk_aws_cloudformation_CfnResourceDefaultVersionProps(p) {
}
function _aws_cdk_aws_cloudformation_CfnResourceDefaultVersion(p) {
}
function _aws_cdk_aws_cloudformation_CfnResourceVersionProps(p) {
}
function _aws_cdk_aws_cloudformation_CfnResourceVersion(p) {
}
function _aws_cdk_aws_cloudformation_CfnResourceVersion_LoggingConfigProperty(p) {
}
function _aws_cdk_aws_cloudformation_CfnStackProps(p) {
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
function _aws_cdk_aws_cloudformation_CfnStack(p) {
}
function _aws_cdk_aws_cloudformation_CfnStackSetProps(p) {
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
function _aws_cdk_aws_cloudformation_CfnStackSet(p) {
}
function _aws_cdk_aws_cloudformation_CfnStackSet_AutoDeploymentProperty(p) {
}
function _aws_cdk_aws_cloudformation_CfnStackSet_DeploymentTargetsProperty(p) {
}
function _aws_cdk_aws_cloudformation_CfnStackSet_ManagedExecutionProperty(p) {
}
function _aws_cdk_aws_cloudformation_CfnStackSet_OperationPreferencesProperty(p) {
}
function _aws_cdk_aws_cloudformation_CfnStackSet_ParameterProperty(p) {
}
function _aws_cdk_aws_cloudformation_CfnStackSet_StackInstancesProperty(p) {
}
function _aws_cdk_aws_cloudformation_CfnTypeActivationProps(p) {
}
function _aws_cdk_aws_cloudformation_CfnTypeActivation(p) {
}
function _aws_cdk_aws_cloudformation_CfnTypeActivation_LoggingConfigProperty(p) {
}
function _aws_cdk_aws_cloudformation_CfnWaitConditionProps(p) {
}
function _aws_cdk_aws_cloudformation_CfnWaitCondition(p) {
}
function _aws_cdk_aws_cloudformation_CfnWaitConditionHandle(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_cloudformation_CloudFormationCapabilities, _aws_cdk_aws_cloudformation_CustomResourceProviderConfig, _aws_cdk_aws_cloudformation_ICustomResourceProvider, _aws_cdk_aws_cloudformation_CustomResourceProvider, _aws_cdk_aws_cloudformation_CustomResourceProps, _aws_cdk_aws_cloudformation_CustomResource, _aws_cdk_aws_cloudformation_NestedStackProps, _aws_cdk_aws_cloudformation_NestedStack, _aws_cdk_aws_cloudformation_CfnCustomResourceProps, _aws_cdk_aws_cloudformation_CfnCustomResource, _aws_cdk_aws_cloudformation_CfnHookDefaultVersionProps, _aws_cdk_aws_cloudformation_CfnHookDefaultVersion, _aws_cdk_aws_cloudformation_CfnHookTypeConfigProps, _aws_cdk_aws_cloudformation_CfnHookTypeConfig, _aws_cdk_aws_cloudformation_CfnHookVersionProps, _aws_cdk_aws_cloudformation_CfnHookVersion, _aws_cdk_aws_cloudformation_CfnHookVersion_LoggingConfigProperty, _aws_cdk_aws_cloudformation_CfnMacroProps, _aws_cdk_aws_cloudformation_CfnMacro, _aws_cdk_aws_cloudformation_CfnModuleDefaultVersionProps, _aws_cdk_aws_cloudformation_CfnModuleDefaultVersion, _aws_cdk_aws_cloudformation_CfnModuleVersionProps, _aws_cdk_aws_cloudformation_CfnModuleVersion, _aws_cdk_aws_cloudformation_CfnPublicTypeVersionProps, _aws_cdk_aws_cloudformation_CfnPublicTypeVersion, _aws_cdk_aws_cloudformation_CfnPublisherProps, _aws_cdk_aws_cloudformation_CfnPublisher, _aws_cdk_aws_cloudformation_CfnResourceDefaultVersionProps, _aws_cdk_aws_cloudformation_CfnResourceDefaultVersion, _aws_cdk_aws_cloudformation_CfnResourceVersionProps, _aws_cdk_aws_cloudformation_CfnResourceVersion, _aws_cdk_aws_cloudformation_CfnResourceVersion_LoggingConfigProperty, _aws_cdk_aws_cloudformation_CfnStackProps, _aws_cdk_aws_cloudformation_CfnStack, _aws_cdk_aws_cloudformation_CfnStackSetProps, _aws_cdk_aws_cloudformation_CfnStackSet, _aws_cdk_aws_cloudformation_CfnStackSet_AutoDeploymentProperty, _aws_cdk_aws_cloudformation_CfnStackSet_DeploymentTargetsProperty, _aws_cdk_aws_cloudformation_CfnStackSet_ManagedExecutionProperty, _aws_cdk_aws_cloudformation_CfnStackSet_OperationPreferencesProperty, _aws_cdk_aws_cloudformation_CfnStackSet_ParameterProperty, _aws_cdk_aws_cloudformation_CfnStackSet_StackInstancesProperty, _aws_cdk_aws_cloudformation_CfnTypeActivationProps, _aws_cdk_aws_cloudformation_CfnTypeActivation, _aws_cdk_aws_cloudformation_CfnTypeActivation_LoggingConfigProperty, _aws_cdk_aws_cloudformation_CfnWaitConditionProps, _aws_cdk_aws_cloudformation_CfnWaitCondition, _aws_cdk_aws_cloudformation_CfnWaitConditionHandle };
