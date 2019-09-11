/**
 * Interface for CloudFront distributions
 */
export interface IDistribution {
  /**
   * The domain name of the distribution
   */
  readonly domainName: string;

  /**
   * The distribution ID for this distribution.
   */
  readonly distributionId: string;
}