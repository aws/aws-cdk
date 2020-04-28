import { IFunction } from '@aws-cdk/aws-lambda';
import { CfnResource, Construct, IConstruct } from '@aws-cdk/core';

import { Api, BasePath, BodyS3Location, CorsConfiguration, ProtocolType } from './api';
import { ApiMapping, ApiMappingOptions } from './api-mapping';
import { HttpApiIntegrationMethod, Integration } from './integration';
import { HttpApiHttpIntegrationOptions, HttpIntegration } from './integrations/http-integration';
import { HttpApiLambdaIntegrationOptions, LambdaIntegration } from './integrations/lambda-integration';
import { HttpApiServiceIntegrationOptions, ServiceIntegration } from './integrations/service-integration';
import { HttpApiRouteOptions, IRoute, KnownRouteKey, KnownRouteSelectionExpression, Route } from './route';
import { IStage, StageOptions } from './stage';

/**
 * Specifies the integration's HTTP method type (only GET is supported for WebSocket)
 */
export enum HttpMethod {
  /**
   * All HTTP Methods are supported
   */
  ANY = 'ANY',

  /**
   * GET HTTP Method
   */
  GET = 'GET',

  /**
   * POST HTTP Method
   */
  POST = 'POST',

  /**
   * PUT HTTP Method
   */
  PUT = 'PUT',

  /**
   * DELETE HTTP Method
   */
  DELETE = 'DELETE',

  /**
   * OPTIONS HTTP Method
   */
  OPTIONS = 'OPTIONS',

  /**
   * HEAD HTTP Method
   */
  HEAD = 'HEAD',

  /**
   * PATCH HTTP Method
   */
  PATCH = 'PATCH'
}

/**
 * Defines where an Open API Definition is stored
 */
export interface HttpApiBody {
  /**
   * Stored inline in this declaration.
   *
   * If this is not defined, `bodyS3Location` has to be defined
   *
   * @default - Use S3 Location
   */
  readonly body?: string;
  /**
   * Stored in an Amazon S3 Object.
   *
   * If this is not defined, `body` has to be defined
   *
   * @default - Use inline definition
   */
  readonly bodyS3Location?: BodyS3Location;
}

/**
 * Defines a default handler for the Api
 *
 * One of the properties need to be defined
 */
export interface HttpApiDefaultTarget {
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
   * If a string is provided, it will test is the string starts with
   * - 'http://' or 'https://': it creates an http
   * - 'arn:': it will create an AWS Serice integration
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
export interface IHttpApi extends IConstruct {
  /**
   * The ID of this API Gateway Api.
   * @attribute
   */
  readonly apiId: string;
}

/**
 * Defines the properties of a Web Socket API
 */
export interface HttpApiProps {
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
   * @default 'ignore'
   */
  readonly basePath?: BasePath;

  /**
   * The OpenAPI definition. Used to import an HTTP Api.
   * Use either a body definition or the location of an Amazon S3 Object
   *
   * @default - no import
   */
  readonly body?: HttpApiBody;

  /**
   * A CORS configuration.
   *
   * @default - CORS not activated
   */
  readonly corsConfiguration?: CorsConfiguration;

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
  readonly defaultTarget?: HttpApiDefaultTarget;
}

/**
 * Represents an HTTP Route entry
 */
export interface HttpRouteEntry {
  /**
   * Method for thei API Route
   *
   * @default 'ANY'
   */
  readonly method?: HttpMethod;

  /**
   * Path of the route
   */
  readonly path: string;
}

export declare type HttpRouteName = KnownRouteKey | HttpRouteEntry | string;

/**
 * Represents an HTTP API in Amazon API Gateway v2.
 *
 * Use `addModel` and `addLambdaIntegration` to configure the API model.
 *
 * By default, the API will automatically be deployed and accessible from a
 * public endpoint.
 */
export class HttpApi extends Construct implements IHttpApi {
  /**
   * Creates a new imported API
   *
   * @param scope scope of this imported resource
   * @param id identifier of the resource
   * @param apiId Identifier of the API
   */
  public static fromApiId(scope: Construct, id: string, apiId: string): IHttpApi {
    class Import extends Construct implements IHttpApi {
      public readonly apiId = apiId;
    }

    return new Import(scope, id);
  }

  /**
   * The ID of this API Gateway Api.
   */
  public readonly apiId: string;

  protected readonly resource: Api;

  constructor(scope: Construct, id: string, props?: HttpApiProps) {
    if (props === undefined) {
      props = {};
    }
    super(scope, id);

    this.resource = new Api(this, 'Default', {
      ...props,
      apiName: props.apiName ?? id,
      body: ((props.body !== undefined) && (props.body.body !== undefined) ? props.body.body : undefined),
      bodyS3Location: ((props.body !== undefined) && (props.body.bodyS3Location !== undefined) ? props.body.bodyS3Location : undefined),
      protocolType: ProtocolType.HTTP,
      routeSelectionExpression: KnownRouteSelectionExpression.METHOD_PATH,
    });

    this.apiId = this.resource.apiId;

    if (props.defaultTarget !== undefined) {
      let integration;
      if (props.defaultTarget.handler !== undefined) {
        integration = this.addLambdaIntegration('default', {
          handler: props.defaultTarget.handler,
        });
      } else if (props.defaultTarget.uri) {
        const uri = props.defaultTarget.uri;
        if (uri.startsWith('https://') || uri.startsWith('http://')) {
          integration = this.addHttpIntegration('default', {
            url: uri,
          });
        } else if (uri.startsWith('arn:')) {
          integration = this.addServiceIntegration('default', {
            arn: uri,
          });
        } else {
          throw new Error('Invalid string format, must be a fully qualified ARN or a URL');
        }
      } else {
        throw new Error('You must specify an ARN, a URL, or a Lambda Function');
      }

      this.addRoute(KnownRouteKey.DEFAULT, integration, {});
    }
  }

  /**
   * API Gateway deployment used for automated deployments.
   */
  public get deployment() {
    return this.resource.deployment;
  }

  /**
   * API Gateway stage used for automated deployments.
   */
  public get deploymentStage() {
    return this.resource.deploymentStage;
  }

  /**
   * Creates a new integration for this api, using a Lambda integration.
   *
   * @param id the id of this integration
   * @param props the properties for this integration
   */
  public addLambdaIntegration(id: string, props: HttpApiLambdaIntegrationOptions): LambdaIntegration {
    const integration = new LambdaIntegration(this, `${id}.lambda.integration`, {
      ...props,
      payloadFormatVersion: props.payloadFormatVersion ?? '1.0',
      api: this.resource,
      proxy: true,
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
  public addHttpIntegration(id: string, props: HttpApiHttpIntegrationOptions): HttpIntegration {
    const integration = new HttpIntegration(this, `${id}.http.integration`, {
      ...props,
      integrationMethod: props.integrationMethod ?? HttpApiIntegrationMethod.ANY,
      payloadFormatVersion: props.payloadFormatVersion ?? '1.0',
      api: this.resource,
      proxy: true,
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
  public addServiceIntegration(id: string, props: HttpApiServiceIntegrationOptions): ServiceIntegration {
    const integration = new ServiceIntegration(this, `${id}.service.integration`, {
      ...props,
      integrationMethod: props.integrationMethod ?? HttpApiIntegrationMethod.ANY,
      payloadFormatVersion: props.payloadFormatVersion ?? '1.0',
      api: this.resource,
      proxy: true,
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
    key: HttpRouteName,
    integration: Integration | LambdaIntegration | HttpIntegration | ServiceIntegration,
    props?: HttpApiRouteOptions): Route {
    const keyName = ((typeof(key) === 'object') ? `${key.method ?? 'ANY'} ${key.path}` : key);
    const route = new Route(this, `${keyName}.route`, {
      ...props,
      api: this.resource,
      integration: ((integration instanceof Integration) ? integration : integration.resource),
      key: keyName,
    });
    if (this.resource.deployment !== undefined) {
      this.resource.deployment.registerDependency(route.node.defaultChild as CfnResource);
    }
    return route;
  }

  /**
   * Creates a new route for this api, on the specified methods.
   *
   * @param keys the route keys (predefined or not) to use
   * @param integration [disable-awslint:ref-via-interface] the integration to use for these routes
   * @param props the properties for these routes
   */
  public addRoutes(
    keys: HttpRouteName[],
    integration: Integration | LambdaIntegration | HttpIntegration | ServiceIntegration,
    props?: HttpApiRouteOptions): Route[] {
    return keys.map((key) => this.addRoute(key, integration, props));
  }

  /**
   * Creates a new domain name mapping for this api.
   *
   * @param props the properties for this Api Mapping
   */
  public addApiMapping(props: ApiMappingOptions): ApiMapping {
    const mapping = new ApiMapping(this, `${props.domainName}.${props.stage}.mapping`, {
      ...props,
      api: this.resource,
    });
    if (this.resource.deployment !== undefined) {
      this.resource.deployment.registerDependency(mapping.node.defaultChild as CfnResource);
    }
    return mapping;
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
   * Returns the client URL for this Api, for a specific stage.
   *
   * Fails if `stage` is not defined, and `deploymentStage` is not set either by `deploy` or explicitly.
   * @param stage The stage for this URL (if not defined, defaults to the deployment stage)
   */
  public clientUrl(stage?: IStage): string {
    return this.resource.httpsClientUrl(stage);
  }
}