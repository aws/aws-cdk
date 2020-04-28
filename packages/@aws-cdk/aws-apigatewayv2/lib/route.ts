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
 * Route properties
 */
export interface RouteProps {
  /**
   * the API the route is associated with
   */
  readonly httpApi: IHttpApi;

  /**
   * HTTP method of this route
   * @default HttpMethod.ANY
   */
  readonly method?: HttpMethod;

  /**
   * full http path of this route
   */
  readonly path: string;

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
  public readonly method: HttpMethod;
  public readonly path: string;

  constructor(scope: Construct, id: string, props: RouteProps) {
    super(scope, id);

    if (props.path !== '/' && (!props.path.startsWith('/') || props.path.endsWith('/'))) {
      throw new Error('path must always start with a "/" and not end with a "/"');
    }

    this.httpApi = props.httpApi;
    this.method = props.method ?? HttpMethod.ANY;
    this.path = props.path;

    let integration: Integration | undefined;
    if (props.integration) {
      const config = props.integration.bind(this);
      integration = new Integration(this, `${this.node.id}-Integration`, {
        httpApi: props.httpApi,
        integrationMethod: this.method,
        integrationType: config.type,
        integrationUri: config.uri,
      });
    }

    const routeProps: CfnRouteProps = {
      apiId: props.httpApi.httpApiId,
      routeKey: `${this.method} ${this.path}`,
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
