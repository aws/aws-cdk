/* eslint-disable no-bitwise */
import { CfnIPAM, CfnIPAMPool, CfnIPAMScope } from 'aws-cdk-lib/aws-ec2';
import { IIpAddresses, VpcV2Options } from './vpc-v2';
import { Construct } from 'constructs';
import { Resource } from 'aws-cdk-lib';

export enum AddressFamily {
  IP_V4,
  IP_V6,
}

function getAddressFamilyString(addressFamily: AddressFamily): string {
  switch (addressFamily) {
    case AddressFamily.IP_V4:
      return 'ipv4';
    case AddressFamily.IP_V6:
      return 'ipv6';
    default:
      throw new Error(`Unsupported AddressFamily: ${addressFamily}`);
  }
}

export interface CfnPoolOptions extends PoolOptions {
  readonly ipamScopeId: string;
}

export interface PoolOptions{
  readonly addressFamily: AddressFamily;
  readonly provisionedCidrs?: CfnIPAMPool.ProvisionedCidrProperty[];
  readonly locale?: string;
  readonly publicIpSource?: string;
  /**
  * Limits which service in AWS that the pool can be used in.
  *
  * "ec2", for example, allows users to use space for Elastic IP addresses and VPCs.
  *
  * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-ipampool.html#cfn-ec2-ipampool-awsservice
  */
  readonly awsService?: string;
}

export interface IpamScopeOptions {
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

export class IpamPool {

  public readonly ipamPoolId: string;
  constructor(scope: Construct, id: string, options: CfnPoolOptions) {

    const CfnPool = new CfnIPAMPool(scope, id, {
      addressFamily: getAddressFamilyString(options.addressFamily),
      provisionedCidrs: options.provisionedCidrs,
      locale: options.locale,
      ipamScopeId: options.ipamScopeId,
      publicIpSource: options.publicIpSource,
      awsService: options.awsService,
    });
    this.ipamPoolId = CfnPool.attrIpamPoolId;
  }
}

export class IpamIpv4 implements IIpAddresses {

  constructor(private readonly props: IpamOptions) {
  }
  allocateVpcCidr(): VpcV2Options {

    return {
      ipv4NetmaskLength: this.props.ipv4NetmaskLength,
      ipv4IpamPool: this.props.ipv4IpamPool,
    };
  }
}

/**
 * Creates custom Ipam Scope, can only be private
 * (can be used for adding custom scopes to an existing IPAM)
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
 * Creates new IPAM with default public and private scope
 */

export class Ipam {
  //Refers to default public scope
  public readonly publicScope: IpamPublicScope;
  //Refers to default private scope
  public readonly privateScope: IpamPrivateScope;
  // Resource IPAM
  private readonly _ipam: CfnIPAM;
  // can be used later to add a custom private scope
  public readonly ipamId: string;
  constructor(scope: Construct, id: string) {
    this._ipam = new CfnIPAM(scope, id);
    this.publicScope = new IpamPublicScope(scope, this._ipam.attrPublicDefaultScopeId);
    this.privateScope = new IpamPrivateScope(scope, this._ipam.attrPrivateDefaultScopeId);
    this.ipamId = this._ipam.attrIpamId;
  }
}

export class IpamPublicScope {

  public readonly defaultpublicScopeId: string;
  public readonly scope: Construct;

  constructor(scope: Construct, id: string) {
    this.defaultpublicScopeId = id;
    this.scope = scope;
  }
  /**
   * Adds pool to the default public scope
   * There can be multiple options supported under a scope
   * for pool like using amazon provided IPv6
   */
  addPool(options: PoolOptions): IpamPool {

    const uuid = generateUUID();
    const pool = new IpamPool(this.scope, `PublicPool-${uuid}`, {
      addressFamily: options.addressFamily,
      provisionedCidrs: options.provisionedCidrs,
      ipamScopeId: this.defaultpublicScopeId,
      //TODO: should be stack region or props input
      locale: options.locale,
      publicIpSource: options.publicIpSource,
      awsService: options.awsService,
    });
    /**
     * creates pool under default public scope (IPV4, IPV6)
     */
    return pool;
  }
}

/**
 * Can be used for custom implementation
 */

export class IpamPrivateScope {
  public readonly defaultprivateScopeId: string;
  public readonly scope: Construct;

  constructor(scope: Construct, id: string) {
    this.defaultprivateScopeId = id;
    this.scope = scope;
  }
  /**
   * Adds pool to the default public scope
   * There can be multiple options supported under a scope
   * for pool like using amazon provided IPv6
   */
  addPool(options: PoolOptions):IpamPool {

    const uuid = generateUUID();
    const pool = new IpamPool(this.scope, `PublicPool-${uuid}`, {
      addressFamily: options.addressFamily,
      provisionedCidrs: options.provisionedCidrs,
      ipamScopeId: this.defaultprivateScopeId,
      //TODO: should be stack region or props input
      locale: options.locale,
    });

    return pool;
    /**
     * creates pool under default public scope (IPV4, IPV6)
     */
  }
}

export class IpamIpv6 implements IIpAddresses {

  constructor(private readonly props: IpamOptions) {
  }

  allocateVpcCidr(): VpcV2Options {
    return {
      ipv6NetmaskLength: this.props.ipv6NetmaskLength,
      ipv6IpamPool: this.props.ipv6IpamPool,
    };
  }
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
