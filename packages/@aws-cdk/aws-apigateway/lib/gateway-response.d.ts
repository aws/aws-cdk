import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IRestApi } from './restapi';
/**
 * Represents gateway response resource.
 */
export interface IGatewayResponse extends IResource {
}
/**
 * Properties for a new gateway response.
 */
export interface GatewayResponseProps extends GatewayResponseOptions {
    /**
     * Rest api resource to target.
     */
    readonly restApi: IRestApi;
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
     * @default - standard http status code for the response type.
     */
    readonly statusCode?: string;
    /**
     * Custom headers parameters for response.
     * @default - no headers
     */
    readonly responseHeaders?: {
        [key: string]: string;
    };
    /**
     * Custom templates to get mapped as response.
     * @default - Response from api will be returned without applying any transformation.
     */
    readonly templates?: {
        [key: string]: string;
    };
}
/**
 * Configure the response received by clients, produced from the API Gateway backend.
 *
 * @resource AWS::ApiGateway::GatewayResponse
 */
export declare class GatewayResponse extends Resource implements IGatewayResponse {
    constructor(scope: Construct, id: string, props: GatewayResponseProps);
    private buildResponseParameters;
}
/**
 * Supported types of gateway responses.
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/supported-gateway-response-types.html
 */
export declare class ResponseType {
    /**
     * The gateway response for authorization failure.
     */
    static readonly ACCESS_DENIED: ResponseType;
    /**
     * The gateway response for an invalid API configuration.
     */
    static readonly API_CONFIGURATION_ERROR: ResponseType;
    /**
     * The gateway response when a custom or Amazon Cognito authorizer failed to authenticate the caller.
     */
    static readonly AUTHORIZER_FAILURE: ResponseType;
    /**
     * The gateway response for failing to connect to a custom or Amazon Cognito authorizer.
     */
    static readonly AUTHORIZER_CONFIGURATION_ERROR: ResponseType;
    /**
     * The gateway response when the request parameter cannot be validated according to an enabled request validator.
     */
    static readonly BAD_REQUEST_PARAMETERS: ResponseType;
    /**
     * The gateway response when the request body cannot be validated according to an enabled request validator.
     */
    static readonly BAD_REQUEST_BODY: ResponseType;
    /**
     * The default gateway response for an unspecified response type with the status code of 4XX.
     */
    static readonly DEFAULT_4XX: ResponseType;
    /**
     * The default gateway response for an unspecified response type with a status code of 5XX.
     */
    static readonly DEFAULT_5XX: ResponseType;
    /**
     * The gateway response for an AWS authentication token expired error.
     */
    static readonly EXPIRED_TOKEN: ResponseType;
    /**
     * The gateway response for an invalid AWS signature error.
     */
    static readonly INVALID_SIGNATURE: ResponseType;
    /**
     * The gateway response for an integration failed error.
     */
    static readonly INTEGRATION_FAILURE: ResponseType;
    /**
     * The gateway response for an integration timed out error.
     */
    static readonly INTEGRATION_TIMEOUT: ResponseType;
    /**
     * The gateway response for an invalid API key submitted for a method requiring an API key.
     */
    static readonly INVALID_API_KEY: ResponseType;
    /**
     * The gateway response for a missing authentication token error,
     * including the cases when the client attempts to invoke an unsupported API method or resource.
     */
    static readonly MISSING_AUTHENTICATION_TOKEN: ResponseType;
    /**
     * The gateway response for the usage plan quota exceeded error.
     */
    static readonly QUOTA_EXCEEDED: ResponseType;
    /**
     * The gateway response for the request too large error.
     */
    static readonly REQUEST_TOO_LARGE: ResponseType;
    /**
     * The gateway response when API Gateway cannot find the specified resource
     * after an API request passes authentication and authorization.
     */
    static readonly RESOURCE_NOT_FOUND: ResponseType;
    /**
     * The gateway response when usage plan, method, stage, or account level throttling limits exceeded.
     */
    static readonly THROTTLED: ResponseType;
    /**
     * The gateway response when the custom or Amazon Cognito authorizer failed to authenticate the caller.
     */
    static readonly UNAUTHORIZED: ResponseType;
    /**
     * The gateway response when a payload is of an unsupported media type, if strict passthrough behavior is enabled.
     */
    static readonly UNSUPPORTED_MEDIA_TYPE: ResponseType;
    /**
     * The gateway response when a request is blocked by AWS WAF.
     */
    static readonly WAF_FILTERED: ResponseType;
    /** A custom response type to support future cases. */
    static of(type: string): ResponseType;
    /**
     * Valid value of response type.
     */
    readonly responseType: string;
    private constructor();
}
