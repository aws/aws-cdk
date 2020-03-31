import { Construct, IResource, Resource, Stack } from '@aws-cdk/core';

import { CfnApi } from './apigatewayv2.generated';
import { Deployment } from './deployment';
import { Integration } from './integration';
import { LambdaIntegration, LambdaIntegrationOptions } from './integrations/lambda-integration';
import { JsonSchema } from './json-schema';
import { Model, ModelOptions } from './model';
import { IRoute, KnownRouteSelectionExpression } from './route';
import { IStage, Stage, StageOptions } from './stage';

/**
 * Available protocols for ApiGateway V2 APIs (currently only 'WEBSOCKET' is supported)
 */
export enum ProtocolType {
  /**
   * WebSocket API
   */
  WEBSOCKET = "WEBSOCKET",

  /**
   * HTTP API
   */
  HTTP = "HTTP"
}

/**
 * Specifies how to interpret the base path of the API during import
 */
export enum BasePath {
  /**
   * Ignores the base path
   */
  IGNORE = "ignore",

  /**
   * Prepends the base path to the API path
   */
  PREPEND = "prepend",

  /**
   * Splits the base path from the API path
   */
  SPLIT = "split"
}

/**
 * This expression is evaluated when the service determines the given request should proceed
 * only if the client provides a valid API key.
 */
export enum KnownApiKeySelectionExpression {
  /**
   * Uses the `x-api-key` header to get the API Key
   */
  HEADER_X_API_KEY = "$request.header.x-api-key",

  /**
   * Uses the `usageIdentifier` property of the current authorizer to get the API Key
   */
  AUTHORIZER_USAGE_IDENTIFIER = " $context.authorizer.usageIdentifierKey"
}

/**
 * The BodyS3Location property specifies an S3 location from which to import an OpenAPI definition.
 */
export interface BodyS3Location {
  /**
   * The S3 bucket that contains the OpenAPI definition to import.
   */
  readonly bucket: string;

  /**
   * The Etag of the S3 object.
   *
   * @default - no etag verification
   */
  readonly etag?: string;

  /**
   * The key of the S3 object.
   */
  readonly key: string;

  /**
   * The version of the S3 object.
   *
   * @default - get latest version
   */
  readonly version?: string;
}

/**
 * The CorsConfiguration property specifies a CORS configuration for an API.
 */
export interface CorsConfiguration {
  /**
   * Specifies whether credentials are included in the CORS request.
   *
   * @default false
   */
  readonly allowCredentials?: boolean;

  /**
   * Represents a collection of allowed headers.
   *
   * @default - no headers allowed
   */
  readonly allowHeaders?: string[];

  /**
   * Represents a collection of allowed HTTP methods.
   *
   * @default - no allowed methods
   */
  readonly allowMethods: string[];

  /**
   * Represents a collection of allowed origins.
   *
   * @default - get allowed origins
   */
  readonly allowOrigins?: string[];

  /**
   * Represents a collection of exposed headers.
   *
   * @default - get allowed origins
   */
  readonly exposeHeaders?: string[];

  /**
   * The number of seconds that the browser should cache preflight request results.
   *
   * @default - get allowed origins
   */
  readonly maxAge?: number;
}

/**
 * Defines the contract for an Api Gateway V2 Api.
 */
export interface IApi extends IResource {
  /**
   * The ID of this API Gateway Api.
   * @attribute
   */
  readonly apiId: string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Api.
 */
export interface ApiProps {
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
   * Specifies how to interpret the base path of the API during import.
   *
   * Supported only for HTTP APIs.
   * @default 'ignore'
   */
  readonly basePath?: BasePath;

  /**
   * The OpenAPI definition.
   *
   * To import an HTTP API, you must specify `body` or `bodyS3Location`.
   *
   * Supported only for HTTP APIs.
   * @default - `bodyS3Location` if defined, or no import
   */
  readonly body?: string;

  /**
   * The S3 location of an OpenAPI definition.
   *
   * To import an HTTP API, you must specify `body` or `bodyS3Location`.
   *
   * Supported only for HTTP APIs.
   * @default - `body` if defined, or no import
   */
  readonly bodyS3Location?: BodyS3Location;

  /**
   * The S3 location of an OpenAPI definition.
   *
   * To import an HTTP API, you must specify `body` or `bodyS3Location`.
   *
   * Supported only for HTTP APIs.
   * @default - `body` if defined, or no import
   */
  readonly corsConfiguration?: CorsConfiguration;

  /**
   * Available protocols for ApiGateway V2 APIs
   *
   * @default - required unless you specify an OpenAPI definition
   */
  readonly protocolType?: ProtocolType | string;

  /**
   * Expression used to select the route for this API
   *
   * @default - '${request.method} ${request.path}' for HTTP APIs, required for Web Socket APIs
   */
  readonly routeSelectionExpression?: KnownRouteSelectionExpression | string;

  /**
   * Expression used to select the Api Key to use for metering
   *
   * Supported only for WebSocket APIs
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
}

/**
 * Represents a WebSocket API in Amazon API Gateway v2.
 *
 * Use `addModel` and `addLambdaIntegration` to configure the API model.
 *
 * By default, the API will automatically be deployed and accessible from a
 * public endpoint.
 */
export class Api extends Resource implements IApi {

  /**
   * Creates a new imported API
   *
   * @param scope scope of this imported resource
   * @param id identifier of the resource
   * @param apiId Identifier of the API
   */
  public static fromApiId(scope: Construct, id: string, apiId: string): IApi {
    class Import extends Resource implements IApi {
      public readonly apiId = apiId;
    }

    return new Import(scope, id);
  }

  /**
   * The ID of this API Gateway Api.
   */
  public readonly apiId: string;

  /**
   * API Gateway stage that points to the latest deployment (if defined).
   */
  public deploymentStage?: Stage;

  protected resource: CfnApi;
  protected deployment?: Deployment;

  constructor(scope: Construct, id: string, props?: ApiProps) {
    if (props === undefined) {
      props = {};
    }
    super(scope, id, {
      physicalName: props.apiName || id,
    });

    if (props.protocolType === undefined && props.body === null && props.bodyS3Location === null) {
      throw new Error("You must specify a protocol type, or import an Open API definition (directly or from S3)");
    }

    switch (props.protocolType) {
      case ProtocolType.WEBSOCKET: {
        if (props.basePath !== undefined) {
          throw new Error('"basePath" is only supported with HTTP APIs');
        }
        if (props.body !== undefined) {
          throw new Error('"body" is only supported with HTTP APIs');
        }
        if (props.bodyS3Location !== undefined) {
          throw new Error('"bodyS3Location" is only supported with HTTP APIs');
        }
        if (props.corsConfiguration !== undefined) {
          throw new Error('"corsConfiguration" is only supported with HTTP APIs');
        }
        if (props.routeSelectionExpression === undefined) {
          throw new Error('"routeSelectionExpression" is required for Web Socket APIs');
        }
        break;
      }
      case ProtocolType.HTTP:
      case undefined: {
        if (props.apiKeySelectionExpression !== undefined) {
          throw new Error('"apiKeySelectionExpression" is only supported with Web Socket APIs');
        }
        if (props.disableSchemaValidation !== undefined) {
          throw new Error('"disableSchemaValidation" is only supported with Web Socket APIs');
        }
        if (props.routeSelectionExpression !== undefined && props.apiKeySelectionExpression !== KnownRouteSelectionExpression.METHOD_PATH) {
          throw new Error('"routeSelectionExpression" has a single supported value for HTTP APIs: "${request.method} ${request.path}"');
        }
        break;
      }
    }

    this.resource = new CfnApi(this, 'Resource', {
      ...props,
      name: this.physicalName
    });
    this.apiId = this.resource.ref;

    const deploy = props.deploy === undefined ? true : props.deploy;
    if (deploy) {
      // encode the stage name into the construct id, so if we change the stage name, it will recreate a new stage.
      // stage name is part of the endpoint, so that makes sense.
      const stageName = (props.deployOptions && props.deployOptions.stageName) || 'prod';

      this.deployment = new Deployment(this, 'Deployment', {
        api: this,
        description: 'Automatically created by the Api construct',

        // No stageName specified, this will be defined by the stage directly, as it will reference the deployment
        retainDeployments: props.retainDeployments
      });

      this.deploymentStage = new Stage(this, `Stage.${stageName}`, {
        ...props.deployOptions,
        deployment: this.deployment,
        api: this,
        stageName,
        description: 'Automatically created by the Api construct'
      });
    } else {
      if (props.deployOptions) {
        throw new Error(`Cannot set 'deployOptions' if 'deploy' is disabled`);
      }
    }
  }

  /**
   * API Gateway deployment that represents the latest changes of the API.
   * This resource will be automatically updated every time the REST API model changes.
   * This will be undefined if `deploy` is false.
   */
  public get latestDeployment() {
    return this.deployment;
  }

  /**
   * Defines an API Gateway Lambda integration.
   * @param id The construct id
   * @param props Lambda integration options
   */
  public addLambdaIntegration(id: string, props: LambdaIntegrationOptions): Integration {
    return new LambdaIntegration(this, id, { ...props, api: this });
  }

  /**
   * Defines a model for this Api Gateway.
   * @param schema The model schema
   * @param props The model integration options
   */
  public addModel(schema: JsonSchema, props?: ModelOptions): Model {
    return new Model(this, `Model.${schema.title}`, {
      ...props,
      modelName: schema.title,
      api: this,
      schema
    });
  }

  /**
   * Returns the ARN for a specific route and stage.
   *
   * @param route The route for this ARN ('*' if not defined)
   * @param stage The stage for this ARN (if not defined, defaults to the deployment stage if defined, or to '*')
   */
  public executeApiArn(route?: IRoute, stage?: IStage) {
    const stack = Stack.of(this);
    const apiId = this.apiId;
    const routeKey = ((route === undefined) ? '*' : route.key);
    const stageName = ((stage === undefined) ?
      ((this.deploymentStage === undefined) ? '*' : this.deploymentStage.stageName) :
      stage.stageName);
    return stack.formatArn({
      service: 'execute-api',
      resource: apiId,
      sep: '/',
      resourceName: `${stageName}/${routeKey}`
    });
  }

  /**
   * Returns the ARN for a specific connection.
   *
   * @param connectionId The identifier of this connection ('*' if not defined)
   * @param stage The stage for this ARN (if not defined, defaults to the deployment stage if defined, or to '*')
   */
  public connectionsApiArn(connectionId: string = "*", stage?: IStage) {
    const stack = Stack.of(this);
    const apiId = this.apiId;
    const stageName = ((stage === undefined) ?
      ((this.deploymentStage === undefined) ? '*' : this.deploymentStage.stageName) :
      stage.stageName);
    return stack.formatArn({
      service: 'execute-api',
      resource: apiId,
      sep: '/',
      resourceName: `${stageName}/POST/${connectionId}`
    });
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
        throw Error("No stage defined for this Api");
      }
      stageName = this.deploymentStage.stageName;
    } else {
      stageName = stage.stageName;
    }
    return `wss://${this.apiId}.execute-api.${stack.region}.amazonaws.com/${stageName}`;
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
        throw Error("No stage defined for this Api");
      }
      stageName = this.deploymentStage.stageName;
    } else {
      stageName = stage.stageName;
    }
    return `https://${this.apiId}.execute-api.${stack.region}.amazonaws.com/${stageName}/@connections`;
  }
}