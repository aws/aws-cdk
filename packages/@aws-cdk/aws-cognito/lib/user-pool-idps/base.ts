import { Construct, Resource } from '@aws-cdk/core';
import { IUserPool } from '../user-pool';
import { IUserPoolIdentityProvider } from '../user-pool-idp';

/**
 * Properties to create a new instance of UserPoolIdentityProvider
 */
export interface UserPoolIdentityProviderProps {
  /**
   * The user pool to which this construct provides identities.
   */
  readonly userPool: IUserPool;
}

/**
 * Options to integrate with the various social identity providers.
 */
export abstract class UserPoolIdentityProviderBase extends Resource implements IUserPoolIdentityProvider {
  public abstract readonly providerName: string;

  public constructor(scope: Construct, id: string, props: UserPoolIdentityProviderProps) {
    super(scope, id);
    props.userPool.registerIdentityProvider(this);
  }
}