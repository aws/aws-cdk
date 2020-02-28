import { Construct, IResource as IResourceBase, Resource } from '@aws-cdk/core';
import { ApiKey } from './api-key';
import { ResourceOptions } from "./resource";
import { RestApi } from './restapi';
import { QuotaSettings, ThrottleSettings, UsagePlan, UsagePlanPerApiStage } from './usage-plan';

/**
 * API keys are alphanumeric string values that you distribute to
 * app developer customers to grant access to your API
 */
export interface IRateLimitedApiKey extends IResourceBase {
  /**
   * The API key ID.
   * @attribute
   */
  readonly keyId: string;
}

/**
 * Rate limiting settings for the api key.
 */
export interface RateLimitingSettings {
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
 * RateLimitedApiKey properties.
 */
export interface RateLimitedApiKeyProps extends ResourceOptions {
  /**
   * [disable-awslint:ref-via-interface]
   * A list of resources this api key is associated with.
   *
   * @default none
   */
  readonly resources?: RestApi[];

  /**
   * An AWS Marketplace customer identifier to use when integrating with the AWS SaaS Marketplace.
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-customerid
   * @default none
   */
  readonly customerId?: string;

  /**
   * A description of the purpose of the API key.
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-description
   * @default none
   */
  readonly description?: string;

  /**
   * Indicates whether the API key can be used by clients.
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-enabled
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * Specifies whether the key identifier is distinct from the created API key value.
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-generatedistinctid
   * @default false
   */
  readonly generateDistinctId?: boolean;

  /**
   * A name for the API key. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the API key name.
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-name
   * @default automically generated name
   */
  readonly apiKeyName?: string;

  /**
   * Rate limiting settings to be used for this api key.
   * @default none
   */
  readonly rateLimitingSettings?: RateLimitingSettings;
}

/**
 * An API Gateway ApiKey, for which a rate limiting configuration can be specified.
 *
 * @resource AWS::ApiGateway::ApiKey
 */
export class RateLimitedApiKey extends Resource implements IRateLimitedApiKey {
  public readonly keyId: string;

  constructor(scope: Construct, id: string, props: RateLimitedApiKeyProps = { }) {
    super(scope, id, {
      physicalName: props.apiKeyName,
    });

    const resource = new ApiKey(this, 'Resource', {
      apiKeyName: props.apiKeyName,
      customerId: props.customerId,
      defaultCorsPreflightOptions: props.defaultCorsPreflightOptions,
      defaultIntegration: props.defaultIntegration,
      defaultMethodOptions: props.defaultMethodOptions,
      description: props.description,
      enabled: props.enabled,
      generateDistinctId: props.generateDistinctId,
      resources: props.resources
    });

    if (props.rateLimitingSettings) {
      new UsagePlan(this, 'UsagePlanResource', {
        apiKey: resource,
        apiStages: props.rateLimitingSettings.apiStages,
        quota: props.rateLimitingSettings.quota,
        throttle: props.rateLimitingSettings.throttle
      });
    }

    this.keyId = resource.keyId;
  }
}