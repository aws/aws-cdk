function _aws_cdk_aws_appconfig_CfnApplicationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_CfnApplication_TagsProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_CfnApplication(p) {
}
function _aws_cdk_aws_appconfig_CfnApplication_TagsProperty(p) {
}
function _aws_cdk_aws_appconfig_CfnConfigurationProfileProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_CfnConfigurationProfile_TagsProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_CfnConfigurationProfile(p) {
}
function _aws_cdk_aws_appconfig_CfnConfigurationProfile_TagsProperty(p) {
}
function _aws_cdk_aws_appconfig_CfnConfigurationProfile_ValidatorsProperty(p) {
}
function _aws_cdk_aws_appconfig_CfnDeploymentProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_CfnDeployment_TagsProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_CfnDeployment(p) {
}
function _aws_cdk_aws_appconfig_CfnDeployment_TagsProperty(p) {
}
function _aws_cdk_aws_appconfig_CfnDeploymentStrategyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_CfnDeploymentStrategy_TagsProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_CfnDeploymentStrategy(p) {
}
function _aws_cdk_aws_appconfig_CfnDeploymentStrategy_TagsProperty(p) {
}
function _aws_cdk_aws_appconfig_CfnEnvironmentProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_appconfig_CfnEnvironment_TagsProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appconfig_CfnEnvironment(p) {
}
function _aws_cdk_aws_appconfig_CfnEnvironment_MonitorsProperty(p) {
}
function _aws_cdk_aws_appconfig_CfnEnvironment_TagsProperty(p) {
}
function _aws_cdk_aws_appconfig_CfnHostedConfigurationVersionProps(p) {
}
function _aws_cdk_aws_appconfig_CfnHostedConfigurationVersion(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_appconfig_CfnApplicationProps, _aws_cdk_aws_appconfig_CfnApplication, _aws_cdk_aws_appconfig_CfnApplication_TagsProperty, _aws_cdk_aws_appconfig_CfnConfigurationProfileProps, _aws_cdk_aws_appconfig_CfnConfigurationProfile, _aws_cdk_aws_appconfig_CfnConfigurationProfile_TagsProperty, _aws_cdk_aws_appconfig_CfnConfigurationProfile_ValidatorsProperty, _aws_cdk_aws_appconfig_CfnDeploymentProps, _aws_cdk_aws_appconfig_CfnDeployment, _aws_cdk_aws_appconfig_CfnDeployment_TagsProperty, _aws_cdk_aws_appconfig_CfnDeploymentStrategyProps, _aws_cdk_aws_appconfig_CfnDeploymentStrategy, _aws_cdk_aws_appconfig_CfnDeploymentStrategy_TagsProperty, _aws_cdk_aws_appconfig_CfnEnvironmentProps, _aws_cdk_aws_appconfig_CfnEnvironment, _aws_cdk_aws_appconfig_CfnEnvironment_MonitorsProperty, _aws_cdk_aws_appconfig_CfnEnvironment_TagsProperty, _aws_cdk_aws_appconfig_CfnHostedConfigurationVersionProps, _aws_cdk_aws_appconfig_CfnHostedConfigurationVersion };
