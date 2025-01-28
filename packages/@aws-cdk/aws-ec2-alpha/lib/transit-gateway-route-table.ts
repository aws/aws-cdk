import { IResource, Resource } from 'aws-cdk-lib/core';
import { ITransitGateway } from './transit-gateway';
import { Construct } from 'constructs';
import { CfnTransitGatewayRouteTable, IRouteTable } from 'aws-cdk-lib/aws-ec2';
import { ITransitGatewayAttachment } from './transit-gateway-attachment';
import { TransitGatewayRoute, TransitGatewayBlackholeRoute } from './transit-gateway-route';
import { TransitGatewayRouteTableAssociation } from './transit-gateway-route-table-association';
import { TransitGatewayRouteTablePropagation } from './transit-gateway-route-table-propagation';

/**
 * Represents a Transit Gateway Route Table
 */
export interface ITransitGatewayRouteTable extends IResource {
  /**
   * The ID of the transit gateway route table
   * @attribute
   */
  readonly routeTableId: string;

  /**
   * Add an active route to this route table
   *
   * @returns TransitGatewayRoute
   */
  addRoute(id: string, transitGatewayAttachment: ITransitGatewayAttachment, destinationCidr: string): TransitGatewayRoute;

  /**
   * Add a blackhole route to this route table
   *
   * @returns TransitGatewayBlackholeRoute
   */
  addBlackholeRoute(id: string, destinationCidr: string): TransitGatewayBlackholeRoute;

  /**
   * Add an Association to this route table
   *
   * @returns TransitGatewayRouteTableAssociation
   */
  addAssociation(id: string, transitGatewayAttachment: ITransitGatewayAttachment): TransitGatewayRouteTableAssociation;

  /**
   * Enable propagation from an Attachment
   *
   * @returns TransitGatewayRouteTablePropagation
   */
  enablePropagation(id: string, transitGatewayAttachment: ITransitGatewayAttachment): TransitGatewayRouteTablePropagation;
}

/**
 * Common properties for creating a Transit Gateway Route Table resource.
 */
export interface TransitGatewayRouteTableProps {
  /**
   * The Transit Gateway that this route table belongs to.
   */
  readonly transitGateway: ITransitGateway;

  /**
   * Physical name of this Transit Gateway Route Table.
   *
   * @default - Assigned by CloudFormation.
   */
  readonly transitGatewayRouteTableName?: string;
}

/**
 * A Transit Gateway Route Table.
 * @internal
 */
abstract class TransitGatewayRouteTableBase extends Resource implements ITransitGatewayRouteTable, IRouteTable {
  public abstract readonly routeTableId: string;
  public abstract readonly transitGateway: ITransitGateway;

  addRoute(id: string, transitGatewayAttachment: ITransitGatewayAttachment, destinationCidr: string): TransitGatewayRoute {
    return new TransitGatewayRoute(this, id, {
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
      transitGatewayVpcAttachment: transitGatewayAttachment,
      transitGatewayRouteTable: this,
    });
  }

  enablePropagation(id: string, transitGatewayAttachment: ITransitGatewayAttachment): TransitGatewayRouteTablePropagation {
    return new TransitGatewayRouteTablePropagation(this, id, {
      transitGatewayVpcAttachment: transitGatewayAttachment,
      transitGatewayRouteTable: this,
    });
  }
}

/**
 * Creates a Transit Gateway route table.
 *
 * @resource AWS::EC2::TransitGatewayRouteTable
 */
export class TransitGatewayRouteTable extends TransitGatewayRouteTableBase {
  public readonly routeTableId: string;
  /**
   * The Transit Gateway.
   */
  public readonly transitGateway: ITransitGateway;

  /**
   * The AWS CloudFormation resource representing the Transit Gateway Route Table.
   */
  public readonly resource: CfnTransitGatewayRouteTable;

  constructor(scope: Construct, id: string, props: TransitGatewayRouteTableProps) {
    super(scope, id);

    this.resource = new CfnTransitGatewayRouteTable(this, id, {
      transitGatewayId: props.transitGateway.transitGatewayId,
    });

    this.node.defaultChild = this.resource;

    this.routeTableId = this.resource.attrTransitGatewayRouteTableId;
    this.transitGateway = props.transitGateway;
  }
}
