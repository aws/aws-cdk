import { CfnEIP, CfnEgressOnlyInternetGateway, CfnInternetGateway, CfnNatGateway, CfnNetworkInterface, CfnRoute, CfnRouteTable, CfnVPCGatewayAttachment, CfnVPCPeeringConnection, CfnVPNGateway, GatewayVpcEndpoint, IRouteTable, ISubnet, IVpcEndpoint, RouterType } from 'aws-cdk-lib/aws-ec2';
import { IIpAddresses } from './vpc-v2';
import { Construct, IDependable } from 'constructs';
import { Duration, Resource } from 'aws-cdk-lib/core';

/**
 * Interface to define a routing target, such as an
 * egress-only internet gateway or VPC endpoint.
 */
export interface IRouteTarget {
  /**
   * The type of router used in the route.
   */
  readonly routerType: RouterType;

  /**
   * The ID of the route target.
   */
  readonly routerId: string;
}

/**
 * Properties to define a carrier gateway.
 */
// export interface CarrierGatewayProps {
//   /**
//    * The ID of the VPC associated with the carrier gateway.
//    */
//   readonly vpcId: string;
// }

/**
 * Properties to define an egress-only internet gateway.
 */
export interface EgressOnlyInternetGatewayProps {
  /**
   * The ID of the VPC for which to create the egress-only internet gateway.
   */
  readonly vpcId: string;

  /**
   * The resource name of the egress-only internet gateway.
   * @default none
   */
  readonly egressOnlyInternetGatewayName?: string;
}

/**
 * Properties to define an internet gateway.
 */
export interface InternetGatewayProps {
  /**
   * The ID of the VPC for which to create the internet gateway.
   */
  readonly vpcId: string;

  /**
   * The resource name of the internet gateway.
   * @default none
   */
  readonly internetGatewayName?: string;

}

/**
 * Properties to define a VPN gateway.
 */
export interface VPNGatewayProps {
  /**
   * The type of VPN connection the virtual private gateway supports.
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpngateway.html#cfn-ec2-vpngateway-type
   */
  readonly type: string;

  /**
   * The ID of the VPC for which to create the VPN gateway.
   */
  readonly vpcId: string;

  /**
   * The private Autonomous System Number (ASN) for the Amazon side of a BGP session.
   * @default none
   */
  readonly amazonSideAsn?: number;

  /**
   * The resource name of the VPN gateway.
   * @default none
   */
  readonly vpnGatewayName?: string;
}

/**
 * Properties to define a NAT gateway.
 */
export interface NatGatewayProps {
  /**
   * The subnet in which the NAT gateway is located.
   */
  readonly subnet: ISubnet;

  /**
   * The ID of the VPC in which the NAT gateway is located.
   * @default none
   */
  readonly vpcId?: string;

  /**
   * [Public NAT gateway only] The allocation ID of the Elastic IP address that's
   * associated with the NAT gateway. This property is required for a public NAT
   * gateway and cannot be specified with a private NAT gateway.
   * @default none
   */
  readonly allocationId?: string;

  /**
   * Indicates whether the NAT gateway supports public or private connectivity.
   * @default public
   */
  readonly connectivityType?: string;

  /**
   * The maximum amount of time to wait before forcibly releasing the
   * IP addresses if connections are still in progress.
   * @default 350 seconds
   */
  readonly maxDrainDuration?: Duration;

  /**
   * The private IPv4 address to assign to the NAT gateway. If you don't provide an
   * address, a private IPv4 address will be automatically assigned.
   * @default none
   */
  readonly privateIpAddress?: string;

  /**
   * Secondary EIP allocation IDs.
   * @default none
   * @see https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html#nat-gateway-creating
   */
  readonly secondaryAllocationIds?: string[];

  /**
   * [Private NAT gateway only] The number of secondary private IPv4 addresses you
   * want to assign to the NAT gateway.
   *
   * `SecondaryPrivateIpAddressCount` and `SecondaryPrivateIpAddresses` cannot be
   * set at the same time.
   *
   * @default none
   * @see https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html#nat-gateway-creating
   */
  readonly secondaryPrivateIpAddressCount?: number;

  /**
   * Secondary private IPv4 addresses.
   *
   * `SecondaryPrivateIpAddressCount` and `SecondaryPrivateIpAddresses` cannot be
   * set at the same time.
   *
   * @default none
   * @see https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html#nat-gateway-creating
   */
  readonly secondaryPrivateIpAddresses?: string[];

  /**
   * The resource name of the NAT gateway.
   * @default none
   */
  readonly natGatewayName?: string;

}

/**
 * Properties to define a network interface.
 */
export interface NetworkInterfaceProps {
  /**
   * The subnet to associate with the network interface.
   */
  readonly subnet: ISubnet;

  /**
   * The resource name of the network interface.
   * @default none
   */
  readonly networkInterfaceName?: string;

}

/**
 * Properties to define a transit gateway.
 */
// export interface TransitGatewayProps {

// }

/**
 * Properties to define a VPC peering connection.
 */
export interface VpcPeeringConnectionProps {
  /**
   * The ID of the VPC.
   */
  readonly vpcId: string;

  /**
   * The ID of the VPC with which you are creating the VPC peering connection. You must
   * specify this parameter in the request.
   */
  readonly peerVpcId: string;

  /**
   * The AWS account ID of the owner of the accepter VPC.
   * @default - Your AWS account ID
   */
  readonly peerOwnerId?: string;

  /**
   * The Region code for the accepter VPC, if the accepter VPC is located in a Region
   * other than the Region in which you make the request.
   * @default - The Region in which you make the request
   */
  readonly peerRegion?: string;

  /**
   * The Amazon Resource Name (ARN) of the VPC peer role for the peering connection in
   * another AWS account.
   *
   * This is required when you are peering a VPC in a different AWS account.
   * @default none
   */
  readonly peerRole?: string;

  /**
   * The resource name of the VPC peering connection.
   * @default none
   */
  readonly vpcPeeringConnectionName?: string;

}

/**
 * Creates a carrier gateway
 * @resource AWS::EC2::CarrierGateway
 */
// export class CarrierGateway extends Resource implements IRouteTarget {
//   /**
//    * The type of router used in the route.
//    */
//   readonly routerType: RouterType;

//   /**
//    * The ID of the route target.
//    */
//   readonly routerId: string;

//   /**
//    * The carrier gateway CFN resource.
//    */
//   public readonly resource: CfnCarrierGateway;

//   constructor(scope: Construct, id: string, props: CarrierGatewayProps) {
//     super(scope, id);

//     this.routerType = RouterType.CARRIER_GATEWAY;

//     this.resource = new CfnCarrierGateway(this, 'CarrierGateway', {
//       vpcId: props.vpcId,
//     });

//     this.routerId = this.resource.attrCarrierGatewayId;
//   }
// }

/**
 * Creates an egress-only internet gateway
 * @resource AWS::EC2::EgressOnlyInternetGateway
 */
export class EgressOnlyInternetGateway extends Resource implements IRouteTarget {
  /**
   * The type of router used in the route.
   */
  readonly routerType: RouterType;

  /**
   * The ID of the route target.
   */
  readonly routerId: string;

  /**
   * The egress-only internet gateway CFN resource.
   */
  public readonly resource: CfnEgressOnlyInternetGateway;

  constructor(scope: Construct, id: string, props: EgressOnlyInternetGatewayProps) {
    super(scope, id);

    this.routerType = RouterType.EGRESS_ONLY_INTERNET_GATEWAY;

    this.resource = new CfnEgressOnlyInternetGateway(this, 'EIGW', {
      vpcId: props.vpcId,
    });

    this.routerId = this.resource.attrId;
  }
}

/**
 * Creates an internet gateway
 * @resource AWS::EC2::InternetGateway
 */
export class InternetGateway extends Resource implements IRouteTarget {
  /**
   * The type of router used in the route.
   */
  readonly routerType: RouterType;

  /**
   * The ID of the route target.
   */
  readonly routerId: string;

  /**
   * The ID of the VPC for which to create the internet gateway.
   */
  public readonly vpcId: string;

  /**
   * The internet gateway CFN resource.
   */
  public readonly resource: CfnInternetGateway;

  constructor(scope: Construct, id: string, props: InternetGatewayProps) {
    super(scope, id);

    this.routerType = RouterType.GATEWAY;

    this.resource = new CfnInternetGateway(this, 'IGW', {});

    this.routerId = this.resource.attrInternetGatewayId;
    this.vpcId = props.vpcId;
  }
}

/**
 * Creates a virtual private gateway
 * @resource AWS::EC2::VPNGateway
 */
export class VPNGateway extends Resource implements IRouteTarget {
  /**
   * The type of router used in the route.
   */
  readonly routerType: RouterType;

  /**
   * The ID of the route target.
   */
  readonly routerId: string;

  /**
   * The ID of the VPC for which to create the VPN gateway.
   */
  public readonly vpcId: string;

  /**
   * The VPN gateway CFN resource.
   */
  public readonly resource: CfnVPNGateway;

  constructor(scope: Construct, id: string, props: VPNGatewayProps) {
    super(scope, id);

    this.routerType = RouterType.GATEWAY;

    this.resource = new CfnVPNGateway(this, 'IGW', {
      type: props.type,
    });

    if (props.amazonSideAsn) {
      this.resource.addPropertyOverride('AmazonSideAsn', props.amazonSideAsn);
    }

    this.routerId = this.resource.attrVpnGatewayId;
    this.vpcId = props.vpcId;
  }
}

/**
 * Creates a network address translation (NAT) gateway
 * @resource AWS::EC2::NatGateway
 */
export class NatGateway extends Resource implements IRouteTarget {
  /**
   * The type of router used in the route.
   */
  readonly routerType: RouterType;

  /**
   * The ID of the route target.
   */
  readonly routerId: string;

  /**
   * [Public NAT gateway only] The allocation ID of the Elastic IP address that's
   * associated with the NAT gateway. This property is required for a public NAT
   * gateway and cannot be specified with a private NAT gateway.
   * @default none
   */
  public readonly allocationId?: string;

  /**
   * Indicates whether the NAT gateway supports public or private connectivity.
   * @default public
   */
  public readonly connectivityType?: string;

  /**
   * The maximum amount of time to wait before forcibly releasing the
   * IP addresses if connections are still in progress.
   * @default 350 seconds
   */
  public readonly maxDrainDuration?: Duration;

  /**
   * The NAT gateway CFN resource.
   */
  public readonly resource: CfnNatGateway;

  constructor(scope: Construct, id: string, props: NatGatewayProps) {
    super(scope, id);

    this.routerType = RouterType.NAT_GATEWAY;

    this.connectivityType = props.connectivityType || 'public';
    this.maxDrainDuration = props.maxDrainDuration || Duration.seconds(350);

    // If user does not provide EIP, generate one for them
    var aId: string | undefined;
    if (this.connectivityType == 'public') {
      if (!props.allocationId) {
        let eip = new CfnEIP(this, 'EIP', {
          domain: props.vpcId,
        });
        aId = eip.attrAllocationId;
      } else {
        aId = props.allocationId;
      }
    }

    this.resource = new CfnNatGateway(this, 'NATGateway', {
      subnetId: props.subnet.subnetId,
      allocationId: aId,
      ...props,
    });

    this.routerId = this.resource.attrNatGatewayId;

    this.node.addDependency(props.subnet.internetConnectivityEstablished);
  }
}

/**
 * Creates a network interface
 * @resource AWS::EC2::NetworkInterface
 */
export class NetworkInterface extends Resource implements IRouteTarget {
  /**
   * The type of router used in the route.
   */
  readonly routerType: RouterType;

  /**
   * The ID of the route target.
   */
  readonly routerId: string;

  /**
   * The network interface CFN resource.
   */
  public readonly resource: CfnNetworkInterface;

  constructor(scope: Construct, id: string, props: NetworkInterfaceProps) {
    super(scope, id);

    this.routerType = RouterType.NETWORK_INTERFACE;

    this.resource = new CfnNetworkInterface(this, 'NetworkInterface', {
      subnetId: props.subnet.subnetId,
    });

    this.routerId = this.resource.attrId;
  }
}

/**
 * Creates a transit gateway
 * @resource AWS::EC2::TransitGateway
 */
// export class TransitGateway extends Resource implements IRouteTarget {
//   /**
//    * The type of router used in the route.
//    */
//   readonly routerType: RouterType;

//   /**
//    * The ID of the route target.
//    */
//   readonly routerId: string;

//   /**
//    * The transit gateway CFN resource.
//    */
//   public readonly resource: CfnTransitGateway;

//   constructor(scope: Construct, id: string/*, props: TransitGatewayProps*/) {
//     super(scope, id);

//     this.routerType = RouterType.TRANSIT_GATEWAY;

//     this.resource = new CfnTransitGateway(this, 'TGW', {});

//     this.routerId = this.resource.attrId;
//   }
// }

/**
 * Creates a request for a VPC peering connection between two VPCs: a requester VPC that
 * you own and an accepter VPC with which to create the connection.
 * @resource AWS::EC2::VPCPeeringConnection
 */
export class VpcPeeringConnection extends Resource implements IRouteTarget {
  /**
   * The type of router used in the route.
   */
  readonly routerType: RouterType;

  /**
   * The ID of the route target.
   */
  readonly routerId: string;

  /**
   * The VPC peering connection CFN resource.
   */
  public readonly resource: CfnVPCPeeringConnection;

  constructor(scope: Construct, id: string, props: VpcPeeringConnectionProps) {
    super(scope, id);

    this.routerType = RouterType.VPC_PEERING_CONNECTION;

    this.resource = new CfnVPCPeeringConnection(this, 'VPCPeerConnection', {
      ...props,
    });

    this.routerId = this.resource.attrId;
  }
}

/**
 * The type of endpoint or gateway being targeted by the route.
 */
export interface IRouteTargetType {
  /**
   * The gateway route target. This is used for targets such as
   * egress-only internet gateway or VPC peering connection.
   * @default none
   */
  readonly gateway?: IRouteTarget;

  /**
   * The endpoint route target. This is used for targets such as
   * VPC endpoints.
   * @default none
   */
  readonly endpoint?: IVpcEndpoint;
}

/**
 * The gateway or endpoint targeted by the route.
 */
export class RouteTargetType {
  /**
   * The gateway route target. This is used for targets such as
   * egress-only internet gateway or VPC peering connection.
   * @default none
   */
  readonly gateway?: IRouteTarget;

  /**
   * The endpoint route target. This is used for targets such as
   * VPC endpoints.
   * @default none
   */
  readonly endpoint?: IVpcEndpoint;

  constructor(props: IRouteTargetType) {
    if (props.gateway && props.endpoint) {
      throw new Error('Cannot specify both gateway and endpoint');
    };
    if (props.gateway) {
      this.gateway = props.gateway;
    } else if (props.endpoint) {
      this.endpoint = props.endpoint;
    }
  }
}

/**
 * Interface to define a route.
 */
export interface IRouteV2 {
  /**
   * The ID of the route table for the route.
   * @attribute routeTable
   */
  readonly routeTable: IRouteTable;

  /**
   * The IPv4 or IPv6 CIDR block used for the destination match.
   *
   * Routing decisions are based on the most specific match.
   */
  readonly destination: IIpAddresses;

  /**
   * The gateway or endpoint targeted by the route.
   */
  readonly target: RouteTargetType;
}

/**
 * Properties to define a route.
 */
export interface RouteProps {
  /**
   * The ID of the route table for the route.
   * @attribute routeTable
   */
  readonly routeTable: IRouteTable;

  /**
   * The IPv4 or IPv6 CIDR block used for the destination match.
   *
   * Routing decisions are based on the most specific match.
   */
  readonly destination: IIpAddresses;

  /**
   * The gateway or endpoint targeted by the route.
   */
  readonly target: RouteTargetType;

  /**
   * The resource name of the route.
   * @default none
   */
  readonly routeName?: string;
}

/**
 * Creates a new route with added functionality.
 * @resource AWS::EC2::Route
 */
export class Route extends Resource implements IRouteV2 {
  /**
   * The IPv4 or IPv6 CIDR block used for the destination match.
   *
   * Routing decisions are based on the most specific match.
   */
  public readonly destination: IIpAddresses;

  /**
   * The gateway or endpoint targeted by the route.
   */
  public readonly target: RouteTargetType;

  /**
   * The route table for the route.
   * @attribute routeTable
   */
  public readonly routeTable: IRouteTable;

  /**
   * The type of router the route is targetting
   */
  public readonly targetRouterType: RouterType

  /**
   * The route CFN resource.
   */
  public readonly resource?: CfnRoute;

  constructor(scope: Construct, id: string, props: RouteProps) {
    super(scope, id);

    this.destination = props.destination;
    this.target = props.target;
    this.routeTable = props.routeTable;

    this.targetRouterType = this.target.gateway ? this.target.gateway.routerType : RouterType.VPC_ENDPOINT;

    // Gateway generates route automatically via its RouteTable, thus we don't need to generate the resource for it
    if (!(this.target instanceof GatewayVpcEndpoint)) {
      this.resource = new CfnRoute(this, 'Route', {
        routeTableId: this.routeTable.routeTableId,
        destinationCidrBlock: this.destination.allocateVpcCidr().ipv4CidrBlock,
        destinationIpv6CidrBlock: this.destination.allocateVpcCidr().ipv6CidrBlock,
        [routerTypeToPropName(this.targetRouterType)]: this.target.gateway ? this.target.gateway.routerId :
          this.target.endpoint ? this.target.endpoint.vpcEndpointId : null,
      });
    }

    if (this.targetRouterType == RouterType.GATEWAY) {
      if (this.target instanceof InternetGateway) {
        new CfnVPCGatewayAttachment(this, 'GWAttachment', {
          vpcId: this.target.vpcId,
          internetGatewayId: this.target.routerId,
        });
      } else if (this.target instanceof VPNGateway) {
        new CfnVPCGatewayAttachment(this, 'GWAttachment', {
          vpcId: this.target.vpcId,
          vpnGatewayId: this.target.routerId,
        });
      }
    }
  }
}

/**
 * Creates a route table for the specified VPC
 * @resource AWS::EC2::RouteTable
 */
export class RouteTable extends Resource implements IRouteTable, IDependable {
  /**
   * The ID of the route table.
   */
  public readonly routeTableId: string;

  /**
   * The route table CFN resource.
   */
  public readonly resource: CfnRouteTable;

  constructor(scope: Construct, id: string, props: RouteTableProps) {
    super(scope, id);

    this.resource = new CfnRouteTable(this, 'RouteTable', {
      vpcId: props.vpcId,
    });

    this.routeTableId = this.resource.attrRouteTableId;
  }
}

/**
 * Properties to define a route table.
 */
export interface RouteTableProps {
  /**
   * The ID of the VPC.
   */
  readonly vpcId: string;

  /**
   * The resource name of the route table.
   * @default none
   */
  readonly routeTableName?: string;
}

function routerTypeToPropName(routerType: RouterType) {
  return ({
    [RouterType.CARRIER_GATEWAY]: 'carrierGatewayId',
    [RouterType.EGRESS_ONLY_INTERNET_GATEWAY]: 'egressOnlyInternetGatewayId',
    [RouterType.GATEWAY]: 'gatewayId',
    [RouterType.INSTANCE]: 'instanceId',
    [RouterType.LOCAL_GATEWAY]: 'localGatewayId',
    [RouterType.NAT_GATEWAY]: 'natGatewayId',
    [RouterType.NETWORK_INTERFACE]: 'networkInterfaceId',
    [RouterType.TRANSIT_GATEWAY]: 'transitGatewayId',
    [RouterType.VPC_PEERING_CONNECTION]: 'vpcPeeringConnectionId',
    [RouterType.VPC_ENDPOINT]: 'vpcEndpointId',
  })[routerType];
}