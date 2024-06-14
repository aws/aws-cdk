import { CfnIPAMPool, CfnVPC, CfnVPCCidrBlock, ISubnet } from 'aws-cdk-lib/aws-ec2';
//import { NetworkBuilder } from 'aws-cdk-lib/aws-ec2/lib/network-util';
import { Arn } from 'aws-cdk-lib/core';
import { Construct, DependencyGroup, IDependable } from 'constructs';
import { IpamIpv4, IpamIpv6 } from './ipam';
import { VpcV2Base } from './vpc-v2-base';

export interface IIpIpamOptions{
  readonly ipv4IpamPoolId: any;
  readonly ipv4NetmaskLength: number;
}

export interface Ipv6AddressesOptions {
  readonly scope?: Construct;
  readonly vpcId?: string;
  readonly ipv4options?: IIpv6AddressesOptions;
  readonly ipv6CidrBlock?: string;
}

export class IpAddresses {

  public static ipv4(ipv4Cidr: string): IIpAddresses {
    return new ipv4CidrAllocation(ipv4Cidr);
  }

  public static ipv4Ipam(ipv4IpamOptions: IIpIpamOptions) {
    return new IpamIpv4(ipv4IpamOptions);
  }

  public static ipv6(ipv6CidrOptions: IIpv6AddressesOptions): IIpAddresses {
    return new ipv6CidrAllocation(ipv6CidrOptions);
  }

  public static ipv6Ipam(ipv6IpamOptions: IIpIpamOptions): IIpAddresses {
    return new IpamIpv6(ipv6IpamOptions);
  }

  public static amazonProvidedIpv6() {
    return new AmazonProvided();
  }

}

export interface VpcV2Options {

  /**
   * CIDR Block
   */
  readonly ipv4CidrBlock?: string;

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
  readonly ipv4IpamPool?: CfnIPAMPool;

  /**
   * Implementing ipv6
   */
  readonly ipv6CidrBlock?: string;

  /*
  */
  readonly ipv4IpamPoolId?: string;

  /**
   * CIDR Mask for Vpc
   *
   * @default - Only required when using AWS Ipam
   */
  readonly ipv6NetmaskLength?: number;

  /*
  */
  readonly ipv6IpamPoolId?: string;

  /**
   * required with cidr block for BYOL IP
   */
  readonly ipv6Pool?: string;

  /**
   * use amazon provided IP range
   */
  readonly amazonProvided?: boolean;
}

export interface IIpv6AddressesOptions {
  readonly ipv6CidrBlock?: string;
  readonly ipv6PoolId?: string;
}

export interface IIpAddresses {

  allocateVpcCidr() : VpcV2Options;

}

export interface IpAddressesCidrConfig {
  readonly cidrblock: string;
}

export interface VpcV2Props {

  /** A must IPv4 CIDR block for the VPC
   * https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html
  */
  readonly primaryAddressBlock?: IIpAddresses;

  /**Can be  IPv4 or IPv6 */
  readonly secondaryAddressBlocks?: IIpAddresses[];
  readonly enableDnsHostnames?: boolean;
  readonly enableDnsSupport?: boolean;
}

/**
 * Creates new VPC with added functionalities
 * @resource AWS::EC2::VPC
 */
export class VpcV2 extends VpcV2Base {

  /**
   * Identifier for this VPC
   */
  public readonly vpcId: string;

  /**
     * @attribute
     */
  public readonly vpcArn: string;

  /**
     * @attribute
     */
  public readonly vpcCidrBlock: string;
  /**
   * The IPv6 CIDR block CFN resource.
   *
   * Needed to create a dependency for the subnets.
   */
  public readonly ipv6CidrBlock?: CfnVPCCidrBlock;

  /**
   * The provider of ipv4 addresses
   */
  public readonly ipAddresses: IIpAddresses;

  //public readonly ipv6Addresses: IIpAddresses;

  public readonly resource: CfnVPC;

  /**
   * Indicates if instances launched in this VPC will have public DNS hostnames.
   */
  public readonly dnsHostnamesEnabled: boolean;

  /**
     * Indicates if DNS support is enabled for this VPC.
     */
  public readonly dnsSupportEnabled: boolean;

  public readonly isolatedSubnets: ISubnet[];

  public readonly internetConnectivityEstablished: IDependable;

  private readonly _internetConnectivityEstablished = new DependencyGroup();

  /**
 * reference to all secondary blocks attached
 */
  public readonly secondaryCidrBlock = new Array<CfnVPCCidrBlock>;

  /**
   * For validation to define IPv6 subnets
   * @default false
   */
  public readonly useIpv6: boolean = false;

  constructor(scope: Construct, id: string, props: VpcV2Props = {}) {
    super(scope, id);

    this.ipAddresses = props.primaryAddressBlock ?? IpAddresses.ipv4('10.0.0.0/16');
    const vpcOptions = this.ipAddresses.allocateVpcCidr();

    this.dnsHostnamesEnabled = props.enableDnsHostnames == null ? true : props.enableDnsHostnames;
    this.dnsSupportEnabled = props.enableDnsSupport == null ? true : props.enableDnsSupport;
    this.resource = new CfnVPC(this, 'Resource', {
      cidrBlock: vpcOptions.ipv4CidrBlock, //for Ipv4 addresses CIDR block
      enableDnsHostnames: this.dnsHostnamesEnabled,
      enableDnsSupport: this.dnsSupportEnabled,
      ipv4IpamPoolId: vpcOptions.ipv4IpamPoolId, // for Ipv4 ipam option
      ipv4NetmaskLength: vpcOptions.ipv4NetmaskLength, // for Ipv4 ipam option
    });

    this.vpcCidrBlock = this.resource.attrCidrBlock;
    this.vpcId = this.resource.attrVpcId;
    this.vpcArn = Arn.format({
      service: 'ec2',
      resource: 'vpc',
      resourceName: this.vpcId,
    }, this.stack);

    if (props.secondaryAddressBlocks) {

      const secondaryAddressBlocks: IIpAddresses[] = props.secondaryAddressBlocks;
      let ipCount = 0;
      for (const secondaryAddressBlock of secondaryAddressBlocks) {
        //TODO: Add unique has for each secondary ip address
        ipCount+=1;
        const secondaryVpcOptions: VpcV2Options = secondaryAddressBlock.allocateVpcCidr();

        if (secondaryVpcOptions.amazonProvided === true) {
          this.useIpv6 = true;
        }
        //validate CIDR ranges per RFC 1918
        if (secondaryVpcOptions.ipv4CidrBlock!) {
          const ret = validateIpv4address(secondaryVpcOptions.ipv4CidrBlock, this.resource.cidrBlock);
          if (ret === false) {
            throw new Error('CIDR block should be in the same RFC 1918 range in the VPC');
          }
        }
        //Create secondary blocks for Ipv4 and Ipv6
        this.secondaryCidrBlock = [...this.secondaryCidrBlock, new CfnVPCCidrBlock(this, `SecondaryIp${ipCount}`, {
          vpcId: this.vpcId,
          cidrBlock: secondaryVpcOptions.ipv4CidrBlock,
          ipv4IpamPoolId: secondaryVpcOptions.ipv4IpamPoolId,
          ipv4NetmaskLength: secondaryVpcOptions.ipv4NetmaskLength,
          //IPv6 Options
          ipv6CidrBlock: secondaryVpcOptions.ipv6CidrBlock,
          ipv6Pool: secondaryVpcOptions.ipv6Pool,
          ipv6NetmaskLength: secondaryVpcOptions.ipv6NetmaskLength,
          ipv6IpamPoolId: secondaryVpcOptions.ipv6IpamPoolId,
          amazonProvidedIpv6CidrBlock: secondaryVpcOptions.amazonProvided,
        })];
      }
    }

    /**
     * Empty array for isolated subnets
     */
    this.isolatedSubnets = new Array<ISubnet>;

    /**
     * Add igw to this if its a public subnet
     */
    this.internetConnectivityEstablished = this._internetConnectivityEstablished;
  }
}

class ipv4CidrAllocation implements IIpAddresses {

  constructor(private readonly cidrBlock: string) {

  }

  allocateVpcCidr(): VpcV2Options {
    return {
      ipv4CidrBlock: this.cidrBlock,
    };
  }
}

class ipv6CidrAllocation implements IIpAddresses {

  private readonly ipv6cidrBlock : string;
  private readonly ipv6poolId: string;
  constructor(private readonly props: IIpv6AddressesOptions) {
    this.ipv6cidrBlock = this.props.ipv6CidrBlock ?? '';
    this.ipv6poolId = this.props.ipv6PoolId ?? '';
  }

  allocateVpcCidr(): VpcV2Options {
    return {
      ipv6CidrBlock: this.ipv6cidrBlock,
      ipv6Pool: this.ipv6poolId,
    };
  }
}

export class AmazonProvided implements IIpAddresses {

  //private readonly amazonProvided: boolean;
  constructor() {
    //this.amazonProvided = true;
  };

  allocateVpcCidr(): VpcV2Options {
    return {
      amazonProvided: true,
    };
  }

}
//Default Config

interface IPaddressConfig {
  octet1: number;
  octet2: number;
}

function validateIpv4address(cidr1?: string, cidr2?: string): boolean {
  if (!cidr1 || !cidr2) {
    return false; // Handle cases where CIDR ranges are not provided
  }

  const octetsCidr1: number[] = cidr1.split('.').map(octet => parseInt(octet, 10));
  const octetsCidr2: number[] = cidr2.split('.').map(octet => parseInt(octet, 10));

  if (octetsCidr1.length !== 4 || octetsCidr2.length !== 4) {
    return false; // Handle invalid CIDR ranges
  }

  const ip1: IPaddressConfig = {
    octet1: octetsCidr1[0],
    octet2: octetsCidr1[1],
  };

  const ip2: IPaddressConfig = {
    octet1: octetsCidr2[0],
    octet2: octetsCidr2[1],
  };

  if (
    (ip1.octet1 === 10 && ip2.octet1 === 10) ||
    (ip1.octet1 === 192 && ip1.octet2 === 168 && ip2.octet1 === 192 && ip2.octet2 === 168) ||
    (ip1.octet1 === 172 && ip1.octet2 === 16 && ip2.octet1 === 172 && ip2.octet2 === 16)
  ) {
    return true; // CIDR ranges belong to same private IP address ranges
  } else {
    return false;
  } // CIDR ranges do not belong to same private IP address ranges
}
