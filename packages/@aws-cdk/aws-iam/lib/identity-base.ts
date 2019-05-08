import { IResource } from '@aws-cdk/cdk';
import { Policy } from "./policy";
import { IPrincipal } from "./principals";

/**
 * A construct that represents an IAM principal, such as a user, group or role.
 */
export interface IIdentity extends IPrincipal, IResource {
  /**
   * Attaches an inline policy to this principal.
   * This is the same as calling `policy.addToXxx(principal)`.
   * @param policy The policy resource to attach to this principal [disable-awslint:ref-via-interface]
   */
  attachInlinePolicy(policy: Policy): void;

  /**
   * Attaches a managed policy to this principal.
   * @param arn The ARN of the managed policy
   */
  attachManagedPolicy(arn: string): void;
}
