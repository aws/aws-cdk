import { IApi } from './api';
import { ApiMapping } from './api-mapping';
import { DomainMappingOptions, IAccessLogSettings, IStage } from './stage';
import { AccessLogFormat } from '../../../aws-apigateway/lib';
import * as cloudwatch from '../../../aws-cloudwatch';
import { Resource, Token } from '../../../core';
import { UnscopedValidationError, ValidationError } from '../../../core/lib/errors';
import { CfnStage } from '../apigatewayv2.generated';

/**
 * Base class representing an API
 * @internal
 */
export abstract class ApiBase extends Resource implements IApi {
  abstract readonly apiId: string;
  abstract readonly apiEndpoint: string;

  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/ApiGateway',
      metricName,
      dimensionsMap: { ApiId: this.apiId },
      ...props,
    }).attachTo(this);
  }
}

/**
 * Base class representing a Stage
 * @internal
 */
export abstract class StageBase extends Resource implements IStage {
  private stageVariables: { [key: string]: string } = {};
  public abstract readonly stageName: string;
  protected abstract readonly baseApi: IApi;

  /**
   * The created ApiMapping if domain mapping has been added
   * @internal
   */
  protected _apiMapping?: ApiMapping;

  /**
   * The URL to this stage.
   */
  abstract get url(): string;

  /**
   * @internal
   */
  protected _addDomainMapping(domainMapping: DomainMappingOptions) {
    if (this._apiMapping) {
      throw new UnscopedValidationError('Only one ApiMapping allowed per Stage');
    }
    this._apiMapping = new ApiMapping(this, `${domainMapping.domainName}${domainMapping.mappingKey}`, {
      api: this.baseApi,
      domainName: domainMapping.domainName,
      stage: this,
      apiMappingKey: domainMapping.mappingKey,
    });
    // ensure the dependency
    this.node.addDependency(domainMapping.domainName);
  }

  /**
   * @internal
   */
  protected _validateAccessLogSettings(props?: IAccessLogSettings): CfnStage.AccessLogSettingsProperty | undefined {
    if (!props) return;

    const format = props.format;
    if (
      format &&
      !Token.isUnresolved(format.toString()) &&
      !/\$context\.(?:requestId|extendedRequestId)\b/.test(format.toString())
    ) {
      throw new ValidationError('Access log must include either `AccessLogFormat.contextRequestId()` or `AccessLogFormat.contextExtendedRequestId()`', this);
    }

    return {
      destinationArn: props.destination.bind(this).destinationArn,
      format: format ? format.toString() : AccessLogFormat.clf().toString(),
    };
  }

  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.baseApi.metric(metricName, props).with({
      dimensionsMap: { ApiId: this.baseApi.apiId, Stage: this.stageName },
    }).attachTo(this);
  }

  public addStageVariable(name: string, value: string) {
    this.stageVariables[name] = value;
  }

  /**
   * Returns the stage variables for this stage.
   * @internal
   */
  protected get _stageVariables(): { [key: string]: string } | undefined {
    return Object.keys(this.stageVariables).length > 0 ? { ...this.stageVariables } : undefined;
  }
}
