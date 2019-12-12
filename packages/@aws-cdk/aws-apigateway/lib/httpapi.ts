import lambda = require('@aws-cdk/aws-lambda');
import { CfnOutput, Construct, Resource, Stack } from '@aws-cdk/core';
import { CfnApiV2 } from './apigatewayv2.generated';
import { CorsOptions } from './cors';
import { Integration } from './integration';
import { MethodOptions } from './method';
import { IRoute, RouteBase } from './route';

export interface IHttpApi {

}

export interface HttpApiProps {
  /**
   * The HTTP API name
   */
  readonly httpApiName?: string
  /**
   * The HTTP API description
   */
  readonly bdescription?: string
  /**
   * The HTTP API protocol.
   *
   * @default HTTP
   */
  readonly protocol?: HttpApiProtocal.HTTP
  /**
   * The Lambda function for HTTP API Lambda integration
   */
  readonly handler: lambda.Function;
}

export enum HttpApiProtocal {
  HTTP = 'HTTP',
  WEBSOCKET = 'WEBSOCKET'
}

export enum HttpApiIntegrationType {
  HTTP = 'HTTP',
  LAMBDA = 'LAMBDA'
}

/**
 * Represents a HTTP API in Amazon API Gateway.
 *
 * Use `addRoute`, `addHttpRoute` or `addLambdaRoute` to configure the API model.
 *
 * By default, the API will automatically be deployed and accessible from a
 * public endpoint.
 *
 * @resource AWS::ApiGatewayV2::Api
 */
export class HttpApi extends Resource implements IHttpApi {
  public static fromHttpApiId(scope: Construct, id: string, httpApiId: string): IHttpApi {
    class Import extends Resource implements IHttpApi {
      public readonly httpApiId = httpApiId;
    }

    return new Import(scope, id);
  }
  /**
   * The ID of this API Gateway HttpApi.
   */
  public readonly httpApiId: string;
  // public readonly restApi: string;
  /**
   * The resource ID of the root resource.
   *
   * @attribute
   */
  public readonly region: string;
  // public readonly restApiRootResourceId: string
  /**
   * The resource ID of the root resource.
   *
   * @attribute
   */
  // public readonly httpApiRootRouteKey: string;

  /**
   * Represents the root resource ("/") of this API. Use it to define the API model:
   *
   *    api.root.addRoute('friends')
   *
   */
  public readonly root: IRoute;

  public readonly url: string;

  constructor(scope: Construct, id: string, props: HttpApiProps) {
    super(scope, id, {
      physicalName: props.httpApiName || id,
    });

    const resource = new CfnApiV2(this, 'Resource', {
      name: this.physicalName,
      protocolType: props.protocol ? props.protocol : HttpApiProtocal.HTTP,
      target: props.handler.functionArn
    });
    this.node.defaultChild = resource;

    this.httpApiId = resource.ref;

    this.region = Stack.of(this).region;
    const partition = this.region.startsWith('cn-') ? 'aws-cn' : 'aws';
    const account = Stack.of(this).account;

    // this.restApi = undefined;

    this.url = `https://${this.httpApiId}.execute-api.${this.region}.amazonaws.com`;

    new lambda.CfnPermission(this, 'Permission', {
      action: 'lambda:InvokeFunction',
      principal: 'apigateway.amazonaws.com',
      functionName: props.handler.functionName,
      sourceArn: `arn:${partition}:execute-api:${this.region}:${account}:${this.httpApiId}/*/*`,
    });

    new CfnOutput(this, 'HttpApiEndpoint', {
      value: `https://${this.httpApiId}.execute-api.${this.region}.amazonaws.com/`
    });

    this.root = new RootRoute(this, props);
  }
}

class RootRoute extends RouteBase {
  public readonly parentRoute?: IRoute;
  public readonly httpApi: HttpApi;
  public readonly routeKey: string;
  public readonly path: string;
  public readonly handler: lambda.IFunction;
  public readonly defaultIntegration?: Integration | undefined;
  public readonly defaultMethodOptions?: MethodOptions | undefined;
  public readonly defaultCorsPreflightOptions?: CorsOptions | undefined;

  constructor(api: HttpApi, props: HttpApiProps) {
    super(api, 'Default');
    this.parentRoute = undefined;
    this.httpApi = api;
    this.routeKey = '$default';
    this.path = '/';
    this.handler = props.handler;
  }
}
