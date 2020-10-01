import * as iam from '@aws-cdk/aws-iam';
import { IResource as IResourceBase, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
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

  /**
   * The API key ARN.
   * @attribute
   */
  readonly keyArn: string;
}

/**
 * Represents props that all Api Keys share
 */
export interface ApiKeyBaseProps {
  /**
   * A name for the API key. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the API key name.
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-apikey.html#cfn-apigateway-apikey-name
   * @default automically generated name
   */
  readonly apiKeyName?: string;
}


/**
 * The options for creating an API Key.
 */
export interface ApiKeyOptions extends ApiKeyBaseProps, ResourceOptions {
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
 * Base implementation that is common to the various implementations of IApiKey
 */
export abstract class ApiKeyBase extends Resource implements IApiKey {
  public abstract readonly keyId: string;
  public abstract readonly keyArn: string;

  constructor(scope: Construct, id: string, props: ApiKeyBaseProps = {}) {
    super(scope, id, {
      physicalName: props.apiKeyName,
    });
  }

  /**
   * Permits the IAM principal all read operations through this key
   *
   * @param grantee The principal to grant access to
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: readPermissions,
      resourceArns: [this.keyArn],
    });
  }

  /**
   * Permits the IAM principal all write operations through this key
   *
   * @param grantee The principal to grant access to
   */
  public grantWrite(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: writePermissions,
      resourceArns: [this.keyArn],
    });
  }

  /**
   * Permits the IAM principal all read and write operations through this key
   *
   * @param grantee The principal to grant access to
   */
  public grantReadWrite(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: [...readPermissions, ...writePermissions],
      resourceArns: [this.keyArn],
    });
  }
}

/**
 * An API Gateway ApiKey.
 *
 * An ApiKey can be distributed to API clients that are executing requests
 * for Method resources that require an Api Key.
 */
export class ApiKey extends ApiKeyBase {

  /**
   * Import an ApiKey by its Id
   */
  public static fromApiKeyId(scope: Construct, id: string, apiKeyId: string): IApiKey {
    class Import extends ApiKeyBase {
      public keyId = apiKeyId;
      public keyArn = Stack.of(this).formatArn({
        service: 'apigateway',
        account: '',
        resource: '/apikeys',
        sep: '/',
        resourceName: apiKeyId,
      });
    }

    return new Import(scope, id);
  }

  public readonly keyId: string;
  public readonly keyArn: string;

  constructor(scope: Construct, id: string, props: ApiKeyProps = { }) {
    super(scope, id, {
      apiKeyName: props.apiKeyName,
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
    this.keyArn = Stack.of(this).formatArn({
      service: 'apigateway',
      account: '',
      resource: '/apikeys',
      sep: '/',
      resourceName: this.keyId,
    });
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

const readPermissions = [
  'apigateway:GET',
];

const writePermissions = [
  'apigateway:POST',
  'apigateway:PUT',
  'apigateway:PATCH',
  'apigateway:DELETE',
];