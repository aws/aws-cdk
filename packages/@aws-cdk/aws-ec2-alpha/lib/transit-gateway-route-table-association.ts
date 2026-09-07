import { CfnTransitGatewayRouteTableAssociation } from 'aws-cdk-lib/aws-ec2';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { ITransitGatewayAssociation } from './transit-gateway-association';
import { TransitGatewayAssociationBase } from './transit-gateway-association';
import type { ITransitGatewayAttachment } from './transit-gateway-attachment';
import type { ITransitGatewayRouteTable } from './transit-gateway-route-table';

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
@propertyInjectable
export class TransitGatewayRouteTableAssociation extends TransitGatewayAssociationBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-ec2-alpha.TransitGatewayRouteTableAssociation';
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
