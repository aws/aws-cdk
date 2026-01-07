import { CfnGateway } from 'aws-cdk-lib/aws-bedrockagentcore';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { ValidationError } from './validation-helpers';

/**
 * Interception points for gateway interceptors.
 *
 * Interceptors allow custom code execution during gateway invocations,
 * useful for access control, request/response transformation, and custom authorization.
 */
export enum InterceptionPoint {
  /**
   * Request interceptor.
   * Invoked before the gateway makes a call to the target.
   * Can be used for custom validations or authorizations.
   */
  REQUEST = 'REQUEST',

  /**
   * Response interceptor.
   * Invoked before the gateway responds to the caller.
   * Can be used for custom redactions or additions to the response.
   */
  RESPONSE = 'RESPONSE',
}

/**
 * Abstract interface for gateway interceptor configuration
 */
export interface IGatewayInterceptorConfig {
  /**
   * The Lambda function used as the interceptor
   */
  readonly lambdaFunction: IFunction;

  /**
   * Returns internal info as the CFN interceptor configuration object
   * @internal
   */
  _render(): CfnGateway.GatewayInterceptorConfigurationProperty;
}

/**
 * Configuration options for interceptor input
 */
export interface InterceptorInputOptions {
  /**
   * Whether to pass request headers to the interceptor Lambda function.
   *
   * When enabled, all request headers will be included in the interceptor function input payload.
   *
   * **Security Warning**: Exercise caution when enabling this feature as request headers
   * may contain sensitive information such as authentication tokens and credentials.
   *
   * @default false
   */
  readonly passRequestHeaders?: boolean;
}

/**
 * Properties for creating a Lambda interceptor
 */
export interface LambdaInterceptorProps {
  /**
   * The Lambda function to use as the interceptor.
   *
   * The Lambda function will be invoked during gateway invocations at the specified interception points.
   */
  readonly lambdaFunction: IFunction;

  /**
   * The points at which the interceptor should be invoked.
   */
  readonly interceptionPoints: InterceptionPoint[];

  /**
   * Configuration for the interceptor input.
   *
   * @default - Request headers are not passed to the interceptor
   */
  readonly inputConfiguration?: InterceptorInputOptions;
}

/**
 * Lambda interceptor configuration implementation
 */
class LambdaInterceptor implements IGatewayInterceptorConfig {
  public readonly lambdaFunction: IFunction;
  private readonly interceptionPoints: InterceptionPoint[];
  private readonly inputConfiguration?: InterceptorInputOptions;

  constructor(props: LambdaInterceptorProps) {
    this.lambdaFunction = props.lambdaFunction;
    this.interceptionPoints = props.interceptionPoints;
    this.inputConfiguration = props.inputConfiguration;

    this.validateInterceptionPoints();
  }

  /**
   * @internal
   */
  public _render(): CfnGateway.GatewayInterceptorConfigurationProperty {
    return {
      interceptionPoints: this.interceptionPoints,
      interceptor: {
        lambda: {
          arn: this.lambdaFunction.functionArn,
        },
      },
      ...(this.inputConfiguration && {
        inputConfiguration: {
          passRequestHeaders: this.inputConfiguration.passRequestHeaders ?? false,
        },
      }),
    };
  }

  /**
   * Validates the interception points configuration
   * @internal
   */
  private validateInterceptionPoints(): void {
    // Check for duplicates
    const uniquePoints = new Set(this.interceptionPoints);
    if (uniquePoints.size !== this.interceptionPoints.length) {
      throw new ValidationError('InterceptionPoints must not contain duplicate values');
    }
  }
}

/**
 * Factory class for creating Gateway Interceptors.
 */
export abstract class GatewayInterceptor {
  /**
   * Create a Lambda interceptor.
   *
   * The Lambda function will be invoked during gateway invocations at the specified interception points.
   */
  public static lambda(props: LambdaInterceptorProps): IGatewayInterceptorConfig {
    return new LambdaInterceptor(props);
  }
}
