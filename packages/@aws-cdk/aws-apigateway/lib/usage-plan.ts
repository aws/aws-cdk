import { Lazy, Names, Resource, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IApiKey } from './api-key';
import { CfnUsagePlan, CfnUsagePlanKey } from './apigateway.generated';
import { Method } from './method';
import { IRestApi } from './restapi';
import { Stage } from './stage';
import { validateInteger } from './util';

/**
 * Container for defining throttling parameters to API stages or methods.
 * @link https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html
 */
export interface ThrottleSettings {
  /**
   * The API request steady-state rate limit (average requests per second over an extended period of time)
   * @default none
   */
  readonly rateLimit?: number;

  /**
   * The maximum API request rate limit over a time ranging from one to a few seconds.
   * @default none
   */
  readonly burstLimit?: number;
}

/**
 * Time period for which quota settings apply.
 */
export enum Period {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH'
}

/**
 * Specifies the maximum number of requests that clients can make to API Gateway APIs.
 */
export interface QuotaSettings {
  /**
   * The maximum number of requests that users can make within the specified time period.
   * @default none
   */
  readonly limit?: number;

  /**
   * For the initial time period, the number of requests to subtract from the specified limit.
   * @default none
   */
  readonly offset?: number;

  /**
   * The time period for which the maximum limit of requests applies.
   * @default none
   */
  readonly period?: Period;
}

/**
 * Represents per-method throttling for a resource.
 */
export interface ThrottlingPerMethod {
  /**
   * [disable-awslint:ref-via-interface]
   * The method for which you specify the throttling settings.
   * @default none
   */
  readonly method: Method;

  /**
   * Specifies the overall request rate (average requests per second) and burst capacity.
   * @default none
   */
  readonly throttle: ThrottleSettings;
}

/**
 * Type of Usage Plan Key. Currently the only supported type is 'ApiKey'
 */
const enum UsagePlanKeyType {
  API_KEY = 'API_KEY'
}

/**
 * Represents the API stages that a usage plan applies to.
 */
export interface UsagePlanPerApiStage {

  /**
   * @default none
   */
  readonly api?: IRestApi;

  /**
   *
   * [disable-awslint:ref-via-interface]
   * @default none
   */
  readonly stage?: Stage;

  /**
   * @default none
   */
  readonly throttle?: ThrottlingPerMethod[];
}

export interface UsagePlanProps {
  /**
   * API Stages to be associated with the usage plan.
   * @default none
   */
  readonly apiStages?: UsagePlanPerApiStage[];

  /**
   * Represents usage plan purpose.
   * @default none
   */
  readonly description?: string;

  /**
   * Number of requests clients can make in a given time period.
   * @default none
   */
  readonly quota?: QuotaSettings;

  /**
   * Overall throttle settings for the API.
   * @default none
   */
  readonly throttle?: ThrottleSettings;

  /**
   * Name for this usage plan.
   * @default none
   */
  readonly name?: string;

  /**
   * ApiKey to be associated with the usage plan.
   * @default none
   */
  readonly apiKey?: IApiKey;
}

export class UsagePlan extends Resource {
  /**
   * @attribute
   */
  public readonly usagePlanId: string;

  private readonly apiStages = new Array<UsagePlanPerApiStage>();

  constructor(scope: Construct, id: string, props: UsagePlanProps = { }) {
    super(scope, id);
    let resource: CfnUsagePlan;

    resource = new CfnUsagePlan(this, 'Resource', {
      apiStages: Lazy.any({ produce: () => this.renderApiStages(this.apiStages) }),
      description: props.description,
      quota: this.renderQuota(props),
      throttle: this.renderThrottle(props.throttle),
      usagePlanName: props.name,
    });

    this.apiStages.push(...(props.apiStages || []));

    this.usagePlanId = resource.ref;

    // Add ApiKey when
    if (props.apiKey) {
      this.addApiKey(props.apiKey);
    }
  }

  /**
   * Adds an ApiKey.
   *
   * @param apiKey
   */
  public addApiKey(apiKey: IApiKey): void {
    const prefix = 'UsagePlanKeyResource';

    // Postfixing apikey id only from the 2nd child, to keep physicalIds of UsagePlanKey for existing CDK apps unmodified.
    const id = this.node.tryFindChild(prefix) ? `${prefix}:${Names.nodeUniqueId(apiKey.node)}` : prefix;

    new CfnUsagePlanKey(this, id, {
      keyId: apiKey.keyId,
      keyType: UsagePlanKeyType.API_KEY,
      usagePlanId: this.usagePlanId,
    });
  }

  /**
   * Adds an apiStage.
   * @param apiStage
   */
  public addApiStage(apiStage: UsagePlanPerApiStage) {
    this.apiStages.push(apiStage);
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
      throttle,
    };
  }

  private renderQuota(props: UsagePlanProps) {
    if (props.quota === undefined) {
      return undefined;
    } else {
      const limit = props.quota ? props.quota.limit : undefined;
      validateInteger(limit, 'Throttle quota limit');
      const ret = {
        limit: limit ? limit : undefined,
        offset: props.quota ? props.quota.offset : undefined,
        period: props.quota ? props.quota.period : undefined,
      };
      return ret;
    }
  }

  private renderThrottle(props: ThrottleSettings | undefined): (CfnUsagePlan.ThrottleSettingsProperty | Token) {
    let ret: CfnUsagePlan.ThrottleSettingsProperty | Token;
    if (props !== undefined) {
      const burstLimit = props.burstLimit;
      validateInteger(burstLimit, 'Throttle burst limit');
      const rateLimit = props.rateLimit;
      validateInteger(rateLimit, 'Throttle rate limit');

      ret = {
        burstLimit: burstLimit,
        rateLimit: rateLimit,
      };
    }
    return ret!;
  }

  private renderThrottlePerMethod(throttlePerMethod?: ThrottlingPerMethod[]) {
    const ret: { [key: string]: (CfnUsagePlan.ThrottleSettingsProperty | Token) } = {};
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
