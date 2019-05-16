import { Construct, Resource } from '@aws-cdk/cdk';
import { CfnApiKey } from './apigateway.generated';
import { ResourceOptions } from "./resource";
import { RestApi } from './restapi';

export interface ApiKeyProps extends ResourceOptions {
  /**
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

  /**
   * A name for the API key. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the API key name.
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-name
   * @default automically generated name
   */
  readonly name?: string;
}

/**
 * An API Gateway ApiKey.
 *
 * An ApiKey can be distributed to API clients that are executing requests
 * for Method resources that require an Api Key.
 */
export class ApiKey extends Resource {
  public readonly keyId: string;

  constructor(scope: Construct, id: string, props: ApiKeyProps = { }) {
    super(scope, id);

    const resource = new CfnApiKey(this, 'Resource', {
      customerId: props.customerId,
      description: props.description,
      enabled: props.enabled || true,
      generateDistinctId: props.generateDistinctId,
      name: props.name,
      stageKeys: this.renderStageKeys(props.resources)
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
