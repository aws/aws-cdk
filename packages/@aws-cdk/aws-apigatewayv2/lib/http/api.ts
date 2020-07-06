import { Construct, Duration, IResource, Resource } from '@aws-cdk/core';
import { CfnApi, CfnApiProps } from '../apigatewayv2.generated';
import { DefaultDomainMappingOptions } from '../http/stage';
import { IHttpRouteIntegration } from './integration';
import { BatchHttpRouteOptions, HttpMethod, HttpRoute, HttpRouteKey } from './route';
import { HttpStage, HttpStageOptions } from './stage';

/**
 * Represents an HTTP API
 */
export interface IHttpApi extends IResource {
  /**
   * The identifier of this API Gateway HTTP API.
   * @attribute
   */
  readonly httpApiId: string;
}

/**
 * Properties to initialize an instance of `HttpApi`.
 */
export interface HttpApiProps {
  /**
   * Name for the HTTP API resoruce
   * @default - id of the HttpApi construct.
   */
  readonly apiName?: string;

  /**
   * An integration that will be configured on the catch-all route ($default).
   * @default - none
   */
  readonly defaultIntegration?: IHttpRouteIntegration;

  /**
   * Whether a default stage and deployment should be automatically created.
   * @default true
   */
  readonly createDefaultStage?: boolean;

  /**
   * Specifies a CORS configuration for an API.
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
   * @default - CORS disabled.
   */
  readonly corsPreflight?: CorsPreflightOptions;

  /**
   * Configure a custom domain with the API mapping resource to the HTTP API
   *
   * @default - no default domain mapping configured. meaningless if `createDefaultStage` is `false`.
   */
  readonly defaultDomainMapping?: DefaultDomainMappingOptions;
}

/**
 * Options for the CORS Configuration
 */
export interface CorsPreflightOptions {
  /**
   * Specifies whether credentials are included in the CORS request.
   * @default false
   */
  readonly allowCredentials?: boolean;

  /**
   * Represents a collection of allowed headers.
   * @default - No Headers are allowed.
   */
  readonly allowHeaders?: string[];

  /**
   * Represents a collection of allowed HTTP methods.
   * @default - No Methods are allowed.
   */
  readonly allowMethods?: HttpMethod[];

  /**
   * Represents a collection of allowed origins.
   * @default - No Origins are allowed.
   */
  readonly allowOrigins?: string[];

  /**
   * Represents a collection of exposed headers.
   * @default - No Expose Headers are allowed.
   */
  readonly exposeHeaders?: string[];

  /**
   * The duration that the browser should cache preflight request results.
   * @default Duration.seconds(0)
   */
  readonly maxAge?: Duration;
}

/**
 * Options for the Route with Integration resoruce
 */
export interface AddRoutesOptions extends BatchHttpRouteOptions {
  /**
   * The path at which all of these routes are configured.
   */
  readonly path: string;

  /**
   * The HTTP methods to be configured
   * @default HttpMethod.ANY
   */
  readonly methods?: HttpMethod[];
}

/**
 * Create a new API Gateway HTTP API endpoint.
 * @resource AWS::ApiGatewayV2::Api
 */
export class HttpApi extends Resource implements IHttpApi {
  /**
   * Import an existing HTTP API into this CDK app.
   */
  public static fromApiId(scope: Construct, id: string, httpApiId: string): IHttpApi {
    class Import extends Resource implements IHttpApi {
      public readonly httpApiId = httpApiId;
    }
    return new Import(scope, id);
  }

  public readonly httpApiId: string;
  /**
   * default stage of the api resource
   */
  private readonly defaultStage: HttpStage | undefined;

  constructor(scope: Construct, id: string, props?: HttpApiProps) {
    super(scope, id);

    const apiName = props?.apiName ?? id;

    let corsConfiguration: CfnApi.CorsProperty | undefined;
    if (props?.corsPreflight) {
      const {
        allowCredentials,
        allowHeaders,
        allowMethods,
        allowOrigins,
        exposeHeaders,
        maxAge,
      } = props.corsPreflight;
      corsConfiguration = {
        allowCredentials,
        allowHeaders,
        allowMethods,
        allowOrigins,
        exposeHeaders,
        maxAge: maxAge?.toSeconds(),
      };
    }

    const apiProps: CfnApiProps = {
      name: apiName,
      protocolType: 'HTTP',
      corsConfiguration,
    };

    const resource = new CfnApi(this, 'Resource', apiProps);
    this.httpApiId = resource.ref;

    if (props?.defaultIntegration) {
      new HttpRoute(this, 'DefaultRoute', {
        httpApi: this,
        routeKey: HttpRouteKey.DEFAULT,
        integration: props.defaultIntegration,
      });
    }

    if (props?.createDefaultStage === undefined || props.createDefaultStage === true) {
      this.defaultStage = new HttpStage(this, 'DefaultStage', {
        httpApi: this,
        autoDeploy: true,
        domainMapping: props?.defaultDomainMapping,
      });
    }

    if (props?.createDefaultStage === false && props.defaultDomainMapping) {
      throw new Error('defaultDomainMapping not supported with createDefaultStage disabled',
      );
    }
  }

  /**
   * Get the URL to the default stage of this API.
   * Returns `undefined` if `createDefaultStage` is unset.
   */
  public get url(): string | undefined {
    return this.defaultStage ? this.defaultStage.url : undefined;
  }

  /**
   * Add a new stage.
   */
  public addStage(id: string, options: HttpStageOptions): HttpStage {
    const stage = new HttpStage(this, id, {
      httpApi: this,
      ...options,
    });
    return stage;
  }

  /**
   * Add multiple routes that uses the same configuration. The routes all go to the same path, but for different
   * methods.
   */
  public addRoutes(options: AddRoutesOptions): HttpRoute[] {
    const methods = options.methods ?? [ HttpMethod.ANY ];
    return methods.map((method) => new HttpRoute(this, `${method}${options.path}`, {
      httpApi: this,
      routeKey: HttpRouteKey.with(options.path, method),
      integration: options.integration,
    }));
  }
}
