import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnStage } from '../apigatewayv2.generated';
import { StageOptions, IApi, IStage, StageAttributes } from '../common';
import { StageBase } from '../common/base';
import { IWebSocketApi } from './api';

/**
 * Represents the WebSocketStage
 */
export interface IWebSocketStage extends IStage {
  /**
   * The API this stage is associated to.
   */
  readonly api: IWebSocketApi;
}

/**
 * Properties to initialize an instance of `WebSocketStage`.
 */
export interface WebSocketStageProps extends StageOptions {
  /**
   * The WebSocket API to which this stage is associated.
   */
  readonly webSocketApi: IWebSocketApi;

  /**
   * The name of the stage.
   */
  readonly stageName: string;
}

/**
 * The attributes used to import existing WebSocketStage
 */
export interface WebSocketStageAttributes extends StageAttributes {
  /**
   * The API to which this stage is associated
   */
  readonly api: IWebSocketApi;
}

/**
 * Represents a stage where an instance of the API is deployed.
 * @resource AWS::ApiGatewayV2::Stage
 */
export class WebSocketStage extends StageBase implements IWebSocketStage {
  /**
   * Import an existing stage into this CDK app.
   */
  public static fromWebSocketStageAttributes(scope: Construct, id: string, attrs: WebSocketStageAttributes): IWebSocketStage {
    class Import extends StageBase implements IWebSocketStage {
      public readonly baseApi = attrs.api;
      public readonly stageName = attrs.stageName;
      public readonly api = attrs.api;

      get url(): string {
        throw new Error('url is not available for imported stages.');
      }
    }
    return new Import(scope, id);
  }

  protected readonly baseApi: IApi;
  public readonly stageName: string;
  public readonly api: IWebSocketApi;

  constructor(scope: Construct, id: string, props: WebSocketStageProps) {
    super(scope, id, {
      physicalName: props.stageName,
    });

    this.baseApi = props.webSocketApi;
    this.api = props.webSocketApi;
    this.stageName = this.physicalName;

    new CfnStage(this, 'Resource', {
      apiId: props.webSocketApi.apiId,
      stageName: this.physicalName,
      autoDeploy: props.autoDeploy,
    });

    if (props.domainMapping) {
      this._addDomainMapping(props.domainMapping);
    }
  }

  /**
   * The URL to this stage.
   */
  public get url(): string {
    const s = Stack.of(this);
    const urlPath = this.stageName;
    return `wss://${this.api.apiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}`;
  }
}
