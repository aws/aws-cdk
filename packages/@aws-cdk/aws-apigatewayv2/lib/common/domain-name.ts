import { IResource } from '@aws-cdk/core';

/**
 * interface for the DomainName
 */
export interface IDomainName extends IResource {
  /**
   * domain name string
   *
   * @attribute
   *
   */
  readonly domainName: string;

  /**
   * The domain name associated with the regional endpoint for this custom domain name.
   *
   * @attribute
   */
  readonly regionalDomainName: string;

  /**
   * The region-specific Amazon Route 53 Hosted Zone ID of the regional endpoint.
   *
   * @attribute
   */
  readonly regionalHostedZoneId: string;
}

/**
 * custom domain name attributes
 */
export interface DomainNameAttributes {
  /**
   * domain name string
   */
  readonly domainName: string;

  /**
   * The domain name associated with the regional endpoint for this custom domain name.
   */
  readonly regionalDomainName: string;

  /**
   * The region-specific Amazon Route 53 Hosted Zone ID of the regional endpoint.
   */
  readonly regionalHostedZoneId: string;
}
