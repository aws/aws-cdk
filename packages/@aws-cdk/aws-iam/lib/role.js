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
        if (helpers_internal_1.getCustomizeRolesConfig(scope).enabled) {
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
        return helpers_internal_1.getPrecreatedRoleConfig(this);
    }
}
exports.Role = Role;
_a = JSII_RTTI_SYMBOL_1;
Role[_a] = { fqn: "@aws-cdk/aws-iam.Role", version: "0.0.0" };
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
    assume_role_policy_1.defaultAddPrincipalToAssumeRole(principal, addDoc);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQW1IO0FBQ25ILHlFQUF3SjtBQUN4SiwyQ0FBMEU7QUFDMUUsbUNBQWdDO0FBQ2hDLG1EQUEwQztBQUUxQyxxREFBaUU7QUFDakUscUNBQWtDO0FBQ2xDLHVEQUFtRDtBQUVuRCw2Q0FBNkc7QUFDN0cscUVBQStFO0FBQy9FLDZEQUF5RDtBQUN6RCwyREFBdUQ7QUFDdkQsbUVBQTRFO0FBQzVFLCtEQUEyRDtBQUMzRCx5Q0FBbUU7QUFFbkUsTUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDO0FBQzlCLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLE1BQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMseUNBQXlDLENBQUMsQ0FBQztBQWdOOUU7Ozs7O0dBS0c7QUFDSCxNQUFhLElBQUssU0FBUSxlQUFRO0lBZ0xoQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWdCO1FBQ3hELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxRQUFRO1NBQzdCLENBQUMsQ0FBQztRQTVDVyxtQkFBYyxHQUFlLElBQUksQ0FBQztRQUNsQyxxQkFBZ0IsR0FBdUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFFeEQscUJBQWdCLEdBQVcsZ0JBQWdCLENBQUM7UUE0QjNDLG9CQUFlLEdBQXFCLEVBQUUsQ0FBQztRQUN2QyxxQkFBZ0IsR0FBRyxJQUFJLHVCQUFnQixFQUFFLENBQUM7UUFFMUMsZ0JBQVcsR0FBRyxJQUFJLEdBQUcsRUFBb0MsQ0FBQztRQUVuRSxjQUFTLEdBQUcsS0FBSyxDQUFDOzs7Ozs7K0NBM0tmLElBQUk7Ozs7UUFxTGIsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7UUFDNUMsSUFBSSxLQUFL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LENBQUM7S0FDekg7U0FBTSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNwQyxNQUFNLElBQUksS0FBSyxDQUNiLDBHQUEwRztjQUN4RywwRUFBMEUsSUFBSSxlQUFlLENBQUMsQ0FBQztLQUNwRztBQUNILENBQUM7QUFFRCxTQUFTLDBCQUEwQixDQUFDLFFBQWlCO0lBQ25ELElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtRQUMxQixPQUFPO0tBQ1I7SUFFRCxJQUFJLFFBQVEsR0FBRyxJQUFJLElBQUksUUFBUSxHQUFHLEtBQUssRUFBRTtRQUN2QyxNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxRQUFRLHdEQUF3RCxDQUFDLENBQUM7S0FDbkg7QUFDSCxDQUFDO0FBbUJELE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUU7SUFDckQsS0FBSyxFQUFFLElBQUk7SUFDWCxVQUFVLEVBQUUsS0FBSztJQUNqQixRQUFRLEVBQUUsS0FBSztDQUNoQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcm5Gb3JtYXQsIER1cmF0aW9uLCBSZXNvdXJjZSwgU3RhY2ssIFRva2VuLCBUb2tlbkNvbXBhcmlzb24sIEFzcGVjdHMsIEFubm90YXRpb25zIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBnZXRDdXN0b21pemVSb2xlc0NvbmZpZywgZ2V0UHJlY3JlYXRlZFJvbGVDb25maWcsIENVU1RPTUlaRV9ST0xFU19DT05URVhUX0tFWSwgQ3VzdG9taXplUm9sZUNvbmZpZyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUvbGliL2hlbHBlcnMtaW50ZXJuYWwnO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBJQ29uc3RydWN0LCBEZXBlbmRlbmN5R3JvdXAsIE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEdyYW50IH0gZnJvbSAnLi9ncmFudCc7XG5pbXBvcnQgeyBDZm5Sb2xlIH0gZnJvbSAnLi9pYW0uZ2VuZXJhdGVkJztcbmltcG9ydCB7IElJZGVudGl0eSB9IGZyb20gJy4vaWRlbnRpdHktYmFzZSc7XG5pbXBvcnQgeyBJTWFuYWdlZFBvbGljeSwgTWFuYWdlZFBvbGljeSB9IGZyb20gJy4vbWFuYWdlZC1wb2xpY3knO1xuaW1wb3J0IHsgUG9saWN5IH0gZnJvbSAnLi9wb2xpY3knO1xuaW1wb3J0IHsgUG9saWN5RG9jdW1lbnQgfSBmcm9tICcuL3BvbGljeS1kb2N1bWVudCc7XG5pbXBvcnQgeyBQb2xpY3lTdGF0ZW1lbnQgfSBmcm9tICcuL3BvbGljeS1zdGF0ZW1lbnQnO1xuaW1wb3J0IHsgQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQsIEFyblByaW5jaXBhbCwgSVByaW5jaXBhbCwgUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQgfSBmcm9tICcuL3ByaW5jaXBhbHMnO1xuaW1wb3J0IHsgZGVmYXVsdEFkZFByaW5jaXBhbFRvQXNzdW1lUm9sZSB9IGZyb20gJy4vcHJpdmF0ZS9hc3N1bWUtcm9sZS1wb2xpY3knO1xuaW1wb3J0IHsgSW1tdXRhYmxlUm9sZSB9IGZyb20gJy4vcHJpdmF0ZS9pbW11dGFibGUtcm9sZSc7XG5pbXBvcnQgeyBJbXBvcnRlZFJvbGUgfSBmcm9tICcuL3ByaXZhdGUvaW1wb3J0ZWQtcm9sZSc7XG5pbXBvcnQgeyBNdXRhdGluZ1BvbGljeURvY3VtZW50QWRhcHRlciB9IGZyb20gJy4vcHJpdmF0ZS9wb2xpY3lkb2MtYWRhcHRlcic7XG5pbXBvcnQgeyBQcmVjcmVhdGVkUm9sZSB9IGZyb20gJy4vcHJpdmF0ZS9wcmVjcmVhdGVkLXJvbGUnO1xuaW1wb3J0IHsgQXR0YWNoZWRQb2xpY2llcywgVW5pcXVlU3RyaW5nU2V0IH0gZnJvbSAnLi9wcml2YXRlL3V0aWwnO1xuXG5jb25zdCBNQVhfSU5MSU5FX1NJWkUgPSAxMDAwMDtcbmNvbnN0IE1BWF9NQU5BR0VEUE9MX1NJWkUgPSA2MDAwO1xuY29uc3QgSUFNX1JPTEVfU1lNQk9MID0gU3ltYm9sLmZvcignQGF3cy1jZGsvcGFja2FnZXMvYXdzLWlhbS9saWIvcm9sZS5Sb2xlJyk7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYW4gSUFNIFJvbGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSb2xlUHJvcHMge1xuICAvKipcbiAgICogVGhlIElBTSBwcmluY2lwYWwgKGkuZS4gYG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpYClcbiAgICogd2hpY2ggY2FuIGFzc3VtZSB0aGlzIHJvbGUuXG4gICAqXG4gICAqIFlvdSBjYW4gbGF0ZXIgbW9kaWZ5IHRoZSBhc3N1bWUgcm9sZSBwb2xpY3kgZG9jdW1lbnQgYnkgYWNjZXNzaW5nIGl0IHZpYVxuICAgKiB0aGUgYGFzc3VtZVJvbGVQb2xpY3lgIHByb3BlcnR5LlxuICAgKi9cbiAgcmVhZG9ubHkgYXNzdW1lZEJ5OiBJUHJpbmNpcGFsO1xuXG4gIC8qKlxuICAgKiBJRCB0aGF0IHRoZSByb2xlIGFzc3VtZXIgbmVlZHMgdG8gcHJvdmlkZSB3aGVuIGFzc3VtaW5nIHRoaXMgcm9sZVxuICAgKlxuICAgKiBJZiB0aGUgY29uZmlndXJlZCBhbmQgcHJvdmlkZWQgZXh0ZXJuYWwgSURzIGRvIG5vdCBtYXRjaCwgdGhlXG4gICAqIEFzc3VtZVJvbGUgb3BlcmF0aW9uIHdpbGwgZmFpbC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgc2VlIGBleHRlcm5hbElkc2BcbiAgICpcbiAgICogQGRlZmF1bHQgTm8gZXh0ZXJuYWwgSUQgcmVxdWlyZWRcbiAgICovXG4gIHJlYWRvbmx5IGV4dGVybmFsSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgSURzIHRoYXQgdGhlIHJvbGUgYXNzdW1lciBuZWVkcyB0byBwcm92aWRlIG9uZSBvZiB3aGVuIGFzc3VtaW5nIHRoaXMgcm9sZVxuICAgKlxuICAgKiBJZiB0aGUgY29uZmlndXJlZCBhbmQgcHJvdmlkZWQgZXh0ZXJuYWwgSURzIGRvIG5vdCBtYXRjaCwgdGhlXG4gICAqIEFzc3VtZVJvbGUgb3BlcmF0aW9uIHdpbGwgZmFpbC5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gZXh0ZXJuYWwgSUQgcmVxdWlyZWRcbiAgICovXG4gIHJlYWRvbmx5IGV4dGVybmFsSWRzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBtYW5hZ2VkIHBvbGljaWVzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHJvbGUuXG4gICAqXG4gICAqIFlvdSBjYW4gYWRkIG1hbmFnZWQgcG9saWNpZXMgbGF0ZXIgdXNpbmdcbiAgICogYGFkZE1hbmFnZWRQb2xpY3koTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUocG9saWN5TmFtZSkpYC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBtYW5hZ2VkIHBvbGljaWVzLlxuICAgKi9cbiAgcmVhZG9ubHkgbWFuYWdlZFBvbGljaWVzPzogSU1hbmFnZWRQb2xpY3lbXTtcblxuICAvKipcbiAgICogQSBsaXN0IG9mIG5hbWVkIHBvbGljaWVzIHRvIGlubGluZSBpbnRvIHRoaXMgcm9sZS4gVGhlc2UgcG9saWNpZXMgd2lsbCBiZVxuICAgKiBjcmVhdGVkIHdpdGggdGhlIHJvbGUsIHdoZXJlYXMgdGhvc2UgYWRkZWQgYnkgYGBhZGRUb1BvbGljeWBgIGFyZSBhZGRlZFxuICAgKiB1c2luZyBhIHNlcGFyYXRlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIChhbGxvd2luZyBhIHdheSBhcm91bmQgY2lyY3VsYXJcbiAgICogZGVwZW5kZW5jaWVzIHRoYXQgY291bGQgb3RoZXJ3aXNlIGJlIGludHJvZHVjZWQpLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHBvbGljeSBpcyBpbmxpbmVkIGluIHRoZSBSb2xlIHJlc291cmNlLlxuICAgKi9cbiAgcmVhZG9ubHkgaW5saW5lUG9saWNpZXM/OiB7IFtuYW1lOiBzdHJpbmddOiBQb2xpY3lEb2N1bWVudCB9O1xuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCBhc3NvY2lhdGVkIHdpdGggdGhpcyByb2xlLiBGb3IgaW5mb3JtYXRpb24gYWJvdXQgSUFNIHBhdGhzLCBzZWVcbiAgICogRnJpZW5kbHkgTmFtZXMgYW5kIFBhdGhzIGluIElBTSBVc2VyIEd1aWRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAvXG4gICAqL1xuICByZWFkb25seSBwYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBV1Mgc3VwcG9ydHMgcGVybWlzc2lvbnMgYm91bmRhcmllcyBmb3IgSUFNIGVudGl0aWVzICh1c2VycyBvciByb2xlcykuXG4gICAqIEEgcGVybWlzc2lvbnMgYm91bmRhcnkgaXMgYW4gYWR2YW5jZWQgZmVhdHVyZSBmb3IgdXNpbmcgYSBtYW5hZ2VkIHBvbGljeVxuICAgKiB0byBzZXQgdGhlIG1heGltdW0gcGVybWlzc2lvbnMgdGhhdCBhbiBpZGVudGl0eS1iYXNlZCBwb2xpY3kgY2FuIGdyYW50IHRvXG4gICAqIGFuIElBTSBlbnRpdHkuIEFuIGVudGl0eSdzIHBlcm1pc3Npb25zIGJvdW5kYXJ5IGFsbG93cyBpdCB0byBwZXJmb3JtIG9ubHlcbiAgICogdGhlIGFjdGlvbnMgdGhhdCBhcmUgYWxsb3dlZCBieSBib3RoIGl0cyBpZGVudGl0eS1iYXNlZCBwb2xpY2llcyBhbmQgaXRzXG4gICAqIHBlcm1pc3Npb25zIGJvdW5kYXJpZXMuXG4gICAqXG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1pYW0tcm9sZS5odG1sI2Nmbi1pYW0tcm9sZS1wZXJtaXNzaW9uc2JvdW5kYXJ5XG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9hY2Nlc3NfcG9saWNpZXNfYm91bmRhcmllcy5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gcGVybWlzc2lvbnMgYm91bmRhcnkuXG4gICAqL1xuICByZWFkb25seSBwZXJtaXNzaW9uc0JvdW5kYXJ5PzogSU1hbmFnZWRQb2xpY3k7XG5cbiAgLyoqXG4gICAqIEEgbmFtZSBmb3IgdGhlIElBTSByb2xlLiBGb3IgdmFsaWQgdmFsdWVzLCBzZWUgdGhlIFJvbGVOYW1lIHBhcmFtZXRlciBmb3JcbiAgICogdGhlIENyZWF0ZVJvbGUgYWN0aW9uIGluIHRoZSBJQU0gQVBJIFJlZmVyZW5jZS5cbiAgICpcbiAgICogSU1QT1JUQU5UOiBJZiB5b3Ugc3BlY2lmeSBhIG5hbWUsIHlvdSBjYW5ub3QgcGVyZm9ybSB1cGRhdGVzIHRoYXQgcmVxdWlyZVxuICAgKiByZXBsYWNlbWVudCBvZiB0aGlzIHJlc291cmNlLiBZb3UgY2FuIHBlcmZvcm0gdXBkYXRlcyB0aGF0IHJlcXVpcmUgbm8gb3JcbiAgICogc29tZSBpbnRlcnJ1cHRpb24uIElmIHlvdSBtdXN0IHJlcGxhY2UgdGhlIHJlc291cmNlLCBzcGVjaWZ5IGEgbmV3IG5hbWUuXG4gICAqXG4gICAqIElmIHlvdSBzcGVjaWZ5IGEgbmFtZSwgeW91IG11c3Qgc3BlY2lmeSB0aGUgQ0FQQUJJTElUWV9OQU1FRF9JQU0gdmFsdWUgdG9cbiAgICogYWNrbm93bGVkZ2UgeW91ciB0ZW1wbGF0ZSdzIGNhcGFiaWxpdGllcy4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZVxuICAgKiBBY2tub3dsZWRnaW5nIElBTSBSZXNvdXJjZXMgaW4gQVdTIENsb3VkRm9ybWF0aW9uIFRlbXBsYXRlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBV1MgQ2xvdWRGb3JtYXRpb24gZ2VuZXJhdGVzIGEgdW5pcXVlIHBoeXNpY2FsIElEIGFuZCB1c2VzIHRoYXQgSURcbiAgICogZm9yIHRoZSByb2xlIG5hbWUuXG4gICAqL1xuICByZWFkb25seSByb2xlTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG1heGltdW0gc2Vzc2lvbiBkdXJhdGlvbiB0aGF0IHlvdSB3YW50IHRvIHNldCBmb3IgdGhlIHNwZWNpZmllZCByb2xlLlxuICAgKiBUaGlzIHNldHRpbmcgY2FuIGhhdmUgYSB2YWx1ZSBmcm9tIDEgaG91ciAoMzYwMHNlYykgdG8gMTIgKDQzMjAwc2VjKSBob3Vycy5cbiAgICpcbiAgICogQW55b25lIHdobyBhc3N1bWVzIHRoZSByb2xlIGZyb20gdGhlIEFXUyBDTEkgb3IgQVBJIGNhbiB1c2UgdGhlXG4gICAqIER1cmF0aW9uU2Vjb25kcyBBUEkgcGFyYW1ldGVyIG9yIHRoZSBkdXJhdGlvbi1zZWNvbmRzIENMSSBwYXJhbWV0ZXIgdG9cbiAgICogcmVxdWVzdCBhIGxvbmdlciBzZXNzaW9uLiBUaGUgTWF4U2Vzc2lvbkR1cmF0aW9uIHNldHRpbmcgZGV0ZXJtaW5lcyB0aGVcbiAgICogbWF4aW11bSBkdXJhdGlvbiB0aGF0IGNhbiBiZSByZXF1ZXN0ZWQgdXNpbmcgdGhlIER1cmF0aW9uU2Vjb25kc1xuICAgKiBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIElmIHVzZXJzIGRvbid0IHNwZWNpZnkgYSB2YWx1ZSBmb3IgdGhlIER1cmF0aW9uU2Vjb25kcyBwYXJhbWV0ZXIsIHRoZWlyXG4gICAqIHNlY3VyaXR5IGNyZWRlbnRpYWxzIGFyZSB2YWxpZCBmb3Igb25lIGhvdXIgYnkgZGVmYXVsdC4gVGhpcyBhcHBsaWVzIHdoZW5cbiAgICogeW91IHVzZSB0aGUgQXNzdW1lUm9sZSogQVBJIG9wZXJhdGlvbnMgb3IgdGhlIGFzc3VtZS1yb2xlKiBDTEkgb3BlcmF0aW9uc1xuICAgKiBidXQgZG9lcyBub3QgYXBwbHkgd2hlbiB5b3UgdXNlIHRob3NlIG9wZXJhdGlvbnMgdG8gY3JlYXRlIGEgY29uc29sZSBVUkwuXG4gICAqXG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9pZF9yb2xlc191c2UuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5ob3VycygxKVxuICAgKi9cbiAgcmVhZG9ubHkgbWF4U2Vzc2lvbkR1cmF0aW9uPzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIEEgZGVzY3JpcHRpb24gb2YgdGhlIHJvbGUuIEl0IGNhbiBiZSB1cCB0byAxMDAwIGNoYXJhY3RlcnMgbG9uZy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXNjcmlwdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgYWxsb3dpbmcgY3VzdG9taXppbmcgdGhlIGJlaGF2aW9yIG9mIGBSb2xlLmZyb21Sb2xlQXJuYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGcm9tUm9sZUFybk9wdGlvbnMge1xuICAvKipcbiAgICogV2hldGhlciB0aGUgaW1wb3J0ZWQgcm9sZSBjYW4gYmUgbW9kaWZpZWQgYnkgYXR0YWNoaW5nIHBvbGljeSByZXNvdXJjZXMgdG8gaXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IG11dGFibGU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBGb3IgaW1tdXRhYmxlIHJvbGVzOiBhZGQgZ3JhbnRzIHRvIHJlc291cmNlcyBpbnN0ZWFkIG9mIGRyb3BwaW5nIHRoZW1cbiAgICpcbiAgICogSWYgdGhpcyBpcyBgZmFsc2VgIG9yIG5vdCBzcGVjaWZpZWQsIGdyYW50IHBlcm1pc3Npb25zIGFkZGVkIHRvIHRoaXMgcm9sZSBhcmUgaWdub3JlZC5cbiAgICogSXQgaXMgeW91ciBvd24gcmVzcG9uc2liaWxpdHkgdG8gbWFrZSBzdXJlIHRoZSByb2xlIGhhcyB0aGUgcmVxdWlyZWQgcGVybWlzc2lvbnMuXG4gICAqXG4gICAqIElmIHRoaXMgaXMgYHRydWVgLCBhbnkgZ3JhbnQgcGVybWlzc2lvbnMgd2lsbCBiZSBhZGRlZCB0byB0aGUgcmVzb3VyY2UgaW5zdGVhZC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGFkZEdyYW50c1RvUmVzb3VyY2VzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQW55IHBvbGljaWVzIGNyZWF0ZWQgYnkgdGhpcyByb2xlIHdpbGwgdXNlIHRoaXMgdmFsdWUgYXMgdGhlaXIgSUQsIGlmIHNwZWNpZmllZC5cbiAgICogU3BlY2lmeSB0aGlzIGlmIGltcG9ydGluZyB0aGUgc2FtZSByb2xlIGluIG11bHRpcGxlIHN0YWNrcywgYW5kIGdyYW50aW5nIGl0XG4gICAqIGRpZmZlcmVudCBwZXJtaXNzaW9ucyBpbiBhdCBsZWFzdCB0d28gc3RhY2tzLiBJZiB0aGlzIGlzIG5vdCBzcGVjaWZpZWRcbiAgICogKG9yIGlmIHRoZSBzYW1lIG5hbWUgaXMgc3BlY2lmaWVkIGluIG1vcmUgdGhhbiBvbmUgc3RhY2spLFxuICAgKiBhIENsb3VkRm9ybWF0aW9uIGlzc3VlIHdpbGwgcmVzdWx0IGluIHRoZSBwb2xpY3kgY3JlYXRlZCBpbiB3aGljaGV2ZXIgc3RhY2tcbiAgICogaXMgZGVwbG95ZWQgbGFzdCBvdmVyd3JpdGluZyB0aGUgcG9saWNpZXMgY3JlYXRlZCBieSB0aGUgb3RoZXJzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAnUG9saWN5J1xuICAgKi9cbiAgcmVhZG9ubHkgZGVmYXVsdFBvbGljeU5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgY3VzdG9taXppbmcgSUFNIHJvbGUgY3JlYXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDdXN0b21pemVSb2xlc09wdGlvbnMge1xuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdG8gc3ludGhlc2l6ZSB0aGUgcmVzb3VyY2UgaW50byB0aGUgQ0ZOIHRlbXBsYXRlLlxuICAgKlxuICAgKiBTZXQgdGhpcyB0byBgZmFsc2VgIGlmIHlvdSBzdGlsbCB3YW50IHRvIGNyZWF0ZSB0aGUgcmVzb3VyY2VzIF9hbmRfXG4gICAqIHlvdSBhbHNvIHdhbnQgdG8gY3JlYXRlIHRoZSBwb2xpY3kgcmVwb3J0LlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBwcmV2ZW50U3ludGhlc2lzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBsaXN0IG9mIHByZWNyZWF0ZWQgSUFNIHJvbGVzIHRvIHN1YnN0aXR1dGUgZm9yIHJvbGVzXG4gICAqIHRoYXQgQ0RLIGlzIGNyZWF0aW5nLlxuICAgKlxuICAgKiBUaGUgY29uc3RydWN0UGF0aCBjYW4gYmUgZWl0aGVyIGEgcmVsYXRpdmUgb3IgYWJzb2x1dGUgcGF0aFxuICAgKiBmcm9tIHRoZSBzY29wZSB0aGF0IGBjdXN0b21pemVSb2xlc2AgaXMgdXNlZCBvbiB0byB0aGUgcm9sZSBiZWluZyBjcmVhdGVkLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgaWYgeW91IHdlcmUgY3JlYXRpbmcgYSByb2xlXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcbiAgICogbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnKTtcbiAgICpcbiAgICogUm9sZS5jdXN0b21pemVSb2xlcyhzdGFjaywge1xuICAgKiAgIHVzZVByZWNyZWF0ZWRSb2xlczoge1xuICAgKiAgICAgIC8vIGFic29sdXRlIHBhdGhcbiAgICogICAgICdNeVN0YWNrL015Um9sZSc6ICdteS1wcmVjcmVhdGVkLXJvbGUtbmFtZScsXG4gICAqICAgICAvLyBvciByZWxhdGl2ZSBwYXRoIGZyb20gYHN0YWNrYFxuICAgKiAgICAgJ015Um9sZSc6ICdteS1wcmVjcmVhdGVkLXJvbGUnLFxuICAgKiAgIH0sXG4gICAqIH0pO1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZXJlIGFyZSBubyBwcmVjcmVhdGVkIHJvbGVzLiBTeW50aGVzaXMgd2lsbCBmYWlsIGlmIGBwcmV2ZW50U3ludGhlc2lzPXRydWVgXG4gICAqL1xuICByZWFkb25seSB1c2VQcmVjcmVhdGVkUm9sZXM/OiB7IFtjb25zdHJ1Y3RQYXRoOiBzdHJpbmddOiBzdHJpbmcgfTtcbn1cblxuLyoqXG4gKiBPcHRpb25zIGFsbG93aW5nIGN1c3RvbWl6aW5nIHRoZSBiZWhhdmlvciBvZiBgUm9sZS5mcm9tUm9sZU5hbWVgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZyb21Sb2xlTmFtZU9wdGlvbnMgZXh0ZW5kcyBGcm9tUm9sZUFybk9wdGlvbnMgeyB9XG5cbi8qKlxuICogSUFNIFJvbGVcbiAqXG4gKiBEZWZpbmVzIGFuIElBTSByb2xlLiBUaGUgcm9sZSBpcyBjcmVhdGVkIHdpdGggYW4gYXNzdW1lIHBvbGljeSBkb2N1bWVudCBhc3NvY2lhdGVkIHdpdGhcbiAqIHRoZSBzcGVjaWZpZWQgQVdTIHNlcnZpY2UgcHJpbmNpcGFsIGRlZmluZWQgaW4gYHNlcnZpY2VBc3N1bWVSb2xlYC5cbiAqL1xuZXhwb3J0IGNsYXNzIFJvbGUgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElSb2xlIHtcbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleHRlcm5hbCByb2xlIGJ5IEFSTi5cbiAgICpcbiAgICogSWYgdGhlIGltcG9ydGVkIFJvbGUgQVJOIGlzIGEgVG9rZW4gKHN1Y2ggYXMgYVxuICAgKiBgQ2ZuUGFyYW1ldGVyLnZhbHVlQXNTdHJpbmdgIG9yIGEgYEZuLmltcG9ydFZhbHVlKClgKSAqYW5kKiB0aGUgcmVmZXJlbmNlZFxuICAgKiByb2xlIGhhcyBhIGBwYXRoYCAobGlrZSBgYXJuOi4uLjpyb2xlL0FkbWluUm9sZXMvQWxpY2VgKSwgdGhlXG4gICAqIGByb2xlTmFtZWAgcHJvcGVydHkgd2lsbCBub3QgcmVzb2x2ZSB0byB0aGUgY29ycmVjdCB2YWx1ZS4gSW5zdGVhZCBpdFxuICAgKiB3aWxsIHJlc29sdmUgdG8gdGhlIGZpcnN0IHBhdGggY29tcG9uZW50LiBXZSB1bmZvcnR1bmF0ZWx5IGNhbm5vdCBleHByZXNzXG4gICAqIHRoZSBjb3JyZWN0IGNhbGN1bGF0aW9uIG9mIHRoZSBmdWxsIHBhdGggbmFtZSBhcyBhIENsb3VkRm9ybWF0aW9uXG4gICAqIGV4cHJlc3Npb24uIEluIHRoaXMgc2NlbmFyaW8gdGhlIFJvbGUgQVJOIHNob3VsZCBiZSBzdXBwbGllZCB3aXRob3V0IHRoZVxuICAgKiBgcGF0aGAgaW4gb3JkZXIgdG8gcmVzb2x2ZSB0aGUgY29ycmVjdCByb2xlIHJlc291cmNlLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgY29uc3RydWN0IHNjb3BlXG4gICAqIEBwYXJhbSBpZCBjb25zdHJ1Y3QgaWRcbiAgICogQHBhcmFtIHJvbGVBcm4gdGhlIEFSTiBvZiB0aGUgcm9sZSB0byBpbXBvcnRcbiAgICogQHBhcmFtIG9wdGlvbnMgYWxsb3cgY3VzdG9taXppbmcgdGhlIGJlaGF2aW9yIG9mIHRoZSByZXR1cm5lZCByb2xlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Sb2xlQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJvbGVBcm46IHN0cmluZywgb3B0aW9uczogRnJvbVJvbGVBcm5PcHRpb25zID0ge30pOiBJUm9sZSB7XG4gICAgY29uc3Qgc2NvcGVTdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgICBjb25zdCBwYXJzZWRBcm4gPSBzY29wZVN0YWNrLnNwbGl0QXJuKHJvbGVBcm4sIEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FKTtcbiAgICBjb25zdCByZXNvdXJjZU5hbWUgPSBwYXJzZWRBcm4ucmVzb3VyY2VOYW1lITtcbiAgICBjb25zdCByb2xlQWNjb3VudCA9IHBhcnNlZEFybi5hY2NvdW50O1xuICAgIC8vIHNlcnZpY2Ugcm9sZXMgaGF2ZSBhbiBBUk4gbGlrZSAnYXJuOmF3czppYW06OjxhY2NvdW50Pjpyb2xlL3NlcnZpY2Utcm9sZS88cm9sZU5hbWU+J1xuICAgIC8vIG9yICdhcm46YXdzOmlhbTo6PGFjY291bnQ+OnJvbGUvc2VydmljZS1yb2xlL3NlcnZpY2VuYW1lLmFtYXpvbmF3cy5jb20vc2VydmljZS1yb2xlLzxyb2xlTmFtZT4nXG4gICAgLy8gd2Ugd2FudCB0byBzdXBwb3J0IHRoZXNlIGFzIHdlbGwsIHNvIHdlIGp1c3QgdXNlIHRoZSBlbGVtZW50IGFmdGVyIHRoZSBsYXN0IHNsYXNoIGFzIHJvbGUgbmFtZVxuICAgIGNvbnN0IHJvbGVOYW1lID0gcmVzb3VyY2VOYW1lLnNwbGl0KCcvJykucG9wKCkhO1xuXG4gICAgaWYgKGdldEN1c3RvbWl6ZVJvbGVzQ29uZmlnKHNjb3BlKS5lbmFibGVkKSB7XG4gICAgICByZXR1cm4gbmV3IFByZWNyZWF0ZWRSb2xlKHNjb3BlLCBpZCwge1xuICAgICAgICByb2xlUGF0aDogYCR7c2NvcGUubm9kZS5wYXRofS8ke2lkfWAsXG4gICAgICAgIHJvbGU6IG5ldyBJbXBvcnRlZFJvbGUoc2NvcGUsIGBJbXBvcnQke2lkfWAsIHtcbiAgICAgICAgICBhY2NvdW50OiByb2xlQWNjb3VudCxcbiAgICAgICAgICByb2xlQXJuLFxuICAgICAgICAgIHJvbGVOYW1lLFxuICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuYWRkR3JhbnRzVG9SZXNvdXJjZXMgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLm11dGFibGUgIT09IGZhbHNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1xcJ2FkZEdyYW50c1RvUmVzb3VyY2VzXFwnIGNhbiBvbmx5IGJlIHBhc3NlZCBpZiBcXCdtdXRhYmxlOiBmYWxzZVxcJycpO1xuICAgIH1cblxuICAgIGNvbnN0IHJvbGVBcm5BbmRTY29wZVN0YWNrQWNjb3VudENvbXBhcmlzb24gPSBUb2tlbi5jb21wYXJlU3RyaW5ncyhyb2xlQWNjb3VudCA/PyAnJywgc2NvcGVTdGFjay5hY2NvdW50KTtcbiAgICBjb25zdCBlcXVhbE9yQW55VW5yZXNvbHZlZCA9IHJvbGVBcm5BbmRTY29wZVN0YWNrQWNjb3VudENvbXBhcmlzb24gPT09IFRva2VuQ29tcGFyaXNvbi5TQU1FIHx8XG4gICAgICByb2xlQXJuQW5kU2NvcGVTdGFja0FjY291bnRDb21wYXJpc29uID09PSBUb2tlbkNvbXBhcmlzb24uQk9USF9VTlJFU09MVkVEIHx8XG4gICAgICByb2xlQXJuQW5kU2NvcGVTdGFja0FjY291bnRDb21wYXJpc29uID09PSBUb2tlbkNvbXBhcmlzb24uT05FX1VOUkVTT0xWRUQ7XG5cbiAgICAvLyBpZiB3ZSBhcmUgcmV0dXJuaW5nIGFuIGltbXV0YWJsZSByb2xlIHRoZW4gdGhlICdpbXBvcnRlZFJvbGUnIGlzIGp1c3QgYSB0aHJvd2F3YXkgY29uc3RydWN0XG4gICAgLy8gc28gZ2l2ZSBpdCBhIGRpZmZlcmVudCBpZFxuICAgIGNvbnN0IG11dGFibGVSb2xlSWQgPSAob3B0aW9ucy5tdXRhYmxlICE9PSBmYWxzZSAmJiBlcXVhbE9yQW55VW5yZXNvbHZlZCkgPyBpZCA6IGBNdXRhYmxlUm9sZSR7aWR9YDtcbiAgICBjb25zdCBpbXBvcnRlZFJvbGUgPSBuZXcgSW1wb3J0ZWRSb2xlKHNjb3BlLCBtdXRhYmxlUm9sZUlkLCB7XG4gICAgICByb2xlQXJuLFxuICAgICAgcm9sZU5hbWUsXG4gICAgICBhY2NvdW50OiByb2xlQWNjb3VudCxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG5cblxuICAgIC8vIHdlIG9ubHkgcmV0dXJuIGFuIGltbXV0YWJsZSBSb2xlIGlmIGJvdGggYWNjb3VudHMgd2VyZSBleHBsaWNpdGx5IHByb3ZpZGVkLCBhbmQgZGlmZmVyZW50XG4gICAgcmV0dXJuIG9wdGlvbnMubXV0YWJsZSAhPT0gZmFsc2UgJiYgZXF1YWxPckFueVVucmVzb2x2ZWRcbiAgICAgID8gaW1wb3J0ZWRSb2xlXG4gICAgICA6IG5ldyBJbW11dGFibGVSb2xlKHNjb3BlLCBpZCwgaW1wb3J0ZWRSb2xlLCBvcHRpb25zLmFkZEdyYW50c1RvUmVzb3VyY2VzID8/IGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgICogUmV0dXJuIHdoZXRoZXIgdGhlIGdpdmVuIG9iamVjdCBpcyBhIFJvbGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNSb2xlKHg6IGFueSkgOiB4IGlzIFJvbGUge1xuICAgIHJldHVybiB4ICE9PSBudWxsICYmIHR5cGVvZih4KSA9PT0gJ29iamVjdCcgJiYgSUFNX1JPTEVfU1lNQk9MIGluIHg7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXh0ZXJuYWwgcm9sZSBieSBuYW1lLlxuICAgKlxuICAgKiBUaGUgaW1wb3J0ZWQgcm9sZSBpcyBhc3N1bWVkIHRvIGV4aXN0IGluIHRoZSBzYW1lIGFjY291bnQgYXMgdGhlIGFjY291bnRcbiAgICogdGhlIHNjb3BlJ3MgY29udGFpbmluZyBTdGFjayBpcyBiZWluZyBkZXBsb3llZCB0by5cblxuICAgKiBAcGFyYW0gc2NvcGUgY29uc3RydWN0IHNjb3BlXG4gICAqIEBwYXJhbSBpZCBjb25zdHJ1Y3QgaWRcbiAgICogQHBhcmFtIHJvbGVOYW1lIHRoZSBuYW1lIG9mIHRoZSByb2xlIHRvIGltcG9ydFxuICAgKiBAcGFyYW0gb3B0aW9ucyBhbGxvdyBjdXN0b21pemluZyB0aGUgYmVoYXZpb3Igb2YgdGhlIHJldHVybmVkIHJvbGVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVJvbGVOYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJvbGVOYW1lOiBzdHJpbmcsIG9wdGlvbnM6IEZyb21Sb2xlTmFtZU9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBSb2xlLmZyb21Sb2xlQXJuKHNjb3BlLCBpZCwgU3RhY2sub2Yoc2NvcGUpLmZvcm1hdEFybih7XG4gICAgICByZWdpb246ICcnLFxuICAgICAgc2VydmljZTogJ2lhbScsXG4gICAgICByZXNvdXJjZTogJ3JvbGUnLFxuICAgICAgcmVzb3VyY2VOYW1lOiByb2xlTmFtZSxcbiAgICB9KSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ3VzdG9taXplIHRoZSBjcmVhdGlvbiBvZiBJQU0gcm9sZXMgd2l0aGluIHRoZSBnaXZlbiBzY29wZVxuICAgKlxuICAgKiBJdCBpcyByZWNvbW1lbmRlZCB0aGF0IHlvdSAqKmRvIG5vdCoqIHVzZSB0aGlzIG1ldGhvZCBhbmQgaW5zdGVhZCBhbGxvd1xuICAgKiBDREsgdG8gbWFuYWdlIHJvbGUgY3JlYXRpb24uIFRoaXMgc2hvdWxkIG9ubHkgYmUgdXNlZFxuICAgKiBpbiBlbnZpcm9ubWVudHMgd2hlcmUgQ0RLIGFwcGxpY2F0aW9ucyBhcmUgbm90IGFsbG93ZWQgdG8gY3JlYXRlZCBJQU0gcm9sZXMuXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gcHJldmVudCB0aGUgQ0RLIGFwcGxpY2F0aW9uIGZyb20gY3JlYXRpbmcgcm9sZXNcbiAgICogd2l0aGluIHRoZSBnaXZlbiBzY29wZSBhbmQgaW5zdGVhZCByZXBsYWNlIHRoZSByZWZlcmVuY2VzIHRvIHRoZSByb2xlcyB3aXRoXG4gICAqIHByZWNyZWF0ZWQgcm9sZSBuYW1lcy4gQSByZXBvcnQgd2lsbCBiZSBzeW50aGVzaXplZCBpbiB0aGUgY2xvdWQgYXNzZW1ibHkgKGkuZS4gY2RrLm91dClcbiAgICogdGhhdCB3aWxsIGNvbnRhaW4gdGhlIGxpc3Qgb2YgSUFNIHJvbGVzIHRoYXQgd291bGQgaGF2ZSBiZWVuIGNyZWF0ZWQgYWxvbmcgd2l0aCB0aGVcbiAgICogSUFNIHBvbGljeSBzdGF0ZW1lbnRzIHRoYXQgdGhlIHJvbGUgc2hvdWxkIGNvbnRhaW4uIFRoaXMgcmVwb3J0IGNhbiB0aGVuIGJlIHVzZWRcbiAgICogdG8gY3JlYXRlIHRoZSBJQU0gcm9sZXMgb3V0c2lkZSBvZiBDREsgYW5kIHRoZW4gdGhlIGNyZWF0ZWQgcm9sZSBuYW1lcyBjYW4gYmUgcHJvdmlkZWRcbiAgICogaW4gYHVzZVByZWNyZWF0ZWRSb2xlc2AuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGRlY2xhcmUgY29uc3QgYXBwOiBBcHA7XG4gICAqIFJvbGUuY3VzdG9taXplUm9sZXMoYXBwLCB7XG4gICAqICAgdXNlUHJlY3JlYXRlZFJvbGVzOiB7XG4gICAqICAgICAnQ29uc3RydWN0UGF0aC9Uby9Sb2xlJzogJ215LXByZWNyZWF0ZWQtcm9sZS1uYW1lJyxcbiAgICogICB9LFxuICAgKiB9KTtcbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIGNvbnN0cnVjdCBzY29wZSB0byBjdXN0b21pemUgcm9sZSBjcmVhdGlvblxuICAgKiBAcGFyYW0gb3B0aW9ucyBvcHRpb25zIGZvciBjb25maWd1cmluZyByb2xlIGNyZWF0aW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGN1c3RvbWl6ZVJvbGVzKHNjb3BlOiBDb25zdHJ1Y3QsIG9wdGlvbnM/OiBDdXN0b21pemVSb2xlc09wdGlvbnMpOiB2b2lkIHtcbiAgICBjb25zdCBwcmV2ZW50U3ludGhlc2lzID0gb3B0aW9ucz8ucHJldmVudFN5bnRoZXNpcyA/PyB0cnVlO1xuICAgIGNvbnN0IHVzZVJvbGVzOiB7IFtjb25zdHJ1Y3RQYXRoOiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgIGZvciAoY29uc3QgW2NvbnN0cnVjdFBhdGgsIHJvbGVOYW1lXSBvZiBPYmplY3QuZW50cmllcyhvcHRpb25zPy51c2VQcmVjcmVhdGVkUm9sZXMgPz8ge30pKSB7XG4gICAgICBjb25zdCBhYnNQYXRoID0gY29uc3RydWN0UGF0aC5zdGFydHNXaXRoKHNjb3BlLm5vZGUucGF0aClcbiAgICAgICAgPyBjb25zdHJ1Y3RQYXRoXG4gICAgICAgIDogYCR7c2NvcGUubm9kZS5wYXRofS8ke2NvbnN0cnVjdFBhdGh9YDtcbiAgICAgIHVzZVJvbGVzW2Fic1BhdGhdID0gcm9sZU5hbWU7XG4gICAgfVxuICAgIHNjb3BlLm5vZGUuc2V0Q29udGV4dChDVVNUT01JWkVfUk9MRVNfQ09OVEVYVF9LRVksIHtcbiAgICAgIHByZXZlbnRTeW50aGVzaXMsXG4gICAgICB1c2VQcmVjcmVhdGVkUm9sZXM6IHVzZVJvbGVzLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsOiBJUHJpbmNpcGFsID0gdGhpcztcbiAgcHVibGljIHJlYWRvbmx5IHByaW5jaXBhbEFjY291bnQ6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHRoaXMuZW52LmFjY291bnQ7XG5cbiAgcHVibGljIHJlYWRvbmx5IGFzc3VtZVJvbGVBY3Rpb246IHN0cmluZyA9ICdzdHM6QXNzdW1lUm9sZSc7XG5cbiAgLyoqXG4gICAqIFRoZSBhc3N1bWUgcm9sZSBwb2xpY3kgZG9jdW1lbnQgYXNzb2NpYXRlZCB3aXRoIHRoaXMgcm9sZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhc3N1bWVSb2xlUG9saWN5PzogUG9saWN5RG9jdW1lbnQ7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIEFSTiBvZiB0aGlzIHJvbGUuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcm9sZUFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBuYW1lIG9mIHRoZSByb2xlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJvbGVOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJvbGUuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcG9saWN5RnJhZ21lbnQ6IFByaW5jaXBhbFBvbGljeUZyYWdtZW50O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBwZXJtaXNzaW9ucyBib3VuZGFyeSBhdHRhY2hlZCB0byB0aGlzIHJvbGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBwZXJtaXNzaW9uc0JvdW5kYXJ5PzogSU1hbmFnZWRQb2xpY3k7XG5cbiAgcHJpdmF0ZSBkZWZhdWx0UG9saWN5PzogUG9saWN5O1xuICBwcml2YXRlIHJlYWRvbmx5IG1hbmFnZWRQb2xpY2llczogSU1hbmFnZWRQb2xpY3lbXSA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IGF0dGFjaGVkUG9saWNpZXMgPSBuZXcgQXR0YWNoZWRQb2xpY2llcygpO1xuICBwcml2YXRlIHJlYWRvbmx5IGlubGluZVBvbGljaWVzOiB7IFtuYW1lOiBzdHJpbmddOiBQb2xpY3lEb2N1bWVudCB9O1xuICBwcml2YXRlIHJlYWRvbmx5IGRlcGVuZGFibGVzID0gbmV3IE1hcDxQb2xpY3lTdGF0ZW1lbnQsIERlcGVuZGVuY3lHcm91cD4oKTtcbiAgcHJpdmF0ZSBpbW11dGFibGVSb2xlPzogSVJvbGU7XG4gIHByaXZhdGUgX2RpZFNwbGl0ID0gZmFsc2U7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3JvbGVJZD86IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IF9wcmVjcmVhdGVkUm9sZT86IElSb2xlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBSb2xlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMucm9sZU5hbWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBleHRlcm5hbElkcyA9IHByb3BzLmV4dGVybmFsSWRzIHx8IFtdO1xuICAgIGlmIChwcm9wcy5leHRlcm5hbElkKSB7XG4gICAgICBleHRlcm5hbElkcy5wdXNoKHByb3BzLmV4dGVybmFsSWQpO1xuICAgIH1cblxuICAgIHRoaXMuYXNzdW1lUm9sZVBvbGljeSA9IGNyZWF0ZUFzc3VtZVJvbGVQb2xpY3kocHJvcHMuYXNzdW1lZEJ5LCBleHRlcm5hbElkcyk7XG4gICAgdGhpcy5tYW5hZ2VkUG9saWNpZXMucHVzaCguLi5wcm9wcy5tYW5hZ2VkUG9saWNpZXMgfHwgW10pO1xuICAgIHRoaXMuaW5saW5lUG9saWNpZXMgPSBwcm9wcy5pbmxpbmVQb2xpY2llcyB8fCB7fTtcbiAgICB0aGlzLnBlcm1pc3Npb25zQm91bmRhcnkgPSBwcm9wcy5wZXJtaXNzaW9uc0JvdW5kYXJ5O1xuICAgIGNvbnN0IG1heFNlc3Npb25EdXJhdGlvbiA9IHByb3BzLm1heFNlc3Npb25EdXJhdGlvbiAmJiBwcm9wcy5tYXhTZXNzaW9uRHVyYXRpb24udG9TZWNvbmRzKCk7XG4gICAgdmFsaWRhdGVNYXhTZXNzaW9uRHVyYXRpb24obWF4U2Vzc2lvbkR1cmF0aW9uKTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IChwcm9wcy5kZXNjcmlwdGlvbiAmJiBwcm9wcy5kZXNjcmlwdGlvbj8ubGVuZ3RoID4gMCkgPyBwcm9wcy5kZXNjcmlwdGlvbiA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChkZXNjcmlwdGlvbiAmJiBkZXNjcmlwdGlvbi5sZW5ndGggPiAxMDAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JvbGUgZGVzY3JpcHRpb24gbXVzdCBiZSBubyBsb25nZXIgdGhhbiAxMDAwIGNoYXJhY3RlcnMuJyk7XG4gICAgfVxuXG4gICAgdmFsaWRhdGVSb2xlUGF0aChwcm9wcy5wYXRoKTtcblxuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuZ2V0UHJlY3JlYXRlZFJvbGVDb25maWcoKTtcbiAgICBjb25zdCByb2xlQXJuID0gU3RhY2sub2Yoc2NvcGUpLmZvcm1hdEFybih7XG4gICAgICByZWdpb246ICcnLFxuICAgICAgc2VydmljZTogJ2lhbScsXG4gICAgICByZXNvdXJjZTogJ3JvbGUnLFxuICAgICAgcmVzb3VyY2VOYW1lOiBjb25maWcucHJlY3JlYXRlZFJvbGVOYW1lLFxuICAgIH0pO1xuICAgIGNvbnN0IGltcG9ydGVkUm9sZSA9IG5ldyBJbXBvcnRlZFJvbGUodGhpcywgJ0ltcG9ydCcraWQsIHtcbiAgICAgIHJvbGVBcm4sXG4gICAgICByb2xlTmFtZTogY29uZmlnLnByZWNyZWF0ZWRSb2xlTmFtZSA/PyBpZCxcbiAgICAgIGFjY291bnQ6IFN0YWNrLm9mKHRoaXMpLmFjY291bnQsXG4gICAgfSk7XG4gICAgdGhpcy5yb2xlTmFtZSA9IGltcG9ydGVkUm9sZS5yb2xlTmFtZTtcbiAgICB0aGlzLnJvbGVBcm4gPSBpbXBvcnRlZFJvbGUucm9sZUFybjtcbiAgICBpZiAoY29uZmlnLmVuYWJsZWQpIHtcbiAgICAgIGNvbnN0IHJvbGUgPSBuZXcgUHJlY3JlYXRlZFJvbGUodGhpcywgJ1ByZWNyZWF0ZWRSb2xlJytpZCwge1xuICAgICAgICByb2xlUGF0aDogdGhpcy5ub2RlLnBhdGgsXG4gICAgICAgIHJvbGU6IGltcG9ydGVkUm9sZSxcbiAgICAgICAgbWlzc2luZzogIWNvbmZpZy5wcmVjcmVhdGVkUm9sZU5hbWUsXG4gICAgICAgIGFzc3VtZVJvbGVQb2xpY3k6IHRoaXMuYXNzdW1lUm9sZVBvbGljeSxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5tYW5hZ2VkUG9saWNpZXMuZm9yRWFjaChwb2xpY3kgPT4gcm9sZS5hZGRNYW5hZ2VkUG9saWN5KHBvbGljeSkpO1xuICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5pbmxpbmVQb2xpY2llcykuZm9yRWFjaCgoW25hbWUsIHBvbGljeV0pID0+IHtcbiAgICAgICAgcm9sZS5hdHRhY2hJbmxpbmVQb2xpY3kobmV3IFBvbGljeSh0aGlzLCBuYW1lLCB7IGRvY3VtZW50OiBwb2xpY3kgfSkpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3ByZWNyZWF0ZWRSb2xlID0gcm9sZTtcbiAgICB9XG5cbiAgICAvLyBzeW50aGVzaXplIHRoZSByZXNvdXJjZSBpZiBwcmV2ZW50U3ludGhlc2lzPWZhbHNlXG4gICAgaWYgKCFjb25maWcucHJldmVudFN5bnRoZXNpcykge1xuICAgICAgY29uc3Qgcm9sZSA9IG5ldyBDZm5Sb2xlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgICAgYXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB0aGlzLmFzc3VtZVJvbGVQb2xpY3kgYXMgYW55LFxuICAgICAgICBtYW5hZ2VkUG9saWN5QXJuczogVW5pcXVlU3RyaW5nU2V0LmZyb20oKCkgPT4gdGhpcy5tYW5hZ2VkUG9saWNpZXMubWFwKHAgPT4gcC5tYW5hZ2VkUG9saWN5QXJuKSksXG4gICAgICAgIHBvbGljaWVzOiBfZmxhdHRlbih0aGlzLmlubGluZVBvbGljaWVzKSxcbiAgICAgICAgcGF0aDogcHJvcHMucGF0aCxcbiAgICAgICAgcGVybWlzc2lvbnNCb3VuZGFyeTogdGhpcy5wZXJtaXNzaW9uc0JvdW5kYXJ5ID8gdGhpcy5wZXJtaXNzaW9uc0JvdW5kYXJ5Lm1hbmFnZWRQb2xpY3lBcm4gOiB1bmRlZmluZWQsXG4gICAgICAgIHJvbGVOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgICAgbWF4U2Vzc2lvbkR1cmF0aW9uLFxuICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9yb2xlSWQgPSByb2xlLmF0dHJSb2xlSWQ7XG4gICAgICB0aGlzLnJvbGVBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHJvbGUuYXR0ckFybiwge1xuICAgICAgICByZWdpb246ICcnLCAvLyBJQU0gaXMgZ2xvYmFsIGluIGVhY2ggcGFydGl0aW9uXG4gICAgICAgIHNlcnZpY2U6ICdpYW0nLFxuICAgICAgICByZXNvdXJjZTogJ3JvbGUnLFxuICAgICAgICAvLyBSZW1vdmVzIGxlYWRpbmcgc2xhc2ggZnJvbSBwYXRoXG4gICAgICAgIHJlc291cmNlTmFtZTogYCR7cHJvcHMucGF0aCA/IHByb3BzLnBhdGguc3Vic3RyKHByb3BzLnBhdGguY2hhckF0KDApID09PSAnLycgPyAxIDogMCkgOiAnJ30ke3RoaXMucGh5c2ljYWxOYW1lfWAsXG4gICAgICB9KTtcbiAgICAgIHRoaXMucm9sZU5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyb2xlLnJlZik7XG4gICAgICBBc3BlY3RzLm9mKHRoaXMpLmFkZCh7XG4gICAgICAgIHZpc2l0OiAoYykgPT4ge1xuICAgICAgICAgIGlmIChjID09PSB0aGlzKSB7XG4gICAgICAgICAgICB0aGlzLnNwbGl0TGFyZ2VQb2xpY3koKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnBvbGljeUZyYWdtZW50ID0gbmV3IEFyblByaW5jaXBhbCh0aGlzLnJvbGVBcm4pLnBvbGljeUZyYWdtZW50O1xuXG4gICAgZnVuY3Rpb24gX2ZsYXR0ZW4ocG9saWNpZXM/OiB7IFtuYW1lOiBzdHJpbmddOiBQb2xpY3lEb2N1bWVudCB9KSB7XG4gICAgICBpZiAocG9saWNpZXMgPT0gbnVsbCB8fCBPYmplY3Qua2V5cyhwb2xpY2llcykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBjb25zdCByZXN1bHQgPSBuZXcgQXJyYXk8Q2ZuUm9sZS5Qb2xpY3lQcm9wZXJ0eT4oKTtcbiAgICAgIGZvciAoY29uc3QgcG9saWN5TmFtZSBvZiBPYmplY3Qua2V5cyhwb2xpY2llcykpIHtcbiAgICAgICAgY29uc3QgcG9saWN5RG9jdW1lbnQgPSBwb2xpY2llc1twb2xpY3lOYW1lXTtcbiAgICAgICAgcmVzdWx0LnB1c2goeyBwb2xpY3lOYW1lLCBwb2xpY3lEb2N1bWVudCB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgdGhpcy5ub2RlLmFkZFZhbGlkYXRpb24oeyB2YWxpZGF0ZTogKCkgPT4gdGhpcy52YWxpZGF0ZVJvbGUoKSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgcGVybWlzc2lvbiB0byB0aGUgcm9sZSdzIGRlZmF1bHQgcG9saWN5IGRvY3VtZW50LlxuICAgKiBJZiB0aGVyZSBpcyBubyBkZWZhdWx0IHBvbGljeSBhdHRhY2hlZCB0byB0aGlzIHJvbGUsIGl0IHdpbGwgYmUgY3JlYXRlZC5cbiAgICogQHBhcmFtIHN0YXRlbWVudCBUaGUgcGVybWlzc2lvbiBzdGF0ZW1lbnQgdG8gYWRkIHRvIHRoZSBwb2xpY3kgZG9jdW1lbnRcbiAgICovXG4gIHB1YmxpYyBhZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IEFkZFRvUHJpbmNpcGFsUG9saWN5UmVzdWx0IHtcbiAgICBpZiAodGhpcy5fcHJlY3JlYXRlZFJvbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wcmVjcmVhdGVkUm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXRoaXMuZGVmYXVsdFBvbGljeSkge1xuICAgICAgICB0aGlzLmRlZmF1bHRQb2xpY3kgPSBuZXcgUG9saWN5KHRoaXMsICdEZWZhdWx0UG9saWN5Jyk7XG4gICAgICAgIHRoaXMuYXR0YWNoSW5saW5lUG9saWN5KHRoaXMuZGVmYXVsdFBvbGljeSk7XG4gICAgICB9XG4gICAgICB0aGlzLmRlZmF1bHRQb2xpY3kuYWRkU3RhdGVtZW50cyhzdGF0ZW1lbnQpO1xuXG4gICAgICAvLyBXZSBtaWdodCBzcGxpdCB0aGlzIHN0YXRlbWVudCBvZmYgaW50byBhIGRpZmZlcmVudCBwb2xpY3ksIHNvIHdlJ2xsIG5lZWQgdG9cbiAgICAgIC8vIGxhdGUtYmluZCB0aGUgZGVwZW5kYWJsZS5cbiAgICAgIGNvbnN0IHBvbGljeURlcGVuZGFibGUgPSBuZXcgRGVwZW5kZW5jeUdyb3VwKCk7XG4gICAgICB0aGlzLmRlcGVuZGFibGVzLnNldChzdGF0ZW1lbnQsIHBvbGljeURlcGVuZGFibGUpO1xuXG4gICAgICByZXR1cm4geyBzdGF0ZW1lbnRBZGRlZDogdHJ1ZSwgcG9saWN5RGVwZW5kYWJsZSB9O1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhZGRUb1BvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9wcmVjcmVhdGVkUm9sZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3ByZWNyZWF0ZWRSb2xlLmFkZFRvUG9saWN5KHN0YXRlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudCkuc3RhdGVtZW50QWRkZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIGEgbWFuYWdlZCBwb2xpY3kgdG8gdGhpcyByb2xlLlxuICAgKiBAcGFyYW0gcG9saWN5IFRoZSB0aGUgbWFuYWdlZCBwb2xpY3kgdG8gYXR0YWNoLlxuICAgKi9cbiAgcHVibGljIGFkZE1hbmFnZWRQb2xpY3kocG9saWN5OiBJTWFuYWdlZFBvbGljeSkge1xuICAgIGlmICh0aGlzLl9wcmVjcmVhdGVkUm9sZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3ByZWNyZWF0ZWRSb2xlLmFkZE1hbmFnZWRQb2xpY3kocG9saWN5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMubWFuYWdlZFBvbGljaWVzLmZpbmQobXAgPT4gbXAgPT09IHBvbGljeSkpIHsgcmV0dXJuOyB9XG4gICAgICB0aGlzLm1hbmFnZWRQb2xpY2llcy5wdXNoKHBvbGljeSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIGEgcG9saWN5IHRvIHRoaXMgcm9sZS5cbiAgICogQHBhcmFtIHBvbGljeSBUaGUgcG9saWN5IHRvIGF0dGFjaFxuICAgKi9cbiAgcHVibGljIGF0dGFjaElubGluZVBvbGljeShwb2xpY3k6IFBvbGljeSkge1xuICAgIGlmICh0aGlzLl9wcmVjcmVhdGVkUm9sZSkge1xuICAgICAgdGhpcy5fcHJlY3JlYXRlZFJvbGUuYXR0YWNoSW5saW5lUG9saWN5KHBvbGljeSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXR0YWNoZWRQb2xpY2llcy5hdHRhY2gocG9saWN5KTtcbiAgICAgIHBvbGljeS5hdHRhY2hUb1JvbGUodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBhY3Rpb25zIGRlZmluZWQgaW4gYWN0aW9ucyB0byB0aGUgaWRlbnRpdHkgUHJpbmNpcGFsIG9uIHRoaXMgcmVzb3VyY2UuXG4gICAqL1xuICBwdWJsaWMgZ3JhbnQoZ3JhbnRlZTogSVByaW5jaXBhbCwgLi4uYWN0aW9uczogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgZ3JhbnRlZSxcbiAgICAgIGFjdGlvbnMsXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLnJvbGVBcm5dLFxuICAgICAgc2NvcGU6IHRoaXMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR3JhbnQgcGVybWlzc2lvbnMgdG8gdGhlIGdpdmVuIHByaW5jaXBhbCB0byBwYXNzIHRoaXMgcm9sZS5cbiAgICovXG4gIHB1YmxpYyBncmFudFBhc3NSb2xlKGlkZW50aXR5OiBJUHJpbmNpcGFsKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbnQoaWRlbnRpdHksICdpYW06UGFzc1JvbGUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCBwZXJtaXNzaW9ucyB0byB0aGUgZ2l2ZW4gcHJpbmNpcGFsIHRvIGFzc3VtZSB0aGlzIHJvbGUuXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRBc3N1bWVSb2xlKGlkZW50aXR5OiBJUHJpbmNpcGFsKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbnQoaWRlbnRpdHksICdzdHM6QXNzdW1lUm9sZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHN0YWJsZSBhbmQgdW5pcXVlIHN0cmluZyBpZGVudGlmeWluZyB0aGUgcm9sZS4gRm9yIGV4YW1wbGUsXG4gICAqIEFJREFKUUFCTFpTNEEzUURVNTc2US5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIGdldCByb2xlSWQoKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMuX3JvbGVJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcInJvbGVJZFwiIGlzIG5vdCBhdmFpbGFibGUgb24gcHJlY3JlYXRlZCByb2xlcycpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcm9sZUlkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIGNvcHkgb2YgdGhpcyBSb2xlIG9iamVjdCB3aG9zZSBQb2xpY2llcyB3aWxsIG5vdCBiZSB1cGRhdGVkXG4gICAqXG4gICAqIFVzZSB0aGUgb2JqZWN0IHJldHVybmVkIGJ5IHRoaXMgbWV0aG9kIGlmIHlvdSB3YW50IHRoaXMgUm9sZSB0byBiZSB1c2VkIGJ5XG4gICAqIGEgY29uc3RydWN0IHdpdGhvdXQgaXQgYXV0b21hdGljYWxseSB1cGRhdGluZyB0aGUgUm9sZSdzIFBvbGljaWVzLlxuICAgKlxuICAgKiBJZiB5b3UgZG8sIHlvdSBhcmUgcmVzcG9uc2libGUgZm9yIGFkZGluZyB0aGUgY29ycmVjdCBzdGF0ZW1lbnRzIHRvIHRoZVxuICAgKiBSb2xlJ3MgcG9saWNpZXMgeW91cnNlbGYuXG4gICAqL1xuICBwdWJsaWMgd2l0aG91dFBvbGljeVVwZGF0ZXMob3B0aW9uczogV2l0aG91dFBvbGljeVVwZGF0ZXNPcHRpb25zID0ge30pOiBJUm9sZSB7XG4gICAgaWYgKCF0aGlzLmltbXV0YWJsZVJvbGUpIHtcbiAgICAgIHRoaXMuaW1tdXRhYmxlUm9sZSA9IG5ldyBJbW11dGFibGVSb2xlKE5vZGUub2YodGhpcykuc2NvcGUgYXMgQ29uc3RydWN0LCBgSW1tdXRhYmxlUm9sZSR7dGhpcy5ub2RlLmlkfWAsIHRoaXMsIG9wdGlvbnMuYWRkR3JhbnRzVG9SZXNvdXJjZXMgPz8gZmFsc2UpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmltbXV0YWJsZVJvbGU7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlUm9sZSgpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgZXJyb3JzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgICBlcnJvcnMucHVzaCguLi50aGlzLmFzc3VtZVJvbGVQb2xpY3k/LnZhbGlkYXRlRm9yUmVzb3VyY2VQb2xpY3koKSA/PyBbXSk7XG4gICAgZm9yIChjb25zdCBwb2xpY3kgb2YgT2JqZWN0LnZhbHVlcyh0aGlzLmlubGluZVBvbGljaWVzKSkge1xuICAgICAgZXJyb3JzLnB1c2goLi4ucG9saWN5LnZhbGlkYXRlRm9ySWRlbnRpdHlQb2xpY3koKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVycm9ycztcbiAgfVxuXG4gIC8qKlxuICAgKiBTcGxpdCBsYXJnZSBpbmxpbmUgcG9saWNpZXMgaW50byBtYW5hZ2VkIHBvbGljaWVzXG4gICAqXG4gICAqIFRoaXMgZ2V0cyBhcm91bmQgdGhlIDEwayBieXRlcyBsaW1pdCBvbiByb2xlIHBvbGljaWVzLlxuICAgKi9cbiAgcHJpdmF0ZSBzcGxpdExhcmdlUG9saWN5KCkge1xuICAgIGlmICghdGhpcy5kZWZhdWx0UG9saWN5IHx8IHRoaXMuX2RpZFNwbGl0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2RpZFNwbGl0ID0gdHJ1ZTtcblxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IG9yaWdpbmFsRG9jID0gdGhpcy5kZWZhdWx0UG9saWN5LmRvY3VtZW50O1xuXG4gICAgY29uc3Qgc3BsaXRPZmZEb2NzID0gb3JpZ2luYWxEb2MuX3NwbGl0RG9jdW1lbnQodGhpcywgTUFYX0lOTElORV9TSVpFLCBNQVhfTUFOQUdFRFBPTF9TSVpFKTtcbiAgICAvLyBJbmNsdWRlcyB0aGUgXCJjdXJyZW50XCIgZG9jdW1lbnRcblxuICAgIGNvbnN0IG1wQ291bnQgPSB0aGlzLm1hbmFnZWRQb2xpY2llcy5sZW5ndGggKyAoc3BsaXRPZmZEb2NzLnNpemUgLSAxKTtcbiAgICBpZiAobXBDb3VudCA+IDIwKSB7XG4gICAgICBBbm5vdGF0aW9ucy5vZih0aGlzKS5hZGRXYXJuaW5nKGBQb2xpY3kgdG9vIGxhcmdlOiAke21wQ291bnR9IGV4Y2VlZHMgdGhlIG1heGltdW0gb2YgMjAgbWFuYWdlZCBwb2xpY2llcyBhdHRhY2hlZCB0byBhIFJvbGVgKTtcbiAgICB9IGVsc2UgaWYgKG1wQ291bnQgPiAxMCkge1xuICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZyhgUG9saWN5IGxhcmdlOiAke21wQ291bnR9IGV4Y2VlZHMgMTAgbWFuYWdlZCBwb2xpY2llcyBhdHRhY2hlZCB0byBhIFJvbGUsIHRoaXMgcmVxdWlyZXMgYSBxdW90YSBpbmNyZWFzZWApO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSB0aGUgbWFuYWdlZCBwb2xpY2llcyBhbmQgZml4IHVwIHRoZSBkZXBlbmRlbmNpZXNcbiAgICBtYXJrRGVjbGFyaW5nQ29uc3RydWN0KG9yaWdpbmFsRG9jLCB0aGlzLmRlZmF1bHRQb2xpY3kpO1xuXG4gICAgbGV0IGkgPSAxO1xuICAgIGZvciAoY29uc3QgbmV3RG9jIG9mIHNwbGl0T2ZmRG9jcy5rZXlzKCkpIHtcbiAgICAgIGlmIChuZXdEb2MgPT09IG9yaWdpbmFsRG9jKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIGNvbnN0IG1wID0gbmV3IE1hbmFnZWRQb2xpY3kodGhpcywgYE92ZXJmbG93UG9saWN5JHtpKyt9YCwge1xuICAgICAgICBkZXNjcmlwdGlvbjogYFBhcnQgb2YgdGhlIHBvbGljaWVzIGZvciAke3RoaXMubm9kZS5wYXRofWAsXG4gICAgICAgIGRvY3VtZW50OiBuZXdEb2MsXG4gICAgICAgIHJvbGVzOiBbdGhpc10sXG4gICAgICB9KTtcbiAgICAgIG1hcmtEZWNsYXJpbmdDb25zdHJ1Y3QobmV3RG9jLCBtcCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSBEZXBlbmRhYmxlcyBmb3IgdGhlIHN0YXRlbWVudHMgaW4gdGhlIGdpdmVuIFBvbGljeURvY3VtZW50IHRvIHBvaW50IHRvIHRoZSBhY3R1YWwgZGVjbGFyaW5nIGNvbnN0cnVjdFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1hcmtEZWNsYXJpbmdDb25zdHJ1Y3QoZG9jOiBQb2xpY3lEb2N1bWVudCwgZGVjbGFyaW5nQ29uc3RydWN0OiBJQ29uc3RydWN0KSB7XG4gICAgICBmb3IgKGNvbnN0IG9yaWdpbmFsIG9mIHNwbGl0T2ZmRG9jcy5nZXQoZG9jKSA/PyBbXSkge1xuICAgICAgICBzZWxmLmRlcGVuZGFibGVzLmdldChvcmlnaW5hbCk/LmFkZChkZWNsYXJpbmdDb25zdHJ1Y3QpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gY29uZmlndXJhdGlvbiBmb3IgcHJlY3JlYXRlZCByb2xlc1xuICAgKi9cbiAgcHJpdmF0ZSBnZXRQcmVjcmVhdGVkUm9sZUNvbmZpZygpOiBDdXN0b21pemVSb2xlQ29uZmlnIHtcbiAgICByZXR1cm4gZ2V0UHJlY3JlYXRlZFJvbGVDb25maWcodGhpcyk7XG4gIH1cblxufVxuXG4vKipcbiAqIEEgUm9sZSBvYmplY3RcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJUm9sZSBleHRlbmRzIElJZGVudGl0eSB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBBUk4gb2YgdGhpcyByb2xlLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSByb2xlQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG5hbWUgb2YgdGhpcyByb2xlLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSByb2xlTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBHcmFudCB0aGUgYWN0aW9ucyBkZWZpbmVkIGluIGFjdGlvbnMgdG8gdGhlIGlkZW50aXR5IFByaW5jaXBhbCBvbiB0aGlzIHJlc291cmNlLlxuICAgKi9cbiAgZ3JhbnQoZ3JhbnRlZTogSVByaW5jaXBhbCwgLi4uYWN0aW9uczogc3RyaW5nW10pOiBHcmFudDtcblxuICAvKipcbiAgICogR3JhbnQgcGVybWlzc2lvbnMgdG8gdGhlIGdpdmVuIHByaW5jaXBhbCB0byBwYXNzIHRoaXMgcm9sZS5cbiAgICovXG4gIGdyYW50UGFzc1JvbGUoZ3JhbnRlZTogSVByaW5jaXBhbCk6IEdyYW50O1xuXG4gIC8qKlxuICAgKiBHcmFudCBwZXJtaXNzaW9ucyB0byB0aGUgZ2l2ZW4gcHJpbmNpcGFsIHRvIGFzc3VtZSB0aGlzIHJvbGUuXG4gICAqL1xuICBncmFudEFzc3VtZVJvbGUoZ3JhbnRlZTogSVByaW5jaXBhbCk6IEdyYW50O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVBc3N1bWVSb2xlUG9saWN5KHByaW5jaXBhbDogSVByaW5jaXBhbCwgZXh0ZXJuYWxJZHM6IHN0cmluZ1tdKSB7XG4gIGNvbnN0IGFjdHVhbERvYyA9IG5ldyBQb2xpY3lEb2N1bWVudCgpO1xuXG4gIC8vIElmIHJlcXVlc3RlZCwgYWRkIGV4dGVybmFsSWRzIHRvIGV2ZXJ5IHN0YXRlbWVudCBhZGRlZCB0byB0aGlzIGRvY1xuICBjb25zdCBhZGREb2MgPSBleHRlcm5hbElkcy5sZW5ndGggPT09IDBcbiAgICA/IGFjdHVhbERvY1xuICAgIDogbmV3IE11dGF0aW5nUG9saWN5RG9jdW1lbnRBZGFwdGVyKGFjdHVhbERvYywgKHN0YXRlbWVudCkgPT4ge1xuICAgICAgc3RhdGVtZW50LmFkZENvbmRpdGlvbignU3RyaW5nRXF1YWxzJywge1xuICAgICAgICAnc3RzOkV4dGVybmFsSWQnOiBleHRlcm5hbElkcy5sZW5ndGggPT09IDEgPyBleHRlcm5hbElkc1swXSA6IGV4dGVybmFsSWRzLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gc3RhdGVtZW50O1xuICAgIH0pO1xuXG4gIGRlZmF1bHRBZGRQcmluY2lwYWxUb0Fzc3VtZVJvbGUocHJpbmNpcGFsLCBhZGREb2MpO1xuXG4gIHJldHVybiBhY3R1YWxEb2M7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlUm9sZVBhdGgocGF0aD86IHN0cmluZykge1xuICBpZiAocGF0aCA9PT0gdW5kZWZpbmVkIHx8IFRva2VuLmlzVW5yZXNvbHZlZChwYXRoKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHZhbGlkUm9sZVBhdGggPSAvXihcXC98XFwvW1xcdTAwMjEtXFx1MDA3Rl0rXFwvKSQvO1xuXG4gIGlmIChwYXRoLmxlbmd0aCA9PSAwIHx8IHBhdGgubGVuZ3RoID4gNTEyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBSb2xlIHBhdGggbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDUxMiBjaGFyYWN0ZXJzLiBUaGUgcHJvdmlkZWQgcm9sZSBwYXRoIGlzICR7cGF0aC5sZW5ndGh9IGNoYXJhY3RlcnMuYCk7XG4gIH0gZWxzZSBpZiAoIXZhbGlkUm9sZVBhdGgudGVzdChwYXRoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdSb2xlIHBhdGggbXVzdCBiZSBlaXRoZXIgYSBzbGFzaCBvciB2YWxpZCBjaGFyYWN0ZXJzIChhbHBoYW51bWVyaWNzIGFuZCBzeW1ib2xzKSBzdXJyb3VuZGVkIGJ5IHNsYXNoZXMuICdcbiAgICAgICsgYFZhbGlkIGNoYXJhY3RlcnMgYXJlIHVuaWNvZGUgY2hhcmFjdGVycyBpbiBbXFxcXHUwMDIxLVxcXFx1MDA3Rl0uIEhvd2V2ZXIsICR7cGF0aH0gaXMgcHJvdmlkZWQuYCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVNYXhTZXNzaW9uRHVyYXRpb24oZHVyYXRpb24/OiBudW1iZXIpIHtcbiAgaWYgKGR1cmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoZHVyYXRpb24gPCAzNjAwIHx8IGR1cmF0aW9uID4gNDMyMDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYG1heFNlc3Npb25EdXJhdGlvbiBpcyBzZXQgdG8gJHtkdXJhdGlvbn0sIGJ1dCBtdXN0IGJlID49IDM2MDBzZWMgKDFocikgYW5kIDw9IDQzMjAwc2VjICgxMmhycylgKTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHRoZSBgd2l0aG91dFBvbGljeVVwZGF0ZXMoKWAgbW9kaWZpZXIgb2YgYSBSb2xlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgV2l0aG91dFBvbGljeVVwZGF0ZXNPcHRpb25zIHtcbiAgLyoqXG4gICAqIEFkZCBncmFudHMgdG8gcmVzb3VyY2VzIGluc3RlYWQgb2YgZHJvcHBpbmcgdGhlbVxuICAgKlxuICAgKiBJZiB0aGlzIGlzIGBmYWxzZWAgb3Igbm90IHNwZWNpZmllZCwgZ3JhbnQgcGVybWlzc2lvbnMgYWRkZWQgdG8gdGhpcyByb2xlIGFyZSBpZ25vcmVkLlxuICAgKiBJdCBpcyB5b3VyIG93biByZXNwb25zaWJpbGl0eSB0byBtYWtlIHN1cmUgdGhlIHJvbGUgaGFzIHRoZSByZXF1aXJlZCBwZXJtaXNzaW9ucy5cbiAgICpcbiAgICogSWYgdGhpcyBpcyBgdHJ1ZWAsIGFueSBncmFudCBwZXJtaXNzaW9ucyB3aWxsIGJlIGFkZGVkIHRvIHRoZSByZXNvdXJjZSBpbnN0ZWFkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgYWRkR3JhbnRzVG9SZXNvdXJjZXM/OiBib29sZWFuO1xufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUm9sZS5wcm90b3R5cGUsIElBTV9ST0xFX1NZTUJPTCwge1xuICB2YWx1ZTogdHJ1ZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiBmYWxzZSxcbn0pOyJdfQ==