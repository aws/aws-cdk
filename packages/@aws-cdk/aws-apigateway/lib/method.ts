import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './apigateway.generated';
import { Integration } from './integration';
import { MockIntegration } from './integrations/mock';
import { IRestApiResource } from './resource';
import { RestApi } from './restapi';
import { validateHttpMethod } from './util';

export interface MethodOptions {
  /**
   * A friendly operation name for the method. For example, you can assign the
   * OperationName of ListPets for the GET /pets method.
   */
  operationName?: string;

  /**
   * Method authorization.
   * @default None open access
   */
  authorizationType?: AuthorizationType;

  /**
   * If `authorizationType` is `Custom`, this specifies the ID of the method
   * authorizer resource.
   *
   * NOTE: in the future this will be replaced with an `AuthorizerRef`
   * construct.
   */
  authorizerId?: string;

  /**
   * Indicates whether the method requires clients to submit a valid API key.
   * @default false
   */
  apiKeyRequired?: boolean;

  // TODO:
  // - RequestValidatorId
  // - RequestModels
  // - RequestParameters
  // - MethodResponses
}

export interface MethodProps {
  /**
   * The resource this method is associated with. For root resource methods,
   * specify the `RestApi` object.
   */
  resource: IRestApiResource;

  /**
   * The HTTP method ("GET", "POST", "PUT", ...) that clients use to call this method.
   */
  httpMethod: string;

  /**
   * The backend system that the method calls when it receives a request.
   */
  integration?: Integration;

  /**
   * Method options.
   */
  options?: MethodOptions;
}

export class Method extends cdk.Construct {
  public readonly methodId: string;
  public readonly httpMethod: string;
  public readonly resource: IRestApiResource;
  public readonly restApi: RestApi;

  constructor(parent: cdk.Construct, id: string, props: MethodProps) {
    super(parent, id);

    this.resource = props.resource;
    this.restApi = props.resource.resourceApi;
    this.httpMethod = props.httpMethod;

    validateHttpMethod(this.httpMethod);

    const options = props.options || { };

    const defaultMethodOptions = props.resource.defaultMethodOptions || {};

    const methodProps: cloudformation.MethodResourceProps = {
      resourceId: props.resource.resourceId,
      restApiId: this.restApi.restApiId,
      httpMethod: props.httpMethod,
      operationName: options.operationName || defaultMethodOptions.operationName,
      apiKeyRequired: options.apiKeyRequired || defaultMethodOptions.apiKeyRequired,
      authorizationType: options.authorizationType || defaultMethodOptions.authorizationType || AuthorizationType.None,
      authorizerId: options.authorizerId || defaultMethodOptions.authorizerId,
      integration: this.renderIntegration(props.integration)
    };

    const resource = new cloudformation.MethodResource(this, 'Resource', methodProps);

    this.methodId = resource.ref;

    props.resource.resourceApi._attachMethod(this);

    const deployment = props.resource.resourceApi.latestDeployment;
    if (deployment) {
      deployment.addDependency(resource);
      deployment.addToLogicalId({ method: methodProps });
    }
  }

  /**
   * Returns an execute-api ARN for this method:
   *
   *   arn:aws:execute-api:{region}:{account}:{restApiId}/{stage}/{method}/{path}
   *
   * NOTE: {stage} will refer to the `restApi.deploymentStage`, which will
   * automatically set if auto-deploy is enabled.
   */
  public get methodArn(): string {
    if (!this.restApi.deploymentStage) {
      throw new Error('There is no stage associated with this restApi. Either use `autoDeploy` or explicitly assign `deploymentStage`');
    }

    const stage = this.restApi.deploymentStage.stageName.toString();
    return this.restApi.executeApiArn(this.httpMethod, this.resource.resourcePath, stage);
  }

  /**
   * Returns an execute-api ARN for this method's "test-invoke-stage" stage.
   * This stage is used by the AWS Console UI when testing the method.
   */
  public get testMethodArn(): string {
    return this.restApi.executeApiArn(this.httpMethod, this.resource.resourcePath, 'test-invoke-stage');
  }

  private renderIntegration(integration?: Integration): cloudformation.MethodResource.IntegrationProperty {
    if (!integration) {
      // use defaultIntegration from API if defined
      if (this.resource.defaultIntegration) {
        return this.renderIntegration(this.resource.defaultIntegration);
      }

      // fallback to mock
      return this.renderIntegration(new MockIntegration());
    }

    integration.bind(this);

    const options = integration.props.options || { };

    let credentials;
    if (options.credentialsPassthrough !== undefined && options.credentialsRole !== undefined) {
      throw new Error(`'credentialsPassthrough' and 'credentialsRole' are mutually exclusive`);
    }

    if (options.credentialsRole) {
      credentials = options.credentialsRole.roleArn;
    } else if (options.credentialsPassthrough) {
      // arn:aws:iam::*:user/*
      credentials = cdk.ArnUtils.fromComponents({ service: 'iam', region: '', account: '*', resource: 'user', sep: '/', resourceName: '*' });
    }

    return {
      type: integration.props.type,
      uri: integration.props.uri,
      cacheKeyParameters: options.cacheKeyParameters,
      cacheNamespace: options.cacheNamespace,
      contentHandling: options.contentHandling,
      integrationHttpMethod: integration.props.integrationHttpMethod,
      requestParameters: options.requestParameters,
      requestTemplates: options.requestTemplates,
      passthroughBehavior: options.passthroughBehavior,
      integrationResponses: options.integrationResponses,
      credentials,
    };
  }
}

export enum AuthorizationType {
  /**
   * Open access.
   */
  None = 'NONE',

  /**
   * Use AWS IAM permissions.
   */
  IAM = 'AWS_IAM',

  /**
   * Use a custom authorizer.
   */
  Custom = 'CUSTOM',

  /**
   * Use an AWS Cognito user pool.
   */
  Cognito = 'COGNITO_USER_POOLS',
}
