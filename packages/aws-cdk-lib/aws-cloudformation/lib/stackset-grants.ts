import { StackSetSynthesizer } from './private/stackset-synthesizer';
import * as iam from '../../aws-iam';
import type { IStackSetRef } from '../../interfaces/generated/aws-cloudformation-interfaces.generated';

/**
 * Collection of grant methods for a StackSet
 */
export class StackSetGrants {
  /**
   * Creates grants for a StackSet
   *
   * For a referenced StackSet, the grant methods grant nothing.
   *
   * @param stackSet the StackSet to grant access to
   */
  public static fromStackSet(stackSet: IStackSetRef): StackSetGrants {
    return new StackSetGrants(stackSet);
  }

  private constructor(private readonly stackSet: IStackSetRef) {}

  /**
   * Grants read access to the file assets of this StackSet
   *
   * Grant it to the accounts or the organization the StackSet deploys to. Only asset buckets
   * defined in this app are changed, and no KMS permissions are granted.
   *
   * @param grantee the principal to grant read access to
   */
  public readAssets(grantee: iam.IGrantable): iam.Grant {
    const synthesizer = StackSetSynthesizer.of(this.stackSet);
    return synthesizer
      ? synthesizer.grantReadAssets(grantee)
      : iam.Grant.drop(grantee, 'read the file assets of a referenced StackSet');
  }
}
