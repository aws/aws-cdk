import { IResource, Resource } from 'aws-cdk-lib/core';
import { ITransitGatewayAttachment } from './transit-gateway-attachment';
import { ITransitGatewayRouteTable } from './transit-gateway-route-table';
import { CfnTransitGatewayRouteTableAssociation } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface ITransitGatewayRouteTableAssociation extends IResource {
  /**
     * The ID of the transit gateway route table association.
     */
  readonly transitGatewayRouteTableAssociationId: string;
}

export interface TransitGatewayRouteTableAssociationProps {
  /**
     * The ID of the transit gateway route table association.
     */
  readonly transitGatewayAttachment: ITransitGatewayAttachment;

  /**
     * The ID of the transit gateway route table association.
     */
  readonly transitGatewayRouteTable: ITransitGatewayRouteTable;
}

abstract class TransitGatewayRouteTableAssociationBase extends Resource implements ITransitGatewayRouteTableAssociation {
  /**
     * The ID of the transit gateway route table association.
     */
  public abstract readonly transitGatewayRouteTableAssociationId: string;
}

export class TransitGatewayRouteTableAssociation extends TransitGatewayRouteTableAssociationBase {
  /**
     * The ID of the transit gateway route table association.
     */
  public readonly transitGatewayRouteTableAssociationId: string;

  constructor(scope: Construct, id: string, props: TransitGatewayRouteTableAssociationProps) {
    super(scope, id);

    const resource = new CfnTransitGatewayRouteTableAssociation(this, 'TransitGatewayRouteTableAssociation', {
      transitGatewayAttachmentId: props.transitGatewayAttachment.transitGatewayAttachmentId,
      transitGatewayRouteTableId: props.transitGatewayRouteTable.routeTableId,
    });

    this.transitGatewayRouteTableAssociationId = resource.ref;
  }
}
