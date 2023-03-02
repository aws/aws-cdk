import { Grant, IGrantable } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IWebSocketApi } from './api';
import { CfnStage } from '../apigatewayv2.generated';
import { StageOptions, IApi, IStage, StageAttributes } from '../common';
import { StageBase } from '../common/base';

/**
 * Represents the WebSocketStage
 */
export interface IWebSocketStage extends IStage {
  /**
   * The API this stage is associated to.
   */
  readonly api: IWebSocketApi;

  /**
   * The callback URL to this stage.
   * You can use the callback URL to send messages to the client from the backend system.
   * https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-basic-concept.html
   * https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-how-to-call-websocket-api-connections.html
   */
  readonly callbackUrl: string;
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

      get callbackUrl(): string {
        throw new Error('callback url is not available for imported stages.');
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
      defaultRouteSettings: !props.throttle ? undefined : {
        throttlingBurstLimit: props.throttle?.burstLimit,
        throttlingRateLimit: props.throttle?.rateLimit,
      },
    });

    if (props.domainMapping) {
      this._addDomainMapping(props.domainMapping);
    }
  }

  /**
   * The websocket URL to this stage.
   */
  public get url(): string {
    const s = Stack.of(this);
    const urlPath = this.stageName;
    return `wss://${this.api.apiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}`;
  }

  /**
   * The callback URL to this stage.
   */
  public get callbackUrl(): string {
    const s = Stack.of(this);
    const urlPath = this.stageName;
    return `https://${this.api.apiId}.execute-api.${s.region}.${s.urlSuffix}/${urlPath}`;
  }

  /**
   * Grant access to the API Gateway management API for this WebSocket API Stage to an IAM
   * principal (Role/Group/User).
   *
   * @param identity The principal
   */
  public grantManagementApiAccess(identity: IGrantable): Grant {
    const arn = Stack.of(this.api).formatArn({
      service: 'execute-api',
      resource: this.api.apiId,
    });

    return Grant.addToPrincipal({
      grantee: identity,
      actions: ['execute-api:ManageConnections'],
      resourceArns: [`${arn}/${this.stageName}/*/@connections/*`],
    });
  }
}
