import { CfnRoute, CfnRouteTable, IRouteTable, RouterType, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { IIpAddresses, IpAddresses } from './vpc-v2';
import { Construct } from 'constructs';
import { Resource } from 'aws-cdk-lib/core';

export interface IRouter {
  readonly subnets: SubnetSelection[];
  readonly routerType: RouterType;
  readonly routerId: string;
}

// export interface RouterProps {
//   readonly subnets?: SubnetSelection[];
// }

// export class GatewayV2 extends Resource implements IRouter {
//   public readonly subnets: SubnetSelection[];
//   public readonly routerType: RouterType;
//   public readonly routerId: string;

//   constructor(scope: Construct, id: string, props: RouterProps) {
//     super(scope, id);

//     this.subnets = props.subnets ?? [];
//     this.routerType = RouterType.GATEWAY;
//   }
// }

export interface IRouteV2 {
  readonly destination: IIpAddresses;
  readonly target: IRouter;
  readonly routeTable: IRouteTable;
}

export class Route extends Resource implements IRouteV2 {
  public readonly destination: IIpAddresses;
  public readonly target: IRouter;
  // public readonly routeTableId: string;
  public readonly routeTable: IRouteTable;

  public readonly targetRouterType: RouterType

  public readonly resource: CfnRoute;

  constructor(scope: Construct, id: string, props: RouteProps) {
    super(scope, id);

    this.destination = props.destination ?? IpAddresses.ipv4('10.0.0.0/16');
    this.target = props.target;
    // this.routeTableId = props.routeTableId ?? '';
    this.routeTable = props.routeTable;

    this.targetRouterType = this.target.routerType;

    this.resource = new CfnRoute(this, 'Route', {
      routeTableId: this.routeTable.routeTableId,
      destinationCidrBlock: this.destination.allocateVpcCidr().ipv4CidrBlock,
      destinationIpv6CidrBlock: this.destination.allocateVpcCidr().ipv6CidrBlock,
      [routerTypeToPropName(this.targetRouterType)]: this.target.routerId,
    });

    // this.routeTable.addRoute(this.resource.ref);
  }

}

export interface RouteProps {
  readonly routeTable: IRouteTable;
  readonly destination: IIpAddresses;
  readonly target: IRouter;
}

export class RouteTable extends Resource implements IRouteTable {
  public readonly routeTableId: string;
  // public readonly routes: string[];

  public readonly resource: CfnRouteTable;

  constructor(scope: Construct, id: string, props: RouteTableProps) {
    super(scope, id);

    // this.routes = Array<string>();

    this.resource = new CfnRouteTable(this, 'RouteTable', {
      vpcId: props.vpcId,
    });

    this.routeTableId = this.resource.attrRouteTableId;
  }

  // function addRoute() {
  //   return;
  // }

  // function getRoute(routeId: string) {
  //   return;
  // }
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