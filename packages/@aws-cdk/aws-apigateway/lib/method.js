"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationType = exports.Method = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const core_1 = require("@aws-cdk/core");
const apigateway_canned_metrics_generated_1 = require("./apigateway-canned-metrics.generated");
const apigateway_generated_1 = require("./apigateway.generated");
const authorizer_1 = require("./authorizer");
const mock_1 = require("./integrations/mock");
const restapi_1 = require("./restapi");
const util_1 = require("./util");
class Method extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_MethodProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Method);
            }
            throw error;
        }
        this.resource = props.resource;
        this.api = props.resource.api;
        this.httpMethod = props.httpMethod.toUpperCase();
        util_1.validateHttpMethod(this.httpMethod);
        const options = props.options || {};
        const defaultMethodOptions = props.resource.defaultMethodOptions || {};
        const authorizer = options.authorizer || defaultMethodOptions.authorizer;
        const authorizerId = authorizer?.authorizerId ? authorizer.authorizerId : undefined;
        const authorizationTypeOption = options.authorizationType || defaultMethodOptions.authorizationType;
        const authorizationType = authorizer?.authorizationType || authorizationTypeOption || AuthorizationType.NONE;
        // if the authorizer defines an authorization type and we also have an explicit option set, check that they are the same
        if (authorizer?.authorizationType && authorizationTypeOption && authorizer?.authorizationType !== authorizationTypeOption) {
            throw new Error(`${this.resource}/${this.httpMethod} - Authorization type is set to ${authorizationTypeOption} ` +
                `which is different from what is required by the authorizer [${authorizer.authorizationType}]`);
        }
        if (authorizer_1.Authorizer.isAuthorizer(authorizer)) {
            authorizer._attachToApi(this.api);
        }
        this.methodResponses = options.methodResponses ?? [];
        const integration = props.integration ?? this.resource.defaultIntegration ?? new mock_1.MockIntegration();
        const bindResult = integration.bind(this);
        const methodProps = {
            resourceId: props.resource.resourceId,
            restApiId: this.api.restApiId,
            httpMethod: this.httpMethod,
            operationName: options.operationName || defaultMethodOptions.operationName,
            apiKeyRequired: options.apiKeyRequired || defaultMethodOptions.apiKeyRequired,
            authorizationType,
            authorizerId,
            requestParameters: options.requestParameters || defaultMethodOptions.requestParameters,
            integration: this.renderIntegration(bindResult),
            methodResponses: core_1.Lazy.any({ produce: () => this.renderMethodResponses(this.methodResponses) }, { omitEmptyArray: true }),
            requestModels: this.renderRequestModels(options.requestModels),
            requestValidatorId: this.requestValidatorId(options),
            authorizationScopes: options.authorizationScopes ?? defaultMethodOptions.authorizationScopes,
        };
        const resource = new apigateway_generated_1.CfnMethod(this, 'Resource', methodProps);
        this.methodId = resource.ref;
        if (restapi_1.RestApiBase._isRestApiBase(props.resource.api)) {
            props.resource.api._attachMethod(this);
        }
        const deployment = props.resource.api.latestDeployment;
        if (deployment) {
            deployment.node.addDependency(resource);
            deployment.addToLogicalId({
                method: {
                    ...methodProps,
                    integrationToken: bindResult?.deploymentToken,
                },
            });
        }
    }
    /**
     * The RestApi associated with this Method
     * @deprecated - Throws an error if this Resource is not associated with an instance of `RestApi`. Use `api` instead.
     */
    get restApi() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.Method#restApi", "- Throws an error if this Resource is not associated with an instance of `RestApi`. Use `api` instead.");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "restApi").get);
            }
            throw error;
        }
        return this.resource.restApi;
    }
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
    get methodArn() {
        const stage = this.api.deploymentStage?.stageName;
        return this.api.arnForExecuteApi(this.httpMethod, pathForArn(this.resource.path), stage);
    }
    /**
     * Returns an execute-api ARN for this method's "test-invoke-stage" stage.
     * This stage is used by the AWS Console UI when testing the method.
     */
    get testMethodArn() {
        return this.api.arnForExecuteApi(this.httpMethod, pathForArn(this.resource.path), 'test-invoke-stage');
    }
    /**
     * Add a method response to this method
     */
    addMethodResponse(methodResponse) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_MethodResponse(methodResponse);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addMethodResponse);
            }
            throw error;
        }
        this.methodResponses.push(methodResponse);
    }
    renderIntegration(bindResult) {
        const options = bindResult.options ?? {};
        let credentials;
        if (options.credentialsRole) {
            credentials = options.credentialsRole.roleArn;
        }
        else if (options.credentialsPassthrough) {
            // arn:aws:iam::*:user/*
            // eslint-disable-next-line max-len
            credentials = core_1.Stack.of(this).formatArn({ service: 'iam', region: '', account: '*', resource: 'user', arnFormat: core_1.ArnFormat.SLASH_RESOURCE_NAME, resourceName: '*' });
        }
        return {
            type: bindResult.type,
            uri: bindResult.uri,
            cacheKeyParameters: options.cacheKeyParameters,
            cacheNamespace: options.cacheNamespace,
            contentHandling: options.contentHandling,
            integrationHttpMethod: bindResult.integrationHttpMethod,
            requestParameters: options.requestParameters,
            requestTemplates: options.requestTemplates,
            passthroughBehavior: options.passthroughBehavior,
            integrationResponses: options.integrationResponses,
            connectionType: options.connectionType,
            connectionId: options.vpcLink ? options.vpcLink.vpcLinkId : undefined,
            credentials,
            timeoutInMillis: options.timeout?.toMilliseconds(),
        };
    }
    renderMethodResponses(methodResponses) {
        if (!methodResponses) {
            // Fall back to nothing
            return undefined;
        }
        return methodResponses.map(mr => {
            let responseModels;
            if (mr.responseModels) {
                responseModels = {};
                for (const contentType in mr.responseModels) {
                    if (mr.responseModels.hasOwnProperty(contentType)) {
                        responseModels[contentType] = mr.responseModels[contentType].modelId;
                    }
                }
            }
            const methodResponseProp = {
                statusCode: mr.statusCode,
                responseParameters: mr.responseParameters,
                responseModels,
            };
            return methodResponseProp;
        });
    }
    renderRequestModels(requestModels) {
        if (!requestModels) {
            // Fall back to nothing
            return undefined;
        }
        const models = {};
        for (const contentType in requestModels) {
            if (requestModels.hasOwnProperty(contentType)) {
                models[contentType] = requestModels[contentType].modelId;
            }
        }
        return models;
    }
    requestValidatorId(options) {
        if (options.requestValidator && options.requestValidatorOptions) {
            throw new Error('Only one of \'requestValidator\' or \'requestValidatorOptions\' must be specified.');
        }
        if (options.requestValidatorOptions) {
            const validator = this.api.addRequestValidator('validator', options.requestValidatorOptions);
            return validator.requestValidatorId;
        }
        // For backward compatibility
        return options.requestValidator?.requestValidatorId;
    }
    /**
     * Returns the given named metric for this API method
     */
    metric(metricName, stage, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_IStage(stage);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metric);
            }
            throw error;
        }
        return new cloudwatch.Metric({
            namespace: 'AWS/ApiGateway',
            metricName,
            dimensionsMap: { ApiName: this.api.restApiName, Method: this.httpMethod, Resource: this.resource.path, Stage: stage.stageName },
            ...props,
        }).attachTo(this);
    }
    /**
     * Metric for the number of client-side errors captured in a given period.
     *
     * @default - sum over 5 minutes
     */
    metricClientError(stage, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_IStage(stage);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricClientError);
            }
            throw error;
        }
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics._4XxErrorSum, stage, props);
    }
    /**
     * Metric for the number of server-side errors captured in a given period.
     *
     * @default - sum over 5 minutes
     */
    metricServerError(stage, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_IStage(stage);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricServerError);
            }
            throw error;
        }
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics._5XxErrorSum, stage, props);
    }
    /**
     * Metric for the number of requests served from the API cache in a given period.
     *
     * @default - sum over 5 minutes
     */
    metricCacheHitCount(stage, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_IStage(stage);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricCacheHitCount);
            }
            throw error;
        }
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics.cacheHitCountSum, stage, props);
    }
    /**
     * Metric for the number of requests served from the backend in a given period,
     * when API caching is enabled.
     *
     * @default - sum over 5 minutes
     */
    metricCacheMissCount(stage, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_IStage(stage);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricCacheMissCount);
            }
            throw error;
        }
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics.cacheMissCountSum, stage, props);
    }
    /**
     * Metric for the total number API requests in a given period.
     *
     * @default - sample count over 5 minutes
     */
    metricCount(stage, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_IStage(stage);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricCount);
            }
            throw error;
        }
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics.countSum, stage, {
            statistic: 'SampleCount',
            ...props,
        });
    }
    /**
     * Metric for the time between when API Gateway relays a request to the backend
     * and when it receives a response from the backend.
     *
     * @default - average over 5 minutes.
     */
    metricIntegrationLatency(stage, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_IStage(stage);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricIntegrationLatency);
            }
            throw error;
        }
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics.integrationLatencyAverage, stage, props);
    }
    /**
     * The time between when API Gateway receives a request from a client
     * and when it returns a response to the client.
     * The latency includes the integration latency and other API Gateway overhead.
     *
     * @default - average over 5 minutes.
     */
    metricLatency(stage, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_IStage(stage);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.metricLatency);
            }
            throw error;
        }
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics.latencyAverage, stage, props);
    }
    cannedMetric(fn, stage, props) {
        return new cloudwatch.Metric({
            ...fn({ ApiName: this.api.restApiName, Method: this.httpMethod, Resource: this.resource.path, Stage: stage.stageName }),
            ...props,
        }).attachTo(this);
    }
}
exports.Method = Method;
_a = JSII_RTTI_SYMBOL_1;
Method[_a] = { fqn: "@aws-cdk/aws-apigateway.Method", version: "0.0.0" };
var AuthorizationType;
(function (AuthorizationType) {
    /**
     * Open access.
     */
    AuthorizationType["NONE"] = "NONE";
    /**
     * Use AWS IAM permissions.
     */
    AuthorizationType["IAM"] = "AWS_IAM";
    /**
     * Use a custom authorizer.
     */
    AuthorizationType["CUSTOM"] = "CUSTOM";
    /**
     * Use an AWS Cognito user pool.
     */
    AuthorizationType["COGNITO"] = "COGNITO_USER_POOLS";
})(AuthorizationType = exports.AuthorizationType || (exports.AuthorizationType = {}));
function pathForArn(path) {
    return path.replace(/\{[^\}]*\}/g, '*'); // replace path parameters (like '{bookId}') with asterisk
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0aG9kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWV0aG9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNEQUFzRDtBQUN0RCx3Q0FBaUU7QUFFakUsK0ZBQTBFO0FBQzFFLGlFQUFtRTtBQUNuRSw2Q0FBdUQ7QUFFdkQsOENBQXNEO0FBS3RELHVDQUEyRDtBQUUzRCxpQ0FBNEM7QUFvSjVDLE1BQWEsTUFBTyxTQUFRLGVBQVE7SUFhbEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBZFIsTUFBTTs7OztRQWdCZixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFakQseUJBQWtCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXBDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBRXBDLE1BQU0sb0JBQW9CLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsSUFBSSxFQUFFLENBQUM7UUFDdkUsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxvQkFBb0IsQ0FBQyxVQUFVLENBQUM7UUFDekUsTUFBTSxZQUFZLEdBQUcsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBRXBGLE1BQU0sdUJBQXVCLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixJQUFJLG9CQUFvQixDQUFDLGlCQUFpQixDQUFDO1FBQ3BHLE1BQU0saUJBQWlCLEdBQUcsVUFB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aUJBQWlCO0lBQzNCOztPQUVHO0lBQ0gsa0NBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gsb0NBQWUsQ0FBQTtJQUVmOztPQUVHO0lBQ0gsc0NBQWlCLENBQUE7SUFFakI7O09BRUc7SUFDSCxtREFBOEIsQ0FBQTtBQUNoQyxDQUFDLEVBcEJXLGlCQUFpQixHQUFqQix5QkFBaUIsS0FBakIseUJBQWlCLFFBb0I1QjtBQUVELFNBQVMsVUFBVSxDQUFDLElBQVk7SUFDOUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLDBEQUEwRDtBQUNyRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2xvdWR3YXRjaCBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgeyBBcm5Gb3JtYXQsIExhenksIFJlc291cmNlLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBcGlHYXRld2F5TWV0cmljcyB9IGZyb20gJy4vYXBpZ2F0ZXdheS1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQ2ZuTWV0aG9kLCBDZm5NZXRob2RQcm9wcyB9IGZyb20gJy4vYXBpZ2F0ZXdheS5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQXV0aG9yaXplciwgSUF1dGhvcml6ZXIgfSBmcm9tICcuL2F1dGhvcml6ZXInO1xuaW1wb3J0IHsgSW50ZWdyYXRpb24sIEludGVncmF0aW9uQ29uZmlnIH0gZnJvbSAnLi9pbnRlZ3JhdGlvbic7XG5pbXBvcnQgeyBNb2NrSW50ZWdyYXRpb24gfSBmcm9tICcuL2ludGVncmF0aW9ucy9tb2NrJztcbmltcG9ydCB7IE1ldGhvZFJlc3BvbnNlIH0gZnJvbSAnLi9tZXRob2RyZXNwb25zZSc7XG5pbXBvcnQgeyBJTW9kZWwgfSBmcm9tICcuL21vZGVsJztcbmltcG9ydCB7IElSZXF1ZXN0VmFsaWRhdG9yLCBSZXF1ZXN0VmFsaWRhdG9yT3B0aW9ucyB9IGZyb20gJy4vcmVxdWVzdHZhbGlkYXRvcic7XG5pbXBvcnQgeyBJUmVzb3VyY2UgfSBmcm9tICcuL3Jlc291cmNlJztcbmltcG9ydCB7IElSZXN0QXBpLCBSZXN0QXBpLCBSZXN0QXBpQmFzZSB9IGZyb20gJy4vcmVzdGFwaSc7XG5pbXBvcnQgeyBJU3RhZ2UgfSBmcm9tICcuL3N0YWdlJztcbmltcG9ydCB7IHZhbGlkYXRlSHR0cE1ldGhvZCB9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWV0aG9kT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBBIGZyaWVuZGx5IG9wZXJhdGlvbiBuYW1lIGZvciB0aGUgbWV0aG9kLiBGb3IgZXhhbXBsZSwgeW91IGNhbiBhc3NpZ24gdGhlXG4gICAqIE9wZXJhdGlvbk5hbWUgb2YgTGlzdFBldHMgZm9yIHRoZSBHRVQgL3BldHMgbWV0aG9kLlxuICAgKi9cbiAgcmVhZG9ubHkgb3BlcmF0aW9uTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogTWV0aG9kIGF1dGhvcml6YXRpb24uXG4gICAqIElmIHRoZSB2YWx1ZSBpcyBzZXQgb2YgYEN1c3RvbWAsIGFuIGBhdXRob3JpemVyYCBtdXN0IGFsc28gYmUgc3BlY2lmaWVkLlxuICAgKlxuICAgKiBJZiB5b3UncmUgdXNpbmcgb25lIG9mIHRoZSBhdXRob3JpemVycyB0aGF0IGFyZSBhdmFpbGFibGUgdmlhIHRoZSBgQXV0aG9yaXplcmAgY2xhc3MsIHN1Y2ggYXMgYEF1dGhvcml6ZXIjdG9rZW4oKWAsXG4gICAqIGl0IGlzIHJlY29tbWVuZGVkIHRoYXQgdGhpcyBvcHRpb24gbm90IGJlIHNwZWNpZmllZC4gVGhlIGF1dGhvcml6ZXIgd2lsbCB0YWtlIGNhcmUgb2Ygc2V0dGluZyB0aGUgY29ycmVjdCBhdXRob3JpemF0aW9uIHR5cGUuXG4gICAqIEhvd2V2ZXIsIHNwZWNpZnlpbmcgYW4gYXV0aG9yaXphdGlvbiB0eXBlIHVzaW5nIHRoaXMgcHJvcGVydHkgdGhhdCBjb25mbGljdHMgd2l0aCB3aGF0IGlzIGV4cGVjdGVkIGJ5IHRoZSBgQXV0aG9yaXplcmBcbiAgICogd2lsbCByZXN1bHQgaW4gYW4gZXJyb3IuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gb3BlbiBhY2Nlc3MgdW5sZXNzIGBhdXRob3JpemVyYCBpcyBzcGVjaWZpZWRcbiAgICovXG4gIHJlYWRvbmx5IGF1dGhvcml6YXRpb25UeXBlPzogQXV0aG9yaXphdGlvblR5cGU7XG5cbiAgLyoqXG4gICAqIElmIGBhdXRob3JpemF0aW9uVHlwZWAgaXMgYEN1c3RvbWAsIHRoaXMgc3BlY2lmaWVzIHRoZSBJRCBvZiB0aGUgbWV0aG9kXG4gICAqIGF1dGhvcml6ZXIgcmVzb3VyY2UuXG4gICAqIElmIHNwZWNpZmllZCwgdGhlIHZhbHVlIG9mIGBhdXRob3JpemF0aW9uVHlwZWAgbXVzdCBiZSBzZXQgdG8gYEN1c3RvbWBcbiAgICovXG4gIHJlYWRvbmx5IGF1dGhvcml6ZXI/OiBJQXV0aG9yaXplcjtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1ldGhvZCByZXF1aXJlcyBjbGllbnRzIHRvIHN1Ym1pdCBhIHZhbGlkIEFQSSBrZXkuXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBhcGlLZXlSZXF1aXJlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSByZXNwb25zZXMgdGhhdCBjYW4gYmUgc2VudCB0byB0aGUgY2xpZW50IHdobyBjYWxscyB0aGUgbWV0aG9kLlxuICAgKiBAZGVmYXVsdCBOb25lXG4gICAqXG4gICAqIFRoaXMgcHJvcGVydHkgaXMgbm90IHJlcXVpcmVkLCBidXQgaWYgdGhlc2UgYXJlIG5vdCBzdXBwbGllZCBmb3IgYSBMYW1iZGFcbiAgICogcHJveHkgaW50ZWdyYXRpb24sIHRoZSBMYW1iZGEgZnVuY3Rpb24gbXVzdCByZXR1cm4gYSB2YWx1ZSBvZiB0aGUgY29ycmVjdCBmb3JtYXQsXG4gICAqIGZvciB0aGUgaW50ZWdyYXRpb24gcmVzcG9uc2UgdG8gYmUgY29ycmVjdGx5IG1hcHBlZCB0byBhIHJlc3BvbnNlIHRvIHRoZSBjbGllbnQuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwaWdhdGV3YXkvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2FwaS1nYXRld2F5LW1ldGhvZC1zZXR0aW5ncy1tZXRob2QtcmVzcG9uc2UuaHRtbFxuICAgKi9cbiAgcmVhZG9ubHkgbWV0aG9kUmVzcG9uc2VzPzogTWV0aG9kUmVzcG9uc2VbXTtcblxuICAvKipcbiAgICogVGhlIHJlcXVlc3QgcGFyYW1ldGVycyB0aGF0IEFQSSBHYXRld2F5IGFjY2VwdHMuIFNwZWNpZnkgcmVxdWVzdCBwYXJhbWV0ZXJzXG4gICAqIGFzIGtleS12YWx1ZSBwYWlycyAoc3RyaW5nLXRvLUJvb2xlYW4gbWFwcGluZyksIHdpdGggYSBzb3VyY2UgYXMgdGhlIGtleSBhbmRcbiAgICogYSBCb29sZWFuIGFzIHRoZSB2YWx1ZS4gVGhlIEJvb2xlYW4gc3BlY2lmaWVzIHdoZXRoZXIgYSBwYXJhbWV0ZXIgaXMgcmVxdWlyZWQuXG4gICAqIEEgc291cmNlIG11c3QgbWF0Y2ggdGhlIGZvcm1hdCBtZXRob2QucmVxdWVzdC5sb2NhdGlvbi5uYW1lLCB3aGVyZSB0aGUgbG9jYXRpb25cbiAgICogaXMgcXVlcnlzdHJpbmcsIHBhdGgsIG9yIGhlYWRlciwgYW5kIG5hbWUgaXMgYSB2YWxpZCwgdW5pcXVlIHBhcmFtZXRlciBuYW1lLlxuICAgKiBAZGVmYXVsdCBOb25lXG4gICAqL1xuICByZWFkb25seSByZXF1ZXN0UGFyYW1ldGVycz86IHsgW3BhcmFtOiBzdHJpbmddOiBib29sZWFuIH07XG5cbiAgLyoqXG4gICAqIFRoZSBtb2RlbHMgd2hpY2ggZGVzY3JpYmUgZGF0YSBzdHJ1Y3R1cmUgb2YgcmVxdWVzdCBwYXlsb2FkLiBXaGVuXG4gICAqIGNvbWJpbmVkIHdpdGggYHJlcXVlc3RWYWxpZGF0b3JgIG9yIGByZXF1ZXN0VmFsaWRhdG9yT3B0aW9uc2AsIHRoZSBzZXJ2aWNlXG4gICAqIHdpbGwgdmFsaWRhdGUgdGhlIEFQSSByZXF1ZXN0IHBheWxvYWQgYmVmb3JlIGl0IHJlYWNoZXMgdGhlIEFQSSdzIEludGVncmF0aW9uIChpbmNsdWRpbmcgcHJveGllcykuXG4gICAqIFNwZWNpZnkgYHJlcXVlc3RNb2RlbHNgIGFzIGtleS12YWx1ZSBwYWlycywgd2l0aCBhIGNvbnRlbnQgdHlwZVxuICAgKiAoZS5nLiBgJ2FwcGxpY2F0aW9uL2pzb24nYCkgYXMgdGhlIGtleSBhbmQgYW4gQVBJIEdhdGV3YXkgTW9kZWwgYXMgdGhlIHZhbHVlLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICAgZGVjbGFyZSBjb25zdCBhcGk6IGFwaWdhdGV3YXkuUmVzdEFwaTtcbiAgICogICAgIGRlY2xhcmUgY29uc3QgdXNlckxhbWJkYTogbGFtYmRhLkZ1bmN0aW9uO1xuICAgKlxuICAgKiAgICAgY29uc3QgdXNlck1vZGVsOiBhcGlnYXRld2F5Lk1vZGVsID0gYXBpLmFkZE1vZGVsKCdVc2VyTW9kZWwnLCB7XG4gICAqICAgICAgICAgc2NoZW1hOiB7XG4gICAqICAgICAgICAgICAgIHR5cGU6IGFwaWdhdGV3YXkuSnNvblNjaGVtYVR5cGUuT0JKRUNULFxuICAgKiAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAqICAgICAgICAgICAgICAgICB1c2VySWQ6IHtcbiAgICogICAgICAgICAgICAgICAgICAgICB0eXBlOiBhcGlnYXRld2F5Lkpzb25TY2hlbWFUeXBlLlNUUklOR1xuICAgKiAgICAgICAgICAgICAgICAgfSxcbiAgICogICAgICAgICAgICAgICAgIG5hbWU6IHtcbiAgICogICAgICAgICAgICAgICAgICAgICB0eXBlOiBhcGlnYXRld2F5Lkpzb25TY2hlbWFUeXBlLlNUUklOR1xuICAgKiAgICAgICAgICAgICAgICAgfVxuICAgKiAgICAgICAgICAgICB9LFxuICAgKiAgICAgICAgICAgICByZXF1aXJlZDogWyd1c2VySWQnXVxuICAgKiAgICAgICAgIH1cbiAgICogICAgIH0pO1xuICAgKiAgICAgYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3VzZXInKS5hZGRNZXRob2QoJ1BPU1QnLFxuICAgKiAgICAgICAgIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKHVzZXJMYW1iZGEpLCB7XG4gICAqICAgICAgICAgICAgIHJlcXVlc3RNb2RlbHM6IHtcbiAgICogICAgICAgICAgICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogdXNlck1vZGVsXG4gICAqICAgICAgICAgICAgIH1cbiAgICogICAgICAgICB9XG4gICAqICAgICApO1xuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hcGlnYXRld2F5L2xhdGVzdC9kZXZlbG9wZXJndWlkZS9hcGktZ2F0ZXdheS1tZXRob2Qtc2V0dGluZ3MtbWV0aG9kLXJlcXVlc3QuaHRtbCNzZXR1cC1tZXRob2QtcmVxdWVzdC1tb2RlbFxuICAgKi9cbiAgcmVhZG9ubHkgcmVxdWVzdE1vZGVscz86IHsgW3BhcmFtOiBzdHJpbmddOiBJTW9kZWwgfTtcblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBhc3NvY2lhdGVkIHJlcXVlc3QgdmFsaWRhdG9yLlxuICAgKiBPbmx5IG9uZSBvZiBgcmVxdWVzdFZhbGlkYXRvcmAgb3IgYHJlcXVlc3RWYWxpZGF0b3JPcHRpb25zYCBtdXN0IGJlIHNwZWNpZmllZC5cbiAgICogV29ya3MgdG9nZXRoZXIgd2l0aCBgcmVxdWVzdE1vZGVsc2Agb3IgYHJlcXVlc3RQYXJhbWV0ZXJzYCB0byB2YWxpZGF0ZVxuICAgKiB0aGUgcmVxdWVzdCBiZWZvcmUgaXQgcmVhY2hlcyBpbnRlZ3JhdGlvbiBsaWtlIExhbWJkYSBQcm94eSBJbnRlZ3JhdGlvbi5cbiAgICogQGRlZmF1bHQgLSBObyBkZWZhdWx0IHZhbGlkYXRvclxuICAgKi9cbiAgcmVhZG9ubHkgcmVxdWVzdFZhbGlkYXRvcj86IElSZXF1ZXN0VmFsaWRhdG9yO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgYXV0aG9yaXphdGlvbiBzY29wZXMgY29uZmlndXJlZCBvbiB0aGUgbWV0aG9kLiBUaGUgc2NvcGVzIGFyZSB1c2VkIHdpdGhcbiAgICogYSBDT0dOSVRPX1VTRVJfUE9PTFMgYXV0aG9yaXplciB0byBhdXRob3JpemUgdGhlIG1ldGhvZCBpbnZvY2F0aW9uLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5LW1ldGhvZC5odG1sI2Nmbi1hcGlnYXRld2F5LW1ldGhvZC1hdXRob3JpemF0aW9uc2NvcGVzXG4gICAqIEBkZWZhdWx0IC0gbm8gYXV0aG9yaXphdGlvbiBzY29wZXNcbiAgICovXG4gIHJlYWRvbmx5IGF1dGhvcml6YXRpb25TY29wZXM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogUmVxdWVzdCB2YWxpZGF0b3Igb3B0aW9ucyB0byBjcmVhdGUgbmV3IHZhbGlkYXRvclxuICAgKiBPbmx5IG9uZSBvZiBgcmVxdWVzdFZhbGlkYXRvcmAgb3IgYHJlcXVlc3RWYWxpZGF0b3JPcHRpb25zYCBtdXN0IGJlIHNwZWNpZmllZC5cbiAgICogV29ya3MgdG9nZXRoZXIgd2l0aCBgcmVxdWVzdE1vZGVsc2Agb3IgYHJlcXVlc3RQYXJhbWV0ZXJzYCB0byB2YWxpZGF0ZVxuICAgKiB0aGUgcmVxdWVzdCBiZWZvcmUgaXQgcmVhY2hlcyBpbnRlZ3JhdGlvbiBsaWtlIExhbWJkYSBQcm94eSBJbnRlZ3JhdGlvbi5cbiAgICogQGRlZmF1bHQgLSBObyBkZWZhdWx0IHZhbGlkYXRvclxuICAgKi9cbiAgcmVhZG9ubHkgcmVxdWVzdFZhbGlkYXRvck9wdGlvbnM/OiBSZXF1ZXN0VmFsaWRhdG9yT3B0aW9ucztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNZXRob2RQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgcmVzb3VyY2UgdGhpcyBtZXRob2QgaXMgYXNzb2NpYXRlZCB3aXRoLiBGb3Igcm9vdCByZXNvdXJjZSBtZXRob2RzLFxuICAgKiBzcGVjaWZ5IHRoZSBgUmVzdEFwaWAgb2JqZWN0LlxuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2U6IElSZXNvdXJjZTtcblxuICAvKipcbiAgICogVGhlIEhUVFAgbWV0aG9kIChcIkdFVFwiLCBcIlBPU1RcIiwgXCJQVVRcIiwgLi4uKSB0aGF0IGNsaWVudHMgdXNlIHRvIGNhbGwgdGhpcyBtZXRob2QuXG4gICAqL1xuICByZWFkb25seSBodHRwTWV0aG9kOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBiYWNrZW5kIHN5c3RlbSB0aGF0IHRoZSBtZXRob2QgY2FsbHMgd2hlbiBpdCByZWNlaXZlcyBhIHJlcXVlc3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYSBuZXcgYE1vY2tJbnRlZ3JhdGlvbmAuXG4gICAqL1xuICByZWFkb25seSBpbnRlZ3JhdGlvbj86IEludGVncmF0aW9uO1xuXG4gIC8qKlxuICAgKiBNZXRob2Qgb3B0aW9ucy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBvcHRpb25zLlxuICAgKi9cbiAgcmVhZG9ubHkgb3B0aW9ucz86IE1ldGhvZE9wdGlvbnM7XG59XG5cbmV4cG9ydCBjbGFzcyBNZXRob2QgZXh0ZW5kcyBSZXNvdXJjZSB7XG4gIC8qKiBAYXR0cmlidXRlICovXG4gIHB1YmxpYyByZWFkb25seSBtZXRob2RJZDogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSBodHRwTWV0aG9kOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSByZXNvdXJjZTogSVJlc291cmNlO1xuICAvKipcbiAgICogVGhlIEFQSSBHYXRld2F5IFJlc3RBcGkgYXNzb2NpYXRlZCB3aXRoIHRoaXMgbWV0aG9kLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFwaTogSVJlc3RBcGk7XG5cbiAgcHJpdmF0ZSBtZXRob2RSZXNwb25zZXM6IE1ldGhvZFJlc3BvbnNlW107XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE1ldGhvZFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMucmVzb3VyY2UgPSBwcm9wcy5yZXNvdXJjZTtcbiAgICB0aGlzLmFwaSA9IHByb3BzLnJlc291cmNlLmFwaTtcbiAgICB0aGlzLmh0dHBNZXRob2QgPSBwcm9wcy5odHRwTWV0aG9kLnRvVXBwZXJDYXNlKCk7XG5cbiAgICB2YWxpZGF0ZUh0dHBNZXRob2QodGhpcy5odHRwTWV0aG9kKTtcblxuICAgIGNvbnN0IG9wdGlvbnMgPSBwcm9wcy5vcHRpb25zIHx8IHt9O1xuXG4gICAgY29uc3QgZGVmYXVsdE1ldGhvZE9wdGlvbnMgPSBwcm9wcy5yZXNvdXJjZS5kZWZhdWx0TWV0aG9kT3B0aW9ucyB8fCB7fTtcbiAgICBjb25zdCBhdXRob3JpemVyID0gb3B0aW9ucy5hdXRob3JpemVyIHx8IGRlZmF1bHRNZXRob2RPcHRpb25zLmF1dGhvcml6ZXI7XG4gICAgY29uc3QgYXV0aG9yaXplcklkID0gYXV0aG9yaXplcj8uYXV0aG9yaXplcklkID8gYXV0aG9yaXplci5hdXRob3JpemVySWQgOiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBhdXRob3JpemF0aW9uVHlwZU9wdGlvbiA9IG9wdGlvbnMuYXV0aG9yaXphdGlvblR5cGUgfHwgZGVmYXVsdE1ldGhvZE9wdGlvbnMuYXV0aG9yaXphdGlvblR5cGU7XG4gICAgY29uc3QgYXV0aG9yaXphdGlvblR5cGUgPSBhdXRob3JpemVyPy5hdXRob3JpemF0aW9uVHlwZSB8fCBhdXRob3JpemF0aW9uVHlwZU9wdGlvbiB8fCBBdXRob3JpemF0aW9uVHlwZS5OT05FO1xuXG4gICAgLy8gaWYgdGhlIGF1dGhvcml6ZXIgZGVmaW5lcyBhbiBhdXRob3JpemF0aW9uIHR5cGUgYW5kIHdlIGFsc28gaGF2ZSBhbiBleHBsaWNpdCBvcHRpb24gc2V0LCBjaGVjayB0aGF0IHRoZXkgYXJlIHRoZSBzYW1lXG4gICAgaWYgKGF1dGhvcml6ZXI/LmF1dGhvcml6YXRpb25UeXBlICYmIGF1dGhvcml6YXRpb25UeXBlT3B0aW9uICYmIGF1dGhvcml6ZXI/LmF1dGhvcml6YXRpb25UeXBlICE9PSBhdXRob3JpemF0aW9uVHlwZU9wdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMucmVzb3VyY2V9LyR7dGhpcy5odHRwTWV0aG9kfSAtIEF1dGhvcml6YXRpb24gdHlwZSBpcyBzZXQgdG8gJHthdXRob3JpemF0aW9uVHlwZU9wdGlvbn0gYCArXG4gICAgICAgIGB3aGljaCBpcyBkaWZmZXJlbnQgZnJvbSB3aGF0IGlzIHJlcXVpcmVkIGJ5IHRoZSBhdXRob3JpemVyIFske2F1dGhvcml6ZXIuYXV0aG9yaXphdGlvblR5cGV9XWApO1xuICAgIH1cblxuICAgIGlmIChBdXRob3JpemVyLmlzQXV0aG9yaXplcihhdXRob3JpemVyKSkge1xuICAgICAgYXV0aG9yaXplci5fYXR0YWNoVG9BcGkodGhpcy5hcGkpO1xuICAgIH1cblxuICAgIHRoaXMubWV0aG9kUmVzcG9uc2VzID0gb3B0aW9ucy5tZXRob2RSZXNwb25zZXMgPz8gW107XG5cbiAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IHByb3BzLmludGVncmF0aW9uID8/IHRoaXMucmVzb3VyY2UuZGVmYXVsdEludGVncmF0aW9uID8/IG5ldyBNb2NrSW50ZWdyYXRpb24oKTtcbiAgICBjb25zdCBiaW5kUmVzdWx0ID0gaW50ZWdyYXRpb24uYmluZCh0aGlzKTtcblxuICAgIGNvbnN0IG1ldGhvZFByb3BzOiBDZm5NZXRob2RQcm9wcyA9IHtcbiAgICAgIHJlc291cmNlSWQ6IHByb3BzLnJlc291cmNlLnJlc291cmNlSWQsXG4gICAgICByZXN0QXBpSWQ6IHRoaXMuYXBpLnJlc3RBcGlJZCxcbiAgICAgIGh0dHBNZXRob2Q6IHRoaXMuaHR0cE1ldGhvZCxcbiAgICAgIG9wZXJhdGlvbk5hbWU6IG9wdGlvbnMub3BlcmF0aW9uTmFtZSB8fCBkZWZhdWx0TWV0aG9kT3B0aW9ucy5vcGVyYXRpb25OYW1lLFxuICAgICAgYXBpS2V5UmVxdWlyZWQ6IG9wdGlvbnMuYXBpS2V5UmVxdWlyZWQgfHwgZGVmYXVsdE1ldGhvZE9wdGlvbnMuYXBpS2V5UmVxdWlyZWQsXG4gICAgICBhdXRob3JpemF0aW9uVHlwZSxcbiAgICAgIGF1dGhvcml6ZXJJZCxcbiAgICAgIHJlcXVlc3RQYXJhbWV0ZXJzOiBvcHRpb25zLnJlcXVlc3RQYXJhbWV0ZXJzIHx8IGRlZmF1bHRNZXRob2RPcHRpb25zLnJlcXVlc3RQYXJhbWV0ZXJzLFxuICAgICAgaW50ZWdyYXRpb246IHRoaXMucmVuZGVySW50ZWdyYXRpb24oYmluZFJlc3VsdCksXG4gICAgICBtZXRob2RSZXNwb25zZXM6IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5yZW5kZXJNZXRob2RSZXNwb25zZXModGhpcy5tZXRob2RSZXNwb25zZXMpIH0sIHsgb21pdEVtcHR5QXJyYXk6IHRydWUgfSksXG4gICAgICByZXF1ZXN0TW9kZWxzOiB0aGlzLnJlbmRlclJlcXVlc3RNb2RlbHMob3B0aW9ucy5yZXF1ZXN0TW9kZWxzKSxcbiAgICAgIHJlcXVlc3RWYWxpZGF0b3JJZDogdGhpcy5yZXF1ZXN0VmFsaWRhdG9ySWQob3B0aW9ucyksXG4gICAgICBhdXRob3JpemF0aW9uU2NvcGVzOiBvcHRpb25zLmF1dGhvcml6YXRpb25TY29wZXMgPz8gZGVmYXVsdE1ldGhvZE9wdGlvbnMuYXV0aG9yaXphdGlvblNjb3BlcyxcbiAgICB9O1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuTWV0aG9kKHRoaXMsICdSZXNvdXJjZScsIG1ldGhvZFByb3BzKTtcblxuICAgIHRoaXMubWV0aG9kSWQgPSByZXNvdXJjZS5yZWY7XG5cbiAgICBpZiAoUmVzdEFwaUJhc2UuX2lzUmVzdEFwaUJhc2UocHJvcHMucmVzb3VyY2UuYXBpKSkge1xuICAgICAgcHJvcHMucmVzb3VyY2UuYXBpLl9hdHRhY2hNZXRob2QodGhpcyk7XG4gICAgfVxuXG4gICAgY29uc3QgZGVwbG95bWVudCA9IHByb3BzLnJlc291cmNlLmFwaS5sYXRlc3REZXBsb3ltZW50O1xuICAgIGlmIChkZXBsb3ltZW50KSB7XG4gICAgICBkZXBsb3ltZW50Lm5vZGUuYWRkRGVwZW5kZW5jeShyZXNvdXJjZSk7XG4gICAgICBkZXBsb3ltZW50LmFkZFRvTG9naWNhbElkKHtcbiAgICAgICAgbWV0aG9kOiB7XG4gICAgICAgICAgLi4ubWV0aG9kUHJvcHMsXG4gICAgICAgICAgaW50ZWdyYXRpb25Ub2tlbjogYmluZFJlc3VsdD8uZGVwbG95bWVudFRva2VuLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBSZXN0QXBpIGFzc29jaWF0ZWQgd2l0aCB0aGlzIE1ldGhvZFxuICAgKiBAZGVwcmVjYXRlZCAtIFRocm93cyBhbiBlcnJvciBpZiB0aGlzIFJlc291cmNlIGlzIG5vdCBhc3NvY2lhdGVkIHdpdGggYW4gaW5zdGFuY2Ugb2YgYFJlc3RBcGlgLiBVc2UgYGFwaWAgaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyBnZXQgcmVzdEFwaSgpOiBSZXN0QXBpIHtcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZS5yZXN0QXBpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZXhlY3V0ZS1hcGkgQVJOIGZvciB0aGlzIG1ldGhvZDpcbiAgICpcbiAgICogICBhcm46YXdzOmV4ZWN1dGUtYXBpOntyZWdpb259OnthY2NvdW50fTp7cmVzdEFwaUlkfS97c3RhZ2V9L3ttZXRob2R9L3twYXRofVxuICAgKlxuICAgKiBOT1RFOiB7c3RhZ2V9IHdpbGwgcmVmZXIgdG8gdGhlIGByZXN0QXBpLmRlcGxveW1lbnRTdGFnZWAsIHdoaWNoIHdpbGxcbiAgICogYXV0b21hdGljYWxseSBzZXQgaWYgYXV0by1kZXBsb3kgaXMgZW5hYmxlZCwgb3IgY2FuIGJlIGV4cGxpY2l0bHkgYXNzaWduZWQuXG4gICAqIFdoZW4gbm90IGNvbmZpZ3VyZWQsIHtzdGFnZX0gd2lsbCBiZSBzZXQgdG8gJyonLCBhcyBhIHNob3J0aGFuZCBmb3IgJ2FsbCBzdGFnZXMnLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgZ2V0IG1ldGhvZEFybigpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0YWdlID0gdGhpcy5hcGkuZGVwbG95bWVudFN0YWdlPy5zdGFnZU5hbWU7XG4gICAgcmV0dXJuIHRoaXMuYXBpLmFybkZvckV4ZWN1dGVBcGkodGhpcy5odHRwTWV0aG9kLCBwYXRoRm9yQXJuKHRoaXMucmVzb3VyY2UucGF0aCksIHN0YWdlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGV4ZWN1dGUtYXBpIEFSTiBmb3IgdGhpcyBtZXRob2QncyBcInRlc3QtaW52b2tlLXN0YWdlXCIgc3RhZ2UuXG4gICAqIFRoaXMgc3RhZ2UgaXMgdXNlZCBieSB0aGUgQVdTIENvbnNvbGUgVUkgd2hlbiB0ZXN0aW5nIHRoZSBtZXRob2QuXG4gICAqL1xuICBwdWJsaWMgZ2V0IHRlc3RNZXRob2RBcm4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5hcGkuYXJuRm9yRXhlY3V0ZUFwaSh0aGlzLmh0dHBNZXRob2QsIHBhdGhGb3JBcm4odGhpcy5yZXNvdXJjZS5wYXRoKSwgJ3Rlc3QtaW52b2tlLXN0YWdlJyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbWV0aG9kIHJlc3BvbnNlIHRvIHRoaXMgbWV0aG9kXG4gICAqL1xuICBwdWJsaWMgYWRkTWV0aG9kUmVzcG9uc2UobWV0aG9kUmVzcG9uc2U6IE1ldGhvZFJlc3BvbnNlKTogdm9pZCB7XG4gICAgdGhpcy5tZXRob2RSZXNwb25zZXMucHVzaChtZXRob2RSZXNwb25zZSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckludGVncmF0aW9uKGJpbmRSZXN1bHQ6IEludGVncmF0aW9uQ29uZmlnKTogQ2ZuTWV0aG9kLkludGVncmF0aW9uUHJvcGVydHkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBiaW5kUmVzdWx0Lm9wdGlvbnMgPz8ge307XG4gICAgbGV0IGNyZWRlbnRpYWxzO1xuICAgIGlmIChvcHRpb25zLmNyZWRlbnRpYWxzUm9sZSkge1xuICAgICAgY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzUm9sZS5yb2xlQXJuO1xuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5jcmVkZW50aWFsc1Bhc3N0aHJvdWdoKSB7XG4gICAgICAvLyBhcm46YXdzOmlhbTo6Kjp1c2VyLypcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICBjcmVkZW50aWFscyA9IFN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7IHNlcnZpY2U6ICdpYW0nLCByZWdpb246ICcnLCBhY2NvdW50OiAnKicsIHJlc291cmNlOiAndXNlcicsIGFybkZvcm1hdDogQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUsIHJlc291cmNlTmFtZTogJyonIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBiaW5kUmVzdWx0LnR5cGUsXG4gICAgICB1cmk6IGJpbmRSZXN1bHQudXJpLFxuICAgICAgY2FjaGVLZXlQYXJhbWV0ZXJzOiBvcHRpb25zLmNhY2hlS2V5UGFyYW1ldGVycyxcbiAgICAgIGNhY2hlTmFtZXNwYWNlOiBvcHRpb25zLmNhY2hlTmFtZXNwYWNlLFxuICAgICAgY29udGVudEhhbmRsaW5nOiBvcHRpb25zLmNvbnRlbnRIYW5kbGluZyxcbiAgICAgIGludGVncmF0aW9uSHR0cE1ldGhvZDogYmluZFJlc3VsdC5pbnRlZ3JhdGlvbkh0dHBNZXRob2QsXG4gICAgICByZXF1ZXN0UGFyYW1ldGVyczogb3B0aW9ucy5yZXF1ZXN0UGFyYW1ldGVycyxcbiAgICAgIHJlcXVlc3RUZW1wbGF0ZXM6IG9wdGlvbnMucmVxdWVzdFRlbXBsYXRlcyxcbiAgICAgIHBhc3N0aHJvdWdoQmVoYXZpb3I6IG9wdGlvbnMucGFzc3Rocm91Z2hCZWhhdmlvcixcbiAgICAgIGludGVncmF0aW9uUmVzcG9uc2VzOiBvcHRpb25zLmludGVncmF0aW9uUmVzcG9uc2VzLFxuICAgICAgY29ubmVjdGlvblR5cGU6IG9wdGlvbnMuY29ubmVjdGlvblR5cGUsXG4gICAgICBjb25uZWN0aW9uSWQ6IG9wdGlvbnMudnBjTGluayA/IG9wdGlvbnMudnBjTGluay52cGNMaW5rSWQgOiB1bmRlZmluZWQsXG4gICAgICBjcmVkZW50aWFscyxcbiAgICAgIHRpbWVvdXRJbk1pbGxpczogb3B0aW9ucy50aW1lb3V0Py50b01pbGxpc2Vjb25kcygpLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHJlbmRlck1ldGhvZFJlc3BvbnNlcyhtZXRob2RSZXNwb25zZXM6IE1ldGhvZFJlc3BvbnNlW10gfCB1bmRlZmluZWQpOiBDZm5NZXRob2QuTWV0aG9kUmVzcG9uc2VQcm9wZXJ0eVtdIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIW1ldGhvZFJlc3BvbnNlcykge1xuICAgICAgLy8gRmFsbCBiYWNrIHRvIG5vdGhpbmdcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ldGhvZFJlc3BvbnNlcy5tYXAobXIgPT4ge1xuICAgICAgbGV0IHJlc3BvbnNlTW9kZWxzOiB7W2NvbnRlbnRUeXBlOiBzdHJpbmddOiBzdHJpbmd9IHwgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAobXIucmVzcG9uc2VNb2RlbHMpIHtcbiAgICAgICAgcmVzcG9uc2VNb2RlbHMgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBjb250ZW50VHlwZSBpbiBtci5yZXNwb25zZU1vZGVscykge1xuICAgICAgICAgIGlmIChtci5yZXNwb25zZU1vZGVscy5oYXNPd25Qcm9wZXJ0eShjb250ZW50VHlwZSkpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlTW9kZWxzW2NvbnRlbnRUeXBlXSA9IG1yLnJlc3BvbnNlTW9kZWxzW2NvbnRlbnRUeXBlXS5tb2RlbElkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBtZXRob2RSZXNwb25zZVByb3AgPSB7XG4gICAgICAgIHN0YXR1c0NvZGU6IG1yLnN0YXR1c0NvZGUsXG4gICAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczogbXIucmVzcG9uc2VQYXJhbWV0ZXJzLFxuICAgICAgICByZXNwb25zZU1vZGVscyxcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBtZXRob2RSZXNwb25zZVByb3A7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclJlcXVlc3RNb2RlbHMocmVxdWVzdE1vZGVsczogeyBbcGFyYW06IHN0cmluZ106IElNb2RlbCB9IHwgdW5kZWZpbmVkKTogeyBbcGFyYW06IHN0cmluZ106IHN0cmluZyB9IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXJlcXVlc3RNb2RlbHMpIHtcbiAgICAgIC8vIEZhbGwgYmFjayB0byBub3RoaW5nXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGVsczoge1twYXJhbTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICAgIGZvciAoY29uc3QgY29udGVudFR5cGUgaW4gcmVxdWVzdE1vZGVscykge1xuICAgICAgaWYgKHJlcXVlc3RNb2RlbHMuaGFzT3duUHJvcGVydHkoY29udGVudFR5cGUpKSB7XG4gICAgICAgIG1vZGVsc1tjb250ZW50VHlwZV0gPSByZXF1ZXN0TW9kZWxzW2NvbnRlbnRUeXBlXS5tb2RlbElkO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtb2RlbHM7XG4gIH1cblxuICBwcml2YXRlIHJlcXVlc3RWYWxpZGF0b3JJZChvcHRpb25zOiBNZXRob2RPcHRpb25zKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAob3B0aW9ucy5yZXF1ZXN0VmFsaWRhdG9yICYmIG9wdGlvbnMucmVxdWVzdFZhbGlkYXRvck9wdGlvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBvbmUgb2YgXFwncmVxdWVzdFZhbGlkYXRvclxcJyBvciBcXCdyZXF1ZXN0VmFsaWRhdG9yT3B0aW9uc1xcJyBtdXN0IGJlIHNwZWNpZmllZC4nKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5yZXF1ZXN0VmFsaWRhdG9yT3B0aW9ucykge1xuICAgICAgY29uc3QgdmFsaWRhdG9yID0gKHRoaXMuYXBpIGFzIFJlc3RBcGkpLmFkZFJlcXVlc3RWYWxpZGF0b3IoJ3ZhbGlkYXRvcicsIG9wdGlvbnMucmVxdWVzdFZhbGlkYXRvck9wdGlvbnMpO1xuICAgICAgcmV0dXJuIHZhbGlkYXRvci5yZXF1ZXN0VmFsaWRhdG9ySWQ7XG4gICAgfVxuXG4gICAgLy8gRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICByZXR1cm4gb3B0aW9ucy5yZXF1ZXN0VmFsaWRhdG9yPy5yZXF1ZXN0VmFsaWRhdG9ySWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZ2l2ZW4gbmFtZWQgbWV0cmljIGZvciB0aGlzIEFQSSBtZXRob2RcbiAgICovXG4gIHB1YmxpYyBtZXRyaWMobWV0cmljTmFtZTogc3RyaW5nLCBzdGFnZTogSVN0YWdlLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcGlHYXRld2F5JyxcbiAgICAgIG1ldHJpY05hbWUsXG4gICAgICBkaW1lbnNpb25zTWFwOiB7IEFwaU5hbWU6IHRoaXMuYXBpLnJlc3RBcGlOYW1lLCBNZXRob2Q6IHRoaXMuaHR0cE1ldGhvZCwgUmVzb3VyY2U6IHRoaXMucmVzb3VyY2UucGF0aCwgU3RhZ2U6IHN0YWdlLnN0YWdlTmFtZSB9LFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSkuYXR0YWNoVG8odGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIGNsaWVudC1zaWRlIGVycm9ycyBjYXB0dXJlZCBpbiBhIGdpdmVuIHBlcmlvZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNDbGllbnRFcnJvcihzdGFnZTogSVN0YWdlLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoQXBpR2F0ZXdheU1ldHJpY3MuXzRYeEVycm9yU3VtLCBzdGFnZSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiBzZXJ2ZXItc2lkZSBlcnJvcnMgY2FwdHVyZWQgaW4gYSBnaXZlbiBwZXJpb2QuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljU2VydmVyRXJyb3Ioc3RhZ2U6IElTdGFnZSwgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKEFwaUdhdGV3YXlNZXRyaWNzLl81WHhFcnJvclN1bSwgc3RhZ2UsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgcmVxdWVzdHMgc2VydmVkIGZyb20gdGhlIEFQSSBjYWNoZSBpbiBhIGdpdmVuIHBlcmlvZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNDYWNoZUhpdENvdW50KHN0YWdlOiBJU3RhZ2UsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcGlHYXRld2F5TWV0cmljcy5jYWNoZUhpdENvdW50U3VtLCBzdGFnZSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiByZXF1ZXN0cyBzZXJ2ZWQgZnJvbSB0aGUgYmFja2VuZCBpbiBhIGdpdmVuIHBlcmlvZCxcbiAgICogd2hlbiBBUEkgY2FjaGluZyBpcyBlbmFibGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY0NhY2hlTWlzc0NvdW50KHN0YWdlOiBJU3RhZ2UsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcGlHYXRld2F5TWV0cmljcy5jYWNoZU1pc3NDb3VudFN1bSwgc3RhZ2UsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSB0b3RhbCBudW1iZXIgQVBJIHJlcXVlc3RzIGluIGEgZ2l2ZW4gcGVyaW9kLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHNhbXBsZSBjb3VudCBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY0NvdW50KHN0YWdlOiBJU3RhZ2UsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcGlHYXRld2F5TWV0cmljcy5jb3VudFN1bSwgc3RhZ2UsIHtcbiAgICAgIHN0YXRpc3RpYzogJ1NhbXBsZUNvdW50JyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIHRpbWUgYmV0d2VlbiB3aGVuIEFQSSBHYXRld2F5IHJlbGF5cyBhIHJlcXVlc3QgdG8gdGhlIGJhY2tlbmRcbiAgICogYW5kIHdoZW4gaXQgcmVjZWl2ZXMgYSByZXNwb25zZSBmcm9tIHRoZSBiYWNrZW5kLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXMuXG4gICAqL1xuICBwdWJsaWMgbWV0cmljSW50ZWdyYXRpb25MYXRlbmN5KHN0YWdlOiBJU3RhZ2UsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcGlHYXRld2F5TWV0cmljcy5pbnRlZ3JhdGlvbkxhdGVuY3lBdmVyYWdlLCBzdGFnZSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lIGJldHdlZW4gd2hlbiBBUEkgR2F0ZXdheSByZWNlaXZlcyBhIHJlcXVlc3QgZnJvbSBhIGNsaWVudFxuICAgKiBhbmQgd2hlbiBpdCByZXR1cm5zIGEgcmVzcG9uc2UgdG8gdGhlIGNsaWVudC5cbiAgICogVGhlIGxhdGVuY3kgaW5jbHVkZXMgdGhlIGludGVncmF0aW9uIGxhdGVuY3kgYW5kIG90aGVyIEFQSSBHYXRld2F5IG92ZXJoZWFkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXMuXG4gICAqL1xuICBwdWJsaWMgbWV0cmljTGF0ZW5jeShzdGFnZTogSVN0YWdlLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoQXBpR2F0ZXdheU1ldHJpY3MubGF0ZW5jeUF2ZXJhZ2UsIHN0YWdlLCBwcm9wcyk7XG4gIH1cblxuICBwcml2YXRlIGNhbm5lZE1ldHJpYyhmbjogKGRpbXM6IHtcbiAgICBBcGlOYW1lOiBzdHJpbmc7XG4gICAgTWV0aG9kOiBzdHJpbmc7XG4gICAgUmVzb3VyY2U6IHN0cmluZztcbiAgICBTdGFnZTogc3RyaW5nO1xuICB9KSA9PiBjbG91ZHdhdGNoLk1ldHJpY1Byb3BzLCBzdGFnZTogSVN0YWdlLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgLi4uZm4oeyBBcGlOYW1lOiB0aGlzLmFwaS5yZXN0QXBpTmFtZSwgTWV0aG9kOiB0aGlzLmh0dHBNZXRob2QsIFJlc291cmNlOiB0aGlzLnJlc291cmNlLnBhdGgsIFN0YWdlOiBzdGFnZS5zdGFnZU5hbWUgfSksXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KS5hdHRhY2hUbyh0aGlzKTtcbiAgfVxufVxuXG5leHBvcnQgZW51bSBBdXRob3JpemF0aW9uVHlwZSB7XG4gIC8qKlxuICAgKiBPcGVuIGFjY2Vzcy5cbiAgICovXG4gIE5PTkUgPSAnTk9ORScsXG5cbiAgLyoqXG4gICAqIFVzZSBBV1MgSUFNIHBlcm1pc3Npb25zLlxuICAgKi9cbiAgSUFNID0gJ0FXU19JQU0nLFxuXG4gIC8qKlxuICAgKiBVc2UgYSBjdXN0b20gYXV0aG9yaXplci5cbiAgICovXG4gIENVU1RPTSA9ICdDVVNUT00nLFxuXG4gIC8qKlxuICAgKiBVc2UgYW4gQVdTIENvZ25pdG8gdXNlciBwb29sLlxuICAgKi9cbiAgQ09HTklUTyA9ICdDT0dOSVRPX1VTRVJfUE9PTFMnLFxufVxuXG5mdW5jdGlvbiBwYXRoRm9yQXJuKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBwYXRoLnJlcGxhY2UoL1xce1teXFx9XSpcXH0vZywgJyonKTsgLy8gcmVwbGFjZSBwYXRoIHBhcmFtZXRlcnMgKGxpa2UgJ3tib29rSWR9Jykgd2l0aCBhc3Rlcmlza1xufVxuIl19