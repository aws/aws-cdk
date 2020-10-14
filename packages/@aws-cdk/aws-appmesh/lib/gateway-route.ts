import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnGatewayRoute } from './appmesh.generated';
import { Protocol } from './shared-interfaces';
import { IVirtualGateway } from './virtual-gateway';
import { IVirtualService } from './virtual-service';

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

interface GatewayRouteBaseProps {
  /**
   * The name of the Gateway Route
   *
   * @default - an automatically generated name
   */
  readonly gatewayRouteName?: string;

  /**
   * The VirtualService this Gateway Route directs traffic to
   */
  readonly routeTarget: IVirtualService;

  /**
   * What protocol the route uses
   */
  readonly routeType: Protocol.GRPC | Protocol.HTTP | Protocol.HTTP2;
}

/**
 * Base interface for HTTP Based Gateway Routes
 */
export interface GatewayHttpRouteBaseProps extends GatewayRouteBaseProps {
  /**
   * The criterion for determining a request match for this Gateway Route.
   *
   * @default - prefix match on "/"
   */
  readonly match?: GatewayHttpRouteMatch;
  /**
   * HTTP Procol
   */
  readonly routeType: Protocol.HTTP;
}

/**
 * Interface for HTTP Based Gateway Routes
 */
export interface GatewayHttpRouteProps extends GatewayHttpRouteBaseProps {
  /**
   * The Virtual Gateway this Gateway Route is associated with
   */
  readonly virtualGateway: IVirtualGateway;
}

/**
 * Base interface for HTTP2 Based Gateway Routes
 */
export interface GatewayHttp2RouteBaseProps extends GatewayRouteBaseProps {
  /**
   * The criterion for determining a request match for this Gateway Route.
   *
   * @default - prefix match on "/"
   */
  readonly match?: GatewayHttp2RouteMatch;
  /**
   * HTTP2 Procol
   */
  readonly routeType: Protocol.HTTP2;
}

/**
 * Interface for HTTP2 Based Gateway Routes
 */
export interface GatewayHttp2RouteProps extends GatewayHttp2RouteBaseProps {
  /**
   * The Virtual Gateway this Gateway Route is associated with
   */
  readonly virtualGateway: IVirtualGateway;
}

/**
 * Base interface for GRPC Based Gateway Routes
 */
export interface GatewayGrpcRouteBaseProps extends GatewayRouteBaseProps {
  /**
   * The criterion for determining a request match for this Gateway Route.
   *
   * @default - no default
   */
  readonly match: GatewayGrpcRouteMatch;
  /**
   * GRPC Protocol
   */
  readonly routeType: Protocol.GRPC;
}

/**
 * Interface for GRPC Based Gateway Routes
 */
export interface GatewayGrpcRouteProps extends GatewayGrpcRouteBaseProps {
  /**
   * The Virtual Gateway this Gateway Route is associated with
   */
  readonly virtualGateway: IVirtualGateway;
}

interface GatewayHttpSharedRouteMatch {
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
 * The criterion for determining a request match for this Gateway Route
 */
export interface GatewayHttpRouteMatch extends GatewayHttpSharedRouteMatch {}

/**
 * The criterion for determining a request match for this Gateway Route
 */
export interface GatewayHttp2RouteMatch extends GatewayHttpSharedRouteMatch {}

/**
 * The criterion for determining a request match for this Gateway Route
 */
export interface GatewayGrpcRouteMatch {
  /**
   * The fully qualified domain name for the service to match from the request
   */
  readonly serviceName: string;
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

  private readonly httpRoute?: CfnGatewayRoute.HttpGatewayRouteProperty;
  private readonly http2Route?: CfnGatewayRoute.HttpGatewayRouteProperty;
  private readonly grpcRoute?: CfnGatewayRoute.GrpcGatewayRouteProperty;

  constructor(scope: Construct, id: string, props: GatewayHttpRouteProps | GatewayHttp2RouteProps | GatewayGrpcRouteProps) {
    super(scope, id, {
      physicalName: props.gatewayRouteName || cdk.Lazy.stringValue({ produce: () => this.node.uniqueId }),
    });

    this.virtualGateway = props.virtualGateway;

    if (props.routeType === Protocol.HTTP) {
      this.httpRoute = this.renderHttpRoute(props);
    }
    if (props.routeType === Protocol.HTTP2) {
      this.http2Route = this.renderHttpRoute(props);
    }
    if (props.routeType === Protocol.GRPC) {
      this.grpcRoute = this.renderGrpcRoute(props);
    }

    const gatewayRoute = new CfnGatewayRoute(this, 'Resource', {
      gatewayRouteName: this.physicalName,
      meshName: props.virtualGateway.mesh.meshName,
      spec: {
        httpRoute: this.httpRoute,
        http2Route: this.http2Route,
        grpcRoute: this.grpcRoute,
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

  private renderHttpRoute(props: GatewayHttpRouteProps | GatewayHttp2RouteProps): CfnGatewayRoute.HttpGatewayRouteProperty {
    const prefixPath = props.match ? props.match.prefixPath : '/';
    if (prefixPath[0] != '/') {
      throw new Error('Prefix Path must start with \'/\'');
    }
    return {
      action: {
        target: {
          virtualService: {
            virtualServiceName: props.routeTarget.virtualServiceName,
          },
        },
      },
      match: {
        prefix: prefixPath,
      },
    };
  }

  private renderGrpcRoute(props: GatewayGrpcRouteProps): CfnGatewayRoute.GrpcGatewayRouteProperty {
    return {
      action: {
        target: {
          virtualService: {
            virtualServiceName: props.routeTarget.virtualServiceName,
          },
        },
      },
      match: {
        serviceName: props.match.serviceName,
      },
    };
  }
}

/**
 * HTTP Gateway Route attached to a VirtualGateway and Mesh
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/gateway-routes.html
 */
export class GatewayHttpRoute extends GatewayRoute {
  constructor(scope: Construct, id: string, props: GatewayHttpRouteProps) {
    super(scope, id, props);
  }
}

/**
 * HTTP2 Gateway Route attached to a VirtualGateway and Mesh
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/gateway-routes.html
 */
export class GatewayHttp2Route extends GatewayRoute {
  constructor(scope: Construct, id: string, props: GatewayHttp2RouteProps) {
    super(scope, id, props);
  }
}

/**
 * GRPC Gateway Route attached to a VirtualGateway and Mesh
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/gateway-routes.html
 */
export class GatewayGrpcRoute extends GatewayRoute {
  constructor(scope: Construct, id: string, props: GatewayGrpcRouteProps) {
    super(scope, id, props);
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
