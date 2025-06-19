import { Construct } from 'constructs';
import { AliasRecordTargetConfig, IAliasRecordTarget } from './alias-record-target';
import { CidrRoutingConfig } from './cidr-routing-config';
import { GeoLocation } from './geo-location';
import { IHealthCheck } from './health-check';
import { IHostedZone } from './hosted-zone-ref';
import { CfnRecordSet } from './route53.generated';
import { determineFullyQualifiedDomainName } from './util';
import * as iam from '../../aws-iam';
import { Annotations, CustomResource, Duration, IResource, Names, RemovalPolicy, Resource, Token } from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import { CrossAccountZoneDelegationProvider } from '../../custom-resource-handlers/dist/aws-route53/cross-account-zone-delegation-provider.generated';
import { DeleteExistingRecordSetProvider } from '../../custom-resource-handlers/dist/aws-route53/delete-existing-record-set-provider.generated';

const CROSS_ACCOUNT_ZONE_DELEGATION_RESOURCE_TYPE = 'Custom::CrossAccountZoneDelegation';
const DELETE_EXISTING_RECORD_SET_RESOURCE_TYPE = 'Custom::DeleteExistingRecordSet';

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
   * A delegation signer (DS) record refers a zone key for a delegated subdomain zone.
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#DSFormat
   */
  DS = 'DS',

  /**
   * An HTTPS resource record is a form of the Service Binding (SVCB) DNS record that provides extended configuration information,
   * enabling a client to easily and securely connect to a service with an HTTP protocol.
   * The configuration information is provided in parameters that allow the connection in one DNS query, rather than necessitating multiple DNS queries.
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#HTTPSFormat
   */
  HTTPS = 'HTTPS',

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
   * A Secure Shell fingerprint record (SSHFP) identifies SSH keys associated with the domain name.
   * SSHFP records must be secured with DNSSEC for a chain of trust to be established.
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#SSHFPFormat
   */
  SSHFP = 'SSHFP',

  /**
   * You use an SVCB record to deliver configuration information for accessing service endpoints.
   * The SVCB is a generic DNS record and can be used to negotiate parameters for a variety of application protocols.
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#SVCBFormat
   */
  SVCB = 'SVCB',

  /**
   * You use a TLSA record to use DNS-Based Authentication of Named Entities (DANE).
   * A TLSA record associates a certificate/public key with a Transport Layer Security (TLS) endpoint, and clients can validate the certificate/public key using a TLSA record signed with DNSSEC.
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#TLSAFormat
   */
  TLSA = 'TLSA',

  /**
   * A TXT record contains one or more strings that are enclosed in double quotation marks (").
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#TXTFormat
   */
  TXT = 'TXT',
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
   * The geographical origin for this record to return DNS records based on the user's location.
   */
  readonly geoLocation?: GeoLocation;

  /**
   * The subdomain name for this record. This should be relative to the zone root name.
   *
   * For example, if you want to create a record for acme.example.com, specify
   * "acme".
   *
   * You can also specify the fully qualified domain name which terminates with a
   * ".". For example, "acme.example.com.".
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
   * Whether to delete the same record set in the hosted zone if it already exists (dangerous!)
   *
   * This allows to deploy a new record set while minimizing the downtime because the
   * new record set will be created immediately after the existing one is deleted. It
   * also avoids "manual" actions to delete existing record sets.
   *
   * > **N.B.:** this feature is dangerous, use with caution! It can only be used safely when
   * > `deleteExisting` is set to `true` as soon as the resource is added to the stack. Changing
   * > an existing Record Set's `deleteExisting` property from `false -> true` after deployment
   * > will delete the record!
   *
   * @default false
   */
  readonly deleteExisting?: boolean;

  /**
   * Among resource record sets that have the same combination of DNS name and type,
   * a value that determines the proportion of DNS queries that Amazon Route 53 responds to using the current resource record set.
   *
   * Route 53 calculates the sum of the weights for the resource record sets that have the same combination of DNS name and type.
   * Route 53 then responds to queries based on the ratio of a resource's weight to the total.
   *
   * This value can be a number between 0 and 255.
   *
   * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-weighted.html
   *
   * @default - Do not set weighted routing
   */
  readonly weight?: number;

  /**
   * The Amazon EC2 Region where you created the resource that this resource record set refers to.
   * The resource typically is an AWS resource, such as an EC2 instance or an ELB load balancer,
   * and is referred to by an IP address or a DNS domain name, depending on the record type.
   *
   * When Amazon Route 53 receives a DNS query for a domain name and type for which you have created latency resource record sets,
   * Route 53 selects the latency resource record set that has the lowest latency between the end user and the associated Amazon EC2 Region.
   * Route 53 then returns the value that is associated with the selected resource record set.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-recordset.html#cfn-route53-recordset-region
   *
   * @default - Do not set latency based routing
   */
  readonly region?: string;

  /**
   * Whether to return multiple values, such as IP addresses for your web servers, in response to DNS queries.
   *
   * @default false
   */
  readonly multiValueAnswer?: boolean;

  /**
   * A string used to distinguish between different records with the same combination of DNS name and type.
   * It can only be set when either weight or geoLocation is defined.
   *
   * This parameter must be between 1 and 128 characters in length.
   *
   * @default - Auto generated string
   */
  readonly setIdentifier?: string;

  /**
   * The health check to associate with the record set.
   *
   * Route53 will return this record set in response to DNS queries only if the health check is passing.
   *
   * @default - No health check configured
   */
  readonly healthCheck?: IHealthCheck;

  /**
   * The object that is specified in resource record set object when you are linking a resource record set to a CIDR location.
   *
   * A LocationName with an asterisk “*” can be used to create a default CIDR record. CollectionId is still required for default record.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-recordset.html#cfn-route53-recordset-cidrroutingconfig
   * @default - No CIDR routing configured
   */
  readonly cidrRoutingConfig?: CidrRoutingConfig;
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
@propertyInjectable
export class RecordSet extends Resource implements IRecordSet {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-route53.RecordSet';
  public readonly domainName: string;
  private readonly geoLocation?: GeoLocation;
  private readonly weight?: number;
  private readonly region?: string;
  private readonly multiValueAnswer?: boolean;

  constructor(scope: Construct, id: string, props: RecordSetProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.weight && !Token.isUnresolved(props.weight) && (props.weight < 0 || props.weight > 255)) {
      throw new ValidationError(`weight must be between 0 and 255 inclusive, got: ${props.weight}`, this);
    }
    if (props.setIdentifier && (props.setIdentifier.length < 1 || props.setIdentifier.length > 128)) {
      throw new ValidationError(`setIdentifier must be between 1 and 128 characters long, got: ${props.setIdentifier.length}`, this);
    }
    if (props.setIdentifier && props.weight === undefined && !props.geoLocation && !props.region && !props.multiValueAnswer
      && !props.cidrRoutingConfig) {
      throw new ValidationError('setIdentifier can only be specified for non-simple routing policies', this);
    }
    if (props.multiValueAnswer && props.target.aliasTarget) {
      throw new ValidationError('multiValueAnswer cannot be specified for alias record', this);
    }

    const nonSimpleRoutingPolicies = [
      props.geoLocation,
      props.region,
      props.weight,
      props.multiValueAnswer,
      props.cidrRoutingConfig,
    ].filter((variable) => variable !== undefined).length;
    if (nonSimpleRoutingPolicies > 1) {
      throw new ValidationError('Only one of region, weight, multiValueAnswer, geoLocation or cidrRoutingConfig can be defined', this);
    }

    this.geoLocation = props.geoLocation;
    this.weight = props.weight;
    this.region = props.region;
    this.multiValueAnswer = props.multiValueAnswer;

    const ttl = props.target.aliasTarget ? undefined : ((props.ttl && props.ttl.toSeconds()) ?? 1800).toString();
    if (props.target.aliasTarget && props.ttl != undefined) {
      Annotations.of(this).addWarningV2('aws-cdk-lib/aws-route53:ttlIgnored', 'Ignoring ttl since \'target\' uses an alias target');
    }

    const recordName = determineFullyQualifiedDomainName(props.recordName || props.zone.zoneName, props.zone);

    const recordSet = new CfnRecordSet(this, 'Resource', {
      hostedZoneId: props.zone.hostedZoneId,
      name: recordName,
      type: props.recordType,
      resourceRecords: props.target.values,
      aliasTarget: props.target.aliasTarget && props.target.aliasTarget.bind(this, props.zone),
      ttl,
      comment: props.comment,
      geoLocation: props.geoLocation ? {
        continentCode: props.geoLocation.continentCode,
        countryCode: props.geoLocation.countryCode,
        subdivisionCode: props.geoLocation.subdivisionCode,
      } : undefined,
      multiValueAnswer: props.multiValueAnswer,
      setIdentifier: props.setIdentifier ?? this.configureSetIdentifier(),
      weight: props.weight,
      region: props.region,
      healthCheckId: props.healthCheck?.healthCheckId,
      cidrRoutingConfig: props.cidrRoutingConfig,
    });

    this.domainName = recordSet.ref;

    if (props.deleteExisting) {
      // Delete existing record before creating the new one
      const provider = DeleteExistingRecordSetProvider.getOrCreateProvider(this, DELETE_EXISTING_RECORD_SET_RESOURCE_TYPE, {
        policyStatements: [{ // IAM permissions for all providers
          Effect: 'Allow',
          Action: 'route53:GetChange',
          Resource: '*',
        }],
      });
      // Add to the singleton policy for this specific provider
      provider.addToRolePolicy({
        Effect: 'Allow',
        Action: 'route53:ListResourceRecordSets',
        Resource: props.zone.hostedZoneArn,
      });
      provider.addToRolePolicy({
        Effect: 'Allow',
        Action: 'route53:ChangeResourceRecordSets',
        Resource: props.zone.hostedZoneArn,
        Condition: {
          'ForAllValues:StringEquals': {
            'route53:ChangeResourceRecordSetsRecordTypes': [props.recordType],
            'route53:ChangeResourceRecordSetsActions': ['DELETE'],
          },
        },
      });

      const customResource = new CustomResource(this, 'DeleteExistingRecordSetCustomResource', {
        resourceType: DELETE_EXISTING_RECORD_SET_RESOURCE_TYPE,
        serviceToken: provider.serviceToken,
        properties: {
          HostedZoneId: props.zone.hostedZoneId,
          RecordName: recordName,
          RecordType: props.recordType,
        },
      });

      recordSet.node.addDependency(customResource);
    }
  }

  private configureSetIdentifier(): string | undefined {
    if (this.geoLocation) {
      let identifier = 'GEO';
      if (this.geoLocation.continentCode) {
        identifier = identifier.concat('_CONTINENT_', this.geoLocation.continentCode);
      }
      if (this.geoLocation.countryCode) {
        identifier = identifier.concat('_COUNTRY_', this.geoLocation.countryCode);
      }
      if (this.geoLocation.subdivisionCode) {
        identifier = identifier.concat('_SUBDIVISION_', this.geoLocation.subdivisionCode);
      }
      return identifier;
    }

    if (this.weight !== undefined) {
      if (Token.isUnresolved(this.weight)) {
        const replacement = 'XXX'; // XXX simply because 255 is the highest value for a record weight
        const idPrefix = `WEIGHT_${replacement}_ID_`;
        const idTemplate = this.createIdentifier(idPrefix);
        return idTemplate.replace(replacement, Token.asString(this.weight));
      } else {
        const idPrefix = `WEIGHT_${this.weight}_ID_`;
        return this.createIdentifier(idPrefix);
      }
    }

    if (this.region) {
      const idPrefix= `REGION_${this.region}_ID_`;
      return this.createIdentifier(idPrefix);
    }

    if (this.multiValueAnswer) {
      const idPrefix = 'MVA_ID_';
      return this.createIdentifier(idPrefix);
    }

    return undefined;
  }

  private createIdentifier(prefix: string): string {
    return `${prefix}${Names.uniqueResourceName(this, { maxLength: 64 - prefix.length })}`;
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
 * Construction properties to import existing ARecord as target.
 */
export interface ARecordAttrs extends RecordSetOptions{
  /**
   * Existing A record DNS name to set RecordTarget
   */
  readonly targetDNS: string;
}

/**
 * A DNS A record
 *
 * @resource AWS::Route53::RecordSet
 */
@propertyInjectable
export class ARecord extends RecordSet {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-route53.ARecord';

  /**
   * Creates new A record of type alias with target set to an existing A Record DNS.
   * Use when the target A record is created outside of CDK
   * For records created as part of CDK use @aws-cdk-lib/aws-route53-targets/route53-record.ts
   * @param scope the parent Construct for this Construct
   * @param id Logical Id of the resource
   * @param attrs the ARecordAttributes (Target Arecord DNS name and HostedZone)
   * @returns AWS::Route53::RecordSet of type A with target alias set to existing A record
   */
  public static fromARecordAttributes(scope: Construct, id: string, attrs: ARecordAttrs): ARecord {
    const aliasTarget = RecordTarget.fromAlias(new ARecordAsAliasTarget(attrs));
    return new ARecord(scope, id, {
      ...attrs,
      target: aliasTarget,
    });
  }

  constructor(scope: Construct, id: string, props: ARecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.A,
      target: props.target,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
  }
}

/**
 * Converts the type of a given ARecord DNS name, created outside CDK, to an AliasRecordTarget
 */
class ARecordAsAliasTarget implements IAliasRecordTarget {
  constructor(private readonly aRrecordAttrs: ARecordAttrs) {
  }

  public bind(record: IRecordSet, zone?: IHostedZone | undefined): AliasRecordTargetConfig {
    if (!zone) {
      throw new ValidationError('Cannot bind to record without a zone', record);
    }
    return {
      dnsName: this.aRrecordAttrs.targetDNS,
      hostedZoneId: this.aRrecordAttrs.zone.hostedZoneId,
    };
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
@propertyInjectable
export class AaaaRecord extends RecordSet {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-route53.AaaaRecord';

  constructor(scope: Construct, id: string, props: AaaaRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.AAAA,
      target: props.target,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
  }
}

/**
 * Construction properties for a CnameRecord.
 */
export interface CnameRecordProps extends RecordSetOptions {
  /**
   * The domain name of the target that this record should point to.
   */
  readonly domainName: string;
}

/**
 * A DNS CNAME record
 *
 * @resource AWS::Route53::RecordSet
 */
@propertyInjectable
export class CnameRecord extends RecordSet {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-route53.CnameRecord';

  constructor(scope: Construct, id: string, props: CnameRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.CNAME,
      target: RecordTarget.fromValues(props.domainName),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
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
@propertyInjectable
export class TxtRecord extends RecordSet {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-route53.TxtRecord';

  constructor(scope: Construct, id: string, props: TxtRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.TXT,
      target: RecordTarget.fromValues(...props.values.map(v => formatTxt(v))),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
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
@propertyInjectable
export class SrvRecord extends RecordSet {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-route53.SrvRecord';

  constructor(scope: Construct, id: string, props: SrvRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.SRV,
      target: RecordTarget.fromValues(...props.values.map(v => `${v.priority} ${v.weight} ${v.port} ${v.hostName}`)),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
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
@propertyInjectable
export class CaaRecord extends RecordSet {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-route53.CaaRecord';

  constructor(scope: Construct, id: string, props: CaaRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.CAA,
      target: RecordTarget.fromValues(...props.values.map(v => `${v.flag} ${v.tag} "${v.value}"`)),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
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
@propertyInjectable
export class CaaAmazonRecord extends CaaRecord {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-route53.CaaAmazonRecord';

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
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
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
@propertyInjectable
export class MxRecord extends RecordSet {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-route53.MxRecord';

  constructor(scope: Construct, id: string, props: MxRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.MX,
      target: RecordTarget.fromValues(...props.values.map(v => `${v.priority} ${v.hostName}`)),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
  }
}

/**
 * Construction properties for a NSRecord.
 */
export interface NsRecordProps extends RecordSetOptions {
  /**
   * The NS values.
   */
  readonly values: string[];
}

/**
 * A DNS NS record
 *
 * @resource AWS::Route53::RecordSet
 */
@propertyInjectable
export class NsRecord extends RecordSet {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-route53.NsRecord';

  constructor(scope: Construct, id: string, props: NsRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.NS,
      target: RecordTarget.fromValues(...props.values),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
  }
}

/**
 * Construction properties for a DSRecord.
 */
export interface DsRecordProps extends RecordSetOptions {
  /**
   * The DS values.
   */
  readonly values: string[];
}

/**
 * A DNS DS record
 *
 * @resource AWS::Route53::RecordSet
 */
@propertyInjectable
export class DsRecord extends RecordSet {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-route53.DsRecord';

  constructor(scope: Construct, id: string, props: DsRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.DS,
      target: RecordTarget.fromValues(...props.values),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
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
@propertyInjectable
export class ZoneDelegationRecord extends RecordSet {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-route53.ZoneDelegationRecord';

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
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
  }
}

/**
 * Construction properties for a CrossAccountZoneDelegationRecord
 */
export interface CrossAccountZoneDelegationRecordProps {
  /**
   * The zone to be delegated
   */
  readonly delegatedZone: IHostedZone;

  /**
   * The hosted zone name in the parent account
   *
   * @default - no zone name
   */
  readonly parentHostedZoneName?: string;

  /**
   * The hosted zone id in the parent account
   *
   * @default - no zone id
   */
  readonly parentHostedZoneId?: string;

  /**
   * The delegation role in the parent account
   */
  readonly delegationRole: iam.IRole;

  /**
   * The resource record cache time to live (TTL).
   *
   * @default Duration.days(2)
   */
  readonly ttl?: Duration;

  /**
   * The removal policy to apply to the record set.
   *
   * @default RemovalPolicy.DESTROY
   */
  readonly removalPolicy?: RemovalPolicy;

  /**
   * Region from which to obtain temporary credentials.
   *
   * @default - the Route53 signing region in the current partition
   */
  readonly assumeRoleRegion?: string;
}

/**
 * A Cross Account Zone Delegation record. This construct uses custom resource lambda that calls Route53
 * ChangeResourceRecordSets API to upsert a NS record into the `parentHostedZone`.
 *
 * WARNING: The default removal policy of this resource is DESTROY, therefore, if this resource's logical ID changes or
 * if this resource is removed from the stack, the existing NS record will be removed.
 */
export class CrossAccountZoneDelegationRecord extends Construct {
  constructor(scope: Construct, id: string, props: CrossAccountZoneDelegationRecordProps) {
    super(scope, id);

    if (!props.parentHostedZoneName && !props.parentHostedZoneId) {
      throw Error('At least one of parentHostedZoneName or parentHostedZoneId is required');
    }

    if (props.parentHostedZoneName && props.parentHostedZoneId) {
      throw Error('Only one of parentHostedZoneName and parentHostedZoneId is supported');
    }

    const provider = CrossAccountZoneDelegationProvider.getOrCreateProvider(this, CROSS_ACCOUNT_ZONE_DELEGATION_RESOURCE_TYPE);

    const role = iam.Role.fromRoleArn(this, 'cross-account-zone-delegation-handler-role', provider.roleArn);

    const addToPrinciplePolicyResult = role.addToPrincipalPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sts:AssumeRole'],
      resources: [props.delegationRole.roleArn],
    }));

    const customResource = new CustomResource(this, 'CrossAccountZoneDelegationCustomResource', {
      resourceType: CROSS_ACCOUNT_ZONE_DELEGATION_RESOURCE_TYPE,
      serviceToken: provider.serviceToken,
      removalPolicy: props.removalPolicy,
      properties: {
        AssumeRoleArn: props.delegationRole.roleArn,
        ParentZoneName: props.parentHostedZoneName,
        ParentZoneId: props.parentHostedZoneId,
        DelegatedZoneName: props.delegatedZone.zoneName,
        DelegatedZoneNameServers: props.delegatedZone.hostedZoneNameServers!,
        TTL: (props.ttl || Duration.days(2)).toSeconds(),
        AssumeRoleRegion: props.assumeRoleRegion,
      },
    });

    if (addToPrinciplePolicyResult.policyDependable) {
      customResource.node.addDependency(addToPrinciplePolicyResult.policyDependable);
    }
  }
}
