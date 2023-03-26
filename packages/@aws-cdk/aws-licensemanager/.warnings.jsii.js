function _aws_cdk_aws_licensemanager_CfnGrantProps(p) {
}
function _aws_cdk_aws_licensemanager_CfnGrant(p) {
}
function _aws_cdk_aws_licensemanager_CfnLicenseProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.consumptionConfiguration))
            _aws_cdk_aws_licensemanager_CfnLicense_ConsumptionConfigurationProperty(p.consumptionConfiguration);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_licensemanager_CfnLicense(p) {
}
function _aws_cdk_aws_licensemanager_CfnLicense_BorrowConfigurationProperty(p) {
}
function _aws_cdk_aws_licensemanager_CfnLicense_ConsumptionConfigurationProperty(p) {
}
function _aws_cdk_aws_licensemanager_CfnLicense_EntitlementProperty(p) {
}
function _aws_cdk_aws_licensemanager_CfnLicense_IssuerDataProperty(p) {
}
function _aws_cdk_aws_licensemanager_CfnLicense_MetadataProperty(p) {
}
function _aws_cdk_aws_licensemanager_CfnLicense_ProvisionalConfigurationProperty(p) {
}
function _aws_cdk_aws_licensemanager_CfnLicense_ValidityDateFormatProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_licensemanager_CfnGrantProps, _aws_cdk_aws_licensemanager_CfnGrant, _aws_cdk_aws_licensemanager_CfnLicenseProps, _aws_cdk_aws_licensemanager_CfnLicense, _aws_cdk_aws_licensemanager_CfnLicense_BorrowConfigurationProperty, _aws_cdk_aws_licensemanager_CfnLicense_ConsumptionConfigurationProperty, _aws_cdk_aws_licensemanager_CfnLicense_EntitlementProperty, _aws_cdk_aws_licensemanager_CfnLicense_IssuerDataProperty, _aws_cdk_aws_licensemanager_CfnLicense_MetadataProperty, _aws_cdk_aws_licensemanager_CfnLicense_ProvisionalConfigurationProperty, _aws_cdk_aws_licensemanager_CfnLicense_ValidityDateFormatProperty };
