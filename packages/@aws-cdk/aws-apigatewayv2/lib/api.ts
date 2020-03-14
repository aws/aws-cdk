import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigatewayv2 from '../lib';
import { CfnApiProps } from './apigatewayv2.generated';

/**
 * the HTTP API interface
 */
export interface IHttpApi extends cdk.IResource {
  /**
   * The ID of this API Gateway HTTP Api.
   * @attribute
   */
  readonly httpApiId: string;
}

abstract class ApiBase extends cdk.Resource implements IHttpApi {
  /**
   * API ID
   */
  public abstract readonly httpApiId: string;
  /**
   * API URL
   */
  public abstract readonly url: string;
}

/**
 * API properties
 */
export interface HttpApiProps extends cdk.StackProps {
  /**
   * A name for the HTTP API resoruce
   *
   * @default - ID of the HttpApi construct.
   */
  readonly apiName?: string;
  /**
   * API protocol
   *
   * @default HTTP
   */
  readonly protocol?: ProtocolType;
  /**
   * target lambda function for lambda proxy integration.
   *
   * @default - None. Specify either `targetHandler` or `targetUrl`
   */
  readonly targetHandler?: lambda.IFunction;

  /**
   * target URL for HTTP proxy integration.
   *
   * @default - None. Specify either `targetHandler` or `targetUrl`
   */
  readonly targetUrl?: string;
}

/**
 * protocol types for the Amazon API Gateway HTTP API
 */
export enum ProtocolType {
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
 * HTTPApi Resource Class
 *
 * @resource AWS::ApiGatewayV2::Api
 */
export class HttpApi extends ApiBase implements IHttpApi {
  /**
   * import from ApiId
   */
  public static fromApiId(scope: cdk.Construct, id: string, httpApiId: string): IHttpApi {
    class Import extends cdk.Resource implements IHttpApi {
      public readonly httpApiId = httpApiId;
    }
    return new Import(scope, id);
  }
  /**
   * the API identifer
   */
  public readonly httpApiId: string;
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
  /**
   * root route
   */
  public root?: apigatewayv2.IRouteBase;

  constructor(scope: cdk.Construct, id: string, props?: HttpApiProps) {
    super(scope, id, {
      physicalName: props?.apiName || id,
    });

    // if ((!props) ||
    // (props!.targetHandler && props!.targetUrl) ||
    // (props!.targetHandler === undefined && props!.targetUrl === undefined)) {
    //   throw new Error('You must specify either a targetHandler or targetUrl, use at most one');
    // }

    if (props?.targetHandler && props?.targetUrl) {
      throw new Error('You must specify either a targetHandler or targetUrl, use at most one');
    }

    this.region = cdk.Stack.of(this).region;
    this.partition = this.isChina() ? 'aws-cn' : 'aws';
    this.account = cdk.Stack.of(this).account;
    this.awsdn = this.isChina() ? 'amazonaws.com.cn' : 'amazonaws.com';

    const apiProps: CfnApiProps = {
      name: this.physicalName,
      protocolType: props?.protocol ?? ProtocolType.HTTP,
      target: props?.targetHandler ? props?.targetHandler.functionArn : props?.targetUrl ?? undefined
    };
    const api = new apigatewayv2.CfnApi(this, 'Resource', apiProps );
    this.httpApiId = api.ref;

    this.url = `https://${this.httpApiId}.execute-api.${this.region}.${this.awsdn}`;

    if (props?.targetHandler) {
      new lambda.CfnPermission(this, 'Permission', {
        action: 'lambda:InvokeFunction',
        principal: 'apigateway.amazonaws.com',
        functionName: props!.targetHandler.functionName,
        sourceArn: `arn:${this.partition}:execute-api:${this.region}:${this.account}:${this.httpApiId}/*/*`,
      });
    }
  }

  private isChina(): boolean {
    const region = this.stack.region;
    return !cdk.Token.isUnresolved(region) && region.startsWith('cn-');
  }
}