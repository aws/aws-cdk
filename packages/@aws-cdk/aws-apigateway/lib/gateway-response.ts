import { Construct, Resource } from '@aws-cdk/core';
import { CfnGatewayResponse } from './apigateway.generated';
import { IRestApi } from './restapi';

/**
 * Properties for a new gateway response.
 */
export interface GatewayResponseProps extends GatewayResponseOptions {
  /**
   * Rest api resource to target.
   */
  readonly restApi: IRestApi;

  /**
   * Name of the gateway response.
   * @default - Auto generated
   */
  readonly gatewayResponseName?: string;
}

/**
 * Options to add gateway response.
 */
export interface GatewayResponseOptions {
  /**
   * Response type to associate with gateway response.
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/supported-gateway-response-types.html
   */
  readonly type: ResponseType;

  /**
   * Http status code for response.
   * @default - standart http status code for the response type.
   */
  readonly statusCode?: string;

  /**
   * Custom path, query and headers for response.
   * @default - No custom paramter will be added to response.
   */
  readonly parameters?: { [key: string]: string };

  /**
   * Custom templates to get mapped as response.
   * @default - Default reponse will be mapped
   */
  readonly templates?: { [key: string]: string };

}

/**
 * This resource creates a gateway response which will be applied to response from api gateway
 * as per the configuration based on the response type.
 * You will probably want to use `RestApi.addGatewayResponse` for adding new gateway response.
 *
 * @resource AWS::ApiGateway::GatewayResponse
 */
export class GatewayResponse extends Resource {
  constructor(scope: Construct, id: string, props: GatewayResponseProps) {
    super(scope, id, {
      physicalName: props.gatewayResponseName
    });

    const resource = new CfnGatewayResponse(this, 'Resource', {
      restApiId: props.restApi.restApiId,
      responseType: props.type,
      responseParameters: props.parameters,
      responseTemplates: props.templates,
      statusCode: props.statusCode
    });

    this.node.defaultChild = resource;
  }
}

/**
 * Supported types of gateway responses.
 */
export enum ResponseType {
  /**
   * The gateway response for authorization failure.
   */
  ACCESS_DENIED = 'ACCESS_DENIED',

  /**
   * The gateway response for an invalid API configuration.
   */
  API_CONFIGURATION_ERROR = 'API_CONFIGURATION_ERROR',

  /**
   * The gateway response when a custom or Amazon Cognito authorizer failed to authenticate the caller.
   */
  AUTHORIZER_FAILURE = 'AUTHORIZER_FAILURE',

  /**
   * The gateway response for failing to connect to a custom or Amazon Cognito authorizer.
   */
  AUTHORIZER_CONFIGURATION_ERROR = 'AUTHORIZER_CONFIGURATION_ERROR',

  /**
   * The gateway response when the request parameter cannot be validated according to an enabled request validator.
   */
  BAD_REQUEST_PARAMETERS = 'BAD_REQUEST_PARAMETERS',

  /**
   * The gateway response when the request body cannot be validated according to an enabled request validator.
   */
  BAD_REQUEST_BODY = 'BAD_REQUEST_BODY',

  /**
   * The default gateway response for an unspecified response type with the status code of 4XX.
   */
  DEFAULT_4XX = 'DEFAULT_4XX',

  /**
   * The default gateway response for an unspecified response type with a status code of 5XX.
   */
  DEFAULT_5XX = 'DEFAULT_5XX',

  /**
   * The gateway response for an AWS authentication token expired error.
   */
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',

  /**
   * The gateway response for an invalid AWS signature error.
   */
  INVALID_SIGNATURE = 'INVALID_SIGNATURE',

  /**
   * The gateway response for an integration failed error.
   */
  INTEGRATION_FAILURE = 'INTEGRATION_FAILURE',

  /**
   * The gateway response for an integration timed out error.
   */
  INTEGRATION_TIMEOUT = 'INTEGRATION_TIMEOUT',

  /**
   * The gateway response for an invalid API key submitted for a method requiring an API key.
   */
  INVALID_API_KEY = 'INVALID_API_KEY',

  /**
   * The gateway response for a missing authentication token error,
   * including the cases when the client attempts to invoke an unsupported API method or resource.
   */
  MISSING_AUTHENTICATION_TOKEN = 'MISSING_AUTHENTICATION_TOKEN',

  /**
   * The gateway response for the usage plan quota exceeded error.
   */
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',

  /**
   * The gateway response for the request too large error.
   */
  REQUEST_TOO_LARGE = 'REQUEST_TOO_LARGE',

  /**
   * The gateway response when API Gateway cannot find the specified resource
   * after an API request passes authentication and authorization.
   */
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',

  /**
   * The gateway response when usage plan, method, stage, or account level throttling limits exceeded.
   */
  THROTTLED = 'THROTTLED',

  /**
   * The gateway response when the custom or Amazon Cognito authorizer failed to authenticate the caller.
   */
  UNAUTHORIZED = 'UNAUTHORIZED',

  /**
   * The gateway response when a payload is of an unsupported media type, if strict passthrough behavior is enabled.
   */
  UNSUPPORTED_MEDIA_TYPE = 'UNSUPPORTED_MEDIA_TYPE',

  /**
   * The gateway response when a request is blocked by AWS WAF.
   */
  WAF_FILTERED = 'WAF_FILTERED'
}