import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnConnection } from './events.generated';

export interface ApiKeyAuthParameters {
  /**
   * The name of the API key to use for authorization.
   */
  readonly ApiKeyName: string;

  /**
   * The value for the API key to use for authorization.
   */
  readonly ApiKeyValue: string;
}

export interface BasicAuthParameters {
  /**
   * The password associated with the user name to use for Basic authorization.
   */
  readonly Password: string;

  /**
   * The user name to use for Basic authorization.
   */
  readonly Username: string;
}

export interface ClientParameters {
  /**
   * The client secret associated with the client ID to use for OAuth authorization for the connection.
   */
  readonly ClientID: string;

  /**
   * The client ID to use for OAuth authorization for the connection.
   */
  readonly ClientSecret: string;
}

export interface Parameter {
  /**
   * Specifies whether the value is a secret.
   * @default - True
   */
  readonly IsValueSecret?: string;

  /**
   * The key for the parameter.
   */
  readonly Key: string;

  /**
   * The value associated with the key for the parameter.
   */
  readonly Value: string;
}

export interface HttpParameters {
  /**
   * The body that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
   */
  readonly BodyParameters?: Parameter[];

  /**
   * The headers that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
   */
  readonly HeaderParameters?: Parameter[];

  /**
   * The query string keys/values that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
   */
  readonly QueryStringParameters?: Parameter[];
}

export interface OAuthParameters {
  /**
   * The URL to the authorization endpoint when OAuth is specified as the authorization type.
   */
  readonly AuthorizationEndpoint: string;

  /**
   * Contains the client parameters for OAuth authorization.
   */
  readonly ClientParameters: ClientParameters;

  /**
   * The method to use for the authorization request.
   */
  readonly HttpMethod: string;

  /**
   * Contains the OAuth authorization parameters to use for the connection.
   */
  readonly OAuthHttpParameters?: HttpParameters;
}

export interface AuthParameters {
  /**
   * Contains the API key authorization parameters to use for the connection.
   * @default - None
   */
  readonly ApiKeyAuthParameters?: ApiKeyAuthParameters;

  /**
   * Contains the Basic authorization parameters to use for the connection.
   * @default - None
   */
  readonly BasicAuthParameters?: BasicAuthParameters;

  /**
   * Contains the API key authorization parameters to use for the connection.
   * @default - None
   */
  readonly InvocationHttpParameters?: HttpParameters;

  /**
   * Contains the OAuth authorization parameters to use for the connection.
   * @default - None
   */
  readonly OAuthParameters?: OAuthParameters;
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

    this.connectionArn = connection.attrArn;
    this.connectionSecretArn = connection.attrSecretArn;
  }
}
