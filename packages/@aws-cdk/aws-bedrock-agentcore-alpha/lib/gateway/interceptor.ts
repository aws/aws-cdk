import { IFunction } from 'aws-cdk-lib/aws-lambda';

/******************************************************************************
 *                                Enums
 *****************************************************************************/

/**
 * The interception point where the interceptor will be invoked
 */
export enum InterceptionPoint {
  /**
   * Execute before the gateway makes a call to the target
   * Useful for request validation, transformation, or custom authorization
   */
  REQUEST = 'REQUEST',

  /**
   * Execute after the target responds but before the gateway sends the response back
   * Useful for response transformation, filtering, or adding custom headers
   */
  RESPONSE = 'RESPONSE',
}

/******************************************************************************
 *                                Interfaces
 *****************************************************************************/

/**
 * Options for configuring an interceptor
 */
export interface InterceptorOptions {
  /**
   * Whether to pass request headers to the interceptor Lambda function
   *
   * **Security Warning**: Request headers can contain sensitive information such as
   * authentication tokens and credentials. Only enable this if your interceptor needs
   * access to headers and you have verified that sensitive information is not logged
   * or exposed.
   *
   * @default false - Headers are not passed to interceptor for security
   */
  readonly passRequestHeaders?: boolean;
}

/**
 * Configuration for a Gateway interceptor
 */
export interface IInterceptorConfig {
  /**
   * The interception point (REQUEST or RESPONSE)
   */
  readonly interceptionPoint: InterceptionPoint;

  /**
   * The Lambda function to invoke for this interceptor
   */
  readonly lambdaFunction: IFunction;

  /**
   * Whether to pass request headers to the interceptor
   */
  readonly passRequestHeaders: boolean;

  /**
   * Renders the interceptor configuration for CloudFormation
   * @internal
   */
  _render(): any;
}

/******************************************************************************
 *                                Classes
 *****************************************************************************/

/**
 * A Lambda-based interceptor for Gateway
 *
 * Interceptors allow you to run custom code during each invocation of your gateway:
 * - REQUEST interceptors execute before calling the target
 * - RESPONSE interceptors execute after the target responds
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-interceptors.html
 */
export class LambdaInterceptor implements IInterceptorConfig {
  /**
   * Create a REQUEST interceptor that executes before the gateway calls the target
   * @param lambdaFunction The Lambda function to invoke
   * @param options Optional configuration for the interceptor
   * @returns A configured LambdaInterceptor for request interception
   */
  public static forRequest(
    lambdaFunction: IFunction,
    options?: InterceptorOptions,
  ): LambdaInterceptor {
    return new LambdaInterceptor(
      InterceptionPoint.REQUEST,
      lambdaFunction,
      options,
    );
  }

  /**
   * Create a RESPONSE interceptor that executes after the target responds
   * @param lambdaFunction The Lambda function to invoke
   * @param options Optional configuration for the interceptor
   * @returns A configured LambdaInterceptor for response interception
   *
   */
  public static forResponse(
    lambdaFunction: IFunction,
    options?: InterceptorOptions,
  ): LambdaInterceptor {
    return new LambdaInterceptor(
      InterceptionPoint.RESPONSE,
      lambdaFunction,
      options,
    );
  }

  /**
   * The interception point (REQUEST or RESPONSE)
   */
  public readonly interceptionPoint: InterceptionPoint;

  /**
   * The Lambda function to invoke for this interceptor
   */
  public readonly lambdaFunction: IFunction;

  /**
   * Whether to pass request headers to the interceptor
   *
   * @default false - Headers are not passed for security
   */
  public readonly passRequestHeaders: boolean;

  private constructor(
    interceptionPoint: InterceptionPoint,
    lambdaFunction: IFunction,
    options?: InterceptorOptions,
  ) {
    this.interceptionPoint = interceptionPoint;
    this.lambdaFunction = lambdaFunction;
    this.passRequestHeaders = options?.passRequestHeaders ?? false;
  }

  /**
   * Renders the interceptor configuration as CloudFormation properties
   * @internal
   */
  public _render(): any {
    return {
      interceptionPoints: [this.interceptionPoint],
      interceptor: {
        lambda: {
          arn: this.lambdaFunction.functionArn,
        },
      },
      inputConfiguration: {
        passRequestHeaders: this.passRequestHeaders,
      },
    };
  }
}
