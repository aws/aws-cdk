import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnApi, CfnApiProps } from '../apigatewayv2.generated';
import { IHttpRouteIntegration } from './integration';
import { HttpRoute, HttpRouteKey } from './route';
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
  private readonly defaultStage: HttpStage | undefined;

  constructor(scope: Construct, id: string, props?: HttpApiProps) {
    super(scope, id);

    const apiName = props?.apiName ?? id;

    const apiProps: CfnApiProps = {
      name: apiName,
      protocolType: 'HTTP',
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
      });
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
    return new HttpStage(this, id, {
      httpApi: this,
      ...options,
    });
  }

  /**
   * add routes on this API
   */
  // public addRoutes(pathPart: string, id: string, options: AddRoutesOptions): Route[] {
  //   const routes: Route[] = [];
  //   const methods = options.methods ?? [ HttpMethod.ANY ];
  //   for (const m of methods) {
  //     routes.push(new Route(this, `${id}${m}`, {
  //       api: this,
  //       integration: options.integration,
  //       httpMethod: m,
  //       httpPath: pathPart,
  //     }));
  //   }
  //   return routes;
  // }
}