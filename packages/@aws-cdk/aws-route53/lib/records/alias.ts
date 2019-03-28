import { Construct } from '@aws-cdk/cdk';
import { IHostedZone } from '../hosted-zone-ref';
import { CfnRecordSet } from '../route53.generated';
import { determineFullyQualifiedDomainName } from './_util';

/**
 * Classes that are valid alias record targets, like CloudFront distributions and load
 * balancers, should implement this interface.
 */
export interface IAliasRecordTarget {
  /**
   * Return hosted zone ID and DNS name, usable for Route53 alias targets
   */
  asAliasRecordTarget(): AliasRecordTargetProps;
}

/**
 * Represents the properties of an alias target destination.
 */
export interface AliasRecordTargetProps {
  /**
   * Hosted zone ID of the target
   */
  readonly hostedZoneId: string;

  /**
   * DNS name of the target
   */
  readonly dnsName: string;
}

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
 * A Route53 alias record
 */
export class AliasRecord extends Construct {
  constructor(scope: Construct, id: string, props: AliasRecordProps) {
    super(scope, id);

    new CfnRecordSet(this, 'Resource', {
      hostedZoneId: props.zone.hostedZoneId,
      name: determineFullyQualifiedDomainName(props.recordName, props.zone),
      type: 'A',  // ipv4
      aliasTarget: props.target.asAliasRecordTarget()
    });
  }
}