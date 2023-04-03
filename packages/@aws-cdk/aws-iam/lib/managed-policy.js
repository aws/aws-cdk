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
        const config = helpers_internal_1.getCustomizeRolesConfig(this);
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
                roles: util_1.undefinedIfEmpty(() => this.roles.map(r => r.roleName)),
                users: util_1.undefinedIfEmpty(() => this.users.map(u => u.userName)),
                groups: util_1.undefinedIfEmpty(() => this.groups.map(g => g.groupName)),
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
exports.ManagedPolicy = ManagedPolicy;
_a = JSII_RTTI_SYMBOL_1;
ManagedPolicy[_a] = { fqn: "@aws-cdk/aws-iam.ManagedPolicy", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlZC1wb2xpY3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYW5hZ2VkLXBvbGljeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBcUU7QUFDckUseUVBQWdHO0FBR2hHLG1EQUFtRDtBQUNuRCx1REFBbUQ7QUFHbkQseUNBQWtEO0FBMkZsRDs7O0dBR0c7QUFDSCxNQUFhLGFBQWMsU0FBUSxlQUFRO0lBNkd6QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQTRCLEVBQUU7UUFDdEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjtTQUN0QyxDQUFDLENBQUM7UUFwQ0w7O1dBRUc7UUFDYSxhQUFRLEdBQUcsSUFBSSxnQ0FBYyxFQUFFLENBQUM7UUF5Qi9CLFVBQUssR0FBRyxJQUFJLEtBQUssRUFBUyxDQUFDO1FBQzNCLFVBQUssR0FBRyxJQUFJLEtBQUssRUFBUyxDQUFDO1FBQzNCLFdBQU0sR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDOzs7Ozs7K0NBMUduQyxhQUFhOzs7O1FBa0h0QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUM7UUFFOUIsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztTQUNoQztRQUVELE1BQU0sTUFBTSxHQUFHLDBDQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLE1BQU0saUJBQWlCLEdBQUcsYUFBYSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxVQUFVLEdBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7UUFD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QUFDLENBQUM7UUFDN0MsT0FBTyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQ3hFO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcm5Gb3JtYXQsIFJlc291cmNlLCBTdGFjaywgQXJuLCBBd3MgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IGdldEN1c3RvbWl6ZVJvbGVzQ29uZmlnLCBQb2xpY3lTeW50aGVzaXplciB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUvbGliL2hlbHBlcnMtaW50ZXJuYWwnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJR3JvdXAgfSBmcm9tICcuL2dyb3VwJztcbmltcG9ydCB7IENmbk1hbmFnZWRQb2xpY3kgfSBmcm9tICcuL2lhbS5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgUG9saWN5RG9jdW1lbnQgfSBmcm9tICcuL3BvbGljeS1kb2N1bWVudCc7XG5pbXBvcnQgeyBQb2xpY3lTdGF0ZW1lbnQgfSBmcm9tICcuL3BvbGljeS1zdGF0ZW1lbnQnO1xuaW1wb3J0IHsgQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQsIElHcmFudGFibGUsIElQcmluY2lwYWwsIFByaW5jaXBhbFBvbGljeUZyYWdtZW50IH0gZnJvbSAnLi9wcmluY2lwYWxzJztcbmltcG9ydCB7IHVuZGVmaW5lZElmRW1wdHkgfSBmcm9tICcuL3ByaXZhdGUvdXRpbCc7XG5pbXBvcnQgeyBJUm9sZSB9IGZyb20gJy4vcm9sZSc7XG5pbXBvcnQgeyBJVXNlciB9IGZyb20gJy4vdXNlcic7XG5cbi8qKlxuICogQSBtYW5hZ2VkIHBvbGljeVxuICovXG5leHBvcnQgaW50ZXJmYWNlIElNYW5hZ2VkUG9saWN5IHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIG1hbmFnZWQgcG9saWN5XG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IG1hbmFnZWRQb2xpY3lBcm46IHN0cmluZztcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhbiBJQU0gbWFuYWdlZCBwb2xpY3lcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYW5hZ2VkUG9saWN5UHJvcHMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIG1hbmFnZWQgcG9saWN5LiBJZiB5b3Ugc3BlY2lmeSBtdWx0aXBsZSBwb2xpY2llcyBmb3IgYW4gZW50aXR5LFxuICAgKiBzcGVjaWZ5IHVuaXF1ZSBuYW1lcy4gRm9yIGV4YW1wbGUsIGlmIHlvdSBzcGVjaWZ5IGEgbGlzdCBvZiBwb2xpY2llcyBmb3JcbiAgICogYW4gSUFNIHJvbGUsIGVhY2ggcG9saWN5IG11c3QgaGF2ZSBhIHVuaXF1ZSBuYW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgbmFtZSBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IG1hbmFnZWRQb2xpY3lOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGRlc2NyaXB0aW9uIG9mIHRoZSBtYW5hZ2VkIHBvbGljeS4gVHlwaWNhbGx5IHVzZWQgdG8gc3RvcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlXG4gICAqIHBlcm1pc3Npb25zIGRlZmluZWQgaW4gdGhlIHBvbGljeS4gRm9yIGV4YW1wbGUsIFwiR3JhbnRzIGFjY2VzcyB0byBwcm9kdWN0aW9uIER5bmFtb0RCIHRhYmxlcy5cIlxuICAgKiBUaGUgcG9saWN5IGRlc2NyaXB0aW9uIGlzIGltbXV0YWJsZS4gQWZ0ZXIgYSB2YWx1ZSBpcyBhc3NpZ25lZCwgaXQgY2Fubm90IGJlIGNoYW5nZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZW1wdHlcbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCBmb3IgdGhlIHBvbGljeS4gVGhpcyBwYXJhbWV0ZXIgYWxsb3dzICh0aHJvdWdoIGl0cyByZWdleCBwYXR0ZXJuKSBhIHN0cmluZyBvZiBjaGFyYWN0ZXJzXG4gICAqIGNvbnNpc3Rpbmcgb2YgZWl0aGVyIGEgZm9yd2FyZCBzbGFzaCAoLykgYnkgaXRzZWxmIG9yIGEgc3RyaW5nIHRoYXQgbXVzdCBiZWdpbiBhbmQgZW5kIHdpdGggZm9yd2FyZCBzbGFzaGVzLlxuICAgKiBJbiBhZGRpdGlvbiwgaXQgY2FuIGNvbnRhaW4gYW55IEFTQ0lJIGNoYXJhY3RlciBmcm9tIHRoZSAhIChcXHUwMDIxKSB0aHJvdWdoIHRoZSBERUwgY2hhcmFjdGVyIChcXHUwMDdGKSxcbiAgICogaW5jbHVkaW5nIG1vc3QgcHVuY3R1YXRpb24gY2hhcmFjdGVycywgZGlnaXRzLCBhbmQgdXBwZXIgYW5kIGxvd2VyY2FzZWQgbGV0dGVycy5cbiAgICpcbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgcGF0aHMsIHNlZSBJQU0gSWRlbnRpZmllcnMgaW4gdGhlIElBTSBVc2VyIEd1aWRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFwiL1wiXG4gICAqL1xuICByZWFkb25seSBwYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBVc2VycyB0byBhdHRhY2ggdGhpcyBwb2xpY3kgdG8uXG4gICAqIFlvdSBjYW4gYWxzbyB1c2UgYGF0dGFjaFRvVXNlcih1c2VyKWAgdG8gYXR0YWNoIHRoaXMgcG9saWN5IHRvIGEgdXNlci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyB1c2Vycy5cbiAgICovXG4gIHJlYWRvbmx5IHVzZXJzPzogSVVzZXJbXTtcblxuICAvKipcbiAgICogUm9sZXMgdG8gYXR0YWNoIHRoaXMgcG9saWN5IHRvLlxuICAgKiBZb3UgY2FuIGFsc28gdXNlIGBhdHRhY2hUb1JvbGUocm9sZSlgIHRvIGF0dGFjaCB0aGlzIHBvbGljeSB0byBhIHJvbGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gcm9sZXMuXG4gICAqL1xuICByZWFkb25seSByb2xlcz86IElSb2xlW107XG5cbiAgLyoqXG4gICAqIEdyb3VwcyB0byBhdHRhY2ggdGhpcyBwb2xpY3kgdG8uXG4gICAqIFlvdSBjYW4gYWxzbyB1c2UgYGF0dGFjaFRvR3JvdXAoZ3JvdXApYCB0byBhdHRhY2ggdGhpcyBwb2xpY3kgdG8gYSBncm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBncm91cHMuXG4gICAqL1xuICByZWFkb25seSBncm91cHM/OiBJR3JvdXBbXTtcblxuICAvKipcbiAgICogSW5pdGlhbCBzZXQgb2YgcGVybWlzc2lvbnMgdG8gYWRkIHRvIHRoaXMgcG9saWN5IGRvY3VtZW50LlxuICAgKiBZb3UgY2FuIGFsc28gdXNlIGBhZGRQZXJtaXNzaW9uKHN0YXRlbWVudClgIHRvIGFkZCBwZXJtaXNzaW9ucyBsYXRlci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBzdGF0ZW1lbnRzLlxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVtZW50cz86IFBvbGljeVN0YXRlbWVudFtdO1xuXG4gIC8qKlxuICAgKiBJbml0aWFsIFBvbGljeURvY3VtZW50IHRvIHVzZSBmb3IgdGhpcyBNYW5hZ2VkUG9saWN5LiBJZiBvbWl0ZWQsIGFueVxuICAgKiBgUG9saWN5U3RhdGVtZW50YCBwcm92aWRlZCBpbiB0aGUgYHN0YXRlbWVudHNgIHByb3BlcnR5IHdpbGwgYmUgYXBwbGllZFxuICAgKiBhZ2FpbnN0IHRoZSBlbXB0eSBkZWZhdWx0IGBQb2xpY3lEb2N1bWVudGAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQW4gZW1wdHkgcG9saWN5LlxuICAgKi9cbiAgcmVhZG9ubHkgZG9jdW1lbnQ/OiBQb2xpY3lEb2N1bWVudDtcbn1cblxuLyoqXG4gKiBNYW5hZ2VkIHBvbGljeVxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIE1hbmFnZWRQb2xpY3kgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElNYW5hZ2VkUG9saWN5LCBJR3JhbnRhYmxlIHtcbiAgLyoqXG4gICAqIEltcG9ydCBhIGN1c3RvbWVyIG1hbmFnZWQgcG9saWN5IGZyb20gdGhlIG1hbmFnZWRQb2xpY3lOYW1lLlxuICAgKlxuICAgKiBGb3IgdGhpcyBtYW5hZ2VkIHBvbGljeSwgeW91IG9ubHkgbmVlZCB0byBrbm93IHRoZSBuYW1lIHRvIGJlIGFibGUgdG8gdXNlIGl0LlxuICAgKlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTWFuYWdlZFBvbGljeU5hbWUoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgbWFuYWdlZFBvbGljeU5hbWU6IHN0cmluZyk6IElNYW5hZ2VkUG9saWN5IHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElNYW5hZ2VkUG9saWN5IHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBtYW5hZ2VkUG9saWN5QXJuID0gU3RhY2sub2Yoc2NvcGUpLmZvcm1hdEFybih7XG4gICAgICAgIHNlcnZpY2U6ICdpYW0nLFxuICAgICAgICByZWdpb246ICcnLCAvLyBubyByZWdpb24gZm9yIG1hbmFnZWQgcG9saWN5XG4gICAgICAgIGFjY291bnQ6IFN0YWNrLm9mKHNjb3BlKS5hY2NvdW50LCAvLyBDYW4gdGhpcyBiZSBzb21ldGhpbmcgdGhlIHVzZXIgc3BlY2lmaWVzP1xuICAgICAgICByZXNvdXJjZTogJ3BvbGljeScsXG4gICAgICAgIHJlc291cmNlTmFtZTogbWFuYWdlZFBvbGljeU5hbWUsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXh0ZXJuYWwgbWFuYWdlZCBwb2xpY3kgYnkgQVJOLlxuICAgKlxuICAgKiBGb3IgdGhpcyBtYW5hZ2VkIHBvbGljeSwgeW91IG9ubHkgbmVlZCB0byBrbm93IHRoZSBBUk4gdG8gYmUgYWJsZSB0byB1c2UgaXQuXG4gICAqIFRoaXMgY2FuIGJlIHVzZWZ1bCBpZiB5b3UgZ290IHRoZSBBUk4gZnJvbSBhIENsb3VkRm9ybWF0aW9uIEV4cG9ydC5cbiAgICpcbiAgICogSWYgdGhlIGltcG9ydGVkIE1hbmFnZWQgUG9saWN5IEFSTiBpcyBhIFRva2VuIChzdWNoIGFzIGFcbiAgICogYENmblBhcmFtZXRlci52YWx1ZUFzU3RyaW5nYCBvciBhIGBGbi5pbXBvcnRWYWx1ZSgpYCkgKmFuZCogdGhlIHJlZmVyZW5jZWRcbiAgICogbWFuYWdlZCBwb2xpY3kgaGFzIGEgYHBhdGhgIChsaWtlIGBhcm46Li4uOnBvbGljeS9BZG1pblBvbGljeS9BZG1pbkFsbG93YCksIHRoZVxuICAgKiBgbWFuYWdlZFBvbGljeU5hbWVgIHByb3BlcnR5IHdpbGwgbm90IHJlc29sdmUgdG8gdGhlIGNvcnJlY3QgdmFsdWUuIEluc3RlYWQgaXRcbiAgICogd2lsbCByZXNvbHZlIHRvIHRoZSBmaXJzdCBwYXRoIGNvbXBvbmVudC4gV2UgdW5mb3J0dW5hdGVseSBjYW5ub3QgZXhwcmVzc1xuICAgKiB0aGUgY29ycmVjdCBjYWxjdWxhdGlvbiBvZiB0aGUgZnVsbCBwYXRoIG5hbWUgYXMgYSBDbG91ZEZvcm1hdGlvblxuICAgKiBleHByZXNzaW9uLiBJbiB0aGlzIHNjZW5hcmlvIHRoZSBNYW5hZ2VkIFBvbGljeSBBUk4gc2hvdWxkIGJlIHN1cHBsaWVkIHdpdGhvdXQgdGhlXG4gICAqIGBwYXRoYCBpbiBvcmRlciB0byByZXNvbHZlIHRoZSBjb3JyZWN0IG1hbmFnZWQgcG9saWN5IHJlc291cmNlLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgY29uc3RydWN0IHNjb3BlXG4gICAqIEBwYXJhbSBpZCBjb25zdHJ1Y3QgaWRcbiAgICogQHBhcmFtIG1hbmFnZWRQb2xpY3lBcm4gdGhlIEFSTiBvZiB0aGUgbWFuYWdlZCBwb2xpY3kgdG8gaW1wb3J0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21NYW5hZ2VkUG9saWN5QXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIG1hbmFnZWRQb2xpY3lBcm46IHN0cmluZyk6IElNYW5hZ2VkUG9saWN5IHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElNYW5hZ2VkUG9saWN5IHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBtYW5hZ2VkUG9saWN5QXJuID0gbWFuYWdlZFBvbGljeUFybjtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYSBtYW5hZ2VkIHBvbGljeSBmcm9tIG9uZSBvZiB0aGUgcG9saWNpZXMgdGhhdCBBV1MgbWFuYWdlcy5cbiAgICpcbiAgICogRm9yIHRoaXMgbWFuYWdlZCBwb2xpY3ksIHlvdSBvbmx5IG5lZWQgdG8ga25vdyB0aGUgbmFtZSB0byBiZSBhYmxlIHRvIHVzZSBpdC5cbiAgICpcbiAgICogU29tZSBtYW5hZ2VkIHBvbGljeSBuYW1lcyBzdGFydCB3aXRoIFwic2VydmljZS1yb2xlL1wiLCBzb21lIHN0YXJ0IHdpdGhcbiAgICogXCJqb2ItZnVuY3Rpb24vXCIsIGFuZCBzb21lIGRvbid0IHN0YXJ0IHdpdGggYW55dGhpbmcuIEluY2x1ZGUgdGhlXG4gICAqIHByZWZpeCB3aGVuIGNvbnN0cnVjdGluZyB0aGlzIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKG1hbmFnZWRQb2xpY3lOYW1lOiBzdHJpbmcpOiBJTWFuYWdlZFBvbGljeSB7XG4gICAgY2xhc3MgQXdzTWFuYWdlZFBvbGljeSBpbXBsZW1lbnRzIElNYW5hZ2VkUG9saWN5IHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBtYW5hZ2VkUG9saWN5QXJuID0gQXJuLmZvcm1hdCh7XG4gICAgICAgIHBhcnRpdGlvbjogQXdzLlBBUlRJVElPTixcbiAgICAgICAgc2VydmljZTogJ2lhbScsXG4gICAgICAgIHJlZ2lvbjogJycsIC8vIG5vIHJlZ2lvbiBmb3IgbWFuYWdlZCBwb2xpY3lcbiAgICAgICAgYWNjb3VudDogJ2F3cycsIC8vIHRoZSBhY2NvdW50IGZvciBhIG1hbmFnZWQgcG9saWN5IGlzICdhd3MnXG4gICAgICAgIHJlc291cmNlOiAncG9saWN5JyxcbiAgICAgICAgcmVzb3VyY2VOYW1lOiBtYW5hZ2VkUG9saWN5TmFtZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEF3c01hbmFnZWRQb2xpY3koKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBBUk4gb2YgdGhpcyBtYW5hZ2VkIHBvbGljeS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG1hbmFnZWRQb2xpY3lBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHBvbGljeSBkb2N1bWVudC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkb2N1bWVudCA9IG5ldyBQb2xpY3lEb2N1bWVudCgpO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGlzIHBvbGljeS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG1hbmFnZWRQb2xpY3lOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkZXNjcmlwdGlvbiBvZiB0aGlzIHBvbGljeS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRlc2NyaXB0aW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXRoIG9mIHRoaXMgcG9saWN5LlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcGF0aDogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSBncmFudFByaW5jaXBhbDogSVByaW5jaXBhbDtcblxuICBwcml2YXRlIHJlYWRvbmx5IHJvbGVzID0gbmV3IEFycmF5PElSb2xlPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IHVzZXJzID0gbmV3IEFycmF5PElVc2VyPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IGdyb3VwcyA9IG5ldyBBcnJheTxJR3JvdXA+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3ByZWNyZWF0ZWRQb2xpY3k/OiBJTWFuYWdlZFBvbGljeTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTWFuYWdlZFBvbGljeVByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMubWFuYWdlZFBvbGljeU5hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gcHJvcHMuZGVzY3JpcHRpb24gfHwgJyc7XG4gICAgdGhpcy5wYXRoID0gcHJvcHMucGF0aCB8fCAnLyc7XG5cbiAgICBpZiAocHJvcHMuZG9jdW1lbnQpIHtcbiAgICAgIHRoaXMuZG9jdW1lbnQgPSBwcm9wcy5kb2N1bWVudDtcbiAgICB9XG5cbiAgICBjb25zdCBjb25maWcgPSBnZXRDdXN0b21pemVSb2xlc0NvbmZpZyh0aGlzKTtcbiAgICBjb25zdCBfcHJlY3JlYXRlZFBvbGljeSA9IE1hbmFnZWRQb2xpY3kuZnJvbU1hbmFnZWRQb2xpY3lOYW1lKHRoaXMsICdJbXBvcnRlZCcraWQsIGlkKTtcbiAgICB0aGlzLm1hbmFnZWRQb2xpY3lOYW1lID0gaWQ7XG4gICAgdGhpcy5tYW5hZ2VkUG9saWN5QXJuID0gX3ByZWNyZWF0ZWRQb2xpY3kubWFuYWdlZFBvbGljeUFybjtcbiAgICBpZiAoY29uZmlnLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuX3ByZWNyZWF0ZWRQb2xpY3kgPSBfcHJlY3JlYXRlZFBvbGljeTtcbiAgICB9XG4gICAgaWYgKCFjb25maWcucHJldmVudFN5bnRoZXNpcykge1xuICAgICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuTWFuYWdlZFBvbGljeSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICAgIHBvbGljeURvY3VtZW50OiB0aGlzLmRvY3VtZW50LFxuICAgICAgICBtYW5hZ2VkUG9saWN5TmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgICBwYXRoOiB0aGlzLnBhdGgsXG4gICAgICAgIHJvbGVzOiB1bmRlZmluZWRJZkVtcHR5KCgpID0+IHRoaXMucm9sZXMubWFwKHIgPT4gci5yb2xlTmFtZSkpLFxuICAgICAgICB1c2VyczogdW5kZWZpbmVkSWZFbXB0eSgoKSA9PiB0aGlzLnVzZXJzLm1hcCh1ID0+IHUudXNlck5hbWUpKSxcbiAgICAgICAgZ3JvdXBzOiB1bmRlZmluZWRJZkVtcHR5KCgpID0+IHRoaXMuZ3JvdXBzLm1hcChnID0+IGcuZ3JvdXBOYW1lKSksXG4gICAgICB9KTtcblxuICAgICAgLy8gYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpwb2xpY3kvdGVzdHN0YWNrLUNyZWF0ZVRlc3REQlBvbGljeS0xNk0yM1lFM0NTNzAwXG4gICAgICB0aGlzLm1hbmFnZWRQb2xpY3lOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUoU3RhY2sub2YodGhpcykuc3BsaXRBcm4ocmVzb3VyY2UucmVmLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSkucmVzb3VyY2VOYW1lISk7XG4gICAgICB0aGlzLm1hbmFnZWRQb2xpY3lBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHJlc291cmNlLnJlZiwge1xuICAgICAgICByZWdpb246ICcnLCAvLyBJQU0gaXMgZ2xvYmFsIGluIGVhY2ggcGFydGl0aW9uXG4gICAgICAgIHNlcnZpY2U6ICdpYW0nLFxuICAgICAgICByZXNvdXJjZTogJ3BvbGljeScsXG4gICAgICAgIHJlc291cmNlTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMudXNlcnMpIHtcbiAgICAgIHByb3BzLnVzZXJzLmZvckVhY2godSA9PiB0aGlzLmF0dGFjaFRvVXNlcih1KSk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmdyb3Vwcykge1xuICAgICAgcHJvcHMuZ3JvdXBzLmZvckVhY2goZyA9PiB0aGlzLmF0dGFjaFRvR3JvdXAoZykpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5yb2xlcykge1xuICAgICAgcHJvcHMucm9sZXMuZm9yRWFjaChyID0+IHRoaXMuYXR0YWNoVG9Sb2xlKHIpKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuc3RhdGVtZW50cykge1xuICAgICAgcHJvcHMuc3RhdGVtZW50cy5mb3JFYWNoKHAgPT4gdGhpcy5hZGRTdGF0ZW1lbnRzKHApKTtcbiAgICB9XG5cbiAgICB0aGlzLmdyYW50UHJpbmNpcGFsID0gbmV3IE1hbmFnZWRQb2xpY3lHcmFudFByaW5jaXBhbCh0aGlzKTtcblxuICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHRoaXMudmFsaWRhdGVNYW5hZ2VkUG9saWN5KCkgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHN0YXRlbWVudCB0byB0aGUgcG9saWN5IGRvY3VtZW50LlxuICAgKi9cbiAgcHVibGljIGFkZFN0YXRlbWVudHMoLi4uc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnRbXSkge1xuICAgIHRoaXMuZG9jdW1lbnQuYWRkU3RhdGVtZW50cyguLi5zdGF0ZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIHRoaXMgcG9saWN5IHRvIGEgdXNlci5cbiAgICovXG4gIHB1YmxpYyBhdHRhY2hUb1VzZXIodXNlcjogSVVzZXIpIHtcbiAgICBpZiAodGhpcy51c2Vycy5maW5kKHUgPT4gdSA9PT0gdXNlcikpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy51c2Vycy5wdXNoKHVzZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIHRoaXMgcG9saWN5IHRvIGEgcm9sZS5cbiAgICovXG4gIHB1YmxpYyBhdHRhY2hUb1JvbGUocm9sZTogSVJvbGUpIHtcbiAgICBpZiAodGhpcy5yb2xlcy5maW5kKHIgPT4gciA9PT0gcm9sZSkpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5yb2xlcy5wdXNoKHJvbGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIHRoaXMgcG9saWN5IHRvIGEgZ3JvdXAuXG4gICAqL1xuICBwdWJsaWMgYXR0YWNoVG9Hcm91cChncm91cDogSUdyb3VwKSB7XG4gICAgaWYgKHRoaXMuZ3JvdXBzLmZpbmQoZyA9PiBnID09PSBncm91cCkpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5ncm91cHMucHVzaChncm91cCk7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlTWFuYWdlZFBvbGljeSgpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICAgIC8vIHZhbGlkYXRlIHRoYXQgdGhlIHBvbGljeSBkb2N1bWVudCBpcyBub3QgZW1wdHlcbiAgICBpZiAodGhpcy5kb2N1bWVudC5pc0VtcHR5KSB7XG4gICAgICByZXN1bHQucHVzaCgnTWFuYWdlZCBQb2xpY3kgaXMgZW1wdHkuIFlvdSBtdXN0IGFkZCBzdGF0ZW1lbnRzIHRvIHRoZSBwb2xpY3knKTtcbiAgICB9XG5cbiAgICByZXN1bHQucHVzaCguLi50aGlzLmRvY3VtZW50LnZhbGlkYXRlRm9ySWRlbnRpdHlQb2xpY3koKSk7XG5cbiAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PT0gMCAmJiB0aGlzLl9wcmVjcmVhdGVkUG9saWN5KSB7XG4gICAgICBQb2xpY3lTeW50aGVzaXplci5nZXRPckNyZWF0ZSh0aGlzKS5hZGRNYW5hZ2VkUG9saWN5KHRoaXMubm9kZS5wYXRoLCB7XG4gICAgICAgIHBvbGljeVN0YXRlbWVudHM6IHRoaXMuZG9jdW1lbnQudG9KU09OKCk/LlN0YXRlbWVudCxcbiAgICAgICAgcm9sZXM6IHRoaXMucm9sZXMubWFwKHJvbGUgPT4gcm9sZS5ub2RlLnBhdGgpLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuY2xhc3MgTWFuYWdlZFBvbGljeUdyYW50UHJpbmNpcGFsIGltcGxlbWVudHMgSVByaW5jaXBhbCB7XG4gIHB1YmxpYyByZWFkb25seSBhc3N1bWVSb2xlQWN0aW9uID0gJ3N0czpBc3N1bWVSb2xlJztcbiAgcHVibGljIHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsOiBJUHJpbmNpcGFsO1xuICBwdWJsaWMgcmVhZG9ubHkgcHJpbmNpcGFsQWNjb3VudD86IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9tYW5hZ2VkUG9saWN5OiBNYW5hZ2VkUG9saWN5KSB7XG4gICAgdGhpcy5ncmFudFByaW5jaXBhbCA9IHRoaXM7XG4gICAgdGhpcy5wcmluY2lwYWxBY2NvdW50ID0gX21hbmFnZWRQb2xpY3kuZW52LmFjY291bnQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHBvbGljeUZyYWdtZW50KCk6IFByaW5jaXBhbFBvbGljeUZyYWdtZW50IHtcbiAgICAvLyBUaGlzIHByb3BlcnR5IGlzIHJlZmVyZW5jZWQgdG8gYWRkIHBvbGljeSBzdGF0ZW1lbnRzIGFzIGEgcmVzb3VyY2UtYmFzZWQgcG9saWN5LlxuICAgIC8vIFdlIHNob3VsZCBmYWlsIGJlY2F1c2UgYSBtYW5hZ2VkIHBvbGljeSBjYW5ub3QgYmUgdXNlZCBhcyBhIHByaW5jaXBhbCBvZiBhIHBvbGljeSBkb2N1bWVudC5cbiAgICAvLyBjZi4gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL3JlZmVyZW5jZV9wb2xpY2llc19lbGVtZW50c19wcmluY2lwYWwuaHRtbCNQcmluY2lwYWxfc3BlY2lmeWluZ1xuICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHVzZSBhIE1hbmFnZWRQb2xpY3kgJyR7dGhpcy5fbWFuYWdlZFBvbGljeS5ub2RlLnBhdGh9JyBhcyB0aGUgJ1ByaW5jaXBhbCcgb3IgJ05vdFByaW5jaXBhbCcgaW4gYW4gSUFNIFBvbGljeWApO1xuICB9XG5cbiAgcHVibGljIGFkZFRvUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KS5zdGF0ZW1lbnRBZGRlZDtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IEFkZFRvUHJpbmNpcGFsUG9saWN5UmVzdWx0IHtcbiAgICB0aGlzLl9tYW5hZ2VkUG9saWN5LmFkZFN0YXRlbWVudHMoc3RhdGVtZW50KTtcbiAgICByZXR1cm4geyBzdGF0ZW1lbnRBZGRlZDogdHJ1ZSwgcG9saWN5RGVwZW5kYWJsZTogdGhpcy5fbWFuYWdlZFBvbGljeSB9O1xuICB9XG59XG4iXX0=