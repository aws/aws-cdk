import { Construct, IResource as IResourceBase, Resource } from '@aws-cdk/core';
import { CfnApiKey } from './apigateway.generated';
import { ResourceOptions } from './resource';
import { RestApi } from './restapi';

/**
 * API keys are alphanumeric string values that you distribute to
 * app developer customers to grant access to your API
 */
export interface IApiKey extends IResourceBase {
  /**
   * The API key ID.
   * @attribute
   */
  readonly keyId: string;
}

/**
 * The options for creating an API Key.
 */
export interface ApiKeyOptions extends ResourceOptions {
  /**
   * A name for the API key. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the API key name.
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-name
   * @default automically generated name
   */
  readonly apiKeyName?: string;

  /**
   * The value of the API key. Must be at least 20 characters long.
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-value
   * @default none
   */
  readonly value?: string;
}

/**
 * ApiKey Properties.
 */
export interface ApiKeyProps extends ApiKeyOptions {
  /**
   * [disable-awslint:ref-via-interface]
   * A list of resources this api key is associated with.
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
}

/**
 * An API Gateway ApiKey.
 *
 * An ApiKey can be distributed to API clients that are executing requests
 * for Method resources that require an Api Key.
 */
export class ApiKey extends Resource implements IApiKey {

  /**
   * Import an ApiKey by its Id
   */
  public static fromApiKeyId(scope: Construct, id: string, apiKeyId: string): IApiKey {
    class Import extends Resource implements IApiKey {
      public keyId = apiKeyId;
    }

    return new Import(scope, id);
  }

  public readonly keyId: string;

  constructor(scope: Construct, id: string, props: ApiKeyProps = { }) {
    super(scope, id, {
      physicalName: props.apiKeyName,
    });

    const resource = new CfnApiKey(this, 'Resource', {
      customerId: props.customerId,
      description: props.description,
      enabled: props.enabled || true,
      generateDistinctId: props.generateDistinctId,
      name: this.physicalName,
      stageKeys: this.renderStageKeys(props.resources),
      value: props.value,
    });

    this.keyId = resource.ref;
  }

  private renderStageKeys(resources: RestApi[] | undefined): CfnApiKey.StageKeyProperty[] | undefined {
    if (!resources) {
      return undefined;
    }

    return resources.map((resource: RestApi) => {
      const restApi = resource;
      const restApiId = restApi.restApiId;
      const stageName = restApi.deploymentStage!.stageName.toString();
      return { restApiId, stageName };
    });
  }
}
