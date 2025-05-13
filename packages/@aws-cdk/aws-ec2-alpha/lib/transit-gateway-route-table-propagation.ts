import { IResource, Resource } from 'aws-cdk-lib/core';
import { CfnTransitGatewayRouteTablePropagation } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { ITransitGatewayAttachment } from './transit-gateway-attachment';
import { ITransitGatewayRouteTable } from './transit-gateway-route-table';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';

/**
 * Represents a Transit Gateway Route Table Propagation.
 */
export interface ITransitGatewayRouteTablePropagation extends IResource {
  /**
   * The ID of the transit gateway route table propagation.
   * @attribute
   */
  readonly transitGatewayRouteTablePropagationId: string;
}

/**
 * Common properties for a Transit Gateway Route Table Propagation.
 */
export interface TransitGatewayRouteTablePropagationProps {
  /**
   * The ID of the transit gateway route table propagation.
   */
  readonly transitGatewayVpcAttachment: ITransitGatewayAttachment;

  /**
   * The ID of the transit gateway route table propagation.
   */
  readonly transitGatewayRouteTable: ITransitGatewayRouteTable;

  /**
   * Physical name of this propagation.
   *
   * @default - Assigned by CloudFormation.
   */
  readonly transitGatewayRouteTablePropagationName?: string;
}

/**
 * Create a Transit Gateway Route Table Propagation.
 *
 * @resource AWS::EC2::TransitGatewayRouteTablePropagation
 */
@propertyInjectable
export class TransitGatewayRouteTablePropagation extends Resource implements ITransitGatewayRouteTablePropagation {
  /**
   * The ID of the transit gateway route table propagation.
   */
  public readonly transitGatewayRouteTablePropagationId: string;

  constructor(scope: Construct, id: string, props: TransitGatewayRouteTablePropagationProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const resource = new CfnTransitGatewayRouteTablePropagation(this, id, {
      transitGatewayAttachmentId: props.transitGatewayVpcAttachment.transitGatewayAttachmentId,
      transitGatewayRouteTableId: props.transitGatewayRouteTable.routeTableId,
    });
    this.node.defaultChild = resource;

    this.transitGatewayRouteTablePropagationId = resource.ref;
  }

  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-ec2-alpha.TransitGatewayRouteTablePropagation';
}
