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

export interface PoolOptions{
  readonly addressFamily: AddressFamily;
  readonly provisionedCidrs: CfnIPAMPool.ProvisionedCidrProperty[];
  readonly region?: string;
}

export interface IpamScopeOptions {
  readonly ipamID: string;
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
      ipamId: props.ipamID,
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
  public readonly ipamID: string;
  constructor(scope: Construct, id: string) {
    this._ipam = new CfnIPAM(scope, id);
    this.publicScope = new IpamPublicScope(scope, 'DefaultPublic');
    this.privateScope = new IpamPrivateScope(scope, 'DefaultPrivate');
    this.ipamID = this._ipam.attrIpamId;
  }
}

export class IpamPublicScope {

  public readonly defaultpublicScopeId: string;
  private readonly scope: Construct;

  constructor(scope: Construct, id: string) {
    this.defaultpublicScopeId = id;
    this.scope = scope;
  }
  /**
   * Adds pool to the default public scope
   * There can be multiple options supported under a scope
   * for pool like using amazon provided IPv6
   */
  addPool(options: PoolOptions): CfnIPAMPool {

    /**
     * creates pool under default public scope (IPV4, IPV6)
     */
    return new CfnIPAMPool(this.scope, 'TestPool', {
      addressFamily: getAddressFamilyString(options.addressFamily),
      provisionedCidrs: options.provisionedCidrs,
      ipamScopeId: this.defaultpublicScopeId,
      //TODO: should be stack region or props input
      locale: options.region,
    });
  }
}

/**
 * Can be used for custom implementation
 */

export class IpamPrivateScope {
  public readonly defaultprivateScopeId: string;
  private readonly scope: Construct;

  constructor(scope: Construct, id: string) {
    this.defaultprivateScopeId = id;
    this.scope = scope;
  }
  /**
   * Adds pool to the default public scope
   * There can be multiple options supported under a scope
   * for pool like using amazon provided IPv6
   */
  addPool(options: PoolOptions): CfnIPAMPool {

    /**
     * creates pool under default public scope (IPV4, IPV6)
     */
    return new CfnIPAMPool(this.scope, 'TestPool', {
      addressFamily: getAddressFamilyString(options.addressFamily),
      provisionedCidrs: options.provisionedCidrs,
      ipamScopeId: this.defaultprivateScopeId,
      //TODO: should be stack region or props input
      locale: options.region,
    });
  }
}

//Customer Implementation Example
// const ipam = new Ipam(this, 'Ipam');
// ipam.publicScope.addPool({
//   addressFamily: AddressFamily.IP_V4,
//   provisionedCidrs: [{ cidr: '10.0.0.0/24' }],
// });

// export class IpamPool extends Resource {

//   static publicScope: any;

//   publicScope = {
//     addPool: (options: PoolOptions) => {
//       const scope = new IpamScope(this, 'PublicScope', {
//         scopeType: ScopeType.PUBLIC,
//       });
//       return new CfnIPAMPool(this, '', {
//         addressFamily: options.addressFamily.toString(),
//         provisionedCidrs: options.provisionedCidrs,
//         ipamScopeId: scope.ipamScopeId;
//     });
//   },
//   }
//   constructor(stack: Construct, id: string) {
//     super(stack, id);
//   }

// }

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