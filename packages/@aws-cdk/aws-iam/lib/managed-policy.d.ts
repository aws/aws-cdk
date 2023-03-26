import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IGroup } from './group';
import { PolicyDocument } from './policy-document';
import { PolicyStatement } from './policy-statement';
import { IGrantable, IPrincipal } from './principals';
import { IRole } from './role';
import { IUser } from './user';
/**
 * A managed policy
 */
export interface IManagedPolicy {
    /**
     * The ARN of the managed policy
     * @attribute
     */
    readonly managedPolicyArn: string;
}
/**
 * Properties for defining an IAM managed policy
 */
export interface ManagedPolicyProps {
    /**
     * The name of the managed policy. If you specify multiple policies for an entity,
     * specify unique names. For example, if you specify a list of policies for
     * an IAM role, each policy must have a unique name.
     *
     * @default - A name is automatically generated.
     */
    readonly managedPolicyName?: string;
    /**
     * A description of the managed policy. Typically used to store information about the
     * permissions defined in the policy. For example, "Grants access to production DynamoDB tables."
     * The policy description is immutable. After a value is assigned, it cannot be changed.
     *
     * @default - empty
     */
    readonly description?: string;
    /**
     * The path for the policy. This parameter allows (through its regex pattern) a string of characters
     * consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes.
     * In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F),
     * including most punctuation characters, digits, and upper and lowercased letters.
     *
     * For more information about paths, see IAM Identifiers in the IAM User Guide.
     *
     * @default - "/"
     */
    readonly path?: string;
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
     * You can also use `addPermission(statement)` to add permissions later.
     *
     * @default - No statements.
     */
    readonly statements?: PolicyStatement[];
    /**
     * Initial PolicyDocument to use for this ManagedPolicy. If omited, any
     * `PolicyStatement` provided in the `statements` property will be applied
     * against the empty default `PolicyDocument`.
     *
     * @default - An empty policy.
     */
    readonly document?: PolicyDocument;
}
/**
 * Managed policy
 *
 */
export declare class ManagedPolicy extends Resource implements IManagedPolicy, IGrantable {
    /**
     * Import a customer managed policy from the managedPolicyName.
     *
     * For this managed policy, you only need to know the name to be able to use it.
     *
     */
    static fromManagedPolicyName(scope: Construct, id: string, managedPolicyName: string): IManagedPolicy;
    /**
     * Import an external managed policy by ARN.
     *
     * For this managed policy, you only need to know the ARN to be able to use it.
     * This can be useful if you got the ARN from a CloudFormation Export.
     *
     * If the imported Managed Policy ARN is a Token (such as a
     * `CfnParameter.valueAsString` or a `Fn.importValue()`) *and* the referenced
     * managed policy has a `path` (like `arn:...:policy/AdminPolicy/AdminAllow`), the
     * `managedPolicyName` property will not resolve to the correct value. Instead it
     * will resolve to the first path component. We unfortunately cannot express
     * the correct calculation of the full path name as a CloudFormation
     * expression. In this scenario the Managed Policy ARN should be supplied without the
     * `path` in order to resolve the correct managed policy resource.
     *
     * @param scope construct scope
     * @param id construct id
     * @param managedPolicyArn the ARN of the managed policy to import
     */
    static fromManagedPolicyArn(scope: Construct, id: string, managedPolicyArn: string): IManagedPolicy;
    /**
     * Import a managed policy from one of the policies that AWS manages.
     *
     * For this managed policy, you only need to know the name to be able to use it.
     *
     * Some managed policy names start with "service-role/", some start with
     * "job-function/", and some don't start with anything. Include the
     * prefix when constructing this object.
     */
    static fromAwsManagedPolicyName(managedPolicyName: string): IManagedPolicy;
    /**
     * Returns the ARN of this managed policy.
     *
     * @attribute
     */
    readonly managedPolicyArn: string;
    /**
     * The policy document.
     */
    readonly document: PolicyDocument;
    /**
     * The name of this policy.
     *
     * @attribute
     */
    readonly managedPolicyName: string;
    /**
     * The description of this policy.
     *
     * @attribute
     */
    readonly description: string;
    /**
     * The path of this policy.
     *
     * @attribute
     */
    readonly path: string;
    readonly grantPrincipal: IPrincipal;
    private readonly roles;
    private readonly users;
    private readonly groups;
    private readonly _precreatedPolicy?;
    constructor(scope: Construct, id: string, props?: ManagedPolicyProps);
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
    private validateManagedPolicy;
}
