import { CfnIPAM, CfnIPAMPool, CfnIPAMScope } from 'aws-cdk-lib/aws-ec2/lib';
import { IIpAddresses, VpcV2Options } from './vpc-v2';
import { Construct } from 'constructs';
import { IResolvable, Resource } from 'aws-cdk-lib';

enum AddressFamily {
  IP_V4,
  IP_V6,
}

export interface PoolOptions{
  addressFamily: AddressFamily;
  provisionedCidrs: IResolvable | (IResolvable | CfnIPAMPool.ProvisionedCidrProperty)[];
}

export enum ScopeType {
  PUBLIC,
  PRIVATE,
}

export interface IpamScopeOptions {
  scopeType: ScopeType;
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

  readonly scopeType: ScopeType;
  readonly ipam: CfnIPAM;
  public readonly ipamScope: CfnIPAMScope;
  public readonly ipamScopeId: string;
  constructor(scope: Construct, id: string, props: IpamScopeOptions) {
    super(scope, id);
    this.scopeType = props.scopeType;
    this.ipam = new CfnIPAM(scope, 'Ipam', {});
    this.ipamScope = new CfnIPAMScope(scope, 'IpamScope', {
      ipamId: this.ipam.attrIpamId,
    });
    this.ipamScopeId = this.ipamScope.attrIpamScopeId;
  }
}

export class Ipam extends Resource {
  public readonly publicScope: IpamPublicScope;
  public readonly privateScope: IpamPrivateScope;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.publicScope = new IpamPublicScope(this);
    this.privateScope = new IpamPrivateScope(this);
  }
}

class IpamPublicScope {
  private readonly ipam: Ipam;

  constructor(ipam: Ipam) {
    this.ipam = ipam;
  }

  addPool(options: PoolOptions): CfnIPAMPool {
    const scope = new IpamScope(this.ipam, 'PublicScope', {
      scopeType: ScopeType.PUBLIC,
    });

    return new CfnIPAMPool(this.ipam, '', {
      addressFamily: options.addressFamily.toString(),
      provisionedCidrs: options.provisionedCidrs,
      ipamScopeId: scope.ipamScopeId,
    });
  }
}

class IpamPrivateScope {
  private readonly ipam: Ipam;

  constructor(ipam: Ipam) {
    this.ipam = ipam;
  }

  addPool(options: PoolOptions): CfnIPAMPool {
    const scope = new IpamScope(this.ipam, 'PrivateScope', {
      scopeType: ScopeType.PRIVATE,
    });

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