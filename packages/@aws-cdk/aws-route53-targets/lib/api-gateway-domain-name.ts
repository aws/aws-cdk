import apig = require('@aws-cdk/aws-apigateway');
import route53 = require('@aws-cdk/aws-route53');

/**
 * Defines an API Gateway domain name as the alias target.
 *
 * Use the `ApiGateway` class if you wish to map the alias to an REST API with a
 * domain name defined throug the `RestApiProps.domainName` prop.
 */
export class ApiGatewayDomain implements route53.IAliasRecordTarget {
  constructor(private readonly domainName: apig.IDomainName) { }

  public bind(_record: route53.IRecordSet): route53.AliasRecordTargetConfig {
    return {
      dnsName: this.domainName.domainNameAliasDomainName,
      hostedZoneId: this.domainName.domainNameAliasHostedZoneId,
    };
  }
}

/**
 * Defines an API Gateway REST API as the alias target. Requires that the domain
 * name will be defined through `RestApiProps.domainName`.
 *
 * You can direct the alias to any `apigateway.DomainName` resource through the
 * `ApiGatewayDomain` class.
 */
export class ApiGateway extends ApiGatewayDomain {
  constructor(api: apig.RestApi) {
    if (!api.domainName) {
      throw new Error(`API does not define a default domain name`);
    }

    super(api.domainName);
  }
}