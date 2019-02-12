import { PolicyStatement, PrincipalPolicyFragment } from './policy-document';

/**
 * Represents an IAM principal.
 *
 * An IAM principal is any object that can have
 */
export interface IPrincipal {
  /**
   * When this Principal is used in an AssumeRole policy, the action to use.
   */
  readonly assumeRoleAction: string;

  /**
   * Return the policy fragment that identifies this principal in a Policy.
   */
  readonly policyFragment: PrincipalPolicyFragment;

  /**
   * Add to the policy of this principal.
   *
   * @returns true if the statement was added, false if the principal in
   * question does not have a policy document to add the statement to.
   */
  addToPolicy(statement: PolicyStatement): boolean;
}

// FIXME: Move all principals here after approval of changing PR.