import { Construct, IConstruct } from '@aws-cdk/cdk';
import { IAliasRecordTarget } from '../alias-record-target';
import { IHostedZone } from '../hosted-zone-ref';
import { CfnRecordSet } from '../route53.generated';
import { determineFullyQualifiedDomainName } from './_util';

export interface AliasRecordProps {
  /**
   * The zone in which this alias should be defined.
   */
  readonly zone: IHostedZone;
  /**
   * Name for the record. This can be the FQDN for the record (foo.example.com) or
   * a subdomain of the parent hosted zone (foo, with example.com as the hosted zone).
   */
  readonly recordName: string;
  /**
   * Target for the alias record
   */
  readonly target: IAliasRecordTarget;
}

/**
 * An alias record
 */
export interface IAliasRecord extends IConstruct {
  /**
   * The domain name of the record
   */
  readonly domainName: string;
}

/**
 * Define a new Route53 alias record
 */
export class AliasRecord extends Construct implements IAliasRecord {
  public readonly domainName: string;

  constructor(scope: Construct, id: string, props: AliasRecordProps) {
    super(scope, id);

    const record = new CfnRecordSet(this, 'Resource', {
      hostedZoneId: props.zone.hostedZoneId,
      name: determineFullyQualifiedDomainName(props.recordName, props.zone),
      type: 'A',  // ipv4
      aliasTarget: props.target.bind(this)
    });

    this.domainName = record.ref;
  }
}