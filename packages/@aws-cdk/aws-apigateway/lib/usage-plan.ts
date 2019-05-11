import cdk = require('@aws-cdk/cdk');
import { ApiKey } from './api-key';
import { cloudformation } from './apigateway.generated';
import { Method } from './method';
import { IRestApiResource } from './resource';
import { Stage } from './stage';

/**
 * Container for defining throttling parameters to API stages or methods.
 * @link https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html
 */
export interface ThrottleSettings {
  /**
   * The API request steady-state rate limit (average requests per second over an extended period of time)
   */
  readonly rateLimit?: number;

  /**
   * The maximum API request rate limit over a time ranging from one to a few seconds.
   */
  readonly burstLimit?: number;
}

/**
 * Time period for which quota settings apply.
 */
export enum Period {
  Day = 'DAY',
  Week = 'WEEK',
  Month = 'MONTH'
}

/**
 * Specifies the maximum number of requests that clients can make to API Gateway APIs.
 */
export interface QuotaSettings {
  /**
   * The maximum number of requests that users can make within the specified time period.
   */
  readonly limit?: number;

  /**
   * For the initial time period, the number of requests to subtract from the specified limit.
   */
  readonly offset?: number;

  /**
   * The time period for which the maximum limit of requests applies.
   */
  readonly period?: Period;
}

/**
 * Represents per-method throttling for a resource.
 */
export interface ThrottlingPerMethod {
  readonly method: Method,
  readonly throttle: ThrottleSettings
}

/**
 * Type of Usage Plan Key. Currently the only supported type is 'API_KEY'
 */
export enum UsagePlanKeyType {
  ApiKey = 'API_KEY'
}

/**
 * Represents the API stages that a usage plan applies to.
 */
export interface UsagePlanPerApiStage {
  readonly api?: IRestApiResource,
  readonly stage?: Stage,
  readonly throttle?: ThrottlingPerMethod[]
}

export interface UsagePlanProps {
  /**
   * API Stages to be associated which the usage plan.
   */
  readonly apiStages?: UsagePlanPerApiStage[],

  /**
   * Represents usage plan purpose.
   */
  readonly description?: string,

  /**
   * Number of requests clients can make in a given time period.
   */
  readonly quota?: QuotaSettings

  /**
   * Overall throttle settings for the API.
   */
  readonly throttle?: ThrottleSettings,

  /**
   * Name for this usage plan.
   */
  readonly name?: string,
}

export class UsagePlan extends cdk.Construct {
  public readonly usagePlanId: string;

  constructor(parent: cdk.Construct, name: string, props?: UsagePlanProps) {
    super(parent, name);
    let resource: cloudformation.UsagePlanResource;
    if (props !== undefined) {
      const overallThrottle = this.renderThrottle(props.throttle);
      const quota = this.renderQuota(props);
      const apiStages = this.renderApiStages(props);

      resource = new cloudformation.UsagePlanResource(this, 'Resource', {
        apiStages,
        description: props.description,
        quota,
        throttle: overallThrottle,
        usagePlanName: props.name,
      });
    } else {
      resource = new cloudformation.UsagePlanResource(this, 'Resource');
    }

    this.usagePlanId = resource.ref;
  }

  public addApiKey(apiKey: ApiKey): void {
    new cloudformation.UsagePlanKeyResource(this, 'UsagePlanKeyResource', {
      keyId: apiKey.keyId,
      keyType: UsagePlanKeyType.ApiKey,
      usagePlanId: this.usagePlanId
    });
  }

  private renderApiStages(props: UsagePlanProps): cloudformation.UsagePlanResource.ApiStageProperty[] | undefined {
    if (props.apiStages && props.apiStages.length > 0) {
      const apiStages: cloudformation.UsagePlanResource.ApiStageProperty[] = [];
      props.apiStages.forEach((value: UsagePlanPerApiStage) => {
        const apiId = value.api ? value.api.resourceApi.restApiId : undefined;
        const stage = value.stage ? value.stage.stageName.toString() : undefined;
        const throttle = this.renderThrottlePerMethod(value.throttle);
        apiStages.push({
          apiId,
          stage,
          throttle
        });
      });
      return apiStages;
    }

    return undefined;
  }

  private renderThrottlePerMethod(throttlePerMethod?: ThrottlingPerMethod[]): {
    [key: string]: (cloudformation.UsagePlanResource.ThrottleSettingsProperty | cdk.Token)
  } {
    const ret: { [key: string]: (cloudformation.UsagePlanResource.ThrottleSettingsProperty | cdk.Token) } = {};

    if (throttlePerMethod && throttlePerMethod.length > 0) {
      throttlePerMethod.forEach((value: ThrottlingPerMethod) => {
        const method: Method = value.method;
        // this methodId is resource path and method for example /GET or /pets/GET
        const methodId = `${method.resource.resourcePath}/${method.httpMethod}`;
        ret[methodId] = this.renderThrottle(value.throttle);
      });
    }

    return ret;
  }

  private renderQuota(props: UsagePlanProps): cloudformation.UsagePlanResource.QuotaSettingsProperty | undefined {
    if (props.quota === undefined) {
      return undefined;
    }
    return {
      limit: props.quota ? props.quota.limit : undefined,
      offset: props.quota ? props.quota.offset : undefined,
      period: props.quota ? props.quota.period : undefined
    };
  }

  private renderThrottle(throttleSettings?: ThrottleSettings): cloudformation.UsagePlanResource.ThrottleSettingsProperty {
    const throttle: cloudformation.UsagePlanResource.ThrottleSettingsProperty = {};
    if (throttleSettings !== undefined) {
      const burstLimit: number|undefined = throttleSettings.burstLimit;
      if (burstLimit) {
        if (!Number.isInteger(burstLimit)) {
          throw new Error('Throttle burst limit should be an integer');
        }
        throttle.burstLimit = Number.isInteger(burstLimit) ? burstLimit : undefined;
      }
      throttle.rateLimit = throttleSettings.rateLimit;
    }
    return throttle;
  }
}
