import { Construct } from '@aws-cdk/cdk';
import { IHostedZone } from '../hosted-zone-ref';
import { CfnRecordSet } from '../route53.generated';
import { determineFullyQualifiedDomainName } from './_util';

export interface ZoneDelegationRecordProps {
  /**
   * The zone in which this delegate is defined.
   */
  zone: IHostedZone;
  /**
   * The name of the zone that delegation is made to.
   */
  delegatedZoneName: string;

  /**
   * The name servers to report in the delegation records.
   */
  nameServers: string[];

  /**
   * The TTL of the zone delegation records.
   *
   * @default 172800 seconds.
   */
  ttl?: number;

  /**
   * Any comments that you want to include about the zone delegation records.
   *
   * @default no comment.
   */
  comment?: string;
}

/**
 * A record to delegate further lookups to a different set of name servers
 */
export class ZoneDelegationRecord extends Construct {
  constructor(parent: Construct, name: string, props: ZoneDelegationRecordProps) {
    super(parent, name);

    const ttl = props.ttl === undefined ? 172_800 : props.ttl;

    new CfnRecordSet(this, 'Resource', {
      hostedZoneId: props.zone.hostedZoneId,
      name: determineFullyQualifiedDomainName(props.delegatedZoneName, props.zone),
      type: 'NS',
      ttl: ttl.toString(),
      comment: props.comment,
      resourceRecords: props.nameServers.map(ns => ns.endsWith('.') ? ns : `${ns}.`)
    });
  }
}
