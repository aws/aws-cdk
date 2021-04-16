import * as route53 from '@aws-cdk/aws-route53';

/**
 * Defines an API Gateway V2 domain name as the alias target.
 */
export class ApiGatewayv2Domain implements route53.IAliasRecordTarget {
  constructor(private readonly domainName: ApiGateWayDomainName) { }

  public bind(_record: route53.IRecordSet): route53.AliasRecordTargetConfig {
    return {
      dnsName: this.domainName.regionalDomainName,
      hostedZoneId: this.domainName.regionalHostedZoneId,
    };
  }
}

/**
 * Represents an APIGatewayV2 DomainName
 */
export interface ApiGateWayDomainName {
  /**
    * The region-specific Amazon Route 53 Hosted Zone ID of the regional endpoint.
    */
  readonly regionalHostedZoneId: string;

  /**
   * The domain name associated with the regional endpoint for this custom domain name.
   */
  readonly regionalDomainName: string;

}
