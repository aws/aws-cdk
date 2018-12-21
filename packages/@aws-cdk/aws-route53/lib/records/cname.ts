import { Construct } from '@aws-cdk/cdk';
import { HostedZoneRef } from '../hosted-zone-ref';
import { CfnRecordSet } from '../route53.generated';
import { determineFullyQualifiedDomainName } from './_util';

export interface CNAMERecordProps {
  recordName: string;
  recordValue: string;
  /** @default 1800 seconds */
  ttl?: number;
}

/**
 * A DNS CNAME record
 */
export class CNAMERecord extends Construct {
  constructor(parent: HostedZoneRef, name: string, props: CNAMERecordProps) {
    super(parent, name);

    const ttl = props.ttl === undefined ? 1800 : props.ttl;

    new CfnRecordSet(this, 'Resource', {
      hostedZoneId: parent.hostedZoneId,
      name: determineFullyQualifiedDomainName(props.recordName, parent),
      type: 'CNAME',
      resourceRecords:
        [
          props.recordValue,
        ],
      ttl: ttl.toString(),
    });
  }
}
