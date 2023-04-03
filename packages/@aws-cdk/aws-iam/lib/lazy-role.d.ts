import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Grant } from './grant';
import { IManagedPolicy } from './managed-policy';
import { Policy } from './policy';
import { PolicyStatement } from './policy-statement';
import { AddToPrincipalPolicyResult, IPrincipal, PrincipalPolicyFragment } from './principals';
import { IRole, RoleProps } from './role';
/**
 * Properties for defining a LazyRole
 */
export interface LazyRoleProps extends RoleProps {
}
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
export declare class LazyRole extends cdk.Resource implements IRole {
    private readonly props;
    readonly grantPrincipal: IPrincipal;
    readonly principalAccount: string | undefined;
    readonly assumeRoleAction: string;
    private role?;
    private readonly statements;
    private readonly policies;
    private readonly managedPolicies;
    constructor(scope: Construct, id: string, props: LazyRoleProps);
    /**
     * Adds a permission to the role's default policy document.
     * If there is no default policy attached to this role, it will be created.
     * @param statement The permission statement to add to the policy document
     */
    addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult;
    addToPolicy(statement: PolicyStatement): boolean;
    /**
     * Attaches a policy to this role.
     * @param policy The policy to attach
     */
    attachInlinePolicy(policy: Policy): void;
    /**
     * Attaches a managed policy to this role.
     * @param policy The managed policy to attach.
     */
    addManagedPolicy(policy: IManagedPolicy): void;
    /**
     * Returns the ARN of this role.
     */
    get roleArn(): string;
    /**
     * Returns the stable and unique string identifying the role (i.e. AIDAJQABLZS4A3QDU576Q)
     *
     * @attribute
     */
    get roleId(): string;
    get roleName(): string;
    get policyFragment(): PrincipalPolicyFragment;
    /**
     * Grant the actions defined in actions to the identity Principal on this resource.
     */
    grant(identity: IPrincipal, ...actions: string[]): Grant;
    /**
     * Grant permissions to the given principal to pass this role.
     */
    grantPassRole(identity: IPrincipal): Grant;
    /**
     * Grant permissions to the given principal to assume this role.
     */
    grantAssumeRole(identity: IPrincipal): Grant;
    private instantiate;
}
