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
            groups: (0, util_1.undefinedIfEmpty)(() => this.groups),
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
_a = JSII_RTTI_SYMBOL_1;
User[_a] = { fqn: "@aws-cdk/aws-iam.User", version: "0.0.0" };
exports.User = User;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQTZFO0FBRzdFLG1EQUFrRTtBQUdsRSxxQ0FBa0M7QUFFbEMsNkNBQTZHO0FBQzdHLHlDQUFvRTtBQTRIcEU7O0dBRUc7QUFDSCxNQUFhLElBQUssU0FBUSxlQUFRO0lBQ2hDOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBZ0I7UUFDdkUsTUFBTSxPQUFPLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDeEMsT0FBTyxFQUFFLEtBQUs7WUFDZCxNQUFNLEVBQUUsRUFBRTtZQUNWLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFlBQVksRUFBRSxRQUFRO1NBQ3ZCLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQ3hEO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxPQUFlO1FBQ3JFLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQ3hEO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ksTUFBTSxDQUFDLGtCQUFrQixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXFCOzs7Ozs7Ozs7O1FBQ2xGLE1BQU0sTUFBTyxTQUFRLGVBQVE7WUFBN0I7O2dCQUNrQixtQkFBYyxHQUFlLElBQUksQ0FBQztnQkFDbEMscUJBQWdCLEdBQUcsVUFBRyxDQUFDLFVBQVUsQ0FBQztnQkFDbEQseUVBQXlFO2dCQUN6RSx3RkFBd0Y7Z0JBQ3hGLGlDQUFpQztnQkFDakIsYUFB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QUMsQ0FBQztTQUN2QztRQUVELElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLE9BQU8sRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUN2RTtJQUVNLFdBQVcsQ0FBQyxTQUEwQjs7Ozs7Ozs7OztRQUMzQyxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxjQUFjLENBQUM7S0FDNUQ7SUFFTyxpQkFBaUIsQ0FBQyxLQUFnQjtRQUN4QyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbEIsT0FBTztnQkFDTCxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUU7Z0JBQ3ZDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxxQkFBcUI7YUFDbkQsQ0FBQztTQUNIO1FBRUQsSUFBSSxLQUFLLENBQUMscUJBQXFCLEVBQUU7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx5RUFBeUUsQ0FBQyxDQUFDO1NBQzVGO1FBRUQsT0FBTyxTQUFTLENBQUMsQ0FBQyxvQkFBb0I7S0FDdkM7Ozs7QUFqTlUsb0JBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcm4sIEF3cywgTGF6eSwgUmVzb3VyY2UsIFNlY3JldFZhbHVlLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJR3JvdXAgfSBmcm9tICcuL2dyb3VwJztcbmltcG9ydCB7IENmblVzZXIsIENmblVzZXJUb0dyb3VwQWRkaXRpb24gfSBmcm9tICcuL2lhbS5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSUlkZW50aXR5IH0gZnJvbSAnLi9pZGVudGl0eS1iYXNlJztcbmltcG9ydCB7IElNYW5hZ2VkUG9saWN5IH0gZnJvbSAnLi9tYW5hZ2VkLXBvbGljeSc7XG5pbXBvcnQgeyBQb2xpY3kgfSBmcm9tICcuL3BvbGljeSc7XG5pbXBvcnQgeyBQb2xpY3lTdGF0ZW1lbnQgfSBmcm9tICcuL3BvbGljeS1zdGF0ZW1lbnQnO1xuaW1wb3J0IHsgQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQsIEFyblByaW5jaXBhbCwgSVByaW5jaXBhbCwgUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQgfSBmcm9tICcuL3ByaW5jaXBhbHMnO1xuaW1wb3J0IHsgQXR0YWNoZWRQb2xpY2llcywgdW5kZWZpbmVkSWZFbXB0eSB9IGZyb20gJy4vcHJpdmF0ZS91dGlsJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIElBTSB1c2VyXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvaWRfdXNlcnMuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyIGV4dGVuZHMgSUlkZW50aXR5IHtcbiAgLyoqXG4gICAqIFRoZSB1c2VyJ3MgbmFtZVxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSB1c2VyTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdXNlcidzIEFSTlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSB1c2VyQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFkZHMgdGhpcyB1c2VyIHRvIGEgZ3JvdXAuXG4gICAqL1xuICBhZGRUb0dyb3VwKGdyb3VwOiBJR3JvdXApOiB2b2lkO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGFuIElBTSB1c2VyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXNlclByb3BzIHtcbiAgLyoqXG4gICAqIEdyb3VwcyB0byBhZGQgdGhpcyB1c2VyIHRvLiBZb3UgY2FuIGFsc28gdXNlIGBhZGRUb0dyb3VwYCB0byBhZGQgdGhpc1xuICAgKiB1c2VyIHRvIGEgZ3JvdXAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZ3JvdXBzLlxuICAgKi9cbiAgcmVhZG9ubHkgZ3JvdXBzPzogSUdyb3VwW107XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBtYW5hZ2VkIHBvbGljaWVzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHJvbGUuXG4gICAqXG4gICAqIFlvdSBjYW4gYWRkIG1hbmFnZWQgcG9saWNpZXMgbGF0ZXIgdXNpbmdcbiAgICogYGFkZE1hbmFnZWRQb2xpY3koTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUocG9saWN5TmFtZSkpYC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBtYW5hZ2VkIHBvbGljaWVzLlxuICAgKi9cbiAgcmVhZG9ubHkgbWFuYWdlZFBvbGljaWVzPzogSU1hbmFnZWRQb2xpY3lbXTtcblxuICAvKipcbiAgICogVGhlIHBhdGggZm9yIHRoZSB1c2VyIG5hbWUuIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHBhdGhzLCBzZWUgSUFNXG4gICAqIElkZW50aWZpZXJzIGluIHRoZSBJQU0gVXNlciBHdWlkZS5cbiAgICpcbiAgICogQGRlZmF1bHQgL1xuICAgKi9cbiAgcmVhZG9ubHkgcGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogQVdTIHN1cHBvcnRzIHBlcm1pc3Npb25zIGJvdW5kYXJpZXMgZm9yIElBTSBlbnRpdGllcyAodXNlcnMgb3Igcm9sZXMpLlxuICAgKiBBIHBlcm1pc3Npb25zIGJvdW5kYXJ5IGlzIGFuIGFkdmFuY2VkIGZlYXR1cmUgZm9yIHVzaW5nIGEgbWFuYWdlZCBwb2xpY3lcbiAgICogdG8gc2V0IHRoZSBtYXhpbXVtIHBlcm1pc3Npb25zIHRoYXQgYW4gaWRlbnRpdHktYmFzZWQgcG9saWN5IGNhbiBncmFudCB0b1xuICAgKiBhbiBJQU0gZW50aXR5LiBBbiBlbnRpdHkncyBwZXJtaXNzaW9ucyBib3VuZGFyeSBhbGxvd3MgaXQgdG8gcGVyZm9ybSBvbmx5XG4gICAqIHRoZSBhY3Rpb25zIHRoYXQgYXJlIGFsbG93ZWQgYnkgYm90aCBpdHMgaWRlbnRpdHktYmFzZWQgcG9saWNpZXMgYW5kIGl0c1xuICAgKiBwZXJtaXNzaW9ucyBib3VuZGFyaWVzLlxuICAgKlxuICAgKiBAbGluayBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtaWFtLXJvbGUuaHRtbCNjZm4taWFtLXJvbGUtcGVybWlzc2lvbnNib3VuZGFyeVxuICAgKiBAbGluayBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvYWNjZXNzX3BvbGljaWVzX2JvdW5kYXJpZXMuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHBlcm1pc3Npb25zIGJvdW5kYXJ5LlxuICAgKi9cbiAgcmVhZG9ubHkgcGVybWlzc2lvbnNCb3VuZGFyeT86IElNYW5hZ2VkUG9saWN5O1xuXG4gIC8qKlxuICAgKiBBIG5hbWUgZm9yIHRoZSBJQU0gdXNlci4gRm9yIHZhbGlkIHZhbHVlcywgc2VlIHRoZSBVc2VyTmFtZSBwYXJhbWV0ZXIgZm9yXG4gICAqIHRoZSBDcmVhdGVVc2VyIGFjdGlvbiBpbiB0aGUgSUFNIEFQSSBSZWZlcmVuY2UuIElmIHlvdSBkb24ndCBzcGVjaWZ5IGFcbiAgICogbmFtZSwgQVdTIENsb3VkRm9ybWF0aW9uIGdlbmVyYXRlcyBhIHVuaXF1ZSBwaHlzaWNhbCBJRCBhbmQgdXNlcyB0aGF0IElEXG4gICAqIGZvciB0aGUgdXNlciBuYW1lLlxuICAgKlxuICAgKiBJZiB5b3Ugc3BlY2lmeSBhIG5hbWUsIHlvdSBjYW5ub3QgcGVyZm9ybSB1cGRhdGVzIHRoYXQgcmVxdWlyZVxuICAgKiByZXBsYWNlbWVudCBvZiB0aGlzIHJlc291cmNlLiBZb3UgY2FuIHBlcmZvcm0gdXBkYXRlcyB0aGF0IHJlcXVpcmUgbm8gb3JcbiAgICogc29tZSBpbnRlcnJ1cHRpb24uIElmIHlvdSBtdXN0IHJlcGxhY2UgdGhlIHJlc291cmNlLCBzcGVjaWZ5IGEgbmV3IG5hbWUuXG4gICAqXG4gICAqIElmIHlvdSBzcGVjaWZ5IGEgbmFtZSwgeW91IG11c3Qgc3BlY2lmeSB0aGUgQ0FQQUJJTElUWV9OQU1FRF9JQU0gdmFsdWUgdG9cbiAgICogYWNrbm93bGVkZ2UgeW91ciB0ZW1wbGF0ZSdzIGNhcGFiaWxpdGllcy4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZVxuICAgKiBBY2tub3dsZWRnaW5nIElBTSBSZXNvdXJjZXMgaW4gQVdTIENsb3VkRm9ybWF0aW9uIFRlbXBsYXRlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBHZW5lcmF0ZWQgYnkgQ2xvdWRGb3JtYXRpb24gKHJlY29tbWVuZGVkKVxuICAgKi9cbiAgcmVhZG9ubHkgdXNlck5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXNzd29yZCBmb3IgdGhlIHVzZXIuIFRoaXMgaXMgcmVxdWlyZWQgc28gdGhlIHVzZXIgY2FuIGFjY2VzcyB0aGVcbiAgICogQVdTIE1hbmFnZW1lbnQgQ29uc29sZS5cbiAgICpcbiAgICogWW91IGNhbiB1c2UgYFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dGAgdG8gc3BlY2lmeSBhIHBhc3N3b3JkIGluIHBsYWluIHRleHQgb3JcbiAgICogdXNlIGBzZWNyZXRzbWFuYWdlci5TZWNyZXQuZnJvbVNlY3JldEF0dHJpYnV0ZXNgIHRvIHJlZmVyZW5jZSBhIHNlY3JldCBpblxuICAgKiBTZWNyZXRzIE1hbmFnZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVXNlciB3b24ndCBiZSBhYmxlIHRvIGFjY2VzcyB0aGUgbWFuYWdlbWVudCBjb25zb2xlIHdpdGhvdXQgYSBwYXNzd29yZC5cbiAgICovXG4gIHJlYWRvbmx5IHBhc3N3b3JkPzogU2VjcmV0VmFsdWU7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRoZSB1c2VyIGlzIHJlcXVpcmVkIHRvIHNldCBhIG5ldyBwYXNzd29yZCB0aGUgbmV4dFxuICAgKiB0aW1lIHRoZSB1c2VyIGxvZ3MgaW4gdG8gdGhlIEFXUyBNYW5hZ2VtZW50IENvbnNvbGUuXG4gICAqXG4gICAqIElmIHRoaXMgaXMgc2V0IHRvICd0cnVlJywgeW91IG11c3QgYWxzbyBzcGVjaWZ5IFwiaW5pdGlhbFBhc3N3b3JkXCIuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBwYXNzd29yZFJlc2V0UmVxdWlyZWQ/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSB1c2VyIGRlZmluZWQgb3V0c2lkZSBvZiB0aGlzIHN0YWNrLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIHVzZXIuXG4gICAqXG4gICAqIEZvcm1hdDogYXJuOjxwYXJ0aXRpb24+OmlhbTo6PGFjY291bnQtaWQ+OnVzZXIvPHVzZXItbmFtZS13aXRoLXBhdGg+XG4gICAqL1xuICByZWFkb25seSB1c2VyQXJuOiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGVmaW5lIGEgbmV3IElBTSB1c2VyXG4gKi9cbmV4cG9ydCBjbGFzcyBVc2VyIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJSWRlbnRpdHksIElVc2VyIHtcbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyB1c2VyIGdpdmVuIGEgdXNlcm5hbWUuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBjb25zdHJ1Y3Qgc2NvcGVcbiAgICogQHBhcmFtIGlkIGNvbnN0cnVjdCBpZFxuICAgKiBAcGFyYW0gdXNlck5hbWUgdGhlIHVzZXJuYW1lIG9mIHRoZSBleGlzdGluZyB1c2VyIHRvIGltcG9ydFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tVXNlck5hbWUoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgdXNlck5hbWU6IHN0cmluZyk6IElVc2VyIHtcbiAgICBjb25zdCB1c2VyQXJuID0gU3RhY2sub2Yoc2NvcGUpLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnaWFtJyxcbiAgICAgIHJlZ2lvbjogJycsXG4gICAgICByZXNvdXJjZTogJ3VzZXInLFxuICAgICAgcmVzb3VyY2VOYW1lOiB1c2VyTmFtZSxcbiAgICB9KTtcblxuICAgIHJldHVybiBVc2VyLmZyb21Vc2VyQXR0cmlidXRlcyhzY29wZSwgaWQsIHsgdXNlckFybiB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgdXNlciBnaXZlbiBhIHVzZXIgQVJOLlxuICAgKlxuICAgKiBJZiB0aGUgQVJOIGNvbWVzIGZyb20gYSBUb2tlbiwgdGhlIFVzZXIgY2Fubm90IGhhdmUgYSBwYXRoOyBpZiBzbywgYW55IGF0dGVtcHRcbiAgICogdG8gcmVmZXJlbmNlIGl0cyB1c2VybmFtZSB3aWxsIGZhaWwuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBjb25zdHJ1Y3Qgc2NvcGVcbiAgICogQHBhcmFtIGlkIGNvbnN0cnVjdCBpZFxuICAgKiBAcGFyYW0gdXNlckFybiB0aGUgQVJOIG9mIGFuIGV4aXN0aW5nIHVzZXIgdG8gaW1wb3J0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Vc2VyQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHVzZXJBcm46IHN0cmluZyk6IElVc2VyIHtcbiAgICByZXR1cm4gVXNlci5mcm9tVXNlckF0dHJpYnV0ZXMoc2NvcGUsIGlkLCB7IHVzZXJBcm4gfSk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIHVzZXIgZ2l2ZW4gdXNlciBhdHRyaWJ1dGVzLlxuICAgKlxuICAgKiBJZiB0aGUgQVJOIGNvbWVzIGZyb20gYSBUb2tlbiwgdGhlIFVzZXIgY2Fubm90IGhhdmUgYSBwYXRoOyBpZiBzbywgYW55IGF0dGVtcHRcbiAgICogdG8gcmVmZXJlbmNlIGl0cyB1c2VybmFtZSB3aWxsIGZhaWwuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBjb25zdHJ1Y3Qgc2NvcGVcbiAgICogQHBhcmFtIGlkIGNvbnN0cnVjdCBpZFxuICAgKiBAcGFyYW0gYXR0cnMgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIHVzZXIgdG8gaW1wb3J0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Vc2VyQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogVXNlckF0dHJpYnV0ZXMpOiBJVXNlciB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJVXNlciB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IElQcmluY2lwYWwgPSB0aGlzO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHByaW5jaXBhbEFjY291bnQgPSBBd3MuQUNDT1VOVF9JRDtcbiAgICAgIC8vIFJlc291cmNlIG5hbWUgd2l0aCBwYXRoIGNhbiBoYXZlIG11bHRpcGxlIGVsZW1lbnRzIHNlcGFyYXRlZCBieSBzbGFzaC5cbiAgICAgIC8vIFRoZXJlZm9yZSwgdXNlIGVsZW1lbnQgYWZ0ZXIgbGFzdCBzbGFzaCBhcyB1c2VyTmFtZS4gSGFwcGVucyB0byB3b3JrIGZvciBUb2tlbnMgc2luY2VcbiAgICAgIC8vIHRoZXkgZG9uJ3QgaGF2ZSBhICcvJyBpbiB0aGVtLlxuICAgICAgcHVibGljIHJlYWRvbmx5IHVzZXJOYW1lOiBzdHJpbmcgPSBBcm4uZXh0cmFjdFJlc291cmNlTmFtZShhdHRycy51c2VyQXJuLCAndXNlcicpLnNwbGl0KCcvJykucG9wKCkhO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHVzZXJBcm46IHN0cmluZyA9IGF0dHJzLnVzZXJBcm47XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYXNzdW1lUm9sZUFjdGlvbjogc3RyaW5nID0gJ3N0czpBc3N1bWVSb2xlJztcbiAgICAgIHB1YmxpYyByZWFkb25seSBwb2xpY3lGcmFnbWVudDogUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQgPSBuZXcgQXJuUHJpbmNpcGFsKGF0dHJzLnVzZXJBcm4pLnBvbGljeUZyYWdtZW50O1xuICAgICAgcHJpdmF0ZSByZWFkb25seSBhdHRhY2hlZFBvbGljaWVzID0gbmV3IEF0dGFjaGVkUG9saWNpZXMoKTtcbiAgICAgIHByaXZhdGUgZGVmYXVsdFBvbGljeT86IFBvbGljeTtcbiAgICAgIHByaXZhdGUgZ3JvdXBJZCA9IDA7XG5cbiAgICAgIHB1YmxpYyBhZGRUb1BvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQpLnN0YXRlbWVudEFkZGVkO1xuICAgICAgfVxuXG4gICAgICBwdWJsaWMgYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdCB7XG4gICAgICAgIGlmICghdGhpcy5kZWZhdWx0UG9saWN5KSB7XG4gICAgICAgICAgdGhpcy5kZWZhdWx0UG9saWN5ID0gbmV3IFBvbGljeSh0aGlzLCAnUG9saWN5Jyk7XG4gICAgICAgICAgdGhpcy5kZWZhdWx0UG9saWN5LmF0dGFjaFRvVXNlcih0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlZmF1bHRQb2xpY3kuYWRkU3RhdGVtZW50cyhzdGF0ZW1lbnQpO1xuICAgICAgICByZXR1cm4geyBzdGF0ZW1lbnRBZGRlZDogdHJ1ZSwgcG9saWN5RGVwZW5kYWJsZTogdGhpcy5kZWZhdWx0UG9saWN5IH07XG4gICAgICB9XG5cbiAgICAgIHB1YmxpYyBhZGRUb0dyb3VwKGdyb3VwOiBJR3JvdXApOiB2b2lkIHtcbiAgICAgICAgbmV3IENmblVzZXJUb0dyb3VwQWRkaXRpb24oU3RhY2sub2YoZ3JvdXApLCBgJHt0aGlzLnVzZXJOYW1lfUdyb3VwJHt0aGlzLmdyb3VwSWR9YCwge1xuICAgICAgICAgIGdyb3VwTmFtZTogZ3JvdXAuZ3JvdXBOYW1lLFxuICAgICAgICAgIHVzZXJzOiBbdGhpcy51c2VyTmFtZV0sXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmdyb3VwSWQgKz0gMTtcbiAgICAgIH1cblxuICAgICAgcHVibGljIGF0dGFjaElubGluZVBvbGljeShwb2xpY3k6IFBvbGljeSk6IHZvaWQge1xuICAgICAgICB0aGlzLmF0dGFjaGVkUG9saWNpZXMuYXR0YWNoKHBvbGljeSk7XG4gICAgICAgIHBvbGljeS5hdHRhY2hUb1VzZXIodGhpcyk7XG4gICAgICB9XG5cbiAgICAgIHB1YmxpYyBhZGRNYW5hZ2VkUG9saWN5KF9wb2xpY3k6IElNYW5hZ2VkUG9saWN5KTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFkZCBtYW5hZ2VkIHBvbGljeSB0byBpbXBvcnRlZCBVc2VyJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSBncmFudFByaW5jaXBhbDogSVByaW5jaXBhbCA9IHRoaXM7XG4gIHB1YmxpYyByZWFkb25seSBwcmluY2lwYWxBY2NvdW50OiBzdHJpbmcgfCB1bmRlZmluZWQgPSB0aGlzLmVudi5hY2NvdW50O1xuICBwdWJsaWMgcmVhZG9ubHkgYXNzdW1lUm9sZUFjdGlvbjogc3RyaW5nID0gJ3N0czpBc3N1bWVSb2xlJztcblxuICAvKipcbiAgICogQW4gYXR0cmlidXRlIHRoYXQgcmVwcmVzZW50cyB0aGUgdXNlciBuYW1lLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdXNlck5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogQW4gYXR0cmlidXRlIHRoYXQgcmVwcmVzZW50cyB0aGUgdXNlcidzIEFSTi5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHVzZXJBcm46IHN0cmluZztcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcGVybWlzc2lvbnMgYm91bmRhcnkgYXR0YWNoZWQgIHRvIHRoaXMgdXNlclxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHBlcm1pc3Npb25zQm91bmRhcnk/OiBJTWFuYWdlZFBvbGljeTtcblxuICBwdWJsaWMgcmVhZG9ubHkgcG9saWN5RnJhZ21lbnQ6IFByaW5jaXBhbFBvbGljeUZyYWdtZW50O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZ3JvdXBzID0gbmV3IEFycmF5PGFueT4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBtYW5hZ2VkUG9saWNpZXMgPSBuZXcgQXJyYXk8SU1hbmFnZWRQb2xpY3k+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgYXR0YWNoZWRQb2xpY2llcyA9IG5ldyBBdHRhY2hlZFBvbGljaWVzKCk7XG4gIHByaXZhdGUgZGVmYXVsdFBvbGljeT86IFBvbGljeTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogVXNlclByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMudXNlck5hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLm1hbmFnZWRQb2xpY2llcy5wdXNoKC4uLnByb3BzLm1hbmFnZWRQb2xpY2llcyB8fCBbXSk7XG4gICAgdGhpcy5wZXJtaXNzaW9uc0JvdW5kYXJ5ID0gcHJvcHMucGVybWlzc2lvbnNCb3VuZGFyeTtcblxuICAgIGNvbnN0IHVzZXIgPSBuZXcgQ2ZuVXNlcih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICB1c2VyTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBncm91cHM6IHVuZGVmaW5lZElmRW1wdHkoKCkgPT4gdGhpcy5ncm91cHMpLFxuICAgICAgbWFuYWdlZFBvbGljeUFybnM6IExhenkubGlzdCh7IHByb2R1Y2U6ICgpID0+IHRoaXMubWFuYWdlZFBvbGljaWVzLm1hcChwID0+IHAubWFuYWdlZFBvbGljeUFybikgfSwgeyBvbWl0RW1wdHk6IHRydWUgfSksXG4gICAgICBwYXRoOiBwcm9wcy5wYXRoLFxuICAgICAgcGVybWlzc2lvbnNCb3VuZGFyeTogdGhpcy5wZXJtaXNzaW9uc0JvdW5kYXJ5ID8gdGhpcy5wZXJtaXNzaW9uc0JvdW5kYXJ5Lm1hbmFnZWRQb2xpY3lBcm4gOiB1bmRlZmluZWQsXG4gICAgICBsb2dpblByb2ZpbGU6IHRoaXMucGFyc2VMb2dpblByb2ZpbGUocHJvcHMpLFxuICAgIH0pO1xuXG4gICAgdGhpcy51c2VyTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHVzZXIucmVmKTtcbiAgICB0aGlzLnVzZXJBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHVzZXIuYXR0ckFybiwge1xuICAgICAgcmVnaW9uOiAnJywgLy8gSUFNIGlzIGdsb2JhbCBpbiBlYWNoIHBhcnRpdGlvblxuICAgICAgc2VydmljZTogJ2lhbScsXG4gICAgICByZXNvdXJjZTogJ3VzZXInLFxuICAgICAgLy8gUmVtb3ZlcyBsZWFkaW5nIHNsYXNoIGZyb20gcGF0aFxuICAgICAgcmVzb3VyY2VOYW1lOiBgJHtwcm9wcy5wYXRoID8gcHJvcHMucGF0aC5zdWJzdHIocHJvcHMucGF0aC5jaGFyQXQoMCkgPT09ICcvJyA/IDEgOiAwKSA6ICcnfSR7dGhpcy5waHlzaWNhbE5hbWV9YCxcbiAgICB9KTtcblxuICAgIHRoaXMucG9saWN5RnJhZ21lbnQgPSBuZXcgQXJuUHJpbmNpcGFsKHRoaXMudXNlckFybikucG9saWN5RnJhZ21lbnQ7XG5cbiAgICBpZiAocHJvcHMuZ3JvdXBzKSB7XG4gICAgICBwcm9wcy5ncm91cHMuZm9yRWFjaChnID0+IHRoaXMuYWRkVG9Hcm91cChnKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgdGhpcyB1c2VyIHRvIGEgZ3JvdXAuXG4gICAqL1xuICBwdWJsaWMgYWRkVG9Hcm91cChncm91cDogSUdyb3VwKSB7XG4gICAgdGhpcy5ncm91cHMucHVzaChncm91cC5ncm91cE5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIGEgbWFuYWdlZCBwb2xpY3kgdG8gdGhlIHVzZXIuXG4gICAqIEBwYXJhbSBwb2xpY3kgVGhlIG1hbmFnZWQgcG9saWN5IHRvIGF0dGFjaC5cbiAgICovXG4gIHB1YmxpYyBhZGRNYW5hZ2VkUG9saWN5KHBvbGljeTogSU1hbmFnZWRQb2xpY3kpIHtcbiAgICBpZiAodGhpcy5tYW5hZ2VkUG9saWNpZXMuZmluZChtcCA9PiBtcCA9PT0gcG9saWN5KSkgeyByZXR1cm47IH1cbiAgICB0aGlzLm1hbmFnZWRQb2xpY2llcy5wdXNoKHBvbGljeSk7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgYSBwb2xpY3kgdG8gdGhpcyB1c2VyLlxuICAgKi9cbiAgcHVibGljIGF0dGFjaElubGluZVBvbGljeShwb2xpY3k6IFBvbGljeSkge1xuICAgIHRoaXMuYXR0YWNoZWRQb2xpY2llcy5hdHRhY2gocG9saWN5KTtcbiAgICBwb2xpY3kuYXR0YWNoVG9Vc2VyKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gSUFNIHN0YXRlbWVudCB0byB0aGUgZGVmYXVsdCBwb2xpY3kuXG4gICAqXG4gICAqIEByZXR1cm5zIHRydWVcbiAgICovXG4gIHB1YmxpYyBhZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IEFkZFRvUHJpbmNpcGFsUG9saWN5UmVzdWx0IHtcbiAgICBpZiAoIXRoaXMuZGVmYXVsdFBvbGljeSkge1xuICAgICAgdGhpcy5kZWZhdWx0UG9saWN5ID0gbmV3IFBvbGljeSh0aGlzLCAnRGVmYXVsdFBvbGljeScpO1xuICAgICAgdGhpcy5kZWZhdWx0UG9saWN5LmF0dGFjaFRvVXNlcih0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLmRlZmF1bHRQb2xpY3kuYWRkU3RhdGVtZW50cyhzdGF0ZW1lbnQpO1xuICAgIHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiB0cnVlLCBwb2xpY3lEZXBlbmRhYmxlOiB0aGlzLmRlZmF1bHRQb2xpY3kgfTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb1BvbGljeShzdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudCkuc3RhdGVtZW50QWRkZWQ7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlTG9naW5Qcm9maWxlKHByb3BzOiBVc2VyUHJvcHMpOiBDZm5Vc2VyLkxvZ2luUHJvZmlsZVByb3BlcnR5IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAocHJvcHMucGFzc3dvcmQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBhc3N3b3JkOiBwcm9wcy5wYXNzd29yZC51bnNhZmVVbndyYXAoKSwgLy8gU2FmZSB1c2FnZVxuICAgICAgICBwYXNzd29yZFJlc2V0UmVxdWlyZWQ6IHByb3BzLnBhc3N3b3JkUmVzZXRSZXF1aXJlZCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnBhc3N3b3JkUmVzZXRSZXF1aXJlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgc2V0IFwicGFzc3dvcmRSZXNldFJlcXVpcmVkXCIgd2l0aG91dCBzcGVjaWZ5aW5nIFwiaW5pdGlhbFBhc3N3b3JkXCInKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBubyBjb25zb2xlIGFjY2Vzc1xuICB9XG59XG4iXX0=