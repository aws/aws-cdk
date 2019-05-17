import { Token } from '@aws-cdk/cdk';
import { Construct, Resource } from '@aws-cdk/cdk';
import { ApiKey } from './api-key';
import { CfnUsagePlan, CfnUsagePlanKey } from './apigateway.generated';
import { Method } from './method';
import { RestApi } from './restapi';
import { Stage } from './stage';
import { validateInteger } from './util'

/**
 * Container for defining throttling parameters to API stages or methods.
 * @link https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html
 */
export interface ThrottleSettings {
  /**
   * The API request steady-state rate limit (average requests per second over an extended period of time)
   * 
   * Type: Integer
   */
  readonly rateLimit?: number;

  /**
   * The maximum API request rate limit over a time ranging from one to a few seconds.
   * 
   * Type: Integer
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
   * 
   * Type: Integer
   */
  readonly limit?: number;

  /**
   * For the initial time period, the number of requests to subtract from the specified limit.
   * 
   * Type: Integer
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
  readonly api?: RestApi,
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
  readonly name?: string

  /**
   * ApiKey to be associated with the usage plan. 
   */
  readonly apiKey?: ApiKey
}

export class UsagePlan extends Resource {
  public readonly usagePlanId: string;

  constructor(scope: Construct, name: string, props: UsagePlanProps = { }) {
    super(scope, name);
    let resource: CfnUsagePlan;

    if (props !== undefined) {
      resource = new CfnUsagePlan(this, 'Resource', {
        apiStages: this.renderApiStages(props.apiStages),
        description: props.description,
        quota: this.renderQuota(props),
        throttle: this.renderThrottle(props.throttle),
        usagePlanName: props.name,
      });
    } else {
      resource = new CfnUsagePlan(this, 'Resource');
    }

    this.usagePlanId = resource.ref;

    // Add ApiKey when 
    if (props.apiKey) {
      this.addApiKey(props.apiKey)
    }
  }

  /**
   * Adds and ApiKey.
   * 
   * @param apiKey 
   */
  public addApiKey(apiKey: ApiKey): void {
    new CfnUsagePlanKey(this, 'UsagePlanKeyResource', {
      keyId: apiKey.keyId,
      keyType: UsagePlanKeyType.ApiKey,
      usagePlanId: this.usagePlanId
    });
  }
  
  /**
   * 
   * @param props 
   */
  private renderApiStages(apiStages: UsagePlanPerApiStage[] | undefined): CfnUsagePlan.ApiStageProperty[] | undefined {
    if (apiStages && apiStages.length > 0) {
      const stages: CfnUsagePlan.ApiStageProperty[] = [];
      apiStages.forEach((apiStage: UsagePlanPerApiStage) => {
        stages.push(this.createStage(apiStage));
      });
      return stages;
    }
    return undefined;
  }

  private createStage(apiStage: UsagePlanPerApiStage): CfnUsagePlan.ApiStageProperty {
    const stage = apiStage.stage ? apiStage.stage.stageName.toString() : undefined;
    const apiId = apiStage.stage ? apiStage.stage.restApi.restApiId : undefined;
    const throttle = this.renderThrottlePerMethod(apiStage.throttle);
    return {
      apiId,
      stage,
      throttle
    };
  }

  private renderQuota(props: UsagePlanProps): CfnUsagePlan.QuotaSettingsProperty | undefined {
    if (props.quota === undefined) {
      return undefined;
    } else {
      const limit = props.quota ? props.quota.limit : undefined; 
      validateInteger(limit, 'Throttle quota limit')
      return {
        limit: limit,
        offset: props.quota ? props.quota.offset : undefined,
        period: props.quota ? props.quota.period : undefined
      };  
    }
  }

  private renderThrottle(props: ThrottleSettings | undefined): CfnUsagePlan.ThrottleSettingsProperty | Token | undefined {
    let ret: (CfnUsagePlan.ThrottleSettingsProperty | Token | undefined);
    if (props !== undefined) {
      const burstLimit = props.burstLimit
      validateInteger(burstLimit, 'Throttle burst limit')
      const rateLimit = props.rateLimit
      validateInteger(rateLimit, 'Throttle rate limit')
      
      ret = {
        burstLimit: burstLimit,
        rateLimit: rateLimit
      }
    }
    return ret;
  }

  private renderThrottlePerMethod(throttlePerMethod?: ThrottlingPerMethod[]): {
    [key: string]: (CfnUsagePlan.ThrottleSettingsProperty | Token | undefined)
  } {
    let ret: { [key: string]: (CfnUsagePlan.ThrottleSettingsProperty | Token | undefined ) } = {};

    if (throttlePerMethod && throttlePerMethod.length > 0) {
      throttlePerMethod.forEach((value: ThrottlingPerMethod) => {
        const method: Method = value.method;
        // this methodId is resource path and method for example /GET or /pets/GET
        const methodId = `${method.resource.path}/${method.httpMethod}`;
        ret[methodId] = this.renderThrottle(value.throttle);
      });
    }

    return ret;
  }
}
