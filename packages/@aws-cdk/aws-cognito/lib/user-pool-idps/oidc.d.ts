import { Construct } from 'constructs';
import { UserPoolIdentityProviderProps } from './base';
import { UserPoolIdentityProviderBase } from './private/user-pool-idp-base';
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
    readonly identifiers?: string[];
    /**
     * The method to use to request attributes
     *
     * @default OidcAttributeRequestMethod.GET
     */
    readonly attributeRequestMethod?: OidcAttributeRequestMethod;
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
export declare enum OidcAttributeRequestMethod {
    /** GET */
    GET = "GET",
    /** POST */
    POST = "POST"
}
/**
 * Represents a identity provider that integrates with OpenID Connect
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
export declare class UserPoolIdentityProviderOidc extends UserPoolIdentityProviderBase {
    readonly providerName: string;
    constructor(scope: Construct, id: string, props: UserPoolIdentityProviderOidcProps);
    private getProviderName;
}
