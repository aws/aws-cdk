import { Construct } from 'constructs';
import { IAlias } from './alias';
import { IFunction } from './function-base';
import { IVersion } from './lambda-version';
import { CfnUrl } from './lambda.generated';
import * as iam from '../../aws-iam';
import { Duration, IResource, Resource } from '../../core';

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
 * The invoke modes for a Lambda function
 */
export enum InvokeMode {
  /**
   * Default option. Lambda invokes your function using the Invoke API operation.
   * Invocation results are available when the payload is complete.
   * The maximum payload size is 6 MB.
   */
  BUFFERED = 'BUFFERED',

  /**
   * Your function streams payload results as they become available.
   * Lambda invokes your function using the InvokeWithResponseStream API operation.
   * The maximum response payload size is 20 MB, however, you can request a quota increase.
   */
  RESPONSE_STREAM = 'RESPONSE_STREAM',
}

/**
 * All http request methods
 */
export enum HttpMethod {
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
  /**
   * The PATCH method applies partial modifications to a resource.
   */
  PATCH = 'PATCH',
  /**
   * The OPTIONS method describes the communication options for the target resource.
   */
  OPTIONS = 'OPTIONS',
  /**
   * The wildcard entry to allow all methods.
   */
  ALL = '*',
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
   * @default - [HttpMethod.ALL]
   */
  readonly allowedMethods?: HttpMethod[];

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
   * @default - Browser default of 5 seconds.
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

  /**
   * The authType of the function URL, used for access control
   *
   * @attribute AuthType
   */
  readonly authType: FunctionUrlAuthType;

  /**
   * Grant the given identity permissions to invoke this Lambda Function URL
   */
  grantInvokeUrl(identity: iam.IGrantable): iam.Grant;
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

  /**
   * The type of invocation mode that your Lambda function uses.
   *
   * @default InvokeMode.BUFFERED
   */
  readonly invokeMode?: InvokeMode;
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

  /**
   * The authentication type used for this Function URL
   */
  public readonly authType: FunctionUrlAuthType;

  private readonly function: IFunction;

  constructor(scope: Construct, id: string, props: FunctionUrlProps) {
    super(scope, id);

    if (this.instanceOfVersion(props.function)) {
      throw new Error('FunctionUrl cannot be used with a Version');
    }

    // If the target function is an alias, then it must be configured using the underlying function
    // ARN, and the alias name as a qualifier.
    const { targetFunction, alias } = this.instanceOfAlias(props.function)
      ? { targetFunction: props.function.version.lambda, alias: props.function }
      : { targetFunction: props.function, alias: undefined };

    this.authType = props.authType ?? FunctionUrlAuthType.AWS_IAM;

    const resource: CfnUrl = new CfnUrl(this, 'Resource', {
      authType: this.authType,
      cors: props.cors ? this.renderCors(props.cors) : undefined,
      invokeMode: props.invokeMode,
      targetFunctionArn: targetFunction.functionArn,
      qualifier: alias?.aliasName,
    });
    // The aliasName is a required physical name, so using it does not imply a dependency, so we
    // must "manually" register the dependency, or else CFN may attempt to use before it exists.
    if (alias?.node.defaultChild != null) {
      resource.node.addDependency(alias.node.defaultChild);
    }

    this.url = resource.attrFunctionUrl;
    this.functionArn = resource.attrFunctionArn;
    this.function = props.function;

    if (props.authType === FunctionUrlAuthType.NONE) {
      props.function.addPermission('invoke-function-url', {
        principal: new iam.AnyPrincipal(),
        action: 'lambda:InvokeFunctionUrl',
        functionUrlAuthType: props.authType,
      });
    }
  }

  public grantInvokeUrl(grantee: iam.IGrantable): iam.Grant {
    return this.function.grantInvokeUrl(grantee);
  }

  private instanceOfVersion(fn: IFunction): fn is IVersion {
    return 'version' in fn && !this.instanceOfAlias(fn);
  }

  private instanceOfAlias(fn: IFunction): fn is IAlias {
    return 'aliasName' in fn;
  }

  private renderCors(cors: FunctionUrlCorsOptions): CfnUrl.CorsProperty {
    if (cors.maxAge && !cors.maxAge.isUnresolved() && cors.maxAge.toSeconds() > 86400) {
      throw new Error(`FunctionUrl CORS maxAge should be less than or equal to 86400 secs (got ${cors.maxAge.toSeconds()})`);
    }

    return {
      allowCredentials: cors.allowCredentials,
      allowHeaders: cors.allowedHeaders,
      allowMethods: cors.allowedMethods ?? [HttpMethod.ALL],
      allowOrigins: cors.allowedOrigins,
      exposeHeaders: cors.exposedHeaders,
      maxAge: cors.maxAge?.toSeconds(),
    };
  }
}
