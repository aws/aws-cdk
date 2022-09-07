import { IResource, Resource, Stack, SecretValue } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnConnection } from './events.generated';

/**
 * An API Destination Connection
 *
 * A connection defines the authorization type and credentials to use for authorization with an API destination HTTP endpoint.
 */
export interface ConnectionProps {
  /**
   * The name of the connection.
   *
   * @default - A name is automatically generated
   */
  readonly connectionName?: string;

  /**
   * The name of the connection.
   *
   * @default - none
   */
  readonly description?: string;

  /**
   * The authorization type for the connection.
   */
  readonly authorization: Authorization;

  /**
   * Additional string parameters to add to the invocation bodies
   *
   * @default - No additional parameters
   */
  readonly bodyParameters?: Record<string, HttpParameter>;

  /**
   * Additional string parameters to add to the invocation headers
   *
   * @default - No additional parameters
   */
  readonly headerParameters?: Record<string, HttpParameter>;

  /**
   * Additional string parameters to add to the invocation query strings
   *
   * @default - No additional parameters
   */
  readonly queryStringParameters?: Record<string, HttpParameter>;
}

/**
 * Authorization type for an API Destination Connection
 */
export abstract class Authorization {
  /**
   * Use API key authorization
   *
   * API key authorization has two components: an API key name and an API key value.
   * What these are depends on the target of your connection.
   */
  public static apiKey(apiKeyName: string, apiKeyValue: SecretValue): Authorization {
    return new class extends Authorization {
      public _bind() {
        return {
          authorizationType: AuthorizationType.API_KEY,
          authParameters: {
            apiKeyAuthParameters: {
              apiKeyName: apiKeyName,
              apiKeyValue: apiKeyValue.unsafeUnwrap(), // Safe usage
            },
          } as CfnConnection.AuthParametersProperty,
        };
      }
    }();
  }

  /**
   * Use username and password authorization
   */
  public static basic(username: string, password: SecretValue): Authorization {
    return new class extends Authorization {
      public _bind() {
        return {
          authorizationType: AuthorizationType.BASIC,
          authParameters: {
            basicAuthParameters: {
              username: username,
              password: password.unsafeUnwrap(), // Safe usage
            },
          } as CfnConnection.AuthParametersProperty,
        };
      }
    }();
  }

  /**
   * Use OAuth authorization
   */
  public static oauth(props: OAuthAuthorizationProps): Authorization {
    if (![HttpMethod.POST, HttpMethod.GET, HttpMethod.PUT].includes(props.httpMethod)) {
      throw new Error('httpMethod must be one of GET, POST, PUT');
    }

    return new class extends Authorization {
      public _bind() {
        return {
          authorizationType: AuthorizationType.OAUTH_CLIENT_CREDENTIALS,
          authParameters: {
            oAuthParameters: {
              authorizationEndpoint: props.authorizationEndpoint,
              clientParameters: {
                clientId: props.clientId,
                clientSecret: props.clientSecret.unsafeUnwrap(), // Safe usage
              },
              httpMethod: props.httpMethod,
              oAuthHttpParameters: {
                bodyParameters: renderHttpParameters(props.bodyParameters),
                headerParameters: renderHttpParameters(props.headerParameters),
                queryStringParameters: renderHttpParameters(props.queryStringParameters),
              },
            },
          } as CfnConnection.AuthParametersProperty,
        };
      }
    }();

  }

  /**
   * Bind the authorization to the construct and return the authorization properties
   *
   * @internal
   */
  public abstract _bind(): AuthorizationBindResult;
}

/**
 * Properties for `Authorization.oauth()`
 */
export interface OAuthAuthorizationProps {

  /**
   * The URL to the authorization endpoint
   */
  readonly authorizationEndpoint: string;

  /**
   * The method to use for the authorization request.
   *
   * (Can only choose POST, GET or PUT).
   */
  readonly httpMethod: HttpMethod;

  /**
   * The client ID to use for OAuth authorization for the connection.
   */
  readonly clientId: string;

  /**
   * The client secret associated with the client ID to use for OAuth authorization for the connection.
   */
  readonly clientSecret: SecretValue;

  /**
   * Additional string parameters to add to the OAuth request body
   *
   * @default - No additional parameters
   */
  readonly bodyParameters?: Record<string, HttpParameter>;

  /**
   * Additional string parameters to add to the OAuth request header
   *
   * @default - No additional parameters
   */
  readonly headerParameters?: Record<string, HttpParameter>;

  /**
   * Additional string parameters to add to the OAuth request query string
   *
   * @default - No additional parameters
   */
  readonly queryStringParameters?: Record<string, HttpParameter>;
}

/**
 * An additional HTTP parameter to send along with the OAuth request
 */
export abstract class HttpParameter {
  /**
   * Make an OAuthParameter from a string value
   *
   * The value is not treated as a secret.
   */
  public static fromString(value: string): HttpParameter {
    return new class extends HttpParameter {
      public _render(name: string) {
        return {
          key: name,
          value,
          isValueSecret: false,
        } as CfnConnection.ParameterProperty;
      }
    }();
  }

  /**
   * Make an OAuthParameter from a secret
   */
  public static fromSecret(value: SecretValue): HttpParameter {
    return new class extends HttpParameter {
      public _render(name: string) {
        return {
          key: name,
          value: value.unsafeUnwrap(), // Safe usage
          isValueSecret: true,
        } as CfnConnection.ParameterProperty;
      }
    }();
  }

  /**
   * Render the paramter value
   *
   * @internal
   */
  public abstract _render(name: string): any;
}

/**
 * Result of the 'bind' operation of the 'Authorization' class
 *
 * @internal
 */
export interface AuthorizationBindResult {
  /**
   * The authorization type
   */
  readonly authorizationType: AuthorizationType;

  /**
   * The authorization parameters (depends on the type)
   */
  readonly authParameters: any;
}

/**
 * Interface for EventBus Connections
 */
export interface IConnection extends IResource {
  /**
   * The Name for the connection.
   * @attribute
   */
  readonly connectionName: string;

  /**
   * The ARN of the connection created.
   * @attribute
   */
  readonly connectionArn: string;

  /**
   * The ARN for the secret created for the connection.
   * @attribute
   */
  readonly connectionSecretArn: string;
}

/**
 * Interface with properties necessary to import a reusable Connection
 */
export interface ConnectionAttributes {
  /**
   * The Name for the connection.
   */
  readonly connectionName: string;

  /**
   * The ARN of the connection created.
   */
  readonly connectionArn: string;

  /**
   * The ARN for the secret created for the connection.
   */
  readonly connectionSecretArn: string;
}

/**
 * Define an EventBridge Connection
 *
 * @resource AWS::Events::Connection
 */
export class Connection extends Resource implements IConnection {
  /**
   * Import an existing connection resource
   * @param scope Parent construct
   * @param id Construct ID
   * @param connectionArn ARN of imported connection
   */
  public static fromEventBusArn(scope: Construct, id: string, connectionArn: string, connectionSecretArn: string): IConnection {
    const parts = Stack.of(scope).parseArn(connectionArn);

    return new ImportedConnection(scope, id, {
      connectionArn: connectionArn,
      connectionName: parts.resourceName || '',
      connectionSecretArn: connectionSecretArn,
    });
  }

  /**
   * Import an existing connection resource
   * @param scope Parent construct
   * @param id Construct ID
   * @param attrs Imported connection properties
   */
  public static fromConnectionAttributes(scope: Construct, id: string, attrs: ConnectionAttributes): IConnection {
    return new ImportedConnection(scope, id, attrs);
  }

  /**
   * The Name for the connection.
   * @attribute
   */
  public readonly connectionName: string;

  /**
   * The ARN of the connection created.
   * @attribute
   */
  public readonly connectionArn: string;

  /**
   * The ARN for the secret created for the connection.
   * @attribute
   */
  public readonly connectionSecretArn: string;

  constructor(scope: Construct, id: string, props: ConnectionProps) {
    super(scope, id, {
      physicalName: props.connectionName,
    });

    const authBind = props.authorization._bind();

    const invocationHttpParameters = !!props.headerParameters || !!props.queryStringParameters || !!props.bodyParameters ? {
      bodyParameters: renderHttpParameters(props.bodyParameters),
      headerParameters: renderHttpParameters(props.headerParameters),
      queryStringParameters: renderHttpParameters(props.queryStringParameters),
    } : undefined;

    let connection = new CfnConnection(this, 'Connection', {
      authorizationType: authBind.authorizationType,
      authParameters: {
        ...authBind.authParameters,
        invocationHttpParameters: invocationHttpParameters,
      },
      description: props.description,
      name: this.physicalName,
    });

    this.connectionName = this.getResourceNameAttribute(connection.ref);
    this.connectionArn = connection.attrArn;
    this.connectionSecretArn = connection.attrSecretArn;
  }
}

class ImportedConnection extends Resource {
  public readonly connectionArn: string;
  public readonly connectionName: string;
  public readonly connectionSecretArn: string;
  constructor(scope: Construct, id: string, attrs: ConnectionAttributes) {
    const arnParts = Stack.of(scope).parseArn(attrs.connectionArn);
    super(scope, id, {
      account: arnParts.account,
      region: arnParts.region,
    });

    this.connectionArn = attrs.connectionArn;
    this.connectionName = attrs.connectionName;
    this.connectionSecretArn = attrs.connectionSecretArn;
  }
}

/**
 * Supported HTTP operations.
 */
export enum HttpMethod {
  /** POST */
  POST = 'POST',
  /** GET */
  GET = 'GET',
  /** HEAD */
  HEAD = 'HEAD',
  /** OPTIONS */
  OPTIONS = 'OPTIONS',
  /** PUT */
  PUT = 'PUT',
  /** PATCH */
  PATCH = 'PATCH',
  /** DELETE */
  DELETE = 'DELETE',
}

/**
 * Supported Authorization Types.
 */
enum AuthorizationType {
  /** API_KEY */
  API_KEY = 'API_KEY',
  /** BASIC */
  BASIC = 'BASIC',
  /** OAUTH_CLIENT_CREDENTIALS */
  OAUTH_CLIENT_CREDENTIALS = 'OAUTH_CLIENT_CREDENTIALS',
}

function renderHttpParameters(ps?: Record<string, HttpParameter>): CfnConnection.ParameterProperty[] | undefined {
  if (!ps || Object.keys(ps).length === 0) { return undefined; }

  return Object.entries(ps).map(([name, p]) => p._render(name));
}