import { CfnEIP, CfnEgressOnlyInternetGateway, CfnInternetGateway, CfnNatGateway, CfnRoute, CfnRouteTable, CfnVPCGatewayAttachment, CfnVPNGateway, GatewayVpcEndpoint, IRouteTable, ISubnet, IVpcEndpoint, RouterType, VpnConnectionType } from 'aws-cdk-lib/aws-ec2';
import { Construct, IDependable } from 'constructs';
import { Duration, Resource } from 'aws-cdk-lib/core';
import { IVpcV2 } from './vpc-v2-base';

/**
 * Indicates whether the NAT gateway supports public or private connectivity.
 * The default is public connectivity.
 * See: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-natgateway.html#cfn-ec2-natgateway-connectivitytype
 */
export enum NatConnectivityType {
  /**
   * Sets Connectivity type to PUBLIC
   */
  PUBLIC = 'public',
  /**
   * Sets Connectivity type to PRIVATE
   */
  PRIVATE = 'private',
}

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
  readonly routerTargetId: string;
}

/**
 * Properties to define an egress-only internet gateway.
 */
export interface EgressOnlyInternetGatewayProps {
  /**
   * The ID of the VPC for which to create the egress-only internet gateway.
   */
  readonly vpc: IVpcV2;

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
  readonly vpc: IVpcV2;

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
  readonly type: VpnConnectionType;

  /**
   * The ID of the VPC for which to create the VPN gateway.
   */
  readonly vpc: IVpcV2;

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
  readonly vpc?: IVpcV2;

  /**
   * AllocationID of Elastic IP address that's associated with the NAT gateway. This property is required for a public NAT
   * gateway and cannot be specified with a private NAT gateway.
   * @default attr.allocationID of a new Elastic IP created by default
   * //TODO: ADD L2 for elastic ip
   */
  readonly allocationId?: string;

  /**
   * Indicates whether the NAT gateway supports public or private connectivity.
   * @default public
   */
  readonly connectivityType?: NatConnectivityType;

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
   * The number of secondary private IPv4 addresses you
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
  readonly routerTargetId: string;

  /**
   * The egress-only internet gateway CFN resource.
   */
  public readonly resource: CfnEgressOnlyInternetGateway;

  constructor(scope: Construct, id: string, props: EgressOnlyInternetGatewayProps) {
    super(scope, id);

    this.routerType = RouterType.EGRESS_ONLY_INTERNET_GATEWAY;

    this.resource = new CfnEgressOnlyInternetGateway(this, 'EIGW', {
      vpcId: props.vpc.vpcId,
    });
    this.node.defaultChild = this.resource;

    this.routerTargetId = this.resource.attrId;
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
  readonly routerTargetId: string;

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
    this.node.defaultChild = this.resource;

    this.routerTargetId = this.resource.attrInternetGatewayId;
    this.vpcId = props.vpc.vpcId;
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
  readonly routerTargetId: string;

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
      amazonSideAsn: props.amazonSideAsn,
    });
    this.node.defaultChild = this.resource;

    this.routerTargetId = this.resource.attrVpnGatewayId;
    this.vpcId = props.vpc.vpcId;
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
  readonly routerTargetId: string;

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

    this.connectivityType = props.connectivityType || NatConnectivityType.PUBLIC;
    this.maxDrainDuration = props.maxDrainDuration || Duration.seconds(350);

    // If user does not provide EIP, generate one for them
    var aId: string | undefined;
    if (this.connectivityType == 'public') {
      if (!props.allocationId) {
        let eip = new CfnEIP(this, 'EIP', {
          domain: props.vpc?.vpcId,
        });
        aId = eip.attrAllocationId;
      } else {
        aId = props.allocationId;
      }
    }

    this.resource = new CfnNatGateway(this, 'NATGateway', {
      subnetId: props.subnet.subnetId,
      allocationId: aId,
      maxDrainDurationSeconds: props.maxDrainDuration?.toSeconds(),
      secondaryAllocationIds: props.secondaryAllocationIds,
      ...props,
    });

    this.routerTargetId = this.resource.attrNatGatewayId;
    this.node.defaultChild = this.resource;
    this.node.addDependency(props.subnet.internetConnectivityEstablished);
  }
}

/**
 * The type of endpoint or gateway being targeted by the route.
 */
export interface RouteTargetProps {
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

  constructor(props: RouteTargetProps) {
    if (props.gateway && props.endpoint) {
      throw new Error('Cannot specify both gateway and endpoint');
    } else {
      this.gateway = props.gateway;
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
   * TODO: Look for strong IP type implementation here.
   */
  readonly destination: string;

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
  readonly destination: string;

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
  public readonly destination: string;

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
    if (!(this.target.endpoint instanceof GatewayVpcEndpoint)) {
      this.resource = new CfnRoute(this, 'Route', {
        routeTableId: this.routeTable.routeTableId,
        destinationCidrBlock: this.destination,
        destinationIpv6CidrBlock: this.destination,
        [routerTypeToPropName(this.targetRouterType)]: this.target.gateway ? this.target.gateway.routerTargetId :
          this.target.endpoint ? this.target.endpoint.vpcEndpointId : null,
      });
    }
    this.node.defaultChild = this.resource;

    if (this.targetRouterType == RouterType.GATEWAY) {
      if (this.target.gateway instanceof InternetGateway) {
        new CfnVPCGatewayAttachment(this, 'GWAttachment', {
          vpcId: this.target.gateway.vpcId,
          internetGatewayId: this.target.gateway.routerTargetId,
        });
      } else if (this.target.gateway instanceof VPNGateway) {
        new CfnVPCGatewayAttachment(this, 'GWAttachment', {
          vpcId: this.target.gateway.vpcId,
          vpnGatewayId: this.target.gateway.routerTargetId,
        });
      }
    }
  }
}

/**
 * Properties to define a route table.
 */
export interface RouteTableProps {
  /**
   * The ID of the VPC.
   */
  readonly vpc: IVpcV2;

  /**
   * The resource name of the route table.
   * @default none
   */
  readonly routeTableName?: string;
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
      vpcId: props.vpc.vpcId,
    });
    this.node.defaultChild = this.resource;

    this.routeTableId = this.resource.attrRouteTableId;
  }
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