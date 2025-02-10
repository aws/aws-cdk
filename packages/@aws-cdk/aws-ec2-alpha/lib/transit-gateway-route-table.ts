import { IResource, Resource } from 'aws-cdk-lib/core';
import { ITransitGateway } from './transit-gateway';
import { Construct } from 'constructs';
import { CfnTransitGatewayRouteTable, IRouteTable } from 'aws-cdk-lib/aws-ec2';
import { ITransitGatewayAttachment } from './transit-gateway-attachment';
import { TransitGatewayRoute, TransitGatewayBlackholeRoute, ITransitGatewayRoute } from './transit-gateway-route';
import { ITransitGatewayRouteTableAssociation, TransitGatewayRouteTableAssociation } from './transit-gateway-route-table-association';
import { ITransitGatewayRouteTablePropagation, TransitGatewayRouteTablePropagation } from './transit-gateway-route-table-propagation';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

/**
 * Represents a Transit Gateway Route Table.
 */
export interface ITransitGatewayRouteTable extends IResource, IRouteTable {
  /**
   * Add an active route to this route table.
   *
   * @returns ITransitGatewayRoute
   */
  addRoute(id: string, transitGatewayAttachment: ITransitGatewayAttachment, destinationCidr: string): ITransitGatewayRoute;

  /**
   * Add a blackhole route to this route table.
   *
   * @returns ITransitGatewayRoute
   */
  addBlackholeRoute(id: string, destinationCidr: string): ITransitGatewayRoute;

  /**
   * Associate the provided Attachments with this route table.
   *
   * @returns ITransitGatewayRouteTableAssociation
   */
  addAssociation(id: string, transitGatewayAttachment: ITransitGatewayAttachment): ITransitGatewayRouteTableAssociation;

  /**
   * Enable propagation from the provided Attachments to this route table.
   *
   * @returns ITransitGatewayRouteTablePropagation
   */
  enablePropagation(id: string, transitGatewayAttachment: ITransitGatewayAttachment): ITransitGatewayRouteTablePropagation;
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
abstract class TransitGatewayRouteTableBase extends Resource implements ITransitGatewayRouteTable {
  public abstract readonly routeTableId: string;
  public abstract readonly transitGateway: ITransitGateway;

  public addRoute(id: string, transitGatewayAttachment: ITransitGatewayAttachment, destinationCidr: string): ITransitGatewayRoute {
    return new TransitGatewayRoute(this, id, {
      transitGatewayRouteTable: this,
      transitGatewayAttachment,
      destinationCidrBlock: destinationCidr,
    });
  }

  public addBlackholeRoute(id: string, destinationCidr: string): ITransitGatewayRoute {
    return new TransitGatewayBlackholeRoute(this, id, {
      transitGatewayRouteTable: this,
      destinationCidrBlock: destinationCidr,
    });
  }

  public addAssociation(id: string, transitGatewayAttachment: ITransitGatewayAttachment): ITransitGatewayRouteTableAssociation {
    return new TransitGatewayRouteTableAssociation(this, id, {
      transitGatewayVpcAttachment: transitGatewayAttachment,
      transitGatewayRouteTable: this,
    });
  }

  public enablePropagation(id: string, transitGatewayAttachment: ITransitGatewayAttachment): ITransitGatewayRouteTablePropagation {
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

  constructor(scope: Construct, id: string, props: TransitGatewayRouteTableProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const resource = new CfnTransitGatewayRouteTable(this, id, {
      transitGatewayId: props.transitGateway.transitGatewayId,
    });

    this.node.defaultChild = resource;

    this.routeTableId = resource.attrTransitGatewayRouteTableId;
    this.transitGateway = props.transitGateway;
  }
}
