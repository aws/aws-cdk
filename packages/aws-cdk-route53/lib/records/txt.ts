import { Construct } from 'aws-cdk';
import { route53 } from 'aws-cdk-resources';
import { HostedZoneRef } from '../hosted-zone-ref';
import { determineFullyQualifiedDomainName } from './_util';

export interface TXTRecordProps {
    recordName: string;
    recordValue: string;
    /** @default 1800 seconds */
    ttl?: number;
}

/**
 * A DNS TXT record
 */
export class TXTRecord extends Construct {
    constructor(parent: HostedZoneRef, name: string, props: TXTRecordProps) {
        super(parent, name);

        // JSON.stringify conveniently wraps strings in " and escapes ".
        const recordValue = JSON.stringify(props.recordValue);
        const ttl = props.ttl === undefined ? 1800 : props.ttl;

        new route53.RecordSetResource(this, 'Resource', {
            hostedZoneId: parent.hostedZoneId,
            recordSetName: determineFullyQualifiedDomainName(props.recordName, parent),
            type: 'TXT',
            resourceRecords: [recordValue],
            ttl: ttl.toString()
        });
    }
}
