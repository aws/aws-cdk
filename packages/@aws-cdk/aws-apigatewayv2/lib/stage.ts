import { Construct, IResource, Resource } from '@aws-cdk/core';

import { IApi } from './api';
import { CfnStage } from './apigatewayv2.generated';
import { Deployment, IDeployment } from './deployment';

/**
 * Specifies the logging level for this route. This property affects the log entries pushed to Amazon CloudWatch Logs.
 */
export enum LoggingLevel {
  /**
   * Displays all log information
   */
  INFO = "INFO",

  /**
   * Only displays errors
   */
  ERROR = "ERROR",

  /**
   * Logging is turned off
   */
  OFF = "OFF"
}

/**
 * Route settings for the stage.
 */
export interface RouteSettings {
  /**
   * Specifies whether (true) or not (false) data trace logging is enabled for this route.
   *
   * This property affects the log entries pushed to Amazon CloudWatch Logs.
   *
   * Supported only for WebSocket APIs.
   *
   * @default false
   */
  readonly dataTraceEnabled?: boolean;

  /**
   * Specifies whether detailed metrics are enabled.
   *
   * @default false
   */
  readonly detailedMetricsEnabled?: boolean;

  /**
   * Specifies the logging level for this route.This property affects the log entries pushed to Amazon CloudWatch Logs.
   *
   * Supported only for WebSocket APIs.
   *
   * @default - default logging level
   */
  readonly loggingLevel?: LoggingLevel | string;

  /**
   * Specifies the throttling burst limit.
   *
   * @default - default throttling
   */
  readonly throttlingBurstLimit?: number;

  /**
   * Specifies the throttling rate limit.
   *
   * @default - default throttling
   */
  readonly throttlingRateLimit?: number;
}

/**
 * Settings for logging access in a stage.
 */
export interface AccessLogSettings {
  /**
   * The ARN of the CloudWatch Logs log group to receive access logs.
   *
   * @default - do not use CloudWatch Logs
   */
  readonly destinationArn?: string;

  /**
   * A single line format of the access logs of data, as specified by selected $context variables.
   * The format must include at least $context.requestId.
   *
   * @default - default format
   */
  readonly format?: string;
}

/**
 * Defines the contract for an Api Gateway V2 Stage.
 */
export interface IStage extends IResource {
  /**
   * The name of this API Gateway Stage.
   * @attribute
   */
  readonly stageName: string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Stage.
 */
export interface StageOptions {
  /**
   * The stage name. Stage names can only contain alphanumeric characters, hyphens, and underscores. Maximum length is 128 characters.
   */
  readonly stageName: string;

  /**
   * Specifies whether updates to an API automatically trigger a new deployment.
   *
   * @default false
   */
  readonly autoDeploy?: boolean;

  /**
   * Settings for logging access in this stage
   *
   * @default - default nog settings
   */
  readonly accessLogSettings?: AccessLogSettings;

  /**
   * The identifier of a client certificate for a Stage.
   *
   * Supported only for WebSocket APIs.
   *
   * @default - no certificate
   */
  readonly clientCertificateId?: string;

  /**
   * The default route settings for the stage.
   *
   * @default - default values
   */
  readonly defaultRouteSettings?: RouteSettings;

  /**
   * Route settings for the stage.
   *
   * @default - default route settings
   */
  readonly routeSettings?: { [key: string]: RouteSettings };

  /**
   * The description for the API stage.
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * A map that defines the stage variables for a Stage.
   * Variable names can have alphanumeric and underscore
   * characters, and the values must match [A-Za-z0-9-._~:/?#&=,]+.
   *
   * @default - no stage variables
   */
  readonly stageVariables?: { [key: string]: string };

  // TODO: Tags
}

/**
 * Defines the properties required for defining an Api Gateway V2 Stage.
 */
export interface StageProps extends StageOptions {
  /**
   * Defines the api for this stage.
   */
  readonly api: IApi;

  /**
   * The deployment for the API stage. Can't be updated if autoDeploy is enabled.
   */
  readonly deployment: IDeployment;
}

/**
 * A stage for a route for an API in Amazon API Gateway v2.
 */
export class Stage extends Resource implements IStage {
  /**
   * Creates a new imported Stage
   *
   * @param scope scope of this imported resource
   * @param id identifier of the resource
   * @param stageName Identifier of the API
   */
  public static fromStageName(scope: Construct, id: string, stageName: string): IStage {
    class Import extends Resource implements IStage {
      public readonly stageName = stageName;
    }

    return new Import(scope, id);
  }

  /**
   * The name of this API Gateway Stage.
   */
  public readonly stageName: string;

  protected resource: CfnStage;

  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id);

    this.resource = new CfnStage(this, 'Resource', {
      ...props,
      apiId: props.api.apiId,
      deploymentId: props.deployment.deploymentId
    });
    this.stageName = this.resource.ref;

    if (props.deployment instanceof Deployment) {
      props.deployment.addToLogicalId({
        ...props,
        api: props.api.apiId,
        deployment: props.deployment.deploymentId,
        id
      });
    }
  }
}