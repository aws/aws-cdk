import { Construct } from 'constructs';
import { Fn, Tags } from '../../core';
import {
  CfnEgressOnlyInternetGateway,
  CfnInternetGateway,
  CfnRoute,
  CfnSubnet,
  CfnVPC,
  CfnVPCCidrBlock,
  CfnVPCGatewayAttachment,
  IIpAddresses,
  //FlowLogDestination,
  NatProvider,
  PrivateSubnet,
  PublicSubnet,
  RouterType,
  Subnet,
  //SubnetType,
  Vpc,
} from '../lib';

export enum SubnetProtocol {
  DUAL_STACK = 'DualStack',
  IPV4 = 'IPv4',
  IPV6 = 'IPv6'
}

const SUBNETPROTOCOL_TAG = 'aws-cdk-ex:subnet-protocol';

function subnetProtcolTagValue(protocol: SubnetProtocol) {
  switch (protocol) {
    case SubnetProtocol.DUAL_STACK:
      return 'DualStack';
    case SubnetProtocol.IPV4:
      return 'IPv4';
    case SubnetProtocol.IPV6:
      return 'IPv6';
  }
}

export enum VpcProtocol {
  DUAL_STACK = 'DualStack',
  IPV4 = 'IPV4'
}

const VPCPROTOCOL_TAG = 'aws-cdk-ex:vpc-protocol';

function vpcProtcolTagValue(protocol: VpcProtocol) {
  switch (protocol) {
    case VpcProtocol.DUAL_STACK:
      return 'DualStack';
    case VpcProtocol.IPV4:
      return 'IPv4';
  }
}

export interface NetworkLayerProps {
  readonly ipv4PrivateAddresses?: IIpAddresses;
  readonly maxAzs?: number;
  readonly vpcName?: string;
}

export interface VpcDualStackProps {
  readonly vpc?: Vpc;
}

export class VpcDualStackOneIPv6Block extends Construct {
  public readonly Vpc: Vpc;

  constructor(scope: Construct, id: string, props?: VpcDualStackProps) {
    super(scope, id);

    /*
    // TODO for Production: Set the cidr property of this construct to be a range that doesn't overlap with existing networks
    this.Vpc = new Vpc(this, 'Vpc', {
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: SubnetType.PUBLIC,
        },
        {
          name: 'Private',
          subnetType: SubnetType.PRIVATE_WITH_NAT,
        },
      ],
      flowLogs: {
        cloudwatchLogs: {
          destination: FlowLogDestination.toCloudWatchLogs(),
        },
      },
    });
    */
    if (props?.vpc) {
      this.Vpc = props.vpc;
    } else {
      this.Vpc = new Vpc(this, 'Vpc');
    }

    const ipv6Cidr = new CfnVPCCidrBlock(this, 'ipv6cidr', {
      vpcId: this.Vpc.vpcId,
      amazonProvidedIpv6CidrBlock: true,
    });

    const allSubnets = [...this.Vpc.publicSubnets, ...this.Vpc.privateSubnets, ...this.Vpc.isolatedSubnets];
    const numSubnets = allSubnets.length; //assumption that isolated subnets are included here

    const vpc6cidr = Fn.select(0, this.Vpc.vpcIpv6CidrBlocks);
    const subnet6cidrs = Fn.cidr(vpc6cidr, numSubnets, (128 - 64).toString());

    // associate an IPv6 block to each subnets
    allSubnets.forEach((subnet, i) => {
      const cidr6 = Fn.select(i, subnet6cidrs);

      const cfnSubnet = subnet.node.defaultChild as CfnSubnet;
      cfnSubnet.ipv6CidrBlock = cidr6;
      cfnSubnet.assignIpv6AddressOnCreation = true;
      cfnSubnet.mapPublicIpOnLaunch = false;
      subnet.node.addDependency(ipv6Cidr);
    });

    // for public subnets, ensure there is one IPv6 Internet Gateway
    if (this.Vpc.publicSubnets) {
      let igwId = this.Vpc.internetGatewayId;
      if (!igwId) {
        const igw = new CfnInternetGateway(this, 'IGW');
        igwId = igw.ref;

        new CfnVPCGatewayAttachment(this, 'VPCGW', {
          internetGatewayId: igw.ref,
          vpcId: this.Vpc.vpcId,
        });
      }

      // and that each subnet has a routing table to the Internet Gateway
      this.Vpc.publicSubnets.forEach((subnet) => {
        const s = subnet as PublicSubnet;
        s.addRoute('DefaultRoute6', {
          routerType: RouterType.GATEWAY,
          routerId: igwId!,
          destinationIpv6CidrBlock: '::/0',
          enablesInternetConnectivity: true,
        });
      });
    }

    // for private subnet, ensure there is an IPv6 egress gateway
    if (this.Vpc.privateSubnets) {
      const eigw = new CfnEgressOnlyInternetGateway(this, 'EIGW6', {
        vpcId: this.Vpc.vpcId,
      });

      // and attach a routing table to the egress gateway
      this.Vpc.privateSubnets.forEach((subnet) => {
        const s = subnet as PrivateSubnet;
        s.addRoute('DefaultRoute6', {
          routerType: RouterType.EGRESS_ONLY_INTERNET_GATEWAY,
          routerId: eigw.ref,
          destinationIpv6CidrBlock: '::/0',
          enablesInternetConnectivity: true,
        });
      });
    }
  }
}

export class VpcDualStack extends Construct {

  public readonly vpc: Vpc;

  constructor(scope: Construct, id: string, props: NetworkLayerProps = {}) {
    super(scope, id);

    // The default `Vpc` does not support IPv6, so add changes to make it dual stack,
    // with dual stack public networks (need an IPv4 address for NAT), and IPv6 only
    // private (with egress) networks.

    // This is the default NAT provider, but we want a reference, so create here
    const natProvider = NatProvider.gateway(); // *** do not quite understand this ***
    this.vpc = new Vpc(this, 'VPC', {
      ipAddresses: props.ipv4PrivateAddresses,
      maxAzs: props.maxAzs,
      natGatewayProvider: natProvider,
      vpcName: props.vpcName,
    });
    const includeResourceTypes = [CfnVPC.CFN_RESOURCE_TYPE_NAME];
    Tags.of(this.vpc).add(VPCPROTOCOL_TAG, vpcProtcolTagValue(VpcProtocol.DUAL_STACK), { includeResourceTypes });

    // Assign two initial IPv6 /56 blocks (unlike IPv4 we can freely add as many as we need)
    // Note: A virtual private cloud (VPC) must be dual stack, i.e. must have IPv4 addresses (assigned above), even if not used in any networks
    const ipv6PublicBlock = new CfnVPCCidrBlock(this.vpc, 'Ipv6PublicBlock', {
      amazonProvidedIpv6CidrBlock: true,
      vpcId: this.vpc.vpcId,
    });
    const ipv6PrivateBlock = new CfnVPCCidrBlock(this.vpc, 'Ipv6PrivateBlock', {
      amazonProvidedIpv6CidrBlock: true,
      vpcId: this.vpc.vpcId,
    });

    // Configure an IPv6 egress gateway, for private (with egress) subnets
    const ipv6EgressGateway = new CfnEgressOnlyInternetGateway(this.vpc, 'Ipv6Egress', {
      vpcId: this.vpc.vpcId,
    });

    // Update public subnets to dual stack, to support IPv6

    // Networks are dual stack, as they need IPv4 for NAT
    const publicProtocol = SubnetProtocol.DUAL_STACK;
    this.vpc.publicSubnets.forEach((subnet, index) => {
      const includeResourceTypesForEach = [CfnSubnet.CFN_RESOURCE_TYPE_NAME]; // changed this var name since forEach does not create a new scope
      Tags.of(subnet).add(SUBNETPROTOCOL_TAG, subnetProtcolTagValue(publicProtocol), { includeResourceTypes: includeResourceTypesForEach });

      const cfnSubnet = subnet.node.defaultChild as CfnSubnet;
      cfnSubnet.assignIpv6AddressOnCreation = true;
      // Enabling DNS64 allows IPv6 only clients (on the dual stack network) to access external IPv4.
      // This also preferences IPv6, e.g. for routing, even from dual stack machines.
      // TODO: Need a configuration property to disable this, for rare situations where DNS64 breaks an application
      // and the app/machine can't be configure as single stack IPv4 (e.g. multi-purpose machine)
      cfnSubnet.enableDns64 = true;
      // Use the first IPv6 block for the public networks
      // We don't need to worry about sizes, as a /64 subnet is already huge, and we can add as many /56 blocks as we need
      // (Unlike IPv4 where we need to carefully balance the number of subnets vs addresses within each subnet, but shifting the size)
      cfnSubnet.ipv6CidrBlock = Fn.select(index, Fn.cidr(Fn.select(0, this.vpc.vpcIpv6CidrBlocks), index + 1, '64'));
      cfnSubnet.ipv6Native = false;
      // Public IPv4 will start being charged, so don't automatically assign (as we have IPv6 assigned)
      cfnSubnet.mapPublicIpOnLaunch = false;
      cfnSubnet.privateDnsNameOptionsOnLaunch = { // *** do not quite understand this ***
        EnableResourceNameDnsAAAARecord: true,
        EnableResourceNameDnsARecord: true,
      };
      cfnSubnet.addDependency(ipv6PublicBlock);

      // We know these are created subnets (not other types), so can cast
      // Add default route for IPv6 to the internet gateway
      const sn = subnet as Subnet;
      sn.addRoute('Ipv6Default', {
        destinationIpv6CidrBlock: '::/0',
        routerId: this.vpc.internetGatewayId!,
        routerType: RouterType.GATEWAY,
      });

      // Add route for NAT64
      // NOTE: Our VPC above is configured one gateway per public network
      // TODO: Handle where number of NAT < maxAzs
      // const az = subnet.availabilityZone;
      const natGatewayId = natProvider.configuredGateways[index].gatewayId; // *** do not quite understand this ***
      sn.addRoute('Nat64', {
        destinationIpv6CidrBlock: '64:ff9b::/96', // *** do not quite understand this *** standard?
        routerId: natGatewayId,
        routerType: RouterType.NAT_GATEWAY,
      });
    });

    // Update private subnets to IPv6-only

    // If we can support IPv6 then this removes the need to carefully try and balance subnet sizes.
    // With IPv6 we can allocate as many /56 blocks (256 subnets at a time) as needed, and they will all be unique,
    // and we don't need to worry about subnet size either, which is huge.
    const privateProtocol = SubnetProtocol.IPV6;
    this.vpc.privateSubnets.forEach((subnet, index) => {
      const includeResourceTypesForEach = [CfnSubnet.CFN_RESOURCE_TYPE_NAME];
      Tags.of(subnet).add(SUBNETPROTOCOL_TAG, subnetProtcolTagValue(privateProtocol), { includeResourceTypes: includeResourceTypesForEach });

      const cfnSubnet = subnet.node.defaultChild as CfnSubnet;
      cfnSubnet.assignIpv6AddressOnCreation = true;
      cfnSubnet.cidrBlock = undefined; // *** assuming this is turning off the IPv4 ***
      cfnSubnet.enableDns64 = true;
      // Used second IPv6 block for the private networks
      cfnSubnet.ipv6CidrBlock = Fn.select(index, Fn.cidr(Fn.select(1, this.vpc.vpcIpv6CidrBlocks), index + 1, '64'));
      cfnSubnet.ipv6Native = true;
      cfnSubnet.mapPublicIpOnLaunch = false;
      cfnSubnet.privateDnsNameOptionsOnLaunch = { // *** do not quite understand this ***
        EnableResourceNameDnsAAAARecord: true,
        EnableResourceNameDnsARecord: false,
      };
      cfnSubnet.addDependency(ipv6PrivateBlock);

      // We know these are created subnets (not other types), so can cast
      // Add default route for IPv6 to the egress-only internet gateway
      // (Use the low level construct, so we can add the dependency)
      const ipv6EgressRoute = new CfnRoute(subnet, 'Ipv6Egress', {
        destinationIpv6CidrBlock: '::/0',
        egressOnlyInternetGatewayId: ipv6EgressGateway.attrId,
        routeTableId: subnet.routeTable.routeTableId,
      });
      ipv6EgressRoute.addDependency(ipv6EgressGateway);

      // Add route for NAT64
      // NOTE: Our VPC above is configured one gateway per public network
      // TODO: Handle where number of NAT < maxAzs
      // const az = subnet.availabilityZone;
      const sn = subnet as Subnet;
      const natGatewayId = natProvider.configuredGateways[index].gatewayId;
      sn.addRoute('Nat64', {
        destinationIpv6CidrBlock: '64:ff9b::/96', // *** do not quite understand this *** same
        routerId: natGatewayId,
        routerType: RouterType.NAT_GATEWAY,
      });

      // TODO: Remove unused IPv4 routes
    });

  }
}