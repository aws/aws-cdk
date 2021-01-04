import { Duration, IResource, Resource, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAliasRecordTarget } from './alias-record-target';
import { IHostedZone } from './hosted-zone-ref';
import { CfnRecordSet } from './route53.generated';
import { determineFullyQualifiedDomainName } from './util';

/**
 * A record set
 */
export interface IRecordSet extends IResource {
  /**
   * The domain name of the record
   */
  readonly domainName: string;
}

/**
 * The record type.
 */
export enum RecordType {
  /**
   * route traffic to a resource, such as a web server, using an IPv4 address in dotted decimal
   * notation
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#AFormat
   */
  A = 'A',

  /**
   * route traffic to a resource, such as a web server, using an IPv6 address in colon-separated
   * hexadecimal format
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#AAAAFormat
   */
  AAAA = 'AAAA',

  /**
   * A CAA record specifies which certificate authorities (CAs) are allowed to issue certificates
   * for a domain or subdomain
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#CAAFormat
   */
  CAA = 'CAA',

  /**
   * A CNAME record maps DNS queries for the name of the current record, such as acme.example.com,
   * to another domain (example.com or example.net) or subdomain (acme.example.com or zenith.example.org).
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#CNAMEFormat
   */
  CNAME = 'CNAME',

  /**
   * An MX record specifies the names of your mail servers and, if you have two or more mail servers,
   * the priority order.
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#MXFormat
   */
  MX = 'MX',

  /**
   * A Name Authority Pointer (NAPTR) is a type of record that is used by Dynamic Delegation Discovery
   * System (DDDS) applications to convert one value to another or to replace one value with another.
   * For example, one common use is to convert phone numbers into SIP URIs.
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#NAPTRFormat
   */
  NAPTR = 'NAPTR',

  /**
   * An NS record identifies the name servers for the hosted zone
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#NSFormat
   */
  NS = 'NS',

  /**
   * A PTR record maps an IP address to the corresponding domain name.
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#PTRFormat
   */
  PTR = 'PTR',

  /**
   * A start of authority (SOA) record provides information about a domain and the corresponding Amazon
   * Route 53 hosted zone
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#SOAFormat
   */
  SOA = 'SOA',

  /**
   * SPF records were formerly used to verify the identity of the sender of email messages.
   * Instead of an SPF record, we recommend that you create a TXT record that contains the applicable value.
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#SPFFormat
   */
  SPF = 'SPF',

  /**
   * An SRV record Value element consists of four space-separated values. The first three values are
   * decimal numbers representing priority, weight, and port. The fourth value is a domain name.
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#SRVFormat
   */
  SRV = 'SRV',

  /**
   * A TXT record contains one or more strings that are enclosed in double quotation marks (").
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#TXTFormat
   */
  TXT = 'TXT'
}

/**
 * Options for a RecordSet.
 */
export interface RecordSetOptions {
  /**
   * The hosted zone in which to define the new record.
   */
  readonly zone: IHostedZone;

  /**
   * The domain name for this record.
   *
   * @default zone root
   */
  readonly recordName?: string;

  /**
   * The resource record cache time to live (TTL).
   *
   * @default Duration.minutes(30)
   */
  readonly ttl?: Duration;

  /**
   * A comment to add on the record.
   *
   * @default no comment
   */
  readonly comment?: string;
}

/**
 * Type union for a record that accepts multiple types of target.
 */
export class RecordTarget {
  /**
   * Use string values as target.
   */
  public static fromValues(...values: string[]) {
    return new RecordTarget(values);
  }

  /**
   * Use an alias as target.
   */
  public static fromAlias(aliasTarget: IAliasRecordTarget) {
    return new RecordTarget(undefined, aliasTarget);
  }

  /**
   * Use ip addresses as target.
   */
  public static fromIpAddresses(...ipAddresses: string[]) {
    return RecordTarget.fromValues(...ipAddresses);
  }

  /**
   *
   * @param values correspond with the chosen record type (e.g. for 'A' Type, specify one or more IP addresses)
   * @param aliasTarget alias for targets such as CloudFront distribution to route traffic to
   */
  protected constructor(public readonly values?: string[], public readonly aliasTarget?: IAliasRecordTarget) {
  }
}

/**
 * Construction properties for a RecordSet.
 */
export interface RecordSetProps extends RecordSetOptions {
  /**
   * The record type.
   */
  readonly recordType: RecordType;

  /**
   * The target for this record, either `RecordTarget.fromValues()` or
   * `RecordTarget.fromAlias()`.
   */
  readonly target: RecordTarget;
}

/**
 * A record set.
 */
export class RecordSet extends Resource implements IRecordSet {
  public readonly domainName: string;

  constructor(scope: Construct, id: string, props: RecordSetProps) {
    super(scope, id);

    const ttl = props.target.aliasTarget ? undefined : ((props.ttl && props.ttl.toSeconds()) || 1800).toString();

    const recordSet = new CfnRecordSet(this, 'Resource', {
      hostedZoneId: props.zone.hostedZoneId,
      name: determineFullyQualifiedDomainName(props.recordName || props.zone.zoneName, props.zone),
      type: props.recordType,
      resourceRecords: props.target.values,
      aliasTarget: props.target.aliasTarget && props.target.aliasTarget.bind(this),
      ttl,
      comment: props.comment,
    });

    this.domainName = recordSet.ref;
  }
}

/**
 * Target for a DNS A Record
 *
 * @deprecated Use RecordTarget
 */
export class AddressRecordTarget extends RecordTarget {
}

/**
 * Construction properties for a ARecord.
 */
export interface ARecordProps extends RecordSetOptions {
  /**
   * The target.
   */
  readonly target: RecordTarget;
}

/**
 * A DNS A record
 *
 * @resource AWS::Route53::RecordSet
 */
export class ARecord extends RecordSet {
  constructor(scope: Construct, id: string, props: ARecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.A,
      target: props.target,
    });
  }
}

/**
 * Construction properties for a AaaaRecord.
 */
export interface AaaaRecordProps extends RecordSetOptions {
  /**
   * The target.
   */
  readonly target: RecordTarget;
}

/**
 * A DNS AAAA record
 *
 * @resource AWS::Route53::RecordSet
 */
export class AaaaRecord extends RecordSet {
  constructor(scope: Construct, id: string, props: AaaaRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.AAAA,
      target: props.target,
    });
  }
}

/**
 * Construction properties for a CnameRecord.
 */
export interface CnameRecordProps extends RecordSetOptions {
  /**
   * The domain name.
   */
  readonly domainName: string;
}

/**
 * A DNS CNAME record
 *
 * @resource AWS::Route53::RecordSet
 */
export class CnameRecord extends RecordSet {
  constructor(scope: Construct, id: string, props: CnameRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.CNAME,
      target: RecordTarget.fromValues(props.domainName),
    });
  }
}

/**
 * Construction properties for a TxtRecord.
 */
export interface TxtRecordProps extends RecordSetOptions {
  /**
   * The text values.
   */
  readonly values: string[];
}

/**
 * A DNS TXT record
 *
 * @resource AWS::Route53::RecordSet
 */
export class TxtRecord extends RecordSet {
  constructor(scope: Construct, id: string, props: TxtRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.TXT,
      target: RecordTarget.fromValues(...props.values.map(v => formatTxt(v))),
    });
  }
}

/**
 * Formats a text value for use in a TXT record
 *
 * Use `JSON.stringify` to correctly escape and enclose in double quotes ("").
 *
 * DNS TXT records can contain up to 255 characters in a single string. TXT
 * record strings over 255 characters must be split into multiple text strings
 * within the same record.
 *
 * @see https://aws.amazon.com/premiumsupport/knowledge-center/route53-resolve-dkim-text-record-error/
 */
function formatTxt(string: string): string {
  const result = [];
  let idx = 0;
  while (idx < string.length) {
    result.push(string.slice(idx, idx += 255)); // chunks of 255 characters long
  }
  return result.map(r => JSON.stringify(r)).join('');
}

/**
 * Properties for a SRV record value.
 */
export interface SrvRecordValue {
  /**
   * The priority.
   */
  readonly priority: number;

  /**
   * The weight.
   */
  readonly weight: number;

  /**
   * The port.
   */
  readonly port: number;

  /**
   * The server host name.
   */
  readonly hostName: string;
}
/**
 * Construction properties for a SrvRecord.
 */
export interface SrvRecordProps extends RecordSetOptions {
  /**
   * The values.
   */
  readonly values: SrvRecordValue[];
}

/**
 * A DNS SRV record
 *
 * @resource AWS::Route53::RecordSet
 */
export class SrvRecord extends RecordSet {
  constructor(scope: Construct, id: string, props: SrvRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.SRV,
      target: RecordTarget.fromValues(...props.values.map(v => `${v.priority} ${v.weight} ${v.port} ${v.hostName}`)),
    });
  }
}

/**
 * The CAA tag.
 */
export enum CaaTag {
  /**
   * Explicity authorizes a single certificate authority to issue a
   * certificate (any type) for the hostname.
   */
  ISSUE = 'issue',

  /**
   * Explicity authorizes a single certificate authority to issue a
   * wildcard certificate (and only wildcard) for the hostname.
   */
  ISSUEWILD = 'issuewild',

  /**
   * Specifies a URL to which a certificate authority may report policy
   * violations.
   */
  IODEF = 'iodef',
}

/**
 * Properties for a CAA record value.
 */
export interface CaaRecordValue {
  /**
   * The flag.
   */
  readonly flag: number;

  /**
   * The tag.
   */
  readonly tag: CaaTag;

  /**
   * The value associated with the tag.
   */
  readonly value: string;
}

/**
 * Construction properties for a CaaRecord.
 */
export interface CaaRecordProps extends RecordSetOptions {
  /**
   * The values.
   */
  readonly values: CaaRecordValue[];
}

/**
 * A DNS CAA record
 *
 * @resource AWS::Route53::RecordSet
 */
export class CaaRecord extends RecordSet {
  constructor(scope: Construct, id: string, props: CaaRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.CAA,
      target: RecordTarget.fromValues(...props.values.map(v => `${v.flag} ${v.tag} "${v.value}"`)),
    });
  }
}

/**
 * Construction properties for a CaaAmazonRecord.
 */
export interface CaaAmazonRecordProps extends RecordSetOptions {}

/**
 * A DNS Amazon CAA record.
 *
 * A CAA record to restrict certificate authorities allowed
 * to issue certificates for a domain to Amazon only.
 *
 * @resource AWS::Route53::RecordSet
 */
export class CaaAmazonRecord extends CaaRecord {
  constructor(scope: Construct, id: string, props: CaaAmazonRecordProps) {
    super(scope, id, {
      ...props,
      values: [
        {
          flag: 0,
          tag: CaaTag.ISSUE,
          value: 'amazon.com',
        },
      ],
    });
  }
}

/**
 * Properties for a MX record value.
 */
export interface MxRecordValue {
  /**
   * The priority.
   */
  readonly priority: number;

  /**
   * The mail server host name.
   */
  readonly hostName: string;
}

/**
 * Construction properties for a MxRecord.
 */
export interface MxRecordProps extends RecordSetOptions {
  /**
   * The values.
   */
  readonly values: MxRecordValue[];
}

/**
 * A DNS MX record
 *
 * @resource AWS::Route53::RecordSet
 */
export class MxRecord extends RecordSet {
  constructor(scope: Construct, id: string, props: MxRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.MX,
      target: RecordTarget.fromValues(...props.values.map(v => `${v.priority} ${v.hostName}`)),
    });
  }
}

/**
 * Construction properties for a ZoneDelegationRecord
 */
export interface ZoneDelegationRecordProps extends RecordSetOptions {
  /**
   * The name servers to report in the delegation records.
   */
  readonly nameServers: string[];
}

/**
 * A record to delegate further lookups to a different set of name servers.
 */
export class ZoneDelegationRecord extends RecordSet {
  constructor(scope: Construct, id: string, props: ZoneDelegationRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.NS,
      target: RecordTarget.fromValues(...Token.isUnresolved(props.nameServers)
        ? props.nameServers // Can't map a string-array token!
        : props.nameServers.map(ns => (Token.isUnresolved(ns) || ns.endsWith('.')) ? ns : `${ns}.`),
      ),
      ttl: props.ttl || Duration.days(2),
    });
  }
}
