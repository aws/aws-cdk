import { CloudFrontTarget } from './cloudfront-target';
import type { UserPoolDomain } from '../../aws-cognito';
import type { AliasRecordTargetConfig, IAliasRecordTarget, IHostedZone, IRecordSet } from '../../aws-route53';

/**
 * Use a user pool domain as an alias record target
 */
export class UserPoolDomainTarget implements IAliasRecordTarget {
  constructor(private readonly domain: UserPoolDomain) {
  }

  public bind(_record: IRecordSet, _zone?: IHostedZone): AliasRecordTargetConfig {
    return {
      dnsName: this.domain.cloudFrontEndpoint,
      hostedZoneId: CloudFrontTarget.getHostedZoneId(this.domain),
    };
  }
}
