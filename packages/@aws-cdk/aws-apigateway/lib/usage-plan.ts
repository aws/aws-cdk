import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './apigateway.generated';
import { Method } from './method';
import { IRestApiResource } from './resource';
import { Stage } from './stage';

/**
 * Container for defining throttling parameters to API stages or methods.
 * See link for more API Gateway's Request Throttling.
 *
 * @link https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html
 */
export interface ThrottleSettings {
  /**
   * Represents the steady-state rate for the API stage or method.
   */
  rateLimit?: number
  /**
   * Represents the burst size (i.e. maximum bucket size) for the API stage or method.
   */
  burstLimit?: number,
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
   * Maximum number of requests that can be made in a given time period.
   */
  limit?: number,
  /**
   * Number of requests to reduce from the limit for the first time period.
   */
  offset?: number,
  /**
   * Time period to which the maximum limit applies. Valid values are DAY, WEEK or MONTH.
   */
  period?: Period
}

/**
 * Represents per-method throttling for a resource.
 */
export interface ThrottlingPerMethod {
  method: Method,
  throttle: ThrottleSettings
}

/**
 * Represents the API stages that a usage plan applies to.
 */
export interface UsagePlanPerApiStage {
  api?: IRestApiResource,
  stage?: Stage,
  throttle?: ThrottlingPerMethod[]
}

export interface UsagePlanProps {
  /**
   * API Stages to be associated which the usage plan.
   */
  apiStages?: UsagePlanPerApiStage[],
  /**
   * Represents usage plan purpose.
   */
  description?: string,
  /**
   * Number of requests clients can make in a given time period.
   */
  quota?: QuotaSettings
  /**
   * Overall throttle settings for the API.
   */
  throttle?: ThrottleSettings,
  /**
   * Name for this usage plan.
   */
  name?: string,
}

export class UsagePlan extends cdk.Construct {
  public readonly usagePlanId: string;
  constructor(parent: cdk.Construct, name: string, props?: UsagePlanProps) {
    super(parent, name);
    let resource: cloudformation.UsagePlanResource;
    if (props !== undefined) {
      const overallThrottle: cloudformation.UsagePlanResource.ThrottleSettingsProperty = this.renderThrottle(props.throttle);
      const quota: cloudformation.UsagePlanResource.QuotaSettingsProperty | undefined = this.renderQuota(props);
      const apiStages: cloudformation.UsagePlanResource.ApiStageProperty[] | undefined = this.renderApiStages(props);

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
