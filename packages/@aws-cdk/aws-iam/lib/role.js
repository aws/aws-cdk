"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const helpers_internal_1 = require("@aws-cdk/core/lib/helpers-internal");
const constructs_1 = require("constructs");
const grant_1 = require("./grant");
const iam_generated_1 = require("./iam.generated");
const managed_policy_1 = require("./managed-policy");
const policy_1 = require("./policy");
const policy_document_1 = require("./policy-document");
const principals_1 = require("./principals");
const assume_role_policy_1 = require("./private/assume-role-policy");
const immutable_role_1 = require("./private/immutable-role");
const imported_role_1 = require("./private/imported-role");
const policydoc_adapter_1 = require("./private/policydoc-adapter");
const precreated_role_1 = require("./private/precreated-role");
const util_1 = require("./private/util");
const MAX_INLINE_SIZE = 10000;
const MAX_MANAGEDPOL_SIZE = 6000;
const IAM_ROLE_SYMBOL = Symbol.for('@aws-cdk/packages/aws-iam/lib/role.Role');
/**
 * IAM Role
 *
 * Defines an IAM role. The role is created with an assume policy document associated with
 * the specified AWS service principal defined in `serviceAssumeRole`.
 */
class Role extends core_1.Resource {
    /**
     * Import an external role by ARN.
     *
     * If the imported Role ARN is a Token (such as a
     * `CfnParameter.valueAsString` or a `Fn.importValue()`) *and* the referenced
     * role has a `path` (like `arn:...:role/AdminRoles/Alice`), the
     * `roleName` property will not resolve to the correct value. Instead it
     * will resolve to the first path component. We unfortunately cannot express
     * the correct calculation of the full path name as a CloudFormation
     * expression. In this scenario the Role ARN should be supplied without the
     * `path` in order to resolve the correct role resource.
     *
     * @param scope construct scope
     * @param id construct id
     * @param roleArn the ARN of the role to import
     * @param options allow customizing the behavior of the returned role
     */
    static fromRoleArn(scope, id, roleArn, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_FromRoleArnOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromRoleArn);
            }
            throw error;
        }
        const scopeStack = core_1.Stack.of(scope);
        const parsedArn = scopeStack.splitArn(roleArn, core_1.ArnFormat.SLASH_RESOURCE_NAME);
        const resourceName = parsedArn.resourceName;
        const roleAccount = parsedArn.account;
        // service roles have an ARN like 'arn:aws:iam::<account>:role/service-role/<roleName>'
        // or 'arn:aws:iam::<account>:role/service-role/servicename.amazonaws.com/service-role/<roleName>'
        // we want to support these as well, so we just use the element after the last slash as role name
        const roleName = resourceName.split('/').pop();
        if ((0, helpers_internal_1.getCustomizeRolesConfig)(scope).enabled) {
            return new precreated_role_1.PrecreatedRole(scope, id, {
                rolePath: `${scope.node.path}/${id}`,
                role: new imported_role_1.ImportedRole(scope, `Import${id}`, {
                    account: roleAccount,
                    roleArn,
                    roleName,
                    ...options,
                }),
            });
        }
        if (options.addGrantsToResources !== undefined && options.mutable !== false) {
            throw new Error('\'addGrantsToResources\' can only be passed if \'mutable: false\'');
        }
        const roleArnAndScopeStackAccountComparison = core_1.Token.compareStrings(roleAccount ?? '', scopeStack.account);
        const equalOrAnyUnresolved = roleArnAndScopeStackAccountComparison === core_1.TokenComparison.SAME ||
            roleArnAndScopeStackAccountComparison === core_1.TokenComparison.BOTH_UNRESOLVED ||
            roleArnAndScopeStackAccountComparison === core_1.TokenComparison.ONE_UNRESOLVED;
        // if we are returning an immutable role then the 'importedRole' is just a throwaway construct
        // so give it a different id
        const mutableRoleId = (options.mutable !== false && equalOrAnyUnresolved) ? id : `MutableRole${id}`;
        const importedRole = new imported_role_1.ImportedRole(scope, mutableRoleId, {
            roleArn,
            roleName,
            account: roleAccount,
            ...options,
        });
        // we only return an immutable Role if both accounts were explicitly provided, and different
        return options.mutable !== false && equalOrAnyUnresolved
            ? importedRole
            : new immutable_role_1.ImmutableRole(scope, id, importedRole, options.addGrantsToResources ?? false);
    }
    /**
      * Return whether the given object is a Role
     */
    static isRole(x) {
        return x !== null && typeof (x) === 'object' && IAM_ROLE_SYMBOL in x;
    }
    /**
     * Import an external role by name.
     *
     * The imported role is assumed to exist in the same account as the account
     * the scope's containing Stack is being deployed to.
  
     * @param scope construct scope
     * @param id construct id
     * @param roleName the name of the role to import
     * @param options allow customizing the behavior of the returned role
     */
    static fromRoleName(scope, id, roleName, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_FromRoleNameOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromRoleName);
            }
            throw error;
        }
        return Role.fromRoleArn(scope, id, core_1.Stack.of(scope).formatArn({
            region: '',
            service: 'iam',
            resource: 'role',
            resourceName: roleName,
        }), options);
    }
    /**
     * Customize the creation of IAM roles within the given scope
     *
     * It is recommended that you **do not** use this method and instead allow
     * CDK to manage role creation. This should only be used
     * in environments where CDK applications are not allowed to created IAM roles.
     *
     * This can be used to prevent the CDK application from creating roles
     * within the given scope and instead replace the references to the roles with
     * precreated role names. A report will be synthesized in the cloud assembly (i.e. cdk.out)
     * that will contain the list of IAM roles that would have been created along with the
     * IAM policy statements that the role should contain. This report can then be used
     * to create the IAM roles outside of CDK and then the created role names can be provided
     * in `usePrecreatedRoles`.
     *
     * @example
     * declare const app: App;
     * Role.customizeRoles(app, {
     *   usePrecreatedRoles: {
     *     'ConstructPath/To/Role': 'my-precreated-role-name',
     *   },
     * });
     *
     * @param scope construct scope to customize role creation
     * @param options options for configuring role creation
     */
    static customizeRoles(scope, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_CustomizeRolesOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.customizeRoles);
            }
            throw error;
        }
        const preventSynthesis = options?.preventSynthesis ?? true;
        const useRoles = {};
        for (const [constructPath, roleName] of Object.entries(options?.usePrecreatedRoles ?? {})) {
            const absPath = constructPath.startsWith(scope.node.path)
                ? constructPath
                : `${scope.node.path}/${constructPath}`;
            useRoles[absPath] = roleName;
        }
        scope.node.setContext(helpers_internal_1.CUSTOMIZE_ROLES_CONTEXT_KEY, {
            preventSynthesis,
            usePrecreatedRoles: useRoles,
        });
    }
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.roleName,
        });
        this.grantPrincipal = this;
        this.principalAccount = this.env.account;
        this.assumeRoleAction = 'sts:AssumeRole';
        this.managedPolicies = [];
        this.attachedPolicies = new util_1.AttachedPolicies();
        this.dependables = new Map();
        this._didSplit = false;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_RoleProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Role);
            }
            throw error;
        }
        const externalIds = props.externalIds || [];
        if (props.externalId) {
            externalIds.push(props.externalId);
        }
        this.assumeRolePolicy = createAssumeRolePolicy(props.assumedBy, externalIds);
        this.managedPolicies.push(...props.managedPolicies || []);
        this.inlinePolicies = props.inlinePolicies || {};
        this.permissionsBoundary = props.permissionsBoundary;
        const maxSessionDuration = props.maxSessionDuration && props.maxSessionDuration.toSeconds();
        validateMaxSessionDuration(maxSessionDuration);
        const description = (props.description && props.description?.length > 0) ? props.description : undefined;
        if (description && description.length > 1000) {
            throw new Error('Role description must be no longer than 1000 characters.');
        }
        validateRolePath(props.path);
        const config = this.getPrecreatedRoleConfig();
        const roleArn = core_1.Stack.of(scope).formatArn({
            region: '',
            service: 'iam',
            resource: 'role',
            resourceName: config.precreatedRoleName,
        });
        const importedRole = new imported_role_1.ImportedRole(this, 'Import' + id, {
            roleArn,
            roleName: config.precreatedRoleName ?? id,
            account: core_1.Stack.of(this).account,
        });
        this.roleName = importedRole.roleName;
        this.roleArn = importedRole.roleArn;
        if (config.enabled) {
            const role = new precreated_role_1.PrecreatedRole(this, 'PrecreatedRole' + id, {
                rolePath: this.node.path,
                role: importedRole,
                missing: !config.precreatedRoleName,
                assumeRolePolicy: this.assumeRolePolicy,
            });
            this.managedPolicies.forEach(policy => role.addManagedPolicy(policy));
            Object.entries(this.inlinePolicies).forEach(([name, policy]) => {
                role.attachInlinePolicy(new policy_1.Policy(this, name, { document: policy }));
            });
            this._precreatedRole = role;
        }
        // synthesize the resource if preventSynthesis=false
        if (!config.preventSynthesis) {
            const role = new iam_generated_1.CfnRole(this, 'Resource', {
                assumeRolePolicyDocument: this.assumeRolePolicy,
                managedPolicyArns: util_1.UniqueStringSet.from(() => this.managedPolicies.map(p => p.managedPolicyArn)),
                policies: _flatten(this.inlinePolicies),
                path: props.path,
                permissionsBoundary: this.permissionsBoundary ? this.permissionsBoundary.managedPolicyArn : undefined,
                roleName: this.physicalName,
                maxSessionDuration,
                description,
            });
            this._roleId = role.attrRoleId;
            this.roleArn = this.getResourceArnAttribute(role.attrArn, {
                region: '',
                service: 'iam',
                resource: 'role',
                // Removes leading slash from path
                resourceName: `${props.path ? props.path.substr(props.path.charAt(0) === '/' ? 1 : 0) : ''}${this.physicalName}`,
            });
            this.roleName = this.getResourceNameAttribute(role.ref);
            core_1.Aspects.of(this).add({
                visit: (c) => {
                    if (c === this) {
                        this.splitLargePolicy();
                    }
                },
            });
        }
        this.policyFragment = new principals_1.ArnPrincipal(this.roleArn).policyFragment;
        function _flatten(policies) {
            if (policies == null || Object.keys(policies).length === 0) {
                return undefined;
            }
            const result = new Array();
            for (const policyName of Object.keys(policies)) {
                const policyDocument = policies[policyName];
                result.push({ policyName, policyDocument });
            }
            return result;
        }
        this.node.addValidation({ validate: () => this.validateRole() });
    }
    /**
     * Adds a permission to the role's default policy document.
     * If there is no default policy attached to this role, it will be created.
     * @param statement The permission statement to add to the policy document
     */
    addToPrincipalPolicy(statement) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_PolicyStatement(statement);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addToPrincipalPolicy);
            }
            throw error;
        }
        if (this._precreatedRole) {
            return this._precreatedRole.addToPrincipalPolicy(statement);
        }
        else {
            if (!this.defaultPolicy) {
                this.defaultPolicy = new policy_1.Policy(this, 'DefaultPolicy');
                this.attachInlinePolicy(this.defaultPolicy);
            }
            this.defaultPolicy.addStatements(statement);
            // We might split this statement off into a different policy, so we'll need to
            // late-bind the dependable.
            const policyDependable = new constructs_1.DependencyGroup();
            this.dependables.set(statement, policyDependable);
            return { statementAdded: true, policyDependable };
        }
    }
    addToPolicy(statement) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_PolicyStatement(statement);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addToPolicy);
            }
            throw error;
        }
        if (this._precreatedRole) {
            return this._precreatedRole.addToPolicy(statement);
        }
        else {
            return this.addToPrincipalPolicy(statement).statementAdded;
        }
    }
    /**
     * Attaches a managed policy to this role.
     * @param policy The the managed policy to attach.
     */
    addManagedPolicy(policy) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IManagedPolicy(policy);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addManagedPolicy);
            }
            throw error;
        }
        if (this._precreatedRole) {
            return this._precreatedRole.addManagedPolicy(policy);
        }
        else {
            if (this.managedPolicies.find(mp => mp === policy)) {
                return;
            }
            this.managedPolicies.push(policy);
        }
    }
    /**
     * Attaches a policy to this role.
     * @param policy The policy to attach
     */
    attachInlinePolicy(policy) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_Policy(policy);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.attachInlinePolicy);
            }
            throw error;
        }
        if (this._precreatedRole) {
            this._precreatedRole.attachInlinePolicy(policy);
        }
        else {
            this.attachedPolicies.attach(policy);
            policy.attachToRole(this);
        }
    }
    /**
     * Grant the actions defined in actions to the identity Principal on this resource.
     */
    grant(grantee, ...actions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IPrincipal(grantee);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.grant);
            }
            throw error;
        }
        return grant_1.Grant.addToPrincipal({
            grantee,
            actions,
            resourceArns: [this.roleArn],
            scope: this,
        });
    }
    /**
     * Grant permissions to the given principal to pass this role.
     */
    grantPassRole(identity) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IPrincipal(identity);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.grantPassRole);
            }
            throw error;
        }
        return this.grant(identity, 'iam:PassRole');
    }
    /**
     * Grant permissions to the given principal to assume this role.
     */
    grantAssumeRole(identity) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IPrincipal(identity);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.grantAssumeRole);
            }
            throw error;
        }
        return this.grant(identity, 'sts:AssumeRole');
    }
    /**
     * Returns the stable and unique string identifying the role. For example,
     * AIDAJQABLZS4A3QDU576Q.
     *
     * @attribute
     */
    get roleId() {
        if (!this._roleId) {
            throw new Error('"roleId" is not available on precreated roles');
        }
        return this._roleId;
    }
    /**
     * Return a copy of this Role object whose Policies will not be updated
     *
     * Use the object returned by this method if you want this Role to be used by
     * a construct without it automatically updating the Role's Policies.
     *
     * If you do, you are responsible for adding the correct statements to the
     * Role's policies yourself.
     */
    withoutPolicyUpdates(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_WithoutPolicyUpdatesOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.withoutPolicyUpdates);
            }
            throw error;
        }
        if (!this.immutableRole) {
            this.immutableRole = new immutable_role_1.ImmutableRole(constructs_1.Node.of(this).scope, `ImmutableRole${this.node.id}`, this, options.addGrantsToResources ?? false);
        }
        return this.immutableRole;
    }
    validateRole() {
        const errors = new Array();
        errors.push(...this.assumeRolePolicy?.validateForResourcePolicy() ?? []);
        for (const policy of Object.values(this.inlinePolicies)) {
            errors.push(...policy.validateForIdentityPolicy());
        }
        return errors;
    }
    /**
     * Split large inline policies into managed policies
     *
     * This gets around the 10k bytes limit on role policies.
     */
    splitLargePolicy() {
        if (!this.defaultPolicy || this._didSplit) {
            return;
        }
        this._didSplit = true;
        const self = this;
        const originalDoc = this.defaultPolicy.document;
        const splitOffDocs = originalDoc._splitDocument(this, MAX_INLINE_SIZE, MAX_MANAGEDPOL_SIZE);
        // Includes the "current" document
        const mpCount = this.managedPolicies.length + (splitOffDocs.size - 1);
        if (mpCount > 20) {
            core_1.Annotations.of(this).addWarning(`Policy too large: ${mpCount} exceeds the maximum of 20 managed policies attached to a Role`);
        }
        else if (mpCount > 10) {
            core_1.Annotations.of(this).addWarning(`Policy large: ${mpCount} exceeds 10 managed policies attached to a Role, this requires a quota increase`);
        }
        // Create the managed policies and fix up the dependencies
        markDeclaringConstruct(originalDoc, this.defaultPolicy);
        let i = 1;
        for (const newDoc of splitOffDocs.keys()) {
            if (newDoc === originalDoc) {
                continue;
            }
            const mp = new managed_policy_1.ManagedPolicy(this, `OverflowPolicy${i++}`, {
                description: `Part of the policies for ${this.node.path}`,
                document: newDoc,
                roles: [this],
            });
            markDeclaringConstruct(newDoc, mp);
        }
        /**
         * Update the Dependables for the statements in the given PolicyDocument to point to the actual declaring construct
         */
        function markDeclaringConstruct(doc, declaringConstruct) {
            for (const original of splitOffDocs.get(doc) ?? []) {
                self.dependables.get(original)?.add(declaringConstruct);
            }
        }
    }
    /**
     * Return configuration for precreated roles
     */
    getPrecreatedRoleConfig() {
        return (0, helpers_internal_1.getPrecreatedRoleConfig)(this);
    }
}
_a = JSII_RTTI_SYMBOL_1;
Role[_a] = { fqn: "@aws-cdk/aws-iam.Role", version: "0.0.0" };
exports.Role = Role;
function createAssumeRolePolicy(principal, externalIds) {
    const actualDoc = new policy_document_1.PolicyDocument();
    // If requested, add externalIds to every statement added to this doc
    const addDoc = externalIds.length === 0
        ? actualDoc
        : new policydoc_adapter_1.MutatingPolicyDocumentAdapter(actualDoc, (statement) => {
            statement.addCondition('StringEquals', {
                'sts:ExternalId': externalIds.length === 1 ? externalIds[0] : externalIds,
            });
            return statement;
        });
    (0, assume_role_policy_1.defaultAddPrincipalToAssumeRole)(principal, addDoc);
    return actualDoc;
}
function validateRolePath(path) {
    if (path === undefined || core_1.Token.isUnresolved(path)) {
        return;
    }
    const validRolePath = /^(\/|\/[\u0021-\u007F]+\/)$/;
    if (path.length == 0 || path.length > 512) {
        throw new Error(`Role path must be between 1 and 512 characters. The provided role path is ${path.length} characters.`);
    }
    else if (!validRolePath.test(path)) {
        throw new Error('Role path must be either a slash or valid characters (alphanumerics and symbols) surrounded by slashes. '
            + `Valid characters are unicode characters in [\\u0021-\\u007F]. However, ${path} is provided.`);
    }
}
function validateMaxSessionDuration(duration) {
    if (duration === undefined) {
        return;
    }
    if (duration < 3600 || duration > 43200) {
        throw new Error(`maxSessionDuration is set to ${duration}, but must be >= 3600sec (1hr) and <= 43200sec (12hrs)`);
    }
}
Object.defineProperty(Role.prototype, IAM_ROLE_SYMBOL, {
    value: true,
    enumerable: false,
    writable: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQW1IO0FBQ25ILHlFQUF3SjtBQUN4SiwyQ0FBMEU7QUFDMUUsbUNBQWdDO0FBQ2hDLG1EQUEwQztBQUUxQyxxREFBaUU7QUFDakUscUNBQWtDO0FBQ2xDLHVEQUFtRDtBQUVuRCw2Q0FBNkc7QUFDN0cscUVBQStFO0FBQy9FLDZEQUF5RDtBQUN6RCwyREFBdUQ7QUFDdkQsbUVBQTRFO0FBQzVFLCtEQUEyRDtBQUMzRCx5Q0FBbUU7QUFFbkUsTUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDO0FBQzlCLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLE1BQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMseUNBQXlDLENBQUMsQ0FBQztBQWdOOUU7Ozs7O0dBS0c7QUFDSCxNQUFhLElBQUssU0FBUSxlQUFRO0lBQ2hDOzs7Ozs7Ozs7Ozs7Ozs7O09BZ0JHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxPQUFlLEVBQUUsVUFBOEIsRUFBRTs7Ozs7Ozs7OztRQUN2RyxNQUFNLFVBQVUsR0FBRyxZQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLGdCQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUM5RSxNQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsWUFBYSxDQUFDO1FBQzdDLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDdEMsdUZBQXVGO1FBQ3ZGLGtHQUFrRztRQUNsRyxpR0FBaUc7UUFDakcsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUcsQ0FBQztRQUVoRCxJQUFJLElBQUEs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QUFNLGNBQWMsQ0FBQyxDQUFDO0tBQ3pIO1NBQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDcEMsTUFBTSxJQUFJLEtBQUssQ0FDYiwwR0FBMEc7Y0FDeEcsMEVBQTBFLElBQUksZUFBZSxDQUFDLENBQUM7S0FDcEc7QUFDSCxDQUFDO0FBRUQsU0FBUywwQkFBMEIsQ0FBQyxRQUFpQjtJQUNuRCxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7UUFDMUIsT0FBTztLQUNSO0lBRUQsSUFBSSxRQUFRLEdBQUcsSUFBSSxJQUFJLFFBQVEsR0FBRyxLQUFLLEVBQUU7UUFDdkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsUUFBUSx3REFBd0QsQ0FBQyxDQUFDO0tBQ25IO0FBQ0gsQ0FBQztBQW1CRCxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZUFBZSxFQUFFO0lBQ3JELEtBQUssRUFBRSxJQUFJO0lBQ1gsVUFBVSxFQUFFLEtBQUs7SUFDakIsUUFBUSxFQUFFLEtBQUs7Q0FDaEIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXJuRm9ybWF0LCBEdXJhdGlvbiwgUmVzb3VyY2UsIFN0YWNrLCBUb2tlbiwgVG9rZW5Db21wYXJpc29uLCBBc3BlY3RzLCBBbm5vdGF0aW9ucyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgZ2V0Q3VzdG9taXplUm9sZXNDb25maWcsIGdldFByZWNyZWF0ZWRSb2xlQ29uZmlnLCBDVVNUT01JWkVfUk9MRVNfQ09OVEVYVF9LRVksIEN1c3RvbWl6ZVJvbGVDb25maWcgfSBmcm9tICdAYXdzLWNkay9jb3JlL2xpYi9oZWxwZXJzLWludGVybmFsJztcbmltcG9ydCB7IENvbnN0cnVjdCwgSUNvbnN0cnVjdCwgRGVwZW5kZW5jeUdyb3VwLCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBHcmFudCB9IGZyb20gJy4vZ3JhbnQnO1xuaW1wb3J0IHsgQ2ZuUm9sZSB9IGZyb20gJy4vaWFtLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBJSWRlbnRpdHkgfSBmcm9tICcuL2lkZW50aXR5LWJhc2UnO1xuaW1wb3J0IHsgSU1hbmFnZWRQb2xpY3ksIE1hbmFnZWRQb2xpY3kgfSBmcm9tICcuL21hbmFnZWQtcG9saWN5JztcbmltcG9ydCB7IFBvbGljeSB9IGZyb20gJy4vcG9saWN5JztcbmltcG9ydCB7IFBvbGljeURvY3VtZW50IH0gZnJvbSAnLi9wb2xpY3ktZG9jdW1lbnQnO1xuaW1wb3J0IHsgUG9saWN5U3RhdGVtZW50IH0gZnJvbSAnLi9wb2xpY3ktc3RhdGVtZW50JztcbmltcG9ydCB7IEFkZFRvUHJpbmNpcGFsUG9saWN5UmVzdWx0LCBBcm5QcmluY2lwYWwsIElQcmluY2lwYWwsIFByaW5jaXBhbFBvbGljeUZyYWdtZW50IH0gZnJvbSAnLi9wcmluY2lwYWxzJztcbmltcG9ydCB7IGRlZmF1bHRBZGRQcmluY2lwYWxUb0Fzc3VtZVJvbGUgfSBmcm9tICcuL3ByaXZhdGUvYXNzdW1lLXJvbGUtcG9saWN5JztcbmltcG9ydCB7IEltbXV0YWJsZVJvbGUgfSBmcm9tICcuL3ByaXZhdGUvaW1tdXRhYmxlLXJvbGUnO1xuaW1wb3J0IHsgSW1wb3J0ZWRSb2xlIH0gZnJvbSAnLi9wcml2YXRlL2ltcG9ydGVkLXJvbGUnO1xuaW1wb3J0IHsgTXV0YXRpbmdQb2xpY3lEb2N1bWVudEFkYXB0ZXIgfSBmcm9tICcuL3ByaXZhdGUvcG9saWN5ZG9jLWFkYXB0ZXInO1xuaW1wb3J0IHsgUHJlY3JlYXRlZFJvbGUgfSBmcm9tICcuL3ByaXZhdGUvcHJlY3JlYXRlZC1yb2xlJztcbmltcG9ydCB7IEF0dGFjaGVkUG9saWNpZXMsIFVuaXF1ZVN0cmluZ1NldCB9IGZyb20gJy4vcHJpdmF0ZS91dGlsJztcblxuY29uc3QgTUFYX0lOTElORV9TSVpFID0gMTAwMDA7XG5jb25zdCBNQVhfTUFOQUdFRFBPTF9TSVpFID0gNjAwMDtcbmNvbnN0IElBTV9ST0xFX1NZTUJPTCA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL3BhY2thZ2VzL2F3cy1pYW0vbGliL3JvbGUuUm9sZScpO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGFuIElBTSBSb2xlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUm9sZVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBJQU0gcHJpbmNpcGFsIChpLmUuIGBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKWApXG4gICAqIHdoaWNoIGNhbiBhc3N1bWUgdGhpcyByb2xlLlxuICAgKlxuICAgKiBZb3UgY2FuIGxhdGVyIG1vZGlmeSB0aGUgYXNzdW1lIHJvbGUgcG9saWN5IGRvY3VtZW50IGJ5IGFjY2Vzc2luZyBpdCB2aWFcbiAgICogdGhlIGBhc3N1bWVSb2xlUG9saWN5YCBwcm9wZXJ0eS5cbiAgICovXG4gIHJlYWRvbmx5IGFzc3VtZWRCeTogSVByaW5jaXBhbDtcblxuICAvKipcbiAgICogSUQgdGhhdCB0aGUgcm9sZSBhc3N1bWVyIG5lZWRzIHRvIHByb3ZpZGUgd2hlbiBhc3N1bWluZyB0aGlzIHJvbGVcbiAgICpcbiAgICogSWYgdGhlIGNvbmZpZ3VyZWQgYW5kIHByb3ZpZGVkIGV4dGVybmFsIElEcyBkbyBub3QgbWF0Y2gsIHRoZVxuICAgKiBBc3N1bWVSb2xlIG9wZXJhdGlvbiB3aWxsIGZhaWwuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHNlZSBgZXh0ZXJuYWxJZHNgXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIGV4dGVybmFsIElEIHJlcXVpcmVkXG4gICAqL1xuICByZWFkb25seSBleHRlcm5hbElkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIElEcyB0aGF0IHRoZSByb2xlIGFzc3VtZXIgbmVlZHMgdG8gcHJvdmlkZSBvbmUgb2Ygd2hlbiBhc3N1bWluZyB0aGlzIHJvbGVcbiAgICpcbiAgICogSWYgdGhlIGNvbmZpZ3VyZWQgYW5kIHByb3ZpZGVkIGV4dGVybmFsIElEcyBkbyBub3QgbWF0Y2gsIHRoZVxuICAgKiBBc3N1bWVSb2xlIG9wZXJhdGlvbiB3aWxsIGZhaWwuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIGV4dGVybmFsIElEIHJlcXVpcmVkXG4gICAqL1xuICByZWFkb25seSBleHRlcm5hbElkcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgbWFuYWdlZCBwb2xpY2llcyBhc3NvY2lhdGVkIHdpdGggdGhpcyByb2xlLlxuICAgKlxuICAgKiBZb3UgY2FuIGFkZCBtYW5hZ2VkIHBvbGljaWVzIGxhdGVyIHVzaW5nXG4gICAqIGBhZGRNYW5hZ2VkUG9saWN5KE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKHBvbGljeU5hbWUpKWAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gbWFuYWdlZCBwb2xpY2llcy5cbiAgICovXG4gIHJlYWRvbmx5IG1hbmFnZWRQb2xpY2llcz86IElNYW5hZ2VkUG9saWN5W107XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBuYW1lZCBwb2xpY2llcyB0byBpbmxpbmUgaW50byB0aGlzIHJvbGUuIFRoZXNlIHBvbGljaWVzIHdpbGwgYmVcbiAgICogY3JlYXRlZCB3aXRoIHRoZSByb2xlLCB3aGVyZWFzIHRob3NlIGFkZGVkIGJ5IGBgYWRkVG9Qb2xpY3lgYCBhcmUgYWRkZWRcbiAgICogdXNpbmcgYSBzZXBhcmF0ZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSAoYWxsb3dpbmcgYSB3YXkgYXJvdW5kIGNpcmN1bGFyXG4gICAqIGRlcGVuZGVuY2llcyB0aGF0IGNvdWxkIG90aGVyd2lzZSBiZSBpbnRyb2R1Y2VkKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBwb2xpY3kgaXMgaW5saW5lZCBpbiB0aGUgUm9sZSByZXNvdXJjZS5cbiAgICovXG4gIHJlYWRvbmx5IGlubGluZVBvbGljaWVzPzogeyBbbmFtZTogc3RyaW5nXTogUG9saWN5RG9jdW1lbnQgfTtcblxuICAvKipcbiAgICogVGhlIHBhdGggYXNzb2NpYXRlZCB3aXRoIHRoaXMgcm9sZS4gRm9yIGluZm9ybWF0aW9uIGFib3V0IElBTSBwYXRocywgc2VlXG4gICAqIEZyaWVuZGx5IE5hbWVzIGFuZCBQYXRocyBpbiBJQU0gVXNlciBHdWlkZS5cbiAgICpcbiAgICogQGRlZmF1bHQgL1xuICAgKi9cbiAgcmVhZG9ubHkgcGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogQVdTIHN1cHBvcnRzIHBlcm1pc3Npb25zIGJvdW5kYXJpZXMgZm9yIElBTSBlbnRpdGllcyAodXNlcnMgb3Igcm9sZXMpLlxuICAgKiBBIHBlcm1pc3Npb25zIGJvdW5kYXJ5IGlzIGFuIGFkdmFuY2VkIGZlYXR1cmUgZm9yIHVzaW5nIGEgbWFuYWdlZCBwb2xpY3lcbiAgICogdG8gc2V0IHRoZSBtYXhpbXVtIHBlcm1pc3Npb25zIHRoYXQgYW4gaWRlbnRpdHktYmFzZWQgcG9saWN5IGNhbiBncmFudCB0b1xuICAgKiBhbiBJQU0gZW50aXR5LiBBbiBlbnRpdHkncyBwZXJtaXNzaW9ucyBib3VuZGFyeSBhbGxvd3MgaXQgdG8gcGVyZm9ybSBvbmx5XG4gICAqIHRoZSBhY3Rpb25zIHRoYXQgYXJlIGFsbG93ZWQgYnkgYm90aCBpdHMgaWRlbnRpdHktYmFzZWQgcG9saWNpZXMgYW5kIGl0c1xuICAgKiBwZXJtaXNzaW9ucyBib3VuZGFyaWVzLlxuICAgKlxuICAgKiBAbGluayBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtaWFtLXJvbGUuaHRtbCNjZm4taWFtLXJvbGUtcGVybWlzc2lvbnNib3VuZGFyeVxuICAgKiBAbGluayBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvYWNjZXNzX3BvbGljaWVzX2JvdW5kYXJpZXMuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHBlcm1pc3Npb25zIGJvdW5kYXJ5LlxuICAgKi9cbiAgcmVhZG9ubHkgcGVybWlzc2lvbnNCb3VuZGFyeT86IElNYW5hZ2VkUG9saWN5O1xuXG4gIC8qKlxuICAgKiBBIG5hbWUgZm9yIHRoZSBJQU0gcm9sZS4gRm9yIHZhbGlkIHZhbHVlcywgc2VlIHRoZSBSb2xlTmFtZSBwYXJhbWV0ZXIgZm9yXG4gICAqIHRoZSBDcmVhdGVSb2xlIGFjdGlvbiBpbiB0aGUgSUFNIEFQSSBSZWZlcmVuY2UuXG4gICAqXG4gICAqIElNUE9SVEFOVDogSWYgeW91IHNwZWNpZnkgYSBuYW1lLCB5b3UgY2Fubm90IHBlcmZvcm0gdXBkYXRlcyB0aGF0IHJlcXVpcmVcbiAgICogcmVwbGFjZW1lbnQgb2YgdGhpcyByZXNvdXJjZS4gWW91IGNhbiBwZXJmb3JtIHVwZGF0ZXMgdGhhdCByZXF1aXJlIG5vIG9yXG4gICAqIHNvbWUgaW50ZXJydXB0aW9uLiBJZiB5b3UgbXVzdCByZXBsYWNlIHRoZSByZXNvdXJjZSwgc3BlY2lmeSBhIG5ldyBuYW1lLlxuICAgKlxuICAgKiBJZiB5b3Ugc3BlY2lmeSBhIG5hbWUsIHlvdSBtdXN0IHNwZWNpZnkgdGhlIENBUEFCSUxJVFlfTkFNRURfSUFNIHZhbHVlIHRvXG4gICAqIGFja25vd2xlZGdlIHlvdXIgdGVtcGxhdGUncyBjYXBhYmlsaXRpZXMuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWVcbiAgICogQWNrbm93bGVkZ2luZyBJQU0gUmVzb3VyY2VzIGluIEFXUyBDbG91ZEZvcm1hdGlvbiBUZW1wbGF0ZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQVdTIENsb3VkRm9ybWF0aW9uIGdlbmVyYXRlcyBhIHVuaXF1ZSBwaHlzaWNhbCBJRCBhbmQgdXNlcyB0aGF0IElEXG4gICAqIGZvciB0aGUgcm9sZSBuYW1lLlxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIHNlc3Npb24gZHVyYXRpb24gdGhhdCB5b3Ugd2FudCB0byBzZXQgZm9yIHRoZSBzcGVjaWZpZWQgcm9sZS5cbiAgICogVGhpcyBzZXR0aW5nIGNhbiBoYXZlIGEgdmFsdWUgZnJvbSAxIGhvdXIgKDM2MDBzZWMpIHRvIDEyICg0MzIwMHNlYykgaG91cnMuXG4gICAqXG4gICAqIEFueW9uZSB3aG8gYXNzdW1lcyB0aGUgcm9sZSBmcm9tIHRoZSBBV1MgQ0xJIG9yIEFQSSBjYW4gdXNlIHRoZVxuICAgKiBEdXJhdGlvblNlY29uZHMgQVBJIHBhcmFtZXRlciBvciB0aGUgZHVyYXRpb24tc2Vjb25kcyBDTEkgcGFyYW1ldGVyIHRvXG4gICAqIHJlcXVlc3QgYSBsb25nZXIgc2Vzc2lvbi4gVGhlIE1heFNlc3Npb25EdXJhdGlvbiBzZXR0aW5nIGRldGVybWluZXMgdGhlXG4gICAqIG1heGltdW0gZHVyYXRpb24gdGhhdCBjYW4gYmUgcmVxdWVzdGVkIHVzaW5nIHRoZSBEdXJhdGlvblNlY29uZHNcbiAgICogcGFyYW1ldGVyLlxuICAgKlxuICAgKiBJZiB1c2VycyBkb24ndCBzcGVjaWZ5IGEgdmFsdWUgZm9yIHRoZSBEdXJhdGlvblNlY29uZHMgcGFyYW1ldGVyLCB0aGVpclxuICAgKiBzZWN1cml0eSBjcmVkZW50aWFscyBhcmUgdmFsaWQgZm9yIG9uZSBob3VyIGJ5IGRlZmF1bHQuIFRoaXMgYXBwbGllcyB3aGVuXG4gICAqIHlvdSB1c2UgdGhlIEFzc3VtZVJvbGUqIEFQSSBvcGVyYXRpb25zIG9yIHRoZSBhc3N1bWUtcm9sZSogQ0xJIG9wZXJhdGlvbnNcbiAgICogYnV0IGRvZXMgbm90IGFwcGx5IHdoZW4geW91IHVzZSB0aG9zZSBvcGVyYXRpb25zIHRvIGNyZWF0ZSBhIGNvbnNvbGUgVVJMLlxuICAgKlxuICAgKiBAbGluayBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvaWRfcm9sZXNfdXNlLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24uaG91cnMoMSlcbiAgICovXG4gIHJlYWRvbmx5IG1heFNlc3Npb25EdXJhdGlvbj86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBBIGRlc2NyaXB0aW9uIG9mIHRoZSByb2xlLiBJdCBjYW4gYmUgdXAgdG8gMTAwMCBjaGFyYWN0ZXJzIGxvbmcuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVzY3JpcHRpb24uXG4gICAqL1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBPcHRpb25zIGFsbG93aW5nIGN1c3RvbWl6aW5nIHRoZSBiZWhhdmlvciBvZiBgUm9sZS5mcm9tUm9sZUFybmAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRnJvbVJvbGVBcm5PcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGltcG9ydGVkIHJvbGUgY2FuIGJlIG1vZGlmaWVkIGJ5IGF0dGFjaGluZyBwb2xpY3kgcmVzb3VyY2VzIHRvIGl0LlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBtdXRhYmxlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRm9yIGltbXV0YWJsZSByb2xlczogYWRkIGdyYW50cyB0byByZXNvdXJjZXMgaW5zdGVhZCBvZiBkcm9wcGluZyB0aGVtXG4gICAqXG4gICAqIElmIHRoaXMgaXMgYGZhbHNlYCBvciBub3Qgc3BlY2lmaWVkLCBncmFudCBwZXJtaXNzaW9ucyBhZGRlZCB0byB0aGlzIHJvbGUgYXJlIGlnbm9yZWQuXG4gICAqIEl0IGlzIHlvdXIgb3duIHJlc3BvbnNpYmlsaXR5IHRvIG1ha2Ugc3VyZSB0aGUgcm9sZSBoYXMgdGhlIHJlcXVpcmVkIHBlcm1pc3Npb25zLlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIGB0cnVlYCwgYW55IGdyYW50IHBlcm1pc3Npb25zIHdpbGwgYmUgYWRkZWQgdG8gdGhlIHJlc291cmNlIGluc3RlYWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBhZGRHcmFudHNUb1Jlc291cmNlcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEFueSBwb2xpY2llcyBjcmVhdGVkIGJ5IHRoaXMgcm9sZSB3aWxsIHVzZSB0aGlzIHZhbHVlIGFzIHRoZWlyIElELCBpZiBzcGVjaWZpZWQuXG4gICAqIFNwZWNpZnkgdGhpcyBpZiBpbXBvcnRpbmcgdGhlIHNhbWUgcm9sZSBpbiBtdWx0aXBsZSBzdGFja3MsIGFuZCBncmFudGluZyBpdFxuICAgKiBkaWZmZXJlbnQgcGVybWlzc2lvbnMgaW4gYXQgbGVhc3QgdHdvIHN0YWNrcy4gSWYgdGhpcyBpcyBub3Qgc3BlY2lmaWVkXG4gICAqIChvciBpZiB0aGUgc2FtZSBuYW1lIGlzIHNwZWNpZmllZCBpbiBtb3JlIHRoYW4gb25lIHN0YWNrKSxcbiAgICogYSBDbG91ZEZvcm1hdGlvbiBpc3N1ZSB3aWxsIHJlc3VsdCBpbiB0aGUgcG9saWN5IGNyZWF0ZWQgaW4gd2hpY2hldmVyIHN0YWNrXG4gICAqIGlzIGRlcGxveWVkIGxhc3Qgb3ZlcndyaXRpbmcgdGhlIHBvbGljaWVzIGNyZWF0ZWQgYnkgdGhlIG90aGVycy5cbiAgICpcbiAgICogQGRlZmF1bHQgJ1BvbGljeSdcbiAgICovXG4gIHJlYWRvbmx5IGRlZmF1bHRQb2xpY3lOYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGN1c3RvbWl6aW5nIElBTSByb2xlIGNyZWF0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9taXplUm9sZXNPcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRvIHN5bnRoZXNpemUgdGhlIHJlc291cmNlIGludG8gdGhlIENGTiB0ZW1wbGF0ZS5cbiAgICpcbiAgICogU2V0IHRoaXMgdG8gYGZhbHNlYCBpZiB5b3Ugc3RpbGwgd2FudCB0byBjcmVhdGUgdGhlIHJlc291cmNlcyBfYW5kX1xuICAgKiB5b3UgYWxzbyB3YW50IHRvIGNyZWF0ZSB0aGUgcG9saWN5IHJlcG9ydC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJldmVudFN5bnRoZXNpcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBwcmVjcmVhdGVkIElBTSByb2xlcyB0byBzdWJzdGl0dXRlIGZvciByb2xlc1xuICAgKiB0aGF0IENESyBpcyBjcmVhdGluZy5cbiAgICpcbiAgICogVGhlIGNvbnN0cnVjdFBhdGggY2FuIGJlIGVpdGhlciBhIHJlbGF0aXZlIG9yIGFic29sdXRlIHBhdGhcbiAgICogZnJvbSB0aGUgc2NvcGUgdGhhdCBgY3VzdG9taXplUm9sZXNgIGlzIHVzZWQgb24gdG8gdGhlIHJvbGUgYmVpbmcgY3JlYXRlZC5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGlmIHlvdSB3ZXJlIGNyZWF0aW5nIGEgcm9sZVxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG4gICAqIG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJyk7XG4gICAqXG4gICAqIFJvbGUuY3VzdG9taXplUm9sZXMoc3RhY2ssIHtcbiAgICogICB1c2VQcmVjcmVhdGVkUm9sZXM6IHtcbiAgICogICAgICAvLyBhYnNvbHV0ZSBwYXRoXG4gICAqICAgICAnTXlTdGFjay9NeVJvbGUnOiAnbXktcHJlY3JlYXRlZC1yb2xlLW5hbWUnLFxuICAgKiAgICAgLy8gb3IgcmVsYXRpdmUgcGF0aCBmcm9tIGBzdGFja2BcbiAgICogICAgICdNeVJvbGUnOiAnbXktcHJlY3JlYXRlZC1yb2xlJyxcbiAgICogICB9LFxuICAgKiB9KTtcbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGVyZSBhcmUgbm8gcHJlY3JlYXRlZCByb2xlcy4gU3ludGhlc2lzIHdpbGwgZmFpbCBpZiBgcHJldmVudFN5bnRoZXNpcz10cnVlYFxuICAgKi9cbiAgcmVhZG9ubHkgdXNlUHJlY3JlYXRlZFJvbGVzPzogeyBbY29uc3RydWN0UGF0aDogc3RyaW5nXTogc3RyaW5nIH07XG59XG5cbi8qKlxuICogT3B0aW9ucyBhbGxvd2luZyBjdXN0b21pemluZyB0aGUgYmVoYXZpb3Igb2YgYFJvbGUuZnJvbVJvbGVOYW1lYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGcm9tUm9sZU5hbWVPcHRpb25zIGV4dGVuZHMgRnJvbVJvbGVBcm5PcHRpb25zIHsgfVxuXG4vKipcbiAqIElBTSBSb2xlXG4gKlxuICogRGVmaW5lcyBhbiBJQU0gcm9sZS4gVGhlIHJvbGUgaXMgY3JlYXRlZCB3aXRoIGFuIGFzc3VtZSBwb2xpY3kgZG9jdW1lbnQgYXNzb2NpYXRlZCB3aXRoXG4gKiB0aGUgc3BlY2lmaWVkIEFXUyBzZXJ2aWNlIHByaW5jaXBhbCBkZWZpbmVkIGluIGBzZXJ2aWNlQXNzdW1lUm9sZWAuXG4gKi9cbmV4cG9ydCBjbGFzcyBSb2xlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJUm9sZSB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXh0ZXJuYWwgcm9sZSBieSBBUk4uXG4gICAqXG4gICAqIElmIHRoZSBpbXBvcnRlZCBSb2xlIEFSTiBpcyBhIFRva2VuIChzdWNoIGFzIGFcbiAgICogYENmblBhcmFtZXRlci52YWx1ZUFzU3RyaW5nYCBvciBhIGBGbi5pbXBvcnRWYWx1ZSgpYCkgKmFuZCogdGhlIHJlZmVyZW5jZWRcbiAgICogcm9sZSBoYXMgYSBgcGF0aGAgKGxpa2UgYGFybjouLi46cm9sZS9BZG1pblJvbGVzL0FsaWNlYCksIHRoZVxuICAgKiBgcm9sZU5hbWVgIHByb3BlcnR5IHdpbGwgbm90IHJlc29sdmUgdG8gdGhlIGNvcnJlY3QgdmFsdWUuIEluc3RlYWQgaXRcbiAgICogd2lsbCByZXNvbHZlIHRvIHRoZSBmaXJzdCBwYXRoIGNvbXBvbmVudC4gV2UgdW5mb3J0dW5hdGVseSBjYW5ub3QgZXhwcmVzc1xuICAgKiB0aGUgY29ycmVjdCBjYWxjdWxhdGlvbiBvZiB0aGUgZnVsbCBwYXRoIG5hbWUgYXMgYSBDbG91ZEZvcm1hdGlvblxuICAgKiBleHByZXNzaW9uLiBJbiB0aGlzIHNjZW5hcmlvIHRoZSBSb2xlIEFSTiBzaG91bGQgYmUgc3VwcGxpZWQgd2l0aG91dCB0aGVcbiAgICogYHBhdGhgIGluIG9yZGVyIHRvIHJlc29sdmUgdGhlIGNvcnJlY3Qgcm9sZSByZXNvdXJjZS5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIGNvbnN0cnVjdCBzY29wZVxuICAgKiBAcGFyYW0gaWQgY29uc3RydWN0IGlkXG4gICAqIEBwYXJhbSByb2xlQXJuIHRoZSBBUk4gb2YgdGhlIHJvbGUgdG8gaW1wb3J0XG4gICAqIEBwYXJhbSBvcHRpb25zIGFsbG93IGN1c3RvbWl6aW5nIHRoZSBiZWhhdmlvciBvZiB0aGUgcmV0dXJuZWQgcm9sZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tUm9sZUFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCByb2xlQXJuOiBzdHJpbmcsIG9wdGlvbnM6IEZyb21Sb2xlQXJuT3B0aW9ucyA9IHt9KTogSVJvbGUge1xuICAgIGNvbnN0IHNjb3BlU3RhY2sgPSBTdGFjay5vZihzY29wZSk7XG4gICAgY29uc3QgcGFyc2VkQXJuID0gc2NvcGVTdGFjay5zcGxpdEFybihyb2xlQXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSk7XG4gICAgY29uc3QgcmVzb3VyY2VOYW1lID0gcGFyc2VkQXJuLnJlc291cmNlTmFtZSE7XG4gICAgY29uc3Qgcm9sZUFjY291bnQgPSBwYXJzZWRBcm4uYWNjb3VudDtcbiAgICAvLyBzZXJ2aWNlIHJvbGVzIGhhdmUgYW4gQVJOIGxpa2UgJ2Fybjphd3M6aWFtOjo8YWNjb3VudD46cm9sZS9zZXJ2aWNlLXJvbGUvPHJvbGVOYW1lPidcbiAgICAvLyBvciAnYXJuOmF3czppYW06OjxhY2NvdW50Pjpyb2xlL3NlcnZpY2Utcm9sZS9zZXJ2aWNlbmFtZS5hbWF6b25hd3MuY29tL3NlcnZpY2Utcm9sZS88cm9sZU5hbWU+J1xuICAgIC8vIHdlIHdhbnQgdG8gc3VwcG9ydCB0aGVzZSBhcyB3ZWxsLCBzbyB3ZSBqdXN0IHVzZSB0aGUgZWxlbWVudCBhZnRlciB0aGUgbGFzdCBzbGFzaCBhcyByb2xlIG5hbWVcbiAgICBjb25zdCByb2xlTmFtZSA9IHJlc291cmNlTmFtZS5zcGxpdCgnLycpLnBvcCgpITtcblxuICAgIGlmIChnZXRDdXN0b21pemVSb2xlc0NvbmZpZyhzY29wZSkuZW5hYmxlZCkge1xuICAgICAgcmV0dXJuIG5ldyBQcmVjcmVhdGVkUm9sZShzY29wZSwgaWQsIHtcbiAgICAgICAgcm9sZVBhdGg6IGAke3Njb3BlLm5vZGUucGF0aH0vJHtpZH1gLFxuICAgICAgICByb2xlOiBuZXcgSW1wb3J0ZWRSb2xlKHNjb3BlLCBgSW1wb3J0JHtpZH1gLCB7XG4gICAgICAgICAgYWNjb3VudDogcm9sZUFjY291bnQsXG4gICAgICAgICAgcm9sZUFybixcbiAgICAgICAgICByb2xlTmFtZSxcbiAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmFkZEdyYW50c1RvUmVzb3VyY2VzICE9PSB1bmRlZmluZWQgJiYgb3B0aW9ucy5tdXRhYmxlICE9PSBmYWxzZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcXCdhZGRHcmFudHNUb1Jlc291cmNlc1xcJyBjYW4gb25seSBiZSBwYXNzZWQgaWYgXFwnbXV0YWJsZTogZmFsc2VcXCcnKTtcbiAgICB9XG5cbiAgICBjb25zdCByb2xlQXJuQW5kU2NvcGVTdGFja0FjY291bnRDb21wYXJpc29uID0gVG9rZW4uY29tcGFyZVN0cmluZ3Mocm9sZUFjY291bnQgPz8gJycsIHNjb3BlU3RhY2suYWNjb3VudCk7XG4gICAgY29uc3QgZXF1YWxPckFueVVucmVzb2x2ZWQgPSByb2xlQXJuQW5kU2NvcGVTdGFja0FjY291bnRDb21wYXJpc29uID09PSBUb2tlbkNvbXBhcmlzb24uU0FNRSB8fFxuICAgICAgcm9sZUFybkFuZFNjb3BlU3RhY2tBY2NvdW50Q29tcGFyaXNvbiA9PT0gVG9rZW5Db21wYXJpc29uLkJPVEhfVU5SRVNPTFZFRCB8fFxuICAgICAgcm9sZUFybkFuZFNjb3BlU3RhY2tBY2NvdW50Q29tcGFyaXNvbiA9PT0gVG9rZW5Db21wYXJpc29uLk9ORV9VTlJFU09MVkVEO1xuXG4gICAgLy8gaWYgd2UgYXJlIHJldHVybmluZyBhbiBpbW11dGFibGUgcm9sZSB0aGVuIHRoZSAnaW1wb3J0ZWRSb2xlJyBpcyBqdXN0IGEgdGhyb3dhd2F5IGNvbnN0cnVjdFxuICAgIC8vIHNvIGdpdmUgaXQgYSBkaWZmZXJlbnQgaWRcbiAgICBjb25zdCBtdXRhYmxlUm9sZUlkID0gKG9wdGlvbnMubXV0YWJsZSAhPT0gZmFsc2UgJiYgZXF1YWxPckFueVVucmVzb2x2ZWQpID8gaWQgOiBgTXV0YWJsZVJvbGUke2lkfWA7XG4gICAgY29uc3QgaW1wb3J0ZWRSb2xlID0gbmV3IEltcG9ydGVkUm9sZShzY29wZSwgbXV0YWJsZVJvbGVJZCwge1xuICAgICAgcm9sZUFybixcbiAgICAgIHJvbGVOYW1lLFxuICAgICAgYWNjb3VudDogcm9sZUFjY291bnQsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH0pO1xuXG5cbiAgICAvLyB3ZSBvbmx5IHJldHVybiBhbiBpbW11dGFibGUgUm9sZSBpZiBib3RoIGFjY291bnRzIHdlcmUgZXhwbGljaXRseSBwcm92aWRlZCwgYW5kIGRpZmZlcmVudFxuICAgIHJldHVybiBvcHRpb25zLm11dGFibGUgIT09IGZhbHNlICYmIGVxdWFsT3JBbnlVbnJlc29sdmVkXG4gICAgICA/IGltcG9ydGVkUm9sZVxuICAgICAgOiBuZXcgSW1tdXRhYmxlUm9sZShzY29wZSwgaWQsIGltcG9ydGVkUm9sZSwgb3B0aW9ucy5hZGRHcmFudHNUb1Jlc291cmNlcyA/PyBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICAqIFJldHVybiB3aGV0aGVyIHRoZSBnaXZlbiBvYmplY3QgaXMgYSBSb2xlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzUm9sZSh4OiBhbnkpIDogeCBpcyBSb2xlIHtcbiAgICByZXR1cm4geCAhPT0gbnVsbCAmJiB0eXBlb2YoeCkgPT09ICdvYmplY3QnICYmIElBTV9ST0xFX1NZTUJPTCBpbiB4O1xuICB9XG5cblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4dGVybmFsIHJvbGUgYnkgbmFtZS5cbiAgICpcbiAgICogVGhlIGltcG9ydGVkIHJvbGUgaXMgYXNzdW1lZCB0byBleGlzdCBpbiB0aGUgc2FtZSBhY2NvdW50IGFzIHRoZSBhY2NvdW50XG4gICAqIHRoZSBzY29wZSdzIGNvbnRhaW5pbmcgU3RhY2sgaXMgYmVpbmcgZGVwbG95ZWQgdG8uXG5cbiAgICogQHBhcmFtIHNjb3BlIGNvbnN0cnVjdCBzY29wZVxuICAgKiBAcGFyYW0gaWQgY29uc3RydWN0IGlkXG4gICAqIEBwYXJhbSByb2xlTmFtZSB0aGUgbmFtZSBvZiB0aGUgcm9sZSB0byBpbXBvcnRcbiAgICogQHBhcmFtIG9wdGlvbnMgYWxsb3cgY3VzdG9taXppbmcgdGhlIGJlaGF2aW9yIG9mIHRoZSByZXR1cm5lZCByb2xlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Sb2xlTmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCByb2xlTmFtZTogc3RyaW5nLCBvcHRpb25zOiBGcm9tUm9sZU5hbWVPcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gUm9sZS5mcm9tUm9sZUFybihzY29wZSwgaWQsIFN0YWNrLm9mKHNjb3BlKS5mb3JtYXRBcm4oe1xuICAgICAgcmVnaW9uOiAnJyxcbiAgICAgIHNlcnZpY2U6ICdpYW0nLFxuICAgICAgcmVzb3VyY2U6ICdyb2xlJyxcbiAgICAgIHJlc291cmNlTmFtZTogcm9sZU5hbWUsXG4gICAgfSksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1c3RvbWl6ZSB0aGUgY3JlYXRpb24gb2YgSUFNIHJvbGVzIHdpdGhpbiB0aGUgZ2l2ZW4gc2NvcGVcbiAgICpcbiAgICogSXQgaXMgcmVjb21tZW5kZWQgdGhhdCB5b3UgKipkbyBub3QqKiB1c2UgdGhpcyBtZXRob2QgYW5kIGluc3RlYWQgYWxsb3dcbiAgICogQ0RLIHRvIG1hbmFnZSByb2xlIGNyZWF0aW9uLiBUaGlzIHNob3VsZCBvbmx5IGJlIHVzZWRcbiAgICogaW4gZW52aXJvbm1lbnRzIHdoZXJlIENESyBhcHBsaWNhdGlvbnMgYXJlIG5vdCBhbGxvd2VkIHRvIGNyZWF0ZWQgSUFNIHJvbGVzLlxuICAgKlxuICAgKiBUaGlzIGNhbiBiZSB1c2VkIHRvIHByZXZlbnQgdGhlIENESyBhcHBsaWNhdGlvbiBmcm9tIGNyZWF0aW5nIHJvbGVzXG4gICAqIHdpdGhpbiB0aGUgZ2l2ZW4gc2NvcGUgYW5kIGluc3RlYWQgcmVwbGFjZSB0aGUgcmVmZXJlbmNlcyB0byB0aGUgcm9sZXMgd2l0aFxuICAgKiBwcmVjcmVhdGVkIHJvbGUgbmFtZXMuIEEgcmVwb3J0IHdpbGwgYmUgc3ludGhlc2l6ZWQgaW4gdGhlIGNsb3VkIGFzc2VtYmx5IChpLmUuIGNkay5vdXQpXG4gICAqIHRoYXQgd2lsbCBjb250YWluIHRoZSBsaXN0IG9mIElBTSByb2xlcyB0aGF0IHdvdWxkIGhhdmUgYmVlbiBjcmVhdGVkIGFsb25nIHdpdGggdGhlXG4gICAqIElBTSBwb2xpY3kgc3RhdGVtZW50cyB0aGF0IHRoZSByb2xlIHNob3VsZCBjb250YWluLiBUaGlzIHJlcG9ydCBjYW4gdGhlbiBiZSB1c2VkXG4gICAqIHRvIGNyZWF0ZSB0aGUgSUFNIHJvbGVzIG91dHNpZGUgb2YgQ0RLIGFuZCB0aGVuIHRoZSBjcmVhdGVkIHJvbGUgbmFtZXMgY2FuIGJlIHByb3ZpZGVkXG4gICAqIGluIGB1c2VQcmVjcmVhdGVkUm9sZXNgLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBkZWNsYXJlIGNvbnN0IGFwcDogQXBwO1xuICAgKiBSb2xlLmN1c3RvbWl6ZVJvbGVzKGFwcCwge1xuICAgKiAgIHVzZVByZWNyZWF0ZWRSb2xlczoge1xuICAgKiAgICAgJ0NvbnN0cnVjdFBhdGgvVG8vUm9sZSc6ICdteS1wcmVjcmVhdGVkLXJvbGUtbmFtZScsXG4gICAqICAgfSxcbiAgICogfSk7XG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBjb25zdHJ1Y3Qgc2NvcGUgdG8gY3VzdG9taXplIHJvbGUgY3JlYXRpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgb3B0aW9ucyBmb3IgY29uZmlndXJpbmcgcm9sZSBjcmVhdGlvblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjdXN0b21pemVSb2xlcyhzY29wZTogQ29uc3RydWN0LCBvcHRpb25zPzogQ3VzdG9taXplUm9sZXNPcHRpb25zKTogdm9pZCB7XG4gICAgY29uc3QgcHJldmVudFN5bnRoZXNpcyA9IG9wdGlvbnM/LnByZXZlbnRTeW50aGVzaXMgPz8gdHJ1ZTtcbiAgICBjb25zdCB1c2VSb2xlczogeyBbY29uc3RydWN0UGF0aDogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtjb25zdHJ1Y3RQYXRoLCByb2xlTmFtZV0gb2YgT2JqZWN0LmVudHJpZXMob3B0aW9ucz8udXNlUHJlY3JlYXRlZFJvbGVzID8/IHt9KSkge1xuICAgICAgY29uc3QgYWJzUGF0aCA9IGNvbnN0cnVjdFBhdGguc3RhcnRzV2l0aChzY29wZS5ub2RlLnBhdGgpXG4gICAgICAgID8gY29uc3RydWN0UGF0aFxuICAgICAgICA6IGAke3Njb3BlLm5vZGUucGF0aH0vJHtjb25zdHJ1Y3RQYXRofWA7XG4gICAgICB1c2VSb2xlc1thYnNQYXRoXSA9IHJvbGVOYW1lO1xuICAgIH1cbiAgICBzY29wZS5ub2RlLnNldENvbnRleHQoQ1VTVE9NSVpFX1JPTEVTX0NPTlRFWFRfS0VZLCB7XG4gICAgICBwcmV2ZW50U3ludGhlc2lzLFxuICAgICAgdXNlUHJlY3JlYXRlZFJvbGVzOiB1c2VSb2xlcyxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBncmFudFByaW5jaXBhbDogSVByaW5jaXBhbCA9IHRoaXM7XG4gIHB1YmxpYyByZWFkb25seSBwcmluY2lwYWxBY2NvdW50OiBzdHJpbmcgfCB1bmRlZmluZWQgPSB0aGlzLmVudi5hY2NvdW50O1xuXG4gIHB1YmxpYyByZWFkb25seSBhc3N1bWVSb2xlQWN0aW9uOiBzdHJpbmcgPSAnc3RzOkFzc3VtZVJvbGUnO1xuXG4gIC8qKlxuICAgKiBUaGUgYXNzdW1lIHJvbGUgcG9saWN5IGRvY3VtZW50IGFzc29jaWF0ZWQgd2l0aCB0aGlzIHJvbGUuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYXNzdW1lUm9sZVBvbGljeT86IFBvbGljeURvY3VtZW50O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBBUk4gb2YgdGhpcyByb2xlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJvbGVBcm46IHN0cmluZztcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbmFtZSBvZiB0aGUgcm9sZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSByb2xlTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSByb2xlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHBvbGljeUZyYWdtZW50OiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudDtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcGVybWlzc2lvbnMgYm91bmRhcnkgYXR0YWNoZWQgdG8gdGhpcyByb2xlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcGVybWlzc2lvbnNCb3VuZGFyeT86IElNYW5hZ2VkUG9saWN5O1xuXG4gIHByaXZhdGUgZGVmYXVsdFBvbGljeT86IFBvbGljeTtcbiAgcHJpdmF0ZSByZWFkb25seSBtYW5hZ2VkUG9saWNpZXM6IElNYW5hZ2VkUG9saWN5W10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBhdHRhY2hlZFBvbGljaWVzID0gbmV3IEF0dGFjaGVkUG9saWNpZXMoKTtcbiAgcHJpdmF0ZSByZWFkb25seSBpbmxpbmVQb2xpY2llczogeyBbbmFtZTogc3RyaW5nXTogUG9saWN5RG9jdW1lbnQgfTtcbiAgcHJpdmF0ZSByZWFkb25seSBkZXBlbmRhYmxlcyA9IG5ldyBNYXA8UG9saWN5U3RhdGVtZW50LCBEZXBlbmRlbmN5R3JvdXA+KCk7XG4gIHByaXZhdGUgaW1tdXRhYmxlUm9sZT86IElSb2xlO1xuICBwcml2YXRlIF9kaWRTcGxpdCA9IGZhbHNlO1xuICBwcml2YXRlIHJlYWRvbmx5IF9yb2xlSWQ/OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfcHJlY3JlYXRlZFJvbGU/OiBJUm9sZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUm9sZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLnJvbGVOYW1lLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZXh0ZXJuYWxJZHMgPSBwcm9wcy5leHRlcm5hbElkcyB8fCBbXTtcbiAgICBpZiAocHJvcHMuZXh0ZXJuYWxJZCkge1xuICAgICAgZXh0ZXJuYWxJZHMucHVzaChwcm9wcy5leHRlcm5hbElkKTtcbiAgICB9XG5cbiAgICB0aGlzLmFzc3VtZVJvbGVQb2xpY3kgPSBjcmVhdGVBc3N1bWVSb2xlUG9saWN5KHByb3BzLmFzc3VtZWRCeSwgZXh0ZXJuYWxJZHMpO1xuICAgIHRoaXMubWFuYWdlZFBvbGljaWVzLnB1c2goLi4ucHJvcHMubWFuYWdlZFBvbGljaWVzIHx8IFtdKTtcbiAgICB0aGlzLmlubGluZVBvbGljaWVzID0gcHJvcHMuaW5saW5lUG9saWNpZXMgfHwge307XG4gICAgdGhpcy5wZXJtaXNzaW9uc0JvdW5kYXJ5ID0gcHJvcHMucGVybWlzc2lvbnNCb3VuZGFyeTtcbiAgICBjb25zdCBtYXhTZXNzaW9uRHVyYXRpb24gPSBwcm9wcy5tYXhTZXNzaW9uRHVyYXRpb24gJiYgcHJvcHMubWF4U2Vzc2lvbkR1cmF0aW9uLnRvU2Vjb25kcygpO1xuICAgIHZhbGlkYXRlTWF4U2Vzc2lvbkR1cmF0aW9uKG1heFNlc3Npb25EdXJhdGlvbik7XG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSAocHJvcHMuZGVzY3JpcHRpb24gJiYgcHJvcHMuZGVzY3JpcHRpb24/Lmxlbmd0aCA+IDApID8gcHJvcHMuZGVzY3JpcHRpb24gOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoZGVzY3JpcHRpb24gJiYgZGVzY3JpcHRpb24ubGVuZ3RoID4gMTAwMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSb2xlIGRlc2NyaXB0aW9uIG11c3QgYmUgbm8gbG9uZ2VyIHRoYW4gMTAwMCBjaGFyYWN0ZXJzLicpO1xuICAgIH1cblxuICAgIHZhbGlkYXRlUm9sZVBhdGgocHJvcHMucGF0aCk7XG5cbiAgICBjb25zdCBjb25maWcgPSB0aGlzLmdldFByZWNyZWF0ZWRSb2xlQ29uZmlnKCk7XG4gICAgY29uc3Qgcm9sZUFybiA9IFN0YWNrLm9mKHNjb3BlKS5mb3JtYXRBcm4oe1xuICAgICAgcmVnaW9uOiAnJyxcbiAgICAgIHNlcnZpY2U6ICdpYW0nLFxuICAgICAgcmVzb3VyY2U6ICdyb2xlJyxcbiAgICAgIHJlc291cmNlTmFtZTogY29uZmlnLnByZWNyZWF0ZWRSb2xlTmFtZSxcbiAgICB9KTtcbiAgICBjb25zdCBpbXBvcnRlZFJvbGUgPSBuZXcgSW1wb3J0ZWRSb2xlKHRoaXMsICdJbXBvcnQnK2lkLCB7XG4gICAgICByb2xlQXJuLFxuICAgICAgcm9sZU5hbWU6IGNvbmZpZy5wcmVjcmVhdGVkUm9sZU5hbWUgPz8gaWQsXG4gICAgICBhY2NvdW50OiBTdGFjay5vZih0aGlzKS5hY2NvdW50LFxuICAgIH0pO1xuICAgIHRoaXMucm9sZU5hbWUgPSBpbXBvcnRlZFJvbGUucm9sZU5hbWU7XG4gICAgdGhpcy5yb2xlQXJuID0gaW1wb3J0ZWRSb2xlLnJvbGVBcm47XG4gICAgaWYgKGNvbmZpZy5lbmFibGVkKSB7XG4gICAgICBjb25zdCByb2xlID0gbmV3IFByZWNyZWF0ZWRSb2xlKHRoaXMsICdQcmVjcmVhdGVkUm9sZScraWQsIHtcbiAgICAgICAgcm9sZVBhdGg6IHRoaXMubm9kZS5wYXRoLFxuICAgICAgICByb2xlOiBpbXBvcnRlZFJvbGUsXG4gICAgICAgIG1pc3Npbmc6ICFjb25maWcucHJlY3JlYXRlZFJvbGVOYW1lLFxuICAgICAgICBhc3N1bWVSb2xlUG9saWN5OiB0aGlzLmFzc3VtZVJvbGVQb2xpY3ksXG4gICAgICB9KTtcbiAgICAgIHRoaXMubWFuYWdlZFBvbGljaWVzLmZvckVhY2gocG9saWN5ID0+IHJvbGUuYWRkTWFuYWdlZFBvbGljeShwb2xpY3kpKTtcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuaW5saW5lUG9saWNpZXMpLmZvckVhY2goKFtuYW1lLCBwb2xpY3ldKSA9PiB7XG4gICAgICAgIHJvbGUuYXR0YWNoSW5saW5lUG9saWN5KG5ldyBQb2xpY3kodGhpcywgbmFtZSwgeyBkb2N1bWVudDogcG9saWN5IH0pKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9wcmVjcmVhdGVkUm9sZSA9IHJvbGU7XG4gICAgfVxuXG4gICAgLy8gc3ludGhlc2l6ZSB0aGUgcmVzb3VyY2UgaWYgcHJldmVudFN5bnRoZXNpcz1mYWxzZVxuICAgIGlmICghY29uZmlnLnByZXZlbnRTeW50aGVzaXMpIHtcbiAgICAgIGNvbnN0IHJvbGUgPSBuZXcgQ2ZuUm9sZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICAgIGFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDogdGhpcy5hc3N1bWVSb2xlUG9saWN5IGFzIGFueSxcbiAgICAgICAgbWFuYWdlZFBvbGljeUFybnM6IFVuaXF1ZVN0cmluZ1NldC5mcm9tKCgpID0+IHRoaXMubWFuYWdlZFBvbGljaWVzLm1hcChwID0+IHAubWFuYWdlZFBvbGljeUFybikpLFxuICAgICAgICBwb2xpY2llczogX2ZsYXR0ZW4odGhpcy5pbmxpbmVQb2xpY2llcyksXG4gICAgICAgIHBhdGg6IHByb3BzLnBhdGgsXG4gICAgICAgIHBlcm1pc3Npb25zQm91bmRhcnk6IHRoaXMucGVybWlzc2lvbnNCb3VuZGFyeSA/IHRoaXMucGVybWlzc2lvbnNCb3VuZGFyeS5tYW5hZ2VkUG9saWN5QXJuIDogdW5kZWZpbmVkLFxuICAgICAgICByb2xlTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICAgIG1heFNlc3Npb25EdXJhdGlvbixcbiAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fcm9sZUlkID0gcm9sZS5hdHRyUm9sZUlkO1xuICAgICAgdGhpcy5yb2xlQXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZShyb2xlLmF0dHJBcm4sIHtcbiAgICAgICAgcmVnaW9uOiAnJywgLy8gSUFNIGlzIGdsb2JhbCBpbiBlYWNoIHBhcnRpdGlvblxuICAgICAgICBzZXJ2aWNlOiAnaWFtJyxcbiAgICAgICAgcmVzb3VyY2U6ICdyb2xlJyxcbiAgICAgICAgLy8gUmVtb3ZlcyBsZWFkaW5nIHNsYXNoIGZyb20gcGF0aFxuICAgICAgICByZXNvdXJjZU5hbWU6IGAke3Byb3BzLnBhdGggPyBwcm9wcy5wYXRoLnN1YnN0cihwcm9wcy5wYXRoLmNoYXJBdCgwKSA9PT0gJy8nID8gMSA6IDApIDogJyd9JHt0aGlzLnBoeXNpY2FsTmFtZX1gLFxuICAgICAgfSk7XG4gICAgICB0aGlzLnJvbGVOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocm9sZS5yZWYpO1xuICAgICAgQXNwZWN0cy5vZih0aGlzKS5hZGQoe1xuICAgICAgICB2aXNpdDogKGMpID0+IHtcbiAgICAgICAgICBpZiAoYyA9PT0gdGhpcykge1xuICAgICAgICAgICAgdGhpcy5zcGxpdExhcmdlUG9saWN5KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5wb2xpY3lGcmFnbWVudCA9IG5ldyBBcm5QcmluY2lwYWwodGhpcy5yb2xlQXJuKS5wb2xpY3lGcmFnbWVudDtcblxuICAgIGZ1bmN0aW9uIF9mbGF0dGVuKHBvbGljaWVzPzogeyBbbmFtZTogc3RyaW5nXTogUG9saWN5RG9jdW1lbnQgfSkge1xuICAgICAgaWYgKHBvbGljaWVzID09IG51bGwgfHwgT2JqZWN0LmtleXMocG9saWNpZXMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PENmblJvbGUuUG9saWN5UHJvcGVydHk+KCk7XG4gICAgICBmb3IgKGNvbnN0IHBvbGljeU5hbWUgb2YgT2JqZWN0LmtleXMocG9saWNpZXMpKSB7XG4gICAgICAgIGNvbnN0IHBvbGljeURvY3VtZW50ID0gcG9saWNpZXNbcG9saWN5TmFtZV07XG4gICAgICAgIHJlc3VsdC5wdXNoKHsgcG9saWN5TmFtZSwgcG9saWN5RG9jdW1lbnQgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHRoaXMudmFsaWRhdGVSb2xlKCkgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHBlcm1pc3Npb24gdG8gdGhlIHJvbGUncyBkZWZhdWx0IHBvbGljeSBkb2N1bWVudC5cbiAgICogSWYgdGhlcmUgaXMgbm8gZGVmYXVsdCBwb2xpY3kgYXR0YWNoZWQgdG8gdGhpcyByb2xlLCBpdCB3aWxsIGJlIGNyZWF0ZWQuXG4gICAqIEBwYXJhbSBzdGF0ZW1lbnQgVGhlIHBlcm1pc3Npb24gc3RhdGVtZW50IHRvIGFkZCB0byB0aGUgcG9saWN5IGRvY3VtZW50XG4gICAqL1xuICBwdWJsaWMgYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdCB7XG4gICAgaWYgKHRoaXMuX3ByZWNyZWF0ZWRSb2xlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcHJlY3JlYXRlZFJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCF0aGlzLmRlZmF1bHRQb2xpY3kpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0UG9saWN5ID0gbmV3IFBvbGljeSh0aGlzLCAnRGVmYXVsdFBvbGljeScpO1xuICAgICAgICB0aGlzLmF0dGFjaElubGluZVBvbGljeSh0aGlzLmRlZmF1bHRQb2xpY3kpO1xuICAgICAgfVxuICAgICAgdGhpcy5kZWZhdWx0UG9saWN5LmFkZFN0YXRlbWVudHMoc3RhdGVtZW50KTtcblxuICAgICAgLy8gV2UgbWlnaHQgc3BsaXQgdGhpcyBzdGF0ZW1lbnQgb2ZmIGludG8gYSBkaWZmZXJlbnQgcG9saWN5LCBzbyB3ZSdsbCBuZWVkIHRvXG4gICAgICAvLyBsYXRlLWJpbmQgdGhlIGRlcGVuZGFibGUuXG4gICAgICBjb25zdCBwb2xpY3lEZXBlbmRhYmxlID0gbmV3IERlcGVuZGVuY3lHcm91cCgpO1xuICAgICAgdGhpcy5kZXBlbmRhYmxlcy5zZXQoc3RhdGVtZW50LCBwb2xpY3lEZXBlbmRhYmxlKTtcblxuICAgICAgcmV0dXJuIHsgc3RhdGVtZW50QWRkZWQ6IHRydWUsIHBvbGljeURlcGVuZGFibGUgfTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWRkVG9Qb2xpY3koc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5fcHJlY3JlYXRlZFJvbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wcmVjcmVhdGVkUm9sZS5hZGRUb1BvbGljeShzdGF0ZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5hZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQpLnN0YXRlbWVudEFkZGVkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhIG1hbmFnZWQgcG9saWN5IHRvIHRoaXMgcm9sZS5cbiAgICogQHBhcmFtIHBvbGljeSBUaGUgdGhlIG1hbmFnZWQgcG9saWN5IHRvIGF0dGFjaC5cbiAgICovXG4gIHB1YmxpYyBhZGRNYW5hZ2VkUG9saWN5KHBvbGljeTogSU1hbmFnZWRQb2xpY3kpIHtcbiAgICBpZiAodGhpcy5fcHJlY3JlYXRlZFJvbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wcmVjcmVhdGVkUm9sZS5hZGRNYW5hZ2VkUG9saWN5KHBvbGljeSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm1hbmFnZWRQb2xpY2llcy5maW5kKG1wID0+IG1wID09PSBwb2xpY3kpKSB7IHJldHVybjsgfVxuICAgICAgdGhpcy5tYW5hZ2VkUG9saWNpZXMucHVzaChwb2xpY3kpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhIHBvbGljeSB0byB0aGlzIHJvbGUuXG4gICAqIEBwYXJhbSBwb2xpY3kgVGhlIHBvbGljeSB0byBhdHRhY2hcbiAgICovXG4gIHB1YmxpYyBhdHRhY2hJbmxpbmVQb2xpY3kocG9saWN5OiBQb2xpY3kpIHtcbiAgICBpZiAodGhpcy5fcHJlY3JlYXRlZFJvbGUpIHtcbiAgICAgIHRoaXMuX3ByZWNyZWF0ZWRSb2xlLmF0dGFjaElubGluZVBvbGljeShwb2xpY3kpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmF0dGFjaGVkUG9saWNpZXMuYXR0YWNoKHBvbGljeSk7XG4gICAgICBwb2xpY3kuYXR0YWNoVG9Sb2xlKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCB0aGUgYWN0aW9ucyBkZWZpbmVkIGluIGFjdGlvbnMgdG8gdGhlIGlkZW50aXR5IFByaW5jaXBhbCBvbiB0aGlzIHJlc291cmNlLlxuICAgKi9cbiAgcHVibGljIGdyYW50KGdyYW50ZWU6IElQcmluY2lwYWwsIC4uLmFjdGlvbnM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIEdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIGdyYW50ZWUsXG4gICAgICBhY3Rpb25zLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbdGhpcy5yb2xlQXJuXSxcbiAgICAgIHNjb3BlOiB0aGlzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHBlcm1pc3Npb25zIHRvIHRoZSBnaXZlbiBwcmluY2lwYWwgdG8gcGFzcyB0aGlzIHJvbGUuXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRQYXNzUm9sZShpZGVudGl0eTogSVByaW5jaXBhbCkge1xuICAgIHJldHVybiB0aGlzLmdyYW50KGlkZW50aXR5LCAnaWFtOlBhc3NSb2xlJyk7XG4gIH1cblxuICAvKipcbiAgICogR3JhbnQgcGVybWlzc2lvbnMgdG8gdGhlIGdpdmVuIHByaW5jaXBhbCB0byBhc3N1bWUgdGhpcyByb2xlLlxuICAgKi9cbiAgcHVibGljIGdyYW50QXNzdW1lUm9sZShpZGVudGl0eTogSVByaW5jaXBhbCkge1xuICAgIHJldHVybiB0aGlzLmdyYW50KGlkZW50aXR5LCAnc3RzOkFzc3VtZVJvbGUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzdGFibGUgYW5kIHVuaXF1ZSBzdHJpbmcgaWRlbnRpZnlpbmcgdGhlIHJvbGUuIEZvciBleGFtcGxlLFxuICAgKiBBSURBSlFBQkxaUzRBM1FEVTU3NlEuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyBnZXQgcm9sZUlkKCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLl9yb2xlSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJyb2xlSWRcIiBpcyBub3QgYXZhaWxhYmxlIG9uIHByZWNyZWF0ZWQgcm9sZXMnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3JvbGVJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBjb3B5IG9mIHRoaXMgUm9sZSBvYmplY3Qgd2hvc2UgUG9saWNpZXMgd2lsbCBub3QgYmUgdXBkYXRlZFxuICAgKlxuICAgKiBVc2UgdGhlIG9iamVjdCByZXR1cm5lZCBieSB0aGlzIG1ldGhvZCBpZiB5b3Ugd2FudCB0aGlzIFJvbGUgdG8gYmUgdXNlZCBieVxuICAgKiBhIGNvbnN0cnVjdCB3aXRob3V0IGl0IGF1dG9tYXRpY2FsbHkgdXBkYXRpbmcgdGhlIFJvbGUncyBQb2xpY2llcy5cbiAgICpcbiAgICogSWYgeW91IGRvLCB5b3UgYXJlIHJlc3BvbnNpYmxlIGZvciBhZGRpbmcgdGhlIGNvcnJlY3Qgc3RhdGVtZW50cyB0byB0aGVcbiAgICogUm9sZSdzIHBvbGljaWVzIHlvdXJzZWxmLlxuICAgKi9cbiAgcHVibGljIHdpdGhvdXRQb2xpY3lVcGRhdGVzKG9wdGlvbnM6IFdpdGhvdXRQb2xpY3lVcGRhdGVzT3B0aW9ucyA9IHt9KTogSVJvbGUge1xuICAgIGlmICghdGhpcy5pbW11dGFibGVSb2xlKSB7XG4gICAgICB0aGlzLmltbXV0YWJsZVJvbGUgPSBuZXcgSW1tdXRhYmxlUm9sZShOb2RlLm9mKHRoaXMpLnNjb3BlIGFzIENvbnN0cnVjdCwgYEltbXV0YWJsZVJvbGUke3RoaXMubm9kZS5pZH1gLCB0aGlzLCBvcHRpb25zLmFkZEdyYW50c1RvUmVzb3VyY2VzID8/IGZhbHNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbW11dGFibGVSb2xlO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZVJvbGUoKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgZXJyb3JzLnB1c2goLi4udGhpcy5hc3N1bWVSb2xlUG9saWN5Py52YWxpZGF0ZUZvclJlc291cmNlUG9saWN5KCkgPz8gW10pO1xuICAgIGZvciAoY29uc3QgcG9saWN5IG9mIE9iamVjdC52YWx1ZXModGhpcy5pbmxpbmVQb2xpY2llcykpIHtcbiAgICAgIGVycm9ycy5wdXNoKC4uLnBvbGljeS52YWxpZGF0ZUZvcklkZW50aXR5UG9saWN5KCkpO1xuICAgIH1cblxuICAgIHJldHVybiBlcnJvcnM7XG4gIH1cblxuICAvKipcbiAgICogU3BsaXQgbGFyZ2UgaW5saW5lIHBvbGljaWVzIGludG8gbWFuYWdlZCBwb2xpY2llc1xuICAgKlxuICAgKiBUaGlzIGdldHMgYXJvdW5kIHRoZSAxMGsgYnl0ZXMgbGltaXQgb24gcm9sZSBwb2xpY2llcy5cbiAgICovXG4gIHByaXZhdGUgc3BsaXRMYXJnZVBvbGljeSgpIHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdFBvbGljeSB8fCB0aGlzLl9kaWRTcGxpdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9kaWRTcGxpdCA9IHRydWU7XG5cbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBvcmlnaW5hbERvYyA9IHRoaXMuZGVmYXVsdFBvbGljeS5kb2N1bWVudDtcblxuICAgIGNvbnN0IHNwbGl0T2ZmRG9jcyA9IG9yaWdpbmFsRG9jLl9zcGxpdERvY3VtZW50KHRoaXMsIE1BWF9JTkxJTkVfU0laRSwgTUFYX01BTkFHRURQT0xfU0laRSk7XG4gICAgLy8gSW5jbHVkZXMgdGhlIFwiY3VycmVudFwiIGRvY3VtZW50XG5cbiAgICBjb25zdCBtcENvdW50ID0gdGhpcy5tYW5hZ2VkUG9saWNpZXMubGVuZ3RoICsgKHNwbGl0T2ZmRG9jcy5zaXplIC0gMSk7XG4gICAgaWYgKG1wQ291bnQgPiAyMCkge1xuICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZyhgUG9saWN5IHRvbyBsYXJnZTogJHttcENvdW50fSBleGNlZWRzIHRoZSBtYXhpbXVtIG9mIDIwIG1hbmFnZWQgcG9saWNpZXMgYXR0YWNoZWQgdG8gYSBSb2xlYCk7XG4gICAgfSBlbHNlIGlmIChtcENvdW50ID4gMTApIHtcbiAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZFdhcm5pbmcoYFBvbGljeSBsYXJnZTogJHttcENvdW50fSBleGNlZWRzIDEwIG1hbmFnZWQgcG9saWNpZXMgYXR0YWNoZWQgdG8gYSBSb2xlLCB0aGlzIHJlcXVpcmVzIGEgcXVvdGEgaW5jcmVhc2VgKTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgdGhlIG1hbmFnZWQgcG9saWNpZXMgYW5kIGZpeCB1cCB0aGUgZGVwZW5kZW5jaWVzXG4gICAgbWFya0RlY2xhcmluZ0NvbnN0cnVjdChvcmlnaW5hbERvYywgdGhpcy5kZWZhdWx0UG9saWN5KTtcblxuICAgIGxldCBpID0gMTtcbiAgICBmb3IgKGNvbnN0IG5ld0RvYyBvZiBzcGxpdE9mZkRvY3Mua2V5cygpKSB7XG4gICAgICBpZiAobmV3RG9jID09PSBvcmlnaW5hbERvYykgeyBjb250aW51ZTsgfVxuXG4gICAgICBjb25zdCBtcCA9IG5ldyBNYW5hZ2VkUG9saWN5KHRoaXMsIGBPdmVyZmxvd1BvbGljeSR7aSsrfWAsIHtcbiAgICAgICAgZGVzY3JpcHRpb246IGBQYXJ0IG9mIHRoZSBwb2xpY2llcyBmb3IgJHt0aGlzLm5vZGUucGF0aH1gLFxuICAgICAgICBkb2N1bWVudDogbmV3RG9jLFxuICAgICAgICByb2xlczogW3RoaXNdLFxuICAgICAgfSk7XG4gICAgICBtYXJrRGVjbGFyaW5nQ29uc3RydWN0KG5ld0RvYywgbXApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0aGUgRGVwZW5kYWJsZXMgZm9yIHRoZSBzdGF0ZW1lbnRzIGluIHRoZSBnaXZlbiBQb2xpY3lEb2N1bWVudCB0byBwb2ludCB0byB0aGUgYWN0dWFsIGRlY2xhcmluZyBjb25zdHJ1Y3RcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtYXJrRGVjbGFyaW5nQ29uc3RydWN0KGRvYzogUG9saWN5RG9jdW1lbnQsIGRlY2xhcmluZ0NvbnN0cnVjdDogSUNvbnN0cnVjdCkge1xuICAgICAgZm9yIChjb25zdCBvcmlnaW5hbCBvZiBzcGxpdE9mZkRvY3MuZ2V0KGRvYykgPz8gW10pIHtcbiAgICAgICAgc2VsZi5kZXBlbmRhYmxlcy5nZXQob3JpZ2luYWwpPy5hZGQoZGVjbGFyaW5nQ29uc3RydWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGNvbmZpZ3VyYXRpb24gZm9yIHByZWNyZWF0ZWQgcm9sZXNcbiAgICovXG4gIHByaXZhdGUgZ2V0UHJlY3JlYXRlZFJvbGVDb25maWcoKTogQ3VzdG9taXplUm9sZUNvbmZpZyB7XG4gICAgcmV0dXJuIGdldFByZWNyZWF0ZWRSb2xlQ29uZmlnKHRoaXMpO1xuICB9XG5cbn1cblxuLyoqXG4gKiBBIFJvbGUgb2JqZWN0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVJvbGUgZXh0ZW5kcyBJSWRlbnRpdHkge1xuICAvKipcbiAgICogUmV0dXJucyB0aGUgQVJOIG9mIHRoaXMgcm9sZS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZUFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBuYW1lIG9mIHRoaXMgcm9sZS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogR3JhbnQgdGhlIGFjdGlvbnMgZGVmaW5lZCBpbiBhY3Rpb25zIHRvIHRoZSBpZGVudGl0eSBQcmluY2lwYWwgb24gdGhpcyByZXNvdXJjZS5cbiAgICovXG4gIGdyYW50KGdyYW50ZWU6IElQcmluY2lwYWwsIC4uLmFjdGlvbnM6IHN0cmluZ1tdKTogR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdyYW50IHBlcm1pc3Npb25zIHRvIHRoZSBnaXZlbiBwcmluY2lwYWwgdG8gcGFzcyB0aGlzIHJvbGUuXG4gICAqL1xuICBncmFudFBhc3NSb2xlKGdyYW50ZWU6IElQcmluY2lwYWwpOiBHcmFudDtcblxuICAvKipcbiAgICogR3JhbnQgcGVybWlzc2lvbnMgdG8gdGhlIGdpdmVuIHByaW5jaXBhbCB0byBhc3N1bWUgdGhpcyByb2xlLlxuICAgKi9cbiAgZ3JhbnRBc3N1bWVSb2xlKGdyYW50ZWU6IElQcmluY2lwYWwpOiBHcmFudDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQXNzdW1lUm9sZVBvbGljeShwcmluY2lwYWw6IElQcmluY2lwYWwsIGV4dGVybmFsSWRzOiBzdHJpbmdbXSkge1xuICBjb25zdCBhY3R1YWxEb2MgPSBuZXcgUG9saWN5RG9jdW1lbnQoKTtcblxuICAvLyBJZiByZXF1ZXN0ZWQsIGFkZCBleHRlcm5hbElkcyB0byBldmVyeSBzdGF0ZW1lbnQgYWRkZWQgdG8gdGhpcyBkb2NcbiAgY29uc3QgYWRkRG9jID0gZXh0ZXJuYWxJZHMubGVuZ3RoID09PSAwXG4gICAgPyBhY3R1YWxEb2NcbiAgICA6IG5ldyBNdXRhdGluZ1BvbGljeURvY3VtZW50QWRhcHRlcihhY3R1YWxEb2MsIChzdGF0ZW1lbnQpID0+IHtcbiAgICAgIHN0YXRlbWVudC5hZGRDb25kaXRpb24oJ1N0cmluZ0VxdWFscycsIHtcbiAgICAgICAgJ3N0czpFeHRlcm5hbElkJzogZXh0ZXJuYWxJZHMubGVuZ3RoID09PSAxID8gZXh0ZXJuYWxJZHNbMF0gOiBleHRlcm5hbElkcyxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHN0YXRlbWVudDtcbiAgICB9KTtcblxuICBkZWZhdWx0QWRkUHJpbmNpcGFsVG9Bc3N1bWVSb2xlKHByaW5jaXBhbCwgYWRkRG9jKTtcblxuICByZXR1cm4gYWN0dWFsRG9jO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZVJvbGVQYXRoKHBhdGg/OiBzdHJpbmcpIHtcbiAgaWYgKHBhdGggPT09IHVuZGVmaW5lZCB8fCBUb2tlbi5pc1VucmVzb2x2ZWQocGF0aCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB2YWxpZFJvbGVQYXRoID0gL14oXFwvfFxcL1tcXHUwMDIxLVxcdTAwN0ZdK1xcLykkLztcblxuICBpZiAocGF0aC5sZW5ndGggPT0gMCB8fCBwYXRoLmxlbmd0aCA+IDUxMikge1xuICAgIHRocm93IG5ldyBFcnJvcihgUm9sZSBwYXRoIG11c3QgYmUgYmV0d2VlbiAxIGFuZCA1MTIgY2hhcmFjdGVycy4gVGhlIHByb3ZpZGVkIHJvbGUgcGF0aCBpcyAke3BhdGgubGVuZ3RofSBjaGFyYWN0ZXJzLmApO1xuICB9IGVsc2UgaWYgKCF2YWxpZFJvbGVQYXRoLnRlc3QocGF0aCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnUm9sZSBwYXRoIG11c3QgYmUgZWl0aGVyIGEgc2xhc2ggb3IgdmFsaWQgY2hhcmFjdGVycyAoYWxwaGFudW1lcmljcyBhbmQgc3ltYm9scykgc3Vycm91bmRlZCBieSBzbGFzaGVzLiAnXG4gICAgICArIGBWYWxpZCBjaGFyYWN0ZXJzIGFyZSB1bmljb2RlIGNoYXJhY3RlcnMgaW4gW1xcXFx1MDAyMS1cXFxcdTAwN0ZdLiBIb3dldmVyLCAke3BhdGh9IGlzIHByb3ZpZGVkLmApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTWF4U2Vzc2lvbkR1cmF0aW9uKGR1cmF0aW9uPzogbnVtYmVyKSB7XG4gIGlmIChkdXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGR1cmF0aW9uIDwgMzYwMCB8fCBkdXJhdGlvbiA+IDQzMjAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBtYXhTZXNzaW9uRHVyYXRpb24gaXMgc2V0IHRvICR7ZHVyYXRpb259LCBidXQgbXVzdCBiZSA+PSAzNjAwc2VjICgxaHIpIGFuZCA8PSA0MzIwMHNlYyAoMTJocnMpYCk7XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciB0aGUgYHdpdGhvdXRQb2xpY3lVcGRhdGVzKClgIG1vZGlmaWVyIG9mIGEgUm9sZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFdpdGhvdXRQb2xpY3lVcGRhdGVzT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBBZGQgZ3JhbnRzIHRvIHJlc291cmNlcyBpbnN0ZWFkIG9mIGRyb3BwaW5nIHRoZW1cbiAgICpcbiAgICogSWYgdGhpcyBpcyBgZmFsc2VgIG9yIG5vdCBzcGVjaWZpZWQsIGdyYW50IHBlcm1pc3Npb25zIGFkZGVkIHRvIHRoaXMgcm9sZSBhcmUgaWdub3JlZC5cbiAgICogSXQgaXMgeW91ciBvd24gcmVzcG9uc2liaWxpdHkgdG8gbWFrZSBzdXJlIHRoZSByb2xlIGhhcyB0aGUgcmVxdWlyZWQgcGVybWlzc2lvbnMuXG4gICAqXG4gICAqIElmIHRoaXMgaXMgYHRydWVgLCBhbnkgZ3JhbnQgcGVybWlzc2lvbnMgd2lsbCBiZSBhZGRlZCB0byB0aGUgcmVzb3VyY2UgaW5zdGVhZC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGFkZEdyYW50c1RvUmVzb3VyY2VzPzogYm9vbGVhbjtcbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFJvbGUucHJvdG90eXBlLCBJQU1fUk9MRV9TWU1CT0wsIHtcbiAgdmFsdWU6IHRydWUsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG59KTsiXX0=