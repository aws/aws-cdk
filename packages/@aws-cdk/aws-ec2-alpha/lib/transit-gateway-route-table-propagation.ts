import { IResource, Resource } from 'aws-cdk-lib/core';
import { CfnTransitGatewayRouteTablePropagation } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { ITransitGatewayAttachment } from './transit-gateway-attachment';
import { ITransitGatewayRouteTable } from './transit-gateway-route-table';

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
 * A Transit Gateway Route Table Propagation.
 * @internal
 */
abstract class TransitGatewayRouteTablePropagationBase extends Resource implements ITransitGatewayRouteTablePropagation {
  /**
   * The ID of the transit gateway route table propagation.
   */
  public abstract readonly transitGatewayRouteTablePropagationId: string;
}

/**
 * Create a Transit Gateway Route Table Propagation.
 *
 * @resource AWS::EC2::TransitGatewayRouteTablePropagation
 */
export class TransitGatewayRouteTablePropagation extends TransitGatewayRouteTablePropagationBase {
  /**
   * The ID of the transit gateway route table propagation.
   */
  public readonly transitGatewayRouteTablePropagationId: string;

  /**
   * The AWS CloudFormation resource representing the Transit Gateway Route Table Propagation.
   */
  public readonly resource: CfnTransitGatewayRouteTablePropagation;

  constructor(scope: Construct, id: string, props: TransitGatewayRouteTablePropagationProps) {
    super(scope, id);

    this.resource = new CfnTransitGatewayRouteTablePropagation(this, id, {
      transitGatewayAttachmentId: props.transitGatewayVpcAttachment.transitGatewayAttachmentId,
      transitGatewayRouteTableId: props.transitGatewayRouteTable.routeTableId,
    });
    this.node.defaultChild = this.resource;

    this.transitGatewayRouteTablePropagationId = this.resource.ref;
  }
}
