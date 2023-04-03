"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const iam_generated_1 = require("./iam.generated");
const policy_1 = require("./policy");
const principals_1 = require("./principals");
const util_1 = require("./private/util");
class GroupBase extends core_1.Resource {
    constructor() {
        super(...arguments);
        this.grantPrincipal = this;
        this.principalAccount = this.env.account;
        this.assumeRoleAction = 'sts:AssumeRole';
        this.attachedPolicies = new util_1.AttachedPolicies();
    }
    get policyFragment() {
        return new principals_1.ArnPrincipal(this.groupArn).policyFragment;
    }
    /**
     * Attaches a policy to this group.
     * @param policy The policy to attach.
     */
    attachInlinePolicy(policy) {
        this.attachedPolicies.attach(policy);
        policy.attachToGroup(this);
    }
    addManagedPolicy(_policy) {
    }
    /**
     * Adds a user to this group.
     */
    addUser(user) {
        user.addToGroup(this);
    }
    /**
     * Adds an IAM statement to the default policy.
     */
    addToPrincipalPolicy(statement) {
        if (!this.defaultPolicy) {
            this.defaultPolicy = new policy_1.Policy(this, 'DefaultPolicy');
            this.defaultPolicy.attachToGroup(this);
        }
        this.defaultPolicy.addStatements(statement);
        return { statementAdded: true, policyDependable: this.defaultPolicy };
    }
    addToPolicy(statement) {
        return this.addToPrincipalPolicy(statement).statementAdded;
    }
}
/**
 * An IAM Group (collection of IAM users) lets you specify permissions for
 * multiple users, which can make it easier to manage permissions for those users.
 *
 * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html
 */
class Group extends GroupBase {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.groupName,
        });
        this.managedPolicies = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_GroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Group);
            }
            throw error;
        }
        this.managedPolicies.push(...props.managedPolicies || []);
        const group = new iam_generated_1.CfnGroup(this, 'Resource', {
            groupName: this.physicalName,
            managedPolicyArns: core_1.Lazy.list({ produce: () => this.managedPolicies.map(p => p.managedPolicyArn) }, { omitEmpty: true }),
            path: props.path,
        });
        this.groupName = this.getResourceNameAttribute(group.ref);
        this.groupArn = this.getResourceArnAttribute(group.attrArn, {
            region: '',
            service: 'iam',
            resource: 'group',
            // Removes leading slash from path
            resourceName: `${props.path ? props.path.substr(props.path.charAt(0) === '/' ? 1 : 0) : ''}${this.physicalName}`,
        });
        this.managedPoliciesExceededWarning();
    }
    /**
     * Import an external group by ARN.
     *
     * If the imported Group ARN is a Token (such as a
     * `CfnParameter.valueAsString` or a `Fn.importValue()`) *and* the referenced
     * group has a `path` (like `arn:...:group/AdminGroup/NetworkAdmin`), the
     * `groupName` property will not resolve to the correct value. Instead it
     * will resolve to the first path component. We unfortunately cannot express
     * the correct calculation of the full path name as a CloudFormation
     * expression. In this scenario the Group ARN should be supplied without the
     * `path` in order to resolve the correct group resource.
     *
     * @param scope construct scope
     * @param id construct id
     * @param groupArn the ARN of the group to import (e.g. `arn:aws:iam::account-id:group/group-name`)
     */
    static fromGroupArn(scope, id, groupArn) {
        const arnComponents = core_1.Stack.of(scope).splitArn(groupArn, core_1.ArnFormat.SLASH_RESOURCE_NAME);
        const groupName = arnComponents.resourceName;
        class Import extends GroupBase {
            constructor() {
                super(...arguments);
                this.groupName = groupName;
                this.groupArn = groupArn;
                this.principalAccount = arnComponents.account;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Import an existing group by given name (with path).
     * This method has same caveats of `fromGroupArn`
     *
     * @param scope construct scope
     * @param id construct id
     * @param groupName the groupName (path included) of the existing group to import
     */
    static fromGroupName(scope, id, groupName) {
        const groupArn = core_1.Stack.of(scope).formatArn({
            service: 'iam',
            region: '',
            resource: 'group',
            resourceName: groupName,
        });
        return Group.fromGroupArn(scope, id, groupArn);
    }
    /**
     * Attaches a managed policy to this group. See [IAM and AWS STS quotas, name requirements, and character limits]
     * (https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html#reference_iam-quotas-entities)
     * for quota of managed policies attached to an IAM group.
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
        if (this.managedPolicies.find(mp => mp === policy)) {
            return;
        }
        this.managedPolicies.push(policy);
        this.managedPoliciesExceededWarning();
    }
    managedPoliciesExceededWarning() {
        if (this.managedPolicies.length > 10) {
            core_1.Annotations.of(this).addWarning(`You added ${this.managedPolicies.length} to IAM Group ${this.physicalName}. The maximum number of managed policies attached to an IAM group is 10.`);
        }
    }
}
exports.Group = Group;
_a = JSII_RTTI_SYMBOL_1;
Group[_a] = { fqn: "@aws-cdk/aws-iam.Group", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBOEU7QUFFOUUsbURBQTJDO0FBRzNDLHFDQUFrQztBQUVsQyw2Q0FBNkc7QUFDN0cseUNBQWtEO0FBOERsRCxNQUFlLFNBQVUsU0FBUSxlQUFRO0lBQXpDOztRQUlrQixtQkFBYyxHQUFlLElBQUksQ0FBQztRQUNsQyxxQkFBZ0IsR0FBdUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDeEQscUJBQWdCLEdBQVcsZ0JBQWdCLENBQUM7UUFFM0MscUJBQWdCLEdBQUcsSUFBSSx1QkFBZ0IsRUFBRSxDQUFDO0lBMkM3RCxDQUFDO0lBeENDLElBQVcsY0FBYztRQUN2QixPQUFPLElBQUkseUJBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsY0FBYyxDQUFDO0tBQ3ZEO0lBRUQ7OztPQUdHO0lBQ0ksa0JBQWtCLENBQUMsTUFBYztRQUN0QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDNUI7SUFFTSxnQkFBZ0IsQ0FBQyxPQUF1QjtLQUU5QztJQUVEOztPQUVHO0lBQ0ksT0FBTyxDQUFDLElBQVc7UUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN2QjtJQUVEOztPQUVHO0lBQ0ksb0JBQW9CLENBQUMsU0FBMEI7UUFDcEQsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEM7UUFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLGFB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QUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUN6QyxPQUFPLEVBQUUsS0FBSztZQUNkLE1BQU0sRUFBRSxFQUFFO1lBQ1YsUUFBUSxFQUFFLE9BQU87WUFDakIsWUFBWSxFQUFFLFNBQVM7U0FDeEIsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDaEQ7SUFnQ0Q7Ozs7O09BS0c7SUFDSSxnQkFBZ0IsQ0FBQyxNQUFzQjs7Ozs7Ozs7OztRQUM1QyxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxFQUFFO1lBQUUsT0FBTztTQUFFO1FBQy9ELElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyw4QkFBOEIsRUFBRSxDQUFDO0tBQ3ZDO0lBRU8sOEJBQThCO1FBQ3BDLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFO1lBQ3BDLGtCQUFXLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxhQUFhLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxpQkFBaUIsSUFBSSxDQUFDLFlBQVksMEVBQTBFLENBQUMsQ0FBQztTQUN2TDtLQUNGOztBQTdGSCxzQkE4RkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbm5vdGF0aW9ucywgQXJuRm9ybWF0LCBMYXp5LCBSZXNvdXJjZSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuR3JvdXAgfSBmcm9tICcuL2lhbS5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSUlkZW50aXR5IH0gZnJvbSAnLi9pZGVudGl0eS1iYXNlJztcbmltcG9ydCB7IElNYW5hZ2VkUG9saWN5IH0gZnJvbSAnLi9tYW5hZ2VkLXBvbGljeSc7XG5pbXBvcnQgeyBQb2xpY3kgfSBmcm9tICcuL3BvbGljeSc7XG5pbXBvcnQgeyBQb2xpY3lTdGF0ZW1lbnQgfSBmcm9tICcuL3BvbGljeS1zdGF0ZW1lbnQnO1xuaW1wb3J0IHsgQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQsIEFyblByaW5jaXBhbCwgSVByaW5jaXBhbCwgUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQgfSBmcm9tICcuL3ByaW5jaXBhbHMnO1xuaW1wb3J0IHsgQXR0YWNoZWRQb2xpY2llcyB9IGZyb20gJy4vcHJpdmF0ZS91dGlsJztcbmltcG9ydCB7IElVc2VyIH0gZnJvbSAnLi91c2VyJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIElBTSBHcm91cC5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9pZF9ncm91cHMuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElHcm91cCBleHRlbmRzIElJZGVudGl0eSB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBJQU0gR3JvdXAgTmFtZVxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBncm91cE5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgSUFNIEdyb3VwIEFSTlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBncm91cEFybjogc3RyaW5nO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGFuIElBTSBncm91cFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEdyb3VwUHJvcHMge1xuICAvKipcbiAgICogQSBuYW1lIGZvciB0aGUgSUFNIGdyb3VwLiBGb3IgdmFsaWQgdmFsdWVzLCBzZWUgdGhlIEdyb3VwTmFtZSBwYXJhbWV0ZXJcbiAgICogZm9yIHRoZSBDcmVhdGVHcm91cCBhY3Rpb24gaW4gdGhlIElBTSBBUEkgUmVmZXJlbmNlLiBJZiB5b3UgZG9uJ3Qgc3BlY2lmeVxuICAgKiBhIG5hbWUsIEFXUyBDbG91ZEZvcm1hdGlvbiBnZW5lcmF0ZXMgYSB1bmlxdWUgcGh5c2ljYWwgSUQgYW5kIHVzZXMgdGhhdFxuICAgKiBJRCBmb3IgdGhlIGdyb3VwIG5hbWUuXG4gICAqXG4gICAqIElmIHlvdSBzcGVjaWZ5IGEgbmFtZSwgeW91IG11c3Qgc3BlY2lmeSB0aGUgQ0FQQUJJTElUWV9OQU1FRF9JQU0gdmFsdWUgdG9cbiAgICogYWNrbm93bGVkZ2UgeW91ciB0ZW1wbGF0ZSdzIGNhcGFiaWxpdGllcy4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZVxuICAgKiBBY2tub3dsZWRnaW5nIElBTSBSZXNvdXJjZXMgaW4gQVdTIENsb3VkRm9ybWF0aW9uIFRlbXBsYXRlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgR2VuZXJhdGVkIGJ5IENsb3VkRm9ybWF0aW9uIChyZWNvbW1lbmRlZClcbiAgICovXG4gIHJlYWRvbmx5IGdyb3VwTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogQSBsaXN0IG9mIG1hbmFnZWQgcG9saWNpZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgcm9sZS5cbiAgICpcbiAgICogWW91IGNhbiBhZGQgbWFuYWdlZCBwb2xpY2llcyBsYXRlciB1c2luZ1xuICAgKiBgYWRkTWFuYWdlZFBvbGljeShNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZShwb2xpY3lOYW1lKSlgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIG1hbmFnZWQgcG9saWNpZXMuXG4gICAqL1xuICByZWFkb25seSBtYW5hZ2VkUG9saWNpZXM/OiBJTWFuYWdlZFBvbGljeVtdO1xuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgZ3JvdXAuIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHBhdGhzLCBzZWUgW0lBTVxuICAgKiBJZGVudGlmaWVyc10oaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvaW5kZXguaHRtbD9Vc2luZ19JZGVudGlmaWVycy5odG1sKVxuICAgKiBpbiB0aGUgSUFNIFVzZXIgR3VpZGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC9cbiAgICovXG4gIHJlYWRvbmx5IHBhdGg/OiBzdHJpbmc7XG59XG5cbmFic3RyYWN0IGNsYXNzIEdyb3VwQmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUdyb3VwIHtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGdyb3VwTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZ3JvdXBBcm46IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IElQcmluY2lwYWwgPSB0aGlzO1xuICBwdWJsaWMgcmVhZG9ubHkgcHJpbmNpcGFsQWNjb3VudDogc3RyaW5nIHwgdW5kZWZpbmVkID0gdGhpcy5lbnYuYWNjb3VudDtcbiAgcHVibGljIHJlYWRvbmx5IGFzc3VtZVJvbGVBY3Rpb246IHN0cmluZyA9ICdzdHM6QXNzdW1lUm9sZSc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBhdHRhY2hlZFBvbGljaWVzID0gbmV3IEF0dGFjaGVkUG9saWNpZXMoKTtcbiAgcHJpdmF0ZSBkZWZhdWx0UG9saWN5PzogUG9saWN5O1xuXG4gIHB1YmxpYyBnZXQgcG9saWN5RnJhZ21lbnQoKTogUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQge1xuICAgIHJldHVybiBuZXcgQXJuUHJpbmNpcGFsKHRoaXMuZ3JvdXBBcm4pLnBvbGljeUZyYWdtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIGEgcG9saWN5IHRvIHRoaXMgZ3JvdXAuXG4gICAqIEBwYXJhbSBwb2xpY3kgVGhlIHBvbGljeSB0byBhdHRhY2guXG4gICAqL1xuICBwdWJsaWMgYXR0YWNoSW5saW5lUG9saWN5KHBvbGljeTogUG9saWN5KSB7XG4gICAgdGhpcy5hdHRhY2hlZFBvbGljaWVzLmF0dGFjaChwb2xpY3kpO1xuICAgIHBvbGljeS5hdHRhY2hUb0dyb3VwKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGFkZE1hbmFnZWRQb2xpY3koX3BvbGljeTogSU1hbmFnZWRQb2xpY3kpIHtcbiAgICAvLyBkcm9wXG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHVzZXIgdG8gdGhpcyBncm91cC5cbiAgICovXG4gIHB1YmxpYyBhZGRVc2VyKHVzZXI6IElVc2VyKSB7XG4gICAgdXNlci5hZGRUb0dyb3VwKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gSUFNIHN0YXRlbWVudCB0byB0aGUgZGVmYXVsdCBwb2xpY3kuXG4gICAqL1xuICBwdWJsaWMgYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdCB7XG4gICAgaWYgKCF0aGlzLmRlZmF1bHRQb2xpY3kpIHtcbiAgICAgIHRoaXMuZGVmYXVsdFBvbGljeSA9IG5ldyBQb2xpY3kodGhpcywgJ0RlZmF1bHRQb2xpY3knKTtcbiAgICAgIHRoaXMuZGVmYXVsdFBvbGljeS5hdHRhY2hUb0dyb3VwKHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMuZGVmYXVsdFBvbGljeS5hZGRTdGF0ZW1lbnRzKHN0YXRlbWVudCk7XG4gICAgcmV0dXJuIHsgc3RhdGVtZW50QWRkZWQ6IHRydWUsIHBvbGljeURlcGVuZGFibGU6IHRoaXMuZGVmYXVsdFBvbGljeSB9O1xuICB9XG5cbiAgcHVibGljIGFkZFRvUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KS5zdGF0ZW1lbnRBZGRlZDtcbiAgfVxufVxuXG4vKipcbiAqIEFuIElBTSBHcm91cCAoY29sbGVjdGlvbiBvZiBJQU0gdXNlcnMpIGxldHMgeW91IHNwZWNpZnkgcGVybWlzc2lvbnMgZm9yXG4gKiBtdWx0aXBsZSB1c2Vycywgd2hpY2ggY2FuIG1ha2UgaXQgZWFzaWVyIHRvIG1hbmFnZSBwZXJtaXNzaW9ucyBmb3IgdGhvc2UgdXNlcnMuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvaWRfZ3JvdXBzLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIEdyb3VwIGV4dGVuZHMgR3JvdXBCYXNlIHtcbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleHRlcm5hbCBncm91cCBieSBBUk4uXG4gICAqXG4gICAqIElmIHRoZSBpbXBvcnRlZCBHcm91cCBBUk4gaXMgYSBUb2tlbiAoc3VjaCBhcyBhXG4gICAqIGBDZm5QYXJhbWV0ZXIudmFsdWVBc1N0cmluZ2Agb3IgYSBgRm4uaW1wb3J0VmFsdWUoKWApICphbmQqIHRoZSByZWZlcmVuY2VkXG4gICAqIGdyb3VwIGhhcyBhIGBwYXRoYCAobGlrZSBgYXJuOi4uLjpncm91cC9BZG1pbkdyb3VwL05ldHdvcmtBZG1pbmApLCB0aGVcbiAgICogYGdyb3VwTmFtZWAgcHJvcGVydHkgd2lsbCBub3QgcmVzb2x2ZSB0byB0aGUgY29ycmVjdCB2YWx1ZS4gSW5zdGVhZCBpdFxuICAgKiB3aWxsIHJlc29sdmUgdG8gdGhlIGZpcnN0IHBhdGggY29tcG9uZW50LiBXZSB1bmZvcnR1bmF0ZWx5IGNhbm5vdCBleHByZXNzXG4gICAqIHRoZSBjb3JyZWN0IGNhbGN1bGF0aW9uIG9mIHRoZSBmdWxsIHBhdGggbmFtZSBhcyBhIENsb3VkRm9ybWF0aW9uXG4gICAqIGV4cHJlc3Npb24uIEluIHRoaXMgc2NlbmFyaW8gdGhlIEdyb3VwIEFSTiBzaG91bGQgYmUgc3VwcGxpZWQgd2l0aG91dCB0aGVcbiAgICogYHBhdGhgIGluIG9yZGVyIHRvIHJlc29sdmUgdGhlIGNvcnJlY3QgZ3JvdXAgcmVzb3VyY2UuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBjb25zdHJ1Y3Qgc2NvcGVcbiAgICogQHBhcmFtIGlkIGNvbnN0cnVjdCBpZFxuICAgKiBAcGFyYW0gZ3JvdXBBcm4gdGhlIEFSTiBvZiB0aGUgZ3JvdXAgdG8gaW1wb3J0IChlLmcuIGBhcm46YXdzOmlhbTo6YWNjb3VudC1pZDpncm91cC9ncm91cC1uYW1lYClcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUdyb3VwQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGdyb3VwQXJuOiBzdHJpbmcpOiBJR3JvdXAge1xuICAgIGNvbnN0IGFybkNvbXBvbmVudHMgPSBTdGFjay5vZihzY29wZSkuc3BsaXRBcm4oZ3JvdXBBcm4sIEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FKTtcbiAgICBjb25zdCBncm91cE5hbWUgPSBhcm5Db21wb25lbnRzLnJlc291cmNlTmFtZSE7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgR3JvdXBCYXNlIHtcbiAgICAgIHB1YmxpYyBncm91cE5hbWUgPSBncm91cE5hbWU7XG4gICAgICBwdWJsaWMgZ3JvdXBBcm4gPSBncm91cEFybjtcbiAgICAgIHB1YmxpYyBwcmluY2lwYWxBY2NvdW50ID0gYXJuQ29tcG9uZW50cy5hY2NvdW50O1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIGdyb3VwIGJ5IGdpdmVuIG5hbWUgKHdpdGggcGF0aCkuXG4gICAqIFRoaXMgbWV0aG9kIGhhcyBzYW1lIGNhdmVhdHMgb2YgYGZyb21Hcm91cEFybmBcbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIGNvbnN0cnVjdCBzY29wZVxuICAgKiBAcGFyYW0gaWQgY29uc3RydWN0IGlkXG4gICAqIEBwYXJhbSBncm91cE5hbWUgdGhlIGdyb3VwTmFtZSAocGF0aCBpbmNsdWRlZCkgb2YgdGhlIGV4aXN0aW5nIGdyb3VwIHRvIGltcG9ydFxuICAgKi9cbiAgc3RhdGljIGZyb21Hcm91cE5hbWUoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgZ3JvdXBOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBncm91cEFybiA9IFN0YWNrLm9mKHNjb3BlKS5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ2lhbScsXG4gICAgICByZWdpb246ICcnLFxuICAgICAgcmVzb3VyY2U6ICdncm91cCcsXG4gICAgICByZXNvdXJjZU5hbWU6IGdyb3VwTmFtZSxcbiAgICB9KTtcbiAgICByZXR1cm4gR3JvdXAuZnJvbUdyb3VwQXJuKHNjb3BlLCBpZCwgZ3JvdXBBcm4pO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGdyb3VwTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgZ3JvdXBBcm46IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IG1hbmFnZWRQb2xpY2llczogSU1hbmFnZWRQb2xpY3lbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBHcm91cFByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuZ3JvdXBOYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5tYW5hZ2VkUG9saWNpZXMucHVzaCguLi5wcm9wcy5tYW5hZ2VkUG9saWNpZXMgfHwgW10pO1xuXG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgQ2ZuR3JvdXAodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgZ3JvdXBOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIG1hbmFnZWRQb2xpY3lBcm5zOiBMYXp5Lmxpc3QoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLm1hbmFnZWRQb2xpY2llcy5tYXAocCA9PiBwLm1hbmFnZWRQb2xpY3lBcm4pIH0sIHsgb21pdEVtcHR5OiB0cnVlIH0pLFxuICAgICAgcGF0aDogcHJvcHMucGF0aCxcbiAgICB9KTtcblxuICAgIHRoaXMuZ3JvdXBOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUoZ3JvdXAucmVmKTtcbiAgICB0aGlzLmdyb3VwQXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZShncm91cC5hdHRyQXJuLCB7XG4gICAgICByZWdpb246ICcnLCAvLyBJQU0gaXMgZ2xvYmFsIGluIGVhY2ggcGFydGl0aW9uXG4gICAgICBzZXJ2aWNlOiAnaWFtJyxcbiAgICAgIHJlc291cmNlOiAnZ3JvdXAnLFxuICAgICAgLy8gUmVtb3ZlcyBsZWFkaW5nIHNsYXNoIGZyb20gcGF0aFxuICAgICAgcmVzb3VyY2VOYW1lOiBgJHtwcm9wcy5wYXRoID8gcHJvcHMucGF0aC5zdWJzdHIocHJvcHMucGF0aC5jaGFyQXQoMCkgPT09ICcvJyA/IDEgOiAwKSA6ICcnfSR7dGhpcy5waHlzaWNhbE5hbWV9YCxcbiAgICB9KTtcblxuICAgIHRoaXMubWFuYWdlZFBvbGljaWVzRXhjZWVkZWRXYXJuaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgYSBtYW5hZ2VkIHBvbGljeSB0byB0aGlzIGdyb3VwLiBTZWUgW0lBTSBhbmQgQVdTIFNUUyBxdW90YXMsIG5hbWUgcmVxdWlyZW1lbnRzLCBhbmQgY2hhcmFjdGVyIGxpbWl0c11cbiAgICogKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9yZWZlcmVuY2VfaWFtLXF1b3Rhcy5odG1sI3JlZmVyZW5jZV9pYW0tcXVvdGFzLWVudGl0aWVzKVxuICAgKiBmb3IgcXVvdGEgb2YgbWFuYWdlZCBwb2xpY2llcyBhdHRhY2hlZCB0byBhbiBJQU0gZ3JvdXAuXG4gICAqIEBwYXJhbSBwb2xpY3kgVGhlIG1hbmFnZWQgcG9saWN5IHRvIGF0dGFjaC5cbiAgICovXG4gIHB1YmxpYyBhZGRNYW5hZ2VkUG9saWN5KHBvbGljeTogSU1hbmFnZWRQb2xpY3kpIHtcbiAgICBpZiAodGhpcy5tYW5hZ2VkUG9saWNpZXMuZmluZChtcCA9PiBtcCA9PT0gcG9saWN5KSkgeyByZXR1cm47IH1cbiAgICB0aGlzLm1hbmFnZWRQb2xpY2llcy5wdXNoKHBvbGljeSk7XG4gICAgdGhpcy5tYW5hZ2VkUG9saWNpZXNFeGNlZWRlZFdhcm5pbmcoKTtcbiAgfVxuXG4gIHByaXZhdGUgbWFuYWdlZFBvbGljaWVzRXhjZWVkZWRXYXJuaW5nKCkge1xuICAgIGlmICh0aGlzLm1hbmFnZWRQb2xpY2llcy5sZW5ndGggPiAxMCkge1xuICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZyhgWW91IGFkZGVkICR7dGhpcy5tYW5hZ2VkUG9saWNpZXMubGVuZ3RofSB0byBJQU0gR3JvdXAgJHt0aGlzLnBoeXNpY2FsTmFtZX0uIFRoZSBtYXhpbXVtIG51bWJlciBvZiBtYW5hZ2VkIHBvbGljaWVzIGF0dGFjaGVkIHRvIGFuIElBTSBncm91cCBpcyAxMC5gKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==