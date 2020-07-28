import { UserPoolDomain } from '@aws-cdk/aws-cognito';
import { AliasRecordTargetConfig, IAliasRecordTarget, IRecordSet } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from './cloudfront-target';

/**
 * Use a user pool domain as an alias record target
 */
export class UserPoolDomainTarget implements IAliasRecordTarget {
  constructor(private readonly domain: UserPoolDomain) {
  }

  public bind(_record: IRecordSet): AliasRecordTargetConfig {
    return {
      dnsName: this.domain.cloudFrontDomainName,
      hostedZoneId: CloudFrontTarget.getHostedZoneId(this.domain),
    };
  }
}
