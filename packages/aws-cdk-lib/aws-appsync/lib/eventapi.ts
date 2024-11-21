import { Construct } from 'constructs';
import { IResolvable, IResource, RemovalPolicy, Resource, Stack } from "../../core";
import { AuthorizationMode, AuthorizationType, ApiKeyConfig, UserPoolConfig, UserPoolDefaultAction, LambdaAuthorizerConfig, OpenIdConnectConfig } from "./auth-config";
import { LogConfig, FieldLogLevel } from "./graphqlapi";
import { Grant, IGrantable, ManagedPolicy, ServicePrincipal, Role } from '../../aws-iam';
import { ILogGroup, LogGroup, LogRetention, RetentionDays } from '../../aws-logs';
import { Token, Duration } from '../../core';
import { CfnApi, CfnApiKey } from "./appsync.generated";
import { IamResource } from './appsync-common';
import { ChannelNamespace, ChannelNamespaceOptions } from './channel-namespace';

/**
 * Authorization configuration for the Event API
 */
export interface EventApiAuthConfig {
  /**
   * Auth providers for use in connection,
   * publish, and subscribe operations.
   * @default - API Key authorization
   */
  readonly authProviders?: AuthorizationMode[];
  /**
   * Connection auth modes
   * @default - API Key authorization
   */
  readonly connectionAuthModes?: AuthorizationType[];

  /**
   * Default publish auth modes
   * @default - API Key authorization
   */
  readonly defaultPublishAuthModes?: AuthorizationType[];

  /**
   * Default subscribe auth modes
   * @default - API Key authorization
   */
  readonly defaultSubscribeAuthModes?: AuthorizationType[];
}

/**
 * Interface for Event API
 */
export interface IEventApi extends IResource {
  /**
 * an unique AWS AppSync Event API identifier
 * i.e. 'lxz775lwdrgcndgz3nurvac7oa'
 *
 * @attribute
 */
  readonly apiId: string;

  /**
   * the ARN of the Event API
   *
   * @attribute
   */
  readonly arn: string;

  /**
   * The Authorization Types for this Event Api
   */
  readonly authProviders: AuthorizationType[];

  /**
   * add a new channel namespace.
   * @param name the name of the channel namespace
   * @param options the options for the channel namespace
   * @returns the channel namespace
   */
  //addChannelNamespace(name: string, options?: ChannelNamespaceOptions): ChannelNamespace;

  /**
   * Adds an IAM policy statement associated with this Event API to an IAM
   * principal's policy.
   * 
   * @param grantee The principal
   * @param resources The set of resources to allow (i.e. ...:[region]:[accountId]:apis/EventApiId/...)
   * @param actions The actions that should be granted to the principal (i.e. appsync:EventPublish )
   */
  grant(grantee: IGrantable, resources: IamResource, ...actions: string[]): Grant;

  /**
   * Adds an IAM policy statement for EventPublish access to this EventApi to an IAM
   * principal's policy.
   *
   * @param grantee The principal
   * @param channelNamespace The channel namespaces to grant access to for Event Publish operations. Wild card supported.
   */
  grantPublish(grantee: IGrantable, ...channelNamespace: string[]): Grant;

  /**
   * Adds an IAM policy statement for EventSubscribe access to this EventApi to an IAM
   * principal's policy.
   *
   * @param grantee The principal
   * @param channelNamespace The channel namespaces to grant access to for Event Subscribe operations. Wild card supported.
   */
  grantSubscribe(grantee: IGrantable, ...channelNamespace: string[]): Grant;
}

/**
 * Base Class for Event API
 */
export abstract class EventApiBase extends Resource implements IEventApi {
  /**
   * an unique AWS AppSync Event API identifier
   * i.e. 'lxz775lwdrgcndgz3nurvac7oa'
   */
  public abstract readonly apiId: string;

  /**
   * the ARN of the API
   */
  public abstract readonly arn: string;

  /**
   * the domain name of the API
   */
  public abstract readonly endpointDns: IResolvable;

  /**
   * The Authorization Types for this Event Api
  */
  public abstract readonly authProviders: AuthorizationType[];

  /**
   * add a new Channel Namespace to this API
   */
  public addChannelNamespace(id: string, name: string, options?: ChannelNamespaceOptions): ChannelNamespace {
    return new ChannelNamespace(this, id, {
      api: this,
      name: name,
      ...options
    });
  }

    /**
   * Adds an IAM policy statement associated with this Event API to an IAM
   * principal's policy.
   * 
   * @param grantee The principal
   * @param resources The set of resources to allow (i.e. ...:[region]:[accountId]:apis/EventApiId/...)
   * @param actions The actions that should be granted to the principal (i.e. appsync:EventPublish )
   */
    public grant(grantee: IGrantable, resources: IamResource, ...actions: string[]): Grant {
      return Grant.addToPrincipal({
        grantee,
        actions,
        resourceArns: resources.resourceArns(this),
        scope: this,
      });
    }

    /**
     * Adds an IAM policy statement for EventPublish access to this EventApi to an IAM
     * principal's policy.
     *
     * @param grantee The principal
     * @param channelNamespace The channel namespaces to grant access to for Event Publish operations. Wild card supported.
     */
    public grantPublish(grantee: IGrantable, ...channelNamespace: string[]): Grant {
      return this.grant(grantee, IamResource.custom(...channelNamespace), 'appsync:EventPublish');
    }
  
    /**
     * Adds an IAM policy statement for EventSubscribe access to this EventApi to an IAM
     * principal's policy.
     *
     * @param grantee The principal
     * @param channelNamespace The channel namespaces to grant access to for Event Subscribe operations. Wild card supported.
     */
    public grantSubscribe(grantee: IGrantable, ...channelNamespace: string[]): Grant {
      return this.grant(grantee, IamResource.custom(...channelNamespace), 'appsync:EventSubscribe')
    }
}

/**
 * Properties for an AppSync Event API
 */
export interface EventApiProps {
  /**
   * the name of the Event API
   */
  readonly name: string;

  /**
   * Optional authorization configuration
   *
   * @default - API Key authorization
   */
  readonly authorizationConfig?: EventApiAuthConfig;

  /**
   * Logging configuration for this api
   *
   * @default - None
   */
  readonly logConfig?: LogConfig;

  /**
   * The owner contact information for an API resource.
   *
   * This field accepts any string input with a length of 0 - 256 characters.
   *
   * @default - No owner contact.
   */
  readonly ownerContact?: string;
}

/**
 * Attributes for Event API imports
 */
export interface EventApiAttributes {
  /**
   * an unique AWS AppSync Event API identifier
   * i.e. 'lxz775lwdrgcndgz3nurvac7oa'
   */
  readonly apiId: string;

  /**
   * the ARN of the Event API
   */
  readonly arn: string;

  /**
   * the domain name of the API
   */
  readonly endpointDns: IResolvable;

  /**
   * The Authorization Types for this Event Api
   * @default - none, required to construct event rules from imported APIs
   */
  readonly authProviders?: AuthorizationType[];
}

/**
 * An AppSync Event API
 *
 * @resource AWS::AppSync::EventApi
 */
export class EventApi extends EventApiBase {
  /**
   * Import a Event API through this function
   *
   * @param scope scope
   * @param id id
   * @param attrs Event API Attributes of an API
   */
  public static fromEventApiAttributes(scope: Construct, id: string, attrs: EventApiAttributes): IEventApi {
    const arn = attrs.arn ?? Stack.of(scope).formatArn({
      service: 'appsync',
      resource: `apis/${attrs.apiId}`,
    });
    class Import extends EventApiBase {
      public readonly apiId = attrs.apiId;
      public readonly arn = arn;
      public readonly endpointDns = attrs.endpointDns;
      public readonly authProviders = attrs.authProviders ?? []

      constructor(s: Construct, i: string) {
        super(s, i);
      }
    }
    return new Import(scope, id);
  }

  /**
   * an unique AWS AppSync Event API identifier
   * i.e. 'lxz775lwdrgcndgz3nurvac7oa'
   */
  public readonly apiId: string;

  /**
   * the ARN of the API
   */
  public readonly arn: string;

  /**
   * the domain name of the API
   */
  public readonly endpointDns: IResolvable;

  /**
   * The Authorization Types for this Event Api
  */
  public readonly authProviders: AuthorizationType[];

  /**
   * the configured API key, if present
   *
   * @default - no api key
   */
  public readonly apiKey?: string;

  /**
   * the CloudWatch Log Group for this API
   */
  public readonly logGroup: ILogGroup;

  private api: CfnApi;
  private eventConfig: CfnApi.EventConfigProperty;
  private apiKeyResource?: CfnApiKey;

  constructor(scope: Construct, id: string, props: EventApiProps) {
    super(scope, id);

    this.authProviders = this.setupAuthorizationProviders(props.authorizationConfig?.authProviders);

    const authConfig = props.authorizationConfig?.authProviders ?? [{ authorizationType: AuthorizationType.API_KEY }];
    this.validateAuthorizationProps(authConfig);

    const connectionAuthMode = props.authorizationConfig?.connectionAuthModes ??
      [AuthorizationType.API_KEY];
    const defaultPublishAuthModes = props.authorizationConfig?.defaultPublishAuthModes ??
      [AuthorizationType.API_KEY];
    const defaultSubscribeAuthModes = props.authorizationConfig?.defaultSubscribeAuthModes ??
      [AuthorizationType.API_KEY];
    
    this.validateAuthorizationConfig(authConfig, connectionAuthMode);
    this.validateAuthorizationConfig(authConfig, defaultPublishAuthModes);
    this.validateAuthorizationConfig(authConfig, defaultSubscribeAuthModes);

    if (!Token.isUnresolved(props.ownerContact) && props.ownerContact !== undefined && (props.ownerContact.length > 256)) {
      throw new Error('You must specify `ownerContact` as a string of 256 characters or less.');
    }

    this.eventConfig = {
      authProviders: this.mapAuthorizationProviders(authConfig),
      connectionAuthModes: this.mapAuthorizationConfig(authConfig, connectionAuthMode),
      defaultPublishAuthModes: this.mapAuthorizationConfig(authConfig, defaultPublishAuthModes),
      defaultSubscribeAuthModes: this.mapAuthorizationConfig(authConfig, defaultSubscribeAuthModes),
      logConfig: this.setupLogConfig(props.logConfig)
    };

    this.api = new CfnApi(this, 'Resource', {
      name: props.name,
      eventConfig: this.eventConfig,
      ownerContact: props.ownerContact,
    });

    this.api.applyRemovalPolicy(RemovalPolicy.DESTROY);

    this.apiId = this.api.attrApiId;
    this.arn = this.api.attrApiArn;
    this.endpointDns = this.api.attrDns;
  
    if (authConfig.some((mode) => mode.authorizationType === AuthorizationType.API_KEY)) {
      const config = authConfig.find((mode: AuthorizationMode) => {
        return mode.authorizationType === AuthorizationType.API_KEY && mode.apiKeyConfig;
      })?.apiKeyConfig;
      this.apiKeyResource = this.createAPIKey(config);
      this.apiKey = this.apiKeyResource.attrApiKey;
    }

    if (authConfig.some((mode) => mode.authorizationType === AuthorizationType.LAMBDA)) {
      const config = authConfig.find((mode: AuthorizationMode) => {
        return mode.authorizationType === AuthorizationType.LAMBDA && mode.lambdaAuthorizerConfig;
      })?.lambdaAuthorizerConfig;

      config?.handler.addPermission(`${id}-appsync`, {
        principal: new ServicePrincipal('appsync.amazonaws.com'),
        action: 'lambda:InvokeFunction',
        sourceArn: this.arn,
      });
    }

    const logGroupName = `/aws/appsync/apis/${this.apiId}`;

    if (props.logConfig) {
      const logRetention = new LogRetention(this, 'LogRetention', {
        logGroupName: logGroupName,
        retention: props.logConfig?.retention ?? RetentionDays.INFINITE,
      });
      this.logGroup = LogGroup.fromLogGroupArn(this, 'LogGroup', logRetention.logGroupArn);
    } else {
      this.logGroup = LogGroup.fromLogGroupName(this, 'LogGroup', logGroupName);
    }
  }

  private setupLogConfig(config?: LogConfig) {
    if (!config) return undefined;
    const logsRoleArn: string = config.role?.roleArn ?? new Role(this, 'ApiLogsRole', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppSyncPushToCloudWatchLogs'),
      ],
    }).roleArn;
    const fieldLogLevel: FieldLogLevel = config.fieldLogLevel ?? FieldLogLevel.NONE;
    return {
      cloudWatchLogsRoleArn: logsRoleArn,
      logLevel: fieldLogLevel,
    };
  }

  private setupOpenIdConnectConfig(config?: OpenIdConnectConfig) {
    if (!config) return undefined;
    return {
      authTtl: config.tokenExpiryFromAuth,
      clientId: config.clientId,
      iatTtl: config.tokenExpiryFromIssue,
      issuer: config.oidcProvider,
    };
  }

  private setupUserPoolConfig(config?: UserPoolConfig) {
    if (!config) return undefined;
    return {
      userPoolId: config.userPool.userPoolId,
      awsRegion: config.userPool.env.region,
      appIdClientRegex: config.appIdClientRegex,
      defaultAction: config.defaultAction || UserPoolDefaultAction.ALLOW,
    };
  }

  private setupLambdaAuthorizerConfig(config?: LambdaAuthorizerConfig) {
    if (!config) return undefined;
    return {
      authorizerResultTtlInSeconds: config.resultsCacheTtl?.toSeconds(),
      authorizerUri: config.handler.functionArn,
      identityValidationExpression: config.validationRegex,
    };
  }

  private setupAuthorizationProviders(authProviders?: AuthorizationMode[]) {
    if (!authProviders || authProviders.length === 0) return [ AuthorizationType.API_KEY ];
    const modes = authProviders.map((mode) => mode.authorizationType);
    return modes;
  }

  private mapAuthorizationProviders(authProviders: AuthorizationMode[]) {
    return authProviders.reduce<CfnApi.AuthProviderProperty[]>((acc, mode) => [
      ...acc, {
        authType: mode.authorizationType,
        cognitoConfig: this.setupUserPoolConfig(mode.userPoolConfig),
        openIdConnectConfig: this.setupOpenIdConnectConfig(mode.openIdConnectConfig),
        lambdaAuthorizerConfig: this.setupLambdaAuthorizerConfig(mode.lambdaAuthorizerConfig),
      },
    ], []);
  }

  private mapAuthorizationConfig(authProviders: AuthorizationMode[], authModes: AuthorizationType[]) {
    return authProviders.reduce<CfnApi.AuthProviderProperty[]>((acc, mode) => {
      if (authModes.includes(mode.authorizationType)) {
        return [
          ...acc, {
            authType: mode.authorizationType,
            cognitoConfig: this.setupUserPoolConfig(mode.userPoolConfig),
            openIdConnectConfig: this.setupOpenIdConnectConfig(mode.openIdConnectConfig),
            lambdaAuthorizerConfig: this.setupLambdaAuthorizerConfig(mode.lambdaAuthorizerConfig),
          },
        ];
      }
      return acc;
    }, []);
  }

  private createAPIKey(config?: ApiKeyConfig) {
    if (config?.expires?.isBefore(Duration.days(1)) || config?.expires?.isAfter(Duration.days(365))) {
      throw Error('API key expiration must be between 1 and 365 days.');
    }
    const expires = config?.expires ? config?.expires.toEpoch() : undefined;
    return new CfnApiKey(this, `${config?.name || 'Default'}ApiKey`, {
      expires,
      description: config?.description,
      apiId: this.apiId,
    });
  }

  private validateAuthorizationProps(authProviders: AuthorizationMode[]) {
    if (authProviders.filter((authProvider) => authProvider.authorizationType === AuthorizationType.LAMBDA).length > 1) {
      throw new Error('You can only have a single AWS Lambda function configured to authorize your API.');
    }
    authProviders.map((authProvider) => {
      if (authProvider.authorizationType === AuthorizationType.OIDC && !authProvider.openIdConnectConfig) {
        throw new Error('Missing OIDC Configuration');
      }
      if (authProvider.authorizationType === AuthorizationType.USER_POOL && !authProvider.userPoolConfig) {
        throw new Error('Missing User Pool Configuration');
      }
      if (authProvider.authorizationType === AuthorizationType.LAMBDA && !authProvider.lambdaAuthorizerConfig) {
        throw new Error('Missing Lambda Configuration');
      }
    });
    if (authProviders.filter((authProvider) => authProvider.authorizationType === AuthorizationType.API_KEY).length > 1) {
      throw new Error('You can\'t duplicate API_KEY configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
    }
    if (authProviders.filter((authProvider) => authProvider.authorizationType === AuthorizationType.IAM).length > 1) {
      throw new Error('You can\'t duplicate IAM configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
    }
  }

  private validateAuthorizationConfig(authProviders: AuthorizationMode[], authModes: AuthorizationType[]) {
    authModes.forEach((mode) => {
      if (!authProviders.find((authProvider) => authProvider.authorizationType === mode)) {
        throw new Error(`Missing authorization configuration for ${mode}`);
      }
    });
  }

}