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
    /**
     * Access the Permissions Boundaries of a construct tree
     */
    static of(scope) {
        return new PermissionsBoundary(scope);
    }
    constructor(scope) {
        this.scope = scope;
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
_a = JSII_RTTI_SYMBOL_1;
PermissionsBoundary[_a] = { fqn: "@aws-cdk/aws-iam.PermissionsBoundary", version: "0.0.0" };
exports.PermissionsBoundary = PermissionsBoundary;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbnMtYm91bmRhcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwZXJtaXNzaW9ucy1ib3VuZGFyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBcUQ7QUFFckQsbURBQW1EO0FBR25EOzs7Ozs7O0dBT0c7QUFDSCxNQUFhLG1CQUFtQjtJQUM5Qjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBaUI7UUFDaEMsT0FBTyxJQUFJLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3ZDO0lBRUQsWUFBcUMsS0FBaUI7UUFBakIsVUFBSyxHQUFMLEtBQUssQ0FBWTtLQUNyRDtJQUVEOzs7Ozs7O09BT0c7SUFDSSxLQUFLLENBQUMsY0FBOEI7Ozs7Ozs7Ozs7UUFDekMsY0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ3pCLEtBQUssQ0FBQyxJQUFnQjtnQkFDcEIsSUFDRSxrQkFBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7b0JBQzdCLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSx1QkFBTyxDQUFDLHNCQUFzQixJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksdUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUNwSDtvQkFDQSxJQUFJLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLEVBQUUsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUM7aUJBQ2xGO1lBQ0gsQ0FBQztTQUNGLENBQUMsQ0FBQztLQUNKO0lBRUQ7O09BRUc7SUFDSSxLQUFLO1FBQ1YsY0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ3pCLEtBQUssQ0FBQyxJQUFnQjtnQkFDcEIsSUFDRSxrQkFBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7b0JBQzdCLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSx1QkFBTyxDQUFDLHNCQUFzQixJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksdUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUNwSDtvQkFDQSxJQUFJLENBQUMsMkJBQTJCLENBQUMscUJBQXFCLENBQUMsQ0FBQztpQkFDekQ7WUFDSCxDQUFDO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7Ozs7QUE5Q1Usa0RBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXNwZWN0cywgQ2ZuUmVzb3VyY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmblJvbGUsIENmblVzZXIgfSBmcm9tICcuL2lhbS5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSU1hbmFnZWRQb2xpY3kgfSBmcm9tICcuL21hbmFnZWQtcG9saWN5JztcblxuLyoqXG4gKiBNb2RpZnkgdGhlIFBlcm1pc3Npb25zIEJvdW5kYXJpZXMgb2YgVXNlcnMgYW5kIFJvbGVzIGluIGEgY29uc3RydWN0IHRyZWVcbiAqXG4gKiBgYGB0c1xuICogY29uc3QgcG9saWN5ID0gaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdSZWFkT25seUFjY2VzcycpO1xuICogaWFtLlBlcm1pc3Npb25zQm91bmRhcnkub2YodGhpcykuYXBwbHkocG9saWN5KTtcbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgUGVybWlzc2lvbnNCb3VuZGFyeSB7XG4gIC8qKlxuICAgKiBBY2Nlc3MgdGhlIFBlcm1pc3Npb25zIEJvdW5kYXJpZXMgb2YgYSBjb25zdHJ1Y3QgdHJlZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBvZihzY29wZTogSUNvbnN0cnVjdCk6IFBlcm1pc3Npb25zQm91bmRhcnkge1xuICAgIHJldHVybiBuZXcgUGVybWlzc2lvbnNCb3VuZGFyeShzY29wZSk7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgc2NvcGU6IElDb25zdHJ1Y3QpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSB0aGUgZ2l2ZW4gcG9saWN5IGFzIFBlcm1pc3Npb25zIEJvdW5kYXJ5IHRvIGFsbCBSb2xlcyBhbmQgVXNlcnMgaW5cbiAgICogdGhlIHNjb3BlLlxuICAgKlxuICAgKiBXaWxsIG92ZXJyaWRlIGFueSBQZXJtaXNzaW9ucyBCb3VuZGFyaWVzIGNvbmZpZ3VyZWQgcHJldmlvdXNseTsgaW4gY2FzZVxuICAgKiBhIFBlcm1pc3Npb24gQm91bmRhcnkgaXMgYXBwbGllZCBpbiBtdWx0aXBsZSBzY29wZXMsIHRoZSBCb3VuZGFyeSBhcHBsaWVkXG4gICAqIGNsb3Nlc3QgdG8gdGhlIFJvbGUgd2lucy5cbiAgICovXG4gIHB1YmxpYyBhcHBseShib3VuZGFyeVBvbGljeTogSU1hbmFnZWRQb2xpY3kpIHtcbiAgICBBc3BlY3RzLm9mKHRoaXMuc2NvcGUpLmFkZCh7XG4gICAgICB2aXNpdChub2RlOiBJQ29uc3RydWN0KSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBDZm5SZXNvdXJjZS5pc0NmblJlc291cmNlKG5vZGUpICYmXG4gICAgICAgICAgICAobm9kZS5jZm5SZXNvdXJjZVR5cGUgPT0gQ2ZuUm9sZS5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FIHx8IG5vZGUuY2ZuUmVzb3VyY2VUeXBlID09IENmblVzZXIuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgbm9kZS5hZGRQcm9wZXJ0eU92ZXJyaWRlKCdQZXJtaXNzaW9uc0JvdW5kYXJ5JywgYm91bmRhcnlQb2xpY3kubWFuYWdlZFBvbGljeUFybik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHByZXZpb3VzbHkgYXBwbGllZCBQZXJtaXNzaW9ucyBCb3VuZGFyaWVzXG4gICAqL1xuICBwdWJsaWMgY2xlYXIoKSB7XG4gICAgQXNwZWN0cy5vZih0aGlzLnNjb3BlKS5hZGQoe1xuICAgICAgdmlzaXQobm9kZTogSUNvbnN0cnVjdCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgQ2ZuUmVzb3VyY2UuaXNDZm5SZXNvdXJjZShub2RlKSAmJlxuICAgICAgICAgICAgKG5vZGUuY2ZuUmVzb3VyY2VUeXBlID09IENmblJvbGUuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSB8fCBub2RlLmNmblJlc291cmNlVHlwZSA9PSBDZm5Vc2VyLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpXG4gICAgICAgICkge1xuICAgICAgICAgIG5vZGUuYWRkUHJvcGVydHlEZWxldGlvbk92ZXJyaWRlKCdQZXJtaXNzaW9uc0JvdW5kYXJ5Jyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==