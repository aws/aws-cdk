import { UserPoolDomain } from '@aws-cdk/aws-cognito';
import { AliasRecordTargetConfig, IAliasRecordTarget, IHostedZone, IRecordSet } from '@aws-cdk/aws-route53';
/**
 * Use a user pool domain as an alias record target
 */
export declare class UserPoolDomainTarget implements IAliasRecordTarget {
    private readonly domain;
    constructor(domain: UserPoolDomain);
    bind(_record: IRecordSet, _zone?: IHostedZone): AliasRecordTargetConfig;
}
