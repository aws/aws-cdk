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
}

export enum ScopeType {
  PUBLIC,
  PRIVATE,
}

export interface IpamScopeOptions {
  readonly scopeType?: ScopeType;
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

class IpamScope extends Resource {

  readonly scopeType?: ScopeType;
  //readonly ipam: CfnIPAM;
  public readonly ipamScope: CfnIPAMScope;
  public readonly ipamScopeId: string;
  constructor(scope: Construct, id: string, props: IpamScopeOptions) {
    super(scope, id);
    this.scopeType = props.scopeType;
    //this.ipam = new CfnIPAM(scope, 'Ipam', {});
    this.ipamScope = new CfnIPAMScope(scope, 'IpamScope', {
      ipamId: props.ipamID,
    });
    this.ipamScopeId = this.ipamScope.attrIpamScopeId;
  }
}

export class Ipam extends Resource {
  public readonly publicScope: IpamPublicScope;
  public readonly privateScope: IpamPublicScope;
  private readonly _ipam: IpamPublicScope;
  public readonly ipamID: string;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    this._ipam = new IpamPublicScope(this);
    this.publicScope = this._ipam;
    this.privateScope = this._ipam;
    this.ipamID = this._ipam.ipamID;
    //this.privateScope = new IpamPrivateScope(this);
  }
}

export class IpamPublicScope {
  private readonly ipam: CfnIPAM;
  public readonly ipamID: string;
  public readonly defaultpublicScopeId: string;
  public readonly defaultprivateScopeId: string;

  constructor(scope: Construct) {
    this.ipam = new CfnIPAM(scope, 'Ipam', {});
    this.defaultprivateScopeId = this.ipam.attrPrivateDefaultScopeId;
    this.defaultpublicScopeId = this.ipam.attrPublicDefaultScopeId;
    this.ipamID = this.ipam.ref;
  }
  /**
   *
   * There can be multiple options supported under a scope
   * for pool like using amazon provided IPv6
   */
  addPool(options: PoolOptions): CfnIPAMPool {

    return new CfnIPAMPool(this.ipam, 'TestPool', {
      addressFamily: getAddressFamilyString(options.addressFamily),
      provisionedCidrs: options.provisionedCidrs,
      ipamScopeId: this.defaultpublicScopeId,
      //TODO: should be stack region or props input
      locale: 'us-west-2',
    });
  }
}

/**
 * Can be used for custom implementation
 */

export class IpamPrivateScope {
  private readonly ipam: Ipam;

  constructor(ipam: Ipam) {
    this.ipam = ipam;
  }

  addPool(options: PoolOptions): CfnIPAMPool {
    const scope = new IpamScope(this.ipam, 'PrivateScope', {
      //scopeType: ScopeType.PRIVATE,
      /**
       * add private scope to provided ipam
       */
      ipamID: this.ipam.ipamID,
    });

    /**
     * add pool to created private scope
     */
    return new CfnIPAMPool(this.ipam, '', {
      addressFamily: options.addressFamily.toString(),
      provisionedCidrs: options.provisionedCidrs,
      ipamScopeId: scope.ipamScopeId,
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