import cdk = require('@aws-cdk/cdk');
import { cloudformation, StageName } from './apigateway.generated';
import { Deployment } from './deployment';
import { parseMethodOptionsPath } from './util';

export interface StageOptions {
    /**
     * The name of the stage, which API Gateway uses as the first path segment
     * in the invoked Uniform Resource Identifier (URI).
     *
     * @default "prod"
     */
    stageName?: string;

    /**
     * Indicates whether cache clustering is enabled for the stage.
     */
    cacheClusterEnabled?: boolean;

    /**
     * The stage's cache cluster size.
     * @default 0.5
     */
    cacheClusterSize?: string;

    /**
     * The identifier of the client certificate that API Gateway uses to call
     * your integration endpoints in the stage.
     *
     * @default None
     */
    clientCertificateId?: string;

    /**
     * A description of the purpose of the stage.
     */
    description?: string;

    /**
     * The version identifier of the API documentation snapshot.
     */
    documentationVersion?: string;

    /**
     * A map that defines the stage variables. Variable names must consist of
     * alphanumeric characters, and the values must match the following regular
     * expression: [A-Za-z0-9-._~:/?#&amp;=,]+.
     */
    variables?: { [key: string]: string };

    /**
     * Default deployment options for all methods. You can indicate deployment
     * options for specific resources/methods via `customMethodOptions`.
     */
    methodOptions?: MethodDeploymentOptions

    /**
     * Method deployment options for specific resources/methods. These will
     * override common options defined in `StageOptions#methodOptions`.
     *
     * @param path is {resource_path}/{http_method} (i.e. /api/toys/GET) for an
     * individual method override. You can use `*` for both {resource_path} and {http_method}
     * to define options for all methods/resources.
     */

    customMethodOptions?: { [path: string]: MethodDeploymentOptions };
}

export interface StageProps extends StageOptions {
    /**
     * The deployment that this stage points to.
     */
    deployment: Deployment;
}

export enum MethodLoggingLevel {
    Off = 'OFF',
    Error = 'ERROR',
    Info = 'INFO'
}

export interface MethodDeploymentOptions {
    /**
     * Specifies whether Amazon CloudWatch metrics are enabled for this method.
     * @default false
     */
    metricsEnabled?: boolean;

    /**
     * Specifies the logging level for this method, which effects the log
     * entries pushed to Amazon CloudWatch Logs.
     * @default Off
     */
    loggingLevel?: MethodLoggingLevel;

    /**
     * Specifies whether data trace logging is enabled for this method, which
     * effects the log entries pushed to Amazon CloudWatch Logs.
     * @default false
     */
    dataTraceEnabled?: boolean;

    /**
     * Specifies the throttling burst limit.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html
     */
    throttlingBurstLimit?: number;

    /**
     * Specifies the throttling rate limit.
     * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html
     */
    throttlingRateLimit?: number;

    /**
     * Specifies whether responses should be cached and returned for requests. A
     * cache cluster must be enabled on the stage for responses to be cached.
     */
    cachingEnabled?: boolean;

    /**
     * Specifies the time to live (TTL), in seconds, for cached responses. The
     * higher the TTL, the longer the response will be cached.
     */
    cacheTtlSeconds?: number;

    /**
     * Indicates whether the cached responses are encrypted.
     * @default false
     */
    cacheDataEncrypted?: boolean;
}

export class Stage extends cdk.Construct {
    public readonly stageName: StageName;

    constructor(parent: cdk.Construct, id: string, props: StageProps) {
        super(parent, id);

        let cacheClusterSize;
        if (props.cacheClusterEnabled) {
            cacheClusterSize = props.cacheClusterSize || '0.5';
        } else {
            if (props.cacheClusterSize) {
                throw new Error(`Cannot specify cacheClusterSize if cacheCluster is not enabled`);
            }
        }

        const resource = new cloudformation.StageResource(this, 'Resource', {
            stageName: props.stageName || 'prod',
            cacheClusterEnabled: props.cacheClusterEnabled,
            cacheClusterSize,
            clientCertificateId: props.clientCertificateId,
            deploymentId: props.deployment.deploymentId,
            restApiId: props.deployment.api.restApiId,
            description: props.description,
            documentationVersion: props.documentationVersion,
            variables: props.variables,
            methodSettings: this.renderMethodSettings(props),
        });

        this.stageName = resource.ref;
    }

    private renderMethodSettings(props: StageProps): cloudformation.StageResource.MethodSettingProperty[] | undefined {
        const settings = new Array<cloudformation.StageResource.MethodSettingProperty>();

        if (props.methodOptions) {
            settings.push(renderEntry('/*/*', props.methodOptions));
        }

        if (props.customMethodOptions) {
            for (const path of Object.keys(props.customMethodOptions)) {
                settings.push(renderEntry(path, props.customMethodOptions[path]));
            }
        }

        return settings.length === 0 ? undefined : settings;

        function renderEntry(path: string, options: MethodDeploymentOptions): cloudformation.StageResource.MethodSettingProperty {
            if (options.cachingEnabled) {
                if (!props.cacheClusterEnabled) {
                    throw new Error(`Cannot enable caching for method ${path} since cache cluster is not enabled on stage`);
                }
            }

            const { httpMethod, resourcePath } = parseMethodOptionsPath(path);

            return {
                httpMethod, resourcePath,
                cacheDataEncrypted: options.cacheDataEncrypted,
                cacheTtlInSeconds: options.cacheTtlSeconds,
                cachingEnabled: options.cachingEnabled,
                dataTraceEnabled: options.dataTraceEnabled,
                loggingLevel: options.loggingLevel,
                metricsEnabled: options.metricsEnabled,
                throttlingBurstLimit: options.throttlingBurstLimit,
                throttlingRateLimit: options.throttlingRateLimit,
            };
        }
    }
}