import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { Duration, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { HostedZoneProviderProps } from './hosted-zone-provider';
import { HostedZoneAttributes, IHostedZone, PublicHostedZoneAttributes } from './hosted-zone-ref';
import { CfnHostedZone } from './route53.generated';
/**
 * Common properties to create a Route 53 hosted zone
 */
export interface CommonHostedZoneProps {
    /**
     * The name of the domain. For resource record types that include a domain
     * name, specify a fully qualified domain name.
     */
    readonly zoneName: string;
    /**
     * Any comments that you want to include about the hosted zone.
     *
     * @default none
     */
    readonly comment?: string;
    /**
     * The Amazon Resource Name (ARN) for the log group that you want Amazon Route 53 to send query logs to.
     *
     * @default disabled
     */
    readonly queryLogsLogGroupArn?: string;
}
/**
 * Properties of a new hosted zone
 */
export interface HostedZoneProps extends CommonHostedZoneProps {
    /**
     * A VPC that you want to associate with this hosted zone. When you specify
     * this property, a private hosted zone will be created.
     *
     * You can associate additional VPCs to this private zone using `addVpc(vpc)`.
     *
     * @default public (no VPCs associated)
     */
    readonly vpcs?: ec2.IVpc[];
}
/**
 * Container for records, and records contain information about how to route traffic for a
 * specific domain, such as example.com and its subdomains (acme.example.com, zenith.example.com)
 */
export declare class HostedZone extends Resource implements IHostedZone {
    get hostedZoneArn(): string;
    /**
     * Import a Route 53 hosted zone defined either outside the CDK, or in a different CDK stack
     *
     * Use when hosted zone ID is known. If a HostedZone is imported with this method the zoneName cannot be referenced.
     * If the zoneName is needed then the HostedZone should be imported with `fromHostedZoneAttributes()` or `fromLookup()`
     *
     * @param scope the parent Construct for this Construct
     * @param id  the logical name of this Construct
     * @param hostedZoneId the ID of the hosted zone to import
     */
    static fromHostedZoneId(scope: Construct, id: string, hostedZoneId: string): IHostedZone;
    /**
     * Imports a hosted zone from another stack.
     *
     * Use when both hosted zone ID and hosted zone name are known.
     *
     * @param scope the parent Construct for this Construct
     * @param id  the logical name of this Construct
     * @param attrs the HostedZoneAttributes (hosted zone ID and hosted zone name)
     */
    static fromHostedZoneAttributes(scope: Construct, id: string, attrs: HostedZoneAttributes): IHostedZone;
    /**
     * Lookup a hosted zone in the current account/region based on query parameters.
     * Requires environment, you must specify env for the stack.
     *
     * Use to easily query hosted zones.
     *
     * @see https://docs.aws.amazon.com/cdk/latest/guide/environments.html
     */
    static fromLookup(scope: Construct, id: string, query: HostedZoneProviderProps): IHostedZone;
    readonly hostedZoneId: string;
    readonly zoneName: string;
    readonly hostedZoneNameServers?: string[];
    /**
     * VPCs to which this hosted zone will be added
     */
    protected readonly vpcs: CfnHostedZone.VPCProperty[];
    constructor(scope: Construct, id: string, props: HostedZoneProps);
    /**
     * Add another VPC to this private hosted zone.
     *
     * @param vpc the other VPC to add.
     */
    addVpc(vpc: ec2.IVpc): void;
}
/**
 * Construction properties for a PublicHostedZone.
 */
export interface PublicHostedZoneProps extends CommonHostedZoneProps {
    /**
     * Whether to create a CAA record to restrict certificate authorities allowed
     * to issue certificates for this domain to Amazon only.
     *
     * @default false
     */
    readonly caaAmazon?: boolean;
    /**
     * A principal which is trusted to assume a role for zone delegation
     *
     * If supplied, this will create a Role in the same account as the Hosted
     * Zone, which can be assumed by the `CrossAccountZoneDelegationRecord` to
     * create a delegation record to a zone in a different account.
     *
     * Be sure to indicate the account(s) that you trust to create delegation
     * records, using either `iam.AccountPrincipal` or `iam.OrganizationPrincipal`.
     *
     * If you are planning to use `iam.ServicePrincipal`s here, be sure to include
     * region-specific service principals for every opt-in region you are going to
     * be delegating to; or don't use this feature and create separate roles
     * with appropriate permissions for every opt-in region instead.
     *
     * @default - No delegation configuration
     * @deprecated Create the Role yourself and call `hostedZone.grantDelegation()`.
     */
    readonly crossAccountZoneDelegationPrincipal?: iam.IPrincipal;
    /**
     * The name of the role created for cross account delegation
     *
     * @default - A role name is generated automatically
     * @deprecated Create the Role yourself and call `hostedZone.grantDelegation()`.
     */
    readonly crossAccountZoneDelegationRoleName?: string;
}
/**
 * Represents a Route 53 public hosted zone
 */
export interface IPublicHostedZone extends IHostedZone {
}
/**
 * Create a Route53 public hosted zone.
 *
 * @resource AWS::Route53::HostedZone
 */
export declare class PublicHostedZone extends HostedZone implements IPublicHostedZone {
    /**
     * Import a Route 53 public hosted zone defined either outside the CDK, or in a different CDK stack
     *
     * Use when hosted zone ID is known. If a PublicHostedZone is imported with this method the zoneName cannot be referenced.
     * If the zoneName is needed then the PublicHostedZone should be imported with `fromPublicHostedZoneAttributes()`.
     *
     * @param scope the parent Construct for this Construct
     * @param id the logical name of this Construct
     * @param publicHostedZoneId the ID of the public hosted zone to import
     */
    static fromPublicHostedZoneId(scope: Construct, id: string, publicHostedZoneId: string): IPublicHostedZone;
    /**
     * Imports a public hosted zone from another stack.
     *
     * Use when both hosted zone ID and hosted zone name are known.
     *
     * @param scope the parent Construct for this Construct
     * @param id  the logical name of this Construct
     * @param attrs the PublicHostedZoneAttributes (hosted zone ID and hosted zone name)
     */
    static fromPublicHostedZoneAttributes(scope: Construct, id: string, attrs: PublicHostedZoneAttributes): IPublicHostedZone;
    /**
     * Role for cross account zone delegation
     */
    readonly crossAccountZoneDelegationRole?: iam.Role;
    constructor(scope: Construct, id: string, props: PublicHostedZoneProps);
    addVpc(_vpc: ec2.IVpc): void;
    /**
     * Adds a delegation from this zone to a designated zone.
     *
     * @param delegate the zone being delegated to.
     * @param opts     options for creating the DNS record, if any.
     */
    addDelegation(delegate: IPublicHostedZone, opts?: ZoneDelegationOptions): void;
    /**
     * Grant permissions to add delegation records to this zone
     */
    grantDelegation(grantee: iam.IGrantable): iam.Grant;
}
/**
 * Options available when creating a delegation relationship from one PublicHostedZone to another.
 */
export interface ZoneDelegationOptions {
    /**
     * A comment to add on the DNS record created to incorporate the delegation.
     *
     * @default none
     */
    readonly comment?: string;
    /**
     * The TTL (Time To Live) of the DNS delegation record in DNS caches.
     *
     * @default 172800
     */
    readonly ttl?: Duration;
}
/**
 * Properties to create a Route 53 private hosted zone
 */
export interface PrivateHostedZoneProps extends CommonHostedZoneProps {
    /**
     * A VPC that you want to associate with this hosted zone.
     *
     * Private hosted zones must be associated with at least one VPC. You can
     * associated additional VPCs using `addVpc(vpc)`.
     */
    readonly vpc: ec2.IVpc;
}
/**
 * Represents a Route 53 private hosted zone
 */
export interface IPrivateHostedZone extends IHostedZone {
}
/**
 * Create a Route53 private hosted zone for use in one or more VPCs.
 *
 * Note that `enableDnsHostnames` and `enableDnsSupport` must have been enabled
 * for the VPC you're configuring for private hosted zones.
 *
 * @resource AWS::Route53::HostedZone
 */
export declare class PrivateHostedZone extends HostedZone implements IPrivateHostedZone {
    /**
     * Import a Route 53 private hosted zone defined either outside the CDK, or in a different CDK stack
     *
     * Use when hosted zone ID is known. If a HostedZone is imported with this method the zoneName cannot be referenced.
     * If the zoneName is needed then you cannot import a PrivateHostedZone.
     *
     * @param scope the parent Construct for this Construct
     * @param id the logical name of this Construct
     * @param privateHostedZoneId the ID of the private hosted zone to import
     */
    static fromPrivateHostedZoneId(scope: Construct, id: string, privateHostedZoneId: string): IPrivateHostedZone;
    constructor(scope: Construct, id: string, props: PrivateHostedZoneProps);
}
