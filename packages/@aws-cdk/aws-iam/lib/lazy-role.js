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
exports.LazyRole = LazyRole;
_a = JSII_RTTI_SYMBOL_1;
LazyRole[_a] = { fqn: "@aws-cdk/aws-iam.LazyRole", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF6eS1yb2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGF6eS1yb2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFDQUFxQztBQU9yQyxpQ0FBZ0Q7QUFTaEQ7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQWEsUUFBUyxTQUFRLEdBQUcsQ0FBQyxRQUFRO0lBVXhDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQW1CLEtBQW9CO1FBQzdFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFEd0MsVUFBSyxHQUFMLEtBQUssQ0FBZTtRQVQvRCxtQkFBYyxHQUFlLElBQUksQ0FBQztRQUNsQyxxQkFBZ0IsR0FBdUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDeEQscUJBQWdCLEdBQVcsZ0JBQWdCLENBQUM7UUFHM0MsZUFBVSxHQUFHLElBQUksS0FBSyxFQUFtQixDQUFDO1FBQzFDLGFBQVEsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBQy9CLG9CQUFlLEdBQUcsSUFBSSxLQUFLLEVBQWtCLENBQUM7Ozs7OzsrQ0FScEQsUUFBUTs7OztLQVlsQjtJQUVEOzs7O09BSUc7SUFDSSxvQkFBb0IsQ0FBQyxTQUEwQjs7Ozs7Ozs7OztRQUNwRCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDYixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDbEQ7YUFBTTtZQUNMLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxDQUFDO1NBQ3pEO0tBQ0Y7SUFFTSxXQUFXLENBQUMsU0FBMEI7Ozs7Ozs7Ozs7UUFDM0MsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsY0FBYyxDQUFDO0tBQzVEO0lBRUQ7OztPQUdHO0lBQ0ksa0JBQWtCLENBQUMsTUFBYzs7Ozs7Ozs7OztRQUN0QyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3RDO2FBQU07WUFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1QjtLQUNGO0lBRUQ7OztPQUdHO0lBQ0ksZ0JBQWdCLENBQUMsTUFBc0I7Ozs7Ozs7Ozs7UUFDNUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNwQzthQUFNO1lBQ0wsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbkM7S0FDRjtJQUVEOztPQUVHO0lBQ0gsSUFBVyxPQUFPO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQztLQUNuQztJQUVEOzs7O09BSUc7SUFDSCxJQUFXLE1BQU07UUFDZixPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUM7S0FDbEM7SUFFRCxJQUFXLFFBQVE7UUFDakIsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDO0tBQ3BDO0lBRUQsSUFBVyxjQUFjO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLGNBQWMsQ0FBQztLQUMxQztJQUVEOztPQUVHO0lBQ0ksS0FBSyxDQUFDLFFBQW9CLEVBQUUsR0FBRyxPQUFpQjs7Ozs7Ozs7OztRQUNyRCxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUM7S0FDdkQ7SUFFRDs7T0FFRztJQUNJLGFBQWEsQ0FBQyxRQUFvQjs7Ozs7Ozs7OztRQUN2QyxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDbkQ7SUFFRDs7T0FFRztJQUNJLGVBQWUsQ0FBQyxRQUFvQjs7Ozs7Ozs7OztRQUN6QyxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDckQ7SUFFTyxXQUFXO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2QsTUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ2xCO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQ2xCOztBQTlHSCw0QkErR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEdyYW50IH0gZnJvbSAnLi9ncmFudCc7XG5pbXBvcnQgeyBJTWFuYWdlZFBvbGljeSB9IGZyb20gJy4vbWFuYWdlZC1wb2xpY3knO1xuaW1wb3J0IHsgUG9saWN5IH0gZnJvbSAnLi9wb2xpY3knO1xuaW1wb3J0IHsgUG9saWN5U3RhdGVtZW50IH0gZnJvbSAnLi9wb2xpY3ktc3RhdGVtZW50JztcbmltcG9ydCB7IEFkZFRvUHJpbmNpcGFsUG9saWN5UmVzdWx0LCBJUHJpbmNpcGFsLCBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB9IGZyb20gJy4vcHJpbmNpcGFscyc7XG5pbXBvcnQgeyBJUm9sZSwgUm9sZSwgUm9sZVByb3BzIH0gZnJvbSAnLi9yb2xlJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIExhenlSb2xlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGF6eVJvbGVQcm9wcyBleHRlbmRzIFJvbGVQcm9wcyB7XG5cbn1cblxuLyoqXG4gKiBBbiBJQU0gcm9sZSB0aGF0IG9ubHkgZ2V0cyBhdHRhY2hlZCB0byB0aGUgY29uc3RydWN0IHRyZWUgb25jZSBpdCBnZXRzIHVzZWQsIG5vdCBiZWZvcmVcbiAqXG4gKiBUaGlzIGNvbnN0cnVjdCBjYW4gYmUgdXNlZCB0byBzaW1wbGlmeSBsb2dpYyBpbiBvdGhlciBjb25zdHJ1Y3RzXG4gKiB3aGljaCBuZWVkIHRvIGNyZWF0ZSBhIHJvbGUgYnV0IG9ubHkgaWYgY2VydGFpbiBjb25maWd1cmF0aW9ucyBvY2N1clxuICogKHN1Y2ggYXMgd2hlbiBBdXRvU2NhbGluZyBpcyBjb25maWd1cmVkKS4gVGhlIHJvbGUgY2FuIGJlIGNvbmZpZ3VyZWQgaW4gb25lXG4gKiBwbGFjZSwgYnV0IGlmIGl0IG5ldmVyIGdldHMgdXNlZCBpdCBkb2Vzbid0IGdldCBpbnN0YW50aWF0ZWQgYW5kIHdpbGxcbiAqIG5vdCBiZSBzeW50aGVzaXplZCBvciBkZXBsb3llZC5cbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpJQU06OlJvbGVcbiAqL1xuZXhwb3J0IGNsYXNzIExhenlSb2xlIGV4dGVuZHMgY2RrLlJlc291cmNlIGltcGxlbWVudHMgSVJvbGUge1xuICBwdWJsaWMgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IElQcmluY2lwYWwgPSB0aGlzO1xuICBwdWJsaWMgcmVhZG9ubHkgcHJpbmNpcGFsQWNjb3VudDogc3RyaW5nIHwgdW5kZWZpbmVkID0gdGhpcy5lbnYuYWNjb3VudDtcbiAgcHVibGljIHJlYWRvbmx5IGFzc3VtZVJvbGVBY3Rpb246IHN0cmluZyA9ICdzdHM6QXNzdW1lUm9sZSc7XG5cbiAgcHJpdmF0ZSByb2xlPzogUm9sZTtcbiAgcHJpdmF0ZSByZWFkb25seSBzdGF0ZW1lbnRzID0gbmV3IEFycmF5PFBvbGljeVN0YXRlbWVudD4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBwb2xpY2llcyA9IG5ldyBBcnJheTxQb2xpY3k+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgbWFuYWdlZFBvbGljaWVzID0gbmV3IEFycmF5PElNYW5hZ2VkUG9saWN5PigpO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IExhenlSb2xlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBwZXJtaXNzaW9uIHRvIHRoZSByb2xlJ3MgZGVmYXVsdCBwb2xpY3kgZG9jdW1lbnQuXG4gICAqIElmIHRoZXJlIGlzIG5vIGRlZmF1bHQgcG9saWN5IGF0dGFjaGVkIHRvIHRoaXMgcm9sZSwgaXQgd2lsbCBiZSBjcmVhdGVkLlxuICAgKiBAcGFyYW0gc3RhdGVtZW50IFRoZSBwZXJtaXNzaW9uIHN0YXRlbWVudCB0byBhZGQgdG8gdGhlIHBvbGljeSBkb2N1bWVudFxuICAgKi9cbiAgcHVibGljIGFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQge1xuICAgIGlmICh0aGlzLnJvbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZW1lbnRzLnB1c2goc3RhdGVtZW50KTtcbiAgICAgIHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiB0cnVlLCBwb2xpY3lEZXBlbmRhYmxlOiB0aGlzIH07XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFkZFRvUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KS5zdGF0ZW1lbnRBZGRlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhIHBvbGljeSB0byB0aGlzIHJvbGUuXG4gICAqIEBwYXJhbSBwb2xpY3kgVGhlIHBvbGljeSB0byBhdHRhY2hcbiAgICovXG4gIHB1YmxpYyBhdHRhY2hJbmxpbmVQb2xpY3kocG9saWN5OiBQb2xpY3kpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yb2xlKSB7XG4gICAgICB0aGlzLnJvbGUuYXR0YWNoSW5saW5lUG9saWN5KHBvbGljeSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucG9saWNpZXMucHVzaChwb2xpY3kpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhIG1hbmFnZWQgcG9saWN5IHRvIHRoaXMgcm9sZS5cbiAgICogQHBhcmFtIHBvbGljeSBUaGUgbWFuYWdlZCBwb2xpY3kgdG8gYXR0YWNoLlxuICAgKi9cbiAgcHVibGljIGFkZE1hbmFnZWRQb2xpY3kocG9saWN5OiBJTWFuYWdlZFBvbGljeSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJvbGUpIHtcbiAgICAgIHRoaXMucm9sZS5hZGRNYW5hZ2VkUG9saWN5KHBvbGljeSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWFuYWdlZFBvbGljaWVzLnB1c2gocG9saWN5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgQVJOIG9mIHRoaXMgcm9sZS5cbiAgICovXG4gIHB1YmxpYyBnZXQgcm9sZUFybigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmluc3RhbnRpYXRlKCkucm9sZUFybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzdGFibGUgYW5kIHVuaXF1ZSBzdHJpbmcgaWRlbnRpZnlpbmcgdGhlIHJvbGUgKGkuZS4gQUlEQUpRQUJMWlM0QTNRRFU1NzZRKVxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgZ2V0IHJvbGVJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmluc3RhbnRpYXRlKCkucm9sZUlkO1xuICB9XG5cbiAgcHVibGljIGdldCByb2xlTmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmluc3RhbnRpYXRlKCkucm9sZU5hbWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHBvbGljeUZyYWdtZW50KCk6IFByaW5jaXBhbFBvbGljeUZyYWdtZW50IHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW50aWF0ZSgpLnBvbGljeUZyYWdtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBhY3Rpb25zIGRlZmluZWQgaW4gYWN0aW9ucyB0byB0aGUgaWRlbnRpdHkgUHJpbmNpcGFsIG9uIHRoaXMgcmVzb3VyY2UuXG4gICAqL1xuICBwdWJsaWMgZ3JhbnQoaWRlbnRpdHk6IElQcmluY2lwYWwsIC4uLmFjdGlvbnM6IHN0cmluZ1tdKTogR3JhbnQge1xuICAgIHJldHVybiB0aGlzLmluc3RhbnRpYXRlKCkuZ3JhbnQoaWRlbnRpdHksIC4uLmFjdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHBlcm1pc3Npb25zIHRvIHRoZSBnaXZlbiBwcmluY2lwYWwgdG8gcGFzcyB0aGlzIHJvbGUuXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRQYXNzUm9sZShpZGVudGl0eTogSVByaW5jaXBhbCk6IEdyYW50IHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW50aWF0ZSgpLmdyYW50UGFzc1JvbGUoaWRlbnRpdHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHBlcm1pc3Npb25zIHRvIHRoZSBnaXZlbiBwcmluY2lwYWwgdG8gYXNzdW1lIHRoaXMgcm9sZS5cbiAgICovXG4gIHB1YmxpYyBncmFudEFzc3VtZVJvbGUoaWRlbnRpdHk6IElQcmluY2lwYWwpOiBHcmFudCB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFudGlhdGUoKS5ncmFudEFzc3VtZVJvbGUoaWRlbnRpdHkpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbnN0YW50aWF0ZSgpOiBSb2xlIHtcbiAgICBpZiAoIXRoaXMucm9sZSkge1xuICAgICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHRoaXMsICdEZWZhdWx0JywgdGhpcy5wcm9wcyk7XG4gICAgICB0aGlzLnN0YXRlbWVudHMuZm9yRWFjaChyb2xlLmFkZFRvUG9saWN5LmJpbmQocm9sZSkpO1xuICAgICAgdGhpcy5wb2xpY2llcy5mb3JFYWNoKHJvbGUuYXR0YWNoSW5saW5lUG9saWN5LmJpbmQocm9sZSkpO1xuICAgICAgdGhpcy5tYW5hZ2VkUG9saWNpZXMuZm9yRWFjaChyb2xlLmFkZE1hbmFnZWRQb2xpY3kuYmluZChyb2xlKSk7XG4gICAgICB0aGlzLnJvbGUgPSByb2xlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5yb2xlO1xuICB9XG59XG4iXX0=