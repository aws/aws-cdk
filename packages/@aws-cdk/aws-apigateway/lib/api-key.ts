import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './apigateway.generated';
import { IRestApiResource } from "./resource";
import { RestApi } from './restapi';

export interface ApiKeyProps {
  /**
   * A list of resources this api key is associated with.
   * @default none
   */
  readonly resources?: IRestApiResource[];

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
  readonly generateDistinctIdgenerateDistinctId?: boolean;

  /**
   * A name for the API key.
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-name
   * @default none
   */
  readonly name?: string;
}

/**
 * An API Gateway ApiKey.
 *
 * An ApiKey can be distributed to API clients that are executing requests
 * for Method resources that require an Api Key.
 */
export class ApiKey extends cdk.Construct {
  public readonly keyId: string;

  constructor(parent: cdk.Construct, id: string, props: ApiKeyProps = {}) {
    super(parent, id);

    const customerId = props && props.customerId;
    const description = props && props.description;
    const enabled = props && props.enabled;
    const generateDistinctId = props && props.generateDistinctId;
    const name = props && props.name;
    const stageKeys = this.renderStageKeys(props && props.resources);

    const resource = new cloudformation.ApiKeyResource(this, 'Resource', {
      customerId,
      description,
      enabled,
      generateDistinctId,
      name,
      stageKeys
    });

    this.keyId = resource.ref;
  }

  private renderStageKeys(resources: IRestApiResource[] | undefined): cloudformation.ApiKeyResource.StageKeyProperty[] | undefined {
    if (!resources) {
      return undefined;
    }

    return resources.map((resource: IRestApiResource) => {
      const restApi: RestApi = resource.resourceApi;
      const restApiId = restApi.restApiId;
      const stageName = restApi.deploymentStage!.stageName.toString();
      return { restApiId, stageName };
    });
  }
}
