import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnGatewayRoute } from './appmesh.generated';
import { GatewayRouteSpec } from './gateway-route-spec';
import { IVirtualGateway, VirtualGateway } from './virtual-gateway';

/**
 * Interface for which all GatewayRoute based classes MUST implement
 */
export interface IGatewayRoute extends cdk.IResource {
  /**
   * The name of the GatewayRoute
   *
   * @attribute
   */
  readonly gatewayRouteName: string,

  /**
   * The Amazon Resource Name (ARN) for the GatewayRoute
   *
   * @attribute
   */
  readonly gatewayRouteArn: string;

  /**
   * The VirtualGateway the GatewayRoute belongs to
   *
   * @attribute
   */
  readonly virtualGateway: IVirtualGateway;
}

/**
 * Basic configuration properties for a GatewayRoute
 */
export interface GatewayRouteBaseProps {
  /**
   * The name of the GatewayRoute
   *
   * @default - an automatically generated name
   */
  readonly gatewayRouteName?: string;

  /**
   * What protocol the route uses
   */
  readonly routeSpec: GatewayRouteSpec;
}

/**
 * Properties to define a new GatewayRoute
 */
export interface GatewayRouteProps extends GatewayRouteBaseProps {
  /**
   * The VirtualGateway this GatewayRoute is associated with
   */
  readonly virtualGateway: IVirtualGateway;
}

/**
 * GatewayRoute represents a new or existing gateway route attached to a VirtualGateway and Mesh
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/gateway-routes.html
 */
export class GatewayRoute extends cdk.Resource implements IGatewayRoute {
  /**
   * Import an existing GatewayRoute given an ARN
   */
  public static fromGatewayRouteArn(scope: Construct, id: string, gatewayRouteArn: string): IGatewayRoute {
    return new ImportedGatewayRoute(scope, id, { gatewayRouteArn });
  }

  /**
   * Import an existing GatewayRoute given its name
   */
  public static fromGatewayRouteName(
    scope: Construct, id: string, meshName: string, virtualGatewayName: string, gatewayRouteName: string): IGatewayRoute {
    const virtualGateway = VirtualGateway.fromVirtualGatewayName(scope, 'VirtualGateway', meshName, virtualGatewayName);
    return new ImportedGatewayRoute(scope, id, { meshName, virtualGateway, gatewayRouteName });
  }

  /**
   * The name of the GatewayRoute
   */
  public readonly gatewayRouteName: string;

  /**
   * The Amazon Resource Name (ARN) for the GatewayRoute
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
    const routeSpec = props.routeSpec.bind(this);

    const gatewayRoute = new CfnGatewayRoute(this, 'Resource', {
      gatewayRouteName: this.physicalName,
      meshName: props.virtualGateway.mesh.meshName,
      spec: {
        httpRoute: routeSpec.httpSpecConfig,
        http2Route: routeSpec.http2SpecConfig,
        grpcRoute: routeSpec.grpcSpecConfig,
      },
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
 * Interface with properties necessary to import a reusable GatewayRoute
 */
interface GatewayRouteAttributes {
  /**
   * The name of the GatewayRoute
   */
  readonly gatewayRouteName?: string;

  /**
   * The Amazon Resource Name (ARN) for the GatewayRoute
   */
  readonly gatewayRouteArn?: string;

  /**
   * The name of the mesh this GatewayRoute is associated with
   */
  readonly meshName?: string;

  /**
   * The name of the Virtual Gateway this GatewayRoute is associated with
   */
  readonly virtualGateway?: IVirtualGateway;
}

/**
 * Represents an imported IGatewayRoute
 */
class ImportedGatewayRoute extends cdk.Resource implements IGatewayRoute {
  /**
   * The name of the GatewayRoute
   */
  public gatewayRouteName: string;

  /**
   * The Amazon Resource Name (ARN) for the GatewayRoute
   */
  public gatewayRouteArn: string;

  /**
   * The VirtualGateway the GatewayRoute belongs to
   */
  public virtualGateway: IVirtualGateway;

  constructor(scope: Construct, id: string, props: GatewayRouteAttributes) {
    super(scope, id);
    if (props.gatewayRouteArn) {
      const meshName = cdk.Fn.select(0, cdk.Fn.split('/', cdk.Stack.of(scope).parseArn(props.gatewayRouteArn).resourceName!));
      const virtualGatewayName = cdk.Fn.select(2, cdk.Fn.split('/', cdk.Stack.of(scope).parseArn(props.gatewayRouteArn).resourceName!));

      this.gatewayRouteArn = props.gatewayRouteArn;
      this.gatewayRouteName = cdk.Fn.select(4, cdk.Fn.split('/', cdk.Stack.of(scope).parseArn(props.gatewayRouteArn).resourceName!));
      this.virtualGateway = VirtualGateway.fromVirtualGatewayName(this, 'virtualGateway', meshName, virtualGatewayName);
    } else if (props.gatewayRouteName && props.meshName && props.virtualGateway) {
      this.gatewayRouteName = props.gatewayRouteName;
      this.virtualGateway = props.virtualGateway;
      this.gatewayRouteArn = cdk.Stack.of(this).formatArn({
        service: 'appmesh',
        resource: `mesh/${props.meshName}/virtualGateway/${props.virtualGateway.virtualGatewayName}/gatewayRoute`,
        resourceName: this.gatewayRouteName,
      });
    } else {
      throw new Error('Need either arn or three names');
    }
  }
}
