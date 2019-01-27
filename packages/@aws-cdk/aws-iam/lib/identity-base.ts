import cdk = require('@aws-cdk/cdk');
import { Policy } from "./policy";
import { PolicyStatement } from "./policy-document";
import { IPrincipal, PrincipalPolicyFragment } from "./principals";

/**
 * A construct that represents an IAM principal, such as a user, group or role.
 */
export interface IIdentity extends IPrincipal {
  /**
   * Adds an IAM statement to the default inline policy associated with this
   * principal. If a policy doesn't exist, it is created.
   */
  addToPolicy(statement: PolicyStatement): void;

  /**
   * Attaches an inline policy to this principal.
   * This is the same as calling `policy.addToXxx(principal)`.
   * @param policy The policy resource to attach to this principal.
   */
  attachInlinePolicy(policy: Policy): void;

  /**
   * Attaches a managed policy to this principal.
   * @param arn The ARN of the managed policy
   */
  attachManagedPolicy(arn: string): void;
}

export abstract class IdentityBase extends cdk.Construct implements IIdentity {
  public readonly assumeRoleAction: string = 'sts:AssumeRole';

  public abstract policyFragment: PrincipalPolicyFragment;
  public abstract addToPolicy(statement: PolicyStatement): void;
  public abstract attachInlinePolicy(policy: Policy): void;
  public abstract attachManagedPolicy(arn: string): void;
}