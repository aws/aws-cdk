/**
 * The rendered form of an `AccountPolicyDocument`, ready to be passed to the underlying
 * `AWS::Logs::AccountPolicy` resource.
 */
export interface AccountPolicyDocumentConfig {
  /**
   * The type of policy.
   */
  readonly policyType: string;

  /**
   * The policy, in JSON.
   */
  readonly policyDocument: string;

  /**
   * Restricts the policy to a subset of the log groups in the account.
   *
   * @default - the policy applies to all log groups in the account
   */
  readonly selectionCriteria?: string;
}
