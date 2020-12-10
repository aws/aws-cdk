import * as apigv2 from '@aws-cdk/aws-apigatewayv2';
import * as route53 from '@aws-cdk/aws-route53';

/**
 * Defines an API Gateway V2 domain name as the alias target.
 */
export class ApiGatewayv2Domain implements route53.IAliasRecordTarget {
  constructor(private readonly domainName: apigv2.IDomainName) { }

  public bind(_record: route53.IRecordSet): route53.AliasRecordTargetConfig {
    return {
      dnsName: this.domainName.regionalDomainName,
      hostedZoneId: this.domainName.regionalHostedZoneId,
    };
  }
}
