function _aws_cdk_aws_transfer_CfnAgreementProps(p) {
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
function _aws_cdk_aws_transfer_CfnAgreement(p) {
}
function _aws_cdk_aws_transfer_CfnCertificateProps(p) {
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
function _aws_cdk_aws_transfer_CfnCertificate(p) {
}
function _aws_cdk_aws_transfer_CfnConnectorProps(p) {
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
function _aws_cdk_aws_transfer_CfnConnector(p) {
}
function _aws_cdk_aws_transfer_CfnConnector_As2ConfigProperty(p) {
}
function _aws_cdk_aws_transfer_CfnProfileProps(p) {
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
function _aws_cdk_aws_transfer_CfnProfile(p) {
}
function _aws_cdk_aws_transfer_CfnServerProps(p) {
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
function _aws_cdk_aws_transfer_CfnServer(p) {
}
function _aws_cdk_aws_transfer_CfnServer_EndpointDetailsProperty(p) {
}
function _aws_cdk_aws_transfer_CfnServer_IdentityProviderDetailsProperty(p) {
}
function _aws_cdk_aws_transfer_CfnServer_ProtocolDetailsProperty(p) {
}
function _aws_cdk_aws_transfer_CfnServer_WorkflowDetailProperty(p) {
}
function _aws_cdk_aws_transfer_CfnServer_WorkflowDetailsProperty(p) {
}
function _aws_cdk_aws_transfer_CfnUserProps(p) {
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
function _aws_cdk_aws_transfer_CfnUser(p) {
}
function _aws_cdk_aws_transfer_CfnUser_HomeDirectoryMapEntryProperty(p) {
}
function _aws_cdk_aws_transfer_CfnUser_PosixProfileProperty(p) {
}
function _aws_cdk_aws_transfer_CfnWorkflowProps(p) {
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
function _aws_cdk_aws_transfer_CfnWorkflow(p) {
}
function _aws_cdk_aws_transfer_CfnWorkflow_CopyStepDetailsProperty(p) {
}
function _aws_cdk_aws_transfer_CfnWorkflow_CustomStepDetailsProperty(p) {
}
function _aws_cdk_aws_transfer_CfnWorkflow_DecryptStepDetailsProperty(p) {
}
function _aws_cdk_aws_transfer_CfnWorkflow_DeleteStepDetailsProperty(p) {
}
function _aws_cdk_aws_transfer_CfnWorkflow_EfsInputFileLocationProperty(p) {
}
function _aws_cdk_aws_transfer_CfnWorkflow_InputFileLocationProperty(p) {
}
function _aws_cdk_aws_transfer_CfnWorkflow_S3FileLocationProperty(p) {
}
function _aws_cdk_aws_transfer_CfnWorkflow_S3InputFileLocationProperty(p) {
}
function _aws_cdk_aws_transfer_CfnWorkflow_S3TagProperty(p) {
}
function _aws_cdk_aws_transfer_CfnWorkflow_TagStepDetailsProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_transfer_CfnWorkflow_S3TagProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_transfer_CfnWorkflow_WorkflowStepProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_transfer_CfnAgreementProps, _aws_cdk_aws_transfer_CfnAgreement, _aws_cdk_aws_transfer_CfnCertificateProps, _aws_cdk_aws_transfer_CfnCertificate, _aws_cdk_aws_transfer_CfnConnectorProps, _aws_cdk_aws_transfer_CfnConnector, _aws_cdk_aws_transfer_CfnConnector_As2ConfigProperty, _aws_cdk_aws_transfer_CfnProfileProps, _aws_cdk_aws_transfer_CfnProfile, _aws_cdk_aws_transfer_CfnServerProps, _aws_cdk_aws_transfer_CfnServer, _aws_cdk_aws_transfer_CfnServer_EndpointDetailsProperty, _aws_cdk_aws_transfer_CfnServer_IdentityProviderDetailsProperty, _aws_cdk_aws_transfer_CfnServer_ProtocolDetailsProperty, _aws_cdk_aws_transfer_CfnServer_WorkflowDetailProperty, _aws_cdk_aws_transfer_CfnServer_WorkflowDetailsProperty, _aws_cdk_aws_transfer_CfnUserProps, _aws_cdk_aws_transfer_CfnUser, _aws_cdk_aws_transfer_CfnUser_HomeDirectoryMapEntryProperty, _aws_cdk_aws_transfer_CfnUser_PosixProfileProperty, _aws_cdk_aws_transfer_CfnWorkflowProps, _aws_cdk_aws_transfer_CfnWorkflow, _aws_cdk_aws_transfer_CfnWorkflow_CopyStepDetailsProperty, _aws_cdk_aws_transfer_CfnWorkflow_CustomStepDetailsProperty, _aws_cdk_aws_transfer_CfnWorkflow_DecryptStepDetailsProperty, _aws_cdk_aws_transfer_CfnWorkflow_DeleteStepDetailsProperty, _aws_cdk_aws_transfer_CfnWorkflow_EfsInputFileLocationProperty, _aws_cdk_aws_transfer_CfnWorkflow_InputFileLocationProperty, _aws_cdk_aws_transfer_CfnWorkflow_S3FileLocationProperty, _aws_cdk_aws_transfer_CfnWorkflow_S3InputFileLocationProperty, _aws_cdk_aws_transfer_CfnWorkflow_S3TagProperty, _aws_cdk_aws_transfer_CfnWorkflow_TagStepDetailsProperty, _aws_cdk_aws_transfer_CfnWorkflow_WorkflowStepProperty };
