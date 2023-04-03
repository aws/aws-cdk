import { SecretValue } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { UserPoolIdentityProviderProps } from './base';
import { UserPoolIdentityProviderBase } from './private/user-pool-idp-base';
/**
 * Properties to initialize UserPoolGoogleIdentityProvider
 */
export interface UserPoolIdentityProviderGoogleProps extends UserPoolIdentityProviderProps {
    /**
     * The client id recognized by Google APIs.
     * @see https://developers.google.com/identity/sign-in/web/sign-in#specify_your_apps_client_id
     */
    readonly clientId: string;
    /**
     * The client secret to be accompanied with clientId for Google APIs to authenticate the client.
     * @see https://developers.google.com/identity/sign-in/web/sign-in
     * @default none
     * @deprecated use clientSecretValue instead
     */
    readonly clientSecret?: string;
    /**
     * The client secret to be accompanied with clientId for Google APIs to authenticate the client as SecretValue
     * @see https://developers.google.com/identity/sign-in/web/sign-in
     * @default none
     */
    readonly clientSecretValue?: SecretValue;
    /**
     * The list of google permissions to obtain for getting access to the google profile
     * @see https://developers.google.com/identity/sign-in/web/sign-in
     * @default [ profile ]
     */
    readonly scopes?: string[];
}
/**
 * Represents a identity provider that integrates with 'Google'
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
export declare class UserPoolIdentityProviderGoogle extends UserPoolIdentityProviderBase {
    readonly providerName: string;
    constructor(scope: Construct, id: string, props: UserPoolIdentityProviderGoogleProps);
}
