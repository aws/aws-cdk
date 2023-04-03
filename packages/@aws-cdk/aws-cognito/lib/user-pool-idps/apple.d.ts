import { Construct } from 'constructs';
import { UserPoolIdentityProviderProps } from './base';
import { UserPoolIdentityProviderBase } from './private/user-pool-idp-base';
/**
 * Properties to initialize UserPoolAppleIdentityProvider
 */
export interface UserPoolIdentityProviderAppleProps extends UserPoolIdentityProviderProps {
    /**
     * The client id recognized by Apple APIs.
     * @see https://developer.apple.com/documentation/sign_in_with_apple/clientconfigi/3230948-clientid
     */
    readonly clientId: string;
    /**
     * The teamId for Apple APIs to authenticate the client.
     */
    readonly teamId: string;
    /**
     * The keyId (of the same key, which content has to be later supplied as `privateKey`) for Apple APIs to authenticate the client.
     */
    readonly keyId: string;
    /**
     * The privateKey content for Apple APIs to authenticate the client.
     */
    readonly privateKey: string;
    /**
     * The list of apple permissions to obtain for getting access to the apple profile
     * @see https://developer.apple.com/documentation/sign_in_with_apple/clientconfigi/3230955-scope
     * @default [ name ]
     */
    readonly scopes?: string[];
}
/**
 * Represents a identity provider that integrates with 'Apple'
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
export declare class UserPoolIdentityProviderApple extends UserPoolIdentityProviderBase {
    readonly providerName: string;
    constructor(scope: Construct, id: string, props: UserPoolIdentityProviderAppleProps);
}
