import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { IVpcEndpoint } from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { IResource as IResourceBase, Resource, Size } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ApiDefinition } from './api-definition';
import { ApiKeyOptions, IApiKey } from './api-key';
import { CfnAccount, CfnRestApi } from './apigateway.generated';
import { Deployment } from './deployment';
import { DomainName, DomainNameOptions } from './domain-name';
import { GatewayResponse, GatewayResponseOptions } from './gateway-response';
import { Method } from './method';
import { Model, ModelOptions } from './model';
import { RequestValidator, RequestValidatorOptions } from './requestvalidator';
import { IResource, ResourceOptions } from './resource';
import { Stage, StageOptions } from './stage';
import { UsagePlan, UsagePlanProps } from './usage-plan';
export interface IRestApi extends IResourceBase {
    /**
     * The ID of this API Gateway RestApi.
     * @attribute
     */
    readonly restApiId: string;
    /**
     * The name of this API Gateway RestApi.
     * @attribute
     */
    readonly restApiName: string;
    /**
     * The resource ID of the root resource.
     * @attribute
     */
    readonly restApiRootResourceId: string;
    /**
     * API Gateway deployment that represents the latest changes of the API.
     * This resource will be automatically updated every time the REST API model changes.
     * `undefined` when no deployment is configured.
     */
    readonly latestDeployment?: Deployment;
    /**
     * API Gateway stage that points to the latest deployment (if defined).
     */
    deploymentStage: Stage;
    /**
     * Represents the root resource ("/") of this API. Use it to define the API model:
     *
     *    api.root.addMethod('ANY', redirectToHomePage); // "ANY /"
     *    api.root.addResource('friends').addMethod('GET', getFriendsHandler); // "GET /friends"
     *
     */
    readonly root: IResource;
    /**
     * Gets the "execute-api" ARN
     * @returns The "execute-api" ARN.
     * @default "*" returns the execute API ARN for all methods/resources in
     * this API.
     * @param method The method (default `*`)
     * @param path The resource path. Must start with '/' (default `*`)
     * @param stage The stage (default `*`)
     */
    arnForExecuteApi(method?: string, path?: string, stage?: string): string;
}
/**
 * Represents the props that all Rest APIs share
 */
export interface RestApiBaseProps {
    /**
     * Indicates if a Deployment should be automatically created for this API,
     * and recreated when the API model (resources, methods) changes.
     *
     * Since API Gateway deployments are immutable, When this option is enabled
     * (by default), an AWS::ApiGateway::Deployment resource will automatically
     * created with a logical ID that hashes the API model (methods, resources
     * and options). This means that when the model changes, the logical ID of
     * this CloudFormation resource will change, and a new deployment will be
     * created.
     *
     * If this is set, `latestDeployment` will refer to the `Deployment` object
     * and `deploymentStage` will refer to a `Stage` that points to this
     * deployment. To customize the stage options, use the `deployOptions`
     * property.
     *
     * A CloudFormation Output will also be defined with the root URL endpoint
     * of this REST API.
     *
     * @default true
     */
    readonly deploy?: boolean;
    /**
     * Options for the API Gateway stage that will always point to the latest
     * deployment when `deploy` is enabled. If `deploy` is disabled,
     * this value cannot be set.
     *
     * @default - Based on defaults of `StageOptions`.
     */
    readonly deployOptions?: StageOptions;
    /**
     * Retains old deployment resources when the API changes. This allows
     * manually reverting stages to point to old deployments via the AWS
     * Console.
     *
     * @default false
     */
    readonly retainDeployments?: boolean;
    /**
     * A name for the API Gateway RestApi resource.
     *
     * @default - ID of the RestApi construct.
     */
    readonly restApiName?: string;
    /**
     * Custom header parameters for the request.
     * @see https://docs.aws.amazon.com/cli/latest/reference/apigateway/import-rest-api.html
     *
     * @default - No parameters.
     */
    readonly parameters?: {
        [key: string]: string;
    };
    /**
     * A policy document that contains the permissions for this RestApi
     *
     * @default - No policy.
     */
    readonly policy?: iam.PolicyDocument;
    /**
     * Indicates whether to roll back the resource if a warning occurs while API
     * Gateway is creating the RestApi resource.
     *
     * @default false
     */
    readonly failOnWarnings?: boolean;
    /**
     * Configure a custom domain name and map it to this API.
     *
     * @default - no domain name is defined, use `addDomainName` or directly define a `DomainName`.
     */
    readonly domainName?: DomainNameOptions;
    /**
     * Automatically configure an AWS CloudWatch role for API Gateway.
     *
     * @default - false if `@aws-cdk/aws-apigateway:disableCloudWatchRole` is enabled, true otherwise
     */
    readonly cloudWatchRole?: boolean;
    /**
     * Export name for the CfnOutput containing the API endpoint
     *
     * @default - when no export name is given, output will be created without export
     */
    readonly endpointExportName?: string;
    /**
     * A list of the endpoint types of the API. Use this property when creating
     * an API.
     *
     * @default EndpointType.EDGE
     */
    readonly endpointTypes?: EndpointType[];
    /**
     * Specifies whether clients can invoke the API using the default execute-api
     * endpoint. To require that clients use a custom domain name to invoke the
     * API, disable the default endpoint.
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-restapi.html
     *
     * @default false
     */
    readonly disableExecuteApiEndpoint?: boolean;
    /**
     * A description of the RestApi construct.
     *
     * @default - 'Automatically created by the RestApi construct'
     */
    readonly description?: string;
}
/**
 * Represents the props that all Rest APIs share.
 * @deprecated - superseded by `RestApiBaseProps`
 */
export interface RestApiOptions extends RestApiBaseProps, ResourceOptions {
}
/**
 * Props to create a new instance of RestApi
 */
export interface RestApiProps extends RestApiOptions {
    /**
     * The list of binary media mime-types that are supported by the RestApi
     * resource, such as "image/png" or "application/octet-stream"
     *
     * @default - RestApi supports only UTF-8-encoded text payloads.
     */
    readonly binaryMediaTypes?: string[];
    /**
     * A nullable integer that is used to enable compression (with non-negative
     * between 0 and 10485760 (10M) bytes, inclusive) or disable compression
     * (when undefined) on an API. When compression is enabled, compression or
     * decompression is not applied on the payload if the payload size is
     * smaller than this value. Setting it to zero allows compression for any
     * payload size.
     *
     * @default - Compression is disabled.
     * @deprecated - superseded by `minCompressionSize`
     */
    readonly minimumCompressionSize?: number;
    /**
     * A Size(in bytes, kibibytes, mebibytes etc) that is used to enable compression (with non-negative
     * between 0 and 10485760 (10M) bytes, inclusive) or disable compression
     * (when undefined) on an API. When compression is enabled, compression or
     * decompression is not applied on the payload if the payload size is
     * smaller than this value. Setting it to zero allows compression for any
     * payload size.
     *
     * @default - Compression is disabled.
     */
    readonly minCompressionSize?: Size;
    /**
     * The ID of the API Gateway RestApi resource that you want to clone.
     *
     * @default - None.
     */
    readonly cloneFrom?: IRestApi;
    /**
     * The source of the API key for metering requests according to a usage
     * plan.
     *
     * @default - Metering is disabled.
     */
    readonly apiKeySourceType?: ApiKeySourceType;
    /**
     * The EndpointConfiguration property type specifies the endpoint types of a REST API
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-restapi-endpointconfiguration.html
     *
     * @default EndpointType.EDGE
     */
    readonly endpointConfiguration?: EndpointConfiguration;
}
/**
 * Props to instantiate a new SpecRestApi
 */
export interface SpecRestApiProps extends RestApiBaseProps {
    /**
     * An OpenAPI definition compatible with API Gateway.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-import-api.html
     */
    readonly apiDefinition: ApiDefinition;
    /**
     * A Size(in bytes, kibibytes, mebibytes etc) that is used to enable compression (with non-negative
     * between 0 and 10485760 (10M) bytes, inclusive) or disable compression
     * (when undefined) on an API. When compression is enabled, compression or
     * decompression is not applied on the payload if the payload size is
     * smaller than this value. Setting it to zero allows compression for any
     * payload size.
     *
     * @default - Compression is disabled.
     */
    readonly minCompressionSize?: Size;
}
/**
 * Base implementation that are common to various implementations of IRestApi
 */
export declare abstract class RestApiBase extends Resource implements IRestApi {
    /**
     * Checks if the given object is an instance of RestApiBase.
     * @internal
     */
    static _isRestApiBase(x: any): x is RestApiBase;
    /**
     * API Gateway deployment that represents the latest changes of the API.
     * This resource will be automatically updated every time the REST API model changes.
     * This will be undefined if `deploy` is false.
     */
    get latestDeployment(): Deployment | undefined;
    /**
     * The first domain name mapped to this API, if defined through the `domainName`
     * configuration prop, or added via `addDomainName`
     */
    get domainName(): DomainName | undefined;
    /**
     * The ID of this API Gateway RestApi.
     */
    abstract readonly restApiId: string;
    /**
     * The resource ID of the root resource.
     *
     * @attribute
     */
    abstract readonly restApiRootResourceId: string;
    /**
     * Represents the root resource of this API endpoint ('/').
     * Resources and Methods are added to this resource.
     */
    abstract readonly root: IResource;
    /**
     * API Gateway stage that points to the latest deployment (if defined).
     *
     * If `deploy` is disabled, you will need to explicitly assign this value in order to
     * set up integrations.
     */
    deploymentStage: Stage;
    /**
     * A human friendly name for this Rest API. Note that this is different from `restApiId`.
     * @attribute
     */
    readonly restApiName: string;
    private _latestDeployment?;
    private _domainName?;
    protected cloudWatchAccount?: CfnAccount;
    constructor(scope: Construct, id: string, props?: RestApiBaseProps);
    /**
     * Returns the URL for an HTTP path.
     *
     * Fails if `deploymentStage` is not set either by `deploy` or explicitly.
     */
    urlForPath(path?: string): string;
    /**
     * Defines an API Gateway domain name and maps it to this API.
     * @param id The construct id
     * @param options custom domain options
     */
    addDomainName(id: string, options: DomainNameOptions): DomainName;
    /**
     * Adds a usage plan.
     */
    addUsagePlan(id: string, props?: UsagePlanProps): UsagePlan;
    arnForExecuteApi(method?: string, path?: string, stage?: string): string;
    /**
     * Adds a new gateway response.
     */
    addGatewayResponse(id: string, options: GatewayResponseOptions): GatewayResponse;
    /**
     * Add an ApiKey to the deploymentStage
     */
    addApiKey(id: string, options?: ApiKeyOptions): IApiKey;
    /**
     * Returns the given named metric for this API
     */
    metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of client-side errors captured in a given period.
     *
     * Default: sum over 5 minutes
     */
    metricClientError(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of server-side errors captured in a given period.
     *
     * Default: sum over 5 minutes
     */
    metricServerError(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of requests served from the API cache in a given period.
     *
     * Default: sum over 5 minutes
     */
    metricCacheHitCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of requests served from the backend in a given period,
     * when API caching is enabled.
     *
     * Default: sum over 5 minutes
     */
    metricCacheMissCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the total number API requests in a given period.
     *
     * Default: sample count over 5 minutes
     */
    metricCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the time between when API Gateway relays a request to the backend
     * and when it receives a response from the backend.
     *
     * Default: average over 5 minutes.
     */
    metricIntegrationLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * The time between when API Gateway receives a request from a client
     * and when it returns a response to the client.
     * The latency includes the integration latency and other API Gateway overhead.
     *
     * Default: average over 5 minutes.
     */
    metricLatency(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Internal API used by `Method` to keep an inventory of methods at the API
     * level for validation purposes.
     *
     * @internal
     */
    _attachMethod(method: Method): void;
    /**
     * Associates a Deployment resource with this REST API.
     *
     * @internal
     */
    _attachDeployment(deployment: Deployment): void;
    /**
     * Associates a Stage with this REST API
     *
     * @internal
     */
    _attachStage(stage: Stage): void;
    /**
     * @internal
     */
    protected _configureCloudWatchRole(apiResource: CfnRestApi): void;
    /**
     * @deprecated This method will be made internal. No replacement
     */
    protected configureCloudWatchRole(apiResource: CfnRestApi): void;
    /**
     * @deprecated This method will be made internal. No replacement
     */
    protected configureDeployment(props: RestApiBaseProps): void;
    /**
     * @internal
     */
    protected _configureDeployment(props: RestApiBaseProps): void;
    /**
     * @internal
     */
    protected _configureEndpoints(props: RestApiProps): CfnRestApi.EndpointConfigurationProperty | undefined;
    private cannedMetric;
}
/**
 * Represents a REST API in Amazon API Gateway, created with an OpenAPI specification.
 *
 * Some properties normally accessible on @see `RestApi` - such as the description -
 * must be declared in the specification. All Resources and Methods need to be defined as
 * part of the OpenAPI specification file, and cannot be added via the CDK.
 *
 * By default, the API will automatically be deployed and accessible from a
 * public endpoint.
 *
 *
 * @resource AWS::ApiGateway::RestApi
 */
export declare class SpecRestApi extends RestApiBase {
    /**
     * The ID of this API Gateway RestApi.
     */
    readonly restApiId: string;
    /**
     * The resource ID of the root resource.
     *
     * @attribute
     */
    readonly restApiRootResourceId: string;
    readonly root: IResource;
    constructor(scope: Construct, id: string, props: SpecRestApiProps);
}
/**
 * Attributes that can be specified when importing a RestApi
 */
export interface RestApiAttributes {
    /**
     * The ID of the API Gateway RestApi.
     */
    readonly restApiId: string;
    /**
     * The name of the API Gateway RestApi.
     *
     * @default - ID of the RestApi construct.
     */
    readonly restApiName?: string;
    /**
     * The resource ID of the root resource.
     */
    readonly rootResourceId: string;
}
/**
 * Represents a REST API in Amazon API Gateway.
 *
 * Use `addResource` and `addMethod` to configure the API model.
 *
 * By default, the API will automatically be deployed and accessible from a
 * public endpoint.
 */
export declare class RestApi extends RestApiBase {
    /**
     * Import an existing RestApi.
     */
    static fromRestApiId(scope: Construct, id: string, restApiId: string): IRestApi;
    /**
     * Import an existing RestApi that can be configured with additional Methods and Resources.
     */
    static fromRestApiAttributes(scope: Construct, id: string, attrs: RestApiAttributes): IRestApi;
    readonly restApiId: string;
    readonly root: IResource;
    readonly restApiRootResourceId: string;
    /**
     * The list of methods bound to this RestApi
     */
    readonly methods: Method[];
    /**
     * This list of deployments bound to this RestApi
     */
    private readonly deployments;
    constructor(scope: Construct, id: string, props?: RestApiProps);
    /**
     * The deployed root URL of this REST API.
     */
    get url(): string;
    /**
     * Adds a new model.
     */
    addModel(id: string, props: ModelOptions): Model;
    /**
     * Adds a new request validator.
     */
    addRequestValidator(id: string, props: RequestValidatorOptions): RequestValidator;
    /**
     * Internal API used by `Method` to keep an inventory of methods at the API
     * level for validation purposes.
     *
     * @internal
     */
    _attachMethod(method: Method): void;
    /**
     * Attaches a deployment to this REST API.
     *
     * @internal
     */
    _attachDeployment(deployment: Deployment): void;
    /**
     * Performs validation of the REST API.
     */
    private validateRestApi;
}
/**
 * The endpoint configuration of a REST API, including VPCs and endpoint types.
 *
 * EndpointConfiguration is a property of the AWS::ApiGateway::RestApi resource.
 */
export interface EndpointConfiguration {
    /**
     * A list of endpoint types of an API or its custom domain name.
     *
     * @default EndpointType.EDGE
     */
    readonly types: EndpointType[];
    /**
     * A list of VPC Endpoints against which to create Route53 ALIASes
     *
     * @default - no ALIASes are created for the endpoint.
     */
    readonly vpcEndpoints?: IVpcEndpoint[];
}
export declare enum ApiKeySourceType {
    /**
     * To read the API key from the `X-API-Key` header of a request.
     */
    HEADER = "HEADER",
    /**
     * To read the API key from the `UsageIdentifierKey` from a custom authorizer.
     */
    AUTHORIZER = "AUTHORIZER"
}
export declare enum EndpointType {
    /**
     * For an edge-optimized API and its custom domain name.
     */
    EDGE = "EDGE",
    /**
     * For a regional API and its custom domain name.
     */
    REGIONAL = "REGIONAL",
    /**
     * For a private API and its custom domain name.
     */
    PRIVATE = "PRIVATE"
}
