import * as crypto from 'crypto';
import { IResource, Lazy, Names, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnConnection } from './events.generated';

/**
 * Supported Authorization Types.
 */
export enum AuthorizationType {
  /** API_KEY */
  API_KEY = 'API_KEY',
  /** BASIC */
  BASIC = 'BASIC',
  /** OAUTH_CLIENT_CREDENTIALS */
  OAUTH_CLIENT_CREDENTIALS = 'OAUTH_CLIENT_CREDENTIALS',
}

/**
 * Contains the API key authorization parameters to use for the connection.
 */
export interface ApiKeyAuthParameters {
  /**
   * The name of the API key to use for authorization.
   */
  readonly apiKeyName: string;

  /**
   * The value for the API key to use for authorization.
   */
  readonly apiKeyValue: string;
}

/**
 * Contains the Basic authorization parameters to use for the connection.
 */
export interface BasicAuthParameters {
  /**
   * The password associated with the user name to use for Basic authorization.
   */
  readonly password: string;

  /**
   * The user name to use for Basic authorization.
   */
  readonly username: string;
}

/**
 * Contains the client parameters for OAuth authorization.
 */
export interface ClientParameters {
  /**
   * The client secret associated with the client ID to use for OAuth authorization for the connection.
   */
  readonly clientID: string;

  /**
   * The client ID to use for OAuth authorization for the connection.
   */
  readonly clientSecret: string;
}

/**
 * Additional parameters to include with the connection.
 */
export interface Parameter {
  /**
   * Specifies whether the value is a secret.
   * @default - True
   */
  readonly isValueSecret?: string;

  /**
   * The key for the parameter.
   */
  readonly key: string;

  /**
   * The value associated with the key for the parameter.
   */
  readonly value: string;
}

/**
 * These are custom parameter to be used when the target is an API Gateway REST APIs or EventBridge ApiDestinations.
 */
export interface HttpParameters {
  /**
   * The body that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
   * @default - none
   */
  readonly bodyParameters?: Parameter[];

  /**
   * The headers that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
   * @default - none
   */
  readonly headerParameters?: Parameter[];

  /**
   * The query string keys/values that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
   * @default - none
   */
  readonly queryStringParameters?: Parameter[];
}

/**
 * Contains the OAuth authorization parameters to use for the connection.
 */
export interface OAuthParameters {
  /**
   * The URL to the authorization endpoint when OAuth is specified as the authorization type.
   */
  readonly authorizationEndpoint: string;

  /**
   * Contains the client parameters for OAuth authorization.
   */
  readonly clientParameters: ClientParameters;

  /**
   * The method to use for the authorization request.
   */
  readonly httpMethod: string;

  /**
   * Contains the OAuth authorization parameters to use for the connection.
   * @default - none
   */
  readonly oAuthHttpParameters?: HttpParameters;
}

/**
 * Contains the authorization parameters to use to authorize with the endpoint.
 */
export interface AuthParameters {
  /**
   * Contains the API key authorization parameters to use for the connection.
   * @default - None
   */
  readonly apiKeyAuthParameters?: ApiKeyAuthParameters;

  /**
   * Contains the Basic authorization parameters to use for the connection.
   * @default - None
   */
  readonly basicAuthParameters?: BasicAuthParameters;

  /**
   * Contains the API key authorization parameters to use for the connection.
   * @default - None
   */
  readonly invocationHttpParameters?: HttpParameters;

  /**
   * Contains the OAuth authorization parameters to use for the connection.
   * @default - None
   */
  readonly oAuthParameters?: OAuthParameters;
}

/**
 * The event connection base properties
 */
export interface BaseConnectionProps {
  /**
   * The name of the connection.
   *
   * @default - none
   */
  readonly authorizationType: AuthorizationType;

  /**
   * The name of the connection.
   *
   * @default - none
   */
  readonly authParameters: AuthParameters;

  /**
   * The name of the connection.
   *
   * @default - none
   */
  readonly description: string;

  /**
   * The name of the connection.
   *
   * @default - none
   */
  readonly connectionName: string;
}


/**
 * The event connection properties
 */
export interface ConnectionProps extends BaseConnectionProps {

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
 * The event connection properties
 */
export interface ConnectionProps extends BaseConnectionProps {

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
  public static fromEventBusArn(scope: Construct, id: string, connectionArn: string): IConnection {
    const parts = Stack.of(scope).parseArn(connectionArn);

    return new ImportedConnection(scope, id, {
      connectionArn: connectionArn,
      connectionName: parts.resourceName || '',
      connectionSecretArn: '', //TODO
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
      physicalName: props.connectionName || Lazy.string({
        produce: () => this.generateUniqueName(),
      }),
    });

    let authParameters;

    if (props.authorizationType === AuthorizationType.BASIC) {
      if (props.authParameters?.basicAuthParameters?.password !== undefined || props.authParameters?.basicAuthParameters?.username !== undefined) {
        authParameters = {
          BasicAuthParameters: {
            Password: props.authParameters?.basicAuthParameters?.password,
            Username: props.authParameters?.basicAuthParameters?.username,
          },
        };
      };
      // else {
      //   throw new Error('AuthorizationType Basic requires username and password to be set');
      // };
    };
    // {
    //           ApiKeyAuthParameters: {
    //       ApiKeyName: props.authParameters?.apiKeyAuthParameters?.apiKeyName,
    //       ApiKeyValue: props.authParameters?.apiKeyAuthParameters?.apiKeyValue,
    //     },
    //     BasicAuthParameters: {
    //       Password: props.authParameters?.basicAuthParameters?.password,
    //       Username: props.authParameters?.basicAuthParameters?.username,
    //     },
    //     InvocationHttpParameters: {
    //       BodyParameters: props.authParameters?.invocationHttpParameters?.bodyParameters,
    //       HeaderParameters: props.authParameters?.invocationHttpParameters?.headerParameters,
    //       QueryStringParameters: props.authParameters?.invocationHttpParameters?.queryStringParameters,
    //     },
    //     OAuthParameters: {
    //       AuthorizationEndpoint: props.authParameters?.oAuthParameters?.authorizationEndpoint,
    //       ClientParameters: {
    //         ClientID: props.authParameters?.oAuthParameters?.clientParameters.clientID,
    //         ClientSecret: props.authParameters?.oAuthParameters?.clientParameters.clientSecret,
    //       },
    //       HttpMethod: props.authParameters?.oAuthParameters?.httpMethod,
    //       OAuthHttpParameters: {
    //         BodyParameters: props.authParameters?.oAuthParameters?.oAuthHttpParameters?.bodyParameters,
    //         HeaderParameters: props.authParameters?.oAuthParameters?.oAuthHttpParameters?.headerParameters,
    //         QueryStringParameters: props.authParameters?.oAuthParameters?.oAuthHttpParameters?.queryStringParameters,
    //       },
    //     },
    // }
    let connection = new CfnConnection(this, 'Connection', {
      authorizationType: props.authorizationType,
      authParameters,
      description: props.description,
      name: this.physicalName,
    });

    this.connectionName = connection.name || 'Connection';
    this.connectionArn = connection.attrArn;
    this.connectionSecretArn = connection.attrSecretArn;
  }

  /**
   * Creates a unique name for the Api Destination. The generated name is the physical ID of the Api Destination.
   */
  private generateUniqueName(): string {
    const name = Names.uniqueId(this).toLowerCase().replace(' ', '-');
    if (name.length <= 21) {
      return name;
    } else {
      return name.substring(0, 15) + nameHash(name);
    }
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
 * Take a hash of the given name.
 *
 * @param name the name to be hashed
 */
function nameHash(name: string): string {
  const md5 = crypto.createHash('sha256').update(name).digest('hex');
  return md5.slice(0, 6);
}

