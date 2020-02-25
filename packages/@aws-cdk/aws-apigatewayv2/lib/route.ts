import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '../lib';
import { CfnRouteProps } from './apigatewayv2.generated';

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
 * HttpRoute interface
 */
export interface IHttpRoute extends IRoute {}
/**
 * LambdaRoute interface
 */
export interface ILambdaRoute extends IRoute { }

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
 * the interface of the RouteBase
 */
export interface IRouteBase extends IRoute {
  /**
   * the ID of this API Gateway HttpApi.
   * @attribute
   */
  readonly api: apigatewayv2.IApiBase;
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
   * full URL of this route
   */
  readonly fullUrl: string;

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
 * the interface of the RouteOptionsBase
 */
export interface RouteOptionsBase {}

/**
 * options of HttpRoute
 */
export interface HttpRouteOptions extends RouteOptionsBase {
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
export interface LambdaRouteOptions extends RouteOptionsBase {
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

abstract class RouteBase extends cdk.Resource implements IRouteBase {
  public abstract readonly api: apigatewayv2.IApiBase;
  public abstract readonly routeKey: string;
  public abstract readonly httpPath: string;
  public abstract readonly routeId: string;
  public abstract readonly fullUrl: string;

  /**
   * create a child route with Lambda proxy integration
   */
  public addLambdaRoute(pathPart: string, id: string, options: LambdaRouteOptions): Route {
    const httpPath = `${this.httpPath.replace(/\/+$/, "")}/${pathPart}`;
    const httpMethod = options.method;
    // const routeKey = `${httpMethod} ${httpPath}`;

    return new LambdaRoute(this, id, {
      api: this.api,
      handler: options.target,
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

    return new HttpRoute(this, id, {
      api: this.api,
      targetUrl: options.targetUrl,
      httpPath,
      httpMethod,
      parent: this,
      pathPart,
    });
  }

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
 * Route base properties
 */
export interface RouteBaseProps extends cdk.StackProps {
  /**
   * route name
   * @default - the logic ID of this route
   */
  readonly routeName?: string;
  /**
   * the API the route is associated with
   */
  readonly api: apigatewayv2.IApiBase;
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
  readonly parent?: IRouteBase
  /**
   * path part of this route
   * @default ''
   */
  readonly pathPart?: string;

}

/**
 * Route properties
 */
export interface RouteProps extends RouteBaseProps {
  /**
   * target of this route
   */
  readonly target: string;

}

/**
 * Route class that creates the Route for API Gateway HTTP API
 */
export class Route extends RouteBase {

  /**
   * import from route attributes
   */
  public static fromRouteAttributes(scope: cdk.Construct, id: string, attrs: RouteAttributes): IRoute {
    class Import extends cdk.Resource implements IRoute {
      public routeId = attrs.routeId;
    }
    return new Import(scope, id);
  }
  public readonly fullUrl: string;
  /**
   * the api interface of this route
   */
  public readonly api: apigatewayv2.IApiBase;
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

  constructor(scope: cdk.Construct, id: string, props: RouteProps) {
    super(scope, id);

    this.api = props.api;
    this.httpPath = props.httpPath;
    this.httpMethod = props.httpMethod ?? HttpMethod.ANY;

    this.routeKey = `${props.httpMethod} ${props.httpPath}`;
    const routeProps: CfnRouteProps = {
      apiId: this.api.apiId,
      routeKey: this.routeKey,
      target: props.target
    };
    const route = new apigatewayv2.CfnRoute(this, 'Resoruce', routeProps);
    this.routeId = route.ref;
    this.fullUrl = `${this.api.url}${this.httpPath}`;
  }
}

/**
 * Lambda route properties
 */
export interface LambdaRouteProps extends RouteBaseProps {
  /**
   * Lambda handler function
   */
  readonly handler: lambda.IFunction
}

/**
 * HTTP route properties
 */
export interface HttpRouteProps extends RouteBaseProps {
  /**
   * target URL
   */
  readonly targetUrl: string,
  /**
   * integration method
   * @default HttpMethod.ANY
   */
  readonly integrationMethod?: HttpMethod
}

enum IntegrationType {
  AWS_PROXY = 'AWS_PROXY',
  HTTP_PROXY = 'HTTP_PROXY'
}

/**
 * Route with Lambda Proxy integration
 */
export class LambdaRoute extends Route implements ILambdaRoute {
  /**
   * import from lambdaRouteId
   */
  public static fromLambdaRouteId(scope: cdk.Construct, id: string, lambdaRouteId: string): ILambdaRoute {
    class Import extends cdk.Resource implements ILambdaRoute {
      public readonly routeId = lambdaRouteId;
    }
    return new Import(scope, id);
  }
  constructor(scope: cdk.Construct, id: string, props: LambdaRouteProps) {
    const region = cdk.Stack.of(scope).region;
    const account = cdk.Stack.of(scope).account;
    const partition = region.startsWith('cn-') ? 'aws-cn' : 'aws';
    const httpMethod = props.httpMethod ?? HttpMethod.ANY;

    // create a Lambda Proxy integration
    const integ = new apigatewayv2.CfnIntegration(scope, `Integration-${id}`, {
      apiId: props.api.apiId,
      integrationMethod: HttpMethod.POST,
      integrationType:  IntegrationType.AWS_PROXY,
      payloadFormatVersion: '1.0',
      integrationUri: `arn:${partition}:apigateway:${region}:lambda:path/2015-03-31/functions/${props.handler.functionArn}/invocations`
    });

    // create permission
    new lambda.CfnPermission(scope, `Permission-${id}`, {
      action: 'lambda:InvokeFunction',
      principal: 'apigateway.amazonaws.com',
      functionName: props.handler.functionName,
      sourceArn: `arn:${partition}:execute-api:${region}:${account}:${props.api.apiId}/*/*`,
    });

    super(scope, id, {
      api: props.api,
      httpMethod,
      httpPath: props.httpPath,
      target: `integrations/${integ.ref}`,
      parent: props.parent,
      pathPart: props.pathPart ?? ''
    });
  }
}

/**
 * Route with HTTP Proxy integration
 */
export class HttpRoute extends Route implements IHttpRoute {
  /**
   * import from httpRouteId
   */
  public static fromHttpRouteId(scope: cdk.Construct, id: string, httpRouteId: string): IHttpRoute {
    class Import extends cdk.Resource implements IHttpRoute {
      public readonly routeId = httpRouteId;
    }
    return new Import(scope, id);
  }
  constructor(scope: cdk.Construct, id: string, props: HttpRouteProps) {
    const httpMethod = props.httpMethod ?? HttpMethod.ANY;

    // create a HTTP Proxy integration
    const integ = new apigatewayv2.CfnIntegration(scope, `Integration${id}`, {
      apiId: props.api.apiId,
      integrationMethod: props.integrationMethod ?? HttpMethod.ANY,
      integrationType: IntegrationType.HTTP_PROXY,
      payloadFormatVersion: '1.0',
      integrationUri: props.targetUrl
    });
    super(scope, id, {
      api: props.api,
      httpMethod,
      httpPath: props.httpPath,
      target: `integrations/${integ.ref}`,
      parent: props.parent,
      pathPart: props.pathPart
    });
  }
}
