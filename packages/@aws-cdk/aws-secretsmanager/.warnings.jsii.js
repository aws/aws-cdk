function _aws_cdk_aws_secretsmanager_ISecret(p) {
}
function _aws_cdk_aws_secretsmanager_SecretProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.generateSecretString))
            _aws_cdk_aws_secretsmanager_SecretStringGenerator(p.generateSecretString);
        if (p.replicaRegions != null)
            for (const o of p.replicaRegions)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_secretsmanager_ReplicaRegion(o);
        if (p.secretObjectValue != null)
            for (const o of Object.values(p.secretObjectValue))
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_SecretValue(o);
        if ("secretStringBeta1" in p)
            print("@aws-cdk/aws-secretsmanager.SecretProps#secretStringBeta1", "Use `secretStringValue` instead.");
        if (!visitedObjects.has(p.secretStringBeta1))
            _aws_cdk_aws_secretsmanager_SecretStringValueBeta1(p.secretStringBeta1);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_secretsmanager_ReplicaRegion(p) {
}
function _aws_cdk_aws_secretsmanager_SecretStringValueBeta1(p) {
}
function _aws_cdk_aws_secretsmanager_SecretAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("secretArn" in p)
            print("@aws-cdk/aws-secretsmanager.SecretAttributes#secretArn", "use `secretCompleteArn` or `secretPartialArn` instead.");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_secretsmanager_Secret(p) {
}
function _aws_cdk_aws_secretsmanager_ISecretAttachmentTarget(p) {
}
function _aws_cdk_aws_secretsmanager_AttachmentTargetType(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        const ns = require("./lib/secret.js");
        if (Object.values(ns.AttachmentTargetType).filter(x => x === p).length > 1)
            return;
        if (p === ns.AttachmentTargetType.INSTANCE)
            print("@aws-cdk/aws-secretsmanager.AttachmentTargetType#INSTANCE", "use RDS_DB_INSTANCE instead");
        if (p === ns.AttachmentTargetType.CLUSTER)
            print("@aws-cdk/aws-secretsmanager.AttachmentTargetType#CLUSTER", "use RDS_DB_CLUSTER instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_secretsmanager_SecretAttachmentTargetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.targetType))
            _aws_cdk_aws_secretsmanager_AttachmentTargetType(p.targetType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_secretsmanager_AttachedSecretOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.target))
            _aws_cdk_aws_secretsmanager_ISecretAttachmentTarget(p.target);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_secretsmanager_SecretTargetAttachmentProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.secret))
            _aws_cdk_aws_secretsmanager_ISecret(p.secret);
        if (!visitedObjects.has(p.target))
            _aws_cdk_aws_secretsmanager_ISecretAttachmentTarget(p.target);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_secretsmanager_ISecretTargetAttachment(p) {
}
function _aws_cdk_aws_secretsmanager_SecretTargetAttachment(p) {
}
function _aws_cdk_aws_secretsmanager_SecretStringGenerator(p) {
}
function _aws_cdk_aws_secretsmanager_RotationScheduleOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.hostedRotation))
            _aws_cdk_aws_secretsmanager_HostedRotation(p.hostedRotation);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_secretsmanager_RotationScheduleProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.secret))
            _aws_cdk_aws_secretsmanager_ISecret(p.secret);
        if (!visitedObjects.has(p.hostedRotation))
            _aws_cdk_aws_secretsmanager_HostedRotation(p.hostedRotation);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_secretsmanager_RotationSchedule(p) {
}
function _aws_cdk_aws_secretsmanager_SingleUserHostedRotationOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_secretsmanager_MultiUserHostedRotationOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.masterSecret))
            _aws_cdk_aws_secretsmanager_ISecret(p.masterSecret);
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_secretsmanager_HostedRotation(p) {
}
function _aws_cdk_aws_secretsmanager_HostedRotationType(p) {
}
function _aws_cdk_aws_secretsmanager_ResourcePolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.secret))
            _aws_cdk_aws_secretsmanager_ISecret(p.secret);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_secretsmanager_ResourcePolicy(p) {
}
function _aws_cdk_aws_secretsmanager_SecretRotationApplicationOptions(p) {
}
function _aws_cdk_aws_secretsmanager_SecretRotationApplication(p) {
}
function _aws_cdk_aws_secretsmanager_SecretRotationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.application))
            _aws_cdk_aws_secretsmanager_SecretRotationApplication(p.application);
        if (!visitedObjects.has(p.secret))
            _aws_cdk_aws_secretsmanager_ISecret(p.secret);
        if (!visitedObjects.has(p.masterSecret))
            _aws_cdk_aws_secretsmanager_ISecret(p.masterSecret);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_secretsmanager_SecretRotation(p) {
}
function _aws_cdk_aws_secretsmanager_CfnResourcePolicyProps(p) {
}
function _aws_cdk_aws_secretsmanager_CfnResourcePolicy(p) {
}
function _aws_cdk_aws_secretsmanager_CfnRotationScheduleProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.hostedRotationLambda))
            _aws_cdk_aws_secretsmanager_CfnRotationSchedule_HostedRotationLambdaProperty(p.hostedRotationLambda);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_secretsmanager_CfnRotationSchedule(p) {
}
function _aws_cdk_aws_secretsmanager_CfnRotationSchedule_HostedRotationLambdaProperty(p) {
}
function _aws_cdk_aws_secretsmanager_CfnRotationSchedule_RotationRulesProperty(p) {
}
function _aws_cdk_aws_secretsmanager_CfnSecretProps(p) {
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
function _aws_cdk_aws_secretsmanager_CfnSecret(p) {
}
function _aws_cdk_aws_secretsmanager_CfnSecret_GenerateSecretStringProperty(p) {
}
function _aws_cdk_aws_secretsmanager_CfnSecret_ReplicaRegionProperty(p) {
}
function _aws_cdk_aws_secretsmanager_CfnSecretTargetAttachmentProps(p) {
}
function _aws_cdk_aws_secretsmanager_CfnSecretTargetAttachment(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_secretsmanager_ISecret, _aws_cdk_aws_secretsmanager_SecretProps, _aws_cdk_aws_secretsmanager_ReplicaRegion, _aws_cdk_aws_secretsmanager_SecretStringValueBeta1, _aws_cdk_aws_secretsmanager_SecretAttributes, _aws_cdk_aws_secretsmanager_Secret, _aws_cdk_aws_secretsmanager_ISecretAttachmentTarget, _aws_cdk_aws_secretsmanager_AttachmentTargetType, _aws_cdk_aws_secretsmanager_SecretAttachmentTargetProps, _aws_cdk_aws_secretsmanager_AttachedSecretOptions, _aws_cdk_aws_secretsmanager_SecretTargetAttachmentProps, _aws_cdk_aws_secretsmanager_ISecretTargetAttachment, _aws_cdk_aws_secretsmanager_SecretTargetAttachment, _aws_cdk_aws_secretsmanager_SecretStringGenerator, _aws_cdk_aws_secretsmanager_RotationScheduleOptions, _aws_cdk_aws_secretsmanager_RotationScheduleProps, _aws_cdk_aws_secretsmanager_RotationSchedule, _aws_cdk_aws_secretsmanager_SingleUserHostedRotationOptions, _aws_cdk_aws_secretsmanager_MultiUserHostedRotationOptions, _aws_cdk_aws_secretsmanager_HostedRotation, _aws_cdk_aws_secretsmanager_HostedRotationType, _aws_cdk_aws_secretsmanager_ResourcePolicyProps, _aws_cdk_aws_secretsmanager_ResourcePolicy, _aws_cdk_aws_secretsmanager_SecretRotationApplicationOptions, _aws_cdk_aws_secretsmanager_SecretRotationApplication, _aws_cdk_aws_secretsmanager_SecretRotationProps, _aws_cdk_aws_secretsmanager_SecretRotation, _aws_cdk_aws_secretsmanager_CfnResourcePolicyProps, _aws_cdk_aws_secretsmanager_CfnResourcePolicy, _aws_cdk_aws_secretsmanager_CfnRotationScheduleProps, _aws_cdk_aws_secretsmanager_CfnRotationSchedule, _aws_cdk_aws_secretsmanager_CfnRotationSchedule_HostedRotationLambdaProperty, _aws_cdk_aws_secretsmanager_CfnRotationSchedule_RotationRulesProperty, _aws_cdk_aws_secretsmanager_CfnSecretProps, _aws_cdk_aws_secretsmanager_CfnSecret, _aws_cdk_aws_secretsmanager_CfnSecret_GenerateSecretStringProperty, _aws_cdk_aws_secretsmanager_CfnSecret_ReplicaRegionProperty, _aws_cdk_aws_secretsmanager_CfnSecretTargetAttachmentProps, _aws_cdk_aws_secretsmanager_CfnSecretTargetAttachment };
