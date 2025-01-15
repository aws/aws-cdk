import { IResource, Resource } from 'aws-cdk-lib/core';
import { CfnTransitGatewayRouteTablePropagation } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { ITransitGatewayAttachment } from './transit-gateway-attachment';
import { ITransitGatewayRouteTable } from './transit-gateway-route-table';

export interface ITransitGatewayRouteTablePropagation extends IResource {
  /**
    * The ID of the transit gateway route table propagation.
    * @attribute
    */
  readonly transitGatewayRouteTablePropagationId: string;
}

export interface TransitGatewayRouteTablePropagationProps {
  /**
    * The ID of the transit gateway route table propagation.
    */
  readonly transitGatewayAttachment: ITransitGatewayAttachment;

  /**
    * The ID of the transit gateway route table propagation.
    */
  readonly transitGatewayRouteTable: ITransitGatewayRouteTable;
}

abstract class TransitGatewayRouteTablePropagationBase extends Resource implements ITransitGatewayRouteTablePropagation {
  /**
    * The ID of the transit gateway route table propagation.
    */
  public abstract readonly transitGatewayRouteTablePropagationId: string;
}

export class TransitGatewayRouteTablePropagation extends TransitGatewayRouteTablePropagationBase {
  /**
    * The ID of the transit gateway route table propagation.
    */
  public readonly transitGatewayRouteTablePropagationId: string;

  constructor(scope: Construct, id: string, props: TransitGatewayRouteTablePropagationProps) {
    super(scope, id);

    const resource = new CfnTransitGatewayRouteTablePropagation(this, 'TransitGatewayRouteTablePropagation', {
      transitGatewayAttachmentId: props.transitGatewayAttachment.transitGatewayAttachmentId,
      transitGatewayRouteTableId: props.transitGatewayRouteTable.routeTableId,
    });

    this.transitGatewayRouteTablePropagationId = resource.ref;
  }
}
