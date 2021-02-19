import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnStage } from '../apigatewayv2.generated';
import { CommonStageOptions, StageBase } from '../common';
import { IApi } from '../common/api';
import { IWebSocketApi } from './api';

/**
 * Properties to initialize an instance of `WebSocketStage`.
 */
export interface WebSocketStageProps extends CommonStageOptions {
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
 * Represents a stage where an instance of the API is deployed.
 * @resource AWS::ApiGatewayV2::Stage
 */
export class WebSocketStage extends StageBase {
  public readonly stageName: string;
  protected readonly api: IApi;

  constructor(scope: Construct, id: string, props: WebSocketStageProps) {
    super(scope, id, {
      physicalName: props.stageName,
    });

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
