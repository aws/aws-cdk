import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './apigateway.generated';
import { Deployment } from './deployment';
import { RestApiRef } from './restapi-ref';
import { parseMethodOptionsPath } from './util';

export interface StageOptions extends MethodDeploymentOptions {
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
   * Method deployment options for specific resources/methods. These will
   * override common options defined in `StageOptions#methodOptions`.
   *
   * @param path is {resource_path}/{http_method} (i.e. /api/toys/GET) for an
   * individual method override. You can use `*` for both {resource_path} and {http_method}
   * to define options for all methods/resources.
   */

  methodOptions?: { [path: string]: MethodDeploymentOptions };
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

export class Stage extends cdk.Construct implements cdk.IDependable {
  public readonly stageName: string;
  public readonly dependencyElements = new Array<cdk.IDependable>();

  private readonly restApi: RestApiRef;

  constructor(parent: cdk.Construct, id: string, props: StageProps) {
    super(parent, id);

    const methodSettings = this.renderMethodSettings(props);

    // enable cache cluster if cacheClusterSize is set
    if (props.cacheClusterSize !== undefined) {
      if (props.cacheClusterEnabled === undefined) {
        props.cacheClusterEnabled = true;
      } else if (props.cacheClusterEnabled === false) {
        throw new Error(`Cannot set "cacheClusterSize" to ${props.cacheClusterSize} and "cacheClusterEnabled" to "false"`);
      }
    }

    const cacheClusterSize = props.cacheClusterEnabled ? (props.cacheClusterSize || '0.5') : undefined;
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
      methodSettings,
    });

    this.stageName = resource.ref;
    this.restApi = props.deployment.api;
    this.dependencyElements.push(resource);
  }

  /**
   * Returns the invoke URL for a certain path.
   * @param path The resource path
   */
  public urlForPath(path: string = '/') {
    if (!path.startsWith('/')) {
      throw new Error(`Path must begin with "/": ${path}`);
    }
    return `https://${this.restApi.restApiId}.execute-api.${new cdk.AwsRegion()}.amazonaws.com/${this.stageName}${path}`;
  }

  private renderMethodSettings(props: StageProps): cloudformation.StageResource.MethodSettingProperty[] | undefined {
    const settings = new Array<cloudformation.StageResource.MethodSettingProperty>();

    // extract common method options from the stage props
    const commonMethodOptions: MethodDeploymentOptions = {
      metricsEnabled: props.metricsEnabled,
      loggingLevel: props.loggingLevel,
      dataTraceEnabled: props.dataTraceEnabled,
      throttlingBurstLimit: props.throttlingBurstLimit,
      throttlingRateLimit: props.throttlingRateLimit,
      cachingEnabled: props.cachingEnabled,
      cacheTtlSeconds: props.cacheTtlSeconds,
      cacheDataEncrypted: props.cacheDataEncrypted
    };

    // if any of them are defined, add an entry for '/*/*'.
    const hasCommonOptions = Object.keys(commonMethodOptions).map(v => (commonMethodOptions as any)[v]).filter(x => x).length > 0;
    if (hasCommonOptions) {
      settings.push(renderEntry('/*/*', commonMethodOptions));
    }

    if (props.methodOptions) {
      for (const path of Object.keys(props.methodOptions)) {
        settings.push(renderEntry(path, props.methodOptions[path]));
      }
    }

    return settings.length === 0 ? undefined : settings;

    function renderEntry(path: string, options: MethodDeploymentOptions): cloudformation.StageResource.MethodSettingProperty {
      if (options.cachingEnabled) {
        if (props.cacheClusterEnabled === undefined) {
          props.cacheClusterEnabled = true;
        } else if (props.cacheClusterEnabled === false) {
          throw new Error(`Cannot enable caching for method ${path} since cache cluster is disabled on stage`);
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
