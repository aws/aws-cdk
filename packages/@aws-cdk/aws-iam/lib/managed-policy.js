"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagedPolicy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const helpers_internal_1 = require("@aws-cdk/core/lib/helpers-internal");
const iam_generated_1 = require("./iam.generated");
const policy_document_1 = require("./policy-document");
const util_1 = require("./private/util");
/**
 * Managed policy
 *
 */
class ManagedPolicy extends core_1.Resource {
    /**
     * Import a customer managed policy from the managedPolicyName.
     *
     * For this managed policy, you only need to know the name to be able to use it.
     *
     */
    static fromManagedPolicyName(scope, id, managedPolicyName) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.managedPolicyArn = core_1.Stack.of(scope).formatArn({
                    service: 'iam',
                    region: '',
                    account: core_1.Stack.of(scope).account,
                    resource: 'policy',
                    resourceName: managedPolicyName,
                });
            }
        }
        return new Import(scope, id);
    }
    /**
     * Import an external managed policy by ARN.
     *
     * For this managed policy, you only need to know the ARN to be able to use it.
     * This can be useful if you got the ARN from a CloudFormation Export.
     *
     * If the imported Managed Policy ARN is a Token (such as a
     * `CfnParameter.valueAsString` or a `Fn.importValue()`) *and* the referenced
     * managed policy has a `path` (like `arn:...:policy/AdminPolicy/AdminAllow`), the
     * `managedPolicyName` property will not resolve to the correct value. Instead it
     * will resolve to the first path component. We unfortunately cannot express
     * the correct calculation of the full path name as a CloudFormation
     * expression. In this scenario the Managed Policy ARN should be supplied without the
     * `path` in order to resolve the correct managed policy resource.
     *
     * @param scope construct scope
     * @param id construct id
     * @param managedPolicyArn the ARN of the managed policy to import
     */
    static fromManagedPolicyArn(scope, id, managedPolicyArn) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.managedPolicyArn = managedPolicyArn;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Import a managed policy from one of the policies that AWS manages.
     *
     * For this managed policy, you only need to know the name to be able to use it.
     *
     * Some managed policy names start with "service-role/", some start with
     * "job-function/", and some don't start with anything. Include the
     * prefix when constructing this object.
     */
    static fromAwsManagedPolicyName(managedPolicyName) {
        class AwsManagedPolicy {
            constructor() {
                this.managedPolicyArn = core_1.Arn.format({
                    partition: core_1.Aws.PARTITION,
                    service: 'iam',
                    region: '',
                    account: 'aws',
                    resource: 'policy',
                    resourceName: managedPolicyName,
                });
            }
        }
        return new AwsManagedPolicy();
    }
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.managedPolicyName,
        });
        /**
         * The policy document.
         */
        this.document = new policy_document_1.PolicyDocument();
        this.roles = new Array();
        this.users = new Array();
        this.groups = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_ManagedPolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ManagedPolicy);
            }
            throw error;
        }
        this.description = props.description || '';
        this.path = props.path || '/';
        if (props.document) {
            this.document = props.document;
        }
        const config = (0, helpers_internal_1.getCustomizeRolesConfig)(this);
        const _precreatedPolicy = ManagedPolicy.fromManagedPolicyName(this, 'Imported' + id, id);
        this.managedPolicyName = id;
        this.managedPolicyArn = _precreatedPolicy.managedPolicyArn;
        if (config.enabled) {
            this._precreatedPolicy = _precreatedPolicy;
        }
        if (!config.preventSynthesis) {
            const resource = new iam_generated_1.CfnManagedPolicy(this, 'Resource', {
                policyDocument: this.document,
                managedPolicyName: this.physicalName,
                description: this.description,
                path: this.path,
                roles: (0, util_1.undefinedIfEmpty)(() => this.roles.map(r => r.roleName)),
                users: (0, util_1.undefinedIfEmpty)(() => this.users.map(u => u.userName)),
                groups: (0, util_1.undefinedIfEmpty)(() => this.groups.map(g => g.groupName)),
            });
            // arn:aws:iam::123456789012:policy/teststack-CreateTestDBPolicy-16M23YE3CS700
            this.managedPolicyName = this.getResourceNameAttribute(core_1.Stack.of(this).splitArn(resource.ref, core_1.ArnFormat.SLASH_RESOURCE_NAME).resourceName);
            this.managedPolicyArn = this.getResourceArnAttribute(resource.ref, {
                region: '',
                service: 'iam',
                resource: 'policy',
                resourceName: this.physicalName,
            });
        }
        if (props.users) {
            props.users.forEach(u => this.attachToUser(u));
        }
        if (props.groups) {
            props.groups.forEach(g => this.attachToGroup(g));
        }
        if (props.roles) {
            props.roles.forEach(r => this.attachToRole(r));
        }
        if (props.statements) {
            props.statements.forEach(p => this.addStatements(p));
        }
        this.grantPrincipal = new ManagedPolicyGrantPrincipal(this);
        this.node.addValidation({ validate: () => this.validateManagedPolicy() });
    }
    /**
     * Adds a statement to the policy document.
     */
    addStatements(...statement) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_PolicyStatement(statement);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addStatements);
            }
            throw error;
        }
        this.document.addStatements(...statement);
    }
    /**
     * Attaches this policy to a user.
     */
    attachToUser(user) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IUser(user);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.attachToUser);
            }
            throw error;
        }
        if (this.users.find(u => u === user)) {
            return;
        }
        this.users.push(user);
    }
    /**
     * Attaches this policy to a role.
     */
    attachToRole(role) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IRole(role);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.attachToRole);
            }
            throw error;
        }
        if (this.roles.find(r => r === role)) {
            return;
        }
        this.roles.push(role);
    }
    /**
     * Attaches this policy to a group.
     */
    attachToGroup(group) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IGroup(group);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.attachToGroup);
            }
            throw error;
        }
        if (this.groups.find(g => g === group)) {
            return;
        }
        this.groups.push(group);
    }
    validateManagedPolicy() {
        const result = new Array();
        // validate that the policy document is not empty
        if (this.document.isEmpty) {
            result.push('Managed Policy is empty. You must add statements to the policy');
        }
        result.push(...this.document.validateForIdentityPolicy());
        if (result.length === 0 && this._precreatedPolicy) {
            helpers_internal_1.PolicySynthesizer.getOrCreate(this).addManagedPolicy(this.node.path, {
                policyStatements: this.document.toJSON()?.Statement,
                roles: this.roles.map(role => role.node.path),
            });
        }
        return result;
    }
}
_a = JSII_RTTI_SYMBOL_1;
ManagedPolicy[_a] = { fqn: "@aws-cdk/aws-iam.ManagedPolicy", version: "0.0.0" };
exports.ManagedPolicy = ManagedPolicy;
class ManagedPolicyGrantPrincipal {
    constructor(_managedPolicy) {
        this._managedPolicy = _managedPolicy;
        this.assumeRoleAction = 'sts:AssumeRole';
        this.grantPrincipal = this;
        this.principalAccount = _managedPolicy.env.account;
    }
    get policyFragment() {
        // This property is referenced to add policy statements as a resource-based policy.
        // We should fail because a managed policy cannot be used as a principal of a policy document.
        // cf. https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html#Principal_specifying
        throw new Error(`Cannot use a ManagedPolicy '${this._managedPolicy.node.path}' as the 'Principal' or 'NotPrincipal' in an IAM Policy`);
    }
    addToPolicy(statement) {
        return this.addToPrincipalPolicy(statement).statementAdded;
    }
    addToPrincipalPolicy(statement) {
        this._managedPolicy.addStatements(statement);
        return { statementAdded: true, policyDependable: this._managedPolicy };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlZC1wb2xpY3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYW5hZ2VkLXBvbGljeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBcUU7QUFDckUseUVBQWdHO0FBR2hHLG1EQUFtRDtBQUNuRCx1REFBbUQ7QUFHbkQseUNBQWtEO0FBMkZsRDs7O0dBR0c7QUFDSCxNQUFhLGFBQWMsU0FBUSxlQUFRO0lBQ3pDOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLHFCQUFxQixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLGlCQUF5QjtRQUN6RixNQUFNLE1BQU8sU0FBUSxlQUFRO1lBQTdCOztnQkFDa0IscUJBQWdCLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUM7b0JBQzNELE9BQU8sRUFBRSxLQUFLO29CQUNkLE1BQU0sRUFBRSxFQUFFO29CQUNWLE9BQU8sRUFBRSxZQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU87b0JBQ2hDLFFBQVEsRUFBRSxRQUFRO29CQUNsQixZQUFZLEVBQUUsaUJBQWlCO2lCQUNoQyxDQUFDLENBQUM7WUFDTCxDQUFDO1NBQUE7UUFDRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrQkc7SUFDSSxNQUFNLENBQUMsb0JBQW9CLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsZ0JBQXdCO1FBQ3ZGLE1BQU0sTUFBTyxTQUFRLGVBQVE7WUFBN0I7O2dCQUNrQixxQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztZQUN0RCxDQUFDO1NBQUE7UUFDRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQUVEOzs7Ozs7OztPQVFHO0lBQ0ksTUFBTSxDQUFDLHdCQUF3QixDQUFDLGlCQUF5QjtRQUM5RCxNQUFN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QUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUN4RTtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXJuRm9ybWF0LCBSZXNvdXJjZSwgU3RhY2ssIEFybiwgQXdzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBnZXRDdXN0b21pemVSb2xlc0NvbmZpZywgUG9saWN5U3ludGhlc2l6ZXIgfSBmcm9tICdAYXdzLWNkay9jb3JlL2xpYi9oZWxwZXJzLWludGVybmFsJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUdyb3VwIH0gZnJvbSAnLi9ncm91cCc7XG5pbXBvcnQgeyBDZm5NYW5hZ2VkUG9saWN5IH0gZnJvbSAnLi9pYW0uZ2VuZXJhdGVkJztcbmltcG9ydCB7IFBvbGljeURvY3VtZW50IH0gZnJvbSAnLi9wb2xpY3ktZG9jdW1lbnQnO1xuaW1wb3J0IHsgUG9saWN5U3RhdGVtZW50IH0gZnJvbSAnLi9wb2xpY3ktc3RhdGVtZW50JztcbmltcG9ydCB7IEFkZFRvUHJpbmNpcGFsUG9saWN5UmVzdWx0LCBJR3JhbnRhYmxlLCBJUHJpbmNpcGFsLCBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB9IGZyb20gJy4vcHJpbmNpcGFscyc7XG5pbXBvcnQgeyB1bmRlZmluZWRJZkVtcHR5IH0gZnJvbSAnLi9wcml2YXRlL3V0aWwnO1xuaW1wb3J0IHsgSVJvbGUgfSBmcm9tICcuL3JvbGUnO1xuaW1wb3J0IHsgSVVzZXIgfSBmcm9tICcuL3VzZXInO1xuXG4vKipcbiAqIEEgbWFuYWdlZCBwb2xpY3lcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJTWFuYWdlZFBvbGljeSB7XG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBtYW5hZ2VkIHBvbGljeVxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBtYW5hZ2VkUG9saWN5QXJuOiBzdHJpbmc7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYW4gSUFNIG1hbmFnZWQgcG9saWN5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWFuYWdlZFBvbGljeVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBtYW5hZ2VkIHBvbGljeS4gSWYgeW91IHNwZWNpZnkgbXVsdGlwbGUgcG9saWNpZXMgZm9yIGFuIGVudGl0eSxcbiAgICogc3BlY2lmeSB1bmlxdWUgbmFtZXMuIEZvciBleGFtcGxlLCBpZiB5b3Ugc3BlY2lmeSBhIGxpc3Qgb2YgcG9saWNpZXMgZm9yXG4gICAqIGFuIElBTSByb2xlLCBlYWNoIHBvbGljeSBtdXN0IGhhdmUgYSB1bmlxdWUgbmFtZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIG5hbWUgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQuXG4gICAqL1xuICByZWFkb25seSBtYW5hZ2VkUG9saWN5TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogQSBkZXNjcmlwdGlvbiBvZiB0aGUgbWFuYWdlZCBwb2xpY3kuIFR5cGljYWxseSB1c2VkIHRvIHN0b3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZVxuICAgKiBwZXJtaXNzaW9ucyBkZWZpbmVkIGluIHRoZSBwb2xpY3kuIEZvciBleGFtcGxlLCBcIkdyYW50cyBhY2Nlc3MgdG8gcHJvZHVjdGlvbiBEeW5hbW9EQiB0YWJsZXMuXCJcbiAgICogVGhlIHBvbGljeSBkZXNjcmlwdGlvbiBpcyBpbW11dGFibGUuIEFmdGVyIGEgdmFsdWUgaXMgYXNzaWduZWQsIGl0IGNhbm5vdCBiZSBjaGFuZ2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGVtcHR5XG4gICAqL1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHBhdGggZm9yIHRoZSBwb2xpY3kuIFRoaXMgcGFyYW1ldGVyIGFsbG93cyAodGhyb3VnaCBpdHMgcmVnZXggcGF0dGVybikgYSBzdHJpbmcgb2YgY2hhcmFjdGVyc1xuICAgKiBjb25zaXN0aW5nIG9mIGVpdGhlciBhIGZvcndhcmQgc2xhc2ggKC8pIGJ5IGl0c2VsZiBvciBhIHN0cmluZyB0aGF0IG11c3QgYmVnaW4gYW5kIGVuZCB3aXRoIGZvcndhcmQgc2xhc2hlcy5cbiAgICogSW4gYWRkaXRpb24sIGl0IGNhbiBjb250YWluIGFueSBBU0NJSSBjaGFyYWN0ZXIgZnJvbSB0aGUgISAoXFx1MDAyMSkgdGhyb3VnaCB0aGUgREVMIGNoYXJhY3RlciAoXFx1MDA3RiksXG4gICAqIGluY2x1ZGluZyBtb3N0IHB1bmN0dWF0aW9uIGNoYXJhY3RlcnMsIGRpZ2l0cywgYW5kIHVwcGVyIGFuZCBsb3dlcmNhc2VkIGxldHRlcnMuXG4gICAqXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHBhdGhzLCBzZWUgSUFNIElkZW50aWZpZXJzIGluIHRoZSBJQU0gVXNlciBHdWlkZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBcIi9cIlxuICAgKi9cbiAgcmVhZG9ubHkgcGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogVXNlcnMgdG8gYXR0YWNoIHRoaXMgcG9saWN5IHRvLlxuICAgKiBZb3UgY2FuIGFsc28gdXNlIGBhdHRhY2hUb1VzZXIodXNlcilgIHRvIGF0dGFjaCB0aGlzIHBvbGljeSB0byBhIHVzZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gdXNlcnMuXG4gICAqL1xuICByZWFkb25seSB1c2Vycz86IElVc2VyW107XG5cbiAgLyoqXG4gICAqIFJvbGVzIHRvIGF0dGFjaCB0aGlzIHBvbGljeSB0by5cbiAgICogWW91IGNhbiBhbHNvIHVzZSBgYXR0YWNoVG9Sb2xlKHJvbGUpYCB0byBhdHRhY2ggdGhpcyBwb2xpY3kgdG8gYSByb2xlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHJvbGVzLlxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZXM/OiBJUm9sZVtdO1xuXG4gIC8qKlxuICAgKiBHcm91cHMgdG8gYXR0YWNoIHRoaXMgcG9saWN5IHRvLlxuICAgKiBZb3UgY2FuIGFsc28gdXNlIGBhdHRhY2hUb0dyb3VwKGdyb3VwKWAgdG8gYXR0YWNoIHRoaXMgcG9saWN5IHRvIGEgZ3JvdXAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZ3JvdXBzLlxuICAgKi9cbiAgcmVhZG9ubHkgZ3JvdXBzPzogSUdyb3VwW107XG5cbiAgLyoqXG4gICAqIEluaXRpYWwgc2V0IG9mIHBlcm1pc3Npb25zIHRvIGFkZCB0byB0aGlzIHBvbGljeSBkb2N1bWVudC5cbiAgICogWW91IGNhbiBhbHNvIHVzZSBgYWRkUGVybWlzc2lvbihzdGF0ZW1lbnQpYCB0byBhZGQgcGVybWlzc2lvbnMgbGF0ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gc3RhdGVtZW50cy5cbiAgICovXG4gIHJlYWRvbmx5IHN0YXRlbWVudHM/OiBQb2xpY3lTdGF0ZW1lbnRbXTtcblxuICAvKipcbiAgICogSW5pdGlhbCBQb2xpY3lEb2N1bWVudCB0byB1c2UgZm9yIHRoaXMgTWFuYWdlZFBvbGljeS4gSWYgb21pdGVkLCBhbnlcbiAgICogYFBvbGljeVN0YXRlbWVudGAgcHJvdmlkZWQgaW4gdGhlIGBzdGF0ZW1lbnRzYCBwcm9wZXJ0eSB3aWxsIGJlIGFwcGxpZWRcbiAgICogYWdhaW5zdCB0aGUgZW1wdHkgZGVmYXVsdCBgUG9saWN5RG9jdW1lbnRgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFuIGVtcHR5IHBvbGljeS5cbiAgICovXG4gIHJlYWRvbmx5IGRvY3VtZW50PzogUG9saWN5RG9jdW1lbnQ7XG59XG5cbi8qKlxuICogTWFuYWdlZCBwb2xpY3lcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBNYW5hZ2VkUG9saWN5IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJTWFuYWdlZFBvbGljeSwgSUdyYW50YWJsZSB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYSBjdXN0b21lciBtYW5hZ2VkIHBvbGljeSBmcm9tIHRoZSBtYW5hZ2VkUG9saWN5TmFtZS5cbiAgICpcbiAgICogRm9yIHRoaXMgbWFuYWdlZCBwb2xpY3ksIHlvdSBvbmx5IG5lZWQgdG8ga25vdyB0aGUgbmFtZSB0byBiZSBhYmxlIHRvIHVzZSBpdC5cbiAgICpcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbU1hbmFnZWRQb2xpY3lOYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIG1hbmFnZWRQb2xpY3lOYW1lOiBzdHJpbmcpOiBJTWFuYWdlZFBvbGljeSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJTWFuYWdlZFBvbGljeSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbWFuYWdlZFBvbGljeUFybiA9IFN0YWNrLm9mKHNjb3BlKS5mb3JtYXRBcm4oe1xuICAgICAgICBzZXJ2aWNlOiAnaWFtJyxcbiAgICAgICAgcmVnaW9uOiAnJywgLy8gbm8gcmVnaW9uIGZvciBtYW5hZ2VkIHBvbGljeVxuICAgICAgICBhY2NvdW50OiBTdGFjay5vZihzY29wZSkuYWNjb3VudCwgLy8gQ2FuIHRoaXMgYmUgc29tZXRoaW5nIHRoZSB1c2VyIHNwZWNpZmllcz9cbiAgICAgICAgcmVzb3VyY2U6ICdwb2xpY3knLFxuICAgICAgICByZXNvdXJjZU5hbWU6IG1hbmFnZWRQb2xpY3lOYW1lLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4dGVybmFsIG1hbmFnZWQgcG9saWN5IGJ5IEFSTi5cbiAgICpcbiAgICogRm9yIHRoaXMgbWFuYWdlZCBwb2xpY3ksIHlvdSBvbmx5IG5lZWQgdG8ga25vdyB0aGUgQVJOIHRvIGJlIGFibGUgdG8gdXNlIGl0LlxuICAgKiBUaGlzIGNhbiBiZSB1c2VmdWwgaWYgeW91IGdvdCB0aGUgQVJOIGZyb20gYSBDbG91ZEZvcm1hdGlvbiBFeHBvcnQuXG4gICAqXG4gICAqIElmIHRoZSBpbXBvcnRlZCBNYW5hZ2VkIFBvbGljeSBBUk4gaXMgYSBUb2tlbiAoc3VjaCBhcyBhXG4gICAqIGBDZm5QYXJhbWV0ZXIudmFsdWVBc1N0cmluZ2Agb3IgYSBgRm4uaW1wb3J0VmFsdWUoKWApICphbmQqIHRoZSByZWZlcmVuY2VkXG4gICAqIG1hbmFnZWQgcG9saWN5IGhhcyBhIGBwYXRoYCAobGlrZSBgYXJuOi4uLjpwb2xpY3kvQWRtaW5Qb2xpY3kvQWRtaW5BbGxvd2ApLCB0aGVcbiAgICogYG1hbmFnZWRQb2xpY3lOYW1lYCBwcm9wZXJ0eSB3aWxsIG5vdCByZXNvbHZlIHRvIHRoZSBjb3JyZWN0IHZhbHVlLiBJbnN0ZWFkIGl0XG4gICAqIHdpbGwgcmVzb2x2ZSB0byB0aGUgZmlyc3QgcGF0aCBjb21wb25lbnQuIFdlIHVuZm9ydHVuYXRlbHkgY2Fubm90IGV4cHJlc3NcbiAgICogdGhlIGNvcnJlY3QgY2FsY3VsYXRpb24gb2YgdGhlIGZ1bGwgcGF0aCBuYW1lIGFzIGEgQ2xvdWRGb3JtYXRpb25cbiAgICogZXhwcmVzc2lvbi4gSW4gdGhpcyBzY2VuYXJpbyB0aGUgTWFuYWdlZCBQb2xpY3kgQVJOIHNob3VsZCBiZSBzdXBwbGllZCB3aXRob3V0IHRoZVxuICAgKiBgcGF0aGAgaW4gb3JkZXIgdG8gcmVzb2x2ZSB0aGUgY29ycmVjdCBtYW5hZ2VkIHBvbGljeSByZXNvdXJjZS5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIGNvbnN0cnVjdCBzY29wZVxuICAgKiBAcGFyYW0gaWQgY29uc3RydWN0IGlkXG4gICAqIEBwYXJhbSBtYW5hZ2VkUG9saWN5QXJuIHRoZSBBUk4gb2YgdGhlIG1hbmFnZWQgcG9saWN5IHRvIGltcG9ydFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTWFuYWdlZFBvbGljeUFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBtYW5hZ2VkUG9saWN5QXJuOiBzdHJpbmcpOiBJTWFuYWdlZFBvbGljeSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJTWFuYWdlZFBvbGljeSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbWFuYWdlZFBvbGljeUFybiA9IG1hbmFnZWRQb2xpY3lBcm47XG4gICAgfVxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGEgbWFuYWdlZCBwb2xpY3kgZnJvbSBvbmUgb2YgdGhlIHBvbGljaWVzIHRoYXQgQVdTIG1hbmFnZXMuXG4gICAqXG4gICAqIEZvciB0aGlzIG1hbmFnZWQgcG9saWN5LCB5b3Ugb25seSBuZWVkIHRvIGtub3cgdGhlIG5hbWUgdG8gYmUgYWJsZSB0byB1c2UgaXQuXG4gICAqXG4gICAqIFNvbWUgbWFuYWdlZCBwb2xpY3kgbmFtZXMgc3RhcnQgd2l0aCBcInNlcnZpY2Utcm9sZS9cIiwgc29tZSBzdGFydCB3aXRoXG4gICAqIFwiam9iLWZ1bmN0aW9uL1wiLCBhbmQgc29tZSBkb24ndCBzdGFydCB3aXRoIGFueXRoaW5nLiBJbmNsdWRlIHRoZVxuICAgKiBwcmVmaXggd2hlbiBjb25zdHJ1Y3RpbmcgdGhpcyBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZShtYW5hZ2VkUG9saWN5TmFtZTogc3RyaW5nKTogSU1hbmFnZWRQb2xpY3kge1xuICAgIGNsYXNzIEF3c01hbmFnZWRQb2xpY3kgaW1wbGVtZW50cyBJTWFuYWdlZFBvbGljeSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbWFuYWdlZFBvbGljeUFybiA9IEFybi5mb3JtYXQoe1xuICAgICAgICBwYXJ0aXRpb246IEF3cy5QQVJUSVRJT04sXG4gICAgICAgIHNlcnZpY2U6ICdpYW0nLFxuICAgICAgICByZWdpb246ICcnLCAvLyBubyByZWdpb24gZm9yIG1hbmFnZWQgcG9saWN5XG4gICAgICAgIGFjY291bnQ6ICdhd3MnLCAvLyB0aGUgYWNjb3VudCBmb3IgYSBtYW5hZ2VkIHBvbGljeSBpcyAnYXdzJ1xuICAgICAgICByZXNvdXJjZTogJ3BvbGljeScsXG4gICAgICAgIHJlc291cmNlTmFtZTogbWFuYWdlZFBvbGljeU5hbWUsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBBd3NNYW5hZ2VkUG9saWN5KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgQVJOIG9mIHRoaXMgbWFuYWdlZCBwb2xpY3kuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBtYW5hZ2VkUG9saWN5QXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwb2xpY3kgZG9jdW1lbnQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZG9jdW1lbnQgPSBuZXcgUG9saWN5RG9jdW1lbnQoKTtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhpcyBwb2xpY3kuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBtYW5hZ2VkUG9saWN5TmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhpcyBwb2xpY3kuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZXNjcmlwdGlvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCBvZiB0aGlzIHBvbGljeS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHBhdGg6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IElQcmluY2lwYWw7XG5cbiAgcHJpdmF0ZSByZWFkb25seSByb2xlcyA9IG5ldyBBcnJheTxJUm9sZT4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSB1c2VycyA9IG5ldyBBcnJheTxJVXNlcj4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBncm91cHMgPSBuZXcgQXJyYXk8SUdyb3VwPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9wcmVjcmVhdGVkUG9saWN5PzogSU1hbmFnZWRQb2xpY3k7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE1hbmFnZWRQb2xpY3lQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLm1hbmFnZWRQb2xpY3lOYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IHByb3BzLmRlc2NyaXB0aW9uIHx8ICcnO1xuICAgIHRoaXMucGF0aCA9IHByb3BzLnBhdGggfHwgJy8nO1xuXG4gICAgaWYgKHByb3BzLmRvY3VtZW50KSB7XG4gICAgICB0aGlzLmRvY3VtZW50ID0gcHJvcHMuZG9jdW1lbnQ7XG4gICAgfVxuXG4gICAgY29uc3QgY29uZmlnID0gZ2V0Q3VzdG9taXplUm9sZXNDb25maWcodGhpcyk7XG4gICAgY29uc3QgX3ByZWNyZWF0ZWRQb2xpY3kgPSBNYW5hZ2VkUG9saWN5LmZyb21NYW5hZ2VkUG9saWN5TmFtZSh0aGlzLCAnSW1wb3J0ZWQnK2lkLCBpZCk7XG4gICAgdGhpcy5tYW5hZ2VkUG9saWN5TmFtZSA9IGlkO1xuICAgIHRoaXMubWFuYWdlZFBvbGljeUFybiA9IF9wcmVjcmVhdGVkUG9saWN5Lm1hbmFnZWRQb2xpY3lBcm47XG4gICAgaWYgKGNvbmZpZy5lbmFibGVkKSB7XG4gICAgICB0aGlzLl9wcmVjcmVhdGVkUG9saWN5ID0gX3ByZWNyZWF0ZWRQb2xpY3k7XG4gICAgfVxuICAgIGlmICghY29uZmlnLnByZXZlbnRTeW50aGVzaXMpIHtcbiAgICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbk1hbmFnZWRQb2xpY3kodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgICBwb2xpY3lEb2N1bWVudDogdGhpcy5kb2N1bWVudCxcbiAgICAgICAgbWFuYWdlZFBvbGljeU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgICAgcGF0aDogdGhpcy5wYXRoLFxuICAgICAgICByb2xlczogdW5kZWZpbmVkSWZFbXB0eSgoKSA9PiB0aGlzLnJvbGVzLm1hcChyID0+IHIucm9sZU5hbWUpKSxcbiAgICAgICAgdXNlcnM6IHVuZGVmaW5lZElmRW1wdHkoKCkgPT4gdGhpcy51c2Vycy5tYXAodSA9PiB1LnVzZXJOYW1lKSksXG4gICAgICAgIGdyb3VwczogdW5kZWZpbmVkSWZFbXB0eSgoKSA9PiB0aGlzLmdyb3Vwcy5tYXAoZyA9PiBnLmdyb3VwTmFtZSkpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIGFybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6cG9saWN5L3Rlc3RzdGFjay1DcmVhdGVUZXN0REJQb2xpY3ktMTZNMjNZRTNDUzcwMFxuICAgICAgdGhpcy5tYW5hZ2VkUG9saWN5TmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKFN0YWNrLm9mKHRoaXMpLnNwbGl0QXJuKHJlc291cmNlLnJlZiwgQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUpLnJlc291cmNlTmFtZSEpO1xuICAgICAgdGhpcy5tYW5hZ2VkUG9saWN5QXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZShyZXNvdXJjZS5yZWYsIHtcbiAgICAgICAgcmVnaW9uOiAnJywgLy8gSUFNIGlzIGdsb2JhbCBpbiBlYWNoIHBhcnRpdGlvblxuICAgICAgICBzZXJ2aWNlOiAnaWFtJyxcbiAgICAgICAgcmVzb3VyY2U6ICdwb2xpY3knLFxuICAgICAgICByZXNvdXJjZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnVzZXJzKSB7XG4gICAgICBwcm9wcy51c2Vycy5mb3JFYWNoKHUgPT4gdGhpcy5hdHRhY2hUb1VzZXIodSkpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5ncm91cHMpIHtcbiAgICAgIHByb3BzLmdyb3Vwcy5mb3JFYWNoKGcgPT4gdGhpcy5hdHRhY2hUb0dyb3VwKGcpKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMucm9sZXMpIHtcbiAgICAgIHByb3BzLnJvbGVzLmZvckVhY2gociA9PiB0aGlzLmF0dGFjaFRvUm9sZShyKSk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnN0YXRlbWVudHMpIHtcbiAgICAgIHByb3BzLnN0YXRlbWVudHMuZm9yRWFjaChwID0+IHRoaXMuYWRkU3RhdGVtZW50cyhwKSk7XG4gICAgfVxuXG4gICAgdGhpcy5ncmFudFByaW5jaXBhbCA9IG5ldyBNYW5hZ2VkUG9saWN5R3JhbnRQcmluY2lwYWwodGhpcyk7XG5cbiAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiB0aGlzLnZhbGlkYXRlTWFuYWdlZFBvbGljeSgpIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBzdGF0ZW1lbnQgdG8gdGhlIHBvbGljeSBkb2N1bWVudC5cbiAgICovXG4gIHB1YmxpYyBhZGRTdGF0ZW1lbnRzKC4uLnN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50W10pIHtcbiAgICB0aGlzLmRvY3VtZW50LmFkZFN0YXRlbWVudHMoLi4uc3RhdGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGlzIHBvbGljeSB0byBhIHVzZXIuXG4gICAqL1xuICBwdWJsaWMgYXR0YWNoVG9Vc2VyKHVzZXI6IElVc2VyKSB7XG4gICAgaWYgKHRoaXMudXNlcnMuZmluZCh1ID0+IHUgPT09IHVzZXIpKSB7IHJldHVybjsgfVxuICAgIHRoaXMudXNlcnMucHVzaCh1c2VyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGlzIHBvbGljeSB0byBhIHJvbGUuXG4gICAqL1xuICBwdWJsaWMgYXR0YWNoVG9Sb2xlKHJvbGU6IElSb2xlKSB7XG4gICAgaWYgKHRoaXMucm9sZXMuZmluZChyID0+IHIgPT09IHJvbGUpKSB7IHJldHVybjsgfVxuICAgIHRoaXMucm9sZXMucHVzaChyb2xlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGlzIHBvbGljeSB0byBhIGdyb3VwLlxuICAgKi9cbiAgcHVibGljIGF0dGFjaFRvR3JvdXAoZ3JvdXA6IElHcm91cCkge1xuICAgIGlmICh0aGlzLmdyb3Vwcy5maW5kKGcgPT4gZyA9PT0gZ3JvdXApKSB7IHJldHVybjsgfVxuICAgIHRoaXMuZ3JvdXBzLnB1c2goZ3JvdXApO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZU1hbmFnZWRQb2xpY3koKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgICAvLyB2YWxpZGF0ZSB0aGF0IHRoZSBwb2xpY3kgZG9jdW1lbnQgaXMgbm90IGVtcHR5XG4gICAgaWYgKHRoaXMuZG9jdW1lbnQuaXNFbXB0eSkge1xuICAgICAgcmVzdWx0LnB1c2goJ01hbmFnZWQgUG9saWN5IGlzIGVtcHR5LiBZb3UgbXVzdCBhZGQgc3RhdGVtZW50cyB0byB0aGUgcG9saWN5Jyk7XG4gICAgfVxuXG4gICAgcmVzdWx0LnB1c2goLi4udGhpcy5kb2N1bWVudC52YWxpZGF0ZUZvcklkZW50aXR5UG9saWN5KCkpO1xuXG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPT09IDAgJiYgdGhpcy5fcHJlY3JlYXRlZFBvbGljeSkge1xuICAgICAgUG9saWN5U3ludGhlc2l6ZXIuZ2V0T3JDcmVhdGUodGhpcykuYWRkTWFuYWdlZFBvbGljeSh0aGlzLm5vZGUucGF0aCwge1xuICAgICAgICBwb2xpY3lTdGF0ZW1lbnRzOiB0aGlzLmRvY3VtZW50LnRvSlNPTigpPy5TdGF0ZW1lbnQsXG4gICAgICAgIHJvbGVzOiB0aGlzLnJvbGVzLm1hcChyb2xlID0+IHJvbGUubm9kZS5wYXRoKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmNsYXNzIE1hbmFnZWRQb2xpY3lHcmFudFByaW5jaXBhbCBpbXBsZW1lbnRzIElQcmluY2lwYWwge1xuICBwdWJsaWMgcmVhZG9ubHkgYXNzdW1lUm9sZUFjdGlvbiA9ICdzdHM6QXNzdW1lUm9sZSc7XG4gIHB1YmxpYyByZWFkb25seSBncmFudFByaW5jaXBhbDogSVByaW5jaXBhbDtcbiAgcHVibGljIHJlYWRvbmx5IHByaW5jaXBhbEFjY291bnQ/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfbWFuYWdlZFBvbGljeTogTWFuYWdlZFBvbGljeSkge1xuICAgIHRoaXMuZ3JhbnRQcmluY2lwYWwgPSB0aGlzO1xuICAgIHRoaXMucHJpbmNpcGFsQWNjb3VudCA9IF9tYW5hZ2VkUG9saWN5LmVudi5hY2NvdW50O1xuICB9XG5cbiAgcHVibGljIGdldCBwb2xpY3lGcmFnbWVudCgpOiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB7XG4gICAgLy8gVGhpcyBwcm9wZXJ0eSBpcyByZWZlcmVuY2VkIHRvIGFkZCBwb2xpY3kgc3RhdGVtZW50cyBhcyBhIHJlc291cmNlLWJhc2VkIHBvbGljeS5cbiAgICAvLyBXZSBzaG91bGQgZmFpbCBiZWNhdXNlIGEgbWFuYWdlZCBwb2xpY3kgY2Fubm90IGJlIHVzZWQgYXMgYSBwcmluY2lwYWwgb2YgYSBwb2xpY3kgZG9jdW1lbnQuXG4gICAgLy8gY2YuIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9yZWZlcmVuY2VfcG9saWNpZXNfZWxlbWVudHNfcHJpbmNpcGFsLmh0bWwjUHJpbmNpcGFsX3NwZWNpZnlpbmdcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCB1c2UgYSBNYW5hZ2VkUG9saWN5ICcke3RoaXMuX21hbmFnZWRQb2xpY3kubm9kZS5wYXRofScgYXMgdGhlICdQcmluY2lwYWwnIG9yICdOb3RQcmluY2lwYWwnIGluIGFuIElBTSBQb2xpY3lgKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb1BvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudCkuc3RhdGVtZW50QWRkZWQ7XG4gIH1cblxuICBwdWJsaWMgYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdCB7XG4gICAgdGhpcy5fbWFuYWdlZFBvbGljeS5hZGRTdGF0ZW1lbnRzKHN0YXRlbWVudCk7XG4gICAgcmV0dXJuIHsgc3RhdGVtZW50QWRkZWQ6IHRydWUsIHBvbGljeURlcGVuZGFibGU6IHRoaXMuX21hbmFnZWRQb2xpY3kgfTtcbiAgfVxufVxuIl19