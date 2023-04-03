"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointType = exports.ApiKeySourceType = exports.RestApi = exports.SpecRestApi = exports.RestApiBase = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const cx_api_1 = require("@aws-cdk/cx-api");
const api_key_1 = require("./api-key");
const apigateway_canned_metrics_generated_1 = require("./apigateway-canned-metrics.generated");
const apigateway_generated_1 = require("./apigateway.generated");
const deployment_1 = require("./deployment");
const domain_name_1 = require("./domain-name");
const gateway_response_1 = require("./gateway-response");
const model_1 = require("./model");
const requestvalidator_1 = require("./requestvalidator");
const resource_1 = require("./resource");
const stage_1 = require("./stage");
const usage_plan_1 = require("./usage-plan");
const RESTAPI_SYMBOL = Symbol.for('@aws-cdk/aws-apigateway.RestApiBase');
/**
 * Base implementation that are common to various implementations of IRestApi
 */
class RestApiBase extends core_1.Resource {
    constructor(scope, id, props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_RestApiBaseProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, RestApiBase);
            }
            throw error;
        }
        const restApiName = props.restApiName ?? id;
        super(scope, id, {
            physicalName: restApiName,
        });
        this.restApiName = restApiName;
        Object.defineProperty(this, RESTAPI_SYMBOL, { value: true });
    }
    /**
     * Checks if the given object is an instance of RestApiBase.
     * @internal
     */
    static _isRestApiBase(x) {
        return x !== null && typeof (x) === 'object' && RESTAPI_SYMBOL in x;
    }
    /**
     * API Gateway deployment that represents the latest changes of the API.
     * This resource will be automatically updated every time the REST API model changes.
     * This will be undefined if `deploy` is false.
     */
    get latestDeployment() {
        return this._latestDeployment;
    }
    /**
     * The first domain name mapped to this API, if defined through the `domainName`
     * configuration prop, or added via `addDomainName`
     */
    get domainName() {
        return this._domainName;
    }
    /**
     * Returns the URL for an HTTP path.
     *
     * Fails if `deploymentStage` is not set either by `deploy` or explicitly.
     */
    urlForPath(path = '/') {
        if (!this.deploymentStage) {
            throw new Error('Cannot determine deployment stage for API from "deploymentStage". Use "deploy" or explicitly set "deploymentStage"');
        }
        return this.deploymentStage.urlForPath(path);
    }
    /**
     * Defines an API Gateway domain name and maps it to this API.
     * @param id The construct id
     * @param options custom domain options
     */
    addDomainName(id, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_DomainNameOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addDomainName);
            }
            throw error;
        }
        const domainName = new domain_name_1.DomainName(this, id, {
            ...options,
            mapping: this,
        });
        if (!this._domainName) {
            this._domainName = domainName;
        }
        return domainName;
    }
    /**
     * Adds a usage plan.
     */
    addUsagePlan(id, props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_UsagePlanProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addUsagePlan);
            }
            throw error;
        }
        return new usage_plan_1.UsagePlan(this, id, props);
    }
    arnForExecuteApi(method = '*', path = '/*', stage = '*') {
        if (!core_1.Token.isUnresolved(path) && !path.startsWith('/')) {
            throw new Error(`"path" must begin with a "/": '${path}'`);
        }
        if (method.toUpperCase() === 'ANY') {
            method = '*';
        }
        return core_1.Stack.of(this).formatArn({
            service: 'execute-api',
            resource: this.restApiId,
            arnFormat: core_1.ArnFormat.SLASH_RESOURCE_NAME,
            resourceName: `${stage}/${method}${path}`,
        });
    }
    /**
     * Adds a new gateway response.
     */
    addGatewayResponse(id, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_GatewayResponseOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addGatewayResponse);
            }
            throw error;
        }
        return new gateway_response_1.GatewayResponse(this, id, {
            restApi: this,
            ...options,
        });
    }
    /**
     * Add an ApiKey to the deploymentStage
     */
    addApiKey(id, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_ApiKeyOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addApiKey);
            }
            throw error;
        }
        return new api_key_1.ApiKey(this, id, {
            stages: [this.deploymentStage],
            ...options,
        });
    }
    /**
     * Returns the given named metric for this API
     */
    metric(metricName, props) {
        return new cloudwatch.Metric({
            namespace: 'AWS/ApiGateway',
            metricName,
            dimensionsMap: { ApiName: this.restApiName },
            ...props,
        }).attachTo(this);
    }
    /**
     * Metric for the number of client-side errors captured in a given period.
     *
     * Default: sum over 5 minutes
     */
    metricClientError(props) {
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics._4XxErrorSum, props);
    }
    /**
     * Metric for the number of server-side errors captured in a given period.
     *
     * Default: sum over 5 minutes
     */
    metricServerError(props) {
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics._5XxErrorSum, props);
    }
    /**
     * Metric for the number of requests served from the API cache in a given period.
     *
     * Default: sum over 5 minutes
     */
    metricCacheHitCount(props) {
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics.cacheHitCountSum, props);
    }
    /**
     * Metric for the number of requests served from the backend in a given period,
     * when API caching is enabled.
     *
     * Default: sum over 5 minutes
     */
    metricCacheMissCount(props) {
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics.cacheMissCountSum, props);
    }
    /**
     * Metric for the total number API requests in a given period.
     *
     * Default: sample count over 5 minutes
     */
    metricCount(props) {
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics.countSum, {
            statistic: 'SampleCount',
            ...props,
        });
    }
    /**
     * Metric for the time between when API Gateway relays a request to the backend
     * and when it receives a response from the backend.
     *
     * Default: average over 5 minutes.
     */
    metricIntegrationLatency(props) {
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics.integrationLatencyAverage, props);
    }
    /**
     * The time between when API Gateway receives a request from a client
     * and when it returns a response to the client.
     * The latency includes the integration latency and other API Gateway overhead.
     *
     * Default: average over 5 minutes.
     */
    metricLatency(props) {
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics.latencyAverage, props);
    }
    /**
     * Internal API used by `Method` to keep an inventory of methods at the API
     * level for validation purposes.
     *
     * @internal
     */
    _attachMethod(method) {
        ignore(method);
    }
    /**
     * Associates a Deployment resource with this REST API.
     *
     * @internal
     */
    _attachDeployment(deployment) {
        ignore(deployment);
    }
    /**
     * Associates a Stage with this REST API
     *
     * @internal
     */
    _attachStage(stage) {
        if (this.cloudWatchAccount) {
            stage.node.addDependency(this.cloudWatchAccount);
        }
    }
    /**
     * @internal
     */
    _configureCloudWatchRole(apiResource) {
        const role = new iam.Role(this, 'CloudWatchRole', {
            assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
            managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonAPIGatewayPushToCloudWatchLogs')],
        });
        role.applyRemovalPolicy(core_1.RemovalPolicy.RETAIN);
        this.cloudWatchAccount = new apigateway_generated_1.CfnAccount(this, 'Account', {
            cloudWatchRoleArn: role.roleArn,
        });
        this.cloudWatchAccount.applyRemovalPolicy(core_1.RemovalPolicy.RETAIN);
        this.cloudWatchAccount.node.addDependency(apiResource);
    }
    /**
     * @deprecated This method will be made internal. No replacement
     */
    configureCloudWatchRole(apiResource) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.RestApiBase#configureCloudWatchRole", "This method will be made internal. No replacement");
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_CfnRestApi(apiResource);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.configureCloudWatchRole);
            }
            throw error;
        }
        this._configureCloudWatchRole(apiResource);
    }
    /**
     * @deprecated This method will be made internal. No replacement
     */
    configureDeployment(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.RestApiBase#configureDeployment", "This method will be made internal. No replacement");
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_RestApiBaseProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.configureDeployment);
            }
            throw error;
        }
        this._configureDeployment(props);
    }
    /**
     * @internal
     */
    _configureDeployment(props) {
        const deploy = props.deploy ?? true;
        if (deploy) {
            this._latestDeployment = new deployment_1.Deployment(this, 'Deployment', {
                description: props.description ? props.description : 'Automatically created by the RestApi construct',
                api: this,
                retainDeployments: props.retainDeployments,
            });
            // encode the stage name into the construct id, so if we change the stage name, it will recreate a new stage.
            // stage name is part of the endpoint, so that makes sense.
            const stageName = (props.deployOptions && props.deployOptions.stageName) || 'prod';
            this.deploymentStage = new stage_1.Stage(this, `DeploymentStage.${stageName}`, {
                deployment: this._latestDeployment,
                ...props.deployOptions,
            });
            new core_1.CfnOutput(this, 'Endpoint', { exportName: props.endpointExportName, value: this.urlForPath() });
        }
        else {
            if (props.deployOptions) {
                throw new Error('Cannot set \'deployOptions\' if \'deploy\' is disabled');
            }
        }
    }
    /**
     * @internal
     */
    _configureEndpoints(props) {
        if (props.endpointTypes && props.endpointConfiguration) {
            throw new Error('Only one of the RestApi props, endpointTypes or endpointConfiguration, is allowed');
        }
        if (props.endpointConfiguration) {
            return {
                types: props.endpointConfiguration.types,
                vpcEndpointIds: props.endpointConfiguration?.vpcEndpoints?.map(vpcEndpoint => vpcEndpoint.vpcEndpointId),
            };
        }
        if (props.endpointTypes) {
            return { types: props.endpointTypes };
        }
        return undefined;
    }
    cannedMetric(fn, props) {
        return new cloudwatch.Metric({
            ...fn({ ApiName: this.restApiName }),
            ...props,
        }).attachTo(this);
    }
}
exports.RestApiBase = RestApiBase;
_a = JSII_RTTI_SYMBOL_1;
RestApiBase[_a] = { fqn: "@aws-cdk/aws-apigateway.RestApiBase", version: "0.0.0" };
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
class SpecRestApi extends RestApiBase {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_SpecRestApiProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SpecRestApi);
            }
            throw error;
        }
        const apiDefConfig = props.apiDefinition.bind(this);
        const resource = new apigateway_generated_1.CfnRestApi(this, 'Resource', {
            name: this.restApiName,
            policy: props.policy,
            failOnWarnings: props.failOnWarnings,
            minimumCompressionSize: props.minCompressionSize?.toBytes(),
            body: apiDefConfig.inlineDefinition ?? undefined,
            bodyS3Location: apiDefConfig.inlineDefinition ? undefined : apiDefConfig.s3Location,
            endpointConfiguration: this._configureEndpoints(props),
            parameters: props.parameters,
            disableExecuteApiEndpoint: props.disableExecuteApiEndpoint,
        });
        props.apiDefinition.bindAfterCreate(this, this);
        this.node.defaultChild = resource;
        this.restApiId = resource.ref;
        this.restApiRootResourceId = resource.attrRootResourceId;
        this.root = new RootResource(this, {}, this.restApiRootResourceId);
        const cloudWatchRoleDefault = core_1.FeatureFlags.of(this).isEnabled(cx_api_1.APIGATEWAY_DISABLE_CLOUDWATCH_ROLE) ? false : true;
        const cloudWatchRole = props.cloudWatchRole ?? cloudWatchRoleDefault;
        if (cloudWatchRole) {
            this._configureCloudWatchRole(resource);
        }
        this._configureDeployment(props);
        if (props.domainName) {
            this.addDomainName('CustomDomain', props.domainName);
        }
    }
}
exports.SpecRestApi = SpecRestApi;
_b = JSII_RTTI_SYMBOL_1;
SpecRestApi[_b] = { fqn: "@aws-cdk/aws-apigateway.SpecRestApi", version: "0.0.0" };
/**
 * Represents a REST API in Amazon API Gateway.
 *
 * Use `addResource` and `addMethod` to configure the API model.
 *
 * By default, the API will automatically be deployed and accessible from a
 * public endpoint.
 */
class RestApi extends RestApiBase {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        /**
         * The list of methods bound to this RestApi
         */
        this.methods = new Array();
        /**
         * This list of deployments bound to this RestApi
         */
        this.deployments = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_RestApiProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, RestApi);
            }
            throw error;
        }
        if (props.minCompressionSize !== undefined && props.minimumCompressionSize !== undefined) {
            throw new Error('both properties minCompressionSize and minimumCompressionSize cannot be set at once.');
        }
        const resource = new apigateway_generated_1.CfnRestApi(this, 'Resource', {
            name: this.physicalName,
            description: props.description,
            policy: props.policy,
            failOnWarnings: props.failOnWarnings,
            minimumCompressionSize: props.minCompressionSize?.toBytes() ?? props.minimumCompressionSize,
            binaryMediaTypes: props.binaryMediaTypes,
            endpointConfiguration: this._configureEndpoints(props),
            apiKeySourceType: props.apiKeySourceType,
            cloneFrom: props.cloneFrom?.restApiId,
            parameters: props.parameters,
            disableExecuteApiEndpoint: props.disableExecuteApiEndpoint,
        });
        this.node.defaultChild = resource;
        this.restApiId = resource.ref;
        const cloudWatchRoleDefault = core_1.FeatureFlags.of(this).isEnabled(cx_api_1.APIGATEWAY_DISABLE_CLOUDWATCH_ROLE) ? false : true;
        const cloudWatchRole = props.cloudWatchRole ?? cloudWatchRoleDefault;
        if (cloudWatchRole) {
            this._configureCloudWatchRole(resource);
        }
        this._configureDeployment(props);
        if (props.domainName) {
            this.addDomainName('CustomDomain', props.domainName);
        }
        this.root = new RootResource(this, props, resource.attrRootResourceId);
        this.restApiRootResourceId = resource.attrRootResourceId;
        this.node.addValidation({ validate: () => this.validateRestApi() });
    }
    /**
     * Import an existing RestApi.
     */
    static fromRestApiId(scope, id, restApiId) {
        class Import extends RestApiBase {
            constructor() {
                super(...arguments);
                this.restApiId = restApiId;
            }
            get root() {
                throw new Error('root is not configured when imported using `fromRestApiId()`. Use `fromRestApiAttributes()` API instead.');
            }
            get restApiRootResourceId() {
                throw new Error('restApiRootResourceId is not configured when imported using `fromRestApiId()`. Use `fromRestApiAttributes()` API instead.');
            }
        }
        return new Import(scope, id);
    }
    /**
     * Import an existing RestApi that can be configured with additional Methods and Resources.
     */
    static fromRestApiAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_RestApiAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromRestApiAttributes);
            }
            throw error;
        }
        class Import extends RestApiBase {
            constructor() {
                super(...arguments);
                this.restApiId = attrs.restApiId;
                this.restApiName = attrs.restApiName ?? id;
                this.restApiRootResourceId = attrs.rootResourceId;
                this.root = new RootResource(this, {}, this.restApiRootResourceId);
            }
        }
        return new Import(scope, id);
    }
    /**
     * The deployed root URL of this REST API.
     */
    get url() {
        return this.urlForPath();
    }
    /**
     * Adds a new model.
     */
    addModel(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_ModelOptions(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addModel);
            }
            throw error;
        }
        return new model_1.Model(this, id, {
            ...props,
            restApi: this,
        });
    }
    /**
     * Adds a new request validator.
     */
    addRequestValidator(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_RequestValidatorOptions(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addRequestValidator);
            }
            throw error;
        }
        return new requestvalidator_1.RequestValidator(this, id, {
            ...props,
            restApi: this,
        });
    }
    /**
     * Internal API used by `Method` to keep an inventory of methods at the API
     * level for validation purposes.
     *
     * @internal
     */
    _attachMethod(method) {
        this.methods.push(method);
        // add this method as a dependency to all deployments defined for this api
        // when additional deployments are added, _attachDeployment is called and
        // this method will be added there.
        for (const dep of this.deployments) {
            dep._addMethodDependency(method);
        }
    }
    /**
     * Attaches a deployment to this REST API.
     *
     * @internal
     */
    _attachDeployment(deployment) {
        this.deployments.push(deployment);
        // add all methods that were already defined as dependencies of this
        // deployment when additional methods are added, _attachMethod is called and
        // it will be added as a dependency to this deployment.
        for (const method of this.methods) {
            deployment._addMethodDependency(method);
        }
    }
    /**
     * Performs validation of the REST API.
     */
    validateRestApi() {
        if (this.methods.length === 0) {
            return ["The REST API doesn't contain any methods"];
        }
        return [];
    }
}
exports.RestApi = RestApi;
_c = JSII_RTTI_SYMBOL_1;
RestApi[_c] = { fqn: "@aws-cdk/aws-apigateway.RestApi", version: "0.0.0" };
var ApiKeySourceType;
(function (ApiKeySourceType) {
    /**
     * To read the API key from the `X-API-Key` header of a request.
     */
    ApiKeySourceType["HEADER"] = "HEADER";
    /**
     * To read the API key from the `UsageIdentifierKey` from a custom authorizer.
     */
    ApiKeySourceType["AUTHORIZER"] = "AUTHORIZER";
})(ApiKeySourceType = exports.ApiKeySourceType || (exports.ApiKeySourceType = {}));
var EndpointType;
(function (EndpointType) {
    /**
     * For an edge-optimized API and its custom domain name.
     */
    EndpointType["EDGE"] = "EDGE";
    /**
     * For a regional API and its custom domain name.
     */
    EndpointType["REGIONAL"] = "REGIONAL";
    /**
     * For a private API and its custom domain name.
     */
    EndpointType["PRIVATE"] = "PRIVATE";
})(EndpointType = exports.EndpointType || (exports.EndpointType = {}));
class RootResource extends resource_1.ResourceBase {
    constructor(api, props, resourceId) {
        super(api, 'Default');
        this.parentResource = undefined;
        this.defaultIntegration = props.defaultIntegration;
        this.defaultMethodOptions = props.defaultMethodOptions;
        this.defaultCorsPreflightOptions = props.defaultCorsPreflightOptions;
        this.api = api;
        this.resourceId = resourceId;
        this.path = '/';
        if (api instanceof RestApi) {
            this._restApi = api;
        }
        if (this.defaultCorsPreflightOptions) {
            this.addCorsPreflight(this.defaultCorsPreflightOptions);
        }
    }
    /**
     * Get the RestApi associated with this Resource.
     * @deprecated - Throws an error if this Resource is not associated with an instance of `RestApi`. Use `api` instead.
     */
    get restApi() {
        if (!this._restApi) {
            throw new Error('RestApi is not available on Resource not connected to an instance of RestApi. Use `api` instead');
        }
        return this._restApi;
    }
}
function ignore(_x) {
    return;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdGFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlc3RhcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0RBQXNEO0FBRXRELHdDQUF3QztBQUN4Qyx3Q0FBNEk7QUFDNUksNENBQXFFO0FBR3JFLHVDQUEyRDtBQUMzRCwrRkFBMEU7QUFDMUUsaUVBQWdFO0FBRWhFLDZDQUEwQztBQUMxQywrQ0FBOEQ7QUFDOUQseURBQTZFO0FBRzdFLG1DQUE4QztBQUM5Qyx5REFBK0U7QUFDL0UseUNBQXNFO0FBQ3RFLG1DQUE4QztBQUM5Qyw2Q0FBeUQ7QUFFekQsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0FBNFF6RTs7R0FFRztBQUNILE1BQXNCLFdBQVksU0FBUSxlQUFRO0lBK0RoRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQTBCLEVBQUc7Ozs7OzsrQ0EvRG5ELFdBQVc7Ozs7UUFnRTdCLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO1FBQzVDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLFdBQVc7U0FDMUIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFFL0IsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7S0FDOUQ7SUF0RUQ7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFNO1FBQ2pDLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxPQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxJQUFJLGNBQWMsSUFBSSxDQUFDLENBQUM7S0FDcEU7SUFFRDs7OztPQUlHO0lBQ0gsSUFBVyxnQkFBZ0I7UUFDekIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENB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bSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0IHsgSVZwY0VuZHBvaW50IH0gZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBBcm5Gb3JtYXQsIENmbk91dHB1dCwgSVJlc291cmNlIGFzIElSZXNvdXJjZUJhc2UsIFJlc291cmNlLCBTdGFjaywgVG9rZW4sIEZlYXR1cmVGbGFncywgUmVtb3ZhbFBvbGljeSwgU2l6ZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQVBJR0FURVdBWV9ESVNBQkxFX0NMT1VEV0FUQ0hfUk9MRSB9IGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFwaURlZmluaXRpb24gfSBmcm9tICcuL2FwaS1kZWZpbml0aW9uJztcbmltcG9ydCB7IEFwaUtleSwgQXBpS2V5T3B0aW9ucywgSUFwaUtleSB9IGZyb20gJy4vYXBpLWtleSc7XG5pbXBvcnQgeyBBcGlHYXRld2F5TWV0cmljcyB9IGZyb20gJy4vYXBpZ2F0ZXdheS1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQ2ZuQWNjb3VudCwgQ2ZuUmVzdEFwaSB9IGZyb20gJy4vYXBpZ2F0ZXdheS5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQ29yc09wdGlvbnMgfSBmcm9tICcuL2NvcnMnO1xuaW1wb3J0IHsgRGVwbG95bWVudCB9IGZyb20gJy4vZGVwbG95bWVudCc7XG5pbXBvcnQgeyBEb21haW5OYW1lLCBEb21haW5OYW1lT3B0aW9ucyB9IGZyb20gJy4vZG9tYWluLW5hbWUnO1xuaW1wb3J0IHsgR2F0ZXdheVJlc3BvbnNlLCBHYXRld2F5UmVzcG9uc2VPcHRpb25zIH0gZnJvbSAnLi9nYXRld2F5LXJlc3BvbnNlJztcbmltcG9ydCB7IEludGVncmF0aW9uIH0gZnJvbSAnLi9pbnRlZ3JhdGlvbic7XG5pbXBvcnQgeyBNZXRob2QsIE1ldGhvZE9wdGlvbnMgfSBmcm9tICcuL21ldGhvZCc7XG5pbXBvcnQgeyBNb2RlbCwgTW9kZWxPcHRpb25zIH0gZnJvbSAnLi9tb2RlbCc7XG5pbXBvcnQgeyBSZXF1ZXN0VmFsaWRhdG9yLCBSZXF1ZXN0VmFsaWRhdG9yT3B0aW9ucyB9IGZyb20gJy4vcmVxdWVzdHZhbGlkYXRvcic7XG5pbXBvcnQgeyBJUmVzb3VyY2UsIFJlc291cmNlQmFzZSwgUmVzb3VyY2VPcHRpb25zIH0gZnJvbSAnLi9yZXNvdXJjZSc7XG5pbXBvcnQgeyBTdGFnZSwgU3RhZ2VPcHRpb25zIH0gZnJvbSAnLi9zdGFnZSc7XG5pbXBvcnQgeyBVc2FnZVBsYW4sIFVzYWdlUGxhblByb3BzIH0gZnJvbSAnLi91c2FnZS1wbGFuJztcblxuY29uc3QgUkVTVEFQSV9TWU1CT0wgPSBTeW1ib2wuZm9yKCdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheS5SZXN0QXBpQmFzZScpO1xuXG5leHBvcnQgaW50ZXJmYWNlIElSZXN0QXBpIGV4dGVuZHMgSVJlc291cmNlQmFzZSB7XG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhpcyBBUEkgR2F0ZXdheSBSZXN0QXBpLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSByZXN0QXBpSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhpcyBBUEkgR2F0ZXdheSBSZXN0QXBpLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSByZXN0QXBpTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVzb3VyY2UgSUQgb2YgdGhlIHJvb3QgcmVzb3VyY2UuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHJlc3RBcGlSb290UmVzb3VyY2VJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBUEkgR2F0ZXdheSBkZXBsb3ltZW50IHRoYXQgcmVwcmVzZW50cyB0aGUgbGF0ZXN0IGNoYW5nZXMgb2YgdGhlIEFQSS5cbiAgICogVGhpcyByZXNvdXJjZSB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgdXBkYXRlZCBldmVyeSB0aW1lIHRoZSBSRVNUIEFQSSBtb2RlbCBjaGFuZ2VzLlxuICAgKiBgdW5kZWZpbmVkYCB3aGVuIG5vIGRlcGxveW1lbnQgaXMgY29uZmlndXJlZC5cbiAgICovXG4gIHJlYWRvbmx5IGxhdGVzdERlcGxveW1lbnQ/OiBEZXBsb3ltZW50O1xuXG4gIC8qKlxuICAgKiBBUEkgR2F0ZXdheSBzdGFnZSB0aGF0IHBvaW50cyB0byB0aGUgbGF0ZXN0IGRlcGxveW1lbnQgKGlmIGRlZmluZWQpLlxuICAgKi9cbiAgZGVwbG95bWVudFN0YWdlOiBTdGFnZTtcblxuICAvKipcbiAgICogUmVwcmVzZW50cyB0aGUgcm9vdCByZXNvdXJjZSAoXCIvXCIpIG9mIHRoaXMgQVBJLiBVc2UgaXQgdG8gZGVmaW5lIHRoZSBBUEkgbW9kZWw6XG4gICAqXG4gICAqICAgIGFwaS5yb290LmFkZE1ldGhvZCgnQU5ZJywgcmVkaXJlY3RUb0hvbWVQYWdlKTsgLy8gXCJBTlkgL1wiXG4gICAqICAgIGFwaS5yb290LmFkZFJlc291cmNlKCdmcmllbmRzJykuYWRkTWV0aG9kKCdHRVQnLCBnZXRGcmllbmRzSGFuZGxlcik7IC8vIFwiR0VUIC9mcmllbmRzXCJcbiAgICpcbiAgICovXG4gIHJlYWRvbmx5IHJvb3Q6IElSZXNvdXJjZTtcblxuICAvKipcbiAgICogR2V0cyB0aGUgXCJleGVjdXRlLWFwaVwiIEFSTlxuICAgKiBAcmV0dXJucyBUaGUgXCJleGVjdXRlLWFwaVwiIEFSTi5cbiAgICogQGRlZmF1bHQgXCIqXCIgcmV0dXJucyB0aGUgZXhlY3V0ZSBBUEkgQVJOIGZvciBhbGwgbWV0aG9kcy9yZXNvdXJjZXMgaW5cbiAgICogdGhpcyBBUEkuXG4gICAqIEBwYXJhbSBtZXRob2QgVGhlIG1ldGhvZCAoZGVmYXVsdCBgKmApXG4gICAqIEBwYXJhbSBwYXRoIFRoZSByZXNvdXJjZSBwYXRoLiBNdXN0IHN0YXJ0IHdpdGggJy8nIChkZWZhdWx0IGAqYClcbiAgICogQHBhcmFtIHN0YWdlIFRoZSBzdGFnZSAoZGVmYXVsdCBgKmApXG4gICAqL1xuICBhcm5Gb3JFeGVjdXRlQXBpKG1ldGhvZD86IHN0cmluZywgcGF0aD86IHN0cmluZywgc3RhZ2U/OiBzdHJpbmcpOiBzdHJpbmc7XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgcHJvcHMgdGhhdCBhbGwgUmVzdCBBUElzIHNoYXJlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVzdEFwaUJhc2VQcm9wcyB7XG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgYSBEZXBsb3ltZW50IHNob3VsZCBiZSBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQgZm9yIHRoaXMgQVBJLFxuICAgKiBhbmQgcmVjcmVhdGVkIHdoZW4gdGhlIEFQSSBtb2RlbCAocmVzb3VyY2VzLCBtZXRob2RzKSBjaGFuZ2VzLlxuICAgKlxuICAgKiBTaW5jZSBBUEkgR2F0ZXdheSBkZXBsb3ltZW50cyBhcmUgaW1tdXRhYmxlLCBXaGVuIHRoaXMgb3B0aW9uIGlzIGVuYWJsZWRcbiAgICogKGJ5IGRlZmF1bHQpLCBhbiBBV1M6OkFwaUdhdGV3YXk6OkRlcGxveW1lbnQgcmVzb3VyY2Ugd2lsbCBhdXRvbWF0aWNhbGx5XG4gICAqIGNyZWF0ZWQgd2l0aCBhIGxvZ2ljYWwgSUQgdGhhdCBoYXNoZXMgdGhlIEFQSSBtb2RlbCAobWV0aG9kcywgcmVzb3VyY2VzXG4gICAqIGFuZCBvcHRpb25zKS4gVGhpcyBtZWFucyB0aGF0IHdoZW4gdGhlIG1vZGVsIGNoYW5nZXMsIHRoZSBsb2dpY2FsIElEIG9mXG4gICAqIHRoaXMgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2Ugd2lsbCBjaGFuZ2UsIGFuZCBhIG5ldyBkZXBsb3ltZW50IHdpbGwgYmVcbiAgICogY3JlYXRlZC5cbiAgICpcbiAgICogSWYgdGhpcyBpcyBzZXQsIGBsYXRlc3REZXBsb3ltZW50YCB3aWxsIHJlZmVyIHRvIHRoZSBgRGVwbG95bWVudGAgb2JqZWN0XG4gICAqIGFuZCBgZGVwbG95bWVudFN0YWdlYCB3aWxsIHJlZmVyIHRvIGEgYFN0YWdlYCB0aGF0IHBvaW50cyB0byB0aGlzXG4gICAqIGRlcGxveW1lbnQuIFRvIGN1c3RvbWl6ZSB0aGUgc3RhZ2Ugb3B0aW9ucywgdXNlIHRoZSBgZGVwbG95T3B0aW9uc2BcbiAgICogcHJvcGVydHkuXG4gICAqXG4gICAqIEEgQ2xvdWRGb3JtYXRpb24gT3V0cHV0IHdpbGwgYWxzbyBiZSBkZWZpbmVkIHdpdGggdGhlIHJvb3QgVVJMIGVuZHBvaW50XG4gICAqIG9mIHRoaXMgUkVTVCBBUEkuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGRlcGxveT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIE9wdGlvbnMgZm9yIHRoZSBBUEkgR2F0ZXdheSBzdGFnZSB0aGF0IHdpbGwgYWx3YXlzIHBvaW50IHRvIHRoZSBsYXRlc3RcbiAgICogZGVwbG95bWVudCB3aGVuIGBkZXBsb3lgIGlzIGVuYWJsZWQuIElmIGBkZXBsb3lgIGlzIGRpc2FibGVkLFxuICAgKiB0aGlzIHZhbHVlIGNhbm5vdCBiZSBzZXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQmFzZWQgb24gZGVmYXVsdHMgb2YgYFN0YWdlT3B0aW9uc2AuXG4gICAqL1xuICByZWFkb25seSBkZXBsb3lPcHRpb25zPzogU3RhZ2VPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBSZXRhaW5zIG9sZCBkZXBsb3ltZW50IHJlc291cmNlcyB3aGVuIHRoZSBBUEkgY2hhbmdlcy4gVGhpcyBhbGxvd3NcbiAgICogbWFudWFsbHkgcmV2ZXJ0aW5nIHN0YWdlcyB0byBwb2ludCB0byBvbGQgZGVwbG95bWVudHMgdmlhIHRoZSBBV1NcbiAgICogQ29uc29sZS5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHJldGFpbkRlcGxveW1lbnRzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBuYW1lIGZvciB0aGUgQVBJIEdhdGV3YXkgUmVzdEFwaSByZXNvdXJjZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBJRCBvZiB0aGUgUmVzdEFwaSBjb25zdHJ1Y3QuXG4gICAqL1xuICByZWFkb25seSByZXN0QXBpTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogQ3VzdG9tIGhlYWRlciBwYXJhbWV0ZXJzIGZvciB0aGUgcmVxdWVzdC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2xpL2xhdGVzdC9yZWZlcmVuY2UvYXBpZ2F0ZXdheS9pbXBvcnQtcmVzdC1hcGkuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHBhcmFtZXRlcnMuXG4gICAqL1xuICByZWFkb25seSBwYXJhbWV0ZXJzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogQSBwb2xpY3kgZG9jdW1lbnQgdGhhdCBjb250YWlucyB0aGUgcGVybWlzc2lvbnMgZm9yIHRoaXMgUmVzdEFwaVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHBvbGljeS5cbiAgICovXG4gIHJlYWRvbmx5IHBvbGljeT86IGlhbS5Qb2xpY3lEb2N1bWVudDtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdG8gcm9sbCBiYWNrIHRoZSByZXNvdXJjZSBpZiBhIHdhcm5pbmcgb2NjdXJzIHdoaWxlIEFQSVxuICAgKiBHYXRld2F5IGlzIGNyZWF0aW5nIHRoZSBSZXN0QXBpIHJlc291cmNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZmFpbE9uV2FybmluZ3M/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgYSBjdXN0b20gZG9tYWluIG5hbWUgYW5kIG1hcCBpdCB0byB0aGlzIEFQSS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBkb21haW4gbmFtZSBpcyBkZWZpbmVkLCB1c2UgYGFkZERvbWFpbk5hbWVgIG9yIGRpcmVjdGx5IGRlZmluZSBhIGBEb21haW5OYW1lYC5cbiAgICovXG4gIHJlYWRvbmx5IGRvbWFpbk5hbWU/OiBEb21haW5OYW1lT3B0aW9ucztcblxuICAvKipcbiAgICogQXV0b21hdGljYWxseSBjb25maWd1cmUgYW4gQVdTIENsb3VkV2F0Y2ggcm9sZSBmb3IgQVBJIEdhdGV3YXkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2UgaWYgYEBhd3MtY2RrL2F3cy1hcGlnYXRld2F5OmRpc2FibGVDbG91ZFdhdGNoUm9sZWAgaXMgZW5hYmxlZCwgdHJ1ZSBvdGhlcndpc2VcbiAgICovXG4gIHJlYWRvbmx5IGNsb3VkV2F0Y2hSb2xlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRXhwb3J0IG5hbWUgZm9yIHRoZSBDZm5PdXRwdXQgY29udGFpbmluZyB0aGUgQVBJIGVuZHBvaW50XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gd2hlbiBubyBleHBvcnQgbmFtZSBpcyBnaXZlbiwgb3V0cHV0IHdpbGwgYmUgY3JlYXRlZCB3aXRob3V0IGV4cG9ydFxuICAgKi9cbiAgcmVhZG9ubHkgZW5kcG9pbnRFeHBvcnROYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgdGhlIGVuZHBvaW50IHR5cGVzIG9mIHRoZSBBUEkuIFVzZSB0aGlzIHByb3BlcnR5IHdoZW4gY3JlYXRpbmdcbiAgICogYW4gQVBJLlxuICAgKlxuICAgKiBAZGVmYXVsdCBFbmRwb2ludFR5cGUuRURHRVxuICAgKi9cbiAgcmVhZG9ubHkgZW5kcG9pbnRUeXBlcz86IEVuZHBvaW50VHlwZVtdO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgd2hldGhlciBjbGllbnRzIGNhbiBpbnZva2UgdGhlIEFQSSB1c2luZyB0aGUgZGVmYXVsdCBleGVjdXRlLWFwaVxuICAgKiBlbmRwb2ludC4gVG8gcmVxdWlyZSB0aGF0IGNsaWVudHMgdXNlIGEgY3VzdG9tIGRvbWFpbiBuYW1lIHRvIGludm9rZSB0aGVcbiAgICogQVBJLCBkaXNhYmxlIHRoZSBkZWZhdWx0IGVuZHBvaW50LlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5LXJlc3RhcGkuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZGlzYWJsZUV4ZWN1dGVBcGlFbmRwb2ludD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgZGVzY3JpcHRpb24gb2YgdGhlIFJlc3RBcGkgY29uc3RydWN0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtICdBdXRvbWF0aWNhbGx5IGNyZWF0ZWQgYnkgdGhlIFJlc3RBcGkgY29uc3RydWN0J1xuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgcHJvcHMgdGhhdCBhbGwgUmVzdCBBUElzIHNoYXJlLlxuICogQGRlcHJlY2F0ZWQgLSBzdXBlcnNlZGVkIGJ5IGBSZXN0QXBpQmFzZVByb3BzYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlc3RBcGlPcHRpb25zIGV4dGVuZHMgUmVzdEFwaUJhc2VQcm9wcywgUmVzb3VyY2VPcHRpb25zIHtcbn1cblxuLyoqXG4gKiBQcm9wcyB0byBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgUmVzdEFwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlc3RBcGlQcm9wcyBleHRlbmRzIFJlc3RBcGlPcHRpb25zIHtcblxuICAvKipcbiAgICogVGhlIGxpc3Qgb2YgYmluYXJ5IG1lZGlhIG1pbWUtdHlwZXMgdGhhdCBhcmUgc3VwcG9ydGVkIGJ5IHRoZSBSZXN0QXBpXG4gICAqIHJlc291cmNlLCBzdWNoIGFzIFwiaW1hZ2UvcG5nXCIgb3IgXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFJlc3RBcGkgc3VwcG9ydHMgb25seSBVVEYtOC1lbmNvZGVkIHRleHQgcGF5bG9hZHMuXG4gICAqL1xuICByZWFkb25seSBiaW5hcnlNZWRpYVR5cGVzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEEgbnVsbGFibGUgaW50ZWdlciB0aGF0IGlzIHVzZWQgdG8gZW5hYmxlIGNvbXByZXNzaW9uICh3aXRoIG5vbi1uZWdhdGl2ZVxuICAgKiBiZXR3ZWVuIDAgYW5kIDEwNDg1NzYwICgxME0pIGJ5dGVzLCBpbmNsdXNpdmUpIG9yIGRpc2FibGUgY29tcHJlc3Npb25cbiAgICogKHdoZW4gdW5kZWZpbmVkKSBvbiBhbiBBUEkuIFdoZW4gY29tcHJlc3Npb24gaXMgZW5hYmxlZCwgY29tcHJlc3Npb24gb3JcbiAgICogZGVjb21wcmVzc2lvbiBpcyBub3QgYXBwbGllZCBvbiB0aGUgcGF5bG9hZCBpZiB0aGUgcGF5bG9hZCBzaXplIGlzXG4gICAqIHNtYWxsZXIgdGhhbiB0aGlzIHZhbHVlLiBTZXR0aW5nIGl0IHRvIHplcm8gYWxsb3dzIGNvbXByZXNzaW9uIGZvciBhbnlcbiAgICogcGF5bG9hZCBzaXplLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIENvbXByZXNzaW9uIGlzIGRpc2FibGVkLlxuICAgKiBAZGVwcmVjYXRlZCAtIHN1cGVyc2VkZWQgYnkgYG1pbkNvbXByZXNzaW9uU2l6ZWBcbiAgICovXG4gIHJlYWRvbmx5IG1pbmltdW1Db21wcmVzc2lvblNpemU/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEEgU2l6ZShpbiBieXRlcywga2liaWJ5dGVzLCBtZWJpYnl0ZXMgZXRjKSB0aGF0IGlzIHVzZWQgdG8gZW5hYmxlIGNvbXByZXNzaW9uICh3aXRoIG5vbi1uZWdhdGl2ZVxuICAgKiBiZXR3ZWVuIDAgYW5kIDEwNDg1NzYwICgxME0pIGJ5dGVzLCBpbmNsdXNpdmUpIG9yIGRpc2FibGUgY29tcHJlc3Npb25cbiAgICogKHdoZW4gdW5kZWZpbmVkKSBvbiBhbiBBUEkuIFdoZW4gY29tcHJlc3Npb24gaXMgZW5hYmxlZCwgY29tcHJlc3Npb24gb3JcbiAgICogZGVjb21wcmVzc2lvbiBpcyBub3QgYXBwbGllZCBvbiB0aGUgcGF5bG9hZCBpZiB0aGUgcGF5bG9hZCBzaXplIGlzXG4gICAqIHNtYWxsZXIgdGhhbiB0aGlzIHZhbHVlLiBTZXR0aW5nIGl0IHRvIHplcm8gYWxsb3dzIGNvbXByZXNzaW9uIGZvciBhbnlcbiAgICogcGF5bG9hZCBzaXplLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIENvbXByZXNzaW9uIGlzIGRpc2FibGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgbWluQ29tcHJlc3Npb25TaXplPzogU2l6ZTtcblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBBUEkgR2F0ZXdheSBSZXN0QXBpIHJlc291cmNlIHRoYXQgeW91IHdhbnQgdG8gY2xvbmUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS5cbiAgICovXG4gIHJlYWRvbmx5IGNsb25lRnJvbT86IElSZXN0QXBpO1xuXG4gIC8qKlxuICAgKiBUaGUgc291cmNlIG9mIHRoZSBBUEkga2V5IGZvciBtZXRlcmluZyByZXF1ZXN0cyBhY2NvcmRpbmcgdG8gYSB1c2FnZVxuICAgKiBwbGFuLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE1ldGVyaW5nIGlzIGRpc2FibGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgYXBpS2V5U291cmNlVHlwZT86IEFwaUtleVNvdXJjZVR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBFbmRwb2ludENvbmZpZ3VyYXRpb24gcHJvcGVydHkgdHlwZSBzcGVjaWZpZXMgdGhlIGVuZHBvaW50IHR5cGVzIG9mIGEgUkVTVCBBUElcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1hcGlnYXRld2F5LXJlc3RhcGktZW5kcG9pbnRjb25maWd1cmF0aW9uLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgRW5kcG9pbnRUeXBlLkVER0VcbiAgICovXG4gIHJlYWRvbmx5IGVuZHBvaW50Q29uZmlndXJhdGlvbj86IEVuZHBvaW50Q29uZmlndXJhdGlvbjtcbn1cblxuLyoqXG4gKiBQcm9wcyB0byBpbnN0YW50aWF0ZSBhIG5ldyBTcGVjUmVzdEFwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNwZWNSZXN0QXBpUHJvcHMgZXh0ZW5kcyBSZXN0QXBpQmFzZVByb3BzIHtcbiAgLyoqXG4gICAqIEFuIE9wZW5BUEkgZGVmaW5pdGlvbiBjb21wYXRpYmxlIHdpdGggQVBJIEdhdGV3YXkuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwaWdhdGV3YXkvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2FwaS1nYXRld2F5LWltcG9ydC1hcGkuaHRtbFxuICAgKi9cbiAgcmVhZG9ubHkgYXBpRGVmaW5pdGlvbjogQXBpRGVmaW5pdGlvbjtcblxuICAvKipcbiAgICogQSBTaXplKGluIGJ5dGVzLCBraWJpYnl0ZXMsIG1lYmlieXRlcyBldGMpIHRoYXQgaXMgdXNlZCB0byBlbmFibGUgY29tcHJlc3Npb24gKHdpdGggbm9uLW5lZ2F0aXZlXG4gICAqIGJldHdlZW4gMCBhbmQgMTA0ODU3NjAgKDEwTSkgYnl0ZXMsIGluY2x1c2l2ZSkgb3IgZGlzYWJsZSBjb21wcmVzc2lvblxuICAgKiAod2hlbiB1bmRlZmluZWQpIG9uIGFuIEFQSS4gV2hlbiBjb21wcmVzc2lvbiBpcyBlbmFibGVkLCBjb21wcmVzc2lvbiBvclxuICAgKiBkZWNvbXByZXNzaW9uIGlzIG5vdCBhcHBsaWVkIG9uIHRoZSBwYXlsb2FkIGlmIHRoZSBwYXlsb2FkIHNpemUgaXNcbiAgICogc21hbGxlciB0aGFuIHRoaXMgdmFsdWUuIFNldHRpbmcgaXQgdG8gemVybyBhbGxvd3MgY29tcHJlc3Npb24gZm9yIGFueVxuICAgKiBwYXlsb2FkIHNpemUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQ29tcHJlc3Npb24gaXMgZGlzYWJsZWQuXG4gICAqL1xuICByZWFkb25seSBtaW5Db21wcmVzc2lvblNpemU/OiBTaXplO1xufVxuXG4vKipcbiAqIEJhc2UgaW1wbGVtZW50YXRpb24gdGhhdCBhcmUgY29tbW9uIHRvIHZhcmlvdXMgaW1wbGVtZW50YXRpb25zIG9mIElSZXN0QXBpXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZXN0QXBpQmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVJlc3RBcGkge1xuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBvYmplY3QgaXMgYW4gaW5zdGFuY2Ugb2YgUmVzdEFwaUJhc2UuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBfaXNSZXN0QXBpQmFzZSh4OiBhbnkpOiB4IGlzIFJlc3RBcGlCYXNlIHtcbiAgICByZXR1cm4geCAhPT0gbnVsbCAmJiB0eXBlb2YoeCkgPT09ICdvYmplY3QnICYmIFJFU1RBUElfU1lNQk9MIGluIHg7XG4gIH1cblxuICAvKipcbiAgICogQVBJIEdhdGV3YXkgZGVwbG95bWVudCB0aGF0IHJlcHJlc2VudHMgdGhlIGxhdGVzdCBjaGFuZ2VzIG9mIHRoZSBBUEkuXG4gICAqIFRoaXMgcmVzb3VyY2Ugd2lsbCBiZSBhdXRvbWF0aWNhbGx5IHVwZGF0ZWQgZXZlcnkgdGltZSB0aGUgUkVTVCBBUEkgbW9kZWwgY2hhbmdlcy5cbiAgICogVGhpcyB3aWxsIGJlIHVuZGVmaW5lZCBpZiBgZGVwbG95YCBpcyBmYWxzZS5cbiAgICovXG4gIHB1YmxpYyBnZXQgbGF0ZXN0RGVwbG95bWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbGF0ZXN0RGVwbG95bWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZmlyc3QgZG9tYWluIG5hbWUgbWFwcGVkIHRvIHRoaXMgQVBJLCBpZiBkZWZpbmVkIHRocm91Z2ggdGhlIGBkb21haW5OYW1lYFxuICAgKiBjb25maWd1cmF0aW9uIHByb3AsIG9yIGFkZGVkIHZpYSBgYWRkRG9tYWluTmFtZWBcbiAgICovXG4gIHB1YmxpYyBnZXQgZG9tYWluTmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZG9tYWluTmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhpcyBBUEkgR2F0ZXdheSBSZXN0QXBpLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHJlc3RBcGlJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVzb3VyY2UgSUQgb2YgdGhlIHJvb3QgcmVzb3VyY2UuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSByZXN0QXBpUm9vdFJlc291cmNlSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogUmVwcmVzZW50cyB0aGUgcm9vdCByZXNvdXJjZSBvZiB0aGlzIEFQSSBlbmRwb2ludCAoJy8nKS5cbiAgICogUmVzb3VyY2VzIGFuZCBNZXRob2RzIGFyZSBhZGRlZCB0byB0aGlzIHJlc291cmNlLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHJvb3Q6IElSZXNvdXJjZTtcblxuICAvKipcbiAgICogQVBJIEdhdGV3YXkgc3RhZ2UgdGhhdCBwb2ludHMgdG8gdGhlIGxhdGVzdCBkZXBsb3ltZW50IChpZiBkZWZpbmVkKS5cbiAgICpcbiAgICogSWYgYGRlcGxveWAgaXMgZGlzYWJsZWQsIHlvdSB3aWxsIG5lZWQgdG8gZXhwbGljaXRseSBhc3NpZ24gdGhpcyB2YWx1ZSBpbiBvcmRlciB0b1xuICAgKiBzZXQgdXAgaW50ZWdyYXRpb25zLlxuICAgKi9cbiAgcHVibGljIGRlcGxveW1lbnRTdGFnZSE6IFN0YWdlO1xuXG4gIC8qKlxuICAgKiBBIGh1bWFuIGZyaWVuZGx5IG5hbWUgZm9yIHRoaXMgUmVzdCBBUEkuIE5vdGUgdGhhdCB0aGlzIGlzIGRpZmZlcmVudCBmcm9tIGByZXN0QXBpSWRgLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcmVzdEFwaU5hbWU6IHN0cmluZztcblxuICBwcml2YXRlIF9sYXRlc3REZXBsb3ltZW50PzogRGVwbG95bWVudDtcbiAgcHJpdmF0ZSBfZG9tYWluTmFtZT86IERvbWFpbk5hbWU7XG5cbiAgcHJvdGVjdGVkIGNsb3VkV2F0Y2hBY2NvdW50PzogQ2ZuQWNjb3VudDtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUmVzdEFwaUJhc2VQcm9wcyA9IHsgfSkge1xuICAgIGNvbnN0IHJlc3RBcGlOYW1lID0gcHJvcHMucmVzdEFwaU5hbWUgPz8gaWQ7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHJlc3RBcGlOYW1lLFxuICAgIH0pO1xuICAgIHRoaXMucmVzdEFwaU5hbWUgPSByZXN0QXBpTmFtZTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBSRVNUQVBJX1NZTUJPTCwgeyB2YWx1ZTogdHJ1ZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBVUkwgZm9yIGFuIEhUVFAgcGF0aC5cbiAgICpcbiAgICogRmFpbHMgaWYgYGRlcGxveW1lbnRTdGFnZWAgaXMgbm90IHNldCBlaXRoZXIgYnkgYGRlcGxveWAgb3IgZXhwbGljaXRseS5cbiAgICovXG4gIHB1YmxpYyB1cmxGb3JQYXRoKHBhdGg6IHN0cmluZyA9ICcvJyk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLmRlcGxveW1lbnRTdGFnZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZGV0ZXJtaW5lIGRlcGxveW1lbnQgc3RhZ2UgZm9yIEFQSSBmcm9tIFwiZGVwbG95bWVudFN0YWdlXCIuIFVzZSBcImRlcGxveVwiIG9yIGV4cGxpY2l0bHkgc2V0IFwiZGVwbG95bWVudFN0YWdlXCInKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5kZXBsb3ltZW50U3RhZ2UudXJsRm9yUGF0aChwYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGFuIEFQSSBHYXRld2F5IGRvbWFpbiBuYW1lIGFuZCBtYXBzIGl0IHRvIHRoaXMgQVBJLlxuICAgKiBAcGFyYW0gaWQgVGhlIGNvbnN0cnVjdCBpZFxuICAgKiBAcGFyYW0gb3B0aW9ucyBjdXN0b20gZG9tYWluIG9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBhZGREb21haW5OYW1lKGlkOiBzdHJpbmcsIG9wdGlvbnM6IERvbWFpbk5hbWVPcHRpb25zKTogRG9tYWluTmFtZSB7XG4gICAgY29uc3QgZG9tYWluTmFtZSA9IG5ldyBEb21haW5OYW1lKHRoaXMsIGlkLCB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgbWFwcGluZzogdGhpcyxcbiAgICB9KTtcbiAgICBpZiAoIXRoaXMuX2RvbWFpbk5hbWUpIHtcbiAgICAgIHRoaXMuX2RvbWFpbk5hbWUgPSBkb21haW5OYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZG9tYWluTmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgdXNhZ2UgcGxhbi5cbiAgICovXG4gIHB1YmxpYyBhZGRVc2FnZVBsYW4oaWQ6IHN0cmluZywgcHJvcHM6IFVzYWdlUGxhblByb3BzID0ge30pOiBVc2FnZVBsYW4ge1xuICAgIHJldHVybiBuZXcgVXNhZ2VQbGFuKHRoaXMsIGlkLCBwcm9wcyk7XG4gIH1cblxuICBwdWJsaWMgYXJuRm9yRXhlY3V0ZUFwaShtZXRob2Q6IHN0cmluZyA9ICcqJywgcGF0aDogc3RyaW5nID0gJy8qJywgc3RhZ2U6IHN0cmluZyA9ICcqJykge1xuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKHBhdGgpICYmICFwYXRoLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcInBhdGhcIiBtdXN0IGJlZ2luIHdpdGggYSBcIi9cIjogJyR7cGF0aH0nYCk7XG4gICAgfVxuXG4gICAgaWYgKG1ldGhvZC50b1VwcGVyQ2FzZSgpID09PSAnQU5ZJykge1xuICAgICAgbWV0aG9kID0gJyonO1xuICAgIH1cblxuICAgIHJldHVybiBTdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ2V4ZWN1dGUtYXBpJyxcbiAgICAgIHJlc291cmNlOiB0aGlzLnJlc3RBcGlJZCxcbiAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUsXG4gICAgICByZXNvdXJjZU5hbWU6IGAke3N0YWdlfS8ke21ldGhvZH0ke3BhdGh9YCxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbmV3IGdhdGV3YXkgcmVzcG9uc2UuXG4gICAqL1xuICBwdWJsaWMgYWRkR2F0ZXdheVJlc3BvbnNlKGlkOiBzdHJpbmcsIG9wdGlvbnM6IEdhdGV3YXlSZXNwb25zZU9wdGlvbnMpOiBHYXRld2F5UmVzcG9uc2Uge1xuICAgIHJldHVybiBuZXcgR2F0ZXdheVJlc3BvbnNlKHRoaXMsIGlkLCB7XG4gICAgICByZXN0QXBpOiB0aGlzLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW4gQXBpS2V5IHRvIHRoZSBkZXBsb3ltZW50U3RhZ2VcbiAgICovXG4gIHB1YmxpYyBhZGRBcGlLZXkoaWQ6IHN0cmluZywgb3B0aW9ucz86IEFwaUtleU9wdGlvbnMpOiBJQXBpS2V5IHtcbiAgICByZXR1cm4gbmV3IEFwaUtleSh0aGlzLCBpZCwge1xuICAgICAgc3RhZ2VzOiBbdGhpcy5kZXBsb3ltZW50U3RhZ2VdLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBnaXZlbiBuYW1lZCBtZXRyaWMgZm9yIHRoaXMgQVBJXG4gICAqL1xuICBwdWJsaWMgbWV0cmljKG1ldHJpY05hbWU6IHN0cmluZywgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIG5ldyBjbG91ZHdhdGNoLk1ldHJpYyh7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQXBpR2F0ZXdheScsXG4gICAgICBtZXRyaWNOYW1lLFxuICAgICAgZGltZW5zaW9uc01hcDogeyBBcGlOYW1lOiB0aGlzLnJlc3RBcGlOYW1lIH0sXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KS5hdHRhY2hUbyh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgY2xpZW50LXNpZGUgZXJyb3JzIGNhcHR1cmVkIGluIGEgZ2l2ZW4gcGVyaW9kLlxuICAgKlxuICAgKiBEZWZhdWx0OiBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNDbGllbnRFcnJvcihwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoQXBpR2F0ZXdheU1ldHJpY3MuXzRYeEVycm9yU3VtLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIHNlcnZlci1zaWRlIGVycm9ycyBjYXB0dXJlZCBpbiBhIGdpdmVuIHBlcmlvZC5cbiAgICpcbiAgICogRGVmYXVsdDogc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljU2VydmVyRXJyb3IocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKEFwaUdhdGV3YXlNZXRyaWNzLl81WHhFcnJvclN1bSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiByZXF1ZXN0cyBzZXJ2ZWQgZnJvbSB0aGUgQVBJIGNhY2hlIGluIGEgZ2l2ZW4gcGVyaW9kLlxuICAgKlxuICAgKiBEZWZhdWx0OiBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNDYWNoZUhpdENvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcGlHYXRld2F5TWV0cmljcy5jYWNoZUhpdENvdW50U3VtLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIHJlcXVlc3RzIHNlcnZlZCBmcm9tIHRoZSBiYWNrZW5kIGluIGEgZ2l2ZW4gcGVyaW9kLFxuICAgKiB3aGVuIEFQSSBjYWNoaW5nIGlzIGVuYWJsZWQuXG4gICAqXG4gICAqIERlZmF1bHQ6IHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY0NhY2hlTWlzc0NvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcGlHYXRld2F5TWV0cmljcy5jYWNoZU1pc3NDb3VudFN1bSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIHRvdGFsIG51bWJlciBBUEkgcmVxdWVzdHMgaW4gYSBnaXZlbiBwZXJpb2QuXG4gICAqXG4gICAqIERlZmF1bHQ6IHNhbXBsZSBjb3VudCBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY0NvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcGlHYXRld2F5TWV0cmljcy5jb3VudFN1bSwge1xuICAgICAgc3RhdGlzdGljOiAnU2FtcGxlQ291bnQnLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgdGltZSBiZXR3ZWVuIHdoZW4gQVBJIEdhdGV3YXkgcmVsYXlzIGEgcmVxdWVzdCB0byB0aGUgYmFja2VuZFxuICAgKiBhbmQgd2hlbiBpdCByZWNlaXZlcyBhIHJlc3BvbnNlIGZyb20gdGhlIGJhY2tlbmQuXG4gICAqXG4gICAqIERlZmF1bHQ6IGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXMuXG4gICAqL1xuICBwdWJsaWMgbWV0cmljSW50ZWdyYXRpb25MYXRlbmN5KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcGlHYXRld2F5TWV0cmljcy5pbnRlZ3JhdGlvbkxhdGVuY3lBdmVyYWdlLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHRpbWUgYmV0d2VlbiB3aGVuIEFQSSBHYXRld2F5IHJlY2VpdmVzIGEgcmVxdWVzdCBmcm9tIGEgY2xpZW50XG4gICAqIGFuZCB3aGVuIGl0IHJldHVybnMgYSByZXNwb25zZSB0byB0aGUgY2xpZW50LlxuICAgKiBUaGUgbGF0ZW5jeSBpbmNsdWRlcyB0aGUgaW50ZWdyYXRpb24gbGF0ZW5jeSBhbmQgb3RoZXIgQVBJIEdhdGV3YXkgb3ZlcmhlYWQuXG4gICAqXG4gICAqIERlZmF1bHQ6IGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXMuXG4gICAqL1xuICBwdWJsaWMgbWV0cmljTGF0ZW5jeShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoQXBpR2F0ZXdheU1ldHJpY3MubGF0ZW5jeUF2ZXJhZ2UsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBBUEkgdXNlZCBieSBgTWV0aG9kYCB0byBrZWVwIGFuIGludmVudG9yeSBvZiBtZXRob2RzIGF0IHRoZSBBUElcbiAgICogbGV2ZWwgZm9yIHZhbGlkYXRpb24gcHVycG9zZXMuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9hdHRhY2hNZXRob2QobWV0aG9kOiBNZXRob2QpIHtcbiAgICBpZ25vcmUobWV0aG9kKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NvY2lhdGVzIGEgRGVwbG95bWVudCByZXNvdXJjZSB3aXRoIHRoaXMgUkVTVCBBUEkuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9hdHRhY2hEZXBsb3ltZW50KGRlcGxveW1lbnQ6IERlcGxveW1lbnQpIHtcbiAgICBpZ25vcmUoZGVwbG95bWVudCk7XG4gIH1cblxuICAvKipcbiAgICogQXNzb2NpYXRlcyBhIFN0YWdlIHdpdGggdGhpcyBSRVNUIEFQSVxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfYXR0YWNoU3RhZ2Uoc3RhZ2U6IFN0YWdlKSB7XG4gICAgaWYgKHRoaXMuY2xvdWRXYXRjaEFjY291bnQpIHtcbiAgICAgIHN0YWdlLm5vZGUuYWRkRGVwZW5kZW5jeSh0aGlzLmNsb3VkV2F0Y2hBY2NvdW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcm90ZWN0ZWQgX2NvbmZpZ3VyZUNsb3VkV2F0Y2hSb2xlKGFwaVJlc291cmNlOiBDZm5SZXN0QXBpKSB7XG4gICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQ2xvdWRXYXRjaFJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnYXBpZ2F0ZXdheS5hbWF6b25hd3MuY29tJyksXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ3NlcnZpY2Utcm9sZS9BbWF6b25BUElHYXRld2F5UHVzaFRvQ2xvdWRXYXRjaExvZ3MnKV0sXG4gICAgfSk7XG4gICAgcm9sZS5hcHBseVJlbW92YWxQb2xpY3koUmVtb3ZhbFBvbGljeS5SRVRBSU4pO1xuXG4gICAgdGhpcy5jbG91ZFdhdGNoQWNjb3VudCA9IG5ldyBDZm5BY2NvdW50KHRoaXMsICdBY2NvdW50Jywge1xuICAgICAgY2xvdWRXYXRjaFJvbGVBcm46IHJvbGUucm9sZUFybixcbiAgICB9KTtcbiAgICB0aGlzLmNsb3VkV2F0Y2hBY2NvdW50LmFwcGx5UmVtb3ZhbFBvbGljeShSZW1vdmFsUG9saWN5LlJFVEFJTik7XG5cbiAgICB0aGlzLmNsb3VkV2F0Y2hBY2NvdW50Lm5vZGUuYWRkRGVwZW5kZW5jeShhcGlSZXNvdXJjZSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVGhpcyBtZXRob2Qgd2lsbCBiZSBtYWRlIGludGVybmFsLiBObyByZXBsYWNlbWVudFxuICAgKi9cbiAgcHJvdGVjdGVkIGNvbmZpZ3VyZUNsb3VkV2F0Y2hSb2xlKGFwaVJlc291cmNlOiBDZm5SZXN0QXBpKSB7XG4gICAgdGhpcy5fY29uZmlndXJlQ2xvdWRXYXRjaFJvbGUoYXBpUmVzb3VyY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFRoaXMgbWV0aG9kIHdpbGwgYmUgbWFkZSBpbnRlcm5hbC4gTm8gcmVwbGFjZW1lbnRcbiAgICovXG4gIHByb3RlY3RlZCBjb25maWd1cmVEZXBsb3ltZW50KHByb3BzOiBSZXN0QXBpQmFzZVByb3BzKSB7XG4gICAgdGhpcy5fY29uZmlndXJlRGVwbG95bWVudChwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcm90ZWN0ZWQgX2NvbmZpZ3VyZURlcGxveW1lbnQocHJvcHM6IFJlc3RBcGlCYXNlUHJvcHMpIHtcbiAgICBjb25zdCBkZXBsb3kgPSBwcm9wcy5kZXBsb3kgPz8gdHJ1ZTtcbiAgICBpZiAoZGVwbG95KSB7XG5cbiAgICAgIHRoaXMuX2xhdGVzdERlcGxveW1lbnQgPSBuZXcgRGVwbG95bWVudCh0aGlzLCAnRGVwbG95bWVudCcsIHtcbiAgICAgICAgZGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uPyBwcm9wcy5kZXNjcmlwdGlvbiA6J0F1dG9tYXRpY2FsbHkgY3JlYXRlZCBieSB0aGUgUmVzdEFwaSBjb25zdHJ1Y3QnLFxuICAgICAgICBhcGk6IHRoaXMsXG4gICAgICAgIHJldGFpbkRlcGxveW1lbnRzOiBwcm9wcy5yZXRhaW5EZXBsb3ltZW50cyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBlbmNvZGUgdGhlIHN0YWdlIG5hbWUgaW50byB0aGUgY29uc3RydWN0IGlkLCBzbyBpZiB3ZSBjaGFuZ2UgdGhlIHN0YWdlIG5hbWUsIGl0IHdpbGwgcmVjcmVhdGUgYSBuZXcgc3RhZ2UuXG4gICAgICAvLyBzdGFnZSBuYW1lIGlzIHBhcnQgb2YgdGhlIGVuZHBvaW50LCBzbyB0aGF0IG1ha2VzIHNlbnNlLlxuICAgICAgY29uc3Qgc3RhZ2VOYW1lID0gKHByb3BzLmRlcGxveU9wdGlvbnMgJiYgcHJvcHMuZGVwbG95T3B0aW9ucy5zdGFnZU5hbWUpIHx8ICdwcm9kJztcblxuICAgICAgdGhpcy5kZXBsb3ltZW50U3RhZ2UgPSBuZXcgU3RhZ2UodGhpcywgYERlcGxveW1lbnRTdGFnZS4ke3N0YWdlTmFtZX1gLCB7XG4gICAgICAgIGRlcGxveW1lbnQ6IHRoaXMuX2xhdGVzdERlcGxveW1lbnQsXG4gICAgICAgIC4uLnByb3BzLmRlcGxveU9wdGlvbnMsXG4gICAgICB9KTtcblxuICAgICAgbmV3IENmbk91dHB1dCh0aGlzLCAnRW5kcG9pbnQnLCB7IGV4cG9ydE5hbWU6IHByb3BzLmVuZHBvaW50RXhwb3J0TmFtZSwgdmFsdWU6IHRoaXMudXJsRm9yUGF0aCgpIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocHJvcHMuZGVwbG95T3B0aW9ucykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzZXQgXFwnZGVwbG95T3B0aW9uc1xcJyBpZiBcXCdkZXBsb3lcXCcgaXMgZGlzYWJsZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcm90ZWN0ZWQgX2NvbmZpZ3VyZUVuZHBvaW50cyhwcm9wczogUmVzdEFwaVByb3BzKTogQ2ZuUmVzdEFwaS5FbmRwb2ludENvbmZpZ3VyYXRpb25Qcm9wZXJ0eSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHByb3BzLmVuZHBvaW50VHlwZXMgJiYgcHJvcHMuZW5kcG9pbnRDb25maWd1cmF0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgb25lIG9mIHRoZSBSZXN0QXBpIHByb3BzLCBlbmRwb2ludFR5cGVzIG9yIGVuZHBvaW50Q29uZmlndXJhdGlvbiwgaXMgYWxsb3dlZCcpO1xuICAgIH1cbiAgICBpZiAocHJvcHMuZW5kcG9pbnRDb25maWd1cmF0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlczogcHJvcHMuZW5kcG9pbnRDb25maWd1cmF0aW9uLnR5cGVzLFxuICAgICAgICB2cGNFbmRwb2ludElkczogcHJvcHMuZW5kcG9pbnRDb25maWd1cmF0aW9uPy52cGNFbmRwb2ludHM/Lm1hcCh2cGNFbmRwb2ludCA9PiB2cGNFbmRwb2ludC52cGNFbmRwb2ludElkKSxcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChwcm9wcy5lbmRwb2ludFR5cGVzKSB7XG4gICAgICByZXR1cm4geyB0eXBlczogcHJvcHMuZW5kcG9pbnRUeXBlcyB9O1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBjYW5uZWRNZXRyaWMoZm46IChkaW1zOiB7IEFwaU5hbWU6IHN0cmluZyB9KSA9PiBjbG91ZHdhdGNoLk1ldHJpY1Byb3BzLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgLi4uZm4oeyBBcGlOYW1lOiB0aGlzLnJlc3RBcGlOYW1lIH0pLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSkuYXR0YWNoVG8odGhpcyk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgUkVTVCBBUEkgaW4gQW1hem9uIEFQSSBHYXRld2F5LCBjcmVhdGVkIHdpdGggYW4gT3BlbkFQSSBzcGVjaWZpY2F0aW9uLlxuICpcbiAqIFNvbWUgcHJvcGVydGllcyBub3JtYWxseSBhY2Nlc3NpYmxlIG9uIEBzZWUgYFJlc3RBcGlgIC0gc3VjaCBhcyB0aGUgZGVzY3JpcHRpb24gLVxuICogbXVzdCBiZSBkZWNsYXJlZCBpbiB0aGUgc3BlY2lmaWNhdGlvbi4gQWxsIFJlc291cmNlcyBhbmQgTWV0aG9kcyBuZWVkIHRvIGJlIGRlZmluZWQgYXNcbiAqIHBhcnQgb2YgdGhlIE9wZW5BUEkgc3BlY2lmaWNhdGlvbiBmaWxlLCBhbmQgY2Fubm90IGJlIGFkZGVkIHZpYSB0aGUgQ0RLLlxuICpcbiAqIEJ5IGRlZmF1bHQsIHRoZSBBUEkgd2lsbCBhdXRvbWF0aWNhbGx5IGJlIGRlcGxveWVkIGFuZCBhY2Nlc3NpYmxlIGZyb20gYVxuICogcHVibGljIGVuZHBvaW50LlxuICpcbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpBcGlHYXRld2F5OjpSZXN0QXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBTcGVjUmVzdEFwaSBleHRlbmRzIFJlc3RBcGlCYXNlIHtcbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGlzIEFQSSBHYXRld2F5IFJlc3RBcGkuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcmVzdEFwaUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSByZXNvdXJjZSBJRCBvZiB0aGUgcm9vdCByZXNvdXJjZS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJlc3RBcGlSb290UmVzb3VyY2VJZDogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSByb290OiBJUmVzb3VyY2U7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFNwZWNSZXN0QXBpUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICBjb25zdCBhcGlEZWZDb25maWcgPSBwcm9wcy5hcGlEZWZpbml0aW9uLmJpbmQodGhpcyk7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuUmVzdEFwaSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBuYW1lOiB0aGlzLnJlc3RBcGlOYW1lLFxuICAgICAgcG9saWN5OiBwcm9wcy5wb2xpY3ksXG4gICAgICBmYWlsT25XYXJuaW5nczogcHJvcHMuZmFpbE9uV2FybmluZ3MsXG4gICAgICBtaW5pbXVtQ29tcHJlc3Npb25TaXplOiBwcm9wcy5taW5Db21wcmVzc2lvblNpemU/LnRvQnl0ZXMoKSxcbiAgICAgIGJvZHk6IGFwaURlZkNvbmZpZy5pbmxpbmVEZWZpbml0aW9uID8/IHVuZGVmaW5lZCxcbiAgICAgIGJvZHlTM0xvY2F0aW9uOiBhcGlEZWZDb25maWcuaW5saW5lRGVmaW5pdGlvbiA/IHVuZGVmaW5lZCA6IGFwaURlZkNvbmZpZy5zM0xvY2F0aW9uLFxuICAgICAgZW5kcG9pbnRDb25maWd1cmF0aW9uOiB0aGlzLl9jb25maWd1cmVFbmRwb2ludHMocHJvcHMpLFxuICAgICAgcGFyYW1ldGVyczogcHJvcHMucGFyYW1ldGVycyxcbiAgICAgIGRpc2FibGVFeGVjdXRlQXBpRW5kcG9pbnQ6IHByb3BzLmRpc2FibGVFeGVjdXRlQXBpRW5kcG9pbnQsXG4gICAgfSk7XG5cbiAgICBwcm9wcy5hcGlEZWZpbml0aW9uLmJpbmRBZnRlckNyZWF0ZSh0aGlzLCB0aGlzKTtcblxuICAgIHRoaXMubm9kZS5kZWZhdWx0Q2hpbGQgPSByZXNvdXJjZTtcbiAgICB0aGlzLnJlc3RBcGlJZCA9IHJlc291cmNlLnJlZjtcbiAgICB0aGlzLnJlc3RBcGlSb290UmVzb3VyY2VJZCA9IHJlc291cmNlLmF0dHJSb290UmVzb3VyY2VJZDtcbiAgICB0aGlzLnJvb3QgPSBuZXcgUm9vdFJlc291cmNlKHRoaXMsIHt9LCB0aGlzLnJlc3RBcGlSb290UmVzb3VyY2VJZCk7XG5cbiAgICBjb25zdCBjbG91ZFdhdGNoUm9sZURlZmF1bHQgPSBGZWF0dXJlRmxhZ3Mub2YodGhpcykuaXNFbmFibGVkKEFQSUdBVEVXQVlfRElTQUJMRV9DTE9VRFdBVENIX1JPTEUpID8gZmFsc2UgOiB0cnVlO1xuICAgIGNvbnN0IGNsb3VkV2F0Y2hSb2xlID0gcHJvcHMuY2xvdWRXYXRjaFJvbGUgPz8gY2xvdWRXYXRjaFJvbGVEZWZhdWx0O1xuICAgIGlmIChjbG91ZFdhdGNoUm9sZSkge1xuICAgICAgdGhpcy5fY29uZmlndXJlQ2xvdWRXYXRjaFJvbGUocmVzb3VyY2UpO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbmZpZ3VyZURlcGxveW1lbnQocHJvcHMpO1xuICAgIGlmIChwcm9wcy5kb21haW5OYW1lKSB7XG4gICAgICB0aGlzLmFkZERvbWFpbk5hbWUoJ0N1c3RvbURvbWFpbicsIHByb3BzLmRvbWFpbk5hbWUpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEF0dHJpYnV0ZXMgdGhhdCBjYW4gYmUgc3BlY2lmaWVkIHdoZW4gaW1wb3J0aW5nIGEgUmVzdEFwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlc3RBcGlBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgQVBJIEdhdGV3YXkgUmVzdEFwaS5cbiAgICovXG4gIHJlYWRvbmx5IHJlc3RBcGlJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgQVBJIEdhdGV3YXkgUmVzdEFwaS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBJRCBvZiB0aGUgUmVzdEFwaSBjb25zdHJ1Y3QuXG4gICAqL1xuICByZWFkb25seSByZXN0QXBpTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJlc291cmNlIElEIG9mIHRoZSByb290IHJlc291cmNlLlxuICAgKi9cbiAgcmVhZG9ubHkgcm9vdFJlc291cmNlSWQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgUkVTVCBBUEkgaW4gQW1hem9uIEFQSSBHYXRld2F5LlxuICpcbiAqIFVzZSBgYWRkUmVzb3VyY2VgIGFuZCBgYWRkTWV0aG9kYCB0byBjb25maWd1cmUgdGhlIEFQSSBtb2RlbC5cbiAqXG4gKiBCeSBkZWZhdWx0LCB0aGUgQVBJIHdpbGwgYXV0b21hdGljYWxseSBiZSBkZXBsb3llZCBhbmQgYWNjZXNzaWJsZSBmcm9tIGFcbiAqIHB1YmxpYyBlbmRwb2ludC5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlc3RBcGkgZXh0ZW5kcyBSZXN0QXBpQmFzZSB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgUmVzdEFwaS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVJlc3RBcGlJZChzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXN0QXBpSWQ6IHN0cmluZyk6IElSZXN0QXBpIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXN0QXBpQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcmVzdEFwaUlkID0gcmVzdEFwaUlkO1xuXG4gICAgICBwdWJsaWMgZ2V0IHJvb3QoKTogSVJlc291cmNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyb290IGlzIG5vdCBjb25maWd1cmVkIHdoZW4gaW1wb3J0ZWQgdXNpbmcgYGZyb21SZXN0QXBpSWQoKWAuIFVzZSBgZnJvbVJlc3RBcGlBdHRyaWJ1dGVzKClgIEFQSSBpbnN0ZWFkLicpO1xuICAgICAgfVxuXG4gICAgICBwdWJsaWMgZ2V0IHJlc3RBcGlSb290UmVzb3VyY2VJZCgpOiBzdHJpbmcge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Jlc3RBcGlSb290UmVzb3VyY2VJZCBpcyBub3QgY29uZmlndXJlZCB3aGVuIGltcG9ydGVkIHVzaW5nIGBmcm9tUmVzdEFwaUlkKClgLiBVc2UgYGZyb21SZXN0QXBpQXR0cmlidXRlcygpYCBBUEkgaW5zdGVhZC4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBSZXN0QXBpIHRoYXQgY2FuIGJlIGNvbmZpZ3VyZWQgd2l0aCBhZGRpdGlvbmFsIE1ldGhvZHMgYW5kIFJlc291cmNlcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVJlc3RBcGlBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBSZXN0QXBpQXR0cmlidXRlcyk6IElSZXN0QXBpIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXN0QXBpQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcmVzdEFwaUlkID0gYXR0cnMucmVzdEFwaUlkO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHJlc3RBcGlOYW1lID0gYXR0cnMucmVzdEFwaU5hbWUgPz8gaWQ7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcmVzdEFwaVJvb3RSZXNvdXJjZUlkID0gYXR0cnMucm9vdFJlc291cmNlSWQ7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcm9vdDogSVJlc291cmNlID0gbmV3IFJvb3RSZXNvdXJjZSh0aGlzLCB7fSwgdGhpcy5yZXN0QXBpUm9vdFJlc291cmNlSWQpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgcmVzdEFwaUlkOiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IHJvb3Q6IElSZXNvdXJjZTtcblxuICBwdWJsaWMgcmVhZG9ubHkgcmVzdEFwaVJvb3RSZXNvdXJjZUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIG1ldGhvZHMgYm91bmQgdG8gdGhpcyBSZXN0QXBpXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbWV0aG9kcyA9IG5ldyBBcnJheTxNZXRob2Q+KCk7XG5cbiAgLyoqXG4gICAqIFRoaXMgbGlzdCBvZiBkZXBsb3ltZW50cyBib3VuZCB0byB0aGlzIFJlc3RBcGlcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgZGVwbG95bWVudHMgPSBuZXcgQXJyYXk8RGVwbG95bWVudD4oKTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUmVzdEFwaVByb3BzID0geyB9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBpZiAocHJvcHMubWluQ29tcHJlc3Npb25TaXplICE9PSB1bmRlZmluZWQgJiYgcHJvcHMubWluaW11bUNvbXByZXNzaW9uU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2JvdGggcHJvcGVydGllcyBtaW5Db21wcmVzc2lvblNpemUgYW5kIG1pbmltdW1Db21wcmVzc2lvblNpemUgY2Fubm90IGJlIHNldCBhdCBvbmNlLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmblJlc3RBcGkodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogcHJvcHMuZGVzY3JpcHRpb24sXG4gICAgICBwb2xpY3k6IHByb3BzLnBvbGljeSxcbiAgICAgIGZhaWxPbldhcm5pbmdzOiBwcm9wcy5mYWlsT25XYXJuaW5ncyxcbiAgICAgIG1pbmltdW1Db21wcmVzc2lvblNpemU6IHByb3BzLm1pbkNvbXByZXNzaW9uU2l6ZT8udG9CeXRlcygpID8/IHByb3BzLm1pbmltdW1Db21wcmVzc2lvblNpemUsXG4gICAgICBiaW5hcnlNZWRpYVR5cGVzOiBwcm9wcy5iaW5hcnlNZWRpYVR5cGVzLFxuICAgICAgZW5kcG9pbnRDb25maWd1cmF0aW9uOiB0aGlzLl9jb25maWd1cmVFbmRwb2ludHMocHJvcHMpLFxuICAgICAgYXBpS2V5U291cmNlVHlwZTogcHJvcHMuYXBpS2V5U291cmNlVHlwZSxcbiAgICAgIGNsb25lRnJvbTogcHJvcHMuY2xvbmVGcm9tPy5yZXN0QXBpSWQsXG4gICAgICBwYXJhbWV0ZXJzOiBwcm9wcy5wYXJhbWV0ZXJzLFxuICAgICAgZGlzYWJsZUV4ZWN1dGVBcGlFbmRwb2ludDogcHJvcHMuZGlzYWJsZUV4ZWN1dGVBcGlFbmRwb2ludCxcbiAgICB9KTtcbiAgICB0aGlzLm5vZGUuZGVmYXVsdENoaWxkID0gcmVzb3VyY2U7XG4gICAgdGhpcy5yZXN0QXBpSWQgPSByZXNvdXJjZS5yZWY7XG5cbiAgICBjb25zdCBjbG91ZFdhdGNoUm9sZURlZmF1bHQgPSBGZWF0dXJlRmxhZ3Mub2YodGhpcykuaXNFbmFibGVkKEFQSUdBVEVXQVlfRElTQUJMRV9DTE9VRFdBVENIX1JPTEUpID8gZmFsc2UgOiB0cnVlO1xuICAgIGNvbnN0IGNsb3VkV2F0Y2hSb2xlID0gcHJvcHMuY2xvdWRXYXRjaFJvbGUgPz8gY2xvdWRXYXRjaFJvbGVEZWZhdWx0O1xuICAgIGlmIChjbG91ZFdhdGNoUm9sZSkge1xuICAgICAgdGhpcy5fY29uZmlndXJlQ2xvdWRXYXRjaFJvbGUocmVzb3VyY2UpO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbmZpZ3VyZURlcGxveW1lbnQocHJvcHMpO1xuICAgIGlmIChwcm9wcy5kb21haW5OYW1lKSB7XG4gICAgICB0aGlzLmFkZERvbWFpbk5hbWUoJ0N1c3RvbURvbWFpbicsIHByb3BzLmRvbWFpbk5hbWUpO1xuICAgIH1cblxuICAgIHRoaXMucm9vdCA9IG5ldyBSb290UmVzb3VyY2UodGhpcywgcHJvcHMsIHJlc291cmNlLmF0dHJSb290UmVzb3VyY2VJZCk7XG4gICAgdGhpcy5yZXN0QXBpUm9vdFJlc291cmNlSWQgPSByZXNvdXJjZS5hdHRyUm9vdFJlc291cmNlSWQ7XG5cbiAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiB0aGlzLnZhbGlkYXRlUmVzdEFwaSgpIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBkZXBsb3llZCByb290IFVSTCBvZiB0aGlzIFJFU1QgQVBJLlxuICAgKi9cbiAgcHVibGljIGdldCB1cmwoKSB7XG4gICAgcmV0dXJuIHRoaXMudXJsRm9yUGF0aCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBuZXcgbW9kZWwuXG4gICAqL1xuICBwdWJsaWMgYWRkTW9kZWwoaWQ6IHN0cmluZywgcHJvcHM6IE1vZGVsT3B0aW9ucyk6IE1vZGVsIHtcbiAgICByZXR1cm4gbmV3IE1vZGVsKHRoaXMsIGlkLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIHJlc3RBcGk6IHRoaXMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG5ldyByZXF1ZXN0IHZhbGlkYXRvci5cbiAgICovXG4gIHB1YmxpYyBhZGRSZXF1ZXN0VmFsaWRhdG9yKGlkOiBzdHJpbmcsIHByb3BzOiBSZXF1ZXN0VmFsaWRhdG9yT3B0aW9ucyk6IFJlcXVlc3RWYWxpZGF0b3Ige1xuICAgIHJldHVybiBuZXcgUmVxdWVzdFZhbGlkYXRvcih0aGlzLCBpZCwge1xuICAgICAgLi4ucHJvcHMsXG4gICAgICByZXN0QXBpOiB0aGlzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVybmFsIEFQSSB1c2VkIGJ5IGBNZXRob2RgIHRvIGtlZXAgYW4gaW52ZW50b3J5IG9mIG1ldGhvZHMgYXQgdGhlIEFQSVxuICAgKiBsZXZlbCBmb3IgdmFsaWRhdGlvbiBwdXJwb3Nlcy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX2F0dGFjaE1ldGhvZChtZXRob2Q6IE1ldGhvZCkge1xuICAgIHRoaXMubWV0aG9kcy5wdXNoKG1ldGhvZCk7XG5cbiAgICAvLyBhZGQgdGhpcyBtZXRob2QgYXMgYSBkZXBlbmRlbmN5IHRvIGFsbCBkZXBsb3ltZW50cyBkZWZpbmVkIGZvciB0aGlzIGFwaVxuICAgIC8vIHdoZW4gYWRkaXRpb25hbCBkZXBsb3ltZW50cyBhcmUgYWRkZWQsIF9hdHRhY2hEZXBsb3ltZW50IGlzIGNhbGxlZCBhbmRcbiAgICAvLyB0aGlzIG1ldGhvZCB3aWxsIGJlIGFkZGVkIHRoZXJlLlxuICAgIGZvciAoY29uc3QgZGVwIG9mIHRoaXMuZGVwbG95bWVudHMpIHtcbiAgICAgIGRlcC5fYWRkTWV0aG9kRGVwZW5kZW5jeShtZXRob2QpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhIGRlcGxveW1lbnQgdG8gdGhpcyBSRVNUIEFQSS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX2F0dGFjaERlcGxveW1lbnQoZGVwbG95bWVudDogRGVwbG95bWVudCkge1xuICAgIHRoaXMuZGVwbG95bWVudHMucHVzaChkZXBsb3ltZW50KTtcblxuICAgIC8vIGFkZCBhbGwgbWV0aG9kcyB0aGF0IHdlcmUgYWxyZWFkeSBkZWZpbmVkIGFzIGRlcGVuZGVuY2llcyBvZiB0aGlzXG4gICAgLy8gZGVwbG95bWVudCB3aGVuIGFkZGl0aW9uYWwgbWV0aG9kcyBhcmUgYWRkZWQsIF9hdHRhY2hNZXRob2QgaXMgY2FsbGVkIGFuZFxuICAgIC8vIGl0IHdpbGwgYmUgYWRkZWQgYXMgYSBkZXBlbmRlbmN5IHRvIHRoaXMgZGVwbG95bWVudC5cbiAgICBmb3IgKGNvbnN0IG1ldGhvZCBvZiB0aGlzLm1ldGhvZHMpIHtcbiAgICAgIGRlcGxveW1lbnQuX2FkZE1ldGhvZERlcGVuZGVuY3kobWV0aG9kKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgdmFsaWRhdGlvbiBvZiB0aGUgUkVTVCBBUEkuXG4gICAqL1xuICBwcml2YXRlIHZhbGlkYXRlUmVzdEFwaSgpIHtcbiAgICBpZiAodGhpcy5tZXRob2RzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFtcIlRoZSBSRVNUIEFQSSBkb2Vzbid0IGNvbnRhaW4gYW55IG1ldGhvZHNcIl07XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGVuZHBvaW50IGNvbmZpZ3VyYXRpb24gb2YgYSBSRVNUIEFQSSwgaW5jbHVkaW5nIFZQQ3MgYW5kIGVuZHBvaW50IHR5cGVzLlxuICpcbiAqIEVuZHBvaW50Q29uZmlndXJhdGlvbiBpcyBhIHByb3BlcnR5IG9mIHRoZSBBV1M6OkFwaUdhdGV3YXk6OlJlc3RBcGkgcmVzb3VyY2UuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW5kcG9pbnRDb25maWd1cmF0aW9uIHtcbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBlbmRwb2ludCB0eXBlcyBvZiBhbiBBUEkgb3IgaXRzIGN1c3RvbSBkb21haW4gbmFtZS5cbiAgICpcbiAgICogQGRlZmF1bHQgRW5kcG9pbnRUeXBlLkVER0VcbiAgICovXG4gIHJlYWRvbmx5IHR5cGVzOiBFbmRwb2ludFR5cGVbXTtcblxuICAvKipcbiAgICogQSBsaXN0IG9mIFZQQyBFbmRwb2ludHMgYWdhaW5zdCB3aGljaCB0byBjcmVhdGUgUm91dGU1MyBBTElBU2VzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gQUxJQVNlcyBhcmUgY3JlYXRlZCBmb3IgdGhlIGVuZHBvaW50LlxuICAgKi9cbiAgcmVhZG9ubHkgdnBjRW5kcG9pbnRzPzogSVZwY0VuZHBvaW50W107XG59XG5cbmV4cG9ydCBlbnVtIEFwaUtleVNvdXJjZVR5cGUge1xuICAvKipcbiAgICogVG8gcmVhZCB0aGUgQVBJIGtleSBmcm9tIHRoZSBgWC1BUEktS2V5YCBoZWFkZXIgb2YgYSByZXF1ZXN0LlxuICAgKi9cbiAgSEVBREVSID0gJ0hFQURFUicsXG5cbiAgLyoqXG4gICAqIFRvIHJlYWQgdGhlIEFQSSBrZXkgZnJvbSB0aGUgYFVzYWdlSWRlbnRpZmllcktleWAgZnJvbSBhIGN1c3RvbSBhdXRob3JpemVyLlxuICAgKi9cbiAgQVVUSE9SSVpFUiA9ICdBVVRIT1JJWkVSJyxcbn1cblxuZXhwb3J0IGVudW0gRW5kcG9pbnRUeXBlIHtcbiAgLyoqXG4gICAqIEZvciBhbiBlZGdlLW9wdGltaXplZCBBUEkgYW5kIGl0cyBjdXN0b20gZG9tYWluIG5hbWUuXG4gICAqL1xuICBFREdFID0gJ0VER0UnLFxuXG4gIC8qKlxuICAgKiBGb3IgYSByZWdpb25hbCBBUEkgYW5kIGl0cyBjdXN0b20gZG9tYWluIG5hbWUuXG4gICAqL1xuICBSRUdJT05BTCA9ICdSRUdJT05BTCcsXG5cbiAgLyoqXG4gICAqIEZvciBhIHByaXZhdGUgQVBJIGFuZCBpdHMgY3VzdG9tIGRvbWFpbiBuYW1lLlxuICAgKi9cbiAgUFJJVkFURSA9ICdQUklWQVRFJ1xufVxuXG5jbGFzcyBSb290UmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZUJhc2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgcGFyZW50UmVzb3VyY2U/OiBJUmVzb3VyY2U7XG4gIHB1YmxpYyByZWFkb25seSBhcGk6IFJlc3RBcGlCYXNlO1xuICBwdWJsaWMgcmVhZG9ubHkgcmVzb3VyY2VJZDogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgcGF0aDogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdEludGVncmF0aW9uPzogSW50ZWdyYXRpb24gfCB1bmRlZmluZWQ7XG4gIHB1YmxpYyByZWFkb25seSBkZWZhdWx0TWV0aG9kT3B0aW9ucz86IE1ldGhvZE9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIHB1YmxpYyByZWFkb25seSBkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnM/OiBDb3JzT3B0aW9ucyB8IHVuZGVmaW5lZDtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9yZXN0QXBpPzogUmVzdEFwaTtcblxuICBjb25zdHJ1Y3RvcihhcGk6IFJlc3RBcGlCYXNlLCBwcm9wczogUmVzb3VyY2VPcHRpb25zLCByZXNvdXJjZUlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihhcGksICdEZWZhdWx0Jyk7XG5cbiAgICB0aGlzLnBhcmVudFJlc291cmNlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZGVmYXVsdEludGVncmF0aW9uID0gcHJvcHMuZGVmYXVsdEludGVncmF0aW9uO1xuICAgIHRoaXMuZGVmYXVsdE1ldGhvZE9wdGlvbnMgPSBwcm9wcy5kZWZhdWx0TWV0aG9kT3B0aW9ucztcbiAgICB0aGlzLmRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9ucyA9IHByb3BzLmRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9ucztcbiAgICB0aGlzLmFwaSA9IGFwaTtcbiAgICB0aGlzLnJlc291cmNlSWQgPSByZXNvdXJjZUlkO1xuICAgIHRoaXMucGF0aCA9ICcvJztcblxuICAgIGlmIChhcGkgaW5zdGFuY2VvZiBSZXN0QXBpKSB7XG4gICAgICB0aGlzLl9yZXN0QXBpID0gYXBpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9ucykge1xuICAgICAgdGhpcy5hZGRDb3JzUHJlZmxpZ2h0KHRoaXMuZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBSZXN0QXBpIGFzc29jaWF0ZWQgd2l0aCB0aGlzIFJlc291cmNlLlxuICAgKiBAZGVwcmVjYXRlZCAtIFRocm93cyBhbiBlcnJvciBpZiB0aGlzIFJlc291cmNlIGlzIG5vdCBhc3NvY2lhdGVkIHdpdGggYW4gaW5zdGFuY2Ugb2YgYFJlc3RBcGlgLiBVc2UgYGFwaWAgaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyBnZXQgcmVzdEFwaSgpOiBSZXN0QXBpIHtcbiAgICBpZiAoIXRoaXMuX3Jlc3RBcGkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVzdEFwaSBpcyBub3QgYXZhaWxhYmxlIG9uIFJlc291cmNlIG5vdCBjb25uZWN0ZWQgdG8gYW4gaW5zdGFuY2Ugb2YgUmVzdEFwaS4gVXNlIGBhcGlgIGluc3RlYWQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3Jlc3RBcGk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaWdub3JlKF94OiBhbnkpIHtcbiAgcmV0dXJuO1xufVxuIl19