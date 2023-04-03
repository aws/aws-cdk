function _aws_cdk_aws_iam_PolicyDocumentProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.statements != null)
            for (const o of p.statements)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_PolicyStatement(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iam_PolicyDocument(p) {
}
function _aws_cdk_aws_iam_PolicyStatement(p) {
}
function _aws_cdk_aws_iam_Effect(p) {
}
function _aws_cdk_aws_iam_PolicyStatementProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.effect))
            _aws_cdk_aws_iam_Effect(p.effect);
        if (p.notPrincipals != null)
            for (const o of p.notPrincipals)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_IPrincipal(o);
        if (p.principals != null)
            for (const o of p.principals)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_IPrincipal(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iam_IManagedPolicy(p) {
}
function _aws_cdk_aws_iam_ManagedPolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.document))
            _aws_cdk_aws_iam_PolicyDocument(p.document);
        if (p.groups != null)
            for (const o of p.groups)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_IGroup(o);
        if (p.roles != null)
            for (const o of p.roles)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_IRole(o);
        if (p.statements != null)
            for (const o of p.statements)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_PolicyStatement(o);
        if (p.users != null)
            for (const o of p.users)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_IUser(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iam_ManagedPolicy(p) {
}
function _aws_cdk_aws_iam_RoleProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.assumedBy))
            _aws_cdk_aws_iam_IPrincipal(p.assumedBy);
        if ("externalId" in p)
            print("@aws-cdk/aws-iam.RoleProps#externalId", "see `externalIds`");
        if (p.inlinePolicies != null)
            for (const o of Object.values(p.inlinePolicies))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_PolicyDocument(o);
        if (p.managedPolicies != null)
            for (const o of p.managedPolicies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_IManagedPolicy(o);
        if (!visitedObjects.has(p.permissionsBoundary))
            _aws_cdk_aws_iam_IManagedPolicy(p.permissionsBoundary);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iam_FromRoleArnOptions(p) {
}
function _aws_cdk_aws_iam_CustomizeRolesOptions(p) {
}
function _aws_cdk_aws_iam_FromRoleNameOptions(p) {
}
function _aws_cdk_aws_iam_Role(p) {
}
function _aws_cdk_aws_iam_IRole(p) {
}
function _aws_cdk_aws_iam_WithoutPolicyUpdatesOptions(p) {
}
function _aws_cdk_aws_iam_IPolicy(p) {
}
function _aws_cdk_aws_iam_PolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.document))
            _aws_cdk_aws_iam_PolicyDocument(p.document);
        if (p.groups != null)
            for (const o of p.groups)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_IGroup(o);
        if (p.roles != null)
            for (const o of p.roles)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_IRole(o);
        if (p.statements != null)
            for (const o of p.statements)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_PolicyStatement(o);
        if (p.users != null)
            for (const o of p.users)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_IUser(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iam_Policy(p) {
}
function _aws_cdk_aws_iam_IUser(p) {
}
function _aws_cdk_aws_iam_UserProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.groups != null)
            for (const o of p.groups)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_IGroup(o);
        if (p.managedPolicies != null)
            for (const o of p.managedPolicies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_IManagedPolicy(o);
        if (!visitedObjects.has(p.permissionsBoundary))
            _aws_cdk_aws_iam_IManagedPolicy(p.permissionsBoundary);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iam_UserAttributes(p) {
}
function _aws_cdk_aws_iam_User(p) {
}
function _aws_cdk_aws_iam_IGroup(p) {
}
function _aws_cdk_aws_iam_GroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.managedPolicies != null)
            for (const o of p.managedPolicies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_IManagedPolicy(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iam_Group(p) {
}
function _aws_cdk_aws_iam_LazyRoleProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.assumedBy))
            _aws_cdk_aws_iam_IPrincipal(p.assumedBy);
        if ("externalId" in p)
            print("@aws-cdk/aws-iam.RoleProps#externalId", "see `externalIds`");
        if (p.inlinePolicies != null)
            for (const o of Object.values(p.inlinePolicies))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_PolicyDocument(o);
        if (p.managedPolicies != null)
            for (const o of p.managedPolicies)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_iam_IManagedPolicy(o);
        if (!visitedObjects.has(p.permissionsBoundary))
            _aws_cdk_aws_iam_IManagedPolicy(p.permissionsBoundary);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iam_LazyRole(p) {
}
function _aws_cdk_aws_iam_IGrantable(p) {
}
function _aws_cdk_aws_iam_IPrincipal(p) {
}
function _aws_cdk_aws_iam_IComparablePrincipal(p) {
}
function _aws_cdk_aws_iam_ComparablePrincipal(p) {
}
function _aws_cdk_aws_iam_IAssumeRolePrincipal(p) {
}
function _aws_cdk_aws_iam_AddToPrincipalPolicyResult(p) {
}
function _aws_cdk_aws_iam_PrincipalBase(p) {
}
function _aws_cdk_aws_iam_PrincipalWithConditions(p) {
}
function _aws_cdk_aws_iam_SessionTagsPrincipal(p) {
}
function _aws_cdk_aws_iam_PrincipalPolicyFragment(p) {
}
function _aws_cdk_aws_iam_ArnPrincipal(p) {
}
function _aws_cdk_aws_iam_AccountPrincipal(p) {
}
function _aws_cdk_aws_iam_ServicePrincipalOpts(p) {
}
function _aws_cdk_aws_iam_ServicePrincipal(p) {
}
function _aws_cdk_aws_iam_OrganizationPrincipal(p) {
}
function _aws_cdk_aws_iam_CanonicalUserPrincipal(p) {
}
function _aws_cdk_aws_iam_FederatedPrincipal(p) {
}
function _aws_cdk_aws_iam_WebIdentityPrincipal(p) {
}
function _aws_cdk_aws_iam_OpenIdConnectPrincipal(p) {
}
function _aws_cdk_aws_iam_SamlPrincipal(p) {
}
function _aws_cdk_aws_iam_SamlConsolePrincipal(p) {
}
function _aws_cdk_aws_iam_AccountRootPrincipal(p) {
}
function _aws_cdk_aws_iam_AnyPrincipal(p) {
}
function _aws_cdk_aws_iam_Anyone(p) {
}
function _aws_cdk_aws_iam_StarPrincipal(p) {
}
function _aws_cdk_aws_iam_CompositePrincipal(p) {
}
function _aws_cdk_aws_iam_IIdentity(p) {
}
function _aws_cdk_aws_iam_CommonGrantOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.grantee))
            _aws_cdk_aws_iam_IGrantable(p.grantee);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iam_GrantWithResourceOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.resource))
            _aws_cdk_aws_iam_IResourceWithPolicy(p.resource);
        if (!visitedObjects.has(p.grantee))
            _aws_cdk_aws_iam_IGrantable(p.grantee);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iam_GrantOnPrincipalOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.grantee))
            _aws_cdk_aws_iam_IGrantable(p.grantee);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iam_GrantOnPrincipalAndResourceOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.resource))
            _aws_cdk_aws_iam_IResourceWithPolicy(p.resource);
        if (!visitedObjects.has(p.resourcePolicyPrincipal))
            _aws_cdk_aws_iam_IPrincipal(p.resourcePolicyPrincipal);
        if (!visitedObjects.has(p.grantee))
            _aws_cdk_aws_iam_IGrantable(p.grantee);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iam_Grant(p) {
}
function _aws_cdk_aws_iam_IResourceWithPolicy(p) {
}
function _aws_cdk_aws_iam_AddToResourcePolicyResult(p) {
}
function _aws_cdk_aws_iam_CompositeDependable(p) {
}
function _aws_cdk_aws_iam_UnknownPrincipalProps(p) {
}
function _aws_cdk_aws_iam_UnknownPrincipal(p) {
}
function _aws_cdk_aws_iam_IOpenIdConnectProvider(p) {
}
function _aws_cdk_aws_iam_OpenIdConnectProviderProps(p) {
}
function _aws_cdk_aws_iam_OpenIdConnectProvider(p) {
}
function _aws_cdk_aws_iam_PermissionsBoundary(p) {
}
function _aws_cdk_aws_iam_ISamlProvider(p) {
}
function _aws_cdk_aws_iam_SamlProviderProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.metadataDocument))
            _aws_cdk_aws_iam_SamlMetadataDocument(p.metadataDocument);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iam_SamlMetadataDocument(p) {
}
function _aws_cdk_aws_iam_SamlProvider(p) {
}
function _aws_cdk_aws_iam_AccessKeyStatus(p) {
}
function _aws_cdk_aws_iam_IAccessKey(p) {
}
function _aws_cdk_aws_iam_AccessKeyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.user))
            _aws_cdk_aws_iam_IUser(p.user);
        if (!visitedObjects.has(p.status))
            _aws_cdk_aws_iam_AccessKeyStatus(p.status);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_iam_AccessKey(p) {
}
function _aws_cdk_aws_iam_CfnAccessKeyProps(p) {
}
function _aws_cdk_aws_iam_CfnAccessKey(p) {
}
function _aws_cdk_aws_iam_CfnGroupProps(p) {
}
function _aws_cdk_aws_iam_CfnGroup(p) {
}
function _aws_cdk_aws_iam_CfnGroup_PolicyProperty(p) {
}
function _aws_cdk_aws_iam_CfnInstanceProfileProps(p) {
}
function _aws_cdk_aws_iam_CfnInstanceProfile(p) {
}
function _aws_cdk_aws_iam_CfnManagedPolicyProps(p) {
}
function _aws_cdk_aws_iam_CfnManagedPolicy(p) {
}
function _aws_cdk_aws_iam_CfnOIDCProviderProps(p) {
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
function _aws_cdk_aws_iam_CfnOIDCProvider(p) {
}
function _aws_cdk_aws_iam_CfnPolicyProps(p) {
}
function _aws_cdk_aws_iam_CfnPolicy(p) {
}
function _aws_cdk_aws_iam_CfnRoleProps(p) {
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
function _aws_cdk_aws_iam_CfnRole(p) {
}
function _aws_cdk_aws_iam_CfnRole_PolicyProperty(p) {
}
function _aws_cdk_aws_iam_CfnSAMLProviderProps(p) {
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
function _aws_cdk_aws_iam_CfnSAMLProvider(p) {
}
function _aws_cdk_aws_iam_CfnServerCertificateProps(p) {
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
function _aws_cdk_aws_iam_CfnServerCertificate(p) {
}
function _aws_cdk_aws_iam_CfnServiceLinkedRoleProps(p) {
}
function _aws_cdk_aws_iam_CfnServiceLinkedRole(p) {
}
function _aws_cdk_aws_iam_CfnUserProps(p) {
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
function _aws_cdk_aws_iam_CfnUser(p) {
}
function _aws_cdk_aws_iam_CfnUser_LoginProfileProperty(p) {
}
function _aws_cdk_aws_iam_CfnUser_PolicyProperty(p) {
}
function _aws_cdk_aws_iam_CfnUserToGroupAdditionProps(p) {
}
function _aws_cdk_aws_iam_CfnUserToGroupAddition(p) {
}
function _aws_cdk_aws_iam_CfnVirtualMFADeviceProps(p) {
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
function _aws_cdk_aws_iam_CfnVirtualMFADevice(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_iam_PolicyDocumentProps, _aws_cdk_aws_iam_PolicyDocument, _aws_cdk_aws_iam_PolicyStatement, _aws_cdk_aws_iam_Effect, _aws_cdk_aws_iam_PolicyStatementProps, _aws_cdk_aws_iam_IManagedPolicy, _aws_cdk_aws_iam_ManagedPolicyProps, _aws_cdk_aws_iam_ManagedPolicy, _aws_cdk_aws_iam_RoleProps, _aws_cdk_aws_iam_FromRoleArnOptions, _aws_cdk_aws_iam_CustomizeRolesOptions, _aws_cdk_aws_iam_FromRoleNameOptions, _aws_cdk_aws_iam_Role, _aws_cdk_aws_iam_IRole, _aws_cdk_aws_iam_WithoutPolicyUpdatesOptions, _aws_cdk_aws_iam_IPolicy, _aws_cdk_aws_iam_PolicyProps, _aws_cdk_aws_iam_Policy, _aws_cdk_aws_iam_IUser, _aws_cdk_aws_iam_UserProps, _aws_cdk_aws_iam_UserAttributes, _aws_cdk_aws_iam_User, _aws_cdk_aws_iam_IGroup, _aws_cdk_aws_iam_GroupProps, _aws_cdk_aws_iam_Group, _aws_cdk_aws_iam_LazyRoleProps, _aws_cdk_aws_iam_LazyRole, _aws_cdk_aws_iam_IGrantable, _aws_cdk_aws_iam_IPrincipal, _aws_cdk_aws_iam_IComparablePrincipal, _aws_cdk_aws_iam_ComparablePrincipal, _aws_cdk_aws_iam_IAssumeRolePrincipal, _aws_cdk_aws_iam_AddToPrincipalPolicyResult, _aws_cdk_aws_iam_PrincipalBase, _aws_cdk_aws_iam_PrincipalWithConditions, _aws_cdk_aws_iam_SessionTagsPrincipal, _aws_cdk_aws_iam_PrincipalPolicyFragment, _aws_cdk_aws_iam_ArnPrincipal, _aws_cdk_aws_iam_AccountPrincipal, _aws_cdk_aws_iam_ServicePrincipalOpts, _aws_cdk_aws_iam_ServicePrincipal, _aws_cdk_aws_iam_OrganizationPrincipal, _aws_cdk_aws_iam_CanonicalUserPrincipal, _aws_cdk_aws_iam_FederatedPrincipal, _aws_cdk_aws_iam_WebIdentityPrincipal, _aws_cdk_aws_iam_OpenIdConnectPrincipal, _aws_cdk_aws_iam_SamlPrincipal, _aws_cdk_aws_iam_SamlConsolePrincipal, _aws_cdk_aws_iam_AccountRootPrincipal, _aws_cdk_aws_iam_AnyPrincipal, _aws_cdk_aws_iam_Anyone, _aws_cdk_aws_iam_StarPrincipal, _aws_cdk_aws_iam_CompositePrincipal, _aws_cdk_aws_iam_IIdentity, _aws_cdk_aws_iam_CommonGrantOptions, _aws_cdk_aws_iam_GrantWithResourceOptions, _aws_cdk_aws_iam_GrantOnPrincipalOptions, _aws_cdk_aws_iam_GrantOnPrincipalAndResourceOptions, _aws_cdk_aws_iam_Grant, _aws_cdk_aws_iam_IResourceWithPolicy, _aws_cdk_aws_iam_AddToResourcePolicyResult, _aws_cdk_aws_iam_CompositeDependable, _aws_cdk_aws_iam_UnknownPrincipalProps, _aws_cdk_aws_iam_UnknownPrincipal, _aws_cdk_aws_iam_IOpenIdConnectProvider, _aws_cdk_aws_iam_OpenIdConnectProviderProps, _aws_cdk_aws_iam_OpenIdConnectProvider, _aws_cdk_aws_iam_PermissionsBoundary, _aws_cdk_aws_iam_ISamlProvider, _aws_cdk_aws_iam_SamlProviderProps, _aws_cdk_aws_iam_SamlMetadataDocument, _aws_cdk_aws_iam_SamlProvider, _aws_cdk_aws_iam_AccessKeyStatus, _aws_cdk_aws_iam_IAccessKey, _aws_cdk_aws_iam_AccessKeyProps, _aws_cdk_aws_iam_AccessKey, _aws_cdk_aws_iam_CfnAccessKeyProps, _aws_cdk_aws_iam_CfnAccessKey, _aws_cdk_aws_iam_CfnGroupProps, _aws_cdk_aws_iam_CfnGroup, _aws_cdk_aws_iam_CfnGroup_PolicyProperty, _aws_cdk_aws_iam_CfnInstanceProfileProps, _aws_cdk_aws_iam_CfnInstanceProfile, _aws_cdk_aws_iam_CfnManagedPolicyProps, _aws_cdk_aws_iam_CfnManagedPolicy, _aws_cdk_aws_iam_CfnOIDCProviderProps, _aws_cdk_aws_iam_CfnOIDCProvider, _aws_cdk_aws_iam_CfnPolicyProps, _aws_cdk_aws_iam_CfnPolicy, _aws_cdk_aws_iam_CfnRoleProps, _aws_cdk_aws_iam_CfnRole, _aws_cdk_aws_iam_CfnRole_PolicyProperty, _aws_cdk_aws_iam_CfnSAMLProviderProps, _aws_cdk_aws_iam_CfnSAMLProvider, _aws_cdk_aws_iam_CfnServerCertificateProps, _aws_cdk_aws_iam_CfnServerCertificate, _aws_cdk_aws_iam_CfnServiceLinkedRoleProps, _aws_cdk_aws_iam_CfnServiceLinkedRole, _aws_cdk_aws_iam_CfnUserProps, _aws_cdk_aws_iam_CfnUser, _aws_cdk_aws_iam_CfnUser_LoginProfileProperty, _aws_cdk_aws_iam_CfnUser_PolicyProperty, _aws_cdk_aws_iam_CfnUserToGroupAdditionProps, _aws_cdk_aws_iam_CfnUserToGroupAddition, _aws_cdk_aws_iam_CfnVirtualMFADeviceProps, _aws_cdk_aws_iam_CfnVirtualMFADevice };
