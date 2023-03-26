import { Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Grant } from '../grant';
import { IManagedPolicy } from '../managed-policy';
import { Policy } from '../policy';
import { PolicyDocument } from '../policy-document';
import { PolicyStatement } from '../policy-statement';
import { AddToPrincipalPolicyResult, IPrincipal, PrincipalPolicyFragment } from '../principals';
import { IRole } from '../role';
/**
 * Options for a precreated role
 */
export interface PrecreatedRoleProps {
    /**
     * The base role to use for the precreated role. In most cases this will be
     * the `Role` or `IRole` that is being created by a construct. For example,
     * users (or constructs) will create an IAM role with `new Role(this, 'MyRole', {...})`.
     * That `Role` will be used as the base role for the `PrecreatedRole` meaning it be able
     * to access any methods and properties on the base role.
     */
    readonly role: IRole;
    /**
     * The assume role (trust) policy for the precreated role.
     *
     * @default - no assume role policy
     */
    readonly assumeRolePolicy?: PolicyDocument;
    /**
     * If the role is missing from the precreatedRole context
     *
     * @default false
     */
    readonly missing?: boolean;
    /**
     * The construct path to display in the report.
     * This should be the path that the user can trace to the
     * role being created in their application
     *
     * @default the construct path of this construct
     */
    readonly rolePath?: string;
}
/**
 * An IAM role that has been created outside of CDK and can be
 * used in place of a role that CDK _is_ creating.
 *
 * When any policy is attached to a precreated role the policy will be
 * synthesized into a separate report and will _not_ be synthesized in
 * the CloudFormation template.
 */
export declare class PrecreatedRole extends Resource implements IRole {
    readonly assumeRoleAction: string;
    readonly policyFragment: PrincipalPolicyFragment;
    readonly grantPrincipal: this;
    readonly principalAccount?: string;
    readonly roleArn: string;
    readonly roleName: string;
    readonly stack: Stack;
    private readonly policySynthesizer;
    private readonly policyStatements;
    private readonly managedPolicies;
    private readonly role;
    constructor(scope: Construct, id: string, props: PrecreatedRoleProps);
    attachInlinePolicy(policy: Policy): void;
    addManagedPolicy(policy: IManagedPolicy): void;
    addToPolicy(statement: PolicyStatement): boolean;
    addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult;
    grant(grantee: IPrincipal, ...actions: string[]): Grant;
    grantPassRole(grantee: IPrincipal): Grant;
    grantAssumeRole(identity: IPrincipal): Grant;
}
