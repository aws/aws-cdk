import { Construct, Duration, IResource, Resource, Token } from '@aws-cdk/core';
import { IAliasRecordTarget } from './alias-record-target';
import { IHealthCheck } from './heath-check/health-check';
import { HostedZone } from './hosted-zone';
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
 * Geographic location
 */
export class GeoLocation {
  /**
   * Matches a continent geographic location
   *
   * @param continentCode The targeted continent
   */
  public static continent(continentCode: ContinentCode): GeoLocation {
    return new GeoLocation({continentCode});
  }

  /**
   * Matches a country geographic location
   *
   * Route 53 doesn't support creating geolocation records for the following countries:
   * * Bouvet Island (BV)
   * * Christmas Island (CX)
   * * Western Sahara (EH)
   * * Heard Island and McDonald Islands (HM)
   *
   * @param countryCode Two-letter ISO 3166-1 alpha 2 country code
   * @see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
   */
  public static country(countryCode: string): GeoLocation {
    return new GeoLocation({countryCode});
  }

  /**
   * Matches a United States state geographic location
   *
   * @param subdivisionCode Two-letter code for a state of the United States.
   * @see https://pe.usps.com/text/pub28/28apb.htm
   */
  public static unitedStatesSubidivision(subdivisionCode: string): GeoLocation {
    return new GeoLocation({subdivisionCode, countryCode: 'US'});
  }

  /**
   * Matches all geographic locations that aren't specified in other
   * geolocation resource record sets that have the same recordName and type.
   */
  public static wildcard(): GeoLocation {
    return new GeoLocation({countryCode: '*'});
  }

  private constructor(public readonly options: CfnRecordSet.GeoLocationProperty) {
  }
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

  /**
   * Specify the EC2 Region where you created the resource that this resource record set refers to
   *
   * @default - no specific latency-based routing
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html#routing-policy-latency
   */
  readonly region?: string;

  /**
   * Control how Amazon Route 53 responds to DNS queries based on the geographic origin of the query
   *
   * @default - no specific geographic routing
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html#routing-policy-geo
   */
  readonly geoLocation?: GeoLocation;

  /**
   * Controls the proportion of DNS queries that Route 53 responds to using the current record
   *
   * Route 53 calculates the sum of the weights for the records that have the same combination of DNS name and type.
   *
   * To disable routing to a resource, set weight to 0
   * If you set weight to 0 for all of the records in the group, traffic is routed to all resources with equal probability
   *
   * @default - no specific weighted routing
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html#routing-policy-weighted
   */
  readonly weight?: number;

  /**
   * If true, will route traffic approximately randomly to multiple resources
   *
   * @default false - no multi value answer routing
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html#routing-policy-multivalue
   */
  readonly multiValueAnswer?: boolean;

  /**
   * Failover routing lets you route traffic to a resource when the resource is healthy,
   * or to a different resource when the first resource is unhealthy
   *
   * @default - no failover routing
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html#routing-policy-failover
   */
  readonly failover?: FailoverType;

  /**
   * An identifier that differentiates among multiple resource record sets that have the same combination of name and type
   *
   * @default - no set identifier
   */
  readonly setIdentifier?: string;

  /**
   * If set, this record will only be sent in response when the status of a health check is healthy
   *
   * @default - no health check
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-recordset.html#cfn-route53-recordset-healthcheckid
   */
  readonly healthCheck?: IHealthCheck;
}

const routingPolicyKeys: Array<keyof RecordSetOptions> = ['geoLocation', 'region', 'weight', 'multiValueAnswer', 'failover'];

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
   * Use ip adresses as target.
   */
  public static fromIpAddresses(...ipAddresses: string[]) {
    return RecordTarget.fromValues(...ipAddresses);
  }

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

    const routingPolicyProps = routingPolicyKeys.filter((key) => !!props[key]);

    if (routingPolicyProps.length > 1) {
      throw new Error(`Cannot set more than 1 routing policy property (got ${routingPolicyProps.join(', ')})`);
    }

    if (routingPolicyProps.length) {
      if (!props.setIdentifier) {
        throw new Error(`Cannot create routing record sets without setIdentifier property (got ${routingPolicyProps[0]})`);
      }

      if (isHostedZoneConstruct(props.zone) && props.zone.isPrivateHostedZone()) {
        throw new Error(`Cannot create routing record sets in private hosted zones (got ${routingPolicyProps[0]})`);
      }
    }

    if (props.weight && (props.weight > 255 || props.weight < 0)) {
      throw new Error(`weight property cannot negative or over 255 (got ${props.weight})`);
    }

    const recordSet = new CfnRecordSet(this, 'Resource', {
      hostedZoneId: props.zone.hostedZoneId,
      name: determineFullyQualifiedDomainName(props.recordName || props.zone.zoneName, props.zone),
      type: props.recordType,
      resourceRecords: props.target.values,
      aliasTarget: props.target.aliasTarget && props.target.aliasTarget.bind(this),
      ttl,
      comment: props.comment,
      setIdentifier: props.setIdentifier,
      region: props.region,
      geoLocation: props.geoLocation && props.geoLocation.options,
      weight: props.weight != null ? props.weight : undefined,
      multiValueAnswer: props.multiValueAnswer || undefined,
      failover: props.failover,
      healthCheckId: props.healthCheck && props.healthCheck.healthCheckId,
    });

    this.domainName = recordSet.ref;
  }
}

/**
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
  readonly target: AddressRecordTarget;
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
      target: RecordTarget.fromValues(props.domainName)
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
      target: RecordTarget.fromValues(...props.values.map(v => JSON.stringify(v))),
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
   * Explicitly authorizes a single certificate authority to issue a
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
      target: RecordTarget.fromValues(...props.values.map(v => `${v.priority} ${v.hostName}`))
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
        : props.nameServers.map(ns => (Token.isUnresolved(ns) || ns.endsWith('.')) ? ns : `${ns}.`)
      ),
      ttl: props.ttl || Duration.days(2)
    });
  }
}

/**
 * Contient code
 */
export enum ContinentCode {
  /**
   * Africa
   */
  AFRICA = 'AF',
  /**
   * Antarctica
   */
  ANTARCTICA = 'AN',
  /**
   * Asia
   */
  ASIA = 'AS',
  /**
   * Europe
   */
  EUROPE = 'EU',
  /**
   * Oceania
   */
  OCEANIA = 'OC',
  /**
   * North America
   */
  NORTH_AMERICA = 'NA',
  /**
   * South America
   */
  SOUTH_AMERICA = 'SA',
}

/**
 * Failover routing type
 */
export enum FailoverType {
  /**
   * Primary record
   */
  PRIMARY = 'PRIMARY',

  /**
   * Secondary record
   */
  SECONDARY = 'SECONDARY',
}

const isHostedZoneConstruct = (zone: IHostedZone): zone is HostedZone => !!(zone as HostedZone).isPrivateHostedZone;
