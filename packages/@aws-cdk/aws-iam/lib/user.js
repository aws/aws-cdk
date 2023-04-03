"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const iam_generated_1 = require("./iam.generated");
const policy_1 = require("./policy");
const principals_1 = require("./principals");
const util_1 = require("./private/util");
/**
 * Define a new IAM user
 */
class User extends core_1.Resource {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.userName,
        });
        this.grantPrincipal = this;
        this.principalAccount = this.env.account;
        this.assumeRoleAction = 'sts:AssumeRole';
        this.groups = new Array();
        this.managedPolicies = new Array();
        this.attachedPolicies = new util_1.AttachedPolicies();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_UserProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, User);
            }
            throw error;
        }
        this.managedPolicies.push(...props.managedPolicies || []);
        this.permissionsBoundary = props.permissionsBoundary;
        const user = new iam_generated_1.CfnUser(this, 'Resource', {
            userName: this.physicalName,
            groups: util_1.undefinedIfEmpty(() => this.groups),
            managedPolicyArns: core_1.Lazy.list({ produce: () => this.managedPolicies.map(p => p.managedPolicyArn) }, { omitEmpty: true }),
            path: props.path,
            permissionsBoundary: this.permissionsBoundary ? this.permissionsBoundary.managedPolicyArn : undefined,
            loginProfile: this.parseLoginProfile(props),
        });
        this.userName = this.getResourceNameAttribute(user.ref);
        this.userArn = this.getResourceArnAttribute(user.attrArn, {
            region: '',
            service: 'iam',
            resource: 'user',
            // Removes leading slash from path
            resourceName: `${props.path ? props.path.substr(props.path.charAt(0) === '/' ? 1 : 0) : ''}${this.physicalName}`,
        });
        this.policyFragment = new principals_1.ArnPrincipal(this.userArn).policyFragment;
        if (props.groups) {
            props.groups.forEach(g => this.addToGroup(g));
        }
    }
    /**
     * Import an existing user given a username.
     *
     * @param scope construct scope
     * @param id construct id
     * @param userName the username of the existing user to import
     */
    static fromUserName(scope, id, userName) {
        const userArn = core_1.Stack.of(scope).formatArn({
            service: 'iam',
            region: '',
            resource: 'user',
            resourceName: userName,
        });
        return User.fromUserAttributes(scope, id, { userArn });
    }
    /**
     * Import an existing user given a user ARN.
     *
     * If the ARN comes from a Token, the User cannot have a path; if so, any attempt
     * to reference its username will fail.
     *
     * @param scope construct scope
     * @param id construct id
     * @param userArn the ARN of an existing user to import
     */
    static fromUserArn(scope, id, userArn) {
        return User.fromUserAttributes(scope, id, { userArn });
    }
    /**
     * Import an existing user given user attributes.
     *
     * If the ARN comes from a Token, the User cannot have a path; if so, any attempt
     * to reference its username will fail.
     *
     * @param scope construct scope
     * @param id construct id
     * @param attrs the attributes of the user to import
     */
    static fromUserAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_UserAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromUserAttributes);
            }
            throw error;
        }
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.grantPrincipal = this;
                this.principalAccount = core_1.Aws.ACCOUNT_ID;
                // Resource name with path can have multiple elements separated by slash.
                // Therefore, use element after last slash as userName. Happens to work for Tokens since
                // they don't have a '/' in them.
                this.userName = core_1.Arn.extractResourceName(attrs.userArn, 'user').split('/').pop();
                this.userArn = attrs.userArn;
                this.assumeRoleAction = 'sts:AssumeRole';
                this.policyFragment = new principals_1.ArnPrincipal(attrs.userArn).policyFragment;
                this.attachedPolicies = new util_1.AttachedPolicies();
                this.groupId = 0;
            }
            addToPolicy(statement) {
                return this.addToPrincipalPolicy(statement).statementAdded;
            }
            addToPrincipalPolicy(statement) {
                if (!this.defaultPolicy) {
                    this.defaultPolicy = new policy_1.Policy(this, 'Policy');
                    this.defaultPolicy.attachToUser(this);
                }
                this.defaultPolicy.addStatements(statement);
                return { statementAdded: true, policyDependable: this.defaultPolicy };
            }
            addToGroup(group) {
                new iam_generated_1.CfnUserToGroupAddition(core_1.Stack.of(group), `${this.userName}Group${this.groupId}`, {
                    groupName: group.groupName,
                    users: [this.userName],
                });
                this.groupId += 1;
            }
            attachInlinePolicy(policy) {
                this.attachedPolicies.attach(policy);
                policy.attachToUser(this);
            }
            addManagedPolicy(_policy) {
                throw new Error('Cannot add managed policy to imported User');
            }
        }
        return new Import(scope, id);
    }
    /**
     * Adds this user to a group.
     */
    addToGroup(group) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_iam_IGroup(group);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addToGroup);
            }
            throw error;
        }
        this.groups.push(group.groupName);
    }
    /**
     * Attaches a managed policy to the user.
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
    }
    /**
     * Attaches a policy to this user.
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
        this.attachedPolicies.attach(policy);
        policy.attachToUser(this);
    }
    /**
     * Adds an IAM statement to the default policy.
     *
     * @returns true
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
        if (!this.defaultPolicy) {
            this.defaultPolicy = new policy_1.Policy(this, 'DefaultPolicy');
            this.defaultPolicy.attachToUser(this);
        }
        this.defaultPolicy.addStatements(statement);
        return { statementAdded: true, policyDependable: this.defaultPolicy };
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
    parseLoginProfile(props) {
        if (props.password) {
            return {
                password: props.password.unsafeUnwrap(),
                passwordResetRequired: props.passwordResetRequired,
            };
        }
        if (props.passwordResetRequired) {
            throw new Error('Cannot set "passwordResetRequired" without specifying "initialPassword"');
        }
        return undefined; // no console access
    }
}
exports.User = User;
_a = JSII_RTTI_SYMBOL_1;
User[_a] = { fqn: "@aws-cdk/aws-iam.User", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQTZFO0FBRzdFLG1EQUFrRTtBQUdsRSxxQ0FBa0M7QUFFbEMsNkNBQTZHO0FBQzdHLHlDQUFvRTtBQTRIcEU7O0dBRUc7QUFDSCxNQUFhLElBQUssU0FBUSxlQUFRO0lBd0hoQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQW1CLEVBQUU7UUFDN0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLFFBQVE7U0FDN0IsQ0FBQyxDQUFDO1FBL0JXLG1CQUFjLEdBQWUsSUFBSSxDQUFDO1FBQ2xDLHFCQUFnQixHQUF1QixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztRQUN4RCxxQkFBZ0IsR0FBVyxnQkFBZ0IsQ0FBQztRQXFCM0MsV0FBTSxHQUFHLElBQUksS0FBSyxFQUFPLENBQUM7UUFDMUIsb0JBQWUsR0FBRyxJQUFJLEtBQUssRUFBa0IsQ0FBQztRQUM5QyxxQkFBZ0IsR0FBRyxJQUFJLHVCQUFnQixFQUFFLENBQUM7Ozs7OzsrQ0FySGhELElBQUk7Ozs7UUE2SGIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUMsbUJBQW1CLENBQUM7UUFFckQsTUFBTSxJQUFJLEdBQUcsSUFBSSx1QkFBTyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDekMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQzNCLE1BQU0sRUFBRSx1QkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzNDLGlCQUFpQixFQUFFLFdBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FB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Q0FBQztTQUN2QztRQUVELElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLE9BQU8sRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUN2RTtJQUVNLFdBQVcsQ0FBQyxTQUEwQjs7Ozs7Ozs7OztRQUMzQyxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxjQUFjLENBQUM7S0FDNUQ7SUFFTyxpQkFBaUIsQ0FBQyxLQUFnQjtRQUN4QyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbEIsT0FBTztnQkFDTCxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUU7Z0JBQ3ZDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxxQkFBcUI7YUFDbkQsQ0FBQztTQUNIO1FBRUQsSUFBSSxLQUFLLENBQUMscUJBQXFCLEVBQUU7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx5RUFBeUUsQ0FBQyxDQUFDO1NBQzVGO1FBRUQsT0FBTyxTQUFTLENBQUMsQ0FBQyxvQkFBb0I7S0FDdkM7O0FBak5ILG9CQWtOQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFybiwgQXdzLCBMYXp5LCBSZXNvdXJjZSwgU2VjcmV0VmFsdWUsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElHcm91cCB9IGZyb20gJy4vZ3JvdXAnO1xuaW1wb3J0IHsgQ2ZuVXNlciwgQ2ZuVXNlclRvR3JvdXBBZGRpdGlvbiB9IGZyb20gJy4vaWFtLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBJSWRlbnRpdHkgfSBmcm9tICcuL2lkZW50aXR5LWJhc2UnO1xuaW1wb3J0IHsgSU1hbmFnZWRQb2xpY3kgfSBmcm9tICcuL21hbmFnZWQtcG9saWN5JztcbmltcG9ydCB7IFBvbGljeSB9IGZyb20gJy4vcG9saWN5JztcbmltcG9ydCB7IFBvbGljeVN0YXRlbWVudCB9IGZyb20gJy4vcG9saWN5LXN0YXRlbWVudCc7XG5pbXBvcnQgeyBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdCwgQXJuUHJpbmNpcGFsLCBJUHJpbmNpcGFsLCBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCB9IGZyb20gJy4vcHJpbmNpcGFscyc7XG5pbXBvcnQgeyBBdHRhY2hlZFBvbGljaWVzLCB1bmRlZmluZWRJZkVtcHR5IH0gZnJvbSAnLi9wcml2YXRlL3V0aWwnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gSUFNIHVzZXJcbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9pZF91c2Vycy5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVVzZXIgZXh0ZW5kcyBJSWRlbnRpdHkge1xuICAvKipcbiAgICogVGhlIHVzZXIncyBuYW1lXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHVzZXJOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB1c2VyJ3MgQVJOXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHVzZXJBcm46IHN0cmluZztcblxuICAvKipcbiAgICogQWRkcyB0aGlzIHVzZXIgdG8gYSBncm91cC5cbiAgICovXG4gIGFkZFRvR3JvdXAoZ3JvdXA6IElHcm91cCk6IHZvaWQ7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYW4gSUFNIHVzZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVc2VyUHJvcHMge1xuICAvKipcbiAgICogR3JvdXBzIHRvIGFkZCB0aGlzIHVzZXIgdG8uIFlvdSBjYW4gYWxzbyB1c2UgYGFkZFRvR3JvdXBgIHRvIGFkZCB0aGlzXG4gICAqIHVzZXIgdG8gYSBncm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBncm91cHMuXG4gICAqL1xuICByZWFkb25seSBncm91cHM/OiBJR3JvdXBbXTtcblxuICAvKipcbiAgICogQSBsaXN0IG9mIG1hbmFnZWQgcG9saWNpZXMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgcm9sZS5cbiAgICpcbiAgICogWW91IGNhbiBhZGQgbWFuYWdlZCBwb2xpY2llcyBsYXRlciB1c2luZ1xuICAgKiBgYWRkTWFuYWdlZFBvbGljeShNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZShwb2xpY3lOYW1lKSlgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIG1hbmFnZWQgcG9saWNpZXMuXG4gICAqL1xuICByZWFkb25seSBtYW5hZ2VkUG9saWNpZXM/OiBJTWFuYWdlZFBvbGljeVtdO1xuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCBmb3IgdGhlIHVzZXIgbmFtZS4gRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgcGF0aHMsIHNlZSBJQU1cbiAgICogSWRlbnRpZmllcnMgaW4gdGhlIElBTSBVc2VyIEd1aWRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAvXG4gICAqL1xuICByZWFkb25seSBwYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBV1Mgc3VwcG9ydHMgcGVybWlzc2lvbnMgYm91bmRhcmllcyBmb3IgSUFNIGVudGl0aWVzICh1c2VycyBvciByb2xlcykuXG4gICAqIEEgcGVybWlzc2lvbnMgYm91bmRhcnkgaXMgYW4gYWR2YW5jZWQgZmVhdHVyZSBmb3IgdXNpbmcgYSBtYW5hZ2VkIHBvbGljeVxuICAgKiB0byBzZXQgdGhlIG1heGltdW0gcGVybWlzc2lvbnMgdGhhdCBhbiBpZGVudGl0eS1iYXNlZCBwb2xpY3kgY2FuIGdyYW50IHRvXG4gICAqIGFuIElBTSBlbnRpdHkuIEFuIGVudGl0eSdzIHBlcm1pc3Npb25zIGJvdW5kYXJ5IGFsbG93cyBpdCB0byBwZXJmb3JtIG9ubHlcbiAgICogdGhlIGFjdGlvbnMgdGhhdCBhcmUgYWxsb3dlZCBieSBib3RoIGl0cyBpZGVudGl0eS1iYXNlZCBwb2xpY2llcyBhbmQgaXRzXG4gICAqIHBlcm1pc3Npb25zIGJvdW5kYXJpZXMuXG4gICAqXG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1pYW0tcm9sZS5odG1sI2Nmbi1pYW0tcm9sZS1wZXJtaXNzaW9uc2JvdW5kYXJ5XG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9hY2Nlc3NfcG9saWNpZXNfYm91bmRhcmllcy5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gcGVybWlzc2lvbnMgYm91bmRhcnkuXG4gICAqL1xuICByZWFkb25seSBwZXJtaXNzaW9uc0JvdW5kYXJ5PzogSU1hbmFnZWRQb2xpY3k7XG5cbiAgLyoqXG4gICAqIEEgbmFtZSBmb3IgdGhlIElBTSB1c2VyLiBGb3IgdmFsaWQgdmFsdWVzLCBzZWUgdGhlIFVzZXJOYW1lIHBhcmFtZXRlciBmb3JcbiAgICogdGhlIENyZWF0ZVVzZXIgYWN0aW9uIGluIHRoZSBJQU0gQVBJIFJlZmVyZW5jZS4gSWYgeW91IGRvbid0IHNwZWNpZnkgYVxuICAgKiBuYW1lLCBBV1MgQ2xvdWRGb3JtYXRpb24gZ2VuZXJhdGVzIGEgdW5pcXVlIHBoeXNpY2FsIElEIGFuZCB1c2VzIHRoYXQgSURcbiAgICogZm9yIHRoZSB1c2VyIG5hbWUuXG4gICAqXG4gICAqIElmIHlvdSBzcGVjaWZ5IGEgbmFtZSwgeW91IGNhbm5vdCBwZXJmb3JtIHVwZGF0ZXMgdGhhdCByZXF1aXJlXG4gICAqIHJlcGxhY2VtZW50IG9mIHRoaXMgcmVzb3VyY2UuIFlvdSBjYW4gcGVyZm9ybSB1cGRhdGVzIHRoYXQgcmVxdWlyZSBubyBvclxuICAgKiBzb21lIGludGVycnVwdGlvbi4gSWYgeW91IG11c3QgcmVwbGFjZSB0aGUgcmVzb3VyY2UsIHNwZWNpZnkgYSBuZXcgbmFtZS5cbiAgICpcbiAgICogSWYgeW91IHNwZWNpZnkgYSBuYW1lLCB5b3UgbXVzdCBzcGVjaWZ5IHRoZSBDQVBBQklMSVRZX05BTUVEX0lBTSB2YWx1ZSB0b1xuICAgKiBhY2tub3dsZWRnZSB5b3VyIHRlbXBsYXRlJ3MgY2FwYWJpbGl0aWVzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlXG4gICAqIEFja25vd2xlZGdpbmcgSUFNIFJlc291cmNlcyBpbiBBV1MgQ2xvdWRGb3JtYXRpb24gVGVtcGxhdGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEdlbmVyYXRlZCBieSBDbG91ZEZvcm1hdGlvbiAocmVjb21tZW5kZWQpXG4gICAqL1xuICByZWFkb25seSB1c2VyTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHBhc3N3b3JkIGZvciB0aGUgdXNlci4gVGhpcyBpcyByZXF1aXJlZCBzbyB0aGUgdXNlciBjYW4gYWNjZXNzIHRoZVxuICAgKiBBV1MgTWFuYWdlbWVudCBDb25zb2xlLlxuICAgKlxuICAgKiBZb3UgY2FuIHVzZSBgU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0YCB0byBzcGVjaWZ5IGEgcGFzc3dvcmQgaW4gcGxhaW4gdGV4dCBvclxuICAgKiB1c2UgYHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0QXR0cmlidXRlc2AgdG8gcmVmZXJlbmNlIGEgc2VjcmV0IGluXG4gICAqIFNlY3JldHMgTWFuYWdlci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBVc2VyIHdvbid0IGJlIGFibGUgdG8gYWNjZXNzIHRoZSBtYW5hZ2VtZW50IGNvbnNvbGUgd2l0aG91dCBhIHBhc3N3b3JkLlxuICAgKi9cbiAgcmVhZG9ubHkgcGFzc3dvcmQ/OiBTZWNyZXRWYWx1ZTtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdGhlIHVzZXIgaXMgcmVxdWlyZWQgdG8gc2V0IGEgbmV3IHBhc3N3b3JkIHRoZSBuZXh0XG4gICAqIHRpbWUgdGhlIHVzZXIgbG9ncyBpbiB0byB0aGUgQVdTIE1hbmFnZW1lbnQgQ29uc29sZS5cbiAgICpcbiAgICogSWYgdGhpcyBpcyBzZXQgdG8gJ3RydWUnLCB5b3UgbXVzdCBhbHNvIHNwZWNpZnkgXCJpbml0aWFsUGFzc3dvcmRcIi5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHBhc3N3b3JkUmVzZXRSZXF1aXJlZD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHVzZXIgZGVmaW5lZCBvdXRzaWRlIG9mIHRoaXMgc3RhY2suXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXNlckF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgdXNlci5cbiAgICpcbiAgICogRm9ybWF0OiBhcm46PHBhcnRpdGlvbj46aWFtOjo8YWNjb3VudC1pZD46dXNlci88dXNlci1uYW1lLXdpdGgtcGF0aD5cbiAgICovXG4gIHJlYWRvbmx5IHVzZXJBcm46IHN0cmluZztcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBuZXcgSUFNIHVzZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFVzZXIgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElJZGVudGl0eSwgSVVzZXIge1xuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIHVzZXIgZ2l2ZW4gYSB1c2VybmFtZS5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIGNvbnN0cnVjdCBzY29wZVxuICAgKiBAcGFyYW0gaWQgY29uc3RydWN0IGlkXG4gICAqIEBwYXJhbSB1c2VyTmFtZSB0aGUgdXNlcm5hbWUgb2YgdGhlIGV4aXN0aW5nIHVzZXIgdG8gaW1wb3J0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Vc2VyTmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCB1c2VyTmFtZTogc3RyaW5nKTogSVVzZXIge1xuICAgIGNvbnN0IHVzZXJBcm4gPSBTdGFjay5vZihzY29wZSkuZm9ybWF0QXJuKHtcbiAgICAgIHNlcnZpY2U6ICdpYW0nLFxuICAgICAgcmVnaW9uOiAnJyxcbiAgICAgIHJlc291cmNlOiAndXNlcicsXG4gICAgICByZXNvdXJjZU5hbWU6IHVzZXJOYW1lLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIFVzZXIuZnJvbVVzZXJBdHRyaWJ1dGVzKHNjb3BlLCBpZCwgeyB1c2VyQXJuIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyB1c2VyIGdpdmVuIGEgdXNlciBBUk4uXG4gICAqXG4gICAqIElmIHRoZSBBUk4gY29tZXMgZnJvbSBhIFRva2VuLCB0aGUgVXNlciBjYW5ub3QgaGF2ZSBhIHBhdGg7IGlmIHNvLCBhbnkgYXR0ZW1wdFxuICAgKiB0byByZWZlcmVuY2UgaXRzIHVzZXJuYW1lIHdpbGwgZmFpbC5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIGNvbnN0cnVjdCBzY29wZVxuICAgKiBAcGFyYW0gaWQgY29uc3RydWN0IGlkXG4gICAqIEBwYXJhbSB1c2VyQXJuIHRoZSBBUk4gb2YgYW4gZXhpc3RpbmcgdXNlciB0byBpbXBvcnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVVzZXJBcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgdXNlckFybjogc3RyaW5nKTogSVVzZXIge1xuICAgIHJldHVybiBVc2VyLmZyb21Vc2VyQXR0cmlidXRlcyhzY29wZSwgaWQsIHsgdXNlckFybiB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgdXNlciBnaXZlbiB1c2VyIGF0dHJpYnV0ZXMuXG4gICAqXG4gICAqIElmIHRoZSBBUk4gY29tZXMgZnJvbSBhIFRva2VuLCB0aGUgVXNlciBjYW5ub3QgaGF2ZSBhIHBhdGg7IGlmIHNvLCBhbnkgYXR0ZW1wdFxuICAgKiB0byByZWZlcmVuY2UgaXRzIHVzZXJuYW1lIHdpbGwgZmFpbC5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIGNvbnN0cnVjdCBzY29wZVxuICAgKiBAcGFyYW0gaWQgY29uc3RydWN0IGlkXG4gICAqIEBwYXJhbSBhdHRycyB0aGUgYXR0cmlidXRlcyBvZiB0aGUgdXNlciB0byBpbXBvcnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVVzZXJBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBVc2VyQXR0cmlidXRlcyk6IElVc2VyIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElVc2VyIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBncmFudFByaW5jaXBhbDogSVByaW5jaXBhbCA9IHRoaXM7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcHJpbmNpcGFsQWNjb3VudCA9IEF3cy5BQ0NPVU5UX0lEO1xuICAgICAgLy8gUmVzb3VyY2UgbmFtZSB3aXRoIHBhdGggY2FuIGhhdmUgbXVsdGlwbGUgZWxlbWVudHMgc2VwYXJhdGVkIGJ5IHNsYXNoLlxuICAgICAgLy8gVGhlcmVmb3JlLCB1c2UgZWxlbWVudCBhZnRlciBsYXN0IHNsYXNoIGFzIHVzZXJOYW1lLiBIYXBwZW5zIHRvIHdvcmsgZm9yIFRva2VucyBzaW5jZVxuICAgICAgLy8gdGhleSBkb24ndCBoYXZlIGEgJy8nIGluIHRoZW0uXG4gICAgICBwdWJsaWMgcmVhZG9ubHkgdXNlck5hbWU6IHN0cmluZyA9IEFybi5leHRyYWN0UmVzb3VyY2VOYW1lKGF0dHJzLnVzZXJBcm4sICd1c2VyJykuc3BsaXQoJy8nKS5wb3AoKSE7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgdXNlckFybjogc3RyaW5nID0gYXR0cnMudXNlckFybjtcbiAgICAgIHB1YmxpYyByZWFkb25seSBhc3N1bWVSb2xlQWN0aW9uOiBzdHJpbmcgPSAnc3RzOkFzc3VtZVJvbGUnO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHBvbGljeUZyYWdtZW50OiBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCA9IG5ldyBBcm5QcmluY2lwYWwoYXR0cnMudXNlckFybikucG9saWN5RnJhZ21lbnQ7XG4gICAgICBwcml2YXRlIHJlYWRvbmx5IGF0dGFjaGVkUG9saWNpZXMgPSBuZXcgQXR0YWNoZWRQb2xpY2llcygpO1xuICAgICAgcHJpdmF0ZSBkZWZhdWx0UG9saWN5PzogUG9saWN5O1xuICAgICAgcHJpdmF0ZSBncm91cElkID0gMDtcblxuICAgICAgcHVibGljIGFkZFRvUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudCkuc3RhdGVtZW50QWRkZWQ7XG4gICAgICB9XG5cbiAgICAgIHB1YmxpYyBhZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IEFkZFRvUHJpbmNpcGFsUG9saWN5UmVzdWx0IHtcbiAgICAgICAgaWYgKCF0aGlzLmRlZmF1bHRQb2xpY3kpIHtcbiAgICAgICAgICB0aGlzLmRlZmF1bHRQb2xpY3kgPSBuZXcgUG9saWN5KHRoaXMsICdQb2xpY3knKTtcbiAgICAgICAgICB0aGlzLmRlZmF1bHRQb2xpY3kuYXR0YWNoVG9Vc2VyKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVmYXVsdFBvbGljeS5hZGRTdGF0ZW1lbnRzKHN0YXRlbWVudCk7XG4gICAgICAgIHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiB0cnVlLCBwb2xpY3lEZXBlbmRhYmxlOiB0aGlzLmRlZmF1bHRQb2xpY3kgfTtcbiAgICAgIH1cblxuICAgICAgcHVibGljIGFkZFRvR3JvdXAoZ3JvdXA6IElHcm91cCk6IHZvaWQge1xuICAgICAgICBuZXcgQ2ZuVXNlclRvR3JvdXBBZGRpdGlvbihTdGFjay5vZihncm91cCksIGAke3RoaXMudXNlck5hbWV9R3JvdXAke3RoaXMuZ3JvdXBJZH1gLCB7XG4gICAgICAgICAgZ3JvdXBOYW1lOiBncm91cC5ncm91cE5hbWUsXG4gICAgICAgICAgdXNlcnM6IFt0aGlzLnVzZXJOYW1lXSxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZ3JvdXBJZCArPSAxO1xuICAgICAgfVxuXG4gICAgICBwdWJsaWMgYXR0YWNoSW5saW5lUG9saWN5KHBvbGljeTogUG9saWN5KTogdm9pZCB7XG4gICAgICAgIHRoaXMuYXR0YWNoZWRQb2xpY2llcy5hdHRhY2gocG9saWN5KTtcbiAgICAgICAgcG9saWN5LmF0dGFjaFRvVXNlcih0aGlzKTtcbiAgICAgIH1cblxuICAgICAgcHVibGljIGFkZE1hbmFnZWRQb2xpY3koX3BvbGljeTogSU1hbmFnZWRQb2xpY3kpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWRkIG1hbmFnZWQgcG9saWN5IHRvIGltcG9ydGVkIFVzZXInKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsOiBJUHJpbmNpcGFsID0gdGhpcztcbiAgcHVibGljIHJlYWRvbmx5IHByaW5jaXBhbEFjY291bnQ6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHRoaXMuZW52LmFjY291bnQ7XG4gIHB1YmxpYyByZWFkb25seSBhc3N1bWVSb2xlQWN0aW9uOiBzdHJpbmcgPSAnc3RzOkFzc3VtZVJvbGUnO1xuXG4gIC8qKlxuICAgKiBBbiBhdHRyaWJ1dGUgdGhhdCByZXByZXNlbnRzIHRoZSB1c2VyIG5hbWUuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB1c2VyTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBbiBhdHRyaWJ1dGUgdGhhdCByZXByZXNlbnRzIHRoZSB1c2VyJ3MgQVJOLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdXNlckFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBwZXJtaXNzaW9ucyBib3VuZGFyeSBhdHRhY2hlZCAgdG8gdGhpcyB1c2VyXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcGVybWlzc2lvbnNCb3VuZGFyeT86IElNYW5hZ2VkUG9saWN5O1xuXG4gIHB1YmxpYyByZWFkb25seSBwb2xpY3lGcmFnbWVudDogUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQ7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBncm91cHMgPSBuZXcgQXJyYXk8YW55PigpO1xuICBwcml2YXRlIHJlYWRvbmx5IG1hbmFnZWRQb2xpY2llcyA9IG5ldyBBcnJheTxJTWFuYWdlZFBvbGljeT4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBhdHRhY2hlZFBvbGljaWVzID0gbmV3IEF0dGFjaGVkUG9saWNpZXMoKTtcbiAgcHJpdmF0ZSBkZWZhdWx0UG9saWN5PzogUG9saWN5O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBVc2VyUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy51c2VyTmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMubWFuYWdlZFBvbGljaWVzLnB1c2goLi4ucHJvcHMubWFuYWdlZFBvbGljaWVzIHx8IFtdKTtcbiAgICB0aGlzLnBlcm1pc3Npb25zQm91bmRhcnkgPSBwcm9wcy5wZXJtaXNzaW9uc0JvdW5kYXJ5O1xuXG4gICAgY29uc3QgdXNlciA9IG5ldyBDZm5Vc2VyKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHVzZXJOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIGdyb3VwczogdW5kZWZpbmVkSWZFbXB0eSgoKSA9PiB0aGlzLmdyb3VwcyksXG4gICAgICBtYW5hZ2VkUG9saWN5QXJuczogTGF6eS5saXN0KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5tYW5hZ2VkUG9saWNpZXMubWFwKHAgPT4gcC5tYW5hZ2VkUG9saWN5QXJuKSB9LCB7IG9taXRFbXB0eTogdHJ1ZSB9KSxcbiAgICAgIHBhdGg6IHByb3BzLnBhdGgsXG4gICAgICBwZXJtaXNzaW9uc0JvdW5kYXJ5OiB0aGlzLnBlcm1pc3Npb25zQm91bmRhcnkgPyB0aGlzLnBlcm1pc3Npb25zQm91bmRhcnkubWFuYWdlZFBvbGljeUFybiA6IHVuZGVmaW5lZCxcbiAgICAgIGxvZ2luUHJvZmlsZTogdGhpcy5wYXJzZUxvZ2luUHJvZmlsZShwcm9wcyksXG4gICAgfSk7XG5cbiAgICB0aGlzLnVzZXJOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUodXNlci5yZWYpO1xuICAgIHRoaXMudXNlckFybiA9IHRoaXMuZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUodXNlci5hdHRyQXJuLCB7XG4gICAgICByZWdpb246ICcnLCAvLyBJQU0gaXMgZ2xvYmFsIGluIGVhY2ggcGFydGl0aW9uXG4gICAgICBzZXJ2aWNlOiAnaWFtJyxcbiAgICAgIHJlc291cmNlOiAndXNlcicsXG4gICAgICAvLyBSZW1vdmVzIGxlYWRpbmcgc2xhc2ggZnJvbSBwYXRoXG4gICAgICByZXNvdXJjZU5hbWU6IGAke3Byb3BzLnBhdGggPyBwcm9wcy5wYXRoLnN1YnN0cihwcm9wcy5wYXRoLmNoYXJBdCgwKSA9PT0gJy8nID8gMSA6IDApIDogJyd9JHt0aGlzLnBoeXNpY2FsTmFtZX1gLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wb2xpY3lGcmFnbWVudCA9IG5ldyBBcm5QcmluY2lwYWwodGhpcy51c2VyQXJuKS5wb2xpY3lGcmFnbWVudDtcblxuICAgIGlmIChwcm9wcy5ncm91cHMpIHtcbiAgICAgIHByb3BzLmdyb3Vwcy5mb3JFYWNoKGcgPT4gdGhpcy5hZGRUb0dyb3VwKGcpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGlzIHVzZXIgdG8gYSBncm91cC5cbiAgICovXG4gIHB1YmxpYyBhZGRUb0dyb3VwKGdyb3VwOiBJR3JvdXApIHtcbiAgICB0aGlzLmdyb3Vwcy5wdXNoKGdyb3VwLmdyb3VwTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgYSBtYW5hZ2VkIHBvbGljeSB0byB0aGUgdXNlci5cbiAgICogQHBhcmFtIHBvbGljeSBUaGUgbWFuYWdlZCBwb2xpY3kgdG8gYXR0YWNoLlxuICAgKi9cbiAgcHVibGljIGFkZE1hbmFnZWRQb2xpY3kocG9saWN5OiBJTWFuYWdlZFBvbGljeSkge1xuICAgIGlmICh0aGlzLm1hbmFnZWRQb2xpY2llcy5maW5kKG1wID0+IG1wID09PSBwb2xpY3kpKSB7IHJldHVybjsgfVxuICAgIHRoaXMubWFuYWdlZFBvbGljaWVzLnB1c2gocG9saWN5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhIHBvbGljeSB0byB0aGlzIHVzZXIuXG4gICAqL1xuICBwdWJsaWMgYXR0YWNoSW5saW5lUG9saWN5KHBvbGljeTogUG9saWN5KSB7XG4gICAgdGhpcy5hdHRhY2hlZFBvbGljaWVzLmF0dGFjaChwb2xpY3kpO1xuICAgIHBvbGljeS5hdHRhY2hUb1VzZXIodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBJQU0gc3RhdGVtZW50IHRvIHRoZSBkZWZhdWx0IHBvbGljeS5cbiAgICpcbiAgICogQHJldHVybnMgdHJ1ZVxuICAgKi9cbiAgcHVibGljIGFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQge1xuICAgIGlmICghdGhpcy5kZWZhdWx0UG9saWN5KSB7XG4gICAgICB0aGlzLmRlZmF1bHRQb2xpY3kgPSBuZXcgUG9saWN5KHRoaXMsICdEZWZhdWx0UG9saWN5Jyk7XG4gICAgICB0aGlzLmRlZmF1bHRQb2xpY3kuYXR0YWNoVG9Vc2VyKHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMuZGVmYXVsdFBvbGljeS5hZGRTdGF0ZW1lbnRzKHN0YXRlbWVudCk7XG4gICAgcmV0dXJuIHsgc3RhdGVtZW50QWRkZWQ6IHRydWUsIHBvbGljeURlcGVuZGFibGU6IHRoaXMuZGVmYXVsdFBvbGljeSB9O1xuICB9XG5cbiAgcHVibGljIGFkZFRvUG9saWN5KHN0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KS5zdGF0ZW1lbnRBZGRlZDtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VMb2dpblByb2ZpbGUocHJvcHM6IFVzZXJQcm9wcyk6IENmblVzZXIuTG9naW5Qcm9maWxlUHJvcGVydHkgfCB1bmRlZmluZWQge1xuICAgIGlmIChwcm9wcy5wYXNzd29yZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcGFzc3dvcmQ6IHByb3BzLnBhc3N3b3JkLnVuc2FmZVVud3JhcCgpLCAvLyBTYWZlIHVzYWdlXG4gICAgICAgIHBhc3N3b3JkUmVzZXRSZXF1aXJlZDogcHJvcHMucGFzc3dvcmRSZXNldFJlcXVpcmVkLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMucGFzc3dvcmRSZXNldFJlcXVpcmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzZXQgXCJwYXNzd29yZFJlc2V0UmVxdWlyZWRcIiB3aXRob3V0IHNwZWNpZnlpbmcgXCJpbml0aWFsUGFzc3dvcmRcIicpO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7IC8vIG5vIGNvbnNvbGUgYWNjZXNzXG4gIH1cbn1cbiJdfQ==