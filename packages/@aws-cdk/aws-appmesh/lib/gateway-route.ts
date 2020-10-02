import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnGatewayRoute } from './appmesh.generated';
import { IVirtualGateway } from './virtual-gateway';

/**
 * Interface for which all Gateway Route based classes MUST implement
 */
export interface IGatewayRoute extends cdk.IResource {
  /**
   * The name of the Gateway Route
   *
   * @attribute
   */
  readonly gatewayRouteName: string,

  /**
   * The Amazon Resource Name (ARN) for the Gateway Route
   *
   * @attribute
   */
  readonly gatewayRouteArn: string;
}

/**
 * Base interface properties for all Gateway Routes
 */
export interface GatewayRouteBaseProps {
  /**
   * The name of the Gateway Route
   *
   * @default - an automatically generated name
   */
  readonly gatewayRouteName?: string;
}

/**
 * Properties to define new Gateway Routes
 */
export interface GatewayRouteProps extends GatewayRouteBaseProps {
  /**
   * The Virtual Gateway this Gateway Route is associated with
   */
  readonly virtualGateway: IVirtualGateway;
}

/**
 * Gateway Route represents a new or existing gateway route attached to a VirtualGateway and Mesh
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/gateway-routes.html
 */
export class GatewayRoute extends cdk.Resource implements IGatewayRoute {
  /**
   * Import an existing Gateway Route given an ARN
   */
  public static fromGatewayRouteArn(scope: Construct, id: string, gatewayRouteArn: string): IGatewayRoute {
    return new ImportedGatewayRoute(scope, id, { gatewayRouteArn });
  }

  /**
   * Import an existing Gateway Route given its name
   */
  public static fromGatewayRouteName(
    scope: Construct, id: string, meshName: string, virtualGatewayName: string, gatewayRouteName: string): IGatewayRoute {
    return new ImportedGatewayRoute(scope, id, { meshName, virtualGatewayName, gatewayRouteName });
  }

  /**
   * The name of the Gateway Route
   */
  public readonly gatewayRouteName: string;

  /**
   * The Amazon Resource Name (ARN) for the Gateway Route
   */
  public readonly gatewayRouteArn: string;

  /**
   * The VirtualGateway this GatewayRoute is a part of
   */
  public readonly virtualGateway: IVirtualGateway;

  constructor(scope: Construct, id: string, props: GatewayRouteProps) {
    super(scope, id, {
      physicalName: props.gatewayRouteName || cdk.Lazy.stringValue({ produce: () => this.node.uniqueId }),
    });

    this.virtualGateway = props.virtualGateway;

    const gatewayRoute = new CfnGatewayRoute(this, 'Resource', {
      gatewayRouteName: this.physicalName,
      meshName: props.virtualGateway.mesh.meshName,
      spec: {},
      virtualGatewayName: this.virtualGateway.virtualGatewayName,
    });

    this.gatewayRouteName = this.getResourceNameAttribute(gatewayRoute.attrGatewayRouteName);
    this.gatewayRouteArn = this.getResourceArnAttribute(gatewayRoute.ref, {
      service: 'appmesh',
      resource: `mesh/${props.virtualGateway.mesh.meshName}/virtualRouter/${this.virtualGateway.virtualGatewayName}/gatewayRoute`,
      resourceName: this.physicalName,
    });
  }
}

/**
 * Interface with properties necessary to import a reusable Gateway Route
 */
interface GatewayRouteAttributes {
  /**
   * The name of the Gateway Route
   */
  readonly gatewayRouteName?: string;

  /**
   * The Amazon Resource Name (ARN) for the Gateway Route
   */
  readonly gatewayRouteArn?: string;

  /**
   * The name of the mesh this Gateway Route is associated with
   */
  readonly meshName?: string;

  /**
   * The name of the Virtual Gateway this Gateway Route is associated with
   */
  readonly virtualGatewayName?: string;
}

/**
 * Represents an imported IGatewayRoute
 */
class ImportedGatewayRoute extends cdk.Resource implements IGatewayRoute {
  /**
   * The name of the Gateway Route
   */
  public gatewayRouteName: string;

  /**
   * The Amazon Resource Name (ARN) for the Gateway Route
   */
  public gatewayRouteArn: string;

  constructor(scope: Construct, id: string, props: GatewayRouteAttributes) {
    super(scope, id);
    if (props.gatewayRouteArn) {
      this.gatewayRouteArn = props.gatewayRouteArn;
      this.gatewayRouteName = cdk.Fn.select(4, cdk.Fn.split('/', cdk.Stack.of(scope).parseArn(props.gatewayRouteArn).resourceName!));
    } else if (props.gatewayRouteName && props.meshName && props.virtualGatewayName) {
      this.gatewayRouteName = props.gatewayRouteName;
      this.gatewayRouteArn = cdk.Stack.of(this).formatArn({
        service: 'appmesh',
        resource: `mesh/${props.meshName}/virtualGateway/${props.virtualGatewayName}/gatewayRoute`,
        resourceName: this.gatewayRouteName,
      });
    } else {
      throw new Error('Need either arn or three names');
    }
  }
}
