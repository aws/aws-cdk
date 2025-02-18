import { CloudFrontTarget } from './cloudfront-target';
import { UserPoolDomain } from '../../aws-cognito';
import { AliasRecordTargetConfig, IAliasRecordTarget, IHostedZone, IRecordSet } from '../../aws-route53';
import { FeatureFlags } from '../../core';
import { USER_POOL_DOMAIN_NAME_METHOD_WITHOUT_CUSTOM_RESOURCE } from '../../cx-api';

/**
 * Use a user pool domain as an alias record target
 */
export class UserPoolDomainTarget implements IAliasRecordTarget {
  constructor(private readonly domain: UserPoolDomain) {
  }

  public bind(record: IRecordSet, _zone?: IHostedZone): AliasRecordTargetConfig {
    const dnsName = FeatureFlags.of(record).isEnabled(USER_POOL_DOMAIN_NAME_METHOD_WITHOUT_CUSTOM_RESOURCE)
      ? this.domain.cloudFrontEndpoint
      : this.domain.cloudFrontDomainName;
    return {
      dnsName,
      hostedZoneId: CloudFrontTarget.getHostedZoneId(this.domain),
    };
  }
}
