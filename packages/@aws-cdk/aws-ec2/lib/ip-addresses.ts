import { Fn, Token } from '@aws-cdk/core';
import { calculateCidrSplits } from './cidr-splits';
import { NetworkBuilder } from './network-util';
import { SubnetConfiguration } from './vpc';

/**
 * An abstract Provider of IpAddresses
 */
export class IpAddresses {
  /**
   * Used to provide local Ip Address Management services for your VPC
   *
   * VPC Cidr is supplied at creation and subnets are calculated locally
   *
   */
  public static cidr(cidrBlock: string): IIpAddresses {
    return new Cidr(cidrBlock);
  }

  /**
   * Used to provide centralized Ip Address Management services for your VPC
   *
   * Uses VPC Cidr allocations from AWS IPAM
   *
   * @see https://docs.aws.amazon.com/vpc/latest/ipam/what-it-is-ipam.html
   */
  public static awsIpamAllocation(props: AwsIpamProps): IIpAddresses {
    return new AwsIpam(props);
  }

  private constructor() { }
}

/**
 * Implementations for ip address management
 */
export interface IIpAddresses {
  /**
   * Called by the VPC to retrieve VPC options from the Ipam
   *
   * Don't call this directly, the VPC will call it automatically.
   */
  allocateVpcCidr(): VpcIpamOptions;

  /**
   * Called by the VPC to retrieve Subnet options from the Ipam
   *
   * Don't call this directly, the VPC will call it automatically.
   */
  allocateSubnetsCidr(input: AllocateCidrRequest): SubnetIpamOptions;
}

/**
 * Cidr Allocated Vpc
 */
export interface VpcIpamOptions {

  /**
   * Cidr Block for Vpc
   *
   * @default - Only required when Ipam has concrete allocation available for static Vpc
   */
  readonly cidrBlock?: string;

  /**
   * Cidr Mask for Vpc
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

/**
 * Subnet requested for allocation
 */
export interface RequestedSubnet {

  /**
   * The availability zone for the subnet
   */
  readonly availabilityZone: string;

  /**
   * Specify configuration parameters for a single subnet group in a VPC
   */
  readonly configuration: SubnetConfiguration;

  /**
   * Id for the Subnet construct
   */
  readonly subnetConstructId: string;
}

/**
 * An instance of a Subnet requested for allocation
 */
interface IRequestedSubnetInstance {
  /**
   * Index location of Subnet requested for allocation
   */
  readonly index: number,

  /**
   * Subnet requested for allocation
   */
  readonly requestedSubnet: RequestedSubnet
}

/**
 * Request for subnets Cidr to be allocated for a Vpc
 */
export interface AllocateCidrRequest {

  /**
   * The IPv4 CIDR block for this Vpc
   */
  readonly vpcCidr: string;

  /**
   * The Subnets to be allocated
   */
  readonly requestedSubnets: RequestedSubnet[];
}

/**
 * Cidr Allocated Subnets
 */
export interface SubnetIpamOptions {
  /**
   * Cidr Allocations for Subnets
   */
  readonly allocatedSubnets: AllocatedSubnet[];
}

/**
 * Cidr Allocated Subnet
 */
export interface AllocatedSubnet {
  /**
   * Cidr Allocations for a Subnet
   */
  readonly cidr: string;
}

/**
 * Configuration for AwsIpam
 */
export interface AwsIpamProps {

  /**
   * Netmask length for Vpc
   */
  readonly ipv4NetmaskLength: number;

  /**
   * Ipam Pool Id for ipv4 allocation
   */
  readonly ipv4IpamPoolId: string; // todo: should be a type

  /**
   * Default length for Subnet ipv4 Network mask
   *
   * Specify this option only if you do not specify all Subnets using SubnetConfiguration with a cidrMask
   *
   * @default - Default ipv4 Subnet Mask for subnets in Vpc
   *
   */
  readonly defaultSubnetIpv4NetmaskLength?: number;
}

/**
 * Implements integration with Amazon VPC IP Address Manager (IPAM).
 *
 * See the package-level documentation of this package for an overview
 * of the various dimensions in which you can configure your VPC.
 *
 * For example:
 *
 * ```ts
 *  new ec2.Vpc(stack, 'TheVPC', {
 *   ipAddresses: IpAddresses.awsIpamAllocation({
 *     ipv4IpamPoolId: pool.ref,
 *     ipv4NetmaskLength: 18,
 *     defaultSubnetIpv4NetmaskLength: 24
 *   })
 * });
 * ```
 *
 */
class AwsIpam implements IIpAddresses {
  constructor(private readonly props: AwsIpamProps) {
  }

  /**
   * Allocates Vpc Cidr. called when creating a Vpc using AwsIpam.
   */
  allocateVpcCidr(): VpcIpamOptions {
    return {
      ipv4NetmaskLength: this.props.ipv4NetmaskLength,
      ipv4IpamPoolId: this.props.ipv4IpamPoolId,
    };
  }

  /**
   * Allocates Subnets Cidrs. Called by VPC when creating subnets.
   */
  allocateSubnetsCidr(input: AllocateCidrRequest): SubnetIpamOptions {

    const cidrSplit = calculateCidrSplits(this.props.ipv4NetmaskLength, input.requestedSubnets.map((mask => {

      if ((mask.configuration.cidrMask === undefined) && (this.props.defaultSubnetIpv4NetmaskLength=== undefined) ) {
        throw new Error('If you have not set a cidr for all subnets in this case you must set a defaultCidrMask in AwsIpam Options');
      }

      const cidrMask = mask.configuration.cidrMask ?? this.props.defaultSubnetIpv4NetmaskLength;

      if (cidrMask === undefined) {
        throw new Error('Should not have happened, but satisfies the type checker');
      }

      return cidrMask;
    })));

    const allocatedSubnets: AllocatedSubnet[] = cidrSplit.map(subnet => {
      return {
        cidr: Fn.select(subnet.index, Fn.cidr(input.vpcCidr, subnet.count, `${32-subnet.netmask}`)),
      };
    });

    return {
      allocatedSubnets: allocatedSubnets,
    };

  }
}

/**
 * Implements static Ip assignment locally.
 *
 * See the package-level documentation of this package for an overview
 * of the various dimensions in which you can configure your VPC.
 *
 * For example:
 *
 * ```ts
 *  new ec2.Vpc(stack, 'TheVPC', {
 *   ipAddresses: ec2.IpAddresses.cidr('10.0.1.0/20')
 * });
 * ```
 *
 */
class Cidr implements IIpAddresses {
  private readonly networkBuilder: NetworkBuilder;

  constructor(private readonly cidrBlock: string) {
    if (Token.isUnresolved(cidrBlock)) {
      throw new Error('\'cidr\' property must be a concrete CIDR string, got a Token (we need to parse it for automatic subdivision)');
    }

    this.networkBuilder = new NetworkBuilder(this.cidrBlock);
  }

  /**
   * Allocates Vpc Cidr. called when creating a Vpc using IpAddresses.cidr.
   */
  allocateVpcCidr(): VpcIpamOptions {
    return {
      cidrBlock: this.networkBuilder.networkCidr.cidr,
    };
  }

  /**
   * Allocates Subnets Cidrs. Called by VPC when creating subnets.
   */
  allocateSubnetsCidr(input: AllocateCidrRequest): SubnetIpamOptions {

    const allocatedSubnets: AllocatedSubnet[] = [];
    const subnetsWithoutDefinedCidr: IRequestedSubnetInstance[] = [];
    //default: Available IP space is evenly divided across subnets if no cidr is given.

    input.requestedSubnets.forEach((requestedSubnet, index) => {
      if (requestedSubnet.configuration.cidrMask === undefined) {
        subnetsWithoutDefinedCidr.push({
          index,
          requestedSubnet,
        });
      } else {
        allocatedSubnets.push({
          cidr: this.networkBuilder.addSubnet(requestedSubnet.configuration.cidrMask),
        });
      }
    });

    const cidrMaskForRemaining = this.networkBuilder.maskForRemainingSubnets(subnetsWithoutDefinedCidr.length);
    subnetsWithoutDefinedCidr.forEach((subnet)=> {
      allocatedSubnets.splice(subnet.index, 0, {
        cidr: this.networkBuilder.addSubnet(cidrMaskForRemaining),
      });
    });

    return {
      allocatedSubnets: allocatedSubnets,
    };
  }
}
