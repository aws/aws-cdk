/**
 * Interface for CloudFront distributions
 */
export interface IDistribution {
  /**
   * The domain name of the distribution
   */
  readonly domainName: string;
}