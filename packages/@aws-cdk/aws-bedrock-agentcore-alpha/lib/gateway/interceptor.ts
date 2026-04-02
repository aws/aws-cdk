import type { IFunction } from 'aws-cdk-lib/aws-lambda';
import type { Construct } from 'constructs';
import type { IGateway } from './gateway-base';

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
 * Represents an interceptor that can be bound to a Gateway
 *
 * Interceptors allow custom code execution at specific points in the gateway request/response flow.
 */
export interface IInterceptor {
  /**
   * The interception point where this interceptor will be invoked
   */
  readonly interceptionPoint: InterceptionPoint;

  /**
   * Binds this interceptor to a Gateway
   *
   * This method is called when the interceptor is added to a gateway. It should:
   * 1. Grant any necessary permissions (e.g., Lambda invoke permissions)
   * 2. Perform any required setup
   * 3. Return the CloudFormation configuration
   *
   * @param scope The construct scope for creating any required resources
   * @param gateway The gateway this interceptor is being bound to [disable-awslint:prefer-ref-interface]
   * @returns Configuration that will be rendered to CloudFormation
   */
  bind(scope: Construct, gateway: IGateway): InterceptorBindConfig;
}

/**
 * Configuration returned from binding an interceptor to a Gateway
 */
export interface InterceptorBindConfig {
  /**
   * The CloudFormation configuration for this interceptor
   */
  readonly configuration: any;
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
export class LambdaInterceptor implements IInterceptor {
  /**
   * Create a REQUEST interceptor that executes before the gateway calls the target
   *
   * **Important:** When this interceptor is added to a gateway, the gateway's IAM role
   * will automatically be granted `lambda:InvokeFunction` permission on the specified
   * Lambda function.
   *
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
   *
   * **Important:** When this interceptor is added to a gateway, the gateway's IAM role
   * will automatically be granted `lambda:InvokeFunction` permission on the specified
   * Lambda function.
   *
   * @param lambdaFunction The Lambda function to invoke
   * @param options Optional configuration for the interceptor
   * @returns A configured LambdaInterceptor for response interception
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
  private readonly lambdaFunction: IFunction;

  /**
   * Whether to pass request headers to the interceptor
   *
   * @default false - Headers are not passed for security
   */
  private readonly passRequestHeaders: boolean;

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
   * Binds this Lambda interceptor to a Gateway
   *
   * This method:
   * 1. Grants the Gateway's IAM role permission to invoke the Lambda function
   * 2. Returns the CloudFormation configuration for this interceptor
   *
   * @param _scope The construct scope (currently unused, reserved for future extensions)
   * @param gateway The gateway this interceptor is being bound to
   * @returns Configuration for CloudFormation rendering
   */
  public bind(_scope: Construct, gateway: IGateway): InterceptorBindConfig {
    // Grant Lambda invoke permission to the Gateway's role
    this.lambdaFunction.grantInvoke(gateway.role);

    // Return CloudFormation configuration
    return {
      configuration: {
        interceptionPoints: [this.interceptionPoint],
        interceptor: {
          lambda: {
            arn: this.lambdaFunction.functionArn,
          },
        },
        inputConfiguration: {
          passRequestHeaders: this.passRequestHeaders,
        },
      },
    };
  }
}
