import { CfnIPAMPoolProps } from 'aws-cdk-lib/aws-ec2/lib';
import { IIpAddresses, Ipv6AddressesOptions, VpcV2Options } from './vpc-v2';

// enum AddressFamily {
//   IP_V4,
//   IP_V6,
// }

export interface PoolOptions extends CfnIPAMPoolProps{
}

// interface Pool {
//   addressFamily: AddressFamily;
//   provisionedCidrs: string[];
// }

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

}

// class Ipam {
//     private pools: Pool[] = [];

//     publicScope = {
//         addPool: (options: PoolOptions): Pool => {
//             const { addressFamily, provisionedCidrs } = options;
//             const newPool: Pool = {
//                 addressFamily,
//                 provisionedCidrs
//             };
//             this.pools.push(newPool);
//             return newPool;
//         }
//     };
// }

// const pool = ipam.publicScope.addPool({
//     addressFamily: AddressFamily.IP_V4,
//     provisionedCidrs: ['10.2.0.0/16']
// });

export class IpamIpv4 implements IIpAddresses {

  constructor(private readonly props: IpamOptions) {
  }
  allocateVpcV6Cidr(_options: Ipv6AddressesOptions): VpcV2Options {
    throw new Error('Method not implemented.');
  }

  allocateVpcCidr(): VpcV2Options {
    return {
      ipv4NetmaskLength: this.props.ipv4NetmaskLength,
      ipv4IpamPoolId: this.props.ipv4IpamPoolId,
    };
  }
}

// export class IpamPool extends Resource {

//   constructor(stack: Construct, id: string, IpamOptions= {}) {
//     super(stack, id, IpamOptions);
//   }

//   // eslint-disable-next-line @typescript-eslint/member-ordering
//   publicScope = {
//     addPool: (options: PoolOptions) => {
//       return new CfnIPAMPool(this, '', options);
//     },

//   }
// }