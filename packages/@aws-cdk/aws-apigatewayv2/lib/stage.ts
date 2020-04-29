import { Construct, IResource, Resource, Stack } from '@aws-cdk/core';
import { IHttpApi } from './api';
import { CfnStage } from './apigatewayv2.generated';

/**
 * Represents a APIGatewayV2 Stage for the HTTP API.
 */
export interface IStage extends IResource {
  /**
   * The name of the stage; its primary identifier.
   */
  readonly stageName: string;
}

/**
 * A type to be used while specifying stage name for a new Stage.
 */
export class StageName {
  /**
   * The default stage of the HTTP API.
   * This stage will have the URL at the root of the API endpoint.
   */
  public static readonly DEFAULT = new StageName('$default');

  /**
   * The name of this stage.
   * This will be used to both the primary identifier of this stage, as well as,
   * the path component of the API endpoint - 'https://<api-id>.execute-api.<region>.amazonaws.com/<stage name>'.
   */
  public static of(stageName: string) {
    return new StageName(stageName);
  }

  private constructor(public readonly stageName: string) {
  }
}

/**
 * Options to create a new stage.
 */
export interface StageOptions {
  /**
   * The name of the stage. See `StageName` class for more details.
   * @default StageName.DEFAULT
   */
  readonly stageName?: StageName;

  /**
   * Whether updates to an API automatically trigger a new deployment.
   * @default false
   */
  readonly autoDeploy?: boolean;
}

/**
 * Properties to initialize an instance of `Stage`.
 */
export interface StageProps extends StageOptions {
  readonly httpApi: IHttpApi;
}

/**
 * Represents a stage where an instance of the API is deployed.
 * @resource AWS::ApiGatewayV2::Stage
 */
export class Stage extends Resource implements IStage {
  /**
   * Import an existing stage into this CDK app.
   */
  public static fromStageName(scope: Construct, id: string, stageName: string): IStage {
    class Import extends Resource implements IStage {
      public readonly stageName = stageName;
    }
    return new Import(scope, id);
  }

  public readonly stageName: string;
  private httpApi: IHttpApi;

  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, {
      physicalName: props.stageName ? props.stageName.stageName : StageName.DEFAULT.stageName,
    });

    const resource = new CfnStage(this, 'Resource', {
      apiId: props.httpApi.httpApiId,
      stageName: this.physicalName,
      autoDeploy: props.autoDeploy,
    });

    this.stageName = resource.ref;
    this.httpApi = props.httpApi;
  }

  /**
   * The URL to this stage.
   */
  public get url() {
    const s = Stack.of(this);
    const urlPath = this.stageName === StageName.DEFAULT.stageName ? '' : this.stageName;
    return `https://${this.httpApi.httpApiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}`;
  }
}