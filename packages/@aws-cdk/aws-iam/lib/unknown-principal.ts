import { Annotations, ConcreteDependable, Stack } from '@aws-cdk/core';
import { IConstruct, Node } from 'constructs';
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
export class UnknownPrincipal implements IPrincipal {
  public readonly assumeRoleAction: string = 'sts:AssumeRole';
  public readonly grantPrincipal: IPrincipal;
  private readonly resource: IConstruct;

  constructor(props: UnknownPrincipalProps) {
    this.resource = props.resource;
    this.grantPrincipal = this;
  }

  public get policyFragment(): PrincipalPolicyFragment {
    throw new Error(`Cannot get policy fragment of ${Node.of(this.resource).path}, resource imported without a role`);
  }

  public addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult {
    const stack = Stack.of(this.resource);
    const repr = JSON.stringify(stack.resolve(statement));
    Annotations.of(this.resource).addWarning(`Add statement to this resource's role: ${repr}`);
    // Pretend we did the work. The human will do it for us, eventually.
    return { statementAdded: true, policyDependable: new ConcreteDependable() };
  }

  public addToPolicy(statement: PolicyStatement): boolean {
    return this.addToPrincipalPolicy(statement).statementAdded;
  }
}