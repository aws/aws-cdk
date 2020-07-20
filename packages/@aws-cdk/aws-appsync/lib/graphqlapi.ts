import { IUserPool } from '@aws-cdk/aws-cognito';
import { ITable } from '@aws-cdk/aws-dynamodb';
import {
  ManagedPolicy,
  Role,
  ServicePrincipal,
} from '@aws-cdk/aws-iam';
import { IFunction } from '@aws-cdk/aws-lambda';
import { Construct, Duration, IResolvable } from '@aws-cdk/core';
import { readFileSync } from 'fs';
import {
  CfnApiKey,
  CfnGraphQLApi,
  CfnGraphQLSchema,
} from './appsync.generated';
import { DynamoDbDataSource, HttpDataSource, LambdaDataSource, NoneDataSource } from './data-source';

/**
 * enum with all possible values for AppSync authorization type
 */
export enum AuthorizationType {
  /**
   * API Key authorization type
   */
  API_KEY = 'API_KEY',
  /**
   * AWS IAM authorization type. Can be used with Cognito Identity Pool federated credentials
   */
  IAM = 'AWS_IAM',
  /**
   * Cognito User Pool authorization type
   */
  USER_POOL = 'AMAZON_COGNITO_USER_POOLS',
  /**
   * OpenID Connect authorization type
   */
  OIDC = 'OPENID_CONNECT',
}

/**
 * Interface to specify default or additional authorization(s)
 */
export interface AuthorizationMode {
  /**
   * One of possible four values AppSync supports
   *
   * @see https://docs.aws.amazon.com/appsync/latest/devguide/security.html
   *
   * @default - `AuthorizationType.API_KEY`
   */
  readonly authorizationType: AuthorizationType;
  /**
   * If authorizationType is `AuthorizationType.USER_POOL`, this option is required.
   * @default - none
   */
  readonly userPoolConfig?: UserPoolConfig;
  /**
   * If authorizationType is `AuthorizationType.API_KEY`, this option can be configured.
   * @default - check default values of `ApiKeyConfig` memebers
   */
  readonly apiKeyConfig?: ApiKeyConfig;
  /**
   * If authorizationType is `AuthorizationType.OIDC`, this option is required.
   * @default - none
   */
  readonly openIdConnectConfig?: OpenIdConnectConfig;
}

/**
 * enum with all possible values for Cognito user-pool default actions
 */
export enum UserPoolDefaultAction {
  /**
   * ALLOW access to API
   */
  ALLOW = 'ALLOW',
  /**
   * DENY access to API
   */
  DENY = 'DENY',
}

/**
 * Configuration for Cognito user-pools in AppSync
 */
export interface UserPoolConfig {
  /**
   * The Cognito user pool to use as identity source
   */
  readonly userPool: IUserPool;
  /**
   * the optional app id regex
   *
   * @default -  None
   */
  readonly appIdClientRegex?: string;
  /**
   * Default auth action
   *
   * @default ALLOW
   */
  readonly defaultAction?: UserPoolDefaultAction;
}

/**
 * Configuration for API Key authorization in AppSync
 */
export interface ApiKeyConfig {
  /**
   * Unique name of the API Key
   * @default - 'DefaultAPIKey'
   */
  readonly name?: string;
  /**
   * Description of API key
   * @default - 'Default API Key created by CDK'
   */
  readonly description?: string;

  /**
   * The time from creation time after which the API key expires, using RFC3339 representation.
   * It must be a minimum of 1 day and a maximum of 365 days from date of creation.
   * Rounded down to the nearest hour.
   * @default - 7 days from creation time
   */
  readonly expires?: string;
}

/**
 * Configuration for OpenID Connect authorization in AppSync
 */
export interface OpenIdConnectConfig {
  /**
   * The number of milliseconds an OIDC token is valid after being authenticated by OIDC provider.
   * `auth_time` claim in OIDC token is required for this validation to work.
   * @default - no validation
   */
  readonly tokenExpiryFromAuth?: number;
  /**
   * The number of milliseconds an OIDC token is valid after being issued to a user.
   * This validation uses `iat` claim of OIDC token.
   * @default - no validation
   */
  readonly tokenExpiryFromIssue?: number;
  /**
   * The client identifier of the Relying party at the OpenID identity provider.
   * A regular expression can be specified so AppSync can validate against multiple client identifiers at a time.
   * @example - 'ABCD|CDEF' where ABCD and CDEF are two different clientId
   * @default - * (All)
   */
  readonly clientId?: string;
  /**
   * The issuer for the OIDC configuration. The issuer returned by discovery must exactly match the value of `iss` in the OIDC token.
   */
  readonly oidcProvider: string;
}

/**
 * Configuration of the API authorization modes.
 */
export interface AuthorizationConfig {
  /**
   * Optional authorization configuration
   *
   * @default - API Key authorization
   */
  readonly defaultAuthorization?: AuthorizationMode;

  /**
   * Additional authorization modes
   *
   * @default - No other modes
   */
  readonly additionalAuthorizationModes?: AuthorizationMode[];
}

/**
 * log-level for fields in AppSync
 */
export enum FieldLogLevel {
  /**
   * No logging
   */
  NONE = 'NONE',
  /**
   * Error logging
   */
  ERROR = 'ERROR',
  /**
   * All logging
   */
  ALL = 'ALL',
}

/**
 * Logging configuration for AppSync
 */
export interface LogConfig {
  /**
   * exclude verbose content
   *
   * @default false
   */
  readonly excludeVerboseContent?: boolean | IResolvable;
  /**
   * log level for fields
   *
   * @default - Use AppSync default
   */
  readonly fieldLogLevel?: FieldLogLevel;
}

/**
 * Properties for an AppSync GraphQL API
 */
export interface GraphQLApiProps {

  /**
   * the name of the GraphQL API
   */
  readonly name: string;

  /**
   * Optional authorization configuration
   *
   * @default - API Key authorization
   */
  readonly authorizationConfig?: AuthorizationConfig;

  /**
   * Logging configuration for this api
   *
   * @default - None
   */
  readonly logConfig?: LogConfig;

  /**
   * GraphQL schema definition. You have to specify a definition or a file containing one.
   *
   * @default - Use schemaDefinitionFile
   */
  readonly schemaDefinition?: string;
  /**
   * File containing the GraphQL schema definition. You have to specify a definition or a file containing one.
   *
   * @default - Use schemaDefinition
   */
  readonly schemaDefinitionFile?: string;

}

/**
 * An AppSync GraphQL API
 */
export class GraphQLApi extends Construct {

  /**
   * the id of the GraphQL API
   */
  public readonly apiId: string;
  /**
   * the ARN of the API
   */
  public readonly arn: string;
  /**
   * the URL of the endpoint created by AppSync
   */
  public readonly graphQlUrl: string;
  /**
   * the name of the API
   */
  public name: string;
  /**
   * underlying CFN schema resource
   */
  public readonly schema: CfnGraphQLSchema;
  /**
   * the configured API key, if present
   */
  public get apiKey(): string | undefined {
    return this._apiKey;
  }

  private api: CfnGraphQLApi;
  private _apiKey?: string;

  constructor(scope: Construct, id: string, props: GraphQLApiProps) {
    super(scope, id);

    this.validateAuthorizationProps(props);
    const defaultAuthorizationType =
      props.authorizationConfig?.defaultAuthorization?.authorizationType ||
      AuthorizationType.API_KEY;

    let apiLogsRole;
    if (props.logConfig) {
      apiLogsRole = new Role(this, 'ApiLogsRole', {
        assumedBy: new ServicePrincipal('appsync'),
      });
      apiLogsRole.addManagedPolicy(
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSAppSyncPushToCloudWatchLogs',
        ),
      );
    }

    this.api = new CfnGraphQLApi(this, 'Resource', {
      name: props.name,
      authenticationType: defaultAuthorizationType,
      ...(props.logConfig && {
        logConfig: {
          cloudWatchLogsRoleArn: apiLogsRole ? apiLogsRole.roleArn : undefined,
          excludeVerboseContent: props.logConfig.excludeVerboseContent,
          fieldLogLevel: props.logConfig.fieldLogLevel
            ? props.logConfig.fieldLogLevel.toString()
            : undefined,
        },
      }),
      openIdConnectConfig:
        props.authorizationConfig?.defaultAuthorization?.authorizationType ===
        AuthorizationType.OIDC
          ? this.formatOpenIdConnectConfig(
            props.authorizationConfig.defaultAuthorization
              .openIdConnectConfig!,
          )
          : undefined,
      userPoolConfig:
        props.authorizationConfig?.defaultAuthorization?.authorizationType ===
        AuthorizationType.USER_POOL
          ? this.formatUserPoolConfig(
            props.authorizationConfig.defaultAuthorization.userPoolConfig!,
          )
          : undefined,
      additionalAuthenticationProviders: this.formatAdditionalAuthenticationProviders(props),
    });

    this.apiId = this.api.attrApiId;
    this.arn = this.api.attrArn;
    this.graphQlUrl = this.api.attrGraphQlUrl;
    this.name = this.api.name;

    if (
      defaultAuthorizationType === AuthorizationType.API_KEY ||
      props.authorizationConfig?.additionalAuthorizationModes?.some(
        (authMode) => authMode.authorizationType === AuthorizationType.API_KEY
      )
    ) {
      const apiKeyConfig: ApiKeyConfig = props.authorizationConfig
        ?.defaultAuthorization?.apiKeyConfig || {
          name: 'DefaultAPIKey',
          description: 'Default API Key created by CDK',
        };
      this.createAPIKey(apiKeyConfig);
    }

    let definition;
    if (props.schemaDefinition) {
      definition = props.schemaDefinition;
    } else if (props.schemaDefinitionFile) {
      definition = readFileSync(props.schemaDefinitionFile).toString('UTF-8');
    } else {
      throw new Error('Missing Schema definition. Provide schemaDefinition or schemaDefinitionFile');
    }
    this.schema = new CfnGraphQLSchema(this, 'Schema', {
      apiId: this.apiId,
      definition,
    });
  }

  /**
   * add a new dummy data source to this API
   * @param name The name of the data source
   * @param description The description of the data source
   */
  public addNoneDataSource(name: string, description: string): NoneDataSource {
    return new NoneDataSource(this, `${name}DS`, {
      api: this,
      description,
      name,
    });
  }

  /**
   * add a new DynamoDB data source to this API
   * @param name The name of the data source
   * @param description The description of the data source
   * @param table The DynamoDB table backing this data source [disable-awslint:ref-via-interface]
   */
  public addDynamoDbDataSource(
    name: string,
    description: string,
    table: ITable,
  ): DynamoDbDataSource {
    return new DynamoDbDataSource(this, `${name}DS`, {
      api: this,
      description,
      name,
      table,
    });
  }

  /**
   * add a new http data source to this API
   * @param name The name of the data source
   * @param description The description of the data source
   * @param endpoint The http endpoint
   */
  public addHttpDataSource(name: string, description: string, endpoint: string): HttpDataSource {
    return new HttpDataSource(this, `${name}DS`, {
      api: this,
      description,
      endpoint,
      name,
    });
  }

  /**
   * add a new Lambda data source to this API
   * @param name The name of the data source
   * @param description The description of the data source
   * @param lambdaFunction The Lambda function to call to interact with this data source
   */
  public addLambdaDataSource(
    name: string,
    description: string,
    lambdaFunction: IFunction,
  ): LambdaDataSource {
    return new LambdaDataSource(this, `${name}DS`, {
      api: this,
      description,
      name,
      lambdaFunction,
    });
  }

  private validateAuthorizationProps(props: GraphQLApiProps) {
    const defaultAuthorizationType =
      props.authorizationConfig?.defaultAuthorization?.authorizationType ||
      AuthorizationType.API_KEY;

    if (
      defaultAuthorizationType === AuthorizationType.OIDC &&
      !props.authorizationConfig?.defaultAuthorization?.openIdConnectConfig
    ) {
      throw new Error('Missing default OIDC Configuration');
    }

    if (
      defaultAuthorizationType === AuthorizationType.USER_POOL &&
      !props.authorizationConfig?.defaultAuthorization?.userPoolConfig
    ) {
      throw new Error('Missing default User Pool Configuration');
    }

    if (props.authorizationConfig?.additionalAuthorizationModes) {
      props.authorizationConfig.additionalAuthorizationModes.forEach(
        (authorizationMode) => {
          if (
            authorizationMode.authorizationType === AuthorizationType.API_KEY &&
            defaultAuthorizationType === AuthorizationType.API_KEY
          ) {
            throw new Error(
              "You can't duplicate API_KEY in additional authorization config. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html",
            );
          }

          if (
            authorizationMode.authorizationType === AuthorizationType.IAM &&
            defaultAuthorizationType === AuthorizationType.IAM
          ) {
            throw new Error(
              "You can't duplicate IAM in additional authorization config. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html",
            );
          }

          if (
            authorizationMode.authorizationType === AuthorizationType.OIDC &&
            !authorizationMode.openIdConnectConfig
          ) {
            throw new Error(
              'Missing OIDC Configuration inside an additional authorization mode',
            );
          }

          if (
            authorizationMode.authorizationType ===
              AuthorizationType.USER_POOL &&
            !authorizationMode.userPoolConfig
          ) {
            throw new Error(
              'Missing User Pool Configuration inside an additional authorization mode',
            );
          }
        },
      );
    }
  }

  private formatOpenIdConnectConfig(
    config: OpenIdConnectConfig,
  ): CfnGraphQLApi.OpenIDConnectConfigProperty {
    return {
      authTtl: config.tokenExpiryFromAuth,
      clientId: config.clientId,
      iatTtl: config.tokenExpiryFromIssue,
      issuer: config.oidcProvider,
    };
  }

  private formatUserPoolConfig(
    config: UserPoolConfig,
  ): CfnGraphQLApi.UserPoolConfigProperty {
    return {
      userPoolId: config.userPool.userPoolId,
      awsRegion: config.userPool.stack.region,
      appIdClientRegex: config.appIdClientRegex,
      defaultAction: config.defaultAction || 'ALLOW',
    };
  }

  private createAPIKey(config: ApiKeyConfig) {
    let expires: number | undefined;
    if (config.expires) {
      expires = new Date(config.expires).valueOf();
      const days = (d: number) =>
        Date.now() + Duration.days(d).toMilliseconds();
      if (expires < days(1) || expires > days(365)) {
        throw Error('API key expiration must be between 1 and 365 days.');
      }
      expires = Math.round(expires / 1000);
    }
    const key = new CfnApiKey(this, `${config.name || 'DefaultAPIKey'}ApiKey`, {
      expires,
      description: config.description || 'Default API Key created by CDK',
      apiId: this.apiId,
    });
    this._apiKey = key.attrApiKey;
  }

  private formatAdditionalAuthorizationModes(
    authModes: AuthorizationMode[],
  ): CfnGraphQLApi.AdditionalAuthenticationProviderProperty[] {
    return authModes.reduce<
    CfnGraphQLApi.AdditionalAuthenticationProviderProperty[]
    >(
      (acc, authMode) => [
        ...acc,
        {
          authenticationType: authMode.authorizationType,
          userPoolConfig:
            authMode.authorizationType === AuthorizationType.USER_POOL
              ? this.formatUserPoolConfig(authMode.userPoolConfig!)
              : undefined,
          openIdConnectConfig:
            authMode.authorizationType === AuthorizationType.OIDC
              ? this.formatOpenIdConnectConfig(authMode.openIdConnectConfig!)
              : undefined,
        },
      ],
      [],
    );
  }

  private formatAdditionalAuthenticationProviders(props: GraphQLApiProps): CfnGraphQLApi.AdditionalAuthenticationProviderProperty[] | undefined {
    const authModes = props.authorizationConfig?.additionalAuthorizationModes;
    return authModes ? this.formatAdditionalAuthorizationModes(authModes) : undefined;
  }
}
