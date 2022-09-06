import { CfnAccount } from '@aws-cdk/aws-apigateway';
import { Grant, IGrantable, Role, ServicePrincipal, ManagedPolicy } from '@aws-cdk/aws-iam';
import { CfnLogGroup } from '@aws-cdk/aws-logs';
import { RemovalPolicy, Stack, PhysicalName } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnStage } from '../apigatewayv2.generated';
import { StageOptions, IApi, IStage, StageAttributes, defaultAccessLogFormat } from '../common';
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

  /**
   * The logging level for data trace logging.  This is available only for
   * websocket apis.  Allowed values are OFF, INFO or ERROR.
   *
   * @default - OFF. No data trace logs will be generated.
   */
  readonly dataTraceLoggingLevel?: string;

  /**
   * If true it stops the creation of a data trace log group, which 
   * controls the retention properties of the group.  Set to true
   * if the default behavior (no limit on log entry retentions, group
   * is not deleted when it's parent stack is deleted) is desired or
   * if the caller has already created the log group. Note that this
   * setting has no effect if dataTraceLoggingLevel isn't specified or
   * is set to OFF.
   * 
   * @default - false
   */
  readonly inhibitDataTraceLogGroupCreation?: boolean;
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

    /**
     * In CfnStage the rate limits, the data trace logging control and the detailed
     * metrics are all lumped together in the default route settings, but they're
     * conceptually orthogonal.  I'm following the pattern that was started by
     * breaking out the rate limits to break out the conceptually distinct
     * throttle settings, data trace logging settings and access log settings.
     */
    const rateLimits = !props.throttle ? undefined : {
      throttlingBurstLimit: !props.throttle.burstLimit ? undefined : props.throttle.burstLimit,
      throttlingRateLimit: !props.throttle.rateLimit ? undefined : props.throttle.rateLimit,
    };

    /**
     * The data trace log settings for CfnStage use two parameters, dataTraceEnabled to
     * turn on the logging and a logging level.  However, specifing a logging level of
     * OFF is the same as disabling data tracing and setting it to INFO or ERROR implies
     * that data tracing is on, so the value of the logging flag is being deduced from
     * the value of the log level.
     */
    const dataTraceLoggingSettings =
      (!props.dataTraceLoggingLevel || props.dataTraceLoggingLevel === 'OFF') ?
        undefined :
        {
          dataTraceEnabled: true,
          loggingLevel: props.dataTraceLoggingLevel,
        };

    // If the user has turned on data access logging and hasn't inhibited the creation
    // of the data access log group, create the group with 30 day retention and have it 
    // be deleted when the stack that contains it is deleted.  This is far more likely to
    // be reasonable behavior from a user point of view than the default (i.e. no limit on
    // log entry retention and the group is retained when the stack that contains it is deleted)
    if (props.dataTraceLoggingLevel && props.dataTraceLoggingLevel !== 'OFF' && !props.inhibitDataTraceLogGroupCreation){
      const dataLoggingLogGroup = new CfnLogGroup(this, 'data-trace-logging-log-group', {
        logGroupName: `/aws/apigateway/${props.webSocketApi.apiId}/${this.physicalName}`,
        retentionInDays: 30
      });
      dataLoggingLogGroup.applyRemovalPolicy(RemovalPolicy.DESTROY);
    }

    let destinationArn: string | undefined = undefined;
    if (props.accessLogEnabled) {
      if (!props.accessLogGroupArn) {
        // We need to set up the right permissions to create the log group.
        const iamRoleForLogGroup = new Role(this, 'IAMRoleForAccessLog', {
          roleName: PhysicalName.GENERATE_IF_NEEDED,
          assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
        });
        iamRoleForLogGroup.applyRemovalPolicy(RemovalPolicy.DESTROY);
        iamRoleForLogGroup.node.addDependency(this.api);

        iamRoleForLogGroup.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonAPIGatewayPushToCloudWatchLogs'));

        // It's required to register the iam role that is used to create the log group with the account
        // if an api gateway has never been created in this account/region before.  Otherwise, this is
        // a no-op.
        const account = new CfnAccount(this, 'account', {
          cloudWatchRoleArn: iamRoleForLogGroup.roleArn,
        });
        account.node.addDependency(this.api);

        // Setting up some reasonable defaults for the retention policy and removal policy.
        // If the user wants something different they should create their own log group.
        const accessLogsLogGroup = new CfnLogGroup(this, 'AccessLoggingGroup', {
          retentionInDays: 30,
        });
        accessLogsLogGroup.applyRemovalPolicy(RemovalPolicy.DESTROY);

        destinationArn = accessLogsLogGroup.attrArn;
      } else {
        destinationArn = props.accessLogGroupArn;
      }
    }

    const accessLogSettings = !props.accessLogEnabled ? undefined : {
      destinationArn,
      format: !props.accessLogFormat ? defaultAccessLogFormat : props.accessLogFormat,
    };

    const defaultRouteSettings =
      !dataTraceLoggingSettings && !rateLimits ?
        undefined :
        { ...dataTraceLoggingSettings, ...rateLimits };

    new CfnStage(this, 'Resource', {
      apiId: props.webSocketApi.apiId,
      stageName: this.physicalName,
      autoDeploy: props.autoDeploy,
      defaultRouteSettings,
      accessLogSettings,
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
