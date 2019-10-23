import { IResource } from '@aws-cdk/core';
import { IManagedPolicy } from './managed-policy';
import { IPolicy, PolicyProps } from './policy';
import { IPrincipal } from "./principals";

/**
 * A construct that represents an IAM principal, such as a user, group or role.
 */
export interface IIdentity extends IPrincipal, IResource {
  /**
   * Creates and attaches a Policy to this principal, if it is mutable.
   * If this principal is immutable, does nothing, and returns undefined.
   *
   * @param id the logical identifier to use for the new policy resource.
   *   It will be created in the scope of this principal (if it's mutable)
   * @param props the construction properties of the new policy
   * @returns the newly created Policy resource if this principal is mutable,
   *   or undefined if this principal is immutable
   */
  addPolicy(id: string, props?: PolicyProps): IPolicy;

  /**
   * Attaches an inline policy to this principal, if this principal is mutable.
   * For a mutable principal, it is the same as calling `policy.addToXxx(principal)`.
   * For an immutable principal, this method does nothing.
   *
   * @param policy The policy resource to attach to this principal
   *
   * @deprecated for immutable principals, this will leave the policy passed as the first parameter
   *   possibly not attached to any principal, which is invalid in CloudFormation.
   *   Use the {@link addPolicy} method instead
   */
  attachInlinePolicy(policy: IPolicy): void;

  /**
   * Attaches a managed policy to this principal.
   * @param policy The managed policy
   */
  addManagedPolicy(policy: IManagedPolicy): void;
}
