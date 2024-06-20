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
  readonly provisionedCidrs: CfnIPAMPool.ProvisionedCidrProperty[];
  readonly locale?: string;
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
  readonly ipv6IpamPoolId?: string;
}

export class IpamPool extends Resource {

  public readonly ipamPoolId: string;
  constructor(scope: Construct, id: string, options: CfnPoolOptions) {
    super(scope, id);

    const cfnPool = new CfnIPAMPool(scope, id, {
      addressFamily: getAddressFamilyString(options.addressFamily),
      provisionedCidrs: options.provisionedCidrs,
      locale: options.locale,
      ipamScopeId: options.ipamScopeId,
    });
    this.ipamPoolId = cfnPool.attrIpamPoolId;
    cfnPool.applyRemovalPolicy(undefined);
  }
}

export class IpamIpv4 implements IIpAddresses {

  constructor(private readonly props: IpamOptions) {
  }
  allocateVpcCidr(): VpcV2Options {

    return {
      ipv4NetmaskLength: this.props.ipv4NetmaskLength,
      ipv4IpamPoolId: this.props.ipv4IpamPoolId,
    };
  }
}

/**
 * Creates custom Ipam Scope, can only be private
 * (can be used for adding custom scopes to an existing IPAM)
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

  public readonly defaultPublicScopeId: string;
  public readonly scope: Construct;

  constructor(scope: Construct, id: string) {
    this.defaultPublicScopeId = id;
    this.scope = scope;
  }
  /**
   * Adds pool to the default public scope
   * There can be multiple options supported under a scope
   * for pool like using amazon provided IPv6
   */
  addPool(options: PoolOptions): IpamPool {

    /**
     * creates pool under default public scope (IPV4, IPV6)
     */
    return new IpamPool(this.scope, 'PublicPool', {
      addressFamily: options.addressFamily,
      provisionedCidrs: options.provisionedCidrs,
      ipamScopeId: this.defaultPublicScopeId,
      //TODO: should be stack region or props input
      locale: options.locale,
    });
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
  addPool(options: PoolOptions): IpamPool {

    return new IpamPool(this.scope, 'PrivatePool', {
      addressFamily: options.addressFamily,
      provisionedCidrs: options.provisionedCidrs,
      ipamScopeId: this.defaultprivateScopeId,
      //TODO: should be stack region or props input
      locale: options.locale,
    });
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
      ipv6IpamPoolId: this.props.ipv6IpamPoolId,
    };
  }
}

