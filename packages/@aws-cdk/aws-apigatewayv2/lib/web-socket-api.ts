import { IFunction } from '@aws-cdk/aws-lambda';
import { CfnResource, Construct, IConstruct } from '@aws-cdk/core';

import { Api, KnownApiKeySelectionExpression, ProtocolType } from './api';
import { Integration } from './integration';
import { HttpIntegration, WebSocketApiHttpIntegrationOptions } from './integrations/http-integration';
import { LambdaIntegration, WebSocketApiLambdaIntegrationOptions } from './integrations/lambda-integration';
import { MockIntegration, WebSocketApiMockIntegrationOptions } from './integrations/mock-integration';
import { ServiceIntegration, WebSocketApiServiceIntegrationOptions } from './integrations/service-integration';
import { JsonSchema } from './json-schema';
import { Model, ModelOptions } from './model';
import { IRoute, KnownRouteKey, KnownRouteSelectionExpression, Route, WebSocketApiRouteOptions } from './route';
import { IStage, StageOptions } from './stage';

/**
 * Defines a default handler for the Api
 *
 * One of the properties need to be defined
 */
export interface WebSocketApiDefaultTarget {
  /**
   * Use an AWS Lambda function
   *
   * If this is not defined, `uri` has to be defined
   *
   * @default - use one of the other properties
   */
  readonly handler?: IFunction;

  /**
   * Use a URI for the handler.
   * If a string is provided, it will test is the string
   * - starts with 'http://' or 'https://': it creates an http
   * - starts with 'arn:': it will create an AWS Serice integration
   * - equals 'mock': it will create a Mock Serice integration
   * - it will fail for any other value
   *
   * If this is not defined, `handler` has to be defined
   *
   * @default - Use inline definition
   */
  readonly uri?: string;
}

/**
 * Defines the contract for an Api Gateway V2 HTTP Api.
 */
export interface IWebSocketApi extends IConstruct {
  /**
   * The ID of this API Gateway Api.
   * @attribute
   */
  readonly apiId: string;
}

/**
 * Defines the properties of a Web Socket API
 */
export interface WebSocketApiProps {
  /**
   * Indicates if a Deployment should be automatically created for this API,
   * and recreated when the API model (route, integration) changes.
   *
   * Since API Gateway deployments are immutable, When this option is enabled
   * (by default), an AWS::ApiGatewayV2::Deployment resource will automatically
   * created with a logical ID that hashes the API model (methods, resources
   * and options). This means that when the model changes, the logical ID of
   * this CloudFormation resource will change, and a new deployment will be
   * created.
   *
   * If this is set, `latestDeployment` will refer to the `Deployment` object
   * and `deploymentStage` will refer to a `Stage` that points to this
   * deployment. To customize the stage options, use the `deployOptions`
   * property.
   *
   * A CloudFormation Output will also be defined with the root URL endpoint
   * of this REST API.
   *
   * @default true
   */
  readonly deploy?: boolean;

  /**
   * Options for the API Gateway stage that will always point to the latest
   * deployment when `deploy` is enabled. If `deploy` is disabled,
   * this value cannot be set.
   *
   * @default - default options
   */
  readonly deployOptions?: StageOptions;

  /**
   * Retains old deployment resources when the API changes. This allows
   * manually reverting stages to point to old deployments via the AWS
   * Console.
   *
   * @default false
   */
  readonly retainDeployments?: boolean;

  /**
   * A name for the API Gateway Api resource.
   *
   * @default - ID of the Api construct.
   */
  readonly apiName?: string;

  /**
   * Expression used to select the route for this API
   */
  readonly routeSelectionExpression: KnownRouteSelectionExpression | string;

  /**
   * Expression used to select the Api Key to use for metering
   *
   * @default - No Api Key
   */
  readonly apiKeySelectionExpression?: KnownApiKeySelectionExpression | string;

  /**
   * A description of the purpose of this API Gateway Api resource.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * Indicates whether schema validation will be disabled for this Api
   *
   * @default false
   */
  readonly disableSchemaValidation?: boolean;

  /**
   * Indicates the version number for this Api
   *
   * @default false
   */
  readonly version?: string;

  /**
   * Specifies whether to rollback the API creation (`true`) or not (`false`) when a warning is encountered
   *
   * @default false
   */
  readonly failOnWarnings?: boolean;

  /**
   * If defined, creates a default proxy target for the HTTP Api.
   *
   * @default - no default handler or route
   */
  readonly defaultTarget?: WebSocketApiDefaultTarget;
}

export declare type WebSocketRouteName = KnownRouteKey | string;

/**
 * Represents an HTTP API in Amazon API Gateway v2.
 *
 * Use `addModel` and `addLambdaIntegration` to configure the API model.
 *
 * By default, the API will automatically be deployed and accessible from a
 * public endpoint.
 */
export class WebSocketApi extends Construct implements IWebSocketApi {
  /**
   * Creates a new imported API
   *
   * @param scope scope of this imported resource
   * @param id identifier of the resource
   * @param apiId Identifier of the API
   */
  public static fromApiId(scope: Construct, id: string, apiId: string): IWebSocketApi {
    class Import extends Construct implements IWebSocketApi {
      public readonly apiId = apiId;
    }

    return new Import(scope, id);
  }

  /**
   * The ID of this API Gateway Api.
   */
  public readonly apiId: string;

  protected readonly resource: Api;

  constructor(scope: Construct, id: string, props: WebSocketApiProps) {
    super(scope, id);

    this.resource = new Api(this, 'Default', {
      ...props,
      apiName: props.apiName ?? id,
      protocolType: ProtocolType.WEBSOCKET,
    });

    this.apiId = this.resource.apiId;

    if (props.defaultTarget !== undefined) {
      let integration;
      if (props.defaultTarget.handler !== undefined) {
        integration = this.addLambdaIntegration('default', {
          handler: props.defaultTarget.handler,
          proxy: true,
        });
      } else if (props.defaultTarget.uri) {
        const uri = props.defaultTarget.uri;
        if (uri.startsWith('https://') || uri.startsWith('http://')) {
          integration = this.addHttpIntegration('default', {
            url: uri,
            proxy: true,
          });
        } else if (uri.startsWith('arn:')) {
          integration = this.addServiceIntegration('default', {
            arn: uri,
            proxy: true,
          });
        } else if (uri === 'MOCK') {
          integration = this.addMockIntegration('default', {});
        } else {
          throw new Error('Invalid string format, must be a fully qualified ARN, a URL, or "MOCK"');
        }
      } else {
        throw new Error('You must specify an ARN, a URL, "MOCK", or a Lambda Function');
      }

      this.addRoute(KnownRouteKey.DEFAULT, integration, {});
    }
  }

  /**
   * Creates a new integration for this api, using a Lambda integration.
   *
   * @param id the id of this integration
   * @param props the properties for this integration
   */
  public addLambdaIntegration(id: string, props: WebSocketApiLambdaIntegrationOptions): LambdaIntegration {
    const integration = new LambdaIntegration(this, `${id}.lambda.integration`, {
      ...props,
      api: this.resource,
    });
    if (this.resource.deployment !== undefined) {
      this.resource.deployment.registerDependency(integration.resource.node.defaultChild as CfnResource);
    }
    return integration;
  }

  /**
   * Creates a new integration for this api, using a HTTP integration.
   *
   * @param id the id of this integration
   * @param props the properties for this integration
   */
  public addHttpIntegration(id: string, props: WebSocketApiHttpIntegrationOptions): HttpIntegration {
    const integration = new HttpIntegration(this, `${id}.http.integration`, {
      ...props,
      api: this.resource,
    });
    if (this.resource.deployment !== undefined) {
      this.resource.deployment.registerDependency(integration.resource.node.defaultChild as CfnResource);
    }
    return integration;
  }

  /**
   * Creates a new service for this api, using a Lambda integration.
   *
   * @param id the id of this integration
   * @param props the properties for this integration
   */
  public addServiceIntegration(id: string, props: WebSocketApiServiceIntegrationOptions): ServiceIntegration {
    const integration = new ServiceIntegration(this, `${id}.service.integration`, {
      ...props,
      api: this.resource,
    });
    if (this.resource.deployment !== undefined) {
      this.resource.deployment.registerDependency(integration.resource.node.defaultChild as CfnResource);
    }
    return integration;
  }

  /**
   * Creates a new service for this api, using a Mock integration.
   *
   * @param id the id of this integration
   * @param props the properties for this integration
   */
  public addMockIntegration(id: string, props: WebSocketApiMockIntegrationOptions): MockIntegration {
    const integration = new MockIntegration(this, `${id}.service.integration`, {
      ...props,
      api: this.resource,
    });
    if (this.resource.deployment !== undefined) {
      this.resource.deployment.registerDependency(integration.resource.node.defaultChild as CfnResource);
    }
    return integration;
  }

  /**
   * Creates a new route for this api, on the specified methods.
   *
   * @param key the route key (predefined or not) to use
   * @param integration [disable-awslint:ref-via-interface] the integration to use for this route
   * @param props the properties for this route
   */
  public addRoute(
    key: WebSocketRouteName,
    integration: Integration | LambdaIntegration | HttpIntegration | ServiceIntegration,
    props?: WebSocketApiRouteOptions): Route {
    const route = new Route(this, `${key}.route`, {
      ...props,
      api: this.resource,
      integration: ((integration instanceof Integration) ? integration : integration.resource),
      key,
    });
    if (this.resource.deployment !== undefined) {
      this.resource.deployment.registerDependency(route.node.defaultChild as CfnResource);
    }
    return route;
  }

  /**
   * Defines a model for this Api Gateway.
   * @param schema The model schema
   * @param props The model integration options
   */
  public addModel(schema: JsonSchema, props?: ModelOptions): Model {
    const model = new Model(this, `Model.${schema.title}`, {
      ...props,
      modelName: schema.title,
      api: this.resource,
      schema,
    });
    if (this.resource.deployment !== undefined) {
      this.resource.deployment.registerDependency(model.node.defaultChild as CfnResource);
    }
    return model;
  }

  /**
   * Returns the ARN for a specific route and stage.
   *
   * @param route The route for this ARN ('*' if not defined)
   * @param stage The stage for this ARN (if not defined, defaults to the deployment stage if defined, or to '*')
   */
  public executeApiArn(route?: IRoute, stage?: IStage) {
    return this.resource.executeApiArn(route, stage);
  }

  /**
   * Returns the ARN for a specific connection.
   *
   * @param connectionId The identifier of this connection ('*' if not defined)
   * @param stage The stage for this ARN (if not defined, defaults to the deployment stage if defined, or to '*')
   */
  public connectionsApiArn(connectionId: string = '*', stage?: IStage) {
    return this.resource.webSocketConnectionsApiArn(connectionId, stage);
  }

  /**
   * Returns the connections URL for this Api, for a specific stage.
   *
   * Fails if `stage` is not defined, and `deploymentStage` is not set either by `deploy` or explicitly.
   * @param stage The stage for this URL (if not defined, defaults to the deployment stage)
   */
  public connectionsUrl(stage?: IStage): string {
    return this.resource.webSocketConnectionsUrl(stage);
  }

  /**
   * Returns the client URL for this Api, for a specific stage.
   *
   * Fails if `stage` is not defined, and `deploymentStage` is not set either by `deploy` or explicitly.
   * @param stage The stage for this URL (if not defined, defaults to the deployment stage)
   */
  public clientUrl(stage?: IStage): string {
    return this.resource.webSocketClientUrl(stage);
  }
}