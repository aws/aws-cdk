import type { IConstruct } from 'constructs';
import { Stack, Tags, Token, TokenComparison } from '../../../core';
import { Grant } from '../grant';
import type { IResourceWithPolicyV2 } from '../grant';
import { PolicyStatement } from '../policy-statement';
import { AccountPrincipal } from '../principals';
import type { IGrantable, IPrincipal } from '../principals';
import { principalIsOwnedResource } from '../utils';

const GRANTEE_TAG_KEY = 'aws-cdk:id';

export interface CrossAccountPrincipalTagGrantOptions {
  readonly grantee: IGrantable;
  readonly principal: IPrincipal & IConstruct;
  readonly actions: string[];
  readonly resource: IResourceWithPolicyV2;
  readonly identityResourceArns: string[];
  readonly resourcePolicyResources?: string[];
}

/**
 * Returns the CDK-owned principal when directly referencing it in a resource policy is unsafe.
 *
 * A principal is unsafe when it belongs to another account, is a CDK-owned resource, and its stack
 * is not a dependency of the resource stack. Services that validate principals when deploying a
 * resource policy would reject a reference to that principal if it has not been created yet.
 */
export function unsafeCrossAccountResourcePolicyPrincipal(
  grantee: IGrantable,
  resourceAccount: string,
  resourceStack: Stack,
): (IPrincipal & IConstruct) | undefined {
  const principal = grantee.grantPrincipal;
  const principalAccount = principal.principalAccount;
  if (!principalAccount) {
    return undefined;
  }

  const resourceAndPrincipalAccountCompare = Token.compareStrings(resourceAccount, principalAccount);
  if (resourceAndPrincipalAccountCompare === TokenComparison.BOTH_UNRESOLVED ||
      resourceAndPrincipalAccountCompare === TokenComparison.SAME) {
    return undefined;
  }

  if (!principalIsOwnedResource(principal)) {
    return undefined;
  }

  const principalStack = Stack.of(principal);
  if (resourceStack.dependencies.includes(principalStack)) {
    return undefined;
  }

  return principal;
}

/**
 * Grant cross-account access by tagging a principal and trusting its account root scoped to that tag.
 *
 * The principal must have been returned by `unsafeCrossAccountResourcePolicyPrincipal`.
 * Returns `undefined` when the resource policy is immutable.
 */
export function grantCrossAccountViaPrincipalTag(options: CrossAccountPrincipalTagGrantOptions): Grant | undefined {
  const principalStack = Stack.of(options.principal);
  const principalTag = `${principalStack.stackName}_${options.principal.node.addr}`;
  const { statementAdded } = options.resource.addToResourcePolicy(new PolicyStatement({
    actions: options.actions,
    resources: options.resourcePolicyResources,
    principals: [new AccountPrincipal(principalStack.account)],
    conditions: {
      StringEquals: { [`aws:PrincipalTag/${GRANTEE_TAG_KEY}`]: principalTag },
    },
  }));
  if (!statementAdded) {
    return undefined;
  }

  Tags.of(options.principal).add(GRANTEE_TAG_KEY, principalTag);
  return Grant.addToPrincipal({
    grantee: options.grantee,
    actions: options.actions,
    resourceArns: options.identityResourceArns,
  });
}
