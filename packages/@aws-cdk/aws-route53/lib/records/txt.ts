import { Construct } from '@aws-cdk/cdk';
import { IHostedZone } from '../hosted-zone-ref';
import { CfnRecordSet } from '../route53.generated';
import { determineFullyQualifiedDomainName } from './_util';

export interface TxtRecordProps {
  /**
   * The hosted zone in which to define the new TXT record.
   */
  readonly zone: IHostedZone;

  /**
   * The domain name for this record set.
   */
  readonly recordName: string;

  /**
   * The value for this record set.
   */
  readonly recordValue: string;

  /**
   * The resource record cache time to live (TTL) in seconds.
   *
   * @default 1800 seconds
   */
  readonly ttl?: number;
}

/**
 * A DNS TXT record
 */
export class TxtRecord extends Construct {
  constructor(scope: Construct, id: string, props: TxtRecordProps) {
    super(scope, id);

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
