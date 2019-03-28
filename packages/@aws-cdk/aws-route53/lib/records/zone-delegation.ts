import cdk = require('@aws-cdk/cdk');
import { ZoneDelegationOptions } from '../hosted-zone';
import { IHostedZone } from '../hosted-zone-ref';
import { CfnRecordSet } from '../route53.generated';
import { determineFullyQualifiedDomainName } from './_util';

export interface ZoneDelegationRecordProps extends ZoneDelegationOptions {
  /**
   * The zone in which this delegate is defined.
   */
  readonly zone: IHostedZone;
  /**
   * The name of the zone that delegation is made to.
   */
  readonly delegatedZoneName: string;

  /**
   * The name servers to report in the delegation records.
   */
  readonly nameServers: string[];
}

/**
 * A record to delegate further lookups to a different set of name servers
 */
export class ZoneDelegationRecord extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: ZoneDelegationRecordProps) {
    super(scope, id);

    const ttl = props.ttl === undefined ? 172_800 : props.ttl;
    const resourceRecords = cdk.unresolved(props.nameServers)
      ? props.nameServers // Can't map a string-array token!
      : props.nameServers.map(ns => (cdk.unresolved(ns) || ns.endsWith('.')) ? ns : `${ns}.`);

    new CfnRecordSet(this, 'Resource', {
      hostedZoneId: props.zone.hostedZoneId,
      name: determineFullyQualifiedDomainName(props.delegatedZoneName, props.zone),
      type: 'NS',
      ttl: ttl.toString(),
      comment: props.comment,
      resourceRecords,
    });
  }
}
