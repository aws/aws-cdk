import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnApi, CfnApiProps } from './apigatewayv2.generated';
import { Stage, StageName } from './stage';
// import { AddRoutesOptions, HttpMethod, Route } from './route';

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

  // /**
  //  * target lambda function of lambda proxy integration for the $default route
  //  *
  //  * @default - None. Specify either `targetHandler` or `targetUrl`
  //  */
  // readonly targetHandler?: lambda.IFunction;

  /**
   * Whether a default stage and deployment should be automatically created.
   * @default true
   */
  readonly createDefaultStage?: boolean;
}

/**
 * Create a new API Gateway HTTP API endpoint.
 *
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
  private readonly defaultStage: Stage | undefined;

  constructor(scope: Construct, id: string, props?: HttpApiProps) {
    super(scope, id);

    const apiName = props?.apiName ?? id;

    const apiProps: CfnApiProps = {
      name: apiName,
      protocolType: 'HTTP',
    };
    const resource = new CfnApi(this, 'Resource', apiProps);
    this.httpApiId = resource.ref;

    if (props?.createDefaultStage === undefined || props.createDefaultStage === true) {
      this.defaultStage = new Stage(this, 'DefaultStage', {
        httpApi: this,
        stageName: StageName.DEFAULT,
      });
    }

    // if (props?.targetHandler) {
    //   const desc = `${this.node.uniqueId}.'ANY'`;
    //   props.targetHandler.addPermission(`ApiPermission.${desc}`, {
    //     scope,
    //     principal: new ServicePrincipal('apigateway.amazonaws.com'),
    //     sourceArn: `arn:${Stack.of(this).partition}:execute-api:${Stack.of(this).region}:${Stack.of(this).account}:${this.httpApiId}/*/*`,
    //   } );
    // }
  }

  /**
   * Get the URL to the default stage of this API.
   * Returns `undefined` if `createDefaultStage` is unset.
   */
  public get url(): string | undefined {
    return this.defaultStage ? this.defaultStage.url : undefined;
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