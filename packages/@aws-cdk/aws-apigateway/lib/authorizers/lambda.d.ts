import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnAuthorizerProps } from '../apigateway.generated';
import { Authorizer, IAuthorizer } from '../authorizer';
import { IRestApi } from '../restapi';
/**
 * Base properties for all lambda authorizers
 */
export interface LambdaAuthorizerProps {
    /**
     * An optional human friendly name for the authorizer. Note that, this is not the primary identifier of the authorizer.
     *
     * @default - the unique construct ID
     */
    readonly authorizerName?: string;
    /**
     * The handler for the authorizer lambda function.
     *
     * The handler must follow a very specific protocol on the input it receives
     * and the output it needs to produce.  API Gateway has documented the
     * handler's [input specification](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-input.html)
     * and [output specification](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html).
     */
    readonly handler: lambda.IFunction;
    /**
     * How long APIGateway should cache the results. Max 1 hour.
     * Disable caching by setting this to 0.
     *
     * @default Duration.minutes(5)
     */
    readonly resultsCacheTtl?: Duration;
    /**
     * An optional IAM role for APIGateway to assume before calling the Lambda-based authorizer. The IAM role must be
     * assumable by 'apigateway.amazonaws.com'.
     *
     * @default - A resource policy is added to the Lambda function allowing apigateway.amazonaws.com to invoke the function.
     */
    readonly assumeRole?: iam.IRole;
}
declare abstract class LambdaAuthorizer extends Authorizer implements IAuthorizer {
    /**
     * The id of the authorizer.
     * @attribute
     */
    abstract readonly authorizerId: string;
    /**
     * The ARN of the authorizer to be used in permission policies, such as IAM and resource-based grants.
     */
    abstract readonly authorizerArn: string;
    /**
     * The Lambda function handler that this authorizer uses.
     */
    protected readonly handler: lambda.IFunction;
    /**
     * The IAM role that the API Gateway service assumes while invoking the Lambda function.
     */
    protected readonly role?: iam.IRole;
    protected restApiId?: string;
    protected abstract readonly authorizerProps: CfnAuthorizerProps;
    protected constructor(scope: Construct, id: string, props: LambdaAuthorizerProps);
    /**
     * Attaches this authorizer to a specific REST API.
     * @internal
     */
    _attachToApi(restApi: IRestApi): void;
    /**
     * Sets up the permissions necessary for the API Gateway service to invoke the Lambda function.
     */
    protected setupPermissions(): void;
    /**
     * Add Default Permission Role for handler
     */
    private addDefaultPermisionRole;
    /**
     * Add Lambda Invoke Permission for LambdaAurhorizer's role
     */
    private addLambdaInvokePermission;
    /**
     * Returns a token that resolves to the Rest Api Id at the time of synthesis.
     * Throws an error, during token resolution, if no RestApi is attached to this authorizer.
     */
    protected lazyRestApiId(): string;
}
/**
 * Properties for TokenAuthorizer
 */
export interface TokenAuthorizerProps extends LambdaAuthorizerProps {
    /**
     * An optional regex to be matched against the authorization token. When matched the authorizer lambda is invoked,
     * otherwise a 401 Unauthorized is returned to the client.
     *
     * @default - no regex filter will be applied.
     */
    readonly validationRegex?: string;
    /**
     * The request header mapping expression for the bearer token. This is typically passed as part of the header, in which case
     * this should be `method.request.header.Authorizer` where Authorizer is the header containing the bearer token.
     * @see https://docs.aws.amazon.com/apigateway/api-reference/link-relation/authorizer-create/#identitySource
     * @default `IdentitySource.header('Authorization')`
     */
    readonly identitySource?: string;
}
/**
 * Token based lambda authorizer that recognizes the caller's identity as a bearer token,
 * such as a JSON Web Token (JWT) or an OAuth token.
 * Based on the token, authorization is performed by a lambda function.
 *
 * @resource AWS::ApiGateway::Authorizer
 */
export declare class TokenAuthorizer extends LambdaAuthorizer {
    readonly authorizerId: string;
    readonly authorizerArn: string;
    protected readonly authorizerProps: CfnAuthorizerProps;
    constructor(scope: Construct, id: string, props: TokenAuthorizerProps);
}
/**
 * Properties for RequestAuthorizer
 */
export interface RequestAuthorizerProps extends LambdaAuthorizerProps {
    /**
     * An array of request header mapping expressions for identities. Supported parameter types are
     * Header, Query String, Stage Variable, and Context. For instance, extracting an authorization
     * token from a header would use the identity source `IdentitySource.header('Authorizer')`.
     *
     * Note: API Gateway uses the specified identity sources as the request authorizer caching key. When caching is
     * enabled, API Gateway calls the authorizer's Lambda function only after successfully verifying that all the
     * specified identity sources are present at runtime. If a specified identify source is missing, null, or empty,
     * API Gateway returns a 401 Unauthorized response without calling the authorizer Lambda function.
     *
     * @see https://docs.aws.amazon.com/apigateway/api-reference/link-relation/authorizer-create/#identitySource
     */
    readonly identitySources: string[];
}
/**
 * Request-based lambda authorizer that recognizes the caller's identity via request parameters,
 * such as headers, paths, query strings, stage variables, or context variables.
 * Based on the request, authorization is performed by a lambda function.
 *
 * @resource AWS::ApiGateway::Authorizer
 */
export declare class RequestAuthorizer extends LambdaAuthorizer {
    readonly authorizerId: string;
    readonly authorizerArn: string;
    protected readonly authorizerProps: CfnAuthorizerProps;
    constructor(scope: Construct, id: string, props: RequestAuthorizerProps);
}
export {};
