import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Grant } from '../grant';
import { IManagedPolicy } from '../managed-policy';
import { Policy } from '../policy';
import { PolicyStatement } from '../policy-statement';
import { IComparablePrincipal, IPrincipal, AddToPrincipalPolicyResult, PrincipalPolicyFragment } from '../principals';
import { IRole, FromRoleArnOptions } from '../role';
export interface ImportedRoleProps extends FromRoleArnOptions {
    readonly roleArn: string;
    readonly roleName: string;
    readonly account?: string;
}
export declare class ImportedRole extends Resource implements IRole, IComparablePrincipal {
    readonly grantPrincipal: IPrincipal;
    readonly principalAccount?: string;
    readonly assumeRoleAction: string;
    readonly policyFragment: PrincipalPolicyFragment;
    readonly roleArn: string;
    readonly roleName: string;
    private readonly attachedPolicies;
    private readonly defaultPolicyName?;
    private defaultPolicy?;
    constructor(scope: Construct, id: string, props: ImportedRoleProps);
    addToPolicy(statement: PolicyStatement): boolean;
    addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult;
    attachInlinePolicy(policy: Policy): void;
    addManagedPolicy(policy: IManagedPolicy): void;
    grantPassRole(identity: IPrincipal): Grant;
    grantAssumeRole(identity: IPrincipal): Grant;
    grant(grantee: IPrincipal, ...actions: string[]): Grant;
    dedupeString(): string | undefined;
}
