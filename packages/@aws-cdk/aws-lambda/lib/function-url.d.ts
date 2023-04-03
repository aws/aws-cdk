import * as iam from '@aws-cdk/aws-iam';
import { Duration, IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IFunction } from './function-base';
/**
 * The auth types for a function url
 */
export declare enum FunctionUrlAuthType {
    /**
     * Restrict access to authenticated IAM users only
     */
    AWS_IAM = "AWS_IAM",
    /**
     * Bypass IAM authentication to create a public endpoint
     */
    NONE = "NONE"
}
/**
 * All http request methods
 */
export declare enum HttpMethod {
    /**
     * The GET method requests a representation of the specified resource.
     */
    GET = "GET",
    /**
     * The PUT method replaces all current representations of the target resource with the request payload.
     */
    PUT = "PUT",
    /**
     * The HEAD method asks for a response identical to that of a GET request, but without the response body.
     */
    HEAD = "HEAD",
    /**
     * The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.
     */
    POST = "POST",
    /**
     * The DELETE method deletes the specified resource.
     */
    DELETE = "DELETE",
    /**
     * The PATCH method applies partial modifications to a resource.
     */
    PATCH = "PATCH",
    /**
     * The OPTIONS method describes the communication options for the target resource.
     */
    OPTIONS = "OPTIONS",
    /**
     * The wildcard entry to allow all methods.
     */
    ALL = "*"
}
/**
 * Specifies a cross-origin access property for a function URL
 */
export interface FunctionUrlCorsOptions {
    /**
     * Whether to allow cookies or other credentials in requests to your function URL.
     *
     * @default false
     */
    readonly allowCredentials?: boolean;
    /**
     * Headers that are specified in the Access-Control-Request-Headers header.
     *
     * @default - No headers allowed.
     */
    readonly allowedHeaders?: string[];
    /**
     * An HTTP method that you allow the origin to execute.
     *
     * @default - [HttpMethod.ALL]
     */
    readonly allowedMethods?: HttpMethod[];
    /**
     * One or more origins you want customers to be able to access the bucket from.
     *
     * @default - No origins allowed.
     */
    readonly allowedOrigins?: string[];
    /**
     * One or more headers in the response that you want customers to be able to access from their applications.
     *
     * @default - No headers exposed.
     */
    readonly exposedHeaders?: string[];
    /**
     * The time in seconds that your browser is to cache the preflight response for the specified resource.
     *
     * @default - Browser default of 5 seconds.
     */
    readonly maxAge?: Duration;
}
/**
 * A Lambda function Url
 */
export interface IFunctionUrl extends IResource {
    /**
     * The url of the Lambda function.
     *
     * @attribute FunctionUrl
     */
    readonly url: string;
    /**
     * The ARN of the function this URL refers to
     *
     * @attribute FunctionArn
     */
    readonly functionArn: string;
    /**
     * Grant the given identity permissions to invoke this Lambda Function URL
     */
    grantInvokeUrl(identity: iam.IGrantable): iam.Grant;
}
/**
 * Options to add a url to a Lambda function
 */
export interface FunctionUrlOptions {
    /**
     * The type of authentication that your function URL uses.
     *
     * @default FunctionUrlAuthType.AWS_IAM
     */
    readonly authType?: FunctionUrlAuthType;
    /**
     * The cross-origin resource sharing (CORS) settings for your function URL.
     *
     * @default - No CORS configuration.
     */
    readonly cors?: FunctionUrlCorsOptions;
}
/**
 * Properties for a FunctionUrl
 */
export interface FunctionUrlProps extends FunctionUrlOptions {
    /**
     * The function to which this url refers.
     * It can also be an `Alias` but not a `Version`.
     */
    readonly function: IFunction;
}
/**
 * Defines a Lambda function url
 *
 * @resource AWS::Lambda::Url
 */
export declare class FunctionUrl extends Resource implements IFunctionUrl {
    /**
     * The url of the Lambda function.
     */
    readonly url: string;
    /**
     * The ARN of the function this URL refers to
     */
    readonly functionArn: string;
    private readonly function;
    constructor(scope: Construct, id: string, props: FunctionUrlProps);
    grantInvokeUrl(grantee: iam.IGrantable): iam.Grant;
    private instanceOfVersion;
    private instanceOfAlias;
    private renderCors;
}
