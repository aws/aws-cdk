import type { Construct } from 'constructs';
import { AccountPolicyDocument } from './account-policy';
import type { DataProtectionPolicy } from './data-protection-policy';
import type { AccountPolicyDocumentConfig } from './private/account-policy-config';

/**
 * A CloudWatch Logs account policy that applies a data protection policy to every log
 * group in the account.
 *
 * Create instances of this class using `AccountPolicyDocument.dataProtection()`.
 */
export class DataProtectionAccountPolicyDocument extends AccountPolicyDocument {
  constructor(private readonly policy: DataProtectionPolicy) {
    super();
  }

  /**
   * @internal
   */
  public _bind(scope: Construct): AccountPolicyDocumentConfig {
    const config = this.policy._bind(scope);

    return {
      policyType: 'DATA_PROTECTION_POLICY',
      policyDocument: JSON.stringify({
        Name: config.name,
        Description: config.description,
        Version: config.version,
        Statement: config.statement,
        Configuration: config.configuration,
      }),
    };
  }
}
