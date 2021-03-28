import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnConnection } from './events.generated';

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
  readonly oauthHttpParameters?: HttpParameters;
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
  readonly oauthParameters?: OAuthParameters;
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
  readonly authorizationType: string;

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
  readonly name: string;
}


/**
 * The event connection properties
 */
export interface ConnectionProps extends BaseConnectionProps {

}

/**
 * Define an EventBridge Connection
 *
 * @resource AWS::Events::Connection
 */
export class Connection extends Resource {
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
    super(scope, id, { physicalName: props.name });

    let connection = new CfnConnection(this, 'Connection', {
      authorizationType: props.authorizationType,
      authParameters: props.authParameters,
      description: props.description,
      name: this.physicalName,
    });

    this.connectionName = connection.name || 'Connection';
    this.connectionArn = connection.attrArn;
    this.connectionSecretArn = connection.attrSecretArn;
  }
}
