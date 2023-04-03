"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyRole = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const role_1 = require("./role");
/**
 * An IAM role that only gets attached to the construct tree once it gets used, not before
 *
 * This construct can be used to simplify logic in other constructs
 * which need to create a role but only if certain configurations occur
 * (such as when AutoScaling is configured). The role can be configured in one
 * place, but if it never gets used it doesn't get instantiated and will
 * not be synthesized or deployed.
 *
 * @resource AWS::IAM::Role
 */
class LazyRole extends cdk.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.grantPrincipal = this;
        this.principalAccount = this.env.account;
        this.assumeRoleAction = 'sts:AssumeRole';
        this.statements = new Array();
        this.policies = new Array();
        this.managedPolicies = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_LazyRoleProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LazyRole);
            }
            throw error;
        }
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
        if (this.role) {
            return this.role.addToPrincipalPolicy(statement);
        }
        else {
            this.statements.push(statement);
            return { statementAdded: true, policyDependable: this };
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
        return this.addToPrincipalPolicy(statement).statementAdded;
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
        if (this.role) {
            this.role.attachInlinePolicy(policy);
        }
        else {
            this.policies.push(policy);
        }
    }
    /**
     * Attaches a managed policy to this role.
     * @param policy The managed policy to attach.
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
        if (this.role) {
            this.role.addManagedPolicy(policy);
        }
        else {
            this.managedPolicies.push(policy);
        }
    }
    /**
     * Returns the ARN of this role.
     */
    get roleArn() {
        return this.instantiate().roleArn;
    }
    /**
     * Returns the stable and unique string identifying the role (i.e. AIDAJQABLZS4A3QDU576Q)
     *
     * @attribute
     */
    get roleId() {
        return this.instantiate().roleId;
    }
    get roleName() {
        return this.instantiate().roleName;
    }
    get policyFragment() {
        return this.instantiate().policyFragment;
    }
    /**
     * Grant the actions defined in actions to the identity Principal on this resource.
     */
    grant(identity, ...actions) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IPrincipal(identity);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.grant);
            }
            throw error;
        }
        return this.instantiate().grant(identity, ...actions);
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
        return this.instantiate().grantPassRole(identity);
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
        return this.instantiate().grantAssumeRole(identity);
    }
    instantiate() {
        if (!this.role) {
            const role = new role_1.Role(this, 'Default', this.props);
            this.statements.forEach(role.addToPolicy.bind(role));
            this.policies.forEach(role.attachInlinePolicy.bind(role));
            this.managedPolicies.forEach(role.addManagedPolicy.bind(role));
            this.role = role;
        }
        return this.role;
    }
}
_a = JSII_RTTI_SYMBOL_1;
LazyRole[_a] = { fqn: "@aws-cdk/aws-iam.LazyRole", version: "0.0.0" };
exports.LazyRole = LazyRole;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF6eS1yb2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGF6eS1yb2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFDQUFxQztBQU9yQyxpQ0FBZ0Q7QUFTaEQ7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQWEsUUFBUyxTQUFRLEdBQUcsQ0FBQyxRQUFRO0lBVXhDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQW1CLEtBQW9CO1FBQzdFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFEd0MsVUFBSyxHQUFMLEtBQUssQ0FBZTtRQVQvRCxtQkFBYyxHQUFlLElBQUksQ0FBQztRQUNsQyxxQkFBZ0IsR0FBdUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDeEQscUJBQWdCLEdBQVcsZ0JBQWdCLENBQUM7UUFHM0MsZUFBVSxHQUFHLElBQUksS0FBSyxFQUFtQixDQUFDO1FBQzFDLGFBQVEsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBQy9CLG9CQUFlLEdBQUcsSUFBSSxLQUFLLEVBQWtCLENBQUM7Ozs7OzsrQ0FScEQsUUFBUTs7OztLQVlsQjtJQUVEOzs7O09BSUc7SUFDSSxvQkFBb0IsQ0FBQyxTQUEwQjs7Ozs7Ozs7OztRQUNwRCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDYixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDbEQ7YUFBTTtZQUNMLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxDQUFDO1NBQ3pEO0tBQ0Y7SUFFTSxXQUFXLENBQUMsU0FBMEI7Ozs7Ozs7Ozs7UUFDM0MsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsY0FBYyxDQUFDO0tBQzVEO0lBRUQ7OztPQUdHO0lBQ0ksa0JBQWtCLENBQUMsTUFBYzs7Ozs7Ozs7OztRQUN0QyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3RDO2FBQU07WUFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1QjtLQUNGO0lBRUQ7OztPQUdHO0lBQ0ksZ0JBQWdCLENBQUMsTUFBc0I7Ozs7Ozs7Ozs7UUFDNUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNwQzthQUFNO1lBQ0wsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbkM7S0FDRjtJQUVEOztPQUVHO0lBQ0gsSUFBVyxPQUFPO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQztLQUNuQztJQUVEOzs7O09BSUc7SUFDSCxJQUFXLE1BQU07UUFDZixPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUM7S0FDbEM7SUFFRCxJQUFXLFFBQVE7UUFDakIsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDO0tBQ3BDO0lBRUQsSUFBVyxjQUFjO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLGNBQWMsQ0FBQztLQUMxQztJQUVEOztPQUVHO0lBQ0ksS0FBSyxDQUFDLFFBQW9CLEVBQUUsR0FBRyxPQUFpQjs7Ozs7Ozs7OztRQUNyRCxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUM7S0FDdkQ7SUFFRDs7T0FFRztJQUNJLGFBQWEsQ0FBQyxRQUFvQjs7Ozs7Ozs7OztRQUN2QyxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDbkQ7SUFFRDs7T0FFRztJQUNJLGVBQWUsQ0FBQyxRQUFvQjs7Ozs7Ozs7OztRQUN6QyxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDckQ7SUFFTyxXQUFXO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2QsTUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ2xCO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQ2xCOzs7O0FBOUdVLDRCQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBHcmFudCB9IGZyb20gJy4vZ3JhbnQnO1xuaW1wb3J0IHsgSU1hbmFnZWRQb2xpY3kgfSBmcm9tICcuL21hbmFnZWQtcG9saWN5JztcbmltcG9ydCB7IFBvbGljeSB9IGZyb20gJy4vcG9saWN5JztcbmltcG9ydCB7IFBvbGljeVN0YXRlbWVudCB9IGZyb20gJy4vcG9saWN5LXN0YXRlbWVudCc7XG5pbXBvcnQgeyBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdCwgSVByaW5jaXBhbCwgUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQgfSBmcm9tICcuL3ByaW5jaXBhbHMnO1xuaW1wb3J0IHsgSVJvbGUsIFJvbGUsIFJvbGVQcm9wcyB9IGZyb20gJy4vcm9sZSc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBMYXp5Um9sZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIExhenlSb2xlUHJvcHMgZXh0ZW5kcyBSb2xlUHJvcHMge1xuXG59XG5cbi8qKlxuICogQW4gSUFNIHJvbGUgdGhhdCBvbmx5IGdldHMgYXR0YWNoZWQgdG8gdGhlIGNvbnN0cnVjdCB0cmVlIG9uY2UgaXQgZ2V0cyB1c2VkLCBub3QgYmVmb3JlXG4gKlxuICogVGhpcyBjb25zdHJ1Y3QgY2FuIGJlIHVzZWQgdG8gc2ltcGxpZnkgbG9naWMgaW4gb3RoZXIgY29uc3RydWN0c1xuICogd2hpY2ggbmVlZCB0byBjcmVhdGUgYSByb2xlIGJ1dCBvbmx5IGlmIGNlcnRhaW4gY29uZmlndXJhdGlvbnMgb2NjdXJcbiAqIChzdWNoIGFzIHdoZW4gQXV0b1NjYWxpbmcgaXMgY29uZmlndXJlZCkuIFRoZSByb2xlIGNhbiBiZSBjb25maWd1cmVkIGluIG9uZVxuICogcGxhY2UsIGJ1dCBpZiBpdCBuZXZlciBnZXRzIHVzZWQgaXQgZG9lc24ndCBnZXQgaW5zdGFudGlhdGVkIGFuZCB3aWxsXG4gKiBub3QgYmUgc3ludGhlc2l6ZWQgb3IgZGVwbG95ZWQuXG4gKlxuICogQHJlc291cmNlIEFXUzo6SUFNOjpSb2xlXG4gKi9cbmV4cG9ydCBjbGFzcyBMYXp5Um9sZSBleHRlbmRzIGNkay5SZXNvdXJjZSBpbXBsZW1lbnRzIElSb2xlIHtcbiAgcHVibGljIHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsOiBJUHJpbmNpcGFsID0gdGhpcztcbiAgcHVibGljIHJlYWRvbmx5IHByaW5jaXBhbEFjY291bnQ6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHRoaXMuZW52LmFjY291bnQ7XG4gIHB1YmxpYyByZWFkb25seSBhc3N1bWVSb2xlQWN0aW9uOiBzdHJpbmcgPSAnc3RzOkFzc3VtZVJvbGUnO1xuXG4gIHByaXZhdGUgcm9sZT86IFJvbGU7XG4gIHByaXZhdGUgcmVhZG9ubHkgc3RhdGVtZW50cyA9IG5ldyBBcnJheTxQb2xpY3lTdGF0ZW1lbnQ+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgcG9saWNpZXMgPSBuZXcgQXJyYXk8UG9saWN5PigpO1xuICBwcml2YXRlIHJlYWRvbmx5IG1hbmFnZWRQb2xpY2llcyA9IG5ldyBBcnJheTxJTWFuYWdlZFBvbGljeT4oKTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBMYXp5Um9sZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgcGVybWlzc2lvbiB0byB0aGUgcm9sZSdzIGRlZmF1bHQgcG9saWN5IGRvY3VtZW50LlxuICAgKiBJZiB0aGVyZSBpcyBubyBkZWZhdWx0IHBvbGljeSBhdHRhY2hlZCB0byB0aGlzIHJvbGUsIGl0IHdpbGwgYmUgY3JlYXRlZC5cbiAgICogQHBhcmFtIHN0YXRlbWVudCBUaGUgcGVybWlzc2lvbiBzdGF0ZW1lbnQgdG8gYWRkIHRvIHRoZSBwb2xpY3kgZG9jdW1lbnRcbiAgICovXG4gIHB1YmxpYyBhZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IEFkZFRvUHJpbmNpcGFsUG9saWN5UmVzdWx0IHtcbiAgICBpZiAodGhpcy5yb2xlKSB7XG4gICAgICByZXR1cm4gdGhpcy5yb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGVtZW50cy5wdXNoKHN0YXRlbWVudCk7XG4gICAgICByZXR1cm4geyBzdGF0ZW1lbnRBZGRlZDogdHJ1ZSwgcG9saWN5RGVwZW5kYWJsZTogdGhpcyB9O1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhZGRUb1BvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudCkuc3RhdGVtZW50QWRkZWQ7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgYSBwb2xpY3kgdG8gdGhpcyByb2xlLlxuICAgKiBAcGFyYW0gcG9saWN5IFRoZSBwb2xpY3kgdG8gYXR0YWNoXG4gICAqL1xuICBwdWJsaWMgYXR0YWNoSW5saW5lUG9saWN5KHBvbGljeTogUG9saWN5KTogdm9pZCB7XG4gICAgaWYgKHRoaXMucm9sZSkge1xuICAgICAgdGhpcy5yb2xlLmF0dGFjaElubGluZVBvbGljeShwb2xpY3kpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBvbGljaWVzLnB1c2gocG9saWN5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgYSBtYW5hZ2VkIHBvbGljeSB0byB0aGlzIHJvbGUuXG4gICAqIEBwYXJhbSBwb2xpY3kgVGhlIG1hbmFnZWQgcG9saWN5IHRvIGF0dGFjaC5cbiAgICovXG4gIHB1YmxpYyBhZGRNYW5hZ2VkUG9saWN5KHBvbGljeTogSU1hbmFnZWRQb2xpY3kpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yb2xlKSB7XG4gICAgICB0aGlzLnJvbGUuYWRkTWFuYWdlZFBvbGljeShwb2xpY3kpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1hbmFnZWRQb2xpY2llcy5wdXNoKHBvbGljeSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIEFSTiBvZiB0aGlzIHJvbGUuXG4gICAqL1xuICBwdWJsaWMgZ2V0IHJvbGVBcm4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW50aWF0ZSgpLnJvbGVBcm47XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3RhYmxlIGFuZCB1bmlxdWUgc3RyaW5nIGlkZW50aWZ5aW5nIHRoZSByb2xlIChpLmUuIEFJREFKUUFCTFpTNEEzUURVNTc2USlcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIGdldCByb2xlSWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW50aWF0ZSgpLnJvbGVJZDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcm9sZU5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW50aWF0ZSgpLnJvbGVOYW1lO1xuICB9XG5cbiAgcHVibGljIGdldCBwb2xpY3lGcmFnbWVudCgpOiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFudGlhdGUoKS5wb2xpY3lGcmFnbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCB0aGUgYWN0aW9ucyBkZWZpbmVkIGluIGFjdGlvbnMgdG8gdGhlIGlkZW50aXR5IFByaW5jaXBhbCBvbiB0aGlzIHJlc291cmNlLlxuICAgKi9cbiAgcHVibGljIGdyYW50KGlkZW50aXR5OiBJUHJpbmNpcGFsLCAuLi5hY3Rpb25zOiBzdHJpbmdbXSk6IEdyYW50IHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW50aWF0ZSgpLmdyYW50KGlkZW50aXR5LCAuLi5hY3Rpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCBwZXJtaXNzaW9ucyB0byB0aGUgZ2l2ZW4gcHJpbmNpcGFsIHRvIHBhc3MgdGhpcyByb2xlLlxuICAgKi9cbiAgcHVibGljIGdyYW50UGFzc1JvbGUoaWRlbnRpdHk6IElQcmluY2lwYWwpOiBHcmFudCB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFudGlhdGUoKS5ncmFudFBhc3NSb2xlKGlkZW50aXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCBwZXJtaXNzaW9ucyB0byB0aGUgZ2l2ZW4gcHJpbmNpcGFsIHRvIGFzc3VtZSB0aGlzIHJvbGUuXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRBc3N1bWVSb2xlKGlkZW50aXR5OiBJUHJpbmNpcGFsKTogR3JhbnQge1xuICAgIHJldHVybiB0aGlzLmluc3RhbnRpYXRlKCkuZ3JhbnRBc3N1bWVSb2xlKGlkZW50aXR5KTtcbiAgfVxuXG4gIHByaXZhdGUgaW5zdGFudGlhdGUoKTogUm9sZSB7XG4gICAgaWYgKCF0aGlzLnJvbGUpIHtcbiAgICAgIGNvbnN0IHJvbGUgPSBuZXcgUm9sZSh0aGlzLCAnRGVmYXVsdCcsIHRoaXMucHJvcHMpO1xuICAgICAgdGhpcy5zdGF0ZW1lbnRzLmZvckVhY2gocm9sZS5hZGRUb1BvbGljeS5iaW5kKHJvbGUpKTtcbiAgICAgIHRoaXMucG9saWNpZXMuZm9yRWFjaChyb2xlLmF0dGFjaElubGluZVBvbGljeS5iaW5kKHJvbGUpKTtcbiAgICAgIHRoaXMubWFuYWdlZFBvbGljaWVzLmZvckVhY2gocm9sZS5hZGRNYW5hZ2VkUG9saWN5LmJpbmQocm9sZSkpO1xuICAgICAgdGhpcy5yb2xlID0gcm9sZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucm9sZTtcbiAgfVxufVxuIl19