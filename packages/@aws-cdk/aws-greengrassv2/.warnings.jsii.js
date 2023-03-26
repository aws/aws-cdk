function _aws_cdk_aws_greengrassv2_CfnComponentVersionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.lambdaFunction))
            _aws_cdk_aws_greengrassv2_CfnComponentVersion_LambdaFunctionRecipeSourceProperty(p.lambdaFunction);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_greengrassv2_CfnComponentVersion(p) {
}
function _aws_cdk_aws_greengrassv2_CfnComponentVersion_ComponentDependencyRequirementProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnComponentVersion_ComponentPlatformProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnComponentVersion_LambdaContainerParamsProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnComponentVersion_LambdaDeviceMountProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnComponentVersion_LambdaEventSourceProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnComponentVersion_LambdaExecutionParametersProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnComponentVersion_LambdaFunctionRecipeSourceProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnComponentVersion_LambdaLinuxProcessParamsProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnComponentVersion_LambdaVolumeMountProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnDeploymentProps(p) {
}
function _aws_cdk_aws_greengrassv2_CfnDeployment(p) {
}
function _aws_cdk_aws_greengrassv2_CfnDeployment_ComponentConfigurationUpdateProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnDeployment_ComponentDeploymentSpecificationProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnDeployment_ComponentRunWithProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnDeployment_DeploymentComponentUpdatePolicyProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnDeployment_DeploymentConfigurationValidationPolicyProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnDeployment_DeploymentIoTJobConfigurationProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnDeployment_DeploymentPoliciesProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnDeployment_IoTJobAbortConfigProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnDeployment_IoTJobAbortCriteriaProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnDeployment_IoTJobExecutionsRolloutConfigProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnDeployment_IoTJobExponentialRolloutRateProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnDeployment_IoTJobTimeoutConfigProperty(p) {
}
function _aws_cdk_aws_greengrassv2_CfnDeployment_SystemResourceLimitsProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_greengrassv2_CfnComponentVersionProps, _aws_cdk_aws_greengrassv2_CfnComponentVersion, _aws_cdk_aws_greengrassv2_CfnComponentVersion_ComponentDependencyRequirementProperty, _aws_cdk_aws_greengrassv2_CfnComponentVersion_ComponentPlatformProperty, _aws_cdk_aws_greengrassv2_CfnComponentVersion_LambdaContainerParamsProperty, _aws_cdk_aws_greengrassv2_CfnComponentVersion_LambdaDeviceMountProperty, _aws_cdk_aws_greengrassv2_CfnComponentVersion_LambdaEventSourceProperty, _aws_cdk_aws_greengrassv2_CfnComponentVersion_LambdaExecutionParametersProperty, _aws_cdk_aws_greengrassv2_CfnComponentVersion_LambdaFunctionRecipeSourceProperty, _aws_cdk_aws_greengrassv2_CfnComponentVersion_LambdaLinuxProcessParamsProperty, _aws_cdk_aws_greengrassv2_CfnComponentVersion_LambdaVolumeMountProperty, _aws_cdk_aws_greengrassv2_CfnDeploymentProps, _aws_cdk_aws_greengrassv2_CfnDeployment, _aws_cdk_aws_greengrassv2_CfnDeployment_ComponentConfigurationUpdateProperty, _aws_cdk_aws_greengrassv2_CfnDeployment_ComponentDeploymentSpecificationProperty, _aws_cdk_aws_greengrassv2_CfnDeployment_ComponentRunWithProperty, _aws_cdk_aws_greengrassv2_CfnDeployment_DeploymentComponentUpdatePolicyProperty, _aws_cdk_aws_greengrassv2_CfnDeployment_DeploymentConfigurationValidationPolicyProperty, _aws_cdk_aws_greengrassv2_CfnDeployment_DeploymentIoTJobConfigurationProperty, _aws_cdk_aws_greengrassv2_CfnDeployment_DeploymentPoliciesProperty, _aws_cdk_aws_greengrassv2_CfnDeployment_IoTJobAbortConfigProperty, _aws_cdk_aws_greengrassv2_CfnDeployment_IoTJobAbortCriteriaProperty, _aws_cdk_aws_greengrassv2_CfnDeployment_IoTJobExecutionsRolloutConfigProperty, _aws_cdk_aws_greengrassv2_CfnDeployment_IoTJobExponentialRolloutRateProperty, _aws_cdk_aws_greengrassv2_CfnDeployment_IoTJobTimeoutConfigProperty, _aws_cdk_aws_greengrassv2_CfnDeployment_SystemResourceLimitsProperty };
