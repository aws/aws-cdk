import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '../lib';

/**
 * the interface of the Route of API Gateway HTTP API
 */
export interface IRoute extends cdk.IResource {
  /**
   * ID of the Route
   * @attribute
   */
  readonly routeId: string;
}

/**
 * the interface of the RouteBase
 */
export interface IRouteBase extends IRoute {
  /**
   * the ID of this API Gateway HttpApi.
   * @attribute
   */
  readonly api: apigatewayv2.IHttpApi;
  /**
   * the key of this route
   * @attribute
   */
  readonly routeKey: string;
  /**
   * the parent of this route or undefinied for the root route
   */
  readonly parentRoute?: IRoute;
  /**
   * full path of this route
   */
  readonly httpPath: string;

  /**
   * add a child route with HTTP integration for this parent route
   */
  addHttpRoute(pathPart: string, id: string, options: HttpRouteOptions): Route;

  /**
   * add a child route with Lambda integration for this parent route
   */
  addLambdaRoute(pathPart: string, id: string, options: LambdaRouteOptions): Route;
}

/**
 * the interface of the route attributes
 */
export interface RouteAttributes {
  /**
   * ID of this Route
   * @attribute
   */
  readonly routeId: string;
}

/**
 * options of HttpRoute
 */
export interface HttpRouteOptions  {
  /**
   * URL of the integration target
   */
  readonly targetUrl: string

  /**
   * HTTP method
   * @default HttpMethod.ANY
   */
  readonly method?: HttpMethod

  /**
   * Integration Method
   * @default HttpMethod.ANY
   */
  readonly integrationMethod?: HttpMethod;
}

/**
 * Options for the Route with Lambda integration
 */
export interface LambdaRouteOptions {
  /**
   * target lambda function
   */
  readonly target: lambda.IFunction

  /**
   * HTTP method
   * @default HttpMethod.ANY
   */
  readonly method?: HttpMethod

  /**
   * Integration method
   * @default HttpMethod.ANY
   */
  readonly integrationMethod?: HttpMethod;
}

/**
 * all HTTP methods
 */
export enum HttpMethod {
  /**
   * HTTP ANY
   */
  ANY = 'ANY',
  /**
   * HTTP GET
   */
  GET = 'GET',
  /**
   * HTTP PUT
   */
  PUT = 'PUT',
  /**
   * HTTP POST
   */
  POST = 'POST',
  /**
   * HTTP DELETE
   */
  DELETE = 'DELETE',
}

/**
 * Route properties
 */
export interface RouteProps extends cdk.StackProps {
  /**
   * route name
   * @default - the logic ID of this route
   */
  readonly routeName?: string;
  /**
   * the API the route is associated with
   */
  readonly api: apigatewayv2.IHttpApi;
  /**
   * HTTP method of this route
   * @default HttpMethod.ANY
   */
  readonly httpMethod?: HttpMethod;
  /**
   * full http path of this route
   */
  readonly httpPath: string;
  /**
   * parent of this route
   * @default - undefinied if no parentroute d
   */
  readonly parent?: IRoute
  /**
   * path part of this route
   * @default ''
   */
  readonly pathPart?: string;
  /**
   * HTTP URL target of this route
   * @default - None. Specify one of `targetUrl`, `targetHandler` or `integration`
   */
  readonly targetUrl?: string;
  /**
   * Lambda handler target of this route
   * @default - None. Specify one of `targetUrl`, `targetHandler` or `integration`
   */
  readonly targetHandler?: lambda.IFunction;
  /**
   * Integration
   * @default - None. Specify one of `targetUrl`, `targetHandler` or `integration`
   */
  readonly integration?: apigatewayv2.IIntegration;
}

/**
 * Route class that creates the Route for API Gateway HTTP API
 */
export class Route extends cdk.Resource implements IRouteBase {
  /**
   * import from route id
   */
  public static fromRouteId(scope: cdk.Construct, id: string, routeId: string): IRoute {
    class Import extends cdk.Resource implements IRoute {
      public routeId = routeId;
    }
    return new Import(scope, id);
  }
  // public readonly fullUrl: string;
  /**
   * the api ID of this route
   */
  public readonly api: apigatewayv2.IHttpApi;
  /**
   * the route key of this route
   */
  public readonly routeKey: string;
  /**
   * the full http path of this route
   */
  public readonly httpPath: string;
  /**
   * http method of this route
   */
  public readonly httpMethod: HttpMethod;
  /**
   * route id from the `Ref` function
   */
  public readonly routeId: string;
  /**
   * integration ID
   */
  public readonly integId: string;

  constructor(scope: cdk.Construct, id: string, props: RouteProps) {
    super(scope, id);

    if ((props.targetHandler && props.targetUrl) ||
      (props.targetHandler && props.integration) ||
      (props.targetUrl && props.integration)) {
      throw new Error('You must specify targetHandler, targetUrl or integration, use at most one');
    }

    this.api = props.api;
    this.httpPath = props.httpPath;
    this.httpMethod = props.httpMethod ?? HttpMethod.ANY;
    this.routeKey = `${this.httpMethod} ${this.httpPath}`;

    if (props.integration) {
      this.integId = props.integration.integrationId;
    } else if (props.targetUrl) {
        // create a HTTP Proxy integration
      const integ = new apigatewayv2.HttpProxyIntegration(scope, `${id}/HttpProxyIntegration`, {
        api: this.api,
        targetUrl: props.targetUrl
      });
      this.integId = integ.integrationId;
    } else if (props.targetHandler) {
      // create a Lambda Proxy integration
      const integ = new apigatewayv2.LambdaProxyIntegration(scope, `${id}/LambdaProxyIntegration`, {
        api: this.api,
        targetHandler: props.targetHandler
      });
      this.integId = integ.integrationId;
    } else {
      throw new Error('You must specify either a integration, targetHandler or targetUrl');
    }

    const routeProps: apigatewayv2.CfnRouteProps = {
      apiId: this.api.httpApiId,
      routeKey: this.routeKey,
      target: `integrations/${this.integId}`,
    };

    const route = new apigatewayv2.CfnRoute(this, 'Resource', routeProps);
    this.routeId = route.ref;
    // this.url = `${this.api.url}${this.httpPath}`;
  }

  /**
   * create a child route with Lambda proxy integration
   */
  public addLambdaRoute(pathPart: string, id: string, options: LambdaRouteOptions): Route {
    const httpPath = `${this.httpPath.replace(/\/+$/, "")}/${pathPart}`;
    const httpMethod = options.method;
    // const routeKey = `${httpMethod} ${httpPath}`;

    return new Route(this, id, {
      api: this.api,
      targetHandler: options.target,
      httpPath,
      httpMethod,
      parent: this,
      pathPart,
    });
  }

  /**
   * create a child route with HTTP proxy integration
   */
  public addHttpRoute(pathPart: string, id: string, options: HttpRouteOptions): Route {
    const httpPath = `${this.httpPath.replace(/\/+$/, "")}/${pathPart}`;
    const httpMethod = options.method;
    // const routeKey = `${httpMethod} ${httpPath}`;

    return new Route(this, id, {
      api: this.api,
      targetUrl: options.targetUrl,
      httpPath,
      httpMethod,
      parent: this,
      pathPart,
    });
  }
}
