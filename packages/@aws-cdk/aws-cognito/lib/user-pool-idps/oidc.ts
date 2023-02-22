import { Names, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { UserPoolIdentityProviderProps } from './base';
import { UserPoolIdentityProviderBase } from './private/user-pool-idp-base';
import { CfnUserPoolIdentityProvider } from '../cognito.generated';

/**
 * Properties to initialize UserPoolIdentityProviderOidc
 */
export interface UserPoolIdentityProviderOidcProps extends UserPoolIdentityProviderProps {
  /**
   * The client id
   */
  readonly clientId: string;

  /**
   * The client secret
   */
  readonly clientSecret: string;

  /**
   * Issuer URL
   */
  readonly issuerUrl: string;

  /**
   * The name of the provider
   *
   * @default - the unique ID of the construct
   */
  readonly name?: string;

  /**
   * The OAuth 2.0 scopes that you will request from OpenID Connect. Scopes are
   * groups of OpenID Connect user attributes to exchange with your app.
   *
   * @default ['openid']
   */
  readonly scopes?: string[];

  /**
   * Identifiers
   *
   * Identifiers can be used to redirect users to the correct IdP in multitenant apps.
   *
   * @default - no identifiers used
   */
  readonly identifiers?: string[]

  /**
   * The method to use to request attributes
   *
   * @default OidcAttributeRequestMethod.GET
   */
  readonly attributeRequestMethod?: OidcAttributeRequestMethod

  /**
   * OpenID connect endpoints
   *
   * @default - auto discovered with issuer URL
   */
  readonly endpoints?: OidcEndpoints;
}

/**
 * OpenID Connect endpoints
 */
export interface OidcEndpoints {
  /**
   * Authorization endpoint
   */
  readonly authorization: string;

  /**
    * Token endpoint
    */
  readonly token: string;

  /**
    * UserInfo endpoint
    */
  readonly userInfo: string;

  /**
    * Jwks_uri endpoint
   */
  readonly jwksUri: string;
}

/**
 * The method to use to request attributes
 */
export enum OidcAttributeRequestMethod {
  /** GET */
  GET = 'GET',
  /** POST */
  POST = 'POST'
}

/**
 * Represents a identity provider that integrates with OpenID Connect
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
export class UserPoolIdentityProviderOidc extends UserPoolIdentityProviderBase {
  public readonly providerName: string;

  constructor(scope: Construct, id: string, props: UserPoolIdentityProviderOidcProps) {
    super(scope, id, props);

    if (props.name && !Token.isUnresolved(props.name) && (props.name.length < 3 || props.name.length > 32)) {
      throw new Error(`Expected provider name to be between 3 and 32 characters, received ${props.name} (${props.name.length} characters)`);
    }

    const scopes = props.scopes ?? ['openid'];

    const resource = new CfnUserPoolIdentityProvider(this, 'Resource', {
      userPoolId: props.userPool.userPoolId,
      providerName: this.getProviderName(props.name),
      providerType: 'OIDC',
      providerDetails: {
        client_id: props.clientId,
        client_secret: props.clientSecret,
        authorize_scopes: scopes.join(' '),
        attributes_request_method: props.attributeRequestMethod ?? OidcAttributeRequestMethod.GET,
        oidc_issuer: props.issuerUrl,
        authorize_url: props.endpoints?.authorization,
        token_url: props.endpoints?.token,
        attributes_url: props.endpoints?.userInfo,
        jwks_uri: props.endpoints?.jwksUri,
      },
      idpIdentifiers: props.identifiers,
      attributeMapping: super.configureAttributeMapping(),
    });

    this.providerName = super.getResourceNameAttribute(resource.ref);
  }

  private getProviderName(name?: string): string {
    if (name) {
      if (!Token.isUnresolved(name) && (name.length < 3 || name.length > 32)) {
        throw new Error(`Expected provider name to be between 3 and 32 characters, received ${name} (${name.length} characters)`);
      }
      return name;
    }

    const uniqueId = Names.uniqueId(this);

    if (uniqueId.length < 3) {
      return `${uniqueId}oidc`;
    }

    if (uniqueId.length > 32) {
      return uniqueId.substring(0, 16) + uniqueId.substring(uniqueId.length - 16);
    }
    return uniqueId;
  }
}
