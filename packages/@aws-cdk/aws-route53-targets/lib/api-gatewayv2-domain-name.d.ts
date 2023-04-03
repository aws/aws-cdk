import * as route53 from '@aws-cdk/aws-route53';
/**
 * Defines an API Gateway V2 domain name as the alias target.
 */
export declare class ApiGatewayv2DomainProperties implements route53.IAliasRecordTarget {
    private readonly regionalDomainName;
    private readonly regionalHostedZoneId;
    /**
     * @param regionalDomainName the domain name associated with the regional endpoint for this custom domain name.
     * @param regionalHostedZoneId the region-specific Amazon Route 53 Hosted Zone ID of the regional endpoint.
     */
    constructor(regionalDomainName: string, regionalHostedZoneId: string);
    bind(_record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig;
}
