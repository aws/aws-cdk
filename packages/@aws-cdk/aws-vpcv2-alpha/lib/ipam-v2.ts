import { CfnIPAM, CfnIPAMPool, CfnIPAMPoolCidr, CfnIPAMScope } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { Lazy, Names, Resource, Stack } from 'aws-cdk-lib';

/**
 * Represents the address family for IP addresses in an IPAM pool.
 *
 * @enum {string}
 * @property {string} IP_V4 - Represents the IPv4 address family.
 * @property {string} IP_V6 - Represents the IPv6 address family.
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipampool.html#cfn-ec2-ipampool-addressfamily
 */
export enum AddressFamily {
  /**
   * Represents the IPv4 address family.
   * Allowed under public and private pool.
   */
  IP_V4 = 'ipv4',

  /**
   * Represents the IPv6 address family.
   * Only allowed under public pool.
   */
  IP_V6 = 'ipv6',
}

/**
 * The IP address source for pools in the public scope.
 * Only used for provisioning IP address CIDRs to pools in the public scope.
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipampool.html#cfn-ec2-ipampool-publicipsource
 */
export enum IpamPoolPublicIpSource {
  /**
   * BYOIP Ipv6 to be registered under IPAM
   */
  BYOIP = 'byoip',

  /**
   * Amazon Provided Ipv6 range
   */
  AMAZON = 'amazon',
}

/**
 * Limits which service in AWS that the pool can be used in
 */
export enum AwsServiceName {
  /**
   *  Allows users to use space for Elastic IP addresses and VPCs
   */
  EC2 = 'ec2',
}

/**
 * Interface to give access to the custom scope
 */
export interface IIpamScope {
  readonly ipamScopeId: string;
}

/**
 * Options to create a new Ipam in the class
 */
export interface IpamProps{

  /**
   * The operating Regions for an IPAM.
   * Operating Regions are AWS Regions where the IPAM is allowed to manage IP address CIDRs
   * For more information about operating Regions, see [Create an IPAM](https://docs.aws.amazon.com//vpc/latest/ipam/create-ipam.html) in the *Amazon VPC IPAM User Guide* .
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipam.html#cfn-ec2-ipam-operatingregions
   * @default Stack.region if defined else []
   */
  readonly operatingRegion?: string[];
}

/**
 * Interface to give access to the Ipv6 cidr created
//  */
// export interface IIpamPoolCidr extends Resource{
//   readonly cidrPool?: CfnIPAMPoolCidr;

// }

/**
 * Options for configuring an IPAM pool.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipampool.html
 *
 * @interface PoolOptions
 * @property {AddressFamily} addressFamily - The address family of the pool (ipv4 or ipv6).
 * @property {CfnIPAMPool.ProvisionedCidrProperty[]} [provisionedCidrs] - Information about the CIDRs provisioned to the pool.
 * @property {string} [locale] - The locale (AWS Region) of the pool.
 * @property {IpamPoolPublicIpSource} [publicIpSource] - The IP address source for pools in the public scope.
 * @property {string} [awsService] - Limits which AWS service can use the pool.
 */
export interface PoolOptions{

  /**
   * addressFamily - The address family of the pool (ipv4 or ipv6).
   */
  readonly addressFamily: AddressFamily;

  /**
   * [provisionedCidrs] - Information about the CIDRs provisioned to the pool.
   * @default - No CIDRs are provisioned
   * @see CfnIPAMPool.ProvisionedCidrProperty
   */
  readonly provisionedCidrs?: string[];

  /**
   * The locale (AWS Region) of the pool. Should be one of the IPAM operating region.
   *  Only resources in the same Region as the locale of the pool can get IP address allocations from the pool.
   * You can only allocate a CIDR for a VPC, for example, from an IPAM pool that shares a locale with the VPC’s Region.
   * Note that once you choose a Locale for a pool, you cannot modify it. If you choose an AWS Region for locale that has not been configured as an operating Region for the IPAM, you'll get an error.
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipampool.html#cfn-ec2-ipampool-locale
   * @default - Current operating region
   */
  readonly locale?: string;

  /**
   * [publicIpSource] - The IP address source for pools in the public scope.
   * Only used for IPv6 address
   * Only allowed values to this are 'byoip' or 'amazon'
   * @default amazon
   */
  readonly publicIpSource?: IpamPoolPublicIpSource;

  /**
  * Limits which service in AWS that the pool can be used in.
  *
  * "ec2", for example, allows users to use space for Elastic IP addresses and VPCs.
  *
  * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipampool.html#cfn-ec2-ipampool-awsservice
  *
  * @default - No service
  */
  readonly awsService?: AwsServiceName;
}

/**
 * Properties for creating an IPAM pool.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipampool.html
 *
 * @interface IpamPoolProps
 * @extends {PoolOptions}
 * @property {string} ipamScopeId - The ID of the IPAM scope.
 */
export interface IpamPoolProps extends PoolOptions {
  /**
   * Scope id where pool needs to be created
   */
  readonly ipamScopeId: string;

  /**
   * IPAM resource name
   * @default autogenerated by CDK
   */
  readonly ipamPoolName?: string;

}

/**
 * IPAM scope is the highest-level container within IPAM. An IPAM contains two default scopes.
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipamscope.html
 * @property {ipamId}
 */
export interface IpamScopeProps {
  /**
   * IPAM id to which scope needs to be added
   */
  readonly ipamId: string;

  /**
   * Operating region for the Ipam
   */
  readonly ipamRegion: string[];

  /**
   * IPAM scope name
   * @default none
   */
  readonly ipamScopeName?: string;

}

/**
 * Options for configuring an IP Address Manager (IPAM).
 *
 * For more information, see the {@link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipam.html}.
 */
export interface IpamOptions {

  /**
   * CIDR Mask for Vpc
   * Only required when using AWS Ipam
   *
   * @default - None
   */
  readonly netmaskLength?: number;

  /**
   * Ipv4 IPAM pool
   * Only required when using AWS Ipam
   *
   * @default - None
   */
  readonly ipamPool?: IpamPool;
}

/**
 * Options to provisioned CIDRs to an IPAM pool.
 * Used to create a new IpamPoolCidr
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipampoolcidr.html
 */
export interface IpamPoolCidrProvisioningOptions {
  /**
   * Ipv6 Netmask length for the CIDR
   * @default none
   */
  readonly netmaskLength?: number;

  /**
   * Ipv6 CIDR block for the IPAM pool
   * @default none
   */
  readonly cidr?: string;
}

/**
 * Creates new IPAM Pool
 * Pools enable you to organize your IP addresses according to your routing and security needs
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipampool.html
 * @resource AWS::EC2::IPAMPool
 */
export class IpamPool extends Resource {

  /**
   * Pool ID to be passed to the VPC construct
   * @attribute IpamPoolId
   */
  public readonly ipamPoolId: string;

  /**
   * Pool CIDR for IPv6 to be provisioned with Public IP source set to 'Amazon'
   */
  public readonly ipamCidrs: IpamPoolCidr[] = []

  /**
   * Provisioned CIDRs provided by the user
   * @internal
   */
  protected readonly _ipamPool: CfnIPAMPool;

  constructor(scope: Construct, id: string, props: IpamPoolProps) {
    super(scope, id, {
      physicalName: props.ipamPoolName ?? Lazy.string({
        produce: () => Names.uniqueResourceName(this, { maxLength: 128, allowedSpecialCharacters: '_' }),
      }),
    });

    if (props.addressFamily === AddressFamily.IP_V6 && !props.awsService) {
      throw new Error('awsService is required when addressFamily is set to ipv6');
    }

    this._ipamPool = new CfnIPAMPool(this, id, {
      addressFamily: props.addressFamily,
      provisionedCidrs: props.provisionedCidrs?.map(cidr => ({ cidr })),
      locale: props.locale,
      ipamScopeId: props.ipamScopeId,
      publicIpSource: props.publicIpSource,
      awsService: props.awsService,
    });
    this.ipamPoolId = this._ipamPool.attrIpamPoolId;
  }

  /**
   * A CIDR provisioned to an IPAM pool.
   * @param id Name of Resource
   * @param options Either a CIDR or netmask length must be provided
   * @returns AWS::EC2::IPAMPoolCidr
   */
  public provisionCidr(id: string, options: IpamPoolCidrProvisioningOptions): IpamPoolCidr {
    const cidr = new IpamPoolCidr(this, id, {
      ipamPoolCidrName: id,
      ...options,
      ipamPoolId: this.ipamPoolId,
    });
    this.ipamCidrs.push(cidr);
    return cidr;
  }
}

/**
 * Properties for defining a CIDR range within an IPAM pool.
 *
 * @extends IpamPoolCidrProvisioningOptions - Base options for provisioning a CIDR range.
 *
 * @property {string} ipamPoolId - The ID of the IPAM pool where the CIDR range will be provisioned.
 */
export interface IpamPoolCidrProps extends IpamPoolCidrProvisioningOptions {
  /**
   * Ipam Pool ID to add provisioned CIDR
   */
  readonly ipamPoolId: string;

  /**
   * IPAM pool id resource Physical name
   */
  readonly ipamPoolCidrName: string;
}

/**
 * Creates new IPAM Pool Cidr for IPV6
 * Required to assoicate IP address for Public IP source set to Amazon Owned IPv6 Address
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipampoolcidr.html
 * @resource AWS::EC2::IPAMPoolCidr
 */
export class IpamPoolCidr extends Resource {

  public readonly cidrPool?: CfnIPAMPoolCidr;

  constructor(scope: Construct, id: string, props: IpamPoolCidrProps) {
    super(scope, id, {
      physicalName: props.ipamPoolCidrName ?? Lazy.string({
        produce: () => Names.uniqueResourceName(this, { maxLength: 128, allowedSpecialCharacters: '_' }),
      }),
    });
    const cidrPool = new CfnIPAMPoolCidr(this, 'PoolCidr', {
      netmaskLength: props.netmaskLength,
      ipamPoolId: props.ipamPoolId,
      cidr: props.cidr,
    });
    this.node.defaultChild = cidrPool,
    this.cidrPool = cidrPool;
  }
}

/**
 * Creates custom Ipam Scope, can only be private
 * (can be used for adding custom scopes to an existing IPAM)
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipamscope.html
 * @resource AWS::EC2::IPAMScope
 */
export class IpamScope extends Resource {

  private readonly _ipamScope: CfnIPAMScope;

  /**
   * ID for Resource IpamScope
   * @attribute IpamScopeId
   */
  public readonly ipamScopeId: string;

  protected readonly props?: IpamScopeProps;

  public readonly scope: Construct;

  constructor(scope: Construct, id: string, props: IpamScopeProps) {
    super(scope, id);
    this._ipamScope = new CfnIPAMScope(scope, 'IpamScope', {
      ipamId: props.ipamId,
    });
    this.ipamScopeId = this._ipamScope.attrIpamScopeId;
    this.scope = scope;
  }

  addPool(id: string, options: PoolOptions): IpamPool {

    const isLocaleInOperatingRegions = this.props?.ipamRegion ? this.props.ipamRegion.map
    (region => ({ regionName: region })).some(region => region.regionName === options.locale): false;

    if (!isLocaleInOperatingRegions) {
      // Handle the case where options.locale is not in operatingRegions
      // For example, you could throw an error or provide a default value
      throw new Error(`The provided locale '${options.locale}' is not in the operating regions.`);
    }

    const pool = new IpamPool(this.scope, id, {
      ipamPoolName: id,
      addressFamily: options.addressFamily,
      provisionedCidrs: options.provisionedCidrs,
      ipamScopeId: this.ipamScopeId,
      locale: options.locale,
      publicIpSource: options.publicIpSource,
      awsService: options.awsService,
    });

    return pool;
  }
}

/**
 * Interface for IpamScope Class
 */
export interface IIpamScopeBase{
  readonly scope: Construct;
  readonly scopeId: string;
  readonly props?: IpamScopeProps;
  addPool(id: string, options: PoolOptions): IpamPool;

}

/**
 * Base class for IPAM scopes.
 */
// class IpamScopeBase implements IIpamScopeBase {
//   constructor(
//     readonly scope: Construct,
//     readonly scopeId: string,
//     readonly props?: IpamScopeProps,
//   ) {}

//   /**
//    * Adds a pool to the IPAM scope.
//    */
//   addPool(id: string, options: PoolOptions): IpamPool {

//     const isLocaleInOperatingRegions = this.props?.ipamRegion ? this.props.ipamRegion.map
//     (region => ({ regionName: region })).some(region => region.regionName === options.locale): false;

//     if (!isLocaleInOperatingRegions) {
//       // Handle the case where options.locale is not in operatingRegions
//       // For example, you could throw an error or provide a default value
//       throw new Error(`The provided locale '${options.locale}' is not in the operating regions.`);
//     }

//     if (options.locale ) {

//     };
//     const pool = new IpamPool(this.scope, id, {
//       ipamPoolName: id,
//       addressFamily: options.addressFamily,
//       provisionedCidrs: options.provisionedCidrs,
//       ipamScopeId: this.scopeId,
//       locale: options.locale,
//       publicIpSource: options.publicIpSource,
//       awsService: options.awsService,
//     });

//     return pool;
//   }
// }

/**
 * Provides access to default public IPAM scope through add pool method.
 * Usage: To add an Ipam Pool to a default public scope
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipamscope.html
 */
// export class IpamPublicScope extends IpamScopeBase {
//   constructor(scope: Construct, id: string, props?: IpamScopeProps) {
//     super(scope, id, props);
//   }
// }

// /**
//  * Provides access to default private IPAM scope through add pool method.
//  * Usage: To add an Ipam Pool to a default private scope
//  * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipamscope.html
//  */
// export class IpamPrivateScope extends IpamScopeBase {
//   constructor(scope: Construct, id: string, props?: IpamScopeProps) {
//     super(scope, id, props);
//   }
// }

/**
 * Creates new IPAM with default public and private scope
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipamscope.html
 * @resource AWS::EC2::IPAM
 */
export class Ipam extends Resource {
  /**
   * Refers to default public scope
   */
  public readonly publicScope: IpamScope;
  /**
   * Refers to default public scope
   */
  public readonly privateScope: IpamScope;
  // Resource IPAM
  private readonly _ipam: CfnIPAM;
  /**
   * Access to Ipam resource id that can be used later to add a custom private scope to this IPAM
   * @attribute IpamId
   */
  public readonly ipamId: string;

  /**
   * List of operating regions for IPAM
   */
  public readonly operatingRegions: string[];

  constructor(scope: Construct, id: string, props: IpamProps) {
    super(scope, id);

    this.operatingRegions = props.operatingRegion ?? [Stack.of(this).region];

    this._ipam = new CfnIPAM(this, 'Ipam', {
      operatingRegions: this.operatingRegions ? this.operatingRegions.map(region => ({ regionName: region })) : [],
    });
    this.ipamId = this._ipam.attrIpamId;
    this.publicScope = new IpamScope(this, this._ipam.attrPublicDefaultScopeId, {
      ipamRegion: this.operatingRegions,
      ipamId: this._ipam.attrIpamId,
    });
    this.privateScope = new IpamScope(this, this._ipam.attrPublicDefaultScopeId, {
      ipamRegion: this.operatingRegions,
      ipamId: this._ipam.attrIpamId,
    });

  }

  /**
   * Function to add custom scope to an existing IPAM
   * Custom scopes can only be private
   */
  public addScope(scope: Construct, id: string, options: IpamScopeProps): IIpamScope {
    return new IpamScope(scope, id, {
      ...options,
      ipamId: this.ipamId,
    });
  }
}
