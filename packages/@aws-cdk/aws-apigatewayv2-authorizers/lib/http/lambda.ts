import {
  HttpAuthorizer,
  HttpAuthorizerType,
  HttpRouteAuthorizerType,
  HttpRouteAuthorizerBindOptions,
  HttpRouteAuthorizerConfig,
  IHttpRouteAuthorizer,
  AuthorizerPayloadVersion,
  IHttpApi,
} from '@aws-cdk/aws-apigatewayv2';
import { IFunction } from '@aws-cdk/aws-lambda';
import { Duration } from '@aws-cdk/core';

/**
 * Specifies the type responses the lambda returns
 */
export enum HttpLambdaResponseType {
  /** Returns simple boolean response */
  SIMPLE,

  /** Returns an IAM Policy */
  IAM,
}

/**
 * Properties to initialize HttpTokenAuthorizer.
 */
export interface HttpLambdaAuthorizerProps {

  /**
   * The name of the authorizer
   */
  readonly authorizerName: string;

  /**
   * The identity source for which authorization is requested.
   *
   * @default ['$request.header.Authorization']
   */
  readonly identitySource?: string[];

  /**
   * The lambda function used for authorization
   */
  readonly handler: IFunction;

  /**
   * How long APIGateway should cache the results. Max 1 hour.
   * Disable caching by setting this to `Duration.seconds(0)`.
   *
   * @default Duration.minutes(5)
   */
  readonly resultsCacheTtl?: Duration;

  /**
   * The types of responses the lambda can return
   *
   * If HttpLambdaResponseType.SIMPLE is included then
   * response format 2.0 will be used.
   *
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html#http-api-lambda-authorizer.payload-format-response
   *
   * @default [HttpLambdaResponseType.IAM]
   */
  readonly responseTypes?: HttpLambdaResponseType[];
}

/**
 * Authorize Http Api routes via a lambda function
 */
export class HttpLambdaAuthorizer implements IHttpRouteAuthorizer {
  private authorizer?: HttpAuthorizer;
  private httpApi?: IHttpApi;

  constructor(private readonly props: HttpLambdaAuthorizerProps) {
  }

  public bind(options: HttpRouteAuthorizerBindOptions): HttpRouteAuthorizerConfig {
    if (this.httpApi && (this.httpApi.apiId !== options.route.httpApi.apiId)) {
      throw new Error('Cannot attach the same authorizer to multiple Apis');
    }

    if (!this.authorizer) {
      const id = this.props.authorizerName;

      const responseTypes = this.props.responseTypes ?? [HttpLambdaResponseType.IAM];
      const enableSimpleResponses = responseTypes.includes(HttpLambdaResponseType.SIMPLE) || undefined;

      this.httpApi = options.route.httpApi;
      this.authorizer = new HttpAuthorizer(options.scope, id, {
        httpApi: options.route.httpApi,
        identitySource: this.props.identitySource ?? [
          '$request.header.Authorization',
        ],
        type: HttpAuthorizerType.LAMBDA,
        authorizerName: this.props.authorizerName,
        enableSimpleResponses,
        payloadFormatVersion: enableSimpleResponses ? AuthorizerPayloadVersion.VERSION_2_0 : AuthorizerPayloadVersion.VERSION_1_0,
        authorizerUri: this.props.handler.invocationUri,
        resultsCacheTtl: this.props.resultsCacheTtl ?? Duration.minutes(5),
      });
    }

    return {
      authorizerId: this.authorizer.authorizerId,
      authorizationType: HttpRouteAuthorizerType.LAMBDA,
    };
  }
}

