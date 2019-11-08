import { Construct, Resource, Stack } from '@aws-cdk/core';
import { CfnMethod, CfnMethodProps } from './apigateway.generated';
import { CustomAuthorizer, IAuthorizer } from './authorizer';
import { ConnectionType, Integration } from './integration';
import { MockIntegration } from './integrations/mock';
import { MethodResponse } from './methodresponse';
import { IModel } from './model';
import { IRequestValidator } from './requestvalidator';
import { IResource } from './resource';
import { RestApi } from './restapi';
import { validateHttpMethod } from './util';

export interface MethodOptions {
  /**
   * A friendly operation name for the method. For example, you can assign the
   * OperationName of ListPets for the GET /pets method.
   */
  readonly operationName?: string;

  /**
   * Method authorization.
   * If the value is set of `Custom`, an `authorizer` must also be specified.
   * @default None open access
   */
  readonly authorizationType?: AuthorizationType;

  /**
   * If `authorizationType` is `Custom`, this specifies the ID of the method
   * authorizer resource.
   * If specified, the value of `authorizationType` must be set to `Custom`
   */
  readonly authorizer?: IAuthorizer;

  /**
   * Indicates whether the method requires clients to submit a valid API key.
   * @default false
   */
  readonly apiKeyRequired?: boolean;

  /**
   * The responses that can be sent to the client who calls the method.
   * @default None
   *
   * This property is not required, but if these are not supplied for a Lambda
   * proxy integration, the Lambda function must return a value of the correct format,
   * for the integration response to be correctly mapped to a response to the client.
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-method-settings-method-response.html
   */
  readonly methodResponses?: MethodResponse[]

  /**
   * The request parameters that API Gateway accepts. Specify request parameters
   * as key-value pairs (string-to-Boolean mapping), with a source as the key and
   * a Boolean as the value. The Boolean specifies whether a parameter is required.
   * A source must match the format method.request.location.name, where the location
   * is querystring, path, or header, and name is a valid, unique parameter name.
   * @default None
   */
  readonly requestParameters?: { [param: string]: boolean };

  /**
   * The resources that are used for the response's content type. Specify request
   * models as key-value pairs (string-to-string mapping), with a content type
   * as the key and a Model resource name as the value
   */
  readonly requestModels?: { [param: string]: IModel };

  /**
   * The ID of the associated request validator.
   */
  readonly requestValidator?: IRequestValidator;
}

export interface MethodProps {
  /**
   * The resource this method is associated with. For root resource methods,
   * specify the `RestApi` object.
   */
  readonly resource: IResource;

  /**
   * The HTTP method ("GET", "POST", "PUT", ...) that clients use to call this method.
   */
  readonly httpMethod: string;

  /**
   * The backend system that the method calls when it receives a request.
   *
   * @default - a new `MockIntegration`.
   */
  readonly integration?: Integration;

  /**
   * Method options.
   *
   * @default - No options.
   */
  readonly options?: MethodOptions;
}

export class Method extends Resource {
  /** @attribute */
  public readonly methodId: string;

  public readonly httpMethod: string;
  public readonly resource: IResource;
  public readonly restApi: RestApi;

  constructor(scope: Construct, id: string, props: MethodProps) {
    super(scope, id);

    this.resource = props.resource;
    this.restApi = props.resource.restApi;
    this.httpMethod = props.httpMethod.toUpperCase();

    validateHttpMethod(this.httpMethod);

    const options = props.options || {};

    const defaultMethodOptions = props.resource.defaultMethodOptions || {};
    const authorizer = options.authorizer || defaultMethodOptions.authorizer;
    const authorizationType = options.authorizationType || defaultMethodOptions.authorizationType || AuthorizationType.NONE;

    if (authorizer && authorizationType !== AuthorizationType.CUSTOM) {
      throw new Error(`${this.resource}/${this.httpMethod} - Authorization type is not set to 'CUSTOM' when an authorizer is specified`);
    }
    if (!authorizer && authorizationType === AuthorizationType.CUSTOM) {
      throw new Error(`${this.resource}/${this.httpMethod} - Authorizer is not specified when the authorization type is set to 'CUSTOM'`);
    }

    if (CustomAuthorizer.isCustomAuthorizer(authorizer)) {
      authorizer.restApi = this.restApi;
    }

    const methodProps: CfnMethodProps = {
      resourceId: props.resource.resourceId,
      restApiId: this.restApi.restApiId,
      httpMethod: this.httpMethod,
      operationName: options.operationName || defaultMethodOptions.operationName,
      apiKeyRequired: options.apiKeyRequired || defaultMethodOptions.apiKeyRequired,
      authorizationType,
      authorizerId: authorizer && authorizer.authorizerId,
      requestParameters: options.requestParameters || defaultMethodOptions.requestParameters,
      integration: this.renderIntegration(props.integration),
      methodResponses: this.renderMethodResponses(options.methodResponses),
      requestModels: this.renderRequestModels(options.requestModels),
      requestValidatorId: options.requestValidator ? options.requestValidator.requestValidatorId : undefined
    };

    const resource = new CfnMethod(this, 'Resource', methodProps);

    this.methodId = resource.ref;

    props.resource.restApi._attachMethod(this);

    const deployment = props.resource.restApi.latestDeployment;
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
   *
   * @attribute
   */
  public get methodArn(): string {
    if (!this.restApi.deploymentStage) {
      throw new Error(
        `Unable to determine ARN for method "${this.node.id}" since there is no stage associated with this API.\n` +
        'Either use the `deploy` prop or explicitly assign `deploymentStage` on the RestApi');
    }

    const stage = this.restApi.deploymentStage.stageName.toString();
    return this.restApi.arnForExecuteApi(this.httpMethod, this.resource.path, stage);
  }

  /**
   * Returns an execute-api ARN for this method's "test-invoke-stage" stage.
   * This stage is used by the AWS Console UI when testing the method.
   */
  public get testMethodArn(): string {
    return this.restApi.arnForExecuteApi(this.httpMethod, this.resource.path, 'test-invoke-stage');
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

    const options = integration._props.options || { };

    let credentials;
    if (options.credentialsPassthrough !== undefined && options.credentialsRole !== undefined) {
      throw new Error(`'credentialsPassthrough' and 'credentialsRole' are mutually exclusive`);
    }

    if (options.connectionType === ConnectionType.VPC_LINK && options.vpcLink === undefined) {
      throw new Error(`'connectionType' of VPC_LINK requires 'vpcLink' prop to be set`);
    }

    if (options.connectionType === ConnectionType.INTERNET && options.vpcLink !== undefined) {
      throw new Error(`cannot set 'vpcLink' where 'connectionType' is INTERNET`);
    }

    if (options.credentialsRole) {
      credentials = options.credentialsRole.roleArn;
    } else if (options.credentialsPassthrough) {
      // arn:aws:iam::*:user/*
      // tslint:disable-next-line:max-line-length
      credentials = Stack.of(this).formatArn({ service: 'iam', region: '', account: '*', resource: 'user', sep: '/', resourceName: '*' });
    }

    return {
      type: integration._props.type,
      uri: integration._props.uri,
      cacheKeyParameters: options.cacheKeyParameters,
      cacheNamespace: options.cacheNamespace,
      contentHandling: options.contentHandling,
      integrationHttpMethod: integration._props.integrationHttpMethod,
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

  private renderRequestModels(requestModels: { [param: string]: IModel } | undefined): { [param: string]: string } | undefined {
    if (!requestModels) {
      // Fall back to nothing
      return undefined;
    }

    const models: {[param: string]: string} = {};
    for (const contentType in requestModels) {
      if (requestModels.hasOwnProperty(contentType)) {
          models[contentType] = requestModels[contentType].modelId;
      }
    }

    return models;
  }
}

export enum AuthorizationType {
  /**
   * Open access.
   */
  NONE = 'NONE',

  /**
   * Use AWS IAM permissions.
   */
  IAM = 'AWS_IAM',

  /**
   * Use a custom authorizer.
   */
  CUSTOM = 'CUSTOM',

  /**
   * Use an AWS Cognito user pool.
   */
  COGNITO = 'COGNITO_USER_POOLS',
}
