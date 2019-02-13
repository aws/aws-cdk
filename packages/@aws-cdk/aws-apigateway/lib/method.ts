import cdk = require('@aws-cdk/cdk');
import { CfnMethod, CfnMethodProps } from './apigateway.generated';
import { ConnectionType, Integration } from './integration';
import { MockIntegration } from './integrations/mock';
import { MethodResponse } from './methodresponse';
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
   * NOTE: in the future this will be replaced with an `IAuthorizer`
   * construct.
   */
  authorizerId?: string;

  /**
   * Indicates whether the method requires clients to submit a valid API key.
   * @default false
   */
  apiKeyRequired?: boolean;

  /**
   * The responses that can be sent to the client who calls the method.
   * @default None
   *
   * This property is not required, but if these are not supplied for a Lambda
   * proxy integration, the Lambda function must return a value of the correct format,
   * for the integration response to be correctly mapped to a response to the client.
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-method-settings-method-response.html
   */
  methodResponses?: MethodResponse[]

  /**
   * The request parameters that API Gateway accepts. Specify request parameters
   * as key-value pairs (string-to-Boolean mapping), with a source as the key and
   * a Boolean as the value. The Boolean specifies whether a parameter is required.
   * A source must match the format method.request.location.name, where the location
   * is querystring, path, or header, and name is a valid, unique parameter name.
   * @default None
   */
  requestParameters?: { [param: string]: boolean };

  // TODO:
  // - RequestValidatorId
  // - RequestModels
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

  constructor(scope: cdk.Construct, id: string, props: MethodProps) {
    super(scope, id);

    this.resource = props.resource;
    this.restApi = props.resource.resourceApi;
    this.httpMethod = props.httpMethod.toUpperCase();

    validateHttpMethod(this.httpMethod);

    const options = props.options || { };

    const defaultMethodOptions = props.resource.defaultMethodOptions || {};

    const methodProps: CfnMethodProps = {
      resourceId: props.resource.resourceId,
      restApiId: this.restApi.restApiId,
      httpMethod: this.httpMethod,
      operationName: options.operationName || defaultMethodOptions.operationName,
      apiKeyRequired: options.apiKeyRequired || defaultMethodOptions.apiKeyRequired,
      authorizationType: options.authorizationType || defaultMethodOptions.authorizationType || AuthorizationType.None,
      authorizerId: options.authorizerId || defaultMethodOptions.authorizerId,
      requestParameters: options.requestParameters,
      integration: this.renderIntegration(props.integration),
      methodResponses: this.renderMethodResponses(options.methodResponses),
    };

    const resource = new CfnMethod(this, 'Resource', methodProps);

    this.methodId = resource.ref;

    props.resource.resourceApi._attachMethod(this);

    const deployment = props.resource.resourceApi.latestDeployment;
    if (deployment) {
      deployment.node.addDependency(resource);
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
      throw new Error(
        `Unable to determine ARN for method "${this.node.id}" since there is no stage associated with this API.\n` +
        'Either use the `deploy` prop or explicitly assign `deploymentStage` on the RestApi');
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

  private renderIntegration(integration?: Integration): CfnMethod.IntegrationProperty {
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

    if (options.connectionType === ConnectionType.VpcLink && options.vpcLink === undefined) {
      throw new Error(`'connectionType' of VPC_LINK requires 'vpcLink' prop to be set`);
    }

    if (options.connectionType === ConnectionType.Internet && options.vpcLink !== undefined) {
      throw new Error(`cannot set 'vpcLink' where 'connectionType' is INTERNET`);
    }

    if (options.credentialsRole) {
      credentials = options.credentialsRole.roleArn;
    } else if (options.credentialsPassthrough) {
      // arn:aws:iam::*:user/*
      // tslint:disable-next-line:max-line-length
      credentials = cdk.Stack.find(this).formatArn({ service: 'iam', region: '', account: '*', resource: 'user', sep: '/', resourceName: '*' });
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
      connectionType: options.connectionType,
      connectionId: options.vpcLink ? options.vpcLink.vpcLinkId : undefined,
      credentials,
    };
  }

  private renderMethodResponses(methodResponses: MethodResponse[] | undefined): CfnMethod.MethodResponseProperty[] | undefined {
    if (!methodResponses) {
      // Fall back to nothing
      return undefined;
    }

    return methodResponses.map(mr => {
      let responseModels: {[contentType: string]: string} | undefined;

      if (mr.responseModels) {
        responseModels = {};
        for (const contentType in mr.responseModels) {
          if (mr.responseModels.hasOwnProperty(contentType)) {
            responseModels[contentType] = mr.responseModels[contentType].modelId;
          }
        }
      }

      const methodResponseProp = {
        statusCode: mr.statusCode,
        responseParameters: mr.responseParameters,
        responseModels,
      };

      return methodResponseProp;
    });
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
