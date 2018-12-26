/**
 * Imported or created hosted zone
 */
export interface IHostedZone {
  /**
   * ID of this hosted zone
   */
  readonly hostedZoneId: string;

  /**
   * FQDN of this hosted zone
   */
  readonly zoneName: string;

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
  hostedZoneId: string;

  /**
   * Name of the hosted zone
   */
  zoneName: string;
}
