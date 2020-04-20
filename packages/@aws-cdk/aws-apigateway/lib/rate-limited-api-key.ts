import { Construct, Resource } from '@aws-cdk/core';
import { ApiKey, ApiKeyProps, IApiKey } from './api-key';
import { QuotaSettings, ThrottleSettings, UsagePlan, UsagePlanPerApiStage } from './usage-plan';

/**
 * RateLimitedApiKey properties.
 */
export interface RateLimitedApiKeyProps extends ApiKeyProps {
  /**
   * API Stages to be associated with the RateLimitedApiKey.
   * @default none
   */
  readonly apiStages?: UsagePlanPerApiStage[];

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
}

/**
 * An API Gateway ApiKey, for which a rate limiting configuration can be specified.
 *
 * @resource AWS::ApiGateway::ApiKey
 */
export class RateLimitedApiKey extends Resource implements IApiKey {
  public readonly keyId: string;

  constructor(scope: Construct, id: string, props: RateLimitedApiKeyProps = { }) {
    super(scope, id, {
      physicalName: props.apiKeyName,
    });

    const resource = new ApiKey(this, 'Resource', props);

    if (props.apiStages || props.quota || props.throttle) {
      new UsagePlan(this, 'UsagePlanResource', {
        apiKey: resource,
        apiStages: props.apiStages,
        quota: props.quota,
        throttle: props.throttle,
      });
    }

    this.keyId = resource.keyId;
  }
}
