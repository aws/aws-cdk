/**
 * Zone properties for looking up the Hosted Zone
 */
export interface HostedZoneProviderProps {
  /**
   * The zone domain e.g. example.com
   */
  readonly domainName: string;

  /**
   * Is this a private zone
   */
  readonly privateZone?: boolean;

  /**
   * If this is a private zone which VPC is assocaitated
   */
  readonly vpcId?: string;
}
