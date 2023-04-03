import * as route53 from '@aws-cdk/aws-route53';
/**
 * Use an Elastic Beanstalk environment URL as an alias record target.
 * E.g. mysampleenvironment.xyz.us-east-1.elasticbeanstalk.com
 * or mycustomcnameprefix.us-east-1.elasticbeanstalk.com
 *
 * Only supports Elastic Beanstalk environments created after 2016 that have a regional endpoint.
 */
export declare class ElasticBeanstalkEnvironmentEndpointTarget implements route53.IAliasRecordTarget {
    private readonly environmentEndpoint;
    constructor(environmentEndpoint: string);
    bind(_record: route53.IRecordSet, _zone?: route53.IHostedZone): route53.AliasRecordTargetConfig;
}
