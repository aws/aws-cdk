function _aws_cdk_aws_managedblockchain_CfnMemberProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.memberConfiguration))
            _aws_cdk_aws_managedblockchain_CfnMember_MemberConfigurationProperty(p.memberConfiguration);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_managedblockchain_CfnMember(p) {
}
function _aws_cdk_aws_managedblockchain_CfnMember_ApprovalThresholdPolicyProperty(p) {
}
function _aws_cdk_aws_managedblockchain_CfnMember_MemberConfigurationProperty(p) {
}
function _aws_cdk_aws_managedblockchain_CfnMember_MemberFabricConfigurationProperty(p) {
}
function _aws_cdk_aws_managedblockchain_CfnMember_MemberFrameworkConfigurationProperty(p) {
}
function _aws_cdk_aws_managedblockchain_CfnMember_NetworkConfigurationProperty(p) {
}
function _aws_cdk_aws_managedblockchain_CfnMember_NetworkFabricConfigurationProperty(p) {
}
function _aws_cdk_aws_managedblockchain_CfnMember_NetworkFrameworkConfigurationProperty(p) {
}
function _aws_cdk_aws_managedblockchain_CfnMember_VotingPolicyProperty(p) {
}
function _aws_cdk_aws_managedblockchain_CfnNodeProps(p) {
}
function _aws_cdk_aws_managedblockchain_CfnNode(p) {
}
function _aws_cdk_aws_managedblockchain_CfnNode_NodeConfigurationProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_managedblockchain_CfnMemberProps, _aws_cdk_aws_managedblockchain_CfnMember, _aws_cdk_aws_managedblockchain_CfnMember_ApprovalThresholdPolicyProperty, _aws_cdk_aws_managedblockchain_CfnMember_MemberConfigurationProperty, _aws_cdk_aws_managedblockchain_CfnMember_MemberFabricConfigurationProperty, _aws_cdk_aws_managedblockchain_CfnMember_MemberFrameworkConfigurationProperty, _aws_cdk_aws_managedblockchain_CfnMember_NetworkConfigurationProperty, _aws_cdk_aws_managedblockchain_CfnMember_NetworkFabricConfigurationProperty, _aws_cdk_aws_managedblockchain_CfnMember_NetworkFrameworkConfigurationProperty, _aws_cdk_aws_managedblockchain_CfnMember_VotingPolicyProperty, _aws_cdk_aws_managedblockchain_CfnNodeProps, _aws_cdk_aws_managedblockchain_CfnNode, _aws_cdk_aws_managedblockchain_CfnNode_NodeConfigurationProperty };
