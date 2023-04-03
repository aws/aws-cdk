import * as apig from '@aws-cdk/aws-apigateway';
import * as route53 from '@aws-cdk/aws-route53';
/**
 * Defines an API Gateway domain name as the alias target.
 *
 * Use the `ApiGateway` class if you wish to map the alias to an REST API with a
 * domain name defined through the `RestApiProps.domainName` prop.
 */
export declare class ApiGatewayDomain implements route53.IAliasRecordTarget {
    private readonly domainName;
    constructor(domainName: apig.IDomainName);
    bind(_record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig;
}
/**
 * Defines an API Gateway REST API as the alias target. Requires that the domain
 * name will be defined through `RestApiProps.domainName`.
 *
 * You can direct the alias to any `apigateway.DomainName` resource through the
 * `ApiGatewayDomain` class.
 */
export declare class ApiGateway extends ApiGatewayDomain {
    constructor(api: apig.RestApiBase);
}
