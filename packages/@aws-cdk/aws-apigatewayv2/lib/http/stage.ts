import { Metric, MetricOptions } from '@aws-cdk/aws-cloudwatch';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IHttpApi } from './api';
import { CfnStage } from '../apigatewayv2.generated';
import { StageOptions, IStage, StageAttributes } from '../common';
import { IApi } from '../common/api';
import { StageBase } from '../common/base';

const DEFAULT_STAGE_NAME = '$default';

/**
 * Represents the HttpStage
 */
export interface IHttpStage extends IStage {
  /**
   * The API this stage is associated to.
   */
  readonly api: IHttpApi;

  /**
   * The custom domain URL to this stage
   */
  readonly domainUrl: string;

  /**
   * Metric for the number of client-side errors captured in a given period.
   *
   * @default - sum over 5 minutes
   */
  metricClientError(props?: MetricOptions): Metric

  /**
   * Metric for the number of server-side errors captured in a given period.
   *
   * @default - sum over 5 minutes
   */
  metricServerError(props?: MetricOptions): Metric

  /**
   * Metric for the amount of data processed in bytes.
   *
   * @default - sum over 5 minutes
   */
  metricDataProcessed(props?: MetricOptions): Metric

  /**
   * Metric for the total number API requests in a given period.
   *
   * @default - SampleCount over 5 minutes
   */
  metricCount(props?: MetricOptions): Metric

  /**
   * Metric for the time between when API Gateway relays a request to the backend
   * and when it receives a response from the backend.
   *
   * @default - no statistic
   */
  metricIntegrationLatency(props?: MetricOptions): Metric

  /**
   * The time between when API Gateway receives a request from a client
   * and when it returns a response to the client.
   * The latency includes the integration latency and other API Gateway overhead.
   *
   * @default - no statistic
   */
  metricLatency(props?: MetricOptions): Metric
}

/**
 * The options to create a new Stage for an HTTP API
 */
export interface HttpStageOptions extends StageOptions {
  /**
   * The name of the stage. See `StageName` class for more details.
   * @default '$default' the default stage of the API. This stage will have the URL at the root of the API endpoint.
   */
  readonly stageName?: string;
}

/**
 * Properties to initialize an instance of `HttpStage`.
 */
export interface HttpStageProps extends HttpStageOptions {
  /**
   * The HTTP API to which this stage is associated.
   */
  readonly httpApi: IHttpApi;
}

/**
 * The attributes used to import existing HttpStage
 */
export interface HttpStageAttributes extends StageAttributes {
  /**
   * The API to which this stage is associated
   */
  readonly api: IHttpApi;
}

abstract class HttpStageBase extends StageBase implements IHttpStage {
  public abstract readonly domainUrl: string;
  public abstract readonly api: IHttpApi;

  public metricClientError(props?: MetricOptions): Metric {
    return this.metric('4xx', { statistic: 'Sum', ...props });
  }

  public metricServerError(props?: MetricOptions): Metric {
    return this.metric('5xx', { statistic: 'Sum', ...props });
  }

  public metricDataProcessed(props?: MetricOptions): Metric {
    return this.metric('DataProcessed', { statistic: 'Sum', ...props });
  }

  public metricCount(props?: MetricOptions): Metric {
    return this.metric('Count', { statistic: 'SampleCount', ...props });
  }

  public metricIntegrationLatency(props?: MetricOptions): Metric {
    return this.metric('IntegrationLatency', props);
  }

  public metricLatency(props?: MetricOptions): Metric {
    return this.metric('Latency', props);
  }
}

/**
 * Represents a stage where an instance of the API is deployed.
 * @resource AWS::ApiGatewayV2::Stage
 */
export class HttpStage extends HttpStageBase {
  /**
   * Import an existing stage into this CDK app.
   */
  public static fromHttpStageAttributes(scope: Construct, id: string, attrs: HttpStageAttributes): IHttpStage {
    class Import extends HttpStageBase {
      protected readonly baseApi = attrs.api;
      public readonly stageName = attrs.stageName;
      public readonly api = attrs.api;

      get url(): string {
        throw new Error('url is not available for imported stages.');
      }

      get domainUrl(): string {
        throw new Error('domainUrl is not available for imported stages.');
      }
    }
    return new Import(scope, id);
  }

  protected readonly baseApi: IApi;
  public readonly stageName: string;
  public readonly api: IHttpApi;

  constructor(scope: Construct, id: string, props: HttpStageProps) {
    super(scope, id, {
      physicalName: props.stageName ? props.stageName : DEFAULT_STAGE_NAME,
    });

    new CfnStage(this, 'Resource', {
      apiId: props.httpApi.apiId,
      stageName: this.physicalName,
      autoDeploy: props.autoDeploy,
      defaultRouteSettings: !props.throttle ? undefined : {
        throttlingBurstLimit: props.throttle?.burstLimit,
        throttlingRateLimit: props.throttle?.rateLimit,
      },
    });

    this.stageName = this.physicalName;
    this.baseApi = props.httpApi;
    this.api = props.httpApi;

    if (props.domainMapping) {
      this._addDomainMapping(props.domainMapping);
    }
  }

  /**
   * The URL to this stage.
   */
  public get url(): string {
    const s = Stack.of(this);
    const urlPath = this.stageName === DEFAULT_STAGE_NAME ? '' : this.stageName;
    return `https://${this.api.apiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}`;
  }

  public get domainUrl(): string {
    if (!this._apiMapping) {
      throw new Error('domainUrl is not available when no API mapping is associated with the Stage');
    }

    return `https://${this._apiMapping.domainName.name}/${this._apiMapping.mappingKey ?? ''}`;
  }
}
