import { IResource, Resource, Tag, TagManager } from 'aws-cdk-lib/core';
import { ITransitGateway } from './transit-gateway';
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
  readonly transitGatewayRouteTable: ITransitGatewayRouteTable;
}

export interface TransitGatewayRouteProps {
  /**
     * The transit gateway attachment to route the traffic to.
     *
     * @default - if no attachment is specified, the traffic matching the destination CIDR will be dropped (blackhole).
     */
  readonly transitGatewayAttachment?: ITransitGatewayAttachment;

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
  public abstract destinationCidrBlock: string;
  public abstract transitGatewayRouteTable: ITransitGatewayRouteTable;
}

export class TransitGatewayRoute extends TransitGatewayRouteBase {
  public transitGatewayRouteTable: ITransitGatewayRouteTable;
  public readonly destinationCidrBlock: string;
  public readonly routeTableId: string;

  constructor(scope: Construct, id: string, props: TransitGatewayRouteProps) {
    super(scope, id);

    const resource = new CfnTransitGatewayRoute(this, 'TransitGatewayRoute', {
      destinationCidrBlock: props.destinationCidrBlock,
      transitGatewayRouteTableId: props.transitGatewayRouteTable.transitGatewayRouteTableId,
      blackhole: props.transitGatewayAttachment?.transitGatewayAttachmentId ? false : true,
      transitGatewayAttachmentId: props.transitGatewayAttachment?.transitGatewayAttachmentId,
    });

    this.destinationCidrBlock = resource.destinationCidrBlock;
    this.routeTableId = resource.transitGatewayRouteTableId;
  }
}