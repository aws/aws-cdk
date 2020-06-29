import { Construct, Resource } from '@aws-cdk/core';

import { CfnAuthorizer } from '../apigatewayv2.generated';
import { IAuthorizer } from '../common/authorizer';

import { IWebSocketApi } from './api';

/**
 * Defines the properties required for defining an Api Gateway V2 Authorizer.
 *
 * This interface is used by the helper methods in `Api` and the sub-classes
 */
export interface WebSocketAuthorizerOptions {
  /**
   * Specifies the required credentials as an IAM role for API Gateway to invoke the authorizer.
   *
   * To specify an IAM role for API Gateway to assume, use the role's Amazon Resource Name (ARN).
   *
   * To use resource-based permissions on the Lambda function, specify null. Supported only for `REQUEST` authorizers.
   *
   * @default - no credentials
   */
  readonly authorizerCredentialsArn?: string;

  /**
   * The authorizer's Uniform Resource Identifier (URI).
   *
   * For `REQUEST` authorizers, this must be a well-formed Lambda function URI, for example,
   * `arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-west-2:{acct_id}:function:{function_name}/invocations`.
   *
   * In general, the URI has this form: `arn:aws:apigateway:{region}:lambda:path/{service_api}`, where `{region}` is the same as the region
   * hosting the Lambda function, path indicates that the remaining substring in the URI should be treated as the path to the resource,
   * including the initial `/`. For Lambda functions, this is usually of the form `/2015-03-31/functions/{function_arn}/invocations`.
   */
  readonly authorizerUri: string;

  /**
   * The identity source for which authorization is requested.
   *
   * For a `REQUEST` authorizer, this is optional. The value is a set of one or more mapping expressions of the specified request parameters.
   * Currently, the identity source can be headers, query string parameters, stage variables, and context parameters.
   * For example, if an Auth header and a Name query string parameter are defined as identity sources, this value is `route.request.header.Auth`,
   * `route.request.querystring.Name`. These parameters will be used to perform runtime validation for Lambda-based authorizers by verifying all
   * of the identity-related request parameters are present in the request, not null, and non-empty. Only when this is true does the authorizer
   * invoke the authorizer Lambda function. Otherwise, it returns a 401 Unauthorized response without calling the Lambda function.
   *
   * For JWT, a single entry that specifies where to extract the JSON Web Token (JWT) from inbound requests. Currently only header-based and query
   * parameter-based selections are supported, for example `$request.header.Authorization`.
   *
   * @default - no identity source found
   */
  readonly identitySource?: string[];

  /**
   * The name of the authorizer.
   */
  readonly authorizerName: string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Authorizer.
 */
export interface WebSocketAuthorizerProps extends WebSocketAuthorizerOptions {
  /**
   * Defines the api for this deployment.
   */
  readonly api: IWebSocketApi;
}

/**
 * An Api Mapping for an API. An API mapping relates a path of your custom domain name to a stage of your API.
 *
 * A custom domain name can have multiple API mappings, but the paths can't overlap.
 *
 * A custom domain can map only to APIs of the same protocol type.
 *
 * @resource AWS::ApiGatewayV2::Authorizer
 */
export class WebSocketAuthorizer extends Resource implements IAuthorizer {

  /**
   * Creates a new imported API
   *
   * @param scope scope of this imported resource
   * @param id identifier of the resource
   * @param authorizerId Identifier of the API Mapping
   */
  public static fromAuthorizerId(scope: Construct, id: string, authorizerId: string): IAuthorizer {
    class Import extends Resource implements IAuthorizer {
      public readonly authorizerId = authorizerId;
    }

    return new Import(scope, id);
  }

  /**
   * The ID of this API Gateway Api Mapping.
   */
  public readonly authorizerId: string;

  protected resource: CfnAuthorizer;

  constructor(scope: Construct, id: string, props: WebSocketAuthorizerProps) {
    super(scope, id);

    this.resource = new CfnAuthorizer(this, 'Resource', {
      identitySource: (props.identitySource ? props.identitySource : []),
      apiId: props.api.webSocketApiId,
      name: props.authorizerName,
      authorizerType: 'REQUEST',
      authorizerCredentialsArn: props.authorizerCredentialsArn,
      // TODO: authorizerResultTtlInSeconds: props.authorizerResultTtl.toSeconds(),
      authorizerUri: props.authorizerUri,
      // TODO: identityValidationExpression: props.identityValidationExpression
    });
    this.authorizerId = this.resource.ref;
  }
}