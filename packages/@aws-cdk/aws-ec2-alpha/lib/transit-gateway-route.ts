import { IResource, Resource } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { CfnTransitGatewayRoute } from 'aws-cdk-lib/aws-ec2';
import { ITransitGatewayRouteTable } from './transit-gateway-route-table';
import { ITransitGatewayAttachment } from './transit-gateway-attachment';

export interface ITransitGatewayRoute extends IResource {
  /**
     * The destination CIDR block for this route.
     */
  readonly destinationCidrBlock: string;

  /**
     * The transit gateway route table this route belongs to.
     */
  readonly routeTable: ITransitGatewayRouteTable;
}

export interface TransitGatewayActiveRouteProps {
  /**
    * The transit gateway attachment to route the traffic to.
    */
  readonly transitGatewayAttachment: ITransitGatewayAttachment;

  /**
    * The CIDR block used for destination matches.
    */
  readonly destinationCidrBlock: string;

  /**
    * The transit gateway route table you want to install this route into.
    */
  readonly transitGatewayRouteTable: ITransitGatewayRouteTable;
}

export interface TransitGatewayBlackholeRouteProps {
  /**
     * The CIDR block used for destination matches.
     */
  readonly destinationCidrBlock: string;

  /**
     * The transit gateway route table you want to install this route into.
     */
  readonly transitGatewayRouteTable: ITransitGatewayRouteTable;
}

abstract class TransitGatewayRouteBase extends Resource implements ITransitGatewayRoute {
  public abstract routeTable: ITransitGatewayRouteTable;
  public abstract destinationCidrBlock: string;
}

export class TransitGatewayActiveRoute extends TransitGatewayRouteBase {
  public readonly routeTable: ITransitGatewayRouteTable;
  public readonly destinationCidrBlock: string;

  constructor(scope: Construct, id: string, props: TransitGatewayActiveRouteProps) {
    super(scope, id);

    const resource = new CfnTransitGatewayRoute(this, 'TransitGatewayRoute', {
      blackhole: false,
      destinationCidrBlock: props.destinationCidrBlock,
      transitGatewayRouteTableId: props.transitGatewayRouteTable.routeTableId,
      transitGatewayAttachmentId: props.transitGatewayAttachment?.transitGatewayAttachmentId,
    });

    this.destinationCidrBlock = resource.destinationCidrBlock;
    this.routeTable = props.transitGatewayRouteTable;
  }
}

export class TransitGatewayBlackholeRoute extends TransitGatewayRouteBase {
  public readonly routeTable: ITransitGatewayRouteTable;
  public readonly destinationCidrBlock: string;

  constructor(scope: Construct, id: string, props: TransitGatewayBlackholeRouteProps) {
    super(scope, id);

    const resource = new CfnTransitGatewayRoute(this, 'TransitGatewayRoute', {
      blackhole: true,
      destinationCidrBlock: props.destinationCidrBlock,
      transitGatewayRouteTableId: props.transitGatewayRouteTable.routeTableId,
    });

    this.destinationCidrBlock = resource.destinationCidrBlock;
    this.routeTable = props.transitGatewayRouteTable;
  }
}
