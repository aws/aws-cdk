import { Construct } from '@aws-cdk/cdk';
import { IHostedZone } from '../hosted-zone-ref';
import { CfnRecordSet } from '../route53.generated';
import { determineFullyQualifiedDomainName } from './_util';

export interface TXTRecordProps {
  zone: IHostedZone;
  recordName: string;
  recordValue: string;
  /** @default 1800 seconds */
  ttl?: number;
}

/**
 * A DNS TXT record
 */
export class TXTRecord extends Construct {
  constructor(scope: Construct, scid: string, props: TXTRecordProps) {
    super(scope, scid);

    // JSON.stringify conveniently wraps strings in " and escapes ".
    const recordValue = JSON.stringify(props.recordValue);
    const ttl = props.ttl === undefined ? 1800 : props.ttl;

    new CfnRecordSet(this, 'Resource', {
      hostedZoneId: props.zone.hostedZoneId,
      name: determineFullyQualifiedDomainName(props.recordName, props.zone),
      type: 'TXT',
      resourceRecords: [recordValue],
      ttl: ttl.toString()
    });
  }
}
