export const AVAILABILITY_ZONE_PROVIDER = 'availability-zones';

/**
 * Query to hosted zone context provider
 */
export interface AvailabilityZonesContextQuery {
  /**
   * Query account
   */
  account?: string;

  /**
   * Query region
   */
  region?: string;

}

/**
 * Response of the AZ provider looks like this
 */
export type AvailabilityZonesContextResponse = string[];