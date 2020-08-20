import { readFileSync } from 'fs';
import { IUserPool } from '@aws-cdk/aws-cognito';
import { ManagedPolicy, Role, ServicePrincipal, Grant, IGrantable } from '@aws-cdk/aws-iam';
import { CfnResource, Construct, Duration, IResolvable, Stack } from '@aws-cdk/core';
import { CfnApiKey, CfnGraphQLApi, CfnGraphQLSchema } from './appsync.generated';
import { IGraphqlApi, GraphqlApiBase } from './graphqlapi-base';
import { ObjectType, ObjectTypeProps } from './schema-intermediate';

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
   * @default - name: 'DefaultAPIKey' | description: 'Default API Key created by CDK'
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
 * Enum containing the different modes of schema definition
 */
export enum SchemaDefinition {
  /**
   * Define schema through functions like addType, addQuery, etc.
   */
  CODE = 'CODE',

  /**
   * Define schema in a file, i.e. schema.graphql
   */
  FILE = 'FILE',
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
   * GraphQL schema definition. Specify how you want to define your schema.
   *
   * SchemaDefinition.CODE allows schema definition through CDK
   * SchemaDefinition.FILE allows schema definition through schema.graphql file
   *
   * @experimental
   */
  readonly schemaDefinition: SchemaDefinition;
  /**
   * File containing the GraphQL schema definition. You have to specify a definition or a file containing one.
   *
   * @default - Use schemaDefinition
   */
  readonly schemaDefinitionFile?: string;
  /**
   * A flag indicating whether or not X-Ray tracing is enabled for the GraphQL API.
   *
   * @default - false
   */
  readonly xrayEnabled?: boolean;

}

/**
 * A class used to generate resource arns for AppSync
 */
export class IamResource {
  /**
   * Generate the resource names given custom arns
   *
   * @param arns The custom arns that need to be permissioned
   *
   * Example: custom('/types/Query/fields/getExample')
   */
  public static custom(...arns: string[]): IamResource {
    if (arns.length === 0) {
      throw new Error('At least 1 custom ARN must be provided.');
    }
    return new IamResource(arns);
  }

  /**
   * Generate the resource names given a type and fields
   *
   * @param type The type that needs to be allowed
   * @param fields The fields that need to be allowed, if empty grant permissions to ALL fields
   *
   * Example: ofType('Query', 'GetExample')
   */
  public static ofType(type: string, ...fields: string[]): IamResource {
    const arns = fields.length ? fields.map((field) => `types/${type}/fields/${field}`) : [`types/${type}/*`];
    return new IamResource(arns);
  }

  /**
   * Generate the resource names that accepts all types: `*`
   */
  public static all(): IamResource {
    return new IamResource(['*']);
  }

  private arns: string[];

  private constructor(arns: string[]) {
    this.arns = arns;
  }

  /**
   * Return the Resource ARN
   *
   * @param api The GraphQL API to give permissions
   */
  public resourceArns(api: GraphQLApi): string[] {
    return this.arns.map((arn) => Stack.of(api).formatArn({
      service: 'appsync',
      resource: `apis/${api.apiId}`,
      sep: '/',
      resourceName: `${arn}`,
    }));
  }
}

/**
 * Attributes for GraphQL imports
 */
export interface GraphqlApiAttributes {
  /**
   * an unique AWS AppSync GraphQL API identifier
   * i.e. 'lxz775lwdrgcndgz3nurvac7oa'
   */
  readonly graphqlApiId: string,

  /**
   * the arn for the GraphQL Api
   * @default - autogenerated arn
   */
  readonly graphqlApiArn?: string,
}

/**
 * An AppSync GraphQL API
 *
 * @resource AWS::AppSync::GraphQLApi
 */
export class GraphQLApi extends GraphqlApiBase {
  /**
   * Import a GraphQL API through this function
   *
   * @param scope scope
   * @param id id
   * @param attrs GraphQL API Attributes of an API
   */
  public static fromGraphqlApiAttributes(scope: Construct, id: string, attrs: GraphqlApiAttributes): IGraphqlApi {
    const arn = attrs.graphqlApiArn ?? Stack.of(scope).formatArn({
      service: 'appsync',
      resource: `apis/${attrs.graphqlApiId}`,
    });
    class Import extends GraphqlApiBase {
      public readonly apiId = attrs.graphqlApiId;
      public readonly arn = arn;
      constructor (s: Construct, i: string) {
        super(s, i);
      }
    }
    return new Import(scope, id);
  }

  /**
   * an unique AWS AppSync GraphQL API identifier
   * i.e. 'lxz775lwdrgcndgz3nurvac7oa'
   */
  public readonly apiId: string;

  /**
   * the ARN of the API
   */
  public readonly arn: string;

  /**
   * the URL of the endpoint created by AppSync
   *
   * @attribute
   */
  public readonly graphQlUrl: string;

  /**
   * the name of the API
   */
  public readonly name: string;

  /**
   * underlying CFN schema resource
   */
  public readonly schema: CfnGraphQLSchema;

  /**
   * the configured API key, if present
   *
   * @default - no api key
   */
  public readonly apiKey?: string;

  private schemaMode: SchemaDefinition;
  private api: CfnGraphQLApi;
  private _apiKey?: CfnApiKey;

  constructor(scope: Construct, id: string, props: GraphQLApiProps) {
    super(scope, id);

    this.validateAuthorizationProps(props);
    const defaultAuthorizationType =
      props.authorizationConfig?.defaultAuthorization?.authorizationType ??
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
      xrayEnabled: props.xrayEnabled,
    });

    this.apiId = this.api.attrApiId;
    this.arn = this.api.attrArn;
    this.graphQlUrl = this.api.attrGraphQlUrl;
    this.name = this.api.name;
    this.schemaMode = props.schemaDefinition;
    this.schema = this.defineSchema(props.schemaDefinitionFile);

    if (defaultAuthorizationType === AuthorizationType.API_KEY ||
      props.authorizationConfig?.additionalAuthorizationModes?.some(
        (authMode) => authMode.authorizationType === AuthorizationType.API_KEY)
    ) {
      // create a variable for apiKeyConfig if one has been specified by the user
      // first check is for default authorization
      // second check is for additional authorization modes
      const apiKeyConfig = props.authorizationConfig?.defaultAuthorization?.apiKeyConfig ??
        props.authorizationConfig?.additionalAuthorizationModes?.
          find((mode: AuthorizationMode) => {
            return mode.authorizationType === AuthorizationType.API_KEY && mode.apiKeyConfig;
          })?.apiKeyConfig;
      this._apiKey = this.createAPIKey(apiKeyConfig);
      this._apiKey.addDependsOn(this.schema);
      this.apiKey = this._apiKey.attrApiKey;
    }
  }

  /**
   * Adds an IAM policy statement associated with this GraphQLApi to an IAM
   * principal's policy.
   *
   * @param grantee The principal
   * @param resources The set of resources to allow (i.e. ...:[region]:[accountId]:apis/GraphQLId/...)
   * @param actions The actions that should be granted to the principal (i.e. appsync:graphql )
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
   * Adds an IAM policy statement for Mutation access to this GraphQLApi to an IAM
   * principal's policy.
   *
   * @param grantee The principal
   * @param fields The fields to grant access to that are Mutations (leave blank for all)
   */
  public grantMutation(grantee: IGrantable, ...fields: string[]): Grant {
    return this.grant(grantee, IamResource.ofType('Mutation', ...fields), 'appsync:GraphQL');
  }

  /**
   * Adds an IAM policy statement for Query access to this GraphQLApi to an IAM
   * principal's policy.
   *
   * @param grantee The principal
   * @param fields The fields to grant access to that are Queries (leave blank for all)
   */
  public grantQuery(grantee: IGrantable, ...fields: string[]): Grant {
    return this.grant(grantee, IamResource.ofType('Query', ...fields), 'appsync:GraphQL');
  }

  /**
   * Adds an IAM policy statement for Subscription access to this GraphQLApi to an IAM
   * principal's policy.
   *
   * @param grantee The principal
   * @param fields The fields to grant access to that are Subscriptions (leave blank for all)
   */
  public grantSubscription(grantee: IGrantable, ...fields: string[]): Grant {
    return this.grant(grantee, IamResource.ofType('Subscription', ...fields), 'appsync:GraphQL');
  }

  private validateAuthorizationProps(props: GraphQLApiProps) {
    const defaultMode = props.authorizationConfig?.defaultAuthorization ?? {
      authorizationType: AuthorizationType.API_KEY,
    };
    const additionalModes = props.authorizationConfig?.additionalAuthorizationModes ?? [];
    const allModes = [defaultMode, ...additionalModes];

    allModes.map((mode) => {
      if (mode.authorizationType === AuthorizationType.OIDC && !mode.openIdConnectConfig) {
        throw new Error('Missing default OIDC Configuration');
      }
      if (mode.authorizationType === AuthorizationType.USER_POOL && !mode.userPoolConfig) {
        throw new Error('Missing default OIDC Configuration');
      }
    });

    if (allModes.filter((mode) => mode.authorizationType === AuthorizationType.API_KEY).length > 1) {
      throw new Error('You can\'t duplicate API_KEY configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
    }

    if (allModes.filter((mode) => mode.authorizationType === AuthorizationType.IAM).length > 1) {
      throw new Error('You can\'t duplicate IAM configuration. See https://docs.aws.amazon.com/appsync/latest/devguide/security.html');
    }
  }

  /**
   * Add schema dependency to a given construct
   *
   * @param construct the dependee
   */
  public addSchemaDependency(construct: CfnResource): boolean {
    construct.addDependsOn(this.schema);
    return true;
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

  private createAPIKey(config?: ApiKeyConfig) {
    let expires: number | undefined;
    if (config?.expires) {
      expires = new Date(config.expires).valueOf();
      const days = (d: number) =>
        Date.now() + Duration.days(d).toMilliseconds();
      if (expires < days(1) || expires > days(365)) {
        throw Error('API key expiration must be between 1 and 365 days.');
      }
      expires = Math.round(expires / 1000);
    }
    return new CfnApiKey(this, `${config?.name || 'Default'}ApiKey`, {
      expires,
      description: config?.description,
      apiId: this.apiId,
    });
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

  /**
   * Define schema based on props configuration
   * @param file the file name/s3 location of Schema
   */
  private defineSchema(file?: string): CfnGraphQLSchema {
    let definition;

    if ( this.schemaMode === SchemaDefinition.FILE && !file) {
      throw new Error('schemaDefinitionFile must be configured if using FILE definition mode.');
    } else if ( this.schemaMode === SchemaDefinition.FILE && file ) {
      definition = readFileSync(file).toString('UTF-8');
    } else if ( this.schemaMode === SchemaDefinition.CODE && !file ) {
      definition = '';
    } else if ( this.schemaMode === SchemaDefinition.CODE && file) {
      throw new Error('definition mode CODE is incompatible with file definition. Change mode to FILE/S3 or unconfigure schemaDefinitionFile');
    }

    return new CfnGraphQLSchema(this, 'Schema', {
      apiId: this.apiId,
      definition,
    });
  }

  /**
   * Escape hatch to append to Schema as desired. Will always result
   * in a newline.
   *
   * @param addition the addition to add to schema
   * @param delimiter the delimiter between schema and addition
   * @default - ''
   *
   * @experimental
   */
  public appendToSchema(addition: string, delimiter?: string): void {
    if ( this.schemaMode != SchemaDefinition.CODE ) {
      throw new Error('API cannot append to schema because schema definition mode is not configured as CODE.');
    }
    const sep = delimiter ?? '';
    this.schema.definition = `${this.schema.definition}${sep}${addition}\n`;
  }

  /**
   * Add an object type to the schema
   *
   * @param name the name of the object type
   * @param props the definition
   *
   * @experimental
   */
  public addType(name: string, props: ObjectTypeProps): ObjectType {
    if ( this.schemaMode != SchemaDefinition.CODE ) {
      throw new Error('API cannot add type because schema definition mode is not configured as CODE.');
    };
    const type = new ObjectType(name, {
      definition: props.definition,
      directives: props.directives,
    });
    this.appendToSchema(type.toString());
    return type;
  }
}
