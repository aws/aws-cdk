import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IUserPoolIdentityProvider } from '../../user-pool-idp';
import { UserPoolIdentityProviderProps } from '../base';
/**
 * Options to integrate with the various social identity providers.
 *
 * @internal
 */
export declare abstract class UserPoolIdentityProviderBase extends Resource implements IUserPoolIdentityProvider {
    private readonly props;
    abstract readonly providerName: string;
    constructor(scope: Construct, id: string, props: UserPoolIdentityProviderProps);
    protected configureAttributeMapping(): any;
}
