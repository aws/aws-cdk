import { PolicyStatement, PrincipalPolicyFragment } from './policy-document';

/**
 * Any object that has an associated principal that a permission can be granted to
 */
export interface IGrantable {
  /**
   * The principal to grant permissions to
   */
  readonly grantPrincipal: IPrincipal;
}

/**
 * Represents a logical IAM principal.
 *
 * An IPrincipal describes a logical entity that can perform AWS API calls
 * against sets of resources, optionally under certain conditions.
 *
 * Examples of simple principals are IAM objects that you create, such
 * as Users or Roles.
 *
 * An example of a more complex principals is a `ServicePrincipal` (such as
 * `new ServicePrincipal("sns.amazonaws.com")`, which represents the Simple
 * Notifications Service).
 *
 * A single logical Principal may also map to a set of physical principals.
 * For example, `new OrganizationPrincipal('o-1234')` represents all
 * identities that are part of the given AWS Organization.
 */
export interface IPrincipal extends IGrantable {
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