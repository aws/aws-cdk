import * as route53 from '@aws-cdk/aws-route53';

/**
 * Use another Route 53 record as an alias record target
 */
export class Route53RecordTarget implements route53.IAliasRecordTarget {
  constructor(private readonly record: route53.IRecordSet) {
  }

  public bind(_record: route53.IRecordSet, zone?: route53.IHostedZone): route53.AliasRecordTargetConfig {
    if (!zone) { // zone introduced as optional to avoid a breaking change
      throw new Error('Cannot bind to record without a zone');
    }
    return {
      dnsName: this.record.domainName,
      hostedZoneId: zone.hostedZoneId,
    };
  }
}
