import { IConstruct } from 'constructs';
import { PolicyStatement } from './policy-statement';
import { AddToPrincipalPolicyResult, IPrincipal, PrincipalPolicyFragment } from './principals';
/**
 * Properties for an UnknownPrincipal
 */
export interface UnknownPrincipalProps {
    /**
     * The resource the role proxy is for
     */
    readonly resource: IConstruct;
}
/**
 * A principal for use in resources that need to have a role but it's unknown
 *
 * Some resources have roles associated with them which they assume, such as
 * Lambda Functions, CodeBuild projects, StepFunctions machines, etc.
 *
 * When those resources are imported, their actual roles are not always
 * imported with them. When that happens, we use an instance of this class
 * instead, which will add user warnings when statements are attempted to be
 * added to it.
 */
export declare class UnknownPrincipal implements IPrincipal {
    readonly assumeRoleAction: string;
    readonly grantPrincipal: IPrincipal;
    private readonly resource;
    constructor(props: UnknownPrincipalProps);
    get policyFragment(): PrincipalPolicyFragment;
    addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult;
    addToPolicy(statement: PolicyStatement): boolean;
}
