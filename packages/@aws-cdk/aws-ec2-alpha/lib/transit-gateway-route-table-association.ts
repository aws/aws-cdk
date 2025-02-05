import { ITransitGatewayAttachment } from './transit-gateway-attachment';
import { ITransitGatewayRouteTable } from './transit-gateway-route-table';
import { CfnTransitGatewayRouteTableAssociation } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { ITransitGatewayAssociation, TransitGatewayAssociationBase } from './transit-gateway-association';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

/**
 * Represents a Transit Gateway Route Table Association.
 */
export interface ITransitGatewayRouteTableAssociation extends ITransitGatewayAssociation {}

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
 * Create a Transit Gateway Route Table Association.
 *
 * @resource AWS::EC2::TransitGatewayRouteTableAssociation
 */
export class TransitGatewayRouteTableAssociation extends TransitGatewayAssociationBase {
  /**
   * The ID of the transit gateway route table association.
   */
  public readonly transitGatewayAssociationId: string;

  constructor(scope: Construct, id: string, props: TransitGatewayRouteTableAssociationProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const resource = new CfnTransitGatewayRouteTableAssociation(this, id, {
      transitGatewayAttachmentId: props.transitGatewayVpcAttachment.transitGatewayAttachmentId,
      transitGatewayRouteTableId: props.transitGatewayRouteTable.routeTableId,
    });
    this.node.defaultChild = resource;

    this.transitGatewayAssociationId = resource.ref;
  }
}
