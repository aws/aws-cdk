"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stage = exports.StageBase = exports.MethodLoggingLevel = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const core_1 = require("@aws-cdk/core");
const access_log_1 = require("./access-log");
const api_key_1 = require("./api-key");
const apigateway_canned_metrics_generated_1 = require("./apigateway-canned-metrics.generated");
const apigateway_generated_1 = require("./apigateway.generated");
const restapi_1 = require("./restapi");
const util_1 = require("./util");
var MethodLoggingLevel;
(function (MethodLoggingLevel) {
    MethodLoggingLevel["OFF"] = "OFF";
    MethodLoggingLevel["ERROR"] = "ERROR";
    MethodLoggingLevel["INFO"] = "INFO";
})(MethodLoggingLevel = exports.MethodLoggingLevel || (exports.MethodLoggingLevel = {}));
/**
 * Base class for an ApiGateway Stage
 */
class StageBase extends core_1.Resource {
    /**
     * Add an ApiKey to this stage
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
            stages: [this],
            ...options,
        });
    }
    /**
     * Returns the invoke URL for a certain path.
     * @param path The resource path
     */
    urlForPath(path = '/') {
        if (!path.startsWith('/')) {
            throw new Error(`Path must begin with "/": ${path}`);
        }
        return `https://${this.restApi.restApiId}.execute-api.${core_1.Stack.of(this).region}.${core_1.Stack.of(this).urlSuffix}/${this.stageName}${path}`;
    }
    /**
     * Returns the resource ARN for this stage:
     *
     *   arn:aws:apigateway:{region}::/restapis/{restApiId}/stages/{stageName}
     *
     * Note that this is separate from the execute-api ARN for methods and resources
     * within this stage.
     *
     * @attribute
     */
    get stageArn() {
        return core_1.Stack.of(this).formatArn({
            arnFormat: core_1.ArnFormat.SLASH_RESOURCE_SLASH_RESOURCE_NAME,
            service: 'apigateway',
            account: '',
            resource: 'restapis',
            resourceName: `${this.restApi.restApiId}/stages/${this.stageName}`,
        });
    }
    /**
     * Returns the given named metric for this stage
     */
    metric(metricName, props) {
        return new cloudwatch.Metric({
            namespace: 'AWS/ApiGateway',
            metricName,
            dimensionsMap: { ApiName: this.restApi.restApiName, Stage: this.stageName },
            ...props,
        }).attachTo(this);
    }
    /**
     * Metric for the number of client-side errors captured in a given period.
     *
     * @default - sum over 5 minutes
     */
    metricClientError(props) {
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics._4XxErrorSum, props);
    }
    /**
     * Metric for the number of server-side errors captured in a given period.
     *
     * @default - sum over 5 minutes
     */
    metricServerError(props) {
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics._5XxErrorSum, props);
    }
    /**
     * Metric for the number of requests served from the API cache in a given period.
     *
     * @default - sum over 5 minutes
     */
    metricCacheHitCount(props) {
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics.cacheHitCountSum, props);
    }
    /**
     * Metric for the number of requests served from the backend in a given period,
     * when API caching is enabled.
     *
     * @default - sum over 5 minutes
     */
    metricCacheMissCount(props) {
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics.cacheMissCountSum, props);
    }
    /**
     * Metric for the total number API requests in a given period.
     *
     * @default - sample count over 5 minutes
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
     * @default - average over 5 minutes.
     */
    metricIntegrationLatency(props) {
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics.integrationLatencyAverage, props);
    }
    /**
     * The time between when API Gateway receives a request from a client
     * and when it returns a response to the client.
     * The latency includes the integration latency and other API Gateway overhead.
     *
     * @default - average over 5 minutes.
     */
    metricLatency(props) {
        return this.cannedMetric(apigateway_canned_metrics_generated_1.ApiGatewayMetrics.latencyAverage, props);
    }
    cannedMetric(fn, props) {
        return new cloudwatch.Metric({
            ...fn({ ApiName: this.restApi.restApiName, Stage: this.stageName }),
            ...props,
        }).attachTo(this);
    }
}
exports.StageBase = StageBase;
_a = JSII_RTTI_SYMBOL_1;
StageBase[_a] = { fqn: "@aws-cdk/aws-apigateway.StageBase", version: "0.0.0" };
class Stage extends StageBase {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_StageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Stage);
            }
            throw error;
        }
        this.enableCacheCluster = props.cacheClusterEnabled;
        const methodSettings = this.renderMethodSettings(props); // this can mutate `this.cacheClusterEnabled`
        // custom access logging
        let accessLogSetting;
        const accessLogDestination = props.accessLogDestination;
        const accessLogFormat = props.accessLogFormat;
        if (!accessLogDestination && !accessLogFormat) {
            accessLogSetting = undefined;
        }
        else {
            if (accessLogFormat !== undefined &&
                !core_1.Token.isUnresolved(accessLogFormat.toString()) &&
                !/.*\$context.(requestId|extendedRequestId)\b.*/.test(accessLogFormat.toString())) {
                throw new Error('Access log must include either `AccessLogFormat.contextRequestId()` or `AccessLogFormat.contextExtendedRequestId()`');
            }
            if (accessLogFormat !== undefined && accessLogDestination === undefined) {
                throw new Error('Access log format is specified without a destination');
            }
            accessLogSetting = {
                destinationArn: accessLogDestination?.bind(this).destinationArn,
                format: accessLogFormat?.toString() ? accessLogFormat?.toString() : access_log_1.AccessLogFormat.clf().toString(),
            };
        }
        // enable cache cluster if cacheClusterSize is set
        if (props.cacheClusterSize !== undefined) {
            if (this.enableCacheCluster === undefined) {
                this.enableCacheCluster = true;
            }
            else if (this.enableCacheCluster === false) {
                throw new Error(`Cannot set "cacheClusterSize" to ${props.cacheClusterSize} and "cacheClusterEnabled" to "false"`);
            }
        }
        const cacheClusterSize = this.enableCacheCluster ? (props.cacheClusterSize || '0.5') : undefined;
        const resource = new apigateway_generated_1.CfnStage(this, 'Resource', {
            stageName: props.stageName || 'prod',
            accessLogSetting,
            cacheClusterEnabled: this.enableCacheCluster,
            cacheClusterSize,
            clientCertificateId: props.clientCertificateId,
            deploymentId: props.deployment.deploymentId,
            restApiId: props.deployment.api.restApiId,
            description: props.description,
            documentationVersion: props.documentationVersion,
            variables: props.variables,
            tracingEnabled: props.tracingEnabled,
            methodSettings,
        });
        this.stageName = resource.ref;
        this.restApi = props.deployment.api;
        if (restapi_1.RestApiBase._isRestApiBase(this.restApi)) {
            this.restApi._attachStage(this);
        }
    }
    /**
     * Import a Stage by its attributes
     */
    static fromStageAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_StageAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromStageAttributes);
            }
            throw error;
        }
        class Import extends StageBase {
            constructor() {
                super(...arguments);
                this.stageName = attrs.stageName;
                this.restApi = attrs.restApi;
            }
        }
        return new Import(scope, id);
    }
    renderMethodSettings(props) {
        const settings = new Array();
        const self = this;
        // extract common method options from the stage props
        const commonMethodOptions = {
            metricsEnabled: props.metricsEnabled,
            loggingLevel: props.loggingLevel,
            dataTraceEnabled: props.dataTraceEnabled,
            throttlingBurstLimit: props.throttlingBurstLimit,
            throttlingRateLimit: props.throttlingRateLimit,
            cachingEnabled: props.cachingEnabled,
            cacheTtl: props.cacheTtl,
            cacheDataEncrypted: props.cacheDataEncrypted,
        };
        // if any of them are defined, add an entry for '/*/*'.
        const hasCommonOptions = Object.keys(commonMethodOptions).map(v => commonMethodOptions[v]).filter(x => x !== undefined).length > 0;
        if (hasCommonOptions) {
            settings.push(renderEntry('/*/*', commonMethodOptions));
        }
        if (props.methodOptions) {
            for (const path of Object.keys(props.methodOptions)) {
                settings.push(renderEntry(path, props.methodOptions[path]));
            }
        }
        return settings.length === 0 ? undefined : settings;
        function renderEntry(path, options) {
            if (options.cachingEnabled) {
                if (self.enableCacheCluster === undefined) {
                    self.enableCacheCluster = true;
                }
                else if (self.enableCacheCluster === false) {
                    throw new Error(`Cannot enable caching for method ${path} since cache cluster is disabled on stage`);
                }
            }
            const { httpMethod, resourcePath } = util_1.parseMethodOptionsPath(path);
            return {
                httpMethod,
                resourcePath,
                cacheDataEncrypted: options.cacheDataEncrypted,
                cacheTtlInSeconds: options.cacheTtl && options.cacheTtl.toSeconds(),
                cachingEnabled: options.cachingEnabled,
                dataTraceEnabled: options.dataTraceEnabled ?? false,
                loggingLevel: options.loggingLevel,
                metricsEnabled: options.metricsEnabled,
                throttlingBurstLimit: options.throttlingBurstLimit,
                throttlingRateLimit: options.throttlingRateLimit,
            };
        }
    }
}
exports.Stage = Stage;
_b = JSII_RTTI_SYMBOL_1;
Stage[_b] = { fqn: "@aws-cdk/aws-apigateway.Stage", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzREFBc0Q7QUFDdEQsd0NBQXVGO0FBRXZGLDZDQUFzRTtBQUN0RSx1Q0FBMkQ7QUFDM0QsK0ZBQTBFO0FBQzFFLGlFQUFrRDtBQUVsRCx1Q0FBa0Q7QUFDbEQsaUNBQWdEO0FBeUhoRCxJQUFZLGtCQUlYO0FBSkQsV0FBWSxrQkFBa0I7SUFDNUIsaUNBQVcsQ0FBQTtJQUNYLHFDQUFlLENBQUE7SUFDZixtQ0FBYSxDQUFBO0FBQ2YsQ0FBQyxFQUpXLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBSTdCO0FBc0ZEOztHQUVHO0FBQ0gsTUFBc0IsU0FBVSxTQUFRLGVBQVE7SUFJOUM7O09BRUc7SUFDSSxTQUFTLENBQUMsRUFBVSxFQUFFLE9BQXVCOzs7Ozs7Ozs7O1FBQ2xELE9BQU8sSUFBSSxnQkFBTSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDMUIsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ2QsR0FBRyxPQUFPO1NBQ1gsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7O09BR0c7SUFDSSxVQUFVLENBQUMsT0FBZSxHQUFHO1FBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLElBQUksRUFBRSxDQUFDLENBQUM7U0FDdEQ7UUFDRCxPQUFPLFdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLGdCQUFnQixZQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxZQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksRUFBRSxDQUFDO0tBQ3RJO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsSUFBVyxRQUFR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QUMsWUFBWTtnQkFDbEMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxjQUFjO2dCQUN0QyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsb0JBQW9CO2dCQUNsRCxtQkFBbUIsRUFBRSxPQUFPLENBQUMsbUJBQW1CO2FBQ2pELENBQUM7UUFDSixDQUFDO0tBQ0Y7O0FBdklILHNCQXdJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0IHsgQXJuRm9ybWF0LCBEdXJhdGlvbiwgSVJlc291cmNlLCBSZXNvdXJjZSwgU3RhY2ssIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFjY2Vzc0xvZ0Zvcm1hdCwgSUFjY2Vzc0xvZ0Rlc3RpbmF0aW9uIH0gZnJvbSAnLi9hY2Nlc3MtbG9nJztcbmltcG9ydCB7IElBcGlLZXksIEFwaUtleU9wdGlvbnMsIEFwaUtleSB9IGZyb20gJy4vYXBpLWtleSc7XG5pbXBvcnQgeyBBcGlHYXRld2F5TWV0cmljcyB9IGZyb20gJy4vYXBpZ2F0ZXdheS1jYW5uZWQtbWV0cmljcy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQ2ZuU3RhZ2UgfSBmcm9tICcuL2FwaWdhdGV3YXkuZ2VuZXJhdGVkJztcbmltcG9ydCB7IERlcGxveW1lbnQgfSBmcm9tICcuL2RlcGxveW1lbnQnO1xuaW1wb3J0IHsgSVJlc3RBcGksIFJlc3RBcGlCYXNlIH0gZnJvbSAnLi9yZXN0YXBpJztcbmltcG9ydCB7IHBhcnNlTWV0aG9kT3B0aW9uc1BhdGggfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gQVBJR2F0ZXdheSBTdGFnZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJU3RhZ2UgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogTmFtZSBvZiB0aGlzIHN0YWdlLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBzdGFnZU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogUmVzdEFwaSB0byB3aGljaCB0aGlzIHN0YWdlIGlzIGFzc29jaWF0ZWQuXG4gICAqL1xuICByZWFkb25seSByZXN0QXBpOiBJUmVzdEFwaTtcblxuICAvKipcbiAgICogQWRkIGFuIEFwaUtleSB0byB0aGlzIFN0YWdlXG4gICAqL1xuICBhZGRBcGlLZXkoaWQ6IHN0cmluZywgb3B0aW9ucz86IEFwaUtleU9wdGlvbnMpOiBJQXBpS2V5O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0YWdlT3B0aW9ucyBleHRlbmRzIE1ldGhvZERlcGxveW1lbnRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzdGFnZSwgd2hpY2ggQVBJIEdhdGV3YXkgdXNlcyBhcyB0aGUgZmlyc3QgcGF0aCBzZWdtZW50XG4gICAqIGluIHRoZSBpbnZva2VkIFVuaWZvcm0gUmVzb3VyY2UgSWRlbnRpZmllciAoVVJJKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBcInByb2RcIlxuICAgKi9cbiAgcmVhZG9ubHkgc3RhZ2VOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRXYXRjaCBMb2dzIGxvZyBncm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXN0aW5hdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgYWNjZXNzTG9nRGVzdGluYXRpb24/OiBJQWNjZXNzTG9nRGVzdGluYXRpb247XG5cbiAgLyoqXG4gICAqIEEgc2luZ2xlIGxpbmUgZm9ybWF0IG9mIGFjY2VzcyBsb2dzIG9mIGRhdGEsIGFzIHNwZWNpZmllZCBieSBzZWxlY3RlZCAkY29udGVudCB2YXJpYWJsZXMuXG4gICAqIFRoZSBmb3JtYXQgbXVzdCBpbmNsdWRlIGVpdGhlciBgQWNjZXNzTG9nRm9ybWF0LmNvbnRleHRSZXF1ZXN0SWQoKWBcbiAgICogb3IgYEFjY2Vzc0xvZ0Zvcm1hdC5jb250ZXh0RXh0ZW5kZWRSZXF1ZXN0SWQoKWAuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwaWdhdGV3YXkvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2FwaS1nYXRld2F5LW1hcHBpbmctdGVtcGxhdGUtcmVmZXJlbmNlLmh0bWwjY29udGV4dC12YXJpYWJsZS1yZWZlcmVuY2VcbiAgICpcbiAgICogQGRlZmF1bHQgLSBDb21tb24gTG9nIEZvcm1hdFxuICAgKi9cbiAgcmVhZG9ubHkgYWNjZXNzTG9nRm9ybWF0PzogQWNjZXNzTG9nRm9ybWF0O1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgd2hldGhlciBBbWF6b24gWC1SYXkgdHJhY2luZyBpcyBlbmFibGVkIGZvciB0aGlzIG1ldGhvZC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHRyYWNpbmdFbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgY2FjaGUgY2x1c3RlcmluZyBpcyBlbmFibGVkIGZvciB0aGUgc3RhZ2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRGlzYWJsZWQgZm9yIHRoZSBzdGFnZS5cbiAgICovXG4gIHJlYWRvbmx5IGNhY2hlQ2x1c3RlckVuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgc3RhZ2UncyBjYWNoZSBjbHVzdGVyIHNpemUuXG4gICAqIEBkZWZhdWx0IDAuNVxuICAgKi9cbiAgcmVhZG9ubHkgY2FjaGVDbHVzdGVyU2l6ZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGlkZW50aWZpZXIgb2YgdGhlIGNsaWVudCBjZXJ0aWZpY2F0ZSB0aGF0IEFQSSBHYXRld2F5IHVzZXMgdG8gY2FsbFxuICAgKiB5b3VyIGludGVncmF0aW9uIGVuZHBvaW50cyBpbiB0aGUgc3RhZ2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS5cbiAgICovXG4gIHJlYWRvbmx5IGNsaWVudENlcnRpZmljYXRlSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgZGVzY3JpcHRpb24gb2YgdGhlIHB1cnBvc2Ugb2YgdGhlIHN0YWdlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRlc2NyaXB0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB2ZXJzaW9uIGlkZW50aWZpZXIgb2YgdGhlIEFQSSBkb2N1bWVudGF0aW9uIHNuYXBzaG90LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRvY3VtZW50YXRpb24gdmVyc2lvbi5cbiAgICovXG4gIHJlYWRvbmx5IGRvY3VtZW50YXRpb25WZXJzaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIG1hcCB0aGF0IGRlZmluZXMgdGhlIHN0YWdlIHZhcmlhYmxlcy4gVmFyaWFibGUgbmFtZXMgbXVzdCBjb25zaXN0IG9mXG4gICAqIGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzLCBhbmQgdGhlIHZhbHVlcyBtdXN0IG1hdGNoIHRoZSBmb2xsb3dpbmcgcmVndWxhclxuICAgKiBleHByZXNzaW9uOiBbQS1aYS16MC05LS5ffjovPyMmYW1wOz0sXSsuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gc3RhZ2UgdmFyaWFibGVzLlxuICAgKi9cbiAgcmVhZG9ubHkgdmFyaWFibGVzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogTWV0aG9kIGRlcGxveW1lbnQgb3B0aW9ucyBmb3Igc3BlY2lmaWMgcmVzb3VyY2VzL21ldGhvZHMuIFRoZXNlIHdpbGxcbiAgICogb3ZlcnJpZGUgY29tbW9uIG9wdGlvbnMgZGVmaW5lZCBpbiBgU3RhZ2VPcHRpb25zI21ldGhvZE9wdGlvbnNgLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCBpcyB7cmVzb3VyY2VfcGF0aH0ve2h0dHBfbWV0aG9kfSAoaS5lLiAvYXBpL3RveXMvR0VUKSBmb3IgYW5cbiAgICogaW5kaXZpZHVhbCBtZXRob2Qgb3ZlcnJpZGUuIFlvdSBjYW4gdXNlIGAqYCBmb3IgYm90aCB7cmVzb3VyY2VfcGF0aH0gYW5kIHtodHRwX21ldGhvZH1cbiAgICogdG8gZGVmaW5lIG9wdGlvbnMgZm9yIGFsbCBtZXRob2RzL3Jlc291cmNlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBDb21tb24gb3B0aW9ucyB3aWxsIGJlIHVzZWQuXG4gICAqL1xuICByZWFkb25seSBtZXRob2RPcHRpb25zPzogeyBbcGF0aDogc3RyaW5nXTogTWV0aG9kRGVwbG95bWVudE9wdGlvbnMgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdGFnZVByb3BzIGV4dGVuZHMgU3RhZ2VPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBkZXBsb3ltZW50IHRoYXQgdGhpcyBzdGFnZSBwb2ludHMgdG8gW2Rpc2FibGUtYXdzbGludDpyZWYtdmlhLWludGVyZmFjZV0uXG4gICAqL1xuICByZWFkb25seSBkZXBsb3ltZW50OiBEZXBsb3ltZW50O1xufVxuXG5leHBvcnQgZW51bSBNZXRob2RMb2dnaW5nTGV2ZWwge1xuICBPRkYgPSAnT0ZGJyxcbiAgRVJST1IgPSAnRVJST1InLFxuICBJTkZPID0gJ0lORk8nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWV0aG9kRGVwbG95bWVudE9wdGlvbnMge1xuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgQW1hem9uIENsb3VkV2F0Y2ggbWV0cmljcyBhcmUgZW5hYmxlZCBmb3IgdGhpcyBtZXRob2QuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBtZXRyaWNzRW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgbG9nZ2luZyBsZXZlbCBmb3IgdGhpcyBtZXRob2QsIHdoaWNoIGVmZmVjdHMgdGhlIGxvZ1xuICAgKiBlbnRyaWVzIHB1c2hlZCB0byBBbWF6b24gQ2xvdWRXYXRjaCBMb2dzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE9mZlxuICAgKi9cbiAgcmVhZG9ubHkgbG9nZ2luZ0xldmVsPzogTWV0aG9kTG9nZ2luZ0xldmVsO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgd2hldGhlciBkYXRhIHRyYWNlIGxvZ2dpbmcgaXMgZW5hYmxlZCBmb3IgdGhpcyBtZXRob2QuXG4gICAqIFdoZW4gZW5hYmxlZCwgQVBJIGdhdGV3YXkgd2lsbCBsb2cgdGhlIGZ1bGwgQVBJIHJlcXVlc3RzIGFuZCByZXNwb25zZXMuXG4gICAqIFRoaXMgY2FuIGJlIHVzZWZ1bCB0byB0cm91Ymxlc2hvb3QgQVBJcywgYnV0IGNhbiByZXN1bHQgaW4gbG9nZ2luZyBzZW5zaXRpdmUgZGF0YS5cbiAgICogV2UgcmVjb21tZW5kIHRoYXQgeW91IGRvbid0IGVuYWJsZSB0aGlzIGZlYXR1cmUgZm9yIHByb2R1Y3Rpb24gQVBJcy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGRhdGFUcmFjZUVuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIHRocm90dGxpbmcgYnVyc3QgbGltaXQuXG4gICAqIFRoZSB0b3RhbCByYXRlIG9mIGFsbCByZXF1ZXN0cyBpbiB5b3VyIEFXUyBhY2NvdW50IGlzIGxpbWl0ZWQgdG8gNSwwMDAgcmVxdWVzdHMuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwaWdhdGV3YXkvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2FwaS1nYXRld2F5LXJlcXVlc3QtdGhyb3R0bGluZy5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gYWRkaXRpb25hbCByZXN0cmljdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IHRocm90dGxpbmdCdXJzdExpbWl0PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIHRocm90dGxpbmcgcmF0ZSBsaW1pdC5cbiAgICogVGhlIHRvdGFsIHJhdGUgb2YgYWxsIHJlcXVlc3RzIGluIHlvdXIgQVdTIGFjY291bnQgaXMgbGltaXRlZCB0byAxMCwwMDAgcmVxdWVzdHMgcGVyIHNlY29uZCAocnBzKS5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vYXBpZ2F0ZXdheS9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvYXBpLWdhdGV3YXktcmVxdWVzdC10aHJvdHRsaW5nLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBhZGRpdGlvbmFsIHJlc3RyaWN0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgdGhyb3R0bGluZ1JhdGVMaW1pdD86IG51bWJlcjtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgcmVzcG9uc2VzIHNob3VsZCBiZSBjYWNoZWQgYW5kIHJldHVybmVkIGZvciByZXF1ZXN0cy4gQVxuICAgKiBjYWNoZSBjbHVzdGVyIG11c3QgYmUgZW5hYmxlZCBvbiB0aGUgc3RhZ2UgZm9yIHJlc3BvbnNlcyB0byBiZSBjYWNoZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQ2FjaGluZyBpcyBEaXNhYmxlZC5cbiAgICovXG4gIHJlYWRvbmx5IGNhY2hpbmdFbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSB0aW1lIHRvIGxpdmUgKFRUTCksIGluIHNlY29uZHMsIGZvciBjYWNoZWQgcmVzcG9uc2VzLiBUaGVcbiAgICogaGlnaGVyIHRoZSBUVEwsIHRoZSBsb25nZXIgdGhlIHJlc3BvbnNlIHdpbGwgYmUgY2FjaGVkLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hcGlnYXRld2F5L2xhdGVzdC9kZXZlbG9wZXJndWlkZS9hcGktZ2F0ZXdheS1jYWNoaW5nLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24ubWludXRlcyg1KVxuICAgKi9cbiAgcmVhZG9ubHkgY2FjaGVUdGw/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGNhY2hlZCByZXNwb25zZXMgYXJlIGVuY3J5cHRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGNhY2hlRGF0YUVuY3J5cHRlZD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogVGhlIGF0dHJpYnV0ZXMgb2YgYW4gaW1wb3J0ZWQgU3RhZ2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdGFnZUF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHN0YWdlXG4gICAqL1xuICByZWFkb25seSBzdGFnZU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIFJlc3RBcGkgdGhhdCB0aGUgc3RhZ2UgYmVsb25ncyB0b1xuICAgKi9cbiAgcmVhZG9ubHkgcmVzdEFwaTogSVJlc3RBcGk7XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgYW4gQXBpR2F0ZXdheSBTdGFnZVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3RhZ2VCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJU3RhZ2Uge1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgc3RhZ2VOYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSByZXN0QXBpOiBJUmVzdEFwaTtcblxuICAvKipcbiAgICogQWRkIGFuIEFwaUtleSB0byB0aGlzIHN0YWdlXG4gICAqL1xuICBwdWJsaWMgYWRkQXBpS2V5KGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBBcGlLZXlPcHRpb25zKTogSUFwaUtleSB7XG4gICAgcmV0dXJuIG5ldyBBcGlLZXkodGhpcywgaWQsIHtcbiAgICAgIHN0YWdlczogW3RoaXNdLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpbnZva2UgVVJMIGZvciBhIGNlcnRhaW4gcGF0aC5cbiAgICogQHBhcmFtIHBhdGggVGhlIHJlc291cmNlIHBhdGhcbiAgICovXG4gIHB1YmxpYyB1cmxGb3JQYXRoKHBhdGg6IHN0cmluZyA9ICcvJykge1xuICAgIGlmICghcGF0aC5zdGFydHNXaXRoKCcvJykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUGF0aCBtdXN0IGJlZ2luIHdpdGggXCIvXCI6ICR7cGF0aH1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGBodHRwczovLyR7dGhpcy5yZXN0QXBpLnJlc3RBcGlJZH0uZXhlY3V0ZS1hcGkuJHtTdGFjay5vZih0aGlzKS5yZWdpb259LiR7U3RhY2sub2YodGhpcykudXJsU3VmZml4fS8ke3RoaXMuc3RhZ2VOYW1lfSR7cGF0aH1gO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJlc291cmNlIEFSTiBmb3IgdGhpcyBzdGFnZTpcbiAgICpcbiAgICogICBhcm46YXdzOmFwaWdhdGV3YXk6e3JlZ2lvbn06Oi9yZXN0YXBpcy97cmVzdEFwaUlkfS9zdGFnZXMve3N0YWdlTmFtZX1cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoaXMgaXMgc2VwYXJhdGUgZnJvbSB0aGUgZXhlY3V0ZS1hcGkgQVJOIGZvciBtZXRob2RzIGFuZCByZXNvdXJjZXNcbiAgICogd2l0aGluIHRoaXMgc3RhZ2UuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyBnZXQgc3RhZ2VBcm4oKSB7XG4gICAgcmV0dXJuIFN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9TTEFTSF9SRVNPVVJDRV9OQU1FLFxuICAgICAgc2VydmljZTogJ2FwaWdhdGV3YXknLFxuICAgICAgYWNjb3VudDogJycsXG4gICAgICByZXNvdXJjZTogJ3Jlc3RhcGlzJyxcbiAgICAgIHJlc291cmNlTmFtZTogYCR7dGhpcy5yZXN0QXBpLnJlc3RBcGlJZH0vc3RhZ2VzLyR7dGhpcy5zdGFnZU5hbWV9YCxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBnaXZlbiBuYW1lZCBtZXRyaWMgZm9yIHRoaXMgc3RhZ2VcbiAgICovXG4gIHB1YmxpYyBtZXRyaWMobWV0cmljTmFtZTogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9BcGlHYXRld2F5JyxcbiAgICAgIG1ldHJpY05hbWUsXG4gICAgICBkaW1lbnNpb25zTWFwOiB7IEFwaU5hbWU6IHRoaXMucmVzdEFwaS5yZXN0QXBpTmFtZSwgU3RhZ2U6IHRoaXMuc3RhZ2VOYW1lIH0sXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KS5hdHRhY2hUbyh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgY2xpZW50LXNpZGUgZXJyb3JzIGNhcHR1cmVkIGluIGEgZ2l2ZW4gcGVyaW9kLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY0NsaWVudEVycm9yKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcGlHYXRld2F5TWV0cmljcy5fNFh4RXJyb3JTdW0sIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2Ygc2VydmVyLXNpZGUgZXJyb3JzIGNhcHR1cmVkIGluIGEgZ2l2ZW4gcGVyaW9kLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1bSBvdmVyIDUgbWludXRlc1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1NlcnZlckVycm9yKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcGlHYXRld2F5TWV0cmljcy5fNVh4RXJyb3JTdW0sIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRyaWMgZm9yIHRoZSBudW1iZXIgb2YgcmVxdWVzdHMgc2VydmVkIGZyb20gdGhlIEFQSSBjYWNoZSBpbiBhIGdpdmVuIHBlcmlvZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNDYWNoZUhpdENvdW50KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcGlHYXRld2F5TWV0cmljcy5jYWNoZUhpdENvdW50U3VtLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIHJlcXVlc3RzIHNlcnZlZCBmcm9tIHRoZSBiYWNrZW5kIGluIGEgZ2l2ZW4gcGVyaW9kLFxuICAgKiB3aGVuIEFQSSBjYWNoaW5nIGlzIGVuYWJsZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBwdWJsaWMgbWV0cmljQ2FjaGVNaXNzQ291bnQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYyB7XG4gICAgcmV0dXJuIHRoaXMuY2FubmVkTWV0cmljKEFwaUdhdGV3YXlNZXRyaWNzLmNhY2hlTWlzc0NvdW50U3VtLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogTWV0cmljIGZvciB0aGUgdG90YWwgbnVtYmVyIEFQSSByZXF1ZXN0cyBpbiBhIGdpdmVuIHBlcmlvZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBzYW1wbGUgY291bnQgb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNDb3VudChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoQXBpR2F0ZXdheU1ldHJpY3MuY291bnRTdW0sIHtcbiAgICAgIHN0YXRpc3RpYzogJ1NhbXBsZUNvdW50JyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIHRpbWUgYmV0d2VlbiB3aGVuIEFQSSBHYXRld2F5IHJlbGF5cyBhIHJlcXVlc3QgdG8gdGhlIGJhY2tlbmRcbiAgICogYW5kIHdoZW4gaXQgcmVjZWl2ZXMgYSByZXNwb25zZSBmcm9tIHRoZSBiYWNrZW5kLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXMuXG4gICAqL1xuICBwdWJsaWMgbWV0cmljSW50ZWdyYXRpb25MYXRlbmN5KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcGlHYXRld2F5TWV0cmljcy5pbnRlZ3JhdGlvbkxhdGVuY3lBdmVyYWdlLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHRpbWUgYmV0d2VlbiB3aGVuIEFQSSBHYXRld2F5IHJlY2VpdmVzIGEgcmVxdWVzdCBmcm9tIGEgY2xpZW50XG4gICAqIGFuZCB3aGVuIGl0IHJldHVybnMgYSByZXNwb25zZSB0byB0aGUgY2xpZW50LlxuICAgKiBUaGUgbGF0ZW5jeSBpbmNsdWRlcyB0aGUgaW50ZWdyYXRpb24gbGF0ZW5jeSBhbmQgb3RoZXIgQVBJIEdhdGV3YXkgb3ZlcmhlYWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYXZlcmFnZSBvdmVyIDUgbWludXRlcy5cbiAgICovXG4gIHB1YmxpYyBtZXRyaWNMYXRlbmN5KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiB0aGlzLmNhbm5lZE1ldHJpYyhBcGlHYXRld2F5TWV0cmljcy5sYXRlbmN5QXZlcmFnZSwgcHJvcHMpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYW5uZWRNZXRyaWMoZm46IChkaW1zOiB7IEFwaU5hbWU6IHN0cmluZzsgU3RhZ2U6IHN0cmluZyB9KSA9PiBjbG91ZHdhdGNoLk1ldHJpY1Byb3BzLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgLi4uZm4oeyBBcGlOYW1lOiB0aGlzLnJlc3RBcGkucmVzdEFwaU5hbWUsIFN0YWdlOiB0aGlzLnN0YWdlTmFtZSB9KSxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pLmF0dGFjaFRvKHRoaXMpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTdGFnZSBleHRlbmRzIFN0YWdlQmFzZSB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYSBTdGFnZSBieSBpdHMgYXR0cmlidXRlc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU3RhZ2VBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBTdGFnZUF0dHJpYnV0ZXMpOiBJU3RhZ2Uge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFN0YWdlQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgc3RhZ2VOYW1lID0gYXR0cnMuc3RhZ2VOYW1lO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHJlc3RBcGkgPSBhdHRycy5yZXN0QXBpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IHN0YWdlTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgcmVzdEFwaTogSVJlc3RBcGk7XG5cbiAgcHJpdmF0ZSBlbmFibGVDYWNoZUNsdXN0ZXI/OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTdGFnZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMuZW5hYmxlQ2FjaGVDbHVzdGVyID0gcHJvcHMuY2FjaGVDbHVzdGVyRW5hYmxlZDtcblxuICAgIGNvbnN0IG1ldGhvZFNldHRpbmdzID0gdGhpcy5yZW5kZXJNZXRob2RTZXR0aW5ncyhwcm9wcyk7IC8vIHRoaXMgY2FuIG11dGF0ZSBgdGhpcy5jYWNoZUNsdXN0ZXJFbmFibGVkYFxuXG4gICAgLy8gY3VzdG9tIGFjY2VzcyBsb2dnaW5nXG4gICAgbGV0IGFjY2Vzc0xvZ1NldHRpbmc6IENmblN0YWdlLkFjY2Vzc0xvZ1NldHRpbmdQcm9wZXJ0eSB8IHVuZGVmaW5lZDtcbiAgICBjb25zdCBhY2Nlc3NMb2dEZXN0aW5hdGlvbiA9IHByb3BzLmFjY2Vzc0xvZ0Rlc3RpbmF0aW9uO1xuICAgIGNvbnN0IGFjY2Vzc0xvZ0Zvcm1hdCA9IHByb3BzLmFjY2Vzc0xvZ0Zvcm1hdDtcbiAgICBpZiAoIWFjY2Vzc0xvZ0Rlc3RpbmF0aW9uICYmICFhY2Nlc3NMb2dGb3JtYXQpIHtcbiAgICAgIGFjY2Vzc0xvZ1NldHRpbmcgPSB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChhY2Nlc3NMb2dGb3JtYXQgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAhVG9rZW4uaXNVbnJlc29sdmVkKGFjY2Vzc0xvZ0Zvcm1hdC50b1N0cmluZygpKSAmJlxuICAgICAgICAhLy4qXFwkY29udGV4dC4ocmVxdWVzdElkfGV4dGVuZGVkUmVxdWVzdElkKVxcYi4qLy50ZXN0KGFjY2Vzc0xvZ0Zvcm1hdC50b1N0cmluZygpKSkge1xuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQWNjZXNzIGxvZyBtdXN0IGluY2x1ZGUgZWl0aGVyIGBBY2Nlc3NMb2dGb3JtYXQuY29udGV4dFJlcXVlc3RJZCgpYCBvciBgQWNjZXNzTG9nRm9ybWF0LmNvbnRleHRFeHRlbmRlZFJlcXVlc3RJZCgpYCcpO1xuICAgICAgfVxuICAgICAgaWYgKGFjY2Vzc0xvZ0Zvcm1hdCAhPT0gdW5kZWZpbmVkICYmIGFjY2Vzc0xvZ0Rlc3RpbmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBY2Nlc3MgbG9nIGZvcm1hdCBpcyBzcGVjaWZpZWQgd2l0aG91dCBhIGRlc3RpbmF0aW9uJyk7XG4gICAgICB9XG5cbiAgICAgIGFjY2Vzc0xvZ1NldHRpbmcgPSB7XG4gICAgICAgIGRlc3RpbmF0aW9uQXJuOiBhY2Nlc3NMb2dEZXN0aW5hdGlvbj8uYmluZCh0aGlzKS5kZXN0aW5hdGlvbkFybixcbiAgICAgICAgZm9ybWF0OiBhY2Nlc3NMb2dGb3JtYXQ/LnRvU3RyaW5nKCkgPyBhY2Nlc3NMb2dGb3JtYXQ/LnRvU3RyaW5nKCkgOiBBY2Nlc3NMb2dGb3JtYXQuY2xmKCkudG9TdHJpbmcoKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gZW5hYmxlIGNhY2hlIGNsdXN0ZXIgaWYgY2FjaGVDbHVzdGVyU2l6ZSBpcyBzZXRcbiAgICBpZiAocHJvcHMuY2FjaGVDbHVzdGVyU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodGhpcy5lbmFibGVDYWNoZUNsdXN0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmVuYWJsZUNhY2hlQ2x1c3RlciA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZW5hYmxlQ2FjaGVDbHVzdGVyID09PSBmYWxzZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBzZXQgXCJjYWNoZUNsdXN0ZXJTaXplXCIgdG8gJHtwcm9wcy5jYWNoZUNsdXN0ZXJTaXplfSBhbmQgXCJjYWNoZUNsdXN0ZXJFbmFibGVkXCIgdG8gXCJmYWxzZVwiYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY2FjaGVDbHVzdGVyU2l6ZSA9IHRoaXMuZW5hYmxlQ2FjaGVDbHVzdGVyID8gKHByb3BzLmNhY2hlQ2x1c3RlclNpemUgfHwgJzAuNScpIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmblN0YWdlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHN0YWdlTmFtZTogcHJvcHMuc3RhZ2VOYW1lIHx8ICdwcm9kJyxcbiAgICAgIGFjY2Vzc0xvZ1NldHRpbmcsXG4gICAgICBjYWNoZUNsdXN0ZXJFbmFibGVkOiB0aGlzLmVuYWJsZUNhY2hlQ2x1c3RlcixcbiAgICAgIGNhY2hlQ2x1c3RlclNpemUsXG4gICAgICBjbGllbnRDZXJ0aWZpY2F0ZUlkOiBwcm9wcy5jbGllbnRDZXJ0aWZpY2F0ZUlkLFxuICAgICAgZGVwbG95bWVudElkOiBwcm9wcy5kZXBsb3ltZW50LmRlcGxveW1lbnRJZCxcbiAgICAgIHJlc3RBcGlJZDogcHJvcHMuZGVwbG95bWVudC5hcGkucmVzdEFwaUlkLFxuICAgICAgZGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uLFxuICAgICAgZG9jdW1lbnRhdGlvblZlcnNpb246IHByb3BzLmRvY3VtZW50YXRpb25WZXJzaW9uLFxuICAgICAgdmFyaWFibGVzOiBwcm9wcy52YXJpYWJsZXMsXG4gICAgICB0cmFjaW5nRW5hYmxlZDogcHJvcHMudHJhY2luZ0VuYWJsZWQsXG4gICAgICBtZXRob2RTZXR0aW5ncyxcbiAgICB9KTtcblxuICAgIHRoaXMuc3RhZ2VOYW1lID0gcmVzb3VyY2UucmVmO1xuICAgIHRoaXMucmVzdEFwaSA9IHByb3BzLmRlcGxveW1lbnQuYXBpO1xuXG4gICAgaWYgKFJlc3RBcGlCYXNlLl9pc1Jlc3RBcGlCYXNlKHRoaXMucmVzdEFwaSkpIHtcbiAgICAgIHRoaXMucmVzdEFwaS5fYXR0YWNoU3RhZ2UodGhpcyk7XG4gICAgfVxuICB9XG5cblxuICBwcml2YXRlIHJlbmRlck1ldGhvZFNldHRpbmdzKHByb3BzOiBTdGFnZVByb3BzKTogQ2ZuU3RhZ2UuTWV0aG9kU2V0dGluZ1Byb3BlcnR5W10gfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHNldHRpbmdzID0gbmV3IEFycmF5PENmblN0YWdlLk1ldGhvZFNldHRpbmdQcm9wZXJ0eT4oKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIC8vIGV4dHJhY3QgY29tbW9uIG1ldGhvZCBvcHRpb25zIGZyb20gdGhlIHN0YWdlIHByb3BzXG4gICAgY29uc3QgY29tbW9uTWV0aG9kT3B0aW9uczogTWV0aG9kRGVwbG95bWVudE9wdGlvbnMgPSB7XG4gICAgICBtZXRyaWNzRW5hYmxlZDogcHJvcHMubWV0cmljc0VuYWJsZWQsXG4gICAgICBsb2dnaW5nTGV2ZWw6IHByb3BzLmxvZ2dpbmdMZXZlbCxcbiAgICAgIGRhdGFUcmFjZUVuYWJsZWQ6IHByb3BzLmRhdGFUcmFjZUVuYWJsZWQsXG4gICAgICB0aHJvdHRsaW5nQnVyc3RMaW1pdDogcHJvcHMudGhyb3R0bGluZ0J1cnN0TGltaXQsXG4gICAgICB0aHJvdHRsaW5nUmF0ZUxpbWl0OiBwcm9wcy50aHJvdHRsaW5nUmF0ZUxpbWl0LFxuICAgICAgY2FjaGluZ0VuYWJsZWQ6IHByb3BzLmNhY2hpbmdFbmFibGVkLFxuICAgICAgY2FjaGVUdGw6IHByb3BzLmNhY2hlVHRsLFxuICAgICAgY2FjaGVEYXRhRW5jcnlwdGVkOiBwcm9wcy5jYWNoZURhdGFFbmNyeXB0ZWQsXG4gICAgfTtcblxuICAgIC8vIGlmIGFueSBvZiB0aGVtIGFyZSBkZWZpbmVkLCBhZGQgYW4gZW50cnkgZm9yICcvKi8qJy5cbiAgICBjb25zdCBoYXNDb21tb25PcHRpb25zID0gT2JqZWN0LmtleXMoY29tbW9uTWV0aG9kT3B0aW9ucykubWFwKHYgPT4gKGNvbW1vbk1ldGhvZE9wdGlvbnMgYXMgYW55KVt2XSkuZmlsdGVyKHggPT4geCAhPT0gdW5kZWZpbmVkKS5sZW5ndGggPiAwO1xuICAgIGlmIChoYXNDb21tb25PcHRpb25zKSB7XG4gICAgICBzZXR0aW5ncy5wdXNoKHJlbmRlckVudHJ5KCcvKi8qJywgY29tbW9uTWV0aG9kT3B0aW9ucykpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5tZXRob2RPcHRpb25zKSB7XG4gICAgICBmb3IgKGNvbnN0IHBhdGggb2YgT2JqZWN0LmtleXMocHJvcHMubWV0aG9kT3B0aW9ucykpIHtcbiAgICAgICAgc2V0dGluZ3MucHVzaChyZW5kZXJFbnRyeShwYXRoLCBwcm9wcy5tZXRob2RPcHRpb25zW3BhdGhdKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNldHRpbmdzLmxlbmd0aCA9PT0gMCA/IHVuZGVmaW5lZCA6IHNldHRpbmdzO1xuXG4gICAgZnVuY3Rpb24gcmVuZGVyRW50cnkocGF0aDogc3RyaW5nLCBvcHRpb25zOiBNZXRob2REZXBsb3ltZW50T3B0aW9ucyk6IENmblN0YWdlLk1ldGhvZFNldHRpbmdQcm9wZXJ0eSB7XG4gICAgICBpZiAob3B0aW9ucy5jYWNoaW5nRW5hYmxlZCkge1xuICAgICAgICBpZiAoc2VsZi5lbmFibGVDYWNoZUNsdXN0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHNlbGYuZW5hYmxlQ2FjaGVDbHVzdGVyID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChzZWxmLmVuYWJsZUNhY2hlQ2x1c3RlciA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBlbmFibGUgY2FjaGluZyBmb3IgbWV0aG9kICR7cGF0aH0gc2luY2UgY2FjaGUgY2x1c3RlciBpcyBkaXNhYmxlZCBvbiBzdGFnZWApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgaHR0cE1ldGhvZCwgcmVzb3VyY2VQYXRoIH0gPSBwYXJzZU1ldGhvZE9wdGlvbnNQYXRoKHBhdGgpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBodHRwTWV0aG9kLFxuICAgICAgICByZXNvdXJjZVBhdGgsXG4gICAgICAgIGNhY2hlRGF0YUVuY3J5cHRlZDogb3B0aW9ucy5jYWNoZURhdGFFbmNyeXB0ZWQsXG4gICAgICAgIGNhY2hlVHRsSW5TZWNvbmRzOiBvcHRpb25zLmNhY2hlVHRsICYmIG9wdGlvbnMuY2FjaGVUdGwudG9TZWNvbmRzKCksXG4gICAgICAgIGNhY2hpbmdFbmFibGVkOiBvcHRpb25zLmNhY2hpbmdFbmFibGVkLFxuICAgICAgICBkYXRhVHJhY2VFbmFibGVkOiBvcHRpb25zLmRhdGFUcmFjZUVuYWJsZWQgPz8gZmFsc2UsXG4gICAgICAgIGxvZ2dpbmdMZXZlbDogb3B0aW9ucy5sb2dnaW5nTGV2ZWwsXG4gICAgICAgIG1ldHJpY3NFbmFibGVkOiBvcHRpb25zLm1ldHJpY3NFbmFibGVkLFxuICAgICAgICB0aHJvdHRsaW5nQnVyc3RMaW1pdDogb3B0aW9ucy50aHJvdHRsaW5nQnVyc3RMaW1pdCxcbiAgICAgICAgdGhyb3R0bGluZ1JhdGVMaW1pdDogb3B0aW9ucy50aHJvdHRsaW5nUmF0ZUxpbWl0LFxuICAgICAgfTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==