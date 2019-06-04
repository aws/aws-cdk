import { Construct, Resource } from '@aws-cdk/cdk';
import { IHostedZone } from '../hosted-zone-ref';
import { CfnRecordSet } from '../route53.generated';
import { determineFullyQualifiedDomainName } from './_util';

/**
 * The record type.
 */
export enum RecordType {
  A = 'A',
  AAAA = 'AAAA',
  CAA = 'CAA',
  CNAME = 'CNAME',
  MX = 'MX',
  NAPTR = 'NAPTR',
  NS = 'NS',
  PTR = 'PTR',
  SOA = 'SOA',
  SPF = 'SPF',
  SRV = 'SRV',
  TXT = 'TXT'
}

/**
 * Propreties for a record.
 */
export interface RecordProps {
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
   * The resource record cache time to live (TTL) in seconds.
   *
   * @default 1800 seconds
   */
  readonly ttl?: number;
}

/**
 * Construction properties for a BasicRecord.
 */
export interface BasicRecordProps extends RecordProps {
  /**
   * The record type.
   */
  readonly recordType: RecordType;

  /**
   * The values for this record.
   */
  readonly recordValues: string[];
}

/**
 * A basic record
 *
 * @resource AWS::Route53::RecordSet
 *
 * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-values-basic.html
 */
export class BasicRecord extends Resource {
  constructor(scope: Construct, id: string, props: BasicRecordProps) {
    super(scope, id);

    const ttl = props.ttl === undefined ? 1800 : props.ttl;

    new CfnRecordSet(this, 'Resource', {
      hostedZoneId: props.zone.hostedZoneId,
      name: determineFullyQualifiedDomainName(props.recordName || props.zone.zoneName, props.zone),
      type: props.recordType,
      resourceRecords: props.recordValues,
      ttl: ttl.toString()
    });
  }
}

/**
 * Construction properties for a ARecord.
 */
export interface ARecordProps extends RecordProps {
  /**
   * The IP addresses.
   */
  readonly ipAddresses: string[];
}

/**
 * A DNS A record
 *
 * @resource AWS::Route53::RecordSet
 */
export class ARecord extends BasicRecord {
  constructor(scope: Construct, id: string, props: ARecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.A,
      recordValues: props.ipAddresses,
    });
  }
}

/**
 * Construction properties for a AaaaRecord.
 */
export interface AaaaRecordProps extends RecordProps, ARecordProps {}

/**
 * A DNS AAAA record
 *
 * @resource AWS::Route53::RecordSet
 */
export class AaaaRecord extends BasicRecord {
  constructor(scope: Construct, id: string, props: AaaaRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.AAAA,
      recordValues: props.ipAddresses,
    });
  }
}

/**
 * Construction properties for a CnameRecord.
 */
export interface CnameRecordProps extends RecordProps {
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
export class CnameRecord extends BasicRecord {
  constructor(scope: Construct, id: string, props: CnameRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.CNAME,
      recordValues: [props.domainName]
    });
  }
}

/**
 * Construction properties for a TxtRecord.
 */
export interface TxtRecordProps extends RecordProps {
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
export class TxtRecord extends BasicRecord {
  constructor(scope: Construct, id: string, props: TxtRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.TXT,
      recordValues: props.values && props.values.map(v => JSON.stringify(v)),
    });
  }
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
export interface SrvRecordProps extends RecordProps {
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
export class SrvRecord extends BasicRecord {
  constructor(scope: Construct, id: string, props: SrvRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.SRV,
      recordValues: props.values.map(v => `${v.priority} ${v.weight} ${v.port} ${v.hostName}`),
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
export interface CaaRecordProps extends RecordProps {
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
export class CaaRecord extends BasicRecord {
  constructor(scope: Construct, id: string, props: CaaRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.CAA,
      recordValues: props.values.map(v => `${v.flag} ${v.tag} "${v.value}"`),
    });
  }
}

/**
 * Construction properties for a CaaAmazonRecord.
 */
export interface CaaAmazonRecordProps extends RecordProps {}

/**
 * A DNS Amazon CAA record
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
          value: 'amazon.com'
        }
      ],
      recordName: props.zone.zoneName
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
export interface MxRecordProps extends RecordProps {
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
export class MxRecord extends BasicRecord {
  constructor(scope: Construct, id: string, props: MxRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.MX,
      recordValues: props.values.map(v => `${v.priority} ${v.hostName}`)
    });
  }
}
