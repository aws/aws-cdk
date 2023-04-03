function _aws_cdk_aws_certificatemanager_ICertificate(p) {
}
function _aws_cdk_aws_certificatemanager_CertificateProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.validation))
            _aws_cdk_aws_certificatemanager_CertificateValidation(p.validation);
        if ("validationDomains" in p)
            print("@aws-cdk/aws-certificatemanager.CertificateProps#validationDomains", "use `validation` instead.");
        if ("validationMethod" in p)
            print("@aws-cdk/aws-certificatemanager.CertificateProps#validationMethod", "use `validation` instead.");
        if (!visitedObjects.has(p.validationMethod))
            _aws_cdk_aws_certificatemanager_ValidationMethod(p.validationMethod);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_certificatemanager_CertificationValidationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.hostedZones != null)
            for (const o of Object.values(p.hostedZones))
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-route53/.warnings.jsii.js")._aws_cdk_aws_route53_IHostedZone(o);
        if (!visitedObjects.has(p.method))
            _aws_cdk_aws_certificatemanager_ValidationMethod(p.method);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_certificatemanager_CertificateValidation(p) {
}
function _aws_cdk_aws_certificatemanager_Certificate(p) {
}
function _aws_cdk_aws_certificatemanager_ValidationMethod(p) {
}
function _aws_cdk_aws_certificatemanager_DnsValidatedCertificateProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.validation))
            _aws_cdk_aws_certificatemanager_CertificateValidation(p.validation);
        if ("validationDomains" in p)
            print("@aws-cdk/aws-certificatemanager.CertificateProps#validationDomains", "use `validation` instead.");
        if ("validationMethod" in p)
            print("@aws-cdk/aws-certificatemanager.CertificateProps#validationMethod", "use `validation` instead.");
        if (!visitedObjects.has(p.validationMethod))
            _aws_cdk_aws_certificatemanager_ValidationMethod(p.validationMethod);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_certificatemanager_DnsValidatedCertificate(p) {
}
function _aws_cdk_aws_certificatemanager_PrivateCertificateProps(p) {
}
function _aws_cdk_aws_certificatemanager_PrivateCertificate(p) {
}
function _aws_cdk_aws_certificatemanager_CfnAccountProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.expiryEventsConfiguration))
            _aws_cdk_aws_certificatemanager_CfnAccount_ExpiryEventsConfigurationProperty(p.expiryEventsConfiguration);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_certificatemanager_CfnAccount(p) {
}
function _aws_cdk_aws_certificatemanager_CfnAccount_ExpiryEventsConfigurationProperty(p) {
}
function _aws_cdk_aws_certificatemanager_CfnCertificateProps(p) {
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
function _aws_cdk_aws_certificatemanager_CfnCertificate(p) {
}
function _aws_cdk_aws_certificatemanager_CfnCertificate_DomainValidationOptionProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_certificatemanager_ICertificate, _aws_cdk_aws_certificatemanager_CertificateProps, _aws_cdk_aws_certificatemanager_CertificationValidationProps, _aws_cdk_aws_certificatemanager_CertificateValidation, _aws_cdk_aws_certificatemanager_Certificate, _aws_cdk_aws_certificatemanager_ValidationMethod, _aws_cdk_aws_certificatemanager_DnsValidatedCertificateProps, _aws_cdk_aws_certificatemanager_DnsValidatedCertificate, _aws_cdk_aws_certificatemanager_PrivateCertificateProps, _aws_cdk_aws_certificatemanager_PrivateCertificate, _aws_cdk_aws_certificatemanager_CfnAccountProps, _aws_cdk_aws_certificatemanager_CfnAccount, _aws_cdk_aws_certificatemanager_CfnAccount_ExpiryEventsConfigurationProperty, _aws_cdk_aws_certificatemanager_CfnCertificateProps, _aws_cdk_aws_certificatemanager_CfnCertificate, _aws_cdk_aws_certificatemanager_CfnCertificate_DomainValidationOptionProperty };
