import { IResource } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Represents a UserPoolIdentityProvider
 */
export interface IUserPoolIdentityProvider extends IResource {
    /**
     * The primary identifier of this identity provider
     * @attribute
     */
    readonly providerName: string;
}
/**
 * User pool third-party identity providers
 */
export declare class UserPoolIdentityProvider {
    /**
     * Import an existing UserPoolIdentityProvider
     */
    static fromProviderName(scope: Construct, id: string, providerName: string): IUserPoolIdentityProvider;
    private constructor();
}
