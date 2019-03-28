export const HOSTED_ZONE_PROVIDER = 'hosted-zone';

/**
 * Query to hosted zone context provider
 */
export interface HostedZoneContextQuery {
  /**
   * Query account
   */
  readonly account?: string;

  /**
   * Query region
   */
  readonly region?: string;

  /**
   * The domain name e.g. example.com to lookup
   */
  readonly domainName: string;

  /**
   * True if the zone you want to find is a private hosted zone
   */
  readonly privateZone?: boolean;

  /**
   * The VPC ID to that the private zone must be associated with
   *
   * If you provide VPC ID and privateZone is false, this will return no results
   * and raise an error.
   */
  readonly vpcId?: string;
}

/**
 * Hosted zone context
 *
 * This definition is for human reference. It is not machine-checked as the
 * naming conventions used in it are not JSII compatible, and changing those
 * introduces a backwards incompatibility.
 */
// export interface HostedZoneContextResponse {
//   /**
//    * The ID that Amazon Route 53 assigned to the hosted zone when you created
//    * it.
//    */
//   Id: string;

//   /**
//    * The name of the domain. For public hosted zones, this is the name that you
//    * have registered with your DNS registrar. For information about how to
//    * specify characters other than a-z, 0-9, and - (hyphen) and how to specify
//    * internationalized domain names, see CreateHostedZone.
//    */
//   Name: string;
// }