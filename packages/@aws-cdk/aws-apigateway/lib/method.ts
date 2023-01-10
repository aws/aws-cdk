import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { ArnFormat, Lazy, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ApiGatewayMetrics } from './apigateway-canned-metrics.generated';
import { CfnMethod, CfnMethodProps } from './apigateway.generated';
import { Authorizer, IAuthorizer } from './authorizer';
import { Integration, IntegrationConfig } from './integration';
import { MockIntegration } from './integrations/mock';
import { MethodResponse } from './methodresponse';
import { IModel } from './model';
import { IRequestValidator, RequestValidatorOptions } from './requestvalidator';
import { IResource } from './resource';
import { IRestApi, RestApi, RestApiBase } from './restapi';
import { IStage } from './stage';
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
   *
   * If you're using one of the authorizers that are available via the `Authorizer` class, such as `Authorizer#token()`,
   * it is recommended that this option not be specified. The authorizer will take care of setting the correct authorization type.
   * However, specifying an authorization type using this property that conflicts with what is expected by the `Authorizer`
   * will result in an error.
   *
   * @default - open access unless `authorizer` is specified
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
  readonly methodResponses?: MethodResponse[];

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
   * The models which describe data structure of request payload. When
   * combined with `requestValidator` or `requestValidatorOptions`, the service
   * will validate the API request payload before it reaches the API's Integration (including proxies).
   * Specify `requestModels` as key-value pairs, with a content type
   * (e.g. `'application/json'`) as the key and an API Gateway Model as the value.
   *
   * @example
   *
   *     declare const api: apigateway.RestApi;
   *     declare const userLambda: lambda.Function;
   *
   *     const userModel: apigateway.Model = api.addModel('UserModel', {
   *         schema: {
   *             type: apigateway.JsonSchemaType.OBJECT,
   *             properties: {
   *                 userId: {
   *                     type: apigateway.JsonSchemaType.STRING
   *                 },
   *                 name: {
   *                     type: apigateway.JsonSchemaType.STRING
   *                 }
   *             },
   *             required: ['userId']
   *         }
   *     });
   *     api.root.addResource('user').addMethod('POST',
   *         new apigateway.LambdaIntegration(userLambda), {
   *             requestModels: {
   *                 'application/json': userModel
   *             }
   *         }
   *     );
   *
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-method-settings-method-request.html#setup-method-request-model
   */
  readonly requestModels?: { [param: string]: IModel };

  /**
   * The ID of the associated request validator.
   * Only one of `requestValidator` or `requestValidatorOptions` must be specified.
   * Works together with `requestModels` or `requestParameters` to validate
   * the request before it reaches integration like Lambda Proxy Integration.
   * @default - No default validator
   */
  readonly requestValidator?: IRequestValidator;

  /**
   * A list of authorization scopes configured on the method. The scopes are used with
   * a COGNITO_USER_POOLS authorizer to authorize the method invocation.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html#cfn-apigateway-method-authorizationscopes
   * @default - no authorization scopes
   */
  readonly authorizationScopes?: string[];

  /**
   * Request validator options to create new validator
   * Only one of `requestValidator` or `requestValidatorOptions` must be specified.
   * Works together with `requestModels` or `requestParameters` to validate
   * the request before it reaches integration like Lambda Proxy Integration.
   * @default - No default validator
   */
  readonly requestValidatorOptions?: RequestValidatorOptions;
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
  /**
   * The API Gateway RestApi associated with this method.
   */
  public readonly api: IRestApi;

  private methodResponses: MethodResponse[];

  constructor(scope: Construct, id: string, props: MethodProps) {
    super(scope, id);

    this.resource = props.resource;
    this.api = props.resource.api;
    this.httpMethod = props.httpMethod.toUpperCase();

    validateHttpMethod(this.httpMethod);

    const options = props.options || {};

    const defaultMethodOptions = props.resource.defaultMethodOptions || {};
    const authorizer = options.authorizer || defaultMethodOptions.authorizer;
    const authorizerId = authorizer?.authorizerId ? authorizer.authorizerId : undefined;

    const authorizationTypeOption = options.authorizationType || defaultMethodOptions.authorizationType;
    const authorizationType = authorizer?.authorizationType || authorizationTypeOption || AuthorizationType.NONE;

    // if the authorizer defines an authorization type and we also have an explicit option set, check that they are the same
    if (authorizer?.authorizationType && authorizationTypeOption && authorizer?.authorizationType !== authorizationTypeOption) {
      throw new Error(`${this.resource}/${this.httpMethod} - Authorization type is set to ${authorizationTypeOption} ` +
        `which is different from what is required by the authorizer [${authorizer.authorizationType}]`);
    }

    if (Authorizer.isAuthorizer(authorizer)) {
      authorizer._attachToApi(this.api);
    }

    this.methodResponses = options.methodResponses ?? [];

    const integration = props.integration ?? this.resource.defaultIntegration ?? new MockIntegration();
    const bindResult = integration.bind(this);

    const methodProps: CfnMethodProps = {
      resourceId: props.resource.resourceId,
      restApiId: this.api.restApiId,
      httpMethod: this.httpMethod,
      operationName: options.operationName || defaultMethodOptions.operationName,
      apiKeyRequired: options.apiKeyRequired || defaultMethodOptions.apiKeyRequired,
      authorizationType,
      authorizerId,
      requestParameters: options.requestParameters || defaultMethodOptions.requestParameters,
      integration: this.renderIntegration(bindResult),
      methodResponses: Lazy.any({ produce: () => this.renderMethodResponses(this.methodResponses) }, { omitEmptyArray: true }),
      requestModels: this.renderRequestModels(options.requestModels),
      requestValidatorId: this.requestValidatorId(options),
      authorizationScopes: options.authorizationScopes ?? defaultMethodOptions.authorizationScopes,
    };

    const resource = new CfnMethod(this, 'Resource', methodProps);

    this.methodId = resource.ref;

    if (RestApiBase._isRestApiBase(props.resource.api)) {
      props.resource.api._attachMethod(this);
    }

    const deployment = props.resource.api.latestDeployment;
    if (deployment) {
      deployment.node.addDependency(resource);
      deployment.addToLogicalId({
        method: {
          ...methodProps,
          integrationToken: bindResult?.deploymentToken,
        },
      });
    }
  }

  /**
   * The RestApi associated with this Method
   * @deprecated - Throws an error if this Resource is not associated with an instance of `RestApi`. Use `api` instead.
   */
  public get restApi(): RestApi {
    return this.resource.restApi;
  }

  /**
   * Returns an execute-api ARN for this method:
   *
   *   arn:aws:execute-api:{region}:{account}:{restApiId}/{stage}/{method}/{path}
   *
   * NOTE: {stage} will refer to the `restApi.deploymentStage`, which will
   * automatically set if auto-deploy is enabled, or can be explicitly assigned.
   * When not configured, {stage} will be set to '*', as a shorthand for 'all stages'.
   *
   * @attribute
   */
  public get methodArn(): string {
    const stage = this.api.deploymentStage?.stageName;
    return this.api.arnForExecuteApi(this.httpMethod, pathForArn(this.resource.path), stage);
  }

  /**
   * Returns an execute-api ARN for this method's "test-invoke-stage" stage.
   * This stage is used by the AWS Console UI when testing the method.
   */
  public get testMethodArn(): string {
    return this.api.arnForExecuteApi(this.httpMethod, pathForArn(this.resource.path), 'test-invoke-stage');
  }

  /**
   * Add a method response to this method
   */
  public addMethodResponse(methodResponse: MethodResponse): void {
    this.methodResponses.push(methodResponse);
  }

  private renderIntegration(bindResult: IntegrationConfig): CfnMethod.IntegrationProperty {
    const options = bindResult.options ?? {};
    let credentials;
    if (options.credentialsRole) {
      credentials = options.credentialsRole.roleArn;
    } else if (options.credentialsPassthrough) {
      // arn:aws:iam::*:user/*
      // eslint-disable-next-line max-len
      credentials = Stack.of(this).formatArn({ service: 'iam', region: '', account: '*', resource: 'user', arnFormat: ArnFormat.SLASH_RESOURCE_NAME, resourceName: '*' });
    }

    return {
      type: bindResult.type,
      uri: bindResult.uri,
      cacheKeyParameters: options.cacheKeyParameters,
      cacheNamespace: options.cacheNamespace,
      contentHandling: options.contentHandling,
      integrationHttpMethod: bindResult.integrationHttpMethod,
      requestParameters: options.requestParameters,
      requestTemplates: options.requestTemplates,
      passthroughBehavior: options.passthroughBehavior,
      integrationResponses: options.integrationResponses,
      connectionType: options.connectionType,
      connectionId: options.vpcLink ? options.vpcLink.vpcLinkId : undefined,
      credentials,
      timeoutInMillis: options.timeout?.toMilliseconds(),
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

  private requestValidatorId(options: MethodOptions): string | undefined {
    if (options.requestValidator && options.requestValidatorOptions) {
      throw new Error('Only one of \'requestValidator\' or \'requestValidatorOptions\' must be specified.');
    }

    if (options.requestValidatorOptions) {
      const validator = (this.api as RestApi).addRequestValidator('validator', options.requestValidatorOptions);
      return validator.requestValidatorId;
    }

    // For backward compatibility
    return options.requestValidator?.requestValidatorId;
  }

  /**
   * Returns the given named metric for this API method
   */
  public metric(metricName: string, stage: IStage, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/ApiGateway',
      metricName,
      dimensionsMap: { ApiName: this.api.restApiName, Method: this.httpMethod, Resource: this.resource.path, Stage: stage.stageName },
      ...props,
    }).attachTo(this);
  }

  /**
   * Metric for the number of client-side errors captured in a given period.
   *
   * @default - sum over 5 minutes
   */
  public metricClientError(stage: IStage, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(ApiGatewayMetrics._4XxErrorSum, stage, props);
  }

  /**
   * Metric for the number of server-side errors captured in a given period.
   *
   * @default - sum over 5 minutes
   */
  public metricServerError(stage: IStage, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(ApiGatewayMetrics._5XxErrorSum, stage, props);
  }

  /**
   * Metric for the number of requests served from the API cache in a given period.
   *
   * @default - sum over 5 minutes
   */
  public metricCacheHitCount(stage: IStage, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(ApiGatewayMetrics.cacheHitCountSum, stage, props);
  }

  /**
   * Metric for the number of requests served from the backend in a given period,
   * when API caching is enabled.
   *
   * @default - sum over 5 minutes
   */
  public metricCacheMissCount(stage: IStage, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(ApiGatewayMetrics.cacheMissCountSum, stage, props);
  }

  /**
   * Metric for the total number API requests in a given period.
   *
   * @default - sample count over 5 minutes
   */
  public metricCount(stage: IStage, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(ApiGatewayMetrics.countSum, stage, {
      statistic: 'SampleCount',
      ...props,
    });
  }

  /**
   * Metric for the time between when API Gateway relays a request to the backend
   * and when it receives a response from the backend.
   *
   * @default - average over 5 minutes.
   */
  public metricIntegrationLatency(stage: IStage, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(ApiGatewayMetrics.integrationLatencyAverage, stage, props);
  }

  /**
   * The time between when API Gateway receives a request from a client
   * and when it returns a response to the client.
   * The latency includes the integration latency and other API Gateway overhead.
   *
   * @default - average over 5 minutes.
   */
  public metricLatency(stage: IStage, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.cannedMetric(ApiGatewayMetrics.latencyAverage, stage, props);
  }

  private cannedMetric(fn: (dims: {
    ApiName: string;
    Method: string;
    Resource: string;
    Stage: string;
  }) => cloudwatch.MetricProps, stage: IStage, props?: cloudwatch.MetricOptions) {
    return new cloudwatch.Metric({
      ...fn({ ApiName: this.api.restApiName, Method: this.httpMethod, Resource: this.resource.path, Stage: stage.stageName }),
      ...props,
    }).attachTo(this);
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

function pathForArn(path: string): string {
  return path.replace(/\{[^\}]*\}/g, '*'); // replace path parameters (like '{bookId}') with asterisk
}
