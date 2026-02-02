import type { Construct } from 'constructs';
import type { IRouteRef, RouteReference } from './appmesh.generated';
import { CfnRoute } from './appmesh.generated';
import type { IMesh } from './mesh';
import { renderMeshOwner } from './private/utils';
import type { RouteSpec } from './route-spec';
import type { IVirtualRouter } from './virtual-router';
import { VirtualRouter } from './virtual-router';
import * as cdk from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Interface for which all Route based classes MUST implement
 */
export interface IRoute extends cdk.IResource, IRouteRef {
  /**
   * The name of the route
   *
   * @attribute
   */
  readonly routeName: string;

  /**
   * The Amazon Resource Name (ARN) for the route
   *
   * @attribute
   */
  readonly routeArn: string;

  /**
   * The VirtualRouter the Route belongs to
   */
  readonly virtualRouter: IVirtualRouter;
}

/**
 * Base interface properties for all Routes
 */
export interface RouteBaseProps {
  /**
   * The name of the route
   *
   * @default - An automatically generated name
   */
  readonly routeName?: string;

  /**
   * Protocol specific spec
   */
  readonly routeSpec: RouteSpec;
}

/**
 * Properties to define new Routes
 */
export interface RouteProps extends RouteBaseProps {
  /**
   * The service mesh to define the route in
   */
  readonly mesh: IMesh;

  /**
   * The VirtualRouter the Route belongs to
   */
  readonly virtualRouter: IVirtualRouter;
}

/**
 * Route represents a new or existing route attached to a VirtualRouter and Mesh
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/routes.html
 */
@propertyInjectable
export class Route extends cdk.Resource implements IRoute {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-appmesh.Route';

  /**
   * Import an existing Route given an ARN
   */
  public static fromRouteArn(scope: Construct, id: string, routeArn: string): IRoute {
    return new class extends cdk.Resource implements IRoute {
      readonly routeArn = routeArn;
      readonly virtualRouter = VirtualRouter.fromVirtualRouterArn(this, 'VirtualRouter', routeArn);
      readonly routeName = cdk.Fn.select(4, cdk.Fn.split('/', cdk.Stack.of(scope).splitArn(routeArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName!));

      public get routeRef(): RouteReference {
        return { routeArn: this.routeArn };
      }
    }(scope, id);
  }

  /**
   * Import an existing Route given attributes
   */
  public static fromRouteAttributes(scope: Construct, id: string, attrs: RouteAttributes): IRoute {
    return new class extends cdk.Resource implements IRoute {
      readonly routeName = attrs.routeName;
      readonly virtualRouter = attrs.virtualRouter;
      readonly routeArn = cdk.Stack.of(this).formatArn({
        service: 'appmesh',
        resource: `mesh/${attrs.virtualRouter.mesh.meshName}/virtualRouter/${attrs.virtualRouter.virtualRouterName}/route`,
        resourceName: this.routeName,
      });
      public get routeRef(): RouteReference {
        return { routeArn: this.routeArn };
      }
    }(scope, id);
  }

  /**
   * The name of the Route
   */
  @memoizedGetter
  public get routeName(): string {
    return this.getResourceNameAttribute(this.resource.attrRouteName);
  }

  /**
   * The Amazon Resource Name (ARN) for the route
   */
  @memoizedGetter
  public get routeArn(): string {
    return this.getResourceArnAttribute(this.resource.ref, {
      service: 'appmesh',
      resource: `mesh/${this.mesh.meshName}/virtualRouter/${this.virtualRouter.virtualRouterName}/route`,
      resourceName: this.physicalName,
    });
  }

  /**
   * The VirtualRouter the Route belongs to
   */
  public readonly virtualRouter: IVirtualRouter;

  private readonly resource: CfnRoute;
  private readonly mesh: IMesh;

  constructor(scope: Construct, id: string, props: RouteProps) {
    super(scope, id, {
      physicalName: props.routeName || cdk.Lazy.string({ produce: () => cdk.Names.uniqueId(this) }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.virtualRouter = props.virtualRouter;
    this.mesh = props.mesh;

    const spec = props.routeSpec.bind(this);

    this.resource = new CfnRoute(this, 'Resource', {
      routeName: this.physicalName,
      meshName: this.virtualRouter.mesh.meshName,
      meshOwner: renderMeshOwner(this.env.account, this.virtualRouter.mesh.env.account),
      virtualRouterName: this.virtualRouter.virtualRouterName,
      spec: {
        tcpRoute: spec.tcpRouteSpec,
        httpRoute: spec.httpRouteSpec,
        http2Route: spec.http2RouteSpec,
        grpcRoute: spec.grpcRouteSpec,
        priority: spec.priority,
      },
    });
  }

  public get routeRef(): RouteReference {
    return { routeArn: this.routeArn };
  }
}

/**
 * Interface with properties ncecessary to import a reusable Route
 */
export interface RouteAttributes {
  /**
   * The name of the Route
   */
  readonly routeName: string;

  /**
   * The VirtualRouter the Route belongs to
   */
  readonly virtualRouter: IVirtualRouter;
}
