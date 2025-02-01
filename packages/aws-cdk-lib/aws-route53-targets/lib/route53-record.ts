import * as route53 from '../../aws-route53';
import { ValidationError } from '../../core/lib/errors';

/**
 * Use another Route 53 record as an alias record target
 */
export class Route53RecordTarget implements route53.IAliasRecordTarget {
  constructor(private readonly record: route53.IRecordSet) {
  }

  public bind(record: route53.IRecordSet, zone?: route53.IHostedZone): route53.AliasRecordTargetConfig {
    if (!zone) { // zone introduced as optional to avoid a breaking change
      throw new ValidationError('Cannot bind to record without a zone', record);
    }
    return {
      dnsName: this.record.domainName,
      hostedZoneId: zone.hostedZoneId,
    };
  }
}
