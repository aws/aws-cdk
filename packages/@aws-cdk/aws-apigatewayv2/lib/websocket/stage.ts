import { Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnStage } from '../apigatewayv2.generated';
import { IStage } from '../common';
import { IWebSocketApi } from './api';

const DEFAULT_STAGE_NAME = 'dev';

/**
 * Represents the WebSocketStage
 */
export interface IWebSocketStage extends IStage {
}

/**
 * Properties to initialize an instance of `WebSocketStage`.
 */
export interface WebSocketStageProps {
  /**
   * The WebSocket API to which this stage is associated.
   */
  readonly webSocketApi: IWebSocketApi;

  /**
   * The name of the stage.
   */
  readonly stageName: string;

  /**
   * Whether updates to an API automatically trigger a new deployment.
   * @default false
   */
  readonly autoDeploy?: boolean;
}

/**
 * Represents a stage where an instance of the API is deployed.
 * @resource AWS::ApiGatewayV2::Stage
 */
export class WebSocketStage extends Resource implements IWebSocketStage {
  public readonly stageName: string;
  private webSocketApi: IWebSocketApi;

  constructor(scope: Construct, id: string, props: WebSocketStageProps) {
    super(scope, id, {
      physicalName: props.stageName ? props.stageName : DEFAULT_STAGE_NAME,
    });

    this.webSocketApi = props.webSocketApi;
    this.stageName = this.physicalName;

    new CfnStage(this, 'Resource', {
      apiId: props.webSocketApi.webSocketApiId,
      stageName: this.physicalName,
      autoDeploy: props.autoDeploy,
    });
  }

  /**
   * The URL to this stage.
   */
  public get url(): string {
    const s = Stack.of(this);
    const urlPath = this.stageName;
    return `wss://${this.webSocketApi.webSocketApiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}`;
  }
}
