import { Construct } from 'constructs';
import { ApiBase, IApi } from './api-base';
import { CfnApiKey, CfnApi } from './appsync.generated';
import { AuthorizationType, ApiKeyConfig, LambdaAuthorizerConfig, CognitoConfig, OpenIdConnectConfig, createAPIKey, setupOpenIdConnectConfig, setupCognitoConfig, setupLambdaAuthorizerConfig } from './auth-config';
import { IRole, ManagedPolicy, Role, ServicePrincipal } from '../../aws-iam';
import { ILogGroup, LogGroup, LogRetention, RetentionDays } from '../../aws-logs';
import { Lazy, Names, Stack, Token } from '../../core';

/**
 * Auth provider settings for sAppSync Event APIs
 *
 * @see https://docs.aws.amazon.com/appsync/latest/eventapi/configure-event-api-auth.html
 */
export class AuthProvider {
  /**
   * Enable API Key authorization. API Key will be automatically created.
   *
   * @param apiKeyConfig API Key config
   */
  public static apiKeyAuth(apiKeyConfig?: ApiKeyConfig): AuthProvider {
    return new AuthProvider(AuthorizationType.API_KEY, apiKeyConfig);
  }

  /**
   * Enable IAM authorization.
   */
  public static iamAuth(): AuthProvider {
    return new AuthProvider(AuthorizationType.IAM);
  }

  /**
   * Enable Cognito authorization.
   *
   * @param cognitoConfig Cognito authorization config
   */
  public static cognitoAuth(cognitoConfig: CognitoConfig): AuthProvider {
    return new AuthProvider(AuthorizationType.USER_POOL, undefined, cognitoConfig);
  }

  /**
   * Enable Open ID Connect authorization.
   *
   * @param openIdConnectConfig Open ID Connect authorization config
   */
  public static oidcAuth(openIdConnectConfig: OpenIdConnectConfig): AuthProvider {
    return new AuthProvider(AuthorizationType.OIDC, undefined, undefined, openIdConnectConfig);
  }

  /**
   * Enable Lambda authorization.
   *
   * @param lambdaAuthorizerConfig Lambda authorization config
   */
  public static lambdaAuth(lambdaAuthorizerConfig: LambdaAuthorizerConfig): AuthProvider {
    return new AuthProvider(AuthorizationType.LAMBDA, undefined, undefined, undefined, lambdaAuthorizerConfig);
  }

  /**
   * @param authorizationType AppSync authorization type
   * @param apiKeyConfig API Key config
   * @param cognitoConfig Cognito authorization config
   * @param openIdConnectConfig Open ID Connect authorization config
   * @param lambdaAuthorizerConfig Lambda authorization config
   */
  private constructor(
    readonly authorizationType: AuthorizationType,
    readonly apiKeyConfig?: ApiKeyConfig,
    readonly cognitoConfig?: CognitoConfig,
    readonly openIdConnectConfig?: OpenIdConnectConfig,
    readonly lambdaAuthorizerConfig?: LambdaAuthorizerConfig,
  ) { }
}

/**
 * log-level for handler in AppSync Event APIs
 */
export enum LogLevel {
  /**
   * Handler logging is disabled
   */
  NONE = 'NONE',
  /**
   * Only Error messages appear in logs
   */
  ERROR = 'ERROR',
  /**
   * Info and Error messages appear in logs
   */
  INFO = 'INFO',
  /**
   * Debug, Info, and Error messages, appear in logs
   */
  DEBUG = 'DEBUG',
  /**
   * All messages (Debug, Error, Info, and Trace) appear in logs
   */
  ALL = 'ALL',
}

/**
 * Logging configuration for AppSync Event APIs
 */
export interface EventLogConfig {
  /**
   * The type of information to log for the Event API
   *
   * @default - Use AppSync default
   */
  readonly logLevel?: LogLevel;

  /**
   * The role for CloudWatch Logs
   *
   * @default - None
   */
  readonly role?: IRole;

  /**
  * The number of days log events are kept in CloudWatch Logs.
  * By default AppSync keeps the logs infinitely. When updating this property,
  * unsetting it doesn't remove the log retention policy.
  * To remove the retention policy, set the value to `INFINITE`
  *
  * @default RetentionDays.INFINITE
  */
  readonly retention?: RetentionDays;
}

/**
 * Properties for an AppSync Event API
 */
export interface ApiProps {
  /**
   * The name of the API
   *
   * @default - A name is automatically generated
   */
  readonly apiName?: string;

  /**
   * A list of authorization providers.
   */
  readonly authProviders: AuthProvider[];

  /**
   * A list of valid authorization modes for the Event API connections.
   */
  readonly connectionAuthModes: AuthorizationType[];

  /**
   * A list of valid authorization modes for the Event API publishing.
   */
  readonly defaultPublishAuthModes: AuthorizationType[];

  /**
   * A list of valid authorization modes for the Event API subscriptions.
   */
  readonly defaultSubscribeAuthModes: AuthorizationType[];

  /**
   * The owner contact information for an API resource.
   *
   * This field accepts any string input with a length of 0 - 256 characters.
   *
   * @default - No owner contact.
   */
  readonly ownerContact?: string;

  /**
   * The CloudWatch Logs configuration for the Event API.
   *
   * @default - None
   */
  readonly eventLogConfig?: EventLogConfig;
}

/**
 * Attributes for Api imports
 */
export interface ApiAttributes {
  /**
   * The unique identifier for the AWS AppSync Api generated by the service.
   */
  readonly apiId: string;

  /**
   * The ARN of the AWS AppSync Api.
   * @default - autogenerated arn
   */
  readonly apiArn?: string;

  /**
   * The domain name of the Api's HTTP endpoint.
   */
  readonly dnsHttp: string;

  /**
   * The domain name of the Api's real-time endpoint.
   */
  readonly dnsRealTime: string;
}

/**
 * An AppSync Event API
 *
 * @resource AWS::AppSync::Api
 */
export class Api extends ApiBase {
  /**
   * Import a API through this function
   *
   * @param scope scope
   * @param id id
   * @param attrs API Attributes of an API
   */
  public static fromApiAttributes(scope: Construct, id: string, attrs: ApiAttributes): IApi {
    const arn = attrs.apiArn ?? Stack.of(scope).formatArn({
      service: 'appsync',
      resource: 'apis',
      resourceName: attrs.apiId,
    });
    class Import extends ApiBase {
      public readonly apiId = attrs.apiId;
      public readonly apiArn = arn;
      public readonly dnsHttp = attrs.dnsHttp;
      public readonly dnsRealTime = attrs.dnsRealTime;

      constructor(s: Construct, i: string) {
        super(s, i);
      }
    }
    return new Import(scope, id);
  }

  /**
   * The unique identifier for the AWS AppSync Api generated by the service.
   */
  public readonly apiId: string;

  /**
   * The ARN of the AWS AppSync Api.
   */
  public readonly apiArn: string;

  /**
   * The domain name of the Api's HTTP endpoint.
   */
  public readonly dnsHttp: string;

  /**
   * The domain name of the Api's real-time endpoint.
   */
  public readonly dnsRealTime: string;

  /**
   * the configured API key, if present
   *
   * @default - no api key
   * @attribute
   */
  public readonly apiKey?: string;

  /**
   * the CloudWatch Log Group for this API
   */
  public readonly logGroup: ILogGroup;

  private api: CfnApi;
  private apiKeyResource?: CfnApiKey;

  constructor(scope: Construct, id: string, props: ApiProps) {
    if (props.apiName !== undefined && !Token.isUnresolved(props.apiName)) {
      if (props.apiName.length < 1 || props.apiName.length > 50) {
        throw new Error(`\`apiName\` must be between 1 and 50 characters, got: ${props.apiName.length} characters.`);
      }

      const apiNamePattern = /^[A-Za-z0-9_\-\ ]+$/;

      if (!apiNamePattern.test(props.apiName)) {
        throw new Error(`\`apiName\` must contain only alphanumeric characters, underscores, hyphens, and spaces, got: ${props.apiName}`);
      }
    }

    super(scope, id, {
      physicalName: props.apiName ?? Lazy.string({
        produce: () =>
          Names.uniqueResourceName(this, {
            maxLength: 50,
            separator: '-',
          }),
      }),
    });

    this.validateOwnerContact(props.ownerContact);
    this.validateAuthProvidersProps(props.authProviders);

    this.api = new CfnApi(this, 'Resource', {
      name: this.physicalName,
      ownerContact: props.ownerContact,
      eventConfig: {
        authProviders: props.authProviders.map(authProvider => ({
          authType: authProvider.authorizationType,
          openIdConnectConfig: setupOpenIdConnectConfig(authProvider.openIdConnectConfig),
          cognitoConfig: setupCognitoConfig(authProvider.cognitoConfig),
          lambdaAuthorizerConfig: setupLambdaAuthorizerConfig(authProvider.lambdaAuthorizerConfig),
        })),
        connectionAuthModes: props.connectionAuthModes.map(mode => ({ authType: mode })),
        defaultPublishAuthModes: props.defaultPublishAuthModes.map(mode => ({ authType: mode })),
        defaultSubscribeAuthModes: props.defaultSubscribeAuthModes.map(mode => ({ authType: mode })),
        logConfig: this.setupEventLogConfig(props.eventLogConfig),
      },
    });

    this.apiId = this.api.attrApiId;
    this.apiArn = this.api.attrApiArn;
    this.dnsHttp = this.api.attrDnsHttp;
    this.dnsRealTime = this.api.attrDnsRealtime;

    const authProviders = props.authProviders;

    /**
     * Create API Key
     */
    if (authProviders.some((authProvider) => authProvider.authorizationType === AuthorizationType.API_KEY)) {
      const config = authProviders.find((authProvider: AuthProvider) => {
        return authProvider.authorizationType === AuthorizationType.API_KEY && authProvider.apiKeyConfig;
      })?.apiKeyConfig;
      this.apiKeyResource = createAPIKey(this, this.apiId, config);
      this.apiKey = this.apiKeyResource.attrApiKey;
    }

    /**
     * Add Lambda Policy
     */
    if (authProviders.some((authProvider) => authProvider.authorizationType === AuthorizationType.LAMBDA)) {
      const config = authProviders.find((authProvider: AuthProvider) => {
        return authProvider.authorizationType === AuthorizationType.LAMBDA && authProvider.lambdaAuthorizerConfig;
      })?.lambdaAuthorizerConfig;

      config?.handler.addPermission(`${id}-appsync`, {
        principal: new ServicePrincipal('appsync.amazonaws.com'),
        action: 'lambda:InvokeFunction',
        sourceArn: this.apiArn,
      });
    }

    /**
     * Set Log Group
     */
    const logGroupName = `/aws/appsync/apis/${this.apiId}`;
    if (props.eventLogConfig) {
      const logRetention = new LogRetention(this, 'LogRetention', {
        logGroupName: logGroupName,
        retention: props.eventLogConfig?.retention ?? RetentionDays.INFINITE,
      });
      this.logGroup = LogGroup.fromLogGroupArn(this, 'LogGroup', logRetention.logGroupArn);
    } else {
      this.logGroup = LogGroup.fromLogGroupName(this, 'LogGroup', logGroupName);
    }
  }

  /**
   * Validate ownerContact property
   */
  private validateOwnerContact(ownerContact?: string) {
    if (ownerContact === undefined || Token.isUnresolved(ownerContact)) return undefined;

    if (ownerContact.length < 1 || ownerContact.length > 256) {
      throw new Error(`\`ownerContact\` must be between 1 and 256 characters, got: ${ownerContact.length} characters.`);
    }

    const ownerContactPattern = /^[A-Za-z0-9_\-\ \.]+$/;

    if (!ownerContactPattern.test(ownerContact)) {
      throw new Error(`\`ownerContact\` must contain only alphanumeric characters, underscores, hyphens, spaces, and periods, got: ${ownerContact}`);
    }
  }

  /**
   * Validate authProviders property
   */
  private validateAuthProvidersProps(authProviders: AuthProvider[]) {
    if (authProviders.filter((authProvider) => authProvider.authorizationType === AuthorizationType.API_KEY).length > 1) {
      throw new Error('You can\'t duplicate API_KEY configuration.');
    }
    if (authProviders.filter((authProvider) => authProvider.authorizationType === AuthorizationType.IAM).length > 1) {
      throw new Error('You can\'t duplicate IAM configuration.');
    }
    if (authProviders.filter((authProvider) => authProvider.authorizationType === AuthorizationType.LAMBDA).length > 1) {
      throw new Error('You can only have a single AWS Lambda function configured to authorize your API.');
    }
  }

  /**
   * Create Event Log Config
   */
  private setupEventLogConfig(config?: EventLogConfig) {
    if (!config) return undefined;

    const logsRoleArn: string = config.role?.roleArn ?? new Role(this, 'ApiLogsRole', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppSyncPushToCloudWatchLogs'),
      ],
    }).roleArn;

    const logLevel: LogLevel = config.logLevel ?? LogLevel.NONE;

    return {
      cloudWatchLogsRoleArn: logsRoleArn,
      logLevel,
    };
  }
}
