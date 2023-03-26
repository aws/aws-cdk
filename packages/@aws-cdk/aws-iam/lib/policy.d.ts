import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IGroup } from './group';
import { PolicyDocument } from './policy-document';
import { PolicyStatement } from './policy-statement';
import { IGrantable, IPrincipal } from './principals';
import { IRole } from './role';
import { IUser } from './user';
/**
 * Represents an IAM Policy
 *
 * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage.html
 */
export interface IPolicy extends IResource {
    /**
     * The name of this policy.
     *
     * @attribute
     */
    readonly policyName: string;
}
/**
 * Properties for defining an IAM inline policy document
 */
export interface PolicyProps {
    /**
     * The name of the policy. If you specify multiple policies for an entity,
     * specify unique names. For example, if you specify a list of policies for
     * an IAM role, each policy must have a unique name.
     *
     * @default - Uses the logical ID of the policy resource, which is ensured
     * to be unique within the stack.
     */
    readonly policyName?: string;
    /**
     * Users to attach this policy to.
     * You can also use `attachToUser(user)` to attach this policy to a user.
     *
     * @default - No users.
     */
    readonly users?: IUser[];
    /**
     * Roles to attach this policy to.
     * You can also use `attachToRole(role)` to attach this policy to a role.
     *
     * @default - No roles.
     */
    readonly roles?: IRole[];
    /**
     * Groups to attach this policy to.
     * You can also use `attachToGroup(group)` to attach this policy to a group.
     *
     * @default - No groups.
     */
    readonly groups?: IGroup[];
    /**
     * Initial set of permissions to add to this policy document.
     * You can also use `addStatements(...statement)` to add permissions later.
     *
     * @default - No statements.
     */
    readonly statements?: PolicyStatement[];
    /**
     * Force creation of an `AWS::IAM::Policy`
     *
     * Unless set to `true`, this `Policy` construct will not materialize to an
     * `AWS::IAM::Policy` CloudFormation resource in case it would have no effect
     * (for example, if it remains unattached to an IAM identity or if it has no
     * statements). This is generally desired behavior, since it prevents
     * creating invalid--and hence undeployable--CloudFormation templates.
     *
     * In cases where you know the policy must be created and it is actually
     * an error if no statements have been added to it, you can set this to `true`.
     *
     * @default false
     */
    readonly force?: boolean;
    /**
     * Initial PolicyDocument to use for this Policy. If omited, any
     * `PolicyStatement` provided in the `statements` property will be applied
     * against the empty default `PolicyDocument`.
     *
     * @default - An empty policy.
     */
    readonly document?: PolicyDocument;
}
/**
 * The AWS::IAM::Policy resource associates an IAM policy with IAM users, roles,
 * or groups. For more information about IAM policies, see [Overview of IAM
 * Policies](http://docs.aws.amazon.com/IAM/latest/UserGuide/policies_overview.html)
 * in the IAM User Guide guide.
 */
export declare class Policy extends Resource implements IPolicy, IGrantable {
    /**
     * Import a policy in this app based on its name
     */
    static fromPolicyName(scope: Construct, id: string, policyName: string): IPolicy;
    /**
     * The policy document.
     */
    readonly document: PolicyDocument;
    readonly grantPrincipal: IPrincipal;
    private readonly _policyName;
    private readonly roles;
    private readonly users;
    private readonly groups;
    private readonly force;
    private referenceTaken;
    constructor(scope: Construct, id: string, props?: PolicyProps);
    /**
     * Adds a statement to the policy document.
     */
    addStatements(...statement: PolicyStatement[]): void;
    /**
     * Attaches this policy to a user.
     */
    attachToUser(user: IUser): void;
    /**
     * Attaches this policy to a role.
     */
    attachToRole(role: IRole): void;
    /**
     * Attaches this policy to a group.
     */
    attachToGroup(group: IGroup): void;
    /**
     * The name of this policy.
     *
     * @attribute
     */
    get policyName(): string;
    private validatePolicy;
    /**
     * Whether the policy resource has been attached to any identity
     */
    private get isAttached();
}
