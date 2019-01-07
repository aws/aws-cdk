import { Construct } from '@aws-cdk/cdk';
import { IHostedZone } from '../hosted-zone-ref';
import { CfnRecordSet } from '../route53.generated';
import { determineFullyQualifiedDomainName } from './_util';

export interface CnameRecordProps {
  zone: IHostedZone;
  recordName: string;
  recordValue: string;
  /** @default 1800 seconds */
  ttl?: number;
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
