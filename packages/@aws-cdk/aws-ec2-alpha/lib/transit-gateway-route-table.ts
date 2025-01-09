import { IResource, Resource, Tag, TagManager } from 'aws-cdk-lib/core';
import { ITransitGateway } from './transit-gateway';
import { Construct } from 'constructs';
import { CfnTransitGatewayRouteTable } from 'aws-cdk-lib/aws-ec2';

export interface ITransitGatewayRouteTable extends IResource {
  /**
       * The ID of the transit gateway route table
       * @attribute
       */
  readonly transitGatewayRouteTableId: string;
}

export interface TransitGatewayRouteTableProps {
  /**
       * The ID of the transit gateway
       */
  readonly transitGateway: ITransitGateway;

  /**
     * The tags for the transit gateway route table.
     *
     * @default - none
     */
  readonly tags?: Tag[];
}

abstract class TransitGatewayRouteTableBase extends Resource implements ITransitGatewayRouteTable {

  public abstract readonly transitGatewayRouteTableId: string;

  addRoute(id: string, props: any): void {
    return;
  }

  addRoutes(id: string, props: any): void {
    return;
  }
}

/**
 * An AWS Transit Gateway route table
 *
 * @resource AWS::EC2::TransitGatewayRouteTable
 */
export class TransitGatewayRouteTable extends TransitGatewayRouteTableBase {
  public readonly transitGatewayRouteTableId: string;

  constructor(scope: Construct, id: string, props: TransitGatewayRouteTableProps) {
    super(scope, id);

    const resource = new CfnTransitGatewayRouteTable(this, id, {
      transitGatewayId: props.transitGateway.transitGatewayId,
      tags: props.tags,
    });

    this.transitGatewayRouteTableId = resource.ref;
  }
}