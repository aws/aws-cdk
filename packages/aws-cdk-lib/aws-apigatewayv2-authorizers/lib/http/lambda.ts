import {
  HttpAuthorizer,
  HttpAuthorizerType,
  HttpRouteAuthorizerBindOptions,
  HttpRouteAuthorizerConfig,
  IHttpRouteAuthorizer,
  AuthorizerPayloadVersion,
  IHttpApi,
} from '../../../aws-apigatewayv2';
import { ServicePrincipal } from '../../../aws-iam';
import { IFunction } from '../../../aws-lambda';
import { Stack, Duration, Names } from '../../../core';

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
   * Friendly authorizer name
   * @default - same value as `id` passed in the constructor.
   */
  readonly authorizerName?: string;

  /**
   * The identity source for which authorization is requested.
   *
   * @default ['$request.header.Authorization']
   */
  readonly identitySource?: string[];

  /**
   * How long APIGateway should cache the results. Max 1 hour.
   * Disable caching by setting this to `Duration.seconds(0)`.
   *
   * @default Duration.minutes(5)
   */
  readonly resultsCacheTtl?: Duration;

  /**
   * The payload format version
   *
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html#http-api-lambda-authorizer.payload-format
   *
   * Note: if `responseType` is set to simple, then
   * setting this property to version 1.0 is not allowed.
   *
   * @default - if `responseType` is not set or is set to IAM,
   * then payload format version is set to 1.0. If `responseType`
   * is set to simple, then payload format version is set to 2.0.
   */
  readonly payloadFormatVersion?: AuthorizerPayloadVersion;

  /**
   * The type of response the lambda can return
   *
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html#http-api-lambda-authorizer.payload-format-response
   *
   * Note: if `payloadFormatVersion` is set to version 1.0, then
   * setting this property to simple is not allowed.
   *
   * @default - if `payloadFormatVersion` is not set or is set to 1.0,
   * then response type is set to IAM. If `payloadFormatVersion`
   * is set to 2.0, then response type is set to simple.
   */
  readonly responseType?: HttpLambdaResponseType;
}

/**
 * Authorize Http Api routes via a lambda function
 */
export class HttpLambdaAuthorizer implements IHttpRouteAuthorizer {
  private authorizer?: HttpAuthorizer;
  private httpApi?: IHttpApi;

  /**
   * Initialize a lambda authorizer to be bound with HTTP route.
   * @param id The id of the underlying construct
   * @param pool The lambda function handler to use for authorization
   * @param props Properties to configure the authorizer
   */
  constructor(
    private readonly id: string,
    private readonly handler: IFunction,
    private readonly props: HttpLambdaAuthorizerProps = {}) {
    if (props.payloadFormatVersion === AuthorizerPayloadVersion.VERSION_1_0 && props.responseType === HttpLambdaResponseType.SIMPLE) {
      throw new Error('payload format version is set to 1.0 but response type is set to SIMPLE');
    }
  }

  public bind(options: HttpRouteAuthorizerBindOptions): HttpRouteAuthorizerConfig {
    if (this.httpApi && (this.httpApi.apiId !== options.route.httpApi.apiId)) {
      throw new Error('Cannot attach the same authorizer to multiple Apis');
    }

    if (!this.authorizer) {
      let enableSimpleResponses: boolean;
      let payloadFormatVersion: AuthorizerPayloadVersion;

      const payloadFormatVersionInner = this.props.payloadFormatVersion;
      const responseType = this.props.responseType;

      if (payloadFormatVersionInner === undefined) {
        enableSimpleResponses = responseType === HttpLambdaResponseType.SIMPLE;
        payloadFormatVersion = enableSimpleResponses ? AuthorizerPayloadVersion.VERSION_2_0 : AuthorizerPayloadVersion.VERSION_1_0;
      } else if (responseType === undefined) {
        enableSimpleResponses = payloadFormatVersionInner === AuthorizerPayloadVersion.VERSION_2_0;
        payloadFormatVersion = payloadFormatVersionInner;
      } else {
        // No need to check here whether payload format version is 1.0
        // and response type is simple since this is already handled
        // by the constructor
        enableSimpleResponses = responseType === HttpLambdaResponseType.SIMPLE;
        payloadFormatVersion = payloadFormatVersionInner;
      }

      this.httpApi = options.route.httpApi;
      this.authorizer = new HttpAuthorizer(options.scope, this.id, {
        httpApi: options.route.httpApi,
        identitySource: this.props.identitySource ?? [
          '$request.header.Authorization',
        ],
        type: HttpAuthorizerType.LAMBDA,
        authorizerName: this.props.authorizerName ?? this.id,
        enableSimpleResponses,
        payloadFormatVersion,
        authorizerUri: lambdaAuthorizerArn(this.handler),
        resultsCacheTtl: this.props.resultsCacheTtl ?? Duration.minutes(5),
      });

      this.handler.addPermission(`${Names.nodeUniqueId(this.authorizer.node)}-Permission`, {
        scope: options.scope,
        principal: new ServicePrincipal('apigateway.amazonaws.com'),
        sourceArn: Stack.of(options.route).formatArn({
          service: 'execute-api',
          resource: options.route.httpApi.apiId,
          resourceName: `authorizers/${this.authorizer.authorizerId}`,
        }),
      });
    }

    return {
      authorizerId: this.authorizer.authorizerId,
      authorizationType: 'CUSTOM',
    };
  }
}

/**
 * constructs the authorizerURIArn.
 */
function lambdaAuthorizerArn(handler: IFunction) {
  return `arn:${Stack.of(handler).partition}:apigateway:${Stack.of(handler).region}:lambda:path/2015-03-31/functions/${handler.functionArn}/invocations`;
}
