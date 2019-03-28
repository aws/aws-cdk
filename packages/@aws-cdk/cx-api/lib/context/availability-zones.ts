export const AVAILABILITY_ZONE_PROVIDER = 'availability-zones';

/**
 * Query to hosted zone context provider
 */
export interface AvailabilityZonesContextQuery {
  /**
   * Query account
   */
  readonly account?: string;

  /**
   * Query region
   */
  readonly region?: string;
}

/**
 * Response of the AZ provider looks like this
 */
export type AvailabilityZonesContextResponse = string[];