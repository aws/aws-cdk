import { CloudFrontTarget } from './cloudfront-target';
import { UserPoolDomain } from '../../aws-cognito';
import { AliasRecordTargetConfig, IAliasRecordTarget, IHostedZone, IRecordSet } from '../../aws-route53';
import { FeatureFlags } from '../../core';
import { USE_NEW_METHOD_FOR_USER_POOL_DOMAIN_DNS_NAME } from '../../cx-api';

/**
 * Use a user pool domain as an alias record target
 */
export class UserPoolDomainTarget implements IAliasRecordTarget {
  constructor(private readonly domain: UserPoolDomain) {
  }

  public bind(record: IRecordSet, _zone?: IHostedZone): AliasRecordTargetConfig {
    const dnsName = FeatureFlags.of(record).isEnabled(USE_NEW_METHOD_FOR_USER_POOL_DOMAIN_DNS_NAME)
      ? this.domain.cloudFrontEndpoint
      : this.domain.cloudFrontDomainName;
    return {
      dnsName,
      hostedZoneId: CloudFrontTarget.getHostedZoneId(this.domain),
    };
  }
}
