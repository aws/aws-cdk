import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './apigateway.generated';
import { IRestApiResource } from "./resource";
import { RestApi } from './restapi';

export interface ApiKeyProps {
  /**
   * A list of resources this api key is associated with.
   */
  resources?: IRestApiResource[];
  /**
   * AWS Marketplace customer identifier to distribute this key to.
   */
  customerId?: string;
  /**
   * Purpose of the API Key
   */
  description?: string;
  /**
   * Whether this API Key is enabled for use.
   */
  enabled?: boolean;
  /**
   * Distinguish the key identifier from the key value
   */
  generateDistinctId?: boolean;
  /**
   * Name of the key
   */
  name?: string;
}

/**
 * Creates an API Gateway ApiKey.
 *
 * An ApiKey can be distributed to API clients that are executing requests
 * for Method resources that require an Api Key.
 */
export class ApiKey extends cdk.Construct {
  public readonly keyId: string;
  constructor(parent: cdk.Construct, id: string, props?: ApiKeyProps) {
    super(parent, id);

    const customerId = props ? props!.customerId : undefined;
    const description = props ? props!.description : undefined;
    const enabled = props ? props!.enabled : undefined;
    const generateDistinctId = props ? props!.generateDistinctId : undefined;
    const name = props ? props!.name : undefined;
    const stageKeys = this.renderStageKeys(props ? props!.resources : undefined);

    const apiKeyResourceProps: cloudformation.ApiKeyResourceProps = {
      customerId,
      description,
      enabled,
      generateDistinctId,
      name,
      stageKeys
    };

    const resource: cloudformation.ApiKeyResource = new cloudformation.ApiKeyResource(this, 'Resource', apiKeyResourceProps);

    this.keyId = resource.ref;
  }

  private renderStageKeys(resources: IRestApiResource[] | undefined): cloudformation.ApiKeyResource.StageKeyProperty[] | undefined {
    if (!resources) {
      return undefined;
    }

    const stageKeys = new Array<cloudformation.ApiKeyResource.StageKeyProperty>();
    resources.forEach((resource: IRestApiResource) => {
      const restApi: RestApi = resource.resourceApi;
      const restApiId = restApi.restApiId;
      const stageName = restApi!.deploymentStage!.stageName.toString();
      stageKeys.push({
        restApiId,
        stageName
      });
    });

    return stageKeys;
  }
}
