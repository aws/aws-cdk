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
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.policyName ||
                // generatePolicyName will take the last 128 characters of the logical id since
                // policy names are limited to 128. the last 8 chars are a stack-unique hash, so
                // that shouod be sufficient to ensure uniqueness within a principal.
                core_1.Lazy.string({ produce: () => util_1.generatePolicyName(scope, resource.logicalId) }),
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
            roles: util_1.undefinedIfEmpty(() => this.roles.map(r => r.roleName)),
            users: util_1.undefinedIfEmpty(() => this.users.map(u => u.userName)),
            groups: util_1.undefinedIfEmpty(() => this.groups.map(g => g.groupName)),
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
exports.Policy = Policy;
_a = JSII_RTTI_SYMBOL_1;
Policy[_a] = { fqn: "@aws-cdk/aws-iam.Policy", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUEwRDtBQUcxRCxtREFBNEM7QUFDNUMsdURBQW1EO0FBR25ELHlDQUFzRTtBQTBGdEU7Ozs7O0dBS0c7QUFDSCxNQUFhLE1BQU8sU0FBUSxlQUFRO0lBMkJsQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQXFCLEVBQUU7UUFDL0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLFVBQVU7Z0JBQzVCLCtFQUErRTtnQkFDL0UsZ0ZBQWdGO2dCQUNoRixxRUFBcUU7Z0JBQ3JFLFdBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMseUJBQWtCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1NBQ2hGLENBQUMsQ0FBQztRQXJCTDs7V0FFRztRQUNhLGFBQVEsR0FBRyxJQUFJLGdDQUFjLEVBQUUsQ0FBQztRQUsvQixVQUFLLEdBQUcsSUFBSSxLQUFLLEVBQVMsQ0FBQztRQUMzQixVQUFLLEdBQUcsSUFBSSxLQUFLLEVBQVMsQ0FBQztRQUMzQixXQUFNLEdBQUcsSUFBSSxLQUFLLEVBQVUsQ0FBQztRQUV0QyxtQkFBYyxHQUFHLEtBQUssQ0FBQzs7Ozs7OytDQXpCcEIsTUFBTTs7OztRQW9DZixNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFFbEIsTUFBTSxvQkFBcUIsU0FBUSx5QkFBUztZQUMxQzs7OztlQUlHO1lBQ08sZ0JBQWdCO2dCQUN4QixPQUFPLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzFGLENBQUM7U0FDRjtRQUVELElB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QUM7S0FDMUg7SUFFTSxXQUFXLENBQUMsU0FBMEI7UUFDM0MsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsY0FBYyxDQUFDO0tBQzVEO0lBRU0sb0JBQW9CLENBQUMsU0FBMEI7UUFDcEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2pFO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJUmVzb3VyY2UsIExhenksIFJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElHcm91cCB9IGZyb20gJy4vZ3JvdXAnO1xuaW1wb3J0IHsgQ2ZuUG9saWN5IH0gZnJvbSAnLi9pYW0uZ2VuZXJhdGVkJztcbmltcG9ydCB7IFBvbGljeURvY3VtZW50IH0gZnJvbSAnLi9wb2xpY3ktZG9jdW1lbnQnO1xuaW1wb3J0IHsgUG9saWN5U3RhdGVtZW50IH0gZnJvbSAnLi9wb2xpY3ktc3RhdGVtZW50JztcbmltcG9ydCB7IEFkZFRvUHJpbmNpcGFsUG9saWN5UmVzdWx0LCBJR3JhbnRhYmxlLCBJUHJpbmNpcGFsLCBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB9IGZyb20gJy4vcHJpbmNpcGFscyc7XG5pbXBvcnQgeyBnZW5lcmF0ZVBvbGljeU5hbWUsIHVuZGVmaW5lZElmRW1wdHkgfSBmcm9tICcuL3ByaXZhdGUvdXRpbCc7XG5pbXBvcnQgeyBJUm9sZSB9IGZyb20gJy4vcm9sZSc7XG5pbXBvcnQgeyBJVXNlciB9IGZyb20gJy4vdXNlcic7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBJQU0gUG9saWN5XG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvYWNjZXNzX3BvbGljaWVzX21hbmFnZS5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVBvbGljeSBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGlzIHBvbGljeS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgcG9saWN5TmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGFuIElBTSBpbmxpbmUgcG9saWN5IGRvY3VtZW50XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUG9saWN5UHJvcHMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHBvbGljeS4gSWYgeW91IHNwZWNpZnkgbXVsdGlwbGUgcG9saWNpZXMgZm9yIGFuIGVudGl0eSxcbiAgICogc3BlY2lmeSB1bmlxdWUgbmFtZXMuIEZvciBleGFtcGxlLCBpZiB5b3Ugc3BlY2lmeSBhIGxpc3Qgb2YgcG9saWNpZXMgZm9yXG4gICAqIGFuIElBTSByb2xlLCBlYWNoIHBvbGljeSBtdXN0IGhhdmUgYSB1bmlxdWUgbmFtZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBVc2VzIHRoZSBsb2dpY2FsIElEIG9mIHRoZSBwb2xpY3kgcmVzb3VyY2UsIHdoaWNoIGlzIGVuc3VyZWRcbiAgICogdG8gYmUgdW5pcXVlIHdpdGhpbiB0aGUgc3RhY2suXG4gICAqL1xuICByZWFkb25seSBwb2xpY3lOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBVc2VycyB0byBhdHRhY2ggdGhpcyBwb2xpY3kgdG8uXG4gICAqIFlvdSBjYW4gYWxzbyB1c2UgYGF0dGFjaFRvVXNlcih1c2VyKWAgdG8gYXR0YWNoIHRoaXMgcG9saWN5IHRvIGEgdXNlci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyB1c2Vycy5cbiAgICovXG4gIHJlYWRvbmx5IHVzZXJzPzogSVVzZXJbXTtcblxuICAvKipcbiAgICogUm9sZXMgdG8gYXR0YWNoIHRoaXMgcG9saWN5IHRvLlxuICAgKiBZb3UgY2FuIGFsc28gdXNlIGBhdHRhY2hUb1JvbGUocm9sZSlgIHRvIGF0dGFjaCB0aGlzIHBvbGljeSB0byBhIHJvbGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gcm9sZXMuXG4gICAqL1xuICByZWFkb25seSByb2xlcz86IElSb2xlW107XG5cbiAgLyoqXG4gICAqIEdyb3VwcyB0byBhdHRhY2ggdGhpcyBwb2xpY3kgdG8uXG4gICAqIFlvdSBjYW4gYWxzbyB1c2UgYGF0dGFjaFRvR3JvdXAoZ3JvdXApYCB0byBhdHRhY2ggdGhpcyBwb2xpY3kgdG8gYSBncm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBncm91cHMuXG4gICAqL1xuICByZWFkb25seSBncm91cHM/OiBJR3JvdXBbXTtcblxuICAvKipcbiAgICogSW5pdGlhbCBzZXQgb2YgcGVybWlzc2lvbnMgdG8gYWRkIHRvIHRoaXMgcG9saWN5IGRvY3VtZW50LlxuICAgKiBZb3UgY2FuIGFsc28gdXNlIGBhZGRTdGF0ZW1lbnRzKC4uLnN0YXRlbWVudClgIHRvIGFkZCBwZXJtaXNzaW9ucyBsYXRlci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBzdGF0ZW1lbnRzLlxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVtZW50cz86IFBvbGljeVN0YXRlbWVudFtdO1xuXG4gIC8qKlxuICAgKiBGb3JjZSBjcmVhdGlvbiBvZiBhbiBgQVdTOjpJQU06OlBvbGljeWBcbiAgICpcbiAgICogVW5sZXNzIHNldCB0byBgdHJ1ZWAsIHRoaXMgYFBvbGljeWAgY29uc3RydWN0IHdpbGwgbm90IG1hdGVyaWFsaXplIHRvIGFuXG4gICAqIGBBV1M6OklBTTo6UG9saWN5YCBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBpbiBjYXNlIGl0IHdvdWxkIGhhdmUgbm8gZWZmZWN0XG4gICAqIChmb3IgZXhhbXBsZSwgaWYgaXQgcmVtYWlucyB1bmF0dGFjaGVkIHRvIGFuIElBTSBpZGVudGl0eSBvciBpZiBpdCBoYXMgbm9cbiAgICogc3RhdGVtZW50cykuIFRoaXMgaXMgZ2VuZXJhbGx5IGRlc2lyZWQgYmVoYXZpb3IsIHNpbmNlIGl0IHByZXZlbnRzXG4gICAqIGNyZWF0aW5nIGludmFsaWQtLWFuZCBoZW5jZSB1bmRlcGxveWFibGUtLUNsb3VkRm9ybWF0aW9uIHRlbXBsYXRlcy5cbiAgICpcbiAgICogSW4gY2FzZXMgd2hlcmUgeW91IGtub3cgdGhlIHBvbGljeSBtdXN0IGJlIGNyZWF0ZWQgYW5kIGl0IGlzIGFjdHVhbGx5XG4gICAqIGFuIGVycm9yIGlmIG5vIHN0YXRlbWVudHMgaGF2ZSBiZWVuIGFkZGVkIHRvIGl0LCB5b3UgY2FuIHNldCB0aGlzIHRvIGB0cnVlYC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGZvcmNlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW5pdGlhbCBQb2xpY3lEb2N1bWVudCB0byB1c2UgZm9yIHRoaXMgUG9saWN5LiBJZiBvbWl0ZWQsIGFueVxuICAgKiBgUG9saWN5U3RhdGVtZW50YCBwcm92aWRlZCBpbiB0aGUgYHN0YXRlbWVudHNgIHByb3BlcnR5IHdpbGwgYmUgYXBwbGllZFxuICAgKiBhZ2FpbnN0IHRoZSBlbXB0eSBkZWZhdWx0IGBQb2xpY3lEb2N1bWVudGAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQW4gZW1wdHkgcG9saWN5LlxuICAgKi9cbiAgcmVhZG9ubHkgZG9jdW1lbnQ/OiBQb2xpY3lEb2N1bWVudDtcbn1cblxuLyoqXG4gKiBUaGUgQVdTOjpJQU06OlBvbGljeSByZXNvdXJjZSBhc3NvY2lhdGVzIGFuIElBTSBwb2xpY3kgd2l0aCBJQU0gdXNlcnMsIHJvbGVzLFxuICogb3IgZ3JvdXBzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBJQU0gcG9saWNpZXMsIHNlZSBbT3ZlcnZpZXcgb2YgSUFNXG4gKiBQb2xpY2llc10oaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvcG9saWNpZXNfb3ZlcnZpZXcuaHRtbClcbiAqIGluIHRoZSBJQU0gVXNlciBHdWlkZSBndWlkZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFBvbGljeSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVBvbGljeSwgSUdyYW50YWJsZSB7XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhIHBvbGljeSBpbiB0aGlzIGFwcCBiYXNlZCBvbiBpdHMgbmFtZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tUG9saWN5TmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwb2xpY3lOYW1lOiBzdHJpbmcpOiBJUG9saWN5IHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElQb2xpY3kge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHBvbGljeU5hbWUgPSBwb2xpY3lOYW1lO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHBvbGljeSBkb2N1bWVudC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkb2N1bWVudCA9IG5ldyBQb2xpY3lEb2N1bWVudCgpO1xuXG4gIHB1YmxpYyByZWFkb25seSBncmFudFByaW5jaXBhbDogSVByaW5jaXBhbDtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9wb2xpY3lOYW1lOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgcm9sZXMgPSBuZXcgQXJyYXk8SVJvbGU+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgdXNlcnMgPSBuZXcgQXJyYXk8SVVzZXI+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgZ3JvdXBzID0gbmV3IEFycmF5PElHcm91cD4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBmb3JjZTogYm9vbGVhbjtcbiAgcHJpdmF0ZSByZWZlcmVuY2VUYWtlbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQb2xpY3lQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLnBvbGljeU5hbWUgfHxcbiAgICAgICAgLy8gZ2VuZXJhdGVQb2xpY3lOYW1lIHdpbGwgdGFrZSB0aGUgbGFzdCAxMjggY2hhcmFjdGVycyBvZiB0aGUgbG9naWNhbCBpZCBzaW5jZVxuICAgICAgICAvLyBwb2xpY3kgbmFtZXMgYXJlIGxpbWl0ZWQgdG8gMTI4LiB0aGUgbGFzdCA4IGNoYXJzIGFyZSBhIHN0YWNrLXVuaXF1ZSBoYXNoLCBzb1xuICAgICAgICAvLyB0aGF0IHNob3VvZCBiZSBzdWZmaWNpZW50IHRvIGVuc3VyZSB1bmlxdWVuZXNzIHdpdGhpbiBhIHByaW5jaXBhbC5cbiAgICAgICAgTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiBnZW5lcmF0ZVBvbGljeU5hbWUoc2NvcGUsIHJlc291cmNlLmxvZ2ljYWxJZCkgfSksXG4gICAgfSk7XG5cbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGNsYXNzIENmblBvbGljeUNvbmRpdGlvbmFsIGV4dGVuZHMgQ2ZuUG9saWN5IHtcbiAgICAgIC8qKlxuICAgICAgICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ0ZOIHJlc291cmNlIHNob3VsZCBiZSBpbmNsdWRlZCBpblxuICAgICAgICogdGhlIGNsb3VkZm9ybWF0aW9uIHRlbXBsYXRlIHVubGVzcyBgZm9yY2VgIGlzIGB0cnVlYCwgaWYgdGhlIHBvbGljeVxuICAgICAgICogZG9jdW1lbnQgaXMgZW1wdHksIHRoZSByZXNvdXJjZSB3aWxsIG5vdCBiZSBpbmNsdWRlZC5cbiAgICAgICAqL1xuICAgICAgcHJvdGVjdGVkIHNob3VsZFN5bnRoZXNpemUoKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmZvcmNlIHx8IHNlbGYucmVmZXJlbmNlVGFrZW4gfHwgKCFzZWxmLmRvY3VtZW50LmlzRW1wdHkgJiYgc2VsZi5pc0F0dGFjaGVkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJvcHMuZG9jdW1lbnQpIHtcbiAgICAgIHRoaXMuZG9jdW1lbnQgPSBwcm9wcy5kb2N1bWVudDtcbiAgICB9XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5Qb2xpY3lDb25kaXRpb25hbCh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBwb2xpY3lEb2N1bWVudDogdGhpcy5kb2N1bWVudCxcbiAgICAgIHBvbGljeU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgcm9sZXM6IHVuZGVmaW5lZElmRW1wdHkoKCkgPT4gdGhpcy5yb2xlcy5tYXAociA9PiByLnJvbGVOYW1lKSksXG4gICAgICB1c2VyczogdW5kZWZpbmVkSWZFbXB0eSgoKSA9PiB0aGlzLnVzZXJzLm1hcCh1ID0+IHUudXNlck5hbWUpKSxcbiAgICAgIGdyb3VwczogdW5kZWZpbmVkSWZFbXB0eSgoKSA9PiB0aGlzLmdyb3Vwcy5tYXAoZyA9PiBnLmdyb3VwTmFtZSkpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5fcG9saWN5TmFtZSA9IHRoaXMucGh5c2ljYWxOYW1lITtcbiAgICB0aGlzLmZvcmNlID0gcHJvcHMuZm9yY2UgPz8gZmFsc2U7XG5cbiAgICBpZiAocHJvcHMudXNlcnMpIHtcbiAgICAgIHByb3BzLnVzZXJzLmZvckVhY2godSA9PiB0aGlzLmF0dGFjaFRvVXNlcih1KSk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmdyb3Vwcykge1xuICAgICAgcHJvcHMuZ3JvdXBzLmZvckVhY2goZyA9PiB0aGlzLmF0dGFjaFRvR3JvdXAoZykpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5yb2xlcykge1xuICAgICAgcHJvcHMucm9sZXMuZm9yRWFjaChyID0+IHRoaXMuYXR0YWNoVG9Sb2xlKHIpKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuc3RhdGVtZW50cykge1xuICAgICAgcHJvcHMuc3RhdGVtZW50cy5mb3JFYWNoKHAgPT4gdGhpcy5hZGRTdGF0ZW1lbnRzKHApKTtcbiAgICB9XG5cbiAgICB0aGlzLmdyYW50UHJpbmNpcGFsID0gbmV3IFBvbGljeUdyYW50UHJpbmNpcGFsKHRoaXMpO1xuXG4gICAgdGhpcy5ub2RlLmFkZFZhbGlkYXRpb24oeyB2YWxpZGF0ZTogKCkgPT4gdGhpcy52YWxpZGF0ZVBvbGljeSgpIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBzdGF0ZW1lbnQgdG8gdGhlIHBvbGljeSBkb2N1bWVudC5cbiAgICovXG4gIHB1YmxpYyBhZGRTdGF0ZW1lbnRzKC4uLnN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50W10pIHtcbiAgICB0aGlzLmRvY3VtZW50LmFkZFN0YXRlbWVudHMoLi4uc3RhdGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGlzIHBvbGljeSB0byBhIHVzZXIuXG4gICAqL1xuICBwdWJsaWMgYXR0YWNoVG9Vc2VyKHVzZXI6IElVc2VyKSB7XG4gICAgaWYgKHRoaXMudXNlcnMuZmluZCh1ID0+IHUgPT09IHVzZXIpKSB7IHJldHVybjsgfVxuICAgIHRoaXMudXNlcnMucHVzaCh1c2VyKTtcbiAgICB1c2VyLmF0dGFjaElubGluZVBvbGljeSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGlzIHBvbGljeSB0byBhIHJvbGUuXG4gICAqL1xuICBwdWJsaWMgYXR0YWNoVG9Sb2xlKHJvbGU6IElSb2xlKSB7XG4gICAgaWYgKHRoaXMucm9sZXMuZmluZChyID0+IHIgPT09IHJvbGUpKSB7IHJldHVybjsgfVxuICAgIHRoaXMucm9sZXMucHVzaChyb2xlKTtcbiAgICByb2xlLmF0dGFjaElubGluZVBvbGljeSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGlzIHBvbGljeSB0byBhIGdyb3VwLlxuICAgKi9cbiAgcHVibGljIGF0dGFjaFRvR3JvdXAoZ3JvdXA6IElHcm91cCkge1xuICAgIGlmICh0aGlzLmdyb3Vwcy5maW5kKGcgPT4gZyA9PT0gZ3JvdXApKSB7IHJldHVybjsgfVxuICAgIHRoaXMuZ3JvdXBzLnB1c2goZ3JvdXApO1xuICAgIGdyb3VwLmF0dGFjaElubGluZVBvbGljeSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGlzIHBvbGljeS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIGdldCBwb2xpY3lOYW1lKCk6IHN0cmluZyB7XG4gICAgdGhpcy5yZWZlcmVuY2VUYWtlbiA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuX3BvbGljeU5hbWU7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlUG9saWN5KCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gICAgLy8gdmFsaWRhdGUgdGhhdCB0aGUgcG9saWN5IGRvY3VtZW50IGlzIG5vdCBlbXB0eVxuICAgIGlmICh0aGlzLmRvY3VtZW50LmlzRW1wdHkpIHtcbiAgICAgIGlmICh0aGlzLmZvcmNlKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKCdQb2xpY3kgY3JlYXRlZCB3aXRoIGZvcmNlPXRydWUgaXMgZW1wdHkuIFlvdSBtdXN0IGFkZCBzdGF0ZW1lbnRzIHRvIHRoZSBwb2xpY3knKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5mb3JjZSAmJiB0aGlzLnJlZmVyZW5jZVRha2VuKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKCdUaGlzIFBvbGljeSBoYXMgYmVlbiByZWZlcmVuY2VkIGJ5IGEgcmVzb3VyY2UsIHNvIGl0IG11c3QgY29udGFpbiBhdCBsZWFzdCBvbmUgc3RhdGVtZW50LicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHZhbGlkYXRlIHRoYXQgdGhlIHBvbGljeSBpcyBhdHRhY2hlZCB0byBhdCBsZWFzdCBvbmUgcHJpbmNpcGFsIChyb2xlLCB1c2VyIG9yIGdyb3VwKS5cbiAgICBpZiAoIXRoaXMuaXNBdHRhY2hlZCkge1xuICAgICAgaWYgKHRoaXMuZm9yY2UpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goJ1BvbGljeSBjcmVhdGVkIHdpdGggZm9yY2U9dHJ1ZSBtdXN0IGJlIGF0dGFjaGVkIHRvIGF0IGxlYXN0IG9uZSBwcmluY2lwYWw6IHVzZXIsIGdyb3VwIG9yIHJvbGUnKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5mb3JjZSAmJiB0aGlzLnJlZmVyZW5jZVRha2VuKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKCdUaGlzIFBvbGljeSBoYXMgYmVlbiByZWZlcmVuY2VkIGJ5IGEgcmVzb3VyY2UsIHNvIGl0IG11c3QgYmUgYXR0YWNoZWQgdG8gYXQgbGVhc3Qgb25lIHVzZXIsIGdyb3VwIG9yIHJvbGUuJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVzdWx0LnB1c2goLi4udGhpcy5kb2N1bWVudC52YWxpZGF0ZUZvcklkZW50aXR5UG9saWN5KCkpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBwb2xpY3kgcmVzb3VyY2UgaGFzIGJlZW4gYXR0YWNoZWQgdG8gYW55IGlkZW50aXR5XG4gICAqL1xuICBwcml2YXRlIGdldCBpc0F0dGFjaGVkKCkge1xuICAgIHJldHVybiB0aGlzLmdyb3Vwcy5sZW5ndGggKyB0aGlzLnVzZXJzLmxlbmd0aCArIHRoaXMucm9sZXMubGVuZ3RoID4gMDtcbiAgfVxufVxuXG5jbGFzcyBQb2xpY3lHcmFudFByaW5jaXBhbCBpbXBsZW1lbnRzIElQcmluY2lwYWwge1xuICBwdWJsaWMgcmVhZG9ubHkgYXNzdW1lUm9sZUFjdGlvbiA9ICdzdHM6QXNzdW1lUm9sZSc7XG4gIHB1YmxpYyByZWFkb25seSBncmFudFByaW5jaXBhbDogSVByaW5jaXBhbDtcbiAgcHVibGljIHJlYWRvbmx5IHByaW5jaXBhbEFjY291bnQ/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcG9saWN5OiBQb2xpY3kpIHtcbiAgICB0aGlzLmdyYW50UHJpbmNpcGFsID0gdGhpcztcbiAgICB0aGlzLnByaW5jaXBhbEFjY291bnQgPSBfcG9saWN5LmVudi5hY2NvdW50O1xuICB9XG5cbiAgcHVibGljIGdldCBwb2xpY3lGcmFnbWVudCgpOiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB7XG4gICAgLy8gVGhpcyBwcm9wZXJ0eSBpcyByZWZlcmVuY2VkIHRvIGFkZCBwb2xpY3kgc3RhdGVtZW50cyBhcyBhIHJlc291cmNlLWJhc2VkIHBvbGljeS5cbiAgICAvLyBXZSBzaG91bGQgZmFpbCBiZWNhdXNlIGEgcG9saWN5IGNhbm5vdCBiZSB1c2VkIGFzIGEgcHJpbmNpcGFsIG9mIGEgcG9saWN5IGRvY3VtZW50LlxuICAgIC8vIGNmLiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvcmVmZXJlbmNlX3BvbGljaWVzX2VsZW1lbnRzX3ByaW5jaXBhbC5odG1sI1ByaW5jaXBhbF9zcGVjaWZ5aW5nXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgdXNlIGEgUG9saWN5ICcke3RoaXMuX3BvbGljeS5ub2RlLnBhdGh9JyBhcyB0aGUgJ1ByaW5jaXBhbCcgb3IgJ05vdFByaW5jaXBhbCcgaW4gYW4gSUFNIFBvbGljeWApO1xuICB9XG5cbiAgcHVibGljIGFkZFRvUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KS5zdGF0ZW1lbnRBZGRlZDtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IEFkZFRvUHJpbmNpcGFsUG9saWN5UmVzdWx0IHtcbiAgICB0aGlzLl9wb2xpY3kuYWRkU3RhdGVtZW50cyhzdGF0ZW1lbnQpO1xuICAgIHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiB0cnVlLCBwb2xpY3lEZXBlbmRhYmxlOiB0aGlzLl9wb2xpY3kgfTtcbiAgfVxufVxuIl19