import { CfnCarrierGateway, CfnEIP, CfnEgressOnlyInternetGateway, CfnInternetGateway, CfnNatGateway, CfnNetworkInterface, CfnRoute, CfnRouteTable, CfnTransitGateway, CfnVPCGatewayAttachment, CfnVPCPeeringConnection, CfnVPNGateway, GatewayVpcEndpoint, IRouteTable, ISubnet, IVpcEndpoint, RouterType } from 'aws-cdk-lib/aws-ec2';
import { IIpAddresses } from './vpc-v2';
import { Construct, IDependable } from 'constructs';
import { Resource } from 'aws-cdk-lib/core';

export interface IRouteTarget {
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
  readonly vpcId: string;
}

export interface VPNGatewayProps {
  readonly type: string;
  readonly vpcId: string;
  readonly amazonSideAsn?: number;
}

export interface NatGatewayProps {
  readonly subnet: ISubnet;
  readonly vpcId?: string;
  readonly allocationId?: string;
  readonly connectivityType?: string;
  readonly maxDrainDurationSeconds?: number;
  readonly privateIpAddress?: string;
  readonly secondaryAllocationIds?: string[];
  readonly secondaryPrivateIpAddressCount?: number;
  readonly secondaryPrivateIpAddresses?: string[];
}

export interface NetworkInterfaceProps {
  readonly subnet: ISubnet;
}

export interface TransitGatewayProps {

}

export interface VpcPeeringConnectionProps {
  readonly vpcId: string;
  readonly peerVpcId: string;
  readonly peerRoleArn: string;
}

export class CarrierGateway extends Resource implements IRouteTarget {
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

export class EgressOnlyInternetGateway extends Resource implements IRouteTarget {
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

export class InternetGateway extends Resource implements IRouteTarget {
  public readonly routerId: string;
  public readonly routerType: RouterType;
  public readonly vpcId: string;

  public readonly resource: CfnInternetGateway;

  constructor(scope: Construct, id: string, props: InternetGatewayProps) {
    super(scope, id);

    this.routerType = RouterType.GATEWAY;

    this.resource = new CfnInternetGateway(this, 'IGW', {});

    this.routerId = this.resource.attrInternetGatewayId;
    this.vpcId = props.vpcId;
  }
}

export class VPNGateway extends Resource implements IRouteTarget {
  public readonly routerId: string;
  public readonly routerType: RouterType;
  public readonly vpcId: string;

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

export class NatGateway extends Resource implements IRouteTarget {
  public readonly routerId: string;
  public readonly routerType: RouterType;
  public readonly allocationId?: string;
  public readonly connectivityType?: string;
  public readonly maxDrainDurationSeconds?: number;

  public readonly resource: CfnNatGateway;

  constructor(scope: Construct, id: string, props: NatGatewayProps) {
    super(scope, id);

    this.routerType = RouterType.NAT_GATEWAY;

    this.connectivityType = props.connectivityType || 'public';
    this.maxDrainDurationSeconds = props.maxDrainDurationSeconds || 350;
    
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
      ...props
    });

    this.routerId = this.resource.attrNatGatewayId;

    this.node.addDependency(props.subnet.internetConnectivityEstablished);
  }
}

export class NetworkInterface extends Resource implements IRouteTarget {
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

export class TransitGateway extends Resource implements IRouteTarget {
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

export class VpcPeeringConnection extends Resource implements IRouteTarget {
  public readonly routerId: string;
  public readonly routerType: RouterType;
  public readonly peerRoleArn: string;

  public readonly resource: CfnVPCPeeringConnection;

  constructor(scope: Construct, id: string, props: VpcPeeringConnectionProps) {
    super(scope, id);

    this.routerType = RouterType.VPC_PEERING_CONNECTION;

    this.resource = new CfnVPCPeeringConnection(this, 'VPCPeerConnection', {
      peerVpcId: props.peerVpcId,
      vpcId: props.vpcId,
      peerRoleArn: props.peerRoleArn,
    });

    this.routerId = this.resource.attrId;
    this.peerRoleArn = props.peerRoleArn;
  }
}

export interface IRouteV2 {
  readonly routeTable: IRouteTable;
  readonly destination: IIpAddresses;
  readonly target: IRouteTarget | IVpcEndpoint;
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
  readonly target: IRouteTarget | IVpcEndpoint;
}

/**
 * Creates a new route with added functionality.
 * @resource AWS::EC2::Route
 */
export class Route extends Resource implements IRouteV2 {
  public readonly destination: IIpAddresses;
  public readonly target: IRouteTarget | IVpcEndpoint;
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
        })
      }
    }
  }
}

export class RouteTable extends Resource implements IRouteTable, IDependable {
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