import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import { CustomResource, CustomResourceProvider, CustomResourceProviderRuntime, Duration, IResource, RemovalPolicy, Resource, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAliasRecordTarget } from './alias-record-target';
import { IHostedZone } from './hosted-zone-ref';
import { CfnRecordSet } from './route53.generated';
import { determineFullyQualifiedDomainName } from './util';

const CROSS_ACCOUNT_ZONE_DELEGATION_RESOURCE_TYPE = 'Custom::CrossAccountZoneDelegation';
const DELETE_EXISTING_RECORD_SET_RESOURCE_TYPE = 'Custom::DeleteExistingRecordSet';

/**
 * Context key to control whether to use the regional STS endpoint, instead of the global one
 *
 * There is only exactly one use case where you want to turn this on. If:
 *
 * - you are building an AWS service; AND
 * - would like to your own Global Service Principal in the trust policy of the delegation role; AND
 * - the target account is opted in in the same region as well
 *
 * Then you can turn this on. For all other use cases, the global endpoint is preferable:
 *
 * - if you are a regular customer, your trust policy would be in terms of account ids or
 *   organization ids, or ARNs, not Service Principals, so you don't care about this behavior.
 * - if the target account is not opted in as well, the AssumeRole call would fail
 *
 * Because this configuration option is so rare, turn it into a context setting instead
 * of a publicly available prop.
 */
const USE_REGIONAL_STS_ENDPOINT_CONTEXT_KEY = '@aws-cdk/aws-route53:useRegionalStsEndpoint';

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

    const ttl = props.target.aliasTarget ? undefined : ((props.ttl && props.ttl.toSeconds()) ?? 1800).toString();

    const recordName = determineFullyQualifiedDomainName(props.recordName || props.zone.zoneName, props.zone);

    const recordSet = new CfnRecordSet(this, 'Resource', {
      hostedZoneId: props.zone.hostedZoneId,
      name: recordName,
      type: props.recordType,
      resourceRecords: props.target.values,
      aliasTarget: props.target.aliasTarget && props.target.aliasTarget.bind(this, props.zone),
      ttl,
      comment: props.comment,
    });

    this.domainName = recordSet.ref;

    if (props.deleteExisting) {
      // Delete existing record before creating the new one
      const provider = CustomResourceProvider.getOrCreateProvider(this, DELETE_EXISTING_RECORD_SET_RESOURCE_TYPE, {
        codeDirectory: path.join(__dirname, 'delete-existing-record-set-handler'),
        runtime: CustomResourceProviderRuntime.NODEJS_14_X,
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
export class NsRecord extends RecordSet {
  constructor(scope: Construct, id: string, props: NsRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.NS,
      target: RecordTarget.fromValues(...props.values),
    });
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
export class DsRecord extends RecordSet {
  constructor(scope: Construct, id: string, props: DsRecordProps) {
    super(scope, id, {
      ...props,
      recordType: RecordType.DS,
      target: RecordTarget.fromValues(...props.values),
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
}

/**
 * A Cross Account Zone Delegation record
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

    const provider = CustomResourceProvider.getOrCreateProvider(this, CROSS_ACCOUNT_ZONE_DELEGATION_RESOURCE_TYPE, {
      codeDirectory: path.join(__dirname, 'cross-account-zone-delegation-handler'),
      runtime: CustomResourceProviderRuntime.NODEJS_14_X,
    });

    const role = iam.Role.fromRoleArn(this, 'cross-account-zone-delegation-handler-role', provider.roleArn);

    const addToPrinciplePolicyResult = role.addToPrincipalPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sts:AssumeRole'],
      resources: [props.delegationRole.roleArn],
    }));

    const useRegionalStsEndpoint = this.node.tryGetContext(USE_REGIONAL_STS_ENDPOINT_CONTEXT_KEY);

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
        UseRegionalStsEndpoint: useRegionalStsEndpoint ? 'true' : undefined,
      },
    });

    if (addToPrinciplePolicyResult.policyDependable) {
      customResource.node.addDependency(addToPrinciplePolicyResult.policyDependable);
    }
  }
}
