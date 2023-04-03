function _aws_cdk_aws_acmpca_CfnCertificateProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.validity))
            _aws_cdk_aws_acmpca_CfnCertificate_ValidityProperty(p.validity);
        if (!visitedObjects.has(p.validityNotBefore))
            _aws_cdk_aws_acmpca_CfnCertificate_ValidityProperty(p.validityNotBefore);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_acmpca_CfnCertificate(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificate_ApiPassthroughProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificate_CustomAttributeProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificate_CustomExtensionProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificate_EdiPartyNameProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificate_ExtendedKeyUsageProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificate_ExtensionsProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificate_GeneralNameProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificate_KeyUsageProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificate_OtherNameProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificate_PolicyInformationProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificate_PolicyQualifierInfoProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificate_QualifierProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificate_SubjectProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificate_ValidityProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificateAuthorityProps(p) {
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
function _aws_cdk_aws_acmpca_CfnCertificateAuthority(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificateAuthority_AccessDescriptionProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificateAuthority_AccessMethodProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificateAuthority_CrlConfigurationProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificateAuthority_CsrExtensionsProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificateAuthority_CustomAttributeProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificateAuthority_EdiPartyNameProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificateAuthority_GeneralNameProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificateAuthority_KeyUsageProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificateAuthority_OcspConfigurationProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificateAuthority_OtherNameProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificateAuthority_RevocationConfigurationProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificateAuthority_SubjectProperty(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificateAuthorityActivationProps(p) {
}
function _aws_cdk_aws_acmpca_CfnCertificateAuthorityActivation(p) {
}
function _aws_cdk_aws_acmpca_CfnPermissionProps(p) {
}
function _aws_cdk_aws_acmpca_CfnPermission(p) {
}
function _aws_cdk_aws_acmpca_ICertificateAuthority(p) {
}
function _aws_cdk_aws_acmpca_CertificateAuthority(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_acmpca_CfnCertificateProps, _aws_cdk_aws_acmpca_CfnCertificate, _aws_cdk_aws_acmpca_CfnCertificate_ApiPassthroughProperty, _aws_cdk_aws_acmpca_CfnCertificate_CustomAttributeProperty, _aws_cdk_aws_acmpca_CfnCertificate_CustomExtensionProperty, _aws_cdk_aws_acmpca_CfnCertificate_EdiPartyNameProperty, _aws_cdk_aws_acmpca_CfnCertificate_ExtendedKeyUsageProperty, _aws_cdk_aws_acmpca_CfnCertificate_ExtensionsProperty, _aws_cdk_aws_acmpca_CfnCertificate_GeneralNameProperty, _aws_cdk_aws_acmpca_CfnCertificate_KeyUsageProperty, _aws_cdk_aws_acmpca_CfnCertificate_OtherNameProperty, _aws_cdk_aws_acmpca_CfnCertificate_PolicyInformationProperty, _aws_cdk_aws_acmpca_CfnCertificate_PolicyQualifierInfoProperty, _aws_cdk_aws_acmpca_CfnCertificate_QualifierProperty, _aws_cdk_aws_acmpca_CfnCertificate_SubjectProperty, _aws_cdk_aws_acmpca_CfnCertificate_ValidityProperty, _aws_cdk_aws_acmpca_CfnCertificateAuthorityProps, _aws_cdk_aws_acmpca_CfnCertificateAuthority, _aws_cdk_aws_acmpca_CfnCertificateAuthority_AccessDescriptionProperty, _aws_cdk_aws_acmpca_CfnCertificateAuthority_AccessMethodProperty, _aws_cdk_aws_acmpca_CfnCertificateAuthority_CrlConfigurationProperty, _aws_cdk_aws_acmpca_CfnCertificateAuthority_CsrExtensionsProperty, _aws_cdk_aws_acmpca_CfnCertificateAuthority_CustomAttributeProperty, _aws_cdk_aws_acmpca_CfnCertificateAuthority_EdiPartyNameProperty, _aws_cdk_aws_acmpca_CfnCertificateAuthority_GeneralNameProperty, _aws_cdk_aws_acmpca_CfnCertificateAuthority_KeyUsageProperty, _aws_cdk_aws_acmpca_CfnCertificateAuthority_OcspConfigurationProperty, _aws_cdk_aws_acmpca_CfnCertificateAuthority_OtherNameProperty, _aws_cdk_aws_acmpca_CfnCertificateAuthority_RevocationConfigurationProperty, _aws_cdk_aws_acmpca_CfnCertificateAuthority_SubjectProperty, _aws_cdk_aws_acmpca_CfnCertificateAuthorityActivationProps, _aws_cdk_aws_acmpca_CfnCertificateAuthorityActivation, _aws_cdk_aws_acmpca_CfnPermissionProps, _aws_cdk_aws_acmpca_CfnPermission, _aws_cdk_aws_acmpca_ICertificateAuthority, _aws_cdk_aws_acmpca_CertificateAuthority };
