import { IFunction } from '@aws-cdk/aws-lambda';
import { CfnResource, Construct, IResource, Resource, Stack } from '@aws-cdk/core';
import { CfnApi } from '../apigatewayv2.generated';
import { JsonSchema } from '../common/json-schema';
import { IStage } from '../common/stage';

import { WebSocketDeployment } from './deployment';
import { WebSocketIntegration } from './integration';
import { WebSocketHttpIntegration, WebSocketHttpIntegrationOptions } from './integrations/http';
import { WebSocketLambdaIntegration, WebSocketLambdaIntegrationOptions } from './integrations/lambda';
import { WebSocketMockIntegration, WebSocketMockIntegrationOptions } from './integrations/mock';
import { WebSocketServiceIntegration, WebSocketServiceIntegrationOptions } from './integrations/service';
import { WebSocketModel, WebSocketModelOptions } from './model';
import { WebSocketRoute, WebSocketRouteKey, WebSocketRouteOptions } from './route';
import { WebSocketStage, WebSocketStageOptions } from './stage';

/**
 * Available Api Key Selectors for ApiGateway V2 APIs
 */
export enum WebSocketApiKeySelectionExpression {
  /**
   * Use the request header x-api-key.
   */
  HEADER_X_API_KEY = '$request.header.x-api-key',
  /**
   * Use the authorizer's usage identifier key.
   */
  AUTHORIZER_USAGE_IDENTIFIER_KEY = '$context.authorizer.usageIdentifierKey',
}

/**
 * Known expressions for selecting a route in an API
 */
export class WebSocketRouteSelectionExpression {
  /**
   * Default route, when no other pattern matches
   */
  public static readonly CONTEXT_ROUTE_KEY = new WebSocketRouteSelectionExpression('${context.routeKey}');

  /**
   * Creates a custom route key
   * @param value the name of the route key
   */
  public static custom(value: string): WebSocketRouteSelectionExpression {
    return new WebSocketRouteSelectionExpression(value);
  }

  /**
   * Contains the template key
   */
  private readonly value: string;
  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Returns the current value of the template key
   */
  public toString(): string {
    return this.value;
  }
}

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
export interface IWebSocketApi extends IResource {
  /**
   * The ID of this API Gateway Api.
   * @attribute
   */
  readonly webSocketApiId: string;
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
  readonly deployOptions?: WebSocketStageOptions;

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
  readonly routeSelectionExpression: WebSocketRouteSelectionExpression;

  /**
   * Expression used to select the Api Key to use for metering
   *
   * @default - No Api Key
   */
  readonly apiKeySelectionExpression?: WebSocketApiKeySelectionExpression;

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

/**
 * Represents a Web Socket API in Amazon API Gateway v2.
 *
 * Use `addModel` and `addLambdaIntegration` to configure the API model.
 *
 * By default, the API will automatically be deployed and accessible from a
 * public endpoint.
 *
 * @resource AWS::ApiGatewayV2::Api
 */
export class WebSocketApi extends Resource implements IWebSocketApi {
  /**
   * Creates a new imported API
   *
   * @param scope scope of this imported resource
   * @param id identifier of the resource
   * @param webSocketApiId Identifier of the API
   */
  public static fromApiId(scope: Construct, id: string, webSocketApiId: string): IWebSocketApi {
    class Import extends Resource implements IWebSocketApi {
      public readonly webSocketApiId = webSocketApiId;
    }

    return new Import(scope, id);
  }

  /**
   * The ID of this API Gateway Api.
   */
  public readonly webSocketApiId: string;

  /**
   * API Gateway stage that points to the latest deployment (if defined).
   */
  public deploymentStage?: WebSocketStage;

  /**
   * API Gateway deployment (if defined).
   */
  public deployment?: WebSocketDeployment;

  protected resource: CfnApi;

  constructor(scope: Construct, id: string, props: WebSocketApiProps) {
    super(scope, id, {
      physicalName: props.apiName || id,
    });

    this.resource = new CfnApi(this, 'Resource', {
      name: this.physicalName,
      apiKeySelectionExpression: props.apiKeySelectionExpression,
      description: props.description,
      disableSchemaValidation: props.disableSchemaValidation,
      failOnWarnings: props.failOnWarnings,
      protocolType: 'WEBSOCKET',
      routeSelectionExpression: props.routeSelectionExpression.toString(),
      // TODO: tags: props.tags,
      version: props.version,
    });

    this.webSocketApiId = this.resource.ref;

    const deploy = props.deploy === undefined ? true : props.deploy;
    if (deploy) {
      const stageName = (props.deployOptions && props.deployOptions.stageName) || 'prod';

      this.deployment = new WebSocketDeployment(this, 'Deployment', {
        api: this,
        description: 'Automatically created by the Api construct',
      });

      this.deploymentStage = new WebSocketStage(this, 'DefaultStage', {
        deployment: this.deployment,
        api: this,
        stageName,
        description: 'Automatically created by the Api construct',
        accessLogSettings: props.deployOptions?.accessLogSettings,
        autoDeploy: props.deployOptions?.autoDeploy,
        clientCertificateId: props.deployOptions?.clientCertificateId,
        defaultRouteSettings: props.deployOptions?.defaultRouteSettings,
        routeSettings: props.deployOptions?.routeSettings,
        stageVariables: props.deployOptions?.stageVariables,
      });
    } else {
      if (props.deployOptions) {
        throw new Error('Cannot set "deployOptions" if "deploy" is disabled');
      }
    }

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

      this.addRoute(WebSocketRouteKey.DEFAULT, integration, {});
    }
  }

  /**
   * Creates a new integration for this api, using a Lambda integration.
   *
   * @param id the id of this integration
   * @param props the properties for this integration
   */
  public addLambdaIntegration(id: string, props: WebSocketLambdaIntegrationOptions): WebSocketLambdaIntegration {
    const integration = new WebSocketLambdaIntegration(this, `${id}.lambda.integration`, {
      ...props,
      api: this,
    });
    if (this.deployment !== undefined) {
      this.deployment.registerDependency(integration.node.defaultChild as CfnResource);
    }
    return integration;
  }

  /**
   * Creates a new integration for this api, using a HTTP integration.
   *
   * @param id the id of this integration
   * @param props the properties for this integration
   */
  public addHttpIntegration(id: string, props: WebSocketHttpIntegrationOptions): WebSocketHttpIntegration {
    const integration = new WebSocketHttpIntegration(this, `${id}.http.integration`, {
      ...props,
      api: this,
    });
    if (this.deployment !== undefined) {
      this.deployment.registerDependency(integration.node.defaultChild as CfnResource);
    }
    return integration;
  }

  /**
   * Creates a new service for this api, using a Lambda integration.
   *
   * @param id the id of this integration
   * @param props the properties for this integration
   */
  public addServiceIntegration(id: string, props: WebSocketServiceIntegrationOptions): WebSocketServiceIntegration {
    const integration = new WebSocketServiceIntegration(this, `${id}.service.integration`, {
      ...props,
      api: this,
    });
    if (this.deployment !== undefined) {
      this.deployment.registerDependency(integration.node.defaultChild as CfnResource);
    }
    return integration;
  }

  /**
   * Creates a new service for this api, using a Mock integration.
   *
   * @param id the id of this integration
   * @param props the properties for this integration
   */
  public addMockIntegration(id: string, props: WebSocketMockIntegrationOptions): WebSocketMockIntegration {
    const integration = new WebSocketMockIntegration(this, `${id}.service.integration`, {
      ...props,
      api: this,
    });
    if (this.deployment !== undefined) {
      this.deployment.registerDependency(integration.node.defaultChild as CfnResource);
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
  public addRoute(key: WebSocketRouteKey, integration: WebSocketIntegration, props?: WebSocketRouteOptions): WebSocketRoute {
    const route = new WebSocketRoute(this, `${key}.route`, {
      ...props,
      api: this,
      integration,
      key,
    });
    if (this.deployment !== undefined) {
      this.deployment.registerDependency(route.node.defaultChild as CfnResource);
    }
    return route;
  }

  /**
   * Defines a model for this Api Gateway.
   * @param schema The model schema
   * @param props The model integration options
   */
  public addModel(schema: JsonSchema, props?: WebSocketModelOptions): WebSocketModel {
    const model = new WebSocketModel(this, `Model.${schema.title}`, {
      ...props,
      modelName: schema.title,
      api: this,
      schema,
    });
    if (this.deployment !== undefined) {
      this.deployment.registerDependency(model.node.defaultChild as CfnResource);
    }
    return model;
  }

  /**
   * Returns the ARN for a specific route and stage.
   *
   * @param route The route for this ARN ('*' if not defined)
   * @param stage The stage for this ARN (if not defined, defaults to the deployment stage if defined, or to '*')
   */
  public executeApiArn(route?: WebSocketRouteKey, stage?: IStage) {
    const stack = Stack.of(this);
    const apiId = this.webSocketApiId;
    const routeKey = ((route === undefined) ? '*' : route.toString());
    const stageName = ((stage === undefined) ?
      ((this.deploymentStage === undefined) ? '*' : this.deploymentStage.stageName) :
      stage.stageName);
    return stack.formatArn({
      service: 'execute-api',
      resource: apiId,
      sep: '/',
      resourceName: `${stageName}/${routeKey}`,
    });
  }

  /**
   * Returns the ARN for a specific connection.
   *
   * @param connectionId The identifier of this connection ('*' if not defined)
   * @param stage The stage for this ARN (if not defined, defaults to the deployment stage if defined, or to '*')
   */
  public connectionsApiArn(connectionId: string = '*', stage?: IStage) {
    const stack = Stack.of(this);
    const apiId = this.webSocketApiId;
    const stageName = ((stage === undefined) ?
      ((this.deploymentStage === undefined) ? '*' : this.deploymentStage.stageName) :
      stage.stageName);
    return stack.formatArn({
      service: 'execute-api',
      resource: apiId,
      sep: '/',
      resourceName: `${stageName}/POST/${connectionId}`,
    });
  }

  /**
   * Returns the connections URL for this Api, for a specific stage.
   *
   * Fails if `stage` is not defined, and `deploymentStage` is not set either by `deploy` or explicitly.
   * @param stage The stage for this URL (if not defined, defaults to the deployment stage)
   */
  public connectionsUrl(stage?: IStage): string {
    const stack = Stack.of(this);
    let stageName: string | undefined;
    if (stage === undefined) {
      if (this.deploymentStage === undefined) {
        throw Error('No stage defined for this Api');
      }
      stageName = this.deploymentStage.stageName;
    } else {
      stageName = stage.stageName;
    }
    return `https://${this.webSocketApiId}.execute-api.${stack.region}.amazonaws.com/${stageName}/@connections`;
  }

  /**
   * Returns the client URL for this Api, for a specific stage.
   *
   * Fails if `stage` is not defined, and `deploymentStage` is not set either by `deploy` or explicitly.
   * @param stage The stage for this URL (if not defined, defaults to the deployment stage)
   */
  public clientUrl(stage?: IStage): string {
    const stack = Stack.of(this);
    let stageName: string | undefined;
    if (stage === undefined) {
      if (this.deploymentStage === undefined) {
        throw Error('No stage defined for this Api');
      }
      stageName = this.deploymentStage.stageName;
    } else {
      stageName = stage.stageName;
    }
    return `wss://${this.webSocketApiId}.execute-api.${stack.region}.amazonaws.com/${stageName}`;
  }
}