import { IResource, Resource } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { CfnTransitGatewayRoute } from 'aws-cdk-lib/aws-ec2';
import { ITransitGatewayRouteTable } from './transit-gateway-route-table';
import { ITransitGatewayAttachment } from './transit-gateway-attachment';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

/**
 * Represents a Transit Gateway Route.
 */
export interface ITransitGatewayRoute extends IResource {
  /**
   * The destination CIDR block for this route.
   *
   * Destination Cidr cannot overlap for static routes but is allowed for propagated routes.
   * When overlapping occurs, static routes take precedence over propagated routes.
   */
  readonly destinationCidrBlock: string;

  /**
   * The transit gateway route table this route belongs to.
   */
  readonly routeTable: ITransitGatewayRouteTable;
}

/**
 * Common properties for a Transit Gateway Route.
 */
export interface BaseTransitGatewayRouteProps {
  /**
   * The destination CIDR block for this route.
   *
   * Destination Cidr cannot overlap for static routes but is allowed for propagated routes.
   * When overlapping occurs, static routes take precedence over propagated routes.
   */
  readonly destinationCidrBlock: string;

  /**
   * The transit gateway route table you want to install this route into.
   */
  readonly transitGatewayRouteTable: ITransitGatewayRouteTable;

  /**
   * Physical name of this Transit Gateway Route.
   *
   * @default - Assigned by CloudFormation.
   */
  readonly transitGatewayRouteName?: string;
}

/**
 * Common properties for a Transit Gateway Route.
 */
export interface TransitGatewayRouteProps extends BaseTransitGatewayRouteProps {
  /**
   * The transit gateway attachment to route the traffic to.
   */
  readonly transitGatewayAttachment: ITransitGatewayAttachment;
}

/**
 * Properties for a Transit Gateway Blackhole Route.
 */
export interface TransitGatewayBlackholeRouteProps extends BaseTransitGatewayRouteProps {}

/**
 * A Transit Gateway Route.
 * @internal
 */
abstract class TransitGatewayRouteBase extends Resource implements ITransitGatewayRoute {
  public abstract routeTable: ITransitGatewayRouteTable;
  public abstract destinationCidrBlock: string;
}

/**
 * Create a Transit Gateway Active Route.
 *
 * @resource AWS::EC2::TransitGatewayRoute
 */
export class TransitGatewayRoute extends TransitGatewayRouteBase {
  public readonly routeTable: ITransitGatewayRouteTable;
  public readonly destinationCidrBlock: string;

  /**
   * The AWS CloudFormation resource representing the Transit Gateway Route.
   */
  public readonly resource: CfnTransitGatewayRoute;

  constructor(scope: Construct, id: string, props: TransitGatewayRouteProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.resource = new CfnTransitGatewayRoute(this, 'TransitGatewayRoute', {
      blackhole: false,
      destinationCidrBlock: props.destinationCidrBlock,
      transitGatewayRouteTableId: props.transitGatewayRouteTable.routeTableId,
      transitGatewayAttachmentId: props.transitGatewayAttachment?.transitGatewayAttachmentId,
    });

    this.node.defaultChild = this.resource;
    this.destinationCidrBlock = this.resource.destinationCidrBlock;
    this.routeTable = props.transitGatewayRouteTable;
  }
}

/**
 * Create a Transit Gateway Blackhole Route.
 *
 * @resource AWS::EC2::TransitGatewayRoute
 */
export class TransitGatewayBlackholeRoute extends TransitGatewayRouteBase {
  public readonly routeTable: ITransitGatewayRouteTable;
  public readonly destinationCidrBlock: string;

  constructor(scope: Construct, id: string, props: TransitGatewayBlackholeRouteProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const resource = new CfnTransitGatewayRoute(this, id, {
      blackhole: true,
      destinationCidrBlock: props.destinationCidrBlock,
      transitGatewayRouteTableId: props.transitGatewayRouteTable.routeTableId,
    });

    this.node.defaultChild = resource;
    this.destinationCidrBlock = resource.destinationCidrBlock;
    this.routeTable = props.transitGatewayRouteTable;
  }
}
