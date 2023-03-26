"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsBoundary = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const iam_generated_1 = require("./iam.generated");
/**
 * Modify the Permissions Boundaries of Users and Roles in a construct tree
 *
 * ```ts
 * const policy = iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess');
 * iam.PermissionsBoundary.of(this).apply(policy);
 * ```
 */
class PermissionsBoundary {
    constructor(scope) {
        this.scope = scope;
    }
    /**
     * Access the Permissions Boundaries of a construct tree
     */
    static of(scope) {
        return new PermissionsBoundary(scope);
    }
    /**
     * Apply the given policy as Permissions Boundary to all Roles and Users in
     * the scope.
     *
     * Will override any Permissions Boundaries configured previously; in case
     * a Permission Boundary is applied in multiple scopes, the Boundary applied
     * closest to the Role wins.
     */
    apply(boundaryPolicy) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IManagedPolicy(boundaryPolicy);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.apply);
            }
            throw error;
        }
        core_1.Aspects.of(this.scope).add({
            visit(node) {
                if (core_1.CfnResource.isCfnResource(node) &&
                    (node.cfnResourceType == iam_generated_1.CfnRole.CFN_RESOURCE_TYPE_NAME || node.cfnResourceType == iam_generated_1.CfnUser.CFN_RESOURCE_TYPE_NAME)) {
                    node.addPropertyOverride('PermissionsBoundary', boundaryPolicy.managedPolicyArn);
                }
            },
        });
    }
    /**
     * Remove previously applied Permissions Boundaries
     */
    clear() {
        core_1.Aspects.of(this.scope).add({
            visit(node) {
                if (core_1.CfnResource.isCfnResource(node) &&
                    (node.cfnResourceType == iam_generated_1.CfnRole.CFN_RESOURCE_TYPE_NAME || node.cfnResourceType == iam_generated_1.CfnUser.CFN_RESOURCE_TYPE_NAME)) {
                    node.addPropertyDeletionOverride('PermissionsBoundary');
                }
            },
        });
    }
}
exports.PermissionsBoundary = PermissionsBoundary;
_a = JSII_RTTI_SYMBOL_1;
PermissionsBoundary[_a] = { fqn: "@aws-cdk/aws-iam.PermissionsBoundary", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbnMtYm91bmRhcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwZXJtaXNzaW9ucy1ib3VuZGFyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBcUQ7QUFFckQsbURBQW1EO0FBR25EOzs7Ozs7O0dBT0c7QUFDSCxNQUFhLG1CQUFtQjtJQVE5QixZQUFxQyxLQUFpQjtRQUFqQixVQUFLLEdBQUwsS0FBSyxDQUFZO0tBQ3JEO0lBUkQ7O09BRUc7SUFDSSxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQWlCO1FBQ2hDLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN2QztJQUtEOzs7Ozs7O09BT0c7SUFDSSxLQUFLLENBQUMsY0FBOEI7Ozs7Ozs7Ozs7UUFDekMsY0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ3pCLEtBQUssQ0FBQyxJQUFnQjtnQkFDcEIsSUFDRSxrQkFBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7b0JBQzdCLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSx1QkFBTyxDQUFDLHNCQUFzQixJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksdUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUNwSDtvQkFDQSxJQUFJLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLEVBQUUsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUM7aUJBQ2xGO1lBQ0gsQ0FBQztTQUNGLENBQUMsQ0FBQztLQUNKO0lBRUQ7O09BRUc7SUFDSSxLQUFLO1FBQ1YsY0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ3pCLEtBQUssQ0FBQyxJQUFnQjtnQkFDcEIsSUFDRSxrQkFBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7b0JBQzdCLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSx1QkFBTyxDQUFDLHNCQUFzQixJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksdUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUNwSDtvQkFDQSxJQUFJLENBQUMsMkJBQTJCLENBQUMscUJBQXFCLENBQUMsQ0FBQztpQkFDekQ7WUFDSCxDQUFDO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7O0FBOUNILGtEQStDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFzcGVjdHMsIENmblJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5Sb2xlLCBDZm5Vc2VyIH0gZnJvbSAnLi9pYW0uZ2VuZXJhdGVkJztcbmltcG9ydCB7IElNYW5hZ2VkUG9saWN5IH0gZnJvbSAnLi9tYW5hZ2VkLXBvbGljeSc7XG5cbi8qKlxuICogTW9kaWZ5IHRoZSBQZXJtaXNzaW9ucyBCb3VuZGFyaWVzIG9mIFVzZXJzIGFuZCBSb2xlcyBpbiBhIGNvbnN0cnVjdCB0cmVlXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IHBvbGljeSA9IGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnUmVhZE9ubHlBY2Nlc3MnKTtcbiAqIGlhbS5QZXJtaXNzaW9uc0JvdW5kYXJ5Lm9mKHRoaXMpLmFwcGx5KHBvbGljeSk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIFBlcm1pc3Npb25zQm91bmRhcnkge1xuICAvKipcbiAgICogQWNjZXNzIHRoZSBQZXJtaXNzaW9ucyBCb3VuZGFyaWVzIG9mIGEgY29uc3RydWN0IHRyZWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgb2Yoc2NvcGU6IElDb25zdHJ1Y3QpOiBQZXJtaXNzaW9uc0JvdW5kYXJ5IHtcbiAgICByZXR1cm4gbmV3IFBlcm1pc3Npb25zQm91bmRhcnkoc2NvcGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHNjb3BlOiBJQ29uc3RydWN0KSB7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgdGhlIGdpdmVuIHBvbGljeSBhcyBQZXJtaXNzaW9ucyBCb3VuZGFyeSB0byBhbGwgUm9sZXMgYW5kIFVzZXJzIGluXG4gICAqIHRoZSBzY29wZS5cbiAgICpcbiAgICogV2lsbCBvdmVycmlkZSBhbnkgUGVybWlzc2lvbnMgQm91bmRhcmllcyBjb25maWd1cmVkIHByZXZpb3VzbHk7IGluIGNhc2VcbiAgICogYSBQZXJtaXNzaW9uIEJvdW5kYXJ5IGlzIGFwcGxpZWQgaW4gbXVsdGlwbGUgc2NvcGVzLCB0aGUgQm91bmRhcnkgYXBwbGllZFxuICAgKiBjbG9zZXN0IHRvIHRoZSBSb2xlIHdpbnMuXG4gICAqL1xuICBwdWJsaWMgYXBwbHkoYm91bmRhcnlQb2xpY3k6IElNYW5hZ2VkUG9saWN5KSB7XG4gICAgQXNwZWN0cy5vZih0aGlzLnNjb3BlKS5hZGQoe1xuICAgICAgdmlzaXQobm9kZTogSUNvbnN0cnVjdCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgQ2ZuUmVzb3VyY2UuaXNDZm5SZXNvdXJjZShub2RlKSAmJlxuICAgICAgICAgICAgKG5vZGUuY2ZuUmVzb3VyY2VUeXBlID09IENmblJvbGUuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSB8fCBub2RlLmNmblJlc291cmNlVHlwZSA9PSBDZm5Vc2VyLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpXG4gICAgICAgICkge1xuICAgICAgICAgIG5vZGUuYWRkUHJvcGVydHlPdmVycmlkZSgnUGVybWlzc2lvbnNCb3VuZGFyeScsIGJvdW5kYXJ5UG9saWN5Lm1hbmFnZWRQb2xpY3lBcm4pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBwcmV2aW91c2x5IGFwcGxpZWQgUGVybWlzc2lvbnMgQm91bmRhcmllc1xuICAgKi9cbiAgcHVibGljIGNsZWFyKCkge1xuICAgIEFzcGVjdHMub2YodGhpcy5zY29wZSkuYWRkKHtcbiAgICAgIHZpc2l0KG5vZGU6IElDb25zdHJ1Y3QpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIENmblJlc291cmNlLmlzQ2ZuUmVzb3VyY2Uobm9kZSkgJiZcbiAgICAgICAgICAgIChub2RlLmNmblJlc291cmNlVHlwZSA9PSBDZm5Sb2xlLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUgfHwgbm9kZS5jZm5SZXNvdXJjZVR5cGUgPT0gQ2ZuVXNlci5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKVxuICAgICAgICApIHtcbiAgICAgICAgICBub2RlLmFkZFByb3BlcnR5RGVsZXRpb25PdmVycmlkZSgnUGVybWlzc2lvbnNCb3VuZGFyeScpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG4iXX0=