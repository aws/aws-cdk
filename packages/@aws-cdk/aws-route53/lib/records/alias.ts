import { Construct } from '@aws-cdk/cdk';
import { HostedZoneRef } from '../hosted-zone-ref';
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
  hostedZoneId: string;

  /**
   * DNS name of the target
   */
  dnsName: string;
}

export interface AliasRecordProps {
  /**
   * Name for the record. This can be the FQDN for the record (foo.example.com) or
   * a subdomain of the parent hosted zone (foo, with example.com as the hosted zone).
   */
  recordName: string;
  /**
   * Target for the alias record
   */
  target: IAliasRecordTarget;
}

/**
 * A Route53 alias record
 */
export class AliasRecord extends Construct {
  constructor(parent: HostedZoneRef, id: string, props: AliasRecordProps) {
    super(parent, id);

    new CfnRecordSet(this, 'Resource', {
      hostedZoneId: parent.hostedZoneId,
      name: determineFullyQualifiedDomainName(props.recordName, parent),
      type: 'A',  // ipv4
      aliasTarget: props.target.asAliasRecordTarget()
    });
  }
}