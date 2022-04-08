import * as iam from '@aws-cdk/aws-iam';
import { Duration, IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAlias } from './alias';
import { IFunction } from './function-base';
import { IVersion } from './lambda-version';
import { CfnUrl } from './lambda.generated';


/**
 * The auth types for a function url
 */
export enum FunctionUrlAuthType {
  /**
   * Restrict access to authenticated IAM users only
   */
  AWS_IAM = 'AWS_IAM',

  /**
   * Bypass IAM authentication to create a public endpoint
   */
  NONE = 'NONE',
}

/**
 * All http request methods
 */
export enum HttpMethods {
  /**
   * The GET method requests a representation of the specified resource.
   */
  GET = 'GET',
  /**
   * The PUT method replaces all current representations of the target resource with the request payload.
   */
  PUT = 'PUT',
  /**
   * The HEAD method asks for a response identical to that of a GET request, but without the response body.
   */
  HEAD = 'HEAD',
  /**
   * The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.
   */
  POST = 'POST',
  /**
   * The DELETE method deletes the specified resource.
   */
  DELETE = 'DELETE',
}

/**
 * Specifies a cross-origin access property for a function URL
 */
export interface FunctionUrlCorsOptions {
  /**
   * Whether to allow cookies or other credentials in requests to your function URL.
   *
   * @default false
   */
  readonly allowCredentials?: boolean;

  /**
   * Headers that are specified in the Access-Control-Request-Headers header.
   *
   * @default - No headers allowed.
   */
  readonly allowedHeaders?: string[];

  /**
   * An HTTP method that you allow the origin to execute.
   *
   * @default - No methods allowed.
   */
  readonly allowedMethods?: HttpMethods[];

  /**
   * One or more origins you want customers to be able to access the bucket from.
   *
   * @default - No origins allowed.
   */
  readonly allowedOrigins?: string[];

  /**
   * One or more headers in the response that you want customers to be able to access from their applications.
   *
   * @default - No headers exposed.
   */
  readonly exposedHeaders?: string[];

  /**
   * The time in seconds that your browser is to cache the preflight response for the specified resource.
   *
   * @default - No caching.
   */
  readonly maxAge?: Duration;
}

/**
 * A Lambda function Url
 */
export interface IFunctionUrl extends IResource {
  /**
   * The url of the Lambda function.
   *
   * @attribute FunctionUrl
   */
  readonly url: string;

  /**
   * The ARN of the function this URL refers to
   *
   * @attribute FunctionArn
   */
  readonly functionArn: string;
}

/**
 * Options to add a url to a Lambda function
 */
export interface FunctionUrlOptions {
  /**
   * The type of authentication that your function URL uses.
   *
   * @default FunctionUrlAuthType.AWS_IAM
   */
  readonly authType?: FunctionUrlAuthType;

  /**
   * The cross-origin resource sharing (CORS) settings for your function URL.
   *
   * @default - No CORS configuration.
   */
  readonly cors?: FunctionUrlCorsOptions;
}

/**
 * Properties for a FunctionUrl
 */
export interface FunctionUrlProps extends FunctionUrlOptions {
  /**
   * The function to which this url refers.
   * It can also be an `Alias` but not a `Version`.
   */
  readonly function: IFunction;
}

/**
 * Defines a Lambda function url
 *
 * @resource AWS::Lambda::Url
 */
export class FunctionUrl extends Resource implements IFunctionUrl {
  /**
   * The url of the Lambda function.
   */
  public readonly url: string;

  /**
   * The ARN of the function this URL refers to
   */
  public readonly functionArn: string;

  constructor(scope: Construct, id: string, props: FunctionUrlProps) {
    super(scope, id);

    if (this.instanceOfVersion(props.function)) {
      throw new Error('FunctionUrl cannot be used with a Version');
    }

    let qualifier: string | undefined = undefined;
    if (this.instanceOfAlias(props.function)) {
      qualifier = props.function.aliasName;
    }

    const resource: CfnUrl = new CfnUrl(this, 'Resource', {
      authType: props.authType ?? FunctionUrlAuthType.AWS_IAM,
      targetFunctionArn: props.function.functionArn,
      qualifier,
      cors: props.cors ? this.renderCors(props.cors) : undefined,
    });

    this.url = resource.attrFunctionUrl;
    this.functionArn = resource.attrFunctionArn;

    if (props.authType === FunctionUrlAuthType.NONE) {
      props.function.addPermission('invoke-function-url', {
        principal: new iam.AnyPrincipal(),
        action: 'lambda:InvokeFunctionUrl',
        functionUrlAuthType: props.authType,
      });
    }
  }

  private instanceOfVersion(fn: IFunction): fn is IVersion {
    return 'version' in fn && !this.instanceOfAlias(fn);
  }

  private instanceOfAlias(fn: IFunction): fn is IAlias {
    return 'aliasName' in fn;
  }


  private renderCors(cors: FunctionUrlCorsOptions): CfnUrl.CorsProperty {
    return {
      allowCredentials: cors.allowCredentials,
      allowHeaders: cors.allowedHeaders,
      allowMethods: cors.allowedMethods,
      allowOrigins: cors.allowedOrigins,
      exposeHeaders: cors.exposedHeaders,
      maxAge: cors.maxAge?.toSeconds(),
    };
  }
}