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
_a = JSII_RTTI_SYMBOL_1;
Group[_a] = { fqn: "@aws-cdk/aws-iam.Group", version: "0.0.0" };
exports.Group = Group;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBOEU7QUFFOUUsbURBQTJDO0FBRzNDLHFDQUFrQztBQUVsQyw2Q0FBNkc7QUFDN0cseUNBQWtEO0FBOERsRCxNQUFlLFNBQVUsU0FBUSxlQUFRO0lBQXpDOztRQUlrQixtQkFBYyxHQUFlLElBQUksQ0FBQztRQUNsQyxxQkFBZ0IsR0FBdUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDeEQscUJBQWdCLEdBQVcsZ0JBQWdCLENBQUM7UUFFM0MscUJBQWdCLEdBQUcsSUFBSSx1QkFBZ0IsRUFBRSxDQUFDO0lBMkM3RCxDQUFDO0lBeENDLElBQVcsY0FBYztRQUN2QixPQUFPLElBQUkseUJBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsY0FBYyxDQUFDO0tBQ3ZEO0lBRUQ7OztPQUdHO0lBQ0ksa0JBQWtCLENBQUMsTUFBYztRQUN0QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDNUI7SUFFTSxnQkFBZ0IsQ0FBQyxPQUF1QjtLQUU5QztJQUVEOztPQUVHO0lBQ0ksT0FBTyxDQUFDLElBQVc7UUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN2QjtJQUVEOztPQUVHO0lBQ0ksb0JBQW9CLENBQUMsU0FBMEI7UUFDcEQsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEM7UUFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLGFB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LE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFO1NBQ2pILENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyw4QkFBOEIsRUFBRSxDQUFDO0tBQ3ZDO0lBRUQ7Ozs7O09BS0c7SUFDSSxnQkFBZ0IsQ0FBQyxNQUFzQjs7Ozs7Ozs7OztRQUM1QyxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxFQUFFO1lBQUUsT0FBTztTQUFFO1FBQy9ELElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyw4QkFBOEIsRUFBRSxDQUFDO0tBQ3ZDO0lBRU8sOEJBQThCO1FBQ3BDLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFO1lBQ3BDLGtCQUFXLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxhQUFhLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxpQkFBaUIsSUFBSSxDQUFDLFlBQVksMEVBQTBFLENBQUMsQ0FBQztTQUN2TDtLQUNGOzs7O0FBN0ZVLHNCQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5ub3RhdGlvbnMsIEFybkZvcm1hdCwgTGF6eSwgUmVzb3VyY2UsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkdyb3VwIH0gZnJvbSAnLi9pYW0uZ2VuZXJhdGVkJztcbmltcG9ydCB7IElJZGVudGl0eSB9IGZyb20gJy4vaWRlbnRpdHktYmFzZSc7XG5pbXBvcnQgeyBJTWFuYWdlZFBvbGljeSB9IGZyb20gJy4vbWFuYWdlZC1wb2xpY3knO1xuaW1wb3J0IHsgUG9saWN5IH0gZnJvbSAnLi9wb2xpY3knO1xuaW1wb3J0IHsgUG9saWN5U3RhdGVtZW50IH0gZnJvbSAnLi9wb2xpY3ktc3RhdGVtZW50JztcbmltcG9ydCB7IEFkZFRvUHJpbmNpcGFsUG9saWN5UmVzdWx0LCBBcm5QcmluY2lwYWwsIElQcmluY2lwYWwsIFByaW5jaXBhbFBvbGljeUZyYWdtZW50IH0gZnJvbSAnLi9wcmluY2lwYWxzJztcbmltcG9ydCB7IEF0dGFjaGVkUG9saWNpZXMgfSBmcm9tICcuL3ByaXZhdGUvdXRpbCc7XG5pbXBvcnQgeyBJVXNlciB9IGZyb20gJy4vdXNlcic7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBJQU0gR3JvdXAuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvaWRfZ3JvdXBzLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJR3JvdXAgZXh0ZW5kcyBJSWRlbnRpdHkge1xuICAvKipcbiAgICogUmV0dXJucyB0aGUgSUFNIEdyb3VwIE5hbWVcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgZ3JvdXBOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIElBTSBHcm91cCBBUk5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgZ3JvdXBBcm46IHN0cmluZztcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhbiBJQU0gZ3JvdXBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHcm91cFByb3BzIHtcbiAgLyoqXG4gICAqIEEgbmFtZSBmb3IgdGhlIElBTSBncm91cC4gRm9yIHZhbGlkIHZhbHVlcywgc2VlIHRoZSBHcm91cE5hbWUgcGFyYW1ldGVyXG4gICAqIGZvciB0aGUgQ3JlYXRlR3JvdXAgYWN0aW9uIGluIHRoZSBJQU0gQVBJIFJlZmVyZW5jZS4gSWYgeW91IGRvbid0IHNwZWNpZnlcbiAgICogYSBuYW1lLCBBV1MgQ2xvdWRGb3JtYXRpb24gZ2VuZXJhdGVzIGEgdW5pcXVlIHBoeXNpY2FsIElEIGFuZCB1c2VzIHRoYXRcbiAgICogSUQgZm9yIHRoZSBncm91cCBuYW1lLlxuICAgKlxuICAgKiBJZiB5b3Ugc3BlY2lmeSBhIG5hbWUsIHlvdSBtdXN0IHNwZWNpZnkgdGhlIENBUEFCSUxJVFlfTkFNRURfSUFNIHZhbHVlIHRvXG4gICAqIGFja25vd2xlZGdlIHlvdXIgdGVtcGxhdGUncyBjYXBhYmlsaXRpZXMuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWVcbiAgICogQWNrbm93bGVkZ2luZyBJQU0gUmVzb3VyY2VzIGluIEFXUyBDbG91ZEZvcm1hdGlvbiBUZW1wbGF0ZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IEdlbmVyYXRlZCBieSBDbG91ZEZvcm1hdGlvbiAocmVjb21tZW5kZWQpXG4gICAqL1xuICByZWFkb25seSBncm91cE5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBtYW5hZ2VkIHBvbGljaWVzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHJvbGUuXG4gICAqXG4gICAqIFlvdSBjYW4gYWRkIG1hbmFnZWQgcG9saWNpZXMgbGF0ZXIgdXNpbmdcbiAgICogYGFkZE1hbmFnZWRQb2xpY3koTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUocG9saWN5TmFtZSkpYC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBtYW5hZ2VkIHBvbGljaWVzLlxuICAgKi9cbiAgcmVhZG9ubHkgbWFuYWdlZFBvbGljaWVzPzogSU1hbmFnZWRQb2xpY3lbXTtcblxuICAvKipcbiAgICogVGhlIHBhdGggdG8gdGhlIGdyb3VwLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBwYXRocywgc2VlIFtJQU1cbiAgICogSWRlbnRpZmllcnNdKGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL2luZGV4Lmh0bWw/VXNpbmdfSWRlbnRpZmllcnMuaHRtbClcbiAgICogaW4gdGhlIElBTSBVc2VyIEd1aWRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAvXG4gICAqL1xuICByZWFkb25seSBwYXRoPzogc3RyaW5nO1xufVxuXG5hYnN0cmFjdCBjbGFzcyBHcm91cEJhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElHcm91cCB7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBncm91cE5hbWU6IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGdyb3VwQXJuOiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsOiBJUHJpbmNpcGFsID0gdGhpcztcbiAgcHVibGljIHJlYWRvbmx5IHByaW5jaXBhbEFjY291bnQ6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHRoaXMuZW52LmFjY291bnQ7XG4gIHB1YmxpYyByZWFkb25seSBhc3N1bWVSb2xlQWN0aW9uOiBzdHJpbmcgPSAnc3RzOkFzc3VtZVJvbGUnO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgYXR0YWNoZWRQb2xpY2llcyA9IG5ldyBBdHRhY2hlZFBvbGljaWVzKCk7XG4gIHByaXZhdGUgZGVmYXVsdFBvbGljeT86IFBvbGljeTtcblxuICBwdWJsaWMgZ2V0IHBvbGljeUZyYWdtZW50KCk6IFByaW5jaXBhbFBvbGljeUZyYWdtZW50IHtcbiAgICByZXR1cm4gbmV3IEFyblByaW5jaXBhbCh0aGlzLmdyb3VwQXJuKS5wb2xpY3lGcmFnbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhIHBvbGljeSB0byB0aGlzIGdyb3VwLlxuICAgKiBAcGFyYW0gcG9saWN5IFRoZSBwb2xpY3kgdG8gYXR0YWNoLlxuICAgKi9cbiAgcHVibGljIGF0dGFjaElubGluZVBvbGljeShwb2xpY3k6IFBvbGljeSkge1xuICAgIHRoaXMuYXR0YWNoZWRQb2xpY2llcy5hdHRhY2gocG9saWN5KTtcbiAgICBwb2xpY3kuYXR0YWNoVG9Hcm91cCh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRNYW5hZ2VkUG9saWN5KF9wb2xpY3k6IElNYW5hZ2VkUG9saWN5KSB7XG4gICAgLy8gZHJvcFxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB1c2VyIHRvIHRoaXMgZ3JvdXAuXG4gICAqL1xuICBwdWJsaWMgYWRkVXNlcih1c2VyOiBJVXNlcikge1xuICAgIHVzZXIuYWRkVG9Hcm91cCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIElBTSBzdGF0ZW1lbnQgdG8gdGhlIGRlZmF1bHQgcG9saWN5LlxuICAgKi9cbiAgcHVibGljIGFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQge1xuICAgIGlmICghdGhpcy5kZWZhdWx0UG9saWN5KSB7XG4gICAgICB0aGlzLmRlZmF1bHRQb2xpY3kgPSBuZXcgUG9saWN5KHRoaXMsICdEZWZhdWx0UG9saWN5Jyk7XG4gICAgICB0aGlzLmRlZmF1bHRQb2xpY3kuYXR0YWNoVG9Hcm91cCh0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLmRlZmF1bHRQb2xpY3kuYWRkU3RhdGVtZW50cyhzdGF0ZW1lbnQpO1xuICAgIHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiB0cnVlLCBwb2xpY3lEZXBlbmRhYmxlOiB0aGlzLmRlZmF1bHRQb2xpY3kgfTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb1BvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudCkuc3RhdGVtZW50QWRkZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBBbiBJQU0gR3JvdXAgKGNvbGxlY3Rpb24gb2YgSUFNIHVzZXJzKSBsZXRzIHlvdSBzcGVjaWZ5IHBlcm1pc3Npb25zIGZvclxuICogbXVsdGlwbGUgdXNlcnMsIHdoaWNoIGNhbiBtYWtlIGl0IGVhc2llciB0byBtYW5hZ2UgcGVybWlzc2lvbnMgZm9yIHRob3NlIHVzZXJzLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL2lkX2dyb3Vwcy5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBHcm91cCBleHRlbmRzIEdyb3VwQmFzZSB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXh0ZXJuYWwgZ3JvdXAgYnkgQVJOLlxuICAgKlxuICAgKiBJZiB0aGUgaW1wb3J0ZWQgR3JvdXAgQVJOIGlzIGEgVG9rZW4gKHN1Y2ggYXMgYVxuICAgKiBgQ2ZuUGFyYW1ldGVyLnZhbHVlQXNTdHJpbmdgIG9yIGEgYEZuLmltcG9ydFZhbHVlKClgKSAqYW5kKiB0aGUgcmVmZXJlbmNlZFxuICAgKiBncm91cCBoYXMgYSBgcGF0aGAgKGxpa2UgYGFybjouLi46Z3JvdXAvQWRtaW5Hcm91cC9OZXR3b3JrQWRtaW5gKSwgdGhlXG4gICAqIGBncm91cE5hbWVgIHByb3BlcnR5IHdpbGwgbm90IHJlc29sdmUgdG8gdGhlIGNvcnJlY3QgdmFsdWUuIEluc3RlYWQgaXRcbiAgICogd2lsbCByZXNvbHZlIHRvIHRoZSBmaXJzdCBwYXRoIGNvbXBvbmVudC4gV2UgdW5mb3J0dW5hdGVseSBjYW5ub3QgZXhwcmVzc1xuICAgKiB0aGUgY29ycmVjdCBjYWxjdWxhdGlvbiBvZiB0aGUgZnVsbCBwYXRoIG5hbWUgYXMgYSBDbG91ZEZvcm1hdGlvblxuICAgKiBleHByZXNzaW9uLiBJbiB0aGlzIHNjZW5hcmlvIHRoZSBHcm91cCBBUk4gc2hvdWxkIGJlIHN1cHBsaWVkIHdpdGhvdXQgdGhlXG4gICAqIGBwYXRoYCBpbiBvcmRlciB0byByZXNvbHZlIHRoZSBjb3JyZWN0IGdyb3VwIHJlc291cmNlLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgY29uc3RydWN0IHNjb3BlXG4gICAqIEBwYXJhbSBpZCBjb25zdHJ1Y3QgaWRcbiAgICogQHBhcmFtIGdyb3VwQXJuIHRoZSBBUk4gb2YgdGhlIGdyb3VwIHRvIGltcG9ydCAoZS5nLiBgYXJuOmF3czppYW06OmFjY291bnQtaWQ6Z3JvdXAvZ3JvdXAtbmFtZWApXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Hcm91cEFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBncm91cEFybjogc3RyaW5nKTogSUdyb3VwIHtcbiAgICBjb25zdCBhcm5Db21wb25lbnRzID0gU3RhY2sub2Yoc2NvcGUpLnNwbGl0QXJuKGdyb3VwQXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSk7XG4gICAgY29uc3QgZ3JvdXBOYW1lID0gYXJuQ29tcG9uZW50cy5yZXNvdXJjZU5hbWUhO1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIEdyb3VwQmFzZSB7XG4gICAgICBwdWJsaWMgZ3JvdXBOYW1lID0gZ3JvdXBOYW1lO1xuICAgICAgcHVibGljIGdyb3VwQXJuID0gZ3JvdXBBcm47XG4gICAgICBwdWJsaWMgcHJpbmNpcGFsQWNjb3VudCA9IGFybkNvbXBvbmVudHMuYWNjb3VudDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBncm91cCBieSBnaXZlbiBuYW1lICh3aXRoIHBhdGgpLlxuICAgKiBUaGlzIG1ldGhvZCBoYXMgc2FtZSBjYXZlYXRzIG9mIGBmcm9tR3JvdXBBcm5gXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBjb25zdHJ1Y3Qgc2NvcGVcbiAgICogQHBhcmFtIGlkIGNvbnN0cnVjdCBpZFxuICAgKiBAcGFyYW0gZ3JvdXBOYW1lIHRoZSBncm91cE5hbWUgKHBhdGggaW5jbHVkZWQpIG9mIHRoZSBleGlzdGluZyBncm91cCB0byBpbXBvcnRcbiAgICovXG4gIHN0YXRpYyBmcm9tR3JvdXBOYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGdyb3VwTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZ3JvdXBBcm4gPSBTdGFjay5vZihzY29wZSkuZm9ybWF0QXJuKHtcbiAgICAgIHNlcnZpY2U6ICdpYW0nLFxuICAgICAgcmVnaW9uOiAnJyxcbiAgICAgIHJlc291cmNlOiAnZ3JvdXAnLFxuICAgICAgcmVzb3VyY2VOYW1lOiBncm91cE5hbWUsXG4gICAgfSk7XG4gICAgcmV0dXJuIEdyb3VwLmZyb21Hcm91cEFybihzY29wZSwgaWQsIGdyb3VwQXJuKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBncm91cE5hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGdyb3VwQXJuOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBtYW5hZ2VkUG9saWNpZXM6IElNYW5hZ2VkUG9saWN5W10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogR3JvdXBQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLmdyb3VwTmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMubWFuYWdlZFBvbGljaWVzLnB1c2goLi4ucHJvcHMubWFuYWdlZFBvbGljaWVzIHx8IFtdKTtcblxuICAgIGNvbnN0IGdyb3VwID0gbmV3IENmbkdyb3VwKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGdyb3VwTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBtYW5hZ2VkUG9saWN5QXJuczogTGF6eS5saXN0KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5tYW5hZ2VkUG9saWNpZXMubWFwKHAgPT4gcC5tYW5hZ2VkUG9saWN5QXJuKSB9LCB7IG9taXRFbXB0eTogdHJ1ZSB9KSxcbiAgICAgIHBhdGg6IHByb3BzLnBhdGgsXG4gICAgfSk7XG5cbiAgICB0aGlzLmdyb3VwTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKGdyb3VwLnJlZik7XG4gICAgdGhpcy5ncm91cEFybiA9IHRoaXMuZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUoZ3JvdXAuYXR0ckFybiwge1xuICAgICAgcmVnaW9uOiAnJywgLy8gSUFNIGlzIGdsb2JhbCBpbiBlYWNoIHBhcnRpdGlvblxuICAgICAgc2VydmljZTogJ2lhbScsXG4gICAgICByZXNvdXJjZTogJ2dyb3VwJyxcbiAgICAgIC8vIFJlbW92ZXMgbGVhZGluZyBzbGFzaCBmcm9tIHBhdGhcbiAgICAgIHJlc291cmNlTmFtZTogYCR7cHJvcHMucGF0aCA/IHByb3BzLnBhdGguc3Vic3RyKHByb3BzLnBhdGguY2hhckF0KDApID09PSAnLycgPyAxIDogMCkgOiAnJ30ke3RoaXMucGh5c2ljYWxOYW1lfWAsXG4gICAgfSk7XG5cbiAgICB0aGlzLm1hbmFnZWRQb2xpY2llc0V4Y2VlZGVkV2FybmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIGEgbWFuYWdlZCBwb2xpY3kgdG8gdGhpcyBncm91cC4gU2VlIFtJQU0gYW5kIEFXUyBTVFMgcXVvdGFzLCBuYW1lIHJlcXVpcmVtZW50cywgYW5kIGNoYXJhY3RlciBsaW1pdHNdXG4gICAqIChodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvcmVmZXJlbmNlX2lhbS1xdW90YXMuaHRtbCNyZWZlcmVuY2VfaWFtLXF1b3Rhcy1lbnRpdGllcylcbiAgICogZm9yIHF1b3RhIG9mIG1hbmFnZWQgcG9saWNpZXMgYXR0YWNoZWQgdG8gYW4gSUFNIGdyb3VwLlxuICAgKiBAcGFyYW0gcG9saWN5IFRoZSBtYW5hZ2VkIHBvbGljeSB0byBhdHRhY2guXG4gICAqL1xuICBwdWJsaWMgYWRkTWFuYWdlZFBvbGljeShwb2xpY3k6IElNYW5hZ2VkUG9saWN5KSB7XG4gICAgaWYgKHRoaXMubWFuYWdlZFBvbGljaWVzLmZpbmQobXAgPT4gbXAgPT09IHBvbGljeSkpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5tYW5hZ2VkUG9saWNpZXMucHVzaChwb2xpY3kpO1xuICAgIHRoaXMubWFuYWdlZFBvbGljaWVzRXhjZWVkZWRXYXJuaW5nKCk7XG4gIH1cblxuICBwcml2YXRlIG1hbmFnZWRQb2xpY2llc0V4Y2VlZGVkV2FybmluZygpIHtcbiAgICBpZiAodGhpcy5tYW5hZ2VkUG9saWNpZXMubGVuZ3RoID4gMTApIHtcbiAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZFdhcm5pbmcoYFlvdSBhZGRlZCAke3RoaXMubWFuYWdlZFBvbGljaWVzLmxlbmd0aH0gdG8gSUFNIEdyb3VwICR7dGhpcy5waHlzaWNhbE5hbWV9LiBUaGUgbWF4aW11bSBudW1iZXIgb2YgbWFuYWdlZCBwb2xpY2llcyBhdHRhY2hlZCB0byBhbiBJQU0gZ3JvdXAgaXMgMTAuYCk7XG4gICAgfVxuICB9XG59XG4iXX0=