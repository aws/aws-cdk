import { CfnCarrierGateway, CfnEgressOnlyInternetGateway, CfnInternetGateway, CfnNatGateway, CfnNetworkInterface, CfnRoute, CfnRouteTable, CfnTransitGateway, CfnVPCPeeringConnection, CfnVPNGateway, GatewayVpcEndpoint, IRouteTable, ISubnet, IVpcEndpoint, RouterType } from 'aws-cdk-lib/aws-ec2';
import { IIpAddresses } from './vpc-v2';
import { Construct } from 'constructs';
import { Resource } from 'aws-cdk-lib/core';

export interface IRouter {
  readonly routerType: RouterType;
  readonly routerId: string;
}

export interface CarrierGatewayProps {
  readonly vpcId: string;
}

export interface EgressOnlyInternetGatewayProps {
  readonly vpcId: string;
}

export interface InternetGatewayProps {

}

export interface VirtualPrivateGatewayProps {
  readonly type: string;
}

export interface NatGatewayProps {
  readonly subnet: ISubnet;
}

export interface NetworkInterfaceProps {
  readonly subnet: ISubnet;
}

export interface TransitGatewayProps {

}

export interface VpcPeeringConnectionProps {
  readonly vpcId: string;
  readonly peerVpcId: string;
}

export class CarrierGateway extends Resource implements IRouter {
  public readonly routerId: string;
  public readonly routerType: RouterType;

  public readonly resource: CfnCarrierGateway;

  constructor(scope: Construct, id: string, props: CarrierGatewayProps) {
    super(scope, id);

    this.routerType = RouterType.CARRIER_GATEWAY;

    this.resource = new CfnCarrierGateway(this, 'CarrierGateway', {
      vpcId: props.vpcId,
    });

    this.routerId = this.resource.attrCarrierGatewayId;
  }
}

export class EgressOnlyInternetGateway extends Resource implements IRouter {
  public readonly routerId: string;
  public readonly routerType: RouterType;

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

export class InternetGateway extends Resource implements IRouter {
  public readonly routerId: string;
  public readonly routerType: RouterType;

  public readonly resource: CfnInternetGateway;

  constructor(scope: Construct, id: string/*, props: InternetGatewayProps*/) {
    super(scope, id);

    this.routerType = RouterType.GATEWAY;

    this.resource = new CfnInternetGateway(this, 'IGW', {});

    this.routerId = this.resource.attrInternetGatewayId;
  }
}

export class VirtualPrivateGateway extends Resource implements IRouter {
  public readonly routerId: string;
  public readonly routerType: RouterType;

  public readonly resource: CfnVPNGateway;

  constructor(scope: Construct, id: string, props: VirtualPrivateGatewayProps) {
    super(scope, id);

    this.routerType = RouterType.GATEWAY;

    this.resource = new CfnVPNGateway(this, 'IGW', {
      type: props.type,
    });

    this.routerId = this.resource.attrVpnGatewayId;
  }
}

export class NatGateway extends Resource implements IRouter {
  public readonly routerId: string;
  public readonly routerType: RouterType;

  public readonly resource: CfnNatGateway;

  constructor(scope: Construct, id: string, props: NatGatewayProps) {
    super(scope, id);

    this.routerType = RouterType.NAT_GATEWAY;

    this.resource = new CfnNatGateway(this, 'NATGateway', {
      subnetId: props.subnet.subnetId,
    });

    this.routerId = this.resource.attrNatGatewayId;
    this.node.addDependency(props.subnet.internetConnectivityEstablished);
  }
}

export class NetworkInterface extends Resource implements IRouter {
  public readonly routerId: string;
  public readonly routerType: RouterType;

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

export class TransitGateway extends Resource implements IRouter {
  public readonly routerId: string;
  public readonly routerType: RouterType;

  public readonly resource: CfnTransitGateway;

  constructor(scope: Construct, id: string/*, props: TransitGatewayProps*/) {
    super(scope, id);

    this.routerType = RouterType.TRANSIT_GATEWAY;

    this.resource = new CfnTransitGateway(this, 'TGW', {});

    this.routerId = this.resource.attrId;
  }
}

export class VpcPeeringConnection extends Resource implements IRouter {
  public readonly routerId: string;
  public readonly routerType: RouterType;

  public readonly resource: CfnVPCPeeringConnection;

  constructor(scope: Construct, id: string, props: VpcPeeringConnectionProps) {
    super(scope, id);

    this.routerType = RouterType.VPC_PEERING_CONNECTION;

    this.resource = new CfnVPCPeeringConnection(this, 'VPCPeerConnection', {
      peerVpcId: props.peerVpcId,
      vpcId: props.vpcId,
    });

    this.routerId = this.resource.attrId;
  }
}

export interface IRouteV2 {
  readonly routeTable: IRouteTable;
  readonly destination: IIpAddresses;
  readonly target: IRouter | IVpcEndpoint;
}

export interface RouteProps {
  /**
   * The route table this route belongs to
   */
  readonly routeTable: IRouteTable;

  /**
   * The IP address used for the destination match
   */
  readonly destination: IIpAddresses;

  /**
   * The target gateway or endpoint of the route
   */
  readonly target: IRouter | IVpcEndpoint;
}

/**
 * Creates a new route with added functionality.
 * @resource AWS::EC2::Route
 */
export class Route extends Resource implements IRouteV2 {
  public readonly destination: IIpAddresses;
  public readonly target: IRouter | IVpcEndpoint;
  public readonly routeTable: IRouteTable;

  /**
   * The type of router the route is targetting
   */
  public readonly targetRouterType: RouterType

  public readonly resource?: CfnRoute;

  constructor(scope: Construct, id: string, props: RouteProps) {
    super(scope, id);

    this.destination = props.destination;
    this.target = props.target;
    this.routeTable = props.routeTable;

    this.targetRouterType = 'routerType' in this.target ? this.target.routerType : RouterType.VPC_ENDPOINT;

    // Gateway generates route automatically via its RouteTable, thus we don't need to generate the resource for it
    if (!(this.target instanceof GatewayVpcEndpoint)) {
      this.resource = new CfnRoute(this, 'Route', {
        routeTableId: this.routeTable.routeTableId,
        destinationCidrBlock: this.destination.allocateVpcCidr().ipv4CidrBlock,
        destinationIpv6CidrBlock: this.destination.allocateVpcCidr().ipv6CidrBlock,
        [routerTypeToPropName(this.targetRouterType)]: 'routerId' in this.target ? this.target.routerId : this.target.vpcEndpointId,
      });
    }
  }

}

export class RouteTable extends Resource implements IRouteTable {
  public readonly routeTableId: string;

  public readonly resource: CfnRouteTable;

  constructor(scope: Construct, id: string, props: RouteTableProps) {
    super(scope, id);

    this.resource = new CfnRouteTable(this, 'RouteTable', {
      vpcId: props.vpcId,
    });

    this.routeTableId = this.resource.attrRouteTableId;
  }
}

export interface RouteTableProps {
  readonly vpcId: string;
  // readonly routes?: IRouteV2[];
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