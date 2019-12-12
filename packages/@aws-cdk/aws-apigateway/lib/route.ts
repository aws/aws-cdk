import lambda = require('@aws-cdk/aws-lambda');
import { CfnOutput, Construct, IResource as IRouteBase, Resource as ResourceConstruct, Stack } from '@aws-cdk/core';
import { CfnIntegrationV2, CfnRouteV2, CfnRouteV2Props } from './apigatewayv2.generated';
import { HttpApi, HttpApiIntegrationType } from './httpapi';

export interface IRoute extends IRouteBase {
  /**
   * The parent of this route or undefined for the root route.
   */
  readonly parentRoute?: IRoute;

  /**
   * The HTTP API that this route is part of.
   */
  readonly httpApi: HttpApi;

  /**
   * The key of the route.
   * @attribute
   */
  readonly routeKey: string;

  /**
   * The full path of this route.
   */
  readonly path: string;

  /**
   * Defines a new child route where this route is the parent.
   * @param pathPart The path part for the child route
   * @param options Route options
   * @returns A Route object
   */
  addRoute(pathPart: string, options?: RouteOptions): Route;

  addHttpRoute(pathPart: string, options?: HttpRouteOptions): Route;

  addLambdaRoute(pathPart: string, options?: LambdaRouteOptions): Route;

}

export abstract class RouteBase extends ResourceConstruct implements IRoute {
  public abstract readonly parentRoute?: IRoute;
  public abstract readonly httpApi: HttpApi;
  public abstract readonly path: string;
  public abstract readonly routeKey: string;

  /**
   * Defines a new child route where this route is the parent.
   * @param pathPart The path part for the child route
   * @param options Route options
   * @returns A Route object
   */
  public addRoute(pathPart: string, options: RouteOptions): Route {
    return new Route(this, pathPart, { method: options.method, integrationType: options.integrationType,  parent: this, pathPart, ...options });
  }

  /**
   * Defines a new child route where this route is the parent.
   * @param pathPart The path part for the child route
   * @param options Route options
   * @returns A Route object
   */
  public addHttpRoute(pathPart: string, options: HttpRouteOptions): Route {
    return new Route(this, pathPart, { method: options.method, integrationType: HttpApiIntegrationType.HTTP, parent: this, pathPart, ...options });
  }

  /**
   * Defines a new child route where this route is the parent.
   * @param pathPart The path part for the child route
   * @param options Route options
   * @returns A Route object
   */
  public addLambdaRoute(pathPart: string, options: LambdaRouteOptions): Route {
    return new Route(this, pathPart, { method: options.method, integrationType: HttpApiIntegrationType.LAMBDA, parent: this, pathPart, ...options });
  }

}

export enum HttpMethod {
  ANY = 'ANY',
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
}

export interface RouteProps extends RouteOptions {
  readonly parent: IRoute;
  readonly pathPart: string;
  readonly targetUrl?: string;
}

export class Route extends RouteBase {
  public readonly parentRoute?: IRoute;
  public readonly httpApi: HttpApi;
  public readonly routeId: string;
  public readonly path: string;
  public readonly routeKey: string;
  public readonly method: HttpMethod;
  public readonly pathPart: string;
  public readonly integrationType: HttpApiIntegrationType;
  public readonly apiId: string;
  public readonly targetUrl?: string;

  constructor(scope: Construct, id: string, props: RouteProps) {
    super(scope, id);
    this.integrationType = props.integrationType || HttpApiIntegrationType.LAMBDA,
    this.method = props.method || HttpMethod.ANY;
    this.pathPart = props.pathPart;
    this.path = props.parent.path;
    this.path += props.parent.path === '/' ? props.pathPart : `/${props.pathPart}`;
    this.routeKey = `${this.method} /${this.path}`;
    this.targetUrl = props.targetUrl;
    this.httpApi = props.parent.httpApi;
    this.apiId = props.parent.httpApi.httpApiId;
    const region = Stack.of(this).region;
    const account = Stack.of(this).account;
    const partition = region.startsWith('cn-') ? 'aws-cn' : 'aws';

    // Create the Integration
    const integ = new CfnIntegrationV2(this, 'Integration', {
      apiId: this.httpApi.httpApiId,
      integrationMethod: this.integrationType === 'LAMBDA' ? HttpMethod.POST : props.integrationMethod || HttpMethod.ANY,
      integrationType: this.integrationType === 'LAMBDA' ? IntegrationV2Type.AWS_PROXY : IntegrationV2Type.HTTP_PROXY,
      payloadFormatVersion: '1.0',
      integrationUri: this.integrationType === 'LAMBDA' ?
      `arn:${partition}:apigateway:${region}:lambda:path/2015-03-31/functions/${props.target!.functionArn}/invocations` : props.targetUrl
    });

    // lambda permission
    if (this.integrationType === 'LAMBDA') {
      const sourceArn = `arn:${partition}:execute-api:${region}:${account}:${this.apiId}/*/*${this.path}`;
      new lambda.CfnPermission(this, 'Permission', {
        action: 'lambda:InvokeFunction',
        principal: 'apigateway.amazonaws.com',
        functionName: props.target!.functionName,
        sourceArn
      });
    }

    // create the Route targeting the integration
    const routeProps: CfnRouteV2Props = {
      apiId: props.parent.httpApi.httpApiId,
      routeKey: `${this.method} ${this.path}`,
      target: `integrations/${integ.ref}`
    };
    const route = new CfnRouteV2(this, 'Route', routeProps);
    this.routeId = route.ref;
    new CfnOutput(this, 'url', { value: this.httpApi.url + this.path });
  }
}

export enum IntegrationV2Type {
  /**
   * For integratingV2, only 'AWS_PROXY' and 'HTTP_PROXY' are available for HTTP API.
   *
   * 'AWS_RPOXY' for Lambda proxy integratgion.
   * 'HTTP_PROXY' for HTTP proxy integration.
   */
  AWS_PROXY = 'AWS_PROXY',
  HTTP_PROXY = 'HTTP_PROXY'
}

export interface RouteOptionsBase {

}

export interface RouteOptions extends RouteOptionsBase {
  readonly integrationType: HttpApiIntegrationType

  readonly target?: lambda.IFunction

  readonly targetUrl?: string

  readonly method?: HttpMethod

  readonly integrationMethod?: HttpMethod;
}

export interface HttpRouteOptions extends RouteOptionsBase {
  readonly targetUrl?: string

  readonly method?: HttpMethod

  readonly integrationMethod?: HttpMethod;
}

export interface LambdaRouteOptions extends RouteOptionsBase {
  readonly target?: lambda.IFunction

  readonly method?: HttpMethod

  readonly integrationMethod?: HttpMethod;
}