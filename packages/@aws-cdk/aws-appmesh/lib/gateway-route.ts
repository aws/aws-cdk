import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnGatewayRoute } from './appmesh.generated';
import { Protocol } from './shared-interfaces';
import { IVirtualGateway, VirtualGateway } from './virtual-gateway';
import { IVirtualService } from './virtual-service';

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
 * The criterion for determining a request match for this GatewayRoute
 */
export interface HttpGatewayRouteMatch {
  /**
   * Specifies the path to match requests with.
   * This parameter must always start with /, which by itself matches all requests to the virtual service name.
   * You can also match for path-based routing of requests. For example, if your virtual service name is my-service.local
   * and you want the route to match requests to my-service.local/metrics, your prefix should be /metrics.
   *
   */
  readonly prefixPath: string;
}

/**
 * The criterion for determining a request match for this GatewayRoute
 */
export interface GrpcGatewayRouteMatch {
  /**
   * The fully qualified domain name for the service to match from the request
   */
  readonly serviceName: string;
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
 * Properties specific for HTTP Based GatewayRoutes
 */
export interface HttpRouteSpecProps {
  /**
   * The criterion for determining a request match for this GatewayRoute
   *
   * @default - matches on '/'
   */
  readonly match?: HttpGatewayRouteMatch;
  /**
   * The VirtualService this GatewayRoute directs traffic to
   */
  readonly routeTarget: IVirtualService;
}

/**
 * Properties specific for a GRPC GatewayRoute
 */
export interface GrpcRouteSpecProps {
  /**
   * The criterion for determining a request match for this GatewayRoute
   */
  readonly match: GrpcGatewayRouteMatch;
  /**
   * The VirtualService this GatewayRoute directs traffic to
   */
  readonly routeTarget: IVirtualService;
}

/**
 * All Properties for GatewayRoute Specs
 */
export interface GatewayRouteSpecConfig {
  /**
   * The spec for an http gateway route
   *
   * @default - no http spec
   */
  readonly httpSpecConfig?: CfnGatewayRoute.HttpGatewayRouteProperty;
  /**
   * The spec for an http2 gateway route
   *
   * @default - no http2 spec
   */
  readonly http2SpecConfig?: CfnGatewayRoute.HttpGatewayRouteProperty;
  /**
   * The spec for a grpc gateway route
   *
   * @default - no grpc spec
   */
  readonly grpcSpecConfig?: CfnGatewayRoute.GrpcGatewayRouteProperty;
}

/**
 * Used to generate specs with different protocols for a GatewayRoute
 */
export abstract class GatewayRouteSpec {
  /**
   * Creates an HTTP Based GatewayRoute
   *
   * @param props - no http gateway route
   */
  public static httpRouteSpec(props: HttpRouteSpecProps): GatewayRouteSpec {
    return new HttpGatewayRouteSpec(props, Protocol.HTTP);
  }

  /**
   * Creates an HTTP2 Based GatewayRoute
   *
   * @param props - no http2 gateway route
   */
  public static http2RouteSpec(props: HttpRouteSpecProps): GatewayRouteSpec {
    return new HttpGatewayRouteSpec(props, Protocol.HTTP2);
  }

  /**
   * Creates an GRPC Based GatewayRoute
   *
   * @param props - no grpc gateway route
   */
  public static grpcRouteSpec(props: GrpcRouteSpecProps): GatewayRouteSpec {
    return new GrpcGatewayRouteSpec(props);
  }

  /**
   * Called when the GatewayRouteSpec type is initialized. Can be used to enforce
   * mutual exclusivity with future properties
   */
  public abstract bind(scope: cdk.Construct): GatewayRouteSpecConfig;
}

class HttpGatewayRouteSpec extends GatewayRouteSpec {
  /**
   * The criterion for determining a request match for this GatewayRoute.
   *
   * @default - matches on '/'
   */
  readonly match?: HttpGatewayRouteMatch;
  /**
   * The VirtualService this GatewayRoute directs traffic to
   */
  readonly routeTarget: IVirtualService;
  /**
   * Type of route you are creating
   */
  readonly routeType: Protocol;

  constructor(props: HttpRouteSpecProps, protocol: Protocol.HTTP | Protocol.HTTP2) {
    super();
    this.routeTarget = props.routeTarget;
    this.routeType = protocol;
    this.match = props.match;
  }
  public bind(_scope: cdk.Construct): GatewayRouteSpecConfig {
    const prefixPath = this.match ? this.match.prefixPath : '/';
    if (prefixPath[0] != '/') {
      throw new Error(`Prefix path must start with '/', got: ${prefixPath}`);
    }
    const httpConfig: CfnGatewayRoute.HttpGatewayRouteProperty = {
      match: {
        prefix: prefixPath,
      },
      action: {
        target: {
          virtualService: {
            virtualServiceName: this.routeTarget.virtualServiceName,
          },
        },
      },
    };
    return {
      httpSpecConfig: this.routeType === Protocol.HTTP ? httpConfig : undefined,
      http2SpecConfig: this.routeType === Protocol.HTTP2 ? httpConfig : undefined,
    };
  }
}

class GrpcGatewayRouteSpec extends GatewayRouteSpec {
  /**
   * The criterion for determining a request match for this GatewayRoute.
   *
   * @default - no default
   */
  readonly match: GrpcGatewayRouteMatch;
  /**
   * The VirtualService this GatewayRoute directs traffic to
   */
  readonly routeTarget: IVirtualService;

  constructor(props: GrpcRouteSpecProps) {
    super();
    this.match = props.match;
    this.routeTarget = props.routeTarget;
  }

  public bind(_scope: cdk.Construct): GatewayRouteSpecConfig {
    return {
      grpcSpecConfig: {
        action: {
          target: {
            virtualService: {
              virtualServiceName: this.routeTarget.virtualServiceName,
            },
          },
        },
        match: {
          serviceName: this.match.serviceName,
        },
      },
    };
  }
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
