import { IResource } from '@aws-cdk/cdk';

/**
 * Imported or created hosted zone
 */
export interface IHostedZone extends IResource {
  /**
   * ID of this hosted zone, such as "Z23ABC4XYZL05B"
   */
  readonly hostedZoneId: string;

  /**
   * FQDN of this hosted zone
   */
  readonly zoneName: string;

  /**
   * Returns the set of name servers for the specific hosted zone. For example:
   * ns1.example.com.
   *
   * This attribute will be undefined for private hosted zones or hosted zones imported from another stack.
   */
  readonly hostedZoneNameServers?: string[];

  /**
   * Export the hosted zone
   */
  export(): HostedZoneAttributes;
}

/**
 * Reference to a hosted zone
 */
export interface HostedZoneAttributes {
  /**
   * Identifier of the hosted zone
   */
  readonly hostedZoneId: string;

  /**
   * Name of the hosted zone
   */
  readonly zoneName: string;
}
