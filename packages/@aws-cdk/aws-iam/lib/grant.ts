import { PolicyStatement } from "./policy-document";
import { IPrincipal } from "./principals";

/**
 * Properties for a grant operation
 */
export interface GrantProps {
  /**
   * The principal to grant to
   *
   * @default No work is done
   */
  principal?: IPrincipal;

  /**
   * The actions to grant
   */
  actions: string[];

  /**
   * The resource ARNs to grant to
   */
  resourceArns: string[];

  /**
   * Adder to the resource policy
   *
   * @default Failure if no principal policy and `skipResourcePolicy` is not set.
   */
  addToResourcePolicy?: (statement: PolicyStatement) => void;

  /**
   * When referring to the resource in a resource policy, use this as ARN.
   *
   * (Depending on the resource type, this needs to be '*' in a resource policy).
   *
   * @default Same as regular resource ARNs
   */
  resourceSelfArns?: string[];

  /**
   * If there is no resource policy, ignore the error
   *
   * @default false
   */
  skipResourcePolicy?: boolean;
}

/**
 * Helper function to implement grants.
 *
 * The pattern is the same every time. We try to add to the principal
 * first, then add to the resource afterwards.
 *
 * @returns false if `skipResourcePolicy` was used, true otherwise
 */
export function grant(props: GrantProps): boolean {
  if (!props.principal) { return true; }

  const addedToPrincipal = props.principal.addToPolicy(new PolicyStatement()
    .addActions(...props.actions)
    .addResources(...props.resourceArns));

  if (addedToPrincipal || props.skipResourcePolicy) { return false; }

  // This is a function so that it can be used by resources that lazily
  // need to create a policy document (Queue, Bucket) which cannot have
  // an empty policy.
  if (!props.addToResourcePolicy) {
    throw new Error('Could not add permissions to Principal without policy, and resource does not have policy either. Grant to a Role instead.');
  }

  props.addToResourcePolicy(new PolicyStatement()
    .addActions(...props.actions)
    .addResources(...(props.resourceSelfArns || props.resourceArns))
    .addPrincipal(props.principal));
  return true;
}