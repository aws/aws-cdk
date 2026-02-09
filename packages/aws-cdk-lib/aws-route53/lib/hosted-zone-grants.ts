import type { GrantDelegationOptions, INamedHostedZoneRef } from './hosted-zone-ref';
import { makeGrantDelegation } from './util';
import type { IGrantable } from '../../aws-iam';
import type { Grant } from '../../aws-iam/lib/grant';

/**
 * Collection of grant methods for a INamedHostedZoneRef
 */
export class HostedZoneGrants {
  /**
   * Creates grants for INamedHostedZoneRef
   *
   */
  public static fromHostedZone(hostedZone: INamedHostedZoneRef): HostedZoneGrants {
    return new HostedZoneGrants(hostedZone);
  }

  private constructor(private readonly hostedZone: INamedHostedZoneRef) {
  }

  /**
   * Grant permissions to add delegation records to this zone
   */
  public delegation(grantee: IGrantable, delegationOptions?: GrantDelegationOptions): Grant {
    return makeGrantDelegation(grantee, this.hostedZone, delegationOptions);
  }
}
