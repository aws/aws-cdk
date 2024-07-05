/* eslint-disable no-bitwise */
import { CfnIPAM, CfnIPAMPool, CfnIPAMPoolCidr, CfnIPAMScope } from 'aws-cdk-lib/aws-ec2';
import { IIpAddresses, VpcCidrOptions } from './vpc-v2';
import { Construct } from 'constructs';
import { CfnResource, Resource, Stack } from 'aws-cdk-lib';

/**
 * Represents the address family for IP addresses in an IPAM pool.
 *
 * @enum {string}
 * @property {string} IP_V4 - Represents the IPv4 address family.
 * @property {string} IP_V6 - Represents the IPv6 address family.
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipampool.html#cfn-ec2-ipampool-addressfamily
 */
export enum AddressFamily {
  IP_V4 = 'ipv4',
  IP_V6 = 'ipv6',
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
  readonly ipamScopeId: string;
}

/**
 * Defining the type for allowed AWS service values under IPAM pool option
 */
type AwsServiceName = 'ec2'

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
   */
  readonly provisionedCidrs?: CfnIPAMPool.ProvisionedCidrProperty[];

  /**
   * [locale] - The locale (AWS Region) of the pool.
   */
  readonly locale?: string;

  /**
   * [publicIpSource] - The IP address source for pools in the public scope.
   */
  readonly publicIpSource?: IpamPoolPublicIpSource;

  /**
  * Limits which service in AWS that the pool can be used in.
  *
  * "ec2", for example, allows users to use space for Elastic IP addresses and VPCs.
  *
  * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipampool.html#cfn-ec2-ipampool-awsservice
  */
  readonly awsService?: AwsServiceName;
}

/**
 * IPAM scope is the highest-level container within IPAM. An IPAM contains two default scopes.
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipamscope.html
 * @property {ipamId}
 */
export interface IpamScopeOptions {
  /**
   * IPAM id to which scope needs to be added
   */
  readonly ipamId: string;
}

export interface IpamOptions {

  /**
   * CIDR Mask for Vpc
   *
   * @default - Only required when using AWS Ipam
   */
  readonly ipv4NetmaskLength?: number;

  /**
   * ipv4 IPAM Pool Id
   *
   * @default - Only required when using AWS Ipam
   */
  readonly ipv4IpamPoolId?: string;

  /**
   * ipv4 IPAM pool
   */
  readonly ipv4IpamPool?: IpamPool;

  /**
   * CIDR Mask for Vpc
   *
   * @default - Only required when using AWS Ipam
   */
  readonly ipv6NetmaskLength?: number;

  /**
   * ipv4 IPAM Pool Id
   *
   * @default - Only required when using AWS Ipam
   */
  readonly ipv6IpamPool?: IpamPool;
}

/**
 * The IP address source for pools in the public scope. 
 * Only used for provisioning IP address CIDRs to pools in the public scope. Default is BYOIP.
 * @default BYOIP
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipampool.html#cfn-ec2-ipampool-publicipsource
 */
export enum IpamPoolPublicIpSource {
  BYOIP = 'byoip',
  AMAZON = 'amazon',
}

/**
 * Options to provisioned CIDRs to an IPAM pool.
 * Used to create a new IpamPoolCidr
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipampoolcidr.html
 */
export interface IpamPoolCidrProvisioningOptions {
  readonly netmaskLength?: number;
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
   */
  public readonly ipamPoolId: string;

  /**
   * Pool CIDR for IPv6 to be provisioned with Public IP source set to 'Amazon'
   */
  public readonly ipamCidrs: IpamPoolCidr[] = []

  constructor(scope: Construct, id: string, props: IpamPoolProps) {
    super(scope, id);
    const cfnPool = new CfnIPAMPool(this, id, {
      addressFamily: props.addressFamily,
      provisionedCidrs: props.provisionedCidrs,
      locale: props.locale,
      ipamScopeId: props.ipamScopeId,
      publicIpSource: props.publicIpSource,
      awsService: props.awsService,
    });
    this.ipamPoolId = cfnPool.attrIpamPoolId;
  }

  public provisionCidr(id: string, options: IpamPoolCidrProvisioningOptions): IpamPoolCidr {
    const cidr = new IpamPoolCidr(this, id, {
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
}

/**
 * Creates new IPAM Pool Cidr for IPV6
 * Required to assoicate IP address for Public IP source set to Amazon Owned IPv6 Address
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipampoolcidr.html
 * @resource AWS::EC2::IPAMPoolCidr
 */
export class IpamPoolCidr extends Resource {

  constructor(scope: Construct, id: string, props: IpamPoolCidrProps) {
    super(scope, id);
    this.node.defaultChild = new CfnIPAMPoolCidr(this, 'PoolCidr', {
      netmaskLength: props.netmaskLength,
      ipamPoolId: props.ipamPoolId,
      cidr: props.cidr,
    });
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
  public readonly ipamScopeId: string;
  constructor(scope: Construct, id: string, props: IpamScopeOptions) {
    super(scope, id);
    this._ipamScope = new CfnIPAMScope(scope, 'IpamScope', {
      ipamId: props.ipamId,
    });
    this.ipamScopeId = this._ipamScope.attrIpamScopeId;
  }
}


/**
 * Base class for IPAM scopes.
 */
abstract class IpamScopeBase {
  protected constructor(
    protected readonly scope: Construct,
    protected readonly scopeId: string
  ) {}

  /**
   * Adds a pool to the IPAM scope.
   */
  addPool(id: string, options: PoolOptions): IpamPool {
    const pool = new IpamPool(this.scope, id, {
      addressFamily: options.addressFamily,
      provisionedCidrs: options.provisionedCidrs,
      ipamScopeId: this.scopeId,
      locale: options.locale ?? Stack.of(this.scope).node.tryGetContext('region'),
      publicIpSource: options.publicIpSource,
      awsService: options.awsService,
    });

    return pool;
  }
}

/**
 * Provides access to default public IPAM scope through add pool method.
 * Usage: To add an Ipam Pool to a default public scope
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipamscope.html
 */
export class IpamPublicScope extends IpamScopeBase {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

/**
 * Provides access to default private IPAM scope through add pool method.
 * Usage: To add an Ipam Pool to a default private scope
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipamscope.html
 */
export class IpamPrivateScope extends IpamScopeBase {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

/**
 * Creates new IPAM with default public and private scope
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipamscope.html
 * @resource AWS::EC2::IPAM
 */
export class Ipam extends Resource {
  // Refers to default public scope
  public readonly publicScope: IpamPublicScope;
  // Refers to default private scope
  public readonly privateScope: IpamPrivateScope;
  // Resource IPAM
  private readonly _ipam: CfnIPAM;
  // Access to Ipam resource id that can be used later to add a custom private scope to this IPAM
  public readonly ipamId: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this._ipam = new CfnIPAM(this, 'Ipam');
    this.publicScope = new IpamPublicScope(this, this._ipam.attrPublicDefaultScopeId);
    this.privateScope = new IpamPrivateScope(this, this._ipam.attrPrivateDefaultScopeId);
    this.ipamId = this._ipam.attrIpamId;
  }
}


/**
 * Represents an IPv4 address range managed by AWS IP Address Manager (IPAM).
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipam.html
 */
export class IpamIpv4 implements IIpAddresses {

  constructor(private readonly props: IpamOptions) {
  }
  allocateVpcCidr(): VpcCidrOptions {

    return {
      ipv4NetmaskLength: this.props.ipv4NetmaskLength,
      ipv4IpamPool: this.props.ipv4IpamPool,
    };
  }
}

/**
 * Represents an IPv4 address range managed by AWS IP Address Manager (IPAM).
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipam.html
 */
export class IpamIpv6 implements IIpAddresses {

  constructor(private readonly props: IpamOptions) {
  }

  allocateVpcCidr(): VpcCidrOptions {
    return {
      ipv6NetmaskLength: this.props.ipv6NetmaskLength,
      ipv6IpamPool: this.props.ipv6IpamPool,
      dependencies: this.props.ipv6IpamPool?.ipamCidrs.map(c => c.node.defaultChild as CfnResource),
    };
  }
}