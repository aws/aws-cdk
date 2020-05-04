import { Construct, Resource, Stack } from '@aws-cdk/core';
import { CfnStage } from '../apigatewayv2.generated';
import { CommonStageOptions, IStage } from '../common';
import { IHttpApi } from './api';

const DEFAULT_STAGE_NAME = '$default';

/**
 * Options to create a new stage for an HTTP API.
 */
export interface HttpStageOptions extends CommonStageOptions {
}

/**
 * Properties to initialize an instance of `HttpStage`.
 */
export interface HttpStageProps extends HttpStageOptions {
  /**
   * The HTTP API to which this stage is associated.
   */
  readonly httpApi: IHttpApi;
}

/**
 * Represents a stage where an instance of the API is deployed.
 * @resource AWS::ApiGatewayV2::Stage
 */
export class HttpStage extends Resource implements IStage {
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

  constructor(scope: Construct, id: string, props: HttpStageProps) {
    super(scope, id, {
      physicalName: props.stageName ? props.stageName : DEFAULT_STAGE_NAME,
    });

    new CfnStage(this, 'Resource', {
      apiId: props.httpApi.httpApiId,
      stageName: this.physicalName,
      autoDeploy: props.autoDeploy,
    });

    this.stageName = this.physicalName;
    this.httpApi = props.httpApi;
  }

  /**
   * The URL to this stage.
   */
  public get url(): string {
    const s = Stack.of(this);
    const urlPath = this.stageName === DEFAULT_STAGE_NAME ? '' : this.stageName;
    return `https://${this.httpApi.httpApiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}`;
  }
}