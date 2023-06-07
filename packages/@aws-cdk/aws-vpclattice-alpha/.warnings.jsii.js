function _aws_cdk_aws_vpclattice_alpha_AuthType(p) {
}
function _aws_cdk_aws_vpclattice_alpha_ShareServiceNetworkProps(p) {
}
function _aws_cdk_aws_vpclattice_alpha_AssociateVPCProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_SecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_vpclattice_alpha_IServiceNetwork(p) {
}
function _aws_cdk_aws_vpclattice_alpha_ServiceNetworkProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.accounts != null)
            for (const o of p.accounts)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_iam_AccountPrincipal(o);
        if (!visitedObjects.has(p.authType))
            _aws_cdk_aws_vpclattice_alpha_AuthType(p.authType);
        if (p.cloudwatchLogs != null)
            for (const o of p.cloudwatchLogs)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_logs_ILogGroup(o);
        if (p.kinesisStreams != null)
            for (const o of p.kinesisStreams)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_kinesis_IStream(o);
        if (p.s3LogDestination != null)
            for (const o of p.s3LogDestination)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_s3_IBucket(o);
        if (p.services != null)
            for (const o of p.services)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_vpclattice_alpha_Service(o);
        if (p.vpcs != null)
            for (const o of p.vpcs)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_IVpc(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_vpclattice_alpha_ServiceNetwork(p) {
}
function _aws_cdk_aws_vpclattice_alpha_ShareServiceProps(p) {
}
function _aws_cdk_aws_vpclattice_alpha_IService(p) {
}
function _aws_cdk_aws_vpclattice_alpha_LatticeServiceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.listeners != null)
            for (const o of p.listeners)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_vpclattice_alpha_IListener(o);
        if (p.shares != null)
            for (const o of p.shares)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_vpclattice_alpha_ShareServiceProps(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_vpclattice_alpha_Service(p) {
}
function _aws_cdk_aws_vpclattice_alpha_AddListenerProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.protocol))
            _aws_cdk_aws_vpclattice_alpha_Protocol(p.protocol);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_vpclattice_alpha_ListenerProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.protocol))
            _aws_cdk_aws_vpclattice_alpha_Protocol(p.protocol);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_vpclattice_alpha_IListener(p) {
}
function _aws_cdk_aws_vpclattice_alpha_AddRuleProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.action))
            _aws_cdk_aws_vpclattice_alpha_FixedResponse(p.action);
        if (p.allowedPrincipals != null)
            for (const o of p.allowedPrincipals)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_iam_IPrincipal(o);
        if (p.headerMatchs != null)
            for (const o of p.headerMatchs)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_vpclattice_alpha_HeaderMatch(o);
        if (!visitedObjects.has(p.methodMatch))
            _aws_cdk_aws_vpclattice_alpha_HTTPMethods(p.methodMatch);
        if (!visitedObjects.has(p.pathMatch))
            _aws_cdk_aws_vpclattice_alpha_PathMatch(p.pathMatch);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_vpclattice_alpha_Listener(p) {
}
function _aws_cdk_aws_vpclattice_alpha_HeaderMatch(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.matchOperator))
            _aws_cdk_aws_vpclattice_alpha_MatchOperator(p.matchOperator);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_vpclattice_alpha_PathMatch(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.pathMatchType))
            _aws_cdk_aws_vpclattice_alpha_PathMatchType(p.pathMatchType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_vpclattice_alpha_Protocol(p) {
}
function _aws_cdk_aws_vpclattice_alpha_FixedResponse(p) {
}
function _aws_cdk_aws_vpclattice_alpha_HTTPMethods(p) {
}
function _aws_cdk_aws_vpclattice_alpha_MatchOperator(p) {
}
function _aws_cdk_aws_vpclattice_alpha_PathMatchType(p) {
}
function _aws_cdk_aws_vpclattice_alpha_IpAddressType(p) {
}
function _aws_cdk_aws_vpclattice_alpha_ProtocolVersion(p) {
}
function _aws_cdk_aws_vpclattice_alpha_WeightedTargetGroup(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.targetGroup))
            _aws_cdk_aws_vpclattice_alpha_TargetGroup(p.targetGroup);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_vpclattice_alpha_TargetGroupHealthCheck(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.matcher))
            _aws_cdk_aws_vpclattice_alpha_FixedResponse(p.matcher);
        if (!visitedObjects.has(p.protocol))
            _aws_cdk_aws_vpclattice_alpha_Protocol(p.protocol);
        if (!visitedObjects.has(p.protocolVersion))
            _aws_cdk_aws_vpclattice_alpha_ProtocolVersion(p.protocolVersion);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_vpclattice_alpha_TargetGroupConfigProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.protocol))
            _aws_cdk_aws_vpclattice_alpha_Protocol(p.protocol);
        if (!visitedObjects.has(p.healthCheck))
            _aws_cdk_aws_vpclattice_alpha_TargetGroupHealthCheck(p.healthCheck);
        if (!visitedObjects.has(p.ipAddressType))
            _aws_cdk_aws_vpclattice_alpha_IpAddressType(p.ipAddressType);
        if (!visitedObjects.has(p.protocolVersion))
            _aws_cdk_aws_vpclattice_alpha_ProtocolVersion(p.protocolVersion);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_vpclattice_alpha_TargetGroupConfig(p) {
}
function _aws_cdk_aws_vpclattice_alpha_ITargetGroup(p) {
}
function _aws_cdk_aws_vpclattice_alpha_TargetGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.albTargets != null)
            for (const o of p.albTargets)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_elasticloadbalancingv2_ApplicationListener(o);
        if (!visitedObjects.has(p.config))
            _aws_cdk_aws_vpclattice_alpha_TargetGroupConfig(p.config);
        if (p.instancetargets != null)
            for (const o of p.instancetargets)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_ec2_Instance(o);
        if (p.lambdaTargets != null)
            for (const o of p.lambdaTargets)
                if (!visitedObjects.has(o))
                    require("aws-cdk-lib/.warnings.jsii.js").aws_cdk_lib_aws_lambda_Function(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_vpclattice_alpha_TargetGroup(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_vpclattice_alpha_AuthType, _aws_cdk_aws_vpclattice_alpha_ShareServiceNetworkProps, _aws_cdk_aws_vpclattice_alpha_AssociateVPCProps, _aws_cdk_aws_vpclattice_alpha_IServiceNetwork, _aws_cdk_aws_vpclattice_alpha_ServiceNetworkProps, _aws_cdk_aws_vpclattice_alpha_ServiceNetwork, _aws_cdk_aws_vpclattice_alpha_ShareServiceProps, _aws_cdk_aws_vpclattice_alpha_IService, _aws_cdk_aws_vpclattice_alpha_LatticeServiceProps, _aws_cdk_aws_vpclattice_alpha_Service, _aws_cdk_aws_vpclattice_alpha_AddListenerProps, _aws_cdk_aws_vpclattice_alpha_ListenerProps, _aws_cdk_aws_vpclattice_alpha_IListener, _aws_cdk_aws_vpclattice_alpha_AddRuleProps, _aws_cdk_aws_vpclattice_alpha_Listener, _aws_cdk_aws_vpclattice_alpha_HeaderMatch, _aws_cdk_aws_vpclattice_alpha_PathMatch, _aws_cdk_aws_vpclattice_alpha_Protocol, _aws_cdk_aws_vpclattice_alpha_FixedResponse, _aws_cdk_aws_vpclattice_alpha_HTTPMethods, _aws_cdk_aws_vpclattice_alpha_MatchOperator, _aws_cdk_aws_vpclattice_alpha_PathMatchType, _aws_cdk_aws_vpclattice_alpha_IpAddressType, _aws_cdk_aws_vpclattice_alpha_ProtocolVersion, _aws_cdk_aws_vpclattice_alpha_WeightedTargetGroup, _aws_cdk_aws_vpclattice_alpha_TargetGroupHealthCheck, _aws_cdk_aws_vpclattice_alpha_TargetGroupConfigProps, _aws_cdk_aws_vpclattice_alpha_TargetGroupConfig, _aws_cdk_aws_vpclattice_alpha_ITargetGroup, _aws_cdk_aws_vpclattice_alpha_TargetGroupProps, _aws_cdk_aws_vpclattice_alpha_TargetGroup };
