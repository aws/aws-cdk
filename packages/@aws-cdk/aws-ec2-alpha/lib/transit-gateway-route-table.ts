import { IResource, Resource } from 'aws-cdk-lib/core';
import { ITransitGateway } from './transit-gateway';
import { Construct } from 'constructs';
import { CfnTransitGatewayRouteTable, IRouteTable } from 'aws-cdk-lib/aws-ec2';
import { ITransitGatewayAttachment } from './transit-gateway-attachment';
import { TransitGatewayActiveRoute, TransitGatewayBlackholeRoute } from './transit-gateway-route';
import { TransitGatewayRouteTableAssociation } from './transit-gateway-route-table-association';
import { TransitGatewayRouteTablePropagation } from './transit-gateway-route-table-propagation';

export interface ITransitGatewayRouteTable extends IResource {
  /**
   * The ID of the transit gateway route table
   * @attribute
   */
  readonly routeTableId: string;
}

export interface TransitGatewayRouteTableProps {
  /**
   * The ID of the transit gateway
   */
  readonly transitGateway: ITransitGateway;
}

abstract class TransitGatewayRouteTableBase extends Resource implements ITransitGatewayRouteTable, IRouteTable {
  public abstract readonly routeTableId: string;
  public abstract readonly transitGateway: ITransitGateway;

  addRoute(id: string, transitGatewayAttachment: ITransitGatewayAttachment, destinationCidr: string): TransitGatewayActiveRoute {
    return new TransitGatewayActiveRoute(this, id, {
      transitGatewayRouteTable: this,
      transitGatewayAttachment,
      destinationCidrBlock: destinationCidr,
    });
  };

  addBlackholeRoute(id: string, destinationCidr: string): TransitGatewayBlackholeRoute {
    return new TransitGatewayBlackholeRoute(this, id, {
      transitGatewayRouteTable: this,
      destinationCidrBlock: destinationCidr,
    });
  }

  addAssociation(id: string, transitGatewayAttachment: ITransitGatewayAttachment): TransitGatewayRouteTableAssociation {
    return new TransitGatewayRouteTableAssociation(this, id, {
      transitGatewayAttachment: transitGatewayAttachment,
      transitGatewayRouteTable: this,
    });
  }

  enablePropagation(id: string, transitGatewayAttachment: ITransitGatewayAttachment): TransitGatewayRouteTablePropagation {
    return new TransitGatewayRouteTablePropagation(this, id, {
      transitGatewayAttachment: transitGatewayAttachment,
      transitGatewayRouteTable: this,
    });
  }
}

/**
 * An AWS Transit Gateway route table
 *
 * @resource AWS::EC2::TransitGatewayRouteTable
 */
export class TransitGatewayRouteTable extends TransitGatewayRouteTableBase {
  public readonly routeTableId: string;
  public readonly transitGateway: ITransitGateway;

  constructor(scope: Construct, id: string, props: TransitGatewayRouteTableProps) {
    super(scope, id);

    const resource = new CfnTransitGatewayRouteTable(this, id, {
      transitGatewayId: props.transitGateway.transitGatewayId,
    });

    this.routeTableId = resource.ref;
    this.transitGateway = props.transitGateway;
  }
}
