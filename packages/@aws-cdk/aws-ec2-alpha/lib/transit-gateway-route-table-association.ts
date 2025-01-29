import { IResource, Resource } from 'aws-cdk-lib/core';
import { ITransitGatewayAttachment } from './transit-gateway-attachment';
import { ITransitGatewayRouteTable } from './transit-gateway-route-table';
import { CfnTransitGatewayRouteTableAssociation } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

/**
 * Represents a Transit Gateway Route Table Association.
 */
export interface ITransitGatewayRouteTableAssociation extends IResource {
  /**
   * The ID of the transit gateway route table association.
   * @attribute
   */
  readonly transitGatewayRouteTableAssociationId: string;
}

/**
 * Common properties for a Transit Gateway Route Table Association.
 */
export interface TransitGatewayRouteTableAssociationProps {
  /**
   * The ID of the transit gateway route table association.
   */
  readonly transitGatewayVpcAttachment: ITransitGatewayAttachment;

  /**
   * The ID of the transit gateway route table association.
   */
  readonly transitGatewayRouteTable: ITransitGatewayRouteTable;

  /**
   * Physical name of this association.
   *
   * @default - Assigned by CloudFormation.
   */
  readonly transitGatewayRouteTableAssociationName?: string;
}

/**
 * A Transit Gateway Route Table Association.
 * @internal
 */
abstract class TransitGatewayRouteTableAssociationBase extends Resource implements ITransitGatewayRouteTableAssociation {
  /**
   * The ID of the transit gateway route table association.
   */
  public abstract readonly transitGatewayRouteTableAssociationId: string;
}

/**
 * Create a Transit Gateway Route Table Association.
 *
 * @resource AWS::EC2::TransitGatewayRouteTableAssociation
 */
export class TransitGatewayRouteTableAssociation extends TransitGatewayRouteTableAssociationBase {
  /**
   * The ID of the transit gateway route table association.
   */
  public readonly transitGatewayRouteTableAssociationId: string;

  /**
   * The AWS CloudFormation resource representing the Transit Gateway Route Table Association.
   */
  public readonly resource: CfnTransitGatewayRouteTableAssociation;

  constructor(scope: Construct, id: string, props: TransitGatewayRouteTableAssociationProps) {
    super(scope, id);

    this.resource = new CfnTransitGatewayRouteTableAssociation(this, id, {
      transitGatewayAttachmentId: props.transitGatewayVpcAttachment.transitGatewayAttachmentId,
      transitGatewayRouteTableId: props.transitGatewayRouteTable.routeTableId,
    });
    this.node.defaultChild = this.resource;

    this.transitGatewayRouteTableAssociationId = this.resource.ref;
  }
}
