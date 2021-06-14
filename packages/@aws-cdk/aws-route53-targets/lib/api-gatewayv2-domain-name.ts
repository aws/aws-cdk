import * as route53 from '@aws-cdk/aws-route53';

/**
 * Defines an API Gateway V2 domain name as the alias target.
 */
export class ApiGatewayv2DomainProperties implements route53.IAliasRecordTarget {
  /**
   * @param regionalDomainName the domain name associated with the regional endpoint for this custom domain name.
   * @param regionalHostedZoneId the region-specific Amazon Route 53 Hosted Zone ID of the regional endpoint.
   */
  constructor(private readonly regionalDomainName: string, private readonly regionalHostedZoneId: string) { }

  public bind(_record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig {
    return {
      dnsName: this.regionalDomainName,
      hostedZoneId: this.regionalHostedZoneId,
    };
  }
}
