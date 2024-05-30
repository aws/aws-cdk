import { CfnIPAMPool, CfnVPC, CfnVPCCidrBlock } from 'aws-cdk-lib/aws-ec2/lib';
import { NetworkBuilder } from 'aws-cdk-lib/aws-ec2/lib/network-util';
import { Resource } from 'aws-cdk-lib/core/lib/resource';
import { Construct } from 'constructs';
import { IpamIpv4, IpamIpv6 } from './ipam';
import { Arn } from 'aws-cdk-lib/core/lib/arn';
import { Token } from 'aws-cdk-lib/core';

export interface IIpIpamOptions{
  readonly ipv4IpamPoolId: any;
  readonly netmaskLength: number;
}

export interface Ipv6AddressesOptions {
  readonly scope: Construct;
  readonly vpcId: string;

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
  readonly ipv6CidrBlock?: CfnVPCCidrBlock;

  /*
  */
  readonly ipv4IpamPoolId?: string;

}

export interface IVpcV2 {

  readonly vpcId: string;

  readonly vpcArn: string;

  readonly vpcCidrBlock: string;

}

export interface IIpv6AddressesOptions {
  readonly ipv6CidrBlock: string;
  readonly ipv6PoolId?: string;
}

export interface IIpAddresses {

  allocateVpcCidr() : VpcV2Options;

  allocateVpcV6Cidr(options: Ipv6AddressesOptions): VpcV2Options;
}

export interface IpAddressesCidrConfig {
  readonly cidrblock: string;
}

export interface VpcV2Props {
  readonly primaryAddressBlock?: IIpAddresses;
  readonly secondaryAddressBlocks?: IIpAddresses[];
  readonly enableDnsHostnames?: boolean;
  readonly enableDnsSupport?: boolean;
  readonly useIpv6?: boolean;
}

/**
 * Creates new VPC with added functionalities
 * @resource AWS::EC2::VPC
 */
export class VpcV2 extends Resource implements IVpcV2 {

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
   *
   */
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

  constructor(scope: Construct, id: string, props: VpcV2Props = {}) {
    super(scope, id);

    this.ipAddresses = props.primaryAddressBlock ?? IpAddresses.ipv4('10.0.0.0/16');
    const vpcOptions = this.ipAddresses.allocateVpcCidr();

    //const secondaryAddressBlocks = props.secondaryAddressBlocks;
    this.dnsHostnamesEnabled = props.enableDnsHostnames == null ? true : props.enableDnsHostnames;
    this.dnsSupportEnabled = props.enableDnsSupport == null ? true : props.enableDnsSupport;
    this.resource = new CfnVPC(this, 'Resource', {
      cidrBlock: vpcOptions.ipv4CidrBlock, //for Ipv4 addresses
      enableDnsHostnames: this.dnsHostnamesEnabled,
      enableDnsSupport: this.dnsSupportEnabled,
    });

    this.vpcCidrBlock = this.resource.attrCidrBlock;
    this.vpcId = this.resource.ref;
    this.vpcArn = Arn.format({
      service: 'ec2',
      resource: 'vpc',
      resourceName: this.vpcId,
    }, this.stack);

    if (props.useIpv6) {
      this.ipAddresses = props.primaryAddressBlock ?? IpAddresses.ipv6({
        ipv6CidrBlock: '::/0',
      });
      const vpcOptionsV6 = this.ipAddresses.allocateVpcV6Cidr({
        scope: this,
        vpcId: this.vpcId,
      });
      this.ipv6CidrBlock = vpcOptionsV6.ipv6CidrBlock;
    }
  }
}

class ipv4CidrAllocation implements IIpAddresses {

  private readonly networkBuilder: NetworkBuilder;

  constructor(private readonly cidrBlock: string) {
    if (Token.isUnresolved(cidrBlock)) {
      throw new Error('\'cidr\' property must be a concrete CIDR string, got a Token (we need to parse it for automatic subdivision)');
    }

    this.networkBuilder = new NetworkBuilder(this.cidrBlock);
  }
  allocateVpcV6Cidr(_options: Ipv6AddressesOptions): VpcV2Options {
    throw new Error('Method not implemented.');
  }

  allocateVpcCidr(): VpcV2Options {
    return {
      ipv4CidrBlock: this.networkBuilder.networkCidr.cidr,
    };
  }
}

class ipv6CidrAllocation implements IIpAddresses {

  public ipv6CidrBlock: CfnVPCCidrBlock | undefined;
  constructor(_props: IIpv6AddressesOptions) {}allocateVpcCidr(): VpcV2Options {
    throw new Error('Method not implemented.');
  }
  ;

  allocateVpcV6Cidr(options: Ipv6AddressesOptions): VpcV2Options {
    this.ipv6CidrBlock = AllocateIpv6CidrRequest(options);
    return {
      ipv6CidrBlock: this.ipv6CidrBlock,
    };
  }

}

function AllocateIpv6CidrRequest(options: Ipv6AddressesOptions): CfnVPCCidrBlock {
  return new CfnVPCCidrBlock(options.scope, 'Ipv6CidrBlock', {
    vpcId: options.vpcId,
  });

}
