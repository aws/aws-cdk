import { Construct, IResource, Resource } from '@aws-cdk/core';
import { IHttpApi } from './api';
import { CfnRoute, CfnRouteProps } from './apigatewayv2.generated';
import { Integration, IRouteIntegration } from './integration';

/**
 * the interface of the Route of API Gateway HTTP API
 */
export interface IRoute extends IResource {
  /**
   * ID of the Route
   * @attribute
   */
  readonly routeId: string;
}

/**
 * all HTTP methods
 */
export enum HttpMethod {
  /** HTTP ANY */
  ANY = 'ANY',
  /** HTTP DELETE */
  DELETE = 'DELETE',
  /** HTTP GET */
  GET = 'GET',
  /** HTTP HEAD */
  HEAD = 'HEAD',
  /** HTTP OPTIONS */
  OPTIONS = 'OPTIONS',
  /** HTTP PATCH */
  PATCH = 'PATCH',
  /** HTTP POST */
  POST = 'POST',
  /** HTTP PUT */
  PUT = 'PUT',
}

/**
 * The key
 */
export class RouteKey {
  public static readonly DEFAULT = new RouteKey('$default');

  public static with(path: string, method?: HttpMethod) {
    if (path !== '/' && (!path.startsWith('/') || path.endsWith('/'))) {
      throw new Error('path must always start with a "/" and not end with a "/"');
    }
    return new RouteKey(`${method ?? 'ANY'} ${path}`, path);
  }

  public readonly key: string;
  public readonly path?: string;

  private constructor(key: string, path?: string) {
    this.key = key;
    this.path = path;
  }
}

/**
 * Route properties
 */
export interface RouteProps {
  /**
   * the API the route is associated with
   */
  readonly httpApi: IHttpApi;

  /**
   * The key to this route. This is a combination of an HTTP method and an HTTP path.
   */
  readonly routeKey: RouteKey;

  /**
   * Integration
   */
  readonly integration?: IRouteIntegration;
}

/**
 * Options for the Route with Integration resoruce
 */
export interface AddRoutesOptions {
  /**
   * HTTP methods
   * @default HttpMethod.ANY
   */
  readonly methods?: HttpMethod[];

  /**
   * The integration for this path
   */
  readonly integration: Integration;
}

/**
 * Route class that creates the Route for API Gateway HTTP API
 */
export class Route extends Resource implements IRoute {
  /**
   * import from route id
   */
  public static fromRouteId(scope: Construct, id: string, routeId: string): IRoute {
    class Import extends Resource implements IRoute {
      public routeId = routeId;
    }
    return new Import(scope, id);
  }

  public readonly routeId: string;
  public readonly httpApi: IHttpApi;
  public readonly path: string | undefined;

  constructor(scope: Construct, id: string, props: RouteProps) {
    super(scope, id);

    this.httpApi = props.httpApi;
    this.path = props.routeKey.path;

    let integration: Integration | undefined;
    if (props.integration) {
      const config = props.integration.bind(this);
      integration = new Integration(this, `${this.node.id}-Integration`, {
        httpApi: props.httpApi,
        integrationType: config.type,
        integrationUri: config.uri,
      });
    }

    const routeProps: CfnRouteProps = {
      apiId: props.httpApi.httpApiId,
      routeKey: props.routeKey.key,
      target: integration ? `integrations/${integration.integrationId}` : undefined,
    };

    const route = new CfnRoute(this, 'Resource', routeProps);
    this.routeId = route.ref;
  }

  /**
   * create child routes
   */
  // public addRoutes(pathPart: string, id: string, options: AddRoutesOptions): Route[] {
  //   const routes: Route[] = [];
  //   const methods = options.methods ?? [ HttpMethod.ANY ];
  //   for (const m of methods) {
  //     routes.push(new Route(this, `${id}${m}`, {
  //       api: this.httpApi,
  //       integration: options.integration,
  //       httpMethod: m,
  //       httpPath: pathPart,
  //     }));
  //   }
  //   return routes;
  // }
}
