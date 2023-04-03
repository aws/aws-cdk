import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAuthorizer } from './authorizer';
import { Integration } from './integration';
import { MethodResponse } from './methodresponse';
import { IModel } from './model';
import { IRequestValidator, RequestValidatorOptions } from './requestvalidator';
import { IResource } from './resource';
import { IRestApi, RestApi } from './restapi';
import { IStage } from './stage';
export interface MethodOptions {
    /**
     * A friendly operation name for the method. For example, you can assign the
     * OperationName of ListPets for the GET /pets method.
     */
    readonly operationName?: string;
    /**
     * Method authorization.
     * If the value is set of `Custom`, an `authorizer` must also be specified.
     *
     * If you're using one of the authorizers that are available via the `Authorizer` class, such as `Authorizer#token()`,
     * it is recommended that this option not be specified. The authorizer will take care of setting the correct authorization type.
     * However, specifying an authorization type using this property that conflicts with what is expected by the `Authorizer`
     * will result in an error.
     *
     * @default - open access unless `authorizer` is specified
     */
    readonly authorizationType?: AuthorizationType;
    /**
     * If `authorizationType` is `Custom`, this specifies the ID of the method
     * authorizer resource.
     * If specified, the value of `authorizationType` must be set to `Custom`
     */
    readonly authorizer?: IAuthorizer;
    /**
     * Indicates whether the method requires clients to submit a valid API key.
     * @default false
     */
    readonly apiKeyRequired?: boolean;
    /**
     * The responses that can be sent to the client who calls the method.
     * @default None
     *
     * This property is not required, but if these are not supplied for a Lambda
     * proxy integration, the Lambda function must return a value of the correct format,
     * for the integration response to be correctly mapped to a response to the client.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-method-settings-method-response.html
     */
    readonly methodResponses?: MethodResponse[];
    /**
     * The request parameters that API Gateway accepts. Specify request parameters
     * as key-value pairs (string-to-Boolean mapping), with a source as the key and
     * a Boolean as the value. The Boolean specifies whether a parameter is required.
     * A source must match the format method.request.location.name, where the location
     * is querystring, path, or header, and name is a valid, unique parameter name.
     * @default None
     */
    readonly requestParameters?: {
        [param: string]: boolean;
    };
    /**
     * The models which describe data structure of request payload. When
     * combined with `requestValidator` or `requestValidatorOptions`, the service
     * will validate the API request payload before it reaches the API's Integration (including proxies).
     * Specify `requestModels` as key-value pairs, with a content type
     * (e.g. `'application/json'`) as the key and an API Gateway Model as the value.
     *
     * @example
     *
     *     declare const api: apigateway.RestApi;
     *     declare const userLambda: lambda.Function;
     *
     *     const userModel: apigateway.Model = api.addModel('UserModel', {
     *         schema: {
     *             type: apigateway.JsonSchemaType.OBJECT,
     *             properties: {
     *                 userId: {
     *                     type: apigateway.JsonSchemaType.STRING
     *                 },
     *                 name: {
     *                     type: apigateway.JsonSchemaType.STRING
     *                 }
     *             },
     *             required: ['userId']
     *         }
     *     });
     *     api.root.addResource('user').addMethod('POST',
     *         new apigateway.LambdaIntegration(userLambda), {
     *             requestModels: {
     *                 'application/json': userModel
     *             }
     *         }
     *     );
     *
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-method-settings-method-request.html#setup-method-request-model
     */
    readonly requestModels?: {
        [param: string]: IModel;
    };
    /**
     * The ID of the associated request validator.
     * Only one of `requestValidator` or `requestValidatorOptions` must be specified.
     * Works together with `requestModels` or `requestParameters` to validate
     * the request before it reaches integration like Lambda Proxy Integration.
     * @default - No default validator
     */
    readonly requestValidator?: IRequestValidator;
    /**
     * A list of authorization scopes configured on the method. The scopes are used with
     * a COGNITO_USER_POOLS authorizer to authorize the method invocation.
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-authorizationscopes
     * @default - no authorization scopes
     */
    readonly authorizationScopes?: string[];
    /**
     * Request validator options to create new validator
     * Only one of `requestValidator` or `requestValidatorOptions` must be specified.
     * Works together with `requestModels` or `requestParameters` to validate
     * the request before it reaches integration like Lambda Proxy Integration.
     * @default - No default validator
     */
    readonly requestValidatorOptions?: RequestValidatorOptions;
}
export interface MethodProps {
    /**
     * The resource this method is associated with. For root resource methods,
     * specify the `RestApi` object.
     */
    readonly resource: IResource;
    /**
     * The HTTP method ("GET", "POST", "PUT", ...) that clients use to call this method.
     */
    readonly httpMethod: string;
    /**
     * The backend system that the method calls when it receives a request.
     *
     * @default - a new `MockIntegration`.
     */
    readonly integration?: Integration;
    /**
     * Method options.
     *
     * @default - No options.
     */
    readonly options?: MethodOptions;
}
export declare class Method extends Resource {
    /** @attribute */
    readonly methodId: string;
    readonly httpMethod: string;
    readonly resource: IResource;
    /**
     * The API Gateway RestApi associated with this method.
     */
    readonly api: IRestApi;
    private methodResponses;
    constructor(scope: Construct, id: string, props: MethodProps);
    /**
     * The RestApi associated with this Method
     * @deprecated - Throws an error if this Resource is not associated with an instance of `RestApi`. Use `api` instead.
     */
    get restApi(): RestApi;
    /**
     * Returns an execute-api ARN for this method:
     *
     *   arn:aws:execute-api:{region}:{account}:{restApiId}/{stage}/{method}/{path}
     *
     * NOTE: {stage} will refer to the `restApi.deploymentStage`, which will
     * automatically set if auto-deploy is enabled, or can be explicitly assigned.
     * When not configured, {stage} will be set to '*', as a shorthand for 'all stages'.
     *
     * @attribute
     */
    get methodArn(): string;
    /**
     * Returns an execute-api ARN for this method's "test-invoke-stage" stage.
     * This stage is used by the AWS Console UI when testing the method.
     */
    get testMethodArn(): string;
    /**
     * Add a method response to this method
     */
    addMethodResponse(methodResponse: MethodResponse): void;
    private renderIntegration;
    private renderMethodResponses;
    private renderRequestModels;
    private requestValidatorId;
    /**
     * Returns the given named metric for this API method
     */
    metric(metricName: string, stage: IStage, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of client-side errors captured in a given period.
     *
     * @default - sum over 5 minutes
     */
    metricClientError(stage: IStage, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of server-side errors captured in a given period.
     *
     * @default - sum over 5 minutes
     */
    metricServerError(stage: IStage, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of requests served from the API cache in a given period.
     *
     * @default - sum over 5 minutes
     */
    metricCacheHitCount(stage: IStage, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of requests served from the backend in a given period,
     * when API caching is enabled.
     *
     * @default - sum over 5 minutes
     */
    metricCacheMissCount(stage: IStage, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the total number API requests in a given period.
     *
     * @default - sample count over 5 minutes
     */
    metricCount(stage: IStage, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the time between when API Gateway relays a request to the backend
     * and when it receives a response from the backend.
     *
     * @default - average over 5 minutes.
     */
    metricIntegrationLatency(stage: IStage, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * The time between when API Gateway receives a request from a client
     * and when it returns a response to the client.
     * The latency includes the integration latency and other API Gateway overhead.
     *
     * @default - average over 5 minutes.
     */
    metricLatency(stage: IStage, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    private cannedMetric;
}
export declare enum AuthorizationType {
    /**
     * Open access.
     */
    NONE = "NONE",
    /**
     * Use AWS IAM permissions.
     */
    IAM = "AWS_IAM",
    /**
     * Use a custom authorizer.
     */
    CUSTOM = "CUSTOM",
    /**
     * Use an AWS Cognito user pool.
     */
    COGNITO = "COGNITO_USER_POOLS"
}
