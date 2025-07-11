import { Construct } from 'constructs';
import { IWebSocketApi } from './api';
import { CfnStage } from '.././index';
import { Grant, IGrantable } from '../../../aws-iam';
import { Lazy, Stack } from '../../../core';
import { ValidationError } from '../../../core/lib/errors';
import { addConstructMetadata, MethodMetadata } from '../../../core/lib/metadata-resource';
import { propertyInjectable } from '../../../core/lib/prop-injectable';
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
@propertyInjectable
export class WebSocketStage extends StageBase implements IWebSocketStage {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-apigatewayv2.WebSocketStage';

  /**
   * Import an existing stage into this CDK app.
   */
  public static fromWebSocketStageAttributes(scope: Construct, id: string, attrs: WebSocketStageAttributes): IWebSocketStage {
    class Import extends StageBase implements IWebSocketStage {
      public readonly baseApi = attrs.api;
      public readonly stageName = attrs.stageName;
      public readonly api = attrs.api;

      get url(): string {
        throw new ValidationError('url is not available for imported stages.', scope);
      }

      get callbackUrl(): string {
        throw new ValidationError('callback url is not available for imported stages.', scope);
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
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.stageVariables) {
      Object.entries(props.stageVariables).forEach(([key, value]) => {
        this.addStageVariable(key, value);
      });
    }

    this.baseApi = props.webSocketApi;
    this.api = props.webSocketApi;
    this.stageName = this.physicalName;

    new CfnStage(this, 'Resource', {
      apiId: props.webSocketApi.apiId,
      stageName: this.physicalName,
      autoDeploy: props.autoDeploy,
      defaultRouteSettings: props.throttle || props.detailedMetricsEnabled ? {
        throttlingBurstLimit: props.throttle?.burstLimit,
        throttlingRateLimit: props.throttle?.rateLimit,
        detailedMetricsEnabled: props.detailedMetricsEnabled,
      } : undefined,
      description: props.description,
      stageVariables: Lazy.any({ produce: () => this._stageVariables }),
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
  @MethodMetadata()
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
