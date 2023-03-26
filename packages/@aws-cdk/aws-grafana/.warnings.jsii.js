function _aws_cdk_aws_grafana_CfnWorkspaceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.samlConfiguration))
            _aws_cdk_aws_grafana_CfnWorkspace_SamlConfigurationProperty(p.samlConfiguration);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_grafana_CfnWorkspace(p) {
}
function _aws_cdk_aws_grafana_CfnWorkspace_AssertionAttributesProperty(p) {
}
function _aws_cdk_aws_grafana_CfnWorkspace_IdpMetadataProperty(p) {
}
function _aws_cdk_aws_grafana_CfnWorkspace_RoleValuesProperty(p) {
}
function _aws_cdk_aws_grafana_CfnWorkspace_SamlConfigurationProperty(p) {
}
function _aws_cdk_aws_grafana_CfnWorkspace_VpcConfigurationProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_grafana_CfnWorkspaceProps, _aws_cdk_aws_grafana_CfnWorkspace, _aws_cdk_aws_grafana_CfnWorkspace_AssertionAttributesProperty, _aws_cdk_aws_grafana_CfnWorkspace_IdpMetadataProperty, _aws_cdk_aws_grafana_CfnWorkspace_RoleValuesProperty, _aws_cdk_aws_grafana_CfnWorkspace_SamlConfigurationProperty, _aws_cdk_aws_grafana_CfnWorkspace_VpcConfigurationProperty };
