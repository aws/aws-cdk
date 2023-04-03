import { Construct } from 'constructs';
import { UserPoolIdentityProviderProps } from './base';
import { UserPoolIdentityProviderBase } from './private/user-pool-idp-base';
/**
 * Properties to initialize UserPoolFacebookIdentityProvider
 */
export interface UserPoolIdentityProviderFacebookProps extends UserPoolIdentityProviderProps {
    /**
     * The client id recognized by Facebook APIs.
     */
    readonly clientId: string;
    /**
     * The client secret to be accompanied with clientUd for Facebook to authenticate the client.
     * @see https://developers.facebook.com/docs/facebook-login/security#appsecret
     */
    readonly clientSecret: string;
    /**
     * The list of facebook permissions to obtain for getting access to the Facebook profile.
     * @see https://developers.facebook.com/docs/facebook-login/permissions
     * @default [ public_profile ]
     */
    readonly scopes?: string[];
    /**
     * The Facebook API version to use
     * @default - to the oldest version supported by Facebook
     */
    readonly apiVersion?: string;
}
/**
 * Represents a identity provider that integrates with 'Facebook Login'
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
export declare class UserPoolIdentityProviderFacebook extends UserPoolIdentityProviderBase {
    readonly providerName: string;
    constructor(scope: Construct, id: string, props: UserPoolIdentityProviderFacebookProps);
}
