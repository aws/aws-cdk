import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './apigateway.generated';
import { Deployment } from './deployment';
import { Integration } from './integration';
import { Method, MethodOptions } from './method';
import { IRestApiResource, Resource, ResourceOptions } from './resource';
import { RestApiRef } from './restapi-ref';
import { Stage, StageOptions } from './stage';

export interface RestApiProps extends ResourceOptions {
  /**
   * Indicates if a Deployment should be automatically created for this API,
   * and recreated when the API model (resources, methods) changes.
   *
   * Since API Gateway deployments are immutable, When this option is enabled
   * (by default), an AWS::ApiGateway::Deployment resource will automatically
   * created with a logical ID that hashes the API model (methods, resources
   * and options). This means that when the model changes, the logical ID of
   * this CloudFormation resource will change, and a new deployment will be
   * created.
   *
   * If this is set, `latestDeployment` will refer to the `Deployment` object
   * and `deploymentStage` will refer to a `Stage` that points to this
   * deployment. To customize the stage options, use the `deployStageOptions`
   * property.
   *
   * A CloudFormation Output will also be defined with the root URL endpoint
   * of this REST API.
   *
   * @default true
   */
  deploy?: boolean;

  /**
   * Options for the API Gateway stage that will always point to the latest
   * deployment when `deploy` is enabled. If `deploy` is disabled,
   * this value cannot be set.
   *
   * @default defaults based on defaults of `StageOptions`
   */
  deployOptions?: StageOptions;

  /**
   * Retains old deployment resources when the API changes. This allows
   * manually reverting stages to point to old deployments via the AWS
   * Console.
   *
   * @default false
   */
  retainDeployments?: boolean;

  /**
   * A name for the API Gateway RestApi resource.
   *
   * @default construct-id defaults to the id of the RestApi construct
   */
  restApiName?: string;

  /**
   * Custom header parameters for the request.
   * @see https://docs.aws.amazon.com/cli/latest/reference/apigateway/import-rest-api.html
   */
  parameters?: { [key: string]: string };

  /**
   * A policy document that contains the permissions for this RestApi
   */
  policy?: cdk.PolicyDocument;

  /**
   * A description of the purpose of this API Gateway RestApi resource.
   * @default No description
   */
  description?: string;

  /**
   * The source of the API key for metering requests according to a usage
   * plan.
   * @default undefined metering is disabled
   */
  apiKeySourceType?: ApiKeySourceType;

  /**
   * The list of binary media mine-types that are supported by the RestApi
   * resource, such as "image/png" or "application/octet-stream"
   *
   * @default By default, RestApi supports only UTF-8-encoded text payloads
   */
  binaryMediaTypes?: string[];

  /**
   * A list of the endpoint types of the API. Use this property when creating
   * an API.
   */
  endpointTypes?: EndpointType[];

  /**
   * Indicates whether to roll back the resource if a warning occurs while API
   * Gateway is creating the RestApi resource.
   *
   * @default false
   */
  failOnWarnings?: boolean;

  /**
   * A nullable integer that is used to enable compression (with non-negative
   * between 0 and 10485760 (10M) bytes, inclusive) or disable compression
   * (when undefined) on an API. When compression is enabled, compression or
   * decompression is not applied on the payload if the payload size is
   * smaller than this value. Setting it to zero allows compression for any
   * payload size.
   *
   * @default undefined compression is disabled
   */
  minimumCompressionSize?: number;

  /**
   * The ID of the API Gateway RestApi resource that you want to clone.
   */
  cloneFrom?: RestApiRef;

  /**
   * Automatically configure an AWS CloudWatch role for API Gateway.
   * @default true
   */
  cloudWatchRole?: boolean;
}

/**
 * Represents a REST API in Amazon API Gateway.
 *
 * Use `addResource` and `addMethod` to configure the API model.
 *
 * By default, the API will automatically be deployed and accessible from a
 * public endpoint.
 */
export class RestApi extends RestApiRef implements cdk.IDependable {
  /**
   * The ID of this API Gateway RestApi.
   */
  public readonly restApiId: string;

  /**
   * API Gateway deployment that represents the latest changes of the API.
   * This resource will be automatically updated every time the REST API model changes.
   * This will be undefined if `deploy` is false.
   */
  public latestDeployment?: Deployment;

  /**
   * Allows taking a dependency on this construct.
   */
  public readonly dependencyElements = new Array<cdk.IDependable>();

  /**
   * API Gateway stage that points to the latest deployment (if defined).
   *
   * If `deploy` is disabled, you will need to explicitly assign this value in order to
   * set up integrations.
   */
  public deploymentStage?: Stage;

  /**
   * Represents the root resource ("/") of this API. Use it to define the API model:
   *
   *    api.root.addMethod('ANY', redirectToHomePage); // "ANY /"
   *    api.root.addResource('friends').addMethod('GET', getFriendsHandler); // "GET /friends"
   *
   */
  public readonly root: IRestApiResource;

  private readonly methods = new Array<Method>();

  constructor(parent: cdk.Construct, id: string, props: RestApiProps = { }) {
    super(parent, id);

    const resource = new cloudformation.RestApiResource(this, 'Resource', {
      restApiName: props.restApiName || id,
      description: props.description,
      policy: props.policy,
      failOnWarnings: props.failOnWarnings,
      minimumCompressionSize: props.minimumCompressionSize,
      binaryMediaTypes: props.binaryMediaTypes,
      endpointConfiguration: props.endpointTypes ? { types: props.endpointTypes } : undefined,
      apiKeySourceType: props.apiKeySourceType,
      cloneFrom: props.cloneFrom ? props.cloneFrom.restApiId : undefined,
      parameters: props.parameters,
    });

    this.restApiId = resource.ref;

    this.configureDeployment(props);

    const cloudWatchRole = props.cloudWatchRole !== undefined ? props.cloudWatchRole : true;
    if (cloudWatchRole) {
      this.configureCloudWatchRole(resource);
    }

    this.dependencyElements.push(resource);
    if (this.latestDeployment) {
      this.dependencyElements.push(this.latestDeployment);
    }
    if (this.deploymentStage) {
      this.dependencyElements.push(this.deploymentStage);
    }

    // configure the "root" resource
    this.root = {
      addResource: (pathPart: string, options?: ResourceOptions) => {
        return new Resource(this, pathPart, { parent: this.root, pathPart, ...options });
      },
      addMethod: (httpMethod: string, integration?: Integration, options?: MethodOptions) => {
        return new Method(this, httpMethod, { resource: this.root, httpMethod, integration, options });
      },
      defaultIntegration: props.defaultIntegration,
      defaultMethodOptions: props.defaultMethodOptions,
      resourceApi: this,
      resourceId: resource.restApiRootResourceId,
      resourcePath: '/'
    };
  }

  /**
   * The deployed root URL of this REST API.
   */
  public get url() {
    return this.urlForPath();
  }

  /**
   * Returns the URL for an HTTP path.
   *
   * Fails if `deploymentStage` is not set either by `deploy` or explicitly.
   */
  public urlForPath(path: string = '/'): string {
    if (!this.deploymentStage) {
      throw new Error('Cannot determine deployment stage for API from "deploymentStage". Use "deploy" or explicitly set "deploymentStage"');
    }

    return this.deploymentStage.urlForPath(path);
  }

  /**
   * @returns The "execute-api" ARN.
   * @default "*" returns the execute API ARN for all methods/resources in
   * this API.
   * @param method The method (default `*`)
   * @param path The resource path. Must start with '/' (default `*`)
   * @param stage The stage (default `*`)
   */
  public executeApiArn(method: string = '*', path: string = '/*', stage: string = '*') {
    if (!path.startsWith('/')) {
      throw new Error(`"path" must begin with a "/": '${path}'`);
    }

    if (method.toUpperCase() === 'ANY') {
      method = '*';
    }

    return cdk.ArnUtils.fromComponents({
      service: 'execute-api',
      resource: this.restApiId,
      sep: '/',
      resourceName: `${stage}/${method}${path}`
    });
  }

  /**
   * Performs validation of the REST API.
   */
  public validate() {
    if (this.methods.length === 0) {
      return [ `The REST API doesn't contain any methods` ];
    }

    return [];
  }

  /**
   * Internal API used by `Method` to keep an inventory of methods at the API
   * level for validation purposes.
   */
  public _attachMethod(method: Method) {
    this.methods.push(method);
  }

  private configureDeployment(props: RestApiProps) {
    const deploy = props.deploy === undefined ? true : props.deploy;
    if (deploy) {

      this.latestDeployment = new Deployment(this, 'Deployment', {
        description: 'Automatically created by the RestApi construct',
        api: this,
        retainDeployments: props.retainDeployments
      });

      // encode the stage name into the construct id, so if we change the stage name, it will recreate a new stage.
      // stage name is part of the endpoint, so that makes sense.
      const stageName = (props.deployOptions && props.deployOptions.stageName) || 'prod';

      this.deploymentStage = new Stage(this, `DeploymentStage.${stageName}`, {
        deployment: this.latestDeployment,
        ...props.deployOptions
      });

      new cdk.Output(this, 'Endpoint', { value: this.urlForPath() });
    } else {
      if (props.deployOptions) {
        throw new Error(`Cannot set 'deployOptions' if 'deploy' is disabled`);
      }
    }
  }

  private configureCloudWatchRole(apiResource: cloudformation.RestApiResource) {
    const role = new iam.Role(this, 'CloudWatchRole', {
      assumedBy: new cdk.ServicePrincipal('apigateway.amazonaws.com'),
      managedPolicyArns: [ cdk.ArnUtils.fromComponents({
        service: 'iam',
        region: '',
        account: 'aws',
        resource: 'policy',
        sep: '/',
        resourceName: 'service-role/AmazonAPIGatewayPushToCloudWatchLogs'
      }) ]
    });

    const resource = new cloudformation.AccountResource(this, 'Account', {
      cloudWatchRoleArn: role.roleArn
    });

    resource.addDependency(apiResource);
  }
}

export enum ApiKeySourceType {
  /**
   * To read the API key from the `X-API-Key` header of a request.
   */
  Header = 'HEADER',

  /**
   * To read the API key from the `UsageIdentifierKey` from a custom authorizer.
   */
  Authorizer = 'AUTHORIZER',
}

export enum EndpointType {
  /**
   * For an edge-optimized API and its custom domain name.
   */
  Edge = 'EDGE',

  /**
   * For a regional API and its custom domain name.
   */
  Regional = 'REGIONAL',

  /**
   * For a private API and its custom domain name.
   */
  Private = 'PRIVATE'
}

export class RestApiUrl extends cdk.CloudFormationToken { }
