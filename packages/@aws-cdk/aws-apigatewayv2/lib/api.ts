import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '../lib';
import { CfnApiProps } from './apigatewayv2.generated';

/**
 * the HTTP API interface
 */
export interface IApi extends cdk.IResource {
  /**
   * The ID of this API Gateway HTTP Api.
   * @attribute
   */
  readonly apiId: string;
}
/**
 * the ApiBase interface
 */
export interface IApiBase extends IApi {
  /**
   * http url of this api
   */
  readonly url: string
}

/**
 * HttpProxyApi interface
 */
export interface IHttpProxyApi extends IApi {}
/**
 * LambdaProxyApi interface
 */
export interface ILambdaProxyApi extends IApi { }

abstract class ApiBase extends cdk.Resource implements IApi {
  /**
   * API ID
   */
  public abstract readonly apiId: string;
  /**
   * API URL
   */
  public abstract readonly url: string;
}

/**
 * API properties
 */
export interface ApiProps extends cdk.StackProps {
  /**
   * API Name
   * @default - the logic ID of the API
   */
  readonly apiName?: string;
  /**
   * API protocol
   * @default HTTP
   */
  readonly protocol?: ApiProtocol;
  /**
   * the default integration target of this API
   */
  readonly target: string;

}

/**
 * API protocols
 */
export enum ApiProtocol {
  /**
   * HTTP protocol
   */
  HTTP = 'HTTP',
  /**
   * Websocket protocol
   */
  WEBSOCKET = 'WEBSOCKET'
}

/**
 * Api Resource Class
 */
export class Api extends ApiBase implements IApi {
  /**
   * import from ApiId
   */
  public static fromApiId(scope: cdk.Construct, id: string, apiId: string): IApi {
    class Import extends cdk.Resource implements IApi {
      public readonly apiId = apiId;
    }

    return new Import(scope, id);
  }
  /**
   * the API identifer
   */
  public readonly apiId: string;
  /**
   * AWS partition either `aws` or `aws-cn`
   */
  public readonly partition: string;
  /**
   * AWS region of this stack
   */
  public readonly region: string;
  /**
   * AWS account of this stack
   */
  public readonly account: string;
  /**
   * AWS domain name either `amazonaws.com` or `amazonaws.com.cn`
   */
  public readonly awsdn: string;
  /**
   * the full URL of this API
   */
  public readonly url: string;

  constructor(scope: cdk.Construct, id: string, props?: ApiProps) {
    super(scope, id, {
      physicalName: props?.apiName || id,
    });

    this.region = cdk.Stack.of(this).region;
    this.partition = this.region.startsWith('cn-') ? 'aws-cn' : 'aws';
    this.account = cdk.Stack.of(this).account;
    this.awsdn = this.partition === 'aws-cn' ? 'amazonaws.com.cn' : 'amazonaws.com';

    const apiProps: CfnApiProps = {
      name: this.physicalName,
      protocolType: props?.protocol ?? ApiProtocol.HTTP,
      target: props?.target
    };
    const api = new apigatewayv2.CfnApi(this, 'Resource', apiProps );
    this.apiId = api.ref;
    this.url = `https://${this.apiId}.execute-api.${this.region}.${this.awsdn}`;
  }

}

/**
 * LambdaProxyApi properties interface
 */
export interface LambdaProxyApiProps  {
  /**
   * API name
   * @default - the logic ID of the API
   */
  readonly apiName?: string,
  /**
   * Lambda handler function
   */
  readonly handler: lambda.IFunction
}

/**
 * HttpProxyApi properties interface
 */
export interface HttpProxyApiProps  {
  /**
   * API Name
   * @default - the logic ID of the API
   */
  readonly apiName?: string,
  /**
   * API URL
   */
  readonly url: string
}

/**
 * API with Lambda Proxy integration as the default route
 */
export class LambdaProxyApi extends Api implements ILambdaProxyApi {
  /**
   * import from api id
   */
  public static fromLambdaProxyApiId(scope: cdk.Construct, id: string, lambdaProxyApiId: string): ILambdaProxyApi {
    class Import extends cdk.Resource implements ILambdaProxyApi {
      public readonly apiId = lambdaProxyApiId;
    }
    return new Import(scope, id);
  }
  /**
   * the root route of the API
   */
  public root?: apigatewayv2.IRouteBase;
  constructor(scope: cdk.Construct, id: string, props: LambdaProxyApiProps) {
    super(scope, id, {
      target: props.handler.functionArn
    });

    new lambda.CfnPermission(this, 'Permission', {
      action: 'lambda:InvokeFunction',
      principal: 'apigateway.amazonaws.com',
      functionName: props.handler.functionName,
      sourceArn: `arn:${this.partition}:execute-api:${this.region}:${this.account}:${this.apiId}/*/*`,
    });

    // this.root = new RootRoute(this, 'RootRoute', this, {
    //   target: props.handler.functionArn,
    // });

    new cdk.CfnOutput(this, 'LambdaProxyApiUrl', {
      value: this.url
    });
  }
}

/**
 * API with HTTP Proxy integration as the default route
 */
export class HttpProxyApi extends Api implements IHttpProxyApi  {
  /**
   * import from api id
   */
  public static fromHttpProxyApiId(scope: cdk.Construct, id: string, httpProxyApiId: string): IHttpProxyApi {
    class Import extends cdk.Resource implements IHttpProxyApi {
      public readonly apiId = httpProxyApiId;
    }
    return new Import(scope, id);
  }

  /**
   * the root route of the API
   */
  public root?: apigatewayv2.IRouteBase;
  constructor(scope: cdk.Construct, id: string, props: HttpProxyApiProps) {
    super(scope, id, {
      target: props.url,
      apiName: props.apiName ?? id
    });

    new cdk.CfnOutput(this, 'HttpProxyApiUrl', {
      value: this.url
    });
  }
}