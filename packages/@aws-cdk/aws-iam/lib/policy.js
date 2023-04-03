"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Policy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const iam_generated_1 = require("./iam.generated");
const policy_document_1 = require("./policy-document");
const util_1 = require("./private/util");
/**
 * The AWS::IAM::Policy resource associates an IAM policy with IAM users, roles,
 * or groups. For more information about IAM policies, see [Overview of IAM
 * Policies](http://docs.aws.amazon.com/IAM/latest/UserGuide/policies_overview.html)
 * in the IAM User Guide guide.
 */
class Policy extends core_1.Resource {
    /**
     * Import a policy in this app based on its name
     */
    static fromPolicyName(scope, id, policyName) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.policyName = policyName;
            }
        }
        return new Import(scope, id);
    }
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.policyName ||
                // generatePolicyName will take the last 128 characters of the logical id since
                // policy names are limited to 128. the last 8 chars are a stack-unique hash, so
                // that shouod be sufficient to ensure uniqueness within a principal.
                core_1.Lazy.string({ produce: () => (0, util_1.generatePolicyName)(scope, resource.logicalId) }),
        });
        /**
         * The policy document.
         */
        this.document = new policy_document_1.PolicyDocument();
        this.roles = new Array();
        this.users = new Array();
        this.groups = new Array();
        this.referenceTaken = false;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_PolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Policy);
            }
            throw error;
        }
        const self = this;
        class CfnPolicyConditional extends iam_generated_1.CfnPolicy {
            /**
             * This function returns `true` if the CFN resource should be included in
             * the cloudformation template unless `force` is `true`, if the policy
             * document is empty, the resource will not be included.
             */
            shouldSynthesize() {
                return self.force || self.referenceTaken || (!self.document.isEmpty && self.isAttached);
            }
        }
        if (props.document) {
            this.document = props.document;
        }
        const resource = new CfnPolicyConditional(this, 'Resource', {
            policyDocument: this.document,
            policyName: this.physicalName,
            roles: (0, util_1.undefinedIfEmpty)(() => this.roles.map(r => r.roleName)),
            users: (0, util_1.undefinedIfEmpty)(() => this.users.map(u => u.userName)),
            groups: (0, util_1.undefinedIfEmpty)(() => this.groups.map(g => g.groupName)),
        });
        this._policyName = this.physicalName;
        this.force = props.force ?? false;
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
        this.grantPrincipal = new PolicyGrantPrincipal(this);
        this.node.addValidation({ validate: () => this.validatePolicy() });
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
        user.attachInlinePolicy(this);
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
        role.attachInlinePolicy(this);
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
        group.attachInlinePolicy(this);
    }
    /**
     * The name of this policy.
     *
     * @attribute
     */
    get policyName() {
        this.referenceTaken = true;
        return this._policyName;
    }
    validatePolicy() {
        const result = new Array();
        // validate that the policy document is not empty
        if (this.document.isEmpty) {
            if (this.force) {
                result.push('Policy created with force=true is empty. You must add statements to the policy');
            }
            if (!this.force && this.referenceTaken) {
                result.push('This Policy has been referenced by a resource, so it must contain at least one statement.');
            }
        }
        // validate that the policy is attached to at least one principal (role, user or group).
        if (!this.isAttached) {
            if (this.force) {
                result.push('Policy created with force=true must be attached to at least one principal: user, group or role');
            }
            if (!this.force && this.referenceTaken) {
                result.push('This Policy has been referenced by a resource, so it must be attached to at least one user, group or role.');
            }
        }
        result.push(...this.document.validateForIdentityPolicy());
        return result;
    }
    /**
     * Whether the policy resource has been attached to any identity
     */
    get isAttached() {
        return this.groups.length + this.users.length + this.roles.length > 0;
    }
}
_a = JSII_RTTI_SYMBOL_1;
Policy[_a] = { fqn: "@aws-cdk/aws-iam.Policy", version: "0.0.0" };
exports.Policy = Policy;
class PolicyGrantPrincipal {
    constructor(_policy) {
        this._policy = _policy;
        this.assumeRoleAction = 'sts:AssumeRole';
        this.grantPrincipal = this;
        this.principalAccount = _policy.env.account;
    }
    get policyFragment() {
        // This property is referenced to add policy statements as a resource-based policy.
        // We should fail because a policy cannot be used as a principal of a policy document.
        // cf. https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html#Principal_specifying
        throw new Error(`Cannot use a Policy '${this._policy.node.path}' as the 'Principal' or 'NotPrincipal' in an IAM Policy`);
    }
    addToPolicy(statement) {
        return this.addToPrincipalPolicy(statement).statementAdded;
    }
    addToPrincipalPolicy(statement) {
        this._policy.addStatements(statement);
        return { statementAdded: true, policyDependable: this._policy };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUEwRDtBQUcxRCxtREFBNEM7QUFDNUMsdURBQW1EO0FBR25ELHlDQUFzRTtBQTBGdEU7Ozs7O0dBS0c7QUFDSCxNQUFhLE1BQU8sU0FBUSxlQUFRO0lBRWxDOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxVQUFrQjtRQUMzRSxNQUFNLE1BQU8sU0FBUSxlQUFRO1lBQTdCOztnQkFDa0IsZUFBVSxHQUFHLFVBQVUsQ0FBQztZQUMxQyxDQUFDO1NBQUE7UUFFRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQWdCRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQXFCLEVBQUU7UUFDL0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLFVBQVU7Z0JBQzVCLCtFQUErRTtnQkFDL0UsZ0ZBQWdGO2dCQUNoRixxRUFBcUU7Z0JBQ3JFLFdBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBa0IsRUFBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7U0FDaEYsQ0FBQyxDQUFDO1FBckJMOztXQUVHO1FBQ2EsYUFBUSxHQUFHLElBQUksZ0NBQWMsRUFBRSxDQUFDO1FBSy9CLFVBQUssR0FBRyxJQUFJLEtBQUssRUFBUyxDQUFDO1FBQzNCLFVBQUssR0FBRyxJQUFJLEtBQUssRUFBUyxDQUFDO1FBQzNCLFdBQU0sR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBRXRDLG1CQUFjLEdBQUcsS0FBSyxDQUFDOzs7Ozs7K0NBekJwQixNQUFNOzs7O1FBb0NmLE1BQU0sSUFBSSxHQUFHLElBQUks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SUFBSSx5REFBeUQsQ0FBQyxDQUFDO0tBQzFIO0lBRU0sV0FBVyxDQUFDLFNBQTBCO1FBQzNDLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztLQUM1RDtJQUVNLG9CQUFvQixDQUFDLFNBQTBCO1FBQ3BELElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNqRTtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVJlc291cmNlLCBMYXp5LCBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJR3JvdXAgfSBmcm9tICcuL2dyb3VwJztcbmltcG9ydCB7IENmblBvbGljeSB9IGZyb20gJy4vaWFtLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBQb2xpY3lEb2N1bWVudCB9IGZyb20gJy4vcG9saWN5LWRvY3VtZW50JztcbmltcG9ydCB7IFBvbGljeVN0YXRlbWVudCB9IGZyb20gJy4vcG9saWN5LXN0YXRlbWVudCc7XG5pbXBvcnQgeyBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdCwgSUdyYW50YWJsZSwgSVByaW5jaXBhbCwgUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQgfSBmcm9tICcuL3ByaW5jaXBhbHMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVQb2xpY3lOYW1lLCB1bmRlZmluZWRJZkVtcHR5IH0gZnJvbSAnLi9wcml2YXRlL3V0aWwnO1xuaW1wb3J0IHsgSVJvbGUgfSBmcm9tICcuL3JvbGUnO1xuaW1wb3J0IHsgSVVzZXIgfSBmcm9tICcuL3VzZXInO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gSUFNIFBvbGljeVxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL2FjY2Vzc19wb2xpY2llc19tYW5hZ2UuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElQb2xpY3kgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhpcyBwb2xpY3kuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHBvbGljeU5hbWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhbiBJQU0gaW5saW5lIHBvbGljeSBkb2N1bWVudFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFBvbGljeVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBwb2xpY3kuIElmIHlvdSBzcGVjaWZ5IG11bHRpcGxlIHBvbGljaWVzIGZvciBhbiBlbnRpdHksXG4gICAqIHNwZWNpZnkgdW5pcXVlIG5hbWVzLiBGb3IgZXhhbXBsZSwgaWYgeW91IHNwZWNpZnkgYSBsaXN0IG9mIHBvbGljaWVzIGZvclxuICAgKiBhbiBJQU0gcm9sZSwgZWFjaCBwb2xpY3kgbXVzdCBoYXZlIGEgdW5pcXVlIG5hbWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVXNlcyB0aGUgbG9naWNhbCBJRCBvZiB0aGUgcG9saWN5IHJlc291cmNlLCB3aGljaCBpcyBlbnN1cmVkXG4gICAqIHRvIGJlIHVuaXF1ZSB3aXRoaW4gdGhlIHN0YWNrLlxuICAgKi9cbiAgcmVhZG9ubHkgcG9saWN5TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVXNlcnMgdG8gYXR0YWNoIHRoaXMgcG9saWN5IHRvLlxuICAgKiBZb3UgY2FuIGFsc28gdXNlIGBhdHRhY2hUb1VzZXIodXNlcilgIHRvIGF0dGFjaCB0aGlzIHBvbGljeSB0byBhIHVzZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gdXNlcnMuXG4gICAqL1xuICByZWFkb25seSB1c2Vycz86IElVc2VyW107XG5cbiAgLyoqXG4gICAqIFJvbGVzIHRvIGF0dGFjaCB0aGlzIHBvbGljeSB0by5cbiAgICogWW91IGNhbiBhbHNvIHVzZSBgYXR0YWNoVG9Sb2xlKHJvbGUpYCB0byBhdHRhY2ggdGhpcyBwb2xpY3kgdG8gYSByb2xlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHJvbGVzLlxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZXM/OiBJUm9sZVtdO1xuXG4gIC8qKlxuICAgKiBHcm91cHMgdG8gYXR0YWNoIHRoaXMgcG9saWN5IHRvLlxuICAgKiBZb3UgY2FuIGFsc28gdXNlIGBhdHRhY2hUb0dyb3VwKGdyb3VwKWAgdG8gYXR0YWNoIHRoaXMgcG9saWN5IHRvIGEgZ3JvdXAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZ3JvdXBzLlxuICAgKi9cbiAgcmVhZG9ubHkgZ3JvdXBzPzogSUdyb3VwW107XG5cbiAgLyoqXG4gICAqIEluaXRpYWwgc2V0IG9mIHBlcm1pc3Npb25zIHRvIGFkZCB0byB0aGlzIHBvbGljeSBkb2N1bWVudC5cbiAgICogWW91IGNhbiBhbHNvIHVzZSBgYWRkU3RhdGVtZW50cyguLi5zdGF0ZW1lbnQpYCB0byBhZGQgcGVybWlzc2lvbnMgbGF0ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gc3RhdGVtZW50cy5cbiAgICovXG4gIHJlYWRvbmx5IHN0YXRlbWVudHM/OiBQb2xpY3lTdGF0ZW1lbnRbXTtcblxuICAvKipcbiAgICogRm9yY2UgY3JlYXRpb24gb2YgYW4gYEFXUzo6SUFNOjpQb2xpY3lgXG4gICAqXG4gICAqIFVubGVzcyBzZXQgdG8gYHRydWVgLCB0aGlzIGBQb2xpY3lgIGNvbnN0cnVjdCB3aWxsIG5vdCBtYXRlcmlhbGl6ZSB0byBhblxuICAgKiBgQVdTOjpJQU06OlBvbGljeWAgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgaW4gY2FzZSBpdCB3b3VsZCBoYXZlIG5vIGVmZmVjdFxuICAgKiAoZm9yIGV4YW1wbGUsIGlmIGl0IHJlbWFpbnMgdW5hdHRhY2hlZCB0byBhbiBJQU0gaWRlbnRpdHkgb3IgaWYgaXQgaGFzIG5vXG4gICAqIHN0YXRlbWVudHMpLiBUaGlzIGlzIGdlbmVyYWxseSBkZXNpcmVkIGJlaGF2aW9yLCBzaW5jZSBpdCBwcmV2ZW50c1xuICAgKiBjcmVhdGluZyBpbnZhbGlkLS1hbmQgaGVuY2UgdW5kZXBsb3lhYmxlLS1DbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZXMuXG4gICAqXG4gICAqIEluIGNhc2VzIHdoZXJlIHlvdSBrbm93IHRoZSBwb2xpY3kgbXVzdCBiZSBjcmVhdGVkIGFuZCBpdCBpcyBhY3R1YWxseVxuICAgKiBhbiBlcnJvciBpZiBubyBzdGF0ZW1lbnRzIGhhdmUgYmVlbiBhZGRlZCB0byBpdCwgeW91IGNhbiBzZXQgdGhpcyB0byBgdHJ1ZWAuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBmb3JjZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEluaXRpYWwgUG9saWN5RG9jdW1lbnQgdG8gdXNlIGZvciB0aGlzIFBvbGljeS4gSWYgb21pdGVkLCBhbnlcbiAgICogYFBvbGljeVN0YXRlbWVudGAgcHJvdmlkZWQgaW4gdGhlIGBzdGF0ZW1lbnRzYCBwcm9wZXJ0eSB3aWxsIGJlIGFwcGxpZWRcbiAgICogYWdhaW5zdCB0aGUgZW1wdHkgZGVmYXVsdCBgUG9saWN5RG9jdW1lbnRgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFuIGVtcHR5IHBvbGljeS5cbiAgICovXG4gIHJlYWRvbmx5IGRvY3VtZW50PzogUG9saWN5RG9jdW1lbnQ7XG59XG5cbi8qKlxuICogVGhlIEFXUzo6SUFNOjpQb2xpY3kgcmVzb3VyY2UgYXNzb2NpYXRlcyBhbiBJQU0gcG9saWN5IHdpdGggSUFNIHVzZXJzLCByb2xlcyxcbiAqIG9yIGdyb3Vwcy4gRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgSUFNIHBvbGljaWVzLCBzZWUgW092ZXJ2aWV3IG9mIElBTVxuICogUG9saWNpZXNdKGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL3BvbGljaWVzX292ZXJ2aWV3Lmh0bWwpXG4gKiBpbiB0aGUgSUFNIFVzZXIgR3VpZGUgZ3VpZGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBQb2xpY3kgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElQb2xpY3ksIElHcmFudGFibGUge1xuXG4gIC8qKlxuICAgKiBJbXBvcnQgYSBwb2xpY3kgaW4gdGhpcyBhcHAgYmFzZWQgb24gaXRzIG5hbWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVBvbGljeU5hbWUoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcG9saWN5TmFtZTogc3RyaW5nKTogSVBvbGljeSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJUG9saWN5IHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBwb2xpY3lOYW1lID0gcG9saWN5TmFtZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBwb2xpY3kgZG9jdW1lbnQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZG9jdW1lbnQgPSBuZXcgUG9saWN5RG9jdW1lbnQoKTtcblxuICBwdWJsaWMgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IElQcmluY2lwYWw7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfcG9saWN5TmFtZTogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IHJvbGVzID0gbmV3IEFycmF5PElSb2xlPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IHVzZXJzID0gbmV3IEFycmF5PElVc2VyPigpO1xuICBwcml2YXRlIHJlYWRvbmx5IGdyb3VwcyA9IG5ldyBBcnJheTxJR3JvdXA+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgZm9yY2U6IGJvb2xlYW47XG4gIHByaXZhdGUgcmVmZXJlbmNlVGFrZW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUG9saWN5UHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5wb2xpY3lOYW1lIHx8XG4gICAgICAgIC8vIGdlbmVyYXRlUG9saWN5TmFtZSB3aWxsIHRha2UgdGhlIGxhc3QgMTI4IGNoYXJhY3RlcnMgb2YgdGhlIGxvZ2ljYWwgaWQgc2luY2VcbiAgICAgICAgLy8gcG9saWN5IG5hbWVzIGFyZSBsaW1pdGVkIHRvIDEyOC4gdGhlIGxhc3QgOCBjaGFycyBhcmUgYSBzdGFjay11bmlxdWUgaGFzaCwgc29cbiAgICAgICAgLy8gdGhhdCBzaG91b2QgYmUgc3VmZmljaWVudCB0byBlbnN1cmUgdW5pcXVlbmVzcyB3aXRoaW4gYSBwcmluY2lwYWwuXG4gICAgICAgIExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gZ2VuZXJhdGVQb2xpY3lOYW1lKHNjb3BlLCByZXNvdXJjZS5sb2dpY2FsSWQpIH0pLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBjbGFzcyBDZm5Qb2xpY3lDb25kaXRpb25hbCBleHRlbmRzIENmblBvbGljeSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENGTiByZXNvdXJjZSBzaG91bGQgYmUgaW5jbHVkZWQgaW5cbiAgICAgICAqIHRoZSBjbG91ZGZvcm1hdGlvbiB0ZW1wbGF0ZSB1bmxlc3MgYGZvcmNlYCBpcyBgdHJ1ZWAsIGlmIHRoZSBwb2xpY3lcbiAgICAgICAqIGRvY3VtZW50IGlzIGVtcHR5LCB0aGUgcmVzb3VyY2Ugd2lsbCBub3QgYmUgaW5jbHVkZWQuXG4gICAgICAgKi9cbiAgICAgIHByb3RlY3RlZCBzaG91bGRTeW50aGVzaXplKCkge1xuICAgICAgICByZXR1cm4gc2VsZi5mb3JjZSB8fCBzZWxmLnJlZmVyZW5jZVRha2VuIHx8ICghc2VsZi5kb2N1bWVudC5pc0VtcHR5ICYmIHNlbGYuaXNBdHRhY2hlZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmRvY3VtZW50KSB7XG4gICAgICB0aGlzLmRvY3VtZW50ID0gcHJvcHMuZG9jdW1lbnQ7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuUG9saWN5Q29uZGl0aW9uYWwodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgcG9saWN5RG9jdW1lbnQ6IHRoaXMuZG9jdW1lbnQsXG4gICAgICBwb2xpY3lOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIHJvbGVzOiB1bmRlZmluZWRJZkVtcHR5KCgpID0+IHRoaXMucm9sZXMubWFwKHIgPT4gci5yb2xlTmFtZSkpLFxuICAgICAgdXNlcnM6IHVuZGVmaW5lZElmRW1wdHkoKCkgPT4gdGhpcy51c2Vycy5tYXAodSA9PiB1LnVzZXJOYW1lKSksXG4gICAgICBncm91cHM6IHVuZGVmaW5lZElmRW1wdHkoKCkgPT4gdGhpcy5ncm91cHMubWFwKGcgPT4gZy5ncm91cE5hbWUpKSxcbiAgICB9KTtcblxuICAgIHRoaXMuX3BvbGljeU5hbWUgPSB0aGlzLnBoeXNpY2FsTmFtZSE7XG4gICAgdGhpcy5mb3JjZSA9IHByb3BzLmZvcmNlID8/IGZhbHNlO1xuXG4gICAgaWYgKHByb3BzLnVzZXJzKSB7XG4gICAgICBwcm9wcy51c2Vycy5mb3JFYWNoKHUgPT4gdGhpcy5hdHRhY2hUb1VzZXIodSkpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5ncm91cHMpIHtcbiAgICAgIHByb3BzLmdyb3Vwcy5mb3JFYWNoKGcgPT4gdGhpcy5hdHRhY2hUb0dyb3VwKGcpKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMucm9sZXMpIHtcbiAgICAgIHByb3BzLnJvbGVzLmZvckVhY2gociA9PiB0aGlzLmF0dGFjaFRvUm9sZShyKSk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnN0YXRlbWVudHMpIHtcbiAgICAgIHByb3BzLnN0YXRlbWVudHMuZm9yRWFjaChwID0+IHRoaXMuYWRkU3RhdGVtZW50cyhwKSk7XG4gICAgfVxuXG4gICAgdGhpcy5ncmFudFByaW5jaXBhbCA9IG5ldyBQb2xpY3lHcmFudFByaW5jaXBhbCh0aGlzKTtcblxuICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHRoaXMudmFsaWRhdGVQb2xpY3koKSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgc3RhdGVtZW50IHRvIHRoZSBwb2xpY3kgZG9jdW1lbnQuXG4gICAqL1xuICBwdWJsaWMgYWRkU3RhdGVtZW50cyguLi5zdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudFtdKSB7XG4gICAgdGhpcy5kb2N1bWVudC5hZGRTdGF0ZW1lbnRzKC4uLnN0YXRlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhpcyBwb2xpY3kgdG8gYSB1c2VyLlxuICAgKi9cbiAgcHVibGljIGF0dGFjaFRvVXNlcih1c2VyOiBJVXNlcikge1xuICAgIGlmICh0aGlzLnVzZXJzLmZpbmQodSA9PiB1ID09PSB1c2VyKSkgeyByZXR1cm47IH1cbiAgICB0aGlzLnVzZXJzLnB1c2godXNlcik7XG4gICAgdXNlci5hdHRhY2hJbmxpbmVQb2xpY3kodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhpcyBwb2xpY3kgdG8gYSByb2xlLlxuICAgKi9cbiAgcHVibGljIGF0dGFjaFRvUm9sZShyb2xlOiBJUm9sZSkge1xuICAgIGlmICh0aGlzLnJvbGVzLmZpbmQociA9PiByID09PSByb2xlKSkgeyByZXR1cm47IH1cbiAgICB0aGlzLnJvbGVzLnB1c2gocm9sZSk7XG4gICAgcm9sZS5hdHRhY2hJbmxpbmVQb2xpY3kodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhpcyBwb2xpY3kgdG8gYSBncm91cC5cbiAgICovXG4gIHB1YmxpYyBhdHRhY2hUb0dyb3VwKGdyb3VwOiBJR3JvdXApIHtcbiAgICBpZiAodGhpcy5ncm91cHMuZmluZChnID0+IGcgPT09IGdyb3VwKSkgeyByZXR1cm47IH1cbiAgICB0aGlzLmdyb3Vwcy5wdXNoKGdyb3VwKTtcbiAgICBncm91cC5hdHRhY2hJbmxpbmVQb2xpY3kodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhpcyBwb2xpY3kuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyBnZXQgcG9saWN5TmFtZSgpOiBzdHJpbmcge1xuICAgIHRoaXMucmVmZXJlbmNlVGFrZW4gPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLl9wb2xpY3lOYW1lO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZVBvbGljeSgpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICAgIC8vIHZhbGlkYXRlIHRoYXQgdGhlIHBvbGljeSBkb2N1bWVudCBpcyBub3QgZW1wdHlcbiAgICBpZiAodGhpcy5kb2N1bWVudC5pc0VtcHR5KSB7XG4gICAgICBpZiAodGhpcy5mb3JjZSkge1xuICAgICAgICByZXN1bHQucHVzaCgnUG9saWN5IGNyZWF0ZWQgd2l0aCBmb3JjZT10cnVlIGlzIGVtcHR5LiBZb3UgbXVzdCBhZGQgc3RhdGVtZW50cyB0byB0aGUgcG9saWN5Jyk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuZm9yY2UgJiYgdGhpcy5yZWZlcmVuY2VUYWtlbikge1xuICAgICAgICByZXN1bHQucHVzaCgnVGhpcyBQb2xpY3kgaGFzIGJlZW4gcmVmZXJlbmNlZCBieSBhIHJlc291cmNlLCBzbyBpdCBtdXN0IGNvbnRhaW4gYXQgbGVhc3Qgb25lIHN0YXRlbWVudC4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB2YWxpZGF0ZSB0aGF0IHRoZSBwb2xpY3kgaXMgYXR0YWNoZWQgdG8gYXQgbGVhc3Qgb25lIHByaW5jaXBhbCAocm9sZSwgdXNlciBvciBncm91cCkuXG4gICAgaWYgKCF0aGlzLmlzQXR0YWNoZWQpIHtcbiAgICAgIGlmICh0aGlzLmZvcmNlKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKCdQb2xpY3kgY3JlYXRlZCB3aXRoIGZvcmNlPXRydWUgbXVzdCBiZSBhdHRhY2hlZCB0byBhdCBsZWFzdCBvbmUgcHJpbmNpcGFsOiB1c2VyLCBncm91cCBvciByb2xlJyk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuZm9yY2UgJiYgdGhpcy5yZWZlcmVuY2VUYWtlbikge1xuICAgICAgICByZXN1bHQucHVzaCgnVGhpcyBQb2xpY3kgaGFzIGJlZW4gcmVmZXJlbmNlZCBieSBhIHJlc291cmNlLCBzbyBpdCBtdXN0IGJlIGF0dGFjaGVkIHRvIGF0IGxlYXN0IG9uZSB1c2VyLCBncm91cCBvciByb2xlLicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc3VsdC5wdXNoKC4uLnRoaXMuZG9jdW1lbnQudmFsaWRhdGVGb3JJZGVudGl0eVBvbGljeSgpKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgcG9saWN5IHJlc291cmNlIGhhcyBiZWVuIGF0dGFjaGVkIHRvIGFueSBpZGVudGl0eVxuICAgKi9cbiAgcHJpdmF0ZSBnZXQgaXNBdHRhY2hlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5ncm91cHMubGVuZ3RoICsgdGhpcy51c2Vycy5sZW5ndGggKyB0aGlzLnJvbGVzLmxlbmd0aCA+IDA7XG4gIH1cbn1cblxuY2xhc3MgUG9saWN5R3JhbnRQcmluY2lwYWwgaW1wbGVtZW50cyBJUHJpbmNpcGFsIHtcbiAgcHVibGljIHJlYWRvbmx5IGFzc3VtZVJvbGVBY3Rpb24gPSAnc3RzOkFzc3VtZVJvbGUnO1xuICBwdWJsaWMgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IElQcmluY2lwYWw7XG4gIHB1YmxpYyByZWFkb25seSBwcmluY2lwYWxBY2NvdW50Pzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3BvbGljeTogUG9saWN5KSB7XG4gICAgdGhpcy5ncmFudFByaW5jaXBhbCA9IHRoaXM7XG4gICAgdGhpcy5wcmluY2lwYWxBY2NvdW50ID0gX3BvbGljeS5lbnYuYWNjb3VudDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcG9saWN5RnJhZ21lbnQoKTogUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQge1xuICAgIC8vIFRoaXMgcHJvcGVydHkgaXMgcmVmZXJlbmNlZCB0byBhZGQgcG9saWN5IHN0YXRlbWVudHMgYXMgYSByZXNvdXJjZS1iYXNlZCBwb2xpY3kuXG4gICAgLy8gV2Ugc2hvdWxkIGZhaWwgYmVjYXVzZSBhIHBvbGljeSBjYW5ub3QgYmUgdXNlZCBhcyBhIHByaW5jaXBhbCBvZiBhIHBvbGljeSBkb2N1bWVudC5cbiAgICAvLyBjZi4gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL3JlZmVyZW5jZV9wb2xpY2llc19lbGVtZW50c19wcmluY2lwYWwuaHRtbCNQcmluY2lwYWxfc3BlY2lmeWluZ1xuICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHVzZSBhIFBvbGljeSAnJHt0aGlzLl9wb2xpY3kubm9kZS5wYXRofScgYXMgdGhlICdQcmluY2lwYWwnIG9yICdOb3RQcmluY2lwYWwnIGluIGFuIElBTSBQb2xpY3lgKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb1BvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudCkuc3RhdGVtZW50QWRkZWQ7XG4gIH1cblxuICBwdWJsaWMgYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdCB7XG4gICAgdGhpcy5fcG9saWN5LmFkZFN0YXRlbWVudHMoc3RhdGVtZW50KTtcbiAgICByZXR1cm4geyBzdGF0ZW1lbnRBZGRlZDogdHJ1ZSwgcG9saWN5RGVwZW5kYWJsZTogdGhpcy5fcG9saWN5IH07XG4gIH1cbn1cbiJdfQ==