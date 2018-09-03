import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import { Method } from './method';
import { parseAwsApiCall } from './util';

export interface IntegrationOptions {

    /**
     * A list of request parameters whose values API Gateway caches.
     */
    cacheKeyParameters?: string[];

    /**
     * An API-specific tag group of related cached parameters.
     */
    cacheNamespace?: string;

    /**
     * Specifies how to handle request payload content type conversions.
     * @default If this property isn't defined, the request payload is passed
     * through from the method request to the integration request without
     * modification, provided that the `passthroughBehaviors` property is
     * configured to support payload pass-through.
     */
    contentHandling?: ContentHandling;

    /**
     * An IAM role that API Gateway assumes.
     *
     * Mutually exclusive with `credentialsPassThrough`.
     *
     * @default A role is not assumed
     */
    credentialsRole?: iam.Role;

    /**
     * Requires that the caller's identity be passed through from the request.
     *
     * @default Caller identity is not passed through
     */
    credentialsPassthrough?: boolean;

    /**
     * Specifies the pass-through behavior for incoming requests based on the
     * Content-Type header in the request, and the available mapping templates
     * specified as the requestTemplates property on the Integration resource.
     * There are three valid values: WHEN_NO_MATCH, WHEN_NO_TEMPLATES, and
     * NEVER.
     */
    passthroughBehavior?: PassthroughBehavior

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
    requestParameters?: { [dest: string]: string };

    /**
     * A map of Apache Velocity templates that are applied on the request
     * payload. The template that API Gateway uses is based on the value of the
     * Content-Type header that's sent by the client. The content type value is
     * the key, and the template is the value (specified as a string), such as
     * the following snippet:
     *
     *     { "application/json": "{\n    \"statusCode\": \"200\"\n}" }
     *
     * @see http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
     */
    requestTemplates?: { [contentType: string]: string };

    // TODO:
    // - IntegrationResponses
    //
}

export interface IntegrationProps {
    /**
     * Specifies an API method integration type.
     */
    type: IntegrationType;

    /**
     * The Uniform Resource Identifier (URI) for the integration.
     *
     * - If you specify MOCK for the `type` property, this is not required.
     * - If you specify HTTP for the `type` property, specify the API endpoint URL.
     * - If you specify MOCK for the `type` property, don't specify this property.
     * - If you specify AWS for the `type` property, specify an AWS service that
     *   follows this form:
     *   `arn:aws:apigateway:region:subdomain.service|service:path|action/service_api.`
     *   For example, a Lambda function URI follows this form:
     *   arn:aws:apigateway:region:lambda:path/path. The path is usually in the
     *   form /2015-03-31/functions/LambdaFunctionARN/invocations.
     *
     * @see https://docs.aws.amazon.com/apigateway/api-reference/resource/integration/#uri
     */
    uri?: any;

    /**
     * The integration's HTTP method type.
     * Required unless you use a MOCK integration.
     */
    integrationHttpMethod?: string;

    /**
     * Integration options.
     */
    options?: IntegrationOptions;
}

export abstract class MethodIntegration {
    constructor(readonly props: IntegrationProps) {

    }

    public attachToMethod(_method: Method) {
        return;
    }
}

export class MockMethodIntegration extends MethodIntegration {
    constructor(options?: IntegrationOptions) {
        super({
            type: IntegrationType.Mock,
            options
        });
    }
}

export enum AwsApiType {
    Path = 'path',
    Action = 'action'
}

export interface AwsIntegrationProps {
    /**
     * Use AWS_PROXY integration.
     *
     * @default false
     */
    proxy?: boolean;

    /**
     * The name of the integrated AWS service (e.g. `s3`)
     */
    service: string;

    /**
     * A designated subdomain supported by certain AWS service for fast
     * host-name lookup.
     */
    subdomain?: string;

    /**
     * The path to use for path-base APIs.
     *
     * For example, for S3 GET, you can set path to `bucket/key`.
     * For lambda, you can set path to `2015-03-31/functions/${function-arn}/invocations`
     *
     * Mutually exclusive with the `action` options.
     */
    path?: string;

    /**
     * The AWS action to perform in the integration.
     *
     * Use `actionParams` to specify key-value params for the action.
     *
     * Mutually exclusive with `path`.
     */
    action?: string;

    /**
     * Parameters for the action.
     *
     * `action` must be set, and `path` must be undefined.
     * The action params will be URL encoded.
     */
    actionParameters?: { [key: string]: string };

    /**
     * Integration options.
     */
    options?: IntegrationOptions
}

export class AwsIntegration extends MethodIntegration {
    constructor(props: AwsIntegrationProps) {
        const backend = props.subdomain ? `${props.subdomain}.${props.service}` : props.service;
        const type = props.proxy ? IntegrationType.AwsProxy : IntegrationType.Aws;
        const { apiType, apiValue } = parseAwsApiCall(props.path, props.action, props.actionParameters);
        super({
            type,
            integrationHttpMethod: 'POST',
            uri: cdk.Arn.fromComponents({
                service: 'apigateway',
                account: backend,
                resource: apiType,
                sep: '/',
                resourceName: apiValue,
            }),
            options: props.options,
        });
    }
}

export interface LambdaIntegrationOptions extends IntegrationOptions {
    /**
     * Use proxy integration or normal (request/response mapping) integration.
     * @default true
     */
    proxy?: boolean;

    /**
     * Allow invoking method from AWS Console UI (for testing purposes).
     *
     * This will add another permission to the AWS Lambda resource policy which
     * will allow the `test-invoke-stage` stage to invoke this handler. If this
     * is set to `false`, the function will only be usable from the deployment
     * endpoint.
     *
     * @default true
     */
    enableTestInvoke?: boolean;
}

export class LambdaMethodIntegration extends AwsIntegration {
    private readonly handler: lambda.FunctionRef;
    private readonly enableTestInvoke: boolean;

    constructor(handler: lambda.FunctionRef, options: LambdaIntegrationOptions = { }) {
        const proxy = options.proxy === undefined ? true : options.proxy;

        super({
            proxy,
            service: 'lambda',
            path: `2015-03-31/functions/${handler.functionArn}/invocations`,
            options
        });

        this.handler = handler;
        this.enableTestInvoke = options.enableTestInvoke === undefined ? true : false;
    }

    public attachToMethod(method: Method) {
        const principal = new cdk.ServicePrincipal('apigateway.amazonaws.com');

        this.handler.addPermission(method.methodArn.toString(), {
            principal,
            sourceArn: method.methodArn
        });

        // add permission to invoke from the console
        if (this.enableTestInvoke) {
            this.handler.addPermission(method.testMethodArn.toString(), {
                principal,
                sourceArn: method.testMethodArn
            });
        }
    }
}

export enum ContentHandling {
    /**
     * Converts a request payload from a base64-encoded string to a binary blob.
     */
    ConvertToBinary = 'CONVERT_TO_BINARY',

    /**
     * Converts a request payload from a binary blob to a base64-encoded string.
     */
    ConvertToText = 'CONVERT_TO_TEXT'
}

export enum IntegrationType {
    /**
     * For integrating the API method request with an AWS service action,
     * including the Lambda function-invoking action. With the Lambda
     * function-invoking action, this is referred to as the Lambda custom
     * integration. With any other AWS service action, this is known as AWS
     * integration.
     */
    Aws = 'AWS',

    /**
     * For integrating the API method request with the Lambda function-invoking
     * action with the client request passed through as-is. This integration is
     * also referred to as the Lambda proxy integration
     */
    AwsProxy = 'AWS_PROXY',

    /**
     * For integrating the API method request with an HTTP endpoint, including a
     * private HTTP endpoint within a VPC. This integration is also referred to
     * as the HTTP custom integration.
     */
    Http = 'HTTP',

    /**
     * For integrating the API method request with an HTTP endpoint, including a
     * private HTTP endpoint within a VPC, with the client request passed
     * through as-is. This is also referred to as the HTTP proxy integration
     */
    HttpProxy = 'HTTP_PROXY',

    /**
     * For integrating the API method request with API Gateway as a "loop-back"
     * endpoint without invoking any backend.
     */
    Mock = 'MOCK'
}

export enum PassthroughBehavior {
    /**
     * Passes the request body for unmapped content types through to the
     * integration back end without transformation.
     */
    WhenNoMatch = 'WHEN_NO_MATCH',

    /**
     * Rejects unmapped content types with an HTTP 415 'Unsupported Media Type'
     * response
     */
    Never = 'NEVER',

    /**
     * Allows pass-through when the integration has NO content types mapped to
     * templates. However if there is at least one content type defined,
     * unmapped content types will be rejected with the same 415 response.
     */
    WhenNoTemplates = 'WHEN_NO_TEMPLATES'
}