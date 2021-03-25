import {
  HttpAuthorizer,
  HttpAuthorizerType,
  HttpRouteAuthorizerType,
  HttpRouteAuthorizerBindOptions,
  HttpRouteAuthorizerConfig,
  IHttpRouteAuthorizer,
  AuthorizerPayloadVersion,
} from '@aws-cdk/aws-apigatewayv2';
import { IFunction } from '@aws-cdk/aws-lambda';
import { Token, Stack, Duration } from '@aws-cdk/core';

/**
 * Specifies the type of lambda authorizer
 */
export enum HttpLambdaAuthorizerType {
  /** Returns simple boolean response */
  SIMPLE,

  /** Returns an IAM Policy */
  AWS_IAM,
}

/**
 * Properties to initialize HttpTokenAuthorizer.
 */
export interface HttpLambdaAuthorizerProps {

  /**
   * The name of the authorizer
   * @default 'LambdaAuthorizer'
   */
  readonly authorizerName?: string;

  /**
   * The identity source for which authorization is requested.
   *
   * @default ['$request.header.Authorization']
   */
  readonly identitySource?: string[];

  /**
   * Specifies the format of the payload sent to an HTTP API Lambda authorizer.
   *
   * @default - 2.0
   */
  readonly payloadFormatVersion?: AuthorizerPayloadVersion;

  /**
   * The lambda function used for authorization
   */
  readonly handler: IFunction;

  /**
   * How long APIGateway should cache the results. Max 1 hour.
   * Disable caching by setting this to 0.
   *
   * @default Duration.minutes(5)
   */
  readonly resultsCacheTtl?: Duration;

  /**
   * Type of lambda authorizer
   */
  readonly type: HttpLambdaAuthorizerType;
}

/**
 * Authorize Http Api routes via a lambda function
 */
export class HttpLambdaAuthorizer implements IHttpRouteAuthorizer {
  private authorizer?: HttpAuthorizer;

  constructor(private readonly props: HttpLambdaAuthorizerProps) {
    if (props.type === HttpLambdaAuthorizerType.SIMPLE && props.payloadFormatVersion === AuthorizerPayloadVersion.VERSION_1_0) {
      throw new Error('The simple authorizer type can only be used with payloadFormatVersion 2.0');
    }
  }

  public bind(options: HttpRouteAuthorizerBindOptions): HttpRouteAuthorizerConfig {
    if (!this.authorizer) {
      const id = this.props.authorizerName && !Token.isUnresolved(this.props.authorizerName) ?
        this.props.authorizerName : 'LambdaAuthorizer';

      this.authorizer = new HttpAuthorizer(options.scope, id, {
        httpApi: options.route.httpApi,
        identitySource: this.props.identitySource ?? [
          '$request.header.Authorization',
        ],
        type: HttpAuthorizerType.LAMBDA,
        authorizerName: this.props.authorizerName,
        enableSimpleResponses:
          this.props.type === HttpLambdaAuthorizerType.SIMPLE,
        payloadFormatVersion:
          this.props.payloadFormatVersion ??
          AuthorizerPayloadVersion.VERSION_2_0,
        authorizerUri: lambdaAuthorizerArn(this.props.handler),
        resultsCacheTtl: this.props.resultsCacheTtl ?? Duration.minutes(5),
      });
    }

    return {
      authorizerId: this.authorizer.authorizerId,
      authorizationType: HttpRouteAuthorizerType.LAMBDA,
    };
  }
}

/**
 * constructs the authorizerURIArn.
 */
function lambdaAuthorizerArn(handler: IFunction) {
  return `arn:${Stack.of(handler).partition}:apigateway:${Stack.of(handler).region}:lambda:path/2015-03-31/functions/${handler.functionArn}/invocations`;
}
