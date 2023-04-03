import * as iam from '@aws-cdk/aws-iam';
import { Duration } from '@aws-cdk/core';
import { Method } from './method';
import { IVpcLink } from './vpc-link';
export interface IntegrationOptions {
    /**
     * A list of request parameters whose values are to be cached. It determines
     * request parameters that will make it into the cache key.
     */
    readonly cacheKeyParameters?: string[];
    /**
     * An API-specific tag group of related cached parameters.
     */
    readonly cacheNamespace?: string;
    /**
     * Specifies how to handle request payload content type conversions.
     *
     * @default none if this property isn't defined, the request payload is passed
     * through from the method request to the integration request without
     * modification, provided that the `passthroughBehaviors` property is
     * configured to support payload pass-through.
     */
    readonly contentHandling?: ContentHandling;
    /**
     * An IAM role that API Gateway assumes.
     *
     * Mutually exclusive with `credentialsPassThrough`.
     *
     * @default A role is not assumed
     */
    readonly credentialsRole?: iam.IRole;
    /**
     * Requires that the caller's identity be passed through from the request.
     *
     * @default Caller identity is not passed through
     */
    readonly credentialsPassthrough?: boolean;
    /**
     * Specifies the pass-through behavior for incoming requests based on the
     * Content-Type header in the request, and the available mapping templates
     * specified as the requestTemplates property on the Integration resource.
     * There are three valid values: WHEN_NO_MATCH, WHEN_NO_TEMPLATES, and
     * NEVER.
     */
    readonly passthroughBehavior?: PassthroughBehavior;
    /**
     * The request parameters that API Gateway sends with the backend request.
     * Specify request parameters as key-value pairs (string-to-string
     * mappings), with a destination as the key and a source as the value.
     *
     * Specify the destination by using the following pattern
     * integration.request.location.name, where location is querystring, path,
     * or header, and name is a valid, unique parameter name.
     *
     * The source must be an existing method request parameter or a static
     * value. You must enclose static values in single quotation marks and
     * pre-encode these values based on their destination in the request.
     */
    readonly requestParameters?: {
        [dest: string]: string;
    };
    /**
     * A map of Apache Velocity templates that are applied on the request
     * payload. The template that API Gateway uses is based on the value of the
     * Content-Type header that's sent by the client. The content type value is
     * the key, and the template is the value (specified as a string), such as
     * the following snippet:
     *
     * ```
     *   { "application/json": "{ \"statusCode\": 200 }" }
     * ```
     *
     * @see http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
     */
    readonly requestTemplates?: {
        [contentType: string]: string;
    };
    /**
     * The maximum amount of time an integration will run before it returns without a response.
     * Must be between 50 milliseconds and 29 seconds.
     *
     * @default Duration.seconds(29)
     */
    readonly timeout?: Duration;
    /**
     * The response that API Gateway provides after a method's backend completes
     * processing a request. API Gateway intercepts the response from the
     * backend so that you can control how API Gateway surfaces backend
     * responses. For example, you can map the backend status codes to codes
     * that you define.
     */
    readonly integrationResponses?: IntegrationResponse[];
    /**
     * The type of network connection to the integration endpoint.
     * @default - ConnectionType.VPC_LINK if `vpcLink` property is configured; ConnectionType.Internet otherwise.
     */
    readonly connectionType?: ConnectionType;
    /**
     * The VpcLink used for the integration.
     * Required if connectionType is VPC_LINK
     */
    readonly vpcLink?: IVpcLink;
}
export interface IntegrationProps {
    /**
     * Specifies an API method integration type.
     */
    readonly type: IntegrationType;
    /**
     * The Uniform Resource Identifier (URI) for the integration.
     *
     * - If you specify HTTP for the `type` property, specify the API endpoint URL.
     * - If you specify MOCK for the `type` property, don't specify this property.
     * - If you specify AWS for the `type` property, specify an AWS service that
     *   follows this form: `arn:partition:apigateway:region:subdomain.service|service:path|action/service_api.`
     *   For example, a Lambda function URI follows this form:
     *   arn:partition:apigateway:region:lambda:path/path. The path is usually in the
     *   form /2015-03-31/functions/LambdaFunctionARN/invocations.
     *
     * @see https://docs.aws.amazon.com/apigateway/api-reference/resource/integration/#uri
     */
    readonly uri?: any;
    /**
     * The integration's HTTP method type.
     * Required unless you use a MOCK integration.
     */
    readonly integrationHttpMethod?: string;
    /**
     * Integration options.
     */
    readonly options?: IntegrationOptions;
}
/**
 * Result of binding an Integration to a Method.
 */
export interface IntegrationConfig {
    /**
     * Integration options.
     * @default - no integration options
     */
    readonly options?: IntegrationOptions;
    /**
     * Specifies an API method integration type.
     */
    readonly type: IntegrationType;
    /**
     * The Uniform Resource Identifier (URI) for the integration.
     * @see https://docs.aws.amazon.com/apigateway/api-reference/resource/integration/#uri
     * @default - no URI. Usually applies to MOCK integration
     */
    readonly uri?: string;
    /**
     * The integration's HTTP method type.
     * @default - no integration method specified.
     */
    readonly integrationHttpMethod?: string;
    /**
     * This value is included in computing the Deployment's fingerprint. When the fingerprint
     * changes, a new deployment is triggered.
     * This property should contain values associated with the Integration that upon changing
     * should trigger a fresh the Deployment needs to be refreshed.
     * @default undefined deployments are not triggered for any change to this integration.
     */
    readonly deploymentToken?: string;
}
/**
 * Base class for backend integrations for an API Gateway method.
 *
 * Use one of the concrete classes such as `MockIntegration`, `AwsIntegration`, `LambdaIntegration`
 * or implement on your own by specifying the set of props.
 */
export declare class Integration {
    private readonly props;
    constructor(props: IntegrationProps);
    /**
     * Can be overridden by subclasses to allow the integration to interact with the method
     * being integrated, access the REST API object, method ARNs, etc.
     */
    bind(_method: Method): IntegrationConfig;
}
export declare enum ContentHandling {
    /**
     * Converts a request payload from a base64-encoded string to a binary blob.
     */
    CONVERT_TO_BINARY = "CONVERT_TO_BINARY",
    /**
     * Converts a request payload from a binary blob to a base64-encoded string.
     */
    CONVERT_TO_TEXT = "CONVERT_TO_TEXT"
}
export declare enum IntegrationType {
    /**
     * For integrating the API method request with an AWS service action,
     * including the Lambda function-invoking action. With the Lambda
     * function-invoking action, this is referred to as the Lambda custom
     * integration. With any other AWS service action, this is known as AWS
     * integration.
     */
    AWS = "AWS",
    /**
     * For integrating the API method request with the Lambda function-invoking
     * action with the client request passed through as-is. This integration is
     * also referred to as the Lambda proxy integration
     */
    AWS_PROXY = "AWS_PROXY",
    /**
     * For integrating the API method request with an HTTP endpoint, including a
     * private HTTP endpoint within a VPC. This integration is also referred to
     * as the HTTP custom integration.
     */
    HTTP = "HTTP",
    /**
     * For integrating the API method request with an HTTP endpoint, including a
     * private HTTP endpoint within a VPC, with the client request passed
     * through as-is. This is also referred to as the HTTP proxy integration
     */
    HTTP_PROXY = "HTTP_PROXY",
    /**
     * For integrating the API method request with API Gateway as a "loop-back"
     * endpoint without invoking any backend.
     */
    MOCK = "MOCK"
}
export declare enum PassthroughBehavior {
    /**
     * Passes the request body for unmapped content types through to the
     * integration back end without transformation.
     */
    WHEN_NO_MATCH = "WHEN_NO_MATCH",
    /**
     * Rejects unmapped content types with an HTTP 415 'Unsupported Media Type'
     * response
     */
    NEVER = "NEVER",
    /**
     * Allows pass-through when the integration has NO content types mapped to
     * templates. However if there is at least one content type defined,
     * unmapped content types will be rejected with the same 415 response.
     */
    WHEN_NO_TEMPLATES = "WHEN_NO_TEMPLATES"
}
export declare enum ConnectionType {
    /**
     * For connections through the public routable internet
     */
    INTERNET = "INTERNET",
    /**
     * For private connections between API Gateway and a network load balancer in a VPC
     */
    VPC_LINK = "VPC_LINK"
}
export interface IntegrationResponse {
    /**
     * Specifies the regular expression (regex) pattern used to choose an integration response based on the response from
     * the back end. For example, if the success response returns nothing and the error response returns some string, you
     * could use the ``.+`` regex to match error response. However, make sure that the error response does not contain any
     * newline (``\n``) character in such cases. If the back end is an AWS Lambda function, the AWS Lambda function error
     * header is matched. For all other HTTP and AWS back ends, the HTTP status code is matched.
     *
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-integration-settings-integration-response.html
     */
    readonly selectionPattern?: string;
    /**
     * The status code that API Gateway uses to map the integration response to
     * a MethodResponse status code.
     */
    readonly statusCode: string;
    /**
     * Specifies how to handle request payload content type conversions.
     *
     * @default none the request payload is passed through from the method
     * request to the integration request without modification.
     */
    readonly contentHandling?: ContentHandling;
    /**
     * The response parameters from the backend response that API Gateway sends
     * to the method response.
     *
     * Use the destination as the key and the source as the value:
     *
     * - The destination must be an existing response parameter in the
     *   MethodResponse property.
     * - The source must be an existing method request parameter or a static
     *   value. You must enclose static values in single quotation marks and
     *   pre-encode these values based on the destination specified in the
     *   request.
     *
     * @see http://docs.aws.amazon.com/apigateway/latest/developerguide/request-response-data-mappings.html
     */
    readonly responseParameters?: {
        [destination: string]: string;
    };
    /**
     * The templates that are used to transform the integration response body.
     * Specify templates as key-value pairs, with a content type as the key and
     * a template as the value.
     *
     * @see http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
     */
    readonly responseTemplates?: {
        [contentType: string]: string;
    };
}
