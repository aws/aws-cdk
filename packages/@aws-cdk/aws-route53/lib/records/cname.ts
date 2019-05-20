import { Construct } from '@aws-cdk/cdk';
import { IHostedZone } from '../hosted-zone-ref';
import { CfnRecordSet } from '../route53.generated';
import { determineFullyQualifiedDomainName } from './_util';

export interface CnameRecordProps {
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
 * A DNS CNAME record
 */
export class CnameRecord extends Construct {
  constructor(scope: Construct, id: string, props: CnameRecordProps) {
    super(scope, id);

    const ttl = props.ttl === undefined ? 1800 : props.ttl;

    new CfnRecordSet(this, 'Resource', {
      hostedZoneId: props.zone.hostedZoneId,
      name: determineFullyQualifiedDomainName(props.recordName, props.zone),
      type: 'CNAME',
      resourceRecords: [ props.recordValue ],
      ttl: ttl.toString(),
    });
  }
}
