import type { CfnResource } from '../../../core';
import type { ICfnResourceMatcher } from '../../../core/lib/helpers-internal';
import type { CfnKey } from '../kms.generated';

/**
 * Matches a CfnKey by a KMS key identifier (ref, key ID, or ARN).
 */
export class CfnKeyMatcher implements ICfnResourceMatcher {
  readonly cfnResourceType = 'AWS::KMS::Key';

  constructor(private readonly keyId: string) {}

  matches(candidate: CfnResource): boolean {
    const key = candidate as CfnKey;
    return key.ref === this.keyId || key.attrKeyId === this.keyId || key.attrArn === this.keyId;
  }
}
